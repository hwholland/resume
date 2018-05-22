/**
 * Clean up of text elements, that are no longer used in a configuration
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.modeler.core.instance');
QUnit.module("M: Clean up of text pool", {
	beforeEach : function(assert) {
		var done = assert.async();
		var that = this;
		var isMockServerActive = true;
		if (jQuery.sap.getUriParameters().get("responderOff") === "true") {
			isMockServerActive = false;
		}
		function callbackForSetup() {
			var textPool = that.configurationHandler.getTextPool();
			that.unusedTextKeys = [];
			var textKey = textPool.setText("Do not do it", {
				TextElementType : "YMSG",
				MaximumLength : 21,
				TranslationHint : "Just translate"
			});
			that.configurationEditor.setCategory({
				labelKey : textKey
			});
			textKey = textPool.setText("Do it", {
				TextElementType : "YMSG",
				MaximumLength : 21,
				TranslationHint : "No slang!"
			});
			that.unusedTextKeys.push(textKey);
			textKey = textPool.setText("Do it again", {
				TextElementType : "YMSG",
				MaximumLength : 21,
				TranslationHint : "No slang!"
			});
			that.unusedTextKeys.push(textKey);
		}
		function callbackAfterSave() {
			done();
		}
		sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave, assert, done);
	},
	appA : {
		ApplicationName : "testCleanUp",
		SemanticObject : "semObjA"
	},
	afterEach : function(assert) {
		sap.apf.testhelper.modelerHelper.removeApplication(this.applicationCreatedForTest, function() { });
	}
});
QUnit.test("Cleanup", function(assert) {
	var that = this;
	var done1 = assert.async();
	var applicationId = this.applicationCreatedForTest;
	assert.ok(applicationId);
	var textPool = this.configurationHandler.getTextPool();
	var text;
	var i;
	for(i = 0; i < this.unusedTextKeys.length; i++) {
		text = textPool.get(this.unusedTextKeys[i]);
		assert.ok(text.TextElement, "text is available");
	}
	function assertTextsAreDeleted(messageObject) {
		var i;
		assert.equal(messageObject, undefined, "No errors expected");
		for(i = 0; i < that.unusedTextKeys.length; i++) {
			text = textPool.get(that.unusedTextKeys[i]);
			assert.equal(text.TextElementDescription, that.unusedTextKeys[i], "text is no longer available - only dummy returned");
		}
		done1();
	}
	textPool.removeTexts(this.unusedTextKeys, applicationId, assertTextsAreDeleted);
});