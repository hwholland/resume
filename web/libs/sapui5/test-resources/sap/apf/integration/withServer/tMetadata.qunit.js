/*global OData*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.ui.thirdparty.datajs");
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");

module('Entity sets', {
	setup : function() {
		QUnit.stop();
		this.messageHandler = new sap.apf.core.MessageHandler();
		
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
		    
		    var coreApi = new sap.apf.core.Instance({
		        messageHandler : this.messageHandler
		    });
		    
		    
		    this.metadata = new sap.apf.core.Metadata({
		        hashtable : sap.apf.utils.Hashtable, 
		        messageHandler : this.messageHandler,
		        coreApi : coreApi,
		        datajs : OData
		    },'/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
			QUnit.start();
		}.bind(this));
	}
});
test('Get correct entity sets considering parameter entity sets', function() {
    var entitySets = this.metadata.getEntitySets();
    var expectedEntitySets = [  
                                "WCAClearedReceivableQuery",
                                "WCADaysSalesOutstandingQuery",
                                "WCADSORevenueQuery",
                                "WCAIndirectDSOQuery",
                                "WCAIndirectDSOHistoryQuery",
                                "WCAReceivableHistoryQuery",
                                "WCARevenueQuery",
                                "WCAOpenReceivableQuery",
                                "WCAReceivableQuery",
                                "CompanyCodeQueryResults", //this and following are no parameter entity sets
                                "CurrencyQueryResults",
                                "YearMonthQueryResults",
                                "ExchangeRateQueryResults",
                                "SAPClientQueryResults"
                              ];
    deepEqual(entitySets, expectedEntitySets, "Correct entity sets of '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/' received");
});