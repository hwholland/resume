// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, window */
    /*jslint nomen: true */

    sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.GroupListPopover", {

        onInit: function () {
            var oView = this.getView();

            this.oPopoverModel = new sap.ui.model.json.JSONModel();
            oView.oPopover.setModel(this.oPopoverModel);
        },

        okButtonHandler: function (oEvent) {
            var oView = this.getView(),
                userGroupList = this.oPopoverModel.getProperty("/userGroupList"),
                returnChanges;

            // @TODO this handling is done here (temporarily) instead of the detachSelect (that does not work) in setGroupListSingleSelection
            // When the popover is opened in the catalog - when a group is selected the popover should not be closed, hence the call to return
            if ((this._isListModeMultiSelect()) && (oEvent.sId === "select")) {
                return;
            }

            oEvent.preventDefault();
            oEvent._bIsStopHandlers = true;

            userGroupList = this.oPopoverModel.getProperty("/userGroupList");
            returnChanges = {
                addToGroups: [],
                removeFromGroups: [],
                newGroups: [],
                allGroups: userGroupList
            };

            userGroupList.forEach(function (group) {
                if (group.selected === group.initiallySelected) {
                    return;
                }
                if (group.selected) {
                    returnChanges.addToGroups.push(group.oGroup);
                } else {
                    returnChanges.removeFromGroups.push(group.oGroup);
                }
            });
            if (oView.newGroupInput && oView.newGroupInput.getValue().length) {
                returnChanges.newGroups.push(oView.newGroupInput.getValue());
            }
            oView.oPopover.close();
            oView.deferred.resolve(returnChanges);
        },

        _isListModeMultiSelect: function () {
            var oView = this.getView();
            return (oView.oGroupList.getMode() === sap.m.ListMode.MultiSelect);
        },

        _isListModeSingleSelectMaster: function () {
            var oView = this.getView();
            return (oView.oGroupList.getMode() === sap.m.ListMode.SingleSelectMaster);
        },

        _cancelButtonHandler: function (oEvent) {
            oEvent.preventDefault();
            oEvent._bIsStopHandlers = true;
            var oView = this.getView();
            oView.oPopover.close();
            oView.deferred.reject();
        },

        _navigateToCreateNewGroupPane: function () {
            var oView = this.getView();
            if (!oView.headBarForNewGroup) {
                oView.headBarForNewGroup = oView._createHeadBarForNewGroup();
            }
            if (!oView.newGroupInput) {
                oView.newGroupInput = oView._createNewGroupInput();
            }
            oView.oPopover.removeAllContent();
            oView.oPopover.addContent(oView.newGroupInput);
            oView.oPopover.setCustomHeader(oView.headBarForNewGroup);
            oView.oPopover.setContentHeight("");
            if (this._isListModeSingleSelectMaster()) {
                this._setFooterVisibility(true);
            }
            setTimeout(function () {
                oView.newGroupInput.focus();
            }, 0);
        },

        _afterCloseHandler: function () {
            var oView = this.getView();

            // If the popover was closed when it presented the "New Group" UI -
            // it should get beck the group list content in order to show it the next time it is opened
            oView.oPopover.removeAllContent();
            oView.oPopover.addContent(oView.oGroupsContainer);
            oView.oPopover.setTitle(sap.ushell.resources.i18n.getText("addTileToGroups_popoverTitle"));
            oView.oPopover.setCustomHeader();
            // It the popover is closed by clicking some area in the catalog -
            //  the value of the visibility property remains "true", which is inconsistent with the actual visibility
            oView.setVisible(false);
        },

        _backButtonHandler: function () {
            var oView = this.getView();
            oView.oPopover.removeAllContent();
            if (this._isListModeSingleSelectMaster()) {
                this._setFooterVisibility(false);
            }

            if (!sap.ui.Device.system.phone) {
                oView.oPopover.setContentHeight(oView.iPopoverDataSectionHeight + "px");
            } else {
                oView.oPopover.setContentHeight("100%");
            }

            oView.oPopover.setVerticalScrolling(true);
            oView.oPopover.setHorizontalScrolling(false);
            oView.oPopover.addContent(oView.oGroupsContainer);
            oView.oPopover.setTitle(sap.ushell.resources.i18n.getText("addTileToGroups_popoverTitle"));
            oView.oPopover.setCustomHeader();
            oView.newGroupInput.setValue('');
        },

        _setFooterVisibility: function (bVisible) {
            //as there is not public API to control the footer we get the control by its id
            //and set its visibility
            var oFooter = sap.ui.getCore().byId("groupsPopover-footer");
            if (oFooter) {
                oFooter.setVisible(bVisible);
            }
        }
    });
}());
