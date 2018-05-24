/*globals QUnit*/
(function() {
	'use strict';
	jQuery.sap.require("sap.ui.comp.smartform.flexibility.FieldListNode");

	QUnit.module("sap.ui.comp.smartform.flexibility.FieldListNode", {
		beforeEach: function() {
			this.oFieldListNode = new sap.ui.comp.smartform.flexibility.FieldListNode();
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oFieldListNode);
	});

	QUnit.test("fires a nodeHidden event", function(assert) {
		var nodeHiddenCallback = function () {
			assert.ok(true);
		};

		this.oFieldListNode.attachNodeHidden(nodeHiddenCallback);

		this.oFieldListNode._hideNode();

	});

	QUnit.test("delegates a nodeHidden event to the parent control", function(assert) {
		var delegateFunctionStub = sinon.stub(this.oFieldListNode, "_fireNodeHiddenAndDelegateToParent");

		this.oFieldListNode._hideNode();

		assert.ok(delegateFunctionStub.called);
	});
}());
