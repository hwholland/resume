/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.odataProxy");jQuery.sap.require('sap.apf.utils.utils');jQuery.sap.require('sap.apf.core.constants');(function(){'use strict';sap.apf.core.OdataProxy=function(s,a){var c=a.instances.coreApi;var m=a.instances.messageHandler;var b=s.serviceRoot;var e="";function d(i){if(i===undefined){return true;}return i;}function g(b,i){return c.getEntityTypeMetadata(b,i);}function f(j){var i,v,w;if(!j){return"";}v=j.length;if(v===1){return"('"+j[0].value+"')";}w="(";for(i=0;i<v;i++){if(i>0){w=w+",";}w=w+j[i].name+"='"+j[i].value+"'";}return w+")";}function h(E){var i;if(E.messageObject&&E.messageObject.getCode){i=E.messageObject;}else if(E.response&&E.response.statusCode&&E.response.statusCode>=400){i=m.createMessageObject({code:'11005',aParameters:[E.response.statusCode.toString(),E.response.statusText]});}else{i=m.createMessageObject({code:'5201'});}m.putMessage(i);return i;}function k(E,i){var j=h(E);i(undefined,undefined,j);}function l(D,b,i,j){var v;var w;if(D&&D.results){v=D.results;}else if(D){v=D;}else{w=m.createMessageObject({code:'5201'});}j(v,g(b,i),w);}function n(i){var j=JSON.parse(i.SerializedAnalyticalConfiguration);delete i.SerializedAnalyticalConfiguration;j.configHeader=i;i.SerializedAnalyticalConfiguration=JSON.stringify(j);return i;}this.readEntity=function(i,j,v,w,x,y){var A=d(x);var z=sap.apf.core.constants.entitySets[i];var B=c.getXsrfToken(b);var C=b+'/'+z;C=C+f(v);if(w&&w.length>0){C=C+"?$select="+w.join();}var D={requestUri:C,async:A,method:"GET",headers:{"x-csrf-token":B}};c.odataRequest(D,function(E){l(E,b,z,j);},function(E){k(E,j);});};function o(P,v){var i="'";var E=g(b,e).getPropertyMetadata(P);if(E&&E.dataType){return sap.apf.utils.formatValue(v,E.dataType.type);}if(typeof v==='number'){return v;}return i+sap.apf.utils.escapeOdata(v)+i;}function p(j){var x=c.getXsrfToken(b);var v=[];var i,w=j.length;var y,z,S,A,B;for(i=0;i<w;i++){S=false;z=sap.apf.core.constants.entitySets[j[i].entitySetName];y=z;y=y+f(j[i].inputParameters);if(j[i].selectList&&j[i].selectList.length>0){y=y+"?$select="+j[i].selectList.join();S=true;}if(j[i].filter){if(S){y=y+'&';}else{y=y+'?';}e=z;y=y+'$filter='+j[i].filter.toUrlParam({formatValue:o});}A=j[i].method||'GET';B={requestUri:y,method:A,headers:{"Accept-Language":sap.ui.getCore().getConfiguration().getLanguage(),"x-csrf-token":x}};if(A!=="GET"){B.data=j[i].data;}v.push(B);}return v;}function q(i,j,v,w){var Q='';var x=i+f(j);if(v&&v.length>0){Q="$select="+v.join();}if(w){if(Q){Q=Q+'&';}e=i;Q=Q+'$filter='+w.toUrlParam({formatValue:o});}if(i===sap.apf.core.constants.entitySets.application){if(Q){Q=Q+'&';}Q=Q+'$orderby=ApplicationName';}if(Q){x=x+'?'+Q;}return x;}function r(i,j){var v="unknown error";var w="unknown error";var x="";if(i.message!==undefined){v=i.message;}var y="unknown";if(i.response&&i.response.statusCode){y=i.response.statusCode;w=i.response.statusText||"";x=i.response.requestUri;}if(i.messageObject&&i.messageObject.type==="messageObject"){j([],i.messageObject);}else{j([],m.createMessageObject({code:"5001",aParameters:[y,v,w,x]}));}}this.doChangeOperationsInBatch=function(v,w){var x=c.getXsrfToken(b);var y=p(v);var z={requestUri:b+'/'+'$batch',method:"POST",headers:{"x-csrf-token":x},data:{__batchRequests:[{__changeRequests:y}]}};var S=function(A,B){var C;var D;var F,G,H;var I="";var i,j;if(A&&A.__batchResponses){for(i=0;i<A.__batchResponses.length;i++){if(A.__batchResponses[i].message){F=A.__batchResponses[i].message;G="";I=B.requestUri;C=m.createMessageObject({code:"5001",aParameters:[G,F,"",I]});break;}for(j=0;j<A.__batchResponses[i].__changeResponses.length;j++){D=A.__batchResponses[i].__changeResponses[j];if(D.message){F=D.message;H=D.data;G=D.statusCode;I=B.requestUri;C=m.createMessageObject({code:"5001",aParameters:[G,F,H,I]});break;}}}w(C);}};var E=function(i){r(i,w);};c.odataRequest(z,S,E,OData.batchHandler);};this.readCollectionsInBatch=function(j,v,w){var x=c.getXsrfToken(b);var y=p(j);var A=d(w);var z={requestUri:b+'/'+'$batch',async:A,method:"POST",headers:{"x-csrf-token":x},data:{__batchRequests:y}};var S=function(B){var C=[];var D,F,G,H,I;var i;if(B&&B.__batchResponses){for(i=0;i<B.__batchResponses.length;i++){if(B.__batchResponses[i].data&&B.__batchResponses[i].data.results){C.push(B.__batchResponses[i].data.results);}else if(B.__batchResponses[i].message){F=B.__batchResponses[i].message;G=B.__batchResponses[i].response.body;H=B.__batchResponses[i].response.statusCode;I=C.requestUri;D=m.createMessageObject({code:"5001",aParameters:[H,F,G,I]});break;}else{I=C.requestUri;D=m.createMessageObject({code:"5001",aParameters:["unknown","unknown error","unknown error",I]});break;}}v(C,D);}};var E=function(i){r(i,v);};c.odataRequest(z,S,E,OData.batchHandler);};this.readCollection=function(i,j,v,w,x,y){var A=d(y);if(A){u(i,j,v,w,x);}else{t(i,j,v,w,x);}};function t(i,j,v,w,x){var y=sap.apf.core.constants.entitySets[i];var z=c.getXsrfToken(b);var A=b+'/'+q(y,v,w,x);var B={requestUri:A,async:false,method:"GET",headers:{"x-csrf-token":z}};c.odataRequest(B,function(D){l(D,b,y,j);},function(E){k(E,j);});}function u(i,j,v,w,x){var y=sap.apf.core.constants.entitySets[i];var z=function(C,D){var E;var F;var G="";if(C&&C.__batchResponses){if(C.__batchResponses[0].data&&C.__batchResponses[0].data.results){E=C.__batchResponses[0].data.results;}else if(C.__batchResponses[0].message){var H=C.__batchResponses[0].message;var I=C.__batchResponses[0].response.body;var J=C.__batchResponses[0].response.statusCode;G=D.requestUri;F=m.createMessageObject({code:"5001",aParameters:[J,H,I,G]});}else{G=D.requestUri;F=m.createMessageObject({code:"5001",aParameters:["unknown","unknown error","unknown error",G]});}j(E,g(b,y),F);}};var A=c.getXsrfToken(b);var B={requestUri:b+'/'+'$batch',async:true,method:"POST",headers:{"x-csrf-token":A},data:{__batchRequests:[{requestUri:q(y,v,w,x),method:"GET",headers:{"x-csrf-token":A,"Accept-Language":sap.ui.getCore().getConfiguration().getLanguage()}}]}};c.odataRequest(B,z,function(E){k(E,j);},OData.batchHandler);}this.create=function(i,j,v,w){if(i==="configuration"){j=n(j);}var A=d(w);var x=sap.apf.core.constants.entitySets[i];var y=c.getXsrfToken(b);var z=b+'/'+x;var B={requestUri:z,async:A,method:"POST",headers:{"x-csrf-token":y},data:j};function C(E,R){var F;var G;if(E&&R.statusText==="Created"){F=E;}else{G=m.createMessageObject({code:'5201'});}v(F,g(b,x),G);}function D(E){var F=h(E);v(undefined,undefined,F);}c.odataRequest(B,C,D);};this.update=function(i,j,v,w){if(i==="configuration"){j=n(j);}var x=sap.apf.core.constants.entitySets[i];var y=c.getXsrfToken(b);var z=b+'/'+x+f(w);var A={requestUri:z,method:"PUT",headers:{"x-csrf-token":y},data:j};function B(D,R){var E;if(R.statusCode!==204){E=m.createMessageObject({code:'5201'});}v(g(b,x),E);}function C(E){var D=h(E);v(undefined,D);}c.odataRequest(A,B,C);};this.remove=function(i,j,v,w){var x=sap.apf.core.constants.entitySets[i];var y=c.getXsrfToken(b);var z=b+'/'+x+f(j);if(w){e=x;z=z+'$filter='+w.toUrlParam({formatValue:o});}var A={requestUri:z,method:"DELETE",headers:{"x-csrf-token":y}};function B(D,R){var E;var F;if(R.statusText==="No Content"){F=g(b,x);}else{E=m.createMessageObject({code:'5201'});}v(F,E);}function C(E){var D=h(E);v(undefined,D);}c.odataRequest(A,B,C);};};}());