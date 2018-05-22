sap.ui.jsview("views.control.kpi", {
	createContent : function(oController) {
		var oKpiTile1 = new sap.suite.ui.commons.KpiTile({
     		id: "tile1",
            value: "In Approval",
            description: "Status",
            doubleFontSize: false,
            valueStatus: sap.suite.ui.commons.ValueStatus.Critical
    	});
		var oKpiTile2 = new sap.suite.ui.commons.KpiTile({
     		id: "tile2",
            value: "250",
            valueUnit: "MPH",
            description: "Speed Limit, 0955"
    	});
		var oKpiTile3 = new sap.suite.ui.commons.KpiTile({
     		id: "tile3",
            value: "75,3",
            description: "Absolute Deviation, 0385",
            valueStatus: sap.suite.ui.commons.ValueStatus.Good
    	});
		var oKpiTile4 = new sap.suite.ui.commons.KpiTile({
     		id: "tile4",
            value: "91,95",
            valueUnit: "USD",
            description: "Original Amount, 0712",
            valueStatus: sap.suite.ui.commons.ValueStatus.Bad
    	});
		
		var oDescription = util.UiFactory.createDescription(model.Description.kpiTile, 'All');
		
		var oKpiTilePage = new sap.m.Page("kpitile-page", { 
		        showHeader: false, 
			content:[ 
			         oKpiTile1,
			         oKpiTile2,
			         oKpiTile3,
			         oKpiTile4,
			         oDescription
			] 
		}); 
		return oKpiTilePage; 
	} 
});  
