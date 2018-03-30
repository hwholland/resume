/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/rta/command/BaseCommand','sap/ui/fl/changeHandler/BaseTreeModifier','sap/ui/fl/Utils'],function(B,a,f){"use strict";var C=B.extend("sap.ui.rta.command.ControlVariantSwitch",{metadata:{library:"sap.ui.rta",properties:{targetVariantReference:{type:"string"},sourceVariantReference:{type:"string"}},associations:{},events:{}}});C.prototype.MODEL_NAME="$FlexVariants";C.prototype._getAppComponent=function(e){if(!this._oControlAppComponent){this._oControlAppComponent=e?f.getAppComponentForControl(e):this.getSelector().appComponent;}return this._oControlAppComponent;};C.prototype.execute=function(){var e=this.getElement(),A=this._getAppComponent(e),n=this.getTargetVariantReference();this.oModel=A.getModel(this.MODEL_NAME);this.sVariantManagementReference=a.getSelector(e,A).id;return this._updateModelVariant(n);};C.prototype.undo=function(){var o=this.getSourceVariantReference();return this._updateModelVariant(o);};C.prototype._updateModelVariant=function(v){if(this.getTargetVariantReference()!==this.getSourceVariantReference()){return Promise.resolve(this.oModel.updateCurrentVariant(this.sVariantManagementReference,v));}return Promise.resolve();};return C;},true);