/*global QUnit*/

function startFakeLREP(sModulePath){
	jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
	jQuery.sap.require("sap.ui.rta.util.FakeLrepConnectorLocalStorage");
	
	jQuery.extend(sap.ui.fl.FakeLrepConnector.prototype, sap.ui.rta.util.FakeLrepConnectorLocalStorage);
	sap.ui.fl.FakeLrepConnector.enableFakeConnector(jQuery.sap.getModulePath(sModulePath) + ".json");
}
function renderTestModuleAt(sNamespace, sDomId){
	var oCompCont = new sap.ui.core.ComponentContainer("CompCont1", {
		name : sNamespace,
		id : "Comp1",
		settings : {
			componentData : {
				"showAdaptButton" : true
			}
		}
	}).placeAt(sDomId);
	sap.ui.getCore().applyChanges();
	
	return oCompCont;
}

function renderTestAppAt(sDomId){
	startFakeLREP("sap.ui.rta.test.FakeLrepConnector");

	var oCompCont = new sap.ui.core.ComponentContainer("CompCont1", {
		name : "sap.ui.rta.test",
		id : "Comp1",
		settings : {
			componentData : {
				"showAdaptButton" : true
			}
		}
	}).placeAt(sDomId);
	sap.ui.getCore().applyChanges();
	
	return oCompCont;
}

function waitForChangesToReachedLrepAtTheEnd(iNumberOfChanges, assert) {
		var done = [];
		for (var i = 0; i < iNumberOfChanges; i++) {
			done.push(assert.async());
		}
		var iChangeCounter = 0;
		var fnAssert = function() {
			iChangeCounter++;
			if (iChangeCounter === iNumberOfChanges) {
				sap.ui.rta.util.FakeLrepLocalStorage.detachModifyCallback(fnAssert);
				assert.equal(iChangeCounter, iNumberOfChanges, "then the rta changes are written to LREP");
			}
			done[iChangeCounter - 1]();
		};

		sap.ui.rta.util.FakeLrepLocalStorage.attachModifyCallback(fnAssert);
	}

function removeTestViewAfterTestsWhenCoverageIsRequested(){
	QUnit.done(function(details) {
		// If coverage is requested, remove the view to not overlap the coverage result
		if (QUnit.config.coverage == true && details.failed === 0) {
			jQuery("#test-view").hide();
		}
	});
}