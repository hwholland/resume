(function(){"use strict";sap.ui.controller("sap.ovp.cards.charts.analytical.analyticalChart",{onInit:function(){sap.ovp.cards.charts.VizAnnotationManager.formatChartAxes();this.bFlag=true;this.busyDelegate={onBeforeRendering:function(){this.setBusy(true);}};this.freeDelegate={onAfterRendering:function(){this.setBusy(false);}};},onBeforeRendering:function(){if(this.bCardProcessed){return;}sap.ovp.cards.charts.VizAnnotationManager.validateCardConfiguration(this);var v=this.getView().byId("analyticalChart");if(!v){jQuery.sap.log.error(sap.ovp.cards.charts.VizAnnotationManager.constants.ERROR_NO_CHART+": ("+this.getView().getId()+")");}else{sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint(v,this);v.addEventDelegate(this.busyDelegate,v);sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(v);sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(v);var b=v.getDataset().getBinding("data");if(b.getPath()){b.attachDataReceived(jQuery.proxy(this.onDataReceived,this));b.attachDataRequested(jQuery.proxy(this.onDataRequested,this));}else{var n=sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");var c=this.getCardContentContainer();c.removeAllItems();c.addItem(n);}}this.bCardProcessed=true;},onDataReceived:function(e){var v=this.getView().byId("analyticalChart");if(this.bFlag==true){v.addEventDelegate(this.freeDelegate,v);this.bFlag=false;}else{setTimeout(function(){v.setBusy(false);},0);}sap.ovp.cards.charts.VizAnnotationManager.checkNoData(e,this.getCardContentContainer(),v);},onDataRequested:function(){var v=this.getView().byId("analyticalChart");v.removeEventDelegate(this.freeDelegate,v);v.setBusy(true);}});})();