/* --- Helpers --- */

function _containsCoordinate(coordinate, arrayToCheck) {
  for (var i = 0; i < arrayToCheck.length; i++) {
    if (arrayToCheck[i].x === coordinate.x && arrayToCheck[i].y === coordinate.y) {
      return true;
    }
  }
  return false;
}

/* --- Tests --- */

QUnit.module("Basic Tests", {
  beforeEach: function () {

    this.oTestLabel = new sap.suite.ui.commons.ProcessFlowConnectionLabel({
      id: "myButtonId1To11",
      text: "first helloworld",
      enabled: true,
      icon: "sap-icon://message-success",
    });

    this.oProcessFlow = new sap.suite.ui.commons.ProcessFlow("processFlow1");
    this.oProcessFlow.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },

  afterEach: function () {
    if (this.oProcessFlow) {
      this.oProcessFlow.destroy();
    }
    if (this.oTestLabel) {
      this.oTestLabel.destroy();
    }
  }
});

QUnit.test("Check if connections map is containing correct items inkl. Label", function (assert) {

  //Arrange
  // Calculated Matrix:
  // |     | 000 | 001 | 002 | 003 | 004 | 005 | 006 | 007 | 008 | 009 | 010 |
  // | 000 |     | n1  |  c  |  c  |  c  |  c  |  c  | n12 |  c  | n5  |     |
  // | 001 |     |     |  c  |  c  |  c  | n11 |     |     |     |     |     |
  // | 002 |     |     |  c  | n10 |     |     |     |     |     |     |     |
  //---------------------------------------------------------------------------
  // ConnectionParts (coordinates x/y) containing the label: 2/0, 2/1, 3/1, 4/1
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "1", laneId: "id0", title: "Sales Order 150", children: [10, { nodeId: 11, connectionLabel: this.oTestLabel }, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "10", laneId: "id1", title: "Outbound Delivery 42417000", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "11", laneId: "id2", title: "Outbound Delivery 42417001", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "12", laneId: "id3", title: "Outbound Delivery 42417002", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "5", laneId: "id4", title: "Outbound Delivery 42417003", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id0", position: 0 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id1", position: 1 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id2", position: 2 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id3", position: 3 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id4", position: 4 }));
  var calcMatrix = this.oProcessFlow._getOrCreateProcessFlow();

  //Act
  var mConnections = this.oProcessFlow._getConnectionsMap(calcMatrix);

  //Assert
  var aExpectedConnectionParts = [
                                   { x: 2, y: 0 },
                                   { x: 2, y: 1 },
                                   { x: 3, y: 1 },
                                   { x: 4, y: 1 }
  ];
  for (var i = 0; i < mConnections.length; i++) {
    var currentConnectionMapEntry = mConnections[i];
    if (currentConnectionMapEntry.sourceNode.getNodeId() === "1" && currentConnectionMapEntry.targetNode.getNodeId() === "11") {
      assert.equal(currentConnectionMapEntry.label.getText(), "first helloworld", "Label Text as expected.");
      assert.equal(currentConnectionMapEntry.label.getIcon(), "sap-icon://message-success", "Label Icon as expected");
      assert.equal(currentConnectionMapEntry.label.getId(), "myButtonId1To11", "Label Id as expected.");
      for (var j = 0; j < currentConnectionMapEntry.connectionParts.length; j++) {
        assert.ok(_containsCoordinate(currentConnectionMapEntry.connectionParts[j], aExpectedConnectionParts), "Coordinate as expected.");
      }
    }
  }
});

QUnit.test("Check if setting the width is avoided by external applications", function (assert) {
  //Arrange

  //Act
  this.oTestLabel.setWidth("9rem");

  //Assert
  assert.equal(this.oTestLabel.getWidth(), "", "Setting of width not possible.");
  assert.equal(this.oTestLabel.getProperty("width"), "", "Setting of width not possible (getProperty).");
});

QUnit.test("Check if setting the iconfirst-Property is avoided by external applications", function (assert) {
  //Arrange

  //Act
  this.oTestLabel.setIconFirst(false);

  //Assert
  assert.equal(this.oTestLabel.getIconFirst(), true, "Setting of iconfirst not possible.");
});

QUnit.test("Check label click results", function (assert) {
  //Arrange
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "1", laneId: "id0", title: "Sales Order 150", children: [10, { nodeId: 11, connectionLabel: this.oTestLabel }, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "10", laneId: "id1", title: "Outbound Delivery 42417000", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "11", laneId: "id2", title: "Outbound Delivery 42417001", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "12", laneId: "id3", title: "Outbound Delivery 42417002", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
  this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "5", laneId: "id4", title: "Outbound Delivery 42417003", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id0", position: 0 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id1", position: 1 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id2", position: 2 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id3", position: 3 }));
  this.oProcessFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({ laneId: "id4", position: 4 }));

  //Assert
  this.oProcessFlow.fireLabelPress = function (oEvent) {
    assert.equal(oEvent.connections.length, 1, "One connection was related to label");
    assert.equal(oEvent.selectedLabel.getId(), "myButtonId1To11");
  };

  //Act
  this.oProcessFlow._getOrCreateProcessFlow();
  this.oProcessFlow._getOrCreateLaneMap();
  this.oProcessFlow._getConnectionsMap();
  var oEvent = { title: "testEvent", getSource: function () { return this.oTestLabel; }.bind(this), isPropagationStopped : function () { return true; } }; //Simulate event args.
  this.oProcessFlow._handleLabelClick(oEvent);
});

