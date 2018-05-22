sap.ui.controller("sap.viz.sample.ExtensionFlagBar.FlagBar", {
	onInit : function(oEvent) {
        // load images
        sap.viz.api.env.Resource.path('sap.viz.ext.flagbar.ImgLoadPath', 
            [jQuery.sap.getModulePath("sap.viz.sample.ExtensionFlagBar", "/sap.viz.ext.flagbar/bundles/sap/viz/ext/flagbar/sap_viz_ext_flag-src/resources/img/")]);
            
        // Create and initialize the extension in an requireJS manner
        
        // Config the baseUrl for requireJS to find the specific module or file
        requirejs.config({
            baseUrl: jQuery.sap.getModulePath("sap.viz.sample.ExtensionFlagBar", "/sap.viz.ext.flagbar/bundles/sap/viz/ext/flagbar")
        });
        // Create the extension chart in the callback of requiring the related modules
        // The bundle file should typically be required.
        require(['flagbar-bundle'], function () {
			var oVizFrame = this.getView().byId("idVizFrame");
	        var oModel = new sap.ui.model.json.JSONModel({
	            "path" : [
	                {"Medal Type" : 'Gold', "Country" : 'USA', "Athens (2004)" : 35, "Beijing (2008)": 36},
	                {"Medal Type" : 'Silver', "Country" : 'USA', "Athens (2004)" : 39, "Beijing (2008)": 38},
	                {"Medal Type" : 'Bronze', "Country" : 'USA', "Athens (2004)" : 29, "Beijing (2008)": 36},
	                {"Medal Type" : 'Gold', "Country" : 'China', "Athens (2004)" : 32, "Beijing (2008)": 51},
	                {"Medal Type" : 'Silver', "Country" : 'China', "Athens (2004)" : 17, "Beijing (2008)": 21},
	                {"Medal Type" : 'Bronze', "Country" : 'China', "Athens (2004)" : 14, "Beijing (2008)": 28},
	                {"Medal Type" : 'Gold', "Country" : 'Russia', "Athens (2004)" : 27, "Beijing (2008)": 23},
	                {"Medal Type" : 'Silver', "Country" : 'Russia', "Athens (2004)" : 27, "Beijing (2008)": 21},
	                {"Medal Type" : 'Bronze', "Country" : 'Russia', "Athens (2004)" : 38, "Beijing (2008)": 29}
	            ]
	        });
	        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
	            dimensions : [
	                {name : 'Medal Type', value : "{Medal Type}"}, 
	                {name : 'Country', value : "{Country}"}
	            ],
	            measures : [
	                {name : 'Athens (2004)', value : '{Athens (2004)}'},
	                {name : 'Beijing (2008)', value : '{Beijing (2008)}'}
	            ],
	            data : {
	                path : "/path"
	            }
	        });
	        oVizFrame.setDataset(oDataset);
	        oVizFrame.setModel(oModel);
	
	        oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
	            'uid' : "partner.modules.olympics.valueaxis1",
	            'type' : "Measure",
	            'values' : ["Athens (2004)", "Beijing (2008)"]
	        }));
	        oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
	            'uid' : "partner.modules.olympics.medaltype",
	            'type' : "Dimension",
	            'values' : ["Medal Type"]
	        }));
	        oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
	            'uid' : "partner.modules.olympics.country",
	            'type' : "Dimension",
	            'values' : ["Country"]
	        }));
	        oVizFrame.setVizProperties({
	        	'title' : {
	        		'visible' : true,
	        		'text' : 'Olympics Medals'
	        	},
				legend : {
					title: {visible : false}
	        	}
	        });
        }.bind(this));
	}
});