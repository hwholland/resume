var database = require('./Redis');

/**
 * Class for handling requests to view record(s) from the database.
 * (1) Does classification exists?
 *     (yes) Get list of subject + classification from database
 *     (no)  Get list of subject from the database
 * (2) For each value in the list, get the hash from the database
 * @class   solo.db.Entity
 * @param   {Object}    oConfig     Contains the subject and classification of the requested dataset
 * @param   {Function}  fnCallback  Callback function for returning the dataset
 */
function Entity(oConfig, fnCallback) {
    'use strict';

    this.database = new database();
    this.config = oConfig;
    this.callback = fnCallback;
    this.counter = 0;
    this.data = [];
    var that = this;

    var pPromise = new Promise((resolve, reject) => {
        resolve(that.getDatabaseConnection(that.database));
    }).then(function (oClient) {
        console.log("Entity");
        that.getList(that.database, that.config.subject + ":list", fnCallback);
    }).catch((sMessage) => {
        console.log("error getting database client: " + sMessage);
    });
}

/**
 * Gets an instance of the database client, and opens an active connection.
 * @method      getDatabaseConnection
 * @memberOf    solo.db.Entity 
 * @param   {Object}    oDatabase  Database class which can open a connection
 * @return  {Promise}   Promise object for the database client
 */
Entity.prototype.getDatabaseConnection = function (oDatabase) {
    return (new Promise((resolve, reject) => {
        resolve(oDatabase.connect(1));
    }).catch((sMessage) => {
        console.log("error getting database connection: " + sMessage);
    }));
};

/**
 * Closes the active database connection and returns any useful 
 * information via the callback function provided to the constructor
 * upon instantiation.
 * 
 * @method quitDatabase
 * @memberOf solo.db.Entity
 * @param {fnCallback} fnCallback [description]
 */
Entity.prototype.quitDatabase = function () {
    //this.database.quit();
    this.callback({
        data: this.data,
        attributes: this.attributes
    });
};

Entity.prototype.getHash = function (oClient, sHash) {
    var fnNext = function (oHash) {
        console.log(oHash);
        console.log(this.counter);
        this.data.push(oHash);
        this.counter--;
        if (this.counter === 0) {
            this.callback(this.data);
        }
    }
    return (new Promise((resolve, reject) => {
        resolve(oClient.hgetall(sHash));
    }).then(fnNext.bind(this)).catch((sMessage) => {
        console.log("error saving database hash: " + sMessage);
    }));
};

Entity.prototype.getList = function (oClient, sList, fnCallback) {
    var fnNext = function (aList) {
        console.log(aList);
        for (var i = 0; i < aList.length; i++) {
            this.counter++;
            this.getHash(oClient, aList[i]);
        }
        //fnCallback(aList);
    }
    return (new Promise((resolve, reject) => {
        resolve(oClient.lrange(sList));
    }).then(fnNext.bind(this)));
}

module.exports = Entity;