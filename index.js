const http = require("http");
http.createServer((req, res) => {
    res.writeHead(200, {"ContentType" : "text/html"});
    res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Něco velmi zajímavého</body></html>');
}).listen(8888);
