/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/*global sap, apf, modeler, core, jQuery, module, test, ok, equal, notEqual, deepEqual, expect, sinon, asyncTest, start, QUnit */
jQuery.sap.declare("sap.apf.modeler.ui.modelerUIHelper");
sap.apf.modeler.ui.modelerUIHelper = sap.apf.modeler.ui.modelerUIHelper || {};
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
sap.apf.modeler.ui.modelerUIHelper.getInstance = function() {
	var that = this;
	this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	this.appA = {
		ApplicationName : "apf1972-appA",
		SemanticObject : "semObjA"
	};
	sap.apf.testhelper.mockServer.activateModeler();
	sap.apf.testhelper.modelerHelper.createApplicationHandler(this, function(appHandler) {
		that.applicationHandler = appHandler;
		var configurationObjectForUnsavedConfig = {
			AnalyticalConfigurationName : "test config A"
		};
		var configurationObjectForSavedConfig = {
			AnalyticalConfigurationName : "test config B"
		};
		var categoryObjForUnsavedConfig = {
			labelKey : "test category A"
		};
		var categoryObjForUnsavedConfig2 = {
			labelKey : "test category B"
		};
		that.serviceList = [ "testService1", "testService2", "testService3", "testService4" ];
		that.serviceData = {
			"testService1" : {
				"entitySet1" : [ "property1", "property2", "property3", "property4" ],
				"entitySet2" : [ "property5", "property6", "property7" ],
				"entitySet3" : [ "property1", "property2", "property3", "property8" ],
				"entitySet4" : [ "property1", "property2", "property6", "property8" ],
				"entitySet5" : [ "property2", "property9" ],
				"entitySet11" : [ "property1", "property9" ],
				"entitySet6" : [ "property1", "property2", "property3", "property9" ],
				"entitySet7" : [ "property1", "property2", "property3", "property10", "property11" ]
			},
			"testService2" : {
				"entitySet8" : [ "property9", "property10", "property11" ]
			},
			"testService3" : {
				"entitySet9" : [ "property1", "property2", "property8" ]
			},
			"testService4" : {
				"entitySet10" : [ "property2", "property13" ]
			}
		};
		//create and save an application
		that.applicationHandler.setAndSave(that.appA, function(id, metadata, messageObject) {
			that.applicationCreatedForTest = id;
			//get configurationHandler
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				that.configurationHandler = configurationHandler;
				that.textPool = configurationHandler.getTextPool();
				that.tempUnsavedConfigId = that.configurationHandler.setConfiguration(configurationObjectForUnsavedConfig);
				that.tempSavedConfigId = that.configurationHandler.setConfiguration(configurationObjectForSavedConfig);
				//get ConfigurationEditor 
				that.configurationHandler.loadConfiguration(that.tempUnsavedConfigId, function(configurationEditor) {
					that.configurationEditorForUnsavedConfig = configurationEditor;
					that.categoryIdUnsaved = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig);
					that.categoryIdUnsaved2 = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig2);
					that.stepIdUnsavedWithoutFilterMapping = that.configurationEditorForUnsavedConfig.createStep(that.categoryIdUnsaved);
					that.unsavedStepWithoutFilterMapping = that.configurationEditorForUnsavedConfig.getStep(that.stepIdUnsavedWithoutFilterMapping);
					that.setPropertiesForUnsavedStepWithoutFilterMapping();
					that.createRepresentation();
					that.stepIdUnsavedWithFilterMapping = that.configurationEditorForUnsavedConfig.createStep(that.categoryIdUnsaved);
					that.unsavedStepWithFilterMapping = that.configurationEditorForUnsavedConfig.getStep(that.stepIdUnsavedWithFilterMapping);
					that.setPropertiesForUnsavedStepWithFilterMapping();
				});
				//Returns a list of entity sets given a service
				that.configurationEditorForUnsavedConfig.getAllEntitySetsOfService = function(serviceRoot) {
					var entitySets = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							entitySets = Object.keys(that.serviceData[service]);
						}
					});
					return entitySets;
				};
				//Returns all the properties of an entity given service and entity set
				that.configurationEditorForUnsavedConfig.getAllPropertiesOfEntitySet = function(serviceRoot, entitySet) {
					var allProperties = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							var entitySets = Object.keys(that.serviceData[service]);
							entitySets.forEach(function(entity) {
								if (entity === entitySet) {
									allProperties = that.serviceData[service][entity];
								}
							});
						}
					});
					return allProperties;
				};
				that.configurationEditorForUnsavedConfig.getEntityTypeMetadata = function(sServiceRoot, entityType) {
					return {
						meta : "data",
						getPropertyMetadata : function(sPropertyName) {
							if (sPropertyName === "property1" || sPropertyName === "property2") {
								metadata = {
									"aggregation-role" : "dimension",
									"dataType" : {
										"maxLength" : "10",
										"type" : "Edm.String"
									},
									"label" : "Dimension",
									"name" : "Dimension"
								};
								return metadata;
							}
							if (sPropertyName === "property3" || sPropertyName === "property4") {
								metadata = {
									"aggregation-role" : "measure",
									"dataType" : {
										"maxLength" : "10",
										"type" : "Edm.String"
									},
									"label" : "Measure",
									"name" : "Measure"
								};
								return metadata;
							}
						}
					};
				};
				that.configurationEditorForUnsavedConfig.getRepresentationTypes = function() {
					return [ {
						"type" : "representationType",
						"id" : "ColumnChart",
						"constructor" : "sap.apf.ui.representations.columnChart",
						"picture" : "sap-icon://bar-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "ColumnChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
									"min" : "1",
									"max" : "*"
								}, {
									"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
									"min" : "0",
									"max" : "*"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
									"min" : "1",
									"max" : "*"
								} ]
							}
						}
					}, {
						"type" : "representationType",
						"id" : "BubbleChart",
						"constructor" : "sap.apf.ui.representations.bubbleChart",
						"picture" : "sap-icon://bubble-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "BubbleChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR,
									"min" : "1",
									"max" : "*"
								}, {
									"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE,
									"min" : "0",
									"max" : "*"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
									"min" : "1",
									"max" : "1"
								}, {
									"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
									"min" : "1",
									"max" : "1"
								}, {
									"kind" : sap.apf.core.constants.representationMetadata.kind.BUBBLEWIDTH,
									"min" : "1",
									"max" : "1"
								}, {
									"kind" : sap.apf.core.constants.representationMetadata.kind.BUBBLEHEIGHT,
									"min" : "0",
									"max" : "1"
								} ]
							},
							"sortable" : false
						}
					} ];
				};
				//Returns all the entity sets which have the same properties that are passed in a particular service
				that.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceWithGivenProperties = function(serviceRoot, properties) {
					var entitySets = [];
					var counter;
					var length = properties.length;
					var allEntitySets = [];
					var aServices = Object.keys(that.serviceData);
					if (length === 0) {
						entitySets = that.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(serviceRoot);
						return entitySets;
					}
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							entitySets = that.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(serviceRoot);
							entitySets.forEach(function(entitySet) {
								counter = 0;
								var allProperties = that.configurationEditorForUnsavedConfig.getAllPropertiesOfEntitySet(serviceRoot, entitySet);
								allProperties.forEach(function(propertyForEntity) {
									properties.forEach(function(property) {
										if (propertyForEntity === property) {
											counter++;
										}
									});
									if (counter === length) {
										allEntitySets.push(entitySet);
									}
								});
							});
						}
					});
					return allEntitySets;
				};
				that.configurationEditorForUnsavedConfig.registerService = function(serviceRoot) {
					var bRegistered;
					that.serviceList.forEach(function(service) {
						if (serviceRoot === service) {
							bRegistered = true;
						}
					});
					return bRegistered;
				};
				that.configurationHandler.loadConfiguration(that.tempSavedConfigId, function(configurationEditor) {
					that.configurationEditorForSavedConfig = configurationEditor;
				});
				that.configurationEditorForSavedConfig.save(function(id, metadata, messageObject) {
					if (messageObject === undefined) {
						that.configIdSaved = id;
					}
				});
				that.configurationHandler.getTextPool().setText = function(sTitle) {
					return sTitle;
				};
				that.configurationHandler.getTextPool().get = function(key) {
					return {
						TextElementDescription : key
					};
				};
			});
		});
	});
	this.configListViewInstance = function() {
		var getController = function() {
			return {
				"updateSelectedNode" : function(configInfo) {
					var oConfigInfo = configInfo;
					//update text on tree node
				},
				"updateConfigTree" : function() {
					var doNothing;
					//change category for a step
				},
				"updateTree" : function() {
					var doNothing;
					//prepares tree model
				},
				"updateTitleAndBreadCrumb" : function() {
					var doNothing;
					//updates title and bread crumb
				}
			};
		};
		return getController;
	};
	this.updateSelectedNode = function(configInfo) {
		var oConfigInfo = configInfo;
		//update text on tree node
	};
	this.updateConfigTree = function() {
		var doNothing;
		//change category for a step
	};
	this.updateTree = function() {
		var doNothing;
		//prepares tree model
	};
	this.updateTitleAndBreadCrumb = function() {
		var doNothing;
		//updates title and bread crumb
	};
	this.removeAllSelectProperties = function(step) {
		var selectProp = step.getSelectProperties();
		selectProp.forEach(function(property) {
			step.removeSelectProperty(property);
		});
	};
	this.removeFilterProperties = function(step) {
		var filterProp = step.getFilterProperties();
		filterProp.forEach(function(property) {
			step.removeFilterProperty(property);
		});
	};
	this.removeFilterMappingTargetProperties = function(step) {
		var filterMappingSelectProp = step.getFilterMappingTargetProperties();
		filterMappingSelectProp.forEach(function(property) {
			step.removeFilterMappingTargetProperty(property);
		});
	};
	this.setPropertiesForUnsavedStepWithoutFilterMapping = function() {
		//First unsaved step - without filter mapping
		this.unsavedStepWithoutFilterMapping.setTitleId("step A");
		this.unsavedStepWithoutFilterMapping.setLongTitleId("step A long title");
		this.unsavedStepWithoutFilterMapping.setService("testService1");
		this.unsavedStepWithoutFilterMapping.setEntitySet("entitySet1");
		this.removeAllSelectProperties(this.unsavedStepWithoutFilterMapping);
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property1");
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property2");
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property3");
		this.removeFilterProperties(this.unsavedStepWithoutFilterMapping);
		this.unsavedStepWithoutFilterMapping.addFilterProperty("property1");
		this.unsavedStepWithoutFilterMapping.setLeftUpperCornerTextKey("Left top corner");
		this.unsavedStepWithoutFilterMapping.setRightUpperCornerTextKey("Right top corner");
		this.unsavedStepWithoutFilterMapping.setLeftLowerCornerTextKey("Left bottom corner");
		this.unsavedStepWithoutFilterMapping.setRightLowerCornerTextKey("Right bottom corner");
	};
	this.setPropertiesForUnsavedStepWithFilterMapping = function() {
		//Second unsaved step - with filter mapping
		this.unsavedStepWithFilterMapping.setTitleId("step B");
		this.unsavedStepWithFilterMapping.setLongTitleId("step B long title");
		this.unsavedStepWithFilterMapping.setService("testService1");
		this.unsavedStepWithFilterMapping.setEntitySet("entitySet1");
		this.removeAllSelectProperties(this.unsavedStepWithFilterMapping);
		this.unsavedStepWithFilterMapping.addSelectProperty("property1");
		this.unsavedStepWithFilterMapping.addSelectProperty("property2");
		this.unsavedStepWithFilterMapping.addSelectProperty("property3");
		this.removeFilterProperties(this.unsavedStepWithFilterMapping);
		this.unsavedStepWithFilterMapping.addFilterProperty("property1");
		this.unsavedStepWithFilterMapping.setFilterMappingService("testService1");
		this.unsavedStepWithFilterMapping.setFilterMappingEntitySet("entitySet3");
		this.removeFilterMappingTargetProperties(this.unsavedStepWithFilterMapping);
		this.unsavedStepWithFilterMapping.addFilterMappingTargetProperty("property8");
		this.unsavedStepWithFilterMapping.setFilterMappingKeepSource(true);
	};
	this.createRepresentation = function() {
		this.firstRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRepresentationType("ColumnChart");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property1", "dimension1");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property1", sap.apf.core.constants.representationMetadata.kind.XAXIS);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property2", "dimension2");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property2", sap.apf.core.constants.representationMetadata.kind.LEGEND);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addMeasure("property3", "measure1");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setMeasureKind("property3", sap.apf.core.constants.representationMetadata.kind.YAXIS);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addOrderbySpec("property3", "ascending");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftUpperCornerTextKey("Left top corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightUpperCornerTextKey("Right top corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftLowerCornerTextKey("Left bottom corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightLowerCornerTextKey("Right bottom corner from rep");
	};
	return this;
};
var oModelerInstance = sap.apf.modeler.ui.modelerUIHelper.getInstance();
sap.apf.modeler.ui.modelerUIHelper.getModelerInstance = function() {
	return oModelerInstance;
};
sap.apf.modeler.ui.modelerUIHelper.reset = function() {
	this.setPropertiesForUnsavedStepWithoutFilterMapping();
	this.setPropertiesForUnsavedStepWithFilterMapping();
};
sap.apf.modeler.ui.modelerUIHelper.destroyModelerInstance = function() {
	sap.apf.testhelper.mockServer.deactivate();
};
