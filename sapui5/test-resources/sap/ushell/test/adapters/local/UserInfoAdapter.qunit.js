/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.UserInfoAdapter
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, ok, start, stop, jQuery, sap */

    jQuery.sap.require("sap.ushell.adapters.local.UserInfoAdapter");
    jQuery.sap.require("sap.ushell.services.Container");

    var aExpectedDefaultThemeConfiguration = [
            { id: "sap_bluecrystal", name: "sap_bluecrystal" }
        ],
        fnClone = function (oJson) {
            return JSON.parse(JSON.stringify(oJson));
        };

    module("sap.ushell.adapters.local.UserInfoAdapter - getThemeList", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    [
        { testInput: { config: {} }, testDescription: "valid structure, emptyConfig" },
        { testInput: {},             testDescription: "no 'config' key provided" },
        { testInput: undefined,      testDescription: "undefined config" }

    ].forEach(function (oTestCase) {

        var sTestDescription = oTestCase.testDescription;

        asyncTest("getThemeList - returns default on " + sTestDescription, function () {
            var oAdapter = new sap.ushell.adapters.local.UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    start();

                    equal(Object.prototype.toString.apply(oResultOptions), '[object Object]',
                        "got an object back on " + sTestDescription);

                    deepEqual(oResultOptions.options, aExpectedDefaultThemeConfiguration,
                        "got expected configuration on " + sTestDescription);
                });
        });
    });

    [
        {
            testDescription: "valid configuration specified",
            testInput: {
                config: {
                    themes: [
                        { id: "theme_id_1", name: "theme name 1" },
                        { id: "theme_id_2", name: "theme name 2" },
                        { id: "theme_id_3", name: "theme name 3" }
                    ]
                }
            }
        }
    ].forEach(function (oTestCase) {

        var sTestDescription = oTestCase.testDescription;

        asyncTest("getThemeList - expected theme list on " + sTestDescription, function () {
            var oAdapter = new sap.ushell.adapters.local.UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    start();

                    equal(Object.prototype.toString.apply(oResultOptions), '[object Object]',
                        "got an object back on " + sTestDescription);

                    deepEqual(oResultOptions.options, fnClone(oTestCase.testInput.config.themes),
                        "got specified list of themes on " + sTestDescription);
                });
        });
    });

    asyncTest("getThemeList - rejects on empty list of themes", function () {
        var oAdapter = new sap.ushell.adapters.local.UserInfoAdapter(
            undefined, // unused parameter
            undefined, // unused parameter
            {
                config: {  // the input configuration
                    themes: []
                }
            }
        );

        expect(2);

        oAdapter.getThemeList()
            .fail(function (sErrorMessage) {
                ok(true, "getThemeList rejected");
                ok(sErrorMessage.match("no themes were configured"), "expected error message returned");
            })
            .always(function () {
                start();
            });
    });

    module("sap.ushell.adapters.local.UserInfoAdapter - updateUserPreferences", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    asyncTest("updateUserPreferences", function () {
        var oAdapter = new sap.ushell.adapters.local.UserInfoAdapter(); // NOTE: undefined parameters

        expect(2);

        oAdapter.updateUserPreferences({})
            .done(function (oResult) {
                equal(Object.prototype.toString.call(oResult), "[object Object]", "an object is returned");
                equal(oResult.status, 200, "status 200 is returned");
            })
            .always(function () {
                start();
            });
    });

}());
