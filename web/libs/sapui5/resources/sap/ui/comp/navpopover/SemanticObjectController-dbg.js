/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.SemanticObjectController.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element', 'sap/ui/comp/personalization/Util', './Factory', 'sap/ui/model/json/JSONModel'
], function(jQuery, library, Element, PersonalizationUtil, Factory, JSONModel) {
	"use strict";

	/**
	 * Constructor for a new navpopover/SemanticObjectController.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SemanticObjectController allows the user to register against semantic object navigation events as well as define semantic objects
	 *        which should be ignored.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.SemanticObjectController
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SemanticObjectController = Element.extend("sap.ui.comp.navpopover.SemanticObjectController", /** @lends sap.ui.comp.navpopover.SemanticObjectController.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Comma-separated list of field names that must not be displayed as links.
				 * 
				 * @since 1.28.0
				 */
				ignoredFields: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * If set to <code>true</code>, the SemanticObjectController will retrieve all navigation targets once and will disable links for
				 * which no targets were found. Setting this value to <code>true</code> will trigger an additional roundtrip.
				 * 
				 * @since 1.28.0
				 */
				prefetchNavigationTargets: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Maps the field names to the related semantic objects. When accessing this property for the first time, the mapping will be
				 * calculated from the metadata within the provided model.
				 * 
				 * @since 1.28.0
				 */
				fieldSemanticObjectMap: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * The name of the entity set used. If <code>entitySet</code> has not been defined, the SemanticObjectController tries to retrieve
				 * the name from its parents. <b>Note:</b> This is not a dynamic UI5 property.
				 * 
				 * @since 1.28.0
				 */
				entitySet: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			events: {

				/**
				 * After the navigation targets have been retrieved, <code>navigationTargetsObtained</code> is fired and makes it possible you to
				 * change the targets.
				 * 
				 * @since 1.28.0
				 */
				navigationTargetsObtained: {
					parameters: {
						/**
						 * The main navigation object.
						 */
						mainNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * Array of available navigation target objects.
						 */
						actions: {
							type: "sap.ui.comp.navpopover.LinkData[]"
						},

						/**
						 * The navigation object for the own application. This navigation option is by default not visible on the popover.
						 */
						ownNavigation: {
							type: "sap.ui.comp.navpopover.LinkData"
						},

						/**
						 * The semantic object for which the navigation targets have been retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * The ID of the control that fires this event. If <code>navigationTargetsObtained</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If
						 * <code>navigationTargetsObtained</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function shows the actual navigation popover. If the <code>navigationTargetsObtained</code> has been
						 * registered, the <code>show</code> function has to be called manually in order to open the navigation popover. Signatures:
						 * <code>show()</code>
						 *  <code>show(oMainNavigation, aAvailableActions, oExtraContent)</code>
						 *  <code>show(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent)</code>
						 * Parameters:
						 * <ul>
						 * <li>{string} sMainNavigationId The visible text for the main navigation section. If empty, the main navigation ID is
						 * calculated using binding context of given source object (such as SmartLink).</li>
						 * <li>{sap.ui.comp.navpopover.LinkData} oMainNavigation The main navigation object. If empty, property
						 * <code>mainNavigation</code> will be used.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[]} aAvailableActions Array containing the cross-application navigation links. If
						 * empty, property <code>actions</code> will be used.</li>
						 * <li>{sap.ui.core.Control} oExtraContent Control that will be displayed in extra content section on the popover.</li>
						 * </ul>
						 */
						show: {
							type: "function"
						}
					}
				},

				/**
				 * Event is fired before the navigation popover opens and before navigation target links are retrieved. Event can be used to change
				 * the parameters used to retrieve the navigation targets. In case of SmartLink, <code>beforePopoverOpens</code> is fired after the
				 * link has been clicked.
				 * 
				 * @since 1.28.0
				 */
				beforePopoverOpens: {
					parameters: {
						/**
						 * The semantic object for which the navigation targets will be retrieved.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes calculated from the binding that will be used to retrieve the navigation targets.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * This callback function enables you to define a changed semantic attributes map. Signatures:
						 * <code>setSemanticAttributes(oSemanticAttributesMap)</code> Parameter:
						 * <ul>
						 * <li>{object} oSemanticAttributesMap New map containing the semantic attributes to be used.</li>
						 * </ul>
						 */
						setSemanticAttributes: {
							type: "function"
						},

						/**
						 * This callback function sets an application state key that is used over the cross-application navigation. Signatures:
						 * <code>setAppStateKey(sAppStateKey)</code> Parameter:
						 * <ul>
						 * <li>{string} sAppStateKey</li>
						 * </ul>
						 */
						setAppStateKey: {
							type: "function"
						},

						/**
						 * The ID of the control that fires this event. If <code>beforePopoverOpens</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is also the SmartLink's ID. If the
						 * <code>beforePopoverOpens</code> is registered on the SemanticObjectController, <code>originalId</code> helps to
						 * identify the original SmartLink control which triggered the event.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and leads to the opening of the navigation popover.
						 * Signatures: <code>open()</code> If <code>beforePopoverOpens</code> has been registered, <code>open</code> function
						 * has to be called manually in order to open the navigation popover.
						 */
						open: {
							type: "function"
						}
					}
				},

				/**
				 * This event is fired after a navigation link on the navigation popover has been clicked. This event is only fired, if the user
				 * left-clicks the link. Right-clicking the link and selecting 'Open in New Window' etc. in the context menu does not fire the event.
				 * 
				 * @since 1.28.0
				 */
				navigate: {
					parameters: {
						/**
						 * The UI text shown in the clicked link.
						 */
						text: {
							type: "string"
						},

						/**
						 * The navigation target of the clicked link.
						 */
						href: {
							type: "string"
						},

						/**
						 * The semantic object used to retrieve this target.
						 */
						semanticObject: {
							type: "string"
						},

						/**
						 * Map containing the semantic attributes used to retrieve this target.
						 */
						semanticAttributes: {
							type: "object"
						},

						/**
						 * The ID of the control that fires this event. If <code>navigate</code> is registered on the SmartLink,
						 * <code>originalId</code> is the same as the event's source ID which is the SmartLink's ID. If <code>navigate</code> is
						 * registered on the SemanticObjectController, <code>originalId</code> helps to identify the original SmartLink control
						 * which triggered the event.
						 */
						originalId: {
							type: "string"
						}
					}
				},

				/**
				 * If the property <code>prefetchNavigationTargets</code> is set to <code>true</code>, event <code>prefetchDone</code> is fired
				 * after all navigation targets have been retrieved.
				 * 
				 * @since 1.28.0
				 */
				prefetchDone: {
					parameters: {
						/**
						 * A map containing all semantic objects as keys for which at least one navigation target has been found. The value for each
						 * semantic object key is an array containing the available actions found for this semantic object.
						 */
						semanticObjects: {
							type: "object"
						}
					}
				}
			}
		}
	});

	// Fill 'oSemanticObjects' as soon as possible
	SemanticObjectController.oSemanticObjects = {};
	SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = false;
	SemanticObjectController.oPromise;

	SemanticObjectController.prototype.init = function() {
		SemanticObjectController.prefetchDistinctSemanticObjects();
		
		this._proxyOnBeforePopoverOpens = jQuery.proxy(this._onBeforePopoverOpens, this);
		this._proxyOnTargetsObtained = jQuery.proxy(this._onTargetsObtained, this);
		this._proxyOnNavigate = jQuery.proxy(this._onNavigate, this);
		this._aRegisteredControls = [];
	};

	/**
	 * Adds the given control to the SemanticObjectController and registers all relevant events.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSmartLink
	 * @public
	 */
	SemanticObjectController.prototype.registerControl = function(oSmartLink) {
//		if (!(oSmartLink instanceof sap.ui.comp.navpopover.SmartLink)) {
//			jQuery.sap.log.warning("SemanticObjectController: " + (oSmartLink.getMetadata ? oSmartLink.getMetadata() : "parameter") + " is not of SmartLink instance");
//			return;
//		}
		if (oSmartLink.attachBeforePopoverOpens && !oSmartLink.hasListeners("beforePopoverOpens")) {
			oSmartLink.attachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oSmartLink.attachNavigationTargetsObtained && !oSmartLink.hasListeners("navigationTargetsObtained")) {
			oSmartLink.attachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oSmartLink.attachInnerNavigate && !oSmartLink.hasListeners("innerNavigate")) {
			oSmartLink.attachInnerNavigate(this._proxyOnNavigate);
		}

		this._aRegisteredControls.push(oSmartLink);
	};

	/**
	 * Removes the given control from the SemanticObjectController and unregisters all relevant events.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSmartLink
	 * @public
	 */
	SemanticObjectController.prototype.unregisterControl = function(oSmartLink) {
		if (oSmartLink.detachBeforePopoverOpens) {
			oSmartLink.detachBeforePopoverOpens(this._proxyOnBeforePopoverOpens);
		}
		if (oSmartLink.detachNavigationTargetsObtained) {
			oSmartLink.detachNavigationTargetsObtained(this._proxyOnTargetsObtained);
		}

		if (oSmartLink.detachInnerNavigate) {
			oSmartLink.detachInnerNavigate(this._proxyOnNavigate);
		}

		this._aRegisteredControls.pop(oSmartLink);
	};

	/**
	 * Eventhandler before navigation popover opens
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onBeforePopoverOpens = function(oEvent) {
		var oParameters = oEvent.getParameters();

		if (this.hasListeners("beforePopoverOpens")) {
			this.fireBeforePopoverOpens({
				semanticObject: oParameters.semanticObject,
				semanticAttributes: oParameters.semanticAttributes,
				setSemanticAttributes: oParameters.setSemanticAttributes,
				setAppStateKey: oParameters.setAppStateKey,
				originalId: oParameters.originalId,
				open: oParameters.open
			});
		} else {
			oParameters.open();
		}
	};

	/**
	 * Eventhandler after navigation targets have been retrieved.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onTargetsObtained = function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (this.hasListeners("navigationTargetsObtained")) {
			// var oSource = oEvent.getSource();
			this.fireNavigationTargetsObtained({
				semanticObject: oParameters.semanticObject,// oSource.getSemanticObject(),
				semanticAttributes: oParameters.semanticAttributes, // oSource.getSemanticAttributes(),
				actions: oParameters.actions,
				mainNavigation: oParameters.mainNavigation,
				ownNavigation: oParameters.ownNavigation,
				originalId: oParameters.originalId,
				show: oParameters.show
			});
		} else {
			oParameters.show();
		}
	};

	/**
	 * Eventhandler after navigation has been triggered.
	 * 
	 * @param {object} oEvent the event parameters.
	 * @private
	 */
	SemanticObjectController.prototype._onNavigate = function(oEvent) {
		var oParameters = oEvent.getParameters();
		this.fireNavigate({
			text: oParameters.text,
			href: oParameters.href,
			originalId: oParameters.originalId,
			semanticObject: oParameters.semanticObject,
			semanticAttributes: oParameters.semanticAttributes
		});
	};

	/**
	 * Checks if the given SmartLink has to be enabled or disabled and sets the state.
	 * 
	 * @param {sap.ui.comp.navpopover.SmartLink} oSmartLink the SmartLink which should be enabled or disabled.
	 * @public
	 */
	SemanticObjectController.prototype.setIgnoredState = function(oSmartLink) {
		if (oSmartLink instanceof sap.ui.comp.navpopover.SmartLink) {
			oSmartLink._updateEnabled();
		}
	};

	SemanticObjectController.prototype.setIgnoredFields = function(sIgnoredFields) {
		this.setProperty("ignoredFields", sIgnoredFields);

		this._aRegisteredControls.forEach(function(oRegisteredControl) {
			oRegisteredControl._updateEnabled();
		});
		return this;
	};

	SemanticObjectController.prototype.setPrefetchNavigationTargets = function(bPrefetch) {
		this.setProperty("prefetchNavigationTargets", bPrefetch);

		if (bPrefetch !== true) {
			return this;
		}

		var that = this;
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			that.firePrefetchDone({
				semanticObjects: oSemanticObjects
			});
		});

		return this;
	};

	SemanticObjectController.prototype.getFieldSemanticObjectMap = function() {
		var oMap = this.getProperty("fieldSemanticObjectMap");
		if (oMap) {
			return oMap;
		}

		if (!this.getEntitySet()) {
			jQuery.sap.log.warning("FieldSemanticObjectMap is not set on SemanticObjectController, retrieval without EntitySet not possible");
			return null;
		}

		jQuery.sap.require("sap.ui.comp.odata.MetadataAnalyser");
		var oMetadataAnalyzer = new sap.ui.comp.odata.MetadataAnalyser(this.getModel());
		oMap = oMetadataAnalyzer.getFieldSemanticObjectMap(this.getEntitySet());
		if (oMap) {
			this.setProperty("fieldSemanticObjectMap", oMap, true);
		}

		return oMap;
	};

	SemanticObjectController.prototype.getEntitySet = function() {
		var sEntitySet = this.getProperty("entitySet");
		if (sEntitySet) {
			return sEntitySet;
		}

		var oParent = this.getParent();
		while (oParent) {
			if (oParent.getEntitySet) {
				sEntitySet = oParent.getEntitySet();
				if (sEntitySet) {
					this.setProperty("entitySet", sEntitySet, true);
					break;
				}
			}
			oParent = oParent.getParent();
		}

		return sEntitySet;
	};

	/**
	 * Checks if the given semantic object name has a navigation link. <b>Note</b>: this method returns a valid value only after the event
	 * <code>prefetchDone</code> has been raised. The event <code>prefetchDone</code> is raised if the property
	 * <code>prefetchNavigationTargets</code> is set to <code>true</code>.
	 * 
	 * @param {string} sSemanticObject
	 * @returns {boolean} true if the semantic object has known navigation links
	 * @public
	 */
	SemanticObjectController.prototype.hasSemanticObjectLinks = function(sSemanticObject) {
		return SemanticObjectController.hasDistinctSemanticObject(sSemanticObject, SemanticObjectController.oSemanticObjects);
	};

	/**
	 * @private
	 */
	SemanticObjectController.hasDistinctSemanticObject = function(sSemanticObject, oSemanticObjects) {
		return !!oSemanticObjects[sSemanticObject];
	};

	/**
	 * @private
	 */
	SemanticObjectController.prefetchDistinctSemanticObjects = function() {
		SemanticObjectController.getJSONModel();
		if (!SemanticObjectController.bHasPrefetchedDistinctSemanticObjects) {
			SemanticObjectController.getDistinctSemanticObjects();
		}
	};

	/**
	 * Static method which calls asynchronous CrossApplicationNavigation.
	 * 
	 * @returns: {jQuery.Deferred.promise}
	 * @private
	 */
	SemanticObjectController.getDistinctSemanticObjects = function() {
		if (SemanticObjectController.bHasPrefetchedDistinctSemanticObjects) {
			return new Promise(function(resolve) {
				return resolve(SemanticObjectController.oSemanticObjects);
			});
		}
		if (!SemanticObjectController.oPromise) {
			SemanticObjectController.oPromise = new Promise(function(resolve) {
				var oCrossAppNav = Factory.getService("CrossApplicationNavigation");
				var oURLParsing = Factory.getService("URLParsing");
				if (!oCrossAppNav || !oURLParsing) {
					SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = true;
					return resolve({});
				}
				oCrossAppNav.getDistinctSemanticObjects().done(function(aSemanticObjects) {
					aSemanticObjects.forEach(function(sSemanticObject_) {
						SemanticObjectController.oSemanticObjects[sSemanticObject_] = {};
					});
					var oModel = SemanticObjectController.getJSONModel();
					oModel.setProperty("/distinctSemanticObjects", SemanticObjectController.oSemanticObjects);
					SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = true;
					return resolve(SemanticObjectController.oSemanticObjects);
				});
			});
		}
		return SemanticObjectController.oPromise;
	};

	/**
	 * @private
	 */
	SemanticObjectController.getJSONModel = function() {
		var oModel = sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");
		if (oModel && !jQuery.isEmptyObject(oModel.getData())) {
			return oModel;
		}
		oModel = new JSONModel({
			distinctSemanticObjects: {}
		});
		oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
		oModel.setSizeLimit(1000);
		sap.ui.getCore().setModel(oModel, "$sapuicompSemanticObjectController_DistinctSemanticObjects");
		return oModel;
	};

	/**
	 * @private
	 */
	SemanticObjectController.destroyDistinctSemanticObjects = function() {
		SemanticObjectController.oSemanticObjects = {};
		SemanticObjectController.oPromise = null;
		SemanticObjectController.bHasPrefetchedDistinctSemanticObjects = false;

		// destroy model and its data
		var oModel = sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");
		if (oModel) {
			oModel.destroy();
		}
	};

	return SemanticObjectController;

}, /* bExport= */true);
