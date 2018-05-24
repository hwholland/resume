/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object'],function(q,B){"use strict";var S=B.extend("sap.ui.core.service.Service",{metadata:{"abstract":true,"library":"sap.ui.core"},constructor:function(s){B.apply(this);if(s){}this._oServiceContext=s;if(typeof this.init==="function"){this.init();}}});S.create=function(s){var A=function A(o){for(var m in s){if(!m.match(/^(metadata|constructor|getContext|destroy)$/)){this[m]=s[m];}else{q.sap.log.warning("The member "+m+" is not allowed for anonymous service declaration and will be ignored!");}}S.apply(this,arguments);};A.prototype=Object.create(S.prototype);return A;};S.prototype.getInterface=function(){var p=Object.create(null);for(var m in this){if(!m.match(/^_|^metadata$|^constructor$|^getInterface$|^destroy$|^init$|^exit$|^getContext$/)&&typeof this[m]==="function"){p[m]=this[m].bind(this);}}this.getInterface=function(){return p;};return p;};S.prototype.getContext=function(){return this._oServiceContext;};S.prototype.destroy=function(){if(typeof this.exit==="function"){this.exit();}B.prototype.destroy.apply(this,arguments);delete this._oServiceContext;};return S;});