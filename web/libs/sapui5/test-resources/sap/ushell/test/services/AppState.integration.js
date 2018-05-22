// @copyright@
/**
 * @fileOverview QUnit integration tests for sap.ushell.services.AppState
 */
(function () {
    "use strict";
    /*jslint nomen: true, sub: true*/
    /*global asyncTest, assert, deepEqual, equal, expect, module, notDeepEqual, QUnit,
    notEqual, notStrictEqual, ok, parseInt, raises, start, strictEqual, stop, test, throws,
    sinon, jQuery, sap, window
     */
    jQuery.sap.require("sap.ushell.services.AppState");

    var oService;

    module("sap.ushell_abap.adapters.abap.AppState.integration", {
        setup: function () {
            stop();

            this.oComponent = new sap.ui.core.UIComponent();
            this.oData = {
                sText : "Some Text",
                iNumber : 1234
            };

            sap.ushell.bootstrap("abap", {abap: "sap.ushell_abap.adapters.abap"})
                .fail(sap.ui2.srvc.test.onError)
                .done(function () {
                    start();
                    oService = sap.ushell.Container.getService("AppState");
                });
        },

        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    asyncTest("save and load an AppState", function () {
        var oAppState,
            sKey,
            that = this;

        oAppState = oService.createEmptyAppState(this.oComponent);
        oAppState.setData(this.oData);
        // save key for later use
        sKey = oAppState.getKey();

        oAppState.save().done(function () {
            ok(true, "save ok");

            // clear JavaScript window to force loading from the backend
            sap.ushell.services.AppState.WindowAdapter.prototype.data._clear();

            oService.getAppState(sKey).done(function (oAppstate) {
                start();
                ok(true, "load data was triggered");
                deepEqual(oAppstate.getData(), that.oData, "Correct data was stored in the backend");
            }).fail(function (eMsg) {
                start();
                ok(false, "load data failed: " + eMsg);
            });

        }).fail(function (eMsg) {
            start();
            ok(false, "save failed: " + eMsg);
        });
    });

    asyncTest("save operation on the same app state with different session keys", function () {
        var oAppState = oService.createEmptyAppState(this.oComponent);
        if (oAppState) {
            oAppState.setData(this.oData);

            oAppState.save().done(function () {
                ok(true, "first save valid");

                // simulating different user by changing the current session key
                sinon.stub(oService, "_getSessionKey", function () { return "DIFFERENT_SESSION_KEY"; });

                oAppState.save().done(function () {
                    start();
                    ok(false, "second save operation should fail (different session id) working on the same app state");
                }).fail(function (eMsg) {
                    start();
                    ok(true, "second save failed (different session key): " + eMsg);
                });
            }).fail(function (eMsg) {
                start();
                ok(false, "first save failed: " + eMsg);
            });
        } else {
            ok(false, "createEmptyAppState did not run like expected");
        }
    });
}());
