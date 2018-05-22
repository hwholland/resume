/* global jQuery, sap, window */
(function() {
    "use strict";

    // =======================================================================
    // import
    // =======================================================================        
    sap.ushell.Container.getService("Search").getSina(); //ensure that sina is loaded
    var sinaBaseModule = sap.bc.ina.api.sina.base;

    // =======================================================================
    // declare package
    // =======================================================================    
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps');

    // =======================================================================
    // extend sina suggestion types with apps
    // =======================================================================        
    sinaBaseModule.SuggestionType.APPS = 'apps';

    // =======================================================================
    // suggestion types
    // =======================================================================        
    var module = sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps = {};

    // properties of datasource suggestions
    module[sinaBaseModule.SuggestionType.DATASOURCE] = {
        position: 10,
        limit: 2
    };

    // properties of app suggestions
    module[sinaBaseModule.SuggestionType.APPS] = {
        position: 20,
        limitDsAll: 3,
        limitDsApps: jQuery.device.is.phone ? 7 : 7
    };

    // properties of history suggestions
    module[sinaBaseModule.SuggestionType.HISTORY] = {
        position: 30,
        limit: 3
    };

    // properties of object data suggestions
    module[sinaBaseModule.SuggestionType.OBJECTDATA] = {
        position: 40,
        limit: jQuery.device.is.phone ? 7 : 7,
        limitDataSource: 2
    };


})();
