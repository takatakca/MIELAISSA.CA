<?php
/**
 * Plugin Name: TAKATAK Legacy Migration Notice — Miel Aissa
 * Description: Optional transfer notice for the existing Miel Aissa WordPress site. Does not alter WooCommerce.
 * Version: 1.0.1
 * Requires PHP: 7.4
 */
defined('ABSPATH') || exit;

/**
 * Reversible notice. Shortcode for staging: [takatak_mielaissa_moved_notice].
 * To replace ONLY the homepage after backup + QA, set in wp-config.php:
 * define('TAKATAK_MIELAISSA_NOTICE_HOME', true);
 * Removing the constant or changing it to false restores the original homepage.
 */
function takatak_mielaissa_notice_markup() {
    ob_start();
    ?>
    <style>
      .tk-moved-wrap{box-sizing:border-box;min-height:100vh;padding:24px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 0%,#163e78 0%,#060D1F 58%);color:#F5F8FC;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif}
      .tk-moved-wrap *{box-sizing:border-box}
      .tk-moved-card{width:100%;max-width:670px;padding:clamp(26px,6vw,56px);background:#0B1B3D;border:1px solid #37537b;border-radius:24px;text-align:center;box-shadow:0 28px 80px #0007}
      .tk-moved-mark{display:grid;place-items:center;margin:0 auto 22px;width:60px;height:60px;border:2px solid #1F8BFF;border-radius:50%;font-size:30px;font-weight:900}
      .tk-moved-brand{color:#29C3FF;font-size:13px;font-weight:800;letter-spacing:.18em}
      .tk-moved-card h1{color:#fff;font-size:clamp(29px,5.5vw,45px);line-height:1.15;letter-spacing:-.03em;margin:22px 0}
      .tk-moved-card p{color:#B8C4D3;font-size:17px;line-height:1.7}
      .tk-moved-card .tk-moved-primary{display:block;max-width:355px;margin:24px auto 0;padding:17px 22px;border-radius:12px;background:#1565D8;color:#fff;text-decoration:none;font-size:16px;font-weight:800}
      .tk-moved-card .tk-moved-primary:hover,.tk-moved-card .tk-moved-primary:focus-visible{background:#1F8BFF;color:#fff}
      .tk-moved-card .tk-moved-note{font-size:13px;margin-top:30px}
    </style>
    <main class="tk-moved-wrap">
      <section class="tk-moved-card" aria-labelledby="tk-moved-title">
        <div class="tk-moved-mark" aria-hidden="true">T</div>
        <div class="tk-moved-brand">GROUPE TAKATAK · MIEL AISSA</div>
        <h1 id="tk-moved-title">Bonjour, notre serveur a déménagé !</h1>
        <p>Pour demander le transfert de votre site Web, de votre domaine ou des deux vers TAKATAK.CA,
           utilisez notre formulaire public. Aucun compte MochaHost ni paiement n'est nécessaire pour envoyer la demande.</p>
        <a class="tk-moved-primary" href="https://takatak.ca/transfert">Demander mon transfert →</a>
        <p class="tk-moved-note">Une demande n'entraîne aucun transfert automatique, aucune modification DNS ni aucun prélèvement.
           Notre équipe vous contactera avant toute opération. Vos données WooCommerce ne sont pas déplacées par cette page.</p>
      </section>
    </main>
    <?php
    return ob_get_clean();
}
add_shortcode('takatak_mielaissa_moved_notice', 'takatak_mielaissa_notice_markup');

function takatak_mielaissa_maybe_show_home_notice() {
    if (!defined('TAKATAK_MIELAISSA_NOTICE_HOME') || TAKATAK_MIELAISSA_NOTICE_HOME !== true) {
        return;
    }
    if (!is_front_page() || is_admin() || is_preview() || is_feed()) {
        return;
    }
    // Homepage queries can be WooCommerce add-to-cart/AJAX or other WordPress
    // actions. Leave them, non-read methods and paginated paths to WordPress.
    $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
    $home_path = parse_url(home_url('/'), PHP_URL_PATH);
    if (!in_array($method, array('GET', 'HEAD'), true)
        || (isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '') !== ''
        || (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '') !== $home_path) {
        return;
    }
    status_header(200);
    nocache_headers();
    header('X-Robots-Tag: noindex, follow', true);
    if ($method === 'HEAD') {
        exit;
    }
    echo '<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Notre serveur a déménagé — Miel Aissa · TAKATAK</title></head><body style="margin:0">';
    echo takatak_mielaissa_notice_markup();
    echo '</body></html>';
    exit;
}
add_action('template_redirect', 'takatak_mielaissa_maybe_show_home_notice', 0);
