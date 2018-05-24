jQuery.sap.declare("test.sap.apf.core.tRequest");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfMessageHandler");
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.apf.core.utils.filterSimplify");
jQuery.sap.require("sap.apf.core.utils.fileExists");

/*eslint no-invalid-this:0*/

/*global OData:true*/

(function() {
	'use strict';
	
	function commonSetup(oContext) {
		function defineFilterOperators() {
			jQuery.extend(oContext, sap.apf.core.constants.FilterOperators);
		}
		oContext.Filter = sap.apf.core.utils.Filter;
		defineFilterOperators();
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		oContext.oMessageHandler = oMessageHandler;
		if (!oContext.oCoreApi) {
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oMessageHandler
				}
			});
		}
		oContext.oCoreApi.getXsrfToken = function(sServiceRootPath) {
		};
		oContext.oCoreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		oContext.oMetadataDouble = new sap.apf.testhelper.doubles.Metadata({
			instances: {
				messageHandler : oMessageHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		oContext.oCoreApi.getMetadata = function() {
			return oContext.oMetadataDouble;
		};
		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
			var oInject = {
				instances : {
					datajs : {
						request : function() {
						}
					}
				}
			};
			sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
		};
		oContext.oCoreApi.ajax = function(context) {
			jQuery.ajax(context);
		};
	}

	function setupCoreAndMessageHandling(oContext, bSaveConstructors, bFilterReductionIsActive) {
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().supportLoadConfigWithoutAction();
		oContext.oMessageHandler = oMessageHandler;
		if (!oContext.oCoreApi) {
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oMessageHandler
				}
			});
		}
		oContext.oInject = {
				instances: {
					messageHandler : oMessageHandler,
					coreApi : oContext.oCoreApi,
					fileExists : new sap.apf.core.utils.FileExists()
				}
		};
		var oTextResourceHandler = new sap.apf.core.TextResourceHandler(oContext.oInject);
		oContext.oCoreApi.createMessageObject = function(oConfig) {
			return oMessageHandler.createMessageObject(oConfig);
		};
		oContext.oCoreApi.ajax = function(context) {
			jQuery.ajax(context);
		};
		oContext.oCoreApi.putMessage = function(oMessage) {
			return oMessageHandler.putMessage(oMessage);
		};
		oContext.oCoreApi.getMessageText = function(sCode, aParameters) {
			return oTextResourceHandler.getMessageText(sCode, aParameters);
		};
		oContext.oCoreApi.getStartParameterFacade = function() {
			var oStartParameter = new sap.apf.utils.StartParameter();

			if (bFilterReductionIsActive) {
				oStartParameter.isFilterReductionActive = function() {
					return true;
				};
			}
			return oStartParameter;
		};
		oContext.oCoreApi.getResourceLocation = function(sResourceIdentifier) {
			return this.oRPH.getResourceLocation(sResourceIdentifier);
		}.bind(oContext);
		oContext.oCoreApi.loadMessageConfiguration = function(aMessages) {
			oMessageHandler.loadConfig(aMessages);
		};
		oContext.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
		};
		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oRPH = new sap.apf.core.ResourcePathHandler(oContext.oInject);
		var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/' + sap.apf.testhelper.determineApplicationConfigName();
		oContext.fnOriginalAjax = jQuery.ajax;
		sap.apf.testhelper.replacePathsInAplicationConfiguration(oContext.fnOriginalAjax);
		oContext.oRPH.loadConfigFromFilePath(sConfigPath);
	}
