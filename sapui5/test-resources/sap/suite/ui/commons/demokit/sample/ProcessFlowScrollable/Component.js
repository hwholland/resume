jQuery.sap.declare("sap.suite.ui.commons.sample.ProcessFlow.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ProcessFlowScrollable.Component", {

  metadata : {
    rootView : "sap.suite.ui.commons.sample.ProcessFlowScrollable.PFScrollV",
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
          "PFScrollV.view.xml",
          "PFScrollC.controller.js"
        ]
      }
    }
  }
});