// @copyright@
/**
 * @fileOverview QUnit tests for components/container/ApplicationContainer.js
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, dispatchEvent, equal, localStorage, module,
    ok, throws, start, strictEqual, stop, test,
    document, jQuery, sap, sinon, some, Storage, window */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require('sap.ushell.components.container.ApplicationContainer');
    jQuery.sap.require("sap.ushell.User");

    var sPREFIX = "sap.ushell.components.container",
        sCONTAINER = sPREFIX + ".ApplicationContainer",
        sTESTURL = "http://www.sap.com/",
        oMessageTemplate = {
            data: {
                type: "request",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                body: {}
            },
            origin: "http://our.origin:12345",
            source: {
                postMessage: "replace_me_with_a_spy"
            }
        },
        oFakeError = {
            message: "Post Message Fake Error"
        },
        oAppContainer;

    /**
     * Creates an object which can be used for the ApplicationContainer's application property.
     * @param {string} [oProperties.text]
     *   the return value for getText()
     * @param {string} [oProperties.type]
     *   the return value for getType()
     * @param {string} [oProperties.url]
     *   the return value for getUrl()
     * @param {boolean} [oProperties.resolvable]
     *   the return value for isResolvable(). If <code>true</code>, the object's function
     *   <code>resolve()</code> must be stubbed.
     * @returns the application object
     */
    function getApplication(oProperties) {
        oProperties = oProperties || {};
        return {
            getText: function () { return oProperties.text; },
            getType: function () { return oProperties.type; },
            getUrl: function () { return oProperties.url; },
            isFolder: function () { return false; },
            isResolvable: function () { return oProperties.resolvable; },
            resolve: function () { throw new Error("resolve must be stubbed"); },
            getMenu: function () {
                return {
                    getDefaultErrorHandler: function () {
                        return oProperties.errorHandler;
                    }
                };
            }
        };
    }

    /**
     * Renders the container and expects that the internal render() is called with the given
     * arguments.
     * @param {sap.ushell.components.container.ApplicationContainer] oContainer
     *   the container
     * @param {sap.ushell.components.container.ApplicationType} oApplicationType
     *   the expected applicationType
     * @param {string} sUrl
     *   the expected URL
     * @param {string} sAdditionalInformation
     *   the expected additional information
     */
    function renderAndExpect(oContainer, oApplicationType, sUrl, sAdditionalInformation) {
        var oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_render");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        ok(oContainer._render.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oApplicationType,
            sUrl,
            sAdditionalInformation
        ));
    }

    /**
     * Call the render() function and check that an IFrame is rendered for the given URL.
     * @param {sap.ushell.components.container.ApplicationContainer] oContainer
     *   the container
     * @param {sap.ushell.components.container.ApplicationType} oApplicationType
     *   the application type
     * @param {string} sUrl
     *   the application URL
     */
    function renderInternallyAndExpectIFrame(oContainer, sApplicationType, sUrl) {
        var oRenderManager = new sap.ui.core.RenderManager(),
            // the div is not attached to the "real" DOM and therefore is standalone and
            // not rendered
            oTargetNode = document.createElement("DIV"),
            oIframe;

        // in one test the function is called multiple times
        if (oContainer.getFrameSource.reset) {
            oContainer.getFrameSource.reset();
        } else {
            sinon.stub(oContainer, "getFrameSource");
        }
        oContainer.getFrameSource.returns(sUrl);
        oContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_adjustNwbcUrl");
        oContainer._render(oRenderManager.getRendererInterface(),
            oContainer, sApplicationType, sUrl, "additionalInfo");
        oRenderManager.flush(oTargetNode);

        strictEqual(oTargetNode.childNodes.length, 1);
        oIframe = oTargetNode.childNodes[0];

        if (sApplicationType === "NWBC" || sApplicationType === "TR") {
            ok(oContainer._adjustNwbcUrl.calledWith(sUrl), "adjustNwbcUrl called with " + sUrl);
        } else {
            strictEqual(oIframe.src, sUrl, "IFRAME source was set to url " + sUrl);
        }

        oContainer._adjustNwbcUrl.restore();

        strictEqual(oIframe.nodeName, "IFRAME", "got expected <iframe> dom node");
        strictEqual(oIframe.className, "myClass1 sapUShellApplicationContainer", "iframe has expected class name");
        strictEqual(oIframe.getAttribute("data-sap-ui"), oContainer.getId(), "iframe data-sap-ui attribute is set to the container id");
        strictEqual(oIframe.id, oContainer.getId(), "iframe id is set correctly");
        strictEqual(oIframe.style.height, oContainer.getHeight(), "iframe height property was set correctly");
        strictEqual(oIframe.style.width, oContainer.getWidth(), "iframe width property was set correctly");
        ok(oRenderManager.writeAccessibilityState.calledOnce, "renderer manager 'writeAccessibilityState method was called once'");

        ok(oContainer.getFrameSource.calledOnce, "container getFrameSource method was called once");
        ok(oContainer.getFrameSource.calledWith(sApplicationType, sUrl, "additionalInfo"),
            "container getFrameSource method was called with the expected arguments");
        return oRenderManager;
    }

    /**
     * Calls <code>sap.ushell.components.container.createUi5View</code> for the given container
     * and tests that it fails with the given technical error message.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   the container
     * @param {string} sMessage
     *   technical error message
     */
    function testFailingCreateUi5View(oContainer, sMessage) {
        var fnCreateView = sinon.spy(sap.ui, "view"),
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sMessage, oContainer.getAdditionalInformation(), sCONTAINER);

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oContainer._createUi5View(oContainer, oContainer.getUrl(),
            oContainer.getAdditionalInformation());

        ok(!fnCreateView.called);
        ok(oContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    }

    // a test component
    jQuery.sap.declare("some.random.path.Component");
    sap.ui.core.UIComponent.extend("some.random.path.Component", {
        createContent: function () {return new sap.ui.core.Icon(); },
        metadata: {
            config : {
                foo : "bar"
            }
        }
    });
    // a test component w/o configuration
    jQuery.sap.declare("some.random.path.no.config.Component");
    sap.ui.core.UIComponent.extend("some.random.path.no.config.Component", {
        createContent: function () {return new sap.ui.core.Icon(); },
        metadata: {
        }
    });

    /**
     * Helper function to construct a post message event
     *
     * @param {object} [oProperties]
     *   parameter object
     * @param {string} [oProperties.service]
     *   the name of the service that should be set in the message
     * @param {string} [oProperties.body]
     *   the object that should be set in the message body
     * @returns {object} oMessage
     *   message event object; the data property is always serialized
     */
    function getServiceRequestMessage(oProperties) {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        if (oProperties && oProperties.service) {
            oMessage.data.service = oProperties.service;
        }
        if (oProperties && oProperties.body) {
            oMessage.data.body = oProperties.body;
        }

        // always serialize message event data
        oMessage.data = JSON.stringify(oMessage.data);
        oMessage.source.postMessage = sinon.spy();

        return oMessage;
    }
    //---------------------------------------------------------------------------------------------

    // Documentation can be found at http://docs.jquery.com/QUnit
    module("components/container/ApplicationContainer.js", {
        setup: function () {
            oAppContainer = new sap.ushell.components.container.ApplicationContainer();
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            sinon.stub(Storage.prototype, "removeItem");
            sinon.stub(Storage.prototype, "setItem");
            sinon.stub(sap.ui,"getVersionInfo").returns({ version : undefined});
            // prevent deferred events unless explicitely enabled
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_publishExternalEvent");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ushell.test.restoreSpies(
                sap.ui.getVersionInfo,
                jQuery.sap.assert,
                jQuery.sap.getObject,
                jQuery.sap.getUriParameters,
                jQuery.sap.log.warning,
                jQuery.sap.registerModulePath,
                jQuery.sap.require,
                jQuery.sap.resources,
                jQuery.sap.uid,
                sap.ui.component,
                sap.ui.getCore,
                sap.ui.view,
                oAppContainer._adjustNwbcUrl,
                oAppContainer._createErrorControl,
                oAppContainer._createUi5Component,
                oAppContainer._publishExternalEvent,
                oAppContainer._createUi5View,
                oAppContainer._destroyChild,
                oAppContainer._getTranslatedText,
                oAppContainer._handleServiceMessageEvent,
                oAppContainer._isTrustedPostMessageSource,
                oAppContainer._logout,
                oAppContainer._render,
                oAppContainer._renderControlInDiv,
                (sap.ushell.Container && sap.ushell.Container.getUser),
                sap.ushell.utils.localStorageSetItem,
                Storage.prototype.getItem,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                window.addEventListener,
                window.removeEventListener
            );
            delete sap.ushell.Container;
        }
    });

    test("test declared properties", function () {
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        var actualProps = Object.keys(oAppContainer.getMetadata().getProperties());
        ["additionalInformation", "application", "applicationConfiguration",
         "applicationType", "height", "navigationMode", "text", "url", "visible", "width"].forEach(function (sStr) {
            ok(actualProps.indexOf(sStr) >= 0," property " + sStr + " present");
        });
    });

    [
         {
             description: "accessibility was set to 'X'",
             expectedUrlAddition: "sap-ie=edge&sap-accessibility=X",
             nwbcTheme: undefined,
             accessibility: "X",
             applicationType: "NWBC"
         },
         {
             description: "accessibility was set to undefined",
             expectedUrlAddition: "sap-ie=edge",
             nwbcTheme: undefined,
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "accessibility was set to ''",
             expectedUrlAddition: "sap-ie=edge",
             nwbcTheme: undefined,
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "theme from User object is undefined",
             expectedUrlAddition: "sap-ie=edge",
             nwbcTheme: undefined,
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "theme from User object is a sap_ theme",
             expectedUrlAddition: "sap-ie=edge&sap-theme=sap_hcb",
             nwbcTheme: "sap_hcb",
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "theme from User object is a custom theme",
             expectedUrlAddition: "sap-ie=edge&sap-theme=custom_theme@https://frontendserver.company.com/the/theme/repository/path",
             nwbcTheme: "custom_theme@https://frontendserver.company.com/the/theme/repository/path",
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "the version is set (1.32.5.270343434) and applicationType = NWBC",
             expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.32.5-NWBC",
             version : "1.32.5.270343434",
             nwbcTheme: undefined,
             accessibility: undefined,
             applicationType: "NWBC"
         },
         {
             description: "the version is set (1.32.5.270343434) and no applicationType is set",
             expectedUrlAddition: "sap-ie=edge&sap-shell=FLP1.32.5-NWBC",
             version : "1.32.5.270343434",
             nwbcTheme: undefined,
             accessibility: undefined
             // no application type
         },
         {
             description: "the version is set (1.32.5.270343434) and applicationType = TR",
             expectedUrlAddition: "sap-ie=edge",
             version : "1.32.5.270343434",
             nwbcTheme: undefined,
             accessibility: undefined,
             applicationType: "TR"
         }
    ].forEach(function (oFixture) {
        asyncTest("adjustNwbcUrl returns the correct URL when " + oFixture.description, 1, function () {
            // Arrange
            sap.ushell.bootstrap("local")
                .done(function () {
                    var sUrl,
                        sAdjustedUrl;
                    if ( oFixture.version ) {
                        sap.ushell.test.restoreSpies(sap.ui.getVersionInfo);
                        sinon.stub(sap.ui,"getVersionInfo").returns({version : oFixture.version});
                    }
                    sinon.stub(sap.ushell.Container, "getUser").returns({
                        getTheme : function (sThemeValueType) {
                            if (sThemeValueType === sap.ushell.User.prototype.constants.themeFormat.NWBC) {
                                return oFixture.nwbcTheme;
                            }
                            return "noTheme";
                        },
                        getAccessibilityMode : function () {
                            return oFixture.accessibility;
                        }
                    });
                    sUrl = "http://anyhost:1234/sap/bc/ui2/nwbc/~canvas";
                    // Act
                    sAdjustedUrl = decodeURIComponent(oAppContainer._adjustNwbcUrl(sUrl, oFixture.applicationType));
                            //decode the URL for better readability in case of errors
                    // Assert
                    start();
                    strictEqual(sAdjustedUrl, 'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas?' + oFixture.expectedUrlAddition);
                });
        });
    });

    [
     {
         sExpectedUrl: "http://www.google.de",
         sExpectedConfigId: 1,
         sExpectedValidation: true,
         sTitle: "allowed external url"
     },
     {
         sExpectedUrl: "#Buch-lesen",
         sExpectedConfigId: 2,
         sExpectedValidation: false,
         sTitle: "not allowed url"
     },
     {
         sExpectedUrl: "#Action-toappnavsample",
         sExpectedConfigId: 3,
         sExpectedValidation: true,
         sTitle: "allowed semantic object and action"
     },
     {
         sExpectedUrl: "blaBlabla",
         sExpectedConfigId: 4,
         sExpectedValidation: false,
         sTitle: "not allowed url format"
     },
     {
         sExpectedUrl: "http://www.spiegel",
         sExpectedConfigId: 5,
         sExpectedValidation: false,
         sTitle: "not allowed url format. Ending is missing"
     },
     {
         sExpectedUrl: "http:/www.spiegel.de",
         sExpectedConfigId: 6,
         sExpectedValidation: false,
         sTitle: "not allowed url format. One slash after http:/ is missing"
     },
     {
         sExpectedUrl: "",
         sExpectedConfigId: 7,
         sExpectedValidation: false,
         sTitle: "empty string as url"
     },
     {
         sExpectedUrl: undefined,
         sExpectedConfigId: 8,
         sExpectedValidation: false,
         sTitle: "url is undefined"
     }
    ].forEach(function (oFixture) {
        asyncTest("adaptIsUrlSupportedResultForMessagePopover: " + oFixture.sTitle, function () {
            var oDeferred,
                oES6PromisePassed = {}, //object containing the original resolve and reject functions gets passed to the unified shell
                oES6Promise = new Promise(function (resolve, reject) {  //promise created by SAP UI5
                    oES6PromisePassed.resolve = resolve;
                    oES6PromisePassed.reject = reject;
                }),
                oCrossAppNavService = {
                    "isUrlSupported" : function (sUrl) {
                        strictEqual(sUrl, oFixture.sExpectedUrl, "correct url was passed to the service");
                        oDeferred = new jQuery.Deferred();
                        return oDeferred.promise();
                    }
                };

            window.sap = window.sap || {};
            sap.ushell = sap.ushell || {};
            sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {
                return oCrossAppNavService;
            }};

            oAppContainer._adaptIsUrlSupportedResultForMessagePopover({ "promise": oES6PromisePassed, "url": oFixture.sExpectedUrl, "id": oFixture.sExpectedConfigId });

            oES6Promise.then(function (oResult) {
                start();
                ok(true, "Promise was resolved and not rejected");
                strictEqual(oResult.allowed, oFixture.sExpectedValidation, "SAP UI5 promise was resolved correctly");
                strictEqual(oResult.id, oFixture.sExpectedConfigId, "Config ID was passed correctly and got resolved as expected");
            }).catch(function () {
                start();
                ok(false);
            });

            if (oFixture.sExpectedValidation) {
                oDeferred.resolve();
            } else {
                oDeferred.reject();
            }
        });
    });

    test("getTranslatedText", function () {
        var oResourceBundle = {
            getText: sinon.spy()
        };

        sinon.stub(jQuery.sap, "resources").returns(oResourceBundle);
        oAppContainer._getTranslatedText("an_error_has_occured");
        ok(jQuery.sap.resources.calledWith({
            url: jQuery.sap.getModulePath(sPREFIX) + "/resources/resources.properties",
            language: sap.ui.getCore().getConfiguration().getLanguage()
        }));
        ok(oResourceBundle.getText.calledWith("an_error_has_occured"));
        oAppContainer._getTranslatedText("loading", ["foo bar"]);
        ok(jQuery.sap.resources.calledOnce);
        ok(oResourceBundle.getText.calledWith("loading", ["foo bar"]));
    });

    test("renderControlInDiv w/o child", function () {
        var oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");

        oAppContainer._renderControlInDiv(
            oRenderManager.getRendererInterface(),
            oAppContainer
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        strictEqual(oDiv.className, "myClass1 sapUShellApplicationContainer");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        strictEqual(oDiv.id, oAppContainer.getId());
        strictEqual(oDiv.style.height, oAppContainer.getHeight());
        strictEqual(oDiv.style.width, oAppContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.calledOnce);
    });

    test("renderControlInDiv w/ child", function () {
        var oChild = new sap.ui.core.Icon(),
            oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");
        oAppContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");
        sinon.spy(oRenderManager, "renderControl");

        oAppContainer._renderControlInDiv(
            oRenderManager.getRendererInterface(),
            oAppContainer,
            oChild
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        strictEqual(oDiv.className, "myClass1 sapUShellApplicationContainer");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oAppContainer.getId());
        strictEqual(oDiv.id, oAppContainer.getId());
        strictEqual(oDiv.style.height, oAppContainer.getHeight());
        strictEqual(oDiv.style.width, oAppContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.withArgs(oAppContainer).calledOnce);
        ok(oRenderManager.renderControl.calledOnce);
        ok(oRenderManager.renderControl.calledWith(oChild));
    });

    test("createErrorControl", function () {
        var oResult;

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_getTranslatedText").returns("Error occurred");

        oResult = oAppContainer._createErrorControl();

        ok(oResult instanceof sap.ui.core.Control, "public contract");
        ok(oResult instanceof sap.ui.core.Icon, "implementation details");
        strictEqual(oResult.getSize(), "2rem");
        strictEqual(oResult.getSrc(), "sap-icon://error");
        strictEqual(oResult.getTooltip(), "Error occurred");
        ok(oAppContainer._getTranslatedText.calledWith("an_error_has_occured"));
    });

    test("ApplicationContainer control", function () {
        strictEqual(typeof sap.ushell.components.container.ApplicationContainer, "function");

        ok(oAppContainer instanceof sap.ui.core.Control);
        strictEqual(oAppContainer.getAdditionalInformation(), "",
            "default for 'additionalInformation' property");
        strictEqual(oAppContainer.getApplicationType(), "URL",
            "default for 'applicationType' property");
        strictEqual(oAppContainer.getHeight(), "100%", "default for 'height' property");
        strictEqual(oAppContainer.getUrl(), "", "default for 'url' property");
        strictEqual(oAppContainer.getVisible(), true, "default for 'visible' property");
        strictEqual(oAppContainer.getWidth(), "100%", "default for 'width' property");
        strictEqual(oAppContainer.getApplication(), undefined, "default for 'application' property");
        strictEqual(oAppContainer.getChild, undefined, "'child' hidden");

        ["WDA", "TR", "NWBC"].forEach(function (sLegacyApplicationType) {
            oAppContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType[sLegacyApplicationType]
            });
            strictEqual(oAppContainer.getApplicationType(),
                sap.ushell.components.container.ApplicationType[sLegacyApplicationType]);
        });


        throws(function () {
            oAppContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: "foo"
            });
        });

        oAppContainer = new sap.ushell.components.container.ApplicationContainer({
            url: sTESTURL
        });
        strictEqual(oAppContainer.getUrl(), sTESTURL);

        oAppContainer = new sap.ushell.components.container.ApplicationContainer({
            visible: false
        });
        strictEqual(oAppContainer.getVisible(), false);

        oAppContainer = new sap.ushell.components.container.ApplicationContainer({
            height: "200px"
        });
        strictEqual(oAppContainer.getHeight(), "200px");

        throws(function () {
            oAppContainer = new sap.ushell.components.container.ApplicationContainer({
                height: "200foo"
            });
        });

        oAppContainer = new sap.ushell.components.container.ApplicationContainer({
            width: "100px"
        });
        strictEqual(oAppContainer.getWidth(), "100px");

        throws(function () {
            oAppContainer = new sap.ushell.components.container.ApplicationContainer({
                width: "100foo"
            });
        });

        oAppContainer = new sap.ushell.components.container.ApplicationContainer({
            additionalInformation: "SAPUI5="
        });
        strictEqual(oAppContainer.getAdditionalInformation(), "SAPUI5=");
    });

    test("ApplicationContainer renderer exists", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            oContainerRenderer = oRenderManager.getRenderer(oAppContainer);

        strictEqual(typeof oContainerRenderer, "object", oContainerRenderer);
    });

    test("sap.ushell.components.container.render URL", function () {
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        renderInternallyAndExpectIFrame(oAppContainer,
            sap.ushell.components.container.ApplicationType.URL, sTESTURL);
    });

    test("sap.ushell.components.container.render WDA", function () {
        oAppContainer.setWidth("10%");
        oAppContainer.setHeight("20%");
        renderInternallyAndExpectIFrame(oAppContainer,
            sap.ushell.components.container.ApplicationType.WDA,
            'http://anyhost:1234/sap/bc/webdynpro/sap/test_navigation_parameter');
    });

    ["NWBC", "TR", "WDA"].forEach(function (sLegacyApplicationType) {
        asyncTest("sap.ushell.components.container.render " + sLegacyApplicationType, function () {
            sap.ushell.bootstrap("local").done(function () {

                oAppContainer.setWidth("10%");
                oAppContainer.setHeight("20%");
                start();
                renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType[sLegacyApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');
            });
        });

    });

    test("getFrameSource", function () {
        strictEqual(oAppContainer.getFrameSource(
            sap.ushell.components.container.ApplicationType.URL,
            sTESTURL,
            ""
        ), sTESTURL);
    });

    test("getFrameSource invalid type", function () {
        throws(function () {
            oAppContainer.getFrameSource("FOO", sTESTURL, "");
        }, /Illegal application type: FOO/);
    });

    test("sap.ushell.components.container.render invalid type", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            sType = "FOO",
            sTechnicalErrorMsg = "Illegal application type: " + sType,
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer._render(oRenderManager.getRendererInterface(),
            oAppContainer, sType, sTESTURL, "");

        ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("getFrameSource throw new Error", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            sTechnicalErrorMsg = "Some error message",
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");

        oAppContainer.getFrameSource = function () {
            throw new Error(sTechnicalErrorMsg);
        };
        oAppContainer._render(oRenderManager.getRendererInterface(),
            oAppContainer, "n/a", sTESTURL, "");

        ok(oAppContainer._createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("sap.ushell.components.container.render invalid type w/ custom getFrameSource",
        function () {
            oAppContainer.setWidth("10%");
            oAppContainer.setHeight("20%");
            oAppContainer.getFrameSource = function (sApplicationType, sUrl, sAdditionalInformation) {
                // Note: no error thrown!
                return sUrl;
            };

            renderInternallyAndExpectIFrame(oAppContainer, "TRA", sTESTURL);
        });

    test("sap.ushell.components.container.render UI5 (SAPUI5=)", function () {
        var oRenderManager = new sap.ui.core.RenderManager(),
            oIcon = new sap.ui.core.Icon();

        // return a button instead of a view, so that we have a control with the necessary
        // properties, but don't have to supply another file for the view definition
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5View").returns(oIcon);
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oAppContainer._render(oRenderManager.getRendererInterface(),
            oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
            "SAPUI5=some.random.path.Viewname.view.xml");
        ok(oAppContainer._createUi5View.calledOnce);
        ok(oAppContainer._createUi5View.calledWith(oAppContainer,
            sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml"));
        ok(oAppContainer._renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oAppContainer,
            oIcon
        ));
    });

    test("ApplicationContainer invisible", function () {
        var oRenderManager = new sap.ui.core.RenderManager();

        oAppContainer.setVisible(false);
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_render");
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        ok(oAppContainer._render.notCalled, "_render function wasn't called on the application container");
        ok(oAppContainer._renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oAppContainer
        ));
    });

    test("ApplicationContainer rendering", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=will.be.ignored.view.xml");

        renderAndExpect(oAppContainer, oAppContainer.getApplicationType(), oAppContainer.getUrl(),
                oAppContainer.getAdditionalInformation());
    });

    test("createUi5View", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        var oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            //  properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");

        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(),
                oAppContainer.getAdditionalInformation());

        strictEqual(oView, oIcon, "createView returns our button");
        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.view.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1],
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path");
        ok(fnCreateView.calledOnce, "createView called");
        ok(oAppContainer._destroyChild.calledBefore(fnCreateView),
            "child destroyed before creating the view");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: {},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        strictEqual(oIcon.getWidth(), "11%");
        strictEqual(oIcon.getHeight(), "180px");
        ok(oIcon.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oIcon.getParent(), oAppContainer, "view's parent is the container");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View view in subfolder", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path/view.Viewname.view.js");

        var fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            fnCreateView = sinon.stub(sap.ui, "view").returns(new sap.ui.core.Icon()),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(),
                oAppContainer.getAdditionalInformation());

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1], "http://anyhost:1234/some/random/path");
        ok(fnCreateView.calledOnce, "createView called");
        strictEqual(fnCreateView.firstCall.args[0].type, "JS");
        strictEqual(fnCreateView.firstCall.args[0].viewName, "some.random.path.view.Viewname");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View with configuration data", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oView,
            oIcon = new sap.ui.core.Icon(),
            // return a button instead of a view, so we have a control with the necessary properties,
            // but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sinon.spy(jQuery.sap, "registerModulePath");
        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(),
                oAppContainer.getAdditionalInformation());

        strictEqual(oView, oIcon, "createView returns our button");

        ok(fnCreateView.calledOnce, "createView called");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: {"config" : {"a": 1, "b": 2}},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View with view data", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&bar=baz");
        // explicitely use ".view." in the view's path to check that this is no problem
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.view.path.Viewname.view.xml");

        var oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            //  properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        oView = oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(),
                oAppContainer.getAdditionalInformation());
        strictEqual(oView, oIcon, "createView returns our button");

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        ok(fnRegisterModulePath.calledWith("some.random.view.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path"),
            "registerModulePath args");
        ok(fnCreateView.calledOnce, "createView called");
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "XML",
            viewData: {foo: ["bar", "baz"], bar: ["baz"]},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View: invalid view type", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5=path.Viewname.view.foo");

        var fnCreateView = sinon.spy(sap.ui, "view");

        //TODO does this appear in log or on UI?
        throws(function () {
            oAppContainer._createUi5View(oAppContainer, oAppContainer.getUrl(),
                    oAppContainer.getAdditionalInformation());
        });
        ok(fnCreateView.calledWith({
            id: oAppContainer.getId() + "-content",
            type: "FOO",
            viewData: {},
            viewName: "path.Viewname"
        }), "createView args");
    });

    function createComponentViaSapui5(sQueryString, oExpectedComponentData) {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test" + sQueryString);
        oAppContainer.setAdditionalInformation("SAPUI5=some.random.path");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        sinon.spy(jQuery.sap, "registerModulePath");
        sinon.spy(jQuery.sap, "assert");
        sinon.spy(sap.ui, "component");

        var oControl = oAppContainer._createUi5View(oAppContainer,
                oAppContainer.getUrl(), oAppContainer.getAdditionalInformation());

        ok(jQuery.sap.registerModulePath.calledOnce, "registerModulePath called once");
        ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/path"),
            "registered the component correctly");
        strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
        ok(oControl.getComponentInstance() instanceof some.random.path.Component,
            "created the correct component");
        strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
            "component ID");
        deepEqual(oControl.getComponentInstance().getComponentData(), oExpectedComponentData,
            "passed the component data correctly");
        strictEqual(oControl.getWidth(), "11%");
        strictEqual(oControl.getHeight(), "180px");
        ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
        //ok(jQuery.sap.assert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    }

    test("createUi5View: component w/o componentData", function () {
        createComponentViaSapui5('', { startupParameters : {}});
    });

    test("createUi5View: component w/ componentData", function () {
        createComponentViaSapui5('?foo=bar&foo=baz&sap-xapp-state=12343&bar=baz',
            {startupParameters: {foo: ['bar', 'baz'], bar: ['baz']},
             "sap-xapp-state" : ["12343"]});
    });

    test("createUi5View: missing namespace", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=Viewname.view.js");

        testFailingCreateUi5View(oAppContainer, "Missing namespace");
    });

    test("createUi5View: illegal namespace", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=foo/bar/view.Viewname.view.js");

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");
    });

    test("createUi5View: missing view name", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");
    });

    test("createUi5View: with application config and without view name", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5=.view.js");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oControl;

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        testFailingCreateUi5View(oAppContainer, "Invalid SAPUI5 URL");

        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
    });

    test("destroyChild() w/o child", function () {
        sinon.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("destroyChild() w/ component", function () {
        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        sinon.spy(oAppContainer, "destroyAggregation");

        oAppContainer._destroyChild(oAppContainer);

        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("exit: destroyChild called", function () {
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");

        oAppContainer.exit();

        ok(oAppContainer._destroyChild.calledWith(oAppContainer),
            "destroyChild called");
    });

    test("exit: messageEventListener removed", function () {
        var fnListenerDummy = function () {},
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._messageEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("message", fnListenerDummy));
    });

    test("exit: storageEventListener removed", function () {
        var fnListenerDummy = function () {},
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._storageEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("storage", fnListenerDummy));
    });

    test("exit: unloadEventListener removed", function () {
        var fnListenerDummy = function () {},
            oRemoveEventListenerSpy = sinon.spy(window, "removeEventListener");

        oAppContainer._unloadEventListener = fnListenerDummy;

        oAppContainer.exit();

        ok(oRemoveEventListenerSpy.calledWith("unload", fnListenerDummy));
    });

    test("sap.ushell.components.container.render UI5 (SAPUI5.component=)", function () {
        var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
            oRenderManager = new sap.ui.core.RenderManager(),
            oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component")
                .returns(oControl),
            oRenderControlInDivStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oAppContainer._render(oRenderManager.getRendererInterface(),
            oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
            "SAPUI5.Component=some.random.path");

        ok(oCreateUi5ComponentStub.calledOnce);
        ok(oCreateUi5ComponentStub.calledWith(oAppContainer, sTESTURL, "some.random.path"));
        ok(oRenderControlInDivStub.calledWith(oRenderManager.getRendererInterface(),
            oAppContainer, oControl
        ));
    });

    test("rerender without property change does not recreate component", function () {

        var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
            oRenderManager = new sap.ui.core.RenderManager(),
            oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component").returns(oControl),
            oGetAggregationStub;

        // render the container twice (can happen due to async rerendering)
        oAppContainer._render(oRenderManager.getRendererInterface(),
                oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
                "SAPUI5.Component=some.random.path");

        oGetAggregationStub = sinon.stub(oAppContainer, "getAggregation").returns(oControl);

        oAppContainer._render(oRenderManager.getRendererInterface(),
                oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
                "SAPUI5.Component=some.random.path");

        // unless there is a change in the properties, the component should only be instantiated once
        ok(oCreateUi5ComponentStub.calledOnce);
    });

    [
        {
            sProperty: "URL",
            fnSetter: function (oContainer) {
                oContainer.setUrl("http://new/url");
            }
        },
        {
            sProperty: "additionalInformation",
            fnSetter: function (oContainer) {
                oContainer.setAdditionalInformation("SAPUI5.Component=new.component");
            }
        },
        {
            sProperty: "applicationType",
            fnSetter: function (oContainer) {
                oContainer.setApplicationType(sap.ushell.components.container.ApplicationType.NWBC);
            }
        }
        // TODO: handle setHeight, setWidth; setApplication still relevant at all?
    ].forEach(function (oFixture) {
        test("rerender with changed " + oFixture.sProperty + " does recreate component", function () {

            var oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
                oRenderManager = new sap.ui.core.RenderManager(),
                oCreateUi5ComponentStub = sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_createUi5Component").returns(oControl),
                oGetAggregationStub;

            // render the container twice (can happen due to async rerendering)
            oAppContainer._render(oRenderManager.getRendererInterface(),
                    oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
                "SAPUI5.Component=some.random.path");

            oGetAggregationStub = sinon.stub(oAppContainer, "getAggregation").returns(oControl);

            oFixture.fnSetter(oAppContainer);

            oAppContainer._render(oRenderManager.getRendererInterface(),
                    oAppContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
                "SAPUI5.Component=some.random.path");

            // since there was change in the properties, the component should be instantiated twice
            ok(oCreateUi5ComponentStub.calledTwice);
        });
    });

    asyncTest("createUi5Component w.o. explicit startup data : defaulting of startupParameters", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oControl,
            cnt = 0,
            fct;

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        fct = function (sChannelId, sEventId, oArgs) {
            start();
            equal(cnt, 1, "correct asynchronous event");
            ok(oControl.getComponentInstance() === oArgs.component, "correct component");
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        };
        // enable eventing!
        sinon.restore(oAppContainer._publishExternalEvent);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');
        cnt = cnt + 1;
        equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), false, "no sap-xapp-state");
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  startupParameters: {},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
    });


    asyncTest("createUi5Component with explicit startup data : defaulting of startupParameters", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?sap-xapp-state=ABC&c=3");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": [1], "b": [2]});

        var oControl,
            cnt = 0,
            fct;

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        fct = function (sChannelId, sEventId, oArgs) {
            start();
            equal(cnt, 1, "correct asynchronous event");
            ok(oControl.getComponentInstance() === oArgs.component, "correct component");
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        };
        // enable eventing!
        sinon.restore(oAppContainer._publishExternalEvent);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');
        cnt = cnt + 1;
        equal(oControl.getComponentInstance().getComponentData().hasOwnProperty("sap-xapp-state"), true, "sap-xapp-state");
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  startupParameters: { "c" : ["3"]},
                   "sap-xapp-state" : ["ABC"],
                   config: {"a": [1], "b": [2]}},
                "passed the component data correctly");
    });

    asyncTest("createUi5Component event sap.ushell.components.container.ApplicationContainer / componentCreacted fired", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oControl,
            cnt = 0,
            fct;

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        fct = function (sChannelId, sEventId, oArgs) {
            start();
            equal(cnt, 1, "correct asynchronous event");
            ok(oControl.getComponentInstance() === oArgs.component, "correct component");
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        };
        // enable eventing!
        sinon.restore(oAppContainer._publishExternalEvent);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "componentCreated", fct);
        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');
        cnt = cnt + 1;
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
    });

    asyncTest("createUi5Component event sap.ushell.components.container.ApplicationContainer / _prior.newUI5ComponentInstantion fired before component instantiation", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oControl,
            cnt = 0;
        var fPrior = sap.ui.component;
        var oStubComponent = sinon.stub(sap.ui,"component", function(a1, a2) {
                cnt = cnt + 1;
                return fPrior(a1,a2);
            });
        var fct = function (sChannelId, sEventId, oArgs) {
            start();
            equal(cnt, 0, "correct asynchronous event");
            deepEqual(oArgs.name, "some.random.path", "correct arguments");
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);
        };

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", fct);

        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        cnt = cnt + 1;
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
        oStubComponent.restore();
    });

    test("disable router : invoked stop if getRouter returns something present", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        var oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
        var oFakeRouter =  {stop : function() {} };
        oControl.getComponentInstance().getRouter = function() { return  oFakeRouter; };
        var spyStop = sinon.spy(oControl.getComponentInstance().getRouter(), "stop");
        // simulate event
        oAppContainer._disableRouter(oControl.getComponentInstance());
        ok(spyStop.called, "stop was called");
    });

    test("disable router : there is an evenhandler registered which effectively disables the router when the event is fired", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        var oControl,
            spySubscribe = sinon.spy(sap.ui.getCore().getEventBus(), "subscribe");

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
        var oFakeRouter =  {stop : function() {} };
        equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
        equal(spySubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
        equal(spySubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
        equal(spySubscribe.args[0][2], oAppContainer._disableRouterEventHandler , " function registered");
        oControl.getComponentInstance().getRouter = function() { return  oFakeRouter; };
        var spyStop = sinon.spy(oControl.getComponentInstance().getRouter(), "stop");
        // simulate event
        sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", { });
        ok(spyStop.called, "stop was called");
    });

    test("disable Router: exit unsubscribes Event", function () {
        sinon.spy(oAppContainer, "destroyAggregation");
        var spyUnSubscribe = sinon.spy(sap.ui.getCore().getEventBus(), "unsubscribe");
        oAppContainer._disableRouterEventHandler = function () { return "a";};
        equal(typeof oAppContainer._disableRouterEventHandler, "function", " function stored");
        oAppContainer.exit();
        equal(spyUnSubscribe.args[0][0], "sap.ushell.components.container.ApplicationContainer", "subscribe arg1");
        equal(spyUnSubscribe.args[0][1], "_prior.newUI5ComponentInstantion", "subscribe arg1");
        equal(spyUnSubscribe.args[0][2], oAppContainer._disableRouterEventHandler , " function registered");

        if (this._disableRouterEventHandler) {
            sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", this._disableRouterEventHandler);//{ sValue : sServiceUrl }
        }
        oAppContainer.exit();
        ok(oAppContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("createUi5Component with configuration data", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setApplicationConfiguration({"a": 1, "b": 2});

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        var oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]},
                   config: {"a": 1, "b": 2}},
                "passed the component data correctly");
    });

    test("createUi5Component", function () {
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        oAppContainer.setWidth("11%");
        oAppContainer.setHeight("180px");

        var oControl;

        sinon.spy(jQuery.sap, "registerModulePath");
        sinon.spy(jQuery.sap, "require");
        sinon.spy(jQuery.sap, "assert");
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");
        sinon.spy(sap.ui, "component");

        window.sap = window.sap || {};
        sap.ushell = sap.ushell || {};
        sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

        oControl = oAppContainer._createUi5Component(oAppContainer,
                oAppContainer.getUrl(), 'some.random.path');

        ok(oAppContainer._destroyChild.calledBefore(sap.ui.component),
            "child destroyed before creating the component");
        ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/"),
            "registered the component correctly");
        ok(!jQuery.sap.registerModulePath.calledWith("sap.ca"), "did not register sap.ca");
        ok(jQuery.sap.require.calledWithExactly("sap.ushell.services.CrossApplicationNavigation"));

        strictEqual(oControl.getId(), oAppContainer.getId() + "-content", "component container ID");
        ok(oControl.getComponentInstance() instanceof some.random.path.Component,
            "created the correct component");
        strictEqual(oControl.getComponentInstance().getId(), oAppContainer.getId() + "-component",
            "component ID");
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {  "sap-xapp-state" : [ "1234242" ],
                   startupParameters: {foo: ["bar", "baz"], bar: ["baz"]}},
                "passed the component data correctly");
        strictEqual(oControl.getWidth(), "11%");
        strictEqual(oControl.getHeight(), "180px");
        ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oControl.getParent(), oAppContainer, "control's parent is the container");
        //ok(jQuery.sap.assert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });


    [
        {additionalInfo: 'SAPUI5=some.random.path', configuration: {foo : "bar"}},
        {additionalInfo: 'SAPUI5.Component=some.random.path', configuration: {foo : "bar"}},
        {additionalInfo: 'SAPUI5=some.random.path.no.config', configuration: {}},
        {additionalInfo: 'SAPUI5.Component=some.random.path.no.config', configuration: {}},
        {additionalInfo: 'SAPUI5=some.random.path.SomeView.view.xml', configuration: undefined},
        {additionalInfo: undefined, configuration: undefined},
        {type: sap.ushell.components.container.ApplicationType.WDA, additionalInfo: undefined,
            configuration: undefined},
        {type: "INVALID_TYPE: Event fired even on error"}
    ].forEach(function (oFixture) {
        asyncTest("application configuration: " + JSON.stringify(oFixture), function () {
            var oIcon = new sap.ui.core.Icon(),
                oRenderManager = new sap.ui.core.RenderManager();

            window.sap = window.sap || {};
            sap.ushell = sap.ushell || {};
            sap.ushell.Container = sap.ushell.Container || { getService: function (sService) {}};

            sinon.stub(sap.ui, "view").returns(oIcon);
            // no sinon spy as event handler:
            // SAPUI5 empties event object at end of EventProvider.prototype.fireEvent
            oAppContainer.attachApplicationConfiguration(function (oEvent) {
                start();
                ok(true, "event 'applicationConfiguration' sent");
                strictEqual(oEvent.getId(), "applicationConfiguration", "event name");
                deepEqual(oEvent.getParameter("configuration"), oFixture.configuration,
                    "event payload is component configuration");
            });
            oAppContainer._render(oRenderManager.getRendererInterface(),
                oAppContainer,
                oFixture.type || sap.ushell.components.container.ApplicationType.URL,
                "http://anyhost:1234/ushell/test-resources/sap/ushell/test/components/container",
                oFixture.additionalInfo);
        });
    });

    test("ApplicationContainer invisible with Application", function () {
        var oApplication = getApplication(),
            oRenderManager = new sap.ui.core.RenderManager();

        oAppContainer.setApplication(oApplication);
        oAppContainer.setVisible(false);

        sinon.stub(oAppContainer, "_render");
        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        ok(oAppContainer._render.notCalled);
    });

    test("ApplicationContainer Application rendering", function () {
        var oApplication = getApplication({
                type: sap.ushell.components.container.ApplicationType.URL,
                url: sTESTURL
            });
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.WDA);
        oAppContainer.setApplication(oApplication);
        oAppContainer.setUrl("/should/not/be/used");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        renderAndExpect(oAppContainer, oApplication.getType(), oApplication.getUrl(), "");
    });

    test("createSystemForUrl", function () {

        function check(sUrl, oExpectedSystem) {
            var oSystem = oAppContainer._createSystemForUrl(sUrl);
            strictEqual(oSystem.getAlias(), oExpectedSystem.alias, "alias for " + sUrl);
            strictEqual(oSystem.getBaseUrl(), oExpectedSystem.baseUrl, "baseUrl for " + sUrl);
            strictEqual(oSystem.getClient(), oExpectedSystem.client, "client for " + sUrl);
            strictEqual(oSystem.getPlatform(), "abap", "platform for " + sUrl);
        }

        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar", {
            alias: "http://anyhost:1234",
            baseUrl: "http://anyhost:1234"
        });
        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar&sap-client=120", {
            alias: "http://anyhost:1234?sap-client=120",
            baseUrl: "http://anyhost:1234",
            client: "120"
        });
    });

    asyncTest("ApplicationContainer logout de-/registration", function () {
        sap.ushell.bootstrap("local").done(function () {
            oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.WDA);

            var fnLogout;

            sinon.stub(sap.ushell.Container, "addRemoteSystem");
            sinon.stub(sap.ushell.Container, "attachLogoutEvent");
            sinon.stub(sap.ushell.Container, "detachLogoutEvent");
            sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createSystemForUrl");

            renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType.WDA,
                    'http://anyhost:1234/sap/bc/ui2/wda/~canvas');
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            renderInternallyAndExpectIFrame(oAppContainer,
                sap.ushell.components.container.ApplicationType.NWBC,
                'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
            strictEqual(sap.ushell.Container.attachLogoutEvent.getCalls().length, 1, "logout registered: attachLogoutEvent was called once");
            fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];
            strictEqual(typeof fnLogout, "function", "a logout function has been attached when attachLogoutEvent was called");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout, "can get the logout handler via _getLogoutHandler");

            ok(oAppContainer._createSystemForUrl
                .calledWith("http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120"),
                "created a system for the URL");

            ok(sap.ushell.Container.addRemoteSystem
                .calledWith(oAppContainer._createSystemForUrl.returnValues[0]),
                "the system was added to the controller");

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();

            renderInternallyAndExpectIFrame(oAppContainer,
                sap.ushell.components.container.ApplicationType.WDA,
                'http://anyhost:1234/sap/bc/ui2/WDA/~canvas', "additionalInfo");
            ok(sap.ushell.Container.detachLogoutEvent.callCount === 1, "logout deregistered");
            strictEqual(sap.ushell.Container.detachLogoutEvent.args[0][0], fnLogout);
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined);

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();

            ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
                renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/' + sNwbcLikeApplicationType + '/~canvas', "additionalInfo");
                fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];

                strictEqual(oAppContainer._getLogoutHandler(oAppContainer), fnLogout);
                oAppContainer.exit();
                strictEqual(oAppContainer._getLogoutHandler(oAppContainer), undefined,
                    "logout deregistered after exit");
                ok(sap.ushell.Container.detachLogoutEvent.called, "logout deregistered on exit");

                sap.ushell.Container.attachLogoutEvent.reset();
                sap.ushell.Container.detachLogoutEvent.reset();
            });
            start();
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff fired", function () {
            sap.ushell.bootstrap("local").done(function () {
                oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType]);

                var fnPostMessage = sinon.spy(function (sMessage, sOrigin) {
                        strictEqual(JSON.parse(sMessage).action, "pro54_disableDirtyHandler",
                            "disable NWBC window.beforeUnload handlers");
                    }),
                    oEvent = new sap.ui.base.Event(),
                    fnGetAttribute = sinon.stub().returns("http://anyhost:1234/sap/bc/ui2/nwbc/~canvas"),
                    fnSetAttribute = sinon.spy(),
                    sTagName;
                start();
                sinon.spy(oEvent, "preventDefault");
                sinon.stub(oAppContainer, "getDomRef", function () {
                    return {
                        setAttribute: fnSetAttribute,
                        getAttribute: fnGetAttribute,
                        contentWindow: {
                            postMessage: fnPostMessage
                        },
                        tagName: sTagName
                    };
                });

                renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');

                // don't do anything if the tagName doesn't match "IFRAME"
                // sTagName is here undefined
                oAppContainer._logout(oAppContainer, oEvent);
                sTagName = "FOO";
                oAppContainer._logout(oAppContainer, oEvent);
                ok(oEvent.preventDefault.notCalled, "preventDefault not called");
                ok(fnSetAttribute.notCalled, "setAttribute not called");
                ok(fnPostMessage.notCalled, "postMessage not called");

                // logout via iFrame fired
                sTagName = "IFRAME";
                oAppContainer._logout(oAppContainer, oEvent);
                ok(oEvent.preventDefault.calledOnce, "preventDefault called");
                ok(fnPostMessage.calledOnce, "postMessage called");
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer " + sNwbcLikeApplicationType + " Logoff 2 Instances", function () {
            //This test does not use the ApplicationContainer instance created as part of the setup function,
            //because here are two instances needed.
            sap.ushell.bootstrap("local").done(function () {
                var oContainer1 = new sap.ushell.components.container.ApplicationContainer({
                        applicationType: sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType]
                    }),
                    oContainer2 = new sap.ushell.components.container.ApplicationContainer({
                        applicationType: sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType]
                    }),
                    oEvent = new sap.ui.base.Event(),
                    fnGetAttribute = sinon.spy(),
                    fnSetAttribute = sinon.spy(),
                    fnLogout1,
                    fnLogout2;

                sap.ushell.Container.addRemoteSystem = sinon.stub();
                sap.ushell.Container.attachLogoutEvent = sinon.stub();
                sap.ushell.Container.detachLogoutEvent = sinon.stub();
                sap.ushell.Container.DirtyState = {
                    CLEAN: "CLEAN",
                    DIRTY: "DIRTY",
                    MAYBE_DIRTY: "MAYBE_DIRTY",
                    PENDING: "PENDING",
                    INITIAL: "INITIAL"
                };

                sinon.spy(oEvent, "preventDefault");
                sinon.stub(oContainer1, "getDomRef", function () {
                    return {setAttribute: fnSetAttribute,
                            getAttribute: fnGetAttribute,
                            tagName: "IFRAME"};
                });
                sinon.stub(oContainer2, "getDomRef", function () {
                    return {setAttribute: fnSetAttribute,
                            getAttribute: fnGetAttribute,
                            tagName: "IFRAME"};
                });
                sinon.spy(oContainer1, "_logout");

                // render first container
                renderInternallyAndExpectIFrame(oContainer1,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');
                start();
                ok(sap.ushell.Container.attachLogoutEvent.callCount === 1, "logout registered 1st");
                fnLogout1 = sap.ushell.Container.attachLogoutEvent.args[0][0];

                // render second container
                renderInternallyAndExpectIFrame(oContainer2,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:4321/sap/bc/ui2/nwbc/~canvas');
                ok(sap.ushell.Container.attachLogoutEvent.callCount === 2, "logout registered 2nd");
                fnLogout2 = sap.ushell.Container.attachLogoutEvent.args[1][0];
                ok(fnLogout1 !== fnLogout2, "first and second logout registration different");

                // test logout map entries
                strictEqual(oContainer1._getLogoutHandler(oContainer1), fnLogout1);
                strictEqual(oContainer2._getLogoutHandler(oContainer2), fnLogout2);
            });
        });
    });


    asyncTest("ApplicationContainer Application with resolve", function () {
        var oApplication = getApplication({
                text: "test application",
                url: "/should/not/be/used",
                resolvable: true
            }),
            oLaunchpadData = {
                applicationType: "URL",
                applicationData: "SAPUI5=some.random.view.xml",
                Absolute: {
                    url: sTESTURL + "?"
                }
            },
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent(sCONTAINER)
                .debug("Resolving " + oApplication.getUrl(), null, sCONTAINER)
                .debug("Resolved " + oApplication.getUrl(), JSON.stringify(oLaunchpadData),
                    sCONTAINER),
            oRenderManager = new sap.ui.core.RenderManager(),
            oLoadingIndicator;

        oAppContainer.setApplication(oApplication);
        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.WDA);
        oAppContainer.setUrl("/should/not/be/used/either");
        oAppContainer.setAdditionalInformation("SAPUI5=should.not.be.used.view.xml");

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_getTranslatedText").returns("foo");
        sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
            // simulate the resolve: call success handler with (necessary) launchpad data
             sap.ushell.utils.call(function () {
                fnSuccess(oLaunchpadData);
                // verify
                start();
                ok(oAppContainer.getAggregation("child") === null,
                    "Loading indicator has been deleted again");

                // As a consequence of the invalidate UI5 would render again; simulate this
                renderAndExpect(oAppContainer, "URL", sTESTURL, "SAPUI5=some.random.view.xml");

                oLogMock.verify();
            }, fnError, true);
        });

        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");

        oRenderManager.render(oAppContainer, document.createElement("DIV"));

        oLoadingIndicator = oAppContainer.getAggregation("child");
        ok(oAppContainer._renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oAppContainer,
            oLoadingIndicator
        ));
        ok(oAppContainer._getTranslatedText.calledWith("loading",
            [oApplication.getText()]), "loading indicator text requested");
        strictEqual(oLoadingIndicator.getText(), "foo", "Loading indicator text ok");
    });

    [undefined, sinon.spy()].forEach(function (fnApplicationErrorHandler) {
        var sResolveFailed = "resolve failed";
        asyncTest("ApplicationContainer Application resolve error w/" +
                (fnApplicationErrorHandler ? "" : "o") + " error handler",
             function () {
                var oApplication = getApplication({
                    resolvable: true,
                    errorHandler: fnApplicationErrorHandler
                }),
                    oDiv = document.createElement("DIV"),
                    oRenderManager = new sap.ui.core.RenderManager();

                oAppContainer.setApplication(oApplication);

                sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_createErrorControl");
                sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_renderControlInDiv");
                sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
                     sap.ushell.utils.call(function () {
                        // simulate the resolve: call error handler (asynchronously)
                        fnError(sResolveFailed);

                        // verify
                        ok(oAppContainer._createErrorControl.notCalled);
                        if (fnApplicationErrorHandler) {
                            ok(fnApplicationErrorHandler.calledOnce);
                            ok(fnApplicationErrorHandler.calledWith(sResolveFailed));
                        }

                        // simulate SAPUI5's automatic re-rendering
                        oRenderManager.render(oAppContainer, oDiv);

                        // verify
                        start();
                        ok(oAppContainer._createErrorControl.calledOnce);
                        ok(oAppContainer._renderControlInDiv.calledWith(
                            oRenderManager.getRendererInterface(),
                            oAppContainer,
                            oAppContainer._createErrorControl.returnValues[0]
                        ));
                    }, sap.ushell.test.onError, true);
                });

                oRenderManager.render(oAppContainer, oDiv);
            });
    });

    test("ApplicationContainer init", function () {
        sinon.spy(jQuery.sap, "uid");
        sinon.spy(window, "addEventListener");
        //ApplicationContainer needs to be reinitialized here, because of the uid() call
        oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        ok(jQuery.sap.uid.calledOnce);
        strictEqual(oAppContainer.globalDirtyStorageKey, "sap.ushell.Container.dirtyState." +
            jQuery.sap.uid.returnValues[0], "right ID");
        ok(window.addEventListener.calledWith("unload"), "unload registered");
        ok(window.addEventListener.calledWith("storage"), "storage registered");
        ok(window.addEventListener.calledWith("message"), "message registered");
    });

