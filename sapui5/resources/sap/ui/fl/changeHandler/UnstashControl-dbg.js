/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	'jquery.sap.global', './Base'
], function(jQuery, Base) {
	"use strict";

	/**
	 * Change handler for unstashing of a control.
	 * @alias sap.ui.fl.changeHandler.UnstashControl
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.27.0
	 */
	var UnstashControl = { };

	/**
	 * Unstashes a control.
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	UnstashControl.applyChange = function(oChange, oControl, mPropertyBag) {
		var mContent = oChange.getContent();
		var oModifier = mPropertyBag.modifier;

		oModifier.setStashed(oControl, false);
		oModifier.setVisible(oControl, true);

		var sTargetAggregation = mContent.parentAggregationName;
		var oTargetParent = oModifier.getParent(oControl);
		oModifier.removeAggregation(oTargetParent, sTargetAggregation, oControl);
		oModifier.insertAggregation(oTargetParent, sTargetAggregation, oControl, mContent.index);
		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	UnstashControl.completeChangeContent = function(oChange, oSpecificChangeInfo) {

		var oChangeJson = oChange.getDefinition();

		if (oSpecificChangeInfo.content) {

			oChangeJson.content = oSpecificChangeInfo.content;

		} else {

			throw new Error("oSpecificChangeInfo attribute required");

		}

	};

	return UnstashControl;
},
/* bExport= */true);
