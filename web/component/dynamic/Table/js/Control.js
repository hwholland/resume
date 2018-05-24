sap.ui.define(["dynamic/Table/js/Base", "sap/m/Table", "sap/m/Column", "sap/m/OverflowToolbar", "sap/m/ColumnListItem", "sap/m/Text", "sap/m/Label"],
    function(Base, Table, Column, Toolbar, ColumnListItem, Text, Label) {
        "use strict";
        return Base.extend("bean.dynamic.Table.js.Control", {

            /**
             * User-interface class for generating a responsive table which gets
             * inserted into the page dynamically, and whose columns are updated
             * dynamically by a set of configurations provided by a JSON model
             *
             * @class      DynamicTable.js.Control
             * @subject    DynamicTable.js.Control
             * @augments   DynamicTable.js.Base
             * @param      {String}  sId     Unique ID generated by the
             *                               originating controller
             */
            constructor: function(sId) {
                this.sId = sId;
                this.table = new Table(sId, {
                    mode: "SingleSelectMaster",
                    inset: false,
                    alternateRowColors: false,
                    growing: true,
                    headerToolbar: new Toolbar()
                });
            },

            /**
             * Sets the configuration settings as a property in the model
             *
             * @method     setConfiguration
             * @memberof   DynamicTable.js.Control
             * @param      {Object}  oConfig  The configuration settings
             */
            setConfiguration: function(oConfig) {
                var oModel = this.getEmptyModel();
                oModel.setSizeLimit(250000);  
                oModel.setProperty("/columns", oConfig.columns);
                this.table.setModel(oModel);
                this.setDataset(oConfig);
                this.setColumns();
                this.setToolbar(oConfig);
            },

            /**
             * @method      setColumns
             * @memberof    DynamicTable.js.Control
             * @private
             */
            setColumns: function() {
                this.table.bindAggregation("columns", "/columns", function(sId, oContext) {
                    var oColumnName = oContext.getObject().oColumnName;
                    return new Column({
                        header: new Label({
                            text: oContext.getObject().header
                        }),
                        demandPopin: oContext.getObject().demandPopin,
                        popinDisplay: oContext.getObject().popinDisplay,
                        visible: oContext.getObject().visible,
                        hAlign: oContext.getObject().hAlign,
                        vAlign: oContext.getObject().vAlign,
                        width: oContext.getObject().width,
                        minScreenWidth: oContext.getObject().minScreenWidth,
                        mergeDuplicates: oContext.getObject().mergeDuplicates,
                        visible: oContext.getObject().visible
                    });
                });
            },

            /**
             * Loops through each of the controls in the configuration and adds them to the toolbar content  
             *
             * @method     setToolbar
             * @memberof   DynamicTable.js.Control
             * @public
             */
            setToolbar: function(oConfig) {
                var oToolbar = this.table.getHeaderToolbar();
                for (var i = 0; i < oConfig.toolbar.length; i++) {
                    oToolbar.addContent(oConfig.toolbar[i]);
                }
            },

            /**
             * Binds the table to a dataset which uses a ColumnListItem
             * as a template for each row in the table.  
             *
             * @method     setDataset
             * @memberof   DynamicTable.js.Control
             * @param      {Object}  oData    The dataset to bind to the table
             * @param      {Object}  oConfig  The configuration containing the column properties
             * @public
             */
            setDataset: function(oConfig) {
                //var oModel = this.table.getModel();
                //oModel.setProperty("/data", oData.data);
                var oColumnListItem = new ColumnListItem({
                    highlight: "{highlight}"
                });
                for (var i = 0; i < oConfig.columns.length; i++) {
                    oColumnListItem.addCell(oConfig.columns[i].template);
                    //  var oLabel = new Label().bindProperty("text", oConfig.columns[i].template);
                    //  
                }
                this.table.bindAggregation("items", {
                    path: "data>/data",
                    //sorter: new sap.ui.model.Sorter("CompanyID"),
                    template: oColumnListItem
                });
            },

            /**
             * Returns the user-interface control for the table object
             *
             * @method     getControl
             * @memberof   DynamicTable.js.Control
             * @return     {Object}  sap.m.Table
             * @public
             */
            getControl: function() {
                return (this.table);
            }

        })
    });