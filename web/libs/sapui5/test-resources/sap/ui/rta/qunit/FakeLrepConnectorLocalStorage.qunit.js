/* global QUnit sinon */

(function() {
	"use strict";

	jQuery.sap.require("sap.ui.qunit.qunit-coverage");

	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
	jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

	jQuery.sap.require("sap.ui.rta.qunit.RtaQunitUtils");
	jQuery.sap.require("sap.ui.fl.LrepConnector");
	startFakeLREP("sap.ui.rta.qunit.FakeLrepConnector");

	var FakeLrepConnectorLocalStorage = sap.ui.fl.LrepConnector.createConnector(),
		FakeLrepLocalStorage = sap.ui.rta.util.FakeLrepLocalStorage;

	var oTestData = {};
	oTestData.oChange1 = {"fileName":"id_1445501120486_25","fileType":"change","changeType":"hideControl","component":"sap.ui.rta.test.Demo.md.Component","packageName":"$TMP","content":{},"selector":{"id":"RTADemoAppMD---detail--GroupElementDatesShippingStatus"},"layer":"CUSTOMER","texts":{},"namespace":"sap.ui.rta.test.Demo.md.Component","creation":"","originalLanguage":"EN","conditions":{},"support":{"generator":"Change.createInitialFileContent","service":"","user":""}};
	oTestData.sChangeId1 = oTestData.oChange1.fileName;

	var aTestData = [{"fileName":"id_1449484290389_26","fileType":"change","changeType":"moveFields","component":"sap.ui.rta.test.Demo.md.Component","packageName":"$TMP","content":{"moveFields":[{"id":"RTADemoAppMD---detail--GroupElementGeneralDataAddressStreet","index":1}]},"selector":{"id":"RTADemoAppMD---detail--GroupGeneralData"},"layer":"CUSTOMER","texts":{},"namespace":"sap.ui.rta.test.Demo.md.Component","creation":"","originalLanguage":"EN","conditions":{},"support":{"generator":"Change.createInitialFileContent","service":"","user":""}},{"fileName":"id_1449484290389_27","fileType":"change","changeType":"moveFields","component":"sap.ui.rta.test.Demo.md.Component","packageName":"$TMP","content":{"moveFields":[{"id":"RTADemoAppMD---detail--GroupElementGeneralDataAddressZipCode","index":4}]},"selector":{"id":"RTADemoAppMD---detail--GroupGeneralData"},"layer":"CUSTOMER","texts":{},"namespace":"sap.ui.rta.test.Demo.md.Component","creation":"","originalLanguage":"EN","conditions":{},"support":{"generator":"Change.createInitialFileContent","service":"","user":""}},{"fileName":"id_1449484290389_28","fileType":"change","changeType":"moveFields","component":"sap.ui.rta.test.Demo.md.Component","packageName":"$TMP","content":{"moveFields":[{"id":"RTADemoAppMD---detail--GroupElementDatesShippingStatus","index":4}],"targetId":"RTADemoAppMD---detail--GroupGeneralData"},"selector":{"id":"RTADemoAppMD---detail--GroupDates"},"layer":"CUSTOMER","texts":{},"namespace":"sap.ui.rta.test.Demo.md.Component","creation":"","originalLanguage":"EN","conditions":{},"support":{"generator":"Change.createInitialFileContent","service":"","user":""}}];

	QUnit.module("Given I use SAP RTA Fake Lrep Connector Local Storage", {

		beforeEach : function(assert) {
			FakeLrepConnectorLocalStorage.deleteChanges();
		},
		afterEach : function(assert) {
			FakeLrepConnectorLocalStorage.deleteChanges();
		}
	});

	QUnit.test("when in INITAL status", function(assert) {

		var done = assert.async();
		var aInitalChanges = [];

		FakeLrepConnectorLocalStorage.loadChanges("sap.ui.rta.qunit.FakeLrepConnector")
		.then(function (oChanges) {
			assert.equal(oChanges.changes.changes.length, 0, "then no changes are available");
			done();
		});
	});

	QUnit.module("Give I want to create changes", {

		beforeEach : function(assert) {
			this.fnSaveSpy = sinon.spy(FakeLrepLocalStorage, "saveChange");
			FakeLrepConnectorLocalStorage.deleteChanges();
		},
		afterEach : function(assert) {
			FakeLrepLocalStorage.saveChange.restore();
			FakeLrepConnectorLocalStorage.deleteChanges();
		}
	});

	QUnit.test("when saving a single change", function(assert) {

		var done = assert.async(),
			that = this;

		FakeLrepConnectorLocalStorage.create(oTestData)
		.then(function () {
			assert.equal(that.fnSaveSpy.callCount, 1, "then the Local Storage saves one change.");
			done();
		});
	});

	QUnit.test("when saving three changes", function(assert) {

		var done = assert.async(),
			that = this;

		FakeLrepConnectorLocalStorage.create(aTestData)
		.then(function () {
			assert.equal(that.fnSaveSpy.callCount, 3, "then the Local Storage saves three changes.");
			done();
		});
	});

})();
