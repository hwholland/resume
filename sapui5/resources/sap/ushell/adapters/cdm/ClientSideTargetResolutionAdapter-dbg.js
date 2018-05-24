// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview ClientSideTargetResolutionAdapter for the CDM platform.
 *
 * The ClientSideTargetResolutionAdapter must perform the following two task:
 * <ul>
 * <li>provide the getInbounds method to return the list of Target Mappings used by ClientSideTargetResolution service;</li>
 * <li>provide the resolveHashFragment function, a fallback method called by ClientSideTargetResolution service.</li>
 * </ul>
 *
 * @version
 * 1.38.26
 */
(function () {
    "use strict";
    /*jslint nomen: true*/
    /*global jQuery, sap, setTimeout */
    jQuery.sap.declare("sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter");

   /**
    * Constructs a new instance of the ClientSideTargetResolutionAdapter for
    * the CDM platform.
    *
    * @param {object} oSystem
    *   The system served by the adapter
    * @param {string} sParameters
    *   Parameter string, not in use
    * @param {object} oAdapterConfig
    *   A potential adapter configuration
    *
    * @constructor
    *
    * @private
    */
   sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter = function (oSystem, sParameters, oAdapterConfig) {
       this._oAdapterConfig = oAdapterConfig && oAdapterConfig.config;

       jQuery.sap.require("sap.ushell.utils");

       /*
        * Hardcoded for the time being, we should be able to resolve the local
        * system alias via OData call in the future.
        */
       this._oLocalSystemAlias = {
           http: {
               host: "",
               port: "",
               pathPrefix: "/sap/bc/"
           },
           https: {
               host: "",
               port: "",
               pathPrefix: "/sap/bc/"
           },
           rfc: {
               systemId: "",
               host: "",
               service: 0,
               loginGroup: "",
               sncNameR3: "",
               sncQoPR3: ""
           },
           id: "",
           client: "",
           language: ""
       };
    };

    /**
     * Produces a list of Inbounds suitable for ClientSideTargetResolution.
     *
     * @returns {jQuery.Deferred.Promise}
     *   a jQuery promise that resolves to an array of Inbounds in
     *   ClientSideTargetResolution format.
     * <p>
     * NOTE: the same promise is returned if this method is called multiple
     * times. Therefore this method can be safely called multiple times.
     * </p>
     * @private
     */
    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype.getInbounds = function () {
        var that = this;

        if (!this._getInboundsDeferred) {
            this._getInboundsDeferred = new jQuery.Deferred();

            sap.ushell.Container.getService("CommonDataModel").getSite()
                .done(function(oSite) {
                    var aInbounds = that._formatOSite(oSite) || [];
                    that._getInboundsDeferred.resolve(aInbounds);

                }).fail(function(oErr) {
                    that._getInboundsDeferred.reject(oErr);
                });
        }

        return this._getInboundsDeferred.promise();
    };

    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype._getSystemAliases = function () {
        var that = this;

        if (!this._getSystemAliasesDeferred) {
            this._getSystemAliasesDeferred = new jQuery.Deferred();

            sap.ushell.Container.getService("CommonDataModel").getSite()
                .done(function(oSite) {
                    var oSystemAliases = jQuery.extend(true, {}, oSite.systemAliases || {});

                    // propagate id in system alias
                    Object.keys(oSystemAliases).forEach(function (sId) {
                        oSystemAliases[sId].id = sId;
                    });

                    that._getSystemAliasesDeferred.resolve(oSystemAliases);
                }).fail(function(oErr) {
                    that._getSystemAliasesDeferred.reject(oErr);
                });
        }

        return this._getSystemAliasesDeferred.promise();
    };

    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype._getMember = function (oObject, sAccessPath) {
        return sap.ushell.utils.getMember(oObject, sAccessPath);
    };

    /**
     * Formats the target mappings contained in the CDM site projection into inbounds
     *
     * @param {object} oSite
     *   the CDM site projection
     *
     * @return {object[]}
     *   <p>
     *   an array of inbounds suitable for ClientSideTargetResolution service
     *   consumption.
     *   </p>
     */
    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype._formatOSite = function (oSite) {
        var that = this;
        if (!oSite) {
            return [];
        }

        function mapOne(sKey, oSrc, oApp) {
            var oInbound = {};
            oInbound.semanticObject = oSrc.semanticObject;
            oInbound.action = oSrc.action;
            oInbound.title = oSrc.title || that._getMember(oApp,"sap|app.title");

            var sTileSize,
                oTargetOutbound,
                bIsCustomTile = false;

            oInbound.resolutionResult = jQuery.extend(true, {}, that._getMember(oApp,"sap|platform|runtime"));

            //oInbound.resolutionResult.url =  that._getMember(oApp,"sap|platform|runtime.componentProperties.url");

            /*
             * ClientSideTargetResolution relies on different application
             * types than the ones returned by the OData service.
             */
            oInbound.resolutionResult = oInbound.resolutionResult || {};
            if (that._getMember(oApp,"sap|platform|runtime")) {
                oInbound.resolutionResult["sap.platform.runtime"] = jQuery.extend(true, {}, that._getMember(oApp,"sap|platform|runtime"));
            }
            // copy a GUI/WDA namespace if provided
            if ( that._getMember(oApp, "sap|ui.technology") === "GUI") {
                oInbound.resolutionResult["sap.gui"] = that._getMember(oApp,"sap|gui");
            }
            if (that._getMember(oApp, "sap|ui.technology") === "WDA") {
                oInbound.resolutionResult["sap.wda"] = that._getMember(oApp,"sap|wda");
            }
            if (that._getMember(oApp, "sap|ui.technology") === "URL" && oInbound.resolutionResult["sap.platform.runtime"]) {
                // ["sap.platform.runtime"].uri  is the wave of the future, url works for now
                if (oInbound.resolutionResult["sap.platform.runtime"].uri) {
                    oInbound.resolutionResult["sap.platform.runtime"].url = oInbound.resolutionResult["sap.platform.runtime"].uri;
                    oInbound.resolutionResult.url = oInbound.resolutionResult["sap.platform.runtime"].uri;
                }
            }
            oInbound.resolutionResult.applicationType = that._formatApplicationType(oInbound.resolutionResult, oApp);
            // Forward the name of the systemAlias used to interpolate the URL
            // ClientSideTargetResolution will de-interpolate the URL before applying sap-system
            oInbound.resolutionResult.systemAlias = oInbound.resolutionResult.systemAlias || oSrc.systemAlias; // NOTE: "" is the local system alias
            oInbound.resolutionResult.text = oInbound.title;
            oInbound.deviceTypes = that._getMember(oApp,"sap|ui.deviceTypes") || {};
            // if not supplied, default is true (!)
            ["desktop", "tablet", "phone"].forEach(function(sMember) {
                // we overwrite member by member if deviceType specified in oSrc!
                if (Object.prototype.hasOwnProperty.call(oSrc.deviceTypes || {}, sMember)) {
                    oInbound.deviceTypes[sMember] = oSrc.deviceTypes[sMember];
                }
                if (!Object.prototype.hasOwnProperty.call(oInbound.deviceTypes, sMember)) {
                    oInbound.deviceTypes[sMember] = true;
                }
                oInbound.deviceTypes[sMember] = !!oInbound.deviceTypes[sMember];
            });
             // signature
            oInbound.signature = oSrc.signature || {};
            oInbound.signature.parameters = oInbound.signature.parameters || {};
            oInbound.signature.additionalParameters = (oSrc.signature || {}).additionalParameters || "allowed";
            //  construct the
            var indicatorDataSource = oSrc.indicatorDataSource || that._getMember(oApp,"sap|app.indicatorDataSource"); //???check

            var oTempTileComponent = indicatorDataSource ? "#Shell-dynamicTile" : "#Shell-staticTile";
            //TODO: check if this app descriptor is custom tile, then make it component
            if (that._getMember(oApp,"sap|app.type") === "tile" || that._getMember(oApp,"sap|flp.type") === "tile") {
                // we add the component name:
                oTempTileComponent = oInbound.resolutionResult;
                oTempTileComponent.url = that._getMember(oApp,"sap|platform|runtime.componentProperties.url");
                oTempTileComponent.componentName = that._getMember(oApp,"sap|ui5.componentName");

                oTargetOutbound = that._getMember(oApp, "sap|app.crossNavigation.outbounds.target");
                bIsCustomTile = true;
            }

            if (that._getMember(oApp,"sap|app.type") === "plugin" || that._getMember(oApp, "sap|flp.type") === "plugin") {
                return undefined;
            }

            if (that._getMember(oApp,"sap|flp.tileSize")) {
                sTileSize = that._getMember(oApp,"sap|flp.tileSize");
            }

            oInbound.tileResolutionResult = {
                title : oInbound.title,
                subtitle : oSrc.subtitle || that._getMember(oApp,"sap|app.subTitle"),
                icon : oSrc.icon || that._getMember(oApp,"sap|ui.icons.icon"),
                size : sTileSize,
                tileComponentLoadInfo : oTempTileComponent,
                indicatorDataSource : indicatorDataSource
            };

            oInbound.tileResolutionResult.isCustomTile = bIsCustomTile;
            if (oTargetOutbound) {
                oInbound.tileResolutionResult.targetOutbound = oTargetOutbound;
            }

            return oInbound;
        }

        var aInbounds = [];
        try {
            var aSiteApplications = Object.keys(oSite.applications).sort();
            aSiteApplications.forEach(function(sApplicationKey) {
                try {
                    var oApp = oSite.applications[sApplicationKey];
                    var oApplicationInbounds = that._getMember(oApp, "sap|app.crossNavigation.inbounds");
                    if (oApplicationInbounds) {
                        var lst2 = Object.keys(oApplicationInbounds).sort();
                        lst2.forEach(function(sInboundKey) {
                            var oInbound = oApplicationInbounds[sInboundKey];
                            var r = mapOne(sInboundKey, oInbound, oApp);
                            if (r) {
                                aInbounds.push(r);
                            }
                        });
                    }
                } catch (oError1) {
                    // this is here until validation on the CDM site is done
                    jQuery.sap.log.error(
                        "Error in application " + sApplicationKey + ": " + oError1,
                        oError1.stack
                    );
                }
            });
        } catch (oError2) {
            jQuery.sap.log.error(oError2);
            jQuery.sap.log.error(oError2.stack);
            return [];
        }

        return aInbounds;
    };

    /**
     * Extracts a valid <code>applicationType</code> field for
     * ClientSideTargetResolution from the site application resolution result.
     *
     * @param {object} oResolutionResult
     *   The application resolution result. An object like:
     * <pre>
     *   {
     *      "sap.platform.runtime": { ... },
     *      "sap.gui": { ... } // or "sap.wda" for wda applications
     *   }
     * </pre>
     * @param {object} oApp
     *   A site application object
     *
     * @returns {string}
     *   One of the following application types compatible with
     *   ClientSideTargetResolution service: "TR", "SAPUI5", "WDA", "URL".
     */
    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype._formatApplicationType = function (oResolutionResult, oApp) {
        var sApplicationType = oResolutionResult.applicationType;

        if (sApplicationType) {
            return sApplicationType;
        }
        var sComponentName = this._getMember(oApp,"sap|platform|runtime.componentProperties.self.name") || this._getMember(oApp,"sap|ui5.componentName");

        if (this._getMember(oApp,"sap|flp.appType") === "UI5" ||
            this._getMember(oApp,"sap|ui.technology") === "UI5") {

            oResolutionResult.applicationType = "SAPUI5";
            oResolutionResult.additionalInformation = "SAPUI5.Component=" + sComponentName;
            oResolutionResult.url = this._getMember(oApp,"sap|platform|runtime.componentProperties.url");
            oResolutionResult.applicationDependencies = this._getMember(oApp,"sap|platform|runtime.componentProperties");
            return "SAPUI5";
        }
        if (this._getMember(oApp,"sap|ui.technology") === "GUI") {
            oResolutionResult.applicationType = "TR";
            //oResult.url = this._getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.gui"] = this._getMember(oApp,"sap|gui");
            oResolutionResult.systemAlias = this._getMember(oApp,"sap|app.destination.name");
            return "TR";
        }
        if (this._getMember(oApp,"sap|ui.technology") === "WDA") {
            oResolutionResult.applicationType = "WDA";
            //oResult.url = this._getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.wda"] = this._getMember(oApp,"sap|wda");
            oResolutionResult.systemAlias = this._getMember(oApp,"sap|app.destination.name");
            return "WDA";
        }
        return "URL";
    };

    /**
     * Resolves a specific system alias.
     *
     * @param {string} sSystemAlias
     *    the system alias name to be resolved
     *
     * @return {jQuery.Deferred.Promise}
     *    a jQuery promise that resolves to a system alias data object.
     *    A live object is returned! The service must not change it.
     *    If the alias could not be resolved the promise is rejected.
     *
     *    Format of system alias data object. Example:
     *    <pre>{
     *        id: "AB1CLNT000",
     *        client: "000",
     *        language: "EN",
     *        http: {
     *            host: "ldcab1.xyz.com",
     *            port: 10000,
     *            pathPrefix: "/abc/def/"
     *        },
     *        https: {
     *            host: "ldcab1.xyz.com",
     *            port: 20000,
     *            pathPrefix: "/abc/def/"
     *        },
     *        rfc: {
     *            systemId: "AB1",
     *            host: "ldcsab1.xyz.com",
     *            port: 0,
     *            loginGroup: "PUBLIC",
     *            sncNameR3: "",
     *            sncQoPR3: "8"
     *        }
     *    }</pre>
     *
     * @private
     */
    sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter.prototype.resolveSystemAlias = function (sSystemAlias) {
        var oDeferred = new jQuery.Deferred(),
            that = this;

        this._getSystemAliases().done(function (oSystemAliases) {
            var sMessage,
                oSystemAliasData = sSystemAlias === ""
                    ? that._oLocalSystemAlias
                    : oSystemAliases[sSystemAlias];

            if (oSystemAliasData) {
                oDeferred.resolve(oSystemAliasData);
            } else {
                sMessage = "Cannot resolve system alias " + sSystemAlias;
                jQuery.sap.log.warning(
                    sMessage,
                    "The system alias cannot be found in the site response",
                    "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
                );
                oDeferred.reject(sMessage);
            }
        }).fail(function () {
              oDeferred.reject();
        });

        return oDeferred.promise();
    };

}());
