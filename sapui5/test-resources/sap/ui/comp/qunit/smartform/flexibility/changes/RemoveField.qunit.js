/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.RemoveField");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (RemoveFieldChangeHandler, SmartFormGroup, SmartFormGroupElement, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RemoveField", {
		beforeEach: function () {
			this.oChangeHandler = RemoveFieldChangeHandler;
		},
		afterEach: function () {
		}
	});

	QUnit.test('applyChange', function (assert) {
		var oChange = {
			"selector": {
				"id": "fieldkey"
			},
			"content": {
			},
			"texts": {
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oField = new SmartFormGroupElement();
		var oGroup = new SmartFormGroup();
		oGroup.addGroupElement(oField);

		assert.equal(oGroup.getGroupElements().length, 1);

		var oRemoveGroupElementSpy = this.spy(oGroup, "removeGroupElement");

		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, oField, {modifier: JsControlTreeModifier}));

		assert.ok(oRemoveGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 0);

	});

	QUnit.test('applyChange on xmlControlTree', function (assert) {
		var oChange = {
			"selector": {
				"id": "Id1"
			},
			"content": {
			},
			"texts": {
			}
		};
		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform"><Group id="groupID">' +
				'<GroupElement id="Id1" />' +
			'</Group></mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");

		var oGroup = oXmlDocument.childNodes[0].childNodes[0];
		var oField = oGroup.childNodes[0];

		assert.ok(this.oChangeHandler.applyChange(oChange, oField, {modifier: XmlTreeModifier, view: oXmlDocument}));
		assert.equal(oGroup.childNodes.length, 0);
	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = { };
		this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo);
		assert.equal(Object.keys(oChange.content).length, 0);
	});


}(sap.ui.comp.smartform.flexibility.changes.RemoveField, sap.ui.comp.smartform.Group, sap.ui.comp.smartform.GroupElement, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
