jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.C", {

  //-----------------------------------------------------------------------------------------------------------------------------
  // Global Properties
  //-----------------------------------------------------------------------------------------------------------------------------

  aConnections: null, // Required to access elements in callback since they are coming from oEvent.
  sContainerId: "",   // Required in order to access the right container

  //-----------------------------------------------------------------------------------------------------------------------------
  // Event Handlers
  //-----------------------------------------------------------------------------------------------------------------------------

  onInit: function () {
    var oModel = new sap.ui.model.json.JSONModel();
    var viewPf = this.getView();
    oModel.setData(this._oLanesAndNodesWithLabels);
    var pf1 = viewPf.byId("processflow1");
    pf1.setModel(oModel);
    pf1.updateModel();

    var oModel2 = new sap.ui.model.json.JSONModel();
    oModel2.setData(this._oScrollableLanesAndNodesWithLabels);
    var pf2 = viewPf.byId("processflow2");
    pf2.setModel(oModel2);
    pf2.updateModel();
  },

  onLabelPress: function (oEvent) {
    aConnections = oEvent.getParameter("connections");
    sContainerId = oEvent.getSource().getId().split("-")[2];
    var oSelectedLabel = oEvent.getParameter("selectedLabel");
    var oListData = this._getListData(aConnections);
    var oItemTemplate = new sap.m.StandardListItem({ title: "{title}", info: "{info}" });
    var oList = this._createList(oListData, oItemTemplate);

    var oBeginButton = new sap.m.Button({
      text: "Action1",
      type: sap.m.ButtonType.Reject,
      press: function () {
        oResponsivePopover.setShowCloseButton(false);
      }
    });

    var oEndButton = new sap.m.Button({
      text: "Action2",
      type: sap.m.ButtonType.Accept,
      press: function () {
        oResponsivePopover.setShowCloseButton(true);
      }
    });

    var oResponsivePopover = sap.ui.getCore().byId("__popover");
    oResponsivePopover = oResponsivePopover || new sap.m.ResponsivePopover( "__popover", {
      placement: sap.m.PlacementType.Auto,
      title: "Paths[" + aConnections.length + "]",
      content: [oList],
      showCloseButton: false,
      afterClose: function(){
        // Uncomment this code to reset "selected" path on close of popover on none mobile devices.
        //if (!sap.ui.Device.system.mobile) {
        //this.getView().byId("processflow1").setSelectedPath(null, null);
        //}
        oResponsivePopover.destroy();
        this.getView().byId(sContainerId).setFocusToLabel(oSelectedLabel);
      }.bind(this),
      beginButton: oBeginButton,
      endButton: oEndButton,
    });
    if (sap.ui.Device.system.phone) {
      oResponsivePopover.setShowCloseButton(true);
    }
    oResponsivePopover.openBy(oSelectedLabel);
  },

  onListItemPress: function (oEvent) {
    var selectedItem = oEvent.getParameter("listItem");
    var aSourceTarget = selectedItem.getInfo().split("-");
    var sSourceId = aSourceTarget[0];
    var sTargetId = aSourceTarget[1];
    this._getItemBySourceAndTargetId(sSourceId, sTargetId);
  },

  onHideConnectionLabels: function (oEvent) {
    if (this.getView().byId("processflow1").getShowLabels()) {
      this.getView().byId("processflow1").setShowLabels(false);
      this.getView().byId("processflow1").rerender();
    }
    else {
      this.getView().byId("processflow1").setShowLabels(true);
      this.getView().byId("processflow1").rerender();
    }
  },

  onOnError: function (oEvent) {
    var sDisplay = "Exception happened : ";
    sDisplay += oEvent.getParameters().text;
    sap.m.MessageToast.show(sDisplay);
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

  onNodePress: function (oEvent) {
    sap.m.MessageToast.show("Node with id " + oEvent.getParameters().getNodeId() + " pressed");
  },

  onHighlightPath: function () {
    if (!this._isHighlighted){
      var oModel = this.getView().byId("processflow1").getModel();
      oModel.setData(this._oLanesAndNodesWithLabelsHighlighted);
      this.getView().byId("processflow1").updateModel();
      sap.m.MessageToast.show("Path has been highlighted");
      this._isHighlighted = true;
    }
    else {
      var oModel = this.getView().byId("processflow1").getModel();
      oModel.setData(this._oLanesAndNodesWithLabels);
      this.getView().byId("processflow1").updateModel();
      sap.m.MessageToast.show("Path is not highlighted");
      this._isHighlighted = false;
    }
  },

  onResetSelection: function() {
    this.getView().byId("processflow1").setSelectedPath(null, null);
  },

  // ProcessFlow 2: Scrollable

  onZoomInS: function () {
    this.getView().byId("processflow2").zoomIn();
    this.getView().byId("processflow2").getZoomLevel();
    sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow2").getZoomLevel());
  },

  onZoomOutS: function () {
    this.getView().byId("processflow2").zoomOut();
    this.getView().byId("processflow2").getZoomLevel();
    sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow2").getZoomLevel());
  },

  onLabelPressS: function (oEvent) {
    var oSelectedLabel = oEvent.getParameter("selectedLabel");
    sap.m.MessageToast.show("Label pressed: " + oSelectedLabel.getText());

  },

  //-----------------------------------------------------------------------------------------------------------------------------
  // Helpers
  //-----------------------------------------------------------------------------------------------------------------------------

  _createList: function (data, itemTemplate) {
    var oModel = new sap.ui.model.json.JSONModel();

    // Sets the data for the model
    oModel.setData(data);

    // Sets the model to the list
    var oTmpList = new sap.m.List({
      mode: sap.m.ListMode.SingleSelectMaster,
      selectionChange: this.onListItemPress.bind(this)
    });
    oTmpList.setModel(oModel);

    // Binds Aggregation
    oTmpList.bindAggregation("items", "/navigation", itemTemplate);

    return oTmpList;
  },

  _getListData: function () {
    var aNavigation = [];
    for (var i = 0; i < aConnections.length; i++) {
      aNavigation.push(this._createListEntryObject(aConnections[i]));
    }

    return {
      navigation: aNavigation
    };
  },

  _createListEntryObject: function (oConnection) {
    var sId = oConnection.sourceNode.getNodeId() + "-" + oConnection.targetNode.getNodeId();
    var sTitle= oConnection.label.getText();

    return {
      title: sTitle,
      info: sId,
      type: "Active",
    };
  },

  _getItemBySourceAndTargetId: function (sSourceId, sTargetId) {
    for (var i = 0; i < aConnections.length; i++) {
      if (aConnections[i].sourceNode.getNodeId() === sSourceId && aConnections[i].targetNode.getNodeId() === sTargetId) {
        this.getView().byId(sContainerId).setSelectedPath(sSourceId, sTargetId);
      }
    }
  },
  //-----------------------------------------------------------------------------------------------------------------------------
  // Models
  //-----------------------------------------------------------------------------------------------------------------------------

  _oLanesAndNodesWithLabels: {
    nodes:
      [
        {
          id: "1", lane: "0", title: "Sales Order 1", titleAbbreviation: "SO 1", children: [
          {
            nodeId: 10,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId1To10",
              text: "3m",
              enabled: true,
              icon: "sap-icon://message-success",
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive,
            })
          },
          {
            nodeId: 11,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId1To11",
              text: "2h 15m",
              enabled: false,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral,
            })
          },
          {
            nodeId: 12,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId1To12",
              text: "2d",
              enabled: true,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical,
            })
          },
          {
            nodeId: 13,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId1To13",
              text: "2w 3d",
              icon: "sap-icon://message-error",
              enabled: true,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative,
            })
        }],
          isTitleClickable: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]
        },
        {
          id: "10", lane: "1", title: "Outbound Delivery 40", titleAbbreviation: "OD 40", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, children: [
          {
            nodeId: 14,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId10To14",
              text: "6 years",
              icon: "sap-icon://process",
              enabled: true,
              priority: 6,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative
            })
          },
          {
            nodeId: 21,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId10To21",
              enabled: true,
              text: "3d",
              icon: "sap-icon://message-success",
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
            })
          }
          ],
          state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
        },
        {
          id: "11", lane: "1", title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [
          {
            nodeId: 14,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
            id: "myButtonId11To14",
            icon: "sap-icon://process",
            enabled: true,
            priority: 7,
            state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative
           })
          },
          {
            nodeId: 21,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "myButtonId11To21",
              text: "2d 1h",
              enabled: true,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical
            })
          }
          ],
          state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, stateText: "Neutral", texts: ["text 1", "text 2"]
        },
       { id: "12", lane: "1", title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [
         {
           nodeId: 14,
           connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
             id: "myButtonId12To14",
             text: "2h 15m",
             enabled: true,
             priority: 7,
             state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
           })
         }
       ],
       state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
        },
        { id: "13", lane: "1", title: "Outbound Delivery 47", titleAbbreviation: "OD 47", children: [
          {
            nodeId: 14,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
            id: "myButtonId13To14",
            text: "6h 17m",
            enabled: true,
            priority: 7,
            state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral
          })
        }
        ],
        state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK", texts: ["text 1", "text 2"]
       },
       { id: "14", lane: "1", title: "Outbound Delivery 48", titleAbbreviation: "OD 48", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, children: [
        {
          nodeId: 20,
          connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
          id: "myButtonId14To20",
          text: "1d",
          enabled: true,
          state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral
        })
       }
       ],
       state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
       },
       { id: "20", lane: "2", title: "Invoice 9", titleAbbreviation: "I 9", children: [30], state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: true },
       { id: "21", lane: "2", title: "Invoice Planned", titleAbbreviation: "IP", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative },
       { id: "30", lane: "3", title: "Accounting Document 7", titleAbbreviation: "AD 7", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status" }
      ],
    lanes:
      [
        { id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0 },
        { id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1 },
        { id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2 },
        { id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3 }
      ]
  },

  _oScrollableLanesAndNodesWithLabels: {
    nodes:
      [
        {
          id: "1", lane: "0", title: "Sales Order 1", titleAbbreviation: "SO 1", children: [
          {
            nodeId: 10,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "buttonId1To10",
              text: "This is a label with state positive",
              enabled: true,
              icon: "sap-icon://message-success",
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive,
            })
          },
          {
            nodeId: 11,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "buttonId1To11",
              text: "This is a label with state neutral",
              enabled: true,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral,
            })
          }],
          isTitleClickable: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status", texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]
        },
        {
          id: "10", lane: "3", title: "Outbound Delivery 40", titleAbbreviation: "OD 40", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, children: [
          {
            nodeId: 20,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "buttonId10To20",
              enabled: true,
              text: "Ipsum lorem",
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
            })
          }],
          state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
        },
        {id: "11", lane: "1", title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [
          {
           nodeId: 12,
           connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
           id: "buttonId11To12",
           text: "This is a label with state negative",
           icon: "sap-icon://process",
           enabled: true,
           priority: 6,
           state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative
          })
       }],
        state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, stateText: "Neutral", texts: ["text 1", "text 2"]},
       {
         id: "12", lane: "2", title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [
         {
           nodeId: 20,
           connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
             id: "buttonId12To20",
             text: " Lorem ipsum dolor sit amet",
             enabled: true,
             priority: 7,
             state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
           })
         }
       ],
       state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
       },
       { id: "20", lane: "4", title: "Invoice 9", titleAbbreviation: "I 9", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral}
     ],
    lanes:
      [
        { id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0 },
        { id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1 },
        { id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2 },
        { id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3 },
        { id: "4", icon: "sap-icon://money-bills", label: "Terminated", position: 4 }
      ]},

  _oLanesAndNodesWithLabelsHighlighted: {
    nodes:
        [
          {
            id: "1", lane: "0", title: "Sales Order 1", titleAbbreviation: "SO 1", children: [
            {
              nodeId: 10,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id1To10",
                text: "3m",
                enabled: true,
                icon: "sap-icon://message-success",
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive,
              })
            },
            {
              nodeId: 11,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id1To11",
                text: "2h 15m",
                enabled: false,
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral,
              })
            },
            {
              nodeId: 12,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id1To12",
                text: "2d",
                enabled: true,
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical,
              })
            },
            {
                nodeId: 13,
                connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                  id: "Id1To13",
                  text: "2w 3d",
                  icon: "sap-icon://message-error",
                  enabled: true,
                  state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative,
                })
          }],
            isTitleClickable: true, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, highlighted: true, focused: false, stateText: "OK status", texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]
          },
          {
            id: "10", lane: "1", title: "Outbound Delivery 40", titleAbbreviation: "OD 40", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, children: [
            {
              nodeId: 14,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id10To14",
                text: "6 years",
                icon: "sap-icon://process",
                enabled: true,
                priority: 6,
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative
              })
            },
            {
              nodeId: 21,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id10To21",
                enabled: true,
                text: "3d",
                icon: "sap-icon://message-success",
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
              })
            }
            ],
            state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
          },
          {
            id: "11", lane: "1", title: "Outbound Delivery 43", titleAbbreviation: "OD 43", children: [
            {
              nodeId: 14,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "Id11To14",
              icon: "sap-icon://process",
              enabled: true,
              priority: 7,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Negative
             })
            },
            {
              nodeId: 21,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
                id: "Id11To21",
                text: "2d 1h",
                enabled: true,
                state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Critical
              })
            }
            ],
            state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, highlighted: true, stateText: "Neutral", texts: ["text 1", "text 2"]
          },
         { id: "12", lane: "1", title: "Outbound Delivery 45", titleAbbreviation: "OD 45", children: [
           {
             nodeId: 14,
             connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
               id: "Id12To14",
               text: "2h 15m",
               enabled: true,
               priority: 7,
               state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Positive
             })
           }
         ],
         state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
          },
          { id: "13", lane: "1", title: "Outbound Delivery 47", titleAbbreviation: "OD 47", children: [
            {
              nodeId: 14,
              connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
              id: "Id13To14",
              text: "6h 17m",
              enabled: true,
              priority: 7,
              state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral
            })
          }
          ],
          state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK", texts: ["text 1", "text 2"]
         },
         { id: "14", lane: "1", title: "Outbound Delivery 48", titleAbbreviation: "OD 48", type: sap.suite.ui.commons.ProcessFlowNodeType.Aggregated, children: [
          {
            nodeId: 20,
            connectionLabel: new sap.suite.ui.commons.ProcessFlowConnectionLabel({
            id: "Id14To20",
            text: "1d",
            enabled: true,
            state: sap.suite.ui.commons.ProcessFlowConnectionLabelState.Neutral
          })
         }
         ],
         state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, stateText: "NOT OK", texts: ["text 1", "text 2"]
         },
         { id: "20", lane: "2", title: "Invoice 9", titleAbbreviation: "I 9", children: [30], state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, focused: true},
         { id: "21", lane: "2", title: "Invoice Planned", titleAbbreviation: "IP", children: null, highlighted: true, state: sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative },
         { id: "30", lane: "3", title: "Accounting Document 7", titleAbbreviation: "AD 7", children: null, state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, stateText: "OK status" }
        ],
      lanes:
        [
          { id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0 },
          { id: "1", icon: "sap-icon://monitor-payments", label: "In Delivery", position: 1 },
          { id: "2", icon: "sap-icon://payment-approval", label: "In Invoice", position: 2 },
          { id: "3", icon: "sap-icon://money-bills", label: "In Accounting", position: 3 }
        ]
    },

}
);
