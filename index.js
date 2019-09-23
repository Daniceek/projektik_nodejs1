const http = require("http");

let x = 0;

http.createServer((req, res) => {
    if (req.url == "/") {
        x++;
    }
    res.writeHead(200, {"ContentType" : "text/html"});
    res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Součet je ' + x +'</body></html>');
}).listen(8888);
