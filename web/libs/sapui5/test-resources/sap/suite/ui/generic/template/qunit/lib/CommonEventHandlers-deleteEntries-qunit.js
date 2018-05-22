sap.ui.require(
	["sap/suite/ui/generic/template/lib/CommonEventHandlers",
	 "sap/suite/ui/generic/template/lib/CommonUtils", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/base/Event", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel" ], 
	function (CommonEventHandlers,
			CommonUtils, MessageBox, MessageToast, Event, JSONModel, ResourceModel) {
		"use strict";
		
		var oLibResourceBundle = new ResourceModel({
			bundleUrl: "../../../../../../../../sap/suite/ui/generic/template/lib/i18n/i18n.properties"
		}).getResourceBundle();
		
		
		module("Delete Entries", {
			beforeEach : function () {

				// test setup data to be used by test 
				this.mockItems = [];
				this.deleteEntitiesPromise = new Promise(function (resolve, reject) {
					return resolve([]);
				}.bind(this));
				
				// Mock objects necessary for the class under test
				var oController = {
					getView: function() {
						return {
							getModel: function() {
								return {
									getMetaModel: function() {
										return {
											getODataEntitySet: function() {
												return {entityType:"ProductType"};
											},
											getODataEntityType: function() {
												return {
													"com.sap.vocabularies.UI.v1.HeaderInfo": {
														TypeName: {
															String: "Unit Test"
														},
														TypeNamePlural: {
															String: "Unit Tests"
														}
													}
												};
											}
										}
									},
									getObject: function(entity) {
										return entity;
									},
									getProperty: function(property, context) {
										
										if (property.indexOf("/InProcessByUser") > -1) {
											return context.DraftAdministrativeData.InProcessByUser ? "Locke Smith" : undefined;
											
										} else if (property.indexOf("/LastChangedByUser") > -1) {
											return "Changey McChangerton"
										}
									}
								};
							},
							getId: function() {
								return "";
							}
						};
					},
					getOwnerComponent: function() {
						return {
							getEntitySet: function() {
								return "ProductSet"
							}
						}	
					}
				};

				var oServices = {
						oCRUDManager: {
							deleteEntities: function (contexts) {
								return this.deleteEntitiesPromise;
							}.bind(this)
						}
				};
				var oCommonUtils = {
						getDialogFragment: function (sName, oFragmentController, sModel, fnOnFragmentCreated) {
							var oFragment = sap.ui.xmlfragment(oController.getView().getId(), sName, oFragmentController);
							var oModel;
							if (sModel) {
								oModel = new JSONModel();
								oFragment.setModel(oModel, sModel);
							}
							return oFragment;
						},
						getContentDensityClass: function () {
							return "";
						},
						getText: function () {
							return oLibResourceBundle.getText.apply(oLibResourceBundle, arguments);
						},
						getSelectedContexts: function () {
							for (var i=0; i<this.mockItems.length; i++) {
								this.mockItems[i].getPath = function () {
									return this;
								}
							}
							return this.mockItems;
						}.bind(this),
						getParentTable: function(){
							return {
								getTable: function () {
									return oTable;
								},
								rebindTable: function () {
								}
							}
						}
				};
				
				
				var oTable = {
					getSelectedItems: function() {
						for (var i=0; i<this.mockItems.length; i++) {
							this.mockItems[i].getBindingContext = function() {
								return {
									getPath: function () {
										return this;
									}.bind(this)
								}
							}
						}
						return this.mockItems;
					}.bind(this)
				};
				// Stubbing 
				this.stubDialogOpen = sinon.stub(sap.m.Dialog.prototype, "open");
				this.stubSmartTableRebind = sinon.stub(sap.ui.comp.smarttable.SmartTable.prototype, "rebindTable");
				
				this.stubMessageBoxError = sinon.stub(MessageBox, "error");
				this.stubMessageToastShow = sinon.stub(MessageToast, "show");
				
				this.spyDeleteEntities = sinon.spy(oServices.oCRUDManager, "deleteEntities");
				
				
				
				// Helper Methods for assertions 
				this.getDeleteDialog = function() {
					return sap.ui.getCore().byId("deleteConfirmationDialog");
				};
				this.getDeleteDialogModelData = function() {
					return this.getDeleteDialog().getModel('delete').getData();
				};
				this.checkDeleteCheckBox = function() {
					sap.ui.getCore().byId("deleteCheckBox").setSelected(true);
				};
				this.uncheckDeleteCheckBox = function() {
					sap.ui.getCore().byId("deleteCheckBox").setSelected(false);
				};
				
				// Create class under test
				this.cut_commonEventHandlers = new CommonEventHandlers(oController, undefined, oServices, oCommonUtils);
			},
			afterEach : function() {
				this.stubDialogOpen.restore();
				this.stubSmartTableRebind.restore();
				this.stubMessageBoxError &&	this.stubMessageBoxError.restore();
				this.stubMessageToastShow && this.stubMessageToastShow.restore();

				this.spyDeleteEntities.restore();
				
				this.getDeleteDialog() && this.getDeleteDialog().destroy();
			}
		});
		

		// Tests for opening the Delete dialog
		[
		 // 1 item
		 {	
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}],
			 expected: {
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 0,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE"),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SELECTED", ["unit test"])
			 }
		 },
		 // 1 unsaved changes
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expected: {
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 1,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE"),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_UNSAVED_CHANGES", ["unit test", "Changey McChangerton"])
			 }
		 },
		 // 1 locked
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}],
			 expected: {
				 lockedItemsCount: 1,
				 unsavedChangesItemsCount: 0,
				 title: oLibResourceBundle.getText("ST_GENERIC_ERROR_TITLE"),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_LOCKED", ["Unit Test", "Locke Smith"])
			 }
		 },
		 // 2 items
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, 
		  	             {id:2, IsActiveEntity: true, HasDraftEntity: false}],
			 expected: {
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 0,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SELECTED_PLURAL", ["unit tests"])
			 }
		 },
		 // 2 unsaved changes
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}, 
		  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expected: {
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 2,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL", ["unit tests"])
			 }
		 },
		 // 2 locked
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}, 
		  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}],
             expected: {
            	 lockedItemsCount: 2,
            	 unsavedChangesItemsCount: 0,
            	 title: oLibResourceBundle.getText("ST_GENERIC_ERROR_TITLE", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_LOCKED_PLURAL", ["unit tests"])
             }
		 },
		 // 1 item; 1 unsaved
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false},
		  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expected: {
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 1,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SELECTED_PLURAL", ["unit tests"])
			 }
		 },
		 // 1 item; 1 locked
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false},
			             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}],
			 expected: {
				 lockedItemsCount: 1,
			     unsavedChangesItemsCount: 0,
			     title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED", [2, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING", ["unit test"])
			 }
		 },
		 // 1 item; 2 locked
		 {	 
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false},
		  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}},
		  	             {id:3, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}],
			 expected: {
				 lockedItemsCount: 2,
				 unsavedChangesItemsCount: 0,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [3]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED_PLURAL", [2, 3, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING", ["unit test"])
			 }
		 },
		 // 2 items; 1 locked
		 {	 
			 mockItems: [
  	             {id:1, IsActiveEntity: true, HasDraftEntity: false}, // normal
  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}, // locked
  	             {id:3, IsActiveEntity: true, HasDraftEntity: false}
             ],
             expected: {
            	 lockedItemsCount: 1,
            	 unsavedChangesItemsCount: 0,
            	 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [3]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED", [3, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING_PLURAL", [2, "unit tests"])
             }
		 },
		 // 1 items; 1 unsaved change; 1 locked
		 {	 
			 mockItems: [
  	             {id:1, IsActiveEntity: true, HasDraftEntity: false}, // normal
  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}, // locked
  	             {id:3, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}} // unsaved
             ],
             expected: {
            	 lockedItemsCount: 1,
            	 unsavedChangesItemsCount: 1,
            	 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [3]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED", [3, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING_PLURAL", [2, "unit tests"])
             }
		 },
		 // 1 unsaved change; 1 locked
		 {	 
			 mockItems: [
  	             {id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}, // locked
  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}} // unsaved
		 	 ],
			 expected: {
				 lockedItemsCount: 1,
				 unsavedChangesItemsCount: 1,
				 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [2]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED", [2, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES", ["unit test"])
			 }
		 },
		 // 2 unsaved change; 1 locked
		 {	 
			 mockItems: [
  	             {id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}, // unsaved
  	             {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}, // locked
  	             {id:3, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}} // unsaved
             ],
             expected: {
            	 lockedItemsCount: 1,
            	 unsavedChangesItemsCount: 2,
            	 title: oLibResourceBundle.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [3]),
				 message: oLibResourceBundle.getText("ST_GENERIC_CURRENTLY_LOCKED", [3, "unit tests"]) + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL", ["unit tests"])
             }
		 }
		].forEach(function(oData){
			test("Firing 'deleteEntries' with " + (oData.mockItems.length - oData.expected.lockedItemsCount - oData.expected.unsavedChangesItemsCount) + " normal; " + oData.expected.unsavedChangesItemsCount + " unsaved changes; " +oData.expected.lockedItemsCount + " locked'" + 
					"-> A confirmation dialog popup should open with the title: '" + oData.expected.title + "' and message: '" + oData.expected.message + "'", function() {
				// setup test data
				this.mockItems = oData.mockItems;
				// execute test
				this.cut_commonEventHandlers.deleteEntries({getSource: function(){}});
				
				// assertions
//				var sShortText = "";
//				if (jQuery.isArray(oData.shortTextId)) {
//					for (var i=0; i<oData.shortTextId.length; i++) {
//						(i > 0) ? sShortText += "\n" : "";
//						sShortText += oLibResourceBundle.getText(oData.shortTextId[i], oData.shortTextVars[i]);
//					}
//				} else {
//					sShortText = oLibResourceBundle.getText(oData.shortTextId, oData.shortTextVars);
//				}
				
				var expectedData = {
					itemsCount: oData.mockItems.length,
					lockedItemsCount: oData.expected.lockedItemsCount,
					unsavedChangesItemsCount: oData.expected.unsavedChangesItemsCount,
					text: {	
						title: oData.expected.title, 
						shortText: oData.expected.message, 
						unsavedChanges: oLibResourceBundle.getText("ST_GENERIC_UNSAVED_CHANGES_CHECKBOX", "unit tests"), 
						longText: undefined 
					}
				};
				var actualDialogData = this.getDeleteDialogModelData();
				deepEqual(actualDialogData.text, expectedData.text, "The texts for the dialog are correct");
				equal(actualDialogData.itemsCount, expectedData.itemsCount, "The selected items count is correct");
				equal(actualDialogData.lockedItemsCount, expectedData.lockedItemsCount, "The locked items count is correct");
				equal(actualDialogData.unsavedChangesItemsCount, expectedData.unsavedChangesItemsCount, "The items with unsaved changes count is correct");
				ok(this.stubDialogOpen.calledOnce, "The delete confimration popup was opened once");
			});
		});
		
		test("Firing 'deleteEntries' with 0 item should result in an ST_GENERIC_NO_ITEM_SELECTED error dialog", function() {
			// setup test data
			this.mockItems = [];
			
			// execute test
			this.cut_commonEventHandlers.deleteEntries({getSource: function(){}});
			
			// assertions
			ok(this.stubDialogOpen.notCalled, "The Dialog did not open");
			ok(this.stubMessageBoxError.calledOnce, "The Message error is opened");
			ok(this.stubMessageBoxError.calledWith(oLibResourceBundle.getText("ST_GENERIC_NO_ITEM_SELECTED")), "The Message error is opened with the correct message");
		});
		
		
		
		// Tests for confirming the Delete dialog
		[
		 { 
			 test: "1 item should delete that item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}],
			 expectedContextCount: 1,
			 expectedContextIds: [1]
		 },
		 { 
			 test: "1 unsaved changes item should delete that item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expectedContextCount: 1,
			 expectedContextIds: [1]
		 },
		 { 
			 test: "1 item and 1 locked should only delete the 1 item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}}],
			 expectedContextCount: 1,
			 expectedContextIds: [1]
		 },
		 { 
			 test: "1 item, 1 unsaved charges and checkbox not checked should only delete the 1 item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expectedContextCount: 1,
			 expectedContextIds: [1],
			 unchecked: true
		 },
		 { 
			 test: "1 item, 1 unsaved charges and checkbox checked should delete both items",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expectedContextCount: 2,
			 expectedContextIds: [1,2]
		 },
		 { 
			 test: "1 item, 1 unsaved charges, 1 locked and checkbox not checked should only delete the regular item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}},
		                 {id:3, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expectedContextCount: 1,
			 expectedContextIds: [1],
			 unchecked: true
		 },
		 { 
			 test: "1 item, 1 unsaved charges, 1 locked and checkbox checked should delete the regular item and the unsaved changes item",
			 mockItems: [{id:1, IsActiveEntity: true, HasDraftEntity: false}, {id:2, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {InProcessByUser : "Locke Smith"}},
		                 {id:3, IsActiveEntity: true, HasDraftEntity: true, DraftAdministrativeData: {}}],
			 expectedContextCount: 2,
			 expectedContextIds: [1,3]
		 }
		].forEach(function(oData){
			test("Confirming the Delete confirmation dialog with " + oData.test, function(assert) {
				var done = assert.async();
				// setup test data
				this.mockItems = oData.mockItems;
				
				// execute test
				this.cut_commonEventHandlers.deleteEntries({getSource: function(){}});
				if (oData.unchecked) {
					this.uncheckDeleteCheckBox();
				}
				this.getDeleteDialog().getBeginButton().firePress();
				
				this.deleteEntitiesPromise.then(function() {
					
					// assertions
					var expectedContextCount = oData.expectedContextCount;
					var expectedContextIds = oData.expectedContextIds;
					var actualContext = this.spyDeleteEntities.getCall(0).args[0];
					equal(actualContext.length, oData.expectedContextIds.length, "The deleteEntities function was called with " + expectedContextIds.length + " contexts");
					for (var i=0; i<expectedContextIds.length; i++) {
						equal(actualContext[i].getPath().id, expectedContextIds[i], "The context is the right one" );
					}
					
					ok(this.stubMessageToastShow.calledOnce, "Message toast should be called once");
					
					done();
				}.bind(this));
			});
		});
		
		
		// Tests the success and error confirmation messages after delete
		[
		 {
			 test: "1 successful delete -> a Message Toast with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: [],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SUCCESS", ["unit test"])
			 }
		 },
		 {
			 test: "2 successful delete -> a Message Toast with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}, {id: 2, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: [],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SUCCESS_PLURAL", ["unit tests"])
			 }
		 },
		 {
			 test: "1 erroneous delete -> a Message Box with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: ["/1"],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_ERROR", ["unit test"])
			 }
		 },
		 {
			 test: "2 erroneous delete -> a Message Box with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}, {id: 2, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: ["/1", "/2"],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_ERROR_PLURAL", ["unit tests"])
			 }
		 },
		 {
			 test: "1 successful & 1 erroneous delete -> a Message Box with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}, {id: 2, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: ["/1"],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SUCCESS_WITH_COUNT", [1, "unit test"])
				 + "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_ERROR_WITH_COUNT", [1, "unit test"])
			 }
		 },
		 {
			 test: "2 successful & 2 erroneous delete -> a Message Box with text: ",
			 mockItems: [{id: 1, IsActiveEntity: true, HasDraftEntity: false}, {id: 2, IsActiveEntity: true, HasDraftEntity: false}, {id: 3, IsActiveEntity: true, HasDraftEntity: false}, {id: 4, IsActiveEntity: true, HasDraftEntity: false}],
			 failedPaths: ["/1", "/3"],
			 expected: {
				 message: oLibResourceBundle.getText("ST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT", [2, "unit tests"])
				 			+ "\n" + oLibResourceBundle.getText("ST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT", [2, "unit tests"])
			 }
		 }
		].forEach(function (oData) {
			test(oData.test + "'" + oData.expected.message + "'", function(assert) {
				var done = assert.async();
				// setup test data
				this.mockItems = oData.mockItems;
				this.deleteEntitiesPromise = new Promise(function (resolve, reject) {
					return resolve(oData.failedPaths);
				}); 
				
				var expectedMessage = oData.expected.message;
				
				// execute test
				this.cut_commonEventHandlers.deleteEntries({getSource: function(){}});
				this.getDeleteDialog().getBeginButton().firePress();
				
				this.deleteEntitiesPromise.then(function() {
					// assertions
					if (oData.failedPaths.length === 0) {
						ok(this.stubMessageToastShow.calledOnce, "The message toast should be called only once");
						ok(this.stubMessageToastShow.calledWithMatch(expectedMessage), "The message toast should be called with text: '" + expectedMessage +"'");	
					} else {
						ok(this.stubMessageBoxError.calledOnce, "The message box in error state should be called only once");
						ok(this.stubMessageBoxError.calledWithMatch(expectedMessage), "The message box should be called with text: '" + expectedMessage +"'");
					}
					
					
					done();
				}.bind(this));
			});
		})

		
		
		// Test the Delete Confirmation xml fragment
		module("Delete Confirmation Dialog Rendering", {
			beforeEach : function () {
				// Test resources
				this.listReportResourceModel = new ResourceModel({
					bundleUrl: "../../../../../../../../sap/suite/ui/generic/template/ListReport/i18n/i18n.properties"
				});
				oLibResourceBundle = this.listReportResourceModel.getResourceBundle();
				
				
				// Dialog under test
				this.cut_deleteDialog = sap.ui.xmlfragment("sap/suite/ui/generic/template/ListReport/view/fragments/DeleteConfirmation");
				this.cut_deleteDialog.setModel(this.listReportResourceModel, "i18n");
			},
			afterEach : function () {
				this.cut_deleteDialog.destroy();
			}
		});

		[
		 {	test: "1 normal item",
			 dialogData: {
				 itemsCount: 1,
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 0,
				 checkboxSelected: false 
			 },
			 expected: {
				 dialogStatus: "Warning",
				 checkboxVisible: false,
				 deleteButtonVisible: true,
				 cancelButtonText: "CANCEL"
			 }
		 },
		 {	test: "1 locked item",
			 dialogData: {
				 itemsCount: 1,
				 lockedItemsCount: 1,
				 unsavedChangesItemsCount: 0,
				 checkboxSelected: false 
			 },
			 expected: {
				 dialogStatus: "Error",
				 checkboxVisible: false,
				 deleteButtonVisible: false,
				 cancelButtonText: "CLOSE"
			 }
		 },
		 {	test: "1 unsaved changes item",
			 dialogData: {
				 itemsCount: 1,
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 1,
				 checkboxSelected: true 
			 },
			 expected: {
				 dialogStatus: "Warning",
				 checkboxVisible: false,
				 deleteButtonVisible: true,
				 cancelButtonText: "CANCEL"
			 }
		 },
		 {	test: "1 normal item and 1 unsaved changes item",
			 dialogData: {
				 itemsCount: 2,
				 lockedItemsCount: 0,
				 unsavedChangesItemsCount: 1,
				 checkboxSelected: true 
			 },
			 expected: {
				 dialogStatus: "Warning",
				 checkboxVisible: true,
				 deleteButtonVisible: true,
				 cancelButtonText: "CANCEL"
			 }
		 },
		 {	test: "1 locked item and 1 unsaved changes item",
			 dialogData: {
				 itemsCount: 2,
				 lockedItemsCount: 1,
				 unsavedChangesItemsCount: 1,
				 checkboxSelected: true 
			 },
			 expected: {
				 dialogStatus: "Warning",
				 checkboxVisible: false,
				 deleteButtonVisible: true,
				 cancelButtonText: "CANCEL"
			 }
		 },
		 {	test: "1 normal item, 1 locked item and 1 unsaved changes item",
			 dialogData: {
				 itemsCount: 3,
				 lockedItemsCount: 1,
				 unsavedChangesItemsCount: 1,
				 checkboxSelected: true 
			 },
			 expected: {
				 dialogStatus: "Warning",
				 checkboxVisible: true,
				 deleteButtonVisible: true,
				 cancelButtonText: "CANCEL"
			 }
		 },
		 
		].forEach(function (oData) {
		
			test("The Delete Confirmation dialog is rendered correctly with " + oData.test, function () {
				// setup
				var mJSONData = jQuery.extend(oData.dialogData,	{text: {title: "unit title", shortText: "unit short", unsavedChanges: "unit unsaved", longText: undefined}});
				
				
				// execute test
				this.cut_deleteDialog.setModel(new JSONModel(mJSONData), "delete");
				
				// assertions
				ok(this.cut_deleteDialog, "Dialog was created");
				equal(this.cut_deleteDialog.getTitle(), mJSONData.text.title, "The title is correct");
				
				var oVbox = this.cut_deleteDialog.getContent()[0];
				var oText = oVbox.getItems()[0];
				equal(oText.getText(), mJSONData.text.shortText, "The short text is correct");
				
				var oCheckbox = oVbox.getItems()[1];
				equal(oCheckbox.getText(), mJSONData.text.unsavedChanges, "The checkbox text is correct")
				equal(oCheckbox.getSelected(), mJSONData.checkboxSelected, (mJSONData.checkboxSelected) ? "The checkbox should be selected" : "The checkbox should not be selected");
				equal(oCheckbox.getVisible(), oData.expected.checkboxVisible, (oData.expected.checkboxVisible) ? "The checkbox should be visible": "The checkbox should not be visible");
				
				var oBeginButton = this.cut_deleteDialog.getBeginButton();
				equal(oBeginButton.getText(), oLibResourceBundle.getText("DELETE"), "The delete button should have the text: " + oLibResourceBundle.getText("DELETE"));
				equal(oBeginButton.getVisible(), oData.expected.deleteButtonVisible, (oData.expected.deleteButtonVisible) ? "The delete button should be visible": "The delete button should not be visible");
				
				var oEndButton = this.cut_deleteDialog.getEndButton();
				equal(oEndButton.getText(), oLibResourceBundle.getText(oData.expected.cancelButtonText), "The cancel button should have the text: " + oData.expected.cancelButtonText);
			});
		
		});
});