// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, module, ok, equal, start, stop, test, sinon jQuery, sap*/

    jQuery.sap.require("sap.ushell.services.UserRecents");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var sCachedConfig;

    module("sap.ushell.services.UserRecents", {
        setup: function () {
            delete sap.ushell.Container;
            // the config has tof be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // avoid loading default dependencies (scaffolding lib) in unit test
            window["sap-ushell-config"] = window["sap-ushell-config"] || {};
            window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
            window["sap-ushell-config"].services.Ui5ComponentLoader = {
                config : {
                    loadDefaultDependencies: false
                }
            };
            sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);
        }
    });


    test("getServiceUserRecents", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);
        deepEqual(typeof oUserRecentsService, "object");
    });


    test("getRecentsApps", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentApps().done(function (aRecentApps) {
            ok(aRecentApps !== undefined, "Recent Apps return" );

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentApps.length,6, "Amount of Recent app equal max limit = 6");

            //validate RecentApps is ordered by time stamp
            deepEqual(aRecentApps[0].title, "My Leave Request", "RecentApps is ordered by time stamp correctly");
        });
    });


    test("getRecentSearches", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentSearches().done(function (aRecentSeraches) {
            ok(aRecentSeraches !== undefined, "Recent Apps return" );

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentSeraches.length,10, "Amount of Recent searches equal max limit = 10");

            //validate RecentSeraches is ordered by time stamp
            deepEqual(aRecentSeraches[0].sTerm, "Sally", "RecentSeraches is ordered by time stamp correctly");
        });
    });

    // ====================== User Apps Usage ====================

    // TODO: re-enable tests after refactoring; need to stub Ui5ComponentLoader service
    // to avoid native promise
