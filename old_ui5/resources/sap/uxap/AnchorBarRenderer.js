/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/ToolbarRenderer","sap/ui/core/Renderer","sap/m/BarInPageEnabler","./library"],function(T,R,B,l){"use strict";var A=R.extend(T);var _=A._AnchorBarHierarchicalSelectMode={Icon:"icon",Text:"text"};A.renderBarContent=function(r,t){if(t._bHasButtonsBar){r.renderControl(t._getScrollArrowLeft());r.write("<div");r.writeAttributeEscaped("id",t.getId()+"-scrollContainer");r.writeAttributeEscaped("aria-label",l.i18nModel.getResourceBundle().getText("ANCHOR_BAR_LABEL"));r.addClass("sapUxAPAnchorBarScrollContainer");r.writeClasses();r.write(">");r.write("<div");r.writeAttributeEscaped("id",t.getId()+"-scroll");r.write(">");A.renderBarItems(r,t);r.write("</div>");r.write("</div>");r.renderControl(t._getScrollArrowRight());}B.addChildClassTo(t._oSelect,t);r.renderControl(t._oSelect);};A.renderBarItems=function(r,t){var s=t.getSelectedButton();t.getContent().forEach(function(c){B.addChildClassTo(c,t);if(c.getId()===s){c.addStyleClass("sapUxAPAnchorBarButtonSelected");}r.renderControl(c);});};A.decorateRootElement=function(r,t){T.decorateRootElement.apply(this,arguments);if(t._sHierarchicalSelectMode===_.Icon){r.addClass("sapUxAPAnchorBarOverflow");}};return A;},true);
