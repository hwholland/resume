// @copyright@
/**
 * @fileOverview The Unified Shell's page builder adapter for the 'CDM'
 *               platform.
 *
 * @version
 * @version@
 */
(function() {
    "use strict";
    /* global jQuery, sap, window, OData, hasher */
    jQuery.sap.declare("sap.ushell.adapters.cdm.LaunchPageAdapter");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.m.Text");

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the page builder adapter for the 'demo' platform.
     *
     * @param {object} oUnused
     *     the system served by the adapter
     * @param {string} sParam
     *     parameter as string (legacy, was used before oAdapterConfiguration was added)
     * @param {oject} oAdapterConfiguration
     *     configuration for the adapter.
     *
     * @class The Unified Shell's page builder adapter for the 'demo' platform.
     *
     * @constructor
     * @see sap.ushell.services.LaunchPage
     * @since 1.15.0
     */
    sap.ushell.adapters.cdm.LaunchPageAdapter = function (oUnused, sParameter, oAdapterConfiguration) {
        var aConfigGroups = [],
            aConfigCatalogs = [],
            //possibility to fail in percent
            iFailRate = 0,
            //artificial minimal time needed for request in ms
            iMinRequestTime = 10,
            //artificial maximum of additional time for request in ms (random)
            iMaxRequestTime = 10,
            i18nModel,
            i18n,
            defaultGroup;

        this.translationBundle = sap.ushell.resources.i18n;

        this.TileType = {
            Tile : "tile",
            Link : "link"
        };

        this.getGroups = function () {
            var oDfd = new jQuery.Deferred();
            this.assureLoaded().done(function() {
                //Simulate an async function
                window.setTimeout(function () {
                    // Simulates a success call (the done function of the promise will be called)
                    //do not pass a reference to the local array of groups
                    oDfd.resolve(aConfigGroups.slice(0));

                    // TODO: simulate a failure (which will trigger the fail function of the promise)
                    //oDfd.reject();
                }, getRequestTime());
            });
            return oDfd.promise();
        };

        this._loadGroupWithTiles = function(oGroup) {
            var that = this,
                oDeferred = new jQuery.Deferred();
            if (oGroup === undefined) {
                return oDeferred.reject("Group not found").promise();
            }
            var oConfigGroup = {
                 title : oGroup.identification.title,
                 id : oGroup.identification.id,
                 isPreset : true,
                 isVisible : true,
                 isGroupLocked : false,
                 tiles :  [],
                 links: []
            };
            var aPromises = [];

            // tiles
            oGroup.payload.tiles.forEach(function (oTile, index) {
                var oCurrentTile = oTile,
                    sHash,
                    oPr;

                sHash = that._prepareTileHash(oCurrentTile, index, aPromises, oDeferred);
                oPr = sap.ushell.Container.getService("ClientSideTargetResolution").resolveTileIntent(sHash);
                aPromises.push(oPr);

                oPr.done(function(oTileIntentResolved) {
                    var oTileIntentResolutionResult = oTileIntentResolved;
                    var oTile = {
                        id : "tile_" + index +  "_" + oConfigGroup.id,
                        size : oTileIntentResolved.size || "1x1",
                        //TODO add tilePersonalization
                        tileType : "sap.ushell.ui.tile.StaticTile",
                        properties : {
                            chipId :  "tile_" + index +  "_" + oConfigGroup.id,
                            info : oCurrentTile.description || oTileIntentResolutionResult.description || "no info in CDM", //TODO remove?
                            title : oCurrentTile.title || oTileIntentResolutionResult.title,
                            subtitle : oCurrentTile.subtitle || oTileIntentResolutionResult.subtitle,
                            icon : oCurrentTile.icon || oTileIntentResolutionResult.icon,
                            targetURL : sHash,
                            tilePersonalization : oCurrentTile.tilePersonalization // from CDM Site personalization
                        }
                    };
                    if (oTileIntentResolutionResult.indicatorDataSource) {
                        oTile.tileType = "sap.ushell.ui.tile.DynamicTile";
                        oTile.properties.stateArrow = "Up";
                        oTile.serviceRefreshInterval = 10;
                        oTile.configuration = {
                            getParameterValueAsString : function() {
                                return JSON.stringify({
                                    service_url : oTileIntentResolutionResult.indicatorDataSource.path
                                });
                            }
                        };
                //        var sConfig = oTileApi.configuration.getParameterValueAsString('tileConfiguration');
                //        var oConfig = JSON.parse(sConfig || "{}");

                        // add data source to component data
                        // TODO remove. Currently only needed for Custom Dynamic App Launcher
                        oTile.properties.indicatorDataSource = oTileIntentResolutionResult.indicatorDataSource;
                    }

                    if (typeof oTileIntentResolutionResult.tileComponentLoadInfo === "object") {
                        oTile.tileComponentLoadInfo = oTileIntentResolutionResult.tileComponentLoadInfo;
                    }
                    oConfigGroup.tiles[index] = oTile;
                });
            });

            // links
            if (oGroup.payload.links) {
                oGroup.payload.links.forEach(function (oTile, index) {
                    var oCurrentTile = oTile,
                        sHash,
                        oPr;

                    sHash = that._prepareTileHash(oCurrentTile, index, aPromises, oDeferred);
                    oPr = sap.ushell.Container.getService("ClientSideTargetResolution").resolveTileIntent(sHash);
                    aPromises.push(oPr);

                    oPr.done(function(oTileIntentResolved) {
                        var oTileIntentResolutionResult,
                            oTile,
                            sCustomTileLinkIntent;

                        oTileIntentResolutionResult = oTileIntentResolved;
                        oTile = {
                            id : "link_" + index +  "_" + oConfigGroup.id,
                            tileType : "sap.m.Link",
                            properties : {
                                targetURL : sHash,
                                text : oCurrentTile.title || oTileIntentResolutionResult.title
                            }
                        };

                        // check whether tile is a custom tile or not
                        if (oTileIntentResolutionResult.isCustomTile === true) {
                            // check for existance of an outbound with id "target"
                            if (oTileIntentResolutionResult.targetOutbound) {
                                sCustomTileLinkIntent = "#" + oTileIntentResolutionResult.targetOutbound.semanticObject
                                    + "-" + oTileIntentResolutionResult.targetOutbound.action;
                                // adapt target url
                                oTile.properties.targetURL = sCustomTileLinkIntent;

                                oConfigGroup.links[index] = oTile;
                            } else {
                                jQuery.sap.log.warning("Custom tile " + oTile.id
                                    + " cannot be rendered as link because it is missing the definition of an outbound with id 'target'");
                            }
                        } else {
                            oConfigGroup.links[index] = oTile;
                        }
                    });
                });
            }

            this._nonePending(aPromises).done(function() {
                oConfigGroup.tiles = oConfigGroup.tiles.filter(function(oTile) {
                    return !!oTile;
                });
                oDeferred.resolve(oConfigGroup);
            });
            return oDeferred.promise();
        };

        this._prepareTileHash = function (oTile, index, aPromises, oDeferred) {
            // construct an intent from the Tile object.
            // format the parameters
            var oURLParsing = sap.ushell.Container.getService("URLParsing");
            var aParamsRaw = oTile.target.parameters  || [];
            var oParams = {};
            aParamsRaw.forEach(function(obj) {
                if (obj.name && obj.value) {
                    oParams[obj.name] = [obj.value];
                }
            });
            var oTarget = { target : {
                    semanticObject : oTile.target.semanticObject,
                    action: oTile.target.action },
                params : oParams
            };
            var sHash = oURLParsing.constructShellHash(oTarget);
            if (!sHash) {
                return undefined;
            }
            return "#" + sHash;
        };

        // TODO FireFox calls promise handlers in a different order than Chrome does
        this._nonePending = function(aPromises) {
            var oDeferred = new jQuery.Deferred();
            var that = this;
            function aMap(aPromises) {
                return aPromises.map(function(el) {
                    if (typeof el.done === "undefined" && typeof el.then === "function" ) {
                        // assume its a promise.
                        var a = new jQuery.Deferred();
                        el.then(function() {
                            setTimeout(a.resolve,1);
                        }, function() {
                            setTimeout(a.reject,1);
                        });
                        return a.promise();
                    }
                    return el;
                });
            }
            var iLength = aPromises.length;
            var xMap = aMap(aPromises);
            jQuery.when.apply(this,xMap).then(function() {
                if (aPromises.length === iLength) {
                    setTimeout(oDeferred.resolve,0);
                } else {
                    that._nonePending(aPromises).done(function() {
                        oDeferred.resolve();
                    });
                }
            }, function() {
                // one of the promises rejected, remove it
                var aNewArray = aMap(aPromises).filter(function (oEl) {
                    return oEl.state() !== "rejected";
                });
                that._nonePending(aNewArray).done(function () {
                    setTimeout(function() {
                        oDeferred.resolve();
                    }, 0);
                });
            });
            return oDeferred.promise();
        };

        this._allPromisesDone = function(aArray) {
            var oDeferred = new jQuery.Deferred();
            if (aArray.length === 0) {
                oDeferred.resolve();
            } else {
                var aAlwaysResolved = aArray.map(function(oDeferred) {
                    var oDeferredAlways = new jQuery.Deferred();
                    oDeferred.always(oDeferredAlways.resolve.bind(oDeferredAlways));
                    return oDeferredAlways.promise();
                });
                jQuery.when.apply(this, aAlwaysResolved).done(function() {
                    oDeferred.resolve();
                });
            }
            return oDeferred.promise();
        };

        this._assureGroupLoaded = function(sGroupId, oMap, oCDMSiteService) {
            var that = this;
            var oGroupProcessed = new jQuery.Deferred();
            var oPr = oCDMSiteService.getGroup(sGroupId);
            oPr.done(function(oGroup) {
                var oPr = that._loadGroupWithTiles(oGroup);
                oPr.done(function(oRes) {
                    oMap[sGroupId] = oRes;
                    oGroupProcessed.resolve();
                }).fail(function() {
                    oGroupProcessed.resolve();
                });
            }).fail(function() {
                jQuery.sap.log.error("could not load group sGroupId" + sGroupId);
                oGroupProcessed.reject();
            });
            return oGroupProcessed.promise();
        };
        /**
         * This method constructs aConfigGroups and sets the defaultGroup to the first
         * group
         */
        this.assureLoaded = function() {
            var oDeferred = new jQuery.Deferred();
            var that = this;
            var oGroups = {};
            aConfigGroups = [];
            if (this._assureLoadedDeferred) {
                return this._assureLoadedDeferred.promise();
            }
            this._assureLoadedDeferred = oDeferred;
            var oCDMSiteService = sap.ushell.Container.getService("CDMSiteService");
            var oPr = oCDMSiteService.getHomepageGroups();
            oPr.done(function(aGroupIds) {
                var aGroupArray = [];
                aGroupIds.forEach(function(sGroupId) {
                    var oGroupProcessed = that._assureGroupLoaded(sGroupId,oGroups, oCDMSiteService);
                    aGroupArray.push(oGroupProcessed);
                });
                that._allPromisesDone(aGroupArray).done(function() {
                    // calculate aConfigGroups, removing all groups which are empty
                    aGroupIds.forEach(function(sKey,iIndex) {
                        aConfigGroups[iIndex] = oGroups[sKey];
                    });
                    aConfigGroups = aConfigGroups.filter(function(oObj) { return !!oObj; });
                    if (!defaultGroup) {
                        defaultGroup = aConfigGroups[0];
                    }
                    oDeferred.resolve();
                });
            }).fail(function() {
                jQuery.sap.log.error("getHomepageGroups failed, empty site");
                oDeferred.resolve();
            });
            // todo: resolve when all promises in aPromises are either rejected or resolved
//            this._nonePending(aPromises).done(function() {
//                Object.keys(oGroups).forEach(function(sKey) {
//                    aConfigGroups.push(oGroups[sKey]);
//                });
//                if (!defaultGroup) {
//                    defaultGroup = aConfigGroups[0];
//                }
//                oDeferred.resolve();
//            });
            return oDeferred.promise();
        };

        //this.assureLoaded();

        if (!i18nModel && oAdapterConfiguration.config.pathToLocalizedContentResources) {
            jQuery.sap.require("sap.ui.model.resource.ResourceModel");

            i18nModel = new sap.ui.model.resource.ResourceModel({
                bundleUrl : oAdapterConfiguration.config.pathToLocalizedContentResources,
                bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
            });

            i18n = i18nModel.getResourceBundle();
        }

        function _getTextLocalized(sKey) {
            if (i18n) {
                return i18n.getText(sKey);
            }

            return sKey;
        }

        jQuery.each(aConfigCatalogs, function (index, oCatTiles) {
            if (i18n) {
                oCatTiles.title = _getTextLocalized(oCatTiles.title);
            }
            jQuery.each(oCatTiles.tiles, function (index, oTile) {
                oTile.getTitle = function () {
                    return oTile.title;
                };
            });
        });

        jQuery.each(aConfigGroups, function (index, oGroup) {
            if (i18n) {
                oGroup.title =  _getTextLocalized(oGroup.title);
            }

            jQuery.each(oGroup.tiles, function (index, oTile) {
                handleTileServiceCall(oTile, true);
            });
        });

        function getSimulateFail() {
            return (100 * Math.random()) < iFailRate;
        }

//        function getTileViewAsync() {
//            return (100 * Math.random()) < iGetTileViewAsyncRate;
//        }

        function getRequestTime() {
            return iMinRequestTime + iMaxRequestTime * Math.random();
        }

        function indexOfTile(oGroup, oTile) {
            var index;
            for (index = 0; index < oGroup.tiles.length; index = index + 1) {
                if (oTile.id === oGroup.tiles[index].id) {
                    return index;
                }
            }
            return -1;
        }

        function indexOfGroup(aGroups, oGroup) {
            var index;
            for (index = 0; index < aGroups.length; index = index + 1) {
                if (oGroup.id === aGroups[index].id) {
                    return index;
                }
            }
            return -1;
        }

        /**
         * Reloads an existing group in order to get its existing state in the backend
         *
         * @param {object} the group that should be reloaded
         * @return {jQuery.promise}
         */
        function reloadGroup(oGroup) {
            var oDfd = jQuery.Deferred();

            //Simulate an async function
            window.setTimeout(function () {
                // Simulates a success call (the done function of the promise will be called).
                //Return the given group
                oDfd.resolve(oGroup);

                // TODO: simulate a failure (which will trigger the fail function of the promise)
                //oDfd.reject();
            }, getRequestTime());

            return oDfd.promise();
        }

        function handleTileServiceCall(oTile, bNewVisible){
            if (oTile.tileType !== 'sap.ushell.ui.tile.DynamicTile'
                || !oTile.properties || !oTile.properties.serviceUrl){
                return;
            }

            if (oTile.intervalTimer){
                clearInterval(oTile.intervalTimer);
                oTile.intervalTimer = undefined;
            }

            if (bNewVisible){
                var serviceRefreshInterval = oTile.serviceRefreshInterval;
                if (serviceRefreshInterval){
                    //interval is configured in seconds, therefore we need to convert it to milliseconds
                    serviceRefreshInterval = serviceRefreshInterval * 1000;
                } else {
                    //default interval is 10 seconds
                    serviceRefreshInterval = 10000;
                }
                oTile.intervalTimer = setInterval(function(){
                    OData.read(
                        oTile.properties.serviceUrl + '?id=' + oTile.id + '&t=' + new Date().getTime(),
                        function (oResult) {
                            jQuery.sap.log.debug('Dynamic tile service call succeed for tile ' + oTile.id);
                        },
                        function (sMessage) {
                            jQuery.sap.log.debug('Dynamic tile service call failed for tile ' + oTile.id + ', error message:' + sMessage);
                        });
                }, serviceRefreshInterval);
            }
        }

        /**
         * Returns the default group. This is an asynchronous function using a jQuery.Promise.
         * In case of success its <code>done</code> function is called and gets the
         * <code>sap.ui2.srvc.Page</code> object representing the default group.
         *
         * In case of error the promise's <code>fail</code> function is called.
         *
         * @returns {object}
         *  jQuery.Promise object.
         * @since 1.11.0
         * @public
         */
        this.getDefaultGroup = function () {
            var oDeferred = new jQuery.Deferred();

            oDeferred.resolve(defaultGroup);
            return oDeferred.promise();
        };

        this.addGroup = function (sTitle) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    var newGroup = {
                        id: "group_" + aConfigGroups.length,
                        title: sTitle,
                        tiles: []
                    };
                    aConfigGroups.push(newGroup);
                    // Simulates a success call (the done function of the promise will be called)
                    oDfd.resolve(newGroup);
                } else {
                    //In case adding a new group fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing groups also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case? leave the groups as is or delete all groups from page?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());
            return oDfd.promise();
        };


        this.getGroupTitle = function(oGroup) {
            return oGroup.identification.title;
        };

        this.setGroupTitle = function(oGroup, sNewTitle) {
            var oDfd = jQuery.Deferred();

            oGroup.identification.title = sNewTitle;
            oDfd.resolve();

            return oDfd.promise();
        };

        this.getGroupId = function(oGroup) {
            return oGroup.identification.id;
        };

        this.hideGroups = function(aHiddenGroupsIDs) {
            // TODO implement
            return jQuery.Deferred().resolve();
        };

        this.isGroupVisible = function(oGroup) {
            // TODO implement
            return true;
        };

        this.moveGroup = function(oGroup, newIndex) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.removeGroup = function(oGroup) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.resetGroup = function(oGroup) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.getTileTitle = function(oTile) {
            return oTile.title;
        };

        this.getGroupTitle = function (oGroup) {
            return oGroup.title;
        };

        this.setGroupTitle = function (oGroup, sNewTitle) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail();

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    // Simulates a success call (the done function of the promise will be called)
                    oGroup.title = sNewTitle;
                    oDfd.resolve();
                } else {
                    //In case setting group's title fails, reload the existing groups from the server
                    reloadGroup(oGroup)
                        .done(function (oExistingGroup) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing group's title that we got from the server to the reject function
                            oDfd.reject(oExistingGroup.title);
                        })
                        .fail(function () {
                            //In case loading the existing group also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case? leave the group as is or pass the title that we have from the oGroup parameter?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());
            return oDfd.promise();
        };

        this.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        this.hideGroups = function(aHiddenGroupsIDs){
            if (aHiddenGroupsIDs && aConfigGroups){
                for (var i = 0; i < aConfigGroups.length; i++){
                    if (aHiddenGroupsIDs.indexOf(aConfigGroups[i].id) != -1){
                        aConfigGroups[i].isVisible = false;
                    } else {
                        aConfigGroups[i].isVisible = true;
                    }
                }
            }
            return jQuery.Deferred().resolve();
        };

        this.isGroupVisible = function (oGroup){
            return oGroup && (oGroup.isVisible === undefined ? true : oGroup.isVisible); //Add default value for newly created group, otherwise it will be hidden by default.
        };

        this.moveGroup = function (oGroup, newIndex) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    // Simulates a success call (the done function of the promise will be called)
                    aConfigGroups.splice(newIndex, 0, aConfigGroups.splice(indexOfGroup(aConfigGroups, oGroup), 1)[0]);
                    oDfd.resolve();
                } else {
                    // TODO: simulate a failure (which will trigger the fail function of the promise)
                    //In case moving a group fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing groups also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case? leave the groups as is or delete all groups from page?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.removeGroup = function (oGroup) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    // Simulates a success call (the done function of the promise will be called)
                    aConfigGroups.splice(indexOfGroup(aConfigGroups, oGroup), 1);
                    jQuery.each(oGroup.tiles, function (index, oTile) {
                        handleTileServiceCall(oTile, false);
                    });
                    oDfd.resolve();
                } else {
                    //In case removing a group fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing groups also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case? leave the groups as is or delete all groups from page?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.resetGroup = function (oGroup) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    jQuery.each(oGroup.tiles, function (index, oTile) {
                        handleTileServiceCall(oTile, false);
                    });
                    //Simulates a success call (the done function of the promise will be called)
                    //get the preset definition of the group
                    oGroup = jQuery.extend(true, {}, oAdapterConfiguration.config.groups[indexOfGroup(oAdapterConfiguration.config.groups, oGroup)]);
                    //replace the old group => indexOfGroup compares IDs, so use of original oGroup is valid
                    aConfigGroups.splice(indexOfGroup(aConfigGroups, oGroup), 1, oGroup);

                    jQuery.each(oGroup.tiles, function (index, oTile) {
                        handleTileServiceCall(oTile, true);
                    });
                    oDfd.resolve(oGroup);
                } else {
                    //In case removing a group fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing groups also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case? leave the groups as is or delete all groups from page?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.isGroupRemovable = function (oGroup) {
            return oGroup && !oGroup.isPreset;
        };

        this.isGroupLocked = function(oGroup) {
            return oGroup.isGroupLocked;
        };

        this.getGroupTiles = function (oGroup) {
            var aTilesAndLinks = oGroup.tiles || [];
            if (oGroup.links && Array.isArray(oGroup.links) && oGroup.links.length > 0) {
                // join both arrays
                aTilesAndLinks = aTilesAndLinks.concat(oGroup.links);
            }
            return aTilesAndLinks;
        };

        this.getLinkTiles = function (oGroup) {
            // this method is actually not used ...
            return oGroup.links;
        };

        this.getTileType = function (oTile) {
            if (oTile.tileType === "sap.m.Link") {
                return this.TileType.Link;
            }
            return this.TileType.Tile;
        };

        this.getTileId = function (oTile) {
            return oTile.id;
        };

        this.getTileSize = function (oTile) {
            return oTile.size;
        };

        this.getTileTarget = function (oTile) {
            return oTile.target_url || "";
        };

        this.isTileIntentSupported = function(oTile) {
            // TODO implement
            return true;
        };

        this._handleTilePress = function (oTileControl) {
            if (typeof oTileControl.attachPress === 'function'){
                oTileControl.attachPress(function(){
                    if (typeof oTileControl.getTargetURL === 'function'){
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL){
                            if (sTargetURL[0] === '#'){
                                hasher.setHash(sTargetURL);
                            } else {
                                window.open(sTargetURL, '_blank');
                            }
                        }
                    }
                });
            }
        };

        this._translateTileProperties = function(oTileData) {
        };

        this.refreshTile = function(oTile) {
            // nothing to do here for the moment as we don't have dynamic data
        };

        this.setTileVisible = function(oTile, bNewVisible) {
            if (oTile && oTile.tileComponent && typeof oTile.tileComponent.tileSetVisible === "function") {
                // only inform the tile if something changed
                if (oTile.visibility !== bNewVisible) {
                    oTile.visibility = bNewVisible;
                    oTile.tileComponent.tileSetVisible(bNewVisible);
                }
            }
        };

        this.addTile = function(oCatalogTile, oGroup) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.removeTile = function(oGroup, oTile) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.moveTile = function(oTile, sourceIndex, targetIndex, oSourceGroup,
            oTargetGroup) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };
