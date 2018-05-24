/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/EventProvider','sap/ui/base/ManagedObject'],function(q,E,M){"use strict";var r={};var e={};var C=E.extend("sap.ui.core.mvc.Controller",{constructor:function(n){var t=null;if(typeof(n)=="string"){if(!r[n]){q.sap.log.warning("Do not call sap.ui.core.mvc.Controller constructor for non typed scenario!");}t=r[n];}E.apply(this,arguments);if(t){q.extend(this,r[n]);}}});var c={"onInit":true,"onExit":false,"onBeforeRendering":false,"onAfterRendering":true};function m(o,f){for(var g in f){if(c[g]!==undefined){var O=o[g];if(O&&typeof O==="function"){(function(h,O,i){o[g]=function(){if(i){O.apply(o,arguments);h.apply(o,arguments);}else{h.apply(o,arguments);O.apply(o,arguments);}};})(f[g],O,c[g]);}else{o[g]=f[g];}}else{o[g]=f[g];}}}function a(n,A){if(!n){throw new Error("Controller name ('sName' parameter) is required");}var s=n.replace(/\./g,"/"),f=g(sap.ui.require(s));function g(f){if(f){return f;}else if(r[n]){return C;}else{return q.sap.getObject(n);}}s=s+".controller";if(A){return new Promise(function(h,i){if(!f){sap.ui.require([s],function(f){h(g(f));});}else{h(f);}});}else if(!f){f=sap.ui.requireSync(s);return g(f);}else{return f;}}function b(o,A){var p=C._sExtensionProvider.replace(/\./g,"/"),P=e[p];if(A){return new Promise(function(g,h){if(p){if(P){g(P);}else{sap.ui.require([p],function(f){P=new f();e[p]=P;g(P);});}}else{g();}});}else if(p){if(P){return P;}else{var f=sap.ui.requireSync(p);P=new f();e[p]=P;return P;}}}function d(f,n){var o;if(r[n]){o=new f(n);}else{o=new f();}if(!o){throw new Error("Controller "+n+" couldn't be instantiated");}return o;}C.extendByCustomizing=function(o,n,A){var f=sap.ui.require('sap/ui/core/CustomizingConfiguration');if(!f){return A?Promise.resolve(o):o;}var g,h=[],s,v=A?Promise.resolve(o):o,j=f.getControllerExtension(n,M._sOwnerId);if(j){s=typeof j==="string"?j:j.controllerName;h=j.controllerNames||[];if(s){s&&h.unshift(s);}}function k(t,o){return a(t,A).then(function(g){if((g=r[t])!==undefined){m(o,g);return o;}},function(u){q.sap.log.error("Attempt to load Extension Controller "+t+" was not successful - is the Controller correctly defined in its file?");});}for(var i=0,l=h.length;i<l;i++){var p=h[i];if(typeof p==="string"){q.sap.log.info("Customizing: Controller '"+n+"' is now extended by '"+p+"'");if(A){v=v.then(k.bind(null,p,o));}else{if(!r[p]&&!sap.ui.require(p)){a(p);}if((g=r[p])!==undefined){m(o,g);}else{q.sap.log.error("Attempt to load Extension Controller "+p+" was not successful - is the Controller correctly defined in its file?");}}}}return v;};C.extendByProvider=function(o,n,O,A){if(!C._sExtensionProvider){return A?Promise.resolve(o):o;}q.sap.log.info("Customizing: Controller '"+n+"' is now extended by Controller Extension Provider '"+C._sExtensionProvider+"'");var f,g;if(A){return b(o,A).then(function(g){return g.getControllerExtensions(n,O,A);}).then(function(h){if(h&&h.length){for(var i=0,l=h.length;i<l;i++){m(o,h[i]);}}return o;},function(h){q.sap.log.error("Controller Extension Provider: Error '"+h+"' thrown in "+C._sExtensionProvider+"extension provider ignored.");return o;});}else{g=b(o,A);f=g.getControllerExtensions(n,O,A);if(f&&Array.isArray(f)){for(var i=0,l=f.length;i<l;i++){m(o,f[i]);}}else{q.sap.log.error("Controller Extension Provider: Error in ExtensionProvider.getControllerExtensions: "+C._sExtensionProvider+" - no valid extensions returned");}}return o;};sap.ui.controller=function(n,o,A){var f,g,O=M._sOwnerId;if(typeof o==="boolean"){o=undefined;}if(!o){if(A){return a(n,A).then(function(g){return d(g,n);}).then(function(f){return C.extendByCustomizing(f,n,A);}).then(function(f){return C.extendByProvider(f,n,O,A);});}else{g=a(n,A);f=d(g,n);f=C.extendByCustomizing(f,n,A);f=C.extendByProvider(f,n,O,A);}return f;}else{r[n]=o;}};C.prototype.getView=function(){return this.oView;};C.prototype.byId=function(i){return this.oView?this.oView.byId(i):undefined;};C.prototype.createId=function(i){return this.oView?this.oView.createId(i):undefined;};C.prototype.getOwnerComponent=function(){var f=sap.ui.requireSync("sap/ui/core/Component");return f.getOwnerComponentFor(this.getView());};C.prototype.connectToView=function(v){this.oView=v;if(this.onInit){v.attachAfterInit(this.onInit,this);}if(this.onExit){v.attachBeforeExit(this.onExit,this);}if(this.onAfterRendering){v.attachAfterRendering(this.onAfterRendering,this);}if(this.onBeforeRendering){v.attachBeforeRendering(this.onBeforeRendering,this);}};C._sExtensionProvider=null;C.registerExtensionProvider=function(s){C._sExtensionProvider=s;};return C;});