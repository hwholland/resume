sap.ui.jsview("resume.web.view.App", {

    getControllerName: function() {},

    createContent: function() {

        //this.setDisplayBlock(true);
        
        var splitApp = sap.m.SplitApp("resume-nav", {
        	mode: sap.m.SplitAppMode.ShowHideMode
        }).addStyleClass("sapUiSizeCozy");
        
        return (splitApp);

    }

});