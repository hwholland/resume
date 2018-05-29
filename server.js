/**
* @module server
* @details Basically this is the instantiation
* of the express http server which does the heavy lifting to provide the content to a web
* browser via http requests.  Simply put, it makes it so you can see a website when you go
* to the location in your browser.  Otherwise, the browser would try to hit the file but not
* receive any http data back.  Nobody would be talking.  And the browser is lonely.
*
* @example
* sudo npm install
* node index.js
*
* @param express express acts as the HTTP server
* @param bodyParser Allows the router to handle JSON objects passed through a POST
* @param open Opens a page when a node application launches via command line
* @param compression Compresses response bodies of requests
* @param serveIndex Serve-index pushes content in a folder to the web as a directory
* @param path Provides easier API for interacting with filesystem
* @param router Router is an internal module to handle GET/POST requests
*
* @return [description]
*/
const express = require("express");
const bodyParser = require("body-parser");
const open = require("open");
const compression = require("compression");
const serveIndex = require("serve-index");
const path = require("path");
const router = require("./router");
var oApp = express().use(compression());
var oRouter = new router(oApp, express);

express.static.mime.default_type = "text/xml";

oApp.use(bodyParser.urlencoded({extended: false}));

oRouter.setMiddleware("bodyParser", bodyParser, {jsonParser: bodyParser.json()});

oApp.use("/web/ui5", serveIndex(__dirname + "/web/ui5", {icons: true}));
oApp.use("/web/ui5", express.static(__dirname + "/web/ui5"));
oApp.use("/web", express.static(__dirname + "/web"));

oRouter.loadRoutes();
oApp.listen(3000);

open("http://localhost:3000/web/nav/index.html");

console.log("Web-server running at\n  => " + "http://localhost:3000/web" + " \nCTRL + C to shutdown");