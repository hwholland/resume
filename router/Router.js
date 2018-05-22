//var redis = require('../db/Redis');
var Record = require('../db/Record');
var Entity = require('../db/Entity');
//var routes = require('./default');

function Router(oApp, oExpress) {
    'use strict';

    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    //this.redis = new redis();
    //this.redis.connect(1);

}

Router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;
    /*
    var oMetadata = routes.metadata();
    for(var i = 0; i < oMetadata.length; i++) {
        if(oMetadata[i].get) {
            this.app.get(oMetadata[i].path, routes[oMetadata[i].get]);
        }
        else {
            this.app.post(oMetadata[i].path, routes[oMetadata[i].post]);
        }
        
    }
    */
    
    this.app.get("/web", function(oRequest, oResponse) {
        oResponse.redirect("/web/app.html");
    });
    
    /*
    this.app.post("/db/record", this.jsonParser, function(oRequest, oResponse) {
        var oConfig = oRequest.body.config;
        oConfig.db = "redis";
        var oData = oRequest.body.data;
        var oCore = new db(oConfig, oData);
        oCore
    });
    */
   
    this.app.post("/db/record", this.jsonParser, function(oRequest, oResponse) {
        var oConfig = oRequest.body.config;
        var oData = oRequest.body.data;
        var pPromise = new Promise((resolve, reject) => {
            var fnCallback = function(msg) {
                resolve(msg);
            };
            var oRecord = new Record(oConfig, oData, fnCallback);
        }).then(function(msg) {
            oResponse.send(msg);
            //console.log(oCore);
            //oResponse.send(oData.toString());
        });
    });
    this.app.post("/db/view", this.jsonParser, function(oRequest, oResponse) {
        var oConfig = oRequest.body.config;
        console.log(oConfig);
        var pPromise = new Promise((resolve, reject) => {
            var fnCallback = function(msg) {
                resolve(msg);
            };
            var oEntity = new Entity(oConfig, fnCallback);
        }).then(function (msg) {
            console.log("/db/view");
            oResponse.send(msg);
            //console.log(oCore);
            //oResponse.send(oData.toString());
        });
    });
};

Router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    'use strict';
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = Router;