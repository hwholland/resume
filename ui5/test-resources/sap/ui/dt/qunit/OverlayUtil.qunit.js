/* global QUnit */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/dt/ElementOverlay',
	'sap/ui/dt/OverlayRegistry',
	'sap/ui/dt/OverlayUtil',
	'sap/ui/dt/ElementUtil',
	"sap/ui/dt/DesignTime",
	'sap/ui/layout/VerticalLayout',
	'sap/ui/dt/DesignTimeMetadata',
	"sap/uxap/ObjectPageLayout",
	"sap/uxap/ObjectPageSection",
	"sap/uxap/ObjectPageSubSection",
	"sap/m/VBox",
	'sap/m/Button',
	'sap/ui/thirdparty/sinon'
],
function(
	ElementOverlay,
	OverlayRegistry,
	OverlayUtil,
	ElementUtil,
	DesignTime,
	VerticalLayout,
	DesignTimeMetadata,
	ObjectPageLayout,
	ObjectPageSection,
	ObjectPageSubSection,
	VBox,
	Button,
	sinon
) {
	'use strict';
	QUnit.start();

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given that an Overlay is created for a control", {
		beforeEach : function(assert) {

			//	Layout2
			//		Layout1
			//			Layout0
			//				Button01
			//				Button02
			//		Button21
			//		Layout3
			//			Button31

			this.oButton01 = new Button("button01", {
				text : "Button01"
			});
			this.oButton02 = new Button("button02", {
				text : "Button02"
			});
			this.oLayout0 = new VerticalLayout("layout00", {content : [this.oButton01, this.oButton02]});

			this.oLayout1 = new VerticalLayout("layout01", {content : [this.oLayout0]});
			this.oButton21 = new Button("button21", {
				text : "Button21"
			});

			this.oButton31 = new Button("button31", {
				text : "Button31"
			});
			this.oLayout3 = new VerticalLayout("layout03", {content : [this.oButton31]});

			this.oLayout2 = new VerticalLayout("layout02", {content : [this.oLayout1, this.oButton21, this.oLayout3]});

			this.oLayout2.placeAt("qunit-fixture");

			this.oButtonOverlay01 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oButton01
			});
			this.oButtonOverlay01.placeInOverlayContainer();
			this.oButtonOverlay02 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oButton02
			});
			this.oButtonOverlay02.placeInOverlayContainer();
			this.oLayoutOverlay0 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oLayout0
			});
			this.oLayoutOverlay0.placeInOverlayContainer();

			this.oLayoutOverlay1 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oLayout1
			});
			this.oLayoutOverlay1.placeInOverlayContainer();

			this.oButtonOverlay21 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oButton21
			});
			this.oButtonOverlay21.placeInOverlayContainer();

			this.oLayoutOverlay3 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oLayout3
			});
			this.oLayoutOverlay3.placeInOverlayContainer();

			this.oButtonOverlay31 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oButton31
			});
			this.oButtonOverlay31.placeInOverlayContainer();

			this.oLayoutOverlay2 = new ElementOverlay({
				designTimeMetadata : {},
				element : this.oLayout2
			});
			this.oLayoutOverlay2.placeInOverlayContainer();

			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oLayout2.destroy();
		}
	});

	QUnit.test("when Overlays are created and the getNextOverlay function is called", function(assert) {
		var oNextOverlay = OverlayUtil.getNextOverlay(this.oLayoutOverlay2);
		assert.strictEqual(oNextOverlay, this.oLayoutOverlay1, "layoutOverlay2 -> layoutOverlay1");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oLayoutOverlay1);
		assert.strictEqual(oNextOverlay, this.oLayoutOverlay0, "layoutOverlay1 -> layoutOverlay0");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oLayoutOverlay0);
		assert.strictEqual(oNextOverlay, this.oButtonOverlay01, "layoutOverlay0 -> oButtonOverlay01");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oButtonOverlay01);
		assert.strictEqual(oNextOverlay, this.oButtonOverlay02, "oButtonOverlay01 -> oButtonOverlay02");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oButtonOverlay02);
		assert.strictEqual(oNextOverlay, this.oButtonOverlay21, "oButtonOverlay02 -> oButtonOverlay21");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oButtonOverlay21);
		assert.strictEqual(oNextOverlay, this.oLayoutOverlay3, "oButtonOverlay21 -> oLayoutOverlay3");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oLayoutOverlay3);
		assert.strictEqual(oNextOverlay, this.oButtonOverlay31, "oLayoutOverlay3 -> oButtonOverlay31");

		oNextOverlay = OverlayUtil.getNextOverlay(this.oButtonOverlay31);
		assert.strictEqual(oNextOverlay, undefined, "oButtonOverlay31 -> undefined");
	});

	QUnit.test("when Overlays are created and the getPreviousOverlay function is called", function(assert) {
		var oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oButtonOverlay21);
		assert.strictEqual(oPreviousOverlay, this.oButtonOverlay02, "oButtonOverlay21 -> oButtonOverlay02");

		oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oButtonOverlay02);
		assert.strictEqual(oPreviousOverlay, this.oButtonOverlay01, "oButtonOverlay02 -> oButtonOverlay01");

		oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oButtonOverlay01);
		assert.strictEqual(oPreviousOverlay, this.oLayoutOverlay0, "oButtonOverlay01 -> layoutOverlay0");

		oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oLayoutOverlay0);
		assert.strictEqual(oPreviousOverlay, this.oLayoutOverlay1, "oLayoutOverlay0 -> layoutOverlay1");

		oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oLayoutOverlay1);
		assert.strictEqual(oPreviousOverlay, this.oLayoutOverlay2, "oLayoutOverlay1 -> oLayoutOverlay2");

		oPreviousOverlay = OverlayUtil.getPreviousOverlay(this.oLayoutOverlay2);
		assert.strictEqual(oPreviousOverlay, undefined, "oLayoutOverlay2 -> undefined");
	});

	QUnit.test("when Overlays are created and the getAllChildOverlays function is called", function(assert) {
		var aChildOverlays = OverlayUtil.getAllChildOverlays(this.oLayoutOverlay0);
		assert.strictEqual(aChildOverlays.length, 2, "oLayoutOverlay0 has 2 children");

		aChildOverlays = OverlayUtil.getAllChildOverlays(this.oLayoutOverlay1);
		assert.strictEqual(aChildOverlays.length, 1, "oLayoutOverlay1 has 1 child");

		aChildOverlays = OverlayUtil.getAllChildOverlays(this.oButtonOverlay01);
		assert.strictEqual(aChildOverlays.length, 0, "oButtonOverlay01 has no children");

		aChildOverlays = OverlayUtil.getAllChildOverlays(undefined);
		assert.ok(Array.isArray(aChildOverlays), "undefined as function-parameter returns an empty array");
		assert.strictEqual(aChildOverlays.length, 0, "undefined as function-parameter has no children");
	});

	QUnit.test("when Overlays are created and the getFirstChildOverlay function is called", function(assert) {
		var oChildOverlay = OverlayUtil.getFirstChildOverlay(this.oLayoutOverlay0);
		assert.strictEqual(oChildOverlay, this.oButtonOverlay01, "oLayoutOverlay0 -> oButtonOverlay01 is the first child");

		oChildOverlay = OverlayUtil.getFirstChildOverlay(this.oLayoutOverlay1);
		assert.strictEqual(oChildOverlay, this.oLayoutOverlay0, "oLayoutOverlay1 -> oLayoutOverlay0 is the first child");

		oChildOverlay = OverlayUtil.getFirstChildOverlay(this.oButtonOverlay01);
		assert.strictEqual(oChildOverlay, undefined, "oButtonOverlay01 has no children and returns 'undefined'");

		oChildOverlay = OverlayUtil.getFirstChildOverlay(undefined);
		assert.strictEqual(oChildOverlay, undefined, "undefined as function-parameter has no children and returns 'undefined'");
	});

	QUnit.test("when Overlays are created and the getLastChildOverlay function is called", function(assert) {
		var oChildOverlay = OverlayUtil.getLastChildOverlay(this.oLayoutOverlay0);
		assert.strictEqual(oChildOverlay, this.oButtonOverlay02, "oLayoutOverlay0 -> oButtonOverlay02 is the last child");

		oChildOverlay = OverlayUtil.getLastChildOverlay(this.oLayoutOverlay1);
		assert.strictEqual(oChildOverlay, this.oLayoutOverlay0, "oLayoutOverlay1 -> oLayoutOverlay0 is the last child");

		oChildOverlay = OverlayUtil.getLastChildOverlay(this.oButtonOverlay01);
		assert.strictEqual(oChildOverlay, undefined, "oButtonOverlay01 has no children and returns 'undefined'");

		oChildOverlay = OverlayUtil.getLastChildOverlay(undefined);
		assert.strictEqual(oChildOverlay, undefined, "undefined as function-parameter has no children and returns 'undefined'");
	});

	QUnit.test("when Overlays are created and the getFirstDescendantByCondition function is called", function(assert) {
		var aSelectableOverlays = [
			this.oButtonOverlay01,
			this.oButtonOverlay02,
			this.oButtonOverlay21
		];
		var fnCondition = function(oOverlay) {
			return aSelectableOverlays.indexOf(oOverlay) >= 0;
		};

		var oChildOverlay = OverlayUtil.getFirstDescendantByCondition(this.oLayoutOverlay0, fnCondition);
		assert.strictEqual(oChildOverlay, this.oButtonOverlay01, "oLayoutOverlay0 -> oButtonOverlay01 is the first overlay which fulfill the condition");

		oChildOverlay = OverlayUtil.getFirstDescendantByCondition(this.oLayoutOverlay2, fnCondition);
		assert.strictEqual(oChildOverlay, this.oButtonOverlay01, "oLayoutOverlay2 -> oButtonOverlay01 is the first overlay which fulfill the condition");

		oChildOverlay = OverlayUtil.getFirstDescendantByCondition(this.oButtonOverlay01, fnCondition);
		assert.strictEqual(oChildOverlay, undefined, "oButtonOverlay01 has no children and returns 'undefined'");

		oChildOverlay = OverlayUtil.getFirstDescendantByCondition(this.oLayoutOverlay3, fnCondition);
		assert.strictEqual(oChildOverlay, undefined, "oLayoutOverlay3 children do not fulfill the condition and returns 'undefined'");

		oChildOverlay = OverlayUtil.getFirstDescendantByCondition(undefined, fnCondition);
		assert.strictEqual(oChildOverlay, undefined, "and overlay-parameter is 'undefined' -> returns 'undefined'");

		assert.throws(function() { OverlayUtil.getFirstDescendantByCondition(this.oLayoutOverlay0); },
			/expected condition is 'undefined' or not a function/,
			"and function-parameter is 'undefined' -> throws error");
	});

	QUnit.test("when Overlays are created and the getRootOverlay function is called", function(assert) {
		var oRootOverlay = OverlayUtil.getRootOverlay(this.oButtonOverlay02);
		assert.strictEqual(oRootOverlay, this.oLayoutOverlay2, "with the second button overlay, then the layout root overlay is returned");
	});

	QUnit.test("when getParentInformation is requested for a control with a parent ", function(assert) {
		var oParentInformation = OverlayUtil.getParentInformation(this.oButtonOverlay01);

		assert.ok(oParentInformation, "then parent information is returned");
		assert.strictEqual(oParentInformation.parent, this.oLayout0, "parent is correct");
		assert.strictEqual(oParentInformation.aggregation, "content", "aggregation name is correct");
		assert.strictEqual(oParentInformation.index, 0, "index in aggregation is correct");
	});

	QUnit.test("when getParentInformation is requested for a control with no parent ", function(assert) {
		var oButton = new Button();
		var oOverlay = new ElementOverlay({element : oButton});

		var oParentInformation = OverlayUtil.getParentInformation(oOverlay);

		assert.ok(oParentInformation, "then parent information is returned");
		assert.ok(!oParentInformation.parent, "parent is undefined");
		assert.strictEqual(oParentInformation.aggregation, "", "aggregation is empty string");
		assert.strictEqual(oParentInformation.index, -1, "index in aggregation is -1");

		oButton.destroy();
	});

	QUnit.test("when findAllOverlaysInContainer is called", function(assert) {
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay01, this.oLayoutOverlay0).length, 3, "then it returns the correct overlays ");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oLayoutOverlay0, this.oLayoutOverlay1).length, 2, "then it returns the correct overlays ");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oLayoutOverlay1, this.oLayoutOverlay2).length, 4, "then it returns the correct overlays");
	});


	QUnit.module("Given a VBox with an ObjectPageLayout with Overlays created", {
		beforeEach : function(assert) {
			var done = assert.async();

			//	VBox0
			//		Layout0
			//			Section0
			//				SubSection0
			//					Button0
			//					Button1
			//			Section1
			//				SubSection1
			//					Button2
			//					Button3
			//					Button8 -- different Aggregation
			//				SubSection2
			//					Button4 RelevantContainer: Section1
			//					Button5
			//					VBox1 RelevantContainer: oSubSection2
			//						VBox2 RelevantContainer: oSubSection2
			//							Button6 RelevantContainer: oSubSection2
			//							Button7 RelevantContainer: oSubSection2

			this.oButton0 = new Button("button0", {text: "button0"});
			this.oButton1 = new Button("button1", {text: "button1"});
			this.oButton2 = new Button("button2", {text: "button2"});
			this.oButton3 = new Button("button3", {text: "button3"});
			this.oButton4 = new Button("button4", {text: "button4"});
			this.oButton5 = new Button("button5", {text: "button5"});
			this.oButton6 = new Button("button6", {text: "button6"});
			this.oButton7 = new Button("button7", {text: "button7"});
			this.oButton8 = new Button("button8", {text: "button8"});
			this.oVBox2 = new VBox("VBox2", {
				items : [this.oButton6, this.oButton7]
			});
			this.oVBox1 = new VBox("VBox1", {
				items : [this.oVBox2]
			});
			this.oSubSection0 = new ObjectPageSubSection("subsection0", {
				blocks: [this.oButton0, this.oButton1]
			});
			this.oSubSection1 = new ObjectPageSubSection("subsection1", {
				blocks: [this.oButton2, this.oButton3],
				moreBlocks: [this.oButton8]
			});
			this.oSubSection2 = new ObjectPageSubSection("subsection2", {
				blocks: [this.oButton4, this.oButton5, this.oVBox1]
			});
			this.oSection0 = new ObjectPageSection("section0", {
				subSections: [this.oSubSection0]
			});
			this.oSection1 = new ObjectPageSection("section1", {
				subSections: [this.oSubSection1, this.oSubSection2]
			});
			this.oLayout0 = new ObjectPageLayout("layout0", {
				sections : [this.oSection0, this.oSection1]
			});
			this.oVBox0 = new VBox("VBox", {
				items : [this.oLayout0]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oDesignTime = new DesignTime({
				rootElements : [this.oVBox0]
			});

			this.oDesignTime.attachEventOnce("synced", function() {
				this.oVBoxOverlay0 = OverlayRegistry.getOverlay(this.oVBox0);
				this.oVBoxOverlay1 = OverlayRegistry.getOverlay(this.oVBox1);
				this.oVBoxOverlay2 = OverlayRegistry.getOverlay(this.oVBox2);
				this.oLayoutOverlay0 = OverlayRegistry.getOverlay(this.oLayout0);
				this.oSectionOverlay0 = OverlayRegistry.getOverlay(this.oSection0);
				this.oSectionOverlay1 = OverlayRegistry.getOverlay(this.oSection1);
				this.oSubSectionOverlay0 = OverlayRegistry.getOverlay(this.oSubSection0);
				this.oSubSectionOverlay1 = OverlayRegistry.getOverlay(this.oSubSection1);
				this.oSubSectionOverlay2 = OverlayRegistry.getOverlay(this.oSubSection2);
				this.oButtonOverlay0 = OverlayRegistry.getOverlay(this.oButton0);
				this.oButtonOverlay2 = OverlayRegistry.getOverlay(this.oButton2);
				this.oButtonOverlay4 = OverlayRegistry.getOverlay(this.oButton4);
				this.oButtonOverlay6 = OverlayRegistry.getOverlay(this.oButton6);
				this.oButtonOverlay7 = OverlayRegistry.getOverlay(this.oButton7);
				this.oButtonOverlay8 = OverlayRegistry.getOverlay(this.oButton8);

				sandbox.stub(this.oButtonOverlay4, "getRelevantContainer").returns(this.oSection1);
				sandbox.stub(this.oButtonOverlay6, "getRelevantContainer").returns(this.oSubSection2);
				sandbox.stub(this.oButtonOverlay7, "getRelevantContainer").returns(this.oSubSection2);
				sandbox.stub(this.oVBoxOverlay1, "getRelevantContainer").returns(this.oSubSection2);
				sandbox.stub(this.oVBoxOverlay2, "getRelevantContainer").returns(this.oSubSection2);
				done();
			}.bind(this));

		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oVBox0.destroy();
			this.oDesignTime.destroy();
		}
	});

	QUnit.test("when findAllOverlaysInContainer is called", function(assert) {
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oVBoxOverlay0).length, 2, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oLayoutOverlay0).length, 2, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oSectionOverlay0).length, 3, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oSectionOverlay1).length, 3, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oSubSectionOverlay0).length, 2, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oSubSectionOverlay1).length, 4, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oSubSectionOverlay2).length, 4, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay0).length, 3, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay2).length, 3, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay4).length, 8, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay6).length, 7, "then it returns the correct overlays");
		this.oButtonOverlay4.destroyDesignTimeMetadata();
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay6).length, 6, "then the overlay without DT Metadata is not returned");
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay8).length, 2, "then it returns the correct overlays");
		this.oSubSectionOverlay1.destroyDesignTimeMetadata();
		assert.equal(OverlayUtil.findAllOverlaysInContainer(this.oButtonOverlay8).length, 1, "then the overlay without DT Metadata is not returned");
	});

	QUnit.test("when findAllSiblingOverlaysInContainer is called", function(assert){
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oVBoxOverlay0, this.oVBoxOverlay0).length, 0, "then it returns no overlays");

		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oLayoutOverlay0, this.oVBoxOverlay0).length, 1, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oSectionOverlay0, this.oLayoutOverlay0).length, 2, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oSubSectionOverlay0, this.oSectionOverlay0).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oSubSectionOverlay1, this.oSectionOverlay1).length, 2, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay0, this.oSubSectionOverlay0).length, 2, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay2, this.oSubSectionOverlay1).length, 2, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay4, this.oSectionOverlay1).length, 5, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay6, this.oSubSectionOverlay2).length, 2, "then it returns the correct overlays");
		this.oButtonOverlay7.destroyDesignTimeMetadata();
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay6, this.oSubSectionOverlay2).length, 1, "then the overlay without DT Metadata is not returned");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay8, this.oSubSectionOverlay1).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllSiblingOverlaysInContainer(this.oButtonOverlay8, this.oSubSectionOverlay1).length, 1, "then it returns the correct overlays");
	});

	QUnit.test("when findAllUniqueAggregationOverlaysInContainer is called", function(assert){
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oVBoxOverlay0, this.oVBoxOverlay0).length, 0, "then it returns no overlays");

		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oLayoutOverlay0, this.oVBoxOverlay0).length, 1, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oSectionOverlay0, this.oLayoutOverlay0).length, 1, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oSubSectionOverlay0, this.oSectionOverlay0).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oSubSectionOverlay1, this.oSectionOverlay1).length, 1, "then it returns the correct overlays");

		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oButtonOverlay0, this.oSubSectionOverlay0).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oButtonOverlay2, this.oSubSectionOverlay1).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oButtonOverlay4, this.oSectionOverlay1).length, 2, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oButtonOverlay6, this.oSubSectionOverlay2).length, 1, "then it returns the correct overlays");
		assert.equal(OverlayUtil.findAllUniqueAggregationOverlaysInContainer(this.oButtonOverlay8, this.oSubSectionOverlay1).length, 1, "then it returns the correct overlays");
	});
});