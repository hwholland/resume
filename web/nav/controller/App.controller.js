sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("nav.controller.App", {

        onInit: function () {
            var oTimelineModel = this.getOwnerComponent().getModel("timeline");
            var oTimelineData = oTimelineModel.getData();
            /*
            oTimelineData.data.forEach(element => {
                var oDate = new Date(element.Date);
                element.Date = oDate;
            });
            */
            oTimelineModel.setData(oTimelineData);

            var oBlockModel = this.getOwnerComponent().getModel("blocks");
            var oStartupData = oBlockModel.getProperty("/startup");
            var oConsultingData = oBlockModel.getProperty("/consulting");
            var oEmploymentData = oBlockModel.getProperty("/employment");
            console.log(oEmploymentData);
            this.getBlockContent(oStartupData, "StartupSection");
            this.getBlockContent(oConsultingData, "ConsultingSection");
            this.getBlockContent(oEmploymentData, "EmploymentSection");

        },

        onAfterRendering: function () {

        },

        getBlockContent: function (oData, sSectionId) {
            for (var i = 0; i < oData.length; i++) {
                var oNode = oData[i];
                var oSimpleForm = new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout",
                    //columnsL: 1,
                    //columnsM: 1,
                    //columnsS: 1,
                    content: [
                        new sap.ui.core.Title({
                            text: "Work Details"
                        }),
                        new sap.m.Label({
                            text: "Company"
                        }),
                        new sap.m.Text({
                            text: oNode.title
                        }),
                        new sap.m.Label({
                            text: "Job Position"
                        }),
                        new sap.m.Text({
                            text: oNode.position
                        }),
                        new sap.m.Label({
                            text: "Duration"
                        }),
                        new sap.m.Text({
                            text: oNode.duration
                        }),
                        new sap.m.Label({
                            text: "Location"
                        }),
                        new sap.m.Text({
                            text: oNode.location
                        })
                    ]
                });
                if(oNode.summary) {
                    oSimpleForm.addContent(new sap.ui.core.Title({
                        text: "Work Description"
                    }));
                    oSimpleForm.addContent(new sap.m.Label({
                        text: "Summary"
                    }));
                    oSimpleForm.addContent(new sap.m.Text({
                        text: oNode.summary
                    }));
                }
                if (oNode.bullets) {
                    oSimpleForm.addContent(new sap.ui.core.Title({
                        text: "Key Achievements"
                    }));
                    for (var x = 0; x < oNode.bullets.length; x++) {
                        var oBullet = oNode.bullets[x];
                        var oMessageStrip = new sap.m.MessageStrip({
                            text: oBullet.text
                        });
                        if (oNode.bullets.length === x) {
                            oMessageStrip.addStyleClass("sapUiTinyMarginBottom");
                        }
                        oSimpleForm.addContent(new sap.m.Label());
                        oSimpleForm.addContent(oMessageStrip);
                    }
                }
               
                var oSubSection = new sap.uxap.ObjectPageSubSection({
                    title: oNode.title,
                    blocks: [
                        oSimpleForm
                    ]
                });
                console.log(oSubSection);
                this.byId(sSectionId).addSubSection(oSubSection);
            }
        },

        onPressLinkedIn: function () {
            window.open("https://www.linkedin.com/in/harrisonholland", "_blank");
        },

        onPressGithub: function () {
            window.open("https://github.com/hwholland", "_blank");
        },

        onPressSDN: function () {
            window.open("https://people.sap.com/harrison.holland4", "_blank");
        },

        onPressEmail: function () {
            sap.m.URLHelper.triggerEmail("harrisonholland@gmail.com", "Info Request");
        }
    });

});