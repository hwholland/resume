/*globals QUnit*/
(function() {
	'use strict';

	jQuery.sap.require("sap.ui.comp.smartform.flexibility.FieldList");

	QUnit.module("sap.ui.comp.smartform.flexibility.FieldList", {
		beforeEach: function() {
			this.oFieldList = new sap.ui.comp.smartform.flexibility.FieldList();
		},
		afterEach: function() {
			this.oFieldList.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oFieldList);
	});

	QUnit.test("fires a nodeHidden event", function(assert) {
		var done = assert.async();

		var nodeHiddenCallback = function () {
			assert.ok(true, "callback was attached and called");
			done();
		};

		this.oFieldList.attachNodeHidden(nodeHiddenCallback);

		this.oFieldList.fireNodeHidden();

	});

	QUnit.test("registers a nodeHidden event on an added listNode and reacts on it", function(assert) {
		var done = assert.async();

		var nodeHiddenCallback = function () {
			assert.ok(true, "event was delegated from the node to the list");
			done();
		};
		this.oFieldList.attachNodeHidden(nodeHiddenCallback);
		var oNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		this.oFieldList.addNode(oNode);

		oNode._hideNode();
	});

	QUnit.test("deregisters the nodeHidden event at the destruction of a listNode", function(assert) {
		var firstNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		var secondNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		this.oFieldList.addNode(firstNode);
		this.oFieldList.addNode(secondNode);
		var deregisterMock = sinon.spy(this.oFieldList, "_deregisterNodeHiddenEvent");

		this.oFieldList.removeNode(secondNode);

		assert.equal(deregisterMock.withArgs(firstNode).callCount, 0, "the first node was not deregistered");
		assert.ok(deregisterMock.withArgs(secondNode).calledOnce, "the second node was deregistered");
	});

	QUnit.test("deregisters the nodeHidden event at the destruction of all listNodes", function(assert) {
		var firstNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		var secondNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		this.oFieldList.addNode(firstNode);
		this.oFieldList.addNode(secondNode);
		var deregisterMock = sinon.spy(this.oFieldList, "_deregisterNodeHiddenEvent");

		this.oFieldList.destroyNodes();

		assert.ok(deregisterMock.withArgs(firstNode).calledOnce, "the first node was deregistered");
		assert.ok(deregisterMock.withArgs(secondNode).calledOnce, "the second node was deregistered");
	});
}());
