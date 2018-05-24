/*globals sap*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.View3", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
    },
    handleBtn1Press : function () {
        "use strict";
        sap.ui.getCore().getEventBus().publish("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",{});
    },
    handleSetHierarchy : function () {
        "use strict";

        var aHierarchyLevels = [{
            icon: "sap-icon://undefined/lead",
            text: "Detail View",
            link: "#Action-toappnavsample2" //app calls hrefForExternal, external format, direct link
        }, {
            icon: "sap-icon://FioriInAppIcons/Gift",
            text: "Open UI5 SDK",
            link: "#Action-toappstateformsample&/editForm/"
        }];

        this.getOwnerComponent().getService("ShellUIService").then(
            function (oShellUIService) {
                oShellUIService.setHierarchy(aHierarchyLevels);
            },
            function (sError) {
                jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
                    "sap.ushell.demo.AppNavSample.view.View3");
            }
        );

    }
});
