jQuery.sap.require('sap.ui.generic.app.AppComponent');
jQuery.sap.require('sap.ui.core.util.MockServer');
jQuery.sap.require('sap.ui.core.util.DraftEnabledMockServer');

//Create on the fly component based on configuration in smartApp.json
jQuery.sap.declare("my.Component");

var oUriParameters = jQuery.sap.getUriParameters();
var sApp = oUriParameters.get("app") || false;
var sProject = jQuery.sap.getUriParameters().get("project") || false;
var bResponder = oUriParameters.get("responderOn") === "true";
var sDemoApp = oUriParameters.get("demoApp") || "products";
var bRTA = oUriParameters.get("rta") || false;
var bMockLog = oUriParameters.get("mockLog") || false;

console.log("mockLog:" + bMockLog)

//new parameter for session storage
var bSessionStorage = jQuery.sap.getUriParameters().get("use-session-storage");
if (bSessionStorage) {
	window['use-session-storage'] = true;
}
if (!sApp) {
	switch (sDemoApp) {
		case "salesorderdepr":
			sApp = "sap.suite.prototype.salesorder";
			sProject = "./sample.application";
			break;
		case "sttaproducts":
			sApp = "STTA_MP";
			sProject = "./sample.stta.manage.products/webapp";
			break;
		case "products":
			sApp = "ManageProductsNS";
			sProject = "./sample.manage.products/webapp";
			break;
		case "salesorder":
			sApp = "SalesOrdersNS";
			sProject = "./sample.sales.orders/webapp";
			break;
		default:
			sApp = "ManageProductsNS";
			sProject = "./sample.manage.products/webapp";
			break;
	}
}


jQuery.sap.registerModulePath(sApp, sProject);
if (bResponder) {
	jQuery.getJSON(sProject + "/manifest.json", function(data) {
		var manifest = data;
		startMockServers(sProject, manifest);

		sap.ui.getCore().attachInit(function() {
			//Fake LREP
			jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
			//Fake LREP Local Storage Patch
			jQuery.sap.require("sap.ui.rta.util.FakeLrepConnectorLocalStorage");
			jQuery.extend(sap.ui.fl.FakeLrepConnector.prototype, sap.ui.rta.util.FakeLrepConnectorLocalStorage);
			sap.ui.fl.FakeLrepConnector.enableFakeConnector("fakeLRep.json");
			start();
		});
	});
} else {
	start();
}

function start() {

	var oContainer = new sap.ui.core.ComponentContainer({
			name: sApp,
			height: "100%"
		}),
		oShell = new sap.m.Shell("Shell", {
			showLogout: false,
			appWidthLimited: false,
			app: oContainer,
			homeIcon: {
				'phone': 'img/57_iPhone_Desktop_Launch.png',
				'phone@2': 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet': 'img/72_iPad_Desktop_Launch.png',
				'tablet@2': 'img/144_iPad_Retina_Web_Clip.png',
				'favicon': 'img/favicon.ico',
				'precomposed': false
			}
		});

	if (bRTA) {
		var oBox = new sap.m.VBox({
			items: [
				new sap.m.Toolbar({
					content: [
						new sap.m.Button({
							text: "Adapt UI",
							tooltip: "Vendor Layer aka Level-0 is default. User url parameter sap-ui-layer to change",
							press: function(oEvent) {
								jQuery.sap.require("sap.ui.rta.RuntimeAuthoring");
								var oRta = new sap.ui.rta.RuntimeAuthoring({
									rootControl: oContainer.getComponentInstance()
										.getAggregation('rootControl')
								});
								oRta.start();
							}
						}),
						new sap.m.Button({
							text: "Reset",
							press: function(oEvent) {
								sap.ui.rta.util.FakeLrepConnectorLocalStorage.deleteChanges();
								location.reload();
							}
						})
					]
				}),
				oShell
			]
		}).placeAt('content');
	} else {
		oShell.placeAt('content');
	}
}

function makeCallbackFunction(path) {
	return function(oXHR) {
		oXHR.respondFile(200, {}, path);
	};
}

