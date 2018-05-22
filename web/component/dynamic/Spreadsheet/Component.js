sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/model/json/JSONModel', 'dynamic/Spreadsheet/js/Control', 'solo/web/Component'], 
    function (UIComponent, JSONModel, Control, UICore) {
    "use strict";

    /**
     * Generates responsive Spreadsheets from the OpenUI5 framework (sap.m.Spreadsheet) dynamically
     * by reading properties from a data structure that resides in a JSON file.
     * 
     * @class       DynamicSpreadsheet
     * @subject     DynamicSpreadsheet
     * @extends     sap.ui.core.UIComponent
     */
    var Component = UICore.extend("dynamic.Spreadsheet", {

        /**
         * @property   {Object} metadata settings and information about the application
         * @memberof   DynamicSpreadsheet
         */
        metadata: {
            manifest: "json"
        },

        init: function () {
            var that = this;
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
            var sMethod = this.getComponentData().method;
            var sSubject = this.getComponentData().subject;
            var sClass = this.getComponentData().class;
            this.view = this.getComponentData().view;
            this.spreadsheets = {};
            var oSpreadsheet = this.getSpreadsheet(sMethod, sSubject, sClass);
            console.log(this);
            this.components = {};
        },

        /**
         * @brief   Initiates the sequence of events which configures and returns
         * a user-interface control of a responsive Spreadsheet.
         * 
         * @method      getSpreadsheet
         * @memberof    DynamicSpreadsheet
         * @example
         * // Function to instantiate a new responsive Spreadsheet control
         * getControl: function (sMethod, sSubject, sClass, oView) {
         *     this.view = oView;
         *     var oSpreadsheet = this.getSpreadsheet(sMethod, sSubject, sClass);
         *     return (oSpreadsheet.getControl());
         * }
         * 
         * @param {String} sMethod The method property of the data model
         * @param {String} sSubject The subject property of the data model
         * @param {String} sClass The classification property of the data model
         * @return Executes a function to configure the Spreadsheet
         */
        getSpreadsheet: function (sMethod, sSubject, sClass) {
            var sId = sMethod + "--" + sSubject + "--" + sClass;
            if (this.spreadsheets[sMethod]) {
                if (this.spreadsheets[sMethod][sSubject]) {
                    if (this.spreadsheets[sMethod][sSubject][sClass]) {
                        return (this.spreadsheets[sMethod][sSubject][sClass]);
                    }
                    else {
                        return (this.runSetup(sId, sMethod, sSubject, sClass));
                    }
                }
                else {
                    this.spreadsheets[sMethod][sSubject] = {};
                    return (this.runSetup(sId, sMethod, sSubject, sClass));
                }
            }
            else {
                this.spreadsheets[sMethod] = {};
                this.spreadsheets[sMethod][sSubject] = {};
                return (this.runSetup(sId, sMethod, sSubject, sClass));
            }
        },

        /**
         * @brief Executes each of the configuration steps required to build a new instance
         * of the control object.
         * 
         * @method      runSetup
         * @memberof    DynamicSpreadsheet
         * 
         * @param {String} sId       The control ID for the DOM object tree
         * @param {String} sMethod   The name of the method
         * @param {String} sSubject  The name of the subject
         * @param {String} sClass    The name of the class
         * 
         * @return      Instance of the Control class
         */
        runSetup: function (sId, sMethod, sSubject, sClass) {
            var oSpreadsheet = new Control(this.createId(sId));
            var oConfig = this.getConfiguration(sMethod, sSubject, sClass);
            this.getFragments(oConfig);
            this.setConfiguration(oSpreadsheet, oConfig);
            this.spreadsheets[sMethod][sSubject][sClass] = oSpreadsheet;
            return (this.spreadsheets[sMethod][sSubject][sClass]);
        },

        /**
         * @brief Retrieves the node of the data structure containing the settings for 
         * the specific instance of the Spreadsheet.
         * 
         * @method      getConfiguration
         * @memberof    DynamicSpreadsheet
         * 
         * @param {String} sMethod   The name of the method
         * @param {String} sSubject  The name of the subject
         * @param {String} sClass    The name of the class
         * 
         * @return  Settings for the Spreadsheet configuration from the data model
         */
        getConfiguration: function (sMethod, sSubject, sClass) {
            return (this.getModel("config").getProperty("/" + sMethod + "/" + sSubject + "/" + sClass));
        },

        /**
         * @brief   Returns the entire data structure with all configuration options
         *          
         * @memberof    DynamicSpreadsheet
         * 
         * @return  Model containing all methods, subjects, and classes
         */
        getConfigModel: function () {
            return (this.getModel("config"));
        },

        /**
         * @brief   Retrieves a model with sample data
         * 
         * @method      getDataModel
         * @memberof    DynamicSpreadsheet
         * 
         * @return  Model containing sample data
         */
        getDataModel: function() {
            return (this.getModel("data"));
        },

        /**
         * @brief Instantiates a new control (from an XML fragment) for 
         * each of the columns in the Spreadsheet instance.
         * 
         * @method      getFragments
         * @memberof    DynamicSpreadsheet
         * 
         * @param {Object} oConfig  Configuration for the Spreadsheet instance (method + subject + class)
         */
        getFragments: function (oConfig) {
            for (var i = 0; i < oConfig.columns.length; i++) {
                var oTemplate = oConfig.columns[i].template;

                var oFragment = sap.ui.xmlfragment("dynamic.Spreadsheet.fragment." + oTemplate.fragment, this);
                var aProperties = Object.getOwnPropertyNames(oTemplate.binding);
                for(var j = 0; j < aProperties.length; j++) {
                    var sProperty = aProperties[j];
                    oFragment.bindProperty(sProperty, oTemplate.binding[sProperty]);
                }
                if(this.view) {
                    this.view.addDependent(oFragment);    
                }
                oConfig.columns[i].template = oFragment;
            }
            for (var x = 0; x < oConfig.toolbar.length; x++) {
                var oTemplate = oConfig.toolbar[x];
                var oFragment = sap.ui.xmlfragment("dynamic.Spreadsheet.fragment." + oTemplate.fragment, this);
                if(oTemplate.properties) {
                    var aProperties = Object.getOwnPropertyNames(oTemplate.properties);
                    for(var j = 0; j < aProperties.length; j++) {
                        var sProperty = aProperties[j];
                        oFragment.setProperty(sProperty, oTemplate.properties[sProperty]);
                    }    
                }
                if(this.view) {
                    this.view.addDependent(oFragment);    
                }
                oConfig.toolbar[x] = oFragment;
            }
        },

        /**
         * @brief   Sets the configuration options for the Spreadsheet
         * 
         * @method      setConfiguration
         * @memberof    DynamicSpreadsheet
         * 
         * @param {Object} oSpreadsheet The instantiated Spreadsheet object
         * @param {Object} oConfig The configuration for the Spreadsheet instance
         */
        setConfiguration(oSpreadsheet, oConfig) {
            oSpreadsheet.setConfiguration(oConfig);
        },

        /**
         * @brief   Gets a new responsive Spreadsheet control
         * 
         * @method      getControl
         * @memberof    DynamicSpreadsheet
         * 
         * @example
         * onBeforeOpenDialog: function (oEvent) {
         *     var oSource = oEvent.getSource();
         *     var sComponent = this.getOwnerComponent().getFieldGroupId(oSource, "component");
         *     var sMethod = this.getOwnerComponent().getFieldGroupId(oSource, "method");
         *     var sSubject = this.getOwnerComponent().getFieldGroupId(oSource, "subject");
         *     var sClass = this.getOwnerComponent().getFieldGroupId(oSource, "class");
         *     var that = this;
         *     
         *     var pComponent = new Promise((resolve, reject) => {
         *         resolve(that.getOwnerComponent().getComponent(sComponent, sMethod, sSubject, sClass, that.getView()));
         *     }).then(function (oComponent) {
         *         var oControl = oComponent.getControl(sMethod, sSubject, sClass, that.getView());
         *         oSource.addContent(oControl);
         *     });
         * }
         * 
         * @param {String} sMethod   The name of the method
         * @param {String} sSubject  The name of the subject
         * @param {String} sClass    The name of the class
         * @param {Object} oView     The view object requesting the control
         * 
         * @return  Instantiated user-interface control
         */
        getControl: function (sMethod, sSubject, sClass, oView) {
            this.view = oView;
            var oSpreadsheet = this.getSpreadsheet(sMethod, sSubject, sClass);
            return (oSpreadsheet.getControl());
        },
/*
        onOpenDialog: function (oEvent) {
            var oSource = oEvent.getSource();
            var oDialog = sap.ui.xmlfragment("dynamic.Spreadsheet.fragment.Dialog", this);
            var oFieldGroupIds = oDialog.getFieldGroupIds();
            oDialog.setFieldGroupIds(oFieldGroupIds);
            this.view.addDependent(oDialog);
            oDialog.open();
        }
*/
    });

    return Component;
});