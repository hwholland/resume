/*globals QUnit*/
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.AddGroup");
jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function (AddGroupChangeHandler, SmartForm, SmartFormGroup, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	'use strict';

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.AddGroup", {
		beforeEach: function () {
			this.oChangeHandler = AddGroupChangeHandler;
			this.oMockedAppComponent = {
				getLocalId: function () {
					return undefined;
				}
			}
		},
		afterEach: function () {
		}
	});


	QUnit.test('applyChange on js control tree- positive test', function (assert) {

		var oChange = {
			"selector": {
				"id": "formkey1"
			},
			"content": {
				"group": {
					"id": "groupId1",
					"index": 0
				}
			},
			"texts": {
				"groupLabel": {
					"value": "the group label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oForm = new SmartForm();
		var oAddGroupSpy = this.spy(oForm, "insertGroup");

		this.oChangeHandler.applyChange(oChangeWrapper, oForm, {modifier: JsControlTreeModifier});

		assert.ok(oAddGroupSpy.calledOnce);
		assert.equal(oForm.getGroups().length, 1);
	});



	QUnit.test('applyChange on xmltree - positive test', function (assert) {

		var sGroupId = "groupkey1";
		var sGroupLabel = "the group label";
		var sAddedGroupId = "smartGroupIdNew";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"group": {
					"id": sAddedGroupId,
					"index": 2
				}
			},
			"texts": {
				"groupLabel": {
					"value": "the group label",
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
			'<Form label="FormHeader" id="smartFormId">' +
				'<GroupElement id="' + sGroupElementId1 + '" />' +
				'<GroupElement id="' + sGroupElementId2 + '" />' +
				'<GroupElement id="' + sGroupElementId3 + '" />' +
			'</Form>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
		var oXmlSmartForm = oXmlDocument.childNodes[0];

		this.oChangeHandler.applyChange(oChangeWrapper, oXmlSmartForm, {modifier: XmlTreeModifier, view: oXmlDocument});

		assert.equal(oXmlSmartForm.childElementCount, 4);
		var aChildNodes = oXmlSmartForm.childNodes;
		assert.equal(aChildNodes[0].getAttribute("id"), sGroupElementId1);
		assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId2);
		assert.equal(aChildNodes[2].getAttribute("label"), sGroupLabel);
		assert.equal(aChildNodes[3].getAttribute("id"), sGroupElementId3);
	});

	QUnit.test('completeChangeContent', function (assert) {
		var oChange = {
			"selector": {
				"id": "formkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = { "groupLabel": "the group label", "index": 1, "newControlId": "new--group--control--id" };

		this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, {appComponent: this.oMockedAppComponent});

		assert.equal(oChange.content.group.selector.id, "new--group--control--id");
		assert.equal(oChange.content.group.index, 1);
		assert.equal(oChange.texts.groupLabel.value, "the group label");
	});

}(sap.ui.comp.smartform.flexibility.changes.AddGroup, sap.ui.comp.smartform.SmartForm, sap.ui.comp.smartform.Group, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
