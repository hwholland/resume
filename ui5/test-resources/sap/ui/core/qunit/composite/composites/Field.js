/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/core/XMLComposite'
], function(XMLComposite) {
	"use strict";
	return XMLComposite.extend("composites.Field", {
		metadata: {
			properties: {
				text: {
					type: "string",
					defaultValue: "Default Text"
				},
				value: {
					type: "string",
					defaultValue: "Default Value"
				}
			}
		}
	});
}, /* bExport= */true);
