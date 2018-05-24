jQuery.sap.declare("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.Component", {
  metadata : {
    rootView : "sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.V",
    dependencies : {
      libs : [
        "sap.m",
        "sap.ui.layout",
        "sap.ui.core",
        "sap.suite.ui.commons"
      ]
    },
    config : {
      sample : {
        files : [
          "V.view.xml",
          "C.controller.js"
        ]
      }
    }
  }
});