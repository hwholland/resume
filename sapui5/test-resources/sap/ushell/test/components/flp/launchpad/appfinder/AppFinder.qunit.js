// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.appfinder.AppFinder
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.components.flp.launchpad.DashboardManager");

    var oController;

    module("sap.ushell.components.flp.launchpad.appfinder.AppFinder", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.AppFinder");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    test("getSystems positive senario(with systems), should resolve with a list of systems", function () {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            WDA: true
                        }
                    }
                };
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }


                return oDeferred.promise();
            }
        );

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.done(function(aReturnSystems){
            assert.deepEqual(aReturnSystems,[{"systemName": "CRM Europe", "systemId": "AB1CLNT000"},{"systemName": "HR Central", "systemId":"XY1CLNT100"}]);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems without system(empty object), should resolve with an empty list of systems", function () {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {};
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }

                return oDeferred.promise();
            }
        );


        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.done(function(aReturnSystems){
            assert.deepEqual(aReturnSystems,[]);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems with an error, should fail", function () {

        var sExpectedError = "An error occurred while retrieving the systems:";

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = undefined;
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }
                return oDeferred.promise();
            }
        );

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.fail(function(error) {
            assert.equal(error.substring(0,sExpectedError.length), sExpectedError);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems without clientService should reject", function () {

        var sExpectedError = "cannot get ClientSideTargetResolution service";

        var getServiceStub = sinon.stub(sap.ushell.Container, "getService", function () {
            return undefined;
        });

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.fail(function(error) {
            assert.equal(error, sExpectedError);
        });
        getServiceStub.restore();
    });

    test("enableEasyAccess: false - oView.oPage.getContent() contains catalogView", function () {
        var oDashboardManager = new sap.ushell.components.flp.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel()});
        var fGetRendereStub = sinon.stub(sap.ushell.Container, "getRenderer", function (name) {
            return {createExtendedShellState : function () {}};
        });
        var fLoadPersonalizedGroupsStub = sinon.stub(oDashboardManager, "loadPersonalizedGroups");
        fLoadPersonalizedGroupsStub.returns(function () {});
        jQuery.sap.require("sap.m.Page");
        var oModel = new sap.ui.model.json.JSONModel({});

        var oView = {
            getModel: function () {
                return oModel;
            },
            oPage: new sap.m.Page("appFinderPage", {}),
            enableEasyAccess: false,
            parentComponent: {
                getRouter: function () {
                    return {
                        getRoute: function() {
                            return {
                                attachPatternMatched: function() {
                                    return {};
                                }
                            };
                        }
                    };
                },
                getModel: function() { return new sap.ui.model.json.JSONModel(); }
            }
        };

        var getViewStub = sinon.stub(oController, "getView", function () {
            return oView;
        });

        oController.onInit();
        ok(fLoadPersonalizedGroupsStub.calledOnce, "Validate loadgroups from area called once");
        ok(oController.getCurrentMenuName() === "catalog", "appFinder controller function getCurrentMenuName returns catalog");

        ok(oView.oPage.getContent());

        getViewStub.restore();
        fLoadPersonalizedGroupsStub.restore();
        fGetRendereStub.restore();
        oView.oPage.destroy();
    });

    test("enableEasyAccess: true - oView.oPage.getContent() is empty", function () {
        var oDashboardManager = new sap.ushell.components.flp.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel()});
        var fLoadPersonalizedGroupsSpy = sinon.spy(oDashboardManager, "loadPersonalizedGroups");
        jQuery.sap.require("sap.m.Page");
        var fGetRendereStub = sinon.stub(sap.ushell.Container, "getRenderer", function (name) {
            return {createExtendedShellState : function () {}};
        });

        var oModel = new sap.ui.model.json.JSONModel({groups: [{id: "dummygroup"}]});
        var oView = {
            getModel: function () {
                return oModel;
            },
            oPage: new sap.m.Page("appFinderPage", {
                showHeader: true,
                showSubHeader: true,
                showFooter: false,
                showNavButton: false,
                enableScrolling: false,
                title: "appFinderTitle"
            }),
            enableEasyAccess: true,
            parentComponent: {
                getRouter: function () {
                    return {
                        getRoute: function() {
                            return {
                                attachPatternMatched: function() {
                                    return {};
                                }
                            };
                        }
                    };
                },
                getModel: function() { return new sap.ui.model.json.JSONModel(); }
            }
        };

        var getViewStub = sinon.stub(oController, "getView", function () {
            return oView;
        });

        oController.onInit();

        ok(oView.oPage.getContent().length == 0);
        equals(fLoadPersonalizedGroupsSpy.callCount, 0, "Validate loadgroups are not called in case they are already loaded");

        getViewStub.restore();
        fGetRendereStub.restore();
        oView.oPage.destroy();
    });

    test("getSystemsModel with systems, should return a model with 'systemsList' property that contains array of systems", function () {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            WDA: true
                        }
                    }
                };
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }
                return oDeferred.promise();
            }
        );

        var oGetSystemsModelPromise = oController.getSystemsModel();
        oGetSystemsModelPromise.done(function(easyAccessSystemsModel){
            var aSystemsList = easyAccessSystemsModel.getProperty("/systemsList");
            ok(aSystemsList, "property 'systemsList' exist");
            assert.deepEqual(aSystemsList,[{"systemName": "CRM Europe", "systemId": "AB1CLNT000"},{"systemName": "HR Central", "systemId":"XY1CLNT100"}]);
            getEasyAccessSystemsStub.restore();
        });

    });

    test("_navigateTo with group context should call navTo with filters", function () {
        jQuery.sap.require("sap.ui.core.routing.Router");
        var oView = {
            getModel: function () {
                return new sap.ui.model.json.JSONModel({
                    groupContext: {path:"/somePath"}
                });}
            };

        var oRouter = new sap.ui.core.routing.Router;

        var navToSpy = sinon.stub(oRouter, "navTo", function (arg1, arg2, arg3) {
           return;
        });

        oController._navigateTo.apply({oView: oView, oRouter: oRouter},["appfinder","catalog"]);
        assert.ok(navToSpy.calledWith("appfinder", {menu: "catalog", filters: "{\"targetGroup\":\"%2FsomePath\"}"}, true));

        oRouter.navTo.restore();
    });

    test("_navigateTo without group context should call navTo without filters", function () {
        jQuery.sap.require("sap.ui.core.routing.Router");
        var oView = {
            getModel: function () {
                return new sap.ui.model.json.JSONModel({});}
        };

        var oRouter = new sap.ui.core.routing.Router;

        var navToSpy = sinon.stub(oRouter, "navTo", function (arg1, arg2, arg3) {
            return;
        });

        oController._navigateTo.apply({oView: oView, oRouter: oRouter},["appfinder","catalog"]);
        assert.ok(navToSpy.calledWith("appfinder", {menu: "catalog"}, true));

        oRouter.navTo.restore();
    });

    test("onSegmentButtonClick with catalog should call _navigateTo with catalog", function () {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "catalog"}
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("appFinder","catalog"));
        oController._navigateTo.restore();
    });

    test("onSegmentButtonClick with userMenu should call _navigateTo with userMenu", function () {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "userMenu"}
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("appFinder","userMenu"));
        oController._navigateTo.restore();
    });

    test("onSegmentButtonClick with sapMenu should call _navigateTo with sapMenu", function () {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "sapMenu"}
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("appFinder","sapMenu"));
        oController._navigateTo.restore();
    });

    test("_updateModelWithGroupContext", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            groups: [{title: "group1 title"}],
            groupContext: {}
        });

        var oView = {
            getModel: function () {
                return oModel;
            }
        };


        var getServiceStub = sinon.stub(sap.ushell.Container,"getService",function() {
            return {
                getGroupId : function () {
                    return "group1";
                }
            }
        });

        oController._updateModelWithGroupContext.apply({oView: oView},["/groups/0"]);
        assert.deepEqual(oModel.getProperty('/groupContext'),{path:"/groups/0", id: "group1",title: "group1 title"});
        getServiceStub.restore();
    });

}());