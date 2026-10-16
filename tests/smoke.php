<?php
/**
 * Contract smoke tests (no database / no real WordPress runtime).
 * Verify hook registration, translations, escaping, catalogue rendering,
 * limit handling and coupon states before the plugin enters staging.
 */
define('ABSPATH', __DIR__ . '/');
$GLOBALS['ma_registered'] = array();
$GLOBALS['ma_products'] = array();
$GLOBALS['ma_categories'] = array();
$GLOBALS['ma_coupon_ids'] = array();
$GLOBALS['ma_coupons'] = array();
$GLOBALS['ma_product_query'] = array();

function add_action($name, $fn) { $GLOBALS['ma_registered'][$name] = $fn; }
function add_shortcode($name, $fn) { $GLOBALS['ma_registered'][$name] = $fn; }
function get_locale() { return 'fr_CA'; }
function shortcode_atts($defaults, $atts, $shortcode = '') { return array_merge($defaults, $atts); }
function esc_html($str) { return htmlspecialchars((string) $str, ENT_QUOTES, 'UTF-8'); }
function esc_attr($str) { return esc_html($str); }
function esc_url($str) { return esc_html($str); }
function wp_kses_post($str) { return $str; }
function home_url($path = '/') { return 'https://mielaissa.ca' . $path; }
function absint($num) { return abs((int) $num); }
function is_wp_error($value) { return false; }
function sanitize_email($email) { return $email; }
function plugin_dir_url($file) { return '/wp-content/plugins/mielaissa-storefront/'; }
function wp_enqueue_style() {}
function wp_enqueue_script() {}
function wc_get_page_permalink() { return 'https://mielaissa.ca/shop/'; }
function wc_get_products($query) {
    $GLOBALS['ma_product_query'] = $query;
    if (!empty($GLOBALS['ma_fail_product_query'])) {
        throw new RuntimeException('Sensitive database error details');
    }
    return $GLOBALS['ma_products'];
}
function get_terms() { return $GLOBALS['ma_categories']; }
function get_term_link($term) { return 'https://mielaissa.ca/product-category/' . $term->slug . '/'; }
function get_permalink($id) { return 'https://mielaissa.ca/product/' . $id . '/'; }
function wc_get_coupon_id_by_code($code) {
    if (!empty($GLOBALS['ma_throw_coupon_lookup']) && $code === 'MIELAISSA120') { throw new RuntimeException('Private coupon lookup'); }
    return isset($GLOBALS['ma_coupon_ids'][$code]) ? $GLOBALS['ma_coupon_ids'][$code] : 0;
}
function get_post_status($id) {
    if (!empty($GLOBALS['ma_throw_coupon_status']) && $id === 1) { throw new RuntimeException('Private coupon status'); }
    return !empty($GLOBALS['ma_coupons'][$id]['unpublished']) ? 'draft' : 'publish';
}

class FakeProduct {
    public function get_id() { return 101; }
    public function is_visible() {
        if (!empty($GLOBALS['ma_throw_visibility'])) { throw new RuntimeException('Private product metadata'); }
        return true;
    }
    public function is_in_stock() { return false; }
    public function get_name() { return 'Honey & <script>bad()</script>'; }
    public function get_image($size) { return '<img src="/honey.jpg" alt="Honey">'; }
    public function get_price_html() { return '<span class="amount">$50</span>'; }
}
class WC_Coupon {
    private $id;
    public function __construct($id) {
        if (!empty($GLOBALS['ma_coupons'][$id]['throw'])) {
            throw new RuntimeException('Corrupt coupon metadata');
        }
        $this->id = $id;
    }
    public function get_id() { return $this->id; }
    public function get_date_expires() {
        $offer = $GLOBALS['ma_coupons'][$this->id];
        return !empty($offer['expired']) ? new DateTimeImmutable('-1 day') : null;
    }
    public function get_free_shipping() { return !empty($GLOBALS['ma_coupons'][$this->id]['free_shipping']); }
    public function get_discount_type() { return $GLOBALS['ma_coupons'][$this->id]['type']; }
    public function get_amount() { return $GLOBALS['ma_coupons'][$this->id]['amount']; }
    public function get_usage_limit() { return isset($GLOBALS['ma_coupons'][$this->id]['usage_limit']) ? $GLOBALS['ma_coupons'][$this->id]['usage_limit'] : 0; }
    public function get_usage_count() { return isset($GLOBALS['ma_coupons'][$this->id]['usage_count']) ? $GLOBALS['ma_coupons'][$this->id]['usage_count'] : 0; }
}

