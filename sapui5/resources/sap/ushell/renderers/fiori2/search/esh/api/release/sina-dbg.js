/*
 * sap-ina-sina - SAP HANA Simple Info Access API
 * version 2.1.24 - 2016-04-13

 * Copyright (c) 2016 SAP SE; All rights reserved
 */

/* source file: datasource.js */
/*
 * @file Simple info access (SINA) API: datasource Interface
 * @namespace sap.bc.ina.api.sina.base.datasource
 * @copyright 2014 SAP SE. All rights reserved.
 */

/* global window */
(function(global) {
    /* eslint valid-jsdoc:0 */
    "use strict";

    if (global !== null) {
        global.sap = global.sap || {};
        global.sap.bc = global.sap.bc || {};
        global.sap.bc.ina = global.sap.bc.ina || {};
        global.sap.bc.ina.api = global.sap.bc.ina.api || {};
        global.sap.bc.ina.api.sina = global.sap.bc.ina.api.sina || {};

        global.sap.bc.ina.api.sina.expandPackage = function(global, packageName) {
            var structure = packageName.split('.');
            var walker = global;
            for (var ii = 0; ii < structure.length; ii++) {
                if (typeof walker[structure[ii]] === 'undefined') {
                    walker[structure[ii]] = {};
                }
                walker = walker[structure[ii]];
            }
        };
    }
}(window));

(function(global) {
    "use strict";

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.base.datasource');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.base.datasource;

    module.DataSource = function() {
        this.init.apply(this, arguments);
    };
    module.DataSourceMetaData = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class datasource metadata
     */
    module.DataSourceMetaData.prototype = {
        init: function() {}
    };

    module.DataSourceType = {
        CATEGORY: "Category",
        BUSINESSOBJECT: "BusinessObject"
    };
    module.DataSourceType.DEFAULT = module.DataSourceType.CATEGORY;

    /**
     * class datasource
     */
    module.DataSource.prototype = {

        /**
         * A generic data source for a query.
         * @constructs sap.bc.ina.api.sina.base.datasource.DataSource
         * Use {sap.bc.ina.api.sina.base#createDataSource} factory instead of this constructor.
         * @private
         */
        init: function(properties) {
            properties = properties || {};
            this.type = properties.type || module.DataSourceType.DEFAULT;
            this.name = properties.name || '';
            this.label = properties.label || properties.name;
            this.labelPlural = properties.labelPlural || properties.label;
            this.key = '';
            this._constructKey();
        },

        /**
         * Compares this datasource with another datasource.
         * @memberOf sap.bc.ina.api.sina.base.datasource.DataSource
         * @instance
         * @param {sap.bc.ina.api.sina.base.datasource.DataSource} otherDS the other datasource to be
         * compared against this datasource.
         * @return {boolean} true if they are equal, false otherwise
         */
        equals: function(otherDS) {
            //if (otherDS instanceof module.DataSource) {
            if (this.key !== otherDS.key) {
                return false;
            }

            return true;
            //}
            //return false;

        },

        clone: function() {
            //shall be overwritten in datasource class of specific provider
        },

        /**
         * Returns the metadata for this data source asynchronously from the server.
         * @memberOf sap.bc.ina.api.sina.base.datasource.DataSource
         * @instance
         * @param  {Function} callback Function will be called after the meta data arrives
         * from the server. This function must have one argument through which it will
         * receive the metadata object.
         */
        getMetaData: function() {},

        /**
         * Returns the metadata for this data source synchronously from the server.
         * Warning: Calling the function will block the javascript thread until
         * a result has been received.
         * @memberOf sap.bc.ina.api.sina.base.datasource.DataSource
         * @instance
         * @return {sap.bc.ina.api.sina.base.datasource.DataSourceMetaData} The metadata for this datasource.
         */
        getMetaDataSync: function() {
            // be careful, root datasource returns null
            if (this.equals(this.sina.getRootDataSource())) {
                return null;
            }
            return this.sina.getBusinessObjectMetaDataSync(this);
        },

        getType: function() {
            return this.type;
        },

        setType: function(type) {
            this.type = type;
        },

        getLabel: function() {
            return this.label;
        },

        getLabelPlural: function() {
            return this.labelPlural;
        },

        getIdentifier: function() {
            //Implemented by each datasource of specific provider
        },

        _constructKey: function() {
            this.key = this.type + '/' + this.name;
        },

        getJson: function() {
            return {
                'type': this.type,
                'name': this.name,
                'label': this.label,
                'labelPlural': this.labelPlural
            };
        },

        setJson: function(json) {
            this.type = json.type || '';
            this.name = json.name || '';
            this.label = json.label || '';
            this.labelPlural = json.labelPlural || '';
            this._constructKey();
        }
    };


}(window));
/* global jQuery, window, document */
/* source file: helper.js */
/*
 * @file Simple info access (SINA) API: Filter Interface
 * @namespace sap.bc.ina.api.sina.base.filter
 * @copyright 2014 SAP SE. All rights reserved.
 */



(function(global) {
    "use strict";

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.helper');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.helper;

    module.removeHtmlTags = function(text) {
        var div = document.createElement('div');
        div.innerHTML = text;
        return div.textContent || div.innerText || '';
    };

}(window));
/* global jQuery, window */
/* source file: filter.js */
/*
 * @file Simple info access (SINA) API: Filter Interface
 * @namespace sap.bc.ina.api.sina.base.filter
 * @copyright 2014 SAP SE. All rights reserved.
 */


(function(global) {
    "use strict";

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.base.filter');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.base.filter;


    module.Filter = function() {
        this.init.apply(this, arguments);
    };
    module.Condition = function() {
        this.init.apply(this, arguments);
    };
    module.ConditionGroup = function() {
        this.init.apply(this, arguments);
    };


    /**
     * class filter
     */
    module.Filter.prototype = {

        /**
         * A simple filter for SINA queries.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createFilter} method instead of this private constructor.
         * @constructs sap.bc.ina.api.sina.base.filter.Filter
         * @param  {Object} properties Configuration object.
         * @private
         * @since SAP HANA SPS 06
         */
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina;
            this.setDataSource(properties.dataSource);
            this.conditionGroupsByAttribute = {};
            this.defaultConditionGroup = this.sina.createFilterConditionGroup({
                label: "DefaultRoot",
                operator: 'And'
            });
            this.searchTerms = properties.searchTerms || "";
        },

        _findAttributeOfCondition: function(condition) {

            // duplicate of getAttribute!!

            // is this a simple condition?
            if (condition instanceof module.Condition) {
                return {
                    attribute: condition.attribute,
                    attributeLabel: condition.attributeLabel
                };
            }

            // condition group -> use first child
            return this._findAttributeOfCondition(condition.conditions[0]);

        },

        _findAttributeLabelOfGroup: function(filterConditionGroup) {
            if (!filterConditionGroup || !filterConditionGroup.conditions) {
                return "";
            }
            for (var i = 0; i < filterConditionGroup.conditions.length; i++) {
                var filterCondition = filterConditionGroup.conditions[i];
                if (filterCondition instanceof module.Condition) {
                    return filterCondition.attributeLabel;
                } else if (filterCondition instanceof module.ConditionGroup) {
                    return this._findAttributeLabelOfGroup(filterCondition);
                }
            }
        },

        /**
         * Adds a filter condition to the current set of filter conditions. By default
         * conditions of the same attribute will be 'OR'ed. Conditions between different
         * attributes will have an 'AND' operator.
         * @memberOf sap.bc.ina.api.sina.base.filter.Filter
         * @instance
         * @since SAP HANA SPS 06
         * @param {String|Object} attribute Technical identifier of the attribute, as defined in the database, or a properties object.
         * @param {String} operator Operator of the filter condition. The default value is "=".
         * @param {String} value Value that should be filtered within the attribute.
         * @param {String} attributeLabel a label for attribute
         * @param {String} valueLabel a label for value
         * @returns {sap.bc.ina.api.sina.impl.inav2.filter.DataSource} this object for method chaining
         */
        addFilterCondition: function(attribute, operator, value, attributeLabel, valueLabel) {
            var filterCondition;
            var localAttribute;

            if (jQuery.type(attribute) === 'object') {
                if (attribute instanceof module.Condition) {
                    filterCondition = attribute;
                    localAttribute = filterCondition.attribute;
                } else if (attribute instanceof module.ConditionGroup) {
                    filterCondition = attribute;
                    localAttribute = this._findAttributeOfCondition(filterCondition).attribute;
                } else {
                    var props = attribute;
                    if (props.conditions) {
                        filterCondition = this.sina.createFilterConditionGroup(props);
                        localAttribute = this._findAttributeOfGroup(filterCondition);
                    } else {
                        filterCondition = this.sina.createFilterCondition(props.attribute, props.operator, props.value, props.attributeLabel, props.valueLabel);
                        localAttribute = props.attribute;
                    }
                }
            } else {
                if (attribute === undefined || operator === undefined || value === undefined) {
                    return this;
                }
                filterCondition = this.sina.createFilterCondition(attribute, operator, value, attributeLabel, valueLabel);
                localAttribute = filterCondition.attribute;
            }
            if (this.defaultConditionGroup.hasCondition(filterCondition)) {
                return this;
            }
            if (this.conditionGroupsByAttribute[localAttribute] === undefined) {
                this.conditionGroupsByAttribute[localAttribute] = this.sina.createFilterConditionGroup({
                    operator: 'OR',
                    label: this._findAttributeOfCondition(filterCondition).attributeLabel || ""
                });
                this.defaultConditionGroup.addCondition(this.conditionGroupsByAttribute[localAttribute]);
            }
            this.conditionGroupsByAttribute[localAttribute].addCondition(filterCondition);

            return this;
        },

        setDefaultConditionGroup: function(defaultConditionGroup) {
            this.defaultConditionGroup = defaultConditionGroup;
            this._initConditionGroupsByAttribute();
        },

        _initConditionGroupsByAttribute: function() {
            this.conditionGroupsByAttribute = {};
            var conditionGroups = this.defaultConditionGroup.getConditions();
            for (var i = 0; i < conditionGroups.length; ++i) {
                var conditionGroup = conditionGroups[i];
                var attribute = this._findAttributeOfCondition(conditionGroup).attribute;
                this.conditionGroupsByAttribute[attribute] = conditionGroup;
            }
        },

        empty: function() {
            this.resetFilterConditions();
            this.searchTerms = '';
            return this;
        },

        hasFilterCondition: function(attributeOrFilterCondition, operator, value) {
            if (typeof attributeOrFilterCondition === "string") {
                attributeOrFilterCondition = this.sina.createFilterCondition(attributeOrFilterCondition, operator, value);
            }
            return this.defaultConditionGroup.hasCondition(attributeOrFilterCondition);
        },

        resetFilterConditions: function() {
            this.conditionGroupsByAttribute = {};
            this.defaultConditionGroup = this.sina.createFilterConditionGroup({
                label: 'DefaultRoot',
                operator: 'And',
                sina: this.sina
            });
            return this;
        },

        removeFilterCondition: function(attribute, operator, value, attributeLabel, valueLabel) {
            var filterCondition;
            var localAttribute;

            if (jQuery.type(attribute) === 'object') {
                if (attribute instanceof module.Condition) {
                    filterCondition = attribute;
                    localAttribute = filterCondition.attribute;
                } else if (attribute instanceof module.ConditionGroup) {
                    filterCondition = attribute;
                    localAttribute = this._findAttributeOfCondition(filterCondition).attribute;
                } else {
                    var props = attribute;
                    filterCondition = this.sina.createFilterCondition(props.attribute, props.operator, props.value, props.attributeLabel, props.valueLabel);
                    localAttribute = props.attribute;
                }
            } else {
                if (attribute === undefined || operator === undefined || value === undefined) {
                    return this;
                }
                filterCondition = this.sina.createFilterCondition(attribute, operator, value, attributeLabel, valueLabel);
                localAttribute = filterCondition.attribute;
            }

            this.defaultConditionGroup.removeCondition(filterCondition); // TODO why?
            var attributeConditionGroup = this.conditionGroupsByAttribute[localAttribute];
            if (attributeConditionGroup) {
                attributeConditionGroup.removeCondition(filterCondition);
                if (attributeConditionGroup.conditions.length === 0) {
                    delete this.conditionGroupsByAttribute[localAttribute];
                    this.defaultConditionGroup.removeCondition(attributeConditionGroup);
                }
            }

            return this;
        },

        addFilterConditionGroup: function(conditionGroup) {
            this.addFilterCondition(conditionGroup);
        },

        getFilterConditions: function() {
            return this.defaultConditionGroup;
        },

        getSearchTerms: function() {
            return this.searchTerms;
        },

        removeFilterConditionGroup: function(conditionGroup) {
            this.defaultConditionGroup.removeCondition(conditionGroup);
            var attribute = conditionGroup.conditions[0].attribute;
            if (this.conditionGroupsByAttribute[attribute]) {
                this.conditionGroupsByAttribute[attribute].removeCondition(conditionGroup);
                if (this.conditionGroupsByAttribute[attribute].conditions.length === 0) {
                    delete this.conditionGroupsByAttribute[attribute];
                }

            }
        },

        setSearchTerms: function(searchTerms) {
            this.searchTerms = searchTerms || "";
        },

        /**
         * Gets the data source that is currently in use by the filter instance.
         * @memberOf sap.bc.ina.api.sina.base.filter.Filter
         * @instance
         * @return {sap.bc.ina.api.sina.base.datasource.DataSource} The data source instance.
         */
        getDataSource: function() {
            return this.dataSource;
        },

        /**
         * Sets the data source for the filter.
         * @memberOf sap.bc.ina.api.sina.base.filter.Filter
         * @instance
         * @param {sap.bc.ina.api.sina.base.datasource.DataSource} dataSource A SINA data source.
         */
        setDataSource: function(dataSource) {
            if (this.dataSource && !this.dataSource.equals(dataSource)) {
                this.resetFilterConditions();
            }
            this.dataSource = dataSource;
        },

        getJson: function() {
            return {
                dataSource: this.dataSource.getJson(),
                defaultConditionGroup: this.defaultConditionGroup.getJson(),
                searchTerms: this.searchTerms
            };
        },

        setJson: function(json) {
            var defaultConditionGroup;
            this.empty();
            if (json.dataSource) {
                var dataSource = this.sina.createDataSource();
                dataSource.setJson(json.dataSource);
                this.setDataSource(dataSource);
            }
            this.setSearchTerms(json.searchTerms);
            if (jQuery.isPlainObject(json.defaultConditionGroup)) {
                defaultConditionGroup = this.sina.createFilterConditionGroup(json.defaultConditionGroup);
            }
            if (defaultConditionGroup) {
                this.setDefaultConditionGroup(defaultConditionGroup);
            }
        },

        clone: function() {
            var newFilter = this.sina.createFilter();
            newFilter.dataSource = this.dataSource;
            newFilter.searchTerms = this.searchTerms;
            newFilter.conditionGroupsByAttribute = {};
            if (this.defaultConditionGroup && this.defaultConditionGroup.clone) {
                newFilter.defaultConditionGroup = this.defaultConditionGroup.clone();
                for (var i = 0; i < newFilter.defaultConditionGroup.conditions.length; i++) {
                    var subConditionGroup = newFilter.defaultConditionGroup.conditions[i];
                    var attributeName = this._getAttributeName(subConditionGroup);
                    newFilter.conditionGroupsByAttribute[attributeName] = subConditionGroup;
                }
            }
            return newFilter;
        },

        _getAttributeName: function(condition) {
            if (condition.attribute) {
                return condition.attribute;
            } else {
                var subCondition = condition.conditions[0];
                return this._getAttributeName(subCondition);
            }
        },

        equals: function(otherFilter) {
            if (!(otherFilter instanceof module.Filter)) {
                return false;
            }

            if (this.dataSource && otherFilter.dataSource) {
                if (!this.dataSource.equals(otherFilter.dataSource)) {
                    return false;
                }
            } else if (!this.dataSource && otherFilter.dataSource) {
                return false;
            } else if (this.dataSource && !otherFilter.dataSource) {
                return false;
            }

            if (this.searchTerms !== otherFilter.searchTerms) {
                return false;
            }

            if (!this.defaultConditionGroup.equals(otherFilter.defaultConditionGroup)) {
                return false;
            }

            return true;
        }


    };

    /**
     * class condition
     */
    module.Condition.prototype = {

        /**
         * Creates a new filter condition.
         * @constructs sap.bc.ina.api.sina.base.filter.Condition
         * @param {String|Object} attribute     Technical identifier of the attribute, as defined in the database.
         * If the type is Object, this object can have properties with the name and value of the arguments.
         * @param {String} operator             Operator of the filter condition. The default value is "=".
         * @param {String} value                Value that should be filtered in the attribute.
         * @param {Object} sina                 sina instance
         * @param {String} attributeLabel       external representation of attribute
         * @param {String} valueLabel           external representation of value
         * @param {String} label                external representation of the filter condition
         */
        init: function(attribute, operator, value, sina, attributeLabel, valueLabel, label) {
            if (jQuery.type(attribute) === 'object') {
                var props = attribute;
                attribute = props.attribute;
                operator = props.operator;
                value = props.value;
                sina = props.sina;
                attributeLabel = props.attributeLabel;
                valueLabel = props.valueLabel;
                label = props.label;
            }
            this.attribute = attribute || "";
            this.operator = operator || "=";
            this.value = value;
            this.sina = sina;
            this.attributeLabel = attributeLabel || "";
            this.valueLabel = valueLabel || "";
            this.label = label || "";
        },

        equals: function(otherCondition) {
            if (!(otherCondition instanceof module.Condition)) {
                return false;
            }
            return this.attribute === otherCondition.attribute &&
                this.operator === otherCondition.operator &&
                this.value === otherCondition.value;
            /*  this.valueLabel === otherCondition.valueLabel &&
                this.attributeLabel === otherCondition.attributeLabel;*/
        },

        toString: function() {
            return this.attributeLabel + this.operator + this.valueLabel + '';
        },

        getJson: function() {
            return {
                attribute: this.attribute,
                value: this.value,
                operator: this.operator,
                attributeLabel: this.attributeLabel,
                valueLabel: this.valueLabel,
                label: this.label
            };
        },

        setJson: function(json) {
            if (!json.attribute || !json.value || !json.operator) {
                throw 'Following filter condition JSON does not have all necessary properties(attribute, value, operator): ' + JSON.stringify(json);
            }
            this.attribute = json.attribute;
            this.value = json.value;
            this.operator = json.operator;
            this.attributeLabel = json.attributeLabel;
            this.valueLabel = json.valueLabel;
            this.label = json.label;
        },

        clone: function() {
            var newCondition = this.sina.createFilterCondition();
            newCondition.operator = this.operator;
            newCondition.attribute = this.attribute;
            newCondition.value = this.value;
            newCondition.attributeLabel = this.attributeLabel;
            newCondition.valueLabel = this.valueLabel;
            newCondition.label = this.label;
            return newCondition;
        }


    };

    /**
     * class condition group
     */
    module.ConditionGroup.prototype = {

        /**
         * Creates a new filter condition group.
         * @constructs sap.bc.ina.api.sina.base.filter.ConditionGroup
         * @param {Object} properties     properties configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            this.label = properties.label || '';
            this.setOperator(properties.operator || 'And');
            this.sina = properties.sina;
            this.conditions = properties.conditions || [];
            for (var i = 0; i < this.conditions.length; i++) {
                var filterCondition = this.conditions[i];
                if (jQuery.isPlainObject(filterCondition)) {
                    if (filterCondition.conditions) {
                        this.conditions[i] = this.sina.createFilterConditionGroup(filterCondition);
                    } else {
                        this.conditions[i] = this.sina.createFilterCondition(filterCondition);
                    }
                }
            }
        },

        addCondition: function(condition) {
            if (condition instanceof module.ConditionGroup || condition instanceof module.Condition) {
                this.conditions.push(condition);
                return this;
            }
            throw "Condition of type " + typeof condition + " can not be added to a filterConditionGroup";
        },

        equals: function(otherConditionGroup) {
            if (!(otherConditionGroup instanceof module.ConditionGroup)) {
                return false;
            }
            if (this.conditions.length !== otherConditionGroup.conditions.length) {
                return false;
            }
            for (var i = 0, len = this.conditions.length; i < len; i++) {
                var condA = this.conditions[i];
                var condAFoundInOtherCG = false;
                for (var j = 0, lenJ = otherConditionGroup.conditions.length; j < lenJ; j++) {
                    var condB = otherConditionGroup.conditions[j];
                    if (condA.equals(condB)) {
                        condAFoundInOtherCG = true;
                        break;
                    }
                }
                if (!condAFoundInOtherCG) {
                    return false;
                }
            }
            if (this.label !== otherConditionGroup.label) {
                return false;
            }
            return true;
        },

        getConditions: function() {
            return this.conditions;
        },

        getConditionsAsArray: function(group, conditions) {
            conditions = conditions || [];
            group = group || this;
            for (var i = 0; i < group.conditions.length; i++) {
                if (group.conditions[i] instanceof module.ConditionGroup) {
                    this.getConditionsAsArray(group.conditions[i], conditions);
                } else {
                    conditions.push(group.conditions[i]);
                }
            }
            return conditions;
        },

        hasCondition: function(condition) {
            for (var i = 0, len = this.conditions.length; i < len; i++) {
                var item = this.conditions[i];
                if (item instanceof module.ConditionGroup) {
                    if (condition instanceof module.ConditionGroup) {
                        if (item.equals(condition)) {
                            return true;
                        }
                    } else if (condition instanceof module.Condition) {
                        if (item.hasCondition(condition)) {
                            return true;
                        }
                    }
                } else if (item instanceof module.Condition) {
                    if (condition instanceof module.ConditionGroup) {
                        if (condition.hasCondition(item)) {
                            return true;
                        }
                    } else if (condition instanceof module.Condition) {
                        if (item.equals(condition)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        removeCondition: function(condition) {
            var cond;
            for (var i = 0, len = this.conditions.length; i < len; i++) {
                cond = this.conditions[i];
                if (cond instanceof module.ConditionGroup) {
                    if (condition instanceof module.ConditionGroup) {
                        if (cond.equals(condition)) {
                            this.conditions.splice(i, 1);
                        }
                    } else if (condition instanceof module.Condition) {
                        cond.removeCondition(condition);
                    }
                } else if (cond instanceof module.Condition) {
                    if (condition instanceof module.ConditionGroup) {
                        condition.removeCondition(cond);
                    } else if (condition instanceof module.Condition) {
                        if (cond.equals(condition)) {
                            this.conditions.splice(i, 1);
                        }
                    }
                }
            }
            //clean up empty condition groups
            for (var j = 0, lenJ = this.conditions.length; j < lenJ; j++) {
                cond = this.conditions[j];
                if (cond instanceof module.ConditionGroup && cond.conditions.length === 0) {
                    this.conditions.splice(j, 1);
                }
            }
            return this;
        },

        setLabel: function(label) {
            this.label = label;
            return this;
        },

        setOperator: function(operator) {
            switch (operator.toLowerCase()) {
                case 'or':
                    operator = 'Or';
                    break;
                case 'and':
                    operator = 'And';
                    break;
                default:
                    throw {
                        message: 'unknown operator for condition group: ' + operator
                    };
            }
            this.operator = operator;
            return this;
        },

        toString: function() {
            return this.label;
        },

        getJson: function() {
            return {
                operator: this.operator,
                label: this.label,
                conditions: jQuery.map(this.conditions, function(condition) {
                    return condition.getJson();
                })
            };
        },

        setJson: function(json) {
            this.operator = json.operator;
            this.label = json.label || "";
            var jsonConditions = json.conditions;
            for (var i = 0; i < jsonConditions.length; i++) {
                var jsonCondition = jsonConditions[i];
                var condition = null;
                if (jsonCondition.attribute) {
                    // in case of simple condition
                    condition = this.sina.createFilterCondition();
                } else if (jQuery.isArray(jsonCondition.conditions) && jsonCondition.conditions.length > 0) {
                    // in case of sub condition group
                    condition = this.sina.createFilterConditionGroup();
                } else {
                    throw 'Following filter condition group JSON has neither attribute nor sub conditions:' + JSON.stringify(jsonCondition);
                }
                condition.setJson(jsonCondition);
                this.conditions.push(condition);
            }
        },

        clone: function() {
            var newConditionGroup = this.sina.createFilterConditionGroup();
            newConditionGroup.operator = this.operator;
            newConditionGroup.label = this.label;
            newConditionGroup.sina = this.sina;
            newConditionGroup.conditions = [];
            for (var i = 0; i < this.conditions.length; i++) {
                var condition = this.conditions[i];
                newConditionGroup.conditions.push(condition.clone());
            }
            return newConditionGroup;
        }

    };
}(window));

/* source file: sinabase.js */
/*
 * @file The Simple Information Access (SINA) Interface
 * @namespace sap.bc.ina.api.sina.base
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */
(function(global) {
    /* eslint new-cap:0 */
    "use strict";


    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.base');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.base;

    /**
     * provider registry
     */
    jQuery.extend(module, {

        provider: {},

        registerProvider: function(provider) {
            this.provider[provider.impl_type] = provider;
        }

    });

    /**
     * class sina base
     */
    module.Sina = function() {
        this.init.apply(this, arguments);
    };

    module.Sina.prototype = {

        /**
         * Sina base class. Use the getSina factory in {@link sap.bc.ina.api.sina} instead
         * of using this private constructor directly.
         * @constructs sap.bc.ina.api.sina.base.Sina
         * @since SAP HANA SPS 08
         * @private
         */
        init: function() {

        },

        _initQueryProperties: function(properties) {
            properties = properties || {};
            properties.sina = this;
            properties.system = properties.system || this.getSystem();
            if (properties.dataSource) {
                properties.dataSource = this.createDataSource(properties.dataSource);
            }
            return properties;
        },

        /**
         * Creates and returns a chart query for simple analytics.
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @since SAP HANA SPS 06
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.ChartQuery} The instance of a chart query.
         * @example
         * <caption>INA V2: Create a query that returns a result set suitable for a bar or pie chart:</caption>
         * var query = sap.bc.ina.api.sina.createChartQuery()
         * .dataSource({ schemaName : "SYSTEM",
         *               objectName : "J_EPM_PRODUCT"
         *  })
         * .addDimension("CATEGORY")
         * .addMeasure({ name : "CATEGORY",
         *               aggregationFunction : "COUNT"
         * }); //end of query
         *
         * @example
         * <caption>ODATA: Create a query that returns a result set suitable for a bar or pie chart:</caption>
         * var query = sap.bc.ina.api.sina.createChartQuery()
         * .dataSource({ collections: ['bp_crm'] })
         * .addDimension("CATEGORY")
         * .addMeasure({ name : "CATEGORY",
         *               aggregationFunction : "COUNT"
         * }); //end of query
         *
         * @example
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getElements();
         * // contents of elements:
         * [
            {
              "label": "Others",
              "labelRaw": "Others",
              "value": "13",
              "valueRaw": 13
            },
            {
              "label": "Notebooks",
              "labelRaw": "Notebooks",
              "value": "10",
              "valueRaw": 10
            },
            {
              "label": "Flat screens",
              "labelRaw": "Flat screens",
              "value": "9",
              "valueRaw": 9
            },
            {
              "label": "Software",
              "labelRaw": "Software",
              "value": "8",
              "valueRaw": 8
            },
            {
              "label": "Electronics",
              "labelRaw": "Electronics",
              "value": "5",
              "valueRaw": 5
            }
          ]
         */
        createChartQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.chartQuery(properties);
        },

        /**
         * Creates and returns a search query for text queries.
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @since SAP HANA SPS 06
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.SearchQuery} The instance of a search query.
         * @example
         * <caption>INA V2: Simple search for the term "basic" in view J_EPM_PRODUCT. If the term is
         * found in a column marked in the view as freestyle search relevant, the content of columns
         * in the attributes array is returned, in this case PRODUCT_ID, TEXT, CATEGORY, PRICE,
         * and CURRENCY_CODE. The return attributes do not have to be marked as freestyle search relevant though.
		 * Note that the suggestion query does not make use of the freestyle search relevant property.
		 * So if you set this property to false in the view, you will not get a search result using a suggestion as search term.</caption>
         * var query = sap.bc.ina.api.sina.createSearchQuery({
            dataSource          : { schemaName  : "SYSTEM",
                                    objectName  : "J_EPM_PRODUCT" },
            attributes          : [ "PRODUCT_ID",
                                    "TEXT",
                                    "CATEGORY",
                                    "PRICE",
                                    "CURRENCY_CODE"],
            searchTerms         : "basic",
            skip                : 0,
            top                 : 5
           });
         * @example
         * <caption>ODATA: Simple search for the term "basic" in the odata collection 'bp_crm'.</caption>
         * var query = sap.bc.ina.api.sina.createSearchQuery({
            dataSource          : { collections: ['bp_crm'] },
            searchTerms         : "basic",
            skip                : 0,
            top                 : 5
           });
         *
         * @example
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getElements();
         * // contents of elements:
         * [{ "PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1000","value":"HT-1000"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 15 with 1,7GHz - 15","value":"Notebook Basic 15 with 1,7GHz - 15"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"956.00","value":"956.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // second result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1001","value":"HT-1001"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 17 with 1,7GHz - 17","value":"Notebook Basic 17 with 1,7GHz - 17"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1249.00","value":"1249.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // third result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1002","value":"HT-1002"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 18 with 1,7GHz - 18","value":"Notebook Basic 18 with 1,7GHz - 18"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1570.00","value":"1570.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"USD","value":"USD"}},
         *     // fourth result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1003","value":"HT-1003"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 19 with 1,7GHz - 19","value":"Notebook Basic 19 with 1,7GHz - 19"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1650.00","value":"1650.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // fifth result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-8000","value":"HT-8000"},
         *     "TEXT":{"label":"TEXT","valueRaw":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM","value":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"799.00","value":"799.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}}
         *  ]
         * @example
         * <caption>INA V2: The same search as in the previous example but now with term highlighting. If the term
         * "basic" is found in the TEXT attribute, it will be returned as &lt;b&gt;basic&lt;/b&gt;.
         * The parameter maxLength defines the length of chars to be returned.
         * The parameter startPosition defines start position of chars to be returned.
         * The maxLength and startPosition parameters can be omitted. In this case, the default values
         * shown in the example below are used.</caption>
         * var searchQuery = sap.bc.ina.api.sina.createSearchQuery({
         *  dataSource          : { "schemaName"  :  "SYSTEM" ,
         *                          "objectName"  :  "J_EPM_PRODUCT" },
         *  attributes          : [ "PRODUCT_ID",
         *                          { attributeName: "TEXT", highlighted:true,
         *                            maxLength:30000, startPosition:1 } ],
         *  searchTerms         : "basic",
         *  skip                : 0,
         *  top                 : 5
         * });
         *  var resultSet = searchQuery.getResultSetSync();
         *  var searchResults = resultSet.getElements();
         * @example
         * <caption>INA V2: The same search as in the previous example, but now with the snippet function. If the term
         * "basic" is found in the TEXT attribute
         * the content is shortened and will begin and end with three dots (...)
         * In addition to the snippet, the search term is highlighted the same way as in the highlighted function (see previous example).
         * It is therefore not necessary to use highlighted and snippet for the same attribute.
         * </caption>
         * var searchQuery = sap.bc.ina.api.sina.createSearchQuery({
         *  dataSource          : { "schemaName"  :  "SYSTEM" ,
         *                          "objectName"  :  "J_EPM_PRODUCT" },
         *  attributes          : [ "PRODUCT_ID",
         *                          { attributeName: "TEXT", snippet:true } ],
         *  searchTerms         : "basic",
         *  skip                : 0,
         *  top                 : 5
         * });
         *  var resultSet = searchQuery.getResultSetSync();
         *  var searchResults = resultSet.getElements();
         */
        createSearchQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.searchQuery(properties);
        },



        /**
         * Creates a chart query that delivers a result set suitable for a group bar chart.
         * <br /><b><br /><b>Only supported with INA V2 provider.</b></b>
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @since SAP HANA SPS 06
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.GroupBarChartQuery} The instance of a chart query.
         * @example
         * <caption>Grouped bar chart query with two dimensions and one measure:</caption>
         * var query = sap.bc.ina.api.sina.sina.createGroupBarChartQuery({
         *      dataSource : { "schemaName"  :  "SYSTEM" ,
         *                     "objectName"  :  "J_EPM_PRODUCT" },
         *      dimensions : ['YEAR', 'COUNTRY'],
         *      measures   : [{ name: 'PROFIT', aggregationFunction: 'SUM' }]
         *  });
         *  var resultSet = query.getResultSetSync();
         *  var elements = resultSet.getElements();
         * @example
         *  <caption>Grouped bar chart query with two dimensions and one measure:</caption>
         * var query = sap.bc.ina.api.sina.sina.createGroupBarChartQuery();
         * query.dataSource({ schemaName : "SYSTEM",
         *                    objectName : "J_EPM_PRODUCT"
         * });
         * query.addDimension('CURRENCY_CODE');
         * query.addDimension('CATEGORY');
         * query.count('PRODUCT_ID');
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getELements();
         * // contents of elements:
         * [
            {
              "label": "EUR",
              "value": [
                {
                  "label": "Notebooks",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "6",
                        "valueRaw": 6
                      }
                    }
                  ]
                },
                {
                  "label": "Others",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "5",
                        "valueRaw": 5
                      }
                    }
                  ]
                },
                {
                  "label": "Software",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "3",
                        "valueRaw": 3
                      }
                    }
                  ]
                }
              ]
            }
            ]
         */
        createGroupBarChartQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.groupBarChartQuery(properties);
        },

        /**
         * Creates a chart query that delivers a result set suitable for a line chart.
         * <br /><b>Only supported with INA V2 provider.</b>
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @since SAP HANA SPS 06
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.LineChartQuery} Instance of a chart query.
         * @example
         *  <caption>Line chart with two dimensions and one measure:</caption>
         * var queryProperties = {
         *     dataSource      : { schemaName  : "SYSTEM",
                                   objectName  : "J_EPM_PRODUCT"
                                 },
               dimensionX      : {name: 'CATEGORY'},
               dimensionLine   : {name: 'CURRENCY_CODE'},
               measureY        : {name: 'PRODUCT_ID', aggregationFunction: 'COUNT'}
           };
           query = sap.bc.ina.api.sina.sina.createLineChartQuery(queryProperties);
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getEements();
         * // contents of elements (shortened):
         * [
             {
               "label": "EUR",
               "value": [
                 {
                   "x": "Notebooks",
                   "y": 6
                 },
                 {
                   "x": "Others",
                   "y": 5
                 },
                 {
                   "x": "Software",
                   "y": 3
                 },
                 {
                   "x": "Speakers",
                   "y": 3
                 },
                 {
                   "x": "Electronics",
                   "y": 2
                 },
                 {
                   "x": "Flat screens",
                   "y": 2
                 },
                 {
                   "x": "Laser printers",
                   "y": 2
                 },
                 {
                   "x": "Mice",
                   "y": 2
                 },
                 {
                   "x": "PC",
                   "y": 2
                 },
                 {
                   "x": "Workstation ensemble",
                   "y": 2
                 }
               ]
             },
             {
               "label": "USD",
               "value": [
                 {
                   "x": "Others",
                   "y": 4
                 },
                 {
                   "x": "Flat screens",
                   "y": 2
                 },
                 {
                   "x": "Handhelds",
                   "y": 2
                 },
                 {
                   "x": "High Tech",
                   "y": 2
                 },
                 {
                   "x": "Notebooks",
                   "y": 2
                 },
                 {
                   "x": "Software",
                   "y": 2
                 },
                 {
                   "x": "Electronics",
                   "y": 1
                 },
                 {
                   "x": "Graphic cards",
                   "y": 1
                 },
                 {
                   "x": "Handheld",
                   "y": 1
                 },
                 {
                   "x": "Headset",
                   "y": 1
                 }
               ]
             }
          ]
         */
        createLineChartQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            properties.dimensions = [properties.dimensionLine, properties.dimensionX];
            properties.measures = [{
                name: properties.measureY.name,
                aggregationFunction: properties.measureY.aggregationFunction
            }];
            return new this._provider.lineChartQuery(properties);
        },

        /**
         * Creates and returns a suggestion for text queries.
         * <br /><b>Only supported with INA V2 provider.</b>
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @since SAP HANA SPS 06
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.SuggestionQuery} The instance of a suggestion query.
         * @example
         * <caption>Getting suggestions asynchronously for attributes CATEGORY and PRODUCT_ID.
         * Note that, other than the search query, the suggestion query does not make use of the freestyle search relevant property set in the view.
         * So if you set this property to false in the view, you will get a suggestion but a search using the suggestion as a search term will show no results.</caption>
         *  var properties = {
         *      dataSource : { "schemaName"  : "SYSTEM",
         *                    "objectName"  : "J_EPM_PRODUCT"
         *                   },
         *      searchTerms : "s*",
         *      top   : 10,
         *      skip  : 0,
         *      onSuccess : function(resultset) {
         *                        var suggestions = resultset.getElements();
         *                        console.dir(suggestions);
         *      },
         *      onError :   function(error){
         *                        console.error(error);
         *      },
         *      attributes : ["CATEGORY","PRODUCT_ID"]
         *  };
         *  var suggestion_query = sap.bc.ina.api.sina.sina.createSuggestionQuery(properties);
         *  suggestion_query.getResultSet(); //returns immediately, see onSuccess on how to go on
         */
        createSuggestionQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.suggestionQuery(properties);
        },


        /**
         * Creates and returns a perspective query.
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @private
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.PerspectiveQuery} The instance of a perspective query.
         */
        createPerspectiveQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.perspectiveQuery(properties);
        },

        /**
         * Creates and returns a perspective search query.
         * @ignore
         * @since SAP HANA SPS 07
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @private
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.PerspectiveSearchQuery} The instance of a perspective search query.
         */
        createPerspectiveSearchQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.perspectiveSearchQuery(properties);
        },

        /**
         * Creates and returns a perspective query.
         * @ignore
         * @since SAP HANA SPS 07
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @private
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.PerspectiveQuery} The instance of a perspective query.
         */
        createPerspectiveGetQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.perspectiveGetQuery(properties);
        },

        /**
         * Gets or sets a system that will be used for data access.
         * @ignore
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @param  {sap.bc.ina.api.sina.system.System|sap.bc.ina.api.sina.system.System} sys The system representation.
         * @return {sap.bc.ina.api.sina.system.System|sap.bc.ina.api.sina.system.System} The system currently set,
         * but only if no parameter has been set.
         * @deprecated SAP HANA SPS 09
         */
        sinaSystem: function(sys) {
            // must not be named system or it would overwrite sap.bc.ina.api.sina.system module!
            // global.console.warn('sinaSystem is deprecated and will be removed within the next HANA SPS, use getSystem/setSystem instead!');
            if (sys) {
                this.sys = sys;
            } else {
                return this.sys;
            }
            return {};
        },

        /**
         * Gets a system that will be used for data access.
         * @ignore
         * @since SAP HANA SPS 09
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @return {sap.bc.ina.api.sina.system.System|Object} The system currently set, if no system is available it return an empty object.
         * @deprecated SAP HANA SPS 09
         */
        getSystem: function() {
            if (this.sys) {
                return this.sys;
            }
            return {};
        },

        /**
         * Sets a system that will be used for data access.
         * @ignore
         * @since SAP HANA SPS 09
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @param  {sap.bc.ina.api.sina.system.System} system The system representation.
         * @deprecated SAP HANA SPS 09
         */
        setSystem: function(system) {
            this.sys = system;
        },

        createFacet: function(properties) {
            properties.sina = this;
            return new this._provider.Facet(properties);
        },

        ChartQueryType: {
            ATTRIBUTE: 'attribute', //TODO to be replaced by BAR, PIE, LINE etc
            DATASOURCE: 'datasource'
        },

        FacetType: {
            ATTRIBUTE: 'attribute',
            DATASOURCE: 'datasource',
            SEARCH: 'searchresult'
        },

        ResultElementKeyStatus: {
            OK: 'ok',
            NO_KEY: 'no_key',
            NO_VALUE: 'no_value'
        },

        SuggestionType: {
            HISTORY: 'history',
            DATASOURCE: 'datasource',
            OBJECTDATA: 'objectdata'
        },

        /**
         * Creates and returns a filter.
         * @since SAP HANA SPS 07
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.filter.Filter} The instance of a filter object.
         */
        createFilter: function(properties) {
            properties = properties || {};
            properties.sina = this;
            return new this._provider.Filter(properties);
        },

        createFilterCondition: function(attribute, operator, value, attributeLabel, valueLabel, label) {
            attribute = attribute || {};
            var properties;
            if (typeof attribute === 'object') {
                properties = attribute;
                properties.sina = this;
            } else {
                properties = {
                    attribute: attribute,
                    operator: operator,
                    value: value,
                    sina: this,
                    attributeLabel: attributeLabel,
                    valueLabel: valueLabel,
                    label: label
                };
            }
            if (properties && properties.conditions) {
                return new this._provider.FilterConditionGroup(properties);
            }
            return new this._provider.FilterCondition(properties);
        },

        createFilterConditionGroup: function(properties) {
            properties = properties || {};
            properties.sina = this;
            return new this._provider.FilterConditionGroup(properties);
        },

        /**
         * Creates and returns a dataSource.
         * @since SAP HANA SPS 07
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @instance
         * @private
         * @param  {Object} properties Configuration object.
         * @return {sap.bc.ina.api.sina.base.filter.DataSource} The instance of a dataSource object.
         */
        createDataSource: function(properties) {
            var ownProperties = {};
            if (properties) {
                ownProperties = properties;
            }
            ownProperties.sina = ownProperties.sina || this;
            return new this._provider.DataSource(ownProperties);
        },

        createDataSourceQuery: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.DataSourceQuery(properties);
        },

        /**
         * Returns the root data source, which contains all other data sources.
         * @since SAP HANA SPS 09
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @return {sap.bc.ina.api.sina.base.filter.DataSource} the root datasource.
         */
        getRootDataSource: function() {
            return this._provider.getRootDataSource();
        },

        /**
         * Returns an instance of a search configuration
         * @memberOf sap.bc.ina.api.sina.base.Sina
         * @param {object} properties INA search configuration object
         * @returns {object} A search configuration
         */
        getSearchConfiguration: function(properties) {
            properties = this._initQueryProperties(properties);
            return new this._provider.searchConfiguration(properties);
        },

        addUserHistoryEntry: function(oEntry) {
            var properties = this._initQueryProperties(properties);
            properties.oEntry = oEntry;
            return this._provider.addUserHistoryEntry(properties);
        },

        emptyUserHistory: function() {
            var properties = this._initQueryProperties(properties);
            return this._provider.emptyUserHistory(properties);
        },

        getDataSources: function(properties) {
            return this._provider.metaDataService.getDataSources(properties);
        },

        getDataSourcesSync: function(properties) {
            return this._provider.metaDataService.getDataSourcesSync(properties);
        },

        getDataSource: function(dataSource) {
            return this._provider.metaDataService.getDataSource(dataSource);
        },

        getDataSourceByBusinessObjectName: function(businessObjectName) {
            return this._provider.metaDataService.getDataSourceByBusinessObjectName(businessObjectName);
        },

        getDataSourceSync: function(dataSource) {
            return this._provider.metaDataService.getDataSourceSync(dataSource);
        },

        getDataSourceSyncByBusinessObjectName: function(businessObjectName) {
            return this._provider.metaDataService.getDataSourceSyncByBusinessObjectName(businessObjectName);
        },

        getBusinessObjectsMetaData: function() {
            return this._provider.metaDataService.getBusinessObjectsMetaData();
        },


        getBusinessObjectsMetaDataSync: function() {
            return this._provider.metaDataService.getBusinessObjectsMetaDataSync();
        },

        getBusinessObjectMetaData: function(dataSource) {
            return this._provider.metaDataService.getBusinessObjectMetaData(dataSource);
        },

        getBusinessObjectMetaDataByBusinessObjectName: function(businessObjectName) {
            return this._provider.metaDataService.getBusinessObjectMetaDataByBusinessObjectName(businessObjectName);
        },

        getBusinessObjectMetaDataSync: function(dataSource) {
            return this._provider.metaDataService.getBusinessObjectMetaDataSync(dataSource);
        },

        getBusinessObjectMetaDataSyncByBusinessObjectName: function(businessObjectName) {
            return this._provider.metaDataService.getBusinessObjectMetaDataSyncByBusinessObjectName(businessObjectName);
        },

        setBusinessObjectMetaDataSync: function(datasource, data) {
            return this._provider.metaDataService.setBusinessObjectMetaDataSync(datasource, data);
        }
    };



    /**
     * class sina error
     */
    module.SinaError = function() {
        this.init.apply(this, arguments);
    };

    module.SinaError.SEVERITY_ERROR = 3;
    module.SinaError.SEVERITY_WARNING = 2;
    module.SinaError.SEVERITY_INFO = 1;
    module.SinaError.prototype = {

        /**
         * A sina error that is contained in a perspective.
         * @ignore
         * @constructs sap.bc.ina.api.sina.base.SinaError
         * @param {Object} properties the configuration object
         */
        init: function(properties) {
            this.message = properties.message || '';
            this.errorCode = properties.errorCode || null;
            this.severity = properties.severity || module.SinaError.SEVERITY_ERROR;
        },

        getErrorCode: function() {
            return this.errorCode;
        },

        getMessage: function() {
            return this.message;
        },

        getSeverity: function() {
            return this.severity;
        },

        setSeverity: function(severity) {
            this.severity = severity;
        },

        toString: function() {
            var msg = "";
            switch (this.severity) {
                case module.SinaError.SEVERITY_ERROR:
                    msg += "SINA ERROR: ";
                    break;
                case module.SinaError.SEVERITY_WARNING:
                    msg += "SINA WARNING: ";
                    break;
                case module.SinaError.SEVERITY_INFO:
                    msg += "SINA INFO: ";
                    break;
                    // no default
            }
            msg += this.message;
            return msg;
        }

    };
}(window));
/* source file: querybase.js */
(function(global) {
    "use strict";

    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;

    var emptyFunction = function() {};

    module.Query = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class query
     */
    module.Query.prototype = {

        /**
         * The base query for chart, search, and suggestions queries.
         * Use the associated factory methods instead of this class.
         * @constructs sap.bc.ina.api.sina.base.Query
         * @private
         * @param {Object} properties the properties object
         */
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina;
            this.system = properties.system;
            this.onSuccess = properties.onSuccess;
            this.onError = properties.onError;
            this._responseJson = null;
            this.setTop(properties.top || 10);
            this.setSkip(properties.skip || 0);
            // this.resultSet = properties.resultSet || null;
            this.resultSetProperties = properties;
            this.filter = this.filter || properties.filter || this.sina.createFilter({
                dataSource: properties.dataSource
            });
            this.datasource = this.datasource || properties.dataSource;
            if (properties.filterConditions && properties.filterConditions.length > 0) {
                for (var i = 0, len = properties.filterConditions.length; i < len; i++) {
                    var item = properties.filterConditions[i];
                    if (item && item instanceof Array && item.length > 0) {
                        this.addFilterCondition(item[0], item[1], item[2]);
                    } else if (item && typeof item === 'string') {
                        this.addFilterCondition(properties.filterConditions[0], properties.filterConditions[1], properties.filterConditions[2]);
                        break;
                    }
                }
            }
            this.setSearchTerms(properties.searchTerms || '');
        },



        /**
         * Returns or sets a new data source for this query. If no
         * parameters are given, the current data source is returned.
         * Otherwise, the data source is set.
         * @instance
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @param {sap.bc.ina.api.sina.base.filter.DataSource|Object} newDataSource The current data source of this query.
         * This can be an instance of {@link sap.bc.ina.api.sina.base.filter.DataSource} or it can be a plain object, like
         * { "schemaName"  : "SYSTEM",
         *   "objectName"  : "J_EPM_PRODUCT" };
         * that the system uses to create an instance of {@link sap.bc.ina.api.sina.base.filter.DataSource}.
         * @return {sap.bc.ina.api.sina.base.filter.DataSource|sap.bc.ina.api.sina.base.Query} The current
         * data source of this query if no parameter is supplied, {@link sap.bc.ina.api.sina.base.Query} otherwise to allow method chaining.
         */
        dataSource: function(newDataSource) {
            if (newDataSource) {
                this.setDataSource(newDataSource);
                return this;
            } else {
                return this.getDataSource();
            }
        },

        /**
         * Gets the data source object for this query.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {sap.bc.ina.api.sina.base.filter.DataSource} The data source for this query.
         */
        getDataSource: function() {
            return this.filter.getDataSource();
        },

        /**
         * Sets the data source for this query object. Results already retrieved by this query are deleted.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {sap.bc.ina.api.sina.base.filter.DataSource|Object} dataSource The current data source of this query.
         *                                                                       This can be an instance of {@link sap.bc.ina.api.sina.base.filter.DataSource} or it can be a plain object, like
         *                                                                       { "schemaName"  : "SYSTEM",
         *                                                                       "objectName"  : "J_EPM_PRODUCT" };
         *                                                                       that the system uses to create an instance of {@link sap.bc.ina.api.sina.base.filter.DataSource}
         * @returns {Object}                                            this object for method chaining
         */
        setDataSource: function(dataSource) {
            if (dataSource === undefined) {
                return this;
            }
            if (this.filter.getDataSource() === undefined) {
                this.filter.setDataSource(dataSource);
                this._resetResultSet();
                return this;
            }
            if (!this.filter.getDataSource().equals(dataSource)) {
                this.filter.setDataSource(dataSource);
                this._resetResultSet();
            }
            return this;
        },

        setFacetOptions: function(options) {
            this._resetResultSet();
            this.facetOptions = options;
        },

        getFacetOptions: function() {
            return this.facetOptions;
        },

        /**
         * Returns the filter instance for this query.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {sap.bc.ina.api.sina.base.filter.Filter} The filter instance for this query object.
         */
        getFilter: function() {
            return this.filter;
        },

        /**
         * Sets the new filter instance for this query. Results already retrieved by this query are deleted.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {sap.bc.ina.api.sina.base.filter.Filter} filterInstance The filter instance to be used by this query.
         * @returns {Object}                               this object for method chaining
         */
        setFilter: function(filterInstance) {
            if (!this.filter.equals(filterInstance)) {
                this._resetResultSet();
            }
            this.filter = filterInstance;
            return this;
        },

        /**
         * Sets the search terms for this query. Results already retrieved by this query are deleted.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {String} terms The search terms to searched for by this query.
         * @returns {Object} this object for method chaining
         */
        setSearchTerms: function(terms) {
            if (this.filter.getSearchTerms() !== terms) {
                this.filter.setSearchTerms(terms);
                this._resetResultSet();
            }
            return this;
        },

        /**
         * Returns the search terms currently set.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {String} The search terms.
         */
        getSearchTerms: function() {
            return this.filter.getSearchTerms();
        },

        /**
         * Returns or sets a new skip value for this query. If no
         * parameter is given, the current skip value is returned.
         * Otherwise, the skip value is set.
         * @instance
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @param  {int} newSkip The new skip value for this query.
         * @return {int|sap.bc.ina.api.sina.base.Query} The current skip value of this query if no parameter
         * was supplied, {@link sap.bc.ina.api.sina.base.Query} otherwise to allow method chaining.
         */
        skip: function(newSkip) {
            if (newSkip !== undefined) {
                this.setSkip(newSkip);
            } else {
                return this._skip;
            }
            return this;
        },

        /**
         * Returns the skip value of this query.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {int} The current skip value of this query.
         */
        getSkip: function() {

            //underscore is needed because of the skip function in Query
            return this._skip;
        },

        /**
         * Sets the skip value for this query.
         * To use the new skip value, call getResultSet again.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {int}    skip The skip value for this query.
         * @returns {Object} this object for method chaining
         */
        setSkip: function(skip) {
            if (this._skip !== skip) {
                this._resetResultSet();
            }
            this._skip = skip;
            return this;
        },

        /**
         * Returns or sets a new top value for this query. If no
         * parameter is given, the current top value is returned.
         * Otherwise, the top value is set.
         * @instance
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @param  {int} newTop The new top value for this query.
         * @return {int|sap.bc.ina.api.sina.base.Query} The current top value of this query if no parameter
         * was supplied, {@link sap.bc.ina.api.sina.base.Query} otherwise to allow method chaining.
         */
        top: function(newTop) {
            if (newTop !== undefined) {
                this.setTop(newTop);
            } else {
                return this._top;
            }
            return this;
        },

        /**
         * Returns the top value of this query.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {int} The current top value of this query.
         */
        getTop: function() {
            //underscore is needed because of the top function in Query
            return this._top;
        },

        /**
         * Sets the top value for this query.
         * To use the new top value, call getResultSet of this query again.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {int}    top The new top value of this query.
         * @returns {Object} this object for method chaining
         */
        setTop: function(top) {
            if (isNaN(top)) {
                return false;
            }
            this._top = parseInt(this._top, 10);
            if (this._top !== top) {
                this._top = top;
                this._resetResultSet();
            }
            return this;
        },

        /**
         * Adds a filter condition for this query.
         * In the standard setting, the filter uses the AND operator for filter conditions on different
         * attributes and the OR operator for filter conditions on the same attribute.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {String} attributeOrFilterCondition The attribute that the filter condition is applied to.
         * @param {String} operator  The operator used to filter the value.
         * @param {String} value     The value of the attribute to be filtered in conjunction with the operator.
         * @return {sap.bc.ina.api.sina.base.Query} this
         * @example
         *  var query = sap.bc.ina.api.sina.createChartQuery();
         *  query.addFilterCondition("CATEGORY", "=", "Notebooks")
         *  .addFilterCondition("PRICE","<","1000")
         *  .addFilterCondition("CURRENCY_CODE", "=", "EUR");
         */
        addFilterCondition: function(attributeOrFilterCondition, operator, value) {
            if (typeof attributeOrFilterCondition === "string") {
                attributeOrFilterCondition = this.sina.createFilterCondition(attributeOrFilterCondition, operator, value);
            }
            if (this.filter.hasFilterCondition(attributeOrFilterCondition, operator, value) === false) {
                this.filter.addFilterCondition(attributeOrFilterCondition, operator, value);
                this._resetResultSet();
            }
            return this;
        },

        /**
         * Removes a previously added filter condition.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param {String} attribute The attribute that the filter condition was applied to.
         * @param {String} operator  The operator that was used to filter the value.
         * @param {String} value     The value of the attribute that was filtered in conjunction with the operator.
         * @return {sap.bc.ina.api.sina.base.Query} this
         * @example
         *  query.removeFilterCondition("CATEGORY", "=", "Notebooks")
         *  .removeFilterCondition("PRICE","<","1000")
         *  .removeFilterCondition("CURRENCY_CODE", "=", "EUR");
         */
        removeFilterCondition: function(attribute, operator, value) {
            this.filter.removeFilterCondition(attribute, operator, value);
            this._resetResultSet();
            return this;
        },

        resetFilterConditions: function() {
            this.filter.resetFilterConditions();
            this._resetResultSet();
            return this;
        },

        /**
         * Returns the result set of the query synchronously. This function blocks the JS
         * thread until the server call is made. Use {@link sap.bc.ina.api.sina.base.Query#getResultSet} for an asynchronous version
         * of this function that does not block the thread.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @return {Object} The result set of this query. Call getElements() on this object to
         * get the result set elements.
         */
        getResultSetSync: function() {
            this.resultSet = this.executeSync();
            return this.resultSet;
        },

        /**
         * Returns the result set of the query asynchronously.
         * @memberOf sap.bc.ina.api.sina.base.Query
         * @instance
         * @param  {function} onSuccess This function is called once  the result has been
         * retrieved from the server. The first parameter of this function is the result set.
         * The result set has the function getElements() . This contains  all result set elements.
         * @param  {function} onError This function is called if the result set of the query could
         * not be retrieved from the server. The first argument is an error object.
         * @return {Object} returns a jQuery Promise Object, see {@link http://api.jquery.com/Types/#Promise}
         * for more informations.
         */
        getResultSet: function(onSuccess, onError) {
            var that = this;
            onSuccess = onSuccess || this.onSuccess || emptyFunction;
            onError = onError || this.onError || emptyFunction;

            var resultSetDeferred = this.execute();
            resultSetDeferred.done(function(resultSet) {
                that.resultSet = resultSet;
                onSuccess(resultSet);
            });
            resultSetDeferred.fail(function(err) {
                onError(err);
            });
            return resultSetDeferred.promise();
        },

        /**
         * methods to be implemented by data providers
         */
        _resetResultSet: function() {

        },

        resetResultSet: function() {
            this._resetResultSet();
        },

        execute: function() {

        },

        executeSync: function() {

        }


    };

}(window));

