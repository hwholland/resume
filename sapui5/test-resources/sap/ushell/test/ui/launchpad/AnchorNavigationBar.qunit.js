// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.AnchorNavigationBar
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.AnchorItem");
    jQuery.sap.require("sap.ushell.override");
    jQuery.sap.require("sap.ushell.resources");
    //jQuery.sap.require("sap.ushell.ui.launchpad.AnchorNavigationBar");

    var anchorItemTemplate = new sap.ushell.ui.launchpad.AnchorItem({
            index: "{index}",
            title: "{title}",
            groupId: "{groupId}",
            selected: false,
            visible: true
        }),
        anchorNavigationBar,
        testContainer,
        mockData,
        demiData;

    module("sap.ushell.ui.launchpad.AnchorNavigationBar", {
        setup: function () {
            mockData = {
                groups: [
                    {
                        id: "group_0",
                        groupId: "group_0",
                        title: "group_0",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_00",
                                content: []
                            },
                            {
                                id: "tile_01",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_1",
                        groupId: "group_1",
                        title: "group_1",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_2",
                        groupId: "group_2",
                        title: "group_2",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_3",
                        groupId: "group_3",
                        title: "group_3",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_4",
                        groupId: "group_4",
                        title: "group_4",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_5",
                        groupId: "group_5",
                        title: "group_5",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_6",
                        groupId: "group_6",
                        title: "group_6",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    }
                ]
            };
            demiData = {
                itemPress: [ function (oEvent) {
                }],
                groups: {
                    path: "/groups",
                    template: anchorItemTemplate
                }};
            anchorNavigationBar = new sap.ushell.ui.launchpad.AnchorNavigationBar(demiData);
            anchorNavigationBar.setModel(new sap.ui.model.json.JSONModel(mockData));
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            anchorNavigationBar.placeAt(testContainer);

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            anchorNavigationBar.destroy();
            jQuery(testContainer).remove();
        }
    });

    asyncTest("Constructor Test", function () {
        setTimeout(function () {
            start();

            ok(anchorNavigationBar !== null, "anchor navigation bar was created successfully");
            equal(anchorNavigationBar.getGroups().length, 7, "7 groups expected");

            var bSapUshellAnchorNavigationBarClassAdded = testContainer.find('.sapUshellAnchorNavigationBar').length > 0;
            ok(bSapUshellAnchorNavigationBarClassAdded, 'anchor navigation bar was added to the DOM');
        }, 0);
    });

    test("Test setSelectedItemIndex", function () {
        anchorNavigationBar.setSelectedItemIndex(undefined);
        ok(anchorNavigationBar.getSelectedItemIndex() === 0, "selected group should remain 0");
        anchorNavigationBar.setSelectedItemIndex(1);
        ok(anchorNavigationBar.getSelectedItemIndex() === 1, "selected group should be 1");
    });

    asyncTest("Test reArrangeNavigationBarElements", function () {
        setTimeout(function () {
            var stubAdjustItemSelection = sinon.stub(anchorNavigationBar, "adjustItemSelection");

            start();
            anchorNavigationBar.setSelectedItemIndex(1);
            anchorNavigationBar.reArrangeNavigationBarElements();

            ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selected item was changed");
            ok(stubAdjustItemSelection.args[0][0] === 1, "selected item is item #1");

            stubAdjustItemSelection.restore();
        }, 0);
    });

    asyncTest("Test reArrangeNavigationBarElements in mobile", function () {
        setTimeout(function () {
            var stubAdjustItemSelection = sinon.stub(anchorNavigationBar, "adjustItemSelection");
            var bPhone = sap.ui.Device.system.phone;
            sap.ui.Device.system.phone = true;

            start();
            anchorNavigationBar.setSelectedItemIndex(1);
            anchorNavigationBar.reArrangeNavigationBarElements();

            ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selectd item was changed");
            ok(stubAdjustItemSelection.args[0][0] === 1, "selected item is item #1");
            ok(anchorNavigationBar.anchorItems[0].getIsGroupVisible() === false, "first group should be hidden");
            ok(anchorNavigationBar.anchorItems[1].getIsGroupVisible() === true, "second group should be visible");

            stubAdjustItemSelection.restore();
            sap.ui.Device.system.phone = bPhone;
        }, 0);
    });

    asyncTest("Test setNavigationBarItemsVisibility", function () {
        setTimeout(function () {
            start();
            var stubIsLastAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostRightAnchorItemVisible").returns(true),
                stubIsFirstAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true),
                oOverflowButton = anchorNavigationBar.oOverflowButton,
                bPhone = sap.ui.Device.system.phone;

            anchorNavigationBar.setNavigationBarItemsVisibility();
            ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") > -1, "overflow button should be hidden");

            sap.ui.Device.system.phone = true;
            anchorNavigationBar.setNavigationBarItemsVisibility();
            ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");

            sap.ui.Device.system.phone = false;
            stubIsLastAnchorItemVisible.returns(false);
            anchorNavigationBar.setNavigationBarItemsVisibility();
            ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");
            ok(jQuery(".sapUshellAnchorNavigationBarItems").hasClass("sapUshellOverflowRight"),
                "transparent indication that there are more items on the right");

            stubIsLastAnchorItemVisible.returns(true);
            stubIsFirstAnchorItemVisible.returns(false);
            anchorNavigationBar.setNavigationBarItemsVisibility();
            ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");
            ok(jQuery(".sapUshellAnchorNavigationBarItems").hasClass("sapUshellOverflowLeft"),
                "transparent indication that there are more items on the left");

            stubIsLastAnchorItemVisible.restore();
            stubIsFirstAnchorItemVisible.restore();
            sap.ui.Device.system.phone = bPhone;
        }, 0);
    });

    asyncTest("Test setNavigationBarItemsVisibility - phone - no groups in dashboard", function () {
        setTimeout(function () {
            start();
            var stubIsLastAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostRightAnchorItemVisible").returns(true),
                stubIsFirstAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true),
                oOverflowButton = anchorNavigationBar.oOverflowButton,
                bPhone = sap.ui.Device.system.phone,
                anchorItems = anchorNavigationBar.anchorItems;

            sap.ui.Device.system.phone = true;
            anchorNavigationBar.anchorItems = [];
            anchorNavigationBar.setNavigationBarItemsVisibility();
            ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") > -1, "overflow button should be hidden");

            stubIsLastAnchorItemVisible.restore();
            stubIsFirstAnchorItemVisible.restore();
            anchorNavigationBar.anchorItems = anchorItems;
            sap.ui.Device.system.phone = bPhone;
        }, 0);
    });

    asyncTest("Test selected anchor navigation item", function () {
        setTimeout(function () {
            anchorNavigationBar.adjustItemSelection(1);
            setTimeout(function () {
                start();

                ok(anchorNavigationBar.anchorItems[0].getSelected() === false, "first item is selected");
                ok(anchorNavigationBar.anchorItems[1].getSelected() === true, "first item is selected");
            }, 250);
        }, 0);
    });

    asyncTest("Test get visible groups", function () {
        setTimeout(function () {
            start();

            var aGroups = anchorNavigationBar.getVisibleGroups();
            ok(aGroups.length === 7, "there are two visible groups");

            var group = aGroups[1];
            group.setVisible(false);
            aGroups = anchorNavigationBar.getVisibleGroups();
            ok(aGroups.length === 6, "there is only one visible group");
        }, 0);
    });

    asyncTest("Test isMostRightAnchorItemVisible", function () {
        setTimeout(function () {
            start();
            jQuery("#testContainer").css("display", "block");
            jQuery("#testContainer").width(500);
            var bIsLastGroupVisible = anchorNavigationBar.isMostRightAnchorItemVisible();
            ok(!bIsLastGroupVisible, "last group is not visible");

            var groups = anchorNavigationBar.getGroups();
            // leave only two groups
            groups = groups.splice(5);
            anchorNavigationBar.getModel().setProperty("/groups", groups);
            var bIsLastGroupVisible = anchorNavigationBar.isMostRightAnchorItemVisible();
            ok(bIsLastGroupVisible, "last group is visible");

            jQuery("#testContainer").css("display", "none");
        }, 0);
    });

    asyncTest("Test isMostLeftAnchorItemVisible", function () {
        setTimeout(function () {
            start();
            jQuery("#testContainer").css("display", "block");

            var bIsFirstGroupVisible = anchorNavigationBar.isMostLeftAnchorItemVisible();
            ok(bIsFirstGroupVisible, "first group is visible");
        }, 0);
    });

    asyncTest("Test get overflow right and left arrows", function () {
        setTimeout(function () {
            start();
            var oLeftButton = anchorNavigationBar._getOverflowLeftArrowButton(),
                oRightButton = anchorNavigationBar._getOverflowRightArrowButton();

            ok(oLeftButton.getMetadata().getName() === "sap.m.Button", "left button type is correct");
            ok(oLeftButton.getIcon() === "sap-icon://slim-arrow-left", "left button src is correct");

            ok(oRightButton.getMetadata().getName() === "sap.m.Button", "right button type is correct");
            ok(oRightButton.getIcon() === "sap-icon://slim-arrow-right", "right button src is correct");
        }, 0);
    });

    asyncTest("Test get overflow button", function () {
        setTimeout(function () {
            start();
            var oOverflowButton = anchorNavigationBar._getOverflowButton();

            ok(oOverflowButton.getMetadata().getName() === "sap.m.Button", "overfolw button type is correct");
            ok(oOverflowButton.getIcon() === "sap-icon://slim-arrow-down", "overfolw button src is correct");
        }, 0);
    });
}());