QUnit.module('Missing service definition during create request', {
	beforeEach : function(assert) {
		var that = this;
		setupCoreAndMessageHandling(this, true);
		this.oMessageHandler.putMessage = function(oMessageObject) {
			that.code = oMessageObject.getCode();
		};
	},
	afterEach : function(assert) {
		jQuery.ajax = this.fnOriginalAjax;
	}
});
QUnit.test("Create Request", function(assert) {
	assert.expect(2);
	assert.throws(function() {
		new sap.apf.core.Request(this.oInject, {
			id : "requestForTesting",
			entityType : 'entityTypeOfNoInterest',
			selectProperties : [ 'FilterPropertyOne' ]
		});
	}, Error, "Service definition does not exist");
	assert.equal(this.code, "5015", "Code as expected");
});
QUnit.module('Filter and view parameter values', {
	beforeEach : function(assert) {
		var that = this;
		commonSetup(this);
		setupCoreAndMessageHandling(this, false);
		this.oCoreApi.getUriGenerator = function() {
			return {
				buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
					that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
				},
				getAbsolutePath : function() {
				}
			};
		};
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithParams',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
	},
	saveValues : function(aParameters) {
		this.uriParts.entityType = aParameters[0];
		this.uriParts.selectProperties = aParameters[1];
		this.uriParts.filter = aParameters[2];
		this.uriParts.parameter = aParameters[3];
		this.uriParts.sortingFields = aParameters[4];
		this.uriParts.paging = aParameters[5];
		this.uriParts.format = aParameters[6];
	},
	uriParts : {},
	afterEach : function(assert) {
		jQuery.ajax = this.fnOriginalAjax;
	}
});
QUnit.test('Parameter values based on metadata default values', function(assert) {
	var oFilter = new this.Filter(this.oMessageHandler);
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.deepEqual(this.uriParts.parameter, {
		p_stringParameter : "%27defaultString%27",
		p_int32Parameter : 10
	}, 'Two parameters and their values expected');
});
QUnit.test('Parameter values based on metadata and actual filter values (flat filter)', function(assert) {
	var oFilter = new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 4711);
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.deepEqual(this.uriParts.parameter, {
		p_stringParameter : "%27defaultString%27",
		p_int32Parameter : 4711
	}, 'Three parameters and their values expected');
});
QUnit.test('Parameter values based on metadata and actual filter values (two level filter)', function(assert) {
	var oFilter = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, '10');
	oFilter.addOr('p_int32Parameter', this.EQ, 4711);
	oFilter.addOr('FilterPropertyTwo', this.LT, '200');
	var oNextLevelFilter = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, '20');
	oNextLevelFilter.addOr('FilterPropertyThree', this.GT, '120');
	oNextLevelFilter.addOr('p_int32Parameter', this.EQ, 4712);
	var oCombinedFilter = new this.Filter(this.oMessageHandler, oFilter);
	oCombinedFilter.addAnd(oNextLevelFilter);
	this.request.sendGetInBatch(oCombinedFilter, function() {
	});
	assert.deepEqual(this.uriParts.parameter, {
		p_stringParameter : "%27defaultString%27",
		p_int32Parameter : 4712
	}, 'Three parameters and their values expected');
});
QUnit.test('Parameter values based on metadata and actual filter values (compound filter - three level filter)', function(assert) {
	var testObject = this;
	function createCompound(sParameterValue) {
		var oCompound = new testObject.Filter(testObject.oMessageHandler, 'FilterPropertyOne', this.EQ, 'val1');
		oCompound.addAnd('p_int32Parameter', this.EQ, sParameterValue);
		oCompound.addAnd('FilterPropertyThree', this.EQ, 'val3');
		return oCompound;
	}
	var createCompoundWithBinding = createCompound.bind(this);
	var oFilter = new this.Filter(this.oMessageHandler, createCompoundWithBinding(4711));
	oFilter.addOr(createCompoundWithBinding(4712));
	var oNextLevelFilter = new this.Filter(this.oMessageHandler, createCompoundWithBinding(4713));
	oNextLevelFilter.addOr(createCompoundWithBinding(4714));
	var oCombinedFilter = new this.Filter(this.oMessageHandler, oFilter);
	oCombinedFilter.addAnd(oNextLevelFilter);
	this.request.sendGetInBatch(oCombinedFilter, function() {
	});
	assert.deepEqual(this.uriParts.parameter, {
		p_stringParameter : "%27defaultString%27",
		p_int32Parameter : 4714
	}, 'Three parameters and their values expected');
});
QUnit.test('Filter only contains terms for filterable properties - no parameters', function(assert) {
	this.request = new sap.apf.core.Request(this.oInject, {
		id : "requestForTesting",
		service : 'dummy',
		entityType : 'entityTypeFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
		'prop1' : true,
		'prop2' : true,
		'prop3' : false,
		'prop4' : true
	});
	var oFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	oFilter.addAnd('prop2', this.EQ, 'val2');
	oFilter.addAnd('prop3', this.EQ, 'val3');
	oFilter.addAnd('prop4', this.EQ, 'val4');
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.equal(this.uriParts.filter.getFilterTerms().length, 3, 'Three filter terms expected');
});
QUnit.test('Filter contains invalid values', function(assert) {
	var testObject = this;
	this.request = new sap.apf.core.Request(this.oInject, {
		service : 'dummy',
		entityType : 'entityTypeFilterable',
		selectProperties : []
	});
	this.oMetadataDouble.addParameters('entityTypeFilterable', [ {
		'name' : 'myParam1',
		'nullable' : 'false',
		'dataType' : {
			'type' : 'Edm.Int32'
		},
		'parameter' : 'mandatory'
	} ]);
	var oFilter = new this.Filter(this.oMessageHandler);
	assert.expect(2);
	this.oMessageHandler.putMessage = function(oMessageObject) {
		var sMessageCode = oMessageObject.getCode();
		assert.equal(sMessageCode, "5016", "Message code 5016 as expected");
		throw new Error(sap.apf.core.constants.message.code.suppressFurtherException);
	};
	assert.throws(function() {
		testObject.request.sendGetInBatch(oFilter, function() {
		});
	}, Error, "parameter key property is missing in filter");
});
QUnit.test('All terms removed from filter if there are no filterable properties - no parameters', function(assert) {
	this.request = new sap.apf.core.Request(this.oInject, {
		service : 'dummy',
		entityType : 'entityTypeNothingFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	var oFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	oFilter.addAnd('prop2', this.EQ, 'val2');
	oFilter.addAnd('prop3', this.EQ, 'val3');
	oFilter.addAnd('prop4', this.EQ, 'val4');
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.equal(this.uriParts.filter.getFilterTerms().length, 0, 'No filter terms in reduced filter if there are no filterable properties');
});

QUnit.module('Given sap.apf.activateFilterReduction is deactivated', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			setupCoreAndMessageHandling(this, false);
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
						that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
					},
					getAbsolutePath : function() {
					}
				};
			};
			// set up a test filter called filter
			var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
			oFilter.addOr('prop1', this.EQ, 'val2');
			oFilter.addOr('prop2', this.EQ, 'val1');
			var oNextLevelFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
			oNextLevelFilter.addOr('prop1', this.EQ, 'val2');
			oNextLevelFilter.addOr('prop3', this.EQ, 'any');
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter);
			this.filter.addAnd(oNextLevelFilter);
		},
		saveValues : function(aParameters) {
			this.uriParts.entityType = aParameters[0];
			this.uriParts.selectProperties = aParameters[1];
			this.uriParts.filter = aParameters[2];
			this.uriParts.parameter = aParameters[3];
			this.uriParts.sortingFields = aParameters[4];
			this.uriParts.paging = aParameters[5];
			this.uriParts.format = aParameters[6];
		},
		uriParts : {},
		afterEach : function(assert) {
			jQuery.ajax = this.fnOriginalAjax;
		}
	});
