sap.ui.define([
               "sap/ui/vbdemos/component/BaseController"
               ], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.tour.Main", {

		onInit: function() {			         
			this.oVBI = null;
			var oController = this;
			var oModel = new sap.ui.model.json.JSONModel();
			 var data = $.getJSON("media/Tour.json", function(data) {
				oModel.setData(data);
				oController.oData = data;
			});
			this.getView().setModel(oModel);
			this.oVBI = this.getView().byId(this.createId("VBITour"));
		    sap.ui.getCore().setModel(oModel);
		},
		
		onClickSpot : function(evt) {
			var sLabelText = evt.getSource().getLabelText();
			if ( sLabelText == "Heidelberg" ){
				this.DetailWindowGen(evt, 0 )
			}
			else if ( sLabelText == "Zürich" ){
				this.DetailWindowGen(evt, 2 )
			}
			else if ( sLabelText == "Wien" ){
				this.DetailWindowGen(evt, 1 )
			}
			else if ( sLabelText == "Paris" ){
				this.DetailWindowGen(evt, 3 )
			}
			else {
				//  Berlin Store
				this.DetailWindowGen(evt, 4 )
			}		
		},
				
		DetailWindowGen : function(evt, Source) {
			  var pin = evt.getSource();
			  var oData = this.getView().getModel().getData();
			  var oChart = oData.Charts[Source];
			  oData.Chart = oChart;;
			  pin.openDetailWindow( oChart.title );  
			  var oMap = pin.getParent().getParent();
			  oMap.attachEventOnce("openWindow", this.onOpenDetail, {oController: this, pin : pin});
		  },
		
	    onOpenDetail : function(e) {
			  var oContent = null;
			  var oController = this.oController;
			  var oModel = oController.getView().getModel();
			  var oSpot  = this.pin;
			  var sLabelText = oSpot.getProperty("labelText");
			  var oData = oModel.getData();
			  if ( ( oData.Routes[0].color == "RGB(97,166,86)") && ( sLabelText = 'Berlin') ) {
				  oData.Chart.Data[3].value = 150;
				  oData.Chart.Data[3].color = sap.m.ValueColor.Good;
				  oData.Chart.Labels1[1].color = sap.m.ValueColor.Good;
			  }
			  if (!oContent) {
				  oContent =
					  new sap.ui.layout.VerticalLayout({
						  "width": "100%",
						  content: [
						            new sap.suite.ui.microchart.ColumnMicroChart({
						            	"size": "M",
						            	leftTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({ "label": "{/Chart/Labels1/0/label}",
						            		"color": "{/Chart/Labels1/0/color}"}),
					            		rightTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({ "label": "{/Chart/Labels1/1/label}",
					            			"color": "{/Chart/Labels1/1/color}"}),                        	                                                                
				            			columns: {
				            				path : "/Chart/Data",
				            				template : new sap.suite.ui.microchart.ColumnMicroChartData({
				            					value : '{value}',
				            					color : '{color}'
				            				})
				            			}    	                                                            
						            }),
						            new sap.m.Label({
						            	text:   "{/Chart/Label2}"
						            }),
						            new sap.ui.layout.HorizontalLayout({
						            	content : {
						            		path : "/Chart/Buttons",
						            		template : new sap.m.Button({
						            			text :  '{text}',
						            			press :  function() { oController.onPlanRoute( oSpot )} 
						            		})
						            	}
						            })
						         ]
					  });
			  }
			  oContent.placeAt(e.getParameter("contentarea").id,"only");
		  },
		  
		   onPlanRoute : function( oSpot  ) {
			   if ( oSpot.getProperty("labelText") == "Berlin"){
				   this.PlanBerlinRoute( oSpot );
			   }
					
		  },
		  

			
		   PlanBerlinRoute : function( oSpot ) {
			  this.oVBI.closeAnyDetailWindow();
			  var oRouteStart = {};
			  var oRouteEnd = {};
	
			  // Heidelberg 
			  oRouteStart.coord = [];
			  oRouteStart.coord =  this.oData.Spots[0].position.split(";");
			  oRouteStart.name  =  this.oData.Spots[0].labelText;
			  // Berlin
			  oRouteEnd.coord = [];
			  oRouteEnd.coord   =  this.oData.Spots[4].position.split(";");
			  oRouteEnd.name    =  this.oData.Spots[4].labelText;
	
			  var sColor = "RGB(97,166,86)";
			  var oModel =  sap.ui.getCore().getModel();
			  this.calculateRoute(oRouteStart, oRouteEnd, 'motorcar', '1', sColor, oModel, oSpot );
		  },


		  calculateRoute : function(oRouteStart, oRouteEnd, sTypeOfTransport, sRoutingMethod, sColor, oModel, oSpot ){
				var sRoutingService = "http://www.yournavigation.org/api/1.0/gosmore.php?format=geojson&flat={flat}&flon={flon}&tlat={tlat}1&tlon={tlon}&v={transport}&fast={routing}&layer=mapnik&lang=en-US";
				sRoutingService = sRoutingService.replace(/{flat}/,	oRouteStart.coord[1].toString());
				sRoutingService = sRoutingService.replace(/{flon}/,	oRouteStart.coord[0].toString());
				sRoutingService = sRoutingService.replace(/{tlat}/, oRouteEnd.coord[1].toString());
				sRoutingService = sRoutingService.replace(/{tlon}/, oRouteEnd.coord[0].toString());
				sRoutingService = sRoutingService.replace(/{transport}/, sTypeOfTransport);
				sRoutingService = sRoutingService.replace(/{routing}/, sRoutingMethod);
				var PlannedRoute = {};

				var oRoute = $.getJSON(sRoutingService, function(oRoute) {
					//.................... load the routing data from a Webservice.....................................//      
					var coordinatesRaw = [];
					coordinatesRaw = oRoute.coordinates;
					var sRoute = '';
					var separator = ';'
					
					for (var i = 0; i < coordinatesRaw.length; i++) {
						if (i == coordinatesRaw.length - 1) {
							separator = ''
						}
						sRoute += coordinatesRaw[i][0] + ';' + coordinatesRaw[i][1]
								+ ';0' + separator;
					}

					var sTooltip = 'This is a your planned Route from ' + oRouteStart.name + ' to ' + oRouteEnd.name;
					var oData = oModel.getData();
					// set Berlin Spot
					oData.Spots[4].image = 'GreenPin';
		   	        // set Berlin Route
					var oRoute = oModel.oData.Routes[0];
					oRoute.poslist = sRoute;
					oRoute.linewidth = "5";
					oRoute.color = "RGB(97,166,86)";
					oRoute.colorBorder = "RGBA(255,255,255,255)";
					oRoute.tooltip = sTooltip; 
					oModel.setData(oData);	    		
				})			
			}
		
	});
});
