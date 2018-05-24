jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.testhelper.comp.Component");

QUnit.module('Help functions located in URI Generator', {
	beforeEach : function(assert) {
		this.oUriGenerator = sap.apf.core.utils.uriGenerator;
		this.oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
	}
});


QUnit.test("Add relative to absolute URL", function( assert ) {
	var sUri = this.oUriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', '../resources/i18n/texts.properties');
    assert.equal(sUri, '/sap/apf/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
    var sUri = this.oUriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', './resources/i18n/texts.properties');
    assert.equal(sUri, '/sap/apf/base/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
    var sUri = this.oUriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', '../../resources/i18n/texts.properties');
    assert.equal(sUri, '/sap/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
});

QUnit.test("Get URL for a given Component", function( assert ) {
	var bLocationFound;
	var sUrl = this.oUriGenerator.getBaseURLOfComponent('sap.apf.testhelper.comp.Component');
	if (sUrl.indexOf("/testhelper/comp") !== -1) {
		bLocationFound = true;
	}
	assert.equal(bLocationFound, true, "Component Path found in the URL.");
});

QUnit.test('Absolute Path for service root', function( assert ) {
	var sUri = this.oUriGenerator.getAbsolutePath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
	assert.equal(sUri, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/', "Correct absolute path with slash at end.");
	sUri = this.oUriGenerator.getAbsolutePath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
	assert.equal(sUri, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/', "Correct absolute path last slash fixed.");

});

QUnit.test('OData path', function( assert ) {
	var sUri = this.oUriGenerator.getODataPath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
	assert.equal(sUri.toLowerCase(), '/sap/hba/apps/wca/dso/s/odata/', "UriGenerator build odata address correctly");
});

QUnit.test('Get APF location origin', function( assert ) {
	var sUrl = this.oUriGenerator.getApfLocation();
    var bLocationFound;
	if (sUrl.indexOf("/sap/apf/") !== -1) {
		bLocationFound = true;
	}
	assert.equal(bLocationFound, true, "Path /sap/apf/ found in the URL.");
});

QUnit.module('Build URI', {
	beforeEach : function(assert) {
		this.oUriGenerator = sap.apf.core.utils.uriGenerator;
		this.oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
	}
});

QUnit.test('Without parameter value', function( assert ) {
	var sExpected = "entityTypeWithParamsResults?$select=propertyOne,propertyTwo&$format=json";
	var sUri = this.oUriGenerator.buildUri(this.oCoreApi, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});
QUnit.test('Without parameter value and empty navigationProperty string', function( assert ) {
	var sExpected = "entityTypeWithParams?$select=propertyOne,propertyTwo&$format=json";
	var sUri = this.oUriGenerator.buildUri(this.oCoreApi, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});
QUnit.test('Deep empty filter', function(assert) {
	var filterLevel1 = new sap.apf.core.utils.Filter(this.oMsgHandler);
	filterLevel1.addAnd(new sap.apf.core.utils.Filter(this.oMsgHandler));
	filterLevel1.addAnd(new sap.apf.core.utils.Filter(this.oMsgHandler));
	var filter = new sap.apf.core.utils.Filter(this.oMsgHandler);
	filter.addAnd(new sap.apf.core.utils.Filter(this.oMsgHandler));
	filter.addAnd(filterLevel1);
	var uri = this.oUriGenerator.buildUri(this.oCoreApi, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], filter, {}, undefined, undefined, undefined,undefined,"Results",this.metadata);
	assert.strictEqual(uri, "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json", "$filter is not present");
});
QUnit.test('With one parameter value', function( assert ) {
	var oParameter = {
		p_param2 : 20
	};
	var sExpected = "entityTypeWithParams(p_param2=20)/Results?$select=propertyOne,propertyTwo&$format=json";
	var sUri = this.oUriGenerator.buildUri(this.oCoreApi, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, oParameter, undefined, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('With three parameter values', function( assert ) {
	var oParameter = {
		p_param1 : 10,
		p_param2 : 20,
		p_param3 : 30
	};
	var sExpected = "entityTypeWithParams(p_param1=10,p_param2=20,p_param3=30)/Results?$select=propertyOne,propertyTwo&$format=json";
	var sUri = this.oUriGenerator.buildUri(this.oCoreApi, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, oParameter, undefined, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.module('OData system query option', {
	beforeEach : function(assert) {
		this.oUriGenerator = sap.apf.core.utils.uriGenerator;

		this.oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();

	},
	afterEach : function(assert) {

	}
});

QUnit.test('Option "top"', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$format=json";
	var oPaging = {
		top : 50
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Option "skip"', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$skip=100&$format=json";
	var oPaging = {
		skip : 100
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Options "top" and "skip"', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$skip=100&$format=json";
	var oPaging = {
		top : 50,
		skip : 100
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Option "inlinecount"', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$inlinecount=allpages&$format=json";
	var oPaging = {
		inlineCount : true
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Options "inlinecount", "skip" and "top"', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$skip=100&$inlinecount=allpages&$format=json";
	var oPaging = {
		top : 50,
		skip : 100,
		inlineCount : true
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Wrong paging option gives technical error', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$skip=100&$inlinecount=allpages&$format=json";
	var oPaging = {
		topp : 50,
		skip : 100,
		inlineCount : true
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5032', 'Correct message code expected');
});
QUnit.test('Paging options omitted if "paging" parameter is empty or undefined', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
	var oPaging = {};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, '$top and $skip and $inlinecount omitted if paging-parameter is empty object');
	oPaging = undefined;
	sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, '$top and $skip and $inlinecount omitted if paging-parameter is "undefined"');
});

QUnit.test('Option "orderby" - single property as string', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyTwo%20asc&$format=json";
	var sOrderby = 'propertyTwo';
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, sOrderby, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Option "orderby" - single property as object', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyTwo%20desc&$format=json";
	var oOrderby = {
		property : 'propertyTwo',
		descending : true
	};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oOrderby, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Option "orderby" - multiple properties as array of objects', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo,propertyThree,propertyFour&$orderby=propertyTwo%20asc,propertyFour%20desc,propertyThree%20asc&$format=json";
	var aOrderby = [ {
		property : 'propertyTwo'
	}, {
		property : 'propertyFour',
		descending : true
	}, {
		property : 'propertyThree',
		descending : false
	} ];
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo", "propertyThree", "propertyFour" ], {}, {}, aOrderby, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
});

QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
	var orderby = 'propertyThree';
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results");

	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5019', 'Correct message code expected');
});

QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
	var orderby = {
		property : 'propertyThree',
		descending : true
	};

	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results");

	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5019', 'Correct message code expected');
});

QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyOne%20desc&$format=json";
	var orderby = [ {
		property : 'propertyThree'
	}, {
		property : 'propertyOne',
		descending : true
	}, {
		property : 'propertyFour',
		descending : false
	} ];

	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');

	assert.equal(this.oMsgHandler.spyResults.putMessage[0].code, '5019', 'Correct message code expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage[0].aParameters[0], 'entityTypeWithoutParams', 'Correct property as message parameter expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage[0].aParameters[1], 'propertyThree', 'Correct property as message parameter expected');
	assert.equal(this.oMsgHandler.spyResults.putMessage[1].aParameters[1], 'propertyFour', 'Correct property as message parameter expected');
});

QUnit.test('"Orderby" option omitted if "sortingFields" parameter is empty or undefined', function( assert ) {
	var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
	var oSortingFields = {};
	var sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oSortingFields, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, '$orderby omitted if sortingFields-parameter is empty object');
	sUri = this.oUriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oSortingFields, undefined, undefined,undefined,"Results");
	assert.equal(sUri, sExpected, '$orderby omitted if sortingFields-parameter is "undefined"');
});