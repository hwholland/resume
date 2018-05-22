
sap.ui.core.mvc.Controller.extend("sap.uxap.testkit.perfs.FormController", {

    onInit: function() {
        this.getView().setModel(new sap.ui.model.json.JSONModel(), "visibleModel");
    },

    isFieldVisible: function() {
        if (!this.sLayoutMode) {
            this.sLayoutMode = this.oParentBlock.getMode();
        }
        if (this.sLayoutMode == "Collapsed") {
            return false;
        }
        else {
            return true;
        }


    },

    onParentBlockModeChange: function (sNewMode) {
        this.sLayoutMode = sNewMode;
        this.getView().getModel("visibleModel").setProperty("/visible", this.sLayoutMode === "Expanded" ? true : false);
    },

    getTitle: function (sTitle, oValue, bShowTitle) {
        var sResult="";
        if(bShowTitle){
            sResult=sTitle?sTitle:oValue;
        }
        return sResult;
    },
    setShowMore:function(bValue){

        if(this.bShowMore !== bValue){
            this.bShowMore = bValue;
            if(this.oParentBlock) {
                this.oParentBlock.setShowSubSectionMore(bValue);
            }
        }
    }

});