/*global sap */

(function () {
    "use strict";

    sap.ui.jsview("jsonvalidator.Main", {

        /** Specifies the Controller belonging to this View.
        * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
        * @memberOf jsonvalidator.Main
        */
        getControllerName: function() {
            return "jsonvalidator.Main";
        },

        /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
        * Since the Controller is given to this method, its event handlers can be attached right away.
        * @memberOf jsonvalidator.Main
        */
        createContent: function(oController) {
            return new sap.m.Page({
                title: "JSON Validator",
                content: [
                    new sap.m.Panel({
                        expandable: true,
                        expanded: true,
                        headerToolbar: new sap.m.Toolbar({
                            content: [
                                new sap.m.ComboBox(this.createId("schemaSelector"), {
                                    selectedKey: "CDM",
                                    items: Object.keys(oController.schemas).map(
                                        function(oValue) {
                                            return new sap.ui.core.Item({
                                                text: oController.schemas[oValue].description,
                                                key: oValue
                                            });
                                        }
                                    )
                                }),
                                new sap.m.Button({
                                    text: "Validate!",
                                    press: oController.validatePressed.bind(oController)
                                })
                            ]
                        }),
                        content: [
                            new sap.m.TextArea(this.createId("JSONTextArea"), {
                                cols: 250,
                                rows: 20
                            })
                        ]
                    }),
                    new sap.m.Panel(this.createId("resultPanel"), {
                        expandable: true,
                        expanded: false,
                        headerToolbar: new sap.m.Toolbar({
                            content: [
                                new sap.m.Label({
                                    text: "Validation Results"
                                }),
                                new sap.ui.core.Icon(this.createId("resultIcon"), {
                                    src: "sap-icon://overflow"
                                })
                            ]
                        }),
                        content: [
                            new sap.ui.core.HTML({
                                content: "<div class='validation-results'></div>"
                            })
                        ]
                    })
                ]
            });
        }

    });
}());
