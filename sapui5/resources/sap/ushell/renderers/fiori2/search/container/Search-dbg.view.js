// Oliver+Jian //TODO
// iteration 0 //TODO
/* global window, $, jQuery, sap, console */
// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function(global) {
    "use strict";

    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchLayout");
    jQuery.sap.require("sap.m.BusyDialog");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.DivContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultList");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.controls.SearchResultTable");
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchFilterBar');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchLabel');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchLink');
    jQuery.sap.require("sap.ushell.services.Personalization");
    jQuery.sap.require("sap.m.TablePersoController");
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchLogger');


    var SearchLayout = sap.ushell.renderers.fiori2.search.controls.SearchLayout;
    var SearchResultListContainer = sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer;
    var SearchResultList = sap.ushell.renderers.fiori2.search.controls.SearchResultList;
    var SearchResultTable = sap.ushell.renderers.fiori2.search.controls.SearchResultTable;
    var SearchNoResultScreen = sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen;
    var searchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;
    var SearchLabel = sap.ushell.renderers.fiori2.search.controls.SearchLabel;
    var SearchLink = sap.ushell.renderers.fiori2.search.controls.SearchLink;
    var SearchLogger = sap.ushell.renderers.fiori2.search.SearchLogger;



    sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search", {

        // create content
        // ===================================================================
        createContent: function(oController) {
            var that = this;

            // center area header
            that.centerAreaHeader = that.assembleCenterAreaHeader();

            // center area
            that.centerArea = that.assembleCenterArea();

            // filter contextual bar
            var filterBar = new sap.ushell.renderers.fiori2.search.controls.SearchFilterBar({
                visible: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/uiFilter/defaultConditionGroup'
                    }],
                    formatter: function(facetVisibility, filterConditions) {
                        if (!facetVisibility &&
                            filterConditions &&
                            filterConditions.conditions &&
                            filterConditions.conditions.length > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            });

            // did you mean message bar
            var didYouMeanBar = new sap.m.MessageStrip({
                text: sap.ushell.resources.i18n.getText('did_you_mean').replace('&1', '{/queryFilter/searchTerms}'),
                showIcon: true,
                class: 'sapUiMediumMarginBottom',
                visible: {
                    parts: [{
                        path: '/fuzzy'
                    }, {
                        path: '/boCount'
                    }],
                    formatter: function(fuzzyFlag, boCount) {
                        if (fuzzyFlag == true &&
                            boCount > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            });


            var resultListContainer = new SearchResultListContainer({
                filterBar: filterBar,
                centerAreaHeader: that.centerAreaHeader,
                centerArea: that.centerArea,
                didYouMeanBar: didYouMeanBar,
                noResultScreen: new SearchNoResultScreen({
                    searchBoxTerm: {
                        parts: [{
                            path: '/queryFilter/searchTerms'
                        }],
                        formatter: function(searchTerms) {
                            return searchTerms;
                        }
                    },
                    visible: {
                        parts: [{
                            path: '/count'
                        }, {
                            path: '/isBusy'
                        }],
                        formatter: function(count, isBusy) {
                            return count === 0 && !isBusy;
                        }
                    }
                })
            });

            // container for normal search result list + facets
            that.searchLayout = new SearchLayout({
                resultListContainer: resultListContainer,
                busyIndicator: new sap.m.BusyDialog(),
                isBusy: '{/isBusy}',
                showFacets: '{/facetVisibility}',
                vertical: false,
                facets: new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter()
            });

            // top container
            that.searchContainer = new sap.ushell.renderers.fiori2.search.controls.DivContainer({
                content: that.searchLayout,
                cssClass: 'sapUshellSearchContainer'
            });

            // init search focus handler
            that.oFocusHandler = new searchHelper.SearchFocusHandler(that);

            return that.searchContainer;

        },

        // center area header
        // ===================================================================
        assembleCenterAreaHeader: function() {
            var that = this;

            // datasource tap strips
            var dataSourceTapStrips = that.assembleDataSourceTapStrips();

            // display switch tap strips
            var displaySwitchTapStrips = that.assembleDisplaySwitchTapStrips();

            //            // table sort butoon
            //            var tableSortButton = new sap.m.Button({
            //                icon: "sap-icon://sort",
            //                tooltip: "{i18n>sortTable}",
            //                type: sap.m.ButtonType.Transparent,
            //                enabled: {
            //                    parts: [{
            //                        path: '/displaySwitchVisibility'
            //                    }, {
            //                        path: '/count'
            //                    }],
            //                    formatter: function(displaySwitchVisibility, count) {
            //                        return displaySwitchVisibility && count !== 0;
            //                    }
            //                },
            //                press: function(evt) {
            //                    that.tableSortDialog.open();
            //                    /*
            //                    // set selected item and sort
            //                    var orderBy = that.getModel().getOrderBy();
            //                    var selectedItem = null;
            //                    var i;
            //
            //                    // remove title attribute with key DATASOURCE_AS_KEY
            //                    var sortItems = that.tableSortDialog.getSortItems();
            //
            //                    defaultSortItem.attachItemPropertyChanged(function(){
            //                        if(defaultSortItem.getSelected()){
            //                            that.tableSortDialog.setSortDescending(true);
            //                        }
            //                    });
            //
            //
            //                    // intialize selected sort item
            //                    for (i = 0; i < sortItems.length; i++) {
            //                        if (sortItems[i].getKey() === orderBy.orderBy) {
            //                            selectedItem = sortItems[i]
            //                        }
            //                    }
            //                    if (selectedItem !== null) {
            //                        that.tableSortDialog.setSelectedSortItem(selectedItem);
            //                        that.tableSortDialog.setSortDescending(orderBy.sortOrder === "DESC");
            //                    }else{
            //                        that.tableSortDialog.setSelectedSortItem(that.tableSortDialog.getSortItems()[0]);
            //                        that.tableSortDialog.setSortDescending(true);
            //                    }
            //
            //                    that.tableSortDialog.getSortItems()[0].attachItemPropertyChanged(function(){
            //                        if(that.tableSortDialog.getSortItems()[0].getSelected()){
            //                            that.tableSortDialog.setSortDescending(true);
            //                        }
            //                    });
            //                    */
            //
            //                    /*
            //                    // intialize selected sort item and default sort item
            //                    var sortItems = that.tableSortDialog.getSortItems();
            //                    var selectedItem;
            //                    var defaultSortItem;
            //                    var isOrderByEmpty = jQuery.isEmptyObject(that.getModel().getOrderBy());
            //                    for (var i = 0; i < sortItems.length; i++) {
            //                        // get defaultSortItem
            //                        if (sortItems[i].getKey() === "ushellSearchDefaultSortItem") {
            //                            defaultSortItem = sortItems[i];
            //                        }
            //                        // get selectedItem
            //                        if (!isOrderByEmpty) {
            //                            if(sortItems[i].getKey() === that.getModel().getOrderBy().orderBy){
            //                                selectedItem = sortItems[i];
            //                            }
            //                        }else{
            //                            selectedItem = defaultSortItem;
            //                        }
            //                    }
            //
            //                    // open dialog
            //                    that.tableSortDialog.open();
            //                    selectedItem.setSelected(true);
            //
            //                    // logic of default rank sort item
            //                    // select default rank -> set descending
            //                    defaultSortItem.attachItemPropertyChanged(function(){
            //                        if(defaultSortItem.getSelected()){
            //                            that.tableSortDialog.setSortDescending(true);
            //                            that.tableSortDialog.open();
            //                            //selectedItem.setSelected(false);
            //                            //defaultSortItem.setSelected(true);
            //                        }
            //                    });
            //                    */
            //                }
            //            });

            // table personalize button
            var tablePersonalizeButton = new sap.m.Button("tablePersonalizeButton", {
                icon: "sap-icon://action-settings",
                tooltip: "{i18n>personalizeTable}",
                type: sap.m.ButtonType.Transparent,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function(resultToDisplay) {
                        return resultToDisplay === "searchResultTable";
                    }
                },
                press: function(evt) {
                    that.oTablePersoController.openDialog();
                }
            });

            var centerAreaHeader = new sap.m.Toolbar({
                visible: {
                    parts: [{
                        path: '/count'
                    }],
                    formatter: function(count) {
                        return count !== 0 && !sap.ui.Device.system.phone;
                    }
                },
                content: [
                    dataSourceTapStrips,
                    new sap.m.ToolbarSpacer({}),
                    displaySwitchTapStrips,
                    //                    tableSortButton,
                    tablePersonalizeButton
                ]
            });
            centerAreaHeader.addStyleClass("ushellSearchCenterAreaHeader");

            /*
                        var centerAreaHeader = new sap.ui.layout.FixFlex({
                          visible: {
                              parts: [{
                                      path: '/count'
                                  }, {
                                      path: '/isBusy'
                                  }],
                              formatter: function(count, isBusy) {
                                  return count !== 0 && !isBusy && !sap.ui.Device.system.phone;
                              }
                          },
                          fixFirst: false,
                          vertical: false,
                          flexContent: dataSourceTapStrips,
                          fixContent: new sap.m.Toolbar({
                              content : [
                                  new sap.m.ToolbarSpacer(),
                                  displaySwitchTapStrips,
                                  tableSortButton,
                                  tablePersonalizeButton
                              ]
                          })
                        }).setVertical(false).addStyleClass("fixFlexHorizontal");
            */
            return centerAreaHeader;
        },

        // datasource tap strips
        // ===================================================================
        assembleDataSourceTapStrips: function() {

            var that = this;

            var tabBar = new sap.m.OverflowToolbar({
                design: sap.m.ToolbarDesign.Transparent,
                visible: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/count'
                    }, {
                        path: '/businessObjSearchEnabled'
                    }],
                    formatter: function(facetVisibility, count, bussinesObjSearchEnabled) {
                        return !facetVisibility && count > 0 && bussinesObjSearchEnabled;
                    }
                }
            });
            // define group for F6 handling
            tabBar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );
            tabBar.addStyleClass('searchTabStrips');
            //tabBar.addStyleClass('sapUiTinyMarginBottom');

            that.tabBar = tabBar;

            tabBar.bindAggregation('content', '/tabStrips/strips', function(sId, oContext) {
                return new sap.m.ToggleButton({
                    text: '{labelPlural}',
                    type: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function(selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            if (myDatasource.equals(selectedDS) === true) {
                                return sap.m.ButtonType.Default;
                            } else {
                                return sap.m.ButtonType.Transparent;
                            }
                        }
                    },
                    pressed: {
                        parts: [{
                            path: '/tabStrips/selected'
                        }],
                        formatter: function(selectedDS) {
                            var myDatasource = this.getBindingContext().getObject();
                            return myDatasource.equals(selectedDS);
                        }
                    },
                    press: function(event) {
                        this.setType(sap.m.ButtonType.Default);

                        // clicking on the already selected button has neither UI effect(button stays pressed status) nor reloading of search
                        if (this.getBindingContext().getObject().equals(that.getModel().getProperty('/tabStrips/selected'))) {
                            this.setPressed(true);
                            return;
                        }
                        var aButtons = that.tabBar.getContent();

                        for (var i = 0; i < aButtons.length; i++) {
                            if (aButtons[i].getId() !== this.getId()) {
                                aButtons[i].setType(sap.m.ButtonType.Transparent);
                                if (aButtons[i].getPressed() === true) {
                                    aButtons[i].setPressed(false);
                                }
                            }
                        }

                        // set Datasource to current datasource;
                        that.getModel().setDataSource(this.getBindingContext().getObject());
                    }
                });

            });

            return tabBar;
        },

        reorgTabBarSequence: function() {
            var highLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            });
            var neverOverflowLayout = new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            });

            var aButtons = this.tabBar.getContent();
            for (var i = 0; i < aButtons.length; i++) {
                if (this.getModel().getProperty('/tabStrips/selected').equals(aButtons[i].getBindingContext().getObject())) {
                    aButtons[i].setLayoutData(neverOverflowLayout);
                } else {
                    aButtons[i].setLayoutData(highLayout);
                }

            }

        },

        // display switch tap strips
        // ===================================================================
        assembleDisplaySwitchTapStrips: function() {
            var that = this;
            return new sap.m.SegmentedButton('ResultViewType', {
                selectedKey: {
                    parts: [{
                        path: '/resultToDisplay'
                    }],
                    formatter: function(resultToDisplay) {
                        if (resultToDisplay === "searchResultTable") {
                            return "table";
                        } else {
                            return "list";
                        }
                    }
                },
                items: [
                    new sap.m.SegmentedButtonItem({
                        icon: "sap-icon://list",
                        tooltip: "{i18n>listView}",
                        key: "list"
                    }),
                    new sap.m.SegmentedButtonItem({
                        icon: "sap-icon://table-view",
                        tooltip: "{i18n>tableView}",
                        key: "table"
                    })
                ],
                visible: {
                    parts: [{
                        path: '/displaySwitchVisibility'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    }
                },
                select: function(eObj) {
                    var key = eObj.mParameters.key;
                    var model = that.getModel();
                    if (key === "table") {
                        model.setProperty('/resultToDisplay', "searchResultTable");
                        model.resetAndDisableMultiSelection();
                    } else {
                        model.setProperty('/resultToDisplay', "searchResultList");
                        model.enableOrDisableMultiSelection();
                    }
                }.bind(this)
            });
        },

        // center area
        // ===================================================================
        assembleCenterArea: function() {
            var that = this;

            // sort dialog
            //            that.tableSortDialog = that.assembleSearchResultSortDialog();

            // search result list
            var searchResultList = that.assembleSearchResultList();
            // search result table
            that.searchResultTable = that.assembleSearchResultTable();

            // app search result
            that.appSearchResult = that.assembleAppSearch();
            // show more footer
            that.showMoreFooter = that.assembleShowMoreFooter();

            // table personalize control
            that.oTablePersoController = new sap.m.TablePersoController({
                table: sap.ui.getCore().byId("ushell-search-result-table")
            });

            return [that.tableSortDialog, searchResultList, that.searchResultTable, that.appSearchResult, that.showMoreFooter];
        },

        // sort dialog
        // ===================================================================
        assembleSearchResultSortDialog: function() {
            var that = this;
            var tableSortDialog = new sap.m.ViewSettingsDialog({
                sortDescending: {
                    parts: [{
                        path: "/orderBy"
                    }],
                    formatter: function(orderBy) {
                        return jQuery.isEmptyObject(orderBy) || orderBy.sortOrder === "DESC";
                    }
                },
                confirm: function(evt) {
                    var mParams = [];
                    mParams = evt.getParameters();
                    // ==============================================================================================================
                    // TODO
                    // ==============================================================================================================
                    if (mParams.sortItem) {
                        var oCurrentModel = that.getModel();
                        if (mParams.sortItem.getKey() === "ushellSearchDefaultSortItem") {
                            oCurrentModel.resetOrderBy();
                            tableSortDialog.setSortDescending(true);
                        } else {
                            oCurrentModel.setOrderBy({
                                orderBy: mParams.sortItem.getKey(),
                                sortOrder: mParams.sortDescending === true ? "DESC" : "ASC"
                            });
                        }
                    }
                }
            });

            tableSortDialog.bindAggregation("sortItems", "/tableSortItems", function(path, bData) {
                return new sap.m.ViewSettingsItem({
                    key: "{key}",
                    text: "{name}",
                    selected: "{selected}" // Not binding because of setSlected in ItemPropertyChanged event
                });
            });

            return tableSortDialog;
        },

        // main result table
        // ===================================================================
        assembleSearchResultTable: function() {
            var that = this;
            var resultTable = new SearchResultTable("ushell-search-result-table", {
                //fixedLayout: false,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "searchResultTable" && count !== 0;
                    }
                }

                /*
                ,columns: [
                    new sap.m.Column("ResultColumn1", {
                        header: new sap.m.Text({
                            text: "Column 1"
                        })
                    }),
                    new sap.m.Column("ResultColumn5", {
                        header: new sap.m.Text({
                            text: "Column 5"
                        }),
                        visible: false
                    })
                ]
                */
            });

            resultTable.bindAggregation("columns", "/tableColumns", function(path, bData) {
                var tableColumn = bData.getObject();
                var column = new sap.m.Column(tableColumn.key, {
                    header: new sap.m.Label({
                        text: "{name}",
                        tooltip: "{name}"
                    }),
                    visible: {
                        parts: [{
                            path: 'index'
                        }],
                        formatter: function(index) {
                            return index < 4; // first 4 attributes are visible, including title
                        }
                    }
                });
                return column;
            });

            resultTable.bindAggregation("items", "/results", function(path, bData) {
                return that.assembleTableItems(bData);
            });

            return resultTable;
        },

        // assemble search result table item
        // ===================================================================
        assembleTableItems: function(bData) {
            var that = this;
            var oData = bData.getObject();
            if (oData.type === 'footer') {
                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem(); // return empty list item
            } else {
                return that.assembleTableMainItems(oData, bData.getPath());
            }
        },

        assembleTableMainItems: function(oData, path) {
            var subPath = path + "/itemattributes";
            var columnListItem = new sap.m.ColumnListItem();
            columnListItem.bindAggregation("cells", subPath, function(subPath, bData) {
                if (bData.getObject().isTitle) {
                    return new SearchLink({
                            text: "{value}",
                            href: "{uri}",
                            enabled: {
                                parts: [{
                                    path: 'uri'
                                }],
                                formatter: function(uri) {
                                    return uri ? true : false;
                                }
                            },
                            press: function() {
                                var titleURL = bData.getObject().uri ? bData.getObject().uri : "";
                                // logging for enterprise search concept of me
                                var oNavEventLog = new SearchLogger.NavigationEvent();
                                oNavEventLog.addUserHistoryEntry(titleURL);
                                // logging for usage analytics
                                var model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                                model.analytics.logCustomEvent('FLP: Search', 'Launch Object', [titleURL]);
                            }
                        })
                        // for tooltip handling
                        // see in SearchResultTable.onAfterRendering for event handlers
                        .addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                } else {
                    return new SearchLabel({
                            text: "{value}"
                        })
                        // for tooltip handling
                        // see in SearchResultTable.onAfterRendering for event handlers
                        .addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                }
            });

            return columnListItem;
        },

        // assemble show more footer
        // ===================================================================
        assembleShowMoreFooter: function() {
            var that = this;
            var button = new sap.m.Button({
                text: "{i18n>showMore}",
                type: sap.m.ButtonType.Transparent,
                press: function() {
                    var oCurrentModel = that.getModel();
                    oCurrentModel.setProperty('/focusIndex', oCurrentModel.getTop());
                    var newTop = oCurrentModel.getTop() + oCurrentModel.pageSize;
                    oCurrentModel.setTop(newTop);
                }
            });
            button.addStyleClass('sapUshellResultListMoreFooter');
            var container = new sap.m.FlexBox({
                visible: false,
                //                 height: "3rem",
                //                 alignItems:sap.m.FlexAlignItems.Start,
                justifyContent: sap.m.FlexJustifyContent.Center
            });
            container.addStyleClass('sapUshellResultListMoreFooterContainer')
            container.addItem(button);
            return container;
        },

        // main result list
        // ===================================================================
        assembleSearchResultList: function() {

            var that = this;

            that.resultList = new SearchResultList({
                mode: sap.m.ListMode.None,
                width: "auto",
                showNoData: false,
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "searchResultList" && count !== 0;
                    }
                }
            });

            that.resultList.bindAggregation("items", "/results", function(path, oContext) {
                return that.assembleListItem(oContext);
            });

            return that.resultList;
        },

        // app search area
        // ===================================================================
        assembleAppSearch: function() {

            var that = this;

            // tiles container
            var tileContainer = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({
                maxRows: 99999,
                totalLength: '{/appCount}',
                visible: {
                    parts: [{
                        path: '/resultToDisplay'
                    }, {
                        path: '/count'
                    }],
                    formatter: function(resultToDisplay, count) {
                        return resultToDisplay === "appSearchResult" && count !== 0;
                    }
                },
                highlightTerms: '{/uiFilter/searchTerms}',
                showMore: function() {
                    var model = that.getModel();
                    model.setProperty('/focusIndex', tileContainer.getNumberDisplayedTiles() - 1);
                    var newTop = model.getTop() + model.pageSize * tileContainer.getTilesPerRow();
                    model.setTop(newTop);
                }
            });

            tileContainer.bindAggregation('tiles', '/appResults', function(sId, oContext) {
                return that.getTileView(oContext.getObject().tile);
            });
            tileContainer.addStyleClass('sapUshellSearchTileResultList');

            sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged', function() {
                tileContainer.delayedRerender();
            }, this);

            return tileContainer;
        },

        // assemble title item
        // ===================================================================
        assembleTitleItem: function(oData) {
            var item = new sap.m.CustomListItem();
            var title = new sap.m.Label({
                text: "{title}"
            });
            title.addStyleClass('bucketTitle');
            item.addStyleClass('bucketTitleContainer');
            item.addContent(new sap.m.HBox({
                items: [title]
            }));
            return item;
        },

        // assemble app container result list item
        // ===================================================================
        assembleAppContainerResultListItem: function(oData, path) {
            var that = this;
            var container = new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({
                maxRows: sap.ui.Device.system.phone ? 2 : 1,
                totalLength: '{/appCount}',
                highlightTerms: '{/uiFilter/searchTerms}',
                enableKeyHandler: false,
                resultList: that.resultList,
                showMore: function() {
                    var model = that.getModel();
                    model.setDataSource(model.appDataSource);
                }
            });
            container.bindAggregation('tiles', 'tiles', function(sId, oContext) {
                return that.getTileView(oContext.getObject().tile);
            });

            var listItem = new sap.m.CustomListItem({
                content: container
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');
            listItem.addStyleClass('sapUshellSearchResultListItemApps');

            listItem.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    var $listItem = $(listItem.getDomRef());
                    $listItem.removeAttr("tabindex");
                    $listItem.removeAttr("role");
                }
            }, listItem);

            sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged', function() {
                container.delayedRerender();
            }, this);

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleResultListItem: function(oData, path) {
            /* eslint new-cap:0 */
            var dataSourceConfig = this.getModel().config.getDataSourceConfig(oData.dataSource);

            var item = new dataSourceConfig.searchResultListItemControl({
                title: "{$$Name$$}",
                titleUrl: "{uri}",
                titleUrlIsIntent: "{titleUriIsIntent}",
                type: "{dataSource/label}",
                imageUrl: "{imageUrl}",
                data: oData,
                path: path,
                selected: "{selected}",
                expanded: "{expanded}"
            });

            var listItem = new sap.m.CustomListItem({
                content: item
            });
            listItem.addStyleClass('sapUshellSearchResultListItem');

            return listItem;
        },

        // assemble search result list item
        // ===================================================================
        assembleListItem: function(oContext) {
            var that = this;
            var oData = oContext.getObject();
            if (oData.type === 'title') {
                return that.assembleTitleItem(oData);
            } else if (oData.type === 'footer') {
                that.showMoreFooter.setVisible(true);
                return new sap.m.CustomListItem(); // return empty list item
            } else if (oData.type === 'appcontainer') {
                return that.assembleAppContainerResultListItem(oData, oContext.getPath());
            } else {
                return that.assembleResultListItem(oData, oContext.getPath());
            }
        },


        // get tile view
        // ===================================================================
        getTileView: function(tile) {
            // try to set render mode as tile
            try {
                var typesContract = tile.getContract('types');
                typesContract.setType('tile');
            } catch (e) { /* nothing to do.. */ }
            // create view
            var view = sap.ushell.Container.getService('LaunchPage').getCatalogTileView(tile);
            // set title for usage analytics logging
            if (tile.getTitle) {
                view.usageAnalyticsTitle = tile.getTitle();
            } else {
                view.usageAnalyticsTitle = 'app';
            }
            return view;
        },

        // event handler search started
        // ===================================================================
        onAllSearchStarted: function() {
            this.showMoreFooter.setVisible(false);
        },

        // event handler search finished
        // ===================================================================
        onAllSearchFinished: function() {
            var that = this;
            that.reorgTabBarSequence();
            that.oFocusHandler.setFocus();

            // generate new personalize provider
            var model = that.getModel();
            var dsKey = model.getDataSource().key;
            var newPersoServiceProvider = model.getPersoServiceProvider(dsKey);
            if (newPersoServiceProvider === undefined) {
                newPersoServiceProvider = model.buildPersoServiceProvider(dsKey);
                model.pushPersoServiceProvider(newPersoServiceProvider);
            }

            // compare to old personalize provider
            // if it is search in new datasource, then update personalize service
            if (that.oldPersoServiceProvider === undefined || that.oldPersoServiceProvider.key !== newPersoServiceProvider.key) {
                //that.oTablePersoController.destroyPersoService().setPersoService(newPersoServiceProvider.provider).activate();
                that.oTablePersoController.destroy();
                that.oTablePersoController = new sap.m.TablePersoController({
                    table: sap.ui.getCore().byId("ushell-search-result-table"),
                    persoService: newPersoServiceProvider.provider
                }).activate();
                that.oldPersoServiceProvider = newPersoServiceProvider;
            }
        },


        // set appview container
        // ===================================================================
        setAppView: function(oAppView) {
            var that = this;
            that.oAppView = oAppView;
            if (that.oTilesContainer) {
                that.oTilesContainer.setAppView(oAppView);
            }
        },

        // get controller name
        // ===================================================================
        getControllerName: function() {
            return "sap.ushell.renderers.fiori2.search.container.Search";
        }
    });

}(window));
