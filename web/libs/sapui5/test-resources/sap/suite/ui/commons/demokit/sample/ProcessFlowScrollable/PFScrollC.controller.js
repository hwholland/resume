jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowScrollable.PFScrollC", {


  onNodePress: function(event) {
    var textToDisplay = "Node ";
    textToDisplay += event.getParameters().getNodeId();
    textToDisplay += " was clicked";
    sap.m.MessageToast.show(textToDisplay);
  },

  onInit: function () {
    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData(oDataProcessFlowNodesEmpty);
    this.getView().setModel(oModel);
    this.getView().byId("processflow2").updateModel();
  },

  onZoomIn: function () {
      this.getView().byId("processflow1").zoomIn();
      this.getView().byId("processflow1").getZoomLevel();
      jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
  },

  onZoomOut: function () {
      this.getView().byId("processflow1").zoomOut();
      this.getView().byId("processflow1").getZoomLevel();
      jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
  },

  onDisplayProcessFlow: function () {


      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData(oDataProcessFlowNodes);
      this.getView().setModel(oModel);

      this.getView().byId("processflow2").updateModel();

      jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show("Process Flow has been displayed");

  },

  onHighlightPath: function () {

      var oDataNodesHighlightedNodes = {
      nodes:
      [
        {id: "1",  lane: "0",  title: "Sales Order 2", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, highlighted: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
        {id: "10", lane: "1" , title: "Outbound Delivery 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", highlighted: true, texts: ["text 1", "text 2"]},
        {id: "11", lane: "1" , title: "Outbound Delivery 43", children: [20], texts: ["text 1", "text 2"]},
        {id: "12", lane: "1" , title: "Outbound Delivery 45", children: [20]},
        {id: "20",  lane: "2" , title: "Invoice 9",  children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", highlighted: true},
        {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned},
        {id: "31",  lane: "3" , title: "Accounting Document 7",  children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", highlighted: true},
        {id: "41",  lane: "4" , title: "Payment Document 75",  children: [51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", highlighted: true},
        {id: "51",  lane: "5" , title: "Acceptance Letter 14",  children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK status", texts: ["document status changed"]},
        {id: "61",  lane: "6" , title: "Credit Voucher 67",  children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
        {id: "71",  lane: "7" , title: "Credit Return 77",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
      ],
      lanes:
      [
        {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
        {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1},
        {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2},
        {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3},
        {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 4},
        {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 5},
        {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 6},
        {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 7}
      ]
    };

      var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData(oDataNodesHighlightedNodes);
      this.getView().setModel(oModel);

      this.getView().byId("processflow2").updateModel();

      jQuery.sap.require("sap.m.MessageToast");
      sap.m.MessageToast.show("Path has been highlighted");
  },

  onUpdateProcessFlow: function () {
    var oDataNodesHighlightedNodes = {
        nodes:
        [
          {id: "1",  lane: "0",  title: "Sales Order 2", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
          {id: "10", lane: "1" , title: "Outbound Delivery 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
          {id: "11", lane: "1" , title: "Outbound Delivery 43", children: [20], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, texts: ["text 1", "text 2"]},
          {id: "12", lane: "1" , title: "Outbound Delivery 45", children: [20], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive},
          {id: "20",  lane: "2" , title: "Invoice 9",  children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
          {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, texts:["Invoince has not come"]},
          {id: "31",  lane: "3" , title: "Accounting Document 7",  children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
          {id: "41",  lane: "4" , title: "Payment Document 75",  children: [51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
          {id: "51",  lane: "5" , title: "Acceptance Letter 14",  children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK status", texts: ["document status changed"]},
          {id: "61",  lane: "6" , title: "Credit Voucher 67",  children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
          {id: "71",  lane: "7" , title: "Credit Return 77",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "Credit returned", texts:["credit already returned ...","22.11.2014"]}
        ],
        lanes:
        [
          {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
          {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1},
          {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2},
          {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3},
          {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 4},
          {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 5},
          {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 6},
          {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 7}
        ]
      };

        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oDataNodesHighlightedNodes);
        this.getView().setModel(oModel);

        this.getView().byId("processflow2").updateModel();

        jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show("Update model done.");

  }
});

var oDataProcessFlowNodesEmpty = {
    nodes:[],
    lanes:[]
};
var oDataProcessFlowNodes = {
    nodes:
    [
      {id: "1",  lane: "0",  title: "Sales Order 2", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
      {id: "10", lane: "1" , title: "Outbound Delivery 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
      {id: "11", lane: "1" , title: "Outbound Delivery 43", children: [20], texts: ["text 1", "text 2"]},
      {id: "12", lane: "1" , title: "Outbound Delivery 45", children: [20]},
      {id: "20",  lane: "2" , title: "Invoice 9",  children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned},
      {id: "31",  lane: "3" , title: "Accounting Document 7",  children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "41",  lane: "4" , title: "Payment Document 75",  children: [51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "51",  lane: "5" , title: "Acceptance Letter 14",  children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "61",  lane: "6" , title: "Credit Voucher 67",  children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "71",  lane: "7" , title: "Credit Return 77",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
    ],
    lanes:
    [
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
      {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2},
      {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3},
      {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 4},
      {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 5},
      {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 6},
      {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 7}
    ]
  };