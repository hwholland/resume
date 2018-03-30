/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/Text'],function(T){"use strict";var P=T.extend("sap.ui.documentation.sdk.controls.ParamText",{metadata:{properties:{customClass:{type:"string",group:"Behavior",defaultValue:"sapUiDocumentationParamBold"}}},onAfterRendering:function(){this.$().addClass(this.getCustomClass());},renderer:T.prototype.getRenderer().render});return P;});
