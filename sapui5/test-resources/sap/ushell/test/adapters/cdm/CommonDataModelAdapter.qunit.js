// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
(function() {
    "use strict";
    /*global asyncTest, deepEqual, strictEqual, module, sinon, start, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.adapters.cdm.CommonDataModelAdapter");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.adapters.cdm.CommonDataModelAdapter", {
        setup : function() {
            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
        },
        teardown : function() {
            delete this.oAdapter;
            delete sap.ushell.Container;
        }
    });

    test("check Interface", function() {
        this.oAdapter = new sap.ushell.adapters.cdm.CommonDataModelAdapter(
                undefined, undefined, {
                    config : {}
                });
        strictEqual(typeof this.oAdapter.getSite, "function",
            "method getSite exists");
        strictEqual(typeof this.oAdapter.getPersonalization, "function",
        "method getPersonalization exists");
    });

    asyncTest("inject data via config", function() {
        var oAdapter =  new sap.ushell.adapters.cdm.CommonDataModelAdapter(
                undefined, undefined, {
                    config : { siteData : { "this" : "is it" } }
                });
        oAdapter.getSite().done(function(oSite) {
            deepEqual(oSite,{ "this" : "is it"}, "correct Site");
            start();
        });
    });

    asyncTest("inject promise via config", function() {
        var oDeferred = new jQuery.Deferred();
        var oAdapter =  new sap.ushell.adapters.cdm.CommonDataModelAdapter(
                undefined, undefined, {
                    config : { siteDataPromise : oDeferred }
                });
        var a = 1;
        oAdapter.getSite().done(function(oSite) {
            deepEqual(oSite,{ "some" : "data"}, "correct Site");
            deepEqual(a,2, "correct time");
            start();
        });
        a = 2;
        oDeferred.resolve({ "some" : "data", "personalization" : { "i am" : "stripped"}});
    });

    asyncTest("inject promise via config, getPersonalization", function() {
        var oDeferred = new jQuery.Deferred();
        var oAdapter =  new sap.ushell.adapters.cdm.CommonDataModelAdapter(
                undefined, undefined, {
                    config : { siteDataPromise : oDeferred }
                });
        var a = 1;
        oAdapter.getPersonalization().done(function(oPersonalization) {
            deepEqual(oPersonalization,{ "i am" : "personalization"}, "correct Personalization");
            deepEqual(a, 2, "correct time");
            start();
        });
        a = 2;
        oDeferred.resolve({ "some" : "data", "personalization" : { "i am" : "personalization"}});
    });

    asyncTest("get site via request (no config)", function() {
        var oDeferred = new jQuery.Deferred();
        var stub = sinon.stub(jQuery,"ajax", function() {
            return oDeferred;
        });
        var oAdapter =  new sap.ushell.adapters.cdm.CommonDataModelAdapter(
                undefined, undefined, {
                    config : { }
                });
        var a = 1;
        oAdapter.getSite().done(function(oSite) {
            deepEqual(stub.args[0],
                    [
                     {
                       "dataType": "json",
                       "type": "GET",
                       "url": "../../../../../../resources/sap/ushell/cdmSiteData/CommonDataModelAdapterData.json"
                     }
                   ], "correct args");
            deepEqual(oSite,{ "wow" : "data" }, "correct Site");
            deepEqual(a,2, "correct time");
            jQuery.ajax.restore();
            start();
        });
        a = 2;
        oDeferred.resolve({ "wow" : "data", "personalization" : { "i am" : "personalization"}});
    });

}());
