
jQuery.sap.declare('sap.apf.testhelper.config.gatewayMetadata');

sap.apf.testhelper.config.gatewayMetadata = {
	"dataServices" : {
		"dataServiceVersion" : "2.0",
		"schema" : [ {
			"entityContainer" : [ {
				"entitySet" : [ {
					"entityType" : "ZJH_4APF_005_SRV.ZJH_4APF_005Result",
					"extensions" : [ {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "deletable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "content-version",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "1"
					} ],
					"name" : "ZJH_4APF_005Results"
				} ],
				"extensions" : [ {
					"name" : "supported-formats",
					"namespace" : "http://www.sap.com/Protocols/SAPData",
					"value" : "atom json xlsx"
				} ],
				"isDefaultEntityContainer" : "true",
				"name" : "ZJH_4APF_005_SRV_Entities"
			} ],
			"entityType" : [ {
				"extensions" : [ {
					"name" : "semantics",
					"namespace" : "http://www.sap.com/Protocols/SAPData",
					"value" : "aggregate"
				}, {
					"name" : "content-version",
					"namespace" : "http://www.sap.com/Protocols/SAPData",
					"value" : "1"
				} ],
				"key" : {
					"propertyRef" : [ {
						"name" : "ID"
					} ]
				},
				"name" : "ZJH_4APF_005Result",
				"property" : [ {
					"extensions" : [ {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "ID",
					"nullable" : "false",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "totaled-properties-list"
					}, {
						"name" : "is-annotation",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "true"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Totaled Properties"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "TotaledProperties",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "dimension"
					}, {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Airline"
					}, {
						"name" : "text",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "A2CZISCARR_T"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"maxLength" : "3",
					"name" : "A2CZISCARR",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Airline"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "A2CZISCARR_T",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "dimension"
					}, {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Airport From"
					}, {
						"name" : "text",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "A2CZISAIRPORTT_T"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "A2CZISAIRPORTT_T",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "dimension"
					}, {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Airport To"
					}, {
						"name" : "text",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "A2CZISFLIGHTAAIRPORTTO_T"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "A2CZISFLIGHTAAIRPORTTO_T",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "measure"
					}, {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Max. capacity econ."
					}, {
						"name" : "text",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "A00O2TPL8V25GGIUXHBEKKWF8X_F"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "A00O2TPL8V25GGIUXHBEKKWF8X",
					"precision" : "34",
					"scale" : "0",
					"type" : "Edm.Decimal"
				}, {
					"extensions" : [ {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Max. capacity econ. (Formatted)"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"maxLength" : "60",
					"name" : "A00O2TPL8V25GGIUXHBEKKWF8X_F",
					"type" : "Edm.String"
				}, {
					"extensions" : [ {
						"name" : "aggregation-role",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "measure"
					}, {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Occupied econ."
					}, {
						"name" : "text",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "A00O2TPL8V25GGIUX3MG5EXHIF_F"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"name" : "A00O2TPL8V25GGIUX3MG5EXHIF",
					"precision" : "34",
					"scale" : "0",
					"type" : "Edm.Decimal"
				}, {
					"extensions" : [ {
						"name" : "creatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "filterable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					}, {
						"name" : "label",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "Occupied econ. (Formatted)"
					}, {
						"name" : "updatable",
						"namespace" : "http://www.sap.com/Protocols/SAPData",
						"value" : "false"
					} ],
					"maxLength" : "60",
					"name" : "A00O2TPL8V25GGIUX3MG5EXHIF_F",
					"type" : "Edm.String"
				} ]
			} ],
			"extensions" : [ {
				"name" : "lang",
				"namespace" : "http://www.w3.org/XML/1998/namespace",
				"value" : "en"
			}, {
				"name" : "schema-version",
				"namespace" : "http://www.sap.com/Protocols/SAPData",
				"value" : "1"
			}, {
				"attributes" : [ {
					"name" : "rel",
					"namespace" : null,
					"value" : "self"
				}, {
					"name" : "href",
					"namespace" : null,
					"value" : "https://localhost:8080/sap/opu/odata/sap/ZJH_4APF_005_SRV/$metadata"
				} ],
				"children" : [],
				"name" : "link",
				"namespace" : "http://www.w3.org/2005/Atom",
				"value" : null
			}, {
				"attributes" : [ {
					"name" : "rel",
					"namespace" : null,
					"value" : "latest-version"
				}, {
					"name" : "href",
					"namespace" : null,
					"value" : "https://localhost:8080/sap/opu/odata/sap/ZJH_4APF_005_SRV/$metadata"
				} ],
				"children" : [],
				"name" : "link",
				"namespace" : "http://www.w3.org/2005/Atom",
				"value" : null
			} ],
			"namespace" : "ZJH_4APF_005_SRV"
		} ]
	},
	"version" : "1.0"
};