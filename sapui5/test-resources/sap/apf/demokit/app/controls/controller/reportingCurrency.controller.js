/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.apf.demokit.app.helper.contextMediator");
sap.ui.controller("sap.apf.demokit.app.controls.controller.reportingCurrency", {
	onInit : function() {
		// Store the references of view and oApi.
		this.oView = this.getView();
		this.oApi = this.oView.oApi;

		//Adds compact mode when application runs in desktop
		if(sap.ui.Device.system.desktop) {       
			this.oView.addStyleClass("sapUiSizeCompact");
		}
		// Prepare dataset and model for select dialog list of currencies.
		this.aDataset = [];
		this.oModel = new sap.ui.model.json.JSONModel(this.aDataset);
		this.oView.oDialog.setModel(this.oModel);
		// Default Currency in case there is no smartBusiness context.
		this.sSelectedCurrency = this.oApi.getApplicationConfigProperties().defaultReportingCurrency;
		// Pass the default currency to the context.
		// Might get overridden by smartBusiness Context if available.
		var bIsOnInit = true; // Boolean to differentiate between add and update of filter
		this._setFilter(bIsOnInit);
		// Register a listener for 'sap.apf.contextChanged' event.
		var oContextMediator = sap.apf.demokit.app.helper.ContextMediator.getInstance(this.oApi);
		oContextMediator.onContextChange(this.contextChanged.bind(this));
	},
	/**
	 * Trigger request to populate currency list.
	 * Creates Data set and update the bindings when data is ready.
	 * */
	_populateMasterList : function() {
		var self = this;
		this.oApi.getPropertyValuesOfExternalContext('SAPClient').then(function(terms){
			var sapClient = terms[0].Low;
			var oRequestConfiguration = {
				"type" : "request",
				"id" : "requestCurrencyInitialStep",
				"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
				"entityType" : "CurrencyQuery",
				"selectProperties" : [ "Currency", "CurrencyShortName" ]
			};
			var oRequest = self.oApi.createReadRequest(oRequestConfiguration);
			var filter = self.oApi.createFilter();
			var filterOrExp = filter.getTopAnd().addOr();
			filterOrExp.addExpression({
				name : "SAPClient",
				operator : "EQ",
				value : sapClient
			});

			oRequest.send(filter, function(aData, oMetadata, oMessage) {
				if (!oMessage && aData && aData.length) {
					self.aDataset = [];
					aData.forEach(function(oDataRow) {
						self.aDataset.push({
							key : oDataRow.Currency,
							text : oDataRow.CurrencyShortName ? (oDataRow.Currency + " - " + oDataRow.CurrencyShortName) : oDataRow.Currency,
							selected : (oDataRow.Currency === self.sSelectedCurrency)
						});
					});
					self.oModel.setData(self.aDataset);
				} else {
					var oMessageObj = self.oApi.createMessageObject({
						code : "12003",
						aParameters : [ self.oApi.getTextNotHtmlEncoded("reportingCurrency") ]
					});
					self.oApi.putMessage(oMessageObj);
				}
			});
		});
	},
	/**
	 * Listener for 'sap.apf.contextChanged' event.
	 * Fetches the filter from path Context and updates the binding.
	 * */
	contextChanged : function() {
		var oFilter = this.oApi.getPathFilter(this.sDisplayCurrencyFilterId);
		this.sSelectedCurrency = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
		this._populateMasterList();
		this.oModel.updateBindings();
	},
	/**
	 * Handler for 'Confirm' press on select dialog.
	 * update the currency filter.
	 * */
	onConfirmPress : function(oEvt) {
		var self = this;
		var oSelectedItem = oEvt.getParameter('selectedItem');
		this.sSelectedCurrency = oSelectedItem.getBindingContext().getProperty("key");
		this.aDataset.forEach(function(oDataset) {
			oDataset.selected = false;
			if (oDataset.key === self.sSelectedCurrency) {
				oDataset.selected = true;
			}
		});
		this._setFilter();
		this._applySearchFilters([]);
	},
	/**
	 * Handler for 'liveChange' and 'search' events on select dialog.
	 * */
	doSearchItems : function(oEvt) {
		var sValue = oEvt.getParameter("value");
		var oFilter = new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sValue);
		this._applySearchFilters([ oFilter ]);
	},
	/**
	 * Handler for 'cancel' press on select dialog.
	 * */
	onCancelPress : function() {
		this._applySearchFilters([]);
		return;
	},
	/**
	 * update the filter with passed argument.
	 * pass an empty array to clear the filter.
	 * */
	_applySearchFilters : function(aFilters) {
		var oBinding = this.oView.oDialog.getBinding("items");
		oBinding.filter(aFilters, false);
		this.oModel.updateBindings();
	},
	/**
	 * Add the selected currency to the path if boolean is true on initialization
	 * Later updates the path context filter with currently selected currency value
	 * */
	_setFilter : function(bIsOnInit) {
		var oFilter = this.oApi.createFilter();
		var oFilterOrExp = oFilter.getTopAnd().addOr();
		oFilterOrExp.addExpression({
			name : "P_DisplayCurrency",
			operator : "EQ",
			value : this.sSelectedCurrency
		});
		if (bIsOnInit) {
			this.sDisplayCurrencyFilterId = this.oApi.addPathFilter(oFilter);
		} else {
			this.oApi.updatePathFilter(this.sDisplayCurrencyFilterId, oFilter);
		}
		this.oApi.selectionChanged(true);
	}
});