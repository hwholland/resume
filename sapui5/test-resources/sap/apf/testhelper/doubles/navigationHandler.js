jQuery.sap.declare('sap.apf.testhelper.doubles.navigationHandler');

(function () {
	'use strict';

	sap.apf.testhelper.doubles.NavigationHandler = function(oInject){

		this.getNavigationTargets = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				global : [],
				stepSpecific : []
			});

			return deferred.promise();
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				navigationMode : "forward"
			});
			return deferred.promise();
		};
	};
}());