function startMockServers(appPath, manifest) {
	var iAutoRespond = (oUriParameters.get("serverDelay") || 1000),
		oMockServer, dataSource, sMockDataBaseUrl,
		oDataSources = manifest["sap.app"]["dataSources"],
		MockServer = sap.ui.core.util.MockServer;

	sap.ui.core.util.MockServer.config({
		autoRespond: true,
		autoRespondAfter: iAutoRespond
	});
	for (var property in oDataSources) {
		if (oDataSources.hasOwnProperty(property)) {
			dataSource = oDataSources[property];
			//do we have a mock url in the app descriptor
			if (dataSource.settings && dataSource.settings.localUri) {
				if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
					oMockServer = new MockServer({
						rootUri: dataSource.uri
					});
					sMockDataBaseUrl = dataSource.settings.localUri.split("/").slice(0, -1).join("/");
					oMockServer.simulate(appPath + "/" + dataSource.settings.localUri, {
						sMockdataBaseUrl: appPath + "/" + sMockDataBaseUrl,
						bGenerateMissingMockData: true
					});

					var aRequests = oMockServer.getRequests();					
					// Delete
					aRequests.push({
						method: 'DELETE',
						path: /STTA_C_MP_Product\(ProductDraftUUID=(.*),ActiveProduct=('HT-1003'|'HT-1020')\)/g,
						response: function (oXhr, oResponse) {
							oXhr.respondJSON(403, {}, '{"error": {"severity": "Error", "message": "no good"}}');
							return true;
						}
					});

					// push STTA_C_MP_ProductEdit
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductEdit\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
	  					response: function (oXhr, ProductDraftUUID, ActiveProduct) {
	  						var oResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductEdit",
	  							data : JSON.stringify({
	  								ProductDraftUUID: ProductDraftUUID,
	  								ActiveProduct: ActiveProduct
	  							})
	  						});
	  						if (oResponse) {
	  							return true;
	  						};
	  					}
					});
					
					// push STTA_C_MP_ProductPreparation
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductPreparation\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
	  					response: function (oXhr, ProductDraftUUID, ActiveProduct) {
	  						var oResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=ActiveProduct eq " + ActiveProduct,
	  							dataType : "json"
	  						});
	  					}
					});

					// push STTA_C_MP_ProductCopywithparams
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductCopywithparams\\?Supplier=(.*)&ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
						response: function (oXhr, Supplier, ProductDraftUUID, ActiveProduct) {
							
							if (!Supplier || !ProductDraftUUID || !ActiveProduct) {
								oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
								return true;
							}

							var oResponse = jQuery.sap.sjax({
								url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(ProductDraftUUID=" + ProductDraftUUID + ",ActiveProduct=" + ActiveProduct+")",
								dataType : "json"
							});
							oResponse.data.d.Supplier = Supplier;
							oResponse.data.d.ProductDraftUUID = "12345678-1234-0000-0000-000000000000";
							oXhr.respondJSON(200,{}, oResponse.data);
						}
					});

					// push STTA_C_MP_ProductActivation
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductActivation\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
	  					response: function (oXhr, ProductDraftUUID, ActiveProduct) {
	
	/* test 
	  						// All edit drafts - $filter=not IsActiveEntity and HasActiveEntity
	  						var oTResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=IsActiveEntity eq false and HasActiveEntity eq true",
	  							dataType : "json"
	  						});
	  						//  for edit draft the SiblingEntity points to the active document
	  						var sActiveSiblingUri = oTResponse.data.d.results[1].SiblingEntity.__deferred.uri;
	  						var sId = oTResponse.data.d.results[1].ActiveProduct;
	  						var sDraftId = oTResponse.data.d.results[1].ProductDraftUUID;
	  						oTResponse = jQuery.sap.sjax({
	  							url : sActiveSiblingUri,
	  							dataType : "json"
	  						});  						
	
	  						// New Draft test
	  						var oResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=IsActiveEntity eq false",
	  							dataType : "json"
	  						});
	test */  						
	
	  						// get draft version
	  						var oResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=IsActiveEntity eq false and HasActiveEntity eq true and ActiveProduct eq " + ActiveProduct,
	  							dataType : "json"
	  						});
	
	  						var oEditDraft = oResponse.data.d.results[0];
	
	  						oResponse = jQuery.sap.sjax({
	  							url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductActivation", // access to sibling not working
	  							type : 'POST',
	  							data : JSON.stringify({
	  								ProductDraftUUID: oEditDraft.ProductDraftUUID,
	  								ActiveProduct: oEditDraft.ActiveProduct
	  							})
	  						});
	  						
	  						if (oResponse && (oResponse.success))  {
	  							sap.m.MessageBox.success("Hello from item ACTIVATION!", {});
	  							oXhr.respond(204);
	  							return true;
	  						}
						}
					});
					// push STTA_C_MP_ProductCopy
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductCopy\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
						response: function (oXhr, ProductDraftUUID, ActiveProduct) {
							
							if (!ProductDraftUUID || !ActiveProduct) {
								oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
								return true;
							}

							var oResponse = jQuery.sap.sjax({
								url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(ProductDraftUUID=" + ProductDraftUUID + ",ActiveProduct=" + ActiveProduct+")",
								dataType : "json"
							});
							oResponse.data.d.ProductDraftUUID = "12345678-1234-0000-0000-000000000000";
							oXhr.respondJSON(200,{}, oResponse.data);
						}
					});
					// push STTA_C_MP_ProductCopyText
					aRequests.push({
						method: 'POST',
						path: new RegExp("STTA_C_MP_ProductCopyText\\?ProductTextDraftUUID=(.*)&ActiveProduct=(.*)&ActiveLanguage=(.*)"),
						response: function (oXhr, ProductTextDraftUUID, ActiveProduct, ActiveLanguage) {
							
							if (!ProductTextDraftUUID || !ActiveProduct || !ActiveLanguage) {
								oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
								return true;
							}

							ProductTextDraftUUID = "guid'00000000-0000-0000-0000-000000000000'";
							var oResponse = jQuery.sap.sjax({
								url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductText(ProductTextDraftUUID=" + ProductTextDraftUUID + ",ActiveProduct=" + ActiveProduct + ",ActiveLanguage=" + ActiveLanguage+")",
								dataType : "json"
							});
							oResponse.data.d.ProductTextDraftUUID = "12345678-1234-0000-0000-000000000000";
							oXhr.respondJSON(200,{}, oResponse.data);
						}
					});
					oMockServer.setRequests(aRequests);
					
				} else {
					oMockServer = new MockServer({
						requests: [{
							method: "GET",
							//TODO have MockServer fixed and pass just the URL!
							path: new RegExp(MockServer.prototype
								._escapeStringForRegExp(dataSource.uri)),
							response: makeCallbackFunction(appPath + "/" + dataSource.settings.localUri)
						}]
					});
				}
				oMockServer.start();
			}
		}
	}
}