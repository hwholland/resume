/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.components.socialtimeline.controls.TimelineEntryControl");
jQuery.sap.require("sap.collaboration.components.utils.CommonUtil");
jQuery.sap.require("sap.ui.core.Control");
sap.ui.core.Control.extend("sap.collaboration.components.socialtimeline.controls.TimelineEntryControl",
		{metadata:
			{	publicMethods:[],
				library:"sap.collaboration",
				properties:{
					"timelineEntry":{type:"object", group:"data"}
				},
				aggregations:{	
				}/*,
				events:{
					"customActionPress" : {}
				}*/
			}
});
/**
*  Initializes the Control instance after creation. [borrowed from sap.ui.core.Control]
* @protected
*/
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype.init = function(){
	this._oCommonUtil = new sap.collaboration.components.utils.CommonUtil();
	this._oLangBundle = this._oCommonUtil.getLanguageBundle();
};
/**
* Function is called before the rendering of the control is started. [borrowed from sap.ui.core.Control]
* @protected
*/
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype.onBeforeRendering = function(){
	if(!this._oFlexbox){
		this._oFlexbox = new sap.m.FlexBox(this.getId() + "_flexbox",{direction: "Column"});
		this._fillFlexbox();
	}
};
/**
* Cleans up the control instance before destruction. [borrowed from sap.ui.core.Control]
* @protected
*/
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype.exit = function(){
	if(this._oFlexbox){
		this._oFlexbox.destroy();
		if(this._oPopover){
			this._oPopover.destroy();
		}
	}
};
/**
 * Fills the Flexbox control with content; Text and Link
 * @private
 */
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._fillFlexbox = function() {
	var oTimelineEntry = this.getTimelineEntry();
	
	if(oTimelineEntry.timelineEntryDetails != undefined 
			&& oTimelineEntry.timelineEntryDetails.length > 0){
		
		var sFirstEntry = this._parseTimelineEntryDetail(oTimelineEntry.timelineEntryDetails[0]); 
		this._oFlexbox.addItem( new sap.m.Text({text: sFirstEntry}) );
		if(oTimelineEntry.timelineEntryDetails.length > 1){
			var oLink = this._createLink(oTimelineEntry.timelineEntryDetails);
			this._oFlexbox.addItem(oLink);
		}
	}
	else{
		this._oFlexbox.addItem( new sap.m.Text({text: oTimelineEntry.text}) );
	}
	
	/*if(oTimelineEntry.customActionData){
		var oLink = this._createCustomActionLink(oTimelineEntry.customActionData);
		this._oFlexbox.addItem(oLink);
	}*/
	
	
};
/**
 * Creates Link control for the additional changes
 * @param {array} aTimelineEntryDetails - Number of timeline entry details
 * @returns {sap.m.Link} Link control
 */
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._createLink = function(aTimelineEntryDetails){
	var self = this;
	var iAdditionalChanges = aTimelineEntryDetails.length - 1;
	var oLink = new sap.m.Link(this.getId()+"_PopoverLink",{ text:  this._oLangBundle.getText("TE_LINK_TEXT",iAdditionalChanges) });
	oLink.attachPress(function(){ 	if (!self._oPopover){
										self._oPopover = self._createPopover(aTimelineEntryDetails);
									}	
								  	self._oPopover.openBy(oLink);
								});		
	return oLink;		
};

/**
 * Creates Link control for the custom action
 * @param {object} oCustomActionData the data needed for the custom action
 * @returns {sap.m.Link} Link control
 */
/*sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._createCustomActionLink = function(oCustomActionData){
	var oLink = new sap.m.Link(this.getId()+"_CustomAction",{ text: oCustomActionData.text });
	oLink.attachPress({key: oCustomActionData.key, oODataEntry: oCustomActionData.oDataEntry}, this._onLinkPress, this);		
	return oLink;		
};

sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._onLinkPress = function(oEvent, oData) {
	this.fireCustomActionPress(oData);
};*/

/**
 * Create the popover list for the additional changes
 * @param {array} aTimelineEntryDetails - list of timeline entry details items
 * @returns {sap.m.Popover}
 */
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._createPopover = function(aTimelineEntryDetails){
	
	var oChangeList = new sap.m.List(this.getId()+"_ChangeList",{inset:false});

	for (var oEntry in aTimelineEntryDetails){
		var sEntry = this._parseTimelineEntryDetail(aTimelineEntryDetails[oEntry]);
		var oListItem = new sap.m.FeedListItem({text: sEntry,
												showIcon: false});
		oChangeList.addItem(oListItem);
	}
	
	var S_CONTENT_WIDTH = "20em";
	var oPopover = new sap.m.Popover(this.getId()+"_Popover",{
		contentWidth: S_CONTENT_WIDTH,
		placement: sap.m.PlacementType.Auto,
		title: this._oLangBundle.getText("TE_DETAILS_POPOVER_HEADER") + "(" + aTimelineEntryDetails.length +")",
		content:[oChangeList]
	});				
	return oPopover;
};
/**
 * Parses the Timeline entry detail to a format for the additional changes to be displayed in the popover
 * @param {Object} oDetail - Timeline entry detail
 * @returns {String} Timeline entry change description
 */
sap.collaboration.components.socialtimeline.controls.TimelineEntryControl.prototype._parseTimelineEntryDetail = function(oDetail){
	
	var sTimelineEntryDetail="";
	
	switch (oDetail.changeType) {
		case "U":
			sTimelineEntryDetail = this._oLangBundle.getText("TE_DETAILS_CHANGED",[oDetail.propertyLabel, oDetail.beforeValue, oDetail.afterValue]);
			break;
		case "I":
			sTimelineEntryDetail = this._oLangBundle.getText("TE_DETAILS_SET",[oDetail.propertyLabel, oDetail.afterValue]);
			break;
		case "D":
			sTimelineEntryDetail = this._oLangBundle.getText("TE_DETAILS_CLEARED",[oDetail.propertyLabel, oDetail.beforeValue]);
			break;
	}		
	return sTimelineEntryDetail;
};
	