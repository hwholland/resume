/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */

sap.ui.define([
	'jquery.sap.global', './Base'
], function(jQuery, Base) {
	"use strict";

	/**
	 * Change handler for removing a smart form group.
	 * @constructor
	 * @alias sap.ui.fl.changeHandler.RemoveGroup
	 * @author SAP SE
	 * @version 1.28.43
	 * @experimental Since 1.27.0
	 */
	var RemoveGroup = function() {
	};
	RemoveGroup.prototype = jQuery.sap.newObject(Base.prototype);

	/**
	 * Removes a smart form group.
	 *
	 * @param {sap.ui.fl.Change} oChangeWrapper change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.Group} oGroup group control that matches the change selector for applying the change
	 * @public
	 */
	RemoveGroup.prototype.applyChange = function(oChangeWrapper, oGroup) {
		if (oGroup.getParent) {
			var oForm = oGroup.getParent();
			if (oForm.removeGroup) {
				oForm.removeGroup(oGroup);
			}
		} else {
			throw new Error("no Group control provided for removing the group");
		}
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChangeWrapper change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	RemoveGroup.prototype.completeChangeContent = function(oChangeWrapper, oSpecificChangeInfo) {
		var oChange = oChangeWrapper.getDefinition();
		if (!oChange.content) {
			oChange.content = {};
		}
	};

	return RemoveGroup;
},
/* bExport= */true);
