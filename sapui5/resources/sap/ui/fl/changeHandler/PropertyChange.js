/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/changeHandler/Base","sap/ui/fl/Utils"],function(q,B,F){"use strict";var P={};P.applyChange=function(c,C,p){try{var d=c.getDefinition();var s=d.content.property;var o=d.content.newValue;p.modifier.setProperty(C,s,o);}catch(e){throw new Error("Applying property changes failed: "+e);}};P.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}else{throw new Error("oSpecificChangeInfo attribute required");}};return P;},true);
