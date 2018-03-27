/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.require([
	"sap/ui/core/sample/odata/v4/SalesOrders/tests/TypeDeterminationAndDelete",
	"sap/ui/test/opaQunit"
], function (TypeDeterminationAndDeleteTest, opaTest) {
	/*global QUnit */
	"use strict";

	QUnit.config.testTimeout = 180000;
	QUnit.module("sap.ui.core.sample.odata.v4.SalesOrders - Type Determination and Delete");

	//*****************************************************************************
	opaTest("Type Determination, Delete Sales Orders", function (Given, When, Then) {

		Given.iStartMyUIComponent({
			componentConfig : {
				name : "sap.ui.core.sample.odata.v4.SalesOrders"
			}
		});
		TypeDeterminationAndDeleteTest.typeDeterminationAndDelete(Given, When, Then);

		Then.iTeardownMyUIComponent();
	});
});
