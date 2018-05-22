/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.footerbar.HideGroupsButton.
jQuery.sap.declare("sap.ushell.ui.footerbar.HideGroupsButton");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ushell.ui.launchpad.ActionItem");


/**
 * Constructor for a new ui/footerbar/HideGroupsButton.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.footerbar.HideGroupsButton#event:save save} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.ushell.ui.launchpad.ActionItem#constructor sap.ushell.ui.launchpad.ActionItem}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A button to hide groups from the dashboard, for the UShell footerbar.
 * @extends sap.ushell.ui.launchpad.ActionItem
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.footerbar.HideGroupsButton
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ushell.ui.launchpad.ActionItem.extend("sap.ushell.ui.footerbar.HideGroupsButton", { metadata : {

	library : "sap.ushell",
	events : {

		/**
		 */
		"save" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.footerbar.HideGroupsButton with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ushell.ui.footerbar.HideGroupsButton.extend
 * @function
 */

sap.ushell.ui.footerbar.HideGroupsButton.M_EVENTS = {'save':'save'};


/**
 *
 * @name sap.ushell.ui.footerbar.HideGroupsButton#save
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'save' event of this <code>sap.ushell.ui.footerbar.HideGroupsButton</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.footerbar.HideGroupsButton</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.footerbar.HideGroupsButton</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.footerbar.HideGroupsButton} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.footerbar.HideGroupsButton#attachSave
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'save' event of this <code>sap.ushell.ui.footerbar.HideGroupsButton</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.footerbar.HideGroupsButton} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.footerbar.HideGroupsButton#detachSave
 * @function
 */

/**
 * Fire event save to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.footerbar.HideGroupsButton} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.footerbar.HideGroupsButton#fireSave
 * @function
 */

