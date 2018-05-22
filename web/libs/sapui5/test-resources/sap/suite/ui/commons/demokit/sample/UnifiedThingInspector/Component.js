jQuery.sap.declare("sap.suite.ui.commons.sample.UnifiedThingInspector.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.UnifiedThingInspector.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.UnifiedThingInspector.UnifiedThingInspector",
                includes : [ "UnifiedThingInspector/style.css" ],
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons",
                                "sap.m",
                                "sap.ui.layout",
                                "sap.ui.core"
                        ]
                },
                config : {
                        sample : {
                        		stretch : true,
                                files : [
                                        "UnifiedThingInspector.view.xml",
                                        "UnifiedThingInspector.controller.js",
                                        "DeliveryTable.fragment.xml",
                                        "GeneralFacetDetails.fragment.xml",
                                        "OrdersFacetDetails.fragment.xml",
                                        "ActionSheet.fragment.xml",
                                        "TransactionSheet.fragment.xml",
                                        "style.css"
                                ]
                        }
                }
        }
});