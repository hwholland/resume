// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon, window */
    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");

    /*
     * Returns true if the given oMaybePromise looks like a jQuery promise.
     */
    function likeJQueryPromise(oMaybePromise) {
        return Object.prototype.toString.call(oMaybePromise) === "[object Object]" && [
                "always", "done", "fail", "pipe", "progress", "promise", "state", "then"
            ].every(function (sMethod) {
                    return oMaybePromise.hasOwnProperty(sMethod) &&
                        typeof oMaybePromise[sMethod] === "function";
                });
    }

    module("sap.ushell.renderers.fiori2.Shell", {
        setup: function () {
            window.location.hash = "";
            sap.ushell.bootstrap("local");
            /*            if (window.hasher && window.hasher.getHash()) {
             window.hasher.setHash('');
             }*/

            jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
            sap.ushell.components.container.ApplicationContainer = function () {
                return {
                    addEventDelegate : function () {}
                };
            };

            sap.m.BusyDialog.prototype.open = function () {
            };

            oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
            oController.history = new sap.ushell.renderers.fiori2.History();
            oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ushell.test.restoreSpies(
                sap.ui.getCore().attachThemeChanged,
                sap.ui.component.load,
                sap.ushell.utils.isNativeWebGuiNavigation,
                sap.ushell.utils.appendUserIdToUrl,
                window.hasher.replaceHash
            );
            window.location.hash = "";
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    var oController,
        sBasicShellHash = "#hash",
        sShellHashNavResCtx = "#navResCtx",
        sOldShellHash = "#oldHash",
        sOldAppPart = "oldAppPart",
        sAppPart = "AppPart";

    test("test validateShowLogo", function () {
        var oTestMediaRange = {name: 'desktop'},
            oDeviceMediaStub = sinon.stub(sap.ui.Device.media, "getCurrentRange").returns(oTestMediaRange),
            isShowLogo;
        oController.oExtensionShellStates = {};
        oController.switchViewState("home");

        oController.validateShowLogo();
        isShowLogo = oController.getModel().getProperty("/currentState/showLogo");
        ok(isShowLogo, 'Verify Logo exist on desktop');

        oTestMediaRange.name = 'tablet';
        oController.validateShowLogo();
        isShowLogo = oController.getModel().getProperty("/currentState/showLogo");
        ok(isShowLogo, 'Verify Logo exist on tablet');

        oTestMediaRange.name = 'combi';
        oController.validateShowLogo();
        isShowLogo = oController.getModel().getProperty("/currentState/showLogo");
        ok(isShowLogo, 'Verify Logo exist on combi');

        oTestMediaRange.name = 'Phone';
        oController.validateShowLogo();
        isShowLogo = oController.getModel().getProperty("/currentState/showLogo");
        ok(!isShowLogo, 'Verify Logo does not exist on mobile phone');

        oController.bMeAreaSelected = true;
        oController.validateShowLogo();
        isShowLogo = oController.getModel().getProperty("/currentState/showLogo");
        ok(isShowLogo, 'Verify Logo exist on mobile phone when me area selected');

        oDeviceMediaStub.restore();
    });

    test("test getAnimationType", function () {
        var animations = oController.getAnimationType();
        ok(animations === "show", 'Verify animations type');
        //sap.ui.Device.os = sap.ui.Device.os || {};
        sap.ui.Device.os.android = true;
        animations = oController.getAnimationType();
        ok(animations === "show", 'Verify animations type');
        //delete sap.ui.Device.os.android;
    });

    test("Test checkEUFeedback: sap.ushell.Container.getService does not throw error", function () {
        var oClock = sinon.useFakeTimers();
        var bfeedBack = oController.bFeedbackServiceChecked,
            originalProperty = oController.getModel().getProperty("/showEndUserFeedback");

        //case: sap.ushell.Container.getService does not throw an error
        oController.getModel().setProperty('/showEndUserFeedback', false);
        oController.bFeedbackServiceChecked = false;
        oController.getView = sinon.stub().returns({
            aDanglingControls: []
        });
        oController.oEndUserFeedbackConfiguration = {
            showAnonymous: true,
            showLegalAgreement: true,
            showCustomUIContent: true,
            feedbackDialogTitle: true,
            textAreaPlaceholder: true,
            customUIContent: undefined
        };
        oController.checkEUFeedback();

        oClock.tick(100);

        ok(oController.getModel().getProperty("/showEndUserFeedback") == true, "Property showEndUserFeedback of model is true");
        oController.bFeedbackServiceChecked = bfeedBack;
        oController.getModel().setProperty('/showEndUserFeedback', originalProperty);

        oClock.restore();
    });

    test("Test checkEUFeedback: sap.ushell.Container.getService does throw error", function () {
        var bfeedBack = oController.bFeedbackServiceChecked;

        //case2: sap.ushell.Container.getService does throw an error
        oController.getModel().setProperty('/showEndUserFeedback', true);
        oController.bFeedbackServiceChecked = false;
        var getService = sinon.stub(sap.ushell.Container, "getService").returns(function () {
            throw "error";
        });
        oController.checkEUFeedback();
        ok(oController.getModel().getProperty("/showEndUserFeedback") == false, "Property showEndUserFeedback of model is false");

        oController.bFeedbackServiceChecked = bfeedBack;
        getService.restore();
    });

    test("test doShowMessage", function () {
        jQuery.sap.require("sap.m.MessageBox");
        jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
        jQuery.sap.require("sap.m.MessageToast");

        var sMessage = "testMessage",
            sTitle = "testTitle",
            sCallback = "sCallback",
            show = sinon.stub(sap.m.MessageBox, "show"),
            confirm = sinon.stub(sap.m.MessageBox, "confirm"),
            mtShow = sinon.stub(sap.m.MessageToast, "show"),
            stubEmbeddedSupportErrorMessage = sinon.stub(sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage.prototype, "open");

        //test regular error message
        oController.doShowMessage(sap.ushell.services.Message.Type.ERROR, sMessage, {title: sTitle});
        ok(show.calledOnce === true, 'Test error popup called');
        ok(show.args[0][0] === sMessage, 'Test error popup message');
        ok(show.args[0][1] === 'ERROR', 'Test error popup message type');
        ok(show.args[0][2] === sTitle, 'Test error popup message sTitle');

        //test error message with support ticket
        sap.ushell.Container.getService("SupportTicket").isEnabled = function () {
            return true;
        };
        oController.doShowMessage(sap.ushell.services.Message.Type.ERROR, sMessage, {
            title: sTitle
        });
        ok(stubEmbeddedSupportErrorMessage.calledOnce === true, 'Test error popup called');

        //test confirm message without action
        oController.doShowMessage(sap.ushell.services.Message.Type.CONFIRM, sMessage, {
            title: sTitle,
            callback: sCallback
        });
        ok(confirm.calledOnce === true, 'Test confirm popup called');
        ok(confirm.args[0][0] === sMessage, 'Test confirm popup message');
        ok(confirm.args[0][1] === sCallback, 'Test confirm sCallback');
        ok(confirm.args[0][2] === sTitle, 'Test confirm popup message sTitle');

        //test confirm message with action
        oController.doShowMessage(sap.ushell.services.Message.Type.CONFIRM, sMessage, {
            title: sTitle,
            callback: sCallback,
            actions: "action"
        });
        ok(show.callCount === 2, 'Test confirm popup called with actions');
        ok(show.args[1][0] === sMessage, 'Test confirm popup (with actions) message');
        ok(show.args[1][1] === 'QUESTION', 'Test confirm popup (with actions) type');
        ok(show.args[1][2] === sTitle, 'Test confirm popup (with actions) message sTitle');
        ok(show.args[1][3] === 'action', 'Test confirm popup (with actions) actions');
        ok(show.args[1][4] === sCallback, 'Test confirm popup (with actions) sCallback');

        //test other message without duration
        oController.doShowMessage("otherType", sMessage, {duration: null});
        ok(mtShow.calledOnce === true, 'Test toast called');
        ok(mtShow.args[0][0] === sMessage, 'Test toast message');
        ok(mtShow.args[0][1].duration === 3000, 'Test toast duration');

        //test other message with duration
        oController.doShowMessage("otherType", sMessage, {duration: 1});
        ok(mtShow.callCount === 2, 'Test toast called');
        ok(mtShow.args[1][0] === sMessage, 'Test toast message');
        ok(mtShow.args[1][1].duration === 1, 'Test toast duration');

        show.restore();
        confirm.restore();
        mtShow.restore();
        stubEmbeddedSupportErrorMessage.restore();
    });

    test("test fixShellHash", function () {
        var hash = oController.fixShellHash("");
        ok(hash === "#", 'Test fix empty has');

        hash = oController.fixShellHash("test");
        ok(hash === "#test", 'Test adding # prefix');

        hash = oController.fixShellHash("#");
        ok(hash === "#", 'Test hash equal #');

        hash = oController.fixShellHash("#test");
        ok(hash === "#test", 'Test no fix required');
    });


    test("test openLoadingScreen", function() {
        oController.oApplicationLoadingScreen = {
            setText: sinon.spy(),
            openLoadingScreen: sinon.spy(),
        };
        oController.getModel().setProperty("/enableFiori2LoadingDialog",true);
        oController.openLoadingScreen();

        ok(oController.oApplicationLoadingScreen.openLoadingScreen.calledOnce, "oController.oApplicationLoadingScreen.openLoadingScreen called once");
    });

    test("test closeLoadingScreen", function() {
        oController.oApplicationLoadingScreen = {
            closeLoadingScreen: sinon.spy()
        };
        oController.getModel().setProperty("/enableFiori2LoadingDialog",false);
        oController.closeLoadingScreen();

        ok(oController.oApplicationLoadingScreen.closeLoadingScreen.calledOnce, "oController.oApplicationLoadingScreen.closeLoadingScreen called once");
    });

//    test("test openDashboard", function () {
//        oController.oNavContainer = {
//            backToTop : function(){}
//        };
//        oController.oLoadingDialog = {
//            closeLoadingScreen : function() {}
//        };
//
//        var close = sinon.stub(sap.m.BusyDialog.prototype, "close"); //to block unwanted busy-dialog issues
//        var switchViewState = sinon.stub(oController, "switchViewState");
//        var setAppIcons = sinon.stub(oController, "setAppIcons");
//        var byIDstub =  sinon.stub( sap.ui.getCore(), "byId").returns(
//            {
//                focusOnConfigBtn : function(){return true}
//            }
//        );
//        oController.openDashboard();
//        ok(switchViewState.calledOnce === true ,'Test switch view state called');
//        ok(switchViewState.args[0][0] === "home" ,'Test switch view state called with home');
//        ok(setAppIcons.calledOnce === true ,'Test setAppIcons called');
//
//        switchViewState.restore();
//        setAppIcons.restore();
//        close.restore();
//        byIDstub.restore();
//    });
//

    test("test setApplicationConfiguration", function () {
        var oTestConfiguration = {
                "test-intent": {val: 'xxx'}
            },
            oApplication = {
                applicationConfiguration: {},
                additionalInformation: ""
            },
            oConfig = {applications: oTestConfiguration},
            oData = {sShellHash: "test", semanticObject: "test", action: "intent"},
            stubPublishNavigationStateEvents = sinon.stub(oController, "publishNavigationStateEvents"),
            stubGetViewData = sinon.stub(oController, "getView").returns({
                getViewData: function () {
                    return {config: oConfig};
                }
            }),
            bIsConfigSet;

        oController.oViewPortContainer = {
            getViewPortControl: function () {
                return null;
            },
            addCenterViewPort: function () {
                return null;
            }
        };

        oController._setConfigurationToModel();
        //   oController.getWrappedApplication(oApplication, oData, {});
        oController.getWrappedApplication("test-intent", {title: "title"}, oApplication, null, null);

        bIsConfigSet = JSON.stringify(oTestConfiguration["test-intent"]) === JSON.stringify(oApplication.applicationConfiguration);
        ok(bIsConfigSet, 'Test set application configuration');
        stubPublishNavigationStateEvents.restore();
        stubGetViewData.restore();
    });

    test("test setAppIcons", function () {
        var setIcons = sinon.spy(jQuery.sap, "setIcons"),
            getFavIconHref,
            oMetadataConfig;

        //without meta config & ios
        sap.ui.Device.os.ios = true;
        oController.setAppIcons();

        ok(setIcons.calledOnce === true, 'Test set icons called');
        ok(setIcons.args[0][0].favicon === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchpad_favicon.ico", 'Test favicon');
        ok(setIcons.args[0][0].phone === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png", 'Test phone');
        //ok(jQuery.sap.setIcons.args[0][0].precomposed === true ,'Test precomposed');

        //without meta config & not ios
        sap.ui.Device.os.ios = false;
        getFavIconHref = sinon.stub(oController, "getFavIconHref");
        getFavIconHref.returns("test");

        oController.setAppIcons();

        ok(jQuery.sap.setIcons.callCount === 2, 'Test set icons called');
        ok(jQuery.sap.setIcons.args[1][0].favicon === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchpad_favicon.ico", 'Test favicon');
        ok(jQuery.sap.setIcons.args[1][0].phone === "", 'Test phone');

        //ios with meta config
        oMetadataConfig = {
            homeScreenIconPhone: "homeScreenIconPhone",
            "homeScreenIconPhone@2": "homeScreenIconPhone@2",
            homeScreenIconTablet: "homeScreenIconTablet",
            "homeScreenIconTablet@2": "homeScreenIconTablet@2",
            favIcon: "favIcon",
            title: "title"
        };
        sap.ui.Device.os.ios = true;
        oController.setAppIcons(oMetadataConfig);
        ok(setIcons.callCount === 3, 'Test set icons called');
        ok(setIcons.args[2][0].favicon === "favIcon", 'Test favicon');
        ok(setIcons.args[2][0].phone === "homeScreenIconPhone", 'Test phone');

        setIcons.restore();
        getFavIconHref.restore();
    });

    test("test onAfterNavigate", function () {

        oController.closeLoadingScreen = sinon.spy();
        oController.oViewPortContainer = {
            getInitialCenterViewPort: function () {
                return null;
            },
            removeCenterViewPort: function () {
                return;
            }
        };
        oController.onAfterNavigate({
            getParameter : function () {
                return;
            },
            mParameters: {}
        });
        ok(oController.closeLoadingScreen.calledOnce , 'Test close load screen called after navigation');
    });


    test("test togglePane", function () {
        var oEvent = {
                getSource: sinon.stub().returns({
                    getSelected: sinon.stub(),
                    getModel: sinon.stub().returns({
                        setProperty: sinon.spy(),
                        getProperty: sinon.spy()
                    })

                }),
                getParameter: sinon.stub().returns("categoriesBtn")
            },
            getView = sinon.stub(oController, "getView").returns({
                oDashboardManager: {
                    getGroupListView: function () {
                        return ({
                            addStyleClass: function () {
                            },
                            getId: function () {
                                return "id";
                            }
                        });
                    }
                }
            });
        sap.ui.Device.system.desktop = true;

        //id = categories button
        oController.togglePane(oEvent);
        ok(oEvent.getSource().getModel().setProperty.callCount === 1, 'Event source model set properties called 1 time');
        ok(oEvent.getSource().getModel().setProperty.args[0][0] === '/currentState/showCurtainPane', 'Event source model set properties called with /currentState/showCurtainPane');

        //id != categories button
        oEvent.getParameter = sinon.stub().returns("other");
        oController.togglePane(oEvent);
        ok(oEvent.getSource().getModel().setProperty.callCount === 2, 'Event source model set properties called 1 time');
        ok(oEvent.getSource().getModel().setProperty.args[1][0] === '/currentState/showPane', 'Event source model set properties called with /currentState/showPane');

        getView.restore();
    });
    asyncTest("test handleConditionalNavigation", function () {
        var sVeryLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&%2fERP%2fCOMPCODE=0001&%2fERP%2fCO_AREA=0001&%2fERP%2fLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2fERP%2fP_0CURRENCY03=EUR&BSA_VARIABLE_%2fERP%2fP_0FISCVARNT01=K3&BSA_VARIABLE_%2fERP%2fP_0FISCYEAR01=2015&BSA_VARIABLE_%2fERP%2fP_CATEGORY=ACT01&BSA_VARIABLE_%2fERP%2fP_CHRTACCT01=INT&BSA_VARIABLE_%2fERP%2fP_CO_AREA01=0001&BSA_VARIABLE_%2fERP%2fP_LEDGER01=0L&BSA_VARIABLE_%2fERP%2fS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G&sap-language=EN&sap-client=902&sap-language=EN",
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sVeryLongUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sinon.stub(oController, "_isColdStart").returns(true);
        sinon.stub(oController, "navigate").returns(true);

        oController._handleConditionalNavigation(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        start();
        ok(oResolvedHashFragment, "Test oResolvedHashFragment.url is defigned");
        oController._isColdStart.restore();
        oController.navigate.restore();
    });

    [
        /**
         * Test the behavior of doHashChange with cold start promise.
         */
        {
            testDescription: "sap-ushell-async-libs-promise-directstart does not exist",
            bDirectStartPromiseLoadsComponent: false,
            bInjectPromiseInWindow: false,
            bIsUi5Target: true,
            expectedResolveHashFragmentCalls: 1,
            expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component" },
            expectedLoadComponentCalls: 1
        },
        {
            testDescription: "sap-ushell-async-libs-promise-directstart exists with ui5 target direct started",
            bDirectStartPromiseLoadsComponent: true, // ui5 component loaded early
            bInjectPromiseInWindow: true,
            bIsUi5Target: true,
            expectedResolveHashFragmentCalls: 0,
            expectedResolvedHashFragment: {
                url: "/from/promise",
                ui5ComponentName: "fake.ui5.component",
                componentHandle: {
                    "fake": "componentHandle"
                },
            },
            expectedLoadComponentCalls: 0
        },
        {
            testDescription: "sap-ushell-async-libs-promise-directstart exists with non-ui5 target direct started",
            bDirectStartPromiseLoadsComponent: false, // non-ui5 target
            bInjectPromiseInWindow: true,
            bIsUi5Target: false,
            expectedResolveHashFragmentCalls: 0,
            expectedResolvedHashFragment: { url: "/from/promise" }, // takes resolved hash fragment from promise
            expectedLoadComponentCalls: 0            // Ui5ComponentLoader is NOT called for non-ui5 targets (would ignore it,
                                                     // but we avoid stopping the current app's router in that case
        }
    ].forEach(function (oFixture) {
        asyncTest("doHashChange loads application component correctly when " + oFixture.testDescription, function () {
            var oNTRSResolveHashFragmentStub = sinon.stub(),
                oCreateComponentPromise = new jQuery.Deferred().resolve(oFixture.expectedResolvedHashFragment).promise(),
                fnCreateComponentStub = sinon.stub().returns(
                    oCreateComponentPromise
                ),
                oResolvedHashFragment = {};

            if (oFixture.bIsUi5Target) {
                oResolvedHashFragment.ui5ComponentName = "fake.ui5.component";
            }

            // if component is loaded, the resolved hash fragment contains a componentHandle property
            if (oFixture.bDirectStartPromiseLoadsComponent) {
                oResolvedHashFragment.componentHandle = { fake: "componentHandle" };
            }

            oController.oLoadingDialog = {
                setText: sinon.stub.returns(undefined),
                openLoadingScreen: sinon.stub.returns(undefined),
                closeLoadingScreen: sinon.stub.returns(undefined)
            };
            oController._loadCoreExt = sinon.spy();
            oController._initiateApplication = sinon.spy();
            oController.history = sinon.spy();

            /*
             * Expose _resolveHashFragment promise to trigger the tests
             */
            var fnOriginalResolveHashFragment = oController._resolveHashFragment,
                oResolveHashFragmentPromise;

            oController._resolveHashFragment = function () {
                oResolveHashFragmentPromise = fnOriginalResolveHashFragment.apply(oController, arguments);
                return oResolveHashFragmentPromise;
            };

            sinon.stub(sap.ushell.Container, "getService");
            sap.ushell.Container.getService.withArgs("NavTargetResolution").returns({
                resolveHashFragment: oNTRSResolveHashFragmentStub.returns(
                    new jQuery.Deferred().resolve(jQuery.extend({
                        url: "/from/service"
                    }, oResolvedHashFragment)
                ).promise())
            });
            sap.ushell.Container.getService.withArgs("URLParsing").returns({
                parseShellHash: sinon.stub()
            });
            sap.ushell.Container.getService.withArgs("Ui5ComponentLoader").returns({
                createComponent: fnCreateComponentStub
            });

            oController.history.hashChange = sinon.spy();
            oController.history.getHistoryLength = sinon.stub().returns(0);
            oController.navigate = sinon.spy();
            oController.oCoreExtLoadingDeferred = new jQuery.Deferred().resolve();

            // simulate direct start promise in window
            var oOriginalDirectStartPromise = window["sap-ushell-async-libs-promise-directstart"];
            if (oFixture.bInjectPromiseInWindow) {
                window["sap-ushell-async-libs-promise-directstart"] = new Promise(function (resolve, reject) {
                    resolve({
                        resolvedHashFragment: jQuery.extend({
                            url: "/from/promise",
                        }, oResolvedHashFragment)
                    });
                });
            } else {
                window["sap-ushell-async-libs-promise-directstart"] = undefined;
            }

            oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);

            oResolveHashFragmentPromise // promise from _resolveHashFragment not resolveHashFragment
                .fail(function () {
                    ok(false, "_resolveHashFragment promise was resolved");
                })
                .done(function (oGotResolvedHashFragment, oGotParsedShellHash) {
                    ok(true, "_resolveHashFragment promise was resolved");

                    var iGotCalls = oNTRSResolveHashFragmentStub.getCalls().length;

                    strictEqual(iGotCalls, oFixture.expectedResolveHashFragmentCalls,
                        "NavTargetResolution#resolveHashFragment method was called " + oFixture.expectedResolveHashFragmentCalls + " times");

                    deepEqual(oGotResolvedHashFragment, oFixture.expectedResolvedHashFragment,
                        "_resolveHashFragment resolved to the expected hash fragment");
                })
                .always(function () {
                    strictEqual(fnCreateComponentStub.getCalls().length,
                        oFixture.expectedLoadComponentCalls,
                        "Ui5ComponentLoader.loadComponent was called " + oFixture.expectedLoadComponentCalls + " times");

                    start();

                    function testInitiateApplicationCalledOnceAndRestore() {
                        strictEqual(oController._initiateApplication.getCalls().length, 1,
                            "_initiateApplication was called 1 time after _resolveHashFragment promise is resolved");

                        // restore
                        oController._resolveHashFragment = fnOriginalResolveHashFragment;
                        sap.ushell.Container.getService.restore();
                        window["sap-ushell-async-libs-promise-directstart"] = oOriginalDirectStartPromise;
                    }

                    /*
                     * Test _initiateApplication synchronously/asynchronously
                     * based on whether the coldstart promise was provided.
                     */
                    if (oFixture.expectedLoadComponentCalls > 0) {
                        stop();
                        oCreateComponentPromise.always(function () {
                            testInitiateApplicationCalledOnceAndRestore();
                            start();
                        });
                    } else {
                        testInitiateApplicationCalledOnceAndRestore();
                    }

                });
        });
    });
    /**
     * Test the behavior of doHashChange with and without navResCtx
     */
    test("test doHashChange and navResCtx", function () {
        oController.oLoadingDialog = {
            setText: sinon.stub.returns(undefined),
            openLoadingScreen: sinon.stub.returns(undefined),
            closeLoadingScreen: sinon.stub.returns(undefined)
        };
        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        oController.navigate = sinon.spy();
        oController.oCoreExtLoadingDeferred = $.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();
        var oResolvedHashFragmentResult = {
                additionalInformation: "additionalInformation",
                url: "url",
                applicationType: "applicationType",
                navigationMode: "navigationMode"
            },
            oResolvedHashFragment2 = {
                additionalInformation: ["additionalInformation2"],
                url: ["url2"],
                applicationType: ["applicationType2"],
                navigationMode: ["navigationMode2"]
            },
            dfdA = $.Deferred(),
            dfdB = $.Deferred(),
            resolveHashFragmentStub;

        // Test doHashChange (by spying the calls to history.hashChange and navigate) without navResCtx

        // In this case (no navResCtx) we don't need function _resolveHashFragment to run,
        // we just need it to return a deferred.promise object that later will be resolved (hence, we use stub on _resolveHashFragment)
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdA.promise());

        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        ok(oController.history.hashChange.calledOnce === true, 'No hash parsed yet (!navResCtx) and dfdA is resolved - Hash changed was called');
        ok(oController.history.hashChange.args[0][0] === "#hash" && oController.history.hashChange.args[0][1] === "#oldHash", "history.hashChange was called with #hash and #oldHash");

        dfdA.resolve(oResolvedHashFragmentResult, {a: "aa"});
        dfdA.done(function () {
            ok(oController.navigate.calledOnce === true, 'navigate was called once');
            ok(oController.navigate.args[0][3].navigationMode === "navigationMode", 'navigate was called with the correct navigationMode');
        });

        // Test doHashChange (by spying the calls to history.hashChange and navigate) with contextRaw = "navResCtx"

        // In this case (navResCtx exists) we  need function _resolveHashFragment to run, and inside it -
        // we need the function parseShellHash  of the service URLParsing to return contextRaw="navResCtx" and param object (hence, we don't use stub on _resolveHashFragment)
        oController._resolveHashFragment.restore();

        sinon.stub(sap.ushell.Container, "getService");
        sap.ushell.Container.getService.withArgs("URLParsing").returns({
            parseShellHash: function () {
                return {
                    semanticObject: undefined,
                    action: undefined,
                    contextRaw: "navResCtx",
                    params: oResolvedHashFragment2
                };
            }
        });
        sap.ushell.Container.getService.withArgs("Ui5ComponentLoader").returns({
            createComponent: sinon.stub().returns(
                new jQuery.Deferred().resolve({}).promise()
            )
        });

        oController.doHashChange(sShellHashNavResCtx, sAppPart, sOldShellHash, sOldAppPart, null);
        ok(oController.navigate.callCount === 2, 'Test hash parsed - navigate was called for the 2nd time');
        ok(oController.navigate.args[1][3].navigationMode === "navigationMode2", 'navigate was called with the correct navigationMode');
    });

    test("Test fallback to Shell-home if history exist & previous url is not valid navigation", function () {

        var reportErrorStub = sinon.stub(oController, "reportError"),
            closeLoadingScreenStub = sinon.stub(oController, "closeLoadingScreen"),
            delayedMessageErrorStub = sinon.stub(oController, "delayedMessageError"),
            getUriParametersStub = sinon.stub(jQuery.sap, "getUriParameters").returns({
                get: function (str) {
                    return true;
                }
            }),
            setHashStub = sinon.stub(hasher, "setHash");

        oController.hashChangeFailure(1, null, null, null);
        ok(setHashStub.calledOnce, "Attached navigateBack function is used");

        reportErrorStub.restore();
        closeLoadingScreenStub.restore();
        delayedMessageErrorStub.restore();
        getUriParametersStub.restore();
        setHashStub.restore();

    });

    /**
     * Test the behaviour of doHashChange with parseError or resolveHashFragment failure
     */
    test("test doHashChange failure flow", function () {
        oController.oLoadingDialog = {
            setText: sinon.stub.returns(undefined),
            openLoadingScreen: sinon.stub.returns(undefined),
            closeLoadingScreen: sinon.stub.returns(undefined)
        };

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        oController.navigate = sinon.spy();
        oController.oCoreExtLoadingDeferred = $.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        var oResolvedHashFragmentResult = {
                additionalInformation: "additionalInformation",
                url: "url",
                applicationType: "applicationType",
                navigationMode: "navigationMode"
            },
            parseShellHashMock = sinon.stub(),
            resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment"),
            dfdA = $.Deferred(),
            dfdB = $.Deferred(),
            oParseError;

        sap.ushell.Container.getService = sinon.stub().returns({
            parseShellHash: parseShellHashMock
        });

        sinon.spy(oController, "hashChangeFailure");

        oParseError = {message: "error"};
        oController.reportError = sinon.spy();
        oController.oLoadingDialog = {
            closeLoadingScreen: function () {
            }
        };
        oController.delayedMessageError = sinon.spy();

        // Test doHashChange with parseError and history = 0
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        ok(oController.hashChangeFailure.calledOnce, 'Parse Error (with no history) - hashChangeFailure called');
        ok(hasher.getHash() === "", 'Parse Error (with no history) - Hash set to empty string');

        // Test doHashChange with parseError and history > 0
        oController.history.getHistoryLength.returns(1);
        oController._windowHistoryBack = sinon.spy();
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        ok(oController.hashChangeFailure.callCount === 2, 'Parse Error (with history) - hashChangeFailure called for the 2nd time');
        ok(oController._windowHistoryBack.calledOnce === true, 'Parse Error (with history) - windowHistoryBack called once');

        // Test doHashChange when resolveHashFragment fails (no parse error, no navResCtx, history = 0)
        oController.history.getHistoryLength.returns(0);
        dfdA = $.Deferred();
        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdA.promise());

        oController.oLoadingDialog = {
            setText: sinon.stub.returns(undefined),
            openLoadingScreen: sinon.stub.returns(undefined),
            closeLoadingScreen: sinon.stub.returns(undefined)
        };
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        dfdA.reject();
        dfdA.fail(function () {
            ok(hasher.getHash() === "", 'Test doHashChange with failure in resolveHashFragment. Without navResCtx and history = 0');
        });

        // Test doHashChange when resolveHashFragment fails (no parse error, no navResCtx, history > 0)
        oController.history.getHistoryLength.returns(1);

        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdB.promise());
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        dfdB.reject();
        dfdB.fail(function () {
            ok(oController._windowHistoryBack.callCount === 2, 'Test doHashChange with failure in resolveHashFragment. Without navResCtx, and history > 0');
        });
        resolveHashFragmentStub.restore();
    });

    asyncTest("test NWBC navigation:  direct open new window with original intent", function () {
        var sTargetUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=000&sap-language=EN&sap-ie=edge&sap-theme=sap_bluecrystal&sap-shell=FLP1.34.1-NWBC",
            oParsedShellHashParam,
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sTargetUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded",
                "sap-system": "U1Y_000"
            },
            oMetadata = {},
            oParsedShellHash = {
                semanticObject: "Action",
                action: "test",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {}, // note, no sap-system propagated in parameter
            },
            sFixedShellHash = "#Action-test?sap-system=U1Y_000",
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "delayedMessageError").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        strictEqual(navSpy.callCount, 2, "Function navigate called twice");
        oParsedShellHashParam = navSpy.args[1][0];
        strictEqual(typeof oParsedShellHashParam.contextRaw, "undefined", "contextRaw is undefined in parsed shell hash parameter");
        deepEqual(navSpy.args[1][3].url,encodeURI("#Action-test?sap-system=U1Y_000"), "url ok");
        deepEqual(navSpy.args[1][3].navigationMode, "newWindow", "navigationMode ok");
        oController.navigate.restore();
        oController._isColdStart.restore();
        start();
    });

    asyncTest("test WDA navigation fallback", function () {
        var sVeryLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&%2fERP%2fCOMPCODE=0001&%2fERP%2fCO_AREA=0001&%2fERP%2fLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2fERP%2fP_0CURRENCY03=EUR&BSA_VARIABLE_%2fERP%2fP_0FISCVARNT01=K3&BSA_VARIABLE_%2fERP%2fP_0FISCYEAR01=2015&BSA_VARIABLE_%2fERP%2fP_CATEGORY=ACT01&BSA_VARIABLE_%2fERP%2fP_CHRTACCT01=INT&BSA_VARIABLE_%2fERP%2fP_CO_AREA01=0001&BSA_VARIABLE_%2fERP%2fP_LEDGER01=0L&BSA_VARIABLE_%2fERP%2fS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G&sap-language=EN&sap-client=902&sap-language=EN",
            oResolvedHashFragmentParam,
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sVeryLongUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY" : ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G",
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "delayedMessageError").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");
        // act
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        strictEqual(navSpy.callCount, 2, "Function navigate called twice");
        deepEqual(navSpy.args[1][3].url, encodeURI(sFixedShellHash), "target window hash ok");
        deepEqual(navSpy.args[1][3].navigationMode, "newWindow");
        start();
    });


    asyncTest("test WDA navigation ", function () {
        var sNotLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&sap-client=902&sap-language=EN",
            oResolvedHashFragmentParam,
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sNotLongUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY" : ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#semanticObject-action?",
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "delayedMessageError").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        strictEqual(navSpy.callCount, 2, "Function navigate called twice");
        oResolvedHashFragmentParam = navSpy.args[1][3];
        strictEqual(oResolvedHashFragmentParam.url, "#semanticObject-action?", "The URL was double encoded");
        oController.navigate.restore();
        oController._isColdStart.restore();
        start();
    });

    /**
     * Test the correctness of navigation mode as it is changed in function navigate:
     *
     * navigation mode = newWindowThenEmbedded:
     *   If coldStart = true  => Call navigate once with "embedded",
     *   If coldStart = false => Call navigate once with "newWindow" for opening the app,
     *   If history.backwards => Call navigate once with "embedded"
     *
     * navigation mode = newWindow:
     *   If coldStart = true => call navigate once with "replace"
     *   If coldStart = false => call _openAppNewWindow and _windowHistoryBack
     */
    test("test navigate - navigationMode change", function () {
        var oResolvedHashFragmentParam,
            oNavMode,
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: "http://www.sap.com/index.html",
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            params = {},
            semanticObject = "semanticObject",
            action = "action",
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "semanticObject-action",
            oOpenAppNewWindowStub,
            oWindowHistoryBackStub,
            oDelayedMessageErrorStub,
            oChangeWindowLocationStub,
            oHandleEmbeddedNavModeStub,
            oIsColdStartStub,
            navSpy,
            bOriginalBackwards;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow").returns();
        oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack").returns();
        oDelayedMessageErrorStub = sinon.stub(oController, "delayedMessageError").returns();
        oChangeWindowLocationStub = sinon.stub(oController, "_changeWindowLocation").returns();
        oHandleEmbeddedNavModeStub = sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        oController.oCoreExtLoadingDeferred = $.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);
        navSpy = sinon.spy(oController, "navigate");
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 2, "Function nanvigate called twice");
        oResolvedHashFragmentParam = navSpy.args[1][3];
        oNavMode = oResolvedHashFragmentParam.navigationMode;
        ok(oResolvedHashFragmentParam.navigationMode === "embedded", "Navigate called with navigationMode=embedded");

        oController.navigate.restore();
        oController._isColdStart.restore();

        // Prepare for next test. Make sure history.backwards=false won't cause
        // the next test to succeed.
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(undefined);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        bOriginalBackwards = oController.history.backwards;
        oController.history.backwards = false;  // NOTE
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 2, "Navigate called twice");
        oResolvedHashFragmentParam = oController.navigate.args[1][3];
        oNavMode = oResolvedHashFragmentParam.navigationMode;
        ok(oResolvedHashFragmentParam.navigationMode !== "embedded", "Navigate called with other navigationMode than embedded");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController.history.backwards = bOriginalBackwards;

        // Test the behaviour when navigationMode is newWindowThenEmbedded and history.backwards=true
        // The result should be one (new) call to navigate with navigationMode=embedded
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(undefined);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        // simulate newWindowThenEmbedded url once navigated to
        bOriginalBackwards = oController.history.backwards;
        oController.history.backwards = true;

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 2, "Navigate called twice");
        oResolvedHashFragmentParam = oController.navigate.args[1][3];
        oNavMode = oResolvedHashFragmentParam.navigationMode;
        // TODO: Talk to Dimatteo. _isColdStart is always false
        //ok(oResolvedHashFragmentParam.navigationMode === "embedded", "Navigate called with navigationMode=embedded");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController.history.backwards = bOriginalBackwards;

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 2, "Navigate called twice");
        oResolvedHashFragmentParam = oController.navigate.args[1][3];
        oNavMode = oResolvedHashFragmentParam.navigationMode;
        ok(oResolvedHashFragmentParam.navigationMode === "newWindow", "Navigate called with navigationMode=newWindow");

        oController.navigate.restore();
        oController._isColdStart.restore();

        // Test the behaviour when navigationMode is newWindow and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);
        

        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow",
         
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 2, "Navigate called twice");
        oResolvedHashFragmentParam = oController.navigate.args[1][3];
        oNavMode = oResolvedHashFragmentParam.navigationMode;
        ok(oResolvedHashFragmentParam.navigationMode === "replace", "Navigate called with navigationMode=replace");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController._windowHistoryBack.restore();
        oController._openAppNewWindow.restore();

        // Test the behaviour when navigationMode is newWindow and coldStart=false.
        // The result: _openAppNewWindow and _windowHistoryBack are called
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);
        
        //Arrange
        var oMockComponent = {
                destroy : sinon.stub()
        };
        
      
        var oMockComponentHandle = {
            getInstance : function() {
                return oMockComponent;
            }
        }
        
        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow",
            componentHandle :  oMockComponentHandle
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 1, "navigate called once");
        equal(oController._openAppNewWindow.callCount, 1, "_openAppNewWindow called once");
        equal(oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        equal(oController.history.pop.callCount, 1, "History pop is called once");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oDelayedMessageErrorStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();

        // Test the behaviour when resolveHashFragment resolves to undefined (no coldstart case)
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();
        sinon.stub(window.hasher, "setHash");

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);

        oResolvedHashFragment = undefined;
 
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(oMockComponent.destroy.callCount, 1, "destroy called");
        equal(navSpy.callCount, 1, "navigate called once");
        equal(oController._openAppNewWindow.callCount, 0, "_openAppNewWindow was not called");
        equal(oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        equal(oController.history.pop.callCount, 1, "History pop is called once");
        equal(window.hasher.setHash.callCount, 0, "window.hasher.setHash was not called");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oDelayedMessageErrorStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();
        window.hasher.setHash.restore();

        // Test the behaviour when resolveHashFragment resolves to undefined (coldstart case)
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();
        sinon.stub(window.hasher, "setHash");

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);

        oResolvedHashFragment = undefined;

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(navSpy.callCount, 1, "navigate called once");
        equal(oController._openAppNewWindow.callCount, 0, "_openAppNewWindow was not called");
        equal(oController._windowHistoryBack.callCount, 0, "_windowHistoryBack was not called");
        equal(oController.history.pop.callCount, 0, "History pop was not called");
        equal(window.hasher.setHash.callCount, 1, "window.hasher.setHash was called once");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oDelayedMessageErrorStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();
        window.hasher.setHash.restore();
    });

    [
        {
            testDescription: "expanded url is opened in a new window",
            // input
            bIsColdStart: true,  // NOTE: coldstart
            oParsedShellHash: {
                "semanticObject": "Action", "action": "toWdaProductDetails", "contextRaw": "navResCtx",
                "params": {
                    "additionalInformation": [""],
                    "applicationType": ["NWBC"],
                    "navigationMode": ["newWindowThenEmbedded"],
                    "original_intent": ["#Action-toWdaProductDetails?productId=HT-1010"],
                    "productId": ["HT-1010"],
                    "title": ["undefined"]
                }
            },
            oMetadata: {},
            oResolvedHashFragment: {
                additionalInformation: "",
                applicationType: "NWBC",
                navigationMode: "newWindowThenEmbedded",
                text: "undefined"
            },
            expectedCalledWith: {  // undefined -> expect no call
                changeWindowLocation: undefined,
                windowHistoryBack: undefined,
                hasherReplaceHash: "#Action-toWdaProductDetails?productId=HT-1010"
            }
        },
        {
            testDescription: "intent to external url is navigated from the same window",
            // input
            bIsColdStart: false,
            oParsedShellHash: {
                semanticObject: "Action",
                action: "toAbsoluteUrl",
                contextRaw: undefined,
                params: Object,
                appSpecificRoute: undefined
            },
            sFixedShellHash: "#Action-toAbsoluteUrl",
            oMetadata: {},
            oResolvedHashFragment: {
                applicationType: "URL",
                additionalInformation: "",
                text: "toAbsoluteUrl",
                navigationMode: "newWindow"
            },
            expectedCalledWith: {  // undefined -> expect no call
                changeWindowLocation: undefined,
                windowHistoryBack: 1,
                hasherReplaceHash: undefined
            }
        },
        {
            testDescription: "intent to external url is pasted in a new window",
            // input
            bIsColdStart: true,  // NOTE: simulating coldstart
            oParsedShellHash: {
                semanticObject: "Action",
                action: "toAbsoluteUrl",
                contextRaw: undefined,
                params: Object,
                appSpecificRoute: undefined
            },
            sFixedShellHash: "#Action-toAbsoluteUrl",
            oMetadata: {},
            oResolvedHashFragment: {
                applicationType: "URL",
                additionalInformation: "",
                text: "toAbsoluteUrl",
                url: "http://test",
                navigationMode: "newWindow"
            },
            expectedCalledWith: {  // undefined -> expect no call
                changeWindowLocation: "http://test",
                windowHistoryBack: undefined,
                hasherReplaceHash: undefined
            }
        }
    ].forEach(function (oFixture) {
            test("test navigate - restores url to correct hash after navigation occurs when " + oFixture.testDescription, function () {
                var bCWLCall,
                    bWHBCall,
                    bHRHCall;

                sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation").returns(false);

                sinon.stub(oController, "_openAppNewWindow");
                sinon.stub(oController, "_windowHistoryBack");
                sinon.stub(oController, "hashChangeFailure");
                sinon.stub(oController, "_changeWindowLocation");
                sinon.stub(oController, "_handleEmbeddedNavMode");
                sinon.stub(oController, "_isColdStart").returns(oFixture.bIsColdStart);
                sinon.stub(window.hasher, "replaceHash");

                sinon.spy(oController, "navigate");

                // Act
                oController.navigate(
                    oFixture.oParsedShellHash,
                    oFixture.sFixedShellHash,
                    oFixture.oMetadata,
                    oFixture.oResolvedHashFragment
                );

                // Assert
                ok(oController.hashChangeFailure.called === false,
                    "hashChangeFailure was not called");

                bCWLCall = (typeof oFixture.expectedCalledWith.changeWindowLocation !== "undefined");
                strictEqual(oController._changeWindowLocation.called, bCWLCall,
                    "_changeWindowLocation was " + (bCWLCall ? "" : "not") + " called");

                if (bCWLCall) {
                    deepEqual(oController._changeWindowLocation.getCall(0).args[0],
                        oFixture.expectedCalledWith.changeWindowLocation,
                        "_changeWindowLocation was called with the expected parameter");
                }


                bWHBCall = (typeof oFixture.expectedCalledWith.windowHistoryBack !== "undefined");
                strictEqual(oController._windowHistoryBack.called, bWHBCall,
                    "_windowHistoryBack was " + (bWHBCall ? "" : "not") + " called");

                if (bWHBCall) {
                    deepEqual(oController._windowHistoryBack.getCall(0).args[0],
                        oFixture.expectedCalledWith.windowHistoryBack,
                        "_windowHistoryBack was called with the expected parameter");
                }


                bHRHCall = (typeof oFixture.expectedCalledWith.hasherReplaceHash !== "undefined");
                strictEqual(window.hasher.replaceHash.called, bHRHCall,
                    "window.hasher.replaceHash was " + (bHRHCall ? "" : "not") + " called");

                if (bHRHCall) {
                    deepEqual(window.hasher.replaceHash.getCall(0).args[0],
                        oFixture.expectedCalledWith.hasherReplaceHash,
                        "window.hasher.replaceHash was called with the expected parameter");
                }

                window.hasher.replaceHash.restore();
                // no need to restore oController stubs/spies as a new instance of
                // oController will be created with the next test (see setup).
            });
        });

    test("test navigate - calls doNavigate with sap-user parameter appended to URL for NWBC urls", function () {
        var sNwbcUrl = "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=",
            sNwbcUrlReplaced = "/new/url/with/sap-client/param";

        // simulate NWBC native navigation capabilities
        sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation").returns(true);

        // simulate response from utility method
        sinon.stub(sap.ushell.utils, "appendUserIdToUrl").returns(sNwbcUrlReplaced);

        // stub the rest (in case the test fails)
        sinon.stub(oController, "_openAppNewWindow");
        sinon.stub(oController, "_windowHistoryBack");
        sinon.stub(oController, "hashChangeFailure");
        sinon.stub(oController, "_changeWindowLocation");
        sinon.stub(oController, "_handleEmbeddedNavMode");
        sinon.stub(oController, "closeLoadingScreen");
        sinon.stub(oController, "_isColdStart").returns(false);
        sinon.stub(window.hasher, "replaceHash");

        // stub doNavigate
        if (typeof window.external.getPrivateEpcm !== "undefined") {
            strictEqual(window.external.getPrivateEpcm, undefined, "window.external.getPrivateEpcm is not defined");
            return;
        }

        var oDoNavigateStub = sinon.stub();

        try {
            window.external.getPrivateEpcm = sinon.stub().returns({
                doNavigate: oDoNavigateStub
            });

            // Act
            oController.navigate(
                undefined, // doesn't matter (oParsedShellHash)
                "#",       // doesn't matter (sFixedShellHash)
                {},        // doesn't matter (oMetadata)
                {          // under test (oResolvedHashFragment)
                    url: sNwbcUrl
                }
            );

            // Assert
            strictEqual(sap.ushell.utils.appendUserIdToUrl.getCalls().length,
                1, "sap.ushell.utils.appendUserIdToUrl was called once");

            strictEqual(oDoNavigateStub.getCalls().length, 1, "epcm doNavigate was called once");
            deepEqual(oDoNavigateStub.getCall(0).args, [sNwbcUrlReplaced], "epcm doNavigate was called with the expected URL");

            delete window.external.getPrivateEpcm;
        } catch(err) {
            ok(err.message === "Object doesn't support this property or method", "it is impossible to extend window.external in IE");
        }
    });

    /**
     * Test the correctness of the state, in "embedded" navMode.
     * The state is maniulated by the calls to switchViewState in _handleEmbeddedNavMode
     *
     *   If applicationType = "NWBC" => state = "minimal"
     *   If applicationType = "TR" => state = "minimal"
     *   If sFixedShellHash = "#" => state = "home"
     *   If non of the above => state = "app"
     */
    [
        {
            sApplicationType: "NWBC"
        },
        {
            sApplicationType: "TR"
        }
    ].forEach(function (oFixture) {
        test("test navigate - switching view state", function () {
            var oResolvedHashFragmentParam,
                oNavMode,
                oResolvedHashFragment = {
                    applicationType: oFixture.sApplicationType,
                    url: "XXX",
                    additionalInformation: "",
                    navigationMode: "embedded"
                },
                oMetadata = {},
                params = {},
                semanticObject = "semanticObject",
                action = "action",
                oParsedShellHash = {
                    action: "action",
                    appSpecificRoute: undefined,
                    contextRaw: undefined,
                    params: {},
                    semanticObject: "semanticObject"
                },
                oInnerControl = {
                    getId: function () {
                        return null;
                    }
                },
                sFixedShellHash = "semanticObject-action",
                oSwitchViewStateCallArgs,
                oGetWrappedApplicationStub,
                oLoadingDialogStub,
                oIsColdStartStub,
                oPerformTransitionStub,
                oDelayedMessageErrorStub,
                oStubGetViewData;

            oController.oViewPortContainer = {
                getInitialCenterViewPort: function () {
                    return null;
                },
                setInitialCenterViewPort: function () {
                    return null;
                },
                navTo: function () {
                    return null;
                },
                switchState: function () {
                    return null;
                }
            };

            oController._loadCoreExt = sinon.spy();
            oController._requireCoreExt = sinon.spy();
            oDelayedMessageErrorStub = sinon.stub(oController, "delayedMessageError").returns();
            oGetWrappedApplicationStub = sinon.stub(oController, "getWrappedApplication").returns(oInnerControl);
            oController.switchViewState = sinon.spy();
            oController.oCoreExtLoadingDeferred = $.Deferred();
            oController.oCoreExtLoadingDeferred.resolve();
            oController.oLoadingDialog = {
                showAppInfo: function () {
                },
                closeLoadingScreen: function () {
                }
            };

            oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
            equal(oController.switchViewState.callCount, 1, "switchViewState called");
            equal(oController.switchViewState.args[0][0], "minimal", "switching to state minimal");

            oResolvedHashFragment = {
                applicationType: "Whatever",
                url: "AnyUrl",
                additionalInformation: "",
                navigationMode: "embedded"
            };
            oController.navigate(oParsedShellHash, "#", oMetadata, oResolvedHashFragment);
            equal(oController.switchViewState.callCount, 2, "switchViewState called");
            equal(oController.switchViewState.args[1][0], "home", "switching to state home");

            oController.navigate(oParsedShellHash, "XX", oMetadata, oResolvedHashFragment);
            equal(oController.switchViewState.callCount, 3, "switchViewState called");
            equal(oController.switchViewState.args[2][0], "app", "switching to state app");

            oController.getWrappedApplication.restore();
            oDelayedMessageErrorStub.restore();
            oGetWrappedApplicationStub.restore();
        });
    });

    /**
     * Test the steps of openning an (embedded) application
     */
    test("test navigate - Embedded application launching", function () {
        var oResolvedHashFragment = {
                additionalInformation: "SAPUI5.Component=AppScflTest",
                applicationType: "URL",
                navigationMode: "embedded",
                text: undefined,
                url: "/ushell/test-resources/sap/ushell/demoapps/AppScflTest"
            },
            sAppIsStub,
            oMetadata = {},
            oParsedShellHash = {
                action: "appScflTest",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "UI2Fiori2SampleApps"
            },
            sFixedShellHash = "#UI2Fiori2SampleApps-appScflTest",
            oViewPortContainer = oController.oViewPortContainer,
            oViewPortContainerGetPageStub,
            oViewPortContainerAddPageStub,
            oViewPortContainerToStub,
            oShellView = oController.getView(),
            oStubGetViewData,
            oIsColdStartStub,
            oDelayedMessageErrorStub;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);
        oDelayedMessageErrorStub = sinon.stub(oController, "delayedMessageError").returns();
        oController.history = {
            backwards: false
        };
        oController.oCoreExtLoadingDeferred = $.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();
        oController.oViewPortContainer = {
            getViewPortControl: sinon.spy(),
            addCenterViewPort: sinon.spy(),
            navTo: sinon.spy(),
            switchState: sinon.spy()
        };

        oController.oLoadingDialog = {
            showAppInfo: function () {
            },
            closeLoadingScreen: function () {
            },
            readNavigationEnd: sinon.spy()
        };

        oController.oExtensionShellStates = {
            "home": {}
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(oController.oViewPortContainer.getViewPortControl.callCount, 2, "oViewPortContainer.getViewPortControl was called twice");
        equal(oController.oViewPortContainer.getViewPortControl.args[0][1], "application-UI2Fiori2SampleApps-appScflTest", "oViewPortContainer.getPage was called with pageId application-UI2Fiori2SampleApps-appScflTest");
        equal(oController.oViewPortContainer.getViewPortControl.args[1][1], "applicationShellPage-UI2Fiori2SampleApps-appScflTest", "oViewPortContainer.getPage was called with pageId applicationShellPage-UI2Fiori2SampleApps-appScflTest");
        equal(oController.oViewPortContainer.navTo.callCount, 1, "oViewPortContainer.to was called once");

        oController._isColdStart.restore();
        oDelayedMessageErrorStub.restore();
    });

    test("test navigate - full width", function () {
        var oResolvedHashFragment = {
                applicationType: "Whatever",
                url: "AnyUrl",
                navigationMode: "embedded",
                additionalInformation: "",
                fullWidth: true
            },
            oMetadata = {},
            oInnerControl = {
                getId: function () {
                    return null;
                }
            },
            oGetWrappedApplicationStub,
            semanticObject = "semanticObject",
            action = "action",
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: semanticObject
            },
            sFixedShellHash = "semanticObject-action";

        oController.oViewPortContainer = {
            addCenterViewPort: sinon.spy(),
            getViewPortControl: sinon.spy(),
            navTo: sinon.spy(),
            switchState: sinon.spy()
        };

        oGetWrappedApplicationStub = sinon.stub(oController, "getWrappedApplication").returns(oInnerControl);

        oController.oExtensionShellStates = {
            "home": {}
        };

        oController.oLoadingDialog = {
            showAppInfo: function () {
            },
            closeLoadingScreen: function () {
            }
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(oController.getWrappedApplication.args[0][4], true, "open application in full width mode");

        oResolvedHashFragment = {
            applicationType: "Whatever",
            url: "AnyUrl",
            additionalInformation: "",
            navigationMode: "embedded",
            fullWidth: false
        };
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        equal(oController.getWrappedApplication.args[1][4], false, "open application not in full width mode");
        oGetWrappedApplicationStub.restore();
    });

    function _testUserImage(sUserImageURI, bExist) {
        var oDelayedMessageErrorStub,
            oCloseLoadingScreenStub,
            attachThemeChangedStub,
            origAjax,
            jqAjaxStub,
            sapUshellConfig,
            oRenderer,
            oShell,
            oActionsBtn,
            oGetImageStub = sinon.stub(sap.ushell.Container.getUser(), "getImage");

        oGetImageStub.returns(sUserImageURI);
        oCloseLoadingScreenStub = sinon.stub(oController, "closeLoadingScreen").returns(undefined);
        oController.oLoadingDialog = {
            showAppInfo: function () {
            },
            closeLoadingScreen: function () {
            }
        };

        oDelayedMessageErrorStub = sinon.stub(oController, "delayedMessageError").returns(undefined);
        attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
        origAjax = jQuery.ajax;
        jqAjaxStub = sinon.stub(jQuery, "ajax", function (oRequestSettings) {
            if (sUserImageURI === oRequestSettings.url) {
                bExist ? oRequestSettings.success() : oRequestSettings.error();
            } else {
                return origAjax.apply(this, arguments);
            }
        });

        // Inject flexible configuration that maps empty hash to #shell-home,
        // since sap.ushell.Container.createRenderer("fiori2") will invoke navigation with "#", that needs to be supported
        sapUshellConfig = window["sap-ushell-config"];
        sapUshellConfig.renderers = {
            fiori2: {
                componentData: {
                    config: {
                        rootIntent: "Shell-home"
                    }
                }
            }
        };
        window["sap-ushell-config"] = sapUshellConfig;
        oRenderer = sap.ushell.Container.createRenderer("fiori2");
        oShell = sap.ui.getCore().byId("shell");
        sap.ui.getCore().getEventBus().publish("sap.ushell.renderers.fiori2.Renderer", "appOpened");

        oGetImageStub.restore();
        jqAjaxStub.restore();
        attachThemeChangedStub.restore();
        oActionsBtn = sap.ui.getCore().byId("actionsBtn");
        if (bExist) {
            ok(oActionsBtn.getImage() === sUserImageURI, 'User image not as expected: "' + oActionsBtn.getImage() + '" instead of "' + sUserImageURI + '"');
        } else {
            ok(oActionsBtn.getImage() !== sUserImageURI, 'User image not as expected, URI"' + sUserImageURI + '"');
        }
        oCloseLoadingScreenStub.restore();
        oDelayedMessageErrorStub.restore();
        oRenderer.destroy();
    }

    test("test user image - existing image", function () {
        _testUserImage("/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/themes/base/img/flower_anim.gif", true);
    });

    test("test user image - non existing image", function () {
        _testUserImage("/non/existing/image", false);
    });

    test("test user image - empty image", function () {
        _testUserImage("", false);
    });

    test("test user image - undefined image", function () {
        _testUserImage(undefined, false);
    });
    test("test navigate - check sAppId", function () {
        var oResolvedHashFragmentParam,
            oNavMode,
            oResolvedHashFragment = {
                additionalInformation: "aaa",
                applicationType: "URL",
                fullWidth: undefined,
                navigationMode: "embedded",
                text: "bla bla"

            },
            oParsedShellHash = {
                action: "bbb",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "aaa"
            },
            oMetadata = {},
            sFixedShellHash = "aaa-bbb";

        oController.oLoadingDialog = {
            showAppInfo: function () {
            },
            closeLoadingScreen: function () {
            },
            readNavigationEnd: sinon.spy()
        };

        oController.oViewPortContainer = {
            getViewPortControl: function (inner) {
            },
            addCenterViewPort: function (inner) {
                console.log("addCenterViewPort - inner:" + inner);
                ok(inner.getId() === 'applicationShellPage-aaa-bbb', 'validate sAppId');
            },
            navTo: function () {
            },
            switchState: function () {
            }
        };

        oController.oExtensionShellStates = {
            "home": {}
        };


        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

    });

    test("test getLogonProvider api", function () {
        var attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged"),
            sapUshellConfig = window["sap-ushell-config"],
            oRenderer,
            shellView,
            iframe,
            logonProvider;

        sapUshellConfig.renderers = {
            fiori2: {
                componentData: {
                    config: {
                        rootIntent: "Shell-home"
                    }
                }
            }
        };
        window["sap-ushell-config"] = sapUshellConfig;
        oRenderer = sap.ushell.Container.createRenderer("fiori2");
        shellView = sap.ui.getCore().byId("mainShell");
        iframe = shellView.createIFrameDialog();

        ok(iframe.getAttribute('id') === "SAMLDialogFrame", 'Verify SAML logon iframe ID is samlLogonFrame');
        ok(iframe.nodeName === "IFRAME", 'Verify SAML logon frame nodeName is an IFRAME');
        ok(iframe.getAttribute('src') === "", 'Verify SAML logon frame src is empty');

        // Check function functions well (skipping on DOM checks or CSS classes exitance..)
        shellView.showIFrameDialog();
        shellView.destroyIFrameDialog();

        // Test API create, show and destroy must be exposed for UI5 services:
        logonProvider = oController._getLogonFrameProvider();
        ok(typeof (logonProvider.create === 'function'), "Verify that oController._getLogonFrameProvider().create() exists");
        ok(typeof (logonProvider.show === 'function'), "Verify that oController._getLogonFrameProvider().show() exists");
        ok(typeof (logonProvider.destroy === 'function'), "Verify that oController._getLogonFrameProvider().destroy() exists");
        shellView.destroy();
        attachThemeChangedStub.restore();
    });

    test("test handleDataLoss api", function () {
        var getDirtyFlag = sinon.stub(sap.ushell.Container, "getDirtyFlag", function(){return true;});
        var setHash = sinon.spy(hasher, "setHash");

        //Overriding the confirm function since stub is not working on a native code function
        var fOrigConfirm = window.confirm;
        var myConfirm = function () {return true;};
        window.confirm = myConfirm;
        oController.handleDataLoss("new-hash", "old-hash");
        getDirtyFlag.restore();
        //Test 1 - When the confirm function returns true (OK was clicked), the dirty flag shoud be set to false
        equal(sap.ushell.Container.getDirtyFlag(), false, 'Verify that the dirty flag was set to false');

        getDirtyFlag = sinon.stub(sap.ushell.Container, "getDirtyFlag", function(){return true;});
        myConfirm = function () {return false;};
        window.confirm = myConfirm;
        oController.handleDataLoss("new-hash", "old-hash");
        //Test 2 - When the confirm function returns false (cancel was clicked), the old hash should be sent to setHash
        ok(setHash.calledWith("old-hash"), 'Verify that the hash was set to the old hash');
        //Calling the handleDataLoss one more time in order to restore the value of  the enableHashChange global variable to true
        oController.handleDataLoss("new-hash", "old-hash");

        window.confirm = fOrigConfirm; 
        getDirtyFlag.restore();
        setHash.restore();
    });

    test("change to compact display test ", function () {
        var oMetadata = {
                compactContentDensity: true,
                cozyContentDensity: true
            },
            metaDataStub;

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        oController.getModel().setProperty("/contentDensity", "true");

        oController._applyContentDensity(true);
        ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
        ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
        oController._applyContentDensity(false);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");


        oMetadata.compactContentDensity = false;
        oMetadata.cozyContentDensity = false;
        oController._applyContentDensity(true);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
        oController._applyContentDensity(false);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");

        oMetadata.compactContentDensity = false;
        oMetadata.cozyContentDensity = true;
        oController._applyContentDensity(true);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
        oController._applyContentDensity(false);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:true ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:true ==> cozy");

        oMetadata.compactContentDensity = true;
        oMetadata.cozyContentDensity = false;
        oController._applyContentDensity(true);
        ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:true, metadata.cozy:false ==> compact");
        ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:true, metadata.cozy:false ==> compact");
        oController._applyContentDensity(false);
        ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:true, metadata.cozy:false ==> compact");
        ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:true, metadata.cozy:false ==> compact");

        delete oMetadata.compactContentDensity;
        delete oMetadata.cozyContentDensity;
        oController._applyContentDensity(true);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:undefined, metadata.cozy:undefined ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:undefined, metadata.cozy:undefined ==> cozy");
        oController._applyContentDensity(false);
        ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:undefined, metadata.cozy:undefined ==> cozy");
        ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:undefined, metadata.cozy:undefined ==> cozy");

        metaDataStub.restore();
    });

    //TODO: adjust test to persistency
    test("test density calculation", function () {
        //Keep original values
        var sOrigCombi = sap.ui.Device.system.combi;
        var sOrigTouch = sap.ui.Device.support.touch;

        //Change to combi device
        sap.ui.Device.system.combi = true;
        sap.ui.Device.support.touch = false;
        ok(oController._isCompactContentDensity(), "Non touch device should be in compact mode");

        sap.ui.Device.system.combi = false;
        sap.ui.Device.support.touch = true;
        ok(!oController._isCompactContentDensity(), "Non combi/touch device should be in cozy mode");

        var userStub = sinon.stub(sap.ushell.Container.getUser(), "getContentDensity");

        sap.ui.Device.system.combi = true;
        sap.ui.Device.support.touch = true;
        userStub.returns("cozy");
        ok(!oController._isCompactContentDensity(), "combi device should be in according to user preferences");
        userStub.returns("compact");
        ok(oController._isCompactContentDensity(), "combi device should be in according to user preferences");
        userStub.returns(undefined);
        ok(!oController._isCompactContentDensity(), "combi device should be in according to user preferences (default is cozy)");

        //Restore to original values
        sap.ui.Device.system.combi = sOrigCombi;
        sap.ui.Device.support.touch = sOrigTouch;
    });


    module("sap.ushell.renderers.fiori2.Shell", {
        setup: function () {
            window.location.hash = "";
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = {
                    fiori2: {
                        componentData: {
                            config: {
                                rootIntent: "Shell-home"
                            }
                        }
                    }
            };
            sap.ushell.bootstrap("local");
            /*            if (window.hasher && window.hasher.getHash()) {
             window.hasher.setHash('');
             }*/

            jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
            sap.ushell.components.container.ApplicationContainer = function () {
            };

            sap.m.BusyDialog.prototype.open = function () {
            };

            oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
            oController.history = new sap.ushell.renderers.fiori2.History();
            oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ushell.test.restoreSpies(
                sap.ui.getCore().attachThemeChanged,
                sap.ui.component.load,
                sap.ushell.utils.isNativeWebGuiNavigation,
                sap.ushell.utils.appendUserIdToUrl
            );
            window.location.hash = "";
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    [
        {
            description : "with sap-system",
            sHash : "?sap-system=ABC",
            sResult1 : "Abandon",
            sResult2 : "Continue"
        },
        {
            description : "with empty hash",
            sHash : "",
                sResult1 : "Abandon",
                sResult2 : "Continue"
        },
        {
            description : "with hash",
            sHash : "SalesOrder-display",
                sResult1 : "Continue",
                sResult2 : "Continue"
        }
        ].forEach(function(oFixture) {
        asyncTest("test Shell Navigation filter navigation to empty hash to # " + oFixture.description, function () {
            var oGetImageStub = sinon.stub(sap.ushell.Container.getUser(), "getImage");
            var oJamActivityStub = sinon.stub(sap.ushell.Container.getUser(), "isJamActive");
            var oDataStub = sinon.stub(OData, "read");
            oGetImageStub.returns(false);
            oJamActivityStub.returns(true);
            oDataStub.returns(false);
            // there is no point setting this here, as it is *copied* during constructor creation!
            //
            var sapUshellConfig = window["sap-ushell-config"];
            sapUshellConfig.renderers = {
                fiori2: {
                    componentData: {
                        config: {
                            rootIntent: "Shell-home"
                        }
                    }
                }
            };
            window["sap-ushell-config"] = sapUshellConfig;
            var oRenderer = sap.ushell.Container.createRenderer("fiori2");
            //sap.ushell.Container.getService("ShellNavigation").toExternal({ target : { shellHash : "?sap-system=ABC"}});
            // somewhat crude access to the filters installed by the Fiori2 renderer
            var aNavFilters = sap.ushell.Container.getService("ShellNavigation").hashChanger.aNavigationFilters;
            equal(sap.ushell.Container.getService("ShellNavigation").hashChanger.aNavigationFilters.length, 2);
            var sFilterResult = aNavFilters[0].call(undefined, oFixture.sHash, undefined);
            strictEqual(sFilterResult, oFixture.sResult1, "correct filter result 1");
            sFilterResult = aNavFilters[1].call(undefined, oFixture.sHash, undefined);
            strictEqual(sFilterResult, oFixture.sResult2, "correct filter result 2");
            //Clean stubs.
            oGetImageStub.restore();
            oJamActivityStub.restore();
            oDataStub.restore();
            oRenderer.destroy();
            start();
        });
      });

    asyncTest("test verify that event is fired after core ext is loaded", function () {
        var fPublishCoreExtLoadedEventStub = sinon.stub(oController, "_publishCoreExtLoadedEvent");
        var promise = new Promise(function(resolve, reject){
            resolve();
        });
        sinon.stub(jQuery.sap, "_loadJSResourceAsync").returns(promise);

        oController.oCoreExtLoadingDeferred = jQuery.Deferred();
        oController._loadCoreExt();

        setTimeout(function () {
            start();
            ok(fPublishCoreExtLoadedEventStub.calledOnce, 'event is fired after core ext is loaded');
        }, 0);
    });


    test("test ShellUIService default values", function () {
        var oMetadata, metaDataStub;

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        var titleDefaultValue = oController.getTitleDefaultValue();
        var hierarchyDefaultValue = oController.getHierarchyDefaultValue();

        equal(titleDefaultValue, "", "titleDefaultValue was not as expected");
        ok(Array.isArray(hierarchyDefaultValue), "hierarchyDefaultValue was not as expected");
        ok(hierarchyDefaultValue.length === 0, "hierarchyDefaultValue was not as expected");

        metaDataStub.restore();
    });


    test("test ShellUIService default values for app-state", function () {


        var oMetadata = {
                title: "App Title",
                cozyContentDensity: true
            },
            metaDataStub,
            oHeirarchy = [
                {
                    icon: "sap-icon://home",
                    title: "Home",
                    intent: "#Shell-home"
                }
            ];

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        oController.getModel().setProperty("/currentState", {});
        oController.getModel().setProperty("/currentState/stateName", "app");

        var titleDefaultValue = oController.getTitleDefaultValue();
        var hierarchyDefaultValue = oController.getHierarchyDefaultValue();

        equal(titleDefaultValue, "App Title", "titleDefaultValue was not as expected");
        deepEqual(hierarchyDefaultValue, oHeirarchy, "hierarchyDefaultValue was as expected");

        metaDataStub.restore();
        oController.getModel().setProperty("/currentState", undefined);
    });

    test("test ShellUIService event provider", function () {
        sinon.stub(oController, "getOwnerComponent").returns({
            getId: sinon.stub().returns("__renderer0")
        });

        oController.initShellUIService();

        notEqual(oController.isHierarchyChanged, true, "onHierarchyChange was not called on init");
        notEqual(oController.isTitleChanged, true, "onTitleChange was not called on init");
        notEqual(oController.isRelatedAppsChanged, true, "onRelatedAppsChange was not called on init");

        oController.oShellUIService.setHierarchy();
        oController.oShellUIService.setTitle();
        oController.oShellUIService.setRelatedApps();

        equal(oController.isHierarchyChanged, true, "onHierarchyChange was called");
        equal(oController.isTitleChanged, true, "onTitleChange was called");
        equal(oController.isRelatedAppsChanged, true, "onRelatedAppsChange was called");
    });

    test("test ShellUIService changes model on app state", function () {
        sinon.stub(oController, "getOwnerComponent").returns({
            getId: sinon.stub().returns("__renderer0")
        });

        oController.initShellUIService();

        //Init model properties
        oController.getModel().setProperty("/currentState/", {});
        oController.getModel().setProperty("/currentState/application/", {});

        //set current state to app
        oController.getModel().setProperty("/currentState/stateName", "app");


        var sTitle = "App title",
            oHeirarchy = [
            {
                icon: "sap-icon://nav-back",
                title: "App1",
                intent: "#App1"
            }
            ],
            oRelatedApps = [
                {
                    icon: "sap-icon://documents",
                    title: "Related App 1",
                    intent: "#Action-todefaultapp"
                }
            ];

        var oExpectedHeirarchy = [
            {
                icon: "sap-icon://nav-back",
                title: "App1",
                intent: "#App1"
            },
            {
                icon: "sap-icon://home",
                title: "Home",
                intent: "#Shell-home"
            }
        ];


        oController.oShellUIService.setHierarchy(oHeirarchy);
        oController.oShellUIService.setTitle(sTitle);
        oController.oShellUIService.setRelatedApps(oRelatedApps);

        deepEqual(oController.getModel().getProperty("/currentState/application/hierarchy"), oExpectedHeirarchy, "oHierarchy was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/currentState/application/title"), sTitle, "title was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/currentState/application/relatedApps"), oRelatedApps, "oRelatedApps was updated in the model properly");

        ok(!oController.getModel().getProperty("/states/home/application/hierarchy"), "oHierarchy was not updated in the home state model");
        ok(!oController.getModel().getProperty("/states/home/application/title"), "title was not updated in the home state model");
        ok(!oController.getModel().getProperty("/states/home/application/relatedApps"), "oRelatedApps was not updated in the home state model");
    });

    test("test ShellUIService changes model on home state", function () {
        sinon.stub(oController, "getOwnerComponent").returns({
            getId: sinon.stub().returns("__renderer0")
        });
        oController.initShellUIService();

        //Init model properties
        oController.getModel().setProperty("/currentState/", {});
        oController.getModel().setProperty("/currentState/application/", {});

        //set current state to app
        oController.getModel().setProperty("/currentState/stateName", "home");


        var sTitle = "App title",
            oHeirarchy = [
                {
                    icon: "sap-icon://nav-back",
                    title: "App1",
                    intent: "#App1"
                }
            ],
            oRelatedApps = [
                {
                    icon: "sap-icon://documents",
                    title: "Related App 1",
                    intent: "#Action-todefaultapp"
                }
            ];


        oController.oShellUIService.setHierarchy(oHeirarchy);
        oController.oShellUIService.setTitle(sTitle);
        oController.oShellUIService.setRelatedApps(oRelatedApps);

        deepEqual(oController.getModel().getProperty("/currentState/application/hierarchy"), oHeirarchy, "oHierarchy was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/currentState/application/title"), sTitle, "title was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/currentState/application/relatedApps"), oRelatedApps, "oRelatedApps was updated in the model properly");

        deepEqual(oController.getModel().getProperty("/states/home/application/hierarchy"), oHeirarchy, "oHierarchy was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/states/home/application/title"), sTitle, "title was updated in the model properly");
        deepEqual(oController.getModel().getProperty("/states/home/application/relatedApps"), oRelatedApps, "oRelatedApps was updated in the model properly");
    });

    test("test headEndItemsOvelow", function () {
        oController.oExtensionShellStates = {};
        oController.switchViewState("home");
        var aExpectedHeadEndItems = ["sf"];
        var aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include only search button");

        oController.addHeaderEndItem(["NotificationsCountButton"], false, ["home", "app"]);
        aExpectedHeadEndItems.push("NotificationsCountButton");
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include search and notifications buttons");

        oController.handleEndItemsOverflow({name: "Desktop"});
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include search and notifications buttons in desktop");

        oController.handleEndItemsOverflow({name: "Phone"});
        aExpectedHeadEndItems.splice(1, 0, "endItemsOverflowBtn");
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include search and notifications and overflow buttons in phone and tablet and  notification should always be the last");

        equal(oController.isHeadEndItemOverflow(), false, "isHeadEndItemOverflow should be false in case there are less then 3 buttons excluting endItemsOverflowBtn");
        equal(oController.isHeadEndItemInOverflow("endItemsOverflowBtn".toUpperCase()), false, "endItemsOverflowBtn should not appear in overflow");
        equal(oController.isHeadEndItemNotInOverflow("endItemsOverflowBtn".toUpperCase()), false, "in case isHeadEndItemOverflow is false endItemsOverflowBtn should not appear in the header");

        oController.addHeaderEndItem(["co-pilot"], false, ["home", "app"]);
        aExpectedHeadEndItems.splice(2, 0, "co-pilot");
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include 4 buttons");
        equal(oController.isHeadEndItemOverflow(), true, "isHeadEndItemOverflow should be true in mobile and in case there are more then 3 buttons");
        equal(oController.isHeadEndItemInOverflow("endItemsOverflowBtn".toUpperCase()), false, "endItemsOverflowBtn should not appear in overflow");
        equal(oController.isHeadEndItemNotInOverflow("endItemsOverflowBtn".toUpperCase()), true, "in case isHeadEndItemOverflow is true endItemsOverflowBtn should appear in the header");
        equal(oController.isHeadEndItemNotInOverflow("NotificationsCountButton".toUpperCase()), true, "NotificationsCountButton should always appear in the header");
        equal(oController.isHeadEndItemInOverflow("NotificationsCountButton".toUpperCase()), false, "NotificationsCountButton should not be in overflow");
        equal(oController.isHeadEndItemNotInOverflow("sf".toUpperCase()), false, "search should not be in the header");
        equal(oController.isHeadEndItemInOverflow("sf".toUpperCase()), true, "search should be in the overflow");
        equal(oController.isHeadEndItemNotInOverflow("co-pilot".toUpperCase()), false, "co-pilot should not be in the header");
        equal(oController.isHeadEndItemInOverflow("co-pilot".toUpperCase()), true, "co-pilot should be in the overflow");

        oController.handleEndItemsOverflow({name: "Desktop"});
        aExpectedHeadEndItems.splice(1, 1); //remove endItemsOverflowBtn
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        deepEqual(aHeadEndItems, aExpectedHeadEndItems, "head end items should include 3 buttons");
        equal(oController.isHeadEndItemOverflow(), false, "isHeadEndItemOverflow should be false in desktop");
        equal(oController.isHeadEndItemNotInOverflow("NotificationsCountButton".toUpperCase()), true, "NotificationsCountButton should always appear in the header");
        equal(oController.isHeadEndItemInOverflow("NotificationsCountButton".toUpperCase()), false, "NotificationsCountButton should not be in overflow");
        equal(oController.isHeadEndItemNotInOverflow("sf".toUpperCase()), true, "search should be in the header in desktop");
        equal(oController.isHeadEndItemInOverflow("sf".toUpperCase()), false, "search should not be in the overflow in desktop");
        equal(oController.isHeadEndItemNotInOverflow("co-pilot".toUpperCase()), true, "co-pilot should be in the header in desktop");
        equal(oController.isHeadEndItemInOverflow("co-pilot".toUpperCase()), false, "co-pilot should not be in the overflow in desktop");

        oController.handleEndItemsOverflow({name: "Phone"});
        aHeadEndItems = oController.getModel().getProperty("/currentState/headEndItems");
        var btn = new sap.m.Button();
        var getViewStub = sinon.stub(oController, "getView");
        getViewStub.returns({updateShellAggregation: function (sName) {
            /*jslint nomen: true */
            var oBindingInfo = this.mBindingInfos[sName],
                oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                oClone;

            jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                this[oAggregationInfo._sRemoveMutator](v);
            }, this));
            jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
                this[oAggregationInfo._sMutator](oClone);
            }, this));
        },
            aDanglingControls: []});

        var oSearchBtn = new sap.ushell.ui.shell.ShellHeadItem({id: "sf", text: "Search"});
        var oCoPilotBtn = new sap.ushell.ui.shell.ShellHeadItem({id: "co-pilot", text: "Co-Pilot"});
        oController.pressEndItemsOverflow({getSource: function(){return btn; }});
        var oPopover = sap.ui.getCore().byId('headEndItemsOverflow');
        ok(oPopover !== undefined, "overflow popover was created");
        var closeStub = sinon.stub(oPopover, "close");
        oSearchBtn.firePress();
        equal(closeStub.callCount, 1, "Pressing on overflow item should close the popover");
        equal(oSearchBtn._shouldRenderText(), true, "Text should be rendered in case item is not rendered as part of the header");
        equal(oCoPilotBtn._shouldRenderText(), true, "Text should be rendered in case item is not rendered as part of the header");

        oController.handleEndItemsOverflow({name: "Desktop"});
        equal(oSearchBtn._shouldRenderText(), false, "Text should not be rendered in case item does not have a parent");
        equal(oCoPilotBtn._shouldRenderText(), false, "Text should not be rendered in case item does not have a parent");

        var oHeader = new sap.ushell.ui.shell.ShellHeader();
        oSearchBtn.setParent(oHeader);
        oCoPilotBtn.setParent(oHeader);
        equal(oSearchBtn._shouldRenderText(), false, "Text should not be rendered in case item parent is ShellHeader");
        equal(oCoPilotBtn._shouldRenderText(), false, "Text should not be rendered in case item parent is ShellHeader");

        oHeader.destroy();
        oSearchBtn.destroy();
        oCoPilotBtn.destroy();
        closeStub.restore();
        oPopover.destroy();
        getViewStub.restore();
    });


    module("sap.ushell.renderers.fiori2.Shell - Fiori 2.0 Configuration ON", {
        beforeEach: function () {
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = {
                fiori2: {
                    componentData: {
                        config: {
                            enableMergeAppAndShellHeaders: true,
                            enableMeArea: true,
                            enableNotificationsUI: true
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");

            jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
            sap.ushell.components.container.ApplicationContainer = function () {
            };

            sap.m.BusyDialog.prototype.open = function () {
            };
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    test("test Shell back button on RTL", function () {

        var getConfigurationStub = sinon.stub(sap.ui.getCore().getConfiguration(), "getRTL").returns(true);
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var oHomeBtn = sap.ui.getCore().byId("homeBtn");

        ok(oHomeBtn.getIcon().indexOf("feeder-arrow") > 0, "Home Button should be with Right Orientation when RTL is ON");

        getConfigurationStub.restore();
        oRenderer.destroy();
    });


    test("test ShellLayout properties when Fiori 2.0 ON", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var oShell = sap.ui.getCore().byId("shell");
        var oShellHeader = sap.ui.getCore().byId("shell-header");
        var oModel = oShell.getModel();

        //Test shell
        ok(!oShell.getBackgroundColorForce(), "Shell should be with no background force color when fiori 2.0 is ON");
        ok(!oShell.getShowBrandLine(), "Shell should be with no branding line when fiori 2.0 is ON");
        ok(!oShell.getShowAnimation(), "Shell should be with no animation when fiori 2.0 is ON");


        //Test shell header
        ok(!oShellHeader.getShowSeparators(), "Shell header should be with no separatores line when fiori 2.0 is ON");

        //Test notification count
        var oNotificationToggle = sap.ui.getCore().byId("NotificationsCountButton");
        oNotificationToggle.setModel(oModel);

        oModel.setProperty('/notificationsCount', 10);
        equal(oNotificationToggle.getDisplayFloatingNumber(), 10, "When notifications count is smaller than max value it will return the value");

        oModel.setProperty('/notificationsCount', 1000);
        equal(oNotificationToggle.getDisplayFloatingNumber(), "999+", "When notifications count is bigger than max value it will return 999+");

        oModel.setProperty('/notificationsCount', 99);
        equal(oNotificationToggle.getDisplayFloatingNumber(), "99", "When notifications count is smaller than max value it will return the value");

        oRenderer.destroy();
    });

    test("test _getAppContainer called with shell UI service", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var oController = sap.ui.getCore().byId("mainShell").getController();
        var oResolvedNavigationTarget = {};

        sinon.stub(oController.oShellUIService, "getInterface").returns({
            method: "implementation"
        });

        oController._getAppContainer("application-Action-toappnavsample-component", oResolvedNavigationTarget);

        deepEqual(oResolvedNavigationTarget, { shellUIService: { method: "implementation" } }, "shellUIService was added to the resolved navigation target");

        oRenderer.destroy();
    });

    test("test getHierarchyDefaultValue setups home entry correctly", function () {
        var oShellHeaderContol = sap.ushell.ui.shell.ShellHeader;

        var oHeaderAddHeadItemStub = sinon.stub(oShellHeaderContol.prototype, "addHeadItem");

        var oView = sap.ui.view("shell-test", {
            viewName: "sap.ushell.renderers.fiori2.Shell",
            type: 'JS',
            viewData: {}
        });

        var oController = oView.getController();

        // Test case - Not in application.
        var aHierarchy = oController.getHierarchyDefaultValue();
        ok(aHierarchy && aHierarchy.length === 0, "Hierarchy is empty when not in application");

        // Test case - in application, root intent not configured.
        oView.getModel().setProperty("/currentState", { stateName: "app" });

        var aHierarchy = oController.getHierarchyDefaultValue();
        ok(aHierarchy && aHierarchy.length > 0, "Hierarchy exists when in application");
        equal(aHierarchy[0].intent, "#", "Home entry has intent '#' when root intent is not configured");

        oView.destroy();

        // Test case - In applicaiton, root intent is configured.
        var oView = sap.ui.view("banana", {
            viewName: "sap.ushell.renderers.fiori2.Shell",
            type: 'JS',
            viewData: {
                config: {
                    rootIntent: "Shell-home"
                }
            }
        });

        oView.getModel().setProperty("/currentState", { stateName: "app" });

        var aHierarchy = oController.getHierarchyDefaultValue();
        ok(aHierarchy && aHierarchy.length > 0, "Hierarchy exists when in application");
        equal(aHierarchy[0].intent, "#Shell-home", "Home entry has intent '#Shell-home' when root intent is configured");

        oHeaderAddHeadItemStub.restore();
        oView.destroy();
    });


    test("test that app setting button is cleared when navigating from app to app", function () {
        oController.oExtensionShellStates = {};
        oController.switchViewState("app");

        oController.addActionButton(["appSetting"], true);
        var aActions = oController.getModel().getProperty("/currentState/actions");
        ok(aActions.indexOf("appSetting") > 0, "app settings button found");
        oController.switchViewState("app");
        var aActions = oController.getModel().getProperty("/currentState/actions");
        ok(aActions.indexOf("appSetting") === -1, "app settings button should not be found");


    });



}());
