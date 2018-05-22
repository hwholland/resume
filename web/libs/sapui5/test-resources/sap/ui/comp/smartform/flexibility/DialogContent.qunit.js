(function () {

	var oData;
	QUnit.module("sap.ui.comp.smartform.flexibility.DialogContent", {
		beforeEach: function () {

			this.sViewId = "mainView--SubView";
			this.oDialogContent = new sap.ui.comp.smartform.flexibility.DialogContent();
			oData = {id : this.sViewId + "_" + "myForm",
				children: [
					{id: "0", type: "group", isVisible: true, children: [
						{id: "0.0"},
						{id: "0.1", children: [
							{id: "0.1.0", children: [
								{id: "0.1.0.0", type: "field", bindingPaths : [ { path: "bindingPath1" }]}
							]}
						]}
					]},
					{id: "1", type: "group", isVisible: true, children: [
						{id: "1.0", type: "field", bindingPaths : [ { path: "bindingPath2" }]},
						{id: "1.1", type: "field", bindingPaths : [ { path: "entityType/bindingPath3" }], isBoundToODataService: true, isVisible: false }
					]},
					{id: "2", type: "group", isVisible: true, children: [
						{id: "2.0", children: [
							{id: "2.0.0", children: [
								{id: "2.0.0.0", type: "field", bindingPaths	 : [ { path: "bindingPath4" }]}
							]}
						]},
						{id: "2.1"}
					]},
					{id: "3", type: "group", isVisible: true, children: [
						{id: "3.0", type: "field", bindingPaths : [ { path: "bindingPath4" }]},
						{id: "3.1", type: "field", bindingPaths : [ { path: "bindingPath5" }], isVisible: false },
						{id: "3.2", type: "field", bindingPaths : [ { path: "entityType/complexType/bindingPath6" }], isBoundToODataService: true, isVisible: false },
						{id: "3.3", type: "field"}
					]}
				]};

		},
		afterEach: function () {
			if (this.oDialogContent) {
				this.oDialogContent.exit();
			}
			this.oDialogContent.destroy();
			this.oDialogContent = undefined;
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oDialogContent);
	});


	QUnit.test("Move up shall do nothing if there is no node having the specified id", function (assert) {
		var sDataClone;
		sDataClone = JSON.stringify(oData);

		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "i_do_not_exist");
		assert.equal(sDataClone, JSON.stringify(oData), "oData shall not change (move up)");
	});

	QUnit.test("Move down shall do nothing if there is no node having the specified id", function (assert) {
		var sDataClone;
		sDataClone = JSON.stringify(oData);

		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "i_do_not_exist");
		assert.equal(sDataClone, JSON.stringify(oData), "oData shall not change (move down)");
	});

	QUnit.test("Move top shall do nothing if there is no node having the specified id", function (assert) {
		var sDataClone;
		sDataClone = JSON.stringify(oData);

		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "i_do_not_exist");
		assert.equal(sDataClone, JSON.stringify(oData), "oData shall not change (move top)");
	});

	QUnit.test("Move bottom shall do nothing if there is no node having the specified id", function (assert) {
		var sDataClone;
		sDataClone = JSON.stringify(oData);

		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "i_do_not_exist");
		assert.equal(sDataClone, JSON.stringify(oData), "oData shall not change (move bottom)");
	});


	QUnit.test("Shall move down a node from position 0 to 1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "0");
		assert.equal(oData.children[1].id, "0");
		assert.equal(oData.children[1].children[1].id, "0.1");
	});

	QUnit.test("Shall move down a node from position 2.0 to 2.1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "2.0");
		assert.equal(oData.children[2].children[0].id, "2.1");
		assert.equal(oData.children[2].children[1].id, "2.0");
	});

	QUnit.test("Shall move down a node from position 1.0 to 2.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "1.0");
		assert.equal(oData.children[1].children[0].id, "1.1");
		assert.equal(oData.children[2].children[0].id, "1.0");
	});

	QUnit.test("Shall move down a node from position 1.1 to 2.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "1.1");
		assert.equal(oData.children[1].children[0].id, "1.0");
		assert.equal(oData.children[1].children.length, 1);
		assert.equal(oData.children[2].children.length, 3);
		assert.equal(oData.children[2].children[0].id, "1.1");
		assert.equal(oData.children[2].children[1].id, "2.0");
		assert.equal(oData.children[2].children[2].id, "2.1");
	});

	QUnit.test("Shall move down a node from position 0.1.0.0 to 2.0.0.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "0.1.0.0");
		assert.equal(oData.children[0].children[1].children[0].children.length, 0, "node shall be removed");
		assert.equal(oData.children[2].children[0].children[0].children.length, 2, "node shall be added to new location");
		assert.equal(oData.children[2].children[0].children[0].children[0].id, "0.1.0.0");
		assert.equal(oData.children[2].children[0].children[0].children[1].id, "2.0.0.0");
	});

	QUnit.test("Shall move bottom a node from position 0 to 2", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "0");
		assert.equal(oData.children[3].id, "0");
		assert.equal(oData.children[3].children[1].id, "0.1");
	});

	QUnit.test("Shall move bottom a node from position 2.0 to 2.1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "2.0");
		assert.equal(oData.children[2].children[0].id, "2.1");
		assert.equal(oData.children[2].children[1].id, "2.0");
	});

	QUnit.test("Shall move bottom a node from position 1.0 to 2.2", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "1.0");
		assert.equal(oData.children[1].children[0].id, "1.1");
		assert.equal(oData.children[2].children[2].id, "1.0");
	});

	QUnit.test("Shall move bottom a node from position 1.1 to 2.2", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "1.1");
		assert.equal(oData.children[1].children[0].id, "1.0");
		assert.equal(oData.children[1].children.length, 1);
		assert.equal(oData.children[2].children.length, 3);
		assert.equal(oData.children[2].children[0].id, "2.0");
		assert.equal(oData.children[2].children[1].id, "2.1");
		assert.equal(oData.children[2].children[2].id, "1.1");
	});

	QUnit.test("Shall move bottom a node from position 0.1.0.0 to 2.0.0.1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "0.1.0.0");
		assert.equal(oData.children[0].children[1].children[0].children.length, 0, "node shall be removed");
		assert.equal(oData.children[2].children[0].children[0].children.length, 2, "node shall be added to new location");
		assert.equal(oData.children[2].children[0].children[0].children[0].id, "2.0.0.0");
		assert.equal(oData.children[2].children[0].children[0].children[1].id, "0.1.0.0");
	});

	QUnit.test("Shall do nothing if the node to be moved down is already the last node", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "3");
		assert.equal(oData.children[3].id, "3");
	});

	QUnit.test("Shall do nothing if the node to be moved down is already the last node in the second hierarchy level", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveDown(oData, "3.3");
		assert.equal(oData.children[3].children[3].id, "3.3");
	});

	QUnit.test("Shall do nothing if the node to be moved bottom is already the last node", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "3");
		assert.equal(oData.children[3].id, "3");
	});

	QUnit.test("Shall do nothing if the node to be moved bottom is already the last node in the second hierarchy level", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveBottom(oData, "3.3");
		assert.equal(oData.children[3].children[3].id, "3.3");
	});

	QUnit.test("Shall move up a node from position 1 to 0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "1");
		assert.equal(oData.children[0].id, "1");
		assert.equal(oData.children[0].children[0].id, "1.0");
	});

	QUnit.test("Shall move up a node from position 1.1 to 1.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "1.1");
		assert.equal(oData.children[1].children[0].id, "1.1");
		assert.equal(oData.children[1].children[1].id, "1.0");
	});

	QUnit.test("Shall move up a node from position 0.1 to 0.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "0.1");
		assert.equal(oData.children[0].children[0].id, "0.1");
		assert.equal(oData.children[0].children[1].id, "0.0");
	});

	QUnit.test("Shall move up a node from position 2.0 to 1.1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "2.0");
		assert.equal(oData.children[1].children.length, 3);
		assert.equal(oData.children[2].children.length, 1);
		assert.equal(oData.children[1].children[0].id, "1.0");
		assert.equal(oData.children[1].children[1].id, "1.1");
		assert.equal(oData.children[1].children[2].id, "2.0");
	});

	QUnit.test("Shall move up a node from position 2.0.0.0 to 0.1.0.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "2.0.0.0");
		assert.equal(oData.children[2].children[0].children[0].children.length, 0, "node shall be removed");
		assert.equal(oData.children[0].children[1].children[0].children.length, 2, "node shall be added to new location");
		assert.equal(oData.children[0].children[1].children[0].children[0].id, "0.1.0.0");
		assert.equal(oData.children[0].children[1].children[0].children[1].id, "2.0.0.0");
	});

	QUnit.test("Shall move top a node from position 1 to 0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "1");
		assert.equal(oData.children[0].id, "1");
		assert.equal(oData.children[0].children[0].id, "1.0");
	});

	QUnit.test("Shall move top a node from position 1.1 to 1.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "1.1");
		assert.equal(oData.children[1].children[0].id, "1.1");
		assert.equal(oData.children[1].children[1].id, "1.0");
	});

	QUnit.test("Shall move top a node from position 0.1 to 0.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "0.1");
		assert.equal(oData.children[0].children[0].id, "0.1");
		assert.equal(oData.children[0].children[1].id, "0.0");
	});

	QUnit.test("Shall move top a node from position 2.0 to 1.1", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "2.0");
		assert.equal(oData.children[1].children.length, 3);
		assert.equal(oData.children[2].children.length, 1);
		assert.equal(oData.children[1].children[0].id, "2.0");
		assert.equal(oData.children[1].children[1].id, "1.0");
		assert.equal(oData.children[1].children[2].id, "1.1");
	});

	QUnit.test("Shall move top a node from position 2.0.0.0 to 0.1.0.0", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "2.0.0.0");
		assert.equal(oData.children[2].children[0].children[0].children.length, 0, "node shall be removed");
		assert.equal(oData.children[0].children[1].children[0].children.length, 2, "node shall be added to new location");
		assert.equal(oData.children[0].children[1].children[0].children[0].id, "2.0.0.0");
		assert.equal(oData.children[0].children[1].children[0].children[1].id, "0.1.0.0");
	});

	QUnit.test("Shall do nothing if the node to be moved up is already the first node", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "0");
		assert.equal(oData.children[0].id, "0");
	});

	QUnit.test("Shall do nothing if the node to be moved up is already the first node in the second hierarchy level", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveUp(oData, "0.0");
		assert.equal(oData.children[0].children[0].id, "0.0");
	});


	QUnit.test("Shall do nothing if the node to be moved top is already the first node", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "0");
		assert.equal(oData.children[0].id, "0");
	});

	QUnit.test("Shall do nothing if the node to be moved top is already the first node in the second hierarchy level", function (assert) {
		//Call CUT
		this.oDialogContent._executeMoveTop(oData, "0.0");
		assert.equal(oData.children[0].children[0].id, "0.0");
	});


	QUnit.test("Shall enable the move-down button and the move-up button if the selected node is not the last node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[2].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveDownButtonEnabled, true);
		assert.strictEqual(oData.isMoveUpButtonEnabled, true);
	});

	QUnit.test("Shall disable the move-down button and enable the move-up button if the selected node is already the last node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[3].children[3];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveDownButtonEnabled, false);
		assert.strictEqual(oData.isMoveUpButtonEnabled, true);
	});

	QUnit.test("Shall enable the move-down button and disable the move-up button if the selected node is the very first node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveDownButtonEnabled, true);
		assert.strictEqual(oData.isMoveUpButtonEnabled, false);
	});

	QUnit.test("Shall enable the move-down button if the selected node could be moved to another parent", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[0].children[1].children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveDownButtonEnabled, true);
		assert.strictEqual(oData.isMoveUpButtonEnabled, false);
	});

	QUnit.test("Shall enable the move-up button if the selected node could be moved to another parent", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[2].children[0].children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveDownButtonEnabled, false);
		assert.strictEqual(oData.isMoveUpButtonEnabled, true);
	});

	QUnit.test("Shall enable the move-bottom button and the move-top button if the selected node is not the last node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[2].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveBottomButtonEnabled, true);
		assert.strictEqual(oData.isMoveTopButtonEnabled, true);
	});

	QUnit.test("Shall disable the move-bottom button and enable the move-top button if the selected node is already the last node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[3].children[3];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveBottomButtonEnabled, false);
		assert.strictEqual(oData.isMoveTopButtonEnabled, true);
	});

	QUnit.test("Shall enable the move-bottom button and disable the move-top button if the selected node is the very first node", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveBottomButtonEnabled, true);
		assert.strictEqual(oData.isMoveTopButtonEnabled, false);
	});

	QUnit.test("Shall enable the move-bottom button if the selected node could be moved to another parent", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[0].children[1].children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveBottomButtonEnabled, true);
		assert.strictEqual(oData.isMoveTopButtonEnabled, false);
	});

	QUnit.test("Shall enable the move-top button if the selected node could be moved to another parent", function (assert) {
		this.oDialogContent._getDataFromModel = sinon.stub().returns(oData);
		this.oDialogContent._oSelectedFieldListNodeData = oData.children[2].children[0].children[0].children[0];

		this.oDialogContent._readDataFromModelAndUpdateMoveButtonEnabledState();

		assert.strictEqual(oData.isMoveBottomButtonEnabled, false);
		assert.strictEqual(oData.isMoveTopButtonEnabled, true);
	});


	QUnit.test("_addField shall append a new node if no index is specified", function (assert) {
		var oNewNode = {
			id : "123"
		};

		//Call CUT
		this.oDialogContent._addField(oNewNode, oData.children[0], undefined);

		assert.equal(oData.children[0].children.length, 3, "Node added");
		assert.equal(oData.children[0].children[2], oNewNode);
	});

	QUnit.test("_addField shall append a new node to the specifed index", function (assert) {
		var oNewNode = {
			id : "123"
		};

		//Call CUT
		this.oDialogContent._addField(oNewNode, oData.children[0], 1);

		assert.equal(oData.children[0].children.length, 3, "Node added");
		assert.equal(oData.children[0].children[1], oNewNode);
	});

	QUnit.test("_getExistingField", function (assert) {
		var oExistingField = null;
		// won't be found
		oExistingField = this.oDialogContent._getExistingField({id : "3.4"}, oData);
		assert.ok(!oExistingField);
		// exists
		oExistingField = this.oDialogContent._getExistingField({id : "3.3"}, oData);
		assert.ok(oExistingField);
		oExistingField = this.oDialogContent._getExistingField({isBoundToODataService : true, entityType : "entityType", fieldValue : "bindingPath3"}, oData);
		assert.ok(oExistingField);

		assert.equal(oExistingField.id, "1.1");
		assert.equal(oExistingField.type, "field");
	});

	QUnit.test("_executeAddField shall not append an existing node but set it to visible", function (assert) {
		var oSelectedField = {
			isBoundToODataService: true,
			entitySet: "set of the of the entity type",
			entityType: "entityType",
			entityName: "entityName",
			field: "label of the field",
			name: "bindingPath3",
			path: "bindingPath3"
		};

		var stub = sinon.stub(this.oDialogContent, "_getSelectedFieldFromFieldSelector").returns(oSelectedField);

		// field should be invisible
		var nParentLength = oData.children.length;
		var nFieldLength = oData.children[1].children.length;
		assert.equal(oData.children[1].children[1].id, "1.1");
		assert.equal(oData.children[1].children[1].isVisible, false);

		//Call CUT
		this.oDialogContent._executeAddField(oData);

		// check that the field is now visible and on the right position
		assert.equal(oData.children[3].children.length, 5);
		assert.equal(oData.children[3].children[4].id, "1.1");
		assert.equal(oData.children[3].children[4].isVisible, true);

		stub.restore();
	});

	QUnit.test("_executeAddField shall not append an existing node but set it to visible (complex type)", function (assert) {
		var oSelectedField = {
			isBoundToODataService: true,
			entitySet: "set of the of the entity type",
			entityType: "entityType",
			entityName: "entityName",
			field: "label of the field",
			name: "bindingPath6",
			path: "complexType/bindingPath6"
		};

		var stub = sinon.stub(this.oDialogContent, "_getSelectedFieldFromFieldSelector").returns(oSelectedField);

		// field should be invisible
		var nParentLength = oData.children.length;
		var nFieldLength = oData.children[3].children.length;
		assert.equal(oData.children[3].children[2].id, "3.2");
		assert.equal(oData.children[3].children[2].isVisible, false);

		//Call CUT
		this.oDialogContent._executeAddField(oData);

		// check that the field is now visible and on the right position
		assert.equal(oData.children[3].children.length, 4);
		assert.equal(oData.children[3].children[3].isVisible, true);
		assert.equal(oData.children[3].children[3].id, "3.2");

		stub.restore();
	});

	QUnit.test("_executeAddField shall display an existing and move it the right position", function (assert) {
		var oSelectedField = {
			isBoundToODataService: true,
			entitySet: "set of the of the entity type",
			entityType: "entityType",
			entityName: "entityName",
			field: "label of the field",
			name: "bindingPath3",
			path: "bindingPath3"
		};
		var oNewPosition =  {
			parent : oData.children[0],
			index : 1
		};

		var oSelectedFieldStub = sinon.stub(this.oDialogContent, "_getSelectedFieldFromFieldSelector").returns(oSelectedField);
		var oNewPositionStub = sinon.stub(this.oDialogContent, "_getParentAndIndexNodeForNewField"). returns(oNewPosition);


		// field should be invisible
		var nParentLength = oData.children.length;
		var nFieldLength = oData.children[1].children.length;
		assert.equal(oData.children[1].children[1].id, "1.1");
		assert.equal(oData.children[1].children[1].isVisible, false);

		//Call CUT
		this.oDialogContent._executeAddField(oData);

		// check that the field is now visible and on the right position
		assert.equal(oData.children[1].children.length, 1);
		assert.equal(oData.children[0].children[1].isVisible, true);
		assert.equal(oData.children[0].children[1].id, "1.1");

		oNewPositionStub.restore();
		oSelectedFieldStub.restore();
	});

	QUnit.test("Buttons shall have tooltips", function (assert) {
		// PREPARE
		this.stub(sap.ui.getCore(), 'getLibraryResourceBundle').returns({
			getText: sinon.stub().returns('MyTooltip')
		});
		this.oDialogContent.destroy();

		// CUT
		this.oDialogContent = new sap.ui.comp.smartform.flexibility.DialogContent();

		// ASSERTIONS
		assert.equal(this.oDialogContent._oBtnMoveDown.getTooltip(),"MyTooltip","Move down button shall have a tooltip");
		assert.equal(this.oDialogContent._oBtnMoveUp.getTooltip(),"MyTooltip","Move up button shall have tooltip");
		assert.equal(this.oDialogContent._oBtnAddField.getTooltip(),"MyTooltip","Add field button shall have tooltip");
	});

	QUnit.test("_getNewNodeFromSelectedODataField shall return a new node", function (assert) {
		var oNewNode;
		var sEntityName = "entityName";
		var sEntityType = "entityType";
		var sEntitySet = "entitySet";
		var sField = "field";
		var sPath = "path";
		this.oDialogContent.setViewId(this.sViewId);

		// CUT
		oNewNode = this.oDialogContent._getNewNodeFromSelectedODataField(oData, {isBoundToODataService:true, entityName:sEntityName, entitySet:sEntitySet, entityType:sEntityType, field: sField, path:sPath});

		// ASSERTIONS
		assert.ok(oNewNode, "Shall return new node");
		assert.equal(oNewNode.id, oData.id + "_" + sEntityType + "_" + sPath);
		assert.equal(oNewNode.entitySet, sEntitySet);
		assert.equal(oNewNode.entityType, sEntityType);
		assert.equal(oNewNode.label, sField);
		assert.equal(oNewNode.valueProperty, "value");
		assert.equal(oNewNode.fieldValue, sPath);
		assert.deepEqual(oNewNode.bindingPaths[0], {"path":"entityName/path"});
		assert.equal(oNewNode.jsType, "sap.ui.comp.smartfield.SmartField");
		assert.equal(oNewNode.isVisible, true);
		assert.equal(oNewNode.type, "field");

		// CUT
		oNewNode = this.oDialogContent._getNewNodeFromSelectedODataField(oData, {isBoundToODataService:false, id: 'sv98', field: sField, path:sPath});

		// ASSERTIONS
		assert.ok(oNewNode, "Shall return new node");
		assert.equal(oNewNode.id, 'sv98');
		assert.equal(oNewNode.label, sField);
		assert.equal(oNewNode.valueProperty, "value");
		assert.equal(oNewNode.fieldValue, sPath);
		assert.deepEqual(oNewNode.bindingPaths[0], {"path":""});
		assert.equal(oNewNode.jsType, "sap.ui.comp.smartfield.SmartField");
		assert.equal(oNewNode.isVisible, true);
		assert.equal(oNewNode.type, "field");
	});

	QUnit.test("_getNewNodeFromSelectedODataField shall return a new node (complexType binding)", function (assert) {
		var oNewNode;
		var sEntityName = "entityName";
		var sEntityType = "entityType";
		var sEntitySet = "entitySet";
		var sField = "field";
		var sPath = "path";
		this.oDialogContent.setViewId(this.sViewId);

		// CUT
		oNewNode = this.oDialogContent._getNewNodeFromSelectedODataField(oData, {isBoundToODataService:true, entityName:sEntityName, entitySet:sEntitySet, entityType:sEntityType, field: sField, path:sPath});

		assert.ok(oNewNode, "Shall return new node");

		assert.equal(oNewNode.id, oData.id + "_" + sEntityType + "_" + sPath);
		assert.equal(oNewNode.entitySet, sEntitySet);
		assert.equal(oNewNode.entityType, sEntityType);
		assert.equal(oNewNode.label, sField);
		assert.equal(oNewNode.valueProperty, "value");
		assert.equal(oNewNode.fieldValue, sPath);
		assert.deepEqual(oNewNode.bindingPaths[0], {"path":"entityName/path"});
		assert.equal(oNewNode.jsType, "sap.ui.comp.smartfield.SmartField");
		assert.equal(oNewNode.isVisible, true);
		assert.equal(oNewNode.type, "field");
	});


	QUnit.test("_getParentAndIndexNodeForNewField shall append the node to the selected group", function (assert) {
		var oPosition;
		this.stub(this.oDialogContent, "_getIdOfSelectedFieldListNode").returns("1");

		//Call CUT
		oPosition = this.oDialogContent._getParentAndIndexNodeForNewField(oData);

		assert.equal(oPosition.parent, oData.children[1]);
		assert.equal(oPosition.index, 2);
	});


	QUnit.test("_getParentAndIndexNodeForNewField shall append the node below the selected field", function (assert) {
		var oPosition;
		this.stub(this.oDialogContent, "_getIdOfSelectedFieldListNode").returns("1.0");

		//Call CUT
		oPosition = this.oDialogContent._getParentAndIndexNodeForNewField(oData);

		assert.equal(oPosition.parent, oData.children[1]);
		assert.equal(oPosition.index, 1);
	});

	QUnit.test("_getParentAndIndexNodeForNewField shall append the node to the very last group if nothing is selected", function (assert) {
		var oPosition;
		this.stub(this.oDialogContent, "_getIdOfSelectedFieldListNode").returns(undefined);

		//Call CUT
		oPosition = this.oDialogContent._getParentAndIndexNodeForNewField(oData);

		assert.equal(oPosition.parent, oData.children[3]);
		assert.equal(oPosition.index, 4);
	});

	QUnit.test("_executeAddGroup shall generate a group id that includes the view ID", function (assert) {
		this.stub(this.oDialogContent, "_changeSelection");
		this.stub(jQuery.sap,"uid").returns('testid1');
		this.oDialogContent.setViewId(this.sViewId);
		var oData = { children: [] };

		//Call CUT
		this.oDialogContent._executeAddGroup(oData);

		assert.equal(oData.children.length,1);
		assert.equal(oData.children[0].id,"mainView--SubViewtestid1");
	});
	QUnit.test("writes the selected field into the addFieldButtonDependencies model", function (assert) {
		var oExpectedObject = {};
		var oMockedSelection = {mParameters: oExpectedObject};
		this.oDialogContent.setModel(new sap.ui.model.json.JSONModel({children: {}}));
		this.oDialogContent._writeSelectedFieldToModel(oMockedSelection);

		assert.equal(oExpectedObject, this.oDialogContent._oAddFieldButtonDependenciesModel.getData().selectedField, "the new selection should be written into the model");
	});


	QUnit.test("tells add field is disabled if there is no selected field and no group", function (assert) {
		var oMockedSelection = {};

		var aMockedGroups = [];

		var bIsAddFieldEnabled = this.oDialogContent._isAddFieldEnabled(oMockedSelection, aMockedGroups);

		assert.equal(false, bIsAddFieldEnabled);
	});


	QUnit.test("tells add field is disabled if there is no selected field", function (assert) {
		var oMockedSelection = {};

		var aMockedGroups = [
			{isVisible: true}
		];

		var bIsAddFieldEnabled = this.oDialogContent._isAddFieldEnabled(oMockedSelection, aMockedGroups);

		assert.equal(false, bIsAddFieldEnabled);
	});

	QUnit.test("tells add field is disabled if there is no group", function (assert) {
		var oMockedSelection = {
			name: "theField"
		};

		var aMockedGroups = [];

		var bIsAddFieldEnabled = this.oDialogContent._isAddFieldEnabled(oMockedSelection, aMockedGroups);

		assert.equal(false, bIsAddFieldEnabled);
	});

	QUnit.test("tells add field is disabled if there is no visible group", function (assert) {
		var oMockedSelection = {
			name: "theField"
		};

		var aMockedGroups = [
			{isVisible: false},
			{isVisible: false}
		];

		var bIsAddFieldEnabled = this.oDialogContent._isAddFieldEnabled(oMockedSelection, aMockedGroups);

		assert.equal(false, bIsAddFieldEnabled);
	});

	QUnit.test("tells add field is enabled if there is a selected field and a visible group", function (assert) {
		var oMockedSelection = {
			name: "theField"
		};

		var aMockedGroups = [
			{isVisible: false},
			{isVisible: true},
			{isVisible: false}
		];

		var bIsAddFieldEnabled = this.oDialogContent._isAddFieldEnabled(oMockedSelection, aMockedGroups);

		assert.equal(true, bIsAddFieldEnabled);
	});

	QUnit.test("triggers a change of the addFieldButtonDependencies model", function (assert) {
		// preparation
		this.oDialogContent.setModel(new sap.ui.model.json.JSONModel({children: {}}));
		this.oDialogContent.setModel(new sap.ui.model.json.JSONModel(), 'addFieldButtonDependencies');
		// spy start
		var oSetModelSpy = sinon.spy(this.oDialogContent, "setModel");

		this.oDialogContent._triggerAddFieldButtonDependenciesBindings();

		assert.ok(oSetModelSpy.withArgs(sinon.match.any, 'addFieldButtonDependencies').calledTwice, "setModel should be called two times for addFieldButtonDependencies");
		assert.ok(oSetModelSpy.firstCall.calledWith(this.oDialogContent._emptyModel, 'addFieldButtonDependencies'), "should have been called with an empty model first for the 'addFieldButtonDependencies' model");
		assert.ok(oSetModelSpy.secondCall.calledWith(this.oDialogContent._oAddFieldButtonDependenciesModel, 'addFieldButtonDependencies'), "should have been called with the dependencies model first for the 'addFieldButtonDependencies' model");
	});

	QUnit.test("updates the groups within the addFieldButtonDependencies model if not set", function (assert) {
		// preparation
		var oChildrenObject = {};
		this.oDialogContent.setModel(new sap.ui.model.json.JSONModel({children: oChildrenObject}));
		// spy start
		var oSetPropertySpy = sinon.spy(this.oDialogContent._oAddFieldButtonDependenciesModel, "setProperty");

		this.oDialogContent._triggerAddFieldButtonDependenciesBindings();

		assert.ok(oSetPropertySpy.withArgs("groups", oChildrenObject).calledOnce, "should set groups of the dependencies model with the groups of the dialogContent model data");
	});

	QUnit.test("does not update the groups within the addFieldButtonDependencies model if it is already set", function (assert) {
		// preparation
		var oChildrenObject = {};
		this.oDialogContent.setModel(new sap.ui.model.json.JSONModel({children: oChildrenObject}));
		var oAddFieldButtonDependencyModel = new sap.ui.model.json.JSONModel({groups: {}});
		this.oDialogContent.setModel(oAddFieldButtonDependencyModel, 'addFieldButtonDependencies');
		// spy start
		var oSetPropertySpy = sinon.spy(oAddFieldButtonDependencyModel, "setProperty");

		this.oDialogContent._triggerAddFieldButtonDependenciesBindings();

		assert.equal(oSetPropertySpy.withArgs("groups", sinon.match.any).callCount, 0, "should not set groups of the dependencies model");
	});

	QUnit.test("finds the last group in the data of the oData service", function (assert) {
		var oFirstGroup = {
			isVisible: true,
			children: []
		};
		var oSecondGroup = {
			isVisible: true,
			children: []
		};
		var oThirdGroup = {
			isVisible: true,
			children: []
		};

		var oData = {
			children: [
				oFirstGroup,
				oSecondGroup,
				oThirdGroup
			]
		};

		var oBottomGroup = this.oDialogContent._getBottomGroup(oData);

		assert.equal(oThirdGroup, oBottomGroup, "the third group should be the bottom group");
	});

	QUnit.test("finds the last visible group in the data of the oData service", function (assert) {
		var oFirstGroup = {
			isVisible: false,
			children: []
		};
		var oSecondGroup = {
			isVisible: true,
			children: []
		};
		var oThirdGroup = {
			isVisible: false,
			children: []
		};

		var oData = {
			children: [
				oFirstGroup,
				oSecondGroup,
				oThirdGroup
			]
		};

		var oBottomGroup = this.oDialogContent._getBottomGroup(oData);

		assert.equal(oBottomGroup ,oSecondGroup, "the second group should be the bottom group");
	});
}());
