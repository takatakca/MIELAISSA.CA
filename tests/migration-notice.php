<?php
/** Exercise the registered notice callback in isolated PHP requests, no real WP/data. */
if (isset($argv[1])) {
    $case = json_decode(base64_decode($argv[1]), true);
    define('ABSPATH', __DIR__ . '/');
    if (array_key_exists('enabled', $case)) {
        define('TAKATAK_MIELAISSA_NOTICE_HOME', $case['enabled']);
    }
    $_SERVER['REQUEST_METHOD'] = isset($case['method']) ? $case['method'] : 'GET';
    $_SERVER['REQUEST_URI'] = isset($case['uri']) ? $case['uri'] : '/';
    $_SERVER['QUERY_STRING'] = isset($case['query']) ? $case['query'] : '';
    $hooks = array();
    $continued = false;
    $status = null;
    $no_cache = false;
    function add_action($hook, $callback, $priority = 10) { $GLOBALS['hooks'][$hook] = $callback; }
    function add_shortcode($name, $callback) { $GLOBALS['hooks'][$name] = $callback; }
    function is_front_page() { return !isset($GLOBALS['case']['front']) || $GLOBALS['case']['front']; }
    function is_admin() { return !empty($GLOBALS['case']['admin']); }
    function is_preview() { return !empty($GLOBALS['case']['preview']); }
    function is_feed() { return !empty($GLOBALS['case']['feed']); }
    function home_url($path) { return 'https://mielaissa.ca' . (isset($GLOBALS['case']['home']) ? $GLOBALS['case']['home'] : '/') ; }
    function status_header($value) { $GLOBALS['status'] = $value; }
    function nocache_headers() { $GLOBALS['no_cache'] = true; }

    ob_start();
    register_shutdown_function(function () use (&$continued, &$status, &$no_cache) {
        $body = ob_get_clean();
        echo json_encode(array('continued' => $continued, 'status' => $status,
            'no_cache' => $no_cache, 'body' => $body));
    });
    require __DIR__ . '/../wordpress/wp-content/mu-plugins/takatak-migration-notice.php';
    call_user_func($hooks['template_redirect']);
    $continued = true;
    exit;
}

$cases = array(
    'default off' => array(),
    'explicit off' => array('enabled' => false),
    'string is not opt in' => array('enabled' => 'true'),
    'homepage GET' => array('enabled' => true, 'notice' => true),
    'homepage HEAD' => array('enabled' => true, 'method' => 'HEAD', 'notice' => true),
    'homepage POST' => array('enabled' => true, 'method' => 'POST'),
    'homepage PUT' => array('enabled' => true, 'method' => 'PUT'),
    'homepage OPTIONS' => array('enabled' => true, 'method' => 'OPTIONS'),
    'cart action query' => array('enabled' => true, 'uri' => '/?add-to-cart=12', 'query' => 'add-to-cart=12'),
    'AJAX query' => array('enabled' => true, 'uri' => '/?wc-ajax=checkout', 'query' => 'wc-ajax=checkout'),
    'query only in request URI' => array('enabled' => true, 'uri' => '/?wc-ajax=checkout'),
    'query only in query string' => array('enabled' => true, 'query' => 'add-to-cart=12'),
    'cart path' => array('enabled' => true, 'uri' => '/cart/'),
    'checkout path' => array('enabled' => true, 'uri' => '/checkout/'),
    'pagination' => array('enabled' => true, 'uri' => '/page/2/'),
    'admin' => array('enabled' => true, 'admin' => true),
    'preview' => array('enabled' => true, 'preview' => true),
    'feed' => array('enabled' => true, 'feed' => true),
    'not the front page' => array('enabled' => true, 'front' => false),
    'subdirectory home' => array('enabled' => true, 'uri' => '/store/', 'home' => '/store/', 'notice' => true),
    'outside subdirectory' => array('enabled' => true, 'home' => '/store/'),
);
foreach ($cases as $name => $case) {
    $process = proc_open(array(PHP_BINARY, __FILE__, base64_encode(json_encode($case))),
        array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w')), $pipes);
    if (!is_resource($process)) { throw new RuntimeException('Unable to start isolated request'); }
    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]);
    $errors = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $code = proc_close($process);
    $result = json_decode($output, true);
    if ($code !== 0 || $errors !== '' || !is_array($result)) {
        throw new RuntimeException($name . ': request failed: ' . $errors . $output);
    }
    $notice = !empty($case['notice']);
    $head = isset($case['method']) && $case['method'] === 'HEAD';
    if ($result['continued'] !== !$notice || $result['status'] !== ($notice ? 200 : null)
        || $result['no_cache'] !== $notice) {
        throw new RuntimeException($name . ': request was intercepted incorrectly');
    }
    if ($notice && !$head) {
        if (strpos($result['body'], 'https://takatak.ca/transfert') === false
            || strpos($result['body'], '<!doctype html>') !== 0) {
            throw new RuntimeException($name . ': missing notice or transfer link');
        }
    } elseif ($result['body'] !== '') {
        throw new RuntimeException($name . ': unexpected response body');
    }
}
echo 'PASS: ' . count($cases) . " isolated notice requests; commerce and non-home requests preserved.\n";
