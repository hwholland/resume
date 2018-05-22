// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, document, self, hasher*/
    /*jslint plusplus: true, nomen: true, vars: true */

    sap.ui.jsview("sap.ushell.renderers.fiori2.meArea.MeArea", {

        createContent: function (oController) {
            jQuery.sap.require('sap.m.Button');
            jQuery.sap.require('sap.m.OverflowToolbar');
            jQuery.sap.require('sap.ushell.resources');
            this.addStyleClass('sapUshellMeAreaView');
            var sUserName = sap.ushell.Container.getUser().getFullName();
            var oUserName = new sap.m.VBox({
                items: [
                    new sap.m.Text({text: sUserName}).addStyleClass('sapUshellMeAreaUserName'),
                    new sap.m.Button({
                        type: sap.m.ButtonType.Unstyled,
                        icon: 'sap-icon://log',
                        text: sap.ushell.resources.i18n.getText("logoutBtn_title"),
                        tooltip: sap.ushell.resources.i18n.getText("logoutBtn_tooltip"),
                        press: [oController.logout, oController]
                    }).addStyleClass("sapUshellLogoutButton")
                ]
            }).addStyleClass("sapUshellUserArea");

            var userImage = sap.ushell.Container.getUser().getImage(),
                userBoxItem;

            if (!userImage) {
                userBoxItem = new sap.ui.core.Icon({
                    src: sap.ui.core.IconPool.getIconURI("person-placeholder"),
                    size: '4rem'
                });
            } else {
                userBoxItem =  new sap.m.Image({
                    src: userImage,
                    width: '4rem',
                    height: '4rem'
                });
            }
            userBoxItem.addStyleClass("sapUshellMeAreaUserImage");

            var oUserHBox = new sap.m.HBox({
                items: [
                    userBoxItem,
                    oUserName
                ]
            });
            oUserHBox.addStyleClass('sapUshellMeAreaUserInfo');
            oUserHBox.addStyleClass('sapContrastPlus');

            var oActionsHBox = new sap.m.OverflowToolbar({
                id: "overflowActions",
                design: sap.m.ToolbarDesign.Transparent,
                content: {
                    path: "/currentState/actions",
                    factory: function (sId, oContext) {
                        var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                        if (oCtrl && oCtrl.setActionType) {
                            oCtrl.setActionType("action");
                            /*since the factory can be called many times,
                            we need to add the press handler only once.
                            the method below makes sure it is added only once per control
                            the press handler is attached to all actions, and switches the
                            viewport state to "Center" as requested by UX*/
                            oController._addPressHandlerToActions(oCtrl);
                        }
                        return oCtrl;
                    }
                }
            }).addStyleClass('sapContrastPlus');
            if (oActionsHBox._getOverflowButton) {
                var overflowButton = oActionsHBox._getOverflowButton();
                if (overflowButton) {
                    var orig = overflowButton.onAfterRendering;
                    overflowButton.onAfterRendering = function () {
                        if (orig) {
                            orig.apply(this, arguments);
                        }
                        this.addStyleClass('sapUshellActionItem');
                        this.setText(sap.ushell.resources.i18n.getText('meAreaMoreActions'));
                    };
                }
            }

            oActionsHBox.updateAggregation = function (sName) {
                /*jslint nomen: true */
                var oBindingInfo = this.mBindingInfos[sName],
                    oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                    oClone;

                jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                    this[oAggregationInfo._sRemoveMutator](v);
                }, this));
                jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                    oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
                    this[oAggregationInfo._sMutator](oClone);
                }, this));
            };

            jQuery.sap.require('sap.m.StandardListItem');
            var oActivityTemplate = new sap.m.StandardListItem({
                title: "{meAreaModel>title}",
                description: {
                    path: "meAreaModel>appType",
                    formatter: function(sAppType) {
                        return sap.ushell.services.AppType.getDisplayName(sAppType);
                    }
                },
                icon: "{meAreaModel>icon}",
                type: sap.m.ListType.Active,
                info: "{meAreaModel>timestamp}"
            });
            oActivityTemplate.addStyleClass('sapUshellMeAreaActivityItem');

            var oIconTabBar = new sap.m.IconTabBar('meAreaIconTabBar', {
                backgroundDesign: sap.m.BackgroundDesign.Transparent,
                expandable: false,
                items: [
                    new sap.m.IconTabFilter({
                        text: sap.ushell.resources.i18n.getText("recentActivities"),
                        content: new sap.m.List({
                            items: {
                                path: "meAreaModel>/apps/recentActivities",
                                template: oActivityTemplate
                            },
                            //mode: sap.m.ListMode.SingleSelectMaster,
                            itemPress: function (oEvent) {
                                var oModel = this.getModel('meAreaModel'),
                                    oViewPort = sap.ui.getCore().byId("viewPortContainer");

                                if (oViewPort) {//added in order to make loading dialog open after view switch
                                    oViewPort.switchState("Center");
                                }

                                var sPath = oEvent.getParameter('listItem').getBindingContextPath();
                                setTimeout(function () {//timeOut is needed in cases in which the app loads fast. This way we get smoother navigation
                                    hasher.setHash(oModel.getProperty(sPath).url);
                                }, 200);
                            }
                        })
                    })
                ]
            }).addStyleClass('sapUshellMeAreaTabBar');
            var origTabBarAfterRendering = oIconTabBar.onAfterRendering;
            oIconTabBar.onAfterRendering = function (){
                if (origTabBarAfterRendering) {
                    origTabBarAfterRendering.apply(this, arguments);
                }
                var oTabBarHeader = sap.ui.getCore().byId('meAreaIconTabBar--header');
                if (oTabBarHeader) {
                    oTabBarHeader.addStyleClass('sapContrastPlus');
                }
            };

            this.actionBox = oActionsHBox;
            return new sap.m.ScrollContainer({
                vertical: true,
                horizontal: false,
                height: "100%",
                content: new sap.m.VBox({
                    items: [oUserHBox, oActionsHBox, oIconTabBar]
                })
            });
        },

        onViewStateShow: function () {
            this.getController().refreshUserActivities();
            this.actionBox.updateAggregation("content");
        },
        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.meArea.MeArea";
        }

    });

}());