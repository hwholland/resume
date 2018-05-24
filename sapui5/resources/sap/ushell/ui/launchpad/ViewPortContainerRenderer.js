/*!
 * ${copyright}
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";q.sap.declare("sap.ushell.ui.launchpad.ViewPortContainerRenderer");var V={};V.renderViewPortPart=function(c,a,v){var j=q(a).find("#"+v);var r=sap.ui.getCore().createRenderManager();r.render(c,j[0]);r.destroy();};V._renderViewPort=function(r,v,i,a){r.write("<div");a.forEach(function(c){r.addClass(c);});r.writeClasses();r.writeAttribute("id",i);r.write(">");v.forEach(function(o){r.renderControl(o);});r.write("</div>");};V._renderCenterViewPort=function(r,v,i,a){r.write("<div");r.addClass('sapUshellViewPortWrapper');r.writeClasses();r.writeAttribute("id",i+'-wrapper');r.write(">");V._renderViewPort(r,v,i,a);r.write("</div>");};V.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);if(c.getWidth()){r.addStyle("width",c.getWidth());}c.getHeight();if(c.getHeight()){r.addStyle("height",c.getHeight());}if(this.renderAttributes){this.renderAttributes(r,c);}var s=c._states,S=s[c.sCurrentState],v=S.visibleViewPortsData,t=c._getTranslateXValue(c.sCurrentState),l=["sapUshellViewPortLeft"],C=["sapUshellViewPortCenter"],R=["sapUshellViewPortRight"];var o=sap.ui.getCore().getConfiguration();this.bIsRTL=!q.isEmptyObject(o)&&o.getRTL?o.getRTL():false;r.addStyle(this.bIsRTL?'right':'left',t);r.writeStyles();r.write(">");v.forEach(function(e){switch(e.viewPortId){case'leftViewPort':l.push(e.className);break;case'centerViewPort':C.push(e.className);break;case'rightViewPort':R.push(e.className);break;}});V._renderViewPort(r,c.getLeftViewPort(),'leftViewPort',l);V._renderCenterViewPort(r,c.getCenterViewPort(),'centerViewPort',C);V._renderViewPort(r,c.getRightViewPort(),'rightViewPort',R);r.write("</div>");};return V;},true);