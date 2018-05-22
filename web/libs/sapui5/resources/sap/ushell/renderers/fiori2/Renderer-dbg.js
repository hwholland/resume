// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

/**
 * @name sap.ushell.renderers.fiori2.Renderer
 * @since 1.9.0
 * @public
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.renderers.fiori2.Renderer");

    /**
     * Default renderer for SAP Fiori launchpad.<br><br>
     * Publishes all lifecycle events as described in the documentation of the "sap.ushell" namepsace.
     */

    jQuery.sap.require("sap.ui.core.UIComponent");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.createRenderer("fiori2")</code>.
     *
     * @class The SAPUI5 component of SAP Fiori Launchpad renderer for the Unified Shell.
     *
     * @extends sap.ui.core.UIComponent
     * @name sap.ushell.renderers.fiori2.Renderer
     * @since 1.15.0
     * @public
     */
    sap.ui.core.UIComponent.extend("sap.ushell.renderers.fiori2.Renderer", {
        metadata : {
            version : "1.38.26",
            dependencies : {
                version : "1.38.26",
                libs : [ "sap.ui.core", "sap.m" ],
                components: []
            }
        }
    });

    /**
     * @returns {object} an instance of Shell view
     *
     * @since 1.15.0
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.createContent = function () {
        var predefineState = jQuery.sap.getUriParameters().get("appState") || jQuery.sap.getUriParameters().get("sap-ushell-config"),
            viewData = this.getComponentData() || {},
            aProperties,
            oAppConfig = {
                applications: {"Shell-home": {}},
                rootIntent: "Shell-home"
            },
            oView;

        if (predefineState) {
            if (!viewData.config) {
                viewData.config = {};
            }
            viewData.config.appState = predefineState;
        }

        //the code below migrates a configuration structure from version 1.28 or older, to the default
        //expected configuration structure in 1.30
        if (viewData.config) {
            //the list of the supported properties that were supported by the renderer in version 1.28
            aProperties = ["enablePersonalization", "enableTagFiltering",
                "enableLockedGroupsCompactLayout", "enableCatalogSelection",
                "enableSearchFiltering", "enableTilesOpacity", "enableDragIndicator",
                "enableActionModeMenuButton", "enableActionModeMenuButton",
                "enableActionModeFloatingButton", "enableTileActionsIcon",
                "enableHideGroups"];

            //We need to pass this flag in order to check lately the possibility of local resolution for empty hash
            if (viewData.config.rootIntent === undefined) {
                viewData.config.migrationConfig = true;
            }
            viewData.config = jQuery.extend(oAppConfig, viewData.config);

            //move relevant properties from the root object to the "Shell-home" application object
            if (viewData.config.applications["Shell-home"]) {
                aProperties.forEach(function (sPropName) {
                    var value = viewData.config[sPropName];
                    if (value !== undefined) {
                        viewData.config.applications["Shell-home"][sPropName] = value;
                    }
                    if (sPropName !== "enablePersonalization") {
                        delete viewData.config[sPropName];
                    }
                });
            }
        }

        if (viewData.config && viewData.config.customViews) {
            Object.keys(viewData.config.customViews).forEach(function (sViewName) {
                var oView = viewData.config.customViews[sViewName];
                sap.ui.view(sViewName, {
                    type: oView.viewType,
                    viewName: oView.viewName,
                    viewData: oView.componentData
                });
            });
        }

        oView = sap.ui.view('mainShell', {
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "sap.ushell.renderers.fiori2.Shell",
            viewData: viewData
        });

        // initialize the RendererExtensions after the view is create. This also publish an external event that indicates
        // that sap.ushell.renderers.fiori2.RendererExtensions can be use.
        sap.ushell.renderers.fiori2.utils.init(oView.getController());
        this.shellCtrl = oView.oController;
        return oView;
    };


    /*-------------------------------------------Shells Extensions----------------------------*/
    /**
     * Creates an extended shell state<br>
     * Creates an extension for the current shell that can be applied by the function applyExtendedShellState.<br>
     *
     * <pre>
     * sap.ushell.Container.getRenderer("fiori2").createCustomShell('test1', function () {
     *    var oTileActionsButton = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{
     *    id: "xxx2",
     *    text: 'aaaaaaaaaaaa',
     *    icon: 'sap-icon://edit',
     *    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
     *    press: function () {
     *       sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
     *      }
     *    }, true, true);
     * });
     * </pre>
     *
     * @param {String[]} sShellName
     *   Name of the extended shell state<br>
     *
     * @param {function} fnCreationInstructions
     *   Contained shell api commands for creating the extension.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the controls are added.<br>
     *  If no launchpad state is provided the controls are added in all states.
     *  @see LaunchpadState.<br>
     *
     * @since 1.35
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.createExtendedShellState = function (sShellName, fnCreationInstructions) {
        // create a shadow shell, shell will extend custom shell state.
        //place it in the custome shell hash.
        return this.shellCtrl.createExtendedShellState(sShellName, fnCreationInstructions);

    };

    /**
     * Set the extended shell to be active<br>
     * This function changes the shell state to display the extended shell merged with the current shell.<br>
     *
     * <b>Example:</b>
     * <pre>
     * sap.ushell.Container.getRenderer("fiori2").createCustomShell('test1', function () {
     *    var oTileActionsButton = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{
     *    id: "xxx2",
     *    text: 'aaaaaaaaaaaa',
     *    icon: 'sap-icon://edit',
     *    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
     *    press: function () {
     *       sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
     *      }
     *    }, true, true);
     * });
     * sap.ushell.Container.getRenderer("fiori2").setCustomShell('test1');
     * </pre>
     *
     * @param {String[]} sShellName
     *   Name of the extended shell state<br>
     *
     * @param {function} fnCustomMerge
     *   aaaa.<br>
     *
     *
     * @since 1.35
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.applyExtendedShellState = function (sShellName, fnCustomMerge) {
        //merge the current shell state state (HOME/APP) with the custome shell.
        this.shellCtrl.applyExtendedShellState(sShellName, fnCustomMerge);
    };
    /*-------------------------------------------show----------------------------*/

    /**
     * Sets the content of the left pane in Fiori launchpad, in the given launchpad states
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is added in all states.
     *
     * <b>Example:</b>
     * <pre>
     *   var button1 = new sap.m.Button(id: "newButton", text: "Test Button");
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showActionButton ([button1.getId()], false, ["home", "app"]);
     *</pre>
     * @param {String[]} aIds
     *   List of ID elements to add to the shell.
     *
     * @param {boolean} bCurrentState
     *   bCurrentState – if true, add the current component only to the current instance of the rendering of the shell.
     *   if false, add the component to the LaunchPadState itself.
     *
     * @param {String[]} aStates
     *    (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     *
     * @since 1.30
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showLeftPaneContent = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addLeftPaneContent([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addLeftPaneContent(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Creates and displays one or more HeaderItem controls according to the given control IDs and Shell states<br>
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).<br><br>
     * The HeaderItem controls will be displayed on the left side of the Fiori Launchpad shell header according to the given display parameters.<br>
     * There can be up to three header items. If the number of existing header items plus the given ones exceeds 3, then the operation fails and no new header items are created.<br>
     *
     * <b>Example:</b>
     * <pre>
     * var button1 = new sap.ushell.ui.shell.ShellHeadItem();
     * var button2 = new sap.ushell.ui.shell.ShellHeadItem();
     * var renderer = sap.ushell.Container.getRenderer("fiori2");
     * renderer.showHeaderItem ([button1.getId(), button2.getId()], false, ["home", "app"]);
     * </pre>
     *
     * @param {String[]} aIds
     *   IDs Array of headerItem controls that should be added to the shell header<br>
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> then the new created controls are added to the current rendered shell state.<br>
     *   When the user navigates to another application (including the Home page) then the controls will be removed.<br>
     *   If <code>false</code> then the controls are added to the LaunchPadState itself.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the controls are added.<br>
     *  If no launchpad state is provided the controls are added in all states.
     *  @see LaunchpadState.<br>
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showHeaderItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addHeaderItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addHeaderItem(aIds, bCurrentState, aStates);
        }

    };

    /**
     * Displays RightFloatingContainerItem on the left side of the Fiori launchpad shell, in the given launchpad states
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is displayed in all states.</br>
     *
     * <b>Example:</b>
     *   <pre>
     *   var button1 = new sap.ushell.ui.shell.RightFloatingContainerItem();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showRightFloatingContainerItem(button1.getId(), false, ["home", "app"]);
     *   </pre>
     *
     * @param {string} sId
     *   ID of the element to add to the Tool Area.
     *
     * @param {boolean} bCurrentState
     *   if true, add the current RightFloatingContainerItems only to the current instance of the rendering of the shell.
     *   if false, add the RightFloatingContainerItems to the LaunchPadState itself.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     *
     * @since 1.37
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showRightFloatingContainerItem = function (sId, bCurrentState, aStates) {
        this.shellCtrl.addRightFloatingContainerItem(sId, bCurrentState, aStates);
    };

    /**
     * Displays RightFloatingContainerItem on the right side of the Fiori launchpad shel.
     *
     * <b>Example:</b>
     *   <pre>
     *   var oRightFloatingContainer = new sap.ushell.ui.shell.RightFloatingContainer();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showRightFloatingContainer(true);
     *   </pre>
     *
     * @param {boolean} bShow
     *   Defines whether to show or hide the
     *
     *
     * @since 1.37
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showRightFloatingContainer = function (bShow) {
        this.shellCtrl.showRightFloatingContainer(bShow);
    };
    /**
     * Displays ToolAreaItem on the left side of the Fiori launchpad shell, in the given launchpad states
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is displayed in all states.</br>
     *
     * <b>Example:</b>
     *   <pre>
     *   var button1 = new sap.ushell.ui.shell.ToolAreaItem();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showToolAreaItem(button1.getId(), false, ["home", "app"]);
     *   </pre>
     *
     * @param {string} sId
     *   ID of the element to add to the Tool Area.
     *
     * @param {boolean} bCurrentState
     *   if true, add the current ToolAreaItems only to the current instance of the rendering of the shell.
     *   if false, add the ToolAreaItems to the LaunchPadState itself.
     *
     * @param {String[]} aStates+
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showToolAreaItem = function (sId, bCurrentState, aStates) {
        this.shellCtrl.addToolAreaItem(sId, bCurrentState, aStates);
    };

    /**
     * Displays Buttons on the user actions menu in the Fiori launchpad shell, in the given launchpad states
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is displayed in all states.</br>
     * The user actions menu is opened via the button on the right hand side of the shell header.</br>
     *
     * <b>Example:</b>
     *   <pre>
     *   var button1 = new sap.m.Button();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showActionButton([button1.getId()], false, ["home", "app"]);
     *   </pre>
     *
     * @param {String[]} aIds
     *   List of ID elements to add to the user actions menu.
     *
     * @param {boolean} bCurrentState
     *   if true, add the current Buttons only to the current instance of the rendering of the shell.
     *   if false, add the Buttons to the LaunchPadState itself.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     * @param {boolean} bIsFirst
     *   if true, the Button will be added to the top of the ActionItems list.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showActionButton = function (aIds, bCurrentState, aStates, bIsFirst) {
        if (typeof aIds === "string") {
            this.shellCtrl.addActionButton([aIds], bCurrentState, aStates, bIsFirst);
        } else {
            this.shellCtrl.addActionButton(aIds, bCurrentState, aStates, bIsFirst);
        }
    };

    /**
     * Displays FloatingActionButton on the bottom right corner of the Fiori launchpad, in the given launchpad states.
     * The FloatingActionButton is rendered in the bottom right corner of the shell.</br>
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is displayed in all states.</br>
     *
     * <b>Example:</b>
     *   <pre>
     *   var button1 = new sap.ushell.ui.shell.ShellFloatingAction();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showFloatingActionButton([button1.getId()], true);
     *   </pre>
     * @param {String[]} aIds
     *   List of ID elements to add to the user actions menu.
     *
     * @param {boolean} bCurrentState
     *   if true, add the current Buttons only to the current instance of the rendering of the shell.
     *   if false, add the Buttons to the LaunchPadState itself.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showFloatingActionButton = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addFloatingActionButton([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addFloatingActionButton(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Displays HeaderItems on the right side of the Fiori launchpad shell header, in the given launchpad states
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).</br>
     * If no launchpad state is provided the content is displayed in all states.</br>
     * The shell header can display the user HeaderItem, and just one more HeaderItem.</br>
     * If this method is called when the right side of the header is full, this method will not do anything.</br>
     *
     * <b>Example:</b>
     *   <pre>
     *   var button1 = new sap.ushell.ui.shell.ShellHeadItem();
     *   var renderer = sap.ushell.Container.getRenderer("fiori2");
     *   renderer.showHeaderEndItem ([button1.getId()], false, ["home", "app"]);
     *   </pre>
     *
     * @param {String[]} aIds
     *   List of ID elements to add to the shell header.
     *
     * @param {boolean} bCurrentState
     *   if true, add the current HeaderItems only to the current instance of the rendering of the shell.
     *   if false, add the HeaderItems to the LaunchPadState itself.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.renderer.LaunchpadState in which to add the aIds.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showHeaderEndItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addHeaderEndItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addHeaderEndItem(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Sets the header visibility accrding to the given value and shell states.<br>
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).<br><br>
     *
     * <b>Example:</b>
     * <pre>
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2");
     * oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
     * </pre>
     *
     * @param {boolean} bVisible
     * The visibility of the header<br>
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> then the visibility is set only to the current rendered shell state.<br>
     *   When the user navigates to another application (including the Home page) then the visibility flag is reset.<br>
     *   If <code>false</code> then set the visibility according to the states provided in the aState parameter.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the header visibility flag should be set.<br>
     *  If no launchpad state is provided the visibility flag is set for all states.
     *  @see LaunchpadState.<br>
     *
     * @since 1.38
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderVisibility = function (bVisible, bCurrentState, aStates) {
        this.shellCtrl.setHeaderVisibility(bVisible, bCurrentState, aStates);
    };

    /**
     * Displays one or more sub header controls according to the given control IDs and shell states.<br>
     * (see sap.ushell.renderers.fiori2.renderer.LaunchpadState).<br><br>
     * A sub header is placed in a container, located directly below the main Fiori launchpad shell header.<br>
     *
     * <b>Example:</b>
     * <pre>
     * var bar = new sap.m.Bar({id: "testBar", contentLeft: [new sap.m.Button({text: "Test SubHeader Button",
     * press: function () {
     * sap.m.MessageToast.show("Pressed");
     * }})
     * ]});
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2");
     * oRenderer.showSubHeader([bar.getId()], false, ["home", "app"]);
     * </pre>
     *
     * @param {String[]} aIds
     * Array of sub header control IDs to be added<br>
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> then the new created controls are added only to the current rendered shell state.<br>
     *   When the user navigates to another application (including the Home page) then the controls will be removed.<br>
     *   If <code>false</code> then add the control to the LaunchPadState itself.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the controls are added.<br>
     *  If no launchpad state is provided the controls are added in all states.
     *  @see LaunchpadState.<br>
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showSubHeader = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addSubHeader([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addSubHeader(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Displays the given sap.m.Bar as the footer of the Fiori launchpad shell.</br>
     * The footer will be displayed in all states. </br>
     *
     * <b>Example:</b>
     * <pre>
     *  var bar = new sap.m.Bar({contentLeft: [new sap.m.Button({text: "Test Footer Button",
     * press: function () {
     * sap.m.MessageToast.show("Pressed");
     * }})
     * ]});
     *  var renderer = sap.ushell.Container.getRenderer("fiori2");
     *  renderer.setFooter(bar);
     * </pre>
     *
     * @param {Object} oFooter - sap.m.Bar
     *   the control to be added as the footer of the Fiori Launchpad
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setFooter = function (oFooter) {
        this.shellCtrl.setFooter(oFooter);
    };

/*--------------------------Hide ----------------------------------*/

    /**
     * Hide the given sap.ushell.ui.shell.ShellHeadItem from Fiori Launchpad, in the given launchpad states.
     * The removed control will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the sap.ushell.ui.shell.ShellHeadItem to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */

    sap.ushell.renderers.fiori2.Renderer.prototype.hideHeaderItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeHeaderItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeHeaderItem(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Remove the given Tool Area Item from Fiori Launchpad, in the given launchpad states.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     *
     * @param {String[]} aIds
     *   the Ids of the sap.ushell.ui.shell.ToolAreaItem control to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.removeToolAreaItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeToolAreaItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeToolAreaItem(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Remove the given Tool Area Item from Fiori Launchpad, in the given launchpad states.
     *
     *
     * @param {String[]} aIds
     *   the Ids of the sap.ushell.ui.shell.RightFloatingContainerItem control to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.removeRightFloatingContainerItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeRightFloatingContainerItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeRightFloatingContainerItem(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Hide the given Action Button from Fiori Launchpad, in the given launchpad states.
     * The removed button will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the Action Button to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.hideActionButton = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeActionButton([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeActionButton(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Hide the given control from Fiori Launchpad, in the given launchpad states.
     * The removed control will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the controls to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.hideLeftPaneContent = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeLeftPaneContent([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeLeftPaneContent(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Hide the given sap.ushell.ui.shell.ShellFloatingAction from Fiori Launchpad, in the given launchpad states.
     * The removed control will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the sap.ushell.ui.shell.ShellFloatingAction to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.hideFloatingActionButton = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeFloatingActionButton([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeFloatingActionButton(aIds, bCurrentState, aStates);
        }
    };

    /**
     * Hide the given sap.ushell.ui.shell.ShellHeadItem from Fiori Launchpad, in the given launchpad states.
     * The removed control will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the sap.ushell.ui.shell.ShellHeadItem to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.hideHeaderEndItem = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeHeaderEndItem([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeHeaderEndItem(aIds, bCurrentState, aStates);
        }
    };
    /**
     * Hide the given control from the Fiori Launchpad sub header, in the given launchpad states.
     * The removed control will not be destroyed.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     * @param {String[]} aIds
     *   the Ids of the controls to remove.
     *
     * @param {boolean} bCurrentState
     *   if true, remove the current control only from the current rendered shell state.
     *
     * @param {String[]} aStates
     *   list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to remove the control.(Only valid if bCurrentState is set to false)
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is removed in all states.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.hideSubHeader = function (aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeSubHeader([aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeSubHeader(aIds, bCurrentState, aStates);
        }
    };

    /**
     * If exists, this method will remove the footer from the Fiori Launchpad.<br><br>
     * This API is meant to be used for implementing custom elements in the SAP Fiori launchpad. We do not recommend using it on a standard launchpad element, as this may interfere with the standard launchpad functionality.
     *
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.removeFooter = function () {
        this.shellCtrl.removeFooter();
    };

    /**
     * This method returns the current state of the Viewport Container control.
     *
     *
     * @since 1.37
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.getCurrentViewportState = function () {
        return this.shellCtrl.getCurrentViewportState();
    };

    /*------------------------------------------------ Adding controls functionality ------------------------------------------*/

    /**
     * Creates and displays a sub header control in Fiori launchpad, in the given launchpad states.<br>
     * The new control is displayed in FLP UI according to the given display parameters.<br>
     * If a sub header already exists, the new created one will replace the existing one.<br><br>
     * <b>Example:</b>
     * <pre>
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2");
     * oRenderer.addSubHeader("sap.m.Bar", {id: "testBar", contentLeft: [new sap.m.Button({text: "Test SubHeader Button",
     *      press: function () {
     *      sap.m.MessageToast.show("Pressed");
     *      }
     *  })
     * ]}, true, true);
     * </pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create.<br>
     *   For example: <code>"sap.m.Bar"</code><br>
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.<br>
     *   For example: <code>{id: "testBar"}</code><br>
     *
     * @param {boolean} bIsVisible
     *   Specifies whether the sub header control is displayed after being created.<br>
     *   If <code>true</code> then the control is displayed according to parameters bCurrentState and aStates,<br>
     *   if <code>false</code> then the control is created but not displayed.<br>
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> then the new created control is added to the current rendered shell state.<br>
     *   When the user navigates to another application (including the Home page) then the control will be removed.<br>
     *   If <code>false</code> then add the control to the LaunchPadState itself.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the control is added.<br>
     *  If no launchpad state is provided the control is added in all states.
     *  @see LaunchpadState.<br>
     *
     * @returns {object} The created control
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addSubHeader = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                var ViewPrototype;
                if (controlType) {
                    jQuery.sap.require(controlType);
                    ViewPrototype = jQuery.sap.getObject(controlType);
                } else {
                    jQuery.sap.log.warning("You must specify control type in order to create it");
                }
                return new ViewPrototype(oControlProperties);
            },
            oItem;

        oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);
        if (bIsVisible) {
            this.showSubHeader(oItem.getId(), bCurrentState, aStates);
        }
        return oItem;
    };

    /**
     * Creates an Action Button in Fiori launchpad, in the given launchpad states. </br>
     * The button will be displayed in the user actions menu, that is opened from the user button in the shell header.</br>
     *  <b>Example:</b>
     *   <pre> sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.m.Button", {id: "testBtn2", text: "test button"}, true, true);</pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create.
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *   Once the user navigates to another app or back to the Home page, this control will be removed.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     * @returns {object} oItem - the created control
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addActionButton = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                var ViewPrototype;
                if (controlType) {
                    jQuery.sap.require(controlType);
                    ViewPrototype = jQuery.sap.getObject(controlType);
                } else {
                    ViewPrototype = jQuery.sap.getObject(sap.ushell.ui.launchpad.ActionItem);
                }
                return new ViewPrototype(oControlProperties);
            },
            oItem;

        oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);
        if (bIsVisible) {
            this.showActionButton(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };

    /**
     * Creates a FloatingActionButton in Fiori launchpad, in the given launchpad states.</br>
     * The FloatingActionButton is rendered in the bottom right corner of the shell.</br>
     *   <b>Example:</b>
     *   <pre> sap.ushell.Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {id: "testBtn"}, true, true);</pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create.
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control.
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *   Once the user navigates to another app or back to the Home page, this control will be removed.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     * @returns {object} oItem - the created control
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addFloatingActionButton = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                var ViewPrototype;
                if (controlType) {
                    jQuery.sap.require(controlType);
                    ViewPrototype = jQuery.sap.getObject(controlType);
                } else {
                    ViewPrototype = jQuery.sap.getObject(sap.m.Button);
                }
                return new ViewPrototype(oControlProperties);
            },
            oItem;

        oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);
        if (bIsVisible) {
            this.showFloatingActionButton(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };

    /**
     * Creates the Left Pane content in Fiori launchpad, in the given launchpad states.</br>
     *   <b>Example:</b>
     *   <pre> sap.ushell.Container.getRenderer("fiori2").addLeftPaneContent("sap.m.Button", {id: "testBtn", text: "Test Button"}, true, true);</pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create.
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control.
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *   Once the user navigates to another app or back to the Home page, this control will be removed.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     *@returns {object} oItem - the created control
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addLeftPaneContent = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                var ViewPrototype;
                if (controlType) {
                    jQuery.sap.require(controlType);
                    ViewPrototype = jQuery.sap.getObject(controlType);
                } else {
                    jQuery.sap.log.warning("You must specify control type in order to create it");
                }

                return new ViewPrototype(oControlProperties);
            },
            oItem;

        oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);
        if (bIsVisible) {
            this.showLeftPaneContent(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };

    /**
     * Creates and displays an item in the header of Fiori launchpad, in the given launchpad states.<br>
     * The new header item will be displayed on the left-hand side of the Fiori Launchpad shell header, according to the given display parameters.<br>
     * The new header item will be added to the right of any existing header items. The header can contain a maximum of three header items.<br><br>
     * <b>Example:</b>
     * <pre>
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2");
     * oRenderer.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {id: "testBtn"}, true, true);
     * </pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create.
     *   For example: <code>"sap.m.Button"</code><br>
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.
     *   For example: <code>{id: "testButton"}</code><br>
     *
     * @param {boolean} bIsVisible
     *   Specifies whether the header item control is displayed after being created.<br>
     *   If <code>true</code> then the control is displayed according to parameters bCurrentState and aStates.<br>
     *   If <code>false</code> then the control is created but not displayed.<br>
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> then the new created control is added to the current rendered shell state.<br>
     *   When the user navigates to a different state including a different application then the control will be removed.<br>
     *   If <code>false</code> then add the control to the LaunchPadState itself.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the control is added.<br>
     *  If no launchpad state is provided the control is added in all states.
     *  @see LaunchpadState.<br>
     *
     * @returns {object} The created control
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addHeaderItem = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var oProperties = oControlProperties;
        //in case Fiori2 is on we need to set the showSeparator flag to false
        if (this.shellCtrl.isFiori2()){
            oProperties.showSeparator = false;
        }
        var fnCreate = function (oControlProperties) {
                return new sap.ushell.ui.shell.ShellHeadItem(oControlProperties);
            },
            oItem = this.createItem(oProperties, bCurrentState, aStates, fnCreate);

        if (bIsVisible) {
            this.showHeaderItem(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };

    /**
     * Creates a RightFloatingContainerItem  in Fiori Launchpad and adds it to the Tool Area, in the given launchpad states.</br>
     * If no items are added to the Tool Area, it will not be displayed.</br>
     * Once an item is added, the Tool Area is rendered on the left side on the Fiori Launchpad shell.</br>
     *
     *   <b>Example:</b>
     *   <pre>sap.ushell.Container.getRenderer("fiori2").addRightFloatingContainerItem({
     *              id: 'testButton',
     *              icon: "sap-icon://documents",
     *              press: function (evt) {
     *                 window.alert('Press' );
     *                },
     *             expand: function (evt) {
     *                 window.alert('Expand' );
     *                }
     *           }, true, false, ["home"]);
     * </pre>
     *
     * @param {object} oControlProperties
     *   The properties object that will be passed to the constructor of sap.ushell.ui.shell.RightFloatingContainerItem control.
     *   @see sap.ushell.ui.shell.RightFloatingContainerItem
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control.
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *
     * @param {String[]} aStates
     *   List of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.Only valid if bCurrentState is set to false.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     *  @returns {object} oItem - the created control
     * @since 1.30
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addRightFloatingContainerItem = function (oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                return new sap.m.NotificationListItem(oControlProperties);
            },
            oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);

        if (bIsVisible) {
            this.showRightFloatingContainerItem(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };


    /**
     * Creates a ToolAreaItem  in Fiori Launchpad and adds it to the Tool Area, in the given launchpad states.</br>
     * If no items are added to the Tool Area, it will not be displayed.</br>
     * Once an item is added, the Tool Area is rendered on the left side on the Fiori Launchpad shell.</br>
     *
     *   <b>Example:</b>
     *   <pre>sap.ushell.Container.getRenderer("fiori2").addToolAreaItem({
     *              id: "testButton",
     *              icon: "sap-icon://documents",
     *              expandable: true,
     *              press: function (evt) {
     *                 window.alert("Press" );
     *                },
     *             expand: function (evt) {
     *                 // This function will be called on the press event of the "expand" button. The result of "expand" event in the UI must be determined by the developer
     *                 window.alert("Expand" );
     *                }
     *           }, true, false, ["home"]);
     * </pre>
     *
     * @param {object} oControlProperties
     *   The properties object that will be passed to the constructor of sap.ushell.ui.shell.ToolAreaItem control.
     *   @see sap.ushell.ui.shell.ToolAreaItem
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control.
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *
     * @param {String[]} aStates
     *   List of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.Only valid if bCurrentState is set to false.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     *  @returns {object} oItem - the created control
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addToolAreaItem = function (oControlProperties, bIsVisible, bCurrentState, aStates) {
        var fnCreate = function (oControlProperties) {
                return new sap.ushell.ui.shell.ToolAreaItem(oControlProperties);
            },
            oItem = this.createItem(oControlProperties, bCurrentState, aStates, fnCreate);

        if (bIsVisible) {
            this.showToolAreaItem(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };

    /**
     * Creates and displays one or more HeaderItem controls in Fiori launchpad, in the given launchpad states.</br>
     * The HeaderItem will be displayed in the right side of the Fiori Launchpad shell header.</br>
     *   <b>Example:</b>
     *   <pre> sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {id: "testBtn"}, true, true);</pre>
     *
     * @param {string} controlType
     *   The (class) name of the control type to create. Currently only "sap.ushell.ui.shell.ShellHeadItem" control type is supported.
     *
     * @param {object} oControlProperties
     *   The properties that will be passed to the created control.
     *
     * @param {boolean} bIsVisible
     *   Specify whether to display the control.
     *
     * @param {boolean} bCurrentState
     *   If true, add the current control only to the current rendered shell state.
     *   Once the user navigates to another app or back to the Home page, this control will be removed.
     *
     * @param {String[]} aStates
     *   (only valid if bCurrentState is set to false) - list of the sap.ushell.renderers.fiori2.Renderer.LaunchpadState in which to add the control.
     *
     *  @see LaunchpadState.
     *
     *  If no launchpad state is provided the content is added in all states.
     *
     * @returns {object} oItem - the created control
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addHeaderEndItem = function (controlType, oControlProperties, bIsVisible, bCurrentState, aStates) {
        var oProperties = oControlProperties;
        //in case Fiori2 is on we need to set the showSeparator flag to false
        if (this.shellCtrl.isFiori2()){
            oProperties.showSeparator = false;
        }
        var fnCreate = function (oControlProperties) {
                return new sap.ushell.ui.shell.ShellHeadItem(oControlProperties);
            },
            oItem = this.createItem(oProperties, bCurrentState, aStates, fnCreate);

        if (bIsVisible) {
            this.showHeaderEndItem(oItem.getId(), bCurrentState, aStates);
        }

        return oItem;
    };
/*-------------------general---------------------------*/
    sap.ushell.renderers.fiori2.Renderer.prototype.getModelConfiguration = function () {
        return this.shellCtrl.getModelConfiguration();
    };

    /**
     * Adds the given sap.ui.core.Control to the EndUserFeedback dialog.</br>
     * The EndUserFeedback dialog is opened via the user actions menu in the Fiori Launchpad shell header.
     *
     * @param {object} oCustomUIContent
     *   The control to be added to the EndUserFeedback dialog.
     *
     * @param {boolean} bShowCustomUIContent
     *   Specify whether to display the control.
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addEndUserFeedbackCustomUI = function (oCustomUIContent, bShowCustomUIContent) {
        this.shellCtrl.addEndUserFeedbackCustomUI(oCustomUIContent, bShowCustomUIContent);
    };

    /**
     * Adds an entry to the User Preferences dialog box including the UI control that appears when the user clicks the new entry,<br>
     *  and handling of User Preferences actions such as SAVE and CANCEL.<br><br>
     *
     * <b>Example:</b>
     * <pre>
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2");
     * var oEntry = {
     *   title: "title",
     *   value: function() {
     *       return jQuery.Deferred().resolve("entryTitleToBeDisplayed");
     *   },
     *   content: function() {
     *       return jQuery.Deferred().resolve(new sap.m.Button("userPrefEntryButton", {text: "Button"}));
     *   },
     *   onSave: function() {
     *       return jQuery.Deferred().resolve();
     *   }
     *   };
     * oRenderer.addUserPreferencesEntry(oEntry);   
     * </pre>
     *
     * @param {object} entryObject
     *  The data of the new added User Preference entry<br>
     *  Including:<br>
     *  <ul>
     *  <li>{String} entryHelpID (Optional) - The ID of the object.<br>
     *  <li>{String} title - The title of the entry to be presented in the list in the User Preferences dialog box.<br>
     *  We recommend using a string from the translation bundle.<br>
     *  <li>{String}/{Function} value - A string to be presented as the value of the entry<br>
     *   OR a function to be called which returns a {jQuery.Deferred.promise} object.<br>
     *  <li>{Function} content - A function to be called that returns a {jQuery.Deferred.promise} object<br>
     *  which consists of a {sap.ui.core.Control} to be displayed in a follow-on dialog box. A SAPUI5 view instance can also be returned.
     *  The functions is called on each time the user opens the User Preferences dialog box.
     *  <li>{Function} onSave - A function to be called which returns a {jQuery.Deferred.promise} object when the user clicks Save in the User Preferences dialog box.<br>
     *   If an error occurs, pass the error message via the {jQuery.Deferred.promise} object. Errors are displayed in the log.<br>
     *  <li>{Function} onCancel - A function to be called that closes the User Preferences dialog box without saving any changes. <br>
     *  </ul>
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.addUserPreferencesEntry = function (entryObject) {
        return this.shellCtrl.addUserPreferencesEntry(entryObject);
    };

    /**
     * Sets the title in the Fiori Launchpad shell header.
     *
     * @param {string} sTitle
     *   The title to be displayed in the Fiori Launchpad shell header
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderTitle = function (sTitle, controlType, oControlProperties) {
        var oInnerControl = null,
            oLaunchpadStates = sap.ushell.renderers.fiori2.Renderer.prototype.LaunchpadState;

        if (controlType) {
            var fnCreate = function (oControlProperties) {
                var oControlClass;
                jQuery.sap.require(controlType);
                oControlClass = jQuery.sap.getObject(controlType);
                return new oControlClass(oControlProperties);
            };

            oInnerControl = this.createItem(oControlProperties, false, [oLaunchpadStates.Home, oLaunchpadStates.App], fnCreate);
        }
        this.shellCtrl._setHeaderTitle(sTitle, oInnerControl);
    };

    /**
     * Sets the visibility of the left pane in the Fiori Launchpad shell, in the given launchpad state
     * @see LaunchpadState.
     *
     * @param {string} sLaunchpadState
     *   LaunchpadState in which to show/hide the left pane
     * @param {boolean} bVisible
     *   specif whether to display the left pane or not
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setLeftPaneVisibility = function (sLaunchpadState, bVisible) {
        this.shellCtrl.showShellItem("/showPane", sLaunchpadState, bVisible);
    };

    /**
     * Sets the ToolArea visibility
     *
     * @param {String} [sLaunchpadState] - LaunchpadState in which to show/hide the ToolArea
     *
     * @see LaunchpadState
     *
     * @param {boolean} [bVisible] - specifies whether to display the ToolArea or not
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showToolArea = function (sLaunchpadState, bVisible) {
        this.shellCtrl.showShellItem("/toolAreaVisible", sLaunchpadState, bVisible);
    };

    sap.ushell.renderers.fiori2.Renderer.prototype.setHeaderHiding = function (bHiding) {
        return this.shellCtrl._setHeaderHiding(bHiding);
    };

    /**
     * Set the content of the floating container in the given launchpad states.<br><br>
     *
     * The floating container displays a single UI control of type <code>sap.ui.core.Control</code>.<br>
     * The initial visibility of the floating container  is <code>false</code> and is set using:
     * @see sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerVisibility<br><br>
     *
     * <b>Example for setting the container's content for the "home" and "app" states:</b>
     * <pre>
     * var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
     *     oButton = new sap.m.Button("Button", {text: "Button"});
     * oRenderer.setFloatingContainerContent(oButton, false, ["home", "app"]);
     * oRenderer.setFloatingContainerVisibility(true);
     * </pre>
     *
     * @param {sap.ui.core.Control} The UI control that is set to be the content of the floating container
     *
     * @param {boolean} bCurrentState
     *   If <code>true</code> (and the container's visibility is set to <code>true</code>) then the given content is displayed by the container in the current shell state.<br>
     *   When the user navigates to a different state (including navitating to a different application) then the content will be removed.<br>
     *   If <code>false</code> then the content is added to the states mentioned in the parameter <code>aStates<code>.<br>
     *
     * @param {String[]} aStates
     *  (Valid only if bCurrentState is <code>false</code>)<br>
     *  A list of shell states (i.e. sap.ushell.renderers.fiori2.Renderer.LaunchpadState) in which the given content is shown in the floating container (if the container's visibility is set to <code>true</code>).<br>
     *  If no launchpad state is provided the content is added in all states.
     *  @see LaunchpadState.<br>
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerContent = function (oControl, bCurrentState, aStates) {
        this.shellCtrl._setFloatingContainerContent("floatingContainerContent", [oControl.getId()], bCurrentState, aStates);
    };

    /**
     * Set the current visibility state of the floating container
     *
     * @param {boolean} The visiblily state of the floating container
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerVisibility = function (bVisible) {
        this.shellCtrl._setFloatingContainerVisibility(bVisible);
    };

    /**
     * Get the current visibility state of the floating container
     *
     * @returns {boolean} Indicates whether the floating container is visible
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.getFloatingContainerVisiblity = function () {
        return this.shellCtrl._getFloatingContainerVisibility();
    };

    /**
     * Get the current visibility state of the floating container
     *
     * @returns {boolean} Indicates whether the floating container is visible
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.getRightFloatingContainerVisibility = function () {
        return this.shellCtrl._getRightFloatingContainerVisibility();
    };

    /**
     * Set the element that will capture the floating container
     *
     * @param {string} Element to capure selector.
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.setFloatingContainerDragSelector = function (sElementToCaptureSelector) {
        this.shellCtrl._setFloatingContainerDragSelector(sElementToCaptureSelector);
    };

    /**
     * Make EndUserFeedback UI use (or not use) the anonymous-user option by default
     *
     * @param {boolean} Indicating whether the anonymous-user option is used by default in EndUserFeedback UI
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.makeEndUserFeedbackAnonymousByDefault = function (bEndUserFeedbackAnonymousByDefault) {
        this.shellCtrl._makeEndUserFeedbackAnonymousByDefault(bEndUserFeedbackAnonymousByDefault);
    };

    /**
     * Whether or not to show the legal agreement text in EndUserFeedback UI
     *
     * @param {boolean} Indicating whether to show the legal agreement text in EndUserFeedback UI
     *
     * @private
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.showEndUserFeedbackLegalAgreement = function (bShowEndUserFeedbackLegalAgreement) {
        this.shellCtrl._showEndUserFeedbackLegalAgreement(bShowEndUserFeedbackLegalAgreement);
    };

/*---------------States------------------------*/
    /**
     * The launchpad states that can be passed as a parameter.</br>
     * <b>Values:<b>
     * App - launchpad state when running a Fiori app</br>
     * Home - launchpad state when the home page is open</br>
     *
     * @since 1.30
     *
     * @public
     */
    sap.ushell.renderers.fiori2.Renderer.prototype.LaunchpadState = {
        App: "app",
        Home: "home"
    };

/*---------------Generic--------------------*/
    sap.ushell.renderers.fiori2.Renderer.prototype.createItem = function (oControlProperties, bCurrentState, aStates, fnCreateItem) {
        //create the object
        var oItem;
        if (oControlProperties.id) {
            oItem = sap.ui.getCore().byId(oControlProperties.id);
        }
        if (!oItem) {
            oItem = fnCreateItem(oControlProperties);
            if (bCurrentState) {
                this.shellCtrl.addElementToManagedQueue(oItem);
            }
        }

        return oItem;
    };

/*------------Custom State Entry------------------------------*/
    sap.ushell.renderers.fiori2.Renderer.prototype.addEntryInShellStates = function (sName, entrySuffix, fnAdd, fnRemove, oStateConfiguration) {
        this.shellCtrl.addEntryInShellStates(sName, entrySuffix, fnAdd, fnRemove, oStateConfiguration);
    };

    sap.ushell.renderers.fiori2.Renderer.prototype.removeCustomItems = function (sStateEntry, aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.removeCustomItems(sStateEntry, [aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.removeCustomItems(sStateEntry, aIds, bCurrentState, aStates);
        }
    };

    sap.ushell.renderers.fiori2.Renderer.prototype.addCustomItems = function (sStateEntry, aIds, bCurrentState, aStates) {
        if (typeof aIds === "string") {
            this.shellCtrl.addCustomItems(sStateEntry, [aIds], bCurrentState, aStates);
        } else {
            this.shellCtrl.addCustomItems(sStateEntry, aIds, bCurrentState, aStates);
        }
    };

    sap.ushell.renderers.fiori2.Renderer.prototype.isFiori2 = function () {
        return this.shellCtrl.isFiori2();
    };

}());
