sap.ui.jsview("resume.web.view.App", {

    getControllerName: function() {},

    createContent: function() {

        //this.setDisplayBlock(true);
        
        var splitApp = new sap.m.SplitApp("resume-app", {
        	mode: sap.m.SplitAppMode.StretchCompressMode
        }).addStyleClass("sapUiSizeCozy sapUiNoMargin sapUiNoContentPadding");
        
        return (splitApp);

    }

});