/* global QUnit sinon */

jQuery.sap.require("sap.ui.qunit.qunit-coverage");

jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.ui.comp.smarttable.SmartTable");
jQuery.sap.require("sap.uxap.ObjectPageLayout");

//jQuery.sap.require("sap.ui.comp.library");

(function() {
	jQuery.sap.require("sap.ui.rta.model.ElementPreprocessor");
	QUnit.module("sap.ui.rta.model.ElementPreprocessor", {
		setup: function() {
		},
		teardown: function() {
		}
	});

	QUnit.test("Check that ignored fields are identified correctly with multiple entitysets", function(){
		//Arrange
		this.metaDataStub = sinon.stub(sap.ui.comp.odata, "MetadataAnalyser");
		this.oFieldSelectorModelConverter = new sap.ui.rta.model.ElementPreprocessor();
		this.oFieldSelectorModelConverter._aEntityTypes = ["XYZ", "DEF"];
		var oCurrentField1 = {name:"ABC", entityName:"XYZ"};
		var oCurrentField2 = {name:"ABC"};
		var oCurrentField3 = {name:"GHI", entityName:"DEF"};

		var aIgnoredFieldsList = ["ABC", "DEF.GHI"];

		//Act
		var result1 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField1, aIgnoredFieldsList);
		var result2 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField2, aIgnoredFieldsList);
		var result3 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField3, aIgnoredFieldsList);

		//Assert
		equal(result1, false); //not in ignore list
		equal(result2, false); //must be fully qualified
		equal(result3, true);	//Is fully qualified

		this.metaDataStub.restore();

	});

	QUnit.test("Check that ignored fields are identified correctly with one entityset", function(){
		//Arrange
		this.metaDataStub = sinon.stub(sap.ui.comp.odata, "MetadataAnalyser");
		this.oFieldSelectorModelConverter = new sap.ui.rta.model.ElementPreprocessor();
		this.oFieldSelectorModelConverter._aEntityTypes = ["XYZ"];
		var oCurrentField1 = {name:"ABC", entityName:"XYZ"};
		var aIgnoredFieldsList1 = ["ABC", "DEF.GHI"];

		var oCurrentField2 = {name:"ABC", entityName:"XYZ"};
		var aIgnoredFieldsList2 = ["XYZ.ABC", "DEF.GHI"];

		//Act
		var result1 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField1, aIgnoredFieldsList1);
		var result2 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField2, aIgnoredFieldsList2);

		//Assert
		equal(result1, true); //identified without fully qualified name
		equal(result2, true); //identified with fully qualified name

		this.metaDataStub.restore();

	});

	QUnit.test("Check that with empty ignored fields list all nothing happens", function(){
		//Arrange
		this.metaDataStub = sinon.stub(sap.ui.comp.odata, "MetadataAnalyser");
		this.oFieldSelectorModelConverter = new sap.ui.rta.model.ElementPreprocessor();
		this.oFieldSelectorModelConverter._aEntitySets = ["XYZ"];
		var oCurrentField1 = {name:"ABC", entityName:"XYZ"};
		var aIgnoredFieldsList1 = [];

		var oCurrentField2 = {name:"ABC", entityName:"XYZ"};
		var aIgnoredFieldsList2 = [];

		//Act
		var result1 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField1, aIgnoredFieldsList1);
		var result2 = this.oFieldSelectorModelConverter._isFieldOnIgnoreList(oCurrentField2, aIgnoredFieldsList2);

		//Assert
		equal(result1, false); //identified without fully qualified name
		equal(result2, false); //identified with fully qualified name

		this.metaDataStub.restore();

	});

	QUnit.test("Validate that method to detect complex fields works.", function(){
		//Arrange
		var oFieldType_SimpleInValid1 = {type:"Edm.String"};
		var oFieldType_SimpleInValid2 = {type:"EDM.DECIMAL"};
		var oFieldType_ComplexValid1 = {type:"ABC"};
		var oFieldType_ComplexValid2 = {type:"ABC.EDM"};

		this.oFieldSelectorModelConverter = new sap.ui.rta.model.ElementPreprocessor();

		//Act
		var bSV1 = this.oFieldSelectorModelConverter._isComplexType(oFieldType_SimpleInValid1);
		var bSV2 = this.oFieldSelectorModelConverter._isComplexType(oFieldType_SimpleInValid2);
		var bCV1 = this.oFieldSelectorModelConverter._isComplexType(oFieldType_ComplexValid1);
		var bCV2 = this.oFieldSelectorModelConverter._isComplexType(oFieldType_ComplexValid2);

		//Assert
		equal(bSV1, false, "Simple type should not be detected by this method");
		equal(bSV2, false, "Simple type should not be detected by this method");
		equal(bCV1, true, "Complex type should be detected by this method");
		equal(bCV2, true, "Complex type should be detected by this method");

	});

	QUnit.test("_updateAndFilterFields adds invisible fields to the model converters list of invisible fields", function(assert){
		this.oFieldSelectorModelConverter = new sap.ui.rta.model.ElementPreprocessor();

		var oVisibleField = {
				"name": "someName1",
				"type": "edmSomeNotBlacklistedSimpleType",
				visible: true
		};
		var oInvisibleField = {
				"name": "someName2",
				"type": "edmSomeNotBlacklistedSimpleType",
				visible: false
		};
		var aFields = [oInvisibleField, oVisibleField];
		var aIgnoredFields = [];
		var bIsComplexType = false;
		var sKey = "aKey";

		this.oFieldSelectorModelConverter._updateAndFilterFields(aFields, aIgnoredFields, bIsComplexType, sKey);

		assert.equal(this.oFieldSelectorModelConverter.invisibleFields[sKey].length, 1);
		assert.equal(this.oFieldSelectorModelConverter.invisibleFields[sKey][0], oInvisibleField);
	});

}());
