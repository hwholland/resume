
jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowMergedLanes.C", {

  onInit: function () {
    var oDataProcessFlowLanesAndNodes = {
        nodes:
          [
           {id: "1",  lane: "0",  title: "Sales Order 1", titleAbbreviation: "SO 1", children: [2], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
           {id: "2",  lane: "0",  title: "Sales Order 2", titleAbbreviation: "SO 1", children: [21], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
           {id: "21", lane: "2" , title: "Invoice Planned", titleAbbreviation: "IP", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned}
        ],
       lanes:
         [
           {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
           {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1},
           {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2}
         ]
       };

    var oModelPf1 = new sap.ui.model.json.JSONModel();
    var viewPf1 = this.getView();
    oModelPf1.setData(oDataProcessFlowLanesAndNodes);
    viewPf1.setModel(oModelPf1);
    viewPf1.byId("processflow1").updateModel();
  },

  onOnError: function( event ) {
    var textToDisplay = "Exception happened : ";
    textToDisplay += event.getParameters().text;
    sap.m.MessageToast.show(textToDisplay);
  },

  onNodePress: function(event) {
    var textToDisplay = "Node ";
    textToDisplay += event.getParameters().getNodeId();
    textToDisplay += " has been clicked";
    sap.m.MessageToast.show(textToDisplay);
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

  onUpdateModel: function () {
    this.getView().byId("processflow1").getNodes()[0].setState(sap.suite.ui.commons.ProcessFlowNodeState.Planned);
    this.getView().byId("processflow1").getNodes()[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
    this.getView().byId("processflow1").getNodes()[1].setStateText("Negative");
    this.getView().byId("processflow1").getNodes()[1].setTexts("Document State updated");
    this.getView().byId("processflow1").getNodes()[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
    this.getView().byId("processflow1").getNodes()[2].setStateText("State Text changed");
    this.getView().byId("processflow1").getNodes()[2].setTitle("Invoice OK");
    this.getView().byId("processflow1").updateNodesOnly();
    sap.m.MessageToast.show("Model has been updated");
  }
});