/* source file: chartbase.js */
(function(global) {
    "use strict";

    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;



    /**
     * class chart query
     */
    module.ChartQuery = function() {
        this.init.apply(this, arguments);
    };

    module.ChartQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * A query that yields results suitable for simple chart controls, like
         * pie or bar charts.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createChartQuery} instead
         * of this private constructor.
         * @since SAP HANA SPS 08
         * @constructs sap.bc.ina.api.sina.base.ChartQuery
         * @augments {sap.bc.ina.api.sina.base.Query}
         * @private
         */
        init: function() {
            module.Query.prototype.init.apply(this, arguments);

        }

    });


}(window));
/* source file: facetbase.js */
(function(global) {
    "use strict";

    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;

    // TODO: make better
    module.FacetType = module.Sina.prototype.FacetType;
    module.SuggestionType = module.Sina.prototype.SuggestionType;
    module.ChartQueryType = module.Sina.prototype.ChartQueryType;

    /**
     * class facet
     */

    module.Facet = function() {
        this.init.apply(this, arguments);
    };

    module.Facet.prototype = {

        /**
         * A facet that is contained in a perspective.
         * @ignore
         * @constructs sap.bc.ina.api.sina.base.Facet
         * @param {Object} properties the properties object
         */
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina;
            this.dataSource = properties.dataSource || null;
            this.title = properties.title || '';
            this.query = properties.query || null;
            this.dimension = properties.dimension || null;
            properties.facetType = properties.facetType || '';
            this.facetType = properties.facetType.toLowerCase();
            if (properties.query) {
                this.setQuery(properties.query);
            }
        },

        getChartType: function() {},

        getTitle: function() {
            return this.title;
        },

        getDimension: function() {
            return this.dimension;
        },

        getQuery: function() {
            return this.query;
        },

        getLayout: function() {},

        getLayoutBinding: function() {},

        getColorPalette: function() {},

        setQuery: function(query) {
            this.query = query;
        }

    };

}(window));
/* global window, jQuery */
/* source file: perspectivebase.js */
(function(global) {
    "use strict";
    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;
    var filterModule = global.sap.bc.ina.api.sina.base.filter;
    var baseModule = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // perspective
    // =======================================================================

    module.Perspective = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective
     */
    module.Perspective.prototype = {

        /**
         *  A perspective.
         *  @constructs sap.bc.ina.api.sina.impl.inav2.Perspective
         *  @ignore
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            var that = this;
            that.sina = properties.sina;
            that.chartFacets = [];
            that.searchFacet = null;
            that.layout = null;
            that.dataSource = properties.dataSource || null;
            properties = properties || {};
        },

        getSearchResultSet: function() {
            return this.searchFacet.getQuery().getResultSetSync();
        },

        getChartFacets: function() {
            return this.chartFacets;
        },

        getSearchFacet: function() {
            return this.searchFacet;
        },

        getLayout: function() {
            return this.layout;
        }

    };


    // =======================================================================
    // perspective query
    // =======================================================================

    /**
     * class perspective query
     */
    module.PerspectiveQuery = function() {
        this.init.apply(this, arguments);
    };

    module.PerspectiveQuery.prototype = jQuery.extend({}, module.Query.prototype, {
        /**
         * A SINA perspective query
         * Use {@link sap.bc.ina.api.sina.base.Sina#createPerspectiveQuery} instead
         * of this private constructor.
         * @since SAP HANA SPS 08
         * @constructs sap.bc.ina.api.sina.base.PerspectiveQuery
         * @augments {sap.bc.ina.api.sina.base.Query}
         * @param  {Object} properties configuration object.
         * @private
         */
        init: function() {
            module.Query.prototype.init.apply(this, arguments);
            this.facets = [];
            this.requestedEntities = ['SearchResults', 'Facets', 'TotalCount'];
            this.facetLoader = new module.FacetLoader({
                sina: this.sina
            });
            this.includeFacetsWithFilters = false;
        },

        addFacet: function(facet) {
            this.facets.push(facet);
            return this;
        },

        getFacets: function() {
            return this.facets;
        },

        /**
         * Sets how the result will be ordered.
         * @memberOf sap.bc.ina.api.sina.base.PerspectiveQuery
         * @instance
         * @param {Object|Array} orderBy If orderBy is an object, it must have the
         *                               properties 'orderBy' (string) and 'sortOrder' (string).
         *                               The orderBy property can either be the name of a database attribute that
         *                               the result will be sorted alphabetically for, or it can be the special
         *                               '$$score$$' string. The result will then be ordered according to the SAP HANA
         *                               Score function.
         *                               This function can also receive an array of these objects for multiple
         *                               order-by values, for example to order by $$score$$ and then alphabetically
         *                               for an attribute. The result will then be ordered after the first entry.
         *                               If two results have the same rank however, they will be ordered after the
         *                               second order-by value, and so on.
         *                               @default {orderBy:'$$score$$', sortOrder:'DESC'}
         *                               See {@link sap.bc.ina.api.sina.base.Sina#createSearchQuery} for examples.
         * @returns {Object}       this object for method chaining
         */
        setOrderBy: function(orderBy) {
            this._resetResultSet();
            this.orderBy = orderBy || {
                orderBy: '$$score$$',
                sortOrder: 'DESC'
            };
            return this;
        },

        getOrderBy: function() {
            return this.orderBy;
        },

        setRequestedEntities: function(requestedEntities) {
            if (JSON.stringify(requestedEntities) === JSON.stringify(this.requestedEntities)) {
                return;
            }
            this.requestedEntities = requestedEntities;
            this._resetResultSet();
        },

        getRequestedEntities: function() {
            return this.requestedEntities;
        },

        setIncludeFacetsWithFilters: function(includeFacetsWithFilters) {
            if (includeFacetsWithFilters === this.includeFacetsWithFilters) {
                return;
            }
            this.includeFacetsWithFilters = includeFacetsWithFilters;
            this._resetResultSet();
        },

        _resetResultSet: function() {
            this.resultSetAndFacetsPromise = null;
        },

        getResultSet: function(onSuccess, onError) {

            var that = this;

            // no facets for attributes with filter set requested -> old logic -> call base class
            if (!this.includeFacetsWithFilters) {
                return module.Query.prototype.getResultSet.apply(this, arguments);
            }

            // check cache
            if (that.resultSetAndFacetsPromise) {
                if (onSuccess) {
                    that.resultSetAndFacetsPromise.done(onSuccess);
                }
                if (onError) {
                    that.resultSetAndFacetsPromise.fail(onError);
                }
                return that.resultSetAndFacetsPromise;
            }

            // get promises for main perspective request and for facet request
            var perspectivePromise = module.Query.prototype.getResultSet.apply(this, []);
            var facetsPromise = this.facetLoader.loadFacets(this.filter);

            // wait for perspectice and for facets
            that.resultSetAndFacetsPromise = jQuery.when(perspectivePromise, facetsPromise).then(function(perspective, facets) {
                that.addFacetsToPerspective(perspective, facets);
                return perspective;
            });

            // return result promise
            if (onSuccess) {
                that.resultSetAndFacetsPromise.done(onSuccess);
            }
            if (onError) {
                that.resultSetAndFacetsPromise.fail(onError);
            }
            return that.resultSetAndFacetsPromise;

        },

        addFacetsToPerspective: function(perspective, facets) {

            // add facets to perspective
            for (var i = 0; i < facets.length; ++i) {
                var facet = facets[i];

                // check whether perspective includes facet
                var exists = false;
                var j;
                for (j = 0; j < perspective.chartFacets.length; ++j) {
                    var perspectiveFacet = perspective.chartFacets[j];
                    if (perspectiveFacet.getDimension() === facet.getDimension()) {
                        exists = true;
                        break;
                    }
                }

                // decide what to do
                if (exists) {
                    // replace facet in perspective
                    facet.title = perspective.chartFacets[j].title;
                    perspective.chartFacets.splice(j, 1, facet);
                } else {
                    // add facet to perspective
                    perspective.chartFacets.push(facet);
                }

            }

        }

    });

    // =======================================================================
    // facet loader
    // =======================================================================

    module.FacetLoader = function() {
        this.init.apply(this, arguments);
    };

    module.FacetLoader.prototype = {

        init: function(properties) {
            this.sina = properties.sina;
        },

        loadFacets: function(filter) {

            var that = this;

            // determine all attribute for which a filter is set
            var attributes = this.collectAttributes(filter);

            // filter bogus ina attributes
            attributes = jQuery.grep(attributes, function(attribute) {
                if (attribute.slice(0, 2) === '$$') {
                    return false;
                }
                return true;
            });

            // create chart query for all attributes
            var chartQueries = [];
            for (var i = 0; i < attributes.length; ++i) {
                var attribute = attributes[i];
                chartQueries.push(this.createChartQuery(attribute, filter));
            }

            // fire chart queries
            var chartQueryPromises = jQuery.map(chartQueries, function(chartQuery) {
                return chartQuery.getResultSet();
            });

            // wait for return of all chart qeries
            return jQuery.when.apply(jQuery, chartQueryPromises).then(function() {
                var facets = [];
                for (var i = 0; i < arguments.length; ++i) {
                    facets.push(that.sina.createFacet({
                        dimension: attributes[i],
                        query: chartQueries[i],
                        facetType: baseModule.FacetType.ATTRIBUTE,
                        sina: that.sina,
                        title: chartQueries[i].getTitle()
                    }));
                }
                return facets;
            });

        },

        collectAttributes: function(filter) {
            var conditions = filter.getFilterConditions();
            var attributeMap = {};
            this.doCollectAttributes(conditions, attributeMap);
            return jQuery.map(attributeMap, function(dummy, attribute) {
                return attribute;
            });
        },

        doCollectAttributes: function(condition, attributeMap) {
            if (!(condition instanceof filterModule.ConditionGroup)) {
                // simple condition
                attributeMap[condition.attribute] = true;
            } else {
                // condition group
                var conditions = condition.getConditions();
                for (var i = 0; i < conditions.length; ++i) {
                    condition = conditions[i];
                    this.doCollectAttributes(condition, attributeMap);
                }
            }
        },

        createChartQuery: function(attribute, filter) {
            filter = filter.clone();
            this.removeFilterConditionsByAttribute(filter, attribute);
            var chartQuery = this.sina.createChartQuery();
            chartQuery.setFilter(filter);
            chartQuery.addDimension(attribute);
            chartQuery.setAttributeLimit(5);
            return chartQuery;
        },

        removeFilterConditionsByAttribute: function(filter, attribute) {
            var conditions = filter.getFilterConditions();
            if (!(conditions instanceof filterModule.ConditionGroup)) {
                if (conditions.attribute === attribute) {
                    filter.resetFilterConditions();
                    return;
                } else {
                    return;
                }
            }
            this.doRemoveFilterConditionsByAttribute(attribute, conditions);
        },

        doRemoveFilterConditionsByAttribute: function(attribute, conditionGroup) {
            var conditions = conditionGroup.getConditions();
            for (var i = 0; i < conditions.length; ++i) {
                var condition = conditions[i];
                if (!(condition instanceof filterModule.ConditionGroup)) {
                    if (condition.attribute === attribute) {
                        conditions.splice(i, 1);
                        i--;
                    }
                } else {
                    this.doRemoveFilterConditionsByAttribute(attribute, condition);
                }
            }
        }

    };

}(window));
/* source file: searchbase.js */
(function(global) {
    "use strict";

    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;



    /**
     * class search query
     */
    module.SearchQuery = function() {
        this.init.apply(this, arguments);
    };


    module.SearchQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * A query that yields results suitable for a simple result list.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createSearchQuery} instead
         * of this private constructor.
         * @constructs sap.bc.ina.api.sina.base.SearchQuery
         * @augments {sap.bc.ina.api.sina.base.Query}
         * @param  {Object} properties configuration object.
         * @private
         */
        init: function() {
            module.Query.prototype.init.apply(this, arguments);
        }
    });

}(window));
/* source file: suggestionbase.js */
(function(global) {
    "use strict";

    /**
     * shortcut for base module
     */
    var module = global.sap.bc.ina.api.sina.base;


    /**
     * class suggestion query
     */
    module.SuggestionQuery = function() {
        this.init.apply(this, arguments);
    };

    module.SuggestionQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * A SINA suggestion query.
         * Only supported in INA V2 provider.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createSuggestionQuery} instead
         * of this private constructor.
         * @constructs sap.bc.ina.api.sina.base.SuggestionQuery
         * @augments {sap.bc.ina.api.sina.base.Query}
         * @param  {Object} properties configuration object.
         * @since SAP HANA SPS 08
         * @private
         */
        init: function() {
            module.Query.prototype.init.apply(this, arguments);
            this.suggestionTypes = [this.sina.SuggestionType.OBJECTDATA, this.sina.SuggestionType.HISTORY, this.sina.SuggestionType.DATASOURCE];
        },

        resetResultSet: function() {
            this._resetResultSet();
            return this;
        },

        setSuggestionTypes: function(suggestionTypes) {
            this.suggestionTypes = suggestionTypes;
            this._resetResultSet();
        }

    });


}(window));
/* source file: system.js */
/*
 * @file Simple info access (SINA) API: System representation
 * @namespace sap.bc.ina.api.sina.base.system
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint new-cap:0 */
    "use strict";

    /**
     * import packages
     */
    var proxy = global.sap.bc.ina.api.sina.proxy;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.base.system');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.base.system;

    module.System = function() {
        this.init.apply(this, arguments);
    };
    module.Service = function() {
        this.init.apply(this, arguments);
    };
    module.Capability = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class capabilities
     */
    module.Capability.prototype = {
        /**
         * Describes a capability offered by a service.
         * @constructs sap.bc.ina.api.sina.base.system.Capability
         * @param {Object} properties Configures the capability instance with this
         * object.
         */
        init: function(properties) {
            this.properties = properties || {};
            this.name = this.properties.Capability || '';
            this.minVersion = this.properties.MinVersion || 0;
            this.maxVersion = this.properties.MaxVersion || 0;
        }

    };

    /**
     * class service
     */
    module.Service.prototype = {

        /**
         * Describes the services offered by a system.
         * @constructs sap.bc.ina.api.sina.base.system.Service
         *
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            this.properties = properties || {};
            this.name = this.properties.Service;
            this.minVersion = this.properties.MinVersion || 0;
            this.maxVersion = this.properties.MaxVersion || 0;
            this.capabilities = {};
            for (var i = 0; i < this.properties.Capabilities.length; i++) {
                this.capabilities[this.properties.Capabilities[i].Capability] = new module.Capability(this.properties.Capabilities[i]);
            }

        },

        getCapability: function(name) {
            return this.capabilities[name];
        },

        getCapabilities: function() {
            return this.capabilities;
        }

    };

    /**
     * class system
     */
    module.System.prototype = {

        /**
         * A system representation that offers services to SINA.
         * @constructs sap.bc.ina.api.sina.base.system.System
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            this.properties = properties || {};
            this.services = {};
            this.proxy = properties.proxy || new proxy.Proxy();
        },

        getService: function(name) {
            return this.services[name];
        },

        getServices: function() {
            return this.services;
        },

        getSystemType: function() {
            return this.systemType;
        },

        _deleteServerInfo: function() {
            this.jqXHR = jQuery.Deferred();
        },

        _getServerInfo: function(isAsync) {
            var that = this;

            if (this.jqXHR && isAsync) {
                return this.jqXHR.promise();
            }

            if (this.jqXHR && isAsync === false) {
                if (this.jqXHR.state() === "resolved") {
                    return this.properties;
                }
                if (this.jqXHR.state() === "pending") {
                    //forget the async call and send a sync call
                    this.deprecatedJqXHR = this.jqXHR;
                }
            }

            this.jqXHR = jQuery.Deferred();
            var request = {
                async: isAsync,
                type: 'GET',
                url: this.infoUrl,
                getServerInfo: true,
                processData: false,
                contentType: 'application/json',
                dataType: 'json'
            };
            this.proxy.ajax(request)
                .done(function(data) {
                    that.setServerInfo(data);
                    that.jqXHR.resolve(that.properties);
                    if (that.deprecatedJqXHR) {
                        //notify listeners whose async jqXHR was aborted due to
                        //a subsequent synchronous call
                        that.deprecatedJqXHR.resolve(that.properties);
                    }
                })
                .fail(function(err) {
                    that.jqXHR.reject(err);
                    if (that.deprecatedJqXHR) {
                        that.deprecatedJqXHR.reject(err);
                    }
                });
            if (isAsync === true) {
                return this.jqXHR.promise();
            }
            return this.properties;
        },

        getServerInfo: function() {
            return this._getServerInfo(true);
        },

        getServerInfoSync: function() {
            return this._getServerInfo(false);
        },

        setServerInfo: function(json) {
            this.properties.rawServerInfo = json;
        }

    };
}(window));
/* source file: proxy.js */
/*
 * @file Proxy which offers some extras for ajax calls.
 * @namespace sap.bc.ina.api.sina.proxy
 * @copyright Copyright (c) 2014 SAP SE. All rights reserved.
 * @ignore
 */
(function(global) {
    /*eslint new-cap:0 */
    "use strict";

    /**
     * create packages
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.proxy');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.proxy;

    module.Proxy = function() {
        this.init.apply(this, arguments);
    };

    /**
     * Receives service calls from data boxes and forwards them to server side, either
     * as single GET requests or as POST with GETs as payload.
     */
    module.inaReqResBuffer = {};

    module.Proxy.prototype = {

        init: function(properties) {
            this.properties = properties || {};
            this.xsrfToken = '';
            this.xsrfService = this.properties.xsrfService;
            this.xsrfRetries = 0;
            this.xsrfRequest = {
                'headers': {
                    'X-CSRF-Token': 'Fetch'
                },
                'cache': false,
                'url': this.xsrfService
            };
            this.properties.cachelifetime = this.properties.cachelifetime || 0;
            // log.debug('sina: cachelifetime is '+this.properties.cachelifetime);
            this.properties.httpMethod = this.properties.httpMethod || 'post';
            // log.debug('sina: httpMethod is '+this.properties.httpMethod);
            // adjust cachelifetime in config.js, not here!

            if (this.properties.cachelifetime > 0) {
                global.window.setInterval(function() {
                    // log.debug("Deleting request buffer");
                    module.inaReqResBuffer = {};
                }, this.properties.cachelifetime);
            }

            this.properties.recordFile = this.properties.recordFile;
            this.properties.demoMode = this.properties.demoMode ||  "";
            // this.recordings = {};
            this._checkRecordingURLValues();
        },

        _checkRecordingURLValues: function() {
            function getURLParameter(name) {
                return decodeURI((new RegExp(name + '=' + '(.+?)(&|$|#)').exec(global.window.location.search) || [null])[1]);
            }

            function hasURLProperty(name) {
                if (global.window.location.search.toLowerCase().indexOf('&' + name.toLowerCase()) !== -1) {
                    return true;
                }

                if (global.window.location.search.toLowerCase().indexOf('?' + name.toLowerCase()) !== -1) {
                    return true;
                }

                return false;
            }

            if (hasURLProperty('record')) {
                this.properties.recordFile = getURLParameter('record');
            }

            if (hasURLProperty('demoMode')) {
                this.properties.demoMode = getURLParameter('demoMode');
            }
        },

        _requestHashValue: function(url, data) {
            if (data) {
                var paramChar = url.indexOf("?") === -1 ? "?" : "&";
                url = url + paramChar + 'Request=';
                if (typeof data === "string") {
                    url += data;
                } else {
                    url += JSON.stringify(data);
                }
            }
            return url;
        },

        _handleRequestFromCache: function(request) {
            var inaRequestString = JSON.stringify(request.data);
            var inaResponseString = module.inaReqResBuffer[inaRequestString];

            if (inaResponseString) {
                // use response from cache
                var jqXHRClone = jQuery.Deferred();
                jqXHRClone.resolve(inaResponseString);
                return jqXHRClone.promise();
            }

            return {};
        },

        _handleRequestFromRecords: function(request, recordFile) {
            var that = this;

            function _getRequestFromRecordings(recordings, requestUrl, requestData) {
                var record = recordings[that._requestHashValue(requestUrl, requestData)];
                if (record) {
                    return record;
                } else {
                    return new jQuery.Deferred().reject("Could not find request hash " +
                        that._requestHashValue(requestUrl, requestData) +
                        " in record file " + recordFile);
                }
            }

            if (request.async === false) {
                if (!this.recordings) {
                    this.recordings = this._loadRecordings(recordFile).responseText;
                    this.recordings = JSON.parse(this.recordings);
                }
                var recordingsObj = {};
                if (jQuery.isArray(this.recordings)) {
                    // old records file => convert it to new file format
                    for (var i = 0; i < this.recordings.length; i++) {
                        recordingsObj[that._requestHashValue(this.recordings[i].requestUrl, this.recordings[i].requestData)] = this.recordings[i].responseData;
                    }
                    this.recordings = recordingsObj;
                }
                return {
                    // mimic jQuerys jqXHR object
                    responseText: JSON.stringify(_getRequestFromRecordings(this.recordings, request.url, request.data))
                };
            }

            return this._loadRecordingsAsync(request.async, recordFile).then(function(recordings) {
                return _getRequestFromRecordings(recordings, request.url, request.data);
            });

        },

        _loadRecordings: function(recordFile) {
            return jQuery.ajax({
                async: false,
                dataType: 'json',
                url: recordFile
            });
        },

        _loadRecordingsAsync: function(async, recordFile) {
            var that = this;
            if (this.recordingsDefer) {
                return this.recordingsDefer;
            }
            this.recordingsDefer = jQuery.Deferred();
            var jqXHR = jQuery.ajax({
                dataType: 'json',
                url: recordFile
            });
            jqXHR.done(function(recordings) {
                var recordingsObj = {};
                if (jQuery.isArray(recordings)) {
                    // old records file => convert it to new file format
                    for (var i = 0; i < recordings.length; i++) {
                        recordingsObj[that._requestHashValue(recordings[i].requestUrl, recordings[i].requestData)] = recordings[i].responseData;
                    }
                    recordings = recordingsObj;
                }
                that.recordingsDefer.resolve(recordings);
            });
            jqXHR.fail(function(error) {
                // recordfile does not exist, start with an empty object for records
                that.recordingsDefer.resolve({});
            });
            return this.recordingsDefer;
        },

        _saveRecordingsAsync: function(recordings) {
            var that = this;
            return jQuery.ajax({
                type: 'PUT',
                url: that.properties.recordFile,
                data: JSON.stringify(recordings)
            });
        },

        setXSRFService: function(url) {
            this.xsrfService = url;
            this.xsrfRequest.url = url;
        },

        _getXSRFToken: function() {
            var that = this;
            if (!this.xsrfDeferred) {
                this.xsrfRetries++;
                this.xsrfDeferred = jQuery.ajax(this.xsrfRequest);
                this.xsrfDeferred.done(function(data) {
                    that.xsrfToken = that.xsrfDeferred.getResponseHeader('X-CSRF-Token') || that.xsrfToken || '';
                    if (that.xsrfToken) {
                        that.xsrfRetries = 0;
                    }
                });
            }

            return this.xsrfDeferred.promise();
        },

        _requestWithXSRFToken: function(request) {
            var that = this;
            if (request.async === false) {
                // reset sent xsrf request and make the next one blocking
                if (this.xsrfDeferred && this.xsrfDeferred.state() === 'pending') {
                    this.xsrfDeferred.abort();
                }
                this.xsrfRequest.async = false;
                this.xsrfDeferred = jQuery.ajax(this.xsrfRequest);
                if (request.url === this.xsrfService) {
                    return this.xsrfDeferred();
                }
                this.xsrfToken = this.xsrfDeferred.getResponseHeader('X-CSRF-Token') || this.xsrfToken || '';
                request.headers = {
                    'X-CSRF-Token': this.xsrfToken
                };
                return jQuery.ajax(request);
            } else {
                if (request.url === this.xsrfService) {
                    return this._getXSRFToken();
                }
                var deferred = jQuery.Deferred();
                this._getXSRFToken()
                    .done(function(data) {
                        request.headers = {
                            'X-CSRF-Token': that.xsrfToken
                        };
                        jQuery.ajax(request)
                            .done(function(data) {
                                deferred.resolve(data);
                            })
                            .fail(function(error, textStatus, errorThrown) {
                                if (error.status === 400) {
                                    if (error.responseJSON &&
                                        error.responseJSON.Error &&
                                        error.responseJSON.Error.Code &&
                                        error.responseJSON.Error.Code === 403) {
                                        if (that.xsrfRetries < 5) {
                                            // try again if xsrf token has become invalid
                                            that.xsrfDeferred = null;
                                            that._requestWithXSRFToken(request)
                                                .done(function(data) {
                                                    deferred.resolve(data);
                                                })
                                                .fail(function(error) {
                                                    deferred.reject(error);
                                                });
                                        }
                                    } else {
                                        deferred.reject(error);
                                    }
                                } else {
                                    if ((error.status >= 200 && error.status <= 299) && (textStatus || errorThrown)) {
                                        error.status = 500;
                                        error.statusText = textStatus;
                                        var sErrorMsg = textStatus + ': ';
                                        if (errorThrown && errorThrown.stack) {
                                            sErrorMsg = sErrorMsg + errorThrown.stack;
                                        }
                                        error.responseText = sErrorMsg;
                                    }
                                    deferred.reject(error);
                                }
                            });
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise();
            }
        },

        /**
         * send an ajax request to the server if the request wasn't cached already
         * @param  {Object} request an object compatible to the one jQuerys ajax
         * function expects, see {@link http://api.jquery.com/jQuery.ajax/}
         * @return {Object} returns jQuerys jqXHR Object.
         */
        ajax: function(request) {
            var that = this;
            var jqXHR;
            var inaRequestString = request.data === undefined ? undefined : JSON.stringify(request.data);

            if (this.properties.cachelifetime > 0) {
                return this._handleRequestFromCache(request);
            }

            if (this.properties.demoMode) {
                jqXHR = this._handleRequestFromRecords(request, this.properties.demoMode);
            } else {
                request.processData = request.processData || false;
                request.type = request.type || this.properties.httpMethod || 'POST';
                if (inaRequestString) {
                    if (request.type.toLowerCase() === 'get') {
                        request.data = 'Request=' + inaRequestString;
                    } else {
                        request.data = inaRequestString;
                    }
                }
                jqXHR = this._requestWithXSRFToken(request);
            }
            if (jqXHR && jqXHR.done) {
                jqXHR.done(function(response) {
                    if (that.properties.cachelifetime > 0) {
                        that._cacheResponse(request, response);
                    }
                    if (that.properties.recordFile) {
                        that._recordResponseAsync(request, response, that.properties.recordFile);
                    }
                });
            }
            return jqXHR;
        },

        _cacheResponse: function(request, data) {
            var inaRequestString = JSON.stringify(request.data);
            module.inaReqResBuffer[inaRequestString] = data;
        },

        _recordResponseAsync: function(request, response, recordFile) {

            // make a copy of the response because application may alter response
            // and we should store the unmodified response in the recording
            response = jQuery.extend(true, {}, response);

            var that = this;

            this._loadRecordingsAsync(false, recordFile).then(function(recordings) {
                recordings[that._requestHashValue(request.url, request.data)] = response;
                return recordings;
            }).then(function(recordings) {
                if (recordFile === that.properties.demoMode) {
                    throw "Recording: source file must not be the same as target file";
                }
                that._saveRecordingsAsync(recordings);
            });

        }
    };
}(window));
/* source file: impl/inav2/jsontemplates.js */
/*
 * Simple info access (SINA) API: JSON Templates
 * Package: sap.bc.ina.api.sina.impl.inav2.jsontemplates
 * Copyright (c) 2014 SAP SE. All rights reserved.
 */

(function(global) {
    "use strict";

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.jsontemplates');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;


    module.getDataSourceMetaDataRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Metadata": {
                "Context": "Search",
                "Expand": ["Cube"]
            },
            "ServiceVersion": 204
        });
    };

    /* returns a list of all datasources and category*/
    module.getCatalogRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {
                "ObjectName": "$$DataSources$$",
                "PackageName": "ABAP"
            },
            "Options": ["SynchronousRun"],
            "Search": {
                "Top": 1000,
                "Skip": 0,
                "OrderBy": [{
                    "AttributeName": "Description",
                    "SortOrder": "ASC"
                }, {
                    "AttributeName": "ObjectName",
                    "SortOrder": "ASC"
                }],
                "Expand": ["Grid", "Items"],
                "Filter": {
                    "Selection": {
                        "Operator": {
                            "Code": "And",
                            "SubSelections": [{
                                "MemberOperand": {
                                    "AttributeName": "SupportedService",
                                    "Comparison": "=",
                                    "Value": "Search"
                                }
                            }]
                        }
                    }
                },
                "NamedValues": [{
                    "AttributeName": "ObjectName",
                    "Name": "ObjectName"
                }, {
                    "AttributeName": "Description",
                    "Name": "Description"
                }, {
                    "AttributeName": "Type",
                    "Name": "Type"
                }]
            },
            "SearchTerms": "*",
            "ServiceVersion": 204
        });
    };

    /* returns a list of all datasources as fallback*/
    module.getESHConnectorRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {
                "SchemaName": "",
                "PackageName": "ABAP",
                "ObjectName": "~ESH_CONNECTOR~",
                "Type": "Connector"
            },
            "Search": {
                "Top": 1000,
                "Skip": 0,
                "OrderBy": [{
                    "AttributeName": "DESCRIPTION",
                    "SortOrder": "ASC"
                }],
                "Expand": ["Grid", "Items", "TotalCount"],
                "Filter": {},
                "NamedValues": [{
                    "AttributeName": "$$ResultItemAttributes$$",
                    "Name": "$$ResultItemAttributes$$"
                }, {
                    "AttributeName": "$$RelatedActions$$",
                    "Name": "$$RelatedActions$$"
                }],
                "SearchTerms": "*",
                "SelectedValues": []
            }
        });
    };

    module.getSuggestionRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Suggestions": {
                "Expand": ["Grid", "Items"],
                "Precalculated": false,
                "SearchTerms": "",
                "AttributeNames": []
            },
            "ServiceVersion": 204
        });
    };

    module.getSuggestion2Request = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Suggestions2": {
                "Expand": ["Grid", "Items"],
                "Precalculated": false,
                "AttributeNames": []
            },
            "ServiceVersion": 204
        });
    };

    module.getPerspectiveRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Search": {
                "Expand": ["Grid", "Items", "ResultsetFacets", "TotalCount"],
                "Filter": {
                    "Selection": {
                        "Operator": {
                            "Code": "And",
                            "SubSelections": [{
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplatePlatform$$",
                                    "Comparison": "=",
                                    "Value": "html"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplateTechnology$$",
                                    "Comparison": "=",
                                    "Value": "Tempo"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplateType$$",
                                    "Comparison": "=",
                                    "Value": "ResultItem"
                                }
                            }]
                        }
                    }
                },
                "Top": 10,
                "Skip": 0,
                "SearchTerms": "S*",
                "NamedValues": [{
                    "Function": "WhyFound",
                    "Name": "$$WhyFound$$"
                }, {
                    "Function": "RelatedActions",
                    "Name": "$$RelatedActions$$"
                }]
            },
            "ServiceVersion": 204
        });
    };

    module.getPerspectiveSearchRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {
                "ObjectName": "$$Perspectives$$",
                "Type": "View"
            },
            "Options": [
                "SynchronousRun"
            ],
            "Search": {
                "Expand": [
                    "Grid",
                    "Items"
                ],
                "Filter": {
                    "Selection": {
                        "Operator": {
                            "Code": "Or",
                            "SubSelections": [{
                                "MemberOperand": {
                                    "AttributeName": "SCHEMA_VERSION_NUMBER",
                                    "Comparison": "=",
                                    "Value": "3"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "SCHEMA_VERSION_NUMBER",
                                    "Comparison": "=",
                                    "Value": "4"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "SCHEMA_VERSION_NUMBER",
                                    "Comparison": "=",
                                    "Value": "5"
                                }
                            }]
                        }
                    }
                },
                "SearchTerms": "*",
                "SelectedValues": [{
                    "AttributeName": "PACKAGE_ID",
                    "Name": "PACKAGE_ID"
                }, {
                    "AttributeName": "PERSPECTIVE_ID",
                    "Name": "PERSPECTIVE_ID"
                }, {
                    "AttributeName": "TITLE_TEXT",
                    "Name": "TITLE_TEXT"
                }, {
                    "AttributeName": "SUMMARY_TEXT",
                    "Name": "SUMMARY_TEXT"
                }],
                "Skip": 0,
                "Top": 30
            }
        });
    };


    module.getPerspectiveRequestFactsheet = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Search": {
                "Expand": ["Grid", "Items", "ResultsetFacets", "TotalCount"],
                "Filter": {
                    "Selection": {
                        "Operator": {
                            "Code": "And",
                            "SubSelections": [{
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplatePlatform$$",
                                    "Comparison": "=",
                                    "Value": "html"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplateTechnology$$",
                                    "Comparison": "=",
                                    "Value": "Tempo"
                                }
                            }, {
                                "MemberOperand": {
                                    "AttributeName": "$$RenderingTemplateType$$",
                                    "Comparison": "=",
                                    "Value": "ResultItem"
                                }
                            }]
                        }
                    }
                },
                "Top": 10,
                "Skip": 0,
                "SearchTerms": "S*",
                "NamedValues": [{
                    "Function": "WhyFound",
                    "Name": "$$WhyFound$$"
                }, {
                    "AttributeName": "$$RelatedActions$$"
                }, {
                    "AttributeName": "$$RelatedActions.Proxy$$"
                }]
            },
            "ServiceVersion": 204
        });
    };

    /**
     * template search request
     * @returns {Object} A dummy searchrequest for you to modify
     */
    module.getSearchRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "SearchTerms": "DUMMY",
            "Search": {
                "Expand": ["Grid", "Items", "TotalCount"],
                "Top": "DUMMY",
                "Skip": "DUMMY",
                "SelectedValues": "DUMMY",
                "NamedValues": [{
                    "AttributeName": "$$ResultItemAttributes$$",
                    "Name": "$$ResultItemAttributes$$"
                }, {
                    "AttributeName": "$$RelatedActions$$",
                    "Name": "$$RelatedActions$$"
                }]
            }
        });
    };

    /**
     * template chart request
     * @returns {Object} A dummy ABAP chart request for you to modify
     */
    module.getABAPChartRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "Search": {
                "Expand": ["Grid", "Items", "ResultsetFacets", "TotalCount"],
                "Filter": {},
                "Top": 10,
                "Skip": 0,
                "SearchTerms": "*",
                "NamedValues": [{
                    "Function": "WhyFound",
                    "Name": "$$WhyFound$$"
                }, {
                    "AttributeName": "$$RelatedActions$$"
                }, {
                    "AttributeName": "$$RelatedActions.Proxy$$"
                }],
                "OrderBy": []
            },
            "ServiceVersion": 204,
            "Facets": {
                "MaxNumberOfReturnValues": 1000,
                "Attributes": []
            }
        });
    };

    /**
     * template chart request
     * @returns {Object} A dummy HANA chart request for you to modify
     */
    module.getChartRequest = function() {
        return jQuery.extend({}, {
            "DataSource": {},
            "Options": ["SynchronousRun"],
            "SearchTerms": "",
            "Analytics": {
                "Definition": {
                    "Dimensions": [{
                        "Axis": "Rows",
                        "Name": "CATEGORY",
                        "SortOrder": 1,
                        "Top": 5
                    }, {
                        "Axis": "Columns",
                        "Name": "CustomDimension1",
                        "Members": [{
                            "Aggregation": "COUNT",
                            "AggregationDimension": "CATEGORY",
                            "MemberOperand": {
                                "AttributeName": "Measures",
                                "Comparison": "=",
                                "Value": "COUNT"
                            },
                            "Name": "COUNT",
                            "SortOrder": 2
                        }]
                    }],
                    "Filter": {}
                }
            }
        });
    };

    /**
     * template search config request
     * @returns {Object} A dummy search config request for you to modify
     */
    module.getSearchConfigurationRequest = function() {
        return jQuery.extend({}, {
            "SearchConfiguration": {
                "Action": "Update", // Get/ Update; bei NavigationEvent optional
                "Data": {
                    "PersonalizedSearch": {
                        "PersonalizationPolicy": "", // nur bei Action:Get
                        "SessionUserActive": true, // optional
                        "ResetUserData": true // optional, nur bei Action:Update
                    },
                    "NavigationEvent": { // nur bei Action=Update
                        "SourceApplication": "",
                        "TargetApplication": "",
                        "Parameter": []
                    }
                }
            }
        });
    };

}(window));
/* source file: impl/inav2/datasource.js */
/*
 * @file Implementation of the datasource interface
 * @namespace sap.bc.ina.api.sina.impl.inav2.datasource
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    /**
     * import packages
     */
    var datasource = global.sap.bc.ina.api.sina.base.datasource;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.datasource');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    module.DataSource = function() {
        this.init.apply(this, arguments);
    };
    module.DataSourceMetaData = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class datasource
     */
    module.DataSource.prototype = jQuery.extend(Object.create(datasource.DataSource.prototype), {

        /**
         * The data source of a query that is a view in SAP HANA.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createDataSource} factory instead of this constructor.
         * @constructs sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @augments {sap.bc.ina.api.sina.base.datasource.DataSource}
         * @param {Object} properties the properties object
         * @param {String} [properties.schemaName=_SYS_BIC] The schema of the view to be used.
         * @param {String} properties.packageName The package name of the view to be used.
         * @param {String} properties.objectName The object name if the view to be used.
         * @example <caption>Properties object for a view which resides in the 'SYSTEM' schema
         * and has the name 'J_EPM_PRODUCT'</caption>
         * { schemaName  : 'SYSTEM',
         *   objectName  : 'J_EPM_PRODUCT' }
         * @example <caption>Properties object for a view which resides in the repository
         * in package 'sap.bc.ina.demos.epm.views'</caption>
         * { packageName : 'sap.bc.ina.demos.epm.views',
         *   objectName  : 'V_EPM_PRODUCT' }
         * @private
         */
        init: function(properties) {
            datasource.DataSource.prototype.init.apply(this, [properties]);
            if (!properties) {
                return {};
            }

            var bDonotUpdateKey;
            if (properties.key) {
                this.key = properties.key;
                bDonotUpdateKey = true;
            }
            properties.schemaName = properties.schemaName || properties.SchemaName || {
                label: '',
                value: ''
            };
            this.setSchemaName(properties.schemaName, bDonotUpdateKey);
            properties.packageName = properties.packageName || properties.PackageName || "ABAP";
            this.setPackageName(properties.packageName, bDonotUpdateKey);
            properties.objectName = properties.objectName || properties.ObjectName || {
                label: '',
                value: ''
            };
            this.setObjectName(properties.objectName, bDonotUpdateKey);
            this.setType(properties.type || properties.Type ||  datasource.DataSourceType.DEFAULT, bDonotUpdateKey);
            this.label = properties.label || properties.Label || properties.Description || '';
            this.labelPlural = properties.labelPlural || properties.LabelPlural || properties.DescriptionPlural || this.label || '';
            this.semanticObjectType = properties.semanticObjectType || properties.SemanticObjectType || '';
            this.systemId = properties.systemId || properties.SystemId || '';
            this.client = properties.client || properties.Client || '';
            this.sina = properties.sina || null;
            if (properties.metaData) {
                this.setMetaData(properties.metaData);
            }

            if (!this.key) {
                throw 'Datasource has no key' + JSON.stringify(properties);
            }
        },

        setMetaData: function(dataSourceMetaData) {
            this.metaData = dataSourceMetaData;
        },

        getIdentifier: function() {
            return this.key;
        },

        /**
         * Returns the schema name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @return {String} The schema name for this data source.
         */
        getSchemaName: function() {
            if (!this.schemaName) {
                this.schemaName = {
                    label: '',
                    value: ''
                };
            }
            return this.schemaName;
        },

        _getSchemaNameAsString: function() {
            if (jQuery.type(this.schemaName) === 'object') {
                return this.schemaName.value;
            }
            if (jQuery.type(this.schemaName) === 'string') {
                return this.schemaName;
            }
            return '';
        },

        /**
         * Sets the schema name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @param {String} schemaName The new schemaName
         * @param {boolean} donotUpdateKey The flag that don't update key, optional.
         */
        setSchemaName: function(schemaName, donotUpdateKey) {
            if (!this.schemaName) {
                this.schemaName = {};
            }
            if (jQuery.type(schemaName) === 'object') {
                this.schemaName.label = schemaName.label || schemaName.value || '';
                this.schemaName.value = schemaName.value || '';

            }
            if (jQuery.type(schemaName) === 'string') {
                this.schemaName.label = schemaName;
                this.schemaName.value = schemaName;
            }

            if (donotUpdateKey !== true) {
                this._constructKey();
            }
        },

        /**
         * Returns the package name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @return {String} The package name for this data source.
         */
        getPackageName: function() {
            if (!this.packageName) {
                this.packageName = {
                    label: '',
                    value: ''
                };
            }
            return this.packageName;
        },

        getPackageNameAsString: function() {
            if (jQuery.type(this.packageName) === 'object') {
                return this.packageName.value;
            }
            if (jQuery.type(this.packageName) === 'string') {
                return this.packageName;
            }
            return '';
        },
        /**
         * Sets the package name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @param {String} packageName The new package name.
         * @param {boolean} donotUpdateKey The flag that don't update key, optional.
         */
        setPackageName: function(packageName, donotUpdateKey) {
            if (!this.packageName) {
                this.packageName = {};
            }
            if (jQuery.type(packageName) === 'object') {
                this.packageName.label = packageName.label || packageName.value || '';
                this.packageName.value = packageName.value || '';
            }
            if (jQuery.type(packageName) === 'string') {
                this.packageName.label = packageName;
                this.packageName.value = packageName;
            }

            if (donotUpdateKey !== true) {
                this._constructKey();
            }
        },

        /**
         * Returns the object name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @return {String} The object name for this data source.
         */
        getObjectName: function() {
            if (!this.objectName) {
                this.objectName = {
                    label: '',
                    value: ''
                };
            }
            return this.objectName;
        },

        /**
         * Sets the object name for this data source.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.datasource.DataSource
         * @instance
         * @since SAP HANA SPS 06
         * @param {String} objectName The new object name.
         * @param {boolean} donotUpdateKey The flag that don't update key, optional.
         */
        setObjectName: function(objectName, donotUpdateKey) {
            if (!this.objectName) {
                this.objectName = {};
            }
            if (jQuery.type(objectName) === 'object') {
                this.objectName.label = objectName.label || objectName.value || '';
                this.objectName.value = objectName.value || '';

            }
            if (jQuery.type(objectName) === 'string') {
                this.objectName.label = objectName;
                this.objectName.value = objectName;
            }

            if (donotUpdateKey !== true) {
                this._constructKey();
            }
        },

        _constructKey: function() {
            this.key = this.getTypeAsString() + '/' + this.getPackageNameAsString() + '/' + this.getObjectNameAsString();
        },

        setObjectNameValue: function(value, donotUpdateKey) {
            if (!this.objectName) {
                this.objectName = {};
            }
            this.objectName.value = value || '';

            if (donotUpdateKey !== true) {
                this._constructKey();
            }
        },

        setObjectNameLabel: function(label) {
            if (!this.objectName) {
                this.objectName = {};
            }
            this.objectName.label = label || '';
            if (!this.label) {
                this.setLabel(label);
            }
            if (!this.labelPlural) {
                this.setLabelPlural(label);
            }
        },

        getObjectNameAsString: function() {
            if (jQuery.type(this.objectName) === 'object') {
                return this.objectName.value;
            }
            if (jQuery.type(this.objectName) === 'string') {
                return this.objectName;
            }
            return '';
        },

        setType: function(type, donotUpdateKey) {
            var value = datasource.DataSourceType.DEFAULT;

            // parsing type to businessobject / category
            if (typeof type === "object") {
                if (type.value.toLowerCase() === "view" || type.value.toLowerCase() === "businessobject") {
                    value = datasource.DataSourceType.BUSINESSOBJECT;
                } else {
                    value = datasource.DataSourceType.DEFAULT;
                }
            } else {
                if (type.toLowerCase() === "view" || type.toLowerCase() === "businessobject") {
                    value = datasource.DataSourceType.BUSINESSOBJECT;
                } else {
                    value = datasource.DataSourceType.DEFAULT;
                }
            }
            this.type = value;

            if (donotUpdateKey !== true) {
                this._constructKey();
            }
        },

        getTypeAsString: function() {
            if (jQuery.type(this.type) === 'object') {
                return this.type.value;
            }
            if (jQuery.type(this.type) === 'string') {
                return this.type;
            }
            return '';
        },

        getLabel: function() {
            if (typeof this.label !== 'undefined' && this.label !== '') {
                return this.label;
            }
            if (typeof this.getObjectName().label !== 'undefined' && this.getObjectName().label !== '') {
                return this.getObjectName().label;
            }

            if (typeof this.getObjectName().value !== 'undefined' && this.getObjectName().value !== '') {
                return this.getObjectName().value;
            }
            return '';
        },

        setLabel: function(label) {
            this.label = label || '';
            this.labelPlural = this.labelPlural || this.label;
        },

        getLabelPlural: function() {
            if (typeof this.labelPlural !== 'undefined' && this.labelPlural !== '') {
                return this.labelPlural;
            }
            return this.getLabel();
        },

        setLabelPlural: function(labelPlural) {
            this.labelPlural = labelPlural || '';
        },

        setJsonFromResponse: function(inaJson) {
            this.setSchemaName({
                value: inaJson.SchemaName,
                label: inaJson.SchemaLabel
            });
            this.setPackageName({
                value: inaJson.PackageName,
                label: inaJson.PackageLabel
            });
            this.setObjectName({
                value: inaJson.ObjectName,
                label: inaJson.ObjectLabel
            });
            this.setType({
                value: inaJson.Type,
                label: ''
            });
        },

        getDataForRequest: function() {

            var json = {
                'SchemaName': this.getSchemaName().value,
                'PackageName': this.getPackageName().value,
                'ObjectName': this.getObjectName().value
            };
            if (this.getType() === datasource.DataSourceType.BUSINESSOBJECT) {
                json.Type = 'View';
            } else {
                json.Type = this.getType();
            }
            return json;
        },

        clone: function() {
            var newDataSource = this.sina.createDataSource();
            newDataSource.setSchemaName(this.schemaName);
            newDataSource.setPackageName(this.packageName);
            newDataSource.setObjectName(this.objectName);
            newDataSource.setType(this.type);
            newDataSource.label = this.label;
            newDataSource.labelPlural = this.labelPlural;
            newDataSource.semanticObjectType = this.semanticObjectType;
            newDataSource.systemId = this.systemId;
            newDataSource.client = this.cliet;
            newDataSource.setMetaData(this.metaData);
            newDataSource.key = this.key;
            return newDataSource;
        },

        setJson: function(json) {
            for (var prop in json) {
                if (json.hasOwnProperty(prop)) {
                    json[prop.toLowerCase()] = json[prop];
                }
            }
            this.schemaName = json.schemaname;
            this.packageName = json.packagename;
            this.objectName = json.objectname;
            if (json.Type === 'View') {
                this.setType(datasource.DataSourceType.BUSINESSOBJECT);
            } else {
                this.setType(json.type);
            }
            this.label = json.label;
            this.labelPlural = json.labelplural;
            this.semanticObjectType = undefined;
            this.systemId = undefined;
            this.client = undefined;
            this.metaData = undefined;
            this._constructKey();

        },

        getJson: function() {

            var json = {
                // add datasource.label in SINA, PART1 //TODO
                "label": this.label,
                "labelPlural": this.labelPlural,
                "SchemaName": {
                    "label": this.getSchemaName().label,
                    "value": this.getSchemaName().value
                },
                "PackageName": {
                    "label": this.getPackageName().label,
                    "value": this.getPackageName().value
                },
                "ObjectName": {
                    "label": this.getObjectName().label,
                    "value": this.getObjectName().value
                }
            };
            json.Type = this.getType();
            return json;
        }

    });
}(window));
/* source file: impl/inav2/meta.js */
/* global $, jQuery, window */
(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // class MetaDataService
    // =======================================================================
    module.MetaDataService = function() {
        this.init.apply(this, arguments);
    };

    module.MetaDataService.prototype = {
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina || null;
            this.allInOneMap = {};
            this.allInOneMap.dataSourceList = [];
            this.allInOneMap.dataSourceMap = {};
            this.dataSourcesDeferred = null; // deferred object for all dataSources
            this.allInOneMap.businessObjectList = [];
            this.allInOneMap.businessObjectMap = {};
            this.businessObjectsDeferred = null; // deferred object for all dataSources' metaData
            //TEST
            //            this.getDataSources();
            //            this.getDataSourcesSync();

            //            var dataSourceInfo = {objectName: "CER002~ZPRODUCT~", packageName: "ABAP", type: "BusinessObject"};
            //            this.getDataSource(dataSourceInfo).done(
            //                function(result){
            //                    return result;
            //                }
            //            );
            //            var result = this.getDataSourceSync(dataSourceInfo);
            //            this.getBusinessObjectMetaData(dataSourceInfo).done(
            //                function(result){
            //                    return result;
            //                }
            //            );
            //            var result = this.getBusinessObjectMetaDataSync(dataSourceInfo);

            //            var dataSourceKey = "BusinessObject/ABAP/CER002~MATERIAL_H~";
            //            this.sina.getDataSourceByBusinessObjectName(dataSourceKey).done(
            //                function(result){
            //                    return result;
            //                }
            //            );
            //            var result = this.sina.getDataSourceSyncByBusinessObjectName(dataSourceKey);
            //            this.sina.getBusinessObjectMetaDataByBusinessObjectName(dataSourceKey).done(
            //                function(result){
            //                    return result;
            //                }
            //            );
            //            var result = this.sina.getBusinessObjectMetaDataSyncByBusinessObjectName(dataSourceKey);

            //             this.getBusinessObjectsMetaData();
            //             this.getBusinessObjectsMetaDataSync();
        },



        //dataSources related functions
        /**
         * Returns all data sources in asynchronous way.
         * @return {array} data source objects.
         */
        getDataSources: function() {
            var that = this;

            return that._fillDataSourcesBuffer().then(function() {
                return that.allInOneMap.dataSourceList;
            });
        },

        /**
         * Returns all data sources in synchronous way.
         * @return {array} data source objects.
         */
        getDataSourcesSync: function() {
            var that = this;
            that._fillDataSourcesBufferSync();
            return that.allInOneMap.dataSourceList;
        },

        /**
         * Returns single data source in asynchronous way.
         * @param {object} data source object with objectName, packageName, type ("BusinessObject" or "Category") as properties in string.
         * @return {object} data source object.
         */
        getDataSource: function(dataSource) {
            var that = this;
            if (!dataSource) {
                throw "data source is missing";
            }
            if (!dataSource.objectName) {
                throw "data source's objectName is missing";
            }
            if (!dataSource.packageName) {
                throw "data source's packageName is missing";
            }
            if (!dataSource.type) {
                throw "data source's type is missing";
            }

            return that._fillDataSourcesBuffer().then(function() {
                return that.allInOneMap.dataSourceMap[dataSource.key];
            });
        },

        /**
         * Returns single data source in asynchronous way.
         * @param {string} data source key.
         * @return {object} data source object.
         */
        getDataSourceByBusinessObjectName: function(dataSourceKey) {
            var that = this;
            if (!dataSourceKey) {
                throw 'datasource key missing';
            }

            return that._fillDataSourcesBuffer().then(function() {
                return that.allInOneMap.dataSourceMap[dataSourceKey];
            });
        },

        /**
         * Returns single data source in synchronous way.
         * @param {object} data source object with objectName, packageName, type ("BusinessObject" or "Category") as properties in string.
         * @return {object} data source object.
         */
        getDataSourceSync: function(dataSource) {
            var that = this;
            if (!dataSource) {
                throw "data source is missing";
            }
            if (!dataSource.objectName) {
                throw "data source's objectName is missing";
            }
            if (!dataSource.packageName) {
                throw "data source's packageName is missing";
            }
            if (!dataSource.type) {
                throw "data source's type is missing";
            }

            that._fillDataSourcesBufferSync();
            return that.allInOneMap.dataSourceMap[dataSource.key];
        },

        /**
         * Returns single data source in synchronous way.
         * @param {string} data source key.
         * @return {object} data source object.
         */
        getDataSourceSyncByBusinessObjectName: function(dataSourceKey) {
            var that = this;
            if (!dataSourceKey) {
                throw 'datasource key missing';
            }

            that._fillDataSourcesBufferSync();
            return that.allInOneMap.dataSourceMap[dataSourceKey];
        },

        // fill dataSourceList & dataSourceMap Async
        _fillDataSourcesBuffer: function() {
            var that = this;

            // getDataSources was executed
            if (that.dataSourcesDeferred) {
                return that.dataSourcesDeferred;
            }

            that.dataSourcesDeferred = new jQuery.Deferred();

            // getDataSourcesSync was executed
            if (that.allInOneMap.dataSourceList.length !== 0) {
                that.dataSourcesDeferred.resolve(that.allInOneMap.dataSourceList);
                return that.dataSourcesDeferred;
            }

            // query properties
            var properties = {
                sina: that.sina,
                system: that.sina.sys,
                top: 1000
            };

            // $$DataSource$$ query
            var dataSourceQuery = new module.DataSourceQuery(properties);
            var dataSourceResultSetPromise = dataSourceQuery.getResultSet();
            dataSourceResultSetPromise.done(function(resultSet) {
                that._extractDataSources(resultSet);
                that.dataSourcesDeferred.resolve(that.allInOneMap.dataSourceList);
            });

            dataSourceResultSetPromise.fail(function(error) {
                // $$ESHConnectors$$ query as fallback
                dataSourceQuery = new module.ESHConnectorDataSourceQuery(properties);
                dataSourceQuery.getResultSet().done(function(resultSet) {
                    that._extractESHConnectorDataSources(resultSet);
                    that.dataSourcesDeferred.resolve(that.allInOneMap.dataSourceList);
                });

                dataSourceQuery.getResultSet().fail(function(error) {
                    that.dataSourcesDeferred.reject(error);
                    that.dataSourcesDeferred = null;
                });
            });

            return that.dataSourcesDeferred;
        },

        // fill dataSourceList & dataSourceMap Sync
        _fillDataSourcesBufferSync: function() {
            var that = this;

            if (that.allInOneMap.dataSourceList.length !== 0) {
                return;
            }

            // query properties
            var properties = {
                sina: that.sina,
                system: that.sina.sys,
                top: 1000
            };

            // $$DataSource$$ query
            var dataSourceQuery = new module.DataSourceQuery(properties);
            var resultSet = dataSourceQuery.getResultSetSync();
            if (resultSet.elements.length !== 0) {
                that._extractDataSources(resultSet);
            } else {
                // $$ESHConnectors$$ query as fallback
                dataSourceQuery = new module.ESHConnectorDataSourceQuery(properties);
                resultSet = dataSourceQuery.getResultSetSync();
                that._extractESHConnectorDataSources(resultSet);
            }
        },

        // extract datasources from $$DataSource$$ query response
        _extractDataSources: function(resultSet) {
            var that = this;
            var elements = resultSet.getElements();

            for (var i = 0; i < elements.length; ++i) {
                var element = elements[i];
                // exclude categories
                if (element.Type.value.toLowerCase() !== "category") {
                    var labelValue = element.Description.value === null ? element.ObjectName.value : element.Description.value;
                    var labelPluralValue = element.DescriptionPlural === undefined || element.DescriptionPlural.value === null ? labelValue : element.DescriptionPlural.value;
                    var ds = that.sina.createDataSource({
                        objectName: {
                            label: element.ObjectName.value,
                            value: element.ObjectName.value
                        },
                        packageName: {
                            label: "ABAP",
                            value: "ABAP"
                        },
                        schemaName: "",
                        type: "View",
                        label: labelValue,
                        labelPlural: labelPluralValue
                    });
                    var key = ds.key;
                    if (!(key in that.allInOneMap.dataSourceMap)) {
                        // avoid duplication
                        that.allInOneMap.dataSourceList.push(ds);
                        that.allInOneMap.dataSourceMap[key] = ds;
                    }
                }
            }
            that._setRemoteSystemName();
        },

        // extract datasources from $$ESHConnectors$$ query response
        _extractESHConnectorDataSources: function(resultSet) {
            var that = this;
            var elements = resultSet.getElements();

            for (var i = 0; i < elements.length; ++i) {
                var element = elements[i];
                // exclude categories
                if (element.$$DataSourceMetaData$$.type.toLowerCase() !== "category") {
                    var labelValue = element.DESCRIPTION.value === null ? element.OBJECT_NAME.value : element.DESCRIPTION.value;
                    var labelPluralValue = element.DESCRIPTIONPLURAL === undefined || element.DESCRIPTIONPLURAL.value === null ? labelValue : element.DESCRIPTIONPLURAL.value;
                    var ds = that.sina.createDataSource({
                        objectName: {
                            label: element.OBJECT_NAME.value,
                            value: element.OBJECT_NAME.value
                        },
                        packageName: {
                            label: "ABAP",
                            value: "ABAP"
                        },
                        schemaName: "",
                        type: "View",
                        label: labelValue,
                        labelPlural: labelPluralValue
                    });
                    var key = ds.key;
                    if (!(key in that.allInOneMap.dataSourceMap)) {
                        // avoid duplication
                        that.allInOneMap.dataSourceList.push(ds);
                        that.allInOneMap.dataSourceMap[key] = ds;
                    }
                }
            }

            that._setRemoteSystemName();
        },

        // set remote system name for same named data sources
        _setRemoteSystemName: function() {
            var that = this;
            var system = "";
            var key = "";
            for (var i = 0; i < that.allInOneMap.dataSourceList.length - 1; i++) {
                if (that.allInOneMap.dataSourceList[i].labelPlural === that.allInOneMap.dataSourceList[i + 1].labelPlural) {
                    // set system name of 1st same named data source
                    if (that.allInOneMap.dataSourceList[i].remoteSystem === undefined) {
                        // parse system name
                        system = that.allInOneMap.dataSourceList[i].objectName.value.substr(0, that.allInOneMap.dataSourceList[i].objectName.value.indexOf('~'));
                        // set system in dataSourceList
                        that.allInOneMap.dataSourceList[i].remoteSystem = system;
                        // set system in dataSourceMap
                        key = that.allInOneMap.dataSourceList[i].key;
                        that.allInOneMap.dataSourceMap[key].remoteSystem = system;

                    }
                    // set system name of 2nd same named data source
                    // parse system name
                    system = that.allInOneMap.dataSourceList[i + 1].objectName.value.substr(0, that.allInOneMap.dataSourceList[i + 1].objectName.value.indexOf('~'));
                    // set system in dataSourceList
                    that.allInOneMap.dataSourceList[i + 1].remoteSystem = system;
                    // set system in dataSourceMap
                    key = that.allInOneMap.dataSourceList[i + 1].key;
                    that.allInOneMap.dataSourceMap[key].remoteSystem = system;
                }
            }
        },



        // dataSource metadata related functions
        /**
         * Returns meta data of all data sources in asynchronous way.
         * @return {array} meta data objects.
         */
        getBusinessObjectsMetaData: function() {
            var that = this;

            return that.getDataSources().then(function() {
                return that._fillBusinessObjectsBuffer().then(function() {
                    return that.allInOneMap.businessObjectList;
                });
            });
        },

        /**
         * Returns meta data of all data sources in synchronous way.
         * @return {array} meta data objects.
         */
        getBusinessObjectsMetaDataSync: function() {
            var that = this;

            that.getDataSourcesSync();
            that._fillBusinessObjectsBufferSync();
            return this.allInOneMap.businessObjectList;
        },

        /**
         * Returns meta data of single data source in asynchronous way.
         * @param {object} data source object with objectName, packageName, type as properties in string.
         * @return {object} meta data of single data source.
         */
        getBusinessObjectMetaData: function(dataSource) {
            var that = this;
            if (!dataSource) {
                throw "data source is missing";
            }
            if (!dataSource.objectName) {
                throw "data source's objectName is missing";
            }
            if (!dataSource.packageName) {
                throw "data source's packageName is missing";
            }
            if (!dataSource.type) {
                throw "data source's type is missing";
            }

            return that.getDataSource(dataSource).then(function() {
                return that._fillBusinessObjectBuffer(dataSource.key).then(function() {
                    return that.allInOneMap.businessObjectMap[dataSource.key];
                });
            });
        },

        /**
         * Returns meta data of single data source in asynchronous way.
         * @param {string} data source key.
         * @return {object} meta data of single data source.
         */
        getBusinessObjectMetaDataByBusinessObjectName: function(dataSourceKey) {
            var that = this;
            if (!dataSourceKey) {
                throw 'datasource key missing';
            }

            return that.getDataSourceByBusinessObjectName(dataSourceKey).then(function() {
                return that._fillBusinessObjectBuffer(dataSourceKey).then(function() {
                    return that.allInOneMap.businessObjectMap[dataSourceKey];
                });
            });
        },

        /**
         * Returns meta data of single data source in synchronous way.
         * @param {object} data source object with objectName, packageName, type ("BusinessObject" or "Category") as properties in string.
         * @return {object} meta data of single data source.
         */
        getBusinessObjectMetaDataSync: function(dataSource) {
            var that = this;
            if (!dataSource) {
                throw "data source is missing";
            }
            if (!dataSource.objectName) {
                throw "data source's objectName is missing";
            }
            if (!dataSource.packageName) {
                throw "data source's packageName is missing";
            }
            if (!dataSource.type) {
                throw "data source's type is missing";
            }

            //var key = that._getKey(dataSource);
            that.getDataSourceSync(dataSource);
            that._fillBusinessObjectBufferSync(dataSource.key);
            return that.allInOneMap.businessObjectMap[dataSource.key];
        },

        /**
         * Returns meta data of single data source in synchronous way.
         * @param {string} data source key.
         * @return {object} meta data of single data source.
         */
        getBusinessObjectMetaDataSyncByBusinessObjectName: function(dataSourceKey) {
            var that = this;
            if (!dataSourceKey) {
                throw 'datasource key missing';
            }

            //var key = that._getKey(dataSource);
            that.getDataSourceSyncByBusinessObjectName(dataSourceKey);
            that._fillBusinessObjectBufferSync(dataSourceKey);
            return that.allInOneMap.businessObjectMap[dataSourceKey];
        },

        // fill businessObjectList & businessObjectMap Async
        _fillBusinessObjectsBuffer: function() {
            var that = this;

            // getBusinessObjectsMetaData was executed
            if (that.businessObjectsDeferred) {
                return that.businessObjectsDeferred;
            }

            that.businessObjectsDeferred = new jQuery.Deferred();

            // getBusinessObjectsMetaDataSync was executed
            if (that.allInOneMap.businessObjectList.length !== 0) {
                that.dataSourcesDeferred.resolve(that.allInOneMap.businessObjectList);
                return that.dataSourcesDeferred;
            }

            var dsl = that.allInOneMap.dataSourceList;
            var businessObjectDeferredArray = [];
            for (var i = 0; i < dsl.length; i++) {
                businessObjectDeferredArray.push(that._businessObjectDeffered(dsl[i].key));
            }

            jQuery.when.apply(null, businessObjectDeferredArray).then(function() {
                that.businessObjectsDeferred.resolve(that.allInOneMap.businessObjectList);
            }, function(error) {
                that.businessObjectsDeferred = null;
                that.businessObjectsDeferred.reject(error);
            });

            return that.businessObjectsDeferred;
        },

        // fill single businessObject in businessObjectList & businessObjectMap Async
        // called by _fillBusinessObjectsBuffer
        _businessObjectDeffered: function(key) {
            var that = this;

            var jqXHR = that.sina.getSystem().proxy.ajax(that._parseMetaDataRequest(true, that.allInOneMap.dataSourceMap[key]));
            return jqXHR.then(function(result) {
                var attributeMap = that._parseMetaDataResponse(result);
                that._setMetaData(key, attributeMap);
                return jQuery.when(true);
            }, function(error) {
                return jQuery.when(false);
            });
        },

        // fill businessObjectList & businessObjectMap Sync
        _fillBusinessObjectsBufferSync: function() {
            var that = this;

            if (that.allInOneMap.businessObjectList.length !== 0) {
                return;
            }

            var dsl = that.allInOneMap.dataSourceList;
            for (var i = 0; i < dsl.length; i++) {
                if (!(dsl[i].key in that.allInOneMap.businessObjectMap)) {
                    that._fillBusinessObjectBufferSync(dsl[i].key);
                }
            }
        },

        // fill single businessObject in businessObjectList & businessObjectMap Async
        _fillBusinessObjectBuffer: function(key) {
            var that = this;
            // local deferred for single dataSource
            var businessObjectDeferred = new jQuery.Deferred();

            if (that.allInOneMap.businessObjectMap[key]) {
                businessObjectDeferred.resolve(that.allInOneMap.businessObjectMap[key]);
                return businessObjectDeferred;
            }

            // metaData of single dataSource
            var jqXHR = that.sina.getSystem().proxy.ajax(that._parseMetaDataRequest(true, that.allInOneMap.dataSourceMap[key]));
            jqXHR.then(function(result) {
                var attributeMap = that._parseMetaDataResponse(result);
                that._setMetaData(key, attributeMap);
                businessObjectDeferred.resolve(that.allInOneMap.businessObjectMap[key]);
            }, function(error) {
                businessObjectDeferred = null;
                businessObjectDeferred.reject(error);
            });

            return businessObjectDeferred;
        },

        // fill single businessObject in businessObjectList & businessObjectMap Sync
        _fillBusinessObjectBufferSync: function(key) {
            var that = this;

            if (that.allInOneMap.businessObjectMap[key] !== undefined) {
                return;
            }

            // get dataSource list before get metaData
            var ds = that.allInOneMap.dataSourceMap[key];

            // metaData of single dataSource
            var jqXHR = global.sap.bc.ina.api.sina.getSystem().proxy.ajax(that._parseMetaDataRequest(false, ds));
            //jqXHR.done(function(result){
            var json = $.parseJSON(jqXHR.responseText);
            if (!json.Error) {
                var attributeMap = that._parseMetaDataResponse(json);
                that._setMetaData(ds.key, attributeMap);
            }
        },

        // parse meta data request
        _parseMetaDataRequest: function(isAsync, dataSource) {
            var parseDS = {
                ObjectName: dataSource.objectName.value,
                PackageName: dataSource.packageName.value,
                SchemaName: dataSource.schemaName.value,
                Type: dataSource.type.value
            };
            var request = {
                async: isAsync,
                url: this.sina.getSystem().inaUrl,
                processData: false,
                contentType: 'application/json',
                dataType: 'json',
                data: {
                    "DataSource": parseDS,
                    "Options": ["SynchronousRun"],
                    "Metadata": {
                        "Context": "Search",
                        "Expand": ["Cube"]
                    },
                    "ServiceVersion": 204
                },
                success: function(result) {

                }
            };
            return request;
        },

        // parse response to meta data
        _parseMetaDataResponse: function(json) {
            var attributeMap = {};

            if (!json.Cube || !json.Cube.Dimensions) {
                return attributeMap;
            }

            for (var i = 0; i < json.Cube.Dimensions.length; i++) {
                for (var j = 0; j < json.Cube.Dimensions[i].Attributes.length; j++) {
                    var key = json.Cube.Dimensions[i].Attributes[j].Name;
                    //var unKeyList = ["$$ResultItemAttributes$$", "$$WhyFound$$", "$$RelatedActions$$", "$$RenderingTemplateSpecification$$", "$$DataSourceMetaData$$", "$$AttributeMetadata$$", "$$RenderingTemplateHeight$$", "$$RenderingTemplatePlatform$$", "$$RenderingTemplateSpecification$$", "$$RenderingTemplateTechnology$$", "$$RenderingTemplateType$$", "$$RenderingTemplateVariant$$", "$$RenderingTemplateWidth$$"];
                    //if (key === undefined || key === "" || $.inArray(key, unKeyList) > -1) {
                    if (key === undefined || key === "" || key.indexOf("$$") > -1) {
                        continue;
                    }

                    attributeMap[key] = {
                        displayOrder: json.Cube.Dimensions[i].Attributes[j].DisplayOrder || 0,
                        isTitle: $.inArray("Title", json.Cube.Dimensions[i].Attributes[j].presentationUsage) > -1 ? true : false,
                        isKey: json.Cube.Dimensions[i].Attributes[j].IsKey,
                        label: json.Cube.Dimensions[i].Attributes[j].Description || "",
                        labelRaw: key,
                        presentationUsage: json.Cube.Dimensions[i].Attributes[j].presentationUsage || [],
                        accessUsage: json.Cube.Dimensions[i].Attributes[j].accessUsage || [],
                        type: json.Cube.Dimensions[i].Attributes[j].DataType || ""
                    };
                }
            }
            return attributeMap;
        },



        /**
         * Sets single data source's metadata.
         * @param {object} data source object
         * @param {object} meta data information object.
         */
        //DOTO: data normalize
        setBusinessObjectMetaDataSync: function(datasource, data) {
            var that = this;

            if (that.allInOneMap.businessObjectMap[datasource.key]) {
                return;
            }

            var attributeMap = {};
            for (var element in data) {
                if (element.indexOf("$$") > -1 || element === "title" || jQuery.type(data[element]) === "function" || !data[element] || !data[element].$$MetaData$$) {
                    continue;
                }

                var attribute = data[element];
                var metadata = attribute.$$MetaData$$;
                var newAttribute = {
                    labelRaw: element,
                    label: metadata.description,
                    type: metadata.dataType,
                    isTitle: metadata.isTitle,
                    isKey: metadata.isKey,
                    presentationUsage: metadata.presentationUsage,
                    accessUsage: metadata.accessUsage,
                    displayOrder: metadata.displayOrder
                };

                attributeMap[element] = newAttribute;
            }
            that._setMetaData(datasource.key, attributeMap);
        },

        // set attributeMap to businessObjectList & businessObjectMap
        _setMetaData: function(key, attributeMap) {
            var that = this;

            that.allInOneMap.businessObjectMap[key] = {
                attributeMap: {}
            };
            that.allInOneMap.businessObjectMap[key].attributeMap = attributeMap;
            that.allInOneMap.businessObjectList.push(attributeMap);
        }

    };

}(window));
/* source file: impl/inav2/filter.js */
/*
 * @file Implementation of the filter interface
 * @namespace sap.bc.ina.api.sina.impl.inav2.filter
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    /**
     * import packages
     */
    var filter = global.sap.bc.ina.api.sina.base.filter;
    //var templates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.filter');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2.filter;

    module.Filter = function() {
        this.init.apply(this, arguments);
    };
    module.Condition = function() {
        this.init.apply(this, arguments);
    };
    module.ConditionGroup = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class filter
     */
    module.Filter.prototype = jQuery.extend(Object.create(filter.Filter.prototype), {

        /**
         * A simple filter for SINA queries.
         * Use {@link sap.bc.ina.api.sina.base.Sina#createFilter} factory instead of this private constructor.
         * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Filter
         * @augments {sap.bc.ina.api.sina.base.filter.Filter}
         * @param  {Object} properties Configuration object.
         * @private
         * @since SAP HANA SPS 06
         */
        init: function(properties) {
            global.sap.bc.ina.api.sina.base.filter.Filter.prototype.init.apply(this, [properties]);
        },

        getDataForRequest: function() {
            var root = [];
            this.defaultConditionGroup.getDataForRequest(root);
            root[0].Selection.Operator = root[0].Selection.Operator ||  {
                'Code': 'And'
            };
            root[0].Selection.Operator.SubSelections = root[0].Selection.Operator.SubSelections ||  [];
            root[0].Selection.Operator.SubSelections.push({
                "MemberOperand": {
                    "AttributeName": "$$RenderingTemplatePlatform$$",
                    "Comparison": "=",
                    "Value": "html"
                }
            });
            root[0].Selection.Operator.SubSelections.push({
                "MemberOperand": {
                    "AttributeName": "$$RenderingTemplateTechnology$$",
                    "Comparison": "=",
                    "Value": "Tempo"
                }
            });
            root[0].Selection.Operator.SubSelections.push({
                "MemberOperand": {
                    "AttributeName": "$$RenderingTemplateType$$",
                    "Comparison": "=",
                    "Value": "ResultItem"
                }
            });
            root[0].Selection.Operator.SubSelections.push({
                "MemberOperand": {
                    "AttributeName": "$$RenderingTemplateType$$",
                    "Comparison": "=",
                    "Value": "ItemDetails"
                }
            });
            return root[0];
        },

        setJsonFromResponse: function(json) {
            if (json.Selection === undefined) {
                return;
            }
            var group = this.sina.createFilterConditionGroup();
            group.setJsonFromResponse(json);
            this.defaultConditionGroup.addCondition(group);
        }

    });

    /**
     * class condition
     */
    module.Condition.prototype = jQuery.extend(Object.create(filter.Condition.prototype), {

        /**
         * Creates a new filter condition.
         * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Condition
         * @augments {sap.bc.ina.api.sina.base.filter.Condition}
         * @param {String|Object} attribute     Technical identifier of the attribute, as defined in the database.
         * If the type is Object, this object can have properties with the name and value of the arguments.
         * @param {String} operator             Operator of the filter condition. The default value is "=".
         * @param {String} value                Value that should be filtered in the attribute.
         */
        init: function(attribute, operator, value, sina) {
            global.sap.bc.ina.api.sina.base.filter.Condition.prototype.init.apply(this, arguments);
            //            if (jQuery.type(attribute) === 'object') {
            //                this.inaV2_extended_properties = attribute;
            //                delete this.inaV2_extended_properties.attribute;
            //                delete this.inaV2_extended_properties.operator;
            //                delete this.inaV2_extended_properties.value;
            //            }
        },

        getDataForRequest: function(parent) {
            var operand;
            var json = {};

            if (this.operator.toLowerCase() === 'contains') {
                operand = 'SearchOperand';
            } else {
                operand = 'MemberOperand';
            }
            json[operand] = {
                'AttributeName': this.attribute,
                'Comparison': this.operator,
                'Value': this.value
            };
            if (operand === 'SearchOperand') {
                delete json[operand].Comparison;
            }
            json[operand] = jQuery.extend({}, json[operand], this.inaV2_extended_properties);
            if (this.operator === '=' && this.value === null) {
                json.MemberOperand.Comparison = 'IS NULL';
                json.MemberOperand.Value = '';
            }
            parent.push(json);
        },

        setJsonFromResponse: function(json) {
            this.attribute = json.MemberOperand.AttributeName;
            this.operator = json.MemberOperand.Comparison;
            this.value = json.MemberOperand.Value;
            if (json.MemberOperand.Comparison === 'IS NULL' && json.MemberOperand.Value === '') {
                this.operator = '=';
                this.value = null;
            }
        }

    });

    /**
     * class condition group
     */
    module.ConditionGroup.prototype = jQuery.extend(Object.create(filter.ConditionGroup.prototype), {

        /**
         * Creates a new filter condition.
         * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Condition
         * @augments {sap.bc.ina.api.sina.base.filter.ConditionGroup}
         * @param {Object} properties     properties configuration object.
         */
        init: function(properties) {
            filter.ConditionGroup.prototype.init.apply(this, [properties]);
        },

        getDataForRequest: function(parent) {
            var result = {
                Selection: {}
            };
            var children = [];
            if (this.conditions.length > 0) {
                for (var i = 0; i < this.conditions.length; ++i) {
                    this.conditions[i].getDataForRequest(children);
                }
                result.Selection = {
                    'Operator': {
                        'Code': this.operator,
                        'SubSelections': children
                    }
                };
            }
            if (parent) {
                parent.push(result);
            } else {
                return result;
            }
        },

        setJsonFromResponse: function(json) {
            if (json.Selection === undefined && json.Operator) {
                json.Selection = {};
                json.Selection.Operator = json.Operator;
            }
            this.setOperator(json.Selection.Operator.Code);
            var conditions = json.Selection.Operator.SubSelections;
            for (var i = 0; i < conditions.length; i++) {
                var condition;
                if (conditions[i].Operator) {
                    condition = this.sina.createFilterConditionGroup();
                } else {
                    condition = this.sina.createFilterCondition();
                }
                condition.setJsonFromResponse(conditions[i]);
                this.addCondition(condition);
            }
        }

    });
}(window));

