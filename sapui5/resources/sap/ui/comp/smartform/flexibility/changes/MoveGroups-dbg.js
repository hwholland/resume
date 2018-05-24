/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	"jquery.sap.global", "sap/ui/fl/changeHandler/Base", "sap/ui/fl/Utils", "sap/ui/fl/changeHandler/JsControlTreeModifier"
], function(jQuery, Base, FlexUtils, JsControlTreeModifier) {
	"use strict";

	/**
	 * Change handler for moving of groups inside a smart form.
	 * @alias sap.ui.fl.changeHandler.MoveGroups
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.27.0
	 */
	var MoveGroups = { };

	/**
	 * Moves group(s) inside a smart form.
	 *
	 * @param {object} oChange change object with instructions to be applied on the control
	 * @param {object} oSmartForm Smart form instance which is referred to in change selector section
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	MoveGroups.applyChange = function(oChange, oSmartForm, mPropertyBag) {

		function checkConditions(oChange, oModifier) {
			if (!oChange) {
				throw new Error("No change instance");
			}

			var oChangeContent = oChange.getContent();

			if (!oModifier.getAggregation(oSmartForm, "groups")) {
				FlexUtils.log.error("Object has no smartform elements aggregation", oModifier.getId(oSmartForm));
			}
			if (!oChangeContent || !oChangeContent.moveGroups || oChangeContent.moveGroups.length === 0) {
				throw new Error("Change format invalid");
			}
		}

		function getGroupControlOrThrowError(oMoveGroup, oModifier, oAppComponent, oView) {
			if (!oMoveGroup.selector && !oMoveGroup.id) {
				throw new Error("Change format invalid - moveGroups element has no id attribute");
			}
			if (typeof (oMoveGroup.index) !== "number") {
				throw new Error("Change format invalid - moveGroups element index attribute is no number");
			}

			return oModifier.bySelector(oMoveGroup.selector || oMoveGroup.id, oAppComponent, oView);
		}

		var oModifier = mPropertyBag.modifier;
		var oView = mPropertyBag.view;
		var oAppComponent = mPropertyBag.appComponent;

		checkConditions(oChange, oModifier);

		var oChangeContent = oChange.getContent();

		oChangeContent.moveGroups.forEach(function (oMoveGroup) {
			var oGroup = getGroupControlOrThrowError(oMoveGroup, oModifier, oAppComponent, oView);

			if (!oGroup) {
				FlexUtils.log.warning("Group to move not found");
				return;
			}

			oModifier.removeAggregation(oSmartForm, "groups", oGroup, oView);
			oModifier.insertAggregation(oSmartForm, "groups", oGroup, oMoveGroup.index);
		});

		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {object} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo with attribute moveGroups which contains an array which holds objects which have attributes
	 * 				   id and index - id is the id of the group to move and index the new position of the group in the smart form
	 * @public
	 */
	MoveGroups.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {

		function checkCompleteChangeContentConditions() {
			if (!oSpecificChangeInfo.moveGroups) {
				throw new Error("oSpecificChangeInfo.moveGroups attribute required");
			}
			if (oSpecificChangeInfo.moveGroups.length === 0) {
				throw new Error("MoveGroups array is empty");
			}

			oSpecificChangeInfo.moveGroups.forEach(function (oMoveGroup) {
				if (!oMoveGroup.id) {
					throw new Error("MoveGroups element has no id attribute");
				}
				if (typeof (oMoveGroup.index) !== "number") {
					throw new Error("Index attribute at MoveGroups element is no number");
				}
			});
		}

		checkCompleteChangeContentConditions();

		var oChangeJson = oChange.getDefinition();

		if (!oChangeJson.content) {
			oChangeJson.content = {};
		}
		if (!oChangeJson.content.moveGroups) {
			oChangeJson.content.moveGroups = [];
		}

		oSpecificChangeInfo.moveGroups.forEach(function (oGroup) {
			var oGroupControl = sap.ui.getCore().byId(oGroup.id);
			var oSelector = JsControlTreeModifier.getSelector(oGroupControl, mPropertyBag.appComponent);

			oChangeJson.content.moveGroups.push({
				selector: oSelector,
				index: oGroup.index
			});
		});

	};

	return MoveGroups;
},
/* bExport= */true);
