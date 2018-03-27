/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element','sap/ui/core/Control','sap/ui/Device','sap/ui/core/Popup','./MenuItemBase','./library','sap/ui/core/library','sap/ui/unified/MenuRenderer','jquery.sap.script','jquery.sap.keycodes','jquery.sap.events'],function(q,E,C,D,P,M,l,c,a){"use strict";var b=P.Dock;var O=c.OpenState;var d=C.extend("sap.ui.unified.Menu",{metadata:{interfaces:["sap.ui.core.IContextMenu"],library:"sap.ui.unified",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},ariaDescription:{type:"string",group:"Accessibility",defaultValue:null},maxVisibleItems:{type:"int",group:"Behavior",defaultValue:0},pageSize:{type:"int",group:"Behavior",defaultValue:5}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.unified.MenuItemBase",multiple:true,singularName:"item"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{itemSelect:{parameters:{item:{type:"sap.ui.unified.MenuItemBase"}}}}}});(function(w){d.prototype.bCozySupported=true;d._DELAY_SUBMENU_TIMER=300;d._DELAY_SUBMENU_TIMER_EXT=400;d.prototype.init=function(){var t=this;this.bOpen=false;this.oOpenedSubMenu=null;this.oHoveredItem=null;this.oPopup=null;this._bOpenedAsContextMenu=false;this.fAnyEventHandlerProxy=q.proxy(function(e){var r=this.getRootMenu();if(r!=this||!this.bOpen||!this.getDomRef()||(e.type!="mousedown"&&e.type!="touchstart")){return;}r.handleOuterEvent(this.getId(),e);},this);this.fOrientationChangeHandler=function(){t.close();};this.bUseTopStyle=false;};d.prototype.exit=function(){if(this.oPopup){this.oPopup.detachClosed(this._menuClosed,this);this.oPopup.destroy();delete this.oPopup;}q.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){q(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false;}this._resetDelayedRerenderItems();};d.prototype.invalidate=function(o){if(o instanceof M&&this.getDomRef()){this._delayedRerenderItems();}else{C.prototype.invalidate.apply(this,arguments);}};d.prototype.onBeforeRendering=function(){this._resetDelayedRerenderItems();};d.prototype.onAfterRendering=function(){if(this.$().parent().attr("id")!="sap-ui-static"){q.sap.log.error("sap.ui.unified.Menu: The Menu is popup based and must not be rendered directly as content of the page.");this.close();this.$().remove();}var I=this.getItems();for(var i=0;i<I.length;i++){if(I[i].onAfterRendering&&I[i].getDomRef()){I[i].onAfterRendering();}}if(this.oHoveredItem){this.oHoveredItem.hover(true,this);}g(this);};d.prototype.onThemeChanged=function(){if(this.getDomRef()&&this.getPopup().getOpenState()===O.OPEN){g(this);this.getPopup()._applyPosition(this.getPopup()._oLastPosition);}};d.prototype.setPageSize=function(S){return this.setProperty("pageSize",S,true);};d.prototype.addItem=function(i){this.addAggregation("items",i,!!this.getDomRef());this._delayedRerenderItems();return this;};d.prototype.insertItem=function(i,e){this.insertAggregation("items",i,e,!!this.getDomRef());this._delayedRerenderItems();return this;};d.prototype.removeItem=function(i){this.removeAggregation("items",i,!!this.getDomRef());this._delayedRerenderItems();return this;};d.prototype.removeAllItems=function(){var r=this.removeAllAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return r;};d.prototype.destroyItems=function(){this.destroyAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return this;};d.prototype._delayedRerenderItems=function(){if(!this.getDomRef()){return;}this._resetDelayedRerenderItems();this._discardOpenSubMenuDelayed();this._itemRerenderTimer=q.sap.delayedCall(0,this,function(){var o=this.getDomRef();if(o){var r=sap.ui.getCore().createRenderManager();a.renderItems(r,this);r.flush(o);r.destroy();this.onAfterRendering();this.getPopup()._applyPosition(this.getPopup()._oLastPosition);}});};d.prototype._resetDelayedRerenderItems=function(){if(this._itemRerenderTimer){q.sap.clearDelayedCall(this._itemRerenderTimer);delete this._itemRerenderTimer;}};d.prototype.open=function(W,o,m,e,i,j,k){if(this.bOpen){return;}s(this,true);this.oOpenerRef=o;this.bIgnoreOpenerDOMRef=false;this.getPopup().open(0,m,e,i,j||"0 0",k||"_sapUiCommonsMenuFlip _sapUiCommonsMenuFlip",true);this.bOpen=true;D.resize.attachHandler(this._handleResizeChange,this);var n=this.getDomRef();q(n).attr("tabIndex",0).focus();if(W){this.setHoveredItem(this.getNextSelectableItem(-1));}q.sap.bindAnyEvent(this.fAnyEventHandlerProxy);if(D.support.orientation&&this.getRootMenu()===this){q(w).bind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=true;}};d.prototype._handleResizeChange=function(){this.getPopup()._applyPosition(this.getPopup()._oLastPosition);};d.prototype.openAsContextMenu=function(e,o){o=o instanceof E?o.getDomRef():o;var x=e.pageX-q(o).offset().left,y=e.pageY-q(o).offset().top,r=sap.ui.getCore().getConfiguration().getRTL(),i=b;if(r){x=o.clientWidth-x;}this._iX=e.clientX;this._iY=e.clientY;this._bOpenedAsContextMenu=true;this.open(true,o,i.BeginTop,i.BeginTop,o,x+" "+y,'fit');};d.prototype._handleOpened=function(){var m,W,i,e,r,B,R,j,k,n;if(!this._bOpenedAsContextMenu){return;}m=this.$();W=q(w);i=this._iX;e=this._iY;r=W.scrollLeft()+W.width();B=W.scrollTop()+W.height();R=sap.ui.getCore().getConfiguration().getRTL();j=false;k=m.width();n=m.height();if(e+n>B){e=e-n;j=true;}if(R){if((r-i)+k>r){i=r-(i+k);j=true;}else{i=r-i;j=true;}}else{if(i+k>r){i=i-k;j=true;}}this._bOpenedAsContextMenu=false;j&&this.oPopup.setPosition("begin top","begin top",W,i+" "+e,"flip");};d.prototype.close=function(){if(!this.bOpen||d._dbg){return;}this._discardOpenSubMenuDelayed();s(this,false);delete this._bFixed;q.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){q(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false;}this.bOpen=false;this.closeSubmenu();this.setHoveredItem();q(this.getDomRef()).attr("tabIndex",-1);this.getPopup().close(0);D.resize.detachHandler(this._handleResizeChange,this);this._resetDelayedRerenderItems();this.$().remove();this.bOutput=false;if(this.isSubMenu()){this.getParent().getParent().oOpenedSubMenu=null;}};d.prototype._menuClosed=function(){if(this.oOpenerRef){if(!this.bIgnoreOpenerDOMRef){try{this.oOpenerRef.focus();}catch(e){q.sap.log.warning("Menu.close cannot restore the focus on opener "+this.oOpenerRef+", "+e);}}this.oOpenerRef=undefined;}};d.prototype.onclick=function(e){this.selectItem(this.getItemByDomRef(e.target),false,!!(e.metaKey||e.ctrlKey));e.preventDefault();e.stopPropagation();};d.prototype.onsapnext=function(e){if(e.keyCode!=q.sap.KeyCodes.ARROW_DOWN){if(this.oHoveredItem&&this.oHoveredItem.getSubmenu()&&this.checkEnabled(this.oHoveredItem)){this.openSubmenu(this.oHoveredItem,true);}return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getNextSelectableItem(i));e.preventDefault();e.stopPropagation();};d.prototype.onsapprevious=function(e){if(e.keyCode!=q.sap.KeyCodes.ARROW_UP){if(this.isSubMenu()){this.close();}e.preventDefault();e.stopPropagation();return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getPreviousSelectableItem(i));e.preventDefault();e.stopPropagation();};d.prototype.onsaphome=function(e){this.setHoveredItem(this.getNextSelectableItem(-1));e.preventDefault();e.stopPropagation();};d.prototype.onsapend=function(e){this.setHoveredItem(this.getPreviousSelectableItem(this.getItems().length));e.preventDefault();e.stopPropagation();};d.prototype.onsappagedown=function(e){if(this.getPageSize()<1){this.onsapend(e);return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;i+=this.getPageSize();if(i>=this.getItems().length){this.onsapend(e);return;}this.setHoveredItem(this.getNextSelectableItem(i-1));e.preventDefault();e.stopPropagation();};d.prototype.onsappageup=function(e){if(this.getPageSize()<1){this.onsaphome(e);return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;i-=this.getPageSize();if(i<0){this.onsaphome(e);return;}this.setHoveredItem(this.getPreviousSelectableItem(i+1));e.preventDefault();e.stopPropagation();};d.prototype.onsapselect=function(e){this._sapSelectOnKeyDown=true;e.preventDefault();e.stopPropagation();};d.prototype.onkeyup=function(e){if(this.oHoveredItem&&(q(e.target).prop("tagName")!="INPUT")){var o=this.oHoveredItem.getDomRef();q(o).attr("tabIndex",0).focus();}if(!this._sapSelectOnKeyDown){return;}else{this._sapSelectOnKeyDown=false;}if(!q.sap.PseudoEvents.sapselect.fnCheck(e)){return;}this.selectItem(this.oHoveredItem,true,false);e.preventDefault();e.stopPropagation();};d.prototype.onsapbackspace=function(e){if(q(e.target).prop("tagName")!="INPUT"){e.preventDefault();}};d.prototype.onsapbackspacemodifiers=d.prototype.onsapbackspace;d.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation();};d.prototype.onsaptabnext=d.prototype.onsapescape;d.prototype.onsaptabprevious=d.prototype.onsapescape;d.prototype.onmouseover=function(e){if(!D.system.desktop){return;}var i=this.getItemByDomRef(e.target);if(!this.bOpen||!i||i==this.oHoveredItem){return;}if(this.oOpenedSubMenu&&q.sap.containsOrEquals(this.oOpenedSubMenu.getDomRef(),e.target)){return;}this.setHoveredItem(i);if(q.sap.checkMouseEnterOrLeave(e,this.getDomRef())){if(!D.browser.msie&&!D.browser.edge){this.getDomRef().focus();}}this._openSubMenuDelayed(i);};d.prototype._openSubMenuDelayed=function(i){if(!i){return;}this._discardOpenSubMenuDelayed();this._delayedSubMenuTimer=q.sap.delayedCall(i.getSubmenu()&&this.checkEnabled(i)?d._DELAY_SUBMENU_TIMER:d._DELAY_SUBMENU_TIMER_EXT,this,function(){this.closeSubmenu();if(!i.getSubmenu()||!this.checkEnabled(i)){return;}this.setHoveredItem(i);this.openSubmenu(i,false,true);});};d.prototype._discardOpenSubMenuDelayed=function(i){if(this._delayedSubMenuTimer){q.sap.clearDelayedCall(this._delayedSubMenuTimer);this._delayedSubMenuTimer=null;}};d.prototype.onmouseout=function(e){if(!D.system.desktop){return;}if(q.sap.checkMouseEnterOrLeave(e,this.getDomRef())){if(!this.oOpenedSubMenu||!(this.oOpenedSubMenu.getParent()===this.oHoveredItem)){this.setHoveredItem(null);}this._discardOpenSubMenuDelayed();}};d.prototype.onsapfocusleave=function(e){if(this.oOpenedSubMenu||!this.bOpen){return;}this.getRootMenu().handleOuterEvent(this.getId(),e);};d.prototype.handleOuterEvent=function(m,e){var i=false,t=this.getPopup().touchEnabled;this.bIgnoreOpenerDOMRef=false;if(e.type=="mousedown"||e.type=="touchstart"){if(t&&(e.isMarked("delayedMouseEvent")||e.isMarked("cancelAutoClose"))){return;}var j=this;while(j&&!i){if(q.sap.containsOrEquals(j.getDomRef(),e.target)){i=true;}j=j.oOpenedSubMenu;}}else if(e.type=="sapfocusleave"){if(t){return;}if(e.relatedControlId){var j=this;while(j&&!i){if((j.oOpenedSubMenu&&j.oOpenedSubMenu.getId()==e.relatedControlId)||q.sap.containsOrEquals(j.getDomRef(),q.sap.byId(e.relatedControlId).get(0))){i=true;}j=j.oOpenedSubMenu;}}if(!i){this.bIgnoreOpenerDOMRef=true;}}if(!i){this.close();}};d.prototype.getItemByDomRef=function(o){var I=this.getItems(),L=I.length;for(var i=0;i<L;i++){var e=I[i],j=e.getDomRef();if(q.sap.containsOrEquals(j,o)){return e;}}return null;};d.prototype.selectItem=function(i,W,e){if(!i||!(i instanceof M&&this.checkEnabled(i))){return;}var S=i.getSubmenu();if(!S){this.getRootMenu().close();}else{if(!D.system.desktop&&this.oOpenedSubMenu===S){this.closeSubmenu();}else{this.openSubmenu(i,W);}}i.fireSelect({item:i,ctrlKey:e});this.getRootMenu().fireItemSelect({item:i});};d.prototype.isSubMenu=function(){return this.getParent()&&this.getParent().getParent&&this.getParent().getParent()instanceof d;};d.prototype.getRootMenu=function(){var t=this;while(t.isSubMenu()){t=t.getParent().getParent();}return t;};d.prototype.getMenuLevel=function(){var L=1;var t=this;while(t.isSubMenu()){t=t.getParent().getParent();L++;}return L;};d.prototype.getPopup=function(){if(!this.oPopup){this.oPopup=new P(this,false,true,false);this.oPopup.setDurations(0,0);this.oPopup.attachClosed(this._menuClosed,this);this.oPopup.attachOpened(this._handleOpened,this);}return this.oPopup;};d.prototype.setHoveredItem=function(i){if(this.oHoveredItem){this.oHoveredItem.hover(false,this);}if(!i){this.oHoveredItem=null;q(this.getDomRef()).removeAttr("aria-activedescendant");return;}this.oHoveredItem=i;i.hover(true,this);this._setActiveDescendant(this.oHoveredItem);this.scrollToItem(this.oHoveredItem);};d.prototype._setActiveDescendant=function(i){if(sap.ui.getCore().getConfiguration().getAccessibility()&&i){var t=this;t.$().removeAttr("aria-activedescendant");setTimeout(function(){if(t.oHoveredItem===i){t.$().attr("aria-activedescendant",t.oHoveredItem.getId());}},10);}};d.prototype.openSubmenu=function(i,W,e){var S=i.getSubmenu();if(!S){return;}if(this.oOpenedSubMenu&&this.oOpenedSubMenu!==S){this.closeSubmenu();}if(this.oOpenedSubMenu){this.oOpenedSubMenu._bFixed=(e&&this.oOpenedSubMenu._bFixed)||(!e&&!this.oOpenedSubMenu._bFixed);this.oOpenedSubMenu._bringToFront();}else{this.oOpenedSubMenu=S;var j=P.Dock;S.open(W,this,j.BeginTop,j.EndTop,i,"0 0");}};d.prototype.closeSubmenu=function(i,I){if(this.oOpenedSubMenu){if(i&&this.oOpenedSubMenu._bFixed){return;}if(I){this.oOpenedSubMenu.bIgnoreOpenerDOMRef=true;}this.oOpenedSubMenu.close();this.oOpenedSubMenu=null;}};d.prototype.scrollToItem=function(i){var m=this.getDomRef(),I=i?i.getDomRef():null;if(!I||!m){return;}var e=m.scrollTop,j=I.offsetTop,k=q(m).height(),n=q(I).height();if(e>j){m.scrollTop=j;}else if((j+n)>(e+k)){m.scrollTop=Math.ceil(j+n-k);}};d.prototype._bringToFront=function(){q.sap.byId(this.getPopup().getId()).mousedown();};d.prototype.checkEnabled=function(i){return i&&i.getEnabled()&&this.getEnabled();};d.prototype.getNextSelectableItem=function(I){var o=null;var e=this.getItems();for(var i=I+1;i<e.length;i++){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}if(!o){for(var i=0;i<=I;i++){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}}return o;};d.prototype.getPreviousSelectableItem=function(I){var o=null;var e=this.getItems();for(var i=I-1;i>=0;i--){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}if(!o){for(var i=e.length-1;i>=I;i--){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}}return o;};d.prototype.setRootMenuTopStyle=function(u){this.getRootMenu().bUseTopStyle=u;d.rerenderMenu(this.getRootMenu());};d.rerenderMenu=function(m){var I=m.getItems();for(var i=0;i<I.length;i++){var S=I[i].getSubmenu();if(S){d.rerenderMenu(S);}}m.invalidate();m.rerender();};d.prototype.focus=function(){if(this.bOpen){C.prototype.focus.apply(this,arguments);this._setActiveDescendant(this.oHoveredItem);}};d.prototype.isCozy=function(){if(!this.bCozySupported){return false;}if(this.hasStyleClass("sapUiSizeCozy")){return true;}if(f(this.oOpenerRef)){return true;}if(f(this.getParent())){return true;}return false;};function f(r){if(!r){return false;}r=r.$?r.$():q(r);return r.closest(".sapUiSizeCompact,.sapUiSizeCondensed,.sapUiSizeCozy").hasClass("sapUiSizeCozy");}function s(m,o){var p=m.getParent();if(p&&p instanceof M){p.onSubmenuToggle(o);}}function g(m){var e=m.getMaxVisibleItems(),j=document.documentElement.clientHeight-10,$=m.$();if(e>0){var I=m.getItems();for(var i=0;i<I.length;i++){if(I[i].getDomRef()){j=Math.min(j,I[i].$().outerHeight(true)*e);break;}}}if($.outerHeight(true)>j){$.css("max-height",j+"px").toggleClass("sapUiMnuScroll",true);}else{$.css("max-height","").toggleClass("sapUiMnuScroll",false);}}
/*!
	 * The following code is taken from
	 * jQuery UI 1.10.3 - 2013-11-18
	 * jquery.ui.position.js
	 *
	 * http://jqueryui.com
	 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT
	 */
