<?php
/**
 * Plugin Name: Miel Aissa Storefront
 * Description: A bilingual WooCommerce catalogue and verified offer highlights.
 * Version: 0.2.6
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Text Domain: mielaissa-storefront
 */

defined('ABSPATH') || exit;

define('MIELAISSA_STOREFRONT_VERSION', '0.2.6');

function mielaissa_storefront_language($requested = '') {
    if (in_array($requested, array('fr', 'en'), true)) {
        return $requested;
    }
    return strpos(strtolower((string) get_locale()), 'fr') === 0 ? 'fr' : 'en';
}

function mielaissa_storefront_label($key, $language = 'fr') {
    $translations = array(
        'eyebrow' => array('fr' => 'La douceur au naturel', 'en' => 'A taste of nature'),
        'hero' => array('fr' => 'Du miel pour les moments qui comptent.', 'en' => 'Honey for life’s sweetest moments.'),
        'intro' => array('fr' => 'Découvrez les miels et les produits Miel Aissa. Prix, photos et disponibilités proviennent de notre boutique.', 'en' => 'Explore Miel Aissa honey and specialties. Prices, photos and availability come straight from our store.'),
        'browse' => array('fr' => 'Découvrir les produits', 'en' => 'Explore products'),
        'contact' => array('fr' => 'Nous joindre', 'en' => 'Contact us'),
        'categories' => array('fr' => 'Explorer les univers', 'en' => 'Explore categories'),
        'products' => array('fr' => 'À découvrir en boutique', 'en' => 'Discover in store'),
        'all' => array('fr' => 'Voir toute la boutique', 'en' => 'Visit the full store'),
        'details' => array('fr' => 'Voir le produit', 'en' => 'View product'),
        'empty' => array('fr' => 'Les produits seront affichés ici dès leur publication.', 'en' => 'Products will appear here once published.'),
        'unavailable' => array('fr' => 'La boutique est momentanément indisponible.', 'en' => 'The store is temporarily unavailable.'),
        'story' => array('fr' => 'Une expérience simple, du choix à la dégustation.', 'en' => 'An effortless experience, from selection to tasting.'),
        'story_body' => array('fr' => 'Parcourez la sélection, choisissez vos favoris et finalisez votre commande sur notre boutique en ligne.', 'en' => 'Explore the selection, choose your favourites and complete your order in our online store.'),
        'offers' => array('fr' => 'Offres en boutique', 'en' => 'Shop offers'),
        'shipping' => array('fr' => 'Livraison offerte sur commande admissible avec le code', 'en' => 'Free delivery on eligible orders with code'),
        'first' => array('fr' => '15 % de réduction sur une première commande admissible avec le code', 'en' => '15% off an eligible first order with code'),
        'terms' => array('fr' => 'Sous réserve des conditions et de l’éligibilité à la commande.', 'en' => 'Subject to eligibility and terms at checkout.'),
        'copy' => array('fr' => 'Copier', 'en' => 'Copy'),
        'copied' => array('fr' => 'Copié !', 'en' => 'Copied!'),
        'no_offers' => array('fr' => 'Consultez la boutique pour connaître les offres en vigueur.', 'en' => 'Check the shop for current offers.'),
        'sold_out' => array('fr' => 'Rupture de stock', 'en' => 'Out of stock'),
    );
    $language = mielaissa_storefront_language($language);
    return isset($translations[$key][$language]) ? $translations[$key][$language] : '';
}

function mielaissa_storefront_enqueue() {
    wp_enqueue_style('mielaissa-storefront', plugin_dir_url(__FILE__) . 'assets/storefront.css', array(), MIELAISSA_STOREFRONT_VERSION);
    wp_enqueue_script('mielaissa-storefront', plugin_dir_url(__FILE__) . 'assets/storefront.js', array(), MIELAISSA_STOREFRONT_VERSION, true);
}
add_action('wp_enqueue_scripts', 'mielaissa_storefront_enqueue');

/**
 * Never advertise a guessed discount. Coupons must exist, be unexpired and
 * carry the expected discount mechanics. WooCommerce checks cart eligibility.
 */
function mielaissa_storefront_available_offers() {
    if (!class_exists('WC_Coupon') || !function_exists('wc_get_coupon_id_by_code')) {
        return array();
    }
    $definitions = array('MIELAISSA120' => 'shipping', 'FIRSTORDER15' => 'first');
    $valid = array();
    foreach ($definitions as $code => $type) {
        try {
            $id = wc_get_coupon_id_by_code($code);
            if (!$id || get_post_status($id) !== 'publish') {
                continue;
            }
            $coupon = new WC_Coupon($id);
            if (!$coupon->get_id()) {
                continue;
            }
            $expiration = $coupon->get_date_expires();
            if ($expiration && $expiration->getTimestamp() < time()) {
                continue;
            }
            $usage_limit = (int) $coupon->get_usage_limit();
            if ($usage_limit > 0 && (int) $coupon->get_usage_count() >= $usage_limit) {
                continue;
            }
            if ($type === 'shipping' && !$coupon->get_free_shipping()) {
                continue;
            }
            if ($type === 'first' && ($coupon->get_discount_type() !== 'percent' || (float) $coupon->get_amount() !== 15.0)) {
                continue;
            }
            $valid[] = array('code' => $code, 'type' => $type);
        } catch (Throwable $error) {
            // Malformed coupon data must not interrupt the rest of the shop.
            continue;
        }
    }
    return $valid;
}

