jQuery.sap.require( "sap.ui.vbm.AnalyticMap");
sap.ui.vbm.AnalyticMap.GeoJSONURL  =  "test-resources/sap/ui/vbm/demokit/media/analyticmap/continent.json";

sap.ui.controller("sap.ui.vbm.sample.AnalyticMapGeoCircles.C", {
	
	onInit : function () 
	{
	    var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/AnalyticMapGeoCircles/Data.json");
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
	
	onClickItem: function (evt)	{
		alert("onClick");
	},

	onContextMenuItem: function ( evt )	{
		alert("onContextMenu");
	},
	
	onClickGeoCircle: function (evt)	{
		alert("GeoCircle onClick");
	},

	onContextMenuGeoCircle: function ( evt )	{
		alert("GeoCircle onContextMenu");
	},
	
	onZoomIn : function() {
		this.byId("vbi").zoomToRegions(["EU"]);
	}
});
