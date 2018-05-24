 // @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.NavTargetResolution and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, module,
      ok, start, throws, strictEqual, stop, test, jQuery, sap, sinon,
      window */

    var I_LONG_HASH_LENGTH = 2048,
        I_COMPACT_HASH_LENGTH_MAX = 1024;

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.NavTargetResolution");
    jQuery.sap.require("sap.ushell.adapters.local.NavTargetResolutionAdapter");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    //clear local storage before running the tests
    if (window.localStorage) {
        window.localStorage.clear();
    }

    // we use a custom adapter as spy and stub
    var theLastHashFragment = null,
        sCachedConfig;
    jQuery.sap.declare("sap.ushell.unittest.NavTargetResolutionAdapterStub");
    sap.ushell.unittest.NavTargetResolutionAdapterStub = function () {
        this.resolveHashFragment = function (sHashFragment) {
            theLastHashFragment = sHashFragment;
            return (new jQuery.Deferred()).resolve("resolvedTo:" + sHashFragment).promise();
        };
    };

    function getClientSideTargetResolutionConfig(bClientSideTargetResolutionEnabled) {
        // enable ClientSideTargetResolution from configuration by default
        if (typeof bClientSideTargetResolutionEnabled === "undefined") {
            bClientSideTargetResolutionEnabled = true;
        }

        return {
            config: { enableClientSideTargetResolution: bClientSideTargetResolutionEnabled }
        };
    }

    module(
        "sap.ushell.services.NavTargetResolution",
        {
            setup : function () {
                // the config has to be reset after the test
                if (!sCachedConfig) {
                    sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
                }

                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            adapter: {
                                config: {
                                    applications: {}
                                }
                            },
                            config: {
                                allowTestUrlComponentConfig : true,
                                runStandaloneAppFolderWhitelist: {
                                    "/sap/bc/ui5_ui5/" : true,
                                    "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                    "ABC" : true,
                                    "ABC/def" : true,
                                    "/a/b/c" : true,
                                    "abc/def" : true
                                }
                            }
                        }
                    }
                };
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = JSON.parse(sCachedConfig);
                sap.ushell.test
                    .restoreSpies(
                        jQuery.sap.getUriParameters
                    );
                delete sap.ushell.Container;
            },
            after : function () {
                if (window.localStorage) {
                    window.localStorage.clear();
                }
            }
        }
    );

    test("singleton instantiated", function () {
        sap.ushell.bootstrap("local");
        // modules cannot be unloaded; so this test should be the first in order
        ok(typeof sap.ushell.Container.getService("NavTargetResolution") === "object");
    });

    function evalNow(oPromise) {
        var res, bIsDone = false;
        oPromise.done(function (pRes) {
            res = pRes;
            bIsDone = true;
        });
        oPromise.fail(function (pRes) {
            ok(false, "done expected");
        });
        ok(bIsDone, "done has been called");
        return res;
    }

    function testFailed(oPromise) {
        var res, bHasBeenFailed = false;
        oPromise.done(function (pRes) {
            ok(false, "fail expected");
        });
        oPromise.fail(function (pRes) {
            res = pRes;
            bHasBeenFailed = true;
        });
        ok(bHasBeenFailed, "failed");
        return res;
    }

    [
        {
            testDescription: "config option is true",
            vConfigOption: true,
            expectedResult: true
        },
        {
            testDescription: "config option is false",
            vConfigOption: false,
            expectedResult: false
        },
        {
            testDescription: "config option is 'true'",
            vConfigOption: false,
            expectedResult: false  // not a string
        }
    ].forEach(function(oFixture) {
        test("_isClientSideTargetResolutionEnabled: result is as expected when " + oFixture.testDescription, function () {
            var oNavTargetResolutionService;

            // Arrange
            window["sap-ushell-config"].services.NavTargetResolution.config.enableClientSideTargetResolution = oFixture.vConfigOption;

            // Act
            sap.ushell.bootstrap("local");
            oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");

            // Assert
            strictEqual(oNavTargetResolutionService._isClientSideTargetResolutionEnabled(), oFixture.expectedResult, "expected result returned");
        });
    });

    test("Test-config", function () {
        var oNt,
            res;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-config");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            "applicationType": "URL",
            "navigationMode": "embedded",
            "url": "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
            "ui5ComponentName": "sap.ushell.demoapps.FioriSandboxConfigApp"
        });
    });

    test("Test-Local resolution nothing defined", function () {
        var oNt,
            res;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution", function () {
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            deepEqual(res2, obj);
        });
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution cross domain (bad-, good-, cleartest)", function () {
        var oNt,
            obj,
            sURL,
            res;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        //bad case
        sURL = "https://www.bbc.co.uk/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            ok(false, "should not reach this section");
        });
        res.fail(function (sMsg) {
            deepEqual(sMsg, "URL is not resolvable", "sMsg does not have the proper value");
        });
        //good case
        sURL = window.location.origin + "/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            deepEqual(res2.url, sURL, "url is filled with same domain url");
        });
        res.fail(function (sMsg) {
            ok(false, "good case");
        });
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution undefined url", function () {
        var oNt,
            obj,
            sURL,
            res;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        //good case
        sURL = undefined; // window.location.origin + "/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });


    test("Test-url resolution", function () {
        var oNt,
            res,
            oGet,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("sap-system") >= 0) {
                    return null;
                }
                return "/a/b/c";
            }
        };
        sap.ushell.bootstrap("local");
        sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=abc",
            "applicationType": "URL",
            "url": "/a/b/c",
            "navigationMode": "embedded",
            "ui5ComponentName": "abc"
        });
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Test-url resolution - reject non-whitelisted folder", function () {
        var oNt,
            res,
            oGet,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("sap-system") >= 0) {
                    return null;
                }
                return "/not/in/whitelist";
            }
        };
        sap.ushell.bootstrap("local");
        sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message");
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Test-url resolution - allow all folders", function () {
        var oNt,
            res,
            oGet,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("sap-system") >= 0) {
                    return null;
                }
                return "/any/folder/for/wildcard/whitelist";
            }
        };
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    adapter: {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "allowTestUrlComponentConfig" : true,
                        "runStandaloneAppFolderWhitelist": {
                            "*" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=abc",
            "applicationType": "URL",
            "url": "/any/folder/for/wildcard/whitelist",
            "navigationMode": "embedded",
            "ui5ComponentName": "abc"
        });
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url hash params)", function () {
        var oNt,
            res,
            orgfct,
            sMsg;

        sap.ushell.bootstrap("local");
        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": "/a/b/c?AA=BB&CCC=EEEE&ABC=XXX",
            "navigationMode": "embedded",
            "ui5ComponentName": "xxx"
        }, res);
        res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url hash params 1)", function () {
        var oNt,
            res,
            orgfct;

        sap.ushell.bootstrap("local");
        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc&AAA=XXX");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": "/a/b/c?AAA=XXX",
            "navigationMode": "embedded",
            "ui5ComponentName": "xxx"
        });
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url params)", function () {
        var oNt,
            res,
            oGet,
            sMsg;
        sap.ushell.bootstrap("local");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("SAPUI5.Component") >= 0) {
                    return "xyz";
                }
                if (s.indexOf("sap-system") >= 0) {
                    return null;
                }
                return "/a/b/c";
            }
        };
        sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=xyz",
            "applicationType": "URL",
            "url": "/a/b/c",
            "navigationMode": "embedded",
            "ui5ComponentName": "xyz"
        });
        res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (prevent cross domain injection)", function () {
        var oNt,
            res,
            orgfct,
            sMsg;
        sap.ushell.bootstrap("local");
        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=http%3A%2F%2Fwww.google.de%2Fso%2Fnicht&AAA=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message"); //different domain, URL is empty,
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (allow same domain injection)", function () {
        var oNt,
            res,
            orgfct;

        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    adapter: {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc/def") + "nicht&AAA=XXX");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": window.location.origin + "/abc/def" + "nicht?AAA=XXX",
            "navigationMode": "embedded",
            "ui5ComponentName": "xxx"
        });
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (prevent bad folder)", function () {
        var oNt,
            res,
            orgfct,
            sMsg;
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    "adapter": {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc") + "nicht&AAA=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def",
        "../../relative/path"
    ].forEach(function (sFolder) {
        test("Shell-runStandaloneApp resolution (allow all folders " + sFolder + " - '*')", function () {
            var oNt,
                res,
                orgfct;

            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                "*" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");
            orgfct = jQuery.sap.getUriParameters;
            sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
            res = evalNow(res);
            //deepEqual(sMsg, "done has been called", "correct error message");
            deepEqual(res, {
                "additionalInformation": "SAPUI5.Component=xxx",
                "applicationType": "URL",
                "url": sFolder + "nicht?AAA=XXX",
                "navigationMode": "embedded",
                "ui5ComponentName": "xxx"
            });
        });
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def"
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (allow good folder " + sFolder + ")", function () {
            var oNt,
                res,
                orgfct;
            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "def/hij" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");
            orgfct = jQuery.sap.getUriParameters;
            sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "&AAA=XXX");
            res = evalNow(res);
            deepEqual(res, {
                "additionalInformation": "SAPUI5.Component=xxx",
                "applicationType": "URL",
                "url": sFolder + "?AAA=XXX",
                "navigationMode": "embedded",
                "ui5ComponentName": "xxx"
            });
            jQuery.sap.getUriParameters.restore();
        });
    });


    //own test
    [
        window.location.origin + "/abc",
        window.location.origin + "/abc/../def", // .. escape not possible
        window.location.origin + "/ABC/def",   // case sensitive
        window.location.origin + "/my/evil/folder/abc/und", // legal deep inside
        "/abc",
        "/abc/../def", // .. escape not possible
        "/ABC/def",   // case sensitive
        "/my/evil/folder/abc/und" // legal deep inside
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (prevent bad folder " + sFolder + ")", function () {
            var oNt,
                res,
                orgfct,
                sMsg;

            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/ABC/" : false,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");
            orgfct = jQuery.sap.getUriParameters;
            sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
            sMsg = testFailed(res);
            deepEqual(sMsg, "URL is not resolvable", "correct error message");
            jQuery.sap.getUriParameters.restore();
        });
    });

    asyncTest("Test - postProcess resolutionResults hook hook modifies response", function () {
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local");
        var oAdapter = {
                processPostResolution : function(a,b) {
                    return new jQuery.Deferred().resolve({ "url": "andnowforsomethingcompletelydifferent", "applicationType": "SAPUI5"} ).promise();
                }
            };
        var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
        oNt = new sap.ushell.services.NavTargetResolution(oAdapter, undefined, undefined, window["sap-ushell-config"].services.NavTargetResolution);
        oNt.resolveHashFragment("#Test-clear");
        obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            ok(oPostFilterSpy.called, "postFilter Called");
            deepEqual(res2, {
                "applicationType": "URL",
                "navigationMode": "newWindow",
                "url": "andnowforsomethingcompletelydifferent"
              }, "expected modified result");
            start();
        }).fail(function() {
            ok(false, "should not get here");
            start();
        });
    });
    asyncTest("Test - processPostResolution resolutionResults can convert success to failure", function () {
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local");
        var oAdapter = {
                processPostResolution : function(a,b) {
                    return new jQuery.Deferred().reject("Oh No");
                }
            };
        var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
        oNt = new sap.ushell.services.NavTargetResolution(oAdapter, undefined, undefined, window["sap-ushell-config"].services.NavTargetResolution);
        oNt.resolveHashFragment("#Test-clear");
        obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        //sap.ushell.adapters.local.NavTargetResolutionAdapter.prototype.postFilterResolutionResult = o.postFilterResolutionResult.bind(o);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            ok(false, "should not get here");
        }).fail(function(sMsg) {
            equal(sMsg, "Oh No", "correct error message");
            ok(oPostFilterSpy.called, "postFilter Called");
            oPostFilterSpy.args[1][1].done(function(res3) {
                deepEqual(res3, obj, " initial resolution");
                start();
            });
        });
    });
    asyncTest("Test - processPostResolution resolutionResults can convert failure to success", function () {
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local");
        var oAdapter = {
                processPostResolution : function(a,b) {
                    var a = new jQuery.Deferred();
                    b.fail(function (sMessage) {
                        a.resolve({ "url": "andnowforsomethingcompletelydifferent", "applicationType": "SAPUI5"} ).promise();
                    });
                    return a.promise();
                }
            };
        var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
        oNt = new sap.ushell.services.NavTargetResolution(oAdapter, undefined, undefined,undefined); //
        oNt.resolveHashFragment("#Test-clear");
        obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            ok(oPostFilterSpy.called, "postFilter Called");
            equal(oPostFilterSpy.args[1][0],"#Test-local1", "first arugment ok");
            equal(oPostFilterSpy.args[1][1].state(), "rejected", "original promise was rejected");
            deepEqual(res2, {
                "applicationType": "URL",
                "navigationMode": "newWindow",
                "url": "andnowforsomethingcompletelydifferent"
              }, "expected modified result");
            start();
        }).fail(function() {
            ok(false, "should not get here");
            start();
        });
    });

    test("Test- empty hash default", function () {
        var oNt,
            res,
            oGet;

        sap.ushell.bootstrap("local");
        sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("");
        res = evalNow(res);
        deepEqual(undefined, res);
        jQuery.sap.getUriParameters.restore();
    });

    test("Test register ok", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = { name : "ResolverA",
                resolveHashFragment : function () { return {}; },
                isApplicable : function () { return false; }};
        deepEqual(true, oNt.registerCustomResolver(obj));
    });

    test("Test register no name", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = { //name : "ResolverA",
            resolveHashFragment : function () { return {}; },
            isApplicable : function () { return false; }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("Test register no isApplicable", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = {
            name : "ResolverA",
            resolveHashFragment : function () { return {}; }
            //isApplicable : function () { return false; }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("Test register wrong resolveHashFragment", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("local");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        obj = {
            name : "ResolverA",
            resolveHashFragment : {},
            isApplicable : function () {
                return false;
            }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("getCurrentResolution", function () {
        var oResolution = {},
            oNTRAdapter = {
                resolveHashFragment: function () {
                    var oDeferred = new jQuery.Deferred();

                    oDeferred.resolve(oResolution);
                    return oDeferred.promise();
                }
            },
            oNavTargetResolutionService = new sap.ushell.services.NavTargetResolution(oNTRAdapter);

        sap.ushell.bootstrap("local");

        strictEqual(oNavTargetResolutionService.getCurrentResolution(), undefined,
            "undefined if no resolution performed");

        oNavTargetResolutionService.resolveHashFragment("#foo");
        strictEqual(oNavTargetResolutionService.getCurrentResolution(), oResolution,
            "returns result of previous resolve");
    });

    module(
        "sap.ushell.services.NavTargetResolution.LocalResolver",
        {
            setup : function () {
                // the config has to be reset after the test
                if (!sCachedConfig) {
                    sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
                }

                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            adapter : {
                                config: {
                                    applications: {}
                                },
                                module: "sap.ushell.unittest.NavTargetResolutionAdapterStub"
                            },
                            config : {
                                resolveLocal : [ {
                                    "linkId" : "Rabbit-run",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=Rabidrun",
                                        applicationType : "URL",
                                        url : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
                                    }
                                }, {
                                    "linkId" : "Snake-bite",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=BooAh",
                                        applicationType : "URL",
                                        url : "../con/stric/tor"
                                    }
                                }]
                            }
                        }
                    }
                };
                sap.ushell.bootstrap("local");
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = JSON.parse(sCachedConfig);
                delete sap.ushell.Container;
                sap.ushell.test.restoreSpies(
                    jQuery.sap.log.warning,
                    jQuery.sap.log.error
                );
            }
        }
    );

    asyncTest("localResolve - multiple targets", function () {
        var res,
            oNavTargetResolutionService;

        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run");
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=Rabidrun");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Snake-bite");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=BooAh");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Some-action");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "#Some-action");
            equal(sArg, "resolvedTo:#Some-action");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
    });

    [
        {
            "desc" : "middle",
            "hash" : "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C&C=D",
            "strippedHash" : "#Rabbit-run?A=B&C=D",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D"
        },
        {
            "desc" : "single",
            "hash" : "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C",
            "strippedHash" : "#Rabbit-run",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
        },
        {
            "desc" : "end",
            "hash" : "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C",
            "strippedHash" : "#Rabbit-run?A=B",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B"
        },
        {
            "desc" : "front",
            "hash" : "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C&C=D",
            "strippedHash" : "#Rabbit-run?C=D",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&C=D"
        }
    ].forEach(function(oFixture) {
        test("Resolution, error message and empty result if sap-ushell-enc-test present and malformatted " + oFixture.desc, function () {
            var oNt,
                res,
                orgfct,
                spyInvokeResolveHashChain = sinon.spy(sap.ushell.Container.getService("NavTargetResolution"),"_invokeResolveHashChain"),
                spyMessageService = sinon.stub(sap.ushell.Container.getService('Message'), "error");

            orgfct = jQuery.sap.getUriParameters;
            sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment(oFixture.hash);
            equal(spyInvokeResolveHashChain.args[0][0], oFixture.strippedHash, "correct stripped hash");
            res = evalNow(res);
            deepEqual(res, {
                "additionalInformation": "SAPUI5.Component=Rabidrun",
                "applicationType": "URL",
                "url": oFixture.url,
                "navigationMode": "embedded",
                "ui5ComponentName": "Rabidrun"
            }, " correct result");
            jQuery.sap.getUriParameters.restore();
            ok(spyMessageService.calledWith("This navigation is flagged as erroneous because" +
                                " (likely the calling procedure) generated a wrong encoded hash." +
                                " Please track down the encoding error and make sure to use the CrossApplicationNavigation service for navigation.",
                                    "Navigation encoding wrong"), "Error method was called as expected");
            spyMessageService.restore();
        });
    });

    test("Resolution, correct sap-ushell-enc-test is removed from url parameters and normal processing ensues", function () {
        var oNt,
            res,
            orgfct;

        orgfct = jQuery.sap.getUriParameters;
        sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Rabbit-run?A=B&sap-ushell-enc-test=A%20B%2520C&C=D");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=Rabidrun",
            "applicationType": "URL",
            "url": "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D",
            "navigationMode": "embedded",
            "ui5ComponentName" : "Rabidrun"
        }, "correct result");
        jQuery.sap.getUriParameters.restore();
    });


    asyncTest("resolution with Adapter parameter Expansion", function () {
        var res,
            oNavTargetResolutionService,
            oAppState,
            sKey,
            sInputHash,
            oDummyAdapter;
        oDummyAdapter = {
            resolveHashFragment : function (sHash) {
                var deferred = new jQuery.Deferred();
                sInputHash = sHash;
                deferred.resolve({ url : sHash, additionalInformation : "SAPUI5.Component=FunAtWork", text : "A text"});
                return deferred.promise();
            }
        };
        oNavTargetResolutionService = new sap.ushell.services.NavTargetResolution(oDummyAdapter);
        res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33");
        res.done(function (sArg) {
            start();
            equal(sInputHash, "#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33", "no expansion");
            equal(sArg.additionalInformation, "SAPUI5.Component=FunAtWork", "URL Unexpanded");
            equal(sArg.text, "A text", "text ok");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        oAppState = sap.ushell.Container.getService("AppState").createEmptyAppState(new sap.ui.core.UIComponent());
        sKey = oAppState.getKey();
        oAppState.setData("xxx=1234&Aaa=444");
        oAppState.save().done(function () {
            var res;
            sap.ushell.services.AppState.WindowAdapter.prototype.data._clear(); //remove app state from window object
            res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=" + sKey + "&FFF=33");
            res.done(function (sArg) {
                //start();
                equal(sInputHash, "#Rabbit-run?AAA=33&Aaa=444&FFF=33&ZZZ=44&xxx=1234", "url expanded");
                equal(sArg.additionalInformation, "SAPUI5.Component=FunAtWork", "additional info ok");
            }).fail(function (sMessage) {
                start();
                ok(false, "service invocation failed: " + sMessage);
            });
        });
        ok(true, "reached end of test");
    });

    [
        {
            testDescription: "ClientSideTargetResolution is enabled",
            bClientSideTargetResolutionEnabled: true,
            expectedAdapterCalls: 0,
            expectedCSTRCalls: 1
        },
        {
            testDescription: "ClientSideTargetResolution is disabled",
            bClientSideTargetResolutionEnabled: false,
            expectedAdapterCalls: 1,
            expectedCSTRCalls: 0
        }
    ].forEach(function (oFixture) {
        asyncTest("getDistinctSemanticObjects: calls methods from the right service when " + oFixture.testDescription, function () {
            var oCSTRGetDistinctSemanticObjectsStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetDistinctSemanticObjects = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterFake = {
                    getDistinctSemanticObjects: oAdapterGetDistinctSemanticObjects
                },
                oNavTargetResolution = new sap.ushell.services.NavTargetResolution(
                    oAdapterFake,
                    undefined,
                    undefined,
                    getClientSideTargetResolutionConfig(oFixture.bClientSideTargetResolutionEnabled)
                );

            sinon.stub(sap.ushell.Container, "getService")
                .withArgs("ClientSideTargetResolution").returns({
                    getDistinctSemanticObjects: oCSTRGetDistinctSemanticObjectsStub
                });

            oNavTargetResolution.getDistinctSemanticObjects()
                .done(function () {
                    ok(true, "promise was resolved");

                    strictEqual(oCSTRGetDistinctSemanticObjectsStub.getCalls().length, oFixture.expectedCSTRCalls,
                        "ClientSideTargetResolution#getDistinctSemanticObjects was called once");

                    strictEqual(oAdapterGetDistinctSemanticObjects.getCalls().length, oFixture.expectedAdapterCalls,
                        "NavTargetResolutionAdapter#getDistinctSemanticObjects was not called");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("getDistinctSemanticObjects: does not require ClientSideTargetResolution if it is disabled", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({}, // an adapter without methods
            undefined,
            undefined,
            getClientSideTargetResolutionConfig(false /* ClientSideTargetResolution disabled */ )
        );

        sinon.spy(sap.ushell.Container, "getService");
        sinon.stub(jQuery.sap.log, "error"); // do not log to the console during the test

        oNavTargetResolution.getDistinctSemanticObjects()
            .always(function () {
                strictEqual(
                    sap.ushell.Container.getService.calledWith("ClientSideTargetResolution"),
                    false,
                    "sap.ushell.Container.getService('ClientSideTargetResolution') was not called"
                );

                start();
            });


    });

    asyncTest("getDistinctSemanticObjects: logs an error when client side target resolution is disabled and method from the adapter is not implemented", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution(
                {}, // an adapter without methods
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false /* ClientSideTargetResolution disabled */)
            );

        sinon.stub(jQuery.sap.log, "error");

        oNavTargetResolution.getDistinctSemanticObjects()
            .done(function () {
                ok(false, "promise was rejected");
            })
            .fail(function () {
                var aCalls;

                ok(true, "promise was rejected");

                aCalls = jQuery.sap.log.error.getCalls();

                strictEqual(aCalls.length, 1, "jQuery.sap.log.error was called once");

                if (aCalls.length === 1) {
                    deepEqual(
                        aCalls[0].args, [
                            "Cannot execute getDistinctSemanticObjects method",
                            "ClientSideTargetResolution must be enabled or NavTargetResolutionAdapter must implement getDistinctSemanticObjects method",
                            "sap.ushell.services.NavTargetResolution"
                        ],
                        "jQuery.sap.log.error was called with the expected arguments"
                    );
                }

            })
            .always(function () {
                start();
            });
    });

    asyncTest("getLinks: uses ClientSideTargetResolution when enabled by configuration", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub,
                getLinks: oAdapterGetLinksStub
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oAdapterFake, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 1,
                    "ClientSideTargetResolution#getLinks was called once");

                deepEqual(
                    oClientSideGetLinksStub.getCall(0).args, [oGetLinksArgs],
                    "ClientSideTargetResolution#getLinks was called with expected arguments"
                );

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(oAdapterGetLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getLinks was not called");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("getLinks: uses adapter getLinks method when ClientSideTargetResolution is disabled by configuration", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub,
                getLinks: oAdapterGetLinksStub
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(
                oAdapterFake,
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false)
            );

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                    "ClientSideTargetResolution#getLinks was called once");

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(oAdapterGetLinksStub.getCalls().length, 1,
                    "NavTargetResolutionAdapter#getLinks was not called");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("getLinks: uses adapter getSemanticObjectLinks method when ClientSideTargetResolution is disabled by configuration and getLinks is not implemented in adapter", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub
                // getLinks is not implemented in this adapter
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(
                oAdapterFake,
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false)
            );
        oAdapterGetLinksStub = oAdapterGetLinksStub;
        sinon.stub(jQuery.sap.log, "warning");

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                    "ClientSideTargetResolution#getLinks was called once");

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 1,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was called once");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    [
        undefined,
        "actionValue",
        null
    ].forEach(function (sFixture) {
        asyncTest("getLinks: uses adapter getSemanticObjectLinks method and warns (because of action parameter) when ClientSideTargetResolution is disabled by configuration, getLinks is not implemented in adapter and action is " + Object.prototype.toString.apply(sFixture), function () {
            var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                //oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterFake = {
                    getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub
                    // getLinks is not implemented in this adapter
                },
                oGetLinksArgs = {
                    semanticObject: "Object",
                    params: [],
                    ignoreFormFactor: false,
                    action: sFixture
                },
                oNavTargetResolution = new sap.ushell.services.NavTargetResolution(
                    oAdapterFake,
                    undefined,
                    undefined,
                    getClientSideTargetResolutionConfig(false)
                );
            sinon.stub(jQuery.sap.log, "warning");

            sinon.stub(sap.ushell.Container, "getService")
                .withArgs("ClientSideTargetResolution").returns({
                    getLinks: oClientSideGetLinksStub
                })
                .withArgs("URLParsing").returns({
                    parseShellHash: sinon.stub().returns({params: []})
                })
                .withArgs("ShellNavigation").returns({
                    hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
                });

            oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
                .done(function () {
                    ok(true, "promise was resolved");

                    strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                        "ClientSideTargetResolution#getLinks was called once");

                    strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 1,
                        "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                    strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");

                    deepEqual(jQuery.sap.log.warning.getCall(0).args, [
                        "A problem occurred while determining the resolver for getLinks",
                        "the action argument was given, however, NavTargetResolutionAdapter does not implement getLinks method. Action will be ignored.",
                        "sap.ushell.services.NavTargetResolution"
                    ], "jQuery.sap.log.warning was called with the expected arguments");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });


    });

    [
        undefined,
        {
            A: "B",
            C: ["e'e", "j j"]
        }
    ].forEach(function(oFixture) {
        test("getLinks" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;

            // prepare test
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

            // code under test
            throws(function () {
                oNavTargetResolution.getLinks({ semanticObject: "Action?foo" });
            }, /Parameter must not be part of semantic object/);

            oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true
            });

            // test
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledWithExactly("Action", mParameters, true));
        });
    });

    [ undefined, {
        A: "B",
        C: ["e'e", "j j"]
    }].forEach(function (oFixture) {
        test("getLinks with appState" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oExpectedParams,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;
            // prepare test
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

            // code under test
            throws(function () {
                oNavTargetResolution.getLinks({ semanticObject: "Action?foo" });
            }, /Parameter must not be part of semantic object/);
            oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: undefined,
                appStateKey: "AKEY"
            });

            oExpectedParams = oFixture || {};
            oExpectedParams["sap-xapp-state"] = "AKEY";
            // test
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks
                .calledWithExactly("Action", oExpectedParams, true));
        });
    });

    [{
        A: "B",
        C: ["e'e", "j j",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894"
            ]
    }].forEach(function (oFixture) {
        asyncTest("getLinks with appState and long url" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oExpectedParams,
                oPromise,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;
            // prepare test
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);
            // code under test
            oPromise = oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: undefined,
                appStateKey: "AKEY"
            });
            oPromise.fail(function () {
                start();
                ok(false, "should succeed!");
            }).done(function () {
                start();
                oExpectedParams = oFixture || {};
                oExpectedParams["sap-xapp-state"] = "AKEY";
                // test
                ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
                equal(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][0], "Action", "first arg ok");
                ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][1]["sap-intent-param"] !== undefined, "shortening occurred");
                equal(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][1]["sap-intent-param"].length, 1, "shortening occurred (key present)");
            });
            ok(true, "reached end");
        });
    });

    asyncTest("getLinks returns non-compacted intents when bCompactIntents is false", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i,
            iVeryLongUrlLength;

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");
        iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: false
        }); // NOTE: no compaction
        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            for (i = 0; i < aResults.length; i++) {
                strictEqual(aResults[i].intent.length, iVeryLongUrlLength, "intent in result " + i + " was not compacted");
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks returns compacted intents when bCompactIntents is true", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i;

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true
        }); // NOTE: compaction
        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            for (i = 0; i < aResults.length; i++) {
                ok(aResults[i].intent.length <= I_COMPACT_HASH_LENGTH_MAX , "intent in result " + i + " is shorter than " + I_COMPACT_HASH_LENGTH_MAX + " characters");
                ok(aResults[i].intent.indexOf("sap-intent-param") > 0, "sap-intent-param was found in the shortened intent of result " + i);
                ok(aResults[i].intent.match(/^#.+-.+[?].*/), "shortened intent " + aResults[i].intent + " has valid format");
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks still resolves promise when bCompactIntents is true and ShellNavigation#compactParams fails", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i,
            iVeryLongUrlLength;

        sinon.stub(jQuery.sap.log, "warning");
        sinon.stub(jQuery.sap.log, "error");

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");
        iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({
                    semanticObject: "Object",
                    action: "action"
                })
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(
                    new jQuery.Deferred().resolve({hash: "#Action-dummyAction?sap-xapp-state=AKEY", params: undefined, skippedParams: undefined}).promise()),
                compactParams: sinon.stub().returns(new jQuery.Deferred().reject("Error occurred").promise()) // NOTE: fails!
            });

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true  // NOTE: compaction
        });

        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            var aCallArgs;

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            strictEqual(jQuery.sap.log.warning.getCalls().length, 3, "jQuery.sap.log.warning was called 3 times");
            strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was called 0 times");
            for (i = 0; i < aResults.length; i++) {
                ok(aResults[i].intent.length == iVeryLongUrlLength, "intent in result " + i + " is returned unshortened");
                strictEqual(aResults[i].intent.indexOf("sap-intent-param"), -1, "sap-intent-param was not found in unshortened intent");

                aCallArgs = jQuery.sap.log.warning.getCall(i).args;

                strictEqual(aCallArgs[0], "Cannot shorten GetSemanticObjectLinks result, using expanded form",
                    "first argument of warning function is as expected for result " + i);

                ok(aCallArgs[1].match(/^Failure message: Error occurred; intent had title.*and link.*$/),
                    "second argument of warning function is in expected format for result " + i);

                strictEqual(aCallArgs[2], "sap.ushell.services.NavTargetResolution",
                    "third argument of warning function is as expected for result " + i);
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks with withAtLeastOneParam argument calls ClientSideTargetResolution as expected", function () {
        var oNavTargetResolution,
            mParameters = {
                A: "B",
                C: ["e'e", "j j"]
            },
            oCSTRGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise());

        // prepare test
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution();

        sinon.stub(oNavTargetResolution, "_isClientSideTargetResolutionEnabled")
            .returns(true);

        var fnGetServiceOrig = sap.ushell.Container.getService;
        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {

            if (sServiceName === "ClientSideTargetResolution") {
                return { // fake ClientSideTargetResolution
                    getLinks: oCSTRGetLinksStub
                };
            }

            // return fnGetServiceOrig.call(sap.ushell.Container, sServiceName);
            if (sServiceName === "ShellNavigation") {
                return { // fake ShellNavigation
                    hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({
                        hash: "#Action-dummyAction?A=B&C=e'e&C=j%2520j&sap-xapp-state=AKEY",
                        params: undefined,
                        skippedParams: undefined
                    }).promise())
                };
            }
            if (sServiceName === "URLParsing") {
                return fnGetServiceOrig.call(sap.ushell.Container, sServiceName);
            }

            ok(false, "Service " + sServiceName + " is not used in this test");
        });

        // code under test
        oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: mParameters,
            withAtLeastOneParam: true,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        })
        .always(function () {

            strictEqual(oCSTRGetLinksStub.getCalls().length, 1,
                "ClientSideTargetResolution#getLinks was called 1 time");

            deepEqual(oCSTRGetLinksStub.getCall(0).args, [{
                semanticObject: "Action",
                params: mParameters,
                withAtLeastOneParam: true,
                ignoreFormFactor: true,
                appStateKey: "AKEY",
                ui5Component: undefined
            }], "ClientSideTargetResolution#getLinks was called with the expected arguments");

            start();
        });
    });

    test("getLinks with appState", function () {
        var oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                resolveHashFragment: sinon.stub()
            },
            mParameters = {
                A: "B",
                C: ["e'e", "j j"]
            };

        // prepare test
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);
        // code under test
        throws(function () {
            oNavTargetResolution.getLinks({semanticObject: "Action?foo"});
        }, /Parameter must not be part of semantic object/);
        oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        });

        // test
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks
            .calledWithExactly("Action", {
                A: "B",
                C: ["e'e", "j j"],
                "sap-xapp-state" : "AKEY"
            }, true));
    });

    test("isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oSimulatedResult = {/*jQuery.Deferred*/},
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                isIntentSupported: sinon.stub().returns(oSimulatedResult),
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oResult = oNavTargetResolution.isIntentSupported(aIntents);

        // test
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledOnce);
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("isIntentSupported: uses ClientSideTargetResolution when configuration option is enabled", function () {
        var oClientSideIsIntentSupportedStub = sinon.stub(),
            oAdapterIsIntentSupportedStub = sinon.stub(),
            oAdapterFake = {
                isIntentSupported: oAdapterIsIntentSupportedStub
            },
            aIsIntentSupportedArgs = ["#Object1-action1", "#Object2-action2"],
            oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oAdapterFake, undefined, undefined, getClientSideTargetResolutionConfig()),
            iCallLength;

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                isIntentSupported: oClientSideIsIntentSupportedStub
            });

        oNavTargetResolution.isIntentSupported(aIsIntentSupportedArgs);

        strictEqual(iCallLength = oClientSideIsIntentSupportedStub.getCalls().length, 1,
            "ClientSideTargetResolution#isIntentSupported was called once");

        if (iCallLength === 1) {
            deepEqual(oClientSideIsIntentSupportedStub.getCall(0).args[0], aIsIntentSupportedArgs,
                "ClientSideTargetResolution#isIntentSupported was called with expected arguments");
        }

        strictEqual(oAdapterIsIntentSupportedStub.getCalls().length, 0,
            "NavTargetResolutionAdapter#isIntentSupported was not called");
    });

    asyncTest("isIntentSupported does not require ClientSideTargetResolution service when ClientSideTargetResolution is disabled", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution( /* oAdapter */ {
            // no isIntentSupported implemented in adapter
        }, undefined, undefined, getClientSideTargetResolutionConfig(false));

        sinon.spy(sap.ushell.Container, "getService");

        oNavTargetResolution.isIntentSupported(["#Action-test"])
            .always(function () {
                strictEqual(
                    sap.ushell.Container.getService.calledWith("ClientSideTargetResolution"),
                    false,
                    "sap.ushell.Container.getService was not called with ClientSideTargetResolution"
                );
                start();
            });
    });

    test("isIntentSupported: missing in adapter", function () {
        var aIntents = ["#foo", "#bar"],
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oNavTargetResolution.isIntentSupported(aIntents)
            .fail(sap.ushell.test.onError)
            .done(function (mSupportedByIntent) {
                //start();

                // test
                deepEqual(mSupportedByIntent, {
                    "#foo": {supported: undefined},
                    "#bar": {supported: undefined}
                });
            });
    });

    test("isNavigationSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oSimulatedResult,
            oSimulatedResultValue,
            oNavTargetResolutionAdapter =  {
                    resolveHashFragment: sinon.stub()
                },
            cnt = 0,
            oNavTargetResolution;

        // prepare test
        aIntents = [ { target : {
                        semanticObject : "Obj1", "action" : "act1"}
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         }
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         },
                         params : { "A" : "V1"}
                     },
                     { target : { shellHash : "Obj3-act3&jumper=postman" } },
                     "#Obj4-act4",
                     "Obj5-act5",
                     "#Obj5-act5",
                     "notahash",
                     "#alsonotahash"
                   ];
        oSimulatedResultValue = { "#Obj1-act1" : { supported : true},
                "#Obj3-act3&jumper=postman" : { supported: true},
                "#Obj5-act5" : { supported : true},
                  "Obj1-act1?A=V1" : { supported: false} };
        oSimulatedResult = new jQuery.Deferred();
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);
        sinon.stub(oNavTargetResolution,"isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavTargetResolution.isNavigationSupported(aIntents);

        // test
        ok(oNavTargetResolution.isIntentSupported.calledOnce);
        deepEqual(oNavTargetResolution.isIntentSupported.args[0][0],
                [ "#Obj1-act1",
                  "#",
                  "#Obj1-act1",
                  "#",
                  "#Obj1-act1?A=V1",
                  "#Obj3-act3&jumper=postman",
                  "#Obj4-act4",
                  "Obj5-act5",
                  "#Obj5-act5",
                  "notahash",
                  "#alsonotahash" ], "result passed on ok");
        oSimulatedResult.resolve(oSimulatedResultValue);
        cnt = 0;
        oResult.done(function(aRes) {
            cnt += 1;
            deepEqual(aRes,[
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 }
             ], "expected resolution result");
        }).fail(function() {
           ok(false, "called");
        });
        ok(cnt > 0, "promise done");
    });


    test("isNavigationSupported: failing isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oNavTargetResolutionAdapter =  {
                    resolveHashFragment: sinon.stub()
                },
            cnt = 0,
            oSimulatedResult,
            oNavTargetResolution;

        // prepare test
        aIntents = [ { target : {
                        semanticObject : "Obj1", "action" : "act1"}
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         }
                     },
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         },
                         params : { "A" : "V1"}
                     }
                   ];
        oSimulatedResult = new jQuery.Deferred().reject("not this way","42","33").promise();
        oNavTargetResolution = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);
        sinon.stub(oNavTargetResolution,"isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavTargetResolution.isNavigationSupported(aIntents);

        // test
        ok(oNavTargetResolution.isIntentSupported.calledOnce);
        deepEqual(oNavTargetResolution.isIntentSupported.args[0][0],
                [ "#Obj1-act1", "#", "#Obj1-act1", "#Obj1-act1?A=V1" ],"result passed on ok");
        cnt = 0;
        oResult.done(function(aRes) {
            ok(false,"should not be called");
        }).fail(function(sMsg,a1,a2) {
            ok(true, "called");
            deepEqual([sMsg,a1,a2],["not this way", "42", "33"],"args ok");
            equal(sMsg,"not this way","message transported");
            cnt += 1;
         });
         ok(cnt > 0, "promise rejected");
     });


    test("getNavigationMode: works for URLs", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
            isIntentSupported: sinon.stub().returns(false),
            resolveHashFragment: sinon.stub()
        });

        [
            {
                description: "basic case",
                inputResolvedHashFragment: {
                    applicationType: "URL",
                    url: "http://www.testurl.com",
                    additionalInformation: ""
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "No url actually specified",
                inputResolvedHashFragment: {
                    applicationType: "URL",
                    url: "",
                    additionalInformation: ""
                },
                /*
                 * The NavTargetResolution is blind to what URL should be
                 * opened.
                 */
                expectedNavigationMode: "newWindow"
            },
            {
                description: "Null url",
                inputResolvedHashFragment: {
                    applicationType: "URL",
                    url: null,
                    additionalInformation: ""
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "'URL' contained in applicationType",
                inputResolvedHashFragment: {
                    applicationType: "not URL",
                    url: null,
                    additionalInformation: ""
                },
                expectedNavigationMode: undefined
            },
            {
                description: "explicit navigationMode",
                inputResolvedHashFragment: {
                    applicationType: "URL",
                    url: null,
                    navigationMode : "aaabbc",
                    additionalInformation: ""
                },
                expectedNavigationMode: "aaabbc"
            },
            {
                description: "explicit navigationMode WebGui open ",
                inputResolvedHashFragment: {
                    applicationType: "URL",
                    url: null,
                    navigationMode : "aaabbc",
                    additionalInformation: ""
                },
                expectedNavigationMode: "aaabbc"
            }
        ].forEach(function (oFixture) {

            strictEqual(
                oNavTargetResolution._getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );

        });
    });





    [
        {
            testDescription: "initial navigation to a UI5 application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "initial navigation to a NWBC application",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from UI5 to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "navigation from UI5 to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "navigation from UI5 to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "intial navigation to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "subsequent navigation to TR without navmode on current application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            oCurrentlyOpenedAppExplicitNavMode : undefined,
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "subsequent navigation to TR with navmode on current Application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            oCurrentlyOpenedAppExplicitNavMode : "embedded",
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "embedded"
        }
    ].forEach(function (oFixture) {
        test("_getNavigationMode returns the correct navigation mode when " + oFixture.testDescription, 1, function () {
            var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
                    isIntentSupported: sinon.stub().returns(false),
                    resolveHashFragment: sinon.stub()
                }),
                oAppConfigSrvStub = sinon.stub(sap.ushell.services.AppConfiguration, "getCurrentAppliction")
                    .returns({applicationType : oFixture.sCurrentApplicationType,
                              explicitNavMode : oFixture.oCurrentlyOpenedAppExplicitNavMode});

            strictEqual(oNavTargetResolution._getNavigationMode(oFixture.oResolvedHashFragment), oFixture.expectedNavigationMode, "Obtained expected navigation mode");

            oAppConfigSrvStub.restore();
         });
    });

    test("getNavigationMode: works for navigation to UI5 components", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
            isIntentSupported: sinon.stub().returns(false),
            resolveHashFragment: sinon.stub()
        });

        // Test basic case
        strictEqual(
            oNavTargetResolution._getNavigationMode({
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            }),
            "embedded",
            "basic case"
        );

        // Test valid additionalInformation field
        var oExpectedResults = {
            /*
             * These cases cover invalid right-hand value
             */
            "SAPUI5.Component="                   : { expected: "embedded", warns: true },
            "SAPUI5.Component= "                  : { expected: "embedded", warns: true },
            "SAPUI5.Component=.Component.name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Com,pon.ent.na.me"  : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component+name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n=me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n@me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name?managed=true " : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name!"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name."    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n~me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component..name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application--"   : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux-.fnd-.-generic--apf-application" : { expected: "embedded", warns: true },
            /*
             * These cases fall back to the URL case because
             * additionalInformation does not start with
             * "SAPUI5.Component"
             */
            "SAPUI5.ComponentComponentname"  : { expected: "newWindow", warns: false },
            " SAPUI5.Component="             : { expected: "newWindow", warns: false },
            "SAPUI5.Component = "            : { expected: "newWindow", warns: false },
            "SAPUI5.Component Componentname" : { expected: "newWindow", warns: false },
            /*
             * Valid right-hand values
             */
            "SAPUI5.Component=C0mPon3ntN4__m3"     : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENTNAME"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENT_NAME"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Com.pon.ent.na.me"   : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component.Name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component_NamE"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=__Component__name__" : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentName"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=component_name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentname"       : { expected: "embedded", warns: false }
        };

        Object.keys(oExpectedResults).forEach(function (sAdditionalInformation) {
            var oResolvedHashFragment = {
                    applicationType: "URL",
                    url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                    additionalInformation: sAdditionalInformation
                },
                oWarnSpy = sinon.spy(jQuery.sap.log, "warning"),
                oTest = oExpectedResults[sAdditionalInformation];

            strictEqual(
                oNavTargetResolution._getNavigationMode(oResolvedHashFragment),
                oTest.expected,
                "valid additionalInformation: '" + sAdditionalInformation + "'"
            );

            equal(jQuery.sap.log.warning.called, oTest.warns,
                "warning logged for " + sAdditionalInformation);

            oWarnSpy.restore();
        });
    });

    test("getNavigationMode: works for navigation to NWBC applications", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
            isIntentSupported: sinon.stub().returns(false),
            resolveHashFragment: sinon.stub()
        });

        [
            {
                description: "basic case",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "/some/additional/information"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            },
            {
                description: "managed= case in additionalInformation",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "SAPUI5.Component=componentname"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            },
            {
                description: "SAPUI5.Component= case in additionalInformation",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "SAPUI5.Component=componentname"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            }
        ].forEach(function (oFixture) {

            strictEqual(
                oNavTargetResolution._getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );

        });
    });

    test("getNavigationMode: works for navigation to \"managed=\" application", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
            isIntentSupported: sinon.stub().returns(false),
            resolveHashFragment: sinon.stub()
        });

        [
            {
                description: "basic case for FioriWave1 value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "embedded"
            },
            {
                description: "basic case for No value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow" // falls back to url case
            },
            {
                description: "wrong applicationType",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "WRONG"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "basic case 1 for other values",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=Something",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "extra spaces case 1",
                inputResolvedHashFragment: {
                    additionalInformation: "managed = FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow" // as if managed= was not there
            },
            {
                description: "extra spaces case 2",
                inputResolvedHashFragment: {
                    additionalInformation: "managed= FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined // the value is not "FioriWave1"
            },
            {
                description: "extra spaces case 3",
                inputResolvedHashFragment: {
                    additionalInformation: "managed =FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "leading spaces",
                inputResolvedHashFragment: {
                    additionalInformation: " managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "trailing spaces",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1 ",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "duplicated value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1,managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "duplicated value, no separator",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "FioriWave1 in lowercase is not valid value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=fioriwave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "FioriWave1 in mixed case is not a valid value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=fioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "non-existing managed= value opens new window",
                inputResolvedHashFragment: {
                    additionalInformation: "UnknownValue",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "undefined additionalInformation and URL opens in a new window",
                inputResolvedHashFragment: {
                    additionalInformation: undefined,
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "null additionalInformation and URL opens in a new window",
                inputResolvedHashFragment: {
                    additionalInformation: null,
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            }
        ].forEach(function (oFixture) {

            strictEqual(
                oNavTargetResolution._getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );

        });
    });

    test("getNavigationMode: works for navigation to UI5 components", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
            isIntentSupported: sinon.stub().returns(false),
            resolveHashFragment: sinon.stub()
        });

        // Test basic case
        strictEqual(
            oNavTargetResolution._getNavigationMode({
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            }),
            "embedded",
            "basic case"
        );

        // Test valid additionalInformation field
        var oExpectedResults = {
            /*
             * These cases cover invalid right-hand value
             */
            "SAPUI5.Component="                   : { expected: "embedded", warns: true },
            "SAPUI5.Component= "                  : { expected: "embedded", warns: true },
            "SAPUI5.Component=.Component.name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Com,pon.ent.na.me"  : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component+name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n=me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n@me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name?managed=true " : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name!"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name."    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n~me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component..name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application--"   : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux-.fnd-.-generic--apf-application" : { expected: "embedded", warns: true },
            /*
             * These cases fall back to the URL case because
             * additionalInformation does not start with
             * "SAPUI5.Component"
             */
            "SAPUI5.ComponentComponentname"  : { expected: "newWindow", warns: false },
            " SAPUI5.Component="             : { expected: "newWindow", warns: false },
            "SAPUI5.Component = "            : { expected: "newWindow", warns: false },
            "SAPUI5.Component Componentname" : { expected: "newWindow", warns: false },
            /*
             * Valid right-hand values
             */
            "SAPUI5.Component=C0mPon3ntN4__m3"     : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENTNAME"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENT_NAME"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Com.pon.ent.na.me"   : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component.Name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component_NamE"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=__Component__name__" : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentName"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=component_name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentname"       : { expected: "embedded", warns: false }
        };

        Object.keys(oExpectedResults).forEach(function (sAdditionalInformation) {
            var oResolvedHashFragment = {
                    applicationType: "URL",
                    url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                    additionalInformation: sAdditionalInformation
                },
                oWarnSpy = sinon.spy(jQuery.sap.log, "warning"),
                oTest = oExpectedResults[sAdditionalInformation];

            strictEqual(
                oNavTargetResolution._getNavigationMode(oResolvedHashFragment),
                oTest.expected,
                "valid additionalInformation: '" + sAdditionalInformation + "'"
            );

            equal(jQuery.sap.log.warning.called, oTest.warns,
                "warning logged for " + sAdditionalInformation);

            oWarnSpy.restore();
        });
    });

    [
     {
         description: "NWBC in URL ( strange)",
         inputHash :  "#A-b?sap-system=EFG&AA=BBB",
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB&sap-system=ABC",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: "ABC"
     },
     {
         description: "NWBC, standard",
         inputHash :  "#A-b?sap-system=EFG&AA=BBB" ,
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: "EFG"
     },
     {
         description: "NWBC, no system",
         inputHash : "#A-b?xx-system=EFG&AA=BBB",
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: undefined
     },
     {
         description: "url with system",
         inputHash : "#A-b?sap-system=XX",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?sap-system=U%20U",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: "U U"
     },
     {
         description: "url no system",
         inputHash : "#A-b",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?no-system=X",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     },
     {
         description: "url no system in results, hash system not used (!)",
         inputHash : "#A-b?sap-system=AAA",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?XXX=BBB",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     },
     {
         description: "SAPUI5",
         inputHash : "#A-b",
         inputResolutionResult: {
             applicationType: "SAPUI5",
             url: "/some/url?XXXX=AAAA",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     }
    ].forEach(function (oFixture) {

        test("getSapSystem for navigation: " + oFixture.description, function () {
            var oNavTargetResolution = new sap.ushell.services.NavTargetResolution({
                isIntentSupported: sinon.stub().returns(false),
                resolveHashFragment: sinon.stub()
            });
                strictEqual(
                    oNavTargetResolution._getSapSystem(oFixture.inputHash, oFixture.inputResolutionResult),
                    oFixture.expectedResult,
                    "result ok  " + oFixture.description
                );

        });
    });

    test("resolveHashFragment fixes the applicationType back to URL when SAPUI5 is returned after invoking the resolve hash chain", function () {
        var sTestHashFragment = "#Test-hashfragment",
            oService,
            oRes;

        // Arrange
        oService = sap.ushell.Container.getService("NavTargetResolution");
        sinon.stub(oService, "expandCompactHash").returns(new jQuery.Deferred().resolve(sTestHashFragment).promise());
        sinon.stub(oService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve({
            "additionalInformation": "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            "applicationType": "SAPUI5",  // NOTE: not URL
            "url": "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp"
        }).promise());
        sinon.stub(oService, "_getNavigationMode");

        // Act
        oRes = oService.resolveHashFragment(sTestHashFragment); // no particular intent
        oRes = evalNow(oRes);
        strictEqual(oRes.applicationType, "URL", "applicationType was corrected to URL");

        strictEqual(oService._getNavigationMode.getCalls().length, 1, "_getNavigationMode was called once");
        strictEqual(oService._getNavigationMode.getCall(0).args[0].applicationType,
            "URL", "_getNavigationMode was called with applicationType = URL");
    });

    [
        {
            testDescription: "resolution result is undefined",
            oResolutionResultAfterHashChain: undefined,
            expectedUi5ComponentName: undefined
        },
        {
            testDescription: "correct component name is already set in property ui5ComponentName",
            oResolutionResultAfterHashChain: {
                "ui5ComponentName": "some.ui5.component",
                "sap.platform.runtime" : { "some" : "info"}
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "sap.platform.runtime is stripped",
            oResolutionResultAfterHashChain: {
                "ui5ComponentName": "some.ui5.component",
                "sap.platform.runtime" : { "some" : "info"}
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "correct component name is in additionalInformation and applicationType is URL",
            oResolutionResultAfterHashChain: {
                "additionalInformation": "SAPUI5.Component=some.ui5.component",
                "applicationType": "URL"
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "correct component name is in additionalInformation and applicationType is SAPUI5",
            oResolutionResultAfterHashChain: {
                "additionalInformation": "SAPUI5.Component=some.ui5.component",
                "applicationType": "SAPUI5"
            },
            expectedUi5ComponentName: "some.ui5.component"
        }
    ].forEach(function (oFixture) {
        test("resolveHashFragment extracts the ui5 component name from additionalInformation correctly after invoking the resolve hash chain when " + oFixture.testDescription, function () {
            var sTestHashFragment = "#Test-hashfragment",
            oService,
            oRes;

            // Arrange
            oService = sap.ushell.Container.getService("NavTargetResolution");
            sinon.stub(oService, "expandCompactHash").returns(new jQuery.Deferred().resolve(sTestHashFragment).promise());
            sinon.stub(oService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve(
                oFixture.oResolutionResultAfterHashChain).promise());
            sinon.spy(oService, "_adjustResolutionResultForUi5Components");

            // Act
            oRes = oService.resolveHashFragment(sTestHashFragment); // no particular intent
            oRes = evalNow(oRes);
            equal((oRes && oRes["sap.platform.runtime"]), undefined," runtime stripped if present");
            if (oFixture.expectedUi5ComponentName) {
                strictEqual(oRes.ui5ComponentName, oFixture.expectedUi5ComponentName, "ui5ComponentName set correctly");
            } else {
                strictEqual(oRes, oFixture.oResolutionResultAfterHashChain, "resolution result not modified");
            }


            strictEqual(oService._adjustResolutionResultForUi5Components.getCalls().length, 1, "_adjustResolutionResultForUi5Components was called once");
        });
    });

    asyncTest("resolveHashFragment: fails if the passed hash fragment does not start with a hash", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution(undefined, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                resolveHashFragment: sinon.stub()
            });

        try {
            oNavTargetResolution.baseResolveHashFragment("Object-action")
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .done(function () {
                    ok(true, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        } catch (e) {
            strictEqual(e.message, "Hash fragment expected in _validateHashFragment", "exception thrown");
        } finally {
            start();
        }
    });

    [true, false].forEach(function (bClientSideResolutionEnabled) {

        asyncTest("resolveHashFragment after async loading of component dependencies fails in bootstrap when" +
            " ClientSideTargetResolution is " + (bClientSideResolutionEnabled ? "enabled" : "disabled"), function () {

            var oSuccessfulResolveHashFragmentStub = sinon.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                oFakeAdapter = {
                    resolveHashFragment: oSuccessfulResolveHashFragmentStub
                },
                oNavTargetResolutionService = new sap.ushell.services.NavTargetResolution(
                    oFakeAdapter, undefined, undefined, bClientSideResolutionEnabled ? getClientSideTargetResolutionConfig() : undefined);

            // resolves client side
            oNavTargetResolutionService._resolveHashFragmentClientSide = oSuccessfulResolveHashFragmentStub;

            // provide a failing coldstart promise
            window['sap-ushell-async-libs-promise-coldstart'] = new Promise(function (resolve, reject) {
                reject(new Error("simulating failing of component load in bootstrap"));
            });

            oNavTargetResolutionService.baseResolveHashFragment("#Object-action")
                .fail(sap.ushell.test.onError)
                .done(function (oApplication) {
                    ok(true, "even if the asynchronous loading of component dependencies in Boottask fails, resolveHashFragment resolves");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("_resolveHashFragmentClientSide: returns URL application type when SAPUI5 application type is resolved", function () {
        var oNavTargetResolution = new sap.ushell.services.NavTargetResolution(undefined, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService").withArgs("ClientSideTargetResolution").returns({
            resolveHashFragment: sinon.stub().returns(
                new jQuery.Deferred().resolve({ applicationType: "SAPUI5" }).promise())
        });

        oNavTargetResolution._resolveHashFragmentClientSide("#Doesnt-matter")
            .fail(function () {
                ok(false, "promise is resolved");
            })
            .done(function (oResolutionResult) {
                ok(true, "promise is resolved");
                strictEqual(oResolutionResult.applicationType, "URL", "resolved applicationType is URL");
            })
            .always(function () { start(); });

    });

}());
