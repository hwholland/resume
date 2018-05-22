/* global $,jQuery,window, document */
// iteration 0 s

(function(global) {
    "use strict";
    /* eslint no-warning-comments:0 */

    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchHelper');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchResultListFormatter');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchFacetsFormatter');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchTabStripsFormatter');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.FacetItem');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.suggestions.SuggestionHandler');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchIntentsResolver');
    jQuery.sap.require('sap.ushell.renderers.fiori2.search.SearchConfiguration');

    var sap = global.sap;
    var SearchHelper = sap.ushell.renderers.fiori2.search.SearchHelper;
    var SearchResultListFormatter = sap.ushell.renderers.fiori2.search.SearchResultListFormatter;
    var TabStripsFormatter = sap.ushell.renderers.fiori2.search.SearchTabStripsFormatter.Formatter;
    var SuggestionHandler = sap.ushell.renderers.fiori2.search.suggestions.SuggestionHandler;
    var SearchConfiguration = sap.ushell.renderers.fiori2.search.SearchConfiguration;

    // =======================================================================
    // Global singleton method to get search model
    // ensure only one model instance available
    // =======================================================================
    sap.ushell.renderers.fiori2.search.getModelSingleton = function() {
        if (!sap.ushell.renderers.fiori2.search.oModel) {
            sap.ushell.renderers.fiori2.search.oModel =
                new sap.ushell.renderers.fiori2.search.SearchModel();
        }
        return sap.ushell.renderers.fiori2.search.oModel;
    };

    // =======================================================================
    // search model
    // =======================================================================
    sap.ui.model.json.JSONModel.extend("sap.ushell.renderers.fiori2.search.SearchModel", {

        constructor: function(properties) {
            /* eslint no-empty:0 */
            var that = this;
            properties = properties || {};

            // call base class constructor
            sap.ui.model.json.JSONModel.prototype.constructor.apply(that, []);

            // get search configuration
            that.config = new SearchConfiguration();

            // set size limit in order to allow drop down list boxes with more than 100 entries
            that.setSizeLimit(200);

            // get sina
            that.sina = sap.ushell.Container.getService("Search").getSina();

            // create sina suggestion query
            this.suggestionQuery = this.sina.createSuggestionQuery();

            // create suggestions handler
            that.suggestionHandler = new SuggestionHandler({
                model: this
            });

            // create sina query for search for business objects (normal search)
            that.query = that.sina.createPerspectiveQuery({
                templateFactsheet: true
            });
            if (that.config.multiSelect) {
                that.query.setIncludeFacetsWithFilters(true);
            }

            // create a ui filter to which the ui5 controls will be bound
            that.setProperty('/uiFilter', that.sina.createFilter());

            // reset filter conditions
            that.resetFilterConditions(false);

            // create standard datasources like ALL and APPS
            that.createAllAndAppDataSource();

            // decorate search methods (decorator prevents request overtaking)
            that.query.getResultSet = SearchHelper.refuseOutdatedRequests(that.query.getResultSet, 'search'); // normal search
            that.searchApplications = SearchHelper.refuseOutdatedRequests(that.searchApplications, 'search'); // app search

            // formatters
            that.oFacetFormatter = new sap.ushell.renderers.fiori2.search.SearchFacetsFormatter();
            that.tabStripFormatter = new TabStripsFormatter(that.allDataSource);
            that.dataSourceTree = that.tabStripFormatter.tree;

            // initial values for boTop and appTop
            that.pageSize = 10;
            that.appTopDefault = 20;
            that.boTopDefault = that.pageSize;

            // init the properties
            // TODO always use main result list (also for pure app results)

            that.setProperty('/isQueryInvalidated', true); // force request if query did not change
            that.setProperty('/isBusy', false); //show a busy indicator?
            that.setProperty('/tableColumns', []); // columns of table design
            that.setProperty('/tableSortItems', []); // sort items of table design
            that.setProperty('/results', []); // combined result list: apps + bos
            that.setProperty('/appResults', []); // applications result list
            that.setProperty('/boResults', []); // business object result list
            that.setProperty('/count', 0);
            that.setProperty('/boCount', 0);
            that.setProperty('/appCount', 0);
            that.setProperty('/facets', []);
            that.setProperty('/dataSources', [that.allDataSource, that.appDataSource]);
            that.setProperty('/persoServiceProviders', []); // persoServiceProviders of connectors
            that.setProperty('/businessObjSearchEnabled', true);
            that.setProperty("/initializingObjSearch", false);
            that.setProperty('/suggestions', []);
            that.setProperty('/resultToDisplay', "searchResultList"); // type of search result to display
            that.setProperty('/displaySwitchVisibility', false); // visibility of display switch tap strip
            that.setProperty('/documentTitle', 'Search');
            that.setProperty('/top', that.boTopDefault);
            that.setProperty('/orderBy', {});
            that.setProperty('/facetVisibility', SearchHelper.loadFilterButtonStatus()); // visibility of facet panel
            that.setProperty('/focusIndex', 0);
            that.setProperty('/fuzzy', false);
            that.setProperty('/errors', []);
            that.resetDataSource(false);

            that.setProperty('/multiSelectionAvailable', false); //
            that.setProperty('/multiSelectionEnabled', false); //
            that.setProperty('/multiSelection/actions', []); //

            // initialize enterprise search
            that.initBusinessObjSearch();

            // usage analytics
            try {
                that.analytics = sap.ushell.Container.getService("UsageAnalytics");
            } catch (e) {}
            if (!that.analytics) {
                that.analytics = {
                    logCustomEvent: function() {
                        //console.log('-->',arguments[0],arguments[1],arguments[2]);
                    }
                };
            }
        },

        // ################################################################################
        // Initialization:
        // ################################################################################

        initBusinessObjSearch: function() {
            var that = this;

            if (that._initBusinessObjSearchProm) {
                return that._initBusinessObjSearchProm;
            }
            that._initBusinessObjSearchProm = $.Deferred();

            // check whether enterprise search is configured
            if (!that.config.searchBusinessObjects) {
                that.setDataSource(that.appDataSource, false);
                that.setProperty('/businessObjSearchEnabled', false);
                that.setProperty('/facetVisibility', false);
                return that._initBusinessObjSearchProm.resolve();
            }

            that.setProperty("/initializingObjSearch", true);

            var dummyDataSourceForLoadingPhase = {
                labelPlural: sap.ushell.resources.i18n.getText("genericLoading"),
                enabled: false,
                key: that.getProperty("/uiFilter/dataSource/key"), //Workaround, so that we don't overwrite the key of the ALL datasource
                equals: function() {
                    return true;
                }
            };

            that.setProperty("/dataSource", dummyDataSourceForLoadingPhase);
            that.setProperty("/dataSources", [dummyDataSourceForLoadingPhase]);
            // that.setProperty("/uiFilter/dataSource/key", dummyDataSourceForLoadingPhase.key);

            that.sina.sinaSystem().getServerInfo().done(function(serverInfo) {
                that.serverInfo = serverInfo;

                if (that._isBusinessObjSearchEnabledOnBackend(serverInfo)) {
                    that.loadDataSources().done(function() {
                        that.setProperty("/initializingObjSearch", false);
                        if (!sap.ushell.renderers.fiori2.search.SearchShellHelper) {
                            jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchShellHelper");
                        }
                        //sap.ushell.renderers.fiori2.search.SearchShellHelper.focusInputField();
                        that._initBusinessObjSearchProm.resolve();
                    });
                } else {
                    that.setDataSource(that.appDataSource, false);
                    that.setProperty('/businessObjSearchEnabled', false);
                    that.setProperty('/facetVisibility', false);
                    that.setProperty('/defaultDataSource', that.appDataSource);
                    that.setProperty("/initializingObjSearch", false);
                    that.config.searchBusinessObjects = false;
                    that._initBusinessObjSearchProm.resolve();
                }
            }).fail(function() {
                that.setDataSource(that.appDataSource, false);
                that.setProperty('/businessObjSearchEnabled', false);
                that.setProperty('/facetVisibility', false);
                that.setProperty("/initializingObjSearch", false);
                that.config.searchBusinessObjects = false;
                that._initBusinessObjSearchProm.resolve();
            });

            return that._initBusinessObjSearchProm;
        },

        _isBusinessObjSearchEnabledOnBackend: function(serverInfo) {
            serverInfo = serverInfo.rawServerInfo;
            for (var i = 0; i < serverInfo.Services.length; ++i) {
                var service = serverInfo.Services[i];
                if (service.Service.toLowerCase() == 'search') {
                    return true;
                }
            }

            return false;
        },

        // ################################################################################
        // Get the state of things:
        // ################################################################################

        isBusinessObjSearchConfigured: function() {
            try {
                var config = window['sap-ushell-config'].renderers.fiori2.componentData.config;
                return config.searchBusinessObjects !== 'hidden';
            } catch (e) {
                return true;
            }
        },

        isBusinessObjSearchEnabled: function() {
            // TODO: how does this differ from isBusinessObjSearchConfigured() above?
            return this.getProperty('/businessObjSearchEnabled');
        },

        // ################################################################################
        // Getter/Setter:
        // ################################################################################

        setProperty: function(name, values, oContext, bAsyncUpdate) {
            var that = this;
            var res = sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, arguments);
            switch (name) {
                case '/boResults':
                case '/appResults':
                    that.calculateResultList();
                    break;
                case '/appCount':
                case '/boCount':
                    res = that.setProperty('/count', that.getProperty('/appCount') + that.getProperty('/boCount'));
                    break;

                default:
                    break;
            }
            return res;
        },

        setFuzzy: function(fuzzy) {
            var fuzzyOption = 'Fuzzy';
            var requestedEntities = this.query.getRequestedEntities().slice(0);
            var indexOfFuzzy = requestedEntities.indexOf(fuzzyOption);
            if (fuzzy === true) {
                if (indexOfFuzzy === -1) {
                    requestedEntities.push(fuzzyOption);
                }
            } else if (indexOfFuzzy > -1) {
                requestedEntities.splice(indexOfFuzzy, 1);
            }
            // important, setRequestedEntities reset resultsets
            this.query.setRequestedEntities(requestedEntities);
            this.setProperty("/fuzzy", fuzzy);
        },

        // TODO move to datasource
        getSearchBoxTerm: function() {
            return this.getProperty('/uiFilter/searchTerms');
        },

        setSearchBoxTerm: function(searchTerm, fireQuery) {
            var that = this;
            var searchTermTrimLeft = searchTerm.replace(/^\s+/, ""); // TODO rtl
            this.setProperty('/uiFilter/searchTerms', searchTermTrimLeft);
            if (searchTermTrimLeft.length === 0) {
                return; //TODO ??
            }
            if (fireQuery || fireQuery === undefined) {
                that._firePerspectiveQuery();
            }
        },

        getLastSearchTerm: function() {
            return this.query.getSearchTerms();
        },

        setFacetVisibility: function(visibility, fireQuery) {

            // set new value
            this.setProperty('/facetVisibility', visibility);

            // Set button status in sap storage
            SearchHelper.saveFilterButtonStatus(visibility);

            // fire query
            if ((fireQuery || fireQuery === undefined) && visibility) {
                this._firePerspectiveQuery();
            }
        },

        getFacetVisibility: function() {
            return this.getProperty('/facetVisibility');
        },

        getTop: function() {
            return this.getProperty('/top');
        },

        setTop: function(top, fireQuery) {
            this.setProperty('/top', top);
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true
                });
            }
        },

        resetTop: function() {
            this.setProperty('/focusIndex', 0);
            if (this.isAppCategory()) {
                this.setTop(this.appTopDefault, false);
            } else {
                this.setTop(this.boTopDefault, false);
            }
        },

        getOrderBy: function() {
            return this.getProperty('/orderBy');
        },

        setOrderBy: function(orderBy, fireQuery) {
            this.setProperty('/orderBy', orderBy);
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true
                });
            }
        },

        resetOrderBy: function(fireQuery) {
            this.setProperty('/orderBy', {});
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true
                });
            }
        },

        isEqualOrderBy: function(orderBy1, orderBy2) {
            if (jQuery.isEmptyObject(orderBy1) && jQuery.isEmptyObject(orderBy2)) {
                return true;
            } else if (orderBy1.orderBy === orderBy2.orderBy && orderBy1.sortOrder === orderBy2.sortOrder) {
                return true;
            } else {
                return false;
            }
        },

        getDocumentTitle: function() {
            var searchTerm = this.getSearchBoxTerm();
            var dataSourceLabel = this.getDataSource().label;
            var title;
            if (this.getDataSource().equals(this.allDataSource)) {
                title = sap.ushell.resources.i18n.getText('searchTileTitleProposalAll', [searchTerm]);
            } else {
                title = sap.ushell.resources.i18n.getText('searchTileTitleProposal', [searchTerm, dataSourceLabel]);
            }
            return title;
        },

        resetQuery: function() {
            SearchHelper.hasher.reset();
            this.resetTop();
            this.setSearchBoxTerm('');
            this.resetDataSource(false);
            this.resetFilterConditions(false);
            this.query.resetFilterConditions();
            this.query.setSearchTerms('random-jgfhfdskjghrtekjhg');
            this.setProperty('/facets', []);
            this.setProperty('/results', []);
            this.setProperty('/appResults', []);
            this.setProperty('/boResults', []);
            this.setProperty('/count', 0);
            this.setProperty('/boCount', 0);
            this.setProperty('/appCount', 0);
        },

        // ################################################################################
        // Everything Datasource:
        // ################################################################################

        createAllAndAppDataSource: function() {
            // all data source
            this.allDataSource = this.sina.getRootDataSource();
            this.allDataSource.label = sap.ushell.resources.i18n.getText("label_all");
            this.allDataSource.labelPlural = sap.ushell.resources.i18n.getText("label_all");

            // app datasource (create sina base class instance)
            //this.appDataSource = new sap.bc.ina.api.sina.base.datasource.DataSource({
            this.appDataSource = this.sina.createDataSource({
                objectName: "$$APPS$$",
                label: sap.ushell.resources.i18n.getText("label_apps"),
                labelPlural: sap.ushell.resources.i18n.getText("label_apps"),
                type: 'Apps',
                name: 'Apps',
                sina: this.sina
            });

        },

        loadDataSources: function() {
            var that = this;

            var prom = $.Deferred();

            that.getServerDataSources().done(function(dataSources) {
                // dataSources = [];
                if (!jQuery.isArray(dataSources) || dataSources.length == 0) {
                    that.setDataSource(that.appDataSource, false);
                    that.setProperty('/businessObjSearchEnabled', false);
                    that.setProperty('/facetVisibility', false);
                    that.setProperty('/defaultDataSource', that.appDataSource);
                    that.config.searchBusinessObjects = false;
                    prom.resolve();
                    return;
                }
                dataSources = dataSources.slice();

                //                // build personalizer for each connector
                //                // used by table personal controller
                //                var persoServiceProviders = [];
                //                for (var i = 0; i < dataSources.length; i++) {
                //                    var datasourceString = dataSources[i].key.substring(dataSources[i].key.lastIndexOf('/') + 1);
                //                    var newPersId = {
                //                        container: "PC-" + datasourceString,
                //                        item: "PI-" + datasourceString
                //                    };
                //                    var newProvider = sap.ushell.Container.getService("Personalization").getPersonalizer(newPersId);
                //                    persoServiceProviders.push({
                //                        key: dataSources[i].key,
                //                        provider: newProvider
                //                    });
                //                }
                //                that.setProperty("/persoServiceProviders", persoServiceProviders);

                dataSources.splice(0, 0, that.appDataSource);
                dataSources.splice(0, 0, that.allDataSource);
                dataSources = that._concatenateLabelAndRemoteSystem(dataSources);
                that.setProperty("/dataSources", dataSources);
                that.updateDataSourceList(that.getDataSource()); // ensure that current ds is in the list (may be category)
                that.setProperty("/searchTermPlaceholder", that.calculatePlaceholder());
                // workaround: force dropdown listbox to update
                var dsKey = that.getProperty('/uiFilter/dataSource/key');
                that.setProperty('/uiFilter/dataSource/key', '');
                that.setProperty('/uiFilter/dataSource/key', dsKey);
                prom.resolve();
            }).fail(function() {
                that.setDataSource(that.appDataSource, false);
                that.setProperty('/businessObjSearchEnabled', false);
                that.setProperty('/facetVisibility', false);
                that.setProperty('/defaultDataSource', that.appDataSource);
                that.config.searchBusinessObjects = false;
                prom.resolve();
            });
            return prom;
        },

        resetDataSource: function(fireQuery) {
            if (this.getProperty('/businessObjSearchEnabled')) {
                this.setDataSource(this.allDataSource, fireQuery);
            } else {
                this.setDataSource(this.appDataSource, fireQuery);
            }
        },

        isAllCategory: function() {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ds.equals(this.allDataSource);
        },

        isOtherCategory: function() {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ds.getType().toLowerCase() === "category" && !this.isAllCategory();
        },

        isAppCategory: function() {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ds.equals(this.appDataSource);
        },

        getDataSource: function() {
            return this.getProperty("/uiFilter/dataSource");
        },

        setDataSource: function(dataSource, fireQuery) {
            this.updateDataSourceList(dataSource);
            this.getProperty("/uiFilter").setDataSource(dataSource);
            this.setProperty("/searchTermPlaceholder", this.calculatePlaceholder());
            this.resetTop();
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }
        },

        getServerDataSources: function() {
            var that = this;
            if (that.getDataSourcesDeffered) {
                return that.getDataSourcesDeffered;
            }
            that.getDataSourcesDeffered = that.sina.getDataSources().then(function(dataSources) {
                // filter out categories
                return jQuery.grep(dataSources, function(dataSource) {
                    return dataSource.getType() !== 'Category';
                });
            });
            return that.getDataSourcesDeffered;
        },

        // ################################################################################
        // Filter conditions:
        // ################################################################################

        notifyFilterChanged: function() {
            // notify ui about changed filter, data binding does not react on changes below
            // conditions, so this is done manually
            jQuery.each(this.aBindings, function(index, binding) {
                if (binding.sPath === '/uiFilter/defaultConditionGroup/conditions') {
                    binding.checkUpdate(true);
                }
            });
        },

        addFilterCondition: function(filterCondition, fireQuery) {
            if (filterCondition.attribute ||  filterCondition.conditions) {
                this.getProperty("/uiFilter").addFilterCondition(filterCondition);
            } else { //or a datasource?
                this.setDataSource(filterCondition, false);
            }

            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }

            this.notifyFilterChanged();
        },

        removeFilterCondition: function(filterCondition, fireQuery) {

            if (filterCondition.attribute ||  filterCondition.conditions) {
                this.getProperty("/uiFilter").removeFilterCondition(filterCondition);
            } else {
                this.setDataSource(filterCondition, false);
            }

            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }

            this.notifyFilterChanged();
        },

        resetFilterConditions: function(fireQuery) {
            this.getProperty("/uiFilter").resetFilterConditions();
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }
            this.notifyFilterChanged();
        },

        // ################################################################################
        // Suggestions:
        // ################################################################################

        doSuggestion: function() {
            this.suggestionQuery.setFilter(this.getProperty('/uiFilter').clone());
            this.suggestionHandler.doSuggestion();
        },

        abortSuggestions: function() {
            this.suggestionHandler.abortSuggestions();
        },

        // ################################################################################
        // Perspective and App Search:
        // ################################################################################

        _firePerspectiveQuery: function(deserializationIn, preserveFormerResultsIn) {
            var that = this;
            this.setProperty('/isBusy', true);
            this.initBusinessObjSearch().then(function() {
                that._doFirePerspectiveQuery(deserializationIn, preserveFormerResultsIn);
            });
        },

        _doFirePerspectiveQuery: function(deserializationIn, preserveFormerResultsIn) {
            var that = this;

            var deserialization, preserveFormerResults;

            if (jQuery.isPlainObject(deserializationIn)) {
                deserialization = deserializationIn.deserialization;
                preserveFormerResults = deserializationIn.preserveFormerResults;
            } else {
                deserialization = deserializationIn ? deserializationIn : undefined;
                preserveFormerResults = preserveFormerResultsIn ? preserveFormerResultsIn : undefined;
            }



            // decide whether to fire the query
            var uiFilter = this.getProperty('/uiFilter');
            if (uiFilter.equals(this.query.getFilter()) &&
                this.getTop() === this.query.getTop() &&
                this.isEqualOrderBy(this.getOrderBy(), this.query.getOrderBy()) &&
                this.calculateRequestsEntities().length === this.query.requestedEntities.length &&
                !this.getProperty('/isQueryInvalidated')) {
                that.setProperty('/isBusy', false);
                return;
            }

            // reset orderby if search term changes or datasource
            //            if (!deserialization) {
            if ((this.query.getFilter().getDataSource() && !uiFilter.getDataSource().equals(this.query.getFilter().getDataSource())) ||
                (this.query.getFilter().getSearchTerms() && uiFilter.getSearchTerms() !== this.query.getFilter().getSearchTerms())) {
                this.resetOrderBy(false);
            }
            //            }

            // reset top if search term changes or filter condition or datasource
            if (!deserialization) {
                if (uiFilter.getSearchTerms() !== this.query.getFilter().getSearchTerms() ||
                    !uiFilter.defaultConditionGroup.equals(this.query.getFilter().defaultConditionGroup) ||
                    !uiFilter.getDataSource().equals(this.query.getFilter().getDataSource())) {
                    this.resetTop();
                }
            }

            // reset tabstrip formatter if search term changes or filter condition
            if (uiFilter.getSearchTerms() !== this.query.getFilter().getSearchTerms() ||
                !uiFilter.defaultConditionGroup.equals(this.query.getFilter().defaultConditionGroup)) {
                this.tabStripFormatter.invalidate(this.getDataSource());
            }

            // query invalidated by UI -> force to fire query by reseting result set
            if (this.getProperty('/isQueryInvalidated') === true) {
                this.query.resetResultSet();
                this.setProperty('/isQueryInvalidated', false);
            }

            // update query (app search also uses this.query despite search regest is not controlled by sina)
            this.query.setFilter(this.getProperty('/uiFilter').clone());
            this.query.setTop(this.getTop());
            this.query.setOrderBy(this.getOrderBy());
            this.query.setRequestedEntities(this.calculateRequestsEntities());
            this.cleanErrors();

            this.setProperty("/queryFilter", this.query.getFilter());

            // notify view
            sap.ui.getCore().getEventBus().publish("allSearchStarted");

            // abort suggestions
            this.abortSuggestions();

            // abort old async running search calls
            SearchHelper.abortRequests('search');

            // calculate visibility flags for apps and combined result list
            this.calculateVisibility();

            // update url silently
            this.updateSearchURLSilently();

            // log search request
            this.analytics.logCustomEvent('FLP: Search', 'Search', [this.getProperty('/uiFilter/searchTerms'),
                this.getProperty('/uiFilter/dataSource').key
            ]);

            // wait for all subsearch queries
            var dataSource = this.getDataSource();
            this.setProperty('/isBusy', true);
            jQuery.when.apply(null, [this.normalSearch(preserveFormerResults), this.appSearch()])
                .done(function() {
                    that.setProperty('/tabStrips', that.tabStripFormatter.format(dataSource, that.perspective, that));
                    that.setProperty('/facets', that.oFacetFormatter.getFacets(dataSource, that.perspective, that));
                })
                .always(function() {
                    document.title = that.getDocumentTitle();
                    that.setProperty('/isBusy', false);
                    sap.ui.getCore().getEventBus().publish("allSearchFinished");
                });
        },

        calculateRequestsEntities: function() {
            if (this.getDataSource().getType() === 'Category' ||  this.getFacetVisibility()) {
                // tab strip needs data from data source facet if a category is selected because
                // then the tab strips show also siblings. If connector is selected, the tab strip
                // only shows All and the connector.
                return ['SearchResults', 'Facets', 'TotalCount'];
            } else {
                return ['SearchResults', 'TotalCount'];
            }
        },

        appSearch: function() {
            var that = this;

            this.setProperty("/appResults", []);
            this.setProperty("/appCount", 0);

            if (!this.isAllCategory() && !this.isAppCategory()) {
                // 1. do not search
                return jQuery.when(true);
            }

            // calculate top
            var top = this.query.getFilter().getDataSource().equals(this.allDataSource) ? this.appTopDefault : this.query.getTop();

            // 2. search
            return this.searchApplications(this.query.getFilter().getSearchTerms(), top, 0).then(function(oResult) {
                // 1.1 search call succeeded
                that.setProperty("/appCount", oResult.totalResults);
                that.setProperty("/appResults", oResult.getElements());
            }, function() {
                // 1.2 search call failed
                return jQuery.when(true); // make deferred returned by "then" resolved
            });
        },

        searchApplications: function(searchTerm, top, skip) {
            return sap.ushell.Container.getService("Search").queryApplications({
                searchTerm: searchTerm,
                searchInKeywords: true,
                top: top,
                skip: skip
            });
        },

        normalSearch: function(preserveFormerResults) {
            var that = this;

            if (!preserveFormerResults) {
                that.resetAndDisableMultiSelection();
            }

            if (!that.isBusinessObjSearchEnabled() || that.isAppCategory()) {
                // 1. do not search
                this.setProperty("/boResults", []);
                this.setProperty("/boCount", 0);
                return jQuery.when(true);
            }

            // 2.search
            that.setFuzzy(false);
            return this.query.getResultSet().then(function(perspective) {
                    // 1.0 if no result and fuzzy is not switched on, fire the query again with fuzzy
                    if (perspective.getSearchResultSet().totalcount < 1 && that.serverInfo.services.Search.capabilities['OptionFuzzy']) {
                        that.setProperty("/boResults", []);
                        that.setProperty("/boCount", 0);
                        that.setFuzzy(true);
                        return that.query.getResultSet().then(function(perspective2) {
                            that.perspective = perspective2;
                            return that._afterSearchPrepareResultList(that.perspective, preserveFormerResults);
                        }, function(error) {
                            // 1.2 search failed
                            that.normalSearchErrorHandling(error);
                            that.perspective = null;
                            return jQuery.when(true); // make deferred returned by "then" resolved
                        });
                    }
                    // 1.1 search succeeded
                    that.perspective = perspective;
                    return that._afterSearchPrepareResultList(that.perspective, preserveFormerResults);
                },
                function(error) {
                    // 1.2 search failed
                    that.normalSearchErrorHandling(error);
                    that.perspective = null;
                    return jQuery.when(true); // make deferred returned by "then" resolved
                });

        },


        _afterSearchPrepareResultList: function(perspective, preserveFormerResults) {
            var that = this;

            var i;

            var formerResults = [];
            if (preserveFormerResults) {
                var _formerResults = that.getProperty("/boResults");
                for (i = 0; i < _formerResults.length; i++) {
                    if (_formerResults[i].expanded || _formerResults[i].selected) {
                        formerResults.push(_formerResults[i]);
                    }
                }
            }

            that.setProperty("/boResults", []);
            that.setProperty("/boCount", 0);

            var formatter = new SearchResultListFormatter();
            var newResults = formatter.format(perspective.getSearchResultSet(), this.query.filter.searchTerms);

            // prepare table columns and sort items
            if (newResults[0]) {
                var columns = [];
                var sortItems = [];
                var itemattributes = newResults[0].itemattributes;
                for (i = 0; i < itemattributes.length; i++) {
                    if (itemattributes[i].key !== undefined) {
                        var key = escape(itemattributes[i].key).replace(/[^\w\s]/gi, '-');
                        columns.push({
                            "name": itemattributes[i].name,
                            "key": key,
                            "index": i
                        });

                        if (i === 0) {
                            sortItems.push({
                                "name": sap.ushell.resources.i18n.getText("defaultRank"),
                                "key": "ushellSearchDefaultSortItem",
                                "selected": jQuery.isEmptyObject(that.getProperty("/orderBy"))
                            });
                        } else {
                            sortItems.push({
                                "name": itemattributes[i].name,
                                "key": key,
                                "selected": that.getProperty("/orderBy").orderBy === key
                            });
                        }
                    }
                }
                that.setProperty("/tableColumns", columns);
                that.setProperty("/tableSortItems", sortItems);
            }

            var intentsResolver = new sap.ushell.renderers.fiori2.search.SearchIntentsResolver(that);
            var intentsProm = intentsResolver.resolveIntents(newResults);

            intentsProm.done(function(args) { //TODO: error handling

                if (formerResults && formerResults.length > 0) {
                    var ResultElementKeyStatus = that.sina.ResultElementKeyStatus;

                    var itemsWithErrors = [];

                    for (i = 0; i < newResults.length; i++) {
                        var newResult = newResults[i];
                        if (newResult.keystatus === ResultElementKeyStatus.OK) {
                            for (var j = 0; j < formerResults.length; j++) {
                                var formerResult = formerResults[j];
                                if (formerResult.keystatus === ResultElementKeyStatus.OK && formerResult.key === newResult.key) {
                                    newResult.selected = formerResult.selected;
                                    newResult.expanded = formerResult.expanded;
                                    formerResults.splice(j, 1);
                                    break;
                                }
                            }
                        } else {
                            itemsWithErrors.push(newResult);
                        }
                    }
                    if (itemsWithErrors.length > 0) {
                        var listOfFaultyDatasources = [];
                        var listOfFaultyDatasourcesString = ""
                        for (i = 0; i < itemsWithErrors.length; i++) {
                            var dataSourceKey = itemsWithErrors[i].dataSource.key;
                            if (jQuery.inArray(dataSourceKey, listOfFaultyDatasources) < 0) {
                                listOfFaultyDatasources.push(dataSourceKey);
                                listOfFaultyDatasourcesString += dataSourceKey + "\n";
                            }
                        }
                        that.pushError({
                            type: "warning",
                            title: sap.ushell.resources.i18n.getText("preserveFormerResultErrorTitle"),
                            description: sap.ushell.resources.i18n.getText("preserveFormerResultErrorDetails", listOfFaultyDatasourcesString)
                        });
                    }
                }

                var dataSource = that.getDataSource();
                if (dataSource.getType().toLowerCase() === "businessobject") {
                    var semanticObjectTypes = [];
                    for (i = 0; i < newResults.length; i++) {
                        var result = newResults[i];
                        var semanticObjectType = result.semanticObjectType;
                        if (!semanticObjectType) {
                            semanticObjectTypes = [];
                            break;
                        }
                        if (jQuery.inArray(semanticObjectType, semanticObjectTypes) == -1) {
                            semanticObjectTypes.push(semanticObjectType);
                        }
                    }
                    if (semanticObjectTypes.length == 1) {
                        dataSource.semanticObjectType = semanticObjectTypes[0];
                    } else if (semanticObjectTypes.length > 1) {
                        dataSource.semanticObjectTypes = semanticObjectTypes;
                    }
                }

                //move footer to control //TODO
                //Add footer
                //There is more
                if (newResults.length < perspective.getSearchResultSet().totalcount) {
                    var resultListFooter = {};
                    resultListFooter.type = "footer";
                    newResults.push(resultListFooter);
                }

                that.setProperty("/boCount", perspective.getSearchResultSet().totalcount);
                that.setProperty("/boResults", newResults);

                that.enableOrDisableMultiSelection();
            });

            return intentsProm;
        },

        // ################################################################################
        // Helper functions:
        // ################################################################################

        // handle multi-selection availability
        // ===================================================================
        resetAndDisableMultiSelection: function() {
            this.setProperty("/multiSelectionAvailable", false);
            this.setProperty("/multiSelectionEnabled", false);
        },

        // handle multi-selection availability
        // ===================================================================
        enableOrDisableMultiSelection: function() {
            var dataSource = this.getDataSource();
            var dataSourceConfig = this.config.getDataSourceConfig(dataSource);
            /* eslint new-cap:0 */
            var selectionHandler = new dataSourceConfig.searchResultListSelectionHandlerControl();
            if (selectionHandler) {
                this.setProperty("/multiSelectionAvailable", selectionHandler.isMultiSelectionAvailable());
            } else {
                this.setProperty("/multiSelectionAvailable", false);
            }
        },

        _concatenateLabelAndRemoteSystem: function(dataSources) {
            var that = this;

            var filteredDataSources = dataSources;
            for (var i = 0; i < filteredDataSources.length - 1; i++) {
                // datasource has nonempty remote system & label hasn't concatenated it already
                if (filteredDataSources[i].remoteSystem !== undefined && filteredDataSources[i].remoteSystem !== "" && !that._endWith(filteredDataSources[i].label, filteredDataSources[i].remoteSystem)) {
                    filteredDataSources[i].label = filteredDataSources[i].label + ' ' + sap.ushell.resources.i18n.getText("textIn") + ' ' + filteredDataSources[i].remoteSystem;
                    filteredDataSources[i].labelPlural = filteredDataSources[i].labelPlural + ' ' + sap.ushell.resources.i18n.getText("textIn") + ' ' + filteredDataSources[i].remoteSystem;
                }
            }
            return filteredDataSources;
        },

        _endWith: function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },

        calculatePlaceholder: function() {
            var that = this;
            if (that.isAllCategory()) {
                return sap.ushell.resources.i18n.getText("search");
            } else {
                return sap.ushell.resources.i18n.getText("searchInPlaceholder", that.getDataSource().labelPlural); //TODO plural?
            }
        },

        updateDataSourceList: function(newDataSource) {
            var dataSources = this.getProperty('/dataSources');
            // delete old categories, until all data source
            while (dataSources.length > 0 && !dataSources[0].equals(this.allDataSource)) {
                dataSources.shift();
            }
            // all and apps are surely included in existing list -> return
            if (newDataSource.equals(this.allDataSource) || newDataSource.equals(this.appDataSource)) {
                return;
            }
            // all connectors (!=category) are included in existing list -> return
            if (newDataSource && newDataSource.key) {
                if (newDataSource.key.indexOf('~') >= 0) {
                    return;
                }
            }
            // check if newDataSource exists in existing list -> return
            for (var i = 0; i < dataSources.length; ++i) {
                var dataSource = dataSources[i];
                if (dataSource.equals(newDataSource)) {
                    return;
                }
            }
            // add datasource
            dataSources.unshift(newDataSource);
            this.setProperty('/dataSources', dataSources);
        },

        invalidateQuery: function() { // TODO naming?
            this.setProperty('/isQueryInvalidated', true);
        },

        autoStartApp: function() {
            var that = this;
            if (that.getProperty("/appCount") && that.getProperty("/appCount") === 1 && that.getProperty("/count") && that.getProperty("/count") === 1) {
                var aApps = that.getProperty("/appResults");
                if (aApps && aApps.length > 0 && aApps[0] && aApps[0].url && that.getProperty('/uiFilter/searchTerms') && aApps[0].tooltip && that.getProperty('/uiFilter/searchTerms').toLowerCase().trim() === aApps[0].tooltip.toLowerCase().trim()) {
                    if (aApps[0].url[0] === '#') {
                        window.location.href = aApps[0].url;
                    } else {
                        window.open(aApps[0].url, '_blank');
                    }
                }
            }
        },

        getResultToDisplay: function() {
            return this.getProperty('/resultToDisplay');
        },

        setResultToDisplay: function(type) {
            this.setProperty('/resultToDisplay', type);
        },

        calculateVisibility: function() {
            var that = this;
            /* 3 types of resultToDisplay:
             * "appSearchResult": app search result
             * "searchResultList": all or Category search result
             * "searchResultTable": connector search result
             */
            if (that.isAppCategory()) {
                // search in app
                that.setResultToDisplay("appSearchResult");
                that.setProperty('/displaySwitchVisibility', false);
            } else if (that.isAllCategory() || that.isOtherCategory()) {
                // search in all or category
                that.setResultToDisplay("searchResultList");
                that.setProperty('/displaySwitchVisibility', false);
            } else {
                // search in datasource
                var resultToDisplay = that.getResultToDisplay();
                if (!(resultToDisplay === "searchResultList" || resultToDisplay === "searchResultTable")) {
                    that.setResultToDisplay("searchResultList");
                }
                that.setProperty('/displaySwitchVisibility', true);
            }
        },

        calculateResultList: function() {
            // init
            var that = this;
            var results = [];

            // add bo results
            var boResults = that.getProperty('/boResults');
            if (boResults && boResults.length) {
                results.push.apply(results, boResults);
            }

            // add app results (tiles)
            var tiles = that.getProperty('/appResults');
            if (tiles && tiles.length > 0) {
                var tilesItem = {
                    type: 'appcontainer',
                    tiles: tiles
                };
                if (results.length > 0) {
                    if (results.length > 3) {
                        results.splice(3, 0, tilesItem);
                    } else {
                        //results.splice(0, 0, tilesItem);
                        results.push(tilesItem);
                    }
                } else {
                    results = [tilesItem];
                }
            }

            // set property
            sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, ['/results', results]);
        },

        // ################################################################################
        // Error handling:
        // ################################################################################

        getDebugInfo: function() {
            var text = ['\n'];
            if (this.serverInfo) {
                text.push('Search Backend System:');
                text.push('System:' + this.serverInfo.systemid);
                text.push('Client:' + this.serverInfo.sapclient);
                text.push('');
            }
            text.push('See also Enterprise Search Setup Documentation:');
            text.push('http://help.sap.com/saphelp_uiaddon10/helpdata/en/57/7d77c891954c21a19c242694e83177/frameset.htm');
            return text.join('\n');
        },

        getErrors: function() {
            return this.getProperty('/errors');
        },

        cleanErrors: function() {
            this.setProperty('/errors', []);
        },

        /**
         * push an error object to error array
         * @param {object} error object
         */
        pushError: function(error) {
            var that = this;
            var errors = this.getProperty('/errors');
            errors.push(error);
            that.setProperty('/errors', errors);
        },

        normalSearchErrorHandling: function(error) {
            //these ina service errors shall not appear as popups:
            var ignoredErrors = ["ESH_FED_MSG016"]; //<- No authorization for the given list of connectors,
            //or no connectors active (i.e. only app search is used)

            if (error) {
                if (error.status === 500) {
                    jQuery.sap.log.error(error.responseText);
                    this.pushError({
                        type: "error",
                        title: error.statusText,
                        description: error.responseText + this.getDebugInfo()
                    });
                }

                if (error.responseText) {
                    var showErrorPopup = true;
                    var inaErr = jQuery.parseJSON(error.responseText);
                    var errMsg = '';
                    var detailMsg = '';
                    if (inaErr.Error) {
                        if (inaErr.Error.Message) {
                            errMsg += '' + inaErr.Error.Message;
                        }
                        if (inaErr.Error.Code) {
                            errMsg += ' (Code ' + inaErr.Error.Code + ').';
                        }
                    }
                    if (inaErr.ErrorDetails) {
                        detailMsg += '';
                        for (var i = 0; i < inaErr.ErrorDetails.length; i++) {
                            detailMsg += inaErr.ErrorDetails[i].Message + ' (Code ' + inaErr.ErrorDetails[i].Code + ')';
                            if (ignoredErrors.indexOf(inaErr.ErrorDetails[i].Code) !== -1) {
                                showErrorPopup = false;
                            }
                        }
                    }
                    jQuery.sap.log.error(errMsg + ' Details: ' + detailMsg);
                    if (showErrorPopup) {
                        this.pushError({
                            type: "error",
                            title: errMsg,
                            description: detailMsg + this.getDebugInfo()
                        });
                    }
                } else {
                    this.pushError({
                        type: "error",
                        title: error.toString(),
                        description: error.toString() + this.getDebugInfo()
                    });
                }
            }
        },

        // ################################################################################
        // Functions related to the URL:
        // ################################################################################

        parseUrlParameters: function(unescapedSearchUrl) {
            // workaround for url ushells broken url escaping if special chars
            // like [] are used in urls (like in app tiles with search filters).
            // limitation of this workaround:
            // - tiles with searchterms like the names of the parameters dont
            //   work (for example a tile with searchterm "top=")
            var oParametersLowerCased = {};
            var knownSearchUrlParameters = [{
                "name": "filter",
                "pos": -1,
                "value": ""
            }, {
                "name": "top",
                "pos": -1,
                "value": ""
            }, {
                "name": "datasource",
                "pos": -1,
                "value": ""
            }, {
                "name": "searchterm",
                "pos": -1,
                "value": ""
            }];
            // find the parameters:
            for (var i = 0; i < knownSearchUrlParameters.length; i++) {
                knownSearchUrlParameters[i].pos = unescapedSearchUrl.toLowerCase().indexOf(knownSearchUrlParameters[i].name + "=");
            }
            knownSearchUrlParameters.sort(function(a, b) {
                return a.pos - b.pos;
            });
            // find the parameter boundaries:
            for (var j = 0; j < knownSearchUrlParameters.length; j++) {
                if (knownSearchUrlParameters[j].pos !== -1) {
                    if (knownSearchUrlParameters[j + 1] && knownSearchUrlParameters[j + 1].pos !== -1) {
                        knownSearchUrlParameters[j].value = unescapedSearchUrl.substring(knownSearchUrlParameters[j].pos, knownSearchUrlParameters[j + 1].pos);
                    } else {
                        knownSearchUrlParameters[j].value = unescapedSearchUrl.substring(knownSearchUrlParameters[j].pos);
                    }
                    // remove the parameter name and "=":
                    knownSearchUrlParameters[j].value = knownSearchUrlParameters[j].value.substring(knownSearchUrlParameters[j].name.length + 1);
                    if (knownSearchUrlParameters[j].value.charAt(knownSearchUrlParameters[j].value.length - 1) === "&") {
                        knownSearchUrlParameters[j].value = knownSearchUrlParameters[j].value.substring(0, knownSearchUrlParameters[j].value.length - 1);
                    }
                    knownSearchUrlParameters[j].value = decodeURIComponent(knownSearchUrlParameters[j].value);
                    oParametersLowerCased[knownSearchUrlParameters[j].name] = knownSearchUrlParameters[j].value;
                }
            }
            return oParametersLowerCased;
        },

        createSearchURL: function() {

            // use encodeURIComponent and not encodeURI because:
            // >= in filter condition needs to be
            // encoded. If = ist not encoded the url parameter parser will use = as delimiter for
            // a parameter=value pair

            // prefix
            var sHash = "#Action-search";

            var uiFilterJson = this.getProperty('/uiFilter').getJson();

            // searchterm
            sHash += "&/searchterm=" + encodeURIComponent(uiFilterJson.searchTerms);

            // datasource
            sHash += "&datasource=" + encodeURIComponent(JSON.stringify(uiFilterJson.dataSource));

            // top
            sHash += "&top=" + this.getTop();

            // filter conditions/searchTerms
            sHash += "&filter=" + encodeURIComponent(JSON.stringify(uiFilterJson.defaultConditionGroup));

            return sHash;
        },

        updateSearchURLSilently: function() {
            var sHash = this.createSearchURL();
            SearchHelper.hasher.setHash(sHash);
        },

        deserializeURL: function() {

            // ignore url hash change which if no search application
            if (SearchHelper.getHashFromUrl().indexOf('#Action-search') !== 0) {
                return;
            }

            // check if hash differs from old hash. if not -> return
            if (!SearchHelper.hasher.hasChanged()) {
                return;
            }

            // parse hash parameters
            var oURLParsing = sap.ushell.Container.getService("URLParsing");
            var appSpecificRoute = oURLParsing.splitHash(SearchHelper.getHashFromUrl()).appSpecificRoute;
            if (!appSpecificRoute) {
                return;
            }

            var oParametersLowerCased = this.parseUrlParameters(appSpecificRoute.substring(2));

            var uiFilterJson = {};

            // search term
            if (oParametersLowerCased.searchterm) {
                uiFilterJson.searchTerms = oParametersLowerCased.searchterm;
            }

            // datasource
            if (oParametersLowerCased.datasource) {
                uiFilterJson.dataSource = JSON.parse(oParametersLowerCased.datasource);
            } else {
                this.resetDataSource(false);
            }

            // top
            if (oParametersLowerCased.top) {
                var top = parseInt(oParametersLowerCased.top, 10);
                this.setTop(top, false);
            }

            // filter conditions
            this.resetFilterConditions(false);
            if (oParametersLowerCased.filter) {
                uiFilterJson.defaultConditionGroup = JSON.parse(oParametersLowerCased.filter);
            }

            this.getProperty("/uiFilter").setJson(uiFilterJson);

            if (uiFilterJson.dataSource && uiFilterJson.dataSource.name && uiFilterJson.dataSource.name === 'Apps') {
                this.setDataSource(this.appDataSource, false);
            }

            // fire query
            this._firePerspectiveQuery(true);

        },

        buildPersoServiceProvider: function(key) {
            var keySubString = key.substring(key.lastIndexOf('/') + 1);
            var persId = {
                container: "PC-" + keySubString,
                item: "PI-" + keySubString
            };
            var provider = sap.ushell.Container.getService("Personalization").getPersonalizer(persId);

            return {
                key: key,
                provider: provider
            }
        },

        pushPersoServiceProvider: function(provider) {
            var providers = this.getProperty("/persoServiceProviders");
            providers.push(provider);
            this.setProperty("/persoServiceProviders", providers);
        },

        getPersoServiceProvider: function(key) {
            var providers = jQuery.grep(this.getProperty("/persoServiceProviders"), function(provider) {
                return provider.key == key;
            });
            return providers[0];
        }

    });

})(window);
