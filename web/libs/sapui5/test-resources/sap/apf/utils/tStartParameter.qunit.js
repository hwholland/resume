jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require("sap.apf.api");
jQuery.sap.require('sap.apf.utils.startParameter');

(function() {
	'use strict';

	sap.apf.testhelper.injectURLParameters({
		"sampleParameter2" : "sampleValue2"
	});
	
	QUnit.module('Get parameters', {
		beforeEach : function(assert) {
			this.currentUriParams = location.search;
			this.componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
							'sap-apf-configuration-id' : [ '654321' ],
							'sap-apf-step-id' : [ '1234' ],
							'sap-apf-representation-id' : [ 'representationId' ],
							'sap-apf-filter-reduction' : [ true ]
						}
					};
					return returnValue;
				}
			};
			this.componentDoubleWithConcatenatedActivationId = {
					getComponentData : function() {
						var returnValue = {
							startupParameters : {
								'sap-apf-configuration-id' : [ '654321.123456' ]
							}
						};
						return returnValue;
					}
				};
			this.originalHash = window.location.hash;
			window.location.hash += "sap-xapp-state=0123456789";
		},
		afterEach : function() {
			window.history.pushState(null, null, this.currentUriParams);
			window.location.hash = this.originalHash;
		}
	});
	QUnit.test('Analytical configuration ID', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.getAnalyticalConfigurationId().configurationId, '654321', 'Correct configuration ID returned');
	});
	QUnit.test('Analytical configuration ID with concatenated activation id', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDoubleWithConcatenatedActivationId);
		assert.equal(startParameter.getAnalyticalConfigurationId().applicationId, '654321', 'Correct application ID returned');
		assert.equal(startParameter.getAnalyticalConfigurationId().configurationId, '123456', 'Correct configuration ID returned');
	});
	QUnit.test('Step ID and representation ID', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.deepEqual(startParameter.getSteps(), [ {
			stepId : '1234',
			representationId : 'representationId'
		} ], 'Correct step ID and representation id returned');
	});

	QUnit.test('WHEN filter reduction is activated VIA url parameter', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.isFilterReductionActive(), true, 'THEN the Filter Reduction Activation is detected');
	});
	QUnit.test('sap-xapp-state', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter();
		assert.equal(startParameter.getXappStateId(), '0123456789');
	});
	QUnit.module('Get parameters', {
		beforeEach : function(assert) {
			this.currentUriParams = location.search;
			this.componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
							'sap-apf-configuration-id' : [ '654321' ],
							'sap-apf-step-id' : [ '1234' ],
							'sap-apf-representation-id' : [ 'representationId' ],
							'sap-client' : [ 120 ],
							'sampleParameter' : [ "sampleValue"]
						}
					};
					return returnValue;
				}
			};

			this.originalHash = window.location.hash;
			window.location.hash += "sap-xapp-state=0123456789";
		},
		afterEach : function() {
			window.history.pushState(null, null, this.currentUriParams);
			window.location.hash = this.originalHash;
		}
	});
	QUnit.test('WHEN Activate LREP is not set', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.isLrepActive(), false, 'THEN the LREP Activation is properly evaluated to false');
	});
	QUnit.test('WHEN sap-client is set', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.getSapClient(), 120, 'THEN the sap-client is detected');
	});

	QUnit.test('WHEN sampleParameter is set', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.getParameter("sampleParameter"), "sampleValue", 'THEN the value of the parameter is detected');
	});
	QUnit.module("Evaluate manifest for filter reduction and lrep activation", {
		beforeEach : function(assert) {
			this.currentUriParams = location.search;
			this.componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
							'sap-apf-configuration-id' : [ '654321' ],
							'sap-apf-step-id' : [ '1234' ],
							'sap-apf-representation-id' : [ 'representationId' ]
						}
					};
					return returnValue;
				}
			};

			this.originalHash = window.location.hash;
			window.location.hash += "sap-xapp-state=0123456789";
		},
		afterEach : function() {
			window.history.pushState(null, null, this.currentUriParams);
			window.location.hash = this.originalHash;
		},
		createManifests : function(bWithOutApfSection) {
			var manifest;
			jQuery.ajax({
				url : "../testhelper/comp/manifest.json",
				dataType : "json",
				success : function(oData) {
					manifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					manifest = {};
				},
				async : false
			});

			manifest["sap.apf"].activateLrep = true;
			if (bWithOutApfSection) {
				manifest["sap.apf"] = undefined;
			}
			var baseManifest;
			jQuery.ajax({
				url : "../../../../resources/sap/apf/base/manifest.json",
				dataType : "json",
				success : function(oData) {
					baseManifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					baseManifest = {};
				},
				async : false
			});
			return {
				manifest : manifest,
				baseManifest : baseManifest
			};
		}
	});
	QUnit.test('WHEN Activate LREP is  set via manifest', function(assert) {
		var manifests = this.createManifests();
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble, manifests);
		assert.equal(startParameter.isLrepActive(), true, 'THEN the LREP Activation is properly evaluated to true');
	});
	QUnit.test('WHEN Activate LREP is  not set via manifest', function(assert) {
		var manifests = this.createManifests(true);
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble, manifests);
		assert.equal(startParameter.isLrepActive(), false, 'THEN the LREP Activation is properly evaluated to false');
	});
	QUnit.test('WHEN filter reduction is  set via manifest', function(assert) {
		var manifests = this.createManifests();
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble, manifests);
		assert.equal(startParameter.isFilterReductionActive(), true, 'THEN the filter reduction is properly evaluated to true');
	});
	QUnit.test('WHEN filter reduction is  neither set via manifest nor via url parameter', function(assert) {
		var manifests = this.createManifests(true);
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble, manifests);
		assert.equal(startParameter.isFilterReductionActive(), false, 'THEN the filter reduction is properly evaluated to false');
	});
	QUnit.module('Get parameter via url', {
		beforeEach : function(assert) {
			this.currentUriParams = location.search;
			this.componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
						}
					};
					return returnValue;
				}
			};
		}
	});
	QUnit.test('WHEN sampleParameter is set via url', function(assert) {
		var startParameter = new sap.apf.utils.StartParameter(this.componentDouble);
		assert.equal(startParameter.getParameter("sampleParameter2"), "sampleValue2", 'THEN the value of the parameter is detected');
	});
}());