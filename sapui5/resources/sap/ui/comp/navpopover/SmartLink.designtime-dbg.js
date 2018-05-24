/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides the Design Time Metadata for the sap.ui.comp.navpopover.SmartLink control.
sap.ui.define([], function() {
	"use strict";
	return {
		annotations: {
			/**
			 * Defines a name of the <code>SemanticObject</code> that can be represented with a <code>Property</code> that is defined within an <code>EntityType</code>.
			 * The <code>SmartLink</code> control can be created from the XML view or from the OData metadata. With this annotation in place, the
			 * <code>SemanticObjectController</code> will provide all the available features for the <code>SmartLink</code> control.
			 *
			 * <i>XML Example of OData V4 with SemanticObject on Product/Name</i>
			 * <pre>
			 *   &lt;Annotations Target=&quot;ProductCollection.Product/Name&quot; xmlns=&quot;http://docs.oasis-open.org/odata/ns/edm&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.SemanticObject&quot; String=&quot;SemanticObjectName&quot; /&gt;
			 *   &lt;/Annotations&gt;
			 * </pre>
			 */
			semanticObject: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "SemanticObject",
				target: ["Property"],
				defaultValue: null,
				appliesTo: ["text", "label", "value"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Defines whether a property is a semantic key that allows a semantic object navigation.
			 *
			 * <i>XML Example of OData V4 with SemanticKey Annotation</i>
			 * <pre>
			 *    &lt;Annotations Target=&quot;SalesOrderType&quot; xmlns=&quot;http://docs.oasis-open.org/odata/ns/edm&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.Common.v1.SemanticKey&quot;&gt;
			 *        &lt;Collection&gt;
			 *          &lt;PropertyPath&gt;SalesOrderID&lt;/PropertyPath&gt;
			 *          &lt;PropertyPath&gt;SalesOrderItemID&lt;/PropertyPath&gt;
			 *        &lt;/Collection&gt;
			 *      &lt;/Annotation&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			semanticKey: {
				namespace: "com.sap.vocabularies.Common.v1",
				annotation: "SemanticKey",
				target: ["EntityType"],
				defaultValue: null,
				appliesTo: ["text", "label", "value"],
				group: ["Behavior"],
				since: "1.28.1"
			},

			/**
			 * Describes the arrangement of a code value and its text. A fixed or dynamic value can be provided as an enumeration by referencing to
			 * another <code>Property</code> within the same <code>EntityType</code>.
			 * <ul>
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst</code><br>
			 * The underlying control is represented with the specified description followed by its ID. </li>
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextLast</code><br>
			 * The underlying control is represented with the specified ID followed by its description. </li>
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly</code><br>
			 * The underlying control is represented with the specified description. </li>
			 * <li><code>com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate</code><br>
			 * The underlying control is represented with the specified ID. </li>
			 * </li>
			 * </ul>
			 *
			 * <i>XML Example of OData V4 with TextArrangement on ProductType</i>
			 * <pre>
			 *    &lt;Annotations Target=&quot;ProductType&quot;&gt;
			 *      &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.TextArrangement&quot; EnumMember=&quot;UI.TextArrangementType/TextFirst&quot;/&gt;
			 *    &lt;/Annotations&gt;
			 * </pre>
			 */
			textArrangement: {
				namespace: "com.sap.vocabularies.UI.v1",
				annotation: "TextArrangement",
				target: ["EntityType"],
				defaultValue: null,
				appliesTo: ["text"],
				group: ["Appearance", "Behavior"],
				since: "1.32.1"
			}
		},

		customData: {

		}
	};
}, /* bExport= */false);
