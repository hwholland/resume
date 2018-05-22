/*!
 * @copyright@
 */

jQuery.sap.declare("sap.collaboration.components.fiori.notification.NotificationContainer");


sap.ui.core.Control.extend("sap.collaboration.components.fiori.notification.NotificationContainer", {
    
    metadata: {
    		
    	aggregations: {
    		"content" : {singularName: "content"}
    	}
           
    },
    
    renderer: function(oRM, oControl) {
    		
	   oRM.write("<div");
	   oRM.writeControlData(oControl); // applies the ID, ...
	   oRM.addClass("sapClbNotifContainerBox");
	   oRM.writeClasses();
	   oRM.writeStyles(); // custom style class support
	   oRM.write(">");
	   
	   var aContent = oControl.getContent();
	   for (var i = 0, l = aContent.length; i < l; i++) {
	          oRM.renderControl(aContent[i]);
	   }
	   
	   oRM.write("</div>");
           
    }
    
});
