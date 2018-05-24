/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.OrderFields");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (OrderFieldsChangeHandler, Change, Group, GroupElement, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.OrderFields", {
		beforeEach: function () {
			this.oChangeHandler = OrderFieldsChangeHandler;
		},
		afterEach: function () {
		}
	});

	QUnit.test('Invalid change supplied to applyChange on the js control tree', function (assert) {

		var oGroup = new Group();
		var sError;

		// test 1 - content does not contain orderFields attribute
		var oChangeJson = {
			"selector": {
				"id": "testkey1"
			},
			"content": {
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson, function () {
		});

		try {
			this.oChangeHandler.applyChange(oChange, oGroup, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

		// test 2 - orderFields array is empty
		oChangeJson = {
			"selector": {
				"id": "testkey2"
			},
			"content": {
				"orderFields": []
			},
			"texts": {
			}
		};

		oChange = new Change(oChangeJson, function(){});

		sError = "";
		try {
			this.oChangeHandler.applyChange(oChange, oGroup, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

		// test 3 - selector contains more than one key
		oChangeJson = {
			"selector": {
				"id": "testkey3",
				"id2": "testkey4"
			},
			"content": {
				"orderFields": ["Key1", "Key2", "Key3"]
			},
			"texts": {
			}
		};

		oChange = new Change(oChangeJson, function(){});

		sError = "";
		try {
			this.oChangeHandler.applyChange(oChange, oGroup, JsControlTreeModifier);
		} catch (Error) {
			sError = Error.message;
		}

		assert.equal(sError, "Change format invalid");

	});

	QUnit.test('applyChange on the js control tree', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey5"
			},
			"content": {
				"orderFields": ["Id1", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oGroup = new Group();

		var oGroupElement1 = new GroupElement("Id1");
		var oGroupElement2 = new GroupElement("Id2");
		var oGroupElement3 = new GroupElement("Id3");
		// fourth group element is not contained in change
		var oGroupElement4 = new GroupElement("Id4");

		oGroup.addGroupElement(oGroupElement2);
		oGroup.addGroupElement(oGroupElement4);
		oGroup.addGroupElement(oGroupElement3);
		oGroup.addGroupElement(oGroupElement1);

		this.oChangeHandler.applyChange(oChange, oGroup, JsControlTreeModifier);

		var aGroupElement = oGroup.getGroupElements();

		assert.equal(aGroupElement.length, 4);
		assert.equal(aGroupElement[0].getId(), "Id1");
		assert.equal(aGroupElement[1].getId(), "Id2");
		assert.equal(aGroupElement[2].getId(), "Id3");
		assert.equal(aGroupElement[3].getId(), "Id4");

		oGroup.destroyGroupElements();

	});

	QUnit.test('applyChange on the xml tree', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey5"
			},
			"content": {
				"orderFields": ["Id1", "Id2", "Id3"]
			},
			"texts": {
			}
		};

		var oChange = new Change(oChangeJson);

		var oDOMParser = new DOMParser();
		var sGroupId = "testkey5";
		var oXmlString =
			'<Group label="GroupHeader" id="' + sGroupId + '">' +
				'<GroupElement id="Id2">' +
					'<SmartField value="fieldValue2" id="sFieldId2" />' +
				'</GroupElement>' +
				'<GroupElement id="Id4">' +
				// fourth group element is not contained in change
				'<SmartField value="fieldValue4" id="sFieldId4" />' +
				'</GroupElement>' +
				'<GroupElement id="Id3">' +
					'<SmartField value="fieldValue3" id="sFieldId3" />' +
				'</GroupElement>' +
				'<GroupElement id="Id1">' +
				'<SmartField value="fieldValue1" id="sFieldId1" />' +
				'</GroupElement>' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];

		this.oChangeHandler.applyChange(oChange, oXmlSmartFormGroup, XmlTreeModifier);

		var aGroupElement = oXmlSmartFormGroup.childNodes;

		assert.equal(aGroupElement.length, 4);
		assert.equal(aGroupElement[0].getAttribute("id"), "Id1");
		assert.equal(aGroupElement[1].getAttribute("id"), "Id2");
		assert.equal(aGroupElement[2].getAttribute("id"), "Id3");
		assert.equal(aGroupElement[3].getAttribute("id"), "Id4");

	});

	QUnit.test('applyChange for group without elements on the js control tree', function (assert) {

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

		var oChange = new Change(oChangeJson, function () {
		});

		var oGroup = new Group();

		this.oChangeHandler.applyChange(oChange, oGroup, JsControlTreeModifier);

		var aGroupElement = oGroup.getGroupElements();

		assert.equal(aGroupElement.length, 0);

	});

	QUnit.test('applyChange for group without elements on the xml tree', function (assert) {

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

		var oChange = new Change(oChangeJson, function () {
		});

		var oDOMParser = new DOMParser();
		var oXmlString =
			'<Group label="GroupHeader" id="testkey">' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];

		this.oChangeHandler.applyChange(oChange, oXmlSmartFormGroup, XmlTreeModifier);

		var aGroupElement = oXmlSmartFormGroup.childNodes;

		assert.equal(aGroupElement.length, 0);

	});

	QUnit.test('completeChangeContent', function (assert) {

		var oChangeJson = {
			"selector": {
				"id": "testkey"
			}
		};

		var oChange = new Change(oChangeJson);

		var oSpecificChangeInfo = { orderFields: ["Id1", "Id2", "Id3"] };

		this.oChangeHandler.completeChangeContent(oChange, oSpecificChangeInfo);

		oChangeJson = oChange.getDefinition();

		assert.equal(oChangeJson.content.orderFields.length, 3);
		assert.equal(oChangeJson.content.orderFields[0], "Id1");
		assert.equal(oChangeJson.content.orderFields[1], "Id2");
		assert.equal(oChangeJson.content.orderFields[2], "Id3");

	});

}(sap.ui.comp.smartform.flexibility.changes.OrderFields, sap.ui.fl.Change, sap.ui.comp.smartform.Group, sap.ui.comp.smartform.GroupElement, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
