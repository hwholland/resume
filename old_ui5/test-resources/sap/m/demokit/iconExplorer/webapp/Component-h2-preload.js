sap.ui.predefine('sap/ui/demo/iconexplorer/Component',["sap/ui/core/UIComponent","sap/ui/Device","sap/ui/demo/iconexplorer/model/models","sap/ui/demo/iconexplorer/model/IconModel","sap/ui/demo/iconexplorer/model/FavoriteModel","sap/ui/demo/iconexplorer/controller/ErrorHandler"],function(U,D,m,I,F,E){"use strict";return U.extend("sap.ui.demo.iconexplorer.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);var f=new F();this.setModel(f,"fav");var i=new I(this._oIconsLoadedPromise);this.setModel(i);i.iconsLoaded().then(function(){this._fnIconsLoadedResolve();}.bind(this));this.setModel(m.createDeviceModel(),"device");this._oErrorHandler=new E(this);this.getRouter().initialize();},iconsLoaded:function(){if(!this._oIconsLoadedPromise){this._oIconsLoadedPromise=new Promise(function(r,R){this._fnIconsLoadedResolve=r;this._fnIconsLoadedReject=R;}.bind(this));}return this._oIconsLoadedPromise;},destroy:function(){this._oErrorHandler.destroy();U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass="";}else if(!D.support.touch){this._sContentDensityClass="sapUiSizeCompact";}else{this._sContentDensityClass="sapUiSizeCozy";}}return this._sContentDensityClass;}});});
jQuery.sap.registerPreloadedModules({
"name":"sap/ui/demo/iconexplorer/Component-h2-preload",
"version":"2.0",
"modules":{
	"sap/ui/demo/iconexplorer/manifest.json":'{"_version":"1.8.0","sap.app":{"id":"sap.ui.demo.iconexplorer","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://image-viewer","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.iconexplorer.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.36.0","libs":{"sap.ui.core":{"minVersion":"1.36.0"},"sap.m":{"minVersion":"1.36.0"},"sap.ui.layout":{"minVersion":"1.36.0"}}},"resources":{"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.iconexplorer.i18n.i18n"}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.iconexplorer.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":":?query:","name":"overview","target":["overview"]}],"targets":{"overview":{"viewName":"Overview","viewId":"overview","viewLevel":1},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}}}'
}});
/* Bundle format 'h2' not supported (requires ui5loader)
"sap/ui/demo/iconexplorer/Component.js":["sap/ui/Device.js","sap/ui/core/UIComponent.js","sap/ui/demo/iconexplorer/controller/ErrorHandler.js","sap/ui/demo/iconexplorer/model/FavoriteModel.js","sap/ui/demo/iconexplorer/model/IconModel.js","sap/ui/demo/iconexplorer/model/models.js"],
"sap/ui/demo/iconexplorer/controller/App.controller.js":["sap/ui/demo/iconexplorer/controller/BaseController.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/controller/BaseController.js":["sap/ui/core/mvc/Controller.js"],
"sap/ui/demo/iconexplorer/controller/ErrorHandler.js":["sap/m/MessageBox.js","sap/ui/base/Object.js"],
"sap/ui/demo/iconexplorer/controller/NotFound.controller.js":["sap/ui/demo/iconexplorer/controller/BaseController.js"],
"sap/ui/demo/iconexplorer/controller/Overview.controller.js":["jquery.sap.global.js","sap/m/Label.js","sap/m/MessageToast.js","sap/m/ToggleButton.js","sap/m/library.js","sap/ui/Device.js","sap/ui/core/IconPool.js","sap/ui/demo/iconexplorer/controller/BaseController.js","sap/ui/demo/iconexplorer/model/formatter.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/localService/mockserver.js":["jquery.sap.global.js","sap/ui/model/json/JSONModel.js","sap/ui/thirdparty/sinon.js"],
"sap/ui/demo/iconexplorer/model/FavoriteModel.js":["jquery.sap.storage.js","sap/ui/demo/iconexplorer/model/Sorter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/model/IconModel.js":["jquery.sap.global.js","sap/ui/core/IconPool.js","sap/ui/demo/iconexplorer/model/Sorter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/model/formatter.js":["jquery.sap.global.js"],
"sap/ui/demo/iconexplorer/model/models.js":["sap/ui/Device.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/view/App.view.xml":["sap/m/App.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/App.controller.js"],
"sap/ui/demo/iconexplorer/view/NotFound.view.xml":["sap/m/Link.js","sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/NotFound.controller.js"],
"sap/ui/demo/iconexplorer/view/Overview.view.xml":["sap/m/Button.js","sap/m/ComboBox.js","sap/m/FlexBox.js","sap/m/FlexItemData.js","sap/m/FormattedText.js","sap/m/GenericTile.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/IconTabSeparator.js","sap/m/Input.js","sap/m/Label.js","sap/m/NumericContent.js","sap/m/ObjectAttribute.js","sap/m/OverflowToolbar.js","sap/m/Panel.js","sap/m/ScrollContainer.js","sap/m/SearchField.js","sap/m/StandardListItem.js","sap/m/Text.js","sap/m/TileContent.js","sap/m/Token.js","sap/m/Tokenizer.js","sap/m/ToolbarSpacer.js","sap/m/semantic/FullscreenPage.js","sap/ui/core/Icon.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/Overview.controller.js","sap/ui/layout/BlockLayout.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/BlockLayoutRow.js","sap/ui/layout/FixFlex.js","sap/ui/layout/PaneContainer.js","sap/ui/layout/ResponsiveSplitter.js","sap/ui/layout/SplitPane.js","sap/ui/layout/SplitterLayoutData.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Details.fragment.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/RatingIndicator.js","sap/m/Table.js","sap/m/Text.js","sap/m/Token.js","sap/m/Tokenizer.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/HorizontalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Favorites.fragment.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/RatingIndicator.js","sap/m/Table.js","sap/m/Text.js","sap/m/Token.js","sap/m/Tokenizer.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js"],
"sap/ui/demo/iconexplorer/view/browse/Grid.fragment.xml":["sap/m/CustomListItem.js","sap/m/Label.js","sap/m/List.js","sap/m/RatingIndicator.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Visual.fragment.xml":["sap/m/CustomListItem.js","sap/m/Label.js","sap/m/List.js","sap/m/RatingIndicator.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/VerticalLayout.js"]
*/
//# sourceMappingURL=Component-h2-preload.js.map