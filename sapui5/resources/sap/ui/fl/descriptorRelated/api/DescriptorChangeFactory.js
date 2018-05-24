/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/ChangePersistence","sap/ui/fl/Change"],function(C,a,b){"use strict";var D=function(m,i){this._mChangeFile=m;this._mChangeFile.packageName='$TMP';this._oInlineChange=i;};D.prototype.submit=function(){var i=this._oInlineChange.getMap();this._mChangeFile.content=i.content;var o=new b(this._mChangeFile);var s=this._mChangeFile.reference;var d=C.getChangePersistenceForComponent(s);d.addChange(o);return d.saveDirtyChanges();};D.prototype._getMap=function(){return this._mParameters;};var c=function(){};c.prototype.createNew=function(r,i){var p={};p.changeType=i._getChangeType();p.componentName=r;p.reference=r;var m=b.createInitialFileContent(p);var d=new D(m,i);return new Promise(function(e,f){e(d);});};return c;},true);
