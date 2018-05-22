jQuery.sap.declare("sap.apf.testhelper.doubles.apfConsumerComponent");
//sap.ui.getCore().loadLibrary("sap.apf");  // FIXME comment it out under KARMA !!
jQuery.sap.require("sap.apf.Component");
sap.apf.Component.extend("sap.apf.testhelper.doubles.ApfConsumerComponent", {
    oApi : null,
    metadata : {
        "name" : "Component",
        "version" : "0.0.0"
    },
    /**
     * Initialize the application
     *
     * @returns {sap.ui.core.Control} the content
     */
    init : function() {
        sap.apf.Component.prototype.init.apply(this, arguments);
    },
    /**
     * Creates the application layout and returns the outer layout of APF
     * @returns
     */
    createContent : function() {
        this.oApi = this.getApi();
        this.oApi.loadApplicationConfig("/pathOfNoInterest/applicationConfiguration.json");
        sap.apf.Component.prototype.createContent.apply(this, arguments);
    },
    getApi: function () { // expose apf api for test reasons (no need for productive)
        return this.oApi;
    }
});