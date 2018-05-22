// iteration 0 : Holger
/* global sap,window,$, jQuery */

(function() {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchText');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchLink');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchLogger');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar');

    var SearchText = sap.ushell.renderers.fiori2.search.controls.SearchText;
    var SearchLink = sap.ushell.renderers.fiori2.search.controls.SearchLink;
    var SearchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;
    var SearchLogger = sap.ushell.renderers.fiori2.search.SearchLogger;
    var SearchRelatedObjectsToolbar = sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar;

    var noValue = '\u2013'; // dash

    sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListItem", {
        // the control API:
        metadata: {
            properties: {
                title: "string",
                titleUrl: "string",
                titleUrlIsIntent: "boolean",
                type: "string",
                imageUrl: "string",
                previewButton: "string", // true (default) or false, implemented for tablet only acc. to. visual design
                data: "object",
                path: "string",
                selected: "boolean",
                expanded: "boolean"
            },
            aggregations: {
                _selectionCheckBox: {
                    type: "sap.m.CheckBox",
                    multiple: false,
                    visibility: "hidden"
                },
                _expandButton: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },

        init: function() {
            var that = this;

            that.setAggregation("_selectionCheckBox", new sap.m.CheckBox({
                select: function(oEvent) {
                    that.setProperty("selected", oEvent.getParameters().selected, true /*no re-rendering needed, change originates in HTML*/ ); //see section Properties for explanation
                }
            }));

            that.setAggregation("_expandButton", new sap.m.Button({
                type: sap.m.ButtonType.Transparent,
                press: function(oEvent) {
                    that.toggleDetails();
                }
            }));
        },

        renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            oControl._renderer(oRm);
        },

        // the part creating the HTML:
        _renderer: function(oRm) {

            this._resetPrecalculatedValues();
            this._renderContainer(oRm);
        },

        _renderContainer: function(oRm) {
            var that = this;

            oRm.write('<div');
            oRm.writeControlData(that); // writes the Control ID
            oRm.addClass("sapUshellSearchResultListItem-Container");
            oRm.writeClasses(); // this call writes the above class plus enables support for Square.addStyleClass(...)
            //             oRm.write(' tabindex="0"');
            oRm.write('>');

            that._renderContentContainer(oRm);
            that._renderExpandButtonContainer(oRm);

            oRm.write('</div>');
        },


        _renderContentContainer: function(oRm) {
            oRm.write('<div class="sapUshellSearchResultListItem-Content">');

            this._renderTitleContainer(oRm);
            this._renderAttributesContainer(oRm);

            oRm.write('</div>');
        },

        _renderExpandButtonContainer: function(oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-ExpandButtonContainer">');

            //             oRm.write('<div class="sapUshellSearchResultListItem-ExpandButton" role="button" onClick="toggleExpand(\'ResultListItem01\')" tabindex="0"></div>');
            //             oRm.write('<div class="sapUshellSearchResultListItem-ExpandButton sapUiSizeCompact">');
            oRm.write('<div class="sapUshellSearchResultListItem-ExpandButton">');

            var icon, tooltip;
            var expanded = that.getProperty("expanded");
            if (expanded) {
                icon = sap.ui.core.IconPool.getIconURI("slim-arrow-up");
                tooltip = sap.ushell.resources.i18n.getText("hideDetailBtn_tooltip")
            } else {
                icon = sap.ui.core.IconPool.getIconURI("slim-arrow-down");
                tooltip = sap.ushell.resources.i18n.getText("showDetailBtn_tooltip")
            }

            var expandButton = that.getAggregation("_expandButton");
            expandButton.setIcon(icon);
            expandButton.setTooltip(tooltip);
            oRm.renderControl(expandButton);

            oRm.write('</div>');
            oRm.write('</div>');
        },


        _renderTitleContainer: function(oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-TitleAndImageContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-TitleContainer">');

            that._renderCheckbox(oRm);

            /// /// Title
            var titleURL = that._titleUrl;
            that.title = new SearchLink({
                href: titleURL,
                press: function() {
                    // logging for enterprise search concept of me
                    var oNavEventLog = new SearchLogger.NavigationEvent();
                    oNavEventLog.addUserHistoryEntry(titleURL);
                    // logging for usage analytics
                    var model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                    model.analytics.logCustomEvent('FLP: Search', 'Launch Object', [titleURL]);
                }
            });
            that.title.setText(that.getTitle());
            //                     that.title.setTooltip((sap.ushell.resources.i18n.getText('linkTo_tooltip') + ' ' + that.getTitle()).replace(/<b>/gi, '').replace(/<\/b>/gi, ''));
            that.title.addStyleClass("sapUshellSearchResultListItem-Title");
            that.title.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
            if (titleURL.length == 0) {
                that.title.setEnabled(false);
            }
            oRm.renderControl(that.title);

            /// /// Object Type
            var type = new SearchText();
            type.setText(that.getType());
            //                     type.setTooltip(('' + that.getType()).replace(/<b>/gi, '').replace(/<\/b>/gi, ''));
            type.addStyleClass("sapUshellSearchResultListItem-Category");
            type.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
            oRm.renderControl(type);

            oRm.write('</div>');

            that._renderImageForPhone(oRm);

            oRm.write('</div>');
        },

        _renderCheckbox: function(oRm) {
            var that = this;
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxExpandContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxContainer">');
            oRm.write('<div class="sapUshellSearchResultListItem-CheckboxAlignmentContainer">');

            var checkbox = that.getAggregation("_selectionCheckBox");
            var selected = that.getProperty("selected");
            checkbox.setSelected(selected);
            oRm.renderControl(checkbox);

            oRm.write('</div>');
            oRm.write('</div>');
            oRm.write('</div>');
        },


        _renderImageForPhone: function(oRm) {
            var that = this;
            if (that.getImageUrl()) {

                oRm.write('<div class="sapUshellSearchResultListItem-TitleImage">');

                oRm.write('<div class="sapUshellSearchResultListItem-ImageContainerAlignmentHelper"></div>');

                oRm.write('<img class="sapUshellSearchResultListItem-Image" src="');
                oRm.write(that.getImageUrl());
                oRm.write('">');

                oRm.write('</div>');
            }
        },

        _renderAttributesContainer: function(oRm) {
            var that = this;

            oRm.write('<div class="sapUshellSearchResultListItem-AttributesExpandContainer');

            var expanded = that.getProperty("expanded");
            if (expanded) {
                oRm.write(" sapUshellSearchResultListItem-AttributesExpanded");
            }

            oRm.write('">');
            oRm.write('<div class="sapUshellSearchResultListItem-AttributesAndActions">');
            oRm.write('<ul class="sapUshellSearchResultListItem-Attributes">');

            that._renderImageAttribute(oRm);

            var itemAttributes = that.getData().itemattributes;
            that._renderAllAttributes(oRm, itemAttributes);

            // This is just a dummie attribute to store additional space information for the expand and collapse JavaScript function
            oRm.write('<div class="sapUshellSearchResultListItem-ExpandSpacerAttribute" aria-hidden="true"></div>');

            oRm.write('</ul>');

            that._renderRelatedObjectsToolbar(oRm);


            oRm.write('</div>');
            oRm.write('</div>');
        },



        // render Attributes
        // ===================================================================
        _renderAllAttributes: function(oRm, itemAttributes) {
            var that = this;

            var itemAttribute;
            var labelText;
            var valueText;
            var label, value;

            // skip first attribute which is the title attribute for the table
            var i = 0,
                j = 0;
            var numberOfMainAttributes = 12;
            if (that.getImageUrl()) {
                numberOfMainAttributes--;
            }

            for (; j < numberOfMainAttributes && i < itemAttributes.length; i++) {
                itemAttribute = itemAttributes[i];

                if (itemAttribute.isTableTitle) {
                    continue;
                }

                labelText = itemAttribute.name;
                valueText = itemAttribute.value;
                if (labelText === undefined || valueText === undefined) {
                    continue;
                }
                if (!valueText || valueText === "") {
                    valueText = noValue;
                }

                oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-MainAttribute">');

                label = new sap.m.Label();
                label.setText(labelText);
                label.addStyleClass("sapUshellSearchResultListItem-AttributeKey");
                label.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                oRm.renderControl(label);

                value = new SearchText();
                value.setText(valueText);
                value.addStyleClass("sapUshellSearchResultListItem-AttributeValue");
                value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                oRm.renderControl(value);

                oRm.write('</li>');

                j++;
            }

            var hasWhyFoundAttributes = false;
            for (; i < itemAttributes.length; i++) {
                itemAttribute = itemAttributes[i];

                if (!itemAttribute.whyfound) {
                    continue;
                }

                labelText = itemAttribute.name;
                valueText = itemAttribute.value;
                if (labelText === undefined || valueText === undefined) {
                    continue;
                }
                if (!valueText || valueText === "") {
                    valueText = noValue;
                }

                oRm.write('<li class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-WhyFoundAttribute">');

                label = new sap.m.Label();
                label.setText(labelText);
                label.addStyleClass("sapUshellSearchResultListItem-AttributeKey");
                label.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                oRm.renderControl(label);

                value = new SearchText();
                value.setText(valueText);
                value.addStyleClass("sapUshellSearchResultListItem-AttributeValue");
                value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                oRm.renderControl(value);

                oRm.write('</li>');

                hasWhyFoundAttributes = true;
            }

            if (hasWhyFoundAttributes) {
                // Used for adding a line break between the main attributes and any additional why found attributes
                oRm.write('<div class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-WhyFoundSpacerAttribute" aria-hidden="true"></div>');
            }
        },


        _renderImageAttribute: function(oRm) {
            var that = this;

            if (!that.getImageUrl()) {
                return;
            }

            oRm.write('<div class="sapUshellSearchResultListItem-GenericAttribute sapUshellSearchResultListItem-ImageAttribute');
            if (!that.getImageUrl()) {
                oRm.write(' sapUshellSearchResultListItem-ImageAttributeHidden');
            }
            oRm.write('">');
            oRm.write('<div class="sapUshellSearchResultListItem-ImageContainer">');

            if (that.getImageUrl()) {
                oRm.write('<img class="sapUshellSearchResultListItem-Image" src="');
                oRm.write(that.getImageUrl());
                oRm.write('">');
            }

            oRm.write('<div class="sapUshellSearchResultListItem-ImageContainerAlignmentHelper"></div>');
            oRm.write('</div>');
            oRm.write('</div>');
        },


        // render Related Objects Toolbar
        // ===================================================================
        _renderRelatedObjectsToolbar: function(oRm) {
            var that = this;

            if (!that._intents || that._intents.length == 0) {
                return;
            }

            that._showExpandButton = true;

            var relatedActions = [];
            for (var i = 0; i < that._intents.length; i++) {
                var intent = that._intents[i];
                relatedActions.push({
                    label: intent.text,
                    href: intent.externalHash,
                    target: intent.target
                });
            }

            that.relatedObjectActionsToolbar = new SearchRelatedObjectsToolbar({
                relatedObjects: relatedActions
            });

            that.relatedObjectActionsToolbar.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar");

            oRm.renderControl(that.relatedObjectActionsToolbar);
        },









        _getExpandAreaObjectInfo: function() {
            var that = this;

            var resultListItem = $(that.getDomRef());

            var attributesExpandContainer = resultListItem.find(".sapUshellSearchResultListItem-AttributesExpandContainer");
            var relatedObjectsToolbar = resultListItem.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");

            var relatedObjectsToolbarHidden = false;
            if (relatedObjectsToolbar.css("display") === "none") {
                relatedObjectsToolbar.css("display", "block");
                relatedObjectsToolbarHidden = true;
            }

            var currentHeight = attributesExpandContainer.height();
            var expandedHeight = resultListItem.find(".sapUshellSearchResultListItem-AttributesAndActions").height();

            if (relatedObjectsToolbarHidden) {
                relatedObjectsToolbar.css("display", "");
            }

            var elementsToFadeInOrOut = [];
            resultListItem.find(".sapUshellSearchResultListItem-GenericAttribute").each(function() {
                var element = $(this);
                if (element.css("order") > 2) {
                    elementsToFadeInOrOut.push(this);
                }
            });

            var expandAnimationDuration = 200;
            var fadeInOrOutAnimationDuration = expandAnimationDuration / 10;



            var expandAreaObjectInfo = {
                resultListItem: resultListItem,
                attributesExpandContainer: attributesExpandContainer,
                currentHeight: currentHeight,
                expandedHeight: expandedHeight,
                elementsToFadeInOrOut: elementsToFadeInOrOut,
                expandAnimationDuration: expandAnimationDuration,
                fadeInOrOutAnimationDuration: fadeInOrOutAnimationDuration,
                relatedObjectsToolbar: relatedObjectsToolbar
            };

            return expandAreaObjectInfo;
        },



        isShowingDetails: function() {
            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            /////////////////////////////
            // Expand Result List Item
            if (expandAreaObjectInfo.currentHeight < expandAreaObjectInfo.expandedHeight) {
                return false;
            }
            return true;
        },



        showDetails: function(animated) {
            var that = this;

            if (that.isShowingDetails()) {
                return;
            }

            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            expandAreaObjectInfo.relatedObjectsToolbar.css("display", "block");

            if (that.relatedObjectActionsToolbar) {
                that.relatedObjectActionsToolbar._layoutToolbarElements();
            }

            expandAreaObjectInfo.attributesExpandContainer.animate({
                    "height": expandAreaObjectInfo.expandedHeight
                },
                expandAreaObjectInfo.expandAnimationDuration,
                function() {
                    //                     $(this).css("height", "auto");
                    $(this).addClass("sapUshellSearchResultListItem-AttributesExpanded");
                    $(this).css("height", "");
                    $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");

                    var iconArrowUp = sap.ui.core.IconPool.getIconURI("slim-arrow-up");
                    var expandButton = that.getAggregation("_expandButton");
                    expandButton.setTooltip(sap.ushell.resources.i18n.getText("hideDetailBtn_tooltip"));
                    expandButton.setIcon(iconArrowUp);
                    expandButton.rerender();

                    expandAreaObjectInfo.relatedObjectsToolbar.css("display", "");

                    that.setProperty("expanded", true, true);
                }
            );

            $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
                    "opacity": 1
                },
                expandAreaObjectInfo.fadeInOrOutAnimationDuration
            );
        },



        hideDetails: function(animated) {
            var that = this;
            var resultListItem = $(that.getDomRef());

            if (!that.isShowingDetails()) {
                return;
            }

            var expandAreaObjectInfo = this._getExpandAreaObjectInfo();

            var attributeHeight = resultListItem.find(".sapUshellSearchResultListItem-MainAttribute").outerHeight(true) + resultListItem.find(".sapUshellSearchResultListItem-ExpandSpacerAttribute").outerHeight(true);
            var secondAnimationStarted = false;
            var deferredAnimation01 = expandAreaObjectInfo.attributesExpandContainer.animate({
                "height": attributeHeight
            }, {
                "duration": expandAreaObjectInfo.expandAnimationDuration,
                "progress": function(animation, progress, remainingMs) {
                    if (!secondAnimationStarted && remainingMs <= expandAreaObjectInfo.fadeInOrOutAnimationDuration) {
                        secondAnimationStarted = true;
                        var deferredAnimation02 = $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
                                "opacity": 0
                            },
                            expandAreaObjectInfo.fadeInOrOutAnimationDuration
                        ).promise();

                        jQuery.when(deferredAnimation01, deferredAnimation02).done(function() {
                            expandAreaObjectInfo.attributesExpandContainer.removeClass("sapUshellSearchResultListItem-AttributesExpanded");
                            $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");

                            var iconArrowDown = sap.ui.core.IconPool.getIconURI("slim-arrow-down");
                            var expandButton = that.getAggregation("_expandButton");
                            expandButton.setTooltip(sap.ushell.resources.i18n.getText("showDetailBtn_tooltip"));
                            expandButton.setIcon(iconArrowDown);
                            expandButton.rerender();

                            that.setProperty("expanded", false, true);
                        });
                    }
                }
            }).promise();
        },



        toggleDetails: function(animated) {
            if (this.isShowingDetails()) {
                this.hideDetails(animated);
            } else {
                this.showDetails(animated);
            }
        },



        isSelectionModeEnabled: function() {
            var that = this;
            var isSelectionModeEnabled = false;
            var selectionBoxContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");
            if (selectionBoxContainer) {
                isSelectionModeEnabled = selectionBoxContainer.css("opacity") > 0;
            }
            return isSelectionModeEnabled;
        },



        enableSelectionMode: function(animated) {
            var that = this;
            var selectionBoxOuterContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
            var selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");

            var duration = 200; // aka 'fast'
            var secondAnimationStarted = false;
            selectionBoxOuterContainer.animate({
                width: "2rem"
            }, {
                "duration": duration,
                "progress": function(animation, progress, remainingMs) {
                    if (!secondAnimationStarted && progress > 0.5) {
                        selectionBoxInnerContainer.css("display", "");
                        selectionBoxInnerContainer.animate({
                            opacity: "1.0"
                        }, duration / 2);
                        secondAnimationStarted = true;
                    }
                }
            });
        },



        disableSelectionMode: function(animated) {
            var that = this;
            var selectionBoxOuterContainer = $(that.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
            var selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");

            var duration = 200; // aka 'fast'
            selectionBoxInnerContainer.animate({
                opacity: "0.0"
            }, duration / 2, function() {
                selectionBoxInnerContainer.css("display", "none");
            });
            selectionBoxOuterContainer.animate({
                width: "0"
            }, duration);
        },



        toggleSelectionMode: function(animated) {
            if (this.isSelectionModeEnabled()) {
                this.disableSelectionMode(animated);
            } else {
                this.enableSelectionMode(animated);
            }
        },



        // after rendering
        // ===================================================================
        onAfterRendering: function() {
            var that = this;

            that.showOrHideExpandButton();

            // re-render is triggered by event listener in SearchResultList
            var phoneSize = 767;
            // var tabletSize = 1150;
            //             var windowWidth = $(window).width();
            //             if (windowWidth <= phoneSize) {
            //                 var titleUrl = that._titleUrl;
            //                 if (titleUrl && titleUrl.length > 0) {
            //                     titleUrl = encodeURI(titleUrl);
            //                     $(that.getDomRef()).find(".sapUshellSearchResultListItem").bind('click', that.fireNavigate(titleUrl));
            //                 }
            //             }

            $(that.getDomRef()).bind('click', function() {
                var windowWidth = $(window).width();
                if (windowWidth <= phoneSize) {
                    var titleUrl = that._titleUrl;
                    if (titleUrl && titleUrl.length > 0) {
                        var titleUrlIsIntent = that.getProperty("titleUrlIsIntent");
                        titleUrl = encodeURI(titleUrl);
                        var navigationFunction = that.fireNavigate(titleUrl, titleUrlIsIntent);
                        navigationFunction();
                    }
                }
            });

            //$('.sapUshellSearchResultListItemButton .sapUshellSearchResultListItemButtonContainer').attr('role', 'button');
            //             var $attributeValue = $('.sapUshellSearchResultListItem-attribute-value');
            //             $attributeValue.each(function() {
            //                 if ($(this).prev().hasClass('sapUshellSearchResultListItem-attribute-label')) {
            //                     $(this).attr('aria-label', $(this).prev().text());
            //                 }
            //             });

            // use boldtagunescape like in highlighting for suggestions //TODO
            // allow <b> in title and attributes
            that.forwardEllipsis($(that.getDomRef())
                .find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultListItem-AttributeKey, .sapUshellSearchResultListItem-AttributeValue"));

            //             var $detailsContainer = $(that.getDomRef()).find('.sapUshellSearchResultListItemDetails2');
            //             $detailsContainer.css("display", "none");
            //             $detailsContainer.css("height", "auto");
            //             $detailsContainer.css("overflow", "visible");

            SearchHelper.attachEventHandlersForTooltip(this.getDomRef());
        },



        // ===================================================================
        // Some Helper Functions
        // ===================================================================

        _resetPrecalculatedValues: function() {
            this._visibleAttributes = undefined;
            this._detailsArea = undefined;
            this._showExpandButton = false;
            this._titleUrl = this.getTitleUrl();
            this._intents = this.getData().intents;
        },


        showOrHideExpandButton: function() {
            var that = this;
            var element = $(that.getDomRef());

            var expandButtonContainer = element.find(".sapUshellSearchResultListItem-ExpandButtonContainer");
            var isVisible = expandButtonContainer.css("visibility") != "hidden";

            var shouldBeVisible = false;

            var actionBar = element.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
            shouldBeVisible = actionBar.length > 0; // && actionBar.css("display") != "none";

            if (!shouldBeVisible) {
                element.find(".sapUshellSearchResultListItem-MainAttribute,.sapUshellSearchResultListItem-WhyFoundAttribute").each(function() {
                    if ($(this).css("order") > 2) {
                        shouldBeVisible = true;
                        return false;
                    }
                });
            }

            if (isVisible && !shouldBeVisible) {
                expandButtonContainer.css("visibility", "hidden");
            } else if (!isVisible && shouldBeVisible) {
                expandButtonContainer.css("visibility", "");
            }
        },


        // handler of  result list item left and image column
        // ===================================================================
        fireNavigate: function(uri, uriIsIntent) {
            return function() {
                if (uri) {
                    var oNavEventLog = new SearchLogger.NavigationEvent();
                    oNavEventLog.addUserHistoryEntry(uri);
                    // logging for usage analytics
                    var model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                    model.analytics.logCustomEvent('FLP: Search', 'Launch Object', [uri]);

                    // Use Launchpad Cross Application Navigation Framework if it's available
                    var oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
                    if (oCrossAppNav && uriIsIntent) {
                        oCrossAppNav.toExternal({
                            target: {
                                shellHash: uri
                            }
                        });
                    } else {
                        window.location.href = uri;
                    }
                }
            };

        },


        forwardEllipsis: function(objs) {
            objs.each(function(i, d) {
                // recover bold tag with the help of text() in a safe way
                SearchHelper.forwardEllipsis4Whyfound(d);
            });
        }

    });
})();
