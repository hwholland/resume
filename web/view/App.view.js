sap.ui.jsview("resume.web.view.App", {

    getControllerName: function() {},

    createContent: function() {

        //this.setDisplayBlock(true);
        
        var splitApp = new sap.m.App("resume-app", {
            /*
        	masterPages: [
        		new sap.m.Page({
        			showHeader: false,
        			content: [
        				new sap.m.List({
        					items: [
        						new sap.m.ObjectListItem({
        							title: "Digital Resume",
        							type: "Active",
        							firstStatus: [
        							 new sap.m.ObjectStatus({
        							 	text: "Active",
        							 	state: "Success"
        							 })
        							],
        						}),
        						new sap.m.ObjectListItem({
        							title: "Realtime UI5",
        							firstStatus: [
        							 new sap.m.ObjectStatus({
        							 	text: "Disabled",
        							 	state: "Error"
        							 })
        							],
        							type: "Active"
        						})
        					]
        				})
        			]
        		})
        	],
            */
            //mode: sap.m.SplitAppMode.ShowHideMode
        	//mode: sap.m.SplitAppMode.HideMode
        }).addStyleClass("sapUiSizeCozy sapUiNoMargin sapUiNoContentPadding");
        
        return (splitApp);

    }

});