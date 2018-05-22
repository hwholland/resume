// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.ClientSideTargetResolution
 */
(function () {
    "use strict";
    /* global module, test, ok, equal, deepEqual, strictEqual, sinon,
       asyncTest, start, URI */

    /*eslint max-nested-callbacks: [1, 4]*/

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.ClientSideTargetResolution");

    // lookup of all count parameters
    var O_COUNT_PARAMETERS = {
            "countDefaultedParams"           : true,
            "countFreeInboundParams"         : true,
            "countMatchingFilterParams"      : true,
            "countMatchingParams"            : true,
            "countMatchingRequiredParams"    : true,
            "countPotentiallyMatchingParams" : true
        },
        I_DEBUG = jQuery.sap.log.Level.DEBUG,
        I_TRACE = jQuery.sap.log.Level.TRACE,
        O_LOCAL_SYSTEM_ALIAS = { // local system alias (hardcoded in the adapter for now)
           "http": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": ""
           },
           "https": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": "/sap/bc/"
           },
           "rfc": {
               "id": "",
               "systemId": "",
               "host": "",
               "service": 0,
               "loginGroup": "",
               "sncNameR3": "",
               "sncQoPR3": ""
           },
           "id": "",
           "client": "",
           "language": ""
        };
        var O_KNOWN_SYSTEM_ALIASES = {
            "UR3CLNT120": {
                "http": {
                    "id": "UR3CLNT120_HTTP",
                    "host": "example.corp.com",
                    "port": 50055,
                    "pathPrefix": ""
                },
                "https": {
                    "id": "UR3CLNT120_HTTPS",
                    "host": "example.corp.com",
                    "port": 44355,
                    "pathPrefix": ""
                },
                "rfc": {
                    "id": "UR3CLNT120",
                    "systemId": "",
                    "host": "example.corp.com",
                    "service": 3255,
                    "loginGroup": "",
                    "sncNameR3": "p/secude:CN=UR3, O=SAP-AG, C=DE",
                    "sncQoPR3": "8"
                },
                "id": "UR3CLNT120",
                "client": "120",
                "language": ""
            },
            "ALIASRFC": {
                "http": {
                    "id": "ALIASRFC_HTTP",
                    "host": "example.corp.com",
                    "port": 50055,
                    "pathPrefix": "/aliaspath//"
                },
                "https": {
                    "id": "ALIASRFC_HTTPS",
                    "host": "example.corp.com",
                    "port": 1111,
                    "pathPrefix": "/path/"
                },
                "rfc": {
                    "id": "ALIASRFC",
                    "systemId": "UV2",
                    "host": "ldcsuv2",
                    "service": 32,
                    "loginGroup": "SPACE",
                    "sncNameR3": "p/secude:CN=UXR, O=SAP-AG, C=DE",
                    "sncQoPR3": "9"
                },
                "id": "ALIASRFC",
                "client": "220",
                "language": ""
            },
            "ALIAS111": {
                "http": {
                    "id": "ALIAS111",
                    "host": "example.corp.com",
                    "port": 44335,
                    "pathPrefix": "/go-to/the/moon"
                },
                "https": {
                    "id": "ALIAS111_HTTPS",
                    "host": "example.corp.com",
                    "port": 44335,
                    "pathPrefix": "/go-to/the/moon"
                },
                "rfc": {
                    "id": "",
                    "systemId": "",
                    "host": "",
                    "service": 32,
                    "loginGroup": "",
                    "sncNameR3": "",
                    "sncQoPR3": ""
                },
                "id": "ALIAS111",
                "client": "111",
                "language": ""
            }
       };

    /*
     * Removes the count* parameters from each match result (output of
     * getMatchingInbounds) and the priority string.
     *
     * Returns the filtered result (that may contain shallow copies of
     * objects/arrays).
     */
    function removeCountsAndSortString (vMatchResults) {
        var bIsObject = jQuery.isPlainObject(vMatchResults);
        var aMatchResults = bIsObject ? [vMatchResults] : vMatchResults,
            aMutatedMatchResults = aMatchResults.map(function (oMatchResult) {

            return JSON.parse(JSON.stringify(oMatchResult, function (sKey, vVal) {

                return O_COUNT_PARAMETERS.hasOwnProperty(sKey) || sKey === "priorityString" ? undefined : vVal;
            }));
        });

        return bIsObject ? aMutatedMatchResults[0] : aMutatedMatchResults;
    }

    /*
     * Returns an instance of ClientSideTargetResolution service initialized
     * with the given inbounds.
     */
    function createServiceWithInbounds (aInbounds) {
        return createServiceWithAdapter({
            getInbounds: sinon.stub().returns(
                new jQuery.Deferred().resolve(aInbounds).promise()
            )
        });
    }

    /*
     * Returns an instance of ClientSideTargetResolution service initialized
     * with the given (fake) adapter.
     */
    function createServiceWithAdapter(oAdapter) {
        return new sap.ushell.services.ClientSideTargetResolution(oAdapter);
    }

    module("sap.ushell.services.ClientSideTargetResolution", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ushell.test.restoreSpies(
                sap.ushell.utils.Error,
                sap.ushell.utils.getFormFactor,
                sap.ushell.Container.getService,
                sap.ushell.Container.getUser,
                jQuery.sap.log.warning,
                jQuery.sap.log.error
            );
            delete sap.ushell.Container;
        }
    });

    test("getServiceClientSideTargetResolution: returns something different than undefined", function () {
        var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
        ok(oClientSideTargetResolution !== undefined);
    });

    /**
     * Expand inbound filter object for the CSTR Adapter if enabled via configuration.
     *
     * @param {variant} vObject
     *   An input structure to extract the filter from.
     *   Currently we support a string representing a hash fragment.
     *
     * @returns {object[]}
     *   <code>undefined</code>, or an array of Segments (tuples semanticObject, action) in the form:
     * <pre>
     *  [
     *    {
     *      semanticObject : "So1",
     *      action : "action1"
     *    },
     *    ...
     *  ]
     * </pre>
     *
     */
    test("getServiceClientSideTargetResolution: returns something different than undefined", function () {
        var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
        ok(oClientSideTargetResolution !== undefined);
    });



    [
        /*
         * Test for _extractInboundFilter
         */
        {
            testDescription: "natural result",
            input : "ABC-def?SO=AA",
            result : [
               {
                   semanticObject : "ABC",
                   action : "def"
               }
            ]
        },
        {
            testDescription: "flawed input",
            input : "Customer-processReceivablesCollectionSegment=EUR_TOOL&Customer=C0001&IsHeadOfficeView=true#Shell-home",
            result : undefined
        },
        {
            testDescription: "natural result no segmented access",
            noSegment : true,
            input : "ABC-defo?SO=AA",
            result : undefined
        }
    ].forEach(function (oFixture) {
        test("_extractInboundFilter when " + oFixture.testDescription, function () {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution");
            //    oParseSrvc = sap.ushell.Container.getService("URLParsing");
            if (oFixture.noSegment) {
                oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution");
            } else {
                oSrvc = new sap.ushell.services.ClientSideTargetResolution({ hasSegmentedAccess : true}); 
            }
            // oAdapter.hasSegmentedAccess; 
            var res = oSrvc._extractInboundFilter(oFixture.input);
            deepEqual(res,oFixture.result, "correct result");
        });
    });


    [
        /*
         * Test for _matchToInbound.
         *
         * Tests whether a match occurs and any missing references are
         * returned as expected.
         */
        {
            testDescription: "inbound has no signature parameters",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO",
                action: "aBC",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound has no signature parameters and intent action is undefined",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.action = undefined; // matches all actions
            },
            oInbound: {
                semanticObject : "SO",
                action: "aBC",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }

        },
        {
            testDescription: "inbound has semantic object '*'",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    parameters: {
                        "DEF": {
                            required: true
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound has a required parameter that is not in the hash",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "IMPORTANT": {
                            required: true
                        }
                    }
                }
            }

        },
        {
            testDescription: "inbound has a required parameter that is in the hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "DEF" : {
                            required: true
                        }
                    }
                }
            }

        },
        {
            testDescription: "P1 parameter is not required yet specified with right filter value in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&P1=4&/detail/1?A=B", // P1: 4 matching
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "plain filter with empty string is specified with required parameter, and not fulfilled",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&RequiredParam=Value",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "RequiredParam": {
                            required : true,
                            filter: { value: "" }  // actually filters on ""
                        }
                    }
                }
            }
        },
        {
            testDescription: "plain filter with empty string is specified with required parameter, and fulfilled",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&RequiredParam=",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "RequiredParam": {
                            required : true,
                            filter: { value: "" }  // actually filters on ""
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required yet specified as the only parameter with right filter value in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?P1=4",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required: false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required yet specified as the only parameter with wrong filter value in shell hash",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?P1=3",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required and not specified but filter implies mandatory",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, but DEF is not in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&/detail/1?A=B",  // will default to 5
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        // DEF specified -> it can be 5 or 6
                        // DEF not specified -> will default to 5
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp" },
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, and DEF is 5",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&DEF=6&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp"},
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, and DEF is 7",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&DEF=7&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp"},
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a default reference appears in the Tm signature, but this
             * value is specified in oKnownUserDefaultRefsIn, the match occurs,
             * but the oMissingUserDefaultRefsOut object is updated with the
             * user default reference value, indicating the match is a
             * potential match, and could not be fully determined because of
             * one or more missing user default value.
             */
            testDescription: "default value refers to a non-specified user default value",
            expectedMatch: true,           // match occurs but is a potential match...
            expectedMissingUserDefaultRefsOut: {  // ... because the value of this default parameter is unknown
                "UserDefault.currency": true
            },
            sShellHash: "#SO-act",
            oKnownUserDefaultRefsIn: {}, // no user default parameters known
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: { // default value must be taken from a user default
                                format: "reference", value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a default reference appears in the Tm signature, and its
             * value is known (i.e., specified in oKnownUserDefaultRefsIn, the match
             * occurs and oMissingUserDefaultRefsOut is left empty, indicating all the
             * references of the Tm were fully resolved.
             */
            testDescription: "default value refers to a specified user default value",
            expectedMatch: true,
            expectedMissingUserDefaultRefsOut: {}, // no output refs as value was provided
            sShellHash: "#SO-act",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "value" },  // default value is given
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a filter reference appears in the Inbound signature, and its
             * value is unknown (i.e., not specified in oKnownUserDefaultRefsIn),
             * the match occurs, but the oMissingUserDefaultRefsOut object is
             * updated with the filter reference indicating that the match is a
             * potential match.
             */
            testDescription: "reference value in inbound is unknown",
            expectedMatch: true,           // match occurs but is a potential match...
            expectedMissingUserDefaultRefsOut: {  // ... because the value of this default parameter is unknown
                "UserDefault.currency": true
            },
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: {}, // no user default parameters known
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: true,
                            filter: { // default value must be taken from a user default
                                format: "reference", value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a filter reference appears in the Tm signature, and its
             * value is known (i.e., it's specified in
             * oKnownUserDefaultRefsIn), the match occurs, and the
             * oMissingUserDefaultRefsOut object is left empty, indicating that
             * no references must be resolved in order to determine that match.
             */
            testDescription: "filter reference is known and filter is matching",
            expectedMatch: true,
            expectedMissingUserDefaultRefsOut: {}, // no output refs as value was provided
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "EUR" },  // known user default
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "filter reference is known and filter is not matching",
            expectedMatch: false,
            expectedMissingUserDefaultRefsOut: {},
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "USD" },  // NOTE: USD
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: true,  // Required parameter
                            filter: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "formFactor is undefined",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.formFactor = undefined;
            },
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "formFactor is desktop",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.formFactor = "desktop";
            },
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "required parameter but no filter value or default value is specified",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action?REQ=",
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {
                        "REQ": {
                            required: true
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        }
    ].forEach(function (oFixture) {
        var sOccursOrNot = oFixture.expectedMatch ? "occurs" : "does not occur";

        test("_matchToInbound: match " + sOccursOrNot + " when " + oFixture.testDescription, function () {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                oParseSrvc = sap.ushell.Container.getService("URLParsing"),
                oParsedShellHash = oParseSrvc.parseShellHash(oFixture.sShellHash),
                oMissingUserDefaultRefsOut = {},
                oMatchResult;

            // amend parsed shell hash if test fixture requests so
            if (oFixture.hasOwnProperty("fnAmendParsedShellHash")) {
                oFixture.fnAmendParsedShellHash(oParsedShellHash);
            }

            oMatchResult = oSrvc._matchToInbound(
                oParsedShellHash,
                oFixture.oInbound,
                oFixture.oKnownUserDefaultRefsIn,
                oMissingUserDefaultRefsOut
            );

            strictEqual(oMatchResult.matches, oFixture.expectedMatch,
                "inbound and intent matching " + sOccursOrNot);

            if (oFixture.hasOwnProperty("expectedMissingUserDefaultRefsOut")) {
                deepEqual(oMissingUserDefaultRefsOut,
                    oFixture.expectedMissingUserDefaultRefsOut,
                    "obtained expected missing user default refs");
            }
        });
    });

    [
        {
            testDescription: "not all references are user default references",
            aReferences: ["UserDefault.name", "UserDefault.surname", "Machine.name"],
            expectedErrorLogCalls: 1,
            expectedErrorLogCallArgs: [
                "User default reference cannot be resolved",
                "Cannot extract name of user default reference from 'Machine.name'",
                "sap.ushell.services.ClientSideTargetResolution"
            ]
        }
    ].forEach(function(oFixture) {
        asyncTest("_resolveAllReferences: rejects with error message when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]);

            sinon.stub(jQuery.sap.log, "error");

            oSrvc._resolveAllReferences(oFixture.aReferences)
                .done(function () {
                    ok(false, "promise was rejected");
                })
                .fail(function (sError) {
                    ok(true, "promise was rejected");
                    strictEqual(sError, "One or more user default references could not be resolved", "promise was rejected with expected error message");
                    strictEqual(jQuery.sap.log.error.getCalls().length, oFixture.expectedErrorLogCalls, "jQuery.sap.log.error was called " + oFixture.expectedErrorLogCalls + " time");
                    deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorLogCallArgs, "jQuery.sap.log.error was called with the expected arguments");
                })
                .always(function () {
                    start();
                });
        });
    });

    // test the parameter sap-ui-tech-hint=WDA|UI5|GUI which, given
    // an otherwise identical targetmapping, selects the one which has the given technology.

    var iInb = {
        semanticObject : "SO",
        action : "action",
        signature : {
            parameters : {}
        },
        resolutionResult : {}
    };

    var iInbDefault = {
        semanticObject : "SO",
        action : "action",
        signature : {
            parameters : { "sap-ui-tech-hint" : { defaultValue : { value : "XXX" }}}
        },
        resolutionResult : {}
    };

    var iInbDefaultOtherPar = {
        semanticObject : "SO",
        action : "action",
        signature : {
            parameters : {
                "sap-ui-tech-hint" : { defaultValue : { value : "XXX" }},
                "demo2" : { defaultValue : { value : "XXX" }}
            }
        },
        resolutionResult : {}
    };

    function addTech(oObj,sTech) {
        var copy = jQuery.extend(true, {},oObj);
        copy.resolutionResult["sap.ui"] = {};
        copy.resolutionResult["sap.ui"].technology = sTech;
        return copy;
    }

    [
         {
             testDescription: "all else equal, tech hint is used WDA->WDA",
             aInbounds : ["GUI","WDA","UI5", undefined].map(function(el) {
                 return addTech(iInb, el);
             }),
             sIntent : "SO-action?sap-ui-tech-hint=WDA",
             expectedResultTech : "WDA"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI",
             aInbounds : ["GUI","UI5", "WDA", undefined].map(function(el) { return addTech(iInb, el); }),
             sIntent : "SO-action",
             expectedResultTech : "UI5"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , UI5 not present",
             aInbounds : ["GUI","WDA",undefined].map(function(el) { return addTech(iInb, el); }),
             sIntent : "SO-action",
             expectedResultTech : "WDA"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , default on WDA Intent",
             aInbounds : [addTech(iInbDefault, "WDA")].concat(["GUI","UI5",undefined].map(function(el) { return addTech(iInb, el); })),
             sIntent : "SO-action?sap-ui-tech-hint=GUI",
             expectedResultTech : "GUI"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , DefaultInOther",
             aInbounds : [addTech(iInbDefaultOtherPar, "WDA")].concat(["GUI","WDA",undefined].map(function(el) { return addTech(iInb, el); })),
             sIntent : "SO-action?sap-ui-tech-hint=GUI",
             expectedResultTech : "GUI"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , DefaultInOther no hint",
             aInbounds : [addTech(iInbDefaultOtherPar, "WDA")].concat(["GUI","WDA",undefined].map(function(el) { return addTech(iInb, el); })),
             sIntent : "SO-action",
             expectedResultTech : "WDA"
         }
    ].forEach(function(oFixture) {
        asyncTest("matchingTarget sap-ui-tech-hint " + oFixture.testDescription, function () {
         var oSrvc = createServiceWithInbounds([]);
         var oUrlParsing = oSrvc._getURLParsing();
//         var that = this;
         var oShellHash = oUrlParsing.parseShellHash("#" + oFixture.sIntent);
         oShellHash.formFactor = "desktop";

         oSrvc._getMatchingInbounds(oShellHash, oFixture.aInbounds)
             .done(function (oMatchingTargets) {
                 if (oFixture.expectedResultTech) {
                     equal(oMatchingTargets[0].inbound.resolutionResult["sap.ui"].technology, oFixture.expectedResultTech, "correct result technology");
                 }
             })
             .fail(function (sError) {
                 ok(false, "promise was rejected");
             })
             .always(function () {
                 start();
            });
        });
    });

    [
        /*
         * _matchToInbound: test whether a match occurs against a test inbound.
         */
        { "url": "ABC=1&DEF=2"         , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "ABC=1&DEF=2"         , additionalParameters: "notallowed", expectedMatch: false },
        { "url": "ABC=1&DEF=2"         , additionalParameters: "ignored", expectedMatch: true  },
        { "url": "ABC=1"               , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "ABC=1&sap-a=true&sap-b=true", additionalParameters: "notallowed", expectedMatch: true  },
        { "url": "ABC=1"               , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": "ABC=1&sap-system=123", additionalParameters: "notallowed", expectedMatch: true  }, // sap-system ignored!
        { "url": "ABC=1"               , additionalParameters: "ignored", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "ignored", expectedMatch: true  },
        { "url": "DEF=3"               , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "DEF=3"               , additionalParameters: "notallowed", expectedMatch: false },
        { "url": "DEF=3"               , additionalParameters: "ignored", expectedMatch: true  }
    ].forEach(function (oFixture) {
        var sOccursOrNot = oFixture.expectedMatch ? "occurs" : "does not occur";

        test("_matchToInbound: (additional parameters)" + JSON.stringify(oFixture) + " ", function() {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                oParseSrvc = sap.ushell.Container.getService("URLParsing"),
                oArgs = oParseSrvc.parseShellHash("#SO-aBC~CONTXT?" + oFixture.url);

            oArgs.action = undefined;
            var oMatchResult = oSrvc._matchToInbound(oArgs, {
                    deviceTypes: {
                        desktop: true,
                        phone: true,
                        tablet: true
                    },
                    semanticObject: "SO",
                    action: "aBC",
                    signature: {
                        parameters: {
                            "ABC": {}
                        },
                        additionalParameters: oFixture.additionalParameters
                    }
                },
                {} /* oKnownUserDefaultRefsIn */,
                {} /* oMissingUserDefaultRefsOut */
            );

            equal(oMatchResult.matches, oFixture.expectedMatch, "matching " + sOccursOrNot);
        });
    });

    test("_matchToInbound: adds user default parameters to the in/out parameter", function () {
        var oSrvc = createServiceWithInbounds([]),
            oTm = {
                semanticObject: "Object", action: "action",
                signature: {
                    parameters: {
                        userFilter  : { required : true , filter       : { format : "reference", value : "UserDefault.dynamic1" } },
                        userDefault : { required : false, defaultValue : { format : "reference", value : "UserDefault.dynamic2" } },
                        userDefaultExtended : { required : false, defaultValue : { format : "reference", value : "UserDefault.extended.dynamic3" } },
                        noFilter    : { required : true , filter       : { value  : "static1" } },
                        noDefault   : { required : false, defaultValue : { value  : "static2" } }
                    }
                }
            },
            oParsedShellHash = {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "noFilter": ["static1"],
                    // will be ignored, but still this required parameter must
                    // be supplied for the inbound to match.
                    "userFilter": ["DynamicValue1"]
                }
            };

        // Collects the references to user default parameters
        var oMissingUserDefaultRefsOut = {},
            oMatchResult = oSrvc._matchToInbound(oParsedShellHash, oTm, {}, oMissingUserDefaultRefsOut);

        strictEqual(oMatchResult.matches, true, "test shell hash matched one inbound");

        deepEqual(oMissingUserDefaultRefsOut, {
            "UserDefault.dynamic1": true,
            "UserDefault.dynamic2": true,
            "UserDefault.extended.dynamic3": true
        }, "user default parameters were added to the user defaults set");
    });

    [
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "123410004565" , expectedMatch: false },
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "2000"         , expectedMatch: true  },
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "(1000)|(2000)", expectedMatch: false },
        { filter: { value: ".*",                        format: "regexp" },    value: "random text"  , expectedMatch: true  },
        { filter: { value: "2000",                      format: "regexp" },    value: "(1000)|(2000)", expectedMatch: false },
        { filter: { value: "(1000)|(2000)",             format: "plain"  },    value: "(1000)|(2000)", expectedMatch: true  },
        { filter: { value: "",                          format: "plain" },     value: ""             , expectedMatch: true  },
        { filter: { value: "",                          format: "plain" },     value: undefined      , expectedMatch: false },
        { filter: { value: "UserDefault.val",           format: "reference" }, value: "SomethingElse", expectedMatch: true  },
        { filter: { value: "UserDefault.extended.val",  format: "reference" }, value: "SomethingElse1", expectedMatch: false }
    ].forEach(function(oFixture) {

        function fnValToString(vVal) {
            /* eslint-disable no-nested-ternary */
            return (vVal === null ? "null"
                :  vVal === undefined ? "undefined"
                :  vVal === "" ? '""'
                : "" + vVal).replace("|", " or ");
            /* eslint-enable no-nested-ternary */
        }

        test("_matchesFilter: matching " + fnValToString(oFixture.value), function () {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                oMissingUserDefaultRefsOut = {},
                bRes = oSrvc._matchesFilter(oFixture.value, oFixture.filter, {}, oMissingUserDefaultRefsOut);

            strictEqual(bRes, oFixture.expectedMatch, "match was performed as expected");

            if (oFixture.filter.format === "reference") {
                if (oFixture.filter.value.indexOf(".extended.") < 0) {
                    // simple user default
                    ok(oMissingUserDefaultRefsOut.hasOwnProperty(oFixture.filter.value),
                        "Filter value found in user default reference object");
                } else {
                    // extended user defaults are not allowed as filter
                    ok(!oMissingUserDefaultRefsOut.hasOwnProperty(oFixture.filter.value),
                        "no Filter value found in user default reference object");
                }
            }
        });
    });

    (function () {
        /*
         * _matchToInbound: test whether a match occurs with expected result
         */
        var oSampleInboundWithParameterMapping = {
            "action": "toappwithparametermapping",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "parameterMapping": {
                "param1": { target: "param2" }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithNoParameterMapping = jQuery.extend(true, {}, oSampleInboundWithParameterMapping);
        oSampleInboundWithNoParameterMapping.action = "toappwithnoparametermapping";
        oSampleInboundWithNoParameterMapping.parameterMapping = {};

        var oSampleInboundWithParameterMappingAndHideIntentLink = jQuery.extend(true, {}, oSampleInboundWithParameterMapping);
        oSampleInboundWithParameterMappingAndHideIntentLink.hideIntentLink = true;

        var oSampleInboundNoPars = {
            "action": "toappnopar",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithHideIntentLink = jQuery.extend(true, {}, oSampleInboundNoPars);
        oSampleInboundWithHideIntentLink.hideIntentLink = "propagatedValue"; // should be true or false in theory, but we test it's propagated as is
        oSampleInboundWithHideIntentLink.action = "tohiddentm";

        var oSampleInboundIgnoredPars = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "P1": { "required": true }
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInbound = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1REQ": { "required": true },
                    "P2DEF": { "defaultValue": { "value": "V2Default" }, "required": false },
                    "P3Filter": { "filter": { "value": "P3FilterValue" }, "required": true },
                    "P4FilterRegex": { "filter": { "format": "regexp", "value": "(male)|(female)" }, "required": true }
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleStarInbound = {
            "semanticObject": "Action",
            "action": "*",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithExtendedUserDefault = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1REQ": { "required": true },
                    "P2DEF": { "defaultValue": { "value": "V2Default" }, "required": false },
                    "P3Filter": { "filter": { "value": "P3FilterValue" }, "required": true },
                    "P4FilterRegex": { "filter": { "format": "regexp", "value": "(male)|(female)" }, "required": true },
                    "P5ExtendedUserDefault": {
                        "defaultValue": {
                            "format": "reference",
                            "value": "UserDefault.extended.P5ExtendedUserDefault"
                        },
                        "required": false
                    }
                }
            },
            "title": "Application State Example (Icons)"
        };

        [
            {
                sShellHash: "#Action-toappstatesample?P1=val1&P2=val2",
                oInbound: oSampleInboundIgnoredPars,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1": ["val1"]
                    },
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {
                    },
                    "matches": true,
                    "inbound": oSampleInboundIgnoredPars
                }
            },
            {
                sShellHash: "#Action-hello",
                oInbound: oSampleStarInbound,
                expectedResult: {
                    "genericSO": false,
                    "inbound": oSampleStarInbound,
                    "matches": false,
                    "noMatchReason": "Action \"hello\" did not match"
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInbound,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "V2Default" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ]
                    },
                    "genericSO": false,
                    "defaultedParamNames": ["P2DEF"],
                    "resolutionResult": {},
                    "matches": true,
                    "inbound": oSampleInbound
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInbound,
                expectedResult: {
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {},
                    "matches": true,
                    "inbound": oSampleInbound,
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "AAA" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ]
                    }
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInboundWithExtendedUserDefault,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "AAA" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ],
                        "P5ExtendedUserDefault": [ { "format": "reference", "value": "UserDefault.extended.P5ExtendedUserDefault" } ]
                    },
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {},
                    "matches": true,
                    "inbound": oSampleInboundWithExtendedUserDefault
                }
            },
            {
                sShellHash: "#SO-act?ABC=3&DEF=6&/detail/1?A=B",
                oInbound: oSampleInbound,
                expectedResult: {
                    "genericSO": false,
                    "matches": false,
                    "noMatchReason": "Semantic object \"SO\" did not match",
                    "inbound": oSampleInbound
                }
            },
            {
                sShellHash: "#Action-toappnopar",
                oInbound: oSampleInboundNoPars,
                expectedResult: {
                    "matches": true,
                    "inbound": oSampleInboundNoPars,
                    "genericSO": false,
                    "intentParamsPlusAllDefaults": {},
                    "defaultedParamNames": [],
                    "resolutionResult": {
                    }
                }
            },
            {
                /*
                 * Test that if the intent matches with
                 * additionalParameters = "ignore", the sap- parameters
                 * are always appended to the returned URL.
                 */
                sShellHash: "#Action-toappstatesample?sap-client=120&sap-user=USER&P1=requiredToMatch",
                oInbound: oSampleInboundIgnoredPars,
                expectedResult: {
                    "matches": true,
                    "inbound": oSampleInboundIgnoredPars,
                    "genericSO": false,
                    "intentParamsPlusAllDefaults": {
                        "P1": [ "requiredToMatch" ],
                        "sap-client": [ "120" ],
                        "sap-user": [ "USER" ]
                    },
                    "defaultedParamNames": [],
                    "resolutionResult": {}
                }
            },
            {
                /*
                 * Test that hideIntentLink from the intent is not added to
                 * resolutionResult if present and set to true.
                 */
                 sShellHash: "#Action-tohiddentm",
                 oInbound: oSampleInboundWithHideIntentLink,
                 expectedResult: {
                     "inbound": oSampleInboundWithHideIntentLink,
                     "defaultedParamNames": [],
                     "genericSO": false,
                     "intentParamsPlusAllDefaults": {},
                     "matches": true,
                     "resolutionResult": { }
                 }
            }
        ].forEach(function (oFixture) {

            test("_matchToInbound: returns expected result when sShellHash is " + oFixture.sShellHash, function () {

                var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                    oParseSrvc = sap.ushell.Container.getService("URLParsing"),
                    oMatchResult,
                    oParsedShellHash;

                oParsedShellHash = oParseSrvc.parseShellHash(oFixture.sShellHash);
                oMatchResult = removeCountsAndSortString(oSrvc._matchToInbound(
                    oParsedShellHash,
                    oFixture.oInbound,
                    {} /* oKnownUserDefaultRefsIn */,
                    {} /* oMissingUserDefaultRefsOut */
                ));
                //compare full result but ignore property originalInbound
                deepEqual(oMatchResult, oFixture.expectedResult, "expected result was returned");
            });
        });

    })();

    [
        /*
         * _addDefaultParameterValues: tests default parameters are added correctly
         */
        {
            name: "all empty",
            actual: {},
            signatureParameters: {},
            expectedResult: {},
            expectedDefaultedParameterNames: []
        },
        {
            name: "add signature parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "V1" }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": ["V1"] }
        },
        {
            name: "no change",
            actual: { "P1": ["P1act"] },
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "V1" }
                }
            },
            expectedDefaultedParameterNames: [],
            expectedResult: { "P1": ["P1act"] }
        },
        {
            name: "merge parameters",
            actual: { "P1": ["P1act"] },
            signatureParameters: {
                "P2": {
                    defaultValue: { value: "V2" }
                }
            },
            expectedDefaultedParameterNames: ["P2"],
            expectedResult: {
                "P1": ["P1act"],
                "P2": ["V2"]
            }
        },
        {
            name: "add falsy parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: false }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [false] }
        },
        {
            name: "add empty parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "" }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [""] }
        },
        {
            name: "add undefined parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: {
                        value: undefined
                    }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [undefined] }
        },
        {
            name: "add reference parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: {
                        value: "UserDefault.someValue",
                        format: "reference"
                    }
                }
            },
            expectedDefaultedParameterNames: [],
            expectedResult: {
                "P1": [{
                    value: "UserDefault.someValue",
                    format: "reference"
                }]
            }
        },
        {
            name: "add reference and non-reference parameters",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "UserDefault.someValue", format: "reference" } },
                "P2": { defaultValue: { value: "Not a reference" } }
            },
            expectedDefaultedParameterNames: ["P2"],
            expectedResult: {
                "P1": [{ value: "UserDefault.someValue", format: "reference" }],
                "P2": ["Not a reference"]
            }
        },
        {
            name: "add empty default values from Inbound signature",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "" } }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: {
                "P1": [""]
            }
        },
        {
            name: "add empty default values from Inbound signature, explicit format",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "", format: "plain" } }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: {
                "P1": [""]
            }
        },
        {
            name: "add empty default values from intent parameter",
            actual: {
                "P1": [""]
            },
            signatureParameters: { },
            expectedDefaultedParameterNames: [],
            expectedResult: {
                "P1": [""]
            }
        }
    ].forEach(function(oFixture) {

        test("_addDefaultParameterValues: " + oFixture.name + " case", function () {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                aGotDefaultParameters = [],
                oResult = oSrvc._addDefaultParameterValues(oFixture.actual, oFixture.signatureParameters, {}, [], aGotDefaultParameters);

            deepEqual(oResult, oFixture.expectedResult, "expected result");
            deepEqual(aGotDefaultParameters.sort(), oFixture.expectedDefaultedParameterNames.sort(), "got expected default parameters");
        });
    });

    test("_addDefaultParameterValues: the user defaults reference array is filled correctly", function () {
        var oTmParams = {
                "Aparam": { defaultValue: { value: "UserDefault.paramA", format: "reference" } },
                "Bparam": { defaultValue: { value: "UserDefault.paramB", format: "reference" } }
            },
            oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
            aUserDefaultRefsIfMatch = [],
            aGotDefaultParameters = [];

        oSrvc._addDefaultParameterValues({} /* no intent params */, oTmParams, {}, aUserDefaultRefsIfMatch, aGotDefaultParameters);

        deepEqual(aUserDefaultRefsIfMatch.sort(), ["UserDefault.paramA",  "UserDefault.paramB"].sort(),
            "found expected parameters in user defaults reference array");
        deepEqual(aGotDefaultParameters.sort(), [].sort(), "got expected default parameters");
    });


    [ /*
       * _checkAdditionalParameters: tests this function for various input
       */
      { name : "none, allowed",
        Inbound: { signature : { additionalParameters : "allowed" }},
        params : "",
        expectedResult :  true },

      { name : "none, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed" }},
        params : "P1=1",
        expectedResult : true },

      { name : "same, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed",
        parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, notallowed",
        Inbound: { signature : { additionalParameters : "notallowed",
        parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, ignored",
        Inbound: { signature : { additionalParameters : "ignored", parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : true },

      { name : "same, spurious, notallowed",
        Inbound: { signature : { additionalParameters : "notallowed",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : false },

      { name : "same, spurious, ignored",
        Inbound: { signature : { additionalParameters : "ignored",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : true }

    ].forEach(function(oFixture) {

        test("_checkAdditionalParameters " + oFixture.name, function () {
            var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution"),
                oEffectiveParams = sap.ushell.Container.getService("URLParsing").parseParameters(oFixture.params),
                oResult;
            oResult = oSrvc._checkAdditionalParameters(oFixture.Inbound, oEffectiveParams);
            deepEqual(oResult, oFixture.expectedResult,"expected result");
        });
    });

    test("_addDefaultParameterValues", function () {
        var oSrvc = sap.ushell.Container.getService("ClientSideTargetResolution");

        var oTmParams = {
            "P1": { defaultValue: { value: "4" } },
            "P2": { defaultValue: { value: "3" } }
        };

        var oIntentParams = {
            "P1": ["A", "B"],
            "P1A": ["X"]
        };

        var oIntentParamsPlusDefaults,
            aGotDefaultParameterValues = [];

        oIntentParamsPlusDefaults = oSrvc._addDefaultParameterValues(oIntentParams, oTmParams, {}, [], aGotDefaultParameterValues);

        ok(oIntentParamsPlusDefaults.hasOwnProperty("P1"), " P1 present");
        ok(oIntentParamsPlusDefaults.hasOwnProperty("P2"), " P2 present");

        deepEqual(oIntentParamsPlusDefaults, {
            "P1": ["A", "B"],
            "P1A": ["X"],
            "P2": ["3"]
        }, " values");

        oIntentParams.P1.push("C");

        deepEqual(oIntentParamsPlusDefaults, {
            "P1": ["A", "B", "C"],
            "P1A": ["X"],
            "P2": ["3"]
        }, " currently shallow copy !");

        deepEqual(aGotDefaultParameterValues, ["P2"], "got expected default parameter values");
    });

    [
        /*
         * _getMatchingInbounds: checks match results are sorted as expected"
         */
        {
            testDescription: "one inbound matches",
            aFakeMatchResults: [
                // NOTE: not actual Inbound structure. We only use 'matches' and num
                // is random, used only for report purposes.
                { num: 34, matches: false },
                { num: 36, matches: true, inbound: { resolutionResult: { applicationType: "Something" }}},
                { num: 38, matches: false }
            ],
            expectedInbounds: [1] // zero-based index in aFakeInbounds
        },
        {
            testDescription: "no inbound matches",
            aFakeMatchResults: [
                { num: 24, matches: false },
                { num: 26, matches: false },
                { num: 25, matches: false }
            ],
            expectedInbounds: []
        },
        {
            testDescription: "multiple inbound match, longer names win",
            aFakeMatchResults: [
                // NOTE: applicationType determines the order here
                { num: 33, matches: true,  inbound: { resolutionResult: { applicationType: "Something" }}},
                { num: 35, matches: false },
                { num: 36, matches: true,  inbound: { resolutionResult: { applicationType: "SomethingExt" }}}
            ],
            expectedInbounds: [2, 0]
        },
        {
            testDescription: "multiple inbound match, reverse alphabetical order in tie-breaker",
            aFakeMatchResults: [
                // NOTE: applicationType determines the order here
                { num: 33, matches: true,  inbound: { resolutionResult: { applicationType: "A" }}},
                { num: 35, matches: false },
                { num: 36, matches: true,  inbound: { resolutionResult: { applicationType: "B" }}}
            ],
            expectedInbounds: [2, 0] // -> B then A
        },
        {
            testDescription: "priority is specified",
            aFakeMatchResults: [
                { num: 18, matches: true, priorityString: "B" , inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "A" , inbound: { resolutionResult: {} } },
                { num: 44, matches: true, priorityString: "C" , inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [2, 5, 1, 4, 0, 3]
        },
        {
            testDescription: "priority is specified",
            aFakeMatchResults: [
                { num: 44, matches: true, priorityString: "C" , inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "A" , inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "B" , inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [5, 3, 1, 0, 4, 2]
        },
        {
            testDescription: "priority is with numbers",
            aFakeMatchResults: [
                { num: 44, matches: true, priorityString: "101" , inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "000", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "120" , inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "999", inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "010" , inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "001", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [3, 2, 0, 4, 5, 1]
        },
        {
            testDescription: "realistic sort strings sorted with expected priority",
            aFakeMatchResults: [
                { num: 33, matches: true, priorityString: "x MTCH=003 MREQ=003 NFIL=002 NDEF=001 POT=004 RFRE=999" , inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "x MTCH=003 MREQ=003 NFIL=002 NDEF=001 POT=100 RFRE=999" , inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [1, 0]
        }

    ].forEach(function (oFixture) {
        var aFakeMatchResults = oFixture.aFakeMatchResults;
        asyncTest("_getMatchingInbounds: matching inbounds are returned in priority when " + oFixture.testDescription, function () {
            // Return fake adapter with inbounds in the fixture
            var oSrvc = createServiceWithInbounds([]),
                aExpectedMatchingTargets = oFixture.expectedInbounds.map(function (iIdx) {
                    return oFixture.aFakeMatchResults[iIdx];
                });

            sinon.stub(oSrvc, "_matchToInbound", function (oShellHash, oInbound, oKnownUserDefaultRefsIn, oMissingUserDefaultRefsOut) {
                return oInbound; // items of aFakeMappings
            });

            // Act 2
            var fnOnServiceInitialized = function () {

                oSrvc._getMatchingInbounds({}/* any parameter ok for the test*/, aFakeMatchResults).done(function (aMatchingInbounds) {
                    // Assert
                    strictEqual(Object.prototype.toString.call(aMatchingInbounds), "[object Array]", "an array was returned");

                    deepEqual(aMatchingInbounds, aExpectedMatchingTargets,
                        "inbounds that matched were returned in the promise");

                }).fail(function () {
                    ok(false, "promise was resolved");

                }).always(function () {
                    start();
                });
            };

            // Act 1
            oSrvc._ensureInbounds()
                .done(fnOnServiceInitialized)
                .fail(function () {
                    ok(false, "_ensureInbounds resolved a promise");
                    start();
                });
        });
    });

    [ //_mergeSimpleAndExtended
      {
          description: "simple and extended values",
          initialValueObject: {
              "value": "0", // numbers also have to be strings as part of a range
              "extendedValue": {
                  "Ranges" : [{ "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"}]
              }
          },
          expectedMergedObject: {
              "Ranges" : [
                  { "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"},
                  { "Sign" : "I", "Option": "EQ", "Low" : "0", "High" : null}
              ]
          }
      },
      {
          description: "simple value undefined",
          initialValueObject: {
              "value": undefined,
              "extendedValue": {
                  "Ranges" : [{ "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"}]
              }
          },
          expectedMergedObject: {
              "Ranges" : [
                  { "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"}
              ]
          }
      },
      {
          description: "simple value empty string",
          initialValueObject: {
              "value": "",
              "extendedValue": {
                  "Ranges" : [{ "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"}]
              }
          },
          expectedMergedObject: {
              "Ranges" : [
                  { "Sign" : "I", "Option": "EQ", "Low" : "A", "High" : "B"},
                  { "Sign" : "I", "Option": "EQ", "Low" : "", "High" : null}
              ]
          }
      },
      {
          description: "no extended value",
          initialValueObject: {
              "value": "0",
              "extendedValue": undefined
          },
          expectedMergedObject: {
              "Ranges" : [
                  { "Sign" : "I", "Option": "EQ", "Low" : "0", "High" : null}
              ]
          }
      },
      {
          description: "no extended value",
          initialValueObject: {
              "value": undefined,
              "extendedValue": undefined
          },
          expectedMergedObject: {}
      }
    ].forEach(function (oFixture) {
      test("_mergeSimpleAndExtended: " + oFixture, function() {
          var oSrvc = createServiceWithInbounds([]);
          deepEqual(oSrvc._mergeSimpleAndExtended(oFixture.initialValueObject),
              oFixture.expectedMergedObject, "merged as expected");
      });
    });

    [ //_mixAppStateIntoResolutionResultAndRename
        {
            description: "extendedDefaultParam in app state (parameters)",
            initialTarget: {
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "otherProperty": "foo", // keep unknown properties
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "defaultedParamNames" : ["extendedDefaultParam"],
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                selectionVariant : { Parameters : [{ "PropertyName" : "extendedDefaultParam", "PropertyValue" :  "value1" }]}
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                selectionVariant : { Parameters : [{ "PropertyName" : "extendedDefaultParam", "PropertyValue" :  "value1" }]}
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "no extendedDefaultParam in app state (root members do not count!)",
            initialTarget: {
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "otherProperty": "foo", // keep unknown properties
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "extendedDefaultParam": "value1"
            },
            newAppStateCreated: true,
            expectedAppStateData: {
                "extendedDefaultParam": "value1",
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters" : [],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges": [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    ],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            expectedDefaultedParamNames : ["extendedDefaultParam"],
            expectedMappedDefaultedParamNames : ["extendedDefaultParam"]
        },
        {
            description: "extendedDefaultParam in app state (selectionVariant.Parameters)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "param1": "value1",
                "selectionVariant" : {
                    "Parameters" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "PropertyValue" : "appStateValue"
                        }
                    ]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant" : {
                    "Parameters" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "PropertyValue" : "appStateValue"
                        }
                    ]
                }
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "extendedDefaultParam in app state 1 (selectionVariant.SelectOptions)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "param1": "value1",
                "selectionVariant" : {
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant" : {
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        }
                    ]
                }
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "extendedDefaultParam in app state 2  (selectionVariant.SelectOptions)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "param1": "value1",
                "selectionVariant" : {
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant" : {
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        }
                    ]
                }
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "app state present, but no user default values maintained",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": [], // if no value is found, this array is empty!
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {}
                }
            },
            initialAppStateData : {
                "param1": "value1"
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1"
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "existing app state (combined) not overwritten",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam1" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                            "extendedDefaultParam2" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                            "extendedDefaultParam3" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1","extendedDefaultParam2","extendedDefaultParam3"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam1" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    },
                    "extendedDefaultParam2" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    },
                    "extendedDefaultParam3" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam1" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam2" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam3" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "param1": "value1",
                "selectionVariant" : {
                    "Parameters" : [
                        {
                            "PropertyName" : "extendedDefaultParam2",
                            "PropertyValue" : "appStateValue2"
                        },
                        {
                            "PropertyName" : "param2",
                            "PropertyValue" : "value2"
                        }
                    ],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam1",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "extendedDefaultParam3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "value3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "100", "High" : "900"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "1234", "High" : null}
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "extendedDefaultParam1": "appStateValue1",
                "selectionVariant" : {
                    "Parameters" : [
                        {
                            "PropertyName" : "extendedDefaultParam2",
                            "PropertyValue" : "appStateValue2"
                        },
                        {
                            "PropertyName" : "param2",
                            "PropertyValue" : "value2"
                        }
                    ],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam1",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "extendedDefaultParam3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "value3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "100", "High" : "900"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "1234", "High" : null}
                            ]
                        }
                    ]
                }
            },
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        },
        {
            description: "existing app state with undefined content (e.g. expired or could not be retrieved)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam1" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam1" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam1" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        }
                    }
                }
            },
            initialAppStateData : undefined,
            newAppStateCreated: true,
            expectedAppStateData: {
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters" : [],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam1",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    ],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            expectedDefaultedParamNames : ["extendedDefaultParam1"],
            expectedMappedDefaultedParamNames : ["extendedDefaultParam1"]
        },
        {
            description: "existing app state (combined) merged with defaults",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam1" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                            "extendedDefaultParam2" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                            "extendedDefaultParam3" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames" : ["extendedDefaultParam1","extendedDefaultParam2","extendedDefaultParam3"],
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam1" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    },
                    "extendedDefaultParam2" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    },
                    "extendedDefaultParam3" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["EXSISTINGKEY"],
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam1" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam2" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam3" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        }
                    }
                }
            },
            initialAppStateData : {
                "param1": "value1",
                "selectionVariant" : {
                    "Parameters" : [
                        {
                            "PropertyName" : "param2",
                            "PropertyValue" : "value2"
                        }
                    ],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam1",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "value3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "100", "High" : "900"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "1234", "High" : null}
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: true,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters" : [
                        {
                            "PropertyName" : "param2",
                            "PropertyValue" : "value2"
                        }
                    ],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam1",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "1", "High" : "9"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "123", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "value3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "100", "High" : "900"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "1234", "High" : null}
                            ]
                        },
                        {
                            "PropertyName" : "extendedDefaultParam2",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        {
                            "PropertyName" : "extendedDefaultParam3",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        }
                    ],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedDefaultedParamNames : ["extendedDefaultParam2","extendedDefaultParam3"],
            expectedMappedDefaultedParamNames : ["extendedDefaultParam2","extendedDefaultParam3"]
        },
        {
            description: "no app state present",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults" : {
                    "simpleDefaultParam" : ["simpleValue"],
                    "extendedDefaultParam" : {
                        "Ranges" : [
                            {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                            {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "simpleDefaultParam" : ["simpleValue"]
                },
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {
                        "extendedDefaultParam" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    }
                }
            },
            initialAppStateData : undefined,
            newAppStateCreated: true,
            expectedAppStateData: {
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters": [],
                    "SelectOptions" : [
                        {
                            "PropertyName" : "extendedDefaultParam",
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "BT", "Low" : "A", "High" : "Z"},
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null}
                            ]
                        }
                    ],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            expectedDefaultedParamNames : ["extendedDefaultParam"],
            expectedMappedDefaultedParamNames : ["extendedDefaultParam"]
        },
        {
            description: "no app state and no user defaults present",
            defaultedParamNames : undefined, // not relevant
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound" : {
                    "signature" : {
                        "parameters" : {
                            "extendedDefaultParam" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                        }
                    }
                },
                "defaultedParamNames": [], // if value is undefined, this is empty
                "intentParamsPlusAllDefaults" : {},
                "mappedIntentParamsPlusSimpleDefaults" : {},
                "resolutionResult" : {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers" : {}
                }
            },
            initialAppStateData : undefined,
            newAppStateCreated: false,
            expectedAppStateData: undefined,
            expectedDefaultedParamNames : [],
            expectedMappedDefaultedParamNames : []
        }
    ].forEach(function (oFixture) {
        asyncTest("_mixAppStateIntoResolutionResultAndRename with " + oFixture.description, function() {
            var oExpectedTarget = jQuery.extend(true, {}, oFixture.initialTarget),
                oAppStateSrvc = sap.ushell.Container.getService("AppState"),
                oSrvc = createServiceWithInbounds([]),
                oNewAppStateData, // modified by oNewFakeAppState
                oNewFakeAppState = {
                    _data: undefined, // simplyfies the test
                    setData: function (oData) {
                        oNewAppStateData = oData;
                    },
                    getData: function () {
                        return oNewAppStateData;
                    },
                    save: function () {
                        var oDeferred = new jQuery.Deferred();
                        // resolve appstate object async
                        setTimeout(function () {
                            oDeferred.resolve();
                        }, 0);
                        return oDeferred.promise();
                    },
                    getKey: function () {
                        return "NEWKEY";
                    }
                };

            function getFakeAppState(sKey) {
                var oDeferred = new jQuery.Deferred();

                strictEqual(typeof sKey, "string", "getAppState: a string key provided");
                strictEqual(sKey, oFixture.initialTarget.intentParamsPlusAllDefaults["sap-xapp-state"][0],
                    "getAppState: correct key requested");

                // resolve appstate object async
                setTimeout(function () {
                    // TODO test reject
                    oDeferred.resolve({
                        getData : function () {
                            return oFixture.initialAppStateData;
                        }
                    });
                }, 0);

                return oDeferred.promise();
            }

            // restores for AppState service not needed as local bootstrap is done for each test
            sinon.stub(oAppStateSrvc, "getAppState", getFakeAppState);
            sinon.stub(oAppStateSrvc, "createEmptyAppState").returns(oNewFakeAppState);

            // initial and expected target do not differ very much
            if (oFixture.newAppStateCreated) {
                oExpectedTarget.intentParamsPlusAllDefaults["sap-xapp-state"] = ["NEWKEY"];
                oExpectedTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"] = ["NEWKEY"];
            }
            oExpectedTarget.defaultedParamNames = oFixture.expectedDefaultedParamNames;
            oExpectedTarget.mappedDefaultedParamNames = oFixture.expectedMappedDefaultedParamNames;

            // _mixAppStateIntoResolutionResultAndRename shall remove oNewAppStateMembers as it is not
            // needed afterwards anymore
            delete oExpectedTarget.resolutionResult.oNewAppStateMembers;
            oExpectedTarget.mappedDefaultedParamNames = oExpectedTarget.defaultedParamNames;

            oSrvc._mixAppStateIntoResolutionResultAndRename(oFixture.initialTarget, oAppStateSrvc)
                .done(function (oMatchingTarget) {
                    start();
                    if (oAppStateSrvc.createEmptyAppState.called) {
                        oAppStateSrvc.createEmptyAppState.args.forEach(function(a, index) {
                            equal(a[1],true, "createEmptyAppState invoked as transient true");
                        });
                    }
                    deepEqual(oMatchingTarget, oExpectedTarget, "modified target");
                    if (oFixture.newAppStateCreated) {
                        deepEqual(oNewAppStateData, oFixture.expectedAppStateData,
                            "new app state data as expected");
                        deepEqual(oNewAppStateData.selectionVariant.SelectOptions,
                            oFixture.expectedAppStateData.selectionVariant.SelectOptions,
                            "For better debugging: compare SelectOptions again");
                    } else {
                        ok(oAppStateSrvc.createEmptyAppState.notCalled, "No app state created");
                    }
                })
                .fail(function (sMsg) {
                    start();
                    ok(false, sMsg);
                });
        });
    });

    // unmergable app-state content leads to non-tampering with it.
    [
        { "content" : [], "description" : "content is array" },
        { "content" : 1234, "description" : "content is integer" },
        { "content" : "astring", "description" : "content is string" }
    ].forEach(function(oFixture1) {
        [
            {
                "description": "app state merged with " + oFixture1.description,
                "initialTarget": {
                    "otherProperty": "foo", // keep unknown properties
                    "inbound" : {
                        "signature" : {
                            "parameters" : {
                                "extendedDefaultParam1" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                                "extendedDefaultParam2" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }},
                                "extendedDefaultParam3" : { "defaultValue" : { "value": "UserDefault.extended.extendedDefaultParam", "format" : "reference" }}
                            }
                        }
                    },
                    "defaultedParamNames" : ["extendedDefaultParam1","extendedDefaultParam2","extendedDefaultParam3"],
                    "intentParamsPlusAllDefaults" : {
                        "sap-xapp-state" : ["EXSISTINGKEY"],
                        "simpleDefaultParam" : ["simpleValue"],
                        "extendedDefaultParam1" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam2" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        },
                        "extendedDefaultParam3" : {
                            "Ranges" : [
                                {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                            ]
                        }
                    },
                    "mappedIntentParamsPlusSimpleDefaults" : {
                        "sap-xapp-state" : ["EXSISTINGKEY"],
                        "simpleDefaultParam" : ["simpleValue"]
                    },
                    "resolutionResult" : {
                        "otherProperty": "foo", // keep unknown properties
                        "oNewAppStateMembers" : {
                            "extendedDefaultParam1" : {
                                "Ranges" : [
                                    {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                                ]
                            },
                            "extendedDefaultParam2" : {
                                "Ranges" : [
                                    {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                                ]
                            },
                            "extendedDefaultParam3" : {
                                "Ranges" : [
                                    {"Sign" : "I", "Option" : "EQ", "Low" : "ABC", "High" : null }
                                ]
                            }
                        }
                    }
                },
                initialAppStateData : oFixture1.content,
                newAppStateCreated: false,
                expectedAppStateData: oFixture1.content,
                expectedDefaultedParamNames : [],
                expectedMappedDefaultedParamNames : []
            }
        ].forEach(function (oFixture) {
            asyncTest("_mixAppStateIntoResolutionResultAndRename with corrupt appstate (resuse old appstate)" + oFixture.description, function() {
                var oExpectedTarget = jQuery.extend(true, {}, oFixture.initialTarget),
                    oAppStateSrvc = sap.ushell.Container.getService("AppState"),
                    oSrvc = createServiceWithInbounds([]),
                    oNewAppStateData, // modified by oNewFakeAppState
                    oNewFakeAppState = {
                        _data: undefined, // simplyfies the test
                        setData: function (oData) {
                            oNewAppStateData = oData;
                        },
                        getData: function () {
                            return oNewAppStateData;
                        },
                        save: function () {
                            var oDeferred = new jQuery.Deferred();
                            // resolve appstate object async
                            setTimeout(function () {
                                // TODO test reject
                                oDeferred.resolve();
                            }, 0);
                            return oDeferred.promise();
                        },
                        getKey: function () {
                            return "NEWKEY";
                        }
                    };

                function getFakeAppState(sKey) {
                    var oDeferred = new jQuery.Deferred();

                    strictEqual(typeof sKey, "string", "getAppState: a string key provided");
                    strictEqual(sKey, oFixture.initialTarget.intentParamsPlusAllDefaults["sap-xapp-state"][0],
                        "getAppState: correct key requested");

                    // resolve appstate object async
                    setTimeout(function () {
                        // TODO test reject
                        oDeferred.resolve({
                            getData : function () {
                                return oFixture.initialAppStateData;
                            }
                        });
                    }, 0);

                    return oDeferred.promise();
                }

                // restores for AppState service not needed as local bootstrap is done for each test
                sinon.stub(oAppStateSrvc, "getAppState", getFakeAppState);
                sinon.stub(oAppStateSrvc, "createEmptyAppState").returns(oNewFakeAppState);

                // initial and expected target do not differ very much
                if (oFixture.newAppStateCreated) {
                    oExpectedTarget.intentParamsPlusAllDefaults["sap-xapp-state"] = ["NEWKEY"];
                    oExpectedTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"] = ["NEWKEY"];
                }
                oExpectedTarget.defaultedParamNames = oFixture.expectedDefaultedParamNames;
                oExpectedTarget.mappedDefaultedParamNames = oFixture.expectedMappedDefaultedParamNames;

                // _mixAppStateIntoResolutionResultAndRename shall remove oNewAppStateMembers as it is not
                // needed afterwards anymore
                delete oExpectedTarget.resolutionResult.oNewAppStateMembers;
                oExpectedTarget.mappedDefaultedParamNames = oExpectedTarget.defaultedParamNames;

                oSrvc._mixAppStateIntoResolutionResultAndRename(oFixture.initialTarget, oAppStateSrvc)
                    .done(function (oMatchingTarget) {
                        start();
                        ok(true, "expected rejection");
                        deepEqual(oMatchingTarget, oExpectedTarget, "modified target");
                        if (oFixture.newAppStateCreated) {
                            deepEqual(oNewAppStateData, oFixture.expectedAppStateData,
                                "new app state data as expected");
                            deepEqual(oNewAppStateData.selectionVariant.SelectOptions,
                                oFixture.expectedAppStateData.selectionVariant.SelectOptions,
                                "For better debugging: compare SelectOptions again");
                        } else {
                            ok(oAppStateSrvc.createEmptyAppState.notCalled, "No app state created");
                        }
                    })
                    .fail(function (sMsg) {
                        start();
                        ok(false, sMsg);
                        deepEqual(sMsg, "bad application state content", "x");
                    });
            });
        });
    });

    [
        { description: "undefined"                               , value: undefined  , expectedValue: undefined },
        { description: "floating point"                          , value: "+100.8"   , expectedValue: 100 }      ,
        { description: "integer"                                 , value: "10"       , expectedValue: 10  }      ,
        { description: "scientific notation"                     , value: "1.23E+5"  , expectedValue: 1   }      ,
        { description: "positive number with trailing characters", value: "+10ABC"   , expectedValue: 10  }      ,
        { description: "negative number"                         , value: "-20"      , expectedValue: -20 }      ,
        { description: "Infinity"                                , value: "Infinity" , expectedValue: undefined },
        { description: "NaN"                                     , value: "NaN"      , expectedValue: undefined },
        { description: "-Infinity"                               , value: "-Infinity", expectedValue: undefined }
    ].forEach(function (oFixture) {
       test("_extractSapPriority works as expected when value is " + oFixture.description, function() {
           var obj = {},
               oSrvc = createServiceWithInbounds([]);

           oSrvc._extractSapPriority({ "sap-priority" : [oFixture.value]}, obj);
           equal(obj["sap-priority"], oFixture.expectedValue, "expected result");
       });
    });

    [
        {
            "description" : "diverse mappings",
            "oParameters" : {
                "A" : {"renameTo" : "ANew" },
                "B" : {"renameTo" : "ANew" },
                "D" : { "renameTo" : "C"},
                "C" : {},
                "E" : { }
            },
            expectedResults : {
                  "A" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
                  "B" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
                  "C" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
                  "D" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
                  "E" : {  renameTo : "E", "dominatedBy" : ["E" ] }
            }
        }
    ].forEach(function (oFixture) {
        test("_constructParameterDominatorMap when " + oFixture.description, function() {
            var obj = {},
                oSrvc = createServiceWithInbounds([]);

            obj = oSrvc._constructParameterDominatorMap(oFixture.oParameters);
            deepEqual(Object.keys(obj).sort(), Object.keys(oFixture.expectedResults).sort(), " keys appropriate");
            Object.keys(oFixture.expectedResults).forEach(function (sKey) {
                deepEqual(obj[sKey], oFixture.expectedResults[sKey]," entry for " + sKey + " identical");
            });
        });
    });

    [
     {
         "description" : " default is dropped",
         "oParameters" : {
             "A" : {"renameTo" : "ANew" },
             "B" : {"renameTo" : "ANew" }
         },
         aDefaultedParamNames : [ "B" ],
         oIntentParamsPlusAllDefaults : {
             "A" : ["1000"], "B": ["2000"]
         },
         expectedIntentParamsPlusAllDefaults : {
             "A" : [ "1000"]
         },
         expectedDefaultedParamNames :  [ ]
     },
     {
         "description" : " default is dropped irrespective of order",
         "oParameters" : {
             "A" : {"renameTo" : "ANew" },
             "B" : {"renameTo" : "ANew" }
         },
         aDefaultedParamNames : [ "A" ],
         oIntentParamsPlusAllDefaults : {
             "A" : ["1000"], "B": ["2000"]
         },
         expectedIntentParamsPlusAllDefaults : {
             "B" : [ "2000"]
         },
         expectedDefaultedParamNames :  [ ]
     },
     {
         "description" : " default is dropped in A->A, B->A ",
         "oParameters" : {
             "A" : { },
             "B" : {"renameTo" : "A" }
         },
         aDefaultedParamNames : [ "A" ],
         oIntentParamsPlusAllDefaults : {
             "A" : ["1000"], "B": ["2000"]
         },
         expectedIntentParamsPlusAllDefaults : {
             "B" : [ "2000"]
         },
         expectedDefaultedParamNames :  [ ]
     },
     {
         "description" : " both defaulted : retained",
         "oParameters" : {
             "A" : { },
             "B" : {"renameTo" : "A" }
         },
         aDefaultedParamNames : [ "A", "B" ],
         oIntentParamsPlusAllDefaults : {
             "A" : ["1000"], "B": ["2000"]
         },
         expectedIntentParamsPlusAllDefaults : {
             "A" : ["1000"], "B": ["2000"]
         },
         expectedDefaultedParamNames : [ "A", "B" ]
     },
     {
         "description" : " some combined cases",
         "oParameters" : {
             "A" : {"renameTo" : "ANew" },
             "B" : {"renameTo" : "ANew" },
             "D" : { "renameTo" : "C"},
             "C" : {},
             "E" : {},
             "F" : {}
         },
         aDefaultedParamNames : [ "A", "B", "C", "E", "F" ],
         oIntentParamsPlusAllDefaults : {
             "A" : [], "B": [], "C" : [], "D" : [], "E" : [], "F" : [], "ANew" : []
         },
         expectedIntentParamsPlusAllDefaults : {
             "A" : [],
             "B" : [],
             "D" : [],
             "E" : [],
             "F" : [],
             "ANew" : []
         },
         expectedDefaultedParamNames :  [ "A", "B", "E", "F" ]
     }
 ].forEach(function (oFixture) {
     test("_constructParameterDominatorMap when " + oFixture.description, function() {
         var oRes;
         var oSrvc = createServiceWithInbounds([]);
         var oParameterDominatorMap = oSrvc._constructParameterDominatorMap(oFixture.oParameters);
         oRes = oSrvc._removeSpuriousDefaultedValues(oFixture.oIntentParamsPlusAllDefaults,oFixture.aDefaultedParamNames, oParameterDominatorMap);
         deepEqual(oRes.intentParamsPlusAllDefaults, oFixture.expectedIntentParamsPlusAllDefaults," intent params ok");
         deepEqual(oRes.defaultedParamNames, oFixture.expectedDefaultedParamNames," defaulted Param Names ok");
     });
 });



    [
        /*
         * General tests for _getMatchingInbounds
         *
         * testDescription: {string}:
         *   describes the test case (not what the test should do!).
         *
         * oParsedShellHash: {object}:
         *   the parsed intent
         *
         * aInbounds: {object}
         *   inbounds to match against
         *
         * mockedUserDefaultValues: {object}
         *   any mocked known user default value
         *
         * expected: {object[]} or {number[]}
         *  - when {object[]}:
         *     array of *matching results*. This is checked 1:1
         *     with deepEqual.
         *
         *  - when {number[]}:
         *     array of 0-based indices into aInbounds. In this case the
         *     test will deepEqual only the "inbound" entry in the
         *     matching result object.
         *
         * NOTE: this test does not check for the sort string or count
         *       parameters. Use test for sort string instead.
         */
        {
            testDescription: "generic semantic object specified in intent",
            oParsedShellHash: {
                "semanticObject": undefined,
                "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "ObjectA", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "ObjectB", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } },
                        user: { required : false, defaultValue: { value : "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1, 0]
        },
        {
            testDescription: "generic action specified in intent",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": undefined,
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "actionA",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object", action: "actionB",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } },
                        user: { required : false, defaultValue: { value : "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1, 0]
        },
        {
            testDescription: "* specified in intent semantic object",
            oParsedShellHash: {
                "semanticObject": "*", // treated as a literal "*"
                "action": undefined,
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "*", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } },
                        user: { required : false, defaultValue: { value : "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0]
        },
        {
            testDescription: "* specified in intent action",
            oParsedShellHash: {
                "semanticObject": undefined,
                "action": "*",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object", action: "*",
                    signature: { parameters: {
                        currency: { required : true, filter: { value : "EUR" } },
                        user: { required : false, defaultValue: { value : "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1]
        },
        {
            testDescription: "a filter reference is specified",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { format : "reference", value : "UserDefault.currency" } }
                    }},
                    title: "Currency manager",
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "EUR" },
            expected: [{
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                    "currency": [ "EUR" ]
                },
                "defaultedParamNames": [],
                "matches": true,
                "inbound": {
                    "title": "Currency manager",
                    "action": "action",
                    "semanticObject": "Object",
                    "signature": {
                        "parameters": {
                            currency: { required : true, filter: { format : "reference", value : "UserDefault.currency" } }
                        }
                    },
                    "resolutionResult": { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                "resolutionResult": { } // title not propagated in early resolution result
            }]
        },
        {
            testDescription: "user default service provides non-matching parameter",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { format : "reference", value : "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "GBP" }, // NOTE: GBP does not match filter
            expected: []
        },
        {
            testDescription: "user default service cannot provide a default value for filter reference",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true, filter: { format : "reference", value : "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "other": "uselessValue" },
            expected: []
        },
        {
            testDescription: "default reference value is provided by UserDefaultParameters service",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {}
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : false, defaultValue: { format : "reference", value : "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "EUR" },
            expected: [{
               "genericSO": false,
               "intentParamsPlusAllDefaults": {
                   currency: ["EUR"]
               },
               "defaultedParamNames": ["currency"],
               "matches": true,
               "resolutionResult": { }, // no title propagated yet in Early resolution result
               "inbound": {
                   "action": "action",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "Object",
                   "signature": {
                       "parameters": {
                            "currency": { required : false, defaultValue: { format : "reference", value : "UserDefault.currency" } }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "unknown default reference",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {} // note, no parameter given
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : false, defaultValue: { format : "reference", value : "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { /* no known values */ },
            expected: [{
               "genericSO": false,
               "intentParamsPlusAllDefaults": {}, // no default parameter
               "matches": true,
               "defaultedParamNames": [],
               "resolutionResult": {}, // no title propagated yet in Early resolution result
               "inbound": {
                   "action": "action",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "Object",
                   "signature": {
                       "parameters": {
                            "currency": { required : false, defaultValue: { format : "reference", value : "UserDefault.currency" } }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "a default reference and a filter reference are known",
            oParsedShellHash: {
                "semanticObject": "Currency", "action": "app",
                "params": {}
            },
            aInbounds: [
                {
                    semanticObject: "*", action: "app",
                    signature: { parameters: {
                        mode: {
                            required : false,
                            defaultValue: { format : "reference", value: "UserDefault.mode" },
                            filter: { format: "reference", value: "UserDefault.currencyAppMode" }
                        }
                    }},
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                },
                {
                    semanticObject: "*", action: "app",
                    signature: { parameters: {
                        mode: {
                            required : false,
                            defaultValue: { format : "reference", value: "UserDefault.mode" },
                            filter: { format: "reference", value: "UserDefault.carsAppMode" }
                        }
                    }},
                    resolutionResult: {
                        text: "Cars manager",
                        ui5ComponentName: "Cars.Component",
                        url: "/url/to/cars",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Cars.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {
                "mode": "desktop",  // user specific preference
                "currencyAppMode": "desktop",
                "carsAppMode": "mobile"
            },
            expected: [{
               "genericSO": true,
               "intentParamsPlusAllDefaults": {
                   "mode": ["desktop"]
               },
               "defaultedParamNames": ["mode"],
               "matches": true,
               "resolutionResult": { },
               "inbound": {
                   "action": "app",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "*",
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { format : "reference", value: "UserDefault.mode" },
                               "filter": { format: "reference", value: "UserDefault.currencyAppMode" }
                           }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "sap-ushell-defaultedParameterNames is specified",
            oParsedShellHash: {
                "semanticObject": "Currency", "action": "app",
                "params": {
                   "sap-ushell-defaultedParameterNames": ["will", "be", "ignored"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Currency", action: "app",
                    signature: {
                        parameters: {},
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [], // NOTE: no sap- param!
                "genericSO": false,
                "intentParamsPlusAllDefaults": {},
                "matches": true,
                "resolutionResult": { },
                "inbound": {
                  "action": "app",
                  "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "URL",
                    "text": "Currency manager",
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                  },
                  "semanticObject": "Currency",
                  "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {}
                  }
                }
            }]
        },
        {
            testDescription: "one inbound default parameter is in the intent",
            oParsedShellHash: {
                "semanticObject": "Currency", "action": "app",
                "params": {
                   "intentParam1": ["ipv1"],
                   "overlappingParam3": ["ipv2"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Currency", action: "app",
                    signature: {
                        parameters: {
                            "defaultParam1":     { required: false, defaultValue: { value: "dv1" } },
                            "defaultParam2":     { required: false, defaultValue: { value: "dv2" } },
                            "overlappingParam3": { required: false, defaultValue: { value: "dv3" } }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [
                  "defaultParam1",
                  "defaultParam2"
                ],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                  "defaultParam1": [
                    "dv1"
                  ],
                  "defaultParam2": [
                    "dv2"
                  ],
                  "intentParam1": [
                    "ipv1"
                  ],
                  "overlappingParam3": [
                    "ipv2"
                  ]
                },
                "matches": true,
                "resolutionResult": { },
                "inbound": {
                  "action": "app",
                  "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "URL",
                    "text": "Currency manager",
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                  },
                  "semanticObject": "Currency",
                  "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "defaultParam1":     { required: false, defaultValue: { value: "dv1" } },
                        "defaultParam2":     { required: false, defaultValue: { value: "dv2" } },
                        "overlappingParam3": { required: false, defaultValue: { value: "dv3" } }
                    }
                  }
                }
            }]
        },
        {
            /*
             * Inbounds with more defaulted parameters are a better fit
             * if nothing required had matched.
             */
            testDescription: "intent matches no filters and multiple inbounds with same SO-action are defined",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "additionalParameter": "hello"
                }
            },
            aInbounds: [
                { // #0 : this should not match because of the filter on company code
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            CompanyCode: {
                                required : true,
                                filter: {
                                    format : "plain",
                                    value: "1000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                {   // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=001 POT=001 RFRE=999
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                {   // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=002 POT=001 RFRE=999
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            },
                            default2: {  // extra default parameter -> more complex
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                {   // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=001 RFRE=999
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: { }
                    },  // no signature parameters -> simple.
                    resolutionResult: { }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [2, 1, 3]
        },
        {
            /*
             * Test matching with sap-priority
             */
            testDescription: "intent matches no filters and multiple inbounds with same SO-action are defined and sap-priority",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "additionalParameter": "hello"
                }
            },
            aInbounds: [
                { // #0 : this should not match because of the filter on company code
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            CompanyCode: {
                                required : true,
                                filter: {
                                    format : "plain",
                                    value: "1000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #1 : this matches and comes before negative inbounds with negative sap-priority
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // #2 : this matches and should come last, but sap-priority is specified so it comes first
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            },
                            "sap-priority" : {
                                defaultValue: { format : "plain", value : "50" }
                            },
                            default2: {  // extra default parameter -> more complex
                                required : false,
                                defaultValue: { format : "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // #3 : this comes last because of negative sap priority
                    semanticObject: "Object", action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "sap-priority" : {
                                defaultValue: { format : "plain", value : "-50" }
                            }
                        }
                    },  // no signature parameters -> simple.
                    resolutionResult: { }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [
                2,  // sap-priority: 50
                1,  // no sap priority
                3   // sap-priority: -50
            ]
        },
        {
            /*
             * Here we test that the most detailed inbound that suits
             * the filter is chosen among less detailed/complex ones. In this
             * case the "sap-app-id" contributes to the complexity of the
             * inbound which is then prioritized.
             */
            testDescription: "intent matches a filter and multiple inbounds with same SO-action are defined",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "CompanyCode": ["1000"]
                }
            },
            aInbounds: [
                { // #0
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required : true,
                                filter: {
                                    format : "plain",
                                    value: "1000"     // Company code matches this filter
                                }
                            },
                            "sap-app-id": {   // higher complexity, inbound will be prioritized
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #1
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required : true,
                                filter: {
                                    format : "plain",
                                    value: "1000"  // Company code matches this filter, but this inbound is less complex to be prioritized
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #2
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required : true,
                                filter: {
                                    format : "plain",
                                    value: "2000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY2000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0, 1]
        },
        {
            testDescription: "required parameter in inbounds without value or defaultValue",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: { parameters: {
                        currency: { required : true }
                    }},
                    resolutionResult: { text: "Currency manager"
                    //    ui5ComponentName: "Currency.Component",
                    //    url: "/url/to/currency",
                    //    applicationType: "URL",
                    //    additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0]
        },
        {
            testDescription: "no additional parameters are allowed and inbound signatures indicates non-required parameter",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": {} // no parameter specified
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            flag: {}  // short notation for required: false
                        },
                        additionalParameters: "notallowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {},
                "matches": true,
                "resolutionResult": { },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        "additionalParameters": "notallowed",
                        "parameters": {
                            "flag": {}
                        }
                    }
                }
            }]
        },
        {
            testDescription: " defaulted parameters are mapped to same target A->ANew & B renameTo ANew, both defaulted",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": { }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            "A" : { "renameTo" : "ANew", "defaultValue" : { "value" : "ADefaulted" } },
                            "B" : { "renameTo" : "ANew", "defaultValue" : { "value" : "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [ "A", "B" ],
                "genericSO": false,
                "intentParamsPlusAllDefaults":  {
                    "A": [
                          "ADefaulted"
                    ],
                    "B": [
                          "BDefaulted"
                    ]
                },
                "matches": true,
                "resolutionResult": { },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        parameters: {
                            "A" : { "renameTo" : "ANew", "defaultValue" : { "value" : "ADefaulted" } },
                            "B" : { "renameTo" : "ANew", "defaultValue" : { "value" : "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    }
                }
            }]
        },
        {
            testDescription: " defaulted parameters are mapped to same target A->ANew & B renameTo ANew, B defaulted, A supplied",
            oParsedShellHash: {
                "semanticObject": "Object", "action": "action",
                "params": { "A" : [ "Avalue"] }
            },
            aInbounds: [
                {
                    semanticObject: "Object", action: "action",
                    signature: {
                        parameters: {
                            "A" : { "renameTo" : "ANew"},
                            "B" : { "renameTo" : "ANew",
                                    "defaultValue" : { "value" : "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [],
                "genericSO": false,
                "intentParamsPlusAllDefaults":  {
                    "A": [
                          "Avalue"
                         ]
            // B Not present!
                      },
                "matches": true,
                "resolutionResult": { },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        parameters: {
                            "A" : { "renameTo" : "ANew"},
                            "B" : { "renameTo" : "ANew",
                                    "defaultValue" : { "value" : "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    }
                }
            }]
        }
    ].forEach(function(oFixture) {
        asyncTest("_getMatchingInbounds: works as expected when " + oFixture.testDescription, function () {

            var oSrvc = createServiceWithInbounds([]/* not needed for this test */),
                fnRealGetService = sap.ushell.Container.getService;

            // Mock User Defaults service
            sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
                if (sServiceName === "UserDefaultParameters") {
                    return { // a fake UserDefaultParameters service
                        getValue: function (sValueName) {
                            return new jQuery.Deferred().resolve({
                                value: oFixture.mockedUserDefaultValues[sValueName]
                            }).promise();
                        }
                    };
                }
                // else
                return fnRealGetService(sServiceName);
            });

            oSrvc._getMatchingInbounds(oFixture.oParsedShellHash, oFixture.aInbounds)
                .done(function (aMatchingResults) {
                    ok(true, "promise was resolved");

                    if (!jQuery.isEmptyObject(oFixture.mockedUserDefaultValues)) {
                        ok(sap.ushell.Container.getService.calledWith("UserDefaultParameters"), "the UserDefaultParameters service was invoked");
                    }

                    /*
                     * This test allows to compare inbounds by ids if
                     * integers are specified in the expectation.
                     */
                    if (oFixture.expected.every(function (vArrayItem) {
                        return typeof vArrayItem === "number";
                    })) {
                        // compare only inbound results
                        var aExpectedInbounds = oFixture.expected.map(function (iResultNumber) {
                                return oFixture.aInbounds[iResultNumber];
                            }),
                            aGotInbounds = aMatchingResults.map(function (oMatchResult) {
                                return oMatchResult.inbound;
                            });

                        deepEqual(aGotInbounds, aExpectedInbounds, "match results reference expected inbounds");
                    } else {
                        // compare full result but ignore property originalInbound
                        deepEqual(removeCountsAndSortString(aMatchingResults),
                            oFixture.expected, "got expected matching results");
                    }
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    [
       {
          testBehavior: "logs when intent is being matched",
          testDescription: "an intent is being matched",
          testLogLevel: [I_DEBUG, I_TRACE],
          aPotentialResults: [],
          aPreciseResults: [],
          expectedLogArgs: [
             [/Matching intent .*#SampleObject-sampleAction.*with parameters(.|\n)*p1(.|\n)*v1/, null, "sap.ushell.services.ClientSideTargetResolution"],
             ["The intent did not match any inbounds", null, "sap.ushell.services.ClientSideTargetResolution"]
         ]
       },
       {
           testBehavior: "logs no match reasons",
           testDescription: "inbound did not match",
           testLogLevel: [I_TRACE],
           aPotentialResults: [{
               matches: false,
               noMatchReason: "Action did not match",
               noMatchDebug: "sampleAction",
               inbound: {
                   semanticObject: "sampleSemanticObject",
                   action: "anotherAction"
               }
           }],
           aPreciseResults: [],
           expectedLogArgs: [
              [/Action did not match(.|\n)*#sampleSemanticObject-anotherAction|sampleAction/, null, "sap.ushell.services.ClientSideTargetResolution"]
           ]
        },
        {
            testBehavior: "logs full match result",
            testDescription: "inbound matches without resolution result",
            testLogLevel: [I_DEBUG],
            oMissingUserDefaults: {name: true},
            oUserDefaultValues: {name: "value"},
            aPotentialResults: [{
                matches: true,
                inbound: {
                    semanticObject: "sampleSemanticObject",
                    action: "sampleAction"
                }
            }],
            aPreciseResults: [{
                 matches: true,
                 inbound: {
                     semanticObject: "sampleSemanticObject",
                     action: "sampleAction"
                 }
            }],
            expectedLogArgs: [
                ["A rematch is required because one or more user defaults need to be determined.", null, "sap.ushell.services.ClientSideTargetResolution"],
                ["Rematching with resolved user defaults.", null, "sap.ushell.services.ClientSideTargetResolution"],
                [/Intent has matched the following inbounds(.|\n)*#sampleSemanticObject-sampleAction/, /Top matched inbound resolves to(.|\n)*matches.*true(.|\n)*sampleAction/, "sap.ushell.services.ClientSideTargetResolution"]
            ]
        },
        {
           testBehavior: "logs rematch required",
           testDescription: "user defaults are found after first round of matching",
           testLogLevel: [I_DEBUG],
           oMissingUserDefaults: {name: true},
           oUserDefaultValues: {name: "value"},
           aPotentialResults: [{
               matches: true,
               inbound: {
                   semanticObject: "sampleSemanticObject",
                   action: "sampleAction"
               }
           }],
           aPreciseResults: [{
                matches: true,
                inbound: {
                    semanticObject: "sampleSemanticObject",
                    action: "sampleAction"
                },
                resolutionResult: { url: "sampleUrl" }
           }],
           expectedLogArgs: [
               ["A rematch is required because one or more user defaults need to be determined.", null, "sap.ushell.services.ClientSideTargetResolution"],
               ["Rematching with resolved user defaults.", null, "sap.ushell.services.ClientSideTargetResolution"],
               [
                /Intent has matched the following inbounds(.|\n)*#sampleSemanticObject-sampleAction/,
                "\nTop matched inbound resolves to:{\n   \"url\": \"sampleUrl\"\n}",
                "sap.ushell.services.ClientSideTargetResolution"
               ]
           ]
        },
        {
            testBehavior: "logs top matched result verbosely",
            testDescription: "user defaults are found after first round of matching",
            testLogLevel: [I_TRACE],
            oMissingUserDefaults: {name: true},
            oUserDefaultValues: {name: "value"},
            aPotentialResults: [{
                matches: true
            }],
            aPreciseResults: [{
                matches: true,
                inbound: {
                    semanticObject: "sampleSemanticObject",
                    action: "sampleAction",
                    resolutionResult: { url: "sampleUrl" }
                },
                resolutionResult: { url: "sampleUrl" }
            }],
            expectedLogArgs: [
                [/A rematch is required(.|\n)*name/, null, "sap.ushell.services.ClientSideTargetResolution"],
                [/Rematching with the following resolved user defaults(.|\n)*name.*value/, null, "sap.ushell.services.ClientSideTargetResolution"],
                [/Intent has matched the following inbounds(.|\n)*#sampleSemanticObject-sampleAction/,
                 /Top matched inbound resolves to:{(.|\n)*inbound(.|\n)*sampleAction(.|\n)*}/,
                 "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testBehavior: "logs top matched result verbosely",
            testDescription: "undefined user defaults are found after first round of matching",
            testLogLevel: [I_TRACE],
            oMissingUserDefaults: {name: true},
            oUserDefaultValues: {name: undefined},
            aPotentialResults: [{
                matches: true
            }],
            aPreciseResults: [{
                matches: true,
                inbound: {
                    semanticObject: "sampleSemanticObject",
                    action: "sampleAction",
                    resolutionResult: { url: "sampleUrl" }
                },
                resolutionResult: { url: "sampleUrl" }
            }],
            expectedLogArgs: [
                [/Rematching with the following resolved user defaults(.|\n)*name.*undefined/, null, "sap.ushell.services.ClientSideTargetResolution"]
            ]
        }
    ].forEach(function (oFixture) {
        oFixture.testLogLevel.forEach(function (iLogLevel) {
            asyncTest("_getMatchingInbounds: " + oFixture.testBehavior + " when " + oFixture.testDescription + " and log level is " + iLogLevel, function () {
                var oSrvc = createServiceWithInbounds([]),
                    oShellHash = {
                        semanticObject: "SampleObject",
                        action: "sampleAction",
                        params: { p1: ["v1"] }
                    },
                    aFakeInbounds = [],
                    oLogMock = sap.ushell.test.createLogMock().sloppy(true),
                    iMatchCount = -1,
                    fnAddLogMockExpectations;

                // Check logging expectations via LogMock
                fnAddLogMockExpectations = function (aExpectedLogArgs) { // avoid eslint nested callbacks
                    oLogMock.debug.apply(oLogMock, aExpectedLogArgs);
                };
                oFixture.expectedLogArgs.forEach(fnAddLogMockExpectations);

                // LogMock doesn't keep the following original methods
                jQuery.sap.log.getLevel = sinon.stub().returns(iLogLevel);
                jQuery.sap.log.Level = {
                    DEBUG: I_DEBUG,
                    TRACE: I_TRACE
                };

                // Provide stub without sinon in order to modify oMissingUserDefaults parameter
                oSrvc._matchToInbound = function (oShellHash, oInbound, oKnownUserDefaults, oMissingUserDefaults) {
                    var iPreciseResultIndex;
                    iMatchCount++;

                    iPreciseResultIndex = iMatchCount - oFixture.aPotentialResults.length;
                    // return results past the first round (once potential match set is returned)
                    if (iMatchCount > oFixture.aPotentialResults.length - 1) {
                        return iPreciseResultIndex >= oFixture.aPreciseResults.length ?
                            { matches: false }
                            : oFixture.aPreciseResults[iPreciseResultIndex];
                    }

                    // modify output parameter as per fixture
                    if (jQuery.isEmptyObject(oKnownUserDefaults) && jQuery.isEmptyObject(oMissingUserDefaults) ) {
                        jQuery.extend(true, oMissingUserDefaults, oFixture.oMissingUserDefaults);
                    }

                    // return potential results first (iMatchCount < aPotentialResults.length)
                    return oFixture.aPotentialResults[iMatchCount];
                };

                // There must be a inbound for each MatchResult in aPotentialResult array
                // (there is one call to _matchToInbound per inbound)
                oFixture.aPotentialResults.forEach(function (oResult, i) {
                    aFakeInbounds.push({ semanticObject: "Fake", action: i + "" });
                });

                sinon.stub(oSrvc, "_resolveAllReferences").returns(new jQuery.Deferred().resolve(oFixture.oUserDefaultValues).promise());

                oSrvc._getMatchingInbounds(oShellHash, aFakeInbounds)
                    .done(function (aMatchingResults) {
                        var iExpectedCallCount = jQuery.isEmptyObject(oFixture.oMissingUserDefaults || {}) ? oFixture.aPotentialResults.length
                            : 2 * oFixture.aPotentialResults.length;  // rematch triggered with user defaults

                        start();
                        ok(true, "promise was resolved");

                        strictEqual((iMatchCount + 1), iExpectedCallCount,
                            "_matchToInbound was called " + iExpectedCallCount + " times");

                        oLogMock.verify();
                     })
                     .fail(function () {
                        start();
                        ok(false, "promise was resolved");
                     });
            });
        });
    });

    asyncTest("_ensureInbounds: retrieves the inbounds once", function () {
        var aFakeInbounds = [];
        var oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve(aFakeInbounds).promise()
                )
            },
            oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter);

        jQuery.when(
            oSrvc._ensureInbounds(),
            oSrvc._ensureInbounds(),
            oSrvc._ensureInbounds()
        ).then(function (aTm1, aTm2, aTm3) {
            strictEqual(oFakeAdapter.getInbounds.callCount, 1, "the adapter getInbounds method was called once");
            aTm1.push("TEST");
            deepEqual(aTm1, aTm3, "the same inbound list is returned");
        }).always(start);
    });

    asyncTest("_ensureInbounds: fails if adapter does not implement method", function () {
        var oSrvc = new sap.ushell.services.ClientSideTargetResolution({
                // an adapter that does not implement getInbounds method
            });

        sinon.stub(jQuery.sap.log, "error");

        oSrvc._ensureInbounds()
            .done(function () {
                ok(false, "promise was rejected");
            })
            .fail(function () {
                ok(true, "promise was rejected");
                strictEqual(arguments.length, 0, "no arguments were passed to the fail handler");

                strictEqual(jQuery.sap.log.error.getCalls().length, 1,
                    "jQuery.sap.log.error was called 1 time");

                deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot get Inbounds",
                    "ClientSideTargetResolutionAdapter should implement getInbounds method",
                    "sap.ushell.services.ClientSideTargetResolution"
                ], "jQuery.sap.log.error was called with the expected arguments");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("_resolveHashFragment: promise is rejected when navigation target cannot be resolved client side", function () {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        var oSrvc = createServiceWithInbounds([]);

        // return empty -> cannot resolve matching targets
        sinon.stub(oSrvc, "_getMatchingInbounds").returns(new jQuery.Deferred().resolve([]).promise());

        oSrvc._resolveHashFragment("#hash-fragment", function () {} /*fallback*/)
            .done(function () {
                ok(false, "Promise was rejected");
            })
            .fail(function (sErrorMsg) {
                ok(true, "Promise was rejected");
                strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");
                strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was not called");
                strictEqual(sErrorMsg, "Could not resolve navigation target", "Rejected with expected message");
            })
            .always(function () {
                start();
            });

    });

    asyncTest("_resolveHashFragment: promise is rejected when _getMatchingInbounds rejects", function () {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        var oSrvc = createServiceWithInbounds([]);

        // rejects
        sinon.stub(oSrvc, "_getMatchingInbounds").returns(new jQuery.Deferred().reject("Deliberate failure"));

        oSrvc._resolveHashFragment("#hash-fragment", function () {} /*fallback*/)
            .done(function () {
                ok(false, "Promise was rejected");
            })
            .fail(function (sErrorMsg) {
                ok(true, "Promise was rejected");
                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was not called");
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                strictEqual(sErrorMsg, "Deliberate failure", "Rejected with expected message");
            })
            .always(function () {
                start();
            });

    });

    [
        {
            testDescription: "generic semantic object is passed",
            sIntent: "#*-action"
        },
        {
            testDescription: "empty semantic object is passed",
            sIntent: "#-action"
        },
        {
            testDescription: "* is passed in action",
            sIntent: "#Object-*"
        },
        {
            testDescription: "blank is passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        },
        {
            testDescription: "many blanks are passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        }
    ].forEach(function (oFixture) {

        asyncTest("_resolveHashFragment: rejects promise when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]);

            sinon.stub(jQuery.sap.log, "error");

            // returns the default parameter names after resolution
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve({
                    resolutionResult: {}  // causes _resolveHashFragment promise to be resolved (in case test fails)
                }).promise()
            );

            sinon.stub(sap.ushell.utils, "getFormFactor").returns("desktop");

            oSrvc._resolveHashFragment(oFixture.sIntent)
                .done(function (oResolutionResult) {
                    ok(false, "promise was rejected");
                })
                .fail(function () {
                    ok(true, "promise was rejected");
                    strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");

                    ok(jQuery.sap.log.error.getCall(0).args[0].indexOf("Could not parse shell hash") === 0,
                        "logged 'Could not parse shell hash ...'");
                })
                .always(function () {
                    start();
                });
        });
    });


    [
        {
            testName: "no inbounds are defined",
            inbounds: [],
            expectedParameters : { simple :{}, extended : {}}
        },
        {
            testName: "inbounds contain non-overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: true  },
                            "withUserDefault2": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true  }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true  },
                            "withUserDefault5": { filter: { value: "UserDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true  }
                        }
                    }
                }
            ],
            expectedParameters : {
                simple : {"value1" : {}, "value2"  : {}, "value3" : {}, "value4" : {},
                    "value5": {},
                    "value6": {}},
                extended : {}
            }
        },
        {
            testName: "inbounds contain other types of defaults",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: true  },
                            "withUserDefault2": { filter: { value: "MachineDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true  }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true  },
                            "withUserDefault5": { filter: { value: "SapDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true  }
                        }
                    }
                }
            ],
            expectedParameters : { simple : {"value1": {}, "value3": {}, "value4": {}, "value6": {}}, extended : {}}
        },
        {
            testName: "inbounds contain overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "withUserDefault2": { filter: { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "withUserDefault5": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters : { simple : {"value1" : {}, "value2"  : {}, "value3" : {}, "value4": {}}, extended : {}}
        },
        {
            testName: "inbounds contain no user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters : { simple : {}, extended : {}}
        },
        {
            testName: "inbounds contain a mix of filter values and user default values",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { defaultValue: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter:       { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter:        { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault4"  : { defaultValue : { value: "UserDefault.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple : { "value1": {}, "value2": {}, "value3": {}, "value4": {}}, extended : {} }
        }
    ].forEach(function (oFixture) {

        asyncTest("getUserDefaultParameterNames: returns default parameter names when " + oFixture.testName, function () {
            var oSrvc = createServiceWithInbounds(oFixture.inbounds),
                oParameterNamesPromise = oSrvc.getUserDefaultParameterNames();

            if (typeof oParameterNamesPromise.done !== "function") {
                ok(false, "getUserDefaultParameterNames returned a promise");
                start();
                return;
            }

            oParameterNamesPromise.done(function (oGotParameterNames) {
                deepEqual(oGotParameterNames, oFixture.expectedParameters, "obtained expected parameter names");
            }).always(function () {
                start();
            });
        });

    });

    asyncTest("getUserDefaultParameterNames: rejects promise when private method throws", function () {
        var oSrvc = createServiceWithInbounds([]),
            oParameterNamesPromise;

        sinon.stub(oSrvc, "_getUserDefaultParameterNames").throws("deliberate exception");

        oParameterNamesPromise = oSrvc.getUserDefaultParameterNames();

        oParameterNamesPromise
            .done(function (oGotParameterNames) {
                ok(false, "promise was rejected");
            })
            .fail(function (sErrorMessage) {
                ok(true, "promise was rejected");
                strictEqual(sErrorMessage, "Cannot get user default parameters from inbounds: deliberate exception", "obtained expected error message");
            })
            .always(function () {
                start();
            });
    });

    [
        {
            testName: "no inbounds are defined",
            inbounds: [],
            expectedParameters: { simple: {}, extended: {}}
        },
        {
            testName: "inbounds contain overlapping extended, not extended",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: true  },
                            "withUserDefault2": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true  }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value1", format: "reference" }, required: true  },
                            "withUserDefault5": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true  }
                        }
                    }
                }
            ],
            expectedParameters: { simple : {"value1":{}, "value2":{}, "value3": {}, "value6": {}},extended : {"value1":{}, "value2":{}}}
        },
        {
            testName: "inbounds contain other types of defaults",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "UserDefault.extended.valuex"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: true  },
                            "withUserDefault2": { filter: { value: "MachineDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true  }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true  },
                            "withUserDefault5": { filter: { value: "SapDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true  }
                        }
                    }
                }
            ],
            expectedParameters: { simple : {"value3":{}, "value4":{}, "value6":{}}, extended : {"value1":{}}}
        },
        {
            testName: "inbounds contain overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1"                    }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "withUserDefault2": { filter: { value: "UserDefault.extended.value3", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2"                    }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1"                 }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "withUserDefault5": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2"                 }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.extended.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple : {}, extended : {"value1":{}, "value2":{}, "value3":{}, "value4":{}}}
        },
        {
            testName: "inbounds contain no user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { filter: { value: "Some Value1" }, required: false },
                            "noUserDefault2"  : { filter: { value: "Some Value2" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter: { value: "Another Value1" }, required: false },
                            "noUserDefault4"  : { filter: { value: "Another Value2" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: {simple : {}, extended : {}}
        },
        {
            testName: "inbounds contain a mix of filter values and user default values",
            inbounds: [
                { semanticObject: "SomeObject", action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1"  : { defaultValue: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "noUserDefault2"  : { filter:       { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2", action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3"  : { filter:        { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault4"  : { defaultValue : { value: "UserDefault.extended.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: {simple : {"value2": {}, "value3":{}}, extended :{"value1":{}, "value4":{}}}
        }

    ].forEach(function (oFixture) {

        asyncTest("getUserDefaultParameterNames: (Extended) returns extended default parameter names when " + oFixture.testName, function () {
            var oSrvc = createServiceWithInbounds(oFixture.inbounds),
                oInboundListPromise = oSrvc.getUserDefaultParameterNames();

            if (typeof oInboundListPromise.done !== "function") {
                ok(false, "getUserDefaultParameterNames returned a promise");
                start();
                return;
            }

            oInboundListPromise.done(function (aObtainedInbounds) {
                deepEqual(aObtainedInbounds, oFixture.expectedParameters, "obtained expected parameter names");
            }).always(function () {
                start();
            });
        });

    });

    [
        { "description" : "1", input : "UserDefault.extended.A", o1 : undefined, o2 : "A" , o3 : "A"},
        { "description" : "2", input : "UserDefault.A", o1 : "A", o2 : undefined, o3 : "A" },
        { "description" : "3", input : "UserDefault.extended", o1 : "extended", o2 : undefined, o3 : "extended" },
        { "description" : "4", input : "UserDefaultA", o1 : undefined, o2 : undefined, o3 : undefined },
        { "description" : "5", input : "UserDefault.extendedB", o1 : "extendedB", o2 : undefined, o3 : "extendedB" },
        { "description" : "6", input : "UserDefault.extended.", o1 : undefined, o2 : "", o3 : "" },
        { "description" : "7", input : "UserDefault.", o1 : "", o2 : undefined , o3 : "" },
        { "description" : "8", input : "A.UserDefault.extended.AX", o1 : undefined, o2 : undefined, o3 : undefined }
    ].forEach(function(oFixture) {
        test("extractExtendUserDefaultName: " + oFixture.description, function () {
            var oSrvc = createServiceWithInbounds(oFixture.inbounds);
            var actual1 = oSrvc._extractUserDefaultReferenceName(oFixture.input);
            var actual2 = oSrvc._extractExtendedUserDefaultReferenceName(oFixture.input);
            equal(actual1, oFixture.o1, " _extractUserDefaultReferenceName ok");
            equal(actual2, oFixture.o2, " _extractExtendedUserDefaultReferenceName ok");
            var actual3 = oSrvc._extractAnyUserDefaultReferenceName(oFixture.input);
            equal(actual3, oFixture.o3, " _extractExtendedUserDefaultReferenceName ok");
        });
    });

    [
        {
            testDescription: "alphabetical order is expected in result",
            sSemanticObject: "Object",
            mBusinessParams: { "country": ["IT"] },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {  // simulate this result to have higher priority
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "semanticObject": "Object", "action": "bbb",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": {
                        "country": {
                            required: true
                        }
                      }}
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "semanticObject": "Object", "action": "ccc",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "semanticObject": "Object", "action": "aaa",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Object-aaa",
                    "text": "Currency manager" },
                { "intent": "#Object-bbb?country=IT",
                    "text": "Currency manager" },
                { "intent": "#Object-ccc",
                    "text": "Currency manager" }
            ]
        },
        {
            // multiple inbounds are filtered in this case as the URL looks the same
            testDescription: "multiple inbounds that look identical are matched",
            sSemanticObject: "Action",
            mBusinessParams: {},
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "semanticObject": "Action", "action": "actionX",
                       "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": {
                           "parameters": {
                               "mode": {
                                   "required": false,
                                   "defaultValue": { value: "DefaultValue1" } //  ignored in result
                               }
                           }
                       }
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "semanticObject": "Action", "action": "actionX",
                       "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": {
                           "parameters": { } // this inbound has not parameter
                       }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-actionX",   // note "?" removed from parameter
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "matching target exists and business parameters are specified",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1", // only return intent parameters that are mentioned in Inbound
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "matching target has default parameter that overlaps with intent parameter",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?ParamName1=value", // only ParamName1 is mentioned in Inbound
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "sap-system parameter specified in intent",
            sSemanticObject: "Action",
            mBusinessParams: { "sap-system": ["CC2"] },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "semanticObject": "Action", "action": "action1",
                   "title": "Currency manager",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?sap-system=CC2",
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "sap-system and other parameters specified in intent (additionalParameters: allowed)",
            sSemanticObject: "Action",
            mBusinessParams: {
                "sap-system": ["CC2"],
                "paramName1": ["paramValue1"],
                "paramName2": ["paramValue2"]
            },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "semanticObject": "Action", "action": "action1",
                   "title": "Currency manager",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "allowed", // non overlapping parameters added to result
                       "parameters": {
                           "paramName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?paramName1=paramValue1&paramName2=paramValue2&sap-system=CC2",
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "sap-system and other parameters specified in intent (additionalParameters: ignored)",
            sSemanticObject: "Action",
            mBusinessParams: {
                "sap-system": ["CC2"],
                "paramName1": ["paramValue1"],
                "paramName2": ["paramValue2"]
            },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "paramName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?paramName1=paramValue1&sap-system=CC2",
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "matching target has required parameter that overlaps with intent parameter",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName2": {
                               "required": true
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?ParamName2=value1&ParamName2=value2", // only ParamName2 is mentioned in Inbound
                    "text": "Currency manager" }
            ]
        },
        {
            testDescription: "function called with * semantic object",
            sSemanticObject: "*",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{ // a inbound with generic semantic object
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "*",
                   "action": "action",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [] // Inbound should be filtered out
        },
        {
            testDescription: "function called with empty string semantic object",
            sSemanticObject: "", // should match all
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{ // a inbound with generic semantic object
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "semanticObject": "*",
                   "action": "action",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [] // Inbound should be filtered out
        },
        {
            testDescription: "hideIntentLink is set to true",
            sSemanticObject: "Object",
            mBusinessParams: {},
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {  // has no hideIntentLink
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager A",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       // NOTE: no hideIntentLink set
                       "title": "Currency manager A",
                       "semanticObject": "Object",
                       "action": "actionA",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager A",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { } }
                   }
                },
                {  // same as the previous inbound but with hideIntentLink set
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager B",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       "hideIntentLink": true, // NOTE: this should be hidden in the result!
                       "title": "Currency manager B",
                       "semanticObject": "Object",
                       "action": "actionB",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager B",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { } }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                {
                    "intent": "#Object-actionA",
                    "text": "Currency manager A"
                }
            ]
        },
        {
            testDescription: "app state is provided as member",
            sSemanticObject: "Object",
            mBusinessParams: { "ab" : 1},
            sAppStateKey : "AS12345",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {  // has no hideIntentLink
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager A",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       // NOTE: no hideIntentLink set
                       "title": "Currency manager A",
                       "semanticObject": "Object",
                       "action": "actionA",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager A",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { "ab" : { required : true } } }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                {
                    "intent": "#Object-actionA?ab=1&sap-xapp-state=AS12345",
                    "text": "Currency manager A"
                }
            ]
        }
    ].forEach(function (oFixture) {

        asyncTest("getLinks: returns expected inbounds when " + oFixture.testDescription, function () {

            var oSrvc = createServiceWithInbounds([]);

            // Mock form factor
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.aMockedResolutionResults).promise()
            );

            if (oFixture.hasOwnProperty("sAction")) {
                // test 1.38.0+ behavior
                oSrvc.getLinks({
                    semanticObject: oFixture.sSemanticObject,
                    action: oFixture.sAction,
                    params: oFixture.mBusinessParams,
                    appStateKey : oFixture.sAppStateKey,
                    ignoreFormFactor: oFixture.bIgnoreFormFactor
                }) .done(function (aResultSemanticObjectLinks) {
                        // Assert
                        ok(true, "promise was resolved");
                        deepEqual(aResultSemanticObjectLinks, oFixture.expectedSemanticObjectLinks, "got expected array of semantic object links");
                    })
                    .fail(function () {
                        // Assert
                        ok(false, "promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
            } else {
                // test old style call and the new style call return the same results
                var mBusinessParamsAmended = jQuery.extend(true,{},oFixture.mBusinessParams);
                if (oFixture.sAppStateKey) {
                    mBusinessParamsAmended["sap-xapp-state"] = [ oFixture.sAppStateKey ];
                }
                oSrvc.getLinks(oFixture.sSemanticObject, mBusinessParamsAmended, oFixture.bIgnoreFormFactor)
                    .done(function (aResultSemanticObjectLinksOld) {
                        ok(true, "positional parameters call promise was resolved");

                        oSrvc.getLinks({
                            semanticObject: oFixture.sSemanticObject,
                            params: oFixture.mBusinessParams,
                            appStateKey : oFixture.sAppStateKey,
                            ignoreFormFactor: oFixture.bIgnoreFormFactor
                        }).done(function (aResultSemanticObjectLinksNew) {
                            ok(true, "nominal parameters call promise was resolved");

                            deepEqual(aResultSemanticObjectLinksNew, aResultSemanticObjectLinksOld,
                                "the new call with nominal parameters returns the same result as the call with positional parameters");

                            deepEqual(aResultSemanticObjectLinksNew, oFixture.expectedSemanticObjectLinks,
                                "the new call with positional parameters returns the expected results");

                            deepEqual(aResultSemanticObjectLinksOld, oFixture.expectedSemanticObjectLinks,
                                "the old call with positional parameters returns the expected results");
                        }).fail(function () {
                            ok(false, "nominal parameters call promise was resolved");
                        });
                    })
                    .fail(function () {
                        // Assert
                        ok(false, "positional parameters call promise was resolved");
                    })
                    .always(function () {
                        start();
                    });

            }


        });
    });

    (function () {
        var oBaseInbound = {
            "semanticObject": "SemanticObject",
            "action": "action",
            "title": "Title",
            "resolutionResult": {
                "applicationType": "SAPUI5",
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                "text": "Text",
                "ui5ComponentName": "sap.ushell.demo.Inbound",
                "applicationDependencies": {
                    "name": "sap.ushell.demo.Inbound",
                    "self": {
                        "name": "sap.ushell.demo.Inbound"
                    }
                },
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                "systemAlias": ""
            },
            "deviceTypes": {
                "desktop": true,
                "tablet": true,
                "phone": true
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            }
        };
        var oTestInbounds = {
            "basic": jQuery.extend(true, {}, oBaseInbound, {
                semanticObject: "Object",
                action: "action",
                tileResolutionResult: {
                    "key": "valueBasic" // any tileResolutionResult
                }
            }),
            "with_required_parameter_filter_value": jQuery.extend(true, {}, oBaseInbound, {
                semanticObject: "Object",
                action: "withParameters",
                tileResolutionResult: {
                    "key": "valueRequired"
                },
                signature: {
                    "additionalParameters": "notallowed",
                    "parameters": {
                        "P1": {
                            required: true,
                            filter: { value: "V1" }
                        }
                    }
                }
            })
        };

        [
            {
                testType: "success",  // the scenario under test
                testDescription: "no parameters inbound with tileResolutionResult section is provided",
                sIntent: "#Object-action",
                aInbounds: [oTestInbounds.basic],
                expectedResolutionResult: oTestInbounds.basic.tileResolutionResult
            },
            {
                testType: "success",
                testDescription: "inbound with parameters and tileResolutionResult section is provided",
                sIntent: "#Object-withParameters?P1=V1",
                aInbounds: [
                    oTestInbounds.basic,
                    oTestInbounds.with_required_parameter_filter_value
                ],
                expectedResolutionResult: oTestInbounds.with_required_parameter_filter_value.tileResolutionResult
            },
            {
                testType: "failure",
                testDescription: "invalid shell hash passed",
                sIntent: "#ObjectwithParameters?P1=V1",
                aInbounds: [],
                expectedRejectMessage: "Cannot parse shell hash",
                expectedErrorCallArgs: [
                    "Could not parse shell hash '#ObjectwithParameters?P1=V1'",
                    "please specify a valid shell hash",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            },
            {
                testType: "failure",
                testDescription: "_getMatchingInbounds fails",
                testSimulateFailingGetMatchingInbounds: true,
                sIntent: "#Object-action",
                aInbounds: [],
                expectedRejectMessage: "Deliberate failure",
                expectedErrorCallArgs: [
                    "Could not resolve #Object-action",
                    "_getMatchingInbounds promise rejected with: Deliberate failure",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            },
            {
                testType: "failure",
                testDescription: "there are no matching targets",
                sIntent: "#Object-action",
                aInbounds: [], // deliberately provide empty inbounds here
                expectedRejectMessage: "No matching targets found",
                expectedWarningCallArgs: [
                    "Could not resolve #Object-action",
                    "no matching targets were found",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            }
        ].forEach(function (oFixture) {
            asyncTest("resolveTileIntent resolves as expected when " + oFixture.testDescription, function () {
                var oSrvc = createServiceWithInbounds(oFixture.aInbounds);

                if (oFixture.testSimulateFailingGetMatchingInbounds) {
                    sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                        new jQuery.Deferred().reject("Deliberate failure").promise()
                    );
                }

                var oMockedServices = { // NOTE: any service that is not in this object is not allowed
                    URLParsing: true
                };
                var fnGetServiceOrig = sap.ushell.Container.getService;
                sinon.stub(sap.ushell.Container, "getService", function(sName) {
                    if (!oMockedServices[sName]) {
                        ok(false, "Test is not accessing " + sName);
                    }

                    // return the result of the real service call
                    if (oMockedServices[sName] === true) {
                        return fnGetServiceOrig.call(sap.ushell.Container, sName);
                    }

                    // return mocked service
                    return oMockedServices[sName];
                });

                sinon.stub(jQuery.sap.log, "warning");
                sinon.stub(jQuery.sap.log, "error");

                oSrvc.resolveTileIntent(oFixture.sIntent)
                    .done(function (oResolvedTileIntent) {
                        if (oFixture.testType === "failure") {
                            ok(false, "promise was rejected");

                        } else {
                            ok(true, "promise was resolved");

                            deepEqual(oResolvedTileIntent, oFixture.expectedResolutionResult,
                                "obtained the expected resolution result");
                        }
                    })
                    .fail(function (sError) {
                        if (oFixture.testType === "failure") {
                            ok(true, "promise was rejected");

                            strictEqual(sError, oFixture.expectedRejectMessage,
                                "obtained the expected error message");

                            // warnings
                            if (!oFixture.expectedWarningCallArgs) {
                                strictEqual(jQuery.sap.log.warning.getCalls().length, 0,
                                    "jQuery.sap.log.warning was not called");
                            } else {
                                strictEqual(jQuery.sap.log.warning.getCalls().length, 1,
                                    "jQuery.sap.log.warning was called 1 time");

                                deepEqual(
                                    jQuery.sap.log.warning.getCall(0).args,
                                    oFixture.expectedWarningCallArgs,
                                    "jQuery.sap.log.warning was called with the expected arguments"
                                );
                            }

                            // errors
                            if (!oFixture.expectedErrorCallArgs) {
                                strictEqual(jQuery.sap.log.error.getCalls().length, 0,
                                    "jQuery.sap.log.error was not called");
                            } else {
                                strictEqual(jQuery.sap.log.error.getCalls().length, 1,
                                    "jQuery.sap.log.error was called 1 time");

                                deepEqual(
                                    jQuery.sap.log.error.getCall(0).args,
                                    oFixture.expectedErrorCallArgs,
                                    "jQuery.sap.log.error was called with the expected arguments"
                                );
                            }

                        } else {
                            ok(false, "promise was resolved without " + sError);
                        }
                    })
                    .always(function () {
                        start();
                    });
            });
        });
    })();


    (function () {
        /*
         * Complete test for getLinks
         */
        var oTestInbounds = {
           "noParamsNoAdditionalAllowed": {
               "semanticObject": "Action",
               "action": "toappnavsample",
               "id": "Action-toappnavsample~6r8",
               "title": "App Navigation Sample 1",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                   "text": "App Navigation Sample 1",
                   "ui5ComponentName": "sap.ushell.demo.AppNavSample",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.AppNavSample",
                       "self": {
                           "name": "sap.ushell.demo.AppNavSample"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "ignored",
                   "parameters": {}
               },
               "compactSignature": "<no params><+>"
           },
           "noParamsAdditionalAllowed": {
               "semanticObject": "Action",
               "action": "toappnavsample",
               "id": "Action-toappnavsample~6r8",
               "title": "App Navigation Sample 1",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                   "text": "App Navigation Sample 1",
                   "ui5ComponentName": "sap.ushell.demo.AppNavSample",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.AppNavSample",
                       "self": {
                           "name": "sap.ushell.demo.AppNavSample"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {}
               },
               "compactSignature": "<no params><+>"
           },
           "requiredParamWithDefaultRenamed": {
               "semanticObject": "Action",
               "action": "parameterRename",
               "id": "Action-parameterRename~67xE",
               "title": "Parameter Rename",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
                   "text": "Display received parameters (Case 3, Collision)",
                   "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp",
                       "self": {
                           "name": "sap.ushell.demo.ReceiveParametersTestApp"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                       "PREQ": {
                           "required": true
                       },
                       "P1": {
                           "renameTo": "P2New",
                           "required": false
                       },
                       "P2": {
                           "renameTo": "P2New",
                           "required": false
                       }
                   }
               },
               "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
           },
           "noParamsAllowed": {
               "semanticObject": "Action",
               "action": "noparametersAllowed",
               "id": "Action-parameterRename~67xE",
               "title": "No parameters allowed",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
                   "text": "Display received parameters (Case 3, Collision)",
                   "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp",
                       "self": {
                           "name": "sap.ushell.demo.ReceiveParametersTestApp"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "notallowed",
                   "parameters": {}
               },
               "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
           },
           "ignoredParamsAndDefaultParameter": {
               "semanticObject": "Object",
               "action": "ignoredParameters",
               "id": "Action-parameterRename~67xE",
               "title": "No parameters allowed",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
                   "text": "Ignored parameters",
                   "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp",
                       "self": {
                           "name": "sap.ushell.demo.ReceiveParametersTestApp"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "ignored",
                   "parameters": {
                       "P1": {
                           "required": false,
                           "defaultValue": {
                               format: "plain",
                               value: "DEFV"
                           }
                       }
                   }
               },
               "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
           },
           "starAction": {
               "semanticObject": "ActionStar",
               "action": "*",  // <- should be never returned in a getLinks call!
               "id": "Star-*~683P",
               "title": "Target Mapping with * as action",
               "resolutionResult": {
                   "applicationType": "URL",
                   "additionalInformation": "",
                   "text": "StarAction",
                   "url": "http://www.google.com",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {}
               },
               "compactSignature": "<no params><+>"
           },
           "starSemanticObject": {
               "semanticObject": "*", // <- should be never returned in a getLinks call!
               "action": "starSemanticObject",
               "id": "Star-*~683P",
               "title": "Target Mapping with * as semanticObject",
               "resolutionResult": {
                   "applicationType": "URL",
                   "additionalInformation": "",
                   "text": "StarAction",
                   "url": "http://www.google.com",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {}
               },
               "compactSignature": "<no params><+>"
           },
           "twoDefaultParametersAdditionalAllowed": {
               "semanticObject": "Object",
               "action": "twoDefaultParameters",
               "title": "Two Default Parameters",
               "resolutionResult": { /* doesn't matter */ },
               "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "P1" : { defaultValue: { value: "V1" } },
                      "P2" : { defaultValue: { value: "V2" } }
                   }
               }
           },
           "threeDefaultParametersAdditionalAllowed": {
               "semanticObject": "Object",
               "action": "threeDefaultParameters",
               "title": "Three Default Parameters",
               "resolutionResult": { /* doesn't matter */ },
               "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "P1" : { defaultValue: { value: "V1" } },
                      "P2" : { defaultValue: { value: "V2" } },
                      "P3" : { defaultValue: { value: "V3" } }
                   }
               }
           },
           "appWithUI5": {
               "semanticObject": "PickTechnology",
               "action": "pickTech",
               "id": "PickTechnology",
               "title": "Pick Technology (UI5)",
               "resolutionResult": {
                   "applicationType": "SAPUI5",
                   "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
                   "text": "Ignored parameters",
                   "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
                   "applicationDependencies": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp",
                       "self": {
                           "name": "sap.ushell.demo.ReceiveParametersTestApp"
                       }
                   },
                   "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
                   "systemAlias": "",
                   "sap.ui" :  {
                       "technology" : "UI5"
                   }
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "ignored",
                   "parameters": {
                       "P1": {
                           "required": false,
                           "defaultValue": {
                               format: "plain",
                               value: "DEFV"
                           }
                       }
                   }
               },
               "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
           },
           "appWithWDA": {
               "semanticObject": "PickTechnology",
               "action": "pickTech",
               "id": "PickTechnology",
               "title": "Pick Technology (WDA)",
               "resolutionResult": {
                   "applicationType": "WDA",
                   "additionalInformation": "",
                   "text": "Ignored parameters",
                   "applicationDependencies": {},
                   "url": "/sap/bc/nwbc/somewhereametersTestApp",
                   "systemAlias": "",
                   "sap.ui" :  {
                       "technology" : "WDA"
                   }
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "ignored",
                   "parameters": {
                       "P1": {
                           "required": false,
                           "defaultValue": {
                               format: "plain",
                               value: "DEFV"
                           }
                       }
                   }
               },
               "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
           }
        };

        [
            {
                testDescription: "semantic object and action provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    semanticObject: "Action",
                    action: "toappnavsample"
                }],
                expectedResult: [{
                    "intent": "#Action-toappnavsample",
                    "text": "App Navigation Sample 1"
                }]
            },
            {
                testDescription: "only parameters are provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    params: {
                        "PREQ": "valA",
                        "P1": ["val1"],
                        "P2": ["val2"]
                    }
                }],
                expectedResult: [{
                    "intent": "#Action-parameterRename?P1=val1&P2=val2&PREQ=valA",
                    "text": "Parameter Rename"
                }, {
                    "intent": "#Action-toappnavsample?P1=val1&P2=val2&PREQ=valA",
                    "text": "App Navigation Sample 1"
                }, {
                    "intent": "#Object-ignoredParameters?P1=val1",
                    "text": "No parameters allowed"
                }]
            },
            {
                testDescription: "no arguments are provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined
                }],
                expectedResult: [{
                    "intent": "#Action-noparametersAllowed",
                    "text": "No parameters allowed"
                }, {
                    "intent": "#Action-toappnavsample",
                    "text": "App Navigation Sample 1"
                }, {
                    "intent": "#Object-ignoredParameters",
                    "text": "No parameters allowed"
                }]
            },
            {
                testDescription: "only semantic object is provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "Object"
                }],
                expectedResult: [{
                    "intent": "#Object-ignoredParameters",
                    "text": "No parameters allowed"
                }, {
                    "intent": "#Object-starSemanticObject",
                    "text": "Target Mapping with * as semanticObject"
                }]
            },
            {
                testDescription: "only action is provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    action: "toappnavsample"
                }],
                expectedResult: [{
                    "intent": "#Action-toappnavsample",
                    "text": "App Navigation Sample 1"
                }]
            },
            {
                testDescription: "semantic object and parameters are provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "Object",
                    params: {
                        "P1": "VDEFINED1"
                    }
                }],
                expectedResult: [{
                    "intent": "#Object-ignoredParameters?P1=VDEFINED1",
                    "text": "No parameters allowed"
                }, {
                    "intent": "#Object-starSemanticObject?P1=VDEFINED1",
                    "text": "Target Mapping with * as semanticObject"
                }]
            },
            {
                testDescription: "a '*' semantic object is provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "*"
                }],
                expectedResult: []
            },
            {
                testDescription: "a '*' action is provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.starAction,
                    oTestInbounds.starSemanticObject
                ],
                aCallArgs: [{
                    action: "*"
                }],
                expectedResult: []
            },
            {
                testDescription: "withAtLeastOneUsedParam enabled, inbounds with default values provided, one common parameter in intent",
                aInbounds: [
                    oTestInbounds.twoDefaultParametersAdditionalAllowed,   // has P1 and P2 params
                    oTestInbounds.threeDefaultParametersAdditionalAllowed  // has P1, P2, P3 params
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    withAtLeastOneUsedParam: true,
                    params: {
                        "P2": ["OURV2"]
                    }
                }],
                expectedResult: [{  // both are returned because they share P2
                    "intent": "#Object-threeDefaultParameters?P2=OURV2",
                    "text": "Three Default Parameters"
                }, {
                    "intent": "#Object-twoDefaultParameters?P2=OURV2",
                    "text": "Two Default Parameters"
                }]
            },
            {
                testDescription: "withAtLeastOneUsedParam enabled and inbound with no parameters provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    withAtLeastOneUsedParam: true,
                    params: {
                        "P1": ["OURV1"]
                    }
                }],
                expectedResult: [{
                    "intent": "#Action-toappnavsample?P1=OURV1",
                    "text": "App Navigation Sample 1"
                }]
            },
            {
                testDescription: "withAtLeastOneUsedParam enabled and inbound with no parameters (and ignored additional parameters) provided",
                aInbounds: [
                    oTestInbounds.noParamsNoAdditionalAllowed
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    withAtLeastOneUsedParam: true,
                    params: {
                        "P1": ["OURV1"]
                    }
                }],
                expectedResult: []
            },
            {
                testDescription: "withAtLeastOneUsedParam disabled and inbound with no parameters (and ignored additional parameters) provided",
                aInbounds: [
                    oTestInbounds.noParamsNoAdditionalAllowed
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    withAtLeastOneUsedParam: false,
                    params: {
                        "P1": ["OURV1"]
                    }
                }],
                expectedResult: [{
                    "intent": "#Action-toappnavsample",
                    "text": "App Navigation Sample 1"
                }]
            },
            {
                testDescription: "withAtLeastOneUsedParam enabled, sap- parameter provided, and inbound with two parameters (others allowed) provided",
                aInbounds: [
                    oTestInbounds.twoDefaultParametersAdditionalAllowed,   // has P1 and P2 params
                    oTestInbounds.threeDefaultParametersAdditionalAllowed  // has P1, P2, P3 params
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    withAtLeastOneUsedParam: true,
                    params: {
                        "sap-param": ["OURV1"] // sap- params don't count
                    }
                }],
                expectedResult: []
            },
            {
                testDescription: "semantic object and tech hint GUI as filter provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.appWithUI5,
                    oTestInbounds.appWithWDA
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "PickTechnology",
                    treatTechHintAsFilter : false,
                    params: {
                        "sap-ui-tech-hint": ["GUI"]
                    }
                }],
                expectedResult: [{
                    "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=GUI",
                    "text": "Pick Technology (UI5)"
                }]
            },
            {
                testDescription: "semantic object and tech hint as filter WDA provided",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.appWithUI5,
                    oTestInbounds.appWithWDA
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "PickTechnology",
                    treatTechHintAsFilter : true,
                    params: {
                        "sap-ui-tech-hint": ["WDA"]
                    }
                }],
                expectedResult: [{
                    "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=WDA",
                    "text": "Pick Technology (WDA)"
                }]
            },
            {
                testDescription: "semantic object and tech hint treatTechHintAsFilter GUI (not present)",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.appWithUI5,
                    oTestInbounds.appWithWDA
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "PickTechnology",
                    treatTechHintAsFilter : true,
                    params: {
                        "sap-ui-tech-hint": ["GUI"]
                    }
                }],
                expectedResult: [
                ]
            },
            {
                testDescription: "semantic object and tech hint treatTechHintAsFilter GUI (not present)",
                aInbounds: [
                    oTestInbounds.noParamsAdditionalAllowed,
                    oTestInbounds.requiredParamWithDefaultRenamed,
                    oTestInbounds.noParamsAllowed,
                    oTestInbounds.ignoredParamsAndDefaultParameter,
                    oTestInbounds.appWithUI5,
                    oTestInbounds.appWithWDA
                ],
                aCallArgs: [{
                    // if CrossApplicationNavigation#getLinks was called, the
                    // presence of action is guaranteed.
                    action: undefined,
                    semanticObject: "PickTechnology",
                    params: {
                        "sap-ui-tech-hint": ["GUI"]
                    }
                }],
                expectedResult: [{
                    "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=GUI",
                    "text": "Pick Technology (UI5)"
                }]
            }
            ].forEach(function (oFixture) {
            asyncTest("getLinks works as expected when " + oFixture.testDescription, function () {
                var oSrvc = createServiceWithInbounds(oFixture.aInbounds),
                    oAllowedRequireServices = {
                        URLParsing: true
                    };

                var fnGetServiceOrig = sap.ushell.Container.getService;
                sinon.stub(sap.ushell.Container, "getService", function(sName) {
                    if (!oAllowedRequireServices[sName]) {
                        ok(false, "Test is not accessing " + sName);
                    }
                    return fnGetServiceOrig.bind(sap.ushell.Container)(sName);
                });

                oSrvc.getLinks.apply(oSrvc, oFixture.aCallArgs)
                    .done(function (aSemanticObjectLinks) {
                        ok(true, "promise is resolved");

                        deepEqual(aSemanticObjectLinks, oFixture.expectedResult,
                            "obtained the expected result");
                    })
                    .fail(function (sErrorMessage) {
                        ok(false, "promise is resolved without " + sErrorMessage);

                    })
                    .always(function () {
                        start();
                    });
            });
        });

    })();

    [
        {
            testDescription: "3 Semantic objects in inbounds",
            aSemanticObjectsInInbounds: [
                "Action", "Shell", "Object"
            ],
            expectedResult: [
                "Action", "Object", "Shell" // returned in lexicographical order
            ]
        },
        {
            testDescription: "wildcard semantic object in inbounds",
            aSemanticObjectsInInbounds: [
                "Action", "*", "Shell", "Object"
            ],
            expectedResult: [
                "Action", "Object", "Shell" // "*" is ignored
            ]
        },
        {
            testDescription: "empty list of semantic objects is provided",
            aSemanticObjectsInInbounds: [],
            expectedResult: []
        },
        {
            testDescription: "undefined semantic object and empty semantic objects",
            aSemanticObjectsInInbounds: [undefined, ""],
            expectedResult: []
        },
        {
            testDescription: "duplicated semantic object in inbounds",
            aSemanticObjectsInInbounds: ["Shell", "Dup", "action", "Dup"],
            expectedResult: ["Dup", "Shell", "action"]
        }
    ].forEach(function (oFixture) {
        asyncTest("getDistinctSemanticObjects returns the expected result when " + oFixture.testDescription, function () {
            // Arrange
            var aInbounds = oFixture.aSemanticObjectsInInbounds.map(function (sSemanticObject) {
                return {
                    semanticObject: sSemanticObject,
                    action: "dummyAction"
                };
            });

            var oSrvc = createServiceWithInbounds(aInbounds);

            // Act
            oSrvc.getDistinctSemanticObjects()
                .done(function (aSemanticObjectsGot) {
                    ok(true, "promise was resolved");

                    deepEqual(aSemanticObjectsGot, oFixture.expectedResult,
                        "the expected list of semantic objects was returned");
                })
                .fail(function (sMsg) {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });
    asyncTest("getDistinctSemanticObjects behave as expected when getInbounds fails", function () {
        // Arrange
        var oFakeAdapter = {
                getInbounds: function () {
                    return new jQuery.Deferred().reject("Deliberate Error").promise();
                }
            },
            oSrvc = createServiceWithAdapter(oFakeAdapter);

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        // Act
        oSrvc.getDistinctSemanticObjects()
            .done(function () {
                ok(false, "promise was rejected");
            })
            .fail(function (sErrorMessageGot) {
                ok(true, "promise was rejected");
                strictEqual(sErrorMessageGot, "Deliberate Error",
                    "expected error message was returned");

                strictEqual(
                    jQuery.sap.log.error.getCalls().length,
                    0,
                    "jQuery.sap.log.error was called 0 times"
                );

                strictEqual(
                    jQuery.sap.log.warning.getCalls().length,
                    0,
                    "jQuery.sap.log.warning was called 0 times"
                );
            })
            .always(function () {
                start();
            });
    });


    [
        {
            testDescription: "matching UI5 url with sap-system and other parameters specified in intent (additionalParameters: ignored)",
            intent : "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget: {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": { },
               "defaultedParamNames" : ["P2"],
               "intentParamsPlusAllDefaults" : {
                   "P1" : ["PV1", "PV2"],
                   "P2" : ["1000"],
                   "sap-system" : ["AX1"]
               },
               "inbound": {
                   "title": "Currency manager (this one)",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "SAPUI5",
                       "text": "Currency manager (ignored )", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "required": false,
                               "renameTo": "P3",
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            },
            expectedResolutionResult: {
                "additionalInformation": "SAPUI5.Component=Currency.Component",
                "applicationType": "SAPUI5",
                "text": "Currency manager (this one)",
                "ui5ComponentName": "Currency.Component",
                "sap-system" : "AX1",
                "url": "/url/to/currency?P1=PV1&P1=PV2&P3=1000&sap-system=AX1&sap-ushell-defaultedParameterNames=%5B%22P3%22%5D"
            }
        },
        {
            testDescription: "resolving local WDA url",
            intent : "Action-action1?paramName1=pv1",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget:  {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": { },
               "defaultedParamNames" : ["P2"],
               "intentParamsPlusAllDefaults" : {
                   "P1" : ["PV1", "PV2"],
                   "P2" : ["1000"]
               },
               "inbound": {
                   "title": "Currency manager (this one)",
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "",
                       "applicationType": "WDA",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "renameTo": "P3",
                               "required": true
                           }
                       }
                   }
               }
            },
            expectedResolutionResult : {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "sap-system" : undefined,
                "text": "Currency manager (this one)",
                "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&P1=PV1&P1=PV2&P3=1000&sap-ushell-defaultedParameterNames=%5B%22P3%22%5D"
             }
        },
        {
            testDescription: "resolving local WDA url with sap-system",
            intent : "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget:  {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "text": "Some WDA"
               },
               "defaultedParamNames" : ["P2"],
               "intentParamsPlusAllDefaults" : {
                   "P1" : ["PV1", "PV2"],
                   "P4" : { },
                   "P2" : ["1000"],
                   "sap-system" : ["AX1"]
               },
               "inbound": {
                   "semanticObject": "Action", "action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "",
                       "applicationType": "WDA",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "renameTo": "P3",
                               "required": true
                           }
                       }
                   }
               }
            },
            expectedResolutionResult : {
                "text": "Some WDA",
                // NOTE: the UNMAPPED paramter list!
                "url": "fallback :-({P1:[PV1,PV2],P2:[1000],sap-system:[AX1],sap-ushell-defaultedParameterNames:[[P3]]}",
                "sap-system" : "AX1"
             }
        }
    ].forEach(function (oFixture) {
        asyncTest("resolveHashFragment postprocessing when " + oFixture.testDescription, function () {

            var oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([]).promise()
                ),
                resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                    return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
                }
            };

            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});

            // Mock form factor
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([oFixture.oMockedMatchingTarget]).promise()
            );

            // Act
            oSrvc.resolveHashFragment(oFixture.intent)
                .done(function (oResolutionResult) {
                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "got expected resolution result");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });

        });
    });

    [
        {
            "description" : "renameTo present",
            oMatchingTarget : {
                "inbound": {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "required": true
                            },
                            "P2": {
                                "renameTo": "P3",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedResult : true
        },
        {
            "description" : "renameTo not present",
            oMatchingTarget : {
                "inbound": {
                    "signature": {
                        "parameters": {
                            "P2": {
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedResult : false
        }
    ].forEach(function (oFixture) {
        test(" _hasRenameTo when " +  oFixture.testDescription, function () {
            var oFakeAdapter = {
            };
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter);
            var bRes = oSrvc._hasRenameTo(oFixture.oMatchingTarget);
            strictEqual(bRes, oFixture.expectedResult, " determination ok");
      });
    });


    [
     {
         testDescription: "ui5 parameter mapping with appState and defaulting",
         intent : "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
         sCurrentFormFactor: "desktop",
         oMockedMatchingTarget: {
            // ignore certain fields not needed for the test
            "matches": true,
            "resolutionResult": { },
            "defaultedParamNames" : ["P2", "P3", "P4", "P5"],
            "intentParamsPlusAllDefaults" : {
                "P1" : ["PV1", "PV2"],
                "P2" : ["1000"],
                "P3" : { "ranges" :  { option : "EQ", low : "1000" } },
                "P4" : { "ranges" :  { option : "EQ", low : "notusedbecauseP2" } },
                "P5" : { "ranges" :  { option : "EQ", low : "1000" } },
                "P9" : ["PV9"],
                "sap-system" : ["AX1"]
            },
            "inAppState" : {
                "selectionVariant" : {
                    "Parameter" : [ { "PropertyName" : "P6", "PropertyValue" : "0815" },
                                    { "PropertyName" : "P8", "PropertyValue" : "0815" } ],
                    "selectOptions" : [
                    {
                        "PropertyName": "P7",
                        "Ranges": [
                                   {
                                         "Sign": "I",
                                                          "Option": "EQ",
                                                          "Low": "INT",
                                                          "High": null
                                    }
                                    ]
                    }]
                }
            },
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "Action", "action": "action1",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1" : { "renameTo": "PX" },
                        "P2": {  "renameTo": "P4" },
                        "P5" : { "renameTo" : "PX"},
                        "P6C" : { "renameTo" : "PC"},
                        "P6"  : { "renameTo" : "P6New"},
                        "P7"  : { "renameTo" : "P6New"},
                        "P8"  : { "renameTo" : "P8New"},
                        "P9"  : { "renameTo" : "PX"}
                    }
                }
            }
         },
         expectedResolutionResult: {
             "additionalInformation": "SAPUI5.Component=Currency.Component",
             "applicationType": "SAPUI5",
             "text": "Currency manager (this one)",
             "ui5ComponentName": "Currency.Component",
             "sap-system" : "AX1",
             "url": "/url/to/currency?P4=1000&PX=PV1&PX=PV2&sap-system=AX1&sap-ushell-defaultedParameterNames=%5B%22P4%22%5D"
         }
     }
 ].forEach(function (oFixture) {
     asyncTest("resolveHashFragment with appstate merging " + oFixture.testDescription, function () {

         var oFakeAdapter = {
             getInbounds: sinon.stub().returns(
                 new jQuery.Deferred().resolve([]).promise()
             ),
             resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                 return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
             }
         };

         var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});

         // Mock form factor
         sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

         // Mock getMatchingInbounds
         sinon.stub(oSrvc, "_getMatchingInbounds").returns(
             new jQuery.Deferred().resolve([oFixture.oMockedMatchingTarget]).promise()
         );

         // Act
         oSrvc.resolveHashFragment(oFixture.intent)
             .done(function (oResolutionResult) {
                 // Assert
                 ok(true, "promise was resolved");
                 deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "got expected resolution result");
             })
             .fail(function () {
                 // Assert
                 ok(false, "promise was resolved");
             })
             .always(function () {
                 start();
             });

     });
 });


    [
        {
            testDescription: " no renaming, no appstate or complex parameters",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": { },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {},
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : {  },
                            "P2": { }
                        }
                    }
                }
            },
            expectedAppStateKey : undefined,
            expectedIntentParamsPlusAllDefaults : {
                "P1" : ["PV1", "PV2"],
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            expectedMappedDefaultedParamNames : ["P2"]
        },
        {
            testDescription: " new appstate creation",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {},
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PX" },
                            "P2" : {  "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "Parameters" : [],
                    "SelectOptions" : [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "4000",
                                            "High": null
                                        }
                                        ]
                         }
                    ],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            expectedMappedDefaultedParamNames : ["P2"]
        },
        {
            testDescription: " modifying and merging into an existing appstate",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PX" },
                            "P2" : {  "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "POLD",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                         ]}
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "POLD",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         },
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "4000",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            },
            expectedMappedDefaultedParamNames : ["P2"]
        },
        {
            testDescription: " no merging because of presence in appstate in select option",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P4" : { },
                            "P2" : {  "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASOLD" ]
            },
            expectedAppStateKey : "ASOLD",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                         ]}
            },
            expectedAppStateData : undefined // No app state was generated
        },
        {
            testDescription: " no merging because of presence in appstate in select option via domination!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PX" },
                            "P2" : { "renameTo": "PX", "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                         ]}
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "PX",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            }
        },
        {
            testDescription: " partially no merging because of presence in appstate in select option!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P1" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "1111",
                            "High": null
                        }] },
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P1","P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : { "Ranges" : [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }]
                    },
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }]
                    }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : {   },
                            "P2" : {  "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }]
                },
                "P2" : { "Ranges" :  [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }]
                },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [ {
                            "PropertyName" : "P2",
                            "Ranges": [
                                       {
                                           "Sign": "I",
                                           "Option": "LT",
                                           "Low": "2222",
                                           "High": null
                                       }
                                       ]
                        }
                         ]}
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "2222",
                                            "High": null
                                        }
                                        ]
                         },
                         {
                             "PropertyName" : "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "1111",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            },
            expectedMappedDefaultedParamNames : ["P1"]
        },
        {
            testDescription: " no merging because of presence in appstate in parameter!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { },
                            "P2" : {  "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASOLD" ]
            },
            expectedAppStateKey : "ASOLD",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P2", "PropertyValue" : "P2Value" }]
                }
            },
            expectedAppStateData : undefined // No app state was generated
        },
        {
            testDescription: " no merging because of presence in appstate in parameter, but renaming",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PX" },
                            "P2" : { "renameTo": "P2New", "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} },
                            "P3" : { "renameTo": "P3New" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName" : "P3", "PropertyValue": "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName" : "P3New", "PropertyValue": "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2New",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedMappedDefaultedParamNames : []
        },
        {
            testDescription: " but plain renaming!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PX" },
                            "P2" : { "renameTo": "P2New", "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} },
                            "P3" : { "renameTo": "P3New" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "PUValue" },
                                   { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "PUValue" },
                                   { "PropertyName" : "P3New", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2New",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            }
        },
        {
            testDescription: "  plain renaming if irrelevant does not trigger new AppState!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P6" : { "renameTo": "P7" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASOLD" ]
            },
            expectedAppStateKey : "ASOLD",
            oOldAppStateData : {
                selectionVariant: {"ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "PUValue" },
                                   { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "PUValue" },
                                   { "PropertyName" : "P3", "PropertyValue" : "P3Value" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedMappedDefaultedParamNames : []
        },
        {
            testDescription: " no merging because of presence in appstate in parameter, but renaming with collisions",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "PU" },
                            "P2" : { "renameTo": "PU", "defaultValue" : { "value" : "UserDefault.extended.PX", format : "reference"} },
                            "P3" : { "renameTo": "PU" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : ["ASOLD"]
            },
            expectedAppStateKey : "ASOLD",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "1" },
                                   { "PropertyName" : "P3", "PropertyValue" : "2" }],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData : undefined, // No app state was generated
//                selectionVariant: {
//                    "ODataFilterExpression" : "",
//                    "SelectionVariantID" : "",
//                    "Text" : "Selection Variant with ID ",
//                    "Version" : {
//                        "Major" : "1",
//                        "Minor" : "0",
//                        "Patch" : "0"
//                    },
//                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "1" }]
//                    SelectOptions :
//                        [
//                         {
//                             "PropertyName" : "PU",
//                             "Ranges": [
//                                        {
//                                            "Sign": "I",
//                                            "Option": "EQ",
//                                            "Low": "OLD",
//                                            "High": null
//                                        }
//                                        ]
//                         }
//                     ]
//                }
//            },
            expectedMappedDefaultedParamNames : []
        },
        {
            // TODO CHECK WHETHER we shoud sort !
            testDescription: " but renaming changes effective order",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames" : ["P2", "P7"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"],
                    "P7New" : ["1000"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] },
                    "P7" : ["1000"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "P2" },
                            "P2" : { "renameTo": "P1" },
                            "P7" : { "renameTo" : "P7New"}
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ],
                "P7" : ["1000"]  // renaming is elsewhere!
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P1", "PropertyValue" : "1" },
                                   { "PropertyName" : "P2", "PropertyValue" : "2" }]
                }
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "SelectOptions" : [],
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P2", "PropertyValue" : "1" },
                                   { "PropertyName" : "P1", "PropertyValue" : "2" }]
                }
            },
            expectedMappedDefaultedParamNames : ["P7New"]
        },
        {
            // TODO CHECK WHETHER we shoud sort !
            testDescription: "added and renamend one ",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "I2222T",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2", "P7"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"],
                    "P7New" : ["1000"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "I2222T",
                        "High": null
                    }] },
                    "P7" : ["1000"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "P2" },
                            "P2" : { "renameTo": "P1" },
                            "P7" : { "renameTo" : "P7New"}
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "I2222T",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ],
                "P7" : ["1000"]  // renaming is elsewhere!
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P1", "PropertyValue" : "1" },
                                   { "PropertyName" : "P5", "PropertyValue" : "2" }]
                }
            },
            expectedAppStateData : {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters : [ { "PropertyName" : "P2", "PropertyValue" : "1" },
                                   { "PropertyName" : "P5", "PropertyValue" : "2" }
                    ],
                    SelectOptions :
                        [
                         {
                             "PropertyName" : "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "I2222T",
                                            "High": null
                                        }
                                        ]
                         }
                         ]
                }
            },
            expectedMappedDefaultedParamNames : ["P1", "P7New"]
        },
        {
            testDescription: "  does not break non compliant appstates when inserting",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers" : {
                        "P2" : { "Ranges" :  [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"],
                    "P2" : { "Ranges" :  [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "P2" },
                            "P2" : { "renameTo": "P1" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "P2" : { "Ranges" : [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state" : [ "ASNEW" ]
            },
            expectedAppStateKey : "ASNEW",
            oOldAppStateData : {
                "here" : {}
            },
            expectedAppStateData : {
                "here": {},
                "selectionVariant": {
                    "ODataFilterExpression" : "",
                    "Parameters" : [],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                  "SelectOptions": [
                    {
                      "PropertyName": "P1",
                      "Ranges" :  [{
                          "Sign": "I",
                          "Option": "LT",
                          "Low": "4000",
                          "High": null
                      }]
                    }
                  ]
                }
            }
        },
        {
            testDescription: "  does not break non compliant appstates when not changing",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames" : ["P2"],
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "sap-xapp-state" : ["ASOLD"]
                },
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "sap-xapp-state" : ["ASOLD"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action", "action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1" : { "renameTo": "P2" },
                            "P2" : { "renameTo": "P1" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1" : ["PV1", "PV2"],
                "sap-xapp-state" : [ "ASOLD" ]
            },
            expectedAppStateKey : "ASOLD",
            oOldAppStateData : {
                "here" : {}
            },
            expectedAppStateData : {
                "here" : {}
            }
        }
 ].forEach(function (oFixture) {
     asyncTest(" _mixAppStateIntoResolutionResultAndRename when " + oFixture.testDescription, function () {
         var oFakeAdapter = {
             getInbounds: sinon.stub().returns(
                 new jQuery.Deferred().resolve([]).promise()
             ),
             resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                 return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
             }
         };
         function FakeAppState(sKey,oData) {
             this.oData = oData;
             this.getKey = function() { return sKey; };
             this.getData = function() { return this.oData; };
             this.setData = function(oData) { this.oData = oData; };
             this.save = function() { return new jQuery.Deferred().resolve().promise(); };
         }
         function sortParametersByName(o1) {
             var p1 = jQuery.sap.getObject("selectionVariant.Parameters", undefined, o1);
             if (jQuery.isArray(p1)) {
                 o1.selectionVariant.Parameters = p1.sort(function(e1,e2) {
                     if (e1.PropertyName === e2.PropertyName) {
                         return 0;
                     }
                     if (e1.PropertyName < e2.PropertyName) {
                         return -1;
                     }
                     return 1;
                 });
             }
             return o1;
         }

         var oNewAppState = new FakeAppState("ASNEW",{});
         var oAppStateMock = {
                 getAppState: sinon.stub().returns(
                     new jQuery.Deferred().resolve(new FakeAppState("ASOLD",oFixture.oOldAppStateData)).promise()
                 ),
                 createEmptyAppState : sinon.stub().returns(
                     oNewAppState
                 )
//                 resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
//                     return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
//                 }
             };

         var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});
         // Act
         oSrvc._mixAppStateIntoResolutionResultAndRename(oFixture.oMatchingTarget,oAppStateMock)
             .done(function (oMatchingTargetResult) {
                 // test the xapp-state key !
                 deepEqual(oMatchingTargetResult.intentParamsPlusAllDefaults["sap-xapp-state"], (oFixture.expectedAppStateKey ? [oFixture.expectedAppStateKey] : undefined), "new appstate key");
                 deepEqual(oMatchingTargetResult.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"], (oFixture.expectedAppStateKey ? [oFixture.expectedAppStateKey] : undefined), "new appstate key in simple defaults!");
                 deepEqual(oMatchingTargetResult.intentParamsPlusAllDefaults, oFixture.expectedIntentParamsPlusAllDefaults, "cleansed parameters ok" );
                 if (oFixture.expectedAppStateData) {
                     deepEqual(sortParametersByName(oNewAppState.getData()),sortParametersByName(oFixture.expectedAppStateData), " appstate data correct");
                 }
                 if (oFixture.expectedMappedDefaultedParamNames) {
                     deepEqual(oMatchingTargetResult.mappedDefaultedParamNames, oFixture.expectedMappedDefaultedParamNames, "defaulted param names ok");
                 }
             })
             .fail(function () {
                 // Assert
                 ok(false, "promise was resolved");
             })
             .always(function () {
                 start();
             });
     });
 });

    // parameter mapping
    [
    {
        testDescription: " trivial no rename",
        sParamName : "P1",
        oValue : ["P1V"],
        "intentParamsPlusAllDefaults" : {
            "P1" : ["PV1", "PV2"],
            "P2" : ["1000"],
            "sap-system" : ["AX1"]
        },
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                }
            }
        },
        expectedResult : "P1"
    },
    {
        testDescription: " normal rename",
        sParamName : "P1",
        oValue : [ "Pv1"],
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                },
                "P1": {
                    "renameTo" : "P1ren",
                    "required": true
                }
            }
        },
        expectedResult : "P1ren"
    },
    {
        testDescription: " no rename because complex value",
        sParamName : "P1",
        oValue : {},
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                },
                "P1": {
                    "renameTo" : "P1ren",
                    "required": true
                }
            }
        },
        expectedResult : "P1"
    }
    ].forEach(function (oFixture) {
    test("getRenameParameterName when " + oFixture.testDescription, function () {
        var oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([]).promise()
                )
            };
        var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, { config: {}});
        // Act
        var res = oSrvc._getRenameParameterName(oFixture.sParamName, oFixture.oSignature, oFixture.oValue);
        equal(res, oFixture.expectedResult,"renamed paramter ok");
    });
});

    [
    {
        testDescription: " no parameters in mapping",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {},
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo" : "P3ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {},
            "mappedIntentParamsPlusSimpleDefaults" : {},
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo" : "P3ren",
                            "required": true
                        }
                    }
                }
            }
        }
    },
    {
        testDescription: " rename rule but no value, object removed",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["PV1", "PV2"],
                "P4" : {},
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo" : "P1ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["PV1", "PV2"],
                "P4" : {},
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "P1" : ["PV1", "PV2"],
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo" : "P1ren",
                            "required": true
                        }
                    }
                }
            }
        }
    },
    {
        testDescription: " rename rule but complex value thus no rename, sap-system renamed",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : { "extended" : 1},
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "ParamName2": {
                            "required": true
                        },
                        "sap-system": {
                            "renameTo" : "MyCorpSystem"
                        },
                        "P1": {
                            "renameTo" : "P1ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : { "extended" : 1},
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "P2" : ["1000"],
                "MyCorpSystem" : ["AX1"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "ParamName2": {
                            "required": true
                        },
                        "sap-system": {
                            "renameTo" : "MyCorpSystem"
                        },
                        "P1": {
                            "renameTo" : "P1ren",
                            "required": true
                        }
                    }
                }
            }
        }
    },
    {
        testDescription: " rename rule with collision of parameters in target",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "Ptarget" : ["2000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo" :"Ptarget",
                            "required": true
                        },
                        "P2": {
                            "renameTo" : "Ptarget",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "Ptarget" : ["1000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo" :"Ptarget",
                            "required": true
                        },
                        "P2": {
                            "renameTo" : "Ptarget",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"Ptarget\""
    },
    {
        testDescription: " rename rule with clobbering P1 -> P2",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo" :"P2",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "P2" : ["1000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo" :"P2",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"P2\""
    },
    {
        testDescription: " rename rule with clobbering P2 -> P1",
        oMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "renameTo" :"P1",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget : {
            "intentParamsPlusAllDefaults" : {
                "P1" : ["1000"],
                "P2" : ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults" : {
                "P1" : ["1000"]
            },
            "inbound" : {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "renameTo" :"P1",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"P1\""
    }
    ].forEach(function (oFixture) {
    test("getRenameParameterName when " + oFixture.testDescription, function () {
        var oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([]).promise()
                )
            };
        var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});
        // Act
        var oErrorLog = sinon.stub(jQuery.sap.log,"error");
        oSrvc._mapParameterNamesAndRemoveObjects(oFixture.oMatchingTarget);
        deepEqual(oFixture.oMatchingTarget, oFixture.expectedMatchingTarget, "renamed paramter ok");
        if (oFixture.expectedErrorLog) {
            ok(oErrorLog.calledWith(oFixture.expectedErrorLog)," error log was called");
        } else {
            equal(oErrorLog.callCount,0,"error log not called");
        }
        jQuery.sap.log.error.restore();
    });
});

