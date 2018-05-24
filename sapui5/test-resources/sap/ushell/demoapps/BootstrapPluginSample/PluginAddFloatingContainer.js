/**
 * Test/Example for the FLP FloatingContainer feature.
 *
 * This is an implementation of a bootstrap plugin that addresses fiori2 renderer API
 * in order to set the floating container's content and set its visibility.
 *
 * Main functionality:
 *  - Adding an activation button to the shell header (A HeaderEndItem with id "FloatingContainerButton")
 *    that shows/hides the floating container using the renderer API function setFloatingContainerVisibility
 *  - Creating a sap.m.List (id: "ContentList") that contains the items displayed in the floating container
 *    (NotificationListItems, and a Button)
 *  - A sap.m.Page (id "ContentPage") that contains the list and is the actual UI control that is set as the floating container's content.
 *    and that contains the list.
 *  - The style class listCSSClass is added in order to give ContentPage a background that distinguishes it (visually) from the FLP canvas
 *
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginAddFloatingContainer - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginAddFloatingContainer");

    var bContainerVisible = false,
        oRenderer = jQuery.sap.getObject("sap.ushell.renderers.fiori2.Renderer");

    function applyRenderer() {
        var oContent,
            getRenderer = function () {
                if (!oRenderer) {
                    oRenderer = sap.ushell.Container.getRenderer("fiori2");
                }
            },
            applyContentStyles = function () {
                var style = document.createElement('style');

                style.type = 'text/css';
                style.innerHTML = ".listCSSClass {background: rgba(187, 230, 211, .25); height: 207px; padding: 5px; }";
                style.innerHTML += ".listCSSClass section {position: relative}";
                document.getElementsByTagName('head')[0].appendChild(style);
            },
            getContainerImage = function () {
                var oImage = sap.m.Image();
                oImage.setSrc("../demo/img/Chat_Participants_Messages_002.png");
                return oImage;
            },
            /**
             * Creates and returns a sap.m.List that includes several UI controls
             */
            getContainerNotificationContent = function () {
                var oNotificationItem1 = new sap.m.NotificationListItem("notificationItem1", {
                        priority: sap.ui.core.Priority.Medium,
                        title: "Notification 1",
                        description: "AAA"
                    }),
                    oNotificationItem2 = new sap.m.NotificationListItem("notificationItem2", {
                        priority: sap.ui.core.Priority.High,
                        title: "Notification 2",
                        description: "BBB"
                    }),
                    oNotificationItem3 = new sap.m.NotificationListItem("notificationItem3", {
                        priority: sap.ui.core.Priority.High,
                        title: "Notification 3",
                        description: "CCC"
                    }),
                // On click, the toggles the FloatingContainer's visibility (i.e. closes the container)
                    oExitButton = new sap.m.ActionListItem("ExitButton", {
                        text: "Exit",
                        press: function (oEvent) {
                            oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                            bContainerVisible = !bContainerVisible;
                        }
                    }),
                    oContentList = new sap.m.List("ContentList", {
                        items: [oNotificationItem1, oNotificationItem2, oNotificationItem3, oExitButton]
                    }),
                    oFlotingContainerPage = new sap.m.Page("ContentPage", {
                        content: [oContentList],
                        title: "List Notifications"
                    }).addStyleClass("listCSSClass");

                applyContentStyles();
                oFlotingContainerPage.setShowHeader(true);
                return oFlotingContainerPage;
            },

            getContainerContent = function () {
                var listItem1 = new sap.m.CustomListItem("Item1", {
                        content: [new sap.m.Link({wrapping: true, text: "Item1 Some  text"})]
                    }),

                    listItem2 = new sap.m.CustomListItem("Item2", {
                        content: [new sap.m.Link({wrapping: true, text: "Item2 Some  text"})]
                    }),

                    listItem3 = new sap.m.CustomListItem("Item3", {
                        content: [new sap.m.Link({wrapping: true, text: "Item3 Some  text"})]
                    }),


                // On click, the toggles the FloatingContainer's visibility (i.e. closes the container)
                    oExitButton = new sap.m.ActionListItem("ExitButton", {
                        text: "Exit",
                        press: function (oEvent) {
                            oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                            bContainerVisible = !bContainerVisible;
                        }
                    }),
                    oDragButton = new sap.m.ActionListItem("DragButton", {
                        text: "Drag"
                    }),
                    oContentList = new sap.m.List("ContentList", {
                        items: [listItem1, listItem2, listItem3, oExitButton]
                    }),
                    oFlotingContainerPage = new sap.m.Page("ContentPage", {
                        content: [oContentList],
                        title: "Header of a Page"
                    }).addStyleClass("listCSSClass");

                applyContentStyles();
                oFlotingContainerPage.setShowHeader(true);
                return oFlotingContainerPage;
            };

        if (!getRenderer()) {
            oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        if (oRenderer) {
            bContainerVisible = oRenderer.getFloatingContainerVisiblity();

            // A shell header button that controls the visibility of the Floating Container
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "FloatingContainerButton",
                icon: "sap-icon://S4Hana/S0011",
                press: function (oEvent) {
                    oRenderer.setFloatingContainerDragSelector("#ContentPage-intHeader");
                    oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                    bContainerVisible = !bContainerVisible;
                }
            }, true, false, ["home", "app"]);

            //oContent = getContainerContent();
            oContent = getContainerContent();

            // Setting the content of the Floating Container for the states "home" and "app"

            // The content is added to the container only in the current state
            //oRenderer.setFloatingContainerContent(oContent, true);

            // The content is added to the container in "home" and "app" states
            //oRenderer.setFloatingContainerContent(oContent, false , ["home", "app"]);

            // The content is added to the container in all states
            oRenderer.setFloatingContainerContent(oContent, false);
        } else {
            jQuery.sap.log.error("BootstrapPluginSample - failed to apply renderer extensions, because 'sap.ushell.renderers.fiori2.RendererExtensions' not available");
        }
    }

    // the module could be loaded asynchronously, the shell does not guarantee a loading order;
    // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
    if (oRenderer) {
        // fiori renderer already loaded, apply extensions directly
        applyRenderer();
    } else {
        // fiori renderer not yet loaded, register handler for the loaded event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "rendererLoaded", applyRenderer, this);
    }
}());
