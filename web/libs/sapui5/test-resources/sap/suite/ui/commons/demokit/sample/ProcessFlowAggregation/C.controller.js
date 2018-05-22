jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowAggregation.C", {
  _oDataProcessFlowNodeRegular : {
    nodes:
    [
      {id: "1", lane: "0", title: "Sales Order 1", titleAbbreviation: "SO 1", children: [11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "Positive Status", type: sap.suite.ui.commons.ProcessFlowNodeType.Single, highlighted: false}, 
      {id: "11", lane: "1", title: "Invoice 4", titleAbbreviation: "I 4", children: [13], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, stateText: "Negative Status"},
      {id:"12", lane:"1", title:"Invoice 5", titleAbbreviation: "I 5", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, focused: true},
      {id:"13", lane:"2", title:"Invoice 6", titleAbbreviation: "I 6", state:sap.suite.ui.commons.ProcessFlowNodeState.Neutral, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, focused: false}
    ],
    lanes:
    [
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
      {id: "1", icon: "sap-icon://payment-approval", label: "In Invoice", position: 1},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice 2", position: 2}
    ]
  },
  _oDataProcessFlowNodeHighlighted : {
    nodes:
    [
      {id: "1", lane: "0", title: "Sales Order 1", titleAbbreviation: "SO 1", children: [11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "Positive Status", type: sap.suite.ui.commons.ProcessFlowNodeType.Single, highlighted: true}, 
      {id: "11", lane: "1", title: "Invoice 4", titleAbbreviation: "I 4", children: [13], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, stateText: "Negative Status should not run over more than two rows of text"},
      {id:"12", lane:"1", title:"Invoice 5", titleAbbreviation: "I 5", state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, focused: true, highlighted: true},
      {id:"13", lane:"2", title:"Invoice 6", titleAbbreviation: "I 6", state:sap.suite.ui.commons.ProcessFlowNodeState.Neutral, type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, focused: false}
    ],
    lanes:
    [
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
      {id: "1", icon: "sap-icon://payment-approval", label: "In Invoice", position: 1},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice 2", position: 2}
    ]
  },

  onHighlight: function(event) {
    var oModel = this.getView().getModel();
    if (this.getView().byId("processflow1").getNodes()[0].getHighlighted()){
      oModel.setData(this._oDataProcessFlowNodeRegular);
    }else{
      oModel.setData(this._oDataProcessFlowNodeHighlighted);
    }
    this.getView().byId("processflow1").updateModel();
    sap.m.MessageToast.show("Highlighted status of first node has been updated");
  },

  onNodePress: function(event) {
    var textToDisplay = "Node ";
    textToDisplay += event.getParameters().getNodeId();
    textToDisplay += " was clicked";
    sap.m.MessageToast.show(textToDisplay);
  },

  onInit: function () {
    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData(this._oDataProcessFlowNodeRegular);
    this.getView().setModel(oModel);
    this.getView().byId("processflow1").updateModel();
  },

  onZoomIn: function () {
      this.getView().byId("processflow1").zoomIn();
      this.getView().byId("processflow1").getZoomLevel();
      sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
  },

  onZoomOut: function () {
      this.getView().byId("processflow1").zoomOut();
      this.getView().byId("processflow1").getZoomLevel();
      sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
  },
});