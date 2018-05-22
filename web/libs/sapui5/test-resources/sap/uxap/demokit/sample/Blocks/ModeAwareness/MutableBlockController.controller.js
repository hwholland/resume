(function () {
    'use strict';
    jQuery.sap.declare({modName: "sap.uxap.testblocks.mutable.MutableBlockController", "type": "controller"});

    sap.ui.core.mvc.Controller.extend("sap.uxap.testblocks.mutable.MutableBlockController", {

        onInit: function () {
            this.aValues = [
                this.getView().byId("valueSubsidiary"),
                this.getView().byId("valueBuilding"),
                this.getView().byId("valueRoom")
            ]
        },

        toggleMode: function (oEvent) {
            var sNewMode;

            switch (oEvent.getSource().getId()) {
                case this.getView().byId("mode1").getId():
                    sNewMode = "mode1";
                    break;
                case this.getView().byId("mode2").getId():
                    sNewMode = "mode2";
                    break;
                default:
                    sNewMode = "mode1";
            }

            /*
            The oParentBlock is injected by the parent block on each controllers so the controller can easily access to it.
            This is just a convenience mechanism and it is equivalent from doing this.getView().getParent() which provides the instance of the Block
             */
            this.oParentBlock.setMode(sNewMode);
        },

        /**
         * Implementing onParentBlockModeChange that is triggered by the Block on this controller when the mode is changed
         * @param sNewMode {string} the new mode as defined in the metadata.views object
         */
        onParentBlockModeChange: function (sNewMode) {
            if (sNewMode == "mode2") {
                jQuery.each(this.aValues, function (iIndex, oObject) {
                    oObject.setVisible(false);
                });
            }
            else {
                jQuery.each(this.aValues, function (iIndex, oObject) {
                    oObject.setVisible(true);
                });
            }
        }
    });
}());

