/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/base/Object','sap/ui/thirdparty/URI','jquery.sap.script'],function(q,D,B,U){"use strict";var m=150;var T=B.extend("sap.ui.core.ThemeCheck",{constructor:function(C){this._oCore=C;this._iCount=0;this._CUSTOMCSSCHECK=/\.sapUiThemeDesignerCustomCss/i;this._CUSTOMID="sap-ui-core-customcss";this._customCSSAdded=false;this._themeCheckedForCustom=null;this._sFallbackTheme=null;this._mThemeFallback={};this._oThemeMetaDataCheckElement=null;},getInterface:function(){return this;},fireThemeChangedEvent:function(o){c(this);d.apply(this,[true]);if(!o&&!this._sThemeCheckId){this._oCore.fireThemeChanged({theme:this._oCore.getConfiguration().getTheme()});}}});T.themeLoaded=false;function s(f){try{return f.cssRules;}catch(e){if(e.name!=='SecurityError'&&e.name!=='InvalidAccessError'){throw e;}else{return null;}}}function h(e){var C=s(e);return!!C&&C.length>0;}T.checkStyle=function(i,l){var S=document.getElementById(i);try{var n=false,L=false,f=false,I=false;n=!S;L=!!(S&&(S.getAttribute("data-sap-ui-ready")==="true"||S.getAttribute("data-sap-ui-ready")==="false"));f=!!(S&&S.sheet&&S.sheet.href===S.href&&h(S.sheet));I=!!(S&&S.innerHTML&&S.innerHTML.length>0);var r=n||f||I||L;if(l){q.sap.log.debug("ThemeCheck: "+i+": "+r+" (noLinkElement: "+n+", sheet: "+f+", innerHtml: "+I+", linkElementFinishedLoading: "+L+")");}return r;}catch(e){if(l){q.sap.log.error("ThemeCheck: "+i+": Error during check styles '"+i+"'",e);}}return false;};function c(t){T.themeLoaded=false;if(t._sThemeCheckId){q.sap.clearDelayedCall(t._sThemeCheckId);t._sThemeCheckId=null;t._iCount=0;t._sFallbackTheme=null;t._mThemeFallback={};if(t._oThemeMetaDataCheckElement&&t._oThemeMetaDataCheckElement.parentNode){t._oThemeMetaDataCheckElement.parentNode.removeChild(t._oThemeMetaDataCheckElement);t._oThemeMetaDataCheckElement=null;}}}function a(t){var L=t._oCore.getLoadedLibraries();var e=t._oCore.getConfiguration().getTheme();var p=t._oCore._getThemePath("sap.ui.core",e)+"custom.css";var I=e.indexOf("sap_")===0||e==="base";var r=true;var f=[];if(!!t._customCSSAdded&&t._themeCheckedForCustom===e){L[t._CUSTOMID]={};}function j(k){var S="sap-ui-theme-"+k;var n=T.checkStyle(S,true);if(n){var o=document.querySelectorAll("link[data-sap-ui-foucmarker='"+S+"']");if(o.length>0){for(var i=0,l=o.length;i<l;i++){o[i].parentNode.removeChild(o[i]);}q.sap.log.debug("ThemeCheck: Old stylesheets removed for library: "+k);}}r=r&&n;if(r){if(t._themeCheckedForCustom!=e){if(!I&&b(t,k)){var C=p;var u=t._oCore._getLibraryCssQueryParams(L["sap.ui.core"]);if(u){C+=u;}q.sap.includeStyleSheet(C,t._CUSTOMID);t._customCSSAdded=true;q.sap.log.warning("ThemeCheck: delivered custom CSS needs to be loaded, Theme not yet applied");t._themeCheckedForCustom=e;r=false;return false;}else{var v=q("LINK[id='"+t._CUSTOMID+"']");if(v.length>0){v.remove();q.sap.log.debug("ThemeCheck: Custom CSS removed");}t._customCSSAdded=false;}}}if(!I&&n&&!t._mThemeFallback[k]){var w=document.getElementById(S);if(w&&w.getAttribute("data-sap-ui-ready")==="false"&&!(w.sheet&&h(w.sheet))){f.push(k);}}}q.each(L,j);if(f.length>0){if(!t._sFallbackTheme){if(!t._oThemeMetaDataCheckElement){t._oThemeMetaDataCheckElement=document.createElement("style");q.each(L,function(l){var C="sapThemeMetaData-UI5-"+l.replace(/\./g,"-");t._oThemeMetaDataCheckElement.classList.add(C);});document.head.appendChild(t._oThemeMetaDataCheckElement);}t._sFallbackTheme=g(t._oThemeMetaDataCheckElement);}if(t._sFallbackTheme){f.forEach(function(l){var S="sap-ui-theme-"+l;var o=document.getElementById(S);q.sap.log.warning("ThemeCheck: Custom theme '"+e+"' could not be loaded for library '"+l+"'. "+"Falling back to its base theme '"+t._sFallbackTheme+"'.");t._oCore._updateThemeUrl(o,t._sFallbackTheme);t._mThemeFallback[l]=true;});r=false;}}if(!r){q.sap.log.warning("ThemeCheck: Theme not yet applied.");}else{t._themeCheckedForCustom=e;}return r;}function g(t){function e(){var f=window.getComputedStyle(t).getPropertyValue("background-image");var i=/\(["']?data:text\/plain;utf-8,(.*?)['"]?\)/i.exec(f);if(!i||i.length<2){return null;}var M=i[1];if(M.charAt(0)!=="{"&&M.charAt(M.length-1)!=="}"){try{M=decodeURI(M);}catch(j){}}M=M.replace(/\\"/g,'"');M=M.replace(/%20/g," ");try{return JSON.parse(M);}catch(j){return null;}}var o=e();if(o&&o.Extends&&o.Extends[0]){return o.Extends[0];}else{return null;}}function b(t,l){var f=q.sap.domById("sap-ui-theme-"+l);if(!f){return false;}var j=window.getComputedStyle(f,':after');var k=j?j.getPropertyValue('content'):null;if(!k&&D.browser.safari){var n=document.documentElement;n.classList.add("sapUiThemeDesignerCustomCss");k=window.getComputedStyle(n,":after").getPropertyValue("content");n.classList.remove("sapUiThemeDesignerCustomCss");}if(k&&k!=="none"){try{if(k[0]==="'"||k[0]==='"'){k=k.substring(1,k.length-1);}return k==="true";}catch(e){q.sap.log.error("Custom check: Error parsing JSON string for custom.css indication.",e);}}var r=f.sheet?s(f.sheet):null;if(!r||r.length===0){q.sap.log.warning("Custom check: Failed retrieving a CSS rule from stylesheet "+l);return false;}for(var i=0;(i<2&&i<r.length);i++){if(t._CUSTOMCSSCHECK.test(r[i].selectorText)){return true;}}return false;}function d(f){this._iCount++;var e=this._iCount>m;if(!a(this)&&!e){var i;if(this._iCount<=100){i=2;}else if(this._iCount<=110){i=500;}else{i=1000;}this._sThemeCheckId=q.sap.delayedCall(i,this,d);}else if(!f){c(this);T.themeLoaded=true;this._oCore.fireThemeChanged({theme:this._oCore.getConfiguration().getTheme()});if(e){q.sap.log.warning("ThemeCheck: max. check cycles reached.");}}else{T.themeLoaded=true;}}return T;});
