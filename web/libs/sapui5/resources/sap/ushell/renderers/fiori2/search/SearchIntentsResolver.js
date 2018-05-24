(function(){"use strict";jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchIntentsResolver');var m=sap.ushell.renderers.fiori2.search.SearchIntentsResolver=function(){this.init.apply(this,arguments);};m.prototype={init:function(a){this._oCrossAppNav=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");this._model=a;},resolveIntents:function(r){var t=this;var d=new $.Deferred();t._model.sina.sinaSystem().getServerInfo().then(function(s){var a=false;if(s&&s.rawServerInfo&&s.rawServerInfo.Services){for(var i=0;i<s.rawServerInfo.Services.length;++i){var b=s.rawServerInfo.Services[i];if(b.Service==='Search'){for(var j=0;j<b.Capabilities.length;++j){var c=b.Capabilities[j];if(c.Capability==='SemanticObjectType'){a=true;break;}}break;}}}else{a=true;}if(!a){d.resolve();}else{t.fioriFrontendSystemInfo={systemId:sap.ushell.Container.getLogonSystem().getName(),client:sap.ushell.Container.getLogonSystem().getClient()};var p=[];for(var k=0;k<r.length;k++){var e=r[k];if(e.semanticObjectType&&e.semanticObjectType.length>0){var f=t._doResolveIntents(e);p.push(f);}}$.when.apply(null,p).always(function(g){d.resolve();});}});return d.promise();},_doResolveIntents:function(r){var t=this;r.uri="";for(var i=0;i<r.itemattributes.length;i++){if(r.itemattributes[i].uri){r.itemattributes[i].uri="";}}var o=new $.Deferred();var p=t._oCrossAppNav.getSemanticObjectLinks(r.semanticObjectType,r.semanticObjectTypeAttrs);p.done(function(a){var f="-displayFactSheet";var b=false;var s;if(r.systemId&&r.client&&!(t.fioriFrontendSystemInfo.systemId==r.systemId&&t.fioriFrontendSystemInfo.client==r.client)){s="sap-system=sid("+r.systemId+"."+r.client+")";}r.intents=[];for(var i=0;i<a.length;i++){var c=a[i];var d=c.intent;if(s){var w=d.indexOf('?');if(w===-1){d+="?"+s;}else{w+=1;var e=d.substring(0,w);var g=d.substring(w);d=e+s;if(g&&g.length>0){d+="&"+g;}}}var h={target:{shellHash:d}};var k=t._oCrossAppNav.hrefForExternal(h);if(!b&&c.intent.substr(c.intent.indexOf("-"),f.length)===f){r.uri=k;r.titleUriIsIntent=true;for(var j=0;j<r.itemattributes.length;j++){if(r.itemattributes[j].isTitle){r.itemattributes[j].uri=k;}}b=true;}else{c.target=h.target;c.externalHash=k;r.intents.push(c);}}o.resolve();});p.fail(function(a){o.resolve();});return o;}};})();