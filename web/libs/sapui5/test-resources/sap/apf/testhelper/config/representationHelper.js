/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.testhelper.config.representationHelper');
sap.apf.testhelper.config.representationHelper = function() {
};
sap.apf.testhelper.config.representationHelper.prototype = {
	/**
	 * @memberOf sap.apf.testhelper.
	 * @method represenatationDataWithDimension
	 * @returns the structure required for Chart Representation(One Dimensions,One measures,requiredfilter)
	 *          used for Following Charts:Bar,Line,Column,StackedColumn,StackedBar,PercentageStackedColumn,PercentageStackedBar
	 */
	representatationDataWithDimension : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			} ],
			"measures" : [ {
				"fieldName" : "DaysSalesOutstanding",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representatationDataWithProperty : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [ {
				"descending" : true,
				"property" : "CompanyCodeCountry"
			} ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	representatationDataForAlternateRep : function() {
		var parameter = {
			"dimensions" : [],
			"measures" : [],
			"properties" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "BestPossibleDaysSalesOutstndng"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			}, {
				"fieldName" : "YearMonth"
			}, {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"orderby" : [],
			isAlternateRepresentation : true
		};
		return parameter;
	},
	/**
	 * @memberOf sap.apf.testhelper.
	 * @method represenatationDataWithTwoDimensionAndMeasures(Currency)
	 * @returns the structure required for Chart Representation(Two Dimensions,one measure,requiredfilter)
	 *          used for following chats:Bar,Line,Column,StackedColumn,StackedBar,PercentageStackedColumn,PercentageStackedBar
	 */
	representatationDataWithTwoDimensionAndMeasure : function() {
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
			}, {
				"fieldName" : "YearMonth",
				"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E",
				"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
			} ],
			"orderby" : [ {
				"property" : "RevenueAmountInDisplayCrcy_E",
				"ascending" : false
			} ],
			"top" : "100",
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		return parameter;
	},
	/**
	 * @memberOf sap.apf.testhelper.
	 * @method getVizPropertiesJSONOnChart
	 * @returns structure of vizProperties common for the charts(Bar)
	 */
	getVizPropertiesJSONOnChart : function() {
		var vizProp = {
			categoryAxis : {
				label : {
					visible : true
				},
				title : {
					visible : true
				},
				visible : true
			},
			general : {
				groupData : false
			},
			interaction : {
				behaviorType : null,
				selectability : {
					mode : "none"
				}
			},
			legend : {
				isScrollable : true,
				title : {
					visible : true
				},
				visible : true
			},
			plotArea : {
				isFixedDataPointSize : false
			},
			title : {
				text : "sample Title",
				visible : true
			},
			tooltip : {
				formatString : "",
				label : {
					visible : true
				},
				visible : true
			},
			valueAxis : {
				label : {
					formatString : "",
					visible : true
				},
				title : {
					visible : true
				},
				visible : true
			}
		};
		return vizProp;
	},
	/**
	 * @memberOf sap.apf.testhelper.
	 * @method getVizPropertiesJSONOnThumbnail
	 * @returns structure of vizProperties common for the charts(Bar)
	 */
	getVizPropertiesJSONOnThumbnail : function() {
		var vizProp = {
			title : {
				visible : false
			},
			categoryAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			valueAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			legend : {
				visible : false,
				title : {
					visible : false
				}
			},
			tooltip : {
				visible : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false
			},
			general : {
				layout : {
					padding : 0
				},
				groupData : false
			},
			plotArea : {
				background : {
					visible : false
				},
				isFixedDataPointSize : false,
				gridline : {
					visible : false
				},
				dataLabel : {
					visible : false
				},
				lineStyle : {
					rules : [ {
						properties : {
							width : 1
						}
					} ]
				}
			}
		};
		return vizProp;
	},
	/**
	 * @memberOf sap.apf.testhelper.
	 * @method getPropertyMetadataStub
	 * @returns metadata needed for fields of charts
	 */
	setPropertyMetadataStub : function() {
		var getPropertyMetadataStub = sinon.stub();
		getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Company Code Country",
			"name" : "CompanyCodeCountry"
		});
		getPropertyMetadataStub.withArgs("CustomerCountry").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Customer Country",
			"name" : "CustomerCountry"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Days Sales Outstanding",
			"name" : "DaysSalesOutstanding"
		});
		getPropertyMetadataStub.withArgs("BestPossibleDaysSalesOutstndng").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"label" : "Best Possible Day Sales Outstanding",
			"name" : "BestPossibleDaysSalesOutstndng"
		});
		getPropertyMetadataStub.withArgs("YearMonth").returns({
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"label" : "Year Month",
			"name" : "YearMonth"
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Revenue in Display Currency",
			"name" : "RevenueAmountInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E.CURRENCY").returns({
			"name" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Overdue Debit in Display Currency",
			"name" : "OverdueDebitAmtInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E.CURRENCY").returns({
			"name" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Debit in Display Currency",
			"name" : "DebitAmtInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "DebitAmtInDisplayCrcy_E.CURRENCY",
			"dataType" : {
				"precision" : "34",
				"type" : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E.CURRENCY").returns({
			"name" : "DebitAmtInDisplayCrcy_E.CURRENCY",
			"semantics" : "currency-code",
			"dataType" : {
				"precision" : "5",
				"type" : "Edm.String"
			}
		});
		return getPropertyMetadataStub;
	}
}; 