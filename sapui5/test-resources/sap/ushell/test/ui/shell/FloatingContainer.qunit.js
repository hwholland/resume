// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* global module,ok,test,jQuery,sap,sinon*/
    jQuery.sap.require("sap.ushell.ui.shell.FloatingContainer");

    var jqTempFloatingContainer,
        oFloatingContainer,
        oContainerCssStub,
        oGetContainerHeightStub,
        oSetContainerHeightStub,
        oWindowHeightStub,
        jqTempFloatingContainer;

    module("sap.ushell.ui.shell.FloatingContainer", {
        /**
         * This method is called before each test
         */
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here
         */
        teardown: function () {
        }
    });
    //TODO: Tests should be rewritten since the resize handler functioning was completely changed
    // test("Test resizeHandler - Calculate container height when smaller window", function () {
    //    jqTempFloatingContainer = jQuery('<div id="jqAnchorItem1" class="sapUshellFloatingContainer" style="height: 700px; width: 0; top: 200px">').appendTo('body');
    //
    //     oSetContainerHeightStub = sinon.stub(sap.ushell.ui.shell.FloatingContainer.prototype, "_setContainerHeight").returns();
    //     oWindowHeightStub = sinon.stub(sap.ushell.ui.shell.FloatingContainer.prototype, "_getWindowHeight").returns(500);
    //     oFloatingContainer = new sap.ushell.ui.shell.FloatingContainer();
    //
    //     oFloatingContainer._resizeHandler();
    //     ok(oSetContainerHeightStub.calledOnce === true, "oContainer.css called once");
    //     ok(oSetContainerHeightStub.args[0][1] === 300, "oContainer.css called with max-height of 300 (window height - container top offset)");
    //
    //     oSetContainerHeightStub.restore();
    //     oWindowHeightStub.restore();
    //     oFloatingContainer.destroy();
    //     jQuery(jqTempFloatingContainer).remove();
    // });
    //
    // test("Test resizeHandler - Calculate container height with bigger window", function () {
    //     jqTempFloatingContainer = jQuery('<div id="jqAnchorItem1" class="sapUshellFloatingContainer" style="height: 700px; width: 0; top: 100px">').appendTo('body');
    //     oSetContainerHeightStub = sinon.stub(sap.ushell.ui.shell.FloatingContainer.prototype, "_setContainerHeight").returns();
    //     oWindowHeightStub = sinon.stub(sap.ushell.ui.shell.FloatingContainer.prototype, "_getWindowHeight").returns(900);
    //     oFloatingContainer = new sap.ushell.ui.shell.FloatingContainer();
    //
    //     oFloatingContainer._resizeHandler();
    //     ok(oSetContainerHeightStub.calledOnce === true, "oContainer.css called once");
    //     ok(oSetContainerHeightStub.args[0][1] === 700, "oContainer.css called with max-height of 700 (container's height)");
    //
    //     oSetContainerHeightStub.restore();
    //     oWindowHeightStub.restore();
    //     oFloatingContainer.destroy();
    //     jQuery(jqTempFloatingContainer).remove();
    // });
}());
