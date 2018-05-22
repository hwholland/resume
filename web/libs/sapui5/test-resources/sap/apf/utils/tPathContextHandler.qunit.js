jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.utils.pathContextHandler');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.core.constants');

sap.apf.tests = sap.apf.tests || {};
sap.apf.testhelper = sap.apf.testhelper || {};
sap.apf.testhelper.pathContextHandlerCommonSetup = function(testEnvironment) {
    testEnvironment.setContextSpy = function(filter) {
        this.forwardedFilter = filter;
    };
    testEnvironment.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
    testEnvironment.createEmptyFilter = function() {
        return new sap.apf.utils.Filter(this.messageHandler);
    };
    testEnvironment.createFilterA = function() {
        var filter = new sap.apf.utils.Filter(this.messageHandler);
        filter.getTopAnd().addExpression({
            name : 'A',
            operator : 'EQ',
            value: 'alpha'
        });
        return filter;
    };
    testEnvironment.createFilterB = function() {
        var filter = new sap.apf.utils.Filter(this.messageHandler);
        filter.getTopAnd().addExpression({
            name : 'B',
            operator : 'EQ',
            value: 'beta'
        });
        return filter;
    };
    testEnvironment.createFilterC = function() {
        var filter = new sap.apf.utils.Filter(this.messageHandler);
        filter.getTopAnd().addExpression({
            name : 'C',
            operator : 'EQ',
            value: 'gamma'
        });
        return filter;
    };
};
module("PCH Add, update & retrieve by numeric internal ID", {
	setup : function() {
	    sap.apf.testhelper.pathContextHandlerCommonSetup(this);
		this.pathContextHandler = new sap.apf.utils.PathContextHandler({ 
			setContext : this.setContextSpy.bind(this) 
		}, this.messageHandler);
		this.forwardedFilter = null;
	}
});

test('Simple add and get', function() {
 var id = this.pathContextHandler.add(this.createFilterA());	
 var filter = this.pathContextHandler.get(id);
 deepEqual(filter,this.createFilterA(),'Get retrieves the added filter');
});

test('Get with unknown identifier leads to error', function() {
    this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.add(this.createFilterB());
    throws( function() { 
     this.pathContextHandler.get(0); 
     },
     'Error because of passing an identifier to get that has not been returned by add before');
    
    throws( function() {
      this.pathContextHandler.get(3);
      },
      'Error because of passing an identifier to get that has not been returned by add before');
});

test('Add called twice combines filters and forwards to set context', function() {
	var expected = {
			"id" : "filterTopAnd",
			"type" : "filterAnd",
			"terms" : [],
			"expressions" : [ {
				"name" : "A",
				"operator" : "EQ",
				"value" : "alpha"
			}, {
				"name" : "B",
				"operator" : "EQ",
				"value" : "beta"
			} ]
	};
	this.pathContextHandler.add(this.createFilterA());
	this.pathContextHandler.add(this.createFilterB());
	deepEqual(this.forwardedFilter.serialize(), expected, 'Filter has been combined');	
});

test('Update on ID of 1st add replaces first context fragment', function() {
	var idOf1stAdd;
	var expected = {
			"id" : "filterTopAnd",
			"type" : "filterAnd",
			"terms" : [],
			"expressions" : [ {
				"name" : "C",
				"operator" : "EQ",
				"value" : "gamma"
			}, {
				"name" : "B",
				"operator" : "EQ",
				"value" : "beta"
			} ]
	};
	idOf1stAdd = this.pathContextHandler.add(this.createFilterA());
	this.pathContextHandler.add(this.createFilterB());
	this.pathContextHandler.update(idOf1stAdd, this.createFilterC());
	deepEqual(this.forwardedFilter.serialize(), expected, 'First context fragment successfully updated');	
});

test('Each add returns different identifier', function() {
	var id1 = this.pathContextHandler.add(this.createEmptyFilter());
	var id2 = this.pathContextHandler.add(this.createEmptyFilter());
    notEqual(id1, id2, 'Different identifiers expected for each add on same instance.')	
});

