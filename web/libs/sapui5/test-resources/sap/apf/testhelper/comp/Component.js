

jQuery.sap.declare('sap.apf.testhelper.comp.Component');

jQuery.sap.require('sap.apf.base.Component');


sap.apf.base.Component.extend("sap.apf.testhelper.comp.Component", {
	
	metadata : {
		"config" : {
			"fullWidth" : true
		},
		"name" : "sap.apf.testhelper.comp.Component",
		"version" : "1.3.0",
		"manifest": "json"
	},
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	init : function() {
		
		sap.apf.base.Component.prototype.init.apply(this, arguments);
	},
	/**
	 * Creates the application layout and returns the outer layout of APF 
	 * @returns
	 */
	createContent : function() {
		sap.apf.base.Component.prototype.init.apply(this, arguments);
	}
});
