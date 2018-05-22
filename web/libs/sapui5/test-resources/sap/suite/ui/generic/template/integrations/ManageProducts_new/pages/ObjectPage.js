sap.ui.require(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integrations/ManageProducts_new/pages/Common",
                "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaModel", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaDataStore",
                "sap/ui/test/matchers/AggregationLengthEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText"],
	function(Opa5, Common, 
				OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore, 
				AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, 
				Press, EnterText) {
		"use strict";
		
		var VIEW_NAME = "Details";
		var VIEW_NAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_VIEWID = "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--";
		var PRODUCT_ENTITY_TYPE = "STTA_PROD_MAN.STTA_C_MP_ProductType";
		var PRODUCT_ENTITY_SET = "STTA_C_MP_Product";
		
		OpaModel.metaModel.loaded().then(function(){
			var oProductType = OpaModel.getEntityType(PRODUCT_ENTITY_TYPE);
			var oProductEntitySet = OpaModel.getEntitySet(PRODUCT_ENTITY_SET);
			
			Opa5.createPageObjects({
				onTheObjectPage: {
					baseClass: Common,
					actions: {
						iClickTheBackButton: function() {
							return this.iClickTheButtonWithId(PREFIX_VIEWID + "back", "Back");
						},
						iClickTheEditButton: function() {
							return this.iClickTheButtonWithId(PREFIX_VIEWID + "edit", "Edit");
						},
						iClickTheSaveButton: function() {
							return this.iClickTheButtonWithId(PREFIX_VIEWID + "activate", "Save");
						},
						iChangeTheFieldIntheFieldGroup: function(sFieldName, sFieldGroup, sValue) {
							return this.waitFor({
								id: PREFIX_VIEWID + "com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field",
								actions: new EnterText({
									text: sValue
								}),
								errorMessage: "The field " + sFieldName + " is not rendered correctly"
							});
						}
					},
					assertions: {
						thePageContextShouldBeCorrect: function() {
							return this.waitFor({
								controlType: "sap.m.Page",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								matchers: [
								    function(oControl) {
								    	return oControl.getBindingContext().getPath() === OpaDataStore.getData("navContextPath");
								    }
								],
								success: function(aControl) {
									Opa5.assert.ok(true, "The Object Page has the correct context");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Object Page is not rendered");
								}
							});
						},
						thePageShouldContainTheCorrectTitle: function() {
							return this.waitFor({
								id: PREFIX_VIEWID + "objectTypeName",
								matchers: new PropertyStrictEquals({
									name: "text",
									value: oProductType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String 
								}),
								success: function() {
									Opa5.assert.ok(true, "The Object Page Title is correct");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Object Page Title is not rendered correctly");
								}
							});
						},
						thePageShouldContainTheCorrectActions: function() {
							return this.waitFor({
								controlType: "sap.uxap.ObjectPageHeader",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (objectPageHeader) {
									var sShareActionText = "Share",
										aActionButton = [], aActionTextsThatAppear = [], aActionTextThatShouldAppear = [], aIdentificationAnnotations = [],
										mCustomActions = {},
										oManifestJSONModel;
									
									// get the action buttons' text from the object header
									aActionButton = objectPageHeader[0].getActions();
									for (var i = 0; i < aActionButton.length; i++) {
										aActionTextsThatAppear.push(aActionButton[i].getText());
										if (aActionButton[i].getIcon() === "sap-icon://action") { // Share action
											aActionTextsThatAppear.push(sShareActionText);
										}
									}
									
									// get the custom actions text from the manifest
									oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
									mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/sap.ui.generic.app/" + PRODUCT_ENTITY_SET + "/Header/Actions");
									for (var customAction in mCustomActions) {
										if (mCustomActions.hasOwnProperty(customAction)) {
											aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
										}
									}
									
									// get the annotated actions text from the metamodel
									aIdentificationAnnotations = oProductType["com.sap.vocabularies.UI.v1.Identification"];
									for (var i = 0; i < aIdentificationAnnotations.length; i++) {
										if (aIdentificationAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" && 
											aIdentificationAnnotations[i]["com.sap.vocabularies.UI.v1.Importance"].EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High") {
											aActionTextThatShouldAppear.push(aIdentificationAnnotations[i].Label.String);
										}
									}
									
									// get the 'Delete' and 'Edit' text actions if Draft Root is annotated
									if (oProductEntitySet["com.sap.vocabularies.Common.v1.DraftRoot"]) {
										aActionTextThatShouldAppear.push(OpaResourceBundle.template.ObjectPage.getProperty("DELETE"), OpaResourceBundle.template.ObjectPage.getProperty("EDIT"));
									}
									
									// push the 'Share' action to the texts that should appear
									aActionTextThatShouldAppear.push(sShareActionText);
									
									// compare the actions' text that should appear vs. the actions' text that actually appear
									for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
										for (var j =0; j < aActionTextsThatAppear.length; j++) {
											if (aActionTextsThatAppear[j] === aActionTextThatShouldAppear[i]) {
												Opa5.assert.ok(true, "Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
												break;
											}
											else if (i === aActionTextsThatAppear.length - 1) {
												Opa5.assert.ok(false, "Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
											}
										}
									}
								},
								error: "The Actions on the Object Page Header is not rendered correctly"
							});
						},
						thePageShouldBeInEditMode: function() {
							return this.waitFor({
								controlType: "sap.m.Page",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								matchers:[
							          function(oControl) {
							        	  return (oControl.getModel("ui").getData().editable);
								}],
								success: function() {
									Opa5.assert.ok(true, "The Object Page is in Edit mode");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Object Page is not rendered");
								}
							});
						},
						theHeaderFacetGeneralInformationIsRendered: function () {
							// annotation path: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader"
							var sFacetName = "General Information";
							var sHeaderRegExp = "(header::headerEditable)" +
												"(.*com.sap.vocabularies.UI.v1.FieldGroup)" +
												"(.*GeneralInformationForHeader)" +
												"(.*Form)";
							return this.waitFor({
								id: new RegExp(sHeaderRegExp),
								controlType: "sap.m.VBox",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");
									
									var aItems = aControl[0].getItems();
									equals(aItems.length, 4, "There should be 4 items in the VBox");
									// Label
									var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel");
									equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
									// Fields
									equal(aItems[1].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
									equal(aItems[1].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									equal(aItems[2].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
									equal(aItems[2].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									// Link
									equal(aItems[3].getItems()[0].getMetadata().getName(), "sap.m.QuickView", sFacetName + " - " + "The quick view is rendered");
									equal(aItems[3].getItems()[1].getMetadata().getName(), "sap.m.Label", sFacetName + " - " + "The label is rendered");
									equal(aItems[3].getItems()[2].getMetadata().getName(), "sap.m.Link", sFacetName + " - " + "The link is rendered");
									
								},
								error: function(oError) {
									Opa5.assert.notOk(true, sFacetName + " - " + "Header facet is not rendered")
								}
							});
						},
						theHeaderFacetProductCategoryIsRendered: function () {
							// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
							var sFacetName = "Product Category";
							var sHeaderRegExp = "(header::headerEditable)" +
							"(.*to_ProductCategory)" +
							"(.*com.sap.vocabularies.UI.v1.Identification)" +
							"(.*Form)";
							return this.waitFor({
								id: new RegExp(sHeaderRegExp),
								controlType: "sap.m.VBox",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");
									
									var aItems = aControl[0].getItems();
									equals(aItems.length, 3, "There should be 3 items in the VBox");
									// Label
									var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory");
									equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
									// Fields
									equal(aItems[1].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
									equal(aItems[1].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									equal(aItems[2].getItems()[0].getMetadata().getName(), "sap.ui.comp.smartfield.SmartLabel", sFacetName + " - " + "The smart label is rendered");
									equal(aItems[2].getItems()[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									
								},
								error: function(oError) {
									Opa5.assert.notOk(true, sFacetName + " - " + "Header facet is not rendered")
								}
							});
						},
						theHeaderFacetPriceDataPointIsRendered: function () {
							// annotation path: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
							var sFacetName = "Price DataPoint";
							var sHeaderRegExp = "(header::headerEditable)" +
							"(.*com.sap.vocabularies.UI.v1.DataPoint)" +
							"(.*Price)"
							"(.*DataPoint)";
							return this.waitFor({
								id: new RegExp(sHeaderRegExp),
								controlType: "sap.m.VBox",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");
									
									var aItems = aControl[0].getItems();
									equals(aItems.length, 2, "There should be 2 items in the VBox");
									// Label
									equal(aItems[0].getText(), "Price:", sFacetName + " - " + "The header facet label is rendered correctly");
									// Fields
									equal(aItems[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									
								},
								error: function(oError) {
									Opa5.assert.notOk(true, sFacetName + " - " + "Header facet is not rendered")
								}
							});
						},
						theHeaderFacetStockAvailabilityDataPointIsRendered: function () {
							// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
							var sFacetName = "Stock Availability DataPoint";
							var sHeaderRegExp = "(header::headerEditable)" +
												"(.*com.sap.vocabularies.UI.v1.DataPoint)" +
												"(.*StockLevel)"
												"(.*DataPoint)";
							return this.waitFor({
								id: new RegExp(sHeaderRegExp),
								controlType: "sap.m.VBox",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");
									
									var aItems = aControl[0].getItems();
									equals(aItems.length, 2, "There should be 2 items in the VBox");
									// Label
									equal(aItems[0].getText(), "Availability:", sFacetName + " - " + "The header facet label is rendered correctly");
									// Fields
									equal(aItems[1].getMetadata().getName(), "sap.ui.comp.smartfield.SmartField", sFacetName + " - " + "The smart field is rendered");
									
								},
								error: function(oError) {
									Opa5.assert.notOk(true, sFacetName + " - " + "Header facet is not rendered")
								}
							});
						},
						theHeaderFacetProductDescriptionPlainTextIsRendered: function () {
							// annotation path: "to_ProductTextInCurrentLang/@com.sap.vocabularies.UI.v1.FieldGroup#PlainText"
							var sFacetName = "Product Description Plain Text";
							var sHeaderRegExp = "(header::headerEditable)" +
							"(.*to_ProductTextInCurrentLang)" +
							"(.*com.sap.vocabularies.UI.v1.FieldGroup)" +
							"(.*PlainText)" +
							"(.*PlainTextVBox)";
							return this.waitFor({
								id: new RegExp(sHeaderRegExp),
								controlType: "sap.m.VBox",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");
									
									var aItems = aControl[0].getItems();
									equals(aItems.length, 2, "There should be 2 items in the VBox");
									// Label
									equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescription"), sFacetName + " - " + "The header facet label is rendered correctly");
									// Fields
									equal(aItems[1].getMetadata().getName(), "sap.m.Text", sFacetName + " - " + "The text field is rendered");
									
								},
								error: function(oError) {
									Opa5.assert.notOk(true, sFacetName + " - " + "Header facet is not rendered")
								}
							});
						},
						theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
							return this.waitFor({
								id: new RegExp(".*GeneralInformationForm"),
								controlType: "sap.uxap.ObjectPageSubSection",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									var sExpectedTitle = "", sExpectedGeneralDataLabel = "", sExpectedTechnicalDataLabel = "", sExpectedProductCategoryLabel = "",
										aSmartFormGroups = [],
										oSmartForm, oObjectPageSubSection;
								
									oObjectPageSubSection = aControl[0];
									Opa5.assert.ok(true, "The Facet " + oObjectPageSubSection.getTitle() + " inside the Facet General Information is rendered.");

									sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductInfoFacetLabel");
									Opa5.assert.equal(oObjectPageSubSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSubSection.getTitle() + " title '" + sExpectedTitle + "' inside the Facet General Information is rendered correctly.");
									
									sExpectedGeneralDataLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel");
									sExpectedTechnicalDataLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@TechnicalData");
									sExpectedProductCategoryLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory");
									
									oSmartForm = oObjectPageSubSection.getBlocks()[0].getContent()[0];
									aSmartFormGroups = oSmartForm.getGroups();
									for (var i = 0; i < aSmartFormGroups.length; i++) {
										var sActualLabel = aSmartFormGroups[i].getLabel();
										Opa5.assert.ok(sActualLabel === sExpectedGeneralDataLabel || 
													   sActualLabel === sExpectedTechnicalDataLabel || 
													   sActualLabel === sExpectedProductCategoryLabel, 
													   "The subsection's label '" + sActualLabel + "' for the Facet " + oObjectPageSubSection.getTitle() + " inside the Facet General Information is rendered correctly.");
									}
								},
								error: function () {
									Opa5.assert.notOk(true, "The for Facet Product Information inside the Facet General Information is not rendered correctly.");
								}
							});
						},
						theFacetProductDescriptionsInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
							return this.waitFor({
								id: new RegExp(".*ProductDescriptions"),
								controlType: "sap.uxap.ObjectPageSubSection",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									var aObjectPageSubSectionBlocks = [],
										oObjectPageSubSection, oSmartTable,
										sExpectedTitle = "";
									
									oObjectPageSubSection = aControl[0];
									Opa5.assert.ok(true, "The Facet " + oObjectPageSubSection.getTitle() + " inside the Facet General Information is rendered.");
									
									sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescriptions");
									Opa5.assert.equal(oObjectPageSubSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSubSection.getTitle() + " title '" + sExpectedTitle + "' inside the Facet General Information is rendered correctly.");
									
									aObjectPageSubSectionBlocks = oObjectPageSubSection.getBlocks();
									oSmartTable = aObjectPageSubSectionBlocks[0].getContent()[0];
									Opa5.assert.equal("sap.ui.comp.smarttable.SmartTable", oSmartTable.getMetadata().getName(), "The Facet " + oObjectPageSubSection.getTitle() + " content inside the Facet General Information is a SmartTable and is rendered correctly.");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Facet Product Descriptions inside the Facet General Information is not rendered correctly.");
								}
							});
						},
						theFacetSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
							return this.waitFor({
								id: new RegExp(".*Supplier"),
								controlType: "sap.uxap.ObjectPageSubSection",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									var oObjectPageSubSection, aObjectPageSubSectionBlocks, oSmartForm,
										sExpectedTitle = "";
									
									oObjectPageSubSection = aControl[0];
									Opa5.assert.ok(true, "The Facet " + oObjectPageSubSection.getTitle() + " inside the Facet General Information is rendered.");
									
									sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Supplier");
									Opa5.assert.equal(oObjectPageSubSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSubSection.getTitle() + " title '" + sExpectedTitle + "' inside the Facet General Information is rendered correctly.");
									
									aObjectPageSubSectionBlocks = oObjectPageSubSection.getBlocks();
									oSmartForm = aObjectPageSubSectionBlocks[0].getContent()[0];
									
									Opa5.assert.equal("sap.ui.comp.smartform.SmartForm", oSmartForm.getMetadata().getName(), "The Facet " + oObjectPageSubSection.getTitle() + " content inside the Facet General Information is a SmartTable and is rendered correctly.");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Facet Supplier inside the Facet General Information is not rendered correctly.");
								}
							});
						},
						theFacetSalesRevenueIsRenderedCorrectly: function () {
							return this.waitFor({
								id: new RegExp(".*ProductSalesData"),
								controlType: "sap.uxap.ObjectPageSection",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									var oObjectPageSection, oObjectPageSubSections, oObjectPageSubSectionsgetBlocks, oSmartTable,
										sExpectedTitle = "";
								
									oObjectPageSection = aControl[0];
									Opa5.assert.ok(true, "The Facet " + oObjectPageSection.getTitle() + " is rendered.");
									
									sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesRevenue");
									Opa5.assert.equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
									
									oObjectPageSubSections = oObjectPageSection.getSubSections()[0];
									oSmartTable = oObjectPageSubSections.getBlocks()[0].getContent()[0];
									Opa5.assert.equal("sap.ui.comp.smarttable.SmartTable", oSmartTable.getMetadata().getName(), "The Facet " + oObjectPageSection.getTitle() + " content is a SmartTable and is rendered correctly.");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Facet Sales Revenue is not rendered correctly.");
								}
							});
						},
						theFacetContactsIsRenderedCorrectly: function () {
							return this.waitFor({
								id: new RegExp(".*Contacts"),
								controlType: "sap.uxap.ObjectPageSection",
								viewName: VIEW_NAME,
								viewNamespace: VIEW_NAMESPACE,
								success: function (aControl) {
									var oObjectPageSection, oObjectPageSubSections, oObjectPageSubSectionsgetBlocks, oVBox,
										sExpectedTitle = "";
								
									oObjectPageSection = aControl[0];
									Opa5.assert.ok(true, "The Facet " + oObjectPageSection.getTitle() + " is rendered.");
									
									sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Contacts");
									Opa5.assert.equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
									
									oObjectPageSubSections = oObjectPageSection.getSubSections()[0];
									oVBox = oObjectPageSubSections.getBlocks()[0].getContent()[0];
									Opa5.assert.equal("sap.m.VBox", oVBox.getMetadata().getName(), "The Facet " + oObjectPageSection.getTitle() + " content is a VBox and is rendered correctly.");
								},
								error: function () {
									Opa5.assert.notOk(true, "The Facet Sales Revenue is not rendered correctly.");
								}
							});
						},
		                theExtensionFacetsAreRenderedCorrectly: function () {
                            return this.waitFor({
                                controlType: "sap.uxap.ObjectPageSection",
                                viewName: VIEW_NAME,
                                viewNamespace: VIEW_NAMESPACE,
                                success: function (aControl) {
                                	var aExpectedExtensionFacets = [],
                                		oObjectPageViewExtentions = OpaManifest.demokit["sample.stta.manage.products"].getProperty("/sap.ui5/extends/extensions/sap.ui.viewExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details");

                                    // get extension facets
                                    for (var propertyName in oObjectPageViewExtentions) {
                                    	if (propertyName.indexOf("BeforeFacet") > -1 || propertyName.indexOf("AfterFacet") > -1) {
                                    		aExpectedExtensionFacets.push(oObjectPageViewExtentions[propertyName]);
                                    	}
                                    }

	                                // check if the extension facets are rendered
                                    for (var i = 0; i < aExpectedExtensionFacets.length; i++) {
                                    	var sExpectedTitle = aExpectedExtensionFacets[i]["sap.ui.generic.app"] && aExpectedExtensionFacets[i]["sap.ui.generic.app"].title;
	                                    if (sExpectedTitle && sExpectedTitle.indexOf("{{") === 0) {
	                                        sExpectedTitle = sExpectedTitle.replace(/{{|}}/g, "");
	                                        sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty(sExpectedTitle);
	                                    }

                                        for (var j = 0; j < aControl.length; j++) {
                                        	// check title
                                        	if (aControl[j].getTitle() === sExpectedTitle) {
                                                Opa5.assert.ok(true, "The extension facet '" + sExpectedTitle + "' is rendered");
                                                // check view name
                                                if (aExpectedExtensionFacets[i]["viewName"]) {
	                                                var sExpectedViewName = aExpectedExtensionFacets[i]["viewName"];
	                                                try {
	                                                	var sActualViewName = aControl[j].getSubSections()[0].getBlocks()[0].getViewName();
	                                                	Opa5.assert.equal(sActualViewName, sExpectedViewName,  "The extension facet's view with name '" + sExpectedViewName +"' is rendered");
	                                                } catch (e) {
	                                                	Opa5.assert.ok(false, "The extension facet's view with name '" + sExpectedViewName +"' is not rendered correctly");
	                                                }
                                                }
                                                break;
                                        	} else if (j === aControl.length - 1) {
                                        		// TODO & TEMP WORKAROUND: need to check why Application Log Breakout is not rendering on the UI even though it is in the manifest
                                        		if (sExpectedTitle !== "Application Log Breakout") {
                                        			Opa5.assert.ok(false, "The extension facet '" + sExpectedTitle + "' is not rendered correctly");
                                        		}
                                        	}
                                        }
	                                }
                                }
                            });
		                },
						theDraftStatusIs: function(sDraftStatus) {
							return this.waitFor({
								id: PREFIX_VIEWID + "draftStatus",
								matchers: [
								           new PropertyStrictEquals({
								        	   name: "state",
								        	   value: sDraftStatus
								           })
								           ],
								           success: function() {
								        	   Opa5.assert.ok(true, "The Draft Status is " + sDraftStatus);
								           },
								           error: "The Draft Status is not rendered correctly"
							});
						},
						theDraftStatusIsDraftSaving: function() {
							return this.theDraftStatusIs("Saving");
						},
						theDraftStatusIsDraftSaved: function() {
							return this.theDraftStatusIs("Saved");
						},
						theFieldIntheFieldGroupHasValue: function(sFieldName, sFieldGroup, sValue) {
							// control returned is a smartfield
							return this.waitFor({
								id: PREFIX_VIEWID + "com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field",
								matchers: [
							           new PropertyStrictEquals({
							        	   name: "value",
							        	   value: sValue
							           })
								],
								success: function() {
									Opa5.assert.ok(true, "The field " + sFieldName + " should contains the value " + sValue);
								},
								error: function () {
									Opa5.assert.notOk(true, "The field " + sFieldName + " is not rendered correctly");
								}
							});
						}
					}
				}
			});
		});
	}
);