test('Wrong identifier: Update leads to error', function() {
    this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.add(this.createFilterB());
    throws( function() { 
     this.pathContextHandler.update(0,this.createFilterC()); 
     },
     'Error because of passing an identifier to update that has not been returned by add before');
    
    throws( function() {
      this.pathContextHandler.update(3,this.createFilterC());
      },
      'Error because of passing an identifier to update that has not been returned by add before');
});

module("PCH Update & retrieve by external ID of type string", {
    setup : function() {
        sap.apf.testhelper.pathContextHandlerCommonSetup(this);
        this.pathContextHandler = new sap.apf.utils.PathContextHandler({ 
            setContext : this.setContextSpy.bind(this) 
        }, this.messageHandler);
        this.forwardedFilter = null;
    }
});

test('Simple update and get', function() {
    var id = 'propertyOneName';
    this.pathContextHandler.update(id, this.createFilterA());	
    var filter = this.pathContextHandler.get(id);
    deepEqual(filter,this.createFilterA(),'Get retrieves the filter impicitely added by update');
});

test('Get with unknown identifier leads to error', function() {
    this.pathContextHandler.update('propertyOne', this.createFilterA());
    this.pathContextHandler.update('propertyThree',this.createFilterC());
    throws( function() { 
     this.pathContextHandler.get('propertyTwo'); 
     },
     'Error because of passing an identifier that has not been set before');
});

test('2 add combined and forwarded to set context', function() {
    var expected = {
            "id" : "filterTopAnd",
            "type" : "filterAnd",
            "terms" : [],
            "expressions" : [ {
                "name" : "A",
                "operator" : "EQ",
                "value" : "alpha"
            }, {
                "name" : "B",
                "operator" : "EQ",
                "value" : "beta"
            } ]
    };
    this.pathContextHandler.update('propertyOne', this.createFilterA());
    this.pathContextHandler.update('propertyTwo', this.createFilterB());
    deepEqual(this.forwardedFilter.serialize(), expected, 'Filter has been combined');  
});

test('Update on ID of 1st update replaces first context fragment', function() {
    var expected = {
            "id" : "filterTopAnd",
            "type" : "filterAnd",
            "terms" : [],
            "expressions" : [ {
                "name" : "C",
                "operator" : "EQ",
                "value" : "gamma"
            }, {
                "name" : "B",
                "operator" : "EQ",
                "value" : "beta"
            } ]
    };
    this.pathContextHandler.update('propertyOne', this.createFilterA());
    this.pathContextHandler.update('propertyTwo', this.createFilterB());
    this.pathContextHandler.update('propertyOne', this.createFilterC());
    deepEqual(this.forwardedFilter.serialize(), expected, 'First context fragment successfully updated');  
});

module("PCH - Serializing and deserializing context fragments", {
    setup : function() {
        sap.apf.testhelper.pathContextHandlerCommonSetup(this);
        this.pathContextHandler = new sap.apf.utils.PathContextHandler({ 
            setContext : this.setContextSpy.bind(this) 
        }, this.messageHandler);
        this.forwardedFilter = null;
    }
});

