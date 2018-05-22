// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Lifecycle.
 * Each test creates an FLP flow that should trigger a specific lifecycle event
 * and verifies if the event was indeed published, with the correct data.
 */
(function () {
    "use strict";
    /* global asyncTest, module, ok, start, stop, jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");
    jQuery.sap.require("sap.ushell.components.container.ApplicationContainer");

    var fnCallback;

    module("sap.ushell.renderers.fiori2.Lifecycle", {
        setup: function () {
            window.location.hash = "";
            sap.ushell.bootstrap("local");
            fnCallback = sinon.spy();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            fnCallback.restore,
            delete sap.ushell.Container;
        }
    });

    /**
     * Verify that the lifecycle event coreResourcesFullyLoaded is published.
     */
    asyncTest("coreResourcesFullyLoaded test", function () {
        var oRenderer,
            oView,
            fOrigStubLoadJSResourceAsync = jQuery.sap._loadJSResourceAsync,
            fStubLoadJSResourceAsync;

        // Subscribe for the relevant lifecycle event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "coreResourcesFullyLoaded", fnCallback, this);

        // During the flow that publishes the event coreResourcesFullyLoaded
        //  the core-ext-light.js resource is loaded
        // Since it should fail during QUnit test, but we want to to succeed -
        // we create this stub that prevents failure when "sap.fiori.core-ext-light is required,
        // and works as usual in all other require cases
        fStubLoadJSResourceAsync = sinon.stub(jQuery.sap, "_loadJSResourceAsync", function (sResourceName) {
            if (sResourceName === "sap/fiori/core-ext-light.js") {
                return new Promise(function(fnResolve, fnReject) {fnResolve()});
            } else {
                fOrigStubLoadJSResourceAsync.call(this, sResourceName);
            }
        });

        oRenderer = sap.ushell.Container.createRenderer("fiori2");

        // publish of contentRendered event should lead to core-ext loading
        sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");

        // Trying to prevent the fail_to_start_app_try_later popup window
        oView = sap.ui.getCore().byId("mainShell");
        oView.getController().delayedMessageError = sinon.spy();

        setTimeout(function () {
            // Lifecycle event callback should be called once
            ok(fnCallback.calledOnce, "sap.ushell.coreResourcesFullyLoaded published");
            start();
            oRenderer.destroy();
            fStubLoadJSResourceAsync.restore();
        }, 2000);
    });

    /**
     * Verify that the lifecycle event rendererLoaded is published with the correct renderer name
     */
    asyncTest("rendererLoaded test", function () {
        var oRenderer;

        // Subscribe for the relevant lifecycle event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "rendererLoaded", fnCallback, this);
        oRenderer = sap.ushell.Container.createRenderer("fiori2");

        // Trying to prevent the fail_to_start_app_try_later popup window
        // var oView = sap.ui.getCore().byId("mainShell");
        // oView.getController().delayedMessageError = sinon.spy();

        setTimeout(function () {
            // Lifecycle event callback should be called once
            ok(fnCallback.calledOnce, "Lifecycle event sap.ushell.rendererLoaded was published");
            ok(fnCallback.args[0][2].rendererName === "fiori2", "Correct renderer name passed in event data");
            start();
            oRenderer.destroy();
        }, 2000);
    });

    /**
     * Verify that the lifecycle event appOpened is published with the correct application data
     */
    asyncTest("openApp test", function () {
        var oController,
            myApplicationContainer,
            getAppContainerStub,
            oApplication = {
                applicationConfiguration: {configParam1 : "value1"},
                additionalInformation: "info1"
            };

        // This call should trigger appOpened event that triggers the lifecycle event sap.ushell.appOpened
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appOpened", fnCallback, this);
        jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
        myApplicationContainer = {
            onAfterRendering : function () {
                if (this.oEventDelegate && this.oEventDelegate.onAfterRendering){
                    this.oEventDelegate.onAfterRendering();
                }
            },
            exit : function () {
            },
            addEventDelegate: function(oEventDelegate){
                this.oEventDelegate = oEventDelegate;
            }
        };
        oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
        oController.oViewPortContainer = {
            getViewPortControl: function () {
                return null;
            },
            addCenterViewPort: function () {
                return null;
            }
        };

        oController.history = new sap.ushell.renderers.fiori2.History();
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
        getAppContainerStub = sinon.stub(oController, "_getAppContainer").returns(myApplicationContainer);
        oController.getWrappedApplication("test-intent", {title: "title"}, oApplication, "a", null);

        // This call should trigger the lifecycle event: sap.ushell.appOpened
        myApplicationContainer.onAfterRendering();

        setTimeout(function () {
            // Lifecycle event callback should be called once
            ok(fnCallback.calledOnce, "Lifecycle event sap.ushell.appOpened was published");
            ok(fnCallback.args[0][2].additionalInformation === "info1", "Correct additionalInformation passed in event data");
            ok(fnCallback.args[0][2].applicationConfiguration.configParam1 === "value1", "Correct configuration parameter passed in event data");
            start();
            getAppContainerStub.restore();
            oController.destroy();
        }, 2000);
    });

    /**
     * Verify that the lifecycle event appClosed is published with the correct application data
     */
    asyncTest("appClosed test", function () {
        var oController,
            myApplicationContainer,
            getAppContainerStub,
            oApplication = {
                applicationConfiguration: {configParam2 : "value2"},
                additionalInformation: "info2"
            };

        // Subscribe for the relevant lifecycle event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appClosed", fnCallback, this);

        jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
        myApplicationContainer = {
            onAfterRendering : function () {
                if (this.oEventDelegate && this.oEventDelegate.onAfterRendering){
                    this.oEventDelegate.onAfterRendering();
                }
            },
            exit : function () {
            },
            addEventDelegate: function(oEventDelegate){
                this.oEventDelegate = oEventDelegate;
            }
        };
        sap.m.BusyDialog.prototype.open = function () {
        };
        oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
        oController.oViewPortContainer = {
            getViewPortControl: function () {
                return null;
            },
            addCenterViewPort: function () {
                return null;
            }
        };

        getAppContainerStub = sinon.stub(oController, "_getAppContainer").returns(myApplicationContainer);

        oController.getWrappedApplication("test-intent", {title: "title"}, oApplication, "b", null);

        // This call should trigger appClosed event that triggers the lifecycle event sap.ushell.appClosed
        myApplicationContainer.exit();

        setTimeout(function () {
            // Lifecycle event callback should be called once
            ok(fnCallback.calledOnce, "Lifecycle event sap.ushell.appClosed was published");
            ok(fnCallback.args[0][2].additionalInformation === "info2", "Correct additionalInformation passed in event data");
            ok(fnCallback.args[0][2].applicationConfiguration.configParam2 === "value2", "Correct configuration parameter passed in event data");
            start();
            getAppContainerStub.restore();
            oController.destroy();
        }, 2000);
    });

    /**
     * Verify that the lifecycle event appComponentLoaded is published
     */
    asyncTest("appComponentLoaded test 0", function () {
        var oComponentObject,
            componentStub,
            oControl,
            oAppContainer = new sap.ushell.components.container.ApplicationContainer();

        // Subscribe for the relevant lifecycle event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", fnCallback, this);

        oAppContainer.setApplicationType(sap.ushell.components.container.ApplicationType.URL);
        oAppContainer.setUrl("http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&sap-xapp-state=1234242&bar=baz");
        oAppContainer.setAdditionalInformation("SAPUI5.Component=some.random.path");
        sinon.spy(sap.ushell.components.container.ApplicationContainer.prototype, "_destroyChild");

        oComponentObject = {
            getMetadata : function () {
                return {
                    getConfig : function () {
                        return {x : "y"};
                    }
                };
            }
        };
        componentStub = sinon.stub(sap.ui, "component", function () {
            return oComponentObject;
        });
        oControl = oAppContainer._createUi5Component(oAppContainer, oAppContainer.getUrl(), 'some.random.path');
        setTimeout(function () {
            // Lifecycle event callback should be called once
            ok(fnCallback.calledOnce, "sap.ushell.componentCreated published");
            start();
        }, 2000);
    });

}());
