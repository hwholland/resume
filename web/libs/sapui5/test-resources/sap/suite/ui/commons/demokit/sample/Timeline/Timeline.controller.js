sap.ui.controller("sap.suite.ui.commons.sample.Timeline.Timeline", {

	attachUserNameClicked : function(oControlEvent) {
		var oPopover = new sap.m.Popover({
			showHeader : false,
			placement : sap.m.PlacementType.Auto,
			contentHeight : "87px",
			contentWidth : "300px"
		});
		var vCardName = new sap.ui.commons.Label();
		var oVCard = new sap.suite.ui.commons.BusinessCard({
			firstTitle : vCardName,
			secondTitle : "Sales Contact at Customer Side",
			width : "298px"
		});
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			widths : ["30px", "100px"]
		});
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Phone:"
		}), new sap.ui.commons.TextView({
			text : "+1 (635) 457-2875"
		}));
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Email:"
		}), new sap.ui.commons.TextView({
			text : "abc@company.com"
		}));
		oVCard.setContent(oContent);
		oPopover.addContent(oVCard);
		var oItem = oControlEvent.getSource();
		vCardName.setText(oItem.getUserName());
		oVCard.setIconPath("images/persons/male_MillerM.jpg");
		oPopover.openBy(oItem._userNameLink);

	},
	attachUserNameClicked1 : function(oControlEvent) {
		var oPopover = new sap.m.Popover({
			showHeader : false,
			placement : sap.m.PlacementType.Auto,
			contentHeight : "87px",
			contentWidth : "300px"
		});
		var vCardName = new sap.ui.commons.Label();
		var oVCard = new sap.suite.ui.commons.BusinessCard({
			firstTitle : vCardName,
			secondTitle : "Sales Contact at Customer Side",
			width : "298px"
		});
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			widths : ["30px", "100px"]
		});
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Phone:"
		}), new sap.ui.commons.TextView({
			text : "+1 (635) 489-5325"
		}));
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Email:"
		}), new sap.ui.commons.TextView({
			text : "abc@company.com"
		}));
		oVCard.setContent(oContent);
		oPopover.addContent(oVCard);
		var oItem = oControlEvent.getSource();
		vCardName.setText(oItem.getUserName());
		oVCard.setIconPath("images/persons/female_IngallsB.jpg");
		oPopover.openBy(oItem._userNameLink);

	},
	attachUserNameClicked2 : function(oControlEvent) {
		var oPopover = new sap.m.Popover({
			showHeader : false,
			placement : sap.m.PlacementType.Auto,
			contentHeight : "87px",
			contentWidth : "300px" 
		});
		var vCardName = new sap.ui.commons.Label();
		var oVCard = new sap.suite.ui.commons.BusinessCard({
			firstTitle : vCardName,
			secondTitle : "Sales Contact at Customer Side",
			width : "298px"
		});
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			widths : ["30px", "100px"]
		});
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Phone:"
		}), new sap.ui.commons.TextView({
			text : "+1 (635) 234-4781"
		}));
		oContent.createRow(new sap.ui.commons.TextView({
			text : "Email:"
		}), new sap.ui.commons.TextView({
			text : "abc@company.com"
		}));
		oVCard.setContent(oContent);
		oPopover.addContent(oVCard);
		var oItem = oControlEvent.getSource();
		vCardName.setText(oItem.getUserName());
		oVCard.setIconPath("images/persons/male_SmithJo.jpg");
		oPopover.openBy(oItem._userNameLink);

	},
	onPress : function(oEvent) {
		alert("Hello from Timeline item");
	}


});