jQuery.sap.require( "sap.ui.vbm.AnalyticMap");
sap.ui.vbm.AnalyticMap.GeoJSONURL  =  "test-resources/sap/ui/vbm/demokit/media/analyticmap/continent.json";

var oData = 
{
   regionProperties :
	   [
        { "code": "EU", "legend": "Europe",         "color": "rgba(184,225,245,1.0)", "tooltip":"Europe\r\n\r\nPopulation: 743 Mio" },
        { "code": "NA", "legend": "North America",  "color": "rgba(5,71,102,1.0)"  },
        { "code": "OC", "legend": "Oceania",        "color": "rgba(0,125,192,1.0)"  }
     ]				
};
var oModel = new sap.ui.model.json.JSONModel();
oModel.setData( oData );

sap.ui.controller("sap.ui.vbm.sample.AnalyticMapLegend.C", {
	
	onInit : function ()
	{		
//	    var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/AnalyticMap/Data.json");
		this.getView().setModel(oModel);		
	 },

	onRegionClick: function (e)
	{
		sap.m.MessageToast.show( "onRegionClick " + e.getParameter( "code" ) );
	},

	onRegionContextMenu: function ( e )
	{
		sap.m.MessageToast.show( "onRegionContextMenu " + e.getParameter( "code" ) );
	},
	
	onChangeModel1: function (evt)
	{
		oModel.setProperty( "/regionProperties/0/color", "rgba(255,0,0,1.0)" );		
	},
	
	onChangeModel2: function (evt)
	{
		if( oData.regionProperties.length )
	         oData.regionProperties = oData.regionProperties.splice( 0, oData.regionProperties.length - 1 );
	      
	      oModel.setData( oData );
	},
	
	onToggleLegend: function (evt)
	{
		if(this.byId("vbi").getLegendVisible()){
			this.byId("vbi").setLegendVisible(false);	
			this.byId("toggleLegend").setText("Show Legend");
			this.byId("toggleLegend").setTooltip("Show Legend");
		}
		else{
			this.byId("vbi").setLegendVisible(true);		
			this.byId("toggleLegend").setText("Remove Legend");
			this.byId("toggleLegend").setTooltip("Remove Legend");	
		}
	}
});
