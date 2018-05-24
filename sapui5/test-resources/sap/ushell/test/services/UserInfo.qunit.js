// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.UserInfo
 */
(function () {
    "use strict";
    /*global asyncTest, expect, module, ok, start, strictEqual, stop, test, jQuery, sap, sinon */

    // require early so that we can spy on them (and esp. try to restore the spies in teardown)
    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    jQuery.sap.require("sap.ushell.services.UserInfo");

    module("sap.ushell.services.UserInfo", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("getService", function () {
        // code under test
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        // test
        ok(oUserInfoService instanceof sap.ushell.services.UserInfo);
        strictEqual(typeof oUserInfoService.getId, "function");
    });

    test("delegation to Container", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        // prepare test
        sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({id : "id"});
        });

        // test
        strictEqual(oUserInfoService.getId(), "id");
        ok(sap.ushell.Container.getUser.calledOnce);
    });

    test("get user data", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser();

        // test
        ok(oUser.getTheme() === "sap_bluecrystal", "check user selected theme");
        ok(oUser.getAccessibilityMode() === false, "check user selected accessability mode");
    });

    test("set user data", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser(),
            bFailed = false;
        //Set
        oUser.setTheme("theme2");
        oUser.setAccessibilityMode(true);
            // test
        ok(oUser.getTheme() === "theme2", "check user selected theme");
        ok(oUser.getAccessibilityMode() === true, "check user selected accessability mode");

        oUser.isSetThemePermitted = function () {
            return false;
        };
        try {
            oUser.setTheme("theme3");
        } catch (e) {
            ok(oUser.getTheme() === "theme2", "check user  theme wasn't changed");
            bFailed = true;
        }
        ok(bFailed === true, "check that set Theme was prevented");

        oUser.isSetAccessibilityPermitted = function () {
            return false;
        };
        bFailed = false;
        try {
            oUser.setAccessibilityMode(false);
        } catch (exc) {
            ok(oUser.getAccessibilityMode() === true, "check user accessibility wasn't changed ");
            bFailed = true;
        }
        ok(bFailed === true, "check that set accessibility was prevented");



    });

    asyncTest("get theme list", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        expect(3);

        // test
        oUserInfoService.getThemeList().done(function (res) {
            start();

            var aThemeConfig = jQuery.sap.getObject("options", undefined, res);
            ok(aThemeConfig, "got the theme configuration back");
            ok(Object.prototype.toString.apply(aThemeConfig), "[object Array]", "got configuration array");
            ok(aThemeConfig.length > 0, "got a non-empty theme configuration");
        });
    });

    asyncTest("update user preferences", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser();

        oUser.setTheme("theme2");
        oUser.setAccessibilityMode("true");
        // test
        oUserInfoService.updateUserPreferences().done(function (res) {
            start();
            ok(res.status === 200, "check OK response from server");

        });
    });



}());
