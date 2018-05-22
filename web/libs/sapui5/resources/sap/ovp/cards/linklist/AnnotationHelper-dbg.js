// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous utility functions.
 */

(function() {
	"use strict";
	/*global dispatchEvent, document, jQuery, localStorage, sap */

	// ensure that sap.ushell exists
	jQuery.sap.declare("sap.ovp.cards.linklist.AnnotationHelper");

	sap.ovp.cards.linklist.AnnotationHelper = {};

	/*
	 * return the sorters that need to be applyed on an aggregation
	 * @param ovpCardProperties - card properties model which might contains sort configurations
	 * @returns {Array} of model sorters
	 */
	function getSorters(ovpCardProperties) {
		var aSorters = [];
		var oSorter, bDescending;

		//get the configured sorter if exist and append them to the sorters array
		var sPropertyPath = ovpCardProperties.getProperty("/sortBy");
		if (sPropertyPath) {
			// If sorting is enabled by card configuration
			var sSortOrder = ovpCardProperties.getProperty("/sortOrder");
			if (sSortOrder && sSortOrder.toLowerCase() !== "descending") {
				bDescending = false;
			} else {
				bDescending = true;
			}
			oSorter = {
				path: sPropertyPath,
				descending: bDescending
			};
			aSorters.push(oSorter);
		}
		// returning Sorter
		return aSorters;
	}

	/*
	 * return the filters that need to be applyed on an aggregation
	 * @param ovpCardProperties - card properties model which might contains filters configurations
	 * @param oSelectionVariant - optional selection variant annotation with SelectOptions configuration
	 * @returns {Array} of model filters
	 */
	function getFilters(ovpCardProperties, oSelectionVariant) {
		var aFilters = [];
		//get the configured filters if exist and append them to the filter array
		var aConfigFilters = ovpCardProperties.getProperty("/filters");
		if (aConfigFilters) {
			aFilters = aFilters.concat(aConfigFilters);
		}

		//get the filters from the selection variant annotations if exists
		var aSelectOptions = oSelectionVariant && oSelectionVariant.SelectOptions;
		var oSelectOption, sPropertyPath, oRange;
		if (aSelectOptions) {
			for (var i = 0; i < aSelectOptions.length; i++) {
				oSelectOption = aSelectOptions[i];
				sPropertyPath = oSelectOption.PropertyName.PropertyPath;
				//a select option might contains more then one filter in the Ranges array
				for (var j = 0; j < oSelectOption.Ranges.length; j++) {
					oRange = oSelectOption.Ranges[j];
					if (oRange.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I") {
						//create the filter. the Low value is mandatory
						var oFilter = {
							path: sPropertyPath,
							operator: oRange.Option.EnumMember.split("/")[1],
							value1: sap.ovp.cards.AnnotationHelper.getPrimitiveValue(oRange.Low),
							value2: sap.ovp.cards.AnnotationHelper.getPrimitiveValue(oRange.High)
						};
						//append the filter to the filters array
						aFilters.push(oFilter);
					}
				}
			}
		}
		// returning Filter
		return aFilters;
	}

	/*
	 * This formatter method parses the items aggregation path in the Model.
	 * @param iContext
	 * @param itemsPath
	 * @returns items aggregation path in the Model
	 */
	sap.ovp.cards.linklist.AnnotationHelper.formatItems = function(iContext, oEntitySet) {
		var oModel = iContext.getSetting("ovpCardProperties");
		var oMetaModel = oModel.getProperty("/metaModel");
		var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
		var sEntitySetPath = "/" + oEntitySet.name;
		var oSelectionVariant = oEntityType[oModel.getProperty("/selectionAnnotationPath")];
		var iItemsLength = oModel.getProperty("/cardLayout/items");
		if (iItemsLength === undefined) {
			var oCardLayout = oModel.getProperty("/cardLayout");
			if (oCardLayout && !oCardLayout.autoSpan && oCardLayout.autoSpan !== true) {
				// Item Length dependent on Card listFlavor
				if (oModel.getProperty("/listFlavor") === "standard") {
					var iRowHeight = oModel.getProperty("/cardLayout/iRowHeigthPx");
					if (iRowHeight === undefined) {
					    iRowHeight = 176;
					}
					var iItemHeight = 72;
					if (oModel.getProperty("/densityStyle") === "cozy") {
						iItemHeight = 72;
					} else {
						iItemHeight = 60;
					}
					// Calculate Items dependent on colSpan and rowSpan and ItemHeigth
					iItemsLength = Math.floor(oCardLayout.rowSpan * iRowHeight / iItemHeight) * oCardLayout.colSpan;
				} else if (oModel.getProperty("/listFlavor") === "carousel") {
					iItemsLength = 10;
				} else if (oModel.getProperty("/listFlavor") === "grid") {
					iItemsLength = oCardLayout.rowSpan * oCardLayout.colSpan * 2;
				}
			}
		}
		//check if entity set needs parameters
		// if selection-annotations path is supplied - we need to resolve it in order to resolve the full entity-set path
		if (oSelectionVariant) {
			if (oSelectionVariant && oSelectionVariant.Parameters) {
				// in case we have UI.SelectionVariant annotation defined on the entityType including Parameters - we need to resolve the entity-set path to include it
				sEntitySetPath = sap.ovp.cards.linklist.AnnotationHelper.resolveParameterizedEntitySet(iContext.getSetting("dataModel"), oEntitySet,
					oSelectionVariant);
			}
		}

		var result = "{path: '" + sEntitySetPath + "', length: " + iItemsLength;

		//apply sorters information
		var aSorters = getSorters(oModel);
		if (aSorters.length > 0) {
			result = result + ", sorter:" + JSON.stringify(aSorters);
		}
		//apply filters information
		var aFilters = getFilters(oModel, oSelectionVariant);
		if (aFilters.length > 0) {
			result = result + ", filters:" + JSON.stringify(aFilters);
		}
		result = result + "}";

		// returning the parsed path for the Card's items-aggregation binding
		return result;
	};

	/*
	 * This formatter method parses the items Url and extend it with the "baseUrl" if required
	 * @param iContext
	 * @param sUrl
	 * @returns sUrl
	 */
	sap.ovp.cards.linklist.AnnotationHelper.formatUrl = function(iContext, sUrl) {
		var sBaseUrl = iContext.getModel().getProperty("/baseUrl");
		if (sUrl.startsWith(sBaseUrl) || sUrl.indexOf("://") > 0) {
			return sUrl;
		} else if (sUrl.startsWith("/")) {
			return sBaseUrl + sUrl;
		} else {
			return sBaseUrl + "/" + sUrl;
		}
	};

	/* This formatter check whether is ImageUri is true or not
	 *
	 * @returns true or false
	 */
	sap.ovp.cards.linklist.AnnotationHelper.isImageUrl = function(oInterface, oDataField) {
		var bIsImageUrl = true;
		var sOdataPath = sap.ui.model.odata.AnnotationHelper.format(oInterface, oDataField);
		if (sOdataPath.toLowerCase().indexOf("icon") > 0) {
			bIsImageUrl = false;
		}
		return bIsImageUrl;
	};

	/* This formatter check whether is ImageUri is true or not
	 *
	 * @returns true or false
	 */
	sap.ovp.cards.linklist.AnnotationHelper.isImageUrlStaticData = function(oDataField) {
		var bIsImageUrl = true;
		if (oDataField === undefined) {
			return null;
		} else if (oDataField.toLowerCase().indexOf("icon") > 0) {
			bIsImageUrl = false;
		}
		return bIsImageUrl;
	};
	/* This formatter make string to path
	 * @returns Icon Path
	 */
	sap.ovp.cards.linklist.AnnotationHelper.getIconPath = function(sTypeImageUrl) {
		var sIconPath = "{" + sTypeImageUrl.String + "}";
		return sIconPath;
	};

	/* This formatter make string to path
	 * @returns Path like {<string>}
	 */
	sap.ovp.cards.linklist.AnnotationHelper.formatString = function(sObject) {
		var sPath = "{" + sObject.String + "}";
		return sPath;
	};

	/*
	 * @param oAnnotation
	 * @returns 0 for false - there are no actions for this context
	 *          1 for true - there are actions for this context
	 *          does not return actual boolean - so we won't need to parse the result in the xml
	 */
	sap.ovp.cards.linklist.AnnotationHelper.linkedAction = function(oAnnotation) {
		if (oAnnotation) {
			return 1;
		}
		return 0;
	};

	sap.ovp.cards.linklist.AnnotationHelper.staticContentWithLength = function(sPath) {
		var sPathWithLength = "{" + sPath + ", length:3}";
		return sPathWithLength;
	};

	sap.ovp.cards.linklist.AnnotationHelper.contentRowIndex = function(oRow) {
		if (this._repeatRowId !== this.getId()) {
			this._rowIndex = 0;
			this._repeatRowId = this.getId();
		} else {
			this._rowIndex++;
		}
		return this._rowIndex;
	};

	//*** Requires IContext ***//
	sap.ovp.cards.linklist.AnnotationHelper.isImageUrl.requiresIContext = true;
	sap.ovp.cards.linklist.AnnotationHelper.formatItems.requiresIContext = true;
	sap.ovp.cards.linklist.AnnotationHelper.formatUrl.requiresIContext = true;
}());