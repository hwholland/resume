sap.ui.jsview("sap.ui.comp.sample.smartfilterbar.SmartFilterBar", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf controller.View1
     */
    getControllerName : function() {
	    return "sap.ui.comp.sample.smartfilterbar.SmartFilterBar";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf controller.View1
     */
    createContent : function(oController) {
	    var oPage = new sap.m.Page({
		    content : []
	    });
	    // BUTTONS UND ZEUG
	    var save = new sap.m.Button({
	        text : "Save",
	        press : function() {
		        oController.save();
		        var value = {};
		        var string = oController.getSaveData();
		        value.filterbar = JSON.parse(string).filterbar;
		        value.filterBarVariant = JSON.parse(JSON.parse(string).filterBarVariant);
		        text.setValue(JSON.stringify(value, undefined, 2));
	        }
	    });
	    var load = new sap.m.Button({
	        text : "Load",
	        press : function() {
		        oController.load();
	        }
	    });
	    oPage.addContent(save);
	    oPage.addContent(load);
	    //textarea
	    var text = new sap.m.TextArea("TextAreaForFilter", {
	        rows : 10,
	        cols : 100
	    });
	    text.addStyleClass("TextAreaForFilter");
	    oPage.addContent(text);
	    var read = new sap.m.Button({
	        text : "Read",
	        press : function() {
		        oController.readFilter();
		        text2.setValue(oController.internalFilter.toUrlParam());
	        }
	    });
	    oPage.addContent(read);
	    var text2 = new sap.m.TextArea("TextAreaForPath", {
	        rows : 10,
	        cols : 100
	    });
	    text.addStyleClass("TextAreaForFilter");
	    oPage.addContent(text2);

	    // add predefined set of properties to filter bar
	    var aControlConfig = [];
//	    var aData = [ {
//	        property : "Country",
//	        values : [ {
//	            sign : "I",
//	            operator : "EQ",
//	            low : "DE"
//	        } ]
//	    }, {
//	        property : "Company",
//	        values : [ {
//	            sign : "I",
//	            operator : "EQ",
//	            low : "Company A"
//	        } ]
//	    }, {
//	        property : "City",
//	        values : []
//	    } ];
//	    aData.forEach(function(oData) {
//		    var defaultValues = [];
//		    oData.values.forEach(function(selectOption) {
//			    defaultValues.push(new sap.ui.comp.smartfilterbar.SelectOption(selectOption));
//		    });
//		    var oControlConfig = new sap.ui.comp.smartfilterbar.ControlConfiguration({
//		        key : oData.property,
//		        groupId : "_BASIC",
//		        defaultFilterValues : defaultValues
//		    });
//		    aControlConfig.push(oControlConfig);
//	    });
	    jQuery.sap.require('sap.apf.core.instance');
	    var that = this;
		this.messageHandler = new sap.apf.core.MessageHandler();
		var filterA = new sap.apf.core.utils.Filter(this.messageHandler, 'SalesOrganization', 'EQ', '0001');
		filterA.addOr('A', 'EQ', '2');
		var filterB = new sap.apf.core.utils.Filter(this.messageHandler, 'B', 'BT', '1', '5');
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler).addAnd(filterA).addAnd(filterB);
		
		this.coreInstance = new sap.apf.core.Instance({
			instace : {
				messageHandler : this.messageHandler,
			},
			functions : {
				getCombinedContext : function(){
					return jQuery.Deferred().resolve(that.externalContext);
				}				
			}
		});
		
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(aControlConfig){
			var oSmartFilterBar = new sap.ui.comp.smartfilterbar.SmartFilterBar("smartFilterBar", {
				entityType : "C_ProcMonCountKPIO2CResult",
				initialise : oController.init,
				controlConfiguration : aControlConfig,
				persistencyKey : "SmartFilterPersistenceAPF"
			});
			oPage.addContent(oSmartFilterBar);
		});
	    // ST
	    var oSmartTable = new sap.ui.comp.smarttable.SmartTable("smartTable", {
	        entitySet : "zjh_inventory",
	        smartFilterId : "smartFilterBar",
	        tableType : sap.ui.comp.smarttable.TableType.ResponsiveTable
	    });
	    oPage.addContent(oSmartTable);
	    var app = new sap.m.App("myApp", {
		    initialPage : "oPage"
	    });
	    app.addPage(oPage);
	    return app;
    }
});