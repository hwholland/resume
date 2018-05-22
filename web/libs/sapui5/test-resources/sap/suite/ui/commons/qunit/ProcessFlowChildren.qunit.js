QUnit.module("ProcessFlowChildren - Children Type", {
  beforeEach: function () {
    this.oProcessFlow = new sap.suite.ui.commons.ProcessFlow("processFlow1");
    this.oConnectionLabel = new sap.suite.ui.commons.ProcessFlowConnectionLabel({
      id: "myButtonId1To11",
      text: "first helloworld",
      enabled: true,
      icon: "sap-icon://message-success",
    });
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "1", laneId: "id0", title: "Sales Order 150", children: [10, { nodeId: 11, connectionLabel: this.oConnectionLabel }, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "10", laneId: "id4", title: "Outbound Delivery 42417000", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "11", laneId: "id3", title: "Outbound Delivery 42417001", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "12", laneId: "id2", title: "Outbound Delivery 42417002", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "5", laneId: "id3", title: "Outbound Delivery 42417003", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative }));

    this.oProcessFlow.placeAt("processflowdiv");
    sap.ui.getCore().applyChanges();
  },

  afterEach: function () {
    if (this.oProcessFlow) {
      this.oProcessFlow.destroy();
    }
    if (this.oConnectionLabel) {
      this.oConnectionLabel.destroy();
    }
  }
});

QUnit.test("Check ids and objects as children", function (assert) {

  //Arrange

  //Act
  var aNodes = this.oProcessFlow.getNodes();
  var aChildIds = [];
  for (var i = 0; i < aNodes.length; i++) {
    var currentNodeChildren = aNodes[i].getChildren();
    if (currentNodeChildren) {
      for (var j = 0; j < currentNodeChildren.length; j++) {
        aChildIds.push(sap.suite.ui.commons.ProcessFlow._getChildIdByElement(currentNodeChildren[j]));
      }
    }
  }

  //Assert
  for (var k = 0; k < aChildIds.length; k++) {
    assert.ok((typeof aChildIds[k] === "number" || typeof aChildIds[k] === "string"), "All childs, configured as id or object are parsed correctly as number.");
  }
});

QUnit.module("ProcessFlowChildren - Parent Relation", {
  beforeEach: function () {
    this.oProcessFlow = new sap.suite.ui.commons.ProcessFlow("processFlow1");

    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "1", laneId: "id1", title: "Sales Order 150", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "10", laneId: "id2", title: "Outbound Delivery 42417000", children: [11], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "11", laneId: "id3", title: "Outbound Delivery 42417001", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "12", laneId: "id4", title: "Outbound Delivery 42417002", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive }));
    this.oProcessFlow.addNode(new sap.suite.ui.commons.ProcessFlowNode({ nodeId: "5", laneId: "id5", title: "Outbound Delivery 42417003", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative }));

    this.oProcessFlow.placeAt("processflowdiv");
    sap.ui.getCore().applyChanges();
  },

  afterEach: function () {
    if (this.oProcessFlow) {
      this.oProcessFlow.destroy();
    }
  }
});

QUnit.test("Check parent configuration", function (assert) {

  //Arrange

  //Act
  this.oProcessFlow._setParentForNodes(this.oProcessFlow.getNodes());
  
  //Assert
  var aNodes = this.oProcessFlow.getNodes();
  assert.equal(aNodes[0].getAssociation("parents"), null, "No parents for Node with nodeId 1.");
  assert.equal(aNodes[1].getAssociation("parents").length, 1, "Node with nodeId 10 has 1 parent.");
  assert.equal(aNodes[2].getAssociation("parents").length, 2, "Node with nodeId 11 has 2 parents.");
  assert.equal(aNodes[3].getAssociation("parents").length, 1, "Node with nodeId 12 has 1 parent.");
  assert.equal(aNodes[4].getAssociation("parents").length, 1, "Node with nodeId 5 has 1 parent.");
});