/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Component','sap/ui/fl/FlexControllerFactory','sap/ui/fl/Utils','sap/ui/fl/LrepConnector','sap/ui/fl/Cache'],function(jQuery,Component,FlexControllerFactory,Utils,LrepConnector,Cache){'use strict';var FlexPreprocessorImpl=function(){};FlexPreprocessorImpl.prototype.getControllerExtensions=function(c,C,a){if(a){return Cache.getChangesFillingCache(LrepConnector.createConnector(),C,undefined).then(function(f){var o=f.changes;var e=[];if(o&&o.changes){jQuery.each(o.changes,function(i,b){if(b.changeType==="CodingExtension"&&b.content&&c===b.content.controllerName){e.push(FlexPreprocessorImpl.getExtensionProvider(b));}});}return e;});}};FlexPreprocessorImpl.getExtensionProvider=function(oChange){var sConvertedAsciiCodeContent=oChange.content.code;var sConvertedCodeContent=Utils.asciiToString(sConvertedAsciiCodeContent);var oExtensionProvider;eval("oExtensionProvider = {"+sConvertedCodeContent+" } ");return oExtensionProvider;};FlexPreprocessorImpl.process=function(v){return Promise.resolve().then(function(){var c=Utils.getComponentClassName(v);if(!c||c.length===0){var e="no component name found for "+v.getId();jQuery.sap.log.info(e);throw new Error(e);}else{var f=FlexControllerFactory.create(c);return f.processView(v);}}).then(function(){jQuery.sap.log.debug("flex processing view "+v.getId()+" finished");return v;})["catch"](function(e){var E="view "+v.getId()+": "+e;jQuery.sap.log.info(E);return v;});};return FlexPreprocessorImpl;},true);