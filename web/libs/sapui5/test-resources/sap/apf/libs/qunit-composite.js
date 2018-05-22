/*
 * Credits: jQuery UI unit test suite - https://github.com/jquery/jquery-ui/
 */

(function( QUnit ) {

QUnit.extend( QUnit, {
	testSuites: function( suites ) {
		QUnit.begin(function() {
			QUnit.initIframe();
		});

		for ( var i = 0; i < suites.length; i++ ) {
			QUnit.runSuite( suites[i] );
		}

		QUnit.done(function() {
			this.iframe.style.display = "none";
		});
	},

	runSuite: function( suite ) {
		var path = suite;

		if ( QUnit.is( "object", suite ) ) {
			path = suite.path;
			suite = suite.name;
		}

		asyncTest( suite, function() {
			QUnit.iframe.setAttribute( "src", path );
			globalflag = false;
			setTimeout(function(){
				if(!globalflag){
					globalflag = true;
					start();
				}
			},60000);
		});
	},

	initIframe: function() {
		var body = document.body,
			iframe = this.iframe = document.createElement( "iframe" ),
			iframeWin;

		iframe.className = "qunit-subsuite";
		body.appendChild( iframe );

		function onIframeLoad() {
			var module, test,
				count = 0;

			if (iframe.src === "") {
				return;
			}

			iframeWin.QUnit.moduleStart(function( data ) {
				// capture module name for messages
				module = data.name;
			});

			iframeWin.QUnit.testStart(function( data ) {
				// capture test name for messages
				test = data.name;
			});
			iframeWin.QUnit.testDone(function() {
				test = null;
			});

			iframeWin.QUnit.log(function( data ) {
				if (test === null) {
					return;
				}
				// pass all test details through to the main page
				var message = module + ": " + test + ": " + data.message;
				expect( ++count );
				QUnit.push( data.result, data.actual, data.expected, message );
			});

			iframeWin.QUnit.done(function() {
				// start the wrapper test from the main page
				if (!globalflag){
					globalflag = true;
					start();
				}
			});
		}
		QUnit.addEvent( iframe, "load", onIframeLoad );

		iframeWin = iframe.contentWindow;
	}
});

QUnit.testStart(function( data ) {
	// update the test status to show which test suite is running
	QUnit.id( "qunit-testresult" ).innerHTML = "Running " + data.name + "...<br>&nbsp;";
});

QUnit.testDone(function() {
	var i,
		current = QUnit.id( this.config.current.id ),
		children = current.children,
		src = this.iframe.src;

	// undo the auto-expansion of failed tests
	for ( i = 0; i < children.length; i++ ) {
		if ( children[i].nodeName === "OL" ) {
			children[i].style.display = "none";
		}
	}

	QUnit.addEvent(current, "dblclick", function( e ) {
		var target = e && e.target ? e.target : window.event.srcElement;
		if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
			target = target.parentNode;
		}
		if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
			window.location = src;
		}
	});

	current.getElementsByTagName("a")[0].href = src;
	
	// Extracting blanket coverage result from test fixture within iframe and injecting into the test suite item
	if (QUnit.iframe && QUnit.iframe.contentWindow.jQuery) {

		var iframeCoverage = QUnit.iframe.contentWindow.jQuery("#blanket-main");
		var currentTest = jQuery("#" + this.config.current.id);
		
		// Coverage result anchor links
		var anchors = jQuery(iframeCoverage).find("a").not(".bl-logo");
		
		if (anchors !== undefined) {
			for (var i = 0; i < anchors.length; i++) {
				var href = anchors[i].href;
				var re = /\(\"(.*)\"\)/;
				var oldElemId = href.match(re)[1];
				var fileIndex = href.indexOf(oldElemId);
				href = href.splice(fileIndex, 0, this.config.current.id + "-");
				// Update href of anchor to ensure unique file ids
			    jQuery(anchors[i]).attr('href', href);
				var newElemId = href.match(re)[1];
				var oldElem = jQuery(iframeCoverage).find("#" + oldElemId)[0];
				// Update div id of hidden file content to match with earlier generated unique file id
				if (oldElem) {
					jQuery(oldElem).attr('id', newElemId);
				}
			}
		}
		
		// Append the iframe coverage result to current test element in test suite
		if (iframeCoverage && currentTest) {
			currentTest.append(iframeCoverage);
		}
	}
});

}( QUnit ) );

// Added for string manipulation - to support blanket coverage injection into test suite
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};