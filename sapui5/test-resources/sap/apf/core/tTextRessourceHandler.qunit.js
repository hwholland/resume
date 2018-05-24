jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.textResourceHandler');
jQuery.sap.require('sap.apf.core.resourcePathHandler');
jQuery.sap.require('sap.apf.core.messageObject');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.core.utils.uriGenerator'); // need apfLocation for ui5 resource loading by UI5

(function() {
	'use strict';

	function commonSetupTextresourceHandler(oContext) {
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		oContext.oMessageHandler = oMessageHandler;
		oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : oMessageHandler
			}
		});
		var oInject = {
			instances : {
				messageHandler : oMessageHandler,
				coreApi : oContext.oCoreApi
			}
		};
		oContext.oTextHandler = new sap.apf.core.TextResourceHandler(oInject); // <<<<< unit under test
	}
	QUnit.module('TRH -- GetText', {
		beforeEach : function(assert) {
			var that = this;
			commonSetupTextresourceHandler(this);
			//----------------
			this.stubText = function(key, value) {
				this.createStubs4TextResourceHandler(key, value);
			};
			this.checkSpy = sinon.spy(this.oMessageHandler, "check");
			this.putMessageSpy = sinon.spy(this.oMessageHandler, "putMessage");
			this.oApfLabelError = {
				type : "label",
				kind : "text",
				key : "e000"
			};
			/**
			 * The function stubs away all access to the UI5 resource handling so that the unit under test is provisioned by the stubs
			 * @param key
			 * @param value
			 */
			this.createStubs4TextResourceHandler = function(key, value) {
				that.xStubbed = true;
				/**
				 * Builds bundle of UI5 without called UI5.
				 * @constructor
				 */
				that.ResourceBundleStub = function() {
					this.aPropertyFiles = [];
					var obj = {
						aKeys : []
					};
					obj.aKeys.push(key);
					this.aPropertyFiles.push(obj);
					this.getText = function(inKey, aArgs, bCustomBundle) {
						switch (inKey) {
							case key:
								return value;
							default:
								if(!bCustomBundle) {
									return inKey;
								} 
								return;
						}
					};
					this._enhance = function () {};
				};
				that.resourceBundle = new that.ResourceBundleStub(); // attention: singleton per test
				that.spyGetText = sinon.spy(that.resourceBundle, "getText");
				that.stubSapResources = sinon.stub(jQuery.sap, "resources", function() {
					return that.resourceBundle;
				});
				that.stubSapEncodeHTML = sinon.spy(jQuery.sap, "encodeHTML");
				//            , function (text) {
				//                return text;
				//            });
				that.stubGetResourceLocation = sinon.stub(that.oCoreApi, "getResourceLocation", function() {
					return "foo";
				});
				that.stubUI5getOriginInfo = sinon.stub(sap.ui.getCore().getConfiguration(), "getOriginInfo", function() {
					return undefined;
				});
			};
			this.unstubAll = function() {
				if (that.xStubbed) {
					that.xStubbed = false;
					that.stubGetResourceLocation.restore();
					that.stubUI5getOriginInfo.restore();
					that.stubSapResources.restore();
					that.stubSapEncodeHTML.restore();
				}
			};
		},
		afterEach : function(assert) {
			this.checkSpy.restore();
			this.putMessageSpy.restore();
			this.unstubAll();
		}
	});
	QUnit.test("GIVEN ui5 resource stub WHEN getMessagesText() THEN getText() from return of jQuery.sap.resources()", function(assert) {
		this.stubText(200, "OK");
		var sEncodedText = this.oTextHandler.getMessageText(200);
		assert.equal(sEncodedText, "OK");
		//Why needed?
		//assert.ok(this.stubSapResources.calledTwice); // for apf and appl resource
		//assert.ok(this.stubUI5getOriginInfo.calledTwice);
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.test('GIVEN non stub WHEN label kind invalid THEN return ""', function(assert) {
		assert.throws(function() {
			this.oTextHandler.getTextNotHtmlEncoded({
			kind : "xxx"});
		});
	});
	QUnit.test('GIVEN stub WHEN getTextNotHtmlEncoded input string invalid THEN return error 3001 ""', function(assert) {
		this.stubText("ok", "OK");
		assert.throws(function() {
			assert.equal("", this.oTextHandler.getTextNotHtmlEncoded("invalid string"), 'shall throw');
		});
		assert.ok(this.stubSapResources.called, "tried to retrieve key");
		assert.ok(!this.checkSpy.threw(), "NO check threw");
		assert.ok(this.putMessageSpy.threw(), "putMsg threw");
		assert.ok(this.putMessageSpy.getCall(0).args[0].getCode() === "3001", "3001");
	});
	QUnit.test('GIVEN stub WHEN getTextHtmlEncoded called THEN text retrieved from jQuery.sap.resources AND jQuery.sap.encodeHTML() called', function(assert) {
		this.stubText("okKey", "OK");
		assert.equal("OK", this.oTextHandler.getTextHtmlEncoded("okKey", [ "xyz" ]), 'valid key');
		assert.ok(!this.checkSpy.threw(), "check");
		assert.ok(!this.putMessageSpy.threw(), "putMsg");
		assert.ok(this.stubSapResources.called);
		assert.ok(this.stubSapEncodeHTML.calledOnce, "encodeHTML() called");
	});
	QUnit.test('GIVEN stub WHEN getTextNotHtmlEncoded input key of type string THEN return value', function(assert) {
		this.stubText("okKey", "OK");
		assert.equal("OK", this.oTextHandler.getTextNotHtmlEncoded("okKey"), 'valid key');
		assert.ok(!this.checkSpy.threw(), "check");
		assert.ok(!this.putMessageSpy.threw(), "putMsg");
		assert.ok(this.stubSapResources.called);
	});
	QUnit.test('WHEN wrong input format of label object THEN check throws an error', function(assert) {
		this.stubText(0, "nop");
		assert.throws(function() {
			this.oTextHandler.getTextNotHtmlEncoded({});
		});
		assert.ok(this.checkSpy.threw(), "check threw");
		assert.ok(this.checkSpy.calledWith(false), "cond false");
		assert.ok(!this.stubSapResources.called, "never called");
		assert.equal("Error - oLabel is not compatible", this.checkSpy.getCall(0).args[1], "msg ok");
	});
	QUnit.test('WHEN label kind="text" & key THEN plain text returned', function(assert) {
		this.stubText(4711, "Cancel");
		var sText = this.oTextHandler.getTextNotHtmlEncoded({
			type : "label",
			kind : "text",
			key : 4711
		});
		assert.equal(sText, "Cancel");
	});
	QUnit.test('WHEN label text with placeholders THEN plain text returned and no placeholders replaced', function(assert) {
		this.stubText("e000", "Internal Error occurred {0}  {1}  {2} {3}");
		var sText = this.oTextHandler.getTextNotHtmlEncoded(this.oApfLabelError);
		assert.equal(sText, "Internal Error occurred {0}  {1}  {2} {3}", "No replacement, no HTML encoding expected");
		assert.ok(this.spyGetText.getCall(0).args[0] === "e000", "key");
		assert.ok(this.spyGetText.getCall(0).args[1] === undefined, "no aParameters");
	});
	QUnit.test("WHEN called with parameters for placeholders, THEN parameters will be passed to UI5", function(assert) {
		this.stubText("e000", "nop");
		var aParameters = [ "noContent" ];
		this.oTextHandler.getTextNotHtmlEncoded(this.oApfLabelError, aParameters);
		assert.ok(this.spyGetText.calledOnce);
		assert.ok(this.spyGetText.getCall(0).args[1] === aParameters, "aParameters");
	});
	QUnit.test("GIVEN label & stub WHEN call getTextHtmlEncoded THEN HTML encoded text", function(assert) {
		var text = "ülle gülle 'äh'";
		this.stubText(4711, text);
		var sEncodedText = this.oTextHandler.getTextHtmlEncoded({
			type : "label",
			kind : "text",
			key : 4711
		});
		assert.ok(this.spyGetText.calledOnce);
		assert.equal(this.spyGetText.returnValues[0], text, "return");
		assert.ok(this.stubSapEncodeHTML.calledOnce);
		assert.ok(this.stubSapEncodeHTML.getCall(0).args[0] === text);
		assert.ok(this.stubSapEncodeHTML.getCall(0).args[1] === undefined);
		assert.equal(jQuery.sap.encodeHTML(text), sEncodedText, "result encoded");
	});
	QUnit.test("GIVEN label & stub WHEN call getTextHtmlEncoded with parameter THEN result encoded & UI5 called with parameters", function(assert) {
		var aParameters = [ "noContent" ];
		var text = "any 'text'";
		this.stubText(4711, text);
		var sEncodedText = this.oTextHandler.getTextHtmlEncoded({
			type : "label",
			kind : "text",
			key : 4711
		}, aParameters);
		assert.ok(this.spyGetText.calledOnce);
		assert.equal(this.spyGetText.returnValues[0], text, "return");
		assert.ok(this.stubSapEncodeHTML.calledOnce);
		assert.ok(this.stubSapEncodeHTML.getCall(0).args[0] === text);
		assert.ok(this.spyGetText.getCall(0).args[1] === aParameters, "aParameters");
		assert.equal(jQuery.sap.encodeHTML(text), sEncodedText, "result encoded");
	});
	QUnit.test("GIVEN key & stub WHEN call getMessageText with parameter THEN result non-encoded & UI5 called with parameters", function(assert) {
		var aParameters = [ "noContent" ];
		var text = "any text";
		this.stubText(4711, text);
		var sEncodedText = this.oTextHandler.getMessageText(4711, aParameters);
		assert.ok(this.spyGetText.calledOnce);
		assert.equal(this.spyGetText.returnValues[0], text, "return");
		assert.ok(this.spyGetText.getCall(0).args[1] === aParameters, "aParameters");
		assert.equal(text, sEncodedText, "result non-encoded");
	});
	QUnit.test("GET text from registered texts", function(assert){
		this.oTextHandler.registerTextWithKey("registeredKey", "registered Text");
		var sEncodedText = this.oTextHandler.getTextNotHtmlEncoded("registeredKey");
		assert.equal(sEncodedText, "registered Text", "THEN text is available");
	});
	QUnit.test("GET text from registered texts with parameters", function(assert){
		this.oTextHandler.registerTextWithKey("registeredKey", "registered Text {0} and {1}");
		var sEncodedText = this.oTextHandler.getTextNotHtmlEncoded("registeredKey", ["param1", "param2"]);
		assert.equal(sEncodedText, "registered Text param1 and param2", "THEN text is available with substituted placeholders");
	});
	QUnit.test('GIVEN string key WHEN getTextHtmlEncoded called two times THEN oBundle.getText is not called multiple times', function(assert) {
		this.stubText("okKey", "OK");
		this.oTextHandler.getTextHtmlEncoded("okKey");
		assert.ok(this.spyGetText.calledOnce, "Checked for text and get it");
		this.oTextHandler.getTextHtmlEncoded("okKey");
		assert.ok(this.spyGetText.calledOnce, "getText is not called again");
	});
	QUnit.test('GIVEN label WHEN getTextHtmlEncoded called two times THEN oBundle.getText is not called multiple times', function(assert) {
		var text = "any 'text'";
		this.stubText(12345, text);
		var oLabel = {
			type : "label",
			kind : "text",
            key : 12345
        };
		this.oTextHandler.getTextHtmlEncoded(oLabel);
		assert.ok(this.spyGetText.calledOnce, "Checked for text and get it");
		this.oTextHandler.getTextHtmlEncoded(oLabel);
		assert.ok(this.spyGetText.calledOnce, "getText is not called again");
	});
	QUnit.test('GIVEN key and empty text THEN empty text is returned', function (assert) {
		var key = "54321";
		this.stubText(key, "");
		var text = this.oTextHandler.getTextHtmlEncoded(key);
		assert.equal(text, "", "empty text returned");
	});
	QUnit.module("Get texts loaded from data base", {
		beforeEach : function(assert) {
			var that = this;
			commonSetupTextresourceHandler(this);
			this.oCoreApi.getResourceLocation = function(sId) {
				return "notRelevant";
			};
			that.EmptyResourceBundleStub = function() {
				this.aPropertyFiles = [];
				this.getText = function(key) {
					if (key === "Text1") {
						return "text1";
					}
					return;
				};
				this._enhance = function() {};
			};
			that.resourceBundle = new that.EmptyResourceBundleStub(); // attention: singleton per test
			that.stubSapResources = sinon.stub(jQuery.sap, "resources", function() {
				return that.resourceBundle;
			});
		},
		afterEach : function(assert) {
			this.stubSapResources.restore();
		}
	});
	QUnit.test("Return Texts have been loaded from Database", function(assert) {
		var textElements = [ {
			TextElement : "guid1",
			TextElementDescription : "nice text1"
		}, {
			TextElement : "guid2",
			TextElementDescription : "nice guid2"
		} ];
		this.oTextHandler.loadTextElements(textElements);
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("guid1"), "nice text1", "Expected Text");
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded({
			type : "label",
			kind : "text",
			key : "guid1"
		}), "nice text1", "Expected Text");
	});
	QUnit.test("Text from Resourcebundle wins over text loaded from database", function(assert){
		var  textElements = [ {
			TextElement : "Text1",
			TextElementDescription : "nice text1"
		} ];
		this.oTextHandler.loadTextElements(textElements);
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("Text1"), "text1", "THEN text is taken from resource bundle and not from database");
	});
	QUnit.test("Get Text for the initial text key", function(assert) {
		var textElements = [ {
			TextElement : "guid1",
			TextElementDescription : "nice text1"
		}, {
			TextElement : "guid2",
			TextElementDescription : "nice guid2"
		} ];
		this.oTextHandler.loadTextElements(textElements);
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded(sap.apf.core.constants.textKeyForInitialText), "", "Empty Text expected");
	});
	QUnit.module('Resource model', {
		beforeEach : function() {
			var that = this;
			that.xStubbed = true;
			commonSetupTextresourceHandler(this);
			this.checkSpy = sinon.spy(this.oMessageHandler, "check");
			this.oCoreApi.getResourceLocation = function(sId) {
				if(sap.apf.core.constants.resourceLocation.apfUiTextBundle || sap.apf.core.constants.resourceLocation.applicationMessageTextBundle) {
					return sId + ".properties";
				}
				return sId;
			};
			that.orig = jQuery.sap.properties;
			var sapfUiTextBundleUrl = that.oCoreApi.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
			var sApplicationMessageUrl = that.oCoreApi.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
			that.origProperties = jQuery.sap.properties;
			that.stubProperties = sinon.stub(jQuery.sap, "properties", function (mParams) {
				var Properties = function (mProperties, aKeys) {
					this.mProperties = mProperties;
					this.aKeys = aKeys;

					this.getProperty = function (key) {
						return this.mProperties[key];
					};
				};

				if(mParams.url === sapfUiTextBundleUrl) {
					return new Properties({
							"foo": "bar",
							"foo1": "bar1"
						},["foo", "foo1"]);
				} else if(mParams.url === sApplicationMessageUrl) {
					return new Properties({
							"foo1": "barNew",
							"foo3": "bar3",
							"fooWithParameters" : "a {0} {1}"
						},["foo1", "foo3", "fooWithParameters"]);
				} 
				return that.origProperties(mParams);
			});
		},
		afterEach : function() {
			this.checkSpy.restore();
			this.stubProperties.restore();
		}
	});
	QUnit.test("Check if text of apfUiTextBundle resource bundle can be retrieved", function (assert) {
		assert.equal(this.oTextHandler.getMessageText("foo"), "bar", "Text from apfUiTextBundle text bundle received");
	});
	QUnit.test("Check if text of applicationMessageTextBundle resource bundle can be retrieved", function (assert) {
		assert.equal(this.oTextHandler.getMessageText("foo3"), "bar3", "Text from applicationMessageTextBundle text bundle received");
	});
	QUnit.test("Check if text of apfUiTextBundle resource bundle is overridden by applicationMessageTextBundle", function (assert) {
		assert.equal(this.oTextHandler.getMessageText("foo1"), "barNew", "applicationMessageTextBundle bundle overrides apfUiTextBundle");
	});
	QUnit.test("Check if key is returned if text is not found", function (assert) {
		assert.equal(this.oTextHandler.getMessageText("notFound"), "notFound", "Key is returned if not found");
	});
	QUnit.test("Check that parameters are substituted always on repeated calls for message texts", function(assert) {
		assert.equal(this.oTextHandler.getMessageText("fooWithParameters", ["1", "2"]), "a 1 2", "Parameters are substituted");
		assert.equal(this.oTextHandler.getMessageText("fooWithParameters", ["2", "2"]), "a 2 2", "Parameters are substituted");
	});
	QUnit.test("Check that parameters are substituted always on repeated calls", function(assert) {
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("fooWithParameters", ["1", "2"]), "a 1 2", "Parameters are substituted properly");
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("fooWithParameters", ["2", "2"]), "a 2 2", "Different Parameters for same key are also substituted properly");
	});
	QUnit.test("WHEN repeated calls with invalid key and different parameter", function(assert){
		this.oMessageHandler.spyPutMessage();
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("invalidKey", ["1", "2"]), "# text not available: invalidKey", "ok");
		assert.equal(this.oTextHandler.getTextNotHtmlEncoded("invalidKey", ["2", "2"]), "# text not available: invalidKey", "ok");
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, 3001, "THEN messagehandler was called only once");
	});
}());