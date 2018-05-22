/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.OData");
sap.suite.ui.smartbusiness.lib.OData = (function() {
    var modelCache  = {};
    var cacheO4Analytics ={};
    function getOD4AObject(oModel) {
    	if(oModel && oModel.sServiceUrl) {
    		if(cacheO4Analytics[oModel.sServiceUrl]) {
    			return cacheO4Analytics[oModel.sServiceUrl];
    		}
    	}
        var O4A = new sap.ui.model.analytics.odata4analytics.Model(sap.ui.model.analytics.odata4analytics.Model.ReferenceByModel(oModel));
        if(oModel && oModel.sServiceUrl) {
        	cacheO4Analytics[oModel.sServiceUrl] = O4A;
        }
        return O4A;
    };
    return {
        getModelByServiceUri : function(sServiceUri,useCache) {
        	// temp fix
        	var modelerRef = new sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
        	sServiceUri = modelerRef.addSystemToServiceUrl(sServiceUri);
            if(typeof sServiceUri == 'string') {
                if(!modelCache[sServiceUri]) {
                    var oModel = new sap.ui.model.odata.ODataModel(sServiceUri,true);
                    modelCache[sServiceUri] = oModel;
                }
                return modelCache[sServiceUri];
            }
            return sServiceUri;
        },
        getUri : function(params) {
            /*
             * params will be an object
             * { 
             *    oDataModel : "String Relative Uri" OR sap.ui.model.odata.ODataModel Object,
             *    serviceUri : "string"
             *    entitySet : "string",
             *    filter : [] //array of {NAME : 'x', VALUE_1 : 'val', VALUE_2 : 'val2', OPERATOR : 'BT/EQ', TYPE:'FI/PA'}
             *    dimension : ["A","B"] OR "A" OR "A,B"
             *    measure :   array of String OR one String OR comma separated String
             *    dataLimit : intervalue value to limit number of records;
             *    includeDimensionKeyTextAttribute : true/false, default true
             *    includeMeasureRawFormattedValueUnit : true/false, default True,
             *    sort : [{name:'DIm1',order:'asc'},{name:'Msr2',order:desc}]
             * } 
             */
        	
            function _replaceSingleQuoteWithDoubleSingleQuote(str) {
            	if(str && str.replace){
            		str=str.replace(/'/g,"''");
            	}
                return str;
            }
            function getExplicitMeasuresToBeAdded(aSort,aMsr){
            /* Measures present in sort*/
            	var aReturn=[];
            	if(aSort && aSort.length){
                	aSort.forEach(function(oSort){
                		if(aMsr.indexOf(oSort.name)!=-1){
                			aReturn.push(oSort.name);
                		}
                	});
            	}
            	return aReturn;
            }
            
            function getExplicitDimensionsToBeAdded(aSort,aMapping){
            	/*
            	 * In sort either the dimension or text property can be present.
            	 * This function returns an array of dimensions related to dimension/textproperty
            	 * */
            	var aReturnDims=[];
            	if(aSort && aSort.length){
                	aSort.forEach(function(oSort){
                		if(aMapping[oSort.name]){
                			aReturnDims.push(aMapping[oSort.name]);
                		}
                	});
            	}
            	return aReturnDims;
            }
            
            try {
                var O4A = getOD4AObject(this.getModelByServiceUri(params.oDataModel || params.serviceUri));
                var oQueryResult = O4A.findQueryResultByName(params.entitySet);
                var oQueryResultRequest = new sap.ui.model.analytics.odata4analytics.QueryResultRequest(oQueryResult);
                
                /* Adding Measures */
                var measures = params.measure;
                if(measures) {
                    if(typeof measures == 'string') {
                        measures = measures.split(",");
                    }
                    var allMeasures=this.getAllMeasures(params.serviceUri,params.entitySet);
                    oQueryResultRequest.setMeasures(measures.concat(getExplicitMeasuresToBeAdded(params.sort,allMeasures)));
                    if(typeof params.includeMeasureRawFormattedValueUnit == 'undefined') {
                        params.includeMeasureRawFormattedValueUnit = true;
                    }
                    if(params.includeMeasureRawFormattedValueUnit) {
                        oQueryResultRequest.includeMeasureRawFormattedValueUnit(null, true, true, true);
                    }
                }
                
                /* Adding Dimensions*/
                var dimensions = params.dimension||[];
                if(dimensions) {
                    if(typeof dimensions == 'string') {
                        dimensions = dimensions.split(",");
                    }
                    /*
                     *adding the sortby dimensions to select 
                     */
                    var propertyToDimensionMap=this.getPropertyToDimensionMap(O4A.getODataModel().sServiceUrl,params.entitySet);

                    oQueryResultRequest.addToAggregationLevel(dimensions.concat(getExplicitDimensionsToBeAdded(params.sort,propertyToDimensionMap)));
                    if(typeof params.includeDimensionKeyTextAttribute == 'undefined') {
                        params.includeDimensionKeyTextAttribute = true;
                    }
                    if(params.includeDimensionKeyTextAttribute) {
                        oQueryResultRequest.includeDimensionKeyTextAttributes(null, true, true, null);
                    }
                }
                /*
                 * adding orderby
                 * */
                var sortExpression = oQueryResultRequest.getSortExpression();
                sortExpression.clear();//clearing previous sort conditions
                var sortEntry={};//to keep track of sorts already added, so that only unique sorts are added
                if(params.sort && params.sort.length) {
                	params.sort.forEach(function(oSort){
                		if(!sortEntry[oSort.name]){
                			sortExpression.addSorter( oSort.name,oSort.order);
                			sortEntry[oSort.name]=true;
                		}
                	});
                }
                

                /*Adding Input Params And Filters*/
                if(params.filter && params.filter.length) {
                    var variants = params.filter;
                    var filterVariants = new Array();
                    var inputParamsVariants = new Array();
                    for(var i=0, l = variants.length; i<l; i++) {
                        var each = variants[i];
                        if(each.VALUE_1=="SAP_SMARTBUSINESS_NULL")
                        	continue;
                        if(each.TYPE === "PA") {
                            inputParamsVariants.push(each);
                        } else if(each.TYPE === "FI") {
                            filterVariants.push(each);
                        }
                    }
                    function changeToYYYYMMDDHHMMSS(odate){ 
                        var dateStr = odate.toJSON();
                        var lastChar = dateStr.charAt(dateStr.length-1).toUpperCase();
                        if(lastChar.charCodeAt(0) >= 65 && lastChar.charCodeAt(0) <= 90) {
                            dateStr = dateStr.slice(0,-1);
                        }
                        return dateStr;
                    }
                    function _processODataDateTime(junkValue) {
                        if(junkValue) {
                            try {
                                if(junkValue == +junkValue) {
                                    junkValue = window.parseInt(junkValue);
                                }
                                var date = new Date(junkValue);
                                var time = date.getTime();
                                if(isNaN(time)) {
                                    return junkValue;
                                } else {
                                    return changeToYYYYMMDDHHMMSS(date);
                                }
                            }catch(e) {

                            }
                        }
                        return junkValue;
                    }
                    if(filterVariants.length) {
                        var oFilterExpression = oQueryResultRequest.getFilterExpression();
                        for(var i=0, l=filterVariants.length; i<l; i++) {
                            var each = filterVariants[i];
                            if(this.getEdmType(params.serviceUri, each.NAME) == "Edm.DateTime") {
                                each.VALUE_1 = _processODataDateTime(each.VALUE_1);
                                each.VALUE_2 = _processODataDateTime(each.VALUE_2);
                            }
                            each.VALUE1=(each.VALUE_1 && each.VALUE_1.replace)?each.VALUE_1.replace(/\|\^/g,","):each.VALUE_1;
                            if(each.OPERATOR == sap.ui.model.FilterOperator.BT) {
                                oFilterExpression.addCondition(each.NAME,each.OPERATOR,_replaceSingleQuoteWithDoubleSingleQuote(each.VALUE_1),each.VALUE_2);
                            } else {
                                oFilterExpression.addCondition(each.NAME, each.OPERATOR, _replaceSingleQuoteWithDoubleSingleQuote(each.VALUE_1), null);
                            }

                        }
                    }
                    if(inputParamsVariants.length) {
                    	if (oQueryResult.getParameterization()) {
                            var oParamRequest = new sap.ui.model.analytics.odata4analytics.ParameterizationRequest(oQueryResult.getParameterization());
                            var paramererizationObj = oQueryResult.getParameterization();
                            var eachInputParam, findParameter, peerInterval, fromVal,toVal,toValParam ; 
                            for (var y = 0, z = inputParamsVariants.length; y < z; y++) {
                                eachInputParam = inputParamsVariants[y];
                                findParameter = paramererizationObj.findParameterByName(eachInputParam.filterPropertyName);
                                                       if(findParameter.isIntervalBoundary() === true && findParameter.isLowerIntervalBoundary() === true){
                                                              peerInterval = findParameter.getPeerIntervalBoundaryParameter();
                                                              toValParam = peerInterval.getPeerIntervalBoundaryParameter();
                                                              for(var i = 0, l = inputParamsVariants.length; i < l; i++) {
                                                                     if(inputParamsVariants[i].filterPropertyName === toValParam) {
                                                                           toVal = _replaceSingleQuoteWithDoubleSingleQuote(inputParamsVariants[i].value);
                                                                           break;
                                                                     }
                                                              }
                                                              fromVal = _replaceSingleQuoteWithDoubleSingleQuote(eachInputParam.value);
                                                              if(toVal) {
                                                                     oParamRequest.setParameterValue(eachInputParam.filterPropertyName,fromVal,toVal);
                                                              }
                                                              else {
                                                                     //Handle error case Boundary Value not found
                                                              }
                                                       }
                                                       else if(findParameter.isIntervalBoundary()===true && findParameter.isLowerIntervalBoundary() === false) {
                                                              // Do nothing for upper Boundary
                                                       }
                                                       else{
                                                              oParamRequest.setParameterValue(eachInputParam.filterPropertyName,_replaceSingleQuoteWithDoubleSingleQuote(eachInputParam.value));
                                                       }
                            }
                            oQueryResultRequest.setParameterizationRequest(oParamRequest);
                        }
                    }
                }
                var finalUri = oQueryResultRequest.getURIToQueryResultEntries();
                if(params.dataLimit) {
                    finalUri = finalUri + "&$top="+params.dataLimit;
                }
                return {uri : finalUri, model: O4A.getODataModel()};
            } catch(e) {
                jQuery.sap.log.error("Error Preparing Query Service Uri using OData4Analytics Library : "+e.toString());
                return null;
            }
        },
        getEdmType : function(sUri, propertyName,displayFormatRequired) {
        	function _getDisplayFormat(prop){
        		var format="None";
        		var extensions=prop.extensions||[];
        		for(var i=0;i<extensions.length;i++){
        			if(extensions[i].name=="display-format"){
        				format=extensions[i].value.toUpperCase();
        				break;
        			}
        		}
        		return format;
        	}
            var oDataModel = null;
            var returnValue=null;
            if(sUri instanceof sap.ui.model.odata.ODataModel) {
                oDataModel = sUri;
            } else  {
                oDataModel = this.getModelByServiceUri(sUri);
            }
            if(oDataModel && oDataModel.getServiceMetadata()) {
                var serviceMetaData = oDataModel.getServiceMetadata();
                var entitySets = serviceMetaData.dataServices.schema[0].entityType;
                if(entitySets) {
                    for(var i = 0; i<entitySets.length;i++) {
                        var entity = entitySets[i];
                        var properties = entity.property;
                        for(var j=0;j<properties.length;j++) {
                            var property=  properties[j];
                            if(property.name == propertyName) {
                            	if(displayFormatRequired){
                            		returnValue={type:property.type,format:_getDisplayFormat(property)};
                            	}else{
                            		returnValue=property.type;
                            	}
                            }
                        }
                    }
                }
            }
            return returnValue;
        },
        getAllEntitySet : function(sUri) {
            var entitySets = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                entitySets = o4a.getAllQueryResultNames();
            } catch(e) {
                jQuery.sap.log.error("Error fetching Enity Set : "+e.toString());
            }
            return entitySets;

        },
        measures : function(sUri, entitySet) {
            var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
            var queryResult = o4a.findQueryResultByName(entitySet);
            var measureNames = queryResult.getAllMeasureNames();
            return  {
              getAsStringArray : function() {
                  return measureNames;
              },
              getAsObjectArray : function(sKey) {
                  sKey = sKey || "name";
                  var measures = [];
                  measureNames.forEach(function(sMeasure){
                      var obj = {};
                      obj[sKey] = sMeasure;
                      measures.push(obj);
                  });
                  return measures;
              },
              getAsObjectArrayWithLabel : function(sOriginalKey, sLabelKey) {
                  sOriginalKey = sOriginalKey || "name";
                  sLabelKey = sLabelKey || "label";
                  var measures = [];
                  measureNames.forEach(function(sMeasure){
                      var oMeasure = queryResult.findMeasureByName(sMeasure);
                      var obj = {};
                      obj[sOriginalKey] = sMeasure;
                      obj[sLabelKey] = oMeasure.getLabelText() || sMeasure;
                      measures.push(obj);
                  });
                  return measures;
              },
              getUnitProperty : function(measureName) {
                  var oMeasure = queryResult.findMeasureByName(measureName);
                  if(oMeasure.getUnitProperty()) {
                      return oMeasure.getUnitProperty().name;
                  }
                  return null;
              }
            };
        },
        properties : function(sUri, entitySet) {
            var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
            var queryResult = o4a.findQueryResultByName(entitySet);
            var dimensionNames = queryResult.getAllDimensionNames();
            var measureNames = queryResult.getAllMeasureNames();
            return {
                getLabelMappingObject : function(aProperties) {
                    var mapping = {};
                    if(aProperties && aProperties.length) {
                        aProperties.forEach(function(property, index, array){
                            try {
                                var oDimension = queryResult.findDimensionByName(property);
                                mapping[property] = oDimension.getLabelText() || property;
                            } catch(e) {
                                var oMeasure = queryResult.findMeasureByName(property);
                                mapping[property] = oMeasure.getLabelText() || property;
                            }
                        });
                        return mapping;
                    } else {
                        dimensionNames.forEach(function(sDimension){
                            var oDimension = queryResult.findDimensionByName(sDimension);
                            mapping[sDimension] = oDimension.getLabelText() || sDimension;
                        });
                        measureNames.forEach(function(sMeasure){
                            var oMeasure = queryResult.findMeasureByName(sMeasure);
                            mapping[sMeasure] = oMeasure.getLabelText() || sMeasure;
                        });
                        return mapping;
                    }
                },
                getTextPropertyMappingObject : function(aProperties) {
                    var mapping = {};
                    if(aProperties && aProperties.length) {
                        aProperties.forEach(function(property, index, array){
                            try {
                                var oDimension = queryResult.findDimensionByName(property);
                                if(oDimension.getTextProperty()) {
                                    mapping[property] = oDimension.getTextProperty().name || property;
                                } else {
                                    mapping[property] = property;
                                }
                            } catch(e) {
                                jQuery.sap.log.error("Invalid Dimension Name : "+property);
                            }
                        });
                    } else {
                        dimensionNames.forEach(function(sDimension){
                            var oDimension = queryResult.findDimensionByName(sDimension);
                            if(oDimension.getTextProperty()) {
                                mapping[sDimension] = oDimension.getTextProperty().name || sDimension;
                            } else {
                                mapping[sDimension] = sDimension;
                            }
                        });
                        measureNames.forEach(function(sMeasure) {
                            var oMeasure = queryResult.findMeasureByName(sMeasure);
                            if(oMeasure.getFormattedValueProperty && oMeasure.getFormattedValueProperty()) {
                                mapping[sMeasure] = oMeasure.getFormattedValueProperty().name;
                            } else {
                                mapping[sMeasure] = null;
                            }
                        });
                    }
                    return mapping;
                },
                getUnitPropertyMappingObject : function() {
                    var mapping = {};
                    measureNames.forEach(function(sMeasure) {
                       var oMeasure = queryResult.findMeasureByName(sMeasure);
                       if(oMeasure.getUnitProperty()) {
                           mapping[sMeasure] = oMeasure.getUnitProperty().name;
                       } else {
                           mapping[sMeasure] = null;
                       }
                    });
                    return mapping;
                }                
            };
        },
        dimensions : function(sUri, entitySet) {
            var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
            var queryResult = o4a.findQueryResultByName(entitySet);
            var dimensionNames = queryResult.getAllDimensionNames();
            var oDimensions = queryResult.getAllDimensions();
            return {
            	all : function() {
            		return oDimensions;
            	},
                getAsStringArray : function() {
                    var entityType= queryResult.getEntityType();
                    return dimensionNames;
                },
                getAsObjectArray : function(sKey) {
                    sKey = sKey || "name";
                    var dimensions = [];
                    dimensionNames.forEach(function(sDimension){
                        var obj = {};
                        obj[sKey] = sDimension;
                        dimensions.push(obj);
                    });
                    return dimensions;
                },
                getAsObjectArrayWithLabel : function(sOriginalKey, sLabelKey) {
                    sOriginalKey = sOriginalKey || "name";
                    sLabelKey = sLabelKey || "label";
                    var dimensions = [];
                    dimensionNames.forEach(function(sDimension){
                        var oDimension = queryResult.findDimensionByName(sDimension);
                        var obj = {};
                        obj[sOriginalKey] = sDimension;
                        obj[sLabelKey] = oDimension.getLabelText() || sDimension;
                        dimensions.push(obj);
                    });
                    return dimensions;
                },
                getTextProperty : function(dimensionName) {
                    var oDimension = queryResult.findDimensionByName(dimensionName);
                    if(oDimension.getTextProperty()) {
                        return oDimension.getTextProperty().name;
                    }
                    return null;
                }
            }
        },
        filter : function(sUri, sEntitySet) {
        	var dimensions = this.dimensions(sUri, sEntitySet).all();
        	var oDimension;
        	return  {
        		getAsArray : function() {
        			var aReturnValue = [];
        			for(sDimension in dimensions) {
        				var oDimension = dimensions[sDimension]; 
    					var tempObject = {};
    					tempObject.name = sDimension;
        				oDimension._oProperty.extensions.forEach(function(oExtension) {
        					tempObject[oExtension.name] = oExtension.value;
        				});
						aReturnValue.push(tempObject);
        			}
        			return aReturnValue;
        		},
        		getAsObject : function() {
        			return dimensions;
        		},
        		getMandatoryList : function() {
        			var aReturnValue = [];
        			for(sDimension in dimensions) {
        				var oDimension = dimensions[sDimension]; 
        				oDimension._oProperty.extensions.forEach(function(oExtension) {
        					if(oExtension.name === "required-in-filter" && oExtension.value == "true") {
        						aReturnValue.push(sDimension);
        					}
        				});
        			}
        			return aReturnValue;
        		}
        	};
        },
        getAllMeasures : function(sUri, entitySet) {
            var measures = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                measures = queryResult.getAllMeasureNames();
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Measures : "+e.toString());
            }
            return measures;
        },
        getAllMeasuresWithLabelText : function(sUri, entitySet) {
            var measures = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var measureNames = queryResult.getAllMeasureNames();
                for(var i=0; i<measureNames.length; i++) {
                    var each = measureNames[i];
                    var oMeasure = queryResult.findMeasureByName(each);
                    measures.push({
                        key : each,
                        value : oMeasure.getLabelText()
                    });
                }
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Measures : "+e.toString());
            }
            return measures;
        },
        isTimeZoneIndependent:function(sUri,entitySet){
        	var isTimeZoneInDependent=false;
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var entityType= queryResult.getEntityType();
                var allProperties=entityType._oPropertySet;
                for(var each in allProperties){
                	if(each.match(/TimeZone$/gi)){
                		isTimeZoneInDependent=true;
                		//break;
                	}
                }
            } catch(e) {
                jQuery.sap.log.error("TimeZone dependency check failed : "+e.toString());
            }
            return isTimeZoneInDependent;
        },
        getAllFilterables : function(sUri, entitySet) {
            var aFilterablePropertyNames = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var entityType= queryResult.getEntityType();
                aFilterablePropertyNames = entityType.getFilterablePropertyNames();
            } catch(e) {
                jQuery.sap.log.error("Error Fetching Filterable dimensions : "+e.toString());
            }
            return aFilterablePropertyNames;
        },
        getSortableProperties:function(sUri,entitySet){
            var aSortableProperties = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var entityType= queryResult.getEntityType();
                aSortableProperties = entityType.getSortablePropertyNames();
            } catch(e) {
                jQuery.sap.log.error("Error Fetching Sortable dimensions : "+e.toString());
            }
            return aSortableProperties;
        },
        getPropertyToDimensionMap:function(sUri,entitySet){
        	var propertyToDimensionMap={};
        	var dimensions = this.getAllDimensionsWithProperty(sUri, entitySet);
        	var curDimName;
        	var curTextProperty;
        	for(var curDimName in dimensions){
        		propertyToDimensionMap[curDimName]=curDimName;
        		if((curTextProperty=dimensions[curDimName].getTextProperty())){
        			propertyToDimensionMap[curTextProperty.name]=curDimName;
        		}
        	}
            return propertyToDimensionMap;
        },
        getAllDimensions:function(sUri,entitySet){
            var dimensions = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                dimensions = queryResult.getAllDimensionNames()||[];
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Dimesions : "+e.toString());
            }
            return dimensions;
        
        },
        getAllFilterableDimensions : function(sUri, entitySet) {
            function intersectionOfArray(array1, array2) {
                var ai=0, bi=0;
                var result = new Array();
                while( ai < array1.length && bi < array2.length ){
                    if      (array1[ai] < array2[bi] ){ ai++; }
                    else if (array1[ai] > array2[bi] ){ bi++; }
                    else /* they're equal */
                    {
                        result.push(array1[ai]);
                        ai++;
                        bi++;
                    }
                }
                return result;
            }
            var dimensions = this.getAllDimensions(sUri, entitySet);
            var aFilterablePropertyNames = this.getAllFilterables(sUri, entitySet);
            return intersectionOfArray(aFilterablePropertyNames.sort(),dimensions.sort());
        },
        getAllFilterableDimensionsWithProperty : function(sUri, entitySet) {
        	function intersectionOfArray(array1, array2) {
                var ai=0, bi=0;
                var result = {};
                while( ai < array1.length && bi < array2.length )
                {
                    if      (array1[ai] < array2[bi] ){ ai++; }
                    else if (array1[ai] > array2[bi] ){ bi++; }
                    else /* they're equal */
                    {
                        result[array1[ai]] = dimensionsObject[array1[ai]];
                        ai++;
                        bi++;
                    }
                }
                return result;
            }
            try {
            	var aResult={};
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var dimensions = queryResult.getAllDimensionNames()||[];
                var dimensionsObject = queryResult.getAllDimensions() || {};
                var aFilterablePropertyNames = this.getAllFilterables(sUri, entitySet);
                aResult= intersectionOfArray(aFilterablePropertyNames.sort(),dimensions.sort());
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Dimesions : "+e.toString());
            }
            return aResult;
        },
        getAllDimensionsWithProperty : function(sUri, entitySet) {
            try {
            	var aResult={};
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var aResult = queryResult.getAllDimensions() || {};
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Dimesions : "+e.toString());
            }
            return aResult;
        },
        getAllDimensionsWithLabelText : function(sUri, entitySet) {
            var dimensions = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                var dimensionNames = queryResult.getAllDimensionNames();
                for(var i=0; i<dimensionNames.length ;i++) {
                    var each = dimensionNames[i];
                    var oDimension = queryResult.findDimensionByName(each);
                    var textProperty = null;
                    if(oDimension.getTextProperty() != null)textProperty = oDimension.getTextProperty().name;
                    dimensions.push({
                        key : each,
                        value : oDimension.getLabelText(),
                        textProperty: textProperty
                    });
                }
            } catch(e) {
                jQuery.sap.log.error("Error Fetching All Dimesions : "+e.toString());
            }
            return dimensions;
        },
        getAllInputParams : function(sUri, entitySet) {
            var inputParams = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                if(queryResult.getParameterization()) {
                    var oParams = queryResult.getParameterization();
                    inputParams = oParams.getAllParameterNames();
                }
            } catch(e) {
                jQuery.sap.log.error("Error Fetching Input Params : "+e.toString());
           }
            return inputParams;
        },
        getAllInputParamsWithFlag : function(sUri, entitySet) {
            var inputParams = new Array();
            try {
                var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
                var queryResult = o4a.findQueryResultByName(entitySet);
                if(queryResult.getParameterization()) {
                    var oParams = queryResult.getParameterization();
                    var inputParamsArray = oParams.getAllParameterNames();
                    for(var i=0; i<inputParamsArray.length; i++) {
                        var each = inputParamsArray[i];
                        var paramObject  = oParams.findParameterByName(each);
                        inputParams.push({
                            name : each,
                            optional : paramObject.isOptional()
                        });
                    }
                }
            } catch(e) {
                jQuery.sap.log.error("Error Fetching Input Params : "+e.toString());
            }
            return inputParams;
        },
        formatOdataEdmTimeToString : function (value){
            if(value && value.constructor.name == "Object"){
                if(value.__edmType=="Edm.Time"){
                    var milliseconds = value.ms;
                    var seconds = Math.floor((milliseconds / 1000) % 60 );
                    var minutes = Math.floor((milliseconds / 60000) % 60);
                    var hours   = Math.floor((milliseconds / 3600000) % 24);
                    return hours+"H"+minutes+"M"+seconds+"S";
                }
            }
            return value;
        },
        formatValue : function (val,scaleFactor,precision,MAX_LEN) {            
            MAX_LEN= MAX_LEN || 4;
            var unit={3:"K",6:"M",9:"B",12:"T",0:""};
            var temp,pre,suff;
            temp=Number(val).toPrecision(MAX_LEN);
            pre=Number(temp.split("e")[0]);
            suff=Number(temp.split("e")[1])||0;
            if(!val && val!=0)
                return {value:"",unitPrefix:""};

                if(suff%3!=0){
                    if(suff%3==2){
                        if(suff+1==scaleFactor){
                            suff=suff+1;
                            pre=pre/10;
                        }
                        else{
                            suff=suff-2;
                            pre=pre*100;
                        }
                    }
                    else{
                        if(suff+2==scaleFactor){
                            suff=suff+2;
                            pre=pre/100;

                        }
                        else{
                            suff--;
                            pre=pre*10;
                        }
                    }
                }

                else if(suff==15){
                    pre=pre*1000;
                    suff=12;
                }
                pre+="";

                if((pre).indexOf(".")<MAX_LEN){
                    pre=Number(pre).toPrecision(MAX_LEN);
                    var currPrec=pre.split(".")[1]?pre.split(".")[1].length:0;
                    if((precision || precision==0)&& precision<currPrec){
                        pre=Number(pre).toFixed(precision);
                    }


                }
                else
                    pre=Number(pre).toPrecision(MAX_LEN);
                return {value:Number(pre),unitPrefix:unit[suff]};
                },
                
                
                
                getFormattingMetadata: function(sUri, entitySet, propertyName) {
                 	
                	var formattingMetadata = {};
	               	 formattingMetadata._hasCurrency = false;
	               	 formattingMetadata._hasSapText = false;
	               	 
	               	 var o4a = getOD4AObject(this.getModelByServiceUri(sUri));
	                    var queryResult = o4a.findQueryResultByName(entitySet);
	                    
	                    var measures = queryResult.getAllMeasures();
	                    
	                    if (measures[propertyName] ) {
	                    	
	                    	var sapTextPropertyName = (measures[propertyName]._oTextProperty && measures[propertyName]._oTextProperty.name) ? 
	                                 measures[propertyName]._oTextProperty.name : "";
	                                 
	                    	if (sapTextPropertyName != "") {
	                    		formattingMetadata._hasSapText = true;
	                    		formattingMetadata._sapTextColumn = sapTextPropertyName;
							}
	                    	else if(measures[propertyName].hasOwnProperty("_oUnitProperty")){
	                    		var extensions = measures[propertyName]._oUnitProperty.extensions;
			       				for (var i = 0; i < measures[propertyName]._oUnitProperty.extensions.length; i++) {
			       					if (extensions[i].name === "semantics" && extensions[i].value === "currency-code") {
			       						formattingMetadata._hasCurrency = true;
			       						formattingMetadata._currencyColumn =  measures[propertyName]._oUnitProperty.name;
			       					}
			       				}
	                    	}
		                   	
				       	}
	                    
                   return formattingMetadata; 
                       }

    };
})();
