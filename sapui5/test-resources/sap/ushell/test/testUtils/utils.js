// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous test utility functions.
 */

this.sap = this.sap || {};

(function () {
  "use strict";

  jQuery.sap.declare("sap.ushell.test.utils");
  jQuery.sap.require("sap.ushell.utils");
  /*global deepEqual jQuery ok sap start strictEqual, URI */

  // namespace "sap.ushell.test" *********************************************
  sap.ushell = sap.ushell || {};
  sap.ushell.test = sap.ushell.test || {};

  var fnErrorConstructor = sap.ushell.utils.Error;

  // window.onerror no longer necessary with QUnit

  /*
   * The standard error handler for test cases. Reports the error message.
   */
  sap.ushell.test.onError = function (sError) {
    start();
    ok(false, typeof sError === 'object' ? JSON.stringify(sError) : sError);
  };

  /*
   * Modifies the constructor of sap.ushell.utils.Error so that the component is mandatory.
   */
  sap.ushell.utils.Error = function (sMessage, sComponent) {
    if (!sComponent || typeof sComponent !== "string") {
      throw new Error("Missing component");
    }
    return fnErrorConstructor.apply(this, arguments);
  };
  sap.ushell.utils.Error.prototype = fnErrorConstructor.prototype;

  /*
   * Creates a mock object for tracing and assigns it to jQuery.sap.log.
   * Return an object to control the mock.
   */
  sap.ushell.test.createLogMock = function () {
    var aExpectedCalls = [],
      oOriginalLog = jQuery.sap.log,
      sWatchedComponent,
      bSloppy = false;

    /**
     * Checks whether one log call argument matches
     * @param {string} sActual
     *   the actual value
     * @param {string|RegExp} vExpected
     *   the expected value (either as string or as regular expression)
     * @returns {boolean}
     *   <code>true</code> if the actual value matches the expected value
     */
    function argumentMatches(sActual, vExpected) {
      return vExpected instanceof RegExp ? vExpected.test(sActual) : sActual === vExpected;
    }

    /**
     * Checks whether the actual log call arguments match the expected ones
     *
     * @param {array} aActual
     *   the arguments list of a log call
     * @param {string[]|RegExp[]} aExpected
     *   the array of expected arguments
     * @returns {boolean}
     *   <code>true</code> if the actual values matches the expected values
     */
    function argumentsMatch(aActual, aExpected) {
      var i;

      if (aActual.length !== aExpected.length) {
        return false;
      }
      for (i = 0; i < aActual.length; i += 1) {
        if (!argumentMatches(aActual[i], aExpected[i])) {
          return false;
        }
      }
      return true;
    }

    function record(sMethodName, aArguments) {
      aExpectedCalls.push({name: sMethodName, args: aArguments});
    }

    function replay(sMethodName, aArguments) {
      var oExpectedCall = aExpectedCalls.shift();

      if (oExpectedCall
          && sMethodName === oExpectedCall.name
          && argumentsMatch(aArguments, oExpectedCall.args)) {
        return;
      }
      if (bSloppy || (sWatchedComponent && sWatchedComponent !== aArguments[2])) {
        if (oExpectedCall) {
          aExpectedCalls.unshift(oExpectedCall);
        }
        return;
      }
      if (!oExpectedCall) {
        ok(false, "Unexpected call to method " + sMethodName + " with arguments "
          + Array.prototype.join.call(aArguments));
        return;
      }

      strictEqual(sMethodName, oExpectedCall.name, "Method name");
      deepEqual(aArguments, oExpectedCall.args, "Call to method " + sMethodName);
    }

    jQuery.sap.log = {
      trace: function () {
        replay("trace", arguments);
      },

      debug: function () {
        replay("debug", arguments);
      },

      error: function () {
        replay("error", arguments);
      },

      info: function () {
        replay("info", arguments);
      },

      // cf. sinon
      restore: function () {
        jQuery.sap.log = oOriginalLog;
      },

      warning: function () {
        replay("warning", arguments);
      },

      fatal: function () {
        replay("fatal", arguments);
      }
    };

    return {
      trace: function () {
        record("trace", arguments);
        return this;
      },

      debug: function () {
        record("debug", arguments);
        return this;
      },

      info: function () {
        record("info", arguments);
        return this;
      },

      error: function () {
        record("error", arguments);
        return this;
      },

      warning: function () {
        record("warning", arguments);
        return this;
      },

      fatal: function () {
        record("fatal", arguments);
        return this;
      },

      /**
       * Activates a filter for the given component. Only logs for that component are observed.
       *
       * @param {string} sComponentName
       *   the name of the component, <code>null</code> to switch the filter off (which is default)
       * @returns {object}
       *   this
       */
      filterComponent: function (sComponentName) {
        sWatchedComponent = sComponentName;
        return this;
      },

      /**
       * Turns the "sloppy" mode on as indicated. In "sloppy" mode, additional
       * calls to the mock are tolerated.
       *
       * @param {boolean} bNewSloppy
       *   new "sloppy" mode (default: true)
       * @returns {object}
       *   this
       */
      sloppy: function (bNewSloppy) {
        bSloppy = arguments.length > 0 ? bNewSloppy : true;
        return this;
      },

      verify: function () {
        if (jQuery.sap.log.restore) { // sometimes verify() is called twice...
          jQuery.sap.log.restore();
        }
        if (aExpectedCalls.length === 0) {
          ok(true, "Tracing is complete");
        } else {
          aExpectedCalls.forEach(function (oExpectedCall) {
            function format(oCall) {
              var aParts = [oCall.name, '('],
                i,
                sSep = '';
              for (i = 0; i < oCall.args.length; i += 1) {
                aParts.push(sSep, oCall.args[i]);
                sSep = ', ';
              }
              aParts.push(')');
              return aParts.join('');
            }
            ok(false, "Missing trace call: " + format(oExpectedCall));
          });
        }
      }
    };
  };


  /**
   * Restores all potential Sinon spies that are passed as arguments to the function. Additionally
   * restores the spies created via {@link sap.ushell.test.createLogMock()}.
   * @param {function} [fnPotentialSpy...]
   *   a potential spy to restore; nothing happens if the function is not spied upon
   */
  sap.ushell.test.restoreSpies = function () {

    function restoreSpy(fnPotentialSpy) {
      if (fnPotentialSpy && fnPotentialSpy.restore) {
        fnPotentialSpy.restore();
      }
    }

    var i;
    for (i = 0; i < arguments.length; i += 1) {
      restoreSpy(arguments[i]);
    }
    restoreSpy(jQuery.sap.log);   // see sap.ushell.test.createLogMock
  };

  /*
   * Returns the directory path of a resource file in which the function is called.
   * The function should not be called inside the elementary unit tests because this could lead to errors.
   * It should be called on the top.
   *
   * Remember: Defining a relative path inside a JavaScript file (myFile) is dangerous.
   * It then tries to load the desired resource relative to the html file which is embedding myFile in a script tag.
   */
  sap.ushell.test.getOwnScriptDirectory = function () {
      // get the URL of our own script; if included by ui2 qunitrunner, a global variable is filled
      var sOwnScriptUrl = window["sap-ushell-qunitrunner-currentTestScriptUrl"],
          oAllScripts,
          oOwnScript;

      if (!sOwnScriptUrl) {
          // no qunitrunner - expect direct embedding into HTML
          oAllScripts = window.document.getElementsByTagName('script');
          oOwnScript =  oAllScripts[oAllScripts.length - 1];
          sOwnScriptUrl = oOwnScript.src;
      }

      return new URI(sOwnScriptUrl).directory() + "/";
  };

}());