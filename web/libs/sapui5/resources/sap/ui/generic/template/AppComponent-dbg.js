/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2016 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.ui.generic.template.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', 'sap/ui/generic/app/ApplicationController', 'sap/ui/generic/template/NavigationController', 'sap/m/NavContainer'
], function(jQuery, UIComponent, ApplicationController, NavigationController, NavContainer) {
	"use strict";

	/**
	 * Base class for application components used in smart template applications. 
	 * 
	 * @class The AppComponent class creates and initializes a new application component. It boots up the smart template application and creates the
	 *        {@link sap.ui.generic.template.NavigationController NavigationController}, {@link sap.ui.generic.template.TransactionController TransactionController}
	 *        and {@link sap.ui.generic.app.ApplicationController ApplicationController} objects.
	 * @public
	 * @extends sap.ui.core.UIComponent
	 * @version 1.38.33
	 * @since 1.30.0
	 * @alias sap.ui.generic.template.AppComponent
	 */
	var AppComponent = UIComponent.extend("sap.ui.generic.template.AppComponent", {
		metadata: {
			config: {
				"title": "SAP UI Application Component", // TODO: This should be set from App descriptor
				fullWidth: true
			},
			routing: {
				config: {
					routerClass: "sap.m.routing.Router",
					viewType: "XML",
					viewPath: "",
					clearTarget: false
				},
				routes: []
			},
			library: "sap.ui.generic.template"
		}
	});

	/**
	 * Initializes the AppComponent instance after creation.
	 * 
	 * @protected
	 */
	AppComponent.prototype.init = function() {
		var oModel;
		// call overwritten init (calls createContent)
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		oModel = this.getModel();
		if (oModel) {
			// workaround until Modules Factory is available
			this._oApplicationController = new ApplicationController(oModel);
			this._oNavigationController = new NavigationController(this);

			// Error handling for erroneous metadata request  
			// TODO replace access to oModel.oMetadata with official API call when available (recheck after 03.2016)
			// TODO move error handling to central place (e.g. create new MessageUtil.js)
			var oRB = sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.template");
			if (!oModel.oMetadata || !oModel.oMetadata.isLoaded()) {
				oModel.attachMetadataFailed((function(oNavController){
					return function handler(){
						oNavController.navigateToMessagePage({
							title: oRB.getText("ERROR_LOAD_DATA_TITLE"),
							text: oRB.getText("ERROR_LOAD_DATA_TEXT")
						});
					};
				})(this._oNavigationController));
			} else if (oModel.oMetadata.isFailed()) {
				this._oNavigationController.navigateToMessagePage({
					title: oRB.getText("ERROR_LOAD_DATA_TITLE"),
					text: oRB.getText("ERROR_LOAD_DATA_TEXT")
				});
			}
		}
	};

	/**
	 * Creates the content of the component.
	 * 
	 * @public
	 * @returns {Object} the root view
	 */
	AppComponent.prototype.createContent = function() {
		// assign message model
		this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

		this._oNavContainer = new NavContainer({
			id: this.getId() + '-appContent'
		});

		if (sap.ui.Device.system.desktop) {
			this._oNavContainer.addStyleClass("sapUiSizeCompact");
		}

		// done
		return this._oNavContainer;
	};

	/**
	 * Returns the application configuration metadata that has been created and/or specified in the app descriptor.
	 * 
	 * @returns {Object} the application configuration
	 * @public
	 */
	AppComponent.prototype.getConfig = function() {
		var oConfig, oMeta;
		if (!this._oConfig) {
			oMeta = this.getMetadata();
			oConfig = oMeta.getManifestEntry('sap.ui.generic.app');
			this._oConfig = oConfig;
		}
		return this._oConfig;
	};

	/**
	 * Returns the reference to the transaction controller instance.
	 * 
	 * @returns {sap.ui.generic.app.transaction.TransactionController} the transaction controller instance
	 * @public
	 */
	AppComponent.prototype.getTransactionController = function() {
		return this._oApplicationController.getTransactionController();
	};
	
	/**
	 * Returns the reference to the application controller instance that has been created by the AppComponent.
	 * 
	 * @returns {sap.ui.generic.app.ApplicationController} the application controller instance
	 * @public
	 */
	AppComponent.prototype.getApplicationController = function() {
		return this._oApplicationController;
	};

	/**
	 * Returns the reference to the navigation controller instance that has been created by AppComponent.
	 * 
	 * @returns {sap.ui.generic.template.NavigationController} the navigation controller instance
	 * @public
	 */
	AppComponent.prototype.getNavigationController = function() {
		return this._oNavigationController;
	};

	/**
	 * Cleans up the component instance before destruction.
	 * 
	 * @protected
	 */
	AppComponent.prototype.exit = function() {
		if (this._oNavContainer) {
			this._oNavContainer.destroy();
		}
		this._oNavContainer = null;
		if (this._oApplicationController) {
			this._oApplicationController.destroy();
		}
		this._oApplicationController = null;
		if (this._oNavigationController) {
			this._oNavigationController.destroy();
		}
		this._oNavigationController = null;
	};

	return AppComponent;

}, /* bExport= */true);
