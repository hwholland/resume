// @copyright@
/**
* @fileOverview QUnit tests for sap.ushell.services.CommonDataModel
*/
(function () {
    "use strict";

    /*jslint nomen: true, sub: true*/
    /*global asyncTest, deepEqual, module, notStrictEqual, ok, parseInt, start,
      stop, sinon, strictEqual, jQuery, sap, test, window */

    jQuery.sap.require("sap.ushell.utils");
    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.CommonDataModel");

    module("sap.ushell.services.CommonDataModel", {
        setup : function () {
            window["sap-ushell-config"] = {
                "services": {
                    "CommonDataModel" : {
                        "adapter": {
                            "module" : "sap.ushell.adapters.cdm.CommonDataModelAdapter"
                        }
                    }
                }
            };

            //bootstrap
            stop();
            sap.ushell.bootstrap("local")
                .done(function () {
                    start();
                });
        },
        teardown : function () {
            delete sap.ushell.Container;
        }
    });

    asyncTest("constructor",  function () {
        // arrange #1
        var oCommonDataModelService,
            oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sinon.spy(function () {
                    return this._getSiteDeferred.promise();
                })
            },
            oOriginalSite = { originalProperty: "foo"};

        // act #1
        oCommonDataModelService = new sap.ushell.services.CommonDataModel(oMockAdapter);

        // assert #1
        strictEqual(oCommonDataModelService._oAdapter, oMockAdapter, "property oAdapter");
        strictEqual(oMockAdapter.getSite.callCount, 1, "getSite called");
        // arrange #2

        // act #2
        oMockAdapter._getSiteDeferred.resolve(oOriginalSite);

        //assert #2
        deepEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "original site");
        notStrictEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "oOriginalCdmSite is a copy");

        oCommonDataModelService._oSitePromise
            .fail(function () {
                ok(false, "unexpected reject of _oSitePromise");
                start();
            })
            .done(function (oResolvedSite) {
                deepEqual(oResolvedSite, oOriginalSite, "done handler: original site (in 1.36)");
                start();
            });
    });

    [
        0 // failing promise
    ].forEach(function (iFailingDeferred) {
        asyncTest("constructor: error case promise " + iFailingDeferred + " failed",  function () {
            // arrange #1
            var oCommonDataModelService,
                oMockAdapter = {
                    _getSiteDeferred: new jQuery.Deferred(),
                    getSite: sinon.spy(function () {
                        return this._getSiteDeferred.promise();
                    }),
                    _getPersonalizationDeferred: new jQuery.Deferred(),
                    getPersonalization: sinon.spy(function () {
                        return this._getPersonalizationDeferred.promise();
                    })
                },
                oMockPersonalizationProcessor = {
                    _mixinPersonalizationDeferred: new jQuery.Deferred(),
                    mixinPersonalization: sinon.spy(function () {
                        return this._mixinPersonalizationDeferred.promise();
                    })
                },
                oOriginalSite = { originalProperty: "foo"},
                oPers = { personalizedProperty: "bar"},
                oPersonalizedSite = {
                    originalProperty: "foo",
                    personalizedProperty: "bar"
                };

            // act #1
            oCommonDataModelService = new sap.ushell.services.CommonDataModel(oMockAdapter);

            // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
            oCommonDataModelService._oPersonalizationProcessor = oMockPersonalizationProcessor;

            if (iFailingDeferred === 0) {
                oMockAdapter._getSiteDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 1) {
                oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                oMockAdapter._getPersonalizationDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 2) {
                oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                oMockAdapter._getPersonalizationDeferred.resolve(oPers);
                oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject("intentionally failed");
            }

            //assert #2
            oCommonDataModelService._oSitePromise
                .done(function () {
                    ok(false, "unexpected resolve of _oSitePromise");
                    start();
                })
                .fail(function (sMessage) {
                    strictEqual(sMessage, "intentionally failed", "error message");
                    start();
                });
        });
    });

    asyncTest("getSite",  function () {
        // arrange
        var oCommonDataModelService,
            oSitePromiseMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sinon.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                }),
                // getPersonalization not needed
            },
            oPersonalizedSite = {
                originalProperty: "foo",
                personalizedProperty: "bar"
            };

        oCommonDataModelService = new sap.ushell.services.CommonDataModel(oMockAdapter);
        // overwrite _oSitePromise as it is used by getSite
        oCommonDataModelService._oSitePromise = oSitePromiseMock.promise();

        // act - success case
        oSitePromiseMock.resolve(oPersonalizedSite);
        oCommonDataModelService.getSite()
            .fail(function () {
                ok(false, "unexpected reject of _oSitePromise");
                start();
            })
            .done(function (oResolvedPersonalizedSite) {
                deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
                start();
            });

        // failure case
        oSitePromiseMock = new jQuery.Deferred();
        oCommonDataModelService._oSitePromise = oSitePromiseMock.promise();

        // act - success case
        stop();
        oSitePromiseMock.reject("intentionally failed");
        oCommonDataModelService.getSite()
            .done(function () {
                ok(false, "unexpected resolve of _oSitePromise");
                start();
            })
            .fail(function (sMessage) {
                strictEqual(sMessage, "intentionally failed", "error message");
                start();
            });
    });
}());
