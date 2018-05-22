jQuery.sap.declare("sap.apf.tests.integration.withServer.tPathFilterHandling");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.testhelper.config.configurationForIntegrationTesting');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.Component');
jQuery.sap.require("sap.ui.app.MockServer");

if (!sap.apf.tests.integration.withServer.tPathFilterHandling) {
	sap.apf.tests.integration.withServer.tPathFilterHandling = {};
	sap.apf.tests.integration.withServer.commonSetup = function(oContext) {
		sap.apf.tests.integration.withDoubles.helper.createComponentAndApi(oContext);
		oContext.oApi.activateOnErrorHandling(true);
		oContext.oApi.setCallbackForMessageHandling(oContext.callbackErrorHandling.bind(oContext));
		oContext.fnOriginalAjax = jQuery.ajax;
		sap.apf.testhelper.replacePathsInAplicationConfiguration(oContext.fnOriginalAjax);
		var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/integrationTestingApplicationConfiguration.json";
		oContext.oApi.loadApplicationConfig(sUrl);
	};
};

module('Filter handling with OData request (path with 3 steps)', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.commonSetup(this);
		this.oApi.resetPath();
		this.startFilter = this.oApi.createFilter();
		this.topAnd = this.startFilter.getTopAnd();
		this.defineFilterOperators();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			var oFilter = this.defineFilter({
				'SAPClient' : '777'
			});
			this.oApi.setContext(oFilter);
			QUnit.start();
		}.bind(this));
	},
	teardown : function() {
		this.oCompContainer.destroy();
		jQuery.ajax = this.fnOriginalAjax;
	},
	defineFilterOperators : function() {
		jQuery.extend(this, this.startFilter.getOperators());
	},
	defineFilter : function(filters) {
		var oFilter = this.oApi.createFilter();
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
	callbackErrorHandling : function(oErrorMessage) {
		var sMessage = oErrorMessage.getMessage();
		var sErrorSeverity = oErrorMessage.getSeverity();
		var sMessageCode = oErrorMessage.getCode();
		var oPrevious = oErrorMessage.getPrevious();
		if (oPrevious) {
			sMessage = sMessage + ' DUE TO ' + oPrevious.getMessage();
		}
		var bErrorHappened = sErrorSeverity === sap.apf.core.constants.message.severity.error;
		equal(bErrorHappened, false, "Error (" + sMessageCode + "): " + sMessage);
	},
	createStartFilter : function() {
		var oStartFilter = this.oApi.createFilter();
		var oOperators = oStartFilter.getOperators();
		var P_SAPClient = {
			name : "P_SAPClient",
			operator : oOperators.EQ,
			value : "777",
		};
		var SAPClient = {
				name : "SAPClient",
				operator : oOperators.EQ,
				value : "777",
		};
		var P_FromDate = {
			name : "P_FromDate",
			operator : oOperators.EQ,
			value : "20130601",
		};
		var P_ToDate = {
			name : "P_ToDate",
			operator : oOperators.EQ,
			value : "20140630",
		};
		var P_DisplayCurrency = {
			name : "P_DisplayCurrency",
			operator : oOperators.EQ,
			value : "USD",
		};
		var P_ExchangeRateType = {
			name : "P_ExchangeRateType",
			operator : oOperators.EQ,
			value : "M",
		};
		var P_ExchangeRateDate = {
			name : "P_ExchangeRateDate",
			operator : oOperators.EQ,
			value : "00000000",
		};
		var P_AgingGridMeasureInDays = {
			name : "P_AgingGridMeasureInDays",
			operator : oOperators.EQ,
			value : "10",
		};
		var P_NetDueGridMeasureInDays = {
			name : "P_NetDueGridMeasureInDays",
			operator : oOperators.EQ,
			value : "10",
		};
		var P_NetDueArrearsGridMsrInDays = {
			name : "P_NetDueArrearsGridMsrInDays",
			operator : oOperators.EQ,
			value : "10",
		};

		oStartFilter.getTopAnd().addExpression(P_SAPClient).addExpression(SAPClient).addExpression(P_FromDate)
				.addExpression(P_ToDate).addExpression(P_DisplayCurrency)
				.addExpression(P_ExchangeRateType).addExpression(P_ExchangeRateDate)
				.addExpression(P_AgingGridMeasureInDays).addExpression(P_NetDueGridMeasureInDays)
				.addExpression(P_NetDueArrearsGridMsrInDays);
		return oStartFilter;
	},
	addThreeStepsToPath : function(fnCallback) {
		function addStep3(oStep) {
			if (oStep === this.step2) {
				this.step3 = this.oApi.createStep("stepTemplate1", fnCallback.bind(this));
			}
		}
		function addStep2() {
			this.step2 = this.oApi.createStep("stepTemplate1", addStep3.bind(this));
		}
		this.step1 = this.oApi.createStep("stepTemplate1", addStep2.bind(this));
	},
	lengthComparison : function(oBeforeData, oAfterStep) {
		return ' (number of records before selection = ' + oBeforeData.length + ' and after selection = ' + oAfterStep.getSelectedRepresentation().aDataResponse.length + ')';
	},
	step1 : {},
	step2 : {},
	step3 : {}
});

