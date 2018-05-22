jQuery.sap.declare("test.sap.apf.core.tPathUpdate");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.path");

(function() {
	'use strict';

	/* globals setTimeout console */
	var StepDoubleStandardMethods = {
		update : function(oFilter, fnCallback) {
		},
		setData : function(oData) {
		},
		getFilter : function() {
			return new sap.apf.core.utils.Filter();
		},
		determineFilter : function(oCumulatedFilter, callbackToPath) {
			callbackToPath(this.getFilter());
		}
	};
	QUnit.module('Iterate over steps with synchronous callback', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.StepDouble.prototype = StepDoubleStandardMethods;
			this.oStep1 = new this.StepDouble(this, 'step 1', assert);
			this.oStep2 = new this.StepDouble(this, 'step 2', assert);
			this.oStep3 = new this.StepDouble(this, 'step 3', assert);
		},
		StepDouble : function(oTestContext, sName, assert) {
			this.oTestContext = oTestContext;
			this.name = sName;
			this.updateWasCalled = false;
			this.setDataWasCalled = false;
			this.update = function(oFilter, fnCallback) {
				this.assertPreviousStepFinished();
				this.updateWasCalled = true;
				fnCallback();
			};
			this.setData = function(oData) {
				if (this.updateWasCalled) {
					this.setDataWasCalled = true;
				}
			};
			this.assertPreviousStepFinished = function() {
				var steps = this.oTestContext.oPath.getSteps();
				var previousStep = steps[steps.indexOf(this) - 1];
				if (previousStep) {
					assert.ok(previousStep.updateWasCalled, 'Update on ' + this.name + ' requires that ' + previousStep.name + ' has already been updated');
					assert.ok(previousStep.setDataWasCalled, 'SetData on ' + this.name + ' requires that data has already been set on ' + previousStep.name);
				}
			};
		},
		addThreeStepsToPath : function() {
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
		}
	});
	QUnit.test('Path iterates over steps by callback', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.update(function() {
		});
		assert.ok(this.oStep1.updateWasCalled, "Update of 1st step was called");
		assert.ok(this.oStep2.updateWasCalled, "Update of 2nd step was called");
		assert.ok(this.oStep3.updateWasCalled, "Update of 3rd step was called");
	});
	QUnit.test('Method setData called after method update', function(assert) {
		this.addThreeStepsToPath();
		this.oPath.update(function() {
		});
		assert.ok(this.oStep1.setDataWasCalled, "Set data of 1st was called");
		assert.ok(this.oStep2.setDataWasCalled, "Set data of 2nd was called");
		assert.ok(this.oStep3.setDataWasCalled, "Set data of 3rd was called");
	});
	QUnit.module('Iterate over steps with asynchronous callback', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.StepDouble.prototype = StepDoubleStandardMethods;
		},
		StepDouble : function(sName) {
			var aTimeout = [];
			this.name = sName;
			this.logOfDataSetByPath = [];
			this.addTimeoutToTimeoutQueue = function(nTimeout) {
				aTimeout.push(nTimeout);
			};
			this.update = function(oFilter, fnCallback) {
				var nTimeOutInCallOrder = aTimeout.shift();
				setTimeout(function() {
					fnCallback(nTimeOutInCallOrder);
				}, nTimeOutInCallOrder);
			};
			this.setData = function(oData) {
				this.logOfDataSetByPath.push(oData);
			};
			this.getCallbackDataSetViaPath = function() {
				return this.logOfDataSetByPath;
			};
		},
		addStepToPath : function() {
			this.oStep1 = new this.StepDouble('step 1');
			this.oPath.addStep(this.oStep1, function() {
			});
		},
		addTwoStepsToPath : function() {
			this.addStepToPath();
			this.oStep2 = new this.StepDouble('step 2');
			this.oPath.addStep(this.oStep2, function() {
			});
		},
		addThreeStepsToPath : function() {
			this.addTwoStepsToPath();
			this.oStep3 = new this.StepDouble('step 3');
			this.oPath.addStep(this.oStep3, function() {
			});
		},
		addFourStepsToPath : function() {
			this.addThreeStepsToPath();
			this.oStep4 = new this.StepDouble('step 4');
			this.oPath.addStep(this.oStep4, function() {
			});
		}
	});
	QUnit.test('One step updated twice - 2nd update returns last', function(assert) {
		var done = assert.async();
		assert.expect(1);
		this.addStepToPath();
		this.oStep1.addTimeoutToTimeoutQueue(25);
		this.oPath.update(stepProcessedCallback);
		this.oStep1.addTimeoutToTimeoutQueue(50);
		this.oPath.update(stepProcessedCallback);
		function stepProcessedCallback(oStep) {
			assert.equal(oStep.getCallbackDataSetViaPath()[0], 50, 'Only timeout of 2nd update processed');
			done();
		}
	});
	QUnit.test('One step updated twice - 2nd update returns first', function(assert) {
		var done = assert.async();
		assert.expect(1);
		this.addStepToPath();
		this.oStep1.addTimeoutToTimeoutQueue(50);
		this.oPath.update(stepProcessedCallback);
		this.oStep1.addTimeoutToTimeoutQueue(25);
		this.oPath.update(stepProcessedCallback);
		function stepProcessedCallback(oStep) {
			assert.equal(oStep.getCallbackDataSetViaPath()[0], 25, 'Only timeout of 2nd update processed');
			done();
		}
	});
	QUnit.test('Two subsequent updates on two steps ', function(assert) {
		var done = assert.async();
		var callbackCounter = 0;
		assert.expect(2);
		this.addTwoStepsToPath();
		this.oStep1.addTimeoutToTimeoutQueue(21);
		this.oStep2.addTimeoutToTimeoutQueue(22);
		this.oStep1.addTimeoutToTimeoutQueue(51);
		this.oStep2.addTimeoutToTimeoutQueue(52);
		this.oPath.update(stepProcessedCallback);
		this.oPath.update(stepProcessedCallback);
		function stepProcessedCallback(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1') {
				assert.equal(oStep.getCallbackDataSetViaPath()[0], 51, 'Only timeout of 2nd update processed');
			}
			if (oStep.name === 'step 2') {
				assert.equal(oStep.getCallbackDataSetViaPath()[0], 22, 'Only 1st timeout of 2nd step processed - triggered by "1st step" during 2nd update');
			}
			if (callbackCounter === 2) {
				done();
			}
		}
	});
	QUnit.test('Delay between two updates on three steps - 2nd update triggered after 2nd step of 1st update', function(assert) {
		var done = assert.async();
		var callbackCounter = 0;
		assert.expect(5);
		this.addThreeStepsToPath();
		this.oStep1.addTimeoutToTimeoutQueue(21);
		this.oStep2.addTimeoutToTimeoutQueue(22);
		this.oStep1.addTimeoutToTimeoutQueue(51);
		this.oStep2.addTimeoutToTimeoutQueue(52);
		this.oStep3.addTimeoutToTimeoutQueue(53);
		this.oPath.update(stepProcessedCallback.bind(this));
		function stepProcessedCallback(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1') {
				switch (callbackCounter) {
					case 1:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 21, '1st step of 1st update processed');
						break;
					case 3:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 51, '1st step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 2') {
				switch (callbackCounter) {
					case 2:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 22, '2nd step of 1st update processed');
						this.oPath.update(stepProcessedCallback);
						break;
					case 4:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 52, '2nd step of 2nd update processed');
						
				}
			}
			if (oStep.name === 'step 3') {
				switch (callbackCounter) {
					case 5:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 53, '3rd step of 2nd update processed');
				}
			}
			if (callbackCounter === 5) {
				done();
			}
		}
	});
	QUnit.test('Delay between two updates on four steps - 2nd update triggered after 2nd step of 1st update', function(assert) {
		var done = assert.async();
		var callbackCounter = 0;
		assert.expect(6);
		this.addFourStepsToPath();
		this.oStep1.addTimeoutToTimeoutQueue(21);
		this.oStep2.addTimeoutToTimeoutQueue(22);
		this.oStep4.addTimeoutToTimeoutQueue(24);
		this.oStep1.addTimeoutToTimeoutQueue(51);
		this.oStep2.addTimeoutToTimeoutQueue(52);
		this.oStep3.addTimeoutToTimeoutQueue(53);
		this.oStep4.addTimeoutToTimeoutQueue(54);
		this.oPath.update(stepProcessedCallback.bind(this));
		function stepProcessedCallback(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1') {
				switch (callbackCounter) {
					case 1:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 21, '1st step of 1st update processed');
						break;
					case 3:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 51, '1st step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 2') {
				switch (callbackCounter) {
					case 2:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 22, '2nd step of 1st update processed');
						this.oPath.update(stepProcessedCallback);
						break;
					case 4:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 52, '2nd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 3') {
				switch (callbackCounter) {
					case 5:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 53, '3rd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 4') {
				switch (callbackCounter) {
					case 6:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 24, '4th step of 2nd update processed');
				}
			}
			if (callbackCounter === 6) {
				done();
			}
		}
	});
	QUnit.test('Delay between two updates on four steps - 2nd update triggered after 3rd step of 1st update', function(assert) {
		var done = assert.async();
		var callbackCounter = 0;
		assert.expect(7);
		this.addFourStepsToPath();
		this.oStep1.addTimeoutToTimeoutQueue(21);
		this.oStep2.addTimeoutToTimeoutQueue(22);
		this.oStep3.addTimeoutToTimeoutQueue(23);
		this.oStep1.addTimeoutToTimeoutQueue(51);
		this.oStep2.addTimeoutToTimeoutQueue(52);
		this.oStep3.addTimeoutToTimeoutQueue(53);
		this.oStep4.addTimeoutToTimeoutQueue(54);
		this.oPath.update(stepProcessedCallback.bind(this));
		function stepProcessedCallback(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1') {
				switch (callbackCounter) {
					case 1:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 21, '1st step of 1st update processed');
						break;
					case 4:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 51, '1st step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 2') {
				switch (callbackCounter) {
					case 2:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 22, '2nd step of 1st update processed');
						break;
					case 5:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 52, '2nd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 3') {
				switch (callbackCounter) {
					case 3:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 23, '3rd step of 2nd update processed');
						this.oPath.update(stepProcessedCallback);
						break;
					case 6:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 53, '3rd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 4') {
				switch (callbackCounter) {
					case 7:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 54, '4th step of 2nd update processed');
				}
			}
			if (callbackCounter === 7) {
				done();
			}
		}
	});
	QUnit.test('Delay between two updates on four steps - 1st update process slower', function(assert) {
		var done = assert.async();
		var callbackCounter = 0;
		assert.expect(6);
		this.addFourStepsToPath();
		this.oStep1.addTimeoutToTimeoutQueue(51);
		this.oStep2.addTimeoutToTimeoutQueue(52);
		this.oStep1.addTimeoutToTimeoutQueue(21);
		this.oStep2.addTimeoutToTimeoutQueue(22);
		this.oStep3.addTimeoutToTimeoutQueue(23);
		this.oStep4.addTimeoutToTimeoutQueue(24);
		this.oPath.update(stepProcessedCallback.bind(this));
		function stepProcessedCallback(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1') {
				switch (callbackCounter) {
					case 1:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 51, '1st step of 1st update processed');
						break;
					case 3:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 21, '1st step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 2') {
				switch (callbackCounter) {
					case 2:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 52, '2nd step of 1st update processed');
						this.oPath.update(stepProcessedCallback);
						break;
					case 4:
						assert.equal(oStep.getCallbackDataSetViaPath()[1], 22, '2nd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 3') {
				switch (callbackCounter) {
					case 5:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 23, '3rd step of 2nd update processed');
				}
			}
			if (oStep.name === 'step 4') {
				switch (callbackCounter) {
					case 6:
						assert.equal(oStep.getCallbackDataSetViaPath()[0], 24, '4th step of 2nd update processed');
				}
			}
			if (callbackCounter === 6) {
				done();
			}
		}
	});
	QUnit.module('Interleave semantic path update', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.StepDouble.prototype = StepDoubleStandardMethods;
			this.oStep1 = new this.StepDouble(this, 'step 1');
			this.oStep2 = new this.StepDouble(this, 'step 2');
			this.oStep3 = new this.StepDouble(this, 'step 3');
			this.oStep4 = new this.StepDouble(this, 'step 4');
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.addStep(this.oStep3, function() {
			});
			this.oPath.addStep(this.oStep4, function() {
			});
			this.aStepUpdateCount = [];
		},
		StepDouble : function(oTestContext, sName) {
			this.pathEnv = oTestContext.oPath;
			this.oTestContext = oTestContext;
			this.name = sName;
		}
	});
	QUnit.test('Update path with four steps using interleave semantic', function(assert) {
		var done = assert.async();
		assert.expect(6);
		var callbackCounter = 0;
		//Callback function for second path update
		var fnStepProcessedCallback2 = function(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1' && callbackCounter === 3) {
				assert.ok(true, '1st step of 2nd update processed');
			} else if (oStep.name === 'step 2' && callbackCounter === 4) {
				assert.ok(true, '2nd step of 2nd update processed');
			} else if (oStep.name === 'step 3' && callbackCounter === 5) {
				assert.ok(true, '3rd step of 2nd update processed');
			} else if (oStep.name === 'step 4' && callbackCounter === 6) {
				assert.ok(true, '4th step of 2nd update processed');
				done();
			}
		};
		
		//Callback function for first path update
		var fnStepProcessedCallback1 = function(oStep) {
			++callbackCounter;
			if (oStep.name === 'step 1' && callbackCounter === 1) {
				assert.ok(true, '1st step of 1st update processed');
			} else if (oStep.name === 'step 2' && callbackCounter === 2) {
				assert.ok(true, '2nd step of 1st update processed');
				//Trigger second path update after callback from second step was processed
				oStep.pathEnv.update(fnStepProcessedCallback2);
			}
		};
	
		//overwrite update function in StepDouble in order to add testfunctionality
		var oSteps = this.oPath.getSteps();
		var fnStepUpdate = function(oFilter, fnCallback) {
			this.oTestContext.aStepUpdateCount.push(this.name);
			fnCallback(this);
		};
		for( var index in oSteps) {
			oSteps[index].update = fnStepUpdate;
		}
		//trigger first path update
		this.oPath.update(fnStepProcessedCallback1);
		if (callbackCounter === 7) {
			assert.ok(false, "Callback from first update was processed despite second update was triggered");
		}
	});
	QUnit.module('Filter merge', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleCumulativeFilter();
			this.oPath = new sap.apf.core.Path({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.StepDouble.prototype = StepDoubleStandardMethods;
			this.oStep1 = new this.StepDouble('step 1');
			this.oStep2 = new this.StepDouble('step 2');
			this.oStep3 = new this.StepDouble('step 3');
		},
		preparePathWithStartFilter : function() {
			var oFilter = new sap.apf.utils.Filter(this.oMessageHandler);
			var oExpression;
			var Filter = sap.apf.core.utils.Filter;
			var eq = sap.apf.core.constants.FilterOperators.EQ;
			oExpression = {
				name : "propStart",
				operator : sap.apf.core.constants.FilterOperators.EQ,
				value : 'valStart'
			};
			oFilter.getTopAnd().addExpression(oExpression);
			this.oCoreApi.setCumulativeFilter(oFilter.getInternalFilter());
			this.oStep1.filterFromSelection = new Filter(this.oMessageHandler, 'prop1', eq, 'val1');
			this.oStep2.filterFromSelection = new Filter(this.oMessageHandler, 'prop2', eq, 'val2');
			this.oPath.addStep(this.oStep1, function() {
			});
			this.oPath.addStep(this.oStep2, function() {
			});
			this.oPath.update(function() {
			});
		},
		setActiveStep : function(oStep) {
			this.oPath.makeStepActive(oStep);
			var aActiveSteps = this.oPath.getActiveSteps();
			var i;
			for(i = 0; i < aActiveSteps.length; ++i) {
				this.oPath.makeStepInactive(aActiveSteps[i]);
			}
			return this.oPath.makeStepActive(oStep);
		},
		StepDouble : function(sName) {
			this.name = sName;
			this.filterFromSelection = undefined;
			this.filterFromUpdate = undefined;
			this.update = function(oFilter, fnCallback) {
				this.filterFromUpdate = oFilter.toUrlParam();
				fnCallback();
			};
			this.getFilter = function() {
				return this.filterFromSelection;
			};
		}
	});
	QUnit.test('Three steps last step gets correct filter after update', function(assert) {
		var Filter = sap.apf.core.utils.Filter;
		var eq = sap.apf.core.constants.FilterOperators.EQ;
		this.oStep1.filterFromSelection = new Filter(this.oMessageHandler, 'prop1', eq, 'val1');
		this.oStep2.filterFromSelection = new Filter(this.oMessageHandler, 'prop2', eq, 'val2');
		this.oStep3.filterFromSelection = new Filter(this.oMessageHandler, 'prop3', eq, 'val3');
		this.oCoreApi.setCumulativeFilter(new sap.apf.core.utils.Filter(this.oMessageHandler));
		this.oPath.addStep(this.oStep1, function() {
		});
		this.oPath.addStep(this.oStep2, function() {
		});
		this.oPath.addStep(this.oStep3, function() {
		});
		this.oPath.update(function() {
		});
		assert.equal(this.oStep3.filterFromUpdate, "((prop1%20eq%20%27val1%27)%20and%20(prop2%20eq%20%27val2%27))", 'Third step contains filters from previous steps');
	});
	QUnit.test('Start filter and first step get correct filter after update', function(assert) {
		var oFilter = new sap.apf.utils.Filter(this.oMessageHandler);
		var oExpression;
		var Filter = sap.apf.core.utils.Filter;
		var eq = sap.apf.core.constants.FilterOperators.EQ;
		oExpression = {
			name : "propStart",
			operator : sap.apf.core.constants.FilterOperators.EQ,
			value : 'valStart'
		};
		oFilter.getTopAnd().addExpression(oExpression);
		this.oCoreApi.setCumulativeFilter(oFilter.getInternalFilter());
		this.oStep1.filterFromSelection = new Filter(this.oMessageHandler, 'prop1', eq, 'val1');
		this.oStep2.filterFromSelection = new Filter(this.oMessageHandler, 'prop2', eq, 'val2');
		this.oPath.addStep(this.oStep1, function() {
		});
		this.oPath.addStep(this.oStep2, function() {
		});
		this.oPath.update(function() {
		});
		assert.equal(this.oStep2.filterFromUpdate, "((propStart%20eq%20%27valStart%27)%20and%20(prop1%20eq%20%27val1%27))", 'The cummulative filter merges filters from start filter and first step');
	});
	QUnit.test('Start filter and first step get correct filter after update', function(assert) {
		assert.expect(1);
		this.preparePathWithStartFilter();
		var Filter = sap.apf.core.utils.Filter;
		var eq = sap.apf.core.constants.FilterOperators.EQ;
		this.setActiveStep(this.oStep2);
		var filter0 = new Filter(this.oMessageHandler, 'propStart', eq, 'valStart');
		var filter1 = new Filter(this.oMessageHandler, 'prop1', eq, 'val1');
		var filter2 = new Filter(this.oMessageHandler, 'prop2', eq, 'val2');
		var expectedFilter = filter0.addAnd(filter1);
		expectedFilter = expectedFilter.addAnd(filter2);
		this.oPath.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilterUpToActiveStep) {
			assert.equal(cumulativeFilterUpToActiveStep.isEqual(expectedFilter), true, "Filter correctly computed");
		});
	});
	QUnit.test("WHEN Path without step", function(assert) {
		var expectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
		this.oPath.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilterUpToActiveStep) {
			assert.equal(cumulativeFilterUpToActiveStep.isEqual(expectedFilter), true, "THEN cummulative Filter is correctly computed as empty filter");
		});
	});
}());