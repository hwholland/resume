sap.ui.controller("sap.suite.ui.commons.sample.UnifiedThingInspector.UnifiedThingInspector", {
	backAction: function (oEvent) {
		sap.m.MessageToast.show("Back action is pressed.");
    },
    pressJB: function(oEvent) {
    	sap.m.MessageToast.show("John Bradford's custom template.");
    	return false;
    },
    pressConfig: function(oEvent) {
    	sap.m.MessageToast.show("Configuration button is pressed.");
    	return false;
    },
    pressActions: function(oEvent) {
    	var oActionBtn = oEvent.getParameter("caller");
		if (!this._actionSheet) {
			this._actionSheet = sap.ui.xmlfragment("sap.suite.ui.commons.sample.UnifiedThingInspector.ActionSheet", this);
		}
		this._actionSheet.openBy(oActionBtn);    	
    	return false;
    },
    pressTransactions: function(oEvent) {
    	var oTransactionBtn = oEvent.getParameter("caller");
		if (!this._transactionSheet) {
			this._transactionSheet = sap.ui.xmlfragment("sap.suite.ui.commons.sample.UnifiedThingInspector.TransactionSheet", this);
		}
		this._transactionSheet.openBy(oTransactionBtn);    	
    	return false;
    },
    pressGeneralFacet: function(oEvent) {
		if (!this._generalFacetDetails) {
			this._generalFacetDetails = sap.ui.xmlfragment("sap.suite.ui.commons.sample.UnifiedThingInspector.GeneralFacetDetails", this);
			this.getView().addDependent(this._generalFacetDetails);
		}
		this.getView().byId("unified1").navigateToDetailWithContent(this._generalFacetDetails);
    	return false;
    },
    pressOrdersFacet: function(oEvent) {
		if (!this._ordersFacetDetails) {
			this._ordersFacetDetails = sap.ui.xmlfragment("sap.suite.ui.commons.sample.UnifiedThingInspector.OrdersFacetDetails", this);
			this.getView().addDependent(this._ordersFacetDetails);
		}
		this.getView().byId("unified1").navigateToDetailWithContent(this._ordersFacetDetails);
    	return false;
    },
    pressOrdersDetails: function(oEvent) {
        var sId = oEvent.getSource().getCells()[0].getText();
        var sDesc = oEvent.getSource().getCells()[1].getText();
        var sOrderType = oEvent.getSource().getCells()[2].getText();
        var sStatus = oEvent.getSource().getCells()[3].getText();

		this._deliveryTable = sap.ui.xmlfragment("sap.suite.ui.commons.sample.UnifiedThingInspector.DeliveryTable", this);
		this.getView().addDependent(this._deliveryTable);

        var oPage = new sap.m.Page("page-" + sId, {
            title: "Order Detail",
            showNavButton: true,
            content: [
                new sap.m.ObjectHeader({
                    title: sDesc,
                    number: sId,
                    flagged: true,
                    showFlag: true,
                    attributes: [
                        new sap.m.ObjectAttribute({text : sOrderType}),
                        new sap.m.ObjectAttribute({text : sStatus})
                    ]
                }).addStyleClass("sapSuiteUtiOrderDetails"),
                this._deliveryTable
            ]
        });
        this.getView().byId("unified1").navigateToPage(oPage, true);
    }
});