jQuery.sap.declare("sap.suite.ui.commons.sample.BulletChartNoForecast.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.BulletChartNoForecast.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.BulletChartNoForecast.BulletChartNoForecast",
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "BulletChartNoForecast.view.xml",
                                        "BulletChartNoForecast.controller.js"
                                ]
                        }
                }
        }
});