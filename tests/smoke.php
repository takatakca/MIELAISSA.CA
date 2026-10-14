<?php
/* Framework-free smoke tests; never substitute for WordPress integration testing. */
define('ABSPATH', __DIR__ . '/');
$GLOBALS['registered'] = array();
function add_action($name, $handler) { $GLOBALS['registered'][$name] = $handler; }
function add_shortcode($name, $handler) { $GLOBALS['registered'][$name] = $handler; }
function get_locale() { return 'fr_CA'; }
function shortcode_atts($defaults, $atts, $shortcode = '') { return array_merge($defaults, $atts); }
function esc_html($str) { return htmlspecialchars((string) $str, ENT_QUOTES, 'UTF-8'); }
function esc_attr($str) { return esc_html($str); }
function esc_url($str) { return esc_html($str); }
function home_url($path = '/') { return 'https://mielaissa.ca' . $path; }
function absint($n) { return abs((int) $n); }
function is_wp_error($value) { return false; }
function sanitize_email($value) { return $value; }
function plugin_dir_url($file) { return '/wp-content/plugins/mielaissa-storefront/'; }
function wp_enqueue_style() {}
function wp_enqueue_script() {}
function wp_kses_post($value) { return $value; }
function get_terms() { return array(); }
function wc_get_products() { return array(); }
function wc_get_page_permalink() { return 'https://mielaissa.ca/shop/'; }
require __DIR__ . '/../wordpress/wp-content/plugins/mielaissa-storefront/mielaissa-storefront.php';
function expect_true($state, $label) {
    if (!$state) { fwrite(STDERR, "FAIL: $label\n"); exit(1); }
    echo "PASS: $label\n";
}
expect_true(mielaissa_language() === 'fr', 'French from WordPress locale');
expect_true(mielaissa_language('en') === 'en', 'English override');
expect_true(mielaissa_label('hero', 'fr') !== mielaissa_label('hero', 'en'), 'Translated content');
expect_true(isset($GLOBALS['registered']['init']), 'WordPress init hook');
mielaissa_register_shortcodes();
expect_true(isset($GLOBALS['registered']['mielaissa_storefront']), 'Storefront shortcode');
expect_true(isset($GLOBALS['registered']['mielaissa_offers']), 'Offers shortcode');
$fr = mielaissa_storefront_shortcode(array('lang' => 'fr', 'limit' => 999));
$en = mielaissa_storefront_shortcode(array('lang' => 'en'));
expect_true(strpos($fr, 'Du miel pour') !== false, 'French render');
expect_true(strpos($en, 'Honey for') !== false, 'English render');
expect_true(strpos($fr, 'https://mielaissa.ca/shop/') !== false, 'WooCommerce shop link');
expect_true(strpos($fr, 'Les produits seront affichés') !== false, 'No product fallback');
$offers = mielaissa_offers_shortcode();
expect_true(strpos($offers, 'Consultez la boutique') !== false, 'No unverified coupon displayed');
echo "Smoke checks passed.\n";
