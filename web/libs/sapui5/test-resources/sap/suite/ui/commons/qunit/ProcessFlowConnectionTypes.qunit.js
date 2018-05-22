QUnit.module("ProcessFlowConnectionTypes - Basic Tests", {
  beforeEach: function () {
    this.aPFC = [];
  },
  afterEach: function () {
    for (var i = 0; i < this.aPFC.length; i++) {
      this.aPFC[i].destroy();
    }
  }
});

QUnit.test("Connection is horizontal line", function (assert) {
  /* Arrange */
  this.aPFC.push(
  drawProcessFlowConnections("rl", "created_rightleft_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var result = this.aPFC[0]._isHorizontalLine(connection);

  /* Assert */
  assert.ok(result, "Connection is horizontal line.");
});

QUnit.test("Connection is vertical line", function (assert) {
  /* Arrange */
  this.aPFC.push(
    drawProcessFlowConnections("tb", "created_topbottom_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var result = this.aPFC[0]._isVerticalLine(connection);

  /* Assert */
  assert.ok(result, "Connection is vertical line.");
});

QUnit.test("Connection is special line", function (assert) {
  /* Arrange */
  this.aPFC.push(
    drawProcessFlowConnections("rtl", "created_righttopleft_one")
  );
  sap.ui.getCore().applyChanges();

  /* Act */
  var connection = this.aPFC[0]._traverseConnectionData();
  var resultVertical = this.aPFC[0]._isVerticalLine(connection);
  var resultHorizontal = this.aPFC[0]._isHorizontalLine(connection);

  /* Assert */
  assert.ok(!resultVertical, "Connection is not a vertical line.");
  assert.ok(!resultHorizontal, "Connection is not a horizontal line.");
});