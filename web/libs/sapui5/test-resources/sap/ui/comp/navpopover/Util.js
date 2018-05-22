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

	var Util = BaseObject.extend("sap.ui.comp.navpopover.Util", /** @lends sap.ui.comp.navpopover.Util */
	{});

	Util.getServiceReal = Factory.getService;

	Util.mockUShellServices = function(oSetting) {

		Factory.getService = function(sServiceName) {
			switch (sServiceName) {
				case "CrossApplicationNavigation":
					return {
						getSemanticObjectLinks: function(sSemanticalObject_, mSemanticAttributes, bIgnoreFormFactor, oComponent, sAppStateKey) {
							var aLinks;
							for ( var sSemanticObject in oSetting) {
								if (sSemanticalObject_ === "" || sSemanticObject === sSemanticalObject_) {
									aLinks = oSetting[sSemanticObject].links ? oSetting[sSemanticObject].links : [];
								}
							}
							var oDeferred = jQuery.Deferred();
							setTimeout(function() {
								oDeferred.resolve(aLinks);
							}, 5);
							return oDeferred.promise();
						},
						hrefForExternal: function(oTarget) {
							if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
								return null;
							}
							return oTarget.target.shellHash;
						},
						getDistinctSemanticObjects: function() {
							var aSemanticObjects = [];
							for ( var sSemanticObject in oSetting) {
								aSemanticObjects.push(sSemanticObject);
							}
							var oDeferred = jQuery.Deferred();
							setTimeout(function() {
								oDeferred.resolve(aSemanticObjects);
							}, 5);
							return oDeferred.promise();
						},
						getLinks: function(aParams) {
							var aLinks = [];
							aParams.forEach(function(aParams) {
								aLinks.push([
									oSetting[aParams[0].semanticObject].links
								]);
							});
							var oDeferred = jQuery.Deferred();
							setTimeout(function() {
								oDeferred.resolve(aLinks);
							}, 5);
							return oDeferred.promise();
						}
					};
				case "URLParsing":
					return {
						parseShellHash: function(sIntent) {
							var sAction;
							for ( var sSemanticObject in oSetting) {
								sAction = oSetting[sSemanticObject].action ? oSetting[sSemanticObject].action : undefined;
							}
							return {
								semanticObject: sSemanticObject,
								action: sAction
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
