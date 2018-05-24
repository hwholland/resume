/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObjectMetadata','sap/ui/core/Renderer'],function(q,M,R){"use strict";var E=function(c,C){M.apply(this,arguments);};E.prototype=Object.create(M.prototype);E.uid=M.uid;E.prototype.getElementName=function(){return this._sClassName;};E.prototype.getRendererName=function(){return this._sRendererName;};E.prototype.getRenderer=function(){var r=this.getRendererName();if(!r){return;}var f=q.sap.getObject(r);if(f){return f;}q.sap.require(r);return q.sap.getObject(r);};E.prototype.applySettings=function(c){var s=c.metadata;this._sVisibility=s["visibility"]||"public";var r=c.hasOwnProperty("renderer")?(c.renderer||""):undefined;delete c.renderer;M.prototype.applySettings.call(this,c);this._sRendererName=this.getName()+"Renderer";if(typeof r!=="undefined"){if(typeof r==="string"){this._sRendererName=r||undefined;return;}if(typeof r==="function"){r={render:r};}var p=this.getParent();var b;if(p instanceof E){b=p.getRenderer();}if(!b){b=R;}var o=Object.create(b);q.extend(o,r);q.sap.setObject(this.getRendererName(),o);}};E.prototype.afterApplySettings=function(){M.prototype.afterApplySettings.apply(this,arguments);this.register&&this.register(this);};E.prototype.isHidden=function(){return this._sVisibility==="hidden";};return E;},true);