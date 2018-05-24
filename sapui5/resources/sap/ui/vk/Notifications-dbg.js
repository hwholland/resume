/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Notifications.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/core/Control", "sap/ui/model/json/JSONModel", "./Messages"
], function (jQuery, library, Control, JSONModel, Messages) {
	"use strict";

		/**
	 * Constructor for a new Notifications.
	 *
	 * @class
	 * Provides the ability to display logged console messages within your application.
	 *
	 * @extends sap.ui.core.Control
	 * @author SAP SE
	 * @version 1.38.15
	 * @constructor
	 * @public
	 * @alias sap.ui.vk.Notifications
	 * @experimental Since 1.38.0 This class is experimental and might be modified or removed in future versions.
	 */
	var Notifications = Control.extend("sap.ui.vk.Notifications", {
		metadata: {
			library: "sap.ui.vk",
			aggregations: {
				_messagePopover: {
					type: "sap.m.MessagePopover",
					multiple: false,
					visibility: "hidden"
				},
				_messagePopoverItem: {
					type: "sap.m.MessagePopoverItem",
					multiple: false,
					visibility: "hidden"
				},
				_messagePopoverToggleButton: {
					type: "sap.m.ToggleButton",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {
				allMessagesCleared: {},
				messageAdded: {}
			},
			publicMethods: [
				"clearAllMessages"
			]
		}
	});

	/**
	 *.Clears the items in the Message Popover list.
	 * @param {sap.m.MessagePopover} messagePopover The Message Popover that we are removing the items from.
	 * @param {sap.m.ToggleButton} messagePopoverToggleButton The toggle button displaying the number of items listed.
	 * @returns {sap.ui.vk.Notifications} <code>this</code> to allow method chaining.
	 * @public
	 */
	Notifications.prototype.clearAllMessages = function(messagePopover, messagePopoverToggleButton) {
			messagePopover.removeAllItems();
			messagePopoverToggleButton.setText(messagePopover.getItems().length);
			this.fireAllMessagesCleared();
			messagePopover.close();
			return this;
	};

	Notifications.prototype.init = function () {
		this._messages = new Messages();
		this._listener = {};

		this._messagePopover = new sap.m.MessagePopover();
		this._messagePopover.addStyleClass("sapVizKitNotificationPopover");

		this._messagePopoverToggleButton = new sap.m.ToggleButton({
			icon: "sap-icon://message-popup",
			type: sap.m.ButtonType.Emphasized,
			tooltip:  sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVERBUTTON"),
			text: "0",
			press: function(oEvent) {
				if (oEvent.getSource().getPressed()) {
					this._messagePopover.openBy(oEvent.getSource());
				} else {
					this._messagePopover.close();
				}
			}.bind(this)
		});

		this._messagePopoverToggleButton.addStyleClass("messagePopoverButton");

		this._messagePopover.attachAfterClose(function(event) {
			this._messagePopoverToggleButton.setPressed(false);
		}.bind(this));

		var headerButton = new sap.m.Button({
			text: sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVER_CLEARBUTTON"),
			type: sap.m.ButtonType.Emphasized,
			tooltip: sap.ui.vk.getResourceBundle().getText("MESSAGEPOPOVER_CLEARBUTTON"),
			press: this.clearAllMessages.bind(this, this._messagePopover, this._messagePopoverToggleButton)
		});
		this._messagePopover.setHeaderButton(headerButton);
		this.setAggregation("_messagePopover", this._messagePopover);

		this.setAggregation("_messagePopoverToggleButton", this._messagePopoverToggleButton);
		this._listener.onLogEntry = function (event) {
			if (/^sap\.ui\.vk/.test(event.component)) {
				var mess = event.details,
					cause,
					reso,
					code;
				if (this._messages.messages[event.details]) {
					mess = sap.ui.vk.getResourceBundle().getText(this._messages.messages[event.details].summary);
					cause = sap.ui.vk.getResourceBundle().getText(this._messages.messages[event.details].cause);
					reso = sap.ui.vk.getResourceBundle().getText(this._messages.messages[event.details].resolution);
					code = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_CODE");
				}
				var component = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_COMPONENT");
				var date = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_DATE");
				var time = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_TIME");
				var level = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_LEVEL");
				var messageTitle = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_MESSAGE");
				var causeTitle = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_CAUSE");
				var resolutionTitle = sap.ui.vk.getResourceBundle().getText("ERROR_DESCRIPTION_RESOLUTION");

				var description =
					"<div><b>" + component + ":</b><br>" + event.component + "</div><br>" +
					"<div><b>" + date + ":</b><br>" + event.date + "</div><br>" +
					(code ? "<div><b>" + code + ":</b><br>" + event.details + "</div><br>" : "") +
					"<div><b>" + time + ":</b><br>" + event.time.slice(0, event.time.indexOf(".")) + "</div><br>" +
					"<div><b>" + level + ":</b><br>" + event.level + "</div><br>" +
					"<div><b>" + messageTitle + ":</b><br>" + mess + "</div><br>" +
					(cause ? "<div><b>" + causeTitle + ":</b><br>" + cause + "</div><br>" : "") +
					(reso ? "<div><b>" + resolutionTitle + ":</b><br>" + reso + "</div>" : "");

				var oItem = new sap.m.MessagePopoverItem({
					markupDescription: true,
					title: event.message,
					description: description
				});
				this._messagePopover.addItem(oItem);
				this._messagePopoverToggleButton.setText(this._messagePopover.getItems().length);
				this.fireMessageAdded();
			}
		}.bind(this);

		jQuery.sap.log.addLogListener(this._listener);
	};

	Notifications.prototype.attachAllMessagesCleared = function(data, func, listener) {
		return this.attachEvent("allMessagesCleared", data, func, listener);
	};

	Notifications.prototype.detachAllMessagesCleared = function(func, listener) {
		return this.detachEvent("allMessagesCleared", func, listener);
	};

	Notifications.prototype.fireAllMessagesCleared = function(parameters, allowPreventDefault, enableEventBubbling) {
		return this.fireEvent("allMessagesCleared", parameters, allowPreventDefault, enableEventBubbling);
	};

	Notifications.prototype.attachMessageAdded = function(data, func, listener) {
		return this.attachEvent("messageAdded", data, func, listener);
	};

	Notifications.prototype.detachMessageAdded = function(func, listener) {
		return this.detachEvent("messageAdded", func, listener);
	};

	Notifications.prototype.fireMessageAdded = function(parameters, allowPreventDefault, enableEventBubbling) {
		return this.fireEvent("messageAdded", parameters, allowPreventDefault, enableEventBubbling);
	};

	return Notifications;

});
