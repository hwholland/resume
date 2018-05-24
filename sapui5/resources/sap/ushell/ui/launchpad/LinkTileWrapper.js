/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.launchpad.LinkTileWrapper");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ushell.ui.launchpad.LinkTileWrapper",{metadata:{library:"sap.ushell",properties:{"uuid":{type:"string",group:"Misc",defaultValue:null},"tileCatalogId":{type:"string",group:"Misc",defaultValue:null},"target":{type:"string",group:"Misc",defaultValue:null},"visible":{type:"boolean",group:"Misc",defaultValue:true},"debugInfo":{type:"string",group:"Misc",defaultValue:null},"animationRendered":{type:"boolean",group:"Misc",defaultValue:false},"isLocked":{type:"boolean",group:"Misc",defaultValue:false},"tileActionModeActive":{type:"boolean",group:"Misc",defaultValue:false},"ieHtml5DnD":{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{"tileViews":{type:"sap.ui.core.Control",multiple:true,singularName:"tileView"},"footItems":{type:"sap.ui.core.Control",multiple:true,singularName:"footItem"}},events:{"press":{},"coverDivPress":{},"afterRendering":{},"showActions":{}}}});sap.ushell.ui.launchpad.LinkTileWrapper.M_EVENTS={'press':'press','coverDivPress':'coverDivPress','afterRendering':'afterRendering','showActions':'showActions'};(function(){"use strict";jQuery.sap.require("sap.ushell.override");sap.ushell.ui.launchpad.LinkTileWrapper.prototype.ontap=function(e,u){jQuery.sap.log.info("Tile clicked:",this.getDebugInfo(),"sap.ushell.ui.launchpad.LinkTileWrapper");return;};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.destroy=function(s){this.destroyTileViews();sap.ui.core.Control.prototype.destroy.call(this,s);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.addTileView=function(o,s){o.setParent(null);jQuery.sap.require('sap.ushell.ui.launchpad.AccessibilityCustomData');o.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({key:"tabindex",value:"-1",writeToDom:true}));sap.ui.base.ManagedObject.prototype.addAggregation.call(this,"tileViews",o,s);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.destroyTileViews=function(){if(this.mAggregations["tileViews"]){this.mAggregations["tileViews"].length=0;}};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.onAfterRendering=function(){this.fireAfterRendering();};sap.ushell.ui.launchpad.LinkTileWrapper.prototype._launchTileViaKeyboard=function(e){if(e.target.tagName!=="BUTTON"){var t=this.getTileViews()[0],p=false;if(t.firePress){var c=document.createEvent('MouseEvents');c.initEvent('click',false,true);t.getDomRef().dispatchEvent(c);}else{while(t.getContent&&!p){t=t.getContent()[0];if(t.firePress){t.firePress({id:this.getId()});p=true;}}}}};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.onsapenter=function(e){this._launchTileViaKeyboard(e);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.onsapspace=function(e){this._launchTileViaKeyboard(e);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.onclick=function(e){if(this.getTileActionModeActive()){e.preventDefault();}else{var c=this.getTileViews()[0],c=c.getContent?c.getContent()[0]:c,C=c.getHref();sap.ui.getCore().getEventBus().publish("launchpad","dashboardTileLinkClick",{targetHash:C});}};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.setVisible=function(v){this.setProperty("visible",v,true);return this.toggleStyleClass("sapUshellHidden",!v);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.setAnimationRendered=function(v){this.setProperty('animationRendered',v,true);};sap.ushell.ui.launchpad.LinkTileWrapper.prototype._handleTileShadow=function(j,a){if(j.length){j.unbind('mouseenter mouseleave');var u,t=j.css("border").split("px")[0],m=this.getModel();if(t>0){u=j.css("border-color");}else{u=this.getRgba();}j.hover(function(){if(!m.getProperty('/tileActionModeActive')){var o=jQuery(j).css('box-shadow'),T=o?o.split(') ')[1]:null,U;if(T){U=T+" "+u;jQuery(this).css('box-shadow',U);}}},function(){jQuery(this).css('box-shadow','');});}};sap.ushell.ui.launchpad.LinkTileWrapper.prototype.setUuid=function(u){this.setProperty("uuid",u,true);return this;};}());