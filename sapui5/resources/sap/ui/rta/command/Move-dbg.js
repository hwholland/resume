/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/rta/command/FlexCommand',
		'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory', "sap/ui/fl/changeHandler/MoveElements"],
		function(jQuery, FlexCommand, ControlAnalyzerFactory, MoveElementsChangeHandler) {
			"use strict";

			/**
			 * Move Element from one place to another
			 *
			 * @class
			 * @extends sap.ui.rta.command.FlexCommand
			 * @author SAP SE
			 * @version 1.38.33
			 * @constructor
			 * @private
			 * @since 1.34
			 * @alias sap.ui.rta.command.Move
			 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API
			 *               might be changed in future.
			 */
			var Move = FlexCommand.extend("sap.ui.rta.command.Move", {
				metadata : {
					library : "sap.ui.rta",
					properties : {
						movedElements : {
							type : "array"
						},
						target : {
							type : "object"
						},
						source : {
							type : "object"
						},
						changeType : {
							type : "string",
							defaultValue : "moveElements"
						}
					},
					associations : {},
					events : {}
				}
			});

			Move.prototype.init = function() {
				this.setChangeHandler(MoveElementsChangeHandler);
			};

			Move.FORWARD = true;
			Move.BACKWARD = false;

			Move.prototype._getSpecificChangeInfo = function(bForward) {
				var mSource = bForward ? this.getSource() : this.getTarget();
				var mTarget = bForward ? this.getTarget() : this.getSource();
				var oSourceParent = mSource.parent || sap.ui.getCore().byId(mSource.id);

				// replace elements by their id, unify format and help with serialization
				if (mSource.parent) {
					mSource.id = mSource.parent.getId();
					delete mSource.parent;
				}
				if (mTarget.parent) {
					mTarget.id = mTarget.parent.getId();
					delete mTarget.parent;
				}
				var mSpecificInfo = {
					changeType : this.getChangeType(),
					source : mSource,
					target : mTarget,
					movedElements : []
				};

				this.getMovedElements().forEach(function(mMovedElement) {
					mSpecificInfo.movedElements.push({
						id : mMovedElement.id || mMovedElement.element.getId(),
						sourceIndex : bForward ? mMovedElement.sourceIndex : mMovedElement.targetIndex,
						targetIndex : bForward ? mMovedElement.targetIndex : mMovedElement.sourceIndex
					});
				});

				var oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(oSourceParent);
				if (oControlAnalyzer) {
					mSpecificInfo = oControlAnalyzer.mapSpecificChangeData("Move", mSpecificInfo);
				}

				return {
					data : mSpecificInfo,
					sourceParent : oSourceParent
				};
			};

			Move.prototype._getFlexChange = function(bForward) {
				var mSpecificChangeInfo = this._getSpecificChangeInfo(bForward);

				var oChange = this._completeChangeContent(mSpecificChangeInfo.data);

				return {
					change : oChange,
					selectorElement : mSpecificChangeInfo.sourceParent
				};
			};

			/**
			 * @override
			 */
			Move.prototype._getForwardFlexChange = function(oElement) {
				return this._getFlexChange(Move.FORWARD);
			};

			/**
			 * @override
			 */
			Move.prototype._getBackwardFlexChange = function(oElement) {
				return this._getFlexChange(Move.BACKWARD);
			};

			/**
			 * @override
			 */
			Move.prototype.serialize = function() {
				return this._getSpecificChangeInfo(Move.FORWARD).data;
			};

			return Move;

		}, /* bExport= */true);
