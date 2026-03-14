<?php
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
    if (!is_dir($dir)) mkdir($dir, 0775, true);
}

foreach (glob($appPath . '/bootstrap/cache/*.php') as $file) {
    copy($file, $tmpPath . '/bootstrap/cache/' . basename($file));
}

putenv('VIEW_COMPILED_PATH=' . $tmpPath . '/storage/framework/views');

require $appPath . '/vendor/autoload.php';
define('LARAVEL_START', microtime(true));

$app = require_once $appPath . '/bootstrap/app.php';
$app->useStoragePath($tmpPath . '/storage');
$app->instance('path.storage', $tmpPath . '/storage');
$app->instance('path.bootstrap', $tmpPath . '/bootstrap');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

try {
    $tokens = \Illuminate\Support\Facades\DB::table('personal_access_tokens')->get();
    header('Content-Type: application/json');
    echo json_encode(['count' => $tokens->count(), 'tokens' => $tokens]);
} catch(\Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
