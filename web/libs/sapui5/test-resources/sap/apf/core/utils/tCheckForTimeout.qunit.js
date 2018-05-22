
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");

QUnit.module('Check Http Response for a Timeout', {
	beforeEach : function(assert) { this.checkForTimeout = sap.apf.core.utils.checkForTimeout; }
});


QUnit.test('Error status 303, 401 and 403', function( assert ) {
	//Error status for OData
	var aHeaders = [];
	aHeaders['x-sap-login-page'] = "url";
	
	var oMessage = this.checkForTimeout({
		status  : 200,
		headers : aHeaders 
	});
	assert.equal(oMessage.getCode(), '5021');
	
	oMessage = this.checkForTimeout({
		status : 303
	});
	assert.equal(oMessage.getCode(), '5021');

	oMessage = this.checkForTimeout({
		status : 401
	});
	assert.equal(oMessage.getCode(), '5021');

	oMessage = this.checkForTimeout({
		status : 403
	});
	assert.equal(oMessage.getCode(), '5021');

	//Error status for Ajax
	oMessage = this.checkForTimeout({
		response : {
			statusCode : 303
		}
	});
	assert.equal(oMessage.getCode(), '5021');

	oMessage = this.checkForTimeout({
		response : {
			statusCode : 401
		}
	});
	assert.equal(oMessage.getCode(), '5021');

	oMessage = this.checkForTimeout({
		response : {
			statusCode : 403
		}
	});
	assert.equal(oMessage.getCode(), '5021');
});

