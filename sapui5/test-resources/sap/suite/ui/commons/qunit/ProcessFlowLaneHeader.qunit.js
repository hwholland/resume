QUnit.module("With the standard header type", {
  beforeEach: function () {
    this.processFlowLaneHeader = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader",
      iconSrc: "sap-icon://order-status",
      state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 25 },
              { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 75 }],
      position: 0
    });
    this.processFlowLaneHeader.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowLaneHeader) {
      this.processFlowLaneHeader.destroy();
    }
  }
});

QUnit.test("Check for the header container presence", function (assert) {
  var nodeId = this.processFlowLaneHeader.getId();
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("suiteUiProcessFlowLaneHeaderContainer"), "Style class applied.");
});

QUnit.test("Check for lane header above type div rendering.", function (assert) {
  var nodeId = this.processFlowLaneHeader.getId() + "-standard";
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("suiteUiProcessFlowLaneHeaderBodyContainer"), "Style class applied.");
});

QUnit.test("Check for donut chart svg rendering.", function (assert) {
  var nodeId = this.processFlowLaneHeader.getId() + "-donut-chart";
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("svg"), "It is a svg.");
});

QUnit.test("Check donut chart segment rendering.", function (assert) {
  var nodeId0 = this.processFlowLaneHeader.getId() + "-donut-segment-0";
  var $node0 = jQuery.sap.byId(nodeId0);

  assert.ok($node0.is("path"), "Exists path 0.");

  var nodeId1 = this.processFlowLaneHeader.getId() + "-donut-segment-1";
  var $node1 = jQuery.sap.byId(nodeId1);
  assert.ok($node1.is("path"), "Exists path 1.");

  var nodeId2 = this.processFlowLaneHeader.getId() + "-donut-segment-2";
  var $node2 = jQuery.sap.byId(nodeId2);
  assert.ok(!$node2.is("path"), "Not existing path 2.");

  var nodeId3 = this.processFlowLaneHeader.getId() + "-donut-segment-3";
  var $node3 = jQuery.sap.byId(nodeId3);
  assert.ok(!$node3.is("path"), "Not existing path 3.");
});

QUnit.test("_mergeLaneIdNodeStates: Merging node state values for several nodes", function (assert) {
  var oProcessFlow = new sap.suite.ui.commons.ProcessFlow;

  // Arrange
  var aLaneIdNodeStates = [];
  var aNode1 = [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 5 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 6 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 2 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 4 }];

  var aNode2 = [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 0 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 3 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 8 }];

  var aNode3 = [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 2 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 2 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 0 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 2 }];

  var aNode4 = [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 0 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 0 },
                { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 2 }];

  aLaneIdNodeStates.push(aNode1);
  aLaneIdNodeStates.push(aNode2);
  aLaneIdNodeStates.push(aNode3);
  aLaneIdNodeStates.push(aNode4);

  var aResult = oProcessFlow._mergeLaneIdNodeStates(aLaneIdNodeStates);

  var aExpected = [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 9 },
                   { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 8 },
                   { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 5 },
                   { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 16 }];
  // Assert
  assert.deepEqual(aExpected, aResult, "Should be merged correctly");

  // Cleanup
  oProcessFlow.destroy();
});

QUnit.module("ARIA", {
  beforeEach: function () {
    this.processFlowLaneHeader1 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader1"
        , iconSrc: "sap-icon://order-status"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 25 }
                  , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 75 }]
        , position: 0
    });
    this.processFlowLaneHeader2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader2"
      , iconSrc: "sap-icon://order-status"
      , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 25 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 70 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 5 }]
      , position: 0
    });
    this.processFlowLaneHeader3 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader3"
      , iconSrc: "sap-icon://order-status"
      , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 5 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 70 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 5 }]
      , position: 0
    });
    this.processFlowLaneHeader4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader4"
      , iconSrc: "sap-icon://order-status"
      , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 2.5 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 2.5 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 70 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 5 }]
      , position: 0
    });
    this.processFlowLaneHeader5 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      id: "processFlowLaneHeader5"
      , iconSrc: "sap-icon://order-status"
      , position: 0
    });
    this.processFlowLaneHeader1.placeAt("qunit-fixture");
    this.processFlowLaneHeader2.placeAt("qunit-fixture");
    this.processFlowLaneHeader3.placeAt("qunit-fixture");
    this.processFlowLaneHeader4.placeAt("qunit-fixture");
    this.processFlowLaneHeader5.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  }
  , afterEach: function () {
    if (this.processFlowLaneHeader1) {
      this.processFlowLaneHeader1.destroy();
    }
    if (this.processFlowLaneHeader2) {
      this.processFlowLaneHeader2.destroy();
    }
    if (this.processFlowLaneHeader3) {
      this.processFlowLaneHeader3.destroy();
    }
    if (this.processFlowLaneHeader4) {
      this.processFlowLaneHeader4.destroy();
    }
    if (this.processFlowLaneHeader5) {
      this.processFlowLaneHeader5.destroy();
    }
  }
});

