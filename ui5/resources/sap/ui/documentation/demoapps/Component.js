/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/UIComponent','sap/ui/model/json/JSONModel','sap/ui/documentation/demoapps/model/libraryData','sap/ui/documentation/demoapps/model/models'],function(U,J,l,m){"use strict";return U.extend("sap.ui.documentation.demoapps.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);this.setModel(m.createDeviceModel(),"device");var M=new J();l.fillJSONModel(M);this.setModel(M);}});});
