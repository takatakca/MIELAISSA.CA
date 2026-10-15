<?php
/**
 * Read-only integration check inside a REAL, bootstrapped WordPress install.
 *
 * Usage from the verified WordPress root:
 * wp --path=/absolute/wordpress/root eval-file /absolute/path/to/scripts/wordpress-smoke.php
 *
 * This never submits orders, mutates inventory, applies coupons or performs
 * customer actions. Use a staging site before production.
 */
if (!defined('ABSPATH')) {
    fwrite(STDERR, "FAIL: Run inside WordPress using wp eval-file.\n");
    exit(1);
}

function mielaissa_smoke_assert($condition, $label) {
    if (!$condition) {
        fwrite(STDERR, "FAIL: " . $label . "\n");
        exit(1);
    }
    echo "PASS: " . $label . "\n";
}

if (!function_exists('is_plugin_active')) {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

mielaissa_smoke_assert(
    is_plugin_active('woocommerce/woocommerce.php'),
    'WooCommerce is active'
);
mielaissa_smoke_assert(
    is_plugin_active('mielaissa-storefront/mielaissa-storefront.php'),
    'Miel Aissa plugin is active'
);
mielaissa_smoke_assert(function_exists('wc_get_products'), 'WooCommerce product API is available');
mielaissa_smoke_assert(shortcode_exists('mielaissa_storefront'), 'Storefront shortcode exists');
mielaissa_smoke_assert(shortcode_exists('mielaissa_offers'), 'Offers shortcode exists');

$published = wc_get_products(array('status' => 'publish', 'limit' => 4, 'return' => 'objects'));
mielaissa_smoke_assert(is_array($published), 'Live product query succeeds');

$fr = do_shortcode('[mielaissa_storefront lang="fr" limit="4"]');
$en = do_shortcode('[mielaissa_storefront lang="en" limit="4"]');
mielaissa_smoke_assert(is_string($fr) && strpos($fr, 'Du miel pour') !== false, 'French storefront renders');
mielaissa_smoke_assert(is_string($en) && strpos($en, 'Honey for') !== false, 'English storefront renders');
mielaissa_smoke_assert(strpos($fr, 'ma-products') !== false, 'Product section renders');
mielaissa_smoke_assert(strpos($en, 'ma-story-title') !== false, 'Informational section renders');

$offers = do_shortcode('[mielaissa_offers lang="en"]');
mielaissa_smoke_assert(is_string($offers) && strpos($offers, 'Shop offers') !== false, 'Offer section renders safely');

$visible_count = 0;
foreach ($published as $product) {
    if ($product->is_visible()) {
        $visible_count++;
    }
}
echo "INFO: " . count($published) . " published products sampled; " . $visible_count . " visible.\n";
echo "INFO: This check does not validate orders, payments, theme CSS, translations of product descriptions or coupons at checkout.\n";
echo "PASS: Read-only WordPress/WooCommerce integration smoke checks completed.\n";
