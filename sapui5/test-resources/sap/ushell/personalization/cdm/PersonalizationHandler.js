// @copyright@
/**
 * @fileOverview The CDM's PersonalizationHandler, mixing in and out the personalitation to the CDM Site object.
 *
 * @version
 * @version@
 */
(function() {
    "use strict";
    /* global jQuery, sap, window*/
    jQuery.sap.declare("sap.ushell.personalization.cdm.PersonalizationHandler");
    // some comment
    /**
     * The CDM's Personalization Handler, mixing in and out the personalization to the CDM Site object.
     *
     * @class The Unified Shell's page builder adapter for the 'demo' platform.
     *
     * @constructor
     * @see sap.ushell.services.CDMSiteService
     * @since 1.38.0
     */
    sap.ushell.personalization.cdm.PersonalizationHandler = function () {

        function _keysToArray(o) {
            return Object.keys(o).map(function(sKey) { return o[sKey]; });
        }
        /**
         * Mixes in the given personalization data into the given CDM Site object.
         *
         * @param oCdmSite
         *  CDM Site object
         * @param oCdmPersonalization
         *  Personalization data object
         *
         * @returns {Promise}
         *    ES6 promise that is resolved with a copy of oCdmSite with mixed-in personalization.
         *
         * @see #extractPersonalization
         * @private
         */
        this.mixinPersonalization = function (oCdmSite, oCdmPersonalization) {
            var oPersonalizedCdmSite = jQuery.extend({}, oCdmSite),
                aTilePers = oCdmPersonalization.tiles || [],
                aGroups = _keysToArray(oCdmSite.groups) || [],
                aTiles,
                oPers;

            // tiles
            aGroups.forEach(function (oGroup) {
                aTiles = oGroup.payload.tiles || [];
                aTiles.forEach(function (oTile) {
                    // try to find personalization and apply it
                    oPers = aTilePers[oTile.id];
                    if (oPers) {
                        // TODO the merge algorithm may not fit the needs
                        jQuery.extend(oTile, oPers);
                    }
                });
            });

            return new Promise(function (resolve, reject) {
                resolve(oPersonalizedCdmSite);
            });
        };

        /**
         * Extracts the personalization data from the given (personalized) CDM Site object.
         *
         * @param oPersonalizedCdmSite
         *  personalized CDM Site object
         *
         * @returns {Promise}
         *    ES6 promise that is resolved with an object of the following structure
         *    <pre>
         *    {
         *      cdmSite: //copy of oPersonalizedCdmSite without personalization
         *      personalization: // object containing personalization only
         *    }
         *    </pre>
         *
         * @see #mixinPersonalization
         * @private
         */
        this.extractPersonalization = function (oPersonalizedCdmSite) {
            var oResponse = {
                cdmSite: jQuery.extend({}, oPersonalizedCdmSite),
                personalization: {}
            };

            return new Promise(function (resolve, reject) {
                resolve(oResponse);
            });
        };
    };
}());