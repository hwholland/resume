/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.NavigationPopoverHandler.
sap.ui.define([
	'jquery.sap.global', "sap/ui/base/ManagedObject", './LinkData', 'sap/ui/model/json/JSONModel', 'sap/ui/core/Control'
], function(jQuery, ManagedObject, LinkData, JSONModel, Control) {
	"use strict";

	/**
	 * Constructor for a new navpopover/NavigationPopoverHandler.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class The NavigationPopoverHandler control uses a semantic object to display
	 *        {@link sap.ui.comp.navpopover.NavigationPopover NavigationPopover} for further navigation steps.
	 * @extends sap.ui.base.ManagedObject
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.NavigationPopoverHandler
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NavigationPopoverHandler = ManagedObject.extend("sap.ui.comp.navpopover.NavigationPopoverHandler", /** @lends sap.ui.comp.navpopover.NavigationPopoverHandler.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Name of semantic object which is used to fill the navigation popover.
				 *
				 * @since 1.36.0
				 */
				semanticObject: {
					type: "string",
					defaultValue: null
				},

				/**
				 * The semantic object controller controls events for several NavigationPopoverHandler controls. If the controller is not set
				 * manually, it tries to find a SemanticObjectController in its parent hierarchy.
				 *
				 * @since 1.36.0
				 */
				semanticObjectController: {
					type: "any",
					defaultValue: null
				},

				/**
				 * The metadata field name for this NavigationPopoverHandler control.
				 *
				 * @since 1.36.0
				 */
				fieldName: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Shown label of semantic object.
				 *
				 * @since 1.36.0
				 */
				semanticObjectLabel: {
					type: "string",
					defaultValue: null
				},

				/**
				 * If set to <code>false</code>, the NavigationPopoverHandler control will not replace its field name with the according
				 * <code>semanticObject</code> property during the calculation of the semantic attributes. This enables the usage of several
				 * NavigationPopoverHandler on the same semantic object.
				 */
				mapFieldToSemanticObject: {
					type: "boolean",
					defaultValue: true
				},

				/**
				 * Map containing the semantic attributes calculated from the binding that will be used to retrieve the navigation targets.
				 *
				 * @since 1.38.0
				 */
				semanticAttributes: {
					type: "object",
					visibility: "hidden",
					defaultValue: null
				}
			},
			associations: {
				/**
				 * The parent control.
				 */
				control: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {

				/**
				 * Event is fired before the navigation popover opens and before navigation target links are getting retrieved. Event can be used to
				 * change the parameters used to retrieve the navigation targets. In case of NavigationPopoverHandler, the
				 * <code>beforePopoverOpens</code> is fired after the link has been clicked.
				 *
				 * @since 1.36.0
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
						 * The ID of the NavigationPopoverHandler.
						 */
						originalId: {
							type: "string"
						},

						/**
						 * This callback function triggers the retrieval of navigation targets and leads to the opening of the navigation popover.
						 * Signatures: <code>open()</code> If the <code>beforePopoverOpens</code> has been registered, the <code>open</code>
						 * function has to be called manually in order to open the navigation popover.
						 */
						open: {
							type: "function"
						}
					}
				},

				/**
				 * After the navigation targets are retrieved, <code>navigationTargetsObtained</code> is fired and provides the possibility to
				 * change the targets.
				 *
				 * @since 1.36.0
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
						 * The ID of the NavigationPopoverHandler.
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
						 * calculated using binding context of given source object (for example NavigationPopoverHandler).</li>
						 * <li>{sap.ui.comp.navpopover.LinkData} oMainNavigation The main navigation object. If empty, property
						 * <code>mainNavigation</code> will be used.</li>
						 * <li>{sap.ui.comp.navpopover.LinkData[]} aAvailableActions Array containing the cross application navigation links. If
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
				 * This event is fired after a navigation link on the navigation popover has been clicked. This event is only fired, if the user
				 * left-clicks the link. Right-clicking the link and selecting 'Open in New Window' etc. in the context menu does not fire the event.
				 *
				 * @since 1.36.0
				 */
				innerNavigate: {
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
						 * The ID of the NavigationPopoverHandler.
						 */
						originalId: {
							type: "string"
						}
					}
				}
			}
		}
	});

	NavigationPopoverHandler.prototype.init = function() {
		this._oPopover = null;

		var oModel = new JSONModel({
			semanticObjectLabel: undefined,
			semanticObject: undefined,
			semanticAttributes: undefined,
			appStateKey: undefined
		});
		oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		oModel.setSizeLimit(1000);
		this.setModel(oModel, "$sapuicompNavigationPopoverHandler");

	};

	NavigationPopoverHandler.prototype.updateBindingContext = function(bSkipLocal, bSkipChildren, sModelName, bUpdateAll) {
		if (this._oPopover) {
			this._oPopover.destroy();
			this._oPopover = null;
		}
		Control.prototype.updateBindingContext.apply(this, arguments);
	};

	NavigationPopoverHandler.prototype.setIgnoreOpenPopover = function(bIsIgnored) {
		this.setProperty("ignoreOpenPopover", bIsIgnored);
		if (bIsIgnored) {
			this.fireOmitNavigation();
		}
	};

	/**
	 * @private
	 */
	NavigationPopoverHandler.prototype._getPopover = function() {
		var that = this;

		this.setSemanticAttributes(this._calculateSemanticAttributes());

		this._createPopover();

		if (this.hasListeners("beforePopoverOpens")) {
			return new Promise(function(resolve) {
				that.fireBeforePopoverOpens({
					semanticObject: that.getSemanticObject(),
					semanticAttributes: that.getSemanticAttributes(),
					setSemanticAttributes: function(aSemanticAttributes) {
						that.setSemanticAttributes(aSemanticAttributes);
					},
					setAppStateKey: function(sAppStateKey) {
						var oModel = that.getModel("$sapuicompNavigationPopoverHandler");
						// Update model in order to notify the semanticObjectLabel as 'title' of NavigationPopover
						oModel.setProperty("/appStateKey", sAppStateKey);
					},
					originalId: that.getId(),
					open: function() {
						that._retrieveNavigationTargets(resolve);
					}
				});
			});
		}
		return new Promise(function(resolve) {
			that._retrieveNavigationTargets(resolve);
		});
	};

	NavigationPopoverHandler.prototype._retrieveNavigationTargets = function(resolve) {
		var that = this;
		var oPromise = this._oPopover.retrieveNavigationTargets();
		oPromise.then(function(oResult) {
			if (that.hasListeners("navigationTargetsObtained")) {
				that.fireNavigationTargetsObtained({
					mainNavigation: oResult.mainNavigation,
					actions: oResult.availableActions,
					ownNavigation: oResult.ownNavigation,
					semanticObject: that.getSemanticObject(),
					semanticAttributes: that.getSemanticAttributes(),
					originalId: that.getId(),
					show: function(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent) {
						if (sMainNavigationId != null && typeof sMainNavigationId === "string") {
							that._oPopover.setMainNavigationId(sMainNavigationId);
						} else {
							oExtraContent = aAvailableActions;
							aAvailableActions = oMainNavigation;
							oMainNavigation = sMainNavigationId;
						}

						if (oMainNavigation) {
							that._oPopover.setMainNavigation(oMainNavigation);
						}

						if (aAvailableActions && aAvailableActions.length) {
							that._oPopover.removeAllAvailableActions();
							aAvailableActions.forEach(function(oAvailableAction) {
								that._oPopover.addAvailableAction(oAvailableAction);
							});
						}

						if (oExtraContent) {
							that._oPopover.setExtraContent(oExtraContent);
						}
					}
				});
			}
			that._oPopover._createLinks();
			return resolve(that._oPopover);
		}, function(oError) {
			return resolve(oError);
		});
	};

	/**
	 * Opens the navigation popover.
	 *
	 * @public
	 */
	NavigationPopoverHandler.prototype.openPopover = function() {
		if (this._processingPressed) {
			// avoid multiple link press events while data is still fetched
			window.console.warn("NavigationPopoverHandler is still processing last press event. This press event is omitted.");
			return;
		}

		this._processingPressed = true;

		var sAppStateKey;
		this.setSemanticAttributes(this._calculateSemanticAttributes());

		var that = this;
		var fOpen = function() {
			that._createPopover();

			if (that.getSemanticAttributes()) {
				that._oPopover.setSemanticAttributes(that.getSemanticAttributes());
			}

			if (sAppStateKey) {
				that._oPopover.setAppStateKey(sAppStateKey);
			}

			that._oPopover.retrieveNavTargets();
		};

		if (this.hasListeners("beforePopoverOpens")) {
			this.fireBeforePopoverOpens({
				semanticObject: that.getSemanticObject(),
				semanticAttributes: that.getSemanticAttributes(),
				setSemanticAttributes: function(aSemanticAttributes) {
					that.setSemanticAttributes(aSemanticAttributes);
				},
				setAppStateKey: function(sKey) {
					sAppStateKey = sKey;
				},
				originalId: this.getId(),
				open: fOpen
			});
		} else {
			fOpen();
		}
	};

	/**
	 * Eventhandler for NavigationPopover's targetObtained event, exposes event or - if not registered - directly opens the dialog
	 *
	 * @private
	 */
	NavigationPopoverHandler.prototype._onTargetsObtained = function() {
		var that = this;
		var oLink;

		if (!this._oPopover.getMainNavigation()) { // main navigation could not be resolved, so only set link text as MainNavigation
			this._oPopover.setMainNavigation(new LinkData({
				text: this.getSemanticObjectLabel()
			}));
		}

		this.fireNavigationTargetsObtained({
			actions: this._oPopover.getAvailableActions(),
			mainNavigation: this._oPopover.getMainNavigation(),
			ownNavigation: this._oPopover.getOwnNavigation(),
			semanticObject: this.getSemanticObject(),
			semanticAttributes: this.getSemanticAttributes(),
			originalId: this.getId(),
			show: function(sMainNavigationId, oMainNavigation, aAvailableActions, oExtraContent) {
				if (sMainNavigationId != null && typeof sMainNavigationId === "string") {
					that._oPopover.setMainNavigationId(sMainNavigationId);
				} else {
					oExtraContent = aAvailableActions;
					aAvailableActions = oMainNavigation;
					oMainNavigation = sMainNavigationId;
				}

				if (oMainNavigation) {
					that._oPopover.setMainNavigation(oMainNavigation);
				}

				if (aAvailableActions) {
					that._oPopover.removeAllAvailableActions();
					if (aAvailableActions && aAvailableActions.length) {
						var i, length = aAvailableActions.length;
						for (i = 0; i < length; i++) {
							that._oPopover.addAvailableAction(aAvailableActions[i]);
						}
					}
				}

				if (oExtraContent) {
					that._oPopover.setExtraContent(oExtraContent);
				}

				oLink = that._oPopover.getDirectLink();
				if (oLink) {
					that._processingPressed = true;
					window.location.href = oLink.getHref();
				} else {
					that._oPopover.show();
					that._processingPressed = false;
				}
			}
		});

		if (!this.hasListeners("navigationTargetsObtained")) {
			oLink = this._oPopover.getDirectLink();
			if (oLink) {
				this._processingPressed = true;
				window.location.href = oLink.getHref();
			} else {
				this._oPopover.show();
				this._processingPressed = false;
			}
		}
	};

	/**
	 * Eventhandler for NavigationPopover's navigate event, exposes event
	 *
	 * @param {object} oEvent - the event parameters
	 * @private
	 */
	NavigationPopoverHandler.prototype._onNavigate = function(oEvent) {
		var aParameters = oEvent.getParameters();
		this.fireInnerNavigate({
			text: aParameters.text,
			href: aParameters.href,
			originalId: this.getId(),
			semanticObject: this.getSemanticObject(),
			semanticAttributes: this.getSemanticAttributes()
		});
	};

	/**
	 * Creates the NavigationPopover.
	 *
	 * @private
	 */
	NavigationPopoverHandler.prototype._createPopover = function() {
// TODO: ER check with updateBindingContext()
// if (this._oPopover) {
// this._oPopover.destroy();
// this._oPopover = null;
// }

		if (!this._oPopover) {
			jQuery.sap.require("sap.ui.comp.navpopover.NavigationPopover");
			var NavigationPopover = sap.ui.require("sap/ui/comp/navpopover/NavigationPopover");
			this._oPopover = new NavigationPopover({
				title: "{/semanticObjectLabel}",
				mainNavigationId: this.getSemanticObjectValue(),
				semanticObjectName: "{/semanticObject}",
				semanticAttributes: "{/semanticAttributes}",
				appStateKey: "{/appStateKey}",
				component: this._getComponent(),
				targetsObtained: jQuery.proxy(this._onTargetsObtained, this),
				navigate: jQuery.proxy(this._onNavigate, this)
			});
			this._oPopover.setModel(this.getModel("$sapuicompNavigationPopoverHandler"));
			this._oPopover.setSource(this.getControl());
		}
	};

	/**
	 * Finds the parental component.
	 *
	 * @private
	 * @returns {sap.ui.core.Component} the found parental component or null
	 */
	NavigationPopoverHandler.prototype._getComponent = function() {

		var oHostingControl = this.getControl();
		if (oHostingControl) {

			var oParent = oHostingControl.getParent();
			while (oParent) {

				if (oParent instanceof sap.ui.core.Component) {
					return oParent;
				}
				oParent = oParent.getParent();
			}
		}

		return null;
	};

	/**
	 * Gets the current binding context and creates a copied map where all empty and unnecessary data is deleted from.
	 *
	 * @private
	 */
	NavigationPopoverHandler.prototype._calculateSemanticAttributes = function() {
		var oContext = this.getBindingContext() || (this.getControl() && this.getControl().getBindingContext());
		if (!oContext) {
			return null;
		}

		var oResult = {};
		var sCurrentField = this.getFieldName();
		var oContext = oContext.getObject(oContext.getPath());
		for ( var sAttributeName in oContext) {
			// Ignore metadata
			if (sAttributeName === "__metadata") {
				continue;
			}
			// Ignore empty values
			if (!oContext[sAttributeName]) {
				continue;
			}

			// Map attribute name by semantic object name
			var sSemanticObjectName = this._mapFieldToSemanticObject(sAttributeName);
			if (sAttributeName === sCurrentField && this.getSemanticObject()) {
				sSemanticObjectName = this.getSemanticObject();
			}

			// Map all available attribute fields to their semanticObjects excluding SmartLink's own SemanticObject
			if (sSemanticObjectName === this.getSemanticObject() && !this.getMapFieldToSemanticObject()) {
				sSemanticObjectName = sAttributeName;
			}

			// If more then one attribute fields maps to the same semantic object we take the value of the current binding path.
			var oAttributeValue = oContext[sAttributeName];
			if (oResult[sSemanticObjectName]) {
				if (oContext[sCurrentField]) {
					oAttributeValue = oContext[sCurrentField];
				}
			}

			// Copy the value replacing the attribute name by semantic object name
			oResult[sSemanticObjectName] = oAttributeValue;
		}

		return oResult;
	};

	// ----------------------- Overwrite Property Methods --------------------------

	NavigationPopoverHandler.prototype.setSemanticObjectLabel = function(sLabel) {
		var oModel = this.getModel("$sapuicompNavigationPopoverHandler");
		this.setProperty("semanticObjectLabel", sLabel);
		// Update model in order to notify the semanticObjectLabel as 'title' of NavigationPopover
		oModel.setProperty("/semanticObjectLabel", sLabel);
		return this;
	};

	NavigationPopoverHandler.prototype.setSemanticObject = function(sSemanticObject) {
		var oModel = this.getModel("$sapuicompNavigationPopoverHandler");
		this.setProperty("semanticObject", sSemanticObject);
		// Update model in order to notify the semanticObject as 'semanticObjectName' of NavigationPopover
		oModel.setProperty("/semanticObject", sSemanticObject);
		return this;
	};

	NavigationPopoverHandler.prototype.setSemanticAttributes = function(oSemanticAttributes) {
		var oModel = this.getModel("$sapuicompNavigationPopoverHandler");
		this.setProperty("semanticAttributes", oSemanticAttributes);
		// Update model in order to notify the semanticAttributes as 'semanticAttributes' of NavigationPopover
		oModel.setProperty("/semanticAttributes", oSemanticAttributes);
		return this;
	};

	NavigationPopoverHandler.prototype.setFieldName = function(sFieldName) {
		this.setProperty("fieldName", sFieldName);

		var oSemanticController = this.getSemanticObjectController();
		if (oSemanticController) {
			oSemanticController.setIgnoredState(this);
		}
	};

	NavigationPopoverHandler.prototype.getControl = function() {
		var oControl = this.getAssociation("control");
		if (typeof oControl === "string") {
			oControl = sap.ui.getCore().byId(oControl);
		}
		return oControl;
	};

	// TODO: hidden property 'semanticAttributes' has been introduced instead of 'this._oSemanticAttributes'
