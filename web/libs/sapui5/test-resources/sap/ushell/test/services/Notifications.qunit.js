 // @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.Notifications
 */
(function () {
    "use strict";
    /* global module test ok sinon OData*/

    jQuery.sap.require('sap.ushell.services.Notifications');
    jQuery.sap.require("sap.ushell.services.Container");

    module(
        "sap.ushell.services.Notifications",
        {
            setup : function () {
                window.OData = {};
                window.OData.read = function () {return; };

            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                delete sap.ushell.Container;
            }
        }
    );

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(pattern) {
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        };
    }
    var oModesEnum = {
            PACKAGED_APP: 0,
            FIORI_CLIENT: 1,
            WEB_SOCKET: 2,
            POLLING: 3
        },
        sServicePath = "NOTIFICATIONS_SRV",
        oEnableServiceConfig = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: sServicePath
                    }
                }
            }
        },
        oBasicNotificationsResult = {
            "__count": "4",
            "results": [
                {
                    "id": "FirstNotification",
                    "isRead": false,
                    "CreatedAt" : "1457892950133"
                }, {
                    "id": "SecondNotification",
                    "isRead": false,
                    "CreatedAt" : "1457892950123"
                }, {
                    "id": "ThirdNotification",
                    "isRead": false,
                    "CreatedAt" : "1457892950103"
                }, {
                    "id": "FourthNotification",
                    "isRead": false,
                    "CreatedAt" : "1457892950100"
                }
            ]
        };

    /**
     * Service enabling by configuration:
     * Verify that the service is enabled when enable flag=true and a valid serviceUrl is provided
     */
    test("Service enablement 1", function () {
        var oService;
        window["sap-ushell-config"] = oEnableServiceConfig;
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        ok(oService.isEnabled() === true, "isEnabled configuration flag is read correctly");
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=false and a valid serviceUrl is provided
     */
    test("Service enablement 2", function () {
        var oService;
        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: false,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        ok(oService.isEnabled() === false, "isEnabled configuration flag is read correctly");
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=true but serviceUrl is an empty string
     */
    test("Service enablement 3", function () {
        var oService;
        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: ""
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        ok(oService.isEnabled() === false, "isEnabled returns false when serviceUrl is in the service configuration is an empty string");
    });

    /**
     * Service enabling by configuration:
     * Verify that the service is disabled when enable flag=true but no serviceUrl is provided
     */
    test("Service enablement 4", function () {
        var oService;
        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        ok(oService.isEnabled() === false, "isEnabled returns false when when no serviceUrl was found in the service configuration");
    });

    /**
     * Intent based consumption  - read data from service configuration
     */
    test("Intent based consumption  - read data from service configuration", function () {
        var oService,
            oPerformFirstReadSpy;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption : true,
                        consumedIntents : [
                            {intent: "object1-action1"},
                            {intent: "object1-action2"},
                            {intent: "object2-action1"}
                        ]
                    }
                }
            }
        };
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
        oService.init();
        ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
        ok(oService._getConsumedIntents() === "&NavigationIntent%20eq%20%27object1-action1%27NavigationIntent%20eq%20%27object1-action2%27NavigationIntent%20eq%20%27object2-action1%27", "Correct intents string");

        oPerformFirstReadSpy.restore();
    });

    /**
     * Packaged App use-case - read intent data from PackagedApp configuration
     */
    test("Packaged App use-case - read intent data from PackagedApp configuration", function () {
        var oService,
            oPerformFirstReadSpy;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        window.fiori_client_appConfig.applications = [
            {
                "id": "nw.epm.refapps.shop",
                "intent": "EPMProduct-shop"
            }, {
                "id": "nw.epm.refapps.products.manage",
                "intent": "EPMProduct-manage"
            }
        ];
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
        oService.init();

        ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
        ok(oService._getConsumedIntents() === "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

        oPerformFirstReadSpy.restore();
        window.fiori_client_appConfig = undefined;
    });

    /**
     * Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data
     */
    test("Packaged App use-case - read intent data from PackagedApp configuration and override service configuration data", function () {
        var oService,
            oPerformFirstReadSpy;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption : true,
                        consumedIntents : [
                            {intent: "object1-action1"},
                            {intent: "object1-action2"},
                            {intent: "object2-action1"}
                        ]
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        window.fiori_client_appConfig.applications = [
            {
                "id": "nw.epm.refapps.shop",
                "intent": "EPMProduct-shop"
            }, {
                "id": "nw.epm.refapps.products.manage",
                "intent": "EPMProduct-manage"
            }
        ];
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
        oService.init();

        ok(oService._isIntentBasedConsumption() === true, "Intent based consumption configuration flag read");
        ok(oService._getConsumedIntents(), "&NavigationIntent%20eq%20%27EPMProduct-shop%27NavigationIntent%20eq%20%27EPMProduct-manage%27", "Correct intents string");

        oPerformFirstReadSpy.restore();
        window.fiori_client_appConfig = undefined;
    });

    /**
     * Packaged App use-case and intent based consumption when there are no  intents
     */
    test("Packaged App use-case and intent based consumption when there are no  intents", function () {
        var oService,
            oPerformFirstReadSpy;

        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: true,
                        serviceUrl: "NOTIFICATIONS_SRV",
                        intentBasedConsumption : true,
                        consumedIntents : []
                    }
                }
            }
        };
        window.sap.Push = {};
        window.sap.Push.initPush = function () {};
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oPerformFirstReadSpy = sinon.spy(oService, "_performFirstRead");
        oService.init();

        ok(oService._isIntentBasedConsumption() === false, "Flag isIntentBasedConsumption is false when no intents are provided");
        ok(oService._getConsumedIntents().length === 0, "No intents read");

        oPerformFirstReadSpy.restore();
        window.fiori_client_appConfig = undefined;
    });

    /**
     * Packaged App use-case
     * Verify that the service private function _isPackagedApp returns true when window.fiori_client_appConfig.prepackaged is defined,
     */
    test("Identify packaged app mode", function () {
        var oService;
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        ok(oService._isPackagedMode() === true, "_isPackagedApp returns true when window.fiori_client_appConfig.prepackaged is defined");

        window.fiori_client_appConfig = undefined;
    });

    /**
     * Fiori client use-case:
     * Verify that the service private function _isFioriClientMode returns true when window.sap.FioriClient is defined
     */
    test("Identify Fiori Client mode", function () {
        var oService;
        window.sap.FioriClient = {};
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        ok(oService._isFioriClientMode() === true, "_isFioriClientMode returns true when sap.push is defined");

        window.sap.FioriClient = undefined;
    });

    test("Reach Packaged App step", function () {
        var oService,
            oIsPackagedAppModeStub,
            oGetIntentsFromConfigurationStub;

        window["sap-ushell-config"] = oEnableServiceConfig;
        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.applications = [];

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(true);
        oGetIntentsFromConfigurationStub = sinon.stub(oService, "_getIntentsFromConfiguration").returns([]);
        oService._registerForPush = sinon.spy();
        oService._readAllNotificationsData = sinon.spy();
        oService._performFirstRead = sinon.spy();

        oService.init();

        ok(oService._getMode() === oModesEnum.PACKAGED_APP, "_getMode returns oModesEnum.PACKAGED_APP");
        ok(oService._registerForPush.calledOnce === true, "_registerForPush called once");
        ok(oService._readAllNotificationsData.calledOnce === true, "_readAllNotificationsData called once");
        ok(oService._performFirstRead.notCalled === true, "_performFirstRead not called");

        oIsPackagedAppModeStub.restore();
        oGetIntentsFromConfigurationStub.restore();
        window.fiori_client_appConfig = undefined;
    });

    test("Reach Fiori Client step", function () {
        var oService,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oWebSocketStepStub,
            oFioriClientRemainingDelayStub,
            oDataReadStub;

        window["sap-ushell-config"] = oEnableServiceConfig;

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers : {
                    "x-csrf-token" : {},
                    DataServiceVersion : {}
                },
                data : {
                    GetBadgeNumber : {
                        Number : 4
                    }
                }
            });
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
        oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(true);
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        oService._webSocketStep = sinon.spy();

        oService.init();

        ok(oService._getMode() === oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
        ok(oService._webSocketStep.notCalled === true, "Next step (WebSocket) not reached");

        oDataReadStub.restore();
        oIsPackagedAppModeStub.restore();
        oIsFioriClientModeStub.restore();
        oFioriClientRemainingDelayStub.restore();
    });

    test("Reach WebSocket step", function () {
        var oService,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oWebSocketStepStub,
            oFioriClientRemainingDelayStub,
            oDataReadStub;

        window["sap-ushell-config"] = oEnableServiceConfig;

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers : {
                    "x-csrf-token" : {},
                    DataServiceVersion : {}
                },
                data : {
                    GetBadgeNumber : {
                        Number : 4
                    }
                }
            });
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
        oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        oService._webSocketRecoveryStep = sinon.spy();
        oService._activatePolling = sinon.spy();
        oService._establishWebSocketConnection = sinon.spy();

        oService.init();

        ok(oService._getMode() === oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
        ok(oService._establishWebSocketConnection.calledOnce === true, "_establishWebSocketConnection called once");
        ok(oService._webSocketRecoveryStep.notCalled === true, "Next step (_webSocketRecoveryStep) not reached");
        ok(oService._activatePolling.notCalled === true, "Next step (_activatePolling) not reached");

        oDataReadStub.restore();
        oIsPackagedAppModeStub.restore();
        oIsFioriClientModeStub.restore();
        oFioriClientRemainingDelayStub.restore();
    });

    test("Reach WebSocket recovery mode", function () {
        var oService,
	        oIsPackagedAppModeStub,
	        oIsFioriClientModeStub,
	        oReturnedWebSocket,
	        oFioriClientRemainingDelayStub,
	        oWebSocketRecoveryStepSpy,
	        fGivenOnCloseCallback,
	        oDataReadStub,
	        oRequireStub,
	        oOnErrorEvent = {
	    		mParameters : {
	    			code : "",
	    			reason : ""
	    		}
	    	};

	    window["sap-ushell-config"] = oEnableServiceConfig;

	    oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
	        success({results: oBasicNotificationsResult.results}, {
	            headers : {
	                "x-csrf-token" : {},
	                DataServiceVersion : {}
	            },
	            data : {
	                GetBadgeNumber : {
	                    Number : 4
	                }
	            }
	        });
	    });

	    // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
	    oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

	    // Define the custom WebSocket object
	    // including an attachClose function that gets the onError callback in _establishWebSocketConnection
	    // Later, we call that callback (with an appropriate message) and check that _readAllNotificationsData is called as a result
	    oReturnedWebSocket = function (param1, param2) {
	    	this.attachMessage = function (oMessage, callback) {};
	    	this.attachError = function (oMessage, callback) {};
	    	this.attachClose = function (oMessage, callback) {
	            fGivenOnCloseCallback = callback;
	    	}
	    };

	    sap.ui.core.ws = {};
	    sap.ui.core.ws.SapPcpWebSocket = oReturnedWebSocket;
	    sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS = {};

	    sap.ushell.bootstrap("local");
	    oService = sap.ushell.Container.getService("Notifications");

	    oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
	    oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
	    oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
	    oWebSocketRecoveryStepSpy = sinon.spy(oService, "_webSocketRecoveryStep");
	    oService._activatePolling = sinon.spy();

	    oService.init();

	    // Call WebSocket onError in order to invoke WebSocketRecovery
	    fGivenOnCloseCallback(oOnErrorEvent);

	    ok(oWebSocketRecoveryStepSpy.calledOnce === true, "oWebSocketRecoveryStepSpy called once");
	    ok(oService._activatePolling.notCalled === true, "_activatePolling not called");

	    oDataReadStub.restore();
	    oRequireStub.restore();
	    oIsPackagedAppModeStub.restore();
	    oIsFioriClientModeStub.restore();
	    oWebSocketRecoveryStepSpy.restore();
	    oFioriClientRemainingDelayStub.restore();
    });

    test("Reach Polling step", function () {
        var oService,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oReturnedWebSocket,
            oFioriClientRemainingDelayStub,
            fGivenOnCloseCallback,
            oDataReadStub,
            oRequireStub,
            oClock = sinon.useFakeTimers(),
            oOnErrorEvent = {
        		mParameters : {
        			code : "",
        			reason : ""
        		}
        	};

        window["sap-ushell-config"] = oEnableServiceConfig;

        oDataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers : {
                    "x-csrf-token" : {},
                    DataServiceVersion : {}
                },
                data : {
                    GetBadgeNumber : {
                        Number : 4
                    }
                }
            });
        });

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        // Define the custom WebSocket object
        // including an attachClose function that gets the onError callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readAllNotificationsData is called as a result
        oReturnedWebSocket = function (param1, param2) {
        	this.attachMessage = function (oMessage, callback) {};
        	this.attachError = function (oMessage, callback) {};
        	this.attachClose = function (oMessage, callback) {
                fGivenOnCloseCallback = callback;
        	}
        };

        sap.ui.core.ws = {};
        sap.ui.core.ws.SapPcpWebSocket = oReturnedWebSocket;
        sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS = {};

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
        oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        oService._activatePolling = sinon.spy();

        oService.init();

        // Call WebSocket onError in order to invoke WebSocketRecovery for the first time
        fGivenOnCloseCallback(oOnErrorEvent);

        // The following happens as a result of the call to fGivenOnCloseCallback (previous command):
        // - The function _webSocketRecoveryStep of notifications service is called
        // - setTimeout is called (from _webSocketRecoveryStep) with a period of 5000 second
        // Since we want to call for the second time - we need to remove the clock more than 5000ms forward.
        oClock.tick(6000);

        // Call WebSocket onError in order to invoke WebSocketRecovery for the second time
        fGivenOnCloseCallback(oOnErrorEvent);

        ok(oService._activatePolling.calledOnce === true, "_activatePolling called once");

        oClock.restore();
	    oDataReadStub.restore();
	    oRequireStub.restore();
	    oIsPackagedAppModeStub.restore();
	    oIsFioriClientModeStub.restore();
	    oFioriClientRemainingDelayStub.restore();
    });

    test("Get request URLs including intent based consumption", function () {
        var oService,
            oIsIntentBasedConsumptionStub,
            oGetConsumedIntentsStub;

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsIntentBasedConsumptionStub = sinon.stub(oService, "_isIntentBasedConsumption").returns(true);
        oGetConsumedIntentsStub = sinon.stub(oService, "_getConsumedIntents").returns(["a-b", "a-c", "c-b"]);

        ok(oService._getRequestURI(0) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false&intents%20eq%20a-b,a-c,c-b", "Intent based consumption - correct getNotifications URL");
        ok(oService._getRequestURI(1) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=intents%20eq%20a-b,a-c,c-b", "Intent based consumption - correct getNotificationsByType URL");
        ok(oService._getRequestURI(2) === "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,c-b)", "Intent based consumption - correct GetBadgeNumber URL");

        oIsIntentBasedConsumptionStub.restore();
        oIsIntentBasedConsumptionStub = sinon.stub(oService, "_isIntentBasedConsumption").returns(false);

        ok(oService._getRequestURI(0) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false", "Not intent based consumption - correct getNotifications URL");
        ok(oService._getRequestURI(1) === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams", "Not intent based consumption - correct getNotificationsByType URL");
        ok(oService._getRequestURI(2) === "NOTIFICATIONS_SRV/GetBadgeNumber()", "Not intent based consumption - correct GetBadgeNumber URL");

        oIsIntentBasedConsumptionStub.restore();
        oGetConsumedIntentsStub.restore();
    });            

    /**
     * Service initialization in PackagedApp use-case:
     * Verify that polling is not activated, and instead - one read operation is executed (call to _readAllNotificationsData)
     *  also: verify that the handler _handlePushedNotification is registered
     */
    test("Init in PackagedApp mode", function () {
        var oService,
            oRegisterForPushStub;

        window["sap-ushell-config"] = oEnableServiceConfig;

        window.fiori_client_appConfig = {};
        window.fiori_client_appConfig.prepackaged = true;
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oRegisterForPushStub = sinon.stub(oService, "_registerForPush").returns();
        oService._activatePolling = sinon.spy();
        oService._readAllNotificationsData = sinon.spy();

        oService.init();
        ok(oService._getMode() === oModesEnum.PACKAGED_APP, "_getMode returns the correct mode");
        ok(oRegisterForPushStub.calledOnce === true, "oRegisterForPush is called only once");
        ok(oService._activatePolling.notCalled === true, "_activatePolling not called");
        ok(oService._readAllNotificationsData.calledOnce === true, "_readAllNotificationsData called once");

        window.fiori_client_appConfig = undefined;
        oRegisterForPushStub.restore();
    });

    /**
     * Service initialization in Fiori client use-case:
     * Verify that polling is not activated, and instead - one read operation is executed (call to _readAllNotificationsData)
     *  also: verify that the handler _handlePushedNotification is registered for the event deviceready
     */
    test("Init in Fiori Client mode", function () {
        var oService,
            oAddEventListenerStub,
            oEstablishWebSocketStub,
            oFioriClientRemainingDelayStub,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            fHandler = function () {};

        window["sap-ushell-config"] = oEnableServiceConfig;

        sinon.stub(OData, "read", function (request, success, fail) {
            success({results: oBasicNotificationsResult.results}, {
                headers : {
                    "x-csrf-token" : {},
                    DataServiceVersion : {}
                },
                data : {
                    GetBadgeNumber : {
                        Number : 4
                    }
                }
            });
        });

        window.sap.Push = {};
        window.sap.Push.initPush = {};
        oAddEventListenerStub = sinon.stub(document, "addEventListener", function (sEventName, fCallback, bFlag) {return; });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService._getPushedNotificationCallback = fHandler;
        
        // Indicating that it is not packagedAdd mode
        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
        // Indicating that it is FioriClient mode
        oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(true);
        // For validating that the next step (after FioriClient step) is not called
        oService._webSocketStep = sinon.spy();
        // In order to avoid waiting with setTimout to the end of the required FioriClient delay
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);

        oService.init();

        ok(oService._getMode() === oModesEnum.FIORI_CLIENT, "_getMode returns oModesEnum.FIORI_CLIENT");
        ok(oService._webSocketStep.notCalled === true, "Fiori Client mode: _activatePolling not called");
        ok(oAddEventListenerStub.calledOnce, "document.addEventListener called once");
        ok(oAddEventListenerStub.args[0][0] === "deviceready", "Callback registered for event deviceready");

        oAddEventListenerStub.restore();
        oFioriClientRemainingDelayStub.restore();
        oIsPackagedAppModeStub.restore();
        oIsFioriClientModeStub.restore();
        document.removeEventListener("deviceready", fHandler);
    });

    /**
     * WebSocket use-case and handling of a "ping" message
     */
    test("WebSocket mode", function () {
        var oService,
            oReturnedWebSocket,
            oWebSocketPingMessage,
            fGivenAttachMessageCallback,
            oRequireStub,
            oOriginalSapUiCoreWS = sap.ui.core.ws;

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService._activatePolling = sinon.spy();

        // The call to _readAllNotificationsData is what we would like to test,
        // as a result of the next call to fGivenAttachMessageCallback
        oService._readAllNotificationsData = sinon.spy();

        oWebSocketPingMessage = {
            getParameter : function (sParamName) {
                if (sParamName === "pcpFields") {
                	return {
                		Command : "Notification"
                	}
                }
            }
        }

        // We don't want jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket") to be performed
        oRequireStub = sinon.stub(jQuery.sap, "require").returns({});

        // Define the custom WebSocket object.
        // It includes an attachMessage function that gets the onMessage callback in _establishWebSocketConnection
        // Later, we call that callback (with an appropriate message) and check that _readAllNotificationsData is called as a result
        oReturnedWebSocket = function (param1, param2) {
        	this.attachMessage = function (oMessage, callback) {
        		fGivenAttachMessageCallback = callback;
        	};
        	this.attachClose = function (oMessage, callback) {};
        	this.attachError = function (oMessage, callback) {};
        };

        sap.ui.core.ws = {};
        sap.ui.core.ws.SapPcpWebSocket = oReturnedWebSocket;
        sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS = {};

        // Start the flow
        oService._webSocketStep();

        ok(oService._readAllNotificationsData.notCalled === true, "Before the onMessage callback: _readAllNotificationsData not called");

        // Call the message callback in order to verify that it calls _readAllNotificationsData
        fGivenAttachMessageCallback(oWebSocketPingMessage, {});

        ok(oService._readAllNotificationsData.calledOnce === true, "After the onMessage callback: _readAllNotificationsData called from the WebSoocket on attachMessage event");
        ok(oService._getMode() === oModesEnum.WEB_SOCKET, "_getMode returns oModesEnum.WEB_SOCKET");
    	ok(oService._activatePolling.notCalled === true, "_activatePolling not called");

    	oRequireStub.restore();
        sap.ui.core.ws = oOriginalSapUiCoreWS;
    });

    /**
     * Verify that the OData calls are sent correctly
     */
    test("Verify that the OData calls are sent correctly", function () {
        var oService,
            oFioriClientRemainingDelayStub,
            oEstablishWebSocketStub;

        window.OData.request = sinon.spy();
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

	    oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        oService._readAllNotificationsData = sinon.spy();
        oService._updateNotificationsConsumers = sinon.spy();
        oService._updateNotificationsCountConsumers = sinon.spy();
	    oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
	    oService._determineMode = sinon.spy();
        oService.notificationsSeen();
        oService._readUnseenNotificationsCount();
        oService._readNotificationsData();
        oService.executeAction("notificationId", "actionId");

        ok(OData.request.args[1][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[1][0].requestUri.endsWith("ExecuteAction") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[1][0].data.ActionId === "actionId", "ActionId should be 'actionId'");
        ok(OData.request.args[1][0].data.NotificationId === "notificationId", "NotificationId should be 'notificationId'");

        oService.executeBulkAction(["notificationId1", "notificationId2", "notificationId3"], "actionIdForBulk");
        ok (OData.request.args.length === 5 , "number of calls to execute action need to be 5, 2 in the begginng of the test and more 3");

        ok(OData.request.args[2][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[2][0].requestUri.endsWith("ExecuteAction") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[2][0].data.ActionId === "actionIdForBulk", "ActionId should be 'actionIdForBulk'");
        ok(OData.request.args[2][0].data.NotificationId  === "notificationId1", "should be notificationId1");

        ok(OData.request.args[3][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[3][0].requestUri.endsWith("ExecuteAction") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[3][0].data.ActionId === "actionIdForBulk", "ActionId should be 'actionIdForBulk'");
        ok(OData.request.args[3][0].data.NotificationId  === "notificationId2", "should be notificationId2");

        ok(OData.request.args[4][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[4][0].requestUri.endsWith("ExecuteAction") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[4][0].data.ActionId === "actionIdForBulk", "ActionId should be 'actionIdForBulk'");
        ok(OData.request.args[4][0].data.NotificationId  === "notificationId3", "should be notificationId2");

        oService.dismissBulkNotifications(["notificationId1", "notificationId2", "notificationId3"]);
        ok (OData.request.args.length === 8 , "number of calls to execute action need to be 8");

        ok(OData.request.args[5][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[5][0].requestUri.endsWith("Dismiss") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[5][0].data.NotificationId  === "notificationId1", "should be notificationId1");

        ok(OData.request.args[6][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[6][0].requestUri.endsWith("Dismiss") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[6][0].data.NotificationId  === "notificationId2", "should be notificationId2");

        ok(OData.request.args[7][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[7][0].requestUri.endsWith("Dismiss") === true, "notificationsSeen: OData.request was called with function ExecuteAction");
        ok(OData.request.args[7][0].data.NotificationId  === "notificationId3", "should be notificationId2");

        window.OData.request = {};
        oEstablishWebSocketStub.restore();
        oFioriClientRemainingDelayStub.restore();
    });

    /**
     * Verify that the model is updated correctly with notifications data
     */
    test("Verify that the model is updated correctly with notifications data", function () {
        var oService,
            oEstablishWebSocketStub,
            oFioriClientRemainingDelayStub,
            oUnseenCount = {
                "data" :
                    {
                        "GetBadgeNumber" :
                            {
                                "Number" : 1
                            }
                    }
            };

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        sinon.stub(oService, "_activatePolling", function () {
            oService._readAllNotificationsData(true);
        });
        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

	    oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);
        oService._isFioriClientMode = sinon.stub().returns(false);
        oService._updateNotificationsConsumers = sinon.spy();
        oService._updateNotificationsCountConsumers = sinon.spy();
	    oService._determineMode = sinon.spy();
	    oService._establishWebSocketConnection = sinon.spy();
        oService._getModel().setProperty = sinon.spy();

        oService.init();
        ok(oService._getModel().setProperty.calledTwice === true, "setProperty of the model was called twice");
        ok(oService._getModel().setProperty.args[0][0] === "/UnseenCount", "2nd call to setProperty: setting UnseenCount");
        ok(oService._getModel().setProperty.args[0][1] === 1, "2nd call to setProperty:  putting the value 1");
        ok(oService._getModel().setProperty.args[1][0] === "/Notifications", "1st call to setProperty: setting Notifications data");
        ok(oService._getModel().setProperty.args[1][1].length === 4, "1st call to setProperty: putting 4 array of 4 notifications");

        OData.read.restore();
        oEstablishWebSocketStub.restore();
        oFioriClientRemainingDelayStub.restore();
    });

    /**
     * Register callback functions and call them on data update (OData.read success)
     */
    test("Callback functions called on update", function () {
        var oService,
            oUnseenCount = {
                "data" :
                    {
                        "GetBadgeNumber" :
                            {
                                "Number" : 2
                            }
                    }
            },
            oNotificationsCallback1 = sinon.spy(),
            oNotificationsCallback2 = sinon.spy(),
            oNotificationsCallback3 = sinon.spy(),
            oNotificationsCountCallback1 = sinon.spy(),
            oNotificationsCountCallback2 = sinon.spy(),
            oNotificationsCountCallback3 = sinon.spy();

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sap.ushell.bootstrap("local");

        oService = sap.ushell.Container.getService("Notifications");
	    var oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
	    var oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection", function () {
        	oService._activatePolling();
	    });
	    oService._isFioriClientMode = sinon.stub().returns(false);
        oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);

        // Register notifications callback functions
        oService.registerNotificationsUpdateCallback(oNotificationsCallback1);
        oService.registerNotificationsUpdateCallback(oNotificationsCallback2);
        oService.registerNotificationsUpdateCallback(oNotificationsCallback3);

        // Register notifications count callback functions
        oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback1);
        oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback2);
        oService.registerNotificationCountUpdateCallback(oNotificationsCountCallback3);

        sinon.stub(oService, "_activatePolling", function () {
            oService._readAllNotificationsData(true);
        });

        oService.init();
        ok(oNotificationsCallback1.calledTwice === true, "1st notifications callback called");
        ok(oNotificationsCallback2.calledTwice === true, "2nd notifications callback called");
        ok(oNotificationsCallback3.calledTwice === true, "3rd notifications callback called");

        ok(oNotificationsCountCallback1.calledTwice === true, "1st notifications count callback called");
        ok(oNotificationsCountCallback2.calledTwice === true, "2nd notifications count callback called");
        ok(oNotificationsCountCallback3.calledTwice === true, "3rd notifications count callback called");

        oService._activatePolling.restore();
        oEstablishWebSocketStub.restore();
        OData.read.restore();
    });

    /**
     * Disable calling callback functions after notifications data read
     */
    test("Disable calling callback functions after notifications data read", function () {
        var oService,
            oNotifications = {
                "d": {
                    "__count": "1",
                    "results": []
                }
            },
            oUnseenCount = {
                "data" : {
                    "GetBadgeNumber" : {
                        "Number" : 2
                    }
                }
            };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sap.ushell.bootstrap("local");

        oService = sap.ushell.Container.getService("Notifications");

        oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);
        oService._isFioriClientMode = sinon.stub().returns(false);
        oService._updateNotificationsConsumers = sinon.spy();
        oService._updateNotificationsCountConsumers = sinon.spy();

        // Call _readAllNotificationsData with parameter false in oder to disable calling the registered callback functions
        oService._readAllNotificationsData(false);
        ok(oService._updateNotificationsConsumers.notCalled === true, "Service private function _updateNotificationsConsumers was not called because the value 'false' was passed to _readAllNotificationsData");
        ok(oService._updateNotificationsCountConsumers.notCalled === true, "Service private function _updateNotificationsCountConsumers was not called because the value 'false' was passed to _readAllNotificationsData");

        OData.read.restore();
    });

    /**
     * getNotifications full flow, including:
     * - Service initialization
     * - Cosumer registraiotn oc callback function
     * - First readNotification call
     * - Verify that the resigtered callback was called with the correct notifications data
     */
    test("API: getNotifications full flow", function () {
        var oService,
            oIsPackagedAppModeStub,
            oUnseenCount = {
                "data" : {
                    "GetBadgeNumber" : {
                        "Number" : 4
                    }
                }
            },
            oCallbackForNotifications = function () {
                var oNotificationsPromise = oService.getNotifications();
                oNotificationsPromise.done(function (oNotifications) {
                    ok(oNotifications.length  === 4, "Function getNotifications returns the expected number of notifications");
                    ok(oNotifications[0].id === "FirstNotification", "First notification is correct");
                    ok(oNotifications[1].id === "SecondNotification", "Second notification is correct");
                    ok(oNotifications[2].id === "ThirdNotification", "Third notification is correct");
                    ok(oNotifications[3].id === "FourthNotification", "Fourth notification is correct");
                });
            };

        window["sap-ushell-config"] = oEnableServiceConfig;

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oService.registerNotificationsUpdateCallback(oCallbackForNotifications);

        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
	    oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);

        oService.init();

        OData.read.restore();
        oIsPackagedAppModeStub.restore();
    });

    /**
     * Intent based consumption full flow - verify URL correctness
     */
    test("Intent based consumption full flow - verify URL correctness", function () {
        var oService,
            oIsPackagedAppModeStub,
            oOrigODataRead = OData.read;
        
        OData.read = sinon.spy()

        window["sap-ushell-config"] = oEnableServiceConfig;
        oEnableServiceConfig.services.Notifications.config.intentBasedConsumption = true;
        oEnableServiceConfig.services.Notifications.config.consumedIntents = [{intent: "a-b"},{intent: "a-c"},{intent: "d-a"}];

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);

        oService.init();

        ok(OData.read.calledTwice == true, "Two calles to OData.read");
        ok(OData.read.args[0][0].requestUri === "NOTIFICATIONS_SRV/GetBadgeCountByIntent(a-b,a-c,d-a)", "The 1st call to OData.read for badgenumber inclued the intents");
        ok(OData.read.args[1][0].requestUri === "NOTIFICATIONS_SRV/Notifications?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20false&intents%20eq%20&NavigationIntent%2520eq%2520%2527a-b%2527NavigationIntent%2520eq%2520%2527a-c%2527NavigationIntent%2520eq%2520%2527d-a%2527", "The 2nd call to OData.read for badgenumber inclued the intents");

        OData.read = oOrigODataRead;
        window["sap-ushell-config"].services.Notifications.config.intentBasedConsumption = undefined;
        window["sap-ushell-config"].services.Notifications.config.consumedIntents = undefined;
        oIsPackagedAppModeStub.restore();
    });

    /**
     * getUnseenNotificationsCount full flow:
     * Starts from service initialization, until invoking consumer that gets correct unseenNotificationsCount data
     */
    test("API: getUnseenNotificationsCount full flow", function () {
        var oService,
            oIsEnabledStub,
            oIsPackagedAppModeStub,
            oIsFioriClientModeStub,
            oFioriClientRemainingDelayStub,
            oEstablishWebSocketStub,
            oUnseenCount = {
                "data" :
                    {
                        "GetBadgeNumber" :
                            {
                                "Number" : 2
                            }
                    }
            },
            oCallbackForUnseenNotificationCount = function () {
                var oNotificationsCountPromise = oService.getUnseenNotificationsCount();
                oNotificationsCountPromise.done(function (iCount) {
                   // start();
                    ok(parseInt(iCount, 10) === 2, "Function getCount returns the expected number of unseen notifications");
                });
            };

        window["sap-ushell-config"] = {
            "services": {
                "Notifications" : {
                    config: {
                        enabled: false,
                        serviceUrl: "NOTIFICATIONS_SRV"
                    }
                }
            }
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oIsEnabledStub = sinon.stub(oService, "isEnabled").returns(true);

        // Stub objects for reaching the rqeuires mode:

        // Indicating that it is not packagedAdd mode
        oIsPackagedAppModeStub = sinon.stub(oService, "_isPackagedMode").returns(false);
        // Indicating that it is FioriClient mode
        oIsFioriClientModeStub = sinon.stub(oService, "_isFioriClientMode").returns(false);
        // In order to avoid waiting with setTimout to the end of the required FioriClient delay
        oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
        // For avoinding WebSocket initialization
	    oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection", function () {
        	oService._activatePolling();
	    });

        oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);

        oService.registerNotificationCountUpdateCallback(oCallbackForUnseenNotificationCount);

        sinon.stub(oService, "_activatePolling", function () {
            oService._readAllNotificationsData(true);
        });

        oService.init();

        oIsEnabledStub.restore();
        oIsPackagedAppModeStub.restore();
        oIsFioriClientModeStub.restore();
        oFioriClientRemainingDelayStub.restore();
        oEstablishWebSocketStub.restore();
        OData.read.restore();
    });

    /**
     * Verify that data update occures atfer each data change
     */
    test("Data update occurs after each data change", function () {
        var oService,
            oFioriClientRemainingDelayStub,
            oEstablishWebSocketStub,
            oGetModeStub;

        window["sap-ushell-config"] = oEnableServiceConfig;

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

	    oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
	    oEstablishWebSocketStub = sinon.stub(oService, "_establishWebSocketConnection").returns(false);
	    oGetModeStub = sinon.stub(oService, "_getMode").returns(oModesEnum.POLLING);

        window.OData.request = sinon.spy();

        oService._readAllNotificationsData = sinon.spy();

        oService.notificationsSeen();
        ok(oService._readAllNotificationsData.callCount === 0, "oService._readAllNotificationsData should not called");
        ok(OData.request.args[0][0].requestUri === sServicePath + "/ResetBadgeNumber", "ResetBadgeNumber should trigger ResetBadgeNumber api");

        oService.executeAction("notificationId", "actionId");
        ok(oService._readAllNotificationsData.callCount === 0, "oService._readAllNotificationsData should not called");

        oFioriClientRemainingDelayStub.restore();
        oEstablishWebSocketStub.restore();
        oGetModeStub.restore();
        window.OData.request = {};
    });

    /**
     * Push notification in Fiori client use-case.
     * Verify that calling _handlePushedNotification triggers an OData.read request.
     */
    test("Push notification scenario in Fiori Client mode", function () {
        var oService,
            oNotifications = {
                "d": {
                    "__count": "0",
                    "results": []
                }
            },
            oUnseenCount = {
                "data" :
                    {
                        "GetBadgeNumber" :
                            {
                                "Number" : 2
                            }
                    }
            };

        window["sap-ushell-config"] = oEnableServiceConfig;

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oBasicNotificationsResult, oUnseenCount);
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");
        oService._getHeaderXcsrfToken = sinon.stub().returns(true);
        oService._getDataServiceVersion = sinon.stub().returns(true);
        oService._readAllNotificationsData = sinon.spy();
        oService._handlePushedNotification ({additionalData : {}});
        ok(oService._readAllNotificationsData.calledOnce === true, "Function _readAllNotificationsData was called by _handlePushedNotification");
        OData.read.restore();
    });

  //   + fiori clent in backgroud => like foreground but perform navigation accordign to the intent

    /**
     *
     */
    test("Fiori client: sequential read actions when not in FioriClient Mode", function () {
        var oService,
            oFioriClientRemainingDelayStub,
            oGetModeStub,
            aNotifications,
            oNotifications = {
                "d": {
                    "__count": "0",
                    "results": []
                }
            },
            oUnseenCount = {
                "data" :
                    {
                        "GetBadgeNumber" :
                            {
                                "Number" : 2
                            }
                    }
            };

        window["sap-ushell-config"] = oEnableServiceConfig;

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oNotifications.d, oUnseenCount);
        });

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService.registerNotificationsUpdateCallback(function () {
            oService = sap.ushell.Container.getService("Notifications");
    	    oFioriClientRemainingDelayStub = sinon.stub(oService, "_getFioriClientRemainingDelay").returns(-1000);
    	    oGetModeStub = sinon.stub(oService, "_getMode").returns(oModesEnum.POLLING);
    	    oService._getHeaderXcsrfToken = sinon.stub().returns(true);
            oService._getDataServiceVersion = sinon.stub().returns(true);
            aNotifications = oService.getNotifications();
        });

        oService._isFioriClientMode = sinon.stub().returns(false);

        // As a result of the following call, the following happens:
        //  1. A call to _readAllNotificationsData
        //  2. A call to _updateConsumers (in the success handler of the OData.read)
        //  3. The registered callback is called
        //  4. The callback calls getNotifications
        //  5. getNotifications calls _readAllNotificationsData, which calls OData.read =>
        //  This test verifies that the 3rd call to OData.read WILL NOT be issued
        oService._handlePushedNotification ({additionalData : {}});
        ok(OData.read.calledTwice, "third call to OData.read was prevented");
        oFioriClientRemainingDelayStub.restore();
        oGetModeStub.restore();
        OData.read.restore();
    });

    test("Verify mark as read", function () {
        var oService;
        // sinon.stub(OData, "request", function (request, success, fail) {});

        window.OData.request = sinon.spy();
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService.markRead("notificationId");

        ok(OData.request.args[0][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[0][0].data.NotificationId === "notificationId", "NotificationId should be 'notificationId'");
        ok(OData.request.args[0][0].requestUri.endsWith("/MarkRead") === true, "markRead: OData.request was called with function /MarkRead");
      
        window.OData.request = {};
    });

    test("Verify dismiss Notification", function () {
        var oService;
        // sinon.stub(OData, "request", function (request, success, fail) {});

        window.OData.request = sinon.spy();
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService.dismissNotification("notificationId");

        ok(OData.request.args[0][0].method === "POST", "OData.request was called with method POST");
        ok(OData.request.args[0][0].data.NotificationId === "notificationId", "NotificationId should be 'notificationId'");
        ok(OData.request.args[0][0].requestUri.endsWith("/Dismiss") === true, "Dismiss: OData.request was called with function /Dismiss");

        window.OData.request = {};
    });

    test("Check High Prio Messages", function () {
        var oService;
        // sinon.stub(OData, "request", function (request, success, fail) {});

        window.OData.request = sinon.spy();
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService.lastNotificationDate = 1;
        var fnValidateHighPrioMessages = function (sChannelId, sEventId, aNewNotifications) {
            ok(aNewNotifications.length == 2, "Recived two High Priority notification");
        }
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

        oService._notificationAlert([
            {
                CreatedAt: 2,
                Priority: 'HIGH',
                Text: 'HEAD1',
                IsRead: false

            },
            {
                CreatedAt: 3,
                Priority: 'HIGH',
                Text: 'HEAD2',
                IsRead: false

            },
            {
                CreatedAt: 4,
                Priority: 'LOW',
                Text: 'HEAD2',
                IsRead: false

            }

        ]);

        sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

        window.OData.request = {};
    });

    test("Validate No High Prio Messages, When no messages with High priority", function () {
        var oService;
        // sinon.stub(OData, "request", function (request, success, fail) {});

        window.OData.request = sinon.spy();
        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("Notifications");

        oService.lastNotificationDate = 1;
        var fnValidateHighPrioMessages = function (sChannelId, sEventId, aNewNotifications) {
            ok(false, "Should not Recived High Priority notification");
        }
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);

        oService._notificationAlert([
            {
                CreatedAt: 2,
                Priority: 'LOW',
                Text: 'HEAD1',
                IsRead: false

            },
            {
                CreatedAt: 3,
                Priority: 'LOW',
                Text: 'HEAD2',
                IsRead: false

            },
            {
                CreatedAt: 4,
                Priority: 'LOW',
                Text: 'HEAD2',
                IsRead: false

            }

        ]);

        sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.services.Notifications", "onNewNotifications", fnValidateHighPrioMessages, this);
        ok(true, "Done validating High Prio Messages");

        window.OData.request = {};
    });
}());