/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap:false, module: false, test:false, ok:false, jQuery:false, sinon */
jQuery.sap.declare('sap.apf.testhelper.stub.givenAnalyticalConfigs');

(function() {
    'use strict';

    // Declarations of what is defined below
    sap.apf.testhelper.stub.givenIntegrationSampleConfiguration = null;


    sap.apf.testhelper.stub.givenIntegrationSampleConfiguration = function () {
        return {
            "steps": [
                {
                    "type": "step",
                    "id": "RevenueByCustomer",
                    "request": "requestTemplate1",
                    "binding": "bindingTemplate1",
                    "picture": "resources/images/start.png",
                    "hoverPicture": "resources/images/start.png",
                    "title": {
                        "type": "label",
                        "kind": "text",
                        "key": "localTextReference2"
                    },
                    "longTitle": {
                        "type": "label",
                        "kind": "text",
                        "key": "longTitleTest"
                    },
                    "thumbnail": {
                        "type": "thumbnail",
                        "leftUpper": {
                            "type": "label",
                            "kind": "text",
                            "key": "localTextReferenceStepTemplate1LeftUpper"
                        },
                        "leftLower": {
                            "type": "label",
                            "kind": "text",
                            "key": "localTextReferenceStepTemplate1LeftLower"
                        },
                        "rightUpper": {
                            "type": "label",
                            "kind": "text",
                            "key": "localTextReferenceStepTemplate1RightUpper"
                        },
                        "rightLower": {
                            "type": "label",
                            "kind": "text",
                            "key": "localTextReferenceStepTemplate1RightLower"
                        }
                    }
                }
            ],
            "requests": [
                {
                    "type": "request",
                    "id": "requestTemplate1",
                    "service": "dummy.xsodata",
                    "entityType": "EntityType1",
                    "selectProperties": [
                        "PropertyOne",
                        "PropertyTwo"
                    ]
                },
                {
                    "type": "request",
                    "id": "requestTemplate2",
                    "service": "dummy.xsodata",
                    "entityType": "entityTypeWithParams",
                    "selectProperties": [
                        "PropertyOne",
                        "PropertyTwo"
                    ]
                },
                {
                    "type": "request",
                    "id": "requestTemplate3",
                    "service": "dummy.xsodata",
                    "entityType": "EntityType3",
                    "selectProperties": [
                        "PropertyOne",
                        "PropertyTwo"
                    ]
                }
            ],
            "bindings": [
                {
                    "type": "binding",
                    "id": "bindingTemplate1",
                    "requiredFilters": [
                        "CustomerName"
                    ],
                    "representations": [
                        {
                            "type": "representation",
                            "id": "PieChart",
                            "label" : {
                                "type" : "label",
                                "kind" : "text",
                                "key" : "representationText3"
                            },
                            "representationTypeId": "PieChart",
                            "parameter": {

                                "type": "parameter",
                                "dimensions": [{
                                    "fieldName": "CustomerName"
                                }
                                ],
                                "measures": [{
                                    "fieldName": "DaysSalesOutstanding"
                                }
                                ],
                                "alternateRepresentationTypeId": "TableRepresentation"
                            }
                        },
                        {
                            "type": "representation",
                            "id": "ColumnChart",
                            "label" : {
                                "type" : "label",
                                "kind" : "text",
                                "key" : "representationText2"
                            },
                            "representationTypeId": "ColumnChart",
                            "parameter": {

                                "type": "parameter",
                                "dimensions": [{
                                    "fieldName": "CustomerName"
                                }
                                ],
                                "measures": [{
                                    "fieldName": "DaysSalesOutstanding"
                                }
                                ],
                                "alternateRepresentationTypeId": "TableRepresentation"
                            }
                        },
                        {
                            "type": "representation",
                            "id": "ColumnChartSorted",
                            "label" : {
                                "type" : "label",
                                "kind" : "text",
                                "key" : "representationText2"
                            },
                            "representationTypeId": "ColumnChartSorted",
                            "parameter": {

                                "type": "parameter",
                                "dimensions": [{
                                    "fieldName": "CustomerName"
                                }
                                ],
                                "measures": [{
                                    "fieldName": "DaysSalesOutstanding"
                                }
                                ],
                                "alternateRepresentationTypeId": "TableRepresentation"
                            }
                        }
                    ]
                }
            ],
            "categories": [
                {
                    "type": "category",
                    "id": "categoryTemplate1",
                    "label": {
                        "type": "label",
                        "kind": "text",
                        "key": "categoryTitle"
                    },
                    steps : [{type : "step", id : "RevenueByCustomer"}]
                }
            ],
            "representationTypes": [
                {
                    "type": "representationType",
                    "id": "ColumnChartSorted",
                    "constructor": "sap.apf.ui.representations.columnChart",
                    "picture": "sap-icon://vertical-bar-chart",
                    "label": {
                        "type": "label",
                        "kind": "text",
                        "key": "ColumnChartSorted"
                    }
                },
                {
                    "type": "representationType",
                    "id": "ColumnChart",
                    "constructor": "sap.apf.ui.representations.columnChart",
                    "picture": "sap-icon://bar-chart",
                    "label": {
                        "type": "label",
                        "kind": "text",
                        "key": "ColumnChart"
                    }
                },
                {
                    "type": "representationType",
                    "id": "TableRepresentation",
                    "constructor": "sap.apf.ui.representations.table",
                    "picture": "sap-icon://table-chart",
                    "label": {
                        "type": "label",
                        "kind": "text",
                        "key": "table"
                    }
                },
                {
                    "type": "representationType",
                    "id": "PieChart",
                    "constructor": "sap.apf.ui.representations.pieChart",
                    "picture": "sap-icon://pie-chart",
                    "label": {
                        "type": "label",
                        "kind": "text",
                        "key": "PieChart"
                    }
                }
            ]
        };
    };

}());
