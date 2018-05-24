/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides class sap.ui.rta.plugin.RTAElementMover.
sap.ui.define([
  'sap/ui/dt/plugin/ElementMover',
	'sap/ui/dt/OverlayUtil',
	'sap/ui/dt/ElementUtil',
	'sap/ui/fl/Utils',
	'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory',
	'sap/ui/rta/Utils'
],
function(ElementMover, OverlayUtil, ElementUtil, FlexUtils, ControlAnalyzerFactory, Utils) {
	"use strict";

	/**
	 * Constructor for a new RTAElementMover.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The RTAElementMover is responsible for the RTA specific adaption of element movements.
	 *
	 * @author SAP SE
	 * @version 1.38.33
	 *
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.plugin.RTAElementMover
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var RTAElementMover = ElementMover.extend("sap.ui.rta.plugin.RTAElementMover", /** @lends sap.ui.rta.plugin.RTAElementMover.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.rta",
			properties : {
				movableTypes : {
					type : "string[]",
					defaultValue : ["sap.ui.core.Element"]
				}
			},
			associations : {
			},
			events : {
			}
		}
	});

	/**
	 * @param  {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean}          true if parent has stable Id, false if not
	 * @private
	 */
	RTAElementMover.prototype._hasParentStableId = function(oOverlay) {
		var oBlockOverlay = oOverlay.getParentElementOverlay();
		var oBlock = oBlockOverlay ? oBlockOverlay.getElementInstance() : null;

		return oBlock && FlexUtils.checkControlId(oBlock);
	};

	/**
	 * @param  {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean}          true if embedded, false if not
	 * @override
	 */
	RTAElementMover.prototype.checkMovable = function(oOverlay) {
		var bMovable = ElementMover.prototype.checkMovable.apply(this, arguments);
		var oElement;
		var oControlAnalyzer;

		if (bMovable) {
			oElement = oOverlay.getElementInstance();
			oControlAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(oElement);
			bMovable = oControlAnalyzer.isEditable(oElement);

		}

		return bMovable && oControlAnalyzer.hasParentStableId(oOverlay);
	};

	/**
	 * Checks droppability for aggregation overlays
	 * @param  {sap.ui.dt.Overlay} oAggregationOverlay aggregation overlay object
	 * @return {boolean}                     true if aggregation overlay is droppable, false if not
	 * @override
	 */
	RTAElementMover.prototype.checkTargetZone = function(oAggregationOverlay) {
		var bTargetZone = ElementMover.prototype.checkTargetZone.call(this, oAggregationOverlay);

		if (bTargetZone) {
			var oMovedOverlay = this.getMovedOverlay();
			var oMovedElement = oMovedOverlay.getElementInstance();
			var oOverlay = oAggregationOverlay.getParent();
			var oParentElement = oOverlay.getElementInstance();
			var sAggregationName = oAggregationOverlay.getAggregationName();

			var oAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(oMovedElement);

			bTargetZone = oAnalyzer.isEditable(oParentElement) && oAnalyzer.checkTargetZone(oParentElement, sAggregationName, oMovedElement);
		}

		return bTargetZone;
	};

//	RTAElementMover.Default = new RTAElementMover();

	return RTAElementMover;
}, /* bExport= */ true);
