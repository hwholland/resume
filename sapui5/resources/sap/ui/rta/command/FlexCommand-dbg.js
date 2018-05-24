/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/BaseCommand', "sap/ui/fl/FlexControllerFactory",
		"sap/ui/fl/changeHandler/JsControlTreeModifier", "sap/ui/fl/Utils"],
	function(BaseCommand, FlexControllerFactory, JsControlTreeModifier, Utils) {
	"use strict";

	/**
	 * Basic implementation for the flexibility commands, that use a flex change handler.
	 *
	 * @class
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.38.33
	 *
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.command.FlexCommand
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var FlexCommand = BaseCommand.extend("sap.ui.rta.command.FlexCommand", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				changeHandler : {
					type : "object"
				},
				changeType : {
					type : "string"
				}
			},
			associations : {},
			events : {}
		}
	});

	FlexCommand.FORWARD = true;
	FlexCommand.BACKWARD = false;

	FlexCommand.prototype.getPreparedChange = function(bForward) {
		// if nothing is specified deliver the forward case
		var bForward = (bForward === true || bForward === false) ? bForward : true;
		if (bForward) {
			return this._forwardPreparedChange;
		} else {
			return this._backwardPreparedChange;
		}
	};

	FlexCommand.prototype.setPreparedChange = function(oChange, bForward) {
		if (bForward) {
			this._forwardPreparedChange = oChange;
		} else {
			this._backwardPreparedChange = oChange;
		}
	};

	FlexCommand.prototype._executeWithElement = function(oElement) {
		var mChange = this._getForwardFlexChange(oElement);
		var oAppComponent = Utils.getAppComponentForControl(this.getElement());
		this.getChangeHandler().applyChange(mChange.change, mChange.selectorElement, {
			modifier: JsControlTreeModifier,
			appComponent: oAppComponent
		});
	};

	FlexCommand.prototype._getForwardFlexChange = function(oElement) {
		return {
			change : {},
			selectorElement : oElement
		};
	};

	FlexCommand.prototype._undoWithElement = function(oElement) {
		var oPreparedChange = this.getPreparedChange(FlexCommand.BACKWARD);
		if (!oPreparedChange) {
			var oChangeHandler = this.getChangeHandler();
			if (oChangeHandler.getInverseChange) {
				// In case the flexhandler supports computation of inverse change and given the command has already been
				// executed:
				var oForwardChange = this.getPreparedChange(FlexCommand.FORWARD);
				oPreparedChange = {
					change : oChangeHandler.getInverseChange(oForwardChange.change, oForwardChange.selectorElement,
							JsControlTreeModifier),
					selectorElement : oForwardChange.selectorElement
				};
				this.setPreparedChange(oPreparedChange, FlexCommand.BACKWARD);
			} else {
				oPreparedChange = this._getBackwardFlexChange(oElement);
			}
		}
		if (oPreparedChange) {
			var oAppComponent = Utils.getAppComponentForControl(this.getElement());
			this.getChangeHandler().applyChange(oPreparedChange.change, oPreparedChange.selectorElement,
				{
					modifier: JsControlTreeModifier,
					appComponent : oAppComponent
				});
		} else {
			jQuery.log.warning("Undo functionality not supported for element with id " + oElement.getId());
		}

	};

	FlexCommand.prototype._getBackwardFlexChange = function(oElement) {
	};

	FlexCommand.prototype._completeChangeContent = function(mSpecificChangeInfo) {
		var oFlexController = FlexControllerFactory.createForControl(this.getElement());
		return oFlexController.createChange(mSpecificChangeInfo, this.getElement());
	};

	return FlexCommand;

}, /* bExport= */true);
