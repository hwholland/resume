/*!
 * ${copyright}
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,s){var i=s.getId(),c;r.write("<div");r.writeControlData(s);r.addClass("sapUshellShell");if(s.getShowAnimation()){r.addClass("sapUshellShellAnim");}if(!s.getHeaderVisible()){r.addClass("sapUshellShellNoHead");}r.addClass("sapUshellShellHead"+(s._showHeader?"Visible":"Hidden"));r.writeClasses();r.write(">");if(!s.getShowBrandLine()){r.write("<div id='",i,"-strgbg' class='sapUshellShellBG sapContrastPlus"+(s._useStrongBG?" sapUiStrongBackgroundColor":"")+"'></div>");r.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUshellShellBG sapContrastPlus'></div>");}if(s.getShowBrandLine()){r.write("<hr id='",i,"-brand' class='sapUshellShellBrand'/>");}r.write("<header id='",i,"-hdr'  class='sapContrastPlus sapUshellShellHead'><div>");r.write("<div id='",i,"-hdrcntnt' class='sapUshellShellCntnt'>");if(s.getHeader()){r.renderControl(s.getHeader());}r.write("</div>","</div>","</header>");if(s.getFloatingContainer()){r.write("<div");r.addClass("sapUshellShellFloatingContainerWrapper ");if(!s.getFloatingContainerVisible()){r.addClass("sapUshellShellHidden");}r.writeClasses();r.write(">");r.renderControl(s.getFloatingContainer());r.write("</div>");}if(s.getToolArea()){r.write("<aside>");r.renderControl(s.getToolArea());r.write("</aside>");}if(s.getRightFloatingContainer()){r.write("<aside>");r.renderControl(s.getRightFloatingContainer());r.write("</aside>");}c="sapUshellShellCntnt sapUshellShellCanvas";if(s.getBackgroundColorForce()){c+=" sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce";}r.write("<div id='",i,"-cntnt' class='"+c+"'>");if(s.getShowBrandLine()){r.write("<div id='",i,"-strgbg' class='sapUshellShellBG sapContrastPlus"+(s._useStrongBG?" sapUiStrongBackgroundColor":"")+"'></div>");r.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUshellShellBG sapContrastPlus'></div>");}r.renderControl(s.getCanvasSplitContainer());r.write("</div>");r.write("<span id='",i,"-main-focusDummyOut' tabindex='-1'></span>");r.renderControl(s.getFloatingActionsContainer());r.write("</div>");};return S;},true);