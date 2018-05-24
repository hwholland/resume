jQuery.sap.require("sap.ui.demo.chartdemo.util.Formatter");
jQuery.sap.require("sap.ui.demo.chartdemo.util.Controller");

var lastMeasure = ""; // to keep at least one measure for the url
sap.ui.demo.chartdemo.util.Controller.extend("sap.ui.demo.chartdemo.view.Master", {
    

    onChartTypeChanged: function(oEvent) {
        //just tell the detail to call 
        var par = ""; var measure = "";
        
        //way 1: by route
        var arr = this.selectMeasure.getSelectedItems();
        var itemPros = new Array();
        for (var i = arr.length - 1; i >= 0; i--) {
            itemPros[i] = arr[i].mProperties.title;
            measure = measure + itemPros[i];
        };
        if(measure) {
            lastMeasure = measure;
        }
        if(!measure) {
            measure = lastMeasure;
        }

        par = par + "chartType=" + this.seletChartType.getSelectedKey() + "&";
        par = par + "color=" + this.selectColor.getSelectedKey() + "&";
        par = par + "tooltip=" + this.selectPopover.getSelectedKey() + "&";
        par = par + "measureNames=" + measure;

        this.getRouter().navTo("idoVizFrame2", {
                'chartIndex': par
            },
            false
        );

    },

    onInit: function() {
        this.oInitialLoadFinishedDeferred = jQuery.Deferred();

        this.selectColor = this.byId("selectColor");
        this.selectColor.attachChange(this.onChartTypeChanged, this);

        this.selectPopover = this.byId('selectPopover');
        this.selectPopover.attachChange(this.onChartTypeChanged, this);

        this.seletChartType = this.byId("select");
        this.seletChartType.attachChange(this.onChartTypeChanged, this);

        this.selectMeasure = this.byId('MeasureList');
        this.selectMeasure.attachSelectionChange(this.onChartTypeChanged, this);


        if (sap.ui.Device.system.phone) {
            return;
        }

        this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
    },

    onRouteMatched: function(oEvent) {
        var args = oEvent.getParameter('arguments'); // receive url parameters
        if(args.chartIndex) { // translate url parameters to array by type
            var parameters = args.chartIndex;
            var index = [0], temp = [];
            for(var i = 0; i < parameters.length; ++i) {
                if(parameters[i] == "&") {
                    index.push(i);
                }
            }
            temp.push(parameters.substring(index[0]+10, index[1]));// chartType
            temp.push(parameters.substring(index[1]+7, index[2])); // color
            temp.push(parameters.substring(index[2]+9, index[3])); // popover
            temp.push(parameters.substring(index[3]+14));          // measure
            this.byId("select").setSelectedKey(temp[0]);
            this.byId("selectColor").setSelectedKey(temp[1]);
            this.byId("selectPopover").setSelectedKey(temp[2]);
        }

        if(temp) {
            var parameters = temp[3];
            var index = [], temp = [];
            for(var j = 0; j < parameters.length; ++j) {
                if(parameters[j].toLowerCase() != parameters[j]) {
                    index.push(j);
                }
            }
            for(var k = 0; k < index.length; ++k) {
                temp.push(parameters.substring(index[k], index[k+1]));
            }
            this.byId("Profit").setSelected(false);
            this.byId("Cost").setSelected(false);
            this.byId("Revenue").setSelected(false);
            for(var i = 0; i < temp.length; ++i) {
                if(temp[i] == "Profit") {
                    this.byId("Profit").setSelected(true);
                }
                if(temp[i] == "Cost") {
                    this.byId("Cost").setSelected(true);
                }
                if(temp[i] == "Revenue") {
                    this.byId("Revenue").setSelected(true);
                }
            }
        }

        //Load the detail view in desktop
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "sap.ui.demo.chartdemo.view.Detail",
            targetViewType: "XML"
        });
    },

    showDetail: function(oItem) {

        var bReplace = jQuery.device.is.phone ? false : true;
        sap.ui.core.UIComponent.getRouterFor(this).navTo("idoVizFrame2", {
                chartType: '1'
            },
            bReplace);
    }
});