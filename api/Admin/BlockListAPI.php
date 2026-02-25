<?php

namespace WooEasyLife\API\Admin;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;

class BlockListAPI extends WP_REST_Controller {
    private $table_name;

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . __PREFIX . 'block_list';

        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route(__API_NAMESPACE, '/block-list', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_all_blocked_entries'],
                'permission_callback' => api_permission_check(),
            ],
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'create_blocked_entry'],
                'permission_callback' => api_permission_check(),
                'args'                => $this->get_block_list_schema(false),
            ],
        ]);
        register_rest_route(__API_NAMESPACE, '/bulk-entry', [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'create_blocked_entries_in_bulk'],
                'permission_callback' => api_permission_check(), // Adjust permissions as needed
                'args'                => $this->get_bulk_entry_schema(),
            ],
        ]);
        register_rest_route(__API_NAMESPACE, '/block-list/(?P<id>\d+)', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'get_blocked_entry_by_id'],
                'permission_callback' => api_permission_check(),
            ],
            [
                'methods'             => 'PUT',
                'callback'            => [$this, 'update_blocked_entry'],
                'permission_callback' => api_permission_check(),
                'args'                => $this->get_block_list_schema(true),
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [$this, 'delete_blocked_entry'],
                'permission_callback' => api_permission_check(),
            ],
        ]);
        register_rest_route(__API_NAMESPACE, '/block-list/export', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'export_blocked_entries'],
                'permission_callback' => api_permission_check(),
            ],
        ]);
        register_rest_route(__API_NAMESPACE, '/block-list/import', [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'import_blocked_entries'],
                'permission_callback' => api_permission_check(),
            ],
        ]);
        
    }

    /**
     * Get all blocked entries with pagination support
     */
    public function get_all_blocked_entries(WP_REST_Request $request) {
        global $wpdb;

        // Get pagination parameters
        $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
        $per_page = $request->get_param('per_page') ? intval($request->get_param('per_page')) : 10;
        
        // Validate pagination parameters
        if ($page < 1) $page = 1;
        if ($per_page < 1) $per_page = 10;
        if ($per_page > 100) $per_page = 100; // Max 100 items per page

        // Calculate offset
        $offset = ($page - 1) * $per_page;

        // Get total count
        $total = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name}");

        // Get paginated results
        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$this->table_name} ORDER BY id DESC LIMIT %d OFFSET %d",
                $per_page,
                $offset
            ),
            ARRAY_A
        );

        if (empty($results)) {
            return new WP_REST_Response([
                'status'  => 'success',
                'message' => 'No blocked entries found.',
                'data'    => [],
                'pagination' => [
                    'total'       => 0,
                    'per_page'    => $per_page,
                    'current_page' => $page,
                    'total_pages' => 0,
                ],
            ], 200);
        }

        // Calculate total pages
        $total_pages = ceil($total / $per_page);

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blocked entries retrieved successfully.',
            'data'    => $results,
            'pagination' => [
                'total'       => (int)$total,
                'per_page'    => $per_page,
                'current_page' => $page,
                'total_pages' => (int)$total_pages,
            ],
        ], 200);
    }

    /**
     * Create a new blocked entry
     */
    public function create_blocked_entry(WP_REST_Request $request) {
        global $wpdb;

        $customer_id = sanitize_text_field($request->get_param('customer_id'));
        $type = sanitize_text_field($request->get_param('type'));
        $ip_phone_email_or_device = sanitize_text_field($request->get_param('ip_phone_email_or_device'));
        $created_at = current_time('mysql');
        $updated_at = current_time('mysql');

        // Check for uniqueness
        $existing_record = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$this->table_name} WHERE type = %s AND ip_phone_or_email = %s",
                $type,
                $ip_phone_email_or_device
            ),
            ARRAY_A
        );


        // update customer data start
        $this->update_customer_data($customer_id);
        // update customer data end


        if ($existing_record) {

            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'This entry already exists in the block list.',
            ], 400);
        }

        // Insert the new blocked entry
        $inserted = $wpdb->insert(
            $this->table_name,
            [
                'customer_id' => $customer_id,
                'type'        => $type,
                'ip_phone_or_email' => $ip_phone_email_or_device,
                'created_at'  => $created_at,
                'updated_at'  => $updated_at,
            ],
            [
                '%s',
                '%s',
                '%s',
                '%s',
                '%s',
            ]
        );

        if ($inserted === false) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'Failed to create blocked entry.',
            ], 500);
        }

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blocked entry created successfully.',
            'data'    => [
                'id'          => $wpdb->insert_id,
                'type'        => $type,
                'ip_phone_or_email' => $ip_phone_email_or_device,
                'created_at'  => $created_at,
                'updated_at'  => $updated_at,
            ],
        ], 201);
    }

    /**
     * Create new blocked entries in bulk
     */
    public function create_blocked_entries_in_bulk(WP_REST_Request $request) {
        global $wpdb;
        $payload = $request->get_json_params(); // Get the JSON payload

        if (!is_array($payload) || empty($payload)) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'Invalid or empty payload.',
            ], 400);
        }

        $responses = [];

        foreach ($payload as $entry) {
            if (!isset($entry['type'], $entry['ip_phone_email_or_device'])) {
                $responses[] = [
                    'status'  => 'error',
                    'message' => 'Missing type or ip_phone_email_or_device in entry.',
                    'entry'   => $entry,
                ];
                continue;
            }

            $customer_id = sanitize_text_field($entry['customer_id']);
            $type = sanitize_text_field($entry['type']);
            $ip_phone_email_or_device = sanitize_text_field($entry['ip_phone_email_or_device']);
            $created_at = current_time('mysql');
            $updated_at = current_time('mysql');

            if(empty($type) || empty($ip_phone_email_or_device)){
                $responses[] = [
                    'status'  => 'error',
                    'message' => 'Type, IP, Phone, Email or Device Token cannot be empty.',
                    'entry'   => $entry,
                ];
                continue;
            }

            // Check for uniqueness
            $existing_record = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$this->table_name} WHERE type = %s AND ip_phone_or_email = %s",
                    $type,
                    $ip_phone_email_or_device
                ),
                ARRAY_A
            );


            // update customer data start
            $this->update_customer_data($customer_id);
            // update customer data end


            if ($existing_record) {
                $responses[] = [
                    'status'  => 'error',
                    'message' => 'This entry already exists in the block list.',
                    'entry'   => $entry,
                ];
                continue;
            }

            // Insert the new blocked entry
            $inserted = $wpdb->insert(
                $this->table_name,
                [
                    'customer_id'        => $customer_id,
                    'type'        => $type,
                    'ip_phone_or_email' => $ip_phone_email_or_device,
                    'created_at'  => $created_at,
                    'updated_at'  => $updated_at,
                ],
                [
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                ]
            );

            if ($inserted === false) {
                $responses[] = [
                    'status'  => 'error',
                    'message' => 'Failed to create blocked entry.',
                    'entry'   => $entry,
                ];
                continue;
            }

            $responses[] = [
                'status'  => 'success',
                'message' => 'Blocked entry created successfully.',
                'data'    => [
                    'id'          => $wpdb->insert_id,
                    'customer_id' => $customer_id,
                    'type'        => $type,
                    'ip_phone_or_email' => $ip_phone_email_or_device,
                    'created_at'  => $created_at,
                    'updated_at'  => $updated_at,
                ],
            ];
        }

        return new WP_REST_Response($responses, 200);
    }


    /**
     * Get a blocked entry by ID
     */
    public function get_blocked_entry_by_id(WP_REST_Request $request) {
        global $wpdb;

        $id = $request->get_param('id');
        $result = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM {$this->table_name} WHERE id = %d", $id),
            ARRAY_A
        );

        if (empty($result)) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'Blocked entry not found.',
            ], 404);
        }

        $customer_id = $result['customer_id'];
        // update customer data start
        $this->update_customer_data($customer_id);
        // update customer data end

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blocked entry retrieved successfully.',
            'data'    => $result,
        ], 200);
    }

    /**
     * Update a blocked entry by ID
     */
    public function update_blocked_entry(WP_REST_Request $request) {
        global $wpdb;

        $id = $request->get_param('id');
        $type = sanitize_text_field($request->get_param('type'));
        $ip_phone_email_or_device = sanitize_text_field($request->get_param('ip_phone_email_or_device'));
        $updated_at = current_time('mysql');

        // Check for unique combination of type and ip_phone_email_or_device
        $existing_entry = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT id FROM {$this->table_name} WHERE type = %s AND ip_phone_or_email = %s AND id != %d",
                $type,
                $ip_phone_email_or_device,
                $id
            )
        );

        if ($existing_entry) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'An entry with the same type and value already exists.',
            ], 400);
        }

        $updated = $wpdb->update(
            $this->table_name,
            [
                'type'        => $type,
                'ip_phone_or_email' => $ip_phone_email_or_device,
                'updated_at'  => $updated_at,
            ],
            ['id' => $id],
            [
                '%s',
                '%s',
                '%s',
            ],
            ['%d']
        );

        if ($updated === false) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'Failed to update blocked entry.',
            ], 500);
        }

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blocked entry updated successfully.',
            'data'    => [
                'id'          => $id,
                'type'        => $type,
                'ip_phone_or_email' => $ip_phone_email_or_device,
                'updated_at'  => $updated_at,
            ],
        ], 200);
    }

    /**
     * Delete a blocked entry by ID
     */
    public function delete_blocked_entry(WP_REST_Request $request) {
        global $wpdb;

        $id = $request->get_param('id');
        $customer_id = $this->get_blocked_customer_id($id);

        $deleted = $wpdb->delete(
            $this->table_name,
            ['id' => $id],
            ['%d']
        );

        if ($deleted === false) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'Failed to delete blocked entry.',
            ], 500);
        }

        // update customer data start
        $this->update_customer_data($customer_id);
        // update customer data end

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blocked entry deleted successfully.',
        ], 200);
    }

    private function update_customer_data($customer_id=null) {
        if($customer_id){
            $customerHandler = new \WooEasyLife\Frontend\CustomerHandler();
            return $customerHandler->recalculate_customer_data($customer_id);
        }
    }

    private function get_blocked_customer_id($id) {
        global $wpdb;
        // Fetch customer_id from the table using the provided ID
        $customer_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT customer_id FROM {$this->table_name} WHERE id = %d LIMIT 1",
                $id
            )
        );
    
        return $customer_id ?: null; // Return null if no record found
    }
    

    /**
     * Schema for block list input validation
     */
    private function get_block_list_schema($require_id = false) {
        $schema = [
            'customer_id' => [
                'required'    => true,
                'type'        => 'string',
                'description' => 'Type of the blocked entry custom customer data table id.',
            ],
            'type' => [
                'required'    => true,
                'type'        => 'string',
                'enum'        => ['ip', 'phone_number'],
                'description' => 'Type of the blocked entry (ip or phone_number).',
            ],
            'ip_phone_or_email' => [
                'required'    => true,
                'type'        => 'string',
                'description' => 'IP address or phone number to block.',
            ],
        ];

        if ($require_id) {
            $schema['id'] = [
                'required'    => true,
                'type'        => 'integer',
                'description' => 'Unique identifier for the blocked entry.',
            ];
        }

        return $schema;
    }
    private function get_bulk_entry_schema() {
        return [
            [
                'type'       => 'object',
                'properties' => [
                    'type' => [
                        'required'    => true,
                        'type'        => 'string',
                        'enum'        => ['phone_number', 'email', 'ip', 'device_token'],
                        'description' => 'Type of entry to block (phone_number or ip).',
                    ],
                    'ip_phone_email_or_device' => [
                        'required'    => true,
                        'type'        => 'string',
                        'description' => 'The phone number, email, device or IP address to block.',
                    ],
                ],
            ]
        ];
    }

    /**
     * Export all blocked entries as CSV
     * 
     * Returns CSV with headers: Phone/Email/IP/Device,Type,Blocked At,Customer ID
     * Each row contains: ip_phone_or_email,type,created_at,customer_id
     */
    public function export_blocked_entries() {
        global $wpdb;

        $results = $wpdb->get_results("SELECT id, customer_id, type, ip_phone_or_email, created_at, updated_at FROM {$this->table_name} ORDER BY id DESC", ARRAY_A);

        if (empty($results)) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'No data to export.',
            ], 400);
        }

        // Prepare CSV data with proper headers matching database fields
        $csv_data = [];
        $csv_data[] = 'id,customer_id,type,ip_phone_or_email,created_at,updated_at'; // CSV Header

        foreach ($results as $row) {
            $id = $row['id'] ?? '';
            $customer_id = $row['customer_id'] ?? '';
            $type = $row['type'] ?? '';
            $ip_phone_or_email = $row['ip_phone_or_email'] ?? '';
            $created_at = $row['created_at'] ?? '';
            $updated_at = $row['updated_at'] ?? '';

            // Escape commas and quotes in CSV
            $id = $this->escape_csv_field($id);
            $customer_id = $this->escape_csv_field($customer_id);
            $type = $this->escape_csv_field($type);
            $ip_phone_or_email = $this->escape_csv_field($ip_phone_or_email);
            $created_at = $this->escape_csv_field($created_at);
            $updated_at = $this->escape_csv_field($updated_at);

            $csv_data[] = "{$id},{$customer_id},{$type},{$ip_phone_or_email},{$created_at},{$updated_at}";
        }

        $csv_content = implode("\n", $csv_data);

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => 'Blacklist exported successfully.',
            'data'    => $csv_content,
            'filename' => 'blacklist_export_' . current_time('timestamp') . '.csv',
            'count'   => count($results),
        ], 200);
    }

    /**
     * Import blocked entries from CSV data
     * 
     * Expected CSV format (matching database fields):
     * id,customer_id,type,ip_phone_or_email,created_at,updated_at
     * 1,0,email,xakequnyg@mailinator.com,2026-02-26 03:52:14,2026-02-26 03:52:14
     * 2,0,ip,::1,2026-02-26 03:52:14,2026-02-26 03:52:14
     */
    public function import_blocked_entries(WP_REST_Request $request) {
        global $wpdb;

        $csv_content = $request->get_param('csv_content');

        if (empty($csv_content)) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'CSV content is empty.',
            ], 400);
        }

        $lines = explode("\n", $csv_content);

        if (count($lines) < 2) {
            return new WP_REST_Response([
                'status'  => 'error',
                'message' => 'CSV file is empty or invalid.',
            ], 400);
        }

        $imported_count = 0;
        $skipped_count = 0;
        $errors = [];

        // Skip header row (line 0)
        for ($i = 1; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            if (empty($line)) {
                continue;
            }

            // Parse CSV line expecting 6 columns
            $parts = str_getcsv($line);

            if (count($parts) < 4) {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Invalid format. Expected at least 4 columns.";
                continue;
            }

            // Extract columns from CSV (id, customer_id, type, ip_phone_or_email, created_at, updated_at)
            // Skip id - it will auto-increment
            $customer_id = isset($parts[1]) ? intval(sanitize_text_field(trim($parts[1]))) : 0;
            $type = sanitize_text_field(trim($parts[2]));
            $ip_phone_or_email = sanitize_text_field(trim($parts[3]));
            
            // Optional: get created_at from CSV (5th column) or use current time
            $created_at = isset($parts[4]) && !empty(trim($parts[4])) 
                ? sanitize_text_field(trim($parts[4]))
                : current_time('mysql');
            
            // Optional: get updated_at from CSV (6th column) or use current time
            $updated_at = isset($parts[5]) && !empty(trim($parts[5])) 
                ? sanitize_text_field(trim($parts[5]))
                : current_time('mysql');

            // Validate required fields
            if (empty($type) || empty($ip_phone_or_email)) {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Missing type or IP/phone/email/device";
                continue;
            }

            // Validate type enum
            $valid_types = ['ip', 'phone_number', 'email', 'device_token'];
            if (!in_array($type, $valid_types)) {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Invalid type '{$type}'. Must be one of: " . implode(', ', $valid_types);
                continue;
            }

            // Validate date format if provided
            if (!$this->is_valid_datetime($created_at)) {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Invalid datetime format '{$created_at}'";
                continue;
            }

            // Check for uniqueness by ip_phone_or_email field only
            $existing_record = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT id FROM {$this->table_name} WHERE ip_phone_or_email = %s",
                    $ip_phone_or_email
                ),
                ARRAY_A
            );

            if ($existing_record) {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Duplicate entry (ip_phone_or_email: {$ip_phone_or_email})";
                continue;
            }

            // Insert the new blocked entry
            $inserted = $wpdb->insert(
                $this->table_name,
                [
                    'customer_id'       => $customer_id,
                    'type'              => $type,
                    'ip_phone_or_email' => $ip_phone_or_email,
                    'created_at'        => $created_at,
                    'updated_at'        => $updated_at,
                ],
                [
                    '%d',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                ]
            );

            if ($inserted) {
                $imported_count++;
                // Update customer data if customer_id is provided
                if ($customer_id > 0) {
                    $this->update_customer_data($customer_id);
                }
            } else {
                $skipped_count++;
                $errors[] = "Row " . ($i + 1) . ": Database insert failed";
            }
        }

        return new WP_REST_Response([
            'status'  => 'success',
            'message' => "Import completed. {$imported_count} entries imported, {$skipped_count} skipped.",
            'data'    => [
                'imported_count' => $imported_count,
                'skipped_count'  => $skipped_count,
                'total_processed' => $imported_count + $skipped_count,
                'errors'         => $errors,
            ],
        ], 200);
    }

    /**
     * Escape CSV fields (handle commas and quotes)
     */
    private function escape_csv_field($field) {
        if (strpos($field, ',') !== false || strpos($field, '"') !== false) {
            return '"' . str_replace('"', '""', $field) . '"';
        }
        return $field;
    }

    /**
     * Validate datetime format (YYYY-MM-DD HH:MM:SS)
     */
    private function is_valid_datetime($datetime) {
        $pattern = '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/';
        if (!preg_match($pattern, $datetime)) {
            return false;
        }
        
        $date_parts = explode(' ', $datetime);
        $date = strtotime($date_parts[0]);
        $time = strtotime($date_parts[1]);
        
        return $date !== false && $time !== false;
    }     
}