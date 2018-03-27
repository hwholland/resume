/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/test/_LogCollector"],function($,_){"use strict";var l=$.sap.log.getLogger("sap.ui.test.matchers.Ancestor",_.DEFAULT_LEVEL_FOR_OPA_LOGGERS);return function(a,d){return function(c){if(!a){l.debug("No ancestor was defined so no controls will be filtered.");return true;}var p=c.getParent();while(!d&&p&&p!==a){p=p.getParent();}var r=p===a;if(!r){l.debug("Control '"+c+"' does not have "+(d?"direct ":"")+"ancestor '"+a);}return r;};};},true);
