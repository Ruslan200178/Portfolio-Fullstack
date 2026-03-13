<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$appPath = '/var/task/user';
$tmpPath = '/tmp/laravel';

putenv('VIEW_COMPILED_PATH=' . $tmpPath . '/storage/framework/views');

$dirs = [
    $tmpPath . '/storage/logs',
    $tmpPath . '/storage/framework/cache/data',
    $tmpPath . '/storage/framework/sessions',
    $tmpPath . '/storage/framework/views',
    $tmpPath . '/bootstrap/cache',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
}

require $appPath . '/vendor/autoload.php';
define('LARAVEL_START', microtime(true));

$app = require_once $appPath . '/bootstrap/app.php';
$app->useStoragePath($tmpPath . '/storage');
$app->instance('path.storage', $tmpPath . '/storage');
$app->instance('path.bootstrap', $tmpPath . '/bootstrap');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::capture();

try {
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
} catch(\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}