jQuery.sap.declare("model.Mock");

model.Mock = {
		"uti": {
		    "title": "Article",
		    "name": "Frozen Spanish Strawberries",
		    "description": "90345929",
		    "kpis": [
		             {
		        	"id": "kpi0",
		        	"value": "In Approval",
		        	"description": "Status",
		        	"doubleFontSize": false,
		        	"valueStatus": "Critical"
		             }, {
		        	"id": "kpi1",
		        	"value": "32",
		        	"valueScale": "M",
		        	"valueUnit": "USD",
		        	"description": "Gross national program",
		        	"valueStatus": "Good"
		             }
		    ]
		},
	
        "chartTile" : {
            "scale": "M",
            "unit": "EUR",
            "title": "Cumulative Totals",
            "description": "Expenses",
            "state": "Loaded",
            "bc": {
                "actual": { "value": 120, "color": "Good" },
                "targetValue": 100,
                "content": [
                        { "value": 0, "color": "Error" },
                        { "value": 50, "color": "Critical" },
                        { "value": 150, "color": "Critical" },
                        { "value": 200, "color": "Error" }
                ],
                "footer": "Actual and Target"
            },
            "cc": {
                "actual": { "value": 120, "color": "Good" },
                "targetValue": 100,
                "content": [
                            { "title": "Americas", "value": 10, "color": "Good" },
                            { "title": "EMEA", "value": 50, "color": "Good" },
                            { "title": "APAC", "value": -20, "color": "Error" }
                ],
                "footer": "Actual and Target"
            },
        },

        "bulletChart": {
		    "scale": "M",
		    "state": "Loaded",
		    "actual": { "value": 120, "color": "Good" },
		    "targetValue": 100,
		    "thresholds": [
		                   { "value": 0, "color": "Error" },
		                   { "value": 50, "color": "Critical" },
		                   { "value": 150, "color": "Critical" },
		                   { "value": 200, "color": "Error" }
		    ],
		},

		"comparisonChart": {
    	    "bars": [
    	             { "title": "Americas", "value": 10, "color": "Good" }, 
    	             { "title": "EMEA", "value": 50, "color": "Good" },
    	             { "title": "APAC", "value": -20, "color": "Error" }
    	    ]
    	},
    	
    	"microAreaChart": {
    		"chart1": {
	       		"width": "164px",
	       		"height": "74px",
	       		"chart": {
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 30, "y": 20},
	       				{"x": 60, "y": 20},
	       				{"x": 100, "y": 80}
	       			]
	       		},
	       		"target": {
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 30, "y": 30},
	       				{"x": 60, "y": 40},
	       				{"x": 100, "y": 90}
	       			]
	       		},
	       		"maxThreshold": {
	       			"color": "Good",
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 30, "y": 40},
	       				{"x": 60, "y": 50},
	       				{"x": 100, "y": 100}
	       			]
	       		},
	       		"innerMaxThreshold": {
	       			"color": "Good",
	       			"points": [
	       			]
	       		},
	       		"innerMinThreshold": {
	       			"color": "Good",
	       			"points": [
	       			]
	       		},
	       		"minThreshold": {
	       			"color": "Error",
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 30, "y": 20},
	       				{"x": 60, "y": 30},
	       				{"x": 100, "y": 70},
	       			]
	       		},
	    		"minXValue": 0,
	    		"maxXValue": 100,
	    		"minYValue": 0,
	    		"maxYValue": 100,
	    		"firstXLabel": { "label": "June 1", "color": "Good"	},
	    		"lastXLabel": { "label": "June 30", "color": "Critical" },
	    		"firstYLabel": { "label": "0M", "color": "Good" },
	    		"lastYLabel": { "label": "80M", "color": "Critical" },
	    		"minLabel": { },
	    		"maxLabel": { }
    		},
    		"chart2": {
	       		"width": "164px",
	       		"height": "42px",
	       		"chart": {
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 30, "y": 20},
	       				{"x": 60, "y": 20},
	       				{"x": 100, "y": 80}
	       			]
	       		},
	       		"target": {
	       			"points": [
	       				{"x": 0, "y": 0},
	       				{"x": 100, "y": 55}
	       			]
	       		}
    		},
    		"chart3": {
	       		"width": "164px",
	       		"height": "74px",
	       		"chart": {
	       			"points": [
	       				{"x": 0, "y": 30},
	       				{"x": 20, "y": 45},
	       				{"x": 40, "y": 40},
	       				{"x": 60, "y": 25},
	       				{"x": 80, "y": 65},
	       				{"x": 100, "y": 70}
	       			]
	       		},
	       		"target": {
	       			"points": [
	       				{"x": 0, "y": 40},
	       				{"x": 100, "y": 60}
	       			]
	       		},
	       		"maxThreshold": {
	       			"color": "Error",
	       			"points": [
	       				{"x": 0, "y": 60},
	       				{"x": 100, "y": 100}
	       			]
	       		},
	       		"innerMaxThreshold": {
	       			"color": "Good",
	       			"points": [	       				
	       			    {"x": 0, "y": 50},
	       			    {"x": 100, "y": 80}
	       			]
	       		},
	       		"innerMinThreshold": {
	       			"color": "Good",
	       			"points": [
	   	       			{"x": 0, "y": 30},
		       			{"x": 100, "y": 30}
	       			]
	       		},
	       		"minThreshold": {
	       			"color": "Error",
	       			"points": [
	       				{"x": 0, "y": 20},
	       				{"x": 100, "y": 10},
	       			]
	       		},
	    		"minXValue": 0,
	    		"maxXValue": 100,
	    		"minYValue": 0,
	    		"maxYValue": 100,
	    		"firstXLabel": { "label": "June 1", "color": "Good"	},
	    		"lastXLabel": { "label": "June 30", "color": "Good" },
	    		"firstYLabel": { "label": "30M", "color": "Good" },
	    		"lastYLabel": { "label": "70M", "color": "Good" },
	    		"minLabel": { "label": "25M", "color": "Critical" },
	    		"maxLabel": { "label": "70M", "color": "Good" }
    		}    		
	   	},
	   	"headerCell": {
			"sizes": "M",
			"value": "122",
			"scale": "M",
			"unit": "EUR",
			"valueColor": "Good",
			"indicator": "Up",
			"isFormatterValue": false,
			"truncateValueTo": 4
	   	},
	   	"headerContainer": {
			"scrollStep": 200,
			"scrollTime": 500,
			"items": [
				{
					"cells":[
							{
								"side": "north",
								"type": "numeric",
								"value": 125,
								"scale": "M",
								"unit": "EUR",
								"size": "M",
								"valueColor": sap.suite.ui.commons.InfoTileValueColor.Error,
								"indicator": sap.suite.ui.commons.DeviationIndicator.Up,
								"isFormatterValue": false,
								"truncateValueTo": 4,
								"cellHeight": "85%"
							},
							{
								"side": "south",
								"type": "text",
								"value": "USD, Current",
								"cellHeight": "15%"
							}
						]
				},
				
				{
					"cells":[
							{
								"side": "north",
								"type": "numeric",
								"value": 1115,
								"scale": "M",
								"unit": "USD",
								"size": "M",
								"valueColor": sap.suite.ui.commons.InfoTileValueColor.Critical,
								"indicator": sap.suite.ui.commons.DeviationIndicator.Up,
								"isFormatterValue": false,
								"truncateValueTo": 4,
								"cellHeight": "85%"
							},
							{
								"side": "south",
								"type": "text",
								"value": "USD, Current",
								"cellHeight": "15%"
							}
						]
				},
				
				{
					"cells":[
							{
								"side":"north",
								"type": "bulletChart",
					            "size": "M",
					            "scale": "M",
					            "actual": { "value": 120, "color": sap.suite.ui.commons.InfoTileValueColor.Good},
					            "targetValue": 100,
					            "thresholds": [
					            	{ "value": 0, "color": sap.suite.ui.commons.InfoTileValueColor.Error },
					    			{ "value": 50, "color": sap.suite.ui.commons.InfoTileValueColor.Critical },
					    			{ "value": 150, "color": sap.suite.ui.commons.InfoTileValueColor.Critical },
					    			{ "value": 200, "color": sap.suite.ui.commons.InfoTileValueColor.Error }
					    		],
					    		"showActualValue": true,
					    		"showTargetValue": true,
								"cellHeight": "85%"
							},
							{
								"side": "south",
								"type": "text",
								"value": "EUR, Current and Target",
								"cellHeight": "15%"
							}
						]
				},
				{
					"cells":[
						{
							"type": "microAreaChart",
							"side":"north",
					   		"width": "164px",
					   		"height": "74px",
					   		"chart": {
					   			"data": [
					   				{"day": 0, "balance": 0},
					   				{"day": 30, "balance": 20},
					   				{"day": 60, "balance": 20},
					   				{"day": 100, "balance": 80}
					   			]
					   		},
					   		"target": {
					   			"data": [
					   				{"day": 0, "balance": 0},
					   				{"day": 30, "balance": 30},
					   				{"day": 60, "balance": 40},
					   				{"day": 100, "balance": 90}
					   			]
					   		},
					   		"maxThreshold": {
					   			"color": "Good",
					   			"data": [
					   				{"day": 0, "balance": 0},
					   				{"day": 30, "balance": 40},
					   				{"day": 60, "balance": 50},
					   				{"day": 100, "balance": 100}
					   			]
					   		},
					   		"innerMaxThreshold": {
					   			"color": "Good",
					   			"data": [
					   			]
					   		},
					   		"innerMinThreshold": {
					   			"color": "Good",
					   			"data": [
					   			]
					   		},
					   		"minThreshold": {
					   			"color": "Error",
					   			"data": [
					   				{"day": 0, "balance": 0},
					   				{"day": 30, "balance": 20},
					   				{"day": 60, "balance": 30},
					   				{"day": 100, "balance": 70}
					   			]
					   		},
							"minXValue": 0,
							"maxXValue": 100,
							"minYValue": 0,
							"maxYValue": 100,
							"firstXLabel": { "label": "June 1", "color": "Good"	},
							"lastXLabel": { "label": "June 30", "color": "Critical" },
							"firstYLabel": { "label": "0M", "color": "Good" },
							"lastYLabel": { "label": "80M", "color": "Critical" },
							"minLabel": { },
							"maxLabel": { },
							"cellHeight" : "100%"

						}
					]
				}
				
			]				
		},
		"newsContent": {
			"contentText": "SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com",
			"subheader": "August 21, 2013"
		},
		"jamContent": {
			"contentText": "@@notify Great outcome of the Presentation today. The new functionality and the new design was well received.",
			"subheader": "about 1 minute ago in Computer Market"
		}
};