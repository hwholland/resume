sap.ui.predefine('sap/ui/demo/worklist/Component',["sap/ui/core/UIComponent","sap/ui/Device","sap/ui/demo/worklist/model/models","sap/ui/demo/worklist/controller/ErrorHandler"],function(U,D,m,E){"use strict";return U.extend("sap.ui.demo.worklist.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);this._oErrorHandler=new E(this);this.setModel(m.createDeviceModel(),"device");this.getRouter().initialize();},destroy:function(){this._oErrorHandler.destroy();U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass="";}else if(!D.support.touch){this._sContentDensityClass="sapUiSizeCompact";}else{this._sContentDensityClass="sapUiSizeCozy";}}return this._sContentDensityClass;}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/App.controller',["sap/ui/demo/worklist/controller/BaseController","sap/ui/model/json/JSONModel"],function(B,J){"use strict";return B.extend("sap.ui.demo.worklist.controller.App",{onInit:function(){var v,s,o=this.getView().getBusyIndicatorDelay();v=new J({busy:true,delay:0});this.setModel(v,"appView");s=function(){v.setProperty("/busy",false);v.setProperty("/delay",o);};this.getOwnerComponent().getModel().metadataLoaded().then(s);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/BaseController',["sap/ui/core/mvc/Controller"],function(C){"use strict";return C.extend("sap.ui.demo.worklist.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this);},getModel:function(n){return this.getView().getModel(n);},setModel:function(m,n){return this.getView().setModel(m,n);},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle();},onShareEmailPress:function(){var v=(this.getModel("objectView")||this.getModel("worklistView"));sap.m.URLHelper.triggerEmail(null,v.getProperty("/shareSendEmailSubject"),v.getProperty("/shareSendEmailMessage"));}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/ErrorHandler',["sap/ui/base/Object","sap/m/MessageBox"],function(U,M){"use strict";return U.extend("sap.ui.demo.worklist.controller.ErrorHandler",{constructor:function(c){this._oResourceBundle=c.getModel("i18n").getResourceBundle();this._oComponent=c;this._oModel=c.getModel();this._bMessageOpen=false;this._sErrorText=this._oResourceBundle.getText("errorText");this._oModel.attachMetadataFailed(function(e){var p=e.getParameters();this._showServiceError(p.response);},this);this._oModel.attachRequestFailed(function(e){var p=e.getParameters();if(p.response.statusCode!=="404"||(p.response.statusCode===404&&p.response.responseText.indexOf("Cannot POST")===0)){this._showServiceError(p.response);}},this);},_showServiceError:function(d){if(this._bMessageOpen){return;}this._bMessageOpen=true;M.error(this._sErrorText,{id:"serviceErrorMessageBox",details:d,styleClass:this._oComponent.getContentDensityClass(),actions:[M.Action.CLOSE],onClose:function(){this._bMessageOpen=false;}.bind(this)});}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/NotFound.controller',["sap/ui/demo/worklist/controller/BaseController"],function(B){"use strict";return B.extend("sap.ui.demo.worklist.controller.NotFound",{onLinkPressed:function(){this.getRouter().navTo("worklist");}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/Object.controller',["sap/ui/demo/worklist/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","sap/ui/demo/worklist/model/formatter"],function(B,J,H,f){"use strict";return B.extend("sap.ui.demo.worklist.controller.Object",{formatter:f,onInit:function(){var o,v=new J({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);o=this.getView().getBusyIndicatorDelay();this.setModel(v,"objectView");this.getOwnerComponent().getModel().metadataLoaded().then(function(){v.setProperty("/delay",o);});},onNavBack:function(){var p=H.getInstance().getPreviousHash();if(p!==undefined){history.go(-1);}else{this.getRouter().navTo("worklist",{},true);}},_onObjectMatched:function(e){var o=e.getParameter("arguments").objectId;this.getModel().metadataLoaded().then(function(){var O=this.getModel().createKey("Objects",{ObjectID:o});this._bindView("/"+O);}.bind(this));},_bindView:function(o){var v=this.getModel("objectView"),d=this.getModel();this.getView().bindElement({path:o,events:{change:this._onBindingChange.bind(this),dataRequested:function(){d.metadataLoaded().then(function(){v.setProperty("/busy",true);});},dataReceived:function(){v.setProperty("/busy",false);}}});},_onBindingChange:function(){var v=this.getView(),V=this.getModel("objectView"),e=v.getElementBinding();if(!e.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return;}var r=this.getResourceBundle(),o=v.getBindingContext().getObject(),O=o.ObjectID,s=o.Name;V.setProperty("/busy",false);V.setProperty("/shareSendEmailSubject",r.getText("shareSendEmailObjectSubject",[O]));V.setProperty("/shareSendEmailMessage",r.getText("shareSendEmailObjectMessage",[s,O,location.href]));}});});
sap.ui.predefine('sap/ui/demo/worklist/controller/Worklist.controller',["sap/ui/demo/worklist/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/demo/worklist/model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(B,J,f,F,a){"use strict";return B.extend("sap.ui.demo.worklist.controller.Worklist",{formatter:f,onInit:function(){var v,o,t=this.byId("table");o=t.getBusyIndicatorDelay();this._oTableSearchState=[];v=new J({worklistTableTitle:this.getResourceBundle().getText("worklistTableTitle"),saveAsTileTitle:this.getResourceBundle().getText("saveAsTileTitle",this.getResourceBundle().getText("worklistViewTitle")),shareOnJamTitle:this.getResourceBundle().getText("worklistTitle"),shareSendEmailSubject:this.getResourceBundle().getText("shareSendEmailWorklistSubject"),shareSendEmailMessage:this.getResourceBundle().getText("shareSendEmailWorklistMessage",[location.href]),tableNoDataText:this.getResourceBundle().getText("tableNoDataText"),tableBusyDelay:0});this.setModel(v,"worklistView");t.attachEventOnce("updateFinished",function(){v.setProperty("/tableBusyDelay",o);});},onUpdateFinished:function(e){var t,T=e.getSource(),i=e.getParameter("total");if(i&&T.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCount",[i]);}else{t=this.getResourceBundle().getText("worklistTableTitle");}this.getModel("worklistView").setProperty("/worklistTableTitle",t);},onPress:function(e){this._showObject(e.getSource());},onNavBack:function(){history.go(-1);},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh();}else{var t=[];var q=e.getParameter("query");if(q&&q.length>0){t=[new F("Name",a.Contains,q)];}this._applySearch(t);}},onRefresh:function(){var t=this.byId("table");t.getBinding("items").refresh();},_showObject:function(i){this.getRouter().navTo("object",{objectId:i.getBindingContext().getProperty("ObjectID")});},_applySearch:function(t){var T=this.byId("table"),v=this.getModel("worklistView");T.getBinding("items").filter(t,"Application");if(t.length!==0){v.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"));}}});});
sap.ui.predefine('sap/ui/demo/worklist/localService/mockserver',["sap/ui/core/util/MockServer"],function(M){"use strict";var m,_="sap/ui/demo/worklist/",a=_+"localService/mockdata";return{init:function(){var u=jQuery.sap.getUriParameters(),j=jQuery.sap.getModulePath(a),s=jQuery.sap.getModulePath(_+"manifest",".json"),e="Objects",E=u.get("errorType"),i=E==="badRequest"?400:500,o=jQuery.sap.syncGetJSON(s).data,b=o["sap.app"].dataSources.mainService,c=jQuery.sap.getModulePath(_+b.settings.localUri.replace(".xml",""),".xml"),d=/.*\/$/.test(b.uri)?b.uri:b.uri+"/";m=new M({rootUri:d,recordRequests:false});M.config({autoRespond:true,autoRespondAfter:(u.get("serverDelay")||1000)});m.simulate(c,{sMockdataBaseUrl:j,bGenerateMissingMockData:true});var r=m.getRequests(),R=function(f,g,h){h.response=function(x){x.respond(f,{"Content-Type":"text/plain;charset=utf-8"},g);};};if(u.get("metadataError")){r.forEach(function(f){if(f.path.toString().indexOf("$metadata")>-1){R(500,"metadata Error",f);}});}if(E){r.forEach(function(f){if(f.path.toString().indexOf(e)>-1){R(i,E,f);}});}m.start();jQuery.sap.log.info("Running the app with mock data");},getMockServer:function(){return m;}};});
sap.ui.predefine('sap/ui/demo/worklist/model/formatter',[],function(){"use strict";return{numberUnit:function(v){if(!v){return"";}return parseFloat(v).toFixed(2);}};});
sap.ui.predefine('sap/ui/demo/worklist/model/models',["sap/ui/model/json/JSONModel","sap/ui/Device"],function(J,D){"use strict";return{createDeviceModel:function(){var m=new J(D);m.setDefaultBindingMode("OneWay");return m;}};});
jQuery.sap.registerPreloadedModules({
"name":"sap/ui/demo/worklist/Component-preload",
"version":"2.0",
"modules":{
	"sap/ui/demo/worklist/i18n/i18n.properties":'#\n#Mon Mar 12 12:04:54 UTC 2018\ntableNameColumnTitle=Name\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id\\: {1})\\r\\n{2}\nnotFoundText=The requested resource was not found\ntableUnitNumberColumnTitle=UnitNumber\nnoObjectsAvailableText=No Objects are currently available\nworklistViewTitle=Manage Objects\ntableNoDataText=No Objects are currently available\nappTitle=Worklist\nworklistTableTitle=Objects\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\nobjectViewTitle=Objects Details\nworklistNoDataWithSearchText=No matching Objects found\nnotFoundTitle=Not Found\nworklistTableTitleCount=Objects ({0})\nappDescription=A template for Worklist applications\nworklistTitle=Worklist\nshareSendEmailWorklistSubject=<Email subject PLEASE REPLACE ACCORDING TO YOUR USE CASE>\nerrorText=Sorry, a technical error occurred\\! Please try again later.\nnoObjectFoundText=This Objects is not available\nbackToWorklist=Show Worklist\nobjectTitle=Objects\nworklistSearchTooltip=Enter an Objects name or a part of it.\nshareSendEmailWorklistMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE>\\r\\n{0}\n',
	"sap/ui/demo/worklist/manifest.json":'{"_version":"1.8.0","sap.app":{"id":"sap.ui.demo.worklist","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"dataSources":{"mainService":{"uri":"/here/goes/your/serviceUrl/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.worklist.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.42.0","libs":{"sap.ui.core":{"minVersion":"1.42.0"},"sap.m":{"minVersion":"1.42.0"}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.worklist.i18n.i18n"}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.worklist.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":"","name":"worklist","target":["worklist"]},{"pattern":"Objects/{objectId}","name":"object","target":["object"]}],"targets":{"worklist":{"viewName":"Worklist","viewId":"worklist","viewLevel":1,"title":"{i18n>worklistViewTitle}"},"object":{"viewName":"Object","viewId":"object","viewLevel":2,"title":"{i18n>objectViewTitle}"},"objectNotFound":{"viewName":"ObjectNotFound","viewId":"objectNotFound"},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}}}',
	"sap/ui/demo/worklist/view/App.view.xml":'<mvc:View\n\txmlns:mvc="sap.ui.core.mvc"\n\tcontrollerName="sap.ui.demo.worklist.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m">\n\n\t<App id="app"\n\t\t busy="{appView>/busy}"\n\t\t busyIndicatorDelay="{appView>/delay}"/>\n\n</mvc:View>',
	"sap/ui/demo/worklist/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.worklist.controller.NotFound"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m">\n\n\t<MessagePage\n\t\ttitle="{i18n>notFoundTitle}"\n\t\ttext="{i18n>notFoundText}"\n\t\ticon="sap-icon://document"\n\t\tid="page"\n\t\tdescription="">\n\t\t<customDescription>\n\t\t\t<Link id="link" text="{i18n>backToWorklist}" press="onLinkPressed" />\n\t\t</customDescription>\n\t</MessagePage>\n\n</mvc:View>',
	"sap/ui/demo/worklist/view/Object.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.worklist.controller.Object"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.m.semantic">\n\n\t<semantic:FullscreenPage\n\t\tid="page"\n\t\tsemanticRuleSet="Optimized"\n\t\tnavButtonPress="onNavBack"\n\t\tshowNavButton="true"\n\t\ttitle="{i18n>objectTitle}"\n\t\tbusy="{objectView>/busy}"\n\t\tbusyIndicatorDelay="{objectView>/delay}">\n\n\t\t<semantic:content>\n\t\t\t<ObjectHeader\n\t\t\t\tid="objectHeader"\n\t\t\t\ttitle="{Name}"\n\t\t\t\tnumber="{\n\t\t\t\t\t\t\tpath: \'UnitNumber\',\n\t\t\t\t\t\t\tformatter: \'.formatter.numberUnit\'\n\t\t\t\t}"\n\t\t\t\tnumberUnit="{UnitOfMeasure}">\n\t\t\t</ObjectHeader>\n \t\t</semantic:content>\n\n\t\t<semantic:sendEmailAction>\n\t\t\t<semantic:SendEmailAction id="shareEmail" press="onShareEmailPress"/>\n\t\t</semantic:sendEmailAction>\n\n\n\t</semantic:FullscreenPage>\n\n</mvc:View>',
	"sap/ui/demo/worklist/view/ObjectNotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.worklist.controller.NotFound"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m">\n\n\t<MessagePage\n\t\ttitle="{i18n>objectTitle}"\n\t\ttext="{i18n>noObjectFoundText}"\n\t\ticon="sap-icon://product"\n\t\tdescription=""\n\t\tid="page">\n\t\t<customDescription>\n\t\t\t<Link id="link" text="{i18n>backToWorklist}" press="onLinkPressed" />\n\t\t</customDescription>\n\t</MessagePage>\n\n</mvc:View>',
	"sap/ui/demo/worklist/view/Worklist.view.xml":'<mvc:View\n\tcontrollerName="sap.ui.demo.worklist.controller.Worklist"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.m.semantic">\n\n\t<semantic:FullscreenPage\n\t\tid="page"\n\t\tsemanticRuleSet="Optimized"\n\t\tnavButtonPress="onNavBack"\n\t\tshowNavButton="true"\n\t\ttitle="{i18n>worklistTitle}">\n\t\t<semantic:content>\n\t\t\t<Table\n\t\t\t\tid="table"\n\t\t\t\twidth="auto"\n\t\t\t\tclass="sapUiResponsiveMargin"\n\t\t\t\titems="{\n\t\t\t\t\tpath: \'/Objects\',\n\t\t\t\t\tsorter: {\n\t\t\t\t\t\tpath: \'Name\',\n\t\t\t\t\t\tdescending: false\n\t\t\t\t\t}\n\t\t\t\t}"\n\t\t\t\tnoDataText="{worklistView>/tableNoDataText}"\n\t\t\t\tbusyIndicatorDelay="{worklistView>/tableBusyDelay}"\n\t\t\t\tgrowing="true"\n\t\t\t\tgrowingScrollToLoad="true"\n\t\t\t\tupdateFinished="onUpdateFinished">\n\n\t\t\t\t<headerToolbar>\n\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t<Title id="tableHeader" text="{worklistView>/worklistTableTitle}"/>\n\t\t\t\t\t\t<ToolbarSpacer />\n\t\t\t\t\t\t<SearchField\n\t\t\t\t\t\t\tid="searchField"\n\t\t\t\t\t\t\ttooltip="{i18n>worklistSearchTooltip}"\n\t\t\t\t\t\t\tsearch="onSearch"\n\t\t\t\t\t\t\twidth="auto">\n\t\t\t\t\t\t</SearchField>\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\n\t\t\t\t<columns>\n\t\t\t\t\t<Column id="nameColumn">\n\t\t\t\t\t\t<Text text="{i18n>tableNameColumnTitle}" id="nameColumnTitle"/>\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column id="unitNumberColumn" hAlign="End">\n\t\t\t\t\t\t<Text text="{i18n>tableUnitNumberColumnTitle}" id="unitNumberColumnTitle"/>\n\t\t\t\t\t</Column>\n\t\t\t\t</columns>\n\n\t\t\t\t<items>\n\t\t\t\t\t<ColumnListItem\n\t\t\t\t\t\ttype="Navigation"\n\t\t\t\t\t\tpress="onPress">\n\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t<ObjectIdentifier\n\t\t\t\t\t\t\t\ttitle="{Name}"/>\n\t\t\t\t\t\t\t<ObjectNumber\n\t\t\t\t\t\t\t\tnumber="{\n\t\t\t\t\t\t\t\t\tpath: \'UnitNumber\',\n\t\t\t\t\t\t\t\t\tformatter: \'.formatter.numberUnit\'\n\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\tunit="{UnitOfMeasure}"/>\n\t\t\t\t\t\t</cells>\n\t\t\t\t\t</ColumnListItem>\n\t\t\t\t</items>\n\t\t\t</Table>\n\t\t</semantic:content>\n\n\t\t<semantic:sendEmailAction>\n\t\t\t<semantic:SendEmailAction id="shareEmail" press="onShareEmailPress"/>\n\t\t</semantic:sendEmailAction>\n\n\n\t</semantic:FullscreenPage>\n\n</mvc:View>'
}});
//# sourceMappingURL=Component-preload.js.map