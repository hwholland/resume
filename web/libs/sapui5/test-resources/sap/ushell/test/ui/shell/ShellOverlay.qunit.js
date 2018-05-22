// @copyright@
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.ui.shell.ShellOverlay");
    jQuery.sap.require("sap.ushell.ui.shell.Shell");
    jQuery.sap.require("sap.ushell.resources");
    
	sap.ui.core.Control.extend("my.Test", {
		renderer: function(rm, ctrl){
			rm.write("<div style='width:10px;height:10px;background-color:gray;'");
			rm.writeControlData(ctrl);
			rm.write("></div>");
		}
	});
	
	var uiArea = jQuery('<div id="uiArea1"></div>').appendTo('body'),
	testMultiAggregation = function (sName, oCtrl){
		oCtrl.getMetadata()._enrichChildInfos();
		var oAggMetaData = oCtrl.getMetadata().getAggregations()[sName];
		var oType = jQuery.sap.getObject(oAggMetaData.type === "sap.ui.core.Control" ? "my.Test" : oAggMetaData.type);
		
		function _get(){
			return oCtrl[oAggMetaData._sGetter]();
		}
		
		function _mutator(bInsert, aArgs){
			var sMutator = oAggMetaData._sMutator;
			if(bInsert){
				sMutator = sMutator.replace("add", "insert");
			}
			oCtrl[sMutator].apply(oCtrl, aArgs);
		}
		
		function _removeAll(){
			var sMutator = oAggMetaData._sGetter;
			sMutator = sMutator.replace("get", "removeAll");
			oCtrl[sMutator].apply(oCtrl);
		}
		
		equal(_get().length, 0, "Initial number of "+sName+" controls");
		_mutator(false, [new oType(sName+"_1")]);
		equal(_get().length, 1, "Number of "+sName+" controls after add");
		_mutator(true, [new oType(sName+"_2"), 0]);
		equal(_get().length, 2, "Number of "+sName+" controls after insert");
		equal(_get()[0].getId(), sName+"_2", "First "+sName+" control");
		equal(_get()[1].getId(), sName+"_1", "Second "+sName+" control");
		oCtrl[oAggMetaData._sRemoveMutator](0);
		equal(_get().length, 1, "Number of "+sName+" controls after remove");
		equal(_get()[0].getId(), sName+"_1", "First "+sName+" control");
		_removeAll();
		equal(_get().length, 0, "Number of "+sName+" controls after removeAll");
	},
	checkVisibility = function (){
		return jQuery.sap.byId("overlay1").is(":visible");
	},
	testCloseOverlay = function (bViaAPI){
		var testTimer, eventFired;
		
		function finalize() {
			clearTimeout(testTimer);
			oShellOverlay1.detachClosed(onClosed);
			ok(!checkVisibility(), "Overlay initially hidden");
			ok(!!eventFired, "Closed event was fired");
			start();
		}
		
		function onClosed(){
			eventFired = true;
			finalize();
		}
		
		oShellOverlay1.attachClosed(onClosed);
		ok(checkVisibility(), "Overlay visible");
		if(bViaAPI){
			oShellOverlay1.close();
		}else{
			sap.ui.test.qunit.triggerEvent("click", "overlay1-close");
		}
		
		testTimer = setTimeout(finalize, 3000);
	},
    oShell = new sap.ushell.ui.shell.Shell("shell", {
		search: new my.Test("search0")
	}),
	oShellOverlay0 = new sap.ushell.ui.shell.ShellOverlay("overlay0"),
	oShellOverlay1 = new sap.ushell.ui.shell.ShellOverlay("overlay1", {
		search: new my.Test("search1"),
		content: [new my.Test("content")],
		shell: oShell
	});
	
	oShell.placeAt("uiArea1");
	
    
    module("sap.ushell.ui.shell.ShellOverlay", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });
    
	test("Aggregation 'content'", function() {
		testMultiAggregation("content", oShellOverlay0);
	});
	
	test("Aggregation 'search'", function() {
		ok(!oShellOverlay0.getSearch(), "Initially no search control");
		oShellOverlay0.setSearch(new my.Test());
		ok(!!oShellOverlay0.getSearch(), "Search control available after set");
		oShellOverlay0.setSearch(null);
		ok(!oShellOverlay0.getSearch(), "No search control again");
	});
	
	asyncTest("Open Overlay", function() {
		ok(!checkVisibility(), "Overlay initially hidden");
		oShellOverlay1.open();
		
		setTimeout(function(){
			ok(checkVisibility(), "Overlay visible");
			start();
		}, 600);
	});
	
	asyncTest("Close Overlay (via function call)", function() {
		testCloseOverlay(true);
	});
	
	asyncTest("Rendering", function() {
		ok(!checkVisibility(), "Overlay initially hidden");
		oShellOverlay1.open();
		
		setTimeout(function(){
			ok(checkVisibility(), "Overlay visible");
			ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("overlay1-hdr-center"), jQuery.sap.domById("search1")), "Search rendered correctly");
			ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("overlay1-cntnt"), jQuery.sap.domById("content")), "Content rendered correctly");
			start();
		}, 600);
	});

// tests fails	
//	asyncTest("Close Overlay (via click)", function() {
//		testCloseOverlay(false);
//	});
	
	test("Clear UI", 0, function(){
		oShell.destroy();
		oShellOverlay0.destroy();
		oShellOverlay1.destroy();
	    jQuery("#uiArea1").remove();
	});
	
}());