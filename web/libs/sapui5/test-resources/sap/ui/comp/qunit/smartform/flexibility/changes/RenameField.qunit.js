/*globals QUnit, sinon*/
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.RenameField");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (RenameFieldChangeHandler, SmartForm, GroupElement, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameField without label property in change content", {
		beforeEach: function () {
			this.oChangeHandler = RenameFieldChangeHandler;
			this.sNewValue = "new field label";

			var oChange = {
				"selector": {
					"id": "testkey"
				},
				"content": {
				},
				"texts": {
					"fieldLabel": {
						"value": this.sNewValue
					}
				}
			};
			this.oChangeWrapper = new ChangeWrapper(oChange);

			this.oSmartForm = new SmartForm();
			this.oGroupElement = new GroupElement();
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
		}
	});

	QUnit.test("applyChanges shall use the label property if found", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oChangeWrapper, this.oGroupElement, {modifier: JsControlTreeModifier}));

		assert.equal(this.oGroupElement.getLabelText(), this.sNewValue);
	});

	QUnit.test("applyChanges shall use the label property if found and use the title property as fallback", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oChangeWrapper, this.oSmartForm, {modifier: JsControlTreeModifier}));

		assert.equal( this.oSmartForm.getTitle(), this.sNewValue);
	});

	QUnit.test("applyChanges shall return false when called with XmlTreeModifier", function (assert) {
		var oControl = {setTitle: sinon.stub(), unbindProperty: sinon.stub() };

		assert.ok(!this.oChangeHandler.applyChange(this.oChangeWrapper, oControl, {modifier: XmlTreeModifier}));

	});

	QUnit.test("applyChanges shall raise an exception if the control does not have the required methods", function (assert) {
		var exception, oControl;

		oControl = {};

		//Call CUT
		try {
			this.oChangeHandler.applyChange(this.oChangeWrapper, oControl, {modifier: JsControlTreeModifier});
		} catch (ex) {
			exception = ex;
		}
		assert.ok(exception, "Shall raise an exception");
	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			},
			"content": {
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = { fieldLabel: this.sNewValue };

		this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo);

		assert.equal(oChange.texts.fieldLabel.value, this.sNewValue);
		assert.ok(!oChange.content.labelProperty);
	});

	QUnit.test('applyChange to empty string', function (assert) {
		var oChangeWrapper = new ChangeWrapper({
			"selector": {
				"id": "testkey"
			},
			"content": {
			},
			"texts": {
				"fieldLabel": {
					"value": ""
				}
			}
		});

		this.oSmartForm.setTitle("INITIAL");
		assert.ok(this.oChangeHandler.applyChange(oChangeWrapper, this.oSmartForm, {modifier: JsControlTreeModifier}));
		assert.equal(this.oSmartForm.getTitle(), "");
	});

	QUnit.test('completeChangeContent for empty string', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			},
			"content": {
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		this.oChangeHandler.completeChangeContent(oChangeWrapper, { fieldLabel: "" });
		assert.equal(oChange.texts.fieldLabel.value, "");

		var sError;
		try {
			this.oChangeHandler.completeChangeContent(oChangeWrapper, { fieldLabel: undefined });
		} catch (Error) {
			sError = Error.message;
		}
		assert.equal(sError, "oSpecificChangeInfo.fieldLabel attribute required");
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameField with label property in change content", {
		beforeEach: function () {
			this.oChangeHandler = RenameFieldChangeHandler;
			this.sNewValue = "new field label";
			var mLabelChange = {
				"selector": {
					"id": "testkey"
				},
				"content": {
					"labelProperty" : "label"
				},
				"texts": {
					"fieldLabel": {
						"value": this.sNewValue
					}
				}
			};
			var mTitleChange = {
				"selector": {
					"id": "testkey"
				},
				"content": {
					"labelProperty" : "title"
				},
				"texts": {
					"fieldLabel": {
						"value": this.sNewValue
					}
				}
			};
			this.oLabelChange = new ChangeWrapper(mLabelChange);
			this.oTitleChange = new ChangeWrapper(mTitleChange);

			this.oSmartForm = new SmartForm();
			this.oGroupElement = new GroupElement();

			var oDOMParser = new DOMParser();
			var oXmlDocument = oDOMParser.parseFromString("<view id='view'><SmartForm id='form' title='OLD_VALUE' /><GroupElement id='GroupElement' label='OLD_VALUE' /></view>", "application/xml");
			this.oXmlSmartForm = oXmlDocument.childNodes[0].childNodes[0];
			this.oXmlGroupElement = oXmlDocument.childNodes[0].childNodes[1];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
		}

	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "testkey"
			},
			"content": {
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = { fieldLabel: this.sNewValue, labelProperty: "label" };
		this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo);
		assert.equal(oChange.texts.fieldLabel.value, this.sNewValue );
		assert.equal(oChange.content.labelProperty, "label");
	});

	QUnit.test("applyChanges with XmlTreeModifier using label", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oLabelChange, this.oXmlGroupElement, {modifier: XmlTreeModifier}));

		assert.equal(this.oXmlGroupElement.getAttribute("label"), this.sNewValue);
	});

	QUnit.test("applyChanges with JsControlTreeModifier using label", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oLabelChange, this.oGroupElement, {modifier: JsControlTreeModifier}));

		assert.equal(this.oGroupElement.getLabelText(), this.sNewValue);
	});

	QUnit.test("applyChanges with XmlTreeModifier using title", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oTitleChange, this.oXmlSmartForm, {modifier: XmlTreeModifier}));

		assert.equal(this.oXmlSmartForm.getAttribute("title"), this.sNewValue);
	});
}(sap.ui.comp.smartform.flexibility.changes.RenameField, sap.ui.comp.smartform.SmartForm, sap.ui.comp.smartform.GroupElement, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
