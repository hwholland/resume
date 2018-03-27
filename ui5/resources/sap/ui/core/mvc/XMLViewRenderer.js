/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ViewRenderer','../RenderManager'],function(q,V,R){"use strict";var P=R.RenderPrefixes.Dummy,a=R.RenderPrefixes.Invisible;var X={};X.render=function(r,c){var d=c.getDomRef();if(d&&!R.isPreservedContent(d)){R.preserveContent(d,true);}var $=c._$oldContent=R.findPreservedContent(c.getId());if($.length===0){var s=c.isSubView();if(!s){r.write("<div");r.writeControlData(c);r.addClass("sapUiView");r.addClass("sapUiXMLView");V.addDisplayClass(r,c);if(!c.oAsyncState||!c.oAsyncState.suppressPreserve){r.writeAttribute("data-sap-ui-preserve",c.getId());}if(c.getWidth()){r.addStyle("width",c.getWidth());}if(c.getHeight()){r.addStyle("height",c.getHeight());}r.writeStyles();r.writeClasses();r.write(">");}if(c._aParsedContent){for(var i=0;i<c._aParsedContent.length;i++){var f=c._aParsedContent[i];if(f&&typeof(f)==="string"){r.write(f);}else{r.renderControl(f);if(!f.bOutput){r.write('<div id="'+P+f.getId()+'" class="sapUiHidden"/>');}}}}if(!s){r.write("</div>");}}else{r.renderControl(c.oAfterRenderingNotifier);r.write('<div id="'+P+c.getId()+'" class="sapUiHidden">');for(var i=0;i<c._aParsedContent.length;i++){var f=c._aParsedContent[i];if(typeof(f)!=="string"){var F=f.getId(),b=q.sap.byId(F,$);if(b.length==0){b=q.sap.byId(a+F,$);}b.replaceWith('<div id="'+P+F+'" class="sapUiHidden"/>');r.renderControl(f);}}r.write('</div>');}};return X;},true);
