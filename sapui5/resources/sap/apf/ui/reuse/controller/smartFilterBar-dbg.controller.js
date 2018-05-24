/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/**
* @class smartFilterBar
* @memberOf sap.apf.ui.reuse.controller
* @name smartFilterBar
* @description controller for smartFilterBar view
*/
(function() {
	'use strict';
	sap.ui.controller("sap.apf.ui.reuse.controller.smartFilterBar", {
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#onInit
		 * @description Called on initialization of the view
		 * */
		onInit : function() {
			var oController = this;
			var sServiceForSFB = oController.getView().getViewData().oSmartFilterBarConfiguration.service;
			var annotationUris = oController.getView().getViewData().oCoreApi.getAnnotationsForService(sServiceForSFB);
			var parameterSet = {
				loadMetadataAsync : false,
				annotationURI : annotationUris,
				json : true
			};
			var oModel = new sap.ui.model.odata.ODataModel(sServiceForSFB, parameterSet);
			oModel.setCountSupported(false);
			oController.getView().setModel(oModel);
			if(oModel.getServiceMetadata() === undefined){
				oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
					code: "5052",
					aParameters: [sServiceForSFB]}));
			}
			if(oController.byId("idAPFSmartFilterBar").getAllFilterItems().length === 0){
				oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
					code: "5053",
					aParameters: [oController.getView().getViewData().oSmartFilterBarConfiguration.entityType, sServiceForSFB]}));
			}
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#registerSFBInstanceWithCore
		 * @description Called on initialise event of the Smart Filter Bar
		 * */
		registerSFBInstanceWithCore : function() {
			var oController = this;
			oController.getView().getViewData().oCoreApi.registerSmartFilterBarInstance(oController.byId("idAPFSmartFilterBar"));
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#handlePressOfGoButton
		 * @description Called on search event(press of Go Button) of the Smart Filter Bar
		 * */
		handlePressOfGoButton : function() {
			var oController = this;
			oController.getView().getViewData().oUiApi.selectionChanged(true);
		}
	});
}());