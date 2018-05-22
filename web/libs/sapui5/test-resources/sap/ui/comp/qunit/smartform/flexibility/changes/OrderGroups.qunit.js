/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.OrderGroups");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (OrderGroupsChangeHandler, Change, SmartForm, SmartFormGroup, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.OrderGroups", {
		beforeEach: function () {
			this.oChangeHandler = OrderGroupsChangeHandler;
		},
		afterEach: function () {
		}
	});

	QUnit.test('Invalid change supplied to applyChange', function (assert) {

		var oSmartForm = new SmartForm();
		var sError;

		// test 1 - content does not contain orderGroups attribute
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"orderFields": ["Id1", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function(){});

		try {
			this.oChangeHandler.applyChange(oChange, oSmartForm, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

		// test 2 - orderGroups array is empty
		oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"orderGroups": []
			},
			"texts": {
			}
		};

		oChange = new Change(oChangeJson, function(){});

		sError = "";
		try {
			this.oChangeHandler.applyChange(oChange, oSmartForm, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

		// test 3 - selector contains more than one key
		oChangeJson = {
			"selector": {
				"id": "testkey",
				"id2": "testkey2"
			},
			"content": {
				"orderGroups": ["Id1", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		oChange = new Change(oChangeJson, function(){});

		sError = "";
		try {
			this.oChangeHandler.applyChange(oChange, oSmartForm, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

	});

	QUnit.test('applyChange on jsControlTree', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"orderGroups": ["Id1", "noId", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oSmartForm = new SmartForm();

		var oGroup1 = new SmartFormGroup("Id1", {"label":"Group1"});
		var oGroup2 = new SmartFormGroup("Id2", {"label":"Group2"});
		var oGroup3 = new SmartFormGroup("Id3", {"label":"Group3"});
		// fourth group is not contained in change
		var oGroup4 = new SmartFormGroup("Id4", {"label":"Group4"});

		oSmartForm.addGroup(oGroup2);
		oSmartForm.addGroup(oGroup4);
		oSmartForm.addGroup(oGroup3);
		oSmartForm.addGroup(oGroup1);

		assert.ok(this.oChangeHandler.applyChange(oChange, oSmartForm, JsControlTreeModifier));

		var aGroup = oSmartForm.getGroups();

		assert.equal(aGroup.length, 4);
		assert.equal(aGroup[0].getLabel(), "Group1");
		assert.equal(aGroup[1].getLabel(), "Group2");
		assert.equal(aGroup[2].getLabel(), "Group3");
		assert.equal(aGroup[3].getLabel(), "Group4");

		oSmartForm.destroyGroups();

	});

	QUnit.test('applyChange on xmlControlTree', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"orderGroups": ["Id1", "noId", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform"><SmartForm>' +
				'<Group id="Id2" />' +
				'<Group id="Id4" />' +
				'<Group id="Id3" />' +
				'<Group id="Id1" />' +
			'</SmartForm></mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		XmlTreeModifier.view = oXmlDocument;

		var oSmartForm = oXmlDocument.childNodes[0].childNodes[0];

		assert.ok(this.oChangeHandler.applyChange(oChange, oSmartForm, XmlTreeModifier));

		var aGroup = oSmartForm.childNodes;

		assert.equal(aGroup.length, 4);
		assert.equal(aGroup[0].getAttribute("id"), "Id1");
		assert.equal(aGroup[1].getAttribute("id"), "Id2");
		assert.equal(aGroup[2].getAttribute("id"), "Id3");
		assert.equal(aGroup[3].getAttribute("id"), "Id4");

	});

	QUnit.test('applyChange for smart form without group on jsControlTree', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"orderGroups": ["Id1", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function () {
		});

		var oSmartForm = new SmartForm();

		assert.ok(this.oChangeHandler.applyChange(oChange, oSmartForm, JsControlTreeModifier));

		var aGroup = oSmartForm.getGroups();

		assert.equal(aGroup.length, 0);

	});

	QUnit.test('completeChangeContent', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			}
		};

		var oChange = new Change(oChangeJson);

		var oSpecificChangeInfo = { orderGroups: ["Id1", "Id2", "Id3"] };

		this.oChangeHandler.completeChangeContent(oChange, oSpecificChangeInfo);

		oChangeJson = oChange.getDefinition();

		assert.equal(oChangeJson.content.orderGroups.length, 3);
		assert.equal(oChangeJson.content.orderGroups[0], "Id1");
		assert.equal(oChangeJson.content.orderGroups[1], "Id2");
		assert.equal(oChangeJson.content.orderGroups[2], "Id3");

	});

}(sap.ui.comp.smartform.flexibility.changes.OrderGroups, sap.ui.fl.Change, sap.ui.comp.smartform.SmartForm, sap.ui.comp.smartform.Group, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
