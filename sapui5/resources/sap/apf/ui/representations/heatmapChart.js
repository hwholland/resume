/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.heatmapChart");jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
sap.apf.ui.representations.heatmapChart=function(a,p){sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.HEATMAP_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.HEATMAP;this._addDefaultKind();};
sap.apf.ui.representations.heatmapChart.prototype=Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);sap.apf.ui.representations.heatmapChart.prototype.constructor=sap.apf.ui.representations.heatmapChart;
sap.apf.ui.representations.heatmapChart.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR;}});this.parameter.dimensions.forEach(function(d,i){if(d.kind===undefined){d.kind=i===0?sap.apf.core.constants.representationMetadata.kind.XAXIS:sap.apf.core.constants.representationMetadata.kind.XAXIS2;}});};
sap.apf.ui.representations.heatmapChart.prototype.setVizPropsForSpecificRepresentation=function(){this.chart.setVizProperties({categoryAxis2:{visible:true,title:{visible:true},label:{visible:true}}});};
sap.apf.ui.representations.heatmapChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation=function(){this.thumbnailChart.setVizProperties({categoryAxis2:{visible:false,title:{visible:false}}});};
sap.apf.ui.representations.heatmapChart.prototype.getAxisFeedItemId=function(k){var s=sap.apf.core.constants.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.XAXIS2:a=sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS2;break;case s.SECTORCOLOR:a=sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;break;default:break;}return a;};