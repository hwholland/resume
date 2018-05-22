/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject', 'sap/ui/dt/ElementUtil', 'sap/ui/fl/Utils'], function(ManagedObject, ElementUtil, FlexUtils) {
	"use strict";

	var aEDITABLE_TYPES = ["sap.ui.comp.smartform.SmartForm", "sap.ui.comp.smartform.Group",
			"sap.ui.comp.smartform.GroupElement", "sap.uxap.ObjectPageSection", "sap.uxap.ObjectPageLayout"];

	if (FlexUtils.isVendorLayer()) {
		aEDITABLE_TYPES = aEDITABLE_TYPES.concat(["sap.ui.comp.smartfilterbar.SmartFilterBar",
				"sap.ui.comp.smarttable.SmartTable", "sap.uxap.ObjectPageHeader",
				"sap.uxap.ObjectPageHeaderActionButton", "sap.ui.table.Column"]);
	}

	/**
	 * Abstract class for controlAnalyzer Do not instantiate this class directly! Instead use the ControlAnalyzerFactory.
	 *
	 * @class Context - controller for flexibility changes
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.38.33
	 *
	 * @constructor
	 * @private
	 * @since 1.32
	 * @alias sap.ui.rta.controlAnalyzer.Base
	 * @experimental Since 1.32. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */

	var Base = ManagedObject.extend("sap.ui.rta.controlAnalyzer.Base", {
		constructor : function() {
			sap.ui.base.ManagedObject.prototype.constructor.apply(this, arguments);
			this._mAvailableElements = {};
			this._mHiddenElements = {};
		},
		metadata : {
			library : "sap.ui.rta",
			properties : {
				control : "sap.ui.core.Control",
				selectedControl : "sap.ui.core.Control",
				prepared : {
					type : "boolean",
					defaultValue : false
				}
			}
		}
	});

	Base.prototype._raiseIllegalState = function() {
		jQuery.sap.log.error("Illegal state, analyzer is not prepared");
	};

	Base.prototype.prepare = function() {
		this.setPrepared(true);
	};

	Base.prototype.getAvailableElements = function() {
		if (!this.getPrepared()) {
			this._raiseIllegalState();
		}
		return this._mAvailableElements;
	};

	Base.prototype.getHiddenElements = function() {
		if (!this.getPrepared()) {
			this._raiseIllegalState();
		}
		return this._mHiddenElements;
	};

	/**
	 * Adjust/translate change specific data from the generic format to a specific format of a special change handler
	 *
	 * @param {string}
	 *          sType the command type
	 * @param {object}
	 *          mSpecificChangeData
	 * @return {object} the adjusted/translated change specific data
	 */
	Base.prototype.mapSpecificChangeData = function(sType, mSpecificChangeData) {
		return mSpecificChangeData;
	};
	/**
	 * Calculate repository fields based on model and displayed data
	 *
	 * @param {sap.ui.core.Control}
	 *          oControl Currently selected control
	 * @private
	 */
	Base.prototype.getControlsFieldCollection = function(oControl) {
	};

	/*
	 * Creates an array of change data to be passed to FlexController @param {Object} oControl The currently checked or
	 * unchecked object containing the binding information @return {Array} aChangeData @private
	 */
	Base.prototype.createChangeData = function(oControl, oCurrentSelectedBlock, bHideControl) {
		return null;
	};

	/**
	 * TODO: to be deleted when ModelConverter will be removed
	 * Finds already bound and visible fields and saves the current label value
	 *
	 * @param {sap.ui.core.Control}
	 *          oControl Currently selected control
	 * @return {Object} visibleAndBoundFields: Lists of visible and bound fields, fieldsAndLabelNames: visible and
	 *         LabelValue fields
	 * @private
	 */
	Base.prototype.findVisibleAndBoundFieldsAndLabelNames = function(oControl) {
	};

	/**
	 * Checks if a custom field is available
	 *
	 * @param {sap.ui.core.Control}
	 *          oControl Currently selected control
	 * @return {Promise} true if custom fields are available, else false
	 * @private
	 */
	Base.prototype.isCustomFieldAvailable = function(oControl) {
		return Promise.resolve().then(function() {
			return false;
		});
	};

	/**
	 * Checks if a given aggregation in parent element is a valid target zone for moved element
	 *
	 * @param {sap.ui.core.Element}
	 *          oParentElement to validate as a valid parent
	 * @param {string}
	 *          sAggregationName in parent element to validate
	 * @param {sap.ui.core.Element}
	 *          oMovedElement element which is move
	 * @return {boolean} true if valid target zone
	 */
	Base.prototype.checkTargetZone = function(oParentElement, sAggregationName, oMovedElement) {
		return true;
	};

	Base.prototype.getFlexChangeType = function(sType, oElement) {
		return null;
	};

	/**
	 * @private
	 */
	Base.prototype.isEditable = function(oElement) {
		var bIsEditable;

		// this should be moved to control specific analyzers
		bIsEditable = aEDITABLE_TYPES.some(function(sType) {
			return ElementUtil.isInstanceOf(oElement, sType);
		});

		// is visible + has stable id
		if (bIsEditable) {
			bIsEditable = oElement.getVisible ? oElement.getVisible() : true;

			if (bIsEditable) {
				bIsEditable = FlexUtils.checkControlId(oElement);
			}
		}

		return bIsEditable;
	};

	/**
	 * @param  {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean}          true if parent has stable Id, false if not
	 * @private
	 */
	Base.prototype.hasParentStableId = function(oOverlay) {
		var oBlockOverlay = oOverlay.getParentElementOverlay();
		var oBlock = oBlockOverlay ? oBlockOverlay.getElementInstance() : null;

		return oBlock && FlexUtils.checkControlId(oBlock);
	};

	/**
	 * @private
	 */
	Base.prototype.isRenamable = function(oElement) {
		return this.isEditable(oElement) && this.getRenamableControl(oElement);
	};

	/**
	 * @private
	 */
	Base.prototype.getRenamableControl = function(oElement) {
		return null;
	};

	return Base;

}, /* bExport= */true);
