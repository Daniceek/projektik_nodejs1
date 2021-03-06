const createSpaServer = require("spaserver").createSpaServer;
const http = require("http");
const dateFormat = require("dateformat");
const fs = require('fs');
const  url = require("url");
const apiDenVTydnu = require("./api-denvtydnu").apiDenVTydnu;
const apiSvatky = require("./api-svatky").apiSvatky;
const apiChat = require("./api-chat").apiChat;
const apiUsers = require("./api-users").apiUsers;
const uniqid = require("uniqid");

const DNY = ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"]
const SVATKY = new Array();
SVATKY[1] = [ "", 'Nový rok', 'Karina', 'Radmila', 'Diana', 'Dalimil', 'Tři králové', 'Vilma', 'Čestmír', 'Vladan', 'Břetislav', 'Bohdana', 'Pravoslav', 'Edita', 'Radovan', 'Alice', 'Ctirad', 'Drahoslav', 'Vladislav', 'Doubravka', 'Ilona', 'Běla', 'Slavomír', 'Zdeněk', 'Milena', 'Miloš', 'Zora', 'Ingrid', 'Otýlie', 'Zdislava', 'Robin', 'Marika'];
SVATKY[2] = [ "", 'Hynek', 'Nela a Hromnice', 'Blažej', 'Jarmila', 'Dobromila', 'Vanda', 'Veronika', 'Milada', 'Apolena', 'Mojmír', 'Božena', 'Slavěna', 'Věnceslav', 'Valentýn', 'Jiřina', 'Ljuba', 'Miloslava', 'Gizela', 'Patrik', 'Oldřich', 'Lenka', 'Petr', 'Svatopluk', 'Matěj', 'Liliana', 'Dorota', 'Alexandr', 'Lumír', 'Horymír'];
SVATKY[3] = [ "", 'Bedřich', 'Anežka', 'Kamil', 'Stela', 'Kazimír', 'Miroslav', 'Tomáš', 'Gabriela', 'Františka', 'Viktorie', 'Anděla', 'Řehoř', 'Růžena', 'Rút a Matylda', 'Ida', 'Elena a Herbert', 'Vlastimil', 'Eduard', 'Josef', 'Světlana', 'Radek', 'Leona', 'Ivona', 'Gabriel', 'Marián', 'Emanuel', 'Dita', 'Soňa', 'Taťána', 'Arnošt', 'Kvido'];
SVATKY[4] = [ "",'Hugo', 'Erika', 'Richard', 'Ivana', 'Miroslava', 'Vendula', 'Heřman a Hermína', 'Ema', 'Dušan', 'Darja', 'Izabela', 'Julius', 'Aleš', 'Vincenc', 'Anastázie', 'Irena', 'Rudolf', 'Valérie', 'Rostislav', 'Marcela', 'Alexandra', 'Evžénie', 'Vojtěch', 'Jiří', 'Marek', 'Oto', 'Jaroslav', 'Vlastislav', 'Robert', 'Blahoslav'];
SVATKY[5] = [ "",'Svátek práce', 'Zikmund', 'Alexej', 'Květoslav', 'Klaudie', 'Radoslav', 'Stanislav', 'Statní svátek - Ukončení II. světové války', 'Ctibor', 'Blažena', 'Svatava', 'Pankrác', 'Servác', 'Bonifác', 'Žofie', 'Přemysl', 'Aneta', 'Nataša', 'Ivo', 'Zbyšek', 'Monika', 'Emil', 'Vladimír', 'Jana', 'Viola', 'Filip', 'Valdemar', 'Vilém', 'Maxim', 'Ferdinand', 'Kamila'];
SVATKY[6] = [ "",'Laura', 'Jarmil', 'Tamara', 'Dalibor', 'Dobroslav', 'Norbert', 'Iveta', 'Medard', 'Stanislava', 'Gita', 'Bruno', 'Antonie', 'Antonín', 'Roland', 'Vít', 'Zbyněk', 'Adolf', 'Milan', 'Leoš', 'Květa', 'Alois', 'Pavla', 'Zdeňka', 'Jan', 'Ivan', 'Adriana', 'Ladislav', 'Lubomír', 'Petr a Pavel', 'Šárka'];
SVATKY[7] = [ "",'Jaroslava', 'Patricie', 'Radomír', 'Prokop', 'Státní svátek , Cyril a Metoděj', 'Státní svátek , Mistr Jan Hus', 'Bohuslava', 'Nora', 'Drahoslava', 'Libuše a Amálie', 'Olga', 'Bořek', 'Markéta', 'Karolína', 'Jindřich', 'Luboš', 'Martina', 'Drahomíra', 'Čeněk', 'Ilja', 'Vítězslav', 'Magdaléna', 'Libor', 'Kristýna', 'Jakub', 'Anna', 'Věroslav', 'Viktor', 'Marta', 'Bořivoj', 'Ignác'];
SVATKY[8] = [ "",'Oskar', 'Gustav', 'Miluše', 'Dominik', 'Kristián', 'Oldřiška', 'Lada', 'Soběslav', 'Roman', 'Vavřinec', 'Zuzana', 'Klára', 'Alena', 'Alan', 'Hana', 'Jáchym', 'Petra', 'Helena', 'Ludvík', 'Bernard', 'Johana', 'Bohuslav', 'Sandra', 'Bartoloměj', 'Radim', 'Luděk', 'Otakar', 'Augustýn', 'Evelína', 'Vladěna', 'Pavlína'];
SVATKY[9] = [ "",'Linda a Samuel', 'Adéla', 'Bronislav', 'Jindřiška', 'Boris', 'Boleslav', 'Regína', 'Mariana', 'Daniela', 'Irma', 'Denisa', 'Marie', 'Lubor', 'Radka', 'Jolana', 'Ludmila', 'Naděžda', 'Kryštof', 'Zita', 'Oleg', 'Matouš', 'Darina', 'Berta', 'Jaromír', 'Zlata', 'Andrea', 'Jonáš', 'Václav', 'Michal', 'Jeroným'];
SVATKY[10] = [ "",'Igor', 'Olívie a Oliver', 'Bohumil', 'František', 'Eliška', 'Hanuš', 'Justýna', 'Věra', 'Štefan a Sára', 'Marina', 'Andrej', 'Marcel', 'Renáta', 'Agáta', 'Tereza', 'Havel', 'Hedvika', 'Lukáš', 'Michaela', 'Vendelín', 'Brigita', 'Sabina', 'Teodor', 'Nina', 'Beáta', 'Erik', 'Šarlota a Zoe', 'Statní svátek - Vznik Československa', 'Silvie', 'Tadeáš', 'Štěpánka'];
SVATKY[11] = [ "",'Felix', 'Památka zesnulých', 'Hubert', 'Karel', 'Miriam', 'Liběna', 'Saskie', 'Bohumír', 'Bohdan', 'Evžen', 'Martin', 'Benedikt', 'Tibor', 'Sáva', 'Leopold', 'Otmar', 'Mahulena', 'Romana', 'Alžběta', 'Nikola', 'Albert', 'Cecílie', 'Klement', 'Emílie', 'Kateřina', 'Artur', 'Xenie', 'René', 'Zina', 'Ondřej'];
SVATKY[12] = [ "",'Iva', 'Blanka', 'Svatoslav', 'Barbora', 'Jitka', 'Mikuláš', 'Ambrož', 'Květoslava', 'Vratislav', 'Julie', 'Dana', 'Simona', 'Lucie', 'Lýdie', 'Radana', 'Albína', 'Daniel', 'Miloslav', 'Ester', 'Dagmar', 'Natálie', 'Šimon', 'Vlasta', 'Adam a Eva , Štědrý den', '1. svátek vánoční', 'Štěpán , 2. svátek vánoční', 'Žaneta', 'Bohumila', 'Judita', 'David', 'Silvestr'];

