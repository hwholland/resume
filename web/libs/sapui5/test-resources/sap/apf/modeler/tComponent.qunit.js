/**
 * test of the modeler component
 */
jQuery.sap.require("sap.apf.testhelper.modelerComponent.Component");
jQuery.sap.require('sap.apf.testhelper.helper');
sap.apf.testhelper.injectURLParameters({
	"createContent" : "false"
});

(function() {
	'use strict';

	function setup(context) {
		context.originalCoreInstance = sap.apf.modeler.core.Instance;
	}
	function teardown(context) {
		context.oComponentContainer.destroy();
		sap.apf.modeler.core.Instance = context.originalCoreInstance;
	}
	QUnit.module("Extension of Modeler Component", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});
	QUnit.test("WHEN a component extends the modeler component", function(assert) {
		assert.expect(1);
		var comp;
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			assert.equal(inject.constructors.PersistenceProxy, sap.apf.core.LayeredRepositoryProxy, "THEN the layered repository proxy is injected for the persistence proxy");
		};
		comp = new sap.apf.testhelper.modelerComponent.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});

	QUnit.module("Injection of catalog service function into instance", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});
	QUnit.test("WHEN manifest provides catalog service", function(assert){
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {}});
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};

			assert.equal(inject.functions.getCatalogServiceUri(), "/sap/opu/odata/iwfnd/catalogservice", "THEN the injected function for catalog service provides the expected uri");
		};
		comp = new sap.apf.modeler.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.test("WHEN manifest provides outbound navigation to runtime", function(assert){
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {}});
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			var expectedNavigationTarget = {
					  "action": "executeAPFConfiguration",
					  "semanticObject": "FioriApplication"
			};
			assert.deepEqual(inject.functions.getNavigationTargetForGenericRuntime(), expectedNavigationTarget, "THEN the injected function for navigation targets returns the expected semantic object and action");
		};
		comp = new sap.apf.modeler.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
}());