asyncTest("Single selection in 2nd step", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var callbackCounter = 0;
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		function callbackForUpdatePath(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "No change on the second step");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed filter on second step reduced data of last step");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		}
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
		this.oApi.updatePath(callbackForUpdatePath.bind(this));
	}

	this.addThreeStepsToPath(startTest.bind(this));
});

asyncTest("Filter mapping from country to customers without preserving country filter", function() {
	this.oApi.setContext(this.createStartFilter());
	addStepsToPath.call(this, startTest.bind(this));

	function addStepsToPath(fnStartTest) {
		function addStep3(oStep) {
			if (oStep === this.step2) {
				this.step3 = this.oApi.createStep("mappingResultForCustomer", fnStartTest.bind(this));
			}
		}
		function addStep2() {
			this.step2 = this.oApi.createStep("mappingResultForCustomer", addStep3.bind(this));
		}
		this.step1 = this.oApi.createStep("filterMapping", addStep2.bind(this));
	}
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var callbackCounter = 0;
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		function callbackForUpdatePath(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, 'No change on the first step' + this.lengthComparison(step1DataBeforeChange, oStep));
					break;
				case this.step2:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 2nd step' + this.lengthComparison(step2DataBeforeChange, oStep));
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 3rd step' + this.lengthComparison(step3DataBeforeChange, oStep));
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		}
		
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCountry);
		this.oApi.updatePath(callbackForUpdatePath.bind(this));
	}
});

asyncTest("Filter mapping from country to customers. Country filter preserved", function() {
	this.oApi.setContext(this.createStartFilter());
	addStepsToPath.call(this, startTest.bind(this));

	function addStepsToPath(fnStartTest) {
		function addStep3(oStep) {
			if (oStep === this.step2) {
				this.step3 = this.oApi.createStep("mappingResultForCountry", fnStartTest.bind(this));
			}
		}
		function addStep2() {
			this.step2 = this.oApi.createStep("mappingResultForCustomer", addStep3.bind(this));
		}
		this.step1 = this.oApi.createStep("filterMappingKeepSource", addStep2.bind(this));
	}
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var callbackCounter = 0;
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;
		
		function callbackForUpdatePath(oStep) {
			callbackCounter++;
			switch (oStep) {
			case this.step1:
				equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, 'No change on the first step' + this.lengthComparison(step1DataBeforeChange, oStep));
				break;
			case this.step2:
				ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, 'Mapped filter on 1st step reduced data on 2nd step' + this.lengthComparison(step2DataBeforeChange, oStep));
				break;
			case this.step3:
				ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, 'Preserved filter from 1st step reduced data on 3rd step' + this.lengthComparison(step3DataBeforeChange, oStep));
				break;
			}
			if (callbackCounter === 3) {
				start();
			}
		}
		
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCountry);
		this.oApi.updatePath(callbackForUpdatePath.bind(this));
	}
});

