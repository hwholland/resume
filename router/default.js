module.exports = {
	metadata: function() {
		return ([
			{
				path: "/web",
				get: "redirectWeb"
			},
			{
				path: "/redis/incr/*",
				get: "redisIncrement"
			}
		]);
	},

    redirectWeb : function(req, res){
       res.redirect("/web/app.html");
    },

    redisIncrement: function(req, res) {
    	var sKey = req.params[0];
    	console.log(this.redis);
        var pPromise = new Promise((resolve, reject) => {
            resolve(this.redis.incr(sKey));

        }).then(function(oData) {
            res.send(oData.toString());
        });
    }
} 