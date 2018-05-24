jQuery.sap.declare("sap.ui.generic.app.navigation.service.CrossAppNavigationServiceMock");

sap.ui.base.Object.extend("sap.ui.generic.app.navigation.service.CrossAppNavigationServiceMock", { 
	
	constructor: function(){
		this.oAppStates = {};
	},
	
	//error modes for negative testing
	setErrorMode: function(bSaveError, bLoadError,bIntentSupportedFail,bIntentNotSupported){
		this.bSaveError = bSaveError;
		this.bLoadError = bLoadError;
		this.bIntentSupportedFail = bIntentSupportedFail;
		this.bIntentNotSupported = bIntentNotSupported || false;
	},
	
	//method for setting test data in the startup state
	setStartupAppState: function(oAppData){
		this.oStartupState = this.createEmptyAppState();
		this.oStartupState.setData(oAppData);
		return this.oStartupState.getKey();
	},
	
	//convenience method to store data in testing environment
	setAppState: function(oAppData){
		var oAppState = this.createEmptyAppState();
		oAppState.setData(oAppData);
		return oAppState.getKey();
	},
	
	//get the current startup state previous set by setStartupAppState()
	getStartupAppState: function(){
		var oMyDeferred = jQuery.Deferred();
		
		if(this.bLoadError){
			oMyDeferred.reject();
		}else{
			if(!this.oStartupState){
				oMyDeferred.reject();
			}else{
				oMyDeferred.resolve(this.oStartupState);
			}
		}
		return oMyDeferred.promise();
	},
	
	//creates an empty app state container which behaves similar to the original app state API
	createEmptyAppState: function(){
		var oCrossNavMock = this;
		var sAppStateKey = Math.floor((Math.random() * 1000000000000000) + 1); //a random number between 1 and 1000000000000000
		oCrossNavMock.oAppStates[sAppStateKey] = {
				
				getKey: function(){
					return sAppStateKey;
				},
				
				setData: function(oData){
					oCrossNavMock.oAppStates[sAppStateKey].data = oData;
				},
				getData: function(){
					return oCrossNavMock.oAppStates[sAppStateKey].data;
				},
				
				//there is not really a save to backend, just return the promise and trigger reject/resolve
				save: function(){
					var oMyDeferred = jQuery.Deferred();
					if(oCrossNavMock.bSaveError){
						oMyDeferred.reject();
					}else{
						oMyDeferred.resolve();
					}
					return oMyDeferred.promise();
				}
		};
		return oCrossNavMock.oAppStates[sAppStateKey];
	},
	
	//loads an existing app state
	getAppState: function(oComponent, sInnerAppStateKey){
		var oMyDeferred = jQuery.Deferred();
		
		if(this.bLoadError){
			oMyDeferred.reject();
		}else{
			if(!this.oAppStates[sInnerAppStateKey]){
				oMyDeferred.reject();
			}else{
				oMyDeferred.resolve(this.oAppStates[sInnerAppStateKey]);
			}
		}
		return oMyDeferred.promise();
	},
	
	//compose a navigation intent from passed navigation arguments
//	hrefForExternal: function(oNavArguments){
//		var sIntent = "#" + oNavArguments.target.semanticObject + "-" + oNavArguments.target.action;
//		for(var param in oNavArguments.params){
//			var i = 0;
//			if(i === 0){
//				sIntent += "?" + param + "=" + oNavArguments.params[param];
//			}else{
//				sIntent += "&" + param + "=" + oNavArguments.params[param];
//			}
//		}
//		return sIntent;
//	},
	
	//mocks the service which tells you if navigation is allowed - can be configured by global parameters bIntentNotSupported and bIntentSupportedFail
//	isIntentSupported: function(aIntents){
//		var oMyDeferred = jQuery.Deferred();
//		
//		if(this.bIntentSupportedFail){
//			oMyDeferred.reject();
//		}else{
//			var oTargets = {};
//			for(var i = 0; i < aIntents.length; i++){
//				oTargets[aIntents[i]] = {supported: !this.bIntentNotSupported};
//			}
//			oMyDeferred.resolve(oTargets);
//		}
//		return oMyDeferred.promise();
//	},
	
	//mocks the service which tells you if navigation is allowed - can be configured by global parameters bIntentNotSupported and bIntentSupportedFail
	isNavigationSupported: function(aNavArguments){

		var oMyDeferred = jQuery.Deferred();
		
		if(this.bIntentSupportedFail){
			oMyDeferred.reject();
		}else{
			var oTargets = [{supported: !this.bIntentNotSupported}];
			oMyDeferred.resolve(oTargets);
		}
		return oMyDeferred.promise();
	},	
	
	//remember the arguments which were used to navigate out
	toExternal: function(oNavArguments){
		this.toExternalArgs = oNavArguments;
	}
});