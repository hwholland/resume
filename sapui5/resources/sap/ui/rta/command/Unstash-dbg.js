/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/command/FlexCommand', "sap/ui/fl/changeHandler/UnstashControl"], function(FlexCommand,
		UnstashChangeHandler) {
	"use strict";

	/**
	 * Unstash a control/element
	 * 
	 * @class
	 * @extends sap.ui.rta.command.FlexCommand
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @private
	 * @since 1.38
	 * @alias sap.ui.rta.command.Unstash
	 * @experimental Since 1.38. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var Unstash = FlexCommand.extend("sap.ui.rta.command.Unstash", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				changeType : {
					type : "string",
					defaultValue : "unstashControl"
				},
				parentAggregationName : {
					type : "string",
					defaultValue : ""
				},
				index : {
					type : "integer",
					defaultValue : 0
				}
			},
			associations : {},
			events : {}
		}
	});

	Unstash.prototype.init = function() {
		this.setChangeHandler(UnstashChangeHandler);
	};

	/**
	 * @override
	 */
	 Unstash.prototype._getForwardFlexChange = function(oElement) {
		return this._getFlexChange();
	};

	/**
	 * @override
	 */
	Unstash.prototype._getBackwardFlexChange = function(oElement) {
		return this._getFlexChange();
	};

	Unstash.prototype._undoWithElement = function(oElement) {
		// TODO: should we call also a change handler here (StashControl), or better extend the PropertyChangeCommand
		// an set the property 'stashed' to true?
		oElement = sap.ui.getCore().byId(oElement.getId());
		this.setElement(oElement);
		oElement.setStashed(true);
		oElement.setVisible(false);
	};

	Unstash.prototype._getFlexChange = function(bForward) {
		var oChange = this._completeChangeContent({
			content : {
				parentAggregationName : this.getParentAggregationName(),
				index : this.getIndex()
			},
			changeType : this.getChangeType(),
			selectorElement : this.getElement()
		});

		return {
			change : oChange,
			selectorElement :this.getElement()
		};
	};

	Unstash.prototype.serialize = function() {
		return {
			changeType : this.getChangeType(),
			selector : {
				id : this._getElement().getId()
			},
			content : {
				parentAggregationName : this.getParentAggregationName(),
				index : this.getIndex()
			}
		};
	};

	return Unstash;

}, /* bExport= */true);
