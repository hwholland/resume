// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
(function () {
    "use strict";
    /* global test, strictEqual, ok, deepEqual, sinon, equal, notStrictEqual
      module, assert, asyncTest, start, URI, QUnit */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.foo.bar.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");
    jQuery.sap.require("sap.ui.core.routing.Router");

    // new Component
    sap.ui.core.UIComponent.extend("sap.ushell.foo.bar.Component", {
        init : function () {}
    });

    /*
     * Mock implementations
     */
    function fnResolveHashFragmentMock (sIntent) {
        var oDeferred = new jQuery.Deferred(),
            aIntentParts = sIntent.split("?"),
            sParameters = aIntentParts.length === 2 && aIntentParts[1],
            oNavTargetResults = {
                "#foo-bar": {
                    "applicationType": "URL",
                    "additionalInformation": "SAPUI5.Component=foo.bar.Component",
                    "url": "/foo/bar/Component",
                    "text": "Foo Bar Component"
                },
                "#foo-nwbc": {
                    "applicationType":"NWBC",
                    "additionalInformation":"",
                    "text":"Foo Bar NWBC",
                    "url":"/foo/nwbc",
                    "navigationMode":"newWindowThenEmbedded"
                }
            };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolution failed: intent unknown");
        }

        return oDeferred.promise();
    }

    /*
     * Mock implementation for resolveHashFragment
     */
    function fnResolveHashFragmentMock2 (sIntent) {
        var oDeferred = new jQuery.Deferred(),
            sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources'),
            aIntentParts = sIntent.split("?"),
            sParameters = aIntentParts.length === 2 && aIntentParts[1],
            oNavTargetResults = {
                "#foo-bar": {
                    "applicationType": "URL",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.HelloWorldSampleApp",
                    "url": sUshellTestRootPath + "/demoapps/HelloWorldSampleApp?fixed-param1=value1&array-param1=value1&array-param1=value2",
                    "text": "Foo Bar Component"
                }
            };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolution failed: intent unknown");
        }

        return oDeferred.promise();
    }

    function fnSapUiComponentMock (oConfig) {
        var that = this;

        this.id = "mockComponentInstance";
        this.config = oConfig;

        if (oConfig.async && oConfig.async === true) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(that);
                },0);
            });
        }
        return this;
    }

    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        teardown: function () {
            delete sap.ushell.Container;
            sap.ushell.test.restoreSpies(
                sap.ui.component,
                jQuery.sap.log.debug,
                jQuery.sap.isDeclared
            );
        }
    });

    test("getService", function () {
        var oCrossApplicationNavigationService;

        equal(localStorage && localStorage["sap-ushell-enc-test"], undefined, "Beware, please remove sap-ushell-enc local storage setting!");

        // code under test
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

        // test
        ok(oCrossApplicationNavigationService instanceof sap.ushell.services.CrossApplicationNavigation);
        strictEqual(typeof oCrossApplicationNavigationService.hrefForExternal, "function");
        strictEqual(typeof oCrossApplicationNavigationService.toExternal, "function");
        // TODO test parameters
    });

    test("with ShellNavigation", function () { //TODO use sinon the way it is supposed to...
        var oCrossApplicationNavigationService,
            lastCall,
            methodName,
            stub,
            anObject = { "1" : 2 },
            oAsync = { "2" : 3 },
            oAbcParam = { "abc": "a" },
            oDefParam = { "def": "b" };

        //  hrefForExternal
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), "hrefForExternal",
            function (oArgs, oArgs2, oArgs3) {
                lastCall = oArgs;
                return oArgs;
            });

        deepEqual(oAbcParam, oCrossApplicationNavigationService.hrefForExternal(oAbcParam, anObject, oAsync));
        notStrictEqual(oAbcParam, lastCall, "parameter was cloned");
        deepEqual(oAbcParam, lastCall, "parameter was cloned successfully");
        deepEqual(stub.args[0][2], anObject, "2nd argument transferred");
        equal(stub.args[0][3], oAsync, "3nd argument transferred");
        stub.restore();
        //  toExternal
        methodName = "toExternal";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs, oArgs1) {
                lastCall = oArgs;
                return oArgs;
            });
        strictEqual(undefined, oCrossApplicationNavigationService[methodName](oDefParam, anObject));
        notStrictEqual(oDefParam, lastCall, "parameter was cloned");
        deepEqual(oDefParam, lastCall, "parameter was cloned successfully");
        equal(stub.args[0][1], anObject, "Component as 2nd argument transferred");
        stub.restore();

        //  hrefForAppSpecificHash
        methodName = "hrefForAppSpecificHash";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs) {
                lastCall = oArgs;
                return oArgs;
            });
        equal("def", oCrossApplicationNavigationService[methodName]("def"));
        equal("def", lastCall);
    });

    asyncTest("getDistinctSemanticObjects", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            aFakeResult = ["SemanticObject1", "SemanticObject2"];

        sinon.stub(oNavTargetResolution, "getDistinctSemanticObjects").returns(
            new jQuery.Deferred().resolve(aFakeResult).promise()
        );

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getDistinctSemanticObjects()
                .done(function (aGotResult) {
                    ok(true, "promise was resolved");

                    deepEqual(aGotResult, aFakeResult,
                        "result returned from NavTargetResolution#getDistinctSemanticObjects was propagated");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
    });

    test("getSemanticObjectLinks", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            oObject = {},
            oResult;

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("Action", mParameters, true, oObject, sAppState);

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: oObject,
            appStateKey: sAppState,
            compactIntents: false // false is the default
        }, "NavTargetResolution was called with the expected parameters");

        strictEqual(oResult, oNavTargetResolution.getLinks.returnValues[0],
            "NavTargetResolution returned the same results returned by CrossApplicationNavigation");
    });

    test("getSemanticObjectLinks calls NavTargetResolution correctly when bCompactIntents parameter is set to true", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4"
            },
            sAppState = "ANAPSTATE";

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("Action", mParameters, true, {} /* oComponent */, sAppState, true /*bCompactIntents*/);

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: {},
            appStateKey: sAppState,
            compactIntents: true // note
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getSemanticObjectLinks multiple invoke", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            aObject = {},
            oPr,
            stub,
            cnt = 0;

        stub = sinon.stub(oNavTargetResolution, "getLinks");
        stub.onCall(0).returns(new jQuery.Deferred().resolve(["A","B"]).promise());
        stub.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());
        oPr = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks([["SOx", mParameters, true, aObject, sAppState],["SO"]]);

        deepEqual(oNavTargetResolution.getLinks.args[0], [{
            semanticObject: "SOx",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: aObject,
            appStateKey: sAppState,
            compactIntents: false
        }], "parameters are ok (first call)");

        deepEqual(oNavTargetResolution.getLinks.args[1], [{
            semanticObject: "SO",
            params: undefined,
            ignoreFormFactor: false,
            ui5Component: undefined,
            appStateKey: undefined,
            compactIntents: false
        }], "parameters are ok (second call)");

        oPr.done(function(oResult){
            deepEqual(oResult, [[["A", "B"]],[["C"]]], "obtained expected result");
            cnt = 1;
        });
        ok(cnt === 1);
        stub.restore();
    });

    test("getLinks", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            oObject = {},
            oResult;

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: oObject,
                appStateKey: sAppState
            });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                "A" : "B",
                "C" : "e'e e",
                "sap-xapp-state": [
                  "ANAPSTATE"
                ]
            },
            ignoreFormFactor: true,
            ui5Component: oObject,
            //appStateKey: sAppState,
            compactIntents: false, // false is the default
            action: undefined
        }, "NavTargetResolution was called with the expected parameters");

        strictEqual(oResult, oNavTargetResolution.getLinks.returnValues[0],
            "NavTargetResolution returned the same results returned by CrossApplicationNavigation");
    });

    test("getLinks calls NavTargetResolution correctly when no parameter is given", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks();

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks calls NavTargetResolution correctly when no parameter is given in object", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks({});

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks calls NavTargetResolution correctly when withAtLeastOneUsedParam parameter is given", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks({
            withAtLeastOneUsedParam: true,
            params: {
                "A": ["vA"],
                "B": ["vB"]
            }
        });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: {
                "A": ["vA"],
                "B": ["vB"]
            },
            withAtLeastOneUsedParam: true
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks calls NavTargetResolution correctly when bCompactIntents parameter is set to true", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4"
            },
            sAppState = "ANAPSTATE";

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: {},
                appStateKey: sAppState,
                compactIntents: true
            });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4",
                "sap-xapp-state" : [ "ANAPSTATE" ]
            },
            ignoreFormFactor: true,
            ui5Component: {},
            //appStateKey: sAppState,
            compactIntents: true,
            action: undefined
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks multiple invoke", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            aObject = {},
            oPr,
            stub,
            cnt = 0;

        stub = sinon.stub(oNavTargetResolution, "getLinks");
        stub.onCall(0).returns(new jQuery.Deferred().resolve(["A","B"]).promise());
        stub.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());
        oPr = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks([[{
                semanticObject: "SOx",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: aObject,
                appStateKey: sAppState
            }], [{
                semanticObject: "SO"
            }]]);

        deepEqual(oNavTargetResolution.getLinks.args[0], [{
            semanticObject: "SOx",
            params: {
                A: "B",
                C: "e'e e",
                "sap-xapp-state" : ["ANAPSTATE"]
            },
            ignoreFormFactor: true,
            ui5Component: aObject,
            //appStateKey: sAppState,
            compactIntents: false,
            action: undefined
        }], "parameters are ok (first call)");

        deepEqual(oNavTargetResolution.getLinks.args[1], [{
            semanticObject: "SO",
            compactIntents: false,
            params: undefined,
            action: undefined
        }], "parameters are ok (second call)");

        oPr.done(function(oResult){
            deepEqual(oResult, [  // <- we have multiple results

                [                 // <- result for the first invocation
                  ["A", "B"]      // <- return value from NavTargetResolution#getLinks
                ],
                [                 // <- result for the second invocation
                  ["C"]           // <- result corresponding to the second invocation
                ]
            ], "obtained expected result");
            cnt = 1;
        });
        ok(cnt === 1);
        stub.restore();
    });

    [
        {
            testDescription: "empty intents, no component startup params",
            aIntents: [],                               // input intents (strings)
            oComponentStartupParams: {},                // ui5 component startup params
            oFakeNavTargetResolutionResult: {},         // simulated NavTargetResolution Result
            expectedNavTargetResolutionCalledWith: [],  // expected call to nav target resolution
            expectedResult: {}                          // expected result from isIntentSupported
        },
        {
            testDescription: "sap system in intent params",
            aIntents: ["#SO-act2?sap-system=CC2"],
            oComponentStartupParams: {
                "P1": ["v1"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?sap-system=CC2" : { supported: true } // sap-system comes from intent
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?sap-system=CC2" : { supported: true } // sap-system stays there (comes from intent)
            }
        },
        {
            testDescription: "sap system in component",
            aIntents: ["#SO-act2?p1=v1"],
            oComponentStartupParams: {
                "sap-system": ["CC2"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true } // sap-system comes from startup params
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1" : { supported: true } // no sap-system (it came from component)
            }
        },
        {
            testDescription: "different sap-system in component and intent param",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oComponentStartupParams: {
                "sap-system": ["CC4"]  // note, discarded
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present in result but not on component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentResolutionResult : {
                "sap-ushell-next-navmode" : "embedded"
            },
            oComponentStartupParams: {
                "sap-system": ["CC4"]  // note, discarded
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present on component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentResolutionResult : {
                "sap-ushell-next-navmode" : "newWindow"
            },
            oComponentStartupParams: {
                "sap-system": ["CC4"],  // note, discarded
                "sap-ushell-next-navmode" : ["embedded"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present on resolution result, no component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentResolutionResult : {
                "sap-ushell-next-navmode" : "embedded"
            },
            oComponentStartupParams: undefined,
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("isIntentSupported: calls navtarget resolution as expected when " + oFixture.testDescription, function () {
            var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
                oFakeComponent;  // valid parameter (component optional in signature)

            // Construct a component compatible with getTargetWithCurrentSystem
            if (oFixture.oComponentStartupParams) {
                oFakeComponent = new sap.ui.core.UIComponent();
                sinon.stub(oFakeComponent, "getComponentData").returns({
                    startupParameters: oFixture.oComponentStartupParams
                });
            }
            sinon.stub(oNavTargetResolution, "getCurrentResolution").returns(
                    oFixture.oCurrentResolutionResult
            );
            sinon.stub(oNavTargetResolution, "isIntentSupported").returns(
                new jQuery.Deferred().resolve(oFixture.oFakeNavTargetResolutionResult).promise()
            );

            // Act
            sap.ushell.Container.getService("CrossApplicationNavigation")
                .isIntentSupported(oFixture.aIntents, oFakeComponent)
                    .done(function (mResult) {
                        ok(true, "promise was resolved");

                        deepEqual(mResult, oFixture.expectedResult, "returned expected result");
                        if (oFixture.expectedNavTargetResolutionCalledWith[0]) {
                            equal(oNavTargetResolution.isIntentSupported.args[0][0], oFixture.expectedNavTargetResolutionCalledWith[0], "correct arg");
                        }
                        ok(oNavTargetResolution.isIntentSupported.calledWithExactly(oFixture.expectedNavTargetResolutionCalledWith),
                            "NavTargetResolution.isIntentSupported called with the expected arguments");
                    })
                    .fail(function () {
                        ok(false, "promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
        });
    });

    test("isNavigationSupported", function () {
        var aIntents = [/*content does not matter*/],
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            oResult,
            oSimulatedResult = {};

        sinon.stub(oNavTargetResolution, "isNavigationSupported").returns(oSimulatedResult);
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .isNavigationSupported(aIntents);
        ok(oNavTargetResolution.isNavigationSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("isInitialNavigation: logs an error message and returns true if the shell navigation service is not availble", function () {
        var bResult,
            oService,
            iCallCount;

        // simulate shell navigation service not available
        var fnGetServiceOrig = sap.ushell.Container.getService;
        sap.ushell.Container.getService = function (sService) {
            if (sService === "ShellNavigation") {
                return undefined; // not available
            }
            return fnGetServiceOrig(sService);
        };

        sinon.stub(jQuery.sap.log, "debug");

        oService = sap.ushell.Container.getService("CrossApplicationNavigation");
        bResult = oService.isInitialNavigation();

        strictEqual(iCallCount = jQuery.sap.log.debug.getCalls().length, 1, "jQuery.sap.log.debug was called 1 time");
        if (iCallCount === 1) {
            deepEqual(jQuery.sap.log.debug.getCall(0).args, [
                "ShellNavigation service not available",
                "This will be treated as the initial navigation",
                "sap.ushell.services.CrossApplicationNavigation"
            ], "logging function was called as expected");
        }

        strictEqual(bResult, true, "obtained expected result");

        // restore original getService
        sap.ushell.Container.getService = fnGetServiceOrig;
    });

    [
        {
            bResultFromShellNavigation: true,
            expectedResult: true
        },
        {
            bResultFromShellNavigation: false,
            expectedResult: false
        },
        {
            bResultFromShellNavigation: undefined,
            expectedResult: true
        }
    ].forEach(function (oFixture) {

        test("isInitialNavigation: returns " + oFixture.expectedResult + " if the isInitialNavigation method from ShellNavigation service returns " + oFixture.bResultFromShellNavigation, function () {
            // fake result from shell navigation method
            var fnGetServiceOrig = sap.ushell.Container.getService;
            sap.ushell.Container.getService = function (sService) {
                if (sService === "ShellNavigation") {
                    return { isInitialNavigation: function () { return oFixture.bResultFromShellNavigation; } };
                }
                return fnGetServiceOrig(sService);
            };

            var oService = sap.ushell.Container.getService("CrossApplicationNavigation");

            strictEqual(oService.isInitialNavigation(), oFixture.expectedResult, "obtained expected result");

            // restore original getService
            sap.ushell.Container.getService = fnGetServiceOrig;
        });
    });

    test("backToPreviousApp", function () {
        sinon.stub(window.history, "back").returns({/*don't care*/});
        sap.ushell.Container.getService("CrossApplicationNavigation")
            .backToPreviousApp();
        ok(window.history.back.called, " window history called");
    });

    [
        {
            testDescription: "sap-system is provided via component",
            sProvidedVia: "component"
        },
        {
            testDescription: "sap-system is provided via getCurrentResolution in url",
            sProvidedVia: "getCurrentResolution"
        },
        {
            testDescription: "sap-system is provided via getCurrentResolution in sap-system member",
            sProvidedVia: "getCurrentResolutionMember"
        },
        {
            testDescription: "sap-system is provided via getCurrentResolution and component",
            sProvidedVia: "both"
        }
    ].forEach(function (oFixture) {
        test("sap-system added on navigation when " + oFixture.testDescription, function () {
            var oShellNavigation = sap.ushell.Container.getService("ShellNavigation"),
                oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
                oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
                oComponent = new sap.ui.core.UIComponent();

            sinon.stub(oShellNavigation, "hrefForExternal").returns({/*don't care*/});
            sinon.stub(oShellNavigation, "toExternal").returns({/*don't care*/});
            sinon.stub(oNavTargetResolution, "isNavigationSupported").returns({/*don't care*/});

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {

                sinon.stub(oComponent, "getComponentData").returns({
                    startupParameters: { "sap-system": ["CURRENT"] }
                });
            }

            if (oFixture.sProvidedVia === "getCurrentResolution" ||
                oFixture.sProvidedVia === "both") {


                sinon.stub(oNavTargetResolution, "getCurrentResolution").returns({
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CURRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentResolutionMember") {
                sinon.stub(oNavTargetResolution, "getCurrentResolution").returns({
                    "sap-system" : "CURRENT",
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CUSSRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentResolution" || oFixture.sProvidedVia === "getCurrentResolutionMember") {
                oComponent = undefined;
            }

            function check(oArgs, oExpected) {
                oShellNavigation.hrefForExternal.reset();
                oCAN.hrefForExternal(JSON.parse(JSON.stringify(oArgs)), oComponent);
                deepEqual(oShellNavigation.hrefForExternal.args[0][0], oExpected,
                    "hrefForExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));

                oShellNavigation.toExternal.reset();
                oCAN.toExternal(oArgs, oComponent);
                deepEqual(oShellNavigation.toExternal.args[0][0], oExpected,
                    "toExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));

                oNavTargetResolution.isNavigationSupported.reset();
                oCAN.isNavigationSupported([oArgs], oComponent);
                deepEqual(oNavTargetResolution.isNavigationSupported.args[0][0], [oExpected],
                    "isNavigationSupported: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
            }

            //code under test

            //shell navigation uses system of current app, other parameters unchanged
            check({params: {foo: "bar"}}, {params: {foo: "bar", "sap-system": "CURRENT"}});

            //shell navigation uses system of current app, target and no parameters
            check({target: {}}, {target: {}, params: {"sap-system": "CURRENT"}});

            //shell navigation uses system of current app, no overwrite of existing sap-system
            check({target: {}, params: {"sap-system": "OWNSYSTEM"}},
                {target: {}, params: {"sap-system": "OWNSYSTEM"}});

            //oArgs contains shellHash with params
            check({target: {shellHash: "SO-36?jumper=postman"}},
                {target: {shellHash: "SO-36?jumper=postman&sap-system=CURRENT"}});

            //oArgs contains shellHash without params
            check({target: {shellHash: "SO-36"}},
                {target: {shellHash: "SO-36?sap-system=CURRENT"}});

            //oArgs contains shellHash with param sap-system
            check({target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}},
                {target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}});
            check({target: {shellHash: "SO-36?asap-system=foo"}},
                {target: {shellHash: "SO-36?asap-system=foo&sap-system=CURRENT"}});
            check({target: {shellHash: "SO-36?sap-system="}},
                {target: {shellHash: "SO-36?sap-system="}});
            check({target: {}, params: {"sap-system": ""}},
                {target: {}, params: {"sap-system": ""}});

            //no change if shell hash is no string, see ShellNavigation.privhrefForExternalNoEnc
            check({target: {shellHash: 42}}, {target: {shellHash: 42}});

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {

                oComponent.getComponentData.restore();
            }

            if (oFixture.sProvidedVia === "getCurrentResolution" ||
                oFixture.sProvidedVia === "getCurrentResolutionMember" ||
                oFixture.sProvidedVia === "both") {

                oNavTargetResolution.getCurrentResolution.restore();
            }

            // no change if current application URL has no sap-system parameter
            sinon.stub(oNavTargetResolution, "getCurrentResolution").returns({ url: "/~/" });

            //no change if shell hash is no string, see ShellNavigation.privhrefForExternalNoEnc
            check({target: {shellHash: "SO-act"}}, {target: {shellHash: "SO-act"}});
        });
    });

    [
        "foo-bar",
        "#foo-bar"
    ].forEach(function (sNavigationIntent) {
        asyncTest("createComponentInstance: create a new component for a valid navigation intent " + sNavigationIntent, 5, function () {
            var oMockComponentInstance = {},
                oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
                oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance));

            sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance(sNavigationIntent)
                .done(function (oComponentInstance) {
                    start();
                    ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                    ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
                    ok(oSapUiComponentStub.calledOnce, "sap.ui.compoment was called once!");
                    ok(oSapUiComponentStub.calledWith({
                        "async": true,
                        "asyncHints": {
                            "preloadBundles": ["sap/fiori/core-ext-light.js"]
                        },
                        "name": "foo.bar.Component",
                        "url": "/foo/bar/Component",
                        "componentData": {startupParameters: {}}
                    }), "sap.ui.componend gets called with the correct information");
                    equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
                })
                .fail(sap.ushell.test.onError);
        });
    });

    QUnit.test(
        "#createComponentInstance throws when passed an unexpected `oConfig` argument",
        function ( assert ) {
            var oCrossAppNavService = sap.ushell.Container
                    .getService( "CrossApplicationNavigation" );

            var sIntent = "#foo-bar";
            var rError = /`oConfig` argument should either be an empty object or contain only the `componentData` property\./;

            [
                {
                    oConfig: {
                        unsupportedProperty1: "unsupportedStringValue",
                        unsupportedProperty2: { },
                        unsupportedProperty3: 4,
                        componentData: { }
                    },
                    sAssertion: "Throws when more properties are present in `oConfig` argument other than `componentData`"
                },
                {
                    oConfig: {
                        unsupportedProperty1: { },
                        unsupportedProperty2: 4
                    },
                    sAssertion: "Throws when there are more than one properties in `oConfig`"
                },
                {
                    oConfig: {
                        unsupportedProperty: null
                    },
                    sAssertion: "Throws when a single available property  in `oConfig` is not `componentData`"
                }
            ].forEach( function ( oFixture ) {
                assert.throws( function () {
                    oCrossAppNavService
                        .createComponentInstance( sIntent, oFixture.oConfig );
                }, rError, oFixture.sAssertion );
            } );
        }
    );

    [
        { description : "with owner", withOwner : true },
        { description : "without owner", withOwner : false }
    ].forEach(function (oFixture) {
        asyncTest("createComponentInstance: runWithOwner owner properly propagated " + oFixture.description, 2, function () {
            var oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock2),
                oOwnerComponent;

            if (oFixture.withOwner) {
                oOwnerComponent = new sap.ui.core.UIComponent({});
            } else {
                oOwnerComponent = undefined;
            }

            /* eslint-disable max-nested-callbacks */
            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar?A=B", {}, oOwnerComponent)
                    .done(function (oComponentInstance) {
                        start();
                        var oOwner = sap.ui.core.Component.getOwnerComponentFor(oComponentInstance);

                        if (oFixture.withOwner === true) {
                            // in both cases, async and sync the owner should get set to the passed owner component
                            ok(oOwner === oOwnerComponent, "correct owner");
                        } else {
                            ok(oOwner === undefined, "correct owner");
                        }

                        ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                    })
                    .fail(sap.ushell.test.onError);
        });
    });

    [
        "#foobar",
        "",
        "#foo -bar",
        undefined
    ].forEach(function (sNavigationIntent) {
        asyncTest("createComponentInstance: Invalid navigation intent", 3, function () {
            var oMockComponentInstance = {},
                oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
                oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance));

            sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance(sNavigationIntent)
                .done(sap.ushell.test.onError)
                .fail(function (sMessage) {
                    start();
                    strictEqual(sMessage, "Navigation intent invalid!", "Correct reject message received!");
                    ok(!oNavTargetResolutionStub.called, "NavTargetResolution service was never called!");
                    ok(!oSapUiComponentStub.called, "sap.ui.compoment was never called!");
                });
        });
    });

    asyncTest("createComponentInstance: create component with startup parameters", 3, function () {
        var oMockComponentInstance = {},
            oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance)),
            oExpectedComponentConfig = {
                "async": true,
                "asyncHints": {
                    "preloadBundles": ["sap/fiori/core-ext-light.js"]
                },
                "name": "foo.bar.Component",
                "url": "/foo/bar/Component",
                "componentData": {
                    "startupParameters": {
                        "P1": ["V1"],
                        "P2": ["V2"]
                    }
                }
            };

        sinon.stub(jQuery.sap, "isDeclared", function (sModuleName) {
            return !/^sap.fiori.core(?:-ext-light)?$/.test(sModuleName);
        });

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .createComponentInstance("#foo-bar?P1=V1&P2=V2")
            .done(function (oComponentInstance) {
                start();
                equal(oNavTargetResolutionStub.args[0][0], "#foo-bar?P1=V1&P2=V2", "called with correct parameter");
                deepEqual(oSapUiComponentStub.args[0][0], oExpectedComponentConfig, "sap.ui.component gets called with the correct information");
                equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
            })
            .fail(sap.ushell.test.onError);
    });

    asyncTest("createComponentInstance: resolving NWBC nav target", 3, function () {
        var oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component");

        sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance("#foo-nwbc")
            .done(sap.ushell.test.onError)
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, "The resolved target mapping is not of type UI5 component.", "Proper error message returned!");
                ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service was called once!");
                ok(!oSapUiComponentStub.called, "sap.ui.compoment was never called!");
            });
    });

    asyncTest("createComponentInstance: passing config contains componentData", 5, function () {
        var oMockComponentInstance = {},
            oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance)),
            oConfig = {
                "componentData": {
                    "reference": {
                        "attr": "value"
                    }
                }
            };

        sinon.stub(jQuery.sap, "isDeclared", function (sModuleName) {
            return !/^sap.fiori.core(?:-ext-light)?$/.test(sModuleName);
        });

        sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance("#foo-bar", oConfig)
            .done(function (oComponentInstance) {
                start();
                ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
                ok(oSapUiComponentStub.calledOnce, "sap.ui.compoment was called once!");
                ok(oSapUiComponentStub.calledWith({
                    "componentData": {
                        "reference": {
                            "attr": "value"
                        },
                        startupParameters : {}
                    },
                    "async": true,
                    "asyncHints": {
                        "preloadBundles": ["sap/fiori/core-ext-light.js"]
                    },
                    "name": "foo.bar.Component",
                    "url": "/foo/bar/Component"
                }), "sap.ui.componend gets called with the correct information");
                equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
            })
            .fail(sap.ushell.test.onError);
    });

    QUnit.test(
        "createComponentInstance: considers application dependencies specified in navigation target resolution result",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function resolveHashFragmentWithAsyncHints( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar")
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ]
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {}
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    QUnit.test(
        "Irrelevant data added to componentData are removed",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function resolveHashFragmentWithAsyncHints( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance( "#foo-bar", {
                    componentData: {
                        startupParameters: {
                            a: [ "1" ],
                            b: [ "2" ]
                        },
                        config: { },
                        "sap-xapp-state": "irrelevant data",
                        "non-problematic data": [ "OK data" ]
                    }
                } )
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ]
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {},
                                "non-problematic data": [ "OK data" ]
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    QUnit.test(
        "startup Parameters passed are ovewritten by startup parameters present in url",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function ( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar?cc=dddd", {
                    componentData: {
                        startupParameters: {
                            a: ["1"],
                            b: ["2"]
                        }
                    }
                })
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ]
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {
                                    cc: ["dddd"]
                                }
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            try {
                delete localStorage["sap-ushell-enc-test"];
            } catch (e) {}
            jQuery.sap.getObject("services.CrossApplicationNavigation.config", 0, window["sap-ushell-config"])["sap-ushell-enc-test"] = true;
            sap.ushell.bootstrap("local");
        },
        teardown: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"].services.CrossApplicationNavigation.config["sap-ushell-enc-test"];
            sap.ushell.test.restoreSpies(
                sap.ui.component
            );
        }
    });

    asyncTest("Test that sap-ushell-enc-test is added to URL in URL generating functions hrefForExternal, getSemanticObjectLinks", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new sap.ui.core.UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);

        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") >= 0," parameter added");

        oCAN.getSemanticObjectLinks("Action", {}, oComponent).done(function(aResult) {
            start();
            ok(aResult.length > 0,"at least one link");
            aResult.forEach(function(oLink) {
                ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
            });
        });
    });

    test("Test that sap-ushell-enc-test is not added to the url for special shellHash #", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new sap.ui.core.UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { shellHash : "#"} }, oComponent, false);
        equal(oRes,"#","parameter not added!");
        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1," parameter added");
        oRes = oCAN.hrefForExternal({ target : { shellHash : ""} }, oComponent, false);
        equal(oRes,"#","parameter not added!");
        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1," parameter added");

    });

    asyncTest("Test that sap-ushell-enc-test is added to URL in URL generating functions hrefForExternal, getSemanticObjectLinks with parameters", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new sap.ui.core.UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { semanticObject : "SO", action : "action"}, params : { "A" : ["b"], "sap-ushell-enc-test" : "this shall not stand" } }, oComponent, false);

        equal(oRes, "#SO-action?A=b&sap-ushell-enc-test=A%2520B%252520C"," parameter added");

        oCAN.getSemanticObjectLinks("Action", {}, oComponent).done(function(aResult) {
            start();
            ok(aResult.length > 0,"at least one link");
            aResult.forEach(function(oLink) {
                ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
            });
        });
    });

    test("Test that sap-ushell-enc-test is added to URL in URL generating functions toExternal", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new sap.ui.core.UIComponent(),
            oRes,
            oStub;
        oStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation").hashChanger,"privsetHash");

        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[0][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added");
        oStub.restore();
    });

    test("sap-ushell-enc-test can be disabled via local storage setting", 3, function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new sap.ui.core.UIComponent(),
            oRes,
            oStub;
        oStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation").hashChanger,"privsetHash");
        localStorage["sap-ushell-enc-test"] = "false";
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[0][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") === -1," parameter not added, disabled via localStorage");
        localStorage["sap-ushell-enc-test"] = "true";
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[1][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added, enabled via localStorage");
        localStorage && delete localStorage["sap-ushell-enc-test"];
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[2][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added, enabled via config");
        oStub.restore();
    });

    // ------------------- App state tests -------------------
    module("sap.ushell.services.CrossApplicationNavigation - App state", {
        setup: function () {
            window["sap-ushell-config"] = {
                services: {
                    AppState: {
                        adapter: {
                            module: "sap.ushell.adapters.local.AppStateAdapter"  // re-use adapter from local platform
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");
        },
        teardown: function () {
            sap.ushell.test.restoreSpies(sap.ushell.Container.getService("AppState").getContainer);
            delete sap.ushell.Container;
        }
    });

    test("CreateEmptyAppState : ctor", function () {
        var oCrossAppNavigationService,
            oAppState,
            oCreateEmptyAppStateSpy,
            oAppComponent;
        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new sap.ui.core.UIComponent();
        oCreateEmptyAppStateSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "createEmptyAppState");
        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent);

        // Assert
        assert.ok(oAppState, "Success: app state object was returned");
        assert.ok(typeof oAppState.setData === 'function', "Success: app state has method setData");
        assert.ok(oAppState.setItemValue === undefined, "app state has no method setItemValue");

        deepEqual(oCreateEmptyAppStateSpy.args[0], [oAppComponent], "args correct");
        oCreateEmptyAppStateSpy.restore();
    });

    test("CreateEmptyAppState : no Component passed", function () {
        var oCrossAppNavigationService,
            cnt = 0,
            oAppComponent;
        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = {};
        // Act
        try {
            oCrossAppNavigationService.createEmptyAppState(oAppComponent);
            ok(false, "Should not get here!");
        } catch (ex) {
            cnt = cnt + 1;
        }
        // Act
        try {
            oCrossAppNavigationService.createEmptyAppState(undefined);
            ok(false, "Should not get here!");
        } catch (ex2) {
            cnt = cnt + 1;
        }
        equal(cnt, 2, "got two exceptions");
    });

    test("Execute operations on app state", function () {
        var oCrossAppNavigationService,
            oAppState,
            oAppComponent,
            oItemValue;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new sap.ui.core.UIComponent();
        oItemValue = {
            one: "one!",
            two: "two?"
        };
        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent);
        oAppState.setData(oItemValue);
        assert.deepEqual(oAppState.getData(), oItemValue, "Success: app state can store object values");
        ok(oItemValue !== oAppState.getData(), "not object returned");
    });

    asyncTest("expandCompactHash", function () {
        var oCrossAppNavigationService,
            oAppState;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(new sap.ui.core.UIComponent());
        oAppState.setData("&AAA=333");
        oAppState.save().done(function () {
                oCrossAppNavigationService.expandCompactHash("#SO-action?AAA=444&sap-intent-param=" + oAppState.getKey() + "&CCC=DDD").
                done(function (sExpandedHash) {
                    start();
                    equal(sExpandedHash,"#SO-action?AAA=444&AAA=333&CCC=DDD", "expanded OK");
                });
            });
    });


    asyncTest("getStartupAppState", function () {
        var oCrossAppNavigationService,
            oAppComponent,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new sap.ui.core.UIComponent();
        oAppComponent.
            getComponentData = function () {
                return { "sap-xapp-state" : ["AKEY"] };
            };
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        // Act
        oCrossAppNavigationService.getStartupAppState(oAppComponent)
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });


    asyncTest("getStartupAppState no state present", function () {
        var oCrossAppNavigationService,
            oAppComponent;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new sap.ui.core.UIComponent();
        oAppComponent.getComponentData = function () {
            return { "sap-xapp-state" : undefined };
        };

        // Act
        oCrossAppNavigationService.getStartupAppState(oAppComponent)
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
    });


    asyncTest("getAppState", function () {
        var oCrossAppNavigationService,
            oAppComponent,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new sap.ui.core.UIComponent();
        oAppComponent.
            getComponentData = function () {
                return { "sap-xapp-state" : ["AKEY"] };
            };
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppState(oAppComponent, "AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });

    [  { description: "bad key type ", oComponent : "<comp>" , sKey : 13 , errorlog : true },
       { description: "bad key ", oComponent : "<comp>" , sKey : undefined , errorlog : false}
    ].forEach(function (oFixture) {
        asyncTest("getAppState bad states" + oFixture.description , function () {
            var oCrossAppNavigationService,
                oAppComponent,
                oGetContainerSpy;
                // Arrange
                oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
                oAppComponent = new sap.ui.core.UIComponent();
                if (oFixture.oComponent === "<comp>") {
                    oAppComponent = new sap.ui.core.UIComponent();
                } else {
                    oAppComponent = oFixture.oComponent;
                }
                oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
                oCrossAppNavigationService.getAppState(oAppComponent, "AKEY")
                    .done(function (oAppState) {
                        start();
                        // Assert
                        assert.ok(oAppState, "Success: app state object was returned");
                        assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                        assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
                    });
                equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
                equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
                oGetContainerSpy.restore();
            });
       });



    asyncTest("getAppStateData", function () {
        var oCrossAppNavigationService,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppStateData("AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.equal(oAppState, undefined, "Success: app state object was returned");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });



    asyncTest("getAppStateData spy, no data -> undefined", function () {
        var oCrossAppNavigationService,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppStateData("AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.equal(oAppState, undefined, "Success: app state data is undefined");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });


    asyncTest("getAppStateData with data", function () {
        var oCrossAppNavigationService,
            oAppState,
            oAppComponent,
            sKey;
        oAppComponent = new sap.ui.core.UIComponent();
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent,"ANewKey");
        oAppState.setData({ here: "isthedata"});
        sKey = oAppState.getKey();
        oAppState.save().fail(function() {
            ok(false,"Should not get here");
        }).done(function(){
            oCrossAppNavigationService.getAppStateData(sKey)
            .done(function (oAppStateData) {
                start();
                // Assert
                deepEqual(oAppStateData, {
                    "here": "isthedata"
                }, "Success: app state object was returned");
            });
        });
    });


    asyncTest("getAppStateData multiple invoke with some data and no data -> undefined", function () {
        var oCrossAppNavigationService,
        oAppState,
        oAppComponent,
        sKey;
        oAppComponent = new sap.ui.core.UIComponent();
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent,"ANewKey");
        oAppState.setData({ here: "isthedata"});
        sKey = oAppState.getKey();
        oAppState.save().fail(function() {
            ok(false,"Should not get here");
        }).done(function(){
            // Arrange
            oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
            oCrossAppNavigationService.getAppStateData([[sKey], ["BKEY"]])
            .done(function (oAppState) {
                start();
                // Assert
                deepEqual(oAppState, [[ {
                    "here": "isthedata"
                }],[undefined]], "Success: app state data is undefined");
            });
        });
    });

    //Navigable ?
    asyncTest("isUrlSupported non-Fiori link", function () {
        var oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        // Act
        oCrossAppNavigationService.isUrlSupported("https://www.google.de")
            .done(function () {
                start();
                ok(true,"should be supported");
            })
            .fail(function () {
                start();
                ok(false,"should not fail");
            });
    });

    var ourURI = (new URI(window.location.href)).normalize(),
        ourUriFullResource = ourURI.protocol() + "://" + ourURI.host() + ourURI.pathname();
    //Navigable ?
    [ { sUrl : "https://www.google.de" , bResult : true},
      { sUrl : "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : true},
      { sUrl : "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false, reject : true},
      { sUrl : "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false},
      { sUrl : ourUriFullResource + "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : true},
      { sUrl : "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false},
      { sUrl : "#someotherhash" , bResult : true}, // not an intent!
      { sUrl : undefined, bResult : false},
      { sUrl : {}, bResult : false}
    ].forEach(function (oFixture) {
        asyncTest("isUrlSupported diverse links: " + oFixture.sUrl + "  force reject:" + oFixture.reject, function () {
            var oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
            sinon.stub(oCrossAppNavigationService,"isIntentSupported", function(aIntent) {
                var oDeferred = new jQuery.Deferred(),
                    bSupported = false,
                    oRes = {};
                if (aIntent[0].indexOf("#LegalObject-") === 0) {
                    bSupported = true;
                }

                if ( oFixture.reject) {
                    oDeferred.reject();
                }
                oRes[aIntent] = { supported : bSupported};
                oDeferred.resolve(oRes);
                return oDeferred.promise();
            });
            // Act
            oCrossAppNavigationService.isUrlSupported(oFixture.sUrl)
                .done(function () {
                    start();
                    ok(oFixture.bResult,"supported url");
                })
                .fail(function () {
                    start();
                    ok(!oFixture.bResult,"not supported url");
                });
        });
    });



}());
