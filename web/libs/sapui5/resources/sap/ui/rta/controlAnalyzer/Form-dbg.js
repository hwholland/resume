/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/controlAnalyzer/Base', 'sap/ui/dt/ElementUtil', 'sap/ui/fl/Utils'],
function(Base, ElementUtil, FlexUtils) {
	"use strict";

	/**
	 * Constructor for a new change controller for the sap.ui.layout.form. Do not instantiate this class directly! Instead use
	 * the ControlAnalyzerFactory.
	 *
	 * @class Context - controller for flexibility changes
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.controlAnalyzer.Form
	 * @augments sap.ui.rta.controlAnalyzer.Base
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API
	 *               might be changed in future.
	 */
	var Form = Base.extend("sap.ui.rta.controlAnalyzer.Form", {
		metadata : {
			library : "sap.ui.rta",
			properties : {}
		}
	});

	/**
	 * @override
	 */
	Form.prototype.init = function() {
	};

	/**
	 * @public
	 */
	Form.prototype.isEditable = function(oElement) {
		var oSimpleFormContainer = this._getSimpleFormContainer(oElement);
		if (oSimpleFormContainer) {
			return this._hasStableIds(oSimpleFormContainer);
		}
	};

	/**
	 * @private
	 */
	Form.prototype._getSimpleFormContainer = function(oElement) {
		var oParent = oElement.getParent();
		if (ElementUtil.isInstanceOf(oElement, "sap.ui.layout.form.FormElement")) {
			return this._getSimpleFormContainer(oParent);
		} else if (ElementUtil.isInstanceOf(oElement, "sap.ui.layout.form.FormContainer")) {
			oParent = oParent.getParent ? oParent.getParent() : null;
			if (ElementUtil.isInstanceOf(oParent, "sap.ui.layout.form.SimpleForm")) {
				return oParent;
			}
		}
	};

	/**
	 * @private
	 */
	Form.prototype._hasStableIds = function(oElement) {
		// simple form and all elements in content aggregation have stable ids
		if (ElementUtil.isInstanceOf(oElement, "sap.ui.layout.form.SimpleForm") && FlexUtils.checkControlId(oElement)) {
			var bHasAnyChildUnstableId = oElement.getContent().some(function(oChild) {
				var bHasUnstableId = !FlexUtils.checkControlId(oChild);
				return bHasUnstableId;
			});
			return !bHasAnyChildUnstableId;
		}
	};

	return Form;

}, /* bExport= */true);
