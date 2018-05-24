/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.IDGenerator");(function(){var d={EVALUATION_ID_PREFIX:"E",KPI_ID_PREFIX:"K",VIEW_ID_PREFIX:"V"};var P="/tmp/aijaz/rnd/test.xsjs";var F=function(){};var I={TIMESTAMP:"TIMESTAMP",PUNYCODE:"PUNYCODE"};var C=I.TIMESTAMP;var p=function(n,m){var s=""+n;if(s.length>=m){return s;}else{return new Array(m-s.length+1).join('0')+n;}};var g=null;(function(s){switch(s){case I.TIMESTAMP:g=function(o){var a=new jQuery.Deferred();var b=o.prefix;if(o.title){b=(o.title+"").replace(/[\s]+/g,".")}b=b+"."+new Date().getTime();a.resolve(b);return a.promise();};break;case I.PUNYCODE:g=function(o){jQuery.sap.require("sap.ui.thirdparty.punycode");var t=punycode.encode(o.title.replace(/\s|\W/g,""));if(t.length>35){t=t.substring(0,35);}return jQuery.ajax({url:P,type:"get",data:{type:o.type,id:t},dataType:"json"}).pipe(function(a){if(a.found){var i=a.id.substring(0,35),n,f;var l=a.id.substring(35);if(l.length){n=-1;if(isNaN(l)){n=0;}else{n=Number(l);++n;}f=i+p(n,4);}else{f=i+p(0,4);}return f;}else{return t+p(0,4);}});};break;default:throw new Error("Please use a valid ID Generation Strategy");}})(C);F.prototype={generateEvaluationId:function(s){return g({prefix:d.EVALUATION_ID_PREFIX,title:s&&s.title,type:"evaluation"});},generateKpiId:function(s){return g({prefix:d.KPI_ID_PREFIX,title:s&&s.title,type:"kpi"});},generateViewId:function(s){return g({prefix:d.VIEW_ID_PREFIX,title:s&&s.title,type:"view"});}};sap.suite.ui.smartbusiness.lib.IDGenerator=new F();})();