/* source file: impl/inav2/proxy.js */
/*
 * @file Proxy class to buffer InA JSON requests/responses.
 * @namespace sap.bc.ina.api.sina.impl.inav2.proxy
 * @copyright Copyright (c) 2014 SAP SE. All rights reserved.
 * @ignore
 */
(function(global) {
    "use strict";

    /**
     * import packages
     */
    var proxy = global.sap.bc.ina.api.sina.proxy;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.proxy');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2.proxy;

    /**
     * Receives service calls from data boxes and forwards them to server side, either
     * as single GET requests or as POST with GETs as payload.
     */
    module.inaReqResBuffer = {};

    module.Proxy = function() {
        this.init.apply(this, arguments);
    };

    module.Proxy.prototype = jQuery.extend({}, proxy.Proxy.prototype, {
        init: function(properties) {
            var that = this;
            that.properties = properties || {};
            proxy.Proxy.prototype.init.apply(this, [properties]);
        }
    });

}(window));
/* source file: impl/inav2/base.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    //var datasource = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    // =======================================================================
    // query
    // =======================================================================
    module.Query = function() {
        this.init.apply(this, arguments);
    };
    /**
     * class query
     * Base for chart, search and perspective queries
     */
    module.Query.prototype = jQuery.extend({}, {

        /**
         *  The base query for chart, search, and suggestions queries.
         *  Use the associated factory methods instead of this class.
         *  @constructs sap.bc.ina.api.sina.impl.inav2.Query
         *  @private
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            this.filter = properties.filter || properties.sina.createFilter({
                dataSource: properties.dataSource
            });
        },

        _resetResultSet: function() {
            this.deferredResultSet = null;
            this.resultSet = null;
            this.jqXHR = null;
        },

        _getInAV2Error: function(data) {
            var errors = [];

            if (data && data.error) {
                errors.push(new base.SinaError({
                    message: "INA V2 Service Error " + data.error.code + ": " + data.error.message,
                    errorCode: data.error.code
                }));

            }

            if (data && data.Messages) {
                for (var i = 0; i < data.Messages.length; i++) {
                    if (data.Messages[i].Type >= 2) {
                        errors.push(new base.SinaError({
                            message: "INA V2 Service Error " + data.Messages[i].Number + ": " + data.Messages[i].Text,
                            errorCode: data.Messages[i].Number
                        }));
                    }
                }
            }

            return errors;

        },

        setDataSource: function(dataSource) {
            if (dataSource === undefined) {
                return this;
            }
            dataSource = this.sina.createDataSource(dataSource);
            if (this.filter.getDataSource() === undefined) {
                this.filter.setDataSource(dataSource);
                this._resetResultSet();
                return this;
            }
            if (!this.filter.getDataSource().equals(dataSource)) {
                this.filter.setDataSource(dataSource);
                this._resetResultSet();
            }
            return this;
        },

        execute: function() {
            var that = this;

            var jsonRequest = that.createJsonRequest();

            that.system.getServerInfo();
            if (!that.jqXHR) {
                that.jqXHR = that._fireRequest(jsonRequest, true);
            }

            var deferredResultSet = jQuery.Deferred();

            that.jqXHR.done(function(data) {
                    var error = that._getInAV2Error(data);
                    if (data && error && error.length > 0) {
                        if (data.error) {
                            deferredResultSet.reject(error[0]);
                            return;
                        } else if (data.Messages) {
                            //only reject if in every Message is an error
                            if (error.length >= data.Messages.length) {
                                deferredResultSet.reject(error);
                                return;
                            }
                        }
                    }
                    that.resultSetProperties.sina = that.sina;
                    that.resultSetProperties.query = that;
                    var resultSet = new that.resultSetClass(that.resultSetProperties);
                    resultSet.setJsonFromResponse(data);
                    deferredResultSet.resolve(resultSet);
                })
                .fail(function(error) {
                    deferredResultSet.reject(error);
                })
                .always(function(data) {
                    that._responseJson = data;
                });

            return deferredResultSet.promise();
        },

        executeSync: function() {
            var that = this;

            if (that.resultSet !== null) {
                return that.resultSet;
            }
            var jsonRequest = that.createJsonRequest();
            that.system.getServerInfo();
            var data = JSON.parse(that._fireRequest(jsonRequest, false).responseText);
            that._responseJson = data;
            that.resultSet = new that.resultSetClass(that.resultSetProperties);

            if (data) {
                var error = that._getInAV2Error(data);
                if (error && error.length > 0) {
                    throw error[0];
                }
                that.resultSet.setJsonFromResponse(data);
            }

            return that.resultSet;
        },

        /**
         * Calls the server for the query instances.
         * @private
         * @ignore
         * @memberOf sap.bc.ina.api.sina.impl.inav2.Query
         * @instance
         * @param  {Object}  data   Request data that is sent to the server.
         * @param  {boolean} async  Should the request be asynchronous?
         * @param {String} dataType Data type of the response, see https://api.jquery.com/jQuery.ajax/
         * @returns {Object} jQuery jqXHR object
         */
        _fireRequest: function(data, async, dataType) {
            async = async === undefined ? true : async;
            var request = {
                async: async,
                url: this.system.inaUrl,
                contentType: 'application/json',
                dataType: dataType || 'json',
                data: data
            };

            var jqXHR = this.system.proxy.ajax(request);
            return jqXHR;

        },

        /**
         * Assembles the order-by expression needed for calling ina.v2 service.
         * @private
         * @ignore
         * @memberOf sap.bc.ina.api.sina.impl.inav2.Query
         * @instance
         * @return {Object} Order-by expression.
         */
        _assembleOrderBy: function() {

            var orderByList = [];

            function orderByToInaSyntax(orderBy, sortOrder) {
                var inaOrderObj = {};
                if (orderBy.toLowerCase() === '$$score$$') {
                    inaOrderObj.Function = 'Score';
                } else {
                    inaOrderObj.AttributeName = orderBy;
                }
                inaOrderObj.SortOrder = sortOrder.toUpperCase();
                return inaOrderObj;
            }

            var orderObj;
            if (jQuery.type(this.orderBy) === 'array') {
                for (var j = 0; j < this.orderBy.length; j++) {
                    orderObj = orderByToInaSyntax(this.orderBy[j].orderBy, this.orderBy[j].sortOrder);
                    orderByList.push(orderObj);
                }
            } else if (jQuery.type(this.orderBy) === 'object' && this.orderBy.orderBy) {
                orderObj = orderByToInaSyntax(this.orderBy.orderBy, this.orderBy.sortOrder);
                orderByList.push(orderObj);
            }

            return orderByList;
        }

    });


}(window));
/* source file: impl/inav2/perspective.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package hugo
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import other packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;

    // =======================================================================
    // perspective query
    // =======================================================================

    module.PerspectiveQuery = function() {
        this.init.apply(this, arguments);
    };

    module.PerspectiveQuery.prototype = jQuery.extend({}, base.PerspectiveQuery.prototype, module.Query.prototype, {

        /**
         * Creates a perspective query.
         * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveQuery
         * @param  {Object} properties Configuration object.
         * @augments {sap.bc.ina.api.sina.base.PerspectiveQuery}
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         */
        init: function(properties) {
            var that = this;
            that.chartFacets = [];
            that.searchFacet = null;
            that.searchresultset = null;
            that.layout = null;
            that.templateFactsheet = properties.templateFactsheet || false;
            properties = properties || {};
            module.Query.prototype.init.apply(this, arguments);
            base.PerspectiveQuery.prototype.init.apply(this, arguments);
            properties.orderBy = properties.orderBy || {};
            this.setOrderBy(properties.orderBy);
            this.resultSetClass = module.Perspective;
            this.resetFilterConditions();
        },

        _resetResultSet: function() {
            module.Query.prototype._resetResultSet.apply(this, arguments);
            base.PerspectiveQuery.prototype._resetResultSet.apply(this, arguments);
        },

        getExpand: function() {
            var expand = [];
            for (var i = 0; i < this.requestedEntities.length; i++) {
                switch (this.requestedEntities[i]) {
                    case 'SearchResults':
                        expand.push('Grid', 'Items');
                        break;
                    case 'Facets':
                        expand.push('ResultsetFacets');
                        break;
                    case 'TotalCount':
                        expand.push('TotalCount');
                        break;
                    case 'Fuzzy':
                        // shall be added to Options part in template later
                        //                        expand.push('Fuzzy');
                        break;
                    default:
                        throw 'Unknown requested entity!';
                }
            }
            return expand;
        },

        resetFilterConditions: function() {
            base.Query.prototype.resetFilterConditions.apply(this, arguments);
        },

        createJsonRequest: function() {
            var template = jsontemplates.getPerspectiveRequest();
            if (this.templateFactsheet) {
                template = jsontemplates.getPerspectiveRequestFactsheet();
            }
            template.DataSource = this.filter.dataSource.getDataForRequest();
            var searchterms = this.filter.getSearchTerms();
            template.Search.SearchTerms = searchterms;
            template.Search.Top = this._top;
            template.Search.Skip = this._skip;
            template.Search.Filter = this.filter.getDataForRequest();
            template.Search.OrderBy = this._assembleOrderBy();
            template.Search.Expand = this.getExpand();
            if (this.facetOptions) {
                template.Facets = this.facetOptions;
            }
            if (this.requestedEntities.indexOf('Fuzzy') > -1) {
                template.Options.push('Fuzzy');
            }
            return template;
        },

        /**
         * Get perspective
         * @memberOf sap.bc.ina.api.sina.impl.inav2.PerspectiveQuery
         * @param  {Function} onSuccess Callback on success
         * @param  {Function} onError   Callback on error
         * @instance
         */
        getPerspective: function(onSuccess, onError) {
            this.getResultSet(onSuccess, onError);
        },


        generatePerspectiveSync: function() {
            return this.getResultSetSync();
        }

    });


    // =======================================================================
    // perspective
    // =======================================================================

    module.Perspective = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective
     */
    module.Perspective.prototype = jQuery.extend({}, base.Perspective.prototype, {

        determineFacetType: function(resultSetFacet) {
            try {
                if (resultSetFacet.ResultSet.ItemLists[0].Items[0].NamedValues[0].Name === '$$DataSource$$') {
                    return base.FacetType.DATASOURCE;
                } else {
                    return base.FacetType.ATTRIBUTE;
                }
            } catch (e) {
                return base.FacetType.ATTRIBUTE;
            }
        },

        setJsonFromResponse: function(data) {
            var that = this;

            // create searchfacet
            that.searchFacet = this.sina.createFacet({
                "facetType": "searchresult"
            });
            that.searchFacet.setJsonFromResponse(data);

            // create chart facets
            if (data.ResultsetFacets && data.ResultsetFacets.Elements) {
                for (var j = 0; j < data.ResultsetFacets.Elements.length; j++) {
                    var facetType = that.determineFacetType(data.ResultsetFacets.Elements[j]);
                    var facet = this.sina.createFacet({
                        "facetType": facetType
                    });
                    facet.setJsonFromResponse(data.ResultsetFacets.Elements[j]);
                    that.chartFacets.push(facet);
                }
            }

        }

    });


    // =======================================================================
    // perspective get query
    // =======================================================================

    module.PerspectiveGetQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective query
     */
    module.PerspectiveGetQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * Creates a perspective search query.
         * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveGetQuery
         * @param  {Object} properties Configuration object.
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         */
        init: function(properties) {
            properties = properties || {};
            this.perspectiveId = properties.perspectiveId;
            module.Query.prototype.init.apply(this, [properties]);
            this.resultSetClass = module.Perspective2;
        },

        setPerspectiveId: function(perspectiveId) {
            this.perspectiveId = perspectiveId;
        },

        getPerspective: function(onSuccess, onError) {
            var that = this;
            var request = {
                async: true,
                url: "/sap/bc/ina/service/v2/Perspectives('" + this.perspectiveId + "')",
                type: "GET"
            };

            var jqXHR = this.system.proxy.ajax(request);

            jqXHR.done(function(data) {
                    if (data && data.error) {
                        onError(data.error);
                    }
                    that.resultSet = new that.resultSetClass(that.resultSetProperties);
                    that.resultSet.setJsonFromResponse(data);
                    if (onSuccess) {
                        onSuccess(that.resultSet);
                    }
                })
                .fail(function(error) {
                    if (onError) {
                        onError(error);
                    }
                });

        }

    });


    // =======================================================================
    // perspective2
    // =======================================================================

    module.Perspective2 = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective 2 - static JSON form server
     */
    module.Perspective2.prototype = {

        /**
         *  A perspective.
         *  @constructs sap.bc.ina.api.sina.impl.inav2.Perspective2
         *  @ignore
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            properties = properties || {};
        },


        getFacetForID: function(facetId) {
            var that = this;
            for (var j = 0; j < that.facets.length; j++) {
                if (that.facets[j].facetId === facetId) {
                    return that.facets[j];
                }
            }
            return undefined;

        },

        getDimensionForID: function(dimensionId) {
            var that = this;
            for (var j = 0; j < that.dimensions.length; j++) {
                if (that.dimensions[j].Name === dimensionId) {
                    return that.dimensions[j];
                }
            }
            return undefined;

        },

        getPreviewDimension: function() {
            if (this.bindings["WIDGET-4"] && this.bindings["WIDGET-4"].dimension) {
                return this.bindings["WIDGET-4"].dimension;
            }
            if (this.bindings["WIDGET-1"] && this.bindings["WIDGET-1"].dimension) {
                return this.bindings["WIDGET-1"].dimension;
            }
            if (this.bindings["WIDGET-2"] && this.bindings["WIDGET-2"].dimension) {
                return this.bindings["WIDGET-2"].dimension;
            }
            if (this.bindings["WIDGET-3"] && this.bindings["WIDGET-3"].dimension) {
                return this.bindings["WIDGET-3"].dimension;
            }
            return undefined;

        },

        setJsonFromResponse: function(data) {
            var that = this;
            that.rawdata = data;
            that.ChangedAt = data.ChangedAt;
            that.ChangedBy = data.ChangedBy;
            that.content = JSON.parse(data.Content);
            that.perspectiveId = data.Id;
            that.name = data.Name;
            that.packageName = data.Package;
            that.isActive = data.isActive;
            that.isGenerated = data.isGenerated;

            that.datasource = that.content.Model.Queries[0].Datasource;

            that.measures = [];
            var measuresJSON = that.content.Model.Queries[0].CustomDimension1.Members;
            for (var k = 0; k < measuresJSON.length; k++) {
                that.measures.push(measuresJSON[k]);
            }

            that.dimensions = [];
            var dimensionJSON = that.content.Model.Queries[0].Dimensions;
            for (var j = 0; j < dimensionJSON.length; j++) {
                that.dimensions.push(dimensionJSON[j]);
            }

            that.facets = [];
            var facetJSON = that.content.Model.Facets;
            for (var i = 0; i < facetJSON.length; i++) {

                that.facets.push({
                    isActive: facetJSON[i].Active,
                    facetId: facetJSON[i].FacetId,
                    dimension: that.getDimensionForID(facetJSON[i].SeriesChart.ScaleDimensions[0].DimensionName)
                });


            }

            that.bindings = {};
            var bindingsJSON = that.content.Bindings;
            for (var l = 0; l < bindingsJSON.length; l++) {
                var bindingJSON = bindingsJSON[l];
                that.bindings[bindingJSON.WidgetId] = that.getFacetForID(bindingJSON.FacetId);
            }
        }

    };

    // =======================================================================
    // perspective search query
    // =======================================================================

    module.PerspectiveSearchQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective query
     */
    module.PerspectiveSearchQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * Creates a perspective search query.
         * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveSearchQuery
         * @param  {Object} properties Configuration object.
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         */
        init: function(properties) {
            properties = properties || {};
            module.Query.prototype.init.apply(this, [properties]);
            this.filter.searchTerms = properties.searchTerms || "*";
            this.resultSetClass = module.PerspectiveSearchResultSet;
        },


        createJsonRequest: function() {
            var template = jsontemplates.getPerspectiveSearchRequest();
            template.Search.SearchTerms = this.filter.searchTerms;
            template.Search.Top = this._top;
            template.Search.Skip = this._skip;
            return template;
        },

        getPerspectiveResults: function(onSuccess, onError) {
            this.getResultSet(onSuccess, onError);
        }

    });

    // =======================================================================
    // perspective search result set
    // =======================================================================

    module.PerspectiveSearchResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class perspective search result set
     */
    module.PerspectiveSearchResultSet.prototype = {

        /**
         *  A perspective.
         *  @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveSearchResultSet
         *  @ignore
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            var that = this;
            that.perspectives = [];
            properties = properties || {};
        },

        getPerspectiveSearchResultSet: function() {
            return this.perspectives;
        },

        setJsonFromResponse: function(data) {
            var that = this;

            var perspectivesJSON = data["ItemLists"][0]["Items"];
            for (var i = 0; i < perspectivesJSON.length; i++) {
                var namedValues = perspectivesJSON[i]["NamedValues"];
                var perspective = {
                    packageId: namedValues[0].Value,
                    perspectiveId: namedValues[0].Value + "/" + namedValues[1].Value,
                    perspectiveDescription: namedValues[3].Value,
                    title: namedValues[2].Value
                };
                that.perspectives.push(perspective);
            }

        }

    };


}(window));
/* source file: impl/inav2/search.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import other package
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    //var datasource = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    // =======================================================================
    // search query
    // =======================================================================

    module.SearchQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class search query
     */
    module.SearchQuery.prototype = jQuery.extend({}, base.SearchQuery.prototype, module.Query.prototype, {

        /**
         * A query that yields results suitable for a simple result list.
         * @constructs sap.bc.ina.api.sina.impl.inav2.SearchQuery
         * @augments {sap.bc.ina.api.sina.base.SearchQuery}
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         * @private
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            module.Query.prototype.init.apply(this, [properties]);
            base.SearchQuery.prototype.init.apply(this, [properties]);
            this.sqlSearch = (properties.sqlSearch === undefined || properties.sqlSearch === true) ? true : false;
            this.attributes = properties.attributes || [];
            properties.orderBy = properties.orderBy || {};
            this.setOrderBy(properties.orderBy);
            this.resultSetClass = module.SearchResultSet;
        },

        /**
         * Adds a response attribute to the search query. The content of this
         * attribute is returned if the search term was found in one of the
         * response attributes.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SearchQuery
         * @instance
         * @param {String|Object} attribute If the argument is a string, it is
         * the name of an attribute of the database view. If it is an object, it can contain
         * the name of the attribute and additional server-side
         * functions, like snippet or highlighting.
         * See {@link sap.bc.ina.api.sina.base.Sina#createSearchQuery} for examples.
         * @returns {Object} this object for method chaining
         */
        addResponseAttribute: function(attribute) {
            this.attributes.push(attribute);
            this._resetResultSet();
            return this;
        },

        createJsonRequest: function() {
            var template = jsontemplates.getSearchRequest();
            template.DataSource = this.filter.dataSource.getDataForRequest();
            if (this.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem) {
                if (this.attributes.length === 0) {
                    throw {
                        message: "Add at least one response attribute to your query"
                    };
                }
                if (this.sqlSearch === true) {
                    // TODO: remove workaround for SPS6. See CSS 0001971234 2013
                    template.Options = ["SqlSearch"];
                }
            }
            var selectedValues = [];
            for (var i = 0; i < this.attributes.length; ++i) {
                var attribute = this.attributes[i];
                if (jQuery.type(attribute) === 'string') {
                    selectedValues.push({
                        Name: attribute,
                        AttributeName: attribute
                    });
                } else if (jQuery.type(attribute) === 'object') {
                    var selectedValue = {
                        Name: attribute.name || attribute.attributeName,
                        AttributeName: attribute.attributeName || attribute.name
                    };
                    if (attribute.highlighted === true) {
                        selectedValue.Function = 'Highlighted';
                    }
                    if (attribute.snippet === true) {
                        selectedValue.Function = 'Snippet';
                    }
                    if (attribute.startPosition !== undefined) {
                        selectedValue.StartPosition = attribute.startPosition;
                    }
                    if (attribute.maxLength !== undefined) {
                        selectedValue.MaxLength = attribute.maxLength;
                    }
                    selectedValues.push(selectedValue);
                }
            }
            template.Search.SelectedValues = selectedValues;
            var searchterms = this.filter.getSearchTerms();
            if (!searchterms) {
                searchterms = '*';
            }
            template.SearchTerms = searchterms;
            template.Search.Top = this._top;
            template.Search.Skip = this._skip;
            template.Search.Filter = this.filter.getDataForRequest();
            template.Search.OrderBy = this._assembleOrderBy();

            return template;
        },

        /**
         * Sets how the result will be ordered.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SearchQuery
         * @instance
         * @param {Object|Array} orderBy If orderBy is an object, it must have the
         * properties 'orderBy' (string) and 'sortOrder' (string).
         * The orderBy property can either be the name of a database attribute that
         * the result will be sorted alphabetically for, or it can be the special
         * '$$score$$' string. The result will then be ordered according to the SAP HANA
         * Score function.
         * This function can also receive an array of these objects for multiple
         * order-by values, for example to order by $$score$$ and then alphabetically
         * for an attribute. The result will then be ordered after the first entry.
         * If two results have the same rank however, they will be ordered after the
         * second order-by value, and so on.
         * @default {orderBy:'$$score$$', sortOrder:'DESC'}
         * See {@link sap.bc.ina.api.sina.base.Sina#createSearchQuery} for examples.
         */
        setOrderBy: function(orderBy) {
            this._resetResultSet();
            this.orderBy = orderBy || {
                orderBy: '$$score$$',
                sortOrder: 'DESC'
            };
        },

        getOrderBy: function() {
            return this.orderBy;
        }
    });

    // =======================================================================
    // search result set
    // =======================================================================

    module.SearchResultSet = function() {
        this.init.apply(this, arguments);
    };


    /**
     * class search result set
     */
    module.SearchResultSet.prototype = {

        /**
         * A result set suitable for a simple result list. An instance of this
         * class will be returned by {@link sap.bc.ina.api.sina.impl.inav2.SearchQuery#getResultSet}
         * @constructs sap.bc.ina.api.sina.impl.inav2.SearchResultSet
         * @private
         * @ignore
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina;
            this.elements = [];
            this.totalcount = 0;
        },

        toString: function(rs) {
            var elements = this.elements;
            var elements2 = [];
            var i;
            for (i = 0; i < elements.length; ++i) {
                var element = elements[i];
                var element2 = {};
                for (var attrName in element) {
                    if (attrName.slice(0, 2) === '$$' || attrName.slice(0, 1) === '_') {
                        continue;
                    }
                    var attrValue = element[attrName];
                    if (!attrValue.label || !attrValue.value) {
                        continue;
                    }
                    var attribute = {
                        label: attrValue.label,
                        value: attrValue.value
                    };
                    element2[attrName] = attribute;
                }
                elements2.push(element2);
            }
            return JSON.stringify(elements2);
        },

        setJsonFromResponse: function(data) {
            /* eslint consistent-this:0 */
            var searchResultSet = this;
            this.elements = [];

            function ResultElementRenderingTemplateSpecification() {
                this.type = "";
                this.platform = "";
                this.technology = "";
                this.width = "";
                this.height = "";
                this.variant = "";
                // this.description = "";
                this.uri = "";
                // this.request = null;
                // this.encodedJSON = "";
            }

            ResultElementRenderingTemplateSpecification.prototype = {

                _fromInaJson: function(inaJson) {
                    this.type = inaJson.Type || "";
                    this.platform = inaJson.Platform || "";
                    this.technology = inaJson.Technology || "";
                    this.width = inaJson.Width || "";
                    this.height = inaJson.Height || "";
                    this.variant = inaJson.Variant || "";
                    // this.description = inaJson.Description || "";
                    this.uri = inaJson.Uri || "";
                }

            };

            function ResultElementRelatedAction() {
                this.type = "";
                this.description = "";
                this.uri = "";
                this.request = null;
                this.encodedJSON = "";
            }

            ResultElementRelatedAction.prototype = {

                _fromInaJson: function(inaJson) {
                    var that = this;
                    that.description = inaJson.Description;
                    that.uri = inaJson.Uri;

                    switch (inaJson.Type) {
                        case "RelatedRequest":
                            that.type = 'Search';
                            var queryProps = {};
                            queryProps.dataSource = searchResultSet.sina.createDataSource();
                            queryProps.dataSource.setJsonFromResponse(inaJson.Request.DataSource);
                            queryProps.system = global.sap.bc.ina.api.sina.getSystem();
                            queryProps.top = 1;
                            that.request = searchResultSet.sina.createSearchQuery(queryProps);
                            that.request.filter.setJsonFromResponse(inaJson.Request.Filter);
                            // mark request without filter condition as invalid
                            if (inaJson.Request.Filter.Selection === undefined) {
                                that.request.invalid = true;
                                that.request.invalidMessage = "Related request '" + that.description + "' is invalid because of missing filter conditions.";
                            }
                            break;
                        case "GeneralUri":
                            that.type = 'Link';
                            that.url = that.uri;
                            break;
                        case "SAPNavigation":
                            that.type = 'Navigation';
                            that.url = that.uri;
                            break;
                            // no default
                    }
                    that.encodedJSON = encodeURIComponent(that);
                }
            };

            function ResultElementAttributeMetaData(resultElementAttribute) {
                this.resultElementAttribute = resultElementAttribute;
                this.correspondingSearchAttributeName = "";
                this.description = "";
                this.isTitle = false;
                this.presentationUsage = [];
                this.displayOrder = null;
                this.semanticObjectType = "";
            }

            ResultElementAttributeMetaData.prototype = {

                _fromInaJson: function(inaAttributeMetaData) {
                    var that = this;
                    that.correspondingSearchAttributeName = inaAttributeMetaData.correspondingSearchAttributeName || "";
                    that.dataType = inaAttributeMetaData.DataType || "";
                    that.description = inaAttributeMetaData.Description || "";
                    that.presentationUsage = inaAttributeMetaData.presentationUsage || [];
                    that.accessUsage = inaAttributeMetaData.accessUsage || [];
                    that.semanticObjectType = inaAttributeMetaData.SemanticObjectType || "";
                    if (inaAttributeMetaData.IsTitle !== undefined) {
                        that.isTitle = inaAttributeMetaData.IsTitle;
                    }
                    that.isKey = inaAttributeMetaData.IsKey;
                    if (that.isTitle) {
                        if (!that.resultElementAttribute.resultElement.title) {
                            that.resultElementAttribute.resultElement.title = that.resultElementAttribute.resultElement.$$DataSourceMetaData$$.getLabel() + ":";
                        }
                        that.resultElementAttribute.resultElement._registerPostProcessor(function() {
                            that.resultElementAttribute.resultElement.title = that.resultElementAttribute.resultElement.title + " " + that.resultElementAttribute.value;
                        });
                    }

                    if (that.isKey) {
                        if (!that.resultElementAttribute.resultElement.key) {
                            that.resultElementAttribute.resultElement.key = that.resultElementAttribute.resultElement.$$DataSourceMetaData$$.key + ":";
                        }
                        that.resultElementAttribute.resultElement._registerPostProcessor(function() {
                            if (that.resultElementAttribute.labelRaw && that.resultElementAttribute.value) {
                                that.resultElementAttribute.resultElement.key = that.resultElementAttribute.resultElement.key + that.resultElementAttribute.labelRaw + '#' + that.resultElementAttribute.value + "/";
                            }
                        });
                    }
                }

            };

            function ResultElementAttribute(resultElement) {
                this.resultElement = resultElement;
                this.$$MetaData$$ = new ResultElementAttributeMetaData(this);
                this.label = "";
                this.labelRaw = "";
                this.value = "";
                this.valueRaw = "";
            }

            ResultElementAttribute.prototype = {

                _fromInaJson: function(inaAttribute) {
                    var that = this;
                    that.labelRaw = this.$$MetaData$$.correspondingSearchAttributeName || inaAttribute.Name || "";
                    that.label = this.$$MetaData$$.description || inaAttribute.Name || "";
                    that.valueRaw = inaAttribute.Value || '';
                    that.value = inaAttribute.ValueFormatted || '';

                },

                toString: function() {
                    //stay compatible with result templates <= SAP HANA SPS 05
                    return this.value;
                }
            };

            function ResultElement() {
                //these members are always provided:
                this.title = "";
                this.$$DataSourceMetaData$$ = {};
                this.$$RelatedActions$$ = {};
                this.$$RenderingTemplateSpecification$$ = {};
                this.$$WhyFound$$ = [];
                this.$$PostProcessors$$ = [];
                //the real result item attributes will be added to
                //this object dynamically
            }

            ResultElement.prototype = {

                _fromInaJson: function(namedValues) {
                    var that = this;
                    var dataSource = null;
                    var inaAttributeMetaData = null;
                    for (var k = 0; k < namedValues.length; ++k) {
                        var namedValue = namedValues[k];
                        switch (namedValue.Name) {
                            case "$$DataSourceMetaData$$":
                                var dataSourceMetaData = namedValue.Value[0];
                                dataSource = searchResultSet.sina.createDataSource(jQuery.extend(true, {}, dataSourceMetaData));
                                that.$$DataSourceMetaData$$ = dataSource;
                                break;
                            case "$$AttributeMetadata$$":
                                for (var m = 0; m < namedValue.Value.length; ++m) {
                                    inaAttributeMetaData = namedValue.Value[m];
                                    if (!that[inaAttributeMetaData.Name]) {
                                        that[inaAttributeMetaData.Name] = new ResultElementAttribute(that);
                                    }
                                    that[inaAttributeMetaData.Name].$$MetaData$$._fromInaJson(inaAttributeMetaData);
                                    that[inaAttributeMetaData.Name].$$MetaData$$.displayOrder = m;
                                }

                                break;
                            case "$$ResultItemAttributes$$":
                                for (var l = 0; l < namedValue.Value.length; ++l) {
                                    var inaAttribute = namedValue.Value[l];
                                    if (!that[inaAttribute.Name]) {
                                        that[inaAttribute.Name] = new ResultElementAttribute(that);
                                    }
                                    that[inaAttribute.Name]._fromInaJson(inaAttribute);
                                }
                                break;
                            case "$$RelatedActions$$":
                                var actions = {};
                                for (var n = 0; n < namedValue.Value.length; ++n) {
                                    var action = namedValue.Value[n];
                                    var sinaAction = new ResultElementRelatedAction();
                                    sinaAction._fromInaJson(action);
                                    actions[action.ID] = sinaAction;
                                }
                                that.$$RelatedActions$$ = actions;
                                break;
                            case "$$RenderingTemplateSpecification$$":
                                for (var o = 0; o < namedValue.Value.length; ++o) {
                                    var template = new ResultElementRenderingTemplateSpecification();
                                    template._fromInaJson(namedValue.Value[o]);
                                    // template = propertiesToLowerCase(template);
                                    if (template.type === "ItemDetails") {
                                        that._detailTemplate = template; //save for later, so no 2nd request is needed
                                    } else {
                                        that.$$RenderingTemplateSpecification$$ = template;
                                    }
                                }
                                break;
                            case "$$WhyFound$$":
                                for (var z = 0; z < namedValue.Value.length; ++z) {
                                    var whyfoundElem = {};
                                    whyfoundElem.label = namedValue.Value[z].Description;
                                    whyfoundElem.labelRaw = namedValue.Value[z].Name;
                                    whyfoundElem.value = namedValue.Value[z].Value;
                                    whyfoundElem.valueHighlighted = whyfoundElem.value;
                                    whyfoundElem.valueRaw = namedValue.Value[z].Value;
                                    that.$$WhyFound$$.push(whyfoundElem);
                                }
                                break;
                            default:
                                // we assume thats a (HANA InA) result element:
                                that[namedValue.Name] = new ResultElementAttribute();
                                that[namedValue.Name].label = namedValue.Name || "";
                                that[namedValue.Name].valueRaw = namedValue.Value || namedValue.ValueFormatted || null;
                                that[namedValue.Name].value = namedValue.ValueFormatted || namedValue.Value || null;
                        }
                    }

                    for (var i = 0; i < this.$$PostProcessors$$.length; i++) {
                        this.$$PostProcessors$$[i]();
                    }

                    var keyStatusConst = base.Sina.prototype.ResultElementKeyStatus;
                    if (this.key) {
                        if (this.key.indexOf(':') === this.key.length - 1) {
                            this.keystatus = keyStatusConst.NO_VALUE;
                        } else {
                            this.keystatus = keyStatusConst.OK;
                        }

                    } else {
                        this.keystatus = keyStatusConst.NO_KEY;
                        this.key = '';
                    }
                },

                _registerPostProcessor: function(fn) {
                    this.$$PostProcessors$$.push(fn);
                }


            };

            function _prepareDetails(element) {
                // TODO: remove service workaround: if there is no detail query -> try to create
                if (element._detailTemplate && !element.$$RelatedActions$$.$$DETAILS$$) {
                    element.$$RelatedActions$$.$$DETAILS$$ = {
                        request: searchResultSet.sina.createSearchQuery(),
                        description: '',
                        encodedJSON: '',
                        type: 'Search',
                        uri: ''
                    };
                }
                // End of workaround
                // prefill result set of detail query
                if (element._detailTemplate && element.$$RelatedActions$$.$$DETAILS$$) {
                    var detailResultSet = new module.SearchResultSet({
                        sina: searchResultSet.sina
                    });
                    detailResultSet.elements[0] = jQuery.extend(true, {}, element);
                    detailResultSet.elements[0].$$RenderingTemplateSpecification$$ = element._detailTemplate;
                    detailResultSet.totalcount = 1;
                    delete detailResultSet.elements[0].$$RelatedActions$$.$$DETAILS$$;
                    element.$$RelatedActions$$.$$DETAILS$$.request.resultSet = detailResultSet;
                    return detailResultSet.elements[0];
                }
                // return function(onSuccess,onError){
                //     if(this._detailResultSet){
                //         if(onSuccess){
                //             onSuccess(this._detailResultSet);
                //         }
                //     }
                //     else{
                //         this.$$RelatedActions$$.$$DETAILS$$.request.getResultSet(onSuccess,onError);
                //     }
                // };
                return {};
            }

            var itemLists = {};
            if (!data.ItemLists) {
                return {};
            }
            for (var i = 0; i < data.ItemLists.length; i++) {
                itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                if (data.ItemLists[i].Name.toLowerCase() === "searchresult") {
                    this.totalcount = data.ItemLists[i].TotalCount.Value;
                }
            }

            var axis0;
            if (data && data.Grids && data.Grids[0] && data.Grids[0].Axes && data.Grids[0].Axes[0]) {
                axis0 = data.Grids[0].Axes[0];
            } else {
                return {};
            }
            // only axes 0 is relevant for abap search results
            for (var j = 0; j < axis0.Tuples.length; j++) {
                var tuple = axis0.Tuples[j];
                if (tuple === undefined) {
                    continue;
                }
                var element = new ResultElement();
                for (var c = tuple.length - 1; c >= 0; c--) {
                    // for (var c = 0; c < tuple.length; c++) {
                    var dimension = axis0.Dimensions[c];
                    var tupleValueForDimension = tuple[c];
                    var itemlist = itemLists[dimension.ItemListName];
                    var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                    element._fromInaJson(namedValues);
                }

                if (axis0 && axis0.Dimensions[1]) {
                    var dimensionMetaData = axis0.Dimensions[1];
                    var itemlistMetaData = itemLists[dimensionMetaData.ItemListName];
                    var pointer2MyMetaData = tuple[1];
                    if (itemlistMetaData && itemlistMetaData.Items && itemlistMetaData.Items[pointer2MyMetaData]) {
                        var namedValuesAttributeMetadata = itemlistMetaData.Items[pointer2MyMetaData].NamedValues[2];
                        if (namedValuesAttributeMetadata) {
                            element = this._postProcess4WhyFound(element, namedValuesAttributeMetadata.Value);
                        }
                    }
                }

                var detail = _prepareDetails(element);
                this._postProcessRelatedAction(element);
                if (detail) {
                    this._postProcessRelatedAction(detail);
                }
                this.elements.push(element);

                // update metadata to metadataservice
                var datasource = element.$$DataSourceMetaData$$;
                if (datasource && datasource.getObjectName && datasource.getObjectName().value !== "$$DataSources$$" && datasource.getObjectName().value !== "$$All$$") {
                    this.sina.setBusinessObjectMetaDataSync(datasource, element);
                }
            }
            return {};
        },

        /**
         * Returns the elements of the result set.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SearchResultSet
         * @instance
         * @since SAP HANA SPS 06
         * @return {Array} A list of result set elements.
         * @example
         * var query = sap.bc.ina.api.sina.createSearchQuery({
            dataSource          : { schemaName  : "SYSTEM",
                                    objectName  : "J_EPM_PRODUCT" },
            attributes          : [ "PRODUCT_ID",
                                    "TEXT",
                                    "CATEGORY",
                                    "PRICE",
                                    "CURRENCY_CODE"],
            searchTerms         : "basic",
            top                 : 5
           });
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getElements();
         * // contents of elements (shortened):
         * [{ "PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1000","value":"HT-1000"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 15 with 1,7GHz - 15","value":"Notebook Basic 15 with 1,7GHz - 15"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"956.00","value":"956.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // second result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1001","value":"HT-1001"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 17 with 1,7GHz - 17","value":"Notebook Basic 17 with 1,7GHz - 17"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1249.00","value":"1249.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // third result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1002","value":"HT-1002"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 18 with 1,7GHz - 18","value":"Notebook Basic 18 with 1,7GHz - 18"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1570.00","value":"1570.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"USD","value":"USD"}},
         *     // fourth result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1003","value":"HT-1003"},
         *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 19 with 1,7GHz - 19","value":"Notebook Basic 19 with 1,7GHz - 19"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"1650.00","value":"1650.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
         *     // fifth result item:
         *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-8000","value":"HT-8000"},
         *     "TEXT":{"label":"TEXT","valueRaw":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM","value":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM"},
         *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
         *     "PRICE":{"label":"PRICE","valueRaw":"799.00","value":"799.00"},
         *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}}
         *  ]
         */
        getElements: function() {
            return this.elements;
        },

        _postProcessRelatedAction: function(element) {
            if (!element.$$RelatedActions$$) {
                return;
            }
            for (var relatedActionID in element.$$RelatedActions$$) {
                var relatedAction = element.$$RelatedActions$$[relatedActionID];
                //Postprocessing
                if (relatedAction.type === "Search") {
                    global.sap.bc.ina.api.sina._postprocess(relatedAction, element.title);
                }
            }
        },

        _postProcess4WhyFound: function(element, metaAttributes) {
            if (element.$$WhyFound$$ && element.$$WhyFound$$.length > 0) {
                var i = element.$$WhyFound$$.length;
                while (i--) {
                    //                    var hasResponseAttribute = false;
                    if (element[element.$$WhyFound$$[i].labelRaw] !== undefined && metaAttributes !== undefined) {
                        ////                        value = element.$$WhyFound$$[i].value.replace(/<b>/g, '<div class="InA-highlighter" data-sap-widget="highlighter">').replace(/<\/b>/g, '</div">');
                        //                        value = element.$$WhyFound$$[i].value;
                        //                        element[element.$$WhyFound$$[i].labelRaw].value    = value;
                        //                        element[element.$$WhyFound$$[i].labelRaw].valueRaw = value;
                        //                        element.$$WhyFound$$.splice(i,1);
                        var j = metaAttributes.length;
                        while (j--) {
                            // The WhyFound attributes are requst attributes. Try to get its corresponding response attribute
                            if (metaAttributes[j].Name === element.$$WhyFound$$[i].labelRaw && metaAttributes[j].correspondingSearchAttributeName) {
                                element.$$WhyFound$$[i].labelRaw = metaAttributes[j].correspondingSearchAttributeName;
                                //                                hasResponseAttribute = true;
                            }
                        }
                    }
                    //                    if (!hasResponseAttribute){
                    //                        element.$$WhyFound$$[i].label = element.$$WhyFound$$[i].label + " (modeling error: add missing corresponding response attribute!)";
                    //                    }
                }
            }
            return element;
        }
    };


}(window));
/* source file: impl/inav2/chart.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* global jQuery, window */
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package hugo
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    //var datasource = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    // =======================================================================
    // helper: result set parser
    // =======================================================================

    var ResultSetParser = module.ResultSetParser = function() {
        this.init.apply(this, arguments);
    };

    ResultSetParser.prototype = {

        init: function(options) {
            this.resultSet = options.resultSet;
        },

        parse: function() {
            /* eslint no-use-before-define:0 */
            // enhance result set:
            // -> create link to item lists in dimensions of axes
            this.enhance(this.resultSet);

            // get reference to grid,row axis,col axis
            var grid = this.resultSet.Grids[0];
            var rowAxis = grid.Axes[0];
            var colAxis = grid.Axes[1];

            // key function for getting key of an item
            // (key needed for insertion into tree)
            var keyFunction = function(item) {
                return item.__key;
            };

            // parse a name value pair
            var parseNamedValue = function(namedValue) {
                var value;
                var name;
                var complexValue;
                for (var prop in namedValue) {
                    switch (prop) {
                        case 'Name':
                            name = namedValue[prop];
                            break;
                        case 'Value':
                            value = namedValue[prop];
                            break;
                        default:
                            if (!complexValue) {
                                complexValue = {};
                            }
                            complexValue[prop] = namedValue[prop];
                    }
                }
                if (complexValue) {
                    complexValue.Value = value;
                    return {
                        name: name,
                        value: complexValue
                    };
                } else {
                    return {
                        name: name,
                        value: value
                    };
                }
            };

            // format function
            var formatFunction = function(item) {
                if (!item.NamedValues) {
                    return item;
                }
                var obj = {};
                for (var i = 0; i < item.NamedValues.length; ++i) {
                    var namedValue = item.NamedValues[i];
                    var parsedNamedValue = parseNamedValue(namedValue);
                    obj[parsedNamedValue.name] = parsedNamedValue.value;
                }
                return obj;
            };

            // create new tree
            var tree = new Tree({
                keyFunction: keyFunction,
                formatFunction: formatFunction
            });

            // loop at all cells and add cell to result tree
            for (var i = 0; i < grid.Cells.length; ++i) {

                var cell = grid.Cells[i];

                var rowIndex = cell.Index[0];
                var rowItems = this.resolve(rowAxis, rowIndex);
                //                var rowItemsDebug = rowItems.map(keyFunction);

                var colIndex = cell.Index[1];
                var colItems = this.resolve(colAxis, colIndex);
                //                var colItemsDebug = colItems.map(keyFunction);
                colItems = [jQuery.extend({}, colItems[0])];

                // add cell info to col item
                colItems[0].cell = cell;

                // assemble tree path = rowItems + colItems
                var treePath = rowItems;
                treePath.push.apply(treePath, colItems);

                // insert
                tree.insert(treePath);

            }

            return tree;
        },

        resolve: function(axis, index) {
            var items = [];
            if (axis.Tuples.length === 0) {
                return items;
            }
            var tuples = axis.Tuples[index];
            for (var i = 0; i < tuples.length; ++i) {
                var itemIndex = tuples[i];
                var item = axis.Dimensions[i].ItemList.Items[itemIndex];
                item.__key = itemIndex;
                items.push(item);
            }
            return items;
        },

        enhance: function(resultSet) {

            // create dictionary with item lists
            var itemListByName = {};
            for (var i = 0; i < resultSet.ItemLists.length; ++i) {
                var itemList = resultSet.ItemLists[i];
                itemListByName[itemList.Name] = itemList;
            }

            // loop at all dimensions and set link to item list
            for (var h = 0; h < resultSet.Grids.length; ++h) {
                var grid = resultSet.Grids[h];
                for (var j = 0; j < grid.Axes.length; ++j) {
                    var axis = grid.Axes[j];
                    for (var k = 0; k < axis.Dimensions.length; ++k) {
                        var dimension = axis.Dimensions[k];
                        dimension.ItemList = itemListByName[dimension.ItemListName];
                    }
                }
            }

        }

    };

    // =======================================================================
    // helper: tree for result set parser
    // =======================================================================

    var Tree = function() {
        this.init.apply(this, arguments);
    };

    Tree.prototype = {

        init: function(options) {

            // create root tree element
            this.root = {
                data: "root",
                subTree: {},
                children: []
            };

            // set key function
            if (options && options.keyFunction) {
                this.keyFunction = options.keyFunction;
            } else {
                this.keyFunction = function(obj) {
                    return obj;
                };
            }

            // set format function
            if (options && options.formatFunction) {
                this.formatFunction = options.formatFunction;
            } else {
                this.formatFunction = function(obj) {
                    return obj;
                };
            }

        },

        insert: function(path) {
            var parent = this.root;
            for (var i = 0; i < path.length; ++i) {
                var pathElement = path[i];
                var key = this.keyFunction(pathElement);
                var dataFormatted = this.formatFunction(pathElement);
                if (!parent.subTree.hasOwnProperty(key)) {
                    var node = {
                        subTree: {},
                        children: [],
                        data: pathElement,
                        dataFormatted: dataFormatted
                    };
                    parent.subTree[key] = node;
                    parent.children.push(node);
                }
                parent = parent.subTree[key];
            }
        },

        toString: function() {
            var stringStream = [];
            this.toStringHelper(this.root, [], stringStream);
            return stringStream.join("");
        },

        toStringHelper: function(tree, path, stringStream) {

            var pathElement = null;
            if (tree === this.root) {
                pathElement = tree.data;
            } else {
                pathElement = this.keyFunction(tree.data);
            }
            path.push(pathElement);


            var hasChildren = false;
            for (var child in tree.subTree) {
                if (tree.subTree.hasOwnProperty(child)) {
                    hasChildren = true;
                    var subTree = tree.subTree[child];
                    var pathCopy = path.slice(0);
                    this.toStringHelper(subTree, pathCopy, stringStream);
                }
            }

            if (!hasChildren) {
                stringStream.push(path.toString() + "\n");
            }
        }
    };

    // =======================================================================
    // ABAP InA V2 chart query
    // =======================================================================

    module.ABAPChartQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class chart query
     */
    module.ABAPChartQuery.prototype = jQuery.extend({}, base.ChartQuery.prototype, module.Query.prototype, {

        /**
         * A query that yields results suitable for simple chart controls, like
         * pie or bar charts.
         * @since SAP HANA SPS 06
         * @constructs sap.bc.ina.api.sina.impl.inav2.ChartQuery
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         * @augments {sap.bc.ina.api.sina.base.ChartQuery}
         * @private
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            properties = properties || {};
            module.Query.prototype.init.apply(this, [properties]);
            base.ChartQuery.prototype.init.apply(this, [properties]);
            this.dimensions = [];
            this.attributeLimit = properties.attributeLimit || 1000;
            if (jQuery.isArray(properties.dimensions)) {
                this.dimensions = properties.dimensions;
            } else if (properties.dimension) {
                this.dimensions.push(properties.dimension);
            }
            this.resultSetClass = module.ABAPChartResultSet;
        },

        getTitle: function() {
            if (this.resultSet && this.resultSet.title) {
                return this.resultSet.title;
            } else {
                return 'unkown title';
            }
        },

        addDimension: function(dimension) {
            this.dimensions.push(dimension);
        },

        setAttributeLimit: function(limit) {
            this.attributeLimit = limit;
        },

        createJsonRequest: function() {
            var template = jsontemplates.getABAPChartRequest();
            template.DataSource = this.filter.dataSource.getDataForRequest();
            template.Search.SearchTerms = this.filter.getSearchTerms();
            template.Search.Filter = this.filter.getDataForRequest();
            template.Search.Top = this.getTop();
            template.Search.Skip = this.getSkip();
            template.Facets.Attributes = this.dimensions;
            template.Facets.MaxNumberOfReturnValues = this.attributeLimit;
            return template;
        }


    });
    // =======================================================================
    // ABAP InA V2 chart result set
    // =======================================================================
    module.ABAPChartResultSet = function() {
        this.init.apply(this, arguments);
    };

    module.ABAPChartResultSet.prototype = {
        init: function(properties) {
            this.properties = properties ||  {};
            this.dimensions = [];
            this.elements = [];
        },

        setJsonFromResponse: function(data) {
            var perspective = new module.Perspective(this.properties);
            perspective.setJsonFromResponse(data);
            for (var i = 0; i < perspective.chartFacets.length; i++) {
                this.dimensions.push(perspective.chartFacets[i].dimension);
                this.elements.push.apply(this.elements, perspective.chartFacets[i].query.resultSet.elements);
                this.title = perspective.chartFacets[i].title;
            }
        }
    };

    // =======================================================================
    // HANA InA V2 chart query
    // =======================================================================

    module.ChartQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class chart query
     */
    module.ChartQuery.prototype = jQuery.extend({}, base.ChartQuery.prototype, module.Query.prototype, {

        /**
         * A query that yields results suitable for simple chart controls, like
         * pie or bar charts.
         * @since SAP HANA SPS 06
         * @constructs sap.bc.ina.api.sina.impl.inav2.ChartQuery
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         * @augments {sap.bc.ina.api.sina.base.ChartQuery}
         * @private
         * @param  {Object} properties Configuration properties for the instance.
         */
        init: function(properties) {
            properties = properties || {};
            module.Query.prototype.init.apply(this, [properties]);
            base.ChartQuery.prototype.init.apply(this, [properties]);
            this.dimensions = {};
            this.dimensions.CustomDimension1 = {
                Axis: "Columns",
                Name: "CustomDimension1",
                Members: []
            };
            properties.dimensions = properties.dimensions || {};
            if (jQuery.type(properties.dimensions) === 'array') {
                for (var i = 0; i < properties.dimensions.length; i++) {
                    this.addDimension(properties.dimensions[i]);
                }
            } else if (jQuery.type(properties.dimensions) === 'string' || jQuery.type(properties.dimensions) === 'object') {
                this.addDimension(properties.dimensions);
            }
            properties.measures = properties.measures || {};
            if (jQuery.type(properties.measures) === 'array') {
                for (var j = 0; j < properties.measures.length; j++) {
                    this.addMeasure(properties.measures[j]);
                }
            } else if (jQuery.type(properties.measures) === 'object') {
                this.addMeasure(properties.measures);
            }
            this.resultSetClass = module.ChartResultSet;
        },

        createJsonRequest: function() {
            var template = jsontemplates.getChartRequest();
            template.DataSource = this.filter.dataSource.getDataForRequest();
            template.SearchTerms = this.filter.getSearchTerms();
            template.Analytics.Definition.Filter = this.filter.getDataForRequest();
            template.Analytics.Definition.Dimensions = [];
            for (var dimension in this.dimensions) {
                template.Analytics.Definition.Dimensions.push(this.dimensions[dimension]);
            }
            return template;
        },

        /**
         * Adds a count measure for the given dimension to the chart query.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
         * @instance
         * @param  {string} dimension The dimension that the count is computed for.
         * @return {sap.bc.ina.api.sina.impl.inav2.ChartQuery} The chart query to allow chained method calls.
         */
        count: function(dimension) {
            this.addMeasure({
                name: dimension,
                aggregationFunction: 'COUNT'
            });
            return this;
        },

        /**
         * Adds one of the following aggregations to a dimension: 'COUNT', 'AVG', 'SUM', 'MIN', 'MAX'
         * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
         * @instance
         * @since SAP HANA SPS 06
         * @param {Object} properties The configuration object can have the following properties:p
         * name, aggregationFunction, sortOrder, top.
         * @example
         * var query = sina.createChartQuery()
         *  .dataSource({ "schemaName"  : {"value":"SYSTEM"},
         *                "objectName"  : {"value":"J_EPM_PRODUCT"})
         * .addDimension("CATEGORY")
         * .addMeasure({name:"CATEGORY",aggregationFunction:"COUNT"});
         * var resultSet = query.getResultSetSync();
         * @returns {Object} this object for method chaining
         */
        addMeasure: function(properties) {
            if (jQuery.isEmptyObject(properties)) {
                return {};
            }

            var member;
            if (properties.aggregationFunction.toUpperCase() === 'COUNT' || properties.aggregationFunction.toUpperCase() === 'AVG') {
                member = this._createAggregationDimension(properties.aggregationFunction, properties.name, properties.aggregationFunction, properties.sortOrder || undefined, properties.top || undefined);
            } else {
                member = this._createAggregationDimension(properties.aggregationFunction, '', properties.name, properties.sortOrder, properties.top);
                delete member.AggregationDimension;
                delete member.Name;
                delete member.SortOrder;
            }
            this.dimensions.CustomDimension1.Members.push(member);
            return this;
        },

        /**
         * Adds a dimension to the query.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
         * @instance
         * @since SAP HANA SPS 06
         * @param {String|Object} dimension The name of the dimension. This is the same as the name of the corresponding database attribute.
         * If it is an object, the name and values of this object must be the same as the functions parameters.
         * @param {int} sortOrder Sort order of this dimension. 1 for ascending, 2 for descending.
         * Default is 1.
         * @param {int} top How many members does the dimension have? The default value is 5.
         * @example <caption>Plain function call</caption>
         * var query = sina.createChartQuery()
         * .addDimension("CATEGORY",1,5)
         * @example <caption>Call with properties object</caption>
         * var query = sina.createChartQuery({
         *     dimensions: [{name: "YEAR", sortOrder: 1, top:5}]
         * });
         * @returns {Object} this object for method chaining
         */
        addDimension: function(dimension, sortOrder, top) {
            if (jQuery.type(dimension) === 'object') {
                if (jQuery.isEmptyObject(dimension)) {
                    return {};
                }
                this.dimensions[dimension.name] = this._createDimension(dimension.name, null, dimension.sortOrder, dimension.top);
            } else if (jQuery.type(dimension) === 'string') {
                if (!dimension) {
                    return {};
                }
                this.dimensions[dimension] = this._createDimension(dimension, null, sortOrder, top);
            }
            return this;
        },

        _createDimension: function(dimension, axis, sortOrder, top) {
            return {
                "Axis": axis || "Rows",
                "Name": dimension,
                "SortOrder": sortOrder || 1,
                "Top": top || 5
            };
        },

        /**
         * Creates an aggregation for a dimension.
         * @private
         * @ignore
         * @param  {String} aggregationFunction Type of aggregation to be created. The default value is SUM.
         * @param  {String} aggregationDimension   Dimension that the aggregation is created for.
         * @param  {String} name        Name of the aggregation to be created.
         * @param  {int}    sortOrder   Sort order of the aggregation dimension. 1 for ascending, 2 for descending.
         * @return {Object}             An object suitable for an INA request.
         */
        _createAggregationDimension: function(aggregationFunction, aggregationDimension, name, sortOrder) {
            return {
                "Aggregation": aggregationFunction,
                "AggregationDimension": aggregationDimension,
                "MemberOperand": {
                    "AttributeName": "Measures",
                    "Comparison": "=",
                    "Value": name
                },
                "Name": name,
                "SortOrder": sortOrder || 2
            };
        }

    });

    // =======================================================================
    // chart result set
    // =======================================================================

    module.ChartResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class chart result set
     */
    module.ChartResultSet.prototype = {

        /**
         * A result set that yields elements suitable for simple chart controls, like
         * pie or bar charts.
         * @since SAP HANA SPS 06
         * @constructs sap.bc.ina.api.sina.impl.inav2.ChartResultSet
         * @private
         * @ignore
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            this.type = properties.type;
            this.elements = [];
            this.sina = properties.sina;
        },

        /**
         * Creates filter conditions for simple charts based on named values.
         * It also decides whether the element sets a filter range or an 'equals' filter.
         * There are the following cases:
         * 1) Value1 and Value2 both have values that are not the empty string:
         * It is a range with upper and lower boundary.
         * 2) Value2 has no value:
         * It is not a range but an equals ("=") filter condition.
         * 3) Either Value1 or Value2 have an empty string ("") as value:
         * It is a range with only one boundary, upper or lower.
         * @private
         * @ignore
         * @param  {object} element     The chart element that the filter condition is added to.
         * @param  {object} namedValues Server side data.
         * @param  {object} metadata    Server side meta data.
         */
        _parseNamedValues: function(element, namedValues, metadata) {
            var that = this;

            for (var i = 0; i < namedValues.length; i++) {
                var name = namedValues[i].Name;
                var value = namedValues[i].Value;
                element.label = namedValues[i].ValueFormatted;
                element.labelRaw = namedValues[i].Value;
                switch (name) {
                    case '$$DataSource$$':
                        that._parseNamedValuesForDataSource(element, value);
                        break;
                    case '$$AttributeValue$$':
                        that._parseNamedValuesForRange(element, value, metadata);
                        break;
                        // no default
                }

            }
        },

        _parseNamedValuesForRange: function(element, values, metadata) {
            var valueIDRaw,
                value1,
                value2;

            for (var d = 0; d < values.length; ++d) {
                var namedValue = values[d];
                switch (namedValue.Name) {
                    case "ValueID":
                        element.label = namedValue.ValueFormatted;
                        valueIDRaw = namedValue.Value;
                        break;
                    case "Value1":
                        if (metadata.Cube.ObjectName && (namedValue.Value !== undefined)) {
                            value1 = this.sina.createFilterCondition(metadata.Cube.ObjectName, ">=", namedValue.Value, metadata.Cube.Description, namedValue.ValueFormatted, namedValue.ValueFormatted);
                        }
                        break;
                    case "Value2":
                        if (metadata.Cube.ObjectName && (namedValue.Value !== undefined)) {
                            value2 = this.sina.createFilterCondition(metadata.Cube.ObjectName, "<=", namedValue.Value, metadata.Cube.Description, namedValue.ValueFormatted, namedValue.ValueFormatted);
                        }
                        break;
                    case "Order":
                        break;
                        // no default
                }
            }
            if (valueIDRaw) {
                if (value1 && value2) {
                    // 1) range
                    var group = this.sina.createFilterConditionGroup();
                    group.setOperator("AND");
                    group.setLabel(element.label);
                    if (value1.value) {
                        // 3) upper boundary of the range
                        group.addCondition(value1);
                    }
                    if (value2.value) {
                        // 3) lower boundary of the range
                        group.addCondition(value2);
                    }
                    element.labelRaw = group;
                } else if (value1 && value1.value && (!value2)) {
                    // 2) not a range
                    value1.operator = '=';
                    element.labelRaw = value1;
                } else if (value2 && value2.value && (!value1)) {
                    // 2) not a range
                    value2.operator = '=';
                    element.labelRaw = value2;
                }
            }
        },

        // DataSource chart (category tree)
        _parseNamedValuesForDataSource: function(element, values) {

            element.dataSource = this.sina.createDataSource();
            for (var d = 0; d < values.length; ++d) {
                var namedValue = values[d];
                switch (namedValue.Name) {
                    case "ObjectName":
                        var label = namedValue.ValueFormatted;
                        element.dataSource.setLabel(label);
                        element.dataSource.setObjectName(namedValue.Value, namedValue.ValueFormatted);
                        break;
                    case "PackageName":
                        element.dataSource.setPackageName(namedValue.Value, namedValue.ValueFormatted);
                        break;
                    case "SchemaName":
                        element.dataSource.setSchemaName(namedValue.Value, namedValue.ValueFormatted);
                        break;
                    case "Type":
                        element.dataSource.setType(namedValue.Value, namedValue.ValueFormatted);
                        break;
                    default:
                        element[namedValue.Name] = namedValue.Value;
                        break;
                }
            }
        },

        setJsonFromResponse: function(data) {

            this.elements = [];
            var metadata;
            if (data.Metadata) {
                metadata = data.Metadata;
            }
            if (data.ResultSet) {
                data = data.ResultSet;
            }
            var itemLists = {};
            for (var i = 0; i < data.ItemLists.length; i++) {
                itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
            }

            for (var a = 0; a < data.Grids.length; a++) {
                var axes = data.Grids[a].Axes;
                var cells = data.Grids[a].Cells;
                for (var cellIndex = 0; cellIndex < cells.length; ++cellIndex) {
                    //one dimension chart
                    if (axes[0].Dimensions.length === 1) {
                        var cell = cells[cellIndex];
                        var element = {
                            valueRaw: cell.Value || cell.ValueFormatted || null,
                            value: cell.ValueFormatted || cell.Value || null
                        };
                        // only axes 0 is relevant for chart results
                        for (var j = 0; j < 1; j++) {
                            var cellIndexValue = cell.Index[j];
                            var tuple = axes[j].Tuples[cellIndexValue];
                            if (tuple === undefined) {
                                continue;
                            }
                            for (var c = 0; c < tuple.length; c++) {
                                var dimension = axes[j].Dimensions[c];
                                var tupleValueForDimension = tuple[c];
                                var itemlist = itemLists[dimension.ItemListName];
                                var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                                this._parseNamedValues(element, namedValues, metadata);
                            }
                        }
                        this.elements.push(element);
                    }

                }
            }

        },

        /**
         * Returns the elements of the result set.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartResultSet
         * @instance
         * @since SAP HANA SPS 06
         * @return {Array} A list of result set elements.
         * @example
         * var query = sap.bc.ina.api.sina.createChartQuery()
         * .dataSource({ schemaName : "SYSTEM",
         *               objectName : "J_EPM_PRODUCT"
         *  })
         * .addDimension("CATEGORY")
         * .addMeasure({ name : "CATEGORY",
         *               aggregationFunction : "COUNT"
         * }); //end of query
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getElements();
         * // contents of elements:
         * [
            {
              "label": "Others",
              "labelRaw": "Others",
              "value": "13",
              "valueRaw": 13
            },
            {
              "label": "Notebooks",
              "labelRaw": "Notebooks",
              "value": "10",
              "valueRaw": 10
            },
            {
              "label": "Flat screens",
              "labelRaw": "Flat screens",
              "value": "9",
              "valueRaw": 9
            },
            {
              "label": "Software",
              "labelRaw": "Software",
              "value": "8",
              "valueRaw": 8
            },
            {
              "label": "Electronics",
              "labelRaw": "Electronics",
              "value": "5",
              "valueRaw": 5
            }
          ]
         */
        getElements: function() {
            return this.elements;
        }
    };


    // =======================================================================
    // group bar chart query
    // =======================================================================

    module.GroupBarChartQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class group bar chart query
     */
    module.GroupBarChartQuery.prototype = jQuery.extend({}, module.ChartQuery.prototype, {

        /**
         * A query that yields results suitable for a grouped bar chart control.
         * @constructs sap.bc.ina.api.sina.impl.inav2.GroupBarChartQuery
         * @augments {sap.bc.ina.api.sina.impl.inav2.ChartQuery}
         * @private
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            module.ChartQuery.prototype.init.apply(this, [properties]);
            this.resultSetClass = module.GroupBarChartResultSet;
        }
    });

    // =======================================================================
    // group bar chart result set
    // =======================================================================

    module.GroupBarChartResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class goruped bar chart result set
     */
    module.GroupBarChartResultSet.prototype = {

        /**
         * A result set that yields elements suitable for a grouped bar chart.
         * @since SAP HANA SPS 06
         * @constructs sap.bc.ina.api.sina.impl.inav2.GroupBarChartResultSet
         * @private
         * @ignore
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            this.elements = [];
        },

        setJsonFromResponse: function(data) {
            var that = this;
            this.elements = [];
            var resultSetParser = new ResultSetParser({
                resultSet: data
            });
            var tree = resultSetParser.parse();

            function parseSubTree(subTree, parentElem) {
                for (var itemName in subTree) {
                    var item = subTree[itemName];
                    var elem = {
                        label: item.data.NamedValues[0].ValueFormatted,
                        value: []
                    };
                    if (item.data.cell) {
                        elem.value = {
                            value: item.data.cell.ValueFormatted,
                            valueRaw: item.data.cell.Value
                        };
                    }
                    if (parentElem) {
                        parentElem.value.push(elem);
                    } else {
                        that.elements.push(elem);
                    }
                    if (item.subTree) {
                        parseSubTree(item.subTree, elem);
                    }
                }
            }
            parseSubTree(tree.root.subTree);

        },

        /**
         * Returns the elements of the result set.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.GroupBarChartResultSet
         * @instance
         * @since SAP HANA SPS 06
         * @return {Array} A list of result set elements.
         * @example
         * var query = sap.bc.ina.api.sina.createGroupBarChartQuery();
         * query.dataSource({ schemaName : "SYSTEM",
         *                    objectName : "J_EPM_PRODUCT"
         * });
         * query.addDimension('CURRENCY_CODE');
         * query.addDimension('CATEGORY');
         * query.count('PRODUCT_ID');
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getELements();
         * // contents of elements:
         * [
            {
              "label": "EUR",
              "value": [
                {
                  "label": "Notebooks",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "6",
                        "valueRaw": 6
                      }
                    }
                  ]
                },
                {
                  "label": "Others",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "5",
                        "valueRaw": 5
                      }
                    }
                  ]
                },
                {
                  "label": "Software",
                  "value": [
                    {
                      "label": "COUNT",
                      "value": {
                        "value": "3",
                        "valueRaw": 3
                      }
                    }
                  ]
                }
              ]
            }
            ]
         */
        getElements: function() {
            return this.elements;
        }
    };

    // =======================================================================
    // line chart query
    // =======================================================================

    module.LineChartQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class line chart query
     */
    module.LineChartQuery.prototype = jQuery.extend({}, module.ChartQuery.prototype, {

        /**
         * A query that yields results suitable for a line chart control.
         * @constructs sap.bc.ina.api.sina.impl.inav2.LineChartQuery
         * @augments {sap.bc.ina.api.sina.impl.inav2.ChartQuery}
         * @private
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            module.ChartQuery.prototype.init.apply(this, [properties]);
            this.resultSetClass = module.LineChartResultSet;
        }
    });

    // =======================================================================
    // line chart result set
    // =======================================================================

    module.LineChartResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class line chart result set
     */
    module.LineChartResultSet.prototype = jQuery.extend({}, module.GroupBarChartResultSet.prototype, {

        /**
         * A result set that yields elements suitable for a line chart.
         * @since SAP HANA SPS 06
         * @constructs sap.bc.ina.api.sina.impl.inav2.LineChartResultSet
         * @augments {sap.bc.ina.api.sina.impl.inav2.GroupBarChartResultSet}
         * @private
         * @ignore
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            properties = properties || {};
            this.elements = [];
        },

        setJsonFromResponse: function(data) {
            var that = this;
            this.elements = [];
            var resultSetParser = new ResultSetParser({
                resultSet: data
            });
            var tree = resultSetParser.parse();

            //create line chart result format
            function parseSubTree(subTree, parentElem) {
                for (var dimensionLineItemName in subTree) {
                    var dimensionLineItem = subTree[dimensionLineItemName];
                    var elem = {
                        label: dimensionLineItem.data.NamedValues[0].ValueFormatted,
                        value: []
                    };
                    for (var dimensionXItemName in dimensionLineItem.subTree) {
                        var dimensionXItem = dimensionLineItem.subTree[dimensionXItemName];
                        var point = {
                            x: dimensionXItem.data.NamedValues[0].ValueFormatted
                        };
                        for (var measureYItemName in dimensionXItem.subTree) {
                            var measureYItem = dimensionXItem.subTree[measureYItemName];
                            point.y = measureYItem.data.cell.Value;
                        }
                        elem.value.push(point);
                    }
                    that.elements.push(elem);
                }
            }
            parseSubTree(tree.root.subTree);
        },

        /**
         * Returns the elements of the result set.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.LineChartResultSet
         * @instance
         * @since SAP HANA SPS 06
         * @return {Array} A list of result set elements.
         * @example
         * var queryProperties = {
         *     dataSource      : { schemaName  : "SYSTEM",
                                   objectName  : "J_EPM_PRODUCT"
                                 },
               dimensionX      : {name: 'CATEGORY'},
               dimensionLine   : {name: 'CURRENCY_CODE'},
               measureY        : {name: 'PRODUCT_ID', aggregationFunction: 'COUNT'}
           };
           query = sap.bc.ina.api.sina.createLineChartQuery(queryProperties);
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getEements();
         * // contents of elements (shortened):
         * [
              {
                "label": "EUR",
                "value": [
                  {
                    "x": "Notebooks",
                    "y": 6
                  },
                  {
                    "x": "Others",
                    "y": 5
                  },
                  {
                    "x": "Software",
                    "y": 3
                  },
                  {
                    "x": "Speakers",
                    "y": 3
                  },
                  {
                    "x": "Electronics",
                    "y": 2
                  },
                  {
                    "x": "Flat screens",
                    "y": 2
                  },
                  {
                    "x": "Laser printers",
                    "y": 2
                  },
                  {
                    "x": "Mice",
                    "y": 2
                  },
                  {
                    "x": "PC",
                    "y": 2
                  },
                  {
                    "x": "Workstation ensemble",
                    "y": 2
                  }
                ]
              },
              {
                "label": "USD",
                "value": [
                  {
                    "x": "Others",
                    "y": 4
                  },
                  {
                    "x": "Flat screens",
                    "y": 2
                  },
                  {
                    "x": "Handhelds",
                    "y": 2
                  },
                  {
                    "x": "High Tech",
                    "y": 2
                  },
                  {
                    "x": "Notebooks",
                    "y": 2
                  },
                  {
                    "x": "Software",
                    "y": 2
                  },
                  {
                    "x": "Electronics",
                    "y": 1
                  },
                  {
                    "x": "Graphic cards",
                    "y": 1
                  },
                  {
                    "x": "Handheld",
                    "y": 1
                  },
                  {
                    "x": "Headset",
                    "y": 1
                  }
                ]
              }
           ]
         */
        getElements: function() {
            return this.elements;
        }
    });

}(window));
/* source file: impl/inav2/facet.js */
(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // class facet
    // =======================================================================
    module.Facet = function() {
        this.init.apply(this, arguments);
    };


    module.Facet.prototype = jQuery.extend({}, base.Facet.prototype, {

        setJsonFromResponse: function(data) {
            if (this.facetType === base.FacetType.DATASOURCE) {
                this.query = this.sina.createChartQuery();
                this.query.resultSet = new module.ChartResultSet({
                    sina: this.sina
                });
            } else if (this.facetType === base.FacetType.ATTRIBUTE) {
                this.query = this.sina.createChartQuery();
                this.query.resultSet = new module.ChartResultSet({
                    sina: this.sina
                });
            } else if (this.facetType === base.FacetType.SEARCH) {
                this.query = this.sina.createSearchQuery();
                this.query.resultSet = new module.SearchResultSet({
                    sina: this.sina
                });
            }
            this.query.resultSet.setJsonFromResponse(data);
            this._parseServerSideFacetMetaData(data.Metadata);
        },

        _parseServerSideFacetMetaData: function(data) {
            if (data && data.Cube) {
                this.title = data.Cube.Description;
                this.dimension = data.Cube.ObjectName;
            }

        }

    });

}(window));
/* global jQuery, window */
/* source file: impl/inav2/suggestion.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */
(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package hugo
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');
    var module = global.sap.bc.ina.api.sina.impl.inav2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    var baseDatasource = global.sap.bc.ina.api.sina.base.datasource;
    var helper = global.sap.bc.ina.api.sina.helper;

    // =======================================================================
    // convert suggestion type <-> scope
    // =======================================================================

    module.convertSuggestionType2InaOption = function(type) {
        switch (type) {
            case base.SuggestionType.HISTORY:
                return 'SuggestSearchHistory';
            case base.SuggestionType.OBJECTDATA:
                return 'SuggestObjectData';
            case base.SuggestionType.DATASOURCE:
                return 'SuggestDataSources';
            default:
                throw 'Unknown suggestion type ' + type;
        }
    };

    module.convertScope2SuggestionType = function(scope) {
        switch (scope) {
            case 'SearchHistory':
                return base.SuggestionType.HISTORY;
            case 'ObjectData':
                return base.SuggestionType.OBJECTDATA;
            case 'DataSources':
                return base.SuggestionType.DATASOURCE;
            default:
                return base.SuggestionType.OBJECTDATA;
        }
    };

    // =======================================================================
    // suggestion ???
    // =======================================================================
    module.Suggestion = function() {
        this.init.apply(this, arguments);
    };

    // =======================================================================
    // suggestion auto query
    // =======================================================================
    module.SuggestionAutoQuery = function(properties) {
        if (properties.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.ABAPSystem) {
            jQuery.extend(this, module.Suggestion2Query.prototype);
        }
        if (properties.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem) {
            jQuery.extend(this, module.SuggestionQuery.prototype);
        }
        this.init.apply(this, arguments);
    };

    // =======================================================================
    // suggestion query
    // =======================================================================
    module.SuggestionQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class suggestion query
     */
    module.SuggestionQuery.prototype = jQuery.extend({}, base.SuggestionQuery.prototype, module.Query.prototype, {

        /**
         * A suggestion query for a SAP HANA system.
         * @constructs sap.bc.ina.api.sina.impl.inav2.SuggestionQuery
         * @augments {sap.bc.ina.api.sina.base.SuggestionQuery}
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         * @param  {Object} properties Configuration object.
         * @since SAP HANA SPS 06
         * @private
         */
        init: function(properties) {
            properties = properties || {};
            this.attributes = properties.attributes || [];
            module.Query.prototype.init.apply(this, arguments);
            base.SuggestionQuery.prototype.init.apply(this, arguments);
            this.resultSetClass = module.SuggestionResultSet;
        },

        /**
         * Adds a response attribute to this suggestion query. This attributes is used
         * to look for suitable suggestions for the search term of this query. At least one term is required.
         * @instance
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SuggestionQuery
         * @param {String} attribute The name of the attribute as given in the SAP HANA database.
         * @returns {Object} this object for method chaining
         */
        addResponseAttribute: function(attribute) {
            this.attributes.push(attribute);
            this._resetResultSet();
            return this;
        },

        /**
         * Sets a list of response attributes for this suggestion query. These attributes are used
         * to look for suitable suggestions for the search term of this query. At least one term is required.
         * @instance
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SuggestionQuery
         * @param {Array} attributes A list of names of the attributes as given in the SAP HANA database.
         * @returns {Object} this object for method chaining
         */
        setResponseAttributes: function(attributes) {
            this.attributes = attributes;
            this._resetResultSet();
            return this;
        },

        createJsonRequest: function() {
            var template = jsontemplates.getSuggestionRequest();
            template.Suggestions.Precalculated = false;
            var searchterms = this.filter.getSearchTerms();
            if (this.attributes.length === 0) {
                throw "add at least one response attribute to your query";
            }
            template.Suggestions.SearchTerms = searchterms;
            template.Suggestions.AttributeNames = this.attributes;
            template.DataSource = this.filter.dataSource.getDataForRequest();
            template.Suggestions.Top = this._top;
            var filter = this.filter.getDataForRequest();
            if (filter && filter.Selection) {
                template.Suggestions.Filter = filter;
            }
            return template;
        }

    });


    // =======================================================================
    // suggestion result set
    // =======================================================================
    module.SuggestionResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class suggestion result set
     */
    module.SuggestionResultSet.prototype = {

        /**
         * A suggestion result set for a SAP HANA system.
         * @constructs sap.bc.ina.api.sina.impl.inav2.SuggestionResultSet
         * @since SAP HANA SPS 06
         * @private
         * @ignore
         */
        init: function() {
            this.suggestions = [];
        },

        setJsonFromResponse: function(data) {
            this.suggestions = [];
            var itemLists = {};

            for (var i = 0; i < data.ItemLists.length; i++) {
                itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
            }

            // only Suggestions ItemList is relevant here
            for (var a = 0; a < itemLists.Suggestions.Items.length; a++) {
                var item = itemLists.Suggestions.Items[a],
                    term = "",
                    attribute = "",
                    attributeDescription = "";
                // dataSource = new datasource.DataSource(),
                // dataSourceDescription = "";
                var suggestion = {};
                for (var d = 0; d < item.NamedValues.length; ++d) {
                    var namedValue = item.NamedValues[d];
                    switch (namedValue.Name) {
                        case "Term":
                            term = namedValue.Value;
                            suggestion.label = term;
                            break;
                            // case "$$DataSource$$":
                            //     dataSource = namedValue.Value;
                            //     dataSource.setObjectName(dataSource);
                            // break;
                            // case "$$DataSourceDescription$$":
                            //     dataSourceDescription = namedValue.Value;
                            //     dataSource.setLabel(dataSourceDescription);
                            // break;
                        case "AttributeName":
                            attribute = namedValue.Value;
                            suggestion.attribute = attribute;
                            break;
                        case "$$AttributeDescription$$":
                            attributeDescription = namedValue.Value;
                            suggestion.attributeDescription = attributeDescription;
                            break;
                        case "Score":
                            var score = namedValue.Value;
                            suggestion.score = parseInt(score, 10);
                            break;
                            // no default
                    }

                }
                // suggestion.dataSource = dataSource;
                this.suggestions.push(suggestion);
            }
            this.suggestions.sort(function(a, b) {
                return b.score - a.score;
            });
            for (var o = this.suggestions.length - 1; o >= 0; o--) {
                delete this.suggestions[o].score;
            }
        },

        /**
         * Returns the elements of the result set, ordered by relevancy score.
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SuggestionResultSet
         * @instance
         * @since SAP HANA SPS 06
         * @return {Array} A list of result set elements.
         * @example
         * var queryProperties = {
         *     dataSource  : { schemaName : "SYSTEM",
         *                     objectName : "J_EPM_PRODUCT"
         *     },
         *     searchTerms : "s*",
         *     attributes  : ['CATEGORY','PRODUCT_ID','TEXT','PRICE','CURRENCY_CODE']
         * };
         * var query = sap.bc.ina.api.sina.createSuggestionQuery(queryProperties);
         * var resultSet = query.getResultSetSync();
         * var elements = resultSet.getElements();
         * // contents of elements (shortened):
         * [{"label":"USD","attribute":"CURRENCY_CODE"},
         *   {"label":"Software","attribute":"CATEGORY"},
         *   {"label":"Scanner","attribute":"CATEGORY"},
         *   {"label":"Speakers","attribute":"CATEGORY"},
         *   {"label":"1200 dpi x 1200 dpi - up to 25 ppm (mono) / up to 24 ppm (colour) - capacity: 100 sheets - Hi-Speed USB2.0, Ethernet","attribute":"TEXT"},
         *   {"label":"1000 dpi x 1000 dpi - up to 16 ppm (mono) / up to 15 ppm (colour)- capacity 80 sheets - scanner (216 x 297 mm, 1200dpi x 2400dpi)","attribute":"TEXT"},
         *   {"label":"Print 2400 dpi image quality color documents at speeds of up to 32 ppm¹ (color) or 36 ppm¹ (monochrome), letter/A4. Powerful 500 MHz processor, 512MB of memory","attribute":"TEXT"},
         *   {"label":"Scanner and Printer","attribute":"CATEGORY"},
         *   {"label":"1000 dpi x 1000 dpi - up to 15 ppm (mono) / up to 13 ppm (colour) - capacity: 40 sheets - Hi-Speed USB - excellent dimesions for the small office","attribute":"TEXT"},
         *   {"label":"Print up to 25 ppm letter and 24 ppm A4 color or monochrome, with a first-page-out-time of less than 13 seconds for monochrome and less than 15 seconds for color","attribute":"TEXT"}
         *  ]
         */
        getElements: function() {
            return this.suggestions;
        }

    };


    // =======================================================================
    // suggestion2 query
    // =======================================================================

    module.Suggestion2Query = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class suggestion 2 query
     */
    module.Suggestion2Query.prototype = jQuery.extend({}, base.SuggestionQuery.prototype, module.Query.prototype, {

        init: function(properties) {
            properties = properties || {};
            this.attributes = properties.attributes || [];
            module.Query.prototype.init.apply(this, [properties]);
            base.SuggestionQuery.prototype.init.apply(this, [properties]);
            this.resultSetClass = module.Suggestion2ResultSet;
            this.suggestionTerm = properties.suggestionTerm || '';
            this.options = []; //['SynchronousRun'];
        },

        /**
         * Adds a response attribute to this suggestion query. Instead of the SuggestionQuery
         * which searches within these attributes. This Suggestion2Query will search everywhere
         * but only returns these response attributes.
         * @ignore
         * @instance
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.impl.inav2.Suggestion2Query
         * @param {String} attribute the name of the attribute as given in the HANA database
         * @returns {Object} this object for method chaining
         */
        addResponseAttribute: function(attribute) {
            this.attributes.push(attribute);
            this._resetResultSet();
            return this;
        },

        setSuggestionTerm: function(term) {
            if (this.suggestionTerm !== term) {
                this.suggestionTerm = term;
                this._resetResultSet();
            }
            return this;
        },


        /**
         * Adds a response attribute to this suggestion query. Instead of the SuggestionQuery
         * which searches within these attributes. This Suggestion2Query will search everywhere
         * but only returns these response attributes.
         * @ignore
         * @instance
         * @memberOf sap.bc.ina.api.sina.impl.inav2.Suggestion2Query
         * @param {Array} attributes list with the names of the attribute as given in the SAP HANA database.
         * @returns {Object} this object for method chaining
         */
        setResponseAttributes: function(attributes) {
            this.attributes = attributes;
            this._resetResultSet();
            return this;
        },

        createJsonRequest: function() {
            var template = jsontemplates.getSuggestion2Request();
            template.Suggestions2.Precalculated = false;
            template.Suggestions2.NamedValues = [];
            for (var i = 0; i < this.attributes.length; i++) {
                template.Suggestions2.NamedValues.push({
                    AttributeName: this.attributes[i],
                    Name: this.attributes[i]
                });
            }

            template.DataSource = this.filter.dataSource.getDataForRequest();
            template.Suggestions2.Top = this.getTop();
            template.Suggestions2.Skip = this.getSkip();
            var rootConditionGroup = this.sina.createFilterConditionGroup();

            // split suggestionTerm into searchTerm und suggestionTerm
            this.splittedSuggestionTerm = this.splitSuggestionTerm(this.suggestionTerm);
            // construct search and suggestion conditions
            if (this.splittedSuggestionTerm.searchTerm) {
                var stCondition = this.sina.createFilterCondition('$$SearchTerms$$', 'contains', this.splittedSuggestionTerm.searchTerm);
                rootConditionGroup.addCondition(stCondition);
            }

            var suggestionCondition = this.sina.createFilterCondition('$$SuggestionTerms$$', 'contains', this.splittedSuggestionTerm.suggestionTerm);

            rootConditionGroup.addCondition(suggestionCondition);
            rootConditionGroup.addCondition(this.getFilter().getFilterConditions());
            template.Suggestions2.Filter = rootConditionGroup.getDataForRequest();
            template.Options = this.options.slice();
            template.Options.push.apply(template.Options, jQuery.map(this.suggestionTypes, function(suggestionType) {
                return module.convertSuggestionType2InaOption(suggestionType);
            }));
            return template;
        },

        // split suggestion term
        // ===================================================================
        splitSuggestionTerm: function(term) {

            // split suggestions term into
            // prefix = which is used as search term filter
            // suffix = which is actually used as thes suggestion term
            // split position is last space
            // reason:
            // document contains: "Sally Spring"
            // search input box: sally  s-> suggestion sally spring
            //                   spring s-> suggestion spring sally
            // last suggestion would not happend when just using
            // "spring s " as suggestion term

            // check for last blank
            var splitPos = term.lastIndexOf(' ');
            if (splitPos < 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term
                };
            }

            // split search term
            var searchTerm = term.slice(0, splitPos);
            searchTerm = searchTerm.replace(/\s+$/, ""); // right trim
            if (searchTerm.length === 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term
                };
            }

            // split suggestion term
            var suggestionTerm = term.slice(splitPos);
            suggestionTerm = suggestionTerm.replace(/^\s+/, ""); // left trim
            if (suggestionTerm.length === 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term
                };
            }

            // return result
            return {
                searchTerm: searchTerm,
                suggestionTerm: suggestionTerm
            };

        }


    });

    // =======================================================================
    // suggestion2 result set
    // =======================================================================

    module.Suggestion2ResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class suggestion 2 result set
     */
    module.Suggestion2ResultSet.prototype = {

        init: function(properties) {
            this.datasources = {};
            this.suggestions = [];
            this.sina = properties.sina;
            this.query = properties.query;
        },

        parseSuggestion: function(type, suggestionTermNode) {
            var suggestionTermSuggestion = {
                label: suggestionTermNode.dataFormatted.$$Term$$.ValueFormatted,
                labelRaw: suggestionTermNode.dataFormatted.$$Term$$.Value,
                dataSource: this.query.getDataSource(),
                type: type,
                children: []
            };
            if (this.query.getDataSource().type === 'Category' || type === this.sina.SuggestionType.HISTORY) {
                this.suggestions.push(suggestionTermSuggestion);
            }
            if (type === this.sina.SuggestionType.HISTORY) {
                return;
            }
            for (var j = 1; j < suggestionTermNode.children.length; ++j) {
                var dataSourceNode = suggestionTermNode.children[j];
                var dataSource = this.sina.createDataSource({
                    type: baseDatasource.DataSourceType.BUSINESSOBJECT,
                    objectName: dataSourceNode.dataFormatted.$$DataSource$$,
                    label: dataSourceNode.dataFormatted.$$DataSourceDescription$$
                });
                var dataSourceSuggestion = {
                    label: suggestionTermNode.dataFormatted.$$Term$$.ValueFormatted,
                    labelRaw: suggestionTermNode.dataFormatted.$$Term$$.Value,
                    dataSource: dataSource,
                    type: suggestionTermSuggestion.type
                };
                if (this.query.getDataSource().type === 'Category') {
                    suggestionTermSuggestion.children.push(dataSourceSuggestion);
                } else {
                    this.suggestions.push(dataSourceSuggestion);
                }
            }
        },

        parseDataSourceSuggestion: function(suggestionTermNode) {
            var dataSource = this.sina.createDataSource({
                type: baseDatasource.DataSourceType.BUSINESSOBJECT,
                objectName: suggestionTermNode.dataFormatted.$$Term$$.Value,
                label: helper.removeHtmlTags(suggestionTermNode.dataFormatted.$$Term$$.ValueFormatted)
            });
            var suggestionTermSuggestion = {
                label: suggestionTermNode.dataFormatted.$$Term$$.ValueFormatted,
                labelRaw: dataSource,
                dataSource: dataSource,
                type: this.sina.SuggestionType.DATASOURCE,
                children: []
            };
            this.suggestions.push(suggestionTermSuggestion);
        },

        setJsonFromResponse: function(data) {

            if (!data.Grids || !data.Grids[0] || !data.Grids[0].Axes) {
                return;
            }

            var resultSetParser = new module.ResultSetParser({
                resultSet: data
            });
            var tree = resultSetParser.parse();

            for (var i = 0; i < tree.root.children.length; ++i) {
                var suggestionTermNode = tree.root.children[i];
                var type = module.convertScope2SuggestionType(suggestionTermNode.dataFormatted.$$Term$$.Scope);
                switch (type) {
                    case this.sina.SuggestionType.OBJECTDATA:
                        this.parseSuggestion(type, suggestionTermNode);
                        break;
                    case this.sina.SuggestionType.HISTORY:
                        this.parseSuggestion(type, suggestionTermNode);
                        break;
                    case this.sina.SuggestionType.DATASOURCE:
                        this.parseDataSourceSuggestion(suggestionTermNode);
                        break;
                }

            }


            /*
                        this.datasources = {};
                        this.suggestions = [];

                        var itemLists = {};
                        if (!data.ItemLists) {
                            return;
                        }
                        for (var i = 0; i < data.ItemLists.length; i++) {
                            itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                        }

                        for (var a = 0; a < data.Grids.length; a++) {
                            var axes = data.Grids[a].Axes;
                            var cells = data.Grids[a].Cells;
                            if (axes === undefined || cells === undefined) {
                                return;
                            }

                            for (var cellIndex = 0; cellIndex < cells.length; ++cellIndex) {
                                var cell = cells[cellIndex],
                                    attributeLabel = "",
                                    suggestion = {};
                                suggestion.dataSource = this.sina.createDataSource();
                                suggestion.attribute = {};
                                for (var j = 0; j < cell.Index.length; j++) {
                                    var cellIndexValue = cell.Index[j];
                                    var tuple = axes[j].Tuples[cellIndexValue];
                                    if (tuple === undefined) {
                                        continue;
                                    }
                                    for (var c = 0; c < tuple.length; c++) {
                                        var dimension = axes[j].Dimensions[c];
                                        var tupleValueForDimension = tuple[c];
                                        var itemlist = itemLists[dimension.ItemListName];
                                        var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                                        for (var d = 0; d < namedValues.length; ++d) {
                                            var namedValue = namedValues[d];
                                            switch (namedValue.Name) {
                                                case "$$Term$$":
                                                    suggestion.scope = namedValue.Scope;
                                                    suggestion.label = namedValue.ValueFormatted;
                                                    suggestion.valueRaw = cell.Value || cell.ValueFormatted || null;
                                                    suggestion.value = cell.ValueFormatted || cell.Value || null;
                                                    var labelRaw = namedValue.Value;
                                                    if (suggestion.scope === 'DataSources') {
                                                        suggestion.labelRaw = this.sina.createDataSource({
                                                            objectName: labelRaw,
                                                            label: suggestion.label.replace(/<b>|<\/b>/ig, "")
                                                        });
                                                    } else {
                                                        suggestion.labelRaw = labelRaw;
                                                    }


                                                    if (!suggestion.filter) {
                                                        suggestion.filter = {};
                                                    }
                                                    suggestion.filter.value = labelRaw;
                                                    suggestion.filter.valueLabel = labelRaw;

                                                    break;
                                                case "$$DataSource$$":
                                                    var objectName = namedValue.Value;
                                                    if (objectName === '$$AllDataSources$$') {
                                                        suggestion.dataSource = this.sina.getRootDataSource();
                                                    } else {
                                                        suggestion.dataSource.setObjectNameValue(objectName);
                                                    }
                                                    break;
                                                case "$$DataSourceDescription$$":
                                                    var objectNameLabel = namedValue.Value;
                                                    suggestion.dataSource.setObjectNameLabel(objectNameLabel);
                                                    break;
                                                case "$$Attribute$$":
                                                    var attribute = namedValue.Value;
                                                    if (!suggestion.filter) {
                                                        suggestion.filter = {};
                                                    }
                                                    suggestion.filter.attribute = attribute;
                                                    suggestion.attribute.value = attribute;
                                                    break;
                                                case "$$AttributeDescription$$":
                                                    attributeLabel = namedValue.Value;
                                                    if (!suggestion.filter) {
                                                        suggestion.filter = {};
                                                    }
                                                    suggestion.filter.attributeLabel = attributeLabel;
                                                    suggestion.attribute.label = attributeLabel;
                                                    break;
                                                    // no default
                                            }

                                        }
                                    }
                                }
                                this.suggestions.push(suggestion);
                            }

                        } */

        },


        getElements: function() {
            this.concatenateSearchTerm(this.suggestions, this.query.splittedSuggestionTerm);
            return this.suggestions;
        },

        // regexp escaping
        // ===================================================================
        escapeRegExp: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        // concatenate suggestion term
        // ===================================================================
        concatenateSearchTerm: function(suggestions, splittedSuggestionTerm) {

            // reason: see splitSuggestionTerm

            // no search term -> nothing to do
            var that = this;
            if (!splittedSuggestionTerm.searchTerm) {
                return;
            }

            // split search terms
            var searchTerms = jQuery.map(splittedSuggestionTerm.searchTerm.split(' '), function(term) {
                term = term.trim();
                return {
                    term: term,
                    regExp: new RegExp(that.escapeRegExp(term), 'i')
                };
            });

            // process all suggestions
            for (var i = 0; i < suggestions.length; ++i) {
                var suggestion = suggestions[i];

                // identify all search terms not included in suggestion
                var notFoundSearchTerms = [];
                for (var j = 0; j < searchTerms.length; ++j) {
                    var searchTerm = searchTerms[j];
                    if (!searchTerm.regExp.test(suggestion.labelRaw)) {
                        notFoundSearchTerms.push(searchTerm.term);
                    }
                }

                // prefix for suggestion = all search terms not included in suggestions
                var prefix = notFoundSearchTerms.join(' ');
                var prefixBold = jQuery.map(notFoundSearchTerms, function(term) {
                    /* eslint no-loop-func:0 */
                    return '<b>' + term + '</b>';
                }).join(' ');
                suggestion.label = prefixBold + ' ' + suggestion.label;
                suggestion.labelRaw = prefix + ' ' + suggestion.labelRaw;

                // recursion
                if (suggestion.children && suggestion.children.length > 0) {
                    this.concatenateSearchTerm(suggestion.children, splittedSuggestionTerm);
                }
            }
        }

    };


}(window));
/* source file: impl/inav2/sina.js */
/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    /**
     * import packages
     */
    var base = global.sap.bc.ina.api.sina.base;
    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    var filter = global.sap.bc.ina.api.sina.impl.inav2.filter;
    var datasource = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    /**
     * create packages
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2;
    module.Condition = filter.Condition;

    module.Sina = function() {
        this.init.apply(this, arguments);
    };
    module.CatalogQuery = function() {
        this.init.apply(this, arguments);
    };
    module.CatalogResultSet = function() {
        this.init.apply(this, arguments);
    };
    module.DataSourceQuery = function() {
        this.init.apply(this, arguments);
    };
    module.ESHConnectorDataSourceQuery = function() {
        this.init.apply(this, arguments);
    };
    module.SearchConfiguration = function() {
        this.init.apply(this, arguments);
    };
    module.UserHistory = function() {
        this.init.apply(this, arguments);
    };

    /**
     * register provider
     */
    module.IMPL_TYPE = "inav2";
    base.registerProvider({
        impl_type: module.IMPL_TYPE,
        sina: module.Sina,
        chartQuery: function(properties) {
            if (properties.sina.getSystem() instanceof global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem) {
                return new module.ChartQuery(properties);
            } else {
                return new module.ABAPChartQuery(properties);
            }
        },
        searchQuery: module.SearchQuery,
        groupBarChartQuery: module.GroupBarChartQuery,
        lineChartQuery: module.LineChartQuery,
        suggestionQuery: module.SuggestionAutoQuery,
        perspectiveQuery: module.PerspectiveQuery,
        perspectiveSearchQuery: module.PerspectiveSearchQuery,
        perspectiveGetQuery: module.PerspectiveGetQuery,
        Facet: module.Facet,
        DataSource: datasource.DataSource,
        metaDataService: new module.MetaDataService(),
        Filter: filter.Filter,
        FilterCondition: filter.Condition,
        FilterConditionGroup: filter.ConditionGroup,
        DataSourceQuery: module.DataSourceQuery,
        searchConfiguration: module.SearchConfiguration,
        addUserHistoryEntry: function(properties) {
            var uh = new module.UserHistory(properties);
            return uh.addUserHistoryEntry(properties.oEntry);
        },
        emptyUserHistory: function(properties) {
            var uh = new module.UserHistory(properties);
            return uh.emptyUserHistory();
        }
    });

    /**
     * sina
     */
    module.Sina.prototype = jQuery.extend({}, base.Sina.prototype, {

        /**
         * Creates a new instance of SINA that uses the INA V2 service. Use
         * the SINA factory {@link sap.bc.ina.api.sina.getSina} instead of this
         * private constructor.
         * @private
         * @augments {sap.bc.ina.api.sina.base.Sina}
         * @constructs sap.bc.ina.api.sina.impl.inav2.Sina
         * @param  {Object} properties Configuration properties for the instance.
         * @since SAP HANA SPS 06
         */
        init: function(properties) {
            properties = properties || {};
            this.setSystem(properties.system || new module.system.HANASystem());
            base.Sina.prototype.init.apply(this, arguments);
            //impossible to use createDataSource() because provider is still not filled at this moment
            this.rootDataSource = new datasource.DataSource({
                objectName: "$$ALL$$",
                packageName: "ABAP",
                schemaName: "",
                sina: this
            });
            base.provider.inav2.metaDataService.sina = this;
        },

        getRootDataSource: function() {
            return this.rootDataSource;
        },

        /**
         * Gets or sets an SAP client. Only used with system type ABAP.
         * @ignore
         * @since SAP HANA SPS 06
         * @memberOf sap.bc.ina.api.sina.impl.inav2.Sina
         * @instance
         * @param  {Integer} sapclient Number of the SAP client to be used with the service.
         * @return {Integer} The SAP client number that is currently set, but only if called
         * without a parameter.
         */
        sapclient: function(sapclient) {
            var sys;
            if (sapclient) {
                if (sapclient < 0) {
                    sys = new module.system.HANASystem();
                } else {
                    sys = new module.system.ABAPSystem({
                        'sapclient': sapclient
                    });
                }
                this.setSystem(sys);
            } else {
                return this.getSystem().properties.sapclient();
            }
            return {};
        },

        _registerPostProcessor: function(postProcessor) {
            if (!this.postProcessor) {
                this.postProcessor = [];
            }
            this.postProcessor.push(postProcessor);
        },

        _postprocess: function(sinAction, sourceTitle) {
            if (this.postProcessor) {
                for (var i = 0; i < this.postProcessor.length; i++) {
                    this.postProcessor[i](sinAction, sourceTitle);
                }
            }
        }

    });

    /**
     * class catalog query
     */
    module.CatalogQuery.prototype = jQuery.extend({}, module.Query.prototype, {

        /**
         * A catalog query.
         * @constructs sap.bc.ina.api.sina.impl.inav2.CatalogQuery
         * @augments {sap.bc.ina.api.sina.impl.inav2.Query}
         * @param  {Object} properties Configuration object.
         * @since SAP HANA SPS 06
         * @private
         */
        init: function(properties) {
            properties = properties || {};
            this.resultSetClass = module.SearchResultSet;
        },

        createJsonRequest: function() {
            return jsontemplates.getCatalogRequest();
        }

    });

    /**
     * class datasource query
     */
    module.DataSourceQuery.prototype = jQuery.extend({}, base.SearchQuery.prototype, module.SearchQuery.prototype, {

        /**
         * A query that returns all your datasources
         * @constructs sap.bc.ina.api.sina.impl.inav2.DataSourceQuery
         * @augments {sap.bc.ina.api.sina.base.SearchQuery}
         * @private
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            base.SearchQuery.prototype.init.apply(this, [properties]);
            module.SearchQuery.prototype.init.apply(this, [properties]);
            this.template = jsontemplates.getCatalogRequest();
            this.template.SearchTerms = this.getSearchTerms() ||  '*';
            if (this._top === undefined) {
                this.setTop(1000);
            }
            this.template.Search.Top = this.getTop();
            if (this._skip === undefined) {
                this.setSkip(0);
            }
            this.template.Search.Skip = this.getSkip();
            // set view type, exclude categories
            var type = {
                "MemberOperand": {
                    "AttributeName": "Type",
                    "Comparison": "=",
                    "Value": "View"
                }
            };
            var capabilities = properties.system.getService("Search").getCapabilities();
            if (capabilities.PluralDescriptionForDataSource) {
                this.template.Search.NamedValues.push({
                    "AttributeName": "DescriptionPlural",
                    "Name": "DescriptionPlural"
                });
            }
            this.template.Search.Filter.Selection.Operator.SubSelections.push(type);
        },

        createJsonRequest: function() {
            return this.template;
        }

    });

    /**
     * class fallback datasource query
     */
    module.ESHConnectorDataSourceQuery.prototype = jQuery.extend({}, base.SearchQuery.prototype, module.SearchQuery.prototype, {

        /**
         * A query that returns all your datasources, as fallback of DataSourceQuery
         * @constructs sap.bc.ina.api.sina.impl.inav2.DataSourceQuery
         * @augments {sap.bc.ina.api.sina.base.SearchQuery}
         * @private
         * @param  {Object} properties Configuration object.
         */
        init: function(properties) {
            base.SearchQuery.prototype.init.apply(this, [properties]);
            module.SearchQuery.prototype.init.apply(this, [properties]);
            this.template = jsontemplates.getESHConnectorRequest();
            var serverInfo = this.system.getServerInfoSync();
            var systemId = serverInfo.rawServerInfo.ServerInfo.SystemId;
            var searchConnector = systemId + this.system.sapclient() + "~ESH_CONNECTOR~";
            var dataSource = properties.dataSource || {
                SchemaName: "",
                PackageName: "ABAP",
                ObjectName: searchConnector,
                type: "Connector"
            };
            this.template.DataSource = dataSource;
            this.template.SearchTerms = this.getSearchTerms() ||  '*';
            if (this._top === undefined) {
                this.setTop(1000);
            }
            this.template.Search.Top = this.getTop();
            if (this._skip === undefined) {
                this.setSkip(0);
            }
            this.template.Search.Skip = this.getSkip();
        },

        createJsonRequest: function() {
            return this.template;
        }

    });

    /**
     * class SearchConfiguration
     */
    module.UserHistory.prototype = jQuery.extend({}, base.Query.prototype, module.Query.prototype, {

        init: function(properties) {
            properties = properties ||  {};
            base.Query.prototype.init.apply(this, [properties]);
            module.Query.prototype.init.apply(this, [properties]);
        },

        /**
         * Save a navigation event asynchronously on the server
         * @ignore
         * @memberOf sap.bc.ina.api.sina.impl.inav2.SearchConfiguration
         * @instance
         * @param {object} oNavigationEvent the navigation object, for example
         * "NavigationEvent": {
                "SourceApplication":  "…",
                "TargetApplication":  "…",
                "Parameter":  […]
            }
         * @param {Boolean} async should the call be asynchronous?
         * @returns {Object} returns a jQuery jQXHR object
         */
        addUserHistoryEntry: function(oNavigationEvent, async) {
            var data = {
                "SearchConfiguration": {
                    "Action": "Update",
                    "ClientEvent": oNavigationEvent
                }
            };
            return this._fireRequest(data, async, 'text');
        },

        /**
         * Delete all data of the user which was collected
         * @param {Boolean} async should the call be asynchronous?
         * @returns {Object} A promise which resolves if the deletion was successful on the server
         */
        emptyUserHistory: function(async) {
            var data = {
                "SearchConfiguration": {
                    "Action": "Update",
                    "Data": {
                        "PersonalizedSearch": {
                            "ResetUserData": true
                        }
                    }
                }
            };
            return this._fireRequest(data, async, 'text');
        }

    });


    /**
     * class SearchConfiguration
     */
    module.SearchConfiguration.prototype = jQuery.extend({}, base.Query.prototype, module.Query.prototype, {

        init: function(properties) {
            properties = properties ||  {};
            base.Query.prototype.init.apply(this, [properties]);
            module.Query.prototype.init.apply(this, [properties]);
        },

        /**
         * Read the current configuration of the user from the server
         * @param {Boolean} async should the call be asynchronous?
         * @returns {Object} A promise which resolves with the user data
         */
        load: function(async) {
            var data = {
                "SearchConfiguration": {
                    "Action": "Get",
                    "Data": {
                        "PersonalizedSearch": {}
                    }
                }
            };
            return this._fireRequest(data, async);
        },

        /**
         * Save the search configuration and send it to the server
         * @param   {Object}  oSearchConfig An INA search configuration object
         * @param   {Boolean} async         Should the call be asynchronous?
         * @returns {Boolean} A promise if the call is async (the default) or the data returned by the server
         */
        save: function(oSearchConfig, async) {
            return this._fireRequest(oSearchConfig, async, 'text');
        }

    });

}(window));
/* source file: impl/inav2/system.js */
/*
 * @file Simple info access (SINA) API: System representation
 * @namespace sap.bc.ina.api.sina.impl.inav2.system
 * @copyright 2014 SAP SE. All rights reserved.
 */

