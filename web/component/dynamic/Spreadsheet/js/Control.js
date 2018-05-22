sap.ui.define(["dynamic/Spreadsheet/js/Base", "sap/ui/table/Table", "sap/ui/table/RowAction", "sap/ui/table/RowActionItem", "sap/ui/table/Column", "sap/m/Toolbar"],
    function(Base, Table, RowAction, RowActionItem, Column, Toolbar) {
        "use strict";
        return Base.extend("dynamic.Spreadsheet.js.Control", {

            /**
             * User-interface class for generating the table which gets inserted into 
             * the page dynamically, and whose columns are updated dynamically by a set
             * of configurations provided by a JSON model
             * 
             * @class      tables.web.js.Table
             * @augments   tables.web.js.Base
             * @param      {string}  sAction  The type of action currently being recorded
             * @param      {object}  oConfig  The data model containing the config
             * @param      {object}  oCtl     The controller which called this class
             */
            constructor: function(sId) {
                this.sId = sId;
                this.table = new Table(sId, {
                    toolbar: new Toolbar(),
                    visibleRowCountMode: "Auto"
                }).addStyleClass("sapUiSizeCozy");
            },

            setConfiguration: function(oConfig) {
                var oModel = this.getEmptyModel();
                oModel.setSizeLimit(250000);  
                oModel.setProperty("/columns", oConfig.columns);
                this.table.setModel(oModel);
                this.config = oConfig;
                // Run configuration routine to build UI table object
                this.configureRowActions();
                this.setDataset(oConfig);
                this.configureColumns();
                this.setToolbar(oConfig);
            },

            /**
             * Loops through each of the controls in the configuration and adds them to the toolbar content  
             *
             * @method     setToolbar
             * @memberof   DynamicTable.js.Control
             * @public
             */
            setToolbar: function(oConfig) {
                var oToolbar = this.table.getToolbar();
                for (var i = 0; i < oConfig.toolbar.length; i++) {
                    oToolbar.addContent(oConfig.toolbar[i]);
                }
            },

            /**
             * @method      configureRowActions
             * @memberof    tables.web.js.Table
             * @private
             */
            configureRowActions: function() {
                var oData = this.config.rowActionItems;
                if(oData) {
                var oRowAction = new RowAction();
                    for (var i = 0; i < oData.length; i++) {
                        var oRowActionItem = new RowActionItem(oData[i]);
                        oRowAction.addItem(oRowActionItem);
                    }
                    this.table.setRowActionTemplate(oRowAction);
                    this.table.setRowActionCount(1);    
                }
            },

            /**
             * @method      configureColumns
             * @memberof    tables.web.js.Table
             * @private
             */
            configureColumns: function() {
                this.table.bindColumns("/columns", function(sId, oContext) {
                    var oColumnName = oContext.getObject().oColumnName;
                    return new Column({
                        label: oContext.getObject().label,
                        template: oContext.getObject().template,
                        visible: oContext.getObject().visible,
                        sortProperty: oContext.getObject().sortProperty,
                        filterProperty: oContext.getObject().filterProperty,
                        width: oContext.getObject().width
                    });
                });
            },

            /**
             * @method      configureData
             * @memberof    tables.web.js.Table
             * @private
             */
            setDataset: function(oConfig) {
                this.table.bindAggregation("rows", {
                    path: "data>/data"
                });
            },


            /**
             * @method      getTable
             * @memberof    tables.web.js.Table
             * @public
             */
            getControl: function() {
                return this.table;
            }
        })
    });