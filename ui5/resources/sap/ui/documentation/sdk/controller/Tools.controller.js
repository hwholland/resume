/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/Device","sap/ui/documentation/sdk/controller/BaseController"],function(q,D,B){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Tools",{onInit:function(){B.prototype.onInit.call(this);this._onOrientationChange({landscape:D.orientation.landscape});this.getRouter().getRoute("tools").attachPatternMatched(this._onMatched,this);},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();},onExit:function(){this._deregisterOrientationChange();},_onMatched:function(){try{this.hideMasterSide();}catch(e){q.sap.log.error(e);}}});});
