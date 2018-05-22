sap.ui.require(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integrations/ManageProducts_new/pages/Common",
                "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaModel", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaDataStore", 
                "sap/ui/test/matchers/AggregationLengthEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText"],
	function(Opa5, Common, 
				OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore, 
				AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Press, EnterText) {
		"use strict";
		
		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--"
		
		var PRODUCT_ENTITY_TYPE = "STTA_PROD_MAN.STTA_C_MP_ProductType";
		var PRODUCT_ENTITY_SET = "STTA_C_MP_Product";
		
		OpaModel.metaModel.loaded().then(function(){
			var oProductType = OpaModel.getEntityType(PRODUCT_ENTITY_TYPE);	
			
			Opa5.createPageObjects({
				onTheListReportPage: {
					baseClass: Common,
					actions: {
						iClickTheGoButton: function() {
							return this.waitFor({
								controlType: "sap.m.Button",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
							           new PropertyStrictEquals({
							        	   name: "text",
							        	   value: "Go"
							           }),
							           new PropertyStrictEquals({
							        	   name: "enabled",
							        	   value: true
							           })
								],
								actions: new Press(),
								errorMessage: "The 'Go' button is not rendered correctly"
							});
						},
						iClickTheFiltersButton: function() {
							return this.waitFor({
								controlType: "sap.m.Button",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
									   function(oControl) {
										   return (oControl.getText().indexOf("Filters") > -1);
									   }
								],
								actions: new Press(),
								errorMessage: "The 'Filters' button is not rendered correctly"
							});
						},
						iClickTheCreateButton: function() {
							return this.iClickTheButtonWithId(PREFIX_ID + "addEntry", "Create");
						},
						iSetTheFilterField: function(sFieldId, sValue) {
							return this.waitFor({
								id: PREFIX_ID + "listReportFilter-filterItem-___INTERNAL_-" + sFieldId,
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								actions: function(oControl) {
									var oInput = Opa5.getWindow().sap.ui.getCore().byId(oControl.getLabelFor());
									oInput.setValue(sValue);
									oInput.fireChange();
								},
						        errorMessage: "The Filter selection field for " + sFieldId + " is not rendered correctly. "
							});
						},
						iSetTheFilterFieldEditingStatus: function(iIndex) {
							return this.waitFor({
								id: PREFIX_ID + "editStateFilter",
								actions: [
							          function(oControl) {
							        	  var aItems = oControl.getAggregation("items");
							        	  oControl.setSelectedItem(aItems[iIndex]);
							        	  oControl.fireChange();
							          }
								],
								errorMessage: "The Filter selection field 'Editing Status' is not rendered correctly. "
							});
						},
						iClickTheItemInTheTable: function(iIndex) {
							return this.waitFor({
								id: PREFIX_ID + "responsiveTable",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
							           new AggregationFilled({
							        	   name: "items"
							           })
								],
								actions: function(oControl) {
									var oFilterBar = oControl.getParent().getParent().getItems()[0];
									OpaDataStore.setData("filterData",  oFilterBar.getFilterData());
	
									var oItem = oControl.getItems()[iIndex];
									OpaDataStore.setData("tableItems",  oControl.getItems());
									OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
									
									oItem.firePress();
								},
								errorMessage: "The Responsive Table is not rendered correctly"
							});
						},
						iSelectADraftItemInTheTable: function () {
							return this.waitFor({
								id: PREFIX_ID + "responsiveTable",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [new AggregationFilled({ name : "items" })],
								actions: function (oTable) {
									var aItems = oTable.getItems(), 
										oModel = aItems[0].getModel();
									
									for (var i = 0; i < aItems.length; i++) {
										var oEntity = oModel.getProperty(aItems[i].getBindingContext().getPath());
										
										if (!oEntity.IsActiveEntity) {
											oTable.setSelectedItem(aItems[i]);
											OpaDataStore.setData("selectedItem", aItems[i]);
											break;
										}
									}
								},
								errorMessage: "The Responsive Table is not rendered correctly"
							});
						},
						iClickTheDeleteButton: function () {
							return this.iClickTheButtonWithId(PREFIX_ID + "deleteEntry", "Delete");
						},
						iWaitForTheDeleteDialogAndPressTheConfirmationButton: function () {
							return this.waitFor({
								controlType: "sap.m.Dialog",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [new PropertyStrictEquals({ name : "state", value: "Warning" }),],
								actions: function (oDialog) {
									OpaDataStore.setData("itemToBeDeleted", OpaDataStore.getData("selectedItem"));
									oDialog.getBeginButton().firePress();
								},
								errorMessage: "The Delete Dialog is not rendered correctly"
							});
						}
					},
					
					assertions: {
						thePageShouldContainTheCorrectTitle: function() {
							return this.waitFor({
								controlType: "sap.m.semantic.FullscreenPage",
								matchers: new PropertyStrictEquals({
									name: "title",
									value: OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("PAGEHEADER") // application-defined title
								}),
								success: function() {
									Opa5.assert.ok(true, "The List Report title is correct");
								},
								errorMessage: "The List Report title is not correct"
							});
						},
						theFilterBarIsRenderedCorrectly: function() {
							return this.waitFor({
								id: PREFIX_ID + "listReportFilter",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
								           new PropertyStrictEquals({
								        	   name: "enableBasicSearch",
								        	   value: !(OpaModel.getEntitySet(PRODUCT_ENTITY_SET)["sap:searchable"] === 'false')
								           }),
								           new AggregationFilled({
								        	   name: "controlConfiguration"
								           })
								],
								success: function(oControl) {
									Opa5.assert.ok(true, "The Smart Filter Bar has basic search enabled");
									
									// check the control configurations
									var oSmartFilterBar = oControl;
									var aSelectionField = oProductType["com.sap.vocabularies.UI.v1.SelectionFields"];
									var iExpectedControlConfigurations = aSelectionField.length + 2; // EditState and CustomPriceFilter selection fields.
									var aConfiguration = jQuery.grep(oSmartFilterBar.getAggregation("controlConfiguration"), function(oConfiguration) {
										var sKey = oConfiguration.getProperty("key");
										// check the selection fields
										for (var i=0; i<aSelectionField.length; i++) {
											if (sKey = aSelectionField[i].PropertyPath.replace('/', '.')) {
												return true;
											}
										}
										return (sKey === "EditState" || sKey === "CustomPriceFilter" /*breakout*/);
									});
							
									Opa5.assert.equal(aConfiguration.length, iExpectedControlConfigurations, "The Smart Filter Bar has " + iExpectedControlConfigurations + " control configurations");
									Opa5.assert.deepEqual(aConfiguration, oSmartFilterBar.getAggregation("controlConfiguration"), "The Smart Filter Bar has the correct control configurations");								
								},
								errorMessage: "The Smart Filter Bar is not rendered correctly"
							});
						},
						theFilterSelectionFieldWhenDraftIsEnabledIsRenderedCorrectly: function() {
							return this.waitFor({
								id: PREFIX_ID + "editStateFilter",
								success: function(oControl) {
									var aItems = oControl.getAggregation("items");
									Opa5.assert.equal(aItems.length, 5, "When draft is enabled, the combobox for the 'Editing Status' filter selection field has the correct number of items");
									Opa5.assert.equal(aItems[0].getText(), OpaResourceBundle.template.ListReport.getProperty("ALL_OBJECTS"),"1st item in the Editing Status Combobox is correct");
									Opa5.assert.equal(aItems[1].getText(), OpaResourceBundle.template.ListReport.getProperty("DRAFT_OBJECT_FILTER"),"2nd item in the Editing Status Combobox is correct");
									Opa5.assert.equal(aItems[2].getText(), OpaResourceBundle.template.ListReport.getProperty("LOCKED_OBJECT_FILTER"),"3rd item in the Editing Status Combobox is correct");
									Opa5.assert.equal(aItems[3].getText(), OpaResourceBundle.template.ListReport.getProperty("UNSAVED_CHANGES_FILTER"),"4th item in the Editing Status Combobox is correct");
									Opa5.assert.equal(aItems[4].getText(), OpaResourceBundle.template.ListReport.getProperty("NO_CHANGES"),"5th item in the Editing Status Combobox is correct");
								},
								errorMessage: "When draft is enabled, the combobox for the 'Editing Status' filter selection field is not rendered correctly"
							});
						},
						theFilterSelectionFieldWhenForABreakoutIsRenderedCorrectly: function() {
							return this.waitFor({
								id: PREFIX_ID + "CustomPriceFilter-combobox",
								success: function(oControl) {
	
									var aItems = oControl.getAggregation("items");
									Opa5.assert.equal(aItems.length, 4, "The combobox for the 'Price' breakout filter selection field has the correct number of items");
									Opa5.assert.equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_0-100"),"1st item in the Price Combobox is correct");
									Opa5.assert.equal(aItems[1].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_100-500"),"2nd item in the Price Combobox is correct");
									Opa5.assert.equal(aItems[2].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_500-1000"),"3rd item in the Price Combobox is correct");
									Opa5.assert.equal(aItems[3].getText(), OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xtit.Price_GE1000"),"4th item in the Price Combobox is correct");
								},
								errorMessage: "The combobox for the 'Price' filter breakout selection field is not rendered correctly"
							});
						},
						theFiltersButtonHasTheCorrectNumber: function(iFilters) {
							var expectedText = "Filters"
							if (iFilters && iFilters > 0) {
								expectedText += " (" + iFilters + ")";
							}
							
							return this.waitFor({
								controlType: "sap.m.Button",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
							           new PropertyStrictEquals({
							        	   name: "text",
							        	   value: expectedText
							           })
								],
								success: function(oControl) {
									Opa5.assert.ok(true, "The 'Filters' button is rendered correctly" )
								},
								errorMessage: "The 'Filters' button is not rendered correctly"
							});
						},
						theSmartTableIsRenderedCorrectly: function() {
							return this.waitFor({
								controlType: "sap.ui.comp.smarttable.SmartTable",
								id: PREFIX_ID + "listReport",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
								           new PropertyStrictEquals({
								        	   name: "header",
								        	   value: oProductType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeNamePlural.String
								           }),
								           new PropertyStrictEquals({
								        	   name: "useVariantManagement",
								        	   value: true
								           })
								],
								success: function(oControl) {
									Opa5.assert.ok(true,"The Smart Table has the correct header title.");
									Opa5.assert.ok(true,"The Smart Table has Variant Management enabled.");
									
									var oSmartTable = oControl;
									var oTable = oSmartTable.getTable();
									var aColumn = oTable.getColumns();
									
									// columns from annotations
									var aAnnotationColumn = jQuery.grep(oProductType["com.sap.vocabularies.UI.v1.LineItem"], function(oRecord){
										return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" || ((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
									});
									
									for(var i=0; i < aAnnotationColumn.length; i++) {
										var sExpectedLabel = "";
										if (aAnnotationColumn[i].RecordType === "com.sap.vocabularies.UI.v1.DataField") {
											sExpectedLabel = OpaModel.getEntityProperty(oProductType, aAnnotationColumn[i].Value.Path)["com.sap.vocabularies.Common.v1.Label"].String;
										} else {
											sExpectedLabel = aAnnotationColumn[i].Label.String;
										}
										var sActualLabel = aColumn[i].getHeader().getText();
										
										Opa5.assert.equal(sActualLabel, sExpectedLabel, "The label " + sActualLabel + " is correctly displayed");
									}
									
									// columns from breakouts
									var sExpectedRatingLabel = OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xfld.Rating");
									Opa5.assert.equal(aColumn[aAnnotationColumn.length].getHeader().getText(), sExpectedRatingLabel, "The Rating (breakout) column is correctly displayed");
									var sExpectedBreakoutColumnLabel = OpaResourceBundle.demokit.stta_manage_products.ListReport.getProperty("xfld.BreakoutColumn");
									Opa5.assert.equal(aColumn[aAnnotationColumn.length+1].getHeader().getText(), sExpectedBreakoutColumnLabel, "The breakout column is correctly displayed");
									
								},
								error: "The Smart Table is not rendered correctly"
							});
						},
						theCustomToolbarForTheSmartTableIsRenderedCorrectly: function() {
							return this.waitFor({
								controlType: "sap.m.OverflowToolbar",
								matchers: [
								           new PropertyStrictEquals({
								        	   name: "design",
								        	   value: "Transparent"
								           })
								],
								success: function(aControl) {
									Opa5.assert.ok(true, "The OverflowToolbar has its design set to 'Transparent'");
									
									var aButton = jQuery.grep(aControl[0].getContent(), function(oControl) {
										return oControl.getMetadata().getName() === "sap.m.Button";
									});
									
									var mProductBreakoutActions = OpaManifest.demokit["sample.stta.manage.products"]
																	.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ListReport.view.ListReport/sap.ui.generic.app/STTA_C_MP_Product/Actions/");
									var sChangePriceText = mProductBreakoutActions.ChangePrice.text;
									var sCopyNewSupplierText = mProductBreakoutActions.CopyWithNewSupplier.text;
									
									// buttons from breakouts
									Opa5.assert.equal(aButton[0].getText(), sChangePriceText, "The Change Price button is rendered correctly");
									Opa5.assert.equal(aButton[1].getText(), sCopyNewSupplierText, "The Copy with new supplier button is rendered correctly");
									
									// buttons from annotations
									var aExpectedButton = jQuery.grep(oProductType["com.sap.vocabularies.UI.v1.LineItem"], function(oRecord){
										return ((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && !oRecord.Inline);
									}); 
									Opa5.assert.equal(aButton[2].getText(), aExpectedButton[0].Label.String, "The " + aExpectedButton[0].Label.String + " button is rendered correctly");
									Opa5.assert.equal(aButton[3].getText(), aExpectedButton[1].Label.String, "The " + aExpectedButton[1].Label.String + " button is rendered correctly");
	
									// button for variant management
									var aSmartVariantManagement = jQuery.grep(aControl[0].getContent(), function(oControl) {
										return oControl.getMetadata().getName() === "sap.ui.comp.smartvariants.SmartVariantManagement";
									});
									Opa5.assert.ok(aSmartVariantManagement.length === 1, "The Variant is rendered correctly");
	
									// button for settings
									var aOverflowToolbarButton = jQuery.grep(aControl[0].getContent(), function(oControl) {
										return oControl.getMetadata().getName() === "sap.m.OverflowToolbarButton";
									});
									
									Opa5.assert.equal(aOverflowToolbarButton[0].getText(), "Create New Product", "The Create New Product button is rendered correctly");
								},
								error: "The Smart Table Toolbar is not rendered correctly"
							});
						},
						theResponsiveTableInsideTheSmartTableIsRenderedCorrrectly: function() {
							var aMatchers = [
									new PropertyStrictEquals({
										name: "fixedLayout",
										value: false
									}),
									new PropertyStrictEquals({
										name: "growing",
										value: true
									}),
									new PropertyStrictEquals({
										name: "growingScrollToLoad",
										value: true
									}),
									new PropertyStrictEquals({
										name: "growingThreshold",
										value: 25
									})
							];
							var fnSuccess = function(oControl) {
								Opa5.assert.ok(true, "The Responsive Table inside the Smart Table has rendered correctly");
								
								var sMode = OpaManifest.demokit["sample.stta.manage.products"].getProperty("/sap.ui.generic.app/pages/0/component/settings/multiSelect") ? "MultiSelect" : "Single";
								Opa5.assert.equal(oControl.getMode(), sMode, "The Responsive Table's Mode is correct");
							};
							
							return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
						},
						theResponsiveTableIsFilledWithItems: function(iItems) {
							var aMatchers = [
				                 new AggregationFilled({ 
				                	 name: "items"
				                 })
							];
							var fnSuccess = function(oControl) {
								var actualItems = oControl.getItems();
								Opa5.assert.equal(actualItems.length, iItems, "All the items are present in the table");
							};
							
							return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
						}, 
						theResponsiveTableHeaderHastheCorrectNumberOfItems: function(iNumberOfItems) {
							var sExpectedText = oProductType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeNamePlural.String + " ({*})";
							sExpectedText = (iNumberOfItems) ? sExpectedText.replace("{*}", iNumberOfItems) : sExpectedText.replace("{*}", "0"); 
				           
							return this.waitFor({
								id: PREFIX_ID + "listReport-header",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: [
							           new PropertyStrictEquals({
							        	   name: "text",
							        	   value: sExpectedText
							           })
								],
								success: function(oControl) {
									Opa5.assert.ok(true, "The table has the right number of items: " + iNumberOfItems);
								},
								errorMessage: "The Smart Table is not rendered correctly"
							});
						},
						theResponsiveTableContainsTheCorrectItems: function(mSelection) {
							var aMatchers = [
				                 new AggregationFilled({ 
				                	 name: "items"
				                 })
							];
							var fnSuccess = function(oControl) {
								var actualItems = oControl.getItems();
								
								for(var i=0; i<actualItems.length; i++) {
									var bValid = true;
									var oContext = actualItems[i].getBindingContext();
									var oObject = oContext.getObject(oContext.sPath);
									
									for(var propertyName in mSelection) {
										switch (propertyName) {
										case "EditingStatus":
											// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
											switch(mSelection[propertyName]) {
												case 0:
													break;
												case 1:
													if (!oObject["DraftAdministrativeData"] || oObject["DraftAdministrativeData"] === null ) {
														 bValid = false;	
													} 
													break;
												default:
													break;
											}
											break;
										case "Supplier": 
											if (oObject.to_Supplier.__ref.indexOf(mSelection[propertyName]) < 0) {
												bValid = false;
												Opa5.assert.ok(false, "Item [" + i + "] does not have the property '" + propertyName + "' = " + mSelection[propertyName]);
											}
											break;
										default:
											if(oObject[propertyName] != mSelection[propertyName]) {
												bValid = false;
												Opa5.assert.ok(false, "Item [" + i + "] has property '" + propertyName + "' = " + oObject[propertyName] + " instead of " + mSelection[propertyName]);
											}
											break;
										}
									}
									Opa5.assert.ok(bValid, "Item [" + i + "] meets the Filter selection criteria");
								}
							};
							
							return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
						},
						
						theSelectedItemIsDeleted: function () {
							var fnMatcher = function (oTable) {
								var oItemToBeDeleted = OpaDataStore.getData("itemToBeDeleted");
								return (oTable.indexOfItem(oItemToBeDeleted) === -1 ? true : false);
							};
							var fnSuccess = function () {
								Opa5.assert.ok(true, "1 Draft status item deleted successfully");
							}
							
							return this.waitForResponsiveTableInListReport(fnMatcher, fnSuccess);
						},
						
						// Navigation assertions
						theTableIsInTheSameStateAsBefore: function() {
							var aMatchers = [
				                 new AggregationFilled({ 
				                	 name: "items"
				                 })
							];
							var fnSuccess = function(oControl) {
								var expectedItems = OpaDataStore.getData("tableItems");
								var actualItems = oControl.getItems();
								Opa5.assert.deepEqual(actualItems, expectedItems, "The items in the table are the same as before");
							};
							
							return this.waitForResponsiveTableInListReport(aMatchers, fnSuccess);
						},
						theFilterBarIsInTheSameStateAsBefore: function() {
							return this.waitFor({
								id: PREFIX_ID + "listReportFilter",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								success: function(oControl) {
								   var expectedFilterData = OpaDataStore.getData("filterData");
								   var actualFilterData = oControl.getFilterData();
								   Opa5.assert.deepEqual(actualFilterData, expectedFilterData, "The Smart Filter Data is the same as before");
								},
								errorMessage: "The Smart Filter Bar is not rendered correctly"
							});
						},
						
						// ListReport common assertion function
						waitForResponsiveTableInListReport: function(aMatchers, fnSuccess) {
							return this.waitFor({
								id: PREFIX_ID + "responsiveTable",
								viewName: VIEWNAME,
								viewNamespace: VIEWNAMESPACE,
								matchers: aMatchers,
								success: fnSuccess,
								errorMessage: "The Responsive Table is not rendered correctly"
							});
						}
					}
				}
			});
		});
	}
);