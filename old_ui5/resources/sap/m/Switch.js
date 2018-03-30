/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/core/theming/Parameters','./SwitchRenderer'],function(q,l,C,E,I,P,S){"use strict";var t=l.touch;var a=l.SwitchType;var c=C.extend("sap.m.Switch",{metadata:{library:"sap.m",properties:{state:{type:"boolean",group:"Misc",defaultValue:false},customTextOn:{type:"string",group:"Misc",defaultValue:""},customTextOff:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Data",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.m.SwitchType",group:"Appearance",defaultValue:a.Default}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{state:{type:"boolean"}}}},designtime:"sap/m/designtime/Switch.designtime"}});I.insertFontFaceStyle();E.apply(c.prototype,[true]);c.prototype._slide=function(p){if(p>c._OFFPOSITION){p=c._OFFPOSITION;}else if(p<c._ONPOSITION){p=c._ONPOSITION;}if(this._iCurrentPosition===p){return;}this._iCurrentPosition=p;this.getDomRef("inner").style[sap.ui.getCore().getConfiguration().getRTL()?"right":"left"]=p+"px";this._setTempState(Math.abs(p)<c._SWAPPOINT);};c.prototype._setTempState=function(b){if(this._bTempState===b){return;}this._bTempState=b;this.getDomRef("handle").setAttribute("data-sap-ui-swt",b?this._sOn:this._sOff);};c.prototype._setDomState=function(s){var b=this.getRenderer().CSS_CLASS,d=s?this._sOn:this._sOff,D=this.getDomRef();if(!D){return;}var $=this.$("switch"),o=this.getDomRef("inner"),h=this.getDomRef("handle"),e=null;if(this.getName()){e=this.getDomRef("input");e.setAttribute("checked",s);e.setAttribute("value",d);}h.setAttribute("data-sap-ui-swt",d);this._getInvisibleElement().text(this.getInvisibleElementText(s));if(s){$.removeClass(b+"Off").addClass(b+"On");D.setAttribute("aria-checked","true");}else{$.removeClass(b+"On").addClass(b+"Off");D.setAttribute("aria-checked","false");}if(sap.ui.getCore().getConfiguration().getAnimation()){$.addClass(b+"Trans");}o.style.cssText="";};c.prototype._getInvisibleElement=function(){return this.$("invisible");};c.prototype.getInvisibleElementId=function(){return this.getId()+"-invisible";};c.prototype.getInvisibleElementText=function(s){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");var T="";switch(this.getType()){case a.Default:if(s){T=this.getCustomTextOn().trim()||b.getText("SWITCH_ON");}else{T=this.getCustomTextOff().trim()||b.getText("SWITCH_OFF");}break;case a.AcceptReject:if(s){T=b.getText("SWITCH_ARIA_ACCEPT");}else{T=b.getText("SWITCH_ARIA_REJECT");}break;}return T;};c._TRANSITIONTIME=Number(P.get("_sap_m_Switch_TransitionTime"))||0;c._ONPOSITION=Number(P.get("_sap_m_Switch_OnPosition"));c._OFFPOSITION=Number(P.get("_sap_m_Switch_OffPosition"));c._SWAPPOINT=Math.abs((c._ONPOSITION-c._OFFPOSITION)/2);c.prototype.onBeforeRendering=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._sOn=this.getCustomTextOn()||r.getText("SWITCH_ON");this._sOff=this.getCustomTextOff()||r.getText("SWITCH_OFF");};c.prototype.ontouchstart=function(e){var T=e.targetTouches[0],b=this.getRenderer().CSS_CLASS,s=this.$("inner");e.setMarked();if(t.countContained(e.touches,this.getId())>1||!this.getEnabled()||e.button){return;}this._iActiveTouchId=T.identifier;this._bTempState=this.getState();this._iStartPressPosX=T.pageX;this._iPosition=s.position().left;this._bDragging=false;q.sap.delayedCall(0,this,"focus");this.$("switch").addClass(b+"Pressed").removeClass(b+"Trans");};c.prototype.ontouchmove=function(e){e.setMarked();e.preventDefault();var T,p,f=t;if(!this.getEnabled()||e.button){return;}T=f.find(e.changedTouches,this._iActiveTouchId);if(!T||Math.abs(T.pageX-this._iStartPressPosX)<6){return;}this._bDragging=true;p=((this._iStartPressPosX-T.pageX)*-1)+this._iPosition;if(sap.ui.getCore().getConfiguration().getRTL()){p=-p;}this._slide(p);};c.prototype.ontouchend=function(e){e.setMarked();var T,f=t,b=q.sap.assert;if(!this.getEnabled()||e.button){return;}b(this._iActiveTouchId!==undefined,"expect to already be touching");T=f.find(e.changedTouches,this._iActiveTouchId);if(T){b(!f.find(e.touches,this._iActiveTouchId),"touchend still active");this.$("switch").removeClass(this.getRenderer().CSS_CLASS+"Pressed");this._setDomState(this._bDragging?this._bTempState:!this.getState());q.sap.delayedCall(c._TRANSITIONTIME,this,function(){var s=this.getState();this.setState(this._bDragging?this._bTempState:!s);if(s!==this.getState()){this.fireChange({state:this.getState()});}});}};c.prototype.ontouchcancel=c.prototype.ontouchend;c.prototype.onsapselect=function(e){var s;if(this.getEnabled()){e.setMarked();e.preventDefault();this.setState(!this.getState());s=this.getState();q.sap.delayedCall(c._TRANSITIONTIME,this,function(){this.fireChange({state:s});});}};c.prototype.setState=function(s){this.setProperty("state",s,true);this._setDomState(this.getState());return this;};c.prototype.getAccessibilityInfo=function(s){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");var d="";if(this.getState()){d=b.getText("ACC_CTR_STATE_CHECKED")+" "+this.getInvisibleElementText(s);}return{role:"checkbox",type:b.getText("ACC_CTR_TYPE_CHECKBOX"),description:d.trim(),focusable:this.getEnabled(),enabled:this.getEnabled()};};return c;});