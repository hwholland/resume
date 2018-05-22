(function() {
	var oView;
	var saveData = {};
	var oSmartFilterBar = {};
	var oMsgHandler = {
		check : function() {
		}
	}
	sap.ui.controller("sap.ui.comp.sample.smartfilterbar.SmartFilterBar", {
	    onInit : function() {
		    oView = this.getView();
		    oView.setModel(this.getModel());
	    },
	    oModel : undefined,
	    getModel : function() {
		    if (!this.oModel) {
			    this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/C_PROCMONCOUNTKPIO2C_CDS", true);
			    this.oModel.setCountSupported(false);
		    }
		    return this.oModel;
	    },
	    onChange : function(filter) {
		    console.log("Search");
		    console.log(this.getFilterData());
	    },
	    onExit : function() {
		    this._oMockServer.stop();
	    },
	    init : function() {
	    	
	    	//First Draft for external context takeover - not working atm
		    oSmartFilterBar = this;
//		    var oJSONData = {
//		        Company : {
//			        items : [ {
//			            key : "Company A",
//			            text : "Company A"
//			        }, {
//			            key : "Company B",
//			            text : "Company B"
//			        } ]
//		        /* 	ranges: [{
//		         		exclude : false,
//		         		keyField: 'Company',
//		         		operation: 'Contains',
//		         		tokenText: '*Company*',
//		         		value1: 'Company',
//		         		value2: ''
//		         	}]*/
//		        },
//		        Country : {
//			        items : [ {
//			            key : "DE",
//			            text : "DE"
//			        } ]
//		        },
//		        Date : {
//		        //	high:oDate2,
//		        //	low: oDate
//		        }
//		    };
		    //this.setFilterData(oJSONData);
	    },
	    save : function(oController) {
		    saveData = JSON.stringify(oSmartFilterBar.fetchVariant(true));
		    console.log(saveData);
	    },
	    load : function() {
		    oSmartFilterBar.setFilterData();
		    oSmartFilterBar.applyVariant(JSON.parse(saveData));
		    console.log(saveData);
	    },
	    internalFilter : {},
	    readFilter : function() {
		    this.internalFilter = sap.apf.core.utils.Filter.transformUI5FilterToInternal(oMsgHandler, oSmartFilterBar.getFilters()[0]);
	    },
	    getSaveData : function() {
		    return saveData;
	    }
	});
})();