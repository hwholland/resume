/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/XMLView","sap/ui/core/mvc/View","sap/ui/fl/registry/ChangeHandlerRegistration","sap/ui/fl/ChangePersistenceFactory"],function(X,V,C,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.fl",version:"1.38.33",dependencies:["sap.ui.core"],noLibraryCSS:true});if(X.registerPreprocessor){X.registerPreprocessor('controls',"sap.ui.fl.Preprocessor",true);}else{V._sContentPreprocessor="sap.ui.fl.PreprocessorImpl";}C.getChangeHandlersOfLoadedLibsAndRegisterOnNewLoadedLibs();a.registerManifestLoadedEventHandler();return sap.ui.fl;},true);
