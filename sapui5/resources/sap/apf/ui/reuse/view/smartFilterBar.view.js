/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';sap.ui.jsview("sap.apf.ui.reuse.view.smartFilterBar",{getControllerName:function(){return"sap.apf.ui.reuse.controller.smartFilterBar";},createContent:function(c){var v=this,e,s,p,S;e=v.getViewData().oSmartFilterBarConfiguration.entityType;s=v.getViewData().oSmartFilterBarConfiguration.id;p=v.getViewData().oCoreApi.getSmartFilterBarPersistenceKey(s);S=new sap.ui.comp.smartfilterbar.SmartFilterBar(c.createId("idAPFSmartFilterBar"),{entityType:e,controlConfiguration:v.getViewData().controlConfiguration,initialized:c.registerSFBInstanceWithCore.bind(c),search:c.handlePressOfGoButton.bind(c),persistencyKey:p,customData:{key:"dateFormatSettings",value:{"UTC":true}}});v.setParent(v.getViewData().parent);return S;}});}());
