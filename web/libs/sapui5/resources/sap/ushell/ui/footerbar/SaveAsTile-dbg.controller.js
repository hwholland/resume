sap.ui.controller("sap.ushell.ui.footerbar.SaveAsTile", {
    onExit: function() {
        "use strict";
        var oView = this.getView();
        var oTileView = oView.getTileView();
        oTileView.destroy();
    },

    onInit: function () {
        "use strict";
        var appMetaData = sap.ushell.services.AppConfiguration.getMetadata();
        this.oPageBuilderService = sap.ushell.Container.getService("LaunchPage");
        this.oView = this.getView();
        this.appData = this.oView.viewData.appData || {};
        //For backwards compatibility.
        if (!jQuery.isEmptyObject(this.appData)) {
            this.oModel = new sap.ui.model.json.JSONModel({
                showGroupSelection: this.appData.showGroupSelection === false ? false : true,
                title : this.appData.title ? this.appData.title.substring(0, 256) : '',
                subtitle: this.appData.subtitle ? this.appData.subtitle.substring(0, 256) : '',
                numberValue : '',
                info: this.appData.info ? this.appData.info.substring(0, 256) : '',
                icon: this.appData.icon || appMetaData.icon,
                numberUnit : this.appData.numberUnit,
                keywords: this.appData.keywords || '',
                groups: []
            });
            this.oView.setModel(this.oModel);
        }
    },
    calcTileDataFromServiceUrl: function (serviceUrl) {
        "use strict";
        var that = this;
        /* global OData */
        OData.read({requestUri: serviceUrl},
            // sucess handler
            function (oResult) {
                if (typeof oResult === "string") {
                    oResult = {number: oResult};
                }
                that.oModel.setProperty('/numberValue', oResult.number);
                var aKeys = ["infoState", "stateArrow", "numberState", "numberDigits", "numberFactor", "numberUnit"];
                for (var i = 0; i < aKeys.length; i++) {
                    var key = aKeys[i];
                    if (oResult[key]) {
                        that.oModel.setProperty('/' + key, oResult[key]);
                    }
                }
            }, function (err) {
                    window.console.log(err);
            }, {
                    read: function (response) {
                        response.data = JSON.parse(response.body).d;
                    }
            }
        );
    },
    loadPersonalizedGroups: function () {
        "use strict";
        var oGroupsPromise = this.oPageBuilderService.getGroups(),
            that = this,
            deferred = jQuery.Deferred();

        oGroupsPromise.done(function (aGroups) {
            var promise = that.loadGroupsFromArray(aGroups);

            promise.done(function (data) {
                deferred.resolve(data);
            });
        });

        return deferred;
    },
    loadGroupsFromArray : function (aGroups) {
        "use strict";
        var that = this,
            deferred = jQuery.Deferred(),
            oModel = that.oView.getModel();

        this.oPageBuilderService.getDefaultGroup().done(function (oDefaultGroup) {
            //filter out hidden and locked groups
            aGroups = aGroups.filter(function (group) {
                return (!that.oPageBuilderService.isGroupLocked(group) && that.oPageBuilderService.isGroupVisible(group));
            })
                //create the model structure
                .map(function (group) {
                return {
                    title: (group === oDefaultGroup && that.getLocalizedText("my_group")) || that.oPageBuilderService.getGroupTitle(group),
                    object: group
                };
            });

            oModel.setProperty('/groups', aGroups);
            //set new length in case there are less new groups
            oModel.setProperty("/groups/length", aGroups.length);
            deferred.resolve();
        });

        return deferred;
    },
    getLocalizedText: function (sMsgId, aParams) {
        "use strict";
        return aParams ? sap.ushell.resources.i18n.getText(sMsgId, aParams) : sap.ushell.resources.i18n.getText(sMsgId);
    }
});
