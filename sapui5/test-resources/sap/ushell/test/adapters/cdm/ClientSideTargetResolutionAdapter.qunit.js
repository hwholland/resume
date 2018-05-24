// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
(function() {
    "use strict";
    /*global QUnit, deepEqual, asyncTest, strictEqual, module, start, test, jQuery, ok, sinon, sap */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.test.utils");

    var O_CDM_SITE_SERVICE_MOCK_DATA = sap.ushell.test.data.cdm.cdmSiteService,
    //    A_CDM_GROUP_IDS = O_CDM_SITE_SERVICE_MOCK_DATA.groupIds,
    //    O_CDM_GROUPS = O_CDM_SITE_SERVICE_MOCK_DATA.groups,
    //    O_LPA_RESULT_DATA = sap.ushell.test.data.cdm.launchPageAdapter,
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site;
    //    O_CSTR = sap.ushell.test.data.cdm.ClientSideTargetResolution.resolvedTileHashes;

    var O_LOCAL_SYSTEM_ALIAS = {
        http: {
            host: "",
            port: "",
            pathPrefix: "/sap/bc/"
        },
        https: {
            host: "",
            port: "",
            pathPrefix: "/sap/bc/"
        },
        rfc: {
            systemId: "",
            host: "",
            service: 0,
            loginGroup: "",
            sncNameR3: "",
            sncQoPR3: ""
        },
        id: "",
        client: "",
        language: ""
    };

    module("sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter", {
        setup : function() {
            this.oAdapter = new sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter(
                undefined, undefined, {
                    config : {}
                });

            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
        },
        teardown : function() {
            sap.ushell.test.restoreSpies(
                    sap.ushell.Container.getService,
                    jQuery.sap.log.error,
                    jQuery.sap.log.warning
            );
            delete sap.ushell.Container;
            delete this.oAdapter;
        }
    });

    [
        {
            testDescription: "site promise is rejected",
            sSystemAlias: "anything",
            bGetSystemAliasesPromiseRejected: true,
            expectedSystemAliasPromiseRejected: true, // test this
            expectedSystemAliasPromiseRejectedArg: undefined,
            expectedSystemAliasPromiseRejectedWarningArgs: undefined,
            oSystemAliases: { "any": "thing" }
        },
        {
            testDescription: "system alias is the empty string",
            sSystemAlias: "",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: {},
            expectedSystemAliasData: O_LOCAL_SYSTEM_ALIAS
        },
        {
            testDescription: "a non-existing system alias is to be resolved",
            sSystemAlias: "DOES_NOT_EXIST",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: true,
            expectedSystemAliasPromiseRejectedArg: "Cannot resolve system alias DOES_NOT_EXIST",
            expectedSystemAliasPromiseRejectedWarningArgs: [
                "Cannot resolve system alias DOES_NOT_EXIST",
                "The system alias cannot be found in the site response",
                "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
            ],
            oSystemAliases: {}
        },
        {
            testDescription: "system alias exists",
            sSystemAlias: "AB1CLNT000",
            bGetSystemAliasesPromiseRejected: false,
            expectedSystemAliasPromiseRejected: false,
            oSystemAliases: {
                "AB1CLNT000": {
                    id: "AB1CLNT000",
                    client: "000",
                    language: "EN",
                    http: {
                        host: "ldcab1.xyz.com",
                        port: 10000,
                        pathPrefix: "/abc/def/"
                    },
                    https: {
                        host: "ldcab1.xyz.com",
                        port: 20000,
                        pathPrefix: "/abc/def/"
                    },
                    rfc: {
                        systemId: "AB1",
                        host: "ldcsab1.xyz.com",
                        service : 3444,
                        loginGroup: "PUBLIC",
                        sncNameR3: "",
                        sncQoPR3: "8"
                    }
                }
            },
            expectedSystemAliasData: {
                id: "AB1CLNT000",
                client: "000",
                language: "EN",
                http: {
                    host: "ldcab1.xyz.com",
                    port: 10000,
                    pathPrefix: "/abc/def/"
                },
                https: {
                    host: "ldcab1.xyz.com",
                    port: 20000,
                    pathPrefix: "/abc/def/"
                },
                rfc: {
                    systemId: "AB1",
                    host: "ldcsab1.xyz.com",
                    service : 3444,
                    loginGroup: "PUBLIC",
                    sncNameR3: "",
                    sncQoPR3: "8"
                }
            }
        }
    ].forEach(function(oFixture) {
        asyncTest("resolveSystemAlias: " + oFixture.testDescription, function() {
            sinon.stub(jQuery.sap.log, "warning");

            var oGetSystemAliasesStub = sinon.stub(this.oAdapter, "_getSystemAliases");
            if (oFixture.bGetSystemAliasesPromiseRejected) {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().reject().promise());
            } else {
                oGetSystemAliasesStub.returns(new jQuery.Deferred().resolve(oFixture.oSystemAliases).promise());
            }

            this.oAdapter.resolveSystemAlias(oFixture.sSystemAlias)
                .done(function (oResolvedSystemAlias) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        ok(false, "promise was rejected");
                    } else {
                        ok(true, "promise was resolved");
                    }
                    deepEqual(oResolvedSystemAlias, oFixture.expectedSystemAliasData, "resolved to the expected system alias");
                })
                .fail(function (sMessage) {
                    if (oFixture.expectedSystemAliasPromiseRejected) {
                        ok(true, "promise was rejected");

                        if (oFixture.expectedSystemAliasPromiseRejectedWarningArgs) {
                            strictEqual(jQuery.sap.log.warning.callCount, 1, "jQuery.sap.log.warning was called 1 time");

                            deepEqual(jQuery.sap.log.warning.getCall(0).args, oFixture.expectedSystemAliasPromiseRejectedWarningArgs,
                                "jQuery.sap.log.warning called as expected");
                        }

                        strictEqual(sMessage, oFixture.expectedSystemAliasPromiseRejectedArg,
                            "promise was rejected with the expected message");
                    } else {
                        ok(false, "promise was resolved");
                    }
                })
                .always(function () {
                    start();
                });
        });
    });

    [
        {
            testDescription: "site promise resolves with system aliases",
            bSitePromiseRejected: false,
            oSiteSystemAliases: {
                "UI2_WDA": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "111",
                    "language": ""
                },
                "U1YCLNT000": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "000",
                    "language": ""
                },
                "U1YCLNT111": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "client": "111",
                    "language": ""
                }
            },
            expectedSystemAliases: {
                "UI2_WDA": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "UI2_WDA",
                    "client": "111",
                    "language": ""
                },
                "U1YCLNT000": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "U1YCLNT000",
                    "client": "000",
                    "language": ""
                },
                "U1YCLNT111": {
                    "http": {
                        "host": "",
                        "port": 0,
                        "pathPrefix": ""
                    },
                    "https": {
                        "host": "example.corp.com",
                        "port": 44355,
                        "pathPrefix": ""
                    },
                    "rfc": {
                        "systemId": "",
                        "host": "",
                        "service": 32,
                        "loginGroup": "",
                        "sncNameR3": "",
                        "sncQoPR3": ""
                    },
                    "id": "U1YCLNT111",
                    "client": "111",
                    "language": ""
                }
            },
            expectedPromiseReject: false
        },
        {
            testDescription: "site promise rejects with an error message",
            bSitePromiseRejected: true,
            sSitePromiseRejectedWith: "deliberate error message",
            expectedPromiseReject: true,
            expectedPromiseRejectWith: "deliberate error message"
        }
    ].forEach(function (oFixture) {
        asyncTest("_getSystemAliases: returns the expected system aliases when " + oFixture.testDescription, function () {
            var oCDMServiceStub = {
                getSite: function() {
                    var oSiteResponse = {
                        systemAliases: oFixture.oSiteSystemAliases
                    };

                    if (oFixture.bSitePromiseRejected) {
                        return new jQuery.Deferred().reject(oFixture.sSitePromiseRejectedWith).promise();
                    }

                    return new jQuery.Deferred().resolve(oSiteResponse).promise();
                }
            };

            sinon.stub(sap.ushell.Container, "getService").returns(oCDMServiceStub);

            this.oAdapter._getSystemAliases()
                .done(function (oSystemAliases) {
                    if (oFixture.expectedPromiseReject) {
                        ok(false, "promise was rejected");
                    } else {
                        ok(true, "promise was resolved");
                    }

                    deepEqual(oSystemAliases, oFixture.expectedSystemAliases,
                        "got the expected system aliases");
                })
                .fail(function (sErr) {
                    if (oFixture.expectedPromiseReject) {
                        ok(true, "promise was rejected");

                        deepEqual(
                            sErr,
                            oFixture.expectedPromiseRejectWith,
                            "the promise was rejected with the expected arguments"
                        );
                    } else {
                        ok(false, "promise was resolved");
                    }

                })
                .always(function () {
                    start();
                });
        });
    });

    [
        {
            testDescription: "applicationType is defined",
            oApp: {},
            oResolutionResult: {
                applicationType: "foo"
            },
            expectedApplicationType: "foo"
        },
        {
            testDescription: "applicationType cannot be detected",
            oApp: {},
            oResolutionResult: {},
            expectedApplicationType: "URL"
        },
        {
            testDescription: "application technology is UI5",
            oApp: {
                "sap.ui":{
                    "technology":"UI5"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "SAPUI5"
        },
        {
            testDescription: "application technology is WDA",
            oApp: {
                "sap.ui":{
                    "technology":"WDA"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "WDA"
        },
        {
            testDescription: "application technology is GUI",
            oApp: {
                "sap.ui":{
                    "technology":"GUI"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "TR"
        },
        {
            testDescription: "application technology is URL",
            oApp: {
                "sap.ui":{
                    "technology":"URL"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "URL"
        }
    ].forEach(function (oFixture) {
        test("_formatApplicationType: returns " + oFixture.expectedApplicationType + " when " + oFixture.testDescription, function () {
            sinon.stub(jQuery.sap.log, "warning");
            sinon.stub(jQuery.sap.log, "error");

            var sGotApplicationType = this.oAdapter._formatApplicationType(oFixture.oResolutionResult, oFixture.oApp);

            strictEqual(sGotApplicationType, oFixture.expectedApplicationType, "got expected application type");
            strictEqual(jQuery.sap.log.warning.callCount, 0, "no calls to jQuery.sap.log.warning");
            strictEqual(jQuery.sap.log.error.callCount, 0, "no calls to jQuery.sap.log.error");
        });
    });

    [
        {
            testDescription: "site data is empty",
            oSiteData: {},
            expectedInbounds: []
        },
        {
            testDescription: "single application with minimal settings defined",
            oSiteData: {
                "applications":{
                    "AppDescId1234":{
                      "sap.app":{
                         "title":"translated title of application",
                         "applicationVersion":{
                             "version":"1.0.0"
                         }
                      },
                      "sap.ui":{
                         "technology":"WDA",
                         "deviceTypes":{
                            "desktop":true,
                            "tablet":false,
                            "phone":false
                         }
                      }
                    }
                }
            },
            expectedInbounds: []
        }
    ].forEach(function(oFixture) {
        asyncTest("getInbounds returns the correct inbounds when " + oFixture.testDescription, function () {
            var oAdapter,
                oSystem = {};

            // Arrange
            var oCDMServiceStub = {
                    getSite: function() {
                        var oDeferred = new jQuery.Deferred();
                        oDeferred.resolve(oFixture.oSiteData);
                        return oDeferred.promise();
                    }
            };
            //jQuery.sap.getObject("sap.ushell.Container", 0);
            sinon.stub(sap.ushell.Container, "getService").returns(oCDMServiceStub);

            // Act
            oAdapter = new sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter(
                    oSystem,
                    undefined,
                    undefined
            );
            oAdapter.getInbounds()
                .fail(function(sMessage) {
                    ok(false, "getInbounds was rejected with message '" + sMessage + "'.");
                })
                .done(function(aInbounds) {
                    // Assert
                    start();
                    ok(sap.ushell.Container.getService.calledWith("CommonDataModel"));
                    deepEqual(aInbounds, oFixture.expectedInbounds, "ok");
                });
        });
    });

    asyncTest("getInbounds rejects as expected when CDM site promise rejects", function () {
        // Arrange
        var oCDMServiceStub = {
            getSite: function() {
                return new jQuery.Deferred().reject("deliberate error").promise();
            }
        };

        sinon.stub(sap.ushell.Container, "getService").returns(oCDMServiceStub);

        this.oAdapter.getInbounds()
            .fail(function(sMessage) {
                ok(true, "promise was rejected");

                strictEqual(sMessage, "deliberate error",
                    "promise was rejected with the expected error message");
            })
            .done(function(aInbounds) {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    test("_formatOSite: returns an empty array when called with undefined", function() {
        var oFormattedSite = this.oAdapter._formatOSite(/* undefined */);
        deepEqual(oFormattedSite, [], "got empty array");
    });

    test("_formatOSite", function() {
        var res = this.oAdapter._formatOSite(O_CDM_SITE);
        var O_CDM_FORMATTED_AINBOUNDS = [{
            "action": "viaStatic",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "resolutionResult": {
                "applicationType": "WDA",
                "sap.wda": undefined,
                "systemAlias": "U1YCLNT000",
                "text": "translated title of application"
            },
            "semanticObject": "App1",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "tileResolutionResult": {
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "isCustomTile": false,
                "size": undefined,
                "subtitle": undefined,
                "tileComponentLoadInfo": "#Shell-staticTile",
                "title": "translated title of application"
            },
            "title": "translated title of application"
        }, {
            "action": "viaStatic",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "resolutionResult": {
                "applicationType": "WDA",
                "sap.wda": undefined,
                "systemAlias": "U1YCLNT000",
                "text": "translated title of application"
            },
            "semanticObject": "App1",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "tileResolutionResult": {
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "isCustomTile": false,
                "size": undefined,
                "subtitle": undefined,
                "tileComponentLoadInfo": "#Shell-staticTile",
                "title": "translated title of application"
            },
            "title": "translated title of application"
        }, {
            "action": "tosu01",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": true // overridden by inbound entry in site
            },
            "resolutionResult": {
                "applicationType": "TR",
                "sap.gui": {
                    "transaction": "SU01"
                },
                "systemAlias": "U1YCLNT111",
                "text": "Maintain users"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "sap-system": {
                        "defaultValue": {
                            "value": "U1YCLNT111"
                        }
                    }
                }
            },
            "tileResolutionResult": {
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "isCustomTile": false,
                "size": undefined,
                "subtitle": "Maintain users",
                "tileComponentLoadInfo": "#Shell-staticTile",
                "title": "Maintain users"
            },
            "title": "Maintain users"
        }, {
            "action": "customTile",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "resolutionResult": {
                "applicationType": "URL",
                "componentName": "sap.ushell.demotiles.cdm.customtile",
                "componentProperties": {
                    "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    }
                },
                "systemAlias": undefined,
                "text": "Custom Dynamic App Launcher",
                "url": "../../../../sap/ushell/demotiles/cdm/customtile"
            },
            "semanticObject": "My",
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {}
            },
            "tileResolutionResult": {
                "icon": "sap-icon://time-entry-request",
                "indicatorDataSource": {
                    "path": "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                    "refresh": 900
                },
                "isCustomTile": true,
                "size": "1x1",
                "subtitle": "slow refresh (15 min)",
                "targetOutbound": {
                    "action": "toappnavsample",
                    "parameters": {
                        "XXX": {
                            "value": "yyy"
                        }
                    },
                    "semanticObject": "Action"
                },
                "tileComponentLoadInfo": {
                    "applicationType": "URL",
                    "componentName": "sap.ushell.demotiles.cdm.customtile",
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                        }
                    },
                    "systemAlias": undefined,
                    "text": "Custom Dynamic App Launcher",
                    "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                },
                "title": "Custom Dynamic App Launcher"
            },
            "title": "Custom Dynamic App Launcher"
        }, {
            "action": "toappnavsample",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                "applicationDependencies": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "applicationType": "SAPUI5",
                "componentProperties": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                "systemAlias": undefined,
                "text": "This AppNavSample action has a special default value, but requires /ui2/par",
                "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },

            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "/ui2/par": {
                        "required": true
                    },
                    "aand": {
                        "defaultValue": {
                            "value": "ddd=1234"
                        }
                    }
                }
            },
            "tileResolutionResult": {
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "isCustomTile": false,
                "size": undefined,
                "subtitle": "AppNavSample",
                "tileComponentLoadInfo": "#Shell-staticTile",
                "title": "This AppNavSample action has a special default value, but requires /ui2/par"
            },
            "title": "This AppNavSample action has a special default value, but requires /ui2/par"
        }, {
            "action": "toappnavsample",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                "applicationDependencies": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "applicationType": "SAPUI5",
                "componentProperties": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                "systemAlias": undefined,
                "text": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1": {
                        "renameTo": "P1New"
                    }
                }
            },
            "tileResolutionResult": {
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "isCustomTile": false,
                "size": undefined,
                "subtitle": "AppNavSample",
                "tileComponentLoadInfo": "#Shell-staticTile",
                "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
            },
            "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
        },
    {
      "action": "launchURL",
      "deviceTypes": {
        "desktop": true,
        "phone": false,
        "tablet": false
      },
      "resolutionResult": {
        "applicationType": "URL",
        "sap.platform.runtime": {
          "uri": "http://nytimes.com",
          "url": "http://nytimes.com"
        },
        "systemAlias": undefined,
        "text": "Demo starting foreign URI",
        "uri": "http://nytimes.com",
        "url": "http://nytimes.com"
      },
      "semanticObject": "Shell",
      "signature": {
        "additionalParameters": "ignored",
        "parameters": {
          "sap-external-url": {
            "filter": {
              "value": "http://www.nytimes.com"
            },
            "required": true
          }
        }
      },
      "tileResolutionResult": {
        "icon": "sap-icon://Fiori2/F0018",
        "indicatorDataSource": undefined,
        "isCustomTile": false,
        "size": undefined,
        "subtitle": "A uri",
        "tileComponentLoadInfo": "#Shell-staticTile",
        "title": "Demo starting foreign URI"
      },
      "title": "Demo starting foreign URI"
    }
  ];
        QUnit.dump.maxDepth = 10;
        deepEqual(res, O_CDM_FORMATTED_AINBOUNDS, "formatted site ok");
    });

    test("_formatOSite with exception", function() {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(this.oAdapter, "_formatApplicationType").throws("Deliberate Exception");

        var aInbounds = this.oAdapter._formatOSite(O_CDM_SITE);
        deepEqual(aInbounds, [], "obtained the expected response in case of error");

        strictEqual(jQuery.sap.log.error.callCount, 6, "jQuery.sap.log.error was called once");

        [
            "Error in application AppDesc1: Deliberate Exception",
            "Error in application X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY: Deliberate Exception",
            "Error in application customtile1component: Deliberate Exception",
            "Error in application sap.ushell.demo.AppNavSample: Deliberate Exception",
            "Error in application sap.ushell.demo.startURL: Deliberate Exception",
            "Error in application shellPluginToBeIgnored: Deliberate Exception"
        ].forEach(function (sError, iIdx) {
            strictEqual(jQuery.sap.log.error.getCall(iIdx).args[0], sError, "got expected first argument on call " + iIdx + " of jQuery.sap.log.error");
        });
    });

}());
