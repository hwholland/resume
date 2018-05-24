/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.smartFilterBar");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.SmartFilterBar
	 * @class A SmartFilterBar object providing editor methods on configuration objects
	 * @param {String} smartFilterBarId - unique Id
	 * @constructor
	 */
	sap.apf.modeler.core.SmartFilterBar = function(smartFilterBarId){
		var service, entityType;
		this.getId = function(){
			return smartFilterBarId;
		};
		this.setService = function(name){
			service = name;
		};
		this.getService = function(){
			return service;
		};
		this.setEntityType = function(name){
			entityType = name;
		};
		this.getEntityType = function(){
			return entityType;
		};
	};
}());