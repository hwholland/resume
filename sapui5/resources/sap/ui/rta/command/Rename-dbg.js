/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/rta/command/FlexCommand',
		'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory', "sap/ui/comp/smartform/flexibility/changes/RenameGroup",
		"sap/ui/comp/smartform/flexibility/changes/RenameField", "sap/ui/fl/Change"], function(jQuery, FlexCommand,
		ControlAnalyzerFactory, RenameGroupChangeHandler, RenameFieldChangeHandler, Change) {
	"use strict";

	/**
	 * Rename Element from one place to another
	 * 
	 * @class
	 * @extends sap.ui.rta.command.FlexCommand
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.command.Rename
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var Rename = FlexCommand.extend("sap.ui.rta.command.Rename", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				newValue : {
					type : "string",
					defaultValue : "new text"
				},
				oldValue : {
					type : "string",
					defaultValue : undefined
				}
			},
			associations : {},
			events : {}
		}
	});

	Rename.FORWARD = true;
	Rename.BACKWARD = false;

	Rename.prototype._getSpecificChangeInfo = function(bForward) {

		var oElement = this.getElement();
		var mSpecificInfo = {};

		mSpecificInfo.selector = {};
		mSpecificInfo.selector.id = oElement.getId();
		mSpecificInfo.value = bForward ? this.getNewValue() : this.getOldValue();
		mSpecificInfo.changeType = this.getChangeType();
		mSpecificInfo.element = oElement;

		// Rewrite the change info according to the element type
		var oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(this._getElement());
		if (oControlAnalyzer) {
			mSpecificInfo = oControlAnalyzer.mapSpecificChangeData("Rename", mSpecificInfo);
		}
		return mSpecificInfo;

	};

	/**
	 * @override
	 */
	Rename.prototype.execute = function() {
		this._rememberOldValue();
		FlexCommand.prototype.execute.apply(this, arguments);
	};

	/**
	 * @override
	 */
	Rename.prototype.undo = function() {
		FlexCommand.prototype.undo.apply(this, arguments);
		this._rememberOldValue();
	};

	Rename.prototype._rememberOldValue = function() {
		var oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(this.getElement());
		if (oControlAnalyzer) {
			var sText = oControlAnalyzer.getLabel(this.getElement());
			if (sText !== null) {
				this.setOldValue(sText);
			}
		}
	};

	Rename.prototype._getFlexChange = function(bForward, oElement) {
		var mSpecificChangeInfo = this._getSpecificChangeInfo(bForward);

		var oChange = this._completeChangeContent(mSpecificChangeInfo);

		return {
			change : oChange,
			selectorElement : oElement
		};
	};

	/**
	 * @overrideR
	 */
	Rename.prototype._getForwardFlexChange = function(oElement) {
		return this._getFlexChange(Rename.FORWARD, oElement);
	};

	/**
	 * @override
	 */
	Rename.prototype._getBackwardFlexChange = function(oElement) {
		return this._getFlexChange(Rename.BACKWARD, oElement);
	};
	
	Rename.prototype._undoWithElement = function(oElement) {
		FlexCommand.prototype._undoWithElement.apply(this, arguments);
		var oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(oElement);
		var sBindingValue = "";
		if (oControlAnalyzer) {
			var oBindingInfo = oControlAnalyzer.getLabelBinding(this.getElement());
			if (oBindingInfo) {
				sBindingValue = oBindingInfo.binding.getValue();
				if (sBindingValue === this.getOldValue()) {
					oControlAnalyzer.resumeLabelBinding(oElement);
				}
			}
		}
		
	};
	
	/**
	 * @override
	 */
	Rename.prototype.serialize = function() {
		return this._getSpecificChangeInfo(Rename.FORWARD);
	};

	return Rename;

}, /* bExport= */true);
