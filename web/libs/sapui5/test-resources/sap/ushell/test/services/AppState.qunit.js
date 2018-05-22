// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.AppState
 */
(function () {
    "use strict";

    /*jslint nomen: true, sub: true*/
    /*global asyncTest, deepEqual, equal, module, ok, parseInt, start,
      stop, test, sinon, jQuery, sap, window */

    jQuery.sap.declare("sap.ushell.adapters.mock.AppStateAdapter");
    jQuery.sap.require("sap.ushell.services.AppState");

    module("sap.ushell.services.AppState", {
        setup : function () {
            if (sap.ushell.services.AppState.WindowAdapter.prototype.data) {
                sap.ushell.services.AppState.WindowAdapter.prototype.data._clear();
            }
        },
        teardown : function () {
        }
    });

    /*
     * AppState Mock Adapter
     */
    sap.ushell.adapters.mock.AppStateAdapter = function () {
        this._oAppStateMap = new sap.ushell.utils.Map();
        this._oErrorMap = new sap.ushell.utils.Map();
    };

    sap.ushell.adapters.mock.AppStateAdapter.prototype.saveAppState = function (sKey, sSessionKey, sData, sAppname, sComponent) {
        var deferred = new jQuery.Deferred();
        if (!this._oErrorMap.containsKey(sKey)) {
            this._oAppStateMap.put(sKey, sData);
            deferred.resolve();
        } else {
            deferred.reject("Save of AppState failed");
        }
        return deferred.promise();
    };

    sap.ushell.adapters.mock.AppStateAdapter.prototype.loadAppState = function (sKey) {
        var deferred = new jQuery.Deferred();
        if (!this._oErrorMap.containsKey(sKey) && this._oAppStateMap.containsKey(sKey)) {
            deferred.resolve(sKey, this._oAppStateMap.get(sKey));
        } else {
            deferred.reject("Key not found");
        }
        return deferred.promise();
    };

    // after calling setData on an AppState instance, the set data was cloned and cannot be changed anymore
    test("constructor createEmptyAppState set get data, serialization", function () {
        var oService = new sap.ushell.services.AppState(),
            oAppState,
            data;
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
        oAppState = oService.createEmptyAppState();
        data = { a: 1, b : NaN };
        oAppState.setData(data);
        data.a = 2;
        deepEqual(oAppState.getData(), {a: 1, b : null}, "value serialization");
        equal(oAppState.getKey(), "AKEY", "key got");
    });

    test("constructor createEmptyAppState, method signatures", function () {
        var oService = new sap.ushell.services.AppState(),
            oAppState;
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
        oAppState = oService.createEmptyAppState();
        ["getKey", "setData", "getData", "save"].forEach(function (sFctName) {
            equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
        });
    });

    test("constructor createEmptyUnmodifiableAppState, method signatures", function () {
        var oService = new sap.ushell.services.AppState(),
            oAppState;
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
        oAppState = oService.createEmptyUnmodifiableAppState();
        ["getKey", "getData"].forEach(function (sFctName) {
            equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
        });
        ["setData", "save"].forEach(function (sFctName) {
            equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + "not present");
        });
    });

    asyncTest("constructor, getAppState, signature , get available Key", function () {
        var oService,
            oFakeAdapter;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        oFakeAdapter.saveAppState("ZKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oService.getAppState("ZKEY").done(function (oAppState) {
                start();
                deepEqual(oAppState.getKey(), "ZKEY", "key function ok");
                deepEqual(oAppState.getData(), { a : 1 }, "key function ok");
                equal(oAppState.save, undefined);
                equal(oAppState.setData, undefined);
                ["getKey", "getData"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
            }).fail(function () {
                start();
            });
        }).fail(function () {
            ok(false, "expect ok");
        });
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
    });


    asyncTest("constructor, initial keys, getAppState  read from window", function () {
        var oService,
            oFakeAdapter,
            spyLoad;
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter, undefined, undefined, { config : { initialAppStates : { "BKEY" : JSON.stringify({ a: 2})}}});
        spyLoad = sinon.spy(oFakeAdapter,"loadAppState");
        oService.getAppState("BKEY").done(function (oAppState) {
            start();
            deepEqual(oAppState.getKey(), "BKEY", "key function ok");
            deepEqual(oAppState.getData(), { a : 2 }, "value ok");
            equal(spyLoad.callCount,0, "loadAppState called once");
        }).fail(function () {
            start();
            ok(false," promise fullfilled");
        });
    });


    asyncTest("constructor, initial keys via promise getAppState  read from window", function () {
        var oService,
            oFakeAdapter,
            fnResolve,
            oInitialAppStatesPromise,
            spyLoad;
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oInitialAppStatesPromise = new Promise(function(resolve,reject) {
            fnResolve = resolve;
        });
        oService = new sap.ushell.services.AppState(oFakeAdapter, undefined, undefined, { config : {
            initialAppStatesPromise : oInitialAppStatesPromise }});
        spyLoad = sinon.spy(oFakeAdapter,"loadAppState");
        oService.getAppState("BKEY").done(function (oAppState) {
            deepEqual(oAppState.getKey(), "BKEY", "key function ok");
            deepEqual(oAppState.getData(), undefined, "value ok");
            equal(spyLoad.callCount, 1, "loadAppState called once");
            fnResolve({ "BKEY" : JSON.stringify({a:2})});
            // timeout as ES6 promise is always async!
            setTimeout(function () {
                oService.getAppState("BKEY").done(function(oAppState) {
                    start();
                    deepEqual(oAppState.getKey(), "BKEY", "key function ok");
                    deepEqual(oAppState.getData(), { a : 2 }, "value ok");
                    equal(spyLoad.callCount,1, "loadAppState called once");
                }).fail(function () {
                    start();
                    ok(false," promise fullfilled");
                });
            }, 0);
        }).fail(function () {
            start();
            ok(false," promise fullfilled");
        });
    });


    asyncTest("load present appstate, load again, 2nd served from cache!", function () {
        var oService,
            oFakeAdapter,
            spyLoad;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter);
        spyLoad = sinon.spy(oFakeAdapter,"loadAppState");
        oFakeAdapter.saveAppState("ZKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oService.getAppState("ZKEY").done(function (oAppState) {
                deepEqual(oAppState.getKey(), "ZKEY", "key function ok");
                deepEqual(oAppState.getData(), { a : 1 }, "key function ok");
                equal(oAppState.save, undefined);
                equal(oAppState.setData, undefined);
                ["getKey", "getData"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
                equal(spyLoad.callCount,1, "loadAppState called once");
                oService.getAppState("ZKEY").done(function(oAppState2) {
                    start();
                    deepEqual(oAppState2.getKey(), "ZKEY", "key function ok");
                    deepEqual(oAppState2.getData(), { a : 1 }, "key function ok");
                    equal(spyLoad.callCount,1, "loadAppState still caled once!");
                    spyLoad.restore();
                }).fail(function () {
                    start();
                    ok(false," promise fullfilled");
                });
            }).fail(function () {
                start();
                ok(false," promise fullfilled");
            });
        }).fail(function () {
            ok(false," promise fullfilled");
        });
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
    });

    asyncTest("constructor, getAppState, signature get Not available Key ", function () {
        var oService,
            oFakeAdapter;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        oFakeAdapter.saveAppState("NOKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oService.getAppState("BKEY").done(function (oAppState) {
                start();
                deepEqual(oAppState.getKey(), "BKEY", "key fct ok");
                deepEqual(oAppState.getData(), undefined, "key fct ok");
                equal(oAppState.save, undefined);
                equal(oAppState.setData, undefined);
                ["getKey", "getData"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "function", "function " + sFctName + "present");
                });
                ["setData", "save", "setItemValue", "getItemValue"].forEach(function (sFctName) {
                    equal(typeof oAppState[sFctName], "undefined", "function " + sFctName + " not  present");
                });
            }).fail(function () {
                start();
                ok(false, "expect ok");
            });
        }).fail(function () {});
        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
    });

    asyncTest("constructor createEmptyAppState, save", function () {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        oAppComponent = new sap.ui.core.UIComponent();
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        spy = sinon.spy(oFakeAdapter, "saveAppState");
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oAppState = oService.createEmptyAppState(oAppComponent);
            oAppState.setData({"a" : "b"});
            oAppState.save().done(function () {
                start();
                deepEqual(spy.args[1], ["AKEY", "AKEY", "{\"a\":\"b\"}", "sap.ui.core.UIComponent", ""], "arguments ok");
                ok(true, "save ok");
            }).fail(function () {
                start();
                ok(false, "expect ok");
            });
        }).fail(function () {});
    });

    asyncTest("constructor createEmptyAppState transient save", function () {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        oAppComponent = new sap.ui.core.UIComponent();
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        spy = sinon.spy(oFakeAdapter, "saveAppState");
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });
        oAppState = oService.createEmptyAppState(oAppComponent, true);
        oAppState.setData({"a" : "b"});
        oAppState.save().done(function () {
            equal(spy.called, false," adapter save not called");
            oService.getAppState("AKEY").done(function(oas) {
                start();
                deepEqual(oas.getData(), {"a" : "b"}, "data can be retrieved from window adapter");
            }).fail(function() {
                start();
                ok(false, "expect ok");
            });
            ok(true, "save ok");
        }).fail(function () {
            start();
            ok(false, "expect ok");
        });
    });

    asyncTest("constructor createEmptyAppState metadata extraction save", function () {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService,
            spy;
        oAppComponent = new sap.ui.core.UIComponent({ metadata : { "sap.app" : "xxx" }});
        sinon.stub(oAppComponent, "getMetadata").returns(
            { getManifest : function () { return { "sap.app":  { ach : "XX-UU" }}; },
              getName :  function() { return "myname"; }
            }
        );
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        spy = sinon.spy(oFakeAdapter, "saveAppState");
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oAppState = oService.createEmptyAppState(oAppComponent);
            oAppState.setData({"a" : "b"});
            oAppState.save().done(function () {
                start();
                deepEqual(spy.args[1], ["AKEY", "AKEY", "{\"a\":\"b\"}", "myname", "XX-UU"], "arguments ok");
                ok(true, "save ok");
            }).fail(function () {
                start();
                ok(false, "expect ok");
            });
        }).fail(function () {});
    });

    test("constructor createEmptyAppState, no component passed", function () {
        var oFakeAdapter,
            oService,
            cnt = 0;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        sinon.spy(oFakeAdapter, "saveAppState");
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });

        try {
            // undefined is ok!, but not ok on CrossApplcationNavigation (!!!)
            oService.createEmptyAppState(undefined);
            cnt = cnt + 1;
        } catch (ex) {
            ok(false, "should be ok");
        }
        try {
            // undefined is ok!, but not ok on CrossApplcationNavigation (!!!)
            oService.createEmptyAppState({});
            ok(false, "should be ok");
        } catch (ex2) {
            cnt = cnt + 1;
        }
        equal(cnt, 2, "Ran through relevant sections");
    });


    test("test LimitedBuffer", function () {
        var unused = new sap.ushell.services.AppState.WindowAdapter(undefined, undefined),
            cut = sap.ushell.services.AppState.WindowAdapter.prototype.data,
            i;

        unused = !unused; // eslint

        for (i = 0; i < 100; i = i + 1) {
            cut.addAsHead(String(i), String(2 * i));
        }
        for (i = 50; i < 100; i = i + 1) {
            deepEqual(cut.getByKey(String(i)), { key : String(i), value : String(2 * i)}, i + " found");
        }
        for (i = 0; i < 50; i = i + 1) {
            equal(cut.getByKey(String(i)), undefined,  i + "i no longer found");
        }
    });


    test("teset LimitedBuffer identical keys always last", function () {
        // when starting to overwrite with identical keys, aunusedays the last record is found
        var unused = new sap.ushell.services.AppState.WindowAdapter(undefined, undefined),
            cut = sap.ushell.services.AppState.WindowAdapter.prototype.data,
            i;

        unused = !unused; // eslint

        for (i = 0; i < 80; i = i + 1) {
            cut.addAsHead(String(i % 3), String(2 * i));
            deepEqual(cut.getByKey(String(i % 3)), { key : String(i % 3), value : String(2 * i)}, i + " last found");
        }
        for (i = 100; i < 146; i = i + 1) {
            cut.addAsHead(String(i), String(2 * i));
            equal(cut.getByKey(String(0)).value, String(156), i + " found");
            equal(cut.getByKey(String(1)).value, String(158), i + " found");
            equal(cut.getByKey(String(2)).value, String(154), i + " found");
        }
        cut.addAsHead(String(i), String(2 * i));
        deepEqual(cut.getByKey(String(0)), { key : "0", value : String(156)}, i + " 0 found");
        deepEqual(cut.getByKey(String(1)), { key : "1", value : String(158)}, i + " 1 found");
        deepEqual(cut.getByKey(String(2)), { key : "2", value : String(154)}, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        deepEqual(cut.getByKey(String(0)), { key : "0", value : String(156)}, i + " 0 found");
        deepEqual(cut.getByKey(String(1)), { key : "1", value : String(158)}, i + " 1 found");
        deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        deepEqual(cut.getByKey(String(0)), undefined, i + " 0 found");
        deepEqual(cut.getByKey(String(1)), { key : "1", value : String(158)}, i + " 1 found");
        deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
        i = i + 1;
        cut.addAsHead(String(i), String(2 * i));
        deepEqual(cut.getByKey(String(0)), undefined, i + " 0 found");
        deepEqual(cut.getByKey(String(1)), undefined, i + " 1 found");
        deepEqual(cut.getByKey(String(2)), undefined, i + " 2 found");
    });

    asyncTest("constructor createEmptyAppState, save fails", function () {
        var oAppState,
            oAppComponent,
            oFakeAdapter,
            oService;
        oAppComponent = new sap.ui.core.UIComponent();
        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        sinon.spy(oFakeAdapter, "saveAppState");
        oService = new sap.ushell.services.AppState(oFakeAdapter);

        sinon.stub(oService, "_getGeneratedKey", function () { return "AKEY"; });

        oFakeAdapter.saveAppState("AKEY", undefined, JSON.stringify({ a : 1 }), undefined, undefined).done(function () {
            oFakeAdapter._oErrorMap.put("AKEY", "AKEY");
            oAppState = oService.createEmptyAppState(oAppComponent);
            oAppState.setData({"a" : "b"});
            oAppState.save().done(function () {
                start();
                ok(false, "save ok");
                stop();
            }).fail(function () {
                start();
                ok(true, "expect ok");
            });
        }).fail(function () {});
    });


    test("Sequentializer", function () {
        var res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
            //= sap.ushell.services.AppState._getSequentializer();
        function fn(pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        // non sequentialized execution
        fn(p1).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f1");
        // non sequentialized execution
        fn(p2, true).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.resolve(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.resolve("k", "l");
        res.push("after p1 resolve");
        deepEqual(res, [
            "fn called undefined",
            "after f1",
            "fn called true",
            "after f2",
            "before p2 resolve",
            {
                "a": 1,
                "b": "j",
                "c": undefined,
                "status": "done c1"
            },
            "after p2 resolve",
            "before p1 resolve",
            {
                "a": "k",
                "b": "l",
                "c": undefined,
                "status": "done c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });

    test("With Sequentializer", function () {
        var oSequentializer,
            res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
        oSequentializer = sap.ushell.services.AppState._getSequentializer();
        function fn(pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        oSequentializer.addToQueue(fn.bind(undefined, p1)).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f1");
        oSequentializer.addToQueue(fn.bind(undefined, p2, true)).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.resolve(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.resolve("k", "l");
        res.push("after p1 resolve");
        deepEqual(res, [
            "fn called undefined",
            "after f1",
            "after f2",
            "before p2 resolve",
            "after p2 resolve",
            "before p1 resolve",
            {
                "a": "k",
                "b": "l",
                "c": undefined,
                "status": "done c1"
            },
            "fn called true",
            {
                "a": 1,
                "b": "j",
                "c": undefined,
                "status": "done c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });

    test("With Sequentializer reject", function () {
        var oSequentializer,
            res = [],
            p1 = new jQuery.Deferred(), // promise 1
            p2 = new jQuery.Deferred(); // promise 2
        oSequentializer = sap.ushell.services.AppState._getSequentializer();
        function fn(pro, a2) {
            res.push("fn called " + a2);
            return pro.promise();
        }
        oSequentializer.addToQueue(fn.bind(undefined, p1)).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f1");
        oSequentializer.addToQueue(fn.bind(undefined, p2, true)).done(function (a, b, c) {
            res.push({status : "done c1", a : a, b : b, c : c});
        }).fail(function (a, b, c) {
            res.push({status : "fail c1", a : a, b : b, c : c});
        });
        res.push("after f2");
        res.push("before p2 resolve");
        p2.reject(1, "j");
        res.push("after p2 resolve");
        res.push("before p1 resolve");
        p1.reject("k", "l");
        res.push("after p1 resolve");
        deepEqual(res, [
            "fn called undefined",
            "after f1",
            "after f2",
            "before p2 resolve",
            "after p2 resolve",
            "before p1 resolve",
            {
                "a": "k",
                "b": "l",
                "c": undefined,
                "status": "fail c1"
            },
            "fn called true",
            {
                "a": 1,
                "b": "j",
                "c": undefined,
                "status": "fail c1"
            },
            "after p1 resolve"
        ], "sequence ok");
    });


    test("SequentializingAdapter", function () {
        var oFakeAdapter,
            res = [],
            pSave = [ new jQuery.Deferred(), new jQuery.Deferred() ],
            pLoad = new jQuery.Deferred(),
            callCnt = -1,
            oAdapter;
        oFakeAdapter = {
            saveAppState : function () {
                callCnt = callCnt + 1;
                return pSave[callCnt];
            },
            loadAppState : function () {
                return pLoad;
            }
        };
        oAdapter = new sap.ushell.services.AppState.SequentializingAdapter(oFakeAdapter);
        sinon.spy(oFakeAdapter, "loadAppState");
        oAdapter.loadAppState("123");
        ok(oFakeAdapter.loadAppState.called, "load called");
        sinon.spy(oFakeAdapter, "saveAppState");
        oAdapter.saveAppState("aaa", "bbb", "ccc", "ddd", "eee").done(function (arg1, arg2) {
            res.push("save aaa done " + arg1);
        });
        oAdapter.saveAppState("bbb", "bbb", "ccc", "ddd", "eee").done(function (arg1, arg2) {
            res.push("save bbb done " + arg2);
        });
        pSave[1].resolve("resolved1", "resolved1");
        pSave[0].resolve("resolved0", "resolved0");
        equal(oFakeAdapter.saveAppState.callCount, 2, "save called");
        deepEqual(res, ["save aaa done resolved0", "save bbb done resolved1"]);
    });


    /*
     * Window Caching (saving an application state in the window object is tested implicitly)
     */


    asyncTest("getAppState scenario - found in window cache", function () {
        var oAppState,
            oFakeAdapter,
            oService,
            spySave,
            spyLoad;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter);
        // clear window cache initially
        sap.ushell.services.AppState.WindowAdapter.prototype.data._clear();

        sinon.stub(oService, "_getGeneratedKey", function () { return "FROMWINDOWCACHE"; });
        spyLoad = sinon.spy(oFakeAdapter, "loadAppState");
        spySave = sinon.spy(oFakeAdapter, "saveAppState");

        oAppState = oService.createEmptyAppState(new sap.ui.core.UIComponent());
        oAppState.setData({ a: 1, b : NaN });
        oAppState.save().done(function () {
            equal(spySave.callCount, 1, "AppState saved in window cache and in backend");
            oService.getAppState("FROMWINDOWCACHE").done(function (oAppState) {
                start();
                deepEqual(oAppState.getData(), {a: 1, b : null}, "correct data retrieved from window cache");
                equal(spyLoad.callCount, 0, "loadAppState of FakeAdapter was not called");
            }).fail(function () {});
        }).fail(function () {});
    });

    asyncTest("getAppState scenario - not found in window cache", function () {
        var oAppState,
            oFakeAdapter,
            oService,
            spySave,
            spyLoad;

        oFakeAdapter = new sap.ushell.adapters.mock.AppStateAdapter();
        oService = new sap.ushell.services.AppState(oFakeAdapter);
        // clear window cache initially
        sap.ushell.services.AppState.WindowAdapter.prototype.data._clear();

        sinon.stub(oService, "_getGeneratedKey", function () { return "FROMBACKEND"; });
        spyLoad = sinon.spy(oFakeAdapter, "loadAppState");
        spySave = sinon.spy(oFakeAdapter, "saveAppState");

        oAppState = oService.createEmptyAppState(new sap.ui.core.UIComponent());
        oAppState.setData({ a: 1, b : NaN });
        oAppState.save().done(function () {
            // clear window cache
            sap.ushell.services.AppState.WindowAdapter.prototype.data._clear();
            equal(spySave.callCount, 1, "AppState saved sucessfully");
            oService.getAppState("FROMBACKEND").done(function (oAppState) {
                start();
                deepEqual(oAppState.getData(), {a: 1, b : null}, "correct data retrieved from backend");
                equal(spyLoad.callCount, 1, "loadAppState of FakeAdapter was called");
            }).fail(function () {});
        }).fail(function () {});
    });
}());
