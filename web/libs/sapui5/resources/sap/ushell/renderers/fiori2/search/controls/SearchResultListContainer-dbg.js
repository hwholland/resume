(function() {
    "use strict";

    sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListContainer", {

        init: function() {
            // define group for F6 handling
            this.data("sap-ui-fastnavgroup", "true", true /* write into DOM */ );
        },

        metadata: {
            aggregations: {
                "filterBar": {
                    type: "sap.ui.core.Control",
                    multiple: false
                },
                //                "displaySwitchTapStrips": {
                //                    type: "sap.ui.core.Control",
                //                    multiple: false
                //                },
                "centerAreaHeader": {
                    type: "sap.ui.core.Control",
                    multiple: false
                },
                "centerArea": {
                    singularName: "content"
                },
                "didYouMeanBar": {
                    type: "sap.ui.core.Control",
                    multiple: false
                },
                //                "dataSourceTapStrips": {
                //                    type: "sap.ui.core.Control",
                //                    multiple: false
                //                },
                "noResultScreen": {
                    type: "sap.ui.core.Control",
                    multiple: false
                }
            }
        },

        renderer: function(oRm, oControl) {
            // inner div for results
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchResultListsContainer");
            if (oControl.getModel() && oControl.getModel().getFacetVisibility() === true) {
                oRm.addClass("sapUshellSearchFacetPanelOpen");
            }
            oRm.writeClasses();


            oRm.write('>');

            // render filter bar
            oRm.renderControl(oControl.getFilterBar());

            // render main header
            oRm.renderControl(oControl.getNoResultScreen());


            // render did you mean bar
            oRm.renderControl(oControl.getDidYouMeanBar());

            //            // render datasource tap strips
            //            oRm.renderControl(oControl.getDataSourceTapStrips());

            //            //render segment button
            //            oRm.renderControl(oControl.getDisplaySwitchTapStrips());

            //render center area header
            oRm.renderControl(oControl.getCenterAreaHeader());

            //render center area
            for (var i = 0; i < oControl.getCenterArea().length; i++) {
                oRm.renderControl(oControl.getCenterArea()[i]);
            }
            //            oRm.renderControl(oControl.getCenterArea()[0]); // table sort dialog
            //            oRm.renderControl(oControl.getCenterArea()[1]); // search result list
            //            oRm.renderControl(oControl.getCenterArea()[2]); // search result table 
            //            oRm.renderControl(oControl.getCenterArea()[3]); // search app result list
            //            oRm.renderControl(oControl.getCenterArea()[4]); // show more footer

            /// close inner div for results
            oRm.write("</div>");

        }
    });
})();