(function(global) {
    "use strict";

    /**
     * import packages
     */
    var base = global.sap.bc.ina.api.sina.base;
    var system = base.system;
    var proxy = global.sap.bc.ina.api.sina.impl.inav2.proxy;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.system');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina.impl.inav2.system;

    module.ABAPSystem = function() {
        this.init.apply(this, arguments);
    };
    module.HANASystem = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class abap system
     */
    module.ABAPSystem.prototype = jQuery.extend({}, system.System.prototype, {

        /**
         * Creates the ABAP system for INA V2 provider
         * @constructs sap.bc.ina.api.sina.impl.inav2.system.ABAPSystem
         * @augments {sap.bc.ina.api.sina.base.system.System}
         * @param  {Object} properties properties for configuration
         * @private
         */
        init: function(properties) {
            properties = properties || {};
            this.systemType = 'ABAP';
            this.inaUrl = properties.inaUrl || '/sap/es/ina/GetResponse';
            this.infoUrl = properties.infoUrl || '/sap/es/ina/GetServerInfo';
            properties.proxy = properties.proxy || new proxy.Proxy({
                'xsrfService': this.infoUrl
            });
            system.System.prototype.init.apply(this, [properties]);
            this.properties = {};
            if (properties.sapclient) {
                this.sapclient(properties.sapclient);
            } else {
                var sapclient = this._readSapClientFromUrl();
                this.sapclient(sapclient);
            }
            if (properties.saplanguage) {
                this.saplanguage(properties.saplanguage);
            } else {
                var saplanguage = this._getUrlParameter("sap-language");
                this.saplanguage(saplanguage);
            }

        },

        setSinaUrlParameter: function(name, value) {

            //convert to str
            value = '' + value;

            if (name.toUpperCase() === 'SAP-CLIENT' && value.length < 3) {

                //add leading 0 to sap-client parameter
                for (var i = 0; i < 2; i++) {
                    value = '0' + value;
                }
            }

            var setForUrl = function(url) {
                var currentValue = (new RegExp(name + '=' + '(.+?)(&|$|#)', 'i').exec(url) || [null])[1];
                if (!currentValue) {

                    // there is no such parameter -> find the right position to add
                    if (url.indexOf('?') === -1) {

                        // url has no parameters at all -> first parameter
                        url += '?' + encodeURIComponent(name) + '=' + encodeURIComponent(value);
                    } else {

                        // therer are other url parameters -> append
                        url += '&' + encodeURIComponent(name) + '=' + encodeURIComponent(value);
                    }
                } else {

                    // the parameter exists -> replace it
                    url = url.replace(name + '=' + currentValue, encodeURIComponent(name) + '=' + encodeURIComponent(value));
                }
                return url;
            };

            this.infoUrl = setForUrl(this.infoUrl);
            this.inaUrl = setForUrl(this.inaUrl);
        },

        _getUrlParameter: function(name) {
            var search = global.location.href;
            var value = (new RegExp(name + '=' + '(.+?)(&|$|#)', 'i').exec(search) || [null])[1];
            if (!value) {
                return value;
            }
            value = decodeURIComponent(value.replace(/\+/g, ' '));
            return value;
        },

        _readSapClientFromUrl: function() {
            // dont read sap client from url in fiori scenario where
            // frontend (ui) server is not the search server
            if (global.sap.bc.ina.api.sina.properties && global.sap.bc.ina.api.sina.properties.noSapClientFromUrl && global.sap.bc.ina.api.sina.properties.noSapClientFromUrl === true) {
                return '';
            }
            return this._getUrlParameter('sap-client');
        },

        sapclient: function(sapclient) {
            if (sapclient) {
                this.properties.sapclient = sapclient;
                this.setSinaUrlParameter('sap-client', this.properties.sapclient);
                this._deleteServerInfo();
                // trigger another serverinfo call if sapclient changes since
                // there could be another database type working in this client
                this.getServerInfo();
            } else {
                return this.properties.sapclient;
            }
        },

        saplanguage: function(language) {
            if (language) {
                this.properties.saplanguage = language;
                this.setSinaUrlParameter('sap-language', this.properties.saplanguage);
            } else {
                return this.properties.saplanguage;
            }
        },

        setServerInfo: function(json) {
            this.properties.rawServerInfo = json;

            if (this instanceof module.ABAPSystem) {
                this.properties.dbms = json.ServerInfo.DataBaseManagementSystem;
                this.properties.sapclient = json.ServerInfo.Client;
                this.properties.saplanguage = json.ServerInfo.UserLanguageCode;
                this.properties.systemid = json.ServerInfo.SystemId;
            }

            var service;
            for (var i = 0; i < json.Services.length; i++) {
                var serviceJson = json.Services[i];
                switch (serviceJson.Service) {
                    case 'Suggestions2':
                        serviceJson.Service = 'Suggestions';
                        service = new module.SuggestionService(serviceJson);
                        break;
                    default:
                        service = new system.Service(serviceJson);
                }
                this.services[serviceJson.Service] = service;
            }
            this.properties.services = this.services;

        }
    });

    /**
     * class hana system
     */
    module.HANASystem.prototype = jQuery.extend({}, system.System.prototype, {

        /**
         * Creates the HANA system for INA V2 provider
         * @constructs sap.bc.ina.api.sina.impl.inav2.system.HANASystem
         * @augments {sap.bc.ina.api.sina.base.system.System}
         * @param  {Object} properties properties for configuration
         * @private
         */
        init: function(properties) {
            properties = properties || {};
            this.systemType = 'HANA';
            this.infoUrl = properties.infoUrl || '/sap/bc/ina/service/v2/GetServerInfo';
            this.inaUrl = properties.inaUrl || '/sap/bc/ina/service/v2/GetResponse';
            properties.proxy = properties.proxy || new proxy.Proxy({
                'xsrfService': this.infoUrl
            });
            system.System.prototype.init.apply(this, [properties]);
            this._setUpAjaxErrorHandler();
            // this.getServerInfo();
        },

        _setUpAjaxErrorHandler: function() {

            //global ajax setup for errors
            jQuery(global.document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
                // log.debug("Error: call to "+ajaxSettings.url+" with argument "+ajaxSettings.data+" had status "+jqXHR.status+" ("+jqXHR.statusText+") - Response was: "+jqXHR.responseText); //log message for debugging
                switch (jqXHR.status) {
                    case 401:
                        global.window.location = '/sap/hana/xs/formLogin/login.html?x-sap-origin-location=' +
                            encodeURIComponent(global.window.location.pathname) +
                            encodeURIComponent(global.window.location.search);
                        break;
                    case 404:
                        return;
                        // no default
                }
                // var message = '';
                // if(jqXHR.status!==200){
                //     message = 'Server responded with status code ' + jqXHR.status+'. ';
                // }
                // if(thrownError&&thrownError.message){
                //     message += thrownError.message;
                // }
                // if(message){
                //     log.error(message); //message to the user
                // }
            });
        }
    });

    module.SuggestionService = function() {
        this.init.apply(this, arguments);
    };

    module.SuggestionService.prototype = jQuery.extend(Object.create(system.Service.prototype), {

        init: function(serviceJson) {
            system.Service.prototype.init.apply(this, arguments);
            var scopeTypesSupported = false;
            for (var j = 0; j < serviceJson.Capabilities.length; ++j) {
                var capability = serviceJson.Capabilities[j];
                if (capability.Capability === 'ScopeTypes') {
                    scopeTypesSupported = true;
                }
            }
            if (scopeTypesSupported) {
                this.suggestionTypes = [base.SuggestionType.OBJECTDATA, base.SuggestionType.HISTORY, base.SuggestionType.DATASOURCE];
            } else {
                this.suggestionTypes = [base.SuggestionType.OBJECTDATA];
            }
        }

    });

}(window));
/* source file: impl/odata2/datasource.js */
(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2.datasource');
    var module = global.sap.bc.ina.api.sina.impl.odata2.datasource;

    // =======================================================================
    // import packages
    // =======================================================================
    var datasource = global.sap.bc.ina.api.sina.base.datasource;

    // =======================================================================
    // datasource
    // =======================================================================
    module.DataSource = function() {
        this.init.apply(this, arguments);
    };
    module.DataSource.prototype = jQuery.extend({}, datasource.DataSource.prototype, {

        init: function(properties) {
            properties = properties || {};
            datasource.DataSource.prototype.init.apply(this, arguments);
            this.type = properties.type || datasource.DataSourceType.BUSINESSOBJECT;
            this.entityType = properties.entityType || properties.name;
            this.name = properties.name || '';
            this.schema = properties.schema || '';

            this.label = properties.label || 'icognito datasource';
            this.labelPlural = properties.labelPlural || 'icognito datasource plural';
            //            this.serviceUrl = properties.serviceUrl || 'no go';
            //            this.metaUrl = properties.metaUrl || 'no go meta';
            this.sina = properties.sina || null;
            this.constructKey();
            if (!this.key) {
                throw 'Datasource has no key!! ' + JSON.stringify(properties);
            }
        },

        constructKey: function() {
            this.key = this.type + '/' + this.entityType;
        },

        getIdentifier: function() {
            return this.name;
        },
        getType: function() {
            return this.type;
        },

        getEntityType: function() {
            return this.entityType;
        },

        getLabel: function() {
            return this.label;
        },

        getSchema: function() {
            return this.schema;
        },

        getLabelPlural: function() {
            return this.labelPlural;
        },

        getName: function() {
            return this.name;
        },

        clone: function() {
            var newDataSource = this.sina.createDataSource();
            newDataSource.type = this.type;
            newDataSource.entityType = this.entityType;
            newDataSource.name = this.name;
            newDataSource.schema = this.schema;
            newDataSource.label = this.label;
            newDataSource.labelPlural = this.labelPlural;
            newDataSource.key = this.key;

            return newDataSource;
        },

        setJson: function(json) {
            this.type = json.type;
            this.entityType = json.entityType;
            this.schema = json.schema;
            this.label = json.label;
            this.labelPlural = json.labelPlural;
            this.name = json.name;
            this.constructKey();
        },

        getJson: function() {
            return {
                type: this.type,
                entityType: this.entityType,
                schema: this.schema,
                label: this.label,
                labelPlural: this.labelPlural,
                //serviceUrl: this.serviceUrl,
                //metaUrl: this.metaUrl,
                name: this.name
            };
        }

    });


}(window));
/* source file: impl/odata2/filter.js */
(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2.filter');
    var module = global.sap.bc.ina.api.sina.impl.odata2.filter;

    // =======================================================================
    // import packages
    // =======================================================================
    var filter = global.sap.bc.ina.api.sina.base.filter;

    // =======================================================================
    // filter
    // =======================================================================
    module.Filter = function() {
        this.init.apply(this, arguments);
    };

    module.Filter.prototype = jQuery.extend({}, filter.Filter.prototype, {

        init: function(properties) {
            filter.Filter.prototype.init.apply(this, [properties]);
        },

        hasFilterCondition: function() {
            return false;
        },

        getDataForRequest: function() {
            return this.defaultConditionGroup.getDataForRequest();
        }

    });

    module.Condition = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class condition
     */
    module.Condition.prototype = jQuery.extend(Object.create(filter.Condition.prototype), {

        init: function(attribute, operator, value, sina) {
            global.sap.bc.ina.api.sina.base.filter.Condition.prototype.init.apply(this, arguments);
        },

        getDataForRequest: function() {
            return this.attribute + " " + module.nomalizeOperator(this.operator) + " '" + this.value + "'";
        }


    });

    module.ConditionGroup = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class condition group
     */
    module.ConditionGroup.prototype = jQuery.extend(Object.create(filter.ConditionGroup.prototype), {


        init: function(properties) {
            filter.ConditionGroup.prototype.init.apply(this, [properties]);
        },

        getDataForRequest: function() {
            var result = [];
            for (var i = 0; i < this.conditions.length; i++) {
                var condition = this.conditions[i];
                var conditionStr = condition.getDataForRequest();
                if (conditionStr) {
                    result.push(condition.getDataForRequest());
                }
            }

            var resultStr = result.join(' ' + module.nomalizeOperator(this.operator) + ' ');
            if (result.length > 1) {
                resultStr = '(' + resultStr + ')';
            }
            return resultStr;
        }

    });

    module.nomalizeOperator = function(operator) {
        operator = operator.toLowerCase();
        switch (operator) {
            case '=':
                operator = 'eq';
                break;
            case '!=':
                operator = 'ne';
                break;
            case '>':
                operator = 'gt';
                break;
            case '>=':
                operator = 'ge';
                break;
            case '<':
                operator = 'lt';
                break;
            case '<=':
                operator = 'le';
                break;
                // no default
        }
        return operator;
    };

}(window));
/* global jQuery, window */
/* source file: impl/odata2/system.js */
(function(global) {
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2.system');
    var module = global.sap.bc.ina.api.sina.impl.odata2.system;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var system = base.system;

    module.System = function() {
        this.init.apply(this, arguments);
    };
    module.System.prototype = jQuery.extend({}, system.System.prototype, {

        init: function(properties) {
            properties = properties || {};
            system.System.prototype.init.apply(this, [properties]);
        },

        getServerInfo: function() {
            // Hard coded so far. It will be replaced when odata metadataservice systeminfo part is available
            return jQuery.when({
                rawServerInfo: {
                    Services: [{
                        Service: 'Suggestions2',
                        Capabilities: [{
                            Capability: 'ScopeTypes'
                        }]
                    }]
                },
                services: {
                    Suggestions: {
                        suggestionTypes: ['objectdata']
                    },
                    Search: {
                        capabilities: ['search']
                    }
                }
            });
        }

    });

}(window));
/* source file: impl/odata2/meta.js */
/* global $, jQuery, window */
(function(global) {
    "use strict";
    /* eslint camelcase:0 */

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================


    // =======================================================================
    // class MetaDataService
    // =======================================================================
    module.MetaDataService = function() {
        this.init.apply(this, arguments);
    };

    module.MetaDataService.prototype = {
        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina || null;
            this.allInOneMap = {};
            this.allInOneMapDeferred = null;
            this.presentationUsageConversionMap = {
                TITLE: 'Title',
                SUMMARY: 'Summary',
                DETAIL: 'Detail'
            };
        },

        getDataSources: function() {
            var that = this;
            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.dataSourcesList;
            });
        },

        getDataSourcesSync: function() {
            this._fillInternalBufferSync();
            return this.allInOneMap.dataSourcesList;
        },

        getDataSource: function(dataSource) {
            var that = this;
            var entitySetName = dataSource.getName();
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.dataSourceMap[entitySetName];
            });
        },

        getDataSourceByBusinessObjectName: function(entitySetName) {
            var that = this;
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.dataSourceMap[entitySetName];
            });
        },

        getDataSourceSync: function(dataSource) {
            var entitySetName = dataSource.getName();
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            this._fillInternalBufferSync();

            return this.allInOneMap.dataSourceMap[entitySetName];
        },

        getDataSourceSyncByBusinessObjectName: function(entitySetName) {
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            this._fillInternalBufferSync();

            return this.allInOneMap.dataSourceMap[entitySetName];
        },

        getBusinessObjectsMetaData: function() {
            var that = this;

            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.businessObjectList;

            });
        },


        getBusinessObjectsMetaDataSync: function() {
            this._fillInternalBufferSync();
            return this.allInOneMap.businessObjectList;
        },

        getBusinessObjectMetaData: function(dataSource) {
            var that = this;
            var entitySetName = dataSource.getName();
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }

            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.businessObjectMap[entitySetName];

            });
        },

        getBusinessObjectMetaDataByBusinessObjectName: function(entitySetName) {
            var that = this;

            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }

            return that._fillInternalBuffer().then(function() {
                return that.allInOneMap.businessObjectMap[entitySetName];

            });
        },

        getBusinessObjectMetaDataSync: function(dataSource) {
            var entitySetName = dataSource.getName();
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            this._fillInternalBufferSync();
            return this.allInOneMap.businessObjectMap[entitySetName];
        },

        getBusinessObjectMetaDataSyncByBusinessObjectName: function(entitySetName) {
            // check input parameters
            if (!entitySetName) {
                throw 'EntitySetName missing';
            }
            this._fillInternalBufferSync();
            return this.allInOneMap.businessObjectMap[entitySetName];
        },

        _fillInternalBufferSync: function() {
            // check buffer
            if (this.allInOneMap && jQuery.isEmptyObject(this.allInOneMap) !== true) {
                return;
            }

            // fire request
            this.allInOneMap = this._fireMetaRequest(false);
        },


        _fillInternalBuffer: function() {
            var that = this;

            // check if deferred exists
            if (this.allInOneMapDeferred) {
                return this.allInOneMapDeferred;
            }

            // do server request for getting metadata
            that.allInOneMapDeferred = that._fireMetaRequest().then(function(allInOneMap) {
                that.allInOneMap = allInOneMap;
            });

            return that.allInOneMapDeferred;
        },

        //parse entityset and its attributes from EntityType
        _parseEntityType: function(schema) {
            var that = this;
            var helperMap = {};

            schema.find('EntityType').each(function() {
                var entityTypeName = $(this).attr('Name');
                var entitySet = {
                    schema: schema.attr('Namespace'),
                    keys: [],
                    attributeMap: {}
                };
                helperMap[entityTypeName] = entitySet;

                //oData keys for accessing a entity
                $(this).find('Key>PropertyRef').each(function() {
                    entitySet.keys.push($(this).attr('Name'));
                });

                //Loop attributes
                $(this).find('Property').each(function(index) {

                    var attributeName = $(this).attr('Name');
                    var attribute = {
                        labelRaw: attributeName,
                        label: null,
                        type: $(this).attr('Type'),
                        isTitle: false,
                        presentationUsage: [],
                        displayOrder: index,
                        unknownAnnotation: []
                    };
                    entitySet.attributeMap[attributeName] = attribute;

                    $(this).find('Annotation').each(function() {
                        switch ($(this).attr('Term')) {
                            case 'SAP.Common.Label':
                                attribute.label = $(this).attr('String');
                                break;
                            case 'EnterpriseSearch.key':
                                attribute.enterprisesearchkey = $(this).attr('Bool') == "true" ? true : false;
                                break;
                            case 'EnterpriseSearch.presentationMode':
                                $(this).find('Collection>String').each(function() {
                                    var presentationUsage = $(this).text();
                                    presentationUsage = that.presentationUsageConversionMap[presentationUsage];
                                    if (presentationUsage) {
                                        attribute.presentationUsage.push(presentationUsage);
                                        if (presentationUsage.toLocaleLowerCase() === 'title') {
                                            attribute.isTitle = true;
                                        }
                                    }
                                    //                                    else {
                                    //                                        // TODO: log the unknown presentationUsage
                                    //                                    }

                                });
                                break;
                            default:
                                attribute.unknownAnnotation.push($(this));
                        }
                    });
                });
            });

            return helperMap;
        },

        //parse datasources from EntityContainer
        _parseEntityContainer: function(schemaXML, helperMap, allInOneMap) {
            var that = this;

            schemaXML.find('EntityContainer>EntitySet').each(function() {
                if ($(this).attr('Name') && $(this).attr('EntityType')) {
                    var name = $(this).attr('Name');
                    var entityTypeFullQualified = $(this).attr('EntityType');

                    var schema = entityTypeFullQualified.slice(0, entityTypeFullQualified.lastIndexOf('.'));
                    var entityType = entityTypeFullQualified.slice(entityTypeFullQualified.lastIndexOf('.') + 1);

                    var newDatasource = that.sina.createDataSource({
                        label: name,
                        labelPlural: name,
                        entityType: entityType,
                        name: name,
                        schema: schema,
                        sina: that.sina
                    });

                    allInOneMap.dataSourceMap[name] = newDatasource;
                    allInOneMap.dataSourcesList.push(newDatasource);


                    var entitySet = helperMap[entityType];
                    if (entitySet === undefined) {
                        throw 'EntityType ' + entityType + ' has no corresponding meta data!';
                    }
                    entitySet.name = name;
                    entitySet.dataSource = newDatasource;
                    allInOneMap.businessObjectMap[name] = entitySet;
                    allInOneMap.businessObjectList.push(entitySet);
                }
            });
        },


        _parseResponse: function(metaXML, dataSource) {
            var that = this;
            // all in one metadata map
            var allInOneMap = {
                businessObjectMap: {}, // entity map with attributes and entityset name as key
                businessObjectList: [], // list of all entities for convenience
                dataSourceMap: {}, // datasource map with entityset name as key
                dataSourcesList: [] // list of all datasources for convenience
            };

            $(metaXML).find('Schema').each(function() {
                var helperMap = that._parseEntityType($(this));

                that._parseEntityContainer($(this), helperMap, allInOneMap);
            });

            return allInOneMap;
        },

        _fireMetaRequest: function(async) {

            var that = this;

            var url = '/es/odata/callbuildin.xsjs/$metadata';

            var request = {
                async: async === undefined ? true : async,
                method: 'GET',
                url: url,
                processData: false,
                dataType: 'xml'
            };

            var metaRequestDeferred = $.ajax(request);
            if (request.async) {
                return metaRequestDeferred.then(function(metaXML) {
                    return that._parseResponse(metaXML);
                });
            } else {
                var metaXML = metaRequestDeferred.responseXML;
                return that._parseResponse(metaXML);
            }

        }

    };



}(window));
/* source file: impl/odata2/perspective.js */
/* global $, jQuery, window */
(function(global) {
    "use strict";
    /* eslint camelcase:0 */

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // perspective query
    // =======================================================================
    module.PerspectiveQuery = function() {
        this.init.apply(this, arguments);
    };

    module.PerspectiveQuery.prototype = jQuery.extend({}, base.PerspectiveQuery.prototype, {

        init: function() {
            base.PerspectiveQuery.prototype.init.apply(this, arguments);
        },

        _resetResultSet: function() {
            base.PerspectiveQuery.prototype._resetResultSet.apply(this, arguments);
            this.deferredResultSet = null;
            this.resultSet = null;
            this.jqXHR = null;
        },

        execute: function() {
            var that = this;
            var searchTerms = that.filter.searchTerms;
            var perspective;
            var dataSource = that.filter.dataSource;
            var top = that.top() || 10;
            var skip = that.skip() || 0;
            var facetLimit = 5;

            //construct search part of $apply
            var searchExpression = "Search.search(query='";
            if (!dataSource.equals(that.sina.getRootDataSource())) {
                searchExpression += "scope:" + dataSource.name + " ";
            }
            searchExpression += searchTerms + "')";

            //construct filter conditions part of $apply
            var filterString = '';
            var filterConditions = that.filter.getDataForRequest();
            if (filterConditions) {
                filterString = filterString + ' and ' + filterConditions;
            }

            var apply = 'filter(' + searchExpression + filterString + ')';

            var data = {
                $count: true,
                $top: top,
                $skip: skip,
                $apply: apply,
                whyfound: true
            };

            var url = '/es/odata/callbuildin.xsjs/$all';

            if (this.requestedEntities.indexOf('Facets') > -1) {
                data.facets = 'all';
                data.facetlimit = facetLimit;
            }

            return $.ajax({
                method: 'GET',
                data: data,
                url: url
            }).then(function(data) {
                perspective = new module.Perspective({
                    sina: that.sina,
                    dataSource: that.filter.dataSource
                });
                return perspective.setJsonFromResponse(data);
            });
        }

    });

    // =======================================================================
    // perspective
    // =======================================================================
    module.Perspective = function() {
        this.init.apply(this, arguments);
    };

    module.Perspective.prototype = jQuery.extend({}, base.Perspective.prototype, {

        setJsonFromResponse: function(data) {
            var that = this;


            // create searchfacet
            that.searchFacet = this.sina.createFacet({
                "facetType": base.FacetType.SEARCH
            });
            var resultSetPromise = that.searchFacet.setJsonFromResponse(data);


            // create chart facets
            that.chartFacets = [];
            var facetsJson = data['@com.sap.vocabularies.Search.v1.Facets'];

            if (facetsJson) {
                for (var i = 0; i < facetsJson.length; ++i) {
                    var facetJson = facetsJson[i];
                    var isConnectorFacet = facetJson['@com.sap.vocabularies.Search.v1.Facet.isConnectorFacet'];
                    var facet = this.sina.createFacet({
                        "facetType": isConnectorFacet === true ? base.FacetType.DATASOURCE : base.FacetType.ATTRIBUTE,
                        dataSource: that.dataSource
                    });
                    facet.setJsonFromResponse(facetJson);
                    that.chartFacets.push(facet);
                }
            }

            return jQuery.when([resultSetPromise]).then(function() {
                return that;
            });

        }

    });

}(window));
/* source file: impl/odata2/search.js */
/* global sap */
(function(global) {
    "use strict";
    /* eslint camelcase:0 */

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // search query
    // =======================================================================
    module.SearchQuery = function() {
        this.init.apply(this, arguments);
    };

    module.SearchQuery.prototype = jQuery.extend({}, base.SearchQuery.prototype, {

        init: function() {
            base.SearchQuery.prototype.init.apply(this, arguments);
            this.resultSet = new module.SearchResultSet({
                sina: this.sina
            });
        },

        executeSync: function() {
            return this.resultSet;
        }

    });

    // =======================================================================
    // search result set
    // =======================================================================
    module.SearchResultSet = function() {
        this.init.apply(this, arguments);
    };

    module.SearchResultSet.prototype = {

        init: function(properties) {
            properties = properties || {};
            this.sina = properties.sina;
            this.elements = [];
            this.totalcount = 0;
            this.dataSource = properties.dataSource;
        },

        getElements: function() {
            return this.elements;
        },

        createEmptyElement: function(dataSource) {
            return {
                $$RelatedActions$$: [],
                $$WhyFound$$: [],
                $$DataSourceMetaData$$: dataSource
            };
        },

        createAttribute: function(attributeName, attributeValue, displayOrder, attributeMetaData) {
            var attribute;
            if (attributeMetaData) {
                // client-side formatting for label if necessary
                // labelRaw untouched
                switch (attributeMetaData.type) {
                    case "Edm.DateTime":
                        // format date type
                        var rNumber = /[-]?\d+/;
                        var oDate = new Date(parseInt(rNumber.exec(attributeValue)[0], 10));

                        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            style: "medium"
                        });
                        attributeValue = oDateFormat.format(oDate);
                        break;

                        // no default
                }
                attribute = {
                    $$MetaData$$: {
                        presentationUsage: attributeMetaData.presentationUsage,
                        displayOrder: attributeMetaData.displayOrder
                    },
                    label: attributeMetaData.label,
                    labelRaw: attributeMetaData.labelRaw,
                    value: attributeValue,
                    valueRaw: attributeValue
                };
            } else {
                attribute = {
                    $$MetaData$$: {
                        presentationUsage: [],
                        displayOrder: displayOrder
                    },
                    label: attributeName,
                    labelRaw: attributeName,
                    value: attributeValue,
                    valueRaw: attributeValue
                };
            }
            return attribute;
        },

        parseRecord: function(record) {
            var that = this;
            //var dataSource = that.getDataSourcesByMetaInfo(record.__metadata.type);
            var entitySetName = record['@odata.context'] || that.dataSource.entityType;
            var posOfSeparator = entitySetName.lastIndexOf('#');
            if (posOfSeparator > -1) {
                entitySetName = entitySetName.slice(posOfSeparator + 1);
            }

            var whyFounds = record['@com.sap.vocabularies.Search.v1.WhyFound'] || {};

            return that.sina.getBusinessObjectMetaDataByBusinessObjectName(entitySetName).then(function(metaData) {
                var element = that.createEmptyElement(metaData.dataSource);
                var displayOrder = 0;
                for (var attributeName in record) {
                    if (attributeName[0] === '@' || attributeName[0] === '_') {
                        continue;
                    }

                    var attributeValue = record[attributeName];

                    //Postprocessing for whyfound
                    for (var attributeNameWhyfound in whyFounds) {
                        if (attributeNameWhyfound === attributeName && whyFounds[attributeNameWhyfound][0]) {
                            // replace attribue value with whyfound value
                            attributeValue = whyFounds[attributeNameWhyfound][0];
                        }
                    }
                    element[attributeName] = that.createAttribute(attributeName, attributeValue, ++displayOrder, metaData.attributeMap[attributeName]);
                }
                return element;
            });
        },

        setJsonFromResponse: function(data) {
            var that = this;
            //that.totalcount = data['@odata.count'] || data.d['__count'] || 1;
            that.totalcount = data['@odata.count'] || 0;
            that.totalcount = parseInt(that.totalcount, 10);
            var records = data.value || data.d.results;
            var elementDeferreds = [];
            that.elements = [];
            for (var i = 0; i < records.length; ++i) {
                var record = records[i];
                elementDeferreds.push(this.parseRecord(record).done(function(element) {
                    /* eslint no-loop-func:0*/
                    that.elements.push(element);
                }));
            }
            return jQuery.when.apply(null, elementDeferreds).then(function() {
                return arguments;
            });
        }
    };

}(window));
/**** source file: impl/odata2/chart.js */
/* global $ */
(function(global) {
    /* eslint camelcase:0, new-cap:0, no-warning-comments:0 */
    "use strict";

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    //    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    //    var filter = global.sap.bc.ina.api.sina.impl.inav2.filter;
    //    var datasource = global.sap.bc.ina.api.sina.impl.inav2.datasource;

    // =======================================================================
    // chart query
    // =======================================================================

    module.ChartQuery = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class chart query
     */
    module.ChartQuery.prototype = jQuery.extend({}, base.ChartQuery.prototype, {

        init: function(properties) {
            properties = properties || {};
            base.ChartQuery.prototype.init.apply(this, [properties]);
            this.dimensions = [];
            this.attributeLimit = 1000;
        },

        executeSync: function() {
            return this.resultSet;
        },

        addDimension: function(dimension) {
            if (jQuery.type(dimension) === 'object') {
                if (jQuery.isEmptyObject(dimension) || !dimension.name) {
                    return;
                }
                this.dimensions.push(dimension.name);
            } else if (jQuery.type(dimension) === 'string') {
                if (!dimension) {
                    return;
                }
                this.dimensions.push(dimension);
            }
        },

        setAttributeLimit: function(limit) {
            this.attributeLimit = limit;
        },

        getTitle: function(dataSourceName) {
            if (dataSourceName === undefined && this.filter.dataSource && this.filter.dataSource.name) {
                dataSourceName = this.filter.dataSource.name;
            }
            if (!dataSourceName) {
                return 'Default Title';
            }
            var metaData = this.sina.getBusinessObjectMetaDataSyncByBusinessObjectName(dataSourceName).attributeMap;
            var label = metaData[this.dimensions[0]].label;
            return label;
        },

        execute: function() {
            var that = this;
            var searchTerms = that.filter.searchTerms;
            var dataSource = that.filter.dataSource;
            var top = this.attributeLimit || 5;
            var skip = 0;
            var dimension = that.dimensions[0];

            //construct search part of $apply
            var searchExpression = "Search.search(query='";
            if (!dataSource.equals(that.sina.getRootDataSource())) {
                searchExpression += "scope:" + dataSource.name + " ";
            }
            searchExpression += searchTerms + "')";

            //construct filter conditions part of $apply
            var filterString = '';
            var filterConditions = that.filter.getDataForRequest();
            if (filterConditions) {
                filterString = filterString + ' and ' + filterConditions;
            }

            //construct groupby part of apply
            var groupByStr = '';
            if (dimension) {
                groupByStr = '/groupby((' + dimension + '),aggregate($count as _Count))';
            }

            var apply = 'filter(' + searchExpression + filterString + ')' + groupByStr;

            var data = {
                $count: true,
                $top: top,
                $skip: skip,
                $apply: apply
            };

            var url = '/es/odata/callbuildin.xsjs/$all';


            return $.ajax({
                method: 'GET',
                data: data,
                url: url
            }).then(function(data) {
                var resultSet = new module.ChartResultSet({
                    dimensions: that.dimensions,
                    sina: that.sina,
                    datasource: that.filter.dataSource
                });
                return resultSet.setJsonFromResponseGroupBy(data);
            });
        }
    });

    // =======================================================================
    // chart result set
    // =======================================================================

    module.ChartResultSet = function() {
        this.init.apply(this, arguments);
    };

    /**
     * class chart result set
     */
    module.ChartResultSet.prototype = {

        init: function(properties) {
            properties = properties || {};
            this.type = properties.type;
            this.sina = properties.sina;
            this.datasource = properties.datasource;
            this.elements = [];
            this.dimensions = properties.dimensions;
        },

        setJsonFromResponse: function(data) {
            var attributeName = data['@com.sap.vocabularies.Common.v1.Facet.PropertyName'];

            // flag for connector facet
            var isConnectorFacet = data['@com.sap.vocabularies.Search.v1.Facet.isConnectorFacet'];
            this.elements = [];
            for (var i = 0; i < data.Items.length; ++i) {
                var item = data.Items[i];
                var element = {};
                if (isConnectorFacet == true) {
                    var dataSource = this.sina.getDataSourceSyncByBusinessObjectName(item[attributeName]);
                    element = {
                        dataSource: dataSource,
                        label: dataSource.getLabel(),
                        labelRaw: item[attributeName],
                        value: item._Count,
                        valueRaw: item._Count
                    };
                } else {
                    var itemLabel = item[attributeName + '@com.sap.vocabularies.Common.v1.Label'];
                    element = {
                        label: itemLabel,
                        labelRaw: this.sina.createFilterCondition(attributeName, "eq", item[attributeName], this.datasource.getMetaDataSync().attributeMap[attributeName].label, itemLabel, itemLabel),
                        value: item._Count,
                        valueRaw: item._Count
                    };
                }
                this.elements.push(element);
            }

        },

        setJsonFromResponseGroupBy: function(data) {
            var that = this;
            var dimension = that.dimensions[0];
            var lableKey = dimension + '@com.sap.vocabularies.Common.v1.Label';

            var records = data.value;
            for (var i = 0; i < records.length; ++i) {
                var recordJson = records[i];
                var element = {
                    label: recordJson[lableKey],
                    labelRaw: this.sina.createFilterCondition(dimension, "eq", recordJson[dimension], this.datasource.getMetaDataSync().attributeMap[dimension].label, recordJson[lableKey], recordJson[lableKey]),
                    value: recordJson._Count,
                    valueRaw: recordJson._Count
                };
                that.elements.push(element);
            }
            return that;
        },

        getElements: function() {
            return this.elements;
        }
    };

}(window));

