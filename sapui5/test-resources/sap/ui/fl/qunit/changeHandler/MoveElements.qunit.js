/*global QUnit*/

if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.require("sap.ui.fl.changeHandler.MoveElements");
jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.ObjectAttribute");
jQuery.sap.require("sap.m.ObjectHeader");
jQuery.sap.require("sap.ui.layout.VerticalLayout");
jQuery.sap.require("sap.ui.fl.Change");
jQuery.sap.require("sap.ui.fl.changeHandler.JsControlTreeModifier");
jQuery.sap.require("sap.ui.fl.changeHandler.XmlTreeModifier");

(function(MoveElementsHandler, Change, JsControlTreeModifier, XmlTreeModifier) {
	"use strict";

	QUnit.module("Given a Move Elements Change Handler", {
		beforeEach : function() {
			this.oChangeHandler = MoveElementsHandler;

			// Test Setup:
			// VerticalLayout
			// -- content
			// -- -- ObjectHeader
			// -- -- -- attributes
			// -- -- -- -- ObjectAttribute
			// -- -- -- -- ObjectAttribute2
			// -- -- Button

			this.oButton = new sap.m.Button();
			this.oObjectAttribute = new sap.m.ObjectAttribute();
			this.oObjectAttribute2 = new sap.m.ObjectAttribute();

			this.oObjectHeader = new sap.m.ObjectHeader({
				attributes : [this.oObjectAttribute, this.oObjectAttribute2]
			});
			this.oLayout = new sap.ui.layout.VerticalLayout({
				content : [this.oObjectHeader, this.oButton]
			});

			var oDOMParser = new DOMParser();
			var oXmlString =
				'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns:layout="sap.ui.layout" xmlns="sap.m"><layout:VerticalLayout id="' + this.oLayout.getId() + '">' +
					'<layout:content>' +
						'<ObjectHeader id="' + this.oObjectHeader.getId() + '">' +
							'<ObjectAttribute id="' + this.oObjectAttribute.getId() + '" />' +
							'<ObjectAttribute id="' + this.oObjectAttribute2.getId() + '" />' +
						'</ObjectHeader>' +
						'<Button id="' + this.oButton.getId() + '">' +
						'</Button>' +
					'</layout:content>' +
				'</layout:VerticalLayout></mvc:View>';
			var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");
			this.oXmlView = oXmlDocument;

			this.oXmlLayout = oXmlDocument.childNodes[0].childNodes[0];
			this.oXmlObjectHeader = this.oXmlLayout.childNodes[0].childNodes[0];
			this.oXmlObjectAttribute = this.oXmlObjectHeader.childNodes[0];
			this.oXmlObjectAttribute2 = this.oXmlObjectHeader.childNodes[1];
			this.oXmlButton = this.oXmlLayout.childNodes[0].childNodes[1];

			this.mExpectedSelector = {
				id : this.oObjectHeader.getId(),
				aggregation : "attributes",
				type : "sap.m.ObjectHeader"
			};

			this.mExpectedSingleMoveChangeContent = {
				movedElements : [{
					selector : {
						id : this.oObjectAttribute.getId(),
						type : "sap.m.ObjectAttribute"
					},
					sourceIndex : 0,
					targetIndex : 2
				}],
				target : {
					selector : {
						id : this.oLayout.getId(),
						aggregation : "content",
						type : "sap.ui.layout.VerticalLayout"
					}
				}
			};

			this.mExpectedMultiMoveChangeContent = {
				movedElements : [{
					selector : {
						id : this.oObjectAttribute.getId(),
						type : "sap.m.ObjectAttribute"
					},
					sourceIndex : 0,
					targetIndex : 2
				}, {
					selector : {
						id : this.oObjectAttribute2.getId(),
						type : "sap.m.ObjectAttribute"
					},
					sourceIndex : 1,
					targetIndex : 3
				}],
				target : {
					selector : {
						id : this.oLayout.getId(),
						aggregation : "content",
						type : "sap.ui.layout.VerticalLayout"
					}
				}
			};
		},
		afterEach : function() {
			this.oLayout.destroy();
		}
	});

	QUnit.test("When providing change data via specific change info, Then", function(assert) {
		var mSpecificChangeInfo = {
			movedElements : [{
				element : this.oObjectAttribute, // optional fallback for id
				id : this.oObjectAttribute.getId(),
				sourceIndex : 0,
				targetIndex : 2
			}],
			source : {
				id : this.oObjectHeader.getId(), // could also be parent
				aggregation : "attributes"
			},
			target : {
				parent : this.oLayout, // could also be id
				aggregation : "content"
			}
		};

		var oChange = new Change({});
		this.oChangeHandler.completeChangeContent(oChange, mSpecificChangeInfo, {modifier: JsControlTreeModifier});

		assert.deepEqual(oChange.getSelector(), this.mExpectedSelector, "the change SELECTOR is filled correctly");
		assert.deepEqual(oChange.getContent(), this.mExpectedSingleMoveChangeContent,
				"the change CONTENT is filled correctly");
		assert.equal(oChange.getChangeType(), "moveElements", "the change TYPE is filled correctly");
	});

	QUnit.test("When applying the single move change on jsControlTree, Then", function(assert) {
		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : this.mExpectedSingleMoveChangeContent
		});

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier}));

		assert.equal(this.oObjectHeader.getAttributes().length, 1, "object attribute is removed from the header");
		assert.equal(this.oObjectHeader.getAttributes()[0].getId(), this.oObjectAttribute2.getId(),
				"object attribute 2 is still in the header");
		assert.equal(this.oLayout.getContent()[0].getId(), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oLayout.getContent()[1].getId(), this.oButton.getId(), "button is still at 2. position");
		assert.equal(this.oLayout.getContent()[2].getId(), this.oObjectAttribute.getId(),
				"object attribute is inserted at the 3. position");

	});

	QUnit.test("When applying the multi move change on jsControlTree, Then", function(assert) {
		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : this.mExpectedMultiMoveChangeContent
		});

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier}));

		assert.equal(this.oObjectHeader.getAttributes().length, 0, "both object attributes removed from the header");
		assert.equal(this.oLayout.getContent()[0].getId(), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oLayout.getContent()[1].getId(), this.oButton.getId(), "button is still at 2. position");
		assert.equal(this.oLayout.getContent()[2].getId(), this.oObjectAttribute.getId(),
				"object attribute is inserted at the 3. position");
		assert.equal(this.oLayout.getContent()[3].getId(), this.oObjectAttribute2.getId(),
				"object attribute 2 is inserted at the 4. position");

	});

	QUnit.test("When applying broken changes (functionality independent of modifier), Then", function(assert) {
		var oChange = new Change({
			selector : {
				id : this.oObjectHeader.getId()
			},
			content : this.mExpectedMultiMoveChangeContent
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("No source aggregation supplied via selector for move"), "missing source aggregation error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				movedElements : []
			}
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("No target supplied for move"), "missing target error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				target : {
					selector : {
						id : "unknown"
					}
				}
			}
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("Move target parent not found"), "unknown target error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				movedElements : [{
					selector : {
						id : this.oObjectAttribute.getId()
					},
					sourceIndex : 0,
					targetIndex : 2
				}],
				target : {
					selector : {
						id : this.oLayout.getId()
					}
				}
			}
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("No target aggregation supplied for move"), "missing target aggregation error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				target : {
					selector : {
						id : this.oLayout.getId(),
						aggregation : "content"
					}
				}
			}
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("No moveElements supplied"), "missing moved elements error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				movedElements : [{
					selector : {
						id : "unknown"
					}
				}],
				target : {
					selector : {
						id : this.oLayout.getId(),
						aggregation : "content"
					}
				}
			}
		});
		assert
				.throws(function() {
					this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
				}, new Error("Unknown element with id 'unknown' in moveElements supplied"),
						"missing moved element id error captured");

		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : {
				movedElements : [{
					selector : {
						id : this.oObjectAttribute.getId()
					},
					sourceIndex : 0
				}],
				target :{
					selector : {
						id : this.oLayout.getId(),
						aggregation : "content"
					}
				}
			}
		});
		assert.throws(function() {
			this.oChangeHandler.applyChange(oChange, this.oObjectHeader, {modifier: JsControlTreeModifier});
		}, new Error("Missing targetIndex for element with id '" + this.oObjectAttribute.getId()
				+ "' in moveElements supplied"), "missing target index error captured");

	});

	QUnit.test("When applying the single move change on xmlControlTree, Then", function(assert) {
		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : this.mExpectedSingleMoveChangeContent
		});

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oXmlObjectHeader, {modifier: XmlTreeModifier, view: this.oXmlView}));

		assert.equal(this.oXmlObjectHeader.childNodes.length, 1, "object attribute is removed from the header");
		assert.equal(this.oXmlObjectHeader.childNodes[0].getAttribute("id"), this.oObjectAttribute2.getId(),
				"object attribute 2 is still in the header");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[0].getAttribute("id"), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[1].getAttribute("id"), this.oButton.getId(), "button is still at 2. position");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[2].getAttribute("id"), this.oObjectAttribute.getId(),
				"object attribute is inserted at the 3. position");

	});

	QUnit.test("When applying the multi move change on xmlControlTree, Then", function(assert) {
		var oChange = new Change({
			selector : this.mExpectedSelector,
			content : this.mExpectedMultiMoveChangeContent
		});

		assert.ok(this.oChangeHandler.applyChange(oChange, this.oXmlObjectHeader, {modifier: XmlTreeModifier, view: this.oXmlView}));

		assert.equal(this.oXmlObjectHeader.childNodes.length, 0, "both object attributes removed from the header");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[0].getAttribute("id"), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[1].getAttribute("id"), this.oButton.getId(), "button is still at 2. position");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[2].getAttribute("id"), this.oObjectAttribute.getId(),
				"object attribute is inserted at the 3. position");
		assert.equal(this.oXmlLayout.childNodes[0].childNodes[3].getAttribute("id"), this.oObjectAttribute2.getId(),
				"object attribute 2 is inserted at the 4. position");

	});
}(sap.ui.fl.changeHandler.MoveElements, sap.ui.fl.Change, sap.ui.fl.changeHandler.JsControlTreeModifier, sap.ui.fl.changeHandler.XmlTreeModifier));
