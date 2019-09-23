const http = require("http");

let x = 0;

http.createServer((req, res) => {
    if (req.url == "/") {
        x++;
    }

    if (req.url == "/jinastranka") {
        res.writeHead(200, {"ContentType" : "text/html"});
        res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Našel jsi tajnou stránku</body></html>');
    }  else if (req.url == "/json") {
        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.jmeno = "Borec";
        obj.prijmeni = "Je Dan";
        res.end(JSON.stringify(obj));
    }  else if (req.url == "/jsonpocet") {
        x++;
        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.pocet = x;
        res.end(JSON.stringify(obj));
    }  else {
        res.writeHead(200, {"ContentType" : "text/html"});
        res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Součet je ' + x +'</body></html>');
    }
}).listen(8888);
