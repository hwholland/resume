/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

(function () {
	'use strict';

	jQuery.sap.declare('sap.apf.utils.navContainer');
	
	sap.apf.utils.navContainer = sap.apf.utils.navContainer || {};
	
    /**
     * @private
     * @function
     * @name sap.apf.utils.navContainer#pushContent
     * @description Pushes content to the ushell container.
     * @param {(string|object|string[]|object[])} content Content which shall be pushed to the ushell container.
     * @param {sap.apf.core.MessageHandler} messageHandler Instance of the MessageHandler.
     
     * @param {function(containerId, messageObject)} callback Callback returns after content has been pushed to the ushell container.
     * @param {string} callback.containerId ID of the filled container
     * @param {sap.apf.core.MessageObject} callback.messageObject Identifier of corrupt process flow
     */
	sap.apf.utils.navContainer.pushContent = function(content, containerName, messageHandler, callback) {
		if(ushellContainerExists()) {
			var contentId = jQuery.sap.uid();
			sap.ushell.Container.getService("Personalization").getContainer(containerName, { validity : 0})
			.done(function(container) {
				container.setItemValue(contentId, content);
				container.save();
				callback(contentId, null);
			})
			.fail(function() {
				putMessage("5039", messageHandler, callback);
			});
		} else {
			putMessage("5038", messageHandler, callback);
		}
	};
	
    /**
     * @private
     * @function
     * @name sap.apf.utils.navContainer#fetchContent
     * @description Fetches content from the ushell container.
     * @param {string} containerId Container id of the desired ushell container.
     * @param {sap.apf.core.MessageHandler} messageHandler Instance of the MessageHandler.
     
     * @param {function(content, messageObject)} callback Callback returns after content has been pushed to the ushell container.
     * @param {(string|object|string[]|object[])} callback.content content Content which has been stored to the ushell container.
     * @param {sap.apf.core.MessageObject} callback.messageObject Identifier of corrupt process flow
     */
	sap.apf.utils.navContainer.fetchContent = function(contentId, containerName, messageHandler, callback) {
		if(ushellContainerExists()) {
			sap.ushell.Container.getService("Personalization").getContainer(containerName)
			.done(function(container) {
				var content = container.getItemValue(contentId);
				if(content) {
					callback(content, null);
				} else {
					putMessage("5040", messageHandler, callback);
				}
			})
			.fail(function() {
				putMessage("5040", messageHandler, callback);
			});
		} else {
			putMessage("5038", messageHandler, callback);
		}
	};
	
	function ushellContainerExists() {
		if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			return true;
		} else {
			return false;
		}
	}
	function putMessage(messageCode, messageHandler, callback) {
		var messageObject = messageHandler.createMessageObject({
			code : messageCode
		});
		messageHandler.putMessage(messageObject);
		callback(null, messageObject);
	}
}());
