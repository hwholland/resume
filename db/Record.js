var redis = require('./Redis');
//var record = require('./record');

/**
 * A sequence of events must occur, differing based on the configuration.
 * (1) Record + Object
 *    -Get primary key (incr)
 *    -Add to master list (rpush)
 *    -Add to class list (rpush)
 *    -Store master object as databas hash (hmset)
 *    -Create and/or update database hash for each property of the data object, with the primary key + value pair.
 * 
 * @method Record
 * @param  {[type]} oConfig [description]
 * @param  {[type]} oData   [description]
 */
function Record(oConfig, oData, fnCallback) {
    'use strict';

    this.redis = new redis();
    this.config = oConfig;
    this.data = oData;
    this.callback = fnCallback;
    this.attributes = [];
    var that = this;
    
    //this.redis.connect(1);
    var pPromise = new Promise((resolve, reject) => {
        resolve(that.getRedis(that.redis));
    }).then(function(oClient) {
        that.execute(that.quitRedis);
    }).catch((sMessage) => {
    	console.log("error getting database client: " + sMessage);
    });
}

/**
 * [getRedis description]
 * @method getRedis
 * @param  {[type]} oRedis [description]
 * @return {[type]}        [description]
 */
Record.prototype.getRedis = function(oRedis) {
    return (new Promise((resolve, reject) => {
        //resolve(that.redis.incr(oConfig.subject));
        resolve(oRedis.connect(1));
    }).catch((sMessage) => {
    	console.log("error getting database connection: " + sMessage);
    }));
};

/**
 * [quitRedis description]
 * @method quitRedis
 * @return {[type]}  [description]
 */
Record.prototype.quitRedis = function() {
	//console.log("quitRedis");
	//console.log(this);

    //this.redis.quit();
    //console.log("client connection closed");
    this.callback({
    	data: this.data,
    	attributes: this.attributes
    });
};

/**
 * [getPrimaryKey description]
 * @method getPrimaryKey
 * @param  {[type]}      oClient [description]
 * @param  {[type]}      oConfig [description]
 * @return {[type]}              [description]
 */
Record.prototype.getPrimaryKey = function(oClient, oConfig) {
    var onResponse = function(sKey) {
    	this.data.uId = this.config.subject + ":" + sKey;
    };
    return (new Promise((resolve, reject) => {
        resolve(oClient.incr(oConfig.subject));
    }).then(onResponse.bind(this)).catch((sMessage) => {
    	console.log("error getting primary key: " + sMessage);
    }));
};

/**
 * [setMasterHash description]
 * @method setMasterHash
 * @param  {[type]}      oClient [description]
 * @param  {[type]}      oData   [description]
 */
Record.prototype.setMasterHash = function(oClient, oData) {
    return (new Promise((resolve, reject) => {
        resolve(oClient.hmset(oData.uId, oData));
    }).catch((sMessage) => {
    	console.log("error saving database hash: " + sMessage);
    }));
};

/**
 * [setMasterList description]
 * @method setMasterList
 * @param  {[type]}      oClient [description]
 * @param  {[type]}      oConfig [description]
 * @param  {[type]}      oData   [description]
 */
Record.prototype.setMasterList = function(oClient, oConfig, oData) {
    return (new Promise((resolve, reject) => {
        resolve(oClient.rpush(oConfig.subject + ":list", oData.uId));
    }).catch((sMessage) => {
    	console.log("error updating list with primary key: " + sMessage);
    }));
};

/**
 * [getHashField description]
 * @method getHashField
 * @param  {[type]}     oClient [description]
 * @param  {[type]}     sHash   [description]
 * @param  {[type]}     sField  [description]
 * @return {[type]}             [description]
 */
Record.prototype.getHashField = function(oClient, sHash, sField) {
    return (new Promise((resolve, reject) => {
        resolve(oClient.hget(sHash, sField));
    }).catch((sMessage) => {
    	console.log("error saving database hash: " + sMessage);
    }));
};

