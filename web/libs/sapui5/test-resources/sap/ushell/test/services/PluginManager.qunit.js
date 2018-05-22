// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.PluginManager
 */
(function () {
    "use strict";

    /*jslint nomen: true, sub: true*/
    /*global asyncTest, deepEqual, equal, strictEqual, module, ok, parseInt, start,
      stop, sinon, jQuery, sap, window */

    jQuery.sap.require("sap.ushell.utils");
    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.PluginManager");

    module("sap.ushell.services.PluginManager", {
        setup : function () {
        },
        teardown : function () {
            sap.ushell.test.restoreSpies(
                sap.ui.component
            );
            delete sap.ushell.Container;
        }
    });

    asyncTest("constructor, method signatures", function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            start();
            var oPluginManager = sap.ushell.Container.getService("PluginManager");

            [
                "registerPlugins",
                "getSupportedPluginCategories",
                "getRegisteredPlugins",
                "loadPlugins",
                "_handlePluginCreation",
                "_instantiateComponent"
            ].forEach(function (sFunctionName) {
                equal(typeof oPluginManager[sFunctionName], "function", "function " + sFunctionName + " present");
            });
        });
    });

    [
        {
            "sDescription": "Empty set of plugins",
            "oPlugins": {},
            "oExpectedPluginCollection": {
                "RendererExtensions": {},
                "UserDefaults": {}
            }
        },
        {
            "sDescription": "Undefined set of plugins",
            "oPlugins": undefined,
            "oExpectedPluginCollection": {
                "RendererExtensions": {},
                "UserDefaults": {}
            },
            "bConsoleLogExpected": false
        },
        {
            "sDescription": "Only plugins without a configuration",
            "oPlugins": {
                "testPlugin1": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component"
                },
                "testPlugin2": {
                    "component": "sap.test.TestComponent2",
                    "url": "/sap/test/url/to/Component2"
                }
            },
            "oExpectedPluginCollection": {
                "RendererExtensions": {
                    "testPlugin1": {
                        "component": "sap.test.TestComponent",
                        "url": "/sap/test/url/to/Component"
                    },
                    "testPlugin2": {
                        "component": "sap.test.TestComponent2",
                        "url": "/sap/test/url/to/Component2"
                    }
                },
                "UserDefaults": {}
            }
        },
        {
            "sDescription": "Only plugins having a supported sap-ushell-plugin-type parameter set",
            "oPlugins": {
                "testPlugin1": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                },
                "testPlugin2": {
                    "component": "sap.test.TestComponent2",
                    "url": "/sap/test/url/to/Component2",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                }
            },
            "oExpectedPluginCollection": {
                "RendererExtensions": {
                    "testPlugin1": {
                        "component": "sap.test.TestComponent",
                        "url": "/sap/test/url/to/Component",
                        "config": {
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    }
                },
                "UserDefaults": {
                    "testPlugin2": {
                        "component": "sap.test.TestComponent2",
                        "url": "/sap/test/url/to/Component2",
                        "config": {
                            "sap-ushell-plugin-type": "UserDefaults"
                        }
                    }
                }
            }
        },
        {
            "sDescription": "Only plugins having an unsupported sap-ushell-plugin-type parameter set",
            "oPlugins": {
                "testPlugin1": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "AnotherInvalidType"
                    }
                },
                "testPlugin2": {
                    "component": "sap.test.TestComponent2",
                    "url": "/sap/test/url/to/Component2",
                    "config": {
                        "sap-ushell-plugin-type": "AnotherInvalidType"
                    }
                }
            },
            "oExpectedPluginCollection": {
                "RendererExtensions": {},
                "UserDefaults": {}
            }
        },
        {
            "sDescription": "Mix of plugins with unsupported or supported sap-ushell-plugin-type's",
            "oPlugins": {
                "testPlugin1": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "AnotherInvalidType"
                    }
                },
                "testPlugin2": {
                    "component": "sap.test.TestComponent2",
                    "url": "/sap/test/url/to/Component2",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                },
                "testPlugin3": {
                    "component": "sap.test.TestComponent3",
                    "url": "/sap/test/url/to/Component3",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                }
            },
            "oExpectedPluginCollection": {
                "RendererExtensions": {
                    "testPlugin3": {
                        "component": "sap.test.TestComponent3",
                        "url": "/sap/test/url/to/Component3",
                        "config": {
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    }
                },
                "UserDefaults": {
                    "testPlugin2": {
                        "component": "sap.test.TestComponent2",
                        "url": "/sap/test/url/to/Component2",
                        "config": {
                            "sap-ushell-plugin-type": "UserDefaults"
                        }
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("registerPlugins: " + oFixture.sDescription, function () {
            sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
                start();
                var oPluginManager = sap.ushell.Container.getService("PluginManager");

                oPluginManager.registerPlugins(oFixture.oPlugins);

                deepEqual(oPluginManager.getRegisteredPlugins(), oFixture.oExpectedPluginCollection, "Correct plugins registered");
            });
        });
    });

    asyncTest("registerPlugins: Mix of plugins with plugins defined as modules, "
        + "unsupported or supported sap-ushell-plugin-type's for UI5 components", function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oJQuerySapRequireStub = sinon.stub(jQuery.sap, "require", function () {}),
                oPlugins = {
                    "testPlugin1": {
                        "component": "sap.test.TestComponent",
                        "url": "/sap/test/url/to/Component",
                        "config": {
                            "sap-ushell-plugin-type": "AnotherInvalidType"
                        }
                    },
                    "testPlugin2": {
                        "module": "sap.test.TestComponent2",
                        "url": "/sap/test/url/to/Component2"
                    },
                    "testPlugin3": {
                        "component": "sap.test.TestComponent3",
                        "url": "/sap/test/url/to/Component3",
                        "config": {
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    },
                    "testPlugin4": {
                        "module": "sap.test.TestComponent4",
                        "url": "/sap/test/url/to/Component4"
                    },
                    "testPlugin5": {
                        "component": "sap.test.TestComponent5",
                        "url": "/sap/test/url/to/Component5",
                        "config": {
                            "sap-ushell-plugin-type": "UserDefaults"
                        }
                    }
                },
                oExpectedPluginCollection = {
                    "RendererExtensions": {
                        "testPlugin3": {
                            "component": "sap.test.TestComponent3",
                            "url": "/sap/test/url/to/Component3",
                            "config": {
                                "sap-ushell-plugin-type": "RendererExtensions"
                            }
                        }
                    },
                    "UserDefaults": {
                        "testPlugin5": {
                            "component": "sap.test.TestComponent5",
                            "url": "/sap/test/url/to/Component5",
                            "config": {
                                "sap-ushell-plugin-type": "UserDefaults"
                            }
                        }
                    }
                };

            oPluginManager.registerPlugins(oPlugins);

            start();
            ok(oJQuerySapRequireStub.calledTwice, "The direct loading of two plugins defined as modules was triggered correctly");
            deepEqual(oPluginManager.getRegisteredPlugins(), oExpectedPluginCollection, "Correct plugins registered");
            jQuery.sap.require.restore();
        });
    });

    asyncTest("_handlePluginCreation: Plugins have same component (component gets loaded once and initialized thrice)", 4, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oInstantiateComponentStub,
                iCount = 0,
                aPromisesResolveOrder = [],
                aResolvedPromises = [];

            // slowest promise returned by first call of _instantiateComponent(),
            // because the component first needs to be loaded before it gets
            // initialized.
            aPromisesResolveOrder.push(
                    new Promise(function (resolve, reject) {
                        setTimeout(function() {
                            resolve();
                        }, 100);
                    })
            );

            // promise returned by second call of _instantiateComponent().
            // It resolves much faster, because the component is already loaded,
            // and only needs to be instantiated.
            aPromisesResolveOrder.push(
                    new Promise(function (resolve, reject) {
                        setTimeout(function() {
                            resolve();
                        }, 50);
                    })
            );

            // promise returned by third call of _instantiateComponent().
            // It resolves much faster, because the component is already loaded,
            // and only needs to be instantiated.
            aPromisesResolveOrder.push(
                    new Promise(function (resolve, reject) {
                        setTimeout(function() {
                            resolve();
                        }, 10);
                    })
            );

            // register plugins having the same component
            oPluginManager.registerPlugins({
                "testPlugin1": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                },
                "testPlugin2": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                },
                "testPlugin3": {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                }
            });

            // stub _instantiateComponent to return the respective promise depending
            // on each case defined in a correct resolve order
            oInstantiateComponentStub = sinon.stub(oPluginManager, "_instantiateComponent", function () {
                iCount++;
                if (iCount === 1) {
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets both loaded and instantiated.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    return aPromisesResolveOrder[iCount - 1];
                }

                if (iCount === 2) {
                    start();
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    return aPromisesResolveOrder[iCount - 1];
                }

                if (iCount === 3) {
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    deepEqual(aPromisesResolveOrder, aResolvedPromises, "Order of resolving the promises was correct");
                    oInstantiateComponentStub.restore();
                    return aPromisesResolveOrder[iCount - 1];
                }
            });

            Object.keys(oPluginManager.getRegisteredPlugins().RendererExtensions).forEach(function (sPluginName) {
                // function under test
                oPluginManager._handlePluginCreation("RendererExtensions", sPluginName, new jQuery.Deferred());
            });
        });
    });

    asyncTest("_instantiateComponent: sap.ui.component resolves, plugin promise resolves", 2, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPlugin = {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                },
                oPluginDeferred = new jQuery.Deferred(),
                oUi5ComponentLoaderStub;

        oUi5ComponentLoaderStub = sinon.stub(oUi5ComponentLoader, "createComponent", function () {
            var oCreateComponentDeferred = new jQuery.Deferred(),
                oLoadedComponent = {
                    "componentHandle": {
                        "componentOptions": {}
                    }
                };

            setTimeout(function () {
                start();
                oCreateComponentDeferred.resolve(oLoadedComponent);
                ok(oUi5ComponentLoaderStub.calledOnce, "createComponent of Ui5ComponentLoader was called once and resolved.");
                oUi5ComponentLoaderStub.restore();
            }, 0);

            return oCreateComponentDeferred.promise();
        });

        // function under test
        oPluginManager._instantiateComponent(oPlugin, oPluginDeferred);

        oPluginDeferred.promise()
            .done(function () {
                ok(true, "plugin promise was resolved correctly");
            }).fail(sap.ushell.test.onError);
        });
    });

    asyncTest("_instantiateComponent: sap.ui.component rejects, plugin promise rejects", 2, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPlugin = {
                    "component": "sap.test.TestComponent",
                    "url": "/sap/test/url/to/Component",
                    "config": {
                        "sap-ushell-plugin-type": "RendererExtensions"
                    }
                },
                oPluginDeferred = new jQuery.Deferred(),
                oUi5ComponentLoaderStub;

            oUi5ComponentLoaderStub = sinon.stub(oUi5ComponentLoader, "createComponent", function () {
                var oCreateComponentDeferred = new jQuery.Deferred();

                setTimeout(function () {
                    start();
                    oCreateComponentDeferred.reject();
                    ok(oUi5ComponentLoaderStub.calledOnce, "createComponent of Ui5ComponentLoader was called once and rejected.");
                    oUi5ComponentLoaderStub.restore();
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            // function under test
            oPluginManager._instantiateComponent(oPlugin, oPluginDeferred);

            oPluginDeferred.promise().done(function () {
                ok(false);
            }).fail(function () {
                ok(true, "plugin promise was rejected correctly");
            });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise - reject second promise", 2, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oTypeError = new TypeError("I fail on purpose!"),
                oPlugins;

            oPlugins = {
                "UserDefaultPlugin1" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample1",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                },
                "UserDefaultPlugin2" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample2",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                },
                "SomeOtherPlugin" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample3"
                }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = {
                        "componentHandle": {
                            "componentOptions": {}
                        }
                    };

                setTimeout(function () {
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                        oCreateComponentDeferred.reject(oTypeError);
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);

            oPluginManager.loadPlugins("UserDefaults")
                .done(sap.ushell.test.onError.bind(undefined, "Promise supposed to be rejected"))
                .fail(function (oError) {
                    start();
                    ok(true, "State of promise is 'rejected'!");
                    deepEqual(oError, oTypeError, "Received error matched expected error object!");
                    oUi5ComponentLoader.createComponent.restore();
            });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise - error thrown", 2, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oTypeError = new TypeError("I fail on purpose!"),
                oPromiseResolver = {},
                oPlugins;

                oPlugins = {
                    "UserDefaultPlugin1" : {
                        "component": "sap.ushell.services.DummyComponentPluginSample1",
                        "config": {
                            "sap-ushell-plugin-type": "UserDefaults"
                        }
                    },
                    "UserDefaultPlugin2" : {
                        "component": "sap.ushell.services.DummyComponentPluginSample2",
                        "config": {
                            "sap-ushell-plugin-type": "UserDefaults"
                        }
                    },
                    "SomeOtherPlugin" : {
                        "component": "sap.ushell.services.DummyComponentPluginSample3"
                    }
                };

                // we want to be able to resolve any promise given at any time
                sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                    var oCreateComponentDeferred = new jQuery.Deferred();
                    // special case: throw exception for second entry
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                        throw oTypeError;
                    }

                    oPromiseResolver[oConfig.ui5ComponentName] = {
                            "resolve": oCreateComponentDeferred.resolve,
                            "reject": oCreateComponentDeferred.reject
                    };

                    return oCreateComponentDeferred.promise();
                });

                oPluginManager.registerPlugins(oPlugins);

                oPluginManager.loadPlugins("UserDefaults")
                    .done(sap.ushell.test.onError.bind(undefined, "Promise supposed to be rejected"))
                    .fail(function (oError) {
                        start();
                        ok(true, "State of promise is 'rejected'!");
                        deepEqual(oError, oTypeError, "Received error matched expected error object!");
                        oUi5ComponentLoader.createComponent.restore();
                    });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise to wait for bootstrap promises", 1, function () {
        sap.ushell.bootstrap("local").fail(sap.ushell.test.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPlugins;

            oPlugins = {
                "UserDefaultPlugin1" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample1",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                },
                "UserDefaultPlugin2" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample2",
                    "config": {
                        "sap-ushell-plugin-type": "UserDefaults"
                    }
                },
                "SomeOtherPlugin" : {
                    "component": "sap.ushell.services.DummyComponentPluginSample3"
                }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = {
                        "componentHandle": {
                            "componentOptions": {}
                        }
                    };

                setTimeout(function () {
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample3") {
                        oCreateComponentDeferred.reject();
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);
            oPluginManager.loadPlugins("UserDefaults")
                .done(function () {
                    start();
                    ok(true, "State of UserDefaults promise is 'resolved'!");
                    oUi5ComponentLoader.createComponent.restore();
                }).fail(sap.ushell.test.onError);
        });
    });
}());
