/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.declare('test.sap.apf.ui.utils.tPromiseBasedCreateReadRequest');
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require('sap.apf.ui.utils.promiseBasedCreateReadRequest');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.core.constants');
(function() {
	module("Promise Based Create Read Request Tests", {
		setup : function() {
			var self = this;
			this.oFilterStub = new sinon.stub();
			this.oFilterStub.returns(new sap.apf.utils.Filter(new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging()));
			this.sendRequestSpy = sinon.stub();
			this.oCoreApiStub = {
				createReadRequestByRequiredFilter : sinon.stub().returns({
					send : self.sendRequestSpy
				}),
				createFilter : this.oFilterStub
			};
		},
		teardown : function() {
			return;
		}
	});
	asyncTest("Promise Based CR", function() {
		this.sendRequestSpy.callsArgWith(1, [ 1, 2, 3 ], {
			type : "metadata"
		});
		var promiseBasedCR = new sap.apf.ui.utils.PromiseBasedCreateReadRequest(this.oCoreApiStub, "sRequestId");
		ok(promiseBasedCR, "Promise Based CR generated.");
		equal(this.oCoreApiStub.createReadRequestByRequiredFilter.args[0][0], "sRequestId", "createReadRequestByRequiredFilter inovked with corresponding request Id.");
		ok(this.oCoreApiStub.createFilter.calledOnce, "Empty Filter Created.");
		ok(this.sendRequestSpy.args[0][0] instanceof sap.apf.utils.Filter && typeof this.sendRequestSpy.args[0][1] === 'function', "sendRequest invoked with appropriate arguments.");
		promiseBasedCR.then(function(oArg) {
			var oExpectedArgument = {
				aData : [ 1, 2, 3 ],
				oMetadata : {
					type : "metadata"
				}
			};
			equal(JSON.stringify(oArg), JSON.stringify(oExpectedArgument), "Promise Based CR resolved with appropriate arguments.");
			start();
		});
	});
	asyncTest("Promise Based CR - Negative Test", function() {
		this.sendRequestSpy.callsArgWith(1, [], {
			type : undefined
		});
		var promiseBasedCR = new sap.apf.ui.utils.PromiseBasedCreateReadRequest(this.oCoreApiStub, "sRequestId");
		promiseBasedCR.then(function(oArg) {
			var oExpectedArgument = {
				aData : [],
				oMetadata : {
					type : undefined
				}
			};
			equal(JSON.stringify(oArg), JSON.stringify(oExpectedArgument), "Promise Based CR rejected with appropriate arguments.");
			start();
			return;
		});
	});
}());