function mielaissa_storefront_offers_shortcode($atts = array()) {
    $atts = shortcode_atts(array('lang' => ''), $atts, 'mielaissa_offers');
    $lang = mielaissa_storefront_language($atts['lang']);
    $offers = mielaissa_storefront_available_offers();
    $shop = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/');
    ob_start();
    ?>
    <section class="ma-offers" aria-label="<?php echo esc_attr(mielaissa_storefront_label('offers', $lang)); ?>">
      <div class="ma-container ma-offers__inner">
        <div class="ma-offers__heading">
          <span class="ma-kicker"><?php echo esc_html(mielaissa_storefront_label('offers', $lang)); ?></span>
          <p><?php echo esc_html(mielaissa_storefront_label('terms', $lang)); ?></p>
        </div>
        <?php if (empty($offers)) : ?>
          <a class="ma-link" href="<?php echo esc_url($shop); ?>"><?php echo esc_html(mielaissa_storefront_label('no_offers', $lang)); ?> →</a>
        <?php else : ?>
          <div class="ma-offers__grid">
            <?php foreach ($offers as $offer) : ?>
              <div class="ma-coupon">
                <span><?php echo esc_html(mielaissa_storefront_label($offer['type'], $lang)); ?></span>
                <strong><?php echo esc_html($offer['code']); ?></strong>
                <button type="button" class="ma-copy" data-ma-copy="<?php echo esc_attr($offer['code']); ?>" data-ma-done="<?php echo esc_attr(mielaissa_storefront_label('copied', $lang)); ?>"><?php echo esc_html(mielaissa_storefront_label('copy', $lang)); ?></button>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>
    <?php
    return (string) ob_get_clean();
}

