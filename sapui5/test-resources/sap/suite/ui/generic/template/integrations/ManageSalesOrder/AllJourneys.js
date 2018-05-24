jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Common");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Main");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Detail");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Item");

sap.ui.test.Opa5.extendConfig({
	arrangements: new sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Common(),
	viewNamespace: "sap.suite.ui.generic.template.demokit"
});

/*jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.MainJourney");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.DetailJourney");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.ItemJourney");*/


jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.MainJourneyButtons");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.MainJourneyFilters");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.MainJourneySettingsPopup");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.DetailJourneyButtons");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageSalesOrder.DetailJourneyCheckDeletion");