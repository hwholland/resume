/*global sap, jQuery, sinon, OData */
(function() {
	'use strict';
	jQuery.sap.declare('sap.apf.integration.withDoubles.helper');

	if (!sap.apf.integration.withDoubles.helper) {
		sap.apf.integration.withDoubles.helper = {};
		/**
		 * save all constructor functions, that are overwritten
		 */
		sap.apf.integration.withDoubles.helper.saveConstructors = function() {
			sap.apf.integration.withDoubles.helper.saveContainer = {};
			var o = sap.apf.integration.withDoubles.helper.saveContainer;
			o.fnAjax = sap.apf.core.ajax;
			o.fnMetadata = sap.apf.core.Metadata;
			o.fnSessionHandler = sap.apf.core.SessionHandler;
			o.fnRequest = sap.apf.core.Request;
			o.fnResourcePathHandler = sap.apf.core.ResourcePathHandler;
			o.fnUiInstance = sap.apf.ui.Instance;
			o.fnStartParameter = sap.apf.utils.StartParameter;
			o.fnStartFilterHandler = sap.apf.utils.StartFilterHandler;
			o.fnMessageCallbackForStartup = sap.apf.messageCallbackForStartup;
		};
		/**
		 * restore the constructor functions. This must be called in every tear down, whenever constructors have been overwritten in test setup
		 */
		sap.apf.integration.withDoubles.helper.restoreConstructors = function() {
			var o = sap.apf.integration.withDoubles.helper.saveContainer;
			sap.apf.core.SessionHandler = o.fnSessionHandler;
			sap.apf.core.Request = o.fnRequest;
			sap.apf.core.ResourcePathHandler = o.fnResourcePathHandler;
			sap.apf.core.Metadata = o.fnMetadata;
			sap.apf.core.ajax = o.fnAjax;
			sap.apf.ui.Instance = o.fnUiInstance;
			sap.apf.utils.StartParameter = o.fnStartParameter;
			sap.apf.utils.StartFilterHandler = o.fnStartFilterHandler;
			sap.apf.messageCallbackForStartup = o.fnMessageCallbackForStartup;
			sap.apf.integration.withDoubles.helper.saveContainer = undefined;
		};

	}
}());
