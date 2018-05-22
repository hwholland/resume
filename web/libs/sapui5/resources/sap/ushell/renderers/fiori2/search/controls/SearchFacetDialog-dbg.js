/* global $, jQuery, sap, window, document */
(function() {
    "use strict";

    jQuery.sap.require('sap.m.Dialog');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.FacetItem');

    sap.m.Dialog.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetDialog', {
        metadata: {
            properties: {
                "lastupdated": 0,
                "currentSelectionCount": 0
            }
        },
        constructor: function(options) {

            var that = this;
            that.bShowCharts = true; //change this to completely turn off charts in show more dialog

            //the position index of elements in parent aggregation:
            //first masterPage: masterPages[0]->scrollContainer->content[]
            that.facetListPosition = 0;
            //every detailPage->content[]
            that.settingContainerPosition = 0;
            that.settingSeparatorPosition = 1;
            that.attributeListPosition = 2;
            that.advancedPosition = 4;
            //settingContainer->content[]
            that.sortingSelectPosition = 0;
            that.showOnTopCheckBoxPosition = 1;

            that.chartOnDisplayIndex = options.selectedTabBarIndex; // avr
            that.facetOnDisplayIndex = 0;
            that.chartOnDisplayIndexByFilterArray = [];
            that.aItemsForBarChart = [];
            that.tabBarItems = options.tabBarItems;
            if (!that.tabBarItems) {
                that.setDummyTabBarItems();
            }

            options = jQuery.extend({}, {
                showHeader: false,
                //title: sap.ushell.resources.i18n.getText("filters"),
                horizontalScrolling: false,
                verticalScrolling: false,
                contentHeight: '35rem',
                beginButton: new sap.m.Button({
                    text: sap.ushell.resources.i18n.getText("okDialogBtn"),
                    press: function(oEvent) {
                        that.onOkClick(oEvent);
                        that.close();
                        that.destroy();
                    }
                }),
                endButton: new sap.m.Button({
                    text: sap.ushell.resources.i18n.getText("cancelDialogBtn"),
                    press: function(oEvent) {
                        that.close();
                        that.destroy();
                    }
                }),
                content: [that.createContainer()]
            }, options);

            that.selectedAttribute = options.selectedAttribute ? options.selectedAttribute : "";

            //cleanup before applying options to sap.m.Dialog constructor  avr
            delete options.selectedAttribute;
            delete options.selectedTabBarIndex;
            delete options.tabBarItems;

            sap.m.Dialog.prototype.constructor.apply(this, [options]);
            //            this.addStyleClass('sapUiSizeCompact');
            this.addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");
            this.addStyleClass('sapUshellSearchFacetDialog');

        },
        setChartOnDisplayIndexForFacetListItem: function(facetOnDisplayIndex) {
            var that = this;
            var res = 0;
            try {
                res = that.chartOnDisplayIndexByFilterArray[facetOnDisplayIndex];
            } catch (e) {
                res = 0;
            }
            if (res === undefined) {
                res = 0;
            }
            that.chartOnDisplayIndex = res;

        },
        setDummyTabBarItems: function() {
            var that = this;
            that.tabBarItems = [new sap.m.IconTabFilter({
                text: sap.ushell.resources.i18n.getText("facetList"),
                icon: "sap-icon://list",
                key: 'list' + arguments[0]
            }), new sap.m.IconTabFilter({
                text: sap.ushell.resources.i18n.getText("facetBarChart"),
                icon: "sap-icon://horizontal-bar-chart",
                key: 'barChart' + arguments[0]
            }), new sap.m.IconTabFilter({
                text: sap.ushell.resources.i18n.getText("facetPieChart"),
                icon: "sap-icon://pie-chart",
                key: 'pieChart' + arguments[0]

            })];
            that.chartOnDisplayIndex = 0;
        },
        renderer: 'sap.m.DialogRenderer',

        createContainer: function() {
            var that = this;

            //create SplitContainer with masterPages
            that.oSplitContainer = new sap.m.SplitContainer({
                masterPages: that.masterPagesFactory()
            });

            //binding detailPages in SplitContainer
            that.oSplitContainer.bindAggregation("detailPages", "/facetDialog", function(sId, oContext) {
                return that.detailPagesFactory(sId, oContext);
            });

            that.oSplitContainer.addStyleClass('sapUshellSearchFacetDialogContainer');



            return that.oSplitContainer;
        },

        //create masterPages in splitContainer
        masterPagesFactory: function() {
            var that = this;

            //create facet list
            var oFacetList = new sap.m.List({
                mode: sap.m.ListMode.SingleSelectMaster,
                selectionChange: function(oEvent) {
                    that.onMasterPageSelectionChange(oEvent);
                }
            });
            oFacetList.addStyleClass('sapUshellSearchFacetDialogFacetList');
            oFacetList.bindAggregation("items", "/facetDialog", function(sId, oContext) {
                var oListItem = new sap.m.StandardListItem({
                    title: "{title}",
                    infoState: "Success"
                });

                //calculate seleted items
                var sFacetType = oContext.oModel.getProperty(oContext.sPath).facetType;
                var count = oContext.oModel.getProperty(oContext.sPath).count;
                if (sFacetType === "attribute" && count > 0) {
                    oListItem.setCounter(count);
                }

                //"search for" must be bold
                if (sFacetType === "search") {
                    oListItem.addStyleClass('sapUshellSearchFacetDialogListItemBold');
                }

                return oListItem;
            });

            //create a scrollContainer, content is the facet list
            var oMasterPage = new sap.m.Page({
                title: sap.ushell.resources.i18n.getText("filters"),
                //height: '100%', //avr not valid values
                //horizontal: false,
                //vertical: true,
                content: [oFacetList]
            }).addStyleClass('sapUshellSearchFacetDialogMasterContainer');

            oMasterPage.addEventDelegate({
                onAfterRendering: function(oEvent) {

                    if (that.selectedAttribute) {
                        for (var i = 0; i < oFacetList.getItems().length; i++) {
                            var oListItem = oFacetList.getItems()[i];
                            var oBindingObject = oListItem.getBindingContext().getObject();
                            if (that.selectedAttribute === oBindingObject.dimension) {
                                oFacetList.setSelectedItem(oListItem);
                                that.facetOnDisplayIndex = i;
                                that.chartOnDisplayIndexByFilterArray.push(that.chartOnDisplayIndex); //avr initial setting of array
                            } else {
                                that.chartOnDisplayIndexByFilterArray.push(0); //avr initial setting of array
                            }
                        }
                    }
                    if (!oFacetList.getSelectedItem()) {
                        oFacetList.setSelectedItem(oFacetList.getItems()[0]);
                    }
                    var oSelectedItem = oFacetList.getSelectedItem();
                    that.updateDetailPage(oSelectedItem);

                    //-------------  avr to do refactor
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '.sapUshellSearchFacetDialogTabBarButton {} .sapUshellSearchFacetDialogTabBarHeader{} .red{ border-style:solid; border-width:1px;border-collapse: collapse; border-color:red;} .sapUshellSearchFacetBarChartLarge{padding:0 0.5rem  0 0.5rem;}';
                    document.getElementsByTagName('head')[0].appendChild(style);
                    $('.sapUshellSearchFacetDialog .sapMDialogScrollCont').height('100%');


                    //------------- end avr
                }
            });

            //masterPages has only one page
            var oMasterPages = [oMasterPage];
            return oMasterPages;
        },

        //event: select listItems in masterPage
        onMasterPageSelectionChange: function(oEvent) {
            var that = this;
            var oListItem = oEvent.mParameters.listItem;
            that.facetOnDisplayIndex = oListItem.getParent().indexOfItem(oListItem.getParent().getSelectedItem());
            that.setChartOnDisplayIndexForFacetListItem(that.facetOnDisplayIndex);
            that.updateDetailPage(oListItem);
        },

        //create detailPage in splitContainer, using data binding
        detailPagesFactory: function(sId, oContext) {
            var that = this;
            var sFacetType = oContext.oModel.getProperty(oContext.sPath).facetType;
            var sDataType = that.getAttributeDataType(oContext.oModel.getProperty(oContext.sPath).dataType);

            //create a settings container with select and checkBox, initial is not visible
            var oSelect = new sap.m.Select({
                items: [
                    new sap.ui.core.Item({
                        text: sap.ushell.resources.i18n.getText("notSorted"),
                        key: "notSorted"
                    }),
                    new sap.ui.core.Item({
                        text: sap.ushell.resources.i18n.getText("sortByCount"),
                        key: "sortCount"
                    }),
                    new sap.ui.core.Item({
                        text: sap.ushell.resources.i18n.getText("sortByName"),
                        key: "sortName"
                    })
                ],
                selectedKey: "sortCount",
                change: function(oEvent) {
                    that.onSelectChange(oEvent);
                }
            }).addStyleClass('sapUshellSearchFacetDialogSettingsSelect');
            var oCheckBox = new sap.m.CheckBox({
                text: "Show Selected on Top",
                enabled: false,
                select: function(oEvent) {
                    that.onCheckBoxSelect(oEvent);
                }
            });
            var oSettings = new sap.ui.layout.VerticalLayout({
                content: [oSelect, oCheckBox]
            }).addStyleClass('sapUshellSearchFacetDialogSettingsContainer');
            oSettings.setVisible(false);

            //create the attribute list for each facet
            var oList = new sap.m.List({
                includeItemInSelection: true,
                showNoData: false,
                showSeparators: sap.m.ListSeparators.None,
                selectionChange: function(oEvent) {
                    that.onDetailPageSelectionChange(oEvent);
                }
            });
            oList.addStyleClass('sapUshellSearchFacetDialogDetailPageList');
            oList.addStyleClass('largeChart0');

            if (sFacetType === "attribute") {
                oList.setMode(sap.m.ListMode.MultiSelect);
            }
            var oBindingInfo = {
                path: "items",
                factory: function(sId, oContext) {
                    var oBinding = oContext.oModel.getProperty(oContext.sPath);
                    var oListItem = new sap.m.StandardListItem({
                        title: "{label}",
                        tooltip: "{label}" + "  " + "{value}",
                        info: "{valueLabel}",
                        selected: oBinding.selected
                    });

                    //prepare the local filterConditions array in facet dialog
                    if (oBinding.selected) {
                        oContext.oModel.addFilter(oBinding);
                    }

                    return oListItem;
                }
            };
            if (sDataType === "number") {
                oSelect.removeItem(2);
            }
            oBindingInfo.filters = new sap.ui.model.Filter("advanced", sap.ui.model.FilterOperator.NE, true);
            oList.bindAggregation("items", oBindingInfo);
            oList.setBusyIndicatorDelay(0);
            oList.data('dataType', sDataType);
            if (that.bShowCharts) {
                oList.addEventDelegate({
                    onAfterRendering: function(oEvent) {
                        that.hideSelectively(oEvent, that, 0);
                    }
                });
            }
            var oListContainer, oChartPlaceholder1, oChartPlaceholder2;

            oChartPlaceholder1 = that.getBarChartPlaceholder();
            var oBindingInfo2 = {
                path: "items",
                factory: function(sId, oContext) {
                    var oBinding = oContext.oModel.getProperty(oContext.sPath);
                    var oComparisonMicroChartData = new sap.suite.ui.microchart.ComparisonMicroChartData({
                        title: '{label}',
                        value: '{value}',
                        color: {
                            path: 'selected',
                            formatter: function(val) {
                                var res = sap.m.ValueColor.Good;
                                if (!val) {
                                    res = sap.m.ValueColor.Neutral;
                                }
                                return res;
                            }
                        },
                        displayValue: '{valueLabel}',
                        //selected: oBinding.selected,
                        customData: {
                            key: "selected", //does not work
                            value: "{selected}",
                            writeToDom: true
                        },
                        press: function(oEvent) {
                            //var isSelected = data.selected;
                            //if (isSelected) {
                            //deselect
                            that.onDetailPageSelectionChangeCharts(oEvent);
                            //} else {
                            //select  ie set filter
                            //    that.onDetailPageSelectionChange(oEvent);
                            //}
                        }
                    });

                    //prepare the local filterConditions array in facet dialog
                    if (oBinding.selected) {
                        oContext.oModel.addFilter(oBinding);
                    }
                    return oComparisonMicroChartData;
                }
            };
            oChartPlaceholder1.bindAggregation("data", oBindingInfo2);
            oChartPlaceholder1.setBusyIndicatorDelay(0);
            oChartPlaceholder1.data('dataType', sDataType);


            oChartPlaceholder2 = that.getPieChartPlaceholder();

            if (that.bShowCharts) {
                oListContainer = new sap.m.ScrollContainer({
                    height: '67.2%',
                    horizontal: false,
                    vertical: true,
                    content: [oList, oChartPlaceholder1, oChartPlaceholder2]
                });
            } else {
                oListContainer = new sap.m.ScrollContainer({
                    height: '67.2%',
                    horizontal: false,
                    vertical: true,
                    content: [oList]
                });
            }

            oListContainer.addStyleClass('sapUshellSearchFacetDialogDetailPageListContainer');
            oListContainer.addStyleClass('searchFacetLargeChartContainer');
            //oListContainer.addStyleClass('red');


            //create two separators between setting, attribute list and advanced search
            var oSettingSeparatorItem = new sap.m.StandardListItem({});
            var oSettingSeparator = new sap.m.List({
                items: [oSettingSeparatorItem],
                showSeparators: sap.m.ListSeparators.None
            }).addStyleClass('sapUshellSearchFacetDialogDetailPageSettingSeparator');
            oSettingSeparator.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    $('.sapUshellSearchFacetDialogDetailPageSettingSeparator').attr("aria-hidden", "true");
                }
            });

            var oSeparatorItem = new sap.m.StandardListItem({});
            var oSeparator = new sap.m.List({
                items: [oSeparatorItem],
                showSeparators: sap.m.ListSeparators.None
            }).addStyleClass('sapUshellSearchFacetDialogDetailPageSeparator');
            oSeparator.setShowSeparators(sap.m.ListSeparators.All);

            //create advanced search
            var oAdvancedCondition = that.advancedConditionFactory(sDataType);
            // oAdvancedContainer = tab called 'define condition'
            var oAdvancedContainer = new sap.m.ScrollContainer({
                height: '30%',
                horizontal: false,
                vertical: true,
                content: [oAdvancedCondition]
            });
            oAdvancedContainer.addStyleClass('sapUshellSearchFacetDialogDetailPageAdvancedContainer');
            if (sDataType === "string" || sDataType === "text") {
                var oPlusButton = new sap.m.Button({
                    icon: "sap-icon://add",
                    type: sap.m.ButtonType.Transparent,
                    press: function(oEvent) {
                        that.onPlusButtonPress(oEvent, sDataType);
                    }
                });
                oAdvancedContainer.addContent(oPlusButton);
            }
            oAdvancedContainer.data('dataType', sDataType);
            oAdvancedContainer.data('initial', true);
            var oPage;
            if (sDataType === "string" || sDataType === "text") {
                oListContainer.setHeight('98%');
                oAdvancedContainer.setHeight('100%');
                var oChartSelectionButton = that.getDropDownButton();
                var subheader = new sap.m.Toolbar({
                    content: [
                        new sap.m.SearchField({
                            //showSearchButton: false,
                            placeholder: sap.ushell.resources.i18n.getText("filterPlaceholder"),
                            liveChange: function(oEvent) {
                                that.onSearchFieldLiveChange(oEvent);
                            }
                        }),
                        new sap.m.ToggleButton({
                            icon: "sap-icon://sort",
                            press: function(oEvent) {
                                that.onSettingButtonPress(oEvent);
                            }
                        }).addStyleClass('sapUshellSearchFacetDialogSortButton')
                    ]
                }).addStyleClass('sapUshellSearchFacetDialogSubheaderToolbar');
                if (that.bShowCharts) {
                    subheader.addContent(oChartSelectionButton);
                }
                var oTabListPage = new sap.m.Page({
                    showHeader: false,
                    subHeader: subheader,
                    content: [oSettings, oSettingSeparator, oListContainer]
                }).addStyleClass('sapUshellSearchFacetDialogDetailPage');
                var oIconTabBar = new sap.m.IconTabBar({
                    upperCase: true,
                    expandable: false,
                    stretchContentHeight: true,
                    applyContentPadding: false,
                    select: function(oEvent) {
                        var elemFacetList = $(".sapUshellSearchFacetDialogFacetList")[0];
                        var oFacetList = sap.ui.getCore().byId(elemFacetList.id);
                        if (!oFacetList.getSelectedItem()) {
                            oFacetList.setSelectedItem(oFacetList.getItems()[0]);
                        }
                        oFacetList.fireSelectionChange({
                            listItem: oFacetList.getSelectedItem()
                        });
                        that.controlChartVisibility(that, that.chartOnDisplayIndex);
                    },
                    items: [
                        new sap.m.IconTabFilter({
                            text: sap.ushell.resources.i18n.getText("selectFromList"),
                            content: [oTabListPage]
                        }),
                        new sap.m.IconTabFilter({
                            text: sap.ushell.resources.i18n.getText("defineCondition"),
                            content: [oAdvancedContainer]
                        })
                    ]
                });
                oIconTabBar.addStyleClass('sapUshellSearchFacetDialogIconTabBar');
                oPage = new sap.m.Page({
                    showHeader: true,
                    title: oContext.oModel.getProperty(oContext.sPath).title,
                    content: [oIconTabBar]
                });
                oPage.addStyleClass('sapUshellSearchFacetDialogDetailPageString');

            } else {
                //create a page for type number or date, content include settings container and attribute list, head toolbar has a setting button and a search field
                if (that.bShowCharts) {
                    var headerWithDropDown, title;
                    title = oContext.oModel.getProperty(oContext.sPath).title;
                    headerWithDropDown = that.getHeaderWithDropDown(title);
                    oPage = new sap.m.Page({
                        showHeader: true,
                        headerContent: headerWithDropDown,
                        content: [oSettings, oSettingSeparator, oListContainer, oSeparator, oAdvancedContainer]
                    });
                } else {
                    oPage = new sap.m.Page({
                        showHeader: true,
                        title: oContext.oModel.getProperty(oContext.sPath).title,
                        content: [oSettings, oSettingSeparator, oListContainer, oSeparator, oAdvancedContainer]
                    });
                }
                oPage.addStyleClass('sapUshellSearchFacetDialogDetailPage');

            }
            return oPage;
        },
        //create Header with DropDownButton and actionsheet //avr
        getHeaderWithDropDown: function(title) {
            var that = this;
            var oChartSelectionButton = that.getDropDownButton(); //avr

            var label = new sap.m.Label({
                text: title
            });
            var headerWithDropDown = new sap.m.Bar({
                translucent: true,
                design: sap.m.BarDesign.Header,
                contentMiddle: [label, oChartSelectionButton]
            });
            headerWithDropDown.addStyleClass("sapUshellSearchFacetDialogTabBarHeader");
            //headerWithDropDown.addStyleClass("red");

            return headerWithDropDown;
        },
        //create chart inside placeholder //avr
        getBarChartPlaceholder: function() {
            var that = this;
            var oChart1;
            oChart1 = new sap.suite.ui.microchart.ComparisonMicroChart({
                width: "90%",
                //colorPalette: "", //the colorPalette merely stops the evaluation of the bar with 'neutral', 'good' etc
                //press: function(oEvent) {
                //    //not used
                //},
                tooltip: ""

            });
            oChart1.addStyleClass('largeChart1barchart');
            oChart1.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    that.hideSelectively(oEvent, that, 1);
                }
            });
            return oChart1;
        },
        //create chart inside placeholder //avr
        getBarChartPlaceholder2: function() {
            var that = this;
            var oChart1;
            //var d = new Date();
            //var n = d.getTime();
            var barchartOptions = {};
            //barchartOptions.id = "barChart" + n;
            //barchartOptions.oSearchFacetDialog = that;

            oChart1 = new sap.ushell.renderers.fiori2.search.controls.SearchFacetBarChart(barchartOptions);
            oChart1.addStyleClass('largeChart1barchart');
            oChart1.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    that.hideSelectively(oEvent, that, 1);
                }
            });
            return oChart1;
        },
        //create chart inside placeholder //avr
        getPieChartPlaceholder: function() {
            var that = this;
            var oChart2;
            //var d = new Date();
            //var n = d.getTime();
            var piechartOptions = {};
            //piechartOptions.id = "pieChart" + n;
            piechartOptions.oSearchFacetDialog = that;
            oChart2 = new sap.ushell.renderers.fiori2.search.controls.SearchFacetPieChart(piechartOptions);
            oChart2.addStyleClass('largeChart2piechart');
            oChart2.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    that.hideSelectively(oEvent, that, 2);
                }
            });
            sap.ui.core.ResizeHandler.register(oChart2, function(oEvent) {

                var svg_x = parseInt(window.getComputedStyle(oEvent.target.firstChild, null).getPropertyValue("transform-origin").split(" ")[0], 10);
                var marginLeft = (oEvent.size.width / 2) - svg_x;
                oEvent.target.firstChild.style.marginLeft = marginLeft + "px";
                //console.debug("\nhhh:" + oEvent.size.width + ", svg_x: " + svg_x + ", marginLeft: " + marginLeft + "\n ");
            });
            return oChart2;
        },
        //create an DropDownButton with an actionsheet //avr
        getDropDownButton: function() {
            var that = this;
            var aButtons = [];
            var oButton;
            var oDropDownButton = new sap.m.Button({
                icon: that.tabBarItems[that.chartOnDisplayIndex].getIcon() //,
                //type: 'Transparent'
            });
            /*eslint-disable no-loop-func*/
            for (var i = 0; i < that.tabBarItems.length; i++) {
                oButton = new sap.m.Button({
                    text: that.tabBarItems[i].getText(),
                    icon: that.tabBarItems[i].getIcon(),
                    press: function(oEvent) {
                        var buttonClickedIndex, buttonClickedId;
                        buttonClickedId = oEvent.getSource().sId;
                        buttonClickedIndex = document.getElementById(buttonClickedId).dataset.facetViewIndex;
                        buttonClickedIndex = parseInt(buttonClickedIndex, 10);
                        that.chartOnDisplayIndex = buttonClickedIndex;

                        //change the chartOnDisplayIndex value for the current filter selection
                        that.chartOnDisplayIndexByFilterArray[that.facetOnDisplayIndex] = buttonClickedIndex;

                        //reset the main button
                        var btn = that.tabBarItems[that.chartOnDisplayIndex].getIcon();
                        oDropDownButton.setIcon(btn);
                        var asWhat = that.tabBarItems[that.chartOnDisplayIndex].getText();

                        //reset the main button tooltip
                        var displayAs = sap.ushell.resources.i18n.getText('displayAs', [asWhat]);
                        oDropDownButton.setTooltip(displayAs);

                        //change what is displayed in the detail page
                        //var n = (new Date()).getTime();
                        //that.setLastupdated(n); //for refresh, to do refactor so don't need refresh



                        var elemFacetList = $(".sapUshellSearchFacetDialogFacetList")[0];
                        var oFacetList = sap.ui.getCore().byId(elemFacetList.id);
                        if (!oFacetList.getSelectedItem()) {
                            oFacetList.setSelectedItem(oFacetList.getItems()[0]);
                        }
                        oFacetList.fireSelectionChange({
                            listItem: oFacetList.getSelectedItem()
                        });
                        that.controlChartVisibility(that, buttonClickedIndex);

                    }
                });
                oButton.data("facet-view-index", "" + i, true);
                aButtons.push(oButton);

            }
            var oActionSheet = new sap.m.ActionSheet({
                showCancelButton: true,
                buttons: aButtons,
                placement: sap.m.PlacementType.Bottom,
                cancelButtonPress: function() {
                    jQuery.sap.log.info("sap.m.ActionSheet: cancelButton is pressed");
                }
            });
            if ($(".sapUiSizeCompact")[0]) {
                oActionSheet.addStyleClass("sapUiSizeCompact");
            }
            oDropDownButton.addStyleClass("sapUshellSearchFacetDialogTabBarButton");
            var asWhat = that.tabBarItems[that.chartOnDisplayIndex].getText();
            var displayAs = sap.ushell.resources.i18n.getText('displayAs', [asWhat]);
            oDropDownButton.setTooltip(displayAs);
            oDropDownButton.attachPress(function(oEvent) {
                oActionSheet.openBy(this);
            });
            return oDropDownButton;
        },
        //ensure dropdown icons are correct
        resetIcons: function() {
            var that = this;
            var id, allDropdownbuttons, oDropDownButton1, icon, text, toolTip;
            icon = that.tabBarItems[that.chartOnDisplayIndex].getIcon();
            text = that.tabBarItems[that.chartOnDisplayIndex].getText();
            toolTip = sap.ushell.resources.i18n.getText('displayAs', [text]);

            allDropdownbuttons = $('.sapUshellSearchFacetDialogTabBarButton');
            for (var k = 0; k < allDropdownbuttons.length; k++) {
                id = allDropdownbuttons[k].id;
                oDropDownButton1 = sap.ui.getCore().byId(id);
                oDropDownButton1.setIcon(icon);
                oDropDownButton1.setTooltip(toolTip);
            }
        },
        //create an advanced condition
        advancedConditionFactory: function(type) {
            var that = this;
            var oAdvancedCheckBox = new sap.m.CheckBox({
                select: function(oEvent) {
                    if (type === "string" || type === "text") {
                        that.updateCountInfo(oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent());
                    } else {
                        that.updateCountInfo(oEvent.getSource().getParent().getParent().getParent());
                    }
                }
            }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionCheckBox');
            var oInput, oButton, oInputBox, oSelect;
            switch (type) {
                case 'date':
                    oInput = new sap.m.DateRangeSelection({
                        width: '90%',
                        //delimiter: 'to'
                        change: function(oEvent) {
                            that.onDateRangeSelectionChange(oEvent);
                        }
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');
                    break;
                case 'string':
                    oAdvancedCheckBox.setVisible(false);
                    oInputBox = new sap.m.Input({
                        width: '57%',
                        placeholder: sap.ushell.resources.i18n.getText("filterCondition")
                        //                        liveChange: function(oEvent) {
                        //                            that.onAdvancedInputChange(oEvent);
                        //                        }
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');
                    oSelect = new sap.m.Select({
                        width: '40%',
                        items: [
                            new sap.ui.core.Item({
                                text: sap.ushell.resources.i18n.getText("equals"),
                                key: 'eq'
                            }),
                            new sap.ui.core.Item({
                                text: sap.ushell.resources.i18n.getText("beginsWith"),
                                key: 'bw'
                            }),
                            new sap.ui.core.Item({
                                text: sap.ushell.resources.i18n.getText("endsWith"),
                                key: 'ew'
                            }),
                            new sap.ui.core.Item({
                                text: sap.ushell.resources.i18n.getText("contains"),
                                key: 'co'
                            })
                        ]
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionSelect');
                    oInput = new sap.ui.layout.HorizontalLayout({
                        allowWrapping: true,
                        content: [oSelect, oInputBox]
                    });
                    oButton = new sap.m.Button({
                        icon: "sap-icon://sys-cancel",
                        type: sap.m.ButtonType.Transparent,
                        press: function(oEvent) {
                            that.onDeleteButtonPress(oEvent);
                        }
                    });
                    break;
                case 'text':
                    oAdvancedCheckBox.setVisible(false);
                    oInputBox = new sap.m.Input({
                        width: '57%',
                        placeholder: sap.ushell.resources.i18n.getText("filterCondition")
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');
                    oSelect = new sap.m.Select({
                        width: '40%',
                        items: [
                            new sap.ui.core.Item({
                                text: sap.ushell.resources.i18n.getText("containsWords"),
                                key: 'co'
                            })
                            //                            new sap.ui.core.Item({
                            //                                text: sap.ushell.resources.i18n.getText("containsNoWords"),
                            //                                key: 'nco'
                            //                            })
                        ]
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionSelect');
                    oInput = new sap.ui.layout.HorizontalLayout({
                        allowWrapping: true,
                        content: [oSelect, oInputBox]
                    });
                    oButton = new sap.m.Button({
                        icon: "sap-icon://sys-cancel",
                        type: sap.m.ButtonType.Transparent,
                        press: function(oEvent) {
                            that.onDeleteButtonPress(oEvent);
                        }
                    });
                    break;
                case 'number':
                    var oInputBoxLeft = new sap.m.Input({
                        width: '46.5%',
                        liveChange: function(oEvent) {
                            that.onAdvancedNumberInputChange(oEvent);
                        },
                        type: sap.m.InputType.Number
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');
                    var oInputBoxRight = new sap.m.Input({
                        width: '46.5%',
                        liveChange: function(oEvent) {
                            that.onAdvancedNumberInputChange(oEvent);
                        },
                        type: sap.m.InputType.Number
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionInput');
                    var oLabel = new sap.m.Label({
                        text: '...'
                    }).addStyleClass('sapUshellSearchFacetDialogDetailPageConditionLabel');
                    oInput = new sap.ui.layout.HorizontalLayout({
                        allowWrapping: true,
                        content: [oInputBoxLeft, oLabel, oInputBoxRight]
                    });
                    break;
                default:
                    break;

            }

            var oAdvancedCondition = new sap.ui.layout.HorizontalLayout({
                allowWrapping: true,
                content: [oAdvancedCheckBox, oInput, oButton]
            }).addStyleClass('sapUshellSearchFacetDialogDetailPageCondition');
            return oAdvancedCondition;
        },
        //event: select chart elements
        onDetailPageSelectionChangeCharts: function(oEvent) {
            var that = this;
            var cnt = 0;
            var context, model, data, isSelected, becomesSelected, oSelectedItem, sSelectedBindingPath, oBindingObject, sPath, oMasterPageList;
            var ar, oNode, i, oMasterPageListItem;
            if (oEvent.getSource) {
                context = oEvent.getSource().getBindingContext();
                model = context.getModel();
                data = context.getObject();
                isSelected = data.selected;
                becomesSelected = isSelected ? false : true;
                //var filterCondition = data.filterCondition;

                //first set the selected value in model

                //var oSelectedItem = oEvent.mParameters.listItem;
                oSelectedItem = oEvent.getSource();
                sSelectedBindingPath = oSelectedItem.getBindingContext().sPath + "/selected";
                //oSelectedItem.getBindingContext().oModel.setProperty(sSelectedBindingPath, oSelectedItem.getSelected());
                model.setProperty(sSelectedBindingPath, becomesSelected);

                //update aFilters
                oBindingObject = oSelectedItem.getBindingContext().getObject();
                if (becomesSelected) {
                    //that.getModel().addFilter(oBindingObject);
                    model.addFilter(oBindingObject);
                } else {
                    //that.getModel().removeFilter(oBindingObject);
                    model.removeFilter(oBindingObject);
                }

                //count the number of selected items in the model
                sPath = sSelectedBindingPath.replace(/\/items.+/, ''); //"/facetDialog/1/items/11/selected"
                sPath += "/items";
                ar = model.getProperty(sPath);
                cnt = 0;
                for (i = 0; i < ar.length; i++) {
                    oNode = ar[i];
                    if (oNode.selected === true) {
                        cnt++;
                    }
                }
            } else {
                //only for pie chart
                //var listContainers = that.getListContainersForDetailPage();
                //var oListContainer = listContainers[1];
                //var contents = oListContainer.getContent();
                //var oList = contents[0];
                //var oBarChart = contents[1];
                //var oPieChart = contents[2];

                data = oEvent.dataObject;
                isSelected = data.selected;
                becomesSelected = isSelected ? false : true;
                cnt = oEvent.cnt;
                //model = that.getModel();
                model = oEvent.model;
                if (isSelected) {
                    //that.getModel().addFilter(data);

                    //oList.getModel().addFilter(data);
                    //oList.invalidate();

                    //oBarChart.getModel().addFilter(data);

                    //oPieChart.getModel().addFilter(data);

                    model.addFilter(data);
                    //model.addFilterCondition(data.filterCondition, false);
                } else {
                    //that.getModel().removeFilter(data);

                    //oList.getModel().removeFilter(data);
                    //oList.invalidate();

                    //oBarChart.getModel().removeFilter(data);
                    //oPieChart.getModel().removeFilter(data);


                    model.removeFilter(data);
                    //model.removeFilterCondition(data.filterCondition, false);
                }
            }

            //update the count info in masterPageList
            oMasterPageList = that.getFacetList();
            oMasterPageListItem = oMasterPageList.getSelectedItem();
            if (!oMasterPageListItem) {
                oMasterPageListItem = oMasterPageList.getItems()[0];
            }
            oMasterPageListItem.setCounter(cnt);
            //if (oEvent.getSource) {
            //    that.setCurrentSelectionCount(cnt); //attempt to get a refresh
            //}

        },
        //event: select listItems in detailPages
        onDetailPageSelectionChange: function(oEvent) {
            var that = this;

            //first set the selected value in model
            var oSelectedItem = oEvent.mParameters.listItem;
            var sSelectedBindingPath = oSelectedItem.getBindingContext().sPath + "/selected";
            oSelectedItem.getBindingContext().oModel.setProperty(sSelectedBindingPath, oSelectedItem.getSelected());

            //update aFilters
            var oBindingObject = oSelectedItem.getBindingContext().getObject();
            if (oSelectedItem.getSelected()) {
                that.getModel().addFilter(oBindingObject);
            } else {
                that.getModel().removeFilter(oBindingObject);
            }

            //update the count info in masterPageList
            var oList = oEvent.oSource;
            var oDetailPage;
            if (oList.data('dataType') === "string") {
                oDetailPage = oList.getParent().getParent().getParent().getParent().getParent().getParent();
            } else {
                oDetailPage = oList.getParent().getParent();
            }
            that.updateCountInfo(oDetailPage);

            //deselect setting check box
            var oSettings = oList.getParent().getParent().getContent()[that.settingContainerPosition];
            var oCheckbox = oSettings.getContent()[that.showOnTopCheckBoxPosition];
            var oSelect = oSettings.getContent()[that.sortingSelectPosition];
            if (oCheckbox.getSelected()) {
                oCheckbox.setSelected(false);
                oSelect.setSelectedKey("notSorted");
            }
            if (oList.getSelectedContexts().length > 0) {
                oCheckbox.setEnabled(true);
            } else {
                oCheckbox.setEnabled(false);
            }
        },

        //event: search in detailPages
        onSearchFieldLiveChange: function(oEvent) {
            var that = this;
            var sFilterTerm = oEvent.getSource().getValue();
            var oSelectedItem = that.getFacetList().getSelectedItem();
            that.updateDetailPage(oSelectedItem, sFilterTerm);
        },

        //event: click setting button
        onSettingButtonPress: function(oEvent) {
            var that = this;
            var bPressed = oEvent.oSource.getPressed();
            var oSettings = oEvent.oSource.getParent().getParent().getContent()[that.settingContainerPosition];
            var oSettingSeparator = oEvent.oSource.getParent().getParent().getContent()[that.settingSeparatorPosition];
            var oListContainer = oEvent.oSource.getParent().getParent().getContent()[that.attributeListPosition];
            if (bPressed) {
                oSettings.setVisible(true);
                oSettingSeparator.setShowSeparators(sap.m.ListSeparators.All);
                oListContainer.setHeight('83%');
            } else {
                oSettings.setVisible(false);
                oSettingSeparator.setShowSeparators(sap.m.ListSeparators.None);
                oListContainer.setHeight('98%');
            }
        },

        //event: change select box in settings
        onSelectChange: function(oEvent) {
            var that = this;
            that.sortingAttributeList(oEvent.oSource.getParent().getParent());
        },

        //event: select check box in settings
        onCheckBoxSelect: function(oEvent) {
            var that = this;
            that.sortingAttributeList(oEvent.oSource.getParent().getParent());
        },

        //event: date range selection box changed
        onDateRangeSelectionChange: function(oEvent) {
            var that = this;
            var oDateRangeSelection = oEvent.getSource();
            var oAdvancedCondition = oDateRangeSelection.getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
                oAdvancedCheckBox.setSelected(true);
                that.insertNewAdvancedCondition(oAdvancedCondition, "date");
                that.updateCountInfo(oAdvancedCondition.getParent().getParent());
            } else {
                oAdvancedCheckBox.setSelected(false);
            }
        },

        //event: advanced string input box changed
        onAdvancedInputChange: function(oEvent) {
            var that = this;
            var oInput = oEvent.getSource();
            var oAdvancedCondition = oInput.getParent().getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oInput.getValue()) {
                oAdvancedCheckBox.setSelected(true);
                that.insertNewAdvancedCondition(oAdvancedCondition, "string");
                that.updateCountInfo(oAdvancedCondition.getParent().getParent().getParent().getParent().getParent());
            } else {
                oAdvancedCheckBox.setSelected(false);
            }
        },

        //event: advanced number input box changed
        onAdvancedNumberInputChange: function(oEvent) {
            var that = this;
            var oInput = oEvent.getSource();
            var oAdvancedCondition = oInput.getParent().getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oInput.getParent().getContent()[0].getValue() && oInput.getParent().getContent()[2].getValue()) {
                oAdvancedCheckBox.setSelected(true);
                that.insertNewAdvancedCondition(oAdvancedCondition, "number");
                that.updateCountInfo(oAdvancedCondition.getParent().getParent());
            } else {
                oAdvancedCheckBox.setSelected(false);
            }
        },

        //event: advanced condition delete button pressed
        onDeleteButtonPress: function(oEvent) {
            var that = this;
            var oAdvancedCondition = oEvent.getSource().getParent();
            that.deleteAdvancedCondition(oAdvancedCondition);
        },

        //event: advanced condition plus button pressed
        onPlusButtonPress: function(oEvent, type) {
            var that = this;
            var oAdvancedContainer = oEvent.getSource().getParent();
            var oNewAdvancedCondition = that.advancedConditionFactory(type);
            var insertIndex = oAdvancedContainer.getAggregation("content").length - 1;
            oAdvancedContainer.insertAggregation("content", oNewAdvancedCondition, insertIndex);
        },

        //event: click ok button
        onOkClick: function(oEvent) {
            var that = this;
            var oModel = that.getModel();
            var oSearchModel = that.getModel('searchModel');
            oSearchModel.resetFilterConditions(false);
            var aDetailPages = that.oSplitContainer.getDetailPages();

            //no advanced filter
            for (var m = 0; m < oModel.aFilters.length; m++) {
                var item = oModel.aFilters[m];
                if (!item.advanced) {
                    oSearchModel.addFilterCondition(item.filterCondition, false);
                }
            }
            //advanced filter
            for (var i = 0; i < aDetailPages.length; i++) {
                if (that.getFacetList().getItems()[i]) {
                    that.applyAdvancedCondition(aDetailPages[i], that.getFacetList().getItems()[i].getBindingContext().getObject(), oSearchModel);
                }
            }
            oSearchModel.filterChanged = true;
            oSearchModel._firePerspectiveQuery();
        },

        //help function: get the facet list in masterPage
        getFacetList: function() {
            var that = this;
            return that.oSplitContainer.getMasterPages()[0].getContent()[this.facetListPosition];
        },

        //set count info in master page facet list
        updateCountInfo: function(oDetailPage) {
            var that = this;
            //            var oList = oDetailPage.getContent()[that.attributeListPosition].getContent()[0];
            //            var aContexts = oList.getSelectedContexts();

            var oMasterPageList = that.getFacetList();
            var oMasterPageListItem = oMasterPageList.getSelectedItem();
            if (!oMasterPageListItem) {
                oMasterPageListItem = oMasterPageList.getItems()[0];
            }
            var sMasterBindingPath = oMasterPageListItem.getBindingContext().sPath;
            var sDimension = oMasterPageListItem.getBindingContext().oModel.getProperty(sMasterBindingPath).dimension;
            var aFilters = that.getModel().aFilters;
            var countNormalCondition = 0;
            for (var j = 0; j < aFilters.length; j++) {
                if (!aFilters[j].advanced && aFilters[j].facetAttribute === sDimension) {
                    countNormalCondition++;
                }
            }

            var sDataType = that.getAttributeDataType(oMasterPageListItem.getBindingContext().oModel.getProperty(sMasterBindingPath).dataType);
            var oAdvancedContainer, conditionLength;
            if (sDataType === "string" || sDataType === "text") {
                if (!oDetailPage.getContent()[0].getItems) {
                    return;
                }
                oAdvancedContainer = oDetailPage.getContent()[0].getItems()[1].getContent()[0]; //doesn't work sometimes avr
                conditionLength = oAdvancedContainer.getContent().length - 1; //doesn't work sometimes avr
            } else {
                oAdvancedContainer = oDetailPage.getContent()[that.advancedPosition];
                conditionLength = oAdvancedContainer.getContent().length;
            }
            var countAdvancedCondition = 0;
            for (var i = 0; i < conditionLength; i++) {
                var oConditionLayout = oAdvancedContainer.getContent()[i];
                var oCheckbox = oConditionLayout.getContent()[0];
                if (oCheckbox.getSelected()) {
                    countAdvancedCondition++;
                }
            }

            var sFacetType = oMasterPageListItem.getBindingContext().oModel.getProperty(sMasterBindingPath).facetType;
            if (sFacetType === "attribute") {
                //                var count = aContexts.length + countAdvancedCondition;
                var count = countNormalCondition + countAdvancedCondition;
                if (count > 0) {
                    oMasterPageListItem.setCounter(count);
                } else {
                    oMasterPageListItem.setCounter(null);
                }
            }
        },

        //helper function: sorting the attribute list
        sortingAttributeList: function(oDetailPage) {
            var that = this;
            var oSettings = oDetailPage.getContent()[that.settingContainerPosition];
            var oSelect = oSettings.getContent()[that.sortingSelectPosition];
            var oCheckBox = oSettings.getContent()[that.showOnTopCheckBoxPosition];
            var oList = oDetailPage.getContent()[that.attributeListPosition].getContent()[0];
            var oBinding = oList.getBinding("items");
            var aSorters = [];

            if (oCheckBox.getSelected()) {
                aSorters.push(new sap.ui.model.Sorter("selected", true, false));
            }

            switch (oSelect.getSelectedKey()) {
                case "sortName":
                    aSorters.push(new sap.ui.model.Sorter("label", false, false));
                    break;
                case "sortCount":
                    aSorters.push(new sap.ui.model.Sorter("value", true, false));
                    aSorters.push(new sap.ui.model.Sorter("label", false, false));
                    break;
                default:
                    break;
            }

            oBinding.sort(aSorters);
        },

        //helper function: determinate the attribute list data type
        getAttributeDataType: function(dataType) {
            switch (dataType) {
                case "Double":
                    return "number";
                case "Timestamp":
                    return "date";
                case "String":
                    return "string";
                case "Text":
                    return "text";
                default:
                    return "string";
            }
        },

        //helper function: insert new advanced condition
        insertNewAdvancedCondition: function(oAdvancedCondition, type) {
            var that = this;
            var oAdvancedContainer = oAdvancedCondition.getParent();
            var oNewAdvancedCondition = that.advancedConditionFactory(type);
            if (type === "string" || type === "text") {
                var insertIndex = oAdvancedContainer.getAggregation("content").length - 1;
                oAdvancedContainer.insertAggregation("content", oNewAdvancedCondition, insertIndex);
            } else {
                var index = oAdvancedContainer.indexOfAggregation("content", oAdvancedCondition);
                if (index === (oAdvancedContainer.getAggregation("content").length - 1)) {
                    oAdvancedContainer.addContent(oNewAdvancedCondition);
                }
            }
        },

        deleteAdvancedCondition: function(oAdvancedCondition) {
            var that = this;
            var oAdvancedContainer = oAdvancedCondition.getParent();
            var oDetailPage = oAdvancedCondition.getParent().getParent().getParent().getParent().getParent();
            oAdvancedContainer.removeAggregation("content", oAdvancedCondition);
            that.updateCountInfo(oDetailPage);
        },

        //update advanced conditions after detail page factory
        initiateAdvancedConditions: function(oAdvancedContainer, aItems, type) {
            var that = this;
            var aConditions, oConditionLayout, oCheckBox, oInput;
            for (var i = aItems.length; i > 0; i--) {
                var item = aItems[i - 1];
                if (item.advanced) {

                    aConditions = oAdvancedContainer.getContent();
                    if (type === "string" || type === "text") {
                        oConditionLayout = aConditions[aConditions.length - 2];
                    } else {
                        oConditionLayout = aConditions[aConditions.length - 1];
                    }

                    oCheckBox = oConditionLayout.getContent()[0];
                    oCheckBox.setSelected(true);
                    oInput = oConditionLayout.getContent()[1];
                    if (type === "number") {
                        var oInputBoxLeft = oInput.getContent()[0];
                        var oInputBoxRight = oInput.getContent()[2];
                        if (item.filterCondition.conditions) {
                            for (var j = 0; j < item.filterCondition.conditions.length; j++) {
                                var condition = item.filterCondition.conditions[j];
                                if (condition.operator === ">=") {
                                    oInputBoxLeft.setValue(condition.value);
                                }
                                if (condition.operator === "<=") {
                                    oInputBoxRight.setValue(condition.value);
                                }
                            }
                        }
                    } else if (type === "string") {
                        var str = item.label;
                        if ((str.charAt(0) === "*") && (str.charAt(str.length - 1) === "*")) {
                            oInput.getContent()[0].setSelectedKey('co');
                            str = str.substring(1, str.length - 1);
                        } else if ((str.charAt(0) === "*")) {
                            oInput.getContent()[0].setSelectedKey('ew');
                            str = str.substring(1);
                        } else if ((str.charAt(str.length - 1) === "*")) {
                            oInput.getContent()[0].setSelectedKey('bw');
                            str = str.substring(0, str.length - 1);
                        }
                        oInput.getContent()[1].setValue(str);
                    } else if (type === "text") {
                        var text = item.label;
                        if ((text.charAt(0) === "*") && (text.charAt(text.length - 1) === "*")) {
                            oInput.getContent()[0].setSelectedKey('co');
                            text = text.substring(1, text.length - 1);
                        }
                        oInput.getContent()[1].setValue(text);
                    } else {
                        oInput.setValue(item.label);
                    }
                    that.insertNewAdvancedCondition(oConditionLayout, type);
                    that.getModel().changeFilterAdvaced(item, true);
                }
            }
            oAdvancedContainer.data('initial', false);
        },

        //helper function: collect all filters in dialog for single facet call
        applyChartQueryFilter: function(excludedIndex) {
            var that = this;

            that.getModel().resetChartQueryFilterConditions();

            var aDetailPages = that.oSplitContainer.getDetailPages();
            for (var i = 0; i < aDetailPages.length; i++) {
                if (i === excludedIndex || aDetailPages[i].getContent().length === 0 || !aDetailPages[i].getContent()[0].getItems) { //avr
                    continue;
                }

                var oList;
                if (!aDetailPages[i].getContent()[that.attributeListPosition]) {
                    oList = aDetailPages[i].getContent()[0].getItems()[0].getContent()[0].getContent()[that.attributeListPosition].getContent()[0];
                } else {
                    oList = aDetailPages[i].getContent()[that.attributeListPosition].getContent()[0];
                }
                for (var j = 0; j < oList.getItems().length; j++) {
                    var oListItem = oList.getItems()[j];
                    var oListItemBindingObject = oListItem.getBindingContext().getObject();
                    var filterCondition = oListItemBindingObject.filterCondition;
                    if (filterCondition.attribute || filterCondition.conditions) {
                        if (oListItem.getSelected()) {
                            if (!that.getModel().chartQuery.getFilter().hasFilterCondition(filterCondition)) {
                                that.getModel().chartQuery.addFilterCondition(filterCondition);
                            }
                        }
                    }
                }


                that.applyAdvancedCondition(aDetailPages[i], that.getFacetList().getItems()[i].getBindingContext().getObject(), that.getModel().chartQuery);
            }
        },

        //helper function: collect all advanced filter condition in a detail page
        applyAdvancedCondition: function(oDetailPage, oFacetItemBinding, oAppliedObject) {
            var that = this;

            var oAdvancedContainer, sDataType, oAdvancedConditionList, k, oAdvancedCondition, oAdvancedCheckBox, fromCondition, toCondition, oConditionGroup;
            if (oDetailPage.getContent()[that.advancedPosition]) {
                oAdvancedContainer = oDetailPage.getContent()[that.advancedPosition];
                sDataType = oAdvancedContainer.data('dataType');
                oAdvancedConditionList = oDetailPage.getContent()[that.advancedPosition].getContent();
                switch (sDataType) {
                    case 'date':
                        for (k = 0; k < oAdvancedConditionList.length; k++) {
                            oAdvancedCondition = oAdvancedConditionList[k];
                            oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
                            var oDateRangeSelection = oAdvancedCondition.getContent()[1];
                            if (oAdvancedCheckBox.getSelected() && oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
                                //format: 2015-07-14 00:00:00.0000000
                                var oFormat = {
                                    "pattern": "yyyy-MM-dd HH:mm:ss.SSSSSSS",
                                    "UTC": true
                                };
                                var oSecondFormat = {
                                    //                                    "pattern": "yyyy-MM-dd 23:59:59.9999999",
                                    "pattern": "yyyy-MM-dd HH:mm:ss.SSSSSSS",
                                    "UTC": true
                                };
                                var dateValue = sap.ui.core.format.DateFormat.getDateTimeInstance(oFormat).format(oDateRangeSelection.getDateValue());
                                var secondDateValue = sap.ui.core.format.DateFormat.getDateTimeInstance(oSecondFormat).format(new Date(oDateRangeSelection.getSecondDateValue().getTime() + 86400000 - 1));
                                fromCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: ">=",
                                    value: dateValue,
                                    label: dateValue
                                });
                                toCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: "<=",
                                    value: secondDateValue,
                                    label: secondDateValue
                                });
                                oConditionGroup = that.getModel().sina.createFilterConditionGroup();
                                oConditionGroup.label = oDateRangeSelection.getValue();
                                oConditionGroup.conditions[0] = fromCondition;
                                oConditionGroup.conditions[1] = toCondition;
                                oAppliedObject.addFilterCondition(oConditionGroup, false);
                            }
                        }
                        break;
                    case 'number':
                        for (k = 0; k < oAdvancedConditionList.length; k++) {
                            oAdvancedCondition = oAdvancedConditionList[k];
                            oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
                            var oAdvancedInputLeft = oAdvancedCondition.getContent()[1].getContent()[0];
                            var oAdvancedInputRight = oAdvancedCondition.getContent()[1].getContent()[2];
                            var oAdvancedLebel = oAdvancedCondition.getContent()[1].getContent()[1];
                            if (oAdvancedCheckBox.getSelected() && oAdvancedInputLeft.getValue() && oAdvancedInputRight.getValue()) {
                                fromCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: ">=",
                                    value: oAdvancedInputLeft.getValue(),
                                    label: oAdvancedInputLeft.getValue()
                                });
                                toCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: "<=",
                                    value: oAdvancedInputRight.getValue(),
                                    label: oAdvancedInputRight.getValue()
                                });
                                oConditionGroup = that.getModel().sina.createFilterConditionGroup();
                                oConditionGroup.label = oAdvancedInputLeft.getValue() + oAdvancedLebel.getText() + oAdvancedInputRight.getValue();
                                oConditionGroup.conditions[0] = fromCondition;
                                oConditionGroup.conditions[1] = toCondition;
                                oAppliedObject.addFilterCondition(oConditionGroup, false);
                            }
                        }
                        break;
                    default:
                        break;
                }
            } else {
                oAdvancedContainer = oDetailPage.getContent()[0].getItems()[1].getContent()[0];
                sDataType = oAdvancedContainer.data('dataType');
                oAdvancedConditionList = oAdvancedContainer.getContent();
                var oAdvancedSelect, oAdvancedInput, sConditionTerm, oFilterCondition;
                switch (sDataType) {
                    case 'string':
                        for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
                            oAdvancedCondition = oAdvancedConditionList[k];
                            //                            oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
                            oAdvancedSelect = oAdvancedCondition.getContent()[1].getContent()[0];
                            oAdvancedInput = oAdvancedCondition.getContent()[1].getContent()[1];
                            switch (oAdvancedSelect.getSelectedKey()) {
                                case 'eq':
                                    sConditionTerm = oAdvancedInput.getValue();
                                    break;
                                case 'ew':
                                    sConditionTerm = "*" + oAdvancedInput.getValue();
                                    break;
                                case 'bw':
                                    sConditionTerm = oAdvancedInput.getValue() + "*";
                                    break;
                                case 'co':
                                    sConditionTerm = "*" + oAdvancedInput.getValue() + "*";
                                    break;
                                default:
                                    break;
                            }
                            if (oAdvancedInput.getValue()) {
                                oFilterCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: "=",
                                    value: sConditionTerm,
                                    label: sConditionTerm
                                });
                                oAppliedObject.addFilterCondition(oFilterCondition, false);
                            }
                        }
                        break;
                    case 'text':
                        for (k = 0; k < oAdvancedConditionList.length - 1; k++) {
                            oAdvancedCondition = oAdvancedConditionList[k];
                            oAdvancedSelect = oAdvancedCondition.getContent()[1].getContent()[0];
                            oAdvancedInput = oAdvancedCondition.getContent()[1].getContent()[1];
                            sConditionTerm = oAdvancedInput.getValue();
                            var sOperator;
                            switch (oAdvancedSelect.getSelectedKey()) {
                                case 'co':
                                    sOperator = "=";
                                    break;
                                case 'nco':
                                    sOperator = "!=";
                                    break;
                                default:
                                    break;
                            }
                            if (oAdvancedInput.getValue()) {
                                oFilterCondition = that.getModel().sina.createFilterCondition({
                                    attribute: oFacetItemBinding.dimension,
                                    attributeLabel: oFacetItemBinding.title,
                                    operator: sOperator,
                                    value: sConditionTerm,
                                    label: sConditionTerm
                                });
                                oAppliedObject.addFilterCondition(oFilterCondition, false);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        //this function below is only for charts //avr
        updateDetailPageCharts: function(aItems, oModel) {
            var that = this;
            if (that.bShowCharts === false) {
                return;
            }


            that.aItemsForBarChart = aItems;

            var listContainers = that.getListContainersForDetailPage();
            var oListContainer = listContainers[1];
            var contents = oListContainer.getContent();

            //update bar chart - no longer required since now use native barchart, not the searchFacetBarChart in small facets
            if (contents && that.chartOnDisplayIndex === 1) {

                //update bar chart
                //var oBarChart = contents[1];
                //oBarChart.setAItems(aItems);
                //oBarChart.setModel(oModel);
                //oListContainer.removeContent(oBarChart);
                //oChartPlaceholder1 = that.getBarChartPlaceholder();
                //oListContainer.addContent(oChartPlaceholder1);
            }

            //update pie chart
            if (contents && that.chartOnDisplayIndex === 2) {
                var oPieChart = contents[2];
                var elemChart = listContainers[5];
                var relevantContainerHeight = listContainers[2];
                relevantContainerHeight = 0.9 * relevantContainerHeight;

                var piechartOptions = {};
                piechartOptions.relevantContainerHeight = relevantContainerHeight;
                piechartOptions.oSearchFacetDialog = that;

                var oModel1 = new sap.ui.model.json.JSONModel();
                oModel1.setData(aItems);

                $("#" + elemChart.id).empty(); //elemChart.innerHTML = "";
                oPieChart.directUpdate(aItems, elemChart, oModel1, piechartOptions);
            }

            //take care to adjsut visability of pie and bar chart
            var elem, $elem;
            //pie chart
            if (contents && that.chartOnDisplayIndex !== 2) {
                //hide pie chart if exits
                elem = listContainers[0].firstChild.children[2];
                $elem = $("#" + elem.id);
                $elem.css("display", "none");
            }
            //bar chart
            if (contents && that.chartOnDisplayIndex !== 1) {
                //hide pie chart if exits
                elem = listContainers[0].firstChild.children[1];
                $elem = $("#" + elem.id);
                $elem.css("display", "none");
            }

        },

        //this is for the button that toggles the charts but also calls updateDetailPageCharts() for pie chart //avr
        controlChartVisibility: function(oControl, chartIndexToShow) {
            //return;
            var that = this;
            var elem, $elem;
            if (that.bShowCharts === false) {
                return;
            }
            var listContainers = oControl.getListContainersForDetailPage();
            var oListContainer = listContainers[1];
            var contents = oListContainer.getContent();
            for (var i = 0; i < contents.length; i++) {
                elem = listContainers[0].firstChild.children[i];
                $elem = $("#" + elem.id);
                if (i !== chartIndexToShow) {
                    $elem.css("display", "none");
                } else {
                    $elem.css("display", "block");
                }
            }
            if (chartIndexToShow === 2) {
                var aItems = that.aItemsForBarChart;
                var oModel = that.getModel();
                that.updateDetailPageCharts(aItems, oModel);


            }
            if (chartIndexToShow === 2) {
                oListContainer.setVertical(false);
            } else {
                oListContainer.setVertical(true);
            }

            var oSortButton = listContainers[6];
            if (oSortButton) {
                var elemSortButton = $("#" + oSortButton.sId);
                if (chartIndexToShow === 0) {
                    elemSortButton.css("display", "block");
                    //oSortButton.setVisible(true);
                } else {
                    elemSortButton.css("display", "none");
                    //oSortButton.setVisible(false);
                }
            }

        },
        hideSelectively: function(oEvent, oControl, chartIndex) {
            //return;
            var elem = $("#" + oEvent.srcControl.sId);
            var chartIndexToShow = oControl.chartOnDisplayIndex;
            var listContainers = oControl.getListContainersForDetailPage();
            var oListContainer = listContainers[1];
            //var contents = oListContainer.getContent();

            if (chartIndexToShow !== undefined) {
                if (oControl.chartOnDisplayIndex !== chartIndex) {
                    elem.css("display", "none");
                    //contents[chartIndex].setVisible(false);//don't use!
                } else {
                    elem.css("display", "block");
                    //contents[chartIndex].setVisible(true);//don't use!
                }
            } else {
                elem.css("display", "block");
                //contents[chartIndex].setVisible(true);//don't use!
            }



            if (chartIndexToShow === 2) {
                oListContainer.setVertical(false);
            } else {
                oListContainer.setVertical(true);
            }

            var oSortButton = listContainers[6];
            if (oSortButton) {
                var elemSortButton = $("#" + oSortButton.sId);
                if (chartIndexToShow === 0) {
                    elemSortButton.css("display", "block");
                    //oSortButton.setVisible(true);
                } else {
                    elemSortButton.css("display", "none");
                    //oSortButton.setVisible(false);
                }
            }

        },
        getListContainersForDetailPage: function() {
            var relevantContainerIndex = 0;
            var relevantContainerHeight = 440;
            var searchFacetLargeChartContainer = $(".searchFacetLargeChartContainer");
            for (var i = 0; i < searchFacetLargeChartContainer.length; i++) {
                if (searchFacetLargeChartContainer[i].clientHeight > 0) {
                    relevantContainerHeight = searchFacetLargeChartContainer[i].offsetParent.offsetParent.offsetParent.clientHeight;
                    relevantContainerIndex = i;
                    break;
                }
            }
            var chartParent = $(".searchFacetLargeChartContainer")[relevantContainerIndex];
            var oListContainer = sap.ui.getCore().byId(chartParent.id);

            var subheaderToolbar, oSubheaderToolbar, oSortButton;
            try {
                subheaderToolbar = $(".sapUshellSearchFacetDialogSubheaderToolbar")[relevantContainerIndex];
                oSubheaderToolbar = sap.ui.getCore().byId(subheaderToolbar.id);
                oSortButton = oSubheaderToolbar.getContent()[1];
            } catch (e) {
                //empty
            }

            return [chartParent,
                oListContainer,
                relevantContainerHeight,
                chartParent.firstChild.children[0],
                chartParent.firstChild.children[1],
                chartParent.firstChild.children[2],
                oSortButton
            ];
        },

        /*
         *******************************************************
         *******************************************************
         *******************************************************
         *********** start updateDetailPage *************
         *******************************************************
         *******************************************************
         *******************************************************
         */
        //according masterPageListItem, send a single facet pespective call, update the detail page
        updateDetailPage: function(oListItem, sFilterTerm) {
            var that = this;

            //var oModel = oListItem.getBindingContext().oModel;
            var oModel = that.getModel();
            var oSearchModel = that.getModel('searchModel');
            var sBindingPath = oListItem.getBindingContext().sPath;
            var oSelectedListItem = oModel.getProperty(sBindingPath);
            var sDataType = that.getAttributeDataType(oSelectedListItem.dataType);

            var index = that.getFacetList().indexOfAggregation("items", oListItem);
            var oDetailPage = that.oSplitContainer.getDetailPages()[index];
            var oDetailPageAttributeList, oAdvancedContainer, oSettings;
            if (sDataType === "string" || sDataType === "text") {
                oDetailPageAttributeList = oDetailPage.getContent()[0].getItems()[0].getContent()[0].getContent()[that.attributeListPosition].getContent()[0];
                oAdvancedContainer = oDetailPage.getContent()[0].getItems()[1].getContent()[0];
                oSettings = oDetailPage.getContent()[0].getItems()[0].getContent()[0].getContent()[that.settingContainerPosition];
            } else {
                oDetailPageAttributeList = oDetailPage.getContent()[that.attributeListPosition].getContent()[0];
                oAdvancedContainer = oDetailPage.getContent()[that.advancedPosition];
                oSettings = oDetailPage.getContent()[that.settingContainerPosition];
            }
            var sNaviId = oDetailPage.getId();
            that.oSplitContainer.toDetail(sNaviId, "show");
            that.resetIcons();

            oDetailPageAttributeList.setBusy(true);

            var properties = {
                sAttribute: oSelectedListItem.dimension,
                sBindingPath: sBindingPath
            };

            //apply the facet query filter, except itself
            //            that.applyFacetQueryFilter(index);
            that.applyChartQueryFilter(index);

            //add the filter term in search field
            if (sFilterTerm) {
                var filterCondition = oModel.sina.createFilterCondition({
                    attribute: oSelectedListItem.dimension,
                    operator: "=",
                    value: sFilterTerm + "*"
                });
                oModel.chartQuery.addFilterCondition(filterCondition);
                // init search field when the update is triggered by outside
            } else if (sFilterTerm === undefined) {
                if (sDataType === "string" || sDataType === "text") {
                    oDetailPage.getContent()[0].getItems()[0].getContent()[0].getSubHeader().getContent()[0].setValue('');
                }
                /*else {
                                oDetailPage.getSubHeader().getContent()[0].setValue('');
                            }*/
            }

            oModel.chartQuery.setSearchTerms(oSearchModel.getSearchBoxTerm());

            //send the single call
            oModel.facetDialogSingleCall(properties).done(function() {
                var aItems = oModel.getProperty(oDetailPage.getBindingContext().sPath).items;
                //initiate advanced container
                if (oAdvancedContainer.data('initial')) {

                    that.initiateAdvancedConditions(oAdvancedContainer, aItems, oAdvancedContainer.data('dataType'));
                }

                //enable setting check box
                var oCheckbox = oSettings.getContent()[that.showOnTopCheckBoxPosition];
                if (oDetailPageAttributeList.getSelectedContexts().length > 0) {
                    oCheckbox.setEnabled(true);
                }

                //update detail page list items select
                that.updateDetailPageListItemsSelected(oDetailPageAttributeList, oAdvancedContainer);

                //update possible charts avr
                that.updateDetailPageCharts(aItems, oModel);



            });
        },

        /*
         *******************************************************
         *******************************************************
         *******************************************************
         ********************* end updateDetailPage ************
         *******************************************************
         *******************************************************
         *******************************************************
         */
        //callback function: update selected property after model changed
        updateDetailPageListItemsSelected: function(oDetailPageAttributeList, oAdvancedContainer) {
            var that = this;

            that.updateDetailPageListItemsSelectedForListView(oDetailPageAttributeList, oAdvancedContainer);
        },
        //callback function: update selected property after model changed
        updateDetailPageListItemsSelectedForListView: function(oDetailPageAttributeList, oAdvancedContainer) {
            var that = this;
            //            var oAdvancedContainer = oDetailPageAttributeList.getParent().getParent().getContent()[that.advancedPosition];
            var sDataType = oAdvancedContainer.data('dataType');

            for (var j = 0; j < oDetailPageAttributeList.getItems().length; j++) {
                var oListItem = oDetailPageAttributeList.getItems()[j];
                var oListItemBindingObject = oListItem.getBindingContext().getObject();
                if (oDetailPageAttributeList.getModel().hasFilter(oListItemBindingObject)) {
                    oListItem.setSelected(true);
                    oDetailPageAttributeList.getModel().changeFilterAdvaced(oListItemBindingObject, false);
                    that.removeAdvancedCondition(oAdvancedContainer, oListItem, sDataType);
                } else {
                    oListItem.setSelected(false);
                }
                //update model selected property
                var sSelectedBindingPath = oListItem.getBindingContext().sPath + "/selected";
                oListItem.getBindingContext().oModel.setProperty(sSelectedBindingPath, oListItem.getSelected());
            }
            that.sortingAttributeList(oDetailPageAttributeList.getParent().getParent());
            oDetailPageAttributeList.setBusy(false);
            if (sDataType === "date") {
                oDetailPageAttributeList.focus();
            }
        },

        //remove duplicate advanced condition
        removeAdvancedCondition: function(oAdvancedContainer, oListItem, type) {
            var aConditions = oAdvancedContainer.getContent();
            var oConditionLayout, oInputBox, index;

            if (type === "string" || type === "text") {
                for (var i = 0; i < aConditions.length - 1; i++) {
                    oConditionLayout = aConditions[i];
                    oInputBox = oConditionLayout.getContent()[1].getContent()[1];
                    if (oInputBox.getProperty('value')) {
                        var value = oInputBox.getValue();
                        var oListItemBindingObject = oListItem.getBindingContext().getObject();
                        if (value === oListItemBindingObject.filterCondition.value) {
                            index = i;
                            break;
                        }
                    }
                }

            }

            oAdvancedContainer.removeContent(index);
        }

    });
})();
