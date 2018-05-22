sap.ui.define(['./MyRouter'],
	function(MyRouter) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.ui.demo.chartdemo.Component", {
	    metadata : {
	        name : "ChartDemo Demo App",
	        version : "1.0",
	        includes : ["css/appStyle.css"],
	        dependencies : {
	            libs : ["sap.m", "sap.ui.layout"],
	            components : []
	        },

	        rootView : "sap.ui.demo.chartdemo.view.App",

	        config : {
	            serviceConfig : {
	                name : "Northwind",
	                serviceUrl : "/uilib-sample/proxy/http/services.odata.org/V2/(S(sapuidemochartdemo))/OData/OData.svc/"
	            }
	        },

	        routing : {
	            config : {
	                routerClass : MyRouter,
	                viewType : "XML",
	                viewPath : "sap.ui.demo.chartdemo.view",
	                targetAggregation : "detailPages",
	                clearTarget : false
	            },
	            routes : [
	                {
	                    pattern : "",
	                    name : "main",
	                    view : "Master",
	                    targetAggregation : "masterPages",
	                    targetControl : "idAppControl",
	                    subroutes : [
	                        {
	                            pattern : "chart/{chartIndex}",
	                            name : "idoVizFrame2",
	                            view : "Detail"
	                        },
	                        {
	                            pattern : "color/{colorIndex}",
	                            name : "colorPalette",
	                            view : "Detail"
	                        },
	                        {
	                            pattern : "popover/{popoverIndex}",
	                            name : "popOver",
	                            view : "Detail"
	                        },
	                        {
	                            pattern : "measure/{measureIndex}",
	                            name : "measureRouter",
	                            view : "Detail"
	                        }


	                    ]
	                },
	            ]
	        }
	    },

	    init : function() {
	        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

	        var mConfig = this.getMetadata().getConfig();

	        // always use absolute paths relative to our own component
	        // (relative paths will fail if running in the Fiori Launchpad)
	        var oRootPath = jQuery.sap.getModulePath("sap.ui.demo.chartdemo");


	        var sServiceUrl = mConfig.serviceConfig.serviceUrl;

	        //This code is only needed for testing the application when there is no local proxy available, and to have stable test data.
	        var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
	        // start the mock server for the domain model
	        if (bIsMocked) {
	            this._startMockServer(sServiceUrl);
	        }

	        // Create and set domain model to the component
	        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
	        this.setModel(oModel);

	        // set device model
	        var oDeviceModel = new sap.ui.model.json.JSONModel({
	            isTouch : sap.ui.Device.support.touch,
	            isNoTouch : !sap.ui.Device.support.touch,
	            isPhone : sap.ui.Device.system.phone,
	            isNoPhone : !sap.ui.Device.system.phone,
	            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
	            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
	        });
	        oDeviceModel.setDefaultBindingMode("OneWay");
	        this.setModel(oDeviceModel, "device");

	        this.getRouter().initialize();

	    },

	    _startMockServer : function (sServiceUrl) {
	        jQuery.sap.require("sap.ui.core.util.MockServer");
	        var oMockServer = new sap.ui.core.util.MockServer({
	            rootUri: sServiceUrl
	        });

	        var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
	        sap.ui.core.util.MockServer.config({
	            autoRespondAfter : iDelay
	        });

	        oMockServer.simulate("model/metadata.xml", "model/");
	        oMockServer.start();


	        sap.m.MessageToast.show("Running in demo mode with mock data.", {
	            duration: 2000
	        });
	    }
	});



	return Component;

});
