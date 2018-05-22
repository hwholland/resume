// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview A module that is responsible for creating the groups part (i.e. box) of the dashboard.<br>
 * Extends <code>sap.ui.base.Object</code><br>
 * Exposes the public function <code>createGroupsBox</code>
 * @see sap.ushell.components.flp.launchpad.dashboard.DashboardContent.view
 *
 * @version 1.38.26
 * @name sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox
 * @since 1.35.0
 * @private
 */
(function () {
    "use strict";

    /*global jQuery, sap, window */
    /*jslint nomen: true */
    jQuery.sap.declare("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox");

    sap.ui.base.Object.extend("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox", {
        metadata: {
            publicMethods: ["createGroupsBox"]
        },
        constructor: function (sId, mSettings) {
            // Make this class only available once
            if (sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox && sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox()) {
                return sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox();
            }
            sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox = jQuery.sap.getter(this.getInterface());

            this.oController = undefined;
            this.oGroupsContainer = undefined;
            this.bTileContainersContentAdded = false;

            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeActive", this._addTileContainersContent, this);
        },
        destroy: function () {
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeActive", this._addTileContainersContent, this);
            sap.ushell.components.flp.launchpad.dashboard.getDashboardGroupsBox = undefined;
        },
        /**
         * Creating the groups part (i.e. box) of the dashboard
         */
        createGroupsBox : function (oController, oModel) {
            this.oController = oController;
            var that = this,
                fAfterLayoutInit,
                fGroupsContainerAfterRenderingHandler,
                oLoadingDialog,
                oTilesContainerTemplate = this._getTileContainerTemplate(oController, oModel),
                fnEnableLockedGroupCompactLayout = function () {
                    return that.oModel.getProperty('/enableLockedGroupsCompactLayout') && !that.oModel.getProperty('/tileActionModeActive');
                },
                getPlusTileFromGroup = function (oGroup) {
                    var groupDomRef,
                        plusTileDomRef;
                    if (oGroup && (groupDomRef = oGroup.getDomRef())) {
                        plusTileDomRef = groupDomRef.querySelector('.sapUshellPlusTile');
                        if (plusTileDomRef) {
                            return plusTileDomRef;
                        }
                    }
                    return null;
                },
                reorderTilesCallback = function (layoutInfo) {
                    var plusTileStartGroup = getPlusTileFromGroup(layoutInfo.currentGroup),
                        plusTileEndGroup = getPlusTileFromGroup(layoutInfo.endGroup),
                        isPlusTileVanishRequired = (layoutInfo.tiles[layoutInfo.tiles.length - 2] === layoutInfo.item) || (layoutInfo.endGroup.getTiles().length === 0);
                    if (isPlusTileVanishRequired) {
                        that._hidePlusTile(plusTileEndGroup);
                    } else {
                        that._showPlusTile(plusTileEndGroup);
                    }

                    if (layoutInfo.currentGroup !== layoutInfo.endGroup) {
                        that._showPlusTile(plusTileStartGroup);
                    }
                };

            //Since the layout initialization is async, we need to execute the below function after initialization is done
            fAfterLayoutInit = function () {
                //Prevent Plus Tile influence on the tiles reordering by exclude it from the layout matrix calculations
                sap.ushell.Layout.getLayoutEngine().setExcludedControl(sap.ushell.ui.launchpad.PlusTile);
                //Hide plus tile when collision with it
                sap.ushell.Layout.getLayoutEngine().setReorderTilesCallback.call(sap.ushell.Layout.layoutEngine, reorderTilesCallback);
            };

            fGroupsContainerAfterRenderingHandler = function () {
                //first time scroll to first group, don't want to see title
                var jqFirstVisibleGroup = document.querySelectorAll(".sapUshellTileContainer:not(.sapUshellHidden) .sapUshellInner")[0];
                if (!!jqFirstVisibleGroup) {
                    var scrollToFirstGroup = -1 * (document.getElementById('dashboardGroups').getBoundingClientRect().top) + jqFirstVisibleGroup.getBoundingClientRect().top;
                    jQuery('.sapUshellDashboardView section').scrollTop(scrollToFirstGroup - 7);
                }

                if (!sap.ushell.Layout.isInited) {
                    sap.ushell.Layout.init({
                        getGroups: this.getGroups.bind(this),
                        isLockedGroupsCompactLayoutEnabled: fnEnableLockedGroupCompactLayout
                    }).done(fAfterLayoutInit);

                    //when media is changed we need to rerender Layout
                    //media could be changed by SAPUI5 without resize, or any other events. look for internal Incident ID: 1580000668
                    sap.ui.Device.media.attachHandler(function () {
                        if (!this.bIsDestroyed) {
                            sap.ushell.Layout.reRenderGroupsLayout(null);
                        }
                    }, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);

                    var oDomRef = this.getDomRef();
                    oController.getView().sDashboardGroupsWrapperId = !jQuery.isEmptyObject(oDomRef) && oDomRef.parentNode ? oDomRef.parentNode.id : '';
                }
                sap.ushell.Layout.reRenderGroupsLayout(null);

                if (this.getGroups().length) {
                    if (oController.bModelInitialized) {
                        oController._initializeUIActions();
                    }

                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");
                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");

                    oLoadingDialog = sap.ui.getCore().byId("loadingDialog");
                    oLoadingDialog.closeLoadingScreen();
                    oController._addBottomSpace();

                    //Tile opacity is enabled by default, therefore we handle tile opacity in all cases except
                    //case where flag is explicitly set to false
                    if (this.getModel().getProperty("/tilesOpacity")) {
                        sap.ushell.utils.handleTilesOpacity(this.getModel());
                    }
                }

                //Recheck tiles visibility on first load, and make visible tiles active
                try {
                    sap.ushell.utils.handleTilesVisibility();
                } catch (e) {
                    //nothing has to be done
                }
            };

            jQuery.sap.require("sap.ushell.ui.launchpad.DashboardGroupsContainer");
            this.oGroupsContainer = new sap.ushell.ui.launchpad.DashboardGroupsContainer("dashboardGroups", {
                accessibilityLabel : sap.ushell.resources.i18n.getText("DashboardGroups_label"),
                groups : {
                    path: "/groups",
                    template : oTilesContainerTemplate
                },
                afterRendering : fGroupsContainerAfterRenderingHandler
            });

            this.oGroupsContainer.addEventDelegate({
                onsapskipback: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);

                    var jqElement = jQuery(".sapUshellAnchorItem:visible:first");
                    if (!jqElement.length) {
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                    jqElement.focus();
                },
                onsapskipforward: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                },
                onsaptabnext: function (oEvent) {
                    if (!that.oModel.getProperty("/tileActionModeActive") || !document.activeElement.closest(".sapUshellTileContainerHeader")) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                },
                onsaptabprevious: function (oEvent) {
                    sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    var jqFocused = jQuery(":focus");
                    if (!that.oModel.getProperty("/tileActionModeActive") || jqFocused.hasClass("sapUshellTileContainerHeader")) {
                        oEvent.preventDefault();
                        var jqElement = jQuery(".sapUshellAnchorItem:visible:first"),
                            jqOverflowElement = jQuery(".sapUshellAnchorItemOverFlow");
                        if (!jqOverflowElement && !jqElement.length) {
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                        if (jqOverflowElement.hasClass("sapUshellShellHidden")) {
                            jqElement.focus();
                        } else {
                            jqOverflowElement.find("button").focus();
                        }
                    }
                }
            });
            this.oModel = oModel;
            return this.oGroupsContainer;
        },

        /**
         * Returns a template of a dashboard group.
         * Contains aggregations of links and tiles
         */
        _getTileContainerTemplate : function (oController, oModel) {
            var that = this,
                oTilesContainerTemplate = new sap.ushell.ui.launchpad.TileContainer({
                    headerText: "{title}",
                    tooltip: "{title}",
                    tileActionModeActive: '{/tileActionModeActive}',
                    ieHtml5DnD: oController.getView().ieHtml5DnD,
                    enableHelp: '{/enableHelp}',
                    groupId: "{groupId}",
                    defaultGroup: "{isDefaultGroup}",
                    isLastGroup: "{isLastGroup}",
                    isGroupLocked: "{isGroupLocked}",
                    showHeader: true,
                    editMode: "{editMode}",
                    titleChange: function (oEvent) {
                        sap.ui.getCore().getEventBus().publish("launchpad", "changeGroupTitle", {
                            groupId: oEvent.getSource().getGroupId(),
                            newTitle: oEvent.getParameter("newTitle")
                        });
                    },
                    showPlaceholder: {
                        parts: ["/tileActionModeActive", "tiles/length"],
                        formatter: function (tileActionModeActive) {
                            return (tileActionModeActive || !this.groupHasTiles()) && !this.getIsGroupLocked();
                        }
                    },
                    visible: {
                        parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                        formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                            //Empty groups should not be displayed when personalization is off or if they are locked or default group not in action mode
                            if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                                return false;
                            }
                            return isGroupVisible || tileActionModeActive;
                        }
                    },
                    links: this._getLinkTemplate(),
                    tiles: this._getTileTemplate(),
                    add: /*oController._addTileContainer,*/ function (oEvent) {
                        that.oController.getView().parentComponent.getRouter().navTo('appFinder', {
                            'menu': 'catalog',
                            filters: JSON.stringify({
                                targetGroup: encodeURIComponent(oEvent.getSource().getBindingContext().sPath)
                            })
                        });
                    },
                    afterRendering: jQuery.proxy(this._tileContainerAfterRenderingHandler, that/*, oEvent*/)
                });
            return oTilesContainerTemplate;
        },
        _getLinkTemplate : function () {
            var oFilter = new sap.ui.model.Filter("isTileIntentSupported", sap.ui.model.FilterOperator.EQ, true);
            return {
                path: "links",
                templateShareable: true,
                template: new sap.ushell.ui.launchpad.LinkTileWrapper({
                    uuid: "{uuid}",
                    tileCatalogId: "{tileCatalogId}",
                    target: "{target}",
                    isLocked: "{isLocked}",
                    tileActionModeActive: "{/tileActionModeActive}",
                    animationRendered: false,
                    debugInfo: "{debugInfo}",
                    ieHtml5DnD: this.oController.getView().ieHtml5DnD,
                    tileViews: {
                        path: "content",
                        factory: function (sId, oContext) {
                            return oContext.getObject();
                        }
                    },
                    afterRendering: function (oEvent) {
                     var jqHrefElement = jQuery(this.getDomRef().getElementsByTagName("a"));
                    // Remove tabindex from links
                    //  so that the focus will not be automatically set on the focusable link when returning to the launchpad
                    jqHrefElement.attr("tabindex", -1);
                    }
                }),
                filters: [oFilter]
            };
        },
        _getTileTemplate : function () {
            var oFilter = new sap.ui.model.Filter("isTileIntentSupported", sap.ui.model.FilterOperator.EQ, true);
            return {
                path: "tiles",
                templateShareable: true,
                template: new sap.ushell.ui.launchpad.Tile({
                    "long": "{long}",
                    uuid: "{uuid}",
                    tileCatalogId: "{tileCatalogId}",
                    target: "{target}",
                    isLocked: "{isLocked}",
                    tileActionModeActive: "{/tileActionModeActive}",
                    showActionsIcon: "{showActionsIcon}",
                    rgba: "{rgba}",
                    animationRendered: false,
                    debugInfo: "{debugInfo}",
                    ieHtml5DnD: this.oController.getView().ieHtml5DnD,
                    afterRendering: function (oEvent) {
                        var oContext = oEvent.getSource().getBindingContext(),
                            oTileModel;
                        if (oContext) {
                            oTileModel = oContext.getObject();
                            sap.ui.getCore().getEventBus().publish("launchpad", "tileRendered", {
                                tileId: oTileModel.originalTileId,
                                tileDomElementId: oEvent.getSource().getId()
                            });
                        }
                    },
                    tileViews: {
                        path: "content",
                        factory: function (sId, oContext) {
                            return oContext.getObject();
                        }
                    },
                    coverDivPress: function (oEvent) {
                        // if this tile had just been moved and the move itself did not finish refreshing the tile's view
                        // we do not open the actions menu to avoid inconsistencies
                        if (!oEvent.oSource.getBindingContext().getObject().tileIsBeingMoved) {
                            sap.ushell.components.flp.ActionMode._openActionsMenu(oEvent);
                        }
                    },
                    showActions: function (oEvent) {
                        sap.ushell.components.flp.ActionMode._openActionsMenu(oEvent);
                    },
                    deletePress: function (oEvent) {
                        var oTileControl =  oEvent.getSource(), oTile = oTileControl.getBindingContext().getObject().object,
                            oData = {originalTileId : sap.ushell.Container.getService("LaunchPage").getTileId(oTile)};

                        sap.ui.getCore().getEventBus().publish("launchpad", "deleteTile", oData, this);
                    },// TODO Call this controller function: this.oController._dashboardDeleteTileHandler,
                    press : [ this.oController.dashboardTilePress, this.oController ]
                }),
                filters: [oFilter]
            };
        },
        _tileContainerAfterRenderingHandler : function (oEvent) {
            oEvent.oSource.bindProperty("showBackground", "/tileActionModeActive");
            oEvent.oSource.bindProperty("showDragIndicator", {
                parts: ['/tileActionModeActive', '/enableDragIndicator'],
                formatter: function (bIsActionModeActive, bDragIndicator) {
                    return bIsActionModeActive && bDragIndicator && !this.getIsGroupLocked() && !this.getDefaultGroup();
                }
            });
            oEvent.oSource.bindProperty("showMobileActions", {
                parts: ['/tileActionModeActive'],
                formatter: function (bIsActionModeActive) {
                    return bIsActionModeActive && !this.getDefaultGroup();
                }
            });
            oEvent.oSource.bindProperty("showIcon", {
                parts: ['/isInDrag', '/tileActionModeActive'],
                formatter: function (bIsInDrag, bIsActionModeActive) {
                    return (this.getIsGroupLocked() && (bIsInDrag || bIsActionModeActive));
                }
            });
            oEvent.oSource.bindProperty("deluminate", {
                parts: ['/isInDrag'],
                formatter: function (bIsInDrag) {
                  //  return oEvent.oSource.getIsGroupLocked() && bIsInDrag;
                    return this.getIsGroupLocked() && bIsInDrag;
                }
            });

            if (this.bTileContainersContentAdded && !oEvent.oSource.getBeforeContent().length) {
                var aGroups = oEvent.oSource.getModel().getProperty("/groups"),
                    i;

                for (i = 0; i < aGroups.length; i++) {
                    if (aGroups[i].groupId === oEvent.oSource.getGroupId()) {
                        break;
                    }
                }
                this._addTileContainerContent(i);
            }
        },
        _addTileContainersContent : function () {
            if (!this.bTileContainersContentAdded) {
                var aGroups = this.oGroupsContainer.getGroups();

                aGroups.forEach(function (group, groupIndex) {
                    this._addTileContainerContent(groupIndex);
                }.bind(this));
                this.bTileContainersContentAdded = true;
            }
        },
        _addTileContainerContent : function (groupIndex) {
            var oGroup = this.oGroupsContainer.getGroups()[groupIndex],
                sBindingCtxPath;

            if (oGroup) {
                sBindingCtxPath = oGroup.getBindingContext().getPath() + '/';

                oGroup.addBeforeContent(this._getBeforeContent(this.oController, sBindingCtxPath));
                oGroup.addAfterContent(this._getAfterContent(this.oController, sBindingCtxPath));
                oGroup.addHeaderAction(this._getHeaderAction(this.oController, sBindingCtxPath));
            }
        },
        _getBeforeContent : function (oController) {
            var addGrpBtn = new sap.m.Button({
                icon: "sap-icon://add",
                text : sap.ushell.resources.i18n.getText("add_group_at"),
                visible : {
                    parts: ["/tileActionModeActive"],
                    formatter : function (tileActionModeActive) {
                        return (!this.getParent().getIsGroupLocked() && !this.getParent().getDefaultGroup() && tileActionModeActive);
                    }
                },
                enabled: {
                    parts: ["/editTitle"],
                    formatter : function (isEditTitle) {
                        return !isEditTitle;
                    }
                },
                type: sap.m.ButtonType.Transparent,
                press : [ this.oController._addGroupHandler]
            }).addStyleClass("sapUshellAddGroupButton");

            addGrpBtn.addDelegate({
                onAfterRendering: function () {
                    jQuery(".sapUshellAddGroupButton").attr("tabindex", -1);
                }
            });

            return addGrpBtn;
        },
        _getAfterContent : function (oController) {
            var addGrpBtn = new sap.m.Button({
                icon: "sap-icon://add",
                text : sap.ushell.resources.i18n.getText("add_group_at"),
                visible : {
                    parts: ["isLastGroup", "/tileActionModeActive", "/isInDrag"],
                    formatter : function (isLast, tileActionModeActive, isInDrag) {
                        // Calculate the result only if isInDrag is false,
                        // meaning - if there was a drag-and-drop action - is it already ended
                        return (isLast && tileActionModeActive);
                    }
                },
                enabled: {
                    parts: ["/editTitle"],
                    formatter : function (isEditTitle) {
                        return !isEditTitle;
                    }
                },
                type: sap.m.ButtonType.Transparent,
                press : [ this.oController._addGroupHandler]
            }).addStyleClass("sapUshellAddGroupButton");

            addGrpBtn.addDelegate({
                onAfterRendering: function () {
                    jQuery(".sapUshellAddGroupButton").attr("tabindex", -1);
                }
            });

            return addGrpBtn;
        },
        _getHeaderActions: function () {
            var oShowHideBtn = new sap.m.Button({
                text: {
                    path: 'isGroupVisible',
                    formatter: function (bIsGroupVisible) {
                        if (sap.ui.Device.system.phone) {
                            this.setIcon("sap-icon://edit");
                        }
                        return sap.ushell.resources.i18n.getText(bIsGroupVisible ? 'HideGroupBtn' : 'ShowGroupBtn');
                    }
                },
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: ['/tileActionModeActive', '/enableHideGroups', 'isGroupLocked', 'isDefaultGroup'],
                    formatter: function (bIsActionModeActive, bIsHideGroupsEnabled, bIsGroupLocked, bIsDefaultGroup) {
                        return bIsActionModeActive && bIsHideGroupsEnabled && !bIsGroupLocked && !bIsDefaultGroup;
                        //return true;
                    }
                },
                press: function (oEvent) {
                    var oSource = oEvent.getSource(),
                        oGroupBindingCtx = oSource.getBindingContext();
                    this.oController._changeGroupVisibility(oGroupBindingCtx);
                }.bind(this)
            }).addStyleClass("sapUshellHeaderActionButton");
            var oDeleteBtn = new sap.m.Button({
                text: {
                    path: 'removable',
                    formatter: function (bIsRemovable) {
                        if (sap.ui.Device.system.phone) {
                            if (bIsRemovable) {
                                this.setIcon("sap-icon://delete");
                            } else {
                                this.setIcon("sap-icon://refresh");
                            }
                        }
                        return sap.ushell.resources.i18n.getText(bIsRemovable ? 'DeleteGroupBtn' : 'ResetGroupBtn');
                    }
                },
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: ['/tileActionModeActive', 'isDefaultGroup'],
                    formatter: function (bIsActionModeActive, bIsDefaultGroup) {
                        return bIsActionModeActive && !bIsDefaultGroup;
                    }
                },
                enabled: {
                    parts: ["/editTitle"],
                    formatter : function (isEditTitle) {
                        return !isEditTitle;
                    }
                },
                press: function (oEvent) {
                    var oSource = oEvent.getSource(),
                        oGroupBindingCtx = oSource.getBindingContext();
                    this.oController._handleGroupDeletion(oGroupBindingCtx);
                }.bind(this)
            }).addStyleClass("sapUshellHeaderActionButton");
            return [oShowHideBtn, oDeleteBtn];
        },
        _getHeaderAction : function (oController, sBindingCtxPath) {
            jQuery.sap.require("sap.ushell.ui.launchpad.GroupHeaderActions");

            return new sap.ushell.ui.launchpad.GroupHeaderActions({
                content : this._getHeaderActions(),
                tileActionModeActive: {
                    parts: ['/tileActionModeActive', sBindingCtxPath + 'isDefaultGroup'],
                    formatter: function (bIsActionModeActive, bIsDefaultGroup) {
                        return bIsActionModeActive && !bIsDefaultGroup;
                    }
                },
                isOverflow: '{/isPhoneWidth}'
            }).addStyleClass("sapUshellOverlayGroupActionPanel");
        },
        _hidePlusTile : function (plusTileDomRef) {
            if (plusTileDomRef) {
                plusTileDomRef.className += " sapUshellHidePlusTile";
            }
        },
        _showPlusTile: function (plusTileDomRef) {
            if (plusTileDomRef) {
                plusTileDomRef.className = plusTileDomRef.className.split(' ' + 'sapUshellHidePlusTile').join('');
            }
        }
    });
}());
