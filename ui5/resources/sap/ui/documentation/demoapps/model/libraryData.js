/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/documentation/library'],function(q,l){"use strict";function c(d,L,s){var b=[];if(q.isPlainObject(d.links)){b=Object.keys(d.links).map(function(k){return{name:k,ref:d.links[k]};});}var A={lib:d.namespace||s,name:d.text,icon:d.icon,desc:d.desc,config:d.config,teaser:d.teaser,category:d.category,ref:(d.resolve==="lib"?L:"")+d.ref,links:b};return A;}function a(L,d){var C=["Showcase","Tool","Tutorial","Template","RTA","Misc"];var D={};C.forEach(function(s){D[s]=[];});var o={demoApps:[],demoAppsByCategory:[]};for(var i=0;i<L.length;i++){var b=d[L[i]].demo;if(!b){continue;}if(b.links&&b.links.length>0){for(var j=0;j<b.links.length;j++){var e=c(b.links[j],d[L[i]].libraryUrl,b.text);o.demoApps.push(e);if(C.indexOf(e.category)<0){q.sap.log.warning("Demo app category \""+e.category+"\" not found, correcting demo app \""+e.name+"\" to \"Misc\"");e.category="Misc";}D[e.category].push(e);}}}Object.keys(D).forEach(function(k){if(D[k].length===0){return;}o.demoAppsByCategory.push([{categoryId:k}]);var f=o.demoAppsByCategory.push([]);var g=0;for(var i=0;i<D[k].length;i++){g++;if(D[k][i].teaser){g++;}if(g>4){f=o.demoAppsByCategory.push([]);g=0;}o.demoAppsByCategory[f-1].push(D[k][i]);}});return o;}return{fillJSONModel:function(m){function h(L,d){m.setProperty("/bFooterVisible",true);if(!L){return;}var M=m.getData();m.setData(q.extend(M,a(L,d)));}m.setProperty("/bFooterVisible",false);l._loadAllLibInfo("","_getDocuIndex",h);}};});
