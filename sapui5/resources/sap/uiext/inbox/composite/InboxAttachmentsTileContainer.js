/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2016 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainer");jQuery.sap.require("sap.uiext.inbox.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentsTileContainer",{metadata:{publicMethods:["addUploadHeader","removeUploadHeader"],library:"sap.uiext.inbox",properties:{"uploadUrl":{type:"string",group:"Misc",defaultValue:null},"fileName":{type:"string",group:"Misc",defaultValue:null},"fileType":{type:"string",group:"Misc",defaultValue:null},"isFileSelected":{type:"boolean",group:"Misc",defaultValue:null},"enteredDescription":{type:"string",group:"Misc",defaultValue:null},"showAddTile":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"attachments":{type:"sap.uiext.inbox.composite.InboxAttachmentTile",multiple:true,singularName:"attachment"},"firstTile":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{"uploadButtonPress":{},"uploadSuccess":{},"uploadFailed":{}}}});sap.uiext.inbox.composite.InboxAttachmentsTileContainer.M_EVENTS={'uploadButtonPress':'uploadButtonPress','uploadSuccess':'uploadSuccess','uploadFailed':'uploadFailed'};
/*!
 * @copyright@
 */
jQuery.sap.require("sap.uiext.inbox.composite.InboxAttachmentFileUploader");jQuery.sap.require("sap.uiext.inbox.InboxUtils");jQuery.sap.require("sap.ui.commons.MessageBox");
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.init=function(){var t=this;this.oUtils=sap.uiext.inbox.InboxUtils;this._oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");this.oAddAttachmentTile=new sap.uiext.inbox.composite.InboxAddAttachmentTile();this.setAggregation("firstTile",this.oAddAttachmentTile);this.oUploadAttachmentTile=new sap.uiext.inbox.composite.InboxUploadAttachmentTile();this.oUploadAttachmentTile.getUploadButton().attachPress(function(e){t.getAggregation("firstTile").setBusy(true);t.fireUploadButtonPress();});this.oUploadAttachmentTile.getCancelButton().attachPress(function(e){t.resetFileUploader();t.resetFirstTile();});this.oFileUploader=new sap.uiext.inbox.composite.InboxAttachmentFileUploader({sendXHR:true,change:jQuery.proxy(function(e){this.oFileUploader.setUploadUrl(this.getUploadUrl());var f=this.oFileUploader.oFileUpload.files[0];if(f&&f.size===0){this.oFileUploader.setValue("");sap.ui.commons.MessageBox.alert(t._oBundle.getText("SIZE_ZERO_ATTACHMENT_ALERT"));}else{this.oUploadAttachmentTile.setFileName(f.name).setFileTypeIcon(this.oUtils._getFileTypeIcon(f.type));this.setAggregation("firstTile",this.oUploadAttachmentTile);}},this),uploadComplete:function(e){var s=e.getParameter("status");if(s&&s==201){t.fireUploadSuccess({"attachmentResponse":e.getParameter("response"),"statusCode":s,"headerParameters":e.getParameter("headerParameters")});}else{t.fireUploadFailed({"attachmentResponse":e.getParameter("response"),"statusCode":s,"securityToken":e.getParameter("x-csrf-token"),"headerParameters":e.getParameter("headerParameters")});}t.resetFileUploader();t.resetFirstTile();}});};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.onclick=function(e){if(e.target.id===this.getAggregation("firstTile").getId()+"_textAddAttachment"){jQuery.sap.byId(this.oFileUploader.getId()+"-fu").trigger("click");}};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileName=function(){if(this.getIsFileSelected()){return this.oFileUploader.oFileUpload.files[0].name;}};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileType=function(){if(this.getIsFileSelected()){return this.oFileUploader.oFileUpload.files[0].type;}};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.addUploadHeader=function(h,H){this.oFileUploader.addHeaderParameter(new sap.ui.commons.FileUploaderParameter({name:h,value:H}));};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getIsFileSelected=function(){return this.oFileUploader.oFileUpload.files.length>0;};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFileUploader=function(){this.oFileUploader.setValue("").destroyHeaderParameters();};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFirstTile=function(){this.getAggregation("firstTile").setBusy(false);this.setAggregation("firstTile",this.oAddAttachmentTile);};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.triggerUpload=function(e){this.oFileUploader.upload();};
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.removeUploadHeader=function(h){var t=this;jQuery.each(this.oFileUploader.getHeaderParameters(),function(i,H){if(H.getName()===h)t.oFileUploader.removeHeaderParameter(H);});};