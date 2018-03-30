/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController"],function(q,B){"use strict";return B.extend("sap.ui.documentation.sdk.controller.DemoApps",{onInit:function(){this.getRouter().getRoute("demoapps").attachPatternMatched(this._onMatched,this);},_onMatched:function(){try{this.hideMasterSide();}catch(e){q.sap.log.error(e);}}});});
