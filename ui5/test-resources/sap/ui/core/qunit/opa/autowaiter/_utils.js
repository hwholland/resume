sap.ui.define([
	"sap/ui/Device",
	"sap/ui/test/autowaiter/_utils",
	"sap/ui/test/opaQunit"
], function (Device, _utils) {
	"use strict";

	QUnit.module("AutoWaiter - utils");

	var argumentsToString = function () {
		return _utils.argumentsToString(arguments);
	};

	QUnit.test("Should resolve stack trace", function callingFunction (assert) {
		var sTrace = _utils.resolveStackTrace();
		QUnit.assert.contains(sTrace, "callingFunction");
		assert.ok(!sTrace.match(/^Error\n/));
	});

	QUnit.test("Should get function string representation", function (assert) {
		var sFunc = _utils.functionToString(function foo (bar) {
			console.log("foo", bar);
		});
		assert.ok(sFunc.match(/^function ?foo ?\(bar\) ?{\n\t\t\tconsole.log\('foo', bar\);\n\t\t}$/));
	});

	QUnit.test("Should get array-like object string representation", function (assert) {
		var fnTestFunc = function foo (bar) {
			console.log("foo", bar);
		};
		var Foo = function () {};
		assert.strictEqual(argumentsToString(), "", "Should handle no args");
		assert.strictEqual(argumentsToString("fooBar"), "'fooBar'", "Should handle string in args");
		assert.strictEqual(argumentsToString(5.3), "'5.3'", "Should handle number in args");
		assert.strictEqual(argumentsToString(new Foo()), "'[object Object]'", "Should handle object in args");
		assert.ok(argumentsToString(fnTestFunc).match(/^'function ?foo ?\(bar\) ?{\n\t\t\tconsole.log\('foo', bar\);\n\t\t}'$/), "Should use function string representation");
		assert.strictEqual(argumentsToString({foo: "bar", foo1: {a: 5}, foo2: [1]}), "{\"foo\":\"bar\",\"foo1\":{\"a\":5},\"foo2\":[1]}", "Should handle plain objects");
		var sArgWithArray = argumentsToString(["foo", fnTestFunc, new Foo(), {a: 2, b: "foo"}]);
		assert.ok(sArgWithArray.match(/^\['foo', 'function ?foo ?\(bar\) ?{\n\t\t\tconsole.log\('foo', bar\);\n\t\t}', '\[object Object\]', {\"a\":2,\"b\":\"foo\"}\]$/), "Should handle arrays");
	});
});
