/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ActionBar','./Overlay','./ThingViewer',"./ThingInspectorRenderer",'./library'],function(q,A,O,T,a){"use strict";var b=O.extend("sap.ui.ux3.ThingInspector",{metadata:{library:"sap.ui.ux3",properties:{firstTitle:{type:"string",group:"Misc",defaultValue:null},type:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},secondTitle:{type:"string",group:"Misc",defaultValue:null},followState:{type:"sap.ui.ux3.FollowActionState",group:"Misc",defaultValue:sap.ui.ux3.FollowActionState.Default},flagState:{type:"boolean",group:"Misc",defaultValue:false},favoriteState:{type:"boolean",group:"Misc",defaultValue:false},favoriteActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},updateActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},followActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},flagActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},headerType:{type:"sap.ui.ux3.ThingViewerHeaderType",group:"Misc",defaultValue:sap.ui.ux3.ThingViewerHeaderType.Standard}},aggregations:{actions:{type:"sap.ui.ux3.ThingAction",multiple:true,singularName:"action"},headerContent:{type:"sap.ui.ux3.ThingGroup",multiple:true,singularName:"headerContent"},facets:{type:"sap.ui.ux3.NavigationItem",multiple:true,singularName:"facet"},facetContent:{type:"sap.ui.ux3.ThingGroup",multiple:true,singularName:"facetContent"},actionBar:{type:"sap.ui.ux3.ActionBar",multiple:false},thingViewer:{type:"sap.ui.ux3.ThingViewer",multiple:false,visibility:"hidden"}},associations:{selectedFacet:{type:"sap.ui.ux3.NavigationItem",multiple:false}},events:{actionSelected:{parameters:{id:{type:"string"},action:{type:"sap.ui.ux3.ThingAction"}}},facetSelected:{allowPreventDefault:true,parameters:{id:{type:"string"},item:{type:"sap.ui.ux3.NavigationItem"},key:{type:"string"}}},feedSubmit:{parameters:{text:{type:"string"}}}}}});(function(){b.prototype.init=function(){var o,t=this;O.prototype.init.apply(this);this._oThingViewer=new T(this.getId()+"-thingViewer");this.setAggregation("thingViewer",this._oThingViewer);this._oThingViewer.attachFacetSelected(function(e){var i=e.getParameters().item;if(t.fireFacetSelected({id:i.getId(),key:i.getKey(),item:i})){t.setSelectedFacet(i);}else{e.preventDefault();}});this._oSocialActions={};if(this.getActionBar()==null){o=new A(this.getId()+"-actionBar");o.setShowOpen(false);o.setAlwaysShowMoreMenu(false);o.setDividerWidth("252px");o.attachActionSelected(function(e){var s=e.getParameters().id,B=e.getParameters().action,c;if(s.indexOf(sap.ui.ux3.ActionBarSocialActions.Favorite)!==-1||s.indexOf(sap.ui.ux3.ActionBarSocialActions.Follow)!==-1||s.indexOf(sap.ui.ux3.ActionBarSocialActions.Flag)!==-1){if(t._oSocialActions[s]){c=t._oSocialActions[s];}else{c=new sap.ui.ux3.ThingAction({id:t.getId()+"-"+s.toLowerCase(),text:B.text,enabled:B.enabled});t._oSocialActions[s]=c;}t.fireActionSelected({id:s.toLowerCase(),action:c});}else{t.fireActionSelected({id:e.getParameters().id,action:e.getParameters().action});}});o.attachFeedSubmit(function(e){t.fireFeedSubmit({text:e.getParameters().text});});this.setActionBar(o);}};b.prototype.onAfterRendering=function(){O.prototype.onAfterRendering.apply(this,arguments);var s=this._getShell();this._bShell=!!s;if(!s){this._applyChanges({showOverlay:false});}};b.prototype.onBeforeRendering=function(){O.prototype.onBeforeRendering.apply(this,arguments);};b.prototype.exit=function(){this._oThingViewer.exit(arguments);this._oThingViewer.destroy();this._oThingViewer=null;O.prototype.exit.apply(this,arguments);};b.prototype.open=function(i){if(this.getDomRef()){this.rerender();}O.prototype.open.apply(this,arguments);this._selectDefault();};b.prototype._getNavBar=function(){return this._oThingViewer._oNavBar;};b.prototype._selectDefault=function(){this._oThingViewer._selectDefault();};b.prototype._equalColumns=function(){this._oThingViewer._equalColumns();};b.prototype._setTriggerValue=function(){this._oThingViewer._setTriggerValue();};b.prototype._setFocusLast=function(){var f=this.$("thingViewer-toolbar").lastFocusableDomRef();if(!f&&this.getCloseButtonVisible()&&this.$("close").is(":sapFocusable")){f=this.getDomRef("close");}else if(!f&&this.getOpenButtonVisible()&&this.$("openNew").is(":sapFocusable")){f=this.getDomRef("openNew");}q.sap.focus(f);};b.prototype._setFocusFirst=function(){if(this.getOpenButtonVisible()&&this.$("openNew").is(":sapFocusable")){q.sap.focus(this.getDomRef("openNew"));}else if(this.getCloseButtonVisible()&&this.$("close").is(":sapFocusable")){q.sap.focus(this.getDomRef("close"));}else{q.sap.focus(this.$("thingViewer-content").firstFocusableDomRef());}};b.prototype.insertAction=function(o,i){if(this.getActionBar()){this.getActionBar().insertBusinessAction(o,i);}return this;};b.prototype.addAction=function(o){if(this.getActionBar()){this.getActionBar().addBusinessAction(o);}return this;};b.prototype.removeAction=function(o){var r;if(this.getActionBar()){r=this.getActionBar().removeBusinessAction(o);}return r;};b.prototype.removeAllActions=function(){var r;if(this.getActionBar()){r=this.getActionBar().removeAllBusinessActions();}return r;};b.prototype.getActions=function(){var r;if(this.getActionBar()){r=this.getActionBar().getBusinessActions();}return r;};b.prototype.destroyActions=function(){if(this.getActionBar()){this.getActionBar().destroyBusinessActions();}return this;};b.prototype.indexOfAction=function(o){var r=-1;if(this.getActionBar()){r=this.getActionBar().indexOfBusinessAction(o);}return r;};b.prototype.getFacets=function(){return this._oThingViewer.getFacets();};b.prototype.insertFacet=function(f,i){this._oThingViewer.insertFacet(f,i);return this;};b.prototype.addFacet=function(f){this._oThingViewer.addFacet(f);return this;};b.prototype.removeFacet=function(e){return this._oThingViewer.removeFacet(e);};b.prototype.removeAllFacets=function(){return this._oThingViewer.removeAllFacets();};b.prototype.destroyFacets=function(){this._oThingViewer.destroyFacets();return this;};b.prototype.indexOfFacet=function(f){return this._oThingViewer.indexOfFacet(f);};b.prototype.setFollowState=function(f){if(this.getActionBar()){this.getActionBar().setFollowState(f);}return this;};b.prototype.getFollowState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFollowState();}return r;};b.prototype.setFlagState=function(f){if(this.getActionBar()){this.getActionBar().setFlagState(f);}return this;};b.prototype.getFlagState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFlagState();}return r;};b.prototype.setFavoriteState=function(f){if(this.getActionBar()){this.getActionBar().setFavoriteState(f);}return this;};b.prototype.getFavoriteState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFavoriteState();}return r;};b.prototype.setIcon=function(i){this._oThingViewer.setIcon(i);if(this.getActionBar()){this.getActionBar().setThingIconURI(i);}return this;};b.prototype.getIcon=function(){return this._oThingViewer.getIcon();};b.prototype.setType=function(t){this._oThingViewer.setType(t);return this;};b.prototype.getType=function(){return this._oThingViewer.getType();};b.prototype.insertFacetContent=function(f,i){this._oThingViewer.insertFacetContent(f,i);return this;};b.prototype.addFacetContent=function(f){this._oThingViewer.addFacetContent(f);return this;};b.prototype.removeFacetContent=function(f){var r=this._oThingViewer.removeFacetContent(f);return r;};b.prototype.removeAllFacetContent=function(){var r=this._oThingViewer.removeAllFacetContent();return r;};b.prototype.destroyFacetContent=function(){this._oThingViewer.destroyFacetContent();return this;};b.prototype.getFacetContent=function(){return this._oThingViewer.getFacetContent();};b.prototype.indexOfFacetContent=function(f){return this._oThingViewer.indexOfFacetContent(f);};b.prototype.setActionBar=function(o){this._oThingViewer.setActionBar(o);return this;};b.prototype.getActionBar=function(){return this._oThingViewer.getActionBar();};b.prototype.destroyActionBar=function(){this._oThingViewer.destroyActionBar();};b.prototype.insertHeaderContent=function(h,i){this._oThingViewer.insertHeaderContent(h,i);return this;};b.prototype.addHeaderContent=function(h){this._oThingViewer.addHeaderContent(h);return this;};b.prototype.getHeaderContent=function(){return this._oThingViewer.getHeaderContent();};b.prototype.removeHeaderContent=function(h){var r=this._oThingViewer.removeHeaderContent(h);return r;};b.prototype.removeAllHeaderContent=function(){var r=this._oThingViewer.removeAllHeaderContent();return r;};b.prototype.destroyHeaderContent=function(){this._oThingViewer.destroyHeaderContent();return this;};b.prototype.indexOfHeaderContent=function(h){return this._oThingViewer.indexOfHeaderContent(h);};b.prototype.setSelectedFacet=function(s){this._oThingViewer.setSelectedFacet(s);};b.prototype.getSelectedFacet=function(s){return this._oThingViewer.getSelectedFacet();};b.prototype.setFavoriteActionEnabled=function(e){if(this.getActionBar()){this.getActionBar().setShowFavorite(e);}return this;};b.prototype.getFavoriteActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFavorite();}return r;};b.prototype.setFlagActionEnabled=function(e){if(this.getActionBar()){this.getActionBar().setShowFlag(e);}return this;};b.prototype.getFlagActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFlag();}return r;};b.prototype.setUpdateActionEnabled=function(e){if(this.getActionBar()){this.getActionBar().setShowUpdate(e);}return this;};b.prototype.getUpdateActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowUpdate();}return r;};b.prototype.setFollowActionEnabled=function(e){if(this.getActionBar()){this.getActionBar().setShowFollow(e);}return this;};b.prototype.getFollowActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFollow();}return r;};b.prototype.setFirstTitle=function(t){this._oThingViewer.setTitle(t);};b.prototype.getFirstTitle=function(){return this._oThingViewer.getTitle();};b.prototype.setSecondTitle=function(t){this._oThingViewer.setSubtitle(t);};b.prototype.getSecondTitle=function(){return this._oThingViewer.getSubtitle();};b.prototype.setHeaderType=function(h){this._oThingViewer.setHeaderType(h);return this;};b.prototype.getHeaderType=function(){var r=this._oThingViewer.getHeaderType();return r;};b.prototype._applyChanges=function(c){this.oChanges=c;if(c.showOverlay){this.$().removeClass("sapUiUx3TINoFrame");}else{this.$().addClass("sapUiUx3TINoFrame");}return this;};}());return b;},true);