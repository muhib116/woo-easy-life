<?php

namespace WooEasyLife\API\Admin;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class NewOrderNotificationAPI extends WP_REST_Controller
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('woocommerce_new_order', function ($order_id) {
            set_transient('new_order_notification', true, 60 * 5); // Notification active for 5 minutes
        });
    }

    /**
     * Register REST API routes.
     */
    public function register_routes()
    {
        register_rest_route(
            __API_NAMESPACE,
            '/check-new-orders-for-notification',
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'check_new_orders'],
                'permission_callback' => api_permission_check(),
            ]
        );
    }

    /**
     * Check for new orders with long polling.
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function check_new_orders(WP_REST_Request $request)
    {
        $timeout = 15; // Long polling timeout in seconds
        $interval = 1; // Check interval in seconds
        $waited = 0;

        while ($waited < $timeout) {
            $has_new_notification = get_transient('new_order_notification') ? true : false;
            
            if ($has_new_notification) {
                delete_transient('new_order_notification');
                return new WP_REST_Response([
                    'status' => 'success',
                    'data'   => [
                        'has_new_orders' => true
                    ],
                ], 200);
            }

            sleep($interval);
            $waited += $interval;
        }

        // Timeout: no new order found
        return new WP_REST_Response([
            'status' => 'success',
            'data'   => [
                'has_new_orders' => false
            ],
        ], 200);
    }
}