/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Filter','sap/ui/model/Sorter','sap/ui/model/Filter','sap/ui/core/format/DateFormat'],function(q,O,S,F,D){"use strict";var r=/^([-+]?)0*(\d+)(\.\d+|)$/,a=/\.$/,b=/0+$/;var c=function(){};c.createSortParams=function(g){var h;if(!g||g.length==0){return;}h="$orderby=";for(var i=0;i<g.length;i++){var o=g[i];if(o instanceof S){h+=o.sPath;h+=o.bDescending?"%20desc":"%20asc";h+=",";}}h=h.slice(0,-1);return h;};c.createFilterParams=function(g,m,E){if(!g||g.length==0){return;}return"$filter="+this._createFilterParams(g,m,E);};c._createFilterParams=function(g,m,E){var h;if(!g||g.length==0){return;}var o={},k=0,l,h="",n=0,t=this;q.each(g,function(j,i){if(i.sPath){l=o[i.sPath];if(!l){l=o[i.sPath]=[];k++;}}else{l=o["__multiFilter"];if(!l){l=o["__multiFilter"]=[];k++;}}l.push(i);});q.each(o,function(P,l){if(l.length>1){h+='(';}q.each(l,function(i,j){if(j instanceof O){if(j.aValues.length>1){h+='(';}q.each(j.aValues,function(i,u){if(i>0){if(j.bAND){h+="%20and%20";}else{h+="%20or%20";}}h=t._createFilterSegment(j.sPath,m,E,u.operator,u.value1,u.value2,h);});if(j.aValues.length>1){h+=')';}}else if(j._bMultiFilter){h+=t._resolveMultiFilter(j,m,E);}else{h=t._createFilterSegment(j.sPath,m,E,j.sOperator,j.oValue1,j.oValue2,h);}if(i<l.length-1){h+="%20or%20";}});if(l.length>1){h+=')';}if(n<k-1){h+="%20and%20";}n++;});return h;};c._createUrlParamsArray=function(P){var u,t=q.type(P),g;if(t==="array"){return P;}u=[];if(t==="object"){g=this._encodeURLParameters(P);if(g){u.push(g);}}else if(t==="string"){if(P){u.push(P);}}return u;};c._encodeURLParameters=function(P){if(!P){return"";}var u=[];q.each(P,function(n,v){if(q.type(v)==="string"){v=encodeURIComponent(v);}n=q.sap.startsWith(n,'$')?n:encodeURIComponent(n);u.push(n+"="+v);});return u.join("&");};c.setOrigin=function(g,P){var o,h,C;if(!g||!P||g.indexOf(";mo")>0){return g;}if(typeof P=="string"){o=P;}else{o=P.alias;if(!o){h=P.system;C=P.client;if(!h||!C){q.sap.log.warning("ODataUtils.setOrigin: No Client or System ID given for Origin");return g;}o="sid("+h+"."+C+")";}}var u=g.split("?");var B=u[0];var U=u[1]?"?"+u[1]:"";var t="";if(q.sap.endsWith(B,"/")){B=B.substring(0,B.length-1);t="/";}var i=/(;o=[^/]+)$/;if(B.match(i)!=null){if(P.force){B=B.replace(i,";o="+o);return B+t+U;}return g;}B=B+";o="+o+t;return B+U;};c._resolveMultiFilter=function(m,M,E){var t=this,g=m.aFilters,h="";if(g){h+="(";q.each(g,function(i,o){if(o._bMultiFilter){h+=t._resolveMultiFilter(o,M,E);}else if(o.sPath){h+=t._createFilterSegment(o.sPath,M,E,o.sOperator,o.oValue1,o.oValue2,"");}if(i<(g.length-1)){if(m.bAnd){h+="%20and%20";}else{h+="%20or%20";}}});h+=")";}return h;};c._createFilterSegment=function(P,m,E,o,v,V,g){var h,t;if(E){h=m._getPropertyMetadata(E,P);t=h&&h.type;}if(t){v=this.formatValue(v,t);V=(V!=null)?this.formatValue(V,t):null;}else{}if(v){v=q.sap.encodeURL(String(v));}if(V){V=q.sap.encodeURL(String(V));}switch(o){case"EQ":case"NE":case"GT":case"GE":case"LT":case"LE":g+=P+"%20"+o.toLowerCase()+"%20"+v;break;case"BT":g+="("+P+"%20ge%20"+v+"%20and%20"+P+"%20le%20"+V+")";break;case"Contains":g+="substringof("+v+","+P+")";break;case"StartsWith":g+="startswith("+P+","+v+")";break;case"EndsWith":g+="endswith("+P+","+v+")";break;default:g+="true";}return g;};c.formatValue=function(v,t){if(!this.oDateTimeFormat){this.oDateTimeFormat=D.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss''"});this.oDateTimeOffsetFormat=D.getDateInstance({pattern:"'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"});this.oTimeFormat=D.getTimeInstance({pattern:"'time''PT'HH'H'mm'M'ss'S'''"});}if(v===null||v===undefined){return"null";}var V;switch(t){case"Edm.String":V="'"+String(v).replace(/'/g,"''")+"'";break;case"Edm.Time":if(typeof v==="object"){V=this.oTimeFormat.format(new Date(v.ms),true);}else{V="time'"+v+"'";}break;case"Edm.DateTime":V=this.oDateTimeFormat.format(new Date(v),true);break;case"Edm.DateTimeOffset":V=this.oDateTimeOffsetFormat.format(new Date(v),true);break;case"Edm.Guid":V="guid'"+v+"'";break;case"Edm.Decimal":V=v+"M";break;case"Edm.Int64":V=v+"L";break;case"Edm.Double":V=v+"d";break;case"Edm.Float":case"Edm.Single":V=v+"f";break;case"Edm.Binary":V="binary'"+v+"'";break;default:V=String(v);break;}return V;};function s(v,V){if(v===V){return 0;}if(v===null||V===null||v===undefined||V===undefined){return NaN;}return v>V?1:-1;}function p(v){var m;if(typeof v!=="string"){return undefined;}m=r.exec(v);if(!m){return undefined;}return{sign:m[1]==="-"?-1:1,integerLength:m[2].length,abs:m[2]+m[3].replace(b,"").replace(a,"")};}function d(v,V){var o,g,R;if(v===V){return 0;}o=p(v);g=p(V);if(!o||!g){return NaN;}if(o.sign!==g.sign){return o.sign>g.sign?1:-1;}R=s(o.integerLength,g.integerLength)||s(o.abs,g.abs);return o.sign*R;}var e=/^PT(\d\d)H(\d\d)M(\d\d)S$/;function f(v){if(typeof v==="string"&&e.test(v)){v=parseInt(RegExp.$1,10)*3600000+parseInt(RegExp.$2,10)*60000+parseInt(RegExp.$3,10)*1000;}if(v instanceof Date){return v.getTime();}if(v&&v.__edmType==="Edm.Time"){return v.ms;}return v;}c.compare=function(v,V,A){return A?d(v,V):s(f(v),f(V));};c.getComparator=function(E){switch(E){case"Edm.Date":case"Edm.DateTime":case"Edm.DateTimeOffset":case"Edm.Time":return c.compare;case"Edm.Decimal":case"Edm.Int64":return d;default:return s;}};return c;},true);