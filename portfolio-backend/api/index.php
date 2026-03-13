<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $pdo = new PDO(
        'pgsql:host=ep-rapid-wave-aduw4n4n-pooler.c-2.us-east-1.aws.neon.tech;port=5432;dbname=neondb;sslmode=require',
        'neondb_owner',
        'npg_s29rCxSNeGRw'
    );
    echo "DB Connected! ✅";
} catch(\Exception $e) {
    echo "DB Error: " . $e->getMessage();
}