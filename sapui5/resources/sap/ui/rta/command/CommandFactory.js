/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject','sap/ui/rta/command/Hide','sap/ui/rta/command/Unhide','sap/ui/rta/command/Stash','sap/ui/rta/command/Unstash','sap/ui/rta/command/Move','sap/ui/rta/command/AddSmart','sap/ui/rta/command/Rename','sap/ui/rta/command/Group','sap/ui/rta/command/Ungroup','sap/ui/rta/command/Property','sap/ui/rta/command/BindProperty','sap/ui/rta/command/CompositeCommand','sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory','sap/ui/fl/registry/ChangeRegistry'],function(M,H,U,S,a,b,A,R,G,c,P,B,C,d,e){"use strict";var f=function(E,o){var h=d.getControlAnalyzerFor(E);var s=E.getMetadata().getName();var i=h.getFlexChangeType(o.getName(),E);if(i){var r=e.getInstance().getRegistryItems({controlType:s,changeTypeName:i});if(r&&r[s]&&r[s][i]){var j=r[s][i];var k=j.getChangeTypeMetadata().getChangeHandler();o.setChangeHandler(k);o.setChangeType(i);}else{jQuery.sap.log.warning("No '"+i+"' change handler for "+s+" registered");}}else{jQuery.sap.log.warning("No "+o.getName()+" change type registered for "+s);}return o;};var m={"Hide":{clazz:H},"Unhide":{clazz:U},"Stash":{clazz:S},"Unstash":{clazz:a},"Ungroup":{clazz:c},"Group":{clazz:G},"Move":{clazz:b,configure:f},"Add":{clazz:A,configure:f},"Composite":{clazz:C},"Rename":{clazz:R,configure:f},"Property":{clazz:P},"BindProperty":{clazz:B}};var g=M.extend("sap.ui.rta.command.CommandFactory",{metadata:{library:"sap.ui.rta",properties:{},associations:{},events:{}}});g.getCommandFor=function(E,s,h){var i=m[s];var j=i.clazz;h=jQuery.extend(h,{element:E,name:s});var o=new j(h);if(i.configure){i.configure(E,o);}return o;};return g;},true);