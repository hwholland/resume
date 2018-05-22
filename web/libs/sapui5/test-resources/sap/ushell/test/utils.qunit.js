// @copyright@
/**
 * @fileOverview QUnit tests for ushell-lib utils.js
 */
(function () {
    "use strict";
    /*global deepEqual, equal, module, navigator,
    ok, start, strictEqual, stop, test, document, jQuery, localStorage, sap,
    sinon, setTimeout, Storage, throws, window */

    var bNotIE = navigator.userAgent.toLowerCase().indexOf('msie') === -1;

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");

    // Create and structure your QUnit tests here
    // Documentation can be found at http://docs.jquery.com/QUnit
    module("sap/ushell/utils.js", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown : function () {
            sap.ushell.test.restoreSpies(
                Storage.prototype.setItem,
                jQuery.sap.getUriParameters,
                sap.ushell.utils.hasNativeNavigationCapability,
                sap.ushell.utils.hasNativeLogoutCapability,
                jQuery.sap.log.error,
                sap.ushell.utils.getParameterValueBoolean
            );
        }
    });

    test("sap.ushell.utils.Error; create and expect tracing", function () {
        var oLogMock = sap.ushell.test.createLogMock()
                .error("UShell error created", null, "component"),
            unused = new sap.ushell.utils.Error("UShell error created", "component");
        oLogMock.verify();
        unused = !unused;
    });

    test("sap.ushell.utils.Error; check types", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");

        ok(oError instanceof Error, "expected instance of Error");
        ok(oError instanceof sap.ushell.utils.Error, "expected instance of sap.ushell.utils.Error");
    });

    test("sap.ushell.utils.Error: toString", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");

        strictEqual(oError.toString(), "sap.ushell.utils.Error: UShell error created", "toString");
    });

    test("sap.ushell.utils.Error: throw and catch", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");
        try {
            throw oError;
        } catch (e) {
            strictEqual(e, oError);
            strictEqual(e.message, "UShell error created");
        }
    });

    test("sap.ushell.utils.calcOrigin", function () {
        var origin = window.location.origin,
            sCalcorigin;
        if (!window.location.origin) {
            origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        sCalcorigin = sap.ushell.utils.calculateOrigin( window.location );
        ok(sCalcorigin.length > 0, "not trivial");
        equal(sCalcorigin, origin, "correct url");
    });

    test("sap.ushell.utils.calcOrigin no origin", function () {
        var sCalcorigin = sap.ushell.utils.calculateOrigin( { hostname : "x.y.z", protocol : "http:", port : "8080" } );
        equal(sCalcorigin, "http://x.y.z:8080");
    });

    test("sap.ushell.utils.calcOrigin url construction, no port", function () {
        var sCalcorigin = sap.ushell.utils.calculateOrigin( { hostname : "x.y.z", protocol : "http:" } );
        equal(sCalcorigin, "http://x.y.z", "url ok ");
    });

    test("sap.ushell.utils.calcOrigin origin used if present", function () {
        var sCalcorigin = sap.ushell.utils.calculateOrigin( { origin : "httpX://sonicht:8080", hostname : "x.y.z", protocol : "http:", port : "8080" } );
        equal(sCalcorigin, "httpX://sonicht:8080", "origin used if present");
    });

    test("sap.ushell.utils.hasNativeNavigationCapability detect NWBC v6.0+", function () {
        strictEqual(sap.ushell.utils.hasNativeNavigationCapability(), false, "returns false (not in NWBC)");
    });

    test("sap.ushell.utils.hasNativeLogoutCapability detect NWBC v6.0+", function () {
        strictEqual(sap.ushell.utils.hasNativeLogoutCapability(), false, "returns false (not in NWBC)");
    });

    [
        {
            sMockedGetNwbcFeatureBits: "0",
            expectedHasNativeNavigationCapability: false,  // first (least significant) bit
            expectedHasNativeLogoutCapability: false       // second (least significant) bit
        },
        {
            sMockedGetNwbcFeatureBits: "1",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false
        },
        {
            sMockedGetNwbcFeatureBits: "2",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true
        },
        {
            sMockedGetNwbcFeatureBits: "3",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true
        },
        {
            sMockedGetNwbcFeatureBits: "8",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false
        },
        {
            sMockedGetNwbcFeatureBits: "A",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true
        },
        {
            sMockedGetNwbcFeatureBits: "E",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true
        },
        {
            sMockedGetNwbcFeatureBits: "31",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false
        }
    ].forEach(function (oFixture) {
        test("sap.ushell.utils.hasNativeNavigationCapability returns expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits, function () {
            sinon.stub(sap.ushell.utils,"_getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().returns(oFixture.sMockedGetNwbcFeatureBits)
            });

            strictEqual(sap.ushell.utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability, "returned expected result");

            sap.ushell.utils._getPrivateEpcm.restore();
        });

        test("sap.ushell.utils.hasNativeLogoutCapability returns expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits, function () {
            sinon.stub(sap.ushell.utils,"_getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().returns(oFixture.sMockedGetNwbcFeatureBits)
            });

            strictEqual(sap.ushell.utils.hasNativeLogoutCapability(),
                oFixture.expectedHasNativeLogoutCapability, "returned expected result");

            sap.ushell.utils._getPrivateEpcm.restore();
        });
    });

    [
        {
            testDescription: "getPrivateEpcm returns undefined",
            returns : undefined,
            expectedHasNativeNavigationCapability: false
        },
        {
            testDescription: "getNwbcFeatureBits throws",
            returns: {
                getNwbcFeatureBits: sinon.stub().throws("Some error")
            },
            expectedHasNativeNavigationCapability: false
        }
    ].forEach(function (oFixture) {
        test("sap.ushell.utils.hasNativeNavigationCapability returns expected result when " + oFixture.testDescription, function () {
            sinon.stub(sap.ushell.utils,"_getPrivateEpcm").returns(oFixture.returns);

            strictEqual(sap.ushell.utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability, "returned expected result");
            sap.ushell.utils._getPrivateEpcm.restore();
        });
    });

    [
        "hasNativeNavigationCapability",
        "hasNativeLogoutCapability"
    ].forEach(function (sMethod) {
        test("sap.ushell.utils." + sMethod + " logs an error when window.epcm.getNwbcFeatureBits throws", function () {
            sinon.stub(jQuery.sap.log, "error");

            sinon.stub(sap.ushell.utils,"_getPrivateEpcm").returns({
                    getNwbcFeatureBits: sinon.stub().throws("Some error")
                });

            sap.ushell.utils[sMethod]();

            ok(jQuery.sap.log.error.calledOnce === true, "jQuery.sap.log.error was called once");

            sap.ushell.utils._getPrivateEpcm.restore();
        });
    });

    test(["sap.ushell.utils.isNativeWebGuiNavigation returns true if TR in resolved",
        "navigation target and FDC detected"].join(" "), function () {

        var bResult;

        sinon.stub(sap.ushell.utils,"_getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().returns("3")
            });

        bResult = sap.ushell.utils.isNativeWebGuiNavigation({
            applicationType : "TR",
            url : "https://someserver.corp.com:1234/sap/bc/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_TRANS?P_APPL=FS2_TEST&P_OBJECT=&P_PNP=&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&DYNP_OKCODE=onli&sap-client=120&sap-language=EN"
        });
        strictEqual(bResult, true, "returns true");
        sap.ushell.utils._getPrivateEpcm.restore();

    });

    [ {
        applicationType : "TR",
        url: "transaction/APB_LPD_CALL_TRANS?",
        bResult: true
      },
      {
        applicationType : "TR",
        url: "anyurleventheweirdedsirrelevant",
        bResult: true
      },
      {
        applicationType : "URL",
        url: "https://someserver.corp.com:1234/sap/bc/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_TRANS?P_APPL=FS2_TEST&P_OBJECT=&P_PNP=&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&DYNP_OKCODE=onli&sap-client=120&sap-language=EN",
        bResult: false
      },
      {
        applicationType : "NWBC",
        url: "ROLES://portal_content/com.sap.pct/every_user/com.sap.pct.erp.common.bp_folder/com.sap.pct.erp.common.roles/com.sap.pct.erp.common.erp_common/com.sap.pct.erp.common.lpd_start_transaction?DynamicParameter=p_appl%3dFS2_TEST%26p_object%3d%26p_pnp%3d%26p_role%3dFS2SAMAP%26p_selscr%3dX%26p_tcode%3dSU01%26sap-nwbc-force_sapgui%3dX&OkCode=onli&System=U31CLNT111&TCode=APB_LPD_CALL_TRANS&sap-nwbc-is_suspend_scenario=",
        bResult : false
      }
    ].forEach(function(oFixture) {
        test("sap.ushell.utils.isNativeWebGuiNavigation url detection: applicationType : '" + oFixture.applicationType + "', url:'" + oFixture.url + "'", function() {
            var bResult;
            sinon.stub(sap.ushell.utils, "hasNativeNavigationCapability").returns(true);
            bResult = sap.ushell.utils.isNativeWebGuiNavigation({
                applicationType : oFixture.applicationType,
                url : oFixture.url
            });

            strictEqual(bResult, oFixture.bResult, "value matches expected result");

            sap.ushell.utils.hasNativeNavigationCapability.restore();
        });
    });

    [
        {   // empty URL
            sUrl: "",
            sUrlExpected: "?sap-user=USERID"
        },
        {   // "/"-terminated URL
            sUrl: "http://www.somet.hing.com/",
            sUrlExpected: "http://www.somet.hing.com/?sap-user=USERID"
        },
        {   // index.html terminated URL
            sUrl: "http://www.somet.hing.com/index.html",
            sUrlExpected: "http://www.somet.hing.com/index.html?sap-user=USERID"
        },
        {   // URL with parameter
            sUrl: "http://www.somet.hing.com/index.html?search=Hello",
            sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID"
        },
        {   // URL with multiple parameters
            sUrl: "http://www.somet.hing.com/index.html?search=Hello&title=Foo",
            sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&title=Foo&sap-user=USERID"
        },
        {
            // URL with sap-user already specified
            sUrl: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo",
            sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo&sap-user=USERID"
        },
        {   // URL with another parameter name other than sap-user
            sUrl: "http://www.somet.hing.com/index.html?search=Hello",
            sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-id=USERID",
            sParamName: "sap-id"
        },
        {   // NWBC URL without prefix
            sUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=",
            sUrlExpected: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=&sap-user=USERID"
        },
        {
            // NWBC URL with prefix
            sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
            sUrlExpected: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN&sap-user=USERID"
        }
    ].forEach(function (oFixture) {
        test("sap.ushell.utils.appendUserIdToUrl: adds sap-user correctly to " + oFixture.sUrl, function () {
            var sMockedUserId = "USERID",
                sParamName = oFixture.sParamName || "sap-user";

            // make sure no Container is defined before this test starts
            if (typeof sap.ushell.Container !== "undefined") {
                strictEqual(sap.ushell.Container, undefined, "sap.ushell.Container is not defined for appendUserIdToUrl");

            } else {

                // mock fake user value retrieved for the UserInfo service
                sap.ushell.Container = {
                    "getService": sinon.stub().withArgs("UserInfo").returns({
                        getUser: sinon.stub().returns({
                            getId: sinon.stub().returns(sMockedUserId)
                        })
                    })
                };

                strictEqual(sap.ushell.utils.appendUserIdToUrl(sParamName, oFixture.sUrl),
                    oFixture.sUrlExpected, "the expected URL was returned");

                delete sap.ushell.Container;
            }
        });
    });

    [
        {
            testDescription: "no localstorage entry and no url parameters are defined",
            sLocalStorageEntry: undefined,
            sUrlParameterValue: undefined,
            expected: true
        },
        {
            testDescription: "localstorage entry enabled and url disabled",
            sLocalStorageEntry: true,
            sUrlParameterValue: false, // false wins
            expected: false
        },
        {
            testDescription: "localstorage entry disabled and url enabled",
            sLocalStorageEntry: false,  // false wins
            sUrlParameterValue: true,
            expected: false
        },
        {
            testDescription: "localstorage entry has unexpected value",
            sLocalStorageEntry: "strange value",  // ignored
            sUrlParameterValue: false,  // false wins
            expected: false
        },
        {
            testDescription: "localstorage entry has unexpected value",
            sLocalStorageEntry: "strange value",  // ignored
            sUrlParameterValue: true,
            expected: true
        }
    ].forEach(function (oFixture) {

        test("sap.ushell.utils.isClientSideNavTargetResolutionEnabled: returns expected result when jQuery.sap.storage is available and " + oFixture.testDescription, function () {
            // mock localStorage
            if (jQuery.sap.storage !== undefined) {
                // we expect this to be undefined when this test is run
                ok(false, "jQuery.sap.storage is undefined");
                return;
            }

            // simulate jQuery.sap.storage available
            jQuery.sap.storage = sinon.stub().returns({
                get: sinon.stub().returns(oFixture.sLocalStorageEntry)
            });

            // simulate url parameter value
            sinon.stub(sap.ushell.utils, "getParameterValueBoolean")
                .withArgs("sap-ushell-nav-cs")
                .returns(oFixture.sUrlParameterValue);

            strictEqual(sap.ushell.utils.isClientSideNavTargetResolutionEnabled(),
                oFixture.expected, "got expected result");

            delete jQuery.sap.storage;
        });

        test("sap.ushell.utils.isClientSideNavTargetResolutionEnabled: returns expected result when jQuery.sap.storage is not available and " + oFixture.testDescription, function () {
            var sOriginalLocalStorageValue;

            // NOTE: jQuery.sap.storage should not be available when this test is run
            if (jQuery.sap.storage !== undefined) {
                // we expect this to be undefined when this test is run
                ok(false, "jQuery.sap.storage is undefined");
                return;
            }

            // Actually using the localStorage makes all browsers happy for this test
            sOriginalLocalStorageValue = window.localStorage.getItem("targetresolution-client");
            window.localStorage.setItem("targetresolution-client", oFixture.sLocalStorageEntry);

            // simulate url parameter value
            sinon.stub(sap.ushell.utils, "getParameterValueBoolean")
                .withArgs("sap-ushell-nav-cs")
                .returns(oFixture.sUrlParameterValue);

            strictEqual(sap.ushell.utils.isClientSideNavTargetResolutionEnabled(),
                oFixture.expected, "got expected result");

            // Restore
            window.localStorage.setItem("targetresolution-client", sOriginalLocalStorageValue);
        });
    });


    test("sap.ushell.utils.Map: basics", function () {
        var oMap = new sap.ushell.utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);
        strictEqual(oMap.containsKey("something"), false);
        strictEqual(oMap.get("key"), "value");
        strictEqual(oMap.get("something"), undefined);
        oMap.put("get", "oh");
        strictEqual(oMap.get("get"), "oh");
        oMap.put("hasOwnProperty", "oh");
        strictEqual(oMap.get("hasOwnProperty"), "oh");
        try {
            Object.prototype.foo = "bar";
            ok(!oMap.containsKey("foo"));
        } finally {
            delete Object.prototype.foo;
        }
    });

    test("sap.ushell.utils.Map remove", function () {
        var oMap = new sap.ushell.utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);

        oMap.remove("key");
        strictEqual(oMap.containsKey("key"), false);
        strictEqual(oMap.get("key"), undefined);

        //removing something unknown should not throw an exeption
        oMap.remove("something");
    });

    test("sap.ushell.utils.Map: keys", function () {
        var oMap = new sap.ushell.utils.Map(),
            fnKeys = sinon.spy(Object, "keys"),
            aKeys;
        oMap.put("key", "value");
        aKeys = oMap.keys();
        deepEqual(aKeys, ["key"]);
        ok(fnKeys.calledOnce);
        ok(fnKeys.returned(aKeys));
    });

    test("sap.ushell.utils.Map: toString", function () {
        var oMap = new sap.ushell.utils.Map();
        strictEqual('sap.ushell.utils.Map({})', oMap.toString());

        oMap.put("key", "value");
        strictEqual('sap.ushell.utils.Map({"key":"value"})', oMap.toString());
    });

    test("sap.ushell.utils.Map: error handling", function () {
        var oMap = new sap.ushell.utils.Map();

        throws(function () {
            oMap.put({}, "foo");
        }, /Not a string key: \[object Object\]/);

        throws(function () {
            oMap.containsKey({});
        }, /Not a string key: \[object Object\]/);

        throws(function () {
            oMap.get({});
        }, /Not a string key: \[object Object\]/);
    });

    test("sap.ushell.utils.Map: put twice", function () {
        var oMap = new sap.ushell.utils.Map(),
            oPrevious;

        oPrevious = oMap.put("foo", window);
        strictEqual(oPrevious, undefined);

        oPrevious = oMap.put("foo", sinon);
        strictEqual(oPrevious, window);
    });

    test("sap.ushell.utils.hexToRgb: hex to RGB convertion", function () {
        var sHexColor = '#0a030a',
            oRgbColor;

        oRgbColor = sap.ushell.utils.hexToRgb(sHexColor);
        strictEqual(oRgbColor.r, 10);
        strictEqual(oRgbColor.g, 3);
        strictEqual(oRgbColor.b, 10);
    });

    test("sap.ushell.utils.convertToRealOpacity: claculate real opacity value", function () {
        var iMaxUsage = 45,
            iHashlessTileOpacity = 1,
            iExpectedOpacityCalc = 0.9,
            iActualOpacityCalc,
            testTileUsage;

        iActualOpacityCalc = sap.ushell.utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iHashlessTileOpacity);

        testTileUsage = 25;
        iActualOpacityCalc = sap.ushell.utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iExpectedOpacityCalc);
    });

    test("localStorageSetItem in Safari private browsing mode", function () {
        var sError = "QUOTA_EXCEEDED_ERR",
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent("sap.ushell.utils")
                .warning("Error calling localStorage.setItem(): " + sError, null,
                       "sap.ushell.utils");
        sinon.stub(Storage.prototype, "setItem");
        sap.ushell.utils.localStorageSetItem("foo", "bar");
        ok(Storage.prototype.setItem.calledWithExactly("foo", "bar"),
            "localStorage.setItem called for test");

        Storage.prototype.setItem.throws(sError);
        sap.ushell.utils.localStorageSetItem("foo", "bar");
        oLogMock.verify();

    });

    test("localStorageSetItem eventing to same window", function () {
        var fnStorageListener = sinon.spy(function (oStorageEvent) {
            strictEqual(oStorageEvent.key, "foo", "Key same window");
            strictEqual(oStorageEvent.newValue, "bar", "Value same window");
        });

        sinon.stub(Storage.prototype, "setItem");

        window.addEventListener('storage', fnStorageListener);
        sap.ushell.utils.localStorageSetItem("foo", "bar", true);

        ok(fnStorageListener.calledOnce, "Listener called (once)");
        window.removeEventListener('storage', fnStorageListener);

    });

    test("getParameterValueBoolean : ", function () {
        var val, stub;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (a) {
            return {
                get : function () { return undefined; },
                mParams : { }
            };
        });
        val = sap.ushell.utils.getParameterValueBoolean("sap-accessibility");
        equal(val, undefined, " value is undefined");
        stub.restore();
    });

    ["X", "x", "tRue", "TRUE", "true"].forEach(function (sVal) {
        test("getParameterValueBoolean : trueish" + sVal, function () {
            var val, stub;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (a) {
                return {
                    get : function () { return undefined; },
                    mParams : { "sap-accessibility" : [sVal, "false"] }
                };
            });
            val = sap.ushell.utils.getParameterValueBoolean("sap-accessibility");
            equal(val, true, " value is true");
            stub.restore();
        });
    });

    ["", "false", "FALSE", "False"].forEach(function (sVal) {
        test("getParameterValueBoolean : falsish" + sVal, function () {
            var val, stub;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (a) {
                return {
                    get : function () { return undefined; },
                    mParams : { "sap-accessibility" : [sVal] }
                };
            });
            val = sap.ushell.utils.getParameterValueBoolean("sap-accessibility");
            equal(val, false, " value is false");
            stub.restore();
        });
    });

    ["fatruelse", "WAHR", "falsch"].forEach(function (sVal) {
        test("getParameterValueBoolean : undefined" + sVal, function () {
            var val, stub;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (a) {
                return {
                    get : function () { return undefined; },
                    mParams : { "sap-accessibility" : [sVal] }
                };
            });
            val = sap.ushell.utils.getParameterValueBoolean("sap-accessibility");
            equal(val, undefined, " value is undefined");
            stub.restore();
        });
    });

    test("getFormFactor", function () {
        var oOriginalSystem = sap.ui.Device.system;

        function testFormFactor(oSystem, sExpected) {
            oSystem.SYSTEMTYPE = oOriginalSystem.SYSTEMTYPE;
            sap.ui.Device.system = oSystem;
            strictEqual(sap.ushell.utils.getFormFactor(), sExpected);
        }

        testFormFactor({desktop: true}, "desktop");
        testFormFactor({tablet: true}, "tablet");
        testFormFactor({phone: true}, "phone");
        testFormFactor({tablet: true, phone: true}, "tablet"); //Phablet?
        testFormFactor({desktop: true, tablet: true}, "desktop"); //MS Surface Pro?
        testFormFactor({desktop: true, tablet: true, phone: true}, "desktop"); //?
        testFormFactor({}, undefined);

        sap.ui.Device.system = oOriginalSystem;
    });

    [
     {
          description: "empty",
          expectedResult: undefined,
          sPath : "sap|flp.type",
          oAppDesc : {}
     },
     {
         description: "empty path",
         expectedResult: undefined,
         sPath : "",
         oAppDesc : { "abc" : "def"}
     },
     {
         description: "single path",
         expectedResult: "def",
         sPath : "abc",
         oAppDesc : { "abc" : "def"}
     },
     {
         description : "2 segment path",
         expectedResult: "tile",
         sPath : "sap|flp.type",
         oAppDesc : {
             "sap.flp" : {
                 type : "tile"
             }
         }
     },
     {
         description : "long path",
         expectedResult: "application",
         sPath : "sap|demo|has.sap|flp.type",
         oAppDesc : {
             "sap.demo.has" : {
                 "sap.flp" : {
                     type : "application"
                 }
             }
         }
     },
     {
         description : "deep path",
         expectedResult: { type : "application"},
         sPath : "sap|demo|has.sap|flp",
         oAppDesc : {
             "sap.demo.has" : {
                 "sap.flp" : {
                     type : "application"
                 }
             }
         }
     },
     {
         description : "array result",
         expectedResult: [1,2,3],
         sPath : "sap|demo|has.sap|flp",
         oAppDesc : {
             "sap.demo.has" : {
                 "sap.flp" : [ 1, 2, 3]
             }
         }
     }
     ].forEach(function(oFixture) {
         test("getMember when " + oFixture.description, function() {
             var bResult = sap.ushell.utils.getMember(oFixture.oAppDesc,oFixture.sPath);
             deepEqual(bResult, oFixture.expectedResult, "correct result");
         });
     });

    test("call: sync call", function () {
        var bCalled = false;
        sap.ushell.utils.call(function () {
                // this shall be called synchronously
            bCalled = true;
            ok(true);
        }, function (sError) {
            // this MUST NOT be called
            strictEqual(sError, "");
            ok(false);
        }, false);
        ok(bCalled);
    });

    test("call: async call", function () {
        var bCalled = false;
        sap.ushell.utils.call(function () {
            // this shall be called asynchronously
            bCalled = true;
            ok(true);
        }, function (sError) {
            // this MUST NOT be called
            strictEqual(sError, "");
            ok(false);
        }, true);
        ok(!bCalled); // not yet called

        stop();
        setTimeout(function () {
            start();
            ok(bCalled); // now!
        }, 100);
    });

    test("call: try/catch", function () {
        var sText = "intentionally failed";
        sap.ushell.utils.call(function () {
            throw new Error(sText);
        }, function (sError) {
            // this shall be called
            strictEqual(sError, sText);
            ok(true);
        }, false);

        stop();
        sap.ushell.utils.call(function () {
            throw new Error(sText);
        }, function (sError) {
            // this shall be called
            start();
            strictEqual(sError, sText);
            ok(true);
        }, true);
    });

    test("call: error with failure handler", function () {
        var oError = new Error("intentionally failed"),
            sStack = oError.stack,
            oLogMock;
       // overengineered crap;
       // LockMock can only be tested in other browsers than IE, as oError.stack is not filled
       // before oError is thrown. Thus, no chance to make this work in IE!
       // if (bNotIE) {
       //     oLogMock = sap.ushell.test.createLogMock();
       //     oLogMock.error("Call to success handler failed: intentionally failed", sStack,
       //         "sap.ushell.utils");
       // }
       // code under test
        sap.ushell.utils.call(function () {
            throw oError;
        }, null, false);

//        if (bNotIE) {
//            oLogMock.verify();
//        } else {
            // at least one assert must be executed in IE
            ok(true, "call catched exception");
//        }
    });

    test("call: error with failure handler", function () {
        var oError = new Error("intentionally failed"),
            sStack = oError.stack,
            oLogMock;
        // see above
        // LockMock can only be tested in other browsers than IE, as oError.stack is not filled
        // before oError is thrown. Thus, no chance to make this work in IE!
//        if (bNotIE) {
//            oLogMock = sap.ushell.test.createLogMock();
//            oLogMock.error("Call to success handler failed: intentionally failed", sStack,
//                "sap.ushell.utils");
//        }

        // code under test
        sap.ushell.utils.call(function () {
            throw oError;
        }, function (sMsg) {
            strictEqual(sMsg, "intentionally failed", "As expected");
        }, false);

//        if (bNotIE) {
//            oLogMock.verify();
//        }
    });

    test("call: non-error thrown with failure handler", function () {
        var oLogMock = sap.ushell.test.createLogMock()
            .error("Call to success handler failed: " + {}, undefined, "sap.ushell.utils");
        sap.ushell.utils.call(function () {
            throw {};
        }, function (sMsg) {
            strictEqual(typeof sMsg, 'string');
        }, false);
        oLogMock.verify();
    });

    test("invokeUnfoldingArrayArguments empty array", function () {
        var fnx = sinon.stub().returns(new jQuery.Deferred().resolve("A").promise());
        sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,[[]]).done(function (res) {
            deepEqual(res, [], "result ok");
        });
        equal(fnx.called, false, "not called");
    });

    test("invokeUnfoldingArrayArguments simple invoke", function () {
        var pr = new jQuery.Deferred().resolve("A").promise();
        var fnx = sinon.stub().returns(pr);
        var prx = sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,["a","b","c"]).done(function (res) {
            ok(res, "A", "original promise returned");
        });
        equal(prx,pr, "original promise returned");
        deepEqual(fnx.args[0], ["a", "b", "c"]," arguments ok");
    });


    test("invokeUnfoldingArrayArguments array invoke, error, wrong arg", function () {
        var pr = new jQuery.Deferred().resolve("A").promise();
        var fnx = sinon.stub().returns(pr);
        try {
            var prx = sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,[["c1","c2","c3"]]).done(function (res) {
                ok(false,"should not get here");
            });
              ok(false,"should not get here");
        } catch (e) {
            ok(true,"got exception");
        }
    });
    test("invokeUnfoldingArrayArguments array invoke, trivial case", function () {
        var fnx = sinon.stub();
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().resolve("A2").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        var prx = sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,[[["c1"],["c2"],["c3"]]]).done(function (res) {
            deepEqual(res, [["A1"] ,["A2"], ["A3"]], "original promise returned");
        });
        deepEqual(fnx.args[0], ["c1"]," arguments ok");
        deepEqual(fnx.args[1], ["c2"]," arguments ok");
        deepEqual(fnx.args[2], ["c3"]," arguments ok");
    });
    test("invokeUnfoldingArrayArguments array invoke, multiple return arguments, multiple input argumetns", function () {
        var pr = new jQuery.Deferred().resolve("A","B").promise();
        var cnt = 0;
        var fnx = sinon.stub().returns(pr);
        var prx = sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,[[["c1", "p2"],["c2", "p22"],["c3", "p33"]]]).done(function (res) {
            deepEqual(res, [["A", "B"] ,["A", "B"], ["A", "B"]], "original promise returned");
            cnt = 1;
        });
        ok(cnt === 1, "got to done");
        deepEqual(fnx.args[0], ["c1", "p2"]," arguments  1 ok");
        deepEqual(fnx.args[1], ["c2", "p22"]," arguments 2 ok");
        deepEqual(fnx.args[2], ["c3", "p33"]," arguments 3 ok");
    });
    test("invokeUnfoldingArrayArguments array invoke, reject", function () {
        var fnx = sinon.stub();
        var cnt = 0;
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().reject("not me").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        var prx = sap.ushell.utils.invokeUnfoldingArrayArguments(fnx,[[["c1"],["c2"],["c3"]]]).done(function (res) {
            ok(false,"shoudl not get here");
            deepEqual(res, [["A1"] ,["A2"], ["A3"]], "original promise returned");
        }).fail(function(sMsg) {
            ok(true,"got here");
            cnt = 1;
        });
        ok(cnt === 1, "got to fail");
        deepEqual(fnx.args[0], ["c1"]," arguments ok");
        deepEqual(fnx.args[1], ["c2"]," arguments ok");
        deepEqual(fnx.args[2], ["c3"]," arguments ok");
    });
    test("verify format Date", function () {
        var stub = sinon.stub(sap.ushell.utils, "_getCurrentDate").returns(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)"));
        equal(sap.ushell.utils.formatDate(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)")), "Just arrived");
        equal(sap.ushell.utils.formatDate(new Date("Thu Dec 30 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 hours ago");
        equal(sap.ushell.utils.formatDate(new Date("Thu Dec 29 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "1 day ago");
        equal(sap.ushell.utils.formatDate(new Date("Thu Dec 24 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 days ago");
        equal(sap.ushell.utils.formatDate(new Date("Thu Dec 30 2015 17:39:41 GMT+0200 (Jerusalem Standard Time)")), "10 minutes ago");
        stub.restore();
    });

    test('Test retrieved visible tiles', function () {
        var oCore = sap.ui.getCore(),
            oCoreStub = sinon.stub(oCore, 'byId'),
            jQueryFindStub = sinon.stub(window, 'jQuery', function (arg) {
                return arg !== '#shell-hdr' ? arg : {height: sinon.stub()};
            }),
            oUtils = sap.ushell.utils,
            aVisibleTileoUtils;

        //Stubs.
        oCoreStub.withArgs('viewPortContainer').returns({
            getCurrentCenterPage: function () {
                return 'application-Shell-home';
            }
        });
        oCoreStub.withArgs('dashboardGroups').returns({
            getDomRef: function () {
                return {
                    is: function (str) {
                        return str === ":visible";
                    }
                };
            },
            getGroups: function () {
                return [{
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return {
                                            top: 10
                                        };
                                    },
                                    height: function() {
                                        return 10;
                                    }
                                };
                            }
                        },{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return {
                                            top: 10
                                        };
                                    },
                                    height: function() {
                                        return 10;
                                    }
                                };
                            }
                        }];
                    },
                    getVisible: function () {
                        return true;
                    }
                }, {
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return {
                                            top: 10
                                        };
                                    },
                                    height: function() {
                                        return 10;
                                    }
                                };
                            }
                        },{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return {
                                            top: 10
                                        };
                                    },
                                    height: function() {
                                        return 10;
                                    }
                                };
                            }
                        }];
                    },
                    getVisible: function () {
                        return true;
                    }
                }, {
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return {
                                            top: 10
                                        };
                                    },
                                    height: function() {
                                        return 10;
                                    }
                                };
                            }
                        },{
                            getDomRef: function () {
                                return {
                                    offset: function () {
                                        return undefined;
                                    }
                                };
                            }
                        }];
                    },
                    getVisible: function () {
                        return true;
                    }
                }];
            },
            getModel: function () {
                return {
                    getProperty: function() {
                        return 'home';
                    }
                };
            }
        });

        //Actual Test.
        aVisibleTileoUtils = oUtils.getVisibleTiles();
        ok(aVisibleTileoUtils.length === 5, 'Expected retrieved 5 visible tiles as one of the tile has no offset');

        //Clean-up.
        oCoreStub.restore();
        jQueryFindStub.restore();


    });

    test("test setTilesNoVisibility for all tiles", function () {
        var aTiles = ["tile1" ,"tile2", "tile3"],
            getVisibleTilesStub = sinon.stub(sap.ushell.utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(sap.ushell.utils, "getTileObject").returns({});

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                setTileVisible: function() {}
            })
        };
        var setVisibleTilesStub = sinon.stub(sap.ushell.Container.getService(), "setTileVisible");

        sap.ushell.utils.setTilesNoVisibility();
        ok(setVisibleTilesStub.calledThrice, "setTileVisible was called 3 times");
        ok(setVisibleTilesStub.args[0][1] === false, "setTileVisible #1 was called with visibility 'false'");
        ok(setVisibleTilesStub.args[1][1] === false, "setTileVisible #2 was called with visibility 'false'");
        ok(setVisibleTilesStub.args[2][1] === false, "setTileVisible #3 was called with visibility 'false'");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        setVisibleTilesStub.restore();
    });

    test("test handleTilesVisibility for all tiles", function () {
        var aTiles = [{"isDisplayedInViewPort" : true} ,{"isDisplayedInViewPort" : true}, {"isDisplayedInViewPort" : false}],
            getVisibleTilesStub = sinon.stub(sap.ushell.utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(sap.ushell.utils, "getTileObject").returns("tile object");

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                setTileVisible: function() {}
            })
        };
        var setTileVisibleStub = sinon.stub(sap.ushell.Container.getService(), "setTileVisible");

        sap.ushell.utils.handleTilesVisibility();
        ok(setTileVisibleStub.calledThrice, "launchPageService.setTileVisible was called 3 times");
        ok(setTileVisibleStub.args[0][1] === true, "setTileVisible #1 was called with visibility 'true'");
        ok(setTileVisibleStub.args[1][1] === true, "setTileVisible #2 was called with visibility 'true'");
        ok(setTileVisibleStub.args[2][1] === false, "setTileVisible #3 was called with visibility 'false'");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        setTileVisibleStub.restore();
    });

    test("test refreshTiles for all visible tiles", function () {
        var aTiles = ["tile1" ,"tile2", "tile3"],
            getVisibleTilesStub = sinon.stub(sap.ushell.utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(sap.ushell.utils, "getTileObject").returns(aTiles[0]);

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                refreshTile: function() {}
            })
        };
        var refreshTileStub = sinon.stub(sap.ushell.Container.getService(), "refreshTile");

        sap.ushell.utils.refreshTiles();
        ok(refreshTileStub.calledThrice, "launchPageService.refreshTile was called 3 times");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        refreshTileStub.restore();
    });

    test("test - check if group has tiles and links", function () {
        var aTiles = [{id:"tile1", isTileIntentSupported:true}, {id:"tile1", isTileIntentSupported:true}],
            aLinks = [{id:"link1", isTileIntentSupported:true}],
            bHasContent = false;

        bHasContent = sap.ushell.utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has tiles and links");

        aLinks = [];
        bHasContent = sap.ushell.utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has tiles");

        aTiles = [];
        bHasContent = sap.ushell.utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === false, "group has no tiles or links");

        aLinks = [{id:"link1", isTileIntentSupported:true}];
        bHasContent = sap.ushell.utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has links");
    });
}());
