jQuery.sap.declare("sap.apf.testhelper.doubles.component");
jQuery.sap.require("sap.apf.testhelper.doubles.representation");
(function() {
	'use strict';

	jQuery.sap.require("sap.apf.Component");
	jQuery.sap.require("sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch");
	sap.apf.testhelper.doubles.component = sap.apf.testhelper.doubles.component || {};

	var componentCounter = 0;

	/**
	 * creates a component, that extends from the sap.apf.Component
	 * The ajax is automatically adjusted to find the resource paths
	 * @param {object} oContext the context is enhanced with component and componentContainter
	 * @param {object} sComponentId is the id of the component
	 * @param {object} inject is the inject structure
	 * @param {string} applicationConfigurationPath
	 * @param {componentData} is component data
	 * @returns {sap.apf.testhelper.doubles.component.Component}
	 */
	sap.apf.testhelper.doubles.component.create = function(oContext, sComponentId, inject, applicationConfigurationPath, componentData, onBeforeStartApfCallback) {

		var probeContext;

		sap.apf.Component.extend("sap.apf.testhelper.doubles.component.Component", {
			oApi : null,
			metadata : {
				"config" : {
					"fullWidth" : true
				},
				"name" : "CoreComponent",
				"version" : "0.0.1",
				"publicMethods" : [ "getApi", "getProbe", "getInjections" ],
				"dependencies" : {
					"libs" : [ "sap.apf" ]
				}
			},

			createContent: function() {
				this.oApi = this.getApi();
				if (applicationConfigurationPath !== "") {
					this.oApi.loadApplicationConfig(applicationConfigurationPath);
				}
				if(onBeforeStartApfCallback && typeof onBeforeStartApfCallback === "function"){
					this.oApi.setCallbackBeforeApfStartup(onBeforeStartApfCallback);
				}
				return sap.apf.Component.prototype.createContent.apply(this, arguments);
			},
			getProbe : function() {
				return probeContext;
			},
			getInjections : function() {
				function probe(dependencies) {
					probeContext = dependencies;
				}
				inject = inject || {};
				inject.probe = probe;
				return inject;
			}
		});

		var sId = (sComponentId || "Comp1") + componentCounter++;

		var oComponent = new sap.apf.testhelper.doubles.component.Component({
			id : sId,
			componentData : componentData
		});

		var sContainerId = "Cont" + sId;
		oContext.oCompContainer = new sap.ui.core.ComponentContainer(sContainerId, {
			component : oComponent
		});
		oContext.oCompContainer.setComponent(oComponent);

		return oComponent;
	};

}());