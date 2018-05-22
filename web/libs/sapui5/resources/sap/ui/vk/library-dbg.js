/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of library sap.suite.ui.generic.template.
 */
sap.ui.define([
	"jquery.sap.global", "./TransformationMatrix", "./DvlException"
], function(jQuery, TransformationMatrix, DvlException) {
	"use strict";

	/**
	 * SAPUI5 library with controls for displaying 3D models.
	 *
	 * @namespace
	 * @name sap.ui.vk
	 * @author SAP SE
	 * @version 1.38.15
	 * @public
	 */

	// Delegate further initialization of this library to the Core.
	sap.ui.getCore().initLibrary({
		name: "sap.ui.vk",
		dependencies: [
			"sap.ui.core"
		],
		types: [
			"sap.ui.vk.ContentResourceSourceCategory", "sap.ui.vk.TransformationMatrix"
		],
		interfaces: [],
		controls: [
			"sap.ui.vk.NativeViewport", "sap.ui.vk.Overlay", "sap.ui.vk.Viewer", "sap.ui.vk.Viewport", "sap.ui.vk.SceneTree", "sap.ui.vk.StepNavigation", "sap.ui.vk.Toolbar", 
			"sap.ui.vk.ContainerBase", "sap.ui.vk.ContainerContent", "sap.ui.vk.MapContainer", "sap.ui.vk.ListPanelStack", "sap.ui.vk.ListPanel", "sap.ui.vk.LegendItem"
		],
		elements: [
			"sap.ui.vk.OverlayArea"
		],
		noLibraryCSS: false,
		version: "1.38.15"
	});

	/**
	 * The types of APIs supported by the {@link sap.ui.vk.GraphicsCore} class.
	 *
	 * @enum {string}
	 * @readonly
	 * @public
	 * @experimental since version 1.32.0. The enumeration might be deleted in the next version.
	 */
	sap.ui.vk.GraphicsCoreApi = {
		/**
		 * The legacy DVL API implemented in the com.sap.ve.dvl library (dvl.js).
		 * @public
		 */
		LegacyDvl: "LegacyDvl"
	};

	/**
	 * The categories of content resources.
	 * @enum {string}
	 * @readonly
	 * @public
	 * @experimental Since 1.32.0 This map is experimental and might be modified or removed in future versions.
	 */
	sap.ui.vk.ContentResourceSourceCategory = {
		/**
		 * The 3D content resource.
		 * @public
		 */
		"3D": "3D",
		/**
		 * The 2D content resource.
		 * @public
		 */
		"2D": "2D"
	};

	/**
	 * The map from file extensions to content resource categories.
	 * @readonly
	 * @private
	 * @experimental Since 1.32.0 This map is experimental and might be modified or removed in future versions.
	 */
	sap.ui.vk.ContentResourceSourceTypeToCategoryMap = {
		"vds": sap.ui.vk.ContentResourceSourceCategory["3D"],
		"png": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"jpg": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"gif": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"bmp": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"tiff": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"tif": sap.ui.vk.ContentResourceSourceCategory["2D"],
		"svg": sap.ui.vk.ContentResourceSourceCategory["2D"]
	};

	var dvlComponent = "sap.ve.dvl";
	/**
	 * Utility methods used internally by the library to handle results from DVL.
	 * @private
	 */
	sap.ui.vk.dvl = {
		checkResult: function(result) {
			if (result < 0) {
				var message = sap.ve.dvl.DVLRESULT.getDescription ? sap.ve.dvl.DVLRESULT.getDescription(result) : "";
				jQuery.sap.log.error(message, JSON.stringify({ errorCode: result }), dvlComponent);
				throw new DvlException(result, message);
			}
			return result;
		},

		getPointer: function(pointer) {
			if (pointer.indexOf("errorcode") === 0) {
				var code = parseInt(pointer.substr(15), 16) - 0x100;
				var message = sap.ve.dvl.DVLRESULT.getDescription ? sap.ve.dvl.DVLRESULT.getDescription(code) : "";
				jQuery.sap.log.error(message, JSON.stringify({ errorCode: code }), dvlComponent);
				throw new DvlException(code, message);
			}
			return pointer;
		},

		getJSONObject: function(object) {
			if (jQuery.type(object) === "number") {
				var message = sap.ve.dvl.DVLRESULT.getDescription ? sap.ve.dvl.DVLRESULT.getDescription(object) : "";
				jQuery.sap.log.error(message, JSON.stringify({ errorCode: object }), dvlComponent);
				throw new DvlException(object, message);
			}
			return object;
		}
	};

	sap.ui.vk.getResourceBundle = function() {
		var resourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.vk.i18n");
		sap.ui.vk.getResourceBundle = function() {
			return resourceBundle;
		};
		return resourceBundle;
	};

	return sap.ui.vk;
});
