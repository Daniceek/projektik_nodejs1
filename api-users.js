const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();


let users = new Array();

exports.apiUsers = function (req, res) {
    let q = url.parse(req.url, true);
    if (q.pathname == "/users/listusers") {
        res.writeHead(200, {
            "Content-type": "application/json",
        });
        let obj = {};
        obj.users = users;
        res.end(JSON.stringify(obj));
    } else if (q.pathname == "/users/adduser") {
        let data = "";
        req.on('data', function (chunk) {
            try {
                data += chunk;
            } catch (e) {
                console.error(e);
            }
        })
        req.on('end', function () {
            req.rawBody = data;
            if (data) {
                let params = JSON.parse(data);
                res.writeHead(200, {
                    "Content-type": "application/json",
                });
                let obj = {};
                obj.jmeno = entities.encode(params["nickname"]);
                obj.heslo = entities.encode(params["password"]);
                users.push(obj);
                res.end(JSON.stringify(obj));
            }
        })
    }
};