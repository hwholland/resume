/*global jQuery, sap */

(function () {
    "use strict";

    function loadSchema(sSchemaPath) {
        var oDeferred = new jQuery.Deferred();
        jQuery.getJSON(sSchemaPath, function (oSchema) {
            oDeferred.resolve(oSchema);
        });

        return oDeferred.promise();
    }

    function getErrorPathContextHtml(oSchema, sErrorPath) {
        function str(oObject) {
            return JSON.stringify(oObject, null, "   ");
        }
        // traverse the schema until the parent of the leaf
        var aPathParts = sErrorPath.split("/");
        var oCurrentNode = oSchema;
        var sContext;
        var aRefPathParts;
        var oPreviousNode;
        var sPathPart;

        // discard empty entry (leading "/") in case
        if (sErrorPath.charAt(0) === "/") {
            aPathParts.shift();
        }

        while (aPathParts.length > 0) {
            sPathPart = aPathParts.shift();

            // undo cheap hack from validator lib
            sPathPart = sPathPart.replace(/\~1/g, "/").replace(/\~0/g, "~");

            oPreviousNode = oCurrentNode;
            oCurrentNode = oCurrentNode[sPathPart];


            // try to resolve a reference if oCurrentNode is undefined
            if (!oCurrentNode && oPreviousNode.hasOwnProperty("$ref")) {
              // very cheap hack
              aRefPathParts = oPreviousNode["$ref"].split("/");
              oCurrentNode = oSchema[aRefPathParts[1]][aRefPathParts[2]][sPathPart];
            }

            if (aPathParts.length === 0 && typeof sContext === "undefined") {
                // a leaf node without a context
                sContext = "<span class=\"validator-error-path-context-leaf\">" + str(oCurrentNode) + "</span>";
            } else if (aPathParts.length === 0 && typeof sContext === "string") {
                // a leaf node with a context
                sContext = sContext.replace(
                    str(oCurrentNode), "<span class=\"validator-error-path-context-leaf\">" + str(oCurrentNode) + "</span>"
                );
            } else {
                // this is a context node
                sContext = str(oCurrentNode);
            }
        }

        return sContext;
    }

    function validate(schema, data, oOptions, oIgnored, oView) {
        var that = oView;
        var oSettings = jQuery.extend({
            errorContainerCss: "body",
            missingSchemasContainerCss: "body",
            resultContainerCss: "body",
            refPrefix: ""
        }, oOptions);

        var oResult = tv4.validateMultiple(
            data,
            schema,
            true /* checkRecursive */,
            true /* banUnknownProperties */
        );

        if (oResult.missing.length > 0) {
            // Must add to the schema and re-validate

            // add missing schemas
            var aMissingPromises = [];
            oResult.missing
                .forEach(function (sUrl) {
                    var oDeferred = new jQuery.Deferred();
                    jQuery.getJSON(oSettings.refPrefix + sUrl, function (oSchema) {
                        jQuery(oSettings.missingSchemasContainerCss).append(
                            "<div class=\"validator-missingschema\">Loaded sub-schema \"" + sUrl + "\"</div>"
                        );
                        tv4.addSchema(sUrl, oSchema);
                        oDeferred.resolve();
                    });
                    aMissingPromises.push(oDeferred.promise());
                });

            if (aMissingPromises.length > 0) {
                jQuery.when.apply(jQuery, aMissingPromises)
                    .then(function () {
                        // revalidate
                        validate(schema, data, oOptions, undefined, oView);
                    });
                return;
            }

            jQuery(oSettings.missingSchemasContainerCss)
                .append("<div class=\"validator-title\">Missing schemas</div>")
                .append(
                    oResult.missing.map(function (sMissing) {
                        return "<div class=\"validator-missing\">" + sMissing + "</div>";
                    }).join("")
                );
        }
        if (!oResult.valid) {
            oView.byId("resultIcon").setSrc("sap-icon://decline").setColor("red");
            oView.byId("resultPanel").setExpanded(true);
            jQuery(oSettings.resultContainerCss)
                .append("<div class=\"validator-title\">Errors:</div>")
                .append(
                    oResult.errors.map(function (oError) {
                        var sError = "<ul class=\"validator-error\">"
                            + "<li class=\"validator-error-message\">" + oError.message + "</li>";

                        if (oError.schemaPath) {
                            sError += "<li class=\"validator-error-path-name\">" + oError.schemaPath + "</li>"
                            + "<li class=\"validator-error-path-context\">... " + oError.schemaPath.split("/")[1] + ": " + getErrorPathContextHtml(schema, oError.schemaPath) + "...</li>";
                        }

                        sError += "<li>Raw error: " + "<pre class=\"validator-error-verbatim\">" + JSON.stringify(oError, undefined, 3) + "</pre></li>"
                            + "</ul>";

                        return sError;
                    }).join("")
                );
        } else {
            oView.byId("resultIcon").setSrc("sap-icon://accept").setColor("green");
            jQuery(oSettings.validContainerCss)
                .append("<div class=\"validator-title\">Valid: " + oResult.valid + "</div>");
        }
    }

    sap.ui.controller("jsonvalidator.Main", {

        schemas: {
            "CDM Runtime": {
                "description": "Common Data Model",
                "schemaPath": "schemas/cdmruntime/schema.json",    // path to the main schema file
                "refPrefix": "schemas/"                     // prefix to prepend when processing refs
            }
    //,
    //        "Not the AppDescriptor": {
    //            "description": "Application Descriptor",
    //            "schemaPath": "schemas/manifest/schema/schema.json",    // path to the main schema file
    //            "refPrefix": "schemas/manifest/schema/"                 // prefix to prepend when processing refs
    //        }
        },

    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf jsonvalidator.Main
    */
    onInit: function() {
        var source = jQuery.sap.getUriParameters().get("fileurl") || "/CDMSiteServiceAdapterData.js",
            that = this;
        setTimeout(function() {
            var xh = new XMLHttpRequest();
            xh.open('GET',"/sap/bc/ui5_demokit/test-resources/sap/ushell/adapters/cdm/CDMSiteServiceAdapterData.js", false);
            xh.send(null);
            if (xh.status === 200) {
                that.getView().byId("JSONTextArea").setValue(xh.responseText);
            }
            setTimeout(function() {
                that.validatePressed();
            },200);
        },200);

    },

    /**
    * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
    * (NOT before the first rendering! onInit() is used for that one!).
    * @memberOf jsonvalidator.Main
    */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf jsonvalidator.Main
    */
    //	onAfterRendering: function() {
    //
    //	},

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf jsonvalidator.Main
    */
    //	onExit: function() {
    //
    //	}

        validatePressed: function () {

            var that = this,
                oJson,
                sSelectedKey = that.getView().byId("schemaSelector").getSelectedKey();

            jQuery(".validation-results").html("");

            try {
                oJson = JSON.parse(that.getView().byId("JSONTextArea").getValue());
            } catch (oException) {
                that.getView().byId("resultIcon").setSrc("sap-icon://decline").setColor("red");
                that.getView().byId("resultPanel").setExpanded(true);
                jQuery(".validation-results").append(oException + ": " + oException.stack);
                return;
            }

            loadSchema(this.schemas[sSelectedKey].schemaPath)
                .done(function (oSchema) {
                    validate(oSchema, oJson, {
                        validContainerCss: ".validation-results",
                        errorContainerCss: ".validation-results",
                        missingSchemasContainerCss: ".validation-results",
                        resultContainerCss: ".validation-results",
                        refPrefix: that.schemas[sSelectedKey].refPrefix
                    }, sSelectedKey,that.getView());
                })
                .fail(function (oError) {
                    jQuery(".validation-results").append(Object.prototype.toString(oError));
                });
        }

    });
}());
