/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/core/XMLComposite'
], function(XMLComposite) {
	"use strict";
	return XMLComposite.extend("composites.LabelButtonTemplate", {
		metadata: {
			properties: {
				label: {
					type: "string"
				},
				value: {
					type: "string"
				},
				labelFirst: {
					type: "boolean",
					defaultValue: true,
					invalidate: "template"
				}
			}
		}
	});
}, /* bExport= */true);
