/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.messageDefinition");

sap.apf.modeler.core.messageDefinition = [ {
	code : "11005",
	severity : "technError",
	text : "Bad HTTP request returned status code {0} with status text {1}."
}, {
	code : "11006",
	severity : "technError",
	text : "Unknown identifier: {0}"
}, {
	code : "11007",
	severity : "technError",
	text : "Cannot export unsaved configuration. Configuration ID: {0}"
}, {
	code : "11008",
	severity : "error",
	description : "Format information is missing at least for text element {0} - please edit the exported text property file manually",
	key : "11008"
}, {
	code : "11009",
	severity : "error",
	description : "Application id {0} cannot be used as translation uuid in text property file - please edit the exported text property file manually",
	key : "11009"
}, {
	code : "11010",
	severity : "error",
	description : "Imported text property file does not contain the APF application id - expected an entry like #ApfApplicationId=543EC63F05550175E10000000A445B6D.",
	key : "11010"
}, {
	code : "11011",
	severity : "error",
	description : "Expected a valid text entry <key>=<value> in line {0}, but could not find - key must be in valid guid format.",
	key : 11011
}, {
	code : "11012",
	severity : "error",
	description : "No valid text entry <key>=<value> in line {0}, key is not in valid guid format like 543EC63F05550175E10000000A445B6D.",
	key : 11012
}, {
	code : "11013",
	severity : "technError",
	text : "Metadata request {0} to server failed."
}, {
	code : "11014",
	severity : "error",
	description : "ApfApplicationId in line {0} has invalid format - a valid application id looks like 543EC63F05550175E10000000A445B6D.",
	key : "11014"
}, {
	code : "11015",
	severity : "error",
	description : "Date in line {0} has invalid format.",
	key : "11015"
}, {
	code : "11016",
	severity : "error",
	description : "Sorting options must be supplied when setting top n",
	key : "11016"
},{
	code : "11020",
	severity : "error",
	description : "Text property has invalid format and cannot be imported - see previous messages for details",
	key : "11020"
}, {
	code : "11021",
	severity : "error",
	description : "ApfApplicationId {0} referenced in the text property is not yet existing - please load one configuration of the application before importing the texts.",
	key : "11021"
},
{
	code : "11030",
	severity : "error",
	description : "Label {0} is not valid",
	key : "11030"
},
{
	code : "11031",
	severity : "error",
	description : "Category {0} is not valid",
	key : "11031"
},
{
	code : "11032",
	severity : "error",
	description : "Request {0} is not valid",
	key : "11032"
},
{
	code : "11033",
	severity : "error",
	description : "Binding {0} is not valid",
	key : "11033"
},
{
	code : "11034",
	severity : "error",
	description : "Facet filter {0} is not valid",
	key : "11034"
},
{
	code : "11035",
	severity : "error",
	description : "Step {0} is not valid",
	key : "11035"
},
{
	code : "11036",
	severity : "error",
	description : "Configuration is not valid",
	key : "11036"
},
{
	code : "11037",
	severity : "error",
	description : "Invalid application guid {0}",
	key : "11037"
},
{
	code : "11038",
	severity : "error",
	description : "Invalid configuration guid {0}",
	key : "11038"
},
{
	code : "11039",
	severity : "error",
	description : "Invalid text guid {0}",
	key : "11039"
},
{
	code : "11040",
	severity : "error",
	description : "Navigation target {0} is not valid",
	key : "11040"
},{
	code : "11041",
	severity : "technError",
	text : "Network service for retrieving semantic objects failed - see console."
},{
	code : "11042",
	severity : "technError",
	text : "Error occurred when retrieving actions for semantic object - see console."
},{
	code : "11500",
	severity : "error",
	description : "An error occurred while attempting to save the application.",
	key : "11500"
},{
	code : "11501",
	severity : "error",
	description : "An error occurred while attempting to delete the application.",
	key : "11501"
},{
	code : "11502",
	severity : "error",
	description : "An error occurred while importing the configuration.",
	key : "11502"
},{
	code : "11503",
	severity : "error",
	description : "An error occurred while importing the text properties file.",
	key : "11503"
},{
	code : "11504",
	severity : "error",
	description : "An error occurred while retrieving the semantic objects available.",
	key : "11504"
},{
	code : "11505",
	severity : "error",
	description : "An error occurred while retrieving the actions for the given semantic object.",
	key : "11505"
},{
	code : "11506",
	severity : "error",
	description : "An error occurred while getting the unused texts.",
	key : "11506"
},{
	code : "11507",
	severity : "error",
	description : "An error occurred while doing the text pool cleanup.",
	key : "11507"
}
];