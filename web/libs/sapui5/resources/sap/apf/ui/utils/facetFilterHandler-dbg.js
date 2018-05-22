/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterHandler');
jQuery.sap.require('sap.ui.thirdparty.d3');
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Facet filter handler
 * @description Manages the Path context creation and handles facet filter creation.
 * @param {Object} oInject - Dependencies for Facet Filter Handler.
 * @name sap.apf.ui.utils.FacetFilterHandler
 * @returns {sap.apf.ui.utils.FacetFilterHandler}
 */
sap.apf.ui.utils.FacetFilterHandler = function(oInject) {
	"use strict";
	var oCoreApi = oInject.oCoreApi;
	var oSBHandler = oInject.oSBHandler;
	var oPathContextHandler = oInject.oPathContextHandler;
	var oUiApi = oInject.oUiApi;
	var aFacetFiltersFromConfiguration = [];
	var mode = oInject.mode;
	var aSbFilters = [];
	var aFacetFilters = [];
	var aConsolidatedFilters = [];
	var oContextFilterMap = {};
	var oFacetFilterView;
	var oSBFilterPromise;
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#initialize
	 * @description Initializes the oSBHandler, fetches the facetfilter configuration and trigger context creation.
	 * */
	this.initialize = function() {
		aFacetFiltersFromConfiguration = oCoreApi.getFacetFilterConfigurations();
		if (oSBHandler) {
			oSBHandler.initialize();
			oSBFilterPromise = oSBHandler.getAllFilters();
			oSBFilterPromise.then(this._prepareContext.bind(this));
		} else {
			this._prepareContext([]);
		}
	};
	this._prepareContext = function(sbFilters) {
		if (mode !== "backward") { //Prevents updating context as PCH already has the updated context 
			this._setSBFilters(sbFilters);
			this._setFacetFiltersFromConfiguration();
			this._setConsolidatedFilters();
			this._setContextFilterMap();
			this._updatePathContextHandler();
		} else {
			oUiApi.contextChanged();
		}
	};
	this._setSBFilters = function(sbFilters) {
		aSbFilters = sbFilters;
	};
	this._setFacetFiltersFromConfiguration = function() {
		var self = this;
		aFacetFiltersFromConfiguration.forEach(function(oFacetFilter) {
			if (self._isPresentInSbFilters(oFacetFilter.property)) {
				return;
			}
			if (oFacetFilter.preselectionDefaults || oFacetFilter.preselectionFunction) {
				var aValuesFromPreselectionDefaults = oFacetFilter.preselectionDefaults && oFacetFilter.preselectionDefaults.length && oFacetFilter.preselectionDefaults;
				var aValuesFromPreselectionFunction;
				if (!aValuesFromPreselectionDefaults) {
					aValuesFromPreselectionFunction = oFacetFilter.preselectionFunction && oFacetFilter.preselectionFunction.call();
				}
				var aValues = aValuesFromPreselectionDefaults || aValuesFromPreselectionFunction || [];
				aValues.forEach(function(value) {
					var filterObj = {
						NAME : oFacetFilter.property,
						OPERATOR : "EQ",
						VALUE_1 : value,
						VALUE_2 : null
					};
					aFacetFilters.push(filterObj);
				});
			}
		});
	};
	this._setConsolidatedFilters = function() {
		aConsolidatedFilters = [].concat(aSbFilters, aFacetFilters);
	};
	this._setContextFilterMap = function() {
		aConsolidatedFilters.forEach(function(oFilter) {
			if (!oContextFilterMap[oFilter.NAME]) {
				oContextFilterMap[oFilter.NAME] = [];
			}
			oContextFilterMap[oFilter.NAME].push({
				OPERATOR : oFilter.OPERATOR,
				VALUE_1 : oFilter.VALUE_1,
				VALUE_2 : oFilter.VALUE_2
			});
		});
		oContextFilterMap = d3.map(oContextFilterMap);
	};
	this._updatePathContextHandler = function() {
		oContextFilterMap.forEach(function(sFilterName, aExpressions) {
			var oFilter = oCoreApi.createFilter();
			var oFilterOr = oFilter.getTopAnd().addOr(sFilterName);
			aExpressions.forEach(function(oExpression) {
				var oFilterExpression = {
					name : sFilterName,
					operator : oExpression.OPERATOR,
					value : oExpression.VALUE_1
				};
				if (oExpression.OPERATOR === "BT") {
					oFilterExpression.high = oExpression.VALUE_2;
				}
				oFilterOr.addExpression(oFilterExpression);
			});
			oPathContextHandler.update(sFilterName, oFilter);
		});
		oPathContextHandler.saveInitialContext();
		oUiApi.contextChanged();
	};
	this._isPresentInSbFilters = function(sFilterName) {
		var aSbFilterNames = aSbFilters.map(function(oFilter) {
			return oFilter.NAME;
		});
		var index = aSbFilterNames.indexOf(sFilterName);
		return index !== -1;
	};
	this._drawFacetFilter = function(subHeaderInstance) {
		if (aFacetFiltersFromConfiguration && aFacetFiltersFromConfiguration.length) {
			oFacetFilterView = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.facetFilter",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : {
					oCoreApi : oCoreApi,
					oUiApi : oUiApi,
					oPathContextHandler : oPathContextHandler,
					aFacetFilterListData : aFacetFiltersFromConfiguration
				}
			});
			subHeaderInstance.addItem(oFacetFilterView);
		}
	};
	/**
	 * @private
	 * @experimental Refactoring trigerred by the Mozilla bug
	 * @name sap.apf.ui.utils.FacetFilterHandler#drawFacetFilter
	 * @param {Object} subHeaderInstance - Pass the sub header instance to add the facet filter view item
	 * @description draws facet filter on layout subHeader when smart business filters are resolved.
	 */
	this.drawFacetFilter = function(subHeaderInstance) {
		var self = this;
		if (aFacetFiltersFromConfiguration.length) {
			if (oSBHandler) {
				oSBFilterPromise.then(function() {
					self._drawFacetFilter(subHeaderInstance);
				});
			} else {
				self._drawFacetFilter(subHeaderInstance);
			}
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#contextChanged
	 * @description Invokes contextChanged on facet filter view.
	 * */
	this.contextChanged = function() {
		if (oFacetFilterView) {
			oFacetFilterView.onContextChanged.call();
		}
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#getFormattedFilters
	 * @param {string} sProperty - Property name of filter.
	 * @description Invokes getFormattedFilters on facet filter controller.
	 * @returns return content of facet filter controller getFormattedFilters. 
	 * */
	this.getFormattedFilters = function(sProperty) {
		if (oFacetFilterView) {
			return oFacetFilterView.getFormattedFilters(sProperty);
		}
	};
};
