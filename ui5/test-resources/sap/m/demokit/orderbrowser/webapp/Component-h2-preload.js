sap.ui.predefine('sap/ui/demo/orderbrowser/Component',["sap/ui/core/UIComponent","sap/ui/Device","sap/ui/demo/orderbrowser/model/models","sap/ui/demo/orderbrowser/controller/ListSelector","sap/ui/demo/orderbrowser/controller/ErrorHandler"],function(U,D,m,L,E){"use strict";return U.extend("sap.ui.demo.orderbrowser.Component",{metadata:{manifest:"json"},init:function(){this.oListSelector=new L();this._oErrorHandler=new E(this);this.setModel(m.createDeviceModel(),"device");U.prototype.init.apply(this,arguments);this.getRouter().initialize();},destroy:function(){this.oListSelector.destroy();this._oErrorHandler.destroy();U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass="";}else if(!D.support.touch){this._sContentDensityClass="sapUiSizeCompact";}else{this._sContentDensityClass="sapUiSizeCozy";}}return this._sContentDensityClass;}});});
jQuery.sap.registerPreloadedModules({
"name":"sap/ui/demo/orderbrowser/Component-h2-preload",
"version":"2.0",
"modules":{
	"sap/ui/demo/orderbrowser/manifest.json":'{"_version":"1.8.0","sap.app":{"id":"sap.ui.demo.orderbrowser","type":"application","resources":"resources.json","i18n":"i18n/i18n.properties","title":"Order Browser","description":"Demo app using the master-detail pattern, allowing to browse through a list of orders","applicationVersion":{"version":"1.0.0"},"dataSources":{"mainService":{"uri":"/here/goes/your/serviceUrl/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"sourceTemplate":{"id":"sap.ui.ui5-template-plugin.2masterdetail","version":"1.38.3"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://detail-view","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.orderbrowser.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.38.0","libs":{"sap.ui.core":{"minVersion":"1.38.0"},"sap.m":{"minVersion":"1.38.0"},"sap.ui.layout":{"minVersion":"1.38.0"}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.orderbrowser.i18n.i18n"}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.orderbrowser.view","controlId":"idAppControl","controlAggregation":"detailPages","bypassed":{"target":["master","notFound"]},"async":true},"routes":[{"pattern":"","name":"master","target":["object","master"]},{"pattern":"Orders/{objectId}/:?query:","name":"object","target":["master","object"]}],"targets":{"master":{"viewName":"Master","viewLevel":1,"viewId":"master","controlAggregation":"masterPages"},"object":{"viewName":"Detail","viewId":"detail","viewLevel":2},"detailObjectNotFound":{"viewName":"DetailObjectNotFound","viewId":"detailObjectNotFound"},"detailNoObjectsAvailable":{"viewName":"DetailNoObjectsAvailable","viewId":"detailNoObjectsAvailable"},"notFound":{"viewName":"NotFound","viewId":"notFound"},"shipping":{"viewName":"Shipping","parent":"object","controlId":"iconTabFilterShipping","controlAggregation":"content"},"processor":{"viewName":"Processor","parent":"object","controlId":"iconTabFilterProcessor","controlAggregation":"content"}}}}}'
}});
/* Bundle format 'h2' not supported (requires ui5loader)
"sap/ui/demo/orderbrowser/Component.js":["sap/ui/Device.js","sap/ui/core/UIComponent.js","sap/ui/demo/orderbrowser/controller/ErrorHandler.js","sap/ui/demo/orderbrowser/controller/ListSelector.js","sap/ui/demo/orderbrowser/model/models.js"],
"sap/ui/demo/orderbrowser/controller/App.controller.js":["sap/ui/demo/orderbrowser/controller/BaseController.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/orderbrowser/controller/BaseController.js":["sap/ui/core/mvc/Controller.js","sap/ui/core/routing/History.js"],
"sap/ui/demo/orderbrowser/controller/Detail.controller.js":["sap/ui/demo/orderbrowser/controller/BaseController.js","sap/ui/demo/orderbrowser/model/formatter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/orderbrowser/controller/ErrorHandler.js":["sap/m/MessageBox.js","sap/ui/base/Object.js"],
"sap/ui/demo/orderbrowser/controller/ListSelector.js":["sap/ui/base/Object.js"],
"sap/ui/demo/orderbrowser/controller/Master.controller.js":["sap/m/GroupHeaderListItem.js","sap/ui/Device.js","sap/ui/demo/orderbrowser/controller/BaseController.js","sap/ui/demo/orderbrowser/model/GroupState.js","sap/ui/demo/orderbrowser/model/formatter.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/orderbrowser/localService/mockserver.js":["sap/ui/core/util/MockServer.js"],
"sap/ui/demo/orderbrowser/model/GroupState.js":["sap/ui/base/Object.js","sap/ui/core/format/DateFormat.js","sap/ui/model/Sorter.js"],
"sap/ui/demo/orderbrowser/model/formatter.js":["sap/ui/model/type/Currency.js"],
"sap/ui/demo/orderbrowser/model/models.js":["sap/ui/Device.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/orderbrowser/view/App.view.xml":["sap/m/SplitApp.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/App.controller.js"],
"sap/ui/demo/orderbrowser/view/Detail.view.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/ObjectAttribute.js","sap/m/ObjectHeader.js","sap/m/ObjectIdentifier.js","sap/m/ObjectNumber.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/Toolbar.js","sap/m/semantic/DetailPage.js","sap/m/semantic/SendEmailAction.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/Detail.controller.js"],
"sap/ui/demo/orderbrowser/view/DetailNoObjectsAvailable.view.xml":["sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/BaseController.controller.js"],
"sap/ui/demo/orderbrowser/view/DetailObjectNotFound.view.xml":["sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/BaseController.controller.js"],
"sap/ui/demo/orderbrowser/view/Master.view.xml":["sap/m/Bar.js","sap/m/List.js","sap/m/ObjectAttribute.js","sap/m/ObjectListItem.js","sap/m/ObjectStatus.js","sap/m/PullToRefresh.js","sap/m/SearchField.js","sap/m/Title.js","sap/m/Toolbar.js","sap/m/semantic/FilterSelect.js","sap/m/semantic/GroupSelect.js","sap/m/semantic/MasterPage.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/Master.controller.js"],
"sap/ui/demo/orderbrowser/view/NotFound.view.xml":["sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/BaseController.controller.js"],
"sap/ui/demo/orderbrowser/view/Processor.view.xml":["sap/m/Image.js","sap/m/Label.js","sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Title.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/orderbrowser/controller/Detail.controller.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ui/demo/orderbrowser/view/Shipping.view.xml":["sap/m/Label.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js"]
*/
//# sourceMappingURL=Component-h2-preload.js.map