/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(function(){"use strict";var V={};V.decorateFiori=function(o,f,v){V._processCategoryTicker(o,f,v);};V.processBulletProperty=function(s,a){var p=a.plotArea;if(p){var k=['colorPalette','actualColor','additionalColor','forecastColor'];for(var i=0;i<k.length;++i){if(p.hasOwnProperty(k[i])){if(p[k[i]]){s.plotArea[k[i]]=p[k[i]];}else{delete s.plotArea[k[i]];}}}}};V.decorateBullet=function(o,f){if(!f||f.length===0){return;}jQuery.extend(true,o.properties,{plotArea:{}});var p=o.properties.plotArea;if(p.colorPalette){if(!p.actualColor||p.actualColor.length===0){p.actualColor=[p.colorPalette[0]];}if(!p.additionalColor||p.additionalColor.length===0){p.additionalColor=[p.colorPalette[1]];}}var n=f.length;var O=false;var a=0;var b=0;var h=0;for(var i=0;!O&&i<n;++i){var c=f[i].getUid();var v=f[i].getValues();if(v&&v.length){switch(c){case'color':h=true;break;case'primaryValues':O=true;break;case'actualValues':a+=v.length;break;case'additionalValues':case'forecastValues':b+=v.length;break;default:break;}}}if(O||(!h&&a<2)||b===0){if(!p.additionalColor){p.additionalColor=["sapUiChartPaletteSequentialHue2Light1"];}if(!p.forecastColor){p.forecastColor=["sapUiChartPaletteSequentialNeutralLight3"];}if(!p.actualColor){p.actualColor=["sapUiChartPaletteSequentialHue1Light1","sapUiChartPaletteQualitativeHue2","sapUiChartPaletteQualitativeHue3","sapUiChartPaletteQualitativeHue4","sapUiChartPaletteQualitativeHue5","sapUiChartPaletteQualitativeHue6","sapUiChartPaletteQualitativeHue7","sapUiChartPaletteQualitativeHue8","sapUiChartPaletteQualitativeHue9","sapUiChartPaletteQualitativeHue10","sapUiChartPaletteQualitativeHue11"];}}else{if(!p.additionalColor){p.additionalColor=["sapUiChartPaletteSequentialHue1Light2","sapUiChartPaletteSequentialHue2Light2","sapUiChartPaletteSequentialHue3Light2","sapUiChartPaletteSequentialNeutralLight2"];}if(!p.forecastColor){p.forecastColor=["sapUiChartPaletteSequentialHue1Light2","sapUiChartPaletteSequentialHue2Light2","sapUiChartPaletteSequentialHue3Light2","sapUiChartPaletteSequentialNeutralLight2"];}if(!p.actualColor){p.actualColor=["sapUiChartPaletteSequentialHue1","sapUiChartPaletteSequentialHue2","sapUiChartPaletteSequentialHue3","sapUiChartPaletteSequentialNeutral"];}}return o;};V.defaultFioriProperties=function(){return{'tooltip':{'visible':false},'general':{'groupData':true},'plotArea':{'isFixedDataPointSize':true,'dataLabel':{'hideWhenOverlap':true,'respectShapeWidth':true,'style':{'color':null}},'dataPointSize':{'min':(sap.ui.Device.system.tablet||sap.ui.Device.system.phone)?40:24,'max':96}},'interaction':{'behaviorType':'noHoverBehavior','selectability':{'mode':'multiple'},'zoom':{'enablement':'enabled','direction':'categoryAxis'},'enableKeyboard':true},'categoryAxis':{'label':{'angle':45,'rotation':'auto'}},'legendGroup':{'layout':{'position':'auto','respectPlotPosition':false},'forceToShow':true,},'legend':{'isScrollable':true}};};V._processCategoryTicker=function(o,f,v){if(!f||f.length===0){return;}jQuery.extend(true,o.properties,{categoryAxis:{axisTick:{}}});var a;var t=o.type;if(t==="info/heatmap"){jQuery.extend(true,o.properties,{categoryAxis2:{axisTick:{}}});a=o.properties.categoryAxis2.axisTick;}var b=o.properties.categoryAxis.axisTick;var l=f.length;var c=true;var s=null;var i,d,e,j;var m=0,g=0,h=0,k=0,n=0,p=false,q=false,r=0;for(i=0;i<l;++i){d=f[i].getUid();e=f[i].getValues();if(!e){continue;}if(d==="primaryValues"||d==="valueAxis"){m=e.length;}else if(d==="color"){g=e.length;p=e.indexOf("MeasureNamesDimension")>=0;}else if(d==="axisLabels"||d==="categoryAxis"){h=e.length;q=e.indexOf("MeasureNamesDimension")>=0;}else if(d==="actualValues"){k=e.length;}else if(d==="valueAxis2"){r=e.length;}else if(d==="categoryAxis2"){n=e.length;}}var u,w;if(["info/dual_horizontal_stacked_combination","info/dual_stacked_combination"].indexOf(t)>=0){u=1;w=1;}else{u=1;w=0;}var x,y;var z={};jQuery.extend(true,z,(v&&v.plotArea)||{},o.properties.plotArea);if(z&&z.dataShape&&z.dataShape.primaryAxis){x=z.dataShape.primaryAxis;y=Math.min(x.length,m);u=0;for(i=0;i<y;++i){if(x[i]==="bar"){u++;}}}if(z&&z.dataShape&&z.dataShape.secondaryAxis){x=z.dataShape.secondaryAxis;y=Math.min(x.length,r);w=0;for(i=0;i<y;++i){if(x[i]==="bar"){w++;}}}var A=u+w===1;if(t==="info/column"||t==="info/bar"){if(!(g>1||(g===1&&!p)||(g===1&&p&&m>1)||(!q&&!p&&m>1))){if(h>1){s=false;}else{c=false;}}}else if(["info/stacked_bar","info/stacked_column","info/100_stacked_bar","info/100_stacked_column","info/waterfall","info/horizontal_waterfall"].indexOf(t)>=0){if(h>1){s=false;}else{c=false;}}else if(["info/stacked_combination","info/horizontal_stacked_combination","info/dual_horizontal_stacked_combination","info/dual_stacked_combination"].indexOf(t)>=0){if(A){if(h>1){s=false;}else{c=false;}}}else if(["info/combination","info/dual_horizontal_combination","info/dual_combination"].indexOf(t)>=0){if(A&&(g===0||(g===1&&p))){if(h>1){s=false;}else{c=false;}}}else if(t==="info/bullet"||t==="info/vertical_bullet"){if(g===0&&k<=1){if(h>1){s=false;}else{c=false;}}}if(t==="info/heatmap"){if(!(b.visible===true||b.visible===false)){b.visible=(h>1);}if(!(a.visible===true||a.visible===false)){a.visible=(n>1);}if(b.shortTickVisible==null&&h>1){b.shortTickVisible=false;}if(a.shortTickVisible==null&&n>1){a.shortTickVisible=false;}}else{if(!(b.visible===true||b.visible===false)){b.visible=c;}if(b.shortTickVisible==null){b.shortTickVisible=s;}}};return V;});
