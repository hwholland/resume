/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");jQuery.sap.require("sap.m.MessageBox");sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.mpt.view.S1",{onInit:function(){var t=this;var v=this.getView();this.dateFormatter=sap.ui.core.format.DateFormat.getInstance({style:"long"});this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="fullscreen"){var c=new sap.ui.model.Context(v.getModel(),'/'+e.getParameter("arguments").contextPath);v.setBindingContext(c);}},this);var t=this;t.selectedTile=null;t.runtimeRef=sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");t.utilsRef=sap.suite.ui.smartbusiness.lib.Util.utils;sap.sb_mpt=t;t.byId("tileGrid").getBinding("items").attachDataReceived(function(){t.updateChipsCount();});},onAfterRendering:function(){},getHeaderFooterOptions:function(){var t=this;function a(){t.getView().getModel().refresh();t.selectedTile=null;sap.m.MessageToast.show(t.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));}function b(d){t.utilsRef.showErrorMessage(t.oApplicationFacade.getResourceBundle().getText("CANNOT_DELETE_TILE"),d.response.body);}this.oHeaderFooterOptions={bSuppressBookmarkButton:{},onBack:function(){window.history.back();},oEditBtn:{sI18nBtnTxt:"DELETE_TILE",onBtnPressed:function(e){var s=t.byId("tileGrid").getSelectedItems();if(s.length){t.handleDelete(s);}else{t.utilsRef.showErrorMessage(t.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));}},bEnabled:false,}};return this.oHeaderFooterOptions;},_notifyShell:function(c){var s=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService;if(s){oNotifyShell=s("LaunchPage");if(oNotifyShell&&oNotifyShell.onCatalogTileAdded){oNotifyShell.onCatalogTileAdded(c);}}},handleDelete:function(t){var a=this;var o=[];for(var i=0,l=t.length;i<l;i++){o.push({id:t[i].getBindingContext().getObject().id});}function b(r){var d=null;try{d=JSON.parse(r).chipId;}catch(e){jQuery.sap.log.error("Failed to parse the response");}if(d){a._notifyShell(d);}a.getView().getModel().refresh();sap.m.MessageToast.show(a.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));}function c(d){a.utilsRef.showErrorMessage(a.oApplicationFacade.getResourceBundle().getText("CANNOT_DELETE_TILE"),d.response.body);}sap.m.MessageBox.show(a.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),"sap-icon://hint",a.oApplicationFacade.getResourceBundle().getText("DELETE"),[sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],function(e){if(e=="OK"){a.runtimeRef.handlePersonalizedTileDelete(o,b,c);}if(e=="CANCEL"){}});},updateChipsCount:function(){var c=this.byId("tileGrid").getBinding("items").getLength();this.byId("chipsTableLabel").setText(this.oApplicationFacade.getResourceBundle().getText("PERS_TILE")+" ("+(c||0)+")");},_evalValueMapping:function(){return{"TA":"TARGET","CL":"CRITICAL_LOW","WL":"WARNING_LOW","CH":"CRITICAL_HIGH","WH":"WARNING_HIGH"}},prepareFilterArray:function(f){var g={};var a=[];var k="";for(var i=0,l=f.length;i<l;i++){if(f[i].OPERATOR!='BT'){k=f[i].NAME+"_"+f[i].OPERATOR;if(g[k]){g[k].VALUE_1.push(f[i].VALUE_1);}else{g[k]={};g[k].NAME=f[i].NAME;g[k].OPERATOR=f[i].OPERATOR;g[k].VALUE_1=[f[i].VALUE_1];g[k].VALUE_2="";}}else{k=f[i].NAME+"_"+f[i].OPERATOR+"_"+f[i].VALUE_1+"_"+f[i].VALUE_2;g[k]={};g[k].NAME=f[i].NAME;g[k].OPERATOR=f[i].OPERATOR;g[k].VALUE_1=[f[i].VALUE_1];g[k].VALUE_2=[f[i].VALUE_2];}}for(var b in g){if(g.hasOwnProperty(b)){a.push(g[b]);}}return a;},getTile:function(a,c){var t=this;var b=[];var r=t.oApplicationFacade.getResourceBundle();var d=c.getObject();var f={},g={},h=[],j={},k=[],m=[];try{f=JSON.parse(JSON.parse(d.configuration).tileConfiguration);g=JSON.parse(f.TILE_PROPERTIES);h=JSON.parse(f.EVALUATION_VALUES);j=JSON.parse(f.EVALUATION);k=JSON.parse(f.ADDITIONAL_FILTERS);}catch(e){f=f||{};g=g||{};h=h||[];j=j||{};k=k||[];jQuery.sap.log.error("parsing of Chip Failed");}var n=d.tileType;var o={"NT":function(){return new sap.suite.ui.commons.NumericContent({value:"9999",size:sap.suite.ui.commons.InfoTileSize.Auto,scale:"K",valueColor:"Error"});},"CT":function(){return new sap.suite.ui.commons.ComparisonChart({scale:"M",size:sap.suite.ui.commons.InfoTileSize.Auto,data:[new sap.suite.ui.commons.ComparisonData({title:r.getText("USA"),value:1550}),new sap.suite.ui.commons.ComparisonData({title:r.getText("INDIA"),value:219.2}),new sap.suite.ui.commons.ComparisonData({title:r.getText("GERMANY"),value:66.46})]});},"TT":function(){return new sap.suite.ui.commons.MicroAreaChart({size:sap.suite.ui.commons.InfoTileSize.Auto,width:"164px",height:"74px",minXValue:0,maxXValue:100,minYValue:0,maxYValue:100,firstXLabel:new sap.suite.ui.commons.MicroAreaChartLabel({label:r.getText("JAN_01"),color:"Neutral"}),lastXLabel:new sap.suite.ui.commons.MicroAreaChartLabel({label:r.getText("JAN_31"),color:"Neutral"}),firstYLabel:new sap.suite.ui.commons.MicroAreaChartLabel({label:"3 M",color:"Error"}),lastYLabel:new sap.suite.ui.commons.MicroAreaChartLabel({label:"23 M",color:"Good"}),target:new sap.suite.ui.commons.MicroAreaChartItem({points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:30}),new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:40}),new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:90})]}),innerMinThreshold:new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),innerMaxThreshold:new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),minThreshold:new sap.suite.ui.commons.MicroAreaChartItem({color:"Error",points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]}),maxThreshold:new sap.suite.ui.commons.MicroAreaChartItem({color:"Error",points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:20}),new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:30}),new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:70})]}),chart:new sap.suite.ui.commons.MicroAreaChartItem({points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]}),});},"AT":function(){return new sap.suite.ui.commons.BulletChart({scale:"M",size:sap.suite.ui.commons.InfoTileSize.Auto,minValue:0,maxvalue:312,targetValue:150,actual:new sap.suite.ui.commons.BulletChartData({value:312,color:"Error"}),thresholds:[new sap.suite.ui.commons.BulletChartData({value:312,color:"Error"}),new sap.suite.ui.commons.BulletChartData({value:200,color:"Critical"})]});},"CM":function(){return new sap.suite.ui.commons.ComparisonChart({scale:"M",size:sap.suite.ui.commons.InfoTileSize.Auto,data:[new sap.suite.ui.commons.ComparisonData({title:r.getText("MEASURE_1"),value:34,color:"Good"}),new sap.suite.ui.commons.ComparisonData({title:r.getText("MEASURE_2"),value:125,color:"Error"}),new sap.suite.ui.commons.ComparisonData({title:r.getText("MEASURE_3"),value:97,color:"Critical"})]});},"HT":function(){return new sap.suite.ui.commons.HarveyBallMicroChart({total:100,size:sap.suite.ui.commons.InfoTileSize.Auto,scale:"M",items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({fraction:30,color:"Good"})]});}};var v="COLUMN_NAME";if(j.VALUES_SOURCE=="FIXED"){v="FIXED";}var p=new sap.m.VBox();for(var i=0,l=h.length;i<l;i++){if(h[i].TYPE&&t._evalValueMapping()[h[i].TYPE]){p.addItem(new sap.m.Text({text:r.getText(t._evalValueMapping()[h[i].TYPE])+" - "+h[i][v]}).addStyleClass("evalValItems"));}}if(k&&k.length){m=t.prepareFilterArray(k)||[];}var q=new sap.m.VBox();for(var i=0,l=m.length;i<l;i++){if(jQuery.sap.getUriParameters().get("op")){q.addItem(new sap.m.Text({text:m[i].NAME+" "+m[i].OPERATOR+" "+m[i].VALUE_1.join(",")}).addStyleClass("evalValItems"));}else{q.addItem(new sap.m.Text({text:m[i].NAME+" - "+m[i].VALUE_1.join(",")}).addStyleClass("evalValItems"));}}var s=new sap.suite.ui.commons.GenericTile({size:sap.suite.ui.commons.InfoTileSize.Auto,header:c.getProperty("title"),subheader:c.getProperty("description"),customData:[new sap.ui.core.CustomData({key:"tileType",value:c.getProperty("tileType")})],press:function(y){}}).addStyleClass("sbTile");if(n&&(n.split("-").length==2)){s.setFrameType("TwoByOne");}if(n=="NT"){b.push(o["NT"]());}else if(n=="CT"){b.push(o["CT"]());}else if(n=="AT"){b.push(o["AT"]());}else if(n=="TT"){b.push(o["TT"]());}else if(n=="HT"){b.push(o["HT"]());}else if(n=="CM"){b.push(o["CM"]());}else if(n=="DT-AT"){b.push(o["NT"]());b.push(o["AT"]());}else if(n=="DT-CT"){b.push(o["NT"]());b.push(o["CT"]());}else if(n=="DT-CM"){b.push(o["NT"]());b.push(o["CM"]());}else if(n=="DT-TT"){b.push(o["NT"]());b.push(o["TT"]());}else if(n=="DT-HT"){b.push(o["NT"]());b.push(o["HT"]());}s.removeAllTileContent();for(var i=0,l=b.length;i<l;i++){s.addTileContent(new sap.suite.ui.commons.TileContent({content:b[i],size:sap.suite.ui.commons.InfoTileSize.Auto}));}var u=new sap.m.Button({icon:"sap-icon://sys-cancel",type:sap.m.ButtonType.Transparent,press:function(y){t.handleDelete(this);}});var w=[s,p,q,new sap.m.Text({text:this.dateFormatter.format(new Date(d.createdOn)),visible:true}),];var x=new sap.m.ColumnListItem({type:"Inactive",cells:w});return x;},searchTile:function(e){var s="'"+e.getParameter("query").toLowerCase()+"'";var f=new sap.ui.model.Filter("tolower(title)",sap.ui.model.FilterOperator.Contains,s);var F=new sap.ui.model.Filter("tolower(description)",sap.ui.model.FilterOperator.Contains,s);var b=this.byId("tileGrid").getBinding("items");b.filter(new sap.ui.model.Filter([f,F],false));},setSorting:function(k,g){g=g||false;var l=this.getView().byId("tileGrid");if(k=="tileType"){l.getBinding("items").sort([new sap.ui.model.Sorter("tileType",g,null)]);}else if(k=="title"){l.getBinding("items").sort([new sap.ui.model.Sorter("title",g,null)]);}else if(k=="subtitle"){l.getBinding("items").sort([new sap.ui.model.Sorter("description",g,null)]);}else if(k=="creation"){l.getBinding("items").sort([new sap.ui.model.Sorter("createdOn",g,null)]);}else if(k=="none"){l.getBinding("items").sort([]);}},setFiltering:function(i){var f=[];var l=this.getView().byId("tileGrid");var a={"NT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'NT')),"CT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'CT')),"AT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'AT')),"TT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'TT')),"CM":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'CM')),"HT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'HT')),"DT-CM":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-CM')),"DT-CT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-CT')),"DT-AT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-AT')),"DT-TT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-TT'))};f=sap.suite.ui.smartbusiness.lib.Util.utils.getFilterArray(i,a);if(f.length){l.getBinding("items").filter(new sap.ui.model.Filter(f,true));}else{l.getBinding("items").filter(f);}},setFilteringN:function(i){var f=[];var l=this.getView().byId("tileGrid");var a={"NT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'NT')),"CT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'CT')),"AT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'AT')),"TT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'TT')),"CM":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'CM')),"HT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'HT')),"DT-CM":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-CM')),"DT-CT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-CT')),"DT-AT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-AT')),"DT-TT":(new sap.ui.model.Filter("tileType",sap.ui.model.FilterOperator.EQ,'DT-TT'))};f=this.getFilterArrayN(i,a);if(f.length){l.getBinding("items").filter(new sap.ui.model.Filter(f,true));}else{l.getBinding("items").filter(f);}},getFilterArrayN:function(a,f){var b=[];var c={},k,p;for(var i=0,l=a.length;i<l;i++){k=a[i].getDependents()[0].getText();p="tileType";c[p]=c[p]||[];c[p].push(f[k]);}for(var d in c){b.push(new sap.ui.model.Filter(c[d],false));}return b;},handleSortPress:function(){var t=this;this.sortOptionsDialog=this.sortOptionsDialog||new sap.m.ViewSettingsDialog({id:this.createId("sortOptionsDialog"),sortItems:[new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),key:"tileType"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("TITLE"),key:"title"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("SUBTITLE"),key:"subtitle"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("CREATION_TIME"),key:"creation"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("NONE"),key:"none"})],confirm:function(e){if(e.getParameter("sortItem")){t.setSorting(e.getParameter("sortItem").getKey(),e.getParameter("sortDescending"));}}});this.sortOptionsDialog.open();},handleFilterPressN:function(){var t=this;this.filterOptionsDialog=this.filterOptionsDialog||new sap.m.SelectDialog({id:this.createId("filterOptionsDialog"),title:"Filter By",multiSelect:true,rememberSelections:true,items:[new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("NUMERIC_TILE"),dependents:[new sap.m.Label({text:"NT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("COMPARISON_TILE"),dependents:[new sap.m.Label({text:"CT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("TREND_TILE"),dependents:[new sap.m.Label({text:"TT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("ACTUAL_VS_TARGET_TILE"),dependents:[new sap.m.Label({text:"AT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("COMPARISON_MM_TILE"),dependents:[new sap.m.Label({text:"CM"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("HARVEY_BALL_TILE"),dependents:[new sap.m.Label({text:"HT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_TILE"),dependents:[new sap.m.Label({text:"DT-CT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_MM_TILE"),dependents:[new sap.m.Label({text:"DT-CM"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("DUAL_DEVIATION_TILE"),dependents:[new sap.m.Label({text:"DT-AT"})]}),new sap.m.StandardListItem({title:t.oApplicationFacade.getResourceBundle().getText("DUAL_TREND_TILE"),dependents:[new sap.m.Label({text:"DT-TT"})]})],confirm:function(e){var a="";var s=e.getParameter("selectedItems");t.setFilteringN(s);if(s&&s.length){var f={};for(var i=0,l=s.length;i<l;i++){var k=s[i].getDependents()[0].getText();f[k]=f[k]||"";f[k]+=(f[k])?(","):"";f[k]+=s[i].getTitle();}for(var b in f){if(f.hasOwnProperty(b)){a+=(a)?", ":"";a+=f[b];}}a=t.oApplicationFacade.getResourceBundle().getText("FILTERED_BY")+" : "+a;t.byId("filterToolbar").setVisible(true);t.byId("mptInfo").setText(a);}else{t.byId("mptInfo").setText("");t.byId("filterToolbar").setVisible(false);}}});this.filterOptionsDialog.open();},handleFilterPress:function(){var t=this;this.filterOptionsDialog=this.filterOptionsDialog||new sap.m.ViewSettingsDialog({id:this.createId("filterOptionsDialog"),filterItems:[new sap.m.ViewSettingsFilterItem({text:t.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),key:"tileType",items:[new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("NUMERIC_TILE"),key:"NT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("COMPARISON_TILE"),key:"CT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("TREND_TILE"),key:"TT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("ACTUAL_VS_TARGET_TILE"),key:"AT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("COMPARISON_MM_TILE"),key:"CM"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("HARVEY_BALL_TILE"),key:"HT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_TILE"),key:"DT-CT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_MM_TILE"),key:"DT-CM"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("DUAL_DEVIATION_TILE"),key:"DT-AT"}),new sap.m.ViewSettingsItem({text:t.oApplicationFacade.getResourceBundle().getText("DUAL_TREND_TILE"),key:"DT-TT"})]})],confirm:function(e){var a="";var s=e.getParameter("filterItems");t.setFiltering(e.getParameter("filterItems"));if(s&&s.length){var f={};for(var i=0,l=s.length;i<l;i++){f[s[i].getParent().getKey()]=f[s[i].getParent().getKey()]||"";f[s[i].getParent().getKey()]+=(f[s[i].getParent().getKey()])?(","):"";f[s[i].getParent().getKey()]+=s[i].getText();}for(var b in f){if(f.hasOwnProperty(b)){a+=(a)?" ; ":"";a+=f[b];}}t.byId("filterToolbar").setVisible(true);t.byId("mptInfo").setText(a);}else{t.byId("mptInfo").setText("");t.byId("filterToolbar").setVisible(false);}}});this.filterOptionsDialog.open();}});