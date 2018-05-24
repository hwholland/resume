//Required init with {getGroups: functions}
/*global jQuery, sap, window */
(function () {
    "use strict";

    jQuery.sap.declare("sap.ushell.Layout");

    var CollisionModule = function(settings) {
        this.init(settings);
    };
    CollisionModule.prototype = {
        settings: null, tileWidth: 0, tileHeight: 0, tileMargin: 0, curTouchMatrixCords: null, tilesInRow: null, groupsList: null,
        item: null, matrix: null, tiles: null, collisionLeft: false, startGroup: null, currentGroup: null, endGroup: null,
        init: function (settings) {
            this.curTouchMatrixCords = {column: null, row: null};
            this.endGroup = null;
            this.item = null;
            this.matrix = null;
            this.tiles = null;
            this.collisionLeft = false;
            this.startGroup = null;
            this.currentGroup = null;
            this.groupsList = null;
            this.settings = this.settings || settings;
            jQuery.extend(this, this.settings);
            this.tileWidth = this.thisLayout.styleInfo.tileWidth;
            this.tileHeight = this.thisLayout.styleInfo.tileHeight;
            this.tileMargin = this.thisLayout.styleInfo.tileMarginWidth;
            this.aExcludedControlClass = this.aExcludedControlClass || [];
            this.reorderElementsCallback = this.reorderElementsCallback || function () {};
            this.rightToLeft = sap.ui.getCore().getConfiguration().getRTL();
        },

        moveDraggable: function (moveX, moveY) {
            var isCollision = this.detectCollision(moveX, moveY);
            if (isCollision) {
                this.changePlaceholder();
            }
        },

        changePlaceholder: function () {
            var currentGroup = this.currentGroup;
            // Check if tile moved to different group
            var tileChangedGroup = (this.endGroup !== this.currentGroup);
            // If tile moved to different group
            if (tileChangedGroup) {
                var currentHostTiles = this.thisLayout.getGroupTiles(this.currentGroup);
                if (this.currentGroup === this.startGroup) {
                    currentHostTiles = currentHostTiles.slice(0);
                    currentHostTiles.splice(currentHostTiles.indexOf(this.item),1);
                }

                this.tiles = this.thisLayout.getGroupTiles(this.endGroup).slice(0);
                if (this.startGroup === this.endGroup) {
                    this.tiles.splice(this.tiles.indexOf(this.item),1);
                }
                this.matrix = this.thisLayout.organizeGroup(this.tiles);
                this.endGroup.getInnerContainerDomRef().appendChild(this.item.getDomRef());
                this.currentGroup = this.endGroup;
            }

            //remove excluded controls which define in this.aExcludedControlClass from the matrix in order to exclude
            // those controls from reordering
            this.removeExcludedElementsFromMatrix(this.aExcludedControlClass);
            var tiles = this.tiles || this.thisLayout.getGroupTiles(this.endGroup).slice(0);
            var newTilesOrder;

            if (this.matrix[this.curTouchMatrixCords.row] && typeof this.matrix[this.curTouchMatrixCords.row][this.curTouchMatrixCords.column] == "object" ) {
                var replacedTile = this.matrix[this.curTouchMatrixCords.row][this.curTouchMatrixCords.column];
                var replacedTileIndex = tiles.indexOf(replacedTile);
                var currentTileIndex = tiles.indexOf(this.item);

                if (this.rightToLeft){this.collisionLeft = !this.collisionLeft; }
                //tiles are in the same group and the target tile is located after the tile you drag
                if (currentTileIndex > -1 && currentTileIndex < replacedTileIndex) {
                    replacedTile = tiles[replacedTileIndex + 1];
                }
                if (replacedTile === this.item) {
                    if (tileChangedGroup) {
                        this.reorderElementsCallback({currentGroup: currentGroup, endGroup: this.endGroup, tiles: this.tiles, item: this.item});
                        this.reorderTilesView(tiles, this.endGroup);

                        this.reorderTilesInDom();
                    }
                    return;
                }
                newTilesOrder = this.changeTilesOrder(this.item, replacedTile, tiles, this.matrix);
                if (newTilesOrder) {
                    this.reorderElementsCallback({currentGroup: currentGroup, endGroup: this.endGroup, tiles: this.tiles, item: this.item});
                    this.reorderTilesView(newTilesOrder, this.endGroup);

                    this.reorderTilesInDom();
                }
                return;
            }

            var maxTile = this.findTileToPlaceAfter(this.matrix, tiles);
            if (tiles[maxTile + 1] == this.item) {
                return;
            }

            if (tiles[maxTile + 1]) {
                replacedTile = tiles[maxTile + 1];
            } else if (this.currentGroup.getShowPlaceholder()) {
                replacedTile = tiles[0];
            }
            newTilesOrder = this.changeTilesOrder(this.item, replacedTile, tiles, this.matrix);
            if (newTilesOrder) {
                this.reorderElementsCallback({currentGroup: currentGroup, endGroup: this.endGroup, tiles: this.tiles, item: this.item});
                this.reorderTilesView(newTilesOrder, this.endGroup);

                this.reorderTilesInDom();
            }
        },

        reorderTilesInDom: function () {
            var jsSelectedTile = this.item.getDomRef(),
                iSelectedTileIndex = jQuery(jsSelectedTile).index(),
                jqSelectedTileGroup = jQuery(jsSelectedTile).closest(".sapUshellTilesContainer-sortable"),
                destTileIndex = this.calcDestIndexInGroup(),
                jqTargetGroup = jQuery(this.endGroup.getDomRef()).find(".sapUshellTilesContainer-sortable"),
                jqGroupTiles = jqTargetGroup.find(".sapUshellTile");

            // remove the dragged tile
            jqSelectedTileGroup.find(jqGroupTiles[iSelectedTileIndex]).remove();

            jqGroupTiles = jqTargetGroup.find(".sapUshellTile");
            // add the dragged tile to the correct position
            jqTargetGroup[0].insertBefore(jsSelectedTile, jqGroupTiles[destTileIndex]);
        },

        calcDestIndexInGroup: function () {
            var lastTileId,
                tilesCount = 0,
                i,
                j,
                bItemFound = false;

            for (i = 0; i < this.matrix.length && !bItemFound; i++ ) {
                for (j = 0; j < this.matrix[i].length; j++) {
                    if (this.matrix[i][j] != undefined) {
                        if (this.item.sId !== this.matrix[i][j].sId) {
                            if (lastTileId !== this.matrix[i][j].sId) {
                                lastTileId = this.matrix[i][j].sId;
                                tilesCount++;
                            }
                        } else {
                            bItemFound = true;
                            break;
                        }
                    }
                }
            }

            return tilesCount;
        },

        layoutStartCallback: function (element) {
            this.init();
            this.item = sap.ui.getCore().byId(element.id);
            this.tilesInRow = this.thisLayout.getTilesInRow();
            this.groupsList = this.thisLayout.getGroups();
            this.startGroup = this.currentGroup = this.item.getParent();

        },

        layoutEndCallback: function () {
            if (!this.tiles) {
                return {tile: this.item};
            }
            var response = {srcGroup: this.startGroup, dstGroup: this.endGroup, tile: this.item, dstTileIndex: this.tiles.indexOf(this.item), tileMovedFlag: true};
            return response;
        },

        compareArrays: function (a1, a2) {
            if ( a1.length !== a2.length) {
                return false;
            }
            for (var i = 0; i < a1.length; i++) {
                if (a1[i] !== a2[i]) {
                    return false;
                }
            }
            return true;
        },

        reorderTilesView: function (tiles, group) {
            this.tiles = tiles;
            this.matrix = this.thisLayout.organizeGroup(tiles);
        },

        /**
         *
         * @param item
         * @param replacedTile
         * @param tiles
         * @returns {*}
         */
        changeTilesOrder: function (item, replacedTile, tiles, matrix) {
            var newTiles = tiles.slice(0);
            var deletedItemIndex = newTiles.indexOf(item);
            if (deletedItemIndex > -1) {
                newTiles.splice(deletedItemIndex,1);
            }
            if (replacedTile) {
                newTiles.splice(newTiles.indexOf(replacedTile), 0, this.item);
            } else {
                newTiles.push(item);
            }
            if (this.currentGroup == this.endGroup) {
                if (this.compareArrays(tiles, newTiles)) {
                    return false;
                }
                var newMatrix = this.thisLayout.organizeGroup(newTiles);
                var cords = this.thisLayout.getTilePositionInMatrix(item, matrix);
                var newCords = this.thisLayout.getTilePositionInMatrix(item, newMatrix);
                if ((cords.row == newCords.row) && (cords.col == newCords.col)) {
                    return false;
                }
            }

            this.tiles = newTiles;
            this.currentGroup = this.endGroup;
            return newTiles;
        },

        setMatrix : function (newMatrix) {
            this.matrix = newMatrix;
        },

        findTileToPlaceAfter: function (curMatrix,tiles){
            var x = (this.thisLayout.rightToLeft) ? 0 : this.curTouchMatrixCords.column,
                iIncrease = (this.thisLayout.rightToLeft) ? 1 : -1,
                maxTile = 0,
                rowLength = curMatrix[0].length;

            for (var i = this.curTouchMatrixCords.row; i >= 0; i--) {
                for (var j = x; j >= 0 && j < rowLength; j += iIncrease) {
                    if (!curMatrix[i] || typeof curMatrix[i][j] != "object") {
                        continue;
                    }
                    var tileIndex = tiles.indexOf(curMatrix[i][j]);
                    maxTile = tileIndex > maxTile ? tileIndex : maxTile;
                }
                x = curMatrix[0].length - 1;
            }

            return maxTile;
        },
        //function return detected collision
        /*
         *
         * @param moveX
         * @param moveY
         * @returns
         */
        detectCollision: function (moveX, moveY) {
            var rect, isHorizontalIntersection, isVerticalIntersection, collidedGroup = false;
            //var style;
            for (var i = 0; i < this.groupsList.length; i++) {
                var innerContainerElement = this.groupsList[i].getInnerContainerDomRef();
                rect = innerContainerElement.getBoundingClientRect();
                //style = window.getComputedStyle(innerContainerElement);
                isHorizontalIntersection = !(rect.right < moveX || rect.left > moveX);
                isVerticalIntersection = !(rect.bottom < moveY || rect.top > moveY);
                if (isHorizontalIntersection && isVerticalIntersection) {
                    collidedGroup =  this.groupsList[i];
                    break;
                }
            }

            var curTouchMatrixCords = jQuery.extend({}, this.curTouchMatrixCords );
            if (!collidedGroup || collidedGroup.getIsGroupLocked()) {
                return false;
            }
            if (collidedGroup) {
                this.matrix = this.matrix || this.thisLayout.organizeGroup(this.thisLayout.getGroupTiles(collidedGroup));
                var offset = this.rightToLeft ? (rect.right + (-1) * moveX) : (rect.left * (-1) + moveX),
                    matrixTouchY = (rect.top * (-1) + moveY) / (this.tileHeight + this.tileMargin),
                    matrixTouchX = offset / (this.tileWidth + this.tileMargin);
                curTouchMatrixCords = { row: Math.floor(matrixTouchY),
                    column: Math.floor(matrixTouchX)};
            }
            // if place of the tile is the same place as it was
            // nothing need to be done
            if ((collidedGroup === this.endGroup) &&
                (curTouchMatrixCords.column === this.curTouchMatrixCords.column) &&
                (curTouchMatrixCords.row === this.curTouchMatrixCords.row)) {
                return false;
            }

            if (sap.ui.getCore().getConfiguration().getRTL()) {
                this.collisionLeft = (this.curTouchMatrixCords.column - curTouchMatrixCords.column) > 0;

            } else {
                this.collisionLeft = (curTouchMatrixCords.column - this.curTouchMatrixCords.column) > 0;
            }
            if (curTouchMatrixCords.column === this.curTouchMatrixCords.column) {
                this.collisionLeft = false;
            }

            jQuery.extend(this.curTouchMatrixCords, curTouchMatrixCords);
            this.endGroup = collidedGroup;
            return true;
        },

        /*
         * Warning!
         */

        removeExcludedElementsFromMatrix: function (aExcludedControlClass) {
            if (!aExcludedControlClass.length) {
                return;
            }
            var newMatrix = this.matrix.map(function (row) {
                return row.map(function (item) {
                    var isRemoveRequired = aExcludedControlClass.some(function (controlClass) {
                        return item instanceof controlClass;
                    });
                    return (isRemoveRequired) ? undefined : item;
                });
            });

            this.setMatrix(newMatrix);
        },

        setExcludedControl : function (controlClass) {
            if (controlClass) {
                this.aExcludedControlClass.push(controlClass);
            }
        },

        /*
        Callback to be executed before change views after collision detection
         */
        setReorderTilesCallback : function (func) {
            if (typeof func === "function") {
                this.reorderElementsCallback = func;
            }
        }
    };


    var LayoutConstructor = function (){};
    LayoutConstructor.prototype = {
        _initDeferred: jQuery.Deferred(),
        init: function (cfg) {
            //in some devices this code runs before css filed were loaded and we don't get the correct styleInfo object
            var timeoutLayoutInfo = function () {
                var styleInfo = this.getStyleInfo(this.container);
                if (styleInfo.tileWidth > 0) {
                    this.isInited = true;
                    this.reRenderGroupsLayout();
                    this.layoutEngine = new CollisionModule({thisLayout: this});
                    this._initDeferred.resolve();
                    return;
                }
                setTimeout(timeoutLayoutInfo, 100);
            }.bind(this);


            this.cfg = cfg || this.cfg;
            this.minTilesinRow = 2;
            this.maxTilesInRow = 30;
            this.container = this.cfg.container || document.getElementById('dashboardGroups');
            timeoutLayoutInfo();

            return this.getInitPromise();
        },
        getInitPromise: function () {
            return this._initDeferred.promise();
        },
        getLayoutEngine: function () {
            return this.layoutEngine;
        },
        getStyleInfo: function (container) {
            var tile = document.createElement('div'),
                containerId = container.getAttribute('id');
            container = containerId ? document.getElementById(containerId) : container;
            tile.className = "sapUshellTile";
            tile.setAttribute('style', 'position: absolute; visibility: hidden;');
            container.appendChild(tile);
            var tileStyle = window.getComputedStyle(tile);
            var info = {"tileMarginHeight" : parseInt(tileStyle.marginBottom, 10) + parseInt(tileStyle.marginTop, 10),
                "tileMarginWidth" : parseInt(tileStyle.marginLeft, 10) + parseInt(tileStyle.marginRight, 10),
                "tileWidth": tile.offsetWidth,
                "tileHeight": tile.offsetHeight,
                "containerWidth": container.offsetWidth - (container.style.marginLeft ? parseInt(container.style.marginLeft, 10) : 0)
            };
            tile.parentNode.removeChild(tile);

            return info;
        },
        getGroups: function () {
            return this.cfg.getGroups();
        },
        getTilesInRow: function (bIslink) {
            return this.tilesInRow;
        },
        setTilesInRow: function (tilesInRow) {
            this.tilesInRow = tilesInRow;
        },
        checkPlaceForTile: function (tile, matrix, place, lastRow, bIsLinkTiles) {
            if (typeof matrix[place.y] === "undefined") {
                matrix.push(new Array(matrix[0].length));
            }
            if (typeof matrix[place.y + 1] === "undefined") {
                matrix.push(new Array(matrix[0].length));
            }
            if (typeof matrix[place.y][place.x] !== "undefined") {
                return false;
            }
            var p = jQuery.extend({}, place);
            if (bIsLinkTiles || !tile.getLong()) {
                return [p];
            }
            var cords = [p];
            if (tile.getLong()) {
                if ((place.x + 1) >= matrix[0].length || (typeof matrix[p.y][p.x + 1] !== "undefined") ) {
                    return false;
                }
                cords.push({y: p.y, x: p.x + 1});
            }
            return cords;
        },

        /**
         *
         * @param tile
         * @param matrix
         * @param cords
         */
        placeTile: function (tile, matrix, cords) {
            for (var i = 0; i < cords.length; i++) {
                matrix[cords[i].y][cords[i].x] = tile;
            }
        },

        getTilePositionInMatrix: function (tile, matrix) {
            for (var row = 0; row < matrix.length; row++) {
                for ( var col = 0; col < matrix[0].length; col++) {
                    if (matrix[row][col] == tile) {
                        return {row: row, col: col};
                    }
                }
            }
            return false;
        },
        /**
         *
         * @param matrix
         * @param tiles
         * @param startRow
         * @param endRow
         * @returns {number}
         */
        fillRowsInLine: function (matrix, tiles, startRow, endRow, bIsLinkTiles) {
            if (!tiles.length) {
                return 0;
            }

            var placedTiles = [], cords, i;
            var toRow = endRow || startRow;
            for ( i = startRow; i <= toRow && tiles.length; i++) {
                for (var j = 0; j < matrix[0].length && tiles.length; j++) {
                    cords = this.checkPlaceForTile(tiles[0], matrix, {x: j, y: i}, endRow, bIsLinkTiles);
                    if (cords) {
                        this.placeTile(tiles[0], matrix, cords);
                        placedTiles.push(tiles.shift());
                    }
                }
            }
            var maxHeight = 1, height = 1;
            for (i = 0; i < placedTiles.length; i++) {
                maxHeight = height > maxHeight ?  height : maxHeight;
            }

            return maxHeight;
        },

        /**
         *
         * @param tiles
         * @param containerInfo
         * @returns {Array}
         */
        organizeGroup: function (tiles, bIsLinkTiles) {
            //copy of tilesCopy array
            var tilesCopy = tiles.slice(0);
            var tilesMatrix = [];
            var currentRow = 0;
            tilesMatrix.push(new Array(bIsLinkTiles ? Math.floor(this.tilesInRow / 2) : this.tilesInRow));

            while (tilesCopy.length) {
                //lineHeight will be changed if tile that higher that 1 will appear in the row
                var lineHeight = this.fillRowsInLine(tilesMatrix, tilesCopy, currentRow, undefined, bIsLinkTiles); //to do: get the declaration outside
                currentRow++;
                if (lineHeight <= 1) {
                    continue;
                }
                //If line is higher than 1
                this.fillRowsInLine(tilesMatrix, tilesCopy, currentRow, currentRow + lineHeight - 2);
                currentRow += (lineHeight - 1) || 1;
            }
            if (this.rightToLeft){
                for (var i = 0; i < tilesMatrix.length; i++){
                    tilesMatrix[i].reverse();
                }
            }
            tilesMatrix = this.cleanRows(tilesMatrix);
            return tilesMatrix;
        },

        cleanRows:function(tilesMatrix){

            var doneChecking = false;

            for (var row = tilesMatrix.length - 1; row > 0 && !doneChecking; row--){
                for (var col = 0; col < tilesMatrix[row].length && !doneChecking; col++ ){
                    if (typeof tilesMatrix[row][col] === "object"){
                        doneChecking = true;
                    }
                }
                if (!doneChecking){
                    tilesMatrix.pop();
                }
            }
            return tilesMatrix;
        },

        setGroupsLayout : function (group, matrix) {
            var i;
            if (this.cfg.isLockedGroupsCompactLayoutEnabled && group.getIsGroupLocked() && matrix.length > 0){
                var parentContainer = group.getDomRef().parentElement;
                if (this.cfg.isLockedGroupsCompactLayoutEnabled()){
                    var tileCount = matrix[0].length;
                    if (this.rightToLeft) {
                        for (i = matrix[0].length - 1; i >= 0; i--){
                            if (!matrix[0][i]){
                                tileCount = (matrix[0].length - 1) - i;
                                break;
                            }
                        }
                    } else {
                        for (i = 0; i < matrix[0].length; i++){
                            if (!matrix[0][i]){
                                tileCount = i;
                                break;
                            }
                        }
                    }
                    //tile container size = tiles count * (tile width + tile margin right) + first tile margin left
                    var containerWidth = tileCount > 0 ? tileCount * (this.styleInfo.tileWidth + this.styleInfo.tileMarginWidth) + this.styleInfo.tileMarginWidth : 0;
                    group.getDomRef().style.width = "auto";
                    parentContainer.style.width = containerWidth + "px";
                    parentContainer.style.display = "inline-block";
                } else {
                    group.getDomRef().style.width = "";
                    parentContainer.style.width = "";
                    parentContainer.style.display = "";
                }
            }
        },

        /**
         *
         * @param containerWidth
         * @param tileWidth
         * @param tileMargin
         * @returns {number}
         */

        calcTilesInRow: function (containerWidth, tileWidth, tileMargin) {
            var tilesInRow = Math.floor(containerWidth / (tileWidth + tileMargin));

            //Max/Min number of tile in row that was predefined by UI
            if (tilesInRow <= this.maxTilesInRow){
                tilesInRow = (tilesInRow < this.minTilesinRow ? this.minTilesinRow : tilesInRow );
            } else {
                tilesInRow = this.maxTilesInRow;
            }

            return tilesInRow;
        },

        getGroupTiles : function (oGroup) {
            var aTiles = oGroup.getTiles();
            //insert plus tile only in non empty groups
            if (oGroup.getShowPlaceholder()) {
                aTiles.push(oGroup.oPlusTile);
            }
            return aTiles;
        },

        //groups are optional, onlyIfViewPortChanged are optional
        reRenderGroupsLayout: function (groups) {
            if (!this.isInited) {
                return;
            }
            var styleInfo = this.getStyleInfo(this.container);
            if (!styleInfo.tileWidth) {
                return;
            }

            this.styleInfo = styleInfo;
            this.tilesInRow =  this.calcTilesInRow(styleInfo.containerWidth, styleInfo.tileWidth, styleInfo.tileMarginWidth);
            groups = groups || this.getGroups();

            for (var i = 0; i < groups.length; i++) {
                var tiles = this.getGroupTiles(groups[i]);
                var groupLayoutMatrix = this.organizeGroup(tiles);
                this.setGroupsLayout(groups[i], groupLayoutMatrix);
            }
        }
    };

    sap.ushell.Layout = new LayoutConstructor();
})();
