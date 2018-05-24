sap.ui.define(["jquery.sap.global","sap/ui/core/format/DateFormat","sap/m/MessageBox","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/Sorter","sap/ui/comp/smarttable/SmartTable","sap/ui/generic/app/navigation/service/SelectionVariant","sap/suite/ui/generic/template/lib/testableHelper","sap/suite/ui/generic/template/detailTemplates/detailUtils","sap/suite/ui/generic/template/ObjectPage/extensionAPI/ExtensionAPI","sap/ui/model/json/JSONModel","sap/suite/ui/generic/template/js/AnnotationHelper","sap/ui/core/mvc/ViewType","sap/m/Table"],function(q,D,M,a,F,S,b,c,t,d,E,J,A,V,R){"use strict";function I(s){return s.data("inlineCreate")==="true";}return{getMethods:function(v,T,C){var B=d.getControllerBase(v,T,C);B.state.aUnsavedDataCheckFunctions=[];var f;var o;function g(){var e=C.getOwnerComponent().getAppComponent().getConfig();if(T.oServices.oApplication.getBusyHelper().isBusy()){q.sap.log.info("Activation of object suppressed, since App is currently busy");return;}q.sap.log.info("Activate object");var i=T.oServices.oCRUDManager.activateDraftEntity();i.then(function(k){T.oServices.oApplication.showMessageToast(T.oCommonUtils.getText("OBJECT_SAVED"));if(k&&k.context){T.oServices.oViewDependencyHelper.setAllPagesDirty([C.getOwnerComponent().getId()]);T.oServices.oViewDependencyHelper.unbindChildren(C.getOwnerComponent());var x=e&&e.pages&&e.pages[0]&&e.pages[0].pages&&e.pages[0].pages[0]&&e.pages[0].pages[0].component&&e.pages[0].pages[0].component.settings&&e.pages[0].pages[0].component.settings.navToListOnSave;if(x){T.oServices.oNavigationController.navigateToRoot(true);}else{T.oServices.oNavigationController.navigateToContext(k.context,undefined,true);}}});var j={activationPromise:i};T.oComponentUtils.fire(C,"AfterActivate",j);}function O(e,i,j){var k=new sap.m.MessageItem({type:'{type}',title:'{title}'});var x=new J();var b1=e;x.setData(i);e._oMessageView=new sap.m.MessageView({showDetailsPageHeader:false,itemSelect:function(){b1._oBackButton.setVisible(true);},items:{path:"/",template:k}});e._oBackButton=new sap.m.Button({icon:sap.ui.core.IconPool.getIconURI("nav-back"),visible:false,press:function(){b1._oMessageView.navigateBack();e.setVisible(false);}});e._oMessageView.setModel(x);var c1=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.ShowConfirmationOnDraftActivate",{onCancel:function(){c1.close();},onSave:function(){c1.close();T.oServices.oApplication.performAfterSideEffectExecution(g);}});c1.removeAllContent();c1.addContent(e._oMessageView);c1.setContentHeight("300px");c1.setContentWidth("500px");c1.setVerticalScrolling(false);c1.aCustomStyleClasses=["sapMNavItem"];c1.setState(j);c1.open();}function h(){var e=C.getOwnerComponent().getAppComponent().getConfig();if(e&&e.pages&&e.pages[0]&&e.pages[0].pages&&e.pages[0].pages[0]&&e.pages[0].pages[0].component&&e.pages[0].pages[0].component.settings&&e.pages[0].pages[0].component.settings.showConfirmationOnDraftActivate){var j=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessagePopover");var k=j.getBinding("items").aIndices;var x=[];var b1=0;var c1="Warning";for(var i in k){var d1=j.getBinding("items").oList[k[i]].type;if(d1=="Warning"){b1++;}else if(d1=="Error"){c1="Error";}var e1=j.getBinding("items").oList[k[i]].message;x.push({type:d1,title:e1});}if(b1){O(this,x,c1);}else{T.oServices.oApplication.performAfterSideEffectExecution(g);}}else{T.oServices.oApplication.performAfterSideEffectExecution(g);}}function l(e){if(I(e.getSource())){var i=e.getParameter("bindingParams");if(i.filters&&i.filters.length){var j=new F(i.filters);i.filters=new F({filters:[new F({filters:[new F({path:"IsActiveEntity",operator:"EQ",value1:true}),j],and:true}),new F({filters:[new F({path:"IsActiveEntity",operator:"EQ",value1:false}),new F({filters:[j,new F({path:"HasActiveEntity",operator:"EQ",value1:false})],and:false})],and:true})],and:false});}var k=i.sorter[0]&&i.sorter[0].getGroupFunction();var x=k&&function(b1){var c1=b1.getObject();if(c1.IsActiveEntity||c1.HasActiveEntity){var d1=q.extend({},k(b1));d1.key=d1.key.charAt(0)==="§"?"§"+d1.key:d1.key;return d1;}return{key:"§",text:T.oCommonUtils.getText("NEW_ENTRY_GROUP")};};i.sorter.unshift(new S("HasActiveEntity",false,x));}}function m(e,i){var j=e;if(i){j=j+" - "+i;}var k=document.URL;if((k.indexOf("(")==0)){k="%28"+k.slice(1,k.length);}if((k.lastIndexOf(")")==(k.length-1))){k=k.slice(0,(k.length-1))+"%29";}sap.m.URLHelper.triggerEmail(null,j,k);}function n(e,i){var j=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:document.URL,share:e+" "+i}}});j.open();}function p(){return o.getHeaderTitle();}function r(e){var i=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.ShareSheet",{shareEmailPressed:function(){var j=i.getModel("share");m(j.getProperty("/objectTitle"),j.getProperty("/objectSubtitle"));},shareJamPressed:function(){var j=i.getModel("share");n(j.getProperty("/objectTitle"),j.getProperty("/objectSubtitle"));}},"share",function(x,j){var b1=sap.ui.getCore().getLibraryResourceBundle("sap.m");j.setProperty("/emailButtonText",b1.getText("SEMANTIC_CONTROL_SEND_EMAIL"));j.setProperty("/jamButtonText",b1.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));j.setProperty("/bookmarkButtonText",b1.getText("SEMANTIC_CONTROL_SAVE_AS_TILE"));var c1=q.sap.getObject("sap.ushell.Container.getUser");j.setProperty("/jamVisible",!!c1&&c1().isJamActive());});var j=i.getModel("share");var k=p();j.setProperty("/objectTitle",k.getProperty("objectTitle"));j.setProperty("/objectSubtitle",k.getProperty("objectSubtitle"));j.setProperty("/bookmarkCustomUrl",document.URL);i.openBy(e.getSource());}function s(){var e=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.RelatedAppsSheet",{buttonPressed:function(i){var j=i.getSource();var k=j.getBindingContext("buttons");var x=k.getProperty("link");var b1=k.getProperty("param");var c1=x.intent;var d1=c1.split('#')[1].split('-')[0];var e1=c1.split('-')[1].split('?')[0].split('~')[0];var f1={target:{semanticObject:d1,action:e1},params:b1};sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(f1);}},"buttons");return e;}function u(){var e=T.oServices.oApplication.getBusyHelper();if(e.isBusy()){return;}var i=C.getOwnerComponent();var j=i.getNavigationProperty();var k=T.oCommonUtils;var x=C.byId("objectPageHeader");var b1,c1;if(x.getProperty("objectTitle")!==""){if(x.getProperty("objectSubtitle")!==""){c1=[" ",x.getProperty("objectTitle").trim(),x.getProperty("objectSubtitle")];b1=k.getText("DELETE_WITH_OBJECTINFO",c1);}else{c1=[x.getProperty("objectTitle").trim()];b1=k.getText("DELETE_WITH_OBJECTTITLE",c1);}}else{b1=k.getText("ST_GENERIC_DELETE_SELECTED");}M.show(b1,{icon:M.Icon.WARNING,styleClass:T.oCommonUtils.getContentDensityClass(),title:k.getText("DELETE"),actions:[M.Action.DELETE,M.Action.CANCEL],onClose:function(d1){if(d1===M.Action.DELETE){var e1=i.getModel("_templPrivGlobal");var f1={objectPage:{currentEntitySet:i.getProperty("entitySet")}};e1.setProperty("/generic/multipleViews",f1);var g1=T.oServices.oCRUDManager.deleteEntity();var h1=i.getBindingContext()&&i.getBindingContext().getPath();var i1=Object.create(null);i1[h1]=g1;T.oServices.oApplication.prepareDeletion(i1);g1.then(function(){T.oServices.oViewDependencyHelper.setParentToDirty(i,j,1);T.oServices.oViewDependencyHelper.unbindChildren(i,true);});var j1={deleteEntityPromise:g1};e.setBusy(g1);T.oComponentUtils.fire(C,"AfterDelete",j1);}}});}function w(e){T.oServices.oApplication.performAfterSideEffectExecution(u);}function y(e){var i,j;if(e){j=e.context||e;if(T.oServices.oDraftController.getDraftContext().hasDraft(j)){T.oServices.oViewDependencyHelper.setRootPageToDirty();i=e.context&&e.context.context||e.context||e;}}if(i){if(B.fclInfo.navigateToDraft){B.fclInfo.navigateToDraft(i);}else{T.oServices.oNavigationController.navigateToContext(i,undefined,true,2);}}else{var k=T.oComponentUtils.getTemplatePrivateModel();k.setProperty("/objectPage/displayMode",2);}v.setEditable(true);}var z;function G(e){T.oServices.oCRUDManager.editEntity(e).then(function(i){if(i.draftAdministrativeData){z(i.draftAdministrativeData.CreatedByUserDescription||i.draftAdministrativeData.CreatedByUser);}else{y(i.context);}});}z=function(e){var i=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog",{onEdit:function(){i.close();G(true);},onCancel:function(){i.close();}},"Dialog");var j=i.getModel("Dialog");var k=T.oCommonUtils.getText("DRAFT_LOCK_EXPIRED",[e]);j.setProperty("/unsavedChangesQuestion",k);i.open();};var H;function K(){H=H||T.oCommonUtils.getText("NEW_OBJECT");return H;}function L(e,i,j){if(!j.getContent){return;}j.getContent().forEach(function(k){if(k instanceof b){if(i||e[k.getTableBindingPath()]){if(k.isInitialised()){T.oCommonUtils.refreshSmartTable(k);}else{k.attachInitialise(function(){T.oCommonUtils.refreshSmartTable(k);});}if(!i){T.oServices.oApplicationController.executeSideEffects(C.getOwnerComponent().getBindingContext(),[],[k.getTableBindingPath()]);}}}});}function N(e){var i=sap.ui.getCore().byId(p().getId()+"-lock");i.setVisible(e);}function P(){var j="{\"SelectionVariantID\":\"\"}";var k=C.getOwnerComponent();var b1=k.getEntitySet();var c1=k.getModel();var d1=c1.getMetaModel();var e1=d1.getODataEntitySet(b1);var f1=d1.getODataEntityType(e1.entityType);var g1=f1.property;var h1=[];for(var x in g1){var i1=g1[x]["com.sap.vocabularies.Common.v1.FieldControl"]&&g1[x]["com.sap.vocabularies.Common.v1.FieldControl"].Path;if(i1&&h1.indexOf(i1)<0){h1.push(i1);}}var j1=C.getView().getBindingContext();var k1=j1.getObject();var l1=new c();for(var i in g1){var m1=g1[i].type;var n1=g1[i].name;var o1=k1[g1[i].name];if(h1.indexOf(n1)>-1){continue;}if(n1&&(o1||m1==="Edm.Boolean")){if(m1==="Edm.Time"&&o1.ms!==undefined){o1=o1.ms;}if(typeof o1!=="string"){try{o1=o1.toString();}catch(e){o1=o1+"";}}l1.addParameter(n1,o1);}}j=l1.toJSONString();return j;}function Q(e,i){var j=true;var k=i.getModel();var x=T.oCommonUtils.getDeleteRestrictions(i);var b1=x&&x.Deletable&&x.Deletable.Path;if(b1){j=k.getProperty(b1,e);}return j;}function U(e){var j=T.oServices.oApplication.getBusyHelper();if(j.isBusy()){return;}var k=e.getSource();var x=T.oCommonUtils.getOwnerControl(k);var b1=T.oCommonUtils.getSelectedContexts(x);if(b1.length===0){M.error(T.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:T.oCommonUtils.getContentDensityClass()});return;}var c1=[];var d1=[];for(var i=0;i<b1.length;i++){if(Q(b1[i],x)){c1.push(b1[i].getPath());}else{d1.push(b1[i]);}}if(d1.length>0){M.error(T.oCommonUtils.getText("ST_GENERIC_DELETE_UNDELETABLE_SUBITEMS",[d1.length,b1.length]),{styleClass:T.oCommonUtils.getContentDensityClass()});}var e1=T.oServices.oCRUDManager.deleteEntities(c1);j.setBusy(e1);T.oServices.oApplicationController.executeSideEffects(x.getBindingContext(),[],[x.getTableBindingPath()]);var f1=k.getParent().getParent().getId();e1.then(function(){T.oServices.oViewDependencyHelper.unbindChildren(C.getOwnerComponent());T.oCommonUtils.refreshSmartTable(x);});var g1={deleteEntitiesPromise:e1,sUiElementId:f1,aContexts:b1};T.oComponentUtils.fire(C,"AfterLineItemDelete",g1);}function W(){var i=C.byId("imageDialog")||T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.ImageDialog",{onImageDialogClose:function(){i.close();}},"headerImage");return i;}v.refreshFacets=function(e,i){var j=L.bind(null,e,i);var k=function(x){x.getBlocks().forEach(j);x.getMoreBlocks().forEach(j);};o.getSections().forEach(function(x){x.getSubSections().forEach(k);});};v.getHeaderInfoTitleForNavigationMenue=function(){var e=C.byId("objectPageHeader");var i=e.getProperty("objectTitle");var j=T.oComponentUtils.getTemplatePrivateModel();var k=j.getProperty("/generic/viewLevel");T.oServices.oApplication.subTitleForViewLevelChanged(k,i);};v.onComponentActivate=B.onComponentActivate;v.draftResume=function(e,j,k){var x=e.getObject();if(!x||!x.hasOwnProperty("IsActiveEntity")||x.IsActiveEntity!==false){return;}var b1=C.getView().getModel();var c1=b1.getMetaModel();var d1=c1.getODataEntitySet(C.getOwnerComponent().getEntitySet());var e1=c1.getODataEntityType(d1.entityType);var f1="";var g1="";var h1=e1["com.sap.vocabularies.Common.v1.SemanticKey"];for(var i in h1){var i1=h1[i];if(g1===""){g1=j[i1.PropertyPath];}else{g1=g1+"-"+j[i1.PropertyPath];}}var j1="-";if(k&&k.LastChangeDateTime!==null){var k1=D.getDateTimeInstance({pattern:"MMMM d, yyyy HH:mm",style:"long"});j1=k1.format(k.LastChangeDateTime);}var l1=[f1,g1,j1];var m1=T.oCommonUtils.getText("DRAFT_FOUND_RESUME",l1);var n1;var o1=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.DraftResumeDialog",{onDraftResume:function(){o1.close();T.oServices.oNavigationController.navigateToContext(n1.getProperty("/siblingContext"),null,true);},onDraftDiscard:function(){o1.close();C.getView().getModel("ui").setProperty("/enabled",true);T.oServices.oCRUDManager.deleteEntity(true);N(false);n1.getProperty("/activeEntity").HasDraftEntity=false;T.oServices.oViewDependencyHelper.setAllPagesDirty();},onResumeDialogClosed:function(){n1.setProperty("/siblingContext",null);n1.setProperty("/activeEntity",null);}},"Dialog");n1=o1.getModel("Dialog");n1.setProperty("/draftResumeText",m1);n1.setProperty("/siblingContext",e);n1.setProperty("/activeEntity",j);o1.open();};var X={lazyLoading:function(i,e){e.setBindingContext(i?undefined:null);},reuseComponent:function(i,e){var j=e.getBlocks()[0];T.oComponentUtils.onVisibilityChangeOfReuseComponent(i,j);}};function Y(e){var j=e.getCustomData();for(var i=0;i<j.length;i++){var k=j[i];if(k.getProperty("key")==="strategyForVisibilityChange"){return X[k.getProperty("value")];}}}function Z(i,e){var j=Y(e);if(j){if(i){var k=T.oComponentUtils.getHeaderDataAvailablePromise()||Promise.resolve();k.then(function(){j(true,e);});}else{j(false,e);}}}function $(e){Z(false,e);}function _(e){e.getSubSections().forEach($);}v.beforeRebind=function(){o.getSections().forEach(_);};v.afterRebind=function(){o._triggerVisibleSubSectionsEvents();};var G=t.testable(G,"editEntity");var Q=t.testable(Q,"isEntryDeletable");var g=t.testable(g,"onActivateImpl");var h=t.testable(h,"onActivate");var O=t.testable(O,"fnOpenConfirmationDialog");var a1={onInit:function(){o=C.byId("objectPage");var e=p();v.aBreadCrumbs=e&&e.getBreadCrumbsLinks();B.onInit();T.oCommonUtils.executeGlobalSideEffect();o.attachEvent("subSectionEnteredViewPort",function(i){var j=i.getParameter("subSection");Z(true,j);});},handlers:{addEntry:function(e){var i=e.getSource();var j=T.oCommonUtils.getOwnerControl(i);var k=I(j);if(!i.data("CrossNavigation")&&k){T.oCommonEventHandlers.addEntry(i,true);return;}T.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){T.oCommonEventHandlers.addEntry(i,false);},q.noop,B.state);},deleteEntries:U,onSelectionChange:function(e){T.oCommonUtils.setEnabledToolbarButtons(e.getSource());},onCancel:function(e){var i="Proceed";var j;if(T.oComponentUtils.isNonDraftCreate()||!f){i="LeavePage";}T.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var k=T.oComponentUtils.getTemplatePrivateModel();k.setProperty("/objectPage/displayMode",1);if(T.oComponentUtils.isNonDraftCreate()){v.setEditable(false);}else if(f){v.setEditable(false);}if(T.oComponentUtils.isNonDraftCreate()||!f){T.oServices.oNavigationController.navigateBack();}},q.noop,B.state,i,j,e);},onContactDetails:function(e){T.oCommonEventHandlers.onContactDetails(e);},onPressDraftInfo:function(e){var i=C.getView().getBindingContext();var j=sap.ui.getCore().byId(e.getSource().getId()+(e.getId()==="markChangesPress"?"-changes":"-lock"));T.oCommonUtils.showDraftPopover(i,j);},onShareObjectPageActionButtonPress:r,onRelatedApps:function(e){var x,b1,c1,d1,e1,f1,g1;var h1,i1,j1,k1,l1;x=e.getSource();j1=sap.ushell&&sap.ushell.Container;b1=j1&&j1.getService("URLParsing");c1=b1.parseShellHash(document.location.hash);k1=c1.semanticObject;l1=c1.action;d1=C.getView&&C.getView().getBindingContext();var m1=C.getOwnerComponent().getModel().getMetaModel();var n1=d1.getObject();var o1=n1.__metadata.type;var p1=m1.getODataEntityType(o1);var q1=p1["com.sap.vocabularies.Common.v1.SemanticKey"];var r1={};if(q1&&q1.length>0){for(var j=0;j<q1.length;j++){var s1=q1[j].PropertyPath;if(!r1[s1]){r1[s1]=[];r1[s1].push(n1[s1]);}}}else{for(var k in p1.key.propertyRef){var t1=p1.key.propertyRef[k].name;if(!r1[t1]){r1[t1]=[];r1[t1].push(n1[t1]);}}}e1=C.getOwnerComponent().getAppComponent();f1=j1&&j1.getService("CrossApplicationNavigation");g1=f1.getLinks({semanticObject:k1,params:r1,ui5Component:e1});h1=s();i1=h1.getModel("buttons");i1.setProperty("/buttons",[]);h1.openBy(x);g1.done(function(u1){var v1=[];u1.sort(function(z1,A1){if(z1.text<A1.text){return-1;}if(z1.text>A1.text){return 1;}return 0;});for(var i=0;i<u1.length;i++){var w1=u1[i];var x1=w1.intent;var y1=x1.split("-")[1].split("?")[0];if(y1!==l1){v1.push({enabled:true,text:w1.text,link:w1,param:r1});}}if(v1.length===0){v1.push({enabled:false,text:T.oCommonUtils.getText("NO_RELATED_APPS")});}i1.setProperty("/buttons",v1);});},onSemanticObjectLinkPopoverLinkPressed:function(e){T.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(e,B.state);},onEdit:function(e){var i=e.getSource();if(i.data("CrossNavigation")){T.oCommonEventHandlers.onEditNavigateIntent(i);return;}f=true;G();},onSave:function(){if(T.oServices.oApplication.getBusyHelper().isBusy()){return;}var e=C.getView().getBindingContext();var i=C.getView().getModel().getPendingChanges();i=i&&i[e.getPath().replace("/","")]||{};var j=Object.keys(i)||[];var k=T.oComponentUtils.isNonDraftCreate();var x=j.indexOf("__metadata");if(x>-1){j.splice(x,1);}var b1=T.oServices.oCRUDManager.saveEntity();b1.then(function(d1){var e1=T.oComponentUtils.getTemplatePrivateModel();e1.setProperty("/objectPage/displayMode",1);v.setEditable(false);if(k){if(d1&&d1.getPath()!=="/undefined"){T.oServices.oNavigationController.navigateToContext(d1,undefined,true);}else{T.oServices.oNavigationController.navigateBack();}T.oServices.oApplication.showMessageToast(T.oCommonUtils.getText("OBJECT_CREATED"));}else{T.oServices.oApplication.showMessageToast(T.oCommonUtils.getText("OBJECT_SAVED"));if(!T.oComponentUtils.isDraftEnabled()&&!f){T.oServices.oNavigationController.navigateBack();}}if(j.length>0){T.oServices.oApplicationController.executeSideEffects(e,j);}});var c1={saveEntityPromise:b1};T.oComponentUtils.fire(C,"AfterSave",c1);},onActivate:h,onSmartFieldUrlPressed:function(e){T.oCommonEventHandlers.onSmartFieldUrlPressed(e,B.state);},onBreadCrumbUrlPressed:function(e){T.oCommonEventHandlers.onBreadCrumbUrlPressed(e,B.state);},onDiscardDraft:function(e){T.oCommonEventHandlers.onDiscardDraft(e);},onDelete:w,onCallActionFromToolBar:function(e){T.oCommonEventHandlers.onCallActionFromToolBar(e,B.state);},onCallAction:function(e){var i=C.getOwnerComponent();var j=i.getNavigationProperty();var k=T.oCommonUtils.getCustomData(e);var x=[];x.push(C.getView().getBindingContext());if(x[0]&&k.Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"){T.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var b1={functionImportPath:k.Action,contexts:x,sourceControl:"",label:k.Label,operationGrouping:k.InvocationGrouping,navigationProperty:C.getOwnerComponent().getNavigationProperty()};T.oServices.oCRUDManager.callAction(b1).then(function(c1){var d1=c1&&c1[0];if(d1&&d1.response&&d1.response.context&&(!d1.actionContext||d1.actionContext&&d1.response.context.getPath()!==d1.actionContext.getPath())){T.oServices.oViewDependencyHelper.setParentToDirty(i,j,1);}});},q.noop,B.state,"Proceed");}},onDataFieldForIntentBasedNavigation:function(e){T.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(e,B.state);},onDataFieldWithIntentBasedNavigation:function(e){T.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(e,B.state);},onDataFieldWithNavigationPath:function(e){T.oCommonEventHandlers.onDataFieldWithNavigationPath(e);},onChartInit:function(e){var i=e.getSource().getChart();var j=C._templateEventHandlers.onSelectionChange;i.attachSelectData(j).attachDeselectData(j);var k=i.getParent();T.oCommonUtils.checkToolbarIntentsSupported(k);},onDataReceived:function(e){T.oCommonEventHandlers.onDataReceived(e);},onBeforeRebindDetailTable:function(e){T.oCommonEventHandlers.onBeforeRebindTable(e);C.onBeforeRebindTableExtension(e);l(e);if(T.oCommonUtils.isAnalyticalTable(e.getSource().getTable())){var i=e.getParameter("bindingParams");i.parameters.entitySet=e.getSource().getEntitySet();}},onShowDetails:function(e){T.oCommonEventHandlers.onShowDetails(e.getSource(),B.state);},onListNavigate:function(e){if(!C.onListNavigationExtension(e)){T.oCommonEventHandlers.onListNavigate(e.getSource(),B.state);}},onBeforeSemanticObjectLinkPopoverOpens:function(e){var i=e.getParameters();T.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var j=P();T.oCommonUtils.semanticObjectLinkNavigation(i,j,C);},q.noop,B.state,q.noop);},onSemanticObjectLinkNavigationPressed:function(e){var i=e.getParameters();var j=e.getSource();T.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(j,i);},onSemanticObjectLinkNavigationTargetObtained:function(e){var i=e.getParameters();var j=e.getSource();T.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(j,i,B.state);},onSemanticObjectLinkNavigationTargetObtainedSmartLink:function(e){var i,j;i=e.getParameters();j=e.getSource();j=j.getParent().getParent().getParent().getParent();T.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(j,i,B.state);},onHeaderImagePress:function(e){var i=W();var j=e.getSource().getId();i.addAriaLabelledBy(j);var k=i.getModel("headerImage");k.setProperty("/src",e.getSource().getSrc());if(sap.ui.Device.system.phone){i.setProperty("stretch",true);}i.open();},onInlineDataFieldForAction:function(e){T.oCommonEventHandlers.onInlineDataFieldForAction(e,B.state);},onInlineDataFieldForIntentBasedNavigation:function(e){T.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(e.getSource(),B.state);},onDeterminingDataFieldForAction:function(e){T.oCommonEventHandlers.onDeterminingDataFieldForAction(e);},onBeforeRebindChart:function(e){var i=e.getSource();i.oModels=i.getChart().oPropagatedProperties.oModels;},onTableInit:function(e){var j=e.getSource();var k=j.getTable();T.oCommonUtils.checkToolbarIntentsSupported(j);j.attachModelContextChange(function(){if(j.getCustomToolbar&&j.getCustomToolbar().getContent){var x=j.getCustomToolbar().getContent();for(var i in x){if(x[i].getShowSearchButton){x[i].setValue("");j.rebindTable();break;}}}});if(I(j)&&!j.data("CrossNavigation")){k.addEventDelegate({onkeyup:function(e){if(e.ctrlKey&&e.keyCode==q.sap.KeyCodes.ENTER&&j.getEditable()){T.oCommonEventHandlers.addEntry(j,true);e.preventDefault();e.setMarked();}}});}},onSearchObjectPage:function(e){var i=(e.getSource().getParent()).getParent();i.data("searchString",e.getSource().getValue());i.data("allowSearch",true);i.data("tableId",i.getId());i.data("objectPath",i.getBindingContext().getPath());i.rebindTable();}},formatters:{formatDefaultObjectTitle:function(e,i){if(i||!e){return;}var j=C.getView().getBindingContext();var k=j&&j.getObject();if(e&&k&&(k.IsActiveEntity===undefined||k.IsActiveEntity===false||k.HasActiveEntity===false)){return K();}},setNoDataTextForSmartTable:function(){var e=C.getOwnerComponent()&&C.getOwnerComponent().getModel("i18n")&&C.getOwnerComponent().getModel("i18n").getResourceBundle();if(e&&e.getText("NOITEMS_SMARTTABLE")!=="NOITEMS_SMARTTABLE"){return e.getText("NOITEMS_SMARTTABLE");}else{var i=C.getOwnerComponent().getAppComponent();e=i&&i.getModel("i18n")&&i.getModel("i18n").getResourceBundle();if(e&&e.hasText("NOITEMS_SMARTTABLE")){return e.getText("NOITEMS_SMARTTABLE");}else{return"";}}}},extensionAPI:new E(T,C,B)};a1.handlers=q.extend(B.handlers,a1.handlers);return a1;}};});