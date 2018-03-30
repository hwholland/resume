/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/core/Control',
	'jquery.sap.global'
], function(Control, jQuery) {
	"use strict";

	/**
	 * @class
	 * Renders properly JSDoc text content inside the Demo Kit
	 * @extends sap.ui.core.Control
	 */
	return Control.extend("sap.ui.documentation.sdk.controls.JSDocText", {
		metadata: {
			properties: {
				/**
				 * JSDoc Text to be displayed by the control. This text can contain basic HTML markup needed to display
				 * JSDoc content properly.
				 */
				text: {type : "string", defaultValue : ""}
			}
		},

		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiJSD");
			oRm.writeClasses();
			oRm.write(">");

			// Sanitize HTML
			oRm.write(jQuery.sap._sanitizeHTML(oControl.getText()));

			oRm.write("</div>");
		}
	});

});