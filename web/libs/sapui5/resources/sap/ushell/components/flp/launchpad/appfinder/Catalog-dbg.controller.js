// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, $, sap, window */
    /*jslint nomen: true */

    sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.Catalog", {
        oPopoverView: undefined,

        onInit: function () {
            var that = this;
            sap.ui.getCore().byId("catalogSelect").addEventDelegate({
                onBeforeRendering : this.onBeforeSelectRendering
            }, this);
            var oRouter = this.getView().parentComponent.getRouter();
            oRouter.getRoute("catalog").attachPatternMatched(function (oEvent) {
                that.onShow(oEvent);
            });
            oRouter.getRoute("appFinder").attachPatternMatched(function (oEvent) {
                that.onShow(oEvent);
            });
            this.timeoutId = 0;
        },

        onBeforeRendering: function () {
            //Invoking loading of all catalogs here instead of 'onBeforeShow' as it improves the perceived performance.
            //Fix of incident#:1570469901
            sap.ui.getCore().getEventBus().publish("renderCatalog");
            //set initial focus
            setTimeout(function () {
                jQuery('#catalogSelect').focus();
            }, 0);
        },

        onAfterRendering: function () {
            // disable swipe gestures -> never show master in Portait mode
            var oModel = this.getView().getModel(),
                aCurrentCatalogs = oModel.getProperty('/catalogs'),
                that = this;
            //check if the catalogs were already loaded, if so, we don't need the loading message
            if (!aCurrentCatalogs.length) {

                //add the loading message right after the catalog is rendered
                oModel.setProperty('/catalogs', [{
                    title: sap.ushell.resources.i18n.getText('catalogsLoading'),
                    "static": true,
                    tiles: [],
                    numIntentSupportedTiles : -1//only in order to present this option in the Catalog.view (dropdown menu)since there is a filter there on this property
                }]);
                oModel.setProperty('/catalogsNoDataText', sap.ushell.resources.i18n.getText('loadingTiles'));

            } else if (aCurrentCatalogs[0].title != sap.ushell.resources.i18n.getText('catalogsLoading')) {
                oModel.setProperty('/catalogsNoDataText', sap.ushell.resources.i18n.getText('noFilteredItems'));
            }

            if (!this.PagingManager) {
                this.lastCatalogId = 0;
                jQuery.sap.require("sap.ushell.components.flp.launchpad.PagingManager");
                this.PagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
                    supportedElements: {
                        tile : {className: 'sapUshellTile'}
                    },
                    containerHeight: window.innerHeight,
                    containerWidth: window.innerWidth
                });
            }

            //just the first time
            if (this.PagingManager.currentPageIndex === 0) {
                that.allocateNextPage();
            }

            jQuery("#catalogTilesPage-cont").scroll(function () {
                var oPage = sap.ui.getCore().byId('catalogTilesPage'),
                    scroll = oPage.getScrollDelegate(),
                    currentPos = scroll.getScrollTop(),
                    max = scroll.getMaxScrollTop();

                if (max - currentPos <= 30 + that.PagingManager.getTileHeight()) {
                    that.allocateNextPage();
                }
            });
            jQuery(window).resize(function () {
                var windowWidth = $(window).width(),
                    windowHeight = $(window).height();

                that.PagingManager.setContainerSize(windowWidth, windowHeight);
                that.resetPageFilter();
                that.applyTileFilters();
            });
        },

        onShow: function (oEvent) {
            //if the user goes to the catalog directly (not via the dashboard)
            //we must close the loading dialog
            var oViewPortContainer,
                hashTag,
                oModel = this.getView().getModel(),
                aCatalogTiles = oModel.getProperty("/catalogTiles") || [],
                sDataParam = oEvent.getParameter('arguments').filters,
                oDataParam = sDataParam ? JSON.parse(sDataParam) : sDataParam,
                i;

            // The catalog does not contain the notification preview,
            // hence, shifting the scaled center veiwport (when moving to the right viewport) is not needed
            oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            if (oViewPortContainer) {
                oViewPortContainer.shiftCenterTransition(false);
            }

            $.extend(this.getView().getViewData(), oEvent);
            if (this.PagingManager) {
                this.resetPageFilter();
            }

            this.categoryFilter = (oDataParam && oDataParam.catalogSelector && oDataParam.catalogSelector) || null;
            if (this.categoryFilter) {
                this.categoryFilter = window.decodeURIComponent(this.categoryFilter);
            }
            this.searchFilter = (oDataParam && oDataParam.tileFilter && oDataParam.tileFilter) || null;
            if (this.searchFilter) {
                this.searchFilter = window.decodeURIComponent(this.searchFilter);
            }
            hashTag = (oDataParam && oDataParam.tagFilter && oDataParam.tagFilter) || "";

            if (hashTag) {
                try {
                    this.tagFilter = JSON.parse(hashTag);
                } catch (e) {
                    this.tagFilter = [];
                }
            } else {
                this.tagFilter = [];
            }
            if (this.tagFilter) {
                oModel.setProperty("/selectedTags", this.tagFilter);
            }
            oModel.setProperty("/showCatalogHeaders", true);
            oModel.setProperty("/catalogSearchFilter", this.searchFilter);

            for (i = 0; i < aCatalogTiles.length; i = i + 1) {
                aCatalogTiles[i].active = false;
            }

            if (this.categoryFilter || this.searchFilter) {
                // selected category does not work with data binding
                // we need to rerender it manually and then set the selection
                // see function onBeforeSelectRendering
                sap.ui.getCore().byId("catalogSelect").rerender();
            } else {
                //display all
                if (sap.ui.getCore().byId("catalogSelect")) {
                    sap.ui.getCore().byId("catalogSelect").setSelectedItemId("");
                }
            }

            this.oRenderingFilter = new sap.ui.model.Filter('', 'EQ', 'a');
            this.oRenderingFilter.fnTest = function (val) {
                if (val.catalogIndex <= this.lastCatalogId) {
                    return true;
                }

                if (this.allocateTiles > 0) {
                    this.lastCatalogId = val.catalogIndex;
                    this.allocateTiles--;
                    return true;
                }

                return false;
            }.bind(this);

            if (this.PagingManager) {
                this.applyTileFilters();
            }
        },
        resetPageFilter : function () {
            this.lastCatalogId = 0;
            this.allocateTiles = this.PagingManager.getNumberOfAllocatedElements();
        },
        allocateNextPage : function () {
            if (!this.allocateTiles || this.allocateTiles === 0) {
                //calculate the number of tiles in the page.
                this.PagingManager.moveToNextPage();
                this.allocateTiles = this.PagingManager._calcElementsPerPage();
                this.applyTileFilters();
            }
        },

        onBeforeSelectRendering : function () {
            var oSelect = sap.ui.getCore().byId("catalogSelect"),
                aItems = jQuery.grep(oSelect.getItems(), jQuery.proxy(function (oItem) {
                    return oItem.getBindingContext().getObject().title === this.categoryFilter;
                }, this));

            if (!aItems.length) {
                aItems.push(oSelect.getItemAt(0));
            }

            if (aItems[0] && oSelect.getSelectedItemId() !== aItems[0].getId()) {
                window.setTimeout($.proxy(oSelect.setSelectedItem, oSelect, aItems[0].getId()), 500);
            }
        },

        setTagsFilter : function (aFilter) {
            var oParameterObject = {
                catalogSelector : this.categoryFilter,
                tileFilter : this.searchFilter ? encodeURIComponent(this.searchFilter) : "",
                tagFilter : aFilter,
                targetGroup : encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo('appFinder', {'menu': 'catalog', filters: JSON.stringify(oParameterObject)}, true);
        },

        setCategoryFilter : function (aFilter) {
            var oParameterObject = {
                catalogSelector : aFilter,
                tileFilter : this.searchFilter ? encodeURIComponent(this.searchFilter) : "",
                tagFilter: JSON.stringify(this.tagFilter),
                targetGroup : encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo('appFinder', {'menu': 'catalog', filters : JSON.stringify(oParameterObject)}, true);
        },

        setSearchFilter : function (aFilter) {
            var oParameterObject = {
                catalogSelector : this.categoryFilter,
                tileFilter : aFilter ? encodeURIComponent(aFilter) : "",
                tagFilter: JSON.stringify(this.tagFilter),
                targetGroup : encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo('appFinder', {'menu': 'catalog', 'filters' : JSON.stringify(oParameterObject)});
        },

        /**
         * Returns the group context path string as kept in the model
         *
         * @returns {string} Group context
         */
        getGroupContext :  function () {
            var oModel = this.getView().getModel(),
                sGroupContext = oModel.getProperty("/groupContext/path");

            return sGroupContext ? sGroupContext : "";
        },

        applyTileFilters : function () {
            var aFilters = [],
                otagFilter,
                oSearchFilter,
                oCategoryFilter,
                sCatalogTitle;
            if (this.tagFilter) {
                otagFilter = new sap.ui.model.Filter('tags', 'EQ', 'v');
                otagFilter.fnTest = function (oTags) {
                    var ind, filterByTag;
                    if (this.tagFilter.length === 0) {
                        return true;
                    }

                    for (ind = 0; ind < this.tagFilter.length; ind++) {
                        filterByTag = this.tagFilter[ind];
                        if (oTags.indexOf(filterByTag) === -1) {
                            return false;
                        }
                    }
                    return true;
                }.bind(this);

                aFilters.push(otagFilter);
            }
            //Remove all asterisks from search query before applying the filter
            this.searchFilter = this.searchFilter ? this.searchFilter.replace(/\*/g, '') : this.searchFilter;

            if (this.searchFilter) {
                oSearchFilter = new sap.ui.model.Filter($.map(this.searchFilter.split(/[\s,]+/), function (v) {
                    return (v && new sap.ui.model.Filter("keywords", sap.ui.model.FilterOperator.Contains, v)) ||
                        (v && new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, v)) || undefined;
                }), true);
                aFilters.push(oSearchFilter);
            }
            if (this.categoryFilter) {
                sCatalogTitle = this.categoryFilter;

                // Filtering the catalog tiles  according to catalog title (and not catalog ID)  
                oCategoryFilter = new sap.ui.model.Filter("catalog", sap.ui.model.FilterOperator.EQ, sCatalogTitle);
                aFilters.push(oCategoryFilter);
            }
            //Anyway we would like to filter out tiles which are not supported on current device
            aFilters.push(new sap.ui.model.Filter("isTileIntentSupported", sap.ui.model.FilterOperator.EQ, true));

            //Adding the page filter.
            if (this.oRenderingFilter) {
                aFilters.push(this.oRenderingFilter);
            }

            sap.ui.getCore().byId("catalogTiles").getBinding("tiles").filter(aFilters);
        },

        onLiveFilter : function (oEvent) {

            // always clear previous timeout to make sure you that if the filtering was not performed yet,
            // you will delete the previous call and create a new updated one
            clearTimeout(this.timeoutId);
            var that = this,
                sQuery = oEvent.getParameter("newValue"),
                nDelay = 300;

            this.timeoutId = setTimeout(fRunFilter, nDelay, sQuery);

            function fRunFilter(sQuery) {
                if (sQuery) {
                    that.setSearchFilter(sQuery);
                } else {
                    that.setSearchFilter();
                }
            }
        },

        onTagsFilter : function (oEvent) {
            var selectedItem = oEvent.getParameters("selectedItem").changedItem,
                selected = oEvent.getParameter("selected"),
                selectedTagsList = [],
                selectedTag = selectedItem.getText();

            if (this.tagFilter) {
                selectedTagsList = this.tagFilter;
            }

            if (selected) {
                selectedTagsList.push(selectedTag);
            } else {
                selectedTagsList = selectedTagsList.filter(function (entry) {
                    return entry !== selectedTag;
                });
            }
            this.setTagsFilter(selectedTagsList.length > 0 ? JSON.stringify(selectedTagsList) : "");
        },

        onCategoryFilter : function (oEvent) {
            var oSource = oEvent.getParameter("selectedItem"),
                oSourceContext = oSource.getBindingContext(),
                oModel = oSourceContext.getModel();
            if (oModel.getProperty("static", oSourceContext)) { // show all categories
                oModel.setProperty("/showCatalogHeaders", true);
                this.setCategoryFilter();
                this.selectedCategory = undefined;
            } else { // filter to category
                oModel.setProperty("/showCatalogHeaders", false);
                this.setCategoryFilter(window.encodeURIComponent(oSource.getBindingContext().getObject().title));
                this.selectedCategory = oSource.getId();
            }
        },

        onTileAfterRendering : function (oEvent) {
            var footItem = oEvent.getSource().getFootItems()[0];
            if (footItem !== undefined) {
                footItem.addStyleClass("sapUshellCatalogPlusIcon");
            }
        },

        catalogTilePress : function (oController) {
            sap.ui.getCore().getEventBus().publish("launchpad", "catalogTileClick");
        },

        /**
         * Event handler triggered when a tile footer is clicked
         *
         * There are two main use-cases:
         *
         * 1. If the catalog was opened in the context of a specific group
         *
         * 2. If the catalog was opened NOT in the context of a specific group. In this case the flow is:
         *   a. Popover closing use-case:
         *      - If the groups popover is already opened then it should be closed
         *   b. Popover opening use-case:
         *      - Get tile groups data
         *      - If oPopoverView wasn't created yet - then create it
         *      - Set the popover's view content and visibility
         *      - Open the popover
         *
         * @param {sap.ui.base.Event} oEvent
         *     the event object. It is expected that the binding context of the event source points to the tile to add.
         */
        onTileFooterClick : function (oEvent) {
            var clickedObject = oEvent.getSource(),
                oSourceContext = clickedObject.getBindingContext(),
                oModel = this.getView().getModel(),
                sGroupModelPath = oModel.getProperty("/groupContext/path");

            // Check if the catalog was opened in the context of a group, according to the groupContext ("/groupContext/path") in the model
            if (sGroupModelPath) {
                this._handleTileFooterClickInGroupContext(oSourceContext, sGroupModelPath);

                // If the catalog wasn't opened in the context of a group - the action of clicking a catalog tile should open the groups popover
            } else {
                // If the popover is already opened - it should be closed
                if ((this.oPopoverView) && (this.oPopoverView.getVisible() === true)) {
                    this.oPopoverView.setVisible(false);
                }

                var groupList = oModel.getProperty("/groups"),
                    launchPageService = sap.ushell.Container.getService("LaunchPage"),
                    catalogTile = this.getCatalogTileDataFromModel(oSourceContext),
                    tileGroups = catalogTile.tileData.associatedGroups,
                    oGroupData = groupList.map(function (group) {
                        // Get the group's real ID
                        var realGroupID = launchPageService.getGroupId(group.object),
                            // Check if the group (i.e. real group ID) exists in the array of groups that contain the relevant Tile
                            // if so - the check box that re[resents this group should be initially selected
                            selected = !($.inArray(realGroupID, tileGroups) == -1);

                        return {
                            selected: selected,
                            initiallySelected: selected,
                            oGroup: group
                        };
                    });

                if (this.oPopoverView === undefined) {
                    this.oPopoverView = sap.ui.getCore().byId("groupListPopoverView");
                    if (this.oPopoverView === undefined) {
                        // Create popoverView, is it wasn't created yet
                        this.oPopoverView = new sap.ui.view({
                            id: "groupListPopoverView",
                            type: sap.ui.core.mvc.ViewType.JS,
                            viewName: "sap.ushell.components.flp.launchpad.appfinder.GroupListPopover",
                            viewData: {
                                enableHideGroups: oModel.getProperty("/enableHideGroups"),
                                enableHelp: oModel.getProperty("/enableHelp")
                            }
                        });
                        // The view is created with visibility = true by default
                        this.oPopoverView.setVisible(false);
                    }
                }
                if (this.oPopoverView.getVisible() === false) {

                    this.oPopoverView.setGroupListSingleSelection(sap.m.ListMode.MultiSelect);
                    // Set the popover's view content and open it
                    this.oPopoverView.setGroupsData(oGroupData);
                    this.oPopoverView.setVisible(true);
                    this.oPopoverView.open(clickedObject).then(this._handlePopoverResponse.bind(this, oSourceContext, catalogTile));
                }
            }
        },

        _handlePopoverResponse: function (oSourceContext, catalogTile, responseData) {
            var oModel = this.getView().getModel(),
                groupList = oModel.getProperty("/groups");
            var promiseList = [];

            responseData.addToGroups.forEach(function (group) {
                var index = groupList.indexOf(group);
                var oGroupContext = new sap.ui.model.Context(oModel, "/groups/" + index);
                var promise = this._addTile(oSourceContext, oGroupContext);
                promiseList.push(promise);
            }.bind(this));
            responseData.removeFromGroups.forEach(function (group) {
                var tileCatalogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                var index = groupList.indexOf(group);
                var promise = this._removeTile(tileCatalogId, index);
                promiseList.push(promise);
            }.bind(this));
            responseData.newGroups.forEach(function (group) {
                var sNewGroupName = (group.length > 0) ? group : sap.ushell.resources.i18n.getText("new_group_name");
                var promise = this._createGroupAndSaveTile(oSourceContext, sNewGroupName);
                promiseList.push(promise);
            }.bind(this));

            jQuery.when.apply(jQuery, promiseList).then(function () {
                var resultList = Array.prototype.slice.call(arguments);
                this._handlePopoverGroupsActionPromises(catalogTile, responseData, resultList);
            }.bind(this));
        },

        _handlePopoverGroupsActionPromises: function (catalogTile, popoverResponse, resultList) {
            var errorList = resultList.filter(function (result, index, resultList) {
                return !result.status;
            });
            if (errorList.length) {
                var oErrorMessageObj = this.prepareErrorMessage(errorList, catalogTile.tileData.title);
                var dashboardMgr = sap.ushell.components.flp.launchpad.DashboardManager();
                dashboardMgr.resetGroupsOnFailure(oErrorMessageObj.messageId, oErrorMessageObj.parameters);
                return;
            }

            var tileGroupsIdList = [];
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
            popoverResponse.allGroups.forEach(function (group) {
                if (group.selected) {
                    var realGroupID = oLaunchPageService.getGroupId(group.oGroup.object);
                    tileGroupsIdList.push(realGroupID);
                }
            });
            var oModel = this.getView().getModel();
            if (popoverResponse.newGroups.length) {
                var dashboardGroups = oModel.getProperty("/groups");
                var newDashboardGroups = dashboardGroups.slice(dashboardGroups.length - popoverResponse.newGroups.length);
                newDashboardGroups.forEach(function (newGroup) {
                    var realGroupID = oLaunchPageService.getGroupId(newGroup.object);
                    tileGroupsIdList.push(realGroupID);
                });
            }

            oModel.setProperty("/catalogTiles/" + catalogTile.tileIndex + "/associatedGroups", tileGroupsIdList);
            var firstAddedGroupTitle = (!!popoverResponse.addToGroups[0]) ? popoverResponse.addToGroups[0].title : "";
            if (!firstAddedGroupTitle.length && popoverResponse.newGroups.length) {
                firstAddedGroupTitle = popoverResponse.newGroups[0];
            }
            var firstRemovedGroupTitle = (!!popoverResponse.removeFromGroups[0]) ? popoverResponse.removeFromGroups[0].title : "";
            var sDetailedMessage = this.prepareDetailedMessage(catalogTile.tileData.title, popoverResponse.addToGroups.length + popoverResponse.newGroups.length,
                popoverResponse.removeFromGroups.length, firstAddedGroupTitle, firstRemovedGroupTitle);
            sap.m.MessageToast.show( sDetailedMessage, {
                duration: 3000,// default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        _getCatalogTileIndexInModel : function (oSourceContext) {
            var tilePath = oSourceContext.sPath,
                tilePathPartsArray = tilePath.split("/"),
                tileIndex = tilePathPartsArray[tilePathPartsArray.length - 1];

            return tileIndex;
        },

        _handleTileFooterClickInGroupContext : function (oSourceContext, sGroupModelPath) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oModel = this.getView().getModel(),
                catalogTile = this.getCatalogTileDataFromModel(oSourceContext),
                aAssociatedGroups = catalogTile.tileData.associatedGroups,
                oGroupModel = oModel.getProperty(sGroupModelPath), // Get the model of the group according to the group's model path (e.g. "groups/4") 
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                iCatalogTileInGroup = $.inArray(sGroupId, aAssociatedGroups),
                tileIndex = this._getCatalogTileIndexInModel(oSourceContext),
                oGroupContext,
                oAddTilePromise,
                oRemoveTilePromise,
                sTileCataogId,
                groupIndex,
                that = this;

            if (catalogTile.isBeingProcessed) {
                return;
            }
            oModel.setProperty('/catalogTiles/' + tileIndex + '/isBeingProcessed', true);
            // Check if this catalog tile already exist in the relevant group 
            if (iCatalogTileInGroup == -1) {
                oGroupContext = new sap.ui.model.Context(oSourceContext.getModel(), sGroupModelPath);
                oAddTilePromise = this._addTile(oSourceContext, oGroupContext);

                // Function createTile of Dashboard manager always calls defferred.resolve, 
                // and the success/failure indicator is the returned data.status
                oAddTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, true);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, true);
                    }
                });
                oAddTilePromise.always(function () {
                    oModel.setProperty('/catalogTiles/' + tileIndex + '/isBeingProcessed', false);
                });

            } else {
                sTileCataogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                groupIndex = sGroupModelPath.split('/')[2];
                oRemoveTilePromise = this._removeTile(sTileCataogId, groupIndex);

                // Function deleteCatalogTileFromGroup of Dashboard manager always calls defferred.resolve, 
                // and the success/failure indicator is the returned data.status
                oRemoveTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, false);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, false);
                    }
                });
                oRemoveTilePromise.always(function () {
                    oModel.setProperty('/catalogTiles/' + tileIndex + '/isBeingProcessed', false);
                });
            }
        },

        /**
         * Handles success of add/remove tile action in group context.
         * Updates the model and shows an appropriate message to the user.
         *
         * @param {object} oSourceContext
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationSucceeded : function (oSourceContext, oCatalogTileModel, oGroupModel, bTileAdded) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                aAssociatedGroups = oCatalogTileModel.tileData.associatedGroups,
                detailedMessage,
                i;

            // Check if this is an "add tile to group" action
            if (bTileAdded) {
                // Update the associatedGroups array of the catalog tile
                aAssociatedGroups.push(sGroupId);

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty("/catalogTiles/" + oCatalogTileModel.tileIndex + "/associatedGroups", aAssociatedGroups);

                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 1, 0, oGroupModel.title, "");

            } else {
                // If this is a "remove tile from group" action

                // Update the associatedGroups array of the catalog tile
                for (i in aAssociatedGroups) {
                    if (aAssociatedGroups[i] == sGroupId) {
                        aAssociatedGroups.splice(i, 1);
                        break;
                    }
                }

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty("/catalogTiles/" + oCatalogTileModel.tileIndex + "/associatedGroups", aAssociatedGroups);
                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 0, 1, "", oGroupModel.title);
            }

            sap.m.MessageToast.show(detailedMessage, {
                duration: 3000,// default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        /**
         * Handles failure of add/remove tile action in group context.
         * Shows an appropriate message to the user and reloads the groups.
         *
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationFailed : function (oCatalogTileModel, oGroupModel, bTileAdded) {
            var dashboardMgr = sap.ushell.components.flp.launchpad.getDashboardManager(),
                oErrorMessage;

            if (bTileAdded) {
                oErrorMessage = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_add_to_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title]});
            } else {
                oErrorMessage = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_remove_from_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title]});
            }

            dashboardMgr.resetGroupsOnFailure(oErrorMessage.messageId, oErrorMessage.parameters);
        },

        prepareErrorMessage : function (aErroneousActions, sTileTitle) {
            var oGroup,
                sAction,
                sFirstErroneousAddGroup,
                sFirstErroneousRemoveGroup,
                iNumberOfFailAddActions = 0,
                iNumberOfFailDeleteActions = 0,
                bCreateNewGroupFailed = false,
                message;

            for (var index in aErroneousActions) {

                // Get the data of the error (i.e. action name and group object)

                oGroup = aErroneousActions[index].group;
                sAction = aErroneousActions[index].action;

                if (sAction == 'add') {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions == 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else if (sAction == 'remove') {
                    iNumberOfFailDeleteActions++;
                    if (iNumberOfFailDeleteActions == 1) {
                        sFirstErroneousRemoveGroup = oGroup.title;
                    }
                } else if (sAction == 'addTileToNewGroup') {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions == 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else {
                    bCreateNewGroupFailed = true;
                }
            }
            // First - Handle bCreateNewGroupFailed
            if (bCreateNewGroupFailed) {
                if (aErroneousActions.length == 1) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_create_new_group"});
                } else {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_some_actions"});
                }
                // Single error - it can be either one add action or one remove action
            } else if (aErroneousActions.length == 1) {
                if (iNumberOfFailAddActions) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_add_to_group", parameters: [sTileTitle, sFirstErroneousAddGroup]});
                } else {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_remove_from_group", parameters: [sTileTitle, sFirstErroneousRemoveGroup]});
                }
                // 	Many errors (iErrorCount > 1) - it can be several remove actions, or several add actions, or a mix of both
            } else {
                if (iNumberOfFailDeleteActions == 0) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_add_to_several_groups", parameters: [sTileTitle]});
                } else if (iNumberOfFailAddActions == 0) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_remove_from_several_groups", parameters: [sTileTitle]});
                } else {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_some_actions"});
                }
            }
            return message;
        },

        prepareDetailedMessage : function (tileTitle, numberOfAddedGroups, numberOfRemovedGroups, firstAddedGroupTitle, firstRemovedGroupTitle) {
            var message;

            if (numberOfAddedGroups == 0) {
                if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups == 1) {
                if (numberOfRemovedGroups == 0) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]);
                } else if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups > 1) {
                if (numberOfRemovedGroups == 0) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups]);
                } else if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups, numberOfRemovedGroups]);
                }
            }
            return message;
        },

        /**
         * Returns the part of the model that contains the IDs of the groups that contain the relevant Tile
         *
         * @param {} oSourceContext
         *     model context
         */
        getCatalogTileDataFromModel : function (oSourceContext) {
            var tileIndex = this._getCatalogTileIndexInModel(oSourceContext),
                oModel = oSourceContext.getModel(),
                oTileData = oModel.getProperty("/catalogTiles/" + tileIndex);

            // Return an object containing the Tile in the CatalogTiles Array (in the model) ,its index and whether it's in the middle of add/removal proccess.
            return {
                tileData: oTileData,
                tileIndex: tileIndex,
                isBeingProcessed: oTileData.isBeingProcessed ? true : false
            };
        },

        /**
         * Send request to add a tile to a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext
         *     the catalog tile to add
         * @param {sap.ui.model.Context} oGroupContext
         *     the group where the tile should be added
         * @private
         */
        _addTile : function (oTileContext, oGroupContext) {
            var oDashboardManager = sap.ushell.components.flp.launchpad.getDashboardManager(),
                deferred = jQuery.Deferred(),
                promise = oDashboardManager.createTile({
                    catalogTileContext : oTileContext,
                    groupContext: oGroupContext
                });

            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to delete a tile from a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param tileCatalogId
         *     the id of the tile
         * @param index
         *     the index of the group in the model
         * @private
         */
        _removeTile : function (tileCatalogId, index) {
            var oDashboardManager = sap.ushell.components.flp.launchpad.getDashboardManager(),
                deferred = jQuery.Deferred(),
                promise = oDashboardManager.deleteCatalogTileFromGroup({
                    tileId : tileCatalogId,
                    groupIndex : index
                });

            // The function deleteCatalogTileFromGroup always results in deferred.resolve
            // and the actual result of the action (success/failure) is contained in the data object
            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to create a new group and add a tile to this group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext
         *     the catalog tile to add
         * @param newGroupName
         *     the name of the new group where the tile should be added
         * @private
         */
        _createGroupAndSaveTile : function (oTileContext, newGroupName) {
            var oDashboardManager = sap.ushell.components.flp.launchpad.getDashboardManager(),
                deferred = jQuery.Deferred(),
                promise = oDashboardManager.createGroupAndSaveTile({
                    catalogTileContext : oTileContext,
                    newGroupName: newGroupName
                });

            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        }
    });
}());
