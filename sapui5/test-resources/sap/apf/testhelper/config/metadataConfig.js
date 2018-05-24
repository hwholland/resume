jQuery.sap.declare('sap.apf.testhelper.config.metadataConfig');
sap.apf.testhelper.config.metadataConfig = {
	metadata : {
		"version" : "1.0",
		"dataServices" : {
			"dataServiceVersion" : "2.0",
			"schema" : [ {
				"namespace" : "dummy",
				"entityType" : [ {
					"name" : "firstEntityQueryResultsType",
					"key" : {
						"propertyRef" : [ {
							"name" : "GenID"
						} ]
					},
					"property" : [ {
						"name" : "GenID",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "2147483647",
						"extensions" : [ {
							"name" : "filterable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "firstProperty",
						"type" : "Edm.String",
						"maxLength" : "3",
						"extensions" : [ {
							"name" : "aggregation-role",
							"value" : "dimension",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "nonFilterableProperty",
						"type" : "Edm.String",
						"maxLength" : "4",
						"extensions" : [ {
							"name" : "aggregation-role",
							"value" : "dimension",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						}, {
							"name" : "filterable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "aggregate",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				}, {
					"name" : "firstEntityQueryType",
					"key" : {
						"propertyRef" : [ {
							"name" : "P_SecondParameter"
						} ]
					},
					"property" : [ {
						"name" : "P_FirstParameter",
						"type" : "Edm.Int32",
						"nullable" : "false",
						"extensions" : [ {
							"name" : "parameter",
							"value" : "mandatory",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "P_SecondParameter",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "5",
						"extensions" : []
					} ],
					"navigationProperty" : [ {
						"name" : "Results",
						"relationship" : "firstEntityQuery_firstEntityQueryResultsType",
						"fromRole" : "firstEntityQueryPrincipal",
						"toRole" : "firstEntityQueryResultsDependent"
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "parameters",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				}, {
					"name" : "secondEntityQueryResultsType",
					"key" : {
						"propertyRef" : [ {
							"name" : "GenID"
						} ]
					},
					"property" : [ {
						"name" : "GenID",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "2147483647",
						"extensions" : [ {
							"name" : "filterable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "firstProperty",
						"type" : "Edm.String",
						"maxLength" : "3",
						"extensions" : [ {
							"name" : "aggregation-role",
							"value" : "dimension",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "secondProperty",
						"type" : "Edm.String",
						"maxLength" : "123",
						"extensions" : [ {
							"name" : "aggregation-role",
							"value" : "dimension",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "nonFilterableProperty",
						"type" : "Edm.String",
						"maxLength" : "4",
						"extensions" : [ {
							"name" : "aggregation-role",
							"value" : "dimension",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "aggregate",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				}, {
					"name" : "secondEntityQueryType",
					"key" : {
						"propertyRef" : [ {
							"name" : "P_FirstParameter"
						}, {
							"name" : "P_SecondParameter"
						} ]
					},
					"property" : [ {
						"name" : "P_FirstParameter",
						"type" : "Edm.Int32",
						"nullable" : "false",
						"extensions" : [ {
							"name" : "parameter",
							"value" : "mandatory",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "P_SecondParameter",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "5",
						"extensions" : []
					} ],
					"navigationProperty" : [ {
						"name" : "Results",
						"relationship" : "secondEntityQuery_secondEntityQueryResultsType",
						"fromRole" : "secondEntityQueryPrincipal",
						"toRole" : "secondEntityQueryResultsDependent"
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "parameters",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				}, {
					"name" : "thirdEntityDirectlyAddressableQueryResults",
					"key" : {
						"propertyRef" : [ {
							"name" : "PropertyOneForThird"
						} ]
					},
					"property" : [ {
						"name" : "PropertyOneForThird",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "5",
						"extensions" : []
					}, {
						"name" : "PropertyTwoForThird",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "15",
						"extensions" : []
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "aggregate",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				} ],
				"association" : [ {
					"name" : "firstEntityQuery_firstEntityQueryResultsType",
					"end" : [ {
						"role" : "firstEntityQueryPrincipal",
						"type" : "dummy.firstEntityQueryResultsType",
						"multiplicity" : "*"
					}, {
						"role" : "firstEntityQueryResultsDependent",
						"type" : "dummy.firstEntityQueryResultsType",
						"multiplicity" : "*"
					} ]
				}, {
					"name" : "secondEntityQuery_secondEntityQueryResultsType",
					"end" : [ {
						"role" : "secondEntityQueryPrincipal",
						"type" : "dummy.secondEntityQueryResultsType",
						"multiplicity" : "*"
					}, {
						"role" : "secondEntityQueryResultsDependent",
						"type" : "dummy.secondEntityQueryResultsType",
						"multiplicity" : "*"
					} ]
				} ],
				"entityContainer" : [ {
					"name" : "testMetadata",
					"isDefaultEntityContainer" : "true",
					"entitySet" : [ {
						"name" : "firstEntityQueryResults",
						"entityType" : "firstEntityQueryResultsType",
						"extensions" : [ {
							"name" : "addressable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "firstEntityQuery",
						"entityType" : "firstEntityQueryType",
						"extensions" : [ {
							"name" : "addressable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "secondEntityQueryResults",
						"entityType" : "secondEntityQueryResultsType",
						"extensions" : [ {
							"name" : "addressable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "secondEntityQuery",
						"entityType" : "secondEntityQueryType",
						"extensions" : [ {
							"name" : "addressable",
							"value" : "false",
							"namespace" : "http://www.sap.com/Protocols/SAPData"
						} ]
					}, {
						"name" : "thirdEntityDirectlyAddressableQueryResults",
						"entityType" : "thirdEntityDirectlyAddressableQueryResultsType"
					} ],
					"associationSet" : [ {
						"name" : "firstEntityQuery_firstEntityQueryResults",
						"association" : "firstEntityQuery_firstEntityQueryResultsType",
						"end" : [ {
							"role" : "firstEntityQueryPrincipal",
							"entitySet" : "firstEntityQuery"
						}, {
							"role" : "firstEntityQueryResultsDependent",
							"entitySet" : "firstEntityQueryResults"
						} ]
					}, {
						"name" : "secondEntityQuery_secondEntityQueryResults",
						"association" : "secondEntityQuery_secondEntityQueryResultsType",
						"end" : [ {
							"role" : "secondEntityQueryPrincipal",
							"entitySet" : "secondEntityQuery"
						}, {
							"role" : "secondEntityQueryResultsDependent",
							"entitySet" : "secondEntityQueryResults"
						} ]
					} ]
				} ]
			} ]
		}
	},
	pathPersistenceMetadata : {
		"version" : "1.0",
		"dataServices" : {
			"dataServiceVersion" : "2.0",
			"schema" : [ {
				"namespace" : "sap.hba.apps.reuse.apf.s.logic",
				"entityType" : [ {
					"name" : "AnalysisPath",
					"key" : {
						"propertyRef" : [ {
							"name" : "AnalysisPath"
						} ]
					},
					"property" : [ {
						"name" : "AnalysisPath",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "32"
					}, {
						"name" : "AnalysisPathName",
						"type" : "Edm.String",
						"nullable" : "false",
						"maxLength" : "100"
					}, {
						"name" : "CreationUTCDateTime",
						"type" : "Edm.DateTime",
						"nullable" : "false"
					}, {
						"name" : "SerializedAnalysisPath",
						"type" : "Edm.String",
						"maxLength" : "2147483648"
					}, {
						"name" : "StructuredAnalysisPath",
						"type" : "Edm.String",
						"maxLength" : "2147483648"
					} ],
					"extensions" : [ {
						"name" : "semantics",
						"value" : "aggregate",
						"namespace" : "http://www.sap.com/Protocols/SAPData"
					} ]
				} ],
				"entityContainer" : [ {
					"name" : "apf",
					"isDefaultEntityContainer" : "true",
					"dataEntitySet" : [ {
						"name" : "AnalysisPath",
						"entityType" : "sap.hba.apps.reuse.apf.s.logic.AnalysisPath"
					} ]
				} ]
			} ]
		}
	},
	analyticalConfiguration : {
		"version" : "1.0",
		"dataServices" : {
			"dataServiceVersion" : "2.0",
			"schema" : [ {
				"entityContainer" : [],
				"entityType" : [ {
					"key" : {},
					"name" : "AnalyticalConfigurationQueryResultsType",
					"property" : [ {
						"extensions" : [],
						"maxLength" : "32",
						"name" : "AnalyticalConfiguration",
						"nullable" : "false",
						"type" : "Edm.String"
					} ]
				} ],
				"namespace" : "tmp.apf.config.odata.AnalyticalConfiguration"
			} ]
		}
	},
	annotation : {
		"annotationReferences" : {},
		"propertyExtensions" : {},
		"propertyAnnotations" : {
			"dummy.firstEntityQueryType" : {
				"firstProperty" : {
					"dummy.Text" : {
						"Path" : "firstPropertyTextProperty"
					}
				},
				"P_SecondParameter" : {
					"dummy.DefaultValue" : {
						"String" : "secondParamDefaultValue"
					}
				}
			},
			"dummy.secondEntityQueryType" : {
				"P_FirstParameter" : {
					"dummy.DefaultValue" : {
						"Int" : "firstParamDefaultValue"
					}
				}
			}
		}
	},
	pathPersistenceAnnotation : {
		"annotationReferences" : {},
		"sap.hba.apps.reuse.apf.s.logic.AnalysisPath" : {
			"Sap.Apf.MaximumNumberOfSteps" : {
				"Int" : "32"
			},
			"SapCommon.MaxOccurs" : {
				"Int" : "255"
			}
		}
	}
};