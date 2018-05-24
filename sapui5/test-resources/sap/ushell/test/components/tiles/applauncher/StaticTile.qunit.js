(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.components.tiles.applauncher.StaticTile", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });

    test("createStaticTileView Test", function () {
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncher.StaticTile");
        ok(true);
    });
}());
