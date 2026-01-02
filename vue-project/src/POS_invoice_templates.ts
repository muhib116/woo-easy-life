export const sticker_3x2Paper = (order: any, invoice_logo: string, qrUrl: string, formatInvoice: any) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                *, ::before, ::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                @page {
                    size: 3in 2in landscape;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <div style="
                width: 2.78in; 
                height: 1.8in; 
                padding: 4px 4px; 
                border-radius: 4px;
                border: 1px solid;
                font-family: poppins, sans-serif;
                font-size: 14px;
                display: flex; 
                align-items: center;
                justify-content: space-between;
                margin-left: 4px;
            ">
                <div style="display: grid; gap: 4px;">
                    <img src="${invoice_logo || 'https://api.wpsalehub.com/app-logo'}" alt="Logo" style="height: 40px; max-width: 130px; object-fit: contain; margin-bottom: 4px;" />
                    <p style="margin:0;"><strong>ID: <span style="font-size: 20px">${order.courier_data.consignment_id}</span></strong></p>
                    <p style="margin:0;"><strong>COD:</strong> ${order.total}${order.currency_symbol}</p>
                    <p style="margin:0; word-break: break-all;"><strong>Name:</strong> ${order.customer_name}</p>
                    <p style="margin:0;"><strong>Phone:</strong> ${order.billing_address.phone}</p>
                </div>
                <div>
                    <img src="${qrUrl}" alt="QR Code" style="width: 100px; height: 100px;margin-right: -8px;margin-top: -8px;margin-bottom: -8px;" />
                </div>
            </div>
        </body>
    </html>
    `
}

export const sticker_3x2ClassicPaper = (order: any, invoice_logo: string, qrUrl: string, formatInvoice: any) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>3x2 Sticker Label Design</title>
            
            <style>
                *, ::before, ::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #fff;
                    padding: 0;
                }

                /* 3x2 Inch Sticker Container */
                .sticker-card {
                    width: 3in; 
                    height: 2in;
                    background: #fff;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    font-family: poppins, sans-serif;
                }

                /* Top Brand Bar */
                .top-banner {
                    background: #000;
                    color: #fff;
                    padding: 3px 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                }

                .banner-text {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                }

                /* Header Layout */
                .label-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 10px;
                    background: #fff;
                    border-bottom: 1.5px solid #000;
                    flex-shrink: 0;
                }

                .logo-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                }

                .logo {
                    height: 32px; 
                    max-width: 80px;
                    object-fit: contain;
                    display: block;
                }

                /* Boxy Table */
                .boxy-table {
                    border-collapse: collapse;
                    width: 120px; 
                    flex-shrink: 0;
                    border: 1.5px solid #000;
                }

                .boxy-table tr :is(td, th) {
                    border: 1px solid #000;
                    font-size: 10px;
                }

                .boxy-table td {
                    padding: 2px 5px; 
                    text-align: center;
                    font-weight: 600;
                }

                .header-cell {
                    background-color: #eee;
                    color: #000;
                    text-transform: uppercase;
                    font-size: 14px;
                    letter-spacing: 0.3px;
                    text-align: left !important;
                }

                .value-cell {
                    background-color: #fff;
                    text-align: right !important;
                    font-size: 14px;
                }

                /* Main Grid for 3x2 Layout - Adjusted for larger QR */
                .main-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr; 
                    flex-grow: 1;
                    align-items: stretch;
                }

                /* Info Section */
                .content-body {
                    padding: 5px 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    border-right: 1.5px dashed #000;
                    justify-content: center;
                }

                .id-badge {
                    display: inline-block;
                    background: #000;
                    color: #fff;
                    padding: 2px 5px;
                    font-size: 10px;
                    margin-bottom: 4px;
                    border-radius: 4px;
                    text-transform: capitalize;
                }

                .id-number {
                    font-size: 18px;
                    font-weight: 800;
                    display: block;
                    margin-bottom: 6px;
                    letter-spacing: -0.5px;
                    line-height: 1;
                    color: #000;
                }

                .details-grid {
                    display: grid;
                    gap: 4px;
                    width: 100%;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .detail-label {
                    font-weight: 400;
                    color: #555;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.5px;
                    margin-bottom: 0px;
                }

                .recipient-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #000;
                    line-height: 1.1;
                }

                .contact-number {
                    font-size: 13px;
                    font-weight: 500;
                    color: #000;
                }

                /* QR Code Side Area - Enlarged */
                .qr-container {
                    text-align: center;
                    padding: 4px;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .qr-code {
                    width: 100px; /* Increased from 70px */
                    height: 100px; /* Increased from 70px */
                    display: block;
                    margin: 0 auto;
                }

                .scan-text {
                    font-size: 13px;
                    text-transform: uppercase;
                    color: #000;
                    margin-top: 3px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }

                /* Print optimization */
                @media print {
                    body { background: none; }
                    .sticker-card { box-shadow: none; width: 3in; height: 2in; }
                }
            </style>
        </head>
        <body>

            <div class="sticker-card">
                <!-- Top Black Bar -->
                <div class="top-banner">
                    <span class="banner-text">Priority Shipping</span>
                </div>

                <!-- Header: Logo & Table -->
                <div class="label-header">
                    <div class="logo-container">
                        <img src="${invoice_logo || 'https://api.wpsalehub.com/app-logo'}" alt="Steadfast Logo" class="logo" />
                    </div>
                    
                    <table class="boxy-table">
                        <tr>
                            <td class="header-cell">Invoice</td>
                            <td class="value-cell">${formatInvoice(order.id)}</td>
                        </tr>
                        <tr>
                            <td class="header-cell">COD Amt</td>
                            <td class="value-cell">${order.total}${order.currency_symbol}</td>
                        </tr>
                    </table>
                </div>

                <!-- Main Body Grid for Horizontal Space -->
                <div class="main-grid">
                    <!-- Info Section -->
                    <div class="content-body">
                        <span class="id-badge">CONSIGNMENT ID</span>
                        <span class="id-number">${order.courier_data.consignment_id}</span>
                        
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Deliver To</span>
                                <span class="recipient-name">${order.customer_name}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Phone</span>
                                <span class="contact-number">${order.billing_address.phone}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Side QR Code Area -->
                    <div class="qr-container">
                        <img src="${qrUrl}" alt="QR Code" class="qr-code" />
                        <div class="scan-text">Scan QR Code</div>
                    </div>
                </div>
            </div>

        </body>
    </html>
    `
}