//    test("MessageConcept | ApplicationContainer is instanciated twice", function () {
//        var oContainer = new sap.ushell.components.container.ApplicationContainer();
//            setDefaultHandlersSpy = sinon.spy(sap.m.MessagePopover, "setDefaultHandlers");
//
//        ok(setDefaultHandlersSpy.calledOnce,
//            "Initializing the application container the first time, setDefaultHandlers is called once");
//
//        // Instanciating the application container a second time to simulate
//        // the use case that setDefaultHandlers is not called again, because the
//        // validation logic was already attached to the SAP UI5 MessagePopover control before
//        oContainer = new sap.ushell.components.container.ApplicationContainer();
//
//        ok(!setDefaultHandlersSpy.calledTwice,
//            "setDefaultHandlers is not called again");
//    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer IDs in sync with localStorage when applicationType is " + sNwbcLikeApplicationType, function () {
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container.addRemoteSystem = sinon.stub();
                sap.ushell.Container.attachLogoutEvent = sinon.stub();
                sap.ushell.Container.detachLogoutEvent = sinon.stub();
                sap.ushell.Container.DirtyState = {
                    CLEAN: "CLEAN",
                    DIRTY: "DIRTY",
                    MAYBE_DIRTY: "MAYBE_DIRTY",
                    PENDING: "PENDING",
                    INITIAL: "INITIAL"
                };

                renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
                start();
                ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");

                // render second time
                Storage.prototype.removeItem.reset();
                Storage.prototype.setItem.reset();
                renderInternallyAndExpectIFrame(oAppContainer,
                    sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType],
                    'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
                ok(Storage.prototype.removeItem.calledWith(oAppContainer.globalDirtyStorageKey),
                    "removeItem called");
                ok(Storage.prototype.setItem.calledWith(oAppContainer.globalDirtyStorageKey, "INITIAL"),
                    "calledWith right ID");
                Storage.prototype.removeItem.reset();
                oAppContainer.exit();
                ok(Storage.prototype.removeItem.calledOnce, "removeItem called after exit");
            });
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("handleMessageEvent for pro54_setGlobalDirty when application type is " + sNwbcLikeApplicationType, function () {
            sap.ushell.bootstrap("local").done(function () {
                var oContentWindow = {},
                    oMessage = {
                        data: {
                            action: "pro54_setGlobalDirty",
                            parameters: {
                                globalDirty: "DIRTY"
                            }
                        },
                        source: oContentWindow
                    },
                    oLogMock = sap.ushell.test.createLogMock()
                        .filterComponent("sap.ushell.components.container.ApplicationContainer"),
                    sStorageKey;

                sinon.spy(sap.ushell.utils, "localStorageSetItem");
                sinon.stub(Storage.prototype, "getItem", function (sKey) {
                    return "PENDING";
                });
                oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType]);
                sinon.stub(oAppContainer, "getDomRef").returns({
                    tagName: "IFRAME",
                    contentWindow: oContentWindow
                });

                sStorageKey = oAppContainer.globalDirtyStorageKey;
                oLogMock.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:" +
                        sStorageKey + " value: " + oMessage.data.parameters.globalDirty,
                        null,
                        "sap.ushell.components.container.ApplicationContainer");
                oAppContainer._handleMessageEvent(oAppContainer, oMessage);

                ok(Storage.prototype.setItem.calledWith(sStorageKey, "DIRTY"),
                    "localStorage.setItem called");
                ok(sap.ushell.utils.localStorageSetItem.calledWith(sStorageKey,
                    "DIRTY", true),
                    "localStorageSetItem wrapper called with third paramaeter");
                oLogMock.verify();

                // second test: message from wrong window
                oMessage.source = {};
                sap.ushell.utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                ok(sap.ushell.utils.localStorageSetItem.notCalled);

                // third test: message when no DOM ref
                oAppContainer.getDomRef.returns(undefined);
                sap.ushell.utils.localStorageSetItem.reset();

                oAppContainer._handleMessageEvent(oAppContainer, oMessage);
                ok(sap.ushell.utils.localStorageSetItem.notCalled);

                // TODO test when not PENDING
                // TODO test with stringified oMessage.data (parseable/non-parseable)
                start();
            });
        });
    });

    test("handleMessageEvent for CrossApplicationNavigation with data as JSON object", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        delete oMessage.data.type;
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_handleServiceMessageEvent");

        // function to be tested
        oAppContainer._handleMessageEvent(undefined, oMessage);

        ok(oAppContainer._handleServiceMessageEvent.calledOnce,
            "checks if handleServiceMessageEvent method gets called only once");
        ok(oAppContainer._handleServiceMessageEvent
            .calledWith(undefined, oMessage, oMessage.data), "called with correct parameters");
    });

    test("handleMessageEvent for CrossApplicationNavigation with data as string", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        delete oMessage.data.type;
        oMessage.data = JSON.stringify(oMessage.data);
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_handleServiceMessageEvent");

        // function to be tested
        oAppContainer._handleMessageEvent(undefined, oMessage);

        ok(oAppContainer._handleServiceMessageEvent.calledOnce,
            "checks if handleServiceMessageEvent method gets called only once");
        ok(oAppContainer._handleServiceMessageEvent
            .calledWith(undefined, oMessage, JSON.parse(oMessage.data)), "called with correct parameters");
    });

    test("handleServiceMessageEvent with config on", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(false);
        oLogMock = sap.ushell.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin: " + oMessage.origin,
                oMessage.data, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        oAppContainer
            ._handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleServiceMessageEvent with config off", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: false});
        oLogMock = sap.ushell.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is " +
                    "disabled. It can be enabled via launchpad configuration property " +
                    "'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        oAppContainer
            ._handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleServiceMessageEvent with no post message config", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({});
        sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(false);
        oLogMock = sap.ushell.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin: " + oMessage.origin,
                oMessage.data, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        oAppContainer
            ._handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleServiceMessageEvent service definition", function () {

        // Test if the handleServiceMessageEvent method doesn't return
        // when the service starts with sap.ushell.services.CrossApplicationNavigation.

        //test data
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: false});
        oLogMock = sap.ushell.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is disabled." +
                     " It can be enabled via launchpad configuration property 'services.PostMessage.config.enabled: true'",
                    undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        oAppContainer
            ._handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();

        // Test the behaviour of the handleServiceMessageEvent method in the case it has a
        // service string defined which is not starting with sap.ushell.services.CrossApplicationNavigation. The method
        // then has to return and NOT log a warning (as defined in the next conditional block)

        //test data
        oMessage.data.service = "otherService";

        // test preparation
        sinon.spy(jQuery.sap.log, "warning");

        // function to be tested
        oAppContainer
            ._handleServiceMessageEvent(undefined, oMessage, oMessage.data);

        ok(!jQuery.sap.log.warning.called, "No warning logged");
    });

    test("handleServiceMessageEvent hrefForExternal - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.hrefForExternal",
                    body: {
                        "oArgs": {
                            "target": {
                                "semanticObject": "UnitTest",
                                "action": "someAction"
                            },
                            "params": {
                                "A": "B"
                            }
                        }
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({hrefForExternal: sinon.stub().returns("result")});

            // function to be tested
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful call
            sinon.assert.calledWith(sap.ushell.Container.getService().hrefForExternal, oMessageData.body.oArgs);
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin);
        });
    });

    test("handleServiceMessageEvent hrefForExternal - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.hrefForExternal"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // adapt test data to throw exception
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({hrefForExternal: sinon.stub().throws(oFakeError)});

            // function to be tested
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().hrefForExternal.calledOnce, "hrefForExternal was called once");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin);
        });
    });

    test("handleServiceMessageEvent getSemanticObjectLinks - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                    body: {
                        "sSemanticObject": "UnitTest",
                        "mParameters": {
                            "A" : "B"
                        },
                        "bIgnoreFormFactors": false
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledWith(oMessageData.body.sSemanticObject, oMessageData.body.mParameters, oMessageData.body.bIgnoreFormFactors), "I was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "postMessage called with proper args");
        });
    });

    test("handleServiceMessageEvent getSemanticObjectLinks - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledOnce, "getSemanticObjectLinks was called");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin);

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().getSemanticObjectLinks.throws(oFakeError);

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledTwice, "getSemanticObjectLinks was called");
            sinon.assert.calledWith(oMessage.source.postMessage, JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin);
        });
    });

    test("handleServiceMessageEvent isIntentSupported - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                    body: {
                        "aIntents": ["#GenericWrapperTest-open", "#Action-showBookmark", "#Action-invalidAction"]
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);
            // check result
            ok(sap.ushell.Container.getService().isIntentSupported.calledWith(oMessageData.body.aIntents), "Called with proper args");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent isIntentSupported - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.isIntentSupported"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledOnce, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().isIntentSupported.throws(oFakeError);

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledTwice, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent isNavigationSupported - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                    body: {
                        "aIntents": [ { target : { semanticObjcet : "Action", action : "showBookmark"}},
                                      { target : { semanticObject: "Action", action : "invalidAction"}}
                        ]
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isNavigationSupported: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            ok(sap.ushell.Container.getService().isNavigationSupported.calledWith(oMessageData.body.aIntents), "called with proper args");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent isNavigationSupported - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isNavigationSupported: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isNavigationSupported.calledOnce, "isNavigationSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().isNavigationSupported.throws(oFakeError);

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().isNavigationSupported.calledTwice, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent getAppStateData - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.getAppStateData",
                    body: {
                        "sAppStateKey":  "ABC"
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getAppStateData: sinon.stub().returns(new jQuery.Deferred().resolve("result1").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            deepEqual(sap.ushell.Container.getService().getAppStateData.args[0], [ oMessageData.body.sAppStateKey] , "proper arguments");
            deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {
                    result: "result1"
                }
            }), oMessage.origin], " proper args");
        });
    });

    test("handleServiceMessageEvent getAppStateData - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.getAppStateData"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getAppStateData: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getAppStateData.calledOnce, "getAppStateData was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin), "called with proper args");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().getAppStateData.throws(oFakeError);

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error
            ok(sap.ushell.Container.getService().getAppStateData.calledTwice, "getAppStateData was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent toExternal - success", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.toExternal",
                    body: {
                        "oArgs": {
                            "target": {
                                "semanticObject": "UnitTest",
                                "action": "someAction"
                            },
                            "params": {
                                "A": "B"
                            }
                        }
                    }
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ toExternal: sinon.stub() });

            // function to be tested
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect a successful response
            ok(sap.ushell.Container.getService().toExternal.calledWith(oMessageData.body.oArgs), "called with proper args");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {}
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent toExternal - error", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.CrossApplicationNavigation.toExternal"
                }),
                oMessageData = JSON.parse(oMessage.data);

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ toExternal: sinon.stub().throws(oFakeError) });

            // simulate event
            oAppContainer
                ._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // we expect an error response
            ok(sap.ushell.Container.getService().toExternal.calledOnce, "toExternal was called once");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "called with proper args");
        });
    });

    test("handleServiceMessageEvent ShellUIService setTitle", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.ui5service.ShellUIService.setTitle",
                    body: {
                        sTitle:  "Purchase Order"
                    }
                }),
                oMessageData = JSON.parse(oMessage.data),
                oSetTitleStub = sinon.stub();

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);

            sinon.stub(oAppContainer, "getShellUIService").returns({
                setTitle: oSetTitleStub
            });

            // simulate event
            oAppContainer._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            deepEqual(oSetTitleStub.args[0], [oMessageData.body.sTitle] , "setTitle method of public service called with proper arguments");
            deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {}
            }), oMessage.origin], " proper args");
        });
    });

    test("handleServiceMessageEvent ShellUIService setTitle (to be removed)", function () {
        sap.ushell.bootstrap("local").done(function () {
            //test data
            var oMessage = getServiceRequestMessage({
                    service : "sap.ushell.services.ShellUIService.setTitle",
                    body: {
                        sTitle:  "Purchase Order"
                    }
                }),
                oMessageData = JSON.parse(oMessage.data),
                oSetTitleStub = sinon.stub();

            // test preparation
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container.ApplicationContainer.prototype, "_isTrustedPostMessageSource").returns(true);

            sinon.stub(oAppContainer, "getShellUIService").returns({
                setTitle: oSetTitleStub
            });

            // simulate event
            oAppContainer._handleServiceMessageEvent(oAppContainer, oMessage, oMessageData);

            // check result
            deepEqual(oSetTitleStub.args[0], [oMessageData.body.sTitle] , "setTitle method of public service called with proper arguments");
            deepEqual(oMessage.source.postMessage.args[0], [JSON.stringify({
                type: "response",
                service: oMessageData.service,
                request_id: oMessageData.request_id,
                status: "success",
                body: {}
            }), oMessage.origin], " proper args");
        });
    });

    ["NWBC", "TR"].forEach(function (sNwbcLikeApplicationType) {
        asyncTest("ApplicationContainer localStorage eventing", function () {
            sap.ushell.bootstrap("local").done(function () {
                var oContentWindow = {
                        postMessage: sinon.spy(function (sMessage, sOrigin) {
                            start();
                            strictEqual(JSON.parse(sMessage).action, "pro54_getGlobalDirty",
                                sNwbcLikeApplicationType + ".getGlobalDirty fired");
                        })
                    },
                    oLogMock = sap.ushell.test.createLogMock()
                        .filterComponent("sap.ushell.components.container.ApplicationContainer")
                        .debug("getGlobalDirty() send pro54_getGlobalDirty ",
                                null,
                                "sap.ushell.components.container.ApplicationContainer"),
                    sStorageKey,
                    oStorageEvent = document.createEvent("StorageEvent");

                oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType[sNwbcLikeApplicationType]);

                sStorageKey = oAppContainer.globalDirtyStorageKey;

                sinon.stub(oAppContainer, "getDomRef", function () {
                    return {
                        contentWindow: oContentWindow,
                        tagName: "IFRAME"
                    };
                });

                renderInternallyAndExpectIFrame(oAppContainer,
                        oAppContainer.getApplicationType(),
                        'http://anyhost:1234/sap/bc/ui2/' + sNwbcLikeApplicationType + '/~canvas?sap-client=120', "additionalInfo");


                oStorageEvent.initStorageEvent("storage", false, false, sStorageKey, "", "PENDING",
                    "", localStorage);

                sinon.spy(sap.ushell.utils, "localStorageSetItem");
                sinon.stub(Storage.prototype, "getItem").returns("PENDING");

                // code under test
                dispatchEvent(oStorageEvent);
                ok(oContentWindow.postMessage.calledOnce);
                oLogMock.verify();

            });
        });
    });

    //TODO add new HTML5 property seamless?!
}());