/* source file: impl/odata2/facet.js */
(function(global) {
    /* eslint camelcase:0 */
    "use strict";

    // =======================================================================
    // declare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // class facet
    // =======================================================================
    module.Facet = function() {
        this.init.apply(this, arguments);
    };


    module.Facet.prototype = jQuery.extend({}, base.Facet.prototype, {

        setJsonFromResponse: function(data) {
            if (this.facetType === base.FacetType.DATASOURCE) {
                this.query = this.sina.createChartQuery();
                this.query.resultSet = new module.ChartResultSet({
                    sina: this.sina
                });
            } else if (this.facetType === base.FacetType.ATTRIBUTE) {
                this.query = this.sina.createChartQuery();
                this.query.resultSet = new module.ChartResultSet({
                    sina: this.sina,
                    datasource: this.dataSource
                });
            } else if (this.facetType === base.FacetType.SEARCH) {
                this.query = this.sina.createSearchQuery();
                this.query.resultSet = new module.SearchResultSet({
                    sina: this.sina
                });
            }

            if (this.facetType === base.FacetType.ATTRIBUTE) {
                this.dimension = data['@com.sap.vocabularies.Common.v1.Facet.PropertyName'];
                this.query.addDimension(this.dimension);
                this.title = data['@com.sap.vocabularies.Common.v1.Label'];
                // this.title = this.query.getTitle(this.dataSource.name);
            }

            return this.query.resultSet.setJsonFromResponse(data);
        }

    });

}(window));

