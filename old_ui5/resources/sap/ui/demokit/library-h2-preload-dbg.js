/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/demokit/library',['jquery.sap.global','sap/ui/Global','sap/ui/core/Core','./js/highlight-query-terms'],function(q,G){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.demokit",version:"1.54.2",dependencies:["sap.ui.core","sap.ui.commons"],types:["sap.ui.demokit.UI5EntityCueCardStyle"],interfaces:[],controls:["sap.ui.demokit.CodeSampleContainer","sap.ui.demokit.CodeViewer","sap.ui.demokit.FileUploadIntrospector","sap.ui.demokit.HexagonButton","sap.ui.demokit.HexagonButtonGroup","sap.ui.demokit.IndexLayout","sap.ui.demokit.SimpleTree","sap.ui.demokit.TagCloud","sap.ui.demokit.UI5EntityCueCard"],elements:["sap.ui.demokit.SimpleTreeNode","sap.ui.demokit.Tag","sap.ui.demokit.UIAreaSubstitute"]});var t=sap.ui.demokit;t.UI5EntityCueCardStyle={Standard:"Standard",Demokit:"Demokit"};sap.ui.lazyRequire("sap.ui.demokit.UI5EntityCueCard","attachToContextMenu detachFromContextMenu");sap.ui.lazyRequire("sap.ui.demokit.DemokitApp","new getInstance");sap.ui.lazyRequire("sap.ui.demokit.IndexPage");sap.ui.getCore().attachInit(function(){if(q("body").hasClass("sapUiDemokitBody")){var C=sap.ui.requireSync('sap/ui/demokit/CodeSampleContainer');var H=sap.ui.requireSync('sap/ui/demokit/HexagonButton');var U=sap.ui.requireSync('sap/ui/demokit/UI5EntityCueCard');q("h1").each(function(){var $=q(this),T=$.text(),a="Gray",i=$.attr('icon'),I=$.attr('iconPos')||'left:40px;top:20px;',e=q("<div class='sapUiDemokitTitle'><span>"+T+"</span></div>");$.replaceWith(e);if(a||i){e.prepend("<div id='sap-demokit-icon'></div>");new H({color:a,imagePosition:'position: relative;'+I,icon:i}).placeAt("sap-demokit-icon");}});var b=q("h2");var c=q('h2[id="settings"]');var s=q("html").attr('data-sap-ui-dk-controls');if(c.size()===0&&b.size()>=2&&s){q(b[1]).before(q("<h2 id='settings'>Settings (Overview)</h2><div cue-card='"+s.split(',')[0]+"'></div>"));b=q("h2");}var d=q("ul.sapDkTLN");if(b.size()>0&&d.size()==0){b.first().before(d=q("<ul class='sapDkTLN'></ul>"));}b.each(function(i){var $=q(this);if($.css('display')==='none'){return;}if(!$.attr('id')){$.attr('id','__'+i);}var a=q("<a></a>").attr("href","#"+$.attr('id')).text($.text()).addClass('sapDkLnk');var l=q("<li></li>").append(a);d.append(l);});q("[code-sample]").each(function(){var $=q(this),u=$.attr('code-sample'),S=$.attr('script')||$.children('script').attr('id')||u+"-script";$.addClass("sapUiDemokitSampleCont");new C("code-sample-"+u,{scriptElementId:S,uiAreaId:u}).placeAt(this);});q("[cue-card]").each(function(){var $=q(this),e=$.attr('cue-card');new U({entityName:e,collapsible:false,expanded:true,style:'Demokit',navigable:true,navigate:function(E){top.sap.ui.demokit.DemokitApp.getInstance().navigateToType(E.getParameter("entityName"));E.preventDefault();},title:'Settings (Overview)'}).placeAt(this);});}});
t._getAppInfo=function(c){var u=sap.ui.resource("","sap-ui-version.json");q.ajax({url:u,dataType:"json",error:function(x,s,e){q.sap.log.error("failed to load library list from '"+u+"': "+s+", "+e);c(null);},success:function(a,s,x){if(!a){q.sap.log.error("failed to load library list from '"+u+"': "+s+", Data: "+a);c(null);return;}c(a);}});};
t._loadAllLibInfo=function(a,I,r,c){if(typeof r==="function"){c=r;r=undefined;}q.sap.require("sap.ui.core.util.LibraryInfo");var L=sap.ui.require("sap/ui/core/util/LibraryInfo");var l=new L();var f=I=="_getLibraryInfoAndReleaseNotes";if(f){I="_getLibraryInfo";}t._getAppInfo(function(A){if(!(A&&A.libraries)){c(null,null);return;}var b=0,d=A.libraries,e=d.length,o={},g={},h=[],j,k;for(var i=0;i<e;i++){j=d[i].name;k=d[i].version;h.push(j);g[j]=k;l[I](j,function(E){var D=function(){b++;if(b==e){c(h,o,A);}};o[E.library]=E;if(!o[E.library].version){o[E.library].version=g[E.library];}if(f){if(!r){r=g[E.library];}l._getReleaseNotes(E.library,r,function(R){o[E.library].relnotes=R;D();});}else{D();}});}});};
return t;});
jQuery.sap.registerPreloadedModules({
"name":"sap/ui/demokit/library-h2-preload",
"version":"2.0",
"modules":{
	"sap/ui/demokit/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.demokit","type":"library","embeds":["demoapps","explored"],"applicationVersion":{"version":"1.54.2"},"title":"Non-public controls that should be used in a UI5 demokit (SDK) only.","description":"Non-public controls that should be used in a UI5 demokit (SDK) only.","ach":"CA-UI5-CTR","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"esprima","packagedWithMySelf":true,"version":"0.0.0"},{"name":"google-code-prettify","packagedWithMySelf":true,"version":"0.0.0"}]},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_bluecrystal","sap_goldreflection","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.54","libs":{"sap.ui.core":{"minVersion":"1.54.2"},"sap.ui.commons":{"minVersion":"1.54.2"}}},"library":{"i18n":false,"content":{"controls":["sap.ui.demokit.CodeSampleContainer","sap.ui.demokit.CodeViewer","sap.ui.demokit.FileUploadIntrospector","sap.ui.demokit.HexagonButton","sap.ui.demokit.HexagonButtonGroup","sap.ui.demokit.IndexLayout","sap.ui.demokit.SimpleTree","sap.ui.demokit.TagCloud","sap.ui.demokit.UI5EntityCueCard"],"elements":["sap.ui.demokit.SimpleTreeNode","sap.ui.demokit.Tag","sap.ui.demokit.UIAreaSubstitute"],"types":["sap.ui.demokit.UI5EntityCueCardStyle"],"interfaces":[]}}}}'
}});
/* Bundle format 'h2' not supported (requires ui5loader)
"sap/ui/demokit/CodeSampleContainer.js":["jquery.sap.global.js","sap/ui/commons/Link.js","sap/ui/core/Control.js","sap/ui/demokit/CodeSampleContainerRenderer.js","sap/ui/demokit/CodeViewer.js","sap/ui/demokit/UIAreaSubstitute.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/CodeSampleContainerRenderer.js":["jquery.sap.global.js"],
"sap/ui/demokit/CodeViewer.js":["jquery.sap.global.js","jquery.sap.keycodes.js","sap/ui/commons/Button.js","sap/ui/commons/Dialog.js","sap/ui/core/Control.js","sap/ui/demokit/CodeViewerRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/CodeViewerRenderer.js":["jquery.sap.global.js"],
"sap/ui/demokit/DemokitApp.js":["jquery.sap.global.js","jquery.sap.script.js","sap/ui/Device.js","sap/ui/commons/Button.js","sap/ui/commons/Dialog.js","sap/ui/commons/DropdownBox.js","sap/ui/commons/FormattedTextView.js","sap/ui/commons/Image.js","sap/ui/commons/Label.js","sap/ui/commons/Link.js","sap/ui/commons/SearchField.js","sap/ui/commons/Splitter.js","sap/ui/commons/TextView.js","sap/ui/commons/Tree.js","sap/ui/commons/TreeNode.js","sap/ui/commons/layout/AbsoluteLayout.js","sap/ui/commons/library.js","sap/ui/core/CustomData.js","sap/ui/core/HTML.js","sap/ui/core/ListItem.js","sap/ui/core/Title.js","sap/ui/core/library.js","sap/ui/core/mvc/View.js","sap/ui/core/search/OpenSearchProvider.js","sap/ui/core/util/LibraryInfo.js","sap/ui/demokit/FeedbackClient.js","sap/ui/demokit/Tag.js","sap/ui/demokit/TagCloud.js","sap/ui/demokit/library.js","sap/ui/layout/VerticalLayout.js","sap/ui/layout/form/Form.js","sap/ui/layout/form/FormContainer.js","sap/ui/layout/form/FormElement.js","sap/ui/layout/form/GridElementData.js","sap/ui/layout/form/GridLayout.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js","sap/ui/ux3/DataSet.js","sap/ui/ux3/DataSetItem.js","sap/ui/ux3/DataSetSimpleView.js","sap/ui/ux3/NavigationItem.js","sap/ui/ux3/Shell.js","sap/ui/ux3/ToolPopup.js"],
"sap/ui/demokit/EntityInfo.js":["jquery.sap.global.js","sap/ui/demokit/util/APIInfo.js","sap/ui/demokit/util/jsanalyzer/ModuleAnalyzer.js"],
"sap/ui/demokit/FeedbackClient.js":["jquery.sap.global.js","sap/ui/commons/Button.js","sap/ui/commons/CheckBox.js","sap/ui/commons/FormattedTextView.js","sap/ui/commons/Label.js","sap/ui/commons/Link.js","sap/ui/commons/SegmentedButton.js","sap/ui/commons/TextArea.js","sap/ui/commons/TextView.js","sap/ui/core/IconPool.js","sap/ui/core/library.js","sap/ui/layout/HorizontalLayout.js","sap/ui/layout/VerticalLayout.js","sap/ui/layout/form/SimpleForm.js","sap/ui/layout/form/SimpleFormLayout.js","sap/ui/ux3/ToolPopup.js"],
"sap/ui/demokit/FileUploadIntrospector.js":["jquery.sap.act.js","jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/demokit/FileUploadIntrospectorRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/HexagonButton.js":["sap/ui/core/Control.js","sap/ui/demokit/HexagonButtonRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/HexagonButtonGroup.js":["sap/ui/core/Control.js","sap/ui/demokit/HexagonButtonGroupRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/HexagonButtonRenderer.js":["jquery.sap.encoder.js","jquery.sap.global.js"],
"sap/ui/demokit/IndexLayout.js":["jquery.sap.global.js","sap/ui/Device.js","sap/ui/core/Control.js","sap/ui/core/IntervalTrigger.js","sap/ui/demokit/IndexLayoutRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/IndexLayoutPage.js":["jquery.sap.encoder.js","jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/core/Element.js","sap/ui/core/IconPool.js","sap/ui/demokit/IndexLayout.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/IndexPage.js":["jquery.sap.global.js","sap/ui/commons/RichTooltip.js","sap/ui/demokit/DemokitApp.js","sap/ui/demokit/HexagonButton.js","sap/ui/demokit/HexagonButtonGroup.js"],
"sap/ui/demokit/SimpleTree.js":["jquery.sap.global.js","sap/m/SearchField.js","sap/ui/core/Control.js","sap/ui/core/delegate/ItemNavigation.js","sap/ui/demokit/SimpleTreeRenderer.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js"],
"sap/ui/demokit/SimpleTreeNode.js":["sap/ui/core/Element.js","sap/ui/core/Icon.js"],
"sap/ui/demokit/SimpleTreeRenderer.js":["jquery.sap.encoder.js","jquery.sap.global.js","sap/ui/demokit/SimpleTreeNode.js"],
"sap/ui/demokit/Tag.js":["sap/ui/core/Element.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/TagCloud.js":["sap/ui/core/Control.js","sap/ui/demokit/TagCloudRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/UI5EntityCueCard.js":["jquery.sap.global.js","sap/ui/commons/Link.js","sap/ui/core/Control.js","sap/ui/demokit/EntityInfo.js","sap/ui/demokit/UI5EntityCueCardRenderer.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/UI5EntityCueCardRenderer.js":["jquery.sap.global.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/UIAreaSubstitute.js":["sap/ui/core/Element.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/demoapps/Component.js":["sap/ui/core/UIComponent.js","sap/ui/demokit/demoapps/model/libraryData.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/demoapps/controller/App.controller.js":["jquery.sap.global.js","sap/m/MessageBox.js","sap/m/MessageToast.js","sap/m/library.js","sap/ui/core/mvc/Controller.js","sap/ui/demokit/demoapps/model/formatter.js","sap/ui/demokit/demoapps/model/sourceFileDownloader.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js"],
"sap/ui/demokit/demoapps/model/libraryData.js":["jquery.sap.global.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/demoapps/model/sourceFileDownloader.js":["jquery.sap.global.js"],
"sap/ui/demokit/demoapps/view/App.view.xml":["sap/ui/core/CustomData.js","sap/ui/core/mvc/XMLView.js","sap/ui/demokit/demoapps/controller/App.controller.js","sap/ui/layout/BlockLayout.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/BlockLayoutRow.js","sap/ui/layout/Grid.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demokit/demoapps/view/BlockLayoutCell.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/HorizontalLayout.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demokit/demoapps/view/BlockLayoutHeadlineCell.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/layout/BlockLayoutCell.js"],
"sap/ui/demokit/demoapps/view/BlockLayoutTeaserCell.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/Grid.js","sap/ui/layout/HorizontalLayout.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demokit/explored/Bootstrap.js":["jquery.sap.global.js","sap/m/Shell.js","sap/ui/core/ComponentContainer.js","sap/ui/demokit/explored/data.js","sap/ui/demokit/library.js"],
"sap/ui/demokit/explored/Component.js":["jquery.sap.global.js","sap/m/routing/RouteMatchedHandler.js","sap/ui/Device.js","sap/ui/core/UIComponent.js","sap/ui/core/mvc/View.js","sap/ui/demokit/explored/data.js","sap/ui/demokit/explored/util/MyRouter.js","sap/ui/demokit/explored/util/ToggleFullScreenHandler.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js"],
"sap/ui/demokit/explored/util/MyRouter.js":["sap/ui/core/Core.js","sap/ui/core/routing/History.js","sap/ui/core/routing/Router.js"],
"sap/ui/demokit/explored/util/ObjectSearch.js":["jquery.sap.global.js"],
"sap/ui/demokit/explored/view/app.controller.js":["jquery.sap.global.js","sap/ui/core/Component.js","sap/ui/core/Core.js","sap/ui/core/mvc/Controller.js"],
"sap/ui/demokit/explored/view/app.view.js":["sap/m/SplitApp.js","sap/ui/core/mvc/JSView.js"],
"sap/ui/demokit/explored/view/appSettingsDialog.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/core/Item.js","sap/ui/layout/Grid.js","sap/ui/layout/GridData.js"],
"sap/ui/demokit/explored/view/base.controller.js":["jquery.sap.global.js","jquery.sap.storage.js","sap/ui/core/mvc/Controller.js"],
"sap/ui/demokit/explored/view/code.controller.js":["jquery.sap.global.js","sap/ui/core/Component.js","sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js","sap/ui/core/routing/History.js","sap/ui/demokit/explored/data.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/explored/view/code.view.xml":["sap/ui/core/mvc/XMLView.js","sap/ui/demokit/CodeViewer.js","sap/ui/demokit/explored/view/code.controller.js"],
"sap/ui/demokit/explored/view/entity.controller.js":["jquery.sap.global.js","sap/ui/Device.js","sap/ui/core/Component.js","sap/ui/core/UIComponent.js","sap/ui/core/routing/History.js","sap/ui/demokit/EntityInfo.js","sap/ui/demokit/explored/data.js","sap/ui/demokit/explored/util/ObjectSearch.js","sap/ui/demokit/explored/util/ToggleFullScreenHandler.js","sap/ui/demokit/explored/view/base.controller.js","sap/ui/demokit/util/JSDocUtil.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/explored/view/entity.view.xml":["sap/ui/core/CustomData.js","sap/ui/core/HTML.js","sap/ui/core/mvc/XMLView.js","sap/ui/demokit/explored/view/entity.controller.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demokit/explored/view/master.controller.js":["jquery.sap.global.js","jquery.sap.storage.js","sap/m/GroupHeaderListItem.js","sap/ui/Device.js","sap/ui/core/Component.js","sap/ui/core/Fragment.js","sap/ui/core/UIComponent.js","sap/ui/demokit/explored/util/ToggleFullScreenHandler.js","sap/ui/demokit/explored/view/base.controller.js","sap/ui/model/Filter.js","sap/ui/model/Sorter.js"],
"sap/ui/demokit/explored/view/master.view.xml":["sap/ui/core/mvc/XMLView.js","sap/ui/demokit/explored/view/master.controller.js"],
"sap/ui/demokit/explored/view/notFound.controller.js":["sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/explored/view/notFound.view.xml":["sap/ui/core/mvc/XMLView.js","sap/ui/demokit/explored/view/notFound.controller.js"],
"sap/ui/demokit/explored/view/sample.controller.js":["jquery.sap.global.js","sap/m/Text.js","sap/m/library.js","sap/ui/Device.js","sap/ui/core/Component.js","sap/ui/core/ComponentContainer.js","sap/ui/core/HTML.js","sap/ui/core/UIComponent.js","sap/ui/core/routing/History.js","sap/ui/demokit/explored/data.js","sap/ui/demokit/explored/util/ToggleFullScreenHandler.js","sap/ui/demokit/explored/view/base.controller.js","sap/ui/fl/FakeLrepConnectorLocalStorage.js","sap/ui/fl/Utils.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demokit/explored/view/sample.view.xml":["sap/ui/core/mvc/XMLView.js","sap/ui/demokit/explored/view/sample.controller.js"],
"sap/ui/demokit/explored/view/viewSettingsDialog.fragment.xml":["sap/ui/core/Fragment.js"],
"sap/ui/demokit/explored/view/welcome.view.xml":["sap/ui/core/mvc/XMLView.js"],
"sap/ui/demokit/library.js":["jquery.sap.global.js","sap/ui/Global.js","sap/ui/core/Core.js","sap/ui/demokit/js/highlight-query-terms.js"],
"sap/ui/demokit/util/APIInfo.js":["jquery.sap.global.js"],
"sap/ui/demokit/util/JSDocUtil.js":["jquery.sap.global.js","jquery.sap.strings.js"],
"sap/ui/demokit/util/jsanalyzer/ASTUtils.js":["jquery.sap.global.js","sap/ui/demokit/js/esprima.js"],
"sap/ui/demokit/util/jsanalyzer/Doclet.js":["jquery.sap.global.js"],
"sap/ui/demokit/util/jsanalyzer/ModuleAnalyzer.js":["jquery.sap.global.js","sap/ui/base/ManagedObjectMetadata.js","sap/ui/demokit/js/esprima.js","sap/ui/demokit/util/jsanalyzer/ASTUtils.js","sap/ui/demokit/util/jsanalyzer/Doclet.js"]
*/
//# sourceMappingURL=library-h2-preload.js.map