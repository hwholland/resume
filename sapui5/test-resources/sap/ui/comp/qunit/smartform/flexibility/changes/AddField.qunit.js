/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.AddField");
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.AddFields");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.commons.TextView");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.comp.smartfield.SmartField");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (AddFieldChangeHandler, AddFieldsChangeHandler, SmartFormGroup, SmartFormGroupElement, TextView, ChangeWrapper, SmartField, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("AddField and AddFields", {
		beforeEach: function () {
			this.oAddFieldChangeHandler = AddFieldChangeHandler;
			this.oAddFieldsChangeHandler = AddFieldsChangeHandler;
			this.oMockedAppComponent = {
				getLocalId: function () {
					return undefined;
				}
			}
		},
		afterEach: function () {
			var oAddedControl = sap.ui.getCore().byId("addedFieldId");
			if (oAddedControl){
				oAddedControl.destroy();
			}
		}
	});

	QUnit.test('applyChange - positive test', function (assert) {

		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsType": "sap.ui.commons.TextView",
					"valueProperty": "text",
					"value": "BindingPath1",
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new sap.ui.comp.smartform.SmartForm({
			content : [oGroup]
		});
		var oView = new sap.ui.core.mvc.View({content : [
			oForm
		]});
		var oAddGroupElementSpy = this.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView, appComponent: this.oMockedAppComponent}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("text"),"BindingPath1");

	});

	QUnit.test('applyChange - positive test with field selector', function (assert) {

		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"selector": {
						"id": "addedFieldId"
					},
					"index": 0,
					"jsType": "sap.ui.commons.TextView",
					"valueProperty": "text",
					"value": "BindingPath1",
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new sap.ui.comp.smartform.SmartForm({
			content : [oGroup]
		});
		var oView = new sap.ui.core.mvc.View({content : [
			oForm
		]});
		var oAddGroupElementSpy = this.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("text"),"BindingPath1");

	});

	QUnit.test('applyChange- addFields - add smart field to js control tree', function (assert) {

		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsTypes": [ "sap.ui.comp.smartfield.SmartField" ],
					"valueProperty": [ "value" ],
					"value": [ "BindingPath1" ],
					"entitySet": ["testEntitySet1"]
				}
			},
			"texts": {
				"fieldLabel0": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new sap.ui.comp.smartform.SmartForm({
			content : [oGroup]
		});
		var oView = new sap.ui.core.mvc.View({content : [
			oForm
		]});
		var oAddGroupElementSpy = this.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("value"), "BindingPath1");
		assert.ok(oControl.getEntitySet);
		assert.equal(oControl.getEntitySet(),"testEntitySet1");

	});


	QUnit.test('applyChange- addFields - add smart field to js control tree with duplicated id', function (assert) {

		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsTypes": [ "sap.ui.comp.smartfield.SmartField" ],
					"valueProperty": [ "value" ],
					"value": [ "BindingPath1" ],
					"entitySet": ["testEntitySet1"]
				}
			},
			"texts": {
				"fieldLabel0": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new sap.ui.comp.smartform.SmartForm({
			content : [oGroup]
		});
		var oView = new sap.ui.core.mvc.View({content : [
			oForm
		]});

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView}));
		try {
			assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView}));
		} catch (oError) {
			assert.ok(oError, "error is thrown when adding an element with duplicated id");
		}
	});

	QUnit.test('applyChange - add smart field to js control tree', function (assert) {

		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsType": "sap.ui.comp.smartfield.SmartField",
					"valueProperty": "value",
					"value": "BindingPath1",
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new sap.ui.comp.smartform.SmartForm({
			content : [oGroup]
		});
		var oView = new sap.ui.core.mvc.View({content : [
			oForm
		]});
		var oAddGroupElementSpy = this.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("value"), "BindingPath1");
		assert.ok(oControl.getEntitySet);
		assert.equal(oControl.getEntitySet(),"testEntitySet1");

	});


	QUnit.test('applyChange - add smart field to xml tree', function (assert) {

		var sGroupId = "groupkey1";
		var sFieldLabel = "the field label";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsType": "sap.ui.comp.smartfield.SmartField",
					"valueProperty": sValueProperty,
					"value": sValue,
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": sFieldLabel,
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var oXmlString =
			'<Group label="GroupHeader" id="' + sGroupId + '">' +
			'<groupElements>' +
			'<GroupElement id="' + sGroupElementId1 + '">' +
			'<SmartField value="fieldValue1" id="sFieldId1" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId2 + '">' +
			'<SmartField value="fieldValue2" id="sFieldId2" />' +
			'</GroupElement>' +
			'</groupElements>' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];
		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));

		var oXmlSmartFormGroupElements = oXmlSmartFormGroup.childNodes[0];
		assert.equal(oXmlSmartFormGroupElements.childElementCount, 3);
		var aChildNodes = oXmlSmartFormGroupElements.childNodes;
		assert.equal(aChildNodes[0].getAttribute("id"), sGroupElementId1);
		assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId2);
		assert.equal(aChildNodes[2].getAttribute("id"), sAddedFieldId);
		assert.equal(aChildNodes[2].getAttribute("label"), sFieldLabel);
		assert.equal(aChildNodes[2].childNodes[0].nodeName, "elements");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].nodeName, "sap.ui.comp.smartfield.SmartField");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].getAttribute(sValueProperty), "{" + sValue + "}");

	});

	QUnit.test('applyChange - add smart field with duplicated id to xml tree', function (assert) {

		var sGroupId = "groupkey1";
		var sFieldLabel = "the field label";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsType": "sap.ui.comp.smartfield.SmartField",
					"valueProperty": sValueProperty,
					"value": sValue,
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": sFieldLabel,
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var oXmlString =
			'<Group label="GroupHeader" id="' + sGroupId + '">' +
			'<groupElements>' +
			'<GroupElement id="' + sGroupElementId1 + '">' +
			'<SmartField value="fieldValue1" id="sFieldId1" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId2 + '">' +
			'<SmartField value="fieldValue2" id="sFieldId2" />' +
			'</GroupElement>' +
			'</groupElements>' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];
		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));
		try {
			assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));
		} catch (oError) {
			assert.ok(oError, "error is thrown when adding an element with duplicated id");
		}

		var oXmlSmartFormGroupElements = oXmlSmartFormGroup.childNodes[0];
		assert.equal(oXmlSmartFormGroupElements.childElementCount, 3);
	});

	QUnit.test('applyChange - add smart field to xml tree with default aggregation', function (assert) {

		var sGroupId = "groupkey1";
		var sFieldLabel = "the field label";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsType": "sap.ui.comp.smartfield.SmartField",
					"valueProperty": sValueProperty,
					"value": sValue,
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": sFieldLabel,
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var sGroupElementId3 = "groupId3";
		var oXmlString =
			'<Group label="GroupHeader" id="' + sGroupId + '">' +
			'<GroupElement id="' + sGroupElementId1 + '">' +
			'<SmartField value="fieldValue1" id="sFieldId1" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId2 + '">' +
			'<SmartField value="fieldValue2" id="sFieldId2" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId3 + '">' +
			'<SmartField value="fieldValue3" id="sFieldId3" />' +
			'</GroupElement>' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));

		assert.equal(oXmlSmartFormGroup.childElementCount, 4);
		var aChildNodes = oXmlSmartFormGroup.childNodes;
		assert.equal(aChildNodes[0].getAttribute("id"), sGroupElementId1);
		assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId2);
		assert.equal(aChildNodes[2].getAttribute("id"), sAddedFieldId);
		assert.equal(aChildNodes[2].childNodes[0].nodeName, "elements");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].nodeName, "sap.ui.comp.smartfield.SmartField");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].getAttribute(sValueProperty), "{" + sValue + "}");

		assert.equal(aChildNodes[2].getAttribute("label"), sFieldLabel);
		assert.equal(aChildNodes[3].getAttribute("id"), sGroupElementId3);
	});

	QUnit.test('applyChange - addFields - add smart field to xml tree with default aggregation', function (assert) {

		var sGroupId = "groupkey1";
		var sFieldLabel = "the field label";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsTypes": [ "sap.ui.comp.smartfield.SmartField" ],
					"valueProperty": [ sValueProperty ],
					"value": [ sValue ],
					"entitySet": [ "testEntitySet1" ]
				}
			},
			"texts": {
				"fieldLabel0": {
					"value": sFieldLabel,
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var sGroupElementId3 = "groupId3";
		var oXmlString =
			'<Group label="GroupHeader" id="' + sGroupId + '">' +
			'<GroupElement id="' + sGroupElementId1 + '">' +
			'<SmartField value="fieldValue1" id="sFieldId1" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId2 + '">' +
			'<SmartField value="fieldValue2" id="sFieldId2" />' +
			'</GroupElement>' +
			'<GroupElement id="' + sGroupElementId3 + '">' +
			'<SmartField value="fieldValue3" id="sFieldId3" />' +
			'</GroupElement>' +
			'</Group>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));

		assert.equal(oXmlSmartFormGroup.childElementCount, 4);
		var aChildNodes = oXmlSmartFormGroup.childNodes;
		assert.equal(aChildNodes[0].getAttribute("id"), sGroupElementId1);
		assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId2);
		assert.equal(aChildNodes[2].getAttribute("id"), sAddedFieldId);
		assert.equal(aChildNodes[2].childNodes[0].nodeName, "elements");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].nodeName, "sap.ui.comp.smartfield.SmartField");
		assert.equal(aChildNodes[2].childNodes[0].childNodes[0].getAttribute(sValueProperty), "{" + sValue + "}");

		assert.equal(aChildNodes[2].getAttribute("label"), sFieldLabel);
		assert.equal(aChildNodes[3].getAttribute("id"), sGroupElementId3);
	});

	QUnit.test('completeChangeContent addField', function (assert){
		this.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(this.oMockedAppComponent);

		var oChange = {
			"selector": {
				"id": "groupkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = {
			"index": 0,
			"fieldLabel": "the field label",
			"jsType": "sap.ui.commons.TextView",
			"fieldValue": "the TextView text",
			"valueProperty": "text",
			"entitySet" : "testEntitySet1",
			"newControlId" : "the--new--control--id"
		};
		this.oAddFieldChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, {appComponent: this.oMockedAppComponent});
		assert.equal(oChange.texts.fieldLabel.value, "the field label");
		assert.equal(oChange.content.field.jsType, "sap.ui.commons.TextView");
		assert.equal(oChange.content.field.value, "the TextView text");
		assert.equal(oChange.content.field.valueProperty, "text");
		assert.equal(oChange.content.field.selector.id, "the--new--control--id");
		assert.equal(oChange.content.field.index, 0);
		assert.equal(oChange.content.field.entitySet,"testEntitySet1");


	});
	QUnit.test('completeChangeContent addFields', function (assert){
		this.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(this.oMockedAppComponent);

		var oChange = {
			"selector": {
				"id": "groupkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = {
			"index": 0,
			"fieldLabels": [ "the field label" ],
			"jsTypes": [ "sap.ui.commons.TextView" ],
			"fieldValues": [ "the TextView text" ],
			"valueProperty": [ "text" ],
			"newControlId" : "the--new--control--id"
		};
		this.oAddFieldsChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, {appComponent: this.oMockedAppComponent});
		assert.equal(oChange.texts.fieldLabel0.value, "the field label");
		assert.equal(oChange.content.field.jsTypes[0], "sap.ui.commons.TextView");
		assert.equal(oChange.content.field.value[0], "the TextView text");
		assert.equal(oChange.content.field.valueProperty[0], "text");
		assert.equal(oChange.content.field.selector.id, "the--new--control--id");
		assert.equal(oChange.content.field.index, 0);
	});

}(sap.ui.comp.smartform.flexibility.changes.AddField, sap.ui.comp.smartform.flexibility.changes.AddFields, sap.ui.comp.smartform.Group, sap.ui.comp.smartform.GroupElement, sap.ui.commons.TextView, sap.ui.fl.Change, sap.ui.comp.smartfield.SmartField, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
