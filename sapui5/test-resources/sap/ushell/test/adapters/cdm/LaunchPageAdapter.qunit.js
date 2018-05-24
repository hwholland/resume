// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
(function() {
    "use strict";
    /*global asyncTest, deepEqual, equal, strictEqual, module, ok, sinon, start, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.adapters.cdm.LaunchPageAdapter");
    jQuery.sap.require("sap.ushell.services.Container");

    var A_CDM_GROUP_IDS = sap.ushell.test.data.cdm.cdmSiteService.groupIds,
        A_CDM_GROUP_IDS_TWO = sap.ushell.test.data.cdm.cdmSiteService.groupIdsTwo,
        O_CDM_GROUP_HOME = sap.ushell.test.data.cdm.cdmSiteService.groups.home,
        O_CDM_GROUP_ONE = sap.ushell.test.data.cdm.cdmSiteService.groups.ONE,
        O_LPA_GROUP_HOME = sap.ushell.test.data.cdm.launchPageAdapter.groups.home,
        O_LPA_GROUP_ONE = sap.ushell.test.data.cdm.launchPageAdapter.groups.ONE,
        O_CDM_SITE = sap.ushell.test.data.cdm.cdmSiteService.site,
        O_CSTR_STATIC_1_RESOLVED = sap.ushell.test.data.cdm.ClientSideTargetResolution.resolvedTileHashes["#App1-viaStatic"],
        O_CSTR = sap.ushell.test.data.cdm.ClientSideTargetResolution.resolvedTileHashes;
    module("sap.ushell.adapters.cdm.LaunchPageAdapter", {
        setup : function() {
            this.oAdapter = new sap.ushell.adapters.cdm.LaunchPageAdapter(
                undefined, undefined, {
                    config : {}
                });

            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
        },
        teardown : function() {
            delete this.oAdapter;
            delete sap.ushell.Container;
        }
    });

    test("check Interface", function() {
        strictEqual(typeof this.oAdapter.getGroups, "function",
            "method getGroups exists");
    });


    test("allPromisesDone", function() {
        var p1 = new jQuery.Deferred();
        var p2 = new jQuery.Deferred();
        var cnt = 1;
        this.oAdapter._allPromisesDone([p1,p2]).done( function() {
            ok(1,"got here");
            equal(cnt,3,"right point in time");
        }).fail(function() {
            ok(false, "never");
        });
        ++cnt;
        p1.resolve();
        ++cnt;
        p2.reject();
        ++cnt;
    });


    test("allPromisesDone, empty array", function() {
        var p1 = new jQuery.Deferred();
        var p2 = new jQuery.Deferred();
        var cnt = 1;
        this.oAdapter._allPromisesDone([]).done( function() {
            ok(1,"got here");
            equal(cnt,1,"right point in time");
        }).fail(function() {
            ok(false, "never");
        });
        ++cnt;
        p1.resolve();
        p2.reject();
    });

    test("allPromisesDone all failed", function() {
        var p1 = new jQuery.Deferred();
        var p2 = new jQuery.Deferred();
        var cnt = 1; 
        this.oAdapter._allPromisesDone([p1,p2]).done( function() {
            ok(1,"got here");
            equal(cnt,3,"right point in time");
        }).fail(function() {
            ok(false, "never");
        });
        ++cnt;
        p1.reject();
        ++cnt;
        p2.reject();
    });

    asyncTest("getGroups: basic call", function() {
        var fnGetServiceOriginal = sap.ushell.Container.getService;

        // prepare
        sinon.stub(sap.ushell.Container, "getService", function(sServiceName) {
            if (sServiceName === "CDMSiteService") {
                return {
                    getHomepageGroups : function() {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(A_CDM_GROUP_IDS);
                        }, 0);
                        return oDeferred.promise();
                    },
                    getGroup : function(sGroupId) {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(O_CDM_GROUP_HOME);
                        }, 0);
                        return oDeferred.promise();
                    }
                };
            }
            if (sServiceName === "ClientSideTargetResolution") {
                return {
                    resolveTileIntent: function (sHash) {
                        var oDeferred = new jQuery.Deferred();

                        setTimeout(function () {
                            oDeferred.resolve(O_CSTR_STATIC_1_RESOLVED);
                        }, 0);

                        return oDeferred.promise();
                    }
                };
            }

            // unknown service, call original sap.ushell.Container.getService
            return fnGetServiceOriginal(sServiceName);
        });

        // code under test
        this.oAdapter.getGroups().done(function (aGroups) {
            // tests
            deepEqual(aGroups, [O_LPA_GROUP_HOME], "returned Groups");
            start();
        });
    });
    asyncTest("getGroups: multiple groups", function() {
        var fnGetServiceOriginal = sap.ushell.Container.getService;
        // prepare
        sinon.stub(sap.ushell.Container, "getService", function(sServiceName) {
            if (sServiceName === "CDMSiteService") {
                return {
                    getHomepageGroups : function() {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(A_CDM_GROUP_IDS_TWO);
                        }, 0);
                        return oDeferred.promise();
                    },
                    getGroup : function(sGroupId) {
                        var oDeferred = new jQuery.Deferred();
                        if (sGroupId === A_CDM_GROUP_IDS[0]) {
                            setTimeout(function () {
                                oDeferred.resolve(O_CDM_GROUP_HOME);
                            }, 0);
                        } else {
                            setTimeout(function () {
                                oDeferred.resolve(O_CDM_GROUP_ONE);
                            }, 0);
                        }
                        return oDeferred.promise();
                    }
                };
            }
            if (sServiceName === "ClientSideTargetResolution") {
                return {
                    resolveTileIntent: function (sHash) {
                        var oDeferred = new jQuery.Deferred();

                        setTimeout(function () {
                            oDeferred.resolve(O_CSTR[sHash]);
                        }, 0);

                        return oDeferred.promise();
                    }
                };
            }

            // unknown service, call original sap.ushell.Container.getService
            return fnGetServiceOriginal(sServiceName);
        });

        // code under test
        this.oAdapter.getGroups().done(function (aGroups) {
            // tests
            deepEqual(aGroups, [ O_LPA_GROUP_ONE, O_LPA_GROUP_HOME], "returned Groups");
            start();
        });
    });


    asyncTest("getCatalogs: basic call", function() {
        var fnGetServiceOriginal = sap.ushell.Container.getService;

        // prepare
        sinon.stub(sap.ushell.Container, "getService", function(sServiceName) {
            if (sServiceName === "CDMSiteService") {
                return {
                    getHomepageGroups : function() {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(A_CDM_GROUP_IDS);
                        }, 0);
                        return oDeferred.promise();
                    },
                    getCSTRProjection : function() {
                        return new Promise(function(resolve, reject) {
                            setTimeout(function () {
                                resolve(O_CDM_SITE);
                            }, 0);
                        });
                    },
                    getGroup : function(sGroupId) {
                        var oDeferred = new jQuery.Deferred();
                        setTimeout(function () {
                            oDeferred.resolve(O_CDM_GROUP_HOME);
                        }, 0);
                        return oDeferred.promise();
                    }
                };
            }
            if (sServiceName === "ClientSideTargetResolution") {
                return {
                    resolveTileIntent: function (sHash) {
                        var oDeferred = new jQuery.Deferred();

                        setTimeout(function () {
                            oDeferred.resolve(O_CSTR[sHash]);
                        }, 0);

                        return oDeferred.promise();
                    }
                };
            }

            // unknown service, call original sap.ushell.Container.getService
            return fnGetServiceOriginal(sServiceName);
        });
        var that = this;
        var aCatalogs = [];
        // code under test
        this.oAdapter.getCatalogs().done(function (oCatalogs) {
            // tests
            deepEqual(that.oAdapter.getCatalogId(aCatalogs[0]),"Cat1", "title 1");
            deepEqual(that.oAdapter.getCatalogId(aCatalogs[1]),"Cat2", "title 2");
            that.oAdapter.getCatalogTiles(aCatalogs[1]).done(function(aTiles) {
                // TODO: this is way too much information
                deepEqual(aTiles,[
                                  {
                                      "inbound": {
                                        "action": "viaStatic",
                                        "semanticObject": "App1",
                                        "signature": {}
                                      },
                                      "properties": {
                                        "info": "sap-icon://Fiori2/F0018",
                                        "size": "1x1",
                                        "subTitle": undefined,
                                        "targetURL": "#App1-viaStatic",
                                        "title": "translated title of application"
                                      },
                                      "tileType": "sap.ushell.ui.tile.StaticTile"
                                    },
                                    {
                                      "inbound": {
                                        "action": "viaStatic",
                                        "semanticObject": "App1",
                                        "signature": {}
                                      },
                                      "properties": {
                                        "info": "sap-icon://Fiori2/F0018",
                                        "size": "1x1",
                                        "subTitle": undefined,
                                        "targetURL": "#App1-viaStatic",
                                        "title": "translated title of application"
                                      },
                                      "tileType": "sap.ushell.ui.tile.StaticTile"
                                    }
                                  ],"tiles 1 ok");
                that.oAdapter.getCatalogTiles(aCatalogs[0]).done(function(aTiles) {
                    deepEqual(aTiles,[
                                       {
                                           "inbound": {
                                             "action": "viaStatic",
                                             "semanticObject": "App1",
                                             "signature": {}
                                           },
                                           "properties": {
                                             "info": "sap-icon://Fiori2/F0018",
                                             "size": "1x1",
                                             "subTitle": undefined,
                                             "targetURL": "#App1-viaStatic",
                                             "title": "translated title of application"
                                           },
                                           "tileType": "sap.ushell.ui.tile.StaticTile"
                                         },
                                         {
                                           "inbound": {
                                             "action": "viaStatic",
                                             "semanticObject": "App1",
                                             "signature": {}
                                           },
                                           "properties": {
                                             "info": "sap-icon://Fiori2/F0018",
                                             "size": "1x1",
                                             "subTitle": undefined,
                                             "targetURL": "#App1-viaStatic",
                                             "title": "translated title of application"
                                           },
                                           "tileType": "sap.ushell.ui.tile.StaticTile"
                                         },
                                         {
                                           "inbound": {
                                             "action": "viaStatic",
                                             "semanticObject": "App2",
                                             "signature": {}
                                           },
                                           "properties": {
                                             "info": "sap-icon://Fiori2/F0018",
                                             "size": "1x1",
                                             "subTitle": undefined,
                                             "targetURL": "#App2-viaStatic",
                                             "title": "App desc 2 title"
                                           },
                                           "tileType": "sap.ushell.ui.tile.StaticTile"
                                         },
                                         {
                                           "inbound": {
                                             "action": "withFilter",
                                             "semanticObject": "App2",
                                             "signature": {
                                               "parameter": {
                                                 "abc": { "filter" : { "value" : "ABC"}}
                                               }
                                             }
                                           },
                                           "properties": {
                                             "info": "sap-icon://Fiori2/F0018",
                                             "size": "1x1",
                                             "subTitle": undefined,
                                             "targetURL": "#App2-withFilter",
                                             "title": "App desc 2 title"
                                           },
                                           "tileType": "sap.ushell.ui.tile.StaticTile"
                                         }
                                       ],"tiles 0 ok");
                    start();
                });
            });
        }).progress(function(oCatalog) {
            aCatalogs.push(oCatalog);
        });
    });

}());
