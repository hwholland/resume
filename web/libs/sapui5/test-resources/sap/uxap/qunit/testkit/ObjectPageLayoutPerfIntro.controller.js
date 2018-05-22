jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.model.odata.ODataModel");

sap.ui.controller("sap.uxap.testkit.ObjectPageLayoutPerfIntro", {

	onInit: function () {
	},
    onDisplayObjectPage: function(oEvent) {
        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPage");
            this.oNewView = sap.ui.xmlview("TestPage2", "sap.uxap.testkit.perfs.ObjectPageLayoutPerf");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },


    onDisplayObjectPageWithData: function(oEvent) {
        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPageWithData");
            this.oNewView = sap.ui.xmlview("TestPage3", "sap.uxap.testkit.perfs.ObjectPageLayoutPerfData");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },

    onDisplayObjectPageWithMoreData: function(oEvent) {

        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPageWithDataNew");
            this.oNewView = sap.ui.xmlview("TestPage4", "sap.uxap.testkit.perfs.ObjectPageLayoutPerfDataNewFull");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },

    onDisplayObjectPageWithMoreDataOneBlock: function(oEvent) {

        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPageWithDataNew");
            this.oNewView = sap.ui.xmlview("TestPage4", "sap.uxap.testkit.perfs.ObjectPageLayoutPerfDataNew");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },

    onDisplayObjectPageWithMoreDataWithTables: function(oEvent) {

        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPageWithDataNew");
            this.oNewView = sap.ui.xmlview("TestPage4", "sap.uxap.testkit.perfs.ObjectPageLayoutPerfDataNewTables");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },

    onDisplayObjectPageWithMoreDataConfig: function(oEvent) {

        if (!this.oNewView) {
            var timestamp=(new Date()).getTime();
            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "onDisplayObjectPageConfig");
            this.oNewView = sap.ui.xmlview("TestPage5", "sap.uxap.testkit.perfs.ObjectPageLayoutPerfConfig");
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            jQuery.sap.measure.start("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp, "insertContent");
            this.getView().getContent()[0].insertContent(this.oNewView);
            jQuery.sap.measure.end("UxAP :: ObjectPageLayoutPerfIntro.ObjectPageLayoutPerfIntro"+timestamp);

            this.enableButtons(false);
        }
    },

    onRemoveContent: function(oEvent) {
        if (this.oNewView) {
            this.getView().getContent()[0].removeContent(this.oNewView);
            this.oNewView.destroy();
            this.oNewView = null;
            this.enableButtons(true);
        }
    },
    onOpen: function (oEvent) {
        var oButton = oEvent.oSource;

        if (!this._actionSheet) {
            this._actionSheet = sap.ui.xmlfragment("sap.uxap.testkit.perfs.PerfAction", this);
            this.getView().addDependent(this._actionSheet);
        }

        this._actionSheet.openBy(oButton);
    },

    enableButtons: function(bValue) {
        this.byId("ObjectPageButton").setEnabled(bValue);
        this.byId("ObjectPageDataButton").setEnabled(bValue);
        this.byId("ObjectPageMoreDataButton").setEnabled(bValue);
        this.byId("ObjectPageMoreDataButtonOneBlock").setEnabled(bValue);
        this.byId("ObjectPageMoreDataButtonTables").setEnabled(bValue);
        this.byId("ObjectPageMoreDataButtonConfig").setEnabled(bValue);
    }

});
