/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/view/thresholdAndTargetBar.css");

sap.ui.controller("sap.suite.ui.smartbusiness.designtime.evaluation.view.createEvalTargetThresholdTrendInput", {

	onBeforeRendering : function(){

		var that = this;

		this.parentController = this.getView().getViewData().controller;
		this.oApplicationFacade = this.parentController.oApplicationFacade;
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle(); 

		this.getView().getModel().getData().VALUES_SOURCE = this.getView().byId("valueTypeSelect").getSelectedKey();

		this.createTrendThresholdLayout();

	},
	
	onAfterRendering : function() {
		this.byId("valueTypeSelect").setTooltip(this.byId("valueTypeSelect").getSelectedItem().getText());
	},

	openMeasureSelectDialog : function(oEvent){

		var that=this;
		this.valueType = oEvent.getSource().getCustomData()[0].getKey();
		var oDataUrl = this.parentController.getView().getModel().getData().ODATA_URL;
		var oDataEntitySet = this.parentController.getView().getModel().getData().ODATA_ENTITYSET;


		if(!(oDataUrl && oDataEntitySet)){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"));
			that.parentController.errorMessages.push({
				"type" : "Error",
				"title" : that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that.parentController);
			return;
		}
		else{
			var measureModel = this.populateMeasure(oDataUrl,oDataEntitySet);
			var oMeasure = this.getView().getModel().getData().COLUMN_NAME;
			var oFilterMeasure = new sap.ui.model.Filter("measureName", sap.ui.model.FilterOperator.NE,oMeasure);
			var measureSelectDialog = new sap.m.SelectDialog({
				title: that.oResourceBundle.getText("SELECT_MEASURE"),
				noDataText: that.oResourceBundle.getText("NO_DATA_FOUND"),
				items: {
					path: "/measures",
					template: new sap.m.StandardListItem({
						title:"{measureName}",

					})},
					confirm: function(oEvent){

						switch(that.valueType){
						case "REFERENCE_VALUE" : 
							that.getView().getModel().setProperty("/REFERENCE_VALUE",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "CRITICALHIGH" : 
							that.getView().getModel().setProperty("/CRITICALHIGH",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "WARNINGHIGH" : 
							that.getView().getModel().setProperty("/WARNINGHIGH",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "TARGET" : 
							that.getView().getModel().setProperty("/TARGET",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "WARNINGLOW" : 
							that.getView().getModel().setProperty("/WARNINGLOW",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "CRITICALLOW" : 
							that.getView().getModel().setProperty("/CRITICALLOW",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "TREND" : 
							that.getView().getModel().setProperty("/TREND",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						};

					},
					liveChange: function(oEvent){
						var searchValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("measureName", sap.ui.model.FilterOperator.Contains, searchValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter],false);
					}
			});           
			measureSelectDialog.setModel(measureModel);
			measureSelectDialog.getBinding("items").filter([oFilterMeasure],false);
			measureSelectDialog.open();
		}
	},

	validateQueryServiceURI : function(dataSource) {
		dataSource = jQuery.trim(dataSource);
		if (!jQuery.sap.startsWith(dataSource, "/")) {
			dataSource = "/" + dataSource;
		}
		if (jQuery.sap.endsWith(dataSource, "/")) {
			dataSource = dataSource.substring(0, dataSource.length - 1);
		}
		return dataSource;
	},

	populateMeasure : function(dataSource, entitySet) {
		dataSource = this.validateQueryServiceURI(dataSource) + "";
		entitySet = entitySet + "";
		var measures = [], measureDataArray = [], obj = {};
		var i;

		measures = sap.suite.ui.smartbusiness.lib.OData.getAllMeasures(dataSource, entitySet);

		for (i = 0; i < measures.length; i++) {
			obj = {};
			obj.measureName = measures[i];
			measureDataArray.push(obj);
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			measures : measureDataArray
		});
		return oModel;
	},

	createTrendThresholdLayout : function(){

		var that = this;

		var viewModelData = this.getView().getModel().getData();
		this.byId('targetThresholdBar').removeAllItems();


		if(viewModelData){
			switch(viewModelData.GOAL_TYPE){

			case "MA" :
				that.createLayoutForMaximizingKPI();

				//this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Maximizing.png");
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_MAXIMIZING"));
				this.getView().byId('criticalLowLabel').setText(that.oResourceBundle.getText("CRITICAL_NUM",1));
				this.getView().byId('warningLowLabel').setText(that.oResourceBundle.getText("WARNING_2"));
				this.getView().byId('targetLabel').setText(that.oResourceBundle.getText("TARGET_NUM",3));
				this.getView().byId('criticalHighLabel').setVisible(false);
				this.getView().byId('warningHighLabel').setVisible(false);
				this.getView().byId('evaluationCriticalHigh').setVisible(false);
				this.getView().byId('evaluationWarningHigh').setVisible(false);
				this.getView().byId('relativeCriticalHighText').setVisible(false);
				this.getView().byId('relativeWarningHighText').setVisible(false);
				break;

			case "MI" : 
				that.createLayoutForMinimizingKPI();

				//this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Minimizing.png");
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_MINIMIZING"));                                                
				this.getView().byId('criticalHighLabel').setText(that.oResourceBundle.getText("CRITICAL_NUM",3));
				this.getView().byId('warningHighLabel').setText(that.oResourceBundle.getText("WARNING_2"));
				this.getView().byId('targetLabel').setText(that.oResourceBundle.getText("TARGET_NUM",1));
				this.getView().byId('criticalLowLabel').setVisible(false);
				this.getView().byId('warningLowLabel').setVisible(false);
				this.getView().byId('evaluationCriticalLow').setVisible(false);
				this.getView().byId('evaluationWarningLow').setVisible(false);
				this.getView().byId('relativeWarningLowText').setVisible(false);
				this.getView().byId('relativeCriticalLowText').setVisible(false);
				break;

			case "RA" :
				that.createLayoutForRangeKPI();

				//this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Range.png");
				this.getView().byId('criticalLowLabel').setText(that.oResourceBundle.getText("CRITICAL_LOW_1"));
				this.getView().byId('warningLowLabel').setText(that.oResourceBundle.getText("WARNING_LOW_2"));
				this.getView().byId('criticalHighLabel').setText(that.oResourceBundle.getText("CRITICAL_HIGH_5"));
				this.getView().byId('warningHighLabel').setText(that.oResourceBundle.getText("WARNING_HIGH_4"));
				this.getView().byId('targetLabel').setText(that.oResourceBundle.getText("TARGET_NUM",3));
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_RANGE"));
				break;
			};
		}
	},

	createLayoutForMaximizingKPI : function(){

		var that = this;
		var thresholdBarHBox = new sap.m.HBox({
			width : "100%",
			items:[
			       new sap.m.HBox().addStyleClass('thresholdbar critical'),
			       new sap.m.HBox().addStyleClass('thresholdline critical'),
			       new sap.m.HBox().addStyleClass('thresholdbar neutral'),
			       new sap.m.HBox().addStyleClass('thresholdline neutral'),
			       new sap.m.HBox().addStyleClass('thresholdbar positive'),
			       new sap.m.HBox().addStyleClass('thresholdline positive'),
			       new sap.m.HBox({
			    	   width : "10%"
			       }).addStyleClass('thresholdbar positive'),
			       ]
		});

		var thresholdTextHBox = new sap.m.HBox({
			width : "100%",
			items : [
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_1")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexMax'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_2")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexMax'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_3")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexMax'),					
			         ]
		});
		this.byId('targetThresholdBar').addItem(thresholdBarHBox);
		this.byId('targetThresholdBar').addItem(thresholdTextHBox);

		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);
			that.getView().byId('relativeWarningLowText').setVisible(false);
			that.getView().byId('relativeCriticalLowText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"})).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"})).setValueHelpOnly(true);
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "FIXED" : 

			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTarget').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE")).setShowValueHelp(false);
			that.getView().byId('relativeWarningLowText').setVisible(false);
			that.getView().byId('relativeCriticalLowText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "RELATIVE" :
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MAXIMIZING"));
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MAXIMIZING"));
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);
			that.getView().byId('relativeWarningLowText').setVisible(true);
			that.getView().byId('relativeCriticalLowText').setVisible(true);
			that.getView().byId('thresholdExample').setVisible(true);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		};
	},

	createLayoutForMinimizingKPI : function(){

		var that = this;
		var thresholdBarHBox = new sap.m.HBox({
			width : "100%",
			items:[
					new sap.m.HBox({
						   width : "10%"
					}).addStyleClass('thresholdbar positive'),
			       new sap.m.HBox().addStyleClass('thresholdline positive'),
			       new sap.m.HBox().addStyleClass('thresholdbar positive'),
			       new sap.m.HBox().addStyleClass('thresholdline neutral'),
			       new sap.m.HBox().addStyleClass('thresholdbar neutral'),
			       new sap.m.HBox().addStyleClass('thresholdline critical'),
			       new sap.m.HBox().addStyleClass('thresholdbar critical')
			       ]
		});

		var thresholdTextHBox = new sap.m.HBox({
			width : "100%",
			items : [
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_1")
			        	          }),
			        	          ]
			         }).addStyleClass('positiveThresholdBarForMin'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_2")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexMin'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_3")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexMin'),					
			         ]
		});
		this.byId('targetThresholdBar').addItem(thresholdBarHBox);
		this.byId('targetThresholdBar').addItem(thresholdTextHBox);

		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);
			that.getView().byId('relativeCriticalHighText').setVisible(false);
			that.getView().byId('relativeWarningHighText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"})).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"})).setValueHelpOnly(true);
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "FIXED" : 
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTarget').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE")).setShowValueHelp(false);
			that.getView().byId('relativeCriticalHighText').setVisible(false);
			that.getView().byId('relativeWarningHighText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "RELATIVE" : 
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MINIMIZING"));
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MINIMIZING"));
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);
			that.getView().byId('relativeCriticalHighText').setVisible(true);
			that.getView().byId('relativeWarningHighText').setVisible(true);
			that.getView().byId('thresholdExample').setVisible(true);

			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;
		};
	},

	createLayoutForRangeKPI : function(){

		var that = this;
		var thresholdBarHBox = new sap.m.HBox({
			width : "100%",
			items:[
			       new sap.m.HBox().addStyleClass('thresholdbarRange critical'),
			       new sap.m.HBox().addStyleClass('thresholdline critical'),
			       new sap.m.HBox().addStyleClass('thresholdbarRange neutral'),
			       new sap.m.HBox().addStyleClass('thresholdline neutral'),
			       new sap.m.HBox().addStyleClass('thresholdbarRange positive'),
			       new sap.m.HBox().addStyleClass('thresholdline positive'),
			       new sap.m.HBox().addStyleClass('thresholdbarRange positive'),
			       new sap.m.HBox().addStyleClass('thresholdline neutral'),
			       new sap.m.HBox().addStyleClass('thresholdbarRange neutral'),
			       new sap.m.HBox().addStyleClass('thresholdline critical'),
			       new sap.m.HBox().addStyleClass('thresholdbarRange critical')
			       ]
		});

		var thresholdTextHBox = new sap.m.HBox({
			width : "100%",
			items : [
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_1")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexRange'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_2")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexRange'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_3")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexRange'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_4")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexRange'),
			         new sap.m.HBox({
			        	 items : [
			        	          new sap.m.Text({
			        	        	  text : that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_TEXT_5")
			        	          }),
			        	          ]
			         }).addStyleClass('thresholdIndexRange'),

			         ]
		});
		this.byId('targetThresholdBar').addItem(thresholdBarHBox);
		this.byId('targetThresholdBar').addItem(thresholdTextHBox);

		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			var measureSelectFunction = jQuery.proxy(that.openMeasureSelectDialog,that);
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);

			that.getView().byId('relativeWarningLowText').setVisible(false);
			that.getView().byId('relativeCriticalLowText').setVisible(false);
			that.getView().byId('relativeCriticalHighText').setVisible(false);
			that.getView().byId('relativeWarningHighText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "FIXED" : 
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTarget').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE"));
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_VALUE")).setShowValueHelp(false);

			that.getView().byId('relativeWarningLowText').setVisible(false);
			that.getView().byId('relativeCriticalLowText').setVisible(false);
			that.getView().byId('relativeCriticalHighText').setVisible(false);
			that.getView().byId('relativeWarningHighText').setVisible(false);
			that.getView().byId('thresholdExample').setVisible(false);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L7 M7 S7"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;

		case "RELATIVE" : 
			var measureSelectFunction = jQuery.proxy(that.openMeasureSelectDialog,that);
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MINIMIZING"));
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MINIMIZING"));
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MAXIMIZING"));
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MAXIMIZING"));
			that.getView().byId('evaluationTarget').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true).setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setValueHelpOnly(true);
			that.getView().byId('evaluationTrend').setPlaceholder(that.oApplicationFacade.getResourceBundle().getText("SELECT_MEASURE")).setShowValueHelp(true).setValueHelpOnly(true);

			that.getView().byId('relativeWarningLowText').setVisible(true);
			that.getView().byId('relativeCriticalLowText').setVisible(true);
			that.getView().byId('relativeCriticalHighText').setVisible(true);
			that.getView().byId('relativeWarningHighText').setVisible(true);
			that.getView().byId('thresholdExample').setVisible(true);

			that.getView().byId('evaluationCriticalLow').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('evaluationWarningLow').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('evaluationCriticalHigh').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('evaluationWarningHigh').setLayoutData(new sap.ui.layout.GridData({span : "L3 M3 S3"}));
			that.getView().byId('EvaluationTargetThresholdTrendInputForm2').rerender();
			break;
		};
	},

	valueTypeSelectChange : function(evt){
		evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
		this.getView().getModel().getData().REFERENCE_VALUE = "";
		this.getView().getModel().getData().CRITICALLOW = "";
		this.getView().getModel().getData().WARNINGLOW = "";
		this.getView().getModel().getData().TARGET = "";
		this.getView().getModel().getData().WARNINGHIGH = "";
		this.getView().getModel().getData().CRITICALHIGH = "";
		this.getView().getModel().getData().TREND = "";

		this.getView().getModel().updateBindings();

		this.createTrendThresholdLayout();
	},
	
	validateThresholdValue : function(oEvent){
		var that = this;
		oValue = oEvent.getSource().getValue();
		oPlaceHolderValue = oEvent.getSource().getPlaceholder();
		if(oPlaceHolderValue === that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MAXIMIZING")){
			if(oValue > 100){
				oEvent.getSource().setValueState("Error");
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("THRESHOLD_VALUE_LESS"));
				that.parentController.errorMessages.push({
					"type" : "Error",
					"title" : that.oResourceBundle.getText("THRESHOLD_VALUE_LESS"),
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that.parentController);
			}
			else{
				oEvent.getSource().setValueState("None");
			}
		}
		else if(oPlaceHolderValue === that.oApplicationFacade.getResourceBundle().getText("ENTER_PERCENTAGE_VALUE_MINIMIZING")){
			if(oValue < 100){
				oEvent.getSource().setValueState("Error");
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("THRESHOLD_VALUE_MORE"));			
				that.parentController.errorMessages.push({
					"type" : "Error",
					"title" : that.oResourceBundle.getText("THRESHOLD_VALUE_MORE"),
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that.parentController);

			}
			else{
				oEvent.getSource().setValueState("None");
			}
		}
	},
	
	openThersholdExample: function(oEvent){
		var that=this;
		var oCustomHeader = new sap.m.Bar({
			width:"100%",
			contentMiddle:
				[new sap.m.Label({
					text:that.oResourceBundle.getText("THRESHOLD_INFO")
				})],
				contentRight :
					[new sap.m.Button({
						icon:"sap-icon://decline",
						press : function() {
							infoPopOver.close();
						}
					})]
		});
		var oExampleText = new sap.m.Text({
			width:"100%",
       		textAlign: "Left",
		}).addStyleClass("evaluationThresholdInfoHeader");
		var viewModelData = this.getView().getModel().getData()
		if(viewModelData.GOAL_TYPE === "MA") {
			oExampleText.setText(that.oResourceBundle.getText("INFO_TEXT_MAXIMIZING"));
		} else if(viewModelData.GOAL_TYPE === "MI") {
			oExampleText.setText(that.oResourceBundle.getText("INFO_TEXT_MINIMIZING"));
		} else if(viewModelData.GOAL_TYPE === "RA"){
			oExampleText.setText(that.oResourceBundle.getText("INFO_TEXT_RANGE"));
		}
		var infoPopOver = new sap.m.ResponsivePopover({

			showHeader:true,
			customHeader:oCustomHeader,
			contentWidth: "20%",
			contentHeight : "25%",
			verticalScrolling : true,
			horizontalScrolling : false,
			placement: sap.m.PlacementType.Right,
			content:[oExampleText]
		});
		infoPopOver.openBy(oEvent.getSource());

	},
});
