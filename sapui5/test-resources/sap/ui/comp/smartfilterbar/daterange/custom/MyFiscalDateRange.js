/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides sap.ui.comp.config.condition.DateRangeType.
sap.ui.define([
	'jquery.sap.global', 'sap/ui/comp/config/condition/DateRangeType'],
	function(jQuery, DateRangeType) {
	"use strict";

	var MyFiscalDateRange = DateRangeType.extend("custom.MyFiscalDateRange", /** @lends sap.ui.comp.config.condition.MyFiscalDateRange.prototype */ {
		constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
			DateRangeType.apply(this, [
				sFieldName, oFilterProvider, oFieldViewMetadata
			]);
			this.setAsync(true);
			this.setPending(true);
		}
	});
	MyFiscalDateRange.Operations = {};

	MyFiscalDateRange.initializeOperations = function() {
		for (var i = 0; i < 4; i++) {
			MyFiscalDateRange.Operations["FISCALPERIOD" + i] = DateRangeType.getFixedRangeOperation(
				"FISCALPERIOD" + i,
				{
					key: "FISCALPERIOD" + i +"_TEXT_KEY",
					bundle: "sap.ui.comp"
				},
				"FISCAL");
		}
	};

	MyFiscalDateRange.initializeOperations();

	MyFiscalDateRange.prototype.providerDataUpdated = function(aFieldNames, oData) {
		DateRangeType.prototype.providerDataUpdated.apply(this, arguments);
		
		var sField = "Bukrs";
		if (aFieldNames.indexOf(sField) > -1) {
			var aItems = oData[sField] ? oData[sField].items : null,
				aRanges = oData[sField] ? oData[sField].ranges : null;
			if (aItems && aItems.length === 1) {
				//fetch fiscal data
				this.setPending(true);
				if (aItems[0].key === "0001") {
					jQuery.sap.delayedCall(2000,this,"updateFiscalPeriods",[[
						[new Date("2015-01-15T00:00:00.000Z"), new Date("2015-04-15T00:00:00.000Z")],
						[new Date("2015-04-15T00:00:00.000Z"), new Date("2015-07-15T00:00:00.000Z")],
						[new Date("2015-07-15T00:00:00.000Z"), new Date("2015-10-15T00:00:00.000Z")],
						[new Date("2015-10-15T00:00:00.000Z"), new Date("2016-01-15T00:00:00.000Z")]
					]]);
				} else {
					jQuery.sap.delayedCall(2000,this,"updateFiscalPeriods",[[
						[new Date("2015-02-15T00:00:00.000Z"), new Date("2015-05-15T00:00:00.000Z")],
						[new Date("2015-05-15T00:00:00.000Z"), new Date("2015-08-15T00:00:00.000Z")],
						[new Date("2015-08-15T00:00:00.000Z"), new Date("2015-11-15T00:00:00.000Z")],
						[new Date("2015-11-15T00:00:00.000Z"), new Date("2016-02-15T00:00:00.000Z")]
					]]);
				}
			} else if (aRanges && aRanges.length > 0) {
				this.setPending(true);
				jQuery.sap.delayedCall(2000,this,"updateFiscalPeriods",[[
					[new Date("2015-03-15T00:00:00.000Z"), new Date("2015-06-15T00:00:00.000Z")],
					[new Date("2015-06-15T00:00:00.000Z"), new Date("2015-09-15T00:00:00.000Z")],
					[new Date("2015-09-15T00:00:00.000Z"), new Date("2015-12-15T00:00:00.000Z")],
					[new Date("2015-12-15T00:00:00.000Z"), new Date("2016-03-15T00:00:00.000Z")]
				]]);

			} else {
				this.updateFiscalPeriods();
				this.setPending(false);
			}
		}
	};

	MyFiscalDateRange.prototype.updateFiscalPeriods = function (aRanges) {
		for (var i = 0; i < 4; i++) {
			var oFiscalPeriodOperation = MyFiscalDateRange.Operations["FISCALPERIOD" + i];
			if (aRanges && aRanges[i]) {
				oFiscalPeriodOperation.defaultValues = aRanges[i];
			} else {
				oFiscalPeriodOperation.defaultValues = null;
			}
		}
		this.updateOperations();
		this.setPending(false);
	};

	MyFiscalDateRange.prototype.getDefaultOperation = function() {
		var oOperation = this.getOperation("LASTYEARS");
		oOperation.defaultValues = [2];
		return oOperation;
	};

	MyFiscalDateRange.prototype.getOperations = function() {
		var aOperations = DateRangeType.prototype.getOperations.apply(this,[]);
		for (var i = 0; i < 4; i++) {
			var oFiscalPeriodOperation = MyFiscalDateRange.Operations["FISCALPERIOD" + i];
			if (oFiscalPeriodOperation.defaultValues) {
				aOperations.push(oFiscalPeriodOperation);
			}
		}
		return aOperations;
	};

	return MyFiscalDateRange;
}, /* bExport= */true);

