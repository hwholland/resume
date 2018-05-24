/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/ui/fl/changeHandler/ChangeHandlerMediator"],function(U,C){"use strict";var A={};var t="sap.ui.core.Title";var T="sap.m.Toolbar";var s="sap.m.Label";var a="sap.ui.comp.smartfield.SmartLabel";A.applyChange=function(c,S,p){var o=c.getDefinition();var b=c.getDependentControl("targetContainerHeader",p);var m=C.getChangeHandlerSettings({"scenario":"addODataFieldWithLabel","oDataServiceVersion":o.content&&o.content.oDataServiceVersion});var f=m&&m.content&&m.content.createFunction;var d=function(o){var v=o.content;var w=false;if(v){w=o.content.newFieldSelector&&(o.content.newFieldIndex!==undefined)&&o.content.bindingPath&&o.content.oDataServiceVersion&&f;}return v&&w;};var M=p.modifier;if(d(o)){var e=o.content;var F=e.newFieldSelector;var B=e.bindingPath;var g=e.newFieldIndex;var h=M.getAggregation(S,"content");var k=h.slice();var I=h.indexOf(b);var n=0;var l=0;if(h.length===1||h.length===I+1){n=h.length;}else{var j=0;for(j=I+1;j<h.length;j++){var q=M.getControlType(h[j]);if(q===s||q===a){if(l==g){n=j;break;}l++;}if(q===t||q===T){n=j;break;}if(j===(h.length-1)){n=h.length;}}}var r={"appComponent":p.appComponent,"view":p.view,"fieldSelector":F,"bindingPath":B};var u=f(M,r);k.splice(n,0,u.label,u.control);M.removeAllAggregation(S,"content");for(var i=0;i<k.length;++i){M.insertAggregation(S,"content",k[i],i,p.view);}return true;}else{U.log.error("Change does not contain sufficient information to be applied or ChangeHandlerMediator could not be retrieved: ["+o.layer+"]"+o.namespace+"/"+o.fileName+"."+o.fileType);}};A.completeChangeContent=function(c,S,p){var o=p.appComponent;var v=p.view;var b=c.getDefinition();if(!b.content){b.content={};}if(S.parentId){var f=p.modifier.bySelector(S.parentId,o,v);var d=f.getTitle()||f.getToolbar();if(d){c.addDependentControl(d.getId(),"targetContainerHeader",p);}}else{throw new Error("oSpecificChangeInfo.parentId attribute required");}if(S.bindingPath){b.content.bindingPath=S.bindingPath;}else{throw new Error("oSpecificChangeInfo.bindingPath attribute required");}if(S.newControlId){b.content.newFieldSelector=p.modifier.getSelector(S.newControlId,o);}else{throw new Error("oSpecificChangeInfo.newControlId attribute required");}if(S.index===undefined){throw new Error("oSpecificChangeInfo.targetIndex attribute required");}else{b.content.newFieldIndex=S.index;}if(S.oDataServiceVersion===undefined){throw new Error("oSpecificChangeInfo.oDataServiceVersion attribute required");}else{b.content.oDataServiceVersion=S.oDataServiceVersion;}};return A;},true);