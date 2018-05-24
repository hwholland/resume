// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.tiles.utilsRT.js
 */
(function () {
    "use strict";
    /*global equal, module, notEqual, stop, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.components.tiles.utilsRT");

    module("sap.ushell.components.tiles.utilsRT", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {

        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    test("check addParamsToUrl()", function () {
        var data = {};
        data.targetParams = ['query=mondial'];

        var sURL = sap.ushell.components.tiles.utilsRT.addParamsToUrl('http://www.google.com', data);
        equal(sURL, 'http://www.google.com?query=mondial',"Test 6.1: URL parameters were added");

        //Test URL that already had a query parameter
        data.targetParams = ['team=Brazil'];
        var sURL = sap.ushell.components.tiles.utilsRT.addParamsToUrl(sURL, data);
        equal(sURL, 'http://www.google.com?query=mondial&team=Brazil',"Test 6.2: URL parameters were added");
    });

    test("check default formatting number", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT;
        var    fnNormalizeSpy = sinon.spy(oUtils, "_normalizeNumber");
      var      fnFormatNumberTestHelpper = function (maxCharactersInDisplayNumber, bCalled, bProccessDigits, oConfig, oDynamicData) {
                var fnProccessDigitStub = sinon.stub(oUtils, "_shouldProcessDigits").returns(bProccessDigits);

                oUtils.getDataToDisplay(oConfig, oDynamicData);
                ok(fnNormalizeSpy.calledOnce === bCalled, bCalled ? "normalizeNumber is expected to be called once" : "normalizeNumber isn't expected to be called once");
                if (bCalled) {
                    ok(fnNormalizeSpy.args[0][1] === maxCharactersInDisplayNumber, "When the tile contains icon, the maximum allowed digits is: 4, otherwise: 5");
                }

                fnNormalizeSpy.reset();
                fnProccessDigitStub.restore();
            };

        fnFormatNumberTestHelpper(4, true, false,  {display_icon_url: 'test'}, {number: '12345'});
        fnFormatNumberTestHelpper(5, true, false, {display_icon_url: undefined}, {number: '123456'});
        fnFormatNumberTestHelpper(5, true, true, {display_icon_url: undefined}, {number: '123'});
        fnFormatNumberTestHelpper(4, false, false, {display_icon_url: 'test'}, {number: '123'});
    });

    test("check normalizing number", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT,
            oNormalizedNum;

        oNormalizedNum = oUtils._normalizeNumber("Not_a_Number", 5);
        ok(oNormalizedNum.displayNumber === "Not_a", "Test normalizing number when the string value is NaN and the allowed number of digit is 5");
        oNormalizedNum = oUtils._normalizeNumber("123456", 5);
        ok(oNormalizedNum.displayNumber === "123.4", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "K", "Test normalizing number when number is: '1000000 > number > 999'");
        oNormalizedNum = oUtils._normalizeNumber("1234567", 5);
        ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "M", "Test normalizing number when number is: '1000000000 > number > 999999'");
        oNormalizedNum = oUtils._normalizeNumber("1234567890", 5);
        ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "B", "Test normalizing number when number is: '10000000000 > number > 999999999'");
        oNormalizedNum = oUtils._normalizeNumber("123", 5, 'TEST');
        ok(oNormalizedNum.numberFactor === "TEST", "Test normalizing number when the Number Factor is predifined");
        oNormalizedNum = oUtils._normalizeNumber("12345.5", 3);
        ok(oNormalizedNum.displayNumber === "12", "Test normalizing number - Assure that if the last carachter after formatting is '.' , it's being truncated");
    });

    test("check should process digits", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT,
            bShouldProcessDigits;

        bShouldProcessDigits = oUtils._shouldProcessDigits("1234");
        ok(!bShouldProcessDigits, "_shouldProcessDigits should be falsy when the Display Number doesn't contain a decimal point");
        bShouldProcessDigits = oUtils._shouldProcessDigits("12.34", 1);
        ok(bShouldProcessDigits, "_shouldProcessDigits should be truthy when the number of tenths is greater the number of digits to display");
        bShouldProcessDigits = oUtils._shouldProcessDigits(12.34, 1);
        ok(bShouldProcessDigits, "_shouldProcessDigits should handle non string (number) values for the  argument: sDisplayNumber");
    });
}());
