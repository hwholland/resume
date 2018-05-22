jQuery.sap.require('sap.apf.utils.serializationMediator');

(function() {
	'use strict';

	QUnit.module('Serialization Mediator', {
		beforeEach : function(assert) {
			var oCoreApi = {
				savePath : function(arg1, arg2, arg3, arg4) {
					if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'function') {
						arg3(arg1, arg2, arg3, arg4);
					} else if (typeof arg1 === 'string' && typeof arg2 === 'function') {
						arg2(arg1, arg2, arg3);
					}
				},
				openPath : function(sPathId, fnCallback, nActiveStep) {
					assert.equal(sPathId, 'myPathId', 'PathID successfully forwarded to coreApi.openPath()');
					assert.ok(typeof fnCallback === 'function', 'Callback function successfully forwarded to coreApi.openPath()');
					assert.equal(nActiveStep, 0, 'Active step successfully forwarded to coreApi.openPath()');
					var oResponse = {};
					oResponse.data = {};
					oResponse.data.SerializedAnalysisPath = {};
					oResponse.data.SerializedAnalysisPath.filterIdHandler = {
						fih : 'fih'
					};
					oResponse.data.SerializedAnalysisPath.startFilterHandler = {
						sfh : 'sfh'
					};
					fnCallback({
						path : oResponse.data,
						status : 'successful'
					}, 'metadata', 'messageObjectForUi');
				},
				deletePath : function(sPathId, fnCallback) {
					fnCallback(sPathId, fnCallback);
				}
			};
			var oFilterIdHandler = {
				serialize : function() {
					return {
						fih : 'fih'
					};
				},
				deserialize : function(deserializableData) {
					assert.deepEqual(deserializableData, {
						fih : 'fih'
					}, 'Deserializable application specific path filter is forwarded to FilterIdHandler');
				}
			};
			var oStartFilterHandler = {
				serialize : function() {
					return jQuery.Deferred().resolve({
						sfh : 'sfh'
					});
				},
				deserialize : function(deserializableData) {
					assert.deepEqual(deserializableData, {
						sfh : 'sfh'
					}, 'Deserializable startFilterHandler is forwarded to StartFilterHandler');
				}
			};
			this.serializationMediator = new sap.apf.utils.SerializationMediator({
			 instances: {
				 coreApi : oCoreApi,
				 filterIdHandler : oFilterIdHandler,
				 startFilterHandler : oStartFilterHandler
			 }
			});
		}
	});
	QUnit.test('savePath() routes to coreApi.savePath() with additional argument containing serializable filter IDs and startFilterHandler', function(assert) {
		assert.expect(9);
		var callbackCreate = function(arg1, arg2, arg3) {
			assert.equal(arg1, 'myPath', 'Path name successfully forwarded to coreApi.savePath()');
			assert.ok(typeof arg2 === 'function', 'Callback function successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg3.filterIdHandler, {
				fih : 'fih'
			}, 'Serialized FIH successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg3.startFilterHandler, {
				sfh : 'sfh'
			}, 'Serialized StartFilterHandler successfully forwarded to coreApi.savePath()');
		};
		var callbackUpdate = function(arg1, arg2, arg3, arg4) {
			assert.equal(arg1, 'myPathId', 'PathID successfully forwarded to coreApi.savePath()');
			assert.equal(arg2, 'myPath', 'Path name successfully forwarded to coreApi.savePath()');
			assert.ok(typeof arg3 === 'function', 'Callback function successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg4.filterIdHandler, {
				fih : 'fih'
			}, 'Serialized FIH successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg4.startFilterHandler, {
				sfh : 'sfh'
			}, 'Serialized StartFilterHandler successfully forwarded to coreApi.savePath()');
		};
		this.serializationMediator.savePath('myPath', callbackCreate);
		this.serializationMediator.savePath('myPathId', 'myPath', callbackUpdate);
	});
	QUnit.test('serializationMediator.openPath() routes to openPath() in coreApi', function(assert) {
		assert.expect(8);
		var callbackOpen = function(oResponse, metadata, messageObjectForUi) {
			assert.deepEqual(oResponse.path.SerializedAnalysisPath, {}, 'First callback parameter is correct and property filterIdHandler and startFilterHandler was removed from serialized analysis path');
			assert.equal(metadata, 'metadata', 'Second callback parameter contains metadata');
			assert.equal(messageObjectForUi, 'messageObjectForUi', 'Third parameter contains message object for UI');
		};
		this.serializationMediator.openPath('myPathId', callbackOpen, 0);
	});
	QUnit.test('serializationMediator.deletePath() routes to deletePath() in coreApi', function(assert) {
		assert.expect(2);
		var callbackDelete = function(sPathId, fnCallback) {
			assert.equal(sPathId, 'myPathId', 'PathID successfully forwarded to coreApi.deletePath()');
			assert.ok(typeof fnCallback === 'function', 'Callback function successfully forwarded to coreApi.deletePath()');
		};
		this.serializationMediator.deletePath('myPathId', callbackDelete);
	});
}());