sap.ui.define(['sap/ui/core/UIComponent', 'sap/m/MessageBox', 'sap/ui/model/json/JSONModel'], function(UIComponent, MessageBox, JSONModel) {
    "use strict";

    /**
     * The primary web-facing class for the application.  It's responsibility is
     * to listen for events that require site navigation, then find and serve
     * that content to the browser.  There is an object called a 'router' used
     * but it's not to be confused with the GET/POST router on the server-side.
     * In terms of architecture, the web component could be thought of as the 'V
     * and C' in 'MVC' (view/controller in model-view-controller).
     * 
     * Wherever possible I try to consolidate functions that are shared between 
     * views into this component, so they may all leverage shared code.
     *
     * @class       resume.web.Component
     * @extends     sap.ui.core.UIComponent
     */
    var Component = UIComponent.extend("resume.web.Component", {

        /**
         * Based on UI5 api guidelines, setting a metadata object on the components
         * will instruct the browser to read the settings of the component from a 
         * manifest.json file in the same location on the filesystem as the 
         * Component.js.  The manifest file also contains a very important set thing:
         * models to load/pre-load (from outside data sources) and performance tuning 
         * parameters - as the UI5 framework has an optional preload routine which (if 
         * done properly) dramatically improves the overall application performance.
         * 
         * Note: Pre-load is not yet currently configured in this implementation of the
         * resume framework.
         * 
         * @property   {Object} metadata settings and information about the application
         * @memberof   resume.web.Component
         */
        metadata: {
            manifest: "json"
        },

        /**
         * Constructor for the new object, responsible for loading the internal router 
         * specific to user-interface navigation.  Wherever possible I have chosen JSON
         * as the view type (as opposed to XML or JS) because it's easier for me to identify
         * patterns in JSON, thus making templating and/or dynamic data-driven content 
         * easier to manage.
         * 
         * @method      init
         * @memberof    resume.web.Component
         */
        init: function() {
            var that = this;
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
            /**
             * The UI5 router is not to be confused with the node router.  Node's router
             * is for determining what to do when a GET/POST request is performed to a particular
             * end-point designated by the code.  Node's router enables UI5 to access the server-side
             * objects/modules by making GET/POST requests which can accept parameters and return
             * objects or values.  This UI5 router is a class in the UI5 framework that helps 
             * simplify the process of controlling the flow from page to page within the web application.
             * It also enables simulation of the browser "back" button to previous views/pages 
             * that were loaded without actually navigation to a new HTTP destination.  This way
             * the application doesn't die when someone hits the back button - otherwise they would
             * accidentally leave the application and have to reload it.
             * 
             * The configuration for the router is done in the manifest.json file as that is some web
             * standard that should be adhered to for who knows why.
             */

            this.getRouter().initialize();
            this.files = [];
        },

        /**
         * Handy function that retrieves the current active view as navigated via the
         * router.  This is good in situations where we need to retrieve the current 
         * controller to use it as "this" but don't have the context.
         * 
         * @method      getActiveView
         * @memberof    resume.web.Component
         */
        getActiveView: function(fnCallback) {
            var sPattern = this.getRouter()._oRouter._prevRoutes[0].route._pattern;
            sPattern = sPattern.replace("/", "");
            var oViews = this._oTargets._mTargets[sPattern]._oViews._oViews;
            var aProperties = Object.getOwnPropertyNames(oViews);
            var aViews = [];
            for (var i = 0; i < aProperties.length; i++) {
                var sName = aProperties[i];
                aViews.push(oViews[sName]);
            }
            fnCallback(aViews[aViews.length - 1]);
        },

        /**
         * This function performs a get request to a specified URL
         * sending a data structure specified as a parameter.  Primarily
         * used by the application's internal routing via NodeJS
         * express http server.
         * 
         * @method     _get
         * @memberOf   resume.web.Component
         *
         * @param      {String}    sUrl       The url to get
         * @param      {Function}  fnSuccess  The function success
         * @param      {Function}  fnError    The function error
         */
        _get: function(sUrl, fnSuccess, fnError) {
            $.ajax({
                url: sUrl,
                success: fnSuccess,
                error: fnError
            });
        },

        /**
         * Performs a basic http POST command.
         * 
         * @method     _post
         * @memberof   resume.web.Component
         *
         * @param      {String}  sUrl       The URL to query (aka endpoint)
         * @param      {Object}  oData      Data to post to the URL
         * @param      {Function}  fnSuccess  The success callback
         * @param      {Function}  fnError    The error callback
         */
        _post: function(sUrl, oData, fnSuccess, fnError) {
            $.ajax({
                url: sUrl,
                type: "POST",
                data: oData,
                success: fnSuccess,
                error: fnError
            });
        },

        /**
         * @method     displayInvalid
         *
         * @param      {String}  sText   The text to display in the message box
         */
        displayInvalid: function(sText) {
            MessageBox.show(sText, {
                title: "Error"
            });
        },

        /**
         * @method     displayInvalid
         *
         * @param      {String}  sText   The text to display in the message box
         */
        displaySuccess: function(sText) {
            MessageBox.show(sText, {
                title: "Success"
            });
        }

    });

    return Component;
});