/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/Icon','sap/ui/core/delegate/ScrollEnablement','sap/ui/Device',"./TabStripRenderer"],function(q,l,C,I,a,S,D,T){"use strict";var b=C.extend("sap.ui.commons.TabStrip",{metadata:{library:"sap.ui.commons",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},selectedIndex:{type:"int",group:"Misc",defaultValue:0},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"tabs",aggregations:{tabs:{type:"sap.ui.commons.Tab",multiple:true,singularName:"tab"},_leftArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_rightArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{select:{parameters:{index:{type:"int"}}},close:{parameters:{index:{type:"int"}}}}}});b.SCROLL_SIZE=320;b.ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?200:0;b.SCROLL_ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?500:0;b.prototype.init=function(){this._bInitialized=true;this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._iCurrentScrollLeft=0;this._iMaxOffsetLeft=null;this._scrollable=null;this._oScroller=new S(this,this.getId()+"-tablist",{horizontal:!this.getEnableTabReordering(),vertical:false,nonTouchScrolling:true});this.data("sap-ui-fastnavgroup","true",true);};b.prototype.setEnableTabReordering=function(v){this.setProperty("enableTabReordering",v,true);if(this._oScroller){this._oScroller.setHorizontal(!v);}return this;};b.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};b.prototype.onAfterRendering=function(){if(this._oScroller){this._oScroller.setIconTabBar(this,q.proxy(this._updateScrollingAppearance,this),null);}this._initItemNavigation();this._updateScrollingAppearance();this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),q.proxy(this._updateScrollingAppearance,this));var t=this.getTabs();var s=this.getSelectedIndex();var o=t[s];if(this._oScroller&&o&&o.$().length>0){if(!this._oScroller._$Container){this._oScroller.onAfterRendering();}this._scrollIntoView(o.$(),b.SCROLL_ANIMATION_DURATION);}for(var i=0;i<t.length;i++){t[i].onAfterRendering();}};b.prototype.createTab=function(t,c){var o=new sap.ui.core.Title({text:t}),d=new sap.ui.commons.Tab();d.setTitle(o);d.addContent(c);this.addTab(d);return d;};b.prototype.selectTabByDomRef=function(d){var i=this.getItemIndex(d);if(i>-1){if((i!=this.getSelectedIndex())&&(this.getTabs()[i].getEnabled())){var o=this.getSelectedIndex();this.setProperty('selectedIndex',i,true);this.rerenderPanel(o,true);this.oItemNavigation.setSelectedIndex(this.oItemNavigation.getFocusedIndex());}}};b.prototype.onsapspace=function(e){var s=e.target;this.selectTabByDomRef(s);};b.prototype.onsapspacemodifiers=b.prototype.onsapspace;b.prototype.onsapenter=b.prototype.onsapspace;b.prototype.onsapentermodifiers=b.prototype.onsapspace;b.prototype.onsapdelete=function(e){var s=e.target;var i=this.getItemIndex(s);if(i>-1&&this.getTabs()[i].getClosable()){this.fireClose({index:i});}};b.prototype.getFocusDomRef=function(){return this.getDomRef().firstChild;};b.prototype.exit=function(){this._bInitialized=false;this._iCurrentScrollLeft=null;this._iMaxOffsetLeft=null;this._scrollable=null;if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}};b.prototype.getItemIndex=function(d){var i;if(!d.id||d.id.search("-close")!=-1){var o=q(d).parentByAttribute("id");i=o.id;}else{i=d.id;}for(var c=0,t=this.getTabs();c<t.length;c++){if(i==t[c].getId()){return c;}}return-1;};b.prototype.removeTab=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfTab(e);}var t=this.getTabs()[i];if(t.getVisible()){t.setProperty("visible",false,true);this.hideTab(i);t.setProperty("visible",true,true);}if(this.getSelectedIndex()>i){this.setProperty('selectedIndex',this.getSelectedIndex()-1,true);}return this.removeAggregation("tabs",i,true);};b.prototype.setSelectedIndex=function(s){var o=this.getSelectedIndex();if(s==o){return this;}var t=this.getTabs();var c=t[s];if(this._oScroller&&c&&c.$().length>0){this._scrollIntoView(c.$(),b.SCROLL_ANIMATION_DURATION);}if(!c&&!this.getDomRef()){this.setProperty('selectedIndex',s,false);}else if(c&&c.getEnabled()&&c.getVisible()){this.setProperty('selectedIndex',s,true);if(this.getDomRef()&&!this.invalidated){this.rerenderPanel(o);if(this.oItemNavigation){var v=0;var d=-1;for(var i=0;i<t.length;i++){c=t[i];if(c.getVisible()===false){continue;}if(i==s){d=v;break;}v++;}this.oItemNavigation.setSelectedIndex(d);}}}else{this._warningInvalidSelectedIndex(s,c);}return this;};b.prototype.closeTab=function(i){var t=this.getTabs()[i];if(!t||!t.getClosable()||!t.getVisible()){return;}t.setProperty("visible",false,true);this.hideTab(i);};b.prototype.hideTab=function(c){var t=this.getTabs()[c];if(!this.getDomRef()){return;}var f=this.oItemNavigation.getFocusedIndex();var v=parseInt(t.$().attr("aria-posinset"),10)-1;var F=sap.ui.getCore().getCurrentFocusedControlId();t.$().remove();if(this.iVisibleTabs==1){this.setProperty('selectedIndex',-1,true);t.$("panel").remove();}else if(c==this.getSelectedIndex()){var n=c+1;while(n<this.getTabs().length&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n++;}if(n==this.getTabs().length){n=c-1;while(n>=0&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n--;}}this.setProperty('selectedIndex',n,true);this.rerenderPanel(c);}else{this.toggleTabClasses(this.getSelectedIndex(),this.getSelectedIndex());}this.iVisibleTabs--;var v=0;var d=[];var s=-1;var e=false;for(var i=0;i<this.getTabs().length;i++){var t=this.getTabs()[i];if(F==t.getId()){e=true;}if(t.getVisible()===false){continue;}if(i==this.getSelectedIndex()){s=v;}v++;t.$().attr("aria-posinset",v).attr("aria-setsize",this.iVisibleTabs);d.push(t.getDomRef());}if(v<=f){f--;}this.oItemNavigation.setItemDomRefs(d);this.oItemNavigation.setSelectedIndex(s);this.oItemNavigation.setFocusedIndex(f);if(e){this.oItemNavigation.focusItem(f);}this._updateScrollingAppearance();};b.prototype.rerenderPanel=function(o,f){var t=this.getTabs();var n=this.getSelectedIndex();var c=t[n];var O=t[o];q.sap.delayedCall(0,this,function(){if(!this._bInitialized){return;}var $=this.$().find('.sapUiTabPanel');if(c){if($.length>0){var r=sap.ui.getCore().createRenderManager();this.getRenderer().renderTabContents(r,c);r.flush($[0]);r.destroy();}var N=c.getId();$.attr("id",N+"-panel").attr("aria-labelledby",N);}else{$.empty();}O.setProperty("scrollTop",$.scrollTop(),true);O.setProperty("scrollLeft",$.scrollLeft(),true);if(c){c.onAfterRendering();}if(f){this.fireSelect({index:n});}});if(c){this.toggleTabClasses(o,n);}};b.prototype.toggleTabClasses=function(o,n){var t=this.getTabs();var c=t[o];if(c){c.$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",false);}var B=o-1;while(B>=0&&!t[B].getVisible()){B--;}if(B>=0){t[B].$().removeClass("sapUiTabBeforeSel");}var A=o+1;while(A<t.length&&!t[A].getVisible()){A++;}if(A<t.length){t[A].$().removeClass("sapUiTabAfterSel");}c=t[n];if(c){c.$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",true);}B=n-1;while(B>=0&&!t[B].getVisible()){B--;}if(B>=0){t[B].$().addClass("sapUiTabBeforeSel");}A=n+1;while(A<t.length&&!t[A].getVisible()){A++;}if(A<t.length){t[A].$().addClass("sapUiTabAfterSel");}};b.prototype._originalInvalidate=b.prototype.invalidate;b.prototype.invalidate=function(){this.invalidated=true;b.prototype._originalInvalidate.apply(this,arguments);};b.prototype._warningInvalidSelectedIndex=function(s,t){var d="";if(!t){d="Tab not exists";}else if(!t.getEnabled()){d="Tab disabled";}else if(!t.getVisible()){d="Tab not visible";}q.sap.log.warning("SelectedIndex "+s+" can not be set",d,"sap.ui.commons.TabStrip");};b.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.ESCAPE){this._stopMoving();}};b.prototype.onclick=function(e){var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){var i=this.getItemIndex($.parentByAttribute("id"));if(i>-1){this.fireClose({index:i});}}};b.prototype.onmousedown=function(e){var L=!e.button;var i=this._isTouchMode(e);if(!i&&!L){return;}var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){e.preventDefault();e.stopPropagation();e.target=null;return;}this.selectTabByDomRef(s);if(!this.getEnableTabReordering()){return;}var c=$.closest(".sapUiTab, .sapUiTabSel, .sapUiTabDsbl");if(c.length===1){this._onTabMoveStart(c,e,i);}};b.prototype._onTabMoveStart=function($,e,i){this._disableTextSelection();e.preventDefault();$.zIndex(this.$().zIndex()+10);var c=this.getItemIndex(e.target);var t=this.getTabs()[c];var d=this.$().find('.sapUiTabBarCnt').children();var f=q.inArray($[0],d);var w=$.outerWidth();this._dragContext={index:f,tabIndex:c,isTouchMode:i,startX:i?e.originalEvent.targetTouches[0].pageX:e.pageX,tab:t,tabWidth:w,tabCenter:$.position().left+w/2};this._aMovedTabIndexes=[];var g=q(document);if(i){g.bind("touchmove",q.proxy(this._onTabMove,this));g.bind("touchend",q.proxy(this._onTabMoved,this));}else{g.mousemove(q.proxy(this._onTabMove,this));g.mouseup(q.proxy(this._onTabMoved,this));}};b.prototype._onTabMove=function(e){var d=this._dragContext;if(!d){return;}var c=this._isTouchMode(e);if(c){e.preventDefault();}var p=c?e.targetTouches[0].pageX:e.pageX;var f=p-d.startX;d.tab.$().css({left:f});var $,x,o,r,g=this.$().find('.sapUiTabBarCnt').children(),m=this._aMovedTabIndexes,R=sap.ui.getCore().getConfiguration().getRTL();for(var i=0;i<g.length;i++){if(i==d.index){continue;}$=q(g[i]);x=$.position().left;o=parseFloat($.css('left'));if(!isNaN(o)){x-=o;}if(i<d.index!=R){r=x+$.outerWidth()>d.tabCenter+f;this._onAnimateTab($,d.tabWidth,r,m,i);}else{r=x<d.tabCenter+f;this._onAnimateTab($,-d.tabWidth,r,m,i);}}};b.prototype._onAnimateTab=function($,d,r,m,i){var c=q.inArray(i,m);var e=c!=-1;if(r&&!e){$.stop(true,true);$.animate({left:d},b.ANIMATION_DURATION);m.push(i);}else if(!r&&e){$.stop(true,true);$.animate({left:0},b.ANIMATION_DURATION);m.splice(c,1);}};b.prototype._onTabMoved=function(e){var d=this._dragContext;if(!d){return;}this._stopMoving();var m=this._aMovedTabIndexes;if(m.length==0){return;}var $=d.tab.$(),c,f=this.$().find('.sapUiTabBarCnt').children();var n=m[m.length-1],s=n,N=this.getItemIndex(f[n]);this.removeAggregation('tabs',d.tab,true);this.insertAggregation('tabs',d.tab,N,true);if(n>d.index){$.insertAfter(q(f[n]));}else{$.insertBefore(q(f[n]));}f=this.$().find('.sapUiTabBarCnt').children();if(!d.tab.getEnabled()){for(var i=0;i<f.length;i++){c=q(f[i]);if(c.hasClass('sapUiTabSel')){s=i;N=this.getItemIndex(c[0]);break;}}}this.setProperty('selectedIndex',N,true);f.removeClass('sapUiTabAfterSel');f.removeClass('sapUiTabBeforeSel');for(var i=0;i<f.length;i++){c=q(f[i]);c.attr("aria-posinset",i+1);if(i==s-1){c.addClass('sapUiTabBeforeSel');}else if(i==s+1){c.addClass('sapUiTabAfterSel');}}$.focus();this._initItemNavigation();};b.prototype._stopMoving=function(){var d=this._dragContext;if(!d){return;}var $=d.tab.$();$.css('z-index','');var c=this.$().find('.sapUiTabBarCnt').children();c.stop(true,true);c.css('left','');this._dragContext=null;var e=q(document);if(d.isTouchMode){e.unbind("touchmove",this._onTabMove);e.unbind("touchend",this._onTabMoved);}else{e.unbind("mousemove",this._onTabMove);e.unbind("mouseup",this._onTabMoved);}this._enableTextSelection();};b.prototype._isTouchMode=function(e){return!!e.originalEvent["touches"];};b.prototype._initItemNavigation=function(){var f=this.getDomRef('tablist'),t=f.childNodes,c=[],s=-1;for(var i=0;i<t.length;i++){c.push(t[i]);if(q(t[i]).hasClass("sapUiTabSel")){s=i;}}if(!this.oItemNavigation){this.oItemNavigation=new I();this.oItemNavigation.attachEvent(I.Events.AfterFocus,this._onItemNavigationAfterFocus,this);this.oItemNavigation.setCycling(false);this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(f);this.oItemNavigation.setItemDomRefs(c);this.oItemNavigation.setSelectedIndex(s);};b.prototype._disableTextSelection=function(e){q(e||document.body).attr("unselectable","on").addClass('sapUiTabStripNoSelection').bind("selectstart",function(E){E.preventDefault();return false;});};b.prototype._enableTextSelection=function(e){q(e||document.body).attr("unselectable","off").removeClass('sapUiTabStripNoSelection').unbind("selectstart");};b.prototype._getActualSelectedIndex=function(){var s=Math.max(0,this.getSelectedIndex());var t=this.getTabs();var o=t[s];if(o&&o.getVisible()&&o.getEnabled()){return s;}for(var i=0;i<t.length;i++){var c=t[i];if(c.getVisible()&&c.getEnabled()){return i;}}return 0;};b.prototype._getLeftArrowControl=function(){var i=this.getAggregation('_leftArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-left-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(-b.SCROLL_SIZE,b.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripLeftScrollIcon');this.setAggregation("_leftArrowControl",i,true);}return i;};b.prototype._getRightArrowControl=function(){var i=this.getAggregation('_rightArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-right-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(b.SCROLL_SIZE,b.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripRightScrollIcon');this.setAggregation("_rightArrowControl",i,true);}return i;};b.prototype._scroll=function(d,i){var s=this.getDomRef("scrollCont").scrollLeft,c;if(this._bRtl&&D.browser.firefox){c=s-d;if(c<-this._iMaxOffsetLeft){c=-this._iMaxOffsetLeft;}if(c>0){c=0;}}else{c=s+d;if(c<0){c=0;}if(c>this._iMaxOffsetLeft){c=this._iMaxOffsetLeft;}}if(this._oScroller){this._oScroller.scrollTo(c,0,i);}this._iCurrentScrollLeft=c;};b.prototype._scrollIntoView=function($,d){var c=this.$("tablist"),t=c.innerWidth()-c.width(),i=$.outerWidth(true),e=$.position().left-t/2,s=this.getDomRef("scrollCont"),f=s.scrollLeft,g=this.$("scrollCont").width(),n=f;if(e<0||e>g-i){if(this._bRtl&&D.browser.firefox){if(e<0){n+=e+i-g;}else{n+=e;}}else{if(e<0){n+=e;}else{n+=e+i-g;}}this._iCurrentScrollLeft=n;if(this._oScroller){this._oScroller.scrollTo(n,0,d);}}};b.prototype._hasScrolling=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),c=t&&(t.scrollWidth>s.clientWidth);this.$().toggleClass("sapUiTabStripScrollable",c);return c;};b.prototype._updateScrollingAppearance=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),i,r,c,d=false,e=false;if(this._hasScrolling()&&t&&s){if(this._bRtl&&D.browser.firefox){i=-s.scrollLeft;}else{i=s.scrollLeft;}r=t.scrollWidth;c=s.clientWidth;if(Math.abs(r-c)===1){r=c;}if(i>0){d=true;}if((r>c)&&(i+c<r)){e=true;}}this.$().toggleClass("sapUiTabStripScrollBack",d).toggleClass("sapUiTabStripScrollForward",e);this._iMaxOffsetLeft=Math.abs(q(s).width()-q(t).width());};b.prototype._onItemNavigationAfterFocus=function(e){var i=e.getParameter("index"),$=e.getParameter('event');if(!$){return;}var c=q($.target);if(!c||$.keyCode===undefined){return;}if(i!==null&&i!==undefined){var n=q(c.parent().children()[i]);if(n&&n.length){this._scrollIntoView(n,0);}}};return b;},true);