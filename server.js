/**
 * @module server
 * @description This is annoyingly important, and annoyingly not easy to fit into
 * the class model which the rest of the application generally follows.  So essentially,
 * one of the most important set of instructions is basically a massive pile of shit
 * in terms of code organization and asthetic style.  Basically this is the instantiation
 * of the express http server which does the heavy lifting to provide the content to a web
 * browser via http requests.  Simply put, it makes it so you can see a website when you go
 * to the location in your browser.  Otherwise, the browser would try to hit the file but not
 * receive any http data back.  Nobody would be talking.  And the browser is lonely.
 *
 * The application is separated into two major sections that is built into the filesystem
 * organization.  (1) Server-side code is in the 'js' folder, primarily serving as the
 * class hierarchy which does the heavy lifting. (2) Client-side code and/or code yeilding
 * a user-interface, web-content, or interface to the server-side is stored in the folder
 * 'web'.
 *
 * @example
 * sudo npm install resume
 * node index.js
 */
const oExpress = require('express'), // Express acts as the HTTP server
    oBodyParser = require('body-parser'), // Body-parser interprets JSON objects sent via HTTP GET/POST
    oOpen = require('open'), // I don't know what this does
    oCompression = require('compression'), // I don't knowff what this does either
    oServeIndex = require('serve-index'), // Serve-index pushes content in a folder to the web as a directory
    oPath = require('path'),
    Router = require('./js/Router'), // Router is an internally developed module to handle GET/POST requests
    oMultipart = require('connect-multiparty'); // This module processes files over GET/POST

/**
 * Setting up the filesystem to host the UI5 content /The web application
 * @property   {String}  sPort        The HTTP port to access the application
 *                                    via the browser
 * @property   {String}  sPublicPath  The path to hit via browser
 * @property   {String}  sDirectory   The filesystem to provide to the browser
 * @property   {String}  sLaunchUrl   Location to access the web application
 * @property   {String}  sYear        Can't remember what this is for
 */
var sPort = process.env.PORT || 8080,
    sPublicPath = '/sapui5',
    sDirectory = __dirname +
            sPublicPath,
    sLaunchUrl = 'http://localhost:' +
            sPort +
            sPublicPath,
    sYear = 60 * 60 * 24 * 365 * 1000;

// Instantiate node modules
var oApp = oExpress().use(oCompression());
var oMultipartMiddleware = oMultipart();

// Rather than use default express router, maintain that as a class/sub-module
var oRouter = new Router(oApp, oExpress);
oExpress.static.mime.default_type = "text/xml";

// Configure Express to use the loaded modules
oRouter.setMiddleware("bodyParser", oBodyParser, {'jsonParser': oBodyParser.json()});
oRouter.setMiddleware("multipart", oMultipartMiddleware, {'multupart': oMultipartMiddleware});
oApp.use(oBodyParser.json());
oApp.use(oBodyParser.urlencoded({extended: true}));
oApp.use(sPublicPath, oExpress.static(sDirectory, {
    maxAge: sYear,
    hidden: true
}));
oApp.use("/web/controller", oExpress.static(__dirname + "/web/controller"));
oApp.use("/web/view", oExpress.static(__dirname + "/web/view"));
oApp.use("/web/models", oExpress.static(__dirname + "/web/models"));
oApp.use("/web/view/blocks", oExpress.static(__dirname + "/web/view/blocks"));
//oApp.use("/web/fragments", oExpress.static(__dirname + "/web/fragments"));

//oApp.use("/ui5", oServeIndex(__dirname + sPublicPath, {'icons': true}));
oApp.use("/sapui5", oServeIndex(__dirname + sPublicPath, {'icons': true}));

/* Assign all HTTP destinations, begin listening on the port, and open the local web browser to the web folder to load the index.html file, which is the entrance to the application */
oRouter.getRoutes();
oApp.listen(sPort);
oOpen('http://localhost:8080/web');

console.log("resume web-server running at\n  => " + sLaunchUrl + " \nCTRL + C to shutdown");