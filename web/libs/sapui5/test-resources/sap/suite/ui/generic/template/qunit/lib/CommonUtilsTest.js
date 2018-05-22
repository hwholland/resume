/**
 * tests for the sap.suite.ui.generic.template.lib.CommonUtils
 */

sap.ui.require([ "sap/m/Table",
		"sap/suite/ui/generic/template/lib/CommonUtils" ], function(Table, CommonUtils) {
	"use strict";

	var sRequestedModelId;
	var sRequestedTextId;
	var sPath;
	var oController = {
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {
					sRequestedModelId = sId;
					return {
						getResourceBundle : function() {
							return {
								getText : function(sId) {
									sRequestedTextId = sId;
								}
							};
						}
					};
				},
				getComponentContainer: function(){
					return {
						getElementBinding: function(){
							return {
								getPath: function(){
									return sPath;
								}
							}
						}
					};
				}
			};
		}
	};

	var oNavigationContext;
	var sNavigationProperty;
	var oServices = {
			oNavigationController: {
				navigateToContext: function(oContext, sNavProp){
					oNavigationContext = oContext;
					sNavigationProperty = sNavProp;
					
				}
			}
	};

var oCommonUtils;
	
	module("lib.CommonUtils", {
		setup : function() {
			oCommonUtils = new CommonUtils(oController, oServices);
		},
		teardown : function() {
		}
	});

	test("Dummy", function() {
		ok(true, "Test - Always Good!");
	});

	QUnit.test("Function formatDraftLockText", function(assert) {
		oCommonUtils.formatDraftLockText(true, true, "User");
		assert.strictEqual(sRequestedModelId, "i18n", "only i18n Modell should be retrieved");
		assert.strictEqual(sRequestedTextId, "LOCKED_OBJECT", "Text LOCKED_OBJECT should be retrieved");

		oCommonUtils.formatDraftLockText(true, true);
		assert.strictEqual(sRequestedTextId, "UNSAVED_CHANGES", "Text UNSAVED_CHANGES should be retrieved");

		oCommonUtils.formatDraftLockText(false, true);
		assert.strictEqual(sRequestedTextId, "DRAFT_OBJECT", "Text DRAFT_OBJECT should be retrieved");

		var sText = oCommonUtils.formatDraftLockText(true, false);
		assert.strictEqual(sText, "", "Text should be empty");
	});
	
	QUnit.test("navigatefromlistitem with new interface (context + table)", function(assert){
//  typical case on (main) ListReport
		sPath = "";
		var oContext = {
				getPath: function(){
					return "/Entityset(key)"; // selected path
				}
		};
		var oTable = {};
		
		oCommonUtils.navigateFromListItem(oContext, oTable);
		assert.equal(oNavigationContext, oContext, "Navigate to context as given");
		assert.equal(sNavigationProperty, null, "Navigation property empty");
		
// table in object page
		sPath = "/MainObject(objectkey)";
		var sNavProp = "/to_navigation"; 
		var oContext = {
				getPath: function(){
					return "/SubItem(subitemkey)"; // selected path
				}
		};
		var oTable = new Table();
		oTable.getBindingInfo = function(){
			return {
				path: sNavProp
			}
		}

		oCommonUtils.navigateFromListItem(oContext, oTable);
		assert.equal(oNavigationContext, oContext, "Navigate to context as given");
		assert.equal(sNavigationProperty, sNavProp, "Navigation property according to binding info of given table");

	});
	
	
});