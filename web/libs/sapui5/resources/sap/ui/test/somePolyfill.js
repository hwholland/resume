/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(!Array.prototype.some){Array.prototype.some=function(f){'use strict';if(this==null){throw new TypeError();}var a,i,t=Object(this),l=t.length>>>0;if(typeof f!=='function'){throw new TypeError();}a=arguments[1];for(i=0;i<l;i++){if(i in t&&f.call(a,t[i],i,t)){return true;}}return false;};}
