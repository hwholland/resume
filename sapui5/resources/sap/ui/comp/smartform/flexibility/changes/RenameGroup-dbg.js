/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/ui/fl/Utils', 'jquery.sap.global', 'sap/ui/fl/changeHandler/Base'
], function(Utils, jQuery, Base) {
	"use strict";

	/**
	 * Change handler for renaming a SmartForm group.
	 * @constructor
	 * @alias sap.ui.fl.changeHandler.RenameGroup
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.27.0
	 */
	var RenameGroup = { };

	/**
	 * Renames a form group.
	 *
	 * @param {sap.ui.fl.Change} oChangeWrapper change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.Group} oGroup Group control that matches the change selector for applying the change
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	RenameGroup.applyChange = function(oChangeWrapper, oGroup, mPropertyBag) {
		var oChange = oChangeWrapper.getDefinition();
		var oModifier = mPropertyBag.modifier;
		if (oChange.texts && oChange.texts.groupLabel && this._isProvided(oChange.texts.groupLabel.value)) {
			oModifier.setProperty(oGroup, "label", oChange.texts.groupLabel.value);
			return true;
		} else {
			Utils.log.error("Change does not contain sufficient information to be applied: [" + oChange.layer + "]" + oChange.namespace + "/" + oChange.fileName + "." + oChange.fileType);
			//however subsequent changes should be applied
		}
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChangeWrapper change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo with attribute groupLabel, the new group label to be included in the change
	 * @public
	 */
	RenameGroup.completeChangeContent = function(oChangeWrapper, oSpecificChangeInfo) {
		var oChange = oChangeWrapper.getDefinition();
		if (this._isProvided(oSpecificChangeInfo.groupLabel)) {
			Base.setTextInChange(oChange, "groupLabel", oSpecificChangeInfo.groupLabel, "XFLD");
		} else {
			throw new Error("oSpecificChangeInfo.groupLabel attribute required");
		}
	};

	/**
	 * Checks if a string is provided as also empty strings are allowed for the group
	 */
	RenameGroup._isProvided = function(sString){
		return typeof (sString) === "string";
	};

	return RenameGroup;
},
/* bExport= */true);
