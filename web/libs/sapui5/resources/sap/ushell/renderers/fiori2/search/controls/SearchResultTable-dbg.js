/* global jQuery, sap, window */


(function() {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    var SearchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;

    sap.m.Table.extend('sap.ushell.renderers.fiori2.search.controls.SearchResultTable', {

        renderer: 'sap.m.TableRenderer',

        onAfterRendering: function() {
            SearchHelper.attachEventHandlersForTooltip(this.getDomRef());
        }
    });

})();
