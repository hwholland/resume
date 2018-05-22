(function () {
    'use strict';
    jQuery.sap.declare({modName: "sap.uxap.testkit.blocks.BasicDivBlockController", "type": "controller"});


    sap.ui.core.mvc.Controller.extend("sap.uxap.testkit.blocks.BasicDivBlockController", {
       onAfterRendering: function(){
         /*  var oDomRef = this.getView().$();
           if (oDomRef) {
            var htmlElements = oDomRef.children('div');
            if (htmlElements.length >0){
                var divElement = htmlElements.first();
                divElement.css('height', this.oParentBlock.getHeight());
                divElement.css('background-color', this.oParentBlock.getBackgroundColor());

            }
           }*/

        }
    });
}());