function mielaissa_storefront_shortcode($atts = array()) {
    $atts = shortcode_atts(array('lang' => '', 'limit' => '8'), $atts, 'mielaissa_storefront');
    $lang = mielaissa_storefront_language($atts['lang']);
    $limit = min(12, max(1, absint($atts['limit'])));
    if (!function_exists('wc_get_products') || !function_exists('wc_get_page_permalink')) {
        return '<p class="ma-notice">' . esc_html(mielaissa_storefront_label('unavailable', $lang)) . '</p>';
    }
    try {
        $products = wc_get_products(array('status' => 'publish', 'visibility' => 'catalog', 'limit' => $limit, 'orderby' => 'date', 'order' => 'DESC'));
        $categories = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => true, 'number' => 6, 'orderby' => 'count', 'order' => 'DESC'));
        if (!is_array($products)) {
            $products = array();
        }
        // Product visibility can itself throw when WooCommerce metadata is corrupt.
        $products = array_values(array_filter($products, function ($product) {
            return is_object($product) && method_exists($product, 'is_visible') && $product->is_visible()
                && method_exists($product, 'get_id');
        }));
    } catch (Throwable $error) {
        // Do not expose database details or partially rendered product data to visitors.
        return '<p class="ma-notice" role="status">' . esc_html(mielaissa_storefront_label('unavailable', $lang)) . '</p>';
    }
    if (is_wp_error($categories) || !is_array($categories)) {
        $categories = array();
    }
    $shop = wc_get_page_permalink('shop');
    $email = defined('MIELAISSA_CONTACT_EMAIL') ? MIELAISSA_CONTACT_EMAIL : 'mielaissa.ca@gmail.com';
    $phone = defined('MIELAISSA_CONTACT_PHONE') ? MIELAISSA_CONTACT_PHONE : '+15149964247';
    ob_start();
    ?>
    <div class="ma-store" id="mielaissa-storefront">
      <section class="ma-hero" aria-labelledby="ma-hero-title">
        <div class="ma-container ma-hero__inner">
          <div class="ma-hero__copy">
            <p class="ma-kicker"><?php echo esc_html(mielaissa_storefront_label('eyebrow', $lang)); ?></p>
            <h1 id="ma-hero-title"><?php echo esc_html(mielaissa_storefront_label('hero', $lang)); ?></h1>
            <p class="ma-lead"><?php echo esc_html(mielaissa_storefront_label('intro', $lang)); ?></p>
            <div class="ma-hero__actions">
              <a class="ma-button ma-button--gold" href="#ma-products"><?php echo esc_html(mielaissa_storefront_label('browse', $lang)); ?> <span aria-hidden="true">↗</span></a>
              <a class="ma-button ma-button--line" href="mailto:<?php echo esc_attr(sanitize_email($email)); ?>"><?php echo esc_html(mielaissa_storefront_label('contact', $lang)); ?></a>
            </div>
          </div>
          <div class="ma-hero__art" aria-hidden="true">
            <div class="ma-sun"></div><div class="ma-honeycomb"><span>✦</span><span>✦</span><span>✦</span></div>
            <div class="ma-stamp">MIEL <em>AISSA</em><small>MONTRÉAL · QUÉBEC</small></div>
          </div>
        </div>
      </section>
      <?php if ($categories) : ?>
        <section class="ma-section ma-categories" aria-labelledby="ma-categories-title">
          <div class="ma-container">
            <div class="ma-section__heading"><p class="ma-kicker"><?php echo esc_html(mielaissa_storefront_label('eyebrow', $lang)); ?></p><h2 id="ma-categories-title"><?php echo esc_html(mielaissa_storefront_label('categories', $lang)); ?></h2></div>
            <div class="ma-category-grid">
              <?php foreach ($categories as $category) : ?>
                <?php $category_url = get_term_link($category); if (is_wp_error($category_url)) { continue; } ?>
                <a class="ma-category" href="<?php echo esc_url($category_url); ?>"><span class="ma-category__icon" aria-hidden="true">✦</span><strong><?php echo esc_html($category->name); ?></strong><span aria-hidden="true">↗</span></a>
              <?php endforeach; ?>
            </div>
          </div>
        </section>
      <?php endif; ?>
      <section class="ma-section ma-products" id="ma-products" aria-labelledby="ma-products-title">
        <div class="ma-container">
          <div class="ma-section__heading"><p class="ma-kicker">MIEL AISSA</p><h2 id="ma-products-title"><?php echo esc_html(mielaissa_storefront_label('products', $lang)); ?></h2></div>
          <?php if (empty($products)) : ?>
            <p class="ma-notice"><?php echo esc_html(mielaissa_storefront_label('empty', $lang)); ?></p>
          <?php else : ?>
            <div class="ma-product-grid">
              <?php foreach ($products as $product) : ?>
                <?php
                  try {
                      $url = get_permalink($product->get_id());
                      $name = $product->get_name();
                      $image = $product->get_image('woocommerce_thumbnail');
                      $price = $product->get_price_html();
                      $in_stock = !method_exists($product, 'is_in_stock') || $product->is_in_stock();
                      if (!$url || !$name) { continue; }
                  } catch (Throwable $error) {
                      // Skip only this malformed product; the rest of the catalog remains usable.
                      continue;
                  }
                ?>
                <article class="ma-product">
                  <a class="ma-product__image" href="<?php echo esc_url($url); ?>" aria-label="<?php echo esc_attr($name); ?>"><?php echo wp_kses_post($image); ?></a>
                  <div class="ma-product__body">
                    <?php if (!$in_stock) : ?>
                      <p class="ma-product__stock" role="status"><?php echo esc_html(mielaissa_storefront_label('sold_out', $lang)); ?></p>
                    <?php endif; ?>
                    <h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($name); ?></a></h3>
                    <?php if ($price) : ?><p class="ma-product__price"><?php echo wp_kses_post($price); ?></p><?php endif; ?>
                    <a class="ma-product__detail" href="<?php echo esc_url($url); ?>"><?php echo esc_html(mielaissa_storefront_label('details', $lang)); ?> <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
          <div class="ma-center"><a class="ma-button ma-button--dark" href="<?php echo esc_url($shop); ?>"><?php echo esc_html(mielaissa_storefront_label('all', $lang)); ?> <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
      <section class="ma-story" aria-labelledby="ma-story-title">
        <div class="ma-container ma-story__inner">
          <div><p class="ma-kicker">MIEL AISSA · QUÉBEC</p><h2 id="ma-story-title"><?php echo esc_html(mielaissa_storefront_label('story', $lang)); ?></h2></div>
          <div>
            <p><?php echo esc_html(mielaissa_storefront_label('story_body', $lang)); ?></p>
            <a class="ma-story__email" href="mailto:<?php echo esc_attr(sanitize_email($email)); ?>"><?php echo esc_html(sanitize_email($email)); ?> ↗</a>
            <a class="ma-story__phone" href="tel:<?php echo esc_attr(preg_replace('/[^+0-9]/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a>
          </div>
        </div>
      </section>
    </div>
    <?php
    return (string) ob_get_clean();
}

function mielaissa_storefront_register_shortcodes() {
    add_shortcode('mielaissa_storefront', 'mielaissa_storefront_shortcode');
    add_shortcode('mielaissa_offers', 'mielaissa_storefront_offers_shortcode');
}
add_action('init', 'mielaissa_storefront_register_shortcodes');
