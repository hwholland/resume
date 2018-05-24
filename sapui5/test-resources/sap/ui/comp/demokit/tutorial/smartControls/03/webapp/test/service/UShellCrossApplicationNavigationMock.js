sap.ui.define("sap.ui.demo.smartControls.test.service.UShellCrossApplicationNavigationMock", function() {
	"use strict";

	var UShellCrossApplicationNavigationMock = function() { };

	UShellCrossApplicationNavigationMock.prototype.init = function(){
		this._oOldUShell = sap.ushell;
		
		sap.ushell = {
		              Container: {
		            	  getService: function(sService){
		            		  if (sService === "CrossApplicationNavigation"){
		            			  return UShellCrossApplicationNavigationMock.CrossApplicationNavigation;
		            		  }
		            		  
		            		  if (sService === "URLParsing"){
		            			  return UShellCrossApplicationNavigationMock.URLParsing;
		            		  }
		            		  
		            		  return null;
		            	  }
		              }
		}
	};
	
	UShellCrossApplicationNavigationMock.prototype.destroy = function(){
		sap.ushell = this._oOldUShell;
		delete this._oOldUShell;
	};
	
	UShellCrossApplicationNavigationMock._aCrossAppLinks = [
            		                                        {intent: "http://www.sap.com", text: "SAP SE"},
            		                                        {intent: "http://www.sap.com/sapphire", text: "SAP Sapphire"},
            		                                        {intent: "http://www.sap.com/hana", text: "App3"}
            		                                        ];
	
	UShellCrossApplicationNavigationMock.CrossApplicationNavigation = {
	                                                                   getSemanticObjectLinks: function(){
	                                                                	   return {
	                                                                		   fail: function() {},
	                                                                		   done: function(callback) { callback(UShellCrossApplicationNavigationMock._aCrossAppLinks); }
	                                                                	   }
	                                                                   },
	                                                                   hrefForExternal: function(sRef) { 
	                                                                	   if (sRef && sRef.target){
	                                                                		   return sRef.target.shellHash;
	                                                                	   }
	                                                                	   return sRef; 
	                                                                	   }
	};
	
	UShellCrossApplicationNavigationMock.URLParsing = {
	                                                   parseShellHash: function(sId) {
	                                                	   var sAction = "display";
	                                                	   if (sId.indexOf("hana") > -1){
	                                                		   sAction = "displayFactSheet";
	                                                	   }
	                                                	   return { action: sAction,
	                                                		   	    intent: sId 
	                                                		   	    }	                                                	   
	                                                   }	                                                                   
	};
	
	return UShellCrossApplicationNavigationMock;

}, /* bExport= */ true);
