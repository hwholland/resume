/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/fl/Utils','jquery.sap.global','sap/ui/fl/changeHandler/Base'],function(U,q,B){"use strict";var R={};R.applyChange=function(c,g,p){var C=c.getDefinition();var m=p.modifier;if(C.texts&&C.texts.groupLabel&&this._isProvided(C.texts.groupLabel.value)){m.setProperty(g,"label",C.texts.groupLabel.value);return true;}else{U.log.error("Change does not contain sufficient information to be applied: ["+C.layer+"]"+C.namespace+"/"+C.fileName+"."+C.fileType);}};R.completeChangeContent=function(c,s){var C=c.getDefinition();if(this._isProvided(s.groupLabel)){B.setTextInChange(C,"groupLabel",s.groupLabel,"XFLD");}else{throw new Error("oSpecificChangeInfo.groupLabel attribute required");}};R._isProvided=function(s){return typeof(s)==="string";};return R;},true);
