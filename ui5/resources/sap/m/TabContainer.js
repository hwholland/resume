/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/IconPool'],function(q,l,C,I){"use strict";var B=l.ButtonType;var T=C.extend("sap.m.TabContainer",{metadata:{library:"sap.m",properties:{showAddNewButton:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{items:{type:"sap.m.TabContainerItem",multiple:true,singularName:"item",bindable:"bindable"},_addNewButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_tabStrip:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.m.TabContainerItem",multiple:false}},events:{itemClose:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabContainerItem"}}},itemSelect:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabContainerItem"}}},addNewButtonPress:{}}},constructor:function(i,s){var S=[];if(!s&&typeof i==='object'){s=i;}if(s&&Array.isArray(s['items'])){S=s['items'];delete s['items'];}C.prototype.constructor.apply(this,arguments);var c=new sap.m.TabStrip(this.getId()+"--tabstrip",{hasSelect:true,itemSelect:function(e){var o=e.getParameter("item"),a=this._fromTabStripItem(o);this.setSelectedItem(a,e);}.bind(this),itemClose:function(e){var o=e.getParameter("item"),r=this._fromTabStripItem(o);e.preventDefault();if(this.fireItemClose({item:r})){this.removeItem(r);}}.bind(this)});this.setAggregation("_tabStrip",c,true);if(s&&s['showAddNewButton']){this.setShowAddNewButton(true);}S.forEach(function(o){this.addItem(o);},this);}});var t={"name":"text","modified":"modified"};T.prototype.onBeforeRendering=function(){if(this.getSelectedItem()){return;}this._setDefaultTab();};T.prototype._getAddNewTabButton=function(){var c=this.getAggregation("_addNewButton");var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(!c){c=new sap.m.Button({type:B.Transparent,tooltip:r.getText("TABCONTAINER_ADD_NEW_TAB"),icon:I.getIconURI("add"),press:function(){this.getParent().getParent().fireAddNewButtonPress();}});c.addStyleClass("sapMTSAddNewTabBtn");this.setAggregation("_addNewButton",c,true);}return c;};T.prototype._getTabStrip=function(){return this.getAggregation("_tabStrip");};T.prototype._fromTabStripItem=function(i){var a=this.getItems()||[],b=a.length,c=0;for(;c<b;c++){if(a[c].getId()===i.getKey()){return a[c];}}return null;};T.prototype._toTabStripItem=function(i){var a=0,k=i,o,b,c=this._getTabStrip();if(!c){return null;}o=c.getItems();b=o.length;if(typeof i==="object"){k=i.getId();}for(;a<b;a++){if(o[a].getKey()===k){return o[a];}}return null;};T.prototype._getSelectedItemContent=function(){var o=this._getTabStrip(),s=this.getSelectedItem(),S=sap.ui.getCore().byId(s),a=this._toTabStripItem(S);if(o){o.setSelectedItem(a);}return S?S.getContent():null;};T.prototype._moveToNextItem=function(s){if(!this._getTabStrip()._oItemNavigation){return;}var i=this.getItems().length,c=this._getTabStrip()._oItemNavigation.getFocusedIndex(),n=i===c?--c:c,N=this.getItems()[n],f=function(){if(this._getTabStrip()._oItemNavigation){this._getTabStrip()._oItemNavigation.focusItem(n);}};if(s&&N){this.setSelectedItem(N);this.fireItemSelect({item:N});}q.sap.delayedCall(0,this,f);};T.prototype.removeItem=function(i){var b;if(typeof i==="undefined"||i===null){return null;}i=this.removeAggregation("items",i);b=i.getId()===this.getSelectedItem();this._getTabStrip().removeItem(this._toTabStripItem(i));this._moveToNextItem(b);return i;};T.prototype.addAggregation=function(a,o,s){var b,p;if(a==='items'){o.attachItemPropertyChanged(function(e){p=e['mParameters'].propertyKey;if(t[p]){p=t[p];b=this._toTabStripItem(e.getSource());b&&b.setProperty(p,e['mParameters'].propertyValue,false);}}.bind(this));}return C.prototype.addAggregation.call(this,a,o,s);};T.prototype.addItem=function(i){this.addAggregation("items",i,false);this._getTabStrip().addItem(new sap.m.TabStripItem({key:i.getId(),text:i.getName(),modified:i.getModified()}));return i;};T.prototype.destroyItems=function(){this._getTabStrip().destroyItems();this.setAssociation("selectedItem",null);return this.destroyAggregation("items");};T.prototype.insertItem=function(i,a){this._getTabStrip().insertItem(new sap.m.TabStripItem({key:i.getId(),text:i.getName(),modified:i.getModified()}),a);return this.insertAggregation("items",i,a);};T.prototype.removeAllItems=function(){this._getTabStrip().removeAllItems();this.setSelectedItem(null);return this.removeAllAggregation("items");};T.prototype.setAddButton=function(b){return this._getTabStrip().setAddButton(b);};T.prototype.getAddButton=function(){return this._getTabStrip().getAddButton();};T.prototype.setShowAddNewButton=function(s){this.setProperty("showAddNewButton",s,true);var o=this._getTabStrip();if(o){o.setAddButton(s?this._getAddNewTabButton():null);}return this;};T.prototype.setSelectedItem=function(s,e){if(this.fireItemSelect({item:s})){var o=this._getTabStrip();if(s&&o){o.setSelectedItem(this._toTabStripItem(s));this._rerenderContent(s.getContent());}T.prototype.setAssociation.call(this,"selectedItem",s,true);return this;}if(e){e.preventDefault();}return this;};T.prototype._rerenderContent=function(c){var $=this.$("content"),r;if(!c||($.length<=0)){return;}r=sap.ui.getCore().createRenderManager();for(var i=0;i<c.length;i++){r.renderControl(c[i]);}r.flush($[0]);r.destroy();};T.prototype._setDefaultTab=function(){var f=this.getItems()[0]||null;this.setSelectedItem(f);return f;};return T;});
