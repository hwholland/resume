/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.metadataFactory");

(function() {
	'use strict';
	/**
	 * @class This class creates and manages metadata and entity type metadata instances. 
	 * The class assures that there is a single metadata instance per service root and
	 * that there is a single entity type metadata instance per service root and and entity type.
	 */
	sap.apf.core.MetadataFactory = function(oInject) {
		/**
		 * @description Returns type of metadataFactory.
		 * @returns {String}
		 */
		this.type = "metadataFactory";
		var that = this;
		var oMessageHandler = oInject.instances.messageHandler;
		var oConfigurationFactory = oInject.instances.configurationFactory;
		var Hashtable = oInject.constructors.Hashtable;
		var Metadata = oInject.constructors.Metadata;
		var EntityTypeMetadata = oInject.constructors.EntityTypeMetadata;
		var MetadataFacade = oInject.constructors.MetadataFacade;
		//delete properties from oInject, which are not necessary to be transferred to metadata instances 
		delete oInject.constructors.Metadata;
		delete oInject.constructors.EntityTypeMetadata;
		delete oInject.constructors.MetadataFacade;
		delete oInject.constructors.MetadataProperty;
		delete oInject.instances.configurationFactory;
		var oMetadataInstances = new Hashtable(oMessageHandler);
		// Public functions
		/**
		 * @description Returns metadata object that represents metadata corresponding to the service document.
		 * @param {string} sAbsolutePathToServiceDocument Path to the service document
		 * @returns {sap.apf.core.Metadata}
		 */
		this.getMetadata = function(sAbsolutePathToServiceDocument) {
			var metadataCandidate;
			if (oMetadataInstances.hasItem(sAbsolutePathToServiceDocument) === false) {
				metadataCandidate = new Metadata(oInject, sAbsolutePathToServiceDocument);
				if (!metadataCandidate.failed) {
					oMetadataInstances.setItem(sAbsolutePathToServiceDocument, {
						metadata : metadataCandidate
					});
				} else {
					return undefined;
				}
			}
			return oMetadataInstances.getItem(sAbsolutePathToServiceDocument).metadata;
		};
		/**
		 * @description Returns metadata object that represents metadata corresponding to the service document and an entity type that belongs to the service.
		 * @param {string} sAbsolutePathToServiceDocument Absolute path to the service document
		 * @param {string} sEntityType Entity type
		 * @returns {sap.apf.core.EntityTypeMetadata}
		 */
		this.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
			var oEntityTypes;
			var oMetadata = this.getMetadata(sAbsolutePathToServiceDocument);
			oEntityTypes = oMetadataInstances.getItem(sAbsolutePathToServiceDocument).entityTypes;
			if (!oEntityTypes) {
				oEntityTypes = new Hashtable(oMessageHandler);
				oMetadataInstances.getItem(sAbsolutePathToServiceDocument).entityTypes = oEntityTypes;
			}
			if (!oEntityTypes.getItem(sEntityType)) {
				oEntityTypes.setItem(sEntityType, new EntityTypeMetadata(oMessageHandler, sEntityType, oMetadata));
			}
			return oEntityTypes.getItem(sEntityType);
		};
		/**
		 * @description Returns instance of {sap.apf.core.MetadataFacade}
		 * @returns {sap.apf.core.MetadataFacade}
		 */
		this.getMetadataFacade = function(sAbsolutePathToServiceDocument) {
			return new MetadataFacade({
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty 
				},
				instances : { 
					messageHandler : oMessageHandler,
					metadataFactory : that
				}
			}, sAbsolutePathToServiceDocument);
		};
		/**
		 * @description Returns service documents
		 * @returns {Array}
		 */
		this.getServiceDocuments = function() {
			return oConfigurationFactory.getServiceDocuments();
		};
		/**
		 * @description Returns all entity sets of service
		 * @returns {Array}
		 */
		this.getEntitySets = function(sService) {
			var oMetadata = this.getMetadata(sService);
			return oMetadata.getEntitySets();
		};
		/**
		 * @description Returns all entity types of service
		 * @returns {Array}
		 */
		this.getEntityTypes = function(sService) {
			var oMetadata = this.getMetadata(sService);
			return oMetadata.getEntityTypes();
		};
	};
}());