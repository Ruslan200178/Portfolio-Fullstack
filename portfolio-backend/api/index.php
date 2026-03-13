<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$appPath = '/var/task/user';
$tmpPath = '/tmp/laravel';

// Create writable directories in /tmp
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

// Copy bootstrap cache to /tmp
foreach (glob($appPath . '/bootstrap/cache/*.php') as $file) {
    $dest = $tmpPath . '/bootstrap/cache/' . basename($file);
    copy($file, $dest);
}

require $appPath . '/vendor/autoload.php';

define('LARAVEL_START', microtime(true));

// Set storage path BEFORE app loads
putenv('APP_STORAGE_PATH=' . $tmpPath . '/storage');

$app = require_once $appPath . '/bootstrap/app.php';

// Override storage path immediately
$app->useStoragePath($tmpPath . '/storage');
$app->instance('path.storage', $tmpPath . '/storage');
$app->instance('path.bootstrap', $tmpPath . '/bootstrap');

// Bind log path
$app->configureMonologUsing(function($monolog) use ($tmpPath) {
    $monolog->pushHandler(
        new \Monolog\Handler\StreamHandler(
            $tmpPath . '/storage/logs/laravel.log',
            \Monolog\Logger::DEBUG
        )
    );
});

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::capture();

try {
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
} catch(\Throwable $e) {
    echo "Error: " . $e->getMessage();
    echo "<br>File: " . $e->getFile();
    echo "<br>Line: " . $e->getLine();
}