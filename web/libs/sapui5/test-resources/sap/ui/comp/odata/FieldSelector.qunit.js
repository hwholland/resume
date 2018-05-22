(function() {
    jQuery.sap.require("sap.ui.comp.odata.FieldSelector");
    //Mock Data
//  		var oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
//  		var oODataMetadata = sinon.createStubInstance(sap.ui.model.odata.ODataMetadata);
//  		oODataMetadata.isLoaded.returns(true);
//  		oODataMetadata.getServiceMetadata.returns(oMetadata);

//			The following line of code does not work with the latest version of sap.ui.model.odata.ODataMetaModel.
//			See jsdoc of sap.ui.model.odata.ODataMetaModel:
//			The constructor of sap.ui.model.odata.ODataMetaModel is privat and not allowed to use,
//			but rather use {@link sap.ui.model.odata.ODataModel#getMetaModel} instead!
//			Without the following line the first test does not work and therefore it was commented out.
//  		oModel.getMetaModel.returns(new sap.ui.model.odata.ODataMetaModel(oODataMetadata));
    module("sap.ui.comp.odata.FieldSelector", {
        setup: function() {
            this.oFieldSelector = new sap.ui.comp.odata.FieldSelector();
        },
        teardown: function() {
            this.oFieldSelector.exit();
        }
    });

//              test("Shall set the model with the entity sets", function() {
//             	 	this.oFieldSelector.setModel(oModel, "COMPANY, COUNTRY, REGION");

//             	 	var oContent = this.oFieldSelector.getContent();
//                     ok(oContent);
//                     var iEntityTypes = 0;
//                     jQuery.each(this.oFieldSelector._oFieldController._oFields, function(key, value) {
//                      	iEntityTypes++;
//                      	if(key === "COMPANY") {
//                      		equal(value.length, 4);
//                      	}
//                      	if(key === "COUNTRY") {
//                      		equal(value.length, 2);
//                      	}
//                      	if(key === "REGION") {
//                      		equal(value.length, 3);
//                      	}
//                      });

//                     equal(iEntityTypes, 3, "3 entity sets are in place");
//                     equal(this.oFieldSelector._sSelectedKey, "COMPANY", "first entity should be the selected one");
// 			});

    test("Shall update field label for a bound odata service field", function() {
        // Arrange
        var oFields = {
            'Header': [
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Document Number',
                    'name': 'AccountingDocument'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Company Code',
                    'name': 'CompanyCode'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Document Date',
                    'name': 'DocumentDate'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Fiscal Year',
                    'name': 'FiscalYear'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Ledger Group',
                    'name': 'LedgerGroup'
                },
                {
                    'id': 'sv98',
                    'fieldLabel': 'Posting Date',
                    'name': 'PostingDate'
                }
            ]
        };
        var oFieldSelectorControllerGetFieldsStub = sinon.stub(sap.ui.comp.odata.FieldSelectorController.prototype, "getFields").returns(oFields);
        var oFieldSelectorControllerSortFieldsForEntityStub  = sinon.stub(sap.ui.comp.odata.FieldSelectorController.prototype, "sortFieldsForEntity");
        var oFieldSelectorUpdateTableDataStub = sinon.stub(sap.ui.comp.odata.FieldSelector.prototype,"_updateTableData");

        // Act
        this.oFieldSelector.updateFieldLabel({ bindingPaths: [ { 'path': 'Header/CompanyCode' } ], label:'Company Code Renamed', isBoundToODataService: true });

        // Assert
        equal(oFields['Header'][1].fieldLabel, 'Company Code Renamed');

        // Rearrange
        oFieldSelectorControllerGetFieldsStub.restore();
        oFieldSelectorControllerSortFieldsForEntityStub.restore();
        oFieldSelectorUpdateTableDataStub.restore();
    });

    test("Shall update field label for a non bound odata service field", function() {
        // Arrange
        var oFields = {
            'Header': [
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Document Number',
                    'name': 'AccountingDocument'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Company Code',
                    'name': 'CompanyCode'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Document Date',
                    'name': 'DocumentDate'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Fiscal Year',
                    'name': 'FiscalYear'
                },
                {
                    'entityName': 'Header',
                    'fieldLabel': 'Ledger Group',
                    'name': 'LedgerGroup'
                },
                {
                    'id': 'sv98',
                    'fieldLabel': 'Posting Date',
                    'name': 'PostingDate'
                }
            ]
        };
        var oFieldSelectorControllerGetFieldsStub = sinon.stub(sap.ui.comp.odata.FieldSelectorController.prototype, "getFields").returns(oFields);
        var oFieldSelectorControllerSortFieldsForEntityStub  = sinon.stub(sap.ui.comp.odata.FieldSelectorController.prototype, "sortFieldsForEntity");
        var oFieldSelectorUpdateTableDataStub = sinon.stub(sap.ui.comp.odata.FieldSelector.prototype,"_updateTableData");

        // Act
        this.oFieldSelector.updateFieldLabel({ id: 'sv98', label:'Posting Date Renamed', isBoundToODataService: false });

        // Assert
        equal(oFields['Header'][5].fieldLabel, 'Posting Date Renamed');

        // Rearrange
        oFieldSelectorControllerGetFieldsStub.restore();
        oFieldSelectorControllerSortFieldsForEntityStub.restore();
        oFieldSelectorUpdateTableDataStub.restore();
    });

    test("hides rows with empty labels", function () {
        var sSelectedKey = "selectedKey";
        var oMockedFieldsData = {};
        oMockedFieldsData[sSelectedKey] = [
            {fieldLabel: "notEmpty"},
            {fieldLabel: ""},
            {fieldLabel: "alsoNotEmpty"}
        ];
        this.oFieldSelector._sSelectedKey = sSelectedKey;

        sinon.stub(this.oFieldSelector._oFieldController, "getFields").returns(oMockedFieldsData);

        this.oFieldSelector._updateTableData();

        var oTableItems = this.oFieldSelector._oTable.getItems();
        ok(oTableItems[0].getVisible(), "first list item should be visible");
        ok(!oTableItems[1].getVisible(), "second list item should be hidden");
        ok(oTableItems[2].getVisible(), "third list item should be visible");
    });

	QUnit.module('sap.ui.comp.odata.FieldSelector._tooltipBinding', {
		beforeEach: function() {
			this.oFieldSelector = new sap.ui.comp.odata.FieldSelector();
			this.tooltipBinding = sap.ui.comp.odata.FieldSelector._tooltipBinding;
			this.label = new sap.m.Label({
				text: this.tooltipBinding
			});
		},
		afterEach: function() {
			this.oFieldSelector.destroy();
			this.label.destroy();
		}
	});

	QUnit.test('should consider the quick info first', function (assert){

		var oData = {
			'com.sap.vocabularies.Common.v1.QuickInfo' : {
				String: 'quickInfo'
			},
			'com.sap.vocabularies.Common.v1.Label': {
				String: 'label'
			}
		};

		createAndBindModel(oData, this.label);

		assert.equal(this.label.getText(), 'quickInfo');
	});

	QUnit.test('should consider the label, if no quick info is available', function (assert){
		// The new label (OData v4) is already available everywhere

		var oData = {
			'com.sap.vocabularies.Common.v1.Label': {
				String: 'label'
			}
		};

		createAndBindModel(oData, this.label);

		assert.equal(this.label.getText(), 'label');
	});

	QUnit.test('should return an empty string, if no quick info and no label is available', function (assert){
		var oData = {};

		createAndBindModel(oData, this.label);

		assert.strictEqual(this.label.getText(), '');
	});

	function createAndBindModel(oData, oControl){
		var oModel = new sap.ui.model.json.JSONModel(oData);

		oControl.setModel(oModel);
		oControl.bindElement('/');
	}

}());