require __DIR__ . '/../wordpress/wp-content/plugins/mielaissa-storefront/mielaissa-storefront.php';

function verify($condition, $label) {
    if (!$condition) {
        fwrite(STDERR, "FAIL: $label\n");
        exit(1);
    }
    echo "PASS: $label\n";
}

verify(mielaissa_storefront_language() === 'fr', 'French default locale');
verify(mielaissa_storefront_language('en') === 'en', 'English override');
verify(mielaissa_storefront_language('invalid') === 'fr', 'Invalid override uses locale');
verify(mielaissa_storefront_label('hero', 'en') !== mielaissa_storefront_label('hero', 'fr'), 'Bilingual translations');
verify(isset($GLOBALS['ma_registered']['init']) && isset($GLOBALS['ma_registered']['wp_enqueue_scripts']), 'WordPress hooks');
mielaissa_storefront_register_shortcodes();
verify(isset($GLOBALS['ma_registered']['mielaissa_storefront']) && isset($GLOBALS['ma_registered']['mielaissa_offers']), 'Both shortcodes');

$fr = mielaissa_storefront_shortcode(array('lang' => 'fr', 'limit' => '999'));
verify(strpos($fr, 'Du miel pour') !== false, 'French storefront renders');
verify(strpos($fr, 'Les produits seront affichés') !== false, 'Empty catalogue state');
verify(strpos($fr, 'https://mielaissa.ca/shop/') !== false, 'Links to existing WooCommerce shop');
verify($GLOBALS['ma_product_query']['limit'] === 12, 'Product limit upper bound');
verify($GLOBALS['ma_product_query']['visibility'] === 'catalog', 'WooCommerce filters catalog visibility before limiting products');
$en = mielaissa_storefront_shortcode(array('lang' => 'en', 'limit' => '0'));
verify(strpos($en, 'Honey for') !== false, 'English storefront renders');
verify($GLOBALS['ma_product_query']['limit'] === 1, 'Product limit lower bound');

$GLOBALS['ma_products'] = array(new FakeProduct());
$GLOBALS['ma_categories'] = array((object) array('slug' => 'honey', 'name' => 'Honey <b>Sweet</b>'));
$rendered = mielaissa_storefront_shortcode(array('lang' => 'en'));
verify(strpos($rendered, 'Honey &amp; &lt;script&gt;bad()&lt;/script&gt;') !== false, 'Escaped product titles');
verify(strpos($rendered, 'Honey &lt;b&gt;Sweet&lt;/b&gt;') !== false, 'Escaped category labels');
verify(strpos($rendered, '<img src="/honey.jpg"') !== false, 'WooCommerce product image rendered');
verify(strpos($rendered, '$50</span>') !== false, 'WooCommerce price HTML rendered');
verify(strpos($rendered, 'https://mielaissa.ca/product/101/') !== false, 'Product detail links');
verify(strpos($rendered, 'Out of stock') !== false, 'Translated inventory state for sold-out products');
verify(strpos($rendered, '<script>bad()') === false, 'No raw script injection in product titles');

