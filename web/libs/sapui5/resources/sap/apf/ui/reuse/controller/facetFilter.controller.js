/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');(function(){'use strict';var c={};var f={};var s;var F=new sap.apf.ui.utils.FacetFilterListConverter();function _(o,G){var h=o.getModel();var i=new sap.apf.ui.utils.FacetFilterValueFormatter();G.oFormatterArgs.aFilterValues=G.aFilterValues;var j=i.getFormattedFFData(G.oFormatterArgs);var m=F.getFFListDataFromFilterValues(j,G.oFormatterArgs.sSelectProperty);G.oFilterRestrictionPropagationPromiseForValues.done(function(n,N){_(o,{aFilterValues:n,oFilterRestrictionPropagationPromiseForValues:N,oFormatterArgs:G.oFormatterArgs});});h.setSizeLimit(m.length);h.setData(m);h.updateBindings();}function a(o){var C=this;C.getView().byId("idAPFFacetFilter").removeList(o);}function b(h,o){var i;h.forEach(function(j){j.selected=false;});o.forEach(function(j){for(i=0;i<h.length;i++){if(j==h[i].key){h[i].selected=true;break;}}});return h;}function d(o,G){var h=o.getId();var i=o.getModel();var j=i.getData();G.oFilterRestrictionPropagationPromiseForSelectedValues.done(function(n,N){o.removeSelectedKeys();d(o,{aSelectedFilterValues:n,oFilterRestrictionPropagationPromiseForSelectedValues:N});});c[h]=G.aSelectedFilterValues;j=b(j,G.aSelectedFilterValues);i.setData(j);i.updateBindings();}function e(C){if(C.getView().getViewData().aConfiguredFilters.length>C.getView().byId("idAPFFacetFilter").getLists().length){g(C);}C.getView().byId("idAPFFacetFilter").getLists().forEach(function(o){(f[o.getId()].getFacetFilterListData().then(_.bind(null,o),a.bind(C,o))).then(function(){f[o.getId()].getSelectedFFValues().then(d.bind(null,o));});});}function g(C){C.getView().byId("idAPFFacetFilter").removeAllLists();var v=C.getView().getViewData();var h=v.aConfiguredFilters;var o;h.forEach(function(i){o=new sap.m.FacetFilterList({title:v.oCoreApi.getTextNotHtmlEncoded(i.getLabel()),multiSelect:i.isMultiSelection(),key:i.getPropertyName(),growing:false,listClose:C.onListClose.bind(C)});o.bindItems("/",new sap.m.FacetFilterItem({key:'{key}',text:'{text}',selected:'{selected}'}));var m=new sap.ui.model.json.JSONModel([]);o.setModel(m);C.getView().byId("idAPFFacetFilter").addList(o);});}sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter",{onInit:function(){var C=this,h;var v=C.getView().getViewData();if(sap.ui.Device.system.desktop){C.getView().addStyleClass("sapUiSizeCompact");}s=false;g(C);v.aConfiguredFilters.forEach(function(o,n){h=C.getView().byId("idAPFFacetFilter").getLists()[n].getId();f[h]=new sap.apf.ui.utils.FacetFilterListHandler(v.oCoreApi,v.oUiApi,o,F);});e(C);},onListClose:function(E){var C=this;var o=E.getSource();var S=[],h,i,j,k,l,m;h=o.getSelectedItems();S=h.map(function(I){return I.getKey();});i=o.getId();j=c[i];if(j!==undefined){k=JSON.stringify(S.sort());l=JSON.stringify(j.sort());m=(k===l);if(!m){c[i]=S;s=true;f[i].setSelectedFFValues(S);C.getView().getViewData().oUiApi.selectionChanged(true);}}},onResetPress:function(){var C=this;if(s||C.getView().getViewData().oCoreApi.isDirty()){C.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();C.getView().getViewData().oUiApi.selectionChanged(true);s=false;}}});}());