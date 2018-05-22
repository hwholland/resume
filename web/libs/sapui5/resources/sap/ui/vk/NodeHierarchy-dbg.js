/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the NodeHierarchy class.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/base/EventProvider", "sap/ui/base/ObjectPool", "./BaseNodeProxy", "./NodeProxy", "./LayerProxy", "./Messages"
], function(jQuery, library, EventProvider, ObjectPool, BaseNodeProxy, NodeProxy, LayerProxy, Messages) {
	"use strict";

	var getJSONObject = sap.ui.vk.dvl.getJSONObject;

	/**
	 * Constructor for a new NodeHierarchy.
	 *
	 * @class
	 * Provides the ability to explore a Scene object's node structure.
	 *
	 * The objects of this class should not be created directly, and should only be created via a call to {@link sap.ui.vk.Scene#getDefaultNodeHierarchy sap.ui.vk.Scene#getDefaultNodeHierarchy}.
	 *
	 * @param {sap.ui.vk.Scene} scene The Scene object the node hierarchy belongs to.
	 * @public
	 * @author SAP SE
	 * @version 1.38.15
	 * @extends sap.ui.base.EventProvider
	 * @alias sap.ui.vk.NodeHierarchy
	 * @experimental Since 1.32.0 This class is experimental and might be modified or removed in future versions.
	 */
	var NodeHierarchy = EventProvider.extend("sap.ui.vk.NodeHierarchy", /** @lends sap.ui.vk.NodeHierarchy.prototype */ {
		metadata: {
			publicMethods: [
				"createNodeProxy",
				"destroyNodeProxy",
				"enumerateAncestors",
				"enumerateChildren",
				"getGraphicsCore",
				"getScene",
				"getChildren",
				"getAncestors"
			]
		},

		_baseNodeProxyPool: new ObjectPool(BaseNodeProxy),

		constructor: function(scene) {
			this._messages = new Messages();
			EventProvider.apply(this);

			this._graphicsCore = scene.getGraphicsCore();
			this._scene = scene;
			this._dvlSceneId = this._scene._getDvlSceneId();
			this._dvl = this._graphicsCore._getDvl();
			this._nodeProxies = [];
			this._layerProxies = [];

			//This is a dictionary that we use to convert query values
			//from strings to actual numbers that are passed to DVL when finding nodes.
			//The DVL method FindNodes requires integer values as parameters so it's better
			//to avoid passing "0" or "1" as arguments. Instead we can make conversions such as
			//string "equals" to the DvlEnum "sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL"
			//which is an integer.
			this._searchDictionary = {
				modeDictionary: {
					equals: function(isCaseSensitive) {
						return isCaseSensitive ? sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL : sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE;
					},
					contains: function(isCaseSensitive) {
						return isCaseSensitive ? sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING : sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE;
					},
					startsWith: function(isCaseSensitive) {
						return isCaseSensitive ? sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_STARTS_WITH : sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE;
					}
				}
			};
		}
	});

	NodeHierarchy.prototype.destroy = function() {
		this._layerProxies.slice().forEach(this.destroyLayerProxy, this);
		this._nodeProxies.slice().forEach(this.destroyNodeProxy, this);
		this._dvl = null;
		this._dvlSceneId = null;
		this._scene = null;
		this._graphicsCore = null;
		this._searchDictionary = null;

		EventProvider.prototype.destroy.apply(this);
	};

	/**
	 * Gets the GraphicsCore object this Scene object belongs to.
	 * @returns {sap.ui.vk.GraphicsCore} The GraphicsCore object this Scene object belongs to.
	 * @public
	 */
	NodeHierarchy.prototype.getGraphicsCore = function() {
		return this._graphicsCore;
	};

	/**
	 * Gets the Scene object the node hierarchy belongs to.
	 * @returns {sap.ui.vk.Scene} The Scene object the node hierarchy belongs to.
	 * @public
	 */
	NodeHierarchy.prototype.getScene = function() {
		return this._scene;
	};

	/**
	 * Gets the DVL scene ID.
	 * @returns {string} The DVL scene ID.
	 * @private
	 */
	NodeHierarchy.prototype._getDvlSceneId = function() {
		return this._dvlSceneId;
	};

	/**
	 * Enumerates the child nodes of a particular node in the Scene object.
	 *
	 * This method gets the child nodes of a particular node, and then calls the <code>callback</code> function to which it passes the child nodes to one by one.<br/>
	 * The <code>BaseNodeProxy</code> objects passed to the <code>callback</code> fuction are temporary objects, which are reset after each call to the <code>callback</code> function.<br/>
	 *
	 * @param {string} [nodeId] The ID of a node whose child nodes we want enumerated.<br/>
	 * When <code>nodeId</code> is specified, the child nodes of this node are enumerated.<br/>
	 * When no <code>nodeId</code> is specified, only the top level nodes are enumerated.<br/>

	 * @param {function} callback A function to call when the child nodes are enumerated. The function takes one parameter of type {@link sap.ui.vk.BaseNodeProxy}, or string if parameter <code>passNodeId</code> parameter is <code>true</code>.

	 * @param {boolean} [stepIntoClosedNodes=false] Indicates whether to enumerate the child nodes if the node is <i>closed</i>. <br/>
	 * If <code>true</code>, the children of that closed node will be enumerated <br/>
	 * If <code>false</code>, the children of that node will not be enumerated<br/>

	 * @param {boolean} [passNodeId=false] Indicates whether to pass the node IDs of the child nodes, or the whole node proxy to the <code>callback</code> function. <br/>
	 * If <code>true</code>, then only the node IDs of the child nodes are passed to the <code>callback</code> function. <br/>
	 * If <code>false</code>, then the node proxies created from the child node IDs are passed to the <code>callback</code> function.

	 * @returns {sap.ui.vk.NodeHierarchy} <code>this</code> to allow method chaining.
	 * @public
	 */
	NodeHierarchy.prototype.enumerateChildren = function(nodeId, callback, stepIntoClosedNodes, passNodeId) {
		if (typeof nodeId === "function") {
			// The 'nodeId' parameter is omitted, let's shift the parameters to right.
			passNodeId = stepIntoClosedNodes;
			stepIntoClosedNodes = callback;
			callback = nodeId;
			nodeId = undefined;
		}

		// NB: At the moment DVL scenes support only one hierarchy, so we just enumerate top level nodes of the scene if nodeId is omitted.
		var nodeIds;
		if (nodeId) {
			// Child nodes of the node.
			if (stepIntoClosedNodes || (getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags & sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_CLOSED) === 0) {
				nodeIds = getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN)).ChildNodes;
			} else {
				// Do not step into closed nodes.
				nodeIds = [];
			}
		} else {
			// Top level nodes.
			nodeIds = getJSONObject(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId, sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN)).ChildNodes;
		}
		if (passNodeId) {
			nodeIds.forEach(callback);
		} else {
			var nodeProxy = this._baseNodeProxyPool.borrowObject();
			try {
				nodeIds.forEach(function(nodeId) {
					nodeProxy.init(this, nodeId);
					callback(nodeProxy);
					nodeProxy.reset();
				}.bind(this));
			} finally {
				this._baseNodeProxyPool.returnObject(nodeProxy);
			}
		}

		return this;
	};

	/**
	* Enumerates the ancestor nodes of a particular node in the Scene object.
	*
	* This method enumerates the ancestor nodes of a particular node, and then calls the <code>callback</code> function, to which it passes the ancestor nodes to one by one.<br/>
	* The BaseNodeProxy objects passed to <code>callback</code> are temporary objects, they are reset after each call to the <code>callback</code> function.<br/>
	* The ancestor nodes are enumerated starting from the top level node, and progresses down the node hierarchy.
	*
	* @param {string} nodeId The ID of a node whose ancestore nodes we want enumerated.

	* @param {function} callback A function to call when the ancestor nodes are enumerated. The function takes one parameter of type {@link sap.ui.vk.BaseNodeProxy}, or string if parameter <code>passNodeId</code> parameter is <code>true</code>.

	* @param {boolean} [passNodeId=false] Indicates whether to pass the node IDs of the ancestore nodes, or the whole node proxy to the <code>callback</code> function.<br/>
	If <code>true</code>, then only the node IDs of the ancestor nodes are passed to the <code>callback</code> function. <br/>
	If <code>false</code>, then the node proxies of the ancestor nodes are passed to the <code>callback</code> function.

	* @returns {sap.ui.vk.NodeHierarchy} <code>this</code> to allow method chaining.
	* @public
	*
	*/
	NodeHierarchy.prototype.enumerateAncestors = function(nodeId, callback, passNodeId) {
		var nodeIds = getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS)).ParentNodes;

		if (passNodeId) {
			nodeIds.forEach(callback);
		} else {
			var nodeProxy = this._baseNodeProxyPool.borrowObject();
			try {
				nodeIds.forEach(function(nodeId) {
					nodeProxy.init(this, nodeId);
					callback(nodeProxy);
					nodeProxy.reset();
				}.bind(this));
			} finally {
				this._baseNodeProxyPool.returnObject(nodeProxy);
			}
		}

		return this;
	};

	/**
	 * Creates a node proxy object.
	 *
	 * The node proxy object must be destroyed with the {@link #destroyNodeProxy destroyNodeProxy} method.
	 *
	 * @param {string} nodeId The node ID for which to create a proxy object.
	 * @returns {sap.ui.vk.NodeProxy} The proxy object.
	 * @public
	 */
	NodeHierarchy.prototype.createNodeProxy = function(nodeId) {
		var nodeProxy = new NodeProxy(this, nodeId);
		this._nodeProxies.push(nodeProxy);
		return nodeProxy;
	};

	/**
	 * Destroys the node proxy object.
	 *
	 * @param {sap.ui.vk.NodeProxy} nodeProxy The node proxy object.
	 * @returns {sap.ui.vk.NodeHierarchy} <code>this</code> to allow method chaining.
	 * @public
	 */
	NodeHierarchy.prototype.destroyNodeProxy = function(nodeProxy) {
		var index = this._nodeProxies.indexOf(nodeProxy);
		if (index >= 0) {
			this._nodeProxies.splice(index, 1)[0].destroy();
		}
		return this;
	};

	/**
	* Returns a list of IDs belonging to the children of a particular node.
	*
	* @param {string} nodeId The node ID of the node whose children will be returned. If <code>nodeId</code> is not passed to the <code>getChildren</code> function, the IDs of the root nodes will be returned.
	* @param {boolean} [stepIntoClosedNodes=false] Indicates whether to return only the child nodes of a <i>closed</i> node or not. If <code>true</code>, then the children of that closed node  will be returned. If <code>false</code>, then the children of that <i>closed</i> node will not be returned.
	* @returns {array} A list of IDs belonging to the children of <code>nodeId</code>.
	* @public
	*/
	NodeHierarchy.prototype.getChildren = function(nodeId, stepIntoClosedNodes) {
		//if nodeId is not passed, but stepIntoClosedNodes is passed as a boolean
		if (typeof nodeId === "boolean") {
			stepIntoClosedNodes = nodeId;
			nodeId = undefined;
		}

		if (nodeId) {
			// Child nodes of the node.
			if (stepIntoClosedNodes || (getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags & sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_CLOSED) === 0) {
				return getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN)).ChildNodes;
			} else {
				// Do not step into closed nodes.
				return [];
			}
		} else {
			// Top level nodes.
			return getJSONObject(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId, sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN)).ChildNodes;
		}
	};

	/**
	* Returns a list of IDs belonging to the ancestors of a particular node.
	*
	* @param {string} nodeId The node ID of the node whose ancestors will be returned.
	* @returns {array} A list of IDs belonging to the ancestors of <code>nodeId</code>.
	* @public
	*/
	NodeHierarchy.prototype.getAncestors = function(nodeId) {
		return getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId, nodeId, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS)).ParentNodes;
	};

	/**
	 * Searches for VE IDs, and returns a list of IDs of nodes with VE IDs matching the search.
	 * The query is run specifically against VE ID structures, which are strictly related to VDS4 models.
	 *
	 * @param {object} query JSON object containing the search parameters. <br/>
	 * The following example shows what the structure of the <code>query</code> object should look like:
	 * <pre>query = {
	 * 	source: <i>string</i> (if not specified, the query returns an empty array), <br>
	 * 	type: <i>string</i> (if not specified, the query returns an empty array), <br>
	 * 	fields: <i>field[]</i>
	 * 	}</pre>
	 * 	<br/>
	 * 	<ul>
	 * 		<li>
	 * 			<b>field.name</b><br/> A string containing the name of the VE ID.
	 * 			If no value is specified, then the query will return an empty array.<br/>
	 * 		</li>
	 * 		<li>
	 * 			<b>field.value</b><br/> A string representing the search keyword.
	 * 			If no value is specified, it defaults to empty string.<br/>
	 * 			The following example shows a string being passed in:
	 * 			<pre>value: "Box #14"</pre>
	 * 		</li>
	 * 		<li>
	 * 			<b>field.predicate</b><br/> Represents a search mode.
	 * 			The available search modes are <code>"equals"</code>, <code>"contains"</code>, and <code>"startsWith"</code>. <br/>
	 * 			Using <code>"equals"</code> will search for IDs with names that exactly match the provided string. <br/>
	 * 			Using <code>"contains"</code> will search for IDs with names containing the provided string. <br/>
	 * 			Using <code>"startsWith"</code> will search for IDs with names starting with the provided string. <br/>
	 * 			If no value is specified, the search mode will default to <code>"equals"</code>. <br/><br/>
	 * 		</li>
	 * 		<li>
	 * 			<b>field.caseSensitive</b><br/> Indicates whether the search should be case sensitive or not. <br/>
	 * 			If <code>true</code>, the search will be case sensitive, and <code>false</code> indicates otherwise. <br/>
	 * 			If no value is specified, <code>caseSensitive</code> will default to <code>false</code> (that is, the search will be a case-insensitive search).
	 * 		</li>
	 * 	</ul>
	 * @returns {string[]} A list of IDs belonging to nodes that matched the VE IDs search criteria.
	 * @public
	 */
	NodeHierarchy.prototype.findNodesById = function(query) {

		//Checking if the query id values should be case sensitive or not.
		//If they are not case sensitive, we make them all lower-case.
		if (query.fields.some(function(field) { return !field.caseSensitive; })) {
			//we clone the query object that gets passed as parameter so we don't modify the original one.
			query = jQuery.extend(true, {}, query);
			//we change all the search values to lower-case.
			query.fields.forEach(function(field) {
				if (!field.caseSensitive) {
					field.value = field.value.toLowerCase();
				}
			});
		}

		//compareValuesByPredicate compares query value for an id with the value of a ve id from the node.
		//This function compares them using the predicate from the query (equals, contains, startsWith)
		var compareValuesByPredicate = function(predicate, isCaseSensitive, veFieldValueString, queryFieldValue) {
			var matchFound;
			//if the predicate is undefined, it will default to "equals"
			predicate = predicate || "equals";
			//if the query value is undefined, we make it an empty string
			queryFieldValue = queryFieldValue || "";

			var veFieldValue = isCaseSensitive ? veFieldValueString : veFieldValueString.toLowerCase();

			switch (predicate) {
				case "equals":
					matchFound = (veFieldValue === queryFieldValue);
					break;
				case "contains":
					matchFound = (veFieldValue.indexOf(queryFieldValue) !== -1);
					break;
				case "startsWith":
					matchFound = (veFieldValue.indexOf(queryFieldValue) === 0);
					break;
				default:
					matchFound = false;
					//if the predicate is not a supported one, we show a relevant error in the console
					jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT8.summary), this._messages.messages.VIT8.code, "sap.ui.vk.NodeHierarchy");
			}
			return matchFound;
		};
		//Queries can have multiple ids in the array so we use this function to search in array of ids
		//and see if the id is missing from that list or not.
		var isQueryIdObjectMissingFromArrayOfIds = function(listOfFields, queryFieldObject) {
			return !listOfFields.some(function(veFieldObject) {
				return queryFieldObject.name === veFieldObject.name ? compareValuesByPredicate(queryFieldObject.predicate, queryFieldObject.caseSensitive, veFieldObject.value, queryFieldObject.value) : false;
			});
		};

		//The filtering function takes the query and the collection of ve ids as parameters.
		//This function throws away all the nodes that are missing query ids from their list of ve ids.
		var filteringFunction = function(query, veIds) {
			//First we check if the query source and the query type are matching.
			//Then we check if all ids from the query are found in the list of ids that each node has.
			//If at least one id is missing, that we don't need to keep that node
			//because it doesn't match the query.
			return query.source === veIds.source && query.type === veIds.type && !query.fields.some(isQueryIdObjectMissingFromArrayOfIds.bind(undefined, veIds.fields));
		};

		//We retrieve a list of all node ids.
		var allNodeIds = this.findNodesByName();

		//We filter the list of node ids and we keep only what matches the query.
		var filteredNodeIds = allNodeIds.filter(function(nodeId) {
			//We create a node proxy based on each node id.
			var nodeProxy = this.createNodeProxy(nodeId);
			//We retrieve the ve ids from each node proxy.
			var veIds = nodeProxy.getVeIds();
			//we destroy the node proxy after using it.
			this.destroyNodeProxy(nodeProxy);
			//we filter then return the nodes that match the query.
			return veIds.some(filteringFunction.bind(undefined, query));
		}.bind(this));

		return filteredNodeIds;
	};

	/**
	* Finds nodes in a scene via node name.
	*
	* @param {object} query JSON object containing the search parameters. <br/>
	* The following example shows what the structure of the <code>query</code> object should look like:
	* <pre>query = {
	* 	value: <i>string</i> | <i>string[]</i>,
	* 	predicate: <i>"equals"</i> | <i>"contains"</i> | <i>"startsWith"</i>,
	* 	caseSensitive: <i>true</i> | <i>false</i>
	* }</pre>
	* <br/>
	* <ul>
	* 	<li>
	* 		<b>query.value</b><br/> A string or an array of strings containing the name of a node or names of nodes.
	* 		If no value is specified, then all nodes in the scene will be returned.<br/>
	* 		The following example shows a single string being passed in:
	* 		<pre>value: "Box #14"</pre>
	* 		The following example shows an array of strings being passed in:
	* 		<pre>value: ["Box #3", "box #4", "BOX #5"]</pre>
	* 	</li>
	* 	<li>
	* 		<b>query.predicate</b><br/> Represents a search mode.
	* 		The available search modes are <code>"equals"</code>, <code>"contains"</code>, and <code>"startsWith"</code>. <br/>
	* 		Using <code>"equals"</code> will search for nodes with names that exactly match the provided string or array of strings. <br/>
	* 		Using <code>"contains"</code> will search for nodes with names containing all or part of the provided string or array of strings. <br/>
	* 		Using <code>"startsWith"</code> will search for nodes with names starting with the provided string or array of strings. <br/>
	* 		If no value is specified, the search mode will default to <code>"equals"</code>. <br/><br/>
	* 	</li>
	* 	<li>
	* 		<b>query.caseSensitive</b><br/> Indicates whether the search should be case sensitive or not. <br/>
	* 		If <code>true</code>, the search will be case sensitive, and <code>false</code> indicates otherwise. <br/>
	* 		If no value is specified, <code>caseSensitive</code> will default to <code>false</code> (that is, the search will be a case-insensitive search).
	* 	</li>
	* </ul>
	* @returns {string[]} A list of IDs belonging to nodes that matched the search criteria.
	* @public
	*/
	NodeHierarchy.prototype.findNodesByName = function(query) {

			//searchType is in this case by name
		var searchType = sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME,
			//allSearchResults is the array that the function returns
			allSearchResults = [],
			//search mode can be  "equals", "contains", "startsWith",
			//each of these modes having a caseSensitive true or false option
			searchMode,
			searchStringsArray;

		if (query === undefined || query === null || jQuery.isEmptyObject(query)) {
			//this condition caters for the case where the query is null, undefined or empty object
			//we search for nodes that contain an empty string ("");
			searchMode = this._searchDictionary.modeDictionary.contains(false);
			searchStringsArray = [""];
		} else {
			//query object validation
			if (query.value === undefined || query.value === null || query.value === "") {
				jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT6.summary), this._messages.messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			}

			var predicate = query.hasOwnProperty("predicate") ? query.predicate : "equals";
			if (predicate === undefined || predicate === null || predicate === "") {
				jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT7.summary), this._messages.messages.VIT7.code, "sap.ui.vk.NodeHierarchy");
			} else if (["equals", "contains", "startsWith"].indexOf(predicate) === -1) {
				jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT8.summary), this._messages.messages.VIT8.code, "sap.ui.vk.NodeHierarchy");
			}

			searchMode = this._searchDictionary.modeDictionary[predicate](query.caseSensitive);
			//If we search for a string, we create an array having one element, the string.
			//If we search for an array of strings, we leave the array as is.
			searchStringsArray = (typeof query.value === "string") ? [query.value] : query.value;
		}

		//We multiple calls to the DVL api; one call pe search string from array of search strings.
		for (var i = 0; i < searchStringsArray.length; i++) {
			allSearchResults = allSearchResults.concat(getJSONObject(this._dvl.Scene.FindNodes(this._dvlSceneId, searchType, searchMode, searchStringsArray[i])).nodes);
		}

		//We sort the array and remove all duplicate node ids
		return jQuery.sap.unique(allSearchResults);
	};

	/**
	* Finds nodes in a scene via metadata information.
	*
	* @param {object} query JSON object containing the search parameters. <br/>
	* The following example shows what the structure of the <code>query</code> object should look like:
	* 	<pre>query = {
	* 		category: <i>string</i>,
	* 		key: <i>string</i>,
	* 		value: <i>string</i> | <i>string[]</i>,
	* 		predicate: <i>"equals"</i> | <i>"contains"</i> | <i>"startsWith"</i>,
	* 		caseSensitive: <i>true</i> | <i>false</i>
	* 	}</pre>
	* 	<br>
	* 	<i>NOTE: <code>query.predicate</code> and <code>query.caseSensitive</code> refer to <code>query.value</code>.</i>
	* <br/>
	* <ul>
	* 	<li>
	* 		<b>query.category</b><br/>
	* 		A string indicating the name of the metadata category.<br/>
	* 		If no value is specified for <code>query.category</code>, all nodes in the scene will be returned in the search.<br/><br/>
	* 	</li>
	* 	<li>
	* 		<b>query.key</b><br/>
	* 		A string indicating the key which belongs to the metadata category specified in <code>query.category</code>.
	* 		You can only use <code>query.key</code> if <code>query.category</code> has been specified.<br/>
	* 		If no value is specified for <code>query.key</code>, then all nodes grouped under the specified category will be returned in the search.<br/><br/>
	* 	</li>
	* 	<li>
	* 		<b>query.value</b><br/>
	* 		A string or an array of strings containing the value or values associated with <code>query.key</code>.
	* 		You can only use <code>query.value</code> in the search if <code>query.key</code> has been specified.<br/>
	* 		If no value is specified for <code>query.value</code>, then all nodes containing the specified key will be returned, regardless of what the value of the key is.<br/>
	* 		The following example shows a single string being passed in:
	* 		<pre>value: "Box #14"</pre>
	* 		The following example shows an array of strings being passed in:
	* 		<pre>value: ["Box #3", "box #4", "BOX #5"]</pre>
	* 	</li>
	* 	<li>
	* 		<b>query.predicate</b><br/>
	* 		Represents a search mode.
	* 		The available search modes are <code>"equals"</code>, <code>"contains"</code>, and <code>"startsWith"</code>. <br/>
	* 		Using <code>"equals"</code> will search for key values that exactly match the provided string or array of strings. <br/>
	* 		Using <code>"contains"</code> will search for key values containing all or part of the provided string or array of strings. <br/>
	* 		Using <code>"startsWith"</code> will search key values starting with the provided string or array of strings. <br/>
	* 		If no value is specified, the search mode will default to <code>"equals"</code>. <br/><br/>
	* 	</li>
	* 	<li>
	* 		<b>query.caseSensitive</b><br/> Indicates whether the search should be case sensitive or not. <br/>
	* 		If <code>true</code>, the search will be case sensitive, and <code>false</code> indicates otherwise. <br/>
	* 		If no value is specified, <code>caseSensitive</code> will default to <code>false</code> (that is, the search will be a case-insensitive search).
	* 	</li>
	* </ul>
	* @returns {string[]} A list of IDs belonging to nodes that matched the search criteria.
	* @public
	*/
	NodeHierarchy.prototype.findNodesByMetadata = function(query) {

		//checkMetadataByPredicate is used for filtering all nodes
		//so we can keep only the ones that match the query.
		var checkMetadataByPredicate = function(metadata, category, key, values, predicate, caseSensitive) {
			if (metadata.hasOwnProperty(category)) {
				var metadataCategory = metadata[category];
				if (metadataCategory.hasOwnProperty(key)) {
					var metadataValue = metadataCategory[key];
					if (!caseSensitive) {
						metadataValue = metadataValue.toLowerCase();
					}
					return values.some(predicate.bind(undefined, metadataValue));
				}
			}
			return false;
		};

		//checkMetadataByCategory looks inside the node to see
		//if it contains the category we are querying on.
		var checkMetadataByCategory = function(metadata, category) {
			return metadata.hasOwnProperty(category);
		};

		//getFilteredResults filters the entire list of nodes
		//and returns only what matches the query.
		var getFilteredResults = function(allNodeIds, filteringFunction, category, key, values, predicate, caseSensitive) {
			//We get all nodes, get metadata from each node and manually filter it against the query.
			//initialize empty baseNodeProxy
			var nodeProxy = this._baseNodeProxyPool.borrowObject();
			//filter the whole node collection so we can keep only the nodes that match the query
			var result = allNodeIds.filter(function(nodeId) {
				//get the node with the current id
				nodeProxy.init(this, nodeId);
				//extract metadata from node
				var metadata = nodeProxy.getNodeMetadata();
				//check if the metadata matches the query
				var keepThisNode = filteringFunction(metadata, category, key, values, predicate, caseSensitive);
				//clear the data from the base node proxy
				nodeProxy.reset();
				//filter the current node
				return keepThisNode;
			}.bind(this));
			this._baseNodeProxyPool.returnObject(nodeProxy);
			return result;
		};

		//Get all nodes as a start point.
		var allNodeIds = this.findNodesByName(),
			result = [];

		if (query === undefined || query === null || jQuery.isEmptyObject(query)) {
			//If the query object is empty, we return a list of all nodes.
			result = allNodeIds;
		} else if (query.category !== null && query.category !== undefined && query.category !== "") {
			var filteringFunction,
				values,
				predicateName,
				predicate,
				caseSensitive = !!(query && query.caseSensitive);
			//We determine what filtering type to use.
			//Filtering by category only as opposed to filtering by category and key-value pairs.
			if (query.key === undefined || query.key === null) {
				//If we specify the category, but not the key-value pairs,
				//we return all nodes that have that particular category.
				filteringFunction = checkMetadataByCategory;
			} else {
				//If the category and the key are specified, but the value is omitted,
				//it is expected that we return a list of all nodes containing that category
				//and that key, no matter what the value for the key is. That's why we set the
				//value to empty string and predicate to "contains".
				values = query.value;
				predicateName = query.predicate || "equals";
				if (values === undefined || values === null) {
					values = "";
					predicateName = "contains";
				}
				//If the category and the key-value pair are specified,
				//we return the nodes that match this criteria.
				if (!Array.isArray(values)) {
					values = [values];
				}
				if (!caseSensitive) {
					values = values.map(function(value) {
						return value.toLowerCase();
					});
				}
				switch (predicateName) {
					case "equals":
						predicate = function(metadataValue, queryValue) {
							return metadataValue === queryValue;
						};
						break;
					case "contains":
						predicate = function(metadataValue, queryValue) {
							return metadataValue.indexOf(queryValue) !== -1;
						};
						break;
					case "startsWith":
						predicate = function(metadataValue, queryValue) {
							return metadataValue.indexOf(queryValue) === 0;
						};
						break;
					default:
						jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT9.summary), this._messages.messages.VIT9.code, "sap.ui.vk.NodeHierarchy");
				}
				filteringFunction = checkMetadataByPredicate;
			}
			//After determining what filtering function we use,
			//we pass it as an argument to getFilteredResults.
			result = getFilteredResults.bind(this)(allNodeIds, filteringFunction, query.category, query.key, values, predicate, caseSensitive);
		} else {
			jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT10.summary), this._messages.messages.VIT10.code, "sap.ui.vk.NodeHierarchy");
		}
		return jQuery.sap.unique(result);
	};

	/**
	 * Creates a layer proxy object.
	 *
	 * The layer proxy object must be destroyed with the {@link #destroyLayerProxy destroyLayerProxy} method.
	 *
	 * @param {string} layerId The layer ID for which to create a proxy object.
	 * @returns {sap.ui.vk.LayerProxy} The proxy object.
	 * @public
	 */
	NodeHierarchy.prototype.createLayerProxy = function(layerId) {
		var layerProxy = new LayerProxy(this, layerId);
		this._layerProxies.push(layerProxy);
		return layerProxy;
	};

	/**
	 * Destroys the layer proxy object.
	 *
	 * @param {sap.ui.vk.LayerProxy} layerProxy The layer proxy object.
	 * @returns {sap.ui.vk.LayerHierarchy} <code>this</code> to allow method chaining.
	 * @public
	 */
	NodeHierarchy.prototype.destroyLayerProxy = function(layerProxy) {
		var index = this._layerProxies.indexOf(layerProxy);
		if (index >= 0) {
			this._layerProxies.splice(index, 1)[0].destroy();
		}
		return this;
	};

	/**
	* Returns a list of layer IDs.
	*
	* @returns {string[]} A list of layer IDs.
	* @public
	*/
	NodeHierarchy.prototype.getLayers = function() {
		return getJSONObject(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId, sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LAYERS)).Layers;
	};

	return NodeHierarchy;
});
