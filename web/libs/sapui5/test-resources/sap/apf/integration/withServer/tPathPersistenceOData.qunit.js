jQuery.sap.declare("sap.apf.tests.integration.withServer.tPathPersistence");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.config.configurationForIntegrationTesting');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.api');

module('Path serialization/deserialization via SerializationMediator', {
	setup : function(){
		QUnit.stop();
		var that = this;
		var component = {
				getComponentData: function() {
					return {
						startupParameters: {}
					};
				}
		};
		function Probe(dependencies) {
			that.coreApi = dependencies.coreApi;
			that.serializationMediator = dependencies.serializationMediator;
			that.pathContextHandler = dependencies.pathContextHandler;
		}
		this.api = new sap.apf.Api(component, {
			probe: Probe
		});
		
        this.coreApi.activateOnErrorHandling(true);
        this.coreApi.loadApplicationConfig("/apf-test/test-resources/sap/apf/integration/withServer/integrationTestingApplicationConfiguration.json");
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			var oFilter = this.defineFilter({
				'SAPClient' : '777'
			});
			this.coreApi.setContext(oFilter);
			QUnit.start();
		}.bind(this));
	}, 
	defineFilter : function(filters) {
		var oFilter = this.coreApi.createFilter();
		var oExpression = undefined;
		var property = undefined;
		for(property in filters) {
			oExpression = {
				name : property,
				operator : sap.apf.core.constants.FilterOperators.EQ,
				value : filters[property]
			};
			oFilter.getTopAnd().addExpression(oExpression);
		}
		return oFilter;
	},
	createThreeSteps : function() {
		this.oStep1 = this.coreApi.createStep("stepTemplate1", function() {});
		this.oStep2 = this.coreApi.createStep("stepTemplate1", function() {});
		this.oStep3 = this.coreApi.createStep("stepTemplate1", function() {});
	},
	selectionOnSecondStep : function() {
		var aSteps = this.coreApi.getSteps();
		var oStepToChangeSelection = aSteps[1];
		var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
		oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
		this.coreApi.updatePath(function() {});
	},
	teardown : function(){
		this.serializationMediator.readPaths(callbackRead.bind(this));
		function callbackRead(oResponse) {
			for(var i in oResponse.paths) {
				this.coreApi.deletePath(oResponse.paths[i].AnalysisPath, function(oResponse, oEntityMetadata, oMessageObject){
					if (oMessageObject !== undefined) {
						throw new Error("no error during path deletion"); 
					}
				});
			}
		}
	}
});

asyncTest('Save an empty path', function() {
	expect(3);
	var sPathId;
	this.serializationMediator.savePath("myEmptyPath", callbackSave.bind(this));
	function callbackSave(oResponse) {
		sPathId = oResponse.AnalysisPath;
		this.coreApi.resetPath();
		this.serializationMediator.openPath(sPathId, callbackOpen.bind(this));
	}
	function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
		var oExpected = {
				"path" : {
					"indicesOfActiveSteps" : [],
					"steps" : []
				}
		};
		deepEqual(oResponse.path.SerializedAnalysisPath, oExpected, "Serialized analysis path returned as expected");
		equal(this.coreApi.getSteps().length, 0, "Empty path expected");
		deepEqual(this.coreApi.getActiveStep(), undefined, "No active step exists");
		start();
	}
});

asyncTest("Path with 3 steps, selection on second step and filter set via PathContextHandler", function() {
	expect(6);
	this.pathContextHandler.update("myFilter", this.defineFilter({'myFilterProperty' : 'default'}));
	this.createThreeSteps();
	this.coreApi.setActiveStep(this.oStep2);
	this.selectionOnSecondStep();
	var sPathId;
	
	var aExptectedPath = [this.oStep1.serialize(), this.oStep2.serialize(), this.oStep3.serialize()];
	
	this.serializationMediator.savePath("myNewPath", callbackSave.bind(this));
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		deepEqual(oEntityTypeMetadata.type, "entityTypeMetadata", "Correct type of metadata");
		deepEqual(oMessageObject, undefined, "Message object expected undefined");
		sPathId = oResponse.AnalysisPath;
		
		this.pathContextHandler.update("myFilter", this.defineFilter({'myFilterProperty' : 'changed'}));
		
		this.serializationMediator.openPath(sPathId, callbackOpen.bind(this));
	}
	function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
		this.coreApi.updatePath(function() {});
		var aSerializedPath = [this.coreApi.getSteps()[0].serialize(), this.coreApi.getSteps()[1].serialize(), this.coreApi.getSteps()[2].serialize()];
		
		deepEqual(aSerializedPath, aExptectedPath, "Opened path equal with saved path");
		deepEqual(this.coreApi.getActiveStep(), this.oStep2, "Second step is active");
		notEqual(this.coreApi.getActiveStep(), this.oStep2,	"Different instances");
		equal(this.pathContextHandler.get("myFilter").getInternalFilter().toUrlParam(), "(myFilterProperty%20eq%20%27default%27)", "Changed filter in PathContextHandler successfully restored");
		start();
	}
});

