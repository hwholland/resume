// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap */
    /*jslint nomen: true */

    sap.ui.jsview("sap.ushell.components.flp.launchpad.appfinder.GroupListPopover", {
        bPopoverCreated: false,
        oPopover: undefined,
        oGroupList: undefined,

        /*
            view receives viewData with following structure
            {
                groupData: [
                    {
                        initiallySelected: true,
                        selected: true,
                        oGroup: group1Object
                    },
                    {
                        initiallySelected: false,
                        selected: false,
                        oGroup: group2Object
                    }
                ]
                enableHideGroups: true,
                enableHelp: true,
                singleGroupSelection: false
         }
         */

        createContent: function (oController) {
            this.iPopoverDataSectionHeight = 192;
            this.oGroupsContainer = this._createPopoverContainer(this.iPopoverDataSectionHeight);

            if (!this.bPopoverCreated) {
                this.oPopover = new sap.m.ResponsivePopover({
                    id : "groupsPopover",
                    placement : sap.m.PlacementType.Auto,
                    enableScrolling : true,
                    title: sap.ushell.resources.i18n.getText("addTileToGroups_popoverTitle"),
                    contentWidth: '20rem',
                    beginButton: this._createOkButton(),
                    endButton: this._createCancelButton(),
                    content: this.oGroupsContainer,
                    afterClose: this.getController()._afterCloseHandler.bind(this.getController())
                });
                this.bPopoverCreated = true;
                this.oPopover.setInitialFocus('newGroupItem');
            }
        },

        /**
         * Called each time the popover is opened.
         * Sets the popover's model with the data of the groups according to the relevant (clicked) catalog tile
         */
        setGroupsData: function (oGroupData) {
            this.getController().oPopoverModel.setData({userGroupList: oGroupData});
        },

        /**
         * Sets the selection mode of the list (i.e. Single or Multi selection)
         */
        setGroupListSingleSelection: function (oGroupListSelectionMode) {
            this.oGroupList.setMode(oGroupListSelectionMode);
            if (oGroupListSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.oGroupList.attachSelect(this.getController().okButtonHandler.bind(this.getController()));
            } else {
                // @TODO The detachSelect does not work. Instead, the handling is done temporarily in okButtonHandler
                this.oGroupList.detachSelect(this.getController().okButtonHandler, this.getController());
            }
        },

        open: function (openByControl) {
            if (document.body.clientHeight - openByControl.getDomRef().getBoundingClientRect().bottom >= 310) {
                this.oPopover.setPlacement(sap.m.PlacementType.Bottom);
            } else {
                this.oPopover.setPlacement(sap.m.PlacementType.Auto);
            }
            this.oPopover.openBy(openByControl);

            // Cleaning the popover's newGroupInput property, in case that a new group was created  in the previous time the popover was used
            if (this.newGroupInput !== undefined) {
                this.newGroupInput.setValue('');
            }

            if (this.oGroupList.getMode() === sap.m.ListMode.SingleSelectMaster) {
                this.getController()._setFooterVisibility(false);
            } else {
                this.getController()._setFooterVisibility(true);
            }
            this.deferred = jQuery.Deferred();
            return this.deferred.promise();
        },

        _createPopoverContainer: function (iPopoverDataSectionHeight) {
            var oPopoverContainer,
                oTempGroupList,
                oNewGroupItemList = this._createNewGroupUiElements();

            oTempGroupList = this._createPopoverGroupList();

            oPopoverContainer = new sap.m.ScrollContainer({
               // id: "popoverContainer",
                horizontal : false,
                vertical : true,
                content: [oNewGroupItemList, oTempGroupList]
            });

            if (!sap.ui.Device.system.phone) {
                oPopoverContainer.setHeight((iPopoverDataSectionHeight - 2) + "px");
            } else {
                oPopoverContainer.setHeight("100%");
            }

            return oPopoverContainer;
        },

        _createNewGroupUiElements: function () {
            var oNewGroupItem = new sap.m.StandardListItem({
                    id : "newGroupItem",
                    title : sap.ushell.resources.i18n.getText("newGroup_listItemText"),
                    type : "Navigation",
                    press : this.getController()._navigateToCreateNewGroupPane.bind(this.getController())
                }),
                oNewGroupItemList = new sap.m.List({});

            // if xRay is enabled
            if (this.getViewData().enableHelp) {
                oNewGroupItem.addStyleClass('help-id-newGroupItem');// xRay help ID
            }
            oNewGroupItemList.addItem(oNewGroupItem);
            return oNewGroupItemList;
        },

        _createNewGroupInput: function () {
            var oNewGroupNameInput = new sap.m.Input({
                id : "newGroupNameInput",
                type : "Text",
                placeholder : sap.ushell.resources.i18n.getText("new_group_name")
            });
            oNewGroupNameInput.setValueState(sap.ui.core.ValueState.None);
            oNewGroupNameInput.setPlaceholder(sap.ushell.resources.i18n.getText("new_group_name"));
            oNewGroupNameInput.enabled = true;
            oNewGroupNameInput.addStyleClass("sapUshellCatalogNewGroupInput");
            return oNewGroupNameInput;
        },

        _createHeadBarForNewGroup: function () {
            var oBackButton = new sap.m.Button({
                    icon: sap.ui.core.IconPool.getIconURI("nav-back"),
                    press : this.getController()._backButtonHandler.bind(this.getController()),
                    tooltip : sap.ushell.resources.i18n.getText("newGroupGoBackBtn_tooltip")
                }),
                oHeadBar;

            oBackButton.addStyleClass("sapUshellCatalogNewGroupBackButton");

            // new group panel's header
            oHeadBar = new sap.m.Bar({
                contentLeft : [oBackButton],
                contentMiddle : [
                    new sap.m.Label({
                        text : sap.ushell.resources.i18n.getText("newGroup_popoverTitle")
                    })
                ]
            });
            return oHeadBar;
        },

        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.appfinder.GroupListPopover";
        },

        _createPopoverGroupList: function () {
            var oListItemTemplate = new sap.m.DisplayListItem({
                    label : "{oGroup/title}",
                    selected : "{selected}",
                    tooltip: "{oGroup/title}",
                    type: sap.m.ListType.Active
                }),
                that = this,
                aUserGroupsFilters = [];

            aUserGroupsFilters.push(new sap.ui.model.Filter("oGroup/isGroupLocked", sap.ui.model.FilterOperator.EQ, false));
            if (this.getViewData().enableHideGroups) {
                aUserGroupsFilters.push(new sap.ui.model.Filter("oGroup/isGroupVisible", sap.ui.model.FilterOperator.EQ, true));
            }
            //var bSingleSelection = this.getViewData().singleGroupSelection;
            this.oGroupList = new sap.m.List("groupListId", {
                //mode : bSingleSelection ? sap.m.ListMode.SingleSelectMaster : sap.m.ListMode.MultiSelect,
                includeItemInSelection: true,
                items: {
                    path: "/userGroupList",
                    template: oListItemTemplate,
                    filters: aUserGroupsFilters
                }
            });

            this.oGroupList.addEventDelegate({
                //used for accessibility, so "new group" element will be a part of it
                onsapup: function (oEvent) {
                    try {
                        oEvent.preventDefault();
                        if (that.getView().getModel().getProperty("/groups/length")) {
                            var jqNewGroupItem,
                                currentFocusGroup = jQuery(":focus");

                            if (currentFocusGroup.index() === 0) {   //first group in the list
                                jqNewGroupItem = jQuery("#newGroupItem");
                                jqNewGroupItem.focus();
                                oEvent._bIsStopHandlers = true;
                            }
                        }
                    } catch (e) {
                        // continue regardless of error
                        jQuery.sap.log.error("Groups popup Accessibility `up` key failed");
                    }
                }
            });
            return this.oGroupList;
        },

        _createOkButton: function () {
            var oOkBtn = new sap.m.Button({
                id : "okButton",
                press : this.getController().okButtonHandler.bind(this.getController()),
                text : sap.ushell.resources.i18n.getText("okBtn")
            });

            oOkBtn.addEventDelegate({
                onsaptabprevious: function (oEvent) {
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqNewGroupItem = jQuery("#newGroupItem");
                        if (!jqNewGroupItem.length) {
                            jqNewGroupItem = jQuery("#newGroupNameInput input");
                        }
                        jqNewGroupItem.focus();
                    } catch (e) {
                        // continue regardless of error
                        jQuery.sap.log.error("Groups popup Accessibility `shift-tab` key failed");
                    }
                }
            });

            return oOkBtn;
        },

        _createCancelButton: function () {
            return new sap.m.Button({
                id : "cancelButton",
                press : this.getController()._cancelButtonHandler.bind(this.getController()),
                text : sap.ushell.resources.i18n.getText("cancelBtn")
            });
        }
    });
}());
