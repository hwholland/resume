jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../');

jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
jQuery.sap.require('sap.apf.Component');
jQuery.sap.require('sap.apf.ui.instance');

(function() {
	'use strict';
	var oGlobalApi1, oGlobalApi2;
	function doNothing() {
	}
	function getTextEncodedStub(x) {
		return x;
	}
	QUnit.module('Multiple Instance of UI API', {
		beforeEach : function() {
			oGlobalApi1 = new sap.apf.testhelper.doubles.UiApi("Comp1");
			oGlobalApi2 = new sap.apf.testhelper.doubles.UiApi("Comp2");
		},
		afterEach : function() {
			oGlobalApi2.oCompContainer.destroy();
			oGlobalApi1.oCompContainer.destroy();
		}
	});
	QUnit.test('When Creating Application Layout', function(assert) {
		//arrangements
		sinon.stub(oGlobalApi1.oCoreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
		sinon.stub(oGlobalApi2.oCoreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
		sinon.stub(oGlobalApi1.oUiApi.getAnalysisPath().getController(), 'drawThumbnail', doNothing);
		sinon.stub(oGlobalApi1.oUiApi.getStepContainer().getController(), 'drawRepresentation', doNothing);
		//action
		oGlobalApi1.oUiApi.createApplicationLayout();
		sap.ui.getCore().applyChanges();
		oGlobalApi2.oUiApi.createApplicationLayout();
		sap.ui.getCore().applyChanges();
		//assert
		assert.notDeepEqual(oGlobalApi2, oGlobalApi1, "Then Two Separate Instance for Application is Created");
		assert.notDeepEqual(oGlobalApi1.oUiApi.getLayoutView(), oGlobalApi2.oUiApi.getLayoutView(), "Then Two Separate Instances of Layout Created");
		assert.strictEqual(oGlobalApi1.oCoreApi.getSteps().length, 0, "Then No step is created for First Instance on application load");
		assert.strictEqual(oGlobalApi2.oCoreApi.getSteps().length, 0, "Then No step is created for Second Instance on application load");
		oGlobalApi1.oUiApi.getAnalysisPath().getController().drawThumbnail.restore();
		oGlobalApi1.oUiApi.getStepContainer().getController().drawRepresentation.restore();
		oGlobalApi1.oCoreApi.getTextNotHtmlEncoded.restore();
		oGlobalApi2.oCoreApi.getTextNotHtmlEncoded.restore();
	});
})();
