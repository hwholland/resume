sap.ui.jsview("resume.web.view.App", {
    getControllerName: function() {},
    createContent: function() {
        var splitApp = new sap.m.App("resume-app", {
        }).addStyleClass("sapUiSizeCozy sapUiNoMargin sapUiNoContentPadding");
        return (splitApp);
    }
});