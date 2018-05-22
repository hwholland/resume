jQuery.sap.declare('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.core.messageObject');
jQuery.sap.require('sap.apf.core.messageDefinition');
/**
 * @description Constructor, simply clones the MessageHandler
 */
sap.apf.testhelper.doubles.MessageHandler = function() {
	'use strict';
	this.raiseOnCheck = function() {
        this.check = function(booleExpr, sMessage, sCode) {
			if (!booleExpr) {
				throw new Error(sMessage);
			}
		};
		return this;
	};
	/**
	* @description basic setup, when messaging is not tested
	*/
	this.doubleCheckAndMessaging = function() {

		this.raiseOnCheck();
		
		this.loadMessageConfiguration = function() {
		};

		this.createMessageObject = function(oConfig) {
			return new sap.apf.core.MessageObject(oConfig);
		};
		this.putMessage = function(oMessage) {

			throw new Error("error");

		};
		return this;
	};

	this.doubleGetConfigurationByCode = function() {
		var messageDefinitions = new sap.apf.utils.Hashtable(this);
		var i;
		for (i = 0; i < sap.apf.core.messageDefinition.length; i++) {
			messageDefinitions.setItem(sap.apf.core.messageDefinition[i].code, sap.apf.core.messageDefinition[i]);
		}

		this.getConfigurationByCode = function(code) {
			return messageDefinitions.getItem(code);
		};
	};

	this.supportLoadConfigWithoutAction = function() {
		this.loadConfig = function() {
		};
		return this;
	};
	this.spyPutMessage = function() {

		this.spyResults = {};

		this.createMessageObject = function(oConf) {
			return oConf;
		};
		this.putMessage = function(oMessageObject) {
			var spyResultsTmp;
			if (this.spyResults.putMessage) {
				if (jQuery.isArray(this.spyResults.putMessage)) {
					this.spyResults.putMessage.push(oMessageObject);
				} else {
					spyResultsTmp = this.spyResults.putMessage;
					this.spyResults.putMessage = [];
					this.spyResults.putMessage.push(spyResultsTmp, oMessageObject);
				}
			} else {
				this.spyResults.putMessage = oMessageObject;
			}
		};
		return this;
	};
};
sap.apf.testhelper.doubles.MessageHandler.prototype = new sap.apf.testhelper.interfaces.IfMessageHandler();
sap.apf.testhelper.doubles.MessageHandler.prototype.constructor = sap.apf.testhelper.doubles.MessageHandler;
