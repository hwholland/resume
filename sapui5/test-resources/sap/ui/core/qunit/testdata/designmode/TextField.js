/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control example.designmode.Button.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
	function(jQuery, Control) {
	"use strict";

	var TextField = Control.extend("example.designmode.TextField", {

		metadata: {

			designTime: {
				css: "TextField.designtime.css",
				icon: "TextField.png",
				name: "{name}",
				description: "{description}",
			}

		}

	});

	return TextField;

}, /* bExport= */ true);
