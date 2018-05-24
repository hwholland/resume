 // @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.EndUserFeedback and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, module, ok, start, strictEqual, stop, test, jQuery, sap, sinon, window */

    jQuery.sap.require("sap.ushell.utils");
    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.EndUserFeedback");

    module(
        "sap.ushell.services.EndUserFeedback",
        {
            setup : function () {
                /**/
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                jQuery.sap.getObject("sap-ushell-config.services.EndUserFeedback.config", 0).enabled = true;
                delete sap.ushell.Container;
            }
        }
    );

    [   {   sUrlInput: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?date=Wed%20Oct%2001%202014%2013%3a20%3a56%20GMT%200200%20%28W.%20Europe%20Daylight%20Time%29&zval=xx0xx1xx2xx3",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        },
        {   sUrlInput: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?param1=value1&param2=value2#Action-toappnavsample~AnyContext?additionalInfo=&ApplType",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        },
        {   sUrlInput: "https://ADDRESS:PORT/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        }
    ].forEach(function (oFixture) {
        test("getPathOfURL: input URL -> " + oFixture.sUrlInput, function () {
            //Arrange
            var oService = null, sUrlReturned;
            sap.ushell.bootstrap("local");
            oService = sap.ushell.Container.getService("EndUserFeedback");
            //Act
            sUrlReturned = oService.getPathOfURL(oFixture.sUrlInput);
            //Assert
            strictEqual(sUrlReturned, oFixture.sUrlExpectedOutcome, "Url path of " + oFixture.sUrlInput + " returned as expected -> returned URL: " + sUrlReturned);
        });
    });

    asyncTest("service ensabled by default - factory instantiation", function () {
        var oService = null;

        sap.ushell.bootstrap("local");
        oService = sap.ushell.Container.getService("EndUserFeedback");
        oService.isEnabled()
            .done(function () {
                start();
                ok("is default disabled!");
            })
            .fail(sap.ushell.test.onError);
    });


    asyncTest("service enabled if set in bootstrap config", function () {
        var oService = null;

        jQuery.sap.getObject("sap-ushell-config.services.EndUserFeedback.config", 0).enabled = false;

        sap.ushell.bootstrap("local");

        oService = sap.ushell.Container.getService("EndUserFeedback");
        oService.isEnabled()
            .fail(function () {
                start();
                ok("service is enabled!");
            })
            .done(sap.ushell.test.onError);
    });

    asyncTest("Send Feedback - Anonymous true", function () {
        var oTestAdapter,
            oAdapterSendFeedbackSpy,
            oEndUserFeedbackSrv,
            oInputEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                clientContext: {
                    userDetails : {
                        userId : "Hugo001",
                        eMail : "hugo@nodomain.com"
                    },
                    navigationData: {
                        formFactor: "desktop",
                        navigationHash: "#Action-toappnavsample~AnyContext?additionalInfo=&ApplType",
                        applicationInformation: {
                            url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?date=Wed%20Oct%2001%202014%2013%3a20%3a56%20GMT%200200%20%28W.%20Europe%20Daylight%20Time%29&zval=xx0xx1xx2xx3",
                            additionalInformation : "aaa",
                            applicationType : "URL"
                        }
                    }
                },
                isAnonymous: true
            },
            oExpectedEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                additionalInformation : "aaa",
                applicationType : "URL",
                url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                navigationIntent: "#Action-toappnavsample~AnyContext",
                formFactor: "desktop",
                isAnonymous: true,
                userId : "", //Should be blank in case isAnonymous is true
                eMail : "" //Should be blank in case isAnonymous is true
            },
            oActualEndUserFeedbackData;
        /**
         * overwrites the function of the EnduserFeedback adapter
         *
         * @param {JSON} oFeedbackObject
         * JSON object containing the input fields required for the EndUserFeedback
         */
        oTestAdapter = {};
        oTestAdapter.sendFeedback = function (oFeedbackObject) {
            var oDeferred, iNrOfFeedbacks = 333;
            oDeferred = new jQuery.Deferred();

            sap.ushell.utils.call(function () {
                oDeferred.resolve(iNrOfFeedbacks);
            }, sap.ushell.test.onError, true);
            return oDeferred.promise();
        };

        oEndUserFeedbackSrv = new sap.ushell.services.EndUserFeedback(oTestAdapter);
        oAdapterSendFeedbackSpy = sinon.spy(oTestAdapter, "sendFeedback");
        //parameters for navigationIntent and URL will be sent
        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            start();
            ok(typeof iNrOfFeedbacks === "number", "sendFeedback returns a number.");
            equal(iNrOfFeedbacks, 333, "fixed number");
            oActualEndUserFeedbackData = oAdapterSendFeedbackSpy.args[0][0];
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage - with parameters for URL & navIntent have been sent");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create feedback failed: " + sMessage);
        });
        ok(oAdapterSendFeedbackSpy.calledOnce, "Method sendFeedback of EndUserFeedback service has been called ");

        oInputEndUserFeedbackData.clientContext.navigationData.navigationHash = oExpectedEndUserFeedbackData.navigationIntent;
        oInputEndUserFeedbackData.clientContext.navigationData.applicationInformation.url = oExpectedEndUserFeedbackData.url;
        //no parameters for navigationIntent and URL will be sent
        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            //start();
            oActualEndUserFeedbackData = oAdapterSendFeedbackSpy.args[0][0];
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage - no parameters for URL & navIntent have been sent");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create feedback failed: " + sMessage);
        });
    });

}());
