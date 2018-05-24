sap.ui.define(["sap/m/HeaderContainer","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/m/Label","sap/ui/comp/odata/ODataModelUtil","sap/ui/comp/smartfilterbar/FilterProvider","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider","sap/ui/comp/smartvariants/PersonalizableInfo","sap/ui/comp/smartvariants/SmartVariantManagement","sap/ui/model/Filter","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/comp/odata/MetadataAnalyser","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms","sap/m/VBox","sap/m/Button","sap/suite/ui/generic/template/AnalyticalListPage/controller/DropDownController"],function(H,V,L,O,F,a,P,S,b,c,T,M,d,e,f,B,D){"use strict";var o=sap.ui.model.SimpleType.extend("sap.ui.model.DimensionFilterType",{formatValue:function(v){return v;},parseValue:function(v){return v;},validateValue:function(v){}});var g=H.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",{metadata:{designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},config:{type:"object",group:"Misc",defaultValue:null},persistencyKey:{type:"string",group:"Misc",defaultValue:null},displayCurrency:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null}},associations:{smartVariant:{type:"sap.ui.core.Control",multiple:false}},events:{filterChange:{}}},renderer:{}});g.prototype.init=function(){if(H.prototype.init){H.prototype.init.apply(this,arguments);}var i=jQuery(document.body).hasClass("sapUiSizeCozy");this._cellItemHeightNorth="2.0rem";this._cellItemHeightSouth=i?"9.9rem":"7.9rem";this._cellHeight=i?"12rem":"10.9rem";this._cellWidth="20rem";this.labelHeight=2.0;this.compHeight=i?9.9:7.9;this.cellHeightPadding=1;this.cellHeight=(this.labelHeight+this.compHeight+this.cellHeightPadding)+"rem";this.cellWidth=320;this._dialogFilters={};this._compactFilters={};this._oVariantConfig={};this._smartFilterContext;this._oMetadataAnalyser;this.setModel(new sap.ui.model.json.JSONModel(),'_visualFilterConfigModel');if(i){if(sap.ui.Device.system.phone){this.setOrientation("Vertical");this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozyPhone");}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozy");}}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBar");}};g.prototype.propagateProperties=function(){H.prototype.propagateProperties.apply(this,arguments);this._initMetadata();};g.prototype._initMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInit);}};g.prototype._onMetadataInit=function(){if(this.bIsInitialised){return;}this._annoProvider=this._createVisualFilterProvider();if(!this._annoProvider){return;}this._oMetadataAnalyser=this._annoProvider.getMetadataAnalyser();this.bIsInitialised=true;this._updateFilterBar();};g.prototype._createVisualFilterProvider=function(){var m=this.getModel();var h=this.getEntitySet();if(!m||!h){return null;}return new a(this);};g.prototype._getBasicGroupTitle=function(){return this.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");};g.prototype._getFieldGroupForProperty=function(E,C){return this._annoProvider?this._annoProvider._getFieldGroupForProperty(E,C):undefined;};g.prototype._getGroupList=function(){return this._annoProvider?this._annoProvider.getGroupList():[];};g.prototype._getGroupMap=function(){return this._annoProvider?this._annoProvider.getGroupMap():{};};g.prototype._getMeasureMap=function(){return this._annoProvider?this._annoProvider.getMeasureMap():{};};g.prototype._getDimensionMap=function(){return this._annoProvider?this._annoProvider.getDimensionMap():{};};g.prototype.setSmartFilterContext=function(C){this._smartFilterContext=C;};g.prototype._updateFilterBar=function(){var h=this._getAnnotationSettings();if(h&&h.filterList){var i=this._convertSettingsToConfig(h);}else{i={filterCompList:[]};this.getModel('_visualFilterConfigModel').setData(i);return;}var v=this._getVariantConfig();if(v&&v.config){i.filterCompList.forEach(function(j){if(v.config[j.component.properties.parentProperty]){jQuery.extend(true,j,v.config[j.component.properties.parentProperty]);}});this._oVariantConfig=i;}this.unbindAggregation('content',true);this.getModel('_visualFilterConfigModel').setData(i);this.bindAggregation('content',{path:"_visualFilterConfigModel>/filterCompList",factory:function(I,C){var j=C.getProperty('component'),p=j?j.properties:undefined,s=this._resolveChartType(j?j.type:undefined);return this._createHeaderItems(C.sPath,s,p);}.bind(this),filters:new sap.ui.model.Filter("shownInFilterBar",sap.ui.model.FilterOperator.EQ,true)});return;};g.prototype._createHeaderItems=function(p,t,h){var i=this._createFilterItemOfType(t,h),I=i.getInParameters(),j=[],m=this;if(I&&I.length>0){I.forEach(function(s){j.push({path:'_filter>/'+s.localDataProperty});});}i.addCustomData(new sap.ui.core.CustomData({key:'sPath',value:p}));if(m.getEntitySet()===i.getEntitySet()){var k=m._smartFilterContext.determineMandatoryFilterItems();if(k&&k.length>0){k.forEach(function(s){if(!s.data("isCustomField")){j.push({path:'_filter>/'+s.getName()});}});}}i.bindProperty('dimensionFilter',{path:'_filter>/'+i.getParentProperty(),type:new o()});i.bindProperty('measureField',{path:'_visualFilterConfigModel>'+p+'/component/properties/measureField'});i.bindProperty('sortOrder',{path:'_visualFilterConfigModel>'+p+'/component/properties/sortOrder'});i.bindProperty('unitField',{path:'_visualFilterConfigModel>'+p+'/component/properties/measureField',formatter:function(){var s=m._getMeasureMap();var u=s[this.getEntitySet()][this.getMeasureField()];return u?u.fieldInfo.unit:"";}});if(j&&j.length>0){i.bindProperty('dimensionFilterExternal',{parts:j,formatter:function(){var I=this.getInParameters(),s=this.getParentProperty();var u,v;if(!(m.getEntitySet()===this.getEntitySet()&&m._smartFilterContext.getAnalyticBindingPath()!=="")&&(m._smartFilterContext.getAnalyticBindingPath()===""||((m._smartFilterContext.getAnalyticBindingPath().indexOf("P_DisplayCurrency"))!=-1))){var w=m.getProperty("displayCurrency");if(w){var x=this.getMeasureField();var y=m.getModel();var z=y.getMetaModel();var E=z.getODataEntityType(m._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet()));var A=z.getODataProperty(E,x);if(A){var G=A[e.ISOCurrency];if(G){var J=G.Path;for(var K=(I.length-1);K>-1;K--){var N=I[K].valueListProperty;var Q=I[K].localDataProperty;if(N===J){var R=m._smartFilterContext.getFilterData();if(!R[Q]){v=z.getODataProperty(E,J);if(v&&v["sap:filterable"]!=="false"){u=new sap.ui.model.Filter({aFilters:[new sap.ui.model.Filter({path:J,operator:"EQ",value1:w,value2:undefined})],and:false});}}break;}}}}}}return m._getFiltersForFilterItem(I,s,u,J);}});}if(i.attachFilterChange){i.attachFilterChange(this._onFilterChange,this);}if(i.attachTitleChange){i.attachTitleChange(this._onTitleChange,this);}var l=this._createTitleToolbar(h,i),n=new f({height:this._cellItemHeightNorth,items:[l]});var q=new f({width:"100%",height:this._cellItemHeightSouth,items:[new sap.m.Text({width:this.cellWidth+"px",textAlign:sap.ui.core.TextAlign.Center,text:{path:'_visualFilterConfigModel>'+p+'/overlayMessage',formatter:function(s){return this.getModel("i18n").getResourceBundle().getText(s);}}})],visible:{path:'_visualFilterConfigModel>'+p+'/showChartOverlay',formatter:function(v){return v;}}});q.addStyleClass("sapUiOverlay");q.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflow");q.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflowCozy");var r=new f({height:this._cellItemHeightSouth,items:[i],visible:{path:"_visualFilterConfigModel>"+p+"/showChartOverlay",formatter:function(v){return!v;}}});var C=new f({fieldGroupIds:["headerBar"],height:this._cellHeight,width:this.cellWidth+"px",items:[n,q,r]});return C;};g.prototype._getAnnotationSettings=function(){return this._annoProvider?this._annoProvider.getVisualFilterConfig():null;};g.prototype._convertSettingsToConfig=function(s,I){var h={filterCompList:[]};var k=this._getGroupList();var l={};for(var i=0;i<k.length;i++){var m=k[i];for(var j=0;j<m.fieldList.length;j++){var n=m.fieldList[j];l[n.name]={name:m.name,label:m.label};}}var p=this._getGroupMap();var q=p["_BASIC"];var r=[];if(q&&q.fieldList){for(var i=0;i<q.fieldList.length;i++){r.push(q.fieldList[i].name);}}var t=this._getMeasureMap(),u=s.filterList,v={};for(var i=0;i<u.length;i++){var w=u[i];var x=w.dimension.field;var y=t[w.collectionPath][w.measure.field];var z=false;if(y.fieldInfo[e.ISOCurrency]){z=true;}var C={shownInFilterBar:w.selected,component:{type:w.type,properties:{sortOrder:w.sortOrder,measureField:w.measure.field,parentProperty:w.parentProperty?w.parentProperty:undefined}}};if(!I){var A={shownInFilterDialog:w.selected||r.indexOf(x)!=-1,group:l[w.parentProperty],component:{properties:{scaleFactor:w.scaleFactor,numberOfFractionalDigits:w.numberOfFractionalDigits,filterRestriction:w.filterRestriction,width:this.cellWidth+"px",height:this.compHeight+"rem",entitySet:w.collectionPath?w.collectionPath:this.getEntitySet(),dimensionField:x,dimensionFieldDisplay:w.dimension.fieldDisplay,dimensionFilter:w.dimensionFilter,unitField:y?y.fieldInfo.unit:"",isCurrency:z,isDropDown:w.isDropDown,isMandatory:w.isMandatory,outParameter:w.outParameter?w.outParameter:undefined,inParameters:w.inParameters?w.inParameters:undefined,textArrangement:w.displayBehaviour,chartQualifier:w.chartQualifier?w.chartQualifier:undefined,dimensionFieldIsDateTime:w.dimensionFieldIsDateTime}}};jQuery.extend(true,C,A);h.filterCompList.push(C);}else{v[w.parentProperty]=C;}}return I?v:h;};g.prototype._setVariantModified=function(){if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(true);}};g.prototype._onFilterChange=function(h){this._setVariantModified();this.fireFilterChange();};g.prototype._getFiltersForFilterItem=function(i,p,h,j){var k={},m=[],l=new sap.ui.model.Filter({aFilters:[],and:true});if(i){var r=function(s){s.sPath=v;};for(var n=(i.length-1);n>-1;n--){var q=i[n].localDataProperty,v=i[n].valueListProperty;if(q!==p&&m.indexOf(q)===-1){k=this._smartFilterContext.getFilters([q]);if(k&&k.length>0){if(k[0].aFilters){k[0].aFilters.forEach(r.bind(this));}else{r(k[0]);}m.push(q);l.aFilters.push(k[0]);}}}if(h){l.aFilters.push(h);}}return l;};g.prototype._createTitleToolbar=function(p,h){var t=new L({text:{path:"i18n>VIS_FILTER_TITLE_MD",formatter:function(){return h.getTitle();}}});if(h.getProperty("isMandatory")){t.addStyleClass("sapMLabelRequired");}var i=this._smartFilterContext.getControlByKey(p.parentProperty);this._smartFilterContext.ensureLoadedValueHelp(p.parentProperty);if(i){var j=d.getPropertyNameDisplay(this.getModel(),h.getEntitySet(),h.getDimensionField()),r=this.getModel("i18n").getResourceBundle(),I=i.getShowValueHelp&&i.getShowValueHelp(),s=(p.isDropDown)?"sap-icon://slim-arrow-down":"",k=I?"sap-icon://value-help":s,l,m=new B({text:{path:"_filter>/"+h.getParentProperty(),formatter:function(C){var q=h.getFilterRestriction();l=0;if(C){if(q==='single'){l=1;}else{if(typeof C==="object"){if(C.value){l++;}if(C.items&&C.items.length){l+=C.items.length;}if(C.ranges&&C.ranges.length){l+=C.ranges.length;}}else{l++;}}}return l?"("+l+")":"";}},icon:(I||p.isDropDown)?k:"",visible:{path:"_filter>/"+h.getParentProperty(),formatter:function(C){if(I||p.isDropDown){return true;}else{if(!C){return false;}if(typeof C==="object"){return(C.value||(C.items&&C.items.length)||(C.ranges&&C.ranges.length))?true:false;}return true;}}},press:function(E){if(I){i.fireValueHelpRequest.call(i);}else if(p.isDropDown){D.createDropdown(E.getSource(),h,this.getModel(),j,p);}else{V.launchAllFiltersPopup(m,h,E.getSource().getModel('i18n'));}},layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}),tooltip:{path:"_filter>/"+h.getParentProperty(),formatter:function(){return d.getTooltipForValueHelp(I,j,r,l);}}});}var n=new c({design:sap.m.ToolbarDesign.Transparent,width:this.cellWidth+"px",content:[t,new T(),m]});n.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleToolbar");return n;};g.prototype.getTitleByFilterItemConfig=function(h,u,s){var p=h.component.properties;var i=p.entitySet;var m=this.getModel();if(!m){return"";}var j=d.getPropertyNameDisplay(m,i,p.measureField);var k=d.getPropertyNameDisplay(m,i,p.dimensionField);if(!u){u="";}if(!s){s="";}var t="";var r=this.getModel("i18n").getResourceBundle();if(s&&u){t=r.getText("VIS_FILTER_TITLE_MD_UNIT_CURR",[j,k,s,u]);}else if(u){t=r.getText("VIS_FILTER_TITLE_MD_UNIT",[j,k,u]);}else if(s){t=r.getText("VIS_FILTER_TITLE_MD_UNIT",[j,k,s]);}else{t=r.getText("VIS_FILTER_TITLE_MD",[j,k]);}return t;};g.prototype._onTitleChange=function(h){var C=h.getSource().getParent().getParent();var l=C.getItems()[0].getItems()[0].getContent()[0];if(h.getSource().getProperty("isMandatory")){l.addStyleClass("sapMLabelRequired");}l.setText(h.getSource().getTitle());l.setTooltip(h.getSource().getTitle());};g.prototype._getSupportedFilterItemList=function(){if(!this._supportedFilterItemList){this._supportedFilterItemList=[{type:"Bar",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroBar",iconLink:"sap-icon://horizontal-bar-chart",textKey:"VISUAL_FILTER_CHART_TYPE_BAR"},{type:"Donut",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroDonut",iconLink:"sap-icon://donut-chart",textKey:"VISUAL_FILTER_CHART_TYPE_Donut"},{type:"Line",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine",iconLink:"sap-icon://line-charts",textKey:"VISUAL_FILTER_CHART_TYPE_Line"}];}return this._supportedFilterItemList;};g.prototype._getSupportedFilterItemMap=function(){if(!this._supportedFilterItemMap){this._supportedFilterItemMap={};var h=this._getSupportedFilterItemList();for(var i=0;i<h.length;i++){var j=h[i];this._supportedFilterItemMap[j.type]=j;}}return this._supportedFilterItemMap;};g.prototype._resolveChartType=function(t){var h=this._getSupportedFilterItemMap();var i=h[t];if(!i){var j;for(j in h){i=h[j];break;}jQuery.sap.log.error("Could not resolve the filter component type: \""+t+"\", falling back to "+j);t=j;}return t;};g.prototype._createFilterItemOfType=function(t,p){var h=this._getSupportedFilterItemMap();var i=h[t];var j=i.className;jQuery.sap.require(j);var k=jQuery.sap.getObject(j);var l=new k(p);l.setSmartFilterId(this.getSmartFilterId());l.setModel(this.getModel('_filter'),'_filter');l.setModel(this.getModel('i18n'),'i18n');l.setModel(this.getModel("_templPriv"),"_templPriv");l.setModel(this.getModel('_visualFilterConfigModel'),"_visualFilterConfigModel");l.setModel(this.getModel());return l;};g.prototype.getConfig=function(I){var h=this.getModel('_visualFilterConfigModel').getData(),v={};if(!h){return{filterCompList:[]};}var j=0;var k=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<h.filterCompList.length;i++){var l=h.filterCompList[i];if(I){v[l.component.properties.parentProperty]={shownInFilterBar:l.shownInFilterBar,component:{type:l.component.type,properties:{measureField:l.component.properties.measureField,sortOrder:l.component.properties.sortOrder,parentProperty:l.component.properties.parentProperty}}};}else{if(!l.shownInFilterBar){continue;}var m=k[j];if(!m){jQuery.sap.log.error("The configured selected filter bar items do not correspond to the actual filter bar items.  Could be an error during initialization, e.g. a chart class not found");return{filterCompList:[]};}j++;if(m._chart){var n=m;l.component.properties=n.getP13NConfig();}}}return I?v:h;};g.prototype.setSmartVariant=function(s){this.setAssociation("smartVariant",s);if(s){var p=new P({type:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",keyName:"persistencyKey"});p.setControl(this);}this._oVariantManagement=this._getVariantManagementControl(s);if(this._oVariantManagement){this._oVariantManagement.addPersonalizableControl(p);this._oVariantManagement.initialise(this._variantInitialised,this);this._oVariantManagement.attachSave(this._onVariantSave,this);}else if(s){if(typeof s==="string"){jQuery.sap.log.error("Variant with id="+s+" cannot be found");}else if(s instanceof sap.ui.core.Control){jQuery.sap.log.error("Variant with id="+s.getId()+" cannot be found");}}else{jQuery.sap.log.error("Missing SmartVariant");}};g.prototype._getVariantManagementControl=function(s){var h=null;if(s){h=typeof s=="string"?sap.ui.getCore().byId(s):s;if(h&&!(h instanceof S)){jQuery.sap.log.error("Control with the id="+s.getId?s.getId():s+" not of expected type");return null;}}return h;};g.prototype._variantInitialised=function(){if(!this._oCurrentVariant){this._oCurrentVariant="STANDARD";}};g.prototype._onVariantSave=function(){if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant={config:this.getConfig(true)};}};g.prototype.applyVariant=function(v,C){this._oCurrentVariant=v;if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config&&this._oCurrentVariant.config.filterCompList){this._oCurrentVariant.config=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config==null){var h=this._getAnnotationSettings();if(h&&h.filterList){this._oCurrentVariant.config=this._convertSettingsToConfig(h,true);}}this._updateFilterBar();if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(false);}};g.prototype._getVariantConfig=function(){return this._oCurrentVariant;};g.prototype.fetchVariant=function(){if(!this._oCurrentVariant||this._oCurrentVariant=="STANDARD"){var h=this._getAnnotationSettings();if(h&&h.filterList){this._oCurrentVariant={config:this._convertSettingsToConfig(h,true)};return this._oCurrentVariant;}else{return{config:null};}}return{config:this.getConfig(true)};};g.prototype.updateVisualFilterBindings=function(A){var h=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<h.length;i++){if(h[i]._chart){h[i]._updateBinding();h[i]._bAllowBindingUpdateOnPropertyChange=A===true;}}};g.prototype.addVisualFiltersToBasicArea=function(p){var h=jQuery.extend(true,{},this.getModel('_visualFilterConfigModel').getData()),j=(p&&p.constructor===Array&&p.length)?p.length:0,C=0;if(!h){jQuery.sap.log.error("Could not add filter to basic area. No config found!");return false;}else if(!j){jQuery.sap.log.error("Improper parameter passed. Pass an array of properties.");return false;}else{for(var i=0;i<h.filterCompList.length;i++){var k=h.filterCompList[i];if(p.indexOf(d.readProperty(k.component.properties.parentProperty))!==-1&&!k.shownInFilterBar){k.shownInFilterBar=true;k.shownInFilterDialog=true;C++;}}if(C){this.getModel('_visualFilterConfigModel').setData(h);return true;}else{jQuery.sap.log.info("Filters already present in visual filter basic area");return false;}}};return g;},true);