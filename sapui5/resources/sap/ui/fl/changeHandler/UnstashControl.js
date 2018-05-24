/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Base'],function(q,B){"use strict";var U={};U.applyChange=function(c,C,p){var m=c.getContent();var M=p.modifier;M.setStashed(C,false);M.setVisible(C,true);var t=m.parentAggregationName;var T=M.getParent(C);M.removeAggregation(T,t,C);M.insertAggregation(T,t,C,m.index);return true;};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}else{throw new Error("oSpecificChangeInfo attribute required");}};return U;},true);
