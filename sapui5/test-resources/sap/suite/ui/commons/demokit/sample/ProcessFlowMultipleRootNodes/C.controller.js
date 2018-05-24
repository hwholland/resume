jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowMultipleRootNodes.C", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        var oDataProcessFlowNodes = {
    nodes:
    [
      {id: "1001", lane: "0000",title: "Thought 23456664775", titleAbbreviation: "Th 23456664775", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "1002", lane: "0000",title: "Thought 23456664744", titleAbbreviation: "Th 23456664744", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "101", lane: "000",title: "Contract 4711", titleAbbreviation: "CO 4711", children: [102],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"}, 
      {id: "102", lane: "00", title: "Inquiry 4711112", titleAbbreviation: "IQ 471112", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK"},
      {id: "103", lane: "00", title: "Inquiry 5677643", titleAbbreviation: "IQ 5677643", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK Status"},    
      {id: "1",  lane: "0",  title: "Sales Order 2", titleAbbreviation: "SO 2", children: [10, 11, 12], isTitleClickable: true ,state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
      {id: "10", lane: "1" , title: "Outbound Delivery 40", titleAbbreviation: "OD 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
      {id: "11", lane: "1" , title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [20], texts: ["text 1", "text 2"]},
      {id: "12", lane: "1" , title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [20]},
      {id: "20", lane: "2" , title: "Invoice 9", titleAbbreviation: "INV 9", children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned},
      {id: "31", lane: "3" , title: "Accounting Document 7", titleAbbreviation: "AD 7", children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "41", lane: "4" , title: "Payment Document 75", titleAbbreviation: "PD 75", children: [51, 52, 53, 54], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "51", lane: "5" , title: "Acceptance Letter 14", titleAbbreviation: "AL 14", children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "52", lane: "5" , title: "Acceptance Letter 15", titleAbbreviation: "AL 15", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "53", lane: "5" , title: "Acceptance Letter 16", titleAbbreviation: "AL 16", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "54", lane: "5" , title: "Acceptance Letter 17", titleAbbreviation: "AL 17", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "61", lane: "6" , title: "Credit Voucher 67", titleAbbreviation: "CV 67", children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "71", lane: "7" , title: "Credit Return 77", titleAbbreviation: "CV 77", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
    ],
    lanes:
    [
      {id: "0000", icon: "sap-icon://sales-quote", label: "In Thought", position: 0},
      {id: "000", icon: "sap-icon://contacts", label: "Contracts", position: 1},
      {id: "00", icon: "sap-icon://newspaper", label: "Inquiries", position: 2},
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 3},
      {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 4},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 5},
      {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 6},
      {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 7},
      {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 8},
      {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 9},
      {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 10}
    ]
  };
     // create a Model and assign it to the View
      var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oDataProcessFlowNodes);
        this.getView().byId("processflow2").setModel(oModel);       
            
    },

    onHighlightPath: function(oEvent) {
      var oDataProcessFlowNodesHighlighted = {
    nodes:
    [
      {id: "1001", lane: "0000",title: "Item 007",children: [1], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "1002", lane: "0000",title: "Thought 23456664744 ukulele ia aaa aaa aa aaa",children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "101", lane: "000",title: "Contract 4711",children: [102],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"}, 
      {id: "102", lane: "00", title: "Inquiry 4711112",children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK"},
      {id: "103", lane: "00", title: "Inquiry 5677643",children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK Status"},    
      {id: "1",  lane: "0",  title: "Item 007", children: [10, 11, 12], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
      {id: "10", lane: "1" , title: "Item 007", children: [20, 21], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
      {id: "11", lane: "1" , title: "Outbound Delivery 43", children: [20], texts: ["text 1", "text 2"]},
      {id: "12", lane: "1" , title: "Outbound Delivery 45", children: [20]},
      {id: "20", lane: "2" , title: "Item 007",  children: [31, 51], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned},
      {id: "31", lane: "3" , title: "Item 007",  children: [41], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "41", lane: "4" , title: "Item 007",  children: [51, 52, 53, 54], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "51", lane: "5" , title: "Acceptance Letter 14",  children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "52", lane: "5" , title: "Acceptance Letter 15",  children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "53", lane: "5" , title: "Item 007",  children: [], highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "54", lane: "5" , title: "Acceptance Letter 17",  children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "61", lane: "6" , title: "Credit Voucher 67",  children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "71", lane: "7" , title: "Credit Return 77",  children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
    ],
    lanes:
    [
      {id: "0000", icon: "sap-icon://sales-quote", label: "In Thought", position: 0},
      {id: "000", icon: "sap-icon://contacts", label: "Contracts", position: 1},
      {id: "00", icon: "sap-icon://newspaper", label: "Inquiries", position: 2},
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 3},
      {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 4},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 5},
      {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 6},
      {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 7},
      {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 8},
      {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 9},
      {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 10}
    ]
  };
  var oDataProcessFlowNodes = {
    nodes:
    [
      {id: "1001", lane: "0000",title: "Thought 23456664775", titleAbbreviation: "Th 23456664775", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "1002", lane: "0000",title: "Thought 23456664744", titleAbbreviation: "Th 23456664744", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "101", lane: "000",title: "Contract 4711", titleAbbreviation: "CO 4711", children: [102],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"}, 
      {id: "102", lane: "00", title: "Inquiry 4711112", titleAbbreviation: "IQ 471112", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK"},
      {id: "103", lane: "00", title: "Inquiry 5677643", titleAbbreviation: "IQ 5677643", children: [1],state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK Status"},    
      {id: "1",  lane: "0",  title: "Sales Order 2", titleAbbreviation: "SO 2", children: [10, 11, 12], isTitleClickable: true ,state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", focused: true, texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]},
      {id: "10", lane: "1" , title: "Outbound Delivery 40", titleAbbreviation: "OD 40", children: [20, 21], state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]},
      {id: "11", lane: "1" , title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [20], texts: ["text 1", "text 2"]},
      {id: "12", lane: "1" , title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [20]},
      {id: "20", lane: "2" , title: "Invoice 9", titleAbbreviation: "INV 9", children: [31, 51], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "21", lane: "2" , title: "Invoice planned", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned},
      {id: "31", lane: "3" , title: "Accounting Document 7", titleAbbreviation: "AD 7", children: [41], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "41", lane: "4" , title: "Payment Document 75", titleAbbreviation: "PD 75", children: [51, 52, 53, 54], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "51", lane: "5" , title: "Acceptance Letter 14", titleAbbreviation: "AL 14", children: [61], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "52", lane: "5" , title: "Acceptance Letter 15", titleAbbreviation: "AL 15", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "53", lane: "5" , title: "Acceptance Letter 16", titleAbbreviation: "AL 16", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "54", lane: "5" , title: "Acceptance Letter 17", titleAbbreviation: "AL 17", children: [], state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned State"},
      {id: "61", lane: "6" , title: "Credit Voucher 67", titleAbbreviation: "CV 67", children: [71], state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status"},
      {id: "71", lane: "7" , title: "Credit Return 77", titleAbbreviation: "CV 77", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, stateText: "Planned status text"}
    ],
    lanes:
    [
      {id: "0000", icon: "sap-icon://sales-quote", label: "In Thought", position: 0},
      {id: "000", icon: "sap-icon://contacts", label: "Contracts", position: 1},
      {id: "00", icon: "sap-icon://newspaper", label: "Inquiries", position: 2},
      {id: "0", icon: "sap-icon://order-status", label: "In Order", position: 3},
      {id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 4},
      {id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 5},
      {id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 6},
      {id: "4", icon: "sap-icon://payment-approval", label: "In Payment", position: 7},
      {id: "5", icon: "sap-icon://nurse", label: "Delivered", position: 8},
      {id: "6", icon: "sap-icon://retail-store", label: "In Return Process", position: 9},
      {id: "7", icon: "sap-icon://monitor-payments", label: "In Credit Return", position: 10}
    ]
  };
     
      if (oEvent.getSource().getPressed()) {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oDataProcessFlowNodesHighlighted);
        this.getView().byId("processflow2").setModel(oModel);
        this.getView().byId("processflow2").updateModel();
        sap.m.MessageToast.show("Path in ProcessFlow has been highlighted");
      } else {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oDataProcessFlowNodes);
        this.getView().byId("processflow2").setModel(oModel);
        this.getView().byId("processflow2").updateModel();
        sap.m.MessageToast.show("ProcessFlow path highlighting is no more.. :)");
      };       
    },

    onZoomIn: function() {
      this.getView().byId("processflow2").zoomIn();
      sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow2").getZoomLevel());
    },

    onZoomOut: function() {
      this.getView().byId("processflow2").zoomOut();
      sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow2").getZoomLevel());
    }

});