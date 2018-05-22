// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

/* eslint-disable no-cond-assign */

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.components.flp.ComponentKeysHandler");

    var componentKeysHandler = function () {
        this.aTileWrapperClasses = ['.sapUshellTile', '.sapUshellLinkTile'];
    };

    componentKeysHandler.prototype = {
        keyCodes: jQuery.sap.KeyCodes,

        handleCatalogKey: function () {
            this.oRouter.navTo("appFinder", {'menu': 'catalog'});
        },

        handleHomepageKey: function () {
            this.oRouter.navTo("home");
        },

        getNumberOfTileInRow: function (pageName, bIsLink) {
            var jqTile = jQuery(bIsLink ? ".sapUshellLinkTile:first" : ".sapUshellTile:first");
            if (!jqTile.length) {
                return false;
            }
            var contentWidth;
            if (pageName === "catalog") {
                contentWidth = jQuery("#catalogTiles .sapUshellTileContainerContent").width();
            } else {
                contentWidth = jQuery("#dashboardGroups").width();
            }
            var numberTilesInRow = Math.floor(contentWidth / jqTile.outerWidth(true));
            return numberTilesInRow;
        },

        goToTileContainer: function (keyup, bGoToFirstTileInSelectedGroup) {
            var bIsActionsModeActive = this.oModel.getProperty('/tileActionModeActive');

            if (bIsActionsModeActive) {
                sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();
            } else {
                sap.ushell.components.flp.ComponentKeysHandler.goToEdgeTile('first', bGoToFirstTileInSelectedGroup);
            }
            return true;
        },

        goToEdgeTile: function (selector, bGoToFirstOrLastTileInSelectedGroup) {
            var jqTileContainers = jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible'),
                topGroupInViewPortIndex = this.oModel.getProperty("/topGroupInViewPortIndex"),
                tileContainer = jqTileContainers.get(topGroupInViewPortIndex),
                tileToSelect = jQuery(tileContainer).find('.sapUshellTile:visible')[selector](),
                lastVisitedTile = jQuery("div.sapUshellTile:visible[tabindex='0']"),
                lastVisitedLink = jQuery("div.sapUshellLinkTile:visible[tabindex='0']");

            if (!tileToSelect.length && !lastVisitedTile.length && !lastVisitedLink.length) {
                return false;
            }

            if (lastVisitedTile.length && !bGoToFirstOrLastTileInSelectedGroup) {
                this.setTileFocus(lastVisitedTile);
                return true;
            }

            if (lastVisitedLink.length && !bGoToFirstOrLastTileInSelectedGroup) {
                this.setTileFocus(lastVisitedLink);
                return true;
            }

            this.setTileFocus(tileToSelect);
            return true;
        },

        goToFirstVisibleTileContainer: function () {
            var jqTileContainers = jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible'),
                topGroupInViewPortIndex = this.oModel.getProperty("/topGroupInViewPortIndex"),
                jqTileContainerToSelect = jQuery(jqTileContainers.get(topGroupInViewPortIndex));

            if (!jqTileContainerToSelect[0]) {
                return false;
            }
            this.setTileContainerSelectiveFocus(jqTileContainerToSelect);
            return true;
        },

        goToFirstTileOfSiblingGroup: function (selector, e) {
            e.preventDefault();
            var currentGroup = jQuery(document.activeElement).closest(".sapUshellDashboardGroupsContainerItem");
            if (!currentGroup.length) {
                return;
            }
            var nextGroup = currentGroup[selector + "All"](".sapUshellDashboardGroupsContainerItem:has(.sapUshellTile:visible):not(.sapUshellCloneArea)");
            var tileSelector = 'first';
            if (!nextGroup.length) {
                nextGroup = currentGroup;
                tileSelector = ( selector === "next" ) ? 'last' : 'first';
            } else {
                nextGroup = nextGroup.first();
            }
            var jqTileToSelect = nextGroup.find(".sapUshellTile:visible")[tileSelector]();
            this.moveScrollDashboard(jqTileToSelect);

            return false;
        },

        goToFirstTileOfSiblingGroupInCatalog: function (selector, e) {
            e.preventDefault();
            var jqTileContainer = this.getFocusOnTile(jQuery(document.activeElement));
            if (!jqTileContainer) {
                return;
            }

            var jqTileToFocus;

            if (selector == "next") {
                var isLastGroup = jqTileContainer.nextAll("h3").length ? false : true;
                if (!isLastGroup) {
                    jqTileToFocus = jqTileContainer.nextAll("h3").first().nextAll().filter(":visible").first();
                } else {
                    jqTileToFocus = jqTileContainer.nextAll(".sapUshellTile").last();
                }
            } else {
                var isFirstGroup = jqTileContainer.prevAll("h3").length === 1 ? true : false;
                if (!isFirstGroup) {
                    jqTileToFocus = jQuery(jqTileContainer.prevAll("h3")[1]).next();
                } else {
                    jqTileToFocus = jqTileContainer.prevAll("h3").last().next();
                }
            }

            this.setTileFocus(jqTileToFocus);
            this.moveScrollCatalog(jqTileToFocus);

            return false;
        },

        moveTileInGroup: function (group, firstTile, secondTile) {
            if (this.oModel.getProperty("/personalization")) {
                var groupModelObj = group.getBindingContext().getObject();
                var firstTileIndex = groupModelObj.tiles.indexOf(firstTile.getBindingContext().getObject());
                var secondTileIndex = groupModelObj.tiles.indexOf(secondTile.getBindingContext().getObject());
                var firstTileModelObj = groupModelObj.tiles.splice(firstTileIndex, 1);
                groupModelObj.tiles.splice(secondTileIndex, 0, firstTileModelObj[0]);
                var groupPath = group.getBindingContext().getPath();
                group.getModel().setProperty(groupPath, groupModelObj);
            }
        },

        moveTileToDifferentGroup: function (sourceGroup, destGroup, curTile, direction) {
            if (this.oModel.getProperty("/personalization")) {
                if (sourceGroup.getIsGroupLocked() || destGroup.getIsGroupLocked()) {
                    return;
                }
                var sourceGroupModelObj = sourceGroup.getBindingContext().getObject();
                var destGroupModelObj = destGroup.getBindingContext().getObject();
                var tileIndex = sourceGroupModelObj.tiles.indexOf(curTile.getBindingContext().getObject());
                //removing tile from source group & add tile to destination group
                if (direction === "left" || direction === "up" || direction === "down") {
                    destGroupModelObj.tiles.push(sourceGroupModelObj.tiles[tileIndex]);
                }
                if (direction === "right") {
                    destGroupModelObj.tiles.splice(0, 0, sourceGroupModelObj.tiles[tileIndex]);
                }
                sourceGroupModelObj.tiles.splice(tileIndex, 1);

                //update model
                var groupPath1 = destGroup.getBindingContext().getPath();
                destGroup.getModel().setProperty(groupPath1, destGroupModelObj);

                var groupPath2 = sourceGroup.getBindingContext().getPath();
                sourceGroup.getModel().setProperty(groupPath2, sourceGroupModelObj);

                var groupTiles = destGroup.getTiles();

                if (direction === "left" || direction === "up" || direction === "down") {
                    return groupTiles[groupTiles.length - 1];
                } else {
                    return groupTiles[0];
                }
            }
        },

        moveTile: function (direction) {
            var jqDashboard = jQuery(".sapUshellDashboardView"),
                dashboardView = sap.ui.getCore().byId(jqDashboard.attr("id"));
            dashboardView.getModel().setProperty('/isInDrag', true);
            setTimeout(function () {
                dashboardView.getModel().setProperty('/isInDrag', false);
            }, 300);
            if (this.oModel.getProperty("/personalization")) {
                var info = this.getGroupAndTilesInfo();
                //Tiles of locked groups cannot be reordered
                if (!info || info.group.getProperty('isGroupLocked')) {
                    return;
                }

                var bMoveTile = true,
                    bIsActionsModeActive,
                    nextTile = this.getNextTile(direction, info, bIsActionsModeActive, bMoveTile);

                if (!nextTile) {
                    return;
                } else {
                    var nextTileGroup = nextTile.getParent();
                }

                if (nextTileGroup === info.group) {
                    this.moveTileInGroup(info.group, info.curTile, nextTile);
                } else {
                    nextTile = this.moveTileToDifferentGroup(info.group, nextTileGroup, info.curTile, direction);
                }

                setTimeout(function () {//setTimeout because we have to wait until the asynchronous "moveTile" flow ends
                    if (nextTile) {
                        this.setTileFocus(jQuery(nextTile.getDomRef()));
                    }
                }.bind(this), 100);
            }
        },

        getNextUpDownTileWithLayout: function (direction, info, bMoveTile) {
            var nextTile, nextGroup;
            var nDirection = direction === "down" ? 1 : -1;
            var isEmptyGroup = !info.tiles.length && !info.links.length;
            var bIsGroupLocked = info.group.getIsGroupLocked();
            var bIsPlusTile = jQuery(info.curTile.getDomRef()).hasClass('sapUshellPlusTile');
            var aLinks = info.group.getLinks();
            var layoutMatrix = sap.ushell.Layout.organizeGroup(info.curTile.isLink ? info.links : info.tiles, info.curTile.isLink);
            var tPos = sap.ushell.Layout.getTilePositionInMatrix(info.curTile, layoutMatrix);
            var bIsLastLineFull = this.isLastLineFull(layoutMatrix);
            var bIsActionsModeActive = this.oModel.getProperty('/tileActionModeActive');
            if (!tPos && !isEmptyGroup && !bIsPlusTile) {
                return;
            }
            //Handle the case in which the user has reached the last line of the currently navigated tile aggregation (whether it's a regular tile aggregation or link).
            if (!layoutMatrix[tPos.row + nDirection]) {
                //Handle the case in which the last line within the tileContainer has only Plus Tile
                if (bIsActionsModeActive && !bIsGroupLocked && !bIsPlusTile && bIsLastLineFull && direction === "down") {
                    return info.group.oPlusTile;
                }
                //Handle the case in which the focus is on one of the tiles in the last row and the tile container contains links.
                if (!info.curTile.isLink && aLinks.length && direction === 'down') {
                    // In case actionMode is active
                    if (!bMoveTile) {
                        return aLinks[0];
                    }
                }
                //Handle the case in which the focus is on one of the links in the fist row and the direction is 'up'.
                if (info.curTile.isLink && info.tiles.length && direction === 'up') {
                    return info.tiles[0];
                }
                tPos = isEmptyGroup || bIsPlusTile ? {row: 0, col: 0} : tPos;
                nextGroup = this.getNextGroup(direction, info);
                if (!nextGroup) {
                    return;
                }
                isEmptyGroup = !nextGroup.getTiles().length && !nextGroup.getLinks().length;
                if (!isEmptyGroup) {
                    var aFocussedTileAgg = this._getAggregationToFocusInNextGroup(nextGroup, direction);
                    var bNextTileLink = this._isNextTileLink(aFocussedTileAgg);


                    layoutMatrix = sap.ushell.Layout.organizeGroup(aFocussedTileAgg, bNextTileLink);
                    nDirection = 0;
                    tPos.row = direction === "down" ? 0 : layoutMatrix.length - 1;
                }
            }
            if (isEmptyGroup && bIsGroupLocked) {
                return undefined;
            }
            if (isEmptyGroup) {
                return nextGroup.oPlusTile;
            }

            if (typeof layoutMatrix[tPos.row + nDirection][tPos.col] === "object" && !isEmptyGroup) {
                nextTile = layoutMatrix[tPos.row + nDirection][tPos.col];
            } else {
                nextTile = this.getNextUpDownTile(layoutMatrix, tPos.row + nDirection, tPos.col, direction);
            }

            return nextTile;
        },

        _isNextTileLink: function (aTileAggregation) {
            if (aTileAggregation && aTileAggregation.length) {
                var jqFirstTileInAgg = jQuery(aTileAggregation[0].getDomRef());
                return jqFirstTileInAgg.hasClass("sapUshellLinkTile");
            }
            return false;
        },

        _getAggregationToFocusInNextGroup: function (nextGroup, direction) {
            if (direction === "down" || direction === "right") {
                if (nextGroup.getTiles().length) {
                    return nextGroup.getShowPlaceholder() ? [].concat(nextGroup.getTiles(), nextGroup.oPlusTile) : nextGroup.getTiles();
                }
                if (nextGroup.getLinks().length) {
                    return nextGroup.getLinks();
                }
            } else if (direction === "up" || direction === "left") {
                if (nextGroup.getLinks().length) {
                    return nextGroup.getLinks();
                }
                if (nextGroup.getTiles().length) {
                    return nextGroup.getShowPlaceholder() ? [].concat(nextGroup.getTiles(), nextGroup.oPlusTile) : nextGroup.getTiles();
                }
            }
        },

        isLastLineFull: function (aLayoutMatrix) {
            var iMaxTilesInRow = this.getNumberOfTileInRow(),
                aActualLastRow = aLayoutMatrix[aLayoutMatrix.length - 1].filter(Boolean);

            return aActualLastRow.length === iMaxTilesInRow;
        },

        getNextUpDownTile: function (layoutMatrix, row, column, direction) {
            var newRow = row,
                len = layoutMatrix.length,
                nextTile,
                nDirection = direction === "up" ? -1 : 1;

            while ((newRow >= 0 && newRow < len) && !nextTile) {
                if (typeof layoutMatrix[newRow][column] !== "object") {
                    nextTile = layoutMatrix[newRow][column];
                }
                newRow = newRow + nDirection;
            }
            if (nextTile) {
                return;
            }

            newRow = row;
            while (( typeof layoutMatrix[newRow][column] !== "object") && column >= 0) {
                column--;
            }

            return layoutMatrix[newRow][column];
        },

        getNextTile: function (direction, info, bIsActionsModeActive, bMoveTile) {
            var nextTile,
                currentTileRow,
                nearTilesArr,
                startIndex,
                tileElement,
                leftOffset,
                width,
                leftAndWidth,
                origTileLeftOffset,
                nRTL = sap.ui.getCore().getConfiguration().getRTL() ? -1 : 1,
                isEmptyGroup = !info.tiles.length,
                nDirection = direction === "right" ? 1 : -1;

            if (info.pageName === 'catalog') { // In catalog mode
                if (direction == 'right' || direction == 'left') {
                    nextTile = !isEmptyGroup ? info.tiles[info.curTileIndex + ( nRTL * nDirection )] : undefined;
                    return nextTile;
                }

                if (info.curTileIndex === '0' && direction === 'up') {
                    return undefined;
                }

                currentTileRow = this.whichTileRow(info.curTileIndex, info);
                origTileLeftOffset = parseFloat(info.curTile.getDomRef().offsetLeft);
                if (direction == "down") {
                    nearTilesArr = info.tiles.slice(info.curTileIndex + 1, info.curTileIndex + (info.sizeOfLine * 2));
                } else {
                    startIndex = (startIndex > 0) ? startIndex : 0;
                    nearTilesArr = info.tiles.slice(startIndex, info.curTileIndex).reverse();
                }
                for (var i = 0, length = nearTilesArr.length; i < length; i++) {
                    tileElement = nearTilesArr[i].getDomRef();
                    leftOffset = parseFloat(tileElement.offsetLeft);
                    width = parseFloat(tileElement.offsetWidth);
                    leftAndWidth = leftOffset + width;

                    if (leftOffset <= origTileLeftOffset && leftAndWidth >= origTileLeftOffset) {
                        nextTile = nearTilesArr[i];

                        return nextTile;
                    }
                }

                if (this.nextRowIsShorter(direction, currentTileRow, info)) {
                    nextTile = this.getNextTileInShorterRow(direction, currentTileRow, info);
                    return nextTile;
                }
                // In dashboard mode
            } else {
                if (direction === "left" || direction === "right") {
                    //nDirection is a parameter that influence in which direction we move in array iRTL will change it
                    // to opposite direction if it's RTL
                    var nextTileIndex = info.curTileIndex + ( nRTL * nDirection );
                    var aFocussedTileAgg = info.curTile.isLink ? info.links : info.tiles;
                    // next tile is not the plus tile
                    if (aFocussedTileAgg[nextTileIndex] && !(bMoveTile && aFocussedTileAgg[nextTileIndex].getDomRef().className.indexOf("sapUshellPlusTile") > 0)) {
                        nextTile = aFocussedTileAgg.length ? aFocussedTileAgg[nextTileIndex] : undefined;
                    }

                    if (nextTile) {
                        return nextTile;
                    }
                    if (direction === "right" && !info.curTile.isLink && info.links.length && !bMoveTile) {
                        return info.links[0];
                    }
                    if (direction === "left" && info.curTile.isLink && info.tiles.length) {
                        return info.group.getShowPlaceholder() ? info.group.oPlusTile : info.tiles[info.tiles.length - 1];
                    }

                    // if next tile wasn't exist in the current group need to look on next one
                    var nextGroup = this.getNextGroup(direction, info);
                    if (!nextGroup) {
                        return;
                    } else {
                        var nextGroupTiles = this._getAggregationToFocusInNextGroup(nextGroup, direction);
                        if (nextGroupTiles && nextGroupTiles.length) {
                            var last = nextGroupTiles.length - 1;
                            if (direction === "right") {
                                nextTile = nextGroupTiles[nRTL === 1 ? 0 : last];
                            } else {
                                nextTile = nextGroupTiles[nRTL === 1 ? last : 0];
                            }
                        } else {
                            nextTile = nextGroup.oPlusTile;
                        }
                    }
                }

                if (direction === "down" || direction === "up") {
                    nextTile = this.getNextUpDownTileWithLayout(direction, info, bMoveTile);
                }
            }
            return nextTile;
        },

        getNextTileInShorterRow: function (direction, currentRow, info) {
            var lastTileInRowId = direction === 'down' ? this.getLastTileIdInRow(info, currentRow + 1) : this.getLastTileIdInRow(info, currentRow - 1);
            return info.tiles[lastTileInRowId];
        },

        getLastTileIdInRow: function (info, lineNumber) {
            var count = 0;
            for (var i = 0; i < info.rowsData.length; i++) {
                count += info.rowsData[i];
                if (i === lineNumber) {
                    break;
                }
            }

            return count - 1;
        },

        nextRowIsShorter: function (direction, currentRow, info) {
            if (direction === 'down' && currentRow != info.rowsData.length - 1) {
                return info.rowsData[currentRow] > info.rowsData[currentRow + 1];
            }
            if (direction === 'up' && currentRow != 0) {
                return info.rowsData[currentRow] > info.rowsData[currentRow - 1];
            } else {
                return false;
            }
        },

        getNextGroup: function (direction, info) {
            var nextGroup,
                groups = info.group.getParent().getGroups(),
                isRTL = sap.ui.getCore().getConfiguration().getRTL(),
                curGroupIndex = groups.indexOf(info.group);

            if (direction === "right" || direction === "left") {
                if (isRTL) {
                    direction = (direction === "right") ? "up" : "down";
                } else {
                    direction = (direction === "right") ? "down" : "up";
                }
            }

            if (direction === "down" || direction === "up") {
                var nDirection = direction === "up" ? -1 : 1;
                nextGroup = groups[curGroupIndex + nDirection];
                if (!nextGroup) {
                    return;
                }

                while (!nextGroup.getVisible() && (curGroupIndex >= 0 && curGroupIndex < groups.length)) {
                    curGroupIndex = curGroupIndex + nDirection;
                    nextGroup = groups[curGroupIndex];
                    if (!nextGroup) {
                        return;
                    }
                }
            }
            if (!nextGroup.getVisible()) {
                return;
            }
            return nextGroup;
        },

        getGroupAndTilesInfo: function (jqTile, pageName) {
            if (!jqTile) {
                jqTile = this.getFocusOnTile(jQuery(document.activeElement));
            }
            if (!jqTile.length) {
                return;
            }
            var curTile = sap.ui.getCore().byId(jqTile.attr('id'));
            var group = curTile.getParent();
            var rowsData;
            var tiles;
            var links;
            if (!group.getTiles) {
                group = group.getParent();
            }
            curTile.isLink = jqTile.hasClass('sapUshellLinkTile');
            if (pageName == "catalog") {
                rowsData = this.getCatalogLayoutData();
                tiles = [];
                var jqTiles = jQuery('#catalogTiles').find('.sapUshellTile:visible');
                for (var i = 0; i < jqTiles.length; i++) {
                    tiles.push(sap.ui.getCore().byId(jqTiles[i].id));
                }
            } else {
                if (group.getTiles) {
                    tiles = group.getTiles();
                    links = group.getLinks();
                    if (group.getShowPlaceholder() && !curTile.isLink) {
                        tiles.push(group.oPlusTile);
                    }
                }
            }

            var sizeOfLine = this.getNumberOfTileInRow(pageName, curTile.isLink);
            return {
                pageName: pageName,
                curTile: curTile,
                curTileIndex: curTile.isLink ? links.indexOf(curTile) : tiles.indexOf(curTile),
                tiles: tiles,
                links: links,
                sizeOfLine: sizeOfLine,
                group: group,
                rowsData: rowsData
            };
        },

        getCatalogLayoutData: function () {
            var jqCatalogContiner = jQuery('#catalogTiles .sapUshellInner').children(':visible'),
                maxTilesInLine = this.getNumberOfTileInRow('catalog'),
                rowsIndex = [],
                countTiles = 0;

            for (var i = 1; i < jqCatalogContiner.length; i++) {

                if (jQuery(jqCatalogContiner[i]).hasClass("sapUshellTile")) {
                    countTiles++;
                }
                if (jQuery(jqCatalogContiner[i]).hasClass("sapUshellHeaderTile")) {
                    rowsIndex.push(countTiles);
                    countTiles = 0;
                }
                if (countTiles >= maxTilesInLine) {
                    rowsIndex.push(countTiles);
                    countTiles = 0;
                }
            }
            if (countTiles > 0) {
                rowsIndex.push(countTiles);
            }

            return rowsIndex;
        },

        whichTileRow: function (id, info) {
            var tilesSum = 0,
                i;

            for (i = 0; i < info.rowsData.length; i++) {
                tilesSum += info.rowsData[i];
                if (id < tilesSum) {
                    return i;
                }
            }
        },

        goToSiblingElementInTileContainer: function (direction, jqFocused, pageName) {
            var jqTileContainer = jqFocused.closest('.sapUshellTileContainer'),
                jqTileContainerElement,
                jqFirstTileInTileContainer,
                jqTileContainerHeader;

            //If current focused item is the Before Content of a Tile Container.
            if (jqTileContainerElement = this.getFocusTileContainerBeforeContent(jqFocused)) {
                if (direction === 'up' || direction === "left") {
                    this._goToNextTileContainer(jqTileContainerElement, direction);
                } else {
                    jqTileContainerHeader = jqTileContainer.find('.sapUshellTileContainerHeader:first');
                    this.setTabIndexOnTileContainerHeader(jqTileContainerHeader);
                    jqTileContainerHeader.focus();
                }
                return;
            }
            // If current focused item is the Header of a Tile Container.
            if (jqTileContainerElement = this.getFocusTileContainerHeader(jqFocused)) {
                if (direction === 'up') {
                    this.setTabIndexOnTileContainerHeader(jqTileContainerHeader);
                    if (!this._goToTileContainerBeforeContent(jqTileContainer)) {
                        //If the Tile Container doesn't have a Before Content, go to the Tile Container above.
                        this._goToNextTileContainer(jqTileContainerElement, direction);
                    }
                } else if (direction === "down") {
                    jqFirstTileInTileContainer = jqTileContainer.find('.sapUshellTile:first');
                    //If this Tile Container doesn't have tiles at all (not even a Plus Tile), it means that the group is empty and locked.
                    //Thus the next arrow down navigation should be to the descending Tile Container.
                    if (jqFirstTileInTileContainer.length) {
                        var tile = jQuery(jqFirstTileInTileContainer);
                        this.scrollToTileAndSetFocus(tile, pageName);

                    } else {
                        this._goToNextTileContainer(jqTileContainerElement, direction);
                    }
                } else if (direction === "left") {
                    if (jqFocused.hasClass("sapUshellTileContainerHeader")) {
                        if (!this._goToTileContainerBeforeContent(jqTileContainer)) {
                            //If the Tile Container doesn't have a Before Content, go to the Tile Container above.
                            this._goToNextTileContainer(jqTileContainerElement, "left");
                        }
                    } else {
                        jqTileContainerHeader = jqFocused.closest(".sapUshellTileContainerHeader");
                        jqTileContainerHeader.focus();
                    }
                } else if (direction === "right") {
                    var editInputField = jqFocused.hasClass("sapMInputBaseInner");
                    if (!editInputField) {
                        jqFirstTileInTileContainer = jqTileContainer.find('.sapUshellTile:first');
                        //If this Tile Container doesn't have tiles at all (not even a Plus Tile), it means that the group is empty and locked.
                        //Thus the next arrow down navigation should be to the descending Tile Container.
                        if (jqFirstTileInTileContainer.length) {
                            this.setTileFocus(jqFirstTileInTileContainer);
                        } else {
                            this._goToNextTileContainer(jqTileContainerElement, "down");
                        }
                    }
                }
                return;
            }
            // If current focused item is a Tile.
            if (jqTileContainerElement = this.getFocusOnTile(jqFocused)) {
                this.goFromFocusedTile(direction, jqTileContainerElement, pageName, true);
                return;
            }
            // If current focused item is an After Content of a Tile Container.
            if (jqTileContainerElement = this.getFocusOnTileContainerAfterContent(jqFocused)) {
                if (direction === 'up' || direction === "left") {
                    this._goToFirstTileInTileContainer(jqTileContainerElement);
                } else {
                    this._goToNextTileContainer(jqTileContainerElement, direction);
                }
            }
        },

        _goToNextTileContainer: function (jqTileContainerElement, direction) {
            var jqCurrentTileContainer = jqTileContainerElement.closest('.sapUshellTileContainer'),
                aAllTileContainers = jQuery('.sapUshellTileContainer:visible'),
                nDirection = (direction === 'down') ? 1 : -1,
                jqNextTileContainer,
                jqNextTileContainerHeader;

            jqNextTileContainer = jQuery(aAllTileContainers[aAllTileContainers.index(jqCurrentTileContainer) + nDirection]);
            if (jqNextTileContainer) {
                jqNextTileContainerHeader = jqNextTileContainer.find('.sapUshellTileContainerHeader');
                if (direction === 'down') {
                    if (!this._goToTileContainerBeforeContent(jqNextTileContainer)) {
                        this.setTabIndexOnTileContainerHeader(jqNextTileContainerHeader);
                        this.setTileContainerSelectiveFocus(jqNextTileContainer);
                    }
                } else {
                    if (this._goToTileContainerAfterContent(jqNextTileContainer)) {
                        return;
                    }
                    if (direction === 'up') {
                        if (!this._goToFirstTileInTileContainer(jqNextTileContainer)) {
                            this.setTabIndexOnTileContainerHeader(jqNextTileContainerHeader);
                            jqNextTileContainerHeader.focus();
                        }
                    } else if (direction === 'left') {
                        if (!this._goToLastTileInTileContainer(jqNextTileContainer)) {
                            this.setTabIndexOnTileContainerHeader(jqNextTileContainerHeader);
                            jqNextTileContainerHeader.focus();
                        }
                    }
                }
            }
        },

        _goToLastTileInTileContainer: function (jqTileContainerElement) {
            var jqTileContainer = jqTileContainerElement.hasClass('sapUshellTileContainer') ? jqTileContainerElement : jqTileContainerElement.closest('.sapUshellTileContainer'),
                jqLastTileInTileContainer = jqTileContainer.find('.sapUshellTile:last'),
                jqLastLinkInTileContainer = jqTileContainer.find('.sapUshellLinkTile:last');

            if (!jqLastLinkInTileContainer.length && !jqLastTileInTileContainer.length) {
                return false;
            }
            this.setTileFocus(jqLastLinkInTileContainer.length ? jqLastLinkInTileContainer : jqLastTileInTileContainer);
            return true;
        },

        _goToFirstTileInTileContainer: function (jqTileContainerElement) {
            var jqTileContainer = jqTileContainerElement.hasClass('sapUshellTileContainer') ? jqTileContainerElement : jqTileContainerElement.closest('.sapUshellTileContainer'),
                jqFirstTileInTileContainer = jQuery(jqTileContainer.find('.sapUshellTile').get(0));

            if (jqFirstTileInTileContainer.length) {
                this.setTileFocus(jqFirstTileInTileContainer);
                return true;
            } else {
                return false;
            }
        },

        _goToTileContainerBeforeContent: function (jqTileContainerElement) {
            var jqTileContainer = jqTileContainerElement.hasClass('sapUshellTileContainer') ? jqTileContainerElement : jqTileContainerElement.closest('.sapUshellTileContainer'),
                jqTileContainerBeforeContent = jqTileContainer.find('.sapUshellTileContainerBeforeContent button:visible');

            if (jqTileContainerBeforeContent.length) {
                jqTileContainerBeforeContent.focus();
                return true;
            } else {
                return false;
            }
        },

        _goToTileContainerAfterContent: function (jqTileContainerElement) {
            var jqTileContainer = jqTileContainerElement.hasClass('sapUshellTileContainer') ? jqTileContainerElement : jqTileContainerElement.closest('.sapUshellTileContainer'),
                jqTileContainerAfterContent = jqTileContainer.find('.sapUshellTileContainerAfterContent button:visible');

            if (jqTileContainerAfterContent.length) {
                jqTileContainerAfterContent.focus();
                return true;
            } else {
                return false;
            }
        },

        goFromFocusedTile: function (direction, jqTile, pageName, bIsActionsModeActive) {
            var info = this.getGroupAndTilesInfo(jqTile, pageName),
                nextTile,
                jqCurrentTileContainer,
                jqNextTileContainer,
                jqCurrentTileContainerHeader,
                jqTileContainerAfterContent,
                bIsSameTileContainer;

            if (!info) {
                return;
            }
            nextTile = this.getNextTile(direction, info, bIsActionsModeActive);
            if (bIsActionsModeActive) {
                jqCurrentTileContainer = jQuery(jqTile).closest('.sapUshellTileContainer');
                if (!nextTile) {
                    if (direction === 'down' || direction === 'right') {
                        jqTileContainerAfterContent = jQuery(jqCurrentTileContainer).find('.sapUshellTileContainerAfterContent button:visible');
                        jqTileContainerAfterContent.focus();
                        return;
                    }
                    if (direction === 'up') {
                        this.setTabIndexOnTileContainerHeader(jqCurrentTileContainer.find('.sapUshellTileContainerHeader'));
                        this.setTileContainerSelectiveFocus(jqCurrentTileContainer);
                        return;
                    }
                    if (direction === 'left') {
                        jqCurrentTileContainerHeader = jqCurrentTileContainer.find('.sapUshellTileContainerHeader');
                        jqCurrentTileContainerHeader.focus();
                    }
                } else {
                    jqNextTileContainer = jQuery(nextTile.getDomRef()).closest('.sapUshellTileContainer');
                    bIsSameTileContainer = jqCurrentTileContainer.length && jqNextTileContainer.length && (jqCurrentTileContainer.attr('id') === jqNextTileContainer.attr('id'));
                    if (bIsSameTileContainer) {
                        var tile = jQuery(nextTile.getDomRef());
                        this.scrollToTileAndSetFocus(tile, pageName);
                    } else {
                        if (direction === 'down' || direction === 'right') {
                            if (!this._goToTileContainerAfterContent(jqCurrentTileContainer)) {
                                //If the Tile Container doesn't have a visible AfterContent, go to the next Tile Container.
                                this.setTabIndexOnTileContainerHeader(jqNextTileContainer.find('.sapUshellTileContainerHeader'));
                                this.setTileContainerSelectiveFocus(jqNextTileContainer);
                            }
                        } else if (direction === 'up' || 'left') {
                            jqCurrentTileContainerHeader = jqCurrentTileContainer.find('.sapUshellTileContainerHeader');
                            this.setTabIndexOnTileContainerHeader(jqCurrentTileContainerHeader);
                            jqCurrentTileContainerHeader.focus();
                        }
                    }
                }
            } else if (nextTile) {
                var tile = jQuery(nextTile.getDomRef());
                this.scrollToTileAndSetFocus(tile, pageName);
            }
        },

        scrollToTileAndSetFocus: function (tile, pageName) {
            var tileBottom = tile.offset().top + tile.height();
            if (pageName === "catalog") {
                var offset = (tileBottom - jQuery("body").height()) - jQuery("#catalogTilesPage").offset().top + 200;
                jQuery('#catalogTilesPage section').animate({scrollTop: offset}, 0, function () {
                    this.setTileFocus(tile);
                }.bind(this));
            } else {
                this.moveScrollDashboard(tile);
            }
        },

        deleteTile: function (jqTile) {
            var tileId = jqTile.attr("id");
            if (!tileId) {
                return;
            }
            var oTile = sap.ui.getCore().byId(tileId);
            var info = this.getGroupAndTilesInfo(jqTile);
            var nextTile = this.getNextTile("right", info);
            if (!nextTile || (nextTile && nextTile.getParent() != info.group)) {
                nextTile = this.getNextTile("left", info);
            }
            if (!nextTile || (nextTile && nextTile.getParent() != info.group)) {
                nextTile = info.group.oPlusTile;
            }
            if (nextTile) {
                this.setTileFocus(jQuery(nextTile.getDomRef()));
                setTimeout(function (group, nextTileUuid) {
                    var tiles = group.getTiles();
                    if (!tiles.length) {
                        if (info.group.getProperty('defaultGroup')) {
                            var nextGroup = this.getNextGroup("right", info);
                            nextTile = nextGroup.getTiles()[0] || nextGroup.oPlusTile;
                            this.setTileFocus(jQuery(nextTile.getDomRef()));
                        }
                        this.setTileFocus(jQuery(group.oPlusTile.getDomRef()));
                        return;
                    }
                    var nextTile;
                    for (var i = 0; i < tiles.length; i++) {
                        if (tiles[i].getProperty('uuid') == nextTileUuid) {
                            nextTile = tiles[i];
                            break;
                        }
                    }
                    if (nextTile) {
                        this.setTileFocus(jQuery(nextTile.getDomRef()));
                    }
                }.bind(this, info.group, nextTile.getProperty('uuid')), 100);
            }
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("launchpad", "deleteTile", {
                tileId: oTile.getUuid()
            });
        },

        setTabIndexOnTileContainerHeader: function (jqTileContainerHeader) {
            jQuery(".sapUshellTileContainerHeader").attr("tabindex", -1);
            jQuery(".sapUshellTileContainerHeader .sapUshellContainerTitle").attr("tabindex", -1);
            jQuery(".sapUshellTileContainerHeader .sapUshellContainerHeaderActions button").attr("tabindex", -1);

            if (jqTileContainerHeader) {
                var jqTileConainerHeaderTitle = jqTileContainerHeader.find('.sapUshellContainerTitle:first'),
                    jqTileContainerHeaderActions = jqTileContainerHeader.find('.sapUshellContainerHeaderActions:first');

                jqTileContainerHeader.attr('tabindex', 0);
                jqTileConainerHeaderTitle.attr('tabindex', 0);
                jqTileContainerHeaderActions.find('button').attr('tabindex', 0);
            }
        },

        setTileContainerSelectiveFocus: function (jqTileContainer) {
            var jqTileContainerBeforeContent = jqTileContainer.find('.sapUshellTileContainerBeforeContent button'),
                jqTileContainerHeader = jqTileContainer.find('.sapUshellTileContainerHeader:first'),
                bBeforeContentDisplayed = jqTileContainerBeforeContent.length && jqTileContainerBeforeContent.is(":visible");

            if (bBeforeContentDisplayed) {
                jqTileContainerBeforeContent.focus();
            } else if (jqTileContainerHeader.length) {
                //Set tab-index on tileContainerHeader and its' children.
                this.setTabIndexOnTileContainerHeader(jqTileContainerHeader);
                jqTileContainerHeader.focus();
            }
        },

        setTileFocus: function (jqTile) {
            if (!jqTile.hasClass('sapUshellPlusTile')) {
                var oNavContainerFlp = sap.ui.getCore().byId('navContainerFlp'),
                    oCurrentPage = oNavContainerFlp.getCurrentPage(),
                    oCurrentViewName = oNavContainerFlp ? oNavContainerFlp.getCurrentPage().getViewName() : undefined,
                    jqFocusables;
                var bIsInCatalog = !!((oCurrentViewName === "sap.ushell.components.flp.launchpad.appfinder.AppFinder") && (oCurrentPage.getController().getCurrentMenuName() === "catalog"));

                jqFocusables = jqTile.find('[tabindex]');
                if (bIsInCatalog) {
                    var handler = sap.ushell.components.flp.ComponentKeysHandler;
                    handler.setFocusOnCatalogTile(jqFocusables.eq(0));
                }
            }

            //remove tablindex from all tiles
            jQuery(".sapUshellTile").attr("tabindex", -1);
            jQuery(".sapUshellLinkTile").attr("tabindex", -1);
            jqTile.attr("tabindex", 0);
            var jqLoadingDialog = jQuery("#loadingDialog")[0];
            if (!jqLoadingDialog || jqLoadingDialog.style.visibility === "hidden") {
                jqTile.focus();
            }
        },

        setFocusOnCatalogTile: function(jqTile){
            var oPrevFirsTile = jQuery(".sapUshellTile[tabindex=0]"),
                aAllTileFocusableElements,
                aVisibleTiles,
                jqParentTile;

            if (oPrevFirsTile.length) {
                //remove tabindex attribute to all tile's elements in TAB cycle if exists
                jQuery(".sapUshellTileContainerContent").find('[tabindex*=0]').attr("tabindex", -1);
                aAllTileFocusableElements = oPrevFirsTile.find('[tabindex], a').andSelf().filter('[tabindex], a');
                aAllTileFocusableElements.attr("tabindex", -1);
            }

            if (!jqTile){
                aVisibleTiles = jQuery(".sapUshellTile:visible");
                if (aVisibleTiles.length) {
                    jqParentTile = jQuery(aVisibleTiles[0]);
                    jqTile = jqParentTile.find('[tabindex], a').eq(0);
                } else {
                    return;
                }
            }

            //add tabindex attribute to all tile's elements in TAB cycle
            jqTile.closest(".sapUshellTile").attr("tabindex", 0);
            jqTile.attr("tabindex", 0);
            jqTile.closest(".sapUshellTile").find("button").attr("tabindex", 0);
        },

        moveScrollDashboard: function (jqTileSelected) {
            var containerId = jqTileSelected.closest(".sapUshellTileContainer")[0].id,
                iY = -1 * ( document.getElementById('dashboardGroups').getBoundingClientRect().top) + document.getElementById(containerId).getBoundingClientRect().top;
            iY += 49; // don't display group header after scroll. Group header will be visible in the anchor bar
            jQuery('#sapUshellDashboardPage section').stop().animate({scrollTop: iY}, 0, function () {
                this.setTileFocus(jqTileSelected);
            }.bind(this));
        },

        moveScrollCatalog: function (jqTileSelected) {
            var jqDashboardPageCont = jQuery("#catalogTilesPage-cont");
            var iTopSpacing = jQuery('#shell-hdr').height() + jQuery('.sapMPageHeader').height() + (parseInt(jQuery('.sapMPanelHdr').css('margin-top'), 10) * 2);
            var iY = jqTileSelected.offset().top + jqDashboardPageCont.scrollTop() - iTopSpacing;
            sap.ui.getCore().byId("catalogTilesPage").scrollTo(iY, 200);
        },

        moveGroupFromDashboard: function(direction, jqGroup) {
            var jqCurrentTileContainer,
                aTileContainers = jQuery(".sapUshellDashboardGroupsContainerItem"),
                indexOfTileContainer,
                toIndex;

            jqCurrentTileContainer = jqGroup.closest(".sapUshellDashboardGroupsContainerItem");
            indexOfTileContainer = aTileContainers.index(jqCurrentTileContainer);
            toIndex = direction == "up" || direction == "left" ? indexOfTileContainer - 1 : indexOfTileContainer + 1;
            this.moveGroup(indexOfTileContainer, toIndex);
        },

        moveGroup: function(fromIndex, toIndex) {
            var aGroups = jQuery(".sapUshellDashboardGroupsContainerItem"),
                numOfDisabledDragAndDropGroups = jQuery(".sapUshellDisableDragAndDrop").length;
            if (toIndex < 0 || toIndex >= aGroups.length || toIndex < numOfDisabledDragAndDropGroups) { return; }
            var core = sap.ui.getCore();
            var oData = {fromIndex: fromIndex, toIndex: toIndex};
            var oBus = core.getEventBus();
            oBus.publish("launchpad", "moveGroup", oData);

            setTimeout(function () {
                var tileContainerHeader = jQuery(".sapUshellTileContainerHeader")[toIndex];
                this.setTabIndexOnTileContainerHeader(jQuery(tileContainerHeader));
                jQuery(tileContainerHeader).focus();
            }.bind(this), 100);
        },

        getFocusGroupFromDashboard: function (jqFocused) {
            var bIsFocusedOnHeaderTitle = jqFocused.closest('.sapUshellTileContainerHeader').length && jqFocused[0].tagName === 'H2';
            return bIsFocusedOnHeaderTitle ? jqFocused : false;
        },

        getFocusTileContainerBeforeContent: function (jqFocusedElement) {
            var jqTileContainerBeforeContent = jqFocusedElement.closest('.sapUshellTileContainerBeforeContent');
            return jqTileContainerBeforeContent.length ? jqTileContainerBeforeContent : false;
        },

        getFocusTileContainerHeader: function (jqFocusedElement) {
            var jqTileContainerHeader = jqFocusedElement.closest('.sapUshellTileContainerHeader');
            return jqTileContainerHeader.length ? jqTileContainerHeader : false;
        },

        getFocusOnTileContainerAfterContent: function (jqFocusedElement) {
            var jqTileContainerAfterContent = jqFocusedElement.closest('.sapUshellTileContainerAfterContent');
            return jqTileContainerAfterContent.length ? jqTileContainerAfterContent : false;
        },

        getFocusOnTile: function (jqFocused) {
            var jqFocusedTile;

            jQuery.each(this.aTileWrapperClasses, function (index, sTileWrapperClass) {
                var jqTileWrapper = jqFocused.closest(sTileWrapperClass);
                jqFocusedTile = jqTileWrapper.length ? jqTileWrapper : false;
                return !(jqFocusedTile);
            });

            return jqFocusedTile;
        },

        renameGroup: function () {
            var jqFocused = jQuery(document.activeElement);
            var jqTileContainerTitle = this.getFocusGroupFromDashboard(jqFocused);

            if (jqTileContainerTitle) {
                jqTileContainerTitle.click();
            }
        },

        upDownButtonsHandler: function (direction, pageName) {
            var jqFocused = jQuery(document.activeElement);

            this.goFromFocusedTile(direction, jqFocused, pageName);
        },
        arrowsButtonsHandler: function (direction, e) {

            var jqFocused = jQuery(document.activeElement),
                bIsActionsModeActive = this.oModel.getProperty('/tileActionModeActive');

            if (jqFocused.hasClass("sapUshellAnchorItem")) {
                e.preventDefault();
                this.handleAnchorNavigationItemsArrowKeys(direction);
            } else {
                if (bIsActionsModeActive) {
                    if (!jqFocused.hasClass('sapMInputBaseInner')) {
                        e.preventDefault();
                        this.goToSiblingElementInTileContainer(direction, jqFocused);
                    }
                } else {
                    e.preventDefault();
                    this.goFromFocusedTile(direction, jqFocused);
                }
            }
        },

        handleAnchorNavigationItemsArrowKeys: function(direction) {
            var anchorItems = jQuery(".sapUshellAnchorItem:visible"),
                jqFocused = jQuery(document.activeElement),
                indexOfFocusedItem = anchorItems.index(jqFocused),
                nextElement = jqFocused,
                bIsRTL = sap.ui.getCore().getConfiguration().getRTL();

            if (bIsRTL) {
                direction = direction === 'left' ? 'right' : 'left';
            }

            if (direction === "left" || direction === "down") {
                if (indexOfFocusedItem > 0) {
                    nextElement = anchorItems.get(indexOfFocusedItem - 1);
                }
            } else if (direction === "right" || direction === "up") {
                if (indexOfFocusedItem < anchorItems.length - 1) {
                    nextElement = anchorItems.get(indexOfFocusedItem + 1);
                }
            }
            jQuery(nextElement).focus();
        },

        homeEndButtonsHandler: function (selector, e) {
            var jqFocused = jQuery(document.activeElement),
                tileToSelect;

            if (jqFocused.hasClass("sapUshellAnchorItem")) {
                e.preventDefault();
                var jqAnchorItemToSelect = jQuery(".sapUshellAnchorItem:visible:" + selector);
                jqAnchorItemToSelect.focus();
                return;
            }
            if (jqFocused.hasClass("sapUshellTile") && (jqFocused.closest("#dashboardGroups").length || jqFocused.closest("#catalogTiles").length)) {
                e.preventDefault();
                if (e.ctrlKey === true) {
                    tileToSelect = jQuery(".sapUshellTile:visible:not('.sapUshellPlusTile')")[selector]();
                } else {
                    tileToSelect = jqFocused.parent().find(".sapUshellTile:visible:not('.sapUshellPlusTile')")[selector]();
                }
                this.setTileFocus(tileToSelect);
                return;
            }
        },

        deleteButtonHandler: function () {
            if (this.oModel.getProperty("/personalization") && this.oModel.getProperty("/tileActionModeActive")) {
                var jqElement,
                    jqFocused = jQuery(document.activeElement);
                if (jqElement = this.getFocusOnTile(jqFocused)) {
                    if (!jqElement.hasClass('sapUshellLockedTile') && !jqElement.hasClass('sapUshellPlusTile')) {
                        this.deleteTile(jqElement);
                    }
                    return;
                }
            }
        },

        ctrlPlusArrowKeyButtonsHandler: function (selector) {
            var jqElement,
                jqFocused = jQuery(document.activeElement),
                bFocusElementIsLink = jQuery(jqFocused).hasClass('sapUshellLinkTile');
            if (!bFocusElementIsLink && (jqElement = this.getFocusOnTile(jqFocused))) {
                this.moveTile(selector);
                return;
            }
            if (jqElement = this.getFocusTileContainerHeader(jqFocused)) {
                // first we check if we should prevent the move of the group - obtain the wrapping container (content div)
                var jqFocusGroupContentElement = jqElement.closest('.sapUshellTileContainerContent');
                // if the group is the Home group OR Locked group - do not initiate move
                if (jqFocusGroupContentElement.hasClass('sapUshellTileContainerDefault') || jqFocusGroupContentElement.hasClass('sapUshellTileContainerLocked')) {
                    return;
                } else {
                    this.moveGroupFromDashboard(selector, jqElement);
                }
            }
        },

        spaceButtonHandler: function (e) {
            var jqFocused = jQuery(document.activeElement);
            if (jqFocused.hasClass("sapUshellTile") ) {
                e.preventDefault();
                var genericButton = jqFocused.find('[role="button"]');
                if (genericButton) {
                    var genericButtonId = genericButton.attr("id");
                    var genericTile = sap.ui.getCore().byId(genericButtonId),
                        bIsActionsModeActive = this.oModel.getProperty('/tileActionModeActive');
                    if (genericTile && !bIsActionsModeActive) {
                        genericTile.firePress();
                        return false;
                    }
                }
                jqFocused.click();
                return false;
            }
        },

        goToFirstCatalogTile: function () {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            var firstTile = jQuery('#catalogTiles .sapUshellTile:visible:first');
            handler.setTileFocus(firstTile);
        },

        goToFirstCatalogHeaderItem: function () {
            var nextElement = jQuery("#catalogTilesPage header button")[0];
            nextElement.focus();
        },

        goToFirstAnchorNavigationItem: function () {
            var jqElement = jQuery(".sapUshellAnchorItem:visible:first");
            jqElement.focus();
        },

        handleFocusOnMe: function(keyup, bFocusPassedFirstTime) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler,
                oNavContainerFlp = sap.ui.getCore().byId('navContainerFlp'),
                oCurrentPage = oNavContainerFlp.getCurrentPage(),
                oCurrentViewName = oCurrentPage.getViewName();

            //we in dashboard
            if (oCurrentViewName == "sap.ushell.components.flp.launchpad.dashboard.DashboardContent") {
                // we got the focus from the shell
                if (bFocusPassedFirstTime) {
                    if (keyup.shiftKey) {
                        handler.goToTileContainer(keyup);
                    } else {
                        handler.goToFirstAnchorNavigationItem();
                    }
                } else {
                    handler.mainKeydownHandler(keyup);
                    handler.dashboardKeydownHandler(keyup);
                }
            }

            //we in appFinder
            if (oCurrentViewName == "sap.ushell.components.flp.launchpad.appfinder.AppFinder") {
                //if appFinder handled keyDown, no need to pass it to other functions
                if (handler.appFinderKeydownHandler(keyup, bFocusPassedFirstTime)) {
                    return;
                }

                var menuName = oCurrentPage.getController().getCurrentMenuName();
                //we are in catalog
                if (menuName === "catalog") {
                    // we got the focus from the shell
                    if (bFocusPassedFirstTime) {
                        if (keyup.shiftKey) {
                            handler.goToFirstCatalogTile();
                        } else {
                            handler.goToFirstCatalogHeaderItem();
                        }
                    } else {
                        handler.mainKeydownHandler(keyup);
                        handler.catalogKeydownHandler(keyup);
                    }
                } else {
                    handler.easyAccessKeydownHandler(keyup);
                }
            }
        },

        groupHeaderNavigation: function() {
            var jqFocusItem = jQuery(document.activeElement),
                jqElement;

            if (jqFocusItem.hasClass("sapUshellTileContainerHeader")) {
                jqElement = jqFocusItem.find(".sapUshellContainerTitle");
                jqElement.focus();
            } else if (jqElement = jqFocusItem.closest(".sapUshellTileContainerHeader")){
                jqElement.focus();
            }
        },

        handleShortcuts: function (oEvent) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;

            if (oEvent.altKey) {
                switch (String.fromCharCode(oEvent.keyCode)) {
                    case 'C':
                        if (handler.oModel.getProperty("/personalization")) {
                            handler.handleCatalogKey();
                        }
                        break;
                    case 'H':
                        handler.handleHomepageKey();
                        break;
                }
            }
        },

        mainKeydownHandler: function (e) {
            e = e || window.event;

            switch (e.keyCode) {
                case this.keyCodes.SPACE:
                    this.spaceButtonHandler(e);
                    break;
                case this.keyCodes.HOME: //Home button
                    this.homeEndButtonsHandler("first", e);
                    break;
                case this.keyCodes.END: //End button
                    this.homeEndButtonsHandler("last", e);
                    break;
            }
        },

        catalogKeydownHandler: function (keyup) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            var pageName = "catalog";
            switch (keyup.keyCode) {
                case handler.keyCodes.ARROW_UP: //Up
                    handler.upDownButtonsHandler("up", pageName);
                    break;
                case handler.keyCodes.ARROW_DOWN: //Down
                    handler.upDownButtonsHandler("down", pageName);
                    break;
                case handler.keyCodes.ARROW_RIGHT: // Right ->
                    handler.goFromFocusedTile("right","",pageName);
                    break;
                case handler.keyCodes.ARROW_LEFT: // Left <-
                    handler.goFromFocusedTile("left","",pageName);
                    break;
                case handler.keyCodes.PAGE_UP: //Page Up button
                    handler.goToFirstTileOfSiblingGroupInCatalog('prev', keyup);
                    break;
                case handler.keyCodes.PAGE_DOWN: //Page Down
                    handler.goToFirstTileOfSiblingGroupInCatalog('next', keyup);
                    break;
            }
        },

        appFinderFocusAppBox: function (jqPrevAppBox, jqNextAppBox) {
            jqPrevAppBox.attr("tabindex", "-1").find(".sapUshellPinButton").attr("tabindex", "-1");
            jqNextAppBox.find(".sapUshellPinButton").attr("tabindex", "0");
            jqNextAppBox.attr("tabindex", "0").focus();
        },

        appFinderKeydownHandler: function (keyup, bFocusPassedFirstTime) {
            if (!bFocusPassedFirstTime) {
                return;
            }
            var buttons = jQuery("#catalog, #userMenu, #sapMenu").filter("[tabindex=0]");
            if (buttons.length) {
                buttons.eq(0).focus();
                return true;
            }
        },

        easyAccessRightLeftHandler: function (direction, keyup) {
            keyup.preventDefault();
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            var siblingDirection = direction == "right" ? "next" : "prev";
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellAppBox")) {
                return;
            }
            var nextAppBox = jqFocused.parent()[siblingDirection]();
            if (nextAppBox.length) {
                handler.appFinderFocusAppBox(jqFocused, nextAppBox.children());
            }
        },

        easyAccessUpDownHandler: function (direction, keyup) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            keyup.preventDefault();
            var focused = document.activeElement;
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellAppBox")) {
                return;
            }
            var focusedRect = focused.getBoundingClientRect();
            var appBoxList = [].slice.call(document.querySelectorAll(".sapUshellAppBox"));
            if (direction == "up") {
                appBoxList.reverse();
            }
            appBoxList.splice(0, appBoxList.indexOf(focused) + 1);
            var nextAppBox;
            for (var i = 0; i < appBoxList.length; i++) {
                var rect = appBoxList[i].getBoundingClientRect();
                var horizontalIntersection = (rect.left < focusedRect.right && rect.right > focusedRect.left);
                if (horizontalIntersection) {
                    nextAppBox = appBoxList[i];
                    break;
                }
            }
            if (nextAppBox) {
                handler.appFinderFocusAppBox(jqFocused, jQuery(nextAppBox));
            }
        },

        easyAccessHomeEndHandler: function (direction, keyup) {
            keyup.preventDefault();
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            var siblingDirection = direction == "home" ? "first" : "last";
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellAppBox")) {
                return;
            }
            var nextAppBox = jqFocused.parent().parent().children()[siblingDirection]().children();
            if (jqFocused == nextAppBox) {
                return;
            }
            handler.appFinderFocusAppBox(jqFocused, jQuery(nextAppBox));
        },

        easyAccessKeydownHandler: function (keyup) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            switch (keyup.keyCode) {
                case handler.keyCodes.ARROW_UP:
                    handler.easyAccessUpDownHandler("up", keyup);
                    break;
                case handler.keyCodes.ARROW_DOWN:
                    handler.easyAccessUpDownHandler("down", keyup);
                    break;
                case handler.keyCodes.ARROW_RIGHT:
                    handler.easyAccessRightLeftHandler("right", keyup);
                    break;
                case handler.keyCodes.ARROW_LEFT:
                    handler.easyAccessRightLeftHandler("left", keyup);
                    break;
                case handler.keyCodes.HOME:
                case handler.keyCodes.PAGE_UP:
                    handler.easyAccessHomeEndHandler("home", keyup);
                    break;
                case handler.keyCodes.END:
                case handler.keyCodes.PAGE_DOWN:
                    handler.easyAccessHomeEndHandler("end", keyup);
                    break;
            }
        },

        dashboardKeydownHandler: function (keyup) {
            var handler = sap.ushell.components.flp.ComponentKeysHandler;
            switch (keyup.keyCode) {
                case handler.keyCodes.F2:
                    handler.renameGroup();
                    break;
                case handler.keyCodes.F7:
                    handler.groupHeaderNavigation();
                    break;
                case handler.keyCodes.DELETE: // Delete
                    handler.deleteButtonHandler();
                    break;
                case handler.keyCodes.BACKSPACE: // Delete
                    handler.deleteButtonHandler();
                    break;
                case handler.keyCodes.ARROW_UP: //Up
                    if (keyup.ctrlKey === true) {
                        handler.ctrlPlusArrowKeyButtonsHandler("up");
                    } else {
                        handler.arrowsButtonsHandler("up", keyup);
                    }
                    break;
                case handler.keyCodes.ARROW_DOWN: //Down
                    if (keyup.ctrlKey === true) {
                        handler.ctrlPlusArrowKeyButtonsHandler("down");
                    } else {
                        handler.arrowsButtonsHandler("down", keyup);
                    }
                    break;
                case handler.keyCodes.ARROW_RIGHT: // Right ->
                    if (keyup.ctrlKey === true) {
                        handler.ctrlPlusArrowKeyButtonsHandler("right");
                    } else {
                        handler.arrowsButtonsHandler("right", keyup);
                    }
                    break;
                case handler.keyCodes.ARROW_LEFT: // Left <-
                    if (keyup.ctrlKey === true) {
                        handler.ctrlPlusArrowKeyButtonsHandler("left");
                    } else {
                        handler.arrowsButtonsHandler("left", keyup);
                    }
                    break;
                case handler.keyCodes.PAGE_UP: //Page Up button //TODO : check what happen when the tile is  empty
                    handler.goToFirstTileOfSiblingGroup("prev", keyup);
                    break;
                case handler.keyCodes.PAGE_DOWN: //Page Down
                    handler.goToFirstTileOfSiblingGroup("next", keyup);
                    break;
            }

            return true;
        },

        init: function (oModel, oRouter) {
            this.oModel = oModel;
            this.oRouter = oRouter;
        }
    };

    sap.ushell.components.flp.ComponentKeysHandler = new componentKeysHandler();
}());