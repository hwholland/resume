sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("sap.ui.demo.wt.controller.App", {
       toDetailPage : function () {
       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("page2");
      },
      toDetailDetailPage : function () {
          var oPage3 = this.getView().byId("page3");
          this.getView().byId("app").to(oPage3);
      },
      back : function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo(" ");
      }
   });
});