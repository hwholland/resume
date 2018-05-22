/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.promiseBasedCreateReadRequest');
sap.apf.ui.utils.PromiseBasedCreateReadRequest=function(c,r,f){var d=new jQuery.Deferred();var R=c.createReadRequestByRequiredFilter(r);var C=function(D,m){var a={aData:D,oMetadata:m};if(D&&m){d.resolveWith(this,[a]);}else{d.rejectWith(this,[a]);}};if(!f){f=c.createFilter();}R.send(f,C);return d.promise();};
