/*globals QUnit*/
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}

jQuery.sap.require("sap.ui.fl.descriptorRelated.api.DescriptorInlineChangeFactory");
jQuery.sap.require("sap.ui.fl.descriptorRelated.api.DescriptorVariantFactory");
jQuery.sap.require("sap.ui.fl.descriptorRelated.api.DescriptorChangeFactory");
jQuery.sap.require('sap.ui.fl.LrepConnector');

(function(DescriptorInlineChangeFactory, DescriptorVariantFactory, DescriptorChangeFactory, LrepConnector) {
	'use strict';

	QUnit.module("DescriptorInlineChangeFactory", {
		beforeEach : function() {
		},
		afterEach : function() {
		}
	});

	QUnit.test("create_ovp_addNewCard", function(assert) {
		return DescriptorInlineChangeFactory.create_ovp_addNewCard({
			"card" : {
				"customer.acard" : {
					"model" : "customer.boring_model",
					"template" : "sap.ovp.cards.list",
					"settings" : {
						"category" : "{{cardId_category}}",
						"title" : "{{cardId_title}}",
						"description" : "extended",
						"entitySet" : "Zme_Overdue",
						"sortBy" : "OverdueTime",
						"sortOrder" : "desc",
						"listType" : "extended"
					}
				}
			}
		},{
			"cardId_category": {
				"type": "XTIT",
				"maxLength": 20,
				"comment": "example",
				"value": {
					"": "Category example default text",
					"en": "Category example text in en",
					"de": "Kategorie Beispieltext in de",
					"en_US": "Category example text in en_US"
				}
			},
			"cardId_title": {
				"type": "XTIT",
				"maxLength": 20,
				"comment": "example",
				"value": {
					"": "Title example default text",
					"en": "Title example text in en",
					"de": "Titel Beispieltext in de",
					"en_US": "Title example text in en_US"
				}
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
			assert.notEqual(oDescriptorInlineChange.getMap().texts, null);
		});
	});
	
	QUnit.test("create_ovp_addNewCard failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ovp_addNewCard({
				"cardId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ovp_addNewCard({
				"card" : "a.id"
			})
		}.bind(this));
	});

	QUnit.test("create_ovp_removeCard", function(assert) {
		return DescriptorInlineChangeFactory.create_ovp_removeCard({
			"cardId" : "a.id"
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_ovp_removeCard failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ovp_removeCard({
				"cards" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ovp_removeCard({
				"cardId" : {}
			})
		}.bind(this));
	});

	QUnit.test("create_app_addNewInbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_addNewInbound({
			"inbound": {
				"customer.contactCreate": {
					"semanticObject": "Contact",
					"action": "create",
					"icon": "sap-icon://add-contact",
					"title": "{{contactCreate_title}}",
					"subTitle": "{{contactCreate_subtitle}}"
				    }
			}
		},{
			"contactCreate_title": {
				"type": "XTIT",
				"maxLength": 20,
				"comment": "example",
				"value": {
					"": "Category example default text",
					"en": "Category example text in en",
					"de": "Kategorie Beispieltext in de",
					"en_US": "Category example text in en_US"
				}
			},
			"contactCreate_subtitle": {
				"type": "XTIT",
				"maxLength": 20,
				"comment": "example",
				"value": {
					"": "Title example default text",
					"en": "Title example text in en",
					"de": "Titel Beispieltext in de",
					"en_US": "Title example text in en_US"
				}
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
			assert.notEqual(oDescriptorInlineChange.getMap().texts, null);
		});
	});
	
	QUnit.test("create_app_addNewInbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewInbound({
				"inboundId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewInbound({
				"inbound" : "a.id"
			})
		}.bind(this));
	});

	QUnit.test("create_app_removeInbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_removeInbound({
			"inboundId" : "a.id"
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_removeInbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeInbound({
				"inbounds" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeInbound({
				"inboundId" : {}
			})
		}.bind(this));
	});

	QUnit.test("create_app_changeInbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_changeInbound({
			"inboundId": "a.id",
			"entityPropertyChange": {
				"propertyPath": "signature/parameters/id/required",
				"operation": "UPSERT",
				"propertyValue": false
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_changeInbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_changeInbound({
			"inboundId": "a.id",
			"entityPropertyChange": {
				"propertyPath": "title",
				"operation": "UPSERT",
				"propertyValue": "{{newtitle}}"
			}
		},{
			"newtitle": {
				"type": "XTIT",
				"maxLength": 20,
				"comment": "example",
				"value": {
					"": "Title example default text",
					"en": "Title example text in en",
					"de": "Titel Beispieltext in de",
					"en_US": "Title example text in en_US"
				}
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
			assert.notEqual(oDescriptorInlineChange.getMap().texts, null);
		});
	});
	
	QUnit.test("create_app_changeInbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeInbound({
				"inbounds" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeInbound({
				"inboundId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeInbound({
				"inboundId" : "a.id"
			})
		}.bind(this));
	});
	
	QUnit.test("create_app_addNewOutbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_addNewOutbound({
			"outbound": {
		        "customer.addressDisplay": {
		            "semanticObject": "Address",
		            "action": "display",
		            "parameters": {
		                "companyName": {}
		            }
		        }
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_addNewOutbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewOutbound({
				"outboundId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewOutbound({
				"outbound" : "a.id"
			})
		}.bind(this));
	});

	QUnit.test("create_app_removeOutbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_removeOutbound({
			"outboundId" : "a.id"
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_removeOutbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeOutbound({
				"outbounds" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeOutbound({
				"outboundId" : {}
			})
		}.bind(this));
	});

	QUnit.test("create_app_changeOutbound", function(assert) {
		return DescriptorInlineChangeFactory.create_app_changeOutbound({
			"outboundId": "a.id",
			"entityPropertyChange": {
			    "propertyPath" : "action", 
			    "operation" : "UPDATE",
			    "propertyValue" : "newAction"
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_changeOutbound failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeOutbound({
				"outbounds" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeOutbound({
				"outboundId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeOutbound({
				"outboundId" : "a.id"
			})
		}.bind(this));
	});
	
	QUnit.test("create_app_addNewDataSource", function(assert) {
		return DescriptorInlineChangeFactory.create_app_addNewDataSource({
			"dataSource": {}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_addNewDataSource failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewDataSource({
				"dataSourceId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_addNewDataSource({
				"dataSource" : "a.id"
			})
		}.bind(this));
	});

	QUnit.test("create_app_removeDataSource", function(assert) {
		return DescriptorInlineChangeFactory.create_app_removeDataSource({
			"dataSourceId" : "a.id"
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_removeDataSource failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeDataSource({
				"dataSources" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_removeDataSource({
				"dataSourceId" : {}
			})
		}.bind(this));
	});

	QUnit.test("create_app_changeDataSource", function(assert) {
		return DescriptorInlineChangeFactory.create_app_changeDataSource({
			"dataSourceId": "a.id",
			"entityPropertyChange": {
				"propertyPath": "uri",
				"operation": "UPDATE",
				"propertyValue": "abc"
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("create_app_changeDataSource failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeDataSource({
				"dataSources" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeDataSource({
				"dataSourceId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_app_changeDataSource({
				"dataSourceId" : "a.id"
			})
		}.bind(this));
	});

	QUnit.test("appdescr_ui5_addNewModel", function(assert) {
		return DescriptorInlineChangeFactory.create_ui5_addNewModel({
			"model" : {
				"customer.fancy_model": {
					"dataSource": "customer.fancy_dataSource",
					"settings": {}
				}
			}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("appdescr_ui5_addNewModel failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ui5_addNewModel({
				"modelId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_ui5_addNewModel({
				"model" : "a.id"
			})
		}.bind(this));
	});
	
	QUnit.test("appdescr_smb_addNamespace", function(assert) {
		return DescriptorInlineChangeFactory.create_smb_addNamespace({
			"smartBusinessApp": {
				  "leadingModel": "leadingModelName",
				  "annotationFragments": {
				    "dataPoint": "PERP_FCLM_MP05_CASH_POS_SRV.ERP_FCLM_MP05_QCP01Result/@com.sap.vocabularies.UI.v1.DataPoint#_SFIN_CASHMGR_CASHPOSITION_VIEW1"
				  },
				  "drilldown": {
				    "annotationFragments": {
				      "selectionFields": "PERP_FCLM_MP05_CASH_POS_SRV.ERP_FCLM_MP05_QCP01Result/@com.sap.vocabularies.UI.v1.SelectionFields#_SFIN_CASHMGR_CASHPOSITION_VIEW1"
				    },
				    "mainCharts": [ {
				      "annotationFragment": "«target»/@com.sap.vocabularies.UI.v1.SelectionPresentationVariant#«qualifier»"
				    }],
				    "miniCharts": [ {
				      "model": "UI5ModelName",
				      "annotationFragment": "«target»/@com.sap.vocabularies.UI.v1.SelectionPresentationVariant#«qualifier»"
				    }]
				  }
				}
		}).then(function(oDescriptorInlineChange) {
			assert.notEqual(oDescriptorInlineChange, null);
		});
	});
	
	QUnit.test("appdescr_smb_addNamespace failure", function (assert) {
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_smb_addNamespace({
				"smartBusinessAppId" : {}
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorInlineChangeFactory.create_smb_addNamespace({
				"smartBusinessApp" : "a.id"
			})
		}.bind(this));
	});

	
	var sandbox = sinon.sandbox.create();
	
	QUnit.module("DescriptorVariant", {
		beforeEach: function(assert) {
			sandbox.stub(LrepConnector.prototype, "send").returns(Promise.resolve({
				response: JSON.stringify({
					"id" : "a.id",
					"reference": "a.reference"
				})
			}));
		},
		afterEach: function() {
			sandbox.restore();
		}
	});

	QUnit.test("addDescriptorInlineChange", function(assert) {
		return DescriptorVariantFactory.createNew({
			"id" : "a.id",
			"reference": "a.reference"
		}).then(function(oDescriptorVariant) {
			return DescriptorInlineChangeFactory.createNew("changeType",{"param":"value"},{"a": "b"}).then(function(oDescriptorInlineChange){ 
				return oDescriptorVariant.addDescriptorInlineChange(oDescriptorInlineChange).then(function() {
					assert.notEqual(oDescriptorVariant._content, null);
					assert.equal(oDescriptorVariant._content.length, 1);
					assert.equal(oDescriptorVariant._content[0].changeType, "changeType");
					assert.deepEqual(oDescriptorVariant._content[0].content, {"param":"value"});
					assert.deepEqual(oDescriptorVariant._content[0].texts, {"a": "b"});
				});
			});
		});
	});
	
	QUnit.test("submit", function(assert) {
		return DescriptorVariantFactory.createNew({
			"id" : "a.id",
			"reference": "a.reference"
		}).then(function(oDescriptorVariant) {
			return oDescriptorVariant.submit().then(function(oResponse){
				assert.notEqual(oResponse, null);
			});
		});
	});

	
	QUnit.module("DescriptorVariantFactory", {
		beforeEach: function(assert) {
			sandbox.stub(LrepConnector.prototype, "send").returns(Promise.resolve({
				response: JSON.stringify({
					"id" : "a.id",
					"reference": "a.reference"
				})
			}));
		},
		afterEach: function() {
			sandbox.restore();
		}
	});

	QUnit.test("createNew", function(assert) {
		// assert.strictEqual(typeof FlexControllerFactory.create, 'function');
		return DescriptorVariantFactory.createNew({
					"id" : "a.id",
					"reference": "a.reference"
				}).then(function(oDescriptorVariant) {
					assert.notEqual(oDescriptorVariant, null);
					assert.equal(oDescriptorVariant._id, "a.id");
					assert.equal(oDescriptorVariant._reference, "a.reference");
					assert.equal(oDescriptorVariant._mode, "NEW");
				})
	});
	
	QUnit.test("createNew failure", function(assert) {
		assert.throws(function(){
			DescriptorVariantFactory.createNew({
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createNew({
				"id" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createNew({
				"reference": "a.reference"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createNew({
				"id" : 1,
				"reference": "a.reference"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createNew({
				"id" : "a.id",
				"reference": 1
			})
		}.bind(this));
	});	
	
	QUnit.test("createForExisting", function(assert) {
		return DescriptorVariantFactory.createForExisting("a.id"
				).then(function(oDescriptorVariant) {
					assert.notEqual(oDescriptorVariant, null);
					assert.equal(oDescriptorVariant._mMap.id, "a.id");
					assert.equal(oDescriptorVariant._mMap.reference, "a.reference");
					assert.equal(oDescriptorVariant._mode, "FROM_EXISTING");
				})
	});
	
	QUnit.test("createForExisting failure", function(assert) {
		assert.throws(function(){
			DescriptorVariantFactory.createForExisting()
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createForExisting({
			})
		}.bind(this));
	});	
	
	QUnit.test("createDeletion", function(assert) {
		return DescriptorVariantFactory.createDeletion({
					"id" : "a.id"
				}).then(function(oDescriptorVariant) {
					assert.notEqual(oDescriptorVariant, null);
					assert.equal(oDescriptorVariant._id, "a.id");
					assert.equal(oDescriptorVariant._mode, "DELETION");
				})
	});
	
	QUnit.test("createDeletion failure", function(assert) {
		assert.throws(function(){
			DescriptorVariantFactory.createDeletion({
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createDeletion({
				"reference" : "a.id"
			})
		}.bind(this));
		assert.throws(function(){
			DescriptorVariantFactory.createDeletion({
				"id" : 1
			})
		}.bind(this));
	});

	
	QUnit.module("DescriptorChange", {
		beforeEach: function(assert) {
			sandbox.stub(LrepConnector.prototype, "send").returns(Promise.resolve({
				response: JSON.stringify({
					"reference": "a.reference"
				})
			}));
		},
		afterEach: function() {
			sandbox.restore();
		}
	});
	
	QUnit.test("submit", function(assert) {
		return DescriptorInlineChangeFactory.createNew("changeType",{"param":"value"},{"a": "b"}).then(function(oDescriptorInlineChange){ 	
			new DescriptorChangeFactory().createNew("a.reference", oDescriptorInlineChange).then(function(oDescriptorChange) {
				return oDescriptorChange.submit().then(function(oResponse){
					assert.notEqual(oResponse, null);
				});
			});
		});
	});
	
	
	QUnit.module("DescriptorChangeFactory", {
		beforeEach: function(assert) {
		},
		afterEach: function() {
		}
	});

	QUnit.test("createNew", function(assert) {
		return DescriptorInlineChangeFactory.createNew("changeType",{"param":"value"},{"a": "b"}).then(function(oDescriptorInlineChange){ 	
			new DescriptorChangeFactory().createNew("a.reference", oDescriptorInlineChange).then(function(oDescriptorChange) {
				assert.notEqual(oDescriptorChange, null);
				assert.equal(oDescriptorChange._mChangeFile.reference, "a.reference");
				assert.equal(oDescriptorChange._mChangeFile.changeType, "changeType");
				assert.equal(oDescriptorChange._oInlineChange, oDescriptorInlineChange);
			});
		});
	});	
	
}(sap.ui.fl.descriptorRelated.api.DescriptorInlineChangeFactory,
		sap.ui.fl.descriptorRelated.api.DescriptorVariantFactory,
		sap.ui.fl.descriptorRelated.api.DescriptorChangeFactory,
		sap.ui.fl.LrepConnector));