//    // tests are failing due to a timing issue; needs further investigation
//    test("appsUsageEnable", function () {
//        _testAppUsageFlow(true);
//    });
//
//
//    // rather a unit test on REnderer._logOpenAppAction 
//    // Here the hack is in the ShellController, there a uni
//    test("appsUsageDisable", function () {
//        var bActive = false;
//        jQuery.sap.getObject("sap-ushell-config.renderers.fiori2", 0).componentData = {
//            config: {
//                enableTilesOpacity: bActive,
//                applications: {
//                    "Action-toappnavsample" : {}
//                },
//                rootIntent : "Shell-home"
//            }
//        };
//
//        hasher.setHash("");
//        delete sap.ushell.Container;
//        sap.ushell.bootstrap("local");
//
//        var clock = sinon.useFakeTimers("setTimeout"),
//            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//        ok(oUserRecentsService !== undefined, "the UserRecentsService present");
//        // ECMA6 Native promises can not be simulated via useFakeTimers, 
//        // as they don't use setTimout to force asynchronicity
//        // we need to make this a full asyncTest
//        //In the following test, I expected the callback for the resolved promise to be invoked while inside the test. Apparently, native promises doesn't invoke callbacks synchronously, but schedules them to be called in a manner similar to setTimeout(callback, 0). However, it doesn't actually use setTimeout, so sinon's implementation of fake timers doesn't trigger the callback when calling tick().
//        stop();
//        var oRenderer;
//        var callCount = bActive ? 1 : 0;
//        var stub = sinon.stub(oUserRecentsService, "addAppUsage");
//        oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        // here we only test that this is called.
//        var originalFunction = oRenderer.getComponentInstance().shellCtrl._logOpenAppAction;
//        oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = function(sIntent) {
//            if (sIntent === "Action-toappnavsample") {
//            	originalFunction(sArg);
//            	clock.tick(1000);
//            	equal(stub.callCount,callCount, "Called correct time: " + callCount);
//            	start();
//            	stub.restore();
//            	clock.restore();
//            	oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = originalFunction;
//            	oRenderer.destroy();
//            }
//        };
//        hasher.setHash("Action-toappnavsample");
//        //clock.tick(1000);
//     });
//
//    function _testAppUsageFlow(bActive) {
//        jQuery.sap.getObject("sap-ushell-config.renderers.fiori2", 0).componentData = {
//            config: {
//                enableTilesOpacity: bActive,
//                applications: {
//                    "Action-toappnavsample" : {}
//                },
//                rootIntent : "Action-toappnavsample"
//            }
//        };
//
//        delete sap.ushell.Container;
//        sap.ushell.bootstrap("local");
//
//        var clock = sinon.useFakeTimers("setTimeout"),
//            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//        ok(oUserRecentsService !== undefined, "the UserRecentsService present");
//        // ECMA6 Native promises can not be simulated via useFakeTimers, 
//        // as they don't use setTimout to force asynchronicity
//        // we need to make this a full asyncTest
//        //In the following test, I expected the callback for the resolved promise to be invoked while inside the test. Apparently, native promises doesn't invoke callbacks synchronously, but schedules them to be called in a manner similar to setTimeout(callback, 0). However, it doesn't actually use setTimeout, so sinon's implementation of fake timers doesn't trigger the callback when calling tick().
//        stop();
//        var oRenderer;
//        var callCount = bActive ? 1 : 0;
//        var stub = sinon.stub(oUserRecentsService, "addAppUsage", function() {
//            start();
//            clock.tick(1000);
//            equal(stub.callCount,callCount, "Called correct time" + callCount);
//            stub.restore();
//            oRenderer.destroy();
//            clock.restore();
//        });
//        oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        // here we only test that this is called.
//        var originalFunction = oRenderer.getComponentInstance().shellCtrl._logOpenAppAction;
//        oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = function(sArg) {
//            originalFunction(sArg);
//            clock.tick(1000);
//            oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = originalFunction;
//        };
//        clock.tick(1000);
//    }

    test("getAppsUsage", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
        });
    });

    asyncTest("MultiAppUsageSameDay", function () {
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        var hash1 = "app_1";
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);

        var hash2 = "app_2";
        oUserRecentsService.addAppUsage(hash2);

        var hash3 = "app_3";
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {

            start();
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );

            ok(aUserAppsUsage.usageMap.app_1 === 3, "app_1 usage = 3");
            ok(aUserAppsUsage.usageMap.app_2 === 1, "app_2 usage = 1");
            ok(aUserAppsUsage.usageMap.app_3 === 5, "app_3 usage = 5");

            //validate min & max values (min = 1, max = 5)
            deepEqual(aUserAppsUsage.minUsage, 1, "Min value of User Apps Usage = 1");
            ok(aUserAppsUsage.maxUsage >= 5, "Max value of User Apps Usage = 5");
        });
    });

    test("AppUsageDifferentDays", function () {
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        var hash4 = "app_4";
        var hash5 = "app_5";

        var clock = sinon.useFakeTimers(new Date(2014, 4, 1, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 2, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 3, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 4, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );

            //validate amount of app_4 = 6
            deepEqual(aUserAppsUsage.usageMap[hash4], 6, "Amount of User Apps Usage = 6");
            //validate amount of app_5 = 3
            deepEqual(aUserAppsUsage.usageMap[hash5], 3, "Amount of User Apps Usage = 3");
        });
    });

    test("InvalidAppUsageHash", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );

            var currentAppsCount = Object.keys(aUserAppsUsage.usageMap).length;

            var hash = null;
            oUserRecentsService.addAppUsage(hash);
            hash = '';
            oUserRecentsService.addAppUsage(hash);
            hash = ' ';
            oUserRecentsService.addAppUsage(hash);
            hash = undefined;
            oUserRecentsService.addAppUsage(hash);
            hash = {a:"1", b:"2", c:"3"}; //object
            oUserRecentsService.addAppUsage(hash);
            hash = function() { };
            oUserRecentsService.addAppUsage(hash);
            hash = 1;   //digit
            oUserRecentsService.addAppUsage(hash);
            hash = true;    // boolean
            oUserRecentsService.addAppUsage(hash);

            oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
                //validate amount of apps  = same as before additions
                deepEqual(Object.keys(aUserAppsUsage.usageMap).length, currentAppsCount, "Amount of User Apps Usage Didn't change");
            });
        });
    });

    asyncTest("set / get recent activity", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var oActivity = {
                title: "BO application",
                appType: "FactSheet",
                appId: "#Action-toappnavsample",
                url: "#Action-toappnavsample&1837"
            };

            ok(aRecentActivity !== undefined, "User Recent activity return" );
            ok(aRecentActivity.length === 4, "we have 4 recent activities in the recent activity list" );
            /*eslint-disable no-extra-bind*/
            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return" );
                    ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list" );

                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    start();
                }.bind(this));
            }.bind(this));
        });
    });

    asyncTest("update activity that is already in the recent activity list", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var oActivity = {
                title: "title on desktop 2",
                appType: "Application",
                appId: "#PurchaseOrder-display",
                url: "#PurchaseOrder-display&/View1",
                icon: "sap-icon://lead"
            };

            ok(aRecentActivity !== undefined, "User Recent activity return" );
            ok(aRecentActivity.length === 4, "we have 4 recent activities in the recent activity list" );

            oActivity.timestamp = aRecentActivity[aRecentActivity.length - 1].timestamp;
            deepEqual(aRecentActivity[aRecentActivity.length - 1], oActivity, "Least recent activity is oActivity");
            ok(aRecentActivity[0].appId !==  oActivity.appId, "most recent activity is not oActivity");

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return" );
                    ok(aRecentActivity.length === 4, "we have 4 recent activities in the recent activity list" );

                    oActivity.timestamp = aRecentActivity[0].timestamp;
                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    start();
                }.bind(this));
            }.bind(this));
        });
    });

