/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define([
	"sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory",		
	"sap/ui/fl/Utils",
	"sap/ui/fl/LrepConnector",
	"sap/ui/fl/descriptorRelated/internal/Utils"			
], function(DescriptorInlineChangeFactory, LrepUtils, LrepConnector, Utils) {
	"use strict";

	/**
	 * Descriptor Variant
	 * 
	 * @param {object} [mParameters] parameters
	 * @param {string} [mParameters.id] the id of the descriptor variant id to be provided for a new descriptor variant and for deleting a descriptor variant
	 * @param {string} [mParameters.reference] the referenced descriptor or descriptor variant id to be provided when creating a new descriptor variant
	 * @param {object} [mFileContent] file content of the existing descriptor variant to be provided if descriptor variant shall be created from an existing
	 * @param {boolean} [bDeletion] deletion indicator to be provided if descriptor variant shall be deleted
	 * 
	 * @constructor
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorVariant
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
	
	//Descriptor Variant 
	var DescriptorVariant = function(mParameters, mFileContent, bDeletion) {
		if (mParameters && bDeletion) {
			this._id = mParameters.id;
			this._layer = 'CUSTOMER'; //TODO -> can be customer or vendor
			this._mode = 'DELETION';
			
		} else if (mParameters) {
			this._id = mParameters.id;
			this._reference = mParameters.reference;
			this._layer = 'CUSTOMER'; //TODO -> can be customer or vendor
			this._mode = 'NEW';
			
		} else if (mFileContent) {
			this._mMap = mFileContent;
			this._mode = 'FROM_EXISTING';
			this._layer = 'CUSTOMER'; //TODO -> can be customer or vendor			
			
		}

		this._content = [];
	};

	/**
	 * Adds a descriptor inline change to the descriptor variant
	 *
	 * @param {sap.ui.fl.descriptorRelated.api.DescriptorInlineChange} oDescriptorInlineChange the inline change
	 * 
	 * @return {Promise} resolving when adding the descriptor inline change was successful (without backend access)
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorVariant.prototype.addDescriptorInlineChange = function(oDescriptorInlineChange) {
		var that = this;
		return new Promise(function(resolve) {
			switch (that._mode) {
				case 'NEW':
					that._content.push(oDescriptorInlineChange.getMap());
					break;
				case 'FROM_EXISTING':
					that._mMap.content.push(oDescriptorInlineChange.getMap());
					break;
				case 'DELETION':
					//TODO, adding not possible...
					break;
			}
			resolve(null);
		});
	};

	/**
	 * Submits the descriptor variant to the backend
	 *
	 * @return {Promise} resolving when submitting the descriptor variant was successful
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorVariant.prototype.submit = function() {
		var sRoute = '/sap/bc/lrep/appdescr_variants/';
		var sMethod;

		switch (this._mode) {
			case 'NEW':
				//return new BackendConnector().postDescriptorVariant(this);
				sMethod = 'POST';
				break;
			case 'FROM_EXISTING':
				//return new BackendConnector().putDescriptorVariant(this);
				sMethod = 'PUT';
				sRoute = sRoute + this._getMap().id;
				break;
			case 'DELETION':
				sMethod = 'DELETE';
				sRoute = sRoute + this._id;
				break;
		}

		var oLREPConnector = new LrepConnector();

		var mMap = this._getMap();
		return oLREPConnector.send(sRoute, sMethod, mMap);
	};

	DescriptorVariant.prototype._getMap = function() {
		switch (this._mode) {
			case 'NEW':
				return {
					"fileName": this._getNameAndNameSpace().fileName,
					"fileType": "appdescr_variant", // appdescr_variant
					"namespace": this._getNameAndNameSpace().namespace,
					"layer": LrepUtils.getCurrentLayer(), //return CUSTOMER for UV2
					"packageName": "$TMP", //$TMP, etc. to be set at frontend, check how flex changes are doing this

					"reference": this._reference,

					"id": this._id,

					"content": this._content
				};

			case 'FROM_EXISTING':
				{
					return this._mMap;
				}
		}
	};

	DescriptorVariant.prototype._getNameAndNameSpace = function() {
		return Utils.getNameAndNameSpace(this._id,this._reference);
	};

	//Descriptor Variant Factory
	/**
	 * Factory for Descriptor Variants
	 * @namespace
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorVariantFactory
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	var DescriptorVariantFactory = {};

	/**
	 * Creates a new descriptor variant
	 *
	 * @param {object} mParameters
	 * @param {string} mParameters.reference the referenced descriptor or descriptor variant id
	 * @param {string} mParameters.id the id for the descriptor variant id
	 * 
	 * @return {Promise} resolving the new DescriptorVariant instance
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorVariantFactory.createNew = function(mParameters) {
		Utils.checkParameterAndType(mParameters, "reference", "string");
		Utils.checkParameterAndType(mParameters, "id", "string");
		return new Promise(function(resolve, reject) {
			var oDescriptorVariant = new DescriptorVariant(mParameters);
			resolve(oDescriptorVariant);
		});
	};

	/**
	 * Creates a descriptor variant instance for an existing descriptor variant id
	 *
	 * @param {string} sId the id of the descriptor variant id
	 * 
	 * @return {Promise} resolving the DescriptorVariant instance
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorVariantFactory.createForExisting = function(sId) {
		if (sId === undefined || typeof sId !== "string") {
			throw new Error("Parameter \"sId\" must be provided of type string");
		}
		var sRoute = '/sap/bc/lrep/appdescr_variants/' + sId;
		var oLREPConnector = new LrepConnector();

		return new Promise(function(resolve, reject) {
			oLREPConnector.send(sRoute, 'GET').then(
				function(mResult) {
					var mDescriptorVariantJSON = JSON.parse(mResult.response);
					var oDescriptorVariant = new DescriptorVariant(null,mDescriptorVariantJSON);
					resolve(oDescriptorVariant);
				},
				null
			);
		});
	};
	
	/**
	 * Creates a descriptor variant deletion
	 *
	 * @param {object} mParameter
	 * @param {string} mParameter.id the id for the descriptor variant id
	 * 
	 * @return {Promise} resolving the DescriptorVariant instance
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorVariantFactory.createDeletion = function(mParameter) {
		//TODO check why in createForExisting it is sId and here it is mParamter.id 
		Utils.checkParameterAndType(mParameter, "id", "string");
		return new Promise(function(resolve, reject) {
			var oDescriptorVariant = new DescriptorVariant(mParameter, null, true);
			resolve(oDescriptorVariant);
		});

	};	
	
	return DescriptorVariantFactory;
},true);