test('Serialize delivers expected result', function() {
    this.pathContextHandler.update('propertyThree', this.createFilterC());
	this.pathContextHandler.add(this.createFilterA());
	this.pathContextHandler.add(this.createFilterB());
	var expected = {
            propertyThree : {
              expressions : [
                {
                  name : "C",
                  operator : "EQ",
                  value : "gamma"
                }
              ],
              id : "filterTopAnd",
              terms : [],
              type : "filterAnd"
            },
	        1 : {
	            expressions : [
	              {
	                name : "A",
	                operator : "EQ",
	                value : "alpha"
	              }
	            ],
	            id : "filterTopAnd",
	            terms : [],
	            type : "filterAnd"
	        },
	        2 : {
	            expressions : [
	              {
	                name : "B",
	                operator : "EQ",
	                value : "beta"
	              }
	            ],
	            id : "filterTopAnd",
	            terms : [],
	            type : "filterAnd"
	          }
	        };
	deepEqual(this.pathContextHandler.serialize(),expected,"Serialize works as expected");
});
test('Serialize & deserialize is idempotent', function() {
	var idOne = this.pathContextHandler.add(this.createFilterA());
	var idTwo = this.pathContextHandler.add(this.createFilterB());
	this.pathContextHandler.update('propertyThree', this.createFilterC());
	var resultingPathContextHandler = this.pathContextHandler.deserialize(this.pathContextHandler.serialize());
	var resultingFilterA = resultingPathContextHandler.get(idOne);
	var resultingFilterB = resultingPathContextHandler.get(idTwo);
	var resultingFilterC = resultingPathContextHandler.get('propertyThree');
	deepEqual(resultingFilterA.getInternalFilter().toUrlParam(), this.createFilterA().getInternalFilter().toUrlParam(), "Filter A returned correctly after serialize & deserialize");
	deepEqual(resultingFilterB.getInternalFilter().toUrlParam(), this.createFilterB().getInternalFilter().toUrlParam(), "Filter B returned correctly after serialize & deserialize");
	deepEqual(resultingFilterC.getInternalFilter().toUrlParam(), this.createFilterC().getInternalFilter().toUrlParam(), "Filter C returned correctly after serialize & deserialize");
});
test('Deserialize sets counter that does not conflict with existing internal IDs', function() {
    var idThree,
        serializedState,
        otherPathContextHandler;
    var idOne = this.pathContextHandler.add(this.createFilterA());
    var idTwo = this.pathContextHandler.add(this.createFilterB());
    serializedState = this.pathContextHandler.serialize();
    
    otherPathContextHandler = new sap.apf.utils.PathContextHandler({ 
            setContext : this.setContextSpy.bind(this) 
        }, this.messageHandler);
    otherPathContextHandler.deserialize(serializedState);    
    idThree = otherPathContextHandler.add(this.createFilterC());
    notEqual(idThree, idOne, 'New ID in deserialized state different from 1st ID');
    notEqual(idThree, idTwo, 'New ID in deserialized state different from 2nd ID');
});

module("PCH Save & restor initial state", {
	setup : function() {
	    sap.apf.testhelper.pathContextHandlerCommonSetup(this);
		this.pathContextHandler = new sap.apf.utils.PathContextHandler({ 
			setContext : this.setContextSpy.bind(this) 
		}, this.messageHandler);
		this.forwardedFilter = null;
	},
    createFilterD : function() {
        var filter = new sap.apf.utils.Filter(this.messageHandler);
        filter.getTopAnd().addExpression({
            name : 'D',
            operator : 'EQ',
            value: 'delta'
        });
        return filter;
    }
});
test('Retrieve IDs of all filter fragments', function() {
	var idSet = [],
        filterIds;
	idSet.push(this.pathContextHandler.add(this.createFilterA()));
	idSet.push(this.pathContextHandler.add(this.createFilterB()));
	this.pathContextHandler.update('propertyThree', this.createFilterC());
	idSet.push('propertyThree');
	filterIds = this.pathContextHandler.getAllIds();
    deepEqual(filterIds, idSet, 'Array with IDs of correct type expected');
});

