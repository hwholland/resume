/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	'jquery.sap.global', './Base'
], function(jQuery, Base) {
	"use strict";

	/**
	 * Change handler for stashing of a control.
	 * @alias sap.ui.fl.changeHandler.StashControl
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.27.0
	 */
	var StashControl = { };

	/**
	 * Stashes a control.
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	StashControl.applyChange = function(oChange, oControl, mPropertyBag) {
		mPropertyBag.modifier.setVisible(oControl, false);
		mPropertyBag.modifier.setStashed(oControl, true);
		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	StashControl.completeChangeContent = function(oChange, oSpecificChangeInfo) {

		var oChangeJson = oChange.getDefinition();

		if (!oChangeJson.content) {
			oChangeJson.content = {};
		}

	};

	return StashControl;
},
/* bExport= */true);
