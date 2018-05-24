/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.RemoveGroup");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (RemoveGroupChangeHandler, SmartForm, SmartFormGroup, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RemoveGroup", {
		beforeEach: function () {
			this.oChangeHandler = RemoveGroupChangeHandler;
		},
		afterEach: function () {
		}
	});

	QUnit.test('applyChange on jsControlTree', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey"
			},
			"content": {
			},
			"texts": {
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oSmartForm = new SmartForm();
		var oGroup = new SmartFormGroup();
		oSmartForm.addGroup(oGroup);

		var oRemoveFormContainerSpy = this.spy(oSmartForm._oForm, "removeFormContainer");

		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier}));

		assert.ok(oRemoveFormContainerSpy.calledOnce);
		assert.equal(oSmartForm.getGroups().length, 0);
	});

	QUnit.test('applyChange on xmlControlTree', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey"
			},
			"content": {
			},
			"texts": {
			}
		};
		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform"><SmartForm id="formId">' +
				'<groups>' +
					'<Group id="Id1" />' +
					'<Group id="Id2" />' +
					'<Group id="Id3" />' +
					'<Group id="Id4" />' +
				'</groups>' +
			'</SmartForm></mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");

		var oGroup = oXmlDocument.childNodes[0].childNodes[0].childNodes[0].childNodes[2];

		assert.ok(this.oChangeHandler.applyChange(oChange, oGroup, {modifier: XmlTreeModifier, view: oXmlDocument}));

		var aGroup = oXmlDocument.childNodes[0].childNodes[0].childNodes[0].childNodes;

		assert.equal(aGroup.length, 3);
		assert.equal(aGroup[0].getAttribute("id"), "Id1");
		assert.equal(aGroup[1].getAttribute("id"), "Id2");
		assert.equal(aGroup[2].getAttribute("id"), "Id4");
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


}(sap.ui.comp.smartform.flexibility.changes.RemoveGroup, sap.ui.comp.smartform.SmartForm, sap.ui.comp.smartform.Group, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
