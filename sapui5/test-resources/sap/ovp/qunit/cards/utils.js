(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("sap.ovp.test.qunit.cards.utils");

    sap.ovp.test.qunit.cards.utils = {};

    sap.ovp.test.qunit.cards.utils.testBaseUrl = jQuery.sap.getModulePath("sap.ovp.test") + "/";

    sap.ovp.test.qunit.cards.utils.odataBaseUrl_salesOrder = sap.ovp.test.qunit.cards.utils.testBaseUrl + "data/salesorder/";
    sap.ovp.test.qunit.cards.utils.odataRootUrl_salesOrder = "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/";

    sap.ovp.test.qunit.cards.utils.odataBaseUrl_salesShare = sap.ovp.test.qunit.cards.utils.testBaseUrl + "data/salesshare/";
    sap.ovp.test.qunit.cards.utils.odataRootUrl_salesShare = "/sap/smartbusinessdemo/services/SalesShare.xsodata/";

    /**
     *
     * @param cardData
     * @returns {sap.ui.model.odata.v2.ODataModel}
     */
    sap.ovp.test.qunit.cards.utils.createCardModel = function (cardData) {
        var oModel = new sap.ui.model.odata.v2.ODataModel(
            cardData.dataSource.rootUri,
            {
                annotationURI: cardData.dataSource.annoUri,
                json: true,
                loadMetadataAsync: false
            }
        );

        return oModel;
    };

    sap.ovp.test.qunit.cards.utils.createCardView = function (cardData, oModel) {
        var oComponent = sap.ui.component({
            name: cardData.card.template,
            componentData: {
            getComponentData: function(){ 
                    return this; 
             },
            appComponent: {
                    containerLayout: "",
                    getModel: function(sDummy){
                           return { getProperty: function(){
                                  return [];
                                  }
                           };
                    },
                    getOvpConfig: function(){
                           return;
                    }
            },
                model: oModel,
                settings: cardData.card.settings
            }
        });

        return oComponent.getAggregation("rootControl");
    };

    /**
     * this function get the expected value and actual XML value and returns true if the XML value contains the
     * expected value passed. This check could be replaced with a tighter check, but it is currently enough
     * @param xmlPropertyValue
     * @param expectedPropertyValue
     * @returns {*}
     */
    sap.ovp.test.qunit.cards.utils.validateXMLValue = function(xmlPropertyValue, expectedPropertyValue) {
        if (expectedPropertyValue === null || expectedPropertyValue === undefined) {
            return xmlPropertyValue === null || xmlPropertyValue === undefined;
        } else if (typeof expectedPropertyValue === "string"){
            return expectedPropertyValue === xmlPropertyValue;
        } else if (typeof expectedPropertyValue.test === "function"){
            return expectedPropertyValue.test(xmlPropertyValue);
        } else {
            return false;
        }
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates description structure
     */
    sap.ovp.test.qunit.cards.utils.isValidSub = function (cardTestData, cardXml) {
        var subTitle = jQuery(cardXml).find('.sapOvpCardSubtitle');
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        if (!expectedHeaderRes.subTitle) {
            return (subTitle.length === 0);
        } else {
            if (subTitle.length === 1) {
                return sap.ovp.test.qunit.cards.utils.validateXMLValue(subTitle[0].getAttribute('text'), expectedHeaderRes.subTitle);
            }
        }
        return false;
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates title structure
     */
    sap.ovp.test.qunit.cards.utils.isValidTitle = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var title = jQuery(cardXml).find('.sapOvpCardTitle');
        if (!expectedHeaderRes.title) {
            return (title.length === 0);
        } else {
            if (title.length === 1) {
                return sap.ovp.test.qunit.cards.utils.validateXMLValue(title[0].getAttribute('text'), expectedHeaderRes.title);
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.isValidHeaderExtension = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var headerExtension = jQuery(cardXml).find('.sapOvpHeaderExtension');
        if (!expectedHeaderRes.headerExtension) {
            return (headerExtension.length === 0);
        } else {
            if (headerExtension.length === 1) {
                return sap.ovp.test.qunit.cards.utils.validateXMLValue(headerExtension[0].getAttribute('text'), expectedHeaderRes.headerExtension);
            }
        }
        return false;
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates category structure
     */
    sap.ovp.test.qunit.cards.utils.isValidCategory = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var category = jQuery(cardXml).find('.sapOvpCardCategory');
        if (!expectedHeaderRes.category) {
            return category.length === 0;
        } else {
            if (category.length === 1) {
                return sap.ovp.test.qunit.cards.utils.validateXMLValue(category[0].getAttribute('text'), expectedHeaderRes.category);
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.listNodeExists = function( cardXml) {
        return cardXml.getElementsByTagName('List')[0];

    };

    sap.ovp.test.qunit.cards.utils.listItemsNodeExists = function( cardXml, cardCfg) {
        var listXml = sap.ovp.test.qunit.cards.utils.getListItemsNode(cardXml);
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                if (cardCfg.listFlavor === 'bar') {
                    return listItemsXml.getElementsByTagName('CustomListItem')[0];
                } else if (cardCfg.listType === 'extended') {
                    return listItemsXml.getElementsByTagName('ObjectListItem')[0];
                } else {
                    return listItemsXml.getElementsByTagName('StandardListItem')[0];
                }
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.getListItemsNode = function(cardXml) {
        return cardXml.getElementsByTagName('List')[0];
    };


    sap.ovp.test.qunit.cards.utils.objectListItemFirstStatusNodeExists = function( cardXml) {
        var listXml = cardXml.getElementsByTagName('List')[0];
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                var oliXML = listItemsXml.getElementsByTagName('ObjectListItem')[0];
                return oliXML.getElementsByTagName('firstStatus')[0];
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.objectListItemAttributeNodeExists = function( cardXml) {
        var listXml = cardXml.getElementsByTagName('List')[0];
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                var oliXML = listItemsXml.getElementsByTagName('ObjectListItem')[0];
                return oliXML.getElementsByTagName('attributes')[0];
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.validateListXmlValues = function (cardXml, cardCfg, expectedListRes ) {
        if (cardCfg.listType === 'extended') {
            if (cardCfg.listFlavor === 'bar') {
                return sap.ovp.test.qunit.cards.utils._validateExtendedBarListItemsXmlValues(cardXml, expectedListRes);
            } else {
                return sap.ovp.test.qunit.cards.utils._validateObjectListItemsXmlValues(cardXml, expectedListRes);
            }
        } else {
            if (cardCfg.listFlavor === 'bar') {
                return sap.ovp.test.qunit.cards.utils._validateCondensedBarListItemsXmlValues(cardXml, expectedListRes);
            } else {
                // default for listType (in case parameter not passed) is currently 'Condensed' e.g. list of StandardListItem objects
                return sap.ovp.test.qunit.cards.utils._validateStandardListItemsXmlValues(cardXml, expectedListRes);
            }
        }
    };

    sap.ovp.test.qunit.cards.utils._validateObjectListItemsXmlValues = function (cardXml, expectedListRes ) {

        // for object list item we have (besides the attirbutes itself, 2 additional Nodes to check - the FirstStatus and the Attribute Nodes)
        if (!sap.ovp.test.qunit.cards.utils.objectListItemFirstStatusNodeExists(cardXml)) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.objectListItemAttributeNodeExists(cardXml)) {
            return false;
        }

        var oliXML = cardXml.getElementsByTagName('ObjectListItem')[0];
        var statusXml = oliXML.getElementsByTagName('ObjectStatus')[0];
        var status1Xml = oliXML.getElementsByTagName('ObjectStatus')[1];
        var objAttrsXML = oliXML.getElementsByTagName('ObjectAttribute')[0];
        var objAttrs1XML = oliXML.getElementsByTagName('ObjectAttribute')[1];

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('title'),expectedListRes.ListItem.title )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('number'),expectedListRes.ListItem.number )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('numberState'),expectedListRes.ListItem.numberState )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(statusXml.getAttribute('text'),expectedListRes.ListItem.ObjectStatus[0].text )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(statusXml.getAttribute('state'),expectedListRes.ListItem.ObjectStatus[0].state )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(status1Xml.getAttribute('text'),expectedListRes.ListItem.ObjectStatus[1].text )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(status1Xml.getAttribute('state'),expectedListRes.ListItem.ObjectStatus[1].state )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(objAttrsXML.getAttribute('text'),expectedListRes.ListItem.ObjectAttribute[0].text )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(objAttrs1XML.getAttribute('text'),expectedListRes.ListItem.ObjectAttribute[1].text )) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils._validateStandardListItemsXmlValues = function (cardXml, expectedListRes ) {

        var oliXML = cardXml.getElementsByTagName('StandardListItem')[0];

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('title'),expectedListRes.ListItem.title )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('description'),expectedListRes.ListItem.description )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('info'),expectedListRes.ListItem.info )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oliXML.getAttribute('infoState'),expectedListRes.ListItem.infoState )) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils._validateExtendedBarListItemsXmlValues = function (cardXml, expectedListRes ) {

        var oliXML = cardXml.getElementsByTagName('CustomListItem')[0];
        var firstDataFiledXml = oliXML.getElementsByTagName('Text')[0];
        var secondDataFiledXml = oliXML.getElementsByTagName('Text')[1];
        var oProgressIndicatorXML = oliXML.getElementsByTagName('ProgressIndicator')[0];
        if (!oliXML.getElementsByTagName('ObjectNumber')[2]) {
            //There is no third data point
            var firstDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[1];
            var secondDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[0];
        } else {
            //There is third data point
            var firstDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[2];
            var secondDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[0];
            var thirdDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[1];
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(firstDataFiledXml.getAttribute('text'),expectedListRes.CustomListItem.firstDataFiled )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(secondDataFiledXml.getAttribute('text'),expectedListRes.CustomListItem.secondDataFiled )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oProgressIndicatorXML.getAttribute('percentValue'),expectedListRes.CustomListItem.progressIndicator )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(firstDataPointXml.getAttribute('number'),expectedListRes.CustomListItem.firstDataPoint )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(secondDataPointXml.getAttribute('number'),expectedListRes.CustomListItem.secondDataPoint )) {
            return false;
        }
        if (thirdDataPointXml && !sap.ovp.test.qunit.cards.utils.validateXMLValue(thirdDataPointXml.getAttribute('number'),expectedListRes.CustomListItem.thirdDataPoint )) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils._validateCondensedBarListItemsXmlValues = function (cardXml, expectedListRes ) {

        var oliXML = cardXml.getElementsByTagName('CustomListItem')[0],
            oTitleXML = oliXML.getElementsByTagName('Text')[0],
            oProgressIndicatorXML = oliXML.getElementsByTagName('ProgressIndicator')[0],
            oFirstDataPointXML = oliXML.getElementsByTagName('Text')[1],
            oObjNumberXML = oliXML.getElementsByTagName('ObjectNumber')[0];


        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oTitleXML.getAttribute('text'),expectedListRes.CustomListItem.title )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oProgressIndicatorXML.getAttribute('percentValue'),expectedListRes.CustomListItem.progressIndicator )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oFirstDataPointXML.getAttribute('text'),expectedListRes.CustomListItem.firstDataPoint )) {
            return false;
        }

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(oObjNumberXML.getAttribute('number'),expectedListRes.CustomListItem.SecondDataPoint )) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils.actionFooterNodeExists = function ( cardXml ){
        return cardXml.getElementsByTagName('OverflowToolbar')[0];
    };

    sap.ovp.test.qunit.cards.utils.getActionsCount = function ( cardXml ){
        var footerXML = cardXml.getElementsByTagName('OverflowToolbar')[0];
        var actions = footerXML.getElementsByTagName('Button');
        return actions.length;
    };

    sap.ovp.test.qunit.cards.utils.validateActionFooterXmlValues = function (cardXml, expectedFooterRes ) {
        var currentData;
        var footerXML = cardXml.getElementsByTagName('OverflowToolbar')[0];
        if (footerXML) {
            var actions = footerXML.getElementsByTagName("Button");
            if (actions && actions.length > 0) {
                if (actions.length != expectedFooterRes.actions.length) {
                    return false;
                }

                for (var i = 0; i < actions.length; i++) {
                    currentData = sap.ovp.test.qunit.cards.utils.getCustomDataObject(actions[i]);
                    if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(currentData.type,expectedFooterRes.actions[i].type )){
                        return false;
                    }
                    if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(currentData.action,expectedFooterRes.actions[i].action )){
                        return false;
                    }
                    if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(currentData.label,expectedFooterRes.actions[i].label )){
                        return false;
                    }
                    if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(currentData.semanticObject,expectedFooterRes.actions[i].semanticObj )){
                        return false;
                    }
                }
            }
        }
        return true;
    };

    sap.ovp.test.qunit.cards.utils.getCustomDataObject = function(customDataXML){
        var res = {};
        var customDataArray = customDataXML.getElementsByTagNameNS("sap.ui.core","CustomData");
        for (var i = 0; i < customDataArray.length; i++){
            res [customDataArray[i].getAttribute("key")] = customDataArray[i].getAttribute("value");
        }

        return res;
    };

    sap.ovp.test.qunit.cards.utils.quickviewNodeExists = function( cardXml) {
        return cardXml.getElementsByTagName('QuickViewCard')[0];
    };

    sap.ovp.test.qunit.cards.utils.quickviewGroupNodeExists = function( cardXml) {
        var quickviewXML = cardXml.getElementsByTagName('QuickViewCard')[0];
        return quickviewXML.getElementsByTagName('QuickViewGroup')[0];
    };

    sap.ovp.test.qunit.cards.utils.quickviewGroupElementNodeExists = function( cardXml) {
        var quickviewXML = cardXml.getElementsByTagName('QuickViewCard')[0];
        var groupXML = quickviewXML.getElementsByTagName('QuickViewGroup')[0];
        return groupXML.getElementsByTagName('QuickViewGroupElement');
    };

    sap.ovp.test.qunit.cards.utils.validateQuickviewXmlValues = function (cardXml, expectedquickviewRes ) {

        var quickviewXML = cardXml.getElementsByTagName('QuickViewPage')[0];
        if (quickviewXML) {
            if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(quickviewXML.getAttribute('header'),expectedquickviewRes.QuickViewPage.header )) {
                return false;
            }
            if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(quickviewXML.getAttribute('title'),expectedquickviewRes.QuickViewPage.title )) {
                return false;
            }
            var groupsXml = quickviewXML.getElementsByTagName('QuickViewGroup');
            if (groupsXml.length == expectedquickviewRes.QuickViewPage.groups.length) {
                for (var gIndex = 0; gIndex < groupsXml.length; gIndex++) {
                    if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(groupsXml[gIndex].getAttribute('heading'),expectedquickviewRes.QuickViewPage.groups[gIndex].header )) {
                        return false;
                    }
                    var propertiesXML = groupsXml[gIndex].getElementsByTagName('QuickViewGroupElement');
                    var propsExpected = expectedquickviewRes.QuickViewPage.groups[gIndex].props;
                    if (propertiesXML) {
                        if (propertiesXML.length !=  propsExpected.length) {
                            return false;
                        }
                        if (propertiesXML.length == propsExpected.length) {
                            for (var pIndex = 0; pIndex < propertiesXML.length; pIndex++) {

                                if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(propertiesXML[pIndex].getAttribute('label'),propsExpected[pIndex].label )) {
                                    return false;
                                }
                                if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(propertiesXML[pIndex].getAttribute('value'),propsExpected[pIndex].value )) {
                                    return false;
                                }
                                if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(propertiesXML[pIndex].getAttribute('type'),propsExpected[pIndex].type )) {
                                    return false;
                                }
                            }
                        } else {//#of props not as expected
                            return false;
                        }
                    }
                }
            } else { //#of groups not as expected
                return false;
            }
        }
        return true;
    };

    sap.ovp.test.qunit.cards.utils.imageNodeExists = function( cardXml) {
        return cardXml.getElementsByTagName('Image')[0];

    };

    sap.ovp.test.qunit.cards.utils.validateImageXmlValues = function (cardXml, expectedImageRes) {
        var imageXML = cardXml.getElementsByTagName('Image')[0];

        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(imageXML.getAttribute('src'),expectedImageRes.src )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(imageXML.getAttribute('densityAware'),expectedImageRes.densityAware )) {
            return false;
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(imageXML.getAttribute('width'),expectedImageRes.width )) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils.tableNodeExists = function( cardXml) {
        return cardXml.getElementsByTagName('Table')[0];
    };

    sap.ovp.test.qunit.cards.utils.tableColumnsNodeExists = function( cardXml, cardCfg) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            return tableXml.getElementsByTagName('columns')[0];
        }
        return false;

    };

    sap.ovp.test.qunit.cards.utils.tableItemsNodeExists = function( cardXml) {
        var tableXml = sap.ovp.test.qunit.cards.utils.getTableItemsNode(cardXml)
        if (tableXml) {
            return tableXml.getElementsByTagName('items')[0];
        }
        return false;

    };

    sap.ovp.test.qunit.cards.utils.getTableItemsNode = function( cardXml) {
        return cardXml.getElementsByTagName('Table')[0];
    };

    sap.ovp.test.qunit.cards.utils.tableColumnListItemNodeExists = function( cardXml) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            var  tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('ColumnListItem');
                return columns[0];
            }
        }
        return false;
    };

    sap.ovp.test.qunit.cards.utils.tableCellsNodeExists = function( cardXml) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            var  tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('ColumnListItem');
                if (columns[0]) {
                    return (columns[0]).getElementsByTagName('cells')[0];
                }
            }
        }
        return false;
    };


    sap.ovp.test.qunit.cards.utils.validateTableXmlValues = function (cardXml, cardCfg, expectedTableRes) {

        // validate column titles values
        if (!this._validateTableColumnsTitle(cardXml,cardCfg,expectedTableRes)) {
            return false;
        }
        // validate column cells
        if (!this._validateTableColumnsCells(cardXml,cardCfg,expectedTableRes)) {
            return false;
        }

        return true;
    };




    sap.ovp.test.qunit.cards.utils._validateTableColumnsTitle = function (cardXml, cardCfg, expectedTableRes) {

        // validate columns title values
        var columnsXml = cardXml.getElementsByTagName('Column');

        var actualValueToCheck;
        var firstColumn = (cardXml.getElementsByTagName('Column')[0]);
        var SecondColumn = (cardXml.getElementsByTagName('Column')[1]);
        var thirdColumn = (cardXml.getElementsByTagName('Column')[2]);

        // first column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[0].text) {
            actualValueToCheck = (firstColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck,expectedTableRes.columns[0].text )) {
            return false;
        }

        // second column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[1].text) {
            actualValueToCheck = (SecondColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck,expectedTableRes.columns[1].text )) {
            return false;
        }

        // third column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[2].text) {
            actualValueToCheck = (thirdColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck,expectedTableRes.columns[2].text )) {
            return false;
        }

        return true;
    };


    sap.ovp.test.qunit.cards.utils._validateTableColumnsCells = function (cardXml, cardCfg, expectedTableRes) {

        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);

        var actualValueToCheck;
        var firstColumnCell = (cellsXml.getElementsByTagName('Text')[0]);
        var SecondColumnCell = (cellsXml.getElementsByTagName('Text')[1]);
        var thirdColumnCell = (cellsXml.getElementsByTagName('Text')[2]);
        var thirdColumnCellDataPoint = (cellsXml.getElementsByTagName('ObjectNumber')[0]);


        // first column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[0].text) {
            actualValueToCheck = (firstColumnCell.getAttribute('text'));
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].text)) {
            return false;
        }

        // second column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[1].text) {
            actualValueToCheck = (SecondColumnCell.getAttribute('text'));
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[1].text)) {
            return false;
        }

        // third column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].text) {
            actualValueToCheck = (thirdColumnCell.getAttribute('text'));
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].text)) {
            return false;
        }

        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].number) {
            actualValueToCheck = (thirdColumnCellDataPoint.getAttribute('number'));
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].number)) {
            return false;
        }

        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].state) {
            actualValueToCheck = (thirdColumnCellDataPoint.getAttribute('state'));
        }
        if (!sap.ovp.test.qunit.cards.utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].state)) {
            return false;
        }

        return true;
    };

    sap.ovp.test.qunit.cards.utils.createMetaModel = function(aBindingContextObject, oOdataProperty) {
        return {
            "getODataEntityType" : function() {
                var oEntityType = {};
                oEntityType.$path = "somePath";
                return oEntityType;
            },
            "createBindingContext" : function() {
                var oBindingContext = {};
                oBindingContext.getObject = function() {
                    return aBindingContextObject;
                };
                return oBindingContext;
            },
            "getODataAssociationEnd" : function() {
                return " ";
            },
            "getODataProperty" : function() {
                return oOdataProperty;
            }
        };
    };


    /**
     * iContext Mock for AnnotationHelper & ActionUtils formatter functions testing
     */
    sap.ovp.test.qunit.cards.utils.ContextMock = function(data) {
        // settings
        this.setting = {};
        this.setting._ovpCache = {};
        this.setting.ovpCardProperties = {};
        this.setting.ovpCardProperties.oData = {};
        this.model = {};

        if (data) {
            if (data.ovpCardProperties) {
                this.setting.ovpCardProperties.oData = data.ovpCardProperties;
            }
            if (data.model) {
                this.model = data.model;
            }
            if (data.object){
                this.object = data.object;
            }
        }

        this.setting.ovpCardProperties.getProperty = function (sKey) {
            return this.oData[sKey];
        };

        this.model.getProperty = function (sKey) {
            return this[sKey];
        };
    };

    sap.ovp.test.qunit.cards.utils.ContextMock.prototype.getSetting = function(settings) {
        return this.setting[settings];
    };
    sap.ovp.test.qunit.cards.utils.ContextMock.prototype.getModel = function() {
        return this.model;
    };
    sap.ovp.test.qunit.cards.utils.ContextMock.prototype.getPath = function() {
        return "";
    };
    sap.ovp.test.qunit.cards.utils.ContextMock.prototype.getObject = function() {
        return this.object;
    };

    sap.ovp.test.qunit.cards.utils.validateOvpKPIHeader = function(xml, expectedHeaderResult) {

        var headers = xml.getElementsByClassName("sapOvpCardHeader");
        if ( !headers || headers.length == 0 ) {
            return false;
        }


        var bExpectedNumber = expectedHeaderResult.KPI && expectedHeaderResult.KPI.number ? true : false ;
        var bExpectedSort = expectedHeaderResult.KPI && expectedHeaderResult.KPI.sortBy      ? true : false;
        var bExpectedFilter = expectedHeaderResult.KPI && expectedHeaderResult.KPI.filterBy  ? true : false;
        var bResult;


        var ovp = headers[0];
        var sapOvpKPIHeaderNumberValueStyle = ovp.getElementsByClassName("sapOvpKPIHeaderNumberValueStyle");

        // if data-point is configured - e.g. we should expect to have a number section in the KPI Header
        if (bExpectedNumber) {
            if ( !sapOvpKPIHeaderNumberValueStyle || sapOvpKPIHeaderNumberValueStyle.length == 0 ) {
                return false;
            }


            // first we check the KPI header title
            var oOvpKpiHeaderTitle = ovp.getElementsByClassName("sapOvpKPIHeaderTitleStyle");
            if ( oOvpKpiHeaderTitle && oOvpKpiHeaderTitle.length > 0) {

                oOvpKpiHeaderTitle = oOvpKpiHeaderTitle[0];
                var sHeaderTitleValue = oOvpKpiHeaderTitle.getAttribute('text');
                bResult = this.validateXMLValue(sHeaderTitleValue, expectedHeaderResult.KPI.headerTitleContent);
                if (!bResult) {
                    return false;
                }
            }

            // if number should exist - we check first the NumberAggregation Node
            var oNumberAggregateNumberContentNode = ovp.getElementsByClassName('sapOvpKPIHeaderAggregateNumber');
            if (oNumberAggregateNumberContentNode && oNumberAggregateNumberContentNode.length != 0) {

                // check for the filters:[] part of the singleton aggregation value of the NumericContent object
                var expectedAggregateNumber = expectedHeaderResult.KPI.numberAggregateNumberContent;
                // take singleton proeprty value
                var sSingletonValue = oNumberAggregateNumberContentNode[0].getAttribute('singleton');
                var sFiltersRegEx = /(filters: \[.*\])/;
                // extract the 'filters:[]' array part
                var aResults = sFiltersRegEx.exec(sSingletonValue);
                var sResult;

                // if filters are expected - we should be able to find them on the singleton value string
                if (bExpectedFilter) {
                    // check that all filters & all filtrs parts exist
                    sResult = aResults[0];
                    var aCurrFilter;
                    for (var i = 0; i < expectedAggregateNumber.filters.length; i++) {
                        aCurrFilter = expectedAggregateNumber.filters[i];
                        var sCurrFilterPart;

                        for (var j = 0; j < aCurrFilter.length; j++) {
                            sCurrFilterPart = aCurrFilter[j];
                            if (sResult.indexOf(sCurrFilterPart) === -1) {
                                return false;
                            }
                        }
                    }
                } else if (aResults && aResults.length > 0) {
                    // we need to make sure no filters exist on the Singleton value string
                        return false;
                }
            } else {
                return false;
            }

            // now we will check the value property of the NumericContent property value's
            var oNumericContentNode = ovp.getElementsByClassName('sapOvpKPIHeaderNumberValueStyle');
            if (oNumericContentNode && oNumericContentNode.length != 0) {
                oNumericContentNode = oNumericContentNode[0];
                var sValue = oNumericContentNode.getAttribute('value');

                bResult = this.validateXMLValue(sValue, expectedHeaderResult.KPI.numberNumericContentValue);
                if (!bResult) {
                    return false;
                }
            } else {
                return false;
            }

            // now we will check the value property of unit-of-measure
            var oUOMNode = ovp.getElementsByClassName('sapOvpKPIHeaderUnitOfMeasureStyle');
            if (oUOMNode && oUOMNode.length != 0) {
                oUOMNode =  oUOMNode[0];
                var sUOMValue = oUOMNode.getAttribute('text');

                bResult = this.validateXMLValue(sUOMValue, expectedHeaderResult.KPI.numberUOM);
                if (!bResult) {
                    return false;
                }

            } else {
                return false;
            }


            // if selectionVariant is configured - e.g. we should expect to have a Filter-By_values section in the KPI Header
            var sapOvpCardFilterStyle = ovp.getElementsByClassName("sapOvpKPIHeaderFilterStyle");
            if (bExpectedFilter && (!sapOvpCardFilterStyle || sapOvpCardFilterStyle.length == 0)){
                return false;
            } else  if (!bExpectedFilter && sapOvpCardFilterStyle && sapOvpCardFilterStyle.length > 0){
                return false;
            }

            // if presentationVariant is configured - e.g. we should expect to have a SortBy section in the KPI Header
            var sapOvpKPIHeaderDimensionStyle = ovp.getElementsByClassName("sapOvpKPIHeaderDimensionStyle");
            if (bExpectedSort){
                
                if (!sapOvpKPIHeaderDimensionStyle || sapOvpKPIHeaderDimensionStyle.length == 0) {
                    return false;
                } else {
                    // check the sort-by String
                    sapOvpKPIHeaderDimensionStyle = sapOvpKPIHeaderDimensionStyle[0];
                    var sSortByValue = sapOvpKPIHeaderDimensionStyle.getAttribute('text');
                    bResult = this.validateXMLValue(sSortByValue, expectedHeaderResult.KPI.sortByContent);
                    if (!bResult) {
                        return false;
                    }
                }
            } else if (!bExpectedSort){
                if (sapOvpKPIHeaderDimensionStyle && sapOvpKPIHeaderDimensionStyle.length > 0) {
                    return false;
                }
            }
        } else if (sapOvpKPIHeaderNumberValueStyle && sapOvpKPIHeaderNumberValueStyle.length != 0 ) {
            // else if no data point configured we need to check it was not added
            return false;
        }

        return true;

    };

}());