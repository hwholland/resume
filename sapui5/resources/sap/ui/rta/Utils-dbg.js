/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
/*global Promise*/
// Provides object sap.ui.rta.Utils.
sap.ui
		.define(
				['jquery.sap.global', 'sap/ui/fl/Utils', 'sap/ui/dt/OverlayUtil',
						'sap/ui/comp/odata/FieldSelectorModelConverter', 'sap/ui/fl/registry/Settings',
						'sap/ui/comp/smartform/GroupElement', 'sap/ui/comp/smartform/Group', 'sap/ui/comp/smartfield/SmartField',
						'sap/uxap/ObjectPageSection', 'sap/uxap/ObjectPageLayout', 'sap/ui/core/StashedControlSupport', 'sap/m/MessageBox',
						'sap/ui/comp/odata/MetadataAnalyser', 'sap/ui/rta/model/ElementPreprocessor'],
				function(jQuery, FlexUtils, OverlayUtil, FieldSelectorModelConverter, Settings,
						GroupElement, Group, SmartField, ObjectPageSection, ObjectPageLayout, StashedControlSupport, MessageBox,
						MetadataAnalyser, ElementPreprocessor) {
					"use strict";

					/**
					 * Class for Utils.
					 *
					 * @class Utility functionality to work with controls, e.g. iterate through aggregations, find parents, ...
					 *
					 * @author SAP SE
					 * @version 1.38.33
					 *
					 * @private
					 * @static
					 * @since 1.30
					 * @alias sap.ui.rta.Utils
					 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API
					 *               might be changed in future.
					 */

					var Utils = {};

					Utils.RESOLVED_PROMISE = Promise.resolve(true);

					Utils._sFocusableOverlayClass = ".sapUiDtOverlaySelectable";
					/**
					 * Utility function to check if extensibility is enabled in the current system
					 *
					 * @param {sap.ui.core.Control}
					 *          oControl Control to be checked
					 * @returns {Promise} resolves a boolean
					 */
					Utils.isExtensibilityEnabledInSystem = function(oControl) {
						var sComponentName = FlexUtils.getComponentClassName(oControl);
						if (!sComponentName || sComponentName == "") {
							return Promise.resolve(false);
						}
						return Settings.getInstance(sComponentName).then(function(oSettings) {
							if (oSettings.isModelS) {
								return oSettings.isModelS();
							}
							return false;
						});
					};

					/**
					 * Utility function to check if the OData service is updated in the meantime
					 *
					 * @param {sap.ui.core.Control}
					 *          oControl Control to be checked
					 * @returns {Promise} resolved when done with boolean if saying  service is up to date
					 */
					Utils.isServiceUpToDate = function(oControl) {
						return this.isExtensibilityEnabledInSystem(oControl).then(function(bEnabled) {
							if (bEnabled) {
								jQuery.sap.require("sap.ui.fl.fieldExt.Access");
								var oModel = oControl.getModel();
								if (oModel) {
									var bServiceOutdated = sap.ui.fl.fieldExt.Access.isServiceOutdated(oModel.sServiceUrl);
									if (bServiceOutdated) {
										sap.ui.fl.fieldExt.Access.setServiceValid(oModel.sServiceUrl);
										//needs FLP to trigger UI restart popup
										sap.ui.getCore().getEventBus().publish("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",{});
										return false;
									}
								}
							}
							return true;
						});
					};

					/**
					 * Utility function to check via backend calls if the custom field button shall be enabled or not
					 *
					 * @param {sap.ui.core.Control}
					 *          oControl Control to be checked
					 * @returns {Boolean} true if CustomFieldCreation functionality is to be enabled, false if not
					 */
					Utils.isCustomFieldAvailable = function(oControl) {
						var that = this;
						return this.isExtensibilityEnabledInSystem(oControl).then(function(bShowCreateExtFieldButton) {
							if (!bShowCreateExtFieldButton) {
								return Promise.resolve();
							} else {

								var oFieldSelectorModelConverter = new FieldSelectorModelConverter(oControl.getModel());
								var oMDA = oFieldSelectorModelConverter.getMetaDataAnalyzer();
								var sEntityType = that.getBoundEntityType(oControl);

								try {
									jQuery.sap.require("sap.ui.fl.fieldExt.Access");
									var oJQueryDeferred = sap.ui.fl.fieldExt.Access.getBusinessContexts(oMDA.oModel.sServiceUrl,
											sEntityType);
									oJQueryDeferred.fail(function(oError) {
										if (oError) {
											if (jQuery.isArray(oError.errorMessages)) {
												for (var i = 0; i < oError.errorMessages.length; i++) {
													jQuery.sap.log.error(oError.errorMessages[i].text);
												}
											}
										}
										return Promise.resolve(false);
									});
									return oJQueryDeferred.then(function(oResult) {
										if (oResult) {
											if (oResult.BusinessContexts) {
												if (oResult.BusinessContexts.length > 0) {
													oResult.EntityType = sEntityType;
													return Promise.resolve(oResult);
												}
											}
										}
									});
								} catch (oError) {
									jQuery.sap.log
											.error("exception occured in sap.ui.fl.fieldExt.Access.getBusinessContexts", oError);
									return Promise.resolve();
								}
							}
						});
					};

					/**
					 * Opens a confirmation dialog indicating mandatory fields if necessary.
					 *
					 * @param oElement
					 *          the analyzed control
					 * @param a
					 *          list of mandatory fields
					 * @return true if user says okay, false if not
					 */
					Utils.openHideElementConfirmationDialog = function(oElement, aUnHideableElements) {

						var oTextResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
						var sTitle;
						return new Promise(
								function(resolve, reject) {

									sTitle = oTextResources.getText("CTX_HIDE_TITLE");
									var mandatoryFieldList = '';
									var sMessageText = '';
									if ((oElement instanceof Group) || (aUnHideableElements.length > 1)) {
										mandatoryFieldList = '<ul>';
										for (var i = 0; i < aUnHideableElements.length; i++) {
											mandatoryFieldList += '<li>' + Utils.getLabelForElement(aUnHideableElements[i]) + '</li>';
										}
										mandatoryFieldList += '</ul>';
										sMessageText = oTextResources.getText("CTX_HIDE_MANDATORY_FIELDS_MESSAGE");
									} else {
										sMessageText = oTextResources.getText("CTX_HIDE_MANDATORY_FIELD_MESSAGE");
									}

									// create some dummy JSON data and create a Model from it
									var data = {
										mandatoryFieldList : mandatoryFieldList,
										messageText : sMessageText,
										titleText : sTitle,
										hideText : oTextResources.getText("BTN_FREP_REMOVE"),
										cancelText : oTextResources.getText("BTN_FREP_CANCEL")
									};
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(data);

									var oFragmentDialog;
									var fnCleanUp = function() {
										if (oFragmentDialog) {
											oFragmentDialog.close();
											oFragmentDialog.destroy();
											oFragmentDialog = null;
										}
									};

									// create a controller for the action in the Dialog
									var oFragmentController = {
										hideField : function() {
											fnCleanUp();
											resolve(true);
										},
										closeDialog : function() {
											fnCleanUp();
											resolve(false);
										}
									};

									// instantiate the Fragment if not done yet
									if (!oFragmentDialog) {
										oFragmentDialog = sap.ui.xmlfragment("sap.ui.rta.view.HideElementDialog", oFragmentController);
										oFragmentDialog.setModel(oModel);
									}
									oFragmentDialog.open();

								});
					};

					/**
					 * Checks if element is hideable
					 *
					 * @returns {boolean} whether the element can be hidden or not
					 * @public
					 */
					Utils.isElementHideable = function(oElement) {
						return ((oElement instanceof GroupElement || oElement instanceof Group || oElement instanceof ObjectPageSection) && !this
								.isElementMandatory(oElement));
					};

					Utils.isMandatorySmartField = function(oElement) {
						return (oElement instanceof SmartField) && oElement.getMandatory();
					};

					/**
					 * Checks if element is mandatory
					 *
					 * @returns {boolean} whether the element is mandatory or not
					 * @public
					 */
					Utils.isElementMandatory = function(oElement) {
						var bMandatory = false;

						if (oElement instanceof GroupElement) {
							var aFields = oElement.getFields();
							for (var i = 0; i < aFields.length; i++) {
								var oGroupElement = aFields[i];
								if (this.isMandatorySmartField(oGroupElement)) {
									// Break searching all SmartFields and get back on the
									// first found mandatory rendered SmartField
									bMandatory = true;
									break;
								}
							}
						} else if (oElement instanceof Group) {
							var aGroupElements = oElement.getGroupElements();
							for (var j = 0; j < aGroupElements.length; j++) {
								return this.isElementMandatory(aGroupElements[j]);
							}
						}
						return bMandatory;
					};

					/**
					 * Checks if overlay is selectable in RTA (selectable also means focusable for RTA)
					 *
					 * @param {sap.ui.dt.ElementOverlay}
					 *          oOverlay to check
					 * @returns {boolean} if is selectable
					 * @private
					 */
					Utils.isOverlaySelectable = function(oOverlay) {
						// check the real DOM visibility should be preformed while oOverlay.isVisible() can be true, but if element
						// has no geometry, overlay will not be visible in UI
						return oOverlay.isSelectable() && oOverlay.$().is(":visible");
					};

					Utils.getPropertyValue = function(oElement, sPropertyName) {
						var oMetadata = oElement.getMetadata().getPropertyLikeSetting(sPropertyName);
						var sPropertyGetter = oMetadata._sGetter;
						return oElement[sPropertyGetter]();
					};

					/**
					 * Returns the previous editable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getPreviousSelectableOverlay = function(oOverlay) {
						var oPreviousOverlay = OverlayUtil.getPreviousOverlay(oOverlay);

						while (oPreviousOverlay && !this.isOverlaySelectable(oPreviousOverlay)) {
							oPreviousOverlay = OverlayUtil.getPreviousOverlay(oPreviousOverlay);
						}
						return oPreviousOverlay;
					};

					/**
					 * Returns the next editable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getNextSelectableOverlay = function(oOverlay) {
						var oNextOverlay = OverlayUtil.getNextOverlay(oOverlay);

						while (oNextOverlay && !this.isOverlaySelectable(oNextOverlay)) {
							oNextOverlay = OverlayUtil.getNextOverlay(oNextOverlay);
						}
						return oNextOverlay;
					};

					/**
					 * Returns overlay instance for an overlay's dom element
					 *
					 * @param {element}
					 *          oDomRef DOM element
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getOverlayInstanceForDom = function(oDomRef) {
						var sId = jQuery(oDomRef).attr("id");
						if (sId) {
							return sap.ui.getCore().byId(sId);
						}
					};

					/**
					 * Returns the first focusable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getFirstFocusableOverlay = function() {
						var $overlay = jQuery(this._sFocusableOverlayClass).first();
						var oOverlay = this.getOverlayInstanceForDom($overlay);
						if (!this.isOverlaySelectable(oOverlay)) {
							oOverlay = this.getNextSelectableOverlay(oOverlay);
						}
						return oOverlay;
					};

					/**
					 * Returns the last focusable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getLastFocusableOverlay = function() {
						var $overlay = jQuery(this._sFocusableOverlayClass).last();
						var oOverlay = this.getOverlayInstanceForDom($overlay);
						if (!this.isOverlaySelectable(oOverlay)) {
							oOverlay = this.getPreviousSelectableOverlay(oOverlay);
						}
						return oOverlay;
					};

					/**
					 * Returns the next focusable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getNextFocusableOverlay = function() {
						var oFocusedOverlay = this.getFocusedOverlay();
						if (oFocusedOverlay) {
							return this.getNextSelectableOverlay(oFocusedOverlay);
						}
					};

					/**
					 * Returns the previous focusable overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getPreviousFocusableOverlay = function() {
						var oFocusedOverlay = this.getFocusedOverlay();
						if (oFocusedOverlay) {
							return this.getPreviousSelectableOverlay(oFocusedOverlay);
						}
					};

					/**
					 * Returns the focused overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getFocusedOverlay = function() {
						if (document.activeElement) {
							var oElement = sap.ui.getCore().byId(document.activeElement.id);
							if (oElement instanceof sap.ui.dt.ElementOverlay) {
								return oElement;
							}
						}
					};

					/**
					 * Returns the first focusable child overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getFirstFocusableChildOverlay = function(oOverlay) {
						var oFirstFocusableChildOverlay = OverlayUtil.getFirstChildOverlay(oOverlay);

						while (oFirstFocusableChildOverlay && !this.isOverlaySelectable(oFirstFocusableChildOverlay)) {
							oFirstFocusableChildOverlay = OverlayUtil.getNextSiblingOverlay(oFirstFocusableChildOverlay);
						}
						return oFirstFocusableChildOverlay;
					};

					/**
					 * Returns the next focusable sibling overlay
					 *
					 * @return {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getNextFocusableSiblingOverlay = function(oOverlay) {
						var oNextFocusableSiblingOverlay = OverlayUtil.getNextSiblingOverlay(oOverlay);

						while (oNextFocusableSiblingOverlay && !this.isOverlaySelectable(oNextFocusableSiblingOverlay)) {
							oNextFocusableSiblingOverlay = OverlayUtil.getNextSiblingOverlay(oNextFocusableSiblingOverlay);
						}
						return oNextFocusableSiblingOverlay;
					};

					/**
					 * Returns the previous focusable sibling overlay
					 *
					 * @returns {sap.ui.dt.ElementOverlay} overlay object
					 * @private
					 */
					Utils.getPreviousFocusableSiblingOverlay = function(oOverlay) {
						var oPreviousFocusableSiblingOverlay = OverlayUtil.getPreviousSiblingOverlay(oOverlay);

						while (oPreviousFocusableSiblingOverlay && !this.isOverlaySelectable(oPreviousFocusableSiblingOverlay)) {
							oPreviousFocusableSiblingOverlay = OverlayUtil
									.getPreviousSiblingOverlay(oPreviousFocusableSiblingOverlay);
						}
						return oPreviousFocusableSiblingOverlay;
					};

					/**
					 * get closest view in parent tree for an element
					 *
					 * @param {sap.ui.core.Element}
					 *          oElement element object
					 * @returns {sap.ui.core.Element} oElement element object
					 * @private
					 */
					Utils.getClosestViewFor = function(oElement) {
						if (!oElement && !oElement.getParent) {
							return;
						}
						var oParentElement = oElement.getParent();
						if (oParentElement && oParentElement.getMetadata().getName() !== "sap.ui.core.mvc.XMLView") {
							return this.getClosestViewFor(oParentElement);
						}
						return oParentElement;
					};

					/*
					 * Looks for parent control with specified class name @param {sap.ui.core.Control} oControl Control to be
					 * checked @param {string} sType class name of parent control @returns {sap.ui.core.Control} the parent
					 * control @private
					 */
					Utils.getClosestTypeForControl = function(oControl, sType) {
						if (oControl && oControl.getMetadata().getName() !== sType) {
							return this.getClosestTypeForControl(oControl.getParent(), sType);
						}
						return oControl;
					};

					/*
					 * Checks if control is supported @param {sap.ui.core.Control} oControl Control to be checked @private
					 */
					Utils._checkIsSupportedControl = function(oControl, aSupportedControls) {
						for (var i = 0; i < aSupportedControls.length; i++) {
							if (oControl.getMetadata().getName() === aSupportedControls[i]) {
								return true;
							}
						}
					};

					/*
					 * Checks whether a Group has Fields which are not bound to an OData model. @param
					 * {sap.ui.comp.smartform.Group} oGroup Control to be checked @returns {boolean} false if group has no fields
					 * with oData binding. @private
					 */
					Utils.hasGroupUnBoundFields = function(oGroup) {
						var aElements = oGroup.getGroupElements();
						for (var j = 0; j < aElements.length; j++) {
							var oElement = aElements[j];
							if (!this.hasGroupElementBoundFields(oElement)) {
								return true;
							}
						}
						return false;
					};

					/*
					 * Checks whether a GroupElement has Fields which are bound to an OData model. @param
					 * {sap.ui.comp.smartform.GroupElement} GroupElement Control to be checked @returns {boolean} true if one
					 * field has oData binding. @private
					 */
					Utils.hasGroupElementBoundFields = function(oGroupElement) {
						var aElements = oGroupElement.getFields();
						if (aElements.length === 0 || !oGroupElement.getVisible()) {
							return true;
						}
						for (var j = 0; j < aElements.length; j++) {
							var oElement = aElements[j];
							if (!oElement.getDomRef()) {
								continue;
							}
							if (this._isElementBound(oElement)) {
								return true;
							}
						}
						return false;
					};

					/**
					 * Checks whether a GroupElement has Fields which are not bound to an OData model.
					 *
					 * @param {sap.ui.comp.smartform.GroupElement}
					 *          GroupElement Control to be checked
					 * @returns {boolean} true if one field has oData binding.
					 * @private
					 */
					Utils.hasGroupElementUnBoundFields = function(oGroupElement) {
						var aElements = oGroupElement.getFields();
						if (aElements.length === 0) {
							return true;
						}
						for (var j = 0; j < aElements.length; j++) {
							var oElement = aElements[j];
							if (!oElement.getDomRef()) {
								continue;
							}
							if (!this._isElementBound(oElement)) {
								return true;
							}
						}
						return false;
					};

					/**
					 * Returns the mandatory fields of a group.
					 *
					 * @param {sap.ui.comp.smartform.GroupElement}
					 *          GroupElement Control to be checked
					 * @returns [object] the array of mandatory fields
					 * @private
					 */
					Utils.getGroupMandatoryElements = function(oGroup) {
						var aResult = [];
						if (oGroup instanceof Group) {
							var aElements = oGroup.getGroupElements();
							for (var i = 0; i < aElements.length; i++) {
								var oElement = aElements[i];
								var aFields = oElement.getFields();
								for (var j = 0; j < aFields.length; j++) {
									var oField = aFields[j];
									if (!oField.getDomRef()) {
										continue;
									}
									if (this.isMandatorySmartField(oField)) {
										aResult.push(oElement);
										break;
									}
								}
							}
						}
						return aResult;
					};

					/**
					 * Checks whether an ObjectPageLayout has sections which are not visible.
					 *
					 * @param {ObjectPageLayout}
					 *          or {ObjectPageSection} ObjectPage Control
					 * @returns {array} array with ObjectPageSection objects
					 * @private
					 */
					Utils.getObjectPageSections = function(oObjectPageControl) {
						var oObjectPageLayout;
						var aSections = [];
						var aStashedSections = [];
						if (oObjectPageControl.getMetadata().getName() === "sap.uxap.ObjectPageSection") {
							oObjectPageLayout = oObjectPageControl.getParent();
						} else if (oObjectPageControl.getMetadata().getName() === "sap.uxap.ObjectPageLayout") {
							oObjectPageLayout = oObjectPageControl;
						}
						aSections = oObjectPageLayout.getAggregation("sections");

						aStashedSections = StashedControlSupport.getStashedControls(oObjectPageLayout.getId());
						aSections = aSections.concat(aStashedSections);

						return aSections;
					};



					/**
					 * Checks whether an ObjectPageLayout has sections which are not visible.
					 *
					 * @param {ObjectPageLayout}
					 *          or {ObjectPageSection} ObjectPage Control to be checked
					 * @returns {boolean} true if one section is invisible.
					 * @private
					 */
					Utils.hasObjectPageLayoutInvisibleSections = function(oObjectPageControl) {
						var aSections = Utils.getObjectPageSections(oObjectPageControl);

						if (aSections.length === 0) {
							return false;
						}
						for (var i = 0; i < aSections.length; i++) {
							if ((aSections[i].getVisible && aSections[i].getVisible() === false) ||
									(aSections[i].getStashed && aSections[i].getStashed() === true)) {
								return true;
							}
						}
						return false;
					};

					/**
					 * Checks whether an Element is bound to an OData Model.
					 *
					 * @param {sap.ui.core.Element}
					 *          oElement element to be checked
					 * @returns {boolean} true if element has oData binding.
					 * @private
					 */
					Utils._isElementBound = function(oElement) {
						var mBindingInfos = oElement.mBindingInfos;
						// No Binding at all
						if (Object.keys(mBindingInfos).length === 0) {
							return false;
						} else {
							for ( var oPropertyName in mBindingInfos) {
								var aParts = mBindingInfos[oPropertyName].parts;
								for (var i = 0; i < aParts.length; i++) {
									if (aParts[i].model) {
										var sModelName = oElement.getModel(aParts[i].model).getMetadata().getName();
										if (sModelName === "sap.ui.model.odata.ODataModel"
												|| sModelName === "sap.ui.model.odata.v2.ODataModel") {
											return true;
										}
									} else {
										var sModelName = oElement.getModel().getMetadata().getName();
										if (sModelName === "sap.ui.model.odata.ODataModel"
												|| sModelName === "sap.ui.model.odata.v2.ODataModel") {
											return true;
										}
									}
								}
							}
						}
					};

					/**
					 * Determines the target index depending on the selected control
					 *
					 * @param {sap.ui.core.Control}
					 *          oSelectedControl Selected Control
					 * @param {sap.ui.core.Control}
					 *          oSelectedBlock Selected block of Controls
					 * @param {Array}
					 *          aControls Array of controls in the block
					 * @returns {integer} iTargetIndex the target index
					 * @private
					 */
					Utils.determineTargetIndex = function(oSelectedControl, oSelectedBlock, aControls, iOffset) {
						var fnClass = oSelectedBlock.getMetadata().getClass();
						var iTargetIndex = (oSelectedControl instanceof fnClass) ? aControls.length - iOffset : aControls.indexOf(oSelectedControl) + 1;

						return iTargetIndex;
					};

					/**
					 * Walks up the DOM to find the next supported block element
					 *
					 * @param {sap.ui.core.Control}
					 *          oControl Control to be checked
					 * @returns {sap.ui.core.Control} the next supported block control
					 * @private
					 */
					Utils.findSupportedBlock = function(oControl, aSupportedControls) {
						if (this._checkIsSupportedControl(oControl, aSupportedControls)) {
							return oControl;
						} else {
							oControl = oControl.getParent();
							while (oControl) {
								if (this._checkIsSupportedControl(oControl, aSupportedControls)) {
									return oControl;
								}
								oControl = oControl.getParent();
							}
						}
					};

					/**
					 * Creates a unique id for a smartField control based on its parent group, entityType and binding path.
					 *
					 * @param {sap.ui.comp.smartform.Group}
					 *          oGroup Control.
					 * @param {String}
					 *          sEntityType entityType which is bound to the group control.
					 * @param {String}
					 *          sBindingPath binding path of the smartField for which a new Id should be created.
					 * @returns {String} new string Id
					 * @private
					 */
					Utils.createFieldLabelId = function(oGroup, sEntityType, sBindingPath) {
						var sControlId = oGroup.getId() + "_" + sEntityType + "_" + sBindingPath;
						sControlId = sControlId.replace("/", "_");
						return sControlId;
					};

					/**
					 * Secure extract a label from an element
					 *
					 * @param {Object}
					 *          any Object
					 * @return {String} a label string or undefined
					 */
					Utils.getLabelForElement = function(oElement) {
						// first try getlabelText(), if not available try getLabel().getText()
						var sFieldLabel = oElement.getLabelText ? oElement.getLabelText() : undefined;
						if (!sFieldLabel) {
							sFieldLabel = oElement.getLabel ? oElement.getLabel() : undefined;
						}
						if (!sFieldLabel) {
							sFieldLabel = oElement.getText ? oElement.getText() : undefined;
						}
						return (typeof sFieldLabel) === "string" ? sFieldLabel : undefined;
					};

					/**
					 * Secure extract path for a binding info.
					 *
					 * @param {Object}
					 *          any Object
					 * @return {String} a path string or undefined
					 */
					Utils.getPathFromBindingInfo = function(oInfo, mBindingInfo) {
						var sPath = mBindingInfo[oInfo] ? mBindingInfo[oInfo] : undefined;
						if (sPath) {
							if ((sPath.parts instanceof Array) && sPath.parts.length > 0) {
								sPath = sPath.parts[0] ? sPath.parts[0] : undefined;
							}
							sPath = ((typeof sPath.path) === "string") ? sPath.path : sPath;
						}
						if ((typeof sPath) === "string") {
							sPath = sPath;
						} else {
							sPath = undefined;
						}
						return sPath;
					};

					/**
					 * Get the entity type based on the binding of a control
					 *
					 * @param {sap.ui.core.Element}
					 *          oElement any Object
					 * @return {String} entity type without namespace
					 */
					Utils.getBoundEntityType = function(oElement) {
						var oModel = oElement.getModel();
						var oBindingContext = oElement.getBindingContext();
						var oEntityTypeMetadata = oModel.oMetadata._getEntityTypeByPath(oBindingContext.getPath());
						return oEntityTypeMetadata.name;
					};

					/**
					 * Allow window.open to be stubbed in tests
					 */
					Utils.openNewWindow = function(sUrl) {
						window.open(sUrl, "_blank");
					};

					// Example: Utils.withTimeLog(this, function(a, b) { return a + b;}, [3, 4]);
					/**
					 * @private
					 */
					// Utils._withTimeLog = function(reciever, fFunctionToBeMeassured, aArguments) {
					// var s = performance.now();
					// var solution = fFunctionToBeMeassured.apply(reciever, aArguments);
					// var result = performance.now() - s;
					// console.error("findChangedFieldLabels_new took " + result + " ms.");
					// return solution;
					// };
					// Some control providers use the odata metadata and others simply stashed fields (objectPage)
					Utils.fetchODataPropertiesFor = function(oModel) {
						var that = this;
						if (!oModel) {
							return new Promise(function(resolve, reject) {
								reject();
							});
						}

						this._oMetadataAnalyzer = new MetadataAnalyser(oModel);
						var oElementPreprocessing = new ElementPreprocessor(this._oMetadataAnalyzer);
						var oMetaModel = oModel.getMetaModel();

						return oMetaModel.loaded().then(
								function() {
									var aEntityTypeNames = that._oMetadataAnalyzer.getAllEntityTypeNames();
									var mAvailableElements = {};
									aEntityTypeNames.forEach(function(sEntityTypeName) {
										mAvailableElements[sEntityTypeName] = that._oMetadataAnalyzer
												.getFieldsByEntityTypeName(sEntityTypeName);
									});
									Object.keys(mAvailableElements).forEach(function(sKey) {
										mAvailableElements[sKey] = oElementPreprocessing._updateAndFilterFields(mAvailableElements[sKey]);
									});
									return mAvailableElements;
								}, function(oReason) {
									jQuery.sap.log.error("MetadataModel could not be loaded", oReason);
								});
					};

					/**
					 * Function to find the binding paths of a given UI5 Element
					 *
					 * @param {sap.ui.core.Element}
					 *          oElement for which the binding info should be found
					 * @returns {Object} valueProperty: the name of the property which is bound
					 * @private
					 */
					Utils.getElementBindingPaths = function(oElement) {
						var aPaths = {};
						if (oElement.mBindingInfos) {
							for ( var oInfo in oElement.mBindingInfos) {
								var sPath = oElement.mBindingInfos[oInfo].parts[0].path
										? oElement.mBindingInfos[oInfo].parts[0].path
										: "";
								sPath = sPath.split("/")[sPath.split("/").length - 1];
								aPaths[sPath] = {
										valueProperty : oInfo
								};
							}
						}
						return aPaths;
					};

					/**
					 * Function to find the binding paths of a given UI5 Element inside a list of odata metadata fields
					 *
					 * @param {object}
					 *          map of binding paths from an ui5 element
					 * @param {object}
					 *          map of a odata metadata field list
					 * @returns {Object} odata metadatafield: the found odata metada field
					 *          element
					 * @private
					 */
					Utils.findFieldBindingPathInFieldsArray = function(mPaths, mHiddenElements) {
						var aPathKeys = Object.keys(mPaths);
						var aDataFieldPaths = Object.keys(mHiddenElements);
						var sFoundPath = "";
						aPathKeys.forEach(function(sPath) {
							if (aDataFieldPaths.indexOf(sPath) >= 0) {
								sFoundPath =  aDataFieldPaths[aDataFieldPaths.indexOf(sPath)];
							}
						});
						return sFoundPath;
					};

					/**
					 * Helper function to create a new smartform group element add command
					 *
					 * @param {sap.ui.comp.smartform.SmartForm}
					 *          oSmartForm in which the field should be added to
					 * @param {sap.ui.comp.smartform.Group}
					 *          oGroup in which the field should be added to
					 * @param {integer}
					 *          index position where the new field should be added
					 * @param {integer}
					 *         array of JS types of each new field
					 * @param {array}
					 *          array of labels for each new field
					 * @param {array}
					 *          array of field values for each new field
					 * @param {array}
					 *          array of field value properties of each new field
					 * @returns {Object}
					 *          returns the created command
					 * @private
					 */
					Utils.createNewAddFieldsCommand = function(oSmartForm, oGroup, iIndex, aJsTypes, aLabels, aValueProperties, aFieldValues) {
						jQuery.sap.require("sap.ui.rta.command.CommandFactory");
						var oAddFieldsCommand = sap.ui.rta.command.CommandFactory.getCommandFor(oGroup, "Add");
						oAddFieldsCommand.setNewControlId(Utils.createNewSmartFormGroupElementId(oSmartForm, aFieldValues));
						oAddFieldsCommand.setIndex(iIndex);
						oAddFieldsCommand.setJsTypes(aJsTypes);
						oAddFieldsCommand.setLabels(aLabels);
						oAddFieldsCommand.setFieldValues(aFieldValues);
						oAddFieldsCommand.setValuePropertys(aValueProperties);
						return oAddFieldsCommand;
					};

					/**
					 * Helper function to create an id for smart group elements within a SmartFrom
					 *
					 * @param {sap.ui.core.Control}
					 *          oParentElement of the group elementt
					 * @param {array} aPaths
					 *          aPaths (binding paths) of the smartfields that are within the group element
					 *
					 * @returns {string}
					 *          returns the new Id
					 */
					Utils.createNewSmartFormGroupElementId = function(oParentElement, aPaths) {
						var sPathId = "";
						var aToBeSortedPaths = aPaths.slice();
						var aSortedPaths = aToBeSortedPaths.sort();
						for (var i = 0; i < aSortedPaths.length; i++) {
							var sPath = aSortedPaths[i].replace("/", "_");
							sPathId = sPathId + "__" + sPath;
						}
						return oParentElement.getId() + sPathId;
					};

					return Utils;
				}, /* bExport= */true);
