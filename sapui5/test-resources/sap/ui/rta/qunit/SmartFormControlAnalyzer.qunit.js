jQuery.sap.require("sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory");

(function() {
	"use strict";

	QUnit.module("Given that an SmartForm with SmartFormgroups is given...", {
		beforeEach : function(assert) {
			this.oGroupElement = new sap.ui.comp.smartform.GroupElement();

			this.oGroup1 = new sap.ui.comp.smartform.Group({
				groupElements : [this.oGroupElement]
			});
			this.oGroup2 = new sap.ui.comp.smartform.Group();

			this.oSmartForm = new sap.ui.comp.smartform.SmartForm({
				groups : [this.oGroup1, this.oGroup2]
			});

			this.oSmartForm.placeAt("content");
			sap.ui.getCore().applyChanges();

			this.oControlAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(this.oSmartForm);

		},
		afterEach : function() {
			this.oSmartForm.destroy();
			this.oControlAnalyzer.destroy();
		}
	});

	QUnit.test("when the checkTargetZone is called for the SmartForm", function(assert) {
		var oAnotherSmartForm = new sap.ui.comp.smartform.SmartForm();

		assert.strictEqual(this.oControlAnalyzer.checkTargetZone(this.oSmartForm, "groups", this.oGroup1), true,
				"groups aggregation inside the same parent SmartForm is valid for Group");
		assert.strictEqual(this.oControlAnalyzer.checkTargetZone(this.oGroup1, "groupElements", this.oGroupElement), true,
				"groupElements aggregation of Group inside the same parent SmartForm is valid for GroupElement");

		assert.notStrictEqual(this.oControlAnalyzer.checkTargetZone(oAnotherSmartForm, "groups", this.oGroup1), true,
				"groups aggregation inside the different parent SmartForm is not valid for Group");
	});

	var oView;
	QUnit.module("Given that a SmartForm with bindings is given", {
		beforeEach : function(assert) {
			oView = renderComplexView();
		},
		afterEach : function(assert) {
			oView.destroy();
		}
	});
	
	 QUnit.test("when SmartFormAnalyzer gets initialized,", function(assert) {
		 var oSmartForm = new sap.ui.comp.smartform.SmartForm();
		 var done = assert.async();
			var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oSmartForm);
			oAnalyzer.prepare().then(function() {
			}).catch(function(err) {
				 assert.ok(true, "then Promise is rejected because no model was available");
				 done();
			 });
	 });
	 
	QUnit.test("when getting an available elements for a specific SmartForm with ignoredField,", function(assert) {
		var done = assert.async();
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oModel = oView.getContent()[0].getModel().getMetaModel().oModel;
		
		//EntityType01 has 5 properties and 4 bound inside the group!
		//EntityType02 has 6 properties
		var oSmartFormXML = oView._xContent.querySelector("[id=GroupEntityType01]");
		var reg =/\{([^}]+)\}/g;
		var sSmartForm = new XMLSerializer().serializeToString(oSmartFormXML);
		var aBoundElements = sSmartForm.match(reg);
	
		var oBoundFields = {};
		for (var i = 0; i < aBoundElements.length; i++) {
			var sName = aBoundElements[i].replace("{", "").replace("}", "");
			if (sName.indexOf("i18n") !== 0 ) { // don't check i18 data bindings
				oBoundFields[sName] = sName;		
			}
		}
		var oGroup1 = oSmartForm.getGroups()[0];
		
		//Hiding an element with a bound ignored field should not change the number of available fields.
		oGroup1.getGroupElements()[4].setVisible(false);
		sap.ui.getCore().applyChanges();

		var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroup1);
		oAnalyzer.prepare().then(function() {
			var mAvailableElements = oAnalyzer.getAvailableElements();
			var mHiddenElements = oAnalyzer.getHiddenElements();
			assert.ok(Object.keys(mAvailableElements).length === (5 - Object.keys(oBoundFields).length) , "the correct number of available elements are found");
			// 6 properties from EntityType02 and 4 already bound in view
			assert.ok(Object.keys(mHiddenElements).length === (6 + 4), "the correct number of hidden elements are found");
			done();
		});
	});

	QUnit.test("when getting an available elements for a specific Group,", function(assert) {
		var done = assert.async();
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oModel = oView.getContent()[0].getModel().getMetaModel().oModel;
		
		//EntityType01 has 5 properties and 4 bound inside the group!
		//EntityType02 has 6 properties
		var oSmartFormXML = oView._xContent.querySelector("[id=GroupEntityType01]");
		var reg =/\{([^}]+)\}/g;
		var sSmartForm = new XMLSerializer().serializeToString(oSmartFormXML);
		var aBoundElements = sSmartForm.match(reg);
	
		var oBoundFields = {};
		for (var i = 0; i < aBoundElements.length; i++) {
			var sName = aBoundElements[i].replace("{", "").replace("}", "");
			if (sName.indexOf("i18n") !== 0 ) { // don't check i18 data bindings
				oBoundFields[sName] = sName;		
			}
		}
		var oGroup1 = oSmartForm.getGroups()[0];
		var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroup1);
		oAnalyzer.prepare().then(function() {
			var mAvailableElements = oAnalyzer.getAvailableElements();
			var mHiddenElements = oAnalyzer.getHiddenElements();
			assert.ok(Object.keys(mAvailableElements).length === (5 - Object.keys(oBoundFields).length) , "the correct number of available elements are found");
			// 6 properties from EntityType02 and 4 already bound in view
			assert.ok(Object.keys(mHiddenElements).length === (6 + 4), "the correct number of hidden elements are found");
			done();
		});
	});
	
	QUnit.test("when getting an available elements specific Group,", function(assert) {
		var done = assert.async();
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oModel = oView.getContent()[0].getModel().getMetaModel().oModel;
		//EntityType02 has 6 properties and 4 bound
		//EntityType01 has 5 properties
		var oSmartFormXML = oView._xContent.querySelector("[id=GroupEntityType02]");
		var reg =/\{([^}]+)\}/g;
		var sSmartForm = new XMLSerializer().serializeToString(oSmartFormXML);
		var aBoundElements = sSmartForm.match(reg);
	
		var oBoundFields = {};
		for (var i = 0; i < aBoundElements.length; i++) {
			var sName = aBoundElements[i].replace("{", "").replace("}", "");
			if (sName.indexOf("i18n") !== 0 ) { // don't check i18 data bindings
				oBoundFields[sName] = sName;		
			}
		}
		var oGroup2 = oSmartForm.getGroups()[1];
		var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroup2);
		oAnalyzer.prepare().then(function() {
			var mAvailableElements = oAnalyzer.getAvailableElements();
			var mHiddenElements = oAnalyzer.getHiddenElements();
			assert.ok(Object.keys(mAvailableElements).length === (6 - Object.keys(oBoundFields).length) , "the correct number of available elements are found");
			// 5 properties from EntityType01 and 4 already bound in view
			assert.ok(Object.keys(mHiddenElements).length === (5 + 4), "the correct number of hidden elements are found");
			done();
		});
	});
	
	QUnit.test("when calling getBoundEntityType with a selected groupelement or group,", function(assert) {
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oGroup1 = oSmartForm.getGroups()[0];
		var oGroup2 = oSmartForm.getGroups()[1];
		var oAnalyzer1 = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroup1);
		var oAnalyzer2 = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroup2);

		var sBoundEntityType01 = oAnalyzer1.getBoundEntityType();
		var sBoundEntityType02 = oAnalyzer2.getBoundEntityType();
		assert.equal(sBoundEntityType01, "EntityType01", "then it returns the right bound entity type name");
		assert.equal(sBoundEntityType02, "EntityType02", "then it returns the right bound entity type name");
		//Also check when a groupelement has an absolute binding path
		var oGroupElement = new sap.ui.comp.smartform.GroupElement();
		var oSmartField = new sap.ui.comp.smartfield.SmartField();
		oGroupElement.setBindingContext(oGroup2.getBindingContext());
		oSmartField.bindProperty("value", "EntityType02_Property01");
		oGroupElement.addField(oSmartField);
		oGroupElement.invalidate();
		oGroup1.addGroupElement(oGroupElement);
		var oAnalyzer3 = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oGroupElement);
		var sBoundEntityType03 = oAnalyzer3.getBoundEntityType();
		assert.equal(sBoundEntityType03, "EntityType01", "then it returns the right bound entity type name");
	});
	
	
	QUnit.test("when renaming an smart element ,", function(assert) {
		var done = assert.async();
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oGroupElement1 = oSmartForm.getGroups()[0].getGroupElements()[0];
		oGroupElement1.setVisible(false);
		oGroupElement1.getLabelControl().setText("RenamedLabel");
		//ComplexType binding element
		var oGroupElement2 = oSmartForm.getGroups()[1].getGroupElements()[0];
		oGroupElement2.setVisible(false);
		oGroupElement2.getLabelControl().setText("RenamedLabel");
		sap.ui.getCore().applyChanges();

		var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oSmartForm);
		oAnalyzer.prepare().then(function() {
			var bRenamedLabelFound = false;
			var aAvailableElements = oAnalyzer.getAvailableElements();
			for (var sKey in aAvailableElements) {
				var oField = aAvailableElements[sKey];
				if (oField["fieldLabel"] === "RenamedLabel") {
					bRenamedLabelFound = true;
				}
			}
			var bRenamedComplexLabelFound = false;
			//Hidden because it is within another entityType
			var mHiddenElements = oAnalyzer.getHiddenElements();
			for (var sKey in mHiddenElements) {
				var oField = mHiddenElements[sKey];
				if (oField["fieldLabel"] === "RenamedLabel") {
					bRenamedComplexLabelFound = true;
				}
			}
			assert.ok(bRenamedLabelFound, "then the Renamed label of an afterwards removed element was changed in the available elements as well");
			assert.ok(bRenamedComplexLabelFound, "then the Renamed label of an complex element was changed in the hidden elements as well");
			done();
		});
	});
	
	QUnit.module("Given that a SmartForm with bindings is given", {
		beforeEach : function(assert) {
			oView = renderComplexView();
		},
		afterEach : function(assert) {
			oView.destroy();
		}
	});
	
	QUnit.test("when a SmartForm with a ignored complex Property is given,", function(assert) {
		var oSmartForm = sap.ui.getCore().byId("idMain1--MainForm");
		var oAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory.getControlAnalyzerFor(oSmartForm);
		oSmartForm.setIgnoredFields("complexName.propertyName");
		var oElement = {
				complexTypePropertyName : "complexName",
				isComplexProperty : true,
				name : "propertyName"
		}
		var bFiltered = oAnalyzer._getRules()["excludeIgnoredFields"](oElement);
		assert.ok(bFiltered, "then this complex property is filtered out");
		
	});

	function renderComplexView() {
		var done = assert.async();
		var oView = sap.ui.xmlview("idMain1", "sap.ui.rta.test.ComplexTest");
		var oEventDelegate = {
			onAfterRendering : function() {
				oView.removeEventDelegate(oEventDelegate);
				setTimeout(function() {
					done();
				},10)
			}
		};
		oView.addEventDelegate(oEventDelegate);
		oView.placeAt("test-view");
		sap.ui.getCore().applyChanges();
		return oView;
	}
})();