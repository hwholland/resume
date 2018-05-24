/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the LayerProxy class.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/base/ManagedObject"
], function(jQuery, library, ManagedObject) {
	"use strict";

	var getJSONObject = sap.ui.vk.dvl.getJSONObject;

	/**
	 * Constructor for a new LayerProxy.
	 *
	 * @class
	 * Provides a proxy object to the layer in the node hierarchy.
	 *
	 * Layer is a list of nodes. One node hierarchy can have multiple layers. One node can be included in multiple layers.
	 *
	 * Objects of this type should only be created with the {@link sap.ui.vk.NodeHierarchy#createLayerProxy sap.ui.vk.NodeHierarchy.createLayerProxy} method.
	 * and destroyed with the {@link sap.ui.vk.NodeHierarchy#destroyLayerProxy sap.ui.vk.NodeHierarchy.destroyLayerProxy} method.
	 *
	 * @param {sap.ui.vk.NodeHierarchy} nodeHierarchy The node hierarchy the layer belongs to.
	 * @param {string} layerId The layer ID.
	 * @public
	 * @author SAP SE
	 * @version 1.38.15
	 * @extends sap.ui.base.ManagedObject
	 * @alias sap.ui.vk.LayerProxy
	 * @experimental Since 1.38.0 This class is experimental and might be modified or removed in future versions.
	 */
	var LayerProxy = ManagedObject.extend("sap.ui.vk.LayerProxy", /** @lends sap.ui.vk.LayerProxy.prototype */ {
		metadata: {
			properties: {
				/**
				 * The layer ID. This property is read-only.
				 */
				layerId: "string",

				/**
				 * The layer VE IDs. This property is read-only.
				 */
				veIds: "object[]",

				/**
				 * The name of the node. This property is read-only.
				 */
				name: "string",

				/**
				 * The description of the layer. This property is read-only.
				 */
				description: "string",

				/**
				 * The node metadata. This property is read-only.
				 */
				layerMetadata: "object"
			}
		},

		constructor: function(nodeHierarchy, layerId) {
			ManagedObject.call(this);

			this._dvl = nodeHierarchy ? nodeHierarchy.getGraphicsCore()._getDvl() : null;
			this._dvlSceneId = nodeHierarchy ? nodeHierarchy._getDvlSceneId() : null;
			this._dvlLayerId = layerId;
		}
	});

	LayerProxy.prototype.destroy = function() {
		this._dvlLayerId = null;
		this._dvlSceneId = null;
		this._dvl = null;

		ManagedObject.prototype.destroy.call(this);
	};

	LayerProxy.prototype.getLayerId = function() {
		return this._dvlLayerId;
	};

	LayerProxy.prototype.getVeIds = function() {
		return getJSONObject(this._dvl.Scene.RetrieveVEIDs(this._dvlSceneId, this._dvlLayerId));
	};

	LayerProxy.prototype.getName = function() {
		return getJSONObject(this._dvl.Scene.RetrieveLayerInfo(this._dvlSceneId, this._dvlLayerId)).name;
	};

	LayerProxy.prototype.getDescription = function() {
		return getJSONObject(this._dvl.Scene.RetrieveLayerInfo(this._dvlSceneId, this._dvlLayerId)).description;
	};

	LayerProxy.prototype.getLayerMetadata = function() {
		return getJSONObject(this._dvl.Scene.RetrieveMetadata(this._dvlSceneId, this._dvlLayerId)).metadata;
	};

	LayerProxy.prototype.getNodes = function() {
		return getJSONObject(this._dvl.Scene.RetrieveLayerInfo(this._dvlSceneId, this._dvlLayerId)).nodes;
	};

	delete LayerProxy.prototype.setDescription;
	delete LayerProxy.prototype.setLayerId;
	delete LayerProxy.prototype.setLayerMetadata;
	delete LayerProxy.prototype.setName;
	delete LayerProxy.prototype.setVeIds;

	return LayerProxy;
});
