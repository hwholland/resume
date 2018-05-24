jQuery.sap.declare('sap.ui.richtexteditor.library-all');if(!jQuery.sap.isDeclared('sap.ui.richtexteditor.RichTextEditorRenderer')){
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.ui.richtexteditor.RichTextEditorRenderer');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.ui.core.Renderer');sap.ui.define("sap/ui/richtexteditor/RichTextEditorRenderer",['jquery.sap.global','sap/ui/core/Renderer'],function(q,R){"use strict";var a={};a.render=function(r,o){r.write('<div');r.writeControlData(o);if(o.getEditorType()=="TinyMCE4"){r.writeAttribute("data-sap-ui-preserve",o.getId());}r.addClass("sapUiRTE");if(o.getRequired()){r.addClass("sapUiRTEReq");}if(o.getUseLegacyTheme()){r.addClass("sapUiRTELegacyTheme");}r.writeClasses();r.addStyle("width",o.getWidth());r.addStyle("height",o.getHeight());r.writeStyles();if(o.getTooltip_AsString()){r.writeAttributeEscaped("title",o.getTooltip_AsString());}r.write('>');var s="render"+o.getEditorType()+"Editor";if(this[s]&&typeof this[s]==="function"){this[s].call(this,r,o);}r.write('</div>');};return a;},true);};if(!jQuery.sap.isDeclared('sap.ui.richtexteditor.library')){jQuery.sap.declare('sap.ui.richtexteditor.library');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.ui.core.Core');jQuery.sap.require('sap.ui.core.library');sap.ui.define("sap/ui/richtexteditor/library",['jquery.sap.global','sap/ui/core/Core','sap/ui/core/library'],function(q,C,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.richtexteditor",dependencies:["sap.ui.core"],types:["sap.ui.richtexteditor.EditorType"],interfaces:[],controls:["sap.ui.richtexteditor.RichTextEditor"],elements:[],version:"1.38.33"});sap.ui.richtexteditor.EditorType={TinyMCE:"TinyMCE",TinyMCE4:"TinyMCE4"};return sap.ui.richtexteditor;},false);};if(!jQuery.sap.isDeclared('sap.ui.richtexteditor.RichTextEditor')){jQuery.sap.declare('sap.ui.richtexteditor.RichTextEditor');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.ui.core.Control');jQuery.sap.require('sap.ui.core.ResizeHandler');sap.ui.define("sap/ui/richtexteditor/RichTextEditor",['jquery.sap.global','sap/ui/core/Control','sap/ui/core/ResizeHandler','./library'],function(q,C,R,l){"use strict";var E={Initial:"Initial",Loading:"Loading",Initializing:"Initializing",Loaded:"Loaded",Ready:"Ready",Destroyed:"Destroyed"};
/**
	 * Constructor for a new RichTextEditor.
	 *
	 * The RichTextEditor uses a third party component, which might in some cases not be
	 * completely compatible with the way UI5's (re-)rendering mechanism works. If you keep hidden
	 * instances of the control (instances which are not visible in the DOM), you might run into
	 * problems with some browser versions. In this case please make sure you destroy the
	 * RichTextEditor instance instead of hiding it and create a new one when you show it again.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The RichTextEditor-Control is used to enter formatted text.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 *
	 * @constructor
	 * @public
	 * @disclaimer Since version 1.6.0.
	 * The RichTextEditor of SAPUI5 contains a third party component TinyMCE provided by Moxiecode Systems AB. The SAP license agreement covers the development of applications with RichTextEditor of SAPUI5 (as of May 2014).
	 * @alias sap.ui.richtexteditor.RichTextEditor
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
var a=C.extend("sap.ui.richtexteditor.RichTextEditor",{metadata:{library:"sap.ui.richtexteditor",properties:{value:{type:"string",group:"Data",defaultValue:''},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},editorType:{type:"string",group:"Misc",defaultValue:'TinyMCE'},editorLocation:{type:"string",group:"Misc",defaultValue:'js/tiny_mce/tiny_mce_src.js',deprecated:true},editable:{type:"boolean",group:"Misc",defaultValue:true},showGroupFontStyle:{type:"boolean",group:"Misc",defaultValue:true},showGroupTextAlign:{type:"boolean",group:"Misc",defaultValue:true},showGroupStructure:{type:"boolean",group:"Misc",defaultValue:true},showGroupFont:{type:"boolean",group:"Misc",defaultValue:false},showGroupClipboard:{type:"boolean",group:"Misc",defaultValue:true},showGroupInsert:{type:"boolean",group:"Misc",defaultValue:false},showGroupLink:{type:"boolean",group:"Misc",defaultValue:false},showGroupUndo:{type:"boolean",group:"Misc",defaultValue:false},wrapping:{type:"boolean",group:"Appearance",defaultValue:true},required:{type:"boolean",group:"Misc",defaultValue:false},sanitizeValue:{type:"boolean",group:"Misc",defaultValue:true},plugins:{type:"object[]",group:"Behavior",defaultValue:[]},useLegacyTheme:{type:"boolean",group:"Appearance",defaultValue:true},buttonGroups:{type:"object[]",group:"Behavior",defaultValue:[]}},events:{change:{parameters:{newValue:{type:"string"}}},ready:{},beforeEditorInit:{}}}});a._lastId=0;a._iCountInstances=0;a.EDITORTYPE_TINYMCE=sap.ui.richtexteditor.EditorType.TinyMCE;a.EDITORTYPE_TINYMCE4=sap.ui.richtexteditor.EditorType.TinyMCE4;a.EDITORLOCATION_TINYMCE="js/tiny_mce/tiny_mce.js";a.EDITORLOCATION_TINYMCE4="js/tiny_mce4/tinymce.min.js";if(sap.ui.getCore().getConfiguration().getDebug()){a.EDITORLOCATION_TINYMCE="js/tiny_mce/tiny_mce_src.js";a.EDITORLOCATION_TINYMCE4="js/tiny_mce4/tinymce.js";}a.MAPPED_LANGUAGES_TINYMCE4={"sh":"sr","ji":"yi","in":"id","iw":"he","no":"nb"};a.SUPPORTED_LANGUAGES_TINYMCE4={"en":true,"ar":true,"ar_SA":true,"hy":true,"az":true,"eu":true,"be":true,"bn_BD":true,"bs":true,"bg_BG":true,"ca":true,"zh_CN":true,"zh_TW":true,"hr":true,"cs":true,"da":true,"dv":true,"nl":true,"en_CA":true,"en_GB":true,"et":true,"fo":true,"fi":true,"fr_FR":true,"gd":true,"gl":true,"ka_GE":true,"de":true,"de_AT":true,"el":true,"he_IL":true,"hi_IN":true,"hu_HU":true,"is_IS":true,"id":true,"it":true,"ja":true,"kk":true,"km_KH":true,"ko_KR":true,"ku":true,"ku_IQ":true,"lv":true,"lt":true,"lb":true,"ml":true,"ml_IN":true,"mn_MN":true,"nb_NO":true,"fa":true,"fa_IR":true,"pl":true,"pt_BR":true,"pt_PT":true,"ro":true,"ru":true,"ru@petr1708":true,"sr":true,"si_LK":true,"sk":true,"sl_SI":true,"es":true,"es_MX":true,"sv_SE":true,"tg":true,"ta":true,"ta_IN":true,"tt":true,"th_TH":true,"tr_TR":true,"ug":true,"uk":true,"uk_UA":true,"vi":true,"vi_VN":true,"cy":true};a.SUPPORTED_LANGUAGES_DEFAULT_REGIONS={"zh":"CN","fr":"FR","bn":"BD","bg":"BG","ka":"GE","he":"IL","hi":"IN","hu":"HU","is":"IS","km":"KH","ko":"KR","ku":"IQ","mn":"MN","nb":"NO","pt":"PT","si":"SI","sv":"SE","th":"TH","tr":"TR"};a.pLoadTinyMCE=null;a.loadTinyMCE=function(L){if(L){var r=sap.ui.resource('sap.ui.richtexteditor',L);var s=document.querySelector("#sapui5-tinyMCE");var b=s?s.getAttribute("src"):"";if(r!==b&&a._iCountInstances===1){delete window.tinymce;delete window.TinyMCE;a.pLoadTinyMCE=null;}if(!a.pLoadTinyMCE){a.pLoadTinyMCE=new Promise(function(f,c){q.sap.includeScript(r,"sapui5-tinyMCE",f,c);});}}return a.pLoadTinyMCE;};a.prototype.init=function(){this._bEditorCreated=false;this._sTimerId=null;a._iCountInstances++;this.setButtonGroups([{name:"font-style",visible:true,row:0,priority:10,buttons:["bold","italic","underline","strikethrough"]},{name:"text-align",visible:true,row:0,priority:20,buttons:["justifyleft","justifycenter","justifyright","justifyfull"]},{name:"font",visible:false,row:0,priority:30,buttons:["fontselect","fontsizeselect","forecolor","backcolor"]},{name:"clipboard",visible:true,row:1,priority:10,buttons:["cut","copy","paste"]},{name:"structure",visible:true,row:1,priority:20,buttons:["bullist","numlist","outdent","indent"]},{name:"e-mail",visible:false,row:1,priority:30,buttons:[]},{name:"undo",visible:false,row:1,priority:40,buttons:["undo","redo"]},{name:"insert",visible:false,row:1,priority:50,buttons:["image","emotions"]},{name:"link",visible:false,row:1,priority:60,buttons:["link","unlink"]}]);this.setPlugins([{name:"lists"},{name:"emotions"},{name:"directionality"},{name:"inlinepopups"},{name:"tabfocus"}]);this._textAreaId=this.getId()+"-textarea";this._iframeId=this._textAreaId+"_ifr";this._textAreaDom=document.createElement("textarea");this._textAreaDom.id=this._textAreaId;this._textAreaDom.style.height="100%";this._textAreaDom.style.width="100%";this._callEditorSpecific("init");};a.prototype.onBeforeRendering=function(){this._callEditorSpecific("onBeforeRendering");};a.prototype.onAfterRendering=function(){this._callEditorSpecific("onAfterRendering");};a.prototype.reinitialize=function(){clearTimeout(this._iReinitTimeout);this._iReinitTimeout=window.setTimeout(this._callEditorSpecific.bind(this,"reinitialize"),0);};a.prototype.getNativeApi=function(){return this._callEditorSpecific("getNativeApi");};a.prototype.exit=function(){q.sap.clearDelayedCall(this._reinitDelay);this._callEditorSpecific("exit");a._iCountInstances--;};a.prototype.setValue=function(v){if(this.getSanitizeValue()){v=q.sap._sanitizeHTML(v);}if(v===this.getValue()){return this;}this.setProperty("value",v,true);v=this.getProperty("value");var m="setValue"+this.getEditorType();if(this[m]&&typeof this[m]==="function"){this[m].call(this,v);}else{this.reinitialize();}return this;};a.prototype._callEditorSpecific=function(p){var m=p+this.getEditorType();if(this[m]&&typeof this[m]==="function"){return this[m].call(this);}else{return undefined;}};a.prototype.setEditable=function(e){this.setProperty("editable",e,true);this.reinitialize();return this;};a.prototype.setWrapping=function(w){this.setProperty("wrapping",w,true);this.reinitialize();return this;};a.prototype.setRequired=function(r){this.setProperty("required",r,true);this.reinitialize();return this;};a.prototype.setShowGroupFontStyle=function(s){this.setProperty("showGroupFontStyle",s,true);this.setButtonGroupVisibility("font-style",s);this.reinitialize();return this;};a.prototype.setShowGroupTextAlign=function(s){this.setProperty("showGroupTextAlign",s,true);this.setButtonGroupVisibility("text-align",s);this.reinitialize();return this;};a.prototype.setShowGroupStructure=function(s){this.setProperty("showGroupStructure",s,true);this.setButtonGroupVisibility("structure",s);this.reinitialize();return this;};a.prototype.setShowGroupFont=function(s){this.setProperty("showGroupFont",s,true);this.setButtonGroupVisibility("font",s);this.reinitialize();return this;};a.prototype.setShowGroupClipboard=function(s){this.setProperty("showGroupClipboard",s,true);this.setButtonGroupVisibility("clipboard",s);this.reinitialize();return this;};a.prototype.setShowGroupInsert=function(s){this.setProperty("showGroupInsert",s,true);this.setButtonGroupVisibility("insert",s);this.reinitialize();return this;};a.prototype.setShowGroupLink=function(s){this.setProperty("showGroupLink",s,true);this.setButtonGroupVisibility("link",s);this.reinitialize();return this;};a.prototype.setShowGroupUndo=function(s){this.setProperty("showGroupUndo",s,true);this.setButtonGroupVisibility("undo",s);this.reinitialize();return this;};a.prototype.addPlugin=function(p){if(typeof p==="string"){p={name:p};}var P=this.getProperty("plugins");P.push(p);this.setProperty("plugins",P);this.reinitialize();return this;};a.prototype.removePlugin=function(p){var P=this.getProperty("plugins").slice(0);for(var i=0;i<P.length;++i){if(P[i].name===p){P.splice(i,1);--i;}}this.setProperty("plugins",P);this.reinitialize();return this;};a.prototype.setUseLegacyTheme=function(u){var d=this.getDomRef();if(d){q(d).toggleClass("sapUiRTELegacyTheme",u);}return this.setProperty("useLegacyTheme",u,true);};a.prototype.addButtonGroup=function(g){if(typeof g==="string"){g={name:this._createId("buttonGroup"),buttons:[g]};}if(g.visible===undefined){g.visible=true;}if(g.priority===undefined){g.priority=10;}if(g.row===undefined){g.row=0;}var b=this.getButtonGroups();b.push(g);this.setButtonGroups(b);return this;};a.prototype.removeButtonGroup=function(g){var G=this.getProperty("buttonGroups").slice(0);for(var i=0;i<G.length;++i){if(G[i].name===g){G.splice(i,1);--i;}}this.setProperty("buttonGroups",G);this.reinitialize();return this;};a.prototype.setButtonGroupVisibility=function(g,v){var b=this.getButtonGroups();for(var i=0,L=b.length;i<L;++i){if(b[i].name===g){b[i].visible=v;}}return this;};a.prototype._createId=function(p){if(p===undefined){p="_rte";}return p+(a._lastId++);};a.prototype.setEditorType=function(e){if(!this._bEditorCreated){this._callEditorSpecific("unload");this.setProperty("editorType",e);switch(e){case sap.ui.richtexteditor.EditorType.TinyMCE:this.setEditorLocation(a.EDITORLOCATION_TINYMCE);this.removePlugin("emoticons");this.addPlugin("emotions");this.removePlugin("lists");this.addPlugin("inlinepopups");this.removeButtonGroup("text-align");this.removePlugin("image");this.removePlugin("link");this.removePlugin("textcolor");this.removePlugin("colorpicker");this.removePlugin("textpattern");this.removePlugin("powerpaste");this.addButtonGroup({name:"text-align",visible:true,row:0,priority:20,buttons:["justifyleft","justifycenter","justifyright","justifyfull"]});this.removeButtonGroup("insert");this.addButtonGroup({name:"insert",visible:false,row:1,priority:50,buttons:["image","emotions"]});break;case sap.ui.richtexteditor.EditorType.TinyMCE4:this.setEditorLocation(a.EDITORLOCATION_TINYMCE4);this.removePlugin("emotions");this.addPlugin("emoticons");this.addPlugin("lists");this.removePlugin("inlinepopups");this.removeButtonGroup("text-align");this.addPlugin("image");this.addPlugin("link");this.addPlugin("textcolor");this.addPlugin("colorpicker");this.addPlugin("textpattern");this.addPlugin("powerpaste");this.addButtonGroup({name:"text-align",visible:true,row:0,priority:20,buttons:["alignleft","aligncenter","alignright","alignjustify"]});this.removeButtonGroup("insert");this.addButtonGroup({name:"insert",visible:false,row:1,priority:50,buttons:["image","emoticons"]});break;default:q.sap.log.error("editorType property set to an unknown editor type");}this._callEditorSpecific("init");}else{q.sap.log.error("editorType property cannot be set after the RichtextEditor has been rendered");}return this;};a.prototype.setEditorLocation=function(e){if(!this._bEditorCreated){this.setProperty("editorLocation",e);}else{q.sap.log.error("editorLocation property cannot be set after the RichtextEditor has been rendered");}return this;};a.prototype._createButtonRowsTinyMCE=function(b,g){b=b===undefined?",":b;g=g===undefined?"|":g;var B=this.getButtonGroups();var G=b+g+b;var i,L,m;var o={};for(i=0,L=B.length;i<L;++i){m=B[i];if(!o[m.priority]){o[m.priority]=[];}if(m.priority===undefined){m.priority=Number.MAX_VALUE;}o[m.priority].push(m);}var c=[];for(var k in o){for(i=0,L=o[k].length;i<L;++i){m=o[k][i];var r=m.row||0;if(!m.visible||!m.buttons||m.buttons.length===0){continue;}if(!c[r]){c[r]="";}c[r]+=m.buttons.join(b)+G;}}for(i=0;i<c.length;++i){if(c[i]===null){continue;}else if(!c[i]){c.splice(i,1);c.push(null);continue;}if(c[i].substr(-3)===G){c[i]=c[i].substr(0,c[i].length-G.length);}if(c[i].substr(-1)===b){c[i]=c[i].substr(0,c[i].length-b.length);}if(c[i].length===0){c.splice(i,1);c.push(null);}}return c;};a.prototype._createPluginsListTinyMCE=function(){var p=this.getPlugins();var P=[];for(var i=0,L=p.length;i<L;++i){P.push(p[i].name);}return P.join(",");};a.prototype.tinyMCEReady=function(){var i=q.sap.domById(this._iframeId);return!!i;};a.prototype.setValueTinyMCE=function(v){if(this._bEditorCreated){q.sap.byId(this._textAreaId).text(v);this.setContentTinyMCE();}else{this.setProperty("value",v,true);if(this.getDomRef()){q.sap.byId(this._textAreaId).val(v);}}};a.prototype.onTinyMCEChange=function(c){var o=this.getValue(),n=c.getContent();if((o!==n)&&!this.bExiting){this.setProperty("value",n,true);this.fireChange({oldValue:o,newValue:n});}};a.prototype._tinyMCEKeyboardHandler=function(e){var n;var k=e['keyCode'];switch(k){case q.sap.KeyCodes.TAB:if(!this.$focusables.index(q(e.target))===0){var i=this.$focusables.size()-1;this.$focusables.get(i).focus();}break;case q.sap.KeyCodes.ARROW_LEFT:case q.sap.KeyCodes.ARROW_UP:n=this.$focusables.index(q(e.target))-1;if(n===0){n=this.$focusables.size()-2;}this.$focusables.get(n).focus();break;case q.sap.KeyCodes.ARROW_RIGHT:case q.sap.KeyCodes.ARROW_DOWN:n=this.$focusables.index(q(e.target))+1;if(n===this.$focusables.size()-1){n=1;}this.$focusables.get(n).focus();break;default:break;}};a.prototype._getLanguageTinyMCE=function(){var L=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());var s=L.getLanguage();var r=L.getRegion();var m={"zh":"zh-"+(r?r.toLowerCase():"cn"),"sh":"sr","hi":"en"};s=m[s]?m[s]:s;return s;};a.initTinyMCEStatic=function(){a.TinyMCE={};a.TinyMCEInitialized=true;};a.prototype.initTinyMCE=function(){sap.ui.getCore().getEventBus().subscribe("sap.ui","__preserveContent",this._tinyMCEPreserveHandler,this);sap.ui.getCore().getEventBus().subscribe("sap.ui","__beforePopupClose",this._tinyMCEPreserveHandler,this);};a.prototype.onBeforeRenderingTinyMCE=function(){a.loadTinyMCE(this.getEditorLocation()).then(function(){try{window.tinymce.execCommand('mceRemoveControl',false,this._textAreaId);}catch(e){}}.bind(this));};a.prototype.onAfterRenderingTinyMCE=function(){a.loadTinyMCE().then(function(){this.getDomRef().appendChild(this._textAreaDom);this._textAreaDom.style.display="";this._textAreaDom.style.visibility="";this._textAreaDom.value=this.getValue();if(!this._bEditorCreated){this.initTinyMCEAfterFirstRendering();}else{this.setContentTinyMCE();if(window.tinymce){window.tinymce.execCommand('mceAddControl',false,this._textAreaId);}this.initWhenTinyMCEReady();}}.bind(this));};a.prototype.initTinyMCEAfterFirstRendering=function(){if(!a.TinyMCEInitialized){a.initTinyMCEStatic();}if(this.sTimerId){q.sap.clearDelayedCall(this.sTimerId);this.sTimerId=null;}if(!window.tinymce){this.sTimerId=q.sap.delayedCall(10,this,this.initTinyMCEAfterFirstRendering);return;}this._bEditorCreated=true;var b=this._createButtonRowsTinyMCE();var p=this._createPluginsListTinyMCE();var c={mode:"exact",directionality:(sap.ui.getCore().getConfiguration().getRTL()?"rtl":"ltr"),elements:this._textAreaId,theme:"advanced",language:this._getLanguageTinyMCE(),browser_spellcheck:true,convert_urls:false,plugins:p,theme_advanced_buttons1:b[0],theme_advanced_buttons2:b[1],theme_advanced_buttons3:b[2],theme_advanced_buttons4:b[3],theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"none",readonly:(this.getEditable()?0:1),nowrap:!this.getWrapping(),onchange_callback:function(o){var i=o.editorId.substr(0,o.editorId.lastIndexOf("-"));var r=sap.ui.getCore().byId(i);if(r){r.onTinyMCEChange(o);}else{q.sap.log.error("RichtTextEditor change called for unknown instance: "+i);}}};this.fireBeforeEditorInit({configuration:c});tinymce.init(c);this._bEditorCreated=true;this.setContentTinyMCE();this.initWhenTinyMCEReady();};a.prototype._tinyMCEPreserveHandler=function(c,e,d){if((this.getDomRef()&&window.tinymce&&q(d.domNode).find(q.sap.byId(this._textAreaId)).length>0)||(q.sap.byId(this._textAreaId).length===0)){var o=this.getNativeApi();if(o&&o.getContainer()){var t=this;var r=function(){try{window.tinymce.execCommand('mceRemoveControl',false,t._textAreaId,{skip_focus:true});}catch(b){}};try{this.setProperty("value",o.getContent(),true);}catch(b){q.sap.log.warning("TinyMCE was hidden before value could be read, changes might be lost.");}var p=q(d.domNode).control(0);if(p&&p.attachClosed){p.attachClosed(r);}else{r();}}}};a.prototype.initWhenTinyMCEReady=function(){if(this.sTimerId){q.sap.clearDelayedCall(this.sTimerId);this.sTimerId=null;}if(!this.tinyMCEReady()){this.sTimerId=q.sap.delayedCall(10,this,"initWhenTinyMCEReady");return;}var i=this.getNativeApiTinyMCE();var I=q.sap.byId(this._iframeId);var b=q(i.getBody());var t;if(this.getTooltip()&&this.getTooltip().length>0){var T=q.sap.encodeHTML(this.getTooltip_Text());i.getBody().title=T;I.attr("title",T);}else{var s=i.getLang("aria.rich_text_area")+" - "+i.getLang('advanced.help_shortcut');I.attr("title",s);}if(sap.ui.Device.browser.firefox){I.parent().height("100%");}if(sap.ui.Device.browser.internet_explorer){I.height(I.parent().height());var d=this.getDomRef();var r=function(){I.height(I.parent().height());};if(d.attachEvent){d.attachEvent("resize",r);}else if(d.addEventListener){d.addEventListener("resize",r);}}var c=this._textAreaId+"_tbl";var e=q.sap.byId(c);this.$focusables=e.find(":sapFocusable");e.bind('keydown',q.proxy(this,"_tinyMCEKeyboardHandler"));q.sap.byId(this.getId()+"-textarea_fontselect").attr("title","Font");q.sap.byId(this.getId()+"-textarea_fontsizeselect").attr("title","Font Size");b.bind('focus',function(){if(!t){t=true;if(sap.ui.Device.browser.internet_explorer||sap.ui.Device.browser.edge){I.trigger('activate');}else{I.trigger('focus');}b.focus();t=false;}});this._registerWithPopupTinyMCE();window.tinymce.execCommand('mceFocus',false,this._textAreaId);this.fireReady();};a.prototype.reinitializeTinyMCE=function(){if(this._bEditorCreated){this._bEditorCreated=false;this.rerender();this.setContentTinyMCE();}};a.prototype.unloadTinyMCE=function(){if(window.tinymce){try{window.tinymce.execCommand('mceRemoveControl',false,this._textAreaId);}catch(e){}}sap.ui.getCore().getEventBus().unsubscribe("sap.ui","__preserveContent",this._tinyMCEPreserveHandler);sap.ui.getCore().getEventBus().unsubscribe("sap.ui","__beforePopupClose",this._tinyMCEPreserveHandler);};a.prototype.exitTinyMCE=function(){this.bExiting=true;if(this._textAreaDom.parentNode){this._textAreaDom.parentNode.removeChild(this._textAreaDom);}this._textAreaDom=null;this.unloadTinyMCE();};a.prototype.getNativeApiTinyMCE=function(){var e=null;if(window.tinymce&&window.tinymce.majorVersion=="3"&&this._textAreaId){e=window.tinymce.getInstanceById(this._textAreaId);}return e;};a.prototype.setContentTinyMCE=function(){var b=this.getNativeApiTinyMCE(),v;if(b&&b.getContainer()){v=this.getValue();if(v!=null){b.setContent(v);b.undoManager.clear();b.undoManager.add();if(!this.getEditable()){q.each(b.getDoc().getElementsByTagName("a"),function(i,A){A.target="_blank";});}}}};a.prototype._registerWithPopupTinyMCE=function(){var e=this.getNativeApi();var b=sap.ui.getCore().getEventBus();var p=this.$().closest("[data-sap-ui-popup]");setTimeout(function(){if(p.length===1){var s="sap.ui.core.Popup.addFocusableContent-"+p.attr("data-sap-ui-popup");var o={id:this._iframeId};b.publish("sap.ui",s,o);e.windowManager.onOpen.add(function(t,f,P){if(P){o={id:P.mce_window_id+"_ifr"};b.publish("sap.ui",s,o);}});}},0);};a.prototype.initTinyMCE4=function(){this._oEditor=null;this._tinyMCE4Status=E.Initial;this._boundResizeEditorTinyMCE4=this._resizeEditorTinyMCE4.bind(this);this._bInitializationPending=false;this._lastRestHeight=0;sap.ui.getCore().getEventBus().subscribe("sap.ui","__preserveContent",this._tinyMCE4PreserveHandler,this);sap.ui.getCore().getEventBus().subscribe("sap.ui","__beforePopupClose",this._tinyMCE4PreserveHandler,this);};a.prototype.exitTinyMCE4=function(){this._bUnloading=true;sap.ui.getCore().getEventBus().unsubscribe("sap.ui","__preserveContent",this._tinyMCE4PreserveHandler);sap.ui.getCore().getEventBus().unsubscribe("sap.ui","__beforePopupClose",this._tinyMCE4PreserveHandler);R.deregister(this._resizeHandlerId);this._resizeHandlerId=null;this._removeEditorTinyMCE4();};a.prototype._removeEditorTinyMCE4=function(){switch(this._tinyMCE4Status){case E.Initial:case E.Loading:case E.Loaded:break;case E.Initializing:this._pTinyMCE4Initialized.then(this._removeEditorTinyMCE4.bind(this,this._oEditor));break;case E.Ready:this._oEditor.remove();this._oEditor.destroy();this._tinyMCE4Status=E.Destroyed;this._boundResizeEditorTinyMCE4=null;this._oEditor=null;break;case E.Destroyed:break;default:q.sap.log.error("Unknown TinyMCE4 status: "+this._tinyMCE4Status);break;}};a.prototype.onBeforeRenderingTinyMCE4=function(){if(!window.tinymce||window.tinymce.majorVersion!="4"){this._tinyMCE4Status=E.Loading;this._pTinyMCE4Loaded=a.loadTinyMCE(this.getEditorLocation()).then(function(){this._tinyMCE4Status=E.Loaded;}.bind(this));}else{this._pTinyMCE4Loaded=Promise.resolve();this._tinyMCE4Status=E.Loaded;}};a.prototype.onAfterRenderingTinyMCE4=function(){var d=this.getDomRef();if(!window.tinymce){this._pTinyMCE4Loaded.then(this.onAfterRenderingTinyMCE4.bind(this));}else if(window.tinymce.majorVersion!="4"){this._pTinyMCE4Loaded.then(this.onAfterRenderingTinyMCE4.bind(this));}else if(!d){}else{var p=sap.ui.core.RenderManager.findPreservedContent(this.getId());switch(this._tinyMCE4Status){case E.Initializing:if(p.size()>0){this.$().replaceWith(p);}else{d.appendChild(this._textAreaDom);}break;case E.Loaded:case E.Loading:p.remove();this.getDomRef().appendChild(this._textAreaDom);this.reinitializeTinyMCE4();break;case E.Ready:if(p.size()>0){this.$().replaceWith(p);}else{d.appendChild(this._textAreaDom);}this.reinitializeTinyMCE4();break;default:q.sap.log.error("Unknown TinyMCE4 status: "+this._tinyMCE4Status);break;}}};a.prototype.reinitializeTinyMCE4=function(){if(this._bInitializationPending||this._bUnloading){return;}var r=function(){if(this._oEditor){window.tinymce.execCommand('mceRemoveControl',false,this._textAreaId,{skip_focus:true});this._oEditor.destroy();}this._initializeTinyMCE4();}.bind(this);switch(this._tinyMCE4Status){case E.Initial:break;case E.Loading:this._bInitializationPending=true;this._pTinyMCE4Loaded.then(r);break;case E.Initializing:this._bInitializationPending=true;this._pTinyMCE4Initialized.then(r);break;case E.Loaded:case E.Ready:this._bInitializationPending=true;setTimeout(function(){r();},0);break;default:q.sap.log.error("Unknown TinyMCE4 status: "+this._tinyMCE4Status);break;}};a.prototype.getNativeApiTinyMCE4=function(){return this._oEditor;};a.prototype.setValueTinyMCE4=function(v){switch(this._tinyMCE4Status){case E.Initial:case E.Initializing:case E.Loading:break;case E.Ready:this._oEditor.setContent(v);this._oEditor.undoManager.clear();this._oEditor.undoManager.add();if(!this.getEditable()){q.each(this._oEditor.getDoc().getElementsByTagName("a"),function(i,A){A.target="_blank";});}break;default:q.sap.log.error("Unknown TinyMCE4 status: "+this._tinyMCE4Status);break;}};a.prototype._initializeTinyMCE4=function(){this._pTinyMCE4Initialized=new Promise(function(r,f){this._bInitializationPending=false;this._tinyMCE4Status=E.Initializing;this._textAreaDom.value=this.getValue();window.tinymce.init(this._createConfigTinyMCE4(function(){this._tinyMCE4Status=E.Ready;setTimeout(function(){if(!this._bInitializationPending){this._onAfterReadyTinyMCE4();}r();}.bind(this),0);}.bind(this)));}.bind(this));};a.prototype._onAfterReadyTinyMCE4=function(){if(this._bUnloading){return;}this._oEditor.on("change",function(c){this.onTinyMCEChange(this._oEditor);}.bind(this));var e=q(this._oEditor.getContainer());e.bind('keydown',q.proxy(this,this._tinyMCEKeyboardHandler));var $=q.sap.byId(this._iframeId);var b=q(this._oEditor.getBody());var t=false;b.bind('focus',function(){if(!t){t=true;if(sap.ui.Device.browser.internet_explorer||sap.ui.Device.browser.edge){$.trigger('activate');}else{$.trigger('focus');}b.focus();t=false;}});if(this.getTooltip()&&this.getTooltip().length>0){var T=this.getTooltip_Text();this._oEditor.getBody().setAttribute("title",T);$.attr("title",T);}this._registerWithPopupTinyMCE4();if(!this._resizeHandlerId){this._resizeHandlerId=R.register(this,this._boundResizeEditorTinyMCE4);}var r=this._resizeEditorTinyMCE4.bind(this);var o=this._oEditor.getDoc();if(o.readyState=="complete"){r();}else{o.addEventListener("readystatechange",function(){if(o.readyState=="complete"){r();}});}this.fireReadyTinyMCE4();};a.prototype.fireReadyTinyMCE4=function(){switch(this._tinyMCE4Status){case E.Initial:case E.Loading:case E.Loaded:case E.Initializing:break;case E.Ready:if(!this._readyFired&&!this._bInitializationPending){this._readyFired=true;this.fireReady.apply(this,arguments);}break;default:q.sap.log.error("Unknown TinyMCE4 status: "+this._tinyMCE4Status);break;}};a.prototype._createConfigTinyMCE4=function(o){var b=this._createButtonRowsTinyMCE(" ","|");if(b.length===0){b=false;}var p=this._createPluginsListTinyMCE();var c={directionality:(sap.ui.getCore().getConfiguration().getRTL()?"rtl":"ltr"),content_css:sap.ui.resource('sap.ui.richtexteditor',"themes/base/content/TinyMCE4Content.css"),selector:"#"+this._textAreaId,theme:"modern",menubar:false,language:this._getLanguageTinyMCE4(),browser_spellcheck:true,convert_urls:false,plugins:p,toolbar_items_size:'small',toolbar:b,statusbar:false,image_advtab:true,readonly:(this.getEditable()?0:1),nowrap:!this.getWrapping(),init_instance_callback:function(e){this._oEditor=e;o();}.bind(this)};this.fireBeforeEditorInit({configuration:c});return c;};a.prototype._getLanguageTinyMCE4=function(){var L=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());var s=L.getLanguage();var r=L.getRegion();s=a.MAPPED_LANGUAGES_TINYMCE4[s]||s;if(!r){r=a.SUPPORTED_LANGUAGES_DEFAULT_REGIONS[s];}var b=r?s+"_"+r.toUpperCase():s;if(!a.SUPPORTED_LANGUAGES_TINYMCE4[b]){b=s;}if(!a.SUPPORTED_LANGUAGES_TINYMCE4[b]){b="en";}return b;};a.prototype._resizeEditorTinyMCE4=function(){if(this._tinyMCE4Status!==E.Ready){return;}var e=this._oEditor.getContentAreaContainer();var f=this.$().height();var c=q(this._oEditor.getContainer()).height();var i=q(e).height();var r=f-(c-i);var d=Math.abs(this._lastRestHeight-r);if(d==0||d>5){try{this._oEditor.theme.resizeTo(undefined,r);}catch(b){}}this._lastRestHeight=r;};a.prototype._registerWithPopupTinyMCE4=function(){var b=sap.ui.getCore().getEventBus();var p=this.$().closest("[data-sap-ui-popup]");setTimeout(function(){if(p.length===1){var P=p.attr("data-sap-ui-popup");var o={id:this._iframeId};b.publish("sap.ui","sap.ui.core.Popup.addFocusableContent-"+P,o);if(this._oEditor){this._oEditor.on('OpenWindow',function(e){var o={id:e.win._id};b.publish("sap.ui","sap.ui.core.Popup.addFocusableContent-"+P,o);});this._oEditor.on('CloseWindow',function(e){var o={id:e.win._id};b.publish("sap.ui","sap.ui.core.Popup.removeFocusableContent-"+P,o);});}}}.bind(this),0);};a.prototype._tinyMCE4PreserveHandler=function(c,e,d){if((this.getDomRef()&&window.tinymce&&q(d.domNode).find(q.sap.byId(this._textAreaId)).length>0)||(q.sap.byId(this._textAreaId).length===0)){if(this._oEditor){try{this._oEditor.save();var s=this._oEditor.getContent();this.setProperty("value",s,true);}catch(b){q.sap.log.warning("TinyMCE was hidden before value could be read, changes might be lost.");}this._oEditor.hide();this._removeEditorTinyMCE4(this._oEditor);}}};return a;},true);};