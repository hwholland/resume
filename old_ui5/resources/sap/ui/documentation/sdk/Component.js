/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/UIComponent","sap/ui/Device","sap/ui/documentation/sdk/model/models","sap/ui/documentation/sdk/controller/ErrorHandler","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/ConfigUtil","sap/ui/documentation/sdk/controller/util/APIInfo","sap/ui/documentation/sdk/util/DocumentationRouter","sap/m/ColumnListItem"],function(q,U,D,m,E,J,C,A){"use strict";var t=[],l={},T=1000000;return U.extend("sap.ui.documentation.sdk.Component",{metadata:{manifest:"json",includes:["css/style.css"]},init:function(){this._oErrorHandler=new E(this);this.setModel(m.createDeviceModel(),"device");this.setModel(new J(),"treeData");this.setModel(new J(),"libsData");this.setModel(new J(),"versionData");U.prototype.init.apply(this,arguments);this.loadVersionInfo();this.getRouter().initialize();sap.m.TablePopin.prototype.onfocusin=function(){};},destroy:function(){this._oErrorHandler.destroy();this._oConfigUtil.destroy();this._oConfigUtil=null;U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(q(document.body).hasClass("sapUiSizeCozy")||q(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass="";}this._sContentDensityClass="sapUiSizeCompact";}return this._sContentDensityClass;},getConfigUtil:function(){if(!this._oConfigUtil){this._oConfigUtil=new C(this);}return this._oConfigUtil;},loadVersionInfo:function(){if(!this._oVersionInfoPromise){this._oVersionInfoPromise=sap.ui.getVersionInfo({async:true}).then(this._bindVersionModel.bind(this));}return this._oVersionInfoPromise;},fetchAPIIndex:function(){if(this._indexPromise){return this._indexPromise;}this._indexPromise=new Promise(function(r,a){A.getIndexJsonPromise().then(function(d){this._parseLibraryElements(d);this._bindTreeModel(t);r(d);}.bind(this));}.bind(this));return this._indexPromise;},_parseLibraryElements:function(L){for(var i=0;i<L.length;i++){if(!L[i].children){l[L[i].name]=L[i];}this._addElementToTreeData(L[i]);if(L[i].children){this._parseLibraryElements(L[i].children,true);}}},_addElementToTreeData:function(j){var n,a=this.aAllowedMembers;if(a.indexOf(j.visibility)!==-1){if(j.kind!=="namespace"){var N=j.name.split("."),b=N.pop(),s=N.join("."),o=this._createTreeNode(b,j.name,j.name===this._topicId,j.lib),e=this._findNodeNamespaceInTreeStructure(s);if(e){if(!e.nodes){e.nodes=[];}e.nodes.push(o);}else if(s){n=this._createTreeNode(s,s,s===this._topicId,j.lib);n.nodes=[];n.nodes.push(o);t.push(n);this._removeDuplicatedNodeFromTree(s);}else{n=this._createTreeNode(j.name,j.name,j.name===this._topicId,j.lib);t.push(n);}}else{n=this._createTreeNode(j.name,j.name,j.name===this._topicId,j.lib);t.push(n);}}},_createTreeNode:function(a,n,i,L){var o={};o.text=a;o.name=n;o.ref="#/api/"+n;o.isSelected=i;o.lib=L;return o;},_findNodeNamespaceInTreeStructure:function(n,a){a=a||t;for(var i=0;i<a.length;i++){var o=a[i];if(o.name===n){return o;}if(o.nodes){var c=this._findNodeNamespaceInTreeStructure(n,o.nodes);if(c){return c;}}}},_removeNodeFromNamespace:function(n,N){for(var i=0;i<N.nodes.length;i++){if(N.nodes[i].text===n){N.nodes.splice(i,1);return;}}},_removeDuplicatedNodeFromTree:function(n){if(l[n]){var N=n.substring(0,n.lastIndexOf("."));var o=this._findNodeNamespaceInTreeStructure(N);var s=n.substring(n.lastIndexOf(".")+1,n.lenght);this._removeNodeFromNamespace(s,o);}},_bindTreeModel:function(t){var a=this.getModel("treeData");a.setSizeLimit(T);if(t.length>0){t.push({isSelected:false,name:"experimental",ref:"#/api/experimental",text:"Experimental APIs"},{isSelected:false,name:"deprecated",ref:"#/api/deprecated",text:"Deprecated APIs"});}a.setData(t,false);},_bindVersionModel:function(v){var V,o,i=false;this.aAllowedMembers=["public","protected"];if(!v){return;}V=v.version;if(/internal/i.test(v.name)){i=true;this.aAllowedMembers.push("restricted");}o={versionGav:v.gav,versionName:v.name,version:q.sap.Version(V).getMajor()+"."+q.sap.Version(V).getMinor()+"."+q.sap.Version(V).getPatch(),fullVersion:V,openUi5Version:sap.ui.version,isOpenUI5:v&&v.gav&&/openui5/i.test(v.gav),isSnapshotVersion:v&&v.gav&&/snapshot/i.test(v.gav),isDevVersion:V.indexOf("SNAPSHOT")>-1||(V.split(".").length>1&&parseInt(V.split(".")[1],10)%2===1),isBetaVersion:false,isInternal:i,libraries:v.libraries,allowedMembers:this.aAllowedMembers};if(!o.isOpenUI5&&!o.isSnapshotVersion){q.ajax({url:"versionoverview.json"}).done(function(d){if(d.versions&&d.versions[0]&&d.versions[0].beta&&d.versions[0].beta.indexOf(o.openUi5Version)>-1){o.isBetaVersion=true;}this.getModel("versionData").setData(o,false);}.bind(this)).fail(function(){this.getModel("versionData").setData(o,false);}.bind(this));}else{this.getModel("versionData").setData(o,false);}}});});
