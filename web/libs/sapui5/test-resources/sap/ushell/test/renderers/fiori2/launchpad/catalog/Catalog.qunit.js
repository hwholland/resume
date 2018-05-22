(function () {
    "use strict";

    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog", {
        setup: function () {
            sap.ushell.bootstrap("local");

            oController = new sap.ui.controller("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    var oController;

    test("createContent Test", function () {
        var tileTitle = "tile_title",
            firstAddedGroupTitle = "first_added_group",
            firstRemovedGroupTitle = "first_removed_group",
            numberOfAddedGroups = [1, 0, 1, 2, 2, 0, 1, 2],
            numberOfRemovedGroups = [0, 1, 1, 0, 1, 2, 2, 2],
            getTextFromBundle = sap.ushell.resources.i18n,
            successMessages = [
                getTextFromBundle.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]),
                getTextFromBundle.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups[3]]),
                getTextFromBundle.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups[4], firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups[5]]),
                getTextFromBundle.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups[6]]),
                getTextFromBundle.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups[7], numberOfRemovedGroups[7]])
            ]

        for (var index = 0; index < numberOfAddedGroups.length; index++) {
            var message = oController.prepareDetailedMessage(tileTitle, numberOfAddedGroups[index], numberOfRemovedGroups[index], firstAddedGroupTitle, firstRemovedGroupTitle)
            ok(successMessages[index] == message, 'Expected message: ' + successMessages[index] + ' Message returned: ' + message);
        }
    });

    test("errorHandlingContent Test", function () {
        var tileTitle = "tile_title",
            numberOfAddToGroupsFails =      [0, 0, 1, 0, 2, 0, 1],
            numberOfRemoveFromGroupsFails = [0, 1, 0, 1, 0, 2, 1],
            createNewGroupFail =            [1, 1, 0, 0, 0, 0, 0],
            oGroup = {title: "test group"},
            oErroneousActions = [],
            getTextFromBundle = sap.ushell.resources.i18n,
            failMessages = [
                getTextFromBundle.getText("fail_tile_operation_create_new_group"),
                getTextFromBundle.getText("fail_tile_operation_some_actions"),
                getTextFromBundle.getText("fail_tile_operation_add_to_group", [tileTitle, oGroup.title]),
                getTextFromBundle.getText("fail_tile_operation_remove_from_group", [tileTitle, oGroup.title]),
                getTextFromBundle.getText("fail_tile_operation_add_to_several_groups", [tileTitle]),
                getTextFromBundle.getText("fail_tile_operation_remove_from_several_groups", [tileTitle]),
                getTextFromBundle.getText("fail_tile_operation_some_actions")
            ]

        for (var index = 0; index < numberOfAddToGroupsFails.length; index++) {
            oErroneousActions = [];
            if (numberOfAddToGroupsFails[index] > 0){
                for (var actionIndex = 0; actionIndex < numberOfAddToGroupsFails[index]; actionIndex++) {
                    oErroneousActions.push({group: oGroup, status: 0, action: actionIndex == 0 ? 'addTileToNewGroup' : 'add'});
                }
            }
            if (numberOfRemoveFromGroupsFails[index] > 0){
                for (var actionIndex = 0; actionIndex < numberOfRemoveFromGroupsFails[index]; actionIndex++) {
                    oErroneousActions.push({group: oGroup, status: 0, action: 'remove'});
                }
            }
            if (createNewGroupFail[index] > 0){
                oErroneousActions.push({group: oGroup, status: 0, action: 'createNewGroup'});
            }

            var message = oController.prepareErrorMessage(oErroneousActions, tileTitle);
            ok(failMessages[index] == getLocalizedText(message.messageId, message.parameters), 'Expected message: ' + failMessages[index] + ' Message returned: ' + message);
        }
    });

    var getLocalizedText = function (sMsgId, aParams) {
        return aParams ? sap.ushell.resources.i18n.getText(sMsgId, aParams)  : sap.ushell.resources.i18n.getText(sMsgId);
    };
}());
