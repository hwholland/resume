/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(!Array.prototype.map){Array.prototype.map=function(f){"use strict";if(this===void 0||this===null){throw new TypeError();}var t=Object(this);var l=t.length>>>0;if(typeof f!=="function"){throw new TypeError();}var r=new Array(l);var a=arguments.length>=2?arguments[1]:void 0;for(var i=0;i<l;i++){if(i in t){r[i]=f.call(a,t[i],i,t);}}return r;};}
