jQuery.sap.declare("sap.uxap.blocks.FieldGroupForm");
jQuery.sap.require("sap.uxap.BlockBase");


sap.uxap.BlockBase.extend("sap.uxap.testkit.perfs.FieldGroupForm3", {

    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.testkit.perfs.FieldGroupForm3",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.testkit.perfs.FieldGroupForm3",
                type: "XML"
            }

        },
        properties: {
            "columnLayout" : {type: "sap.uxap.ObjectPageBlockBaseColumnLayout", group: "Behavior", defaultValue: "1"},

            "showTitle": {
                defaultValue: true,
                group : "Misc",
                type: "boolean"
            },
            "labelSpanL": {
                defaultValue: 4,
                group : "Misc",
                type: "int"
            },
            "labelSpanM": {
                defaultValue: 2,
                group : "Misc",
                type: "int"
            },
            "emptySpanL": {
                defaultValue: 0,
                group : "Misc",
                type: "int"
            },
            "emptySpanM": {
                defaultValue: 0,
                group : "Misc",
                type: "int"
            },
            "columnsL": {
                defaultValue: 2,
                group : "Misc",
                type: "int"
            },
            "columnsM": {
                defaultValue: 1,
                group : "Misc",
                type: "int"
            },
            "title": {
                type : "string",
                group : "Misc",
                defaultValue : ""
            }
        }
    }

});
sap.uxap.testkit.perfs.FieldGroupForm3.prototype.init=function(){
    if (sap.uxap.BlockBase.prototype.init) {
        sap.uxap.BlockBase.prototype.init.call(this);
    }
    var oModel= new sap.ui.model.json.JSONModel ();
    var oData= {
        labelSpanL:this.getLabelSpanL(),
        emptySpanL:this.getEmptySpanL(),
        labelSpanM:this.getLabelSpanM(),
        emptySpanM:this.getEmptySpanM(),
        showTitle: this.getShowTitle(),
        columnsL:this.getColumnsL(),
        columnsM:this.getColumnsM(),
        title:this.getTitle()
    };
    oModel.setData(oData);
    this.setModel(oModel,'ControlModel');
};