/**
 * [setHistory description]
 * @method setHistory
 * @param  {[type]}   oClient [description]
 * @param  {[type]}   sLog    [description]
 * @param  {[type]}   sTime   [description]
 * @param  {[type]}   sValue  [description]
 */
Record.prototype.setHistory = function(oClient, sLog, sTime, sValue) {
    return (new Promise((resolve, reject) => {
        resolve(oClient.zadd(sLog, sTime, sValue));
    }).catch((sMessage) => {
    	console.log("error saving database hash: " + sMessage);
    }));
};

/**
 * [setLog description]
 * @method setLog
 * @param  {[type]} oClient [description]
 * @param  {[type]} oData   [description]
 * @param  {[type]} sHash   [description]
 * @param  {[type]} sField  [description]
 */
Record.prototype.setLog = function(oClient, oData, sHash, sField) {
	var fnCreateLog = function(sValue) {
		var sLog = sHash + ":" + sField;
		if(sValue) {
			var sTime = Date.now();
			this.setHistory(oClient, sLog, sTime, sValue);
		}
		this.setMasterHash(oClient, oData);
	};
	var pCurrent = new Promise((resolve, reject) => {
		resolve(this.getHashField(oClient, sHash, sField));
	}).then(fnCreateLog.bind(this)).catch((sMessage) => {
		console.log("error calling getHashField(): " + sMessage);
	});
};

/**
 * [getAttributes description]
 * @method getAttributes
 * @param  {[type]}      oClient [description]
 * @param  {[type]}      oData   [description]
 * @return {[type]}              [description]
 */
Record.prototype.getAttributes = function(oClient, oData) {
    return (new Promise((resolve, reject) => {
        var aProperties = Object.getOwnPropertyNames(oData);
        for(var i = 0; i < aProperties.length; i++) {
        	if(aProperties[i] !== 'uId') {
        		var sProperty = aProperties[i];
        		var sValue = oData[sProperty];
        		var oAttribute = {};
        		oAttribute[oData.uId] = sValue;
        		oAttribute.uId = sProperty;
        		this.attributes.push(oAttribute);
        		this.setLog(oClient, oAttribute, oAttribute.uId, oData.uId);
        	}
        }
        resolve(aProperties);
    }).catch((sMessage) => {
    	console.log("error getting attributes: " + sMessage);
    }));
};

/**
 * @method setQueue
 * @param  {[type]} oClient [description]
 * @param  {[type]} oConfig [description]
 * @param  {[type]} oData   [description]
 */
Record.prototype.setQueue = function(oClient, oConfig, oData) {
    //var aQueue = record.getQueue(oConfig);
    this.execute(oClient, oConfig, oData);
};

/**
 * [execute description]
 * @method execute
 * @param  {[type]} fnCallback [description]
 * @return {[type]}            [description]
 */
Record.prototype.execute = function(fnCallback) {
	var fnGetAttributes = function() {
		var pAttributeHash = new Promise((resolve, reject) => {
			resolve(this.getAttributes(this.redis, this.data));
		}).then(fnCallback.bind(this)).catch((sMessage) => {
			console.log("error calling method getAttributes()");
		});
	}
	var fnSetMaster = function() {
		var pMasterHash = new Promise((resolve, reject) => {
			resolve(this.setMasterHash(this.redis, this.data));
		}).catch((sMessage) => {
			console.log("error calling method setMasterHash()");
		});
		var pMasterList = new Promise((resolve, reject) => {
			resolve(this.setMasterList(this.redis, this.config, this.data));
		}).catch((sMessage) => {
			console.log("error calling method setMasterList()");
		});
		return(Promise.all([pMasterHash, pMasterList]).then(fnGetAttributes.bind(this)));
	}
	var pMasterKey = new Promise((resolve, reject) => {
    	resolve(this.getPrimaryKey(this.redis, this.config));
    }).then(fnSetMaster.bind(this)).catch((sMessage) => {
    	console.log("error calling method getPrimaryKey(): " + sMessage);
    });
};

module.exports = Record;