/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Component","sap/ui/fl/ChangePersistence","sap/ui/fl/Utils"],function(q,C,a,U){"use strict";var b={};b._instanceCache={};b.getChangePersistenceForComponent=function(c){var o;if(!b._instanceCache[c]){o=new a(c);b._instanceCache[c]=o;}return b._instanceCache[c];};b.getChangePersistenceForControl=function(c){var s;s=this._getComponentClassNameForControl(c);return b.getChangePersistenceForComponent(s);};b._getComponentClassNameForControl=function(c){return U.getComponentClassName(c);};b.registerManifestLoadedEventHandler=function(){C._fnManifestLoadCallback=this._onManifestLoaded;};b._onManifestLoaded=function(m,A){if(m&&m["sap.app"]&&m["sap.app"].type==="application"&&A&&A.requests&&Array.isArray(A.requests)){var f=A.requests.find(this._flAsyncHintMatches);if(f){var c=f.reference;var s=f.cachebusterToken;var o=this.getChangePersistenceForComponent(c);o.getChangesForComponent({"cacheKey":s||"<NO CHANGES>"});}}};b._flAsyncHintMatches=function(A){return A.name==="sap.ui.fl.changes";};return b;},true);
