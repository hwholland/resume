define(['sap/viz/framework/common/util/TypeUtils',
    './Overlay', './CustomRenderers', './Interaction'
], function(TypeUtils,
    Overlay, CustomRenderers, Interaction) {

    var FlagBarChart = sap.viz.extapi.core.BaseCustomization.extend();

    FlagBarChart.id = "com.sap.viz.custom.infoColumn";
    FlagBarChart.chartType = "info/bar";
    //FlagBarChart.customOverlay = Overlay;
    FlagBarChart.customRenderers = CustomRenderers;
    //FlagBarChart.customInteraction = Interaction;
    return FlagBarChart;
});