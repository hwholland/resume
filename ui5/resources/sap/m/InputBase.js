/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','./delegate/ValueStateMessage','sap/ui/core/message/MessageMixin','sap/ui/core/library','sap/ui/Device','jquery.sap.keycodes'],function(q,l,C,E,I,V,M,c,D){"use strict";var T=c.TextDirection;var a=c.TextAlign;var b=c.ValueState;var d=C.extend("sap.m.InputBase",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{value:{type:"string",group:"Data",defaultValue:null,bindable:"bindable"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:b.None},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueStateText:{type:"string",group:"Misc",defaultValue:null},showValueStateMessage:{type:"boolean",group:"Misc",defaultValue:true},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:a.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit},required:{type:"boolean",group:"Misc",defaultValue:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"string"}}}},designTime:true}});E.call(d.prototype);I.insertFontFaceStyle();M.call(d.prototype);d.prototype.bShowLabelAsPlaceholder=!D.support.input.placeholder;d.prototype._getPlaceholder=function(){return this.getPlaceholder();};d.prototype._setLabelVisibility=function(){if(!this.bShowLabelAsPlaceholder){return;}var v=this.$("inner").val();this.$("placeholder").css("display",v?"none":"inline");};d.prototype._getInputValue=function(v){v=(v===undefined)?this.$("inner").val()||"":v.toString();if(this.getMaxLength&&this.getMaxLength()>0){v=v.substring(0,this.getMaxLength());}return v;};d.prototype._getInputElementTagName=function(){if(!this._sInputTagElementName){this._sInputTagElementName=this._$input&&this._$input.get(0)&&this._$input.get(0).tagName;}return this._sInputTagElementName;};d.prototype.init=function(){this._lastValue="";this.bRenderingPhase=false;this.bFocusoutDueRendering=false;this._bIgnoreNextInputEventNonASCII=false;this._oValueStateMessage=new V(this);};d.prototype.onBeforeRendering=function(){if(this._bCheckDomValue&&!this.bRenderingPhase){this._sDomValue=this._getInputValue();}this.bRenderingPhase=true;};d.prototype.onAfterRendering=function(){if(this._bCheckDomValue&&this._sDomValue!==this._getInputValue()){this.$("inner").val(this._sDomValue);}this._bCheckDomValue=false;this._setLabelVisibility();this.bRenderingPhase=false;};d.prototype.exit=function(){if(this._oValueStateMessage){this._oValueStateMessage.destroy();}this._oValueStateMessage=null;};d.prototype.ontouchstart=function(e){e.setMarked();};d.prototype.onfocusin=function(e){this._bIgnoreNextInput=!this.bShowLabelAsPlaceholder&&D.browser.msie&&D.browser.version>9&&!!this.getPlaceholder()&&!this._getInputValue()&&this._getInputElementTagName()==="INPUT";this.$().toggleClass("sapMFocus",true);if(this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}};d.prototype.onfocusout=function(e){this.bFocusoutDueRendering=this.bRenderingPhase;this.$().toggleClass("sapMFocus",false);if(this.bRenderingPhase){return;}this.closeValueStateMessage();};d.prototype.onsapfocusleave=function(e){if(!this.preventChangeOnFocusLeave(e)){this.onChange(e);}};d.prototype.preventChangeOnFocusLeave=function(e){return this.bFocusoutDueRendering;};d.prototype.getChangeEventParams=function(){return{};};d.prototype.ontap=function(e){if(this.getEnabled()&&this.getEditable()&&this.bShowLabelAsPlaceholder&&e.target.id===this.getId()+"-placeholder"){this.focus();}};d.prototype.onChange=function(e,p,n){p=p||this.getChangeEventParams();if(!this.getEditable()||!this.getEnabled()){return;}var v=this._getInputValue(n);if(v!==this._lastValue){this.setValue(v);if(e){this._bIgnoreNextInputEventNonASCII=false;}v=this.getValue();this._lastValue=v;this.fireChangeEvent(v,p);return true;}else{this._bCheckDomValue=false;}};d.prototype.fireChangeEvent=function(v,p){var o=q.extend({value:v,newValue:v},p);this.fireChange(o);};d.prototype.onValueRevertedByEscape=function(v,p){this.fireEvent("liveChange",{value:v,escPressed:true,previousValue:p,newValue:v});};d.prototype.onsapenter=function(e){this.onChange(e);};d.prototype.onsapescape=function(e){var v=this._getInputValue();if(v!==this._lastValue){e.setMarked();e.preventDefault();this.updateDomValue(this._lastValue);this.onValueRevertedByEscape(this._lastValue,v);}};d.prototype.oninput=function(e){if(this._bIgnoreNextInput){this._bIgnoreNextInput=false;e.setMarked("invalid");return;}if(!this.getEditable()){e.setMarked("invalid");return;}if(this._bIgnoreNextInputEventNonASCII&&this.getValue()===this._lastValue){this._bIgnoreNextInputEventNonASCII=false;e.setMarked("invalid");return;}if(document.activeElement!==e.target&&D.browser.msie&&this.getValue()===this._lastValue){e.setMarked("invalid");return;}this._bCheckDomValue=true;this._setLabelVisibility();};d.prototype.onkeydown=function(e){if(this.getDomRef("inner").getAttribute("readonly")&&e.keyCode==q.sap.KeyCodes.BACKSPACE){e.preventDefault();}};d.prototype.oncut=function(e){};d.prototype.selectText=function(s,S){this.$("inner").selectText(s,S);return this;};d.prototype.getSelectedText=function(){return this.$("inner").getSelectedText();};d.prototype.setProperty=function(p,v,s){if(p=="value"){this._bCheckDomValue=false;}return C.prototype.setProperty.apply(this,arguments);};d.prototype.getFocusInfo=function(){var f=C.prototype.getFocusInfo.call(this),F=this.getFocusDomRef();q.extend(f,{cursorPos:0,selectionStart:0,selectionEnd:0});if(F){f.cursorPos=q(F).cursorPos();try{f.selectionStart=F.selectionStart;f.selectionEnd=F.selectionEnd;}catch(e){}}return f;};d.prototype.applyFocusInfo=function(f){C.prototype.applyFocusInfo.call(this,f);this.$("inner").cursorPos(f.cursorPos);this.selectText(f.selectionStart,f.selectionEnd);return this;};d.prototype.bindToInputEvent=function(f){if(this._oInputEventDelegate){this.removeEventDelegate(this._oInputEventDelegate);}this._oInputEventDelegate={oninput:f};return this.addEventDelegate(this._oInputEventDelegate);};d.prototype.updateDomValue=function(v){if(!this.isActive()){return this;}v=this._getInputValue(v);if(D.browser.msie&&D.browser.version>9&&!/^[\x00-\x7F]*$/.test(v)){this._bIgnoreNextInput=true;}if(this._getInputValue()!==v){this.$("inner").val(v);this._bCheckDomValue=true;}this._setLabelVisibility();return this;};d.prototype.closeValueStateMessage=function(){if(this._oValueStateMessage){this._oValueStateMessage.close();}};d.prototype.getDomRefForValueStateMessage=function(){return this.getFocusDomRef();};d.prototype.iOpenMessagePopupDuration=0;d.prototype.getValueStateMessageId=function(){return this.getId()+"-message";};d.prototype.getLabels=function(){var L=this.getAriaLabelledBy().map(function(s){return sap.ui.getCore().byId(s);});var o=sap.ui.require("sap/ui/core/LabelEnablement");if(o){L=L.concat(o.getReferencingLabels(this).map(function(s){return sap.ui.getCore().byId(s);}));}return L;};d.prototype.openValueStateMessage=function(){if(this._oValueStateMessage){this._oValueStateMessage.open();}};d.prototype.updateValueStateClasses=function(v,o){var t=this.$(),i=this.$("inner"),m=b;if(o!==m.None){t.removeClass("sapMInputBaseState sapMInputBase"+o);i.removeClass("sapMInputBaseStateInner sapMInputBase"+o+"Inner");}if(v!==m.None){t.addClass("sapMInputBaseState sapMInputBase"+v);i.addClass("sapMInputBaseStateInner sapMInputBase"+v+"Inner");}};d.prototype.shouldValueStateMessageBeOpened=function(){return(this.getValueState()!==b.None)&&this.getEditable()&&this.getEnabled()&&this.getShowValueStateMessage();};d.prototype.setValueState=function(v){var o=this.getValueState();this.setProperty("valueState",v,true);v=this.getValueState();if(v===o){return this;}var e=this.getDomRef();if(!e){return this;}var i=this.$("inner"),m=b;if(v===m.Error){i.attr("aria-invalid","true");}else{i.removeAttr("aria-invalid");}this.updateValueStateClasses(v,o);if(i[0]===document.activeElement){if(v===m.None){this.closeValueStateMessage();}else if(this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}}return this;};d.prototype.setValueStateText=function(t){this.setProperty("valueStateText",t,true);this.$("message").text(this.getValueStateText());return this;};d.prototype.setValue=function(v){v=this.validateProperty("value",v);v=this._getInputValue(v);this.updateDomValue(v);if(D.browser.msie&&D.browser.version>9&&!/^[\x00-\x7F]*$/.test(v)){this._bIgnoreNextInputEventNonASCII=true;}if(v!==this.getProperty("value")){this._lastValue=v;}this.setProperty("value",v,true);return this;};d.prototype.getFocusDomRef=function(){return this.getDomRef("inner");};d.prototype.getIdForLabel=function(){return this.getId()+"-inner";};d.prototype.setTooltip=function(t){var o=this.getDomRef();this._refreshTooltipBaseDelegate(t);this.setAggregation("tooltip",t,true);if(!o){return this;}var s=this.getTooltip_AsString();if(s){o.setAttribute("title",s);}else{o.removeAttribute("title");}if(sap.ui.getCore().getConfiguration().getAccessibility()){var e=this.getDomRef("describedby"),A=this.getRenderer().getDescribedByAnnouncement(this),f=this.getId()+"-describedby",g="aria-describedby",F=this.getFocusDomRef(),h=F.getAttribute(g);if(!e&&A){e=document.createElement("span");e.id=f;e.setAttribute("aria-hidden","true");e.className="sapUiInvisibleText";if(this.getAriaDescribedBy){F.setAttribute(g,(this.getAriaDescribedBy().join(" ")+" "+f).trim());}else{F.setAttribute(g,f);}o.appendChild(e);}else if(e&&!A){o.removeChild(e);var i=e.id;if(h&&i){F.setAttribute(g,h.replace(i,"").trim());}}if(e){e.textContent=A;}}return this;};d.prototype.getAccessibilityInfo=function(){var r=this.getRequired()?'Required':'',R=this.getRenderer();return{role:R.getAriaRole(this),type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_INPUT"),description:[this.getValue()||"",R.getLabelledByAnnouncement(this),R.getDescribedByAnnouncement(this),r].join(" ").trim(),focusable:this.getEnabled(),enabled:this.getEnabled(),editable:this.getEnabled()&&this.getEditable()};};Object.defineProperty(d.prototype,"_$input",{get:function(){return this.$("inner");}});return d;});