export const sticker_3x3Paper = (order: any, invoice_logo: string, qrUrl: string, formatInvoice: any) => {
    // Fix: Always include www. at the start of the domain name if not present
    const websiteUrl = (() => {
        let url = location.hostname;
        if (!/^www\./i.test(url)) {
            url = 'www.' + url;
        }
        return url;
    })();//include www. at the start of domain name
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>3x3 Sticker Label Design</title>
            
            <style>
                *, ::before, ::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #fff;
                    padding: 0;
                }

                /* 3x3 Inch Sticker Container */
                .sticker-card {
                    width: 3in; 
                    height: 3in;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    font-family: poppins, sans-serif;
                }

                /* Top Brand Bar */
                .top-banner {
                    background: #000;
                    color: #fff;
                    padding: 5px 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                }

                .banner-text {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                }

                /* Header Layout */
                .label-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 10px;
                    background: #fff;
                    border-bottom: 1.5px solid #000;
                    flex-shrink: 0;
                }

                .logo-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                }

                .logo {
                    height: 40px; /* Adjusted for the Steadfast SVG aspect ratio */
                    max-width: 90px;
                    object-fit: contain;
                    display: block;
                }

                /* Boxy Table */
                .boxy-table {
                    border-collapse: collapse;
                    width: 130px; 
                    flex-shrink: 0;
                    border: 1.5px solid #000;
                }

                .boxy-table tr :is(td, th) {
                    border: 1px solid #000;
                    font-size: 10px;
                }

                .boxy-table td {
                    padding: 3px 6px; 
                    text-align: center;
                    font-weight: 600;
                }

                .header-cell {
                    background-color: #eee;
                    color: #000;
                    text-transform: uppercase;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                    text-align: left !important;
                }

                .value-cell {
                    background-color: #fff;
                    text-align: right !important;
                    font-size: 13px;
                    font-weight: 400;
                }

                /* Info Section - Centered */
                .info-section {
                    display: flex;
                    align-items: center;
                }
                .content-body {
                    padding: 10px 10px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    justify-content: center;
                }

                .id-badge {
                    display: inline-block;
                    background: #000;
                    color: #fff;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: 400;
                    margin-top: 4px;
                    margin-bottom: 4px;
                    border-radius: 2px;
                }

                .id-number {
                    font-size: 22px;
                    font-weight: 800;
                    display: block;
                    margin-bottom: 6px;
                    letter-spacing: -0.5px;
                    line-height: 1;
                    color: #000;
                }

                .details-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    width: 100%;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .detail-label {
                    font-weight: 500;
                    color: #555;
                    text-transform: uppercase;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }

                .recipient-name {
                    font-size: 16px;
                    font-weight: 500;
                    color: #000;
                    line-height: 1.1;
                }

                .contact-number {
                    font-size: 16px;
                    font-weight: 500;
                    color: #000;
                }

                /* QR Code Footer */
                .qr-container {
                    text-align: center;
                    flex-shrink: 0;
                }

                .qr-code {
                    width: 100px; 
                    height: 100px; 
                    display: block;
                    margin: 0 auto;
                }

                .scan-text {
                    background-color: #000;
                    font-size: 13px;
                    color: #fff;
                    margin-top: 4px;
                    padding: 2px 6px;
                    width: fit-content;
                    border-radius: 4px;
                    margin-left: auto;
                    margin-right: auto;
                    display: block;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }

                .footer {
                    padding: 8px 4px;
                    text-align: center;
                    font-size: 14px;
                    color: #000;
                    border-top: 1.5px solid #000;
                    flex-shrink: 0;
                    margin-top: auto;
                }

                /* Print optimization */
                @media print {
                    body { background: none; }
                    .sticker-card { box-shadow: none; width: 3in; height: 3in; }
                }
            </style>
        </head>
        <body>

            <div class="sticker-card">
                <!-- Top Black Bar -->
                <div class="top-banner">
                    <span class="banner-text">Priority Shipping</span>
                </div>

                <!-- Header: Logo & Table -->
                <div class="label-header">
                    <div class="logo-container">
                        <img src="${invoice_logo || 'https://api.wpsalehub.com/app-logo'}" alt="Steadfast Logo" class="logo" />
                    </div>
                    
                    <table class="boxy-table">
                        <tr>
                            <td class="header-cell">Invoice</td>
                            <td class="value-cell">${formatInvoice(order.id)}</td>
                        </tr>
                        <tr>
                            <td class="header-cell">COD Amt</td>
                            <td class="value-cell">${order.total}${order.currency_symbol}</td>
                        </tr>
                    </table>
                </div>

                <!-- Info Section -->
                <div class="info-section">
                    <div class="content-body">
                        <span class="id-badge">CONSIGNMENT ID</span>
                        <span class="id-number">${order.courier_data.consignment_id}</span>
                        
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Deliver To</span>
                                <span class="recipient-name">${order.customer_name}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Phone</span>
                                <span class="contact-number">${order.billing_address.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div class="qr-container">
                        <img src="${qrUrl}" alt="QR Code" class="qr-code" />
                        <div class="scan-text">Scan ID</div>
                    </div>
                </div>
                <footer class="footer">
                    ${websiteUrl}
                </footer>
            </div>

        </body>
    </html>
    `
}