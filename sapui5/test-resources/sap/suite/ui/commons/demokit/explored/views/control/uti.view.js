sap.ui.jsview("views.control.uti", {
	createContent : function(oController) {

		var isPhone = jQuery.device.is.phone;
		var iSegmentsInGeneralTeaser = 2;
		
		var fnGetGeneralTeaserRowThreshold = function(iSegments) {
		    iSegments = iSegments || 1;
		    if (isPhone) {
		        return (3 * iSegments - 1);
		    } else {
		        return (6 * iSegments - 3);
		    }
		};

		var oGeneralFacetRow_CustomJB = new sap.m.ColumnListItem({
		        cells: [
		            new sap.m.Label({
		                text: "Responsible:"
		            }),
		            new sap.m.Link({
		                text: "John Bradford",
		                press: function(oe) {
		                    sap.m.MessageToast.show("John Bradford's custom template.");
							return false;
		                }
		            })
		        ]
		});

		var oGeneralFacetData = {
		    items: [
		        { label: "Locked for", text: "Actual Primary Costs" },
		        {                      text: "Actual Secondary Costs" },
		        { label: "Valid From", text: "01.01.2010" },
		        {   type: "separator" },
		        { label: "Valid To",   text: "Partially Invoiced" },
		        { label: "Created on", text: "01.01.2010" },
		        { label: "Created by", text: "John Smith", type: "link", href: "http://www.sap.com" },
		        {   type: "separator" },
		        {
		            type: "custom",
		            row: oGeneralFacetRow_CustomJB
		        },
		        { label: "Profit Center",       text: "Sales" },
		        { label: "Company",             text: "Consultant AG UK" },
		        { label: "Controlling Area",    text: "Consult AG" },
		        { label: "Group In",            text: "0010 Marketing" },
		        { label: "Standard Hierarchy" },
		        {   type: "separator" },
		        { label: "Sales & Marketing",               type: "heading"},
		        { label: "Cost Center Type",    text: "Sales & Marketing" },
		        { label: "Cost Center Type",    text: "Event Marketing" }
		    ]
		};

		var oGeneralTeaserData = {
		    items: oGeneralFacetData.items.slice(0, fnGetGeneralTeaserRowThreshold(iSegmentsInGeneralTeaser))
		};

		var oGeneralTableTemplate_Separator = new sap.m.ColumnListItem({
		    cells: [new sap.m.Text(), new sap.m.Text()]
		});

		var oGeneralTableTemplate_Text = new sap.m.ColumnListItem({
		    cells: [
		        new sap.m.Label({
		            text: {
		                path: "label",
		                formatter: function(v) {
		                    return v ? v+":" : "";
		                }
		            }
		        }),

		        new sap.m.Text({
		            text: "{text}"
		        })
		    ]
		});

		var oGeneralTableTemplate_Heading = new sap.m.ColumnListItem({
		    cells: [
		        new sap.m.VBox({
		        	items: [
						new sap.m.Label({
						    text: {
						        path: "label",
						        formatter: function(v) {
						            return v || "";
						        }
						    },
						    design: sap.m.LabelDesign.Bold
						}).addStyleClass("sapSuiteUtiHeaderLabel")
		        	]
		        }).addStyleClass("sapSuiteUtiTabHeader"),
		        new sap.m.Text()
		    ]
		});

		var oGeneralTableTemplate_Link = new sap.m.ColumnListItem({
		    cells: [
		        new sap.m.Label({
		            text: {
		                path: "label",
		                formatter: function(v) {
		                    return v ? v+":" : "";
		                }
		            }
		        }),
		        new sap.m.Link({
		            text: "{text}",
		            href: "{href}",
		            target: "_blank",
		            press: function(oe) {
		                return false;
		            }
		        })
		    ]
		});

		var fnGeneralTableItemFactory = function(sId, oContext) {
		    var type = oContext.getProperty("type");
		    var rowTemplate;
		    switch (type) {
		        case "custom":
		            rowTemplate = oContext.getProperty("row") || oGeneralTableTemplate_Text;
		            break;
		        case "separator":
		            rowTemplate = oGeneralTableTemplate_Separator;
		            break;
		        case "heading":
		            rowTemplate = oGeneralTableTemplate_Heading;
		            break;
		        case "link":
		            rowTemplate = oGeneralTableTemplate_Link;
		            break;
		        default:
		            rowTemplate = oGeneralTableTemplate_Text;
		    }
		    return rowTemplate.clone();
		};

		var oGeneralTeaserContent = new sap.m.Table({
		    backgroundDesign: sap.m.BackgroundDesign.Transparent,
		    showSeparators: sap.m.ListSeparators.None,
		    columns: [
		        new sap.m.Column({
		            width: "42%",
		            hAlign: sap.ui.core.TextAlign.End
		        }),
		        new sap.m.Column({
		        })
		    ],
		    items: {
		        path: "/items",
		        factory: fnGeneralTableItemFactory
		    }
		}).addDelegate({onAfterRendering : function() {
			jQuery(".sapSuiteUtiHeaderLabel").css("max-width", 100 / 42 * 100 + "%");
			jQuery(".sapSuiteUtiTabHeader").parent().css("overflow", "visible");
		}});

		oGeneralTeaserContent.setModel(new sap.ui.model.json.JSONModel(oGeneralTeaserData));
		oGeneralTeaserContent.addStyleClass("sapSuiteUtiGeneral");
		oGeneralTeaserContent.addStyleClass("sapSuiteUtiGeneralInTeaser");


		var oGeneralFacetContent = new sap.m.Table({
		    backgroundDesign: sap.m.BackgroundDesign.Transparent,
		    showSeparators: sap.m.ListSeparators.None,
		    columns: [
		        new sap.m.Column({
		            width: "42%",
		            hAlign: sap.ui.core.TextAlign.End
		        }),
		        new sap.m.Column({
		        })
		    ],
		    items: {
		        path: "/items",
		        factory: fnGeneralTableItemFactory
		    }
		}).addDelegate({onAfterRendering : function() {
			jQuery(".sapSuiteUtiHeaderLabel").css("max-width", 100 / 42 * 100 + "%");
			jQuery(".sapSuiteUtiTabHeader").parent().css("overflow", "visible");
		}});

		oGeneralFacetContent.setModel(new sap.ui.model.json.JSONModel(oGeneralFacetData));
		oGeneralFacetContent.addStyleClass("sapSuiteUtiGeneral");
		oGeneralFacetContent.addStyleClass("sapSuiteUtiGeneralOnPage");

		
		
		var oGeneralFacetGroup = new sap.suite.ui.commons.UnifiedThingGroup("general", {
		    title : "General",
		    description : "4711, Marketing",
		    content : oGeneralFacetContent
		});

		var oGeneralFacet = new sap.suite.ui.commons.FacetOverview("facet-general", {
		    title: "General",
		    content: oGeneralTeaserContent,
		    heightType: isPhone ? "Auto" : "XL",
		    rowSpan: 2,
		    press: function() {
		        setFacetContent("overview");
		    }
		});		

		var oDescriptionFacetContent = util.UiFactory.createDescription(model.Description.unifiedThingInspectorFacet, 'All');
		
		var oDescriptionFacet = new sap.suite.ui.commons.FacetOverview("facet-description", {
			title: "Description",
			content : oDescriptionFacetContent,
		    heightType : isPhone ? "Auto" : "XL"
		});
		
//---------------------------

		var oSalesOrgIcon = new sap.ui.core.Icon({
		    src: "sap-icon://globe",
		    size: isPhone ? "3rem" : "4rem"
		}).addStyleClass("sapUtiImagePaddingRight");

		var oSalesOrgGrid = new sap.m.VBox("sales-org-grid", {
		    items: [
		        new sap.m.HBox({
		            items: [
		                new sap.m.Label({text: "Distribution Channel General Brenenal"}).addStyleClass("sapUtiSalesOrgKeyLabel"),
		                new sap.m.Label({text: ":"}).addStyleClass("sapUtiSalesOrgDelimiter"),
		                new sap.m.Text({text: "01 - Electronic Sales"}).addStyleClass("sapUtiSalesOrgValueLabel")
		            ]
		        }),
		        new sap.m.HBox({
		            items: [
		                new sap.m.Label({text: "Division"}).addStyleClass("sapUtiSalesOrgKeyLabel"),
		                new sap.m.Label({text: ":"}).addStyleClass("sapUtiSalesOrgDelimiter"),
		                new sap.m.Text({text: "01 - Industry"}).addStyleClass("sapUtiSalesOrgValueLabel")
		            ]
		        }),
		        new sap.m.HBox({
		            items: [
		                new sap.m.Label({text: "Sales Group"}).addStyleClass("sapUtiSalesOrgKeyLabel"),
		                new sap.m.Label({text: ":"}).addStyleClass("sapUtiSalesOrgDelimiter"),
		                new sap.m.Link({text: "001 Sales Group 01"}).addStyleClass("sapUtiSalesOrgValueLabel")
		            ],
		            layoutData: new sap.ui.layout.GridData({visibleOnSmall: false})
		        })
		    ]
		}).addStyleClass("sapUtiSalesOrgFacet");

		if (sap.ui.getCore().getConfiguration().getRTL()) {
			oSalesOrgIcon.addStyleClass("sapUtiRtl");
			oSalesOrgGrid.addStyleClass("sapUtiRtl");
		}

		var oSalesOrgFacetContent = new sap.m.FlexBox("sales-org-content", {
		    items:[
		        oSalesOrgIcon,
		        oSalesOrgGrid
		    ]
		});

		var oSalesOrgFacet = new sap.suite.ui.commons.FacetOverview("facet-sales-org", {
			title: "Sales Organization 0001 - Walldorf",
			content: oSalesOrgFacetContent,
			heightType: isPhone ? "Auto" : "M"
		});
		
		
		var oSalesFacet = new sap.suite.ui.commons.FacetOverview("facet-sales-view", {
			title : "Sales View",
			heightType: isPhone ? "Auto" : "S"
		});
		
		
		
	    jQuery.sap.require("sap.m.MessageToast");
		
		
	    var oTransactionSheet = new sap.suite.ui.commons.LinkActionSheet({
	        showCancelButton: true,
	        placement: sap.m.PlacementType.Top,
	        items : [
				new sap.m.Link({
					text : "Transaction 1"
				}),
				new sap.m.Link({
					text : "Transaction 2"
				}),
				new sap.m.Link({
					text : "Transaction 3",
					href: "http://www.sap.com"
				})
			]
	    });

	    var fnKpiFactory = function(sId, oContext) {
	    	sId = oContext.getProperty("id");
	        
	        var oTemp = new sap.suite.ui.commons.KpiTile(sId, {
	            value: "{value}",
	            description: "{description}",
	            valueScale: "{valueScale}",
	            valueUnit: "{valueUnit}",
	            doubleFontSize: "{doubleFontSize}",
	            valueStatus: "{valueStatus}"
	        }).addStyleClass("sapDemoKitSuiteKTile");
	        
	        return oTemp;
	    };
	    
	    var oOrdersData = {
	            navigation : [{
	                name : "23000",
	                description : "CeBit Demo",
	                orderType : "040 Event",
	                systemStatus : "Planned"
	            }, {
	                name : "23120",
	                description : "Order 2",
	                orderType : "040 Event",
	                systemStatus : "Released"
	            }, {
	                name : "23230",
	                description : "Order 3",
	                orderType : "040 Event",
	                systemStatus : "Released"
	            }, {
	                name : "21000",
	                description : "Order 4",
	                orderType : "040 Event",
	                systemStatus : "Released"
	            }]
	        };      


	        var oTemplateOrdersData = new sap.m.ColumnListItem({
	            type : sap.m.ListType.Navigation,
	            press : function(oEvent) {
	                var sId = oEvent.getSource().getCells()[0].getText();
	                var sDesc = oEvent.getSource().getCells()[1].getText();
	                var sOrderType = oEvent.getSource().getCells()[2].getText();
	                var sStatus = oEvent.getSource().getCells()[3].getText();
	                
	                var oDeliveryData = {
	                    items: [
	                        { label: "Name", text: "SAP Germany" },
	                        { label: "Street", text: "Dietmar-Hopp-Allee 16" },
	                        { label: "City", text: "69190 Walldorf" },
	                        { label: "Country", text: "Germany" }
	                    ]
	                };

	                var oDeliveryTable = new sap.m.Table({
	                    backgroundDesign: sap.m.BackgroundDesign.Transparent,
	                    showSeparators: sap.m.ListSeparators.None,
	                    columns: [
	                        new sap.m.Column({
	                            width: "42%",
	                            hAlign: sap.ui.core.TextAlign.End
	                        }),
	                        new sap.m.Column({
	                        })
	                    ],
	                    items: {
	                        path: "/items",
	                        factory: fnGeneralTableItemFactory
	                    }
	                });
	                oDeliveryTable.setModel(new sap.ui.model.json.JSONModel(oDeliveryData));
	                oDeliveryTable.addStyleClass("sapSuiteUtiGeneral");
	                oDeliveryTable.addStyleClass("sapSuiteUtiGeneralOnPage");

	                var oDeliveryUtg = new sap.suite.ui.commons.UnifiedThingGroup({
	                    content: oDeliveryTable,
	                    description : "Delivery Address"
	                });
	                
	                
	                var oPage = new sap.m.Page("page-" + sId, {
	                    title : "Order Detail",
	                    showNavButton : true,
	                    content : [
	                        new sap.m.ObjectHeader({
	                            title : sDesc,
	                            number : sId,
	                            flagged : true,
	                            showFlag : true,
	                            attributes : [
	                                new sap.m.ObjectAttribute({text : sOrderType}),
	                                new sap.m.ObjectAttribute({text : sStatus})
	                            ]
	                        }).addStyleClass("sapSuiteUtiOrderDetails"),
	                        oDeliveryUtg
	                    ]
	                });
	                oUTI.navigateToPage(oPage, true);
	            },
	            unread : false,
	            cells : [
	                new sap.m.Link({text : "{name}"}),
	                new sap.m.Text({text : "{description}"}),
	                new sap.m.Text({text : "{orderType}"}),
	                new sap.m.Text({text : "{systemStatus}"})
	            ]
	        });

	        var oListOrdersForm = new sap.m.List("internal-orders-list", {
	            threshold: 2,
	            inset : false,
	            showUnread : true,
	            scrollToLoad : true,
	            columns : [
	                new sap.m.Column({
	                hAlign : sap.ui.core.TextAlign.Begin,
	                header : new sap.m.Text({text : "Order Number"}),
	                width : "25%"
	            }), new sap.m.Column({
	                hAlign : sap.ui.core.TextAlign.Begin,
	                header : new sap.m.Text({text : "Description"}),
	                minScreenWidth : "Tablet",
	                width : "25%",
	                demandPopin : true
	                }), new sap.m.Column({
	                    hAlign : sap.ui.core.TextAlign.Begin,
	                    width : "25%",
	                    header : new sap.m.Text({text : "Order Type"}),
	                    demandPopin : true
	                }), new sap.m.Column({
	                    hAlign : sap.ui.core.TextAlign.Begin,
	                    header : new sap.m.Text({text : "System Status"}),
	                    demandPopin : true
	                })],
	                items: {
	                    path : "/navigation",
	                    template : oTemplateOrdersData
	                }
	        });


	        var oModelOrders = new sap.ui.model.json.JSONModel();
	        oModelOrders.setData(oOrdersData);
	        oListOrdersForm.setModel(oModelOrders);

               var oListOrdersFormGroup = new sap.suite.ui.commons.UnifiedThingGroup("orders", {
                    title: "Internal Orders",
                    description: isPhone ? "" : "4711, Marketing",
                    content: oListOrdersForm,
                    design: sap.suite.ui.commons.ThingGroupDesign.TopIndent
                });

	        var oOrdersContent = new sap.ui.layout.Grid("form-orders", {
	            defaultSpan: "L6 M6 S6",
	            content: [
	                new sap.m.VBox({
	                    items: [
	                        new sap.m.Label({text: "CeBit Demo:"}),
	                        new sap.m.Text({text: "040 Event"})
	                    ]
	                }),
	                new sap.m.VBox({
	                    items: [
	                        new sap.m.Label({text: "Order 2:"}),
	                        new sap.m.Text({text: "040 Event"})
	                    ]
	                }),
	                new sap.m.VBox({
	                    items: [
	                        new sap.m.Label({text: "Order 3:"}),
	                        new sap.m.Text({text: "040 Event"})
	                    ],
	                    layoutData: new sap.ui.layout.GridData({visibleOnSmall: false})
	                }),
	                new sap.m.VBox({
	                    items: [
	                        new sap.m.Label({text: "Order 4:"}),
	                        new sap.m.Text({text: "040 Event"})
	                    ],
	                    layoutData: new sap.ui.layout.GridData({visibleOnSmall: false})
	                })
	            ]
	        }).addStyleClass("sapUtiFacetOverviewContentMargin");

	        var oOrdersFacet = new sap.suite.ui.commons.FacetOverview("facet-orders", {
	            title: "Internal Orders",
	            quantity: 4,
	            content: oOrdersContent,
	            heightType : isPhone ? "Auto" : "M",
	            press: function() {
	                setFacetContent("orders");
	            }
	        });

	    

	    var oUTI = new sap.suite.ui.commons.UnifiedThingInspector({
	        id : "unified",
	        icon: "img/strawberries_frozen.jpg",
	        title : "{title}",
	        name : "{name}",
	        description : "{description}",
	        actionsVisible : true,
	        transactionsVisible : true,
	        kpis : {
	            path : "kpis",
	            factory: fnKpiFactory
	        },
	        facets : [ oGeneralFacet, oDescriptionFacet, oSalesOrgFacet, oOrdersFacet, oSalesFacet],
	        backAction : function() {
	            sap.m.MessageToast.show("Back action pressed.");
	        }
	    });
	    
	    var oFacetData = {
	            orders: oListOrdersFormGroup,
	            overview: oGeneralFacetGroup
	    };

	    var oActionSheet = new sap.m.ActionSheet({
	        showCancelButton: true,
	        placement: sap.m.PlacementType.Top,
	        buttons: [
	                  new sap.m.Button({
	                      icon: "sap-icon://decline",
	                      text: "Reject"
	                  }),
	                  new sap.m.Button({
	                      icon: "sap-icon://accept",
	                      text: "Accept"
	                  }),
	                  new sap.m.Button({
	                      icon: "sap-icon://email",
	                      text: "EMail"
	                  }),
	                  new sap.m.Button({
	                      icon: "sap-icon://forward",
	                      text: "Forward"
	                  }),
	                  new sap.m.Button({
	                      icon: "sap-icon://delete",
	                      text: "Delete"
	                  })
	        ]
	    });

	    function setFacetContent(sKey) {
            oUTI.navigateToDetailWithContent(oFacetData[sKey]);
	    }
	    
	    oUTI.attachConfigurationButtonPress(function(oE){
	        sap.m.MessageToast.show("Configuration button pressed.");
	    });

	    oUTI.attachActionsButtonPress(function(oE){
	    	oE.preventDefault();
	    	var oActionBtn = oE.getParameter("caller");
	    	oActionSheet.openBy(oActionBtn);
	    });
	    
	    oUTI.attachTransactionsButtonPress(function(oE){
	    	oE.preventDefault();
	    	var oTransactionBtn = oE.getParameter("caller");
	    	oTransactionSheet.openBy(oTransactionBtn);
	    });

	    oUTI.bindContext("/uti");
		
		oUtiPage = new sap.m.Page("initial-page", {
	        showHeader: false,
	        enableScrolling: false,
	        content: [
	                  util.UiFactory.createDescription(model.Description.unifiedThingInspector, 'All'),
	                  oUTI
	                  ]
		});
		
		// done
		return oUtiPage;
	}
});