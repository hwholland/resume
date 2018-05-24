/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides class sap.ui.rta.plugin.Hide.
sap.ui.define([
	'sap/ui/dt/Plugin'
], function(Plugin) {
	"use strict";

	/**
	 * Constructor for a new Hide Plugin.
	 * 
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @class The Hide allows trigger hide operations on the overlay
	 * @extends sap.ui.dt.Plugin
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.plugin.Hide
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var Hide = Plugin.extend("sap.ui.rta.plugin.Hide", /** @lends sap.ui.rta.plugin.Hide.prototype */
	{
		metadata: {
			// ---- object ----

			// ---- control specific ----
			library: "sap.ui.rta",
			properties: {},
			associations: {},
			events: {
				hideElement: {}
			}
		}
	});

	/**
	 * Register browser event for an overlay
	 * 
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @override
	 */
	Hide.prototype.registerElementOverlay = function(oOverlay) {
		oOverlay.attachBrowserEvent("keydown", this._onKeyDown, this);
	};

	/**
	 * Detaches the browser events
	 * 
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @override
	 */
	Hide.prototype.deregisterElementOverlay = function(oOverlay) {
		oOverlay.detachBrowserEvent("keydown", this._onKeyDown, this);
	};

	/**
	 * Handle keydown event
	 * 
	 * @param {sap.ui.base.Event} oEvent event object
	 * @private
	 */
	Hide.prototype._onKeyDown = function(oEvent) {
		if (oEvent.keyCode === jQuery.sap.KeyCodes.DELETE) {
			oEvent.stopPropagation();
			this.hideElement();
		}
	};

	/**
	 * The selected (not the focused) element should be hidden!
	 * 
	 * @private
	 */
	Hide.prototype.hideElement = function() {
		var oDesignTime = this.getDesignTime();
		var aSelection = oDesignTime.getSelection();
		if (aSelection.length > 0) {
			this.fireHideElement({
				selectedOverlays: aSelection
			});
		}
	};

	return Hide;
}, /* bExport= */true);
