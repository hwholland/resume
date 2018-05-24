
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require('sap.ui.thirdparty.sinon');

(function() {
	'use strict';
	function commonSetup(context) {
		context.fileExists = new sap.apf.core.utils.FileExists();
		context.availableFile = 'available.hugo';
		context.notAvailableFile = 'not.available.hugo';

		context.ajaxStub = sinon.stub(jQuery, 'ajax', function(requestObject){
			if(requestObject.url === context.availableFile){
				requestObject.success();
			} else {
				requestObject.error();
			}
		});
	}
	QUnit.module("File exists ",{
		beforeEach : function () {
			commonSetup(this);
		},
		afterEach: function() {
			jQuery.ajax.restore();
		}
	});

	QUnit.test("File on server exists", function(assert) {
		var filePath = this.availableFile;
		assert.equal(this.fileExists.check(filePath), true, "File exists on server");
	});
	QUnit.test("Not existing File on server does not exist", function(assert) {
		var filePath = this.notAvailableFile;
		assert.equal(this.fileExists.check(filePath), false, "File exists not on server");
	});
	QUnit.module('Buffering of HEAD requests', {
		beforeEach : function () {
			commonSetup(this);
		},
		afterEach : function() {
			jQuery.ajax.restore();
		}
	});
	QUnit.test('Request a file that exists twice', function(assert){
		var filePath = this.availableFile;
		assert.equal(this.fileExists.check(filePath), true, "File exists on server");
		assert.equal(this.fileExists.check(filePath), true, "File still exists on server");
		assert.equal(this.ajaxStub.callCount, 1, "Ajax only called once");
	});
	QUnit.test('Request a file that not exists twice', function(assert){
		var filePath = this.notAvailableFile;
		assert.equal(this.fileExists.check(filePath), false, "File does not exist on server");
		assert.equal(this.fileExists.check(filePath), false, "File still does not exist on server");
		assert.equal(this.ajaxStub.callCount, 1, "Ajax only called once");
	});

	QUnit.module('Inject of ajax');
	QUnit.test("WHEN ajax is injected AND injected ajax should return true", function(assert) {
		assert.expect(2);
		var myAjax = function(config) {
			assert.ok(true, "injected ajax has been called");
			return config.success({}, undefined, { response : { statusCode : 400 }});
		};
		var fileExists = new sap.apf.core.utils.FileExists({ functions : { ajax : myAjax}});
		assert.ok(fileExists.check("/file/that/should/exist"), "THEN injected ajax returns success");
	});
	QUnit.test("WHEN ajax is injected AND injected ajax should return false because of http code 403", function(assert) {
		var myAjax = function(config) {
			assert.expect(2);
			assert.ok(true, "injected ajax has been called");
			return config.success({}, undefined, { response : { statusCode : 403 }});
		};
		var fileExists = new sap.apf.core.utils.FileExists({ functions : { ajax : myAjax}});
		assert.notOk(fileExists.check("/file/that/should/exist"), "THEN injected ajax says, that file does not exist");
	});
	QUnit.test("WHEN ajax is injected AND injected ajax should return false", function(assert) {
		var myAjax = function(config) {
			assert.expect(2);
			assert.ok(true, "injected ajax has been called");
			return config.error({});
		};
		var fileExists = new sap.apf.core.utils.FileExists({ functions : { ajax : myAjax}});
		assert.notOk(fileExists.check("/file/that/should/exist"), "THEN injected ajax says, that file does not exist");
	});
}());