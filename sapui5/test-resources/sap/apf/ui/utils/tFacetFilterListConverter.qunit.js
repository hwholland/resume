/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterListConverter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
(function() {
      "use strict";
      var oFacetFilterListConverter;
      QUnit.module("Facet Filter List Converter tests", {
            beforeEach : function() {
                  oFacetFilterListConverter = new sap.apf.ui.utils.FacetFilterListConverter();
            }
      });
      QUnit.test("Convert filter values to facet filter list items", function(assert) {
            // arrangement
            var sPropertyName = "StartDate";
            var aFilterValues = [ {
                  "StartDate" : "20000101",
                  "formattedValue" : "1/1/2000"
            }, {
                  "StartDate" : "20000201",
                  "formattedValue" : "2/1/2000"
            }, {
                  "StartDate" : "20000401",
                  "formattedValue" : "4/1/2000"
            } ];
            var aExpectedFacetFilterItems = [ {
                  "key" : "20000101",
                  "text" : "1/1/2000",
                  "selected" : false
            }, {
                  "key" : "20000201",
                  "text" : "2/1/2000",
                  "selected" : false
            }, {
                  "key" : "20000401",
                  "text" : "4/1/2000",
                  "selected" : false
            } ];
            // act
            var aModifiedFilters = oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName);
            assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
      });
}());
