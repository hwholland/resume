/**
 * Handles all communication to/from a Redis database, including managing the
 * connections and sessions.
 *
 * @class      solo.db.Redis
 */

function Redis() {
    'use strict';
}

/**
 * Initiates a new connection to a specific Redis instance.
 *
 * @method     connect
 * @memberof   solo.db.Redis
 *
 * @param      {int}  instance  The instance
 * @return     {Object}  Instance of the Redis client by which a connection has
 *                       been initialized
 */
Redis.prototype.connect = function(instance) {
    'use strict';
    return (new Promise((resolve, reject) => {
        this.connection = require("redis").createClient({
            //host: "10.0.0.42"
        });
        this.connection.select(instance, function(err) {
            if (err) {
                reject(err);
            }
        });
        resolve(this.connection.on("error", function(err) {
            console.log("Error " + err);
        }));
    }));
};

Redis.prototype.quit = function() {
    console.log("redis --> quit");
    'use strict';
    var that = this;
    return (new Promise((resolve, reject) => {
        resolve(that.connection.quit());
    }));
};

/**
 * Increments a string in the Redis, which serves as a primary key.
 *
 * @method     incr
 * @memberof   solo.db.Redis
 *
 * @param      {String}  sKey    The Redis string (key) to increment
 * @return     {String}  The incremented value.
 */
Redis.prototype.incr = function(sKey) {
    'use strict';
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.incr(sKey, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Increments a string in the Redis by a certain amount
 *
 * @method     incrbyfloat
 * @memberof   solo.db.Redis
 *
 * @param      {String}  sKey    The Redis string (key) to increment
 * @return     {String}  The incremented value.
 */
Redis.prototype.incrbyfloat = function(sKey, sValue) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.incrbyfloat(sKey, sValue, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Saves an object (dataset) in the Redis as a hash.
 *
 * @method     hmset
 * @memberof   solo.db.Redis
 *
 * @param      {String}  sHash   The name of the Redis key (location) where
 *                               the hash (record) should be stored
 * @param      {Object}  oData   The object containing the data to be stored in
 *                               the Redis hash
 * @return     {String}  Returns "OK" in the event of a successful commit
 */
Redis.prototype.hmset = function(sHash, oData) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.hmset(sHash, oData, function(error, response) {
            if (response === "OK") {
                resolve(response);
            }
            if (error !== null) {
                reject(error);
            }
            resolve(response);
        });
    }));
};

/**
 * Retrieves an object from a hash in the Redis.
 *
 * @method     hgetall
 * @memberof   solo.db.Redis
 *
 * @param      {String}  sHash   The Redis hash to rerieve
 * @return     {Object}  JavaScript object containing all properties associated
 *                       with the hash
 */
Redis.prototype.hgetall = function(sHash) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.hgetall(sHash, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

Redis.prototype.hget = function(sHash, sField) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.hget(sHash, sField, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

Redis.prototype.zadd = function(sLog, sTime, sValue) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.zadd(sLog, sTime, sValue, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Inserts a unqiue value into a set in the Redis.
 *
 * @method     sadd
 * @memberof   solo.db.Redis
 *
 * @param      {String}   sSet    The name of the set
 * @param      {String}   sValue  The actual value to be inserted
 * @return     {Promise}  { description_of_the_return_value }
 */
Redis.prototype.sadd = function(sSet, sValue) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.sadd(sSet, sValue, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Retrievs all 'members' (keys) assigned to a given set.
 *
 * @method     smembers
 * @memberof   solo.db.Redis
 *
 * @param      {String}   sSet    The name of the set
 * @return     {Promise}  { description_of_the_return_value }
 */
Redis.prototype.smembers = function(sSet) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.smembers(sSet, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Inserts a unqiue value into a list in the Redis.
 *
 * @method     rpush
 * @memberof   solo.db.Redis
 *
 * @param      {String}   sList    The name o1f the list
 * @param      {String}   sValue  The actual value to be inserted
 * @return     {Promise}  { description_of_the_return_value }
 */
Redis.prototype.rpush = function(sList, sValue) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.rpush(sList, sValue, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

/**
 * Retrieves all values from a list in the Redis
 *
 * @method     lrange
 * @memberof   solo.db.Redis
 *
 * @param      {String}   sList    The name of the list
 * @param      {String}   sValue  The actual value to be inserted
 * @return     {Promise}  { description_of_the_return_value }
 */
Redis.prototype.lrange = function(sList) {
    var that = this;
    return (new Promise((resolve, reject) => {
        that.connection.lrange(sList, 0, -1, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }));
};

module.exports = Redis;