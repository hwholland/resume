/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/theming/Parameters',"./RatingIndicatorRenderer"],function(q,l,C,P,R){"use strict";var a=C.extend("sap.ui.commons.RatingIndicator",{metadata:{library:"sap.ui.commons",properties:{editable:{type:"boolean",group:"Behavior",defaultValue:true},maxValue:{type:"int",group:"Behavior",defaultValue:5},value:{type:"float",group:"Behavior",defaultValue:0,bindable:"bindable"},averageValue:{type:"float",group:"Behavior",defaultValue:0},iconSelected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconUnselected:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},iconHovered:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},visualMode:{type:"sap.ui.commons.RatingIndicatorVisualMode",group:"Behavior",defaultValue:sap.ui.commons.RatingIndicatorVisualMode.Half}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"int"}}}}}});a.NoValue=-9999;a.prototype.init=function(){this.iHoveredRating=-1;};a.prototype.exit=function(){};a.prototype.onThemeChanged=function(e){if(this.getDomRef()){this.invalidate();}};a.prototype.ondragstart=function(e){e.preventDefault();};a.prototype._getDisplayValue=function(){var v=this.getValue();if(v==a.NoValue){return this.getAverageValue();}else{return v;}};a.prototype.onsapincrease=function(e){var n=this.iHoveredRating;if(n==-1){n=Math.round(this._getDisplayValue())-1;if(n==-1){n=0;}}if(n<this.getMaxValue()){n=n+1;}else{n=this.getMaxValue();}this.updateHoverState(e,n);};a.prototype.onsapdecrease=function(e){var n=this.iHoveredRating;if(n==-1&&Math.round(this._getDisplayValue())==0){return;}if(n==-1){n=Math.round(this._getDisplayValue())+1;}if(n>1){n=n-1;}else{n=1;}this.updateHoverState(e,n);};a.prototype.onsaphome=function(e){this.updateHoverState(e,1);};a.prototype.onsapend=function(e){this.updateHoverState(e,this.getMaxValue());};a.prototype.onsapselect=function(e){this.saveValue(e,true,this.iHoveredRating);};a.prototype.onsapescape=function(e){this.saveValue(e,true,-1);};a.prototype.onfocusout=function(e){if(!!sap.ui.Device.browser.internet_explorer&&e.target!=this.getDomRef()){return;}this.saveValue(e,false,this.iHoveredRating);};a.prototype.onfocusin=function(e){if(!!sap.ui.Device.browser.internet_explorer&&e.target!=this.getDomRef()){this.getDomRef().focus();}};a.prototype.onclick=function(e){this.saveValue(e,true,this.getSymbolValue(e));};a.prototype.onmouseover=function(e){e.preventDefault();e.stopPropagation();if(!this.getEditable()){return;}this.iHoveredRating=-1;var s=this.getSymbolValue(e);if(s==-1){return;}for(var i=1;i<=s;i++){sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i,this);}for(var i=s+1;i<=this.getMaxValue();i++){sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i,this,true);}};a.prototype.onmouseout=function(e){e.preventDefault();e.stopPropagation();if(!this.getEditable()){return;}if(q.sap.checkMouseEnterOrLeave(e,this.getDomRef())){this.iHoveredRating=-1;for(var i=1;i<=this.getMaxValue();i++){sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i,this);}}};a.prototype.getSymbolValue=function(e){var s=q(e.target);if(s.hasClass("sapUiRatingItmImg")||s.hasClass("sapUiRatingItmOvrflw")){s=q(e.target.parentNode);}else if(s.hasClass("sapUiRatingItmOvrflwImg")){s=q(e.target.parentNode.parentNode);}var i=s.attr("itemvalue");if(i){return parseInt(i,10);}return-1;};a.prototype.updateKeyboardHoverState=function(s){for(var i=1;i<=this.getMaxValue();i++){sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i,this);if(i<=this.iHoveredRating){sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i,this);}else if(!s){sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i,this,true);}}this.setAriaState();};a.prototype.onAfterRendering=function(){this.setAriaState();};a.prototype.setAriaState=function(){var v=this.iHoveredRating==-1?this._getDisplayValue():this.iHoveredRating;this.$().attr("aria-valuenow",v).attr("aria-valuetext",this._getText("RATING_ARIA_VALUE",[v])).attr("aria-label",this._getText("RATING_ARIA_NAME"));};a.prototype._getText=function(k,A){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");if(r){return r.getText(k,A);}return k;};a.prototype.saveValue=function(e,b,n){if(b){e.preventDefault();}if(!this.getEditable()){return false;}this.iHoveredRating=-1;if(n!=-1&&n!=this.getValue()){this.setValue(n);this.fireChange({value:n});return true;}else{for(var i=1;i<=this.getMaxValue();i++){sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i,this);}this.setAriaState();return false;}};a.prototype.updateHoverState=function(e,n){e.preventDefault();e.stopPropagation();if(!this.getEditable()){return;}this.iHoveredRating=n;this.updateKeyboardHoverState();};a.prototype.setMaxValue=function(m){if(m<1){m=1;}this.setProperty("maxValue",m);return this;};a.prototype.getAccessibilityInfo=function(){var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");return{role:"slider",type:b.getText("ACC_CTR_TYPE_RATING"),description:b.getText("ACC_CTR_STATE_RATING",[this._getDisplayValue(),this.getMaxValue()]),focusable:true,editable:this.getEditable()};};return a;},true);