// Start of sap/ushell/ui/footerbar/HideGroupsButton.js
(function () {
    "use strict";
    /*global jQuery, sap*/

    jQuery.sap.declare("sap.ushell.ui.footerbar.HideGroupsButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.ui.launchpad.AccessibilityCustomData");

    /**
     * @name sap.ushell.ui.footerbar.HideGroupsButton
     */
    sap.ushell.ui.footerbar.HideGroupsButton.prototype.init = function () {
        //call the parent sap.ushell.ui.launchpad.ActionItem init method
        if (sap.ushell.ui.launchpad.ActionItem.prototype.init) {
            sap.ushell.ui.launchpad.ActionItem.prototype.init.apply(this, arguments);
        }
        this.setIcon('sap-icon://group-2');
        this.setTooltip(sap.ushell.resources.i18n.getText("hideGroupsBtn_tooltip"));
        this.setText(sap.ushell.resources.i18n.getText("hideGroupsBtn_title"));
        this.attachPress(this.openHideGroupsDialog);
    };

    sap.ushell.ui.footerbar.HideGroupsButton.prototype.openHideGroupsDialog = function () {
        jQuery.sap.require("sap.m.Dialog");
        jQuery.sap.require("sap.m.Button");
        jQuery.sap.require("sap.m.Table");
        jQuery.sap.require("sap.m.Switch");

        var that = this;
        this.oModel = this.getModel();

        this.handleChange = function (event) {
            var parent = event.oSource.getParent(),
                groupPath = parent.getBindingContextPath(),
                group = this.oModel.getProperty(groupPath);

            // update new state in the local model
            var changedGroup = jQuery.grep(this.aGroupsStates, function (oGroup) {
                return oGroup.groupId === group.groupId;
            })[0];
            if (changedGroup) {
                changedGroup.isGroupVisible = !changedGroup.isGroupVisible;
            }

            parent.toggleStyleClass('sapUshellHideGroupsTableItem');
            parent.getCells()[0].toggleStyleClass('sapUshellHideGroupsDisabledCell');
        }.bind(this);

        //Default group and locked groups cannot be switched to hidden. 
        var switchVisibleFormatter = function (enabled, locked) {
            return enabled && !locked;
        };

        this.groupsTableTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({text: "{title}"}),
                new sap.m.Switch({
                    visible: {parts: [{path : "isEnabled"}, {path : "isGroupLocked"}], formatter : switchVisibleFormatter},
                    change: that.handleChange,
                    customTextOff: " ",
                    customTextOn: " ",
                    tooltip: sap.ushell.resources.i18n.getText("hideGroups_switchTooltip")
                })
            ]
        });

        this.groupsTable = new sap.m.Table("sapUshellHideGroupsTable", {
            backgroundDesign: sap.m.BackgroundDesign.Transparent,
            showSeparators: sap.m.ListSeparators.Inner,
            columns: [
                new sap.m.Column({
                    vAlign: "Middle"
                }),
                new sap.m.Column({
                    hAlign: sap.ui.core.TextAlign.Right,
                    vAlign: "Middle",
                    width: "4.94rem"
                })
            ]
        });
        this.groupsTable.addStyleClass('sapUshellHideGroupsTable');

        var oOrigOnAfterRendering = this.groupsTable.onAfterRendering;
        this.groupsTable.onAfterRendering = function (event) {
            oOrigOnAfterRendering.apply(that.groupsTable, arguments);

            var items = event.srcControl.mAggregations.items;
            if (items) {
                var model = items[0].getModel(),
                    i,
                    group;
                for (i = 0; i < items.length; i++) {
                    group = model.getProperty(items[i].getBindingContextPath()); //get the related binded group from the model
                    items[i].getCells()[1].setState(group.isGroupVisible);
                    if (group && group.isGroupLocked && (group.tiles.length === 0 || !sap.ushell.utils.groupHasVisibleTiles(group.tiles))) { //Locked groups which has no tiles are filted out from the dashboard, grouplist panel and hide groups popup (or has tiles not supported in current device)
                        items[i].setVisible(false);
                    } else if (!items[i].getCells()[1].getState()) { //if it is disabled, need to mark the row with different background color
                        items[i].addStyleClass('sapUshellHideGroupsTableItem');
                        items[i].getCells()[0].addStyleClass('sapUshellHideGroupsDisabledCell');
                    }
                }
            }
            setTimeout(function () {
                jQuery('.sapMListTblRow').first().focus();
            }, 200);
        };

        this.groupsTable.setModel(this.getModel());

        var personalizationEnabled = this.getModel().getProperty("/personalization");
        var emptyGroupFilter = [];
        //When personalization is disabled, empty groups should not appear in the Hide Groups dialog
        //(as they are also not appearing in the dashboard and group list)
        if (!personalizationEnabled) {
            emptyGroupFilter.push(new sap.ui.model.Filter("tiles/length", sap.ui.model.FilterOperator.GT, 0));
        }

        this.groupsTable.bindItems({
            path: "/groups",
            template: this.groupsTableTemplate,
            filters: emptyGroupFilter
        });

        this.saveButton = new sap.m.Button("saveBtn", {
            text: sap.ushell.resources.i18n.getText("okBtn"),
            press: function () {

                setTimeout(function () {
                    var oModel = this.getModel();
                    var groups = that.aGroupsStates;

                    if (groups) {
                        var oLaunchPageSrv = sap.ushell.Container.getService("LaunchPage");
                        var aHiddenGroupsIDs = [],
                            i,
                            id;

                        for (i = 0; i < groups.length; i++) {
                            if (!groups[i].isGroupVisible) {
                                id = oLaunchPageSrv.getGroupId(groups[i].object);
                                aHiddenGroupsIDs.push(id);
                            }
                        }
                        oLaunchPageSrv.hideGroups(aHiddenGroupsIDs).done(function () {
                            oModel.setProperty("/groups", groups);
                            that.handleToastMessage(aHiddenGroupsIDs.length);
                            that.fireSave();
                        }).fail(function () {
                            var errorMsg = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("HideGroupsErrorMessage", {
                                title: sap.ushell.resources.i18n.getText("error"),
                                content: new sap.m.Text({
                                    text: sap.ushell.resources.i18n.getText("hideGroups_error")
                                })
                            });
                            errorMsg.open();
                        });
                    }
                }.bind(this), 100);//There is a flickering when the dialog is closed in the first time. adding minimal timeout to prevent it.

                this.oDialog.close();
            }.bind(this)
        });

        this.handleToastMessage = function (numOfHiddenGroups) {
            var sMsg = "";
            if (typeof numOfHiddenGroups === undefined) {
                return;
            }

            if (numOfHiddenGroups === 0) {  //All groups are visible on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_none");
            } else if (numOfHiddenGroups === 1) {//1 group is hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_single");
            } else {//{0} groups are hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_multiple", numOfHiddenGroups);
            }
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, sMsg);
        };

        this.cancelButton = new sap.m.Button("CancelBtn", {
            text: sap.ushell.resources.i18n.getText("cancelBtn"),
            press: function () {
                //Need to revert any model changes if took place by the user prior to pressing the cancel button
                if (that.aGroupsOriginalStates) {
                    var groups = this.getModel().getProperty('/groups'),
                        i;
                    for (i = 0; i < that.aGroupsOriginalStates.length; i++) {
                        if (groups[i].groupId === that.aGroupsOriginalStates[i].groupId) { //just to be sure that the groups order was not changed...if it was - skip this group (most chances are that there has been no change)
                            groups[i].isGroupVisible = that.aGroupsOriginalStates[i].isVisible;
                        }
                    }
                }
                this.oDialog.close();
            }.bind(this)
        });

        this.oDialog = new sap.m.Dialog({
            id: "groupsVisibilityDialog",
            title: sap.ushell.resources.i18n.getText("hideGroups_title"),
            contentWidth : "29.6rem",
            contentHeight : "36.07rem",
            stretch: sap.ui.Device.system.phone,
            content : this.groupsTable,
            beginButton: this.saveButton,
            endButton: this.cancelButton,
            initialFocus: "groupsVisibilityDialog",
            afterClose: function () {
                this.oDialog.destroy();
            }.bind(this)
        }).addStyleClass("sapUshellGroupsVisibilityDialog");
        this.oDialog.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
            key: "aria-label",
            value: sap.ushell.resources.i18n.getText("hideGroupsDialog_ariaLabel"),
            writeToDom: true
        }));
        this.getModelStates = function (groups) {
            if (!groups) {
                return;
            }
            var aStates = [],
                i;
            for (i = 0; i < groups.length; i++) {
                aStates.push({
                    groupId: groups[i].groupId,
                    isVisible: groups[i].isGroupVisible
                });
            }
            return aStates;
        };

        this.aGroupsStates = this.oModel.getProperty('/groups');
        this.aGroupsOriginalStates = this.getModelStates(this.aGroupsStates);
        this.oDialog.open();
    };
}());