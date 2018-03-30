/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController","sap/m/library","sap/ui/Device"],function(q,B,m,D){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Welcome",{onInit:function(){this.getRouter().getRoute("welcome").attachPatternMatched(this._onMatched,this);this._onOrientationChange({landscape:D.orientation.landscape});},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();},onExit:function(){this._deregisterOrientationChange();},navigateToDetails:function(e){var h=e.oSource.getHref()||e.oSource.getTarget();h=h.replace("#/","").split('/');var p=h[0];var a=h[1];e.preventDefault();this.getRouter().navTo(p,{id:a},true);},onGetStarted:function(){m.URLHelper.redirect("#/topic/8b49fc198bf04b2d9800fc37fecbb218");},_onMatched:function(){try{this.hideMasterSide();}catch(e){q.sap.log.error(e);}}});});
