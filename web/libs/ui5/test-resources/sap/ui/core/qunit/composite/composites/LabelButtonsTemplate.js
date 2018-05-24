/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/core/XMLComposite'
], function(XMLComposite) {
	"use strict";
	return XMLComposite.extend("composites.LabelButtonsTemplate", {
		metadata: {
			properties: {
				labelFirst: {
					type: "boolean",
					defaultValue: true,
					invalidate: "template"
				}
			},
			aggregations: {
				items: {
					type: "TemplateMetadataContext",
					multiple: true,
					invalidate: "template"
				}
			}
		},
		alias: "myFC"
	});
}, /* bExport= */true);