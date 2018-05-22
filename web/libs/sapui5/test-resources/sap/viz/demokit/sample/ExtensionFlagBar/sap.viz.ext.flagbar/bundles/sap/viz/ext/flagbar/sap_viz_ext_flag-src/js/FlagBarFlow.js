define("sap_viz_ext_flag-src/js/FlagBarFlow",["sap_viz_ext_flag-src/js/FlagBarModule"], function(moduleFunc) {

    var flowRegisterFunc = function() {
        /*Feeds Definition*/
        //measure feed
        var valueFeed = {
            'id' : 'partner.modules.olympics.valueaxis1',
            'name' : 'Primary Values',
            'type' : 'Measure',
            'min' : 1,
            'max' : 2,
            'mgIndex' : 1
        };
        //medal dimension feed
        var medalTypeFeed = {
            'id' : 'partner.modules.olympics.medaltype',
            'name' : 'Medal Type',
            'type' : 'Dimension',
            'min' : 1,
            'max' : 1,
            'aaIndex' : 1
        };
        //country dimension feed
        var countryFeed = {
            'id' : 'partner.modules.olympics.country',
            'name' : 'Country',
            'type' : 'Dimension',
            'min' : 1,
            'max' : 1,
            'aaIndex' : 2
        };

        var element = sap.viz.extapi.Flow.createElement({
            id : 'viz.ext.modules.olympics',
            name : 'olympics',
        });
        var title = sap.viz.extapi.Flow.createElement({
            id : 'sap.viz.modules.title',
        });

        element.implement('sap.viz.elements.common.BaseGraphic', moduleFunc);
        var flow = sap.viz.extapi.Flow.createFlow({
            id : 'sap.viz.ext.flagbar',
            name : 'Flag Bar Chart',
            dataModel : 'sap.viz.api.data.CrosstableDataset',
            type : 'BorderSVGFlow',
            legacyDataAdapter : true
        });

        element.addFeed([valueFeed, medalTypeFeed, countryFeed]);

        flow.addElement({
            'element' : element,
            'place' : "center"
        });
        flow.addElement({
            'element' : title,
            'place' : 'top',
            'propertyCategory' : 'title'
        });

        sap.viz.extapi.Flow.registerFlow(flow);
    };
    flowRegisterFunc.id = 'sap.viz.ext.flagbar';

    return {
        id : flowRegisterFunc.id,
        init : flowRegisterFunc
    }; 

});