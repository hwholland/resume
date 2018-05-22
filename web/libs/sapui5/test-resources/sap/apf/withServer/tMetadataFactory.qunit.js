jQuery.sap.declare('sap.apf.tests.withServer.tMetadataFactory');

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');

jQuery.sap.registerModulePath('sap.apf.internal.server', '../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.ajax');
jQuery.sap.require('sap.apf.core.sessionHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.core.metadata');

/*globals OData */

module('Metadata', {
	setup : function() {
		QUnit.stop();
		this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		var oMessageHandler = this.oMessageHandler;
		this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			messageHandler : this.oMessageHandler
		}).doubleContext();
		
		this.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
			sap.apf.core.odataRequestWrapper(oMessageHandler,oRequest, fnSuccess, fnError, oBatchHandler );
		};
		
		this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
			return this.oAuthTestHelper.getXsrfToken();
		}.bind(this);
		
		this.oMetadataInject = {};
		this.oMetadataInject.coreApi = this.oCoreApi;
		this.oMetadataInject.messageHandler = this.oMessageHandler;
		this.oMetadataInject.hashtable = sap.apf.utils.Hashtable;
		this.oMetadataInject.entityTypeMetadata = sap.apf.core.EntityTypeMetadata;
		this.oMetadataInject.datajs = OData;
		this.oMetadataInject.metadata = sap.apf.core.Metadata;
	
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function () {
			this.oMetadataFactory = new sap.apf.core.MetadataFactory(this.oMetadataInject);
			QUnit.start();
		}.bind(this));
		
	
	},
	teardown : function() {
	}
});

test('Same metadata instance returned if retrieved twice for service root', function() {
	var oFirstRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
	var oSecondRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
	ok(oFirstRetrieval, 'Instance expected');
	equal(oFirstRetrieval, oSecondRetrieval, 'Same instance expected');
});

test('Same entity type metadata instance returned if retrieved twice for service root and entity type', function() {
	var oFirstRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
	var oSecondRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
	ok(oFirstRetrieval, 'Instance expected');
	equal(oFirstRetrieval, oSecondRetrieval, 'Same instance expected');
});
