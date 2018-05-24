/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', './ToolbarGroup'
], function (jQuery, ToolbarGroup) {
	"use strict";
	/**
	 * Creates and initializes a new Time zoom group
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * You can specify the Gantt chart Time zooming related toolbar items in the Gantt chart toolbar 
	 * @extends sap.gantt.config.ToolbarGroup
	 *
	 * @author SAP SE
	 * @version 1.38.22
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.config.TimeZoomGroup
	 */
	var TimeZoomGroup = ToolbarGroup.extend("sap.gantt.config.TimeZoomGroup", /** @lends sap.gantt.config.LayoutGroup.prototype */ {
		metadata: {
			properties: {
				/**
				 * Enable Slider control for time zooming function.
				 */
				showZoomSlider: {type: "boolean", defaultValue: true},
				/**
				 * Enable a pair of zoom in and zoom out buttons for time zooming function.
				 */
				showZoomButtons: {type: "boolean", defaultValue: true}
			}
		}
	});
	
	return TimeZoomGroup;
}, true);