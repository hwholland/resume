// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.ui.launchpad.ViewPortContainer");
    jQuery.sap.require("sap.m.Button");
    jQuery.sap.require("sap.ushell.services.Container");

    var demiData = {
            //TileBase Constructor arguments
            id: "viewPortContainer",
            defaultState: sap.ushell.ui.launchpad.ViewPortState.Center
        },
        viewPortContainer,
        testContainer;

    module("sap.ushell.ui.launchpad.ViewPortContainer", {
        setup: function () {
            viewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer(demiData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            viewPortContainer.destroy();
            jQuery(testContainer).remove();
        }
    });

    asyncTest("Add center viewport - center viewport structure hierarchy correctness ", function () {
        var oTestControl = new sap.m.Button('testBtn', {text: 'testBtn'});

        viewPortContainer.addCenterViewPort(oTestControl);
        viewPortContainer.placeAt('testContainer');
        setTimeout(function () {
            start();
            var jqCenterViewPortHierarchy = jQuery(viewPortContainer.getDomRef()).find('.sapUshellViewPortWrapper').find('.sapUshellViewPortCenter').find('#testBtn'),
                bCenterViewPortHierarchyCorrect = jqCenterViewPortHierarchy.length > 0,
                bIsAddedControlHidden = jqCenterViewPortHierarchy.hasClass('hidden');

            ok(bCenterViewPortHierarchyCorrect, "The structure of the Center Viewport hierarchy is incorrect");
            ok(bIsAddedControlHidden, "Add control should be hidden");

            //Clean test content.
            oTestControl.destroy();
        }, 0);
    });

    asyncTest("Sent Initial center Viewport", function () {
        var oInitialTestControl = new sap.m.Button('testBtn1', {text: 'testBtn1'}),
            oAdditionalTestControl = new sap.m.Button('testBtn2', {text: 'testBtn2'});

        viewPortContainer.setInitialCenterViewPort(oInitialTestControl);
        viewPortContainer.addCenterViewPort(oAdditionalTestControl);
        viewPortContainer.placeAt('testContainer');
        setTimeout(function () {
            start();
            var jqInitialControl = jQuery('.sapUshellViewPortCenter').find('#testBtn1'),
                jqAdditionalControl = jQuery('.sapUshellViewPortCenter').find('#testBtn2'),
                bInitialControlAdded = jqInitialControl.length > 0,
                bAdditionalControlAdded = jqAdditionalControl.length > 0,
                bAdditionalControlHiddedn = jqAdditionalControl.hasClass('hidden');

            ok(bInitialControlAdded, "Initial control wasn't added");
            ok(bAdditionalControlAdded, "Additional control wasn't added");
            ok(bAdditionalControlHiddedn, "Additional control expected to be hidden");

            //Clean test content.
            oInitialTestControl.destroy();
            oAdditionalTestControl.destroy();
        }, 0);
    });

    asyncTest("Remove control from  the center viewPort", function () {
        var oInitialTestControl = new sap.m.Button('testBtn1', {text: 'testBtn1'}),
            oAdditionalTestControl = new sap.m.Button('testBtn2', {text: 'testBtn2'});

        viewPortContainer.setInitialCenterViewPort(oInitialTestControl);
        viewPortContainer.addCenterViewPort(oAdditionalTestControl);
        viewPortContainer.navTo('centerViewPort', oAdditionalTestControl.getId(), 'show');
        viewPortContainer.placeAt('testContainer');
        setTimeout(function () {
            start();
            var jqInitialControl = jQuery('.sapUshellViewPortCenter').find('#testBtn1'),
                jqAdditionalControl = jQuery('.sapUshellViewPortCenter').find('#testBtn2'),
                bInitialControlAdded = jqInitialControl.length > 0,
                bAdditionalControlAdded = jqAdditionalControl.length > 0,
                bInitialControlHiddedn = jqInitialControl.hasClass('hidden'),
                bAdditionalControlShown = !jqAdditionalControl.hasClass('hidden'),
                sCurrentrlyDisplayedControlId = viewPortContainer._getCurrentlyDispalyedControl("centerViewPort"),
                aVisitedControlsHistory = viewPortContainer._oViewPortsNavigationHistory.centerViewPort.visitedControls;

            ok(bInitialControlAdded, "Initial control wasn't added");
            ok(bAdditionalControlAdded, "Additional control wasn't added");
            ok(bInitialControlHiddedn, "Initial control expected to be hidden after navigation");
            ok(bAdditionalControlShown, "Additional control expected to be shown  after navigation");
            ok(sCurrentrlyDisplayedControlId === oAdditionalTestControl.getId(), "'Currently Displayed' control should be: " + oAdditionalTestControl.getId());
            ok(aVisitedControlsHistory.indexOf(oInitialTestControl.getId()) < aVisitedControlsHistory.indexOf(oAdditionalTestControl.getId()), "'CenterViewPort navigation history incorrect");

            //Clean test content.
            oInitialTestControl.destroy();
            oAdditionalTestControl.destroy();
        }, 1000);
    });

    asyncTest("Navigae to another control within the viewPort", function () {
        var oInitialTestControl = new sap.m.Button('testBtn1', {text: 'testBtn1'}),
            oAdditionalTestControl = new sap.m.Button('testBtn2', {text: 'testBtn2'});

        viewPortContainer.setInitialCenterViewPort(oInitialTestControl);
        viewPortContainer.addCenterViewPort(oAdditionalTestControl);
        viewPortContainer.navTo('centerViewPort', oAdditionalTestControl.getId(), 'show');
        viewPortContainer.placeAt('testContainer');
        viewPortContainer.removeCenterViewPort(oInitialTestControl, true);
        setTimeout(function () {
            start();
            var jqInitialControl = jQuery('.sapUshellViewPortCenter').find('#testBtn1'),
                jqAdditionalControl = jQuery('.sapUshellViewPortCenter').find('#testBtn2'),
                bInitialControlRemoved = !jqInitialControl.length,
                bAdditionalControlAdded = jqAdditionalControl.length > 0,
                bAdditionalControlShown = !jqAdditionalControl.hasClass('hidden'),
                sCurrentrlyDisplayedControlId = viewPortContainer._getCurrentlyDispalyedControl("centerViewPort");

            ok(bInitialControlRemoved, "Initial control should be removed");
            ok(bAdditionalControlAdded, "Additional control wasn't added");
            ok(bAdditionalControlShown, "Additional control expected to be shown  after navigation");
            ok(sCurrentrlyDisplayedControlId === oAdditionalTestControl.getId(), "'Currently Displayed' control should be: " + oAdditionalTestControl.getId());

            //Clean test content.
            oInitialTestControl.destroy();
            oAdditionalTestControl.destroy();
        }, 0);
    });

    test("Test varied translateX calculation", function () {
        var sLeftViewPortWidth = '40rem',
            sRightViewPortWith = '50rem',
            origJQuery = jQuery,
            oJQueryCssSpy = sinon.spy();

        jQuery = function () {
            return {
                css : oJQueryCssSpy,
                width : function (param) {
                    if (!param) {
                        return 500;
                    }
                    return 500;
                }
            };
        };
        viewPortContainer._updateStatesWithTranslateXvalues(sLeftViewPortWidth, sRightViewPortWith);
        ok(viewPortContainer._states.LeftCenter.translateX === "0", "translateX value of the left viewport is 0");
        ok(viewPortContainer._states.Center.translateX === "-40rem", "translateX value of the center viewport is -40rem");
        ok(oJQueryCssSpy.calledOnce === true, "jQuery.css called");
        ok(oJQueryCssSpy.args[0][0] === "left", "jQuery.css called for proparty felt");
        ok(oJQueryCssSpy.args[0][1] === 1000, "jQuery.css called with 1000px");
        jQuery = origJQuery;
    });

    asyncTest("Test viewport adaptation to size change", function () {
        var oInitialTestControl = new sap.m.Button('testBtn1', {text: 'testBtn1'}),
            oTestMediaRange = {name: 'desktop'},
            oDeviceMediaStub = sinon.stub(sap.ui.Device.media, "getCurrentRange").returns(oTestMediaRange),
            bOrigOrientation = sap.ui.Device.orientation.portrait,
            sExpexctedInitalTranlateX = "-47rem",
            sExpectedAfterResizeTranslateX = "-36rem",
            sExpectedAfterRotateTranslateX = '-90%',
            oOrigWindowMatchMedia = window.matchMedia;

        window.matchMedia = function (sMedia) {
            if (sMedia === '(min-width: 1600px)') {
                return {
                    matches : true
                };
            }
            return {
                matches : false
            };
        };

        viewPortContainer.setInitialCenterViewPort(oInitialTestControl);
        viewPortContainer.placeAt('testContainer');
        viewPortContainer.switchState('Center');
        setTimeout(function () {
            start();
            ok(viewPortContainer._states.Center.translateX === sExpexctedInitalTranlateX, "Expected initial translateX to be: " + sExpexctedInitalTranlateX);
           // oTestMediaRange.name = 'phone';
            window.matchMedia = function (sMedia) {
                if (sMedia === '(min-width: 1024px)') {
                    return {
                        matches : true
                    };
                }
                return {
                    matches : false
                };
            };

            viewPortContainer._handleSizeChange();
            ok(viewPortContainer._states.Center.translateX === sExpectedAfterResizeTranslateX, "Expected translateX after resize to be: " + sExpectedAfterResizeTranslateX);

            //Clean test content.
            oInitialTestControl.destroy();
            oDeviceMediaStub.restore();
            window.matchMedia = oOrigWindowMatchMedia;
            sap.ui.Device.orientation.portrait = bOrigOrientation;
        }, 0);
    });
    asyncTest("Verify setCurrentState", function () {
        var oInitialTestControlCenter = new sap.m.Button('testBtn1', {text: 'testBtn1'}),
            oInitialTestControlLeft = new sap.m.Button('testBtn2', {text: 'testBtn2'}),
            oAdditionalTestControlCenter = new sap.m.Button('testBtn3', {text: 'testBtn3'}),
            oAdditionalTestControlLeft = new sap.m.Button('testBtn4', {text: 'testBtn4'}),
            onAfterViewPortSwitchStateStub = sinon.stub(),
            oClock = sinon.useFakeTimers(),
            oOrigContainer = sap.ushell.Container;

        sap.ushell.Container = {
            getService : function (sServiceName) {
                if (sServiceName === "Notifications") {
                    return {
                        isEnabled : function () {
                            return true;
                        }
                    };
                }
            }
        };

        viewPortContainer.attachAfterSwitchState(onAfterViewPortSwitchStateStub);
        viewPortContainer.setInitialCenterViewPort(oInitialTestControlCenter);
        viewPortContainer.setInitialLeftViewPort(oInitialTestControlLeft);
        viewPortContainer.addCenterViewPort(oAdditionalTestControlCenter);
        viewPortContainer.addLeftViewPort(oAdditionalTestControlLeft);

        viewPortContainer.navTo('centerViewPort', oAdditionalTestControlCenter.getId(), 'show');
        viewPortContainer.placeAt('testContainer');
        equal(viewPortContainer.sCurrentState, "Center", "The current state should be Center");
        equal(onAfterViewPortSwitchStateStub.callCount, 0, "The fire event should not been called at this point");

        start();
        viewPortContainer.switchState("LeftCenter");
        oClock.tick(701);
        equal(viewPortContainer.sCurrentState, "LeftCenter", "The current state should be LeftCenter");
        equal(onAfterViewPortSwitchStateStub.callCount, 1, "The fire event should called once");
        viewPortContainer.switchState("Center");
        oClock.tick(701);
        equal(viewPortContainer.sCurrentState, "Center", "The current state should be Center");
        equal(onAfterViewPortSwitchStateStub.callCount, 2, "The fire event should called once");
        oClock.restore();
        viewPortContainer.removeCenterViewPort(oInitialTestControlCenter, true);
        viewPortContainer.removeLeftViewPort(oInitialTestControlLeft, true);

        sap.ushell.Container = oOrigContainer;
    });

    test("check fnOnAnimationFinished called", function () {
        var fn = sinon.stub(),
            oClock = sinon.useFakeTimers(),
            oTargetControl = new sap.m.Button(),
            oCurrentlyDisplayed = new sap.m.Button();
        oTargetControl.getDomRef = function () {
            return $('<div></div>')[0];
        };
        viewPortContainer._handleViewPortTransition('centerViewPort', 'show', oTargetControl, oCurrentlyDisplayed, fn);
        ok(fn.calledOnce, 'onAnimationFinished called after show');

        fn = sinon.stub();
        viewPortContainer._handleViewPortTransition('centerViewPort', 'slide', oTargetControl, oCurrentlyDisplayed, fn);
        oClock.tick(601);
        ok(fn.calledOnce, 'onAnimationFinished called after slide');

        fn = sinon.stub();
        viewPortContainer._handleViewPortTransition('centerViewPort', 'slideBack', oTargetControl, oCurrentlyDisplayed, fn);
        oClock.tick(751);
        ok(fn.calledOnce, 'onAnimationFinished called after slideBack');

        fn = sinon.stub();
        viewPortContainer._handleViewPortTransition('centerViewPort', 'fade', oTargetControl, oCurrentlyDisplayed, fn);
        oClock.tick(751);
        ok(fn.calledOnce, 'onAnimationFinished called after fade');

        oClock.restore();
    });

    test("Center viewPort animation", function () {
        var oAddClassSpy = sinon.spy(),
            oRemoveClassSpy = sinon.spy(),
    	    getCenterViewPortJQueryObjectStub = sinon.stub(viewPortContainer, "_getCenterViewPortJQueryObject").returns({
                addClass : oAddClassSpy,
                removeClass : oRemoveClassSpy
            }),
            oOrigContainer = sap.ushell.Container;

        sap.ushell.Container = {
            getService : function (sServiceName) {
                if (sServiceName === "Notifications") {
                    return {
                        isEnabled : function () {
                            return true;
                        }
                    };
                }
            }
        };

        viewPortContainer.sCurrentState = "Center";
        viewPortContainer._handleCenterViewPortAnimation("RightCenter");
        ok(oAddClassSpy.calledOnce === true, "Switching from Center to RightCenter, addClass called");
        ok(oRemoveClassSpy.notCalled === true, "Switching from Center to RightCenter, removeClass not called");
        ok(oAddClassSpy.args[0][0] === "sapUshellScaledCenterWhenInRightViewPort", "Switching from Center to RightCenter, correct CSS was added");

        viewPortContainer.shiftCenterTransitionEnabled(true);
        viewPortContainer.shiftCenterTransition(true);
        viewPortContainer.sCurrentState = "Center";
        viewPortContainer._handleCenterViewPortAnimation("RightCenter");
        ok(oAddClassSpy.calledTwice === true, "Switching from Center to RightCenter (wide center trnasition needed), addClass called");
        ok(oRemoveClassSpy.notCalled === true, "Switching from Center to RightCenter (wide center trnasition needed), removeClass not called");
        ok(oAddClassSpy.args[1][0] === "sapUshellScaledShiftedCenterWhenInRightViewPort", "Switching from Center to RightCenter (wide center trnasition needed), correct CSS was added");

        viewPortContainer.sCurrentState = "Center";
        viewPortContainer._handleCenterViewPortAnimation("LeftCenter");
        ok(oAddClassSpy.calledThrice === true, "Switching from Center to LeftCenter, addClass called");
        ok(oRemoveClassSpy.notCalled === true, "Switching from Center to LeftCenter, removeClass not called");
        ok(oAddClassSpy.args[2][0] === "sapUshellScaledCenterWhenInLeftViewPort", "Switching from Center to LeftCenter, correct CSS was added");

        viewPortContainer.sCurrentState = "RightCenter";
        viewPortContainer._handleCenterViewPortAnimation("Center");
        ok(oAddClassSpy.calledThrice, "Switching from RightCenter to Center, addClass not called");
        ok(oRemoveClassSpy.calledTwice === true, "Switching from RightCenter to Center, removeClass called twice");
        ok(oRemoveClassSpy.args[0][0] === "sapUshellScaledCenterWhenInRightViewPort", "Switching from RightCenter to Center, correct CSS was removed");
        ok(oRemoveClassSpy.args[1][0] === "sapUshellScaledShiftedCenterWhenInRightViewPort", "Switching from RightCenter to Center, correct CSS was removed");

        viewPortContainer.sCurrentState = "LeftCenter";
        viewPortContainer._handleCenterViewPortAnimation("Center");
        ok(oAddClassSpy.calledThrice === true, "Switching from LeftCenter to Center, addClass not called");
        ok(oRemoveClassSpy.calledThrice === true, "Switching from LeftCenter to Center, removeClass called");
        ok(oRemoveClassSpy.args[2][0] === "sapUshellScaledCenterWhenInLeftViewPort", "Switching from LeftCenter to Center, correct CSS was removed");

        viewPortContainer.sCurrentState = "LeftCenter";
        viewPortContainer._handleCenterViewPortAnimation("RightCenter");
        ok(oAddClassSpy.callCount === 4, "Switching from LeftCenter to RightCenter (wide center trnasition needed), addClass called");
        ok(oAddClassSpy.args[3][0] === "sapUshellScaledShiftedCenterWhenInRightViewPort", "Switching from LeftCenter to Center (wide center trnasition needed), correct CSS added");
        ok(oRemoveClassSpy.callCount === 4, "Switching from LeftCenter to Center (wide center trnasition needed), removeClass called");
        ok(oRemoveClassSpy.args[3][0] === "sapUshellScaledCenterWhenInLeftViewPort", "Switching from LeftCenter to Center (wide center trnasition needed), correct CSS was removed");

        viewPortContainer.shiftCenterTransitionEnabled(true);
        viewPortContainer.shiftCenterTransition(false);
        viewPortContainer.sCurrentState = "LeftCenter";
        viewPortContainer._handleCenterViewPortAnimation("RightCenter");
        ok(oAddClassSpy.callCount === 5, "Switching from LeftCenter to RightCenter, addClass called");
        ok(oAddClassSpy.args[4][0] === "sapUshellScaledCenterWhenInRightViewPort", "Switching from LeftCenter to RightCenter, correct CSS was added");
        ok(oRemoveClassSpy.callCount === 5, "Switching from LeftCenter to RightCenter, removeClass called");
        ok(oRemoveClassSpy.args[4][0] === "sapUshellScaledCenterWhenInLeftViewPort", "Switching from LeftCenter to RightCenter, correct CSS removed");

        viewPortContainer.sCurrentState = "RightCenter";
        viewPortContainer._handleCenterViewPortAnimation("LeftCenter");
        ok(oAddClassSpy.callCount === 6, "Switching from RightCenter to LeftCenter addClass called");
        ok(oAddClassSpy.args[5][0] === "sapUshellScaledCenterWhenInLeftViewPort", "Switching from RightCenter to LeftCenter, correct CSS added");
        ok(oRemoveClassSpy.callCount === 7, "Switching from RightCenter to LeftCenter, removeClass called twice");
        ok(oRemoveClassSpy.args[5][0] === "sapUshellScaledCenterWhenInRightViewPort", "Switching from RightCenter to LeftCenter, correct CSS was removed");
        ok(oRemoveClassSpy.args[6][0] === "sapUshellScaledShiftedCenterWhenInRightViewPort", "Switching from RightCenter to LeftCenter, correct CSS was removed");
        
        sap.ushell.Container = oOrigContainer;
    });
}());