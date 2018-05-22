/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(!Array.prototype.every){Array.prototype.every=function(c,t){"use strict";var T,k;if(this==null){throw new TypeError("this is null or not defined");}var O=Object(this);var l=O.length>>>0;if(typeof c!=="function"){throw new TypeError();}if(arguments.length>1){T=t;}k=0;while(k<l){var a;if(k in O){a=O[k];var b=c.call(T,a,k,O);if(!b){return false;}}k++;}return true;};}
