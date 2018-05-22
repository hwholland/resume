/* --- Helpers --- */

function drawProcessFlowConnections(flowLine, type) {

    var draw = function (type) {
      var connectionData = new Array();
      connectionData.push(getSingleConnectionData(type));

      var processFlowConnection = new sap.suite.ui.commons.ProcessFlowConnection(flowLine + "_" + type);
      processFlowConnection.setDrawData(connectionData);
      processFlowConnection.setZoomLevel(getZoomLevel(type));
      processFlowConnection.placeAt("processFlowConnection");

      return processFlowConnection;
    };

    var getSingleConnectionData = function (type) {
      var singleConnectionData = new Object();
      singleConnectionData.flowLine = flowLine;
      singleConnectionData.targetNodeState = getTargetNodeState(type);
      singleConnectionData.displayState = getDisplayState(type);
      if (flowLine.indexOf("r") >= 0) {
        singleConnectionData.hasArrow = getArrowState(type);
      } else {
        singleConnectionData.hasArrow = false;
      }

      return singleConnectionData;
    };

    var getTargetNodeState = function (type) {
      var connectionTypes = type.split("_");
      switch (connectionTypes[0]) {
        case "created":
          return sap.suite.ui.commons.ProcessFlowNodeState.Positive;
        case "planned":
          return sap.suite.ui.commons.ProcessFlowNodeState.Planned;
        default:
          return null;
      }
    };

    var getDisplayState = function (type) {
      var connectionTypes = type.split("_");
      switch (connectionTypes[1]) {
        case "regular":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Regular;
        case "highlighted":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted;
        case "dimmed":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed;
        default:
          return null;
      }
    };

    var getZoomLevel = function (type) {
      var connectionTypes = type.split("_");
      switch (connectionTypes[2]) {
        case "one":
          return sap.suite.ui.commons.ProcessFlowZoomLevel.One;
        case "two":
          return sap.suite.ui.commons.ProcessFlowZoomLevel.Two;
        case "three":
          return sap.suite.ui.commons.ProcessFlowZoomLevel.Three;
        case "four":
          return sap.suite.ui.commons.ProcessFlowZoomLevel.Four;
        default:
          return null;
      }
    };

    var getArrowState = function (type) {
      var connectionTypes = type.split("_");
      if (connectionTypes.length == 4 && connectionTypes[3] == "arrow") {
        return true;
      } else {
        return false;
      }
    };

    return draw(type);
};


/* --- Tests --- */

QUnit.module("Basic Tests", {
  beforeEach: function () {
    this.aPFC = [];
  },
  afterEach: function () {
    for (var i = 0; i < this.aPFC.length; i++) {
      this.aPFC[i].destroy();
    }
  }
});

