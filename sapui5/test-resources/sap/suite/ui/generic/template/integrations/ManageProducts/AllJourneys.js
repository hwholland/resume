// ManageProducts AllJournes x
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.pages.Common");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.pages.Main");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.pages.Detail");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.pages.Item");

sap.ui.test.Opa5.extendConfig({
	arrangements: new sap.suite.ui.generic.template.integrations.ManageProducts.pages.Common(),
	autoWait: true,
	viewNamespace: "sap.suite.ui.generic.template.demokit"
});


jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.MainJourneyButtons");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.MainJourneyFilters");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.MainJourneySettingsPopup");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.MainJourneySettingsPopupCheck");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyButtons");

jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyCheckDeletion");
//jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyDraftResumeFunctionality");
//jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyDraftDiscardFunctionality");

/*jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyForLockedIcon");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.ItemJourneyForLockedIcon");*/
/*jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyDraftResumeFunctionality");
jQuery.sap.require("sap.suite.ui.generic.template.integrations.ManageProducts.DetailJourneyDraftDiscardFunctionality");*/

// increase timeout, default 30000 is not enough
QUnit.config.testTimeout = 99999;
