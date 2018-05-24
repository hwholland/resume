
// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.dashboard.DashboardContent
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.components.flp.launchpad.DashboardManager");
    jQuery.sap.require("sap.ushell.renderers.fiori2.AccessKeysHandler");
    jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");

    var oController,
        fnHandleNotificationsPreviewTestHelper,
        fn_handleNotificationsPreviewVisibilityTestHelper,
        fn_handleGroupVisibilityChangesTestHelper;

    module("sap.ushell.components.flp.Component", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.dashboard.DashboardContent");
        },
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();

        }
    });

    test("Test - _appOpenedHandler", function () {

        var oModel = new sap.ui.model.json.JSONModel({
                currentViewName: "home",
                tileActionModeActive: true,
                getProperty: function () {
                }
            }),
            oData = {
                additionalInformation: {
                    indexOf: function (data) {
                        return -1;
                    }
                }
            };
        oController.getOwnerComponent = function () {
            return {
                getMetadata: function () {
                    return {
                        getComponentName: function () {
                            return 1;
                        }
                    };
                }
            };
        };
        oController.getView = sinon.stub().returns({
            getModel : function () {
                return oModel;
            }
        });

        jQuery.sap.require("sap.ushell.components.flp.ActionMode");
        sap.ushell.components.flp.ActionMode.init(oModel);

        ok(sap.ushell.components.flp.ActionMode.oModel.getProperty("/tileActionModeActive") === true , "Action mode is true at start test");
        oController._appOpenedHandler("","",oData);
        ok(sap.ushell.components.flp.ActionMode.oModel.getProperty("/tileActionModeActive") === false , "Action mode is false after _appOpenedHandler ");
    });

    test("Test scrollToFirstVisibleGroup: no groups", function () {

        var oData = {};

        oController.oView = {
            oDashboardGroupsBox: {
                getGroups: function () {
                    return null;
                }
            }
        };
        try {
            oController._scrollToFirstVisibleGroup(null, null, oData);
        } catch (e) {
            ok(false, "scrollToFirstVisibleGroup breaks on no-groups");
        }
        ok(true, "scrollToFirstVisibleGroup works with no groups");

    });

    test("Test modelLoaded", function () {
        jQuery.sap.require("sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions");
        var fOriginalModelInitialized = oController.bModelInitialized,
            oLayoutStab = sap.ushell.Layout,
            uiActionsInitStub,
            oTempViewData = {
                bModelInitialized : false,
                getModel: function () {
                    return {};
                },
                getController: function () {
                    return oController;
                }
            };

        oController.bModelInitialized = false;
        uiActionsInitStub = sinon.stub(oController, "_initializeUIActions").returns();
        sap.ushell.Layout =  {
            getInitPromise: function () {
                return jQuery.Deferred().resolve()
            }
        };
        oController.getView = function () {
            return oTempViewData;
        };

        oController._modelLoaded.apply(oController);

        ok(oController.bModelInitialized === true, "bModelInitialized is set to true");
        ok(uiActionsInitStub.calledOnce, "_handleUIActions is called once");

        uiActionsInitStub.restore();
        oController.bModelInitialized = fOriginalModelInitialized;
        sap.ushell.Layout = oLayoutStab;
    });

    test("Test scrollToFirstVisibleGroup: no groups", function () {

        var oData = {};

        oController.oView = {
            oDashboardGroupsBox: {
                getGroups: function () {
                    return null;
                }
            }
        };
        try {
            oController._scrollToFirstVisibleGroup(null, null, oData);
        } catch (e) {
            ok(false, "scrollToFirstVisibleGroup breaks on no-groups");
        }
        ok(true, "scrollToFirstVisibleGroup works with no groups");

    });

    test("Test scrollToGroup: no groups", function () {

        var oData = {};

        oController.oView = {
            oDashboardGroupsBox: {
                getGroups: function () {
                    return null;
                }
            }
        };
        oController.getView = function () {
            return {
                getModel: function () {
                    return {};
                }
            };
        };
        try {
            oController._scrollToGroup(null, null, oData);
        } catch (e) {
            ok(false, "scrollToGroup breaks on no-groups");
        }
        ok(true, "scrollToGroup works with no groups");

    });

    asyncTest("Test _onAfterDashboardShow with home state", function () {
        var oModel = new sap.ui.model.json.JSONModel({
                currentViewName: "home",
                tileActionModeActive: false,
                getProperty: function () {
                }
            }),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                    return oModel;
                }
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                setHeaderHiding: sinon.spy(),
                applyExtendedShellState: sinon.spy()
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                shiftCenterTransitionEnabled: function () {},
                shiftCenterTransition: function () {},
                attachAfterNavigate: function () {
                },
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                        }
                    };
                },
                enlargeCenterTransition: function (bFlag) {}
            }),
            oView = sap.ui.jsview('sap.ushell.components.flp.launchpad.dashboard.DashboardContent'),
            onAfterNavigateStub = sinon.stub(oView, 'onAfterNavigate').returns({}),
            oEventBus = sap.ui.getCore().getEventBus(),
            handleTilesVisibilityStub = sinon.stub(sap.ushell.utils, 'handleTilesVisibility'),
            refreshTilesStub = sinon.stub(sap.ushell.utils, 'refreshTiles'); /*,
            oDemiViewPortData = {
                //TileBase Constructor arguments
                id: "viewPortContainer",
                defaultState: sap.ushell.ui.launchpad.ViewPortState.Center
            },
            oViewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer(oDemiViewPortData),
            oViewPortFunctionStub = sinon.stub(oViewPortContainer, "enlargeCenterTransition").returns({}); */

        oEventBus.publish("launchpad", "contentRendered");
        setTimeout(function () {
            start();
            ok(onAfterNavigateStub.called, "onAfterNavigate called");
            ok(refreshTilesStub.called, "refreshTiles was called");
            oOwnerComponentStub.restore();
            oGetCoreByIdStub.restore();
            handleTilesVisibilityStub.restore();
            refreshTilesStub.restore();
            getRendererStub.restore();
            //oViewPortFunctionStub.restore();
            oView.destroy();
        }, 0);
    });

    asyncTest("Test dashboardTilePress", function () {
        var oEventBus = sap.ui.getCore().getEventBus(),
            fDashboardTileClick = function () {
                return;
            };

        fDashboardTileClick = sinon.spy();

        oEventBus.subscribe("launchpad", "dashboardTileClick", fDashboardTileClick, this);
        oController.dashboardTilePress();

        setTimeout(function () {
            ok(fDashboardTileClick.calledOnce, "dashboardTileClick event is published");
            start();
        }, 0);
    });

    test("Test handleDashboardScroll", function () {

        var updateTopGroupInModelStub = sinon.stub(oController, "_updateTopGroupInModel"),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                addActionButton: sinon.spy(),
                getCurrentViewportState: function () {
                    return 'Center';
                },
                showRightFloatingContainer: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                setHeaderHiding: sinon.spy(),
                applyExtendedShellState: sinon.spy()
            }),
            handleTilesVisibilitySpy = sinon.spy(sap.ushell.utils, "handleTilesVisibility"),
            originView = oController.getView,
            reArrangeNavigationBarElementsSpy,
            closeOverflowPopupSpy,
            oModel = new sap.ui.model.json.JSONModel({
                scrollingToGroup: false
            }),
            oView = {
                oAnchorNavigationBar: {
                    reArrangeNavigationBarElements: function () {
                    },
                    closeOverflowPopup: function () {
                    }
                },
                getModel: function () {
                    return oModel;
                },
                _handleHeadsupNotificationsPresentation: sinon.spy()
            };

        oController.getView = function () {
            return oView;
        };

        reArrangeNavigationBarElementsSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "reArrangeNavigationBarElements");
        closeOverflowPopupSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "closeOverflowPopup");

        oController._handleDashboardScroll();

        ok(updateTopGroupInModelStub.calledOnce, 'updateTopGroupInModel is called once');
        ok(handleTilesVisibilitySpy.calledOnce, 'handleTilesVisibility is called once');
        ok(reArrangeNavigationBarElementsSpy.calledOnce, "reArrangeNavigationBarElementsSpy is called once");
        ok(closeOverflowPopupSpy.calledOnce, "closeOverflowPopupSpy is called once");

        updateTopGroupInModelStub.restore();
        handleTilesVisibilitySpy.restore();
        getRendererStub.restore();
        oController.getView = originView;
    });

    test("Test - updateTopGroupInModel", function () {

        var getIndexOfTopGroupInViewPortStub = sinon.stub(oController, "_getIndexOfTopGroupInViewPort"),
            oModel = new sap.ui.model.json.JSONModel({
                topGroupInViewPortIndex: 10
            }),
            originView = oController.getView;

        oController.getView = sinon.stub().returns({
            getModel : function () {
                return oModel;
            }
        });

        oController._updateTopGroupInModel();

        ok(getIndexOfTopGroupInViewPortStub.calledOnce, "getIndexOfTopGroupInViewPort is called once");
        ok(!oModel.getProperty("/topGroupInViewPortIndex"), "topGroupInViewPortIndex has changed");

        getIndexOfTopGroupInViewPortStub.restore();
        oController.getView = originView;
    });

    test("Test - updateTopGroupInModel", function () {
        var getIndexOfTopGroupInViewPortStub = sinon.stub(oController, "_getIndexOfTopGroupInViewPort"),
            oModel = new sap.ui.model.json.JSONModel({
                topGroupInViewPortIndex: 10
            }),
            originView = oController.getView;

        oController.getView = sinon.stub().returns({
            getModel : function () {
                return oModel;
            }
        });

        oController._updateTopGroupInModel();

        ok(getIndexOfTopGroupInViewPortStub.calledOnce, "getIndexOfTopGroupInViewPort is called once");
        ok(!oModel.getProperty("/topGroupInViewPortIndex"), "topGroupInViewPortIndex has changed");

        getIndexOfTopGroupInViewPortStub.restore();
        oController.getView = originView;
    });

    /**
     * Test DashboardContent controller's function _notificationsUpdateCallback.
     *
     * _notificationsUpdateCallback is invoked three times during the test, and each time that it queries notifications service for updated notifications
     * - it gets different data (aNotificationsFromService_1, null and aNotificationsFromService_2).
     * _notificationsUpdateCallback finds the first (up to) five new high-priority notifications and updates the model (aPreviewNotification)
     * The test checks the objects in the model property (array) aPreviewNotification after each call to _notificationsUpdateCallback
     */
    asyncTest("Test - Notifications preview update callback", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            oInnerSetPropertySpy = sinon.spy(),
            oClock = sinon.useFakeTimers(),
            aNotificationsFromService_1 = [
                {"Id": "Notification0", "Priority": "MEDIUM", "CreatedAt": "2016-02-29T15:53:26Z", "NavigationTargetObject" : "Object1", "NavigationTargetAction": "Action1", "NavigationTargetParams": "Params1"},
                {"Id": "Notification1", "Priority": "HIGH", "CreatedAt": "2016-02-29T15:43:26Z", "NavigationTargetObject" : "Object2", "NavigationTargetAction": "Action2", "NavigationTargetParams": "Params2"},
                {"Id": "Notification2", "Priority": "HIGH", "CreatedAt": "2016-02-29T15:23:26Z"},
                {"Id": "Notification3", "Priority": "HIGH", "CreatedAt": "2016-02-29T14:53:26Z"},
                {"Id": "Notification4", "Priority": "HIGH", "CreatedAt": "2016-02-28T15:53:26Z"}
            ],
            aNotificationsFromService_2 = [
                {"Id": "Notification5", "Priority": "MEDIUM", "CreatedAt": "2016-03-28T15:53:26Z"},
                {"Id": "Notification0", "Priority": "MEDIUM", "CreatedAt": "2016-02-29T15:53:26Z"},
                {"Id": "Notification1", "Priority": "HIGH", "CreatedAt": "2016-02-29T15:43:26Z"},
                {"Id": "Notification2", "Priority": "HIGH", "CreatedAt": "2016-02-29T15:23:26Z"},
                {"Id": "Notification3", "Priority": "HIGH", "CreatedAt": "2016-02-29T14:53:26Z"},
                {"Id": "Notification4", "Priority": "HIGH", "CreatedAt": "2016-02-28T15:53:26Z"}
            ],
            // now 3 items were dismissed from the notifications view
            aNotificationsFromService_3 = [
                {"Id": "Notification0", "Priority": "MEDIUM", "CreatedAt": "2016-02-29T15:53:26Z"},
                {"Id": "Notification2", "Priority": "HIGH", "CreatedAt": "2016-02-29T15:23:26Z"}
            ],
            aPreviewNotification = [],
            iCallCount = 0,
            oByIdStub;

        oByIdStub = sinon.stub(sap.ui.getCore(), 'byId').returns({
            setEnableBounceAnimations : function () {},
            getCurrentState : function () {
                return "Center";
            },
            getProperty : function (sProperty) {
                if (sProperty === "datetime") {
                    return "2016-03-16T14:10:40Z";
                }
            },
            getDatetime : function () {
                return "2016-02-16T14:10:40Z";
            }
        });

        // We want getModel().getProperty("/previewNotificationItems") to return the local array aPreviewNotification
        //and getModel().setProperty("/previewNotificationItems", oValue) - to update it
        oController.oView = {
            getModel : function () {
                return {
                    getProperty : function (aProperty) {
                        if (aProperty === "/previewNotificationItems") {
                            return aPreviewNotification;
                        }
                    },
                    setProperty : function (sProperty, oValue) {
                        if (sProperty === "/previewNotificationItems") {
                        	oInnerSetPropertySpy();
                            aPreviewNotification = oValue;
                        }
                    }
                };
            }
        };

        sap.ushell.Container.getService = function (sServiceName) {
            if (sServiceName === "Notifications") {
                return {
                    // The tested callback _notificationsUpdateCallback calls getNotifications (of notifications service)  during the test,
                    // three times during this test, each call should returns different data:
                    // The first call returns aNotificationsFromService_1
                    // The second call returns an empty array
                    // The third call returns aNotificationsFromService_2
                    getNotifications : function () {
                        iCallCount++;
                        if (iCallCount === 1) {
                            return jQuery.Deferred().resolve(aNotificationsFromService_1);
                        }
                        if (iCallCount === 2) {
                            return jQuery.Deferred().resolve(aNotificationsFromService_1);
                        }
                        if (iCallCount === 3) {
                            return jQuery.Deferred().resolve(aNotificationsFromService_2);
                        }
                        if (iCallCount === 4) {
                            return jQuery.Deferred().resolve(aNotificationsFromService_3);
                        }
                    },
                    _formatAsDate : function (sUnformated) {
                        return new Date(sUnformated);
                    }
                };
            }
        };

        // First call to the notifications update callback
        oController._notificationsUpdateCallback();
        ok(aPreviewNotification.length === 5, "After 1st call to _notificationsUpdateCallback - there are 5 notifications on the model in previewNotificationItems");
        ok(aPreviewNotification[0].originalItemId === "Notification0", "After 1st call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[0].NavigationTargetObject=== "Object1", "After 1st call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[0].NavigationTargetAction=== "Action1", "After 1st call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[0].NavigationTargetParams=== "Params1", "After 1st call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[3].originalItemId === "Notification3", "After 1st call to _notificationsUpdateCallback - Correct last notification (Notification3)");
        ok(oInnerSetPropertySpy.callCount === 1, "After 1st call to _notificationsUpdateCallback - setProperty(previewNotificationItems) called once");

        // Second call to the notifications update callback, no new notifications
        oController._notificationsUpdateCallback();
        ok(aPreviewNotification.length === 5, "After 2nd call to _notificationsUpdateCallback - there are 2 notifications on the model in previewNotificationItems");
        ok(aPreviewNotification[0].originalItemId === "Notification0", "After 2nd call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[3].originalItemId === "Notification3", "After 2nd call to _notificationsUpdateCallback - Correct last notification (Notification3)");
        ok(oInnerSetPropertySpy.callCount === 1, "After 2st call to _notificationsUpdateCallback - setProperty(previewNotificationItems) called for the 2nd time");

        // Third call to the notifications update callback
        oController._notificationsUpdateCallback();
        oClock.tick(1100);
        ok(aPreviewNotification.length === 5, "After 3rd call to _notificationsUpdateCallback - there are 5 notifications on the model in previewNotificationItems");
        ok(aPreviewNotification[0].originalItemId === "Notification5", "After 3rd call to _notificationsUpdateCallback - Correct first notification (Notification5)");
        ok(aPreviewNotification[1].originalItemId === "Notification0", "After 3rd call to _notificationsUpdateCallback - Correct second notification (Notification0)");
        ok(aPreviewNotification[2].originalItemId === "Notification1", "After 3rd call to _notificationsUpdateCallback - Correct third notification (Notification1)");
        ok(aPreviewNotification[3].originalItemId === "Notification2", "After 3rd call to _notificationsUpdateCallback - Correct fourth notification (Notification2)");
        ok(aPreviewNotification[4].originalItemId === "Notification3", "After 3rd call to _notificationsUpdateCallback - Correct fifth notification (Notification3)");
        ok(aPreviewNotification[5] === undefined, "After 3rd call to _notificationsUpdateCallback - No 6th item previewNotificationItems");
        //ok(oInnerSetPropertySpy.callCount === 2, "After 3rd call to _notificationsUpdateCallback - setProperty(previewNotificationItems) called for the 2nd time");

        // Fourth call to the notifications update callback, no new notifications
        oController._notificationsUpdateCallback();
        ok(aPreviewNotification.length === 2, "After 4th call to _notificationsUpdateCallback - there are 3 notifications on the model in previewNotificationItems");
        ok(aPreviewNotification[0].originalItemId === "Notification0", "After 4th call to _notificationsUpdateCallback - Correct first notification (Notification0)");
        ok(aPreviewNotification[1].originalItemId === "Notification2", "After 4th call to _notificationsUpdateCallback - Correct fifth notification (Notification2)");
        //ok(oInnerSetPropertySpy.callCount === 3, "After 4th call to _notificationsUpdateCallback - setProperty(previewNotificationItems) not called");

        sap.ushell.Container.getService = oOriginalGetService;
        start();
        oClock.restore();
        oByIdStub.restore();
    });

    test("Test - Groups Layout is re-arranged only when the dashboard is visible", function () {
        var addBottomSpaceStub = sinon.stub(oController, '_addBottomSpace'),
            handleTilesVisibilitySpy = sinon.stub(sap.ushell.utils, 'handleTilesVisibility'),
            jQueryStub = sinon.stub(jQuery, 'find').returns(['found']),
            reRenderGroupsLayoutSpy = sinon.spy(sap.ushell.Layout, 'reRenderGroupsLayout'),
            initializeUIActionsStub = sinon.stub(oController, '_initializeUIActions');

        oController._resizeHandler();
        ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should be re-arranged if dashBoardGroupsContainer is visible");
        jQueryStub.restore();

        jQueryStub = sinon.stub(jQuery, 'find').returns([]);
        oController._resizeHandler();
        ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should not be re-arranged if dashBoardGroupsContainer is invisible");

        jQueryStub.restore();
        addBottomSpaceStub.restore();
        handleTilesVisibilitySpy.restore();
        initializeUIActionsStub.restore();
    });

    fnHandleNotificationsPreviewTestHelper = function (sCurrentViewPortState, bExpected_ShowRightFloatingContainerCalled, bExpectedShow, iBottomRectValue, bHeadsupNotificationsInitialyVisible) {
        var getRendererStub = sinon.stub(sap.ushell.Container, 'getRenderer').returns({
            addActionButton: sinon.spy(),
            getCurrentViewportState: function () {
                return sCurrentViewPortState;
            },
            showRightFloatingContainer: sinon.spy(),
            createExtendedShellState: sinon.spy(),
            setHeaderHiding: sinon.spy(),
            applyExtendedShellState: sinon.spy()
            }),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName: undefined,
                getProperty: function () {
                }
            }),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                return oModel;
                }
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                shiftCenterTransitionEnabled: function () {},
                shiftCenterTransition: function () {},
                attachAfterNavigate: function () {
                },
                setEnableBounceAnimations: function (bFlag) {
                    return;
                },
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                        }
                    };
                },
                setRight: function() {}
            }),
            oView = sap.ui.jsview('sap.ushell.components.flp.launchpad.dashboard.DashboardContent'),
            fnRegisterNotificationsUpdateSpy = sinon.spy(),
            getServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                registerNotificationsUpdateCallback: fnRegisterNotificationsUpdateSpy,
                isFirstDataLoaded: function () {
                    return true;
                },
                getNotifications: function () {
                    return jQuery.Deferred().resolve([]);
                }
            });

        oView.oPreviewNotificationsContainer = {
            getDomRef: function () {
                return {
                    getBoundingClientRect: function () {
                        return {bottom: iBottomRectValue};
                    }
                };
            }
        };
        oView.bHeadsupNotificationsInitialyVisible = bHeadsupNotificationsInitialyVisible;
        oView._handleHeadsupNotificationsPresentation(sCurrentViewPortState);

        ok(sap.ushell.Container.getRenderer().showRightFloatingContainer.calledOnce === bExpected_ShowRightFloatingContainerCalled, "showRightFloatingContainer was called");
        ok(sap.ushell.Container.getRenderer().showRightFloatingContainer.args[0][0] === bExpectedShow, "showRightFloatingContainerCalled was called with the argument value: " + bExpectedShow);

        //Clean after tests.
        getRendererStub.restore();
        oOwnerComponentStub.restore();
        oGetCoreByIdStub.restore();
        getServiceStub.restore();
        oView.destroy();
    };

    test("test the presentation of the headsup container when the viewport is in state is Center and previewNotifications container is in the screen viewport", function () {
        fnHandleNotificationsPreviewTestHelper('Center', true, false, 1, true);
    });

    test("test the presentation of the headsup container when the viewport is in state is Center and previewNotifications container is not the screen viewport", function () {
        fnHandleNotificationsPreviewTestHelper('Center', true, true, -1, true);
    });

    test("test the presentation of the headsup container when the viewport  state is switched to Right and its' presentation was initialy disabled", function () {
        fnHandleNotificationsPreviewTestHelper('Right', true, false, -1/*doesn't matter*/, false);
    });

    test("test the presentation of the headsup container when the viewport  state is switched to Right and its' presentation was initialy enabled", function () {
        fnHandleNotificationsPreviewTestHelper('Right', true, true, -1/*doesn't matter*/, true);
    });



    fn_handleNotificationsPreviewVisibilityTestHelper = function (bEnableNotificationsPreview) {
        var getRendererStub = sinon.stub(sap.ushell.Container, 'getRenderer').returns({
                addActionButton: sinon.spy(),
                getCurrentViewportState: function () {
                    return 'Center';
                },
                showRightFloatingContainer: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                setHeaderHiding: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRightFloatingContainerVisibility: sinon.spy()
            }),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName: undefined,
                getProperty: function () {
                }
            }),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                    return oModel;
                }
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                shiftCenterTransitionEnabled: function () {},
                shiftCenterTransition: function () {},
                attachAfterNavigate: function () {
                },
                setEnableBounceAnimations: function (bFlag) {
                    return;
                },
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                        }
                    };
                },
                setRight: function() {}
            }),
            getEventBusStub = sinon.stub(oOrigCore, 'getEventBus').returns({
                subscribe: sinon.spy()
            }),
            oView = sap.ui.jsview('sap.ushell.components.flp.launchpad.dashboard.DashboardContent'),
            fnRegisterNotificationsUpdateSpy = sinon.spy(),
            getServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                registerNotificationsUpdateCallback: fnRegisterNotificationsUpdateSpy,
                isFirstDataLoaded: function () {
                    return true;
                },
                getNotifications: function () {
                    return jQuery.Deferred().resolve([]);
                }
            });

        oView.oDashboardGroupsBox.toggleStyleClass = sinon.spy();
        oView.oAnchorNavigationBar.toggleStyleClass = sinon.spy();

        oView._handleNotificationsPreviewVisibility(bEnableNotificationsPreview);

        ok(oView.oDashboardGroupsBox.toggleStyleClass.calledOnce === true, "toggle style class for adding the class which 'sqeezes' the dashboard: called");
        ok(oView.oDashboardGroupsBox.toggleStyleClass.args[0][0] === 'sapUshellDashboardGroupsContainerSqueezed' , "toggled class is: 'sapUshellDashboardGroupsContainerSqueezed'");
        ok(oView.oDashboardGroupsBox.toggleStyleClass.args[0][1] === bEnableNotificationsPreview , "toggle class isn't successfull'");

        ok(oView.oAnchorNavigationBar.toggleStyleClass.calledOnce === true, "toggle style class for adding the class which 'sqeezes' the dashboard: called");
        ok(oView.oAnchorNavigationBar.toggleStyleClass.args[0][0] === 'sapUshellAnchorNavigationBarSqueezed' , "toggled class is: 'sapUshellAnchorNavigationBarSqueezed'");
        ok(oView.oAnchorNavigationBar.toggleStyleClass.args[0][1] === bEnableNotificationsPreview , "toggle class isn't successfull'");

        ok(fnRegisterNotificationsUpdateSpy.calledOnce === bEnableNotificationsPreview, "notification callback registration isn't successfull");


        //Clean after tests.
        getRendererStub.restore();
        oOwnerComponentStub.restore();
        oGetCoreByIdStub.restore();
        getEventBusStub.restore();
        getServiceStub.restore();
        oView.destroy();
    };

    test("check dashboard and anchor navigation control are 'squeezed' when Preview Navigation container is present and that all relavant handlers are registered", function () {
        fn_handleNotificationsPreviewVisibilityTestHelper(true);
    });

    test("check dashboard and anchor navigation control are not 'squeezed' when Preview Navigation container is not present and that no redundant handler registration is being done", function () {
        fn_handleNotificationsPreviewVisibilityTestHelper(false);
    });

    asyncTest("show hide groups invoked upon 'actionModeInactive' event", function () {
        var oModel = new sap.ui.model.json.JSONModel({}),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                    return oModel;
                }
            }),
            oEventBus = sap.ui.getCore().getEventBus(),
            handleTilesVisibilityStub = sinon.stub(sap.ushell.utils, 'handleTilesVisibility'),
            getCurrentHiddenGroupIdsStub = sinon.stub(sap.ushell.utils, 'getCurrentHiddenGroupIds').returns([]);

        oEventBus.publish('launchpad', 'actionModeInactive', []);
        setTimeout(function () {
            start();
            ok(getCurrentHiddenGroupIdsStub.called, "getCurrentHiddenGroups is called");

            oOwnerComponentStub.restore();
            handleTilesVisibilityStub.restore();
            getCurrentHiddenGroupIdsStub.restore();

        }, 350);
    });

    fn_handleGroupVisibilityChangesTestHelper = function (sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, bExpectedHideGroupsCalled) {
        var getRendererStub = sinon.stub(sap.ushell.Container, 'getRenderer').returns({
                addActionButton: sinon.spy(),
                getCurrentViewportState: function () {
                    return 'Center';
                },
                showRightFloatingContainer: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                setHeaderHiding: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRightFloatingContainerVisibility: sinon.spy()
            }),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName: undefined
            }),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                    return oModel;
                }
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                shiftCenterTransitionEnabled: function () {},
                shiftCenterTransition: function () {},
                attachAfterNavigate: function () {
                },
                setEnableBounceAnimations: function (bFlag) {
                    return;
                },
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                        }
                    };
                },
                setRight: function() {}
            }),
            getEventBusStub = sinon.stub(oOrigCore, 'getEventBus').returns({
                subscribe: sinon.spy()
            }),
            oView = sap.ui.jsview('sap.ushell.components.flp.launchpad.dashboard.DashboardContent'),
            oTestController = oView.getController(),
            getServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                hideGroups: sinon.stub().returns(jQuery.Deferred().resolve())
            }),
            oGetCurrentHiddenGroupIdsStub = sinon.stub(sap.ushell.utils, "getCurrentHiddenGroupIds").returns(
                sCurrentHiddenGroupIds
            ),
            oHandleToastMessageStub = sinon.stub(oTestController, "_handleToastMessage");

        oView.setModel(oModel);
        oTestController._handleGroupVisibilityChanges('test', 'test', aOrigHiddenGroupsIds);

        ok(getServiceStub().hideGroups.called === bExpectedHideGroupsCalled, "hideGroups is called");
        ok(oHandleToastMessageStub.called === bExpectedHideGroupsCalled, "handleToastMessage is called");

        //Clean after tests.
        getRendererStub.restore();
        oOwnerComponentStub.restore();
        oGetCoreByIdStub.restore();
        getEventBusStub.restore();
        getServiceStub.restore();
        oGetCurrentHiddenGroupIdsStub.restore();
        oHandleToastMessageStub.restore();
        oView.destroy();
    };

    test("test show hide groups when user hides a group", function () {
        var sCurrentHiddenGroupIds = ['testGroupId1', 'testGroupId2', 'testGroupId3'],
            aOrigHiddenGroupsIds = ['testGroupId1', 'testGroupId2'];

        fn_handleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    test("test show hide groups when user ub-hides a group", function () {
        var sCurrentHiddenGroupIds = ['testGroupId1'],
            aOrigHiddenGroupsIds = ['testGroupId1', 'testGroupId2'];

        fn_handleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    test("test show hide groups when originally hidden groups and the currentlly hidden groups are the same ", function () {
        var sCurrentHiddenGroupIds = ['testGroupId1', 'testGroupId2'],
            aOrigHiddenGroupsIds = ['testGroupId1', 'testGroupId2'];

        fn_handleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, false);
    });

    test("test show hide groups when originally hidden groups currentlly hidden groups are of the same size bu the groups are different", function () {
        var sCurrentHiddenGroupIds = ['testGroupId1', 'testGroupId2', 'testGroupId3', 'testGroupId4'],
            aOrigHiddenGroupsIds = ['testGroupId1', 'testGroupId2', 'testGroupId5', 'testGroupId6'];

        fn_handleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    asyncTest("Test _onAfterDashboardShow with home state in Edit Mode", function () {
        var oModel = new sap.ui.model.json.JSONModel({
                currentViewName: "home",
                tileActionModeActive: true,
                getProperty: function () {
                }
            }),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, 'getOwnerComponentFor').returns({
                getModel: function () {
                    return oModel;
                }
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                setHeaderHiding: sinon.spy(),
                applyExtendedShellState: sinon.spy()
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                shiftCenterTransitionEnabled: function () {},
                shiftCenterTransition: function () {},
                attachAfterNavigate: function () {
                },
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                        }
                    };
                },
                enlargeCenterTransition: function (bFlag) {}
            }),
            oView = sap.ui.jsview('sap.ushell.components.flp.launchpad.dashboard.DashboardContent'),
            onAfterNavigateStub = sinon.stub(oView, 'onAfterNavigate').returns({}),
            oEventBus = sap.ui.getCore().getEventBus(),
            handleTilesVisibilityStub = sinon.stub(sap.ushell.utils, 'handleTilesVisibility'),
            refreshTilesStub = sinon.stub(sap.ushell.utils, 'refreshTiles'); /*,
         oDemiViewPortData = {
         //TileBase Constructor arguments
         id: "viewPortContainer",
         defaultState: sap.ushell.ui.launchpad.ViewPortState.Center
         },
         oViewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer(oDemiViewPortData),
         oViewPortFunctionStub = sinon.stub(oViewPortContainer, "enlargeCenterTransition").returns({}); */

        oEventBus.publish("launchpad", "contentRendered");
        setTimeout(function () {
            start();
            ok(onAfterNavigateStub.called, "onAfterNavigate called");
            ok(!refreshTilesStub.called, "refreshTiles should not called");
            oOwnerComponentStub.restore();
            oGetCoreByIdStub.restore();
            handleTilesVisibilityStub.restore();
            refreshTilesStub.restore();
            getRendererStub.restore();
            //oViewPortFunctionStub.restore();
            oView.destroy();
        }, 0);
    });

}());
