/*globals sinon, QUnit*/
jQuery.sap.require("sap.ui.fl.ChangePersistence");
jQuery.sap.require("sap.ui.fl.Utils");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require('sap.ui.fl.LrepConnector');
jQuery.sap.require('sap.ui.core.Control');
jQuery.sap.require("sap.ui.fl.Cache");
jQuery.sap.require("sap.ui.layout.VerticalLayout");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");
jQuery.sap.require("sap.m.Button");

(function(utils, ChangePersistence, Control, Change, LrepConnector, Cache, VerticalLayout, Button, HorizontalLayout) {
	"use strict";
	sinon.config.useFakeTimers = false;

	var stubs = [];
	var controls = [];

	QUnit.module("sap.ui.fl.ChangePersistence", {
		setup: function() {
			this.sComponentName = "MyComponent";
			this.oChangePersistence = new ChangePersistence(this.sComponentName);
		},
		teardown: function() {
			stubs.forEach(function(stub) {
				stub.restore();
			});

			controls.forEach(function(control) {
				control.destroy();
			});
		}
	});

	QUnit.asyncTest('getChangesForView mass shall return the changes that are grouped by the given view id', function(assert) {
		var allChanges = Array.apply(null, {length: 10000}).map(function(element, index) {
			return {
				fileName: "change" + (index + 1) + "Button1",
				fileType: 'change',
				selector: {
					id: "view1--view2--button1"
				}
			};
		});

		stubs.push(sinon.stub(Cache, "getChangesFillingCache").returns(Promise.resolve({
			changes: {
				changes: allChanges
			}
		})));

		var startTime = Date.now();
		this.oChangePersistence.getChangesForView("view1--view2").then(function(changes) {
			assert.strictEqual(changes.length, 10000, '10000 changes retrieved dynamically grouped by view id in ms: ' + (Date.now() - startTime));
			QUnit.start();
		})['catch'](function(oError) {
			assert.ok(false, oError.stack);
			QUnit.start();
		});

	});

}(sap.ui.fl.Utils, sap.ui.fl.ChangePersistence, sap.ui.core.Control, sap.ui.fl.Change, sap.ui.fl.LrepConnector, sap.ui.fl.Cache, sap.ui.layout.VerticalLayout, sap.m.Button, sap.ui.layout.HorizontalLayout));