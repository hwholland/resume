sap.ui.controller("sap.suite.ui.commons.sample.ChartContainerResponsive.ChartContainer", {
	
	onInit: function() {
			
		var oVizFrame3 = this.getView().byId("idoVizFrame3");
		
		var oVizFrame5 = this.getView().byId("idoVizFrame5");
		
		var oSelect1 = this.getView().byId("idoSelect1");

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
		    "values" : ["Sales_Month", "Sales_Quarter", "Customer Gender",  ]
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
		  oVizFrame3.setUiConfig({'applicationSet': 'fiori'});		
		  

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
	  		oVizFrame5.setUiConfig({applicationSet : "fiori"});	
		  	
		
		

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
			
	},

	attachPersonalizationPress : function(oE) {
		sap.m.MessageToast.show("Personlainzation event was fired.");
	},
	attachContentChange : function(evt){
		var itemId = evt.getParameter("selectedItemId");
		sap.m.MessageToast.show("ContentChange event was fired. Selected Item was changed to:" + itemId);
	}

});