QUnit.test("Get status text for screen reader support", function (assert) {
  //Assertion for test 2 values case.
  var testText = this.processFlowLaneHeader1._getAriaText();
  assert.deepEqual(testText, this.processFlowLaneHeader1._oResBundle.getText('PF_ARIA_STATUS') + " 25% Positive, 75% Negative", "Text was generated correctly with 2 status values");

  //Assertion for test 3 values case.
  testText = this.processFlowLaneHeader2._getAriaText();
  assert.deepEqual(testText, this.processFlowLaneHeader2._oResBundle.getText('PF_ARIA_STATUS') + " 25% Positive, 70% Negative, 5% Planned", "Text was generated correctly with 3 status values");

  //Assertion for test 4 values case.
  testText = this.processFlowLaneHeader3._getAriaText();
  assert.deepEqual(testText, this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS') + " 5% Positive, 70% Negative, 20% Neutral, 5% Planned",
  "Text was generated correctly with 4 status values");

  //Assertion for test 5 values case.
  testText = this.processFlowLaneHeader4._getAriaText();
  assert.deepEqual(testText, this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS') + " 3% Positive, 3% Positive, 70% Negative, 20% Neutral, 5% Planned",
  "Text was generated correctly with 5 status values");

  //Assertion for text control without state object.
  testText = this.processFlowLaneHeader5._getAriaText();
  assert.deepEqual(testText, "", "Returns empty string for a control without status object");
});

QUnit.module("Integration", {
  beforeEach: function () {
    this.processFlow = new sap.suite.ui.commons.ProcessFlow("processFlow");
    this.processFlow.placeAt("qunit-fixture");
    this.processFlowClick = null;
    this.processFlowLaneHeader1 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      laneId: "processFlowLaneHeader1",
      iconSrc: "context-menu",
      position: 1
    });
    this.processFlowLaneHeader3 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      laneId: "processFlowLaneHeader3",
      iconSrc: "context-menu",
      position: 3
    });
    this.processFlowLaneHeader5 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
      laneId: "processFlowLaneHeader5",
      iconSrc: "context-menu",
      position: 5
    });
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlow) {
      this.processFlow.destroy();
    }
    if (this.processFlowClick) {
      this.processFlowClick.destroy();
    }
    if (this.processFlowLaneHeader1) {
      this.processFlowLaneHeader1.destroy();
    }
    if (this.processFlowLaneHeader3) {
      this.processFlowLaneHeader3.destroy();
    }
    if (this.processFlowLaneHeader5) {
      this.processFlowLaneHeader5.destroy();
    }
  }
});

QUnit.test("ProcessFlow lane map check", function (assert) {
  this.processFlow.addLane(this.processFlowLaneHeader5);
  this.processFlow.addLane(this.processFlowLaneHeader1);
  this.processFlow.addLane(this.processFlowLaneHeader3);
  assert.ok(this.processFlow, "Process flow should be ok");

  var headerLane = this.processFlow._getOrCreateLaneMap();
  assert.ok(headerLane, "Map exists.");
  assert.equal(headerLane[1], this.processFlowLaneHeader1, "First position passed.");
  assert.equal(headerLane[3], this.processFlowLaneHeader3, "First position passed.");
  assert.equal(headerLane[5], this.processFlowLaneHeader5, "First position passed.");
});

QUnit.test("ProcessFlow lane map check, strange order of lanes", function (assert) {

  var oProcessFlowLanesWithClick = new sap.suite.ui.commons.ProcessFlow("pLanesWithClick", {
    nodes: {
      path: "/nodes",
      template: new sap.suite.ui.commons.ProcessFlowNode({
        nodeId: "{id}",
        laneId: "{laneId}",
        title: "{title}",
        isTitleClickable: true,
        children: "{children}",
        state: "{state}",
        titleAbbreviation: "{title}" + "abbr",
        stateText: "{state}",
        tag: { tagCheck: "tagCheck" },
        texts: "{texts}"
      })
    },
    lanes: {
      path: "/lanes",
      template: new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "{id}",
        iconSrc: "{iconSrc}",
        text: "{text}",
        state: "{state}",
        position: "{position}"
      })
    },
  });

  var oDataLanesWithClick = {
    nodes:
      [
       {
         id: "1", laneId: "id0", title: "Sales Order 150", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
         texts: ["text 1 runs over two rows but no  more than two", ""]
       },
       {
         id: "10", laneId: "id3", title: "Accounting Document 78998790 with BBBB and AAAA and CCC and DDDD and EEEE", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative,
         texts: ["text 2 runs over two rows but only two and no more", ""]
       },
       {
         id: "11", laneId: "id2", title: "Customer Invoice 9004562", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral,
         texts: ["text 1 runs over two rows", "text 2 runs over two rows"]
       },
       {
         id: "12", laneId: "id1", title: "Outbound Delivery 80017028", children: [5], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned,
         texts: ["text 1 runs over two rows ", "text 2 runs over two rows"]
       },
       {
         id: "5", laneId: "id2", title: "Customer Invoice 2004562", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
         texts: ["text 1 runs over two rows", "text 2 runs over two rows"]
       },
      ],
    lanes:
      [{ id: "id1", iconSrc: "sap-icon://order-status", text: "In Order", position: 1 }, // first lane element
       { id: "id0", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 0 }, // first lane element
       { id: "id2", iconSrc: "sap-icon://order-status", text: "In Payment", position: 2 }, // fourth lane element
       { id: "id3", iconSrc: "sap-icon://order-status", text: "In Invoice", position: 3 } // third lane element
      ]
  };
  var oJModelLanesWithClick = new sap.ui.model.json.JSONModel(oDataLanesWithClick);
  oProcessFlowLanesWithClick.setModel(oJModelLanesWithClick);
  oProcessFlowLanesWithClick.attachOnError(function (error) {
    assert.ok(error, error);
  });
  oProcessFlowLanesWithClick.placeAt("qunit-fixture");
  sap.ui.getCore().applyChanges();
  if (oProcessFlowLanesWithClick) {
    oProcessFlowLanesWithClick.destroy();
  }
  assert.expect(0);
});