// end of parameter mapping atomic function tests

    [
        {
            testDescription: "form factor is not ignored",
            sSemanticObject: "Object",
            bIgnoreFormFactor: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": "mobile",
                "params": {},
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "form factor is ignored",
            sSemanticObject: "Object",
            bIgnoreFormFactor: true,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": undefined,
                "params": {},
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "parameters are specified",
            sSemanticObject: "Object",
            bIgnoreFormFactor: true,
            mBusinessParams: {
                "p1": ["v1"],
                "p2": ["v3", "v2"]
            },
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": undefined,
                "params": {
                    "p1": ["v1"],
                    "p2": ["v3", "v2"]
                },
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "semantic object is the empty string",
            sSemanticObject: "",
            bIgnoreFormFactor: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": "mobile",
                "semanticObject": undefined,
                "params": {}
            }
        }
    ].forEach(function (oFixture) {

        asyncTest("getLinks: calls _getMatchingInbounds with expected shell hash when " + oFixture.testDescription, function () {

            var oSrvc = createServiceWithInbounds([]);

            // Mock form factor
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([]).promise()
            );

            // Act
            oSrvc.getLinks(oFixture.sSemanticObject, oFixture.mBusinessParams, oFixture.bIgnoreFormFactor)
                .done(function (aResultSemanticObjectLinks) {
                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(oSrvc._getMatchingInbounds.getCall(0).args[0], oFixture.expectedGetMatchingTargetsIntent,
                        "_getMatchingInbounds was called with expected intent object");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });

        });
    });

    [
        {
            testDescription: "semantic object is a number (nominal parameters)",
            sSemanticObject: 128,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Number] instead"
        },
        {
            testDescription: "semantic object is {} (nominal parameters)",
            sSemanticObject: {},
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Object] instead"
        },
        {
            testDescription: "semantic object is [] (nominal parameters)",
            sSemanticObject: [],
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Array] instead"
        },
        {
            testDescription: "action is not a string (nominal parameters)",
            sSemanticObject: "Object",
            sAction: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid action",
            sExpectedErrorDetailsPart: "the action must be a string"
        },
        {
            testDescription: "action is not a string (nominal parameters)",
            sSemanticObject: "Object",
            sAction: "",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid action",
            sExpectedErrorDetailsPart: "the action must not be an empty string"
        },
        {
            testDescription: "semantic object is undefined",
            sSemanticObject: undefined,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Undefined] instead"
        },
        {
            testDescription: "semantic object is a number",
            sSemanticObject: 128,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Number] instead"
        },
        {
            testDescription: "semantic object is {}",
            sSemanticObject: {},
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Object] instead"
        },
        {
            testDescription: "semantic object is []",
            sSemanticObject: [],
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Array] instead"
        },
        {
            testDescription: "semantic object is blank",
            sSemanticObject: " ",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got ' ' instead"
        },
        {
            testDescription: "semantic object is many blanks",
            sSemanticObject: "    ",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got '    ' instead"
        }
    ].forEach(function (oFixture) {
        asyncTest("getLinks: logs an error and rejects promise when " + oFixture.testDescription, function () {

            var oSrvc = createServiceWithInbounds([]);

            sinon.stub(jQuery.sap.log, "error");

            // Mock form factor
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([]).promise()
            );

            // Act
            var fnGetSemanticObjectLinksBound = oSrvc.getLinks.bind(oSrvc, oFixture.sSemanticObject, oFixture.mBusinessParams);
            if (oFixture.bUseNominalParameters) {
                fnGetSemanticObjectLinksBound = oSrvc.getLinks.bind(oSrvc, {
                    semanticObject: oFixture.sSemanticObject,
                    action: oFixture.sAction,
                    params: oFixture.oParams
                });
            }
            fnGetSemanticObjectLinksBound()
                .done(function (aResultSemanticObjectLinks) {
                    // Assert
                    ok(false, "promise was rejected");
                })
                .fail(function (sErrorMessage) {
                    // Assert
                    ok(true, "promise was rejected");
                    strictEqual(sErrorMessage, oFixture.sExpectedErrorMessage, "rejected with expected error message");
                    strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                    strictEqual(jQuery.sap.log.error.getCall(0).args[0], "invalid input for _getLinks", "expected error title was logged");
                    ok(jQuery.sap.log.error.getCall(0).args[1].indexOf(oFixture.sExpectedErrorDetailsPart) >= 0, oFixture.sExpectedErrorDetailsPart + " was found in logged error details");
                    strictEqual(jQuery.sap.log.error.getCall(0).args[2], "sap.ushell.services.ClientSideTargetResolution", "error contains sap.ushell.services.ClientSideTargetResolution");
                })
                .always(function () {
                    start();
                });

        });

    });

    [
     {
         testLogLevel: [I_DEBUG],
         sSemanticObject: "Object",
         mBusinessParams: { "country": ["IT"] },
         bIgnoreFormFactor: true,
         sCurrentFormFactor: "desktop",
         aMockedResolutionResults: [
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "semanticObject": "Object", "action": "bbb",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": {
                     "country": {
                         required: true
                     }
                   }}
                }
             },
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "semanticObject": "Object", "action": "ccc",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": { }, "additionalParameters": "ignored" }
                }
             }
         ],
         expectedSemanticObjectLinks: [
             { "intent": "#Object-bbb?country=IT",
                 "text": "Currency manager" },
             { "intent": "#Object-ccc",
                 "text": "Currency manager" }
         ],
         expectedLogArgs: [
             "_getLinks filtered to unique intents.",
             /Reporting histogram:(.|\n)*#Object-bbb(.|\n)*#Object-ccc/,
             "sap.ushell.services.ClientSideTargetResolution"
         ]
     },
     {
         testLogLevel: [I_TRACE],
         sSemanticObject: "Object",
         mBusinessParams: { "country": ["IT"] },
         bIgnoreFormFactor: true,
         sCurrentFormFactor: "desktop",
         aMockedResolutionResults: [
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "semanticObject": "Object", "action": "bbb",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": {
                     "country": {
                         required: true
                     }
                   }}
                }
             },
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "semanticObject": "Object", "action": "ccc",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": { }, "additionalParameters": "ignored" }
                }
             }
         ],
         expectedSemanticObjectLinks: [
              { "intent": "#Object-bbb?country=IT",
                  "text": "Currency manager" },
              { "intent": "#Object-ccc",
                  "text": "Currency manager" }
         ],
         expectedLogArgs: [
             "_getLinks filtered to the following unique intents:",
             /(.|\n)*#Object-bbb.*country=IT(.|\n)*#Object-ccc.*/,
             "sap.ushell.services.ClientSideTargetResolution"
         ]
     }
    ].forEach(function (oFixture) {
        asyncTest("getLinks: correctly logs resulting intents in log level " + oFixture.testLogLevel, function () {
            var oSrvc = createServiceWithInbounds([]),
                oLogMock = sap.ushell.test.createLogMock().sloppy(true);

            // Check logging expectations via LogMock
            oLogMock.debug.apply(oLogMock, oFixture.expectedLogArgs);

            // LogMock doesn't keep the following original methods
            jQuery.sap.log.getLevel = sinon.stub().returns(oFixture.testLogLevel);
            jQuery.sap.log.Level = {
                DEBUG: I_DEBUG,
                TRACE: I_TRACE
            };

            // Mock form factor
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.aMockedResolutionResults).promise()
            );

            // Act
            oSrvc.getLinks(oFixture.sSemanticObject, oFixture.mBusinessParams, oFixture.bIgnoreFormFactor)
                .done(function (aResultSemanticObjectLinks) {
                    start();

                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(aResultSemanticObjectLinks, oFixture.expectedSemanticObjectLinks, "got expected array of semantic object links");
                    oLogMock.verify();
                })
                .fail(function () {
                    start();

                    // Assert
                    ok(false, "promise was resolved");
                });
        });
    });

    [
        {
            testDescription: "semantic object/actions are both passed",
            sCurrentFormFactor: "phone",
            sIntent: "#Object-action",
            oResolve : [{}],
            expectedResult : true,
            expectedGetMatchingTargetsIntent: {
                "semanticObject": "Object",
                "action": "action",
                "formFactor": "phone",
                "appSpecificRoute": undefined,
                "contextRaw": undefined,
                "params": {}
            }
        },
        {
            testDescription: "Parameters are passed",
            sCurrentFormFactor: "phone",
            sIntent: "#Object-action?p1=v1&p2=v2",
            oResolve : [],
            expectedResult : false,
            expectedGetMatchingTargetsIntent: {
                "semanticObject": "Object",
                "action": "action",
                "formFactor": "phone",
                "params": {
                    "p1": [ "v1" ],
                    "p2": [ "v2" ]
                },
                "appSpecificRoute": undefined,
                "contextRaw": undefined
            }
        },
        {
            testDescription: " emtpy hash is processed",
            sCurrentFormFactor: "phone",
            sIntent: "#",
            oResolve : [],
            expectedResult : true,
            expectedGetMatchingTargetsIntent: undefined
        }
    ].forEach(function (oFixture) {
        asyncTest("_isIntentSupportedOne: calls _getMatchingInbounds with the expected shell hash when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]);

            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.oResolve).promise()
            );

            // Act
            oSrvc._isIntentSupportedOne(oFixture.sIntent).done(function (oResult) {
                ok(true, "promise was resolved");
                equal(oResult, oFixture.expectedResult, "result ok");
                if (oFixture.expectedGetMatchingTargetsIntent) {
                    deepEqual(oSrvc._getMatchingInbounds.getCall(0).args[0], oFixture.expectedGetMatchingTargetsIntent,
                    "_getMatchingInbounds was called with the expected shell hash");
                } else {
                    equal(oSrvc._getMatchingInbounds.called, false, " _getMatchingInbounds not called!");
                }
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });
        });
    });

    [
        {
            testDescription: "multiple intents are given",
            aInbounds: [{
                "semanticObject": "Action",
                "action": "toappnavsample",
                "title": "Title",
                "resolutionResult": {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                    "text": "Text",
                    "ui5ComponentName": "sap.ushell.demo.Inbound",
                    "applicationDependencies": {
                        "name": "sap.ushell.demo.Inbound",
                        "self": {
                            "name": "sap.ushell.demo.Inbound"
                        }
                    },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {}
                }
            }, {
                "semanticObject": "Object",
                "action": "action",
                "title": "Object action",
                "resolutionResult": {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                    "text": "Text",
                    "ui5ComponentName": "sap.ushell.demo.Inbound",
                    "applicationDependencies": {
                        "name": "sap.ushell.demo.Inbound",
                        "self": {
                            "name": "sap.ushell.demo.Inbound"
                        }
                    },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "notallowed",
                    "parameters": {
                        "P1": {
                            required: true
                        }
                    }
                }
            }],
            sCurrentFormFactor: "desktop",
            aIsIntentSupportedArg: [
                "#Action-toappnavsample", "#Object-action?P1=V1", "#Action-nonexisting"
            ],
            expectedResult: {
                "#Action-toappnavsample": {
                    "supported": true
                },
                "#Object-action?P1=V1": {
                    "supported": true
                },
                "#Action-nonexisting": {
                    "supported": false
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("isIntentSupported: works as expected when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds(oFixture.aInbounds);

            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Act
            oSrvc.isIntentSupported(oFixture.aIsIntentSupportedArg).done(function (oResult) {
                ok(true, "promise was resolved");
                deepEqual(oResult, oFixture.expectedResult, "result ok");
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });
        });
    });


    [
        {
            testDescription: "Generic semantic object is passed",
            sCurrentFormFactor: "mobile",
            sIntent: "#*-action"
        },
        {
            testDescription: "empty semantic object is passed",
            sCurrentFormFactor: "mobile",
            sIntent: "#-action"
        },
        {
            testDescription: "* is passed in action",
            sCurrentFormFactor: "mobile",
            sIntent: "#Object-*"
        },
        {
            testDescription: "blank is passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        },
        {
            testDescription: "many blanks are passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        }
    ].forEach(function (oFixture) {
        asyncTest("_isIntentSupportedOne: rejects promise when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]);
            sinon.stub(sap.ushell.utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([{/*empty tm*/}]).promise()
            );

            // Act
            oSrvc._isIntentSupportedOne(oFixture.sIntent).done(function () {
                ok(false, "promise was rejected");
            }).fail(function () {
                ok(true, "promise was rejected");
            }).always(function () {
                start();
            });
        });
    });

    [
        {
            testDescription: "parameter is optional with default value",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "val"
                        }
                    }
                }
            },
            expected: "[name:[val]]<?>"
        },
        {
            testDescription: "parameter is optional with filter value",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "val"
                        }
                    }
                }
            },
            expected: "[name:val]<?>"
        },
        {
            testDescription: "parameter is required with both filter and default value",
            oSignature: {
                parameters: {
                    name: {
                        required: true,
                        filter: {
                            value: "val1"
                        },
                        defaultValue: {
                            value: "val2"
                        }
                    }
                }
            },
            expected: "name:val1[val2]<?>"
        },
        {
            testDescription: "parameter has regexp format",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "(100|1000)",
                            format: "regexp"
                        }
                    }
                }
            },
            expected: "[name:/(100|1000)/]<?>"
        },
        {
            testDescription: "parameter has reference format",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "UserDefault.currency",
                            format: "reference"
                        }
                    }
                }
            },
            expected: "[name:@UserDefault.currency]<?>"
        },
        {
            testDescription: "parameter has required default and filter parameter both in reference format",
            oSignature: {
                parameters: {
                    name: {
                        required: true,
                        filter: {
                            value: "UserDefault.currency",
                            format: "reference"
                        },
                        defaultValue: {
                            value: "UserDefault.type",
                            format: "reference"
                        }
                    }
                }
            },
            expected: "name:@UserDefault.currency[@UserDefault.type]<?>"
        },
        {
            testDescription: "parameter has unknown format",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "SOMETHING STRANGE"
                        }
                    }
                }
            },
            expected: "[name:[?Hi]]<?>"
        },
        {
            testDescription: "additional parameters are allowed",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "SOMETHING STRANGE"
                        }
                    }
                },
                additionalParameters: "allowed"
            },
            expected: "[name:[?Hi]]<+>"
        },
        {
            testDescription: "additional parameters are ignored",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "SOMETHING STRANGE"
                        }
                    }
                },
                additionalParameters: "ignored"
            },
            expected: "[name:[?Hi]]<o>"
        },
        {
            testDescription: "additional parameters are notallowed",
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "SOMETHING STRANGE"
                        }
                    }
                },
                additionalParameters: "notallowed"
            },
            expected: "[name:[?Hi]]<->"
        },
        {
            testDescription: "no parameters specified",
            oSignature: {
                parameters: {},
                additionalParameters: "ignored"
            },
            expected: "<no params><o>"
        }
    ].forEach(function (oFixture) {

        test("_compactSignatureNotation: returns expected compact notation when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]);
            strictEqual(oSrvc._compactSignatureNotation(oFixture.oSignature),
                oFixture.expected, "got expected compact notation");
        });
    });


    [
        {
            testDescription: "no parameters are specified in URL",
            oDefaultedParamNames: [],
            sResolutionResultUrl: "/some/url",
            expectedResolutionResultUrl: "/some/url" // no parameter is even added
        },
        {
            testDescription: "default parameters specified",
            oDefaultedParamNames: ["Name1", "Name2"],
            sResolutionResultUrl: "/some/url",
            expectedResolutionResultUrl: "/some/url?sap-ushell-defaultedParameterNames=%5B%22Name1%22%2C%22Name2%22%5D"
        },
        {
            testDescription: "url contains a parameter already",
            oDefaultedParamNames: ["Name2", "Name1"],
            sResolutionResultUrl: "/some/url?urlparam1=foo",
            expectedResolutionResultUrl: "/some/url?urlparam1=foo&sap-ushell-defaultedParameterNames=%5B%22Name1%22%2C%22Name2%22%5D"
        },
        {
            testDescription: "parameter names contain '&' and '?'",
            oDefaultedParamNames: ["Nam&2", "Na?me1"],
            sResolutionResultUrl: "/some/url?urlparam1=foo",
            expectedResolutionResultUrl: "/some/url?urlparam1=foo&sap-ushell-defaultedParameterNames=%5B%22Na%3Fme1%22%2C%22Nam%262%22%5D"
        }
    ].forEach(function (oFixture) {

        asyncTest("_resolveHashFragment: correctly adds sap-ushell-defaultedParameterNames when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]),
                aFakeMatchingTargets = [{
                    defaultedParamNames: oFixture.oDefaultedParamNames,
                    resolutionResult: {
                        url : oFixture.sResolutionResultUrl
                    },
                    inbound : {
                        resolutionResult : {
                            applicationType : "SAPUI5",
                            additionalInformation : "SAPUI5.Component=com.sap.cus",
                            url : oFixture.sResolutionResultUrl
                        }
                    },
                    intentParamsPlusAllDefaults : []
                }];

            // returns the default parameter names after resolution
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(aFakeMatchingTargets).promise()
            );

            oSrvc._resolveHashFragment("SO-action")
                .done(function (oResolutionResult) {
                    ok(true, "promise was resolved");
                    strictEqual(oResolutionResult.url, oFixture.expectedResolutionResultUrl,
                        "defaulted parameter names were correctly appended to result url");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    [
        {
            testDescription: "Sample inbound + additional parameters allowed",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "allowed"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""]
                }
            },
            expectedSortString: "x TECM=0 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=006 RFRE=998 TECP=2"
        },
        {
            testDescription: "Sample inbound + additional parameters ignored",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "ignored"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""],
                    "sap-ui-tech-hint" : ["WDA"]
                }
            },
            expectedSortString: "x TECM=2 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=005 RFRE=998 TECP=2"
        },
        {
            testDescription: "Sample inbound + additional parameters ignored, tech hint off",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "ignored"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""],
                    "sap-ui-tech-hint" : ["GUI"]
                }
            },
            expectedSortString: "x TECM=0 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=005 RFRE=998 TECP=2"
        }
    ].forEach(function (oFixture) {

        test("_matchToInbound: returns expected sort string when " + oFixture.testDescription, function () {
            var oSampleInbound = {
                "semanticObject": "Object", "action": "action",
                "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                    "applicationType": "URL",
                    "sap.ui" : { "technology" : "WDA" },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                    "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
                },

                "signature": oFixture.oInboundSignature,
                "title": "Application State Example (Icons)"
            },
            oSrvc = createServiceWithInbounds([]),
            oMatchResult = oSrvc._matchToInbound(oFixture.oParsedShellHash, oSampleInbound, {}, {});

            strictEqual(oMatchResult.matches, true, "the intent has matched the inbound");
            if (!oMatchResult.matches) {
                return;
            }

            strictEqual(oMatchResult.priorityString, oFixture.expectedSortString, "Got Expected priority string");
        });
    });

    // parameter mapping
    [
        {
            testDescription: " trivial no rename",
            sParamName : "P1",
            oValue : ["P1V"],
            "intentParamsPlusAllDefaults" : {
                "P1" : ["PV1", "PV2"],
                "P2" : ["1000"],
                "sap-system" : ["AX1"]
            },
            "oSignature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "ParamName2": {
                        "required": true
                    }
                }
            },
            expectedResult : "P1"
        },
        {
            testDescription: " normal rename",
            sParamName : "P1",
            oValue : [ "Pv1"],
            "oSignature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "ParamName2": {
                        "required": true
                    },
                    "P1": {
                        "renameTo" : "P1ren",
                        "required": true
                    }
                }
            },
            expectedResult : "P1ren"
        },
        {
            testDescription: " no rename because complex value",
            sParamName : "P1",
            oValue : {},
            "oSignature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "ParamName2": {
                        "required": true
                    },
                    "P1": {
                        "renameTo" : "P1ren",
                        "required": true
                    }
                }
            },
            expectedResult : "P1"
        }
    ].forEach(function (oFixture) {
        test("getRenameParameterName when " + oFixture.testDescription, function () {
            var oFakeAdapter = {
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([]).promise()
                    )
                };
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});
            // Act
            var res = oSrvc._getRenameParameterName(oFixture.sParamName, oFixture.oSignature, oFixture.oValue);
            equal(res, oFixture.expectedResult,"renamed paramter ok");
        });
    });

    [
        {
            testDescription: " no parameters in mapping",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {},
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "required": true
                            },
                            "P3": {
                                "renameTo" : "P3ren",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {},
                "mappedIntentParamsPlusSimpleDefaults" : {},
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "required": true
                            },
                            "P3": {
                                "renameTo" : "P3ren",
                                "required": true
                            }
                        }
                    }
                }
            }
        },
        {
            testDescription: " rename rule but no value, object removed",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "P4" : {},
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "required": true
                            },
                            "P3": {
                                "renameTo" : "P1ren",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "P4" : {},
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "P1" : ["PV1", "PV2"],
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "required": true
                            },
                            "P3": {
                                "renameTo" : "P1ren",
                                "required": true
                            }
                        }
                    }
                }
            }
        },
        {
            testDescription: " rename rule but complex value thus no rename, sap-system renamed",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : { "extended" : 1},
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "ParamName2": {
                                "required": true
                            },
                            "sap-system": {
                                "renameTo" : "MyCorpSystem"
                            },
                            "P1": {
                                "renameTo" : "P1ren",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : { "extended" : 1},
                    "P2" : ["1000"],
                    "sap-system" : ["AX1"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "P2" : ["1000"],
                    "MyCorpSystem" : ["AX1"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "ParamName2": {
                                "required": true
                            },
                            "sap-system": {
                                "renameTo" : "MyCorpSystem"
                            },
                            "P1": {
                                "renameTo" : "P1ren",
                                "required": true
                            }
                        }
                    }
                }
            }
        },
        {
            testDescription: " rename rule with collision of parameters in target",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "Ptarget" : ["1000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "renameTo" :"Ptarget",
                                "required": true
                            },
                            "P2": {
                                "renameTo" : "Ptarget",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "Ptarget" : ["1000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "renameTo" :"Ptarget",
                                "required": true
                            },
                            "P2": {
                                "renameTo" : "Ptarget",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"Ptarget\""
        },
        {
            testDescription: " rename rule with clobbering P1 -> P2",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "renameTo" :"P2",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "P2" : ["1000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "renameTo" :"P2",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"P2\""
        },
        {
            testDescription: " rename rule with clobbering P2 -> P1",
            oMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "renameTo" :"P1",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedMatchingTarget : {
                "intentParamsPlusAllDefaults" : {
                    "P1" : ["1000"],
                    "P2" : ["2000"]
                },
                "mappedIntentParamsPlusSimpleDefaults" : {
                    "P1" : ["1000"]
                },
                "inbound" : {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P2": {
                                "renameTo" :"P1",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedErrorLog : "collision of values during parameter mapping : \"P2\" -> \"P1\""
        }
    ].forEach(function (oFixture) {
        test("getRenameParameterName when " + oFixture.testDescription, function () {
            var oFakeAdapter = {
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([]).promise()
                    )
                };
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});
            // Act
            var oErrorLog = sinon.stub(jQuery.sap.log,"error");
            oSrvc._mapParameterNamesAndRemoveObjects(oFixture.oMatchingTarget);
            deepEqual(oFixture.oMatchingTarget, oFixture.expectedMatchingTarget, "renamed paramter ok");
            if (oFixture.expectedErrorLog) {
                ok(oErrorLog.calledWith(oFixture.expectedErrorLog)," error log was called");
            } else {
                equal(oErrorLog.callCount,0,"error log not called");
            }
            jQuery.sap.log.error.restore();
        });
    });

    // end of parameter mapping atomic function tests

    asyncTest("_constructFallbackResolutionResult: logs an error when fallback function is passed as undefined", function () {
        var oSrvc = createServiceWithInbounds([]);

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        oSrvc._constructFallbackResolutionResult(
            {  /*oMatchingTarget*/
                intentParamsPlusAllDefaults: {},
                defaultedParamNames: []
            },
            undefined /*fnBoundFallback*/,
            "#Action-toappnavsample"/*sFixedHashFragment*/
        )
        .done(function () {
            ok(false, "the promise returned by _constructFallbackResolutionResult was rejected");
        })
        .fail(function (sErrorMessage) {
            var iTimesErrorCalled;
            ok(true, "the promise returned by _constructFallbackResolutionResult was rejected");

            strictEqual(sErrorMessage, "Cannot resolve hash fragment: no fallback provided.",
                "the promise was rejected with expected error message");

            // test warnings
            strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was called 0 times");

            // test error message
            iTimesErrorCalled = jQuery.sap.log.error.getCalls().length;
            strictEqual(iTimesErrorCalled, 1, "jQuery.sap.log.warning was called 1 time");
            if (iTimesErrorCalled) {
                deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot resolve hash fragment",
                    "#Action-toappnavsample has matched an inbound that cannot be resolved client side and no resolveHashFragmentFallback method was implemented in ClientSideTargetResolutionAdapter",
                    "sap.ushell.services.ClientSideTargetResolution"
                ], "the error was logged as expected");
            }
        })
        .always(function () { start(); });
    });

    asyncTest("resolveHashFragment: allows adapter to not implement fallback method", function () {
        var oFakeAdapter = {
            getInbounds: sinon.stub().returns(
                new jQuery.Deferred().resolve([]).promise()
            )
        };

        var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, null);

        sinon.stub(oSrvc, "_resolveHashFragment").returns(new jQuery.Deferred().resolve({}).promise());

        try {
            oSrvc.resolveHashFragment("#Action-toappnavsample")
                .always(function () {
                    var iResolveHashFragmentCallCount = oSrvc._resolveHashFragment.getCalls().length;
                    strictEqual(iResolveHashFragmentCallCount, 1, "_resolveHashFragment was called 1 time");
                    if (iResolveHashFragmentCallCount === 1) {
                        strictEqual(typeof oSrvc._resolveHashFragment.getCall(0).args[1], "undefined", "_resolveHashFragment was called with undefined fallback function");
                    }

                    start();
                });
        } catch (oError) {
            ok(false, "resolveHashFragment did not throw an exception");
            start();
        }
    });

    /*
     * generate a string of around iCnt characters
     */
    function genStr(sStr, iCnt) {
        var s = sStr;
        while (s.length < iCnt) {
            s = s + sStr;
        }
        return s;
    }

    [
        {
            testDescription: "empty query",
            sQuery: "",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJECT=param1%2521A%2525param2%2521B"
        },
        {
            testDescription: "empty query and no parameters",
            sQuery: "",
            oParamsToInject: {},
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: ""
        },
        {
            testDescription: "no parameters",
            sQuery: "A=B&C=D",
            oParamsToInject: {},
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "A=B&C=D"
        },
        {
            testDescription: "P_OBJECT= parameter has some parameters already assigned",
            sQuery: "P1=V1&P_OBJECT=X%2521Y%2525ZZZ%2521KKK&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P_OBJECT=X%2521Y%2525ZZZ%2521KKK%2525param1%2521A%2525param2%2521B&P2=V2"
        },
        {
            testDescription: "P_OBJECT= parameter is in the middle of the query string",
            sQuery: "P1=V1&P_OBJECT=&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P_OBJECT=param1%2521A%2525param2%2521B&P2=V2"
        },
        {
            testDescription: "P_OBJECT= parameter is at the beginning of the query string",
            sQuery: "P_OBJECT=&P1=V1&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJECT=param1%2521A%2525param2%2521B&P1=V1&P2=V2"
        },
        {
            testDescription: "P_OBJECT= not passed in query string",
            sQuery: "P1=V1&P2=V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B"
        },
        {
            testDescription: "P_OBJECT# parameter has some parameters already assigned, and # is used for assignment, and ! is used for separator",
            sQuery: "P1#V1!P_OBJECT#X%2521Y%2525ZZZ%2521KKK!P2#V2",
            oParamsToInject: {
                "param1": ["A"],
                "param2": ["B"]
            },
            sParamDelimiter: "!",
            sAssignDelimiter: "#",
            expectedQuery: "P1#V1!P_OBJECT#X%2521Y%2525ZZZ%2521KKK%2525param1%2521A%2525param2%2521B!P2#V2"
        },
        {
            testDescription: "empty query, but exactly 132 characters in P_OBJECT",
            sQuery: "",
            oParamsToInject: {
                "param1": ["0123456789"],   // 22 characters = 16 characters + 3 (%xx for =) + 3 (%xx for &)
                "param2": ["0123456789"],   // 22 characters
                "param3": ["0123456789"],   // 22 characters
                "param4": ["0123456789"],   // 22 characters
                "param5": ["0123456789"],   // 22 characters
                "param6": ["0123456789xyz"] // 22 characters (no & separator)
                                            // -------------
                                            // 132
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
        },
        {
            testDescription: "empty query, but exactly 133 characters in P_OBJECT (132 is the limit)",
            sQuery: "",
            oParamsToInject: {
                "param1": ["0123456789"], // 22 characters = 16 characters + 3 (%xx for =) + 3 (%xx for &)
                "param2": ["0123456789"], // 22 characters
                "param3": ["0123456789"], // 22 characters
                "param4": ["0123456789"], // 22 characters
                "param5": ["0123456789"], // 22 characters
                "param6": ["0123456789xyzK"] // 23 characters (no & separator)
                                          // -------------
                                          // 133
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJ1=K&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
        },
        {
            testDescription: "empty query, but more than 132 characters with break at param separator",
            sQuery: "",
            oParamsToInject: {
                "param1": ["0123456789"],
                "param2": ["0123456789"],
                "param3": ["0123456789"],
                "param4": ["0123456789"],
                "param5": ["0123456789"],
                "param6": ["0123456789xyz"],  // all that can fit in a P_OBJECT parameter
                "param7": ["A"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJ1=%2525param7%2521A&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xyz"
        },
        {
            testDescription: "empty query, but more than 132 characters with break inbetween param separator",
            sQuery: "",
            oParamsToInject: {
                "param1": ["0123456789"],
                "param2": ["0123456789"],
                "param3": ["0123456789"],
                "param4": ["0123456789"],
                "param5": ["0123456789"],
                "param6": ["0123456789xy"],
                "param7": ["A"]
            },
            sParamDelimiter: "&",
            sAssignDelimiter: "=",
            expectedQuery: "P_OBJ1=25param7%2521A&P_OBJECT=param1%25210123456789%2525param2%25210123456789%2525param3%25210123456789%2525param4%25210123456789%2525param5%25210123456789%2525param6%25210123456789xy%25"
       }
    ].forEach(function (oFixture) {
        test("_injectEffectiveParametersIntoWebguiPobjectParam: works as expected when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]),
                sGotQuery = oSrvc._injectEffectiveParametersIntoWebguiPobjectParam(oFixture.sQuery, oFixture.oParamsToInject, oFixture.sParamDelimiter, oFixture.sAssignDelimiter);

            strictEqual(sGotQuery, oFixture.expectedQuery, "obtained expected result");
        });
    });

    [
        {
            testDescription: "query is empty, there is no content",
            sParamName: "SOME_PARAM",
            sQuery: "",
            sQueryParamDelimiter: "anything",
            sQueryParamAssignDelimiter: "anything",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "",
                found: false
            }
        },
        {
            testDescription: "non-existing parameter name",
            sParamName: "NOT_IN_QUERY",
            sQuery: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "P1=V1&P2=V2&P_OBJECT=param1%2521A%2525param2%2521B",
                found: false
            }
        },
        {
            testDescription: "existing parameter name",
            sParamName: "THE_PARAMETER",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return sParam; },
            expectedResult: {
                query: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
                found: true
            }
        },
        {
            testDescription: "middle parameter is deleted",
            sParamName: "P2",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return; },
            expectedResult: {
                query: "P1=V1&THE_PARAMETER=param1%2521A%2525param2%2521B",
                found: true
            }
        },
        {
            testDescription: "last parameter is deleted",
            sParamName: "P3",
            sQuery: "P1=V1&P2=V2&P3=V3",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return; },
            expectedResult: {
                query: "P1=V1&P2=V2",
                found: true
            }
        },
        {
            testDescription: "existing parameter is modified",
            sParamName: "THE_PARAMETER",
            sQuery: "P1=V1&P2=V2&THE_PARAMETER=param1%2521A%2525param2%2521B",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return "something else"; },
            expectedResult: {
                query: "P1=V1&P2=V2&something else",
                found: true
            }
        },
        {
            testDescription: "existing parameter is emptied",
            sParamName: "P2",
            sQuery: "P1=V1&P2=<to be removed>&P3=V3",
            sQueryParamDelimiter: "&",
            sQueryParamAssignDelimiter: "=",
            fnAmend: function (sParam) { return "P2="; },
            expectedResult: {
                query: "P1=V1&P2=&P3=V3",
                found: true
            }
        }
    ].forEach(function (oFixture) {
        test("_amendGuiParam works as expected when " + oFixture.testDescription, function () {
            // Arrange
            var oSrvc = createServiceWithInbounds([]);

            // Act
            var oResult = oSrvc._amendGuiParam(
                oFixture.sParamName,
                oFixture.sQuery,
                oFixture.sQueryParamDelimiter,
                oFixture.sQueryParamAssignDelimiter,
                oFixture.fnAmend
            );

            // Assert
            deepEqual(oResult, oFixture.expectedResult, "method returned the expected result object");
        });
    });


    [
        {
            sUrl: "%7etransaction=SU01",
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=SU01%20", // %20 does not matter
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=*SU01%20", // %20 does not matter
            expected: {
                hasParameters: false,
                transactionParamName: "%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=SU01%20%3d",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=*SU01%20%3d",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=*SU01",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "*SU01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=SAPAPO%2fRES01",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "SAPAPO%2fRES01",
                parameters: []
            }
        },
        {
            sUrl: "?%7etransaction=/SAP/APO/RES%3001",
            expected: {
                hasParameters: false,
                transactionParamName: "?%7etransaction",
                transactionCode: "/SAP/APO/RES%3001",
                parameters: []
            }
        },
        {
            sUrl: "%7etransaction=*su01%20Param1%3dValue1%3bParam2%3dValue2",
            expected: {
                hasParameters: true,
                transactionParamName: "%7etransaction",
                transactionCode: "su01",
                parameters: [
                    { "name": "Param1", "value": "Value1" },
                    { "name": "Param2", "value": "Value2" }
                ]
            }
        },
        {
            sUrl: "%7etransaction=**su01%20Param1%3dValue1%3bParam2%3dValue2",
            expected: {
                hasParameters: true,
                transactionParamName: "%7etransaction",
                transactionCode: "*su01",
                parameters: [
                    { "name": "Param1", "value": "Value1" },
                    { "name": "Param2", "value": "Value2" }
                ]
            }
        }
    ].forEach(function (oFixture) {
        test("_parseWebguiTransactionQueryParam: parses correctly when url is " + oFixture.sUrl, function () {
            var oSrvc = createServiceWithInbounds([]);

            deepEqual(
                oSrvc._parseWebguiTransactionQueryParam(oFixture.sUrl),
                oFixture.expected,
                "obtained expected result"
            );
        });
    });

    [
        {
            testDescription: "simple transaction parameter, no parameters to interpolate",
            sQuery: "%7etransaction=SU01",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "%7etransaction=SU01"  // '*' is added
        },
        {
            testDescription: "transaction parameter with leading question mark, no parameters to interpolate",
            sQuery: "?%7etransaction=SU01",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=SU01" // leading "?" is preserved
        },
        {
            testDescription: "transaction without parameters and parameters to interpolate",
            sQuery: "?%7etransaction=SU01",
            oParamsToInject: {
                "Param1" : ["Value1"],
                "Param2" : ["Value2"]
            },
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2" // leading "?" is preserved
        },
        {
            testDescription: "transaction without parameters with trailing %20 and parameters to interpolate",
            sQuery: "?%7etransaction=SU01%20",
            oParamsToInject: {
                "Param1" : ["Value1"],
                "Param2" : ["Value2"]
            },
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2"
        },
        {
            testDescription: "transaction without parameters with trailing %20 and no parameters to interpolate",
            sQuery: "?%7etransaction=SU01%20",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=SU01"
        },
        {
            testDescription: "transaction with parameters (and leading transaction '*') but no parameters to interpolate",
            sQuery: "?%7etransaction=*SU01%20Param1%3dValue1%3bParam2%3dValue2",
            oParamsToInject: {},
            expectedErrorArgs: undefined,
            expectedQuery: "?%7etransaction=*SU01%20PARAM1%3dValue1%3bPARAM2%3dValue2"
        },
        {
            testDescription: "multiple equals (=) in transaction query parameter, with parameters to inject",
            sQuery: "%7etransaction=SU01%20&Foo=Fie",
            oParamsToInject: {},
            expectedErrorArgs: [
                "Found more than one assignment ('=') in the transaction query parameter",
                "Only one '=' sign is expected in %7etransaction=SU01%20&Foo=Fie",
                "sap.ushell.services.ClientSideTargetResolution"
            ],
            expectedQuery: "%7etransaction=SU01%20&Foo=Fie"
        },
        {
            testDescription: "input does not specify a transaction name",
            sQuery: "%7etransaction=",
            oParamsToInject: {},
            expectedErrorArgs: [
                "The transaction query parameter must specify at least the transaction name",
                "Got %7etransaction= instead.",
                "sap.ushell.services.ClientSideTargetResolution"
            ],
            expectedQuery: "%7etransaction="
        }
    ].forEach(function (oFixture) {
        test("_injectEffectiveParametersIntoWebguiQueryParam: works as expected when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]),
                sGotQuery,
                iLogFunctionCallCount;

            sinon.stub(jQuery.sap.log, "error");

            sGotQuery = oSrvc._injectEffectiveParametersIntoWebguiQueryParam(oFixture.sQuery, oFixture.oParamsToInject);

            strictEqual(sGotQuery, oFixture.expectedQuery, "obtained expected result");

            iLogFunctionCallCount = jQuery.sap.log.error.getCalls().length;
            if (oFixture.expectedErrorArgs && jQuery.isArray(oFixture.expectedErrorArgs)) {
                strictEqual(iLogFunctionCallCount, 1, "jQuery.sap.log.error was called 1 time");
                if (iLogFunctionCallCount) {
                    deepEqual(jQuery.sap.log.error.getCall(0).args, oFixture.expectedErrorArgs, "jQuery.sap.log.error was called with the expected arguments");
                }
            } else {
                strictEqual(iLogFunctionCallCount, 0, "jQuery.sap.log.error was called 0 times");
            }
        });
    });


    [
        /*
         * Tests for _selectSystemAliasDataName: https is always preferred over http
         */
        {
            testDescription: "only https available and window.location protocol is 'http'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "only https available and window.location protocol is 'https'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is http",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is https",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is 'TEST'",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "TEST",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            // tests http fallback if https is not available
            testDescription: "only https is available and window.location protocol is 'TEST'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "TEST",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "only http is available and window.location protocol is 'https'",
            aAvailableSystemAliasData: ["http"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "http" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "no http or https is provided in the list of available system alias data",
            aAvailableSystemAliasData: ["foo", "fie"],
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: undefined
        }
    ].forEach(function (oFixture) {
        test("_selectSystemAliasDataName: selects " + oFixture.expectedSystemAliasDataName + " when " + oFixture.testDescription, function () {
            var oSrvc = createServiceWithInbounds([]),
                oSystemAliasCollection = {};

            // Transform the fixture to an object accepted as first argument
            oFixture.aAvailableSystemAliasData.forEach(function (sFixtureType) {
                oSystemAliasCollection[sFixtureType] = {};
            });

            // Act
            var sSelectedSystemAliasDataName = oSrvc._selectSystemAliasDataName(oSystemAliasCollection, oFixture.sWindowLocationProtocol);

            // Assert
            strictEqual(sSelectedSystemAliasDataName, oFixture.expectedSystemAliasDataName, "selected expected data name");
        });
    });

    (function () {
        /*
         * Tests for interpolation of system alias data into a url
         */

        // a fake lookup table reporting data of all known system aliases (for all the tests)
        var oAdapterKnownSystemAliases = {
            "" : O_LOCAL_SYSTEM_ALIAS,
            "UR3CLNT120": {         // <- convenience index for this test
               http: {
                   id: "UR3CLNT120_HTTP",
                   host: "example.corp.com",
                   port: 50055,
                   pathPrefix: ""
               },
               https: {
                   id: "UR3CLNT120_HTTPS",
                   host: "example.corp.com",
                   port: 44355,
                   pathPrefix: ""
               },
               rfc: {
                   id: "UR3CLNT120",
                   systemId: "UR3",
                   host: "example.corp.com",
                   service: 0,
                   loginGroup: "PUBLIC",
                   sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                   sncQoPR3: "8"
               },
               id: "UR3CLNT120",
               client: "120",
               language: ""
            },
            "LANGEN": {
                https: {
                    id: "LANGEN_120_HTTPS",
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    id: "LANGEN_120_RFC",
                    systemId: "",
                    host: "10.96.103.50",
                    service: 55,
                    loginGroup: "",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "LANGEN",
                client: "000",
                language: "EN"
            },
            "CLIENT120": {
                "http": {
                    "id": "PB8CLNT120_V1_HTTP",
                    "host": "example.corp.com",
                    "port": 44335,
                    "pathPrefix": ""
                },
                "https": {
                    "id": "PB8CLNT120_V1_HTTPS",
                    "host": "example.corp.com",
                    "port": 44335,
                    "pathPrefix": ""
                },
                "rfc": {
                    "id": "PB8CLNT120_V1",
                    "systemId": "",
                    "host": "10.66.50.245",
                    "service": 35,
                    "loginGroup": "",
                    "sncNameR3": "p/secude:CN=PB8, O=SAP-AG, C=DE",
                    "sncQoPR3": "1"
                },
                id: "CLIENT120",
                client: "120",
                language: ""
            },
            "CLIENT001LANGDE": {
                rfc: {
                    id: "CLIENT001LANGDE",
                    systemId: "CSS",
                    host: "example.corp.com",
                    service: 0,
                    loginGroup: "PUBLIC",
                    sncNameR3: "",
                    sncQoPR3: ""
                },
                id: "CLIENT001LANGDE",
                client: "001",
                language: "DE"
            }
        };

        [
            {
                testGoal: "URL is correctly stripped",
                testDescription: "system alias is undefined",
                sSystemAlias: undefined,
                sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
                sURIType: "WDA",
                expectedUrl: "/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/"
            },
            {
                testGoal: "sap-client and sap-language parameters are removed from url",
                testDescription: "system alias is undefined",
                sSystemAlias: undefined,
                sUrl: "https://example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=EN",
                sURIType: "TR",
                expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&="
            },
            {
                testGoal: "strips local URL path prefix leaving leading forward slash in WDA urls",
                testDescription: 'system alias is ""', // note local system alias
                sSystemAlias: "", // local system alias does not result into path strip
                sUrl: "/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
                sURIType: "WDA",
                expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/"
            },
            {
                testGoal: "keeps URL path as is for TR urls",
                testDescription: 'system alias is ""',
                sSystemAlias: "", // local system alias does not result into path strip
                sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=",
                sURIType: "TR",
                expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&="
            }
        ].forEach(function (oFixture) {
            asyncTest("_stripURI: " + oFixture.testGoal + " when " + oFixture.testDescription, function () {
                var oFakeAdapter = {
                    resolveSystemAlias: function (sSystemAlias) {
                        if (oAdapterKnownSystemAliases.hasOwnProperty(sSystemAlias)) {
                            return new jQuery.Deferred().resolve(oAdapterKnownSystemAliases[sSystemAlias]).promise();
                        }
                        return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
                    },
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([]).promise()
                    ),
                    resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                        return new jQuery.Deferred().resolve({ url : "_stripURI fallback :-(" + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
                    }
                };

                var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, null),
                    oURI = new URI(oFixture.sUrl);

                // Act
                oSrvc._stripURI(oURI, oFixture.sSystemAlias, oFixture.sURIType)
                    .done(function (oGotURI){
                        ok(true, "promise was resolved");
                        strictEqual(oGotURI.toString(), oFixture.expectedUrl, "obtained expected URL");
                    })
                    .fail(function (){
                        ok(false, "promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
            });
        });


        [
            {
                testDescription: "relative app/transaction url, no sap-system interpolation",
                sSapSystem: undefined, // one of aSystemAliasDataCollection
                sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",  // no system alias -> relative path
                expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
            },
            {
                testDescription: "relative app/transaction url, with sap-system interpolation",
                sSapSystem: "UR3CLNT120",
                sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",  // no system alias -> relative path
                expectedUrl: "https://example.corp.com:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
            },
            {
                testDescription: "absolute app/wda url with pre-filled client and language, with sap-system (with another client, empty language) interpolation",
                sSapSystem: "CLIENT120",
                sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
                expectedUrl: "https://example.corp.com:44335/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=120&sap-language=EN"
            },
            {
                testDescription: "absolute app/wda url with pre-filled client and language, with sap-system having DE language and another client interpolation",
                sSapSystem: "CLIENT001LANGDE",
                sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=120&sap-language=EN",
                expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=001&sap-language=DE"
            },
            {
                testDescription: "absolute app/wda url with sap-wd-configId parameter, language, client",
                sSapSystem: "CLIENT001LANGDE",
                sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=120&sap-language=EN",
                expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=001&sap-language=DE"
            }
        ].forEach(function (oFixture) {
            asyncTest("_spliceSapSystemIntoURI: URI returns expected url when " + oFixture.testDescription, function () {
                var oFakeAdapter = {
                    resolveSystemAlias: function (sSystemAlias) {
                        if (oAdapterKnownSystemAliases.hasOwnProperty(sSystemAlias)) {
                            return new jQuery.Deferred().resolve(oAdapterKnownSystemAliases[sSystemAlias]).promise();
                        }
                        return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
                    },
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([]).promise()
                    ),
                    resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                        return new jQuery.Deferred().resolve({ url : "_spliceSapSystemIntoURI fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
                    }
                };

                var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, null),
                    oURI = new URI(oFixture.sUrl);

                // Act
                oSrvc._spliceSapSystemIntoURI(oURI, oFixture.sSapSystem, undefined /*sURIType*/)
                    .done(function (oGotURI){
                        ok(true, "promise was resolved");
                        strictEqual(oGotURI.url, oFixture.expectedURL, "obtained expected URL");
                    })
                    .fail(function (){
                        ok(false, "promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
            });
        });

    })();

    /*
     * A complete resolveHashFragment test, mocking only AppState, check that
     * everything works semantically together (black box).
     */
    [
        {
            "testDescription": "Transaction SU01 via designer",
            "UserDefaultParameters": {},
            "intent": "Action-case1",
            "inbound": {
                "semanticObject": "Action",
                "action": "case1",
                "id": "Action-case1~6Ni",
                "title": "SU01",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "SU01",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via designer with 'sap', '~', and neutral default parameters",
            "UserDefaultParameters": {},
            "intent": "Action-case2",
            "inbound": {
                "semanticObject": "Action",
                "action": "case2",
                "id": "Action-case2~6Nj",
                "title": "SU01",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "SU01",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-theme": {
                            "defaultValue": {
                                "value": "sap_hcb",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "~PARAM": {
                            "defaultValue": {
                                "value": "tilde",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "NeutralParam": {
                            "defaultValue": {
                                "value": "neutral",
                                "format": "plain"
                            },
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20NEUTRALPARAM%3dneutral&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcb&%7ePARAM=tilde"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST",
            "UserDefaultParameters": {},
            "intent": "Action-case3",
            "inbound": {
                "semanticObject": "Action",
                "action": "case3",
                "id": "Action-case3~6Nk",
                "title": "User Maintenance WebGUI",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "User Maintenance WebGUI",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input",
            "UserDefaultParameters": {},
            "intent": "Action-case4",
            "inbound": {
                "semanticObject": "Action",
                "action": "case4",
                "id": "Action-case4~6Nl",
                "title": "Test4",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test4",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + parameter mappings",
            "UserDefaultParameters": {},
            "intent": "Action-case5",
            "inbound": {
                "semanticObject": "Action",
                "action": "case5",
                "id": "Action-case5~6Nm",
                "title": "Test5",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test5",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "pfrom": {
                            "defaultValue": {
                                "value": "pfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "tildefrom": {
                            "defaultValue": {
                                "value": "tildefrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-from": {
                            "defaultValue": {
                                "value": "sapfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "PFROM1": {
                            "renameTo": "SAP-THEME"
                        },
                        "SAP-FROM": {
                            "renameTo": "SAP-TO"
                        },
                        "TILDEFROM": {
                            "renameTo": "~TILDETO"
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01%20PFROM%3dpfrom_value%3bTILDEFROM%3dtildefrom_value&%7enosplash=1&sap-client=120&sap-from=sapfrom_value&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + parameter mappings + Not completed by COMMIT",
            "UserDefaultParameters": {},
            "intent": "Action-case6",
            "inbound": {
                "semanticObject": "Action",
                "action": "case6",
                "id": "Action-case6~6Nn",
                "title": "Test6",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test6",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3d%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "pfrom": {
                            "defaultValue": {
                                "value": "pfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "tildefrom": {
                            "defaultValue": {
                                "value": "tildefrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-from": {
                            "defaultValue": {
                                "value": "sapfrom_value",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "PFROM1": {
                            "renameTo": "SAP-THEME"
                        },
                        "SAP-FROM": {
                            "renameTo": "SAP-TO"
                        },
                        "TILDEFROM": {
                            "renameTo": "~TILDETO"
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dD%25N%3bP_OBJECT%3dpfrom%2521pfrom_value%2525sap-from%2521sapfrom_value%2525tildefrom%2521tildefrom_value%3bP_OKCODE%3dO%3fK%25A%2fI%3bP_PRGRAM%3dPROGRAM%7e1%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via Designer + sap-parameter called with intent sap-parameter with different value.",
            "UserDefaultParameters": {},
            "intent": "Action-case7?sap-parameter=valueB",
            "inbound": {
                "semanticObject": "Action",
                "action": "case7",
                "id": "Action-case7~6ND",
                "title": "Case 7",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Case 7",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-parameter": {
                            "defaultValue": {
                                "value": "valueA",
                                "format": "plain"
                            },
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-parameter=valueB"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST",
            "UserDefaultParameters": {},
            "intent": "Action-case8",
            "inbound": {
               "semanticObject": "Action",
               "action": "case8",
               "id": "Action-case8~6NE",
               "title": "Test8",
               "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "Test8",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_gemstone&sap-fiori=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-personas-runmode=0&sap-client=120&sap-language=EN",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                       "undefined": {
                           "required": false
                       }
                   }
               }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&%7eWEBGUI_ICON_TOOLBAR=0&sap-client=120&sap-fiori=1&sap-language=EN&sap-personas-runmode=0&sap-theme=sap_gemstone"
        },
        {
            "testDescription": "Transaction SU01 via Designer + forbidden parameters",
            "UserDefaultParameters": {},
            "intent": "Action-case8b",
            "inbound": {
                "semanticObject": "Action",
                "action": "case8b",
                "id": "Action-case9~6NF",
                "title": "Case 9",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Case 8b native url",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "sap-Wd-run-SC": {
                            "defaultValue": {
                                "value": "1",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-wd-auTo-detect": {
                            "defaultValue": {
                                "value": "1",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-EP-version": {
                            "defaultValue": {
                                "value": "1.32",
                                "format": "plain"
                            },
                            "required": false
                        },
                        "sap-theme": {
                            "defaultValue": {
                                "value": "sap_hcc",
                                "format": "plain"
                            },
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcc"
        },
        {
            "testDescription": "WebGui transaction via full url generation (sap.gui in resolution result)",
            "UserDefaultParameters": {},
            "oKnownSapSystemData" : { // Optional fixture parameter
                // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
                "UR3CLNT120": {         // <- convenience index for this test
                http: {
                    id: "UR3CLNT120_HTTP",
                    host: "example.corp.com",
                    port: 50055,
                    pathPrefix: ""
                },
                https: {
                    id: "UR3CLNT120_HTTPS",
                    host: "example.corp.com",
                    port: 44355,
                    pathPrefix: ""
                },
                rfc: {
                    id: "UR3CLNT120",
                    systemId: "UR3",
                    host: "example.corp.com",
                    port: 0,
                    loginGroup: "PUBLIC",
                    sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                    sncQoPR3: "8"
                },
                id: "UR3CLNT120",
                client: "120",
                language: ""
             }
            },
            "intent": "Action-case10",
            "inbound": {
                "semanticObject": "Action",
                "action": "case10",
                "id": "Action-case10~8NG",
                "title": "Test 10",
                "resolutionResult": {
                    "applicationType": "TR",
                    "sap.gui" : {
                        "transaction" : "SU01"
                    },
                    "text": "Test 10",
                    "systemAlias" : "UR3CLNT120"
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl":
                "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;~sysid=UR3;~loginGroup=PUBLIC;~messageServer=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUR3%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=8?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=en"
        },
        {
            "testDescription": "WDA transaction via full url generation",
            "UserDefaultParameters": {},
            "intent": "Action-case10",
            "oKnownSapSystemData": { // Optional fixture parameter
                // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
                "UR3CLNT120": { // <- convenience index for this test
                    http: {
                        id: "UR3CLNT120_HTTP",
                        host: "example.corp.com",
                        port: 50055,
                        pathPrefix: ""
                    },
                    https: {
                        id: "UR3CLNT120_HTTPS",
                        host: "example.corp.com",
                        port: 44355,
                        pathPrefix: ""
                    },
                    rfc: {
                        id: "UR3CLNT120",
                        systemId: "UR3",
                        host: "example.corp.com",
                        port: 0,
                        loginGroup: "PUBLIC",
                        sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                        sncQoPR3: "8"
                    },
                    id: "UR3CLNT120",
                    client: "120",
                    language: ""
                }
            },
            "inbound": {
                "semanticObject": "Action",
                "action": "case10",
                "id": "Action-case10~6NG",
                "title": "Test 10",
                "resolutionResult": {
                    "applicationType": "WDA",
                    "sap.wda" : {
                        "applicationId" : "WDAONE"
                    },
                    "text": "Test 10",
                    "systemAlias" : "UR3CLNT120"
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDAONE/?sap-client=120&sap-language=en"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + forbidden parameters",
            "UserDefaultParameters": {},
            "intent": "Action-case10",
            "inbound": {
                "semanticObject": "Action",
                "action": "case10",
                "id": "Action-case10~6NG",
                "title": "Test 10",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "Test 10",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01%20%3d&%7enosplash=1&sap-theme=sap_hcd&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "undefined": {
                            "required": false
                        }
                    }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN&sap-theme=sap_hcd"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + batch input + Not Completed by commit",
            "UserDefaultParameters": {},
            "intent": "Action-case11",
            "inbound": {
               "semanticObject": "Action",
               "action": "case11",
               "id": "Action-case11~6NH",
               "title": "Test11",
               "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "Test11",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                   "systemAlias": ""
               },
               "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
               },
               "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                       "undefined": {
                           "required": false
                       }
                   }
               }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + sap- forced parameter in LPD_CUST + Batch input + Not completed by commit",
            "UserDefaultParameters": {},
            "intent": "Action-case12",
            "inbound": {
                "semanticObject": "Action",
                "action": "case12",
                "id": "Action-case12~6NI",
                "title": "Test12",
                "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "Test12",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                   "systemAlias": ""
                },
                "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
                },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "undefined": {
                         "required": false
                      }
                   }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d012%3bP_OBJECT%3d%2525sap-theme%2521sap_gemstone%2525sap-fiori%25211%2525%257eWEBGUI_ICON_TOOLBAR%25210%2525sap-personas-runmode%25210%3bP_OKCODE%3dOKCODY%21%3bP_PRGRAM%3dTHEPROGRAM%21%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 via LPD_CUST + forbidden parameters + Batch input + Not completed by commit",
            "UserDefaultParameters": {},
            "intent": "Action-case13",
            "inbound": {
                "semanticObject": "Action",
                "action": "case13",
                "id": "Action-case13~6NJ",
                "title": "Test 13",
                "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "Test 13",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                   "systemAlias": ""
                },
                "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
                },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "undefined": {
                         "required": false
                      }
                   }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3dDYN%3bP_OBJECT%3d%2525sap-Wd-run-SC%25211%2525sap-wd-auTo-detect%25211%2525sap-EP-version%25211.32%2525sap-theme%2521sap_hcd%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dFLP_SAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction SU01 with many transaction parameters",
            "UserDefaultParameters": {},
            "intent": "Action-case16?param1=1234567890&param2=1234567890&param3=1234567890&param4=1234567890&param5=1234567890&param6=1234567890&param7=1234567890&param8=1234567890&param9=1234567890&param10=123456790&param11=1234567890&param12=1234567890&param13=1234567890&param14=1234567890&param15=1234567890&param16=1234567890&param17=1234567890&param18=1234567890&param19=1234567890&param20=123456790&param21=1234567890&param22=1234567890&param23=1234567890&param24=1234567890&param25=1234567890&param26=1234567890&param27=1234567890&param28=1234567890&param29=1234567890&param30=123456790",
            "inbound": {
                "semanticObject": "Action",
                "action": "case16",
                "id": "Action-case16~68sg",
                "title": "DisplayWebguiLongParams",
                "resolutionResult": {
                    "applicationType": "TR",
                    "additionalInformation": "",
                    "text": "DisplayWebguiLongParams",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJECT%3d%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": "",
                    "sap.ui": {
                        "technology": "GUI"
                    }
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "parameters": {},
                    "additionalParameters": "allowed"
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dTEST%3bP_CTO%3dEA%3bP_DYNNR%3d137%3bP_OBJ1%3d0%2525param15%25211234567890%2525param16%25211234567890%2525param17%25211234567890%2525param18%25211234567890%2525param19%25211234567890%2525param2%25211234%3bP_OBJ2%3d567890%2525param20%2521123456790%2525param21%25211234567890%2525param22%25211234567890%2525param23%25211234567890%2525param24%25211234567890%2525param25%252%3bP_OBJ3%3d11234567890%2525param26%25211234567890%2525param27%25211234567890%2525param28%25211234567890%2525param29%25211234567890%2525param3%25211234567890%2525para%3bP_OBJ4%3dm30%2521123456790%2525param4%25211234567890%2525param5%25211234567890%2525param6%25211234567890%2525param7%25211234567890%2525param8%25211234567890%2525para%3bP_OBJ5%3dm9%25211234567890%3bP_OBJECT%3dparam1%25211234567890%2525param10%2521123456790%2525param11%25211234567890%2525param12%25211234567890%2525param13%25211234567890%2525param14%2521123456789%3bP_OKCODE%3dOK%7e1%3bP_PRGRAM%3dPROGRAM%3bP_ROLE%3dZSAVIO%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction *SU01 via designer (note 'star' in transaction)",
            "UserDefaultParameters": {},
            "intent": "Action-case14",
            "inbound": {
                "semanticObject": "Action",
                "action": "case14",
                "id": "Action-case14~6NK",
                "title": "*SU01",
                "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "*SU01",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                   "systemAlias": ""
                },
                "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
                },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "undefined": {
                         "required": false
                      }
                   }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "Transaction *SU01 via designer (note 'star' in transaction) + parameter",
            "UserDefaultParameters": {},
            "intent": "Action-case15",
            "inbound": {
                "semanticObject": "Action",
                "action": "case15",
                "id": "Action-case15~6NL",
                "title": "Case15",
                "resolutionResult": {
                   "applicationType": "TR",
                   "additionalInformation": "",
                   "text": "Case15",
                   "url": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=*SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                   "systemAlias": ""
                },
                "deviceTypes": {
                   "desktop": true,
                   "tablet": true,
                   "phone": true
                },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "Param1": {
                         "defaultValue": {
                            "value": "Value1",
                            "format": "plain"
                         },
                         "required": false
                      }
                   }
                }
            },
            "expectedUrl": "/sap/bc/gui/sap/its/webgui;~sysid=UR3;~service=3255?%7etransaction=**SU01%20PARAM1%3dValue1&%7enosplash=1&sap-client=120&sap-language=EN"
        },
        {
            "testDescription": "resolution result, extended User Defaults, mapping of parameter names",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1refSimple",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "P2": {
                    "value": "P2Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P2ExtVal",
                            "High": null
                        }]
                    }
                }
            },
            "intent": "SO-action?P1=a&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency",
                    "sap.platform.runtime" : { "everything" : "propagated" }
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P2": { "renameTo": "P2New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P3": { "renameTo": "P3New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P4": { "renameTo": "P4New", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                        "P5": { "renameTo": "P5New", defaultValue: { value: "UserDefault.Pref5", format: "reference" } }
                    }
                }
            },
            "oOldAppStateData": {
                "selectionVariant" : {
                    "ODataFilterExpression" : "",
                    "Parameters" : [{"PropertyName": "P2", "PropertyValue": "P2Value"}],
                    "SelectOptions" : [],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            "expectedResolutionResult" : {
                  "sap.platform.runtime" : { "everything" : "propagated" },
                  "additionalInformation": "SAPUI5.Component=Currency.Component",
                  "applicationType": "SAPUI5",
                  "sap-system": undefined,
                  "text": "Currency manager (this one)",
                  "ui5ComponentName": "Currency.Component",
                  "url": "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW"
            },
            "expectedAppStateData": {
                "selectionVariant": {
                    "ODataFilterExpression" : "",
                    "Parameters": [{
                        "PropertyName": "P2New",
                        "PropertyValue": "P2Value"
                    }],
                    "SelectOptions": [{
                        "PropertyName": "P3New",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }, {
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1refSimple",
                            "High": null
                        }]
                    }],
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            "expectedUrl": "/url/to/currency?P1New=a&P4New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P3New%22%2C%22P4New%22%5D&sap-xapp-state=ASNEW"
        },
        {
            "testDescription": "P5 in appstate does not prevent transitivie non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate!)!",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1refSimple",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref5": {
                    "value": "Pref5Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P2ExtVal",
                            "High": null
                        }]
                    }
                }
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.Pref1", "format": "reference" } },
                        "P2": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.extended.Pref1", "format": "reference" } },
                        "P3": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.extended.Pref1", "format": "reference" } },
                        "P5": { "renameTo": "P1New", "defaultValue": { "value": "UserDefault.Pref5", "format": "reference" } }
                    }
                }
            },
            "oOldAppStateData": {
                "selectionVariant": {
                    "Parameters": [{ "PropertyName": "P5", "PropertyValue": "P5Value" }]
                }
            },
            "expectedAppStateData": {
                "selectionVariant": {
                    "ODataFilterExpression" : "",
                    "Parameters": [{ "PropertyName": "P1New", "PropertyValue": "P5Value" }],
                    "SelectionVariantID" : "",
                    "SelectOptions" : [],
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            "expectedUrl": "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "P5 in appstate does not prevent transitive non-substitution of dominated primitive Parameters (P5 is substituted although present in appstate) Note also that for primitive first one is chosen, for complex 2nd one?",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1refSimple",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref5": {
                    "value": "Pref5Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P5ExtVal",
                            "High": null
                        }]
                    }
                }
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "P1New", defaultValue: { value: "UserDefault.Pref1", format: "reference" } },
                        "P2": { "renameTo": "P2New", defaultValue: { value: "UserDefault.extended.Pref1", format: "reference" } },
                        "P3": { "renameTo": "P2New", defaultValue: { value: "UserDefault.extended.Pref5", format: "reference" } },
                        "P5": { "renameTo": "P1New", defaultValue: { value: "UserDefault.Pref5", format: "reference" } }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    Parameters: [{ "PropertyName": "P1New", "PropertyValue": "P5Value" }],
                    SelectOptions: [{
                        "PropertyName": "P2New",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }, {
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1refSimple",
                            "High": null
                        }]
                    }],
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    }
                }
            },
            expectedUrl: "/url/to/currency?P1New=P1refSimple&sap-ushell-defaultedParameterNames=%5B%22P1New%22%2C%22P2New%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "url compactation in WDA case with appstate and transient test",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": genStr("ABCD", 2049),
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            "renameTo": "ZZome",
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: ("BUKR=" + genStr("ABCD", 2049) + "&ZZZ=444&ZZome=Pref5Def"),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAA=1234&AAAA=4321&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZZome%22%5D&sap-xapp-state=ASNEW",
            expectedTransientCompaction: true
        },
        {
            testDescription: "assure long renames paramter names via renameTo are compacted WDA case with appstate",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "Pref1",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "SO-action?AAA=1234&AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XUXU", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: (genStr("XUXU", 2044) + "=1234&ZSOME=Pref5Def&ZZZ=444"),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&AAAA=4321&BUKR=Pref1&sap-intent-param=ASNEW2&sap-ushell-defaultedParameterNames=%5B%22BUKR%22%2C%22KORK%22%2C%22ZSOME%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "assure sap-ushell-defaulted-parameter names can be compacted (very long parameter name) url compactation in WDA case with appstate",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: ("AAAA=4321&BUKR=P1Def" +
                    "&" + genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444") +
                "&sap-ushell-defaultedParameterNames=" + encodeURIComponent(JSON.stringify([
                    "BUKR",
                    "KORK",
                    genStr("XIXI", 2044),
                    "ZSOME"
                ])),
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-intent-param=ASNEW2&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "no extended user default value can be found (parameter should not appear in sap-ushell-defaultedParameterNames",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": undefined
                }
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            defaultValue: {
                                value: "UserDefault.extended.Pref1",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-xapp-state=ASOLD"
        },
        {
            testDescription: "extended user default is merged",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1"
                }
            },
            "intent": "SO-action?sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            defaultValue: {
                                value: "UserDefault.extended.Pref1",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "CostCenter",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1",
                            "High": null
                        }]
                    }]
                }
            },
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&sap-ushell-defaultedParameterNames=%5B%22CostCenter%22%5D&sap-xapp-state=ASNEW"
        },
        {
            testDescription: "TR url without wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParameterNames",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: undefined,
            expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?" + [
                "sap-client=120",
                "sap-language=EN",
                "AAAA=4321&BUKR=P1Def",
                genStr("XIXI", 2044) + "=Pref5Def&ZSOME=Pref5Def&ZZZ=444",
                "sap-xapp-state=ASNEW"
            ].join("&")
        },
        {
            testDescription: "TR url with wrapped transaction is provided - no parameters compaction, no sap-ushell-defaultedParametersNames",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "SO-action?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "SO",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Currency manager (ignored text)", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "https://example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?DYNP_OKCODE=onli&P_APPL=FS2_TEST&P_CTO=EA%20%20X%20X&P_DYNNR=1000&P_OBJECT=&P_OKCODE=OKCODE&P_PRGRAM=FOOS&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData2: undefined,
            expectedUrl: "https://example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_B_I_TXN?" + [
                "DYNP_OKCODE=onli",
                "P_APPL=FS2_TEST",
                "P_CTO=EA%20%20X%20X",
                "P_DYNNR=1000",
                // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
                // [
                //     "AAAA%25214321",
                //     "BUKR%2521P1Def",
                //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
                //     "ZSOME%2521Pref5Def",
                //     "ZZZ%2521444",
                //     "sap-xapp-state%2521ASNEW"
                // ].join("%2525"),
                //
                "P_OBJ1=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ2=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ3=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ4=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ5=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ6=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ7=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ8=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ9=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ10=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ11=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ12=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ13=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ14=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                "P_OBJ15=IXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
                "P_OBJ16=444%2525sap-xapp-state%2521ASNEW",
                "P_OBJECT=AAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",

                "P_OKCODE=OKCODE",
                "P_PRGRAM=FOOS",
                "P_ROLE=FS2SAMAP",
                "P_SELSCR=X",
                "P_TCODE=SU01",
                "sap-client=120",
                "sap-language=EN"
            ].join("&")
        },
        {   // tests that fallback is used when no resolutionResult section is provided in the inbound.
            testDescription: "no resolutionResult section was provided in the inbound",

            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {},
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "fallback :-({}" // url resolved via fallback
        },
        {
            testDescription: "sap-system provided as intent parameter",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "https://example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: { // Optional fixture parameter
                                   // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
                "UR3CLNT120": {         // <- convenience index for this test
                   http: {
                       id: "UR3CLNT120_HTTP",
                       host: "example.corp.com",
                       port: 50055,
                       pathPrefix: ""
                   },
                   https: {
                       id: "UR3CLNT120_HTTPS",
                       host: "example.corp.com",
                       port: 44355,
                       pathPrefix: ""
                   },
                   rfc: {
                       id: "UR3CLNT120",
                       systemId: "UR3",
                       host: "example.corp.com",
                       port: 0,
                       loginGroup: "PUBLIC",
                       sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                       sncQoPR3: "8"
                   },
                   id: "UR3CLNT120",
                   client: "120",
                   language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=en"
        },
        {
            testDescription: "sap-system provided as intent parameter, WDA url with system alias",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=U1YCLNT111",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=000&sap-language=EN",
                    "systemAlias": "UI2_WDA"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "U1YCLNT111": {
                    https: {
                        id: "U1YCLNT111_HTTPS",
                        host: "example.corp.com",
                        port: 44355,
                        pathPrefix: "" // use local
                    },
                    id: "U1YCLNT111",
                    client: "111",
                    language: ""
                },
                "UI2_WDA": {
                    http: {
                        id: "UI2_WDA",
                        host: "example.corp.com",
                        port: 44355,
                        pathPrefix: "" // path from local system!
                    },
                    https: {
                        id: "UI2_WDA",
                        host: "example.corp.com",
                        port: 44355,
                        pathPrefix: ""
                    },
                    rfc: {
                        id: "",
                        systemId: "",
                        host: "",
                        service: 32,
                        loginGroup: "",
                        sncNameR3: "",
                        sncQoPR3: ""
                    },
                    id: "UI2_WDA",
                    client: "000",
                    language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=111&sap-language=en"
        },
        {
            testDescription: "sap-system provided as intent parameter, WDA url, relative path",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "WDA",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: { // Optional fixture parameter
                                   // Mocks expansions from ClientSideTargetResolutionAdapter#resolveSystemAlias
                "UR3CLNT120": {         // <- convenience index for this test
                   http: {
                       id: "UR3CLNT120_HTTP",
                       host: "example.corp.com",
                       port: 50055,
                       pathPrefix: ""
                   },
                   https: {
                       id: "UR3CLNT120_HTTPS",
                       host: "example.corp.com",
                       port: 44355,
                       pathPrefix: ""
                   },
                   rfc: {
                       id: "UR3CLNT120",
                       systemId: "UR3",
                       host: "example.corp.com",
                       port: 0,
                       loginGroup: "PUBLIC",
                       sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
                       sncQoPR3: "8"
                   },
                   id: "UR3CLNT120",
                   client: "120",
                   language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=en"
        },
        {
            testDescription: "relative app/transaction URL with sap-system=QH3CLNT815, sap-client and sap-language are provided",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=QH3CLNT815",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                    "systemAlias": "" // important -> local system!
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "": O_LOCAL_SYSTEM_ALIAS,
                "QH3CLNT815": {
                   https: {
                       id: "QH3CLNT815_HTTPS",
                       host: "example.corp.com",
                       port: 44301,
                       pathPrefix: "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html"
                   },
                   rfc: {
                       id: "QH3CLNT815",
                       systemId: "",
                       host: "10.96.46.2",
                       service: 1,
                       loginGroup: "",
                       sncNameR3: "",
                       sncQoPR3: ""
                   },
                   id: "QH3CLNT815",
                   client: "815",
                   language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44301/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html/~canvas;window=app/transaction/SU01?sap-client=815&sap-language=en"
        },
        {
            testDescription: "relative app/transaction URL with sap-system=QH3CLNT815 (with empty pathPrefix) parameter provided",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=QH3CLNT815",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                    "systemAlias": "" // important -> local system!
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "QH3CLNT815": {
                   https: {
                       id: "QH3CLNT815_HTTPS",
                       host: "example.corp.com",
                       port: 44301,
                       pathPrefix: "" // note: empty path prefix -> take from local system alias
                   },
                   rfc: {
                       id: "QH3CLNT815",
                       systemId: "",
                       host: "10.96.46.2",
                       service: 1,
                       loginGroup: "",
                       sncNameR3: "",
                       sncQoPR3: ""
                   },
                   id: "QH3CLNT815",
                   client: "815",
                   language: ""
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedUrl: "https://example.corp.com:44301/sap/bc/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=815&sap-language=en"
        },
        {
            testDescription: "Native Wrapped Webgui URL with load balanced sap-system",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=ALIASRFC",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": "" // important -> local system!
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": {
                   https: {
                       id: "ALIASRFC_HTTPS",
                       host: "example.corp.com",
                       port: 44301,
                       pathPrefix: ""
                   },
                   rfc: {
                       // for load balancing specify systemId, loginGroup, sncNameR3, messageServer, sncQoPR3
                       // for no load balancing specify only service, sncNameR3, sncQoPR3
                       id: "ALIASRFC",
                       systemId: "UR3",
                       host: "ldcsuv2",
                       service: 32,          // ignored: load balancing configuration
                       loginGroup: "SPACE",
                       sncNameR3: "p/secude:CN=UXR, O=SAP-AG, C=DE",
                       sncQoPR3: "9"
                   },
                   id: "QH3CLNT815",
                   client: "815",
                   language: "IT"
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl:
                "https://example.corp.com:44301/sap/bc/gui/sap/its/webgui;" + [
                    "~sysid=UR3",
                    "~loginGroup=SPACE",
                    "~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                    "~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE",
                    "~sncQoPR3=9"
                ].join(";") +
                "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
                "&sap-client=815" +
                "&sap-language=IT"
        },
        {
            testDescription: "Native Wrapped Webgui URL with load balanced sap-system (but missing parameters in rfc)",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Object-action?sap-system=ALIASRFC",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Object",
                "action": "action",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "text": "Sap System Test", // ignored
                    "ui5ComponentName": "",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": "" // important -> local system!
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": {
                    https: {
                        id: "ALIASRFC_HTTPS",
                        host: "example.corp.com",
                        port: 44301,
                        pathPrefix: ""
                    },
                    rfc: {
                        // for load balancing specify systemId, loginGroup, sncNameR3, messageServer, sncQoPR3
                        // for no load balancing specify only service, sncNameR3, sncQoPR3
                        id: "ALIASRFC",
                        systemId: "UR3",
                        host: "ldcsuv2",
                        service: 32,          // ignored: load balancing configuration
                        loginGroup: "SPACE",
                        sncNameR3: "",
                        sncQoPR3: ""
                    },
                    id: "QH3CLNT815",
                    client: "815",
                    language: "IT"
                }
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl:
                "https://example.corp.com:44301/sap/bc/gui/sap/its/webgui;" + [
                    "~sysid=UR3",
                    "~loginGroup=SPACE"
                ].join(";") +
                "?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1" +
                "&sap-client=815" +
                "&sap-language=IT"
        },
        {
            testDescription: "Native Wrapped Webgui URL resolution",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "Action-towrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "To Wrapped webgui",
                "semanticObject": "Action",
                "action": "towrappedwebgui",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=*APB_LPD_CALL_B_I_TXN%20DYNP_OKCODE%3donli%3bP_APPL%3dFS2_TEST%3bP_CTO%3dEA%20%20X%20X%3bP_DYNNR%3d1000%3bP_OBJECT%3d%3bP_OKCODE%3dOKCODE%3bP_PRGRAM%3dFOOS%3bP_ROLE%3dFS2SAMAP%3bP_SELSCR%3dX%3bP_TCODE%3dSU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
            oOldAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression" : "",
                    "SelectionVariantID" : "",
                    "Text" : "Selection Variant with ID ",
                    "Version" : {
                        "Major" : "1",
                        "Minor" : "0",
                        "Patch" : "0"
                    },
                    Parameters: [{
                        "PropertyName": "P5",
                        "PropertyValue": "P5Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "BUKR",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }, {
                        "PropertyName": "KORK",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "Pref5Def",
                            "High": null
                        }]
                    }]
                }
            },
            expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
                "%7etransaction=*APB_LPD_CALL_B_I_TXN%20" + [
                        "DYNP_OKCODE%3donli",
                        "P_APPL%3dFS2_TEST",
                        "P_CTO%3dEA%20%20X%20X",
                        "P_DYNNR%3d1000",
                        // This equals the following, but spread over P_OBJECT, P_OBJx parameters:
                        // [
                        //     "AAAA%25214321",
                        //     "BUKR%2521P1Def",
                        //     genStr("XIXI", 2044) + "%2521" + "Pref5Def",
                        //     "ZSOME%2521Pref5Def",
                        //     "ZZZ%2521444",
                        //     "sap-xapp-state%2521ASNEW"
                        // ].join("%2525"),
                        //
                        "P_OBJ1%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ2%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ3%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ4%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ5%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ6%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ7%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ8%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ9%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ10%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ11%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ12%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ13%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ14%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",
                        "P_OBJ15%3dIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXI%2521Pref5Def%2525ZSOME%2521Pref5Def%2525ZZZ%2521",
                        "P_OBJ16%3d444%2525sap-xapp-state%2521ASNEW",
                        "P_OBJECT%3dAAAA%25214321%2525BUKR%2521P1Def%2525XIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIXIX",

                        "P_OKCODE%3dOKCODE",
                        "P_PRGRAM%3dFOOS",
                        "P_ROLE%3dFS2SAMAP",
                        "P_SELSCR%3dX",
                        "P_TCODE%3dSU01"
                ].join("%3b") + "&" + [
                    "%7enosplash=1",
                    "sap-client=120",
                    "sap-language=EN"
                ].join("&")
        },
        {
            testDescription: "Native Non-wrapped Webgui URL resolution",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {
                "Pref1": {
                    "value": "P1Def",
                    "extendedValue": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "P1ExtVal",
                            "High": null
                        }]
                    }
                },
                "Pref2": {
                    "value": "Pref5Def",
                    "extendedValue": undefined
                }
            },
            "intent": "Action-tononwrappedwebgui?AAAA=4321&ZZZ=444&sap-xapp-state=ASOLD",
            "inbound": {
                "title": "To Non Native Wrapped webgui",
                "semanticObject": "Action",
                "action": "tononwrappedwebgui",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "TR",
                    "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "CostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.Pref1",
                                format: "reference"
                            }
                        },
                        "ReceivingCostCenter": {
                            "renameTo": "BUKR",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "GLAccount": {
                            "renameTo": "KORK",
                            defaultValue: {
                                value: "UserDefault.extended.Pref2",
                                format: "reference"
                            }
                        },
                        "ZSOME": {
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        },
                        "AAA": {
                            "renameTo": genStr("XIXI", 2044),
                            defaultValue: {
                                value: "UserDefault.Pref2",
                                format: "reference"
                            }
                        }
                    }
                }
            },
        oOldAppStateData: {
            selectionVariant: {
                Parameters: [{
                    "PropertyName": "P5",
                    "PropertyValue": "P5Value"
                }]
            }
        },
        expectedApplicationType: "TR",
        expectedAppStateData: {
            selectionVariant: {
                "ODataFilterExpression" : "",
                "SelectionVariantID" : "",
                "Text" : "Selection Variant with ID ",
                "Version" : {
                    "Major" : "1",
                    "Minor" : "0",
                    "Patch" : "0"
                },
                Parameters: [{
                    "PropertyName": "P5",
                    "PropertyValue": "P5Value"
                }],
                SelectOptions: [{
                    "PropertyName": "BUKR",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "Pref5Def",
                        "High": null
                    }]
                }, {
                    "PropertyName": "KORK",
                    "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "Pref5Def",
                        "High": null
                    }]
                }]
            }
        },
        expectedUrl: "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?" +
            "%7etransaction=*SU01%20" + [
                "AAAA%3d4321",
                "BUKR%3dP1Def",
                genStr("XIXI", 2044) + "%3d" + "Pref5Def",
                "ZSOME%3dPref5Def",
                "ZZZ%3d444"
            ].join("%3b") + "&" + [
                "%7enosplash=1",
                "sap-client=120",
                "sap-language=EN",
                "sap-xapp-state=ASNEW"
            ].join("&")
        },
        {
            testDescription: "Relative target in URL, no system alias, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToUrl?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "/sap/bc/to/the/moon",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en"
        },
        {
            testDescription: "Relative URL, no system alias, sap-system with path",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToUrl?sap-system=ALIASRFC",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "/sap/bc/to/the/moon",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:1111/path/sap/bc/to/the/moon?sap-client=220&sap-language=en"
        },
        {
            testDescription: "Absolute URL, no system alias, sap-system without path",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/path/to/the/moon.html",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/path/to/the/moon.html"
        },
        {
            testDescription: "Absolute URL, no system alias, sap-system with path",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIASRFC",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/path/to/the/moon.html",
                    "systemAlias": ""
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/path/to/the/moon.html"
        },
        {
            testDescription: "Relative URL, system alias with path prefix, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToUrl?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "https://example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=EN",
                    "systemAlias": "ALIAS111"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.ALIAS111,
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:44355/sap/bc/to/the/moon?sap-client=120&sap-language=en"
        },
        {
            testDescription: "Relative URL, system alias with path prefix, sap-system with path prefix",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToUrl?sap-system=ALIAS111",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "https://example.corp.com:1111/path//sap/bc/to/the/moon?sap-client=220&sap-language=EN",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.ALIAS111,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "https://example.corp.com:44335/go-to/the/moon/sap/bc/to/the/moon?sap-client=111&sap-language=en"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system without path prefix",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/sap/bc/to/the/moon.html",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system with path prefix",
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/sap/bc/to/the/moon.html",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.ALIAS111,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html"
        },
        {
            testDescription: "Absolute URL, system alias with path prefix, sap-system with path prefix + intent parameters",
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?sap-system=ALIAS111&param1=value1&param2=value2",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/sap/bc/to/the/moon.html",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {}
                }
            },
            oKnownSapSystemData: {
                "ALIAS111": O_KNOWN_SYSTEM_ALIASES.ALIAS111,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?param1=value1&param2=value2"
        },
        {
            testDescription: "Absolute URL with parameter and hash (no hash parameters) and sap-system",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?C=E&D=F&sap-system=UR3CLNT120",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "http://www.google.com/sap/bc/to/the/moon.html#SoIsses",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "C" : {},
                        "D" : {}
                    }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "http://www.google.com/sap/bc/to/the/moon.html?C=E&D=F#SoIsses"
        },
        {
            testDescription: "relative URL with parameter and hash (no hash parameters) and no sap-system",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Action-aliasToAbsoluteUrl?C=E&D=F&E=K",
            "inbound": {
                "title": "Sap System Test",
                "semanticObject": "Action",
                "action": "aliasToAbsoluteUrl",
                "resolutionResult": {
                    "additionalInformation": "",
                    "applicationType": "URL",
                    "ui5ComponentName": "",
                    "url": "/sap/bc/to/the/moon.html?A=B#SoIsses",
                    "systemAlias": "ALIASRFC"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "C" : {},
                        "D" : {}
                    }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120,
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "URL",
            expectedUrl: "/sap/bc/to/the/moon.html?A=B&C=E&D=F#SoIsses"
        },
        {
            testDescription: "an Easy User Access Menu transaction is resolved",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Shell-startGUI?sap-system=ALIASRFC&sap-ui2-tcode=SU01",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startGUI",
                "id": "Shell-startGUI~6NM",
                "title": "System U1Y on current client",
                "resolutionResult": {
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "System U1Y on current client",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "ALIASRFC",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "ALIASRFC": O_KNOWN_SYSTEM_ALIASES.ALIASRFC
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "TR",
            expectedUrl: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu WDA target is resolved",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": "Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL",
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWDA",
                "id": "Shell-startGUI~6NM",
                "title": "System U1Y on current client",
                "resolutionResult": {
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "System U1Y on current client",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "UR3CLNT120",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-client=120&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu WDA target with configuration is resolved",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": 'Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&sap-ui2-wd-conf-id=CO!@^*()_+":{}<>NFIG',
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWDA",
                "id": "Shell-startWDA",
                "title": "System U1Y on current client",
                "resolutionResult": {
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "System U1Y on current client",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "UR3CLNT120",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en"
        },
        {
            testDescription: "an Easy User Access Menu WDA target with configuration & application parameters is resolved",
            // ignore certain fields not needed for the test
            "UserDefaultParameters": {},
            "intent": 'Shell-startWDA?sap-system=UR3CLNT120&sap-ui2-wd-app-id=EPM_POWL&appParam1=appValue1&sap-ui2-wd-conf-id=CO!@^*()_+":{}<>NFIG&appParam5=appValue5',
            "inbound": {
                "semanticObject": "Shell",
                "action": "startWDA",
                "id": "Shell-startWDA",
                "title": "System U1Y on current client",
                "resolutionResult": {
                   "sap.platform.runtime" : { "anything" : "copied"},
                   "applicationType": "whatever",
                   "additionalInformation": "whatever",
                   "text": "System U1Y on current client",
                   "url": "whatever",
                   "systemAlias": "whatever"
                },
                "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                "signature": {
                   "additionalParameters": "allowed",
                   "parameters": {
                      "sap-system": {
                         "filter": {
                            "value": "UR3CLNT120",
                            "format": "plain"
                         },
                         "required": true
                      }
                   }
                }
            },
            oKnownSapSystemData: {
                "UR3CLNT120": O_KNOWN_SYSTEM_ALIASES.UR3CLNT120
            },
            oOldAppStateData: {},
            expectedAppStateData: {},
            expectedApplicationType: "NWBC",
            expectedResolutionResult :
            {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "sap-system": "UR3CLNT120",
                "text": "EPM_POWL",
                "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en",
                "sap.platform.runtime" : { "anything" : "copied" }
            },
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/EPM_POWL/?appParam1=appValue1&appParam5=appValue5&sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=en"
        }
    ].forEach(function (oFixture) {
        asyncTest("Complete resolveHashFragment for intent " + oFixture.intent + " when " + oFixture.testDescription, function () {
            // Given that we mock some services, here there is an explicit list
            // of the non-mocked ones.
            var oAllowedRequireServices = {
                "URLParsing": true,
                "ShellNavigation": true
            };
            var oFakeAdapter = {
                resolveSystemAlias: function (sSystemAlias) {
                    var oDeferred = new jQuery.Deferred();
                    if (sSystemAlias === "") {   // check if local result first
                        return oDeferred.resolve(O_LOCAL_SYSTEM_ALIAS).promise();
                    }
                    if (oFixture.oKnownSapSystemData && oFixture.oKnownSapSystemData.hasOwnProperty(sSystemAlias)) {
                        return oDeferred.resolve(oFixture.oKnownSapSystemData[sSystemAlias]).promise();
                    }
                    return oDeferred.reject("Cannot resolve system alias").promise();
                },
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([oFixture.inbound]).promise()
                ),
                resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                    var obj = { url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") };
                    if (oMatchingTarget.resolutionResult && oMatchingTarget.resolutionResult["sap.platform.runtime"]) {
                        obj["sap.platform.runtime"] = oMatchingTarget.resolutionResult["sap.platform.runtime"];
                    }
                    return new jQuery.Deferred().resolve(obj).promise();
                }
            };

            function FakeAppState(sKey,oData) {
                this.oData = oData;
                this.getKey = function() { return sKey; };
                this.getData = function() { return this.oData; };
                this.setData = function(oData) { this.oData = oData; };
                this.save = function() { return new jQuery.Deferred().resolve().promise(); };
            }

            // mutate the fixture
            Object.keys(oFixture.UserDefaultParameters).forEach(function(sName) {
                var oMember = oFixture.UserDefaultParameters[sName];
                if (oMember.value === "HUGE") {
                    oMember.value = genStr("ABCDEFGHIJKLMN", 2049);
                }
            });

            var fnFactory = sap.ushell.Container.getService;
            var oAppStateService = sap.ushell.Container.getService("AppState");
            var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
            var oNewAppStates = [new FakeAppState("ASNEW", {}), new FakeAppState("ASNEW2", {})];
            var oNewAppState = oNewAppStates[0];
            var iCnt = -1;
            var oAppStateMock = {
                    getAppState: sinon.stub().returns(
                        new jQuery.Deferred().resolve(new FakeAppState("ASOLD", oFixture.oOldAppStateData)).promise()
                    ),
                    createEmptyAppState : function() {
                        return oNewAppStates[++iCnt];
                    }
                };
            var oUserDefaultParametersMock = {
                    getValue : function(sName) {
                        return new jQuery.Deferred().resolve(oFixture.UserDefaultParameters[sName] || { value : undefined}).promise();
                    }
            };

            sinon.stub(sap.ushell.Container, "getService", function(sName) {
                if (sName === "AppState") {
                    return oAppStateMock;
                }
                if (sName === "UserDefaultParameters") {
                    return oUserDefaultParametersMock;
                }
                if (!oAllowedRequireServices[sName]) {
                    ok(false, "Test is not accessing " + sName);
                }
                return fnFactory.bind(sap.ushell.Container)(sName);
            });

            sinon.stub(sap.ushell.Container, "getUser").returns({
                getLanguage: sinon.stub().returns("en")
            });
            sinon.spy(oShellNavigationService, "compactParams");
            sinon.stub(oAppStateService,"getAppState", oAppStateMock.getAppState);
            sinon.stub(oAppStateService,"createEmptyAppState", oAppStateMock.createEmptyAppState);

            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, {});

            var fnOrigSelectSystemAliasDataName = oSrvc._selectSystemAliasDataName;
            oSrvc._selectSystemAliasDataName = function (oSystemAliasCollection, sBrowserLocationProtocol) {
                if (sBrowserLocationProtocol === "http") {
                    sBrowserLocationProtocol = "https"; // force https URL
                }
                return fnOrigSelectSystemAliasDataName.call(this, oSystemAliasCollection, sBrowserLocationProtocol);
            };

            // Act
            oSrvc.resolveHashFragment(oFixture.intent, /*fnBoundFallback*/ function() {
                ok(false, "fallback function is not called");
            })
                .done(function (oResolutionResult) {
                    ok(true, "promise was resolved");
                    if (oFixture.expectedResolutionResult) {
                        deepEqual(oResolutionResult,oFixture.expectedResolutionResult, "correct resolution result, sap.platform.runtime not lost");
                    }
                    if (oFixture.expectedTransientCompaction) {
                        deepEqual(oShellNavigationService.compactParams.args[0][3], true, "compactParams invoked with transient indication");
                    }
                    // test the xapp-state key !
                    strictEqual(oResolutionResult.url, oFixture.expectedUrl, "url correct");

                    if (oFixture.expectedApplicationType) {
                        strictEqual(oResolutionResult.applicationType, oFixture.expectedApplicationType, "application type correct");
                    }

                    if (oFixture.expectedAppStateData) {
                        deepEqual(oNewAppState.getData(), oFixture.expectedAppStateData, "appstate data correct");
                    }
                    if (oFixture.expectedAppStateData2) {
                        deepEqual(oNewAppStates[1].getData(), oFixture.expectedAppStateData2, "appstate data 2 correct");
                        if (oFixture.expectedAppStateData2 && oNewAppStates[1].getData().length > 2000) {
                            deepEqual(oNewAppStates[1].getData().substr(2000), oFixture.expectedAppStateData2.substr(2000), "appstate data 2 2nd part correct");
                        }
                    }
                })
                .fail(function (sError) {
                    // Assert
                    ok(false, "promise was resolved");
                    jQuery.sap.log.error(sError);
                })
                .always(function () {
                    start();
                    oShellNavigationService.compactParams.restore();
                });
           });
    });

    [
        {
            testDescription: "resolveHashFragment, hasSegmentedAccess ",
            // ignore certain fields not needed for the test
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "hasSegmentedAccess" : true,
            oInboundFilter : [
                {
                    semanticObject : "Action",
                    action : "aliasToAbsoluteUrl"
                }
            ]
        },
        {
            testDescription: "resolveHashFragment, config disabled",
            "intent": "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            "hasSegmentedAccess" : false,
            oInboundFilter : undefined
        }
    ].forEach(function (oFixture) {
        asyncTest("inbound filter on resolveHashFragment when " + oFixture.testDescription, function () {
            var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
            sinon.stub(sap.ushell.Container, "getUser").returns({
                getLanguage: sinon.stub().returns("en")
            });
            sinon.spy(oShellNavigationService, "compactParams");
            var oFakeAdapter = {
                    hasSegmentedAccess : oFixture.hasSegmentedAccess,
                    resolveSystemAlias: function (sSystemAlias) {
                        var oDeferred = new jQuery.Deferred();
                        if (sSystemAlias === "") {   // check if local result first
                            return oDeferred.resolve(O_LOCAL_SYSTEM_ALIAS).promise();
                        }
                        if (oFixture.oKnownSapSystemData && oFixture.oKnownSapSystemData.hasOwnProperty(sSystemAlias)) {
                            return oDeferred.resolve(oFixture.oKnownSapSystemData[sSystemAlias]).promise();
                        }
                        return oDeferred.reject("Cannot resolve system alias").promise();
                    },
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([oFixture.inbound]).promise()
                    ),
                    resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                        return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
                    }
                };
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, oFixture.config);
            sinon.spy(oSrvc, "_ensureInbounds");
            sinon.stub(oSrvc,"_resolveHashFragment").returns(new jQuery.Deferred().resolve({a:1}).promise());
            // Act
            oSrvc.resolveHashFragment(oFixture.intent, /*fnBoundFallback*/ function() {
                ok(false, "fallback function is not called");
            })
                .done(function (oResolutionResult) {
                    ok(true, "promise was resolved");
                    deepEqual(oSrvc._ensureInbounds.args[0][0], oFixture.oInboundFilter, " inbound reqeust properly filtered");
                    deepEqual(oFakeAdapter.getInbounds.args[0][0], oFixture.oInboundFilter, " inbound reqeust properly filtered");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                    oShellNavigationService.compactParams.restore();
                });
           });
    });


    [
        /*
         * Fixture format
         *
         * - expectSuccess: required boolean
         * - expectedWarnings: optional
         * - expectedResolutionResult: to check for the complete resolution result
         */
        {
            testDescription: "a valid (transaction) intent is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startGUI",
                params: {
                    "sap-system" : ["ALIASRFC"],
                    "sap-ui2-tcode": ["SU01"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=SU01&%7enosplash=1&sap-client=220&sap-language=EN", // see below
                applicationType: "TR",  // simply add "TR"
                text: "SU01",
                additionalInformation: "", // leave empty
                "sap-system": "ALIASRFC"  // propagate sap-system in here
            }
        },
        {
            testDescription: "a valid (transaction) intent is provided with extra parameters",
            oIntent: {
                semanticObject: "Shell",
                action: "startGUI",
                params: {
                    "sap-system" : ["ALIASRFC"],
                    "sap-ui2-tcode": ["*SU01"],
                    "sap-theme": ["sap_hcb"],
                    "some_parameter": ["some_value"]
                }
            },
            /*
             * Note: do not fail anymore here, we
             * just resolve now because the target mapping is assumed to be there
             * in the correct format
             */
            expectedResolutionResult: {
                "additionalInformation": "",
                "applicationType": "TR",
                "sap-system": "ALIASRFC",
                "text": "*SU01",
                "url": "https://example.corp.com:1111/path/gui/sap/its/webgui;~sysid=UV2;~loginGroup=SPACE;~messageServer=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncNameR3=p%2fsecude%3aCN%3dUXR%2c%20O%3dSAP-AG%2c%20C%3dDE;~sncQoPR3=9?%7etransaction=*SU01&%7enosplash=1&sap-client=220&sap-language=EN"
            }
        },
        {
            testDescription: "a valid (wda) intent is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system" : ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        },
        {
            testDescription: "a valid (wda) intent with sap-wd-conf-id is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system" : ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-ui2-wd-conf-id": ["CONFIG_PARAMETER"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-wd-configId=CONFIG_PARAMETER&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        },
        {
            testDescription: "a valid (wda) intent with sap-wd-conf-id with special characters is provided",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system" : ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-ui2-wd-conf-id": ['CO!@^*()_ ":{}<>NFIG']
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-wd-configId=CO!%40%5E*()_%20%22%3A%7B%7D%3C%3ENFIG&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        },
        {
            testDescription: "a valid (wda) intent is provided with extra parameters",
            oIntent: {
                semanticObject: "Shell",
                action: "startWDA",
                params: {
                    "sap-system" : ["UR3CLNT120"],
                    "sap-ui2-wd-app-id": ["APPID"],
                    "sap-theme": ["sap_hcb"],
                    "some_parameter": ["some_value"]
                }
            },
            expectedResolutionResult: {
                url: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/APPID/?sap-theme=sap_hcb&some_parameter=some_value&sap-client=120&sap-language=EN",
                applicationType: "NWBC",
                text: "APPID",
                additionalInformation: "",
                "sap-system": "UR3CLNT120"
            }
        },
        {
            testDescription: "a non easy access menu intent is provided",
            oIntent: {
                semanticObject: "Action",
                action: "toAppNavSample",
                params: {
                    "sap-system" : ["ALIASRFC"],
                    "sap-ui2-tcode": ["SU01"]
                }
            },
            expectedError: "The easy access menu intent Action-toAppNavSample could not be resolved: Intent must be either #Shell-startGUI or #Shell-startWDA"
        }
    ].forEach(function (oFixture) {
        asyncTest("_resolveEasyAccessMenuIntent returns the correct resolution result when " + oFixture.testDescription, function () {

            // Arrange
            var oFakeAdapter = {
                resolveSystemAlias: function (sSystemAlias) {
                    if (sSystemAlias === "") {
                        return new jQuery.Deferred().resolve(O_LOCAL_SYSTEM_ALIAS).promise();
                    }
                    if (O_KNOWN_SYSTEM_ALIASES.hasOwnProperty(sSystemAlias)) {
                        return new jQuery.Deferred().resolve(O_KNOWN_SYSTEM_ALIASES[sSystemAlias]).promise();
                    }
                    return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
                },
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([
                        {
                            "semanticObject": "Shell",
                            "action": "startGUI",
                            "id": "Shell-startGUI~686q",
                            "title": "DUMMY",
                            "resolutionResult": {
                                "applicationType": "TR",
                                "additionalInformation": "",
                                "text": "DUMMY",
                                "url": "/ui2/nwbc/~canvas;window=app/transaction/DUMMY?sap-client=120&sap-language=EN",
                                "systemAlias": ""
                            },
                            "deviceTypes": { "desktop": true, "phone": false, "tablet": false },
                            "signature": {
                                "additionalParameters": "ignored",
                                "parameters": {
                                    "sap-ui2-tcode": {
                                        "required": true,
                                        "filter": {
                                            "value": ".+",
                                            "format": "regexp"
                                        }
                                    },
                                    "sap-system": {
                                        "required": true,
                                        "filter": {
                                            "value": ".+",
                                            "format": "regexp"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "semanticObject": "Shell",
                            "action": "startWDA",
                            "id": "Shell-startWDA~683z",
                            "title": "DUMMY",
                            "resolutionResult": {
                                "applicationType": "WDA",
                                "additionalInformation": "",
                                "text": "DUMMY",
                                "url": "/ui2/nwbc/~canvas;window=app/wda/DUMMY/?sap-client=120&sap-language=EN",
                                "systemAlias": ""
                            },
                            "deviceTypes": { "desktop": true, "phone": false, "tablet": false },
                            "signature": {
                                "additionalParameters": "allowed",
                                "parameters": {
                                    "sap-ui2-wd-app-id": {
                                        "required": true,
                                        "filter": { "value": ".+", "format": "regexp" }
                                    },
                                    "sap-system": {
                                        "required": true,
                                        "filter": { "value": ".+", "format": "regexp" }
                                    },
                                    "sap-ui2-wd-conf-id": {

                                    }
                                }
                            }
                        }
                    ]).promise()
                ),
                resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
                    return new jQuery.Deferred().resolve({ url : "_stripURI fallback :-(" + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
                }
            };

            var oSrvc = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null, null);

            sinon.stub(sap.ushell.Container, "getUser").returns({
                getLanguage: sinon.stub().returns("EN")
            });

            // Act
            oSrvc._resolveEasyAccessMenuIntent(oFixture.oIntent)
                .done(function (oResolutionResultGot) {
                    // Assert
                    if (oFixture.expectedError) {
                        ok(false, "promise was rejected");
                    } else {
                        ok(true, "promise was resolved");
                        strictEqual(jQuery.isPlainObject(oResolutionResultGot), true, "an object was returned");

                        if (oFixture.expectedResolutionResult) {
                            deepEqual(oResolutionResultGot, oFixture.expectedResolutionResult,
                                "obtained the expected resolution result");
                        }
                    }
                })
                .fail(function (sErrorGot) {
                    // Assert
                    if (oFixture.expectedError) {
                        ok(true, "promise was rejected");
                        strictEqual(sErrorGot, oFixture.expectedError, "expected error was returned");
                    } else {
                        ok(false, "promise was resolved");
                    }
                })
                .always(function () {
                    start();
                });

        });
    });


    [
        { sName: "name"               , sValue: "value"          , expected: true },
        { sName: "sap-name"           , sValue: "value"          , expected: false },
        { sName: "something-sap-name" , sValue: "value"          , expected: true },
        { sName: "something"          , sValue: "sap-name=value" , expected: true },
        { sName: "sap-name"           , sValue: "sap-value"      , expected: false },
        { sName: "sap-"               , sValue: "value"          , expected: false }
    ].forEach(function (oFixture) {
        var sTestName = "returns expected result when " + oFixture.sName + "=" + oFixture.sValue + " is given";

        test("_isWebguiBusinessParameter: " + sTestName + " as 1 parameter", function () {
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution();

            strictEqual(
                oSrvc._isWebguiBusinessParameter.call(oSrvc, oFixture.sName + "=" + oFixture.sValue),
                oFixture.expected,
                "got expected result"
            );
        });
        test("_isWebguiBusinessParameter: " + sTestName + " as 2 parameters", function () {
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution();

            strictEqual(
                oSrvc._isWebguiBusinessParameter.call(oSrvc, oFixture.sName, oFixture.sValue),
                oFixture.expected,
                "got expected result"
            );
        });
    });

    [
        {
            testDescription: "business and non-business parameters are given",
            oParams: {
                "sap-param": "value1",
                "someParam": "value2",
                "someParam2": "value3",
                "sap-param2": "value4"
            },
            expectedBusinessParams: {
                "someParam": "value2",
                "someParam2": "value3"
            },
            expectedNonBusinessParams: {
                "sap-param": "value1",
                "sap-param2": "value4"
            }
        }
    ].forEach(function (oFixture) {

        test("_extractWebguiNonBusinessParameters: " + oFixture.testDescription, function () {
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution();

            var oNonBusinessParamsGot = oSrvc._extractWebguiNonBusinessParameters(oFixture.oParams);

            deepEqual(oNonBusinessParamsGot, oFixture.expectedNonBusinessParams, "got expected non business parameters");

            deepEqual(oFixture.oParams, oFixture.expectedBusinessParams, "got expected business parameters");
        });
    });

// getEasyAccessSystems
    [
         {
             testDescription: "there is no inbound",
             aInbounds: [],
             oExpectedEasyAccessSystems: {}
         },
         {
             testDescription: "empty sap-system",
             aInbounds: [
                 {
                     id: "Shell-startGUI",
                     semanticObject: "Shell",
                     action: "startGUI",
                     title: "",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required : true
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 },
                 {
                     id: "Shell-startWDA",
                     semanticObject: "Shell",
                     action: "startWDA",
                     title: "",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required : true
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 }
             ],
             oExpectedEasyAccessSystems: { }
         },
         {
             testDescription: "there is no start... inbound",
             aInbounds: [
                 {
                     id: "Shell-toMyApp~631w",
                     semanticObject: "Shell",
                     action: "toMyApp",
                     title: "My app",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required : true,
                                 filter : {
                                         value: "AB1CLNT000"
                                 }
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 }
             ],
             oExpectedEasyAccessSystems: {}
         },
        {
            testDescription: "there is one startWDA inbound",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        WDA: true
                    }
                }
            }
        },
        {
            testDescription: "there are two different start... inbounds",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "HR Central",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "XY1CLNT100"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        WDA: true
                    }
                },
                XY1CLNT100: {
                    text: "HR Central",
                    appType: {
                        TR: true
                    }
                }
            }
        },
        {
            testDescription: "there are two start... inbounds with the same system alias and same length texts (startGUI is preferred)",
            aInbounds: [
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "HCM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "HCM Europe",
                    appType: {
                        TR: true,
                        WDA: true
                    }
                }
            }
        },
        {
            testDescription: "there are two start... inbounds with the same system alias and same length texts (selected one comes second)",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "HCM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        TR: true,
                        WDA: true
                    }
                }
            }
        },
        {
            testDescription: "there are two start... inbounds with the same system alias and same texts",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        TR: true,
                        WDA: true
                    }
                }
            }
        },
        {
            testDescription: "the device type of the inbound is not matching",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: false,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {}
        }
    ].forEach(function(oFixture) {
        asyncTest("getEasyAccessSystems returns the expected list of systems when " + oFixture.testDescription, 1, function () {
            var oService;

            // Arrange
            sinon.stub(sap.ushell.utils, "getFormFactor").returns("desktop");
            oService = createServiceWithInbounds(oFixture.aInbounds);
            // Act
            oService.getEasyAccessSystems()
                .done( function (oActualEasyAccessSystems) {
                    start();
                    // Assert
                    deepEqual(oActualEasyAccessSystems, oFixture.oExpectedEasyAccessSystems, "Easy Access Systems properly extracted from inbounds");
                });
        });
    });

    [
        {
            aInbounds: [
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required : true,
                                filter : {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            oExpectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        TR: true
                    }
                }
            }
        }
    ].forEach(function(oFixture) {
        asyncTest("getEasyAccessSystems is calculating the easy access system list only once", 2, function () {
            var oService,
                oFakeAdapter;

            // Arrange
            sinon.stub(sap.ushell.utils, "getFormFactor").returns("desktop");
            oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                        new jQuery.Deferred()
                            .resolve(oFixture.aInbounds)
                            .promise()
                    )
            };
            oService = new sap.ushell.services.ClientSideTargetResolution(oFakeAdapter, null, null );
            // Act
            oService.getEasyAccessSystems()
                .done( function (oActualEasyAccessSystems1) {
                    oService.getEasyAccessSystems()
                        .done( function (oActualEasyAccessSystems2) {
                            // Assert
                            start();
                            deepEqual(oActualEasyAccessSystems2, oFixture.oExpectedEasyAccessSystems, "Easy Access Systems properly extracted from inbounds");
                            ok(oFakeAdapter.getInbounds.calledOnce, "getInbounds is only called once");
                        });
                });
        });
    });

    [
        {
            testDescription: "both set",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["embedded"],
                "sap-ushell-navmode" : ["newWindow", "embedded", "newWindow"]
            },
            expectedNextNavMode : "embedded",
            expectedNavMode : "newWindow"
        },
        {
            testDescription: "one  set",
            intentParamsPlusAllDefaults: {
                "sap-ushell-navmode" : ["newWindow", "embedded", "newWindow"]
            },
            expectedNextNavMode : undefined,
            expectedNavMode : "newWindow"
        },
        {
            testDescription: "none set",
            intentParamsPlusAllDefaults: {
            },
            expectedNextNavMode : undefined,
            expectedNavMode : undefined
        },
        {
            testDescription: "both junk",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["xembedded"],
                "sap-ushell-navmode" : ["AnewWindow", "embedded", "newWindow"]
            },
            expectedNextNavMode : undefined,
            expectedNavMode : undefined
        }
    ].forEach(function (oFixture) {
        test("_computeNavigationMode: " + oFixture.testDescription, function () {
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution();
            var oTargetMapping = { resolutionResult : {},
                    intentParamsPlusAllDefaults : oFixture.intentParamsPlusAllDefaults };
            oSrvc._computeNavigationMode(oTargetMapping);
            deepEqual(oTargetMapping.resolutionResult["sap-ushell-next-navmode"], oFixture.expectedNextNavMode, "next navmode ok");
            deepEqual(oTargetMapping.resolutionResult.navigationMode, oFixture.expectedNavMode, "navigation Mode ok");
        });
    });


    [
        {
            testDescription: "synchronous"
        }
   ].forEach(function (oFixture) {
        asyncTest("_getMatchingInboundsSync: " + oFixture.testDescription, 1, function () {
            var oSrvc = new sap.ushell.services.ClientSideTargetResolution();
            var aFakeMatchResults = [
                                { num: 18, matches: true, priorityString: "B" , inbound: { resolutionResult: {} } },
                                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } },
                                { num: 41, matches: true, priorityString: "A" , inbound: { resolutionResult: {} } },
                                { num: 44, matches: true, priorityString: "C" , inbound: { resolutionResult: {} } },
                                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } }
                            ];