let soucet
let x = 0;
let msgs = new Array();
let mereni = new Array();
let tmStart;
let PORT = 8080;

function processApi(req, res) {

    if (req.pathname === "/start") {
        res.writeHead(200, {"ContentType" : "application/json"});
        let m = {};
        let obj = {};
        m.tmStart = new Date().getTime();
        let newId = uniqid();
        mereni[newId] = m;
        obj.id = newId;
        obj.status = "Stopky spusteny";
        res.end(JSON.stringify(obj));
    } else if (req.pathname === "/stop") {
        let obj = {};
        let q = url.parse(req.url, true);
        let tmStop = new Date().getTime();
        let id = q.query.id;
        console.log(id);
        let m = mereni[id];
        obj.status = "Stopky zastaveny";
        obj.durSec = ((tmStop - m.tmStart)/1000).toFixed(1);
        res.end(JSON.stringify(obj));
    }

    if (req.pathname === "/jinastranka") {
        res.writeHead(200, {"ContentType" : "text/html"});
        res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Našel jsi tajnou stránku</body></html>');
    }  else if (req.pathname === "/json") {
        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.jmeno = "Borec";
        obj.prijmeni = "Je Dan";
        res.end(JSON.stringify(obj));



    }  else if (req.pathname === "/priklady/priklad") {

        const MIN_NC = 1;
        const MAX_NC = 100;
        let nc;
        let nc2;
        nc = Math.random();
        nc2 = Math.random();
        console.log(nc);
        console.log(nc2);
        nc = MIN_NC + Math.trunc((MAX_NC-MIN_NC+1)*nc);
        nc2 = MIN_NC + Math.trunc((MAX_NC-MIN_NC+1)*nc2);
        console.log(nc);
        console.log(nc2);
        soucet = nc + nc2;

        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.cislo1 = nc;
        obj.cislo2 = nc2;
        res.end(JSON.stringify(obj));



    }  else if (req.pathname === "/priklady/kontrola") {
        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.vysl = q.query["vysl"];
        obj.true = "spatne";
        let number = obj.vysl;
        if (number == soucet) {
            obj.true = "spravne";
        }
        res.end(JSON.stringify(obj));




    } else if (req.pathname === "/jsonpocet") {
        x++;
        res.writeHead(200, {"ContentType" : "application/json"});
        let obj = {};
        obj.pocet = x;
        res.end(JSON.stringify(obj));
    } else if (req.pathname === "/datum") {
        apiDenVTydnu(req, res);
    } else if (req.pathname === "/svatky") {
        apiSvatky(req, res);
    } else if (req.pathname.startsWith("/chat/")) {
        apiChat(req, res);
    } else if (req.pathname.startsWith("/users/")) {
        apiUsers(req, res);
    } else {
        res.writeHead(200, {"ContentType" : "text/html"});
        res.end('<html lang="cs"><head><meta charset="UTF8"></head><body>Součet je ' + x +'</body></html>');
    }
}

createSpaServer(PORT, processApi);

