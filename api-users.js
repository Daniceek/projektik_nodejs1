const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const fs = require('fs');
const crypto = require("crypto");

let users = new Array();
if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

function hashovat(pw) {
    //let hashPw = crypto.createHash("md5").update(pw).digest("hex");
    //hashPw = hashPw.split("").reverse().join("");
    //for (let i=0; i < 10; i++) { //opakovane hashovani hashe pro zmateni hackera ;-)
    //    hashPw = crypto.createHash("sha256").update(pw).digest("hex");
    //}
    let salt = pw.split("").reverse().join(""); //pozpatku
    let hashPw = crypto.createHmac("sha256", salt).update(pw).digest("hex");

    return hashPw;
}

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
                let userExists = false;
                for (let u of users) {
                    if (u.jmeno === obj.jmeno) {
                        userExists = true;
                        break;
                    }
                }
                if (userExists) {
                    obj.error = "user exists";
                } else {
                    obj.heslo = hashovat(entities.encode(params["password"]));
                    users.push(obj);
                    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

                }
                res.end(JSON.stringify(obj));
            }
        })
    } else if (q.pathname == "/users/login") {
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
                obj.heslo = hashovat(entities.encode(params["password"]));
                for (let u of users) {
                    if (u.heslo === obj.heslo) {
                        userExists = true;
                        break;
                    }
                }


                res.end(JSON.stringify(obj));
            }
        })
    }
};