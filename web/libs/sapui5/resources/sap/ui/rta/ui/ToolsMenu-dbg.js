/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.rta.ToolsMenu.
sap.ui.define([
	'sap/ui/rta/library',
	'sap/ui/core/Control',
	'sap/m/Toolbar',
	'sap/m/ToolbarLayoutData',
	'sap/m/ToolbarSpacer',
	'sap/m/Label',
	'sap/ui/fl/registry/Settings',
	'sap/ui/fl/Utils'
	],
	function(
		library,
		Control,
		Toolbar,
		ToolbarLayoutData,
		ToolbarSpacer,
		Label,
		FlexSettings,
		Utils) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.rta.ToolsMenu control.
	 *
	 * @class
	 * Contains all the necessary Toolbars for the Runtime Authoring
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.38.33
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.rta.ToolsMenu
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var ToolsMenu = Control.extend("sap.ui.rta.ui.ToolsMenu", {
		metadata : {

			library : "sap.ui.rta",
			// ---- control specific ----
			properties : {
				"toolbarType" : "string"
			},
			aggregations : {
				"toolbars" : {
					type : "sap.m.Toolbar",
					multiple : true,
					singularName : "toolbar"
				}
			},
			events : {
				/**
				 * Events are fired when the Toolbar - Buttons are pressed
				 */
				"undo" : {},
				"redo" : {},
				"close" : {},
				"toolbarClose" : {},
				"restore": {},
				"transport" : {}
			}
		}

	});

	/**
	 * Initialization of the ToolsMenu Control
	 * @private
	 */
	ToolsMenu.prototype.init = function() {

		// Get messagebundle.properties for sap.ui.rta
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");

	};

	/**
	 * Create Toolbar(s)
	 * @private
	 */
	ToolsMenu.prototype.createToolbar = function() {

		var sText = null;

		if (this.getToolbarType() == "top"){
			// create top toolbar
			if (!this._oToolBarTop) {

				var oAdaptModeLabel = null;
				var oAppTitleLabel = null;
				var oButtonExit = null;
				var oSpacerTop = null;
				var oTop = null;

				// Label 'Adaptation Mode'
				sText = " - " + this._oRb.getText("TOOLBAR_TITLE");
				oAdaptModeLabel = new Label({
					text : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				oAdaptModeLabel.bAllowTextSelection = false;

				// Label 'Application Name'
				sText = null;
				oAppTitleLabel = new Label({
					text : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				oAppTitleLabel.bAllowTextSelection = false;

				// Button 'Restore'
				sText = this._oRb.getText("BTN_RESTORE");
				this._oButtonRestore = new sap.m.Button({
					type:"Transparent",
					text : sText,
					visible: true,
					tooltip : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				this._oButtonRestore.data("Action", "RESTORE",true);
				this._oButtonRestore.attachEvent('press', this._onRestore, this);

				// Button 'Exit'
				sText = this._oRb.getText("BTN_EXIT");
				oButtonExit = new sap.m.Button({
					type:"Transparent",
					text : sText,
					tooltip : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				oButtonExit.data("Action", "EXIT",true);
				oButtonExit.attachEvent('press', this.close, this);

				// Button 'Transport'
				sText = this._oRb.getText("BTN_TRANSPORT");
				this._oButtonTransport = new sap.m.Button({
					type:"Transparent",
					text : "Transport",
					visible : false,
					tooltip : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				this._oButtonTransport.data("Action", "TRANSPORT", true);
				this._oButtonTransport.attachEvent('press', this._onTransport, this);

				// Space between Toolbar Elements
				oSpacerTop = new ToolbarSpacer();

				//create Toolbar
				this._oToolBarTop = new Toolbar({
					active : true,
					content : [
					           oAppTitleLabel,
					           oAdaptModeLabel,
					           oSpacerTop,
					           this._oButtonRestore,
					           this._oButtonTransport,
					           oButtonExit
					           ]
				});

				this._oToolBarTop.addStyleClass("sapUiRTAToolBarTop");
				this.addToolbar(this._oToolBarTop);

				// Insert a DIV-Element for Top Toolbar in the DOM
				jQuery("body").prepend("<div id='RTA-ToolbarTop'></div>");
				oTop = jQuery("#RTA-ToolbarTop").addClass("sapUiRTAToolsMenuWrapper");
				oTop = oTop[0];
				this.placeAt(oTop);
			}
		} else {
			// create bottom toolbar
			if (!this._oToolBarBottom) {

				var oSpacerBottomLeft = null;
				var oSpacerBottomRight = null;
				var oBottom = null;
				// Button 'Undo'
				sText = this._oRb.getText("BTN_UNDO");
				this._oButtonUndo = new sap.m.Button({
					type:"Transparent",
					icon: "sap-icon://undo",
					enabled : false,
					tooltip : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				this._oButtonUndo.data("Action", "UNDO",true);
				this._oButtonUndo.attachEvent('press', this._onUndo, this);

				// Button 'Redo'
				sText = this._oRb.getText("BTN_REDO");
				this._oButtonRedo = new sap.m.Button({
					type:"Transparent",
					icon: "sap-icon://redo",
					iconFirst: false,
					enabled : false,
					tooltip : sText,
					layoutData : new ToolbarLayoutData({
						shrinkable : false
					})
				});
				this._oButtonRedo.data("Action", "REDO",true);
				this._oButtonRedo.attachEvent('press', this._onRedo, this);

				oSpacerBottomLeft = new ToolbarSpacer();
				oSpacerBottomRight = new ToolbarSpacer();

				//create the Toolbar
				this._oToolBarBottom = new Toolbar({
					active : true,
					content : [
					           oSpacerBottomLeft,
					           this._oButtonUndo,
					           this._oButtonRedo,
					           oSpacerBottomRight
					]
				});

				this._oToolBarBottom.addStyleClass("sapUiRTAToolBarBottom");
				this.addToolbar(this._oToolBarBottom);

				// Insert a DIV-Element for Bottom Toolbar in the DOM
				jQuery("body").append("<div id='RTA-ToolbarBottom'></div>");
				oBottom = jQuery("#RTA-ToolbarBottom").addClass("sapUiRTAToolsMenuWrapper");
				oBottom = oBottom[0];
				this.placeAt(oBottom);
			}
		}
	};

	/**
	 * Override the EXIT-Function
	 * @private
	 */
	ToolsMenu.prototype.exit = function() {
		// Remove the DOM-Elements for the Toolbars
		if (this.getToolbarType() == "top"){
			jQuery("#RTA-ToolbarTop").remove();
		} else {
			jQuery("#RTA-ToolbarBottom").remove();
		}
	};

	/**
	 * Trigger transport
	 * @private
	 */
	ToolsMenu.prototype._onTransport = function() {
		this.fireTransport();
	};

	/**
	 * Check if the transports are available,
	 * transports are available in non-productive systems
	 * and no merge errors has occoured
	 * currently set's the visibility for Transport and Restore button
	 * @private
	 * @returns {Promise}
	 */
	ToolsMenu.prototype._checkTransportAvailable = function() {
		var that = this;
		return FlexSettings.getInstance(Utils.getComponentClassName(this._oRootControl)).then(function(oSettings) {
			if (!oSettings.isProductiveSystem() && !oSettings.hasMergeErrorOccured()) {
				that._oButtonTransport.setVisible(true);
			}
		});
	};

	/**
	 * Makes the Toolbar(s) visible
	 * @public
	 */
	ToolsMenu.prototype.show = function() {

		if (this.getToolbarType() == "top"){
			this._oToolBarTop.addStyleClass("sapUiRTAToolBarTopVisible");
			this._oToolBarTop.removeStyleClass("sapUiRTAToolBarTopInvisible");
		} else {
			this._oToolBarBottom.addStyleClass("sapUiRTAToolBarBottomVisible");
			this._oToolBarBottom.removeStyleClass("sapUiRTAToolBarBottomInvisible");
		}
	};

	/**
	 * Makes the TOP Toolbar invisible
	 * @public
	 */
	ToolsMenu.prototype.hide = function() {
		var that = this;

		if (this.getToolbarType() == "top"){

			this._oToolBarTop.addStyleClass("sapUiRTAToolBarTopInvisible");
			var oToolBarDOM = document.getElementsByClassName("sapUiRTAToolBarTop")[0];
			var fnAnimationEnd = function() {
				that.fireClose();
			};
			// all types of CSS3 animationend events for different browsers
			oToolBarDOM.addEventListener("webkitAnimationEnd", fnAnimationEnd);
			oToolBarDOM.addEventListener("animationend", fnAnimationEnd);
			oToolBarDOM.addEventListener("oanimationend", fnAnimationEnd);
		} else {
			this._oToolBarBottom.addStyleClass("sapUiRTAToolBarBottomInvisible");
		}
	};

	/**
	 * Trigger undo
	 * @private
	 */
	ToolsMenu.prototype._onUndo = function() {

		this.fireUndo();
	};

	/**
	 * Trigger redo
	 * @private
	 */
	ToolsMenu.prototype._onRedo = function() {

		this.fireRedo();
	};

	/**
	 * Discard all the LREP changes and restore the default app state
	 * @private
	 */
	ToolsMenu.prototype._onRestore = function() {

		this.fireRestore();
	};

	/**
	 * Closing the ToolsMenu
	 * @public
	 */
	ToolsMenu.prototype.close = function() {

		this.fireToolbarClose();

	};

	/**
	 * Set the Application Title
	 * @param {string} sTitle Application Title
	 * @public
	 */
	// Method for setting the Application Title
	ToolsMenu.prototype.setTitle = function(sTitle) {

		if (this.getToolbarType() == "top"){
			var oLabel = this._oToolBarTop.getContent()[0];
			oLabel.setText(sTitle);
		}
	};

	/**
	 * Set the root control
	 * @param {sap.ui.core.Control} oControl - SAPUI5 control
	 * @public
	 */
	ToolsMenu.prototype.setRootControl = function(oControl) {
		this._oRootControl = oControl;
	};

	/**
	 * Adapt the visibility of the buttons in the ToolsMenu
	 * depending on which features the system offers
	 * @private
	 */
	ToolsMenu.prototype.adaptButtonsVisibility = function() {
		// Transport & Restore Button
		this._checkTransportAvailable();
	};

	/**
	 * Adapt the enablement of the und/redo buttons in the ToolsMenu
	 */
	ToolsMenu.prototype.adaptUndoRedoEnablement = function(bCanUndo,bCanRedo) {
		this._oButtonUndo.setEnabled(bCanUndo);
		this._oButtonRedo.setEnabled(bCanRedo);
	};

	return ToolsMenu;

}, /* bExport= */ true);