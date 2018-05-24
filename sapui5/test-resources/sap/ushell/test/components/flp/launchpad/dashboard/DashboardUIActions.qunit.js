
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
    jQuery.sap.require('sap.ushell.UIActions');
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions");

    var oModelData,
        oController,
        oUIActionsForTest = function () {
            return {
                enable : function () {
                    return this;
                },
                disable : function () {
                    return;
                },
                getMove : function () {
                    return {
                        "x" : "x",
                        "y" : "y"
                    };
                }
            };
        },
        dashboardGroupsUIActions,
        oDashboardGroupsUIActionsModule;

    module("sap.ushell.components.flp.Component", {
        setup: function () {
            sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions.extend("TestableDashboardUIActions", {
                metadata: {
                    publicMethods: [
                        "initializeUIActions",
                        "_handleGroupMoved",
                        "_setController",
                        "_handleGroupsUIStart",
                        "_handleGroupStartDrag",
                        "_handleGroupStartDrag",
                        "_handleGroupUIStart",
                        "_enableGroupsUIActions",
                        "_handleGroupsUIStart"
                    ]
                }
            });
            oModelData = {
                getProperty : function (sProperty) {
                    if (sProperty === "/personalization") {
                        return true;
                    }
                },
                setProperty : sinon.spy()
            };
            oController = {
                _publishAsync : sinon.spy(),
                getView : function () {
                    return {
                        isTouch : false,
                        ieHtml5DnD : false,
                        sDashboardGroupsWrapperId : "aaa",
                        oDashboardGroupsBox : {
                            getGroups : function () {
                                return {
                                    length : 5
                                };
                            }
                        },
                        getModel : function () {
                            return oModelData;
                        }
                    };
                }
            };

            dashboardGroupsUIActions = new TestableDashboardUIActions();
            oDashboardGroupsUIActionsModule = sap.ushell.components.flp.launchpad.dashboard.getDashboardUIActions();
        },
        teardown: function () {
            dashboardGroupsUIActions.destroy();
            oController = undefined;
            oModelData = undefined;
        }
    });

    test("Initialize DashboardUIActions", function () {
        var jQueryRequireStub,
            oUIActionsStub;

        oUIActionsStub = sinon.stub(sap.ushell, "UIActions").returns({
            enable : function () {
                return;
            }
        });
        jQueryRequireStub = sinon.stub(jQuery.sap, "require").returns({});
        oDashboardGroupsUIActionsModule.initializeUIActions(oController);
        ok(oUIActionsStub.callCount === 2, "Two UIAction objects were created");
        ok(oUIActionsStub.args[0][0].cloneClass ===  "sapUshellTile-clone", "First UIAction object - for tiles");
        ok(oUIActionsStub.args[1][0].cloneClass === "sapUshellDashboardGroupsContainerItem-clone", "Second UIAction object - for groups");

        jQueryRequireStub.restore();
        oUIActionsStub.restore();
    });

    asyncTest("Test handleActionModeGroupMove", function () {
        var ui,
            oUIActionsStub,
            jQueryRequireStub;

        oUIActionsStub = sinon.stub(sap.ushell, "UIActions").returns({
            enable : function () {
                return;
            }
        });
        jQueryRequireStub = sinon.stub(jQuery.sap, "require").returns({});
        oDashboardGroupsUIActionsModule.initializeUIActions(oController);
        ui = {
            item : {
                index : function () {
                    return 1;
                },
                startPos : 0
            }
        };

        oDashboardGroupsUIActionsModule._handleGroupMoved(null, ui);

        setTimeout(function () {
            ok(oController._publishAsync.calledOnce, "_publishAsync is called once");
            ok(oModelData.setProperty.calledOnce === true, "Model setProperty.calledOnce");
            ok(oModelData.setProperty.args[0][0] === '/isInDrag', "Settign property isInDrag");
            ok(oModelData.setProperty.args[0][1] === false, "property isInDrag set to false");
          //  oController._publishAsync = function () {};
            start();
        }, 200);
        jQueryRequireStub.restore();
        oUIActionsStub.restore();
    });

    // TODO: Add enableGroupsUIActions and disableGroupsUIActions tests
   /* test("Test enableGroupsUIActions", function () {
        var originalgetGroupsUIActions = sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions.prototype._getGroupUIActions;
        sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions.prototype._getGroupUIActions = sinon.stub().returns();
        sap.ui.getCore().getEventBus().publish('launchpad', 'actionModeActive');
        ok(sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions.prototype._getGroupUIActions.enable.calledOnce,"dashboardContent.Controller.uiEditModeActions.enable is called once");
        sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions.prototype._getGroupUIActions = originalgetGroupsUIActions;
    });*/

    asyncTest("test handleActionModeStartDrag in case system.phone = false", function () {
        var oUIActionsStub,
            jQueryRequireStub,
            fSortableStartListener,
            originalUIActions,
            divElement1,
            divElement2,
            divElement3,
            divElement4,
            bPhone;

        originalUIActions = sap.ushell.UIActions;
        sap.ushell.UIActions = oUIActionsForTest;
        fSortableStartListener = sinon.spy();
        jQueryRequireStub = sinon.stub(jQuery.sap, "require").returns({});
        sap.ui.getCore().getEventBus().subscribe("launchpad", "sortableStart", fSortableStartListener);
        bPhone = sap.ui.Device.system.phone;

        // Make sure that the Model's setProperty function gets a new sinon.spy since it "remembers" the previous calls
        oController.getView().getModel().setProperty = sinon.spy();

        divElement1 = document.createElement("div");
        divElement2 = document.createElement("div");
        divElement3 = document.createElement("div");
        divElement4 = document.createElement("div");
        divElement1.className += "sapUshellDashboardGroupsContainerItem-clone";
        divElement2.className += "sapUshellTileContainerEditMode";
        divElement3.className += "sapUshellTileContainerBeforeContent";
        divElement4.className += "sapUshellDashboardGroupsContainerItem-placeholder ";
        divElement4.className += "sapUshellDashboardGroupsContainerItem-clone ";
        divElement4.className += "sapUshellDashboardView section";

        divElement1.id += "dashboardGroups";

        jQuery('body').append(divElement1);
        jQuery('body').append(divElement3);
        jQuery('body').append(divElement4);
        jQuery('.sapUshellDashboardGroupsContainerItem-clone').append(divElement2);

        oDashboardGroupsUIActionsModule.initializeUIActions(oController);
        oDashboardGroupsUIActionsModule._handleGroupStartDrag();

        setTimeout(function () {

            ok(jQuery(".sapUshellTileContainerBeforeContent").hasClass("sapUshellTileContainerHidden"), "class sapUshellTileContainerHidden was added to element with class sapUshellTileContainerBeforeContent");
            ok(oController.getView().getModel().setProperty.calledOnce === true, "Model setProperty.calledOnce");
            ok(oController.getView().getModel().setProperty.args[0][0] === '/isInDrag', "Settign property isInDrag");
            ok(oController.getView().getModel().setProperty.args[0][1] === true, "property isInDrag set to true");
            ok(fSortableStartListener.calledOnce, "sortableStart event is published");

            sap.ui.Device.system.phone = bPhone;
            jQuery("sapUshellDashboardGroupsContainerItem-clone").remove();
            jQuery(".sapUshellTileContainerEditMode").remove();
            jQuery(".sapUshellTileContainerBeforeContent").remove();
            jQuery(".sapUshellDashboardGroupsContainerItem-placeholder ").remove();
            start();
        }, 10);
        jQueryRequireStub.restore();
        sap.ushell.UIActions = originalUIActions;
    });

    asyncTest("test handleActionModeStartDrag in case system.phone = true", function () {
        var oUIActionsStub,
            jQueryRequireStub,
            fSortableStartListener,
            originalUIActions = sap.ushell.UIActions,
            divElement1,
            divElement2,
            divElement3,
            divElement4,
            divElement5,
            bPhone;

        sap.ushell.UIActions = oUIActionsForTest;
        fSortableStartListener = sinon.spy();
        jQueryRequireStub = sinon.stub(jQuery.sap, "require").returns({});
        sap.ui.getCore().getEventBus().subscribe("launchpad", "sortableStart", fSortableStartListener);

        bPhone = sap.ui.Device.system.phone;
        sap.ui.Device.system.phone = true;
        divElement1 = document.createElement("div");
        divElement2 = document.createElement("div");
        divElement3 = document.createElement("div");
        divElement4 = document.createElement("div");
        divElement5 = document.createElement("div");

        divElement1.className += "sapUshellTilesContainer-sortable ";
        divElement2.className += "sapUshellLinksContainer ";
        divElement3.className += "sapUshellTileContainerBeforeContent ";
        divElement4.className += "sapUshellContainerHeaderActions ";
        divElement5.className += "sapUshellTileContainerAfterContent ";
        divElement5.className += "sapUshellDashboardGroupsContainerItem-placeholder ";
        divElement5.className += "sapUshellDashboardGroupsContainerItem-clone ";
        divElement5.className += "sapUshellDashboardView section";
        divElement5.id += "dashboardGroups";

        jQuery('body').append(divElement1);
        jQuery('body').append(divElement2);
        jQuery('body').append(divElement3);
        jQuery('body').append(divElement4);
        jQuery('body').append(divElement5);

        oDashboardGroupsUIActionsModule.initializeUIActions(oController);
        oDashboardGroupsUIActionsModule._handleGroupStartDrag();

        setTimeout(function () {
            //check that correct classes were added
            ok(jQuery(".sapUshellTilesContainer-sortable").hasClass("sapUshellTileContainerRemoveContent"), "class sapUshellTilesContainer-sortable was added to element with class sapUshellTilesContainer-sortable");
            ok(jQuery(".sapUshellLinksContainer").hasClass("sapUshellTileContainerRemoveContent"), "class sapUshellLinksContainer was added to element with class sapUshellLinksContainer");
            ok(jQuery(".sapUshellTileContainerBeforeContent").hasClass("sapUshellTileContainerRemoveContent"), "class sapUshellTileContainerBeforeContent was added to element with class sapUshellTileContainerBeforeContent");
            ok(jQuery(".sapUshellContainerHeaderActions").hasClass("sapUshellTileContainerHidden"), "class sapUshellContainerHeaderActions was added to element with class sapUshellContainerHeaderActions");

            ok(oController.getView().getModel().setProperty.args[0][0] === '/isInDrag', "Settign property isInDrag");
            ok(oController.getView().getModel().setProperty.args[0][1] === true, "property isInDrag set to true");
            ok(fSortableStartListener.calledOnce, "sortableStart event is published");

            sap.ui.Device.system.phone = bPhone;

            jQuery(".sapUshellTilesContainer-sortable ").remove();
            jQuery(".sapUshellLinksContainer").remove();
            jQuery(".sapUshellTileContainerBeforeContent").remove();
            jQuery(".sapUshellContainerHeaderActions").remove();
            jQuery("#dashboardGroups").remove();
            start();
        }, 10);
        jQueryRequireStub.restore();
        sap.ushell.UIActions = originalUIActions;
    });
    
}());
