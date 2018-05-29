function router(oApp, oExpress) {
    'use strict';
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
}

router.prototype.loadRoutes = function() {
    'use strict';
    var that = this;
    
    this.app.get("/web", function(oRequest, oResponse) {
        oResponse.redirect("/web/nav/index.html");
    });

    this.app.get("/ui5", function(oRequest, oResponse) {
        oResponse.redirect("/web/ui5/index.html");
    });    
};

router.prototype.setMiddleware = function(sName, oMiddleware, mSettings) {
    'use strict';
    this[sName] = oMiddleware;
    var oProperties = Object.getOwnPropertyNames(mSettings);
    for (var i = 0; i < oProperties.length; i++) {
        this[oProperties[i]] = mSettings[oProperties[i]];
    }
};

module.exports = router;