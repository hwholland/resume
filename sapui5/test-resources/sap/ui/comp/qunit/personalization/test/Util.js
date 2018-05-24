/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

/**
 * @namespace Provides utitlity functions for OPA tests
 * @name sap.ui.comp.qunit.personalization.test.Util
 * @author SAP SE
 * @version 1.38.33
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object', 'sap/m/library'
], function(BaseObject, MLibrary) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.comp.qunit.personalization.test.Util", /** @lends sap.ui.comp.qunit.personalization.test.Util */
	{});

	Util.getTextOfPanel = function(sPanelType) {
		switch (sPanelType) {
			case sap.m.P13nPanelType.sort:
				return sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_TAB_SORT");
			case sap.m.P13nPanelType.filter:
				return sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_TAB_FILTER");
			case sap.m.P13nPanelType.group:
				return sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_TAB_GROUP");
			case sap.m.P13nPanelType.columns:
				return sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_TAB_COLUMNS");
			case sap.m.P13nPanelType.dimeasure:
				return sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_TAB_DIMEASURE");
		}
		return "";
	};

	Util.getControlTypeOfPanel = function(sPanelType) {
		switch (sPanelType) {
			case sap.m.P13nPanelType.sort:
				return "sap.m.P13nSortPanel";
			case sap.m.P13nPanelType.filter:
				return "sap.m.P13nFilterPanel";
			case sap.m.P13nPanelType.group:
				return "sap.m.P13nGroupPanel";
			case sap.m.P13nPanelType.columns:
				return "sap.m.P13nColumnsPanel";
			case sap.m.P13nPanelType.dimeasure:
				return "sap.m.P13nDimMeasurePanel";
		}
		return "";
	};

	/**
	 * @param {sap.m.SegmentedButton || sap.m.List} oNavigationControl
	 */
	Util.getNavigationItem = function(oNavigationControl, sPanelName) {
		if (!oNavigationControl || sPanelName === "") {
			return null;
		}
		var oNavigationItem = null;
		if (sap.ui.Device.system.phone) {
			oNavigationControl.getItems().some(function(oNavigationItem_) {
				if (oNavigationItem_.getTitle() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		} else {
			oNavigationControl.getButtons().some(function(oNavigationItem_) {
				if (oNavigationItem_.getText() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		}
		return oNavigationItem;
	};

	Util.getTextFromResourceBundle = function(sLibraryName, sTextKey) {
		var oCore = sap.ui.test.Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLibraryName).getText(sTextKey);
	};

	Util.getController = function(oControl) {
		var fGetView = function(oControl) {
			if (!oControl) {
				return null;
			}
			if (oControl.getViewName) {
				return oControl;
			}
			return fGetView(oControl.getParent());
		};
		var oView = fGetView(oControl);
		if (!oView) {
			return null;
		}
		return oView.getController();
	};

	return Util;
}, /* bExport= */true);
