// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.appfinder.EasyAccess
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");


    var oController;

    module("sap.ushell.components.flp.launchpad.appfinder.EasyAccess", {
        beforeEach: function () {
            sap.ushell.bootstrap("local");
            oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.EasyAccess");
            var oModel = new sap.ui.model.json.JSONModel();
            var oView = {
                getModel: function () {
                    return oModel
                },
                getViewData: function () {
                    return {menuName: "testName"}
                }
            };
            oController.getView = function () {
                return oView;
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });


    test("getMenuItems with configuration sapMenuServiceUrl=/someUrl, should call callODataService with /someUrl parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getView().getModel().setProperty("/sapMenuServiceUrl", "/someUrl");
        oController.getMenuItems("SAP_MENU", "UV2", "", 0);
        var url = "/someUrl;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        oController._callODataService.restore();

    });

    test("getMenuItems with configuration userMenuServiceUrl=/someUrl, should call callODataService with /someUrl parameter", function () {
        oController.getView().getModel().setProperty("/userMenuServiceUrl", "/someUrl");
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("USER_MENU", "UV2", "", 0);
        var url = "/someUrl;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        oController._callODataService.restore();
    });

    test("getMenuItems with no configuration userMenuServiceUrl, should call callODataService with /sap/opu/odata/UI2/ parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("USER_MENU", "UV2", "", 0);
        var url = "/sap/opu/odata/UI2/USER_MENU;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        oController._callODataService.restore();
    });

    test("getMenuItems with no configuration sapMenuServiceUrl, should call callODataService with /sap/opu/odata/UI2/ parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("SAP_MENU", "UV2", "", 0);
        var url = "/sap/opu/odata/UI2/EASY_ACCESS_MENU;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        oController._callODataService.restore();
    });

    test("getMenuItems with invalid menu_type parameter should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("INVALID_MENU_TYPE", "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with menu_type parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems(null, "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with menu_type parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems(undefined, "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with systemId parameter = \"\" should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with systemId parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", null, "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with systemId parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", undefined, "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with entityId parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", undefined, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityId parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", null, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityId parameter not string should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", 1, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityLevel parameter not an int should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", "1", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with entityLevel parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", null, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with entityLevel parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", undefined, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with numberOfNextLevels parameter not an int should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", 1, "1");
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid numberOfNextLevels parameter");
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"\",0,2) should resolve an object with 2 levels from the root node", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [],
                    apps: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id21",
                    "level": "02",
                    "text": "text21",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "", 0, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"\",0) should resolve an object with 3 levels(default) from the root node", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id23",
                    "level": "02",
                    "text": "text23",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id12",
                    "text": "text12",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id1"
                },
                {
                    "Id": "id21",
                    "text": "text21",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id2"
                },
                {
                    "Id": "id22",
                    "text": "text22",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id2"
                },
                {
                    "Id": "id111",
                    "text": "text111",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id11"
                },
                {
                    "Id": "id121",
                    "text": "text121",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id12"
                },
                {
                    "Id": "id122",
                    "text": "text122",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id12"
                },
                {
                    "Id": "id223",
                    "level": "03",
                    "text": "text223",
                    "parentId": "id22",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id221",
                    "text": "text221",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id22"
                },
                {
                    "Id": "id222",
                    "text": "text222",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id22"
                }
            ]
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"id1\",1,2) should resolve an object with 2 levels from the root node", function () {

        var expectedData = {
            id: "id1",
            folders: [
                {
                    id: "id11",
                    text: "text11",
                    level: 2,
                    folders: [
                        {
                            id: "id111",
                            text: "text111",
                            level: 3,
                            folders: undefined,
                            apps: undefined
                        },
                        {
                            id: "id112",
                            text: "text112",
                            level: 3,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: [
                        {
                            id: "id113",
                            text: "text113",
                            level: 3,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }
            ],
            apps: [
                {
                    id: "id12",
                    text: "text12",
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                },
                {
                    id: "id13",
                    text: "text13",
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var oResult = {
            "results": [
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id12",
                    "level": "02",
                    "text": "text12",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id13",
                    "level": "02",
                    "text": "text13",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id111",
                    "level": "03",
                    "text": "text111",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id112",
                    "level": "03",
                    "text": "text112",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id113",
                    "level": "03",
                    "text": "text113",
                    "parentId": "id11",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "id1", 1, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"id1\",1) should resolve an object with 3 levels(default) from the root node", function () {

        var expectedData = {
            id: "id1",
            folders: [
                {
                    id: "id11",
                    text: "text11",
                    level: 2,
                    folders: [
                        {
                            id: "id111",
                            text: "text111",
                            level: 3,
                            folders: [
                                {
                                    id: "id1111",
                                    text: "text1111",
                                    level: 4,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        },
                        {
                            id: "id112",
                            text: "text112",
                            level: 3,
                            folders: [],
                            apps: [
                                {
                                    id: "id1121",
                                    text: "text1121",
                                    level: 4,
                                    url: "#someIntent?sap-system=LOCAL"
                                }
                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id113",
                            text: "text113",
                            level: 3,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }
            ],
            apps: [
                {
                    id: "id12",
                    text: "text12",
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                },
                {
                    id: "id13",
                    text: "text13",
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var oResult = {
            "results": [
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id12",
                    "level": "02",
                    "text": "text12",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id13",
                    "level": "02",
                    "text": "text13",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id111",
                    "level": "03",
                    "text": "text111",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id112",
                    "level": "03",
                    "text": "text112",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id113",
                    "level": "03",
                    "text": "text113",
                    "parentId": "id11",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id1121",
                    "level": "04",
                    "text": "text1121",
                    "parentId": "id112",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id1111",
                    "level": "04",
                    "text": "text1111",
                    "parentId": "id111",
                    "type": "FL",
                    "url": ""
                }
            ]
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "id1", 1);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"\",3,2) should resolve an object with 2 levels from the root node(the entityLevel is irrelevant)", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [],
                    apps: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id21",
                    "level": "02",
                    "text": "text21",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 3, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"\",0) without results should return the root element", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [],
            apps: []
        };

        var oResult = {
            "results": []
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"someId\",3) without results should return the root element", function () {

        var expectedData = {
            id: "someId",
            folders: [],
            apps: []
        };

        var oResult = {
            "results": []
        };

        sinon.stub(OData, "read", function (request, success, fail) {
            success(oResult, {"statusCode": 200});
        });

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "someId", 3);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems() with a failure in the odata call, should fail the promise", function () {

        sinon.stub(OData, "read", function (request, success, fail) {
            fail("Did not manage to read odata");
        });

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "someId", 3);
        oGetMenuItemsPromise.fail(function (message) {
            assert.deepEqual(message, "Did not manage to read odata");
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("checkIfSystemSelectedAndLoadData with no systemSelected should not call loadMenuItemsFirstTime function", function () {
        var testData = {};

        var oView = {
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });
        var spyLoadMenuItemsFirstTime = sinon.spy(oController, "loadMenuItemsFirstTime");
        oController.onInit();
        oController.checkIfSystemSelectedAndLoadData();
        assert.equal(spyLoadMenuItemsFirstTime.callCount, 0);
        oController.loadMenuItemsFirstTime.restore();
    });

    test("checkIfSystemSelectedAndLoadData with systemSelected should call loadMenuItemsFirstTime function and navigateHierarchy", function () {
        var testData = {systemSelected: {systemName: "system1", systemId: "systemId1"}};

        var oView = {
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });
        sinon.stub(oController, "loadMenuItemsFirstTime", function (arg1, arg2) {
            assert.equal(arg1, "testName");
            assert.equal(arg2.systemName, "system1");
            assert.equal(arg2.systemId, "systemId1");
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve();
            return oDeferred.promise();
        });
        sinon.stub(oController, "navigateHierarchy", function (arg1, arg2) {
            assert.equal(arg1, "");
            assert.equal(arg2, false);
        });

        oController.onInit();
        oController.checkIfSystemSelectedAndLoadData();
        oController.getView.restore();
        oController.loadMenuItemsFirstTime.restore();
        oController.navigateHierarchy.restore();
    }),

    test("navigateHierarchy with no path and data in model should call updatePageBindings with / path", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [],
                    apps: []
                }
            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);

        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "");
                        }
                    }
                }
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "");
            assert.equal(arg2, true);
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.onInit();
        oController.navigateHierarchy("", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(false));

        oController.getView.restore();
    });

    test("navigateHierarchy with path and data in model should call updatePageBindings with the path", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);


        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "/folders/1/folders/1");
                        }
                    }
                }
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "/folders/1/folders/1");
            assert.equal(arg2, true);
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.onInit();
        oController.navigateHierarchy("/folders/1/folders/1", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(false));

        oController.getView.restore();
    });

    test("navigateHierarchy with path and no data in model should call getMenuItems", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);


        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "/folders/0/folders/0/folders/0");
                        }
                    }
                }
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "/folders/0/folders/0/folders/0");
            assert.equal(arg2, true);
        });

        sinon.stub(oController, "getMenuItems", function () {

            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                folders: [{property1: "val1"}, {property2: "val2"}],
                apps: [{property3: "val3"}, {property4: "val4"}]
            });
            return oDeferred.promise();
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.onInit();
        oController.navigateHierarchy("/folders/0/folders/0/folders/0", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(true));
        assert.ok(spyMasterMenuSetBusy.calledWith(false));
        assert.deepEqual(testEasyAccessModel.getProperty("/folders/0/folders/0/folders/0/folders"), [{property1: "val1"}, {property2: "val2"}]);
        assert.deepEqual(testEasyAccessModel.getProperty("/folders/0/folders/0/folders/0/apps"), [{property3: "val3"}, {property4: "val4"}]);

        oController.getView.restore();
        oController.getMenuItems.restore();
    });

    test("getErrorMessage for User Menu and error string", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage("some error message");
        assert.equal(result, "Cannot get user menu data: some error message");
    });

    test("getErrorMessage for User Menu and error with message", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage({message: "some error message"});
        assert.equal(result, "Cannot get user menu data: some error message");
    });

    test("getErrorMessage for User Menu and no error message", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage();
        assert.equal(result, "Cannot get user menu data");
    });

    test("getErrorMessage for SAP Menu and error string", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage("some error message");
        assert.equal(result, "Cannot get SAP menu data: some error message");
    });

    test("getErrorMessage for User Menu and error with message", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage({message: "some error message"});
        assert.equal(result, "Cannot get SAP menu data: some error message");
    });

    test("getErrorMessage for User Menu and and no error message", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage();
        assert.equal(result, "Cannot get SAP menu data");
    });

    test("handleGetMenuItemsError for User Menu and and no error message", function () {
        jQuery.sap.require('sap.m.MessageBox');
        var oView = {
            easyAccessModel: new sap.ui.model.json.JSONModel(),
            hierarchyFolders: {
                setBusy: function () {}
            }
        };

        oController.oView = oView;

        sinon.stub(oController, "getErrorMessage", function (error) {
            return error;
        });
        var errorSpy = sinon.stub(sap.m.MessageBox, "error", function () {});

        var setDataSpy = sinon.spy(oView.easyAccessModel, "setData");
        var setBusySpy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.handleGetMenuItemsError("some error message");

        assert.ok(errorSpy.calledWith("some error message"));
        assert.ok(setDataSpy.calledWith(""));
        assert.ok(setBusySpy.calledWith(false));

        sap.m.MessageBox.error.restore();
        oView.easyAccessModel.setData.restore();
        oView.hierarchyFolders.setBusy.restore();

    });
    
    test("Test _appendSystemToUrl", function () {
        
        // initialize mock data
        var sSystemId = "U1YCLNT120";
        var aData = [
            {
                url: "#Shell-startTransaction?sap-ui2-tcode=PFCG",
                expected: "#Shell-startTransaction?sap-ui2-tcode=PFCG&sap-system=" + sSystemId,
                info: "url has one parameter already"
            },
            {
                url: "#Shell-startTransaction",
                expected: "#Shell-startTransaction?sap-system=" + sSystemId,
                info: "url has no parameters"
            },
            {
                url: "#Shell-startTransaction?sap-ui2-tcode=PFCG&anotherParam=someValue",
                expected: "#Shell-startTransaction?sap-ui2-tcode=PFCG&anotherParam=someValue&sap-system=" + sSystemId,
                info: "url has 2 parameters already"
            },
            {
                url: "#Shell-startTransaction?",
                expected: "#Shell-startTransaction?&sap-system=" + sSystemId,
                info: "url ends with '?'"
            },
            {
                url: undefined,
                expected: undefined,
                info: "url is undefined"
            }
        ];

        for (var i = 0; i < aData.length; i++) {
            // call the function under test
            var result = oController._appendSystemToUrl(aData[i], sSystemId);

            // assert
            assert.equal(result, aData[i].expected, aData[i].info);
        }

    });


}());