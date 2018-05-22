// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.factsheet.annotation.Mapping
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon, testResultData, testAnnoUrl, testMetaData */
    jQuery.sap.require("sap.ushell.components.factsheet.annotation.Mapping");
    jQuery.sap.registerModulePath("data", "/ushell/test-resources/sap/ushell/test/components/factsheet/annotation/data");
    jQuery.sap.require("data.MappingData");

    module("sap.ushell.components.factsheet.annotation.Mapping", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            if (jQuery.sap.require.restore) {
                jQuery.sap.require.restore();
            }
            delete sap.ushell.URLParsing;
        }
    });

    test("parse", function () {
        var oMapping, oResult, oResultDataToCheck;
        oMapping = sap.ushell.components.factsheet.annotation.Mapping;

        ok(oMapping !== undefined, "Load mapping");

        oResult = sap.ushell.components.factsheet.annotation.Mapping.parse(testMetaData, testAnnoUrl);
        if($.browser.msie) {
            oResultDataToCheck = testResultDataIE;
        } else {
            oResultDataToCheck = testResultData;
        }

        deepEqual(JSON.stringify(oResult), JSON.stringify(oResultDataToCheck), "Comparison of expected and parsed mapping");
    });
}());
