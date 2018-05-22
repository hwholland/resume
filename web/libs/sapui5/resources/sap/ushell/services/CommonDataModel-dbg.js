// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module exposes a CommonDataModel based site document in a platform neutral format
 * to it's clients
 * </p>
 *
 *
 * @version
 * 1.38.26
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.services.CommonDataModel");

    /**
     * @param {object} oAdapter
     *   Adapter, provides an array of Inbounds
     * @param {object} oContainerInterface
     *   Not in use
     * @param {string} sParameters
     *   Parameter string, not in use
     * @param {object} oServiceConfiguration
     *   The service configuration not in use
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.38.4
     */
    sap.ushell.services.CommonDataModel = function (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        // to overcome loading issues in FireFox
        jQuery.sap.require("sap.ushell.services.ClientSideTargetResolution");

        var that = this,
            oSiteDeferred = new jQuery.Deferred();

        function failure(sMessage) {
            oSiteDeferred.reject(sMessage);
        }

        this._oAdapter = oAdapter;
        this._oSitePromise = oSiteDeferred.promise();

        // load site and personalization as early as possible
        /*eslint-disable max-nested-callbacks*/
        oAdapter.getSite()
            .done(function (oSite) {
                that._oOriginalSite = jQuery.extend(true, {}, oSite);
                oSiteDeferred.resolve(that._oOriginalSite);
            })
            .fail(failure); //getSite
        /*eslint-enable max-nested-callbacks*/
    };

    /**
     * Returns the Common Data Model site with mixed in personalization.
     * The following sections are allowed to be changed:
     *   - site.payload.groupsOrder
     *   - groups
     * Everything else must not be changed.
     *
     * @returns {jQuery.promise}
     *    resolves with the Common Data Model site
     * @private
     *
     * @see #save
     * @since 1.38.4
     */
    sap.ushell.services.CommonDataModel.prototype.getSite = function() {
        //TODO JSDoc: tbd is it allowed to change "personalization" section?
        return this._oSitePromise;
    };

    sap.ushell.services.CommonDataModel.prototype.hasNoAdapter = false;
}());
