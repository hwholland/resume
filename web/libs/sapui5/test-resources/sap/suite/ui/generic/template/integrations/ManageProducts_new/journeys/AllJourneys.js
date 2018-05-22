jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");

QUnit.config.autostart = false;
QUnit.config.testTimeout = 99999;

sap.ui.require(["sap/ui/test/Opa5",	"sap/suite/ui/generic/template/integrations/ManageProducts_new/pages/Common", 
                "sap/suite/ui/generic/template/integrations/ManageProducts_new/pages/ListReport",
                "sap/suite/ui/generic/template/integrations/ManageProducts_new/pages/ObjectPage"],
	function (Opa5, Common) {
		"use strict";
		
		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "sap.suite.ui.generic.template.demokit"
		});
	 
		sap.ui.require([
		        "sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ListReportRendering",
				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ListReportAndObjectPageNavigation",
				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ListReportFilter",
				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ListReportDelete",
				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ObjectPageRendering",
//				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ObjectPageEdit",
//				"sap/suite/ui/generic/template/integrations/ManageProducts_new/journeys/ObjectPageCreate"
		],
			function () {
				QUnit.start();
			}
		);
	}
);
 