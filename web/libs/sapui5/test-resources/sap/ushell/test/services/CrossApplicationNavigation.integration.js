// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.CrossApplicationNavigation
 */
(function () {
    "use strict";
    /*global assert, asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, OData, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container");

    var sHASH_DESKTOP = "#AccessControlRole-testFormFactorDesktop",
        sHASH_TABLET_PHONE = "#AccessControlRole-testFormFactorTabletPhone";

    /**
     * Returns the given links' intents which match
     * <code>/^#AccessControlRole-testFormFactor/</code>.This is useful to concentrate only on the
     * intents relevant for this test.
     *
     * @param {object[]} aLinks
     * @returns {string[]}
     */
    function filter(aLinks) {
        /*jslint regexp:true */
        var aResult = [],
            sIntent;
        aLinks.forEach(function (oLink) {
            //substring of oLink.Intent without characters following ~ or ?
            //we need this regular expression to filter out also intents such as testFormFactorDesktopPhone
            sIntent = oLink.intent.replace(/(\?|~).*/, "");
            if ( (/^#AccessControlRole-testFormFactorDesktop$/.test(sIntent)) || (/^#AccessControlRole-testFormFactorTabletPhone$/.test(sIntent)) ) {
               // Note: drop context suffix which is variable, but leave the part coming after  "?"
                aResult.push(oLink.intent.replace(/~[^?]*/, ""));
            }
        });
        return aResult.sort();
    }

    /**
     * A function which ignores all of its arguments and just starts QUnit once.
     *
     * BEWARE: do not directly use <code>start</code> as a success handler if any arguments are
     * passed to it! Else QUnit's semaphore becomes NaN and you run into trouble.
     */
    function start_1() {
        start(1);
    }

    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("abap", {
                abap: "sap.ushell_abap.adapters.abap"
            }).fail(sap.ui2.srvc.test.onError).done(start_1);
        },
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
                OData.read,
                OData.request,
                sap.ui2.srvc.getFormFactor
            );
            delete sap.ushell.Container;
        }
    });

    asyncTest("getSemanticObjectLinks: w/o business parameters, ignore form factor", function () {
        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("AccessControlRole", undefined, true) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aLinks) {
                var aIntents = filter(aLinks);

                start();
                strictEqual(aIntents.length, 2);
                strictEqual(aIntents[0], sHASH_DESKTOP);
                strictEqual(aIntents[1], sHASH_TABLET_PHONE);
            });
    });

    asyncTest("getSemanticObjectLinks: w/ business parameters, ignore form factor", function () {
        var mParameters = {
                A: "B",
                C: "e'e e"
            },
            sParameters = "?A=B&C=e%27e%20e";

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("AccessControlRole", mParameters, true) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aLinks) {
                var aIntents = filter(aLinks);

                start();
                strictEqual(aIntents.length, 2);
                strictEqual(aIntents[0], sHASH_DESKTOP + sParameters);
                strictEqual(aIntents[1], sHASH_TABLET_PHONE + sParameters);
            });
    });

    asyncTest("getSemanticObjectLinks: w/ business parameters, form factor tablet", function () {
        var mParameters = {
                A: "B",
                C: "e'e e"
            },
            sParameters = "?A=B&C=e%27e%20e";

        sinon.stub(sap.ui2.srvc, "getFormFactor").returns("tablet");

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("AccessControlRole", mParameters) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aLinks) {
                var aIntents = filter(aLinks);

                start();
                strictEqual(aIntents.length, 1);
                strictEqual(aIntents[0], sHASH_TABLET_PHONE + sParameters);
            });
    });

    asyncTest("getSemanticObjectLinks: w/o business parameters, form factor tablet", function () {
        sinon.stub(sap.ui2.srvc, "getFormFactor").returns("tablet");

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("AccessControlRole") // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aLinks) {
                var aIntents = filter(aLinks);

                start();
                strictEqual(aIntents.length, 1);
                strictEqual(aIntents[0], sHASH_TABLET_PHONE);
            });
    });

    asyncTest("isIntentSupported", function () {
        sinon.spy(OData, "request");
        sinon.stub(sap.ui2.srvc, "getFormFactor").returns("tablet");

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .isIntentSupported([sHASH_DESKTOP, sHASH_TABLET_PHONE]) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (mSupportedByIntent) {
                start();

                //TODO $batch requires X-CSRF-Token, this triggers additional requests!
                //Actually, what we still observe is the GET /sap/opu/odata/UI2/INTEROP/
                //to fetch that token!

                strictEqual(OData.request.callCount, 1, "number of OData requests");
                deepEqual(Object.keys(mSupportedByIntent), [sHASH_DESKTOP, sHASH_TABLET_PHONE]);
                strictEqual(mSupportedByIntent[sHASH_DESKTOP].supported, false);
                strictEqual(mSupportedByIntent[sHASH_TABLET_PHONE].supported, true);
            });
    });

    asyncTest("isIntentSupported: no intents", function () {
        sap.ushell.Container.getService("CrossApplicationNavigation")
            .isIntentSupported([]) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (mSupportedByIntent) {
                start();
                deepEqual(Object.keys(mSupportedByIntent), []);
            });
    });

    asyncTest("isIntentSupported: single intent", function () {
        sinon.spy(OData, "request"); // Note: read calls request!
        sinon.stub(sap.ui2.srvc, "getFormFactor").returns("tablet");

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .isIntentSupported([sHASH_DESKTOP]) // <-- code under test!
            .fail(sap.ui2.srvc.test.onError)
            .done(function (mSupportedByIntent) {
                start();

                strictEqual(OData.request.callCount, 1, "number of OData requests");
                strictEqual(OData.request.args[0][0].method, "POST", "method of OData request");
                deepEqual(Object.keys(mSupportedByIntent), [sHASH_DESKTOP]);
                strictEqual(mSupportedByIntent[sHASH_DESKTOP].supported, false);
            });
    });
}());
