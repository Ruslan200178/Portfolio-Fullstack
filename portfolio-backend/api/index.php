<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$appPath = '/var/task/user';
$tmpPath = '/tmp/laravel';

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

foreach (glob($appPath . '/bootstrap/cache/*.php') as $file) {
    copy($file, $tmpPath . '/bootstrap/cache/' . basename($file));
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
    echo "Error: " . $e->getMessage();
    echo "<br>File: " . $e->getFile();
    echo "<br>Line: " . $e->getLine();
}
```

---

## Step 3 — Update .env locally
Open `C:\xampp\htdocs\portfolio-backend\.env` and change:
```
LOG_CHANNEL=stderr