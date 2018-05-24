/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define(["sap/ui/fl/descriptorRelated/internal/Utils"
], function(Utils) {
	"use strict";
	
	/**
	 * Descriptor Inline Change
	 *
	 * @param {string} sChangeType change type
	 * @param {object} [mParameters] parameters of the inline change for the provided change type
	 * @param {object} [mTexts] texts for the inline change
	 * 
	 * @constructor
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorInlineChange
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	var DescriptorInlineChange = function(sChangeType,mParameters,mTexts) { //so far, parameter correspond to inline change format
		Utils.checkTexts(mTexts);
		this._mParameters = {};
		this._mParameters.changeType = sChangeType;
		this._mParameters.content = mParameters;
		this._mParameters.texts = mTexts;
	};

	DescriptorInlineChange.prototype._getChangeType = function() {
		return this._mParameters.changeType;
	};

	DescriptorInlineChange.prototype.getMap = function() {
		return this._mParameters;
	};

	
	/**
	 * Factory for Descriptor Inline Changes
	 *
	 * @namespace
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorInlineChangeFactory
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
	var DescriptorInlineChangeFactory = {};

	DescriptorInlineChangeFactory.getDescriptorChangeTypes = function(){
		return ["appdescr_ovp_addNewCard","appdescr_ovp_removeCard",
		        "appdescr_app_addNewInbound", "appdescr_app_changeInbound", "appdescr_app_removeInbound",
		        "appdescr_app_addNewOutbound", "appdescr_app_changeOutbound", "appdescr_app_removeOutbound",
		        "appdescr_app_addNewDataSource", "appdescr_app_changeDataSource", "appdescr_app_removeDataSource",
		        "appdescr_ui5_addNewModel", "appdescr_smb_addNamespace"];
	};

	DescriptorInlineChangeFactory.createNew = function(sChangeType,mParameters,mTexts) {
		var oDescriptorInlineChange = new DescriptorInlineChange(sChangeType,mParameters,mTexts);

		return new Promise(function(resolve, reject) {
			//no check in backend at that point, check only after submitting in service provider
			
			if (oDescriptorInlineChange) {
				resolve(oDescriptorInlineChange);
			} else {
				var oError = {}; //TODO
				reject(oError);
			}

		});
	};


//private static methods
	DescriptorInlineChangeFactory._createDescriptorInlineChange = function( sDescriptorChangeType,mParameters,mTexts ){
		var oDescriptorInlineChange = new DescriptorInlineChange(sDescriptorChangeType,mParameters,mTexts);
		
		//no check in backend at that point, check only after submitting in service provider
		return new Promise(function(resolve, reject) {
			if (oDescriptorInlineChange) {
				resolve(oDescriptorInlineChange);
			} else {
				var oError = {};
				reject(oError);
			}
		});
	};


//public static factory methods

	/**
	 * Creates an inline change of change type appdescr_ovp_addNewCard
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.card the card to be created according to descriptor schema
	 * @param {object} [mParameters.model] the ui5 model to be created according to descriptor schema
	 * @param {object} [mParameters.dataSource] the data sources to be created according to descriptor schema (either not provided or of type OData or of type OData and ODataAnnotation
	 * @param {object} [mTexts] texts for the inline change
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_ovp_addNewCard = function(mParameters,mTexts) {
		Utils.checkParameterAndType(mParameters, "card", "object");
		return this._createDescriptorInlineChange('appdescr_ovp_addNewCard', mParameters,mTexts);
	};
	
	/**
	 * Creates an inline change of change type appdescr_ovp_removeCard
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.cardId the id of the card to be removed
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_ovp_removeCard = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "cardId", "string");
		return this._createDescriptorInlineChange('appdescr_ovp_removeCard', mParameters);
		
	};

	/**
	 * Creates an inline change of change type appdescr_app_addNewInbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.inbound the inbound to be created according to descriptor schema
	 * @param {object} [mTexts] texts for the inline change
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_addNewInbound = function(mParameters,mTexts) {
		Utils.checkParameterAndType(mParameters, "inbound", "object");
		return this._createDescriptorInlineChange('appdescr_app_addNewInbound', mParameters, mTexts);
		
	};

	/**
	 * Creates an inline change of change type appdescr_app_removeInbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.inboundId the id of the inbound to be removed
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_removeInbound = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "inboundId", "string");
		return this._createDescriptorInlineChange('appdescr_app_removeInbound', mParameters);
		
	};	
	
	/**
	 * Creates an inline change of change type appdescr_app_changeInbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.inboundId the id of the inbound to be changed
	 * @param {object} mParameters.entityPropertyChange
	 * @param {object} mParameters.entityPropertyChange.propertyPath - the property path inside the inbound
	 * @param {object} mParameters.entityPropertyChange.operation - the operation (INSERT, UPDATE, UPSERT, DELETE)
	 * @param {object} mParameters.entityPropertyChange.propertyValue - the new property value
	 * @param {object} [mTexts] texts for the inline change
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_changeInbound = function(mParameters,mTexts) {
		Utils.checkParameterAndType(mParameters, "inboundId", "string");
		Utils.checkEntityPropertyChange(mParameters);
		return this._createDescriptorInlineChange('appdescr_app_changeInbound', mParameters, mTexts);
		
	};
	
	/**
	 * Creates an inline change of change type appdescr_app_addNewOutbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.outbound the outbound to be created according to descriptor schema
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_addNewOutbound = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "outbound", "object");
		return this._createDescriptorInlineChange('appdescr_app_addNewOutbound', mParameters);
		
	};

	/**
	 * Creates an inline change of change type appdescr_app_removeOutbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.outboundId the id of the outbound to be removed
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_removeOutbound = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "outboundId", "string");
		return this._createDescriptorInlineChange('appdescr_app_removeOutbound', mParameters);
		
	};	
	
	/**
	 * Creates an inline change of change type appdescr_app_changeOutbound
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.outboundId the id of the outbound to be changed
	 * @param {object} mParameters.entityPropertyChange
	 * @param {object} mParameters.entityPropertyChange.propertyPath - the property path inside the outbound
	 * @param {object} mParameters.entityPropertyChange.operation - the operation (INSERT, UPDATE, UPSERT, DELETE)
	 * @param {object} mParameters.entityPropertyChange.propertyValue - the new property value
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_changeOutbound = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "outboundId", "string");
		Utils.checkEntityPropertyChange(mParameters);
		return this._createDescriptorInlineChange('appdescr_app_changeOutbound', mParameters);
		
	};
	
	/**
	 * Creates an inline change of change type appdescr_app_addNewDataSource
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.dataSource - the data source to be created according to descriptor schema (either one data source or one of type OData and one of type ODataAnnotation)
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_addNewDataSource = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "dataSource", "object");
		return this._createDescriptorInlineChange('appdescr_app_addNewDataSource', mParameters);
		
	};

	/**
	 * Creates an inline change of change type appdescr_app_removeDataSource
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.dataSourceId the id of the data source to be removed
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_removeDataSource = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "dataSourceId", "string");
		return this._createDescriptorInlineChange('appdescr_app_removeDataSource', mParameters);
		
	};	
	
	/**
	 * Creates an inline change of change type appdescr_app_changeDataSource
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {string} mParameters.dataSourceId the id of the data source to be changed
	 * @param {object} mParameters.entityPropertyChange
	 * @param {object} mParameters.entityPropertyChange.propertyPath - the property path inside the data source
	 * @param {object} mParameters.entityPropertyChange.operation - the operation (INSERT, UPDATE, UPSERT, DELETE)
	 * @param {object} mParameters.entityPropertyChange.propertyValue - the new property value
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_app_changeDataSource = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "dataSourceId", "string");
		Utils.checkEntityPropertyChange(mParameters);
		return this._createDescriptorInlineChange('appdescr_app_changeDataSource', mParameters);
		
	};
	
	/**
	 * Creates an inline change of change type appdescr_ui5_addNewModel
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.model the ui5 model to be created according to descriptor schema
	 * @param {object} [mParameters.dataSource] the data sources to be created according to descriptor schema (either not provided or of arbitrary type or two provided of type OData and of type OData and ODataAnnotation)
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_ui5_addNewModel = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "model", "object");
		return this._createDescriptorInlineChange('appdescr_ui5_addNewModel', mParameters);
	};
	
	/**
	 * Creates an inline change of change type appdescr_smb_addNamespace
	 *
	 * @param {object} mParameters parameters of the change type
	 * @param {object} mParameters.smartBusinessApp the smart business app to be created according to descriptor schema
	 * 
	 * @return {Promise} resolving when creating the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorInlineChangeFactory.create_smb_addNamespace = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "smartBusinessApp", "object");
		return this._createDescriptorInlineChange('appdescr_smb_addNamespace', mParameters);
	};
	
	return DescriptorInlineChangeFactory ;	

},true);