/* global QUnit sinon */

jQuery.sap.require("sap.ui.qunit.qunit-coverage");

if (window.blanket){
	window.blanket.options("sap-ui-cover-only", "[sap/ui/rta]");
}

jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");
jQuery.sap.require("sap.ui.dt.ElementOverlay");
jQuery.sap.require("sap.ui.rta.plugin.RTAElementMover");

jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.comp.smartform.Group");

(function() {
	"use strict";

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given a group element, overlays, RTAElementMover", {
		beforeEach : function(assert) {
			this.oSmartGroupElement = new sap.ui.comp.smartform.GroupElement("stableField");
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm("form", {
				groups : [
					new sap.ui.comp.smartform.Group("originalGroup",{
						groupElements : [
							this.oSmartGroupElement
						]
					})
				]
			});
			this.oMovedOverlay = new sap.ui.dt.ElementOverlay({
				element : this.oSmartGroupElement
			}).setDesignTimeMetadata({});
			this.oElementMover = new sap.ui.rta.plugin.RTAElementMover();
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oSmartForm.destroy();
			this.oMovedOverlay.destroy();
			this.oPossibleParentOverlay.destroy();
			this.oElementMover.destroy();
		}
	});

	QUnit.test("and a group with stable id, when checking the target zone,", function(assert) {
		var groupElementsOverlay = getVisibleGroupElementsOverlayOverlayFor.call(this, "stableGroup");

		this.oElementMover.setMovedOverlay(this.oMovedOverlay)
		assert.ok(this.oElementMover.checkTargetZone(groupElementsOverlay), "then group is a possible target zone");
	});


	QUnit.test("and a group without stable id, when checking the target zone,", function(assert) {
		var groupElementsOverlay = getVisibleGroupElementsOverlayOverlayFor.call(this);

		this.oElementMover.setMovedOverlay(this.oMovedOverlay);
		assert.ok(!this.oElementMover.checkTargetZone(groupElementsOverlay), "then a from the type correct parent control is not a possible target zone as the id is not stable");
	});

	function getVisibleGroupElementsOverlayOverlayFor(sGroupId){
		var oGroup = new sap.ui.comp.smartform.Group(sGroupId);
		this.oSmartForm.addGroup(oGroup);

		this.oPossibleParentOverlay = new sap.ui.dt.ElementOverlay({
			element : oGroup
		});
		this.oPossibleParentOverlay.setDesignTimeMetadata({});
		var groupElementsOverlay = this.oPossibleParentOverlay.getAggregationOverlay("groupElements");

		//make it visible by stubbing:
		sandbox.stub(groupElementsOverlay, "$", function(){
			return {
				is : function(){
					return true;
				}
			};
		});

		return groupElementsOverlay;
	}
})();
