jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../../integration');
jQuery.sap.declare('test.sap.apf.ui.representations.utils.tPaginationHandler');
jQuery.sap.require('sap.apf.ui.representations.utils.paginationHandler');
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	'use strict';
	var paginationHandler, oGlobalApi, representationHelper, oTableRepresentation, mainContent;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData() {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	//place the table on the DOM to perform the selection event
	function _placeTableAt(oDataTableScrollContainer) {
		var divToPlaceTable = document.createElement("div");
		divToPlaceTable.setAttribute('id', 'contentOfTable');
		divToPlaceTable.setAttribute('width', '1000px');
		document.body.appendChild(divToPlaceTable);
		oDataTableScrollContainer.placeAt("contentOfTable");
		sap.ui.getCore().applyChanges();
	}
	//fire the pagination
	function _firePagination() {
		var idForLastListItem = jQuery(".sapMListTblRow")[jQuery(".sapMListTblRow").length - 1].id;
		var oLastListItemInTable = sap.ui.getCore().byId(idForLastListItem);
		var idForScrollContainer = jQuery(".sapMScrollCont ")[jQuery(".sapMScrollCont ").length - 1].id;
		var oScrollContainer = sap.ui.getCore().byId(idForScrollContainer);
		oScrollContainer.scrollToElement(oLastListItemInTable);
	}
	QUnit.module("Pagination Handler Tests", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			oTableRepresentation = new sap.apf.ui.representations.table(oGlobalApi.oApi, requiredParameter);
			paginationHandler = new sap.apf.ui.representations.utils.PaginationHandler(oTableRepresentation); // instantiate the paginationHandler 
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When topN is defined for the table and it is lesser than the number of record in one page", function(assert) {
		//arrange
		var topN = 50;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : true,
			top : 50,
			skip : 0
		};
		//act
		var oPagingOption = paginationHandler.getPagingOption(topN); // get the paging option
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which has been configured as the topN");
	});
	QUnit.test("When topN is defined for the table and it is greater than the number of data records in one page", function(assert) {
		//arrange
		var topN = 200;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : true,
			top : 200,
			skip : 0
		};
		//act
		var oPagingOption = paginationHandler.getPagingOption(topN);// get the paging option
		var skip = paginationHandler.getPagingOption().skip;
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which is configured as top N for the table, number of records defined for one page must be ignored ");
		assert.strictEqual(skip, expectedPagingOption.skip, "Then the data to be skipped is returned correctly : " + skip);
	});
	QUnit.test("When topN is defined for the table and data is being fetched for the first time", function(assert) {
		//arrange
		var topN = 100;
		var expectedPagingOption = { // define the expected paging option
			inlineCount : true,
			top : 100,
			skip : 0
		};
		//act
		var oPagingOption = paginationHandler.getPagingOption(topN); // get the paging option
		//assert
		assert.deepEqual(oPagingOption, expectedPagingOption, "Then the top value should be the value which has been configured as the topN");
	});
	QUnit.test("When reset paging option is called", function(assert) {
		//arrange
		var expectedPagingOption = { // define the expected paging option
			inlineCount : true,
			top : 100,
			skip : 0
		};
		//act
		paginationHandler.resetPaginationOption(); // reset the paging option
		//assert
		assert.deepEqual(paginationHandler.pagingOption, expectedPagingOption, "Then the paging option is reset to default");
	});
	QUnit.module("Pagination Handler Tests- When pagination is triggered", {
		beforeEach : function(assert) {
			this.isMobile = sap.ui.Device.browser.mobile;
			sap.ui.Device.browser.mobile = false;
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			oTableRepresentation = new sap.apf.ui.representations.table(oGlobalApi.oApi, requiredParameter);
			oTableRepresentation.setData(_getSampleData(), _getsampleMetadata());
			mainContent = oTableRepresentation.getMainContent("Table With Filter", 100, 100);
			paginationHandler = new sap.apf.ui.representations.utils.PaginationHandler(oTableRepresentation); // instantiate the paginationHandler 
			var getActiveStepStub = function() {
				this.getSelectedRepresentation = function() {
					return {
						bIsAlternateView : false
					};
				};
				return this;
			};
			sinon.stub(oTableRepresentation.oApi, "getActiveStep", getActiveStepStub);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			sap.ui.Device.browser.mobile = this.isMobile;
		}
	});
	QUnit.test("When the pagination is triggered on the table", function(assert) {
		//arrange
		var pagingOption;
		var oDataTableScrollContainer = mainContent.getContent()[0];//scroll container for the table
		var oDataTable = mainContent.getContent()[0].getContent()[1].getContent()[0]; // data table
		var done = assert.async();
		//asserts are placed inside the stub because there is no event which is available on the scroll container after scroll is finished
		function updatePathStub(fnStepProcessedCallback) {
			pagingOption = paginationHandler.getPagingOption();
			assert.notEqual(pagingOption.top, 0, "Then top value is updated");
			assert.notEqual(pagingOption.skip, 10, "Then skip value is updated");
			//oDataTable.rerender();
			oDataTable.setBusy(false);
			document.body.removeChild(document.getElementById('contentOfTable'));
			oGlobalApi.oApi.updatePath.restore();
			oGlobalApi.oApi.getActiveStep.restore();
			done();
		}
		sinon.stub(oGlobalApi.oApi, 'updatePath', updatePathStub);
		_placeTableAt(oDataTableScrollContainer);
		pagingOption = paginationHandler.getPagingOption();
		//act
		paginationHandler.attachPaginationOnTable(oTableRepresentation); // attach the pagination event
		_firePagination();//scroll to the last item in the table
		//assert
		assert.strictEqual(pagingOption.top, 100, "Then Top in 100 intially");
		assert.strictEqual(pagingOption.skip, 0, "Then skip in 0 intially");
	});
})();