jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlow.C", {

  onInit: function () {
    var oDataProcessFlowLanesAndNodes = {
        nodes:
          [
           {id: "1",  lane: "0",  title: "Sales Order 1", titleAbbreviation: "SO 1", children: [10, 11, 12], isTitleClickable: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
           {id: "10", lane: "1" , title: "Outbound Delivery 40", titleAbbreviation: "OD 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
           {id: "11", lane: "1" , title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [20], texts: ["text 1", "text 2"]},
           {id: "12", lane: "1" , title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [20]},
           {id: "20",  lane: "2" , title: "Invoice 9", titleAbbreviation: "I 9", children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
           {id: "21", lane: "2" , title: "Invoice Planned", titleAbbreviation: "IP", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative},
           {id: "31",  lane: "3" , title: "Accounting Document 7", titleAbbreviation: "AD 7", children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
           {id: "41",  lane: "4" , title: "Payment Document 75", titleAbbreviation: "PD 75", children: [51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
           {id: "51",  lane: "5" , title: "Acceptance Letter 14", titleAbbreviation: "AL 14", children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
           {id: "61",  lane: "6" , title: "Credit Voucher 67", titleAbbreviation: "CV 67", children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
           {id: "71",  lane: "6" , title: "Credit Return 77", titleAbbreviation: "CR 77", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
         ],
       lanes:
         [
           {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
           {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1},
           {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2},
           {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3},
           {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 4},
           {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 5},
           {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 6}
         ]
       };

    var oModelPf1 = new sap.ui.model.json.JSONModel();
    var viewPf1 = this.getView();
    oModelPf1.setData(oDataProcessFlowLanesAndNodes);
    viewPf1.setModel(oModelPf1);
    viewPf1.byId("processflow1").updateModel();

    var state = [{
        state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 10
      }, {
        state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 20
      }, {
        state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 30
      }, {
        state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 40
      }];

    var oDataProcessFlowLanesOnly = {
      lanes:
        [
          {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0, state: [
            {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 10}]
          },
          {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1, state: [{
              state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 25
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 20
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 35
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 30
              }]},
          {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2},
          {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3, state: [{
              state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50}]
              },
          {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 4, state: state},
          {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 5, state: [{
              state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 40
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 10
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 20
              }, {
              state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 30
              }]},
          {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 6, state: [{
              state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 10}]
              },
          {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 7}
        ]
      };

    var oModelPf2 = new sap.ui.model.json.JSONModel();
    var viewPf2 = this.getView();
    oModelPf2.setData(oDataProcessFlowLanesOnly);
    viewPf2.setModel(oModelPf2, "pf2");

    viewPf2.byId("processflow2").updateModel();
  },

  onOnError: function( event ) {
    var textToDisplay = "Exception happened : ";
    textToDisplay += event.getParameters().text;
    sap.m.MessageToast.show(textToDisplay);
  },

  onHeaderPress: function( event ) {
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

    var oModel = new sap.ui.model.json.JSONModel();
    var view = this.getView();
    oModel.setData(oDataProcessFlowNodes);
    view.setModel(oModel, "pf2");
    view.byId("processflow2").updateModel();
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

      this.getView().byId("processflow1").updateModel();
      sap.m.MessageToast.show("Path has been highlighted");
  },

  onUpdateModel: function () {
    var oDataUpdateModel = {
      nodes:
        [
          {id: "1",  lane: "0",  title: "Sales Order 1", children: [10, 11, 12], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
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
    oModel.setData(oDataUpdateModel);
    this.getView().setModel(oModel);
    this.getView().byId("processflow1").updateModel();
    sap.m.MessageToast.show("Model has been updated");
  }
});
