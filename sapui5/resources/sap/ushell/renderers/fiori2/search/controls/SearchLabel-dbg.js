/* global sap */
/* global alert */
/* global jQuery */

(function() {
    "use strict";
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    var searchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;

    sap.m.Label.extend('sap.ushell.renderers.fiori2.search.controls.SearchLabel', {

        renderer: 'sap.m.LabelRenderer',
        onAfterRendering: function() {

            var d = this.getDomRef();

            // recover bold tag with the help of text() in a safe way
            searchHelper.boldTagUnescaperByText(d);

            // forward ellipsis
            searchHelper.forwardEllipsis4Whyfound(d);
        }

    });

})();
