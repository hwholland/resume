QUnit.module("Basic Tests", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int", state: sap.suite.ui.commons.ProcessFlowNodeState.Negative });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getAriaText = function () {
      return "";
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Process flow node is rendered.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode0"), "Style class applied.");
});

QUnit.test("Process flow node title present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-title");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
});

QUnit.test("Process flow node icon container present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-icon-container");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3StateIcon"), "Style class applied.");
});

QUnit.test("Process flow node icon present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-icon");

  assert.ok($node.is("span"), "It is a span.");
  assert.equal($node.parent()[0].id, nodeId + "-icon-container", "Parent as expected.");
});

QUnit.test("Process flow node title present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-title");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
});

QUnit.test("Process flow node - type is accessible.", function (assert) {
  var type = this.processFlowNode.getType();
  assert.equal(type, sap.suite.ui.commons.ProcessFlowNodeType.Single, "Process Flow Node Type single (default type) is correct.");
});

QUnit.module("State Tests", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getAriaText = function () {
      return "";
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Process Flow Node should exist with default state neutral. - creation", function (assert) {
  assert.ok(this.processFlowNode, "Process flow node should be present");
  assert.ok(this.processFlowNode.getState() == sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
});

QUnit.module("Children Tests", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
    this.processFlowNode._getAriaText = function () {
      return "";
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Process Flow Node contains children", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);

  /* Act */
  var result = this.processFlowNode._hasChildren();

  /* Assert */
  assert.ok(result, "Process Flow Node contains children.");
});

QUnit.test("Process Flow Node does not contain children", function (assert) {
  /* Arrange */

  /* Act */
  var result = this.processFlowNode._hasChildren();

  /* Assert */
  assert.ok(!result, "Process Flow Node does not contain children.");
});

QUnit.module("ARIA Tests", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getLane = function () {
      return {
        getText: function () {
          return "Current Lane Header";
        }
      };
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Get ARIA details of Process Flow Node", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);
  this.processFlowNode.setTitle("ARIA Test Node");
  this.processFlowNode.setTexts(["TestText1", "TestText2"]);
  this.processFlowNode.setStateText("ok statustext");

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', ["ARIA Test Node", "Neutral", "ok statustext", "Current Lane Header", "TestText1, TestText2,", 0, 2, ""]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
});

QUnit.test("Get ARIA details of Process Flow Node with undefined content texts", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);
  this.processFlowNode.setTitle("ARIA Test Node");
  this.processFlowNode.setTexts([undefined, null]);
  this.processFlowNode.setStateText("ok statustext");

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', ["ARIA Test Node", "Neutral", "ok statustext", "Current Lane Header", "", 0, 2, ""]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
});

QUnit.test("Get ARIA details of Process Flow Node on planned node", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);
  this.processFlowNode.setTitle("ARIA Test Node");
  this.processFlowNode.setTexts(["TestText1", "TestText2"]);
  this.processFlowNode.setStateText("ok statustext");
  this.processFlowNode.setState(sap.suite.ui.commons.ProcessFlowNodeState.Planned);

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', ["ARIA Test Node", "Planned", "", "Current Lane Header", "TestText1, TestText2,", 0, 2, ""]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text for planned node correct. State Text not added to ARIA label.");
});

QUnit.module("ARIA with undefined values", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getLane = function () {
      return {
        getText: function () {
          return undefined;
        }
      };
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Get ARIA details of Process Flow Node with undefined title, state text and lane header", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', [this.processFlowNode._oResBundle.getText('PF_VALUE_UNDEFINED') , "Neutral", "", this.processFlowNode._oResBundle.getText('PF_VALUE_UNDEFINED'), "", 0, 2, ""]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
});

QUnit.module("With Aggregated Node", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int", state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getAriaText = function () {
      return "";
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Process flow aggregated node is rendered.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode0"), "Style class applied.");
});

QUnit.test("Process flow aggregated node title present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-title");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
});

QUnit.test("Process flow aggregated node icon container present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-icon-container");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3StateIcon"), "Style class applied.");
});

QUnit.test("Process flow aggregated node icon present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-icon");

  assert.ok($node.is("span"), "It is a span.");
  assert.equal($node.parent()[0].id, nodeId + "-icon-container", "Parent as expected.");
});

QUnit.test("Process flow aggregated node title present.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId + "-title");

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
});

QUnit.test("Process flow aggregated node - single style class.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId);

  assert.ok($node.is("div"), "It is a div.");
  assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNodeAggregated"), "Style is correct.");
});

QUnit.module("With Aggregated Node Zoom Level 4", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({
      id: "processFlowNode1", nodeId: "processFlowNode1Int",
      state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, focused: true
    });
    this.processFlowNode._setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Four);

    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getAriaText = function () {
      return "";
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  }
  , afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Process flow aggregated node - focused zoom level 4 style class.", function (assert) {
  var nodeId = this.processFlowNode.getId();
  var $node = jQuery.sap.byId(nodeId);

  assert.ok(this.processFlowNode._getZoomLevel() === sap.suite.ui.commons.ProcessFlowZoomLevel.Four, "Zoom level is 4");
  assert.ok(!$node.hasClass("sapSuiteUiCommonsProcessFlowNodeAggregatedFocused"), "Style is correct.");
});


QUnit.module("Aggregated Node ARIA", {
  beforeEach: function () {
    this.processFlowNode = new sap.suite.ui.commons.ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated });
    //Required to avoid accessing ProcessFlow (not available in test)
    this.processFlowNode._getLane = function () {
      return {
        getText: function () {
          return "Current Lane Header";
        }
      };
    };
    this.processFlowNode.placeAt("qunit-fixture");
    sap.ui.getCore().applyChanges();
  },
  afterEach: function () {
    if (this.processFlowNode) {
      this.processFlowNode.destroy();
    }
  }
});

QUnit.test("Get ARIA details of Process Flow Aggregated Node", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);
  this.processFlowNode.setTitle("ARIA Test Node");
  this.processFlowNode.setTexts(["TestText1", "TestText2"]);
  this.processFlowNode.setStateText("ok statustext");

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', ["ARIA Test Node", "Neutral", "ok statustext", "Current Lane Header", "TestText1, TestText2,", 0, 2, this.processFlowNode._oResBundle.getText("PF_ARIA_TYPE")]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
});

QUnit.test("Get ARIA details of Process Flow Aggregated Node on planned node", function (assert) {
  /* Arrange */
  this.processFlowNode.setChildren(["1", "2"]);
  this.processFlowNode.setTitle("ARIA Test Node");
  this.processFlowNode.setTexts(["TestText1", "TestText2"]);
  this.processFlowNode.setStateText("ok statustext");
  this.processFlowNode.setState(sap.suite.ui.commons.ProcessFlowNodeState.Planned);

  /* Act */
  var result = this.processFlowNode._getAriaText();

  /* Assert */
  var assertText = this.processFlowNode._oResBundle.getText('PF_ARIA_NODE', ["ARIA Test Node", "Planned", "", "Current Lane Header", "TestText1, TestText2,", 0, 2, this.processFlowNode._oResBundle.getText("PF_ARIA_TYPE")]);
  assert.equal(result, assertText, "Process Flow Node ARIA Text for planned node correct. State Text not added to ARIA label.");
});