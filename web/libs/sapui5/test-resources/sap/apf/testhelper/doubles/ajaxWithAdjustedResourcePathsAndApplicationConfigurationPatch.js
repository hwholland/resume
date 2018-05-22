(function() {
	'use strict';

	jQuery.sap.declare('sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch');

	sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch = function (oConfig) {
		var sUrl = oConfig.url;

		function determineHrefPrefixBeforeTestResources() {
			var sHref = jQuery(location).attr('href');
			sHref = sHref.replace(location.protocol + "//" + location.host, "");
			return sHref.slice(0, sHref.indexOf("test-resources"));
		}

		if (sUrl.search('/apf-test/test-resources') > -1) {
			var prefix = determineHrefPrefixBeforeTestResources();
			sUrl = sUrl.replace(/\/apf-test\//g, prefix);
		}
		oConfig.url = sUrl;

		if (oConfig.success) {
			var fnOriginalSuccess = oConfig.success;
			oConfig.success = function(oData, sStatus, oJqXHR) {
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var prefix = determineHrefPrefixBeforeTestResources();
					sResponse = sResponse.replace(/\/apf-test\//g, prefix);
					oData = JSON.parse(sResponse);
				}
				fnOriginalSuccess(oData, sStatus, oJqXHR);
			};
		}
		jQuery.ajax(oConfig);
	};
}());



