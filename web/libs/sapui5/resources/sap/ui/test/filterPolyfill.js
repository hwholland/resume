/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(!Array.prototype.filter){Array.prototype.filter=function(f){"use strict";if(this==null){throw new TypeError();}var t=Object(this);var l=t.length>>>0;if(typeof f!="function"){throw new TypeError();}var r=[];var a=arguments[1];for(var i=0;i<l;i++){if(i in t){var v=t[i];if(f.call(a,v,i,t)){r.push(v);}}}return r;};}