$no_coupons = mielaissa_storefront_offers_shortcode();
verify(strpos($no_coupons, 'Consultez la boutique') !== false, 'Unknown coupons not advertised');
$GLOBALS['ma_coupon_ids'] = array('MIELAISSA120' => 1, 'FIRSTORDER15' => 2);
$GLOBALS['ma_coupons'] = array(
    1 => array('type' => 'fixed_cart', 'amount' => '0', 'free_shipping' => true),
    2 => array('type' => 'percent', 'amount' => '15', 'free_shipping' => false),
);
$offers = mielaissa_storefront_available_offers();
verify(count($offers) === 2, 'Valid existing coupons advertised');
$GLOBALS['ma_coupons'][2]['usage_limit'] = 3;
$GLOBALS['ma_coupons'][2]['usage_count'] = 3;
verify(count(mielaissa_storefront_available_offers()) === 1, 'Exhausted coupons hidden');
$GLOBALS['ma_coupons'][2]['usage_count'] = 2;
verify(count(mielaissa_storefront_available_offers()) === 2, 'Unexhausted coupons available');
verify(strpos(mielaissa_storefront_offers_shortcode(array('lang' => 'en')), 'FIRSTORDER15') !== false, 'Coupons displayed in English');
verify(strpos(mielaissa_storefront_offers_shortcode(array('lang' => 'en')), 'eligible first order') !== false, 'First-order eligibility disclosed');
verify(strpos(mielaissa_storefront_offers_shortcode(array('lang' => 'fr')), 'commande admissible') !== false, 'French shipping eligibility disclosed');

$GLOBALS['ma_coupons'][1]['free_shipping'] = false;
$GLOBALS['ma_coupons'][2]['amount'] = '10';
verify(count(mielaissa_storefront_available_offers()) === 0, 'Wrong coupon mechanics rejected');
$GLOBALS['ma_coupons'][1]['free_shipping'] = true;
$GLOBALS['ma_coupons'][1]['unpublished'] = true;
verify(count(mielaissa_storefront_available_offers()) === 0, 'Unpublished coupons rejected');
$GLOBALS['ma_coupons'][1]['unpublished'] = false;
$GLOBALS['ma_coupons'][1]['expired'] = true;
verify(count(mielaissa_storefront_available_offers()) === 0, 'Expired and mismatched coupons rejected');

$GLOBALS['ma_fail_product_query'] = true;
$unavailable = mielaissa_storefront_shortcode(array('lang' => 'en'));
verify(strpos($unavailable, 'The store is temporarily unavailable.') !== false, 'WooCommerce exceptions return a safe customer-facing fallback');
verify(strpos($unavailable, 'Sensitive database error') === false, 'No internal exception messages exposed');
$GLOBALS['ma_fail_product_query'] = false;
$GLOBALS['ma_coupons'][1]['expired'] = false;
$GLOBALS['ma_coupons'][1]['throw'] = true;
$GLOBALS['ma_coupons'][2]['amount'] = '15';
verify(count(mielaissa_storefront_available_offers()) === 1, 'Corrupt coupon does not suppress other valid offers');

$GLOBALS['ma_throw_visibility'] = true;
$visibility_fail = mielaissa_storefront_shortcode(array('lang' => 'en'));
verify(strpos($visibility_fail, 'The store is temporarily unavailable.') !== false, 'Broken visibility getter falls back safely');
verify(strpos($visibility_fail, 'Private product metadata') === false, 'Visibility exceptions never leak internals');
$GLOBALS['ma_throw_visibility'] = false;
$GLOBALS['ma_coupons'][1]['throw'] = false;
$GLOBALS['ma_coupons'][1]['expired'] = false;
$GLOBALS['ma_coupons'][2]['amount'] = '15';
$GLOBALS['ma_throw_coupon_lookup'] = true;
verify(count(mielaissa_storefront_available_offers()) === 1, 'Coupon lookup exception skips only failed coupon');
$GLOBALS['ma_throw_coupon_lookup'] = false;
$GLOBALS['ma_throw_coupon_status'] = true;
verify(count(mielaissa_storefront_available_offers()) === 1, 'Coupon status exception skips only failed coupon');
$GLOBALS['ma_throw_coupon_status'] = false;

echo "All storefront smoke checks passed.\n";
