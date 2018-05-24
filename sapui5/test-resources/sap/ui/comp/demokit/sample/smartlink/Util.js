/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

/**
 * @namespace Provides utility functions for SmartLink tests
 * @name sap.ui.comp.sample.smartlink.Util
 * @author SAP SE
 * @version 1.38.33
 * @private
 * @since 1.36.0
 */
sap.ui.define([
	'sap/ui/base/Object', 'sap/ui/comp/navpopover/Factory'
], function(BaseObject, Factory) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.comp.sample.smartlink.Util", /** @lends sap.ui.comp.sample.smartlink.Util */
	{});

	Util.getServiceReal = Factory.getService;

	Util.mockUShellServices = function(oSetting) {

		Factory.getService = function(sServiceName) {
			switch (sServiceName) {
				case "CrossApplicationNavigation":
					return {
						getSemanticObjectLinks: function(sSemanticalObject_, mSemanticAttributes, bIgnoreFormFactor, oComponent, sAppStateKey) {
							var aLinks = [];
							for ( var sSemanticObject in oSetting) {
								if (sSemanticObject === sSemanticalObject_) {
									aLinks = oSetting[sSemanticObject].links ? oSetting[sSemanticObject].links : [];
								}
							}
							return {
								fail: function() {
								},
								done: function(callback) {
									callback(aLinks);
								}
							};
						},
						hrefForExternal: function(oTarget) {
							if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
								return null;
							}
							return oTarget.target.shellHash;
						},
						getDistinctSemanticObjects: function() {
// for (var i = 0; i < 100000000000000000; i++) {
// }
							var aSemanticObjects = [];
							for ( var sSemanticObject in oSetting) {
								aSemanticObjects.push(sSemanticObject);
							}
							return {
								fail: function() {
								},
								done: function(callback) {
									callback(aSemanticObjects);
								}
							};
						},
						getLinks: function(aParams) {
							var aLinks = [];
							aParams.forEach(function(aParams) {
								aLinks.push([
									oSetting[aParams[0].semanticObject].links
								]);
							});
							return {
								fail: function() {
								},
								done: function(callback) {
									callback(aLinks);
								}
							};
						}
					};
				case "URLParsing":
					return {
						parseShellHash: function(sIntent) {
							var sAction;
							for ( var sSemanticObject in oSetting) {
								oSetting[sSemanticObject].links.some(function(oLink) {
									if (oLink.intent === sIntent) {
										sAction = oLink.action;
										return true;
									}
								});
								if (sAction) {
									return {
										semanticObject: sSemanticObject,
										action: sAction
									};
								}
							}
							return {
								semanticObject: null,
								action: null
							};
						}
					};
				default:
					return null;
			}
		};
	};

	Util.unMockUShellServices = function() {
		Factory.getService = Util.getServiceReal;
	};

	return Util;
}, /* bExport= */true);
