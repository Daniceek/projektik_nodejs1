const dateFormat = require("dateformat");
const DNY = ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"]

exports.apiDenVTydnu =  function (req, res) {
    res.writeHead(200, {"ContentType" : "application/json",
    });
    let d = new Date();
    let obj = {};
    obj.systdate = d;
    obj.den = d.getDay();
    obj.datum = d.getDate() + ". " + (d.getMonth()+1) + ". " + d.getFullYear();
    obj.formatdata = dateFormat(d, "dd.mm.yyyy");
    obj.formatdataacasu = dateFormat(d, "dd.mm.yyyy HH:MM:ss");
    obj.cas = d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds();
    obj.denvtydnu = DNY[d.getDay()];
    res.end(JSON.stringify(obj));
}