/*TODO CHANGED???*/
        this._getTile = function(oTile,sSemanticObject, sAction) {
            if (oTile && oTile.formFactor) {
                var formFactor = oTile.formFactor;

                var oSystem = sap.ui.Device.system;

                var currentDevice;
                if (oSystem.desktop) {
                    currentDevice = "Desktop";
                } else if (oSystem.tablet) {
                    currentDevice = "Tablet";
                } else if (oSystem.phone) {
                    currentDevice = "Phone";
                }

                if (formFactor.indexOf(currentDevice) === -1) {
                    return false;
                }
            }

            return true;
        };

        this.getTileView = function(oTile) {
            var  that = this,
                oDeferred = new jQuery.Deferred();

            setTimeout(
                function() {
                    var oTileUI;

                    try {
                        oTileUI = that._getTileView(oTile);
                    } catch (e) {
                        // graceful degradation
                        jQuery.sap.log.error(
                            "tile '" + oTile.id + "' could not be initialized: " + e.message,
                            /*e.stack*/ null,
                            oTile.tileType
                        );
                        oDeferred.reject(e.message, e.stack);
                    }
                    if (oTileUI) {
                        if (typeof oTileUI.getComponentInstance === "function") {
                            // remember the tile component as we need it for visible handling (for example)
                            oTile.tileComponent = oTileUI.getComponentInstance();
                        }
                        oDeferred.resolve(oTileUI);
                        return;
                    }
                    oDeferred
                        .reject("Tile view or component could not be initialized");
                }, 0);

            return oDeferred.promise();
        };

        this._getTileView = function (oTileData) {
            var sError = 'unknown error',
                oTileUI,
                sTileType,
                bIsLink = this.getTileType(oTileData) === "link";

            this._translateTileProperties(oTileData);
            if (oTileData.tileComponentLoadInfo) {
                //
                oTileData.tileComponentLoadInfo.name = oTileData.tileComponentLoadInfo.name ||  oTileData.tileComponentLoadInfo.componentName;
                jQuery.sap.registerModulePath(oTileData.tileComponentLoadInfo.name, oTileData.tileComponentLoadInfo.url);
                oTileUI = new sap.ui.core.ComponentContainer({
                    component: sap.ui.getCore().createComponent({
                        componentData: {
                            properties: oTileData.properties
                            // TODO add startUpParameters
                        },
                        name: oTileData.tileComponentLoadInfo.name
                    })
                });
                return oTileUI;
            } else if (oTileData.namespace && oTileData.path && oTileData.moduleType) {
                jQuery.sap.registerModulePath(oTileData.namespace, oTileData.path);
                if (oTileData.moduleType === "UIComponent") {
                    oTileUI = new sap.ui.core.ComponentContainer({
                        component: sap.ui.getCore().createComponent({
                            componentData: {
                                properties: oTileData.properties
                            },
                            name: oTileData.moduleName
                        })
                    });
                } else {
                    //XML, JSON, JS, HTML view
                    oTileUI = sap.ui.view({
                        viewName: oTileData.moduleName,
                        type: sap.ui.core.mvc.ViewType[oTileData.moduleType],
                        viewData: {
                            properties: oTileData.properties
                        }
                    });
                }
                return oTileUI;
            } else if (oTileData.tileType) {
                // SAPUI5 Control for the standard Static or dynamic tiles
                sTileType = bIsLink ? "sap.m.Link" : oTileData.tileType;
                if (sTileType) {
                    var url = oTileData.properties.targetURL || oTileData.properties.href;

                    try {
                        if (url){
                            // url may contain binding chars such as '{' and '}' for example in search result app
                            // to avoid unwanted property binding we are setting the url as explicitly
                            // fix csn ticket: 1570026529
                            delete oTileData.properties.targetURL;

                            oTileUI = this._createTileInstance(oTileData, sTileType);
                            //Restore the deleted url.
                            if (bIsLink) {
                                oTileUI.setHref(url);
                            } else {
                                if (typeof (oTileUI.setTargetURL) === 'function'){
                                    oTileUI.setTargetURL(url);
                                }
                                oTileData.properties.targetURL = url;
                            }
                        } else {
                            oTileUI = this._createTileInstance(oTileData);
                        }
                        this._handleTilePress(oTileUI);

                        return oTileUI;
                    } catch (e) {
                        return new sap.m.GenericTile({
                            header: e && (e.name + ": " + e.message) || this.translationBundle.getText("failedTileCreationMsg"),
                            frameType: this._parseTileSizeToGenericTileFormat(oTileData.size)

                        });
                    }
                } else {
                    sError = 'TileType: ' + oTileData.tileType + ' not found!';
                }
            } else {
                sError = 'No TileType defined!';
            }
            return new sap.m.GenericTile({
                header: sError,
                frameType: this._parseTileSizeToGenericTileFormat(oTileData.size)
            });
        };

        this._createTileInstance = function (oTileData, sTileType) {
            var oTileUI;

            jQuery.sap.require(sTileType === 'sap.m.Link' ? sTileType : 'sap.m.GenericTile');
            switch (sTileType) {
                case 'sap.ushell.ui.tile.DynamicTile':
                    oTileUI = new sap.m.GenericTile({
                        header: oTileData.properties.title,
                        subheader: oTileData.properties.subtitle,
                        frameType: this._parseTileSizeToGenericTileFormat(oTileData.size),
                        size: "Auto",
                        tileContent: new sap.m.TileContent({
                            frameType: this._parseTileSizeToGenericTileFormat(oTileData.size),
                            size: "Auto",
                            footer: oTileData.properties.info,
                            unit: oTileData.properties.numberUnit,
                            //We'll utilize NumericContent for the "Dynamic" content.
                            content: new sap.m.NumericContent({
                                scale: oTileData.properties.numberFactor,
                                value: oTileData.properties.numberValue,
                                indicator: oTileData.properties.stateArrow,
                                valueColor: this._parseTileValueColor(oTileData.properties.numberState),
                                icon: oTileData.properties.icon,
                                width: "100%"
                            })
                        }),
                        press: function () {
                            this._genericTilePressHandler(oTileData);
                        }.bind(this)
                    });
                    break;

                case 'sap.ushell.ui.tile.StaticTile':
                    oTileUI = new sap.m.GenericTile({
                        header: oTileData.properties.title,
                        subheader: oTileData.properties.subtitle,
                        frameType: this._parseTileSizeToGenericTileFormat(oTileData.size),
                        size: "Auto",
                        tileContent: new sap.m.TileContent({
                            frameType: this._parseTileSizeToGenericTileFormat(oTileData.size),
                            size: "Auto",
                            footer: oTileData.properties.info,
                            content: new sap.m.NumericContent({
                                icon: oTileData.properties.icon,
                                value: ' ',//The default value is 'o', That's why we instantiate with empty space.
                                width: "100%"
                            })
                        }),
                        press: function () {
                            this._genericTilePressHandler(oTileData);
                        }.bind(this)
                    });
                    break;

                case 'sap.m.Link':
                    oTileUI = new sap.m.Link({
                        text: oTileData.properties.text
                    });
                    break;

                default:
                    jQuery.sap.require(oTileData.tileType);
                    var TilePrototype = jQuery.sap.getObject(oTileData.tileType);

                    oTileUI =  new TilePrototype(oTileData.properties || {});
            }

            return oTileUI;
        };

        this._genericTilePressHandler = function (oTileData) {
            if (oTileData.properties.targetURL){
                if (oTileData.properties.targetURL[0] === '#') {
                    hasher.setHash(oTileData.properties.targetURL);
                } else {
                    window.open(oTileData.properties.targetURL, '_blank');
                }
            }
        };
        //Adapts the tile sise according to the format of the Generic tile (Used only to test the layout).
        this._parseTileSizeToGenericTileFormat = function (tileSize) {

            return  tileSize === "1x2" ? "TwoByOne" : "OneByOne";
        };

        this._parseTileValueColor = function (tileValueColor) {
            var returnValue = tileValueColor;

            switch (tileValueColor) {
                case "Positive":
                    returnValue = "Good";
                    break;
                case "Negative":
                    returnValue = "Critical";
                    break;
            }

            return returnValue;
        };

        this._handleTilePress = function (oTileControl) {
            if (typeof oTileControl.attachPress === 'function'){
                oTileControl.attachPress(function(){
                    if (typeof oTileControl.getTargetURL === 'function'){
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL){
                            if (sTargetURL[0] === '#'){
                                hasher.setHash(sTargetURL);
                            } else {
                                window.open(sTargetURL, '_blank');
                            }
                        }
                    }
                });
            }
        };

        this._translateTileProperties = function(oTileData) {
            //translation.
            if (i18n) {
                if (!oTileData.properties.isTranslated) {
                    oTileData.properties.title = _getTextLocalized(oTileData.properties.title);
                    oTileData.properties.subtitle = _getTextLocalized(oTileData.properties.subtitle);
                    oTileData.properties.info = _getTextLocalized(oTileData.properties.info);

                    if (oTileData.keywords) {
                        for (var keyIdex = 0; keyIdex < oTileData.keywords.length; keyIdex++) {
                            oTileData.keywords[keyIdex] = _getTextLocalized(oTileData.keywords[keyIdex]);
                        }
                    }
                    oTileData.properties.isTranslated = true;
                }
            }
        };

        this.addTile = function (oCatalogTile, oGroup) {
            if (!oGroup) {
                oGroup = defaultGroup;
            }

            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    var newTile = jQuery.extend(true, {
                        title: "A new tile was added",
                        size: "1x1"
                    }, oCatalogTile, {
                        id: "tile_0" + oCatalogTile.chipId
                    });

                    oGroup.tiles.push(newTile);
                    handleTileServiceCall(newTile, true);
                    // Simulates a success call (the done function of the promise will be called)
                    oDfd.resolve(newTile);
                } else {
                    //In case adding a tile fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing group also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.removeTile = function (oGroup, oTile) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    // Simulates a success call (the done function of the promise will be called)
                    oGroup.tiles.splice(indexOfTile(oGroup, oTile), 1);
                    handleTileServiceCall(oTile, false);
                    oDfd.resolve();
                } else {
                    //In case removing a tile fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing group also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.moveTile = function (oTile, sourceIndex, targetIndex, oSourceGroup, oTargetGroup) {
            var oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    if (oTargetGroup === undefined) {
                        //Move a tile in the same group
                        oTargetGroup = oSourceGroup;
                    }

                    oSourceGroup.tiles.splice(sourceIndex, 1);
                    oTargetGroup.tiles.splice(targetIndex, 0, oTile);

                    // Simulates a success call (the done function of the promise will be called)
                    oDfd.resolve(oTile);
                } else {
                    //In case moving a tile fails, reload the groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing group also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());

            return oDfd.promise();
        };

        this.getTile = function (sSemanticObject, sAction) {
            var oDfd = jQuery.Deferred();
            // TODO: return a oTile async
            return oDfd.promise();
        };


        this.getCatalogs = function () {
            var oDeferred = jQuery.Deferred();
            var aCatalogs = [];
            var oCDMSiteService = sap.ushell.Container.getService("CDMSiteService");
            oCDMSiteService.getCSTRProjection().then(function(oSite) {
                Object.keys(oSite.catalogs).forEach(function(sKey) {
                    var s = oSite.catalogs[sKey];
                    s.id = sKey;
                    aCatalogs.push(oSite.catalogs[sKey]);
                    oDeferred.notify(oSite.catalogs[sKey]);
                });
                oDeferred.resolve(aCatalogs);
            });
            return oDeferred.promise();
        };

        this.isCatalogsValid = function () {
            // TODO
            return true;
        };

        this.getCatalogError = function(oCatalog) {
            return;
        };

        this.getCatalogId = function(oCatalog) {
            return oCatalog.identification.id;
        };

        this.getCatalogTitle = function(oCatalog) {
            return oCatalog.identification.title;
        };

        this._isStartableInbound = function(oInbound) {
            // TODO: 
            return true; 
        };
        this._toInbound = function(oInbound, oApplication) {
            // TODO: 
            return "#" + oInbound.semanticObject + "-" + oInbound.action;
        };
        this._isCustomTile = function(oApplication) {
            //TODO:
            return false;
        };

        this.getCatalogTiles = function(oCatalog) {
            var oDfd = jQuery.Deferred();
            var aCatalogTiles = [];
            var that = this;
            var oCDMSiteService = sap.ushell.Container.getService("CDMSiteService");
            oCDMSiteService.getCSTRProjection().then(function(oSite) {
                // find all intents which can be started, represent them as tiles. 
                (oCatalog.payload.appDescriptors || []).forEach(function(oAppID) {
                    //
                    var oApplication = oSite.applications[oAppID.id];
                    if (that._isCustomTile(oApplication)) {
                        aCatalogTiles.push( {
                            application : oApplication
                        });
                    } else {
                        var oInbounds = that._getMember(oApplication,"sap|app.crossNavigation.inbounds") || {};
                        Object.keys(oInbounds).forEach(function(sKey) {
                            var oInbound = oInbounds[sKey];
                            var sTargetURL = that._toInbound(oInbound, oApplication);
                            if (that._isStartableInbound(oInbound)) {
                                aCatalogTiles.push({ 
                                    inbound : oInbound,
                                    tileType : "sap.ushell.ui.tile.StaticTile",
                            //        application : oApplication,
                                    properties : {
                                        size : "1x1",
                                        title : oInbound.title || that._getMember(oApplication,"sap|app.title"),
                                        subTitle : oInbound.subTitle || that._getMember(oApplication,"sap|app.subTitle"),
                                        info : oInbound.icon || that._getMember(oApplication,"sap|ui.icons.icon"),
                                        targetURL : sTargetURL
                                    }
                             //       sInbound : sTargetURL
                                });
                            }
                        });
                    }
                });
                oDfd.resolve(aCatalogTiles);
            });
            return oDfd.promise();
        };

        this.getCatalogTileId = function(oCatalogTile) {
            return oCatalogTile.properties.targetURL; // questionable, generate? 
        };

        this.getCatalogTileKeywords = function(oCatalogTile) {
            // TODO implement
            return jQuery.merge([], jQuery.grep(jQuery.merge([
                oCatalogTile.title,
                oCatalogTile.properties && oCatalogTile.properties.subtitle,
                oCatalogTile.properties && oCatalogTile.properties.info ],
                (oCatalogTile && oCatalogTile.keywords) || []), function(n, i) {
                return n !== "" && n;
            }));
        };

        this.getCatalogTileTags = function(oCatalogTile) {
            // TODO implement
            return (oCatalogTile && oCatalogTile.tags) || [];
        };

        this.addBookmark = function(oParameters, oGroup) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.updateBookmarks = function(sUrl, oParameters) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.countBookmarks = function(sUrl) {
            var oDfd = jQuery.Deferred();

            // TODO implement
            return oDfd.promise();
        };

        this.onCatalogTileAdded = function(sTileId) {
            // TODO implement
        };

        this.getCatalogError = function (oCatalog) {
            return;
        };

        this.getCatalogId = function (oCatalog) {
            return oCatalog.identification.id;
        };

        this.getCatalogTitle = function (oCatalog) {
            return oCatalog.identification.title;
        };

        this.getCatalogTileId = function (oCatalogTile) {
            if (oCatalogTile.chipId) {
                return oCatalogTile.chipId;
            } else {
                return "UnknownCatalogTileId";
            }
        };

        this.getCatalogTileTitle = function(oCatalogTile) {
            return oCatalogTile.properties.title;
        };

        this.getCatalogTileSize = function(oCatalogTile) {
            // TODO implement
            return "1x1";
        };

        this.getCatalogTileView = function (oCatalogTile) {
            return this._getTileView(oCatalogTile);
            //return this._getTileView(oCatalogTile);
        };

        this.getCatalogTileTargetURL = function (oCatalogTile) {
            return (oCatalogTile.properties && oCatalogTile.properties.targetURL) || null;
        };

        this.getCatalogTilePreviewTitle = function (oCatalogTile) {
            return (oCatalogTile.properties && oCatalogTile.properties.title) || null;
        };

        this.getCatalogTilePreviewIcon = function (oCatalogTile) {
            return (oCatalogTile.properties && oCatalogTile.properties.icon) || null;
        };

        this.getCatalogTileKeywords = function (oCatalogTile) {
            return jQuery.merge([], jQuery.grep(jQuery.merge([
                        oCatalogTile.title,
                        oCatalogTile.properties && oCatalogTile.properties.subtitle,
                        oCatalogTile.properties && oCatalogTile.properties.info
                    ],
                    (oCatalogTile && oCatalogTile.keywords) || []),
                function (n, i) { return n !== "" && n; }));
        };

        this.getCatalogTileTags = function (oCatalogTile) {
            return (oCatalogTile && oCatalogTile.tags) || [];
        };

        /**
         * Adds a bookmark to the user's home page.
         *
         * @param {object} oParameters
         *   bookmark parameters. In addition to title and URL, a bookmark might allow additional
         *   settings, such as an icon or a subtitle. Which settings are supported depends
         *   on the environment in which the application is running. Unsupported parameters will be
         *   ignored.
         * @param {string} oParameters.title
         *   The title of the bookmark.
         * @param {string} oParameters.url
         *   The URL of the bookmark. If the target application shall run in the Shell the URL has
         *   to be in the format <code>"#SO-Action~Context?P1=a&P2=x&/route?RPV=1"</code>
         * @param {string} [oParameters.icon]
         *   The optional icon URL of the bookmark (e.g. <code>"sap-icon://home"</code>).
         * @param {string} [oParameters.info]
         *   The optional information text of the bookmark.
         * @param {string} [oParameters.subtitle]
         *   The optional subtitle of the bookmark.
         * @param {string} [oParameters.serviceUrl]
         *   The URL to a REST or OData service that provides some dynamic information for the
         *   bookmark.
         * @param {string} [oParameters.serviceRefreshInterval]
         *   The refresh interval for the <code>serviceUrl</code> in seconds.
         * @param {string} [oParameters.numberUnit]
         *   The unit for the number retrieved from <code>serviceUrl</code>.
         * @returns {object}
         *   a jQuery promise.
         *
         * @see sap.ushell.services.URLParsing#getShellHash
         * @since 1.11.0
         * @public
         */
        this.addBookmark = function (oParameters, oGroup) {
            var oGroup = oGroup ? oGroup : defaultGroup,
                oDfd = jQuery.Deferred(),
                bFail = getSimulateFail(),
                that = this,
                title = oParameters.title,
                subtitle = oParameters.subtitle,
                info = oParameters.info,
                url = oParameters.url;

            //Simulate an async function
            window.setTimeout(function () {
                if (!bFail) {
                    var newTile = {
                        title: title,
                        size: "1x1",
                        chipId: "tile_0" + oGroup.tiles.length,
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        id: "tile_0" + oGroup.tiles.length,
                        keywords: [],
                        properties: {
                            icon: "sap-icon://time-entry-request",
                            info: info,
                            subtitle: subtitle,
                            title: title,
                            targetURL: url
                        }
                    };

                    oGroup.tiles.push(newTile);
                    handleTileServiceCall(newTile, true);
                    // Simulates a success call (the done function of the promise will be called)
                    oDfd.resolve(newTile);
                } else {
                    //In case adding a tile fails, load the existing groups from the server
                    that.getGroups()
                        .done(function (oExistingGroups) {
                            //Use the reject function in order to specify that an error has occurred.
                            //Pass the existing groups that we got from the server to the reject function
                            oDfd.reject(oExistingGroups);
                        })
                        .fail(function () {
                            //In case loading the existing group also fails, call the reject function with no parameters.
                            //TODO: what should the UI do in that case?
                            oDfd.reject();
                        });
                }
            }, getRequestTime());
            return oDfd.promise();
        };

        this.updateBookmarks = function (sUrl, oParameters) {
            var oDeferred = new jQuery.Deferred(),
                oGetGroupsPromise = this.getGroups();

            oGetGroupsPromise.done(function(aRetreivedGroups) {
                aRetreivedGroups.forEach(function(oGroup){
                    oGroup.tiles.forEach(function(oTileData){
                        if (oTileData.properties && oTileData.properties.targetURL === sUrl) {
                            for (var property in oParameters) {
                                if (oParameters.hasOwnProperty(property)) {
                                    oTileData.properties[property] = oParameters[property];
                                }
                            }
                        }
                    });
                });
                oDeferred.resolve();
            });
            oGetGroupsPromise.fail(function(){
                oDeferred.reject();
            });

            return oDeferred.promise();
        };

        /**
         * Counts <b>all</b> bookmarks pointing to the given URL from all of the user's pages. You
         * can use this method to check if a bookmark already exists.
         * <p>
         * This is a potentially asynchronous operation in case the user's pages have not yet been
         * loaded completely!
         *
         * @param {string} sUrl
         *   The URL of the bookmarks to be counted, exactly as specified to {@link #addBookmark}.
         * @returns {object}
         *   A <code>jQuery.Deferred</code> object's promise which informs about success or failure
         *   of this asynchronous operation. In case of success, the count of existing bookmarks
         *   is provided (which might be zero). In case of failure, an error message is passed.
         *
         * @see #addBookmark
         * @private
         */
        this.countBookmarks = function (sUrl) {
            var oDfd = jQuery.Deferred();

            var iCount = 0;
            var oGroup, oTile, iGroupIndex, iTileIndex;
            for (iGroupIndex = 0; iGroupIndex < aConfigGroups.length; iGroupIndex++) {
                oGroup = aConfigGroups[iGroupIndex];
                for (iTileIndex = 0; iTileIndex < oGroup.tiles.length; iTileIndex++) {
                    oTile = oGroup.tiles[iTileIndex];
                    if (oTile.properties.targetURL === sUrl){
                        iCount++;
                    }
                }
            }
            oDfd.resolve(iCount);

            return oDfd.promise();
        };

        /**
         * This method is called to notify that the given tile has been added to some remote
         * catalog which is not specified further.
         *
         * @param {string} sTileId
         *   the ID of the tile that has been added to the catalog (as returned by that OData POST
         *   operation)
         * @private
         * @since 1.16.4
         */
        this.onCatalogTileAdded = function (sTileId) {
            // TODO
        };
        this.getTileActions = function (oTile) {
            return (oTile && oTile.actions) || null;
        };
    };

    sap.ushell.adapters.cdm.LaunchPageAdapter.prototype._getMember = function (oObject,sAccessPath) {
        var oPathSegments = sAccessPath.split("."),
            oNextObject = oObject;
        if (!oObject) {
            return undefined;
        }
        oPathSegments.forEach(function(sSegment) {
            if (typeof oNextObject !== "object") {
                return undefined;
            }
            oNextObject = oNextObject[sSegment.replace(/[|]/g,".")];
        });
        return oNextObject;
    };
}());