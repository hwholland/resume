jQuery.sap.require("sap.ui.core.util.MockServer");
jQuery.sap.require("sap.ui.comp.personalization.Controller");

sap.ui.controller("sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2.TreeTable", {

	onInit: function() {

		var oModel, oTable;
		var that = this;

		/**
		 * take attention for the content in rootUri -> this value has to be unique as otherwise the MockServer will crash IF more then one MockServer
		 * instances (from other tests) listen for the same rootUri! It can only listen one MockServer instance to one unique rootUri for HTTP
		 * requests. sap.log.warning('Filtering is currently not possible in the ODataTreeBinding'); };
		 */
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "tree2/"
		});

		// Create requests for different types of protocols
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/exampleForTreeTableWithOData2/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/exampleForTreeTableWithOData2/mockserver/");
		this.oMockServer.start();

		oModel = new sap.ui.model.odata.v2.ODataModel("tree2", true);
		this.getView().setModel(oModel);

		oTable = this.getView().byId("Example_For_TreeTable_with_OData");

		// get metadata file to create table columns automatically
		oModel.attachMetadataLoaded(function(oEvent) {
			var oDataServices = null, oSchema = null, aTableColumns = null;
			var oGLAccountHierarchyInChartOfAccountsList = null;

			if (oTable && this.getMetaModel && this.getMetaModel()) {
				oSchema = this.getMetaModel().oModel.oData.dataServices.schema[0];
				oGLAccountHierarchyInChartOfAccountsList = oSchema.entityType[1];
				aTableColumns = oGLAccountHierarchyInChartOfAccountsList.property;
				that.addColumns(oTable, aTableColumns);
			}
		});

		this.oP13nDialogController = new sap.ui.comp.personalization.Controller({
			table: oTable,
			resetToInitialTableState: true
		});

		this.oP13nDialogController.attachAfterP13nModelDataChange(this.fHandleAfterP13nModelDataChange, this);
	},

	addColumns: function(oTable, aColumns) {
		if (oTable && aColumns && aColumns.length > 0) {
			aColumns.forEach(function(oColumn, iIndex) {

				// Create new table column based on metadata (with binding)
				var sPath = oColumn.name;
				var sTextView = "{" + sPath + "}";
				var oTableNewColum = new sap.ui.table.Column({
					grouped: false,
					autoResizable: true,
					visible: false,
					showFilterMenuEntry: oColumn["sap:filterable"] === "true" ? true : false,
					template: new sap.ui.commons.TextView({
						text: sTextView,
						wrapping: false
					}),
					label: oColumn["sap:label"],
					sortProperty: oColumn["sap:sortable"] === "true" ? sPath : undefined,
					filterProperty: oColumn["sap:filterable"] === "true" ? sPath : undefined,
					leadingProperty: sPath
				}).data("p13nData", {
					columnKey: sPath,
					leadingProperty: sPath
				});

				// mark only hierarchy columns as visible (can be changed by the personalization dialog)
				if (oColumn["sap:hierarchy-level-for"] !== undefined || oColumn["sap:hierarchy-node-for"] !== undefined || oColumn["sap:hierarchy-parent-node-for"] !== undefined) {
					oTableNewColum.setVisible(true);
				}

				// add just created column to TreeTable
				if (oTableNewColum) {
					oTable.addColumn(oTableNewColum);
				}
			});

			// bind table
			oTable.bindRows({
				'path': '/GLAccountHierarchyInChartOfAccountsLiSet'
			});

			// Set table to get a refresh of new created columns
			this.oP13nDialogController.setTable(oTable);
		}
	},

	onExit: function() {
		this.oMockServer.stop();
	},

	onP13nDialogPress: function(oEvent) {
		this.oP13nDialogController.openDialog();
	},

	fHandleAfterP13nModelDataChange: function(oEvent) {
		var oTable = oEvent.oSource.getTable();
		var aColumns = oTable.getColumns();
		var oChangeData = oEvent.getParameter("changeData");
		var oBinding = oTable.getBinding("rows");

		this.fSetDirtyFlag(oTable, oEvent);

		if (oChangeData.filter && oChangeData.filter.filterItems) {
			var aFilters = [];
			oChangeData.filter.filterItems.forEach(function(oModelItem) {
				var oColumn = sap.ui.comp.personalization.Util.getColumn(oModelItem.columnKey, aColumns);
				var sPath = sap.ui.comp.personalization.Util.getColumnKey(oColumn);
				aFilters.push(new sap.ui.model.Filter(sPath, oModelItem.operation, oModelItem.value1, oModelItem.value2));
			}, this);
			oBinding.filter(aFilters);
		}
	},

	fSetDirtyFlag: function(oTable, oEvent) {
		var oChangeTypeVariant = oEvent.getParameter("changeTypeVariant");
		var oToolBarChild = null;

		var sText = "";
		if (oTable instanceof sap.ui.table.Table && oTable.getToolbar()) {
			oToolBarChild = oTable.getToolbar().getContent()[0];
			if (oToolBarChild) {
				sText = oToolBarChild.getText();
			}
		}
		var bTextDirty = (sText.indexOf("*") !== -1 && sText.indexOf("*") === (sText.length - 1));
		if (!bTextDirty && sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeVariant)) {
			var sTextDirty = sText + " *";
			if (oToolBarChild) {
				oToolBarChild.setText(sTextDirty);
			}
		} else if (bTextDirty && !sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeVariant)) {
			var sTextNotDirty = sText.substring(0, sText.length - 1);
			if (oToolBarChild) {
				oToolBarChild.setText(sTextNotDirty);
			}
		}
	}

});
