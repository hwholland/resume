sap.ui.controller("sap.ui.comp.sample.valuehelpdialog.example3.ValueHelpDialog", {
	onInit: function() {
		this.theTokenInput= this.getView().byId("multiInput");
		this.theTokenInput.setEnableMultiLineMode( sap.ui.Device.system.phone); 

		this.aKeys= ["CompanyCode", "CompanyName"];

		var rangeToken1= new sap.m.Token({key: "i1", text: "ID: a..z"}).data("range", { "exclude": false, "operation": "BT", "keyField": "CompanyCode", "value1": "a", "value2": "z"});
		var rangeToken2= new sap.m.Token({key: "i2", text: "ID: =foo"}).data("range", { "exclude": false, "operation": "EQ", "keyField": "CompanyCode", "value1": "foo", "value2": ""});
		var rangeToken3= new sap.m.Token({key: "e1", text: "ID: !(=foo)"}).data("range", { "exclude": true, "operation": "EQ", "keyField": "CompanyCode", "value1": "foo", "value2": ""});
		this.aTokens= [rangeToken1, rangeToken2, rangeToken3];
		
		this.theTokenInput.setTokens(this.aTokens);
	},
	
	onValueHelpRequest: function() {
		var that= this;
		
		var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			basicSearchText: this.theTokenInput.getValue(), 
			title: "Company",
			supportRanges: true,
			supportRangesOnly: true, 
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
		
		oValueHelpDialog.setRangeKeyFields([{label: "Company Code", key: "CompanyCode"}, {label : "Company Name", key:"CompanyName"}]); 
		oValueHelpDialog.setTokens(this.theTokenInput.getTokens());
		
		if (this.theTokenInput.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else {
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");			
		}
		
		oValueHelpDialog.open();
	}

});