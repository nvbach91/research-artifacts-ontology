<?php

/*
.htaccess
# redirect all URL requests to index.php

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>

*/


// index.php
// content negotiation example in PHP (you can also implement this in .htaccess if the server allows it)
// all URL requests will be redirected to this file where the logic for content negotiation is implemented


$url = $_SERVER['REQUEST_URI'];
$origin = substr($_SERVER['REDIRECT_SCRIPT_URI'], 0, -1);

$acceptHeader = $_SERVER['HTTP_ACCEPT'];
$userAgentHeader = $_SERVER['HTTP_USER_AGENT'];

$servingHtml = strpos($acceptHeader, 'application/rdf+xml') === false &&
        (   
            strpos($acceptHeader, 'text/html') !== false ||
            strpos($acceptHeader, 'application/xhtml+xml') !== false ||
            strpos($userAgentHeader, 'Mozilla/') !== false
        );

$path = str_replace($origin, '', $url);

if ($path === '' || $path === '/') {
    readfile('index.html');
    die();
}

if (substr($path, 0, 5) === '/irao') {
    if ($servingHtml) {
        header('Location: https://nvbach91.github.io/informatics-research-artifacts-ontology/OnToology/irao.owl/documentation/index-en.html');
    } else {
        header('Content-Type: application/rdf+xml');
        readfile('irao.xml');
    }
}

?>
