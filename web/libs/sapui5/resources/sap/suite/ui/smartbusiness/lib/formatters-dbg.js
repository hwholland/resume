/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.formatters");

sap.suite.ui.smartbusiness.lib.formatters = {
		getBundleText : function(oController, iText, iPlaceholder1, iPlaceholder2) {
			var oBundle;

			if (oController === undefined) {
				var oApplicationFacade = sap.ca.scfld.md.app.Application.getImpl().oConfiguration.oApplicationFacade;
				oBundle = oApplicationFacade.getResourceBundle();
			} else {
				oBundle = oController.oApplicationFacade.getResourceBundle();
			}

			var sText = oBundle.getText(iText, [iPlaceholder1, iPlaceholder2]);
			return sText;
		},
		
		kpiStatus : function(state) {
			return (state ? sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS", sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS_ACTIVE")) : sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS", sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS_DRAFT")));
		},
		kpiStatusText : function(state) {
			return (state ? sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS_ACTIVE") : sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "STATUS_DRAFT"));
		},
		kpiStatusState : function(state) {
			return (state ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.None);
		},
		kpiOwner : function(owner) {
			if(owner)
				return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "ADDED_BY", owner);
			return;
		},
		kpiOwnerInOH : function(owner) {
			if(owner)
				return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "OWNER", owner);
			return;
		},
		kpiID : function(id, type) {
			if(id) {
				if(type && type == "KPI") {
					return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "KPI", id);
				}
				else {
					return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, ("OPI ID:" + id));
				}
			}
			return;
		},
		kpiIDInOH : function(id, type) {
			if(id) {
				if(type && type == "KPI") {
					return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "KPI", id);
				}
				else {
					return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, ("OPI: " + id));
				}
			}
			return;
		},
		evalStatus : function(status) {
			try {
				if(status)
					return "Success";
				return "None";
			} catch (e) {
				return;
			}
		},
};

