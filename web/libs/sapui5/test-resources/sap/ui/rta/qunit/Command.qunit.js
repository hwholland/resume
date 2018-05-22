/* global QUnit sinon */

jQuery.sap.require("sap.ui.qunit.qunit-coverage");

jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.Input");
jQuery.sap.require("sap.ui.fl.changeHandler.Base");
jQuery.sap.require("sap.ui.rta.command.CommandFactory");
jQuery.sap.require("sap.ui.rta.command.FlexCommand");
jQuery.sap.require("sap.ui.rta.command.Group");
jQuery.sap.require("sap.ui.rta.command.Hide");
jQuery.sap.require("sap.ui.rta.command.Unhide");
jQuery.sap.require("sap.ui.rta.command.Stash");
jQuery.sap.require("sap.ui.rta.command.Unstash");
jQuery.sap.require("sap.ui.rta.command.Property");
jQuery.sap.require("sap.ui.rta.command.Rename");
jQuery.sap.require("sap.ui.rta.command.Move");
jQuery.sap.require("sap.ui.rta.command.BindProperty");
jQuery.sap.require("sap.ui.rta.command.CompositeCommand");
jQuery.sap.require("sap.ui.rta.command.Stack");
jQuery.sap.require("sap.ui.rta.Utils");

jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
jQuery.sap.require("sap.ui.comp.smartform.GroupElement");
jQuery.sap.require("sap.ui.comp.smartform.Group");
jQuery.sap.require("sap.ui.comp.smarttable.SmartTable");
jQuery.sap.require("sap.uxap.ObjectPageLayout");

jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.MoveGroups");
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.MoveFields");
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.AddGroup");
jQuery.sap.require("sap.ui.comp.smartform.flexibility.changes.AddFields");

jQuery.sap.require("sap.ui.fl.changeHandler.MoveElements");
jQuery.sap.require("sap.ui.fl.changeHandler.PropertyChange");
jQuery.sap.require("sap.ui.fl.changeHandler.PropertyBindingChange");
jQuery.sap.require("sap.ui.fl.registry.ChangeRegistry");
jQuery.sap.require("sap.ui.fl.registry.SimpleChanges");
jQuery.sap.require("sap.ui.fl.Utils");
jQuery.sap.require("sap.ui.comp.library");

