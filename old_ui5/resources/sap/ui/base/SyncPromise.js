/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";function c(t,r,a){var o;function b(R){if(!o){o=true;a(R);}}function d(R){if(!o){o=true;r(R);}}try{t(d,b);}catch(e){b(e);}}function h(v){return v&&(typeof v==="function"||typeof v==="object")&&"then"in v;}function S(E){var C=false,s,r,R,v,t=this;function a(d){v=d;s=-1;if(!C&&S.listener){S.listener(t,false);}if(r){r(d);r=R=null;}}function b(d){var T;if(d===t){a(new TypeError("A promise cannot be resolved with itself."));return;}if(d instanceof S){if(d.isFulfilled()){b(d.getResult());return;}else if(d.isRejected()){d.caught();a(d.getResult());return;}else{d.caught();d=d.getResult();}}s=0;v=d;if(h(v)){try{T=v.then;}catch(e){a(e);return;}if(typeof T==="function"){c(T.bind(v),b,a);return;}}s=1;if(R){R(v);r=R=null;}}this.caught=function(){if(!C){C=true;if(S.listener&&this.isRejected()){S.listener(this,true);}}};this.getResult=function(){return v;};this.isFulfilled=function(){return s===1;};this.isPending=function(){return!s;};this.isRejected=function(){return s===-1;};c(E,b,a);if(s===undefined){v=new Promise(function(b,a){R=b;r=a;});v.catch(function(){});}}S.prototype.catch=function(o){return this.then(undefined,o);};S.prototype.then=function(o,O){var C=this.isFulfilled()?o:O,b=typeof C==="function",p=this.isPending(),t=this;if(p||b){this.caught();}if(!p){return b?new S(function(r,a){r(C(t.getResult()));}):this;}return S.resolve(this.getResult().then(o,O));};S.prototype.toString=function(){if(this.isPending()){return"SyncPromise: pending";}return String(this.getResult());};S.all=function(v){return new S(function(r,a){var p;function b(){if(p===0){r(v);}}v=Array.prototype.slice.call(v);p=v.length;b();v.forEach(function(V,i){if(h(V)){S.resolve(V).then(function(R){v[i]=R;p-=1;b();},function(R){a(R);});}else{p-=1;b();}});});};S.reject=function(r){return new S(function(a,b){b(r);});};S.resolve=function(r){return r instanceof S?r:new S(function(a,b){a(r);});};return S;},true);