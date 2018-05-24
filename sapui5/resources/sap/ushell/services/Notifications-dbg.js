// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, window, OData */
    jQuery.sap.declare("sap.ushell.services.Notifications");

    jQuery.sap.require("sap.ui.thirdparty.datajs");

    /**
     * @class A UShell service for fetching user notification data from the Notification center/service<br>
     * and exposing them to the Unified Shell and Fiori applications UI controls.
     *
     * In order to get user notifications, Unified Shell notification service issues OData requests<br>
     * to the service defined by the configuration property <code>serviceUrl</code>,<br>
     * for example: "/sap/opu/odata4/iwngw/notification/default/iwngw/notification_srv/0001"<br>.
     *
     * Unified Shell Notification service has several working modes, depending on the environment and the available resources:<br>
     *  PackagedApp mode: Fiori launchpad runs in the context of PackagedApp<br>
     *  FioriClient mode: Fiori launchpad runs in the context of FioriLaunchpad<br>
     *  WebSocket mode: Fiori launchpad runs in a browser, and WebSocket connection to the notifications provider is available<br>
     *  Polling mode: Fiori launchpad in runs in a browser, and WebSocket connection to the notifications provider is not available<br>
     *
     * The notification service exposes an API that includes:
     * - Service enabling and initialization<br>
     * - Registration of callback functions (by Shell/FLP controls) that will be called for every data update<br>.
     * - Retrieval of notification data (e.g. notifications, number of unseen notifications)
     * - Execution of a notification actions
     * - Marking user notifications as seen
     *
     * @param {object} oContainerInterface
     *     The interface provided by the container
     * @param {object} sParameter
     *     Not used in this service
     * @param {object} oServiceProperties
     *     Service configuration
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.32.0
     *
     * @public
     */
    sap.ushell.services.Notifications = function (oContainerInterface, sParameters, oServiceConfiguration) {
        var oModel = new sap.ui.model.json.JSONModel(),
            tInitializationTimestamp = new Date(),
            oServiceConfig = oServiceConfiguration && oServiceConfiguration.config,
            aRequestURIs = {
                getNotifications : {},
                getNotificationsByType : {},
                getBadgeNumber : {},
                resetBadgeNumber : {}
            },
            oWebSocket,
            sWebSocketUrl = oServiceConfig.webSocketUrl || "/sap/bc/apc/iwngw/notification_push_apc",
            iPollingInterval = oServiceConfig.pollingIntervalInSeconds || 60,
            aUpdateNotificationsCallbacks = [],
            aUpdateNotificationsCountCallbacks = [],
            bIntentBasedConsumption = false,
            aConsumedIntents = [],
            bInitialized = false,
            bOnServiceDestroy = false,
            bEnabled = true,
            sHeaderXcsrfToken,
            sDataServiceVersion,
            tWebSocketRecoveryPeriod = 5000,
            tFioriClientInitializationPeriod = 6000,
            bWebSocketRecoveryAttempted = false,
            oURIsEnum = {
                NOTIFICATIONS: 0,
                NOTIFICATIONS_BY_TYPE: 1,
                GET_BADGE_NUMBER: 2,
                RESET_BADGE_NUMBER: 3
            },
            oModesEnum = {
                PACKAGED_APP: 0,
                FIORI_CLIENT: 1,
                WEB_SOCKET: 2,
                POLLING: 3
            },
            oCurrentMode,
            bFirstDataLoaded = false;

        // *************************************************************************************************
        // ************************************* Service API - Begin ***************************************

        /**
         * Indicates whether notification service is enabled.<br>
         * Enabling is based on the <code>enable</code> service configuration flag.<br>
         * The service configuration must also include serviceUrl attribute.<br>
         *
         * @returns {boolean} A boolean value indicating whether the notifications service is enabled
         *
         * @since 1.32.0
         *
         * @public
         */
        this.isEnabled = function () {
            if (!oServiceConfig.enabled || !oServiceConfig.serviceUrl) {
                bEnabled = false;
                if (oServiceConfig.enabled && !oServiceConfig.serviceUrl) {
                    jQuery.sap.log.warning("No serviceUrl was found in the service configuration");
                }
            } else {
                bEnabled = true;
            }
            return bEnabled;
        };

        /**
         * Initializes the notification service
         *
         * Initialization is performed only if the following two conditions are fulfilled:<br>
         *  1. Notification service is enabled<br>
         *  2. Notification service hasn't been initialized yet<br>
         *
         * The main initialization functionality is determining and setting the mode in which notifications are consumed.<br>
         * The possible modes are:<br>
         *  PACKAGED_APP - Notifications are fetched when a callback is called by PackagedApp environment<br>
         *  FIORI_CLIENT - Notifications are fetched when a callback is called by FioriClient environment<br>
         *  WEB_SOCKET - Notifications are fetched on WebSocket "ping"<br>
         *  POLLING - Notifications are fetched using periodic polling mechanism<br>
         *
         * @since 1.32
         *
         * @public
         */
        this.init = function () {
            if ((!bInitialized) && (this.isEnabled())) {
                this._setWorkingMode();
                bInitialized = true;
            }
        };

        /**
         * Returns the number of unseen notifications<br>
         * e.g. Notifications that the user hasn't seen yet.
         *
         * @returns {promise} Promise object that on success - returns the number of unread notifications of the user
         *
         * @since 1.32
         *
         * @public
         */
        this.getUnseenNotificationsCount = function () {
            var oDeferred = jQuery.Deferred();
            oDeferred.resolve(oModel.getProperty("/UnseenCount"));
            return oDeferred.promise();
        };

        /**
         * Returns the notifications of the user sorted by type include the group headers and the notifications
         *
         * @returns {promise} Promise object that on success - returns all notification items
         *
         * @since 1.38
         *
         * @public
         */
        this.getNotificationsByTypeWithGroupHeaders = function () {
            var oHeader,
                oRequestObject,
                oDeferred = new jQuery.Deferred(),
                sReadNotificationsByTypeWithGroupHeadersUrl = this._getRequestURI(oURIsEnum.NOTIFICATIONS_BY_TYPE);

            oRequestObject = {
                requestUri: sReadNotificationsByTypeWithGroupHeadersUrl
            };

            //  If CSRF token wasn't obtained yet - then set the header of the request so the token will be returned
            if (!this._getHeaderXcsrfToken()) {
                oHeader = {};
                oHeader["X-CSRF-Token"] = "fetch";
                oRequestObject.headers = oHeader;
            }
            OData.request(oRequestObject,
                function (oResult) {
                    oDeferred.resolve(oResult);
                }, function (oMessage) {
                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        oDeferred.resolve(oMessage.response.body);
                    } else {
                        oDeferred.reject();
                        jQuery.sap.log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.Notifications");
                    }
                });
            return oDeferred.promise();
        };


        /**
         * Returns the notifications of the user
         *
         * @returns {promise} Promise object that on success - returns all notification items
         *
         * @since 1.32
         *
         * @public
         */
        this.getNotifications = function () {
            var oReadPromise,
                oDeferred = jQuery.Deferred();

            if ((oCurrentMode === oModesEnum.FIORI_CLIENT) || (oCurrentMode === oModesEnum.PACKAGED_APP)) {
                // In Fiori Client mode, notification service fetches notification on initialization,
                // and after that - notification data is updated only by pushed notifications.
                // hence, there's no way that Notification service is updated regarding other changes
                // for example: if the user approved/rejected a notification via other device.
                // In order to solve this - we bring updated data when getNotifications is called from Fiori Client

                oReadPromise = this._readNotificationsData(false);
                oReadPromise.done(function () {
                    oDeferred.resolve(oModel.getProperty("/Notifications"));
                }).fail(function (sMsg) {
                    oDeferred.reject();
                });
            } else {
                // this._changeNotificationsDataForTest();

                // In case of offline testing (when OData calls fail):
                // Mark the following line and unmark the two successive lines
                oDeferred.resolve(oModel.getProperty("/Notifications"));
                // var tempNotificationsJSON = this._getDummyJSON();
                // oDeferred.resolve(tempNotificationsJSON);
            }
            return oDeferred.promise();
        };

        /**
         * Launches a notification action oData call.<br>
         *
         * After launching the action, the function gets updated notification data in order to push the updated data to the consumers.
         *
         * @param {object} sNotificationId The ID of the notification whose action is being executed
         *
         * @param {object} sActionId The ID of the action that is being executed
         *
         * @since 1.32
         *
         * @public
         */
        this.executeBulkAction = function (aNotificationIds, sActionId) {
            var oDeferred = new jQuery.Deferred(),
                aSuccededNotifications = [],
                aFailedNotifications = [],
                oResult = {
                    succededNotifications: aSuccededNotifications,
                    failedNotifications: aFailedNotifications
                },
                aDeferreds = [],
                that = this;

            aNotificationIds.forEach(function (sNotificationId, iIndex) {
                // we have to use separate promises that we'll always resolve
                // because jQuery.when immediately rejects upon the first rejected promise.
                var oDeferredWrapper = new jQuery.Deferred();

                aDeferreds.push(oDeferredWrapper.promise());
                that.executeAction(sNotificationId, sActionId)
                    .done(function () {
                        aSuccededNotifications.push(sNotificationId);
                        oDeferredWrapper.resolve();
                    })
                    .fail(function () {
                        aFailedNotifications.push(sNotificationId);
                        oDeferredWrapper.resolve();
                    });
            });
            jQuery.when.apply(jQuery, aDeferreds).always(function () {
                if (aFailedNotifications.length) {
                    oDeferred.reject(oResult);
                } else {
                    oDeferred.resolve(oResult);
                }
            });

            return oDeferred.promise();
        };

        this.dismissBulkNotifications = function (aNotificationIds) {
            var oDeferred = new jQuery.Deferred(),
                aSuccededNotifications = [],
                aFailedNotifications = [],
                oResult = {
                    succededNotifications: aSuccededNotifications,
                    failedNotifications: aFailedNotifications
                },
                aDeferreds = [],
                that = this;

            aNotificationIds.forEach(function (sNotificationId, iIndex) {
                // we have to use separate promises that we'll always resolve
                // because jQuery.when immediately rejects upon the first rejected promise.
                var oDeferredWrapper = new jQuery.Deferred();

                aDeferreds.push(oDeferredWrapper.promise());
                that.dismissNotification(sNotificationId)
                    .done(function () {
                        aSuccededNotifications.push(sNotificationId);
                        oDeferredWrapper.resolve();
                    })
                    .fail(function () {
                        aFailedNotifications.push(sNotificationId);
                        oDeferredWrapper.resolve();
                    });
            });
            jQuery.when.apply(jQuery, aDeferreds).always(function () {
                if (aFailedNotifications.length) {
                    oDeferred.reject(oResult);
                } else {
                    oDeferred.resolve(oResult);
                }
            });

            return oDeferred.promise();
        };

        this.executeAction = function (sNotificationId, sActionId) {
            // How to act in Fiori client use case?
            var sActionUrl = oServiceConfig.serviceUrl + "/ExecuteAction",
                oRequestBody = {NotificationId: sNotificationId, ActionId: sActionId},
                oRequestObject = {
                    requestUri: sActionUrl,
                    method: "POST",
                    data: oRequestBody,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "DataServiceVersion": sDataServiceVersion,
                        "X-CSRF-Token": sHeaderXcsrfToken
                    }
                },
                oDeferred = jQuery.Deferred();
            OData.request(oRequestObject,
                function (oResult) {
                    //that._readAllNotificationsData(true);
                    oDeferred.resolve();
                }, function (oMessage) {
                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        oDeferred.resolve();
                    } else {
                        oDeferred.reject();
                        jQuery.sap.log.error("Notification service - oData executeAction failed: ", oMessage, "sap.ushell.services.Notifications");
                    }
                });

            return oDeferred.promise();
        };

        /**
         * Launches mark as read notification call.<br>
         *
         * After launching the action, the function gets updated notification data in order to push the updated data to the consumers.
         *
         * @param {object} sNotificationId The ID of the notification whose action is being executed
         *
         * @since 1.34
         *
         * @public
         */
        this.markRead = function (sNotificationId) {
            var sActionUrl = oServiceConfig.serviceUrl + "/MarkRead",
                oRequestBody = {NotificationId: sNotificationId},
                oRequestObject = {
                    requestUri: sActionUrl,
                    method: "POST",
                    data: oRequestBody,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "DataServiceVersion": sDataServiceVersion,
                        "X-CSRF-Token": sHeaderXcsrfToken
                    }
                },
                oDeferred = jQuery.Deferred();
            OData.request(oRequestObject,
                function (oResult) {
                    //that._readAllNotificationsData(true);
                    oDeferred.resolve();
                }, function (oMessage) {
                    oDeferred.reject();
                    jQuery.sap.log.error("Notification service - oData markRead failed: ", oMessage, "sap.ushell.services.Notifications");
                });
            return oDeferred.promise();
        };
        /**
         * Launches dismiss notification call.<br>
         *
         * @param {object} sNotificationId The ID of the notification whose action is being executed
         *
         * @since 1.34
         *
         * @public
         */
        this.dismissNotification = function (sNotificationId) {
            var sActionUrl = oServiceConfig.serviceUrl + "/Dismiss",
                oRequestBody = {NotificationId: sNotificationId},
                oRequestObject = {
                    requestUri: sActionUrl,
                    method: "POST",
                    data: oRequestBody,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "DataServiceVersion": sDataServiceVersion,
                        "X-CSRF-Token": sHeaderXcsrfToken
                    }
                },
                oDeferred = jQuery.Deferred();
            OData.request(oRequestObject,
                function (oResult) {
                    //that._readAllNotificationsData(true);
                    oDeferred.resolve();
                }, function (oMessage) {
                    oDeferred.reject();
                    jQuery.sap.log.error("Notification service - oData dismiss notification failed: ", oMessage, "sap.ushell.services.Notifications");
                });
            return oDeferred.promise();
        };

        /**
         * Gets a callback function that will be called when updated notifications data is available.
         *
         * @param {object} The callback function that is registered and called on data update.
         *
         * @since 1.32
         *
         * @public
         */
        this.registerNotificationsUpdateCallback = function (callback) {
            aUpdateNotificationsCallbacks.push(callback);
        };

        /**
         * Gets a callback function that will be called when updated unseen notifications count is available.
         *
         * @param {object} The callback function that is registered and called on data update.
         *
         * @since 1.32
         *
         * @public
         */
        this.registerNotificationCountUpdateCallback = function (callback) {
            aUpdateNotificationsCountCallbacks.push(callback);
        };

        /**
         * Mark all notifications as seen.<br>
         * the main use-case is when the user navigated to the notification center and sees all the pending notifications.<br>
         *
         * @since 1.32
         *
         * @public
         */
        this.notificationsSeen = function () {
            this._setNotificationsAsSeen();
        };

        /**
         * Return whether first request was already performed and data was returned.<br>
         *
         * @since 1.38
         *
         * @public
         */
        this.isFirstDataLoaded = function () {
            return bFirstDataLoaded;
        };

        this.destroy = function () {
            bOnServiceDestroy = true;
            if ((oCurrentMode === oModesEnum.WEB_SOCKET) && oWebSocket) {
                oWebSocket.close();
            }
        };

        // ************************************** Service API - End ****************************************
        // *************************************************************************************************

        // *************************************************************************************************
        // ********************************* oData functionality - Begin ***********************************

        /**
         * Fetching notifications data from the notification center <br
         *  and announcing the relevant consumers by calling all registered callback functions.<br>
         *
         * This function fetches and sets the CSRF token that is required for POST requests.
         *
         * In Fiori Client mode there might be a case in which two sequential calls to _readNotificationsData are made
         *  in a short period of time:
         *  Steps:
         *   1. Push notification flow in Fiori Client invoked the callback _handlePushedNotification
         *   2. _handlePushedNotification calls _readNotificationsData
         *    (Push notification is actually a "ping" announcement for updates in the server)
         *   3. OData.read is issued, and then _updateConsumers is called (in the success handler of the OData.read)
         *   4. Some registered callback (registered by some UI control) is called by _updateConsumers
         *   5. The callback wishes to get the notifications, hence, calls the API function getNotifications
         *   6. In case of Fiori Client - getNotifications calls _readNotificationsData,
         *     hence the 2nd Odata.read call that we wish to avoid
         *   The solution is to prevent two sequential calls to OData.read (in case of Fiori Client)
         *    - if the time between them is less then iMinimumSecondsBetweenRequests
         *
         * @param {boolean} A boolean parameter indicating whether to update the registered consumers or not
         *
         * @private
         */
        this._readNotificationsData = function (bUpdateCustomers) {
            var that = this,
                oHeader,
                oRequestObject,
                aSortedNotifications,
                oReturnedObject,
                oDeferred = new jQuery.Deferred(),
                sReadNotificationsUrl = this._getRequestURI(oURIsEnum.NOTIFICATIONS);

            oRequestObject = {
                requestUri: sReadNotificationsUrl
            };

            //  If CSRF token wasn't obtained yet - then set the header of the request so the token will be returned
            if (!this._getHeaderXcsrfToken()) {
                oHeader = {};
                oHeader["X-CSRF-Token"] = "fetch";
                oRequestObject.headers = oHeader;
            }
            OData.read(
                oRequestObject,

                // Success handler
                function (oResult, oResponseData) {
                    oReturnedObject = oResult.results;
                    that._notificationAlert(oReturnedObject);

                    // TODO Remove this sorting when the OData parameter $orderby will be supported
                    aSortedNotifications = that._notificationsDescendingSortBy(oReturnedObject, "CreatedAt");
                    oModel.setProperty("/Notifications", aSortedNotifications);
                    if (bUpdateCustomers) {
                        that._updateNotificationsConsumers();
                    }
                    if (!that._getHeaderXcsrfToken()) {
                        sHeaderXcsrfToken = oResponseData.headers["x-csrf-token"];
                    }
                    if (!that._getDataServiceVersion()) {
                        sDataServiceVersion = oResponseData.headers.DataServiceVersion;
                    }
                    oDeferred.resolve();
                },
                function (oMessage) {

                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        oReturnedObject = JSON.parse(oMessage.response.body);
                        that._notificationAlert(oReturnedObject.value);

                        // TODO Remove this sorting when the OData parameter $orderby will be supported
                        aSortedNotifications = that._notificationsDescendingSortBy(oReturnedObject.value, "CreatedAt");
                        oModel.setProperty("/Notifications", aSortedNotifications);
                        if (bUpdateCustomers) {
                            that._updateNotificationsConsumers();
                        }
                        if (!that._getHeaderXcsrfToken()) {
                            sHeaderXcsrfToken = oMessage.response.headers["x-csrf-token"];
                        }
                        if (!that._getDataServiceVersion()) {
                            sDataServiceVersion = oMessage.response.headers.DataServiceVersion;
                        }

                        oDeferred.resolve();
                    } else {
                        jQuery.sap.log.error("Notification service - oData read notifications failed: ", oMessage.message, "sap.ushell.services.Notifications");
                        oDeferred.reject();
                    }
                }
            );
            return oDeferred.promise();
        };

        /**
         * Fetching the number of notifications that the user hasn't seen yet <br>
         *  and announcing the relevant consumers by calling all registered callback functions.<br>
         *
         * This function is similar to _readNotificationsData.
         * In the future the two functions will be sent together in a single batch request, when batch is supported.
         *
         * @param {boolean} A boolean parameter indicating whether to update the registered consumers or not
         *
         * @private
         */
        this._readUnseenNotificationsCount = function (bUpdateCustomers) {
            var that = this,
                sGetBadgeNumberUrl = this._getRequestURI(oURIsEnum.GET_BADGE_NUMBER),
                oRequestObject = {
                    requestUri: sGetBadgeNumberUrl
                };

            OData.read(
                oRequestObject,

                // success handler
                function (oResult, oResponseData) {
                    oModel.setProperty("/UnseenCount", oResponseData.data.GetBadgeNumber.Number);
                    if (bUpdateCustomers) {
                        that._updateNotificationsCountConsumers();
                    }
                },
                function (oMessage) {
                    if (oMessage.response && oMessage.response.statusCode === 200 && oMessage.response.body) {
                        var oReturnedObject = JSON.parse(oMessage.response.body);
                        oModel.setProperty("/UnseenCount", oReturnedObject.value);
                        if (bUpdateCustomers) {
                            that._updateNotificationsCountConsumers();
                        }
                    } else {
                        jQuery.sap.log.error("Notification service - oData read unseen notifications count failed: ", oMessage.message, "sap.ushell.services.Notifications");
                    }
                }
            );
        };

        this._setNotificationsAsSeen = function () {
            var sResetBadgeNumberUrl = this._getRequestURI(oURIsEnum.RESET_BADGE_NUMBER),
                oRequestObject = {
                    requestUri: sResetBadgeNumberUrl,
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "DataServiceVersion": sDataServiceVersion,
                        "X-CSRF-Token": sHeaderXcsrfToken
                    }
                };

            OData.request(
                oRequestObject,

                // success handler
                function (oResult, oResponseData) {
                },
                function (oMessage) {
                    jQuery.sap.log.error("Notification service - oData reset badge number failed: ", oMessage, "sap.ushell.services.Notifications");
                }
            );
        };

        this._readAllNotificationsData = function (bUpdateConsuners) {
            var oReadPromise,
                oDeferred = new jQuery.Deferred();

            this._readUnseenNotificationsCount(bUpdateConsuners);

            oReadPromise = this._readNotificationsData(bUpdateConsuners);
            oReadPromise.done(function () {
                oDeferred.resolve();
            }).fail(function (sMsg) {
                oDeferred.reject();
            });
            return oDeferred.promise();
        };

        this._getHeaderXcsrfToken = function () {
            return sHeaderXcsrfToken;
        };

        this._getDataServiceVersion = function () {
            return sDataServiceVersion;
        };

        /**
         * Returns the appropriate URI that should be used in an OData request according to the nature of the request
         * and according to filtering that might be required.
         * The object aRequestURIs is filled with the basic and/or byIntents-filter URI, and is used for maintaining the URIs throughout the session.
         *
         * @param {object} The value form the enumeration oURIsEnum, representing the relevant request
         * 
         * @returns {string} The URI that should be user in the OData.read call
         */
        this._getRequestURI = function (oRequiredURI) {
            var sReturnedURI,
                sEncodedConsumedIntents = encodeURI(this._getConsumedIntents(oRequiredURI));

            switch (oRequiredURI) {

            // Get notifications 
            case oURIsEnum.NOTIFICATIONS:
                if (aRequestURIs.getNotifications.basic === undefined) {
                    aRequestURIs.getNotifications.basic = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false";
                }
                if (this._isIntentBasedConsumption()) {
                    if (aRequestURIs.getNotifications.byIntents === undefined) {
                        aRequestURIs.getNotifications.byIntents = aRequestURIs.getNotifications.basic.concat("&intents%20eq%20" + sEncodedConsumedIntents);
                    }
                    return aRequestURIs.getNotifications.byIntents;
                }
                return aRequestURIs.getNotifications.basic;

            // Get notifications, grouped by type  
            case oURIsEnum.NOTIFICATIONS_BY_TYPE:
                if (aRequestURIs.getNotificationsByType.basic === undefined) {
                    aRequestURIs.getNotificationsByType.basic = oServiceConfig.serviceUrl + "/Notifications?$expand=Actions,NavigationTargetParams";
                }
                if (this._isIntentBasedConsumption()) {
                    if (aRequestURIs.getNotificationsByType.byIntents === undefined) {
                        aRequestURIs.getNotificationsByType.byIntents = aRequestURIs.getNotificationsByType.basic.concat("&$filter=intents%20eq%20" + sEncodedConsumedIntents);
                    }
                    return aRequestURIs.getNotificationsByType.byIntents;
                }
                return aRequestURIs.getNotificationsByType.basic;

            // Get badge number
            case oURIsEnum.GET_BADGE_NUMBER:
                if (aRequestURIs.getBadgeNumber.basic === undefined) {
                    aRequestURIs.getBadgeNumber.basic = oServiceConfig.serviceUrl + "/GetBadgeNumber()";
                }
                if (this._isIntentBasedConsumption()) {
                    if (aRequestURIs.getBadgeNumber.byIntents === undefined) {
                        aRequestURIs.getBadgeNumber.byIntents = oServiceConfig.serviceUrl + "/GetBadgeCountByIntent(" + sEncodedConsumedIntents + ")";
                    }
                    return aRequestURIs.getBadgeNumber.byIntents;
                }
                return aRequestURIs.getBadgeNumber.basic;

            // Reset badge number (i.e. mark all notifications as "seen")
            case oURIsEnum.RESET_BADGE_NUMBER:
                if (aRequestURIs.resetBadgeNumber.basic === undefined) {
                    aRequestURIs.resetBadgeNumber.basic = oServiceConfig.serviceUrl + "/ResetBadgeNumber";
                }
                return aRequestURIs.resetBadgeNumber.basic;

            default:
                sReturnedURI = "";
            }

            return sReturnedURI;
        };

        // ********************************** oData functionality - End ************************************
        // *************************************************************************************************

        this._updateNotificationsConsumers = function () {
            aUpdateNotificationsCallbacks.forEach(function (callback) {
                callback();
            });
        };

        this._updateNotificationsCountConsumers = function () {
            aUpdateNotificationsCountCallbacks.forEach(function (callback) {
                callback();
            });
        };

        this._getModel = function () {
            return oModel;
        };

        //*************************************************************************************************
        //***********************  Handle Notifications consumption / modes - Begin ***********************

        this._getMode = function () {
            return oCurrentMode;
        };

        /**
         * There are four possible modes of working of Notification service, defined by oModesEnum.
         * The following functions (i.e. steps) are executes sequentially, from _setWorkingMode (step 1) downwards
         * in order to find what is the relevant working mode for notification service and to activate it.
         */

        /**
         * Starting the process of defining the mode in which notifications service consume notifications data.
         * Step 1. Handle packagedApp mode
         */
        this._setWorkingMode = function () {
            var aConsumedIntentsFromConfig;

            // check service configuration for ConsumedIntents enabling flag and data
            if (oServiceConfig.intentBasedConsumption === true) {
                aConsumedIntents = this._getIntentsFromConfiguration(oServiceConfig.consumedIntents);
                if (aConsumedIntents.length > 0) {
                    // First setting of the flag is from service configuration
                    bIntentBasedConsumption = true;
                }
            }

            // Check if this is packagedApp use-case
            if (this._isPackagedMode()) {
                oCurrentMode = oModesEnum.PACKAGED_APP;

                // Consumed intents are read from PackagedApp configuration, if exist
                aConsumedIntentsFromConfig = this._getIntentsFromConfiguration(window.fiori_client_appConfig.applications);
                if (aConsumedIntentsFromConfig.length > 0) {
                    aConsumedIntents = aConsumedIntentsFromConfig;
                }

                if (aConsumedIntents.length > 0) {
                    // Second setting of the flag (to true) is done in case of PackagedApp mode and if any intents were configured
                    bIntentBasedConsumption = true;
                }

                this._registerForPush();
                this._readAllNotificationsData(true);
                return;
            }

            // Call step 2: Perform the first oData read request
            this._performFirstRead();
        };

        /**
         * Step 2. Issue the initial oData call for getting notification data,
         *  then wait until it is possible to check if we're in Fiori Client mode:
         *  The execution of the _isFioriClientMode check must be delayed by 6000ms for initial loading
         *  since it relies on the flag sap.FioriClient that is set by FioriClient
         */
        this._performFirstRead = function () {
            var that = this,
                tFioriClientRemainingDelay,
                oReadPromise = this._readAllNotificationsData(true);

            oReadPromise.done(function () {
                // Calculate time left until Fiori Client mode can be checked
                tFioriClientRemainingDelay = that._getFioriClientRemainingDelay();
                if (tFioriClientRemainingDelay <= 0) {
                    that._fioriClientStep();
                } else {
                    setTimeout(function () {
                        that._fioriClientStep();
                    }, tFioriClientRemainingDelay);
                }
                bFirstDataLoaded = true;
            }).fail(function (sMsg) {
                jQuery.sap.log.error("Notifications oData read failed. Error: " + sMsg);
                return;
            });
        };

        /**
         * Step 3. waiting the delay necessary for Fiori Client - Check if this is indeed Fiori Client mode
         * If so - initialize Fiori Client mode. If not - go to the nest step (webSocket)
         */
        this._fioriClientStep = function () {
            if (this._isFioriClientMode()) {
                oCurrentMode = oModesEnum.FIORI_CLIENT;
                this._addPushNotificationHandler();
            } else {
                this._webSocketStep();
            }
        };

        /**
         * Step 4. WebSocket step
         */
        this._webSocketStep = function () {
            oCurrentMode = oModesEnum.WEB_SOCKET;
            this._establishWebSocketConnection();
        };

        /**
         * Step 5. WebSocket recovery step
         * Called on WebSocket onClose event.
         * In this case there one additional trial to establish the WebSOcket connection.
         * If the additional attpemt also fails - move to polling
         */
        this._webSocketRecoveryStep = function () {
            if (bWebSocketRecoveryAttempted === false) {
                bWebSocketRecoveryAttempted = true;
                setTimeout(function() {
                    this._webSocketStep();
                }.bind(this), tWebSocketRecoveryPeriod);
            } else {
                this._activatePolling();
            }
        };

        /**
         * Step 6. Polling
         */
        this._activatePolling = function () {
            var that = this;
            oCurrentMode = oModesEnum.POLLING;

            this._readAllNotificationsData(true);
            // Call again after a delay
            this.timer = setTimeout(that._activatePolling.bind(that, iPollingInterval, false), (iPollingInterval * 1000));
        };

        this._formatAsDate = function (sUnformated) {
            return new Date(sUnformated);
        };

        this._notificationAlert = function (results) {
            var oNotification,
                aNewNotifications = [],
                nextLastNotificationDate = 0;

            for (oNotification in results) {
                if (this.lastNotificationDate && this._formatAsDate(results[oNotification].CreatedAt) > this.lastNotificationDate) {
                    if (results[oNotification].Priority === "HIGH") {
                        aNewNotifications.push(results[oNotification]);
                    }
                }
                //get the last notification date
                if (nextLastNotificationDate < this._formatAsDate(results[oNotification].CreatedAt)) {
                    nextLastNotificationDate = this._formatAsDate(results[oNotification].CreatedAt);
                }

            }
            if (this.lastNotificationDate && aNewNotifications && aNewNotifications.length > 0) {
                sap.ui.getCore().getEventBus().publish("sap.ushell.services.Notifications", "onNewNotifications", aNewNotifications);
            }
            this.lastNotificationDate = nextLastNotificationDate;
        };

        /**
         * Returning the time, in milliseconds, left until the end of FioriClient waiting period.
         * The required period is represented by tFioriClientInitializationPeriod,
         *  and we reduce the time passed from service initialization until now
         */
        this._getFioriClientRemainingDelay = function () {
            return tFioriClientInitializationPeriod - (new Date() - tInitializationTimestamp);
        };

        /**
         * Establishing a WebSocket connection for push updates
         */
        this._establishWebSocketConnection = function () {
            var that = this,
                oPcpFields;

            jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket");
            try {
                // Init WebSocket connection (TODO move into metadataloaded to ensure that authentication is done)
                // TODO: version 7.51 (ABAP) will include v11, with ping-pong health check
                // TODO: add the attachOpen function and log the event
                oWebSocket = new sap.ui.core.ws.SapPcpWebSocket(sWebSocketUrl, [sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10]);
                oWebSocket.attachMessage(this, function(oMessage, oData) {
                    // All this is a bit hacky from outside the model. It should be much easier when done within the UI5 model
                    oPcpFields = oMessage.getParameter("pcpFields");
                    if ((oPcpFields) && (oPcpFields.Command) && (oPcpFields.Command === "Notification")) {
                        // Receive "pings" for Notification EntitySet
                        // Another optional "ping" would be oPcpFields.Command === "Badge" for new Badge Number, but is currently not supported.
                        that._readAllNotificationsData(true);
                    }
                });

                oWebSocket.attachClose(this, function(oEvent, oData) {
                    jQuery.sap.log.error("Notifications UShell service WebSocket: attachClose called with code: " +  oEvent.mParameters.code + " and reason: " + oEvent.mParameters.reason);
                    if (!bOnServiceDestroy) {
                        that._webSocketRecoveryStep();
                    }
                });

                // attachError is not being handled since each attachError is followed by a call to attachClose (...which includes handling)
                oWebSocket.attachError(this, function(oError, oData) {
                    jQuery.sap.log.error("Notifications UShell service WebSocket: attachError called!");
                });
            } catch (e) {
                jQuery.sap.log.error("Exception occurred while creating new sap.ui.core.ws.SapPcpWebSocket. Message: " + e.message);
            }
        };
        // *********************** Handle Notifications consumption / modes - End **************************
        // *************************************************************************************************

        // *************************************************************************************************
        // **************** Helper functions for Fiori client and PackagedApp mode - Begin *****************

        this._isFioriClientMode = function () {
            return !(sap.FioriClient === undefined);
        };

        /**
         * Helper function for Packaged App mode
         */
        this._isPackagedMode = function () {
            return (window.fiori_client_appConfig && window.fiori_client_appConfig.prepackaged === true);
        };

        this._getIntentsFromConfiguration = function (aInput) {
            var aTempConsumedIntents = [],
                sTempIntent,
                index;

            if (aInput && aInput.length > 0) {
                for (index = 0; index < aInput.length; index++) {
                    sTempIntent = aInput[index].intent;
                    aTempConsumedIntents.push(sTempIntent);
                }
            }
            return aTempConsumedIntents;
        };

        this._handlePushedNotification = function (oData) {
            if (!(oData === undefined) && !(oData.additionalData === undefined)) {
                // TODO: Check flag to see if navigation is required + initiate click
                if (oData.additionalData.foreground) {
                    // Should be code for adding notifications to FLP’s notification center
                    // but instead we relate to this case an "update pinging", and then we get all notifications
                    this._readAllNotificationsData(true);
                } else {
                    // Open an Fiori app to process notification directly
                    this._readAllNotificationsData(true);
                }
            }
        };

        this._registerForPush = function () {
            sap.Push.initPush(this._handlePushedNotification.bind(this));
        };

        /**
         * For Fiori Client use case on mobile platform.
         * This function registers the callback this._handlePushedNotification for the deviceready event
         */
        this._addPushNotificationHandler = function () {
            document.addEventListener("deviceready", this._registerForPush.bind(this), false);
        };

        this._isIntentBasedConsumption = function () {
            return bIntentBasedConsumption;
        };
        
        /**
         * Creates and returns the intents filter string of an OData request
         * For example: &NavigationIntent%20eq%20%27Action-toappstatesample%27%20or%20NavigationIntent%20eq%20%27Action-toappnavsample%27
         */
        this._getConsumedIntents = function (oResuestURI) {
            var sConsumedIntents = "",
                index;

            if (!this._isIntentBasedConsumption()) {
                return sConsumedIntents;
            }

            if (aConsumedIntents.length > 0) {

                // If it is not GetBadgeNumber use-case then the intents filter string should start with "&"
                if (oResuestURI !== oURIsEnum.GET_BADGE_NUMBER) {
                    sConsumedIntents = "&";
                }

                for (index = 0; index < aConsumedIntents.length; index++) {
                    // If it is GetBadgeNumber use case then the intent are comma separated
                    if (oResuestURI === oURIsEnum.GET_BADGE_NUMBER) {
                        if (index === 0) {
                            sConsumedIntents = aConsumedIntents[index];
                        } else {
                            sConsumedIntents = sConsumedIntents + "," + aConsumedIntents[index];
                        }
                    } else {
                        sConsumedIntents = sConsumedIntents + "NavigationIntent%20eq%20%27" + aConsumedIntents[index] + "%27";
                    }
                }
            }
            return sConsumedIntents;
        };

        // **************** Helper functions for Fiori client and PackagedApp mode - End *****************
        // ***********************************************************************************************
        this._notificationsAscendingSortBy = function (aNotifications, sPropertyToSortBy) {
            aNotifications.sort(function (x, y) {
                var val1 = x[sPropertyToSortBy],
                    val2 = y[sPropertyToSortBy];

                if (val1 === val2) {
                    val1 = x.id;
                    val2 = y.id;
                }
                return val2 > val1 ? -1 : 1;
            });
            return aNotifications;
        };
        this._notificationsDescendingSortBy = function (aNotifications, sPropertyToSortBy) {
            aNotifications.sort(function (x, y) {
                var val1 = x[sPropertyToSortBy],
                    val2 = y[sPropertyToSortBy];

                // If the values of the two objects (the values of the sorting criterion) are equal,
                // then the sorting is done according to the objects' IDs
                if (val1 === val2) {
                    val1 = x.id;
                    val2 = y.id;
                    return val1 > val2 ? -1 : 1;
                }
                // If the sorting criterion is "priority" then we can not just compare the strings, because then the priority order is: "High", "Low", Medium".
                // instead, we find if one of the two objects has high priority.
                // if not, then we check if the 1st object has medium priority.
                // If not - then the 2nd object "wins"
                if (sPropertyToSortBy === "Priority") {
                    if (val1 === "HIGH") {
                        return -1;
                    }
                    if (val2 === "HIGH") {
                        return 1;
                    }
                    if (val1 === "MEDIUM") {
                        return -1;
                    }
                    return 1;
                }
                return val1 > val2 ? -1 : 1;
            });
            return aNotifications;
        };
    };
    sap.ushell.services.Notifications.hasNoAdapter = true;
}());
