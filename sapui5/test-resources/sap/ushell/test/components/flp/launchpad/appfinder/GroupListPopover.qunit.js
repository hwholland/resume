// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.appfinder.GroupListPopover
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var oController;

    module("sap.ushell.components.flp.launchpad.appfinder.GroupListPopover", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.GroupListPopover");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    var testData = [
        {selected: true, initiallySelected: false},
        {selected: false, initiallySelected: true}
    ];

    var noop = function () {};

    test("okButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});

        var oIsListMultiSelectStub = sinon.stub(oController, "_isListModeMultiSelect").returns(false),
            returnData,
            oPopover = {
                close: noop
            },
            popupClose = sinon.spy(oPopover, "close"),
            oView = {
                oPopover: oPopover,
                deferred: {
                    resolve: function (d) {
                        returnData = d;
                    }
                }
            };

        oController.getView = function () {
            return oView;
        };
        oController.okButtonHandler(jQuery.Event("click"));

        assert.ok(returnData.addToGroups.length === 1);
        assert.ok(returnData.removeFromGroups.length === 1);
        assert.ok(returnData.newGroups.length === 0);
        assert.equal(popupClose.callCount, 1);

        oView.newGroupInput = {
            getValue: function () {
                return "group name";
            }
        };

        oController.okButtonHandler(jQuery.Event("click"));
        assert.ok(returnData.addToGroups.length === 1);
        assert.ok(returnData.removeFromGroups.length === 1);
        assert.ok(returnData.newGroups.length === 1);
        oIsListMultiSelectStub.restore();
    });

    test("_cancelButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var oPopover = {
            close: noop
        };
        var popupClose = sinon.spy(oPopover, "close");
        var oDeferred = {
            reject: noop
        };
        var deferredReject = sinon.spy(oDeferred, "reject");
        var oView = {
            oPopover: oPopover,
            deferred: oDeferred
        };
        oController.getView = function () {
            return oView;
        };

        oController._cancelButtonHandler(jQuery.Event("click"));
        assert.equal(popupClose.callCount, 1);
        assert.equal(deferredReject.callCount, 1);
    });

    test("_navigateToCreateNewGroupPane Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});
        var oIsListSingleSelectStub = sinon.stub(oController, "_isListModeSingleSelectMaster").returns(true),
            oPopover = {
            removeAllContent: noop,
            addContent: noop,
            setCustomHeader: noop,
            setContentHeight: noop
        };
        var removeAllContent = sinon.spy(oPopover, "removeAllContent");
        var addContent = sinon.spy(oPopover, "addContent");
        var setCustomHeader = sinon.spy(oPopover, "setCustomHeader");
        var setContentHeight = sinon.spy(oPopover, "setContentHeight");
        var setFooterVisibility =  sinon.spy(oController, "_setFooterVisibility");
        var oView = {
            oPopover: oPopover,
            _createHeadBarForNewGroup: noop,
            _createNewGroupInput: noop,
            newGroupInput: {
                focus: noop
            },
            getViewData: function () {
                return {singleGroupSelection: true};
            }
        };
        oController.getView = function () {
            return oView;
        };

        oController._navigateToCreateNewGroupPane();
        assert.equal(removeAllContent.callCount, 1);
        assert.equal(addContent.callCount, 1);
        assert.equal(setCustomHeader.callCount, 1);
        assert.equal(setContentHeight.callCount, 1);
        assert.equal(setFooterVisibility.callCount, 1);
        assert.equal(setFooterVisibility.args[0][0], true);
        oIsListSingleSelectStub.restore();

    });

    test("_afterCloseHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});

        var oView = {
                oGroupsContainer: {
                    destroy: noop
                },
                newGroupInput: {
                    destroy: noop
                },
                oPopover: {
                    destroy: noop,
                    removeAllContent: sinon.spy(),
                    addContent: sinon.spy(),
                    setTitle: sinon.spy(),
                    setCustomHeader: sinon.spy()
                },
                setVisible: sinon.spy(),
                destroy: noop
            };

        oController.getView = function () {
            return oView;
        };

        oController._afterCloseHandler();
        assert.equal(oView.oPopover.removeAllContent.callCount, 1);
        assert.equal(oView.oPopover.addContent.callCount, 1);
        assert.equal(oView.oPopover.setTitle.callCount, 1);
        assert.equal(oView.oPopover.setCustomHeader.callCount, 1);
        assert.equal(oView.setVisible.callCount, 1);
    });

    test("_backButtonHandler Test", function () {
        oController.oPopoverModel = new sap.ui.model.json.JSONModel({userGroupList: testData});

        var oIsListSingleSelectStub = sinon.stub(oController, "_isListModeSingleSelectMaster").returns(true),
            oPopover = {
            removeAllContent: noop,
            setContentHeight: noop,
            setVerticalScrolling: noop,
            setHorizontalScrolling: noop,
            addContent: noop,
            setTitle: noop,
            setCustomHeader: noop
        };
        var removeAllContent = sinon.spy(oPopover, "removeAllContent");
        var setVerticalScrolling = sinon.spy(oPopover, "setVerticalScrolling");
        var setHorizontalScrolling = sinon.spy(oPopover, "setHorizontalScrolling");
        var addContent = sinon.spy(oPopover, "addContent");
        var setTitle = sinon.spy(oPopover, "setTitle");
        var setCustomHeader = sinon.spy(oPopover, "setCustomHeader");
        var setFooterVisibility =  sinon.spy(oController, "_setFooterVisibility");

        var oView = {
            oPopover: oPopover,
            newGroupInput: {
                setValue: noop
            },
            getViewData: function(){
                return {singleGroupSelection: true};
            }
        };

        var setValue = sinon.spy(oView.newGroupInput, "setValue");
        oController.getView = function () {
            return oView;
        };

        oController._backButtonHandler();
        assert.equal(removeAllContent.callCount, 1);
        assert.equal(setVerticalScrolling.callCount, 1);
        assert.equal(setHorizontalScrolling.callCount, 1);
        assert.equal(addContent.callCount, 1);
        assert.equal(setTitle.callCount, 1);
        assert.equal(setCustomHeader.callCount, 1);
        assert.equal(setValue.callCount, 1);
        assert.equal(setFooterVisibility.callCount, 1);
        assert.equal(setFooterVisibility.args[0][0], false);
        oIsListSingleSelectStub.restore();
    });
}());