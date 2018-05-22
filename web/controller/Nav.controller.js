sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel",
], function(Controller, JSONModel) {
    /**
     * @class  Navigation
     * @augments   sap.ui.core.mvc.Controller
     */

    "use strict";

    /**
     * Template for items shown in the MessagePopover, which mainly represents
     * messages from users, or notifications from the system.
     *
     * @member     {sap.m.MessageItem}  oMessageTemplate
     */
    var oMessageTemplate = new sap.m.MessageItem({
        type: '{type}',
        title: '{title}',
        description: '{description}',
        subtitle: '{subtitle}'
    });

    /**
     * MessagePopover triggered by the button in the ToolPage header on the
     * right beside the logout button.  Displays messages of various sort.
     *
     * @member     {sap.m.MessagePopover}  oMessagePopover
     */
    var oMessagePopover = new sap.m.MessagePopover({
        items: {
            path: '/',
            template: oMessageTemplate
        }
    });

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    return Controller.extend("solo.web.controller.Nav", {

        /**
         * Constructor method for the controller object, which intends to
         * retrieve the model which was loaded into the component from a JSON
         * file, and then asign the model to this view to be used to supply the
         * detailed content / values
         *
         * @method     onInit
         * @memberof   solo.web.controller.Navigation
         */

        onInit: function() {
            var oNavigation = this.getOwnerComponent().getModel("navigation");
            this.getView().setModel(oNavigation, "navigation");
            sap.ui.getCore().setModel(oNavigation, "navigation");

            this._oHashChanger = new sap.ui.core.routing.HashChanger();
            this._configureMessagePopover();
        },

        /**
         * Initializes the message popover element and sets it's model
         * 
         * @method     _configureMessagePopover
         * @memberof   solo.web.controller.Navigation
         */
        _configureMessagePopover: function() {
            var oMessage = new JSONModel();
            var aMessages = [];

            oMessage.setData(aMessages);
            oMessagePopover.setModel(oMessage);
            sap.ui.getCore().setModel(oMessage, "messages");

            var oPopoverButton = this.byId("MessagePopoverButton");
            oPopoverButton.oComponent = this.getOwnerComponent();

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("Messages", "New", this.getMessages, this);
        },

        /**
         * Event handler that gets performed anyone someone presses the expand/contract
         * button in the top left-hand side of the page.
         * 
         * @method     onToggleSideMenu
         * @memberof   solo.web.controller.Navigation
         */
        onToggleSideMenu: function() {
            var oToolPage = this.byId("ToolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        },

        /**
         * NOTE: The logic for this function will not work - needs to be redesigned
         * altogether based on the fact that more than one phyiscal view will be
         * controlling more than one logical view.  See this line:
         * @example
         * if (this.getOwnerComponent()._activeView && sKey.indexOf("View") === -1) {   // sKey.indexOf("View") === -1
         * 
         * @desc     
         * Determines what view the user should be taken to by listening for
         * specific properties in the URL (hash).
         *
         * @method     onNavigate
         * @memberof   solo.web.controller.Navigation
         * @param      {Object}  oEvent  The event object containing data about
         *                               the source and type of user action
         *                               performed
         */
        onNavigate: function(oEvent) {
            var sHash = this.getOwnerComponent().getBrowserHash();
            var oItem = oEvent.getParameters().item;
            var sKey = oItem.getKey();
            this._oHashChanger.setHash(sKey);
        },

        /**
         * Toggles the MessagePopover to open from a collapsed / hidden state.
         * This should drop it down from the top-right corner of the page.
         *
         * @param      {Object}  oEvent  The event object containing data about
         *                               the source and type of user action
         *                               performed
         */
        onPressMessagePopover: function(oEvent) {
            oMessagePopover.toggle(oEvent.getSource());
        }

    });
});