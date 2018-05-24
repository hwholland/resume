(function(){
	/*global jQuery, sap, localStorage, window */
	jQuery.sap.declare("sap.ushell.plugins.rta.Component");
	jQuery.sap.require("sap.ui.core.Component");
	jQuery.sap.require("sap.ui.model.resource.ResourceModel");

	"use strict";

	sap.ui.core.Component.extend("sap.ushell.plugins.rta.Component", {

		metadata: {
			manifest: "json"
		},

		/**

		 * Gets the fiori2 renderer extensions object.
		 *
		 * @returns {object} a jQuery Promise
		 */
		_getRendererExtensions: function() {
			//jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");
			var oDeferred = jQuery.Deferred();
			var oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

			if (oRendererExtensions) {
				// resolve immediately if renderer extensions are already available...
				oDeferred.resolve(oRendererExtensions);
			} else {
				// ... wait to resolve when renderer extensions are available otherwise
				sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "rendererLoaded", function() {
					oDeferred.resolve(jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions"));
				});
			}
			return oDeferred.promise();
		},
		/**
		 * The component is initialized by SAPUI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			var that = this;
			this._oRTA = null;

			this.i18n = this.getModel("i18n").getResourceBundle();

			/**
			 * assigns the correct Component of the app to the RTA plugin,
			 * and creates the adapt button for the RTA Plugin
			 * @private
			 */
			this._getRendererExtensions().done(function(oRendererExtensions) {
				sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", function(sChannel, sEventId, oData) {
					that._switchComponent.call(that, oData);
				});

				/**
				 * Event handler for the "Adapt" button of the RTA FLP Plugin
				 * Checks the supported browsers and starts the RTA
				 * @param  {sap.ui.base.Event} oEvent the button click event
				 * @private
				 */
				var _fOnAdapt = function(oEvent) {
					var bSupportedBrowser = ((sap.ui.Device.browser.msie && sap.ui.Device.browser.version > 10) || sap.ui.Device.browser.webkit || sap.ui.Device.browser.firefox);

					if (!bSupportedBrowser) {
						sap.m.MessageBox.error(that.i18n.getText("MSG_UNSUPPORTED_BROWSER"), {
							title: that.i18n.getText("ERROR_TITLE"),
							onClose: null
						});
					} else {
						if (location.hash) {
							that._switchToAdaptionMode();
						}
					}
				};

				var oButton = new sap.m.Button({
					icon: "sap-icon://wrench"
				});
				oButton.setText(that.i18n.getText("RTA_BUTTON_TEXT"));
				var sHash = location.hash.replace("#", "");
				if (sHash) {
					oButton.setEnabled((sHash.indexOf("Shell") !== 0));
				} else {
					oButton.setEnabled(false);
				}
				oButton.attachPress(_fOnAdapt, this);
				oRendererExtensions.addOptionsActionSheetButton(oButton);

				/**
				 * The RTA Button should only be enabled in an app
				 * and not on in the FLP Shell itself
				 * @param  {sap.ui.base.Event} oEvent of the shellHashChanged
				 * @private
				 */
				sap.ui.core.routing.HashChanger.getInstance().attachEvent("shellHashChanged", function(oEvent) {
					var sNewShellHash = oEvent.getParameter("newShellHash");
					var sHash = location.hash.replace("#", "");
					if (sNewShellHash) {
						oButton.setEnabled((sNewShellHash.indexOf("Shell") !== 0));
					} else {
						if (sHash) {
							oButton.setEnabled((sHash.indexOf("Shell") !== 0));
						} else {
							oButton.setEnabled(false);
						}
					}
				});
			});
		},

		/**
		 * Leaves the RTA adaption mode and destroys the RTA
		 * @private
		 */
		_switchToDefaultMode: function() {
			if (this._oRTA) {
				this._oRTA.destroy();
				this._oRTA = null;
			}
		},

		/**
		 * Switches the rootControl of the RTA plugin
		 * @param  {object} oData a data object wich contains the component reference
		 * @private
		 */
		_switchComponent: function(oData) {
			var oComponent = oData.component;

			this.oRootControl = oComponent.getAggregation("rootControl");
		},

		/**
		 * Turns on the adaption mode of the RTA FLP plugin
		 * @private
		 */
		_switchToAdaptionMode: function() {
			var that = this;
			// Start Runtime Authoring
			if (!this._oRTA) {
				sap.ui.core.BusyIndicator.show(0);
				//TODO: Remove setTimeout when fix is provided by core team
				setTimeout(function() {
					try {
						jQuery.sap.require("sap.ui.rta.RuntimeAuthoring");
						that._oRTA = new sap.ui.rta.RuntimeAuthoring({
							rootControl: that.oRootControl
						});

						that._oRTA.attachEvent('start', function() {
							sap.ui.core.BusyIndicator.hide();
						}, that);

						that._oRTA.start();

						that._oRTA.attachEvent('stop', that._switchToDefaultMode, that);
					} catch (e) {
						sap.ui.core.BusyIndicator.hide();
					}
				}, 100);
			}
		}
	});
})();