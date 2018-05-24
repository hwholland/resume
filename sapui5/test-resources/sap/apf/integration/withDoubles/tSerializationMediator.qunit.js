jQuery.sap.require('sap.ui.thirdparty.qunit');
jQuery.sap.require('sap.ui.thirdparty.sinon');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.utils.serializationMediator');
jQuery.sap.require('sap.apf.utils.filterIdHandler');
jQuery.sap.require('sap.apf.utils.startFilterHandler');
jQuery.sap.require('sap.apf.core.instance');
(function() {
	'use strict';
	QUnit.module('Serialization Mediator', {
		beforeEach : function(assert) {
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			sap.apf.testhelper.doubles.OriginalPersistence = sap.apf.core.Persistence;
			sap.apf.core.Persistence = function() {
				this.createPath = function(sName, fnCallback, oExternalObject) {
					fnCallback(sName, fnCallback, oExternalObject);
				};
				this.modifyPath = function(sPathId, sName, fnCallback, oExternalObject) {
					fnCallback(sPathId, sName, fnCallback, oExternalObject);
				};
				this.openPath = function(sPathId, fnCallback, nActiveStep) {
					assert.equal(sPathId, 'myPathId', 'PathID successfully forwarded to sap.apf.core.Persistence.openPath()');
					assert.ok(typeof fnCallback === 'function', 'Callback function successfully forwarded to sap.apf.core.Persistence.openPath()');
					assert.equal(nActiveStep, 0, 'Active step successfully forwarded to sap.apf.core.Persistence.openPath()');
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
				};
			};
			var oMessageHandler = new sap.apf.core.MessageHandler();
			var oCoreApi = new sap.apf.core.Instance({
				instances: {
					messageHandler : oMessageHandler
				}
			});
			var oFilterIdHandler = new sap.apf.utils.FilterIdHandler({
				functions : {
					setRestrictionByProperty : function() {
					},
					getRestrictionByProperty : function() {
					}
				},
				instances : {
					messageHandler : oCoreApi.getMessageHandler()
				}
			});
			this.oFilterIdHandlerStub = sinon.stub(oFilterIdHandler, 'deserialize', function(deserializableData) {
				assert.deepEqual(deserializableData, {
					fih : 'fih'
				}, 'Deserializable application specifi path filters are forwarded to FilterIdHandler');
			});
			var oStartFilterHandler = new sap.apf.utils.StartFilterHandler({
				instances : {
					messageHandler : oMessageHandler
				}
			});
			this.oStartFilterHandlerStub = sinon.stub(oStartFilterHandler, 'deserialize', function(deserializableData) {
				assert.deepEqual(deserializableData, {
					sfh : 'sfh'
				}, 'Deserializable start filter handler is forwarded to StartFilterHandler');
			});
			this.oSerializationMediator = new sap.apf.utils.SerializationMediator({
				instances : {
					coreApi : oCoreApi,
					filterIdHandler : oFilterIdHandler,
					startFilterHandler : oStartFilterHandler
				}
			});
			this.expectedExternalObject = {
					filterIdHandler : {},
					startFilterHandler : {
						restrictionsSetByApplication : {}, 
						startFilters : []
					}
			};
		},
		afterEach : function() {
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			sap.apf.core.Persistence = sap.apf.testhelper.doubles.OriginalPersistence;
			this.oFilterIdHandlerStub.restore();
		}
	});
	QUnit.test('Persistence method createPath() receives all parameters from SerializationMediator savePath()', function(assert) {
		assert.expect(3);
		var callbackCreate = function(sName, fnCallback, oExternalObject) {
			assert.equal(sName, 'myPath', 'First parameter is path name');
			assert.ok(typeof fnCallback === 'function', 'Second parameter is callback function');
			assert.deepEqual(oExternalObject, this.expectedExternalObject, 'Third parameter is non-core object');
		}.bind(this);
		this.oSerializationMediator.savePath('myPath', callbackCreate);
	});
	QUnit.test('Persistence method modifyPath() receives all parameters from SerializationMediator savePath()', function(assert) {
		assert.expect(4);
		var callbackModify = function(sPathId, sName, fnCallback, oExternalObject) {
			assert.equal(sPathId, 'myPathId', 'First parameter is path id');
			assert.equal(sName, 'myPath', 'Second parameter is path name');
			assert.ok(typeof fnCallback === 'function', 'Third parameter is callback function');
			assert.deepEqual(oExternalObject, this.expectedExternalObject, 'Fourth parameter is non-core object');
		}.bind(this);
		this.oSerializationMediator.savePath('myPathId', 'myPath', callbackModify);
	});
	QUnit.test('Persistence method openPath() receives all parameters from SerializationMediator openPath()', function(assert) {
		assert.expect(8); //3 in callback below, 3 in sap.apf.core.Persistence#openPath and 1 in oFilterIdHandlerStub.deserialize() and 1 in oStartFilterHandlerStub.deserialize()
		var callbackOpen = function(oResponse, metadata, messageObjectForUi) {
			assert.deepEqual(oResponse.path.SerializedAnalysisPath, {}, 'First callback parameter is correct and property filterIdHandler was removed from serialized analysis path');
			assert.equal(metadata, 'metadata', 'Second callback parameter contains metadata');
			assert.equal(messageObjectForUi, 'messageObjectForUi', 'Third parameter contains message object for UI');
		};
		this.oSerializationMediator.openPath('myPathId', callbackOpen, 0);
	});
})();