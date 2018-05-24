const path = require('path');

/**
 * The router is responsible for handling GET/POST requests that 
 * are sent to the Express HTTP server.  This doesn't technically
 * have to be a seperate module, but in interest of code management
 * it made sense to separate these functions into a different file
 * because there will be a large quantity of endpoints specified 
 * here, which would get cluttered otherwise.
 *
 * @module     resume.js.Router
 * @param      {Object}  oApp      The current application
 * @param      {Object}  oExpress  The Express HTTP server
 */
function Router(oApp, oExpress) {
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
}

/**
 * Defines the routes to be assigned to the Express module.
 * 
 * @method     getRoutes
 */
Router.prototype.getRoutes = function() {
    var that = this;

    this.app.get("/", function(oRequest, oResponse) {
        oResponse.redirect("/web/app.html");
    });

    this.app.get("/web", function(oRequest, oResponse) {
        oResponse.redirect("/web/app.html");
    });

    this.app.get("/web/app.html", function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../web/app.html'));
    });

    this.app.get("/web/app.html#/*", function(oRequest, oResponse) {
        //console.log(oRequest.params);
    });

    this.app.get("/web/Component.js", function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../web/Component.js'));
    });

    this.app.get("/web/Component-preload.js",  function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../web/Component-preload.js'));
    });

    this.app.get("/web/manifest.json",  function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../web/manifest.json'));
    });

    this.app.get("/ui5/sap-ui-core.js", function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../ui5/sap-ui-core.js'));
    });

    this.app.get("/sapui5/sap-ui-core.js", function(oRequest, oResponse) {
        oResponse.sendFile(path.join(__dirname + '/../sapui5/sap-ui-core.js'));
    });

    this.app.get("/libs/*", function(oRequest, oResponse) {
        var sParam = oRequest.params[0];
        oResponse.sendFile(path.join(__dirname + '/../libs/' + sParam));
    });

    this.app.get("/web/model/*", function(oRequest, oResponse) {
        //console.log(oRequest);
        console.log(oRequest.params[0]);
        oResponse.sendFile(path.join(__dirname + '/../web/model/' +oRequest.params[0]));
    });

    this.app.post("/public/uploads", that.multipart, function(oRequest, oResponse) {
        oResponse.send("Ok");
        var pPromise = new Promise((resolve, reject) => {}).then(function(sResult) {});
    });    
};

/**
 * Assign a middleware module to the application, primarily
 * used for parsing middleware of various sorts, such as JSON
 * parsers or file (csv) parsers - to handle scenarios such 
 * as user uploads.
 * 
 * @method     setMiddleware
 *
 * @param      {String}  sName        The module name of the middleware
 * @param      {Object}  oMiddleware  The instantiated middleware object 
 * @param      {Object}  mSettings    A map of settings required to apply
 */
Router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = Router;