QUnit.module("Event Handling", {
  beforeEach: function () {

    this.oTestLabel = new sap.suite.ui.commons.ProcessFlowConnectionLabel({
      id: "myButtonId1To11",
      text: "first helloworld",
      enabled: true,
      icon: "sap-icon://message-success",
    });
    this.oTestLabel.placeAt("qunit-fixture");

    this.oProcessFlow = new sap.suite.ui.commons.ProcessFlow("processFlow1");
    this.oProcessFlow.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },

  afterEach: function () {
    if (this.oProcessFlow) {
      this.oProcessFlow.destroy();
    }
    if (this.oTestLabel) {
      this.oTestLabel.destroy();
    }
  }
});

QUnit.test("Test if mouse down adds the active css class inside the label", function (assert) {
  //Arrange

  //Act
  qutils.triggerMouseEvent(this.oTestLabel.getId(), "mousedown");
  var aActiveElements = this.oTestLabel.$().find(".sapSuiteUiCommonsProcessFlowLabelActive");

  //Assert
  assert.ok(aActiveElements.length > 0,  "Active css class is added at mousedown");
});

QUnit.test("Test if mouse up removes the active css class inside the label", function (assert) {
  //Arrange

  //Act
  qutils.triggerMouseEvent(this.oTestLabel.getId(), "mousedown");
  qutils.triggerMouseEvent(this.oTestLabel.getId(), "mouseup");
  var aActiveElements = this.oTestLabel.$().find(".sapSuiteUiCommonsProcessFlowLabelActive");

  //Assert
  assert.equal(aActiveElements.length, 0, "Active css class is removed at mouseup");
});

QUnit.test("Test if mouse leave removes the active css class inside the label", function (assert) {
  //Arrange

  //Act
  qutils.triggerMouseEvent(this.oTestLabel.getId(), "mousedown");
  qutils.triggerMouseEvent(this.oTestLabel.getId(), "mouseleave");
  var aActiveElements = this.oTestLabel.$().find(".sapSuiteUiCommonsProcessFlowLabelActive");

  //Assert
  assert.equal(aActiveElements.length, 0, "Active css class is removed at mouseleave");
});

QUnit.module("Visible Label", {
  beforeEach: function () {
    this.oProcessFlowConnection = new sap.suite.ui.commons.ProcessFlowConnection("rtlb_created_regular_one");
  },
  afterEach: function () {
    var aLabels = this.oProcessFlowConnection.getAggregation("_labels");
    for (var i = 0; i < aLabels.length; i++) {
      aLabels[i].destroy();
    }
    this.oProcessFlowConnection.destroy();
  }
});

QUnit.test("Get correct visible label by state", function (assert) {
  /* Arrange */
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId1", text: "first", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical, }));
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId2", text: "second", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive }));
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId3", text: "third", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative }));
  sap.ui.getCore().applyChanges();

  /* Act */
  var oLabel = this.oProcessFlowConnection._getVisibleLabel();

  /* Assert */
  assert.equal(oLabel.getId(), "myButtonId3", "Label myButtonId3 selected correctly by state (Negative)");
});

QUnit.test("Get correct visible label by state and priority", function (assert) {
  /* Arrange */
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId1", text: "first", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical, priority: 4 }));
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId2", text: "second", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative, priority: 6 }));
  this.oProcessFlowConnection.addAggregation("_labels", new sap.suite.ui.commons.ProcessFlowConnectionLabel({ id: "myButtonId3", text: "third", state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative, priority: 5 }));
  sap.ui.getCore().applyChanges();

  /* Act */
  var oLabel = this.oProcessFlowConnection._getVisibleLabel();

  /* Assert */
  assert.equal(oLabel.getId(), "myButtonId2", "Label myButtonId2 selected correctly by state (Negative) and priority (6)");
});

QUnit.module("ARIA Tests", {
  beforeEach: function () {
  },

  afterEach: function () {
    if (this.oTestLabel) {
      this.oTestLabel.destroy();
      this.oTestLabel = null;
    }
  }
});

QUnit.test("Overwrite ARIA value using 'addAriaLabelledBy'", function (assert) {
  /* Arrange */
  this.oTestLabel = new sap.suite.ui.commons.ProcessFlowConnectionLabel({
    id: "myButtonId1To11",
    text: "first helloworld",
    enabled: true,
    icon: "sap-icon://message-success",
  });
  var oInvisibleLabelText = new sap.ui.core.InvisibleText("__invId");
  oInvisibleLabelText.setText("helloworld");
  oInvisibleLabelText.toStatic();
  this.oTestLabel.addAriaLabelledBy(oInvisibleLabelText);

  /* Act */
  this.oTestLabel.placeAt("qunit-fixture");
  sap.ui.getCore().applyChanges();

  /* Assert */
  var aAriaLabelledByElements = this.oTestLabel.getAriaLabelledBy();
  assert.equal(aAriaLabelledByElements.length, 1, "1 Item available in AriaLabelledElements");
  assert.equal(aAriaLabelledByElements[0], "__invId", "Correct custom item was set in aria-labelledby array");
});

QUnit.test("Use default ARIA value", function (assert) {
  /* Arrange */

  /* Act */
  this.oTestLabel = new sap.suite.ui.commons.ProcessFlowConnectionLabel({
    id: "myButtonId1To12",
    text: "first helloworld",
    enabled: true,
    icon: "sap-icon://message-success",
  });
  this.oTestLabel.placeAt("qunit-fixture");
  sap.ui.getCore().applyChanges();

  /* Assert */
  var aAriaLabelledByElements = this.oTestLabel.getAriaLabelledBy();
  assert.equal(aAriaLabelledByElements.length, 2, "2 Items available in AriaLabelledElements");
  assert.ok(aAriaLabelledByElements[0].indexOf("__text") === 0, "Default item 1 was set for aria-labelledby array");
  assert.ok(aAriaLabelledByElements[1].indexOf("__text") === 0, "Default item 2 was set for aria-labelledby array");
});