// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
(function () {
    "use strict";
    /*global module asyncTest deepEqual ok sinon start stop strictEqual test */
    /*jslint nomen:true */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");

    module(
        "sap.ushell.services.Ui5ComponentLoader",
        {
            setup : function () {
                window.oldUshellConfig = window["sap-ushell-config"];
                sap.ushell.bootstrap("local");
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = window.oldUshellConfig;
                delete window.oldUshellConfig;
                sap.ushell.test
                    .restoreSpies(
                        sap.ui.component,
                        sap.ui.component.load,
                        jQuery.sap.isDeclared
                    );

                delete sap.ushell.Container;
            }
        }
    );

    test("getService", function () {
        // modules cannot be unloaded; so this test should be the first in order
        ok(typeof sap.ushell.Container.getService("Ui5ComponentLoader") === "object");
    });

    [
     {
         testDescription: "target resolution result is undefined",
         oTargetResolutionResult: undefined,
         oExpectedAdjustedTargetResolutionResult: undefined
     },
     {
         testDescription: "application type is NWBC",
         oTargetResolutionResult : {
             applicationType: "NWBC"
         },
         oExpectedAdjustedTargetResolutionResult: {
             applicationType: "NWBC"
         }
     },
     {
         testDescription: "application type is URL and no ui5ComponentName set",
         oTargetResolutionResult : {
             additionalInformation: "not a ui5 component",
             applicationType: "URL"
         },
         oExpectedAdjustedTargetResolutionResult: {
             additionalInformation: "not a ui5 component",
             applicationType: "URL"
         }
     }
     ].forEach(function (oFixture) {
        asyncTest("createComponent does not call sap.ui.component when " + oFixture.testDescription, function () {

            sinon.stub(sap.ui, "component", function () {});

            sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(oFixture.oTargetResolutionResult)
                .done(function (oActualAdjustedTargetResolutionResult) {
                    if (typeof oActualAdjustedTargetResolutionResult === "object") {
                        deepEqual(oActualAdjustedTargetResolutionResult, oFixture.oExpectedAdjustedTargetResolutionResult, "promise resolved with expected result");
                    } else {
                        strictEqual(oActualAdjustedTargetResolutionResult, oFixture.oExpectedAdjustedTargetResolutionResult, "promise resolved with expected result");
                    }
                })
                .fail(function () {
                    ok(false, "promise rejected");
                })
                .always(function () {
                    ok(!sap.ui.component.load.called, "component factory was never called");
                    start();
                });
        });
     });

    [
     {
         testDescription: "no applicationDependencies defined and URL has query parameters, amendLoadingConfig explicitly set to false",
         bAmendLoadingConfig : false,
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/with/query?a=b&c=d"
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded : true    // if amended loading is switched off, we set the flag as we expect a regular UI5 bootstrap
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/with/query",
             async: true,
             componentData: {
                 startupParameters: {
                   "a": [
                     "b"
                   ],
                   "c": [
                     "d"
                   ]
                 }
             },
             asyncHints: {
             }
         }
     },
     {
         testDescription: "no applicationDependencies and no URL defined",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component"
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             async: true,
             componentData: {
                 "startupParameters": {}
             },
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies and no URL defined and componentData specified",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             componentData: {
                 fakeData: true
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded : true,
            componentData: {
                 fakeData: true
             }
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             async: true,
             componentData: {
                 fakeData: true,
                 "startupParameters": {}
             },
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and URL has query parameters",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/with/query?a=b&c=d"
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/with/query",
             async: true,
             componentData: {
                 startupParameters: {
                   "a": [
                     "b"
                   ],
                   "c": [
                     "d"
                   ]
                 }
             },
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and URL has query parameters and applicationConfiguratin defined",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/with/query?a=b&c=d",
             applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/with/query",
             async: true,
             componentData: {
                 startupParameters: {
                   "a": [
                     "b"
                   ],
                   "c": [
                     "d"
                   ]
                 },
                 config: {
                     confProp1: "value 1",
                     confProp2: "value2"
                 }
             },
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and coreExt is already loaded",
         bCoreExtAlreadyLoaded : true,
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/"
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             "componentData": {
                 "startupParameters": {}
             },
             async: true,
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and loadCoreExt set to false",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             loadCoreExt : false
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/"
             // coreResourcesFullyLoaded should NOT be set in this case
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             componentData: {
                 startupParameters: {}
             },
             async: true,
             asyncHints: {
                 "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and loadCoreExt set to false and amendLoading set to false",
         bAmendLoadingConfig : false,
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             loadCoreExt : false
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/"
             // coreResourcesFullyLoaded should NOT be set in this case (loadCoreExt explicitly set to false, usually by FLP component)
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             componentData: {
                 startupParameters: {}
             },
             async: true,
             asyncHints: {
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined and loadDefaultDependencies set to false",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             loadDefaultDependencies : false
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "applicationDependencies without asyncHints and some arbitrary property defined",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 someProperty: "ui5MayInventInFuture"
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 someProperty: "ui5MayInventInFuture"
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             someProperty: "ui5MayInventInFuture",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                 "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "applicationDependencies with component name different than in app properties and manifestUrl defined (app variant use case)",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.app.variant",
             url: "component/url/",
             applicationDependencies: {
                 name: "some.ui5.component",
                 manifestUrl: "/path/to/manifest.json"
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.app.variant",
             url: "component/url/",
             applicationDependencies: {
                 name: "some.ui5.component",
                 manifestUrl: "/path/to/manifest.json"
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             manifestUrl: "/path/to/manifest.json",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                 "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "applicationDependencies with component URL but no URL in app properties ",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             applicationDependencies: {
                 name: "some.ui5.component",
                 url: "component/url/"
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             applicationDependencies: {
                 name: "some.ui5.component",
                 url: "component/url/"
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                 "preloadBundles": ["sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "applicationDependencies with asyncHints defined",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 asyncHints: {
                     "libs": ["some.lib.dependency"],
                     "preloadBundles": ["some/preload/bundle.js"]
                 }
             }
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 asyncHints: {
                     "libs": ["some.lib.dependency"],
                     "preloadBundles": ["some/preload/bundle.js"]
                 }
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             name: "some.ui5.component",
             url: "component/url/",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "libs": ["some.lib.dependency"],
                 "preloadBundles": ["some/preload/bundle.js", "sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "applicationDependencies with asyncHints defined and parsedShellHash specified",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 asyncHints: {
                     "libs": ["some.lib.dependency"],
                     "preloadBundles": ["some/preload/bundle.js"]
                 }
             }
         },
         oParsedShellHash: {
            semanticObject: "semanticObject",
            action: "action"
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/",
             applicationDependencies: {
                 asyncHints: {
                     "libs": ["some.lib.dependency"],
                     "preloadBundles": ["some/preload/bundle.js"]
                 }
             },
             coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             id: "application-semanticObject-action-component",
             name: "some.ui5.component",
             url: "component/url/",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                 "libs": ["some.lib.dependency"],
                 "preloadBundles": ["some/preload/bundle.js", "sap/fiori/core-ext-light.js"]
             }
         }
     },
     {
         testDescription: "no applicationDependencies defined, parsedShellHash and waitForBeforeInstantiation specified",
         oTargetResolutionResult : {
             applicationType: "URL",
             ui5ComponentName: "some.ui5.component",
             url: "component/url/"
         },
         oParsedShellHash: {
             semanticObject: "semanticObject",
             action: "action"
         },
         oWaitForBeforeInstantiation: {
             dummyPromise: ""
         },
         oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded : true
         },
         oExpectedComponentProperties: {
             id: "application-semanticObject-action-component",
             name: "some.ui5.component",
             url: "component/url/",
             async: true,
             componentData: {
                 startupParameters: {}
             },
             asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"],
                "waitFor": {
                    dummyPromise: ""
                }
             }
         }
     }
     ].forEach(function (oFixture) {
        asyncTest("createComponent calls sap.ui.component correctly when " + oFixture.testDescription, function () {
            if (oFixture.hasOwnProperty("bAmendLoadingConfig")) {
                delete sap.ushell.Container;
                window["sap-ushell-config"] = {
                    services : {
                        "Ui5ComponentLoader": {
                            config : {
                                amendedLoading : oFixture.bAmendLoadingConfig
                            }
                        }
                    }
                };
                sap.ushell.bootstrap("local");
            }

            var oFakeComponentMetadata = {fakeMetadata : null},
                oFakeComponentInstance = {
                    getMetadata : function() {
                        return oFakeComponentMetadata;
                    }
                },
                oActualComponentHandle;

            // only stubbing to override implementation
            sinon.stub(sap.ui, "component").returns(new Promise(function(fnResolve, fnRecject) {
                fnResolve(oFakeComponentInstance);
            }));

            sinon.stub(jQuery.sap, "isDeclared").withArgs("sap.fiori.core-ext-light").returns(!!oFixture.bCoreExtAlreadyLoaded);

            sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                oFixture.oTargetResolutionResult, oFixture.oParsedShellHash, oFixture.oWaitForBeforeInstantiation)
                .done(function (oActualAdjustedTargetResolutionResult) {
                    oActualComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;

                    strictEqual(oActualComponentHandle.getInstance(), oFakeComponentInstance,
                        "component instance created from component handle is same as from component factory");

                    strictEqual(oActualComponentHandle.getMetadata(), oFakeComponentMetadata,
                        "component metadata returned from component handle is same as from component instance");

                    // checking component handle separately
                    delete oActualAdjustedTargetResolutionResult.componentHandle;
                    deepEqual(oActualAdjustedTargetResolutionResult,
                        oFixture.oExpectedAdjustedTargetResolutionResultWithoutComponentHandle, "promise resolved with expected result (adjusted)");

                    strictEqual(sap.ui.component.callCount, 1, "sap.ui.component called exactly 1 time");
                    deepEqual(sap.ui.component.args[0][0], oFixture.oExpectedComponentProperties,
                        "sap.ui.component called with expected parameters");
                })
                .fail(function () {
                    ok(false, "promise rejected");
                })
                .always(function () {
                    start();
                });
        });
     });

    asyncTest("createComponent handles failures of sap.ui.component correctly", function () {

        var oExpectedError = {
                stack: "Dummy stacktrace",
            },
            oTargetResolutionResult = {
                applicationType: "URL",
                ui5ComponentName: "some.ui5.component",
                url: "component/url/"
            },
            oParsedShellHash = {
                semanticObject: "semanticObject",
                action: "action"
            },
            oExpectedComponentProperties = {
                componentData: {
                    startupParameters: {}
                },
                asyncHints: {
                   "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                   "waitFor": []
                },
                name: "some.ui5.component",
                url: "component/url/",
                async: true,
                id: "application-semanticObject-action-component"
            },
            oLogMock = sap.ushell.test.createLogMock();

        // only stubbing to override implementation
        sinon.stub(sap.ui, "component").returns(new Promise(function(fnResolve, fnReject) {
            fnReject(oExpectedError);
        }));

        sinon.stub(jQuery.sap, "isDeclared").withArgs("sap.fiori.core-ext-light").returns(true);

        oLogMock.error("Failed to load UI5 component with properties '" + JSON.stringify(oExpectedComponentProperties) + "'.",
            "Dummy stacktrace",
            "sap.ushell.services.Ui5ComponentLoader");
        sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
            oTargetResolutionResult, oParsedShellHash, [] /* no wait for promise */)
            .done(function (oActualAdjustedTargetResolutionResult) {
                ok(false, "expected promise to be rejected");
            })
            .fail(function (oActualError) {
                deepEqual(oActualError, oExpectedError, "error of sap.ui.component reject being passed");
            })
            .always(function () {
                start();
                oLogMock.verify();
            });
    });

    /*
     * Test logging of error messages in function _resolveSingleMatchingTarget.
     */
    [
        {
            testDescription: "single message with severity 'trace'",
            severity: "trace",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "trace",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'debug'",
            severity: "debug",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "debug",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'info'",
            severity: "info",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "info",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'warning'",
            severity: "warning",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "warning",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'error'",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "error",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'fatal'",
            severity: "fatal",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "fatal",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'WARNING'",
            severity: "warning",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "WARNING",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'WaRnInG'",
            severity: "warning",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "WaRnInG",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity undefined",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: undefined,
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message with severity 'supergau'",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "supergau",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message without severity",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "single message without text",
            severity: "info",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "info"
                    }]
                }
            }
        },
        {
            testDescription: "single message without severity or text",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{}]
                }
            }
        },
        {
            testDescription: "single message with details defined",
            severity: "trace",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "trace",
                        details: "Foo Details, Bar",
                        text: "Foo log message!"
                    }]
                }
            }
        },
        {
            testDescription: "messages array is empty",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: []
                }
            }
        },
        {
            testDescription: "messages array has two entries",
            severity: "error",
            appProperties: {
                applicationDependencies: {
                    name: "foo.bar.Test",
                    messages: [{
                        severity: "error",
                        text: "Foo log message - number 1"
                    },{
                        text: "Foo log message - number 2"
                    }]
                }
            }
        }
    ].forEach(function (oFixture) {
        test("createComponent - ErrorLogging: " + oFixture.testDescription, function () {
            var oLogMock = sap.ushell.test.createLogMock(),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oApplicationDependencies = oFixture.appProperties.applicationDependencies;

            if (jQuery.isArray(oApplicationDependencies.messages)) {
                oApplicationDependencies.messages.forEach(function (oMessage) {
                    oLogMock[oFixture.severity](oMessage.text, oMessage.details, oApplicationDependencies.name);
                });
            }

            oUi5ComponentLoader.createComponent(oFixture.appProperties);

            oLogMock.verify();
        });
    });
}());