asyncTest("Selection on first step exists, selection for another step created", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "No change on the second step");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed filter on second step reduced data of last step");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		};

		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
		this.oApi.updatePath(callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}

		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.oApi.setActiveStep(this.step2);
		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("Path contains steps with selection, new selection on first step, ", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "No change on the first step");
					break;
				case this.step2:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Changed first step filter reduced data of second step");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step3DataBeforeChange.length, "Changed first step filter reduced data of third step");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		};

		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);
		this.oApi.updatePath(callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.oApi.setActiveStep(this.step2);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("No initial selection on 1st step - delete step in the middle of analysis path - change on data of last step", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter before deleted step has not changed");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Restrictions from second step have been removed and filter for steps after the deleted step has been changed");
					break;
			}
			if (callbackCounter === 2) {
				start();
			}
		};

		this.oApi.removeStep(this.step2, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
		this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("Delete step in the middle of analysis path, that has initial selection - no effect on data of last step", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter before deleted step has not changed");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step3DataBeforeChange.length, "Filter after deleted step has not changed");
					break;
			}
			if (callbackCounter === 2) {
				start();
			}
		};

		this.oApi.removeStep(this.step2, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("Delete step at the end of the path - no effect on data for prior steps", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step1DataBeforeChange.length, "Filter for step one has not changed");
					break;
				case this.step2:
					equal(oStep.getSelectedRepresentation().aDataResponse.length, step2DataBeforeChange.length, "Filter for step two has not changed");
					break;
			}
			if (callbackCounter === 2) {
				start();
			}
		};

		this.oApi.removeStep(this.step3, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
		this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("Move last analysis step to position just before the first step (move left operation)", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step1DataBeforeChange.length, "First step has restrictions from third step");
					break;
				case this.step2:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Second step gets restrictions from first step");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Third step is now first step in path with no restrictions");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		};

		this.oApi.moveStepToPosition(this.step3, 0, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
		this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("First step - move last analysis step to position just before the first step", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter for first step has not changed");
					break;
				case this.step2:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step2DataBeforeChange.length, "Filter for second step has not changed");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Third step is now first step in path with no restrictions");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		};

		this.oApi.moveStepToPosition(this.step3, 0, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}

		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});

asyncTest("Move analysis step from the middle to the last position in the path (move right operation) - data on 2nd and 3rd step changed", function() {
	function startTest(oStep) {
		if (oStep !== this.step3) {
			return;
		}
		var step1DataBeforeChange = this.step1.getSelectedRepresentation().aDataResponse;
		var step2DataBeforeChange = this.step2.getSelectedRepresentation().aDataResponse;
		var step3DataBeforeChange = this.step3.getSelectedRepresentation().aDataResponse;

		var callbackCounter = 0;
		var callbackForUpdatePath = function(oStep) {
			callbackCounter++;
			switch (oStep) {
				case this.step1:
					ok(oStep.getSelectedRepresentation().aDataResponse.length === step1DataBeforeChange.length, "Filter for first step has not changed");
					break;
				case this.step2:
					ok(oStep.getSelectedRepresentation().aDataResponse.length < step2DataBeforeChange.length, "Filter for second step, which is now last step in path, has changed");
					break;
				case this.step3:
					ok(oStep.getSelectedRepresentation().aDataResponse.length > step3DataBeforeChange.length, "Filter for third step, which is now second step in path, has changed");
					break;
			}
			if (callbackCounter === 3) {
				start();
			}
		};

		this.oApi.moveStepToPosition(this.step2, 2, callbackForUpdatePath.bind(this));
	}
	function startTestSetup(oStep) {
		if (oStep !== this.step3) {
			return;
		}

		this.step1.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes);
		this.step2.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes);
		this.step3.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode);

		this.oApi.updatePath(startTest.bind(this));
	}

	this.addThreeStepsToPath(startTestSetup.bind(this));
});