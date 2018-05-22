(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.shell.ShellLayout");
    jQuery.sap.require("sap.ushell.resources");

    sap.ui.core.Control.extend("my.Test", {
        renderer: function (rm, ctrl) {
            rm.write("<div style='width:10px;height:10px;background-color:gray;'");
            rm.writeControlData(ctrl);
            rm.write("></div>");
        }
    });

    var oShell,
        oShell2,
        oSearchButton;

    module("sap.ushell.ui.shell.ShellLayout", {
        setup: function () {
            jQuery('<div id="canvas"></div>').appendTo('body');
            var oShellSplitContainer,
                oShellToolArea,
                oShellHeaderTitle,
                oShellHeader,
                oShellFloatingActions,
                oShellFloatingContainer,
                oShellSplitContainer2,
                oShellToolArea2,
                oShellHeaderTitle2,
                oShellHeader2,
                oShellFloatingActions2,
                oShellFloatingContainer2;

            oShellSplitContainer = new sap.ushell.ui.shell.SplitContainer({
                id: 'shell-split',
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });
            oShellToolArea = new sap.ushell.ui.shell.ToolArea({
                id: 'shell-toolArea',
                toolAreaItems: [new sap.ushell.ui.shell.ToolAreaItem("_toolarea_itm")]
            });

            oShellHeaderTitle = new sap.ushell.ui.shell.ShellTitle("shellTitle", {
                text: ""
            });

            oSearchButton = new sap.ushell.ui.shell.ShellHeadItem("sf");

            oShellHeader = new sap.ushell.ui.shell.ShellHeader({
                id: 'shell-header',
                headItems: [new sap.ushell.ui.shell.ShellHeadItem("_itm"), oSearchButton],
                headEndItems: [new sap.ushell.ui.shell.ShellHeadItem("_end_itm")],
                user: new sap.ushell.ui.shell.ShellHeadUserItem("_useritm", {
                    username: "name",
                    image: "sap-icon://person-placeholder"
                }),
                title: oShellHeaderTitle,
                search: new my.Test("search")
            });

            oShellFloatingActions = new sap.ushell.ui.shell.ShellFloatingActions({
                id: 'shell-floatingActions',
                floatingActions: [new sap.ushell.ui.shell.ShellFloatingAction("_floatingAction")]
            });

            oShellFloatingContainer = new sap.ushell.ui.shell.FloatingContainer({
                id: "shell-floatingContainer",
                content: [new sap.m.Button("testButton", {test: "testButton"})]
            });

            oShell = new sap.ushell.ui.shell.ShellLayout({
                id: "shell",
                header: oShellHeader,
                toolArea: oShellToolArea,
                canvasSplitContainer: oShellSplitContainer,
                floatingContainer: oShellFloatingContainer,
                floatingActionsContainer: oShellFloatingActions
            });

            oShellSplitContainer2 = new sap.ushell.ui.shell.SplitContainer({
                showSecondaryContent: true
            });

            oShellToolArea2 = new sap.ushell.ui.shell.ToolArea({
                textVisible: false
            });

            oShellHeaderTitle2 = new sap.ushell.ui.shell.ShellTitle("shellTitle2", {
                text: "TITLE"
            });

            oShellHeader2 = new sap.ushell.ui.shell.ShellHeader({
                title: oShellHeaderTitle2,
                searchVisible: false,
                logo: "../icon.png"
            });

            oShellFloatingContainer2 = new sap.ushell.ui.shell.FloatingContainer({
                id: "shell-floatingContainer2",
                content: [new sap.m.Button("testButton2", {test: "testButton"})]
            });

            oShellFloatingActions2 = new sap.ushell.ui.shell.ShellFloatingActions({
                isFooterVisible: true
            });

            oShell2 = new sap.ushell.ui.shell.ShellLayout({
                id: "shell2",
                header: oShellHeader2,
                toolArea: oShellToolArea2,
                canvasSplitContainer: oShellSplitContainer2,
                floatingActionsContainer: oShellFloatingActions2,
                floatingContainer: oShellFloatingContainer2,
                headerHiding: true,
                headerVisible: false,
                toolAreaVisible: true
            });

            oShell.placeAt('canvas');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oShell.destroy();
            oShell2.destroy();
            oSearchButton.destroy();
            jQuery("#canvas").remove();
        }
    });

    /** ----------**/
    /** Rendering **/
    /** ----------**/
    asyncTest("Content", function () {
        setTimeout(function () {
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-center"), jQuery.sap.domById("search")), "Search rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-begin"), jQuery.sap.domById("_itm")), "Header Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_end_itm")), "Header End Items rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_useritm")), "User button rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-canvas"), jQuery.sap.domById("_ctnt")), "Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-pane"), jQuery.sap.domById("_pane_ctnt")), "Pane Content rendered correctly");
            ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-floatingContainer"), jQuery.sap.domById("testButton")), "FloatingContainer rendered correctly");
            start();
            oShell.destroy();
        }, 500);
    });

    /** ----**/
    /** API **/
    /** ----**/
    test("Properties - Default Values", function () {
        equal(oShell.getHeaderHiding(), false, "Default 'headerHiding'");
        equal(oShell.getHeaderVisible(), true, "Default 'headerVisible'");
        equal(oShell.getToolAreaVisible(), false, "Default 'toolAreaVisible'");
        equal(oShell.getHeader().getLogo(), "", "Default 'icon'");
        equal(oShell.getFloatingContainerVisible(), false, "Default FloatingContainer visiblity 'false'");
        equal(oShell.getHeader().getSearchVisible(), true, "Default 'searchVisible'");
        equal(oShell.getHeader().getTitle().getText(), "", "Default Title");
        equal(oShell.getFloatingActionsContainer().getIsFooterVisible(), false, "Default 'isFooterVisible'");
        equal(oShell.getToolArea().getTextVisible(), true, "Default toolarea 'textVisible'");
    });

    test("Properties - Custom Values", function () {
        equal(oShell2.getHeaderHiding(), true, "Custom 'headerHiding'");
        equal(oShell2.getHeaderVisible(), false, "Default 'headerVisible'");
        equal(oShell2.getToolAreaVisible(), true, "Default 'toolAreaVisible'");
        equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom 'icon'");
        equal(oShell2.getHeader().getSearchVisible(), false, "Custom 'searchVisible'");
        equal(oShell2.getHeader().getTitle().getText(), "TITLE", "Default Title");
        equal(oShell2.getFloatingActionsContainer().getIsFooterVisible(), true, "Custom 'isFooterVisible'");
        equal(oShell2.getToolArea().getTextVisible(), false, "Default toolarea 'textVisible'");
    });

    test("Set/Get title", function () {
        equal(oShell.getHeader().getTitle().getText(), "", "Default Title - no value exist");// default
        oShell.getHeader().getTitle().setText("DEMO_TITLE");
        equal(oShell.getHeader().getTitle().getText(), "DEMO_TITLE", "Custom Title");// set a new value
        oShell.getHeader().getTitle().setText("");
        equal(oShell.getHeader().getTitle().getText(), "", "Empty Title");// empty value
        oShell.setFloatingContainerVisible(true);
        equal(oShell.getFloatingContainerVisible(), true, "Floating Container visibility was set to true");
    });

    test("Set/Get logo", function () {
        equal(oShell.getHeader().getLogo(), "", "Default logo - no value exist");// default
        oShell.getHeader().setLogo("../icon.png");
        equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom Logo");
        oShell.getHeader().setLogo("");
        equal(oShell.getHeader().getLogo(), "", "no value exist");// default
    });

	asyncTest("Logo is hidden in mobile when search button is hidden (search field is open)", function () {
		jQuery("html").addClass("sapUiMedia-Std-Phone");
		var defaultDevice = sap.ui.Device.system.phone;
		sap.ui.Device.system.phone = true;
		oSearchButton.setVisible(true);
		equal(jQuery(".sapUshellShellIco").hasClass("sapUshellShellHidden"), false, "logo is visible when search field is closed");
		oSearchButton.setVisible(false);

		setTimeout(function() {
			start();
			equal(jQuery(".sapUshellShellIco").hasClass("sapUshellShellHidden"), true, "logo is hidden when search field is opened");
			sap.ui.Device.system.phone = defaultDevice;
			jQuery("html").removeClass("sapUiMedia-Std-Phone");
		}, 0);
	});

	test("Shell Header Types", function () {
		var oHeader = oShell.getHeader();
		ok(oHeader instanceof sap.ushell.ui.shell.ShellHeader, "Header type is correct");

		var oUser = oHeader.getMetadata().getAllAggregations()["user"];
		equal(oUser.type, "sap.ushell.ui.shell.ShellHeadUserItem", "User type is correct");

		var oTitle = oHeader.getMetadata().getAllAggregations()["title"];
		equal(oTitle.type, "sap.ushell.ui.shell.ShellTitle", "Title type is correct");

		var oHeadItems = oHeader.getMetadata().getAllAggregations()["headItems"];
		equal(oHeadItems.type, "sap.ushell.ui.shell.ShellHeadItem", "Head Items type is correct");

		var oHeadEndItems = oHeader.getMetadata().getAllAggregations()["headEndItems"];
		equal(oHeadEndItems.type, "sap.ushell.ui.shell.ShellHeadItem", "Head End Items type is correct");
	});

	test("Shell Header - add / remove HeadItems", function () {
		var oHeader = oShell.getHeader(),
			oHeadItems = oHeader.getHeadItems(),
			headItem = sap.ui.getCore().byId("_itm"),
			newHeadItem = new sap.ushell.ui.shell.ShellHeadItem("_itm2");

		equal(oHeadItems.length, 2, "Initial number of headItems controls");

		oHeader.addHeadItem(newHeadItem);
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 3, "number of headItems controls after add");

		oHeader.removeHeadItem(newHeadItem);
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 2, "number of headItems controls after remove");

		oHeader.removeAllHeadItems();
		oHeadItems = oHeader.getHeadItems();
		equal(oHeadItems.length, 0, "number of headItems controls after removeAll");

		headItem.destroy();
		newHeadItem.destroy();
	});

	test("Shell Header - add / remove HeadEndItems", function () {
		var oHeader = oShell.getHeader(),
			oHeadEndItems = oHeader.getHeadEndItems(),
			headEndItem = sap.ui.getCore().byId("_end_itm"),
			newHeadEndItem = new sap.ushell.ui.shell.ShellHeadItem("_end_itm2");

		equal(oHeadEndItems.length, 1, "Initial number of headEndItems controls");

		oHeader.addHeadEndItem(newHeadEndItem);
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 2, "number of headEndItems controls after add");

		oHeader.removeHeadEndItem(newHeadEndItem);
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 1, "number of headEndItems controls after remove");

		oHeader.removeAllHeadEndItems();
		oHeadEndItems = oHeader.getHeadEndItems();
		equal(oHeadEndItems.length, 0, "number of headEndItems controls after removeAll");

		headEndItem.destroy();
		newHeadEndItem.destroy();
	});

	test("Shell Header - set / destroy ShellTitle", function () {
		var oHeader = oShell.getHeader(),
			oTitle = oHeader.getTitle(),
			newTitle = new sap.ushell.ui.shell.ShellTitle("title_2");

		ok(oTitle, "title control exists");

		oHeader.destroyTitle();
		oTitle = oHeader.getTitle();
		equal(oTitle, null, "No ShellTitle controls after destroy");

		oHeader.setTitle(newTitle);
		oTitle = oHeader.getTitle();
		ok(oTitle, "Title exists after set");
	});

	test("Shell Header - set / destroy ShellHeadUserItem", function () {
		var oHeader = oShell.getHeader(),
			oUser = oHeader.getUser(),
			newUser = new sap.ushell.ui.shell.ShellHeadUserItem("_useritm2", {username: "name2"});

		ok(oUser, "User Control exists");
		equal(oUser.getUsername(), "name", "correct username");
		equal(oUser.getImage(), "sap-icon://person-placeholder", "correct image");

		oHeader.destroyUser();
		oUser = oHeader.getUser();
		equal(oUser, null, "No ShellHeadUserItem controls after destroy");

		oHeader.setUser(newUser);
		oUser = oHeader.getUser();
		ok(oUser, "User exists after set");
	});

	test("Shell Header - set / destroy Search", function () {
		var oHeader = oShell.getHeader(),
			oSearch = oHeader.getSearch(),
			newSearch = new sap.ui.core.Control();

		ok(oSearch, "search control exists");

		oHeader.destroySearch();
		oSearch = oHeader.getSearch();
		ok(!oSearch, "No search control after destroy");

		oHeader.setSearch(newSearch);
		oSearch = oHeader.getSearch();
		ok(!!oSearch, "Search control available after set");
	});

	test("Floating Actions - types ", function () {
		var oFloatingActionsContainer = oShell.getFloatingActionsContainer();
		ok(oFloatingActionsContainer instanceof sap.ushell.ui.shell.ShellFloatingActions, "Floating Actions type is correct");

		var oFloatingActions = oFloatingActionsContainer.getMetadata().getAllAggregations()["floatingActions"];
		equal(oFloatingActions.type, "sap.ushell.ui.shell.ShellFloatingAction", "Floating Action type is correct");
	});

	test("Floating Actions - add / remove floatingAction items", function () {
		var oFloatingActionsContainer = oShell.getFloatingActionsContainer(),
			oFloatingActions = oFloatingActionsContainer.getFloatingActions(),
			floatingAction = sap.ui.getCore().byId("_floatingAction"),
			newFloatingAction = new sap.ushell.ui.shell.ShellFloatingAction("_floatingAction2");

		equal(oFloatingActions.length, 1, "Initial number of floatingAction controls");

		oFloatingActionsContainer.addFloatingAction(newFloatingAction);
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 2, "number of floatingAction controls after add");

		oFloatingActionsContainer.removeFloatingAction(newFloatingAction);
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 1, "number of floatingAction controls after remove");

		oFloatingActionsContainer.removeAllFloatingActions();
		oFloatingActions = oFloatingActionsContainer.getFloatingActions();
		equal(oFloatingActions.length, 0, "number of floatingAction controls after removeAll");

		floatingAction.destroy();
		newFloatingAction.destroy();
	});

	test("Floating Actions - isFooterVisible property", function () {
		ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "Default isFooterVisible - false");
		oShell.getFloatingActionsContainer().setIsFooterVisible(true);
		ok(oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - true");
		oShell.getFloatingActionsContainer().setIsFooterVisible(false);
		ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - false");
	});

	test("Split Container - types ", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer();
		ok(oCanvasSplitContainer instanceof sap.ushell.ui.shell.SplitContainer, "Split Actions type is correct");

		var oContent = oCanvasSplitContainer.getMetadata().getAllAggregations()["content"];
		equal(oContent.type, "sap.ui.core.Control", "Content type is correct");

		var oSecondaryContent = oCanvasSplitContainer.getMetadata().getAllAggregations()["secondaryContent"];
		equal(oSecondaryContent.type, "sap.ui.core.Control", "Secondary Content type is correct");

		var oSubHeader = oCanvasSplitContainer.getMetadata().getAllAggregations()["subHeader"];
		equal(oSubHeader.type, "sap.ui.core.Control", "Sub Header type is correct");
	});

	test("Split Container - set / destroy Sub Header", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oSubHeader = oCanvasSplitContainer.getSubHeader(),
			newSubHeader = new my.Test("_subheader_ctnt2");

		ok(oSubHeader, "subheader control exists");

		oCanvasSplitContainer.destroySubHeader();
		oSubHeader = oCanvasSplitContainer.getSubHeader();
		equal(oSubHeader.length, 0, "No subheader controls after destroy");

		oCanvasSplitContainer.addSubHeader(newSubHeader);
		oSubHeader = oCanvasSplitContainer.getSubHeader();
		ok(oSubHeader, "subheader exists after set");
	});

	test("Split Container - add / remove content items", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oContent = oCanvasSplitContainer.getContent(),
			control = sap.ui.getCore().byId("_ctnt"),
			newControl = new my.Test("_ctnt2");

		equal(oContent.length, 1, "Initial number of content controls");

		oCanvasSplitContainer.addContent(newControl);
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 2, "number of content controls after add");

		oCanvasSplitContainer.removeContent(newControl);
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 1, "number of content controls after remove");

		oCanvasSplitContainer.removeAllContent();
		oContent = oCanvasSplitContainer.getContent();
		equal(oContent.length, 0, "number of content controls after removeAll");

		control.destroy();
		newControl.destroy();
	});

	test("Split Container - add / remove secondaryContent items", function () {
		var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
			oSecondaryContent = oCanvasSplitContainer.getSecondaryContent(),
			control = sap.ui.getCore().byId("_pane_ctnt"),
			newControl = new my.Test("_pane_ctnt2");

		equal(oSecondaryContent.length, 1, "Initial number of secondaryContent controls");

		oCanvasSplitContainer.addSecondaryContent(newControl);
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 2, "number of secondaryContent controls after add");

		oCanvasSplitContainer.removeSecondaryContent(newControl);
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 1, "number of secondaryContent controls after remove");

		oCanvasSplitContainer.removeAllSecondaryContent();
		oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
		equal(oSecondaryContent.length, 0, "number of secondaryContent controls after removeAll");

		control.destroy();
		newControl.destroy();
	});

	test("Tool Area - types ", function () {
		var oToolArea = oShell.getToolArea();
		ok(oToolArea instanceof sap.ushell.ui.shell.ToolArea, "Tool Area type is correct");

		var oToolAreaItems = oToolArea.getMetadata().getAllAggregations()["toolAreaItems"];
		equal(oToolAreaItems.type, "sap.ushell.ui.shell.ToolAreaItem", "toolarea item type is correct");
	});

	test("Tool Area - add / remove toolarea items", function () {
		var oToolArea = oShell.getToolArea(),
			aToolAreaItems = oToolArea.getToolAreaItems(),
			toolareaItem = sap.ui.getCore().byId("_toolarea_itm"),
			newToolareaItem = new sap.ushell.ui.shell.ToolAreaItem("_toolarea_itm2");

		equal(aToolAreaItems.length, 1, "Initial number of toolarea controls");

		oToolArea.addToolAreaItem(newToolareaItem);
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 2, "number of toolarea controls after add");

		oToolArea.removeToolAreaItem(newToolareaItem);
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 1, "number of toolarea controls after remove");

		oToolArea.removeAllToolAreaItems();
		aToolAreaItems = oToolArea.getToolAreaItems();
		equal(aToolAreaItems.length, 0, "number of toolarea controls after removeAll");

		toolareaItem.destroy();
		newToolareaItem.destroy();
	});

	module("sap.ushell.ui.shell.ShellLayout with Fiori 2.0 ON", {
		beforeEach: function () {
			jQuery('<div id="canvas"></div>').appendTo('body');
			var oShellSplitContainer,
                oShellHeader;


			oShellHeader = new sap.ushell.ui.shell.ShellHeader({
				id: 'shell-header',
				headItems: [new sap.ushell.ui.shell.ShellHeadItem("_itm")],
				headEndItems: [new sap.ushell.ui.shell.ShellHeadItem("_end_itm")],
				user: new sap.ushell.ui.shell.ShellHeadUserItem("_useritm", {
					username: "name",
					image: "sap-icon://person-placeholder"
				}),
				search: new my.Test("search"),
                showSeparators: false
			});

            oShellSplitContainer = new sap.ushell.ui.shell.SplitContainer({
                id: 'shell-split',
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });

			oShell = new sap.ushell.ui.shell.ShellLayout({
				id: "shell",
				header: oShellHeader,
                backgroundColorForce: false,
                showBrandLine: false,
                canvasSplitContainer: oShellSplitContainer,
                showAnimation: false
			});

			oShell.placeAt('canvas');
		},
		/**
		 * This method is called after each test. Add every restoration code here.
		 */
		afterEach: function () {
			oShell.destroy();
			jQuery("#canvas").remove();
		}
	});

    test("Test ShellLayout and ShellHeader - Fiori 2.0 is ON", function( assert ) {
        assert.expect(5);
        var done1 = assert.async();
        var done2 = assert.async();

        oShell.assertFunction = function() {
            var oShellDomRef = this.getDomRef();
            ok(!oShellDomRef.querySelector(".sapUshellShellBrand"), "Brand line should not be added to shell on Firoi 2.0");
            ok(!oShellDomRef.querySelector(".sapUiGlobalBackgroundColorForce"), "Background Color Force should not be added to shell on Firoi 2.0");
            ok(!oShellDomRef.querySelector(".sapUiGlobalBackgroundColor"), "Global Background Color should not be added to shell on Firoi 2.0");
            ok(!oShellDomRef.querySelector(".sapUshellShellAnim"), "Animation should not be added to shell on Firoi 2.0");
            done1();
        };

        oShell.getHeader().assertFunction = function(){
            var oShellHeaderDomRef = this.getDomRef();
            ok(oShellHeaderDomRef.querySelector(".sapUshellHeaderHideSeparators.sapUshellShellHeadItm"), "Separator should not be added to shell head item on Firoi 2.0");
            done2();
        };

        oShell.addEventDelegate({onAfterRendering: oShell.assertFunction.bind(oShell)});
        oShell.getHeader().addEventDelegate({onAfterRendering: oShell.getHeader().assertFunction.bind(oShell.getHeader())});
    });

}());