/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	'use strict';
	var oSelectedRepresentation, oViewSettingDialog;
	/**
	* @description sorts the data in the table representation
	*/
	function _sortAndUpdateTableData(oSortOption) {
		var sorter = [];
		sorter.push(new sap.ui.model.Sorter(oSortOption.property, oSortOption.descending));
		oSelectedRepresentation.oTableRepresentation.getBinding("items").sort(sorter); // sort the data in the table 
	}
	/**
	* @description sorts the data in the main table representation after new data is appended after pagination. 
	* Only new data is fetched from backend hence the sorting needs to be consistent.
	*/
	function _sortVisibleDataInTable(aDataResponse, oSortOption) {
		var aSortedData = aDataResponse.sort(function(previousDataRow, currentDataRow) {
			return oSortOption.descending ? currentDataRow[oSortOption.property] - previousDataRow[oSortOption.property] : previousDataRow[oSortOption.property] - currentDataRow[oSortOption.property];
		});
		return aSortedData;
	}
	/**
	* @description sorts the data in the main table representation
	*/
	function _sortTableRepresentationData(oSortOption, callbackForBusyIndicator) {
		oSelectedRepresentation.oApi.updatePath(function(oStep, bStepChanged) { // if it is table representation
			if (oStep === oSelectedRepresentation.oApi.getActiveStep()) {
				var aSortedData = _sortVisibleDataInTable(oSelectedRepresentation.aDataResponse, oSortOption); // Sorting after pagination
				oSelectedRepresentation.oTableRepresentation.getModel().setData({ // update the data in the table with the sorted data
					tableData : aSortedData
				});
				callbackForBusyIndicator();
			}
		});
	}
	/**
		* Creates the sort option for the representation.      
		* @description sets the selected sort item on the view setting dialog. Selects the first property in case the default property has to be selected
		*/
	function _selectSortItemOnViewSettingDialog(oController) {
		var oSelectedSortItem = {};
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		var isDescending = oViewSettingDialog.getSortDescending();
		if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length) { // if the orderby is configured, select the option in the view setting dialog
			oSelectedSortItem = {
				property : oSelectedRepresentation.orderby[0].property
			};
			isDescending = !oSelectedRepresentation.orderby[0].ascending;
			oViewSettingDialog.setSelectedSortItem(oSelectedSortItem.property);
		}
		if (oSelectedSortItem === null) { // if the sort property for table is not changed from view setting dialog. Default sort property 
			oSelectedSortItem = oViewSettingDialog.getSortItems()[0];
			isDescending = false;
		}
		oViewSettingDialog.setSelectedSortItem(oSelectedSortItem);
		oViewSettingDialog.setSortDescending(isDescending);
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.viewSetting", {
		/**
		* @method onInit - lifecycle event 
		* @description reads the selected representation and alternate representation (if any) from the view data.
		* Also sets the sort property and sort order on the view setting dialog
		*/
		onInit : function() {
			var oController = this;
			oViewSettingDialog = oController.getView().getContent()[0];
			oSelectedRepresentation = oController.getView().getViewData();
			_selectSortItemOnViewSettingDialog(oController); //select the first sort item in case orderby is not available
		},
		/**
		* @method handleConfirmForSort
		* @description handler for the sort property change on press of ok in view setting dialog.
		* Reads the sort property from the event and sorts the data in the table as well as in alternate representation
		* Also sets the sort property on the selected representation
		*/
		handleConfirmForSort : function(oEvent) {
			oSelectedRepresentation.oTableRepresentation.getParent().getParent().setBusy(true); // set the table to busy
			var oSortOption = {
				property : oEvent.getParameters().sortItem.getKey(), // read the sort property and sort order
				descending : oEvent.getParameters().sortDescending
			};
			if (oEvent.getParameters().sortItem) { // if there is sort item , table should be updated with the sorted data
				if (oSelectedRepresentation.oParameter.isAlternateRepresentation) { // if it is alternate table
					_sortAndUpdateTableData(oSortOption);
					oSelectedRepresentation.oTableRepresentation.getParent().getParent().setBusy(false); // set the table to busy
				} else {
					_sortTableRepresentationData(oSortOption, function() {
						oSelectedRepresentation.oTableRepresentation.getParent().getParent().setBusy(false); // set the table to busy
					});
				}
			}
		}
	});
}());