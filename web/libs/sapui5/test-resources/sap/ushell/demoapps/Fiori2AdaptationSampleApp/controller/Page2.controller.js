sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("sap.ui.demo.wt.controller.Page2", {

      toDetailDetailPage : function () {
    	  /*var oPage3 = this.getView().byId("page3");
    	  this.getView().byId("app").to(oPage3);*/
    	  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    	  oRouter.navTo("page3");
      },
      back : function () {
    	  //this.getView().byId("app").back();
    	  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    	  oRouter.navTo("");
      }
   });
});