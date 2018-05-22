// iteration 0 ok
/* global jQuery, sap, window, console */

// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */

(function(global) {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchShellHelper');


    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchBar');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');

    //     jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchMultiSelectionControl');

    sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.App", {

        createContent: function() {
            var that = this;

            // create search model
            if (!this.oModel) {
                this.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
            }
            this.setModel(sap.ushell.resources.i18nModel, "i18n");

            // search result screen
            this.oSearchResults = sap.ui.view({
                id: "searchContainerResultsView",
                tooltip: "{i18n>searchResultsView_tooltip}",
                viewName: "sap.ushell.renderers.fiori2.search.container.Search",
                type: sap.ui.core.mvc.ViewType.JS
            });

            this.oSearchResults.setModel(that.oModel);
            this.oSearchResults.setAppView(that);

            // deserialze URL
            this.oModel.deserializeURL();

            // create page
            this.oPage = this.pageFactory("searchPage", [this.oSearchResults]);

            return this.oPage;
        },

        beforeExit: function() {

        },

        pageFactory: function(sId, oControl, bDisableBouncing) {
            var that = this;

            var oSearchBar = new sap.ushell.renderers.fiori2.search.controls.SearchBar({
                oSearchLayout: that.oSearchResults.searchLayout,
                filterButtonPressed: that.oModel.getProperty('/facetVisibility'),
                filterButtonVisible: {
                    parts: [{
                        path: '/businessObjSearchEnabled'
                    }],
                    formatter: function(businessObjSearchEnabled) {
                        return !sap.ui.Device.system.phone &&  businessObjSearchEnabled;
                    }
                },
                contentMiddle: new sap.m.Label({
                    text: {
                        parts: [{
                            path: '/count'
                        }],
                        formatter: function(count) {
                            if (typeof count !== 'number') {
                                return "";
                            }
                            var countAsStr = sap.ui.core.format.NumberFormat.getIntegerInstance({
                                style: (Math.abs(count) >= 99950 ? "short" : "standard"), // 99950 is the first number (with precision 3 rounding) that will map to 100000; same as "parseFloat((Math.abs(number)).toPrecision(3)) >= 100000"
                                precision: 3
                            }).format(count);
                            return sap.ushell.resources.i18n.getText("searchResults") + " (" + countAsStr + ")";
                        }
                    },
                    tooltip: {
                        parts: [{
                            path: '/count'
                        }],
                        formatter: function(count) {
                            if (typeof count !== "number") {
                                return "";
                            }
                            return sap.ushell.resources.i18n.getText("searchResults") + " (" + count + ")";
                        }
                    }
                })
            });
            oSearchBar.setModel(that.oModel);

            var oPage = new sap.m.Page({
                id: sId,
                customHeader: oSearchBar,
                content: oControl,
                enableScrolling: true,
                showFooter: true
            });
            oPage.setModel(that.oModel);

            // who is using these events? Necessary? //TODO
            var aEvents = ["onAfterHide", "onAfterShow", "onBeforeFirstShow",
                "onBeforeHide", "onBeforeShow"
            ];
            var oDelegates = {};

            that.createFooter(oPage);

            // Pass navigation container events to children.
            jQuery.each(aEvents, function(iIndex, sEvent) {
                oDelegates[sEvent] = jQuery.proxy(function(evt) {
                    jQuery.each(this.getContent(), function(iIndex, oControl) {
                        /*jslint nomen: true */
                        oControl._handleEvent(evt);
                    });
                }, oPage);
            });

            oPage.addEventDelegate(oDelegates);
            if (!sap.ui.Device.system.desktop) {
                oPage._bUseIScroll = true;
            }
            if (bDisableBouncing) {
                this.disableBouncing(oPage);
            }

            // compact class for non-touch devices
            if (!sap.ui.Device.support.touch) {
                var oView = sap.ui.getCore().byId("searchContainerApp");
                oView.addStyleClass('sapUiSizeCompact');
            }

            return oPage;
        },

        getControllerName: function() {
            return "sap.ushell.renderers.fiori2.search.container.App";
        },

        createFooter: function(oPage) {

            var that = this;

            // no footer on phone
            if (jQuery.device.is.phone) {
                return;
            }

            // button which enables multi-selection-mode
            var oMultiSelectionButton = new sap.m.ToggleButton({
                icon: "sap-icon://multi-select",
                tooltip: sap.ushell.resources.i18n.getText("toggleSelectionModeBtn"),
                press: function() {

                    var content = that.oBar.getContent();
                    var i, control;

                    if (this.getPressed()) {
                        that.oSearchResults.resultList.enableSelectionMode();
                        that.oModel.setProperty("/multiSelectionEnabled", true);

                        for (i = 0; i < content.length; i++) {
                            control = content[i];
                            if (control.hasStyleClass("sapUshellSearchResultList-multiSelectionActionButton")) {
                                that.oBar.removeContent(control);
                            }
                        }

                        var dataSource = that.oModel.getDataSource();
                        var dataSourceConfig = that.oModel.config.getDataSourceConfig(dataSource);
                        /* eslint new-cap:0 */
                        var selectionHandler = new dataSourceConfig.searchResultListSelectionHandlerControl();

                        var actions = selectionHandler.actionsForDataSource();
                        that.oModel.setProperty("/multiSelectionActions", actions);

                        for (i = 0; i < actions.length; i++) {
                            var action = actions[i];
                            var actionButton = new sap.m.Button({
                                text: action.text,
                                press: function() {
                                    var results = that.oModel.getProperty("/results");
                                    var selectedItems = [];
                                    for (var i = 0; i < results.length; i++) {
                                        var item = results[i];
                                        if (item.selected) {
                                            selectedItems.push(item);
                                        }
                                    }

                                    action.action(selectedItems);
                                },
                                visible: {
                                    parts: [{
                                        path: '/multiSelectionEnabled'
                                    }],
                                    mode: sap.ui.model.BindingMode.OneWay
                                }
                            });
                            actionButton.setModel(that.oModel);
                            actionButton.addStyleClass("sapUshellSearchResultList-multiSelectionActionButton");
                            that.oBar.insertContent(actionButton, 2);
                        }

                    } else {
                        that.oSearchResults.resultList.disableSelectionMode();
                        that.oModel.setProperty("/multiSelectionEnabled", false);

                        that.oModel.setProperty("/multiSelectionActions", undefined);

                        for (i = 0; i < content.length; i++) {
                            control = content[i];
                            if (control.hasStyleClass("sapUshellSearchResultList-multiSelectionActionButton")) {
                                that.oBar.removeContent(control);
                            }
                        }
                    }
                },
                visible: {
                    parts: [{
                        path: '/multiSelectionAvailable'
                    }],
                    mode: sap.ui.model.BindingMode.OneWay
                },
                pressed: {
                    parts: [{
                        path: '/multiSelectionEnabled'
                    }],
                    mode: sap.ui.model.BindingMode.OneWay
                }
            });
            oMultiSelectionButton.setModel(this.oModel);
            oMultiSelectionButton.addStyleClass("sapUshellSearchResultList-toggleMultiSelectionButton");

            // create bookmark button (entry in action sheet)
            var oBookmarkButton = new sap.ushell.ui.footerbar.AddBookmarkButton({
                beforePressHandler: function() {
                    var oAppData = {
                        url: document.URL,
                        title: that.oModel.getDocumentTitle(),
                        icon: sap.ui.core.IconPool.getIconURI("search")
                    };
                    oBookmarkButton.setAppData(oAppData);
                }
            });
            oBookmarkButton.setWidth('auto');

            var oEmailButton = new sap.m.Button();
            oEmailButton.setIcon("sap-icon://email");
            oEmailButton.setText(sap.ushell.resources.i18n.getText("eMailFld"));
            oEmailButton.attachPress(function() {
                sap.m.URLHelper.triggerEmail(null, that.oModel.getDocumentTitle(), document.URL);
            });
            oEmailButton.setWidth('auto');

            // add these two jam buttons when we know how to configure jam in fiori  //TODO
            //var oJamShareButton = new sap.ushell.ui.footerbar.JamShareButton();
            //var oJamDiscussButton = new sap.ushell.ui.footerbar.JamDiscussButton();


            // create action sheet
            var oActionSheet = new sap.m.ActionSheet({
                placement: 'Top',
                buttons: [oBookmarkButton, oEmailButton]
            });

            // button which opens action sheet
            var oShareButton = new sap.m.Button({
                icon: 'sap-icon://action',
                tooltip: sap.ushell.resources.i18n.getText('shareBtn'),
                press: function() {
                    oActionSheet.openBy(oShareButton);
                }
            });

            // create error message popover
            var oErrorPopover = new sap.m.MessagePopover({
                placement: "Top"
            }).setModel(this.oModel);

            oErrorPopover.bindAggregation("items", "/errors", function(sId, oContext) {
                var item = new sap.m.MessagePopoverItem({
                    title: "{title}",
                    description: "{description}"
                });
                switch (oContext.oModel.getProperty(oContext.sPath).type.toLowerCase()) {
                    case "error":
                        item.setType(sap.ui.core.MessageType.Error);
                        break;
                    case "warning":
                        item.setType(sap.ui.core.MessageType.Warning);
                        break;
                    default:
                        item.setType(sap.ui.core.MessageType.Information);
                }
                return item;
            });

            // create error message popover button
            var oErrorButton = new sap.m.Button("searchErrorButton", {
                //icon: 'sap-icon://action',
                icon: sap.ui.core.IconPool.getIconURI("alert"),
                text: {
                    parts: [{
                        path: '/errors/length'
                    }],
                    formatter: function(length) {
                        return length;
                    }
                },
                visible: {
                    parts: [{
                        path: '/errors/length'
                    }],
                    formatter: function(length) {
                        return length > 0;
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                },
                type: sap.m.ButtonType.Emphasized,
                tooltip: sap.ushell.resources.i18n.getText('errorBtn'),
                press: function() {
                    oErrorPopover.openBy(oErrorButton);
                }
            });

            oErrorButton.setLayoutData(new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            }));

            oMultiSelectionButton.setLayoutData(new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            }));

            oShareButton.setLayoutData(new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            }));

            var content = [
                oErrorButton,
                new sap.m.ToolbarSpacer(),
                oMultiSelectionButton, oShareButton
            ];

            // create footer bar
            that.oBar = new sap.m.OverflowToolbar({
                content: content
            }).addStyleClass("MyBar");

            //destroy footer if available
            var oFooter = oPage.getFooter();
            if (oFooter && oFooter.destroy) {
                oFooter.destroy();
            }

            oPage.setFooter(that.oBar);
        }
    });
}(window));
