/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides the Design Time Metadata for the sap.ui.comp.smartfitlerbar.SmartFilterBar control.
sap.ui.define([], function() {
	"use strict";
	return {
		annotations: {
			/**
			 * Defines whether a <code>Property</code> can be used for filtering data.
			 * All properties are filterable by default.
			 * In order to disable filtering capability, these properties must be excluded.
			 *
			 * <b>Note:</b> Currently only OData v2 annotation is supported by the SmartFilterBar control.
			 *
			 * <i>XML Example of OData V4 with Excluded Customer and CompanyCode Properties</i>
			 * <pre>
			 *    &lt;Annotation Term="Org.OData.Capabilities.V1.FilterRestrictions"&gt;
			 *      &lt;PropertyValue Property="NonFilterableProperties"&gt;
			 *        &lt;Collection&gt;
			 *          &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *          &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/PropertyValue&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:filterable</code> annotation on the <code>Property</code> can be used to exclude properties from filtering.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:filterable="false"/&gt;
			 *    &lt;Property Name="CompanyCode" ... sap:filterable="false"/&gt;
			 * </pre>
			 */
			filterable: {
				namespace: "Org.OData.Capabilities.V1",
				annotation: "FilterRestrictions/NonFilterableProperties",
				target: ["EntitySet"],
				defaultValue: true,
				interpretation: "exclude",
				appliesTo: ["filterItem/#/value"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Defines a group for a filter field.
			 * The value can be provided as a fixed or dynamic value of an enumeration by referencing another <code>Property</code>
			 * within the same <code>EntityType</code>.
			 *
			 * <i>XML Example for OData V4 with CompanyName and CompanyCode Properties</i>
			 * <pre>
			 *    &lt;Annotation Term="com.sap.vocabularies.UI.v1.FieldGroup" Qualifier="FieldGroup1"&gt;
			 *      &lt;Record&gt;
			 *        &lt;PropertyValue Property="Label" String="my Field Group 1" /&gt;
			 *        &lt;PropertyValue Property="Data"&gt;
			 *          &lt;Collection&gt;
			 *            &lt;PropertyPath&gt;CompanyName&lt;/PropertyPath&gt;
			 *            &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *          &lt;/Collection&gt;
			 *        &lt;/PropertyValue&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 */
			fieldGroup: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "FieldGroup",
				target: ["EntityType"],
				defaultValue: null,
				appliesTo: ["filterGroupItem"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Describes the arrangement of a code value and its text.
			 * The value can be provided as a fixed or dynamic value of an enumeration by referencing another <code>Property</code>
			 * within the same <code>EntityType</code>.
			 * The enumeration members can have the following values:
			 * <ul>
			 *    <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst</code><br>
			 *       The underlying control is represented with the specified description followed by its ID.
			 *    </li>
			 *    <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly</code><br>
			 *       The underlying control is represented with the specified description only.
			 *    </li>
			 * </ul>
			 *
			 * <i>XML Example of OData V4 with EntityType ProductType</i>
			 * <pre>
			 *    &lt;Annotations Target="ProductType"&gt;
			 *      &lt;Annotation Term="com.sap.vocabularies.UI.v1.TextArrangement" EnumMember="com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			textArrangement: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "TextArrangement",
				target: ["EntityType"],
				defaultValue: null,
				appliesTo: ["text"],
				group: ["Appearance","Behavior"],
				since: "1.32.1"
			},

			/**
			 * Defines whether the filter is visible.
			 * The SmartFilterBar interprets the <code>EnumMember</code> <code>FieldControlType/Hidden</code> of the <code>FieldControl</code> annotation for setting the visibility.
			 *
			 * <b>Note:</b> Currently only <code>FieldControlType/Hidden</code> is supported for statically hiding the filter fields.
			 *
			 * <i>XML Example of OData V4 with Hidden Customer and CompanyCode Properties</i>
			 * <pre>
			 *    &lt;Property Name="Customer"&gt;
			 *      &lt;Annotation Term="com.sap.vocabularies.Common.v1.FieldControlType/Hidden"/&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name="CompanyCode"&gt;
			 *      &lt;Annotation Term="com.sap.vocabularies.Common.v1.FieldControlTpye/Hidden"/&gt;
			 *    &lt;/Property&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:visible</code> annotation on the <code>Property</code> can be used to assign visibility.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:visible="false"/&gt;
			 *    &lt;Property Name="CompanyCode" ... sap:visible="false"/&gt;
			 * </pre>
			 */
			filterVisible: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FieldControlType/Hidden",
				target: ["Property"],
				defaultValue: false,
				appliesTo: ["filterItem/#/visible"],
				group: ["Behavior"],
				since: "1.32.1"
			},

			/**
			 * Contains annotations that provide information for rendering a <code>ValueHelpList</code> that are set on the <code>Property</code>.
			 * Each Parameter on the <code>ValueList</code> annotation has maximum of two properties:
			 * <ol>
			 *   <li>LocalDataProperty - Path to the property on the local entity that triggered the ValueList.</li>
			 *   <li>ValueListProperty - Path to property in on the ValueList entity.</li>
			 * </ol>
			 *
			 * <i>XML Example of OData V4 with Category having ValueList</i>
			 * <pre>
			 *    &lt;Annotation Term="com.sap.vocabularies.Common.v1.ValueList"&gt;
			 *      &lt;Record&gt;
			 *        &lt;PropertyValue Property="Label" String="Category" /&gt;
			 *        &lt;PropertyValue Property="CollectionPath" String="Category" /&gt;
			 *        &lt;PropertyValue Property="SearchSupported" Bool="true" /&gt;
			 *        &lt;PropertyValue Property="Parameters"&gt;
			 *        &lt;Collection&gt;
			 *          &lt;Record Type="com.sap.vocabularies.Common.v1.ValueListParameterOut"&gt;
			 *            &lt;PropertyValue Property="LocalDataProperty" PropertyPath="Category" /&gt;
			 *            &lt;PropertyValue Property="ValueListProperty" String="Description" /&gt;
			 *          &lt;/Record&gt;
			 *          &lt;Record Type="com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"&gt;
			 *            &lt;PropertyValue Property="ValueListProperty" String="CategoryName" /&gt;
			 *          &lt;/Record&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 */
			valueList: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "ValueList",
				target: ["Property", "Parameter"],
				defaultValue: null,
				appliesTo: ["filterItem/#/fieldHelp"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * A short, human-readable text suitable for the filter's name.
			 * The <code>com.sap.vocabularies.Common.v1.Label</code> annotation  is defined on the <code>Property</code>.
			 * If the <code>com.sap.vocabularies.Common.v1.Label</code> annotation is given, it has precedence.
			 * If none of the annotations are given, then the label will be the Property name.
			 *
			 * <i>XML Example for OData V4 where CustomerName is the Label assigned to Customer</i>
			 * <pre>
			 *    &lt;Property Name="Customer" /&gt;
			 *    &lt;Annotation Term="com.sap.vocabularies.Common.v1.Label" Path="Customer" String="Customer Name"/&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:label</code> annotation on the <code>Property</code> can be used to define the label of the column.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:label="Customer Name"/&gt;
			 * </pre>
			 *
			 */
			filterLabelOnProperty: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "Label",
				target: ["Property", "PropertyPath"],
				defaultValue: null,
				appliesTo: ["filterItem/label"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * A short, human-readable text suitable for the filter's name.
			 * The <code>Label<code> annotation of <code>com.sap.vocabularies.UI.v1.DataFieldAbstract</code> is defined within <code>com.sap.vocabularies.UI.v1.LineItem</code> annotation.
			 * If the <code>com.sap.vocabularies.Common.v1.Label</code> annotation is given, it has precedence.
			 * If none of the annotations are given, then the label will be the Property name of the column.
			 *
			 * <i>XML Example for OData V4 where CustomerName is the Label assigned to Customer</i>
			 * <pre>
			 *    &lt;Property Name="Customer"&gt;
			 *     &lt;Annotation Term="com.sap.vocabularies.Common.v1.Label" Path="CustomerName" /&gt;
			 *    &lt;/Property&gt;
			 *    &lt;Property Name="CustomerName" type="Edm.String" /&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:label</code> annotation on the <code>Property</code> can be used to define the label of the column.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:label="My Customer"/&gt;
			 * </pre>
			 *
			 */
			filterLabelOnLineItem: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "LineItem/Label",
				target: ["Property", "Parameter"],
				appliesTo: ["filterItem/label"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Defines the filter field as mandatory filter.
			 * Filter fields having this annotation must be a part of the <code>$filter</code> request sent to the back-end.
			 *
			 * <b>Note:</b> Currently only OData v2 annotation is supported by the <code>SmartFilterBar</code> control.
			 *
			 * <i>XML Example of OData V4 with Required CompanyCode Filter</i>
			 * <pre>
			 *    &lt;Annotation Term="Org.OData.Capabilities.V1.FilterRestrictions"&gt;
			 *      &lt;Record&gt;
			 *          &lt;PropertyValue Property="RequiresFilter" Bool="true"/&gt;
			 *          &lt;PropertyValue Property="RequiredProperties"&gt;
			 *           &lt;Collection&gt;
			 *              &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *           &lt;/Collection&gt;
			 *        &lt;/PropertyValue&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:required-in-filter</code> annotation on the <code>Property</code> can be used for setting the filter as a mandatory filter field.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:required-in-filter="true"/&gt;
			 *    &lt;Property Name="CompanyCode" ... sap:required-in-filter="true"/&gt;
			 * </pre>
			 */
			requiredInFilter: {
				namespace: "Org.OData.Capabilities.V1",
				annotation: "FilterRestrictions/RequiredProperties",
				target: ["EntitySet"],
				defaultValue: true,
				appliesTo: ["filterItem/#/value"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Defines whether multiple values can be used in a single filter.
			 * With multi-value filtering, more that one "equals" condition can be defined for filtering the data.
			 *
			 * <b>Note:</b> Currently only OData v2 annotation is supported by the <code>SmartFilterBar</code> control.
			 *
			 * <i>XML Example of OData V4 with Multi-value Customer and CompanyCode Properties</i>
			 * <pre>
			 *    &lt;Annotation Term="com.sap.vocabularies.Common.v1.FilterExpressionRestriction" 
			 *      EnumMember="com.sap.vocabularies.Common.v1.FilterExpressionType/MultiValue&gt;
			 *      &lt;Record&gt;
			 *        &lt;Collection&gt;
			 *          &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *          &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:filter-restriction="multi-value"</code> annotation on the <code>Property</code> can be used for rendering multi-value filter field.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:filter-restriction="multi-value"/&gt;
			 *    &lt;Property Name="CompanyCode" ... sap:filter-restriction="multi-value"/&gt;
			 * </pre>
			 */
			multiValueFilter: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FilterExpressionRestrictions/MultiValue",
				target: ["EntitySet"],
				defaultValue: null,
				appliesTo: ["filterItem/#/input"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Restricts the filter to only <b>one</b> single value entry.
			 * With single-value filtering, you cannot define more than one "equals" condition for filtering the data.
			 *
			 * <b>Note:</b> Currently only OData v2 annotation is supported by the <code>SmartFilterBar</code> control.
			 *
			 * <i>XML Example of OData V4 with Single-value Customer and CompanyCode Properties</i>
			 * <pre>
			 *    &lt;Annotation Term="com.sap.vocabularies.Common.v1.FilterExpressionRestriction"
			 *      EnumMember="com.sap.vocabularies.Common.v1.FilterExpressionType/SingleValue&gt;
			 *      &lt;Record&gt;
			 *        &lt;Collection&gt;
			 *          &lt;PropertyPath&gt;Customer&lt;/PropertyPath&gt;
			 *          &lt;PropertyPath&gt;CompanyCode&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:filter-restriction="single-value"</code> annotation on the <code>Property</code> can be used for rendering a single-value filter field.
			 * <pre>
			 *    &lt;Property Name="Customer" ... sap:filter-restriction="single-value"/&gt;
			 *    &lt;Property Name="CompanyCode" ... sap:filter-restriction="single-value"/&gt;
			 * </pre>
			 */
			singleValueFilter: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FilterExpressionRestrictions/SingleValue",
				target: ["EntitySet"],
				defaultValue: null,
				appliesTo: ["filterItem/#/input"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Restricts the filter to specify an interval, for example, a date interval for filtering the data present between the given dates.
			 *
			 * <b>Note:</b> Currently only OData v2 annotation is supported by the <code>SmartFilterBar</code> control.
			 *
			 * <i>XML Example of OData V4 with Interval Restriction on DocumentDate Property</i>
			 * <pre>
			 *    &lt;Annotation Term="com.sap.vocabularies.Common.v1.FilterExpressionRestriction"
			 *      EnumMember="com.sap.vocabularies.Common.v1.FilterExpressionType/SingleInterval&gt;
			 *      &lt;Record&gt;
			 *        &lt;Collection&gt;
			 *          &lt;PropertyPath&gt;DocumentDate&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/Record&gt;
			 *    &lt;/Annotation&gt;
			 * </pre>
			 *
			 * For OData v2 the <code>sap:filter-restriction="interval"</code> annotation on the <code>Property</code> can be used for rendering an interval filter field.
			 * <pre>
			 *    &lt;Property Name="DocumentDate" ... sap:filter-restriction="interval"/&gt;
			 * </pre>
			 */
			singleIntervalFilter: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "FilterExpressionRestrictions/SingleInterval",
				target: ["EntitySet"],
				defaultValue: null,
				appliesTo: ["filterItem/#/input"],
				group: ["Behavior"],
				since: "1.28.1"
			}
		},

		customData: {

		}
	};
}, /* bExport= */false);