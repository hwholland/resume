/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/base/ManagedObject','./IconTabBarRenderer'],function(q,l,C,M,I){"use strict";var a=l.IconTabHeaderMode;var B=l.BackgroundDesign;var b=C.extend("sap.m.IconTabBar",{metadata:{interfaces:["sap.m.ObjectHeaderContainer"],library:"sap.m",properties:{showSelection:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},expandable:{type:"boolean",group:"Misc",defaultValue:true},expanded:{type:"boolean",group:"Misc",defaultValue:true},selectedKey:{type:"string",group:"Data",defaultValue:null},upperCase:{type:"boolean",group:"Appearance",defaultValue:false},stretchContentHeight:{type:"boolean",group:"Appearance",defaultValue:false},applyContentPadding:{type:"boolean",group:"Appearance",defaultValue:true},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:B.Solid},headerMode:{type:"sap.m.IconTabHeaderMode",group:"Appearance",defaultValue:a.Standard},showOverflowSelectList:{type:"boolean",group:"Appearance",defaultValue:false},headerBackgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:B.Solid},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{items:{type:"sap.m.IconTab",multiple:true,singularName:"item",forwarding:{getter:"_getIconTabHeader",aggregation:"items",forwardBinding:true}},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},_header:{type:"sap.m.IconTabHeader",multiple:false,visibility:"hidden"}},events:{select:{parameters:{item:{type:"sap.m.IconTabFilter"},key:{type:"string"},selectedItem:{type:"sap.m.IconTabFilter"},selectedKey:{type:"string"}}},expand:{parameters:{expand:{type:"boolean"},collapse:{type:"boolean"}}}},designtime:"sap/m/designtime/IconTabBar.designtime"}});b.prototype.clone=function(){var c=C.prototype.clone.apply(this,arguments);var i=this._getIconTabHeader();c.setAggregation("_header",i.clone(),true);return c;};b.prototype.setExpanded=function(e){this.setProperty("expanded",e,true);if(this.$().length){this._toggleExpandCollapse(e);}return this;};b.prototype.setExpandable=function(e){this.setProperty("expandable",e,true);return this;};b.prototype.setHeaderMode=function(m){this.setProperty("headerMode",m,true);this._getIconTabHeader().setMode(m);return this;};b.prototype.setHeaderBackgroundDesign=function(h){this.setProperty("headerBackgroundDesign",h,true);this._getIconTabHeader().setBackgroundDesign(h);return this;};b.prototype.setShowOverflowSelectList=function(v){this.setProperty("showOverflowSelectList",v,true);this._getIconTabHeader().setShowOverflowSelectList(v);return this;};b.prototype.setEnableTabReordering=function(v){this.setProperty("enableTabReordering",v,true);this._getIconTabHeader().setEnableTabReordering(v);return this;};b.prototype._rerenderContent=function(c){var $=this.$("content");if(c&&($.length>0)){var r=sap.ui.getCore().createRenderManager();for(var i=0;i<c.length;i++){r.renderControl(c[i]);}r.flush($[0]);r.destroy();}};b.prototype._toggleExpandCollapse=function(e){var $=this.$("content");var s=this._getIconTabHeader().oSelectedItem;if(e===undefined){e=!this.getExpanded();}if(s){s.$().toggleClass("sapMITBSelected",e);s.$().attr({'aria-expanded':e});if(e){s.$().attr({'aria-selected':e});}else{s.$().removeAttr('aria-selected');}}this._iAnimationCounter=(this._iAnimationCounter===undefined?1:++this._iAnimationCounter);if(e){if(s){if(this.$("content").children().length===0){var S=s.getContent();if(S.length>0){this._rerenderContent(S);}else{this._rerenderContent(this.getContent());}}$.stop(true,true).slideDown('400',q.proxy(this.onTransitionEnded,this,e));this.$("containerContent").toggleClass("sapMITBContentClosed",!e);}}else{this.$("contentArrow").hide();$.stop(true,true).slideUp('400',q.proxy(this.onTransitionEnded,this,e));}if(!e||s){this.setProperty("expanded",e,true);}this.fireExpand({expand:e,collapse:!e});return this;};b.prototype.onTransitionEnded=function(e){var $=this.$("content"),c=this.$("containerContent"),d=this.$("contentArrow");if(this._iAnimationCounter===1){c.toggleClass("sapMITBContentClosed",!e);if(e){d.show();$.css("display","block");}else{d.hide();$.css("display","none");}}this._iAnimationCounter=(this._iAnimationCounter>0?--this._iAnimationCounter:0);return this;};b.prototype._getIconTabHeader=function(){var c=this.getAggregation("_header");if(!c){c=new sap.m.IconTabHeader(this.getId()+"--header",{});this.setAggregation("_header",c,true);}return c;};b.prototype.setShowSelection=function(v){this._getIconTabHeader().setShowSelection(v);return this;};b.prototype.getShowSelection=function(){return this._getIconTabHeader().getShowSelection();};b.prototype.setSelectedKey=function(v){this._getIconTabHeader().setSelectedKey(v);return this;};b.prototype.getSelectedKey=function(){return this._getIconTabHeader().getSelectedKey();};b.prototype.setSelectedItem=function(i,A){return this._getIconTabHeader().setSelectedItem(i,A);};return b;});
