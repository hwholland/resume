/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	"jquery.sap.global", "sap/ui/core/Component", "sap/ui/fl/ChangePersistence", "sap/ui/fl/Utils"
], function(jQuery, Component, ChangePersistence, Utils) {
	"use strict";

	/**
	 * Factory to get or create a new instances of {sap.ui.fl.ChangePersistence}
	 * @constructor
	 * @alias sap.ui.fl.ChangePersistenceFactory
	 * @experimental Since 1.27.0
	 * @author SAP SE
	 * @version 1.38.33
	 */
	var ChangePersistenceFactory = {};

	ChangePersistenceFactory._instanceCache = {};

	/**
	 * Creates or returns an instance of the ChangePersistence
	 * @param {String} sComponentName The name of the component
	 * @returns {sap.ui.fl.ChangePersistence} instance
	 *
	 * @public
	 */
	ChangePersistenceFactory.getChangePersistenceForComponent = function(sComponentName) {
		var oChangePersistence;

		if (!ChangePersistenceFactory._instanceCache[sComponentName]) {
			oChangePersistence = new ChangePersistence(sComponentName);
			ChangePersistenceFactory._instanceCache[sComponentName] = oChangePersistence;
		}

		return ChangePersistenceFactory._instanceCache[sComponentName];
	};

	/**
	 * Creates or returns an instance of the ChangePersistence for the component of the specified control.
	 * The control needs to be embedded into a component.
	 * @param {sap.ui.core.Control} oControl The control for example a SmartField, SmartGroup or View
	 * @returns {sap.ui.fl.ChangePersistence} instance
	 *
	 * @public
	 */
	ChangePersistenceFactory.getChangePersistenceForControl = function(oControl) {
		var sComponentId;
		sComponentId = this._getComponentClassNameForControl(oControl);
		return ChangePersistenceFactory.getChangePersistenceForComponent(sComponentId);
	};

	/**
	 * Returns the name of the component of the control
	 * @param {sap.ui.core.Control} oControl Control
	 * @returns {String} The name of the component. Undefined if no component was found
	 *
	 * @private
	 */
	ChangePersistenceFactory._getComponentClassNameForControl = function(oControl) {
		return Utils.getComponentClassName(oControl);
	};

	/**
	 * Registers the ChangePersistenceFactory._onManifestLoaded to the Component loading functionality
	 *
	 * @since 1.38
	 * @private
	 */
	ChangePersistenceFactory.registerManifestLoadedEventHandler = function () {
		Component._fnManifestLoadCallback = this._onManifestLoaded;
	};


	/**
	 * Callback which is called within the early state of Component processing.
	 * Already triggers the loading of the flexiblity changes if the loaded manifest is an application variant.
	 *
	 * @param oManifest the loaded manifest
	 * @param aAsyncHints async hints passed from the app index to the core Component processing
	 * @since 1.38
	 * @private
	 */
	ChangePersistenceFactory._onManifestLoaded = function (oManifest, aAsyncHints) {
		if (oManifest && oManifest["sap.app"] && oManifest["sap.app"].type === "application"
				&& aAsyncHints && aAsyncHints.requests && Array.isArray(aAsyncHints.requests)) {
			var oFlAsyncHint = aAsyncHints.requests.find(this._flAsyncHintMatches);
			if (oFlAsyncHint) {
				var sComponentName = oFlAsyncHint.reference;
				var sCacheKey = oFlAsyncHint.cachebusterToken;
				var oChangePersistence = this.getChangePersistenceForComponent(sComponentName);
				oChangePersistence.getChangesForComponent({
					"cacheKey": sCacheKey || "<NO CHANGES>"
				});
			}
		}
	};

	ChangePersistenceFactory._flAsyncHintMatches = function (oAsyncHintRequest) {
		return oAsyncHintRequest.name === "sap.ui.fl.changes";
	};

	return ChangePersistenceFactory;
}, true);
