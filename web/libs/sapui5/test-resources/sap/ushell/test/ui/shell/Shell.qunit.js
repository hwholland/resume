// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.shell.Shell");
    jQuery.sap.require("sap.ushell.ui.shell.ShellHeadUserItem");
    jQuery.sap.require("sap.ushell.resources");

    sap.ui.core.Control.extend("my.Test", {
        renderer: function (rm, ctrl) {
            rm.write("<div style='width:10px;height:10px;background-color:gray;'");
            rm.writeControlData(ctrl);
            rm.write("></div>");
        }
    });

    var     testMultiAggregation = function (sName, oCtrl) {
            oCtrl.getMetadata()._enrichChildInfos();
            var oAggMetaData = oCtrl.getMetadata().getAllAggregations()[sName];
            var oType = jQuery.sap.getObject(oAggMetaData.type === "sap.ui.core.Control" ? "my.Test" : oAggMetaData.type);

            function _get(){
                return oCtrl[oAggMetaData._sGetter]();
            }

            function _mutator(bInsert, aArgs) {
                var sMutator = oAggMetaData._sMutator;
                if (bInsert) {
                    sMutator = sMutator.replace("add", "insert");
                }
                oCtrl[sMutator].apply(oCtrl, aArgs);
            }

            function _removeAll() {
                var sMutator = oAggMetaData._sGetter;
                sMutator = sMutator.replace("get", "removeAll");
                oCtrl[sMutator].apply(oCtrl);
            }

            equal(_get().length, 0, "Initial number of " + sName + " controls");
            _mutator(false, [new oType(sName + "_1")]);
            equal(_get().length, 1, "Number of " + sName + " controls after add");
            _mutator(true, [new oType(sName + "_2"), 0]);
            equal(_get().length, 2, "Number of " + sName + " controls after insert");
            equal(_get()[0].getId(), sName + "_2", "First " + sName + " control");
            equal(_get()[1].getId(), sName + "_1", "Second " + sName + " control");
            oCtrl[oAggMetaData._sRemoveMutator](0);
            equal(_get().length, 1, "Number of " + sName + " controls after remove");
            equal(_get()[0].getId(), sName + "_1", "First " + sName + " control");
            _removeAll();
            equal(_get().length, 0, "Number of " + sName + " controls after removeAll");
        },
        oShell,
        oShell2;


    module("sap.ushell.ui.shell.Shell", {
        setup: function () {
            jQuery('<div id="canvas"></div>').appendTo('body');
            oShell =  new sap.ushell.ui.shell.Shell("shell", {
                content: [new my.Test("_ctnt")],
                paneContent: [new my.Test("_pane_ctnt")],
                curtainContent: [new my.Test("_curt_ctnt")],
                curtainPaneContent: [new my.Test("_curt_pane_ctnt")],
                headItems: [new sap.ushell.ui.shell.ShellHeadItem("_itm")],
                headEndItems: [new sap.ushell.ui.shell.ShellHeadItem("_end_itm")],
                search: new my.Test("search"),
                user: new sap.ushell.ui.shell.ShellHeadUserItem("_useritm", {username: "name", image: "sap-icon://person-placeholder"})
            });
            oShell2 =  new sap.ushell.ui.shell.Shell("shell2", {
                icon: "../icon.png",
                showPane: true,
                showCurtain: true,
                showCurtainPane: true,
                headerHiding: true,
                searchVisible: false,
                title: "TITLE"
            });
            oShell.placeAt('canvas');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oShell.destroy();
            oShell2.destroy();
            jQuery("#canvas").remove();
        }
    });

    /** ----**/
    /** API **/
    /** ----**/
    test("Properties - Default Values", function () {
        equal(oShell.getIcon(), "", "Default 'icon'");
        equal(oShell.getShowPane(), false, "Default 'showPane'");
        equal(oShell.getShowCurtain(), false, "Default 'showCurtain'");
        equal(oShell.getShowCurtainPane(), false, "Default 'showCurtainPane'");
        equal(oShell.getHeaderHiding(), false, "Default 'headerHiding'");
        equal(oShell.getSearchVisible(), true, "Default 'searchVisible'");
        equal(oShell.getTitle(), undefined, "Default Title");
    });

    test("Properties - Custom Values", function () {
        equal(oShell2.getIcon(), "../icon.png", "Custom 'icon'");
        equal(oShell2.getShowPane(), true, "Custom 'showPane'");
        equal(oShell2.getShowCurtain(), true, "Custom 'showCurtain'");
        equal(oShell2.getShowCurtainPane(), true, "Custom 'showCurtainPane'");
        equal(oShell2.getHeaderHiding(), true, "Custom 'headerHiding'");
        equal(oShell2.getSearchVisible(), false, "Custom 'searchVisible'");
        equal(oShell2.getTitle(), "TITLE", "Default Title");
    });

    test("Set/Get title", function () {
        equal(oShell.getTitle(), undefined, "Default Title - no value exist");// default
        oShell.setTitle("");
        equal(oShell.getTitle(), "", "Empty Title");// empty value
        oShell.setTitle("DEMO_TITLE");
        equal(oShell.getTitle(), "DEMO_TITLE", "Custom Title");// set a new value
    });

    test("Aggregation 'content'", function () {
        testMultiAggregation("content", oShell2);
    });

    test("Aggregation 'paneContent'", function () {
        testMultiAggregation("paneContent", oShell2);
    });

    test("Aggregation 'curtainContent'", function () {
        testMultiAggregation("curtainContent", oShell2);
    });

    test("Aggregation 'curtainPaneContent'", function () {
        testMultiAggregation("curtainPaneContent", oShell2);
    });

    test("Aggregation 'headItems'", function () {
        testMultiAggregation("headItems", oShell2);
    });

    test("Aggregation 'headEndItems'", function () {
        testMultiAggregation("headEndItems", oShell2);
    });

    test("Aggregation 'search'", function () {
        ok(!oShell2.getSearch(), "Initially no search control");
        oShell2.setSearch(new my.Test());
        ok(!!oShell2.getSearch(), "Search control available after set");
        oShell2.setSearch(null);
        ok(!oShell2.getSearch(), "No search control again");
    });

    test("Aggregation 'user'", function () {
        ok(!oShell2.getUser(), "Initially no user button");
        oShell2.setUser(new sap.ushell.ui.shell.ShellHeadUserItem());
        ok(!!oShell2.getUser(), "User button available after set");
        oShell2.setUser(null);
        ok(!oShell2.getUser(), "No user button again");
    });

    /** ----------**/
    /** Rendering **/
    /** ----------**/
    asyncTest("Content", function () {
        setTimeout(function () {
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-center"), jQuery.sap.domById("search")), "Search rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-begin"), jQuery.sap.domById("_itm")), "Header Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_end_itm")), "Header End Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_useritm")), "User button rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-curt-container-canvas"), jQuery.sap.domById("_curt_ctnt")), "Curtain Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-curt-container-pane"), jQuery.sap.domById("_curt_pane_ctnt")), "Curtain Pane rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-container-canvas"), jQuery.sap.domById("_ctnt")), "Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-container-pane"), jQuery.sap.domById("_pane_ctnt")), "Pane Content rendered correctly");
            start();
        }, 500);
    });

    /** ----------**/
    /** Behavior  **/
    /** ----------**/
    asyncTest("Open/Close Pane", function () {
        function checkVisibility() {
            return jQuery.sap.byId("shell-container-panecntnt").is(":visible");
        }

        ok(!checkVisibility(), "Pane initially hidden");
        oShell.setShowPane(true);

        setTimeout(function () {
            ok(checkVisibility(), "Pane visible");
            oShell.setShowPane(false);
            setTimeout(function () {
                ok(!checkVisibility(), "Pane hidden again");
                start();
            }, 600);
        }, 600);
    });

    asyncTest("Open Curtain", function () {
        function checkVisibility() {
            return jQuery.sap.byId("shell-curtcntnt").is(":visible");
        }
        ok(!checkVisibility(), "Curtain initially hidden");
        oShell.setShowCurtain(true);

        setTimeout(function () {
            ok(checkVisibility(), "Curtain visible");
            start();
        }, 600);
    });

    asyncTest("Close Curtain", function () {
        function checkVisibility() {
            return jQuery.sap.byId("shell-curtcntnt").is(":visible");
        }

        oShell.setShowCurtain(false);

        setTimeout(function () {
            ok(!checkVisibility(), "Curtain hidden again");
            start();
        }, 600);
    });

}());