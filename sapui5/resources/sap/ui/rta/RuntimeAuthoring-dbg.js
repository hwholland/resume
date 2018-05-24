/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides class sap.ui.rta.Main.
sap.ui.define(['sap/ui/base/ManagedObject', 'sap/ui/rta/ui/ToolsMenu', 'sap/ui/comp/smartform/flexibility/FormP13nHandler', 'sap/ui/dt/ElementUtil',
		'sap/ui/dt/DesignTime', 'sap/ui/dt/OverlayRegistry', 'sap/ui/rta/command/Stack',
		'sap/ui/rta/command/CommandFactory', 'sap/ui/rta/command/CompositeCommand', 'sap/ui/rta/plugin/Rename',
		'sap/ui/rta/plugin/DragDrop', 'sap/ui/rta/plugin/RTAElementMover', 'sap/ui/dt/plugin/CutPaste',
		'sap/ui/rta/plugin/Hide', 'sap/ui/rta/plugin/Selection', 'sap/ui/rta/plugin/MultiSelection',
		'sap/ui/dt/plugin/ContextMenu', 'sap/ui/dt/plugin/TabHandling', 'sap/ui/fl/FlexControllerFactory',
		'sap/ui/rta/ui/SettingsDialog', 'sap/ui/rta/ui/AddElementsDialog', './Utils', './ModelConverter',
		'sap/ui/fl/transport/Transports', 'sap/ui/fl/transport/TransportSelection','sap/ui/fl/Utils', 'sap/ui/fl/registry/Settings', 'sap/m/MessageBox', 'sap/m/MessageToast',
		'sap/ui/comp/smartform/GroupElement', 'sap/ui/comp/smartform/Group', 'sap/ui/comp/smartform/SmartForm', 'sap/ui/comp/smarttable/SmartTable',
		'sap/ui/rta/controlAnalyzer/ControlAnalyzerFactory',
		'sap/uxap/ObjectPageLayout', 'sap/uxap/ObjectPageSection'], function(
		ManagedObject, ToolsMenu, FormP13nHandler, ElementUtil, DesignTime, OverlayRegistry, CommandStack,
		CommandFactory, CompositeCommand, RTARenamePlugin, RTADragDropPlugin, RTAElementMover, CutPastePlugin,
		HidePlugin, SelectionPlugin, RTAMultiSelectionPlugin, ContextMenuPlugin, TabHandlingPlugin, FlexControllerFactory,
		SettingsDialog, AddElementsDialog, Utils, ModelConverter, Transports, TransportSelection, FlexUtils, FlexSettings, MessageBox, MessageToast,
		GroupElement, Group, SmartForm, SmartTable, ControlAnalyzerFactory, ObjectPageLayout, ObjectPageSection) {
	"use strict";
	/**
	 * Constructor for a new sap.ui.rta.RuntimeAuthoring class.
	 *
	 * @class The runtime authoring allows to adapt the fields of a running application.
	 * @extends sap.ui.core.ManagedObject
	 * @author SAP SE
	 * @version 1.38.33
	 * @constructor
	 * @public
	 * @since 1.30
	 * @alias sap.ui.rta.RuntimeAuthoring
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API
	 *               might be changed in future.
	 */
	var RuntimeAuthoring = ManagedObject.extend("sap.ui.rta.RuntimeAuthoring", /** @lends sap.ui.rta.RuntimeAuthoring.prototype */
	{
		metadata : {
			// ---- control specific ----
			library : "sap.ui.rta",
			associations : {
				/** The root control which the runtime authoring should handle */
				"rootControl" : {
					type : "sap.ui.core.Control"
				}
			},
			properties : {
				/** The URL which is called when the custom field dialog is opened */
				"customFieldUrl" : "string",

				/** Whether the create custom field button should be shown */
				"showCreateCustomField" : "boolean",

				/** Whether the create custom field button should be shown */
				"showToolbars" : {
					type : "boolean",
					defaultValue : true
				},

				/** Temporary property : whether to show a dialog for changing control's properties#
				 * should be removed after DTA will fully switch to a property panel
				 */
				"showSettingsDialog" : {
					type : "boolean",
					defaultValue : true
				},

				/** Whether the window unload dialog should be shown */
				"showWindowUnloadDialog" : {
					type : "boolean",
					defaultValue : true
				},

				"commandStack" : {
					type : "sap.ui.rta.command.Stack"
				}
			},
			events : {
				/** Fired when the runtime authoring is started */
				"start" : {},

				/** Fired when the runtime authoring is stopped */
				"stop" : {},

				/**
				 * Event fired when a DesignTime selection is changed
				 */
				selectionChange : {
					parameters : {
						selection : { type : "sap.ui.dt.Overlay[]" }
					}
				},

				/**
				 * Fired when the undo/redo stack has changed, undo/redo buttons can be updated
				 */
				"undoRedoStackModified" : {}
			}
		},
		_sAppTitle : null

	});
	/**
	 * @override
	 */
	RuntimeAuthoring.prototype.init = function() {
		this._onCommandStackModified = this._adaptUndoRedoButtons.bind(this);
	};

	/**
	 * Start Runtime Authoring
	 *
	 * @public
	 */
	RuntimeAuthoring.prototype.start = function() {
		var aMOVABLE_TYPES = ["sap.ui.comp.smartform.Group", "sap.ui.comp.smartform.GroupElement", "sap.ui.table.Column",
				"sap.uxap.ObjectPageSection"];

		var that = this;

		this._aPopups = [];

		this._oTextResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
		this._aSupportedControls = ["sap.ui.comp.smartform.Group", "sap.uxap.ObjectPageSection",
				"sap.uxap.ObjectPageLayout"];

		// Create DesignTimec
		if (!this._oDesignTime) {
			this._oRootControl = sap.ui.getCore().byId(this.getRootControl());

			this._oRTAElementMover =  new RTAElementMover({
				movableTypes : aMOVABLE_TYPES
			});

			this._oRTADragDropPlugin = new RTADragDropPlugin({
				draggableTypes : aMOVABLE_TYPES,
				elementMover : this._oRTAElementMover
			});

			this._oRTADragDropPlugin.attachDragStarted(this._handleStopCutPaste, this);

			this._oCutPastePlugin = new CutPastePlugin({
				movableTypes : aMOVABLE_TYPES,
				elementMover : this._oRTAElementMover
			});

			if (ElementUtil.sACTION_MOVE) {
				this._oRTAElementMover.attachElementMoved(this._handleMoveElement, this);
			} else { // TODO this else case when new DesignTime is always there
				this._oRTADragDropPlugin.attachElementMoved(this._handleMoveElement, this);
				this._oCutPastePlugin.attachElementMoved(this._handleMoveElement, this);
			}

			this._oHidePlugin = new HidePlugin();
			this._oHidePlugin.attachHideElement(this._handleHideElement, this);

			this._oRenamePlugin = new RTARenamePlugin({
				commandStack : this.getCommandStack()
			});
			this._oRenamePlugin.attachEditable(this._handleStopCutPaste, this);

			this._oSelectionPlugin = new SelectionPlugin();

			this._oMultiSelectionPlugin = new RTAMultiSelectionPlugin({
				multiSelectionTypes : ["sap.ui.comp.smartform.GroupElement"]
			});

			this._oContextMenuPlugin = new ContextMenuPlugin();
			this._oTabHandlingPlugin = new TabHandlingPlugin();
			this._buildContextMenu();

			jQuery.sap.measure.start("rta.dt.startup","Measurement of RTA: DesignTime start up");
			this._oDesignTime = new DesignTime({
				rootElements : [this._oRootControl],
				plugins : [this._oRTADragDropPlugin, this._oCutPastePlugin, this._oHidePlugin, this._oRenamePlugin,
						this._oSelectionPlugin, this._oMultiSelectionPlugin, this._oContextMenuPlugin,
						this._oTabHandlingPlugin]
			});

			this._oDesignTime.attachSelectionChange(function(oEvent) {
				that.fireSelectionChange({selection: oEvent.getParameter("selection")});
			}, this);

			this._oDesignTime.attachEventOnce("synced", function() {
				that.fireStart();
				jQuery.sap.measure.end("rta.dt.startup","Measurement of RTA: DesignTime start up");
			});
		}

		if (this.getShowToolbars()) {
			// Create ToolsMenu
			this._createToolsMenu();
			// set focus initially on top toolbar
			var oDelegate = {
				"onAfterRendering" : function() {
					this._oToolsMenuTop._oToolBarTop.focus();
					this._oToolsMenuTop._oToolBarTop.removeEventDelegate(oDelegate, this);
				}
			};
			this._oToolsMenuTop._oToolBarTop.addEventDelegate(oDelegate, this);

			// Show Toolbar(s)
			this._oToolsMenuTop.show();
			this._oToolsMenuBottom.show();
		}

		// Register function for checking unsaved before leaving RTA
		this._oldUnloadHandler = window.onbeforeunload;
		window.onbeforeunload = this._onUnload.bind(this);
	};

	/**
	 * @override
	 */
	RuntimeAuthoring.prototype.setCommandStack = function(oCommandStack) {
		var  oOldCommandStack = this.getProperty("commandStack");
		if (oOldCommandStack) {
			oOldCommandStack.detachModified(this._onCommandStackModified);
		}

		if (this._oInternalCommandStack) {
			this._oInternalCommandStack.destroy();
			delete this._oInternalCommandStack;
		}

		var oResult = this.setProperty("commandStack", oCommandStack);

		if (oCommandStack) {
			oCommandStack.attachModified(this._onCommandStackModified);
		}

		// TODO : clarify, if rename plugin is only for ui rename and command should be build outside of it?
		if (this._oRenamePlugin) {
			this._oRenamePlugin.setCommandStack(oCommandStack);
		}

		return oResult;
	};

	/**
	 *
	 * @override
	 */
	RuntimeAuthoring.prototype.getCommandStack = function() {
		var oCommandStack = this.getProperty("commandStack");
		if (!oCommandStack) {
			oCommandStack = new CommandStack();
			this._oInternalCommandStack = oCommandStack;
		}
		this.setCommandStack(oCommandStack);

		return oCommandStack;
	};


	/**
	 * @private
	 */
	RuntimeAuthoring.prototype._adaptUndoRedoButtons = function() {
		var oCommandStack = this.getCommandStack();
		this._oToolsMenuBottom.adaptUndoRedoEnablement(oCommandStack.canUndo(), oCommandStack.canRedo());
		this.fireUndoRedoStackModified();
	};

	/**
	 * Close Toolbars
	 *
	 * @public
	 */
	RuntimeAuthoring.prototype.closeToolBars = function() {
		this._oToolsMenuTop.hide();
		this._oToolsMenuBottom.hide();
	};

	/**
	 * Returns a selection from the DesignTime
	 * @return {sap.ui.dt.Overlay[]} selected overlays
	 * @public
	 */
	RuntimeAuthoring.prototype.getSelection = function() {
		if (this._oDesignTime) {
			return this._oDesignTime.getSelection();
		} else {
			return [];
		}
	};

	/**
	 * Stop Runtime Authoring
	 *
	 * @public
	 */
	RuntimeAuthoring.prototype.stop = function() {
		var that = this;

		return this._serializeToLrep().then(function() {
			that.exit();
			that.fireStop();
		});
	};

	RuntimeAuthoring.prototype.restore = function() {
		this._onRestore();
	};

	RuntimeAuthoring.prototype.transport = function() {
		this._onTransport();
	};

	// ---- backward compatibility API
	RuntimeAuthoring.prototype.undo = function() {
		this._onUndo();
	};

	RuntimeAuthoring.prototype.redo = function() {
		this._onRedo();
	};

	RuntimeAuthoring.prototype.canUndo = function() {
		return this.getCommandStack().canUndo();
	};

	RuntimeAuthoring.prototype.canRedo = function() {
		return this.getCommandStack().canRedo();
	};
	// ---- backward compatibility API

	/**
	 * Check for unsaved changes before Leaving Runtime Authoring
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._onUnload = function() {
		var oCommandStack = this.getCommandStack();
		var bUnsaved = oCommandStack.canUndo() || oCommandStack.canRedo();
		if (bUnsaved && this.getShowWindowUnloadDialog()) {
			var sMessage = this._oTextResources.getText("MSG_UNSAVED_CHANGES");
			return sMessage;
		} else {
			window.onbeforeunload = this._oldUnloadHandler;
		}
	};

	RuntimeAuthoring.prototype._serializeToLrep = function() {
		var oCommandStack = this.getCommandStack();
		// serialize changes to LREP
		var oFlexController = FlexControllerFactory.createForControl(this._oRootControl);
		var aChanges = oCommandStack.serialize();
		var aCommands = oCommandStack.getSerializableCommands();

		aChanges.forEach(function(oChange, i) {
			var oElement = aCommands[i].getElement();
			oFlexController.addChange(oChange, oElement);
		});

		var that = this;
		return oFlexController.saveAll().then(
				function() {
					jQuery.sap.log.info("Runtime adaptation successfully transfered changes to layered repository");
					that.getCommandStack().removeAllCommands();
				},
				function(vError) {
					var sErrorMessage = vError.message || vError.status || vError;
					jQuery.sap.log.error("Failed to transfer runtime adaptation changes to layered repository", sErrorMessage);
					jQuery.sap.require("sap.m.MessageBox");
					var sMsg = that._oTextResources.getText("MSG_LREP_TRANSFER_ERROR") + "\n"
							+ that._oTextResources.getText("MSG_ERROR_REASON", sErrorMessage);
					sap.m.MessageBox.error(sMsg);
				});
	};

	RuntimeAuthoring.prototype._onUndo = function() {
		this._handleStopCutPaste();

		this.getCommandStack().undo();
	};

	RuntimeAuthoring.prototype._onRedo = function() {
		this._handleStopCutPaste();

		this.getCommandStack().redo();
	};

	RuntimeAuthoring.prototype._createToolsMenu = function() {
		if (!this._oToolsMenuTop) {
			this._sAppTitle = this._getApplicationTitle();
			this._oToolsMenuTop = new ToolsMenu({
				toolbarType : "top"
			});
			this._oToolsMenuTop.createToolbar();
			this._oToolsMenuTop.setTitle(this._sAppTitle);
			this._oToolsMenuTop.setRootControl(this._oRootControl);
			this._oToolsMenuTop.adaptButtonsVisibility();
			this._oToolsMenuTop.attachToolbarClose(this.closeToolBars, this);
			this._oToolsMenuTop.attachClose(this.stop, this);
			this._oToolsMenuTop.attachTransport(this._onTransport, this);
			this._oToolsMenuTop.attachRestore(this._onRestore, this);
		}
		if (!this._oToolsMenuBottom) {
			this._oToolsMenuBottom = new ToolsMenu({
				toolbarType : "bottom"
			});
			this._oToolsMenuBottom.createToolbar();
			this._oToolsMenuBottom.setRootControl(this._oRootControl);
			this._oToolsMenuBottom.attachUndo(this._onUndo, this);
			this._oToolsMenuBottom.attachRedo(this._onRedo, this);
		}
	};

	/**
	 * Exit Runtime Authoring - destroy all controls
	 *
	 * @protected
	 */
	RuntimeAuthoring.prototype.exit = function() {
		if (this._oToolsMenuTop) {
			this._oToolsMenuTop.destroy();
			this._oToolsMenuTop = null;
		}
		if (this._oToolsMenuBottom) {
			this._oToolsMenuBottom.destroy();
			this._oToolsMenuBottom = null;
		}
		if (this._oDesignTime) {
			this._oDesignTime.destroy();
			this._oDesignTime = null;
		}

		if (this._handler) {
			if (this._handler._oDialog) {
				this._handler._oDialog.destroy();
			}
			this._handler = null;
		}
		this.setCommandStack(null);
		window.onbeforeunload = this._oldUnloadHandler;
	};

	/**
	 * Function to handle ABAP transport of the changes
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._onTransport = function() {
		var that = this;
		var oFlexController = FlexControllerFactory.createForControl(this._oRootControl);

		function fnHandleCreateAndApplyChangesErrors(oError) {
			FlexUtils.log.error("Changes could not be applied or saved: " + oError);
			return that._showMessage(MessageBox.Icon.ERROR, "HEADER_TRANSPORT_APPLYSAVE_ERROR", "MSG_TRANSPORT_APPLYSAVE_ERROR", oError).then(function() {
				throw new Error('createAndApply failed');
			});
		}

		function fnHandleAllErrors(oError) {
			if (oError.message === 'createAndApply failed') {
				return;
			}
			FlexUtils.log.error("transport error" + oError);
			return that._showMessage(MessageBox.Icon.ERROR, "HEADER_TRANSPORT_ERROR", "MSG_TRANSPORT_ERROR", oError);
		}

		this._handleStopCutPaste();

		var oTransportSelection = new TransportSelection();

		return this._serializeToLrep().then(function() {
			return oFlexController.getComponentChanges().then(function(aAllLocalChanges) {
				if (aAllLocalChanges.length > 0) {
					return that._createAndApplyChanges(aAllLocalChanges, oFlexController);
				}
			})['catch'](fnHandleCreateAndApplyChangesErrors).then(function() {
				return oFlexController.getComponentChanges();
			}).then(function(aAllLocalChanges) {
				return !!aAllLocalChanges.length;
			}).then(function(bShouldTransport) {
				if (bShouldTransport) {
					return oTransportSelection.openTransportSelection(null, that._oRootControl);
				} else {
					that._showMessageToast("MSG_TRANSPORT_SUCCESS");
				}
			}).then(function(oTransportInfo) {
				if (oTransportInfo && oTransportInfo.transport && oTransportInfo.packageName !== "$TMP") {
					return that._transportAllLocalChanges(oTransportInfo, oFlexController);
				}
			})['catch'](fnHandleAllErrors);
		});
	};

	/**
	 * Create and apply changes
	 *
	 * Function is copied from FormP13nHandler. We need all changes for various controls.
	 * The function _createAndApplyChanges in the FormP13Handler calls that._getFlexController()
	 * which is specific for the SmartForm
	 *
	 * @private
	 * @param {array} aChangeSpecificData - array of objects with change specific data
	 * @param {sap.ui.fl.FlexController} - instance of FlexController
	 * @returns {Promise} promise that resolves with no parameters
	 */
	RuntimeAuthoring.prototype._createAndApplyChanges = function(aChangeSpecificData, oFlexController) {

		var that = this;

		return Promise.resolve().then(function() {

			function fnValidChanges(oChangeSpecificData) {
				return oChangeSpecificData && oChangeSpecificData.selector && oChangeSpecificData.selector.id;
			}

			aChangeSpecificData.filter(fnValidChanges).forEach(function(oChangeSpecificData) {
				var oControl = sap.ui.getCore().byId(oChangeSpecificData.selector.id);
				oFlexController.createAndApplyChange(oChangeSpecificData, oControl);
			});
		})['catch'](function(oError) {
			FlexUtils.log.error("Create and apply error: " + oError);
			return oError;
		}).then(function(oError) {
			return oFlexController.saveAll().then(function() {
				if (oError) {
					throw oError;
				}
			});
		})['catch'](function(oError) {
			FlexUtils.log.error("Create and apply and/or save error: " + oError);
			return that._showMessage(MessageBox.Icon.ERROR, "HEADER_TRANSPORT_APPLYSAVE_ERROR", "MSG_TRANSPORT_APPLYSAVE_ERROR", oError);
		});
	};

	/**
	 * Delete all changes for current layer and root control's component
	 *
	 * @private
	 * @return {Promise} the promise from the FlexController
	 */
	RuntimeAuthoring.prototype._deleteChanges = function() {
		var that = this;
		var oTransportSelection = new TransportSelection();
		var oFlexController = FlexControllerFactory.createForControl(this._oRootControl);
		
		oFlexController.getComponentChanges().then(function(aChanges) {
			return FlexSettings.getInstance(FlexUtils.getComponentClassName(that._oRootControl)).then(function(oSettings) {
				if (!oSettings.isProductiveSystem() && !oSettings.hasMergeErrorOccured()) {
					return oTransportSelection.setTransports(aChanges, that._oRootControl);
				}
			}).then(function() {
				return oFlexController.discardChanges(aChanges);
			}).then(function() {
				return window.location.reload();
			});
		})["catch"](function(oError) {
			return that._showMessage(MessageBox.Icon.ERROR, "HEADER_RESTORE_FAILED", "MSG_RESTORE_FAILED", oError);
		});
	};

	/**
	 * @private
	 */
	RuntimeAuthoring.prototype._showMessage = function(oMessageType, sTitleKey, sMessageKey, oError) {
		if (oError) {
			var sMessage = this._oTextResources.getText(sMessageKey, [oError.message || oError]);
		} else {
			var sMessage = this._oTextResources.getText(sMessageKey);
		}
		var sTitle = this._oTextResources.getText(sTitleKey);
		return new Promise(function(resolve) {
			MessageBox.show(sMessage, {
				icon: oMessageType,
				title: sTitle,
				onClose: resolve
			});
		});
	};

	/**
	 * @private
	 */
	RuntimeAuthoring.prototype._showMessageToast = function(sMessageKey) {
		var sMessage = this._oTextResources.getText(sMessageKey);

		MessageToast.show(sMessage);
	};

	/**
	 * Ensure that we have a FormP13Handler which is needed for example for transports and restoring
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._ensureFormP13Handler = function() {

		if (!this._handler) {
			this._handler = new FormP13nHandler();
			this._handler._textResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
		}
	};

	/**
	 * Discard all LREP changes and restores the default app state,
	 * opens a MessageBox where the user can confirm
	 * the restoring to the default app state
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._onRestore = function() {
		var that = this;

		var sMessage = this._oTextResources.getText("FORM_PERS_RESET_MESSAGE");
		var sTitle = this._oTextResources.getText("FORM_PERS_RESET_TITLE");

		this._handleStopCutPaste();

		function fnConfirmDiscardAllChanges(sAction) {
			//save current changes to discard them via flex controller api
			that._serializeToLrep().then(function() {
				if (sAction === "OK") {
					that._deleteChanges();
				}
			});
		}

		MessageBox.confirm(sMessage, {
			icon: MessageBox.Icon.WARNING,
			title : sTitle,
			onClose : fnConfirmDiscardAllChanges
		});
	};

	/**
	 * Prepare all changes and assign them to an existing transport
	 *
	 * @private
	 * @param {object} oTransportInfo - information about the selected transport
	 * @param {sap.ui.fl.FlexController} - instance of FlexController
	 * @returns {Promise} Promise which resolves without parameters
	 */
	RuntimeAuthoring.prototype._transportAllLocalChanges = function(oTransportInfo, oFlexController) {

		var that = this;

		return oFlexController.getComponentChanges().then(function(aAllLocalChanges) {

			// Pass list of changes to be transported with transport request to backend
			var oTransports = new Transports();
			var aTransportData = oTransports._convertToChangeTransportData(aAllLocalChanges);
			var oTransportParams = {};
			oTransportParams.transportId = oTransportInfo.transport;
			oTransportParams.changeIds = aTransportData;

			return oTransports.makeChangesTransportable(oTransportParams).then(function() {

				// remove the $TMP package from all changes; has been done on the server as well,
				// but is not reflected in the client cache until the application is reloaded
				aAllLocalChanges.forEach(function(oChange) {

					if (oChange.getPackage() === '$TMP') {
						var oDefinition = oChange.getDefinition();
						oDefinition.packageName = '';
						oChange.setResponse(oDefinition);
					}
				});
			}).then(function() {
				that._showMessageToast("MSG_TRANSPORT_SUCCESS");
			});
		});
	};

	/**
	 * Checks the two parent-information maps for equality
	 *
	 * @param {object}
	 *          oInfo1 *
	 * @param {object}
	 *          oInfo2
	 * @return {boolean} true if equal, false otherwise
	 * @private
	 */
	RuntimeAuthoring.prototype._isEqualParentInfo = function(oInfo1, oInfo2) {
		var oResult = !!oInfo1 && !!oInfo2;
		if (oResult && (oInfo1.parent && oInfo2.parent)) {
			oResult = oInfo1.parent.getId() === oInfo2.parent.getId();
		}
		if (oResult && (oInfo1.index || oInfo2.index)) {
			oResult = oInfo1.index === oInfo2.index;
		}
		if (oResult && (oInfo1.aggregation || oInfo2.aggregation)) {
			oResult = oInfo1.aggregation === oInfo2.aggregation;
		}
		return oResult;
	};

	/**
	 * Function to handle moving an element
	 *
	 * @param {sap.ui.base.Event}
	 *          oEvent event object
	 * @private
	 */
	RuntimeAuthoring.prototype._handleMoveElement = function(oEvent) {
		var oData = oEvent.getParameter("data");
		if (Array.isArray(oData)) {
			for (var i = 0; i < oData.length; i++) {
				var oAction = oData[i];
				this._handleAction(oAction);
				// TODO: create apropriate commands and a composite command
			}
		} else {
			this._handleAction(oData);
		}
	};

	RuntimeAuthoring.prototype._handleAction = function(oData) {
		if (oData && !this._isEqualParentInfo(oData.source, oData.target)) {
			var oMove = CommandFactory.getCommandFor(oData.source.parent, "Move");
			oMove.setMovedElements([{
				element : oData.element,
				sourceIndex : oData.source.index,
				targetIndex : oData.target.index
			}]);
			oMove.setSource(oData.source);
			oMove.setTarget(oData.target);
			this.getCommandStack().pushAndExecute(oMove);
		}
	};

	/**
	 * Function to handle hiding an element
	 *
	 * @param {object}
	 *          oEventOrOverlays object
	 * @private
	 */
	RuntimeAuthoring.prototype._handleHideElement = function(oEventOrOverlays) {
		var that = this;
		var aSelectedOverlays = (oEventOrOverlays.mParameters)
				? oEventOrOverlays.getParameter("selectedOverlays")
				: oEventOrOverlays;
		var oCompositeCommand = new CompositeCommand();
		var aUnHideableElements = [];

		this._handleStopCutPaste();

		for (var i = 0; i < aSelectedOverlays.length; i++) {
			var oElement = aSelectedOverlays[i].getElementInstance();

			if (fnIsGroupElement(oElement) && Utils.hasGroupElementUnBoundFields(oElement)) {
				return;
			} else if (fnIsGroup(oElement) && Utils.hasGroupUnBoundFields(oElement)) {
				return;
			} else if (fnIsGroup(oElement)) {
				aUnHideableElements = aUnHideableElements.concat(Utils.getGroupMandatoryElements(oElement));
			} else if (!Utils.isElementHideable(oElement)) {
				aUnHideableElements.push(oElement);
			}

			if (fnIsSection(oElement) && oElement.getStashed) {
				var oStashCommand = CommandFactory.getCommandFor(oElement, "Stash");
				oCompositeCommand.addCommand(oStashCommand);
			} else {
				var oHideCommand = CommandFactory.getCommandFor(oElement, "Hide");
				oCompositeCommand.addCommand(oHideCommand);
			}
		}
		if (aUnHideableElements.length > 0) {
			Utils.openHideElementConfirmationDialog(oElement, aUnHideableElements).then(function(bResult) {
				if (bResult) {
					that.getCommandStack().pushAndExecute(oCompositeCommand);
				}
			});
		} else {
			this.getCommandStack().pushAndExecute(oCompositeCommand);
		}
	};

	/**
	 * @private
	 */
	RuntimeAuthoring.prototype._openSettingsDialog = function(oEventOrOverlays) {
		var aSelectedOverlays = (oEventOrOverlays.mParameters) ? oEventOrOverlays.getParameter("selectedOverlays") : oEventOrOverlays;
		var oElement = aSelectedOverlays[0].getElementInstance();
		this._handleStopCutPaste();

		if (!this._oSettingsDialog) {
			this._oSettingsDialog = new SettingsDialog();
		}
		this._oSettingsDialog.setCommandStack(this.getCommandStack());
		this._oSettingsDialog.open(oElement);
	};

	var fnHasParentStableId = function(oElement) {
		var oOverlay = OverlayRegistry.getOverlay(oElement);
		return ControlAnalyzerFactory.getControlAnalyzerFor(oElement).hasParentStableId(oOverlay);
	};
	var fnIsMovable = function(oElement) {
		var oOverlay = OverlayRegistry.getOverlay(oElement);
		return oOverlay.getMovable();
	};
	var fnIsGroupElement = function(oElement) {
		return oElement instanceof GroupElement;
	};

	var fnIsGroup = function(oElement) {
		return oElement instanceof Group;
	};

	var fnIsGroupElementOrGroup = function(oElement) {
		return fnIsGroupElement(oElement) || fnIsGroup(oElement);
	};

	var fnIsSmartForm = function(oElement) {
		return oElement instanceof SmartForm;
	};

	var fnHasSettingsDialog = function(oElement) {
		if (FlexUtils.isVendorLayer() && this.getShowSettingsDialog()) {
			var aControlTypesWithSettings = ["sap.ui.comp.smartfilterbar.SmartFilterBar",
					"sap.ui.comp.smarttable.SmartTable", "sap.ui.comp.smartform.SmartForm", "sap.uxap.ObjectPageLayout",
					"sap.uxap.ObjectPageSection", "sap.uxap.ObjectPageHeaderActionButton", "sap.uxap.ObjectPageHeader",
					"sap.ui.table.Column"];

			return aControlTypesWithSettings.some(function(sControlTypeWithSettings) {
				return ElementUtil.isInstanceOf(oElement, sControlTypeWithSettings);
			});
		}
	};

	var fnIsSection = function(oElement) {
		return oElement instanceof ObjectPageSection;
	};

	var fnIsObjectPage = function(oElement) {
		return oElement instanceof ObjectPageLayout;
	};

	var fnIsGroupOrSmartForm = function(oElement) {
		return fnIsGroup(oElement) || fnIsSmartForm(oElement);
	};

	var fnIsAdaptEnabled = function(oElement) {
		if (!FlexUtils.isVendorLayer()) {
			return fnIsGroupElementOrGroup(oElement) || fnIsSmartForm(oElement);
		}
		return false;
	};

	var fnIsMultSelectionActive = function(oElement) {
		return this._oDesignTime.getSelection().length > 1;
	};

	var fnIsSectionOrObjectPage = function(oElement) {
		return fnIsSection(oElement) || fnIsObjectPage(oElement);
	};

	var not = function(fn) {
		var that = this;
		return function(oElement) {
			return !fn.call(that, oElement);
		};
	};

	var and = function(fn1, fn2){
		var that = this;
		return function(oElement) {
			return fn1.call(that, oElement) && fn2.call(that, oElement);
		};
	};

	RuntimeAuthoring.prototype._buildContextMenu = function() {
		var that = this;

		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_RENAME_LABEL",
			text : that._oTextResources.getText("CTX_RENAME"),
			handler : this._handleRenameLabel.bind(this),
			available : fnIsGroupElement,
			enabled : not.call(this, fnIsMultSelectionActive)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_RENAME_GROUP",
			text : that._oTextResources.getText("CTX_RENAME"),
			handler : this._handleRenameLabel.bind(this),
			available : fnIsGroup,
			enabled : not.call(this, fnIsMultSelectionActive)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_ADD_FIELD",
			text : that._oTextResources.getText("CTX_ADD_FIELD"),
			handler : this._handleAddElement.bind(this),
			available : fnIsGroupElementOrGroup,
			enabled : and.call(this, not.call(this, fnIsMultSelectionActive), fnHasParentStableId)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_ADD_GROUP",
			text : that._oTextResources.getText("CTX_ADD_GROUP"),
			handler : this._handleAddGroup.bind(this),
			available : fnIsGroupOrSmartForm,
			enabled : not.call(this, fnIsMultSelectionActive)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_ADD_SECTION",
			text : that._oTextResources.getText("CTX_ADD_SECTION"),
			handler : this._handleAddElement.bind(this),
			available : fnIsSectionOrObjectPage,
			enabled : Utils.hasObjectPageLayoutInvisibleSections.bind(Utils)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_HIDE_FIELD",
			text : that._oTextResources.getText("CTX_HIDE"),
			handler : this._handleHideElement.bind(this),
			available : fnIsGroupElement,
			enabled : not(Utils.hasGroupElementUnBoundFields.bind(Utils))
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_HIDE_GROUP",
			text : that._oTextResources.getText("CTX_HIDE"),
			handler : this._handleHideElement.bind(this),
			available : fnIsGroup,
			enabled : not(Utils.hasGroupUnBoundFields.bind(Utils))
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_HIDE_SECTION",
			text : that._oTextResources.getText("CTX_HIDE"),
			handler : this._handleHideElement.bind(this),
			available : fnIsSection
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_CUT",
			text : that._oTextResources.getText("CTX_CUT"),
			handler : this._handleCutElement.bind(this),
			available : fnIsMovable
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_PASTE",
			text : that._oTextResources.getText("CTX_PASTE"),
			handler : this._handlePasteElement.bind(this),
			available : fnIsMovable,
			enabled : function(oElement) {
				var oOverlay = OverlayRegistry.getOverlay(oElement.getId());
				return that._oCutPastePlugin.isElementPasteable(oOverlay);
			}
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_GROUP_FIELDS",
			text : that._oTextResources.getText("CTX_GROUP_FIELDS"),
			handler : this._handleGroupElements.bind(this),
			available : function(oElement) {
				var aSelectedOverlays = that._oDesignTime.getSelection();
				return (aSelectedOverlays.length > 1);
			},
			enabled : function(oElement) {
				var bIsEnabled = true;
				var aSelectedElementFields = [];
				var aSelectedOverlays = that._oDesignTime.getSelection();
				aSelectedOverlays.forEach(function(oOverlay) {
					var oElement = oOverlay.getElementInstance();
					aSelectedElementFields = aSelectedElementFields.concat(oElement.getFields());
				});
				if (aSelectedOverlays.length > 3 || aSelectedElementFields.length > 3) {
					return false;
				}
				aSelectedOverlays.some(function(oOverlay) {
					var oElement = oOverlay.getElementInstance();
					if (Utils.hasGroupElementUnBoundFields(oElement)) {
						bIsEnabled = false;
						return true;
					}
				});
				return bIsEnabled;
			}
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_UNGROUP_FIELDS",
			text : that._oTextResources.getText("CTX_UNGROUP_FIELDS"),
			handler : this._handleUngroupElements.bind(this),
			available : function(oElement) {
				var aSelectedOverlays = that._oDesignTime.getSelection();
				return fnIsGroupElement(oElement) && oElement.getFields().length > 1 && aSelectedOverlays.length < 2;
			},
			enabled : not(Utils.hasGroupElementUnBoundFields.bind(Utils))
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_SETTINGS",
			text : "Settings",
			handler : this._openSettingsDialog.bind(this),
			available : fnHasSettingsDialog.bind(this)
		});
		this._oContextMenuPlugin.addMenuItem({
			id : "CTX_ADAPT",
			text : that._oTextResources.getText("CTX_ADAPT"),
			startSection : not(fnIsSmartForm),
			handler : this._handleAdaptElement.bind(this),
			available : fnIsAdaptEnabled
		});
	};

	/**
	 * Function to handle renaming a label
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handleRenameLabel = function(aOverlays) {
		var oOverlay = aOverlays[0];
		this._oRenamePlugin.startEdit(oOverlay);
	};

	/**
	 * Function to handle adding an element
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handleAddElement = function(aOverlays) {
		this._handleStopCutPaste();
		var oSelectedElement = aOverlays[0].getElementInstance();

		if (!this._oAddElementsDialog) {
			this._oAddElementsDialog = new AddElementsDialog({
				rootControl : this._oRootControl
			});
		}
		this._oAddElementsDialog.setCommandStack(this.getCommandStack());
		this._oAddElementsDialog.open(oSelectedElement);
	};

	/**
	 * Function to handle cutting an element
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handleCutElement = function(aOverlays) {
		var oOverlay = aOverlays[0];
		this._oCutPastePlugin.cut(oOverlay);
	};

	/**
	 * Function to handle pasting an element
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handlePasteElement = function(aOverlays) {
		var oOverlay = aOverlays[0];
		this._oCutPastePlugin.paste(oOverlay);
	};

	/**
	 * Handler function to stop cut and paste, because some other operation has started
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._handleStopCutPaste = function() {
		this._oCutPastePlugin.stopCutAndPaste();
	};

	/**
	 * Function to handle grouping of sap.ui.comp.smartfield.SmartFields
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._handleGroupElements = function() {
		this._handleStopCutPaste();

		var aSelectedOverlays = this._oDesignTime.getSelection();
		var oSelectedGroupElement = this._oContextMenuPlugin._oElement;
		var oTargetGroupContainer = Utils.getClosestTypeForControl(oSelectedGroupElement, "sap.ui.comp.smartform.Group");
		var iTargetIndex = oTargetGroupContainer.getGroupElements().indexOf(oSelectedGroupElement);

		var oGroupContainer = Utils.findSupportedBlock(oSelectedGroupElement, this._aSupportedControls);
		var oSmartForm = Utils.getClosestTypeForControl(oSelectedGroupElement, "sap.ui.comp.smartform.SmartForm");
		var aToGroupElements = [];
		for (var i = 0; i < aSelectedOverlays.length; i++) {
			var oElement = aSelectedOverlays[i].getElementInstance();
			aToGroupElements.push(oElement);
		}

		var oGroupCommand = CommandFactory.getCommandFor(oGroupContainer, "Group");
		oGroupCommand.setSource(oSelectedGroupElement);
		oGroupCommand.setIndex(iTargetIndex);
		oGroupCommand.setGroupFields(aToGroupElements);
		oGroupCommand.setSmartForm(oSmartForm);
		this.getCommandStack().pushAndExecute(oGroupCommand);
	};

	/**
	 * Function to handle ungrouping of sap.ui.comp.smartform.GroupElements
	 *
	 * @private
	 */
	RuntimeAuthoring.prototype._handleUngroupElements = function() {
		this._handleStopCutPaste();

		var oSelectedOverlays = this._oDesignTime.getSelection();
		var oSelectedGroupElement = oSelectedOverlays[0].getElementInstance();
		var oSmartForm = Utils.getClosestTypeForControl(oSelectedGroupElement, "sap.ui.comp.smartform.SmartForm");
		var oUngroupCommand = CommandFactory.getCommandFor(oSelectedGroupElement, "Ungroup");

		oUngroupCommand.setSmartForm(oSmartForm);
		this.getCommandStack().pushAndExecute(oUngroupCommand);
	};

	/**
	 * Function to handle adding an group
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handleAddGroup = function(aOverlays) {
		this._handleStopCutPaste();
		var that = this;
		var oTargetElement = aOverlays[0].getElementInstance();

		var oView = Utils.getClosestViewFor(oTargetElement);
		var oSmartForm = Utils.getClosestTypeForControl(oTargetElement, "sap.ui.comp.smartform.SmartForm");

		var oAddGroup = CommandFactory.getCommandFor(oSmartForm, "Add");
		oAddGroup.setNewControlId(oView.createId(jQuery.sap.uid()));
		oAddGroup.setLabels(["New Group"]);

		var iIndex = 0; // already suitable for smartform

		if (oTargetElement.getMetadata().getName() === "sap.ui.comp.smartform.Group") {
			var aGroups = oTargetElement.getParent().getAggregation("formContainers");
			for (var i = 0; i < aGroups.length; i++) {
				if (aGroups[i].getId() === oTargetElement.getId()) {
					iIndex = i + 1;
					break;
				}
			}
		}
		oAddGroup.setIndex(iIndex);

		this.getCommandStack().pushAndExecute(oAddGroup);

		var oOverlay = OverlayRegistry.getOverlay(oAddGroup.getNewControlId());
		oOverlay.setSelected(true);
		var oDelegate = {
			"onAfterRendering" : function() {
				// TODO : remove timeout
				setTimeout(function() {
					that._oRenamePlugin.startEdit(oOverlay);
				}, 0);
				oOverlay.removeEventDelegate(oDelegate);
			}
		};
		oOverlay.addEventDelegate(oDelegate);

	};

	/**
	 * @param {sap.ui.core.Element}
	 *          oElement The element which exists in the smart form
	 * @return {sap.ui.comp.smartform.SmartForm} the closest smart form found
	 * @private
	 */
	RuntimeAuthoring.prototype._getSmartFormForElement = function(oElement) {
		while (oElement && !ElementUtil.isInstanceOf(oElement, "sap.ui.comp.smartform.SmartForm")) {
			oElement = oElement.getParent();
		}

		return oElement;
	};

	/**
	 * Function to handle to open the workaround dialog
	 *
	 * @param {array}
	 *          aOverlays list of selected overlays
	 * @private
	 */
	RuntimeAuthoring.prototype._handleAdaptElement = function(aOverlays, fnOnBeforeDialogOpen) {
		this._handleStopCutPaste();
		var that = this;
		var oElement = aOverlays[0].getElementInstance();
		// flush changes as we have not changed the dialog to work on the command stack
		return this._serializeToLrep().then(function() {
			that._ensureFormP13Handler();

			var oSmartForm = that._getSmartFormForElement(oElement);
			that._handler.init(oSmartForm);

			if (fnOnBeforeDialogOpen) {
				fnOnBeforeDialogOpen(that._handler);
			}

			that._handler.show();
		});
	};

	/**
	 * Get the Title of the Application from the manifest.json
	 *
	 * @private
	 * @returns {String} the application title or empty string
	 */
	RuntimeAuthoring.prototype._getApplicationTitle = function() {

		var sTitle = "";
		var oComponent = sap.ui.core.Component.getOwnerComponentFor(this._oRootControl);
		if (oComponent) {
			sTitle = oComponent.getMetadata().getManifestEntry("sap.app").title;
		}
		return sTitle;
	};

	return RuntimeAuthoring;

}, /* bExport= */true);
