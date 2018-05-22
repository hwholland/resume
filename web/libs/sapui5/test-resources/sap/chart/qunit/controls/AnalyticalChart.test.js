sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/chart/utils/RoleFitter',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/analytics/ODataModelAdapter',
	'sap/ui/model/analytics/AnalyticalTreeBindingAdapter',
	'sap/ui/layout/VerticalLayout',
	'sap/chart/utils/ChartTypeAdapterUtils'
], function(
	Chart,
	Dimension,
	TimeDimension,
	Measure,
	RoleFitter,
	ODataModel,
	ODataModelAdapter,
	AnalyticalTreeBindingAdapter,
	VerticalLayout,
	ChartTypeAdapterUtils
) {
	var sServiceURI = "http://anaChartFakeService:8080/";
	window.anaChartFakeService.fake({
		baseURI: sServiceURI
	});
	sinon.config.useFakeTimers = false;
	var sResultSet = "ActualPlannedCostsResults";
	var sResultPath = "/ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')/Results";


	var oModel, oVerticalLayout, oChart, sLocale;

	module("AnalyticalChart", {
		setup: function() {
			sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			oModel = new ODataModel(sServiceURI, {
				json: true
			});
			oVerticalLayout = new VerticalLayout({
				width: "100%"
			});
		},
		teardown: function() {
			try {
				if (oModel) {
					oModel.destroy();
				}
				if (oChart) {
					oChart.destroy();
				}
				if (oVerticalLayout) {
					oVerticalLayout.destroy();
				}
				sap.ui.getCore().getConfiguration().setLanguage(sLocale);
				$("#qunit-fixture").empty();
			} catch (e) {
				
			}
		}
	});

	test("role -> feed mapping (correct input only)", function() {
		expect(28);

		function genByRole(roles) {
			return {
				dim: (roles.dim || []).map(function(role, idx) {
					var Clz = role.bIsDate ? TimeDimension: Dimension;
					return new Clz({
						name: "d" + idx,
						role: role.bIsDate ? role.sRoleName : role
					});
				}),
				msr: (roles.msr || []).map(function(role, idx) {
					return new Measure({
						name: "m" + idx,
						role: role
					});
				})
			};
		}

		function extract(feeds) {
			return feeds.map(function(n) {
				return {
					type: n.getType(),
					uid: n.getUid(),
					values: n.getValues().map(function(v) {
                        return (typeof v === "string") ? v  : v.getUid();
                    })
				};
			});
		}

		function match(cfg) {
			cfg.types.forEach(function(type) {
				var input = genByRole(cfg.input);
				type = ChartTypeAdapterUtils.adaptChartType(type, input.dim);
				deepEqual(extract(RoleFitter.fit(type, input.dim, input.msr, [], cfg.seriesType)), cfg.output, "is correct for \"" + type + "\" chart");
			});
		}

		var config = [{
			types: ["column", "bar", "stacked_bar", "stacked_column", "line", "100_stacked_bar", "100_stacked_column", "combination", "stacked_combination", "horizontal_stacked_combination"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis1", "axis2"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1", "m2"]
			}]
		}, {
			types: ["dual_stacked_bar", "100_dual_stacked_bar", "dual_stacked_column", "100_dual_stacked_column", "dual_bar", "dual_column", "dual_line", "dual_stacked_combination", "dual_horizontal_stacked_combination"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis1", "axis2"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m2"]
			}]
		}, {
			types: ["scatter"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2"]
			},
			seriesType: "color",
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d0", "d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m1"]
			}]
		}, {
			types: ["bubble", "time_bubble"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d0", "d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m1"]
			}, {
				"type": "Measure",
				"uid": "bubbleWidth",
				"values": ["m2"]
			}],
			seriesType: "color"
		}, {
			types: ["heatmap"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "categoryAxis2",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "color",
				"values": ["m0"]
			}]
		}, {
			types: ["bullet", "vertical_bullet"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "actualValues",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "targetValues",
				"values": ["m1"]
			}, {
				"type": "Measure",
				"uid": "forecastValues",
				"values": ["m2"]
			}]
		}, {
			types: ["pie", "donut"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d0", "d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "size",
				"values": ["m0"]
			}]
		}, {
			types: ["line"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1", "m2"]
			}]
		}
		// , {
		// 	types: ["timeseries_scatter"],
		// 	input: {
		// 		dim: ["category", "series", "series"],
		// 		msr: ["axis1", "axis2", "axis3"]
		// 	},
		// 	output: [{
		// 		"type": "Dimension",
		// 		"uid": "timeAxis",
		// 		"values": ["d0"]
		// 	}, {
		// 		"type": "Dimension",
		// 		"uid": "shape",
		// 		"values": ["d1", "d2"]
		// 	}, {
		// 		"type": "Measure",
		// 		"uid": "valueAxis",
		// 		"values": ["m0"]
		// 	}],
		// 	seriesType: "shape"
		// }, {
		// 	types: ["timeseries_bubble"],
		// 	input: {
		// 		dim: ["category", "series", "series"],
		// 		msr: ["axis1", "axis2", "axis3"]
		// 	},
		// 	output: [{
		// 		"type": "Dimension",
		// 		"uid": "timeAxis",
		// 		"values": ["d0"]
		// 	}, {
		// 		"type": "Dimension",
		// 		"uid": "shape",
		// 		"values": ["d1", "d2"]
		// 	}, {
		// 		"type": "Measure",
		// 		"uid": "valueAxis",
		// 		"values": ["m0"]
		// 	}, {
		// 		"type": "Measure",
		// 		"uid": "bubbleWidth",
		// 		"values": ["m2"]
		// 	}],
		// 	seriesType: "shape"
		// }
		];

		config.forEach(match);
	});

	asyncTest("Create Chart with ODataModel", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function(oEvent) {
			equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			start();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Chart API test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'vizProperties': {
				interaction: {
					zoom: {
						enablement: "enabled"
					}
				}
			},
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function(oEvent) {
			var oldSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			oChart.zoom({
				direction: "in"
			});
			var newSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			ok(oldSize.width < newSize.width, "zoom API is correct");
			equal(oChart.getVizUid(), oChart.getAggregation("_vizFrame").getVizUid(), "getVizUid API is correct");
			start();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Properties test (ported)", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'vizProperties': {
				valueAxis: {
					title: {
						text: "123"
					}
				},
				legend: {
					visible: true
				},
				interaction: {
					zoom: {
						enablement: "enabled"
					}
				}
			},
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb(oEvent) {
			equal(oChart.getChartType(), "column", "get chartType is correct");
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setChartTypeCb);
			oChart.setChartType("line");
		}

		oChart.attachRenderComplete(null, initRenderCb);

		function setChartTypeCb(oEvent) {
			equal(oChart.getChartType(), "line", "set chartType is correct");
			equal(document.querySelectorAll("#qunit-fixture .v-datapoint-group .v-lines").length, 2, "chart type is switched");
			oChart.detachRenderComplete(setChartTypeCb);
			equal(oChart.getVizProperties().valueAxis.title.text, "123", "get vizProperties is correct");
			oChart.attachRenderComplete(null, setVizPropertiesCb);
			oChart.setVizProperties({
				valueAxis: {
					title: {
						text: "ABC"
					}
				}
			});
		}

		function setVizPropertiesCb(oEvent) {
			equal(oChart.getVizProperties().valueAxis.title.text, "ABC", "set vizProperties is correct");
			equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-m-axisTitle").textContent, "ABC", "vizProperties is updated");
			oChart.detachRenderComplete(setVizPropertiesCb);
			start();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Properties (visibleDimensions & visibleMeasures) test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			deepEqual(oChart.getVisibleMeasures(), ["ActualCosts", "PlannedCosts"], "get visibleMeasures is correct");
			deepEqual(oChart.getVisibleDimensions(), ["CostElement"], "get visibleDimensions is correct");
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setVisibleMeasuresCb1);
			oChart.setVisibleMeasures(["ActualCosts"]);
		}

		function setVisibleMeasuresCb1() {
			var aLegendItemDoms = document.querySelectorAll("#qunit-fixture .v-legend-item");
			equal(aLegendItemDoms[0].textContent, "Actual Costs", "set visibleMeasures to different items is correct");
			oChart.detachRenderComplete(setVisibleMeasuresCb1);
			oChart.attachRenderComplete(null, setVisibleMeasuresCb2);
			oChart.setVisibleMeasures(["PlannedCosts", "ActualCosts"]);
		}

		function setVisibleMeasuresCb2() {
			var aLegendItemDoms = document.querySelectorAll("#qunit-fixture .v-legend-item");
			deepEqual(Array.prototype.map.call(aLegendItemDoms, function(d) {
				return d.textContent;
			}), ["Planned Costs", "Actual Costs"], "set visibleMeasurs to different order is correct");
			oChart.detachRenderComplete(setVisibleMeasuresCb2);
			oChart.attachRenderComplete(null, setVisibleDimensionsCb1);
			oChart.setVisibleDimensions(["CostElement", "CostCenter"]);
		}

		function setVisibleDimensionsCb1() {
			equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Cost Element / Cost Center", "set visibleDimensions to different items is correct");
			oChart.detachRenderComplete(setVisibleDimensionsCb1);
			oChart.attachRenderComplete(null, setVisibleDimensionsCb2);
			oChart.setVisibleDimensions(["CostCenter", "CostElement"]);
		}

		function setVisibleDimensionsCb2() {
			equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Cost Center / Cost Element", "set visibleDimensions to different order is correct");
			oChart.detachRenderComplete(setVisibleDimensionsCb2);
			start();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Properties (Dimensions) test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setLabelCb);
			oCostElement.setLabel("Mooooo");
		}

		function setLabelCb() {
			equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Mooooo", "dimension label is correct");
			oChart.detachRenderComplete(setLabelCb);
			oChart.attachRenderComplete(null, setTextFormatterCb);
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oCostElement.setTextFormatter(function(id) {
				if (id === "400020") {
					return "Desk";
				} else {
					return id;
				}
			});
		}

		function setTextFormatterCb() {
			equal(document.querySelectorAll("#qunit-fixture .v-m-categoryAxis .v-label-group g")[0].textContent, "Desk", "dimension textFormatter is correct");
			oChart.detachRenderComplete(setTextFormatterCb);
			oChart.attachRenderComplete(null, setRoleCb);
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oCostElement.setRole("series");
		}

		function setRoleCb() {
			oChart.detachRenderComplete(setRoleCb);
			equal(document.querySelectorAll("#qunit-fixture .v-m-legend .v-legend-item")[0].textContent, "Desk", "dimension role is correct");
			start();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Properties (Measures) test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'scatter',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.addMeasure(new Measure({
			name: "ActualCosts",
			role: "axis1"
		}));
		oChart.addMeasure(new Measure({
			name: "PlannedCosts",
			role: "axis2"
		}));

		oChart.addDimension(new Dimension({
			name: "CostElement",
			role: "category"
		}));
		oChart.addDimension(new Dimension({
			name: "CostCenter",
			role: "category"
		}));

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setLabelCb);
			var oActualCosts = oChart.getMeasures().filter(function(oMsr) {
				return oMsr.getName() === "ActualCosts";
			})[0];
			oActualCosts.setLabel("Mooooo");
		}

		function setLabelCb() {
			oChart.detachRenderComplete(setLabelCb);
			oChart.attachRenderComplete(null, setRoleCb);
			equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-m-axisTitle text").textContent, "Mooooo", "measure label is correct");
			var aMeasures = oChart.getMeasures(),
				oPlannedCosts = aMeasures.filter(function(oMsr) {
					return oMsr.getName() === "PlannedCosts";
				})[0],
				oActualCosts = aMeasures.filter(function(oMsr) {
					return oMsr.getName() === "ActualCosts";
				})[0];
			oPlannedCosts.setRole("axis1");
			oActualCosts.setRole("axis2");
		}

		function setRoleCb() {
			equal(document.querySelector("#qunit-fixture .v-m-valueAxis2 .v-m-axisTitle text").textContent, "Mooooo", "measure role is correct");
			start();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("drillDown/drillUp (w/o selection) test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function assertDimMsr(expected, msg) {
			deepEqual({
				dim: oChart.getVisibleDimensions(),
				msr: oChart.getVisibleMeasures()
			}, expected, msg);
		}

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, ddOnOneCb);
			oChart.drillDown("CostCenter");
		}

		function ddOnOneCb() {
			oChart.detachRenderComplete(ddOnOneCb);
			var oResult = {
				dim: oChart.getVisibleDimensions(),
				msr: oChart.getVisibleMeasures()
			};
			assertDimMsr({
				dim: ["CostElement", "CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill down on a single Dimension is correct");
			oChart.attachRenderComplete(null, ddOnTwoCb);
			oChart.drillDown(["FiscalYear", "ControllingArea"]);
		}

		function ddOnTwoCb() {
			oChart.detachRenderComplete(ddOnTwoCb);
			assertDimMsr({
				dim: ["CostElement", "CostCenter", "FiscalYear", "ControllingArea"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill down on multiple Dimensions is correct");
			oChart.attachRenderComplete(null, duFromTwoCb);
			oChart.drillUp();
		}

		function duFromTwoCb() {
			oChart.detachRenderComplete(duFromTwoCb);
			assertDimMsr({
				dim: ["CostElement", "CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from a multi-Dimension drill down is correct");
			oChart.attachRenderComplete(null, duFromOneCb);
			oChart.drillUp();
		}

		function duFromOneCb() {
			oChart.detachRenderComplete(duFromOneCb);
			assertDimMsr({
				dim: ["CostElement"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from a single-Dimension drill down is correct");
			oChart.attachRenderComplete(null, resetForDrillUpCb);
			oChart.setVisibleDimensions(["CostCenter", "CostElement"]);
		}

		function resetForDrillUpCb() {
			assertDimMsr({
				dim: ["CostCenter", "CostElement"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "setVisibleDimension resets the drill state");
			oChart.detachRenderComplete(resetForDrillUpCb);
			oChart.attachRenderComplete(null, duFromBeginningOneCb);
			oChart.drillUp();
		}

		function duFromBeginningOneCb() {
			oChart.detachRenderComplete(duFromBeginningOneCb);
			assertDimMsr({
				dim: ["CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from an empty drill down is correct");
			oChart.attachRenderComplete(null, duFromBeginningTwoCb);
			oChart.drillUp();
		}

		function duFromBeginningTwoCb() {
			oChart.detachRenderComplete(duFromBeginningTwoCb);
			assertDimMsr({
				dim: [],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up *again* from a single-Dimension drill down is correct");
			oChart.attachRenderComplete(null, resetByVisibleMeasuresDrillCb);
			oChart.setVisibleMeasures("ActualCosts");
		}

		function resetByVisibleMeasuresDrillCb() {
			oChart.detachRenderComplete(resetByVisibleMeasuresDrillCb);
			assertDimMsr({
				dim: ["CostCenter", "CostElement"],
				msr: ["ActualCosts"]
			}, "setVisibleDimension resets the drill state");

			oChart.attachRenderComplete(null, prepareDrillStateCb);
			oChart.setVisibleMeasures(["ActualCosts", "PlannedCosts"]);
			oChart.drillDown(["ControllingArea", "FiscalYear"]);
		}

		function prepareDrillStateCb() {
			oChart.detachRenderComplete(prepareDrillStateCb);
			var oDim = oChart.getDimensions().filter(function(d) {
					return d.getName() === "ControllingArea";
				})[0],
				oMsr = oChart.getMeasures()[0],
				reference = {
					dim: ["CostCenter", "CostElement", "ControllingArea", "FiscalYear"],
					msr: ["ActualCosts", "PlannedCosts"]
				};
			oDim.setRole("series");
			assertDimMsr(reference, "changing Dimension role property does not alter drill state");
			oDim.setLabel("Some Dimension");
			assertDimMsr(reference, "changing Dimension label property does not alter drill state");
			oDim.setDisplayText(false);
			assertDimMsr(reference, "changing Dimension displayText property does not alter drill state");
			oDim.setTextFormatter(function(id) {
				return "[" + id + "]";
			});

			oMsr.setRole("axis2");
			assertDimMsr(reference, "changing Measure role property does not alter drill state");
			oMsr.setLabel("Random Measure");
			assertDimMsr(reference, "changing Measure label property does not alter drill state");

			oChart.attachRenderComplete(null, removeDimensionCb);
			oChart.removeDimension(oDim);
		}

		function removeDimensionCb() {
			oChart.detachRenderComplete(removeDimensionCb);
			assertDimMsr({
				dim: ["CostCenter", "CostElement", "FiscalYear"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "removing Dimension resets drill state");
			start();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("drillDown/drillUp (with selection) test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				plotArea: {
					isFixedDataPointSize: false
				},
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function dpContexts() {
			var doms = document.querySelectorAll("#qunit-fixture .v-datapoint");
			return Array.prototype.map.call(doms, function(d) {
				return d.__data__;
			});
		}

		function ddWith(dim, data) {
			if (!(data instanceof Array)) {
				data = [data];
			}
			data = data.map(function(d) {
				return {
					data: d
				};
			});
			oChart._getVizFrame().vizSelection(data);
			var selection = oChart._getVizFrame().vizSelection();
			oChart.drillDown(dim);
			return selection.map(function(s) {
				return s.data;
			});
		}

		var aData, aSelection;

		function resetTo(fn) {
			oChart.attachRenderComplete(null, function() {
				oChart.detachRenderComplete(arguments.callee);
				fn();
			});
			oChart.resetLayout();
		}

		function initRenderCb() {
			oChart.detachRenderComplete(arguments.callee);
			oChart.attachRenderComplete(null, ddOnOneCb);
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050"
			});
		}

		function ddOnOneCb() {
			oChart.detachRenderComplete(arguments.callee);
			aData = dpContexts();
			ok(aData.every(function(d) {
				return !d.hasOwnProperty("CostElement");
			}), "drilldown with a single selected category hides the corresponding Dimension from result");
			resetTo(ddOnNestedCb);
		}

		function ddOnNestedCb() {
			oChart.attachRenderComplete(null, function() {
				oChart.detachRenderComplete(arguments.callee);
				aData = dpContexts();
				ok(aData.every(function(d) {
					return !d.hasOwnProperty("CostElement") && !d.hasOwnProperty("CostCenter");
				}), "drilldown with a nested category selected hides both that Dimension and the Dimensions of its parents level categories");
				resetTo(ddSingleDpCb);
			});
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050",
				CostCenter: "100-1100"
			});
		}

		function ddSingleDpCb() {
			oChart.attachRenderComplete(null, function() {
				oChart.detachRenderComplete(arguments.callee);
				aData = dpContexts();
				ok(aData.every(function(d) {
					return !d.hasOwnProperty("CostElement") && !d.hasOwnProperty("CostCenter") && d.measureNames === "ActualCosts";
				}), "drilldown with a single datapoint selection hides Dimensions of all categories along with other Measures");
				resetTo(ddMixedCb);
			});
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050",
				CostCenter: "100-1100",
				measureNames: "ActualCosts"
			});
		}

		function ddMixedCb() {
			oChart.attachRenderComplete(null, function() {
				oChart.detachRenderComplete(arguments.callee);
				aData = dpContexts();
				var selectedCostCenters = aSelection.reduce(function(m, s) {
					m[s.CostCenter] = 0;
					return m;
				}, {});
				ok(aData.every(function(d) {
					if (d.CostElement === "410050") {
						return d.CostCenter === "100-1100";
					} else if (d.CostElement === "400020") {
						if (selectedCostCenters.hasOwnProperty(d.CostCenter)) {
							selectedCostCenters[d.CostCenter] += 1;
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}) && Object.keys(selectedCostCenters).every(function(cc) {
					return selectedCostCenters[cc] > 0;
				}), "drilldown with mixed selection is correct");
				start();
			});
			aSelection = ddWith("FiscalPeriod", [{
				CostElement: "400020"
			}, {
				CostElement: "410050",
				CostCenter: "100-1100"
			}]);
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("selectionMode test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionMode': 'SINGLE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode, "SINGLE", "selectionMode can be set via constructor parameter");
			equal(oChart.getSelectionMode(), "SINGLE", "getSelectionMode() is correct");
			oChart.setSelectionMode("MULTIPLE");
			equal(oChart.getSelectionMode(), "MULTIPLE", "setSelectionMode() is correct");
			oChart.setSelectionMode("SinGLE");
			equal(oChart.getSelectionMode(), "SINGLE", "selectionMode is always uppercase");
			oChart.setSelectionMode("INVALID_VALUE");
			equal(oChart.getSelectionMode(), "SINGLE", "selectionMode does not accept invalid values");
			oChart.setVizProperties({"interaction.selectability.mode": "MULTIPLE"});
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode.toLowerCase(), "single", "selectionMode blacklists the \"interaction.selectability.mode\" property");
			oChart.setVizProperties({interaction: {selectability: {mode: "MULTIPLE"}}});
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode.toLowerCase(), "single", "selectionMode blacklists the {interaction: {selectability: { mode: }}} property");
			
			start();
		});
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("selectionBehavior test", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'DATAPOINT',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior, "DATAPOINT", "selectionBehavior can be set via constructor parameter");
			equal(oChart.getSelectionBehavior(), "DATAPOINT", "getSelectionBehavior() is correct");
			oChart.setSelectionBehavior("CATEGORY");
			equal(oChart.getSelectionBehavior(), "CATEGORY", "setSelectionBehavior() is correct");
			oChart.setSelectionBehavior("seRies");
			equal(oChart.getSelectionBehavior(), "SERIES", "selectionBehavior is case-insensitive");
			oChart.setSelectionBehavior("INVALID_VALUE");
			equal(oChart.getSelectionBehavior(), "SERIES", "selectionBehavior does not accept invalid values");
			oChart.setVizProperties({"interaction.selectability.behavior": "CATEGORY"});
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior.toLowerCase(), "series", "selectionBehavior blacklists the \"interaction.selectability.behavior\" property");
			oChart.setVizProperties({interaction: {selectability: {behavior: "CATEGORY"}}});
			equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior.toLowerCase(), "series", "selectionBehavior blacklists the {interaction: {selectability: { behavior: }}} property");
			
			start();
		});
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Selection [DATAPOINT]", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'DATAPOINT',
			'selectionMode': 'INCLUSIVE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			var oCE = oChart.getDimensionByName("CostElement");
			oCE.setRole("series");
			oChart.attachEventOnce("renderComplete", initCb);
		});

        function equivalent(actual, expected) {
            if (actual === expected) {
                return true;
            } else if ((typeof actual) !== (typeof expected)) {
                return false;
            } else if (jQuery.isArray(actual)) {
                return actual.length === expected.length &&  actual.every(function(n) {
                    return expected.some(function(m) {
                        equivalent(n, m);
                    });
                }) && expected.every(function(m) {
                    return actual.some(m, n);
                });
            } else if (jQuery.isPlainObject(actual)) {
                var aKeys = Object.keys(actual).sort(),
                    eKeys = Object.keys(expected).sort();
                
                return aKeys.join(",") === eKeys.join(",") && aKeys.every(function(k) {
                    equivalent(actual[k], expected[k]);
                });
            } else {
                return false;
            }
        }

        function dataPointEqual(actual, expected, message) {
            function copy(src) {
                return !src ? src : {
                    count: src.count,
                    dataPoints: !src.dataPoints ? src.dataPoints : src.dataPoints.map(function(dp) {
                        var context = dp.context;
                        if (context && !jQuery.isPlainObject(context)) {
                            context = context.getObject();
                            context = Object.keys(context).reduce(function(obj, k) {
                                if (k !== "__metadata") {
                                    obj[k] = context[k];
                                }
                                return obj;
                            }, {});
                        }
                        return {
                            index: dp.index,
                            measures: dp.measures,
                            context: context
                        };
                    })
                };
            }
            deepEqual(copy(actual), copy(expected), message);
        }
		
		function initCb() {
			oChart.setSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":3,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":2
			}, "getSelectedDataPoints() is correct");
			oChart.addSelectedDataPoints([{index: 2, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
				              {"index":3,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":3
			}, "addSelectedDataPoints() is correct");
			oChart.removeSelectedDataPoints([{index: 3, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
				              {"index":3,"measures":["ActualCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":2
			}, "removeSelectedDataPoints() is correct");
			oChart.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]},{index: 6, measures: ["ActualCosts", "PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":5,"measures":["ActualCosts"],"context":{"ActualCosts":"675652","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"430100","CostElementText":"Salaries & Wages","Currency":"USD","PlannedCosts":"670000"}},
				              {"index":6,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"131254","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"435000","CostElementText":"Annual Bonus","Currency":"USD","PlannedCosts":"130000"}}],
				"count":3
			}, "setSelectedDataPoints() is correct");
			oChart.setSelectionMode("Exclusive");
			oChart.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]},{index: 6, measures: ["ActualCosts", "PlannedCosts"]}]);
			oChart.addSelectedDataPoints([{index: 2, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
				              {"index":5,"measures":["ActualCosts"],"context":{"ActualCosts":"675652","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"430100","CostElementText":"Salaries & Wages","Currency":"USD","PlannedCosts":"670000"}},
				              {"index":6,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"131254","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"435000","CostElementText":"Annual Bonus","Currency":"USD","PlannedCosts":"130000"}}],
				"count":4
			}, "addSelectedDataPoints() works regardlessly of selectionMode");
			oChart.setSelectedDataPoints([{index: 2, measures: ["ActualCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["ActualCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}}],
				"count":1
			}, "setSelectedDataPoints() works regardlessly of selectionMode");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("Selection [SERIES]", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'SERIES',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			var oCE = oChart.getDimensionByName("CostElement");
			oCE.setRole("series");
			oChart.attachEventOnce("renderComplete", initCb);
		});
		
		function initCb() {
			oChart.setSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"}]
			}, "getSelectedSeries() is correct.");
			oChart.addSelectedSeries([{measures: "PlannedCosts", dimensions: {CostElement: "400021"}}]);
			deepEqual(oChart.getSelectedSeries(), {
				"count":18,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"},
				          {"dimensions":{"CostElement":"400021"},"measures":"PlannedCosts"}]
			}, "addSelectedSeries() is correct.");
			oChart.removeSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400021"},"measures":"PlannedCosts"}]
			}, "removeSelectedSeries() is correct.");
			oChart.setSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"}]
			}, "setSelectedSeries() is correct.");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("Selection [CATEGORY]", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);
		
		function initCb() {
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}]);
			deepEqual(oChart.getSelectedCategories(), {
				"count":18,
				"categories":[{"dimensions":{"CostElement":"400020"}}]
			}, "getSelectedCategories() is correct.");
			oChart.addSelectedCategories([{dimensions: {CostElement: "400021", CostCenter: "100-1000"}}]);
			deepEqual(oChart.getSelectedCategories(), {
				"count":20,
				"categories":[{"dimensions":{"CostElement":"400020"}},
				              {"dimensions":{"CostElement":"400021","CostCenter":"100-1000"}}]
			}, "addSelectedCategories() is correct.");
			oChart.removeSelectedCategories([{dimensions: {CostElement: "400020", CostCenter: "100-1000"}}]);
			deepEqual(oChart.getSelectedCategories(), {
				"count":18,
				"categories":[{"dimensions":{"CostElement":"400020","CostCenter":["100-1100","200-1000","200-2000","200-3000","200-4000","200-5000","300-1000","300-2000"]}},
				              {"dimensions":{"CostElement":"400021","CostCenter":"100-1000"}}]
			}, "removeSelectedSeries() is correct.");
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}, {dimensions: {CostElement: "400021"}}]);
			deepEqual(oChart.getSelectedCategories(), {
				"count":36,
				"categories":[{"dimensions":{"CostElement":"400020"}}, {dimensions: {CostElement: "400021"}}]
			}, "setSelectedCategories() is correct(MULTIPLE).");
			oChart.setSelectionMode("SINGLE");
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}]);
			deepEqual(oChart.getSelectedCategories(), {
				"count":18,
				"categories":[{"dimensions":{"CostElement":"400020"}}]
			}, "setSelectedCategories() is correct(SINGLE).");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("Selection [MODE = NONE]", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionMode': 'NONE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);
		
		function initCb() {
			oChart.setSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "setSelectedDataPoints() disabled");
			oChart.addSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "addSelectedDataPoints() disabled.");
			oChart.removeSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "removeSelectedDataPoints() disabled.");

			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("Rendering", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);
		
		function initCb() {
			equal(document.querySelectorAll("#qunit-fixture .ui5-viz-controls-app").length, 1, "Chart does not create extra DOM node.");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	test("Supported Chart Types and Localized Chart Names", function() {
		function getBarName(sLocale) {
			sap.ui.getCore().getConfiguration().setLanguage(sLocale);
			sLocale = sLocale || sap.ui.getCore().getConfiguration().getLanguage();
			return sap.chart.api.getChartTypes().bar;
		}

		var aLocales = ["en", "de", "zh_CN", "it", "ko"];
		var aNames = ["Bar Chart", "Balkendiagramm", "\u6761\u5F62\u56FE", "Grafico a barre", "\uB9C9\uB300\uD615 \uCC28\uD2B8"];
		ok(aLocales.every(function(loc, i) {
			return getBarName(loc) === aNames[i];
		}), "getChartTypes is correct.");
	});

	asyncTest("Available Chart Types using current binding", function() {
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		
		oChart.attachEventOnce("renderComplete", feeding2By2);
		
		function wrap(availability) {
			var result = {};
			availability.available.forEach(function(obj) {
				result[obj.chart] = true;
			});
			availability.unavailable.forEach(function(obj) {
				result[obj.chart] = false;
			});
			return result;
		}
		
		function feeding2By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			ok(mResult.bar && mResult.combination && mResult.dual_line && !mResult.bubble, "Dim x2 & Msr x2 is correct");
			oChart.attachEventOnce("renderComplete", feeding2By1);
			oChart.setVisibleMeasures(["ActualCosts"]);
		}

		function feeding2By1() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x2 & Msr x1 is correct");
			oChart.attachEventOnce("renderComplete", feeding1By2);
			oChart.setVisibleDimensions(['CostElement']);
			oChart.setVisibleMeasures(['ActualCosts', 'PlannedCosts']);
		}

		function feeding1By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			ok(mResult.bar && mResult.combination && mResult.dual_line && !mResult.bubble, "Dim x1 & Msr x2 is correct");
			oChart.attachEventOnce("renderComplete", feeding1By1);
			oChart.setVisibleMeasures(['ActualCosts']);
		}

		function feeding1By1() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x1 & Msr x1 is correct");
			oChart.attachEventOnce("renderComplete", feeding0By2);
			oChart.setVisibleDimensions([]);
			oChart.setVisibleMeasures(['ActualCosts', 'PlannedCosts']);
		}

		function feeding0By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x0 & Msr x2 is correct");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	asyncTest("API - getChartTypeLayout", function() {
		oChart = new sap.chart.Chart({
			'width': '600px',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);
		
		function initCb() {
			deepEqual(sap.chart.api.getChartTypeLayout("line"), 
					{"dimensions":[],"measures":[],"errors":[{"cause":"missing","detail":{"dim":0,"msr":1,"time":0}}]}, 
					"current visible dimensions and measures is not used as default");
			deepEqual(sap.chart.api.getChartTypeLayout("line", [{name:"CostElement"}]), {
				dimensions: [],
				measures: [],
				errors: [{cause:"missing",detail:{dim:0,msr:1,time:0}}]
			}, "using visible dimensions only, no default measures are inferred");
			deepEqual(sap.chart.api.getChartTypeLayout("line", null, [{name:"ActualCosts"}]), {
				dimensions: [],
				measures: ["ActualCosts"],
				errors: []
			}, "using measures only, no default dimensions are inferred");
			deepEqual(sap.chart.api.getChartTypeLayout("line", [{name:"CostElement"}], [{name:"ActualCosts"}]), {
				dimensions: ["CostElement"],
				measures: ["ActualCosts"],
				errors: []
			}, "using provided dimensions and measures is correct");
			deepEqual(sap.chart.api.getChartTypeLayout("bubble",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]).errors, [{cause:"missing",detail:{dim:0,msr:1,time:0}}], "errors is detected");
			deepEqual(sap.chart.api.getChartTypeLayout("line", [], []).errors, [{cause:"missing",detail:{dim:0,msr:1,time:0}}], "errors is detected (filter out MND)");
			deepEqual(sap.chart.api.getChartTypeLayout("dual_column",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]), {
				dimensions: ["CostElement", "CostCenter"],
				measures: ["ActualCosts", "PlannedCosts"],
				errors: []
			}, "BVR intervention is detected");

			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, null,
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]),
					new Error("Invalid chart type: null"),
					"Invalid chartType parameter throws exception");
			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, "column",
					[{"name":"CostElement"},{}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]),
					new Error("Invalid Dimension at [1]: [object Object]. Dimension should be an object of the format{name:'name'}."),
					"Invalid dimension parameter throws exception");
			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, "column",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{},{"name":"PlannedCosts"}]),
					new Error("Invalid Measure at [0]: [object Object]. Measure should be an object of the format{name:'name'}."),
					"Invalid measure parameter throws exception");
			start();
		}
		
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("loading animation test", function() {
		oChart = new sap.chart.Chart({
			'width': '800px',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function(oEvent) {
			oChart._showLoading(true);
			var $loading = oChart._$loadingIndicator;
			equal($loading[0].parentNode, oChart.getDomRef(), "Loading page is shown");
			equal($loading.css("opacity"), "1", "Loading page blocks the plot");
			start();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("InResult test", function() {
		var options = {
				'width': '800px',
				'height': '600px',
				'chartType': 'column',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'vizProperties': {
					'plotArea': {
						'isFixedDataPointSize': false
					}
				},
				'isAnalytical': true,
				'visibleDimensions': ['CostElement'],
				'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
				'inResultDimensions': ['CostCenter'],
				'enablePagination': false
			};
		oChart = new sap.chart.Chart(options);

		oChart.attachEventOnce("renderComplete", null, normalInResultTest);
		
		function normalInResultTest() {
			var dpDoms = oChart.getDomRef().querySelectorAll(".v-datapoint");
			var oBinding = oChart.getBinding("data");
			equal(dpDoms.length, 2 * oBinding.getLength(), "data of inResult aggragation are rendered");
			
			equal(oChart.getDomRef().querySelectorAll(".v-m-categoryAxis .v-label").length, 12, "only visible dimensions are rendered in category axis");
			
			oChart.setInResultDimensions(["CostElement", "CostCenter"], "Dimension can be moved from visible to inResult");
			deepEqual(oChart.getVisibleDimensions(), []);
			oChart.setVisibleDimensions(["CostElement", "CostCenter"], "Dimension can be moved from inResult to visible");
			deepEqual(oChart.getInResultDimensions(), []);
			
			oChart.setInResultDimensions(['CostCenter']);

			oChart.attachEventOnce("renderComplete", null, noVisibleDimensionTest);
			oChart.setVisibleDimensions([]);
		}
		
		function noVisibleDimensionTest() {
			equal(oChart.getDomRef().querySelectorAll(".v-datapoint").length, 18, "inResult works when there's no visible dimension");
			start();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	
	asyncTest("Multiple Currency test", function() {
		var unit = "Currency",
			msrId = "ActualCosts";
		var options = {
				'width': '800px',
				'height': '600px',
				'chartType': 'bar',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'vizProperties': {
					'plotArea': {
						'dataLabel': {
							'visible': true,
							'hideWhenOverlap': false
						},
						'isFixedDataPointSize': false
					}
				},
				'isAnalytical': true,
				'visibleDimensions': ['CostElement'],
				'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
				'enablePagination': false
			};
		oChart = new sap.chart.Chart(options);
		
		var labels;

		oChart.attachEventOnce("renderComplete", null, function(oEvent) {
			labels = [].map.call(oChart.getDomRef().querySelectorAll(".v-datalabel"), (function(n) {
				return n.textContent;
			}));
			var oMsr = oChart.getMeasureByName(msrId);
			oMsr.setUnitBinding(unit);
			oChart.attachEventOnce("renderComplete", null, runTest);
		});

		function runTest(oEvent) {
			deepEqual(oChart.getInResultDimensions(), [], "Unit fields are not listed in inResultDimension.");
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			var aUnitDlDoms = aDlDoms.filter(function(dom) {
				return dom.__data__.measureNames === msrId;
			});
			ok(aUnitDlDoms.every(function(dom) {
				var data = dom.__data__,
					regex = new RegExp(" " + data[unit] +"$");
				return regex.test(dom.textContent);
			}), "unit values are displayed along with each data point in data label.");
			oChart.attachEventOnce("renderComplete", null, testVisibleDimAsUnit);
			oChart.setVisibleDimensions(["CostElement", unit]);
		}

		function testVisibleDimAsUnit() {
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			var aUnitDlDoms = aDlDoms.filter(function(dom) {
				return dom.__data__.measureNames === msrId;
			});
			ok(aUnitDlDoms.every(function(dom) {
				var data = dom.__data__,
					regex = new RegExp(" " + data[unit] +"$");
				return regex.test(dom.textContent);
			}), "Using visible Dimension as Unit is ok");
			oChart.attachEventOnce("renderComplete", null, testInResultAsUnit);
			oChart.setVisibleDimensions(["CostElement"]);
			oChart.setInResultDimensions(["Currency"]);
			var oMsr = oChart.getMeasureByName(msrId);
			oMsr.setUnitBinding(unit);
		}
		
		function testInResultAsUnit() {
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			var aUnitDlDoms = aDlDoms.filter(function(dom) {
				return dom.__data__.measureNames === msrId;
			});
			ok(aUnitDlDoms.every(function(dom) {
				var data = dom.__data__,
					regex = new RegExp(" " + data[unit] +"$");
				return regex.test(dom.textContent);
			}), "using InResult dimension for unit is ok");
			oChart.attachEventOnce("renderComplete", null, testInvalidDimAsUnit);
			var oMsr = oChart.getMeasureByName(msrId);
			oMsr.setUnitBinding("TheNopeField");
		}
		
		function testInvalidDimAsUnit() {
			deepEqual(Array.prototype.map.call(oChart.getDomRef().querySelectorAll(".v-datalabel"), function(elem) {
				return elem.textContent;
			}), labels, "Invalid dimension as unit has no effect.");
			start();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
});
