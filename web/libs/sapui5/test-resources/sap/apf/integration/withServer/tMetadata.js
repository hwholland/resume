/*global OData*/
jQuery.sap.declare('sap.apf.integration.withServer.tMetadata');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require('sap.apf.testhelper.createDefaultAnnotationHandler');

QUnit.module('Metadata: Entity sets', {
	beforeEach : function(assert) {
		var done = assert.async();
		this.messageHandler = new sap.apf.core.MessageHandler();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
			var coreApi = new sap.apf.core.Instance({
				instances: {
					messageHandler : this.messageHandler
				}
			});
			this.metadata = new sap.apf.core.Metadata({
				constructors : {
					hashtable : sap.apf.utils.Hashtable
				},
				instances : {
					messageHandler : this.messageHandler,
					coreApi : coreApi,
					annotationHandler : sap.apf.testhelper.createDefaultAnnotationHandler()
				}	
			}, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
			done();
		}.bind(this));
	}
});
QUnit.test('Get correct entity sets considering parameter entity sets', function(assert) {
	var entitySets = this.metadata.getEntitySets();
	var expectedEntitySets = [ "WCAClearedReceivableQuery", "WCADaysSalesOutstandingQuery", "WCADSORevenueQuery", "WCAIndirectDSOQuery", "WCAIndirectDSOHistoryQuery", "WCAReceivableHistoryQuery", "WCARevenueQuery", "WCAOpenReceivableQuery",
			"WCAReceivableQuery", "CompanyCodeQueryResults", //this and following are no parameter entity sets
			"CurrencyQueryResults", "YearMonthQueryResults", "ExchangeRateQueryResults", "SAPClientQueryResults" ];
	assert.deepEqual(entitySets, expectedEntitySets, "Correct entity sets of '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/' received");
});