test('Save initial state once and restore', function() {
    var idOne = this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.update('propertyOne', this.createFilterC());
    this.pathContextHandler.saveInitialContext();
    this.pathContextHandler.update(idOne, this.createFilterB());
    this.pathContextHandler.restoreInitialContext();
    deepEqual(this.pathContextHandler.get(idOne).serialize(), this.createFilterA().serialize(), 'Initial state filter A restored');
    deepEqual(this.pathContextHandler.get('propertyOne').serialize(), this.createFilterC().serialize(), 'Initial state filter C restored');
});
test('Save initial state, overwrite with change and restore', function() {
    var idOne = this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.update('propertyOne', this.createFilterC());
    this.pathContextHandler.saveInitialContext();
    this.pathContextHandler.update(idOne, this.createFilterB());
    this.pathContextHandler.saveInitialContext();
    this.pathContextHandler.update(idOne, this.createFilterA());
    this.pathContextHandler.restoreInitialContext();
    deepEqual(this.pathContextHandler.get(idOne).serialize(), this.createFilterB().serialize(), 'Initial state filter A restored');
    deepEqual(this.pathContextHandler.get('propertyOne').serialize(), this.createFilterC().serialize(), 'Initial state filter C restored');
});
test('Restored state forwarded to set context', function() {
    var expected = {
        "id" : "filterTopAnd",
        "type" : "filterAnd",
        "terms" : [],
        "expressions" : [ {
            "name" : "A",
            "operator" : "EQ",
            "value" : "alpha"
        }, {
            "name" : "B",
            "operator" : "EQ",
            "value" : "beta"
        } ]
    };
    this.pathContextHandler.update('propertyOne', this.createFilterA());
    this.pathContextHandler.update('propertyTwo', this.createFilterB());
    this.pathContextHandler.saveInitialContext();
    this.pathContextHandler.update('propertyTwo', this.createFilterC());
    this.pathContextHandler.restoreInitialContext();
    deepEqual(this.forwardedFilter.serialize(), expected, 'Filter has been combined');
});
test('Restore without preceded save has no effect to the current state', function() {
    var idOne = this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.update('propertyOne', this.createFilterB());
    
    this.pathContextHandler.restoreInitialContext();
    
    deepEqual(this.pathContextHandler.get(idOne).serialize(), this.createFilterA().serialize(), 'Filter A unchanged');
    deepEqual(this.pathContextHandler.get('propertyOne').serialize(), this.createFilterB().serialize(), 'Filter B unchanged');
});
test('Selective restore by specific IDs', function() {
    var idOne;
    idOne = this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.update('propertyOne', this.createFilterB());
    this.pathContextHandler.update('propertyTwo', this.createFilterC());
    this.pathContextHandler.saveInitialContext();
    this.pathContextHandler.update(idOne, this.createFilterD());
    this.pathContextHandler.update('propertyOne', this.createFilterD());
    this.pathContextHandler.update('propertyTwo', this.createFilterD());
    this.pathContextHandler.restoreInitialContext([idOne, 'propertyTwo']);

    deepEqual(this.pathContextHandler.get(idOne).serialize(), this.createFilterA().serialize(), 'Initial state filter A restored');
    deepEqual(this.pathContextHandler.get('propertyOne').serialize(), this.createFilterD().serialize(), 'Current state filter D preserved');
    deepEqual(this.pathContextHandler.get('propertyTwo').serialize(), this.createFilterC().serialize(), 'Initial state filter C restored');
});
test('Selective save by specific IDs over existing initial full state', function() {
    this.pathContextHandler.update('propertyOne', this.createFilterA());
    this.pathContextHandler.update('propertyTwo', this.createFilterB());
    this.pathContextHandler.update('propertyThree', this.createFilterC());
    this.pathContextHandler.saveInitialContext();
    
    this.pathContextHandler.update('propertyOne', this.createFilterD());
    this.pathContextHandler.update('propertyTwo', this.createFilterD());
    this.pathContextHandler.saveInitialContext(['propertyOne']);
    this.pathContextHandler.restoreInitialContext();
    
    deepEqual(this.pathContextHandler.get('propertyOne').serialize(), this.createFilterD().serialize(), 'Selectively saved initial state filter D restored');
    deepEqual(this.pathContextHandler.get('propertyTwo').serialize(), this.createFilterB().serialize(), 'Overall saved initial state filter B preserved');
    deepEqual(this.pathContextHandler.get('propertyThree').serialize(), this.createFilterC().serialize(), 'Overall saved initial state filter C preserved');
});
test('Selective save by specific IDs over existing initial partial state', function() {
    var idOne;

    idOne = this.pathContextHandler.add(this.createFilterA());
    this.pathContextHandler.update('propertyTwo', this.createFilterB());
    this.pathContextHandler.update('propertyThree', this.createFilterC());

    this.pathContextHandler.saveInitialContext([idOne]);
    this.pathContextHandler.update(idOne, this.createFilterD());

    this.pathContextHandler.saveInitialContext(['propertyThree']);
    this.pathContextHandler.update('propertyThree', this.createFilterD());
    this.pathContextHandler.update('propertyTwo', this.createFilterD());

    this.pathContextHandler.restoreInitialContext();

    deepEqual(this.pathContextHandler.get(idOne).serialize(), this.createFilterA().serialize(), 'Selectively saved initial state filter A restored');
    throws( function() {
            this.pathContextHandler.get('propertyTwo');
    }, 'Error because of property two not existing - never saved');
    deepEqual(this.pathContextHandler.get('propertyThree').serialize(), this.createFilterC().serialize(), 'Selectively saved initial state filter C restored');
});