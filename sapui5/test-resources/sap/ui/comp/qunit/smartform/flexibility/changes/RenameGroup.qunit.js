/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.RenameGroup");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (RenameGroupChangeHandler, SmartFormGroup, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameGroup", {
		beforeEach: function () {
			this.oChangeHandler = RenameGroupChangeHandler;
		},
		afterEach: function () {
		}
	});

	QUnit.test('applyChange on jsControlTree', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			},
			"content": {
			},
			"texts": {
				"groupLabel": {
					"value": "new group label"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oControl = new SmartFormGroup();
		var oControlSpy = this.spy(oControl, "setLabel");
		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, oControl, {modifier: JsControlTreeModifier}));
		assert.ok(oControlSpy.calledOnce);
		assert.equal(oControl.getLabel(), "new group label");
	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = { groupLabel: "new group label" };
		this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo);
		assert.equal(oChange.texts.groupLabel.value, "new group label");
	});

	QUnit.module('rename to empty string', {
		beforeEach: function () {
			this.oChangeHandler = RenameGroupChangeHandler;
		}
	});

	QUnit.test('applyChange on jsControlTree', function (assert) {
		var oChangeWrapper = new ChangeWrapper({
			"selector": {
				"id": "testkey"
			},
			"content": {
			},
			"texts": {
				"groupLabel": {
					"value": ""
				}
			}
		});

		var oControl = new SmartFormGroup();
		var oControlSpy = this.spy(oControl, "setLabel");
		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, oControl, {modifier: JsControlTreeModifier}));
		assert.ok(oControlSpy.calledOnce);
		assert.equal(oControl.getLabel(), "");

	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		this.oChangeHandler.completeChangeContent(oChangeWrapper, { groupLabel: "" });
		assert.equal(oChange.texts.groupLabel.value, "");

		var sError;
		try {
			this.oChangeHandler.completeChangeContent(oChangeWrapper, { groupLabel: undefined });
		} catch (Error) {
			sError = Error.message;
		}
		assert.equal(sError, "oSpecificChangeInfo.groupLabel attribute required");
	});

	QUnit.test('applyChange on xmlTree', function (assert) {
		var oChangeWrapper = new ChangeWrapper({
			"selector": {
				"id": "testkey"
			},
			"content": {
			},
			"texts": {
				"groupLabel": {
					"value": ""
				}
			}
		});
		var oDOMParser = new DOMParser();
		var oXmlDocument = oDOMParser.parseFromString("<Group label='OLD_VALUE' />", "application/xml");
		var oControl = oXmlDocument.childNodes[0];

		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, oControl, {modifier: XmlTreeModifier}));

		assert.equal(oControl.getAttribute("label"), "");

	});

}(sap.ui.comp.smartform.flexibility.changes.RenameGroup, sap.ui.comp.smartform.Group, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
