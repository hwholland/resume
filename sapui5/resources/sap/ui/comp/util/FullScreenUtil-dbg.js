/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// ------------------------------------------------------------------------------------------
// Utility class used by smart controls for switching a control to full-screen mode and back.
// ------------------------------------------------------------------------------------------
sap.ui.define([
	"jquery.sap.global", "sap/m/Dialog", "sap/ui/core/HTML"
], function(jQuery, Dialog, HTML) {
	"use strict";

	/**
	 * Utility class used by smart controls for switching a control to fullscreen
	 * 
	 * @private
	 * @experimental This module is only for internal/experimental use!
	 */
	var FullScreenUtil = {
		/**
		 * Static function that toggles a control to full screen mode.<br>
		 * Please ensure that you call the clean up function when the control (enabled here for full screen) is destroyed!
		 * 
		 * @param {Object} oControl - the control which can be toggled to full screen
		 * @param {boolean} bEnterFullScreen - whether the control should be enter/exit full screen mode
		 * @private
		 */
		toggleFullScreen: function(oControl, bEnterFullScreen) {
			var $oContent;
			// Switch to full-screen mode
			if (bEnterFullScreen) {
				// get the dom reference of the control
				$oContent = oControl.$();
				if ($oContent) {
					// Create an HTML element to add the controls DOM content in the FullScreen dialog
					if (!oControl._oHTML) {
						oControl._oHTML = new HTML({
							preferDOM: false,
							afterRendering: function() {
								if (oControl && oControl._oHTML) {
									var $oHTMLContent = oControl._oHTML.$(), oChildren;
									// Get the current HTML Dom content
									if ($oHTMLContent) {
										// remove any old child content
										oChildren = $oHTMLContent.children();
										oChildren.remove();
										// stretch the content to occupy the whole space
										$oHTMLContent.css("height", "100%");
										// append the control dom to HTML content
										$oHTMLContent.append(oControl.getDomRef());
									}
								}
							}
						});
					}
					// Create and set a fullscreen Dialog (without headers) on the registered control instance
					if (!oControl._oFullScreenDialog) {
						oControl._oFullScreenDialog = new Dialog({
							showHeader: false,
							stretch: true,
							content: [
								oControl._oHTML
							]
						});
						// add the style class from control to the dialog
						oControl._oFullScreenDialog.addStyleClass($oContent.closest(".sapUiSizeCompact").length ? "sapUiSizeCompact" : "");
						// add style class to make the scroll container height as 100% (required to stretch UI to 100% e.g. for SmartChart)
						oControl._oFullScreenDialog.addStyleClass("sapUiCompSmartFullScreenDialog");
						// Disable "Escape" handling
						if (oControl._oFullScreenDialog.oPopup) {
							oControl._oFullScreenDialog.oPopup.onsapescape = null;
						}
					}
					// create a dummy div node (place holder)
					oControl._$placeHolder = jQuery(document.createElement("div"));
					// Set the place holder before the current content
					$oContent.before(oControl._$placeHolder);
					// Add a dummy div as content of the HTML control
					oControl._oHTML.setContent("<div/>");
				}
				// open the full screen Dialog
				oControl._oFullScreenDialog.open();
				// Switch back from full-screen mode
			} else if (oControl._$placeHolder && oControl._oHTML) {
				// get the HTML controls content --> as it should contain the control's current DOM ref
				$oContent = oControl._oHTML.$();
				// Replace the place holder with the Controls DOM ref (child of HTML)
				oControl._$placeHolder.replaceWith($oContent.children());
				// close the full screen Dialog
				if (oControl._oFullScreenDialog) {
					oControl._oFullScreenDialog.close();
				}
				oControl._$placeHolder = null;
				$oContent = null;
			}
		},
		/**
		 * Static function that cleans up resources created for full-screen mode.<br>
		 * 
		 * @param {Object} oControl - the control which can be toggled to full screen
		 * @private
		 */
		cleanUpFullScreen: function(oControl) {
			// Destroy the Dialog and hence the containing HTML control
			if (oControl._oFullScreenDialog) {
				oControl._oFullScreenDialog.destroy();
				oControl._oFullScreenDialog = null;
			}
			// clean up instance variables created for full screen mode
			oControl._$placeHolder = null;
			oControl._oHTML = null;
		}
	};

	return FullScreenUtil;

}, /* bExport= */true);
