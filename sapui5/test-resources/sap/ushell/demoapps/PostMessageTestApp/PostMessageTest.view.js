// @copyright@

(function () {
    "use strict";
    /*global document, jQuery, parent, sap, window */

    jQuery.sap.require("sap.ui.core.format.DateFormat");

    var iTitleCounter = 0,
        aTestData;

    /**
     * Creates a button to trigger a post message for the given action and message. Optionally,
     * the message is not stringified and the text of the button can be set to a value different
     * from the action. IE9 is not capable of passing objects as parameter, but is applying
     * toString() on these objects. Sending unstringified objects on IE9 would therefore results
     * in incorrect strings ("[object Object]").
     * @param {object} oMessage
     *   the message to be sent
     * @param {boolean} [bNoStringify=false]
     *   indicates that messages is not stringified
     * @param {string} [sText=oMessage.action]
     *   text of the button
     * @returns {sap.m.Button}
     *   instance of a button to send post message
     */
    function createPostMessageButton(oMessage, bNoStringify, sText, fnMessageCallback) {
        return new sap.m.Button({
            text: sText || oMessage.action,
            press: function () {
                var sMessage = JSON.stringify(oMessage);
                if (typeof fnMessageCallback === "function") {
                    oMessage = fnMessageCallback();
                }
                jQuery.sap.log.debug("Sending message to top frame: " + sMessage, undefined, "sap.ushell.demo.PostMessageTestApp");
                window.top.postMessage(bNoStringify ? oMessage : sMessage, "*");
            }
        });
    }

    /**
     * Create a UI5 control to render a test scenario with description texts and buttons to
     * execute.
     *
     * @param {object} oTestData
     *   texts and button data needed to render the control
     * @returns {sap.ui.core.Control}
     *   instance of a panel control
     */
    function createPanel(oTestData) {
        var aButtons,
            sHtml;

        aButtons = oTestData.buttons && oTestData.buttons.map(
            function (oButtonData) {
                return createPostMessageButton(oButtonData.message, oButtonData.noStringify,
                    oButtonData.text, oButtonData.messageCallback);
            }
        );

        if (oTestData.description && oTestData.behavior) {
            sHtml = "<div><b>Description:</b> " +
                oTestData.description + "<br>" +
                "<b>Expected Behavior:</b> " +
                oTestData.behavior + "</div>";
        } else if (oTestData.text) {
            sHtml = "<div>" + oTestData.text + "</div>";
        }

        return new sap.m.Panel({
            expandable: true,
            expanded: false,
            headerToolbar: new sap.m.Toolbar({
                content: [new sap.m.Label({
                    text: oTestData.title,
                    design: sap.m.LabelDesign.Bold
                })]
            }),
            content: [new sap.ui.core.HTML({content: sHtml}),
                      new sap.m.Toolbar({content: aButtons})]
        });
    }

    // relax domain to create a stricter separation to parent frame
    document.domain = document.domain.substring(document.domain.indexOf(".") + 1);

    aTestData = [
        {
            title: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
            description: "This service function returns a string representing the URL hash " +
                "top perform a cross application navigation. ",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "GenericWrapperTest-open?A=B",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                    request_id: jQuery.sap.uid(),
                    body: {
                        oArgs: {
                            target: {
                                semanticObject: "GenericWrapperTest",
                                action: "open"
                            },
                            params: {
                                A: "B"
                            }
                        }
                    }
                }
            }, {
                text: "Action-showBookmark",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                    request_id: jQuery.sap.uid(),
                    body: {
                        oArgs: {
                            target: {
                                semanticObject: "Action",
                                action: "showBookmark"
                            }
                        }
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
            description: "Resolves a given semantic object and business parameters to a list " +
                "of links, taking into account the form factor of the current device.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "GenericWrapperTest",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: jQuery.sap.uid(),
                    body: {
                        sSemanticObject: "GenericWrapperTest",
                        mParameters: {
                            A: "B"
                        },
                        bIgnoreFormFactors: false
                    }
                }
            }, {
                text: "Action",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: jQuery.sap.uid(),
                    body: {
                        sSemanticObject: "Action",
                        bIgnoreFormFactors: false
                    }
                }
            }, {
                text: "Error",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    request_id: jQuery.sap.uid(),
                    body: {
                        sSemanticObject: "Action?fail_on_me=true",
                        bIgnoreFormFactors: false
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
            description: "Tells whether the given intent(s) are supported, taking into account " +
                "the form factor of the current device. 'Supported' means that navigation " +
                "to the intent is possible.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "only supported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                    request_id: jQuery.sap.uid(),
                    body: {
                        aIntents: ["#Action-toappperssample",
                                  "#Action-toappnavsample"]
                    }
                }
            }, {
                text: "with unsupported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                    request_id: jQuery.sap.uid(),
                    body: {
                        aIntents: ["#Action-toappperssample",
                                  "#Action-toappnavsample",
                                  "#Action-invalidAction"]
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
            description: "Tells whether the given navigation intent(s) are supported, taking into account " +
            "the form factor of the current device. 'Supported' means that navigation " +
            "to the intent is possible.",
            behavior: "Shows the return value as message toast.",
            buttons: [{
                text: "only supported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                    request_id: jQuery.sap.uid(),
                    body: {
                        aIntents: [
                                   { target : {
                                       semanticObject : "Action", action : "toappperssample"}
                                   },
                                   { target : {
                                       semanticObject : "Action", action : "toappnavsample"}
                                   }
                        ]
                    }
                }
            }, {
                text: "with unsupported intents",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                    request_id: jQuery.sap.uid(),
                    body: {
                        aIntents: [
                                   { target : {
                                       semanticObject : "Action", action : "toappperssample"}
                                   },
                                   { target : {
                                       semanticObject : "Action", action : "toappnavsample"}
                                   },
                                   { target : {
                                       semanticObject : "Action", action : "invalidAction"}
                                   }
                        ]
                    }
                }
            }]
        }, {
            title: "sap.ushell.services.CrossApplicationNavigation.toExternal",
            description: "This service function navigates to a specified target.",
            behavior: "Triggers a direct navigation. Navigation targets might not exist depending on platform and assigned user roles.",
            buttons: [{
                text: "Action-showBookmark",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                    request_id: jQuery.sap.uid(),
                    body: {
                        oArgs: {
                            target: {
                                semanticObject: "Action",
                                action: "showBookmark"
                            }
                        }
                    }
                }
            }, {
                text: "Action-toappnavsample",
                message: {
                    type: "request",
                    service: "sap.ushell.services.CrossApplicationNavigation.toExternal",
                    request_id: jQuery.sap.uid(),
                    body: {
                        oArgs: {
                            target: {
                                semanticObject: "Action",
                                action: "toappnavsample"
                            }
                        }
                    }
                }
            }]
        },{
            title: "sap.ushell.ui5service.ShellUIService.setTitle",
            description: "This service function navigates to a specified target.",
            behavior: "Sets the title",
            buttons: [{
                text: "setPurchaseOrder",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setTitle",
                    request_id: jQuery.sap.uid(),
                    body: {
                               sTitle:  "Purchase Order"
                    }
                }
            }, {
                text: "setSalesOrder",
                message: {
                    type: "request",
                    service: "sap.ushell.ui5service.ShellUIService.setTitle",
                    request_id: jQuery.sap.uid(),
                    body: {
                             sTitle: "Sales Order"
                    }
                }
            }]
        }, {
            title: "Additional Information",
            text: "document.domain: " + document.domain + "<br>" +
                "location.search: " + window.location.search + "<br>"
        }
    ];

    sap.ui.jsview("sap.ushell.demo.PostMessageTestApp.PostMessageTest", {

        /**
         * Is initially called once after the Controller has been instantiated. It is the place
         * where the UI is constructed. Since the Controller is given to this method, its event
         * handlers can be attached right away.
         */
        createContent: function () {
            return new sap.m.Page({
                content: [
                    new sap.m.VBox({
                        items: aTestData.map(
                            function (oTestData) {return createPanel(oTestData); }
                        )
                    })
                ]
            });
        },


        /** Specifies the Controller belonging to this View.
         * In the case that it is not implemented, or that "null" is returned, this View does not
         * have a Controller.
         */
        getControllerName: function () {
            return "sap.ushell.demo.PostMessageTestApp.PostMessageTest";
        }
    });
}());