/* global jQuery, window, $ */

/* source file: impl/odata2/suggestion.js */
(function(global) {
    "use strict";
    /* eslint camelcase:0 */

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;

    // =======================================================================
    // suggestion query
    // =======================================================================
    module.SuggestionQuery = function() {
        this.init.apply(this, arguments);
    };

    module.SuggestionQuery.prototype = jQuery.extend({}, base.SuggestionQuery.prototype, {

        init: function() {
            base.SuggestionQuery.prototype.init.apply(this, arguments);
            this.suggestionTerm = null;
            this.options = [];
            this.deferredResultSet = null;
        },

        setOptions: function(options) {
            this.options = options;
            this._resetResultSet();
        },

        setSuggestionTerm: function(term) {
            if (this.suggestionTerm !== term) {
                this.suggestionTerm = term;
                this._resetResultSet();
            }
            return this;
        },

        _resetResultSet: function() {
            this.deferredResultSet = null;
        },

        execute: function() {

            var that = this;

            // check cache
            if (this.deferredResultSet) {
                return this.deferredResultSet;
            }

            // only object data suggestions supported otherwise result is empty
            if (this.suggestionTypes.indexOf(this.sina.SuggestionType.OBJECTDATA) < 0) {
                this.deferredResultSet = jQuery.when(new module.SuggestionResultSet({
                    sina: this.sina
                }));
                return this.deferredResultSet;
            }

            // do ajax request
            var url = "/es/odata/callbuildin.xsjs/$all/GetSuggestion(term='" + this.suggestionTerm + "')";
            this.deferredResultSet = $.ajax({
                method: 'GET',
                url: url
            }).then(function(data) {
                var resultSet = new module.SuggestionResultSet({
                    sina: that.sina
                });
                return resultSet.setJsonFromResponse(data);
            });
            return this.deferredResultSet;

        }

    });

    // =======================================================================
    // suggestion result set
    // =======================================================================
    module.SuggestionResultSet = function() {
        this.init.apply(this, arguments);
    };

    module.SuggestionResultSet.prototype = jQuery.extend({}, base.SuggestionQuery.prototype, {

        init: function(properties) {
            this.sina = properties.sina;
            this.elements = [];
        },

        setJsonFromResponse: function(data) {

            var that = this;
            return that.sina.getDataSources().then(function(dataSources) {

                var suggestionsJson = data.value;
                for (var i = 0; i < suggestionsJson.length; ++i) {
                    var suggestionJson = suggestionsJson[i];
                    var suggestion = {
                        children: [],
                        label: suggestionJson.term,
                        labelRaw: suggestionJson.term,
                        value: 0,
                        valueRaw: 0,
                        dataSource: that.sina.getRootDataSource(),
                        type: that.sina.SuggestionType.OBJECTDATA,
                        attribute: {
                            value: '$$AllAttributes$$'
                        }
                    };
                    that.elements.push(suggestion);
                    suggestion = {
                        children: [],
                        label: suggestionJson.term,
                        labelRaw: suggestionJson.term,
                        value: 0,
                        valueRaw: 0,
                        dataSource: that.sina.getDataSourceSyncByBusinessObjectName(suggestionJson.scope),
                        type: that.sina.SuggestionType.OBJECTDATA,
                        attribute: {
                            value: '$$AllAttributes$$'
                        }
                    };
                    that.elements.push(suggestion);
                }
                return that;

            });

        },

        getElements: function() {
            return this.elements;
        }

    });

}(window));
/* global jQuery, window */
/* source file: impl/odata2/sina.js */
(function(global) {
    "use strict";
    /* eslint camelcase:0 */

    // =======================================================================
    // delcare own package
    // =======================================================================
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.odata2');
    var module = global.sap.bc.ina.api.sina.impl.odata2;

    // =======================================================================
    // import packages
    // =======================================================================
    var base = global.sap.bc.ina.api.sina.base;
    var system = global.sap.bc.ina.api.sina.impl.odata2.system;
    var filter = global.sap.bc.ina.api.sina.impl.odata2.filter;
    var datasource = global.sap.bc.ina.api.sina.impl.odata2.datasource;
    var proxy = global.sap.bc.ina.api.sina.proxy;
    var datasourcebase = global.sap.bc.ina.api.sina.base.datasource;


    // =======================================================================
    // sina
    // =======================================================================
    module.Sina = function() {
        this.init.apply(this, arguments);
    };

    module.Sina.prototype = jQuery.extend({}, base.Sina.prototype, {
        init: function() {
            this.setSystem(new system.System({
                proxy: new proxy.Proxy({})
            }));
            base.Sina.prototype.init.apply(this, arguments);
            //impossible to use createDataSource() because provider is still not filled at this moment
            this.rootDataSource = new datasource.DataSource({
                label: 'All',
                labelPlural: 'All',
                name: '$$ALL$$',
                type: datasourcebase.DataSourceType.CATEGORY,
                sina: this
            });
            base.provider.odata2.metaDataService.sina = this;
        },

        getRootDataSource: function() {
            return this.rootDataSource;
        }

    });

    // =======================================================================
    // register sina provider
    // =======================================================================
    module.IMPL_TYPE = 'odata2';

    base.registerProvider({
        impl_type: module.IMPL_TYPE,
        sina: module.Sina,
        Facet: module.Facet,
        chartQuery: module.ChartQuery,
        searchQuery: module.SearchQuery,
        suggestionQuery: module.SuggestionQuery,
        perspectiveQuery: module.PerspectiveQuery,
        metaDataService: new module.MetaDataService(),
        Filter: filter.Filter,
        FilterCondition: filter.Condition,
        FilterConditionGroup: filter.ConditionGroup,
        DataSource: datasource.DataSource
    });

}(window));
/* source file: sina.js */
/*
 * @file Simple info access (SINA) API: Factory
 * @namespace sap.bc.ina.api.sina
 * @requires jQuery
 * @copyright 2014 SAP SE. All rights reserved.
 */