// NavigationPopoverHandler.prototype.getSemanticAttributes = function() {
// if (this._oSemanticAttributes === null) {
// this._oSemanticAttributes = this._calculateSemanticAttributes();
// }
// return this._oSemanticAttributes;
// };

	NavigationPopoverHandler.prototype.setSemanticObjectController = function(oController) {
		var oOldController = this.getProperty("semanticObjectController");
		if (oOldController) {
			oOldController.unregisterControl(this);
		}

		this.setProperty("semanticObjectController", oController, true);
		if (oController) {
			oController.registerControl(this);
		}
		this.setSemanticAttributes(null);
	};

	NavigationPopoverHandler.prototype.getSemanticObjectController = function() {
		var oController = this.getProperty("semanticObjectController");

		if (!oController) {

			var oParent = this.getParent();
			while (oParent) {
				if (oParent.getSemanticObjectController) {
					oController = oParent.getSemanticObjectController();
					if (oController) {
						this.setSemanticObjectController(oController);
						break;
					}
				}

				oParent = oParent.getParent();
			}
		}

		return oController;
	};

	/**
	 * Maps the given field name to the corresponding semantic object.
	 *
	 * @param {string} sFieldName The field name which should be mapped to a semantic object
	 * @returns {string} Corresponding semantic object, or the original field name if semantic object is not available.
	 * @private
	 */
	NavigationPopoverHandler.prototype._mapFieldToSemanticObject = function(sFieldName) {
		var oSOController = this.getSemanticObjectController();
		if (!oSOController) {
			return sFieldName;
		}
		var oMap = oSOController.getFieldSemanticObjectMap();
		if (!oMap) {
			return sFieldName;
		}
		return oMap[sFieldName] || sFieldName;
	};

	/**
	 * Gets the current value assigned to the field with the NavigationPopoverHandler's semantic object name.
	 *
	 * @returns {object} The semantic object's value.
	 * @public
	 */
	NavigationPopoverHandler.prototype.getSemanticObjectValue = function() {
		this.setSemanticAttributes(this._calculateSemanticAttributes());

		var oSemanticAttributes = this.getSemanticAttributes();
		if (oSemanticAttributes) {
			var sSemanticObjectName = this.getSemanticObject();
			return oSemanticAttributes[sSemanticObjectName];
		}
		return null;
	};

	NavigationPopoverHandler.prototype.exit = function() {
		// disconnect from SemanticObjectController
		var oSemanticObjectController = this.getSemanticObjectController();
		if (oSemanticObjectController) {
			oSemanticObjectController.unregisterControl(this);
		}
		if (this._oPopover) {
			this._oPopover.destroy();
			this._oPopover = null;
		}
	};

	return NavigationPopoverHandler;

}, /* bExport= */true);