(function() {
	"use strict";


	// already empty flex-change response for the used component
	sap.ui.fl.Cache._entries["sap.ui.rta.test.Component"] = {
		file: [],
		promise: Promise.resolve([])
	};

	var oChangeRegistry = sap.ui.fl.registry.ChangeRegistry.getInstance();

	oChangeRegistry.registerControlsForChanges({
		"sap.m.Button" : [sap.ui.fl.registry.SimpleChanges.propertyChange],
		"sap.m.Input" : [sap.ui.fl.registry.SimpleChanges.propertyBindingChange],
		"sap.m.ObjectHeader" : [sap.ui.fl.registry.SimpleChanges.moveElements],
		"sap.ui.layout.VerticalLayout" : [sap.ui.fl.registry.SimpleChanges.moveElements]
	});

	var CommandFactory = sap.ui.rta.command.CommandFactory;

	var sandbox = sinon.sandbox.create();

	var ERROR_INTENSIONALLY = new Error("this command intensionally failed");

	var oComponent = new sap.ui.getCore().createComponent({
		name : "sap.ui.rta.test",
		id : "testcomponent",
		settings : {
			componentData : {
				"showAdaptButton" : false
			}
		}
	});

	QUnit.module("Given a command factory", {
		beforeEach : function(assert) {
			this.oVisibleControl = new sap.m.Button();
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oVisibleControl = new sap.m.Button(oComponent.createId("myButton"));
			this.oSmartGroup = new sap.ui.comp.smartform.Group(oComponent.createId("mySmartGroup"));
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm(oComponent.createId("mySmartForm"));
			this.oObjectPageLayout = new sap.uxap.ObjectPageLayout(oComponent.createId("myObjectPageLayout"));
			this.oObjectPageSection = new sap.uxap.ObjectPageSection(oComponent.createId("myObjectPageSection"));
			this.oSmartTable = new sap.ui.comp.smarttable.SmartTable(oComponent.createId("mySmartTable"));
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oVisibleControl.destroy();
			this.oSmartGroup.destroy();
			this.oSmartForm.destroy();
			this.oObjectPageLayout.destroy();
			this.oObjectPageSection.destroy();
			this.oSmartTable.destroy();
		}
	});

	QUnit.test("when getting a command,", function(assert) {
		assert.ok(CommandFactory.getCommandFor(this.oVisibleControl, "Hide"), "then Hide command is available");
		assert.ok(CommandFactory.getCommandFor(this.oVisibleControl, "Unhide"), "then Unhide command is available");
	});

	QUnit.test("when getting a move command for smart form (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartForm, "Move");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.comp.smartform.flexibility.changes.MoveGroups,
				"then the specific moveGroups Change Handler is assigned to the command");
	});

	QUnit.test("when getting a property change command for smart form with settings,", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartForm, "Property", {
			propertyName : "visible",
			oldValue : this.oSmartForm.getVisible(),
			newValue : false
		});
		assert.ok(oCommand, "then command is available");
		assert.strictEqual(oCommand.getNewValue(), false, "and its settings are merged correctly");
	});

	QUnit.test("when getting a bind property command,", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartForm, "BindProperty");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.fl.changeHandler.PropertyBindingChange,
				"then the specific Change Handler for binding properties is assigned to the command");
	});

	QUnit.test("when getting a move command for smart form group (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartGroup, "Move");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.comp.smartform.flexibility.changes.MoveFields,
				"then the specific moveFields Change Handler is assigned to the command");
	});

	QUnit.test("when getting a add command for smart form (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartForm, "Add");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.comp.smartform.flexibility.changes.AddGroup,
				"then the specific addGroup Change Handler is assigned to the command");
	});

	QUnit.test("when getting a add command for smart form group (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartGroup, "Add");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.comp.smartform.flexibility.changes.AddFields,
				"then the specific addFields Change Handler is assigned to the command");
	});

	QUnit.test("when getting a move command for object page layout (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oObjectPageLayout, "Move");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.fl.changeHandler.MoveElements,
				"then the generic moveElement Change Handler is assigned to the command");
	});

	QUnit.test("when getting a stash command for object page section (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oObjectPageSection, "Stash");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.fl.changeHandler.StashControl,
				"then the generic Stash Change Handler is assigned to the command");
	});

	QUnit.test("when getting a unstash command for object page section (as source),", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oObjectPageSection, "Unstash");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.fl.changeHandler.UnstashControl,
				"then the generic Unstash Change Handler is assigned to the command");
	});

	QUnit.test("when getting a property change command for smart table,", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartTable, "Property");
		assert.ok(oCommand, "then command is available");
		assert.ok(oCommand.getChangeHandler() === sap.ui.fl.changeHandler.PropertyChange,
				"then the generic property Change Handler is assigned to the command");
	});

	QUnit.test("when getting a group command for smart form group,", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartGroup, "Group");
		assert.ok(oCommand, "then command is available");
	});

	QUnit.test("when getting an ungroup command for smart form group,", function(assert) {
		var oCommand = CommandFactory.getCommandFor(this.oSmartGroup, "Ungroup");
		assert.ok(oCommand, "then command is available");
	});

	QUnit.module("Given a flex command", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.visibleControl = new sap.m.Button(oComponent.createId("myButton"));
			this.oChangeHandler = sap.ui.fl.changeHandler.Base;
			this.oChangeHandler.applyChange = sinon.spy();
			this.oFlexCommand = new sap.ui.rta.command.FlexCommand({
				changeHandler : this.oChangeHandler,
				element : this.visibleControl
			});
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.visibleControl.destroy();
			this.oFlexCommand.destroy();
		}
	});

	QUnit.test("when executing the command,", function(assert) {
		assert.ok(this.oFlexCommand.isEnabled(), "then command is enabled");
		this.oFlexCommand.execute();
		assert.equal(this.oChangeHandler.applyChange.callCount, 1, "then the changehandler should do the work.");
	});

	QUnit.module("Given a hide command and a visible control", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.visibleControl = new sap.m.Button(oComponent.createId("myButton"));
			this.hide = CommandFactory.getCommandFor(this.visibleControl, "Hide");
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.visibleControl.destroy();
			this.hide.destroy();
		}
	});

	QUnit.test("when triggering hide command,", function(assert) {
		this.hide.execute();

		assert.ok(!this.visibleControl.getVisible(), "then the control is not visible");
	});

	QUnit.test("when undo hide command,", function(assert) {
		this.hide.execute();
		this.hide.undo();

		assert.ok(this.visibleControl.getVisible(), "then the control is visible again");
	});

	QUnit.test("when serializing the command,", function(assert) {
		var mActualChange = this.hide.serialize();
		var mExpectedChange = {
			changeType : "hideControl",
			selector : {
				id : this.visibleControl.getId()
			}
		};

		assert.deepEqual(mActualChange, mExpectedChange, "then change data matches");
	});

	QUnit.module("Given a unhide command and a visible control", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.invisibleControl = new sap.m.Button(oComponent.createId("myButton"), {
				visible : false
			});
			this.unhide = new sap.ui.rta.command.Unhide({
				element : this.invisibleControl
			});
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.invisibleControl.destroy();
			this.unhide.destroy();
		}
	});

	QUnit.test("when triggering unhide command,", function(assert) {
		this.unhide.execute();

		assert.ok(this.invisibleControl.getVisible(), "then the control is visible");
	});

	QUnit.test("when undo unhide command,", function(assert) {
		this.unhide.execute();
		this.unhide.undo();

		assert.ok(!this.invisibleControl.getVisible(), "then the control is invisible again");
	});

	QUnit.test("when serializing the command,", function(assert) {
		var mActualChange = this.unhide.serialize();
		var mExpectedChange = {
			changeType : "unhideControl",
			selector : {
				id : this.invisibleControl.getId()
			}
		};

		assert.deepEqual(mActualChange, mExpectedChange, "then change data matches");
	});

	QUnit.module("Given a group command and a groupelement control", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oView = sap.ui.xmlview(oComponent.createId("idMain2"), "sap.ui.rta.test.SmartFormGroup");
			var oEventDelegate = {
				onAfterRendering : function() {
					that.oView.removeEventDelegate(oEventDelegate);
					waitForBinding(that.oView).then(function() {
						that.oSmartForm = that.oView.byId("MainForm");
						that.oGroupField1 = that.oSmartForm.getGroups()[0].getFormElements()[1];
						that.oGroupField2 = that.oSmartForm.getGroups()[0].getFormElements()[2];
						that.group = new sap.ui.rta.command.Group({
							source : that.oGroupField2,
							smartForm : that.oSmartForm,
							element : that.oSmartForm.getGroups()[0],
							groupFields : [that.oGroupField2, that.oGroupField1],
							index : 2
						});
						done();
					});
				}
			};
			this.oView.addEventDelegate(oEventDelegate);
			this.oView.placeAt("test-view");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oView.destroy();
			this.group.destroy();
		}
	});

	QUnit.test("when triggering group command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.group.execute().then(
				function() {
					assert.ok(!that.oGroupField1.getVisible(), "then the first field is invisble");
					assert.ok(!that.oGroupField2.getVisible(), "then the second field is invisble");
					var sNewGroupId = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, [
							that.oGroupField2.getFields()[0].getBindingPath("value"),
							that.oGroupField1.getFields()[0].getBindingPath("value")]);
					var oNewGroupedElement = sap.ui.getCore().byId(sNewGroupId);
					assert.equal(oNewGroupedElement.getFields().length, 2, "the new created element should have 2 fields");
					assert.equal(oNewGroupedElement.getId(), sNewGroupId, "should have the right created id");
					var aFields = oNewGroupedElement.getFields();
					assert.strictEqual(aFields[0].getBindingPath("value"), "Property04",
							" then field 1 has the right binding path");
					assert.strictEqual(aFields[1].getBindingPath("value"), "Property03",
							" then field 2 has the right binding path");

					done();
				});
	});

	QUnit.test("when undo group command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.group.execute().then(
				function() {
					sap.ui.getCore().applyChanges();
					that.group.undo();
					sap.ui.getCore().applyChanges();
					assert.ok(that.oGroupField1.getVisible(), "then the first field is visible again");
					assert.ok(that.oGroupField2.getVisible(), "then the second field is visible again");
					var sNewGroupId = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, [
							that.oGroupField1.getFields()[0].getBindingPath("value"),
							that.oGroupField2.getFields()[0].getBindingPath("value")]);
					assert.ok(!sap.ui.getCore().byId(sNewGroupId), "the on execute created groupelement is destroyed");
					done();
				});
	});

	QUnit.test("when serializing the command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.group.execute().then(function() {
			var mActualChange = that.group.serialize();
			assert.equal(mActualChange.length, 3, "then there are 3 changes");
			var iAdd = 0;
			var iHide = 0;
			mActualChange.forEach(function(oChange) {
				if (oChange.changeType === "addFields") {
					iAdd++;
				} else if (oChange.changeType === "hideControl") {
					iHide++;
				}
			});
			assert.equal(iAdd, 1, "then there is 1 add changes");
			assert.equal(iHide, 2, "then there are 2 hide changes");
			done();
		});
	});

	QUnit.module("Given an ungroup command and a view", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oView = sap.ui.xmlview(oComponent.createId("idMain2"), "sap.ui.rta.test.SmartFormGroup");
			var oEventDelegate = {
				onAfterRendering : function() {
					that.oView.removeEventDelegate(oEventDelegate);
					waitForBinding(that.oView).then(function() {
						setTimeout(function() {
							that.oSmartForm = that.oView.byId("MainForm");
							that.oGroupedFields = that.oView.byId("EntityType01.CombinedFields");
							that.ungroup = new sap.ui.rta.command.Ungroup({
								smartForm : that.oSmartForm,
								element : that.oGroupedFields
							});
							done();
						}, 100)
					});
				}
			};
			this.oView.addEventDelegate(oEventDelegate);
			this.oView.placeAt("test-view");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oView.destroy();
			this.ungroup.destroy();
		}
	});

	QUnit.test("when triggering ungroup command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.ungroup.execute().then(
				function() {
					sap.ui.getCore().applyChanges();
					assert.ok(that.oGroupedFields.bIsDestroyed, "then the first field is invisble");
					var sNewFieldId01 = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, ["Property01"]);
					var sNewFieldId02 = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, ["Property02"]);
					var oNewElement01 = sap.ui.getCore().byId(sNewFieldId01);
					var oNewElement02 = sap.ui.getCore().byId(sNewFieldId02);
					assert.ok(oNewElement01, "the new created element should have 2 fields");
					assert.ok(oNewElement02, "should have the right created id");
					assert.strictEqual(oNewElement01.getFields()[0].getBindingPath("value"), "Property01",
							" then field 1 has the right binding path");
					assert.strictEqual(oNewElement02.getFields()[0].getBindingPath("value"), "Property02",
							" then field 2 has the right binding path");
					done();
				});
	});

	QUnit.test("when undo ugroup command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.ungroup.execute().then(
				function() {
					sap.ui.getCore().applyChanges();
					that.ungroup.undo();
					sap.ui.getCore().applyChanges();

					var sNewFieldId01 = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, ["Property01"]);
					var sNewFieldId02 = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, ["Property02"]);
					var oNewElement01 = sap.ui.getCore().byId(sNewFieldId01);
					var oNewElement02 = sap.ui.getCore().byId(sNewFieldId02);
					assert.ok(!oNewElement01.getVisible(), "the new created element is invisible again");
					assert.ok(!oNewElement02.getVisible(), "the new created element is invisible again");
					var sNewGroupId = sap.ui.rta.Utils.createNewSmartFormGroupElementId(that.oSmartForm, ["Property01",
							"Property02"]);
					assert.ok(sap.ui.getCore().byId(sNewGroupId), "the on execute created groupelement is available");
					done();
				});
	});

	QUnit.test("when serializing the command,", function(assert) {
		var that = this;
		var done = assert.async();
		this.ungroup.execute().then(function() {
			var mActualChange = that.ungroup.serialize();
			assert.equal(mActualChange.length, 2, "then there are 2 changes");
			var iAdd = 0;
			mActualChange.forEach(function(oChange) {
				if (oChange.changeType === "addFields") {
					iAdd++;
				}
			});
			assert.equal(iAdd, 2, "then there are 2 add changes");
			done();
		});
	});

	QUnit.module("Given a stash command and a unstashed control", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oUnstashedControl = new sap.uxap.ObjectPageSection(oComponent.createId("unstachedControl"));
			this.stash = CommandFactory.getCommandFor(this.oUnstashedControl, "Stash", {});
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oUnstashedControl.destroy();
			this.stash.destroy();
		}
	});

	QUnit.test("when triggering stash command,", function(assert) {
		this.stash.execute();

		assert.ok(!this.oUnstashedControl.getVisible(), "then the control is invisible");
	});

	QUnit.test("when undo stash command,", function(assert) {
		this.stash.execute();
		this.stash.undo();

		assert.ok(this.oUnstashedControl.getVisible(), "then the control is visible again");
	});

	QUnit.test("when serializing the command,", function(assert) {
		var mActualChange = this.stash.serialize();
		var mExpectedChange = {
			changeType : "stashControl",
			selector : {
				id : this.oUnstashedControl.getId()
			}
		};

		assert.deepEqual(mActualChange, mExpectedChange, "then change data matches");
	});

	QUnit.module("Given a unstash command and a stashed control", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oStashedControl = new sap.uxap.ObjectPageSection(oComponent.createId("stachedControl"));
			this.oParentControl = new sap.uxap.ObjectPageLayout({
				sections : [this.oStashedControl]
			});
			this.oStashedControl.setStashed(true);
			this.unstash = CommandFactory.getCommandFor(this.oStashedControl, "Unstash", {
				parentAggregationName : "sections",
				index : 0
			});
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oStashedControl.destroy();
			this.unstash.destroy();
		}
	});

	QUnit.test("when triggering unstash command,", function(assert) {
		this.unstash.execute();

		assert.ok(this.oStashedControl.getVisible(), "then the control is visible");
	});

	QUnit.test("when undo unstash command,", function(assert) {
		this.unstash.execute();
		this.unstash.undo();

		assert.ok(!this.oStashedControl.getVisible(), "then the control is invisible again");
	});

	QUnit.test("when serializing the command,", function(assert) {
		var mActualChange = this.unstash.serialize();
		var mExpectedChange = {
			"changeType" : "unstashControl",
			"content" : {
				"index" : 0,
				"parentAggregationName" : "sections"
			},
			"selector" : {
				"id" : this.oStashedControl.getId()
			}
		};

		assert.deepEqual(mActualChange, mExpectedChange, "then change data matches");
	});

	QUnit.module("Given a command stack", {
		beforeEach : function(assert) {
			this.stack = new sap.ui.rta.command.Stack();
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.visibleControl = new sap.m.Button(oComponent.createId("myButton"));
			this.hide = new sap.ui.rta.command.Hide({
				element : this.visibleControl
			});
			this.failingCommand = this.hide.clone();
			this.failingCommand._executeWithElement = function(oElement) {
				throw ERROR_INTENSIONALLY;
			};
			this.visibleControl2 = new sap.m.Button();
			this.hide2 = new sap.ui.rta.command.Hide({
				element : this.visibleControl2
			});
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.visibleControl.destroy();
			this.visibleControl2.destroy();
			this.hide.destroy();
			this.hide2.destroy();
			this.stack.destroy();
		}
	});

	QUnit.test("when un-doing the empty stack, ", function(assert) {
		assert.ok(!this.stack.canUndo(), "then stack cannot be undone");

		this.stack.undo();

		assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length)) && (this.stack._toBeExecuted >= -1), 0,
				" the to be executed index is in range");
	});

	QUnit.test("when re-doing the empty stack, ", function(assert) {
		assert.ok(!this.stack.canRedo(), "then stack cannot be redone");

		this.stack.redo();

		assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length)) && (this.stack._toBeExecuted >= -1), 0,
				" the to be executed index is in range");
	});

	QUnit.test("when pushing a command, ", function(assert) {
		this.stack.push(this.hide);

		var oTopCommand = this.stack.top();
		assert.equal(oTopCommand.getId(), this.hide.getId(), "then it is on the top of stack");
	});

	QUnit.test("when calling pop at the command stack with a command at it's top, ", function(assert) {
		this.stack.push(this.hide);

		var oTopCommand = this.stack.pop();

		assert.equal(oTopCommand.getId(), this.hide.getId(), "then the command is returned");
		assert.ok(this.stack.isEmpty(), "and the command stack is empty");
	});

	QUnit.test("when calling pop at the command stack with an already executed command at it's top, ", function(assert) {
		this.stack.push(this.hide);
		this.stack.push(this.hide2);
		this.stack.execute();

		var oTopCommand = this.stack.pop();

		assert.equal(this.stack._toBeExecuted, -1, " the to be executed index is in range");
		assert.equal(this.stack.getCommands().length, 1, "  only first commmand is on the stack");
		assert.equal(this.stack.getCommands()[0].getId(), this.hide.getId(), "  only first commmand is on the stack");
		assert.ok(!this.visibleControl.getVisible(), " command1 was executed");
		assert.ok(this.visibleControl2.getVisible(), " command2 was not executed");
		assert.equal(oTopCommand.getId(), this.hide2.getId(), " the correct command is returned");
	});

	QUnit.test("when calling pushAndExecute with an failing command as the only command", function(assert) {
		var fnStackModified = sinon.spy();
		this.stack.attachModified(fnStackModified);
		assert.throws(function() {
			this.stack.pushAndExecute(this.failingCommand);
		}, ERROR_INTENSIONALLY, " an error is thrown and catched");
		assert.ok(this.stack.isEmpty(), "and the command stack is still empty");
		assert.equal(fnStackModified.callCount, 2, " the modify stack listener is called twice, onence for push and once for pop");
	});

	QUnit.test("when calling pushAndExecute with an failing command and afterwards with a succeeding command", function(assert) {
		assert.throws(function() {
			this.stack.pushAndExecute(this.failingCommand);
		}, ERROR_INTENSIONALLY, " an error is thrown and catched");

		this.stack.pushAndExecute(this.hide);
		var oTopCommand = this.stack.pop();
		assert.equal(this.stack._toBeExecuted, -1, " the to be executed index is in range");
		assert.ok(this.stack.isEmpty(), "and the command stack is empty");
		assert.equal(oTopCommand.getId(), this.hide.getId(), " the correct command is returned");
	});

	QUnit.test("when calling pop at the command stack with an already executed and a not executed command at it's top, ",
			function(assert) {
				this.stack.pushAndExecute(this.hide);

				var oTopCommand = this.stack.pop();

				assert.equal(this.stack._toBeExecuted, -1, " the to be executed index is in range");
				assert.ok(this.stack.isEmpty(), "and the command stack is empty");
				assert.equal(oTopCommand.getId(), this.hide.getId(), " the correct command is returned");
			});

	QUnit.test("when pushing and executing a command, ", function(assert) {
		this.stack.pushAndExecute(this.hide);

		assert.ok(!this.visibleControl.getVisible(), "then execute will hide the control");
		var oTopCommand = this.stack.top();
		assert.equal(oTopCommand.getId(), this.hide.getId(), "then it is on the top of stack");

		assert.ok(this.stack.canUndo(), "then a command can be undone");
		assert.ok(!this.stack.canRedo(), "then stack cannot be redone");
	});

	QUnit.test("when undoing and redo an empty stack, then no exception should come", function(assert) {
		assert.expect(0);
		this.stack.undo();
		this.stack.redo();
	});

	QUnit.module("Given a property command", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getCurrentLayer").returns("VENDOR");
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.OLD_VALUE = '2px';
			this.NEW_VALUE = '5px';
			this.oControl = new sap.ui.table.Column(oComponent.createId("control"), {
				width : this.OLD_VALUE
			});
			this.oPropertyCommand = new sap.ui.rta.command.Property({
				element : this.oControl,
				propertyName : "width",
				newValue : this.NEW_VALUE,
				oldValue : this.OLD_VALUE,
				semanticMeaning : "resize"
			});
			this.oPropertyCommandWithOutOldValueSet = new sap.ui.rta.command.Property({
				element : this.oControl,
				propertyName : "width",
				newValue : this.NEW_VALUE,
				semanticMeaning : "resize"
			});
			this.fnApplyChangeSpy = sandbox.spy(this.oPropertyCommand.getChangeHandler(), "applyChange");
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oControl.destroy();
			this.oPropertyCommand.destroy();
		}
	});

	QUnit.test("when executing the property command for a property named 'width'", function(assert) {
		this.oPropertyCommand.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 1, "then the changehandler should do the work.");
		assert.equal(this.oControl.getWidth(), this.NEW_VALUE, "then the controls text changed accordingly");

		this.oPropertyCommand.undo();
		assert.equal(this.fnApplyChangeSpy.callCount, 2, "then the changehandler should do the work.");
		assert.equal(this.oControl.getWidth(), this.OLD_VALUE, "then the controls text changed accordingly");

		this.oPropertyCommand.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 3, "then the changehandler should do the work.");
		assert.equal(this.oControl.getWidth(), this.NEW_VALUE, "then the controls text changed accordingly");

	});

	QUnit.test("when serializing the property command for a property named 'width'", function(assert) {
		var mExpectedSerializedCommand = {
			changeType : "propertyChange",
			selector : {
				id : this.oControl.getId(),
				type : this.oControl.getMetadata().getName()
			},
			content : {
				property : "width",
				oldValue : this.OLD_VALUE,
				newValue : this.NEW_VALUE,
				semantic : "resize"
			}
		};

		var mSerializedCommand = this.oPropertyCommand.serialize();
		assert.deepEqual(mSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations");

		var mEnhancedSerializedCommand = this.oPropertyCommandWithOutOldValueSet.serialize();
		assert.deepEqual(mEnhancedSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations (it is enhanced with the old value not given directly)");
	});

	QUnit.module("Given a bind property command", {
		beforeEach : function(assert) {
			sandbox.stub(sap.ui.fl.Utils, "getCurrentLayer").returns("VENDOR");
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.OLD_BOOLEAN_VALUE = false;
			this.NEW_BOOLEAN_BINDING_WITH_CRITICAL_CHARS = "{= ( ${/field1} === 'critical' ) &&  ( ${/field2} > 100 ) }";
			this.NEW_BOOLEAN_VALUE = true;
			this.OLD_VALUE = "critical";
			this.OLD_VALUE_BINDING = "{path:'/field1'}";
			this.NEW_VALUE_BINDING = "{path:'namedModel>/numberAsString', type:'sap.ui.model.type.Integer'}";
			this.NEW_VALUE = "20";
			this.oInput = new sap.m.Input(oComponent.createId("input"), {
				showValueHelp: this.OLD_BOOLEAN_VALUE,
				value: this.OLD_VALUE_BINDING
			});
			var oModel = new sap.ui.model.json.JSONModel({
					field1 : this.OLD_VALUE,
					field2 : 15000
			});
			var oNamedModel = new sap.ui.model.json.JSONModel({
					numberAsString : this.NEW_VALUE
			});
			this.oInput.setModel(oModel);
			this.oInput.setModel(oNamedModel, "namedModel");

			this.oBindShowValueHelpCommand = new sap.ui.rta.command.BindProperty({
				element : this.oInput,
				propertyName : "showValueHelp",
				newBinding : this.NEW_BOOLEAN_BINDING_WITH_CRITICAL_CHARS,
				oldValue : this.OLD_BOOLEAN_VALUE
			});
			this.oBindShowValueHelpCommandWithoutOldValueSet = new sap.ui.rta.command.BindProperty({
				element : this.oInput,
				propertyName : "showValueHelp",
				newBinding : this.NEW_BOOLEAN_BINDING_WITH_CRITICAL_CHARS
			});
			this.oBindValuePropertyCommand = new sap.ui.rta.command.BindProperty({
				element : this.oInput,
				propertyName : "value",
				newBinding : this.NEW_VALUE_BINDING,
				oldBinding : this.OLD_VALUE_BINDING
			});
			this.oBindValuePropertyCommandWithoutOldBindingSet = new sap.ui.rta.command.BindProperty({
				element : this.oInput,
				propertyName : "value",
				newBinding : this.NEW_VALUE_BINDING
			});
			this.fnApplyChangeSpy = sandbox.spy(this.oBindShowValueHelpCommand.getChangeHandler(), "applyChange");
		},
		afterEach : function(assert) {
			sandbox.restore();
			this.oInput.destroy();
			this.oBindShowValueHelpCommand.destroy();
			this.oBindValuePropertyCommand.destroy();
			this.oBindValuePropertyCommandWithoutOldBindingSet.destroy();
		}
	});

	QUnit.test("when executing the bind property command for a boolean property 'showValueHelp' with an old value and with a new binding containing special character  ", function(assert) {
		this.oBindShowValueHelpCommandWithoutOldValueSet.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 1, "then the changehandler should do the work.");
		assert.equal(this.oInput.getShowValueHelp(), this.NEW_BOOLEAN_VALUE, "then the controls property changed accordingly");

		this.oBindShowValueHelpCommandWithoutOldValueSet.undo();
		assert.equal(this.fnApplyChangeSpy.callCount, 2, "then the changehandler should do the work.");
		assert.equal(this.oInput.getShowValueHelp(), this.OLD_BOOLEAN_VALUE, "then the controls property changed accordingly");

		this.oBindShowValueHelpCommandWithoutOldValueSet.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 3, "then the changehandler should do the work.");
		assert.equal(this.oInput.getShowValueHelp(), this.NEW_BOOLEAN_VALUE, "then the controls property changed accordingly");

	});

	QUnit.test("when serializing the bind property command for a boolean property 'showValueHelp' with an old value and with a new binding containing special character  ", function(assert) {
		var mSerializedCommand = this.oBindShowValueHelpCommand.serialize();
		var mExpectedSerializedCommand = {
			changeType : "propertyBindingChange",
			selector : {
				id : this.oInput.getId(),
				type : this.oInput.getMetadata().getName()
			},
			content : {
				property : "showValueHelp",
				oldValue : this.OLD_BOOLEAN_VALUE,
				newBinding : this.NEW_BOOLEAN_BINDING_WITH_CRITICAL_CHARS
			}
		};
		assert.deepEqual(mSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations");

		var mEnhancedSerializedCommand = this.oBindShowValueHelpCommandWithoutOldValueSet.serialize();
		assert.deepEqual(mEnhancedSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations (it is enhanced with the old value not given directly)");

	});

	QUnit.test("when executing the bind property command for a property 'value' with an old binding and with a new binding", function(assert) {
		this.oBindValuePropertyCommandWithoutOldBindingSet.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 1, "then the changehandler should do the work.");
		assert.equal(this.oInput.getValue(), this.NEW_VALUE, "then the controls property changed accordingly");

		this.oBindValuePropertyCommandWithoutOldBindingSet.undo();
		assert.equal(this.fnApplyChangeSpy.callCount, 2, "then the changehandler should do the work.");
		assert.equal(this.oInput.getValue(), this.OLD_VALUE, "then the controls property changed accordingly");

		this.oBindValuePropertyCommandWithoutOldBindingSet.execute();
		assert.equal(this.fnApplyChangeSpy.callCount, 3, "then the changehandler should do the work.");
		assert.equal(this.oInput.getValue(), this.NEW_VALUE, "then the controls property changed accordingly");

	});

	QUnit.test("when serializing the bind property command for a property 'value' with an old binding and with a new binding", function(assert) {
		var mSerializedCommand = this.oBindValuePropertyCommand.serialize();
		var mExpectedSerializedCommand = {
			changeType : "propertyBindingChange",
			selector : {
				id : this.oInput.getId(),
				type : this.oInput.getMetadata().getName()
			},
			content : {
				property : "value",
				oldBinding : this.OLD_VALUE_BINDING,
				newBinding : this.NEW_VALUE_BINDING
			}
		};
		assert.deepEqual(mSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations");

		var mEnhancedSerializedCommand = this.oBindValuePropertyCommandWithoutOldBindingSet.serialize();
		assert.deepEqual(mEnhancedSerializedCommand, mExpectedSerializedCommand,
				"then the serialized format matches our expectations (it is enhanced with the old binding not given directly)");
	});

	QUnit.module("Given a rename command", {
		beforeEach : function(assert) {
			// Test Setup:
			// SmartForm
			// -- groups
			// -- -- SmartGroup1
			// -- -- -- groupElements
			// -- -- -- -- SmartElement
			// -- -- SmartGroup2

			this.oModel = new sap.ui.model.json.JSONModel({
				test : "someLabel"
			});

			sandbox.stub(sap.ui.fl.Utils, "getCurrentLayer").returns("VENDOR");
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);
			this.oSmartGroupElement = new sap.ui.comp.smartform.GroupElement(oComponent.createId("element"), {
				label : "{/test}"
			});
			this.oSmartGroup1 = new sap.ui.comp.smartform.Group(oComponent.createId("group"), {
				label : "{/test}",
				groupElements : [this.oSmartGroupElement]
			});
			this.oSmartGroup2 = new sap.ui.comp.smartform.Group();
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm({
				groups : [this.oSmartGroup1, this.oSmartGroup2]
			});
			this.oSmartGroup1.setModel(this.oModel);

			this.oRenameCommand = CommandFactory.getCommandFor(this.oSmartGroup1, "Rename");
			this.oRenameCommand1 = CommandFactory.getCommandFor(this.oSmartForm, "Rename");
			this.oRenameCommand2 = CommandFactory.getCommandFor(this.oSmartGroupElement, "Rename");

		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oSmartForm.destroy();
			this.oRenameCommand.destroy();
			this.oRenameCommand1.destroy();
			this.oRenameCommand2.destroy();
		}
	});

	QUnit.test("when serializing the rename commands", function(assert) {
		assert.deepEqual(this.oRenameCommand.serialize(), {
		  "changeType": "renameGroup",
		  "groupLabel": "new text",
		  "selector": {
		    "id": this.oSmartGroup1.getId()
		  }
		},  "then smart group specific change format is there");
		assert.deepEqual(this.oRenameCommand1.serialize(), {
		  "changeType": "renameField",
		  "fieldLabel": "new text",
		  "labelProperty": "title",
		  "selector": {
		    "id": this.oSmartForm.getId()
		  }
		},  "then smart form specific change format is there");
		assert.deepEqual(this.oRenameCommand2.serialize(), {
		  "changeType": "renameField",
		  "fieldLabel": "new text",
		  "labelProperty": "label",
		  "selector": {
		    "id": this.oSmartGroupElement.getId()
		  }
		},  "then smart group elment specific change format is there");

	});

	QUnit.test("when executing the rename command for smartform group", function(assert) {
		assert.ok(this.oRenameCommand.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Group Label";
		this.oRenameCommand.setNewValue(sTobeTestedText);
		this.oRenameCommand.execute();
		assert.equal(this.oSmartGroup1.getLabel(), sTobeTestedText, "then the groups text changed accordingly");
		assert.ok(this.oSmartGroup1.getBinding("label").isSuspended(), "then the binding is suspended");

	});

	QUnit.test("when undoing the rename command for a smartform group", function(assert) {
		assert.ok(this.oRenameCommand.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Group Label";
		this.oRenameCommand.setNewValue(sTobeTestedText);
		this.oRenameCommand.execute();
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldValue>
		this.oRenameCommand.undo();
		assert.equal(this.oSmartGroup1.getBindingInfo("label").parts[0].path, "/test", "then the binding is restored");
		assert.equal(this.oSmartGroup1.getLabel(), "someLabel", "then the groups label text is restored");
		assert.ok(!this.oSmartGroup1.getBinding("label").isSuspended(), "then the binding is resumed");

	});

	QUnit.test("when executing the rename command for smartform title", function(assert) {
		assert.ok(this.oRenameCommand1.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Form Label";
		this.oRenameCommand1.setNewValue(sTobeTestedText);
		this.oRenameCommand1.execute();
		assert.equal(this.oSmartForm.getTitle(), sTobeTestedText, "then the smartforms title changed accordingly");

	});

	QUnit.test("when undoing the rename command for smartform title", function(assert) {
		assert.ok(this.oRenameCommand.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Form Label";
		var sOldValue = "Old Form Label";

		this.oRenameCommand1.setNewValue(sOldValue);
		this.oRenameCommand1.execute();
		this.oRenameCommand1.setNewValue(sTobeTestedText);
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldValue>
		this.oRenameCommand1.execute();

		this.oRenameCommand1.undo();

		assert.equal(this.oSmartForm.getTitle(), sOldValue, "then the smartforms title text is restored");

	});

	QUnit.test("when executing the rename command for a smartform group element", function(assert) {
		assert.ok(this.oRenameCommand2.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Group Element Label";
		this.oRenameCommand2.setNewValue(sTobeTestedText);
		this.oRenameCommand2.execute();

		assert.equal(this.oSmartGroupElement.getLabelText(), sTobeTestedText,
				"then the group elements text changed accordingly");
		assert.ok(this.oSmartGroupElement.getBinding("label").isSuspended(), "then the binding is suspended");
	});

	QUnit.test("when undoing the rename command for a smartform group element", function(assert) {
		assert.ok(this.oRenameCommand.isEnabled(), "then the command is enabled for the given control");

		var sTobeTestedText = "New Form Label";
		this.oRenameCommand2.setNewValue(sTobeTestedText);
		this.oRenameCommand2.execute();

		this.oRenameCommand2.undo();
		assert
				.equal(this.oSmartGroupElement.getBindingInfo("label").parts[0].path, "/test", "then the binding is restored");
		assert.equal(this.oSmartGroupElement.getLabelText(), "someLabel", "then the elements label text is restored");
		assert.ok(!this.oSmartGroupElement.getBinding("label").isSuspended(), "then the binding is resumed");

	});
/*
	QUnit.module("Given a rename command for a SimpleForm control", {
		beforeEach : function(assert) {
			// Test Setup:
			// SimpleForm
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oModel = new sap.ui.model.json.JSONModel({
				label : "someLabel",
				title : "someTitle"
			});

			this.oTitle0 = new sap.ui.core.Title({id : "Title0",  text : "Title 0"});
			this.oTitle1 = new sap.ui.core.Title({id : "Title1",  text : "{/title}"});
			this.oLabel0 = new sap.m.Label({id : "Label0",  text : "Label 0"});
			this.oLabel1 = new sap.m.Label({id : "Label1",  text : "Label 1"});
			this.oLabel2 = new sap.m.Label({id : "Label2",  text : "{/label}"});
			this.oLabel3 = new sap.m.Label({id : "Label3",  text : "Label 3"});
			this.oInput0 = new sap.m.Input({id : "Input0"});
			this.oInput1 = new sap.m.Input({id : "Input1"});
			this.oInput2 = new sap.m.Input({id : "Input2"});
			this.oInput3 = new sap.m.Input({id : "Input3"});
			this.oSimpleForm = new sap.ui.layout.form.SimpleForm(oComponent.createId("form"), {
				id : "SimpleForm", maxContainerCols : 2, editable : true, layout : "ResponsiveGridLayout",
				title : "Simple Form", labelSpanXL : 4, labelSpanL : 4, labelSpanM : 4, emptySpanXL : 0,
				emptySpanL : 0, emptySpanM : 0, columnsXL : 3, columnsL : 2, columnsM : 2, class : "editableForm",
				content : [this.oTitle0, this.oLabel0, this.oInput0, this.oLabel1, this.oInput1,
				           this.oTitle1, this.oLabel2, this.oInput2, this.oLabel3, this.oInput3]
			});
			this.oSimpleForm.setModel(this.oModel);
			this.oSimpleForm.placeAt("test-view");
			sap.ui.getCore().applyChanges();

			this.oFormContainer1 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[0];
			this.oFormElement1 = this.oFormContainer1.getAggregation("formElements")[0];
			this.oRenameCommand1 = CommandFactory.getCommandFor(this.oFormContainer1, "Rename");
			this.oRenameCommand2 = CommandFactory.getCommandFor(this.oFormElement1, "Rename");

			this.oFormContainer2 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[1];
			this.oFormElement2 = this.oFormContainer2.getAggregation("formElements")[0];
			this.oRenameCommand3 = CommandFactory.getCommandFor(this.oFormContainer2, "Rename");
			this.oRenameCommand4 = CommandFactory.getCommandFor(this.oFormElement2, "Rename");

		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oSimpleForm.destroy();
			this.oFormContainer1.destroy();
			this.oFormContainer2.destroy();
			this.oFormElement1.destroy();
			this.oFormElement2.destroy();
			this.oRenameCommand1.destroy();
			this.oRenameCommand2.destroy();
			this.oRenameCommand3.destroy();
			this.oRenameCommand4.destroy();
		}
	});

	QUnit.test("when serializing the rename commands", function(assert) {
		assert.deepEqual(this.oRenameCommand1.serialize(), {
		  "changeType": "renameTitle",
		  "value": "new text",
		  "sRenameId": this.oTitle0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for title in SimpleForm is there");
		assert.deepEqual(this.oRenameCommand2.serialize(), {
		  "changeType": "renameLabel",
		  "value": "new text",
		  "sRenameId": this.oLabel0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for label in SimpleForm is there");
	});

	QUnit.test("when executing the rename command for SimpleForm", function(assert) {
		assert.ok(this.oRenameCommand1.isEnabled(), "then the command is enabled for the SimpleForm control via FormContainer");
		assert.ok(this.oRenameCommand2.isEnabled(), "then the command is enabled for the SimpleForm control via FormElement");

		var sTobeTestedText = "New Title";
		this.oRenameCommand1.setNewValue(sTobeTestedText);
		this.oRenameCommand1.execute();
		assert.equal(this.oFormContainer1.getTitle().getText(), sTobeTestedText, "then the title text changed accordingly");

		var sTobeTestedText = "New Label";
		this.oRenameCommand2.setNewValue(sTobeTestedText);
		this.oRenameCommand2.execute();
		assert.equal(this.oFormElement1.getLabel().getText(), sTobeTestedText, "then the label text changed accordingly");

	});

	QUnit.test("when executing the rename command for SimpleForm with bound label and title", function(assert) {
		var sTobeTestedText = "New Title";
		this.oRenameCommand3.setNewValue(sTobeTestedText);
		this.oRenameCommand3.execute();
		assert.equal(this.oFormContainer2.getTitle().getText(), sTobeTestedText, "then the title text changed accordingly");
		assert.ok(this.oFormContainer2.getTitle().getBinding("text").isSuspended(), "then the title binding is suspended");

		var sTobeTestedText = "New Label";
		this.oRenameCommand4.setNewValue(sTobeTestedText);
		this.oRenameCommand4.execute();
		assert.equal(this.oFormElement2.getLabel().getText(), sTobeTestedText, "then the label text changed accordingly");
		assert.ok(this.oFormElement2.getLabel().getBinding("text").isSuspended(), "then the label binding is suspended");

	});

	QUnit.test("when undoing the rename command for a SimpleForm", function(assert) {
		assert.ok(this.oRenameCommand1.isEnabled(), "then the command is enabled for the SimpleForm control via FormContainer");
		assert.ok(this.oRenameCommand2.isEnabled(), "then the command is enabled for the SimpleForm control via FormElement");

		var sTobeTestedText = "New Title";
		var sOldTitle = this.oTitle0.getText();
		this.oRenameCommand1.setNewValue(sTobeTestedText);
		this.oRenameCommand1.execute();
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldTitle>
		this.oRenameCommand1.undo();
		assert.equal(this.oFormContainer1.getTitle().getText(), sOldTitle, "then the old value is restored");

		var sTobeTestedText = "New Label";
		var sOldLabel = this.oLabel0.getText();
		this.oRenameCommand2.setNewValue(sTobeTestedText);
		this.oRenameCommand2.execute();
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldLabel>
		this.oRenameCommand2.undo();
		assert.equal(this.oFormElement1.getLabel().getText(), sOldLabel, "then the old value is restored");

	});

	QUnit.test("when undoing the rename command for a SimpleForm with bound label and title", function(assert) {
		var sTobeTestedText = "New Title";
		var sOldTitle = this.oTitle1.getText();
		this.oRenameCommand3.setNewValue(sTobeTestedText);
		this.oRenameCommand3.execute();
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldTitle>
		this.oRenameCommand3.undo();
		assert.equal(this.oFormContainer2.getTitle().getText(), sOldTitle, "then the old value is restored");
		assert.equal(this.oFormContainer2.getTitle().getBindingInfo("text").parts[0].path, "/title", "then the title binding is restored");
		assert.equal(this.oFormContainer2.getTitle().getText(), "someTitle", "then the title text is restored");
		assert.ok(!this.oFormContainer2.getTitle().getBinding("text").isSuspended(), "then the title binding is resumed");

		var sTobeTestedText = "New Label";
		var sOldLabel = this.oLabel2.getText();
		this.oRenameCommand2.setNewValue(sTobeTestedText);
		this.oRenameCommand2.execute();
		// Now we expect the actual value to be <sTobeTestedText> and the old value to be <sOldLabel>
		this.oRenameCommand2.undo();
		assert.equal(this.oFormElement2.getLabel().getText(), sOldLabel, "then the old value is restored");
		assert.equal(this.oFormElement2.getLabel().getBindingInfo("text").parts[0].path, "/label", "then the label binding is restored");
		assert.equal(this.oFormElement2.getLabel().getText(), "someLabel", "then the label text is restored");
		assert.ok(!this.oFormElement2.getLabel().getBinding("text").isSuspended(), "then the label binding is resumed");

	});

	QUnit.module("Given a hide/unhide command for a SimpleForm control", {
		beforeEach : function(assert) {
			// Test Setup:
			// SimpleForm
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oModel = new sap.ui.model.json.JSONModel({
				label : "someLabel",
				title : "someTitle"
			});

			this.oTitle0 = new sap.ui.core.Title({id : "Title0",  text : "Title 0"});
			this.oTitle1 = new sap.ui.core.Title({id : "Title1",  text : "{/title}"});
			this.oLabel0 = new sap.m.Label({id : "Label0",  text : "Label 0"});
			this.oLabel1 = new sap.m.Label({id : "Label1",  text : "Label 1"});
			this.oLabel2 = new sap.m.Label({id : "Label2",  text : "{/label}", visible : false});
			this.oLabel3 = new sap.m.Label({id : "Label3",  text : "Label 3"});
			this.oInput0 = new sap.m.Input({id : "Input0"});
			this.oInput1 = new sap.m.Input({id : "Input1"});
			this.oInput2 = new sap.m.Input({id : "Input2", visible : false});
			this.oInput3 = new sap.m.Input({id : "Input3"});
			this.oSimpleForm = new sap.ui.layout.form.SimpleForm(oComponent.createId("form"), {
				id : "SimpleForm", layout : "ResponsiveGridLayout",
				title : "Simple Form",
				content : [this.oTitle0, this.oLabel0, this.oInput0, this.oLabel1, this.oInput1,
				           this.oTitle1, this.oLabel2, this.oInput2, this.oLabel3, this.oInput3]
			});
			this.oSimpleForm.setModel(this.oModel);
			this.oSimpleForm.placeAt("test-view");
			sap.ui.getCore().applyChanges();

			this.oFormContainer1 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[0];
			this.oFormContainer2 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[1];
			this.oFormElement1 = this.oFormContainer1.getAggregation("formElements")[0];
			this.oFormElement2 = this.oFormContainer2.getAggregation("formElements")[0];
			this.oHideCommand1 = CommandFactory.getCommandFor(this.oFormElement1, "Hide");
			this.oHideCommand2 = CommandFactory.getCommandFor(this.oFormContainer1, "Hide");
			this.oUnhideCommand1 = CommandFactory.getCommandFor(this.oFormElement1, "Unhide");
			this.oUnhideCommand2 = CommandFactory.getCommandFor(this.oFormElement2, "Unhide");
		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oSimpleForm.destroy();
			this.oFormContainer1.destroy();
			this.oFormContainer2.destroy();
			this.oFormElement1.destroy();
			this.oFormElement2.destroy();
			this.oHideCommand1.destroy();
			this.oHideCommand2.destroy();
			this.oUnhideCommand1.destroy();
			this.oUnhideCommand2.destroy();
		}
	});

	QUnit.test("when serializing the hide commands", function(assert) {
		assert.deepEqual(this.oHideCommand1.serialize(), {
		  "changeType": "hideSimpleFormField",
		  "sHideId": this.oLabel0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for hiding a FormElement in SimpleForm is there");
		assert.deepEqual(this.oHideCommand2.serialize(), {
		  "changeType": "removeSimpleFormGroup",
		  "sHideId": this.oTitle0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for removing a FormContainer in SimpleForm is there");
	});

	QUnit.test("when serializing the unhide command", function(assert) {
		assert.deepEqual(this.oUnhideCommand1.serialize(), {
		  "changeType": "unhideSimpleFormField",
		  "sUnhideId": this.oLabel0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for unhiding a FormElement in SimpleForm is there");
	});

	QUnit.test("when executing the hide/unhide command for SimpleForm", function(assert) {
		assert.ok(this.oHideCommand1.isEnabled(), "then the hide command is enabled for the SimpleForm control via FormElement");
		assert.ok(this.oHideCommand2.isEnabled(), "then the hide command is enabled for the SimpleForm control via FormContainer");
		assert.ok(this.oUnhideCommand1.isEnabled(), "then the unhide command is enabled for the SimpleForm control via FormElement");

		var bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is initially visible");
		this.oHideCommand1.execute();
		bVisible = this.oLabel0.getVisible();
		assert.notOk(bVisible, "the FormElement is invisible after execution of hide command");

		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, this.oTitle0, "the FormContainer is initially visible");
		this.oHideCommand2.execute();
		oResult = undefined;
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, undefined, "the FormContainer is no more part of SimpleForm content");
		this.oTitle0.destroy();

	});

	QUnit.test("when undoing the hide command for a SimpleForm FormElement", function(assert) {
		var bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is initially visible");
		this.oHideCommand1.execute();
		bVisible = this.oLabel0.getVisible();
		assert.notOk(bVisible, "the FormElement is invisible after execution of hide command");
		this.oHideCommand1.undo();
		bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is visible after undoing the hide command");
	});

	QUnit.test("when undoing the hide command for a SimpleForm FormContainer", function(assert) {
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, this.oTitle0, "the FormContainer is initially in the SimpleForm");
		this.oHideCommand2.execute();
		oResult = undefined;
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, undefined, "the FormContainer is no more part of SimpleForm content");
		this.oHideCommand2.undo();
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, this.oTitle0, "the FormContainer is in the SimpleForm again");
	});

	QUnit.test("when undoing the unhide command for a SimpleForm FormElement", function(assert) {
		assert.ok(this.oUnhideCommand2.isEnabled(), "then the unhide command is enabled for the SimpleForm control via FormElement");
		var bVisible = this.oLabel2.getVisible();
		assert.notOk(bVisible, "the FormElement is initially invisible");
		this.oUnhideCommand2.execute();
		bVisible = this.oLabel2.getVisible();
		assert.ok(bVisible, "the FormElement is visible after execution of unhide command");
		this.oUnhideCommand2.undo();
		bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is visible after undoing the unhide command");
	});

	QUnit.module("Given a hide/unhide command for a SimpleForm control with toolbars", {
		beforeEach : function(assert) {
			// Test Setup:
			// SimpleForm
			// -- Toolbar
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			// -- Toolbar
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oModel = new sap.ui.model.json.JSONModel({
				label : "someLabel",
				title : "someTitle"
			});

			this.oTitle0 = new sap.m.Title({id : "Title0", text : "Toolbar 0"});
			this.oSpacer0 = new sap.m.ToolbarSpacer({id : "Spacer0"});
			this.oTbButton0 = new sap.m.Button({id : "Button0", text : "Button for TB0"});
			this.oToolbar0 = new sap.m.Toolbar({
				id : "Toolbar0",
				text : "TB Title 0",
				content : [this.oTitle0, this.oSpacer0, this.oToolbar0]
			});
			this.oTitle1 = new sap.m.Title({id : "Title1", text : "Toolbar 1"});
			this.oSpacer1 = new sap.m.ToolbarSpacer({id : "Spacer1"});
			this.oTbButton1 = new sap.m.Button({id : "Button1", text : "Button for TB1"});
			this.oToolbar1 = new sap.m.Toolbar({
				id : "Toolbar1",
				text : "TB Title 1",
				content : [this.oTitle1, this.oSpacer1, this.oToolbar1]
			});
			this.oLabel0 = new sap.m.Label({id : "Label0",  text : "Label 0"});
			this.oLabel1 = new sap.m.Label({id : "Label1",  text : "Label 1"});
			this.oLabel2 = new sap.m.Label({id : "Label2",  text : "{/label}", visible : false});
			this.oLabel3 = new sap.m.Label({id : "Label3",  text : "Label 3"});
			this.oInput0 = new sap.m.Input({id : "Input0"});
			this.oInput1 = new sap.m.Input({id : "Input1"});
			this.oInput2 = new sap.m.Input({id : "Input2", visible : false});
			this.oInput3 = new sap.m.Input({id : "Input3"});
			this.oSimpleForm = new sap.ui.layout.form.SimpleForm(oComponent.createId("form"), {
				id : "SimpleForm", layout : "ResponsiveGridLayout",
				title : "Simple Form",
				content : [this.oToolbar0, this.oLabel0, this.oInput0, this.oLabel1, this.oInput1,
				           this.oToolbar1, this.oLabel2, this.oInput2, this.oLabel3, this.oInput3]
			});
			this.oSimpleForm.setModel(this.oModel);
			this.oSimpleForm.placeAt("test-view");
			sap.ui.getCore().applyChanges();

			this.oFormContainer1 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[0];
			this.oFormContainer2 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[1];
			this.oFormElement1 = this.oFormContainer1.getAggregation("formElements")[0];
			this.oFormElement2 = this.oFormContainer2.getAggregation("formElements")[0];
			this.oHideCommand1 = CommandFactory.getCommandFor(this.oFormElement1, "Hide");
			this.oHideCommand2 = CommandFactory.getCommandFor(this.oFormContainer1, "Hide");
			this.oUnhideCommand1 = CommandFactory.getCommandFor(this.oFormElement1, "Unhide");
			this.oUnhideCommand2 = CommandFactory.getCommandFor(this.oFormElement2, "Unhide");
		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oSimpleForm.destroy();
			this.oToolbar0.destroy();
			this.oToolbar1.destroy();
			this.oTitle0.destroy();
			this.oTitle1.destroy();
			this.oSpacer0.destroy();
			this.oSpacer1.destroy();
			this.oTbButton0.destroy();
			this.oTbButton1.destroy();
			this.oFormContainer1.destroy();
			this.oFormContainer2.destroy();
			this.oFormElement1.destroy();
			this.oFormElement2.destroy();
			this.oHideCommand1.destroy();
			this.oHideCommand2.destroy();
			this.oUnhideCommand1.destroy();
			this.oUnhideCommand2.destroy();
		}
	});

	QUnit.test("when serializing the hide commands", function(assert) {
		assert.deepEqual(this.oHideCommand1.serialize(), {
		  "changeType": "hideSimpleFormField",
		  "sHideId": this.oLabel0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for hiding a FormElement in SimpleForm is there");
		assert.deepEqual(this.oHideCommand2.serialize(), {
		  "changeType": "removeSimpleFormGroup",
		  "sHideId": this.oToolbar0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for removing a FormContainer in SimpleForm is there");
	});

	QUnit.test("when serializing the unhide command", function(assert) {
		assert.deepEqual(this.oUnhideCommand1.serialize(), {
		  "changeType": "unhideSimpleFormField",
		  "sUnhideId": this.oLabel0.getId(),
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for unhiding a FormElement in SimpleForm is there");
	});

	QUnit.test("when executing the hide/unhide command for SimpleForm", function(assert) {
		assert.ok(this.oHideCommand1.isEnabled(), "then the hide command is enabled for the SimpleForm control via FormElement");
		assert.ok(this.oHideCommand2.isEnabled(), "then the hide command is enabled for the SimpleForm control via FormContainer");
		assert.ok(this.oUnhideCommand1.isEnabled(), "then the unhide command is enabled for the SimpleForm control via FormElement");

		var bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is initially visible");
		this.oHideCommand1.execute();
		bVisible = this.oLabel0.getVisible();
		assert.notOk(bVisible, "the FormElement is invisible after execution of hide command");

		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oToolbar0);
		assert.equal(oResult, this.oToolbar0, "the FormContainer is initially visible");
		this.oHideCommand2.execute();
		oResult = undefined;
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oTitle0);
		assert.equal(oResult, undefined, "the FormContainer is no more part of SimpleForm content");
	});

	QUnit.test("when undoing the hide command for a SimpleForm FormElement", function(assert) {
		var bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is initially visible");
		this.oHideCommand1.execute();
		bVisible = this.oLabel0.getVisible();
		assert.notOk(bVisible, "the FormElement is invisible after execution of hide command");
		this.oHideCommand1.undo();
		bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is visible after undoing the hide command");
	});

	QUnit.test("when undoing the hide command for a SimpleForm FormContainer", function(assert) {
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oToolbar0);
		assert.equal(oResult, this.oToolbar0, "the FormContainer is initially in the SimpleForm");
		this.oHideCommand2.execute();
		oResult = undefined;
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oToolbar0);
		assert.equal(oResult, undefined, "the FormContainer is no more part of SimpleForm content");
		this.oHideCommand2.undo();
		var oResult = findSimpleFormContentElement(this.oSimpleForm, this.oToolbar0);
		assert.equal(oResult, this.oToolbar0, "the FormContainer is in the SimpleForm again");
	});

	QUnit.test("when undoing the unhide command for a SimpleForm FormElement", function(assert) {
		assert.ok(this.oUnhideCommand2.isEnabled(), "then the unhide command is enabled for the SimpleForm control via FormElement");
		var bVisible = this.oLabel2.getVisible();
		assert.notOk(bVisible, "the FormElement is initially invisible");
		this.oUnhideCommand2.execute();
		bVisible = this.oLabel2.getVisible();
		assert.ok(bVisible, "the FormElement is visible after execution of unhide command");
		this.oUnhideCommand2.undo();
		bVisible = this.oLabel0.getVisible();
		assert.ok(bVisible, "the FormElement is visible after undoing the unhide command");
	});

	QUnit.module("Given an add command for a SimpleForm FormContainer control", {
		beforeEach : function(assert) {
			// Test Setup:
			// SimpleForm
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input
			// -- Title
			// -- Label
			// -- Input
			// -- Label
			// -- Input

			this.oTitle0 = new sap.ui.core.Title({id : "Title0",  text : "Title 0"});
			this.oTitle1 = new sap.ui.core.Title({id : "Title1",  text : "Title 1"});
			this.oLabel0 = new sap.m.Label({id : "Label0",  text : "Label 0"});
			this.oLabel1 = new sap.m.Label({id : "Label1",  text : "Label 1"});
			this.oLabel2 = new sap.m.Label({id : "Label2",  text : "Label 2"});
			this.oLabel3 = new sap.m.Label({id : "Label3",  text : "Label 3"});
			this.oInput0 = new sap.m.Input({id : "Input0"});
			this.oInput1 = new sap.m.Input({id : "Input1"});
			this.oInput2 = new sap.m.Input({id : "Input2"});
			this.oInput3 = new sap.m.Input({id : "Input3"});
			this.oSimpleForm = new sap.ui.layout.form.SimpleForm({
				id : "SimpleForm", layout : "ResponsiveGridLayout",
				title : "Simple Form",
				content : [this.oTitle0, this.oLabel0, this.oInput0, this.oLabel1, this.oInput1,
				           this.oTitle1, this.oLabel2, this.oInput2, this.oLabel3, this.oInput3]
			});
			this.oSimpleForm.placeAt("test-view");
			sap.ui.getCore().applyChanges();

			this.oFormContainer1 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[0];
			this.oFormContainer2 = this.oSimpleForm.getAggregation("form").getAggregation("formContainers")[1];
			this.oFormElement1 = this.oFormContainer1.getAggregation("formElements")[0];
			this.oFormElement2 = this.oFormContainer2.getAggregation("formElements")[0];
			this.oAddCommand = CommandFactory.getCommandFor(this.oSimpleForm, "Add");
		},

		afterEach : function(assert) {
			this.oSimpleForm.destroy();
			this.oFormContainer1.destroy();
			this.oFormContainer2.destroy();
			this.oFormElement1.destroy();
			this.oFormElement2.destroy();
			this.oAddCommand.destroy();
		}
	});

	QUnit.test("when serializing the add command", function(assert) {
		this.oAddCommand.setNewControlId("Title2");
		this.oAddCommand.setIndex(5);
		this.oAddCommand.setLabels(["New Control"]);
		assert.deepEqual(this.oAddCommand.serialize(), {
		  "changeType": "addSimpleFormGroup",
		  "index": 5,
		  "groupLabel": "New Control",
		  "newControlId": "Title2",
		  "selector": {
		    "id": this.oSimpleForm.getId()
		  }
		},  "then specific change format for hiding a FormElement in SimpleForm is there");

	});

	QUnit.test("when executing the add command for SimpleForm", function(assert) {
		assert.ok(this.oAddCommand.isEnabled(), "then the add command is enabled for the SimpleForm FormContainer");

		this.oAddCommand.setNewControlId("Title2");
		this.oAddCommand.setIndex(5);
		this.oAddCommand.setLabels(["New Control"]);

		this.oAddCommand.execute();
		var oResult = findSimpleFormContentElement(this.oSimpleForm, undefined, 5);
		assert.equal(oResult.getText(), "New Control", "the FormContainer is part of SimpleForm");
	});

	QUnit.test("when undoing the add command for SimpleForm", function(assert) {
		this.oAddCommand.setNewControlId("Title2");
		this.oAddCommand.setIndex(5);
		this.oAddCommand.setLabels(["New Control"]);

		this.oAddCommand.execute();
		this.oAddCommand.undo();
		var oResult = findSimpleFormContentElement(this.oSimpleForm, undefined, 5);
		assert.equal(oResult.getText(), "Title 1", "the FormContainer is removed again from SimpleForm");

	});
*/
	QUnit.module("Given a command stack with multiple already executed commands", {
		beforeEach : function(assert) {
			this.stack = new sap.ui.rta.command.Stack();
			this.visibleControl = new sap.m.Button();
			this.hide = new sap.ui.rta.command.Hide({
				element : this.visibleControl
			});
			this.visibleControl2 = new sap.m.Button();
			this.hide2 = new sap.ui.rta.command.Hide({
				element : this.visibleControl2
			});
			this.stack.pushAndExecute(this.hide);
			this.stack.pushAndExecute(this.hide2);
		},
		afterEach : function(assert) {
			this.visibleControl.destroy();
			this.visibleControl2.destroy();
			this.hide.destroy();
			this.hide2.destroy();
			this.stack.destroy();
		}
	});

	QUnit.test("initially", function(assert) {
		var oTopCommand = this.stack.top();
		assert.equal(oTopCommand.getId(), this.hide2.getId(), " the last is the top of stack");
	});

	QUnit.test("when undo,", function(assert) {
		var fnLastCommandUndo = sinon.spy(this.hide2, "undo");
		var fnStackModified = sinon.spy();
		this.stack.attachModified(fnStackModified);

		this.stack.undo();

		assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length)) && (this.stack._toBeExecuted >= -1), 0,
				" the to be executed index is in range");
		assert.equal(fnLastCommandUndo.callCount, 1, " the last command was undone");
		assert.equal(fnStackModified.callCount, 1, " the modify stack listener is called");

		assert.ok(this.stack.canRedo(), "then stack can be redone");
	});

	QUnit.test("when second time undo, then", function(assert) {
		var fnLastCommandUndo = sinon.spy(this.hide2, "undo");
		var fnFirstCommandUndo = sinon.spy(this.hide, "undo");
		var fnStackModified = sinon.spy();
		this.stack.attachModified(fnStackModified);

		this.stack.undo();
		this.stack.undo();

		assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length)) && (this.stack._toBeExecuted >= -1), 0,
				" the to be executed index is in range");
		assert.equal(fnLastCommandUndo.callCount, 1, " the last command was undone");
		assert.equal(fnFirstCommandUndo.callCount, 1, " the first command was undone");
		assert.ok(fnLastCommandUndo.calledBefore(fnFirstCommandUndo), " the last is called before the first");
		assert.equal(fnStackModified.callCount, 2, " the modify stack listener is called");
	});

	QUnit.test("when undo and redo, then", function(assert) {
		var fnUndo = sinon.spy(this.hide2, "undo");
		var fnExecute = sinon.spy(this.hide2, "execute");
		var fnStackModified = sinon.spy();
		this.stack.attachModified(fnStackModified);

		this.stack.undo();

		assert.ok(this.stack.canUndo(), "then a command can be undone");
		assert.ok(this.stack.canRedo(), "then stack can be redone");

		this.stack.redo();

		assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length)) && (this.stack._toBeExecuted >= -1), 0,
				" the to be executed index is in range");
		assert.equal(fnUndo.callCount, 1, " the command was undone");
		assert.equal(fnExecute.callCount, 1, " the command was redone");
		assert.ok(fnUndo.calledBefore(fnExecute), " undo was called before execute");

		assert.ok(this.stack.canUndo(), "then a command can be undone");
		assert.ok(!this.stack.canRedo(), "then stack cannot be redone");
		assert.equal(fnStackModified.callCount, 2, " the modify stack listener is called for undo and redo");
	});

	QUnit
			.test(
					"when having nothing to redo, redo shouldn't do anything, next command to execute will be still the top command, then",
					function(assert) {
						var fnRedo1 = sinon.spy(this.hide, "execute");
						var fnRedo2 = sinon.spy(this.hide2, "execute");
						this.stack.redo();
						assert.ok((this.stack._toBeExecuted < (this.stack.getCommands().length))
								&& (this.stack._toBeExecuted >= -1), 0, " the to be executed index is in range");
						assert.equal(fnRedo1.callCount, 0, " the command hide1 was not called");
						assert.equal(fnRedo2.callCount, 0, " the command hide2 was not called");
					});

	QUnit.test("when serializing, then", function(assert) {
		var aChanges = this.stack.serialize();
		assert.equal(aChanges.length, 2, " the both commmands are serialized");
		assert.deepEqual(aChanges[0], this.hide.serialize(), " the first command has been put first");
		assert.deepEqual(aChanges[1], this.hide2.serialize(), " the second command has been put first");
	});

	QUnit.test("after one undo when serializing, then", function(assert) {
		this.stack.undo();

		var aChanges = this.stack.serialize();

		assert.equal(aChanges.length, 1, " only the executed command is serialized");
		assert.deepEqual(aChanges[0], this.hide.serialize(), " the first command has been put first");
	});

	QUnit.test("when emptying the stack, then", function(assert) {
		var fnModifiedSpy = sinon.spy();

		this.stack.attachModified(fnModifiedSpy);

		this.stack.removeAllCommands();

		assert.ok(this.stack.isEmpty(), " the stack is empty");
		assert.equal(this.stack._toBeExecuted, -1, " the toBeExecuted pointer is reset");
		assert.ok(fnModifiedSpy.called, " the modify event was thrown");
	});

	QUnit.module("Given a empty command stack and commands", {
		beforeEach : function(assert) {
			this.stack = new sap.ui.rta.command.Stack();
			this.visibleControl = new sap.m.Button();
			this.hide = new sap.ui.rta.command.Hide({
				element : this.visibleControl
			});
			this.visibleControl2 = new sap.m.Button();
			this.hide2 = new sap.ui.rta.command.Hide({
				element : this.visibleControl2
			});
			this.compositeCommand = new sap.ui.rta.command.CompositeCommand();
		},
		afterEach : function(assert) {
			this.visibleControl.destroy();
			this.visibleControl2.destroy();
			this.hide.destroy();
			this.hide2.destroy();
			this.compositeCommand.destroy();
			this.stack.destroy();
		}
	});

	QUnit.test("initially", function(assert) {
		assert.equal(this.stack._toBeExecuted, -1, " nothing is to be executed");
	});

	QUnit.test("when serializing, then", function(assert) {
		var aChanges = this.stack.serialize();
		assert.equal(aChanges.length, 0, " an empty array is returned");
	});

	QUnit.test("After pushing one command", function(assert) {
		this.stack.push(this.hide);
		assert.equal(this.stack._toBeExecuted, 0, " the top of stack is to be executed");
	});

	QUnit.test("After pushing one command and executing the top of stack", function(assert) {
		var fnStackModified = sinon.spy();
		this.stack.attachModified(fnStackModified);

		this.stack.push(this.hide);
		assert.equal(fnStackModified.callCount, 1, " the modify stack listener called on push");
		this.stack.execute();
		assert.equal(fnStackModified.callCount, 2, " the modify stack listener is called on execute");
		assert.equal(this.stack._toBeExecuted, -1, " nothing is to be executed");
	});

	QUnit.test("After pushing one command and calling pushAndExecute the top of stack, then", function(assert) {
		this.stack.pushAndExecute(this.hide);
		assert.equal(this.stack._toBeExecuted, -1, " nothing is to be executed");
	});

	QUnit.test("When pushing after undone, then", function(assert) {
		this.stack.pushAndExecute(this.hide);
		this.stack.undo();
		this.stack.push(this.hide2);

		assert.equal(this.stack.getCommands().length, 1, " only second command on the stack");
		assert.equal(this.stack._getCommandToBeExecuted().getId(), this.hide2.getId(), " 2. command to be executed");
		assert.equal(this.stack._toBeExecuted, 0, " one command to be executed");
	});

	QUnit.test("when pushing an executed command, ", function(assert) {
		this.stack.pushExecutedCommand(this.hide);

		assert.ok(!this.stack._getCommandToBeExecuted(), " no command to be executed by the stack");

	});

	QUnit.test("After adding commands to composite command, when executing the composite and undoing it",
			function(assert) {
				var fnHide1Execute = sinon.spy(this.hide, "execute");
				var fnHide2Execute = sinon.spy(this.hide2, "execute");
				var fnHide1Undo = sinon.spy(this.hide, "undo");
				var fnHide2Undo = sinon.spy(this.hide2, "undo");

				this.compositeCommand.addCommand(this.hide);
				this.compositeCommand.addCommand(this.hide2);

				this.compositeCommand.execute();

				assert.ok(fnHide1Execute.calledBefore(fnHide2Execute), "commands are executed in the forward order");
				assert.ok(!this.visibleControl.getVisible(), " command1 has an effect");
				assert.ok(!this.visibleControl2.getVisible(), " command2 has an effect");

				this.compositeCommand.undo();

				assert.ok(fnHide2Undo.calledBefore(fnHide1Undo), "commands are undone in the backward order");
				assert.ok(this.visibleControl.getVisible(), " command1 has an effect");
				assert.ok(this.visibleControl2.getVisible(), " command2 has an effect");
			});

	QUnit.test("When serializing a stack with composite commands, then", function(assert) {
		var oComposite = CommandFactory.getCommandFor(this.visibleControl, "Composite");
		oComposite.addCommand(this.hide);
		oComposite.addCommand(this.hide2);
		this.compositeCommand.addCommand(oComposite);
		this.stack.pushAndExecute(this.compositeCommand);

		var aSerializedCommandContent = this.stack.serialize();
		var aSerializableCommands = this.stack.getSerializableCommands();

		assert.equal(aSerializedCommandContent.length, 2, "only the serialiable commands are serialized");
		assert.equal(aSerializableCommands.length, 2,
				"composite commands are filtered from the list of serializable commands");
		assert.deepEqual(aSerializedCommandContent[0], this.hide.serialize(), " hide1 is serialized");
		assert.deepEqual(aSerializedCommandContent[1], this.hide2.serialize(), " hide2 is serialized");
	});

	QUnit.module("Given a regular move command ", {
		beforeEach : function(assert) {
			// Test Setup:
			// VerticalLayout
			// -- content
			// -- -- ObjectHeader
			// -- -- -- attributes
			// -- -- -- -- ObjectAttribute
			// -- -- Button
			sandbox.stub(sap.ui.fl.Utils, "getCurrentLayer").returns("VENDOR");
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oButton = new sap.m.Button();
			this.oObjectAttribute = new sap.m.ObjectAttribute();
			this.oObjectHeader = new sap.m.ObjectHeader({
				attributes : [this.oObjectAttribute]
			});
			this.oLayout = new sap.ui.layout.VerticalLayout({
				content : [this.oObjectHeader, this.oButton]
			});

			this.oMoveCommand = new sap.ui.rta.command.Move({
				element : this.oObjectHeader,
				source : {
					parent : this.oObjectHeader,
					aggregation : "attributes"
				},
				movedElements : [{
					element : this.oObjectAttribute,
					sourceIndex : 0,
					targetIndex : 2
				}],
				target : {
					parent : this.oLayout,
					aggregation : "content"
				}
			});

			this.mSerializedObjectAttributeMove = {
				changeType : "moveElements",
				source : {
					id : this.oObjectHeader.getId(),
					aggregation : "attributes"
				},
				movedElements : [{
					id : this.oObjectAttribute.getId(),
					sourceIndex : 0,
					targetIndex : 2
				}],
				target : {
					id : this.oLayout.getId(),
					aggregation : "content"
				}
			};
		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oLayout.destroy();
			this.oMoveCommand.destroy();
		}
	});

	QUnit.test("After executing the command", function(assert) {
		this.oMoveCommand.execute();

		assertObjectAttributeMoved.call(this, assert);
	});

	QUnit.test("After executing and undoing the command", function(assert) {
		this.oMoveCommand.execute();

		this.oMoveCommand.undo();
		assertObjectAttributeNotMoved.call(this, assert);
	});

	QUnit.test("After executing, undoing and redoing the command", function(assert) {
		this.oMoveCommand.execute();
		this.oMoveCommand.undo();

		this.oMoveCommand.execute();
		assertObjectAttributeMoved.call(this, assert);
	});

	QUnit.test("After serializing the command", function(assert) {
		var mSeralizedMove = this.oMoveCommand.serialize();

		assert.deepEqual(mSeralizedMove, this.mSerializedObjectAttributeMove, "serialized move looks as expected");
	});

	function assertObjectAttributeMoved(assert) {
		assert.equal(this.oObjectHeader.getAttributes().length, 0, "object attribute is removed from the header");
		assert.equal(this.oLayout.getContent()[0].getId(), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oLayout.getContent()[1].getId(), this.oButton.getId(), "button is still at 2. position");
		assert.equal(this.oLayout.getContent()[2].getId(), this.oObjectAttribute.getId(),
				"object attribute is inserted at the 3. position");
	}

	function assertObjectAttributeNotMoved(assert) {
		assert.equal(this.oObjectHeader.getAttributes().length, 1, "object header has still one attribute");
		assert.equal(this.oObjectHeader.getAttributes()[0].getId(), this.oObjectAttribute.getId(),
				"object attribute is still at the 1. position");
		assert.equal(this.oLayout.getContent().length, 2, "layout content has still 2 controls");
		assert.equal(this.oLayout.getContent()[0].getId(), this.oObjectHeader.getId(),
				"object header is still at 1. position");
		assert.equal(this.oLayout.getContent()[1].getId(), this.oButton.getId(), "button is still at 2. position");
	}

	QUnit.module("Given a smart form with two groups and one element in the first group and move commands ", {
		beforeEach : function(assert) {
			// Test Setup:
			// SmartForm
			// -- groups
			// -- -- SmartGroup1
			// -- -- -- groupElements
			// -- -- -- -- SmartElement
			// -- -- SmartGroup2
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oSmartGroupElement = new sap.ui.comp.smartform.GroupElement("groupElement");
			this.oSmartGroup1 = new sap.ui.comp.smartform.Group("group", {
				groupElements : [this.oSmartGroupElement]
			});
			this.oSmartGroup2 = new sap.ui.comp.smartform.Group("group2");
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm("form", {
				groups : [this.oSmartGroup1, this.oSmartGroup2]
			});

			this.oMoveFieldCommand = CommandFactory.getCommandFor(this.oSmartGroup1, "Move");
			this.oMoveFieldCommand.setSource({
				parent : this.oSmartGroup1,
				aggregation : "groupElements"
			});
			this.oMoveFieldCommand.setTarget({
				parent : this.oSmartGroup2,
				aggregation : "groupElements"
			});
			this.oMoveFieldCommand.setMovedElements([{
				element : this.oSmartGroupElement,
				sourceIndex : 0,
				targetIndex : 0
			}]);

			this.mSerializedFieldMove = {
				changeType : "moveFields",
				selector : {
					id : this.oSmartGroup1.getId()
				},
				targetId : this.oSmartGroup2.getId(),
				moveFields : [{
					id : this.oSmartGroupElement.getId(),
					index : 0
				}]
			};

			this.oMoveGroupCommand = CommandFactory.getCommandFor(this.oSmartForm, "Move");
			this.oMoveGroupCommand.setSource({
				parent : this.oSmartForm,
				aggregation : "groups"
			});
			this.oMoveGroupCommand.setTarget({
				parent : this.oSmartForm,
				aggregation : "groups"
			});
			this.oMoveGroupCommand.setMovedElements([{
				element : this.oSmartGroup2,
				sourceIndex : 1,
				targetIndex : 0
			}]);

			this.mSerializedGroupMove = {
				changeType : "moveGroups",
				selector : {
					id : this.oSmartForm.getId()
				},
				targetId : null,
				moveGroups : [{
					id : this.oSmartGroup2.getId(),
					index : 0
				}]
			};
		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oSmartForm.destroy();
			this.oMoveFieldCommand.destroy();
			this.oMoveGroupCommand.destroy();
		}
	});

	QUnit.test("After executing the move field command", function(assert) {
		this.oMoveFieldCommand.execute();

		assertFieldMoved.call(this, assert);
	});

	QUnit.test("After executing and undoing the move field command", function(assert) {
		this.oMoveFieldCommand.execute();
		this.oMoveFieldCommand.undo();

		assertFieldNotMoved.call(this, assert);
	});

	QUnit.test("After serializing the move field command", function(assert) {
		var mSeralizedMove = this.oMoveFieldCommand.serialize();

		assert.deepEqual(mSeralizedMove, this.mSerializedFieldMove, "serialized move looks as expected");
	});

	function assertFieldMoved(assert) {
		assert.equal(this.oSmartGroup1.getGroupElements().length, 0, "group element is removed from group1");
		assert.equal(this.oSmartGroup2.getGroupElements().length, 1, "group element is added to group2");
		assert.equal(this.oSmartGroup2.getGroupElements()[0].getId(), this.oSmartGroupElement.getId(),
				"group element is at 1. position");
	}

	function assertFieldNotMoved(assert) {
		assert.equal(this.oSmartGroup1.getGroupElements().length, 1, "group element is still in group1");
		assert.equal(this.oSmartGroup1.getGroupElements()[0].getId(), this.oSmartGroupElement.getId(),
				"group element is at 1. position");
		assert.equal(this.oSmartGroup2.getGroupElements().length, 0, "group2 is still empty");
	}

	QUnit.test("After executing the move group command", function(assert) {
		this.oMoveGroupCommand.execute();

		assertGroupMoved.call(this, assert);
	});

	QUnit.test("After executing and undoing the move group command", function(assert) {
		this.oMoveGroupCommand.execute();
		this.oMoveGroupCommand.undo();

		assertGroupNotMoved.call(this, assert);
	});

	QUnit.test("After serializing the move group command", function(assert) {
		var mSeralizedMove = this.oMoveGroupCommand.serialize();

		assert.deepEqual(mSeralizedMove, this.mSerializedGroupMove, "serialized move looks as expected");
	});

	function assertGroupMoved(assert) {
		assert.equal(this.oSmartForm.getGroups().length, 2, "form has still both groups");
		assert.equal(this.oSmartForm.getGroups()[0].getId(), this.oSmartGroup2.getId(), "group2 is at 1. position");
		assert.equal(this.oSmartForm.getGroups()[1].getId(), this.oSmartGroup1.getId(), "group1 is at 2. position");
	}

	function assertGroupNotMoved(assert) {
		assert.equal(this.oSmartForm.getGroups().length, 2, "form has still both groups");
		assert.equal(this.oSmartForm.getGroups()[0].getId(), this.oSmartGroup1.getId(), "group1 is still at 1. position");
		assert.equal(this.oSmartForm.getGroups()[1].getId(), this.oSmartGroup2.getId(), "group2 is still at 2. position");
	}
	QUnit.module("Given a smart form with a group with an element and add field/add group commands ", {
		beforeEach : function(assert) {
			// Test Setup:
			// SmartForm
			// -- groups
			// -- -- SmartGroup
			// -- -- -- groupElements
			// -- -- -- -- SmartElement
			sandbox.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oComponent);

			this.oView = sap.ui.xmlview(oComponent.createId("idMain2"), "sap.ui.rta.test.SmartFormGroup");
			this.oSmartGroupElement = new sap.ui.comp.smartform.GroupElement(this.oView.createId("element"));
			this.oSmartGroup = new sap.ui.comp.smartform.Group(this.oView.createId("group"), {
				groupElements : [this.oSmartGroupElement]
			});
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm(this.oView.createId("form"), {
				groups : [this.oSmartGroup]
			});
			this.oView.addContent(this.oSmartForm);
			// TODO: remove as soon as #1670353434 will be fixed!
			this.oSmartForm._updatePanel();

			this.NEW_CONTROL_ID = "NEW_ID";
			this.NEW_CONTROL_LABEL = "New Label";
			this.NEW_CONTROL_VALUE = "SOME_VALUE";
			this.NEW_CONTROL_VALUE_PROPERTY = "value";

			this.oAddFieldCommand = CommandFactory.getCommandFor(this.oSmartGroup, "Add");
			this.oAddFieldCommand.setIndex(0);
			this.oAddFieldCommand.setNewControlId(this.NEW_CONTROL_ID);
			this.oAddFieldCommand.setLabels([this.NEW_CONTROL_LABEL]);
			this.oAddFieldCommand.setJsTypes(["sap.m.Input"]);
			this.oAddFieldCommand.setFieldValues([this.NEW_CONTROL_VALUE]);
			this.oAddFieldCommand.setValuePropertys([this.NEW_CONTROL_VALUE_PROPERTY]);

			this.mSerializedAddField = {
				changeType : "addFields",
				selector : {
					id : this.oSmartGroup.getId()
				},
				index : 0,
				newControlId : this.NEW_CONTROL_ID,
				fieldLabels : [this.NEW_CONTROL_LABEL],
				jsTypes : ["sap.m.Input"],
				fieldValues : [this.NEW_CONTROL_VALUE],
				valueProperty : [this.NEW_CONTROL_VALUE_PROPERTY]
			};

			this.oAddGroupCommand = CommandFactory.getCommandFor(this.oSmartForm, "Add");
			this.oAddGroupCommand.setIndex(0);
			this.oAddGroupCommand.setNewControlId(this.NEW_CONTROL_ID);
			this.oAddGroupCommand.setLabels([this.NEW_CONTROL_LABEL]);

			this.mSerializedAddGroup = {
				changeType : "addGroup",
				selector : {
					id : this.oSmartForm.getId()
				},
				index : 0,
				newControlId : this.NEW_CONTROL_ID,
				groupLabel : this.NEW_CONTROL_LABEL
			};
		},

		afterEach : function(assert) {
			sandbox.restore();
			this.oView.destroy();
			this.oAddFieldCommand.destroy();
		}
	});

	QUnit.test("After executing the add field command", function(assert) {
		this.oAddFieldCommand.execute();

		assertFieldAdded.call(this, assert);
	});

	QUnit.test("After executing and undoing the add field command", function(assert) {
		this.oAddFieldCommand.execute();
		this.oAddFieldCommand.undo();

		assertAddedFieldRemoved.call(this, assert);
	});

	QUnit.test("After executing, undoing and redoing the add field command", function(assert) {
		this.oAddFieldCommand.execute();
		this.oAddFieldCommand.undo();
		this.oAddFieldCommand.execute();

		assertFieldAdded.call(this, assert);
	});

	QUnit.test("After serializing the add field command", function(assert) {
		var mSeralizedAdd = this.oAddFieldCommand.serialize();

		assert.deepEqual(mSeralizedAdd, this.mSerializedAddField, "serialized add looks as expected");
	});

	function assertFieldAdded(assert) {
		assert.equal(this.oSmartGroup.getGroupElements().length, 2, "group element is added to group");
		assert.equal(this.oSmartGroup.getGroupElements()[0].getId(), this.NEW_CONTROL_ID,
				"new group element is at 1. position");
		assert.equal(this.oSmartGroup.getGroupElements()[1].getId(), this.oSmartGroupElement.getId(),
				"old group element is at 2. position");
	}

	function assertAddedFieldRemoved(assert) {
		assert.equal(this.oSmartGroup.getGroupElements().length, 1, "new group element is removed from group");
		assert.equal(this.oSmartGroup.getGroupElements()[0].getId(), this.oSmartGroupElement.getId(),
				"old group element is at 1. position");
	}

	QUnit.test("After executing the add group command", function(assert) {
		this.oAddGroupCommand.execute();

		assertGroupAdded.call(this, assert);
	});

	QUnit.test("After executing and undoing the add group command", function(assert) {
		this.oAddGroupCommand.execute();
		this.oAddGroupCommand.undo();

		assertAddedGroupRemoved.call(this, assert);
	});

	QUnit.test("After executing, undoing and redoing the add group command", function(assert) {
		this.oAddGroupCommand.execute();
		this.oAddGroupCommand.undo();
		this.oAddGroupCommand.execute();

		assertGroupAdded.call(this, assert);
	});

	QUnit.test("After serializing the add group command", function(assert) {
		var mSeralizedAdd = this.oAddGroupCommand.serialize();

		assert.deepEqual(mSeralizedAdd, this.mSerializedAddGroup, "serialized add looks as expected");
	});

	function assertGroupAdded(assert) {
		assert.equal(this.oSmartForm.getGroups().length, 2, "group is added to group");
		assert.equal(this.oSmartForm.getGroups()[0].getId(), this.NEW_CONTROL_ID, "new group is at 1. position");
		assert.equal(this.oSmartForm.getGroups()[1].getId(), this.oSmartGroup.getId(), "old group is at 2. position");
	}

	function assertAddedGroupRemoved(assert) {
		assert.equal(this.oSmartForm.getGroups().length, 1, "new group is removed");
		assert.equal(this.oSmartForm.getGroups()[0].getId(), this.oSmartGroup.getId(), "old group is at 1. position");
	}
/*
	function findSimpleFormContentElement(oSimpleForm, oElement, iIndex) {
		var aContent = oSimpleForm.getContent();
		var oResult;
		aContent.some(function (oField, index) {
			if (iIndex && iIndex === index) {
				oResult = oField;
				return true;
			} else {
				if (oField === oElement) {
					oResult = oField;
					return true;
				}
			}
		});
		return oResult;
	}
*/
	function waitForBinding(oControl) {
		var oBindingReady = new Promise(function(resolve) {
			oControl.getModel().attachRequestCompleted(function() {
				resolve(oControl);
			});
		});
		return oBindingReady.then(function(oControl) {
			return oControl.getModel().getMetaModel().loaded();
		});
	}
})();
