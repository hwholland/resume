
jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.C", {

  onInit: function () {
    var oDataProcessFlowLanesAndNodes = {
        nodes:
          [
           {id: "1",  lane: "0",  title: "Sales Order 1", titleAbbreviation: "SO 1", children: [2], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
           {id: "2",  lane: "1" , title: "Invoice 2",  children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK"}
        ],
       lanes:
         [
           {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
           {id: "1", icon: "sap-icon://payment-approval", label: "In Invoice", position: 1}
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

  onNodeTitlePress: function(event) {
    var textToDisplay = 'TitlePress event is deprecated since 1.26';
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

  onUpdateModelAdd: function () {
    if (this.getView().byId("processflow1").getLanes().length < 3) {
      var pfl1 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        sId: "2",
        iconSrc: "sap-icon://money-bills",
        text: "In Accounting",
        position: 2
      });
      this.getView().byId("processflow1").addLane(pfl1);
      this.getView().byId("processflow1").updateModel();
      sap.m.MessageToast.show("Model has been updated");
    };
  }
});