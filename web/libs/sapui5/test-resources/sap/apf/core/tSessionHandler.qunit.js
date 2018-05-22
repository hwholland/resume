jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.core.sessionHandler");
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.core.constants');

(function() {
	'use strict';

	QUnit.module('SessionHandler: no entityType in logical system set', {
		beforeEach : function(assert) {
			var that = this;
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			// test idea the double is the original session handler + stub for ajax
			//so use the double
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;

			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();

			that.buildUriSpy = sinon.spy();
			that.buildUriSpy.returnValues[0] = function() {
				return "buildUri";
			};

			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : {
						getUriGenerator : function() {
							return {
								buildUri : that.buildUriSpy,
								getAbsolutePath : function() {
									return "absolutePath";
								}
							};
						}
					}
				}
			};
			this.oSessionHandler = new sap.apf.core.SessionHandler(this.oInject);
		},
		afterEach : function(assert) {
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		}
	});
	QUnit.test('SessionHandler ajax stub', function(assert) {
		assert.ok(this.oSessionHandler.getXsrfToken('serviceRoot').indexOf("dummyXsrfTokenFromSessionHandlerNew") > -1, "Returned XSRF token is correct");
	});

	QUnit.test('XSRF Token handling and caching', function(assert) {
		var sTokenServiceRoot1 = this.oSessionHandler.getXsrfToken('serviceRoot1');
		var sTokenServiceRoot2 = this.oSessionHandler.getXsrfToken('serviceRoot2');

		assert.notEqual(sTokenServiceRoot1, sTokenServiceRoot2, "Different XSRF token for different service roots received");

		assert.equal(sTokenServiceRoot1, this.oSessionHandler.getXsrfToken('serviceRoot1'), "Second call for XSRF token returns same token as on first call");
		assert.ok(this.oSessionHandler.ajax.calledTwice, 'Second call for XSRF token returns token from hashtable and does not trigger another ajax request');
	});

	QUnit.module('Dirty state');
	QUnit.test('Default is not dirty', function(assert) {
	    var sessionHandler = new sap.apf.core.SessionHandler({instances : {}});
        assert.strictEqual(sessionHandler.isDirty(), false, 'Initial session handler returns not dirty');
    });
	QUnit.test('Dirty after having been set to dirty', function(assert) {
	    var sessionHandler = new sap.apf.core.SessionHandler({instances : {}});
	    sessionHandler.setDirtyState(true);
	    assert.strictEqual(sessionHandler.isDirty(), true, 'Last set state returned');
	});
	
	QUnit.module('Path name');
	QUnit.test('Default is empty string', function(assert) {
	    var sessionHandler = new sap.apf.core.SessionHandler({instances : {}});
	    assert.strictEqual(sessionHandler.getPathName(), '', 'Initial session handler returns empty string for path name');
	});
	QUnit.test('Last set name returned on get', function(assert) {
	    var sessionHandler = new sap.apf.core.SessionHandler({instances : {}});
	    sessionHandler.setPathName('Unnamed path');
	    assert.strictEqual(sessionHandler.getPathName(), 'Unnamed path', 'Last set path name returned');
	    sessionHandler.setPathName("Hugo's delight");
	    assert.strictEqual(sessionHandler.getPathName(), "Hugo's delight", 'Last set path name returned');
	});
	QUnit.test('Set name with a non-string type argument implicitely sets name to empty string', function(assert) {
	    var sessionHandler = new sap.apf.core.SessionHandler({instances : {}});
	    sessionHandler.setPathName(undefined);
	    assert.strictEqual(sessionHandler.getPathName(), '', '"undefined" converted to empty string');
	    sessionHandler.setPathName(null);
	    assert.strictEqual(sessionHandler.getPathName(), '', '"null" converted to empty string');
	    sessionHandler.setPathName(0);
	    assert.strictEqual(sessionHandler.getPathName(), '', '"0" converted to empty string');
	    sessionHandler.setPathName([1, 2, 3]);
	    assert.strictEqual(sessionHandler.getPathName(), '', 'Array converted to empty string');
	    sessionHandler.setPathName({prop : 'val'});
	    assert.strictEqual(sessionHandler.getPathName(), '', 'Object converted to empty string');
	    sessionHandler.setPathName(/^[a-z]{3,6}/);
	    assert.strictEqual(sessionHandler.getPathName(), '', 'Regex converted to empty string');
	});
}());
