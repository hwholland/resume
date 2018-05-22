/*global sap, jQuery, sinon,  OData */
jQuery.sap.declare('sap.apf.testhelper.doubles.uiApi');
jQuery.sap.require('sap.apf.api');
jQuery.sap.require('sap.apf.testhelper.doubles.component');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch');

(function() {
	'use strict';

	/**
	 * @description Constructor, simply clones the configuration object and sets
	 * @param {string} compId unique id of the component
	 * @param {string} applicationConfigPath path of the application configuration
	 * @param {object} inject  injected constructors and functions for the API
	 */
	sap.apf.testhelper.doubles.UiApi = function(compId, applicationConfigPath, inject) {

		var path = applicationConfigPath || "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";
		var componentData = {};
		componentData.startupParameters = jQuery.sap.getUriParameters().mParams;
		inject = inject || {};
		inject.functions = inject.functions || {};
		inject.functions.ajax = inject.functions.ajax || sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;

		this.oComponent = sap.apf.testhelper.doubles.component.create(this, compId, inject, path, componentData);
		var dependenciesFromProbe = this.oComponent.getProbe();
		this.oApi = this.oComponent.getApi();
		this.oUiApi = dependenciesFromProbe.uiApi;
		this.oCoreApi = dependenciesFromProbe.coreApi;
		this.oSerializationMediator = dependenciesFromProbe.serializationMediator;
		this.oFilterIdHandler = dependenciesFromProbe.filterIdHandler;
		this.oStartFilterHandler = dependenciesFromProbe.startFilterHandler;
	};
	sap.apf.testhelper.doubles.UiApi.prototype.constructor = sap.apf.testhelper.doubles.UiApi;
}());