/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	'jquery.sap.global', './Base'
], function(jQuery, Base) {
	"use strict";

	/**
	 * Change handler for hiding of a control.
	 * @alias sap.ui.fl.changeHandler.HideControl
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.27.0
	 */
	var HideControl = { };

	/**
	 * Hides a control.
	 *
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	HideControl.applyChange = function(oChange, oControl, mPropertyBag) {
		mPropertyBag.modifier.setVisible(oControl, false);
		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	HideControl.completeChangeContent = function(oChange, oSpecificChangeInfo) {

		var oChangeJson = oChange.getDefinition();

		if (!oChangeJson.content) {
			oChangeJson.content = {};
		}

	};

	return HideControl;
},
/* bExport= */true);
