// js/device-tracker.js

(function($) {
    'use strict';

    const DEVICE_KEY = 'wel_device_token';
    const COOKIE_EXPIRY_DAYS = 730; // 2 years

    // --- Cookie Utility Functions ---
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/; Secure; SameSite=Lax";
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // --- Core Device Token Logic ---
    const getDeviceToken = async () => {
        let token = getCookie(DEVICE_KEY);

        if (token) {
            return token;
        }

        try {
            if (typeof FingerprintJS === 'undefined') {
                console.error('FingerprintJS library not loaded.');
                return 'fp-load-fail';
            }
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            token = result.visitorId;
            setCookie(DEVICE_KEY, token, COOKIE_EXPIRY_DAYS);
            return token;
        } catch (e) {
            console.error("Fingerprint generation failed:", e);
            token = `fallback-${new Date().getTime()}`;
            setCookie(DEVICE_KEY, token, 1); 
            return token;
        }
    };

    // --- WooCommerce Checkout Integration ---
    const attachDeviceTokenToForm = async () => {
        const $checkoutForm = $('form.checkout');
        const initialToken = await getDeviceToken();
        if (initialToken) {
            $checkoutForm.append('<input type="hidden" name="wel_device_token" value="' + initialToken + '" />');
        }
        $checkoutForm.on('submit', async function(e) {
            const currentToken = await getDeviceToken();
            let $hiddenField = $('[name="wel_device_token"]', this);
            if ($hiddenField.length === 0) {
                e.preventDefault(); 
                $(this).append('<input type="hidden" name="wel_device_token" value="' + currentToken + '" />');
                $(this).off('submit').submit(); 
                return false;
            } 
            if ($hiddenField.val() !== currentToken) {
                $hiddenField.val(currentToken);
            }
            return true;
        });
    };

    // --- Geolocation Integration for Checkout ---
    const attachGeolocationToForm = () => {
        const $checkoutForm = $('form.checkout');

        // Try to get geolocation when the form is ready
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Add or update hidden fields for latitude and longitude
                    let $lat = $checkoutForm.find('[name="customer_latitude"]');
                    let $lng = $checkoutForm.find('[name="customer_longitude"]');
                    if ($lat.length === 0) {
                        $checkoutForm.append('<input type="hidden" name="customer_latitude" value="' + position.coords.latitude + '" />');
                    } else {
                        $lat.val(position.coords.latitude);
                    }
                    if ($lng.length === 0) {
                        $checkoutForm.append('<input type="hidden" name="customer_longitude" value="' + position.coords.longitude + '" />');
                    } else {
                        $lng.val(position.coords.longitude);
                    }
                },
                function(error) {
                    console.warn('Geolocation error:', error);
                    // Optionally handle error or fallback here
                }
            );
        }
        // Optionally, you can also update these fields on every submit if you want the latest location
    };

    // Run the functions when the document is ready and the form is available
    $(document).ready(function() {
        attachDeviceTokenToForm();
        attachGeolocationToForm();
    });

})(jQuery);