QUnit.test('When calling sendGetInBatch', function(assert) {
		
		this.request = new sap.apf.core.Request(this.oInject, {
			id : "requestForTesting",
			service : 'dummy',
			entityType : 'entityTypeFilterable',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
		this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
			'prop1' : true,
			'prop2' : true,
			'prop3' : false,
			'prop4' : true
		});
		this.request.sendGetInBatch(this.filter, function() {
		});
		assert.equal(this.uriParts.filter.getFilterTerms().length, 5, 'Five filter terms expected');
	});

	

	QUnit.module('Given activateFilterReduction AND(OR(1,2,1),OR(1,2,42))', {
		beforeEach : function(assert) {
			var that = this;
			var activateReductionPerUrlParameter = true;
		
			commonSetup(this);
			setupCoreAndMessageHandling(this, false, activateReductionPerUrlParameter);
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
						that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
					},
					getAbsolutePath : function() {
					}
				};
			};
			// AND(OR(1,2,1),OR(1,2,42))
			var left = new sap.apf.core.utils.Filter(this.oMessageHandler).addOr('A', this.EQ, '1').addOr('A', this.EQ, '2').addOr('A', this.EQ, '1');
			var right = new this.Filter(this.oMessageHandler).addOr('A', this.EQ, '1').addOr('A', this.EQ, '2').addOr('A', this.EQ, '42');
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler).addAnd(left).addAnd(right);
			
			this.request = new sap.apf.core.Request(this.oInject, {
				id : "requestForTesting",
				service : 'dummy',
				entityType : 'entityTypeFilterable',
				selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
			});
			this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
				'A' : true
			});
		},
		saveValues : function(aParameters) {
			this.uriParts.entityType = aParameters[0];
			this.uriParts.selectProperties = aParameters[1];
			this.uriParts.filter = aParameters[2];
			this.uriParts.parameter = aParameters[3];
			this.uriParts.sortingFields = aParameters[4];
			this.uriParts.paging = aParameters[5];
			this.uriParts.format = aParameters[6];
		},
		uriParts : {},
		afterEach : function(assert) {
			jQuery.ajax = this.fnOriginalAjax;
		}
	});
	QUnit.test('WHEN  sap.apf.activateFilterHandling ACTIVATED  .. prove that reduction is being called', function(assert) {
		this.request.sendGetInBatch(this.filter, function() {
		});
		// actually, this test should test that filter simplification has been called, not that it is correct.
		// Since we cannot do this directly and easily, we indirectly test that reduction happened.
		assert.equal(this.uriParts.filter.mapToSapUI5FilterExpression().bAnd, false, 'reduced to OR node');
		assert.equal(this.uriParts.filter.mapToSapUI5FilterExpression().aFilters.length, 2, 'reduced nr of values');
		assert.equal(this.uriParts.filter.mapToSapUI5FilterExpression().aFilters[0].oValue1, '1', 'filter term 0 as expected');
		assert.equal(this.uriParts.filter.mapToSapUI5FilterExpression().aFilters[1].oValue1, '2', 'filter term 1 as expected');
	});

	QUnit.module('Passing metadata to datajs', {
		beforeEach : function(assert) {
			sap.apf.testhelper.mockServer.activateModeler();

			this.oMessageHandler = new sap.apf.core.MessageHandler();
			this.oMessageHandler.activateOnErrorHandling(true);
			this.oMessageHandler.setLifeTimePhaseStartup();
			this.oMessageHandler.setMessageCallback(function () {});
			this.oMessageHandler.loadConfig(sap.apf.core.messageDefinition, true);

			var oInject = {
				instances: {
					messageHandler: this.oMessageHandler,
					startParameter : new sap.apf.utils.StartParameter()
				},
				constructors : {
                    SessionHandler : sap.apf.core.SessionHandler
                }
            };
            this.oCoreApi = new sap.apf.core.Instance(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('datajs parses date', function (assert) {
		var done = assert.async();
		var oInject = {
			instances: {
				messageHandler: this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		};
		var request = new sap.apf.core.Request(oInject, {
			service : '/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata',
			entityType : 'AnalyticalConfigurationQuery',
			selectProperties : [ 'CreationUTCDateTime' ]
		});
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
		request.sendGetInBatch(oFilter, function(arg) {
			assert.ok(arg.data[0].CreationUTCDateTime instanceof Date, "Edm.DateTime is returned as Date Object.");
			done();
		});
	});
}());
