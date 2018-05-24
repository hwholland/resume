/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/*global sap, jQuery sinon, QUnit */
jQuery.sap.declare("sap.apf.testhelper.modelerUIHelper");
sap.apf.testhelper.modelerUIHelper = sap.apf.testhelper.modelerUIHelper || {};
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
sap.apf.testhelper.modelerUIHelper.getInstance = function() {
	var that = this;
	this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	this.appA = {
		ApplicationName : "apf1972-appA",
		SemanticObject : "semObjA"
	};
	this.newConfigId = "newConfig0";
	sap.apf.testhelper.mockServer.activateModeler();
	sap.apf.testhelper.modelerHelper.createApplicationHandler(this, function(appHandler) {
		that.applicationHandler = appHandler;
		var configurationObjectForUnsavedConfig = {
			AnalyticalConfigurationName : "test config A"
		};
		var configurationObjectForSavedConfig = {
			AnalyticalConfigurationName : "test config B"
		};
		var configurationObjectForSavedConfig2 = {
			AnalyticalConfigurationName : "test config C"
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
				"entitySet5" : [ "property3", "property9" ],
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
		that.serviceDataEntityTypes = {
			"testService1" : [ "entityType1", "entityType2" ],
			"testService2" : [ "entityType3" ]
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
				that.tempSavedConfigId2 = that.configurationHandler.setConfiguration(configurationObjectForSavedConfig2);
				//get ConfigurationEditor 
				that.configurationHandler.loadConfiguration(that.tempUnsavedConfigId, function(configurationEditor) {
					that.configurationEditorForUnsavedConfig = configurationEditor;
					that.stubConfigEditorMethods();
					that.createFacetFilters();
					that.categoryIdUnsaved = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig);
					that.categoryIdUnsaved2 = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig2);
					that.stepIdUnsavedWithoutFilterMapping = that.configurationEditorForUnsavedConfig.createStep(that.categoryIdUnsaved);
					that.unsavedStepWithoutFilterMapping = that.configurationEditorForUnsavedConfig.getStep(that.stepIdUnsavedWithoutFilterMapping);
					that.setPropertiesForUnsavedStepWithoutFilterMapping();
					that.createRepresentations();
					that.stepIdUnsavedWithFilterMapping = that.configurationEditorForUnsavedConfig.createStep(that.categoryIdUnsaved);
					that.unsavedStepWithFilterMapping = that.configurationEditorForUnsavedConfig.getStep(that.stepIdUnsavedWithFilterMapping);
					that.setPropertiesForUnsavedStepWithFilterMapping();
					that.createNavTargets();
				});
			});
		});
	});
	this.stubConfigEditorMethods = function() {
		that = this;
		//Returns a list of entity sets given a service
		this.configurationEditorForUnsavedConfig.getAllEntitySetsOfService = function(serviceRoot) {
			var entitySets = [];
			var aServices = Object.keys(that.serviceData);
			aServices.forEach(function(service) {
				if (service === serviceRoot) {
					entitySets = Object.keys(that.serviceData[service]);
				}
			});
			return entitySets;
		};
		//Returns a list of entity types given a service
		this.configurationEditorForUnsavedConfig.getAllEntityTypesOfService = function(serviceRoot) {
			var entityTypes = [];
			var aServices = Object.keys(that.serviceDataEntityTypes);
			aServices.forEach(function(service) {
				if (service === serviceRoot) {
					entityTypes = that.serviceDataEntityTypes[service];
				}
			});
			return entityTypes;
		};
		//Returns all the properties of an entity given service and entity set
		this.configurationEditorForUnsavedConfig.getAllPropertiesOfEntitySet = function(serviceRoot, entitySet) {
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
		this.configurationEditorForUnsavedConfig.getEntityTypeMetadata = function(sServiceRoot, entityType) {
			var metadata;
			return {
				meta : "data",
				getPropertyMetadata : function(sPropertyName) {
					if (sPropertyName === "property2" || sPropertyName === "property3") {
						metadata = {
							"aggregation-role" : "dimension",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"label" : "Dimension" + sPropertyName, // the label should be differnt for all the properties
							"name" : "Dimension"
						};
						return metadata;
					}
					if (sPropertyName === "property4") {
						metadata = {
							"aggregation-role" : "measure",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"name" : "Measure" + sPropertyName
						};
						return metadata;
					}
				}
			};
		};
		this.configurationEditorForUnsavedConfig.getRepresentationTypes = function() {
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
				"id" : "BarChart",
				"constructor" : "sap.apf.ui.representations.barChart",
				"picture" : "sap-icon://horizontal-bar-chart",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "BarChart"
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
		this.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceWithGivenProperties = function(serviceRoot, properties) {
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
		this.configurationEditorForUnsavedConfig.registerService = function(serviceRoot) {
			var bRegistered;
			that.serviceList.forEach(function(service) {
				if (serviceRoot === service) {
					bRegistered = true;
				}
			});
			return bRegistered;
		};
		this.configurationEditorForUnsavedConfig.getAllKnownProperties = function() {
			var aAllKnownProperties = [ "property1", "property2", "property3", "property4" ];
			return aAllKnownProperties;
		};
		this.configurationHandler.loadConfiguration(that.tempSavedConfigId, function(configurationEditor) {
			that.configurationEditorForSavedConfig = configurationEditor;
			that.configurationEditorForSavedConfig.setFilterOption({
				smartFilterBar : true
			});
		});
		this.configurationHandler.loadConfiguration(that.tempSavedConfigId2, function(configurationEditor) {
			that.configurationEditorForSavedConfig2 = configurationEditor;
		});
		this.configurationEditorForSavedConfig.save(function(id, metadata, messageObject) {
			if (messageObject === undefined) {
				that.configIdSaved = id;
				that.configurationEditorForSavedConfig2.save(function(id2, metadata, messageObject) {
					if (messageObject === undefined) {
						that.configIdSaved2 = id2;
						oDeferred.resolve(that);//Deferred object is resolved with the modeler instance once the modeler callbacks are complete
					}
				});
			}
		});
		this.configurationHandler.getTextPool().setText = function(sTitle) {
			return sTitle;
		};
		this.configurationHandler.getTextPool().get = function(key) {
			return {
				TextElementDescription : key
			};
		};
	};
	this.configListViewInstance = function() {
		var getController = function() {
			return {
				"updateSelectedNode" : function(configInfo) {
					//update text on tree node
				},
				"updateConfigTree" : function() {
					//change category for a step
				},
				"updateTree" : function() {
					//prepares tree model
				},
				"updateTitleAndBreadCrumb" : function() {
					//updates title and bread crumb
				},
				"getNavigationTargetName" : function(id) {
					//gets the text for a given nav target id
				},
				"setNavigationTargetName" : function() {
					//sets the text for a given nav target id
				}
			};
		};
		return getController;
	};
	this.updateSelectedNode = function(configInfo) {
		//update text on tree node
	};
	this.updateConfigTree = function() {
		//change category for a step
	};
	this.updateTree = function() {
		//prepares tree model
	};
	this.updateTitleAndBreadCrumb = function() {
		//updates title and bread crumb
	};
	this.getNavigationTargetName = function() {
		var navTargetTextDeferred = new jQuery.Deferred();
		navTargetTextDeferred.resolve("text");
		var navTargetTextPromise = navTargetTextDeferred.promise();
		return navTargetTextPromise;
	};
	this.setNavigationTargetName = function() {
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
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property2");
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property3");
		this.unsavedStepWithoutFilterMapping.addSelectProperty("property4");
		this.removeFilterProperties(this.unsavedStepWithoutFilterMapping);
		this.unsavedStepWithoutFilterMapping.addFilterProperty("property2");
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
	this.createRepresentations = function() {
		this.firstRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRepresentationType("ColumnChart");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property2", "dimension2"); // manual label
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property2", sap.apf.core.constants.representationMetadata.kind.XAXIS);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionTextLabelKey("property2", "dimension2"); //set the label for the dimension
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property3");//default label
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property3", sap.apf.core.constants.representationMetadata.kind.LEGEND);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addMeasure("property4");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setMeasureKind("property4", sap.apf.core.constants.representationMetadata.kind.YAXIS);
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addOrderbySpec("property4", "ascending");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftUpperCornerTextKey("Left top corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightUpperCornerTextKey("Right top corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftLowerCornerTextKey("Left bottom corner from rep");
		this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightLowerCornerTextKey("Right bottom corner from rep");
		this.secondRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
		this.unsavedStepWithoutFilterMapping.getRepresentations()[1].setRepresentationType("ColumnChart");
	};
	this.createNavTargets = function() {
		this.firstNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget();
		this.firstNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.firstNavigationTargetId);
		this.firstNavigationtarget.setSemanticObject("FioriApplication");
		this.firstNavigationtarget.setAction("executeAPFConfiguration");
		this.firstNavigationtarget.setGlobal();
		this.firstNavigationtarget.setFilterMappingService("testService1");
		this.firstNavigationtarget.setFilterMappingEntitySet("entitySet1");
		this.firstNavigationtarget.addFilterMappingTargetProperty("property1");
		this.firstNavigationtarget.addFilterMappingTargetProperty("property3");
		this.secondNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget();
		this.secondNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.secondNavigationTargetId);
		this.secondNavigationtarget.setSemanticObject("UserInputSemanticObject");
		this.secondNavigationtarget.setAction("UserAction");
		this.secondNavigationtarget.setStepSpecific();
	};
	this.createFacetFilters = function() {
		this.configurationEditorForUnsavedConfig.setFilterOption({
			facetFilter : true
		});
		this.facetFilterIdUnsaved = this.configurationEditorForUnsavedConfig.createFacetFilter();
		this.facetFilterUnsaved = this.configurationEditorForUnsavedConfig.getFacetFilter(this.facetFilterIdUnsaved);
		this.facetFilterIdUnsaved2 = this.configurationEditorForUnsavedConfig.createFacetFilter();
		this.facetFilterUnsaved2 = this.configurationEditorForUnsavedConfig.getFacetFilter(this.facetFilterIdUnsaved2);
		this.facetFilterUnsaved.setLabelKey("label1");
		this.facetFilterUnsaved.setMultiSelection(true);
		this.facetFilterUnsaved.setVisible(true);
		this.facetFilterUnsaved.setProperty("property2");
		this.facetFilterUnsaved.setAlias("property3");
		this.facetFilterUnsaved.setPreselectionDefaults([ "1000", "2000" ]);
		this.facetFilterUnsaved.setServiceOfValueHelp("testService1");
		this.facetFilterUnsaved.setEntitySetOfValueHelp("entitySet1");
		this.facetFilterUnsaved.addSelectPropertyOfValueHelp("property1");
		this.facetFilterUnsaved.addSelectPropertyOfValueHelp("property3");
		this.facetFilterUnsaved.setUseSameRequestForValueHelpAndFilterResolution(true);
		this.facetFilterUnsaved2.setLabelKey("label1");
		this.facetFilterUnsaved2.setProperty("property2");
		this.facetFilterUnsaved2.setVisible(true);
	};
	this.deleteObjects = function() {
		this.configurationEditorForUnsavedConfig.removeFacetFilter(this.facetFilterUnsaved);
		this.configurationEditorForUnsavedConfig.removeFacetFilter(this.facetFilterUnsaved2);
		this.configurationEditorForUnsavedConfig.removeNavigationTarget(this.firstNavigationTargetId);
		this.configurationEditorForUnsavedConfig.removeNavigationTarget(this.secondNavigationTargetId);
		this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping).removeRepresentation(this.firstRepresentationIdUnsaved);
		this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping).removeRepresentation(this.secondRepresentationIdUnsaved);
	};
};
var oDeferred = new jQuery.Deferred();//Deferred object to be resolved with the modeler instance
sap.apf.testhelper.modelerUIHelper.getInstance();
sap.apf.testhelper.modelerUIHelper.getModelerInstance = function(fnCallback) {
	oDeferred.then(function(modelerInstance) {//Once the modeler callbacks are done callback to q unit setup to start the tests
		fnCallback(modelerInstance);
	});
};
sap.apf.testhelper.modelerUIHelper.reset = function() {
	this.setPropertiesForUnsavedStepWithoutFilterMapping();
	this.setPropertiesForUnsavedStepWithFilterMapping();
	this.deleteObjects();
	this.createRepresentations();
	this.createFacetFilters();
	this.createNavTargets();
};
sap.apf.testhelper.modelerUIHelper.destroyModelerInstance = function() {
	sap.apf.testhelper.mockServer.deactivate();
};
