/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/JSDocUtil","sap/ui/documentation/sdk/controller/util/APIInfo"],function(q,B,J,a,A){"use strict";return B.extend("sap.ui.documentation.sdk.controller.ApiDetailDeprecatedExperimental",{onInit:function(){this.setModel(new J(),"deprecatedAPIs");this.setModel(new J(),"experimentalAPIs");this.getRouter().getRoute("deprecated").attachPatternMatched(this._onTopicDeprecatedMatched,this);this.getRouter().getRoute("experimental").attachPatternMatched(this._onTopicExperimentalMatched,this);this.getView().attachBrowserEvent("click",this.onJSDocLinkClick,this);this._currentMedia=this.getView()._getCurrentMediaContainerRange();this._hasMatched=false;},onBeforeRendering:function(){this.getView()._detachMediaContainerWidthChange(this._resizeMessageStrip,this);},onAfterRendering:function(){this._resizeMessageStrip();this.getView()._attachMediaContainerWidthChange(this._resizeMessageStrip,this);},onExit:function(){this.getView().detachBrowserEvent("click",this.onJSDocLinkClick,this);this.getView()._detachMediaContainerWidthChange(this._resizeMessageStrip,this);},_onTopicDeprecatedMatched:function(e){if(this._hasMatched){return;}this._hasMatched=true;A.getDeprecatedPromise().then(function(d){this.getModel("deprecatedAPIs").setData(d);q.sap.delayedCall(0,this,this._prettify);}.bind(this));},_onTopicExperimentalMatched:function(e){if(this._hasMatched){return;}this._hasMatched=true;A.getExperimentalPromise().then(function(d){this.getModel("experimentalAPIs").setData(d);q.sap.delayedCall(0,this,this._prettify);}.bind(this));},_prettify:function(){q('pre').addClass('prettyprint');window.prettyPrint();},compareVersions:function(v,b){var w="WITHOUT VERSION";if(v===w||!v){return-1;}if(b===w||!b){return 1;}var c=v.split(".");var d=b.split(".");var e=parseInt(c[0],10);var f=parseInt(c[1],10);var g=parseInt(d[0],10);var h=parseInt(d[1],10);if(e>g||(e===g&&f>h)){return-1;}if(g>e||(g===e&&h>f)){return 1;}return 0;},formatTitle:function(t){if(t==="Without Version"){return t;}else{return"As of "+t;}},formatDescription:function(t,s){if(s){t="As of version "+s+", "+t;}t=this.formatLinks(t);t=t.replace("<p>",'');t=t.replace("</p>",'');return t;},formatSenderLink:function(c,e,E){if(E==="methods"){return c+"#"+e;}if(E==="events"){return c+"#events:"+e;}if(E==="class"){return c;}return"";},onApiPress:function(c){var C=c.getSource().getCustomData(),s=C[0].getValue(),e=C[1].getValue();if(C[3].getValue()){e=s+"."+e;}this.getRouter().navTo("apiId",{id:s,entityId:e,entityType:C[2].getValue()},false);},formatLinks:function(t){return a.formatTextBlock(t,{linkFormatter:function(b,c){var h;if(b.match("://")){return'<a target="_blank" href="'+b+'">'+(c||b)+'</a>';}b=b.trim().replace(/\.prototype\./g,"#");h=b.indexOf("#");c=c||b;if(h<0){var l=b.lastIndexOf("."),C=b.substring(0,l),m=b.substring(l+1),d=m;if(d){if(d.static===true){b=C+'/methods/'+C+'.'+m;}else{b=C+'/methods/'+m;}}}if(h===0){return"<code>"+b.slice(1)+"</code>";}if(h>0){b=b.slice(0,h)+'/methods/'+b.slice(h+1);}return"<a class=\"jsdoclink\" href=\"javascript:void(0);\" target=\""+b+"\">"+c+"</a>";}});},onJSDocLinkClick:function(e){var r="apiId",j=e.target.classList.contains("jsdoclink"),c=this.getOwnerComponent(),t=e.target.getAttribute("target"),n;if(!j||!t){return;}if(t.indexOf('/')>=0){n=t.split('/');c.getRouter().navTo(r,{id:n[0],entityType:n[1],entityId:n[2]},false);}else{c.getRouter().navTo(r,{id:t},false);}e.preventDefault();},_resizeMessageStrip:function(m){var v=this.getView();m=m||v._getCurrentMediaContainerRange();var n=m.name,M=this.getView().byId("deprecatedAPIStripContainer")||this.getView().byId("experimentalAPIStripContainer");if(!M){return;}if(n==="Desktop"||n==="LargeDesktop"){M.setWidth("calc(100% - 3rem)");}else if(n==="Tablet"||n==="Phone"){M.setWidth("calc(100% - 2rem)");}}});});
