/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.smartBusinessHandler');
jQuery.sap.require('sap.apf.core.constants');
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Smart business handler
 * @description Manages smart business context.
 * @param {object} oInject - Dependency Injection
 * @name sap.apf.utils.SmartBusinessHandler
 */
sap.apf.utils.SmartBusinessHandler = function(oInject) {
	"use strict";
	var self = this;
	var oCoreApi = {
		getApplicationConfigProperties : oInject.getApplicationConfigProperties,
		createReadRequestByRequiredFilter : oInject.createReadRequestByRequiredFilter,
		getTextNotHtmlEncoded : oInject.getTextNotHtmlEncoded
	};
	var oMessageHandler = oInject.oMessageHandler;
	var oStartParameter = oInject.startParameter;
	var deferredObj = new jQuery.Deferred();
	var oPromise = deferredObj.promise();
	var aFilters = [];
	var aParameterEntitySetKeyProperties = [];
	var aConsolidatedFilters = [];
	var constants = {
		FILTER_TYPE : "FI",
		PARAMETER_TYPE : "PA"
	};
	var getKPIEvaluationId = function() {		
		// Use the start parameter module to get the evaluation id
		return oStartParameter.getEvaluationId();
	};
	
	var sEvaluationId = getKPIEvaluationId();
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#initialize
	 * @description Triggers fetching the smart business filters.
	 * */
	this.initialize = function() {
		oPromise = this._fetchSBData().then(this._pushAllSBFilters);
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#getEvaluationId
	 * @description Getter for KPI Evaluation Id.
	 * @returns {string}
	 * */
	this.getEvaluationId = function() {
		return sEvaluationId;
	};
	this._fetchSBData = function() {
		if (sEvaluationId) {
			var sbConfiguration = oCoreApi.getApplicationConfigProperties().smartBusiness || oCoreApi.getApplicationConfigProperties().smartBusinessService; // TODO CHANGE THIS WHEN APPLICATIONS ADOPT THE NEW TERMINOLOGY
			var sbRuntime = sbConfiguration.runtime || sbConfiguration.evaluation; // TODO CHANGE THIS WHEN APPLICATIONS ADOPT THE NEW TERMINOLOGY
			var sEntitySet = sap.apf.core.constants.entitySets.smartBusiness;
			var sbUrl = [ sbRuntime.service, "/", sEntitySet, "('", sEvaluationId, "')/FILTERS?$format=json" ].join("");
			if (deferredObj.state() === "pending") {
				jQuery.ajax({ // TODO Use createReadRequestByRequiredFilter.
					url : sbUrl,
					success : function(data) {
						deferredObj.resolveWith(self, [ data ]);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						var oMessageObject = oMessageHandler.createMessageObject({
							code : "6011"
						});
						oMessageHandler.putMessage(oMessageObject);
					}
				});
			}
		} else {
			deferredObj.resolveWith(self, [ {
				// TODO Change this when we move to oData v4
				d : {
					results : []
				}
			} ]);
		}
		return deferredObj.promise();
	};
	this._pushAllSBFilters = function(sbData) {
		var aProperties = sbData.d.results; // TODO Change this when we move to oData v4
		aProperties.forEach(function(property) {
			if (property.TYPE === constants.FILTER_TYPE) {
				aFilters.push(property);
			} else if (property.TYPE === constants.PARAMETER_TYPE) {
				aParameterEntitySetKeyProperties.push(property);
			}
			aConsolidatedFilters.push(property);
		});
		return aConsolidatedFilters;
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#getAllFilters
	 * @description Getter for all smart business filters.
	 * Returns a jQuery Promise which will be resolved with Array of filters.
	 * @returns {jQuery.Promise}
	 * */
	this.getAllFilters = function() {
		return oPromise;
	};
};