QUnit.test("Connection rtlb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rtlb", "created_regular_one"),
    drawProcessFlowConnections("rtlb", "created_regular_two"),
    drawProcessFlowConnections("rtlb", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rtlb", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rtlb", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rtlb", "planned_regular_three"),
    drawProcessFlowConnections("rtlb", "planned_dimmed_four"),
    drawProcessFlowConnections("rtlb", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rtlb_created_regular_one > .borderLeft").length == 2 &&
    $("#rtlb_created_regular_one > .borderBottom").length == 3 &&
    $("#rtlb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtlb_created_regular_two > .borderLeft").length == 2 &&
    $("#rtlb_created_regular_two > .borderBottom").length == 3 &&
    $("#rtlb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtlb_created_dimmed_two_arrow > .borderLeft").length == 2 &&
    $("#rtlb_created_dimmed_two_arrow  > .borderBottom").length == 3 &&
    $("#rtlb_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rtlb_created_highlighted_three_arrow > .borderLeft").length == 2 &&
    $("#rtlb_created_highlighted_three_arrow  > .borderBottom").length == 3 &&
    $("#rtlb_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rtlb_planned_dimmed_one_arrow > .borderLeft").length == 2 &&
    $("#rtlb_planned_dimmed_one_arrow > .borderBottom").length == 3 &&
    $("#rtlb_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rtlb_planned_regular_three > .borderLeft").length == 2 &&
    $("#rtlb_planned_regular_three > .borderBottom").length == 3 &&
    $("#rtlb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rtlb_planned_dimmed_four > .borderLeft").length == 2 &&
    $("#rtlb_planned_dimmed_four > .borderBottom").length == 3 &&
    $("#rtlb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rtlb_planned_highlighted_four_arrow > .borderLeft").length == 2 &&
    $("#rtlb_planned_highlighted_four_arrow > .borderBottom").length == 3 &&
    $("#rtlb_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rtl is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rtl", "created_regular_one"),
    drawProcessFlowConnections("rtl", "created_regular_two"),
    drawProcessFlowConnections("rtl", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rtl", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rtl", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rtl", "planned_regular_three"),
    drawProcessFlowConnections("rtl", "planned_dimmed_four"),
    drawProcessFlowConnections("rtl", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rtl_created_regular_one > .borderLeft").length == 1 &&
    $("#rtl_created_regular_one > .borderBottom").length == 3 &&
    $("#rtl_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtl_created_regular_two > .borderLeft").length == 1 &&
    $("#rtl_created_regular_two > .borderBottom").length == 3 &&
    $("#rtl_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtl_created_dimmed_two_arrow > .borderLeft").length == 1 &&
    $("#rtl_created_dimmed_two_arrow  > .borderBottom").length == 3 &&
    $("#rtl_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rtl_created_highlighted_three_arrow > .borderLeft").length == 1 &&
    $("#rtl_created_highlighted_three_arrow  > .borderBottom").length == 3 &&
    $("#rtl_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rtl_planned_dimmed_one_arrow > .borderLeft").length == 1 &&
    $("#rtl_planned_dimmed_one_arrow > .borderBottom").length == 3 &&
    $("#rtl_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rtl_planned_regular_three > .borderLeft").length == 1 &&
    $("#rtl_planned_regular_three > .borderBottom").length == 3 &&
    $("#rtl_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rtl_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#rtl_planned_dimmed_four > .borderBottom").length == 3 &&
    $("#rtl_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rtl_planned_highlighted_four_arrow > .borderLeft").length == 1 &&
    $("#rtl_planned_highlighted_four_arrow > .borderBottom").length == 3 &&
    $("#rtl_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rtb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rtb", "created_regular_one"),
    drawProcessFlowConnections("rtb", "created_regular_two"),
    drawProcessFlowConnections("rtb", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rtb", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rtb", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rtb", "planned_regular_three"),
    drawProcessFlowConnections("rtb", "planned_dimmed_four"),
    drawProcessFlowConnections("rtb", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rtb_created_regular_one > .borderLeft").length == 2 &&
    $("#rtb_created_regular_one > .borderBottom").length == 2 &&
    $("#rtb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtb_created_regular_two > .borderLeft").length == 2 &&
    $("#rtb_created_regular_two > .borderBottom").length == 2 &&
    $("#rtb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rtb_created_dimmed_two_arrow > .borderLeft").length == 2 &&
    $("#rtb_created_dimmed_two_arrow  > .borderBottom").length == 2 &&
    $("#rtb_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rtb_created_highlighted_three_arrow > .borderLeft").length == 2 &&
    $("#rtb_created_highlighted_three_arrow  > .borderBottom").length == 2 &&
    $("#rtb_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rtb_planned_dimmed_one_arrow > .borderLeft").length == 2 &&
    $("#rtb_planned_dimmed_one_arrow > .borderBottom").length == 2 &&
    $("#rtb_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rtb_planned_regular_three > .borderLeft").length == 2 &&
    $("#rtb_planned_regular_three > .borderBottom").length == 2 &&
    $("#rtb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rtb_planned_dimmed_four > .borderLeft").length == 2 &&
    $("#rtb_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#rtb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rtb_planned_highlighted_four_arrow > .borderLeft").length == 2 &&
    $("#rtb_planned_highlighted_four_arrow > .borderBottom").length == 2 &&
    $("#rtb_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rlb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rlb", "created_regular_one"),
    drawProcessFlowConnections("rlb", "created_regular_two"),
    drawProcessFlowConnections("rlb", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rlb", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rlb", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rlb", "planned_regular_three"),
    drawProcessFlowConnections("rlb", "planned_dimmed_four"),
    drawProcessFlowConnections("rlb", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rlb_created_regular_one > .borderLeft").length == 1 &&
    $("#rlb_created_regular_one > .borderBottom").length == 3 &&
    $("#rlb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rlb_created_regular_two > .borderLeft").length == 1 &&
    $("#rlb_created_regular_two > .borderBottom").length == 3 &&
    $("#rlb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rlb_created_dimmed_two_arrow > .borderLeft").length == 1 &&
    $("#rlb_created_dimmed_two_arrow  > .borderBottom").length == 3 &&
    $("#rlb_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rlb_created_highlighted_three_arrow > .borderLeft").length == 1 &&
    $("#rlb_created_highlighted_three_arrow  > .borderBottom").length == 3 &&
    $("#rlb_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rlb_planned_dimmed_one_arrow > .borderLeft").length == 1 &&
    $("#rlb_planned_dimmed_one_arrow > .borderBottom").length == 3 &&
    $("#rlb_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rlb_planned_regular_three > .borderLeft").length == 1 &&
    $("#rlb_planned_regular_three > .borderBottom").length == 3 &&
    $("#rlb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rlb_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#rlb_planned_dimmed_four > .borderBottom").length == 3 &&
    $("#rlb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rlb_planned_highlighted_four_arrow > .borderLeft").length == 1 &&
    $("#rlb_planned_highlighted_four_arrow > .borderBottom").length == 3 &&
    $("#rlb_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection tlb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("tlb", "created_regular_one"),
    drawProcessFlowConnections("tlb", "created_regular_two"),
    drawProcessFlowConnections("tlb", "created_dimmed_two"),
    drawProcessFlowConnections("tlb", "created_highlighted_three"),
    drawProcessFlowConnections("tlb", "planned_dimmed_one"),
    drawProcessFlowConnections("tlb", "planned_regular_three"),
    drawProcessFlowConnections("tlb", "planned_dimmed_four"),
    drawProcessFlowConnections("tlb", "planned_highlighted_four")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#tlb_created_regular_one > .borderLeft").length == 2 &&
    $("#tlb_created_regular_one > .borderBottom").length == 2 &&
    $("#tlb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tlb_created_regular_two > .borderLeft").length == 2 &&
    $("#tlb_created_regular_two > .borderBottom").length == 2 &&
    $("#tlb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tlb_created_dimmed_two > .borderLeft").length == 2 &&
    $("#tlb_created_dimmed_two  > .borderBottom").length == 2 &&
    $("#tlb_created_dimmed_two  .arrowRight").length == 0,
    "created dimmed connection is rendered");

  assert.ok($("#tlb_created_highlighted_three > .borderLeft").length == 2 &&
    $("#tlb_created_highlighted_three  > .borderBottom").length == 2 &&
    $("#tlb_created_highlighted_three  .arrowRight").length == 0,
    "created highlighted connection is rendered");

  assert.ok($("#tlb_planned_dimmed_one > .borderLeft").length == 2 &&
    $("#tlb_planned_dimmed_one > .borderBottom").length == 2 &&
    $("#tlb_planned_dimmed_one .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tlb_planned_regular_three > .borderLeft").length == 2 &&
    $("#tlb_planned_regular_three > .borderBottom").length == 2 &&
    $("#tlb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#tlb_planned_dimmed_four > .borderLeft").length == 2 &&
    $("#tlb_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#tlb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tlb_planned_highlighted_four > .borderLeft").length == 2 &&
    $("#tlb_planned_highlighted_four > .borderBottom").length == 2 &&
    $("#tlb_planned_highlighted_four .arrowRight").length == 0,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rt is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rt", "created_regular_one"),
    drawProcessFlowConnections("rt", "created_regular_two"),
    drawProcessFlowConnections("rt", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rt", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rt", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rt", "planned_regular_three"),
    drawProcessFlowConnections("rt", "planned_dimmed_four"),
    drawProcessFlowConnections("rt", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rt_created_regular_one > .borderLeft").length == 1 &&
    $("#rt_created_regular_one > .borderBottom").length == 2 &&
    $("#rt_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rt_created_regular_two > .borderLeft").length == 1 &&
    $("#rt_created_regular_two > .borderBottom").length == 2 &&
    $("#rt_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rt_created_dimmed_two_arrow > .borderLeft").length == 1 &&
    $("#rt_created_dimmed_two_arrow  > .borderBottom").length == 2 &&
    $("#rt_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rt_created_highlighted_three_arrow > .borderLeft").length == 1 &&
    $("#rt_created_highlighted_three_arrow  > .borderBottom").length == 2 &&
    $("#rt_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rt_planned_dimmed_one_arrow > .borderLeft").length == 1 &&
    $("#rt_planned_dimmed_one_arrow > .borderBottom").length == 2 &&
    $("#rt_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rt_planned_regular_three > .borderLeft").length == 1 &&
    $("#rt_planned_regular_three > .borderBottom").length == 2 &&
    $("#rt_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rt_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#rt_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#rt_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rt_planned_highlighted_four_arrow > .borderLeft").length == 1 &&
    $("#rt_planned_highlighted_four_arrow > .borderBottom").length == 2 &&
    $("#rt_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rl is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rl", "created_regular_one"),
    drawProcessFlowConnections("rl", "created_regular_two"),
    drawProcessFlowConnections("rl", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rl", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rl", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rl", "planned_regular_three"),
    drawProcessFlowConnections("rl", "planned_dimmed_four"),
    drawProcessFlowConnections("rl", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rl_created_regular_one > .borderLeft").length == 0 &&
    $("#rl_created_regular_one > .borderBottom").length == 1 &&
    $("#rl_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rl_created_regular_two > .borderLeft").length == 0 &&
    $("#rl_created_regular_two > .borderBottom").length == 1 &&
    $("#rl_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rl_created_dimmed_two_arrow > .borderLeft").length == 0 &&
    $("#rl_created_dimmed_two_arrow  > .borderBottom").length == 1 &&
    $("#rl_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rl_created_highlighted_three_arrow > .borderLeft").length == 0 &&
    $("#rl_created_highlighted_three_arrow  > .borderBottom").length == 1 &&
    $("#rl_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rl_planned_dimmed_one_arrow > .borderLeft").length == 0 &&
    $("#rl_planned_dimmed_one_arrow > .borderBottom").length == 1 &&
    $("#rl_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rl_planned_regular_three > .borderLeft").length == 0 &&
    $("#rl_planned_regular_three > .borderBottom").length == 1 &&
    $("#rl_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rl_planned_dimmed_four > .borderLeft").length == 0 &&
    $("#rl_planned_dimmed_four > .borderBottom").length == 1 &&
    $("#rl_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rl_planned_highlighted_four_arrow > .borderLeft").length == 0 &&
    $("#rl_planned_highlighted_four_arrow > .borderBottom").length == 1 &&
    $("#rl_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection rb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("rb", "created_regular_one"),
    drawProcessFlowConnections("rb", "created_regular_two"),
    drawProcessFlowConnections("rb", "created_dimmed_two_arrow"),
    drawProcessFlowConnections("rb", "created_highlighted_three_arrow"),
    drawProcessFlowConnections("rb", "planned_dimmed_one_arrow"),
    drawProcessFlowConnections("rb", "planned_regular_three"),
    drawProcessFlowConnections("rb", "planned_dimmed_four"),
    drawProcessFlowConnections("rb", "planned_highlighted_four_arrow")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#rb_created_regular_one > .borderLeft").length == 1 &&
    $("#rb_created_regular_one > .borderBottom").length == 2 &&
    $("#rb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rb_created_regular_two > .borderLeft").length == 1 &&
    $("#rb_created_regular_two > .borderBottom").length == 2 &&
    $("#rb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#rb_created_dimmed_two_arrow > .borderLeft").length == 1 &&
    $("#rb_created_dimmed_two_arrow  > .borderBottom").length == 2 &&
    $("#rb_created_dimmed_two_arrow  .arrowRight").length == 1,
    "created dimmed connection is rendered");

  assert.ok($("#rb_created_highlighted_three_arrow > .borderLeft").length == 1 &&
    $("#rb_created_highlighted_three_arrow  > .borderBottom").length == 2 &&
    $("#rb_created_highlighted_three_arrow  .arrowRight").length == 1,
    "created highlighted connection is rendered");

  assert.ok($("#rb_planned_dimmed_one_arrow > .borderLeft").length == 1 &&
    $("#rb_planned_dimmed_one_arrow > .borderBottom").length == 2 &&
    $("#rb_planned_dimmed_one_arrow .arrowRight").length == 1,
    "planned dimmed connection is rendered");

  assert.ok($("#rb_planned_regular_three > .borderLeft").length == 1 &&
    $("#rb_planned_regular_three > .borderBottom").length == 2 &&
    $("#rb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#rb_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#rb_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#rb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#rb_planned_highlighted_four_arrow > .borderLeft").length == 1 &&
    $("#rb_planned_highlighted_four_arrow > .borderBottom").length == 2 &&
    $("#rb_planned_highlighted_four_arrow .arrowRight").length == 1,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection tl is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("tl", "created_regular_one"),
    drawProcessFlowConnections("tl", "created_regular_two"),
    drawProcessFlowConnections("tl", "created_dimmed_two"),
    drawProcessFlowConnections("tl", "created_highlighted_three"),
    drawProcessFlowConnections("tl", "planned_dimmed_one"),
    drawProcessFlowConnections("tl", "planned_regular_three"),
    drawProcessFlowConnections("tl", "planned_dimmed_four"),
    drawProcessFlowConnections("tl", "planned_highlighted_four")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#tl_created_regular_one > .borderLeft").length == 1 &&
    $("#tl_created_regular_one > .borderBottom").length == 2 &&
    $("#tl_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tl_created_regular_two > .borderLeft").length == 1 &&
    $("#tl_created_regular_two > .borderBottom").length == 2 &&
    $("#tl_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tl_created_dimmed_two > .borderLeft").length == 1 &&
    $("#tl_created_dimmed_two  > .borderBottom").length == 2 &&
    $("#tl_created_dimmed_two  .arrowRight").length == 0,
    "created dimmed connection is rendered");

  assert.ok($("#tl_created_highlighted_three > .borderLeft").length == 1 &&
    $("#tl_created_highlighted_three  > .borderBottom").length == 2 &&
    $("#tl_created_highlighted_three  .arrowRight").length == 0,
    "created highlighted connection is rendered");

  assert.ok($("#tl_planned_dimmed_one > .borderLeft").length == 1 &&
    $("#tl_planned_dimmed_one > .borderBottom").length == 2 &&
    $("#tl_planned_dimmed_one .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tl_planned_regular_three > .borderLeft").length == 1 &&
    $("#tl_planned_regular_three > .borderBottom").length == 2 &&
    $("#tl_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#tl_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#tl_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#tl_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tl_planned_highlighted_four > .borderLeft").length == 1 &&
    $("#tl_planned_highlighted_four > .borderBottom").length == 2 &&
    $("#tl_planned_highlighted_four .arrowRight").length == 0,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection tb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("tb", "created_regular_one"),
    drawProcessFlowConnections("tb", "created_regular_two"),
    drawProcessFlowConnections("tb", "created_dimmed_two"),
    drawProcessFlowConnections("tb", "created_highlighted_three"),
    drawProcessFlowConnections("tb", "planned_dimmed_one"),
    drawProcessFlowConnections("tb", "planned_regular_three"),
    drawProcessFlowConnections("tb", "planned_dimmed_four"),
    drawProcessFlowConnections("tb", "planned_highlighted_four")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#tb_created_regular_one > .borderLeft").length == 1 &&
    $("#tb_created_regular_one > .borderBottom").length == 0 &&
    $("#tb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tb_created_regular_two > .borderLeft").length == 1 &&
    $("#tb_created_regular_two > .borderBottom").length == 0 &&
    $("#tb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#tb_created_dimmed_two > .borderLeft").length == 1 &&
    $("#tb_created_dimmed_two  > .borderBottom").length == 0 &&
    $("#tb_created_dimmed_two  .arrowRight").length == 0,
    "created dimmed connection is rendered");

  assert.ok($("#tb_created_highlighted_three > .borderLeft").length == 1 &&
    $("#tb_created_highlighted_three  > .borderBottom").length == 0 &&
    $("#tb_created_highlighted_three  .arrowRight").length == 0,
    "created highlighted connection is rendered");

  assert.ok($("#tb_planned_dimmed_one > .borderLeft").length == 1 &&
    $("#tb_planned_dimmed_one > .borderBottom").length == 0 &&
    $("#tb_planned_dimmed_one .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tb_planned_regular_three > .borderLeft").length == 1 &&
    $("#tb_planned_regular_three > .borderBottom").length == 0 &&
    $("#tb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#tb_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#tb_planned_dimmed_four > .borderBottom").length == 0 &&
    $("#tb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#tb_planned_highlighted_four > .borderLeft").length == 1 &&
    $("#tb_planned_highlighted_four > .borderBottom").length == 0 &&
    $("#tb_planned_highlighted_four .arrowRight").length == 0,
    "planned highlighted connection is rendered");
});

QUnit.test("Connection lb is rendered", function (assert) {
  this.aPFC.push(
    drawProcessFlowConnections("lb", "created_regular_one"),
    drawProcessFlowConnections("lb", "created_regular_two"),
    drawProcessFlowConnections("lb", "created_dimmed_two"),
    drawProcessFlowConnections("lb", "created_highlighted_three"),
    drawProcessFlowConnections("lb", "planned_dimmed_one"),
    drawProcessFlowConnections("lb", "planned_regular_three"),
    drawProcessFlowConnections("lb", "planned_dimmed_four"),
    drawProcessFlowConnections("lb", "planned_highlighted_four")
  );
  sap.ui.getCore().applyChanges();

  assert.ok($("#lb_created_regular_one > .borderLeft").length == 1 &&
    $("#lb_created_regular_one > .borderBottom").length == 2 &&
    $("#lb_created_regular_one .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#lb_created_regular_two > .borderLeft").length == 1 &&
    $("#lb_created_regular_two > .borderBottom").length == 2 &&
    $("#lb_created_regular_two .arrowRight").length == 0,
    "created regular connection is rendered");

  assert.ok($("#lb_created_dimmed_two > .borderLeft").length == 1 &&
    $("#lb_created_dimmed_two  > .borderBottom").length == 2 &&
    $("#lb_created_dimmed_two  .arrowRight").length == 0,
    "created dimmed connection is rendered");

  assert.ok($("#lb_created_highlighted_three > .borderLeft").length == 1 &&
    $("#lb_created_highlighted_three  > .borderBottom").length == 2 &&
    $("#lb_created_highlighted_three  .arrowRight").length == 0,
    "created highlighted connection is rendered");

  assert.ok($("#lb_planned_dimmed_one > .borderLeft").length == 1 &&
    $("#lb_planned_dimmed_one > .borderBottom").length == 2 &&
    $("#lb_planned_dimmed_one .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#lb_planned_regular_three > .borderLeft").length == 1 &&
    $("#lb_planned_regular_three > .borderBottom").length == 2 &&
    $("#lb_planned_regular_three .arrowRight").length == 0,
    "planned regular connection is rendered");

  assert.ok($("#lb_planned_dimmed_four > .borderLeft").length == 1 &&
    $("#lb_planned_dimmed_four > .borderBottom").length == 2 &&
    $("#lb_planned_dimmed_four .arrowRight").length == 0,
    "planned dimmed connection is rendered");

  assert.ok($("#lb_planned_highlighted_four > .borderLeft").length == 1 &&
    $("#lb_planned_highlighted_four > .borderBottom").length == 2 &&
    $("#lb_planned_highlighted_four .arrowRight").length == 0,
    "planned highlighted connection is rendered");
});

QUnit.module("ARIA", {
  beforeEach: function () {
    this.aPFC = [];
  },
  afterEach: function () {
    for (var i = 0; i < this.aPFC.length; i++) {
      this.aPFC[i].destroy();
      this.aPFC[i] = null;
    }
  }
});

QUnit.test("Get ARIA details of branch connection", function (assert) {
  /* Arrange */
  this.aPFC.push(
    drawProcessFlowConnections("rtl", "created_righttopleft_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var resultText = this.aPFC[0]._getAriaText(connection);

  /* Assert */
  assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_BRANCH'), "branch; equal succeeds");
});

QUnit.test("Get ARIA details of horizontal connection", function (assert) {
  /* Arrange */
  this.aPFC.push(
    drawProcessFlowConnections("rl", "created_rightleft_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var resultText = this.aPFC[0]._getAriaText(connection);

  /* Assert */
  assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE'), "horizontal line; equal succeeds");
});

QUnit.test("Get ARIA details of vertical connection", function (assert) {
  /* Arrange */
  this.aPFC.push(
    drawProcessFlowConnections("tb", "created_topbottom_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var resultText = this.aPFC[0]._getAriaText(connection);

  /* Assert */
  assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_VERTICAL_LINE'), "vertical line; equal succeeds");
});

QUnit.test("Get ARIA details of an ending horizontal connection", function (assert) {
  /* Arrange */

  this.aPFC.push(
    drawProcessFlowConnections("rl", "created_topbottom_one_arrow")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var resultText = this.aPFC[0]._getAriaText(connection);

  /* Assert */
  assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE') + " " + this.aPFC[0]._oResBundle.getText('PF_CONNECTION_ENDS'), "horizontal line ends; equal succeeds");
});

QUnit.module("Display-State Hierarchy", {
  beforeEach: function () {
    this.oProcessFlow = new sap.suite.ui.commons.ProcessFlow();
    this.oProcessFlowMatrixCalculator = new sap.suite.ui.commons.ProcessFlow.InternalMatrixCalculation(this.oProcessFlow);
    this.oSourceNode = null;
    this.oTargetNode = null;
  },
  afterEach: function () {
    this.oProcessFlow.destroy();
    this.oSourceNode.destroy();
    this.oTargetNode.destroy();
    this.oProcessFlowMatrixCalculator = null;
    this.oProcessFlow = null;
    this.oSourceNode = null;
    this.oTargetNode = null;
  }
});

QUnit.test("Test 'Regular' - 'Regular' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: false});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: false});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Regular - Regular results in Regular");
});

QUnit.test("Test 'Regular' - 'Regular+Focused' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: false});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Regular - Regular+Focused results in Regular (Focused is not relevant)");
});

QUnit.test("Test 'Selected' - 'Selected' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, selected: true});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, selected: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Selected, "Selected - Selected results in Selected");
});

QUnit.test("Test 'Highlighted' - 'Highlighted' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted, "Highlighted - Highlighted results in Highlighted");
});

QUnit.test("Test 'Dimmed' - 'Dimmed' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oSourceNode._setDimmedState(true);
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode._setDimmedState(true);

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Dimmed - Dimmed results in Dimmed");
});

QUnit.test("Test 'Regular' - 'Dimmed' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode._setDimmedState(true);

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Regular - Dimmed results in Dimmed");
  this.oSourceNode._setDimmedState(true);
  this.oTargetNode._setDimmedState(false);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Dimmed - Regular results in Dimmed");
});

QUnit.test("Test 'Selected' - 'Dimmed' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, selected: true});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode._setDimmedState(true);

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Selected - Dimmed results in Dimmed");
  this.oSourceNode.setSelected(false);
  this.oSourceNode._setDimmedState(true);
  this.oTargetNode._setDimmedState(false);
  this.oTargetNode.setSelected(true);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Dimmed - Selected results in Dimmed");
});

QUnit.test("Test 'Highlighted' - 'Dimmed' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode._setDimmedState(true);

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Highlighted - Dimmed results in Dimmed");
  this.oSourceNode.setHighlighted(false);
  this.oSourceNode._setDimmedState(true);
  this.oTargetNode._setDimmedState(false);
  this.oTargetNode.setHighlighted(true);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Dimmed - Highlighted results in Dimmed");
});

QUnit.test("Test 'Regular' - 'Highlighted' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Regular - Highlighted results in Regular");
  this.oSourceNode.setHighlighted(true);
  this.oTargetNode.setHighlighted(false);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Highlighted - Regular results in Regular");
});

QUnit.test("Test 'Regular' - 'Selected' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, selected: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Regular - Selected results in Regular");
  this.oSourceNode.setSelected(true);
  this.oTargetNode.setSelected(false);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Regular, "Selected - Regular results in Regular");
});

QUnit.test("Test 'Highlighted' - 'Selected' state", function (assert) {
  /* Arrange */
  this.oSourceNode = new sap.suite.ui.commons.ProcessFlowNode({id: "sourceId", title: "Invoice 1", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true});
  this.oTargetNode = new sap.suite.ui.commons.ProcessFlowNode({id: "targetId", title: "Invoice 2", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, selected: true});

  /* Act */
  var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

  /* Assert */
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Highlighted - Selected results in Dimmed");
  this.oSourceNode.setHighlighted(false);
  this.oSourceNode.setSelected(true);
  this.oTargetNode.setSelected(false);
  this.oTargetNode.setHighlighted(true);
  assert.equal(sCalculatedDisplayState, sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed, "Selected - Highlighted results in Dimmed");
});