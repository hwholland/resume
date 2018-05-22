sap.ui
		.controller(
				"flSmartFormOpa.view.S1",
				{

					onInit : function() {
						var sURL, oModel, oView, oMockServer, bLoadMetadataAsync, bUseMockServer;
						var sResourceUrl, sLocale, oResourceModel;
						sURL = "/uilib-sample/proxy/https/ldai3e91:44300/sap/opu/odata/SAP/FAC_FINANCIAL_DOCUMENT_SRV_01/";

						// set i18n resource model
						;
						sResourceUrl = "i18n/i18n.properties";
						sLocale = sap.ui.getCore().getConfiguration().getLanguage();
						oResourceModel = new sap.ui.model.resource.ResourceModel({
							bundleUrl : sResourceUrl,
							bundleLocale : sLocale
						});
						sap.ui.getCore().setModel(oResourceModel, "i18n");

						// set the mock server
						bLoadMetadataAsync = (jQuery.sap.getUriParameters().get("loadMetadataAsync") === "true");
						bUseMockServer = (jQuery.sap.getUriParameters().get("useMockServer") === "true");

						if (bUseMockServer) {
							jQuery.sap.require("sap.ui.core.util.MockServer");
							oMockServer = new sap.ui.core.util.MockServer({
								rootUri : sURL
							});
							oMockServer.simulate("mockserver/metadata.xml", "mockserver/");

							oMockServer.start();
						}

						oModel = new sap.ui.model.odata.v2.ODataModel(sURL, {
							json : true,
							loadMetadataAsync : bLoadMetadataAsync
						});
						oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
//						oModel.setCountSupported(false);
						this._oModel = oModel;

						oView = this.getView();
						oView.setModel(oModel);

//						oView.bindElement("/Headers(AccountingDocument='100015012',CompanyCode='0001',FiscalYear='2015')");
			             oModel.getMetaModel().loaded().then(function() {
			                    oView.bindElement("/Headers(AccountingDocument='100015012',CompanyCode='0001',FiscalYear='2015')");
			             });


						// oView.setBindingContext({
						// sPath : "/Headers(AccountingDocument='100015012',CompanyCode='0001',FiscalYear='2015')",
						// getPath : function() {
						// return this.sPath;
						// }
						// });

						// testing model
						var data = {
							readonly : false,
							mandatory : false,
							visible : true,
							enabled : true
						};

						var oStateModel = new sap.ui.model.json.JSONModel();
						oStateModel.setData(data);
						oView.setModel(oStateModel, "state");
					},

					onAfterRendering : function() {
						var oCore = sap.ui.getCore();
						oCore.byId("idMain1--S1View--MainForm").attachEvent("editToggled", function() {
							oCore.byId("__field1").setEnabled(true);
							oCore.byId("__field2").setEnabled(true);
							oCore.byId("__field3").setEnabled(true);
							oCore.byId("__field4").setEnabled(true);
							oCore.byId("__field5").setEnabled(true);
							oCore.byId("__field6").setEnabled(true);
							oCore.byId("__field8").setEnabled(true);
							oCore.byId("__field9").setEnabled(true);
						});

					},

					handleUpdate : function(oEvt) {
						var oModel = this._oModel;

						var mParams = {
							success : function(oResponse) {
								// debugger;
							},
							error : function(oResponse) {
								// debugger;
							}
						};
						// debugger;
						oModel.submitChanges(mParams.success, mParams.error);
					},

					handleUpdate1 : function(oEvt) {
						var oModel = this._oModel;
						var odata = {};

						var mParams = {
							success : function(oResponse) {
							},
							error : function(oResponse) {
							},
							context : "/Headers(AccountingDocument='100015012',CompanyCode='0001',FiscalYear='2015')"
						};

						odata["Entity_ReadOnly"] = oModel
								.getProperty("/Headers(AccountingDocument='100015012',CompanyCode='0001',FiscalYear='2015')") === "true";
						// odata["Description"] =
						// oModel.getProperty("/LineItemsSet(0.0.0.0.10.2.8.8.4.3.4.0.10.3.0.9.0.10.0.1.0.0._.1800000656202014112620141126000100120140000140000EURWILZBACH10000140000S))/Description");
						// odata["Name"] = oModel.getProperty("/Project(1)/Name");
						// odata["Description_Required"] = oModel.getProperty("/Project(1)/Description_Required");
						// odata["Description_ReadOnly"] = oModel.getProperty("/Project(1)/Description_ReadOnly");
						// odata["Description_Hidden"] = oModel.getProperty("/Project(1)/Description_Hidden");

						// oModel.update("/Project(1)", odata, mParams);

					}
				});
