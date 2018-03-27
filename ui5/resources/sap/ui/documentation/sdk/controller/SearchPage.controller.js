/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/GroupHeaderListItem"],function(q,B,J,G){"use strict";return B.extend("sap.ui.documentation.sdk.controller.SearchPage",{onInit:function(){this.setModel(new J());this.bindListResults();this.getRouter().getRoute("search").attachPatternMatched(this._onTopicMatched,this);},bindListResults:function(){this.dataObject={data:[]};this.getModel().setData(this.dataObject);},_onTopicMatched:function(a){var t=this,Q=a.getParameter("arguments").searchParam;this.dataObject.searchTerm=Q;this._modelRefresh();try{this.hideMasterSide();}catch(e){q.sap.log.error(e);}var s="(category:topics) AND ("+encodeURIComponent(Q)+")";var b="(category:apiref) AND ("+encodeURIComponent(Q)+")";var c="(category:entity) AND ("+encodeURIComponent(Q)+")";var P=new Promise(function(r){q.ajax({url:"search?q="+s,dataType:"json",success:function(D,S,x){r(D,S,x);},error:function(){r([]);}});});var d=new Promise(function(r){q.ajax({url:"search?q="+b,dataType:"json",success:function(D,S,x){r(D,S,x);},error:function(){r([]);}});});var f=new Promise(function(r){q.ajax({url:"search?q="+c,dataType:"json",success:function(D,S,x){r(D,S,x);},error:function(){r([]);}});});Promise.all([P,d,f]).then(function(r){var D={},R=r[0][0]||{},o=r[1][0]||{},g=r[2][0]||{};R.matches=R.matches||[];o.matches=o.matches||[];g.matches=g.matches||[];D.success=R.success||o.success||g.success||false;D.totalHits=(R.totalHits+o.totalHits+g.totalHits)||0;D.matches=R.matches.concat(o.matches).concat(g.matches);t.processResult(D);}).catch(function(r){});},processResult:function(d){this.dataObject.data=[];this.dataObject.dataAPI=[];this.dataObject.dataDoc=[];this.dataObject.dataExplored=[];this.dataObject.AllLength=0;this.dataObject.APILength=0;this.dataObject.DocLength=0;this.dataObject.ExploredLength=0;if(d&&d.success){if(d.totalHits==0){q(".sapUiRrNoData").html("No matches found.");}else{for(var i=0;i<d.matches.length;i++){var D=d.matches[i];D.modifiedStr=D.modified+"";var m=D.modifiedStr.substring(0,4)+"/"+D.modifiedStr.substring(4,6)+"/"+D.modifiedStr.substring(6,8)+", "+D.modifiedStr.substring(8,10)+":"+D.modifiedStr.substring(10),n=D.path,s=false,c;if(n.indexOf("topic/")===0){n=n.substring(0,n.lastIndexOf(".html"));s=true;c="Documentation";this.dataObject.dataDoc.push({index:this.dataObject.DocLength,title:D.title?D.title:"Untitled",path:n,summary:D.summary?(D.summary+"..."):"",score:D.score,modified:m,category:c});this.dataObject.DocLength++;}else if(n.indexOf("entity/")===0){s=true;c="Samples";this.dataObject.dataExplored.push({index:this.dataObject.ExploredLength,title:D.title?D.title:"Untitled",path:n,summary:D.summary?(D.summary+"..."):"",score:D.score,modified:m,category:c});this.dataObject.ExploredLength++;}else if(n.indexOf("docs/api/symbols/")===0){n=n.substring("docs/api/symbols/".length,n.lastIndexOf(".html"));n="api/"+n;s=true;c="API Reference";this.dataObject.dataAPI.push({index:this.dataObject.APILength,title:D.title?D.title:"Untitled",path:n,summary:D.summary?(D.summary+"..."):"",score:D.score,modified:m,category:c});this.dataObject.APILength++;}else if(n.indexOf("docs/api/modules/")===0){n=n.substring("docs/api/modules/".length,n.lastIndexOf(".html")).replace(/_/g,".");n="api/"+n;s=true;c="API Reference";this.dataObject.dataAPI.push({index:this.dataObject.APILength,title:D.title?D.title:"Untitled",path:n,summary:D.summary?(D.summary+"..."):"",score:D.score,modified:m,category:c});this.dataObject.APILength++;}if(s){this.dataObject.data.push({index:i,title:D.title?D.title:"Untitled",path:n,summary:D.summary?(D.summary+"..."):"",score:D.score,modified:m,category:c});this.dataObject.AllLength++;}}}}else{q(".sapUiRrNoData").html("Search failed, please retry ...");}this._modelRefresh();},_modifyLinks:function(){var v=this.getView(),i=[].concat(v.byId("allList").getItems(),v.byId("apiList").getItems(),v.byId("documentationList").getItems(),v.byId("samplesList").getItems()),l=i.length,I;while(l--){I=i[l];if(I._getLinkSender){I._getLinkSender().setHref("#/"+I.getCustomData()[0].getValue());}}},_modelRefresh:function(){this.getModel().refresh();this._modifyLinks();},getGroupHeader:function(g){return new G({title:g.key,upperCase:false});},categoryAPIFormatter:function(c){return c==="API Reference";},categoryDocFormatter:function(c){return c==="Documentation";},categoryExploredFormatter:function(c){return c==="Samples";},onAllLoadMore:function(e){this.dataObject.visibleAllLength=e.getParameter("actual");this._modelRefresh();},onAPILoadMore:function(e){this.dataObject.visibleAPILength=e.getParameter("actual");this._modelRefresh();},onDocLoadMore:function(e){this.dataObject.visibleDocLength=e.getParameter("actual");this._modelRefresh();},onExploredLoadMore:function(e){this.dataObject.visibleExploredLength=e.getParameter("actual");this._modelRefresh();}});});
