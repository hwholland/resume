// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.AppLifeCycle
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, jQuery, module, sinon, start, strictEqual, test*/

    var oMockEventProvider,
        oService;

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.AppLifeCycle");


    module("sap.ushell.services.AppLifeCycle", {
        setup : function () {
            var fnById = sap.ui.getCore().byId;

            sap.ushell.bootstrap("local");

            sap.ui.base.EventProvider.extend("sap.ushell.foo_bar.MockEventProvider", {
                attachAfterNavigate: function (oData, fnHandler) {
                    this.attachEvent("afterNavigate", oData, fnHandler);
                },
                detachAfterNavigate: function (oData, fnHandler) {
                    this.detachEvent("afterNavigate", fnHandler);
                },
                fireAfterNavigate: function (oParameters) {
                    this.fireEvent("afterNavigate", oParameters);
                }
            });
            oMockEventProvider = new sap.ushell.foo_bar.MockEventProvider();

            sinon.stub(sap.ui.getCore(), "byId", function (sId) {
                if (sId === "viewPortContainer") {
                    return oMockEventProvider;
                }
                return fnById(sId);
            });

            oService = sap.ushell.Container.getService("AppLifeCycle");
        },

        teardown : function () {
            sap.ushell.test.restoreSpies(
                    sap.ui.getCore().byId
            );
            delete sap.ushell.foo_bar;
            delete sap.ushell.Container;
        }
    });

    test("getService: all normal", function () {
        // check that the service is alive and well-formed
        strictEqual(typeof oService, "object", "service instance is an object");
        ["getCurrentApplication", "attachAppLoaded", "detachAppLoaded"].forEach(function (sMethodName) {
            strictEqual(typeof oService[sMethodName], "function", "function " + sMethodName + " is defined");
        });
    });

    test("getService: but no viewPortContainer defined", function () {
        var oLogMock;

        // do a teardown to start from scratch for this test
        sap.ushell.test.restoreSpies(
            sap.ui.getCore().byId
        );
        delete sap.ushell.foo_bar;
        delete sap.ushell.Container;

        // do a setup without stubbing the byId method
        sap.ushell.bootstrap("local");
        oLogMock = sap.ushell.test.createLogMock();
        oLogMock.error("Error during instantiation of AppLifeCycle service", "Could not attach to afterNavigate event", "sap.ushell.services.AppLifeCycle");

        oService = sap.ushell.Container.getService("AppLifeCycle");

        oLogMock.verify();
    });

    test("getService: viewPortContainer instance has no afterNavigate event", function () {
        var oLogMock,
            fnById = sap.ui.getCore().byId;

        // do a teardown to start from scratch for this test
        sap.ushell.test.restoreSpies(
            sap.ui.getCore().byId
        );
        delete sap.ushell.foo_bar;
        delete sap.ushell.Container;

        // do a setup and stub the byId method with regular EventProvider instance
        sap.ushell.bootstrap("local");
        sinon.stub(sap.ui.getCore(), "byId", function (sId) {
            if (sId === "viewPortContainer") {
                return new sap.ui.base.EventProvider();
            }
            return fnById(sId);
        });
        oLogMock = sap.ushell.test.createLogMock();
        oLogMock.error("Error during instantiation of AppLifeCycle service", "Could not attach to afterNavigate event", "sap.ushell.services.AppLifeCycle");

        oService = sap.ushell.Container.getService("AppLifeCycle");

        oLogMock.verify();
    });

    [
        {
            testDescription: "no applicationType provided - fallback to UI5",
            sProvidedApplicationType: undefined,
            oComponentInstance: {
                getId: function () {
                    return "application-Foo-bar-component";
                }
            },
            expectedApplicationType: "UI5",
            expectedHomePage: false
        }, {
            testDescription: "applicationType NWBC",
            sProvidedApplicationType: "NWBC",
            expectedApplicationType: "NWBC",
            expectedHomePage: false
        }, {
            testDescription: "applicationType URL - fallback to UI5",
            sProvidedApplicationType: "URL",
            oComponentInstance: {
                getId: function () {
                    return "application-Foo-bar-component";
                }
            },
            expectedApplicationType: "UI5",
            expectedHomePage: false
        }, {
            testDescription: "applicationType URL - no componentInstance",
            sProvidedApplicationType: "URL",
            expectedApplicationType: "URL",
            expectedHomePage: false
        }, {
            testDescription: "applicationType random object - just pass through",
            sProvidedApplicationType: {foo: "Bar"},
            oComponentInstance: {
                getId: function () {
                    return "application-Foo-bar-component";
                }
            },
            expectedApplicationType: {foo: "Bar"},
            expectedHomePage: false
        }, {
            testDescription: "applicationType undefined and no componentInstance defined",
            sProvidedApplicationType: undefined,
            expectedApplicationType: undefined,
            expectedHomePage: false
        }, {
            testDescription: "applicationType random object - just pass through",
            sProvidedApplicationType: "UI5",
            oComponentInstance: {
                getId: function () {
                    return "application-Shell-home-component";
                }
            },
            expectedApplicationType: "UI5",
            expectedHomePage: true
        }
    ].forEach(function(oFixture) {
        test(oFixture.testDescription, function() {
            var oEventParameters = {
                    to: {
                        getComponentHandle: function () {
                            return {
                                getInstance: function () {
                                    return oFixture.oComponentInstance;
                                }
                            };
                        },
                        getApplicationType: function () {
                            return oFixture.sProvidedApplicationType;
                        }
                    },
                    toId: "application-Foo-bar"
                },
                oExpectedResult = {
                    applicationType: oFixture.expectedApplicationType,
                    componentInstance: oFixture.oComponentInstance,
                    homePage: oFixture.expectedHomePage
                };
            oMockEventProvider.fireAfterNavigate(oEventParameters);
            deepEqual(oService.getCurrentApplication(), oExpectedResult, "currentApplication object as expected");
        });
    });

    asyncTest("listening to the appLoaded event", function () {
        var oComponentInstance = {
                getId: function () {
                    return "application-Foo-bar-component";
                }
            },
            oEventParameters = {
                to: {
                    getComponentHandle: function () {
                        return {
                            getInstance: function () {
                                return oComponentInstance;
                            }
                        };
                    },
                    getApplicationType: function () {
                        return "URL";
                    }
                },
                toId: "application-Foo-bar"
            },
            fnOnAppLoaded;

        // actual test of expectations here in event handler
        fnOnAppLoaded = function (oEvent) {
            start();
            deepEqual(oEvent.mParameters, this.service.getCurrentApplication(), "event returns expected app");
        };

        // trigger the event to be tested
        oService.attachAppLoaded(undefined, fnOnAppLoaded, {service: oService});
        oMockEventProvider.fireAfterNavigate(oEventParameters);
    });
}());
