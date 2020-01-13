
const crypto = require("crypto");


function hashovat(pw) {
    let hashPw = crypto.createHash("md5").update(pw).digest("hex");
    hashPw = hashPw.split("").reverse().join("");
    for (let i=0; i < 10; i++) { //opakovane hashovani hashe pro zmateni hackera ;-)
                hashPw = crypto.createHash("sha256").update(pw).digest("hex");
            }
    let salt = pw.split("").reverse().join(""); //pozpatku
    hashPw = crypto.createHmac("sha256", salt).update(pw).digest("hex");

    return hashPw;
}


let password = "heslo";
console.log((hashovat(password)))