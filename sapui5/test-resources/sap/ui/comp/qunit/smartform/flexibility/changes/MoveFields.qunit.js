/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.MoveFields");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (MoveFieldsChangeHandler, Change, Group, Field, JsControlTreeModifier, XmlTreeModifier) {
	"use strict";

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveFields - Invalid change supplied to applyChange", {
		beforeEach: function () {
			this.oChangeHandler = MoveFieldsChangeHandler;
			this.oGroup = new Group();
		},
		afterEach: function () {
			this.oGroup.destroy();
		}
	});

	QUnit.test("content does not contain moveFields attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {},
			"texts": {}
		};

		var oChange = new Change(oChangeJson, function () {
		});

		assert.throws(
			this.oChangeHandler.applyChange.bind(this, oChange, this.oGroup, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveFields array is empty", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveFields": []
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			this.oChangeHandler.applyChange.bind(this, oChange, this.oGroup, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveFields element has no id attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveFields": [
					{"key": "Id1", "index": 1}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			this.oChangeHandler.applyChange.bind(this, oChange, this.oGroup, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveFields element has no id attribute")
		);
	});

	QUnit.test("moveFields element has no index attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveFields": [
					{"id": "Id1", "position": 1}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			this.oChangeHandler.applyChange.bind(this, oChange, this.oGroup, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveFields element index attribute is no number")
		);
	});

	QUnit.test("moveGroups element has an index attribute which is no number", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveFields": [
					{"id": "Id1", "index": "1"}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function(){});

		assert.throws(
			this.oChangeHandler.applyChange.bind(this, oChange, this.oGroup, {modifier: JsControlTreeModifier}),
			new Error("Change format invalid - moveFields element index attribute is no number")
		);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveFields - applyChange with idIsLocal false - move fields within group", {
		beforeEach: function () {
			this.oChangeHandler = MoveFieldsChangeHandler;
			this.sSourceGroupId = "sourceGroup";
			this.oGroup = new Group(this.sSourceGroupId);
			this.sTargetGroupId = "targetGroup";
			this.oTargetGroup = new Group(this.sTargetGroupId);
		},
		afterEach: function () {
			this.oGroup.destroyGroupElements();
			this.oGroup.destroy();
			this.oTargetGroup.destroyGroupElements();
			this.oTargetGroup.destroy();

		}
	});

	QUnit.test("on jsControlTree with an legacy change (global ids)", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": this.sSourceGroupId
			},
			"content": {
				"moveFields": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2},
					{"id": "NoId", "index": 3}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oField1 = new Field("Id1");
		var oField2 = new Field("Id2");
		var oField3 = new Field("Id3");
		var oField4 = new Field("Id4");

		this.oGroup.addGroupElement(oField2);
		this.oGroup.addGroupElement(oField4);
		this.oGroup.addGroupElement(oField3);
		this.oGroup.addGroupElement(oField1);

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oGroup, {modifier: JsControlTreeModifier}));

		var aField = this.oGroup.getGroupElements();

		assert.equal(aField.length, 4);
		assert.equal(aField[0].getId(), "Id1");
		assert.equal(aField[1].getId(), "Id2");
		assert.equal(aField[2].getId(), "Id3");
		assert.equal(aField[3].getId(), "Id4");

		this.oGroup.destroyGroupElements();

	});

	QUnit.test("on xmlControlTree with an legacy change (global ids)", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": this.sSourceGroupId
			},
			"content": {
				"moveFields": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2},
					{"id": "NoId", "index": 3}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
			'<Group id="sourceGroup">' +
			'<GroupElement id="Id2" />' +
			'<GroupElement id="Id4" />' +
			'<GroupElement id="Id3" />' +
			'<GroupElement id="Id1" />' +
			'</Group>' +
			'</mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		XmlTreeModifier.view = oXmlDocument;

		var oGroup = oXmlDocument.childNodes[0].childNodes[0];

		assert.ok(this.oChangeHandler.applyChange(oChange, oGroup, {modifier: XmlTreeModifier, view: oXmlDocument}));

		var aField = oGroup.childNodes;

		assert.equal(aField.length, 4);
		assert.equal(aField[0].getAttribute("id"), "Id1");
		assert.equal(aField[1].getAttribute("id"), "Id2");
		assert.equal(aField[2].getAttribute("id"), "Id3");
		assert.equal(aField[3].getAttribute("id"), "Id4");
	});

	QUnit.test("on jsControlTree on a group without field", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveFields": [
					{"id": "Id1", "index": 0},
					{"id": "Id2", "index": 1},
					{"id": "Id3", "index": 2}
				]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function () {
		});


		assert.ok(this.oChangeHandler.applyChange(oChange, this.oGroup, {modifier: JsControlTreeModifier}));

		var aField = this.oGroup.getGroupElements();

		assert.equal(aField.length, 0);

	});

	QUnit.test("on jsControlTree moving fields from one group to another", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": this.sSourceGroupId
			},
			"content": {
				"moveFields": [
					{"id": "Id11", "index": 0},
					{"id": "Id33", "index": 2},
					{"id": "NoId", "index": 3}
				],
				"targetId": this.sTargetGroupId
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oField1 = new Field("Id11");
		var oField2 = new Field("Id22");
		var oField3 = new Field("Id33");
		var oField4 = new Field("Id44");

		this.oGroup.addGroupElement(oField1);
		this.oGroup.addGroupElement(oField2);
		this.oGroup.addGroupElement(oField3);
		this.oGroup.addGroupElement(oField4);

		var oField5 = new Field("Id55");
		var oField6 = new Field("Id66");

		this.oTargetGroup.addGroupElement(oField5);
		this.oTargetGroup.addGroupElement(oField6);

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oGroup, {modifier: JsControlTreeModifier}));

		var aFields = this.oGroup.getGroupElements();

		assert.equal(aFields.length, 2);
		assert.equal(aFields[0].getId(), "Id22");
		assert.equal(aFields[1].getId(), "Id44");

		var aFieldsTarget = this.oTargetGroup.getGroupElements();

		assert.equal(aFieldsTarget.length, 4);
		assert.equal(aFieldsTarget[0].getId(), "Id11");
		assert.equal(aFieldsTarget[1].getId(), "Id55");
		assert.equal(aFieldsTarget[2].getId(), "Id33");
		assert.equal(aFieldsTarget[3].getId(), "Id66");
	});

	QUnit.test("applyChange - move fields between groups on xmlControlTree", function (assert) {

		var oChangeJson = {
			"selector": {
				"id": this.sSourceGroupId
			},
			"content": {
				"moveFields": [
					{"id": "Id11", "index": 0},
					{"id": "Id33", "index": 2},
					{"id": "NoId", "index": 3}
				],
				"targetId": this.sTargetGroupId
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
			'<Group id="' + this.sSourceGroupId + '">' +
			'<GroupElement id="Id11" />' +
			'<GroupElement id="Id22" />' +
			'<GroupElement id="Id33" />' +
			'<GroupElement id="Id44" />' +
			'</Group>' +
			'<Group id="' + this.sTargetGroupId + '">' +
			'<GroupElement id="Id55" />' +
			'<GroupElement id="Id66" />' +
			'</Group>' +
			'</mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");

		var oXmlGroup = oXmlDocument.childNodes[0].childNodes[0];
		var oXmlTargetGroup = oXmlDocument.childNodes[0].childNodes[1];

		assert.ok(this.oChangeHandler.applyChange(oChange, oXmlGroup, {modifier: XmlTreeModifier, view: oXmlDocument}));

		var aFields = oXmlGroup.childNodes;
		assert.equal(aFields.length, 2);
		assert.equal(aFields[0].getAttribute("id"), "Id22");
		assert.equal(aFields[1].getAttribute("id"), "Id44");

		var aFieldsTarget = oXmlTargetGroup.childNodes;
		assert.equal(aFieldsTarget.length, 4);
		assert.equal(aFieldsTarget[0].getAttribute("id"), "Id11");
		assert.equal(aFieldsTarget[1].getAttribute("id"), "Id55");
		assert.equal(aFieldsTarget[2].getAttribute("id"), "Id33");
		assert.equal(aFieldsTarget[3].getAttribute("id"), "Id66");

	});

	QUnit.module("completeChangeContent failed",{
		beforeEach: function () {
			this.oChangeHandler = MoveFieldsChangeHandler;
			var oChangeJson = {
				"selector": {
					"id": "testkey"
				}
			};

			this.oChange = new Change(oChangeJson);
		}
	});

	QUnit.test("if no move fields attribute is present", function (assert) {
		var oSpecificChangeInfo = {};

		assert.throws(
			this.oChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			"oSpecificChangeInfo.moveFields attribute required"
		);
	});

	QUnit.test("if a moveFields attribute is an empty array", function (assert) {
		var oSpecificChangeInfo = {
			moveFields: []
		};

		assert.throws(
			this.oChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			"MoveFields array is empty"
		);

	});

	QUnit.test("if a moveFields attribute contains element without id attribute", function (assert) {
		var oSpecificChangeInfo = {
			moveFields: [
				{"key": "Id1", "index": 0}
			]
		};

		assert.throws(
			this.oChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			"MoveFields element has no id attribute"
		);

	});

	QUnit.test("if a moveFields attribute contains element without index attribute", function (assert) {
		var oSpecificChangeInfo = {
			moveFields: [
				{"id": "Id1", "position": 0}
			]
		};

		assert.throws(
			this.oChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			"Index attribute at MoveFields element is no number"
		);

	});

	QUnit.test("if a moveFields element index attribute is no number", function (assert) {
		var oSpecificChangeInfo = {
			moveFields: [
				{"id": "Id1", "index": "0"}
			]
		};

		assert.throws(
			this.oChangeHandler.completeChangeContent.bind(this, this.oChange, oSpecificChangeInfo),
			"Index attribute at MoveFields element is no number"
		);
	});


	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveFields - completeChangeContent", {
		beforeEach: function () {
			this.oChangeHandler = MoveFieldsChangeHandler;
			this.sSourceGroupId = "sourceGroup";
			this.oGroup = new Group(this.sSourceGroupId);
			this.sTargetGroupId = "targetGroup";
			this.oTargetGroup = new Group(this.sTargetGroupId);
		},
		afterEach: function () {
			this.oGroup.destroyGroupElements();
			this.oGroup.destroy();
			this.oTargetGroup.destroy();
		}
	});

	QUnit.test("works if a correct change object and specific change info was passed", function (assert) {

		this.oGroup.addGroupElement(new Field("Id1"));
		this.oGroup.addGroupElement(new Field("Id2"));
		this.oGroup.addGroupElement(new Field("Id3"));

		var oChangeJson = {
			"selector": {
				"id": this.sSourceGroupId
			}
		};

		var oChange = new Change(oChangeJson);

		var oSpecificChangeInfo = { moveFields: [
			{"id": "Id1", "index": 0},
			{"id": "Id2", "index": 1},
			{"id": "Id3", "index": 2}
		],
			targetId: this.sTargetGroupId };

		var oMockedAppComponent = {
			getLocalId: function () {
				return undefined;
			}
		};

		MoveFieldsChangeHandler.completeChangeContent(oChange, oSpecificChangeInfo, {appComponent: oMockedAppComponent});

		oChangeJson = oChange.getDefinition();

		assert.equal(oChangeJson.content.moveFields.length, 3);
		assert.ok(oChangeJson.content.moveFields[0].selector);
		assert.equal(oChangeJson.content.moveFields[0].selector.id, "Id1");
		assert.deepEqual(oChangeJson.content.moveFields[0].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveFields[0].index, 0);
		assert.ok(oChangeJson.content.moveFields[1].selector);
		assert.equal(oChangeJson.content.moveFields[1].selector.id, "Id2");
		assert.deepEqual(oChangeJson.content.moveFields[1].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveFields[1].index, 1);
		assert.ok(oChangeJson.content.moveFields[2].selector);
		assert.equal(oChangeJson.content.moveFields[2].selector.id, "Id3");
		assert.deepEqual(oChangeJson.content.moveFields[2].selector.idIsLocal, false);
		assert.equal(oChangeJson.content.moveFields[2].index, 2);

		assert.ok(oChangeJson.content.targetSelector);
		assert.equal(oChangeJson.content.targetSelector.id, this.sTargetGroupId);
		assert.deepEqual(oChangeJson.content.targetSelector.idIsLocal, false);

	});

}(sap.ui.comp.smartform.flexibility.changes.MoveFields, sap.ui.fl.Change, sap.ui.comp.smartform.Group, sap.ui.comp.smartform.GroupElement, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
