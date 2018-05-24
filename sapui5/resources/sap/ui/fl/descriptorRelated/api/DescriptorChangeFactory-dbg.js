/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define([
	"sap/ui/fl/ChangePersistenceFactory",
	"sap/ui/fl/ChangePersistence",
	"sap/ui/fl/Change"	
], function(ChangePersistenceFactory, ChangePersistence, Change) {
	"use strict";

	/**
	 * Descriptor Related
	 * @namespace
	 * @name sap.ui.fl.descriptorRelated
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
	/**
	 * Descriptor Related Apis
	 * @namespace
	 * @name sap.ui.fl.descriptorRelated.api
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
	/**
	 * Descriptor Change
	 *
	 * @param {object} mChangeFile change file
	 * @param {sap.ui.fl.descriptorRelated.api.DescriptorInlineChange} oInlineChange inline change object
	 * 
	 * @constructor
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorChange
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
//Descriptor Change 
	var DescriptorChange = function(mChangeFile,oInlineChange) { //so far, parameter correspond to inline change format
		this._mChangeFile = mChangeFile;
		this._mChangeFile.packageName = '$TMP';
		this._oInlineChange = oInlineChange;
	};
	
	/**
	 * Submits the descriptor change to the backend
	 *
	 * @return {Promise} resolving after all changes have been saved
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorChange.prototype.submit = function() {
		var mInlineChange = this._oInlineChange.getMap();
		
		//create Change
		this._mChangeFile.content = mInlineChange.content;
		var oChange = new Change(this._mChangeFile);
		
		// create persistence
		var sComponentName = this._mChangeFile.reference; //reference contains id of the referenced descriptor
		var oChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent(sComponentName);
		
		//add change to persistence
		oChangePersistence.addChange(oChange);
		
		//submit
		return oChangePersistence.saveDirtyChanges();
	};	

	DescriptorChange.prototype._getMap = function() {
		return this._mParameters;
	};

//Descriptor LREP Change Factory
	/**
	 * Factory for Descriptor Changes
	 *
	 * @constructor
	 * @alias sap.ui.fl.descriptorRelated.api.DescriptorChangeFactory
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 */
	
	var DescriptorChangeFactory = function() {};

	/**
	 * Creates a new descriptor change
	 *
	 * @param {string} sReference the descriptor id for which the change is created
	 * @param {object} oInlineChange the inline change instance
	 *
	 * @return {Promise} resolving the new Change instance
	 * 
	 * @private
	 * @sap-restricted
	 */
	DescriptorChangeFactory.prototype.createNew = function(sReference,oInlineChange) {
		var mPropertyBag = {}; //in fl-lib this is called oPropertyBack, which is actually not correct naming, its an m not an o
		mPropertyBag.changeType = oInlineChange._getChangeType();
		//See Change.... how namespace is calculated
		mPropertyBag.componentName = sReference; // because Change.... has it like this...->
		mPropertyBag.reference = sReference;

		var mChangeFile = Change.createInitialFileContent(mPropertyBag );
		//namespace is not determined here - this happens by evaluating oPropertyBack.componentName

		var oDescriptorChange = new DescriptorChange(mChangeFile, oInlineChange);

		return new Promise(function(resolve, reject) {
			//TODO
			resolve(oDescriptorChange );
		});
	};
	
	return DescriptorChangeFactory ;
}, true);