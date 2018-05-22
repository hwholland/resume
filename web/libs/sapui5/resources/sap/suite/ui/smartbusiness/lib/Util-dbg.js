/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.Util");
jQuery.sap.require("sap.ui.model.analytics.odata4analytics");
jQuery.sap.require("sap.m.MessageBox");

sap.suite.ui.smartbusiness.lib.Util = sap.suite.ui.smartbusiness.lib.Util || {};
sap.suite.ui.smartbusiness.lib.Util.odata = (function() {
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
    	getModelByServiceUri : function(sServiceUri,callback) {
            var oModel;
             var tileComponentCache;
             var sServiceUriWithSysteInfo;
             var modelerRef = new sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
             var odataPropObj = {};
             sServiceUri = sServiceUri.replace(/;(.)*$/gi,""); // sometimes tile cache is set without system info in the url. to check for both the cases
             sServiceUriWithSysteInfo = modelerRef.addSystemToServiceUrl(sServiceUri);
             try{ // if app is launched through tile, then use the metadata from the tile component cache
                 tileComponentCache = sap.ushell.components.tiles.indicatorTileUtils.util;
                 // check for the model in the ushell tiles metadata cache
                 if((oModel = (tileComponentCache.getODataModelByServiceUri(sServiceUri) || tileComponentCache.getODataModelByServiceUri(sServiceUriWithSysteInfo)))){
                     if(oModel) {
                     if(callback) {
                            callback(oModel);
                         }
                     } else {
                     // check for the model in the drilldown metadata cache
                     if(modelCache[sServiceUri]) {
                            if(callback) {
                                   callback(modelCache[sServiceUri]);
                             }
                            oModel = modelCache[sServiceUri]
                     } else {
                            if(callback) {
                                   odataPropObj = {
                                          json : true,
                                          loadMetadataAsync : true
                                     };
                            } else {
                                   odataPropObj = true;
                            }
                            // create the model async and on metadata load update cache
                            oModel = new sap.ui.model.odata.ODataModel(sServiceUri, odataPropObj);
                            modelCache[sServiceUri] = oModel;
                            if(callback) {
                                   modelCache[sServiceUri].attachMetadataLoaded(function(oModel){
                                   if(callback) {
                                          callback(oModel);
                                   }
                                 });
                            } 
                      }
                     }
                     return oModel;
                 }    
             }catch(e){
                 if(typeof sServiceUri == 'string') {
                      if(modelCache[sServiceUri]) {
                            if(callback) {
                            callback(modelCache[sServiceUri]);
                         }
                            oModel = modelCache[sServiceUri]
                      } else {
                            if(callback) {
                                   odataPropObj = {
                                   json : true,
                                   loadMetadataAsync : true
                                 };
                            } else {
                                   odataPropObj = true;
                            }
                            // create the model async and on metadata load update cache
                            oModel = new sap.ui.model.odata.ODataModel(sServiceUri, odataPropObj);
                            modelCache[sServiceUri] = oModel;
                            if(callback) {
                                   modelCache[sServiceUri].attachMetadataLoaded(function(){
                                   if(callback) {
                                          callback(modelCache[sServiceUri]);
                                   }
                             });
                            } 
                      }
                      return oModel;
                 }
                 return sServiceUri;
             }
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
                            var eachInputParam, findParameter, fromVal,toVal,toValParam;
                            for (var y = 0, z = inputParamsVariants.length; y < z; y++) {
                                eachInputParam = inputParamsVariants[y];
                                findParameter = paramererizationObj.findParameterByName(eachInputParam.NAME);
                                if (findParameter.isIntervalBoundary() === true && findParameter.isLowerIntervalBoundary() === true){
                                    //peerInterval = findParameter.getPeerIntervalBoundaryParameter();
                                    toValParam = findParameter.getPeerIntervalBoundaryParameter();
                                    for (var i = 0, l = inputParamsVariants.length; i < l; i++) {
                                        if (inputParamsVariants[i].NAME === toValParam.getName()) {
                                            toVal = _replaceSingleQuoteWithDoubleSingleQuote(inputParamsVariants[i].VALUE_1);
                                            break;
                                        }
                                    }
                                    fromVal = _replaceSingleQuoteWithDoubleSingleQuote(eachInputParam.VALUE_1);
                                    if (toVal) {
                                        oParamRequest.setParameterValue(eachInputParam.NAME,fromVal,toVal);

                                    }
                                } else if (findParameter.isIntervalBoundary() === true && findParameter.isLowerIntervalBoundary() === false) {
                                    // Do nothing for upper Boundary
                                    jQuery.sap.log.info("Future development");
                                } else {
                                    oParamRequest.setParameterValue(eachInputParam.NAME,_replaceSingleQuoteWithDoubleSingleQuote(eachInputParam.VALUE_1));
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
            return {
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

sap.suite.ui.smartbusiness.lib.Util.cache = (function() {
    var BIGMAP = {};
    var DATAMAP = {};
    var sessionContext = "HANA_CLIENT";
    return {
        getCacheHanaClient : function(){
            if(BIGMAP[sessionContext]){
                return BIGMAP[sessionContext];
            }
            return null;
        },
        setCacheHanaClient : function(data){
            BIGMAP[sessionContext] = data;
        },
        getEvaluationById : function(key) {
            if(BIGMAP[key]) {
                return BIGMAP[key];
            } 
            return null; 
        },
        setEvaluationById : function(key, data) {
            BIGMAP[key] = data;
        },
        getKpiDetailsById : function(key) {
            if(DATAMAP[key]) {
                return DATAMAP[key];
            } 
            return null; 
        },
        setKpiDetailsById : function(key, data) {
            DATAMAP[key] = data;
        },
        invalidateKpiDetailsCache : function(){
            DATAMAP = {};
        },
        current_calls : {}
    }
})();
/**
 * Show error message
 */
sap.suite.ui.smartbusiness.lib.Util.utils = (function(){
    return {
        convertHexToRgba : function(color/*in Hexadecimal*/, opacity) {
            opacity = opacity || "1.0";
            var hexCodeRegex = /^(#[a-fA-F0-9]{3}$)|(#[a-fA-F0-9]{6}$)/;
            if(color.match(hexCodeRegex)) {
                var matches = color.match(/^#([A-Fa-f0-9]{1,2})([A-Fa-f0-9]{1,2})([A-Fa-f0-9]{1,2})$/);
                var aColors = [];
                matches.forEach(function(colorCode, index) {
                    if(index > 0) {
                        if(colorCode.length == 1) {
                            colorCode += colorCode; 
                        }
                        aColors.push(colorCode);
                    } 
                });
                var rgba = "rgba(";
                aColors.forEach(function(hexColorCode) {
                    //converto decimal
                    rgba += window.parseInt(hexColorCode, 16)+",";
                });
                rgba += (opacity +")");
                return rgba;
            }
            jQuery.sap.log.error("Not a valid Hex Color Code : "+color);
            return color;
        },
        /* this function is to override sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem
         * where only search needs to be done on title and tags
         */
        applySearchPatternToListItem : function(oItem, sFilterValue) {
            if (sFilterValue == "") {
                return true;
            }
            var propertyList = oItem.getBindingContext(this.sModelName).getProperty();
            for (var key in propertyList) {
                if(key != "TITLE") {
                    continue;
                }
                var currentValue = propertyList[key];
                if (typeof currentValue == "string") {
                    if (currentValue.toLowerCase().indexOf(sFilterValue) != -1) {
                        return true;
                    }
                }
            }
            if ((oItem.getIntro() && oItem.getIntro().toLowerCase().indexOf(sFilterValue) != -1) || (oItem.getTitle() && oItem.getTitle().toLowerCase().indexOf(sFilterValue) != -1) || (oItem.getNumber() && oItem.getNumber().toLowerCase().indexOf(sFilterValue) != -1) || (oItem.getNumberUnit() && oItem.getNumberUnit().toLowerCase().indexOf(sFilterValue) != -1) || (oItem.getFirstStatus() && oItem.getFirstStatus().getText().toLowerCase().indexOf(sFilterValue) != -1) || (oItem.getSecondStatus() && oItem.getSecondStatus().getText().toLowerCase().indexOf(sFilterValue) != -1)) {
                return true;
            }
            var dependents = oItem.getDependents();
            for(var x=0,l=dependents.length; x<l; x++) {
                if(dependents[x].getText() && dependents[x].getText().toLowerCase().indexOf(sFilterValue) != -1) {
                    return true;
                }
            }

            return false;
        },

        //Code Copied from Shell
        addSystemToServiceUrl : function(sServiceUrl, sSystem) {
            if(sSystem) {
                if (sServiceUrl.indexOf('/') !== 0 || sServiceUrl.indexOf('//') === 0) {
                    throw new Error("addSystemToServiceUrl: Invalid URL: " + sServiceUrl,"sap.suite.ui.smartbusiness.lib.Util.utils");
                }
                //sSystem = sSystem || this.getSystemAlias();
                if (/^[^?]*(;o=([\/;?]|$))/.test(sServiceUrl)) { // URL with ";o=" *not* followed by system
                    return sServiceUrl.replace(/;o=([\/;?]|$)/, (sSystem ? ";o=" + sSystem : "") + "$1");
                }
                if (/^[^?]*;o=/.test(sServiceUrl)) { // URL with ";o=" followed by system
                    return sServiceUrl;
                }
                if (sSystem) { // there is no marker for system in the URL so add system to last segment
                    return sServiceUrl.replace(/(\/[^?]*?)(\/$|$|(\/?\?.*))/, "$1;o=" + sSystem + "$2");
                }
            } else {
                jQuery.sap.log.warning("Not adding System to Service URL : "+sServiceUrl);
            }
            return sServiceUrl;
        },
        showErrorMessage: function(errorMessage, detailErrorMessage){

            var MessageBox = sap.m.MessageBox;
            if(detailErrorMessage==null || detailErrorMessage==''){
                MessageBox.show(errorMessage, {
                    icon: MessageBox.Icon.ERROR,
                    title: "Error",
                    actions: [MessageBox.Action.OK],
                });
            }
            else{
                MessageBox.show(errorMessage, {
                    icon: MessageBox.Icon.ERROR,
                    title: "Error",
                    actions: [MessageBox.Action.OK],
                    details: detailErrorMessage,
                });
            }
        },

        handleMessagePopover : function(event,oController){
            var that =this;

            var errorModel = new sap.ui.model.json.JSONModel();
            errorModel.setData({
                messagesLength : oController.errorMessages.length,
                errorMessages : oController.errorMessages
            });
            var oMessageTemplate = new sap.m.MessagePopoverItem({
                type: '{type}',
                title: '{title}',
                description: '{description}'
            });

            var oMessagePopover = new sap.m.MessagePopover({
                items: {
                    path: '/errorMessages',
                    template: oMessageTemplate
                }
            });
            oMessagePopover.setModel(errorModel);
            if(event){
                oMessagePopover.openBy(event.getSource());
            }
        },

        setErrorState : function(oController){
            if(oController.errorMessages.length>1){
                oController.setBtnEnabled("errorBtn",true);
                oController.errorState = true;
            }
            else{
                oController.setBtnEnabled("errorBtn",false);
                oController.errorState = false;
            }
        },



        getMantissaLength : function(num){
            var sNum = num.toString();
            var initPos = 0;
            if(num < 0){
                initPos = 1;
            }
            return (sNum.indexOf('.') === -1 ) ? (num < 0 ? sNum.length -1:sNum.length):  
                sNum.substring(initPos, sNum.indexOf('.')).length;
        },
        getLocaleFormattedValue : function(num, oScale, oDecimal){
            //var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
            var sD = 2;
            var oFormatOptions = {
                    style : "short"
            };
            var fNum;
            if(!(oDecimal==-1 || oDecimal==null)){
                oFormatOptions.shortDecimals=oDecimal;
            }
            var valFormatter = sap.ca.ui.model.format.NumberFormat.getInstance(oFormatOptions);
            if(oScale == -2) {
                if(num > 9999) {
                    fNum = "????";
                } else if(num < 0.001) {
                    fNum = "0";
                } else {
                    if(num.toString().indexOf('.') != -1) {
                        fNum = Number(num).toFixed(4-num.toString().indexOf('.'));
                    } else {
                        fNum = Number(num);
                    } 
                    fNum = valFormatter.format(fNum);
                }
            } else if(oDecimal == -1 || oDecimal == null) {
                var mantissaLength  = this.getMantissaLength(num)
                if(!(mantissaLength % 3))
                    sD = 1;
                if(Math.abs(num) % Math.pow(10, mantissaLength-1) == 0) {
                    sD = 0;
                }
                else if((Math.abs(num) % Math.pow(10, mantissaLength-1)) < 6*Math.pow(10, mantissaLength - 4)) {
                    sD = 0;
                }                
                valFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({ style: "short" , shortDecimals:sD});
                fNum = valFormatter.format(num);
            } else {
                fNum = valFormatter.format(num);
            }
            return fNum;
        },

        getRandomNumber:function(max){
            return Math.floor(Math.random() * 10000) % max;
        },
        getObjectOrder:function (object_type) {
            var dictionary = {
                    TAGS : ["ID","IS_ACTIVE","TYPE","TAG"],
                    PROPERTIES : ["ID","IS_ACTIVE","TYPE","NAME","VALUE"],
                    EVALUATION_TEXTS : ["ID","IS_ACTIVE","LANGUAGE","TITLE","DESCRIPTION"],
                    INDICATOR_TEXTS : ["ID","IS_ACTIVE","LANGUAGE","TITLE","DESCRIPTION"],
                    CHIP_TEXTS : ["id","isActive","language","title","description"],
                    EVALUATION_VALUES : ["ID","IS_ACTIVE","TYPE","FIXED","COLUMN_NAME","ODATA_PROPERTY"],
                    EVALUATION_FILTERS : ["ID","IS_ACTIVE","TYPE","NAME","VALUE_1","OPERATOR","VALUE_2"],
                    ASSOCIATION_PROPERTIES : ["TYPE","SOURCE_INDICATOR","TARGET_INDICATOR","IS_ACTIVE","NAME","VALUE"],
                    APP_PARAMETERS: ["NAME","VALUE"],
                    AUTHORIZATION: ["NAME","TYPE"]
            };
            return dictionary[object_type];
        },

        getFilterArray: function(items, filterObject) {
            var filtersArray = [];
            var filters = {};
            for(var i=0,l=items.length; i<l; i++) {
                filters[items[i].getParent().getKey()] = filters[items[i].getParent().getKey()] || [];
                filters[items[i].getParent().getKey()].push(filterObject[items[i].getKey()]);
            } 

            for(var filter in filters) {
                filtersArray.push(new sap.ui.model.Filter(filters[filter], false));
            }
            return filtersArray;
        },

        dirtyBitCheck:function(obj)  {
            var oldPayload = obj.oldPayload;
            var newPayload = obj.newPayload;
            var type = obj.objectType;
            if((oldPayload instanceof Array) && (newPayload instanceof Array)) {
                var o = {};
                var n = {};
                var updateArr = [];
                var deleteArr = [];
                o = this.arrayToObject(oldPayload, type);
                n = this.arrayToObject(newPayload, type);

                for(var obj in n) {
                    if(!(o[obj])) {
                        updateArr.push(n[obj]);
                    }
                    else {
                        delete o[obj];
                    }
                }

                for(var obj in o) {
                    deleteArr.push(o[obj]);
                }

                return {
                    updates : updateArr,
                    deletes : deleteArr
                };
            }
            else if((oldPayload instanceof Object) && (newPayload instanceof Object)) {
                var updateObject = {};
                for(var key in newPayload) {
                    if(newPayload.hasOwnProperty(key)) {
                        if(newPayload[key] != oldPayload[key]) {
                            updateObject = newPayload;
                            if(type == "ASSOCIATIONS") {
                                return {updates : [updateObject], deletes : [oldPayload]};
                            }
                            return {updates : [updateObject]};
                        }
                    }
                }
                return {updates : []};
            }
        },

        updateChips: function (obj, model) {
            var indicators = null;
            var evaluations = null;

            model = model || new sap.ui.model.odata.ODataModel("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata", true);

            if(obj.INDICATORS) {
                indicators = obj.INDICATORS; 
            }
            else if(obj.EVALUATIONS) {
                evaluations = obj.EVALUATIONS; 
            }

            if(indicators && indicators.length) {
                for(var i=0,l=indicators.length; i<l; i++) {

                }
            }

            if(evaluations && evaluations.length) {
                for(var i=0,l=evaluations.length; i<l; i++) {
                    model.read(("/CHIPS?$filter=evaluationId eq '" + evaluations[i].EVALUATIONS.ID + "' and isActive eq 1"), null, null, false, function(data) {
                        if(data.results && data.results.length) {
                            var chips = data.results;
                            var updateBatch = [];
                            var values = [];
                            var filters = [];
                            var isUpdatesSuccessful = true;
                            var obj = {};
                            for(var j=0,m=chips.length; j<m; j++) {
                                var configuration = JSON.parse(chips[j].configuration);
                                var tileConfiguration = JSON.parse(configuration.tileConfiguration); 

                                for(var k=0,n=evaluations[i].EVALUATION_VALUES.length; k<n; k++) {
                                    obj = {};
                                    obj.TYPE = evaluations[i].EVALUATION_VALUES[k].TYPE;
                                    obj.FIXED = evaluations[i].EVALUATION_VALUES[k].FIXED;
                                    obj.COLUMN_NAME = evaluations[i].EVALUATION_VALUES[k].COLUMN_NAME;
                                    obj.ODATA_PROPERTY = evaluations[i].EVALUATION_VALUES[k].ODATA_PROPERTY;
                                    values.push(obj);
                                }

                                for(var k=0,n=evaluations[i].EVALUATION_FILTERS.length; k<n; k++) {
                                    obj = {};
                                    obj.TYPE = evaluations[i].EVALUATION_FILTERS[k].TYPE;
                                    obj.NAME = evaluations[i].EVALUATION_FILTERS[k].NAME;
                                    obj.VALUE_1 = evaluations[i].EVALUATION_FILTERS[k].VALUE_1;
                                    obj.OPERATOR = evaluations[i].EVALUATION_FILTERS[k].OPERATOR;
                                    obj.VALUE_2 = evaluations[i].EVALUATION_FILTERS[k].VALUE_2;
                                    filters.push(obj);
                                }

                                tileConfiguration.EVALUATION = JSON.stringify(evaluations[i].EVALUATIONS);
                                tileConfiguration.EVALUATION_VALUES = JSON.stringify(values);
                                tileConfiguration.EVALUATION_FILTERS = JSON.stringify(filters);

                                configuration.tileConfiguration = JSON.stringify(tileConfiguration);
                                configuration.timeStamp = Date.now().toString();

                                configuration = JSON.stringify(configuration);

                                if (configuration.length > 4096) {
                                    tileConfiguration.EVALUATION_FILTERS = JSON.stringify([]);
                                    configuration = JSON.stringify({tileConfiguration: JSON.stringify(tileConfiguration),isSufficient: "0"});
                                }

                                for(var ele in data.results[j]) {
                                    if(data.results[j].hasOwnProperty(ele)) {
                                        if((data.results[j][ele] instanceof Object) && !(data.results[j][ele] instanceof Array) && !(data.results[j][ele] instanceof Date)) {
                                            delete data.results[j][ele];
                                        }
                                    } 
                                }

                                data.results[j].configuration = configuration;
                                var entity = "CHIPS(id='" + data.results[j].id + "',isActive=1)";
                                updateBatch.push(model.createBatchOperation(entity,"PUT",data.results[j]));
                            }

                            model.addBatchChangeOperations(updateBatch); 
                            model.submitBatch(function(data,response,errorResponse){
                                if(errorResponse.length)
                                {       isUpdatesSuccessful = false;
                                return;
                                }
                                var responses = data.__batchResponses[0].__changeResponses;
                                for(var key in responses)
                                    if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
                                        isUpdatesSuccessful = false;      
                                    }

                            },function(err){
                                isUpdatesSuccessful = false;
                            },false);

                            if(!isUpdatesSuccessful) {
                                //sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"));
                            }
                        }      
                    }, function(err) {
                        //sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                    });
                }
            }
        },

        arrayToObject:function(arr, type) {
            var order = this.getObjectOrder(type);
            var obj = {};
            var key = "";
            for(var i=0,l=arr.length; i<l; i++) {
                if(!(arr[i] instanceof Array) && (arr[i] instanceof Object)) {
                    key = "";
                    for(var j=0,m=order.length; j<m; j++) {
                        key += (j) ? "^|" : "";
                        key += arr[i][order[j]];
                    }
                    obj[key] = arr[i];
                }
            }
            return obj;
        },

        refreshMasterList: function(controllerRef, isMasterList) {
            var ref = null;
            var masterControllerRef = null;
            var oApplicationImplementation = null;
            var oApplicationFacade = controllerRef.oApplicationFacade;
            var isManualRefresh = true;
            var oDataModel = oApplicationFacade.getODataModel();
            if(isMasterList) {
                oApplicationImplementation = controllerRef._oApplicationImplementation;
            }
            else {
                oApplicationImplementation = controllerRef.oApplicationImplementation;
            }
            if(oApplicationImplementation && oApplicationImplementation.oMHFHelper && oApplicationFacade.masterListControllerRef) {
                ref = oApplicationImplementation.oMHFHelper;
                masterControllerRef = oApplicationFacade.masterListControllerRef;
                ref.refreshList(masterControllerRef, isManualRefresh);
            }
            else {
                oDataModel.refresh();
            }
        },

        appToAppNavigation:function(obj) {
            var hash = "#";
            var hashArr = window.hasher.getHashAsArray();
            var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?"));
            if(hashParameters && (hashParameters.charAt(hashParameters.length - 1) == "&")) {
                hashParameters = hashParameters.substr(0,hashParameters.length - 1);
            } 
            if(obj.action) {
                if(obj.context || obj.route) {
                    if(obj.context.charAt(0) == "/") {
                        obj.context = obj.context.substr(1);
                    }
                    obj.context = "&/" + ((obj.route + "/") || "") + (obj.context || ""); 
                }
                hash += (obj.semanticObject || "FioriApplication-") + obj.action + hashParameters + (obj.context || "");
            }
            if(!(sap.ui.core.routing)) {
                jQuery.sap.require("sap.ui.core.routing");
            }
            var hashChanger = new sap.ui.core.routing.HashChanger();
            sap.suite.ui.smartbusiness.lib.Util.utils.setPrevAppHash();
            hashChanger.setHash(hash);
        },

        hashChange:function(obj) {
            if(!(sap.ui.core.routing)) {
                jQuery.sap.require("sap.ui.core.routing");
            }
            var hashChanger = new sap.ui.core.routing.HashChanger();
            hashChanger.setHash(obj.hash || "#");
        },

        replaceHash:function(obj, isHash) {
            if(isHash) {
                window.location.replace(obj.hash);
            }
            else {
                var hash = "#";
                var hashArr = window.hasher.getHashAsArray();
                var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?"));
                if(hashParameters && (hashParameters.charAt(hashParameters.length - 1) == "&")) {
                    hashParameters = hashParameters.substr(0,hashParameters.length - 1);
                } 
                if(obj.action) {
                    if(obj.context || obj.route) {
                        if(obj.context && obj.context.charAt(0) == "/") {
                            obj.context = obj.context.substr(1);
                        }
                        obj.context = "&/" + ((obj.route + "/") || "") + (obj.context || ""); 
                    }
                    hash += (obj.semanticObject || "FioriApplication-") + obj.action + hashParameters + (obj.context || "");
                }
                window.location.replace(hash);
            }
        },

        setHash:function(obj, isHash) {
            if(isHash) {
                window.location.hash = obj.hash;
            }
            else {
                var hash = "#";
                var hashArr = window.hasher.getHashAsArray();
                var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?"));
                if(hashParameters && (hashParameters.charAt(hashParameters.length - 1) == "&")) {
                    hashParameters = hashParameters.substr(0,hashParameters.length - 1);
                } 
                if(obj.action) {
                    if(obj.context || obj.route) {
                        if(obj.context && obj.context.charAt(0) == "/") {
                            obj.context = obj.context.substr(1);
                        }
                        obj.context = "&/" + ((obj.route + "/") || "") + (obj.context || ""); 
                    }
                    hash += (obj.semanticObject || "FioriApplication-") + obj.action + hashParameters + (obj.context || "");
                }
                window.location.hash = hash;
            }
        },

        setPrevAppHash: function() {
            hasher = hasher || window.hasher;
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache.prevApp = sap.suite.ui.smartbusiness.modelerAppCache.prevApp || {};
            sap.suite.ui.smartbusiness.modelerAppCache.prevApp.prevAppHash = hasher.getHash();
            sap.suite.ui.smartbusiness.modelerAppCache.prevApp.prevAppHashAsArray = hasher.getHashAsArray();
        },

        backToHome: function() {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            if(sap.suite.ui.smartbusiness.modelerAppCache.prevApp) {
                delete sap.suite.ui.smartbusiness.modelerAppCache.prevApp;
            }
            sap.suite.ui.smartbusiness.modelerAppCache.SBWorkspace = {};
            sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI = {};
            sap.suite.ui.smartbusiness.modelerAppCache.createSBKPIEvaluation = {};
            sap.suite.ui.smartbusiness.modelerAppCache.configureSBKPITile = {};
            sap.suite.ui.smartbusiness.modelerAppCache.manageSBKPIAssociation = {};
            sap.suite.ui.smartbusiness.modelerAppCache.configureSBKPIDrilldown = {};
            sap.suite.ui.smartbusiness.modelerAppCache.authorizeSBEvaluation = {};
        },

        isHanaViewValid: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(!(obj.VIEW_NAME)) {
                return false;
            }
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewValid;
            }
            else {
                var flag = false;
                var entity = "/HANA_VIEWS" + "?$filter=" + "PACKAGE eq " + "'" + obj.VIEW_NAME.substr(0, obj.VIEW_NAME.indexOf("/")) + "'" + " and " + "OBJECT eq " + "'" +  obj.VIEW_NAME.substr(obj.VIEW_NAME.indexOf("/") + 1) + "'";   
                obj.model = obj.model || new sap.ui.model.odata.ODataModel("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata", true);
                obj.model.read(entity, null, null, false, function(data) {
                    if(data.results.length) {
                        flag = true;
                    }
                    else {
                        flag = false;
                    }
                }, function() {
                    flag = true;
                });
                if(obj.app) {
                    sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewValid = flag;
                }
                return flag;
            }
        },

        isHanaViewFormatValid: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(!(obj.VIEW_NAME)) {
                return false;
            }
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewFormatValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewFormatValid;
            }
            else {
                if((obj.VIEW_NAME.indexOf("/") == -1) && (obj.VIEW_NAME.indexOf("::") == -1)) {
                    if(obj.app) {
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewFormatValid = false;
                    }
                    return false;
                }
                if(obj.app) {
                    sap.suite.ui.smartbusiness.modelerAppCache[obj.app].hanaViewFormatValid = true;
                }
                return true;
            }
        },

        isODataURLValidForHanaView: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid;
            }
            else {
                var entity = "/ODATA_FOR_ENTITY" + "(" + "P_PACKAGE=" + "'" + obj.VIEW_NAME.substr(0, obj.VIEW_NAME.indexOf("/")) + "'" + "," + "P_OBJECT=" + "'" +  obj.VIEW_NAME.substr(obj.VIEW_NAME.indexOf("/") + 1) + "'" + ")/Results";
                obj.model = obj.model || new sap.ui.model.odata.ODataModel("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata", true);
                obj.model.read(entity, null, null, false, function(data) {
                    if(data.results.length) {
                        if(data.results.indexOf(odata)) {
                            if(obj.app) {
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid = true;
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValidForHanaView = true;
                            }
                            return true;
                        }
                        else {
                            if(obj.app) {
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid = false;
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValidForHanaView = false;
                            }
                            return false;
                        }
                    }
                    else {
                        if(obj.app) {
                            sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid = false;
                            sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValidForHanaView = false;
                        }
                        return false;
                    }
                }, function() {
                    if(obj.app) {
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid = false;
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValidForHanaView = false;
                    }
                    return false;
                });
            }
        },

        isODataURLValidByExistence: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid;
            }
            else {
                var model = new sap.ui.model.odata.ODataModel(obj.ODATA_URL,true);
                if(model.getServiceMetadata()) {
                    odataExists = true;
                }
                else {
                    odataExists = false;
                }
                if(obj.app) {
                    sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValid = odataExists;
                    sap.suite.ui.smartbusiness.modelerAppCache[obj.app].oDataURLValidByExistence = odataExists;
                }
                return odataExists;
            }
        },

        isODataURLValid: function(obj) {
            if(obj.VIEW_NAME) {
                return sap.suite.ui.smartbusiness.lib.Util.utils.isODataURLValidForHanaView(obj);
            }
            else {
                return sap.suite.ui.smartbusiness.lib.Util.utils.isODataURLValidByExistence(obj);
            }
        },

        isEntitysetValid: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].entitysetValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].entitysetValid;
            }
            else {
                try {
                    if(obj.VIEW_NAME) {

                    }
                    else {
                        if(sap.suite.ui.smartbusiness.lib.Util.odata.getAllEntitySet(obj.ODATA_URL).indexOf(obj.ODATA_ENTITYSET) == -1){
                            if(obj.app) {
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].entitysetValid = false;
                            }
                            return false;
                        }
                        else {
                            if(obj.app) {
                                sap.suite.ui.smartbusiness.modelerAppCache[obj.app].entitysetValid = true;
                            }
                            return true;
                        }
                    }
                } catch(e) {
                    if(obj.app) {
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].entitysetValid = false; 
                    }
                    return false;
                }
            }
        },

        isMeasureValid: function(obj) {
            sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
            sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
            sap.suite.ui.smartbusiness.modelerAppCache[obj.app] = sap.suite.ui.smartbusiness.modelerAppCache[obj.app] || {};
            if(obj.cache && obj.app && (sap.suite.ui.smartbusiness.modelerAppCache[obj.app].measureValid !== undefined)) {
                return sap.suite.ui.smartbusiness.modelerAppCache[obj.app].measureValid;
            }
            try {
                if(sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(obj.ODATA_URL, obj.ODATA_ENTITYSET).indexOf(obj.COLUMN_NAME) == -1) {
                    if(obj.app) {
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].measureValid = false;
                    }
                    return false;
                } 
                else {
                    if(obj.app) {
                        sap.suite.ui.smartbusiness.modelerAppCache[obj.app].validValueMeasure = true;
                    }
                    return true;
                }
            } catch(e) {
                if(obj.app) {
                    sap.suite.ui.smartbusiness.modelerAppCache[obj.app].validValueMeasure = false;
                }
                return false;
            }
        },

        getHanaSystem : function() {
            var hashObj = hasher || window.hasher; 
            var hashArr = hashObj.getHashAsArray();
            if(hashArr && hashArr.length && hashArr[0]) {
                var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?") + 1).split("&");
                for(var i=0,l=hashParameters.length; i<l; i++) {
                    if(hashParameters[i] && (hashParameters[i].indexOf("sap-system") != -1)) {
                        return hashParameters[i].split("=")[1]; 
                    }
                }
            }
            return "";
        },

        fetchCSRFToken: function() {
            var tokenFetchServiceUrl = "/sap/hba/r/sb/core/logic/__token.xsjs";
            if(sap.ushell && sap.ushell.Container) {
                tokenFetchServiceUrl = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(tokenFetchServiceUrl, this.getHanaSystem());
            }
            return jQuery.ajax({
                type: "HEAD",
                async: false,
                dataType: "json",
                url: tokenFetchServiceUrl,
                headers: {"X-CSRF-Token": "Fetch"},
                success: function(d, s, x) {

                },
                error: function() {

                }
            });
        },

        appendUrlParameters: function(url, urlParameters) {
            var urlParts = url.split("?");
            if(urlParts.length > 2) {
                throw new Error("Url not formed properly");
            }
            if(sap.ushell && sap.ushell.Container) {
                urlParts[0] = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(urlParts[0], this.getHanaSystem());
            }
            url = urlParts[0];
            if(urlParts.length == 2) {
                url += "?" + urlParts[1];
            }
            if(urlParameters && Object.keys(urlParameters) && Object.keys(urlParameters).length) {
                url = url + "?" + jQuery.param(urlParameters);
            }
            return url;
        },

        getLocaleLanguage: function() {
            return ((sap.ui.getCore().getConfiguration().getLanguage()) ? sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase() : "");
        },

        create: function(url, payload, parameters, success, error, async, urlParameters) {
            var that = this;
            async = async ? true : false;
            sap.suite.ui.smartbusiness.lib.Util.utils.fetchCSRFToken().done(function(d,s,x) {
                jQuery.ajax({
                    type: "POST",
                    async: async,
                    url: sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters(url, urlParameters),
                    data: encodeURIComponent(JSON.stringify(payload)),
                    headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":that.getLocaleLanguage()},
                    success: success,
                    error: error
                });
            });
        },

        update: function(url, payload, parameters, success, error, merge, eTag, async, urlParameters) {
            var that = this;
            async = async ? true : false;
            sap.suite.ui.smartbusiness.lib.Util.utils.fetchCSRFToken().done(function(d,s,x) {
                jQuery.ajax({
                    type: "PUT",
                    async: async,
                    url: sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters(url, urlParameters),
                    data: encodeURIComponent(JSON.stringify(payload)),
                    headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":that.getLocaleLanguage(), "If-None-Match": (eTag || "")},
                    success: success,
                    error: error
                });
            });
        },

        remove: function(url, payload, success, error, eTag, additionalPayload, async, urlParameters) {
            var that = this;
            async = async ? true : false;
            sap.suite.ui.smartbusiness.lib.Util.utils.fetchCSRFToken().done(function(d,s,x) {
                jQuery.ajax({
                    type: "DELETE",
                    async: async,
                    url: sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters(url, urlParameters),
                    data: encodeURIComponent(JSON.stringify(payload)),
                    headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":that.getLocaleLanguage(), "If-None-Match": (eTag || "")},
                    success: success,
                    error: error
                });
            });
        },

        serviceUrl: function(url) {
            var Constants = {
                    INDICATOR_SERVICE_URI : "/sap/hba/r/sb/core/logic/indicators.xsjs",
                    EVALUATION_SERVICE_URI : "/sap/hba/r/sb/core/logic/evaluations.xsjs",
                    CHIP_SERVICE_URI: "/sap/hba/r/sb/core/logic/chips.xsjs",
                    ACTIVATE_INDICATOR_SERVICE_URI: "/sap/hba/r/sb/core/logic/activateIndicator.xsjs",
                    ACTIVATE_EVALUATION_SERVICE_URI: "/sap/hba/r/sb/core/logic/activateEvaluation.xsjs",
                    INDICATOR_FAVOURITE_SERVICE_URI: "/sap/hba/r/sb/core/logic/favouriteIndicator.xsjs",
                    EVALUATION_FAVOURITE_SERVICE_URI: "/sap/hba/r/sb/core/logic/favouriteEvaluation.xsjs",
                    ASSOCIATIONS_CUD: "/sap/hba/r/sb/core/logic/associations_cud.xsjs",
                    ACTIVATE_ASSOCIATION_SERVICE_URI: "/sap/hba/r/sb/core/logic/activateAssociation.xsjs",
                    ACTIVATE_CHIP_SERVICE_URI: "/sap/hba/r/sb/core/logic/activateChip.xsjs",
                    AUTHORIZATION_SERVICE_URI: "/sap/hba/r/sb/core/logic/authorization.xsjs",
                    COPY_DDA_CONFIGURATION_SERVICE_URI: "/sap/hba/r/sb/core/logic/copyDrilldownConfiguration.xsjs"
            }
            return Constants[url];
        }
    }
})();
/**
 * KPI Related API
 */
sap.suite.ui.smartbusiness.lib.Util.kpi = (function() {
    var Constants = {
            KPI_SERVICE_URI : "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata",
            KPI_RUNTIME_SERVICE_URI : "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata",
            EVALUATIONS_ENTITY_SET : "/EVALUATIONS",
            EVALUATIONS_DDA_ENTITY_SET: "/EVALUATIONS_DDA",
            ASSOCIATED_INDICATORS_ENTITY_SET:"ASSOCIATED_INDICATORS",
            DESIGN_TIME_SERVICE_URI:"/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata"
    };
    function getCacheKey(oParam, bRuntime) {
        var prefix = bRuntime ? "_rt" : "_dt";
        var key = oParam.id;
        if(oParam.filters) {
            key+="_FILTERS";
        } if(oParam.thresholds) {
            key+="_VALUES";
        }
        key+=prefix;
        return key;
    };
    var _appendSystemAlias = function(uri, sysAlias) {
        if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
            var urlParsingService = sap.ushell.Container.getService("URLParsing");
            if(urlParsingService) {
                uri = urlParsingService.addSystemToServiceUrl(uri, sysAlias);
            }
        }
        return uri;
    };
    return  {
        /**
         * @param :oParam
         * @retrurn  : evaluationObject
         * @description : OParam should be an object with following properties
         * {
         *   id : 'evaluationId',
         *   success : function(data) {}, //callback function with OData Evaluation Response
         *   error : function() {},
         *   cache :  true/false //default false
         *   expand : 'csv' //will add expand params to Evaluation OData Call
         *   
         * }
         * 
         * If Success property is specified, then call will  be made async, other wise synchronous
         */
        getSiblingEvaluations:function(oParam){

            if(!oParam.indicator) {
                throw new Error("Indicator Not Found")
            }
            var model =null;
            if(sap.suite.ui.smartbusiness.lib.Util.odata){
                model = sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(Constants.KPI_SERVICE_URI);
            } else {
                model = new sap.ui.model.odata.ODataModel(Constants.KPI_SERVICE_URI, true);
            }
            var async = !!oParam.success;
            var filterValue = "INDICATOR eq '#INDICATOR_ID'".replace("#INDICATOR_ID",oParam.indicator);
            var siblingData = [];
            var oDataParamObject = {};
            oDataParamObject["$filter"] = filterValue;
            var expandParams = "";
            if(oParam.filters) {
                expandParams += "FILTERS,";
            }
            if(oParam.thresholds) {
                expandParams += "VALUES,";
            }
            if(expandParams) {
                oDataParamObject["$expand"] = expandParams.substring(0,expandParams.length-1);
            }
            var entity = Constants.EVALUATIONS_ENTITY_SET;
            if(oParam.getDDAEvaluation) {
                entity = Constants.EVALUATIONS_DDA_ENTITY_SET;
            }
            model.read(entity,null, oDataParamObject, async, function(data) {
                if(data.results && data.results.length) {
                    var tmp=data.results||[];
                    siblingData=tmp;

                    // sap.suite.ui.smartbusiness.lib.Util.cache.setEvaluationById(cache_key, evalData);
                }
                if(async) {
                    oParam.success.call(oParam.context || null, siblingData);
                }
            }, function(){
                jQuery.sap.log.error("Error fetching Evaluation : ",oParam.id);
                if(oParam.error) {
                    oParam.error.apply(oParam.context || null, arguments);
                }
            });
            return siblingData;

        },
        getAssociatedEvaluations:function(oParam){

            if(!oParam.id) {
                throw new Error("Evaluation Not Found")
            }
            var model =null;
            if(sap.suite.ui.smartbusiness.lib.Util.odata){
                model = sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(Constants.DESIGN_TIME_SERVICE_URI);
            } else {
                model = new sap.ui.model.odata.ODataModel(Constants.DESIGN_TIME_SERVICE_URI, true);
            }
            var async = !!oParam.success;
            var filterValue = "SOURCE_EVALS eq '#EVALUATION_ID' or TARGET_EVALS eq '#EVALUATION_ID'".replace("#EVALUATION_ID",oParam.id);
            var associatedEvalsData = [];
            var oDataParamObject = {};
            oDataParamObject["$filter"] = filterValue;
            var expandParams = "SOURCE_EVALUATION,TARGET_EVALUATION";
            if(oParam.filters) {
                expandParams += "FILTERS,";
            }
            if(oParam.thresholds) {
                expandParams += "VALUES,";
            }
            if(expandParams) {
                oDataParamObject["$expand"] = expandParams.substring(0,expandParams.length);
            }
            model.read(Constants.ASSOCIATED_INDICATORS_ENTITY_SET,null, oDataParamObject, async, function(data) {
                data=(data.results && data.results.length)?data.results:[];
                data.forEach(function(o){
                    if(o.TARGET_EVALS==oParam.id){
                        associatedEvalsData.push(o.SOURCE_EVALUATION);
                    }else if(o.SOURCE_EVALS==oParam.id){
                        associatedEvalsData.push(o.TARGET_EVALUATION);
                    }
                });
                if(async) {
                    oParam.success.call(oParam.context || null, associatedEvalsData);
                }
            }, function(){
                jQuery.sap.log.error("Error fetching Evaluation : ",oParam.id);
                if(oParam.error) {
                    oParam.error.apply(oParam.context || null, arguments);
                }
            });
            return associatedEvalsData;

        },
        getEvaluationById : function(oParam) {
            if(!oParam.id) {
                throw new Error("Evaluation Id Not Found")
            }
            var bUseRuntimeService = !!oParam.useRuntimeService; 
            var cache_key = getCacheKey(oParam, bUseRuntimeService);
            if(oParam.cache) {
                var evaluationObject = sap.suite.ui.smartbusiness.lib.Util.cache.getEvaluationById(cache_key);
                if(evaluationObject) {
                    if(oParam.success) {
                        oParam.success.call(oParam.context || null, evaluationObject);
                        return null;
                    } else {
                        return evaluationObject;
                    }
                }
            }
            var model =null;
            var _serviceUri = bUseRuntimeService ? Constants.KPI_RUNTIME_SERVICE_URI : Constants.KPI_SERVICE_URI;
            var _serviceUri = _appendSystemAlias(_serviceUri, oParam.sapSystem);
            if(sap.suite.ui.smartbusiness.lib.Util.odata){
                model = sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(_serviceUri);
            } else {
                model = new sap.ui.model.odata.ODataModel(_serviceUri, true);
            }
            var async = !!oParam.success;
            var filterValue = "ID eq '#EVALUATION_ID'".replace("#EVALUATION_ID",oParam.id);
            var evalData = null;
            var oDataParamObject = {};
            oDataParamObject["$filter"] = filterValue;
            var expandParams = "";
            if(oParam.filters) {
                expandParams += "FILTERS,";
            }
            if(oParam.thresholds) {
                expandParams += "VALUES,";
            }
            if(expandParams) {
                oDataParamObject["$expand"] = expandParams.substring(0,expandParams.length-1);
            }
            var entity = Constants.EVALUATIONS_ENTITY_SET;
            if(oParam.getDDAEvaluation) {
                entity = Constants.EVALUATIONS_DDA_ENTITY_SET; 
            }
            else {

            }
            model.read(entity,null, oDataParamObject, async, function(data) {
                if(data.results && data.results.length) {
                    evalData = data.results[0];
                    sap.suite.ui.smartbusiness.lib.Util.cache.setEvaluationById(cache_key, evalData);
                }
                if(async) {
                    oParam.success.call(oParam.context || null, evalData);
                }
            }, function(){
                jQuery.sap.log.error("Error fetching Evaluation : ",oParam.id);
                if(oParam.error) {
                    oParam.error.apply(oParam.context || null, arguments);
                }
            });
            return evalData;
        },
        parseEvaluation : function(evaluationData) {
            return new sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation(evaluationData);
        }
    } 
})();

/**
 *  EVALUATION - Parse Evaluation Json Response and Form JavaScript Object
 */
sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds = function(thresholdsData) {
    this.thresholdsData = thresholdsData;
    var T_MAPPING = {
            "TA" : {
                prop : '_target',
                func : "getTarget"
            },
            "CL" : {
                prop : '_criticalLow',
                func : "getCriticalLow"
            },
            "CH" : {
                prop : '_criticalHigh',
                func : "getCriticalHigh"
            },
            "WL" : {
                prop : '_warningLow',
                func : "getWarningLow"
            },
            "WH" : {
                prop : '_warningHigh',
                func : "getWarningHigh"
            },
            "TC" : {
                prop : '_trend',
                func : "getTrend"
            },
            "RE" : {
                prop : "_reference",
                func : "getReference"
            }
    }
    var getType = function(obj) {
        if(obj.FIXED) {
            return 'FIXED';
        }
        if(obj.COLUMN_NAME) {
            return 'COLUMN_NAME';
        }
        if(obj.ODATA_URL) {
            return 'ODATA_URL'
        }
        return null;
    };
    this.parse = function(allThresholds) {
        allThresholds.forEach(function(oThreshold) {
            var mapping = T_MAPPING[oThreshold.TYPE];
            if(mapping) {
                var tType = getType(oThreshold);
                this[mapping.prop+"Type"] = tType;
                this[mapping.prop+"Value"] = oThreshold[tType];
                sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds.prototype[mapping.func+"Type"] = function() {
                    return this[mapping.prop+"Type"];
                };
                sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds.prototype[mapping.func] = function() {
                    return this[mapping.prop+"Value"];
                };
            }
        },this);
        for(var each in T_MAPPING) {
            var o = T_MAPPING[each]
            if(!sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds.prototype[o.func]) {
                sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds.prototype[o.func+"Type"] = function() {
                    return null;
                };
                sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds.prototype[o.func] = function() {
                    return null;
                };
            }
        }
    };
    this.parse(this.thresholdsData.results);
};
sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation = function(evaluationData) {
    this.evaluationData = evaluationData;
    this.thresholds = null;
    if(this.evaluationData && this.evaluationData.VALUES) {
        this._init();
        this.thresholds = new sap.suite.ui.smartbusiness.lib.Util.kpi.Thresholds(this.evaluationData.VALUES);
    }
};
sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation.PropertyMapping = {
        ID : "getId",
        ODATA_URL : "getODataUrl",
        ODATA_ENTITYSET : "getEntitySet",
        GOAL_TYPE : "getGoalType",
        INDICATOR : "getKpiId",
        TITLE : "getTitle",
        DESCRIPTION : "getDescription",
        SCALING : "getScaling",
        COLUMN_NAME : "getKpiMeasureName",
        INDICATOR_TITLE : "getKpiName",
        SEMANTIC_OBJECT : "getSemanticObject",
        ACTION : "getAction",
        OWNER_NAME : "getOwnerName",
        OWNER_ID : "getOwnerId",
        VALUES_SOURCE : "getThresholdValueType",
        //EXPAND PROPERTIES
        FILTERS : "getFilters",
        VALUES : "getValues",
        PROPERTIES : "getProperties",
        TAGS : "getTags",
        INDICATOR_PROPERTIES : "getKpiDetail",
        DECIMAL_PRECISION : "getDecimalPrecision"
};
sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation.prototype = {
        _init : function() {
            for(var each in sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation.PropertyMapping) {
                (function(each){
                    var func = sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation.PropertyMapping[each];
                    sap.suite.ui.smartbusiness.lib.Util.kpi.Evaluation.prototype[func] = function() {
                        return this.evaluationData[each];
                    }
                })(each);
            }
        },
        getThresholds : function() {
            return this.thresholds;
        },
        isMaximizingKpi : function() {
            return this.getGoalType() == "MA";
        },
        isMinimizingKpi : function() {
            return this.getGoalType() == "MI";
        },
        isTargetKpi : function() {
            return this.getGoalType() == "RA";
        },
        get_hana_client : function(){
            var sessionClient;
            var cacheHanaClient = sap.suite.ui.smartbusiness.lib.Util.cache.getCacheHanaClient();
            if(cacheHanaClient){
                sessionClient = cacheHanaClient;
                return sessionClient;
            }
            jQuery.ajax({
                type: "GET",
                async: false,
                dataType: "json",
                url: "/sap/hba/r/sb/core/logic/GetSessionClient.xsjs",
                success: function(d, s, x) {
                    sessionClient = d.sessionClient;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                                	jQuery.sap.log.error(jqXHR.responseText);
                        }
            });
            sap.suite.ui.smartbusiness.lib.Util.cache.setCacheHanaClient(sessionClient);
            return sessionClient;
        },


        /*
         * Replaces all "$$$" set for SAP CLIENT ("P_SAPClient") with HANA SESSION CLIENT
         * Has side effects on the Evaluation Object
         */

        parse_sapclient : function() {
            var e;
            var results;
            var result;
            var SAP_CLIENT;
            var reserved_placeholder;

            /* TODO: get this from an xsjs service
             * something like:
             * var HANA_USER_CLIENT = get_hana_client();
             */
            var HANA_USER_CLIENT = this.get_hana_client();

            e = this.evaluationData;
            SAP_CLIENT = "P_SAPClient";
            reserved_placeholder = "$$$";

            /* expected syntax
             *  evaluationData
             *	|-- FILTERS
             *	|   |-- results[]
             *	|   	|-- NAME
             *	|   	|-- VALUE_1
             */

            if(!e.hasOwnProperty("FILTERS") && !e.FILTERS.hasOwnProperty("results")) {
                return;
            }

            if(e.FILTERS.results.constructor !== Array) {
                return;
            }

            if(e.FILTERS.results.length < 1) {
                return;
            }

            results = e.FILTERS.results;

            for (var i in e.FILTERS.results) {
                var result = results[i];
                if (result["NAME"] === SAP_CLIENT && result["VALUE_1"] === reserved_placeholder) {
                    result["VALUE_1"] = HANA_USER_CLIENT;
                    return;
                }
            }
        }
};

