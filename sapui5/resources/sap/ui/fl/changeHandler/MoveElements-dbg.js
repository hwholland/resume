/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define(["jquery.sap.global", "./Base", "sap/ui/fl/Utils"], function(jQuery, Base, Utils) {
	"use strict";

	/**
	 * Change handler for moving of a elements.
	 *
	 * @alias sap.ui.fl.changeHandler.MoveElements
	 * @author SAP SE
	 * @version 1.38.33
	 * @experimental Since 1.34.0
	 */
	var MoveElements = { };

	MoveElements.CHANGE_TYPE = "moveElements";

	/**
	 * Moves an element from one aggregation to another.
	 *
	 * @param {sap.ui.fl.Change}
	 *          oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control}
	 *          oSourceParent control that matches the change selector for applying the change, which is the source of the
	 *          move
	 * @param {object} mPropertyBag
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @public
	 */
	MoveElements.applyChange = function(oChange, oSourceParent, mPropertyBag) {
		var mContent = oChange.getContent();
		var oModifier = mPropertyBag.modifier;
		var oView = mPropertyBag.view;
		var oAppComponent = mPropertyBag.appComponent;

		var sSourceAggregation = oChange.getSelector().aggregation;
		if (!sSourceAggregation) {
			throw new Error("No source aggregation supplied via selector for move");
		}

		if (!mContent.target || !mContent.target.selector) {
			throw new Error("No target supplied for move");
		}

		var oTargetParent = oModifier.bySelector(mContent.target.selector.id, oAppComponent, oView);

		if (!oTargetParent) {
			throw new Error("Move target parent not found");
		}
		var sTargetAggregation = mContent.target.selector.aggregation;
		if (!sTargetAggregation) {
			throw new Error("No target aggregation supplied for move");
		}
		if (!mContent.movedElements) {
			throw new Error("No moveElements supplied");
		}

		mContent.movedElements.forEach(function(mMovedElement) {
			var oMovedElement = oModifier.bySelector(mMovedElement.selector.id, oAppComponent, oView);
			if (!oMovedElement) {
				throw new Error("Unknown element with id '" + mMovedElement.selector.id + "' in moveElements supplied");
			}
			if ( typeof mMovedElement.targetIndex !== "number") {
				throw new Error("Missing targetIndex for element with id '" + mMovedElement.selector.id
						+ "' in moveElements supplied");
			}
			oModifier.removeAggregation(oSourceParent, sSourceAggregation, oMovedElement, oView);
			oModifier.insertAggregation(oTargetParent, sTargetAggregation, oMovedElement, mMovedElement.targetIndex);
		});

		return true;

	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change}
	 *          oChange change object to be completed
	 * @param {object}
	 *          mSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	MoveElements.completeChangeContent = function(oChange, mSpecificChangeInfo, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var mSpecificInfo = this.getSpecificChangeInfo(oModifier, mSpecificChangeInfo);

		var mChangeData = oChange.getDefinition();

		mChangeData.changeType = MoveElements.CHANGE_TYPE;

		mChangeData.selector = mSpecificInfo.source;

		mChangeData.content = {
			movedElements : [],
			target : {
				selector : mSpecificInfo.target
			}
		};
		mSpecificInfo.movedElements.forEach(function(mElement) {
			var oElement = mElement.element || oModifier.bySelector(mElement.id);

			mChangeData.content.movedElements.push({
				selector : {
					id : oElement.getId(),
					type : oModifier.getControlType(oElement)
				},
				sourceIndex : mElement.sourceIndex,
				targetIndex : mElement.targetIndex
			});
		});
	};

	/**
	 * Enrich the incoming change info with the change info from the setter, to get the complete data in one format
	 */
	MoveElements.getSpecificChangeInfo = function(oModifier, mSpecificChangeInfo) {

		var oSourceParent = mSpecificChangeInfo.source.parent || oModifier.bySelector(mSpecificChangeInfo.source.id);
		var oTargetParent = mSpecificChangeInfo.target.parent || oModifier.bySelector(mSpecificChangeInfo.target.id);
		var sSourceAggregation = mSpecificChangeInfo.source.aggregation;
		var sTargetAggregation = mSpecificChangeInfo.target.aggregation;

		var mSpecificInfo = {
			source : {
				id : oSourceParent.getId(),
				aggregation : sSourceAggregation,
				type : oModifier.getControlType(oSourceParent)
			},
			target : {
				id : oTargetParent.getId(),
				aggregation : sTargetAggregation,
				type : oModifier.getControlType(oTargetParent)
			},
			movedElements : mSpecificChangeInfo.movedElements
		};

		return mSpecificInfo;
	};

	return MoveElements;
},
/* bExport= */true);
