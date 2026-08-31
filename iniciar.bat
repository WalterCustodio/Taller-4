@echo off
title Memoria Interactiva
chcp 65001 > nul
echo ==================================================
echo   Iniciando Memoria Interactiva...
echo ==================================================
echo.
echo  Servidor local iniciado en: http://localhost:8000
echo  Abriendo el navegador automáticamente...
echo.
echo  (Para cerrar la aplicación, cierra esta ventana)
echo ==================================================
echo.

:: Abrir el navegador en localhost
timeout /t 2 > nul
start http://localhost:8000

:: Servidor web HTTP local con Node.js
node -e "const http = require('http'), fs = require('fs'), path = require('path'); const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'}; http.createServer((req, res) => { let filePath = '.' + (req.url === '/' ? '/index.html' : req.url.split('?')[0]); let ext = path.extname(filePath); fs.readFile(filePath, (err, data) => { if (err) { res.writeHead(404, {'Content-Type': 'text/plain'}); res.end('404 Not Found'); } else { res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' }); res.end(data); } }); }).listen(8000, () => console.log('Servidor corriendo en http://localhost:8000'));"
