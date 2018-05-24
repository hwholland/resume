/* global sap */

jQuery.sap.declare("sap.apf.testhelper.createComponent");
jQuery.sap.require("sap.apf.testhelper.doubles.component");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");


(function() {
	'use strict';

	/**
	 * @description Creates a component. See configuration object for the various options.
	 * @param {object} contextToBeEnriched the component, api, component container will be added as properties to this object. So test has access to
	 * public methods of the api and the public methods of the component.
     * @param {object} configuration parametrizes the component creation.
	 * @param {string} [configuration.componentId] unique id of the component
	 * @param {boolean} [configuration.stubAjaxForResourcePaths] required when loading application configuration on various servers
	 * @param {boolean} [configuration.doubleUiInstance] when true, the ui instance is replaced by its double
	 * @param {boolean} [configuration.noLoadingOfApplicationConfig] when true, then the application config is not loaded
	 * @param {string} [configuration.path] path of the application configuration. No path is loaded, when empty string is supplied. 
	 *            If nothing is provided, then default application configuration is loaded (Except that noLoadingOfApplicationConfig is set to true).
	 * @param {object} [configuration.inject] injected constructors, probes and functions for the API
	 * @param {object} [configuration.componentData]
	 */
	sap.apf.testhelper.createComponent = function(contextToBeEnriched, configuration) {
		var id = configuration.componentId || "CompUI";
		var applicationConfigurationPath = determinePathOfApplicationConfiguration(configuration);

		var apiInject = configuration.inject || {};
		if (configuration.doubleUiInstance) {
			apiInject.constructors = apiInject.constructors || {};
			apiInject.constructors.UiInstance = apiInject.constructors.UiInstance || sap.apf.testhelper.doubles.UiInstance;
		}
		if (configuration.stubAjaxForResourcePaths) {
			apiInject.functions = apiInject.functions || {};
			apiInject.functions.ajax = sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;
		}

		contextToBeEnriched.oComponent = sap.apf.testhelper.doubles.component.create(contextToBeEnriched, id, apiInject, applicationConfigurationPath, configuration.componentData, configuration.onBeforeStartApfCallback);
		contextToBeEnriched.oApi = contextToBeEnriched.oComponent.getApi();
	};


	function determinePathOfApplicationConfiguration(configuration) {

		if (configuration.noLoadingOfApplicationConfig) {
			return "";
		} else if (configuration.path === undefined) {
			return "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";
		} 
		return configuration.path;
	}
}());