//    asyncTest("Add application that is supported on tablet and mobile to recent activities", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        this.oActivity = {
//            icon: "xxx",
//            title: "xxx",
//            appType: "app",
//            appId: "#xxx-tabletmobile",
//            url: "xxx-xxx&1"
//        };
//
//        this.originalIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
//
//        oUserRecentsService.addActivity(this.oActivity).done(function () {
//            //***test desktop scenario***
//            sap.ui.Device.system.desktop = true;
//            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                var oDeferred = new jQuery.Deferred();
//                oDeferred.resolve(
//                    {
//                        "#xxx-tabletmobile": {"supported": false}
//                    });
//                return oDeferred.promise();
//            };
//            oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                ok(aRecentActivity !== undefined, "User Recent activity return");
//                ok(aRecentActivity.length === 4, "There are 4 items in the recent activity list");
//
//                //***test tablet scenario***
//                sap.ui.Device.system.desktop = false;
//                sap.ui.Device.system.tablet = true;
//                sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                    var oDeferred = new jQuery.Deferred();
//                    oDeferred.resolve(
//                        {
//                            "#xxx-tabletmobile": {"supported": true}
//                        });
//                    return oDeferred.promise();
//                };
//                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                    ok(aRecentActivity !== undefined, "User Recent activity return");
//                    ok(aRecentActivity.length === 1, "There is 1 item in the recent activity list");
//
//
//                    //***test phone scenario***
//                    sap.ui.Device.system.tablet = false;
//                    sap.ui.Device.system.phone = true;
//                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                        var oDeferred = new jQuery.Deferred();
//                        oDeferred.resolve(
//                            {
//                                "#xxx-tabletmobile": {"supported": true}
//                            });
//                        return oDeferred.promise();
//                    };
//                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                        //validate amount of apps  = same as before additions
//                        ok(aRecentActivity !== undefined, "User Recent activity return");
//                        ok(aRecentActivity.length === 1, "There is 1 item in the recent activity list");
//
//                        start();
//                        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = this.originalIsIntentSupported;
//                        sap.ui.Device.system.desktop = true;
//                        sap.ui.Device.system.phone = false;
//                    }.bind(this));
//                }.bind(this));
//            }.bind(this));
//        }.bind(this));
//    });
//
//    asyncTest("Add application that is supported on all devices to recent activities", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        this.oActivity = {
//            icon: "xxx",
//            title: "xxx",
//            appType: "app",
//            appId: "#xxx-desktoptabletmobile",
//            url: "xxx-xxx&2"
//        }
//
//        this.originalIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
//
//        oUserRecentsService.addActivity(this.oActivity).done(function () {
//            //***test desktop scenario***
//            sap.ui.Device.system.desktop = true;
//            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                var oDeferred = new jQuery.Deferred();
//                oDeferred.resolve(
//                    {
//                        "#xxx-desktoptabletmobile": {"supported": true}
//                    });
//                return oDeferred.promise();
//            };
//            oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                ok(aRecentActivity !== undefined, "User Recent activity return");
//                ok(aRecentActivity.length === 5, "There is 5 item in the recent activity list");
//
//                //***test tablet scenario***
//                sap.ui.Device.system.desktop = false;
//                sap.ui.Device.system.tablet = true;
//                sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                    var oDeferred = new jQuery.Deferred();
//                    oDeferred.resolve(
//                        {
//                            "#xxx-desktoptabletmobile": {"supported": true}
//                        });
//                    return oDeferred.promise();
//                };
//                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                    ok(aRecentActivity !== undefined, "User Recent activity return");
//                    ok(aRecentActivity.length === 2, "There are 2 items in the recent activity list"); // #xxx-desktoptabletmobile & #xxx-tabletmobile
//
//
//                    //***test phone scenario***
//                    sap.ui.Device.system.tablet = false;
//                    sap.ui.Device.system.phone = true;
//                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                        var oDeferred = new jQuery.Deferred();
//                        oDeferred.resolve(
//                            {
//                                "#xxx-desktoptabletmobile": {"supported": true}
//                            });
//                        return oDeferred.promise();
//                    };
//                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                        //validate amount of apps  = same as before additions
//                        ok(aRecentActivity !== undefined, "User Recent activity return");
//                        ok(aRecentActivity.length === 2, "There are 2 items in the recent activity list"); // #xxx-desktoptabletmobile & #xxx-tabletmobile
//
//                        start();
//                        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = this.originalIsIntentSupported;
//                        sap.ui.Device.system.desktop = true;
//                        sap.ui.Device.system.phone = false;
//                    }.bind(this));
//                }.bind(this));
//            }.bind(this));
//        }.bind(this));
//    });

    asyncTest("set multi recent activities of the same application", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "New application",
                    appType: "Application",
                    appId: "#new-app",
                    url: "#new-app"
            }, numberRecentActivities = aRecentActivity.length, // 1 from the previous test
                numberAddedActivities = 0;

            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#new-app": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aRecentActivity !== undefined, "User Recent activity return" );

            var addActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    //validate amount of apps  = same as before additions
                    numberAddedActivities++;
                    if (numberAddedActivities < 10) {
                        addActivityFn();
                    }
                    if (numberAddedActivities == 10) {
                        testActivityFn();
                    }
                }.bind(this));
            };

            testActivityFn = function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    start();
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return" );
                    ok(aRecentActivity.length === numberRecentActivities + 1, "we have 2 recent activities in the recent activity list" );
                    aRecentActivity[0].timestamp = oActivity.timestamp;
                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                }.bind(this));
            };

            addActivityFn();
        });
    });


    asyncTest("set more then 30 recent activities with a different application id", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "OVP application",
                    appType: "OVP",
                    appId: "#Action-todefaultapp",
                    url: "#Action-todefaultapp&1899"
            }, //numberRecentActivities = aRecentActivity.length,
                numberAddedActivities = 0;

            ok(aRecentActivity !== undefined, "User Recent activity return" );

            var addActivityFn = function () {
                oActivity.url += "x";
                oUserRecentsService.addActivity(oActivity).done(function () {
                    //validate amount of apps  = same as before additions
                    numberAddedActivities++;
                    if (numberAddedActivities < 40) {
                        addActivityFn();
                    }

                    if (numberAddedActivities == 40) {
                        testActivityFn();
                    }
                }.bind(this));
            };

            testActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                        start();
                        //validate amount of apps  = same as before additions
                        ok(aRecentActivity !== undefined, "User Recent activity return" );
                        equal(aRecentActivity.length, 30, "30 datasets" );
                        aRecentActivity[0].timestamp = oActivity.timestamp;
                        deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    }.bind(this));
                }.bind(this));
            };

            addActivityFn();
        });
    });

