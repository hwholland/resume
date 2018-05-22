/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.evaluation.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// extent of sap.ca.scfld.md.ComponentBase
sap.ca.scfld.md.ComponentBase.extend("sap.suite.ui.smartbusiness.designtime.evaluation.Component", {
       metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
              "name": "Fullscreen Sample",
              "version" : "1.0.0-SNAPSHOT",
              "library" : "sap.suite.ui.smartbusiness.designtime.evaluation",
              "includes" : ["../../lib/Util.js","../../lib/OData.js","../../Adapter.js"],
              "dependencies" : {
                     "libs" : ["sap.m"],
                     "components" : [],
              },
              "config" : {
              	"resourceBundle" : "i18n/i18n.properties",
          			"titleResource" : "FULLSCREEN_TITLE",
          			"icon" : "sap-icon://Fiori5/F0822",
          			"favIcon" : "../../../../../../../resources/sap/ca/ui/themes/base/img/favicon/F0822_Create_Evaluation.ico",
          			"homeScreenIconPhone" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0822_Create_Evaluation/57_iPhone_Desktop_Launch.png",
          			"homeScreenIconPhone@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0822_Create_Evaluation/114_iPhone-Retina_Web_Clip.png",
          			"homeScreenIconTablet" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0822_Create_Evaluation/72_iPad_Desktop_Launch.png",
          			"homeScreenIconTablet@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0822_Create_Evaluation/144_iPad_Retina_Web_Clip.png",
          			"startupImage320x460" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
          			"startupImage640x920" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
          			"startupImage640x1096" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
          			"startupImage768x1004" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
          			"startupImage748x1024" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
          			"startupImage1536x2008" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
          			"startupImage1496x2048" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
              },
              viewPath : "sap.suite.ui.smartbusiness.designtime.evaluation.view",
              fullScreenPageRoutes : {
                     // fill the routes to your full screen pages in here.
                     "fullscreen" : {
                           "pattern" : "",
                           "view" : "S1"
                     },
                     "addEvaluation" : {
                           "pattern" : "addEvaluation/{indicatorContext}",
                           "view" : "S1"
                     },
                     "editEvaluation" : {
                           "pattern" : "editEvaluation/{indicatorContext}/{evaluationContext}",
                           "view" : "S1"
                     },
                     "duplicateEvaluation" : {
                         "pattern" : "duplicateEvaluation/{indicatorContext}/{evaluationContext}",
                         "view" : "S1"
                     },
                     "editEvaluationDraft" : {
                         "pattern" : "editEvaluationDraft/{indicatorContext}/{evaluationContext}",
                         "view" : "S1"
                     },
              //     "subscreen" : {
              //            "pattern" : "second",
              //            "view" : "S2"
              //     }
              },
       }),    

       /**
       * Initialize the application
       * 
        * @returns {sap.ui.core.Control} the content
       */
       createContent : function() {
              var oViewData = {component: this};
              jQuery.sap.require("sap.ca.ui.utils.Lessifier");
              sap.ca.ui.utils.Lessifier.lessifyCSS("sap.suite.ui.smartbusiness.designtime.evaluation", "view/thresholdAndTargetBar.css"); 
              return sap.ui.view({
                     viewName : "sap.suite.ui.smartbusiness.designtime.evaluation.Main",
                     type : sap.ui.core.mvc.ViewType.XML,
                     viewData : oViewData
              });
       }
});
