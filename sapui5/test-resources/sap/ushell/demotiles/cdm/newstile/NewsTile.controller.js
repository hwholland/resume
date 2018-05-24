jQuery.sap.require("sap.ushell.demotiles.cdm.newstile.NewsTileUtils");

sap.ui.controller("sap.ushell.demotiles.cdm.newstile.NewsTile", {
    onInit : function() {

        var that = this,
            oConfig = this.getOwnerComponent().getManifestEntry("/sap.ui5/config"),
            oComponentData = this.getOwnerComponent().getComponentData(),
            oTileProperties = oComponentData.properties;

        this._feedsRefreshComplete = true;

        this.intervalRefObj = setInterval(function() {

            that.refreshFeeds();
        }, newstile.NewsTileUtils.getRefreshIntervalConfig(oConfig, oTileProperties));
    },

    onBeforeRendering : function() {
        var newsTile = this.byId("feedTile");
        window.neema =newsTile;
        var binding = newsTile.getBinding("items");
        if (binding !== undefined) {
            var sorter = new sap.ui.model.Sorter("pubDate", true);
            binding.sort([ sorter ]);
        }
    },

    select : function(evt) {
        var itemId = evt.getParameter("itemId");
        var feedItem = sap.ui.getCore().byId(itemId);
        this.getView().selectedItem = feedItem;

        var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
        var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
        oCrossAppNavigator.toExternal({
            target : {
                semanticObject : "NewsFeed",
                action : "displayNewsList"
            },
            params : {
                newsViewId : this.getView().getId()
            }
        });
    },

    refreshFeeds : function() {

        var that = this,
            oComponentData = this.getOwnerComponent().getComponentData(),
            oTileProperties = oComponentData.properties ;

        // TODO: Serialize calls to the aggregator so that we
        // don't have more than one feed refresh executing at
        // the same time.
        var aInclusionFiltersConfiguration = newstile.NewsTileUtils.getInclusionFiltersConfiguration(oConfig, oTileProperties);
        var aExclusionFiltersConfiguration = newstile.NewsTileUtils.getExclusionFiltersConfiguration(oConfig, oTileProperties);
        if (this._feedsRefreshComplete) {
            this._feedsRefreshComplete = false;
            jQuery.sap.log.debug("NewsTile.controller: Calling aggregator to refresh feeds.");
            this.model = sap.suite.ui.commons.util.FeedAggregator.getFeeds(
                newstile.NewsTileUtils.getFeedConfiguration(oConfig, oTileProperties),
                aInclusionFiltersConfiguration,
                aExclusionFiltersConfiguration,
                function() {
                    that.feedsRefreshed();
                    that.getView()._newsTile.cycle();
                    // sort feed list
                    var newsTile = that.byId("feedTile");
                    var binding = newsTile.getBinding("items");
                    if (binding !== undefined) {
                        var sorter = new sap.ui.model.Sorter("pubDate", true);
                        binding.sort([ sorter ]);
                    }
                    that.getView().newsModel = that.getView()._newsTile.getModel();
                });
        } else {
            jQuery.sap.log.debug("NewsTile.controller: Skipping feeds refresh, previous refresh not completed.");
        }
    },

    feedsRefreshed : function() {

        this.byId("feedTile").stageModel(this.model);
        this._feedsRefreshComplete = true;
    },

    getNewsTileTooltip : function() {
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        var oBundle = jQuery.sap.resources({
            url : "../../../../sap/ushell/demotiles/cdm/newstile/news_tile.properties",
            locale : sLocale
        });

        return oBundle.getText("NEWS_TILE_TOOLTIP");
    },

    onExit : function() {

        clearInterval(this.intervalRefObj);
    },

    refresh : function(oController) {

        oController.getView()._newsTile.rerender();
    },
    getPreviewData : function(oController){
        var items = [];
        var aItems = new Object;
        var obj = new Object;
        obj["image"]  = newstile.NewsTileUtils.getDefaultImage(this.getView().oDefaultImages,-1);
        obj["title"] = "No articles to display";
        items.push(obj);
        aItems["items"] = items;
        return aItems;
    }
});