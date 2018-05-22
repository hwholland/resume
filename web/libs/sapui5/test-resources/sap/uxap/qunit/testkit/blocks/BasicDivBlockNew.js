jQuery.sap.declare("sap.uxap.testkit.blocks.BasicDivBlockNew");
jQuery.sap.require("sap.uxap.BlockBase");
//jQuery.sap.require("sap.uxap.ObjectPageBlockBase");

sap.uxap.BlockBase.extend("sap.uxap.testkit.blocks.BasicDivBlockNew", {
    metadata: {
        properties: {
            "height": {type: "string", group: "Appearance"},
            "backgroundColor": {type: "string", group: "Appearance"},
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

sap.uxap.testkit.blocks.BasicDivBlockNew.prototype.init=function(){
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


/*
sap.uxap.BlockBase.prototype._initView = function (sMode) {

    jQuery.sap.measure.start("UxAP :: BasicDivBlock", "_initView");
    if (sap.uxap.BlockBase.prototype._initView) {
        sap.uxap.BlockBase.prototype._initView.apply(this, arguments);
    }
    jQuery.sap.measure.end("UxAP :: BasicDivBlock");
}


sap.uxap.ObjectPageBlockBase.prototype.createView = function (mParameter) {
    var mViewParameter = {};
    mViewParameter.type = mParameter.type;
    mViewParameter.viewContent = '<mvc:View \
    xmlns:forms="sap.ui.layout.form"         \
    xmlns:mvc="sap.ui.core.mvc"               \
    xmlns:core="sap.ui.core"                   \
    xmlns="sap.m"                               \
    xmlns:html="http://www.w3.org/1999/xhtml"    \
    controllerName="sap.uxap.testkit.blocks.BasicDivBlockController"> \
        <html:div style="height:200px; background-color: lightslategray;"></html:div> \
        </mvc:View>';
    return sap.ui.xmlview(mViewParameter);
};*/
