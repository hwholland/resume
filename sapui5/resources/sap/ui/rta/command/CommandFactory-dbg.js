/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject', 'sap/ui/rta/command/Hide', 'sap/ui/rta/command/Unhide',
    'sap/ui/rta/command/Stash', 'sap/ui/rta/command/Unstash',
		'sap/ui/rta/command/Move', 'sap/ui/rta/command/AddSmart', 'sap/ui/rta/command/Rename', 'sap/ui/rta/command/Group',
		'sap/ui/rta/command/Ungroup', 'sap/ui/rta/command/Property', 'sap/ui/rta/command/BindProperty', 'sap/ui/rta/command/CompositeCommand',
		'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory', 'sap/ui/fl/registry/ChangeRegistry'], function(ManagedObject,
		Hide, Unhide, Stash, Unstash, Move, AddSmart, RenameCommand, Group, Ungroup, PropertyCommand, BindPropertyCommand, CompositeCommand, ControlAnalyzerFactory,
		ChangeRegistry) {
	"use strict";

	var fnConfigureCommand = function(oElement, oCommand) {

		var oAnalyzer = ControlAnalyzerFactory.getControlAnalyzerFor(oElement);

		var sControlType = oElement.getMetadata().getName();
		var sChangeType = oAnalyzer.getFlexChangeType(oCommand.getName(), oElement);

		if (sChangeType) {
			var oResult = ChangeRegistry.getInstance().getRegistryItems({
				controlType : sControlType,
				changeTypeName : sChangeType
			});

			if (oResult && oResult[sControlType] && oResult[sControlType][sChangeType]) {
				var oRegItem = oResult[sControlType][sChangeType];
				var ChangeHandler = oRegItem.getChangeTypeMetadata().getChangeHandler();

				oCommand.setChangeHandler(ChangeHandler);
				oCommand.setChangeType(sChangeType);

			} else {
				jQuery.sap.log.warning("No '" + sChangeType + "' change handler for " + sControlType + " registered");
			}

		} else {
			jQuery.sap.log.warning("No " + oCommand.getName() + " change type registered for " + sControlType);
		}

		return oCommand;
	};

	var mCommands = {
		"Hide" : {
			clazz : Hide
		},
		"Unhide" : {
			clazz : Unhide
		},
		"Stash" : {
			clazz : Stash
		},
		"Unstash" : {
			clazz : Unstash
		},
		"Ungroup" : {
			clazz : Ungroup
		},
		"Group" : {
			clazz : Group
		},
		"Move" : {
			clazz : Move,
			configure : fnConfigureCommand
		},
		"Add" : {
			clazz : AddSmart,
			configure : fnConfigureCommand
		},
		"Composite" : {
			clazz : CompositeCommand
		},
		"Rename" : {
			clazz : RenameCommand,
			configure : fnConfigureCommand
		},
		"Property" : {
			clazz : PropertyCommand
		},
		"BindProperty" : {
			clazz : BindPropertyCommand
		}
	};

	/**
	 * Factory for commands. Shall handle the control specific command configuration.
	 *
	 * @class
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.38.33
	 *
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.command.CommandFactory
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var CommandFactory = ManagedObject.extend("sap.ui.rta.command.CommandFactory", {
		metadata : {
			library : "sap.ui.rta",
			properties : {},
			associations : {},
			events : {}
		}
	});

	/**
	 *
	 */
	CommandFactory.getCommandFor = function(oElement, sCommand, mSettings) {
		var mCommand = mCommands[sCommand];

		var Command = mCommand.clazz;

		mSettings = jQuery.extend(mSettings, {
			element : oElement,
			name : sCommand
		});

		var oCommand = new Command(mSettings);

		if (mCommand.configure) {
			mCommand.configure(oElement, oCommand);
		}
		return oCommand;
	};

	return CommandFactory;

}, /* bExport= */true);
