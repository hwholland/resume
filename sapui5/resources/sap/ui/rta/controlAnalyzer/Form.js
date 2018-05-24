/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/rta/controlAnalyzer/Base','sap/ui/dt/ElementUtil','sap/ui/fl/Utils'],function(B,E,F){"use strict";var a=B.extend("sap.ui.rta.controlAnalyzer.Form",{metadata:{library:"sap.ui.rta",properties:{}}});a.prototype.init=function(){};a.prototype.isEditable=function(e){var s=this._getSimpleFormContainer(e);if(s){return this._hasStableIds(s);}};a.prototype._getSimpleFormContainer=function(e){var p=e.getParent();if(E.isInstanceOf(e,"sap.ui.layout.form.FormElement")){return this._getSimpleFormContainer(p);}else if(E.isInstanceOf(e,"sap.ui.layout.form.FormContainer")){p=p.getParent?p.getParent():null;if(E.isInstanceOf(p,"sap.ui.layout.form.SimpleForm")){return p;}}};a.prototype._hasStableIds=function(e){if(E.isInstanceOf(e,"sap.ui.layout.form.SimpleForm")&&F.checkControlId(e)){var h=e.getContent().some(function(c){var H=!F.checkControlId(c);return H;});return!h;}};return a;},true);
