const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
const fs = require('fs');
const crypto = require("crypto");

let users = new Array();
if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

let loggedUsers = new Array();


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
    if (req.pathname == "/users/listusers") {
        res.writeHead(200, {
            "Content-type": "application/json",
        });
        let obj = {};
        obj.users = users;
        res.end(JSON.stringify(obj));
    } else if (req.pathname == "/users/adduser") {
        res.writeHead(200, {
            "Content-type": "application/json",
        });
        let obj = {};
        obj.jmeno = req.parameters.nickname;
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
            obj.heslo = hashovat(req.parameters.password);
            users.push(obj);
            fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

        }
        res.end(JSON.stringify(obj));
    } else if (req.pathname == "/users/login") {
        res.writeHead(200, {
            "Content-type": "application/json",
        });
        let obj = {};
        let login = req.parameters.login;
        obj.error = "invalid login or password";
        for (let u of users) {
            if (u.jmeno === req.parameters.nickname) {
                if (u.heslo === hashovat(req.parameters.password)) {
                    obj.name = u.jmeno;
                    obj.error = null;
                    console.log(u.heslo);
                    let token = crypto.randomBytes(16).toString('hex'); //32 nahodnych znaku
                    obj.token = token;
                    let objLoggedUser = {};
                    objLoggedUser.name = u.jmeno;
                    loggedUsers[token] = objLoggedUser;
                }
                break;
            }
        }
        res.end(JSON.stringify(obj));
    }
};

exports.getLoggedUser = function (token) {
    let u = loggedUsers[token];
    return u;
}