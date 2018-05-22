// iteration 0 ok
/* global jQuery, sap, window, document */
(function() {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchFieldGroup');
    var SearchFieldGroup = sap.ushell.renderers.fiori2.search.controls.SearchFieldGroup;
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchModel");
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchShellHelper');
    var module = sap.ushell.renderers.fiori2.search.SearchShellHelper = {};
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    var searchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;

    jQuery.extend(module, {

        init: function() {
            var that = this;

            // member fields
            that.oShell = sap.ui.getCore().byId('shell-header');

            // create search model
            that.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();

            // create controls
            that.oSearchFieldGroup = new SearchFieldGroup("searchFieldInShell");
            that.oSearchFieldGroup.setModel(that.oModel);
            that.oShell.setSearch(that.oSearchFieldGroup);

            that.oSearchInput = that.oSearchFieldGroup.getAggregation("input");
            that.oSearchSelect = that.oSearchFieldGroup.getAggregation("select");
            that.oSearchSelect.setTooltip(sap.ushell.resources.i18n.getText("searchInTooltip"));
            that.oSearchButton = that.oSearchFieldGroup.getAggregation("button");
            that.oSearchButton.setType(sap.m.ButtonType.Transparent);

            // init search input field with model value
            that.oSearchInput.setValue(that.oModel.getSearchBoxTerm());
            //that.oSearchInput.setMaxSuggestionWidth("100%");


            // search select
            var isSelectStyleSet = false;
            that.oSearchSelect.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    if (!isSelectStyleSet) {
                        var shellSearchWidthInRem = jQuery('#shell-header-hdr-search').width() / parseFloat(jQuery("html").css("font-size"));
                        if (shellSearchWidthInRem <= 33) {
                            // if screen is tablet-sized, then display select as a filter icon
                            that.oSearchSelect.setDisplayMode('icon');
                            that.oSearchSelect.setTooltip(sap.ushell.resources.i18n.getText("searchIn"));
                            that.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupToShowSelectIcon");
                        }
                        isSelectStyleSet = true;
                    }
                    jQuery('#searchFieldInShell-select-icon').attr('title', sap.ushell.resources.i18n.getText("searchIn"));
                }
            }, that.oSearchSelect);

            // search button
            that.oSearchButton.attachPress(function() {
                that.handleClickSearchButton();
            });

            // esc key handle
            jQuery(document).on('keydown', function(oEvent) {
                if (oEvent.keyCode === 27) { //Esc key
                    if (that.oSearchInput && that.oSearchInput.getValue() === "" && !that.oSearchFieldGroup.hasStyleClass("sapUshellSearchFieldGroupInCenter") && that.oSearchFieldGroup.hasStyleClass("sapUshellSearchFieldGroupMaximized")) {
                        that.closeSearch(true, false);
                        //that.oSearchButton.oFocusHandler.setFocus();
                    }
                }
            });

            sap.ui.getCore().getEventBus().subscribe("allSearchFinished", that.onAllSearchFinished, that);
            sap.ui.getCore().byId('viewPortContainer').attachAfterNavigate(that.onAfterNavigate, that);
        },

        onShellSearchButtonPressed: function(event) {
            var that = this;

            if (sap.ui.getCore().byId('searchFieldInShell') === undefined) {
                that.init();
                that.oSearchButton.addEventDelegate({
                    // avoid double animation due to the rendering
                    onAfterRendering: function(oEvent) {
                        if (!that.afertFirstOpenSearch) {
                            that.openSearch(true, false);
                            that.afertFirstOpenSearch = true;
                        }
                    }
                }, that.oSearchButton);
            } else {
                that.openSearch(true, false);
                that.resetModel();
                that.afertFirstOpenSearch = true;
            }

            //            if (sap.ui.getCore().byId('searchFieldInShell') === undefined) {
            //                that.init();
            //            }
            //            that.resetModel();
            //            that.openSearch(true, false);
            //            that.afertFirstOpenSearch = true;
        },

        openSearch: function(isAnimated, isCenter) {
            var that = this;

            that._openSearchFieldGroup(isAnimated);
            if (isCenter) {
                that._setSearchFieldGroupInCenter();
            } else {
                that._setSearchFieldGroupOnSide();
            }
            // It is always true.
            that.afertFirstOpenSearch = true;
        },

        closeSearch: function(isAnimated, isCenter) {
            var that = this;

            if (sap.ui.getCore().byId('searchFieldInShell') === undefined) {
                return;
            }

            that._closeSearchFieldGroup(isAnimated);
            if (isCenter) {
                that._setSearchFieldGroupInCenter();
            } else {
                that._setSearchFieldGroupOnSide();
            }
        },

        getDefaultOpen: function() {
            return this.defaultOpen;
        },

        setDefaultOpen: function(defaultOpen) {
            this.defaultOpen = defaultOpen;
        },

        onAfterNavigate: function(oEvent) {
            // navigation tries to restore the focus -> but application knows better how to set the focus
            // -> after navigation call focus setter of search application
            if (oEvent.getParameter('toId') !== 'shellPage-Action-search' &&
                oEvent.getParameter('toId') !== 'applicationShellPage-Action-search') {
                return;
            }
            //sap.ui.getCore().byId('searchContainerResultsView').setFocus();
            var oSearchView = sap.ui.getCore().byId('searchContainerResultsView');
            if (oSearchView && oSearchView.oFocusHandler) {
                oSearchView.oFocusHandler.setFocus();
            }
            sap.ui.getCore().getEventBus().publish("searchLayoutChanged");
        },

        onAllSearchFinished: function() {
            this._setSearchFieldGroupInCenter();
            this.oSearchInput.setValue(this.oModel.getSearchBoxTerm());
        },

        _setOpenStyle: function() {
            // switch off end-area-search-icon
            // not to use sap.ui.getCore().byId('sf').setVisible(false), avoid re-rendering
            this.oShell.setSearch(this.oSearchFieldGroup);
            sap.ui.getCore().byId('sf').setVisible(false);
            jQuery('#sf').removeClass("sapUshellSearchFieldElementDisplayInlineBlock");
            jQuery('#sf').addClass("sapUshellSearchFieldElementDisplayNone");
            // switch on center-area-search-icon
            this.oSearchButton.removeStyleClass("sapUshellSearchFieldElementDisplayNone");
            this.oSearchButton.addStyleClass("sapUshellSearchFieldElementDisplayBlock");

            this.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupMaximized");
            this.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupMinimized");
            this.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupNotVisible");
        },

        _setCloseStyle: function() {
            this._setSearchFieldGroupOnSide();
            this.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupMaximized");
            this.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupMinimized");
            this.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupNotVisible");

            // switch on end-area-search-icon
            // not to use sap.ui.getCore().byId('sf').setVisible(false), avoid re-rendering
            jQuery('#sf').removeClass("sapUshellSearchFieldElementDisplayNone");
            jQuery('#sf').addClass("sapUshellSearchFieldElementDisplayInlineBlock");
            sap.ui.getCore().byId('sf').setVisible(true);

            // switch off center-area-search-icon
            this.oSearchButton.removeStyleClass("sapUshellSearchFieldElementDisplayBlock");
            this.oSearchButton.addStyleClass("sapUshellSearchFieldElementDisplayNone");
            this.oShell.setSearch(null);
        },

        _setSearchFieldGroupInCenter: function() {
            this.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupInCenter");
            this.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupOnSide");
        },

        _setSearchFieldGroupOnSide: function() {
            this.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupInCenter");
            this.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupOnSide");
        },

        resetModel: function() {
            this.oSearchInput.setValue('');
            this.oModel.resetQuery();
        },

        _openSearchFieldGroup: function(hasAnimation) {
            var that = this;

            //Pre-Fetch all App Tiles
            sap.ushell.Container.getService("Search")._getCatalogTiles();

            if (hasAnimation) {
                // before animation
                that._setOpenStyle();
                // animation select
                if (jQuery('#searchFieldInShell-select').length > 0) {
                    // have select
                    // for first animation, a re-rendering will happen due to the data arriving, essentially killing the animation half-way through
                    jQuery('#searchFieldInShell-select').css('max-width', '0%').animate({
                        'max-width': '15rem'
                    }, {
                        duration: 200,
                        complete: function() {
                            jQuery(this).css('max-width', '');
                        }
                    });
                }
                // animation input
                jQuery('#searchFieldInShell-input').css('max-width', '0%').animate({
                    'max-width': '35rem'
                }, {
                    duration: 300,
                    complete: function() {
                        that._setOpenStyle();
                        if (!sap.ui.Device.system.phone) {
                            that.oSearchInput.focus();
                        }
                        jQuery(this).css('max-width', '');
                    }
                });
            } else {
                that._setOpenStyle();
                if (!sap.ui.Device.system.phone) {
                    that.oSearchInput.focus();
                }
            }

            that.isSearchFieldGroupOpen = true;
        },

        _closeSearchFieldGroup: function(hasAnimation) {
            var that = this;

            if (hasAnimation) {
                // before animation
                that.oSearchFieldGroup.addStyleClass("sapUshellSearchFieldGroupOnSide");
                that.oSearchFieldGroup.removeStyleClass("sapUshellSearchFieldGroupInCenter");
                // animation input
                var inputWidth = jQuery('#searchFieldInShell-input').width() + "px";
                jQuery('#searchFieldInShell-input').css('max-width', inputWidth).animate({
                    'max-width': '0%'
                }, {
                    duration: 400,
                    complete: function() {
                        that._setCloseStyle();
                    }
                });
            } else {
                that._setCloseStyle();
            }

            that.isSearchFieldGroupOpen = false;
        },

        handleClickSearchButton: function() {
            var that = this;
            /* eslint no-lonely-if:0 */
            if (!searchHelper.isSearchAppActive()) {
                // not in search app
                if (that.isSearchFieldGroupOpen) {
                    // 2 close search
                    // special logic, defined here
                    if (that.oSearchInput.getValue() === "" &&
                        that.oModel.getDataSource() === that.oModel.allDataSource &&
                        that.getDefaultOpen() !== true) {
                        that._closeSearchFieldGroup(true);
                        setTimeout(function() {
                            sap.ui.getCore().byId('sf').focus();
                        }, 1000);
                    }
                    // else
                    // 3 trigger serach
                    // general logic, defined in searchFieldGroup
                }
            }
            // else in search app
            // 3 trigger serach
            // general logic, defined in searchFieldGroup
        }

    });

})();
