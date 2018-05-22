/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.promiseBasedCreateReadRequest');
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Promise Based CreateReadRequest
 * @description Wraps sap.apf.core.CreateReadRequest inside a jquery promise and provides the interface.
 * @param {sap.apf.core.instance} oCoreApi - oCore Api
 * @param {string} sRequestId - Request Id
 * @param {sap.apf.core.Filter} oFilter - Filter Object
 * @name sap.apf.ui.utils.PromiseBasedCreateReadRequest
 * @returns {jQuery.Deferred.promise} which will be resolved with an object :
 *	{
 *  	aData: []  - oData Response
 *		oMetadata: sap.apf.core.EntityTypeMetadata Instance.
 *	}
 */
sap.apf.ui.utils.PromiseBasedCreateReadRequest = function (oCoreApi, sRequestId, oFilter) {
    var oDeferred = new jQuery.Deferred();
    var oReadRequest = oCoreApi.createReadRequestByRequiredFilter(sRequestId);
    var fnCallback = function (aData, oMetadata) {
        var oArg = {
            aData: aData,
            oMetadata: oMetadata
        };
        if (aData && oMetadata) {
            oDeferred.resolveWith(this, [oArg]);
        } else {
            oDeferred.rejectWith(this, [oArg]);
        }
    };
    if (!oFilter) {
        oFilter = oCoreApi.createFilter();
    }
    oReadRequest.send(oFilter, fnCallback);
    return oDeferred.promise();
};
