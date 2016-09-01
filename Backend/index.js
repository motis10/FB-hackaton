/// <reference path="typings/express/express.d.ts"/>
/// <reference path="typings/parse/parse.d.ts"/>
/// <reference path="typings/body-parser/body-parser.d.ts"/>
var express = require("express");
var bodyParser = require("body-parser");
var backend_1 = require("./backend");
var parse_1 = require("parse");
var app = express();
parse_1.Parse.initialize("NdI8S94kzL9WfkyMRTaIGARw4HeAR7OA01u41DQE", "Pcts5Dw3ukhBh3KemHe5eRrf3LniBTbvJaSbrs26");
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../frontend/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
    var origin = req.headers["origin"];
    if (origin != null) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");
    // Pass to next layer of middleware
    next();
});
app.get('/', function (request, response) {
    response.render('pages/index');
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
backend_1.setupHacktonService(app);
