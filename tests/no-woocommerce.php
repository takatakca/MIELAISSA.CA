<?php
/**
 * Ensure shortcode usage remains safe when WooCommerce is inactive.
 * Run separately from smoke.php because PHP functions/classes cannot
 * be unloaded from the same process.
 */
define('ABSPATH', __DIR__ . '/');
function add_action($hook, $callback) {}
function add_shortcode($shortcode, $callback) {}
function shortcode_atts($defaults, $atts, $shortcode = '') { return array_merge($defaults, $atts); }
function get_locale() { return 'fr_CA'; }
function absint($value) { return abs((int) $value); }
function esc_html($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_attr($value) { return esc_html($value); }
function esc_url($value) { return esc_html($value); }
function home_url($path = '/') { return 'https://mielaissa.ca' . $path; }
function plugin_dir_url($file) { return '/plugins/mielaissa-storefront/'; }
function wp_enqueue_style() {}
function wp_enqueue_script() {}

require __DIR__ . '/../wordpress/wp-content/plugins/mielaissa-storefront/mielaissa-storefront.php';

$storefront = mielaissa_storefront_shortcode(array('lang' => 'en'));
if (strpos($storefront, 'The store is temporarily unavailable.') === false) {
    fwrite(STDERR, "FAIL: No-WooCommerce storefront fallback.\n");
    exit(1);
}
$offers = mielaissa_storefront_offers_shortcode(array('lang' => 'fr'));
if (strpos($offers, 'Consultez la boutique') === false) {
    fwrite(STDERR, "FAIL: No-WooCommerce offers fallback.\n");
    exit(1);
}
if (strpos($offers, 'MIELAISSA120') !== false) {
    fwrite(STDERR, "FAIL: Cannot advertise unverified coupons without WooCommerce.\n");
    exit(1);
}
echo "PASS: Safe rendering without WooCommerce.\n";
