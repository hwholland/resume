// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's user activity service.
 *
 * @version 1.38.26
 */
(function () {
    "use strict";
    /*jslint nomen:true */
    /*global jQuery, sap, console */
    jQuery.sap.declare("sap.ushell.services.UserRecents");
    jQuery.sap.require("sap.ushell.services.Personalization");
    sap.ushell.services.AppType = {
        OVP : "OVP",
        SEARCH: "Search",
        FACTSHEET: "FactSheet",
        COPILOT: "Co-Pilot",
        APP: "Application",

        getDisplayName: function(sAppType) {
            switch (sAppType) {
                case this.OVP:
                case this.SEARCH:
                case this.FACTSHEET:
                case this.COPILOT:
                    return sAppType;

                default:
                    return "App";
            }
        }
    };

    /**
     * This method is just for internal use within this service.
     * Constructs a new instance of a recent list, used for recent searches and recent apps.
     *
     * @param {integer} iMaxLength
     *     maximum number of entries in the list
     * @param {function} fnEquals
     *     used to decide whether an entry should be updated instead of inserting a new one
     * @param {function} fnCompare
     *     uesed to sort the list
     * @param {function} fnLoad
     *     called to load recent list from backend
     * @param {function} fnSave
     *     called to save current list into backend
     *
     * @constructor
     */
    function RecentList(iMaxLength, fnEquals, fnCompare, fnLoad, fnSave) {
        var aRecents = [],

        // private functions
            fnUpdateIfAlreadyIn = function (oItem, iTimestampNow) {
                return aRecents.some(function (oRecentEntry) {
                    var bFound;
                    if (fnEquals(oRecentEntry.oItem, oItem)) {
                        oRecentEntry.oItem = oItem;
                        oRecentEntry.iTimestamp = iTimestampNow;
                        oRecentEntry.iCount = oRecentEntry.iCount + 1;
                        bFound = true;
                    } else {
                        bFound = false;
                    }
                    return bFound;
                });
            },

            fnInsertNew = function (oItem, iTimestampNow) {
                var oNewEntry = {oItem: oItem,
                        iTimestamp: iTimestampNow,
                        iCount: 1};
                if (aRecents.length === iMaxLength) {
                    aRecents.sort(fnCompare);
                    aRecents.pop();
                }
                aRecents.push(oNewEntry);
            };

        // public interface
        this.newItem = function (oItem) {
            var oDeferred = new jQuery.Deferred();

            var iTimestampNow = +new Date(),  // timestamp: thanks to http://stackoverflow.com/a/221297
                bAlreadyIn;
            fnLoad().done(function (aLoadedRecents) {
                aRecents = aLoadedRecents || [];

                bAlreadyIn = fnUpdateIfAlreadyIn(oItem, iTimestampNow);
                if (!bAlreadyIn) {
                    fnInsertNew(oItem, iTimestampNow);
                }
                fnSave(aRecents).done(function (data) {
                    oDeferred.resolve(data);
                }).fail(function () {
                    oDeferred.reject();
                });
            });

            return oDeferred.promise();
        };

        this.getRecentItems = function () {
            var oDeferred = new jQuery.Deferred();

            fnLoad().done(function (aLoadedRecents) {
                aLoadedRecents = aLoadedRecents || [];
                aLoadedRecents.sort(fnCompare);
                aRecents = aLoadedRecents.slice(0, iMaxLength);
                oDeferred.resolve(jQuery.map(aRecents, function (oRecentEntry) {
                    return oRecentEntry.oItem;
                }));
            });

            return oDeferred.promise();
        };
    }

    /**
     * This method is just for internal use within this service.
     * Constructs a new instance of a recent activity, used for recent activity.
     *
     * @param {integer} iMaxLength
     *     maximum number of entries in the list
     * @param {function} fnEquals
     *     used to decide whether an entry should be updated instead of inserting a new one
     * @param {function} fnCompare
     *     uesed to sort the list
     * @param {function} fnLoad
     *     called to load recent list from backend
     * @param {function} fnSave
     *     called to save current list into backend
     *
     * @constructor
     */
    function RecentActivity(iMaxLength, fnEquals, fnCompare, fnLoad, fnSave) {
        var aRecents = [],

        // private functions
            fnUpdateIfAlreadyIn = function (oItem, iTimestampNow) {
                return aRecents.some(function (oRecentEntry) {
                    var bFound;
                    if (fnEquals(oRecentEntry.oItem, oItem)) {
                        if ((oRecentEntry.oItem.appType === oItem.appType) || (oRecentEntry.oItem.appType !== oItem.appType && oItem.appType !== 'Application')) {
                            jQuery.extend(oRecentEntry.oItem, oItem);
                            oRecentEntry.iTimestamp = iTimestampNow;
                            oRecentEntry.oItem.timestamp = iTimestampNow;
                            oRecentEntry.iCount = oRecentEntry.iCount + 1;
                            oRecentEntry.mobile = undefined;
                            oRecentEntry.tablet = undefined;
                            oRecentEntry.desktop = undefined;
                        }
                        bFound = true;
                        aRecents.sort(fnCompare);
                    } else {
                        bFound = false;
                    }
                    return bFound;
                });
            },

            fnInsertNew = function (oItem, iTimestampNow, sIcon) {
                oItem.timestamp = iTimestampNow;
                oItem.icon = sIcon;
                var oNewEntry = {oItem: oItem,
                    iTimestamp: iTimestampNow,
                    iCount: 1,
                    mobile: undefined,
                    tablet: undefined,
                    desktop: undefined
                    };
                if (aRecents.length === iMaxLength) {
                    aRecents.pop();
                }
                aRecents.unshift(oNewEntry);
            };

        // public interface
        this.newItem = function (oItem) {
            var oDeferred = new jQuery.Deferred();

            var iTimestampNow = +new Date(),  // timestamp: thanks to http://stackoverflow.com/a/221297
                sIcon =  oItem.icon ? oItem.icon : this.getActivityIcon(oItem.appType),
                bAlreadyIn;
            fnLoad().done(function (aLoadedRecents) {
                aRecents = aLoadedRecents || [];

                bAlreadyIn = fnUpdateIfAlreadyIn(oItem, iTimestampNow);
                if (!bAlreadyIn) {
                    fnInsertNew(oItem, iTimestampNow, sIcon);
                }
                fnSave(aRecents).done(function (data) {
                    oDeferred.resolve(data);
                }).fail(function () {
                    oDeferred.reject();
                });
            });

            return oDeferred.promise();
        };
        this.getActivityIcon = function (sAppType) {
            //TODO: the icon urls are only for mock - should be changed with actual urls
            switch (sAppType) {
                case sap.ushell.services.AppType.OVP:
                    return "sap-icon://competitor";
                case sap.ushell.services.AppType.SEARCH:
                    return "sap-icon://search";
                case sap.ushell.services.AppType.COPILOT:
                    return "sap-icon://BusinessSuiteInAppSymbols/icon-heart";
                case sap.ushell.services.AppType.FACTSHEET:
                    return "sap-icon://lead";
                default:
                    return "sap-icon://BusinessSuiteInAppSymbols/icon-heart";
            }

        };

        /**
         * getRecentItems return last 30 activities for current device.
         * - Check if for the current device we have unresolved entries.
         * - resolve the unresolved entries and set the attribute according to the current device.
         * - persist data.
         * - return the last 30 entries.
         */
        this.getRecentItems = function () {
            var oDeferred = new jQuery.Deferred(),
                activityIndex,
                oActivity,
                sCurrentDevice,
                bIsResolved = false,
                aIntentsToResolve = [],
            //Helper funtion the returns the last 30 recent activity supported by current device.
                getRecentItemsForDevice = function (aLoadedRecents) {
                    var recentActivityForDevice = [],
                        iDeviceDependentActivityCounter = 0,
                        iRecentActivityCounter;

                    for (iRecentActivityCounter = 0; iRecentActivityCounter < aLoadedRecents.length && iDeviceDependentActivityCounter < 30; iRecentActivityCounter++) {
                        oActivity = aLoadedRecents[iRecentActivityCounter];
                        if (oActivity[sCurrentDevice]) {
                            recentActivityForDevice.push(oActivity);
                            iDeviceDependentActivityCounter++;
                        }
                    }

                    oDeferred.resolve(jQuery.map(recentActivityForDevice, function (oRecentEntry) {
                        return oRecentEntry.oItem;
                    }));
                };

            if (sap.ui.Device.system.desktop) {
                sCurrentDevice = "desktop";
            } else if (sap.ui.Device.system.tablet) {
                sCurrentDevice = "tablet";
            } else {
                sCurrentDevice = "mobile";
            }

            fnLoad().done(function (aLoadedRecents) {
                aLoadedRecents = aLoadedRecents || [];

                //collect all unresolved activities for current device.
                for (activityIndex = 0; activityIndex < aLoadedRecents.length && !bIsResolved; activityIndex++) {
                    oActivity = aLoadedRecents[activityIndex];
                    if (oActivity[sCurrentDevice] === undefined) {
                        aIntentsToResolve.push(oActivity.oItem.appId);
                    } else {
                        //we have resolved the activities from here, no need to continue.
                        bIsResolved = true;
                    }
                }

                if (aIntentsToResolve.length > 0) {
                    //resolve intent support for current device.
                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(aIntentsToResolve)
                        .done(function (oResolved) {
                            //save resolutions in aLoadedRecents
                            bIsResolved = false;

                            for (activityIndex = 0; activityIndex < aLoadedRecents.length && !bIsResolved; activityIndex++) {
                                oActivity = aLoadedRecents[activityIndex];
                                if (oActivity[sCurrentDevice] === undefined) {
                                    var oItem = oResolved[oActivity.oItem.appId];
                                    oActivity[sCurrentDevice] = oItem && oItem.supported ? true : false;
                                } else {
                                    bIsResolved = true;
                                }
                            }

                            // persist it.
                            fnSave(aLoadedRecents).done(function (data) {
                                oDeferred.resolve(getRecentItemsForDevice(aLoadedRecents));
                            }).fail(function () {
                                oDeferred.reject();
                            });
                        })
                        .fail(function (sMsg) {
                            oDeferred.reject(sMsg);
                        });
                } else {
                    getRecentItemsForDevice(aLoadedRecents);
                }
            });

            return oDeferred.promise();
        };
    }



    /**
     * User action collector counter of user usage of applications according to the URL hash
     *
     * @param {function} fnLoad
     *     called to load current list from backend
     *
     * @param {function} fnSave
     *     called to save current list into backend
     */
    function RecentAppsUsage(fnLoad, fnSave) {

        var oAppsUsageData,
            that = this,
            iMaximumDays = 30;

        /**
         * Initialization of RecentAppsUsage.
         * Called from shell.controller's <code>init</code> function
         * - Loads user personalized data
         * - Defines a new day is the data structure, if needed
         * - Cleans empty hash usage arrays
         * @param currentDate
         */
        this.init = function () {
            var that = this,
                promise,
                currentDay = this.getDayFromDateObj(this.getCurrentDate()),
                bDataLoadedTriggered = false;

            if (that._oInitDeferred === undefined) {
                that._oInitDeferred = jQuery.Deferred();
            }

            // Personalized data not loaded yet
            if (!bDataLoadedTriggered || currentDay !== oAppsUsageData.recentDay) {
                bDataLoadedTriggered = true;

                // Load data
                promise = fnLoad();

                // Load finished successfully
                promise.done(function (data) {

                    // Initialize structure from the loaded data, or define new
                    oAppsUsageData = data || {
                        recentDay : null,
                        recentAppsUsageMap : {}
                    };

                    // Update usage
                    that.calculateInitialUsage(currentDay);
                    that._oInitDeferred.resolve(oAppsUsageData);
                });
                promise.fail(function () {
                    jQuery.sap.log.error("UShell-lib ; RecentAppsUsage ; Load data in Init failed");
                    that._oInitDeferred.reject();
                });

            }
            return this._oInitDeferred.promise();
        };

        // API functions - Begin

        this.calculateInitialUsage = function (currentDay) {
            var that = this;
            // If the current day is different than the recent one -
            // add a new entry (for the current day's usage) to each hash usage array
            if (currentDay != oAppsUsageData.recentDay) {
                this.addNewDay();
                oAppsUsageData.recentDay = currentDay;

                // Remove hash entries that weren't touched lately
                // postpone to not delay main flow
                setTimeout( function(){
                    that.cleanUnusedHashes();
                }, 3000 );

                // Save the data after the "new day" routine
                this.saveAppsUsage(oAppsUsageData);
            }
        };

        /**
         * Records applications usage according to URL hashes
         *  - Check hash validity
         *  - Gets the relevant hash usage array
         *  - Add this usage (increment the value) or create a new array if needed
         *  - Save the data structure
         *  @param hash
         */
        this.addAppUsage = function (hash) {

            // Check hash validity
            if (!sap.ushell.utils.validHash(hash)) {
                return  jQuery.Deferred().
                        reject("Non valid hash").
                        promise();
            }

            var promise = this.init();

            promise.done( function() {
                // Get the data (usage per day) for the given hash
                var aAppUsageArray = oAppsUsageData.recentAppsUsageMap[hash] || [];

                // New app that wasn't opened so far. Insert "1" since this is the first time it is opened
                if (aAppUsageArray.length == 0) {
                    aAppUsageArray[0] = 1;
                } else {
                    // Increment the existing counter of this day for this hash (i.e. the last entry in the array)
                    aAppUsageArray[aAppUsageArray.length - 1] += 1;
                }
                oAppsUsageData.recentAppsUsageMap[hash] = aAppUsageArray;
                that.saveAppsUsage(oAppsUsageData);
            });
            promise.fail( function() {
                jQuery.sap.log.error("Ushell-lib ; addAppUsage ; Initialization falied!");
            });
            return promise;
        };

        /**
         * Summarises and returns the usage per hash and the minimum and maximum values
         */
        this.getAppsUsage = function () {
            var result,
                promise,
                that = this,
                oDeffered = jQuery.Deferred();

            promise = that.init();

            // After initialization - summarize the usage
            promise.done( function () {
                result = that.summarizeUsage();
                oDeffered.resolve(result);
            });
            promise.fail( function () {
                oDeffered.reject("Not initialized yet");
            });
            return oDeffered.promise();
        };

        // API functions - End

        this.summarizeUsage = function () {
            var usageMap = {},
            hash,
            maxUsage,
            minUsage,
            firstHashUsage = true;

            for (hash in oAppsUsageData.recentAppsUsageMap) {
                usageMap[hash] = this.getHashUsageSum(hash);
                if (firstHashUsage) {
                    maxUsage = minUsage = usageMap[hash];
                    firstHashUsage = false;
                } else {
                    if (usageMap[hash] < minUsage) {
                        minUsage = usageMap[hash];
                    } else if (usageMap[hash] > maxUsage) {
                        maxUsage = usageMap[hash];
                    }
                }
            }
            return {usageMap : usageMap, maxUsage : maxUsage, minUsage : minUsage};
        };

        this.addNewDay = function () {
            var hash,
                aAppUsageArray;
            for (hash in oAppsUsageData.recentAppsUsageMap) {
                // Get the array of app/hash usage
                aAppUsageArray = oAppsUsageData.recentAppsUsageMap[hash];

                // Add an item in the Array for the new day
                aAppUsageArray[aAppUsageArray.length] = 0;

                // If the array size is > iMaximumDays, remove the first (oldest) entry
                if (aAppUsageArray.length > iMaximumDays) {
                    aAppUsageArray = aAppUsageArray.shift();
                }
            }
        };

        this.cleanUnusedHashes = function () {
            var usage,
                hash;
            for (hash in oAppsUsageData.recentAppsUsageMap) {
                usage = that.getHashUsageSum(hash);
                if (usage == 0) {
                    delete (oAppsUsageData.recentAppsUsageMap[hash]);
                }
            }
        };

        this.getHashUsageSum = function (hash) {
            var sum = 0,
                dayIndex,
                appUsageArray = oAppsUsageData.recentAppsUsageMap[hash],
                length = appUsageArray.length;

            for (dayIndex = 0; dayIndex < length; dayIndex++) {
                sum  += appUsageArray[dayIndex];
            }
            return sum;
        };

        this.saveAppsUsage = function (obj) {
            var promise = fnSave(obj);
            promise.fail(function () {
                jQuery.sap.log.error("Ushell-lib ; saveAppsUsage ; Save action failed");
            });
            promise.done(function (data) {

            });
            return promise;
        };

        this.getCurrentDate = function () {
            return new Date();
        };

        this.getDayFromDateObj = function (dateObj) {
            return (dateObj.getUTCFullYear() + "/" + (dateObj.getUTCMonth() + 1) + "/" + dateObj.getUTCDate());
        };
    }

    // -------------------------------- RecentAppsUsage - End --------------------------------

    /**
     * @class The Unified Shell's page user recents service. It used for managing recent searches and recently viewed apps.
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.15.0
     */
    sap.ushell.services.UserRecents = function () {
        var oRecentSearches,
            oRecentApps,
            oRecentActivity,
            oAppsUsage,
            oRecentDataSources,
            oPersonalizationService,
            oAppPersonalizer,
            oSearchesPersonalizer,
            oRecentActivityPersonalizer,
            oDataSourcePersonalizer,
            oAppsUsagePersonalizer,
            fnLoad,
            fnSave,
            sRecentAppsKey = "RecentApps",
            sRecentActivity = "RecentActivity",
            sAppsUsageKey = "AppsUsage",
            sRecentSearchesKey = "RecentSearches",
            sRecentDataSourcesKey = "RecentDataSources",
            sPersContainer = "sap.ushell.services.UserRecents";

        // BEWARE: constructor code below!

        /**
         * add the given activity item. Adds the action to the LRU
         * list of activities.
         *
         * @param {object} oActionItem
         *     the actionItem  <code>sTerm</code>
         * @returns {object[]}
         *     the updated LRU list
         * @since 1.32.0
         * @public
         */
        this.addActivity = function (oActionItem) {
            return oRecentActivity.newItem(oActionItem);
        };

        /**
         * Returns the LRU list of activities.
         *
         * @returns {object[]}
         *     the LRU list
         * @since 1.32.0
         * @public
         */
        this.getRecentActivity = function () {
            return oRecentActivity.getRecentItems();
        };


        /**
         * Notification that the given datasources has just been used. Adds the search to the LRU
         * list of datasources.
         *
         * @param {object} oDataSource
         *     the datasource identified by the string parameter <code>objectName.value</code>
         * @returns {object[]}
         *     the updated LRU list
         * @since 1.19.0
         * @public
         */
        this.noticeDataSource = function (oDataSource) {

            //Don't save $$ALL$$
            if ( (oDataSource && oDataSource.objectName && oDataSource.objectName.value && oDataSource.objectName.value.toLowerCase() === "$$all$$") ||
                (oDataSource.objectName && oDataSource.objectName.toLowerCase && oDataSource.objectName.toLowerCase() === "$$all$$")) {

                return;
            }

            oRecentDataSources.newItem(oDataSource);
            return oRecentDataSources.getRecentItems();
        };

        /**
         * Returns the LRU list of datasources.
         *
         * @returns {object[]}
         *     the LRU list
         * @since 1.19.0
         * @public
         */
        this.getRecentDataSources = function () {
            return oRecentDataSources.getRecentItems();
        };

        /**
         * Notification that the given search item has just been used. Adds the search to the LRU
         * list of searches.
         *
         * @param {object} oSearchItem
         *     the searchItem identified by the string parameter <code>sTerm</code>
         * @returns {object[]}
         *     the updated LRU list
         * @since 1.15.0
         * @public
         */
        this.noticeSearch = function (oSearchItem) {
            oRecentSearches.newItem(oSearchItem);
            return oRecentSearches.getRecentItems();
        };

        /**
         * Returns the LRU list of searches.
         *
         * @returns {object[]}
         *     the LRU list
         * @since 1.15.0
         * @public
         */
        this.getRecentSearches = function () {
            return oRecentSearches.getRecentItems();
        };

        /**
         * Notification that the given app has just been used. Adds the app to the LRU list of apps.
         *
         * @param {object} oAppItem
         *     the searchItem identified by the string parameter <code>id</code>
         * @returns {object[]}
         *     the updated LRU list
         * @since 1.15.0
         * @public
         */
        this.noticeApp = function (oAppItem) {
            oRecentApps.newItem(oAppItem);
            return oRecentApps.getRecentItems();
        };

        /**
         * Returns the LRU list of apps.
         *
         * @returns {object[]}
         *     the LRU list
         * @since 1.15.0
         * @public
         */
        this.getRecentApps = function () {
            return oRecentApps.getRecentItems();
        };

        this.initAppsUsage = function () {
            oAppsUsage.init(new Date());
        };

        /**
         * API function for the New VD 1 - user action Collector
         * Increment usage count for the given hash. Currently called on openApp event
         * @param hash
         */
        this.addAppUsage = function (hash) {
            var relevantHash = sap.ushell.utils.getBasicHash(hash);
            oAppsUsage.addAppUsage(relevantHash);
        };

        /**
         * API function for the New VD 1 - user action Collector
         * Returns a map of total usage of all (used) applications, plus the maximum and minimum values.
         *
         * @returns promise object including the relevant data:
         *  In case of success - An object containing usage-per-hash map  and the minimum and maximum values
         *  In case of fail - Error message
         */
        this.getAppsUsage = function () {
            return oAppsUsage.getAppsUsage();
        };

        // constructor code -------------------------------------------------------

        oPersonalizationService = sap.ushell.Container.getService("Personalization");
        try {
            oAppPersonalizer = oPersonalizationService.getPersonalizer({container: sPersContainer, item: sRecentAppsKey});
            oRecentActivityPersonalizer = oPersonalizationService.getPersonalizer({container: sPersContainer, item: sRecentActivity});
            oSearchesPersonalizer = oPersonalizationService.getPersonalizer({container: sPersContainer, item: sRecentSearchesKey});
            oDataSourcePersonalizer = oPersonalizationService.getPersonalizer({container: sPersContainer, item: sRecentDataSourcesKey});
            oAppsUsagePersonalizer = oPersonalizationService.getPersonalizer({container: sPersContainer, item: sAppsUsageKey});

        } catch (err) {
            jQuery.sap.log.error("Personalization service does not work:");
            jQuery.sap.log.error(err.name + ": " + err.message);
        }

        fnLoad = function (oPersonalizer) {
            var oPromise,
                oDeferred;
            try {
                oPromise = oPersonalizer.getPersData();
            } catch (err) {
                jQuery.sap.log.error("Personalization service does not work:");
                jQuery.sap.log.error(err.name + ": " + err.message);
                oDeferred = new jQuery.Deferred();
                oDeferred.reject(err);
                oPromise = oDeferred.promise();
            }
            return oPromise;
        };

        fnSave = function (oPersonalizer, aList) {
            var promise;
            try {
                promise = oPersonalizer.setPersData(aList);
            } catch (err) {
                jQuery.sap.log.error("Personalization service does not work:");
                jQuery.sap.log.error(err.name + ": " + err.message);
            }
            return promise;
        };

        oRecentSearches = new RecentList(10, function (x, y) {
            var compare = false;
            if (x.oDataSource && y.oDataSource) {
                if (x.oDataSource.objectName && y.oDataSource.objectName) {
                    compare = ((x.sTerm === y.sTerm) && (x.oDataSource.objectName.value === y.oDataSource.objectName.value));
                }
                if (!x.oDataSource.objectName && !y.oDataSource.objectName) {
                    compare = (x.sTerm === y.sTerm);
                }
            }
            if (!x.oDataSource && !y.oDataSource) {
                compare = (x.sTerm === y.sTerm);
            }
            return compare;
        }, function (x, y) {
            return y.iTimestamp - x.iTimestamp; // youngest first
        },
            fnLoad.bind(this, oSearchesPersonalizer),
            fnSave.bind(this, oSearchesPersonalizer));

        oRecentDataSources = new RecentList(6, function (x, y) {
            if (x.objectName && y.objectName) {
                return x.objectName.value === y.objectName.value;
            }
            return false;
        }, function (x, y) {
            return y.iTimestamp - x.iTimestamp; // youngest first
        },  fnLoad.bind(this, oDataSourcePersonalizer),
            fnSave.bind(this, oDataSourcePersonalizer));


        oRecentApps = new RecentList(6, function (x, y) {
            return x.semanticObject === y.semanticObject && x.action === y.action;
        }, function (x, y) {
            return y.iTimestamp - x.iTimestamp;
        }, fnLoad.bind(this, oAppPersonalizer), fnSave.bind(this, oAppPersonalizer));

        oRecentActivity = new RecentActivity(500, function (x, y) {
            if (x.appType === y.appType) {
                if (x.appType !== 'Application') {
                    return x.url === y.url;
                } else {
                    return x.appId === y.appId;
                }
            } else {
                if (x.appType === "Application" || y.appType === "Application") {
                    return (x.appId === y.appId) && (x.url === y.url);
                } else {
                    return false;
                }
            }

        }, function (x, y) {
            return y.iTimestamp - x.iTimestamp;
        }, fnLoad.bind(this, oRecentActivityPersonalizer), fnSave.bind(this, oRecentActivityPersonalizer));

        oAppsUsage = new RecentAppsUsage(fnLoad.bind(this, oAppsUsagePersonalizer), fnSave.bind(this, oAppsUsagePersonalizer));
    };

    sap.ushell.services.UserRecents.hasNoAdapter = true;
}());
