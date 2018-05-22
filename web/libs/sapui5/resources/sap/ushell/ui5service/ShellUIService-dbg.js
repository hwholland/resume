// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

/**
 * @fileOverview The ShellUIService UI5 service
 *
 * @version 1.38.26
 */

/**
 * @namespace sap.ushell.ui5service.ShellUIService
 *
 * @public
 */


(function () {
    "use strict";
    /*global jQuery, sap, setTimeout, clearTimeout, window */
    jQuery.sap.declare("sap.ushell.ui5service.ShellUIService");
    jQuery.sap.require("sap.ui.core.service.ServiceFactoryRegistry");
    jQuery.sap.require("sap.ui.core.service.ServiceFactory");
    jQuery.sap.require("sap.ui.base.EventProvider");

    var sLastSetTitle;

    var oEventProvider = new sap.ui.base.EventProvider();

    var O_EVENT_NAME = {
        hierarchyChanged: "hierarchyChanged",
        relatedAppsChanged: "relatedAppsChanged",
        titleChanged: "titleChanged"
    };

    var sActiveComponentId;

    /**
     * Returns an instance of the ShellUIService. This constructor must only be
     * called internally by the Fiori Launchpad renderer and never by
     * applications.
     *
     * Instead, this service should be consumed by app components as described
     * in the overview section of this class.
     *
     * @name sap.ushell.ui5service.ShellUIService
     * @class
     *
     * @classdesc The Unified Shell's ShellUIService service.
     *
     * This service allows apps to interact with the Fiori Launchpad UI.
     * The service is injected in the app components by the FLP renderer
     * before the corresponding apps start. To consume the service,
     * app components should declare it in their manifest.json as follows:
     *
     * <pre>
     * {
     *    ...
     *    "sap.ui5": {
     *       "services" : {
     *          "ShellUIService": {
     *              "factoryName": "sap.ushell.ui5service.ShellUIService"
     *          }
     *       }
     *    }
     *    ...
     * }
     * </pre>
     *
     * The service can be then consumed within the component as shown in the
     * following example:
     * <pre>
     * // Component.js
     * ...
     * this.getService("ShellUIService").then( // promise is returned
     *    function (oService) {
     *       oService.setTitle("Application Title");
     *    },
     *    function (oError) {
     *       jQuery.sap.log.error("Cannot get ShellUIService", oError, "my.app.Component");
     *    }
     * );
     * ...
     * </pre>
     *
     * @param {object} oCallerContext
     *   The context in which the service was instantiated. Must have the
     *   format:
     * <pre>
     * {
     *   scopeType: "component",
     *   scopeObject: [a UI5 Component in the sap.ushell package]
     * }
     * </pre>
     *
     * @public
     * @since 1.38.0
     */
    sap.ui.core.service.Service.extend("sap.ushell.ui5service.ShellUIService", /** @lends sap.ushell.ui5service.ShellUIService# */ {
        init: function () {
            /*
             * Service injection
             */
            var that = this,
                oPublicInterface = this.getInterface();

            // Only one component can set/get at a given time. Here we try to
            // avoid that no yet-to-be-destroyed apps call set/get methods by
            // giving priority to the last instantiated component.
            oPublicInterface.init = function () {
                that._amendPublicServiceInstance.call(
                    that,  // always the "private" service
                    this   // public service instance
                );
            };

            sap.ui.core.service.ServiceFactoryRegistry.register(
                "sap.ushell.ui5service.ShellUIService",
                new sap.ui.core.service.ServiceFactory(oPublicInterface)
            );

        },
        /**
         * Sets the id of the active component, that is, the component allowed
         * to call public methods of this service. This method is mainly here
         * for supportability purposes.
         *
         * @param {string} sId
         *    The id of the active component.
         * @private
         * @since 1.38.0
         */
        _setActiveComponentId: function (sId) {
            sActiveComponentId = sId;
        },
        /**
         * Getter for the id of the active component.  This method is mainly
         * here for supportability purposes.
         *
         * @returns {string}
         *   The id of the component currently active in the Launchpad.
         * @private
         * @since 1.38.0
         */
        _getActiveComponentId: function () {
            return sActiveComponentId;
        },
        /**
         * Getter for the event provider.  This method is mainly
         * here for supportability purposes.
         *
         * @returns {object}
         *   The event provider
         * @private
         * @since 1.38.0
         */
        _getEventProvider: function () {
            return oEventProvider;
        },
        /**
         * Getter for the title.  This method is mainly
         * here for supportability purposes.
         *
         * @returns {object}
         *   The event provider
         * @private
         * @since 1.38.0
         */
        _getLastSetTitle: function () {
            return sLastSetTitle;
        },

        /**
         * Ensures that the given argument is an array of object, having all string values.
         * This method logs an error message in case this is not the case.
         *
         * <pre>
         * IMPORTANT: this method must not rely on its context when called or
         * produce side effects.
         * </pre>
         *
         * @param {variant} vArg
         *   Any value.
         * @param {string} sMethodName
         *   The name of the method that called this function.
         * @returns {boolean}
         *   Whether <code>vArg</code> is a string. Logs an error message
         *   reporting <code>sMethodName</code> in case <code>vArg</code> is
         *   not a string.
         *
         * @private
         * @since 1.38.0
         */
        _ensureArrayOfObjectOfStrings: function (vArg, sMethodName) {
            var bValidates = jQuery.isArray(vArg) && vArg.every(function (oObject) {
                return jQuery.isPlainObject(oObject)
                    && Object.keys(oObject).length > 0
                    && Object.keys(oObject).every(function (sKey) {
                        return typeof oObject[sKey] === "string";
                    });
            });

            if (!bValidates) {
                jQuery.sap.log.error(
                    "'" + sMethodName + "' was called with invalid parameters",
                    "An array of non-empty objects with string values is expected",
                    "sap.ushell.ui5service.ShellUIService"
                );
            }

            return bValidates;
        },

        /**
         * Ensures that the given argument is a string, logging an error
         * message in case it's not.
         *
         * <pre>
         * IMPORTANT: this method must not rely on its context when called or
         * produce side effects.
         * </pre>
         *
         * @param {variant} vArg
         *   Any value.
         * @param {string} sMethodName
         *   The name of the method that called this function.
         * @returns {boolean}
         *   Whether <code>vArg</code> is a string. Logs an error message
         *   reporting <code>sMethodName</code> in case <code>vArg</code> is
         *   not a string.
         *
         * @private
         * @since 1.38.0
         */
        _ensureString: function (vArg, sMethodName) {
            var sType = typeof vArg;
            if (sType !== "string") {
                jQuery.sap.log.error(
                    "'" + sMethodName + "' was called with invalid arguments",
                    "the parameter should be a string, got '" + sType + "' instead",
                    "sap.ushell.ui5service.ShellUIService"
                );
                return false;
            }
            return true;
        },

        /**
         * Wraps a given public service interface method with a check that
         * determines whether the method can be called. This helps preventing
         * cases in which calling the method would disrupt the functionality of
         * the currently running app.  For example, this check would prevent a
         * still alive app to change the header title while another app is
         * being displayed.
         *
         * @param {object} oPublicServiceInstance
         *  The instance of the public service interface.
         * @param {string} sPublicServiceMethod
         *  The method to be wrapped with the check.
         *
         * @private
         * @since 1.38.0
         */
        _addCallAllowedCheck: function (oPublicServiceInstance, sPublicServiceMethod) {
            var that = this;
            oPublicServiceInstance[sPublicServiceMethod] = function () {
                var oContext = oPublicServiceInstance.getContext(); // undefined -> don't authorize
                if (!oContext || oContext.scopeObject.getId() !== sActiveComponentId) {
                    jQuery.sap.log.warning(
                        "Call to " + sPublicServiceMethod + " is not allowed",
                        "This may be caused by an app component other than the active '" +  sActiveComponentId + "' that tries to call the method",
                        "sap.ushell.ui5service.ShellUIService"
                    );
                    return undefined; // eslint
                }

                return that[sPublicServiceMethod].apply(oPublicServiceInstance, arguments);
            };
        },
        /**
         * Adjusts the method of the public service instance.
         * Specifically:
         * <ul>
         * <li>Adds safety checks to public methods</li>
         * <li>Register the component that called <code>.getService</code> as
         *     the currently active component.
         * </ul>
         *
         * @param {sap.ui.base.Interface} oPublicServiceInstance
         *    The public service interface.
         *
         * @private
         * @since 1.38.0
         */
        _amendPublicServiceInstance: function (oPublicServiceInstance) {
            var that = this,
                oContext;

            // attempt to register this as the "active component"

            oContext = oPublicServiceInstance.getContext();
            if (typeof oContext === "undefined") {
                // ServiceFactoryRegistry#get static method was used on the
                // service factory to obtain the service. Don't record the
                // currently active component so that future call from an
                // active app succeed. E.g., on view change.
                //
                return;
            }

            // must re-bind all public methods to the public interface
            // instance, as they would be otherwise called in the context of
            // the service instance.
            ["setTitle", "setHierarchy", "setRelatedApps"].forEach(function (sMethodToSetup) {
                that._addCallAllowedCheck(oPublicServiceInstance, sMethodToSetup);
            });

            if (oContext.scopeType === "component") {
                this._setActiveComponentId(oContext.scopeObject.getId());
                return;
            }

            jQuery.sap.log.error(
                "Invalid context for ShellUIService interface",
                "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
                "sap.ushell.ui5service.ShellUIService"
            );
        },

        /**
         * Displays the given hierarchy in the shell header.
         *
         * @param {object[]} [aHierarchyLevels]
         *    An array representing hierarchies of the currently displayed
         *    app.  The array should specify title, icon, and
         *    navigation intent as shown in the following example:
         * <pre>
         * [
         *       {
         *           title: "App 1",
         *           icon: "sap-icon://folder",
         *           subtitle: "go to app 1",
         *           intent: "#Action-toapp1"
         *       },
         *       {
         *           title: "App 2",
         *           icon: "sap-icon://folder",
         *           subtitle: "go to app 2",
         *           intent: "#Action-toapp2"
         *       },
         *       {
         *           title: "App 3",
         *           icon: "sap-icon://folder",
         *           subtitle: "go to app 3",
         *           intent: "#Action-toapp3"
         *       }
         * ]
         * </pre>
         *
         * The default app hierarchy is applied if no parameter is given.
         *
         * @since 1.38.0
         * @public
         */
        setHierarchy : function(aHierarchyLevels) {
            /*
             * IMPORTANT: this method may be called in the context of the
             * service or the public service instance. In the latter case
             * "this" has no access to private methods.
             */

            // validate input
            if (typeof aHierarchyLevels !== "undefined"
                && !sap.ushell.ui5service.ShellUIService.prototype._ensureArrayOfObjectOfStrings(aHierarchyLevels, "setHierarchy")) {

                return;
            }

            var oComponent = this.getContext().scopeObject;

            oEventProvider.fireEvent(O_EVENT_NAME.hierarchyChanged, {
                data: aHierarchyLevels,
                component: oComponent
            });
            return;
        },
        /**
         * Displays the given title in the shell header. This method should not
         * be called if the app calling the method is not currently displayed
         * in the Fiori Launchpad.
         *
         * @param {string} [sTitle]
         *    The new title. The default title is set if this argument is not given.
         *
         * @since 1.38.0
         * @public
         */
        setTitle : function(sTitle) {
            /*
             * IMPORTANT: this method may be called in the context of the
             * service or the public service instance. In the latter case
             * "this" has no access to private methods.
             */

            // validate input
            if (typeof sTitle !== "undefined"
                && !sap.ushell.ui5service.ShellUIService.prototype._ensureString(sTitle, "setTitle")) {

                return;
            }

            var oComponent = this.getContext().scopeObject;

            sLastSetTitle = sTitle;
            oEventProvider.fireEvent(O_EVENT_NAME.titleChanged, {
                data: sTitle,
                component: oComponent
            });
            return;
        },
        /**
         * Returns the title that was last set via {@link setTitle}.
         *
         * @returns {string}
         *    The title that was last set via {@link setTitle}.
         *
         * @since 1.38.0
         * @public
         */
        getTitle : function() {
            return this._getLastSetTitle();
        },
        /**
         * Used by apps to set related apps.  This setting is propagated
         * towards the Shell Header via corresponding events.
         *
         * @param {object[]} [aRelatedApps]
         *    an array of related apps, for example like:
         * <pre>
         * [
         *     {
         *         title: "Related App 1",
         *         icon: "sap-icon://documents",
         *         intent: "#Action-todefaultapp"
         *     },
         *     {
         *         title: "Related App 2",
         *         subtitle: "Application view number 2",
         *         intent: "#Action-todefaultapp"
         *     },
         *     {
         *         title: "Related App 3",
         *         subtitle: "Application view number 3",
         *         intent: "#Action-todefaultapp"
         *     }
         * ]
         * </pre>
         *
         * @since 1.38.0
         * @private
         */
        setRelatedApps : function(aRelatedApps) {
            /*
             * IMPORTANT: this method may be called in the context of the
             * service or the public service instance. In the latter case
             * "this" has no access to private methods.
             */

            // validate input
            if (typeof aRelatedApps !== "undefined"
                && !sap.ushell.ui5service.ShellUIService.prototype._ensureArrayOfObjectOfStrings(aRelatedApps, "setRelatedApps")) {

                return;
            }

            var oComponent = this.getContext().scopeObject;

            oEventProvider.fireEvent(O_EVENT_NAME.relatedAppsChanged, {
                data: aRelatedApps,
                component: oComponent
            });
            return;
        },
        /**
         * Returns version number in use (e.g. 2 for Fiori 2.0). Will be used
         * for checking whether the Fiori 2.0 header should be used or not.
         *
         * @returns {number}
         *    the version number
         *
         * @since 1.38.0
         * @private
         */
        getUxdVersion : function() {
            // use 1.37.0 to include cases where the snapshot is used
            if ((new jQuery.sap.Version(sap.ui.version).compareTo("1.37.0")) >= 0) {
                return 2;
            }
            return 1;
        },
        _attachHierarchyChanged : function(fnFunction) {
            this._getEventProvider().attachEvent(O_EVENT_NAME.hierarchyChanged, fnFunction);
        },
        _detachHierarchyChanged : function (fnFunction) {
            this._getEventProvider().detachEvent(O_EVENT_NAME.hierarchyChanged, fnFunction);
        },
        _attachTitleChanged : function (fnFunction) {
            this._getEventProvider().attachEvent(O_EVENT_NAME.titleChanged, fnFunction);
        },
        _detachTitleChanged : function (fnFunction) {
            this._getEventProvider().detachEvent(O_EVENT_NAME.titleChanged, fnFunction);
        },
        _attachRelatedAppsChanged : function (fnFunction) {
            this._getEventProvider().attachEvent(O_EVENT_NAME.relatedAppsChanged, fnFunction);
        },
        _detachRelatedAppsChanged : function (fnFunction) {
            this._getEventProvider().detachEvent(O_EVENT_NAME.relatedAppsChanged, fnFunction);
        }
    });

}());
