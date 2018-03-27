/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
sap.ui.define(['sap/base/util/hashCode'], function(hashCode) {
	"use strict";

	QUnit.module("sap.base.util.hashCode");

	QUnit.test("empty string", function(assert) {
		var s = "";
		assert.equal(hashCode(s), 0, "empty string hash-code is 0");
	});

	QUnit.test("equality", function(assert) {
		var s = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...";
		assert.strictEqual(hashCode(s), hashCode(s), "same string - same hash-code");
	});

	QUnit.test("inequality", function(assert) {
		var s = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...";
		assert.notEqual(hashCode(s), hashCode(s + "."), "different string - different hash-code");
	});

});