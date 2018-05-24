(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.Layout");

    function Tile(size, text) {
        this.size = size;
        this._long = this.size=="2x1";
        this.domRef = $('<div></div>').get(0);
        this.oData = {};
        this.metadata = {
            getName: function () {
            }
        }
    }
    Tile.prototype = {
        getSize: function () {
            return size;
        },
        getLong: function () {
            return this._long;
        },
        getDomRef: function () {
            return this.domRef;
        },
        data: function(prop, val){
            this.oData[prop] = val;
        },
        getParent: function () {
        },
        getMetadata: function () {
            return this.metadata;
        }
    }

    function Group(tiles) {
        this._innerContainer = $('<div></div>').get(0);
        this.tiles = tiles;
        this.oData = {};
    }
    Group.prototype =  {
        getInnerContainerDomRef: function () {
            return this._innerContainer;
        },
        getTiles: function () {
            return this.tiles;
        },
        data: function(prop, val){
            this.oData[prop] = val;
        },
        getShowPlaceholder: function () {
            return false;
        }
    }

    module("sap.ushell.components.tiles.layout.Layout", {
        setup: function () {
            var container = $('<div id="layoutWrapper" style="position: absolute;"></div>').width(1800).appendTo('body');
            sap.ushell.Layout.init({getGroups: function(){return[]}, container: container.get(0) });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            $('#layoutWrapper').remove();
            delete sap.ushell.Layout.cfg;
            delete sap.ushell.Layout.container;
            sap.ushell.Layout.isInited = false;
        }
    });

    test("styleInfo Test", function () {
        //sap.ushell.Layout.init({getGroups: function(){}, container: document.body});
        var styleInfo = sap.ushell.Layout.getStyleInfo(document.body);
        ok(typeof styleInfo == "object");
        ok(typeof styleInfo.tileMarginWidth == "number");
        ok(typeof styleInfo.tileMarginHeight == "number");
        ok(typeof styleInfo.tileWidth == "number" && styleInfo.tileWidth>0);
        ok(typeof styleInfo.tileHeight == "number" && styleInfo.tileHeight>0);
        ok(typeof styleInfo.containerWidth == "number" && styleInfo.containerWidth>0);
    });

    test("organizeGroup Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var styleInfo = sap.ushell.Layout.getStyleInfo(document.body);
        sap.ushell.Layout.tilesInRow = 5;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2]);
        ok(matrix[0][0]==tile1);
        ok(matrix[0][1]==tile2);
        ok(matrix[0][2]==tile2);
    });

    test("calcTilesInRow Test", function () {
        var tilesInRow = sap.ushell.Layout.calcTilesInRow(500, 130, 5);
        ok(tilesInRow == 3);
        tilesInRow = sap.ushell.Layout.calcTilesInRow(100, 130, 5);
        ok(tilesInRow==2);
        tilesInRow = sap.ushell.Layout.calcTilesInRow(5000, 130, 5);
        ok(tilesInRow==30);
    });

    test("Layout calculation Test", function () {
        var oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.dashboard.DashboardContent");

        oController.getView = sinon.stub().returns({
            getParent : sinon.stub().returns({
                getCurrentPage: sinon.stub().returns({
                    getViewName: sinon.stub().returns(function () {
                        return "name";
                    })
                })
            }),
            getViewName : sinon.stub().returns(function () {
                return "otherName";
            }),
            getModel : sinon.stub().returns({
                getProperty : sinon.stub().returns('home')
            })
        });

        try {
            oController._resizeHandler();
        } catch (e){
            ok(false,"Layout calculation wad done not in home page");
        }

        ok(true,"Layout calculation Test");
        oController.destroy();
    });

    test("reRenderGroupsLayout Test", function () {
        var group1 = new Group([new Tile('2x2'), new Tile('1x1')]);
        var group2 = new Group([new Tile('2x2'), new Tile('1x1')]);
        sap.ushell.Layout.reRenderGroupsLayout([group1,group2], true);
        ok(typeof group1.oData.containerHeight === "undefined");
        ok(typeof group2.oData.containerHeight === "undefined");
        sap.ushell.Layout.reRenderGroupsLayout([group1,group2]);

        var style = sap.ushell.Layout.getStyleInfo(sap.ushell.Layout.container);
        ok(sap.ushell.Layout.styleInfo.containerWidth === style.containerWidth);
        var tilesInRow =  sap.ushell.Layout.calcTilesInRow(style.containerWidth, style.tileWidth, style.tileMarginWidth);
        ok(sap.ushell.Layout.tilesInRow === tilesInRow);
    });

    test("getTilePositionInMatrix Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var tile3 = new Tile('2x1');
        var tile4 = new Tile('2x1');
        var tile5 = new Tile('2x1');
        var tile6 = new Tile('1x1');
        sap.ushell.Layout.tilesInRow = 2;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5, tile6]);
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile1,matrix);
        deepEqual(place, {row:0,col:0});
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile2,matrix);
        deepEqual(place, {row:1,col:0});
        var place = sap.ushell.Layout.getTilePositionInMatrix(tile5,matrix);
        deepEqual(place, {row:4,col:0});
    });

    test("findTileToPlaceAfter Test", function () {
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('2x1');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('2x1');
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        sap.ushell.Layout.layoutEngine.init();
        sap.ushell.Layout.layoutEngine.curTouchMatrixCords.column = 2;
        sap.ushell.Layout.layoutEngine.curTouchMatrixCords.row = 1;
        var maxTileIndex = sap.ushell.Layout.layoutEngine.findTileToPlaceAfter(matrix, [tile1, tile2, tile3, tile4]);
        equal(maxTileIndex, 3);
    });


    test("changePlaceholder Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('1x1');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('1x1');
        var tile5 = new Tile('2x1');
        var group = new Group([tile1, tile2, tile3, tile4]);
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4]);
        le.init();
        le.curTouchMatrixCords.column = 2;
        le.curTouchMatrixCords.row = 1;
        le.startGroup = le.currentGroup = le.endGroup = group;
        le.matrix = matrix;
        le.item = tile5;
        le.reorderTilesInDom = sinon.stub().returns();
        le.changePlaceholder();
        ok(le.matrix[1][1] == tile5);
        le.item = tile4;
        le.curTouchMatrixCords.column = 3;
        le.curTouchMatrixCords.row = 3;
        ok(le.matrix[0][3] == tile4);
    });

    test("changeTilesOrder Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        var tile1 = new Tile('1x1');
        var tile2 = new Tile('1x2');
        var tile3 = new Tile('1x1');
        var tile4 = new Tile('2x2');
        var tile5 = new Tile('1x1');
        var group = new Group(tile3);
        sap.ushell.Layout.tilesInRow = 4;
        var matrix = sap.ushell.Layout.organizeGroup([tile1, tile2, tile3, tile4, tile5]);
        le.init();
        le.item = tile5;
        var tilesArray = le.changeTilesOrder(tile5, tile3, [tile1, tile2, tile3, tile4, tile5], matrix);
        ok(tilesArray[2] == tile5);
    });

    test("compareArrays Test", function () {
        var le = sap.ushell.Layout.layoutEngine;
        equal(le.compareArrays([0,1,2,3,4], [0,1,2,3,4,5]), false);
        equal(le.compareArrays([0,1,2,3,4], [0,2,2,3,4]), false);
        equal(le.compareArrays([0,1,2,3,4], [0,1,2,3,4]), true);
    });

}());