(function(global) {
    /* eslint camelcase:0, new-cap:0 */
    "use strict";

    /**
     * import packages
     */
    var base = global.sap.bc.ina.api.sina.base;

    /**
     * create package
     */
    global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina');

    /**
     * shortcut for own module
     */
    var module = global.sap.bc.ina.api.sina;
    module.properties = module.properties || {};


    /**
     * global fields
     */
    if (module.impl && module.impl.inav2 && module.impl.inav2.IMPL_TYPE) {
        /**
         * SAP HANA info access HTTP service implementation of SINA.
         * @memberOf sap.bc.ina.api
         * @constant
         */
        module.SINA_TYPE_INAV2 = module.impl.inav2.IMPL_TYPE;
    }

    /**
     * Factory method for the SINA API. Optionally, you can choose a service implementation to be used.
     * @memberOf sap.bc.ina.api.sina
     * @param {Object} [properties] properties object
     * @param {String} [properties.impl_type=sap.bc.ina.api.sina.impl.inav2.sina_impl.IMPL_TYPE] Define the service type to be used by the SINA API.
     * @return {sap.bc.ina.api.sina.impl.inav2.Sina} The instance of SINA. If no properties object was provided, it will return an instance
     * that uses the info access HTTP service (V2) on an SAP HANA system.
     * @since SAP HANA SPS 06
     * @public
     */
    module.getSina = function(properties) {
        properties = properties || {};
        properties.impl_type = properties.impl_type || module.SINA_TYPE_INAV2;
        if (properties.impl_type === module.SINA_TYPE_INAV2) {
            // global.console.warn("INA V2 provider is deprecated and will be removed, also as default provider, within the next HANA SPS. Use OData provider instead!");
            if (!properties.system) {
                var inaV2Proxy = module.impl.inav2.proxy;
                var inaV2System = module.impl.inav2.system;
                var newProxy = new inaV2Proxy.Proxy(properties);
                var sys;
                if (properties.systemType && properties.systemType.toUpperCase() === 'ABAP') {
                    sys = new inaV2System.ABAPSystem({
                        'proxy': newProxy
                    });
                } else {
                    sys = new inaV2System.HANASystem({
                        'proxy': newProxy
                    });
                }
                newProxy.setXSRFService(sys.infoUrl);
                properties.system = sys;
            }
        }
        if (base.provider[properties.impl_type] && base.provider[properties.impl_type].sina) {
            var sina = new base.provider[properties.impl_type].sina(properties);
            sina._provider = base.provider[properties.impl_type];
            return sina;
        }
        return {};
    };

    /**
     * Default instantiation of SINA. After page load a SINA instance will be provided with default
     * settings if there is not already a global SINA instance at sap.bc.ina.api.sina.
     * If you need other settings, create your own SINA instance using the factory getSina - which is recommended
     * @memberOf sap.bc.ina.api.sina
     * @type {sap.bc.ina.api.sina.impl.inav2.Sina}
     * @since SAP HANA SPS 06
     * */
    module.properties.impl_type = module.properties.impl_type || 'inav2';

    // without extend the new global sina instance would overwrite everything after sap.bc.ina.sina !!!
    global.sap.bc.ina.api.sina = jQuery.extend({}, module, module.getSina(module.properties));

    return global.sap.bc.ina.api.sina;

}(window));
