///////////////
//Testing Part: Number type
///////////////

// require module to be tested
jQuery.sap.require("sap.ca.ui.model.type.Number");

function getSapCaUiNumber() {
    return new sap.ca.ui.model.type.Number();
}


// --------------------------------------------------------------------------------
module("NumberType");

test("formatValue to string", function () {
    equal(getSapCaUiNumber().formatValue("340", "string"), "340", 'formatValue("340", "string") == "340"');
});

test("formatValue to int", function () {
    equal(getSapCaUiNumber().formatValue(340, "int"), 340, 'formatValue("340", "int") == "340"');
});

test("formatValue to float", function () {
    equal(getSapCaUiNumber().formatValue(40, "float"), 40, 'formatValue("40", "float") == "40"');
});


test("parseValue from string", function () {
    equal(getSapCaUiNumber().parseValue("340", "string"), "340", 'parseValue("340") == "340"');
});


test("validateValue Good", function () {
    equal(getSapCaUiNumber().validateValue(340), undefined, 'validateValue(340) == undefined');
});