function _(e){var i=q(w);e.within={element:i,isWindow:true,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.width(),height:i.height()};e.collisionPosition={marginLeft:0,marginTop:0};return e;}var h={fit:{left:function(p,e){var i=e.within,j=i.isWindow?i.scrollLeft:i.offset.left,o=i.width,k=p.left-e.collisionPosition.marginLeft,m=j-k,n=k+e.collisionWidth-o-j,r;if(e.collisionWidth>o){if(m>0&&n<=0){r=p.left+m+e.collisionWidth-o-j;p.left+=m-r;}else if(n>0&&m<=0){p.left=j;}else{if(m>n){p.left=j+o-e.collisionWidth;}else{p.left=j;}}}else if(m>0){p.left+=m;}else if(n>0){p.left-=n;}else{p.left=Math.max(p.left-k,p.left);}},top:function(p,e){var i=e.within,j=i.isWindow?i.scrollTop:i.offset.top,o=e.within.height,k=p.top-e.collisionPosition.marginTop,m=j-k,n=k+e.collisionHeight-o-j,r;if(e.collisionHeight>o){if(m>0&&n<=0){r=p.top+m+e.collisionHeight-o-j;p.top+=m-r;}else if(n>0&&m<=0){p.top=j;}else{if(m>n){p.top=j+o-e.collisionHeight;}else{p.top=j;}}}else if(m>0){p.top+=m;}else if(n>0){p.top-=n;}else{p.top=Math.max(p.top-k,p.top);}}},flip:{left:function(p,e){var i=e.within,j=i.offset.left+i.scrollLeft,o=i.width,k=i.isWindow?i.scrollLeft:i.offset.left,m=p.left-e.collisionPosition.marginLeft,n=m-k,r=m+e.collisionWidth-o-k,t=e.my[0]==="left"?-e.elemWidth:e.my[0]==="right"?e.elemWidth:0,u=e.at[0]==="left"?e.targetWidth:e.at[0]==="right"?-e.targetWidth:0,v=-2*e.offset[0],x,y;if(n<0){x=p.left+t+u+v+e.collisionWidth-o-j;if(x<0||x<Math.abs(n)){p.left+=t+u+v;}}else if(r>0){y=p.left-e.collisionPosition.marginLeft+t+u+v-k;if(y>0||Math.abs(y)<r){p.left+=t+u+v;}}},top:function(p,e){var i=e.within,j=i.offset.top+i.scrollTop,o=i.height,k=i.isWindow?i.scrollTop:i.offset.top,m=p.top-e.collisionPosition.marginTop,n=m-k,r=m+e.collisionHeight-o-k,t=e.my[1]==="top",u=t?-e.elemHeight:e.my[1]==="bottom"?e.elemHeight:0,v=e.at[1]==="top"?e.targetHeight:e.at[1]==="bottom"?-e.targetHeight:0,x=-2*e.offset[1],y,z;if(n<0){z=p.top+u+v+x+e.collisionHeight-o-j;if((p.top+u+v+x)>n&&(z<0||z<Math.abs(n))){p.top+=u+v+x;}}else if(r>0){y=p.top-e.collisionPosition.marginTop+u+v+x-k;if((p.top+u+v+x)>r&&(y>0||Math.abs(y)<r)){p.top+=u+v+x;}}}},flipfit:{left:function(){h.flip.left.apply(this,arguments);h.fit.left.apply(this,arguments);},top:function(){h.flip.top.apply(this,arguments);h.fit.top.apply(this,arguments);}}};q.ui.position._sapUiCommonsMenuFlip={left:function(p,e){if(q.ui.position.flipfit){q.ui.position.flipfit.left.apply(this,arguments);return;}e=_(e);h.flipfit.left.apply(this,arguments);},top:function(p,e){if(q.ui.position.flipfit){q.ui.position.flipfit.top.apply(this,arguments);return;}e=_(e);h.flipfit.top.apply(this,arguments);}};})(window);return d;});
