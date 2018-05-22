/*globals QUnit*/
(function() {
    'use strict';
    jQuery.sap.require("sap.ui.comp.smartform.flexibility.Input");

    QUnit.module("sap.ui.comp.smartform.flexibility.Input", {
        beforeEach: function() {
            this.input = new sap.ui.comp.smartform.flexibility.Input();
            this.input.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function() {
            this.input.destroy();
        }
    });

    QUnit.test("Shall be instantiable", function(assert) {
        assert.ok(this.input);
    });

    QUnit.test("Replaces an empty entry with the last value", function(assert) {
        var initialValue = "test";
        var changedValue = "";
        this.input.setValue(changedValue);
        this.input._lastValue = initialValue; // overwrite _lastValue set on setValue

        this.input.resetOnEmptyValue();

        assert.equal(this.input.getValue(), initialValue);
    });

    QUnit.test("Applies the change after the focus is lost", function(assert) {
        var initialValue = "test";
        var changedValue = "notEmpty";
        this.input.setValue(changedValue);
        this.input._lastValue = initialValue; // overwrite _lastValue set on setValue

        this.input.resetOnEmptyValue();

        assert.equal(this.input.getValue(), changedValue);
    });

    QUnit.test("checks for an empty entry after the focus is lost", function(assert) {
        this.stub(sap.m.Input.prototype.onsapfocusleave, "apply");
        var oTestInputField = new sap.ui.comp.smartform.flexibility.Input();
        oTestInputField.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        var oResetOnEmptyValueStub = this.stub(oTestInputField, "resetOnEmptyValue");

        oTestInputField.onsapfocusleave();

        assert.equal(oResetOnEmptyValueStub.callCount, 1);
    });

    QUnit.test("Checks for and empty entry after enter is pressed", function () {
        var oResetOnEmptyValueStub = this.stub(this.input, "resetOnEmptyValue");

        this.input.onsapenter();

        assert.equal(oResetOnEmptyValueStub.callCount, 1);
    });
}());
