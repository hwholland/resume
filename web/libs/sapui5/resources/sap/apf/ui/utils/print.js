/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.utils.print");jQuery.sap.require("sap.apf.ui.utils.formatter");jQuery.sap.require("sap.viz.ui5.types.legend.Common");
sap.apf.ui.utils.PrintHelper=function(I){"use strict";var c=I.oCoreApi;var u=I.uiApi;var f=I.oFilterIdHandler;var n,C,a;this.oPrintLayout={};function _(){++n;if(a===n){C.resolve();}}function b(o){if(!jQuery.isEmptyObject(o.oPrintLayout)){o.oPrintLayout.removeContent();}jQuery('#apfPrintArea').remove();jQuery("body").append('<div id="apfPrintArea"></div>');u.createApplicationLayout(false).setBusy(true);}function d(){var i=new Date();var A=c.getApplicationConfigProperties().appName;var s=u.getAnalysisPath().oSavedPathName.getTitle();var j=new sap.ui.core.HTML({id:'idAPFHeaderForFirstPage',content:['<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> '+c.getTextHtmlEncoded(A)+' : '+jQuery.sap.encodeHTML(s)+'</p>','<p class="printHeaderDate"> '+i.toTimeString()+' </p></div><div class="clear"></div>'].join(""),sanitizeContent:true});return j;}function e(){var i,j,l,F,A,m,o,p,q,r,s,S,t;var v=[],w=[],x="",y="",z=[],B=[],D=[],E=[],G={};var H=u.getEventCallback(sap.apf.core.constants.eventTypes.printTriggered);var J={getTextNotHtmlEncoded:c.getTextNotHtmlEncoded};var K=f.getAllInternalIds();if(K.length>0){for(i=0;i<K.length;i++){A=f.get(K[i]).getExpressions();v.push(A[0]);}}function L(){function N(P){y="";B=[];r=new sap.apf.ui.utils.formatter({getEventCallback:u.getEventCallback.bind(u),getTextNotHtmlEncoded:c.getTextNotHtmlEncoded},P);y=P.label;B.push(r.getFormattedValue(P.name,v[i][j].value));}for(i=0;i<v.length;i++){for(j=0;j<v[i].length;j++){q=v[i][j];c.getMetadataFacade().getProperty(v[i][j].name,N);q["sName"]=y;q["value"]=B;w.push(q);}}return w;}if(H!==undefined){D=H.apply(J,v)||[];D=(D.length>0)?D:L();}else{D=L();}s=u.getFacetFilterForPrint();function M(S){z=[];S.forEach(function(N){z.push(N.getText());});}if(s){F=s.getLists();for(l=0;l<F.length;l++){S=[];G={};G.sName=F[l].getTitle();if(!F[l].getSelectedItems().length){S=F[l].getItems();}else{S=F[l].getSelectedItems();}M(S);G.value=z;E.push(G);}}p=D.length>0?D.concat(E):E;t=new sap.ui.layout.VerticalLayout({id:'idAPFFacetAndFooterLayout'});for(i=0;i<p.length;i++){y=p[i].sName;for(j=0;j<p[i].value.length;j++){if(j!==p[i].value.length-1){x+=p[i].value[j]+", ";}else{x+=p[i].value[j];}}m=new sap.m.Text({text:y}).addStyleClass("printFilterName");o=new sap.m.Text({text:x}).addStyleClass("printFilterValue");t.addContent(m);t.addContent(o);x="";}return t;}function g(i,j){var m;var l=new Date();var A=c.getApplicationConfigProperties().appName;var s=u.getAnalysisPath().oSavedPathName.getTitle();if(!A){m=c.createMessageObject({code:"6003",aParameters:["sAppName"]});c.putMessage(m);}var o=new sap.ui.core.HTML({id:'idAPFHeaderForEachStep'+i,content:['<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> '+c.getTextHtmlEncoded(A)+' : '+jQuery.sap.encodeHTML(s)+'</p>','<p class="printHeaderDate"> '+l.toTimeString()+' </p></div><div class="clear"></div>','<div class="printChipName"><p>'+c.getTextHtmlEncoded("print-step-number",[i,j])+'</p></div>'].join(""),sanitizeContent:true});return o;}function h(s){var i,m,p,j=false,r={};var S=c.getTextNotHtmlEncoded(s.title);var o=s.getSelectedRepresentation();var l=o.bIsAlternateView?o.toggleInstance:o;if(o.bIsAlternateView){i=s.getSelectedRepresentation().getData();m=s.getSelectedRepresentation().getMetaData();l.setData(i,m);}if(l.type===sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION){p=l.getPrintContent(S);r=p.oTableForPrint.getContent()[0];var q=p.aSelectedListItems;r.attachUpdateFinished(function(){q.forEach(function(t){r.setSelectedItem(t);});_();});r.setWidth("1000px");}else{p=l.getPrintContent(S);r=p.oChartForPrinting;if(r.vizSelection){r.attachRenderComplete(function(){r.vizSelection(p.aSelectionOnChart);_();});}else{r.attachInitialized(function(){r.selection(p.aSelectionOnChart);_();});}}if(l.bIsLegendVisible===undefined||l.bIsLegendVisible===true){j=true;}if(r.setVizProperties){r.setVizProperties({legend:{visible:j},sizeLegend:{visible:j}});}else{if(r.setLegend!==undefined){r.setLegend(new sap.viz.ui5.types.legend.Common({visible:j}));}if(r.setSizeLegend!==undefined){r.setSizeLegend(new sap.viz.ui5.types.legend.Common({visible:j}));}}return r;}function k(s,i,j){var S;var o=new sap.ui.layout.VerticalLayout({id:'idAPFChartLayout'+i});o.addContent(h(s));S=new sap.ui.layout.VerticalLayout({id:'idAPFStepLayout'+i,content:[g(i,j),o]}).addStyleClass("representationContent");return S;}this.doPrint=function(){var i,j,l,o,m,t,s,S,p;var q="",r=2000,v=this;n=0;var A=c.getSteps();a=A.length;this.oPrintLayout=new sap.ui.layout.VerticalLayout({id:"idAPFPrintLayout"});b(this);C=jQuery.Deferred();if(a===0){C.resolve();}p=new sap.ui.layout.VerticalLayout({id:'idAPFPrintFirstPageLayout',content:[d(),e()]}).addStyleClass("representationContent");this.oPrintLayout.addContent(p);for(j=0;j<A.length;j++){l=parseInt(j,10)+1;this.oPrintLayout.addContent(k(A[j],l,A.length));}this.oPrintLayout.placeAt("apfPrintArea");if(jQuery(".v-geo-container").length){r=4000;}window.setTimeout(function(){u.createApplicationLayout(false).setBusy(false);},r-150);window.setTimeout(function(){jQuery("#"+v.oPrintLayout.sId+" > div:not(:last-child)").after("<div class='page-break'> </div>");q=v.oPrintLayout.getDomRef();t=jQuery('#apfPrintArea .sapUiTable');if(t.length){m=jQuery('#apfPrintArea .printTable .sapMListTblHeader .sapMListTblCell').length;if(m>11){jQuery("#setPrintMode").remove();jQuery("<style id='setPrintMode' > @media print and (min-resolution: 300dpi) { @page {size : landscape;}}</style>").appendTo("head");}else{jQuery("#setPrintMode").remove();jQuery("<style id='setPrintMode'>@media print and (min-resolution: 300dpi) { @page {size : portrait;}}</style>").appendTo("head");}}jQuery("#apfPrintArea").empty();jQuery("#sap-ui-static > div").hide();jQuery("#apfPrintArea").append(jQuery(q).html());for(i=0;i<jQuery("#apfPrintArea").siblings().length;i++){jQuery("#apfPrintArea").siblings()[i].hidden=true;}C.then(function(){window.print();});window.setTimeout(function(){for(i=0;i<jQuery("#apfPrintArea").siblings().length;i++){jQuery("#apfPrintArea").siblings()[i].hidden=false;}for(s=0;s<A.length;s++){S=A[s].getSelectedRepresentation();S=S.bIsAlternateView?S.toggleInstance:S;if(S.type!==sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION){o=v.oPrintLayout.getContent()[s+1].getContent()[1].getContent()[0];o.destroy();o=null;}}v.oPrintLayout.destroy();v.oPrintLayout=null;},10);},r);};};