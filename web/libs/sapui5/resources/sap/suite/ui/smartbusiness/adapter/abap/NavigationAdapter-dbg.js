/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.NavigationAdapter");
sap.suite.ui.smartbusiness.adapter.abap.NavigationAdapter = function() {
	var _cache={};
	function _getUriForFetchingLinks(so, arr, businessParamMap/*Key value Pair*/){
		var strSemanticObjectLink = "/GetLinksForSemanticObject?semanticObject='"+so+"'";
		var strBusinessParams="";
		if(businessParamMap && Object.keys(businessParamMap).length) {
		    //var strBusinessParams = "";
		    for(var key in businessParamMap) {
		        strBusinessParams += key+"="+businessParamMap[key]+"&";
		    }
		}
		if(arr && arr.length) {
            for(var i=0;i<arr.length;i++){
                strBusinessParams += arr[i]+"=1&";
            }   
		}
        strBusinessParams=encodeURIComponent(strBusinessParams.replace(/&$/g,""));
        strBusinessParams="&businessParams='"+strBusinessParams+"'";
		return strSemanticObjectLink + strBusinessParams;
	};
	this.getLinksBySemanticObject = function(oParam) {
    	var that=this;
    	var serviceUri = null;
    	var batchArray = [];
        var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/UI2/INTEROP",true);
        oParam.businessParam=oParam.businessParam||{};
        oParam.businessParam["formFactor"]=sap.ui2.srvc.getFormFactor();
        for(var i=0,l=oParam.semanticObject.length;i<l;i++){
            serviceUri = _getUriForFetchingLinks(oParam.semanticObject[i],oParam.dimensions, oParam.businessParam);
            request = oDataModel.createBatchOperation(serviceUri,"GET");
            batchArray.push(request);
        }
        oDataModel.addBatchReadOperations(batchArray);
      
        var callReference = oDataModel.submitBatch(function(data) {
        	var dataResponse = [];
        	for(var i=0;i<data.__batchResponses.length;i++){
        		if(data.__batchResponses[i].data && data.__batchResponses[i].data.results && data.__batchResponses[i].data.results.length){
        			dataResponse = dataResponse.concat(data.__batchResponses[i].data.results);
        		}
        	}
        	oParam.success.call(oParam.context || null, dataResponse);
        }, function() {
            jQuery.sap.log.error("Error fetching getLinksBySemanticObject : "+oParam.semanticObject);
            oParam.success.call(oParam.context || null, []);
        });
        return callReference ;
	};
	
	
	//Version 1
	
	
	/*this.getLinksByContext = function(oParam) {
	    var aODataCallReference = [];
	    if(oParam.viewId && _cache[oParam.viewId]) {
			oParam.success.call(oParam.context || null,_cache[oParam.viewId]);
		} else {	
    		var soArray=[oParam.semanticObject],links=[];
    		oParam.dimensions=oParam.dimensions||[];
    		soArray=soArray.concat(oParam.dimensions);
    		var semaphore=soArray.length;
    		if(semaphore){
    			for(var i=0;i<soArray.length;i++){
    				var callReference = this.getLinksBySemanticObject({
    				    async : true,
    				    semanticObject : soArray[i],
    				    dimensions : oParam.dimensions,
    				    success : function(data) {
        					links = links.concat(data);
        					if(--semaphore == 0){
        						_cache[oParam.viewId]=links;
        						oParam.success.call(oParam.context || null, links);
        					}
    				    },error:function() {
    				        if(--semaphore == 0){
    						_cache[oParam.viewId] = links;
    						oParam.success.call(oParam.context || null, links);
    				        }
    				    }
    				});
    				aODataCallReference.push(callReference);
    				
    			}
    		}else{
    			oParam.success.call(oParam.context || null,[]);
    		}
		}
	    return aODataCallReference;
	};*/
	
	
	//Version 2
	
/*	this.getLinksByContext = function(oParam) {
		var aODataCallReference = [];
		var that = this;
		if(!_cache[oParam.viewId]) {
			_cache[oParam.viewId] = new jQuery.Deferred(function(deferred) {
				var soArray=[oParam.semanticObject], links=[];
				oParam.dimensions=oParam.dimensions||[];
				soArray=soArray.concat(oParam.dimensions);
				var semaphore = soArray.length;
				if(semaphore) {
					for(var i=0;i<soArray.length;i++){
						var callReference = that.getLinksBySemanticObject({
							async : true,
							semanticObject : soArray[i],
							dimensions : oParam.dimensions,
							success : function(data) {
								links = links.concat(data);
								if(--semaphore == 0){
									deferred.resolve(links);
								}
							},error:function() {
								if(--semaphore == 0) {
									deferred.resolve(links);
								}
							}
						});
						aODataCallReference.push(callReference);
					}
				} else {
					deferred.resolve([]);
				}
			});
		}
		return _cache[oParam.viewId].promise();
	};*/
	

	
	//version 2 with batch request

	this.getLinksByContext = function(oParam) {
		var aODataCallReference = [];
		var that = this;
		if(!_cache[oParam.viewId]) {
			_cache[oParam.viewId] = new jQuery.Deferred(function(deferred) {
				var links=[];
				var soArray=[oParam.semanticObject], links=[];
				oParam.dimensions=oParam.dimensions||[];
				soArray=soArray.concat(oParam.dimensions);
				var callReference = that.getLinksBySemanticObject({
					async : true,
					semanticObject : soArray,
					dimensions : oParam.dimensions,
					success : function(data) {
						links = links.concat(data);
						deferred.resolve(links);
					},error:function() {
						deferred.resolve(links);
					}
				});
				aODataCallReference.push(callReference);
			});
		}
		return _cache[oParam.viewId].promise();
	};
	this.reset =function() {
		_cache = {};
	}
};