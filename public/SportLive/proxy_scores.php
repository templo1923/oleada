<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=utf-8");

function fetchUrl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_ENCODING, ""); 
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

// Traemos Football.com
$html = fetchUrl("https://www.football.com/livescore/es");

// Solo inyectamos la base para que funcionen sus enlaces. Nada de ocultar cosas.
$base = '<base href="https://www.football.com/">';
$html = str_replace('<head>', '<head>' . $base, $html);

echo $html;
?>