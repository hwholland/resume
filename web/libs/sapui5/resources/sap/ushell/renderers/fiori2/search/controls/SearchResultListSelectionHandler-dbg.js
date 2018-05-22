/* global sap,window,jQuery */



(function() {
    "use strict";

    jQuery.sap.require('sap.ui.base.Object');

    sap.ui.base.Object.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListSelectionHandler", {

        isMultiSelectionAvailable: function(dataSource) {
            return false;
        },

        actionsForDataSource: function(dataSource) {
            return [];
        }
    });
})();
