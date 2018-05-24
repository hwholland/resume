/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.MoveGroups");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.Utils");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (MoveGroupsChangeHandler, Change, SmartForm, SmartFormGroup, FlexUtil, JsControlTreeModifier, XmlTreeModifier) {
	"use strict";

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - Invalid change supplied to applyChange", {
		beforeEach: function () {
			this.oSmartForm = new SmartForm();
		},

		afterEach: function () {
			this.oSmartForm.destroy();
		}
	});

	QUnit.test("content does not contain moveGroups attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveGroups array is empty", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": []
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () {});

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveGroups element has no id attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"key": "Id1", "index": 1}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () {});

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveGroups element has no id attribute")
		);
	});

	QUnit.test("moveGroups element has no index attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"id": "Id1", "position": 1}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveGroups element index attribute is no number")
		);
	});

	QUnit.test("moveGroups element has an index attribute which is no number", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"id": "Id1", "index": "1"}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveGroups element index attribute is no number")
		);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - applyChange with idIsLocal false", {
		beforeEach: function (assert) {
			this.oSmartForm = new SmartForm();
			this.aGroups = [];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.aGroups.forEach(function (oGroup) {
				oGroup.destroy();
			});
		}
	});

	QUnit.test("on jsControlTree with an legacy change (global ids)", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2},
					{"id": "NoId", "index": 3}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson);

		var oGroup1 = new SmartFormGroup("Id4", {"label":"Group4"});
		this.aGroups.push(oGroup1);
		var oGroup2 = new SmartFormGroup("Id1", {"label":"Group1"});
		this.aGroups.push(oGroup2);
		var oGroup3 = new SmartFormGroup("Id2", {"label":"Group2"});
		this.aGroups.push(oGroup3);
		var oGroup4 = new SmartFormGroup("Id3", {"label":"Group3"});
		this.aGroups.push(oGroup4);

		var that = this;
		this.aGroups.forEach(function (oGroup) {
			that.oSmartForm.addGroup(oGroup);
		});

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, this.oSmartForm, {modifier: JsControlTreeModifier}));

		var aMovedGroups = this.oSmartForm.getGroups();

		assert.equal(aMovedGroups.length, 4);
		assert.equal(aMovedGroups[0].getLabel(), "Group1");
		assert.equal(aMovedGroups[1].getLabel(), "Group2");
		assert.equal(aMovedGroups[2].getLabel(), "Group3");
		assert.equal(aMovedGroups[3].getLabel(), "Group4");
	});

	QUnit.test("on xmlControlTree with an legacy change (global ids)", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2},
					{"id": "NoId", "index": 3}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson);
		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform"><SmartForm>' +
			'<Group id="Id2" />' +
			'<Group id="Id3" />' +
			'<Group id="Id4" />' +
			'<Group id="Id1" />' +
			'</SmartForm></mvc:View>';

		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");

		XmlTreeModifier.view = oXmlDocument;

		var oXmlSmartForm = oXmlDocument.childNodes[0].childNodes[0];

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, oXmlSmartForm, {modifier: XmlTreeModifier, view: oXmlDocument}));

		var aGroup = oXmlSmartForm.childNodes;

		assert.equal(aGroup.length, 4);
		assert.equal(aGroup[0].getAttribute("id"), "Id1");
		assert.equal(aGroup[1].getAttribute("id"), "Id2");
		assert.equal(aGroup[2].getAttribute("id"), "Id3");
		assert.equal(aGroup[3].getAttribute("id"), "Id4");
	});

	QUnit.test("on jsControlTree on a smartform without groups", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () {});

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, this.oSmartForm, {modifier: JsControlTreeModifier}));

		var aGroup = this.oSmartForm.getGroups();

		assert.equal(aGroup.length, 0);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - applyChange with idIsLocal true", {
		beforeEach: function (assert) {
			this.oSmartForm = new SmartForm("component---testkey");
			this.aGroups = [];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.aGroups.forEach(function (oGroup) {
				oGroup.destroy();
			});
		}
	});

	QUnit.test("on jsControlTree", function (assert) {
		var oMockedAppComponent = {
			createId: function (sId) {
				return "component---" + sId;
			}
		};

		var oChangeJson = {
			"selector": {
				"id": "testkey",
				"idIsLocal": true
			},
			"content": {
				"moveGroups": [
					{"selector":{"id": "Id1", "idIsLocal": true}, "index": 0},
					{"selector":{"id": "Id2", "idIsLocal": true}, "index": 1},
					{"selector":{"id": "Id3", "idIsLocal": true}, "index": 2},
					{"selector":{"id": "NoId", "idIsLocal": true}, "index": 3}
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson);

		var oGroup1 = new SmartFormGroup("component---Id4", {"label":"Group4"});
		this.aGroups.push(oGroup1);
		var oGroup2 = new SmartFormGroup("component---Id1", {"label":"Group1"});
		this.aGroups.push(oGroup2);
		var oGroup3 = new SmartFormGroup("component---Id2", {"label":"Group2"});
		this.aGroups.push(oGroup3);
		var oGroup4 = new SmartFormGroup("component---Id3", {"label":"Group3"});
		this.aGroups.push(oGroup4);

		var that = this;
		this.aGroups.forEach(function (oGroup) {
			that.oSmartForm.addGroup(oGroup);
		});

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, this.oSmartForm, {modifier: JsControlTreeModifier, appComponent: oMockedAppComponent}));

		var aMovedGroups = this.oSmartForm.getGroups();

		assert.equal(aMovedGroups.length, 4);
		assert.equal(aMovedGroups[0].getLabel(), "Group1");
		assert.equal(aMovedGroups[1].getLabel(), "Group2");
		assert.equal(aMovedGroups[2].getLabel(), "Group3");
		assert.equal(aMovedGroups[3].getLabel(), "Group4");
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - completeChangeContent failed", {
		beforeEach: function (assert) {
			var oChangeJson = {
				"selector": {
					"id": "testkey"
				}
			};

			this.oChange = new Change(oChangeJson);
		},

		afterEach: function () {
		}
	});

	QUnit.test("if no move groups attribute is present", function (assert) {
		var oSpecificChangeInfo = {};

		assert.throws(
			MoveGroupsChangeHandler.completeChangeContent.bind(this, this.oChange, {}),
			new Error("oSpecificChangeInfo.moveGroups attribute required")
		);
	});

	QUnit.test("if the changeSpecificDatas moveGroups attribute is an empty array", function (assert) {
		var oSpecificChangeInfo = {
			moveGroups: []
		};

		assert.throws(
			MoveGroupsChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			new Error("MoveGroups array is empty")
		);
	});

	QUnit.test("if a moveGroups attribute contains element without id attribute", function (assert) {
		var oSpecificChangeInfo = {
			moveGroups : [
				{
					"key": "Id1",
					"index": 0
				}
			]
		};

		assert.throws(
			MoveGroupsChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			new Error("MoveGroups element has no id attribute")
		);
	});

	QUnit.test("if a moveGroups attribute contains element without index attribute", function (assert) {
		var oSpecificChangeInfo = {
			moveGroups: [
				{
					"id": "Id1",
					"position": 0
				}
			]
		};

		assert.throws(
			MoveGroupsChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			new Error("Index attribute at MoveGroups element is no number")
		);
	});

	QUnit.test("if a moveGroups element index attribute is no number", function (assert) {
		var oSpecificChangeInfo = {
			moveGroups: [
				{
					"id": "Id1",
					"index": "0"
				}
			]
		};

		assert.throws(
			MoveGroupsChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			new Error("Index attribute at MoveGroups element is no number")
		);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - completeChangeContent", {
		beforeEach: function (assert) {
			this.oSmartForm = new SmartForm("smartFormId");
			this.aGroups = [];
		},

		afterEach: function (assert) {
			this.oSmartForm.destroy();
			this.aGroups.forEach(function (oGroup) {
				oGroup.destroy();
			});
		}
	});

	QUnit.test("works if a correct change object and specific change info was passed", function (assert) {
		var oGroup1 = new SmartFormGroup("Id1");
		this.aGroups.push(oGroup1);
		var oGroup2 = new SmartFormGroup("Id2");
		this.aGroups.push(oGroup2);
		var oGroup3 = new SmartFormGroup("Id3");
		this.aGroups.push(oGroup3);

		var that = this;
		this.aGroups.forEach(function (oGroup) {
			that.oSmartForm.addGroup(oGroup);
		});

		var oChangeJson = {
			"selector": {
				"id": this.sSmartFormId
			}
		};
		var oChange = new Change(oChangeJson);
		var oSpecificChangeInfo = {
			moveGroups: [
				{"id": "Id1", "index": 0},
				{"id": "Id2", "index": 2},
				{"id": "Id3", "index": 1}
			]
		};

		var oMockedAppComponent = {
			getLocalId: function () {
				return undefined;
			}
		};
		MoveGroupsChangeHandler.completeChangeContent(oChange, oSpecificChangeInfo, {appComponent: oMockedAppComponent});

		oChangeJson = oChange.getDefinition();

		assert.equal(oChangeJson.content.moveGroups.length, 3);
		assert.ok(oChangeJson.content.moveGroups[0].selector);
		assert.equal(oChangeJson.content.moveGroups[0].selector.id, "Id1");
		assert.deepEqual(oChangeJson.content.moveGroups[0].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveGroups[0].index, 0);
		assert.ok(oChangeJson.content.moveGroups[1].selector);
		assert.equal(oChangeJson.content.moveGroups[1].selector.id, "Id2");
		assert.deepEqual(oChangeJson.content.moveGroups[1].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveGroups[1].index, 2);
		assert.ok(oChangeJson.content.moveGroups[2].selector);
		assert.equal(oChangeJson.content.moveGroups[2].selector.id, "Id3");
		assert.deepEqual(oChangeJson.content.moveGroups[2].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveGroups[2].index, 1);
	});
}(sap.ui.comp.smartform.flexibility.changes.MoveGroups, sap.ui.fl.Change, sap.ui.comp.smartform.SmartForm, sap.ui.comp.smartform.Group, sap.ui.fl.Utils, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
