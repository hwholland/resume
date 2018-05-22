jQuery.sap.require("sap.apf.testhelper.comp.Component");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';

	QUnit.module("Extension of Base Component", {
		beforeEach : function() {
			this.originalApi = sap.apf.Api;
		},
		afterEach : function() {
			this.oComponentContainer.destroy();
			sap.apf.Api = this.originalApi;
		}
	});

	QUnit.test("WHEN a component, that extends the base Component is created", function(assert) {

		sap.apf.Api = function(oComponent, injectedConstructors, manifests) {

			this.startApf = function() {
				var application = new sap.m.App();
				return application;
			};

			this.destroy = function() {
				return;
			};

			this.startupSucceeded = function() {
				return true;
			};
			assert.equal(sap.apf.utils.getComponentNameFromManifest(manifests.manifest), "sap.apf.testhelper.comp.Component", "THEN component name can be retrieved from manifest");
			assert.equal(sap.apf.utils.getComponentNameFromManifest(manifests.baseManifest), "sap.apf.base.Component", "THEN component name can be retrieved from Base Component");
			assert.equal(manifests.manifest["sap.app"].dataSources.PathPersistenceServiceRoot.uri, "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV", "THEN persistence uri can be retrieved from Base Component Manifest");
			assert.equal(manifests.manifest["sap.app"].i18n, "../../resources/i18n/applicationUi.properties", "THEN the application text file can be retrieved");
			assert.equal(manifests.manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri, "../../resources/config/sampleConfiguration.json", "THEN the analytical configuration can be accessed");

		};

		var comp = new sap.apf.testhelper.comp.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");

	});
}());