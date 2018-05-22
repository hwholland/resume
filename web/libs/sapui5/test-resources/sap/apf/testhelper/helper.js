/*global sap, jQuery, QUnit, console, document, location, window */
jQuery.sap.declare("sap.apf.testhelper.helper");
(function() {
	'use strict';
	sap.apf.testhelper.watchExecutionOrder = function() {
		sap.apf.testhelper.watchExecutionOrder.executedTests = [];
		QUnit.testStart(function(details) {
			var executedTests = sap.apf.testhelper.watchExecutionOrder.executedTests;
			jQuery.sap.log("Now running: ", details.module, details.name);
			executedTests.push(details.module + "/" + details.name);
			if (executedTests.length > 1) {
				QUnit.assert.ok(false, "several tests run in parallel " + executedTests.toString());
			}
		});
		QUnit.testDone(function(details) {
			jQuery.sap.log("Finished running: ", details.module, details.name, "Failed/total: ", details.failed, details.total, details.duration);
			var executedTests = sap.apf.testhelper.watchExecutionOrder.executedTests;
			if (executedTests.length !== 1) {
				QUnit.assert.ok(false, "Test done: several tests run in parallel " + executedTests.toString());
			}
			if (executedTests[0] !== details.module + "/" + details.name) {
				QUnit.assert.ok(false, "Test done - test has not been registered properly " + details.module + "/" + details.name);
			} else {
				executedTests = [];
			}
		});
	};
	/**
	 * @description tests, whether the array aContained is included in aData
	 * @parameter aContained
	 * @parameter aData
	 * @return boolean. true if each member of aContained is member of aData.
	 */
	sap.apf.testhelper.isContainedInArray = function(aContained, aData) {
		var findSingleRecord = function(aRecord, aData) {
			var bRecordFits = false;
			var bFound = false;
			var j, oProp;
			for(j = 0; j < aData.length; j++) {
				bRecordFits = true;
				for(oProp in aRecord) {
					if (aRecord[oProp] !== aData[j][oProp]) {
						bRecordFits = false;
					}
				}
				if (bRecordFits === true) {
					return true;
				}
			}
			return bFound;
		};
		var i, bFound;
		for(i = 0; i < aContained.length; i++) {
			bFound = findSingleRecord(aContained[i], aData);
			if (bFound === false) {
				return false;
			}
		}
		return true;
	};
	/**
	 * Adjust url roots with "/apf-test/" with roots of current deployment project, e.g. /qunit-testrunner/, /sapui5-sdk-dist/ etc.
	 * As an effect, tests with ajax access to local resources run in eclipse, on jenkins, karma or in web ide.
	 * @param {object} fnOriginalAjax the ajax function, where the URLs have to be adjusted.
	 * @returns undefined
	 */
	sap.apf.testhelper.adjustResourcePaths = function(fnOriginalAjax) {
		jQuery.ajax = function(oConfig) {
			var sUrl = oConfig.url;
			if (sUrl.search('/apf-test/test-resources') > -1) {
				var sHref = jQuery(location).attr('href');
				sHref = sHref.replace(location.protocol + "//" + location.host, "");
				sHref = sHref.slice(0, sHref.indexOf("test-resources"));
				if (sHref.indexOf("/debug.htm") === 0 || sHref.indexOf("/context.htm") === 0) { // Karma case, debug or run
					sUrl = sUrl.replace(/\/apf-test\/test-resources/g, "base/test/uilib");
				} else if (sHref.indexOf("hc_orionpath") > -1) {
					sUrl = sUrl.replace(/\/apf-test\/test-resources/g, "/apf-lib/src/test/uilib");
				} else {
					sUrl = sUrl.replace(/\/apf-test\//g, sHref);
				}
			}
			oConfig.url = sUrl;
			fnOriginalAjax(oConfig);
		};
	};
	/**
	 * Returns the path to the test folder, depending on the server like Tomcat or Karma.
	 * The path ends without slash: "/".
	 * @returns {*}
	 */
	sap.apf.testhelper.determineTestResourcePath = function() {
		var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
		var sHref = jQuery(location).attr('href');
		var testRessourcePath = "test-resources/sap/apf";
		var index = sApfLocation.indexOf("/base");
		if (index > -1) { // Karma
			return "/base/test/uilib/sap/apf";
		}
		index = sHref.indexOf("hc_orionpath");
		if (index > -1) {
			return "/apf-lib/src/test/uilib/sap/apf";
		}
		// HTML QUnit based
		//extract deployment project and use it as path to test resources
		sHref = sHref.replace(location.protocol + "//" + location.host, "");
		sHref = sHref.slice(0, sHref.indexOf("test-resources/sap/apf"));
		return sHref + testRessourcePath;
	};
	/**
	 * Replaces "/sap.apf.test/" in applicationConfiguration.json by current deployment project, e.g. /qunit-testrunner/, /sapui5-sdk-dist/ etc.
	 * @returns undefined
	 */
	sap.apf.testhelper.replacePathsInAplicationConfiguration = function(fnOriginalAjax) {
		jQuery.ajax = function(oConfig) {
			if (!oConfig.success) {
				return fnOriginalAjax(oConfig);
			}
			var fnOriginalSuccess = oConfig.success;
			oConfig.success = function(oData, sStatus, oJqXHR) {
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var sHref = jQuery(location).attr('href');
					sHref = sHref.replace(location.protocol + "//" + location.host, "");
					sHref = sHref.slice(0, sHref.indexOf("test-resources"));
					if (sHref.indexOf("/debug.htm") === 0 || sHref.indexOf("/context.htm") === 0) { // Karma case, debug or run
						sResponse = sResponse.replace(/\/apf-test\/test-resources/g, "base/test/uilib");
					} else if (sHref.indexOf("hc_orionpath") > -1) {
						sResponse = sResponse.replace(/\/apf-test\/test-resources/g, "/apf-lib/src/test/uilib");
					} else {
						sResponse = sResponse.replace(/\/apf-test\//g, sHref);
					}
					oData = JSON.parse(sResponse);
				}
				fnOriginalSuccess(oData, sStatus, oJqXHR);
			};
			return fnOriginalAjax(oConfig);
		};
	};
	/**
	 * resolves the test server to the name of required application configuration so that paths can be correct
	 * @returns {string}
	 */
	sap.apf.testhelper.determineApplicationConfigName = function() {
		var originLocation = location.protocol + "//" + location.host;
		if (originLocation.toString().search("localhost") > -1) {
			/* KARMA ports */
			if (originLocation.toString().search(/(localhost:9876|localhost:9877|localhost:9878|localhost:9879)/i) > -1) {
				return "applicationConfigurationKarma.json";
			}
			// Tomcat Jetty et al
			return "applicationConfiguration.json";
		}
		// Server (HANA) test
		return "applicationConfiguration.json";
	};
	/**
	 * add predefined url parameters to the current html page.
	 */
	sap.apf.testhelper.injectURLParameters = function(aKeyValuePairs) {
		var currentParams = document.location.search.substr(1).split('&');
		if (currentParams[0] === "") {
			currentParams = [];
		}
		var paramsChanged = false;
		var aKeyValue, j;
		var setParameter = function(key, value) {
			key = encodeURI(key);
			value = encodeURI(value);
			for(j = 0; j < currentParams.length; ++j) {
				aKeyValue = currentParams[j].split('=');
				if (aKeyValue[0] === key) {
					if (aKeyValue[1] === value) {
						return;
					}
					aKeyValue[1] = value;
					currentParams[j] = aKeyValue.join('=');
					paramsChanged = true;
					return;
				}
			}
			currentParams.push([ key, value ].join('='));
			paramsChanged = true;
			return;
		};
		for( var prop in aKeyValuePairs) {
			setParameter(prop, aKeyValuePairs[prop]);
		}
		if (paramsChanged) {
			if (window.history.pushState) { // html5 work-around
				window.history.pushState(null, null, "?" + currentParams.join('&'));
			} else {
				document.location.search = currentParams.join('&');
			}
			return;
		}
	};
	sap.apf.testhelper.startMicroSeconds = null;
	sap.apf.testhelper.generateGuidForTesting = function() {
		if (!sap.apf.testhelper.startMicroSeconds) {
			sap.apf.testhelper.startMicroSeconds = new Date().valueOf();
		} else {
			sap.apf.testhelper.startMicroSeconds++;
		}
		return "FFFFFFFFFFFFFFFFFFF" + sap.apf.testhelper.startMicroSeconds;
	};
}());
