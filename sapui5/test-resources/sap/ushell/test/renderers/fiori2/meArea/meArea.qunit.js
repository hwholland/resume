// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.AnchorItem
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ui.core.Icon");

    var oController;
    function createView() {
        var oView = sap.ui.view("meArea", {
            viewName: "sap.ushell.renderers.fiori2.meArea.MeArea",
            type: 'JS',
            viewData: {}
        });
        oController = oView.getController();
        return oView;
    }
    module("sap.ushell.renderers.fiori2.meArea.MeArea", {
        setup: function () {
            sap.ushell.bootstrap('local');
            oController = sap.ui.controller("sap.ushell.renderers.fiori2.meArea.MeArea");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oController.destroy();
            delete sap.ushell.Container;
        }
    });

    test("create content: There's no user image", function (){
        //mock data to create view
        var oContainer = {
              getUser: function (){
                  return {
                      getFullName: function () {
                          return true;
                      },
                      getImage: function () {
                          return false;
                      }
                  };
              }
            };
        var origContainer = sap.ushell.Container;
        sap.ushell.Container = oContainer;

        //spy
        var iconSpy = sinon.spy(sap.ui.core,"Icon");

        //create view
        var oMeAreaView = createView();

        //assert
        ok(iconSpy.calledOnce,"Icon created");

        //restore & destroy
        sap.ushell.Container = origContainer;
        oMeAreaView.destroy();
        iconSpy.restore();

    });

    test("create content: There is user image", function (){

        //mock data to create view
        var oContainer = {
              getUser: function (){
                  return {
                      getFullName: function () {
                          return true;
                      },
                      getImage: function () {
                          return "str";
                      }
                  };
              }
            };
        var origContainer = sap.ushell.Container;
        sap.ushell.Container = oContainer;

        //spy
        var imageSpy = sinon.spy(sap.m,"Image");

        //create view
        var oMeAreaView = createView();

        //assert
        ok(imageSpy.calledOnce,"Image created");

        //restore & destroy
        sap.ushell.Container = origContainer;
        oMeAreaView.destroy();
        imageSpy.restore();

    });

    test('test generic press handler for actions added once', function () {
        var oView = createView();

        ok(!oController._getControlsWithPressHandler().length, 'after controller init list of controls ' +
            'with press handler is empty');
        var oControl1 = new sap.m.Button('someId');
        var attachPressStub = sinon.stub(oControl1, 'attachPress');

        oController._addPressHandlerToActions(oControl1);
        ok(attachPressStub.calledOnce, 'attach press is called after first call to _addPressHandlerToActions');

        oController._addPressHandlerToActions(oControl1);
        ok(attachPressStub.calledOnce, 'attach press is not called after second call to _addPressHandlerToActions');
        ok(oController._getControlsWithPressHandler().length === 1, 'list of controls with press handlers is updated');

        attachPressStub.restore();
        oControl1.destroy();
        oView.destroy();
    });

    test('test generic press calls viewport switch state', function () {
        var oView = createView();
        var oControl1 = new sap.m.Button('someId');
        var switchStateStub = sinon.stub();
        var getCoreStub = sinon.stub(sap.ui, 'getCore').returns({
            byId: function () {
                return {
                    switchState: switchStateStub
                }
            }
        });

        oController._addPressHandlerToActions(oControl1);
        oController._addPressHandlerToActions(oControl1);
        oControl1.firePress();
        ok(switchStateStub.calledOnce, 'switch state is called when press event is fired');

        getCoreStub.restore();
        oControl1.destroy();
        oView.destroy();
    });
}());
