/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.require([
	"sap/ui/core/sample/odata/v4/SalesOrders/tests/WriteNonDeferredGroup",
	"sap/ui/test/opaQunit"
], function (WriteNonDeferredGroupTest, opaTest) {
	/*global QUnit */
	"use strict";

	QUnit.module("sap.ui.core.sample.odata.v4.SalesOrders - " +
		"Write via application groups with SubmitMode.Auto/.Direct");

	//*****************************************************************************
	["myAutoGroup", "$auto", "myDirectGroup", "$direct"].forEach(function (sGroupId) {
		opaTest("POST/PATCH SalesOrder via group: " + sGroupId, function (Given, When, Then) {

			Given.iStartMyUIComponent({
				componentConfig : {
					name : "sap.ui.core.sample.odata.v4.SalesOrdersRTATest"
				}
			});

			WriteNonDeferredGroupTest.writeNonDeferredGroup(Given, When, Then, sGroupId);

			Then.iTeardownMyUIComponent();
		});
	});
});