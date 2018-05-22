/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.odataRequest");jQuery.sap.require("sap.ui.thirdparty.datajs");jQuery.sap.require("sap.apf.core.utils.checkForTimeout");(function(){'use strict';sap.apf.core.odataRequestWrapper=function(i,r,s,e,b){var d=i.instances.datajs;function a(f,g){var M=sap.apf.core.utils.checkForTimeout(g);var E={};if(M){E.messageObject=M;e(E);}else{s(f,g);}}function c(E){var M=sap.apf.core.utils.checkForTimeout(E);if(M){E.messageObject=M;}e(E);}var m=r.serviceMetadata;d.request(r,a,c,b,undefined,m);};}());
