sap.ui.define(['sap/ui/core/UIComponent', 'sap/m/MessageBox', 'sap/ui/model/json/JSONModel'], function (UIComponent, MessageBox, JSONModel) {
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
     * @class       Web
     * @extends     sap.ui.core.UIComponent
     */
    var Component = UIComponent.extend("solo.web.Component", {

        /**
         * Based on UI5 api guidelines, setting a metadata object on the components
         * will instruct the browser to read the settings of the component from a
         * manifest.json file in the same location on the filesystem as the
         * Component.js.  The manifest file also contains a very important set thing:
         * models to load/pre-load (from outside data sources) and performance tuning
         * parameters - as the UI5 framework has an optional preload routine which (if
         * done properly) dramatically improves the overall application performance.
         *
         * The Component.preload.js file is actually the file that will get interpreted
         * by the browser, not this file.  Development occurs here, but then the gulpfile
         * gets run to generate the Component.preload.js file which contains a minified
         * codebase for all the JS and XML files that are rendered in the browser.  This
         * reduces application load times by compressing the total filesize of all web
         * content.
         *
         * @property   {Object} metadata settings and information about the application
         * @memberof   solo.web.Component
         */
        metadata: {
            manifest: "json"
        },

        init: function () {
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
            this.components = {};
            
            var pEventBus = new Promise((resolve, reject) => {
                resolve(this.getComponent("event", null, null, null, null));
            }).then(function(oEventBus) {
            });

        },

        hideBusyIndicator: function () {
            sap.ui.core.BusyIndicator.hide();
        },

        showBusyIndicator: function (iDuration, iDelay) {
            sap.ui.core.BusyIndicator.show(iDelay);

            if (iDuration && iDuration > 0) {
                if (this._sTimeoutId) {
                    jQuery.sap.clearDelayedCall(this._sTimeoutId);
                    this._sTimeoutId = null;
                }

                this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
                    this.hideBusyIndicator();
                });
            }
        },

        /**
         * Handy function that retrieves the current active view as navigated via the
         * router.  This is good in situations where we need to retrieve the current
         * controller to use it as "this" but don't have the context.
         *
         * @method      getActiveView
         * @memberof    solo.web.Component
         */
        getActiveView: function (fnCallback) {
            var sPattern = this.getRouter()._oRouter._prevRoutes[0].route._pattern;
            var aSplit = sPattern.split("/");
            if (aSplit.length > 0) {
                sPattern = aSplit[1];
                String.prototype.capitalize = function () {
                    return this.charAt(0).toUpperCase() + this.slice(1);
                }
                sPattern = sPattern.capitalize();
                var oViews = this._oTargets._mTargets[sPattern]._oViews._oViews;
                var aProperties = Object.getOwnPropertyNames(oViews);
                var aViews = [];
                for (var i = 0; i < aProperties.length; i++) {
                    var sName = aProperties[i];
                    aViews.push(oViews[sName]);
                }
                fnCallback(aViews[aViews.length - 1]);
            } else {
                return;
            }
        },

        /**
         * This function performs a get request to a specified URL
         * sending a data structure specified as a parameter.  Primarily
         * used by the application's internal routing via NodeJS
         * express http server.
         * 
         * @method     get
         * @memberOf   solo.web.Component
         *
         * @param      {String}    sUrl       The url to get
         * @param      {Function}  fnSuccess  The function success
         * @param      {Function}  fnError    The function error
         */
        get: function (sUrl, fnSuccess, fnError) {
            $.ajax({
                url: sUrl,
                success: fnSuccess,
                error: fnError
            });
        },

        /**
         * Performs a basic http POST command.
         * 
         * @method     post
         * @memberof   solo.web.Component
         *
         * @param      {String}  sUrl       The URL to query (aka endpoint)
         * @param      {Object}  oData      Data to post to the URL
         * @param      {Function}  fnSuccess  The success callback
         * @param      {Function}  fnError    The error callback
         */
        post: function (sUrl, oData, fnSuccess, fnError) {
            $.ajax({
                url: sUrl,
                type: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic cDIwMDAyODE0NzU6SW5pdHBhc3Mx",
                },
                data: JSON.stringify(oData),
                success: fnSuccess,
                error: fnError
            });
        },

        /**
         * @method     displayInvalid
         * @memberof   solo.web.Component
         * @param      {String}  sText   The text to display in the message box
         */
        displayInvalid: function (sText) {
            MessageBox.show(sText, {
                title: "Error"
            });
        },

        /**
         * @method     displayInvalid
         * @memberof   solo.web.Component
         * @param      {String}  sText   The text to display in the message box
         */
        getMessageBox: function (sTitle, sText) {
            MessageBox.show(sText, {
                title: sTitle
            });
        },

        /**
         * @brief      Returns URL hash value (e.g. http://localhost/#/someValue)
         * @method     getBrowserHash
         * @memberof   solo.web.Component
         * @return     URL hash value (e.g. http://localhost/#/someValue)
         */
        getBrowserHash: function () {
            var oHashChanger = new sap.ui.core.routing.HashChanger();
            var sHash = oHashChanger.getHash();
            var aHash = sHash.split("/");
            return (aHash);
        },

        /**
         * @brief   Returns instantiated component object
         * @details The application is organized by components that perform a 
         * specific set of related functions.  This method accepts a component
         * name (filesystem path), then retrieves the component from the filesystem
         * and returns a new instantiated object.
         * 
         * @method     getComponent
         * @memberof   solo.web.Component
         * 
         * @example
         *  // Function to instantiate a component before opening a dialog, by dynamically
         *  // ...reading the component name and settings from the eventing control
         *  onBeforeOpenDialog: function (oEvent) {
         *      var oSource = oEvent.getSource();
         *      var sComponent = this.getOwnerComponent().getFieldGroupId(oSource, "component");
         *      var sMethod = this.getOwnerComponent().getFieldGroupId(oSource, "method");
         *      var sSubject = this.getOwnerComponent().getFieldGroupId(oSource, "subject");
         *      var sClass = this.getOwnerComponent().getFieldGroupId(oSource, "class");
         *      var that = this;
         *      var pComponent = new Promise((resolve, reject) => {
         *          resolve(that.getOwnerComponent().getComponent(sComponent, sMethod, sSubject, sClass, that.getView()));
         *      }).then(function (oComponent) {
         *          var oControl = oComponent.getControl(sMethod, sSubject, sClass, that.getView());
         *          oSource.addContent(oControl);
         *      });
         *  }
         * 
         * @param   sComponent  The component name/path
         * @param   sMethod     The action name (solo actions)
         * @param   sSubject    The subject name (solo parts)
         * @param   sClass      The sub-category of the subject
         * @param   oView       The calling view, for adding dependents
         * 
         * @return  Instantiated component as a JavaScript object
         */
        getComponent: function (sComponent, sMethod, sSubject, sClass, oView) {
            this.activeView = oView;

            function getInstance() {
                return (new Promise((resolve, reject) => {
                    resolve(sap.ui.component({
                        name: "solo.web.component." + sComponent,
                        manifest: true,
                        componentData: {
                            method: sMethod,
                            subject: sSubject,
                            class: sClass,
                            view: oView
                        }
                    }));
                }));
            }
            return (new Promise((resolve, reject) => {
                if (this.components[sComponent]) {
                    resolve(this.components[sComponent]);
                } else {
                    this.components[sComponent] = getInstance();
                    resolve(this.components[sComponent]);
                }
            }));
        },

        /**
         * @brief [brief description]
         * @details [long description]
         */
        getEmptyModel() {
            return (new JSONModel());
        },

        /**
         * @brief [brief description]
         * @details [long description]
         * 
         * @param  [description]
         * @return [description]
         */
        onOpenDialog: function (oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = sap.ui.xmlfragment("solo.web.fragment.Dialog", this);
            var oFieldGroupIds = oSource.getFieldGroupIds();
            oDialog.setFieldGroupIds(oFieldGroupIds);
            this.view.addDependent(oDialog);
            oDialog.open();
        },

        /**
         * Retrieves information from the fieldGroupIds of the eventing control, and uses
         * that information to instantiate a new component (or new control using existing component).
         *
         * @method onBeforeOpenDialog
         * @memberOf solo.web.Component
         *
         * @param  {Object}     oEvent [description]
         */
        onBeforeOpenDialog: function (oEvent) {
            var oSource = oEvent.getSource();
            var sComponent = this.getFieldGroupId(oSource, "component");
            var sMethod = this.getFieldGroupId(oSource, "method");
            var sSubject = this.getFieldGroupId(oSource, "subject");
            var sClass = this.getFieldGroupId(oSource, "class");
            var that = this;
            var oEventBus = sap.ui.getCore().getEventBus();
            var oData = {
                method: sMethod,
                subject: sSubject,
                class: sClass
            };
            oEventBus.publish("Dialog", "Open", oData);
            var pComponent = new Promise((resolve, reject) => {
                resolve(that.getComponent(sComponent, sMethod, sSubject, sClass, that.view));
            }).then(function (oComponent) {
                var oControl = oComponent.getControl(sMethod, sSubject, sClass, that.view);
                oSource.addContent(oControl);
            });
        },

        /**
         * @brief Retrieves a value from fieldGroupIds by key
         * @details A special convention has been defined for use in fieldGroupIds which enables dynamic
         * information to be passed between components and controls.  This function parses the fieldGroupIds
         * looking for a given key in the format defined
         *
         * @method      getFieldGroupId
         * @memberof    solo.web.Component
         *
         * @param  {Object} oControl The control which contains the fieldGroupIds
         * @param  {String} sProperty The particular key to retrieve
         *
         * @return The value associated with the given key
         */
        getFieldGroupId: function (oControl, sProperty) {
            var oFieldGroupIds = oControl.getFieldGroupIds();
            for (var i = 0; i < oFieldGroupIds.length; i++) {
                if (oFieldGroupIds[i].indexOf(sProperty) > -1) {
                    var aSplit = oFieldGroupIds[i].split("=");
                    return (aSplit[1]);
                }
            }
        },

        /**
         * @brief Handles the close event for a dialog
         * @details Handles the close event by checking for a number of conditions, such
         * as whether to reset a model.
         * 
         * @method      onPressCloseButton
         * @memberof    solo.web.Component
         *
         * @param {Object} oEvent The event object / parameters
         */
        onPressCloseButton: function (oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = oSource.getParent();
            /*
            var oParent = oSource.getParent();
            var oConstructor = oParent.getMetadata().getName();
            while(oConstructor !== "sap.ui.core.mvc.JSONView") {
                oParent = oParent.getParent();
                var oConstructor = oParent.getMetadata().getName();
            }
            console.log("post-while");
            console.log(oParent);
            */
            if (oDialog.getContent()[0].getMetadata().getName() === "sap.ui.layout.form.SimpleForm") {
                oDialog.getContent()[0]._oComponent.resetDataModel();
            }
            oDialog.close();
        },

        onPressSubmitButton: function (oEvent) {
            var oSource = oEvent.getSource();
            var oParent = oSource.getParent();
            var sSubmit = this.getFieldGroupId(oParent, "submit");
            if (sSubmit === "create") {
                var oActiveModel = sap.ui.getCore().getModel("models");
                var oActiveData = oActiveModel.getData();
                var sModel = oActiveData.activeModel;
                var oModel = this.activeView.getModel(sModel);
                var oData = oModel.getData();
                this.oComponentData.method = "record";
                this.onSubmit(this.oComponentData.method, this.oComponentData.subject, this.oComponentData.class, oData);
            }
            if (oParent.getContent()[0].getMetadata().getName() === "sap.ui.layout.form.SimpleForm") {
                oParent.getContent()[0]._oComponent.resetDataModel();
            }
            oParent.close();
            this.showBusyIndicator(null, 0);
        },

        onSubmit: function (sMethod, sSubject, sClass, oData) {
            var that = this;
            this.post("/db/record", {
                config: {
                    method: sMethod,
                    subject: sSubject,
                    class: sClass
                },
                data: oData
            }, function (response) {
                that.hideBusyIndicator();
                that.getMessageBox("Success", "Record saved in database.");
            }, function (response) {
                that.hideBusyIndicator();
                that.getMessageBox("Error", response);
            });
        }
    });

    return Component;
});