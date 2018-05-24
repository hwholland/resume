// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's UI5 component loader service.
 *  This is a shell-internal service and no public or application facing API!
 *
 * @version
 * 1.38.26
 */
(function () {
    "use strict";
    /*jslint nomen: true */
    /*global jQuery, sap, window */
    jQuery.sap.declare("sap.ushell.services.Ui5ComponentLoader");

    // application context
    var Ui5ComponentHandle = function(oComponent) {
       this._oComponent = oComponent;
    };

    Ui5ComponentHandle.onBeforeApplicationInstanceCreated = function (/* oComponentConfig */) {
        // May run Fiori 2.0 adaptation. This must run before the component is
        // created. Note, this method is synchronous, therefore
        // Fiori20AdapterTest must perform very lightweight synchronous
        // operations, such as, attaching an handler.
        jQuery.sap.require("sap.ushell.Fiori20AdapterTest");
    };

    Ui5ComponentHandle.prototype.getInstance = function() {
        return this._oComponent;
    };

    Ui5ComponentHandle.prototype.getMetadata = function() {
        return this._oComponent.getMetadata();
    };

    // ---------------------
    // ------ Service ------
    // ---------------------
    /**
     * This method MUST be called by the Unified Shell's container only, others
     * MUST call <code>sap.ushell.Container.getService("Ui5ComponentLoader")</code>.
     * Constructs a new instance of the UI5 Component Loader service.
     *
     * @class The Unified Shell's UI5 Component Loader service
     *
     * Note: This loader adds some hardcoded libraries for the standard fiori packaging.
     * Notably scaffolding libraries and core-ext-light must be available. This can be turned off
     * explicitly by setting the <code>amendedLoading</code> property to <code>false</code> in the
     * service configuration:
     * <pre>
     *  window["sap-ushell-config"] = {
     *      services : {
     *          "Ui5ComponentLoader": {
     *              config : {
     *                  amendedLoading : false
     *              }
     *          }
     *      }
     * </pre>
     *
     * @private
     * @constructor
     * @see sap.ushell.services.Container#getService
     *
     * @since 1.38.0
     */
    sap.ushell.services.Ui5ComponentLoader = function (oContainerInterface, sParameter, oConfig) {
        this._oConfig =  (oConfig && oConfig.config) || {};

        /**
         * Returns a map of all search parameters present in the search string of the given URL.
         *
         * @param {string} sUrl
         *   the URL
         * @returns {object}
         *   in member <code>startupParameters</code> <code>map&lt;string, string[]}></code> from key to array of values,
         *   in members <code>sap-xapp-state</code> an array of Cross application Navigation state keys, if present
         *   Note that this key is removed from startupParameters!
         * @private
         */
        function getParameterMap(sUrl) {
            var mParams = jQuery.sap.getUriParameters(sUrl).mParams,
                xAppState = mParams["sap-xapp-state"],
                oResult;
            delete mParams["sap-xapp-state"];
            oResult = {
                startupParameters : mParams
            };
            if (xAppState) {
                oResult["sap-xapp-state"] = xAppState;
            }
            return oResult;
        }

        /**
         * Loads and creates the UI5 component from the specified application properties object (the result of
         * a navigation target resolution).
         *
         * @param oAppProperties object
         *    Application properties as typically produced by resolveHashFragment,
         *    note that some members of componentData are propagated, this is used in the myinbox scenario,
         *    see (CrossApplicationNavigation.createComponentInstance)
         * @return a jQuery promise which resolves with the application properties object which is enriched
         *  with an <code>componentHandle<code> object that encapsulates the loaded component.
         *  If the UI5 core resources have been loaded completely as a result of this call (either amendedLoading is
         *  disabled or the core-ext-light.js module is loaded as part of this call or was already loaded), the result
         *  object also gets a flag <code>coreResourcesFullyLoaded</code> which is true.
         *
         * @private
         */
        this.createComponent = function (oAppProperties, oParsedShellHash, aWaitForBeforeInstantiation) {
            var oDeferred = new jQuery.Deferred(),
                sPreloadModule = window["sap-ui-debug"] ? "sap/fiori/core-ext-light-dbg.js" : "sap/fiori/core-ext-light.js",
                sComponentUrl = oAppProperties && oAppProperties.url,
                oComponentProperties,
                bLoadCoreExt = true,
                bCoreExtAlreadyLoaded =
                    jQuery.sap.isDeclared('sap.fiori.core', true) || jQuery.sap.isDeclared('sap.fiori.core-ext-light', true),
                bLoadDefaultDependencies = true,
                oApplicationDependencies = oAppProperties && oAppProperties.applicationDependencies || {},
                iIndex,
                oUrlData,
                oComponentData,
                // optimized loading (default libs, core-ext-light) is on by default, but can be switched off explicitly
                // by platforms which do not support it (sandbox, demo); productive platforms should use it by default
                // see BCP 1670249780 (no core-ext loading in cloud portal)
                bAmendedLoading = (this._oConfig && this._oConfig.hasOwnProperty("amendedLoading")) ? this._oConfig.amendedLoading : true,
                bCoreResourcesFullyLoaded = false;

            if (jQuery.isArray(oApplicationDependencies.messages)) {
                oApplicationDependencies.messages.forEach(function (oMessage) {
                    var sSeverity = String.prototype.toLowerCase.call(oMessage.severity || "");
                    sSeverity = ["trace", "debug", "info", "warning", "error", "fatal"].indexOf(sSeverity) !== -1 ? sSeverity : "error";
                    jQuery.sap.log[sSeverity](oMessage.text, oMessage.details, oApplicationDependencies.name);
                });
            }

            if (oAppProperties && oAppProperties.ui5ComponentName) {

                // take over all properties of applicationDependencies to enable extensions in server w/o
                // necessary changes in client
                oComponentProperties = jQuery.extend(true, {}, oAppProperties.applicationDependencies);

                oComponentData = jQuery.extend(true, {startupParameters: {}}, oAppProperties.componentData);
                if (sComponentUrl) {
                    iIndex = sComponentUrl.indexOf("?");
                    if (iIndex >= 0) {
                        // pass GET parameters of URL via component data as member startupParameters and as xAppState
                        // (to allow blending with other oComponentData usage, e.g. extensibility use case)
                        oUrlData = getParameterMap(sComponentUrl);
                        oComponentData.startupParameters = oUrlData.startupParameters;
                        if (oUrlData["sap-xapp-state"]) {
                            oComponentData["sap-xapp-state"] = oUrlData["sap-xapp-state"];
                        }
                        sComponentUrl = sComponentUrl.slice(0, iIndex);
                    }
                }

                // add application configuration if specified
                if (oAppProperties.applicationConfiguration) {
                    oComponentData.config = jQuery.extend(true, {}, oAppProperties.applicationConfiguration);
                }

                oComponentProperties.componentData = oComponentData;

                // default dependencies loading can be skipped explicitly (homepage component use case)
                if (oAppProperties.hasOwnProperty("loadDefaultDependencies")) {
                    bLoadDefaultDependencies = oAppProperties.loadDefaultDependencies;

                    // delete after evaluation to avoid warnings in ApplicationContainer
                    // TODO: can be removed when ApplicationContainer construction is changed
                    delete oAppProperties.loadDefaultDependencies;
                }
                // or via service configuration (needed for unit tests)
                if (this._oConfig && this._oConfig.hasOwnProperty("loadDefaultDependencies")) {
                    bLoadDefaultDependencies = bLoadDefaultDependencies && this._oConfig.loadDefaultDependencies;
                }

                bLoadDefaultDependencies = bLoadDefaultDependencies && bAmendedLoading;
                // set default library dependencies if no asyncHints defined (apps without manifest)
                // TODO: move fallback logic to server implementation
                if (!oComponentProperties.asyncHints) {
                    oComponentProperties.asyncHints =
                        bLoadDefaultDependencies ? {"libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"]} : {};
                }

                // core-ext light is loaded by default, but can be skipped explicitly (homepage component use case)
                if (oAppProperties.hasOwnProperty("loadCoreExt")) {
                    bLoadCoreExt = oAppProperties.loadCoreExt;

                    // delete after evaluation to avoid warnings in ApplicationContainer
                    delete oAppProperties.loadCoreExt;
                }

                if (bLoadCoreExt && bAmendedLoading && !bCoreExtAlreadyLoaded) {
                    oComponentProperties.asyncHints.preloadBundles =
                        oComponentProperties.asyncHints.preloadBundles || [];
                    oComponentProperties.asyncHints.preloadBundles.push(sPreloadModule);
                }
                // set flag for core resources if core-ext is already loaded or amended loading is switched off (in the latter case
                // we expect that the page performs a regular UI5 bootstrap which should be complete)
                // if the loadCoreExt flag is explicitly set to false (FLP homepage component use case), the flag should also be false
                bCoreResourcesFullyLoaded = bLoadCoreExt && ( bLoadCoreExt  || bCoreExtAlreadyLoaded || (bAmendedLoading === false) );

                if (aWaitForBeforeInstantiation) {
                    oComponentProperties.asyncHints.waitFor = aWaitForBeforeInstantiation;
                }

                // use component name from app properties (target mapping) only if no name
                // was provided in the component properties (applicationDependencies)
                // for supporting application variants, we have to differentiate between app ID
                // and component name
                if (!oComponentProperties.name) {
                    oComponentProperties.name = oAppProperties.ui5ComponentName;
                }
                if (sComponentUrl) {
                    oComponentProperties.url = sComponentUrl;
                }
                oComponentProperties.async = true;

                // construct component id from shell hash if specified; must be kept stable!
                if (oParsedShellHash) {
                    oComponentProperties.id = "application-" + oParsedShellHash.semanticObject + "-" + oParsedShellHash.action + "-component";

                    // static method called for operations to be done before
                    // the application component is instantiated
                    Ui5ComponentHandle.onBeforeApplicationInstanceCreated(oComponentProperties);
                }

                sap.ui.component(oComponentProperties).then(function(oComponent) {
                    oAppProperties.componentHandle = new Ui5ComponentHandle(oComponent);
                    if (bCoreResourcesFullyLoaded) {
                        oAppProperties.coreResourcesFullyLoaded = true;
                    }
                    oDeferred.resolve(oAppProperties);
                }, function(vError) {
                    var sMsg = "Failed to load UI5 component with properties '" + JSON.stringify(oComponentProperties) + "'.",
                        vDetails;
                    if (typeof vError === "object" && vError.stack) {
                        vDetails = vError.stack;
                    } else {
                        vDetails = vError;
                    }
                    jQuery.sap.log.error(sMsg, vDetails, "sap.ushell.services.Ui5ComponentLoader");
                    oDeferred.reject(vError);
                });
            } else {
                // resolve anyway, without UI5 application  context
                oDeferred.resolve(oAppProperties);
            }

            return oDeferred.promise();
        };
    };

    sap.ushell.services.Ui5ComponentLoader.hasNoAdapter = true;
})();
