/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';jQuery.sap.declare('sap.apf.utils.navContainer');sap.apf.utils.navContainer=sap.apf.utils.navContainer||{};sap.apf.utils.navContainer.pushContent=function(c,a,m,b){if(u()){var d=jQuery.sap.uid();sap.ushell.Container.getService("Personalization").getContainer(a,{validity:0}).done(function(e){e.setItemValue(d,c);e.save();b(d,null);}).fail(function(){p("5039",m,b);});}else{p("5038",m,b);}};sap.apf.utils.navContainer.fetchContent=function(c,a,m,b){if(u()){sap.ushell.Container.getService("Personalization").getContainer(a).done(function(d){var e=d.getItemValue(c);if(e){b(e,null);}else{p("5040",m,b);}}).fail(function(){p("5040",m,b);});}else{p("5038",m,b);}};function u(){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){return true;}else{return false;}}function p(m,a,c){var b=a.createMessageObject({code:m});a.putMessage(b);c(null,b);}}());
