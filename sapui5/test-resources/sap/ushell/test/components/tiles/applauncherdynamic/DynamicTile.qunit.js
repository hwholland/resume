(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.components.tiles.applauncherdynamic.DynamicTile", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });

    test("createDynamicTileView Test", function () {
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        ok(true);
    });

    test("handleInlineCountRequest Test", function () {
        //create oDynamicTileView that has a config.
        // service_url
        // nservice_refresh_interval = 0;
        var elemOData = sinon.stub(OData, "read").returns({
            xxxx : {
            }
        });

        OData.read = function (request, success, fail) {
            var oResult = {
                "__count": '444'
            };
            success(oResult);
        }
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        oController.navigationTargetUrl = "test1";
        oController.getView = sinon.stub().returns({
                getModel : sinon.stub().returns({
                    getProperty: function () {
                        return {
                            service_url: "test://url",
                            navigation_target_url: "#a-b?x=y"
                        }
                    },
                    setProperty : sinon.spy()
                }),
                getViewData: function () {
                    return {
                        chip : {
                            visible: {
                                isVisible: function () {
                                    return true;
                                }
                            }
                        }
                    };
                }
            });


        oController.loadData(0);
        ok(oController.getView().getModel().setProperty.callCount === 2 ,'model set properties called 2 time');

        elemOData.restore();
    });

    test("No URL Test", function () {
        //create oDynamicTileView that has a config.
        // service_url
        // nservice_refresh_interval = 0;
        var elemOData = sinon.stub(OData, "read").returns({
            xxxx : {
            }
        });

        OData.read = function (request, success, fail) {
            var oResult = {
                "__count": 444
            };
            success(oResult);
        }
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        oController.navigationTargetUrl = "test1";
        oController.getView = sinon.stub().returns({
            getModel : sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_url: ""
                    }
                },
                setProperty : sinon.spy()
            }),
            getViewData: function () {
                return {
                    chip : {
                        visible: {
                            isVisible: function () {
                                return true;
                            }
                        }
                    }
                };
            }
        });


        oController.loadData(0);
        ok(oController.getView().getModel().setProperty.callCount === 0 ,'validate that set property not called');

        elemOData.restore();
    });

    test("visible handler test", function () {
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        oController.navigationTargetUrl = "test1";
        oController.getView = sinon.stub().returns({
            getModel : sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_refresh_interval: '40'
                    };
                },
                setProperty : sinon.spy()
            }),
            getViewData: sinon.stub().returns({
                chip: {
                    configurationUi: {
                        isEnabled: function () {
                            return false;
                        }
                    }
                }
            })
        });

        var fnStopRequestsSpy = sinon.spy(oController, 'stopRequests'),
            fnRefreshHandlerStub = sinon.stub(oController, 'refreshHandler'),
            fnODataRead = sinon.spy(oController, 'loadData');

        oController.visibleHandler(false);
        // making sure stop request had been cancelled
        ok(fnStopRequestsSpy.called,"When the tile is invisible, 'stopRequests' should be called");
        ok(!oController.bIsRequestCompleted, "When stopRequests invoked, request must not be marked as completed");

        oController.visibleHandler(true);
        ok(fnRefreshHandlerStub.called,"When the tile is invisible, 'stopRequests' should be called");
        ok(fnStopRequestsSpy.calledOnce,"When the tile is invisible, 'stopRequests' should be called");

        // restore only the refresh handler so we could now inspect the actual loadData method which invokes the OData.read
        fnRefreshHandlerStub.restore();

        oController.visibleHandler(false);
        ok(fnStopRequestsSpy.called,"When the tile is invisible, 'stopRequests' should be called");

        oController.visibleHandler(true);
        ok(fnODataRead.calledOnce,"When the tile is invisible, 'stopRequests' should be called");

        fnStopRequestsSpy.restore();
        fnODataRead.restore();
    });

    test("refresh handler test - new request should be sent after tile refresh", function () {
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        oController.getView = sinon.stub().returns({
            getViewData : sinon.stub().returns({
                chip : {
                    configurationUi : {
                        isEnabled : function () {
                            return false;
                        }
                    }
                }
            })
        });

        var fnLoadDataSpy = sinon.stub(oController, 'loadData').returns({});

        oController.refreshHandler(oController);
        ok(fnLoadDataSpy.called,"function loadData should be called");

        fnLoadDataSpy.restore();
    });

    test ("test onUpdateDynamicData with different intervals values", function () {
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
        var fnLoadDataStub = sinon.stub(oController, 'loadData').returns({});

        oController.getView = sinon.stub().returns({
            getModel : sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_refresh_interval : 0,
                        service_url : true
                    };
                }
            })
        });


        oController.onUpdateDynamicData(oController);
        ok(fnLoadDataStub.called,"function loadData should be called");
        ok(fnLoadDataStub.args[0][0] === 0,"interval 0 should be sent");

        oController.getView = sinon.stub().returns({
            getModel : sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_refresh_interval : 5,
                        service_url : true
                    };
                }
            })
        });

        oController.onUpdateDynamicData(oController);
        ok(fnLoadDataStub.called,"function loadData should be called");
        ok(fnLoadDataStub.args[1][0] === 10,"minimum positive interval is 10");

        oController.getView = sinon.stub().returns({
            getModel : sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_refresh_interval : 50,
                        service_url : true
                    };
                }
            })
        });

        oController.onUpdateDynamicData(oController);
        ok(fnLoadDataStub.called,"function loadData should be called");
        ok(fnLoadDataStub.args[2][0] === 50,"the interval is 50");

        fnLoadDataStub.restore();
    });

    test("errorHandlerFn logs message with correct log level", function() {
        // Setup
        var oController = new sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile");

        var oControllerGetViewStub = sinon.stub(oController, "getView", function() {
            return {
                getModel: function () {
                    return {
                        getProperty: function() {
                            return {
                                service_url: "test://url"
                            };
                        },

                        setProperty: function () {}
                    };
                }
            };
        });

        var sapLogInfoSpy = sinon.spy(jQuery.sap.log, "info"),
            sapLogErrorSpy = sinon.spy(jQuery.sap.log, "error");

        // Test case - message equals "Request Aborted".
        var oMessage = { message: "Request aborted" };
        oController.errorHandlerFn(oMessage);
        ok(sapLogInfoSpy.called, "OData load cancellation logged with level `info`");

        // Test case - message NOT equals "Request Aborted".
        var oMessage = { message: "something else" };
        oController.errorHandlerFn(oMessage);
        ok(sapLogErrorSpy.called, "OData load cancellation logged with level `error`");

        // teardown
        oControllerGetViewStub.restore();
        sapLogErrorSpy.restore();
        sapLogInfoSpy.restore();
    });

    test ("test addition of 'color' class to according to Dynamic tile 'state_info'", function () {
        sap.ushell.Container = {
            addRemoteSystemForServiceUrl: sinon.stub()
        };

        var oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, 'byId').returns({
                getCurrentPage: function () {
                    return {
                        getViewName: function () {
                            return "sap.ushell.components.tiles.applauncherdynamic.DynamicTile";
                        }
                    };
                }
            }),
            oView = sap.ui.view({
                viewName: 'sap.ushell.components.tiles.applauncherdynamic.DynamicTile',
                type: sap.ui.core.mvc.ViewType.JS,
                viewData: {
                    chip: {
                        configurationUi: {
                            isEnabled: function () {
                                return false;
                            }
                        },
                        configuration: {
                            getParameterValueAsString: function () {
                                return '';
                            }
                        },
                        bag: {
                            getBag: function () {
                                return {
                                    getPropertyNames: function () {
                                        return [];
                                    },
                                    getTextNames: function () {
                                        return [];
                                    }
                                }
                            }
                        },
                        url: {
                            getApplicationSystem: function () {
                                return '';
                            }
                        },
                        preview: {
                            isEnabled: function () {
                                return false;
                            },
                            getTitle: function () {
                                return '';
                            },
                            setTargetUrl: function () {},
                            setPreviewIcon: function () {},
                            setPreviewTitle: function () {},
                            setPreviewSubtitle: function () {}
                        }
                    }
                },
                height: '100%'
            }),
            oModel = oView.getModel(),
            retrievedClass = '',
            testFooterInfo = {
                classList: {
                    add: function (sRetrievedClass) {
                        retrievedClass = sRetrievedClass
                    }.bind(this)
                }
            },
            oDomRefStub = sinon.stub(oView,'getDomRef').returns({
                getElementsByClassName: function () {
                    return [testFooterInfo];
                }
            });
        //Test scenario without info state.
        oModel.setProperty('/data/display_info_state', '');
        oView.onAfterRendering();
        ok(retrievedClass === '', "No color class is aded when 'indo_state' is empty");
        //Test scenario when 'info_state'is 'Negative'.
        oModel.setProperty('/data/display_info_state', 'Negative');
        oView.onAfterRendering();
        ok(retrievedClass === 'sapUshellTileFooterInfoNegative', "the class 'sapUshellTileFooterInfoNegative' is aded when 'info_state' is Negative");
        //Test scenario when 'info_state'is 'Neutral'.
        oModel.setProperty('/data/display_info_state', 'Neutral');
        oView.onAfterRendering();
        ok(retrievedClass === 'sapUshellTileFooterInfoNeutral', "the class 'sapUshellTileFooterInfoNegative' is aded when 'info_state' is Neutral");
        //Test scenario when 'info_state'is 'Positive'.
        oModel.setProperty('/data/display_info_state', 'Positive');
        oView.onAfterRendering();
        ok(retrievedClass === 'sapUshellTileFooterInfoPositive', "the class 'sapUshellTileFooterInfoPositive' is aded when 'info_state' is Positive");
        //Test scenario when 'info_state'is 'Critical'.
        oModel.setProperty('/data/display_info_state', 'Critical');
        oView.onAfterRendering();
        ok(retrievedClass === 'sapUshellTileFooterInfoCritical', "the class 'sapUshellTileFooterInfoCritical' is aded when 'info_state' is Critical");

        //Clean after test.
        delete sap.ushell.Container;
        oDomRefStub.restore();
        oGetCoreByIdStub.restore();
    });
}());
