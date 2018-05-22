// @copyright@
/**
 * @fileOverview QUnit tests for sap/ushell/System.js
 */
(function () {
    "use strict";
    /*global module, raises, sap, strictEqual, test,
      jQuery, sinon */

    jQuery.sap.require("sap.ushell.System");

    module("sap.ushell.System");

    test("sap.ushell.System: all getter", function () {
        var oSystem = new sap.ushell.System({
                alias: 'ALIAS_FOO',
                platform: 'platform_foo',
                baseUrl: '/FOO',
                client: '120',
                system: 'XYZ'
            });

        strictEqual(oSystem.getAlias(), 'ALIAS_FOO');
        strictEqual(oSystem.getPlatform(), 'platform_foo');
        strictEqual(oSystem.getBaseUrl(), '/FOO');
        strictEqual(oSystem.getName(), 'XYZ');
        strictEqual(oSystem.getClient(), '120');
    });

    test("sap.ushell.System.adjustUrl()", function () {

        function testFail(sUrl) {
            throws(function () {
                new sap.ushell.System().adjustUrl(sUrl);
            }, /Invalid URL:/, sUrl);
        }

        function testAdjust(sUrl, oData, sExpected) {
            var oSystem = new sap.ushell.System(oData);

            strictEqual(oSystem.adjustUrl(sUrl), sExpected, sExpected);
        }

        testFail("../foo");
        testFail("/");
        testFail("http://www.sap.com");
        testAdjust("/sap/my/url", {}, "/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "/bar"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "/bar/"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "http://some.other.host:4711/"},
            "http://some.other.host:4711/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "http://some.other.host:4711/", client: "120"},
            "http://some.other.host:4711/sap/my/url?sap-client=120");
        testAdjust("/sap/my/url?foo=bar", {baseUrl: "http://some.other.host:4711/", client: "120"},
            "http://some.other.host:4711/sap/my/url?foo=bar&sap-client=120");
        testAdjust("/sap/my/url", {alias: "foo", baseUrl: "/bar/"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {alias: "foo", baseUrl: ";o="}, "/sap/my/url;o=foo");
        testAdjust("/sap/my/url", {baseUrl: ";o="}, "/sap/my/url");
    });
}());