asyncTest("Modification of stored path", function() {
	expect(3);
	var sPathId;
	this.createThreeSteps();
	
	this.serializationMediator.savePath("myNewPath", callbackSave.bind(this));
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		deepEqual(oMessageObject, undefined, "Expected undefined oMessageObject");
		if (oResponse.AnalysisPath) {
			sPathId = oResponse.AnalysisPath;
			this.coreApi.removeStep(this.oStep2, function() {});
			this.serializationMediator.savePath(sPathId, "myNewPathModified", callbackModify.bind(this));
		}
	}
	function callbackModify(oResponse) {
		this.serializationMediator.readPaths(callbackRead.bind(this));
	}
	function callbackRead(oResponse) {
		for ( var path in oResponse.paths) {
			if (oResponse.paths[path].AnalysisPath === sPathId) {
				equal(oResponse.paths[path].StructuredAnalysisPath.steps.length, 2, 'Modified path has two steps');
				equal(oResponse.paths[path].AnalysisPathName, "myNewPathModified", 'Modified name expected');
				start();
			}
		}
	}
});
asyncTest("Deletion of stored path", function() {
	expect(1);
	var calledFirstTime = true;
	var s2ndPathId, nSaveCounter = 1;
	var bPathFound = false;
	this.createThreeSteps();
	this.serializationMediator.savePath("myFirstPath", callbackSave.bind(this));
	this.serializationMediator.savePath("mySecondPath", callbackSave.bind(this));
	this.serializationMediator.savePath("myThirdPath", callbackSave.bind(this));
	function callbackSave(oResponse) {
		switch (nSaveCounter) {
			case 2:
				s2ndPathId = oResponse.AnalysisPath;
				break;
			case 3:
				this.serializationMediator.deletePath(s2ndPathId, callbackDelete.bind(this));
				break;
		}
		nSaveCounter++;
	}
	function callbackDelete() {
		this.serializationMediator.readPaths(callbackRead);
	}
	function callbackRead(aPaths) {
		for( var i in aPaths) {
			if (aPaths[i].AnalysisPath === s2ndPathId) {
				bPathFound = true;
			}
		}
		ok(!bPathFound, "Path not found as expected");
		if (calledFirstTime) {
			start();
			calledFirstTime = false;
		}
	}
});
asyncTest("Save path with analytical config id in start parameter", function() {
	expect(2);
	var that = this;
	setConfigIdToParameter("configId1");
	var sPathIdOfConfig1;
	var sPathIdOfConfig2;
	var pathWithConfig1Included = false;
	var pathWithConfig2Included = false;
	
	this.serializationMediator.savePath("myPathWithConfig1", callbackFirstSave);
	function callbackFirstSave(oResponse) {
		sPathIdOfConfig1 = oResponse.AnalysisPath;
		that.coreApi.resetPath();
		setConfigIdToParameter("configId2");
		that.serializationMediator.savePath("myPathWithConfig2", callbackSecondSave);
	}
	function callbackSecondSave(oResponse) {
		sPathIdOfConfig2 = oResponse.AnalysisPath;
		that.coreApi.resetPath();
		that.serializationMediator.readPaths(callbackRead);
	}
	function callbackRead(oResponse, oEntityTypeMetadata, oMessageObject) {
		var paths = oResponse.paths;
		paths.forEach(function(path) {
			if(path.AnalysisPath === sPathIdOfConfig1) {
				pathWithConfig1Included = true;
			}
			if(path.AnalysisPath === sPathIdOfConfig2) {
				pathWithConfig2Included = true;
			}
		});
		ok(!pathWithConfig1Included, "Path with config id 1 not included");
		ok(pathWithConfig2Included, "Path with config id 2 included");
		start();
	}
	
	function setConfigIdToParameter(configId) {
		that.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return configId;
				}
			};
		};
	}
});
asyncTest("Check server response of all persistence functions ", function() {
	expect(28);
	var pathId;
	this.createThreeSteps();
	
	this.serializationMediator.savePath("myCreatePath", callbackSave.bind(this));
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		ok(oResponse !== undefined, "CREATE: Contains data");
		ok(oResponse.AnalysisPath !== undefined, "CREATE: Contains analysis path ID");
		
		ok(oMessageObject === undefined, "CREATE: Contains no oMessageObject");
		ok(oEntityTypeMetadata !== undefined, "CREATE: Metadata exists");
		ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "CREATE: Entity type metadata exists");
		ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "CREATE: Property metadata exists");
			
		pathId = oResponse.AnalysisPath;
		this.serializationMediator.savePath(pathId, "myModifyPath", callbackModify.bind(this));
	}
	function callbackModify(oResponse, oEntityTypeMetadata, oMessageObject) {
	
		ok(oResponse.AnalysisPath, "MODIFY: Contains no data");
		equal(oResponse.status, "successful", "correct status");
		ok(oMessageObject === undefined, "MODIFY: Contains no oMessageObject");
		ok(oEntityTypeMetadata !== undefined, "MODIFY: Metadata exists");
		ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "MODIFY: Entity type metadata exists");
		ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "MODIFY: Property metadata exists");
			
		this.serializationMediator.readPaths(callbackRead.bind(this));
	}
	function callbackRead(oResponse, oEntityTypeMetadata, oMessageObject) {

		ok(oResponse !== undefined, "READ: Contains data");
		ok(oResponse.paths instanceof Array, "READ: data result is array");
		ok(oMessageObject === undefined, "READ: Contains no oMessageObject");
		ok(oEntityTypeMetadata !== undefined, "READ: Metadata exists");
		ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "READ: Entity type metadata exists");
		ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "READ: Property metadata exists");
			
		this.serializationMediator.openPath(pathId, callbackOpen.bind(this));
	}
	function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {

		ok(oResponse !== undefined, "OPEN: Contains data");
		ok(oMessageObject === undefined, "OPEN: Contains no oMessageObject");
		ok(oEntityTypeMetadata !== undefined, "OPEN: Metadata exists");
		ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "OPEN: Entity type metadata exists");
		ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "OPEN: Property metadata exists");
			
		this.serializationMediator.deletePath(pathId, callbackDelete.bind(this));
	}
	function callbackDelete(oResponse, oEntityTypeMetadata, oMessageObject) {
	
		equal(oResponse.status, "successful", "DELETE: correct status");
		ok(oMessageObject === undefined, "DELETE: Contains no oMessageObject");
		ok(oEntityTypeMetadata !== undefined, "DELETE: Metadata exists");
		ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "DELETE: Entity type metadata exists");
		ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "DELETE: Property metadata exists");
			
		start();
	}
	
});
asyncTest("Open path with invalid ID", function() {
	this.serializationMediator.openPath("myInvalidPathID", callbackOpen);
	function callbackOpen(oResponse, oMetadata, oMessageObject) {
	    var messageCode;
	    if(oMessageObject) {
	           messageCode = oMessageObject.getPrevious().getCode(); 
	    }
	    deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
	    start();
	}
});
asyncTest("Modification with invalid ID", function() {
	this.serializationMediator.savePath("myInvalidPathID", "myNewPath", callbackModify);
	function callbackModify(oResponse, oMetadata, oMessageObject) {
	    var messageCode;
	    if(oMessageObject) {
	           messageCode = oMessageObject.getCode(); 
	    }
	    deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
	    start();
	}
});
asyncTest("Deletion with invalid ID", function() {
	this.serializationMediator.deletePath("myInvalidPathID", callbackDelete);
	function callbackDelete(oResponse, oMetadata, oMessageObject) {
	    var messageCode;
	    if(oMessageObject) {
	           messageCode = oMessageObject.getCode(); 
	    }
	    deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
	    start();
	}
});
asyncTest("Number of steps reached", function() {
	var nConstNumberOfSteps = 32;
	for( var i = 0; i < (nConstNumberOfSteps + 1); i++) {
		this.coreApi.createStep("stepTemplate1", function() {});
	}
	this.serializationMediator.savePath("myLongPath", callbackSave);
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		var sCode;
		ok(oMessageObject, "Error detected");
		if (oMessageObject) {
			sCode = oMessageObject.getCode();
		}
		equal(sCode, "5204", "Correct error code received from callback");
		start();
	}
});
asyncTest("Save and open path with umlaut in name", function() {
	var sPathId;
	
	this.serializationMediator.savePath("myÜmlautPath", callbackSave.bind(this));
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		sPathId = oResponse.AnalysisPath;
		this.serializationMediator.openPath(sPathId, callbackOpen.bind(this));
	}
	function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
		deepEqual(oResponse.path.AnalysisPathName, "myÜmlautPath", "saved path with umlaut name correct opened");
		start();
	}
});
asyncTest("Maximum lenght of path name exceeded (101 characters)", function() {
	var sTooLongName = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma";
	
	this.serializationMediator.savePath(sTooLongName, callbackSave.bind(this));
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		ok(oMessageObject, "Message Object thrown");
		start();
	}
});

////TODO: EG: Test is too expensive to let it run repeatedly due to creation of 256 paths. Test should be run if necessary (e.g. changes on HANA or migration to NW Gateway)
//asyncTest("Maximum number of paths reached", function() {
//	expect(2);
//	
//	function formatNumber(number) { //format to three-digit number since HANA preview sorts incorrectly
//		var tmp = number + '';
//		while (tmp.length < 3)
//			tmp = '0' + tmp;
//		return tmp;
//	}
//	
//	var i = 0;
//	var nConstNumberOfPaths = 256;
//	var formattedNumber = formatNumber(0);
//	
//	this.serializationMediator.savePath("myPath Number " + formattedNumber, callbackSave.bind(this));
//	
//	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
//		i++;
//		if (i <= nConstNumberOfPaths) {
//			formattedNumber = formatNumber(i);
//			this.serializationMediator.savePath("myPath Number " + formattedNumber, callbackSave.bind(this));
//			return;
//		}
//		var sCode;
//		ok(oMessageObject, "Error detected");
//		if (oMessageObject) {
//			sCode = oMessageObject.getCode();
//		}
//		equal(sCode, "5205", "Correct error code received");
//		start();
//	}
//});
