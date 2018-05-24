sap.ui.controller("sap.ui.comp.sample.valuehelpdialog.example2.ValueHelpDialog", {
	onInit: function() {
		this.theTokenInput= this.getView().byId("multiInput");
		this.theTokenInput.setEnableMultiLineMode( sap.ui.Device.system.phone); 

		this.aKeys= ["CompanyCode", "CompanyName"];

		var token1= new sap.m.Token({key: "0001", text:"SAP A.G. (0001)"});
		this.aTokens= [token1];
		
		this.theTokenInput.setTokens(this.aTokens);

		this.aItems= [{CompanyCode: "0001", CompanyName: "SAP A.G.", City: "Walldorf", CurrencyCode:"EUR"},
	                 {CompanyCode: "0002", CompanyName: "SAP Laps India", City: "Bangalore", CurrencyCode:"INR"},
	                 {CompanyCode: "0003", CompanyName: "SAP China LAB", City: "Beijing", CurrencyCode:"CNY"},
	                 {CompanyCode: "0100", CompanyName: "SAP1", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0101", CompanyName: "SAP2", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0102", CompanyName: "SAP3", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0103", CompanyName: "SAP4", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0104", CompanyName: "SAP5", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0105", CompanyName: "SAP6", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0106", CompanyName: "SAP7", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0107", CompanyName: "SAP8", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0108", CompanyName: "SAP9", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0109", CompanyName: "SAP10", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0110", CompanyName: "SAP11", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0111", CompanyName: "SAP12", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0112", CompanyName: "SAP13", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0113", CompanyName: "SAP14", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0114", CompanyName: "SAP15", City: "Berlin", CurrencyCode:"EUR"},
	                 {CompanyCode: "0115", CompanyName: "SAP16", City: "Berlin", CurrencyCode:"EUR"}
	                 ];
				
	},
	
	onValueHelpRequest: function() {
		var that= this;
		
		var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			basicSearchText: this.theTokenInput.getValue(), 
			title: "Company",
			supportMultiselect: false,
			supportRanges: false,
			supportRangesOnly: false, 
			key: this.aKeys[0],				
			descriptionKey: this.aKeys[1],
			stretch: sap.ui.Device.system.phone, 

			ok: function(oControlEvent) {
				that.aTokens = oControlEvent.getParameter("tokens");
				that.theTokenInput.setTokens(that.aTokens);

				oValueHelpDialog.close();
			},

			cancel: function(oControlEvent) {
				sap.m.MessageToast.show("Cancel pressed!");
				oValueHelpDialog.close();
			},

			afterClose: function() {
				oValueHelpDialog.destroy();
			}
		});
		
		
		var oColModel = new sap.ui.model.json.JSONModel();
		oColModel.setData({
			cols: [
			      	{label: "Company Code", template: "CompanyCode"},
			        {label: "Company Name", template: "CompanyName"},
			        {label: "City", template: "City", demandPopin : true},
			        {label: "Currency Code", template: "CurrencyCode", demandPopin : true}
			      ]
		});
		oValueHelpDialog.getTable().setModel(oColModel, "columns");

		
		var oRowsModel = new sap.ui.model.json.JSONModel();
		oRowsModel.setData(this.aItems);
		oValueHelpDialog.getTable().setModel(oRowsModel);
		if (oValueHelpDialog.getTable().bindRows) {
			oValueHelpDialog.getTable().bindRows("/"); 
		}
		if (oValueHelpDialog.getTable().bindItems) { 
			var oTable = oValueHelpDialog.getTable();
			
			oTable.bindAggregation("items", "/", function(sId, oContext) { 
				var aCols = oTable.getModel("columns").getData().cols;
			
				return new sap.m.ColumnListItem({
					cells: aCols.map(function (column) {
						var colname = column.template;
						return new sap.m.Label({ text: "{" + colname + "}" });
					})
				});
			});
		}	
		
		oValueHelpDialog.setTokens(this.theTokenInput.getTokens());
		
		var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
			advancedMode:  true,
			filterBarExpanded: false,
			showGoOnFB: !sap.ui.Device.system.phone,
			filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Company Code", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "Company Name", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n3", label: "City", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n4", label: "Currency Code", control: new sap.m.Input()})],
			search: function() {
				sap.m.MessageToast.show("Search pressed '"+arguments[0].mParameters.selectionSet[0].getValue()+"''");
			}
		});			
				
		if (oFilterBar.setBasicSearch) {
			oFilterBar.setBasicSearch(new sap.m.SearchField({
				showSearchButton: sap.ui.Device.system.phone, 
				placeholder: "Search",
				search: function(event) {
					oValueHelpDialog.getFilterBar().search();
				} 
			}));  
		}
		
		oValueHelpDialog.setFilterBar(oFilterBar);
		
		if (this.theTokenInput.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else {
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");			
		}
		
		oValueHelpDialog.open();
		oValueHelpDialog.update();
	}

});