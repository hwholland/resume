/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/routing/Router','sap/ui/core/routing/History'],function(R,H){"use strict";var D=R.extend("sap.ui.documentation.sdk.util.DocumentationRouter",{myNavBack:function(r,d){var h=H.getInstance();var p=h.getPreviousHash();if(p!==undefined){window.history.go(-1);}else{var b=true;this.navTo(r,d,b);}},myNavToWithoutHash:function(v,a,m,d){var c=this._getOwnerComponent(),r=c.byId(c.getManifestEntry("/sap.ui5/rootView").id),A=r.byId("splitApp"),V=this.getView(v,a);A.addPage(V,m);A.toDetail(V.getId(),"show",d);},_getOwnerComponent:function(){return this._oOwner;}});return D;});
