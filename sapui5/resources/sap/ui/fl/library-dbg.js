/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */

sap.ui.define(["sap/ui/core/mvc/XMLView",
		"sap/ui/core/mvc/View",
		"sap/ui/fl/registry/ChangeHandlerRegistration",
		"sap/ui/fl/ChangePersistenceFactory"
	],
	function(XMLView, View, ChangeHandlerRegistration, ChangePersistenceFactory) {
	"use strict";

	/**
	 * SAPUI5 library for UI Flexibility and Descriptor Changes and Descriptor Variants.
	 *
	 * @namespace
	 * @name sap.ui.fl
	 * @author SAP SE
	 * @version 1.38.33
	 * @private
	 * @sap-restricted
	 *
	 */

	sap.ui.getCore().initLibrary({
		name:"sap.ui.fl",
		version:"1.38.33",
		dependencies:["sap.ui.core"],
		noLibraryCSS: true
	});

    if ( XMLView.registerPreprocessor ){
        // Register preprocessor for TINAF changes
        XMLView.registerPreprocessor('controls', "sap.ui.fl.Preprocessor", true);
    } else {
        //workaround solution until registerPreprocessor is available
        //PreprocessorImpl because in the workaround case there is no preprocessor base object
        View._sContentPreprocessor = "sap.ui.fl.PreprocessorImpl";
    }

	ChangeHandlerRegistration.getChangeHandlersOfLoadedLibsAndRegisterOnNewLoadedLibs();
	ChangePersistenceFactory.registerManifestLoadedEventHandler();

	return sap.ui.fl;

}, /* bExport= */ true);