//	Remarked as it is not stable and need to be invesitgated
//
//	test("SaveDataForMoreThanMaxDaysLimit", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        var hash = "app_6";
//        var daysLimit = 30;
//        var clock;
//
//        for (var i = 1; i <= daysLimit + 1; i++)
//  {
/// clock = sinon.useFakeTimers(new Date(2014, 4, i, 8, 0, 0).getTime());// 01/05/2014 8:00 - 31/05/2014 8:00
//
// oUserRecentsService.addAppUsage(hash);
//  }
//
//        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
//      clock.restore();
//            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
//
//            //validate amount of app_6 = 30
//            deepEqual(aUserAppsUsage.usageMap[hash], 30, "Amount of User Apps Usage = 30");
//        });
//    });

    test("AppType display name corresponds to type", function() {
        var oAppTypeRef = sap.ushell.services.AppType;

        // Subtitle for those enum values should be equal to the value (string).
        equals(oAppTypeRef.getDisplayName(oAppTypeRef.OVP), oAppTypeRef.OVP, "Subtitle for OVP is `OVP`");
        equals(oAppTypeRef.getDisplayName(oAppTypeRef.SEARCH), oAppTypeRef.SEARCH, "Subtitle for SEARCH is `Search`");
        equals(oAppTypeRef.getDisplayName(oAppTypeRef.FACTSHEET), oAppTypeRef.FACTSHEET, "Subtitle for FACTSHEET is `FactSheet`");
        equals(oAppTypeRef.getDisplayName(oAppTypeRef.COPILOT), oAppTypeRef.COPILOT, "Subtitle for COPILOT is `Co-Pilot`");

        // Subtitle for those enum values should be equal to `App`.
        equals(oAppTypeRef.getDisplayName(oAppTypeRef.APP), "App", "Subtitle for APP should be `App`");
        equals(oAppTypeRef.getDisplayName("None-standard"), "App", "Subtitle for non-standard app type should be `App`");

    });

}());
