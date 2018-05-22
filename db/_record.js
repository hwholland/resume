module.exports = {

    getQueue: function(oConfig) {
        var oQueue = [
            'getPrimaryKey',
            'setMasterList',
            'setHash',
            'getAttributes',
            'getPrimaryKey',
            'setHash',
            'setHistory'
            /*
            			{
            				queueName: 'master',
            				method: oConfig.method,
            				subject: oConfig.subject,
            				status: 'not started',
            				steps: {
            					list: [
            						'getPrimaryKey',
            						'setMasterList',
            						'setHash'
            					],
            					complete: [],
            					running: [],
            					remaining: []
            				}
            			}*/
            /*,
            			{
            				queueName: 'attribute',
            				method: oConfig.method,
            				subject: oConfig.subject,
            				status: 'not started',
            				steps: {
            					list: [
            						'getAttributes',
            						'getPrimaryKey',
            						'setHash',
            						'setHistory'
            					],
            					complete: [],
            					running: [],
            					remaining: []
            				}
            			}*/
        ];

        return (oQueue);
    },

    getPrimaryKey: function(oClient, oConfig) {
        var onResponse = function(sKey) {
            this.data.uId = this.config.subject + ":" + sKey;
            console.log(this.data);
        };
        return (new Promise((resolve, reject) => {
            resolve(oClient.incr(oConfig.subject));
        }).then(onResponse.bind(this)).catch((sMessage) => {
            console.log("error getting primary key: " + sMessage);
        }));
    },

    setMasterHash: function() {
        var pMasterHash = new Promise((resolve, reject) => {
            resolve(this.setMaster(this.redis, this.data));
        }).then((oResponse) => {
            console.log(oResponse);
        }).catch((sMessage) => {
            console.log("error calling method setMaster()");
        });
    },

    setHash: function() {
        console.log("setHash");
    }
}