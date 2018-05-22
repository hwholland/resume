jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.utils.navContainer');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');

module("Ushell container", {
    setup: function() {
    	this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().spyPutMessage();
    }
});

asyncTest('Push and fetch content to/from ushell container', function() {
	expect(4);
	var that = this;
	var myObject = {
			key1 : "object1",
			key2 : "object2"
	};
	sap.apf.utils.navContainer.pushContent(myObject, 'sap.apf.selectionVariant', this.messageHandler, function(containerId, messageObject) {
		ok(messageObject === null, "No error during push of content");
		ok(containerId !== null, "Container ID returned");
		sap.apf.utils.navContainer.fetchContent(containerId, 'sap.apf.selectionVariant', that.messageHandler, function(content, messageObject) {
			ok(messageObject !== undefined, "No error during fetch of content");
			deepEqual(content, myObject, "Pushed content correct fetched");
			start();
		});
	});
});
asyncTest('Fetch content from ushell container with invalid ID', function() {
	expect(3);
	var that = this;
	sap.apf.utils.navContainer.fetchContent("myInvalidId", 'sap.apf.selectionVariant', this.messageHandler, function(content, messageObject) {
		ok(content === null, "No content returned");
		equal(messageObject.code, "5040", "Error while fetching content");
		equal(that.messageHandler.spyResults.putMessage.code, "5040", "Put message threw correct message code");
		start();
	});
});
asyncTest('Fetch content from ushell container with invalid container name', function() {
	expect(3);
	var that = this;
	sap.apf.utils.navContainer.pushContent('hugo', 'sap.apf.selectionVariant', this.messageHandler, function(containerId, messageObject) {
		sap.apf.utils.navContainer.fetchContent(containerId, 'myInvalidContainerName', that.messageHandler, function(content, messageObject) {
			ok(content === null, "No content returned");
			equal(messageObject.code, "5040", "Error while fetching content");
			equal(that.messageHandler.spyResults.putMessage.code, "5040", "Put message threw correct message code");
			start();
		});
	});
});
