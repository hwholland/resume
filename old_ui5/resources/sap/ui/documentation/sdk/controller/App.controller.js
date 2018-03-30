/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/ResizeHandler","sap/ui/Device","sap/ui/core/Fragment","sap/ui/documentation/library","sap/ui/core/IconPool","sap/m/SplitAppMode","sap/m/MessageBox","sap/m/library"],function(q,B,J,R,D,F,c,I,S,M,m){"use strict";var U=m.URLHelper;return B.extend("sap.ui.documentation.sdk.controller.App",{onInit:function(){B.prototype.onInit.call(this);var v=new J({busy:false,delay:0,bPhoneSize:false,bLandscape:D.orientation.landscape,bHasMaster:false,bSearchMode:false,bHideEmptySections:window['sap-ui-documentation-hideEmptySections'],sAboutInfoSAPUI5:"Looking for the Demo Kit for a specific SAPUI5 version? "+"Check at <a href = 'https://sapui5.hana.ondemand.com/versionoverview.html'>https://sapui5.hana.ondemand.com/versionoverview.html</a> "+"which versions are available. "+"You can view the version-specific Demo Kit by adding the version number to the URL, e.g. "+"<a href='https://sapui5.hana.ondemand.com/1.44.16/'>https://sapui5.hana.ondemand.com/1.44.16/</a>",sAboutInfoOpenUI5:"Looking for the Demo Kit for a specific OpenUI5 version? "+"Check at <a href = 'https://openui5.hana.ondemand.com/versionoverview.html'>https://openui5.hana.ondemand.com/versionoverview.html</a> "+"which versions are available. "+"You can view the version-specific Demo Kit by adding the version number to the URL, e.g. "+"<a href='https://openui5.hana.ondemand.com/1.44.16/'>https://openui5.hana.ondemand.com/1.44.16/</a>"});this.MENU_LINKS_MAP={"Legal":"https://www.sap.com/corporate/en/legal/impressum.html","Privacy":"https://www.sap.com/corporate/en/legal/privacy.html","Terms of Use":"https://www.sap.com/corporate/en/legal/terms-of-use.html","Copyright":"https://www.sap.com/corporate/en/legal/copyright.html","Trademark":"https://www.sap.com/corporate/en/legal/copyright.html#trademark","Disclaimer":"https://help.sap.com/viewer/disclaimer","License":"LICENSE.txt"};this.FEEDBACK_SERVICE_URL="https://feedback-sapuisofiaprod.hana.ondemand.com:443/api/v2/apps/5bb7d7ff-bab9-477a-a4c7-309fa84dc652/posts";this.OLD_DOC_LINK_SUFFIX=".html";this._oView=this.getView();this.setModel(v,"appView");this.oTabNavigation=this._oView.byId("tabHeader");this.oHeader=this._oView.byId("headerToolbar");this.oRouter=this.getRouter();R.register(this.oHeader,this.onHeaderResize.bind(this));this.oRouter.attachRouteMatched(this.onRouteChange.bind(this));this.oRouter.attachBypassed(this.onRouteNotFound.bind(this));this.oRouter.getRoute("entitySamplesLegacyRoute").attachPatternMatched(this._onEntityOldRouteMatched,this);this.oRouter.getRoute("entityAboutLegacyRoute").attachPatternMatched(this._onEntityOldRouteMatched,this);this.oRouter.getRoute("entityPropertiesLegacyRoute").attachPatternMatched({entityType:"properties"},this._forwardToAPIRef,this);this.oRouter.getRoute("entityAggregationsLegacyRoute").attachPatternMatched({entityType:"aggregations"},this._forwardToAPIRef,this);this.oRouter.getRoute("entityAssociationsLegacyRoute").attachPatternMatched({entityType:"associations"},this._forwardToAPIRef,this);this.oRouter.getRoute("entityEventsLegacyRoute").attachPatternMatched({entityType:"events"},this._forwardToAPIRef,this);this.oRouter.getRoute("entityMethodsLegacyRoute").attachPatternMatched({entityType:"methods"},this._forwardToAPIRef,this);this._registerFeedbackRatingIcons();this.byId("splitApp").attachEvent("afterMasterClose",function(e){v.setProperty("/bIsShownMaster",false);},this);},onBeforeRendering:function(){D.orientation.detachHandler(this._onOrientationChange,this);},onAfterRendering:function(){q(document.body).addClass(this.getOwnerComponent().getContentDensityClass());D.orientation.attachHandler(this._onOrientationChange,this);},onExit:function(){D.orientation.detachHandler(this._onOrientationChange,this);},_onTopicOldRouteMatched:function(i){if(i){i=this._trimOldDocSuffix(i);}this.getRouter().navTo("topicId",{id:i});},_onApiOldRouteMatched:function(i){var e,E,s;if(i){s=i.split("#");if(s.length===2){i=s[0];e=s[1];s=e.split(":");if(s.length===2){e=s[0];E=s[1];}}i=this._trimOldDocSuffix(i);if(e==='event'){e="events";}}this.getRouter().navTo("apiId",{id:i,entityType:e,entityId:E});},_trimOldDocSuffix:function(l){if(l&&q.sap.endsWith(l,this.OLD_DOC_LINK_SUFFIX)){l=l.slice(0,-this.OLD_DOC_LINK_SUFFIX.length);}return l;},_forwardToAPIRef:function(e,d){d||(d={});d['id']=e.getParameter("arguments").id;this.oRouter.navTo("apiId",d);},_onEntityOldRouteMatched:function(e){this.oRouter.navTo("entity",{id:e.getParameter("arguments").id});},onRouteChange:function(e){if(!this.oRouter.getRoute(e.getParameter("name"))._oConfig.target){return;}var r=e.getParameter("name"),t=this.oRouter.getRoute(r)._oConfig.target[0]+"Tab",T=this._oView.byId(t),k=T?T.getKey():"home",p=D.system.phone,v=this.getModel("appView"),h=this.getOwnerComponent().getConfigUtil().hasMasterView(r),o,s;this.oTabNavigation.setSelectedKey(k);v.setProperty("/bHasMaster",h);this._toggleTabHeaderClass();if(p&&h){o=this.getOwnerComponent().getConfigUtil().getMasterView(r);s=o&&o.getId();v.setProperty("/sMasterViewId",s);}this.byId("splitApp").hideMaster();v.setProperty("/bIsShownMaster",false);},onRouteNotFound:function(){this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);return;},toggleMaster:function(e){var p=e.getParameter("pressed"),P=D.system.phone,s=this.byId("splitApp"),i=s.getMode()===S.ShowHideMode,a=s.getMode()===S.HideMode,b=this.getModel("appView").getProperty("/sMasterViewId"),t;if(!P&&(i||a)){t=(p)?s.showMaster:s.hideMaster;t.call(s);return;}if(P){if(p){s.to(b);}else{s.backDetail();}}},navigateToSection:function(e){var k=e.getParameter("key");e.preventDefault();if(k&&k!=="home"){this.getRouter().navTo(k,{},true);}else{this.getRouter().navTo("",{},true);this.oTabNavigation.setSelectedKey("home");}},handleMenuItemClick:function(e){var t=e.getParameter("item").getText(),T=this.MENU_LINKS_MAP[t];if(t==="About"){this.aboutDialogOpen();}else if(t==="Feedback"){this.feedbackDialogOpen();}else if(T){U.redirect(T,true);}},aboutDialogOpen:function(){if(!this._oAboutDialog){this._oAboutDialog=new sap.ui.xmlfragment("aboutDialogFragment","sap.ui.documentation.sdk.view.AboutDialog",this);this._oView.addDependent(this._oAboutDialog);}else{this._oAboutDialog.getContent()[0].backToTop();}this._oAboutDialog.open();},aboutDialogClose:function(e){this._oAboutDialog.close();},onAboutVersionDetails:function(e){var v=this.getModel("appView"),V=v.getData(),t=this;c._loadAllLibInfo("","_getLibraryInfo","",function(L,o){var a={};var b=c._getLibraryInfoSingleton();for(var i=0,l=L.length;i<l;i++){L[i]=o[L[i]];L[i].libDefaultComponent=b._getDefaultComponent(L[i]);}a.libs=L;V.oVersionInfo=a;v.setData(V);t.setModel(v,"appView");});var n=F.byId("aboutDialogFragment","aboutNavCon"),d=F.byId("aboutDialogFragment","aboutDetail");n.to(d);},onAboutThirdParty:function(e){var v=this.getModel("appView"),V=v.getData(),t=this;c._loadAllLibInfo("","_getThirdPartyInfo",function(l,L){if(!l){return;}var f={};f.thirdparty=[];for(var j=0;j<l.length;j++){var o=L[l[j]];for(var i=0;i<o.libs.length;i++){var O=o.libs[i];O._lib=l[j];f.thirdparty.push(O);}}f.thirdparty.sort(function(a,b){var N=(a.displayName||"").toUpperCase();var g=(b.displayName||"").toUpperCase();if(N>g){return 1;}else if(N<g){return-1;}else{return 0;}});V.oThirdPartyInfo=f;v.setData(V);t.setModel(v,"appView");});var n=F.byId("aboutDialogFragment","aboutNavCon"),d=F.byId("aboutDialogFragment","aboutThirdParty");n.to(d);},onReleaseDialogOpen:function(e){var l=c._getLibraryInfoSingleton(),v=e.getSource().data("version"),L=e.getSource().data("library"),n=new J(),d=new J(),t=this;if(!this._oReleaseDialog){this._oReleaseDialog=new sap.ui.xmlfragment("releaseDialogFragment","sap.ui.documentation.sdk.view.ReleaseDialog",this);this._oView.addDependent(this._oReleaseDialog);}if(!this._oNotesView){this._oNotesView=sap.ui.view({id:"notesView",viewName:"sap.ui.documentation.sdk.view.ReleaseNotesView",type:"Template"});this._oNotesView.setModel(n);}l._getReleaseNotes(L,v,function(r,v){var o={};if(r&&r[v]&&r[v].notes&&r[v].notes.length>0){t._oNotesView.getModel().setData(r);t._oNotesView.bindObject("/"+v);}else{o.noDataMessage="No changes for this library!";}o.library=L;d.setData(o);});this._oReleaseDialog.setModel(d);this._oReleaseDialog.addContent(this._oNotesView);this._oReleaseDialog.open();},onReleaseDialogClose:function(e){this._oReleaseDialog.close();},onAboutNavBack:function(e){var n=F.byId("aboutDialogFragment","aboutNavCon");n.back();},feedbackDialogOpen:function(){var t=this;if(!this._oFeedbackDialog){this._oFeedbackDialog=new sap.ui.xmlfragment("feedbackDialogFragment","sap.ui.documentation.sdk.view.FeedbackDialog",this);this._oView.addDependent(this._oFeedbackDialog);this._oFeedbackDialog.textInput=F.byId("feedbackDialogFragment","feedbackInput");this._oFeedbackDialog.contextCheckBox=F.byId("feedbackDialogFragment","pageContext");this._oFeedbackDialog.contextData=F.byId("feedbackDialogFragment","contextData");this._oFeedbackDialog.ratingStatus=F.byId("feedbackDialogFragment","ratingStatus");this._oFeedbackDialog.ratingStatus.value=0;this._oFeedbackDialog.sendButton=F.byId("feedbackDialogFragment","sendButton");this._oFeedbackDialog.ratingBar=[{button:F.byId("feedbackDialogFragment","excellent"),status:"Excellent"},{button:F.byId("feedbackDialogFragment","good"),status:"Good"},{button:F.byId("feedbackDialogFragment","average"),status:"Average"},{button:F.byId("feedbackDialogFragment","poor"),status:"Poor"},{button:F.byId("feedbackDialogFragment","veryPoor"),status:"Very Poor"}];this._oFeedbackDialog.reset=function(){this.sendButton.setEnabled(false);this.textInput.setValue("");this.contextCheckBox.setSelected(true);this.ratingStatus.setText("");this.ratingStatus.setState("None");this.ratingStatus.value=0;this.contextData.setVisible(false);this.ratingBar.forEach(function(r){if(r.button.getPressed()){r.button.setPressed(false);}});};this._oFeedbackDialog.updateContextData=function(){var v=t._getUI5Version(),u=t._getUI5Distribution();if(this.contextCheckBox.getSelected()){this.contextData.setValue("Location: "+t._getCurrentPageRelativeURL()+"\n"+u+" Version: "+v);}else{this.contextData.setValue(u+" Version: "+v);}};this._oFeedbackDialog.updateContextData();}this._oFeedbackDialog.updateContextData();if(!this._oFeedbackDialog.isOpen()){q.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this._oFeedbackDialog);this._oFeedbackDialog.open();}},onFeedbackDialogSend:function(){var d={};if(this._oFeedbackDialog.contextCheckBox.getSelected()){d={"texts":{"t1":this._oFeedbackDialog.textInput.getValue()},"ratings":{"r1":{"value":this._oFeedbackDialog.ratingStatus.value}},"context":{"page":this._getCurrentPageRelativeURL(),"attr1":this._getUI5Distribution()+":"+sap.ui.version}};}else{d={"texts":{"t1":this._oFeedbackDialog.textInput.getValue()},"ratings":{"r1":{"value":this._oFeedbackDialog.ratingStatus.value}},"context":{"attr1":this._getUI5Distribution()+":"+sap.ui.version}};}this._oFeedbackDialog.setBusyIndicatorDelay(0);this._oFeedbackDialog.setBusy(true);q.ajax({url:this.FEEDBACK_SERVICE_URL,type:"POST",contentType:"application/json",data:JSON.stringify(d)}).done(function(){M.success("Your feedback has been sent.",{title:"Thank you!"});this._oFeedbackDialog.reset();this._oFeedbackDialog.close();this._oFeedbackDialog.setBusy(false);}.bind(this)).fail(function(r,s,e){var E=e;M.error("An error occurred sending your feedback:\n"+E,{title:"Sorry!"});this._oFeedbackDialog.setBusy(false);}.bind(this));},onFeedbackDialogCancel:function(){this._oFeedbackDialog.reset();this._oFeedbackDialog.close();},onShowHideContextData:function(){this._oFeedbackDialog.contextData.setVisible(!this._oFeedbackDialog.contextData.getVisible());},onContextSelect:function(){this._oFeedbackDialog.updateContextData();},onPressRatingButton:function(e){var t=this;var p=e.getSource();t._oFeedbackDialog.ratingBar.forEach(function(r){if(p!==r.button){r.button.setPressed(false);}else{if(!r.button.getPressed()){s("None","",0);}else{switch(r.status){case"Excellent":s("Success",r.status,5);break;case"Good":s("Success",r.status,4);break;case"Average":s("None",r.status,3);break;case"Poor":s("Warning",r.status,2);break;case"Very Poor":s("Error",r.status,1);}}}});function s(a,T,v){t._oFeedbackDialog.ratingStatus.setState(a);t._oFeedbackDialog.ratingStatus.setText(T);t._oFeedbackDialog.ratingStatus.value=v;if(v){t._oFeedbackDialog.sendButton.setEnabled(true);}else{t._oFeedbackDialog.sendButton.setEnabled(false);}}},onSearch:function(e){var Q=e.getParameter("query");if(!Q){return;}this.getRouter().navTo("search",{searchParam:Q},false);},onHeaderResize:function(e){var w=e.size.width,p=D.system.phone||w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0];this.getModel("appView").setProperty("/bPhoneSize",p);this._toggleTabHeaderClass();},_onOrientationChange:function(){this.getModel("appView").setProperty("/bLandscape",D.orientation.landscape);this._toggleTabHeaderClass();},onToggleSearchMode:function(e){var s=e.getParameter("isOpen"),v=this.getModel("appView");v.setProperty("/bSearchMode",s);this._toggleTabHeaderClass();if(s){q.sap.delayedCall(0,this,function(){this._oView.byId("searchControl").getAggregation("_searchField").getFocusDomRef().focus();});}},_registerFeedbackRatingIcons:function(){I.addIcon("icon-face-very-bad","FeedbackRatingFaces",{fontFamily:"FeedbackRatingFaces",content:"E086",suppressMirroring:true});I.addIcon("icon-face-bad","FeedbackRatingFaces",{fontFamily:"FeedbackRatingFaces",content:"E087",suppressMirroring:true});I.addIcon("icon-face-neutral","FeedbackRatingFaces",{fontFamily:"FeedbackRatingFaces",content:"E089",suppressMirroring:true});I.addIcon("icon-face-happy","FeedbackRatingFaces",{fontFamily:"FeedbackRatingFaces",content:"E08B",suppressMirroring:true});I.addIcon("icon-face-very-happy","FeedbackRatingFaces",{fontFamily:"FeedbackRatingFaces",content:"E08C",suppressMirroring:true});},_getUI5Version:function(){return this.getModel("versionData").getProperty("/version");},_getUI5VersionGav:function(){return this.getModel("versionData").getProperty("/versionGav");},_getUI5Distribution:function(){var v=this._getUI5VersionGav();var u="SAPUI5";if(v&&/openui5/i.test(v)){u="OpenUI5";}return u;},_getCurrentPageRelativeURL:function(){var p=window.location;return p.pathname+p.hash+p.search;},_isToggleButtonVisible:function(){var v=this.getModel("appView"),h=v.getProperty("/bHasMaster"),p=v.getProperty("/bPhoneSize"),l=v.getProperty("/bLandscape"),s=v.getProperty("/bSearchMode");return h&&(p||!l)&&!s;},_toggleTabHeaderClass:function(){var t=this.byId("tabHeader");if(this._isToggleButtonVisible()){t.addStyleClass("tabHeaderNoLeftMargin");}else{t.removeStyleClass("tabHeaderNoLeftMargin");}}});});