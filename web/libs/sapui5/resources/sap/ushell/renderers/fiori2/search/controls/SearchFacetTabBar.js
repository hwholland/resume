(function(){"use strict";jQuery.sap.require('sap.m.GroupHeaderListItemRenderer');jQuery.sap.require('sap.m.ButtonRenderer');sap.m.Button.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDown',{renderer:'sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDownRenderer'});sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDownRenderer=jQuery.extend(true,{},sap.m.ButtonRenderer);sap.m.GroupHeaderListItemRenderer.extend('sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer');sap.m.GroupHeaderListItem.extend('sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItem',{renderer:'sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer',metadata:{properties:{button:{type:"control",defaultValue:null},upperCase:{type:"boolean",group:"Appearance",defaultValue:false}}}});sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer.renderCounter=function(r,l){var b=l.getButton();if(b){this.renderCounterContent(r,l,b);}};sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer.renderCounterContent=function(r,l,b){r.write('<div>');r.renderControl(b);r.write('</div>');};sap.m.SegmentedButtonItem.extend('my.SegmentedButtonItem',{aggregations:{"content1":{type:"sap.ui.core.Control",multiple:false}}});sap.ui.core.Control.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetTabBar',{metadata:{properties:{"eshRole":"string","headerText":"string","selectedButtonParameters":{type:"object",defaultValue:null}},aggregations:{items:{type:"sap.m.IconTabFilter",multiple:true}}},getSearchFacetTabBarAndDimensionById:function(b){var r={};r.index=0;var a=document.getElementById(b);var v=a.dataset.facetView;var c=a.dataset.facetViewIndex;var d=$("#"+b).parent()[0];var e=d.dataset.facetDimension;var f=$(".sapUshellSearchFacetTabBar");for(var i=0;i<f.length;i++){var g=$(".sapUshellSearchFacetTabBar .sapUshellSearchFacetTabBarHeader")[i];var h=g.dataset.facetDimension;if(h===e){r.index=i;r.control=sap.ui.getCore().byId(f[i].id);r.view=v;r.buttonIndex=c;r.dimension=e;break;}}return r;},storeClickedTabInformation:function(e){var s,a,b,d,c;var p=$.sap.storage.get("selectedButtonParameters");var P=JSON.parse(p);var t=e.getSource().sId;var f=this.getSearchFacetTabBarAndDimensionById(t);s=f.dimension;a=f.control;b=f.view;c=f.buttonIndex;d=a.getBindingContext().getObject().dimension;var g=e.getParameters().id;var h=[];var o={};o.tabId=t;o.searchFacetTabBarIndex=f.searchFacetTabBarIndex;o.buttonId=g;o.buttonIndex=c;o.dimension=d;o.view=b;h.push(o);if(P){for(var i=0;i<P.length;i++){var j=P[i];if(j.dimension!==s){h.push(j);}}}$.sap.storage.put("selectedButtonParameters",JSON.stringify(h));},renderer:function(r,c){function a(n,T){return function(p){var d;var q=$(this.getDomRef()).closest(".sapUshellSearchFacetTabBar")[0];var u=sap.ui.getCore().byId($(q).attr("id"));var F=new sap.ushell.renderers.fiori2.search.SearchFacetDialogModel();F.setData(c.getModel().getData());F.prepareFacetList();if(u&&u.getBindingContext()&&u.getBindingContext().getObject()&&u.getBindingContext().getObject().dimension){d=u.getBindingContext().getObject().dimension;}var v=new sap.ushell.renderers.fiori2.search.controls.SearchFacetDialog({selectedAttribute:d,selectedTabBarIndex:n,tabBarItems:T});v.setModel(F);v.setModel(c.getModel(),'searchModel');v.open();var P=c.getParent().getParent().getParent().getParent();P.oFacetDialog=v;};}r.write("<div ");r.writeControlData(c);r.addClass("sapUshellSearchFacetTabBar");r.writeClasses();r.write('>');var d=c.getBindingContext().getObject().dimension;var t=c.getBindingContext().getObject().title;var b;var s;b=$.sap.storage.get("selectedButtonParameters");if(b){b=JSON.parse(b);for(var k=0;k<b.length;k++){if(b[k].dimension===d){s=b[k];break;}}}var e=[];var f=[];var C=null;var B=null;var g=0;if(s&&s.buttonIndex){g=s.buttonIndex;g=parseInt(g,10);}var h=c.getItems();var D=new sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDown({icon:h[g].getIcon(),type:'Transparent'});for(var i=0;i<h.length;i++){C=h[i].getContent()[0];B=new sap.m.Button({text:h[i].getText(),icon:h[i].getIcon(),press:function(E){c.storeClickedTabInformation(E);c.setSelectedButtonParameters(E.getParameters());}});B.data("facet-view",h[i].getText(),true);B.data("facet-view-index",""+i,true);B.data("dimension",d,true);e.push(B);f.push(C);}var A=new sap.m.ActionSheet({showCancelButton:true,buttons:e,placement:sap.m.PlacementType.Bottom,cancelButtonPress:function(){jQuery.sap.log.info("sap.m.ActionSheet: cancelButton is pressed");}});A.data("facet-dimension",d,true);if($(".sapUiSizeCompact")[0]){A.addStyleClass("sapUiSizeCompact");}D.addStyleClass("sapUshellSearchFacetTabBarButton");var j=h[g].getText();var l=sap.ushell.resources.i18n.getText('displayAs',[j]);D.setTooltip(l);D.attachPress(function(E){A.openBy(this);});if(c.getHeaderText()){var H=new sap.m.List({headerText:c.getHeaderText()});H.setShowNoData(false);H.setShowSeparators(sap.m.ListSeparators.None);r.renderControl(H);}var L=new sap.m.CustomListItem({content:f[g]});L.setModel(c.getModel(),'facets');var G=new sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItem({title:t,button:D});G.data("facet-dimension",d,true);G.addStyleClass("sapUshellSearchFacetTabBarHeader");var S=new sap.m.Link({text:sap.ushell.resources.i18n.getText("showMore"),press:a(g,h)});S.setModel(c.getModel("i18n"));var o=new sap.m.CustomListItem({content:S,visible:{parts:[{path:'/uiFilter/dataSource'}],formatter:function(n){return n.getType().toLowerCase()!=="category";}}});o.addStyleClass('sapUshellSearchFacetShowMoreLink');var m=new sap.m.List({showSeparators:sap.m.ListSeparators.None,items:[G,L,o]});m.data("sap-ui-fastnavgroup","false",true);m.setModel(c.getModel());r.renderControl(m);c.getItems()[g].addContent(f[g]);r.write("</div>");},onAfterRendering:function(){}});})();