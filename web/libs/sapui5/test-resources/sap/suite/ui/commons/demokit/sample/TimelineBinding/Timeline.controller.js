sap.ui.controller("sap.suite.ui.commons.sample.TimelineBinding.Timeline", {
	onInit: function() {
	var oModelFL = new sap.ui.model.odata.ODataModel("/uilib-sample/proxy/http/services.odata.org/V3/Northwind/Northwind.svc/", true);
	this.getView().setModel(oModelFL );
	
	var oTimelineFL = this.byId("idTimeline");
	var oTlItemFL = this.byId("idTimelineItem");
		
	var oInitFilterFL = new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.EQ, 'AROUT');
	
	oTimelineFL.bindAggregation("content", {
  	path: "/Invoices",
  	filters: [oInitFilterFL],
  	template: oTlItemFL
});           
	 oTimelineFL.setCurrentFilter('AROUT');
   oTimelineFL.attachFilterSelectionChange(function(oControlEvent){
   	if (oControlEvent.getParameter("selectedItem").getKey() == "") {
   	    oTimelineFL.bindAggregation("content", {
 	    	path: "/Invoices",
 	    	template: oTlItemFL
 		});  	          		
   	}else {	          	
     	var oFilterFL = new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.EQ, oControlEvent.getParameter("selectedItem").getKey());
     	oTimelineFL.bindAggregation("content", {
		  		path: "/Invoices",
		  		filters: [oFilterFL],
		  		template: oTlItemFL
		  	});  
     };
  
     	oCurrentFilterKey = oTimelineFL.getCurrentFilter();
   });
  
	},
	onSelectScroll: function(oEvent){
		oTimelineFL=this.byId("idTimeline");
		var EnableScrollChkBox = this.byId("idCheckBoxScroll");
		oTimelineFL.setEnableScroll(EnableScrollChkBox.getSelected());
		
	},
	onSelect:function(oEvent){
		oTimelineFL=this.byId("idTimeline");
		var oFilterItem=this.byId("idTimelineFilterListItem")
		var oFltrAllChkBox = this.byId("idCheckBox");
		if(oFltrAllChkBox.getSelected())
			oTimelineFL.setEnableAllInFilterItem(true);
           else 
        	oTimelineFL.setEnableAllInFilterItem(false);
		 oTimelineFL.bindAggregation("filterList", {
	  	    	path: "/Customers",
	  	    	template: oFilterItem        
	  		}); 
			   },
			   showDblSided: function(oEvent)
               {
				   if (parseInt(this.byId('IdtimeLinePanel').getWidth().replace('%','')) < 100)
				   {
                     this.byId('IdtimeLinePanel').setWidth((parseInt(this.byId('IdtimeLinePanel').getWidth().replace('%','')) + 10) + '%');
				   }     
               },
               showNormalView: function(oEvent)
               {
            	   if (parseInt(this.byId('IdtimeLinePanel').getWidth().replace('%','')) > 20)
				   {
                     this.byId('IdtimeLinePanel').setWidth((parseInt(this.byId('IdtimeLinePanel').getWidth().replace('%','')) - 10) + '%');
				   }
               }

	});