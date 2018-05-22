/*globals QUnit, sinon*/
(function() {
	'use strict';

	sinon.config.useFakeTimers = false;

	jQuery.sap.require("sap.ui.comp.smartform.flexibility.FormP13nHandler");
	jQuery.sap.require("sap.m.Label");
	jQuery.sap.require("sap.m.Dialog");
	jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
	jQuery.sap.require("sap.ui.comp.smartform.Group");
	jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
	jQuery.sap.require("sap.ui.fl.Utils");
	jQuery.sap.require("sap.ui.fl.FlexController");
	jQuery.sap.require("sap.ui.fl.transport.TransportSelection");
	jQuery.sap.require("sap.ui.fl.transport.Transports");
	jQuery.sap.require("sap.ui.fl.LrepConnector");

	var FlexController = sap.ui.fl.FlexController;
	var Utils = sap.ui.fl.Utils;

	QUnit.module("sap.ui.comp.smartform.flexibility.FormP13nHandler", {
		beforeEach: function() {
			this.sandbox = sinon.sandbox.create();
			this.controlsToDestroy = [];
			this.sandbox.stub(Utils, 'getComponentClassName').returns('testComponent');
			this.sandbox.stub(Utils,"getAppDescriptor").returns({
				"sap.app":{
					id: "testComponent"
				}
			});
			this.oComponentMock = {
				getMetadata: function () {
					return {
						getName: function () {
							return sComponentName;
						}
					};
				},
				getManifestEntry: function () {
					return undefined;
				},
				getLocalId: function () {
					return false;
				}
			};
			this.sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(this.oComponentMock);
			this.sandbox.stub(sap.ui.fl.LrepConnector.prototype, 'loadChanges').returns(Promise.resolve({changes: {changes: []}}));
			var oSmartForm = new sap.ui.comp.smartform.SmartForm();
			this.controlsToDestroy.push(oSmartForm);
			this.oPersDialog = new sap.ui.comp.smartform.flexibility.FormP13nHandler(oSmartForm);

			this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_showTransportSuccessMessage");
			this.sandbox.stub(sap.ui.fl.transport.TransportSelection.prototype, "selectTransport").callsArg(1);
			var oView = {
				createId: function(sId) {
					return "main--view1--" + sId;
				}
			};
			this.sandbox.stub(sap.ui.fl.Utils, "getViewForControl").returns(oView);
		},
		afterEach: function() {
			this.sandbox.restore();

			this.controlsToDestroy.forEach(function(control) {
				control.destroy();
			});
			if (this.oPersDialog) {
				this.oPersDialog._closeDialog();
			}
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oPersDialog);
	});

	QUnit.test("init - create internal variables and call panel creation", function(assert) {
		//Arrange
		var settingsMergeErrorStub = this.sandbox.stub(sap.ui.fl.registry.Settings.prototype, "hasMergeErrorOccured").returns(false);
		var dialogSetTitleStub = this.sandbox.stub(sap.m.Dialog.prototype, "setTitle");
		var dialogSetContentHeightStub = this.sandbox.stub(sap.m.Dialog.prototype, "setContentHeight");
		var buttonCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createButtons");
		var createDialogContentStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createDialogContent");

		//Act
		return this.oPersDialog.init().then(function() {
			//Assert
			assert.ok(dialogSetTitleStub.calledOnce);
			assert.ok(dialogSetContentHeightStub.calledOnce);
			assert.ok(buttonCreationStub.calledOnce);
			assert.ok(settingsMergeErrorStub.calledOnce);
			assert.ok(createDialogContentStub.calledOnce);
		});
	});

	QUnit.test("init - create internal variables and call panel creation with merge error flag set", function(assert) {
		//Arrange
		var settingsMergeErrorStub = this.sandbox.stub(sap.ui.fl.registry.Settings.prototype, "hasMergeErrorOccured").returns(true);
		var dialogSetTitleStub = this.sandbox.stub(sap.m.Dialog.prototype, "setTitle");
		var buttonCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createButtons");
		var buttonGenerateErrorMessageStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_showMergeErrorMessageInDialog");

		//Act
		return this.oPersDialog.init().then(function() {
			//Assert
			assert.ok(dialogSetTitleStub.calledOnce);
			assert.ok(buttonCreationStub.calledOnce);
			assert.ok(settingsMergeErrorStub.calledOnce);
			assert.ok(buttonGenerateErrorMessageStub.calledOnce);
		});
	});

	QUnit.test("_createModelFromSmartForm - Check return of valid schema with smartform", function(assert) {
		//Arrange
		var smartForm = new sap.ui.comp.smartform.SmartForm("form1");
		this.controlsToDestroy.push(smartForm);
		var smartGroup1 = new sap.ui.comp.smartform.Group("group1");
		var smartField1 = new sap.ui.comp.smartform.GroupElement("field1");
		var smartGroup2 = new sap.ui.comp.smartform.Group("group2");
		var smartField21 = new sap.ui.comp.smartform.GroupElement("field21");
		var smartField22 = new sap.ui.comp.smartform.GroupElement("field22");
		var smartField23 = new sap.ui.comp.smartform.GroupElement("field23");
		var smartField24 = new sap.ui.comp.smartform.GroupElement("field24");

		smartField1.setLabel("FieldLabel1");
		smartGroup1.setLabel("GroupLabel1");
		smartGroup1.addAggregation("groupElements", smartField1);

		smartField21.setLabel("FieldLabel21");
		smartField22.setLabel("");
		smartField23.setLabel(undefined);
		smartField24.setLabel(null);
		smartGroup2.setLabel("GroupLabel2");
		smartGroup2.addAggregation("groupElements", smartField21);
		smartGroup2.addAggregation("groupElements", smartField22);
		smartGroup2.addAggregation("groupElements", smartField23);
		smartGroup2.addAggregation("groupElements", smartField24);

		smartForm.setTitle("FormTitle1");
		smartForm.addAggregation("groups", smartGroup1);
		smartForm.addAggregation("groups", smartGroup2);

		var expectedResult = {
			id: "form1",
			label: "FormTitle1",
			isVisible: true,
			type: "form",
			children: [
				{
					id: "group1",
					label: "GroupLabel1",
					isVisible: true,
					type: "group",
					children: [
						{
							bindingPaths: [{'path': 'Header/CompanyCode'}],
							id: "field1",
							label: "FieldLabel1",
							isVisible: true,
							type: "field"
						}
					]
				}, {
					id: "group2",
					label: "GroupLabel2",
					isVisible: true,
					type: "group",
					children: [
						{
							bindingPaths: [{'path': 'Header/CompanyCode'}],
							id: "field21",
							label: "FieldLabel21",
							isVisible: true,
							type: "field"
						}
					]
				}
			]
		};
		var expectedBindingPathToFieldListElement = {
			'Header/CompanyCode': {
				bindingPaths: [{'path': 'Header/CompanyCode'}],
				id: "field21",
				label: "FieldLabel21",
				isVisible: true,
				type: "field"
			}
		};
		var expectedIdToFieldListElement = {
			'field1': {
				bindingPaths: [{'path': 'Header/CompanyCode'}],
				id: "field1",
				label: "FieldLabel1",
				isVisible: true,
				type: "field"
			},
			'field21': {
				bindingPaths: [{'path': 'Header/CompanyCode'}],
				id: "field21",
				label: "FieldLabel21",
				isVisible: true,
				type: "field"
			}
		};
		this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, '_determineRelevantBindingPathsOf').returns([{'path': 'Header/CompanyCode'}]);

		//Act
		var result = this.oPersDialog._createModelFromSmartForm(smartForm);

		//Assert
		assert.deepEqual(result, expectedResult);
		assert.deepEqual(this.oPersDialog._mBindingPathToFieldListElement, expectedBindingPathToFieldListElement);
		assert.deepEqual(this.oPersDialog._mIdToFieldListElement, expectedIdToFieldListElement);
	});

	QUnit.test("_getModelNodeForSmartGroupElement - Check return of valid format with SmartField element only", function(assert) {
		//Arrange
		var smartField = new sap.ui.comp.smartform.GroupElement("field1");
		smartField.setLabel("FieldLabel1");
		this.controlsToDestroy.push(smartField);

		var expectedResult = {
			bindingPaths: [],
			id: "field1",
			label: "FieldLabel1",
			isVisible: true,
			type: "field"
		};

		//Act
		var result = this.oPersDialog._getModelNodeForSmartGroupElement(smartField);

		//Assert
		assert.deepEqual(result, expectedResult);

	});

	QUnit.test("_getModelNodeForSmartGroup - Check return of valid format with SmartGroup element only", function(assert) {
		//Arrange
		var smartGroup = new sap.ui.comp.smartform.Group("group1");
		this.controlsToDestroy.push(smartGroup);
		smartGroup.setLabel("GroupLabel1");

		var expectedResult = {
			id: "group1",
			label: "GroupLabel1",
			isVisible: true,
			type: "group",
			children: []
		};

		//Act
		var result = this.oPersDialog._getModelNodeForSmartGroup(smartGroup);

		//Assert
		assert.deepEqual(result, expectedResult);
	});

	QUnit.test("_getModelNodeForSmartForm - Check return of valid format with SmartForm element only", function(assert) {
		//Arrange
		var smartForm = new sap.ui.comp.smartform.SmartForm("form1");
		this.controlsToDestroy.push(smartForm);
		smartForm.setTitle("FormTitle1");

		var expectedResult = {
			id: "form1",
			label: "FormTitle1",
			isVisible: true,
			type: "form",
			children: []
		};
		//Act
		var result = this.oPersDialog._getModelNodeForSmartForm(smartForm);

		//Assert
		assert.deepEqual(result, expectedResult);
	});

	// FIXME: the following tests will fail with PhantomJS => check how to renable them
	if (!sap.ui.Device.browser.phantomJS) {
		QUnit.test("_createButtons - Check that button are created", function(assert) {
			//Arrange
			var buttonAddStub = this.sandbox.stub(sap.m.Dialog.prototype, "addButton");

			return this.oPersDialog.init().then(function() {
				//Assert
				assert.equal(buttonAddStub.callCount, 4);
			});
		});
	}

	QUnit.test("_createNodeMap - forms having groups and fields", function(assert) {

		var aJsonNodes, oNodeMap = {};

		/*	node= {

		 id:"abc",

		 label:"zuzu",

		 isVisible: true,

		 type: "form",   //form|group|field

		 children: [node]

		 }*/

		// test 1 - aJsonNodes undefined
		this.oPersDialog._createNodeMap(aJsonNodes, oNodeMap);

		// test 2 - two forms with groups as children - groups have fields as children
		var oForm1 = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};
		var oForm2 = {
			id: "idForm2",
			label: "form2",
			isVisible: true,
			type: "form",
			children: []
		};

		aJsonNodes = [];
		aJsonNodes.push(oForm1);
		aJsonNodes.push(oForm2);

		var oGroup1 = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2 = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1.children.push(oGroup1);
		oForm1.children.push(oGroup2);

		oForm2.children.push(oGroup2);

		var oField1 = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2 = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1.children.push(oField1);
		oGroup1.children.push(oField2);

		oGroup2.children.push(oField1);

		oNodeMap = {};
		this.oPersDialog._createNodeMap(aJsonNodes, oNodeMap);

		assert.equal(Object.keys(oNodeMap).length, 6);

		assert.deepEqual(oNodeMap["idForm1"].node, oForm1);
		assert.ok(!oNodeMap["idForm1"].index);

		assert.deepEqual(oNodeMap["idForm2"].node, oForm2);
		assert.ok(!oNodeMap["idForm2"].index);

		assert.deepEqual(oNodeMap["idGroup1"].node, oGroup1);
		assert.equal(oNodeMap["idGroup1"].index["idForm1"], 0);

		assert.deepEqual(oNodeMap["idGroup2"].node, oGroup2);
		assert.equal(oNodeMap["idGroup2"].index["idForm1"], 1);
		assert.equal(oNodeMap["idGroup2"].index["idForm2"], 0);

		assert.deepEqual(oNodeMap["idField1"].node, oField1);
		assert.equal(oNodeMap["idField1"].index["idGroup1"], 0);
		assert.equal(oNodeMap["idField1"].index["idGroup2"], 0);

		assert.deepEqual(oNodeMap["idField2"].node, oField2);
		assert.equal(oNodeMap["idField2"].index["idGroup1"], 1);

	});

	QUnit.test("_createLabelChange -  for forms, groups and fields", function(assert) {

		// no type specified
		var oLabelChange = this.oPersDialog._createLabelChange("Id1", "newLabel");

		assert.deepEqual(oLabelChange, {});

		// form
		oLabelChange = this.oPersDialog._createLabelChange("Id1", "newLabel", "form");

		assert.deepEqual(oLabelChange, {});

		// group
		oLabelChange = this.oPersDialog._createLabelChange("Id1", "newLabel", "group");

		assert.equal(oLabelChange.selector.id, "Id1");
		assert.equal(oLabelChange.changeType, "renameGroup");
		assert.equal(oLabelChange.groupLabel, "newLabel");

		// field
		oLabelChange = this.oPersDialog._createLabelChange("Id2", "newLabel", "field");

		assert.equal(oLabelChange.selector.id, "Id2");
		assert.equal(oLabelChange.changeType, "renameField");
		assert.equal(oLabelChange.fieldLabel, "newLabel");

	});

	QUnit.test("_createVisibilityChange", function(assert) {

		// unhide control
		var oChange = this.oPersDialog._createVisibilityChange("Id1", true);

		assert.equal(oChange.selector.id, "Id1");
		assert.equal(oChange.changeType, "unhideControl");

		// hide control
		oChange = this.oPersDialog._createVisibilityChange("Id2", false);

		assert.equal(oChange.selector.id, "Id2");
		assert.equal(oChange.changeType, "hideControl");

	});

	QUnit.test("_createMoveChange", function(assert) {

		var aIndex = [
			{
				"id": "id5",
				"index": 1
			}
		];

		// test 1 - move groups
		var oChange = this.oPersDialog._createMoveChange("Id1", "form", aIndex);

		assert.equal(oChange.selector.id, "Id1");
		assert.equal(oChange.changeType, "moveGroups");
		assert.equal(oChange.moveGroups.length, 1);
		assert.deepEqual(oChange.moveGroups[0], {
			"id": "id5",
			"index": 1
		});

		// test 2 - move fields within the same group
		oChange = this.oPersDialog._createMoveChange("Id2", "group", aIndex);

		assert.equal(oChange.selector.id, "Id2");
		assert.equal(oChange.changeType, "moveFields");
		assert.equal(oChange.moveFields.length, 1);
		assert.deepEqual(oChange.moveFields[0], {
			"id": "id5",
			"index": 1
		});

		// test 3 - move fields between groups
		oChange = this.oPersDialog._createMoveChange("Id3", "group", aIndex, "newTarget");

		assert.equal(oChange.selector.id, "Id3");
		assert.equal(oChange.changeType, "moveFields");
		assert.equal(oChange.targetId, "newTarget");
		assert.equal(oChange.moveFields.length, 1);
		assert.deepEqual(oChange.moveFields[0], {
			"id": "id5",
			"index": 1
		});

		// test 4 - not supported
		oChange = this.oPersDialog._createMoveChange("Id4", "field", aIndex);

		assert.deepEqual(oChange, {});

	});

	QUnit.test("_createAddChange", function(assert) {

		// test 1 - add group
		var oGroup = {

			id: "idGroup",

			label: "group label",

			isVisible: true,

			type: "group", //form|group|field

			children: []

		};

		var oChange = this.oPersDialog._createAddChange("Id1", oGroup, 0);

		assert.equal(oChange.selector.id, "Id1");
		assert.equal(oChange.index, 0);
		assert.equal(oChange.changeType, "addGroup");
		assert.equal(oChange.groupLabel, "group label");

		// test 2 - add field
		var oField = {

			id: "idField",

			label: "field label",

			isVisible: true,

			type: "field", //form|group|field

			fieldValue: "value of field",

			valueProperty: "value property",

			jsType: "javascript type",

			children: []

		};

		oChange = this.oPersDialog._createAddChange("Id2", oField, 1);

		assert.equal(oChange.selector.id, "Id2");
		assert.equal(oChange.index, 1);
		assert.equal(oChange.changeType, "addField");
		assert.equal(oChange.fieldLabel, "field label");
		assert.equal(oChange.fieldValue, "value of field");
		assert.equal(oChange.valueProperty, "value property");
		assert.equal(oChange.jsType, "javascript type");

		// test 3 - add form (not supported yet)
		var oForm = {

			id: "idForm",

			label: "form label",

			isVisible: true,

			type: "form", //form|group|field

			children: []

		};

		oChange = this.oPersDialog._createAddChange("Id4", oForm);

		assert.deepEqual(oChange, {});

	});

	QUnit.test("createChangeFiles - labels changed", function(assert) {

		/*	node= {

		 id:"abc",

		 label:"zuzu",

		 isVisible: true,

		 type: "form",   //form|group|field

		 children: [node]

		 }*/

		// test setup
		// two forms with groups as children - groups have fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};
		var oForm2b = {
			id: "idForm2",
			label: "form2",
			isVisible: true,
			type: "form",
			children: []
		};

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);
		aJsonNodesBefore.push(oForm2b);

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2b = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);
		oForm1b.children.push(oGroup2b);

		oForm2b.children.push(oGroup2b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		oGroup2b.children.push(oField1b);

		// same two forms after label changes
		var oForm1a = {
			id: "idForm1",
			label: "form1new",
			isVisible: true,
			type: "form",
			children: []
		};
		var oForm2a = {
			id: "idForm2",
			label: "form2new",
			isVisible: true,
			type: "form",
			children: []
		};

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);
		aJsonNodesAfter.push(oForm2a);

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2new",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		oForm2a.children.push(oGroup2a);

		var oField1a = {
			id: "idField1",
			label: "field1new",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField2a);

		oGroup2a.children.push(oField1a);

		// test
		var aChange = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChange.length, 2);

		// field
		var oLabelChange = aChange[0];

		assert.equal(oLabelChange.selector.id, "idField1");
		assert.equal(oLabelChange.changeType, "renameField");
		assert.equal(oLabelChange.fieldLabel, "field1new");

		// group
		oLabelChange = aChange[1];

		assert.equal(oLabelChange.selector.id, "idGroup2");
		assert.equal(oLabelChange.changeType, "renameGroup");
		assert.equal(oLabelChange.groupLabel, "group2new");

	});

	QUnit.test("createChangeFiles - visibility changed", function(assert) {

		/*	node= {

		 id:"abc",

		 label:"zuzu",

		 isVisible: true,

		 type: "form",   //form|group|field

		 children: [node]

		 }*/

		// test setup
		// two forms with groups as children - groups have fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: false,
			type: "form",
			children: []
		};
		var oForm2b = {
			id: "idForm2",
			label: "form2",
			isVisible: true,
			type: "form",
			children: []
		};

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);
		aJsonNodesBefore.push(oForm2b);

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: false,
			type: "group",
			children: []
		};
		var oGroup2b = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);
		oForm1b.children.push(oGroup2b);

		oForm2b.children.push(oGroup2b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: false,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		oGroup2b.children.push(oField1b);

		// same two forms after visibility changes
		// form 2 hidden
		// group 1 unhidden
		// group 2 hidden
		// field 1 unhidden
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: false,
			type: "form",
			children: []
		};
		var oForm2a = {
			id: "idForm2",
			label: "form2",
			isVisible: false,
			type: "form",
			children: []
		};

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);
		aJsonNodesAfter.push(oForm2a);

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: false,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		oForm2a.children.push(oGroup2a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField2a);

		oGroup2a.children.push(oField1a);

		// test
		var aChange = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChange.length, 4);

		var oChange = aChange[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.changeType, "unhideControl");

		oChange = aChange[1];

		assert.equal(oChange.selector.id, "idField1");
		assert.equal(oChange.changeType, "unhideControl");

		oChange = aChange[2];

		assert.equal(oChange.selector.id, "idGroup2");
		assert.equal(oChange.changeType, "hideControl");

		// form
		var oChange = aChange[3];

		assert.equal(oChange.selector.id, "idForm2");
		assert.equal(oChange.changeType, "hideControl");

	});

	QUnit.test("_check4AddChanges/_createChangeSpecificDataFromDialogModel - add one group", function(assert) {

		// test setup
		var addChangeCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createAddChange");

		var aChanges = [], oMapBefore = {};

		// form with group as child
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form after group has been added
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		// test 1
		this.oPersDialog._check4AddChanges(oForm1a, oMapBefore, aChanges);

		// checks
		assert.ok(addChangeCreationStub.calledOnce);

		// stub teardown
		addChangeCreationStub.restore();

		// test 2
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChanges.length, 1);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idForm1");
		assert.equal(oChange.index, 1);
		assert.equal(oChange.changeType, "addGroup");
		assert.equal(oChange.groupLabel, "group2");
	});

	QUnit.test("_check4AddChanges/_createChangeSpecificDataFromDialogModel - add one group hidden", function(assert) {

		// test setup
		var hideChangeCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createVisibilityChange");

		var aChanges = [], oMapBefore = {};

		// form with group as child
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form after group has been added hidden
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: false,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		// test 1
		this.oPersDialog._check4AddChanges(oForm1a, oMapBefore, aChanges);

		// checks
		assert.ok(hideChangeCreationStub.calledOnce);

		// stub teardown
		hideChangeCreationStub.restore();

		// test 2
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChanges.length, 2);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idForm1");
		assert.equal(oChange.index, 1);
		assert.equal(oChange.changeType, "addGroup");
		assert.equal(oChange.groupLabel, "group2");

		oChange = aChanges[1];

		assert.equal(oChange.selector.id, "idGroup2");
		assert.equal(oChange.changeType, "hideControl");
	});

	QUnit.test("_check4AddChanges/_createChangeSpecificDataFromDialogModel - add one field", function(assert) {

		// test setup
		var addChangeCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createAddChange");

		var aChanges = [], oMapBefore = {};

		// form with group as child - group has field
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form after field has been added to group
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field",
			fieldValue: "field value",
			valueProperty: "value property",
			jsType: "javascript type"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField2a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		// test
		this.oPersDialog._check4AddChanges(oForm1a, oMapBefore, aChanges);

		// checks
		assert.ok(addChangeCreationStub.calledOnce);

		addChangeCreationStub.restore();

		// test 2
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChanges.length, 1);
		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.index, 1);
		assert.equal(oChange.changeType, "addField");
		assert.equal(oChange.fieldLabel, "field2");
		assert.equal(oChange.fieldValue, "field value");
		assert.equal(oChange.valueProperty, "value property");
		assert.equal(oChange.jsType, "javascript type");
	});

	QUnit.test("_check4AddChanges/_createChangeSpecificDataFromDialogModel - add one field hidden", function(assert) {

		// test setup
		var hideChangeCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createVisibilityChange");
		var aChanges = [], oMapBefore = {};

		// form with group as child - group has field
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form after field has been added to group
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: false,
			type: "field",
			fieldValue: "field value",
			valueProperty: "value property",
			jsType: "javascript type"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField2a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		// test
		this.oPersDialog._check4AddChanges(oForm1a, oMapBefore, aChanges);

		// checks
		assert.ok(hideChangeCreationStub.calledOnce);

		hideChangeCreationStub.restore();

		// test 2
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChanges.length, 2);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.index, 1);
		assert.equal(oChange.changeType, "addField");
		assert.equal(oChange.fieldLabel, "field2");
		assert.equal(oChange.fieldValue, "field value");
		assert.equal(oChange.valueProperty, "value property");
		assert.equal(oChange.jsType, "javascript type");

		oChange = aChanges[1];

		assert.equal(oChange.selector.id, "idField2");
		assert.equal(oChange.changeType, "hideControl");
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - nothing moved", function(assert) {

		// test setup
		var moveChangeCreationStub = this.sandbox.stub(sap.ui.comp.smartform.flexibility.FormP13nHandler.prototype, "_createMoveChange");

		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// two forms with groups as children - groups have fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};
		var oForm2b = {
			id: "idForm2",
			label: "form2",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2b = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);
		oForm1b.children.push(oGroup2b);

		oForm2b.children.push(oGroup2b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		oGroup2b.children.push(oField1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);
		aJsonNodesBefore.push(oForm2b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same forms - no changes
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};
		var oForm2a = {
			id: "idForm2",
			label: "form2",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		oForm2a.children.push(oGroup2a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField2a);

		oGroup2a.children.push(oField1a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);
		aJsonNodesAfter.push(oForm2a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test 1a
		this.oPersDialog._check4InterMoveChanges(oForm1a, oMapBefore, oMapAfter, aChanges);

		// checks
		assert.ok(moveChangeCreationStub.notCalled);

		// test 1b
		this.oPersDialog._check4IntraMoveChanges(oForm1a, oMapBefore, oMapAfter, aChanges);

		// checks
		assert.ok(moveChangeCreationStub.notCalled);

		// test 2a
		this.oPersDialog._check4InterMoveChanges(oForm2a, oMapBefore, oMapAfter, aChanges);

		// checks
		assert.ok(moveChangeCreationStub.notCalled);

		// test 2b
		this.oPersDialog._check4IntraMoveChanges(oForm2a, oMapBefore, oMapAfter, aChanges);

		// checks
		assert.ok(moveChangeCreationStub.notCalled);

		// test 3
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		// checks
		assert.equal(aChanges.length, 0);
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - group order changed", function(assert) {

		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// form with two groups as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2b = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);
		oForm1b.children.push(oGroup2b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form - group order changed
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup2a);
		oForm1a.children.push(oGroup1a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		assert.equal(aChanges.length, 1);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idForm1");
		assert.equal(oChange.changeType, "moveGroups");
		assert.equal(oChange.moveGroups.length, 2);
		assert.deepEqual(oChange.moveGroups[0], {
			"id": "idGroup2",
			"index": 0
		});
		assert.deepEqual(oChange.moveGroups[1], {
			"id": "idGroup1",
			"index": 1
		});
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - field order changed within group", function(assert) {

		// test setup
		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// form with group as child - group has fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form - field order in group is changed
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1a.children.push(oField2a);
		oGroup1a.children.push(oField1a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		assert.equal(aChanges.length, 1);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.changeType, "moveFields");
		assert.equal(oChange.moveFields.length, 2);
		assert.deepEqual(oChange.moveFields[0], {
			"id": "idField2",
			"index": 0
		});
		assert.deepEqual(oChange.moveFields[1], {
			"id": "idField1",
			"index": 1
		});
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - field moved between two groups", function(assert) {

		// test setup
		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// form with groups as children - groups have fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2b = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);
		oForm1b.children.push(oGroup2b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};
		var oField3b = {
			id: "idField3",
			label: "field3",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);
		oGroup1b.children.push(oField3b);

		oGroup2b.children.push(oField1b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same forms - field 2 moved to top of group 2
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};
		var oGroup2a = {
			id: "idGroup2",
			label: "group2",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);
		oForm1a.children.push(oGroup2a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};
		var oField3a = {
			id: "idField3",
			label: "field3",
			isVisible: true,
			type: "field"
		};

		oGroup1a.children.push(oField1a);
		oGroup1a.children.push(oField3a);

		oGroup2a.children.push(oField2a);
		oGroup2a.children.push(oField1a);

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		assert.equal(aChanges.length, 1);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.changeType, "moveFields");
		assert.equal(oChange.targetId, "idGroup2");
		assert.equal(oChange.moveFields.length, 1);
		assert.deepEqual(oChange.moveFields[0], {
			"id": "idField2",
			"index": 0
		});
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - add field to group at the top", function(assert) {

		// test setup
		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// form with group as children - group has fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form - new field added to group at the top
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};
		var oField3a = {
			id: "idField3",
			label: "field3",
			isVisible: true,
			type: "field",
			fieldValue: "field value",
			valueProperty: "value property",
			jsType: "javascript type"
		};

		oGroup1a.children = [
			oField3a, oField1a, oField2a
		];

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		assert.equal(aChanges.length, 1);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.index, 0);
		assert.equal(oChange.changeType, "addField");
		assert.equal(oChange.fieldLabel, "field3");
		assert.equal(oChange.fieldValue, "field value");
		assert.equal(oChange.valueProperty, "value property");
		assert.equal(oChange.jsType, "javascript type");
	});

	QUnit.test("_createChangeSpecificDataFromDialogModel - add field to group and move another field", function(assert) {

		// test setup
		var aChanges = [], oMapBefore = {}, oMapAfter = {};

		// form with group as children - group has fields as children
		var oForm1b = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1b = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1b.children.push(oGroup1b);

		var oField1b = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2b = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};

		oGroup1b.children.push(oField1b);
		oGroup1b.children.push(oField2b);

		var aJsonNodesBefore = [];
		aJsonNodesBefore.push(oForm1b);

		this.oPersDialog._createNodeMap(aJsonNodesBefore, oMapBefore);

		// same form - new field added to group at the top
		var oForm1a = {
			id: "idForm1",
			label: "form1",
			isVisible: true,
			type: "form",
			children: []
		};

		var oGroup1a = {
			id: "idGroup1",
			label: "group1",
			isVisible: true,
			type: "group",
			children: []
		};

		oForm1a.children.push(oGroup1a);

		var oField1a = {
			id: "idField1",
			label: "field1",
			isVisible: true,
			type: "field"
		};
		var oField2a = {
			id: "idField2",
			label: "field2",
			isVisible: true,
			type: "field"
		};
		var oField3a = {
			id: "idField3",
			label: "field3",
			isVisible: true,
			type: "field",
			fieldValue: "field value",
			valueProperty: "value property",
			jsType: "javascript type"
		};

		oGroup1a.children = [
			oField3a, oField2a, oField1a
		];

		var aJsonNodesAfter = [];
		aJsonNodesAfter.push(oForm1a);

		this.oPersDialog._createNodeMap(aJsonNodesAfter, oMapAfter);

		// test
		aChanges = this.oPersDialog._createChangeSpecificDataFromDialogModel(aJsonNodesBefore, aJsonNodesAfter);

		assert.equal(aChanges.length, 2);

		var oChange = aChanges[0];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.index, 0);
		assert.equal(oChange.changeType, "addField");
		assert.equal(oChange.fieldLabel, "field3");
		assert.equal(oChange.fieldValue, "field value");
		assert.equal(oChange.valueProperty, "value property");
		assert.equal(oChange.jsType, "javascript type");

		oChange = aChanges[1];

		assert.equal(oChange.selector.id, "idGroup1");
		assert.equal(oChange.changeType, "moveFields");
		assert.equal(oChange.moveFields.length, 1);
		assert.deepEqual(oChange.moveFields[0], {
			"id": "idField1",
			"index": 2
		});
	});

	QUnit.test("_createSmartFormControlMap", function(assert) {
		var mExpControlMap = [];
		//Arrange
		var oSmartForm = new sap.ui.comp.smartform.SmartForm("form1");
		this.controlsToDestroy.push(oSmartForm);
		mExpControlMap["form1"] = oSmartForm;
		var oSmartGroup1 = new sap.ui.comp.smartform.Group("group1");
		mExpControlMap["group1"] = oSmartGroup1;
		var oSmartField1 = new sap.ui.comp.smartform.GroupElement("field1");
		mExpControlMap["field1"] = oSmartField1;
		var oSmartGroup2 = new sap.ui.comp.smartform.Group("group2");
		mExpControlMap["group2"] = oSmartGroup2;
		var oSmartField2 = new sap.ui.comp.smartform.GroupElement("field2");
		mExpControlMap["field2"] = oSmartField2;

		oSmartGroup1.addGroupElement(oSmartField1);
		oSmartGroup2.addGroupElement(oSmartField2);
		oSmartForm.addGroup(oSmartGroup1);
		oSmartForm.addGroup(oSmartGroup2);

		//Act
		var mControlMap = this.oPersDialog._createSmartFormControlMap(oSmartForm);

		//Assert
		assert.deepEqual(mControlMap, mExpControlMap);
	});

	QUnit.test("_filterChangesForSmartForm", function(assert) {
		var mControlMap = {};
		var oSmartForm = new sap.ui.comp.smartform.SmartForm("form1b");
		this.controlsToDestroy.push(oSmartForm);
		mControlMap["form1b"] = oSmartForm;
		var oSmartGroup1 = new sap.ui.comp.smartform.Group("group1b");
		mControlMap["group1b"] = oSmartGroup1;
		var oSmartField1 = new sap.ui.comp.smartform.GroupElement("field1b");
		mControlMap["field1b"] = oSmartField1;
		oSmartGroup1.addGroupElement(oSmartField1);
		oSmartForm.addGroup(oSmartGroup1);

		this.sandbox.stub(this.oPersDialog, "_createSmartFormControlMap").returns(mControlMap);

		var aChanges = [
			{
				getSelector: function() {
					return {
						id: "field1b"
					};
					}
			}, {
				getSelector: function() {
					return {
						id: "field2b"
					};
					}
				}
		];
		var aFilteredChanges = this.oPersDialog._filterChangesForSmartForm(aChanges, oSmartForm);

		assert.equal(aFilteredChanges.length, 1);
		assert.equal(aFilteredChanges[0].getSelector().id, "field1b");
	});

	QUnit.test('_createAndApplyChanges shall do what it is promising and save the changes', function(assert) {
		var changes = [
			this.oPersDialog._createLabelChange('controlId', 'newLabel', 'group')
		];
		var group = new sap.ui.comp.smartform.Group('controlId', {
			label: 'myLabel'
		});

		this.controlsToDestroy.push(group);

		var flexController = new FlexController('testComponent');

		this.sandbox.stub(flexController, 'saveAll').returns(Promise.resolve());
		this.sandbox.stub(this.oPersDialog, '_getFlexController').returns(flexController);

		return this.oPersDialog._createAndApplyChanges(changes).then(function() {
			assert.strictEqual(group.getLabel(), 'newLabel');
		});
	});

	QUnit.test('_createAndApplyChanges shall handle save errors', function(assert) {
		var changes = [
			this.oPersDialog._createLabelChange('controlId2', 'newLabel', 'group')
		];
		var group = new sap.ui.comp.smartform.Group('controlId2', {
			label: 'myLabel'
		});

		this.controlsToDestroy.push(group);

		var flexController = new FlexController();

		var testError = Error('test error');
		this.sandbox.stub(flexController, 'saveAll').throws(testError);
		this.sandbox.stub(this.oPersDialog, '_getFlexController').returns(flexController);
		var saveAndApplyErrorStub = this.sandbox.stub(this.oPersDialog, '_showApplySaveChangesErrorMessage');

		return this.oPersDialog._createAndApplyChanges(changes).then(function() {
			sinon.assert.calledOnce(saveAndApplyErrorStub);
		});
	});

	QUnit.test('_createAndApplyChanges shall handle create and apply errors', function(assert) {
		var changes = [
			this.oPersDialog._createLabelChange('controlId2', 'newLabel', 'group')
		];
		var group = new sap.ui.comp.smartform.Group('controlId2', {
			label: 'myLabel'
		});

		this.controlsToDestroy.push(group);

		var flexController = new FlexController();

		var testError = new Error('test error');
		this.sandbox.stub(flexController, 'applyChange').throws(testError);
		this.sandbox.stub(this.oPersDialog, '_getFlexController').returns(flexController);
		var saveAndApplyErrorStub = this.sandbox.stub(this.oPersDialog, '_showApplySaveChangesErrorMessage');

		return this.oPersDialog._createAndApplyChanges(changes).then(function() {
			sinon.assert.calledOnce(saveAndApplyErrorStub);
		});
	});

	QUnit.test('_createAndApplyChanges shall handle create and apply errors and save errors, but show the error message only once', function(assert) {
		var changes = [
			this.oPersDialog._createLabelChange('controlId2', 'newLabel', 'group')
		];
		var group = new sap.ui.comp.smartform.Group('controlId2', {
			label: 'myLabel'
		});

		this.controlsToDestroy.push(group);

		var flexController = new FlexController();

		this.sandbox.stub(flexController, 'applyChange').throws(new Error('applyChange issue'));
		this.sandbox.stub(flexController, 'saveAll').throws(new Error('save all issue'));
		this.sandbox.stub(this.oPersDialog, '_getFlexController').returns(flexController);
		var saveAndApplyErrorStub = this.sandbox.stub(this.oPersDialog, '_showApplySaveChangesErrorMessage');

		return this.oPersDialog._createAndApplyChanges(changes).then(function() {
			sinon.assert.calledOnce(saveAndApplyErrorStub);
		});
	});

	QUnit.test('_confirmTransportAllChanges should show an error, if createAndApply fails, but should not show the general error', function(assert) {
		this.sandbox.stub(this.oPersDialog, "_getChangeDataFromDialog").returns([{}]);
		this.sandbox.stub(this.oPersDialog, "_createAndApplyChanges").throws(new Error('createAndApply test error'));
		this.sandbox.stub(this.oPersDialog, "_getAllLocalChanges");
		this.sandbox.stub(this.oPersDialog, "_showApplySaveChangesErrorMessage").returns(Promise.resolve());
		this.sandbox.stub(this.oPersDialog, "_showTransportErrorMessage");
		this.sandbox.stub(this.oPersDialog, "_closeDialog");

		return this.oPersDialog._confirmTransportAllChanges().then(function() {
			sinon.assert.called(this.oPersDialog._showApplySaveChangesErrorMessage);
			sinon.assert.notCalled(this.oPersDialog._showTransportErrorMessage);
			sinon.assert.notCalled(this.oPersDialog._getAllLocalChanges);
			sinon.assert.called(this.oPersDialog._closeDialog);
		}.bind(this));
	});

	QUnit.test('_confirmTransportAllChanges should show an info that no changes are applicable for transport, don\'t transport changes and don\'t show general error message', function(assert) {
		this.sandbox.stub(this.oPersDialog, "_getChangeDataFromDialog").returns([]);
		this.sandbox.stub(this.oPersDialog, "_getAllLocalChanges").returns([]);
		this.sandbox.stub(this.oPersDialog, "_showTransportInapplicableMessage");
		this.sandbox.stub(this.oPersDialog, "_transportAllLocalChanges");
		this.sandbox.stub(this.oPersDialog, "_showTransportErrorMessage");
		this.sandbox.stub(this.oPersDialog, "_closeDialog");

		return this.oPersDialog._confirmTransportAllChanges().then(function() {
			sinon.assert.called(this.oPersDialog._showTransportInapplicableMessage);
			sinon.assert.notCalled(this.oPersDialog._showTransportErrorMessage);
			sinon.assert.notCalled(this.oPersDialog._transportAllLocalChanges);
			sinon.assert.called(this.oPersDialog._closeDialog);
		}.bind(this));
	});

	QUnit.test('_confirmTransportAllChanges should not transport anything, if the transport selection dialog resolves with nothing in contrast to a transport information object', function(assert) {
		this.sandbox.stub(this.oPersDialog, "_getChangeDataFromDialog").returns([]);
		this.sandbox.stub(this.oPersDialog, "_getAllLocalChanges").returns([{}]);
		this.sandbox.stub(this.oPersDialog, "_showTransportInapplicableMessage");
		this.sandbox.stub(this.oPersDialog, "_transportAllLocalChanges");
		this.sandbox.stub(this.oPersDialog, "_showTransportErrorMessage");
		this.sandbox.stub(this.oPersDialog, "_closeDialog");
		this.sandbox.stub(this.oPersDialog, "_openTransportSelection").returns(Promise.resolve());

		return this.oPersDialog._confirmTransportAllChanges().then(function() {
			sinon.assert.notCalled(this.oPersDialog._showTransportInapplicableMessage);
			sinon.assert.notCalled(this.oPersDialog._showTransportErrorMessage);
			sinon.assert.notCalled(this.oPersDialog._transportAllLocalChanges);
			sinon.assert.called(this.oPersDialog._openTransportSelection);
			sinon.assert.called(this.oPersDialog._closeDialog);
		}.bind(this));
		});

	QUnit.test('_confirmTransportAllChanges should transport changes, if the transport selection dialog resolves with a proper transport information object', function(assert) {
		this.sandbox.stub(this.oPersDialog, "_getChangeDataFromDialog").returns([]);
		this.sandbox.stub(this.oPersDialog, "_getAllLocalChanges").returns([{}]);
		this.sandbox.stub(this.oPersDialog, "_showTransportInapplicableMessage");
		this.sandbox.stub(this.oPersDialog, "_transportAllLocalChanges");
		this.sandbox.stub(this.oPersDialog, "_showTransportErrorMessage");
		this.sandbox.stub(this.oPersDialog, "_closeDialog");
		this.sandbox.stub(this.oPersDialog, "_openTransportSelection").returns(Promise.resolve({
			transport: 'SomeTransport',
			packageName: 'AnythingButTMP'
		}));

		return this.oPersDialog._confirmTransportAllChanges().then(function() {
			sinon.assert.notCalled(this.oPersDialog._showTransportInapplicableMessage);
			sinon.assert.notCalled(this.oPersDialog._showTransportErrorMessage);
			sinon.assert.called(this.oPersDialog._transportAllLocalChanges);
			sinon.assert.called(this.oPersDialog._openTransportSelection);
			sinon.assert.called(this.oPersDialog._closeDialog);
		}.bind(this));
	});

	QUnit.test("_convertToChangeTransportData should return list of transport data from changes", function(assert) {
		//Arrange
		var aLocalChanges = [];
		var oChange1 = {
			getNamespace: function() {
				return "myNamespace1";
			},
			getId: function() {
				return "myId1";
			},
			getDefinition: function() {
				return {
					fileType: "myFileType1"
				};
			}
		};

		var oChange2 = {
			getNamespace: function() {
				return "myNamespace2";
			},
			getId: function() {
				return "myId2";
			},
			getDefinition: function() {
				return {
					fileType: "myFileType2"
				};
			}
		};
		aLocalChanges.push(oChange1);
		aLocalChanges.push(oChange2);

		//Act
		var aResult = this.oPersDialog._convertToChangeTransportData(aLocalChanges);

		//Assert
		assert.equal(aResult.length, 2);
		assert.equal(aResult[0].namespace, "myNamespace1");
		assert.equal(aResult[0].fileName, "myId1");
		assert.equal(aResult[0].fileType, "myFileType1");
		assert.equal(aResult[1].namespace, "myNamespace2");
		assert.equal(aResult[1].fileName, "myId2");
		assert.equal(aResult[1].fileType, "myFileType2");
	});

	QUnit.test("_determineRelevantBindingPathsOf detects bound text", function(assert) {
		//Arrange
		var smartForm1 = new sap.ui.comp.smartform.SmartForm("form1");
		this.controlsToDestroy.push(smartForm1);
		var smartGroup1 = new sap.ui.comp.smartform.Group("group1");
		var smartField1 = new sap.ui.comp.smartform.GroupElement("field1");
		smartField1.getBinding = function(sProperty) {
			return {
				getPath: function() {
					return "smartField1" + "_" + sProperty;
				}
			};
		};
		smartField1.getMetadata().getAllProperties = function() {
			return { 'text': {} };
		};

		smartField1.setLabel("FieldLabel1");
		smartGroup1.setLabel("GroupLabel1");
		smartGroup1.addAggregation("groupElements", smartField1);

		smartForm1.setTitle("FormTitle1");
		smartForm1.addAggregation("groups", smartGroup1);

		//Act
		var bindingInfo1 = this.oPersDialog._determineRelevantBindingPathsOf(smartForm1);

		//Assert
		assert.equal(bindingInfo1.length, 1);
		//equal(bindingInfo1[0].path, "smartField1_text");
		assert.equal(bindingInfo1[0].path, "smartField1_text");
	});

	QUnit.test("_determineRelevantBindingPathsOf detects bound value", function(assert) {
		//Arrange
		var smartForm2 = new sap.ui.comp.smartform.SmartForm("form2");
		this.controlsToDestroy.push(smartForm2);
		var smartGroup2 = new sap.ui.comp.smartform.Group("group2");
		var smartField2 = new sap.ui.comp.smartform.GroupElement("field2");
		smartField2.getBinding = function(sProperty) {
			return {
				getPath: function() {
					return "smartField2" + "_" + sProperty;
				}
			};
		};
		smartField2.getMetadata().getAllProperties = function() {
			return { 'value': {} };
		};

		smartField2.setLabel("FieldLabel2");
		smartGroup2.setLabel("GroupLabel2");
		smartGroup2.addAggregation("groupElements", smartField2);

		smartForm2.setTitle("FormTitle2");
		smartForm2.addAggregation("groups", smartGroup2);

		//Act
		var bindingInfo2 = this.oPersDialog._determineRelevantBindingPathsOf(smartForm2);

		//Assert
		assert.equal(bindingInfo2.length, 1);
		//equal(bindingInfo2[0].path, "smartField2_value");
		assert.equal(bindingInfo2[0].path, "smartField2_value");
	});

	QUnit.test("_determineRelevantBindingPathsOf detects bound 'selected'", function(assert) {
		//Arrange
		var smartForm3 = new sap.ui.comp.smartform.SmartForm("form3");
		this.controlsToDestroy.push(smartForm3);
		var smartGroup3 = new sap.ui.comp.smartform.Group("group3");
		var smartField3 = new sap.ui.comp.smartform.GroupElement("field3");
		smartField3.getBinding = function(sProperty) {
			return {
				getPath: function() {
					return "smartField3" + "_" + sProperty;
				}
			};
		};
		smartField3.getMetadata().getAllProperties = function() {
			return { 'selected': {} };
		};

		smartField3.setLabel("FieldLabel3");
		smartGroup3.setLabel("GroupLabel3");
		smartGroup3.addAggregation("groupElements", smartField3);

		smartForm3.setTitle("FormTitle3");
		smartForm3.addAggregation("groups", smartGroup3);

		//Act
		var bindingInfo3 = this.oPersDialog._determineRelevantBindingPathsOf(smartForm3);

		//Assert
		assert.equal(bindingInfo3.length, 1);
		//equal(bindingInfo3[0].path, "smartField3_selected");
		assert.equal(bindingInfo3[0].path, "smartField3_selected");
	});

	QUnit.test("_determineRelevantBindingPathsOf detects bound selectedKey", function(assert) {
		//Arrange
		var smartForm4 = new sap.ui.comp.smartform.SmartForm("form4");
		this.controlsToDestroy.push(smartForm4);
		var smartGroup4 = new sap.ui.comp.smartform.Group("group4");
		var smartField4 = new sap.ui.comp.smartform.GroupElement("field4");
		smartField4.getBinding = function(sProperty) {
			return {
				getPath: function() {
					return "smartField4" + "_" + sProperty;
				}
			};
		};
		smartField4.getMetadata().getAllProperties = function() {
			return { 'selectedKey': {} };
		};

		smartField4.setLabel("FieldLabel4");
		smartGroup4.setLabel("GroupLabel4");
		smartGroup4.addAggregation("groupElements", smartField4);

		smartForm4.setTitle("FormTitle4");
		smartForm4.addAggregation("groups", smartGroup4);

		//Act
		var bindingInfo4 = this.oPersDialog._determineRelevantBindingPathsOf(smartForm4);

		//Assert
		assert.equal(bindingInfo4.length, 1);
		//equal(bindingInfo4[0].path, "smartField4_selectedKey");
		assert.equal(bindingInfo4[0].path, "smartField4_selectedKey");
	});

	QUnit.test("_convertToChangeArray shall convert an object map of changes to an array of changes", function(assert) {
		//Arrange
		var oChanges = {
			"001": {
				id: "myId001"
			},
			"002": {
				id: "myId002"
			}
		};

		//Act
		var aResult = this.oPersDialog._convertToChangeArray(oChanges);

		//Assert
		assert.equal(aResult.length, 2);
		assert.equal(aResult[0].id, "myId001");
		assert.equal(aResult[1].id, "myId002");
	});

	QUnit.test("_transportAllLocalChanges shall resolve correctly and call all it's functions", function(assert) {
		//Arrange
		var oChanges = {
			"001": {
				id: "myId001",
				getPackage: function() {
					return '$TMP';
				},
				getDefinition: function() {
					return {};
				},
				setResponse: function(oResponse) {

				}
			},
			"002": {
				id: "myId002",
				getPackage: function() {
					return '$TMP';
				},
				getDefinition: function() {
					return {};
				},
				setResponse: function(oResponse) {

				}
			}
		};

		var aChanges = [
			{
				id: "myId001",
				getPackage: function() {
					return '$TMP';
				},
				getDefinition: function() {
					return {};
				},
				setResponse: function(oResponse) {

				}
			}, {
				id: "myId002",
				getPackage: function() {
					return '$TMP';
				},
				getDefinition: function() {
					return {};
				},
				setResponse: function(oResponse) {

				}
			}
		];
		var aTransportData = [];
		var oChange1 = {
			getNamespace: function() {
				return "myNamespace1";
			},
			getId: function() {
				return "myId1";
			},
			getDefinition: function() {
				return {
					fileType: "myFileType1"
				};
			},
			getPackage: function() {
				return '$TMP';
			},
			setResponse: function(oResponse) {

			}
		};

		var oChange2 = {
			getNamespace: function() {
				return "myNamespace2";
			},
			getId: function() {
				return "myId2";
			},
			getDefinition: function() {
				return {
					fileType: "myFileType2"
				};
			},
			getPackage: function() {
				return '$TMP';
			},
			setResponse: function(oResponse) {

			}
		};
		aTransportData.push(oChange1);
		aTransportData.push(oChange2);
		this.oPersDialog._oSmartForm = {
			name: "mySmartForm"
		};
		var fGetComponentChangesMock = {
			getComponentChanges: function() {
				return Promise.resolve(oChanges);
			}
		};
		this.sandbox.stub(this.oPersDialog, "_getFlexController").returns(fGetComponentChangesMock);
		var oConvertChangeArrayStub = this.sandbox.stub(this.oPersDialog, "_convertToChangeArray").returns(aChanges);
		var oFilterChangesForSmartFormStub = this.sandbox.stub(this.oPersDialog, "_filterChangesForSmartForm").returns(aChanges);
		var oConvertToChangeTransportDataStub = this.sandbox.stub(this.oPersDialog, "_convertToChangeTransportData").returns(aTransportData);
		var oTransportsStub = this.sandbox.stub(sap.ui.fl.transport.Transports.prototype, "makeChangesTransportable").returns(Promise.resolve());

		var oTransportInfo = {transport: "myTransport"};

		//Act
		return this.oPersDialog._transportAllLocalChanges(oTransportInfo).then(function() {
			//Assert
			assert.ok(oConvertChangeArrayStub.calledOnce);
			assert.ok(oFilterChangesForSmartFormStub.calledOnce);
			assert.ok(oConvertToChangeTransportDataStub.calledOnce);
			assert.ok(oTransportsStub.calledOnce);
		});
	});
}());
