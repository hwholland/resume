/* global jQuery,window */
(function(global) {
    "use strict";

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchModel');

    sap.ushell.renderers.fiori2.search.SearchModel.extend("sap.ushell.renderers.fiori2.search.SearchFacetDialogModel", {

        constructor: function() {

            var that = this;

            sap.ushell.renderers.fiori2.search.SearchModel.prototype.constructor.apply(that, []);

            that.aAllowedAccessUsage = ["AutoFacet"];

            // create sina query for facet dialog popover
            that.facetQuery = that.sina.createPerspectiveQuery({
                templateFactsheet: true
            });

            that.chartQuery = that.sina.createChartQuery();

            that.aFilters = [];
        },

        prepareFacetList: function() {
            var that = this;
            var metaData = that.getDataSource().getMetaDataSync();

            that.setProperty('/facetDialog', that.oFacetFormatter.getDialogFacetsFromMetaData(metaData, that));
        },

        //properties: sAttribute, sBindingPath
        facetDialogSingleCall: function(properties) {
            var that = this;

            that.chartQuery.setDataSource(that.getDataSource());
            that.chartQuery.setSkip(0);
            that.chartQuery.setTop(1);
            that.chartQuery.dimensions = [];
            that.chartQuery.addDimension(properties.sAttribute);

            return that.chartQuery.getResultSet().then(function(resultSet) {
                var oFacet = that.oFacetFormatter.getDialogFacetsFromChartQuery(resultSet, that);
                that.setProperty(properties.sBindingPath + "/items", oFacet.items);
            });
        },

        resetFacetQueryFilterConditions: function() {
            var that = this;
            that.facetQuery.resetFilterConditions();
        },

        resetChartQueryFilterConditions: function() {
            var that = this;
            that.chartQuery.resetFilterConditions();
        },

        hasFilterCondition: function(filterCondition) {
            var that = this;
            for (var i = 0; i < that.aFilters.length; i++) {
                if (that.aFilters[i].filterCondition.equals && that.aFilters[i].filterCondition.equals(filterCondition)) {
                    return true;
                }
            }
            return false;
        },

        hasFilter: function(item) {
            var that = this;
            var filterCondition = item.filterCondition;
            return that.hasFilterCondition(filterCondition);
        },

        addFilter: function(item) {
            var that = this;
            if (!that.hasFilter(item)) {
                that.aFilters.push(item);
            }
        },

        removeFilter: function(item) {
            var that = this;
            var filterCondition = item.filterCondition;
            for (var i = 0; i < that.aFilters.length; i++) {
                if (that.aFilters[i].filterCondition.equals && that.aFilters[i].filterCondition.equals(filterCondition)) {
                    that.aFilters.splice(i, 1);
                    return;
                }
            }
        },

        changeFilterAdvaced: function(item, bAdvanced) {
            var that = this;
            var filterCondition = item.filterCondition;
            for (var i = 0; i < that.aFilters.length; i++) {
                if (that.aFilters[i].filterCondition.equals && that.aFilters[i].filterCondition.equals(filterCondition)) {
                    that.aFilters[i].advanced = bAdvanced;
                    return;
                }
            }
        }

    });

})(window);
