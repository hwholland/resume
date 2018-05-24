jQuery.sap.declare('sap.apf.testhelper.ushellHelper');
jQuery.sap.require('sap.apf.utils.hashtable');

(function() {
	'use strict';

	sap.apf.testhelper.ushellHelper = {};
	sap.apf.testhelper.ushellHelper.spys = {};
	sap.apf.testhelper.ushellHelper.setup = function(config) {
		sap.apf.testhelper.ushellHelper.ushellOrig = sap.ushell;
		sap.ushell = {};
		sap.ushell.numberOfCallsForGetSemanticObjectLinks = 0;
		sap.ushell.sapApfCumulativeFilter = 'UI5 filter expression';
		sap.ushell.sapApfState = {
			path : 'Alpha',
			filterIdHandler : {
				filterId1 : 'Beta'
			}
		};
		sap.ushell.Container = {
			getService : function(serviceName) {
				if (serviceName === "CrossApplicationNavigation") {
					return {
						hrefForExternal : function(configuration){
							sap.ushell.hrefConfiguration = configuration;
							return '#FioriApplication-executeAPFConfigurationS4HANA';
						},
						toExternal : function(configuration) {
							sap.ushell.externalNavigationConfiguration = configuration;
						},
						createEmptyAppState : function(component) {
							return {
								setData : function(data) {
									sap.apf.testhelper.ushellHelper.spys.setData = data;
								},
								save : function() {
									sap.apf.testhelper.ushellHelper.spys.isSaved = true;
								},
								getKey : function() {
									return "AppStateKey1972";
								}
							};
						},
						getAppState : function(component, key) {
							sap.apf.testhelper.ushellHelper.spys.getAppState = {
								component : component,
								key : key
							};
							var deferred = jQuery.Deferred();
							deferred.resolve({
								getData : function() {
									return {
										'sapApfState' : sap.ushell.sapApfState,
										'sapApfCumulativeFilter' : sap.ushell.sapApfCumulativeFilter,
										'selectionVariant': sap.ushell.selectionVariant
									};
								}
							});
							return deferred.promise();
						},
						getSemanticObjectLinks : function(semanticObject) {
							sap.ushell.numberOfCallsForGetSemanticObjectLinks++;
							var deferred = jQuery.Deferred();
							var intents;
							if (config && config.functions && config.functions.getSemanticObjectLinkIntents) {
								intents = config.functions.getSemanticObjectLinkIntents(semanticObject);
							} else {
								intents = [ {
									intent : "#aSemanticObject-action1",
									text : "action1"
								}, {
									intent : "#aSemanticObject-actionWithParam?a=b",
									text : "actionWithParam"
								} ];
							}
							deferred.resolve(intents);
							return deferred.promise();
						}
					};
				}
			}
		};
	};
	sap.apf.testhelper.ushellHelper.teardown = function() {
		sap.apf.testhelper.ushellHelper.spys = {};
		sap.ushell = sap.apf.testhelper.ushellHelper.ushellOrig;
	};
}());