// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's PluginManager service, which allows you to handle the loading of Fiori Launchpad plugins.
 *
 * @version 1.38.26
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.services.PluginManager");

    var S_COMPONENT_NAME = "sap.ushell.services.PluginManager",
        S_PLUGIN_TYPE_PARAMETER = "sap-ushell-plugin-type",
        S_DEFAULT_PLUGIN_CATEGORY = "RendererExtensions",
        aSupportedPluginCategories = [S_DEFAULT_PLUGIN_CATEGORY, "UserDefaults"];

    /**
     * The unified shell's PluginManager service, which allows you to handle the loading
     * of Fiori Launchpad plugins.
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the PluginManager service.
     *
     * @class
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.38
     * @private
     */
    sap.ushell.services.PluginManager = function () {
        var that = this;
        this._oPluginCollection = {};
        this._oCategoryLoadingProgress = {};
        // map to avoid multiple loading of the same plugin (only multiple instantiation is possible)
        this._mInitializedComponentPromise = {};

        // initialize plugin collection
        aSupportedPluginCategories.forEach(function (sPluginCategory) {
            that._oPluginCollection[sPluginCategory] = {};
            that._oCategoryLoadingProgress[sPluginCategory] = new jQuery.Deferred();
        });

        /**
         * Instantiates a UI5 component and makes sure the passed
         * parameters are aligned with the asynchronous plugin use case.
         *
         * @param {string} sCategory
         *     Plugin category the plugin is belonging to.
         * @param {object} sPluginName
         *     Plugin itself.
         * @param {jQuery.Deferred} oPluginDeferred
         *     A deferred object that gets resolved when the respective component has been
         *     instantiated successfully, and rejected when the instantiation has been failing.
         * @since 1.38
         * @private
         */
        this._handlePluginCreation = function (sCategory, sPluginName, oPluginDeferred) {
            var that = this,
                oPlugin = (that._oPluginCollection[sCategory])[sPluginName];

            try {
                if (oPlugin.hasOwnProperty("component")) {
                    // only add handler to promise in case that the component has already been loaded
                    if (that._mInitializedComponentPromise.hasOwnProperty(oPlugin.component)) {
                        that._mInitializedComponentPromise[oPlugin.component].then(
                                function () {
                                    that._instantiateComponent(oPlugin, oPluginDeferred);
                                },
                                function () {  // note, no error logging here
                                    that._instantiateComponent(oPlugin, oPluginDeferred);
                                }
                        );
                    } else {
                        that._mInitializedComponentPromise[oPlugin.component] = that._instantiateComponent(oPlugin, oPluginDeferred);
                    }
                } else {
                    jQuery.sap.log.error("Invalid plugin configuration. The plugin " + sPluginName
                        + " must contain a <component> key", S_COMPONENT_NAME);
                }
            } catch (oError) {
                jQuery.sap.log.error("Error while loading bootstrap plugin: " + oPlugin.component || "", S_COMPONENT_NAME);

                // make sure to reject promise in case of user default plug-in
                if (oPluginDeferred) {
                    oPluginDeferred.reject(oError);
                }
            }
        };

        /**
         * Instantiates a UI5 component and makes sure the passed
         * parameters are aligned with the asynchronous plugin use case.
         *
         * @param {object} oPlugin
         *     The plugin itself.
         * @param {jQuery.Deferred} oPluginDeferred
         *     A deferred object that mimics the internally used ECMA6 promise.
         *
         * @returns {Promise}
         *     An ECMA6 promise returned by the call of sap.ui.component().
         * @since 1.38
         * @private
         */
        this._instantiateComponent = function (oPlugin, oPluginDeferred) {
            var oComponentOptions = jQuery.extend(true, {}, oPlugin),
                oApplicationProperties = {
                    ui5ComponentName: oComponentOptions.component,
                    url: oComponentOptions.url
                };

            // fix component name according to UI5 API
            oComponentOptions.name = oComponentOptions.component;
            delete oComponentOptions.component;

            // UI5 component loader expects application properties as returned by NavTargetResolution service
            // component options are passed in applicationDependencies property
            oApplicationProperties.applicationDependencies = oComponentOptions;

            // plug-in config has to be moved to applicationConfiguration property
            if (oComponentOptions.config) {
                oApplicationProperties.applicationConfiguration = oComponentOptions.config;
                delete oComponentOptions.config;
            }
            
            // disable loading of default dependencies for plugins (only used for old apps w/o manifest)
            oApplicationProperties.loadDefaultDependencies = false;

            return sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(oApplicationProperties)
                .done(function(oLoadedComponent) {
                    if (oPluginDeferred) {
                        oPluginDeferred.resolve();
                    }
                }).fail(function(oError) {
                    // errors always logged per component
                    oError = oError || "";
                    jQuery.sap.log.error("Cannot create UI5 plugin component: " + oError,
                        oError.stack,  // stacktrace not only available for all browsers
                        S_COMPONENT_NAME);
                    if (oPluginDeferred) {
                        oPluginDeferred.reject(oError);
                    }
                });
//            return sap.ui.component(oComponentOptions).then(
//                    function () {
//                        if (oPluginDeferred) {
//                            oPluginDeferred.resolve();
//                        }
//                    },
//                    function (oError) {
//                        // errors always logged per component
//                        oError = oError || "";
//                        jQuery.sap.log.error("Cannot create UI5 plugin component: " + oError,
//                            oError.stack,  // stacktrace not only available for all browsers
//                            S_COMPONENT_NAME);
//                        if (oPluginDeferred) {
//                            oPluginDeferred.reject(oError);
//                }
//            });
        };

        /**
         * Returns an array of supported plugin categories
         * which could be managed by the PluginManager.
         *
         * @returns {array}
         *   Supported plugins which could be managed by the PluginManager.
         * @since 1.38
         * @private
         */
        this.getSupportedPluginCategories = function () {
            return jQuery.extend(true, [], aSupportedPluginCategories);
        };

        /**
         * Returns a map of all the plugins which are registered with the PluginManager
         * sorted by supported plugin categories.
         *
         * <code>
         *   {
         *       "PluginCategoryA": [oPluginX, oPluginY, oPluginZ],
         *       "PluginCategoryB": [oPluginG]
         *   }
         * </code>
         *
         * @returns {object}
         *   Map of registered plugins
         * @since 1.38
         * @private
         */
        this.getRegisteredPlugins = function () {
            return jQuery.extend(true, {}, this._oPluginCollection);
        };

        /**
         * Initializes the PluginManager with a certain set of plugins.
         * It's task is to insert those plugins systematically into a plugin
         * collection handled by the PluginManager to be able to manage them
         * in a later point in time.
         *
         * @param {object} oPlugins
         *   Set of plugins.
         *
         * @since 1.38
         * @private
         */
        this.registerPlugins = function (oPlugins) {
            var that = this,
                oCurrentPlugin,
                oPluginConfig;

            if (!oPlugins) {
                return;
            }
            sap.ushell.utils.addTime("PluginManager.registerPlugins");
            // insert plugins from plugin configuration into plugin collection which is sorted by category
            Object.keys(oPlugins).sort().forEach(function (sPluginName) {
                oCurrentPlugin = oPlugins[sPluginName] || {};
                oPluginConfig = oCurrentPlugin.config || {};

                // module mechanism (modules should be required immediatly)
                if (oCurrentPlugin && oCurrentPlugin.hasOwnProperty("module")) {
                    jQuery.sap.log.error("Plugin " + sPluginName
                            + " cannot get registered, because the module mechanism for plugins is not valid anymore. Plugins need to be defined as SAPUI5 components.",
                            S_COMPONENT_NAME);
                    // The following line of code should be removed for the next SP,
                    // so that plugins defined as modules are not allowed anymore.
                    jQuery.sap.require(oCurrentPlugin.module);
                    return;
                }

                if (oPluginConfig && oPluginConfig.hasOwnProperty(S_PLUGIN_TYPE_PARAMETER)) {
                    if (jQuery.inArray(oPluginConfig[S_PLUGIN_TYPE_PARAMETER], aSupportedPluginCategories) !== -1) {
                        (that._oPluginCollection[oPluginConfig[S_PLUGIN_TYPE_PARAMETER]])[sPluginName] = jQuery.extend(true, {}, oPlugins[sPluginName]);
                    } else {
                        // plugin type is not supported
                        jQuery.sap.log.warning("Plugin " + sPluginName
                            + " will not be inserted into the plugin collection of the PluginManager, because of unsupported category "
                            + oPluginConfig[S_PLUGIN_TYPE_PARAMETER],
                            S_COMPONENT_NAME);
                    }
                } else {
                    // use default plugin category
                    (that._oPluginCollection[S_DEFAULT_PLUGIN_CATEGORY])[sPluginName] =  jQuery.extend(true, {}, oPlugins[sPluginName]);
                }
            });
        };

        /**
         * Returns the promise object for a given plugin category.
         *
         * @param {string} sPluginCategory
         *   Plugin category
         * @returns {jQuery.Deferred.promise}
         *   A promise which resolves when the respective plugin category
         *   finished loading. The promise rejects if the respective
         *   plugin category could not be loaded due to errors.
         * @since 1.38
         * @private
         */
        this.getPluginLoadingPromise = function (sPluginCategory) {
            if (this._oCategoryLoadingProgress.hasOwnProperty(sPluginCategory)) {
                return this._oCategoryLoadingProgress[sPluginCategory].promise();
            }
        };

        /**
         * Triggers the loading of a certain plugin category.
         * Possible and supported plugin categories are <code>RendererExtensions</code>
         * and <code>UserDefaults</code>.
         *
         * @param {string} sPluginCategory
         *   Category of plugins which should be loaded.
         * @returns {jQuery.Deferred}
         *   A <code>jQuery.promise</code> to be resolved when all plugins of the
         *   respective category are loaded completely.
         *   The promise will be rejected if the passed category is not supported
         *   by the PluginManager or one of the plugins could not be loaded.
         *
         * @since 1.38
         * @private
         */
        this.loadPlugins = function (sPluginCategory) {
            var that = this,
                aPluginPromises,
                oPluginDeferred;

            sap.ushell.utils.addTime("PluginManager.startLoadPlugins[" + sPluginCategory + "]");
            // check category for supportability
            if (jQuery.inArray(sPluginCategory, aSupportedPluginCategories) !== -1) {
                // check whether plugins for this certain category are already loaded or are currently loading
                if (that._oCategoryLoadingProgress[sPluginCategory].pluginLoadingTriggered !== undefined) {
                    return that._oCategoryLoadingProgress[sPluginCategory].promise();
                } else {
                    that._oCategoryLoadingProgress[sPluginCategory].pluginLoadingTriggered = true;
                }

                // check whether plugins are existing in the respective category
                if (Object.keys(that._oPluginCollection[sPluginCategory]).length > 0) {
                    aPluginPromises = [];

                    // loop over plugins in respective plugin category which should be loaded
                    Object.keys(that._oPluginCollection[sPluginCategory]).forEach(function (sPluginName) {
                        oPluginDeferred = new jQuery.Deferred();
                        aPluginPromises.push(oPluginDeferred.promise());
                        that._handlePluginCreation(sPluginCategory, sPluginName, oPluginDeferred);
                    });

                    jQuery.when.apply(undefined, aPluginPromises)
                        .done(function() {
                            sap.ushell.utils.addTime("PluginManager.endLoadPlugins[" + sPluginCategory + "]");
                            that._oCategoryLoadingProgress[sPluginCategory].resolve();
                        })
                        .fail(that._oCategoryLoadingProgress[sPluginCategory].reject.bind());
                } else {
                    // there are no plugins to be loaded
                    that._oCategoryLoadingProgress[sPluginCategory].resolve();
                }
            } else {
                // plugin category is not supported
                jQuery.sap.log.error("Plugins with category " + sPluginCategory + " cannot be loaded by the PluginManager", S_COMPONENT_NAME);
                that._oCategoryLoadingProgress[sPluginCategory].reject("Plugins with category " + sPluginCategory + " cannot be loaded by the PluginManager");
            }

            return that._oCategoryLoadingProgress[sPluginCategory].promise();
        };
    };

    sap.ushell.services.PluginManager.hasNoAdapter = true;
}());
