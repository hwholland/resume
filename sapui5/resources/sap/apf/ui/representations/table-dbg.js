/* SAP APF Analysis Path Framework
* 
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.require("sap.apf.ui.representations.utils.paginationHandler");
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
(function() {
	'use strict';
	var oTableWithoutHeaders;
	//select the items in the table which are passed as parameter
	function _selectItemsInTable(aSelectedItems) {
		oTableWithoutHeaders.removeSelections();// remove all the selections , so that older values are not retained
		aSelectedItems.forEach(function(item) {
			oTableWithoutHeaders.setSelectedItem(item);
		});
	}
	//clear the filters from the UI5Charthelper and also from APF filters
	function _clearFilters(oTableInstance) {
		oTableInstance.UI5ChartHelper.filterValues = [];
		oTableInstance.setFilter(oTableInstance.oApi.createFilter());
	}
	//creates the filter values from the filters
	function _getFilterTermsFromTableSelection(oTableInstance, sRequiredFilterProperty) {
		var aFilterTerms = oTableInstance.getFilter().getInternalFilter().getFilterTermsForProperty(sRequiredFilterProperty); //read the filter terms
		var aFilterValues = aFilterTerms.map(function(term) {
			return term.getValue();
		});
		return aFilterValues;
	}
	//toggles the selection based on the event.
	function _getToggledSelection(sRequiredFilter, aCurrentSelectedItem, aFilterValues) {
		var newAddedFilters = [];
		var sCurrentRequiredFilter = aCurrentSelectedItem[0].getBindingContext().getProperty(sRequiredFilter);//required filter from current selected item
		if (aCurrentSelectedItem[0].isSelected()) {
			newAddedFilters.push(sCurrentRequiredFilter); // if new item is selected, add it to the new added filter array
		} else {
			var indexOfToggledItem = aFilterValues.indexOf(sCurrentRequiredFilter);
			if (indexOfToggledItem !== -1) { // if item is deselected, find the index of item and remove it from array
				aFilterValues.splice(indexOfToggledItem, 1);
			}
		}
		return newAddedFilters;
	}
	//update the filter 
	function _updateFilters(oTableInstance, isSelectionChanged, aFilterValues) {
		if (isSelectionChanged) { // if the selection has changed and selectionChanged event has to be triggered
			_clearFilters(oTableInstance); // clear the filters first, so that older values are not retained on the UI5ChartHelper filetr values
			oTableInstance.filter = oTableInstance.UI5ChartHelper.getFilterFromSelection(aFilterValues);
			oTableInstance.oApi.getActiveStep().getSelectedRepresentation().UI5ChartHelper.filterValues = oTableInstance.UI5ChartHelper.filterValues; // assign the filter values from table to the selected representation 
			oTableInstance.oApi.selectionChanged(); // trigger the selection change event
		} else {
			isSelectionChanged = true;// make the boolean true, so that the selectionChanges API is triggered
		}
	}
	//get all the selected items in the table based on the required filter
	function _getAllSelectionInTable(oAllItemsInTable, sRequiredFilterProperty, aFilterValues) {
		var aAllSelectionInTable = oAllItemsInTable.filter(function(item) { // selection in table which are based on the result filter values
			var reqFilterValue = item.getBindingContext().getProperty(sRequiredFilterProperty);
			return aFilterValues.indexOf(reqFilterValue) !== -1;
		});
		return aAllSelectionInTable;
	}
	//read the filters and select the rows in table. Also read the selected items where selection is enabled, creates the filters from selections
	function _drawSelection(oEvent) {
		var aFilterValues = [], sRequiredFilterProperty;
		var aRequiredFilter = this.oParameter.requiredFilters;
		sRequiredFilterProperty = aRequiredFilter && (aRequiredFilter.length > 0) ? aRequiredFilter[0] : undefined; //read the required filter from the internal filter or the required filters (when table is created, the internal filter wont be available)  
		var aCurrentSelectedItem = oEvent.getParameters("listItems").listItems; // store the current selected item for which selection event is triggered
		if (this.UI5ChartHelper) { // if the UI5ChartHelper is available , then only filters would be present
			aFilterValues = sRequiredFilterProperty ? _getFilterTermsFromTableSelection(this, sRequiredFilterProperty) : []; // if there are filters then get the filters or it will be an empty array
		}
		//enable the selection mode in the table based on the required filter availability
		var selectionMode = aRequiredFilter && (aRequiredFilter.length > 0) ? "MultiSelect" : "None";
		oTableWithoutHeaders.setMode(selectionMode);
		if (oEvent.getId() === "selectionChange") { //if the explicit selection is made on the table, selectionChanged event is triggered
			var isSelectionChanged = true;// boolean to indicate if the selection changed API is triggered just once 
			//toggle the selection in table
			var newAddedFilters = _getToggledSelection(sRequiredFilterProperty, aCurrentSelectedItem, aFilterValues);
			aFilterValues = aFilterValues.concat(newAddedFilters.filter(function(item) { // merge the unique filters into an array
				return aFilterValues.indexOf(item) < 0;
			}));
			_updateFilters(this, isSelectionChanged, aFilterValues);
		}
		var oAllItemsInTable = oEvent.getSource().getItems();
		var aAllSelectionInTable = _getAllSelectionInTable(oAllItemsInTable, sRequiredFilterProperty, aFilterValues);//read the filter directly in case of updateFinished event
		_selectItemsInTable(aAllSelectionInTable);
	}
	//reads the filters and selects the rows in print of table
	function _drawSelectionForPrint(oTableInstance, oPrintTable) {
		var aRequiredFilter = oTableInstance.oParameter.requiredFilters;
		var sRequiredFilterProperty = aRequiredFilter && (aRequiredFilter.length > 0) ? aRequiredFilter[0] : undefined; //read the required filter from the internal filter or the required filters (when table is created, the internal filter wont be available)  
		var aFilterValues = _getFilterTermsFromTableSelection(oTableInstance, sRequiredFilterProperty);
		var aSelectedListItems = oPrintTable.getItems().filter(function(item) {
			var reqFilterValue = item.getBindingContext().getProperty(sRequiredFilterProperty);
			return aFilterValues.indexOf(reqFilterValue) !== -1;
		});
		var selectionMode = aRequiredFilter && (aRequiredFilter.length > 0) ? "MultiSelect" : "None";
		oPrintTable.setMode(selectionMode);
		return aSelectedListItems;
	}
	//creates the table and binds the columns to it. Also formats the cell value based on the metadata
	function _createTableAndBindColumns(tableColumns, oTableInstance, isPrintForTable) {
		var oFormatter = new sap.apf.ui.utils.formatter({ // formatter for the value formatting
			getEventCallback : oTableInstance.oApi.getEventCallback.bind(oTableInstance.oApi),
			getTextNotHtmlEncoded : oTableInstance.oApi.getTextNotHtmlEncoded
		}, oTableInstance.metadata, oTableInstance.aDataResponse);
		var formatCellValue = function(index) {
			return function(columnValue) {
				if (oTableInstance.metadata !== undefined) {
					var formatedColumnValue;
					if (tableColumns.value[index] && columnValue) {
						formatedColumnValue = oFormatter.getFormattedValue(tableColumns.value[index], columnValue);
						if (formatedColumnValue !== undefined) {
							return formatedColumnValue;
						}
					}
				}
				return columnValue;
			};
		};
		var columnCells = [];
		for(var indexForColumn = 0; indexForColumn < tableColumns.name.length; indexForColumn++) {
			var tableCellValues = new sap.m.Text().bindText(tableColumns.value[indexForColumn], formatCellValue(indexForColumn), sap.ui.model.BindingMode.OneWay);
			columnCells.push(tableCellValues);
		}
		var columnForPrintTable = [], columnForDataTable = [];
		for(var indexTableColumn = 0; indexTableColumn < tableColumns.name.length; indexTableColumn++) {
			var oColumnForPrint = new sap.m.Column({
				header : new sap.m.Text({
					text : tableColumns.name[indexTableColumn]
				})
			});
			columnForPrintTable.push(oColumnForPrint);
			var oColumnForDataTable = new sap.m.Column();
			var customDataForColumnText = new sap.ui.core.CustomData({
				value : {
					text : tableColumns.name[indexTableColumn],
					key : tableColumns.value[indexTableColumn]
				}
			});
			oColumnForDataTable.addCustomData(customDataForColumnText);
			columnForDataTable.push(oColumnForDataTable);
		}
		var oModelForTable = new sap.ui.model.json.JSONModel();
		oModelForTable.setSizeLimit(10000);
		var aTableData = oTableInstance.getData();
		oModelForTable.setData({
			tableData : aTableData
		});
		var oTable = new sap.m.Table({
			items : {
				path : "/tableData",
				template : new sap.m.ColumnListItem({
					cells : columnCells
				})
			}
		});
		var aColumns;
		aColumns = columnForDataTable;
		if (isPrintForTable) {
			aColumns = columnForPrintTable;
		}
		aColumns.forEach(function(column) {
			oTable.addColumn(column);
		});
		oTable.setModel(oModelForTable);
		if (oTableInstance.metadata !== undefined) {// aligning amount fields
			for(var fieldIndex = 0; fieldIndex < tableColumns.name.length; fieldIndex++) {
				var oMetadata = oTableInstance.metadata.getPropertyMetadata(tableColumns.value[fieldIndex]);
				if (oMetadata.unit) {
					var amountCol = oTable.getColumns()[fieldIndex];
					amountCol.setHAlign(sap.ui.core.TextAlign.Right);
				}
			}
		}
		return oTable;
	}
	/**
	* @private
	* @method _addStyleToTableForPagination  
	* @param oContainer - the container which has the table on which pagination has to be triggered
	* @description calculates the height of the scroll in the scroll container where table is contained 
	* so that pagination could be triggered based on the height of the scroll.
	*/
	function _addStyleToTable(oContainer) {
		var scrollContainerHeight, offsetTop;
		jQuery(".scrollContainer > div:first-child").css({// For IE-Full width for alternate representation
			"display" : "table",
			"width" : "inherit"
		});
		if (offsetTop === undefined) {
			offsetTop = jQuery(".tableWithoutHeaders").offset().top;
		}
		if (jQuery(".tableWithoutHeaders").offset().top !== offsetTop) {// fullscreen
			scrollContainerHeight = ((window.innerHeight - jQuery('.tableWithoutHeaders').offset().top)) + "px";
		} else {
			scrollContainerHeight = ((window.innerHeight - jQuery('.tableWithoutHeaders').offset().top) - (jQuery(".applicationFooter").height()) - 20) + "px";
		}
		document.querySelector('.tableWithoutHeaders').style.cssText += "height : " + scrollContainerHeight;
		sap.ui.Device.orientation.attachHandler(function() {// for height issue on orientation change
			oContainer.rerender();
		});
	}
	function _sortTableData(oSortOption, oRepInstance) {
		var sorter = [];
		sorter.push(new sap.ui.model.Sorter(oSortOption.property, oSortOption.descending));
		oRepInstance.oTableRepresentation.getBinding("items").sort(sorter); // sort the data in the table 
		oRepInstance.oTableRepresentation.getParent().getParent().setBusy(false); // remove the busy indicator
	}
	function _getAvailableFilterInTableData(oTableInstance) {
		var aSelectionFromUI5 = [];
		var aTableData = oTableInstance.getData();
		var aTotalDataWithRequiredFilter = aTableData.map(function(tableRow) {
			return tableRow[oTableInstance.oParameter.requiredFilters[0]];
		});
		oTableInstance.UI5ChartHelper.filterValues.forEach(function(selection) {
			if (aTotalDataWithRequiredFilter.indexOf(selection[0]) !== -1) {
				aSelectionFromUI5.push(selection[0]);
			}
		});
		return aSelectionFromUI5;
	}
	/**
	* @description creates the column structure for the table which has the name and value. Also appends the unit of the column in the header of the table.
	* returns oColumnData - oColumnData has name and value of each column which has to be formed in the table.
	*                 e.g. oColumnData = {
	*                                      name : ["column1","column2"],
	*                                      value :["value1","value2"] 
	*                                     }
	*/
	function _getColumnFromProperties(oTableInstance) {
		var aTableData = oTableInstance.getData();
		var aProperties = [];
		var oColumnData = {
			name : [],
			value : []
		};
		aProperties = oTableInstance.oParameter.dimensions.concat(oTableInstance.oParameter.measures).length ? oTableInstance.oParameter.dimensions.concat(oTableInstance.oParameter.measures) : oTableInstance.parameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		if (aTableData.length !== 0) {
			for(var i = 0; i < aProperties.length; i++) {
				oColumnData.value[i] = aProperties[i].fieldName;
				var name = "";
				var defaultLabel = oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).label || oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).name;// read the label of the property and assign it to the column
				var sUnitValue = "";
				if (oTableInstance.metadata !== undefined && oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).unit !== undefined) {
					var sUnitReference = oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).unit; // read the unit of the data in one column
					sUnitValue = oTableInstance.getData()[0][sUnitReference]; // take value of unit from first data set
					name = aProperties[i].fieldDesc === undefined || !oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc).length ? defaultLabel + " (" + sUnitValue + ")" : oTableInstance.oApi
							.getTextNotHtmlEncoded(aProperties[i].fieldDesc)
							+ " (" + sUnitValue + ")"; // append the unit to the label 
					oColumnData.name[i] = name;
				} else { // if there is no unit, just display the label of the column
					oColumnData.name[i] = aProperties[i].fieldDesc === undefined || !oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc).length ? defaultLabel : oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc);
				}
			}
		}
		return oColumnData;
	}
	function _getSelectedSortItem(oViewSettingDialog) {
		var oSortOption = {};
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		oViewSettingDialog.getSortItems().forEach(function(oSortItem) {
			if (oSortItem.getId() === oSelectedSortItem) {
				oSortOption.property = oSortItem.getKey();
			}
		});
		oSortOption.descending = oViewSettingDialog.getSortDescending();
		return oSortOption;
	}
	/**
	* @class table constructor.
	* @param oApi,oParameters
	* defines parameters required for chart such as Dimension/Measures.
	* @returns table object
	*/
	sap.apf.ui.representations.table = function(oApi, oParameters) {
		this.oViewSettingDialog = undefined;
		this.aDataResponse = [];// getData in the base class reads the value of data response from this
		this.oParameter = oParameters;
		this.orderby = oParameters.orderby;
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.alternateRepresentation = oParameters.alternateRepresentationType;
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION; //the type is read from step toolbar and step container
		this.oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler();//initialize the pagination handler
	};
	sap.apf.ui.representations.table.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	sap.apf.ui.representations.table.prototype.constructor = sap.apf.ui.representations.table;// Set the "constructor" property to refer to table
	/**
	* @method setData
	* @param aDataResponse - Response from oData service
	* @param metadata - Metadata of the oData service
	* @description Public API which Fetches the data from oData service and updates the selection if present
	*/
	sap.apf.ui.representations.table.prototype.setData = function(aDataResponse, metadata) {
		var self = this;
		var skip = this.oPaginationHandler.getPagingOption().skip;
		if (skip === undefined || skip === 0) { //if data is getting fetched for the first time and no data has to be skipped
			this.aDataResponse = aDataResponse;// For new table, read only 100 data set
		} else { //if pagination is triggered , only 10 data has to be fetched and appended to the existing data set
			aDataResponse.map(function(dataRow) {
				self.aDataResponse.push(dataRow);// for pagination , append the data to the existing data set
			});
		}
		if (!metadata) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6004",
				aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(this.oMessageObject);
		} else { //if metadata is available
			this.metadata = metadata; // assign the metadata to be used in the table representation
			this.UI5ChartHelper.metadata = metadata;
		}
	};
	sap.apf.ui.representations.table.prototype.getSelectionFromChart = function() {
		var aSelection = oTableWithoutHeaders.getSelectedItems();
		return aSelection;
	};
	sap.apf.ui.representations.table.prototype.getSelections = function() {
		var oSelectionObject = [];
		var aSelectedItemInTable = _getAvailableFilterInTableData(this);
		aSelectedItemInTable.forEach(function(selectItem) {
			oSelectionObject.push({
				id : selectItem,
				text : selectItem
			});
		});
		return oSelectionObject;
	};
	sap.apf.ui.representations.table.prototype.getRequestOptions = function(bFilterChanged) {
		if (bFilterChanged) { // When the filter is changed, then paging option is reset to default.
			this.oPaginationHandler.resetPaginationOption();
		}
		var requestObj = {
			paging : this.oPaginationHandler.getPagingOption(this.oParameter.top),
			orderby : []
		};
		//sort properties in the request object
		var orderByArray;
		//table can have the sort property defined in the parameter or the sort property can be changed from view setting dialog
		if (this.orderby && this.orderby.length) { //else read it from the parameter
			orderByArray = this.orderby.map(function(oOrderby) {
				return {
					property : oOrderby.property,
					descending : !oOrderby.ascending
				};
			});
			requestObj.orderby = orderByArray;
		}
		var oSortOption = this.oViewSettingDialog ? _getSelectedSortItem(this.oViewSettingDialog) : {};
		if (oSortOption.property) {
			orderByArray = [];// clear the order by since the sort property has changed for the table at runtime
			orderByArray = [ {
				property : oSortOption.property,
				descending : oSortOption.descending
			} ];
			requestObj.orderby = orderByArray;
		}
		return requestObj;
	};
	/**
	* @method getMainContent
	* @param oStepTitle - title of the main chart
	* @param width - width of the main chart
	* @param height - height of the main chart       
	 * @description draws Main chart into the Chart area
	*/
	sap.apf.ui.representations.table.prototype.getMainContent = function(oStepTitle, height, width) {
		var self = this;
		var aTableData = this.getData();
		var tableFields = this.oParameter.dimensions.concat(this.oParameter.measures).length ? this.oParameter.dimensions.concat(this.oParameter.measures) : this.oParameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		var tableColumns = _getColumnFromProperties(this);
		var oMessageObject;
		if (!oStepTitle) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (tableFields.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "dimensions", oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (!aTableData || aTableData.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6000",
				aParameters : [ oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		var chartWidth = (width || 1000) + "px";
		var columnsWithHeaders = [];
		for(var indexTableColumn = 0; indexTableColumn < tableColumns.name.length; indexTableColumn++) {
			var columnNameWithHeaders = new sap.m.Column({
				header : new sap.m.Text({
					text : tableColumns.name[indexTableColumn]
				})
			});
			columnsWithHeaders.push(columnNameWithHeaders);
		}
		// Table with Headers
		var oTableWithHeaders = new sap.m.Table({
			headerText : oStepTitle,
			showNoData : false,
			columns : columnsWithHeaders
		}).addStyleClass("tableWithHeaders");
		var oTableDataModel = new sap.ui.model.json.JSONModel();
		oTableDataModel.setSizeLimit(10000);
		oTableDataModel.setData({
			tableData : aTableData
		});
		oTableWithHeaders.setModel(oTableDataModel);
		// Table without Headers (built to get scroll only on the data part)
		oTableWithoutHeaders = _createTableAndBindColumns(tableColumns, this);
		oTableWithoutHeaders.attachSelectionChange(_drawSelection.bind(self));
		oTableWithoutHeaders.attachUpdateFinished(_drawSelection.bind(self));
		this.oTableRepresentation = oTableWithoutHeaders; // the table is accessed from the view setting. To sort the data and set the table to busy
		var containerForDataTable = new sap.m.ScrollContainer({// Scroll container for table without headers(to get vertical scroll on  data part used for pagination
			content : oTableWithoutHeaders,
			height : "480px",
			horizontal : false,
			vertical : true
		}).addStyleClass("tableWithoutHeaders");
		var containerForHeaderAndDataTable = new sap.m.ScrollContainer({// Scroll container to hold table with headers and scroll container containing table without headers
			content : [ oTableWithHeaders, containerForDataTable ],
			width : chartWidth,
			horizontal : true,
			vertical : false
		}).addStyleClass("scrollContainer");
		oTableWithoutHeaders.addEventDelegate({//Event delegate to bind pagination action
			onAfterRendering : function() {
				var oSortOption = self.oViewSettingDialog ? _getSelectedSortItem(self.oViewSettingDialog) : {};
				if (self.oParameter.isAlternateRepresentation && oSortOption.property) { // if sort property is changed from view setting for alternate representation
					_sortTableData(oSortOption, self); // sort the data in table.Since setData is called from the parent representation, data is not sorted          }
				}
				_addStyleToTable(containerForHeaderAndDataTable);
				//if top N not is provided and table is not an alternate representation, attach the pagination event
				if (!self.oParameter.top && !self.oParameter.isAlternateRepresentation) {
					self.oPaginationHandler.attachPaginationOnTable(self);
				}
			}
		});
		return new sap.ui.layout.VerticalLayout({
			content : [ containerForHeaderAndDataTable ]
		});
	};
	/**
	* @method getThumbnailContent
	* @description draws Thumbnail for the current chart
	* @returns thumbnail object for column
	*/
	sap.apf.ui.representations.table.prototype.getThumbnailContent = function() {
		var oThumbnailContent;
		var aTableData = this.getData();
		var oIconForAlternateRep = this.oParameter.isAlternateRepresentation ? "sap-icon://table-view" : "sap-icon://table-chart";
		if (aTableData !== undefined && aTableData.length !== 0) {
			var oTableIcon = new sap.ui.core.Icon({
				src : oIconForAlternateRep,
				size : "70px"
			}).addStyleClass('thumbnailTableImage');
			oThumbnailContent = oTableIcon;
		} else {
			var noDataText = new sap.m.Text({
				text : this.oApi.getTextNotHtmlEncoded("noDataText")
			}).addStyleClass('noDataText');
			oThumbnailContent = new sap.ui.layout.VerticalLayout({
				content : noDataText
			});
		}
		return oThumbnailContent;
	};
	/**
	* @method removeAllSelection
	* @description removes all Selection from Chart
	*/
	sap.apf.ui.representations.table.prototype.removeAllSelection = function() {
		_clearFilters(this);
		oTableWithoutHeaders.removeSelections();
		this.oApi.getActiveStep().getSelectedRepresentation().UI5ChartHelper.filterValues = []; // reset the filter values from table to the selected representation
		this.oApi.selectionChanged();
	};
	/**
	* @method getPrintContent
	* @param oStepTitle
	* title of the step
	* @description gets the printable content of the representation
	*/
	sap.apf.ui.representations.table.prototype.getPrintContent = function(oStepTitle) {
		var tableColumnsForPrint = _getColumnFromProperties(this);
		var isPrintForTable = true;
		var oPrintTable = _createTableAndBindColumns(tableColumnsForPrint, this, isPrintForTable);
		oPrintTable.setHeaderText(oStepTitle);
		oPrintTable.setHeaderDesign(sap.m.ListHeaderDesign.Standard);
		oPrintTable.getColumns().forEach(function(column) {
			column.setWidth("75px");
		});
		var aSelectedListItems = _drawSelectionForPrint(this, oPrintTable);// set the selections on table
		return {
			oTableForPrint : new sap.ui.layout.VerticalLayout({
				content : [ oPrintTable ]
			}),
			aSelectedListItems : aSelectedListItems
		};
	};
	sap.apf.ui.representations.table.prototype.createViewSettingDialog = function() {
		var oTableRepresentation = this;
		var oViewSetting = new sap.ui.view({
			type : sap.ui.core.mvc.ViewType.JS,
			viewName : "sap.apf.ui.reuse.view.viewSetting",
			viewData : oTableRepresentation
		});
		this.oViewSettingDialog = oViewSetting.getContent()[0];
		this.oViewSettingDialog.addStyleClass("sapUiSizeCompact");
		return this.oViewSettingDialog;
	};
	/**
	* @method destroy
	* @description Destroying instance level variables
	*/
	sap.apf.ui.representations.table.prototype.destroy = function() {
		if (this.UI5ChartHelper) {
			this.UI5ChartHelper.destroy();
			this.UI5ChartHelper = null;
		}
		if (this.orderby) {
			this.orderby = null;
		}
		if (this.oParameter) {
			this.oParameter = null;
		}
		if (this.oViewSettingDialog) {
			this.oViewSettingDialog.destroy();
		}
		if (this.aDataResponse) {
			this.aDataResponse = null;
		}
	};
}());