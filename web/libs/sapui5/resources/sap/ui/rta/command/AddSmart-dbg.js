/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/rta/command/FlexCommand',
		'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory'], function(jQuery, FlexCommand, ControlAnalyzerFactory) {
	"use strict";

	/**
	 * Add new group / group element to a smart form
	 *
	 * @class
	 * @extends sap.ui.rta.command.FlexCommand
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.command.AddSmart
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var AddSmart = FlexCommand.extend("sap.ui.rta.command.AddSmart", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				source : {
					type : "object"
				},
				index : {
					type : "number"
				},
				newControlId : {
					type : "string"
				},
				labels : {
					type : "array"
				},
				jsTypes : {
					type : "array"
				},
				fieldValues : {
					type : "array"
				},
				valuePropertys : {
					type : "array"
				}
			},
			associations : {},
			events : {}
		}
	});

	AddSmart.prototype._getSpecificChangeInfo = function() {
		// general format
		var mSpecificInfo = {
			changeType : this.getChangeType(),
			selector : {
				id : this._getElement().getId()
			},
			index : this.getIndex(),
			newControlId : this.getNewControlId(),
			labels : this.getLabels()
		};

		// optional properties (e.g. add fields specific)
		if (this.getJsTypes()) {
			mSpecificInfo.jsTypes = this.getJsTypes();
		}
		if (this.getFieldValues()) {
			mSpecificInfo.fieldValues = this.getFieldValues();
		}
		if (this.getValuePropertys()) {
			mSpecificInfo.valueProperty = this.getValuePropertys();
		}

		var oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(this._getElement());
		if (oControlAnalyzer) {
			mSpecificInfo = oControlAnalyzer.mapSpecificChangeData("Add", mSpecificInfo);
		}

		return mSpecificInfo;
	};

	AddSmart.prototype._getFlexChange = function() {
		var mSpecificChangeInfo = this._getSpecificChangeInfo();

		var oChange = this._completeChangeContent(mSpecificChangeInfo);

		return {
			change : oChange,
			selectorElement : this._getElement()
		};
	};

	/**
	 * @override
	 */
	AddSmart.prototype._getForwardFlexChange = function(oElement) {
		return this._getFlexChange();
	};

	/**
	 * @override
	 */
	AddSmart.prototype.undo = function() {
		var sAddedControlId = this.getNewControlId();
		var oAddedControl = sap.ui.getCore().byId(sAddedControlId);
		if (oAddedControl) {
			// TODO check this logic, when deserializing stack
			oAddedControl.destroy();
		}
	};

	/**
	 * @override
	 */
	AddSmart.prototype.serialize = function() {
		return this._getSpecificChangeInfo();
	};

	return AddSmart;

}, /* bExport= */true);
