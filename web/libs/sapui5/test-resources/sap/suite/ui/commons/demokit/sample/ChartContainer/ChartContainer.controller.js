jQuery.sap.require( "sap.ui.vbm.AnalyticMap");
sap.ui.vbm.AnalyticMap.GeoJSONURL = "test-resources/sap/suite/ui/commons/demokit/sample/ChartContainer/AnalyticMap.json";	

sap.ui.controller("sap.suite.ui.commons.sample.ChartContainer.ChartContainer", {
	
	onInit: function() {
			
		var oVizFrame = this.getView().byId("idoVizFrame");
		var oVizFrame2 = this.getView().byId("idoVizFrame2");
		var oVizFrame3 = this.getView().byId("idoVizFrame3");
		var oVizFrame4 = this.getView().byId("idoVizFrame4");
		var oVizFrame5 = this.getView().byId("idoVizFrame5");
		var oVizFrame6 = this.getView().byId("idoVizFrame6");
		var oVizFrame7 = this.getView().byId("idoVizFrame7");
		var oVizFrame8 = this.getView().byId("idoVizFrame8");
		
		var oTable = this.getView().byId("idoTable");
		
		
//AnalyticMap
		var oAnalyticMap = this.getView().byId("vbi");
		var oData = {
			regionProperties : [{
				"code" : "EU",
				"legend" : "Europe",
				"color" : "rgba(184,225,245,1.0)",
				"tooltip" : "Europe\r\n\r\nPopulation: 743 Mio"
			}, {
				"code" : "NA",
				"legend" : "North America",
				"color" : "rgba(5,71,102,1.0)"
			}, {
				"code" : "OC",
				"legend" : "Oceania",
				"color" : "rgba(0,125,192,1.0)"
			}]
		};

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		oAnalyticMap.setModel(oModel);    
		
		var oSelect1 = this.getView().byId("idoSelect1");
		var oSelect2 = this.getView().byId("idoSelect2");
		var oSelect3 = this.getView().byId("idoSelect3");

		var oIcon1 = this.getView().byId("idoIcon1");
		var oIcon2 = this.getView().byId("idoIcon2");
		var oIcon3 = this.getView().byId("idoIcon3");
		
		oIcon1.setSrc("sap-icon://outgoing-call");
		oIcon1.setTooltip("outgoing-call custom icon");
		oIcon1.attachPress(function(oEvent) {
			sap.m.MessageToast.show("outgoing-call custom icon pressed:" + oIcon1.getId());
		});
				
		oIcon2.setSrc("sap-icon://accept");
		oIcon2.setTooltip("accept custom icon");
		oIcon2.attachPress(function(oEvent) {
			sap.m.MessageToast.show("accept custom icon pressed: " + oIcon2.getId());
		});
		
		oIcon3.setSrc("sap-icon://activity-items");
		oIcon3.setTooltip("activity-items custom icon");
		oIcon3.attachPress(function(oEvent) {
			sap.m.MessageToast.show("activity-items custom icon pressed: " + oIcon3.getId());
		});
		
		var amModel = new sap.ui.model.json.JSONModel({
			'businessData' : [ 
  				{'Country': "Canada", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "China", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "France", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Germany", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "India", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "United States", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Italy", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Spain", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Portugal", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Ireland", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Scotland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Wales", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "England", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Belgium", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Andorra", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Netherlands", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Poland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Danemark", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Sweden", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Norway", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Finland", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Russia", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Bularia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Romania", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Alabania", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Greece", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Turkey", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "South Africa", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Australia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "New Zeland", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Japan", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Indonesia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Argentina", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Mexico", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Brazil", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Chile", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Peru", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Colombia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Venezuela", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Uruguay", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Honduras", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Ghana", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Israel", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Lybia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Algeria", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Marroco", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Guinea", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Iran", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Irak", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Egypt", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Kenya", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Island", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Cuba", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Pakistan", 'revenue': 905.08, 'profit': 609.16}
  			 ]
		});

		var amModel2 = new sap.ui.model.json.JSONModel({
			'businessData' : [ 
  				{'Country': "Canada", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "China", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "France", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Germany", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "India", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "United States", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Italy", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Spain", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Portugal", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Ireland", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Scotland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Wales", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "England", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Belgium", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Andorra", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Netherlands", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Poland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Danemark", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Sweden", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Norway", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Finland", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Russia", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Bularia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Romania", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Alabania", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Greece", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Turkey", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "South Africa", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Australia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "New Zeland", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Japan", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Indonesia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Argentina", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Mexico", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Brazil", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Chile", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Peru", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Colombia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Venezuela", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Uruguay", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Honduras", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Ghana", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Israel", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Lybia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Algeria", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Marroco", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Guinea", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Iran", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Irak", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Egypt", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Kenya", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Island", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Cuba", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Pakistan", 'revenue': 905.08, 'profit': 609.16}
  			 ]
		});
		
		var amModel4 = new sap.ui.model.json.JSONModel({
			'businessData' : [ 
  				{'Country': "Canada", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "China", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "France", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Germany", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "India", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "United States", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Italy", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Spain", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Portugal", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Ireland", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Scotland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Wales", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "England", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Belgium", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Andorra", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Netherlands", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Poland", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Danemark", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Sweden", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Norway", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Finland", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Russia", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Bularia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Romania", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Alabania", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Greece", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Turkey", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "South Africa", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Australia", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "New Zeland", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Japan", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Indonesia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Argentina", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Mexico", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Brazil", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Chile", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Peru", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Colombia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Venezuela", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Uruguay", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Honduras", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Ghana", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Israel", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Lybia", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Algeria", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Marroco", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Guinea", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Iran", 'revenue': 905.08, 'profit': 609.16},
  				{'Country': "Irak", 'revenue': 410.87, 'profit': 141.25},
  				{'Country': "Egypt", 'revenue': 338.29, 'profit': 133.82},
  				{'Country': "Kenya", 'revenue': 487.66, 'profit': 348.76},
  				{'Country': "Island", 'revenue': 470.23, 'profit': 217.29},
  				{'Country': "Cuba", 'revenue': 170.93, 'profit': 117.00},
  				{'Country': "Pakistan", 'revenue': 905.08, 'profit': 609.16}
  			 ]
		});
				
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			'dimensions' : [ {
				'name' : 'Country',
				'value' : "{Country}"
			} ],

			'measures' : [ {
				'name' : 'Profit',
				'value' : '{profit}'
			} ],
			'data' : {
				'path' : "/businessData"
			}
		});
		
		var oDataset2 = new sap.viz.ui5.data.FlattenedDataset({
			'dimensions' : [ {
				'name' : 'Country',
				'value' : "{Country}"
			} ],

			'measures' : [ {
				'name' : 'Profit',
				'value' : '{profit}'
			} ],
			'data' : {
				'path' : "/businessData"
			}
		});
		
		var oDataset4 = new sap.viz.ui5.data.FlattenedDataset({
			'dimensions' : [ {
				'name' : 'Country',
				'value' : "{Country}"
			} ],

			'measures' : [ {
				'name' : 'Profit',
				'value' : '{profit}'
			} ],
			'data' : {
				'path' : "/businessData"
			}
		});
		
		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(amModel);

		var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : [ "Profit" ]
		}), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : [ new sap.viz.ui5.controls.common.feeds.AnalysisObject({
				'uid' : "Country",
				'type' : "Dimension",
				'name' : "Country"
			}) ]
		});
				
			
		var feedPrimaryValues2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : [ "Profit" ]
		}), feedAxisLabels2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : [ new sap.viz.ui5.controls.common.feeds.AnalysisObject({
				'uid' : "Country",
				'type' : "Dimension",
				'name' : "Country"
			}) ]
		});

		var feedPrimaryValues4 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : [ "Profit" ]
		}), feedAxisLabels4 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : [ new sap.viz.ui5.controls.common.feeds.AnalysisObject({
				'uid' : "Country",
				'type' : "Dimension",
				'name' : "Country"
			}) ]
		});
		
		// -------- VizFrame ----------------
		oVizFrame.addFeed(feedPrimaryValues);
		oVizFrame.addFeed(feedAxisLabels);
		oVizFrame.setVizType('bar');
		//oVizFrame.setUiConfig({'applicationSet': 'fiori'});
		oVizFrame.setVizProperties({plotArea : {
			dataLabel : {visible : true},
				isFixedDataPointSize : true
					},
			legend : {
				title: {visible : false}
			},
			title: {
				visible: true,
				text: 'Title of Chart'
			}
		});

		// -------- VizFrame 2 ----------------
		oVizFrame2.setDataset(oDataset2);
		oVizFrame2.setModel(amModel2);
		oVizFrame2.addFeed(feedPrimaryValues2);
		oVizFrame2.addFeed(feedAxisLabels2);
		oVizFrame2.setVizType('line');
		
		oVizFrame2.setVizProperties({plotArea : {
			isFixedDataPointSize : true,
			categorySize : {
			   desktop : {
				   minValue : 100
			   }
		     }
	       }
		});	
			
		// -------- VizFrame 3 ----------------
			
		var oVizFrame3Model = new sap.ui.model.json.JSONModel({
		  'businessData' : [ {
		    "Sales_Month" : "April",
		    "Marital Status" : "Married",
		    "Customer Gender" : "Female",
		    "Sales_Quarter" : "Q1",
		    "Cost" : 190,
		    "Unit Price" : 128.3,
		    "Gross Profit" :321,
		    "Sales Revenue" : 120
		  }, {
		    "Sales_Month" : "May",
		    "Marital Status" : "Married",
		    "Customer Gender" : "Female",
		    "Sales_Quarter" : "Q2",
		    "Cost" : 189.9,
		    "Unit Price" : 151.17,
		    "Gross Profit" : 181.59,
		    "Sales Revenue" : 471.49
		  }, {
		    "Sales_Month" : "June",
		    "Marital Status" : "Married",
		    "Customer Gender" : "Female",
		    "Sales_Quarter" : "Q3",
		    "Cost" : 135,
		    "Unit Price" : 321,
		    "Gross Profit" : 124,
		    "Sales Revenue" : 349
		  }, {
		    "Sales_Month" : "July",
		    "Marital Status" : "Married",
		    "Customer Gender" : "Female",
		    "Sales_Quarter" : "Q4",
		    "Cost" : 169.4,
		    "Unit Price" : 185.2,
		    "Gross Profit" : 153.8,
		    "Sales Revenue" : 145.9
		  }, {
		    "Sales_Month" : "Augst",
		    "Marital Status" : "Married",
		    "Customer Gender" : "Male",
		    "Sales_Quarter" : "Q1",
		    "Cost" : 270.2,
		    "Unit Price" : 175,
		    "Gross Profit" : 154.3,
		    "Sales Revenue" : 164.9
		  }]});
		  
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		    dimensions : [ {
		      name : 'Sales_Quarter',
		      value : "{Sales_Quarter}"
		    }, {
		      name : 'Customer Gender',
		      value : "{Customer Gender}"
		    }, {
		      name : 'Sales_Month',
		      value : "{Sales_Month}"
		    }, {
		      name : 'Marital Status',
		      value : "{Marital Status}"
		    } ],

		    measures : [ {
		      name : 'Cost',
		      value : '{Cost}'
		    }, {
		      name : 'Unit Price',
		      value : '{Unit Price}'
		    }, {
		      name : 'Gross Profit',
		      value : '{Gross Profit}'
		    }, {
		      name : 'Sales Revenue',
		      value : '{Sales Revenue}'
		    } ],

		    data : {
		      path : "/businessData"
		    }
		  });
		  oVizFrame3.setDataset(oDataset);
		  oVizFrame3.setModel(oVizFrame3Model);
		  
		  //set feeds
		  var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "primaryValues",
		    "type" : "Measure",
		    "values" : [ "Cost" ]
		  }), feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "secondaryValues",
		    "type" : "Measure",
		    "values" : [ "Unit Price" ]
		  }), feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "bubbleWidth",
		    "type" : "Measure",
		    "values" : [ "Gross Profit" ]
		  }), feedBubbleHeight = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "bubbleHeight",
		    "type" : "Measure",
		    "values" : [ "Sales Revenue" ]
		  }), feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "regionColor",
		    "type" : "Dimension",
		    "values" : ["Sales_Month", "Sales_Quarter", "Customer Gender"  ]
		  }), feedRegionShape = new sap.viz.ui5.controls.common.feeds.FeedItem({
		    "uid" : "regionShape",
		    "type" : "Dimension",
		    "values" : [ "Marital Status" ]
		  });

		  oVizFrame3.addFeed(feedPrimaryValues);
		  oVizFrame3.addFeed(feedSecondaryValues);
		  oVizFrame3.addFeed(feedBubbleWidth);
		  oVizFrame3.addFeed(feedBubbleHeight);
		  oVizFrame3.addFeed(feedRegionColor);
		  oVizFrame3.addFeed(feedRegionShape);
		  oVizFrame3.setVizType('bubble');
		 // oVizFrame3.setUiConfig({'applicationSet': 'fiori'});
		  // -------- VizFrame 4 ----------------
		  oVizFrame4.setDataset(oDataset4);
		  oVizFrame4.setModel(amModel4);
		  oVizFrame4.addFeed(feedPrimaryValues4);
		  oVizFrame4.addFeed(feedAxisLabels4);
		  oVizFrame4.setVizType('column');		

		// -------- VizFrame 5 ----------------		
			
		  var oModel_sb = new sap.ui.model.json.JSONModel([
		  			           {
        	 "Country": "China",
        	 "Profit": 100,
        	 "Forcast": 200,
        	 "Target": 20

           },
           {
	        	 "Country": "Japan",
	        	 "Profit": 159,
	        	 "Forcast": 140,
	        	 "Target": 150
	       },
	       {
	        	 "Country": "India",
	        	 "Profit": 129,
	        	 "Forcast": 120,
	        	 "Target": 100
	       },
	       {
	        	 "Country": "France",
	        	 "Profit": 58,
	        	 "Forcast": 60,
	        	 "Target": 80
	       },
	       {
	        	 "Country": "Austrilia",
	        	 "Profit": 149,
	        	 "Forcast": 120,
	        	 "Target": 150
	       },
	       {
	        	 "Country": "Sweden",
	        	 "Profit": 49,
	        	 "Forcast": 60,
	        	 "Target": 55
	       }				       
           ]);
	  	  var oDataset_sb = new sap.viz.ui5.data.FlattenedDataset({
	  		 	dimensions: [{
	  		 		name: 'Country',
	  		 		value: "{Country}"
	  		 	}],
	  		 	measures: [
	  		 		{
	  		 			name: 'Profit', 
	  		 			value: '{Profit}' 
	  		 		},
	  		 		{
	  		 			name : 'Target',
	  		 			value : '{Target}'
	  		 		}
	  		 	],
	  		 	data: {
	  		 		path: "/"
	  		 	}
	  		 });


	  		var feedPrimaryValues_sb = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  			'uid' : "primaryValues",
	  			'type' : "Measure",
	  			'values' : ["Profit"]
	  		}), feedAxisLabels_sb = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  			'uid' : "axisLabels",
	  			'type' : "Dimension",
	  			'values' : ["Country"]
	  		}),
	  		feedTargetValues_sb = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  		  'uid' : "targetValues",
	  			'type' : "Measure",
	  			'values' : ["Target"]
	  		});
	  		
			oVizFrame5.setDataset(oDataset_sb);
	  		oVizFrame5.setModel(oModel_sb);
	  		oVizFrame5.addFeed(feedPrimaryValues_sb);
	  		oVizFrame5.addFeed(feedAxisLabels_sb);
	  		oVizFrame5.addFeed(feedTargetValues_sb);
	  		oVizFrame5.setVizType('stacked_bar');	
	  		//oVizFrame5.setUiConfig({applicationSet : "fiori"});
	  		// -------- VizFrame 6 ----------------
	  		var oModel6 = new sap.ui.model.json.JSONModel([
		  			           {
        	 "Country": "China",
        	 "Profit": 100,
        	 "Forcast": 200,
        	 "Target": 20

           },
           {
	        	 "Country": "Japan",
	        	 "Profit": 159,
	        	 "Forcast": 140,
	        	 "Target": 150
	       },
	       {
	        	 "Country": "India",
	        	 "Profit": 129,
	        	 "Forcast": 120,
	        	 "Target": 100
	       },
	       {
	        	 "Country": "France",
	        	 "Profit": 58,
	        	 "Forcast": 60,
	        	 "Target": 80
	       },
	       {
	        	 "Country": "Austrilia",
	        	 "Profit": 149,
	        	 "Forcast": 120,
	        	 "Target": 150
	       },
	       {
	        	 "Country": "Sweden",
	        	 "Profit": 49,
	        	 "Forcast": 60,
	        	 "Target": 55
	       }				       
           ]);
	  	  var oDataset6 = new sap.viz.ui5.data.FlattenedDataset({
	  		 	dimensions: [{
	  		 		name: 'Country',
	  		 		value: "{Country}"
	  		 	}],
	  		 	measures: [
	  		 		{
	  		 			name: 'Profit', 
	  		 			value: '{Profit}' 
	  		 		},
	  		 		{
	  		 			name : 'Target',
	  		 			value : '{Target}'
	  		 		}
	  		 	],
	  		 	data: {
	  		 		path: "/"
	  		 	}
	  		 });


	  		var feedPrimaryValues6 = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  			'uid' : "primaryValues",
	  			'type' : "Measure",
	  			'values' : ["Profit"]
	  		}), feedAxisLabels6 = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  			'uid' : "axisLabels",
	  			'type' : "Dimension",
	  			'values' : ["Country"]
	  		}),
	  		feedTargetValues6 = new sap.viz.ui5.controls.common.feeds.FeedItem({
	  		  'uid' : "targetValues",
	  			'type' : "Measure",
	  			'values' : ["Target"]
	  		});
	  		
		  oVizFrame6.setDataset(oDataset6);
	  	  oVizFrame6.setModel(oModel6);
	  	  oVizFrame6.addFeed(feedPrimaryValues6);
	  	  oVizFrame6.addFeed(feedAxisLabels6);
	  	  oVizFrame6.addFeed(feedTargetValues6);
	  	  oVizFrame6.setVizType('stacked_column');	
	  	  //oVizFrame6.setUiConfig({applicationSet : "fiori"});
	  	  // -------- VizFrame 7 ----------------
	  	  var oModel7 = new sap.ui.model.json.JSONModel([
  		  			           {
          	 "Country": "China",
          	 "Profit": 100,
          	 "Forcast": 200,
          	 "Target": 20

             },
             {
  	        	 "Country": "Japan",
  	        	 "Profit": 159,
  	        	 "Forcast": 140,
  	        	 "Target": 150
  	       },
  	       {
  	        	 "Country": "India",
  	        	 "Profit": 129,
  	        	 "Forcast": 120,
  	        	 "Target": 100
  	       },
  	       {
  	        	 "Country": "France",
  	        	 "Profit": 58,
  	        	 "Forcast": 60,
  	        	 "Target": 80
  	       },
  	       {
  	        	 "Country": "Austrilia",
  	        	 "Profit": 149,
  	        	 "Forcast": 120,
  	        	 "Target": 150
  	       },
  	       {
  	        	 "Country": "Sweden",
  	        	 "Profit": 49,
  	        	 "Forcast": 60,
  	        	 "Target": 55
  	       }				       
             ]);
  	  	  var oDataset7 = new sap.viz.ui5.data.FlattenedDataset({
  	  		 	dimensions: [{
  	  		 		name: 'Country',
  	  		 		value: "{Country}"
  	  		 	}],
  	  		 	measures: [
  	  		 		{
  	  		 			name: 'Profit', 
  	  		 			value: '{Profit}' 
  	  		 		},
  	  		 		{
  	  		 			name: 'Forcast', 
  	  		 			value: '{Forcast}' 
  	  		 		},
  	  		 		{
  	  		 			name : 'Target',
  	  		 			value : '{Target}'
  	  		 		}
  	  		 	],
  	  		 	data: {
  	  		 		path: "/"
  	  		 	}
  	  		 });


  	  		var feedPrimaryValues7 = new sap.viz.ui5.controls.common.feeds.FeedItem({
  	  			'uid' : "primaryValues",
  	  			'type' : "Measure",
  	  			'values' : ["Profit", "Forcast"]
  	  		}), feedAxisLabels7 = new sap.viz.ui5.controls.common.feeds.FeedItem({
  	  			'uid' : "axisLabels",
  	  			'type' : "Dimension",
  	  			'values' : ["Country"]
  	  		}),
  	  		feedTargetValues7 = new sap.viz.ui5.controls.common.feeds.FeedItem({
  	  		  'uid' : "targetValues",
  	  			'type' : "Measure",
  	  			'values' : ["Target"]
  	  	  });	
  	  		
		  oVizFrame7.setDataset(oDataset7);
	  	  oVizFrame7.setModel(oModel7);
	  	  oVizFrame7.addFeed(feedPrimaryValues7);
	  	  oVizFrame7.addFeed(feedAxisLabels7);
	  	  oVizFrame7.addFeed(feedTargetValues7);