//                var oSrvc = createServiceWithInbounds([]),
//                aExpectedMatchingTargets = Fixture.expectedInbounds.map(function (iIdx) {
//                    return aFakeMatchResults[iIdx];
//                });
            sinon.stub(oSrvc, "_matchToInbound", function (oShellHash, oInbound, oKnownUserDefaultRefsIn, oMissingUserDefaultRefsOut) {
                return oInbound; // items of aFakeMappings
            });
            // Act 2
            var i = 2;
            oSrvc._getMatchingInbounds({}/* any parameter ok for the test*/, aFakeMatchResults).done(function (aMatchingInbounds) {
                start();
                equal(i,2,"value ok");
            }).fail(function () {
                ok(false, "promise was resolved");
            });
            i = 3;
        });
    });

    asyncTest("_constructFullWebguiResolutionResult: calls _resolveEasyAccessMenuIntentWebgui with the expected intent object", 2, function () {
        var oSrvc = new sap.ushell.services.ClientSideTargetResolution(),
            oMatchingGUITarget = { // a sample matching gui target
                "inbound": {
                    "semanticObject": "Action",
                    "action": "tosu01",
                    "id": "Action-tosu01~62zS",
                    "title": "tosu01",
                    "resolutionResult": {
                        "applicationType": "TR",
                        "additionalInformation": "",
                        "text": "tosu01",
                        "url": "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",
                        "systemAlias": "U1Y_000",
                        "sap.gui": {
                            "transaction": "SU01"
                        },
                        "sap.ui": {
                            "technology": "GUI"
                        }
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": false
                    },
                    "signature": {
                        "parameters": {},
                        "additionalParameters": "allowed"
                    }
                },
                "genericSO": false,
                "intentParamsPlusAllDefaults": {},
                "defaultedParamNames": [],
                "countMatchingParams": 0,
                "countMatchingRequiredParams": 0,
                "countMatchingFilterParams": 0,
                "countDefaultedParams": 0,
                "countPotentiallyMatchingParams": 0,
                "countFreeInboundParams": 0,
                "resolutionResult": {},
                "priorityString": "x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=1",
                "matches": true
            };

        // stubs to get the promise resolved
        sinon.stub(oSrvc, "_constructNativeWebguiNowrapResult").returns(new jQuery.Deferred().resolve(
            {} // doesn't matter
        ).promise());
        sinon.stub(oSrvc, "_resolveEasyAccessMenuIntentWebgui").returns(new jQuery.Deferred().resolve({
            url: "/resolved/url"
        }).promise());

        oSrvc._constructFullWebguiResolutionResult(
            oMatchingGUITarget,
            sinon.stub(),
            "#" + oMatchingGUITarget.inbound.semanticObject + "-" + oMatchingGUITarget.inbound.action
        ).done(function () {
            // note: guaranteed to resolve because stubs always resolve
            strictEqual(oSrvc._resolveEasyAccessMenuIntentWebgui.getCalls().length, 1, "_resolveEasyAccessMenuIntentWebgui was called 1 time");
            deepEqual(oSrvc._resolveEasyAccessMenuIntentWebgui.getCall(0).args, [
                {
                    target: { semanticObject: "Shell", action: "startGUI" },
                    params: {
                        "sap-ui2-tcode": ["SU01"],
                        "sap-system": ["U1Y_000"]
                    }
                },
                {
                    "countDefaultedParams": 0,
                    "countFreeInboundParams": 0,
                    "countMatchingFilterParams": 0,
                    "countMatchingParams": 0,
                    "countMatchingRequiredParams": 0,
                    "countPotentiallyMatchingParams": 0,
                    "defaultedParamNames": [],
                    "genericSO": false,
                    "inbound": {
                      "action": "tosu01",
                      "deviceTypes": {
                        "desktop": true,
                        "phone": false,
                        "tablet": true
                      },
                      "id": "Action-tosu01~62zS",
                      "resolutionResult": {
                        "additionalInformation": "",
                        "applicationType": "TR",
                        "sap.gui": {
                          "transaction": "SU01"
                        },
                        "sap.ui": {
                          "technology": "GUI"
                        },
                        "systemAlias": "U1Y_000",
                        "text": "tosu01",
                        "url": "/resolved/url"
                      },
                      "semanticObject": "Action",
                      "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {}
                      },
                      "title": "tosu01"
                    },
                    "intentParamsPlusAllDefaults": {},
                    "matches": true,
                    "priorityString": "x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=1",
                    "resolutionResult": {
                      "additionalInformation": "",
                      "applicationType": "NWBC",
                      "sap-system": undefined,
                      "text": "tosu01",
                      "url": "/resolved/url"
                    }
                  }
            ], "_resolveEasyAccessMenuIntentWebgui was called with the expected arguments");

        }).always(function () {
            start();
        });

    });

}());