//	  	  oVizFrame7.setVizType('stacked_column');	
	  	 // oVizFrame7.setUiConfig({applicationSet : "fiori"});
	  	  oVizFrame7.setVizType('combination');

		// -------- VizFrame 8 ----------------		
	 var oModel_bl = new sap.ui.model.json.JSONModel({
	      "Products":[
	                 {
	                 "Country": "China",
	                 "Profit": 100,
	                 "Forcast": 200,
	                 "Target": 20,
	                 "Revenue": 20,
	                 "Revenue2": 20,
	                 "Revenue3": 512
	                 },
	                 {
	                   "Country": "Japan",
	                   "Profit": 159,
	                   "Forcast": 140,
	                   "Target": 150,
	                   "Revenue": 30,
	                   "Revenue2": 100,
	                   "Revenue3": 303
	               },
	               {
	                   "Country": "India",
	                   "Profit": 129,
	                   "Forcast": 120,
	                   "Target": 100,
	                   "Revenue": 200,
	                   "Revenue2": 222,
	                   "Revenue3": 263
	               },
	               {
	                   "Country": "France",
	                   "Profit": 58,
	                   "Forcast": 60,
	                   "Target": 80,
	                   "Revenue": 116,
	                   "Revenue2": 152,
	                   "Revenue3": 113
	               },
	               {
	                   "Country": "Austrilia",
	                   "Profit": 149,
	                   "Forcast": 120,
	                   "Target": 150,
	                   "Revenue": 249,
	                   "Revenue2": 292,
	                   "Revenue3": 443
	               },
	               {
	                   "Country": "Sweden",
	                   "Profit": 49,
	                   "Forcast": 60,
	                   "Target": 55,
	                   "Revenue": 1449,
	                   "Revenue2": 242,
	                   "Revenue3": 243
	               }               
	                 ]
	    });
	    var oDataset_bl = new sap.viz.ui5.data.FlattenedDataset({
	       dimensions: [{
	         name: 'Country',
	         value: "{Country}"
	       }],
	       measures: [
	         {
			   group:1,
	           name: 'Profit', 
	           value: '{Revenue2}' 
	         },
	         {
				 group:1,
	           name : 'Target',
	           value : '{Target}'
	         },
	         {
				 group:1,
	           name : "Forcast",
	           value : "{Forcast}"
	         },
	         {
			   group:1,
	           name : "Revenue",
	           value : "{Revenue}"
	         },
	         {
				 group:1,
	           name : 'Revenue2',
	           value : '{Revenue2}'
	         },
	         {
				 group:1,
	           name : "Revenue3",
	           value : "{Revenue3}"
	         }
	       ],
	       data: {
	         path: "/Products"
	       }
	     });
	    var feedPrimaryValues_bl = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "primaryValues",
		      'type' : "Measure",
		      'values' : ["Profit"]
		    }), feedAxisLabels_bl = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "axisLabels",
		      'type' : "Dimension",
		      'values' : ["Country"]
		    }),
		    feedTargetValues_bl = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "targetValues",
		      'type' : "Measure",
		      'values' : ["Target"]
		    });

	 	  oVizFrame8.setVizProperties({  
	  		     plotArea: {
	  		        showGap: true
	  		      }      
	      });

	  	  oVizFrame8.setVizType('bullet');
	  	  oVizFrame8.setDataset(oDataset_bl);
	  	  oVizFrame8.setModel(oModel_bl);
	  	  oVizFrame8.addFeed(feedPrimaryValues_bl);
	  	  oVizFrame8.addFeed(feedAxisLabels_bl);
	  	  oVizFrame8.addFeed(feedTargetValues_bl);
	  	 // oVizFrame8.setUiConfig({applicationSet : "fiori"});
	  	  // --------oTable ----------------
		  
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Sales Month"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Marital Status"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Customer Gender"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Sales Quarter"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Cost"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Unit Price"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Gross Profit"})}));
	      oTable.addColumn(new sap.m.Column({header : new sap.m.Label({text : "Sales Revenue"})}));
			
	      var oTableTemplate = new sap.m.ColumnListItem({
				type: sap.m.ListType.Active,
				cells : [
					new sap.m.Label({text : "{Sales_Month}"}),
					new sap.m.Label({text : "{Marital Status}"}),
					new sap.m.Label({text : "{Customer Gender}"}),
					new sap.m.Label({text : "{Sales_Quarter}"}),
					new sap.m.Label({text : "{Cost}"}),
					new sap.m.Label({text : "{Unit Price}"}),
					new sap.m.Label({text : "{Gross Profit}"}),
					new sap.m.Label({text : "{Sales Revenue}"})
			     ]
			});
				
				
			oTable.bindItems("/businessData", oTableTemplate, null, null);
			oTable.setModel(oVizFrame3Model);

			// -------- oSelect1 ----------------
			var item0 = new sap.ui.core.Item({
				key : "0",
				text : "item 0"
			});
			var item1 = new sap.ui.core.Item({
				key : "1",
				text : "item 1"
			});
			var item2 = new sap.ui.core.Item({
				key : "2",
				text : "item 2 is a little long"
			});
			
			var item3 =  new sap.ui.core.Item({
				key : "3",
				text : "item 3"
			});
			
			oSelect1.addItem(item0);
			oSelect1.addItem(item1);
			oSelect1.addItem(item2);
			oSelect1.addItem(item3);

			// -------- oSelect2 ----------------
		   var itema = new sap.ui.core.Item({
				key : "A",
				text : "item A"
			});
		   var itemb = new sap.ui.core.Item({
				key : "B",
				text : "item B"
			});

			oSelect2.addItem(itema);
			oSelect2.addItem(itemb);

			// -------- oSelect3 ----------------
			
		   var itemx = new sap.ui.core.Item({
				key : "X",
				text : "item X"
			});
		   var itemy = new sap.ui.core.Item({
				key : "Y",
				text : "item Y"
			});
			   
			oSelect3.addItem(itemx);
			oSelect3.addItem(itemy);			
			
	},
	

	attachPersonalizationPress : function(oE) {
		sap.m.MessageToast.show("Personlainzation event was fired.");
	},
	attachContentChange : function(evt){
		var itemId = evt.getParameter("selectedItemId");
		sap.m.MessageToast.show("ContentChange event was fired. Selected Item was changed to:" + itemId);
	}

});