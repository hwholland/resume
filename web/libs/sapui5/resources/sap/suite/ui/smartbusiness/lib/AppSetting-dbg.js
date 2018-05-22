jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.AppSetting")
sap.suite.ui.smartbusiness.lib.AppSetting = (function() {
	var oControl,hideElement,action,controllerReference;
	var personalizationId = {
			container : "sap.suite.ui.smartbusiness",
			item : "idVisibility"
	};
	var oPersonalizer = sap.ushell.Container.getService("Personalization").getPersonalizer(personalizationId);

	var checkBox = new sap.m.CheckBox({
		selected: true,
		layoutData : new sap.ui.layout.GridData({
			span : "L10 M10 S10",
			vAlign : "Middle"
		}),
	});
    var oCustomHeader = new sap.m.Bar({
    	width:"100%",
        contentMiddle:[ new sap.m.Label({
            text:"{i18n>TABLE_POPOVER_HEADING}"
        })],
        contentRight :
            [new sap.m.Button({
                icon:"sap-icon://decline",
                width : "100%",
                press : function() {
                    infoPopOver.close();
                }
            })]
    });

	var infoPopOver = new sap.m.ResponsivePopover({
		title : "Working with IDs",
		showHeader : true,
		customHeader : oCustomHeader,
		contentWidth: "20%",
		contentHeight : "25%",
		verticalScrolling : true,
		showCloseButton : true,
		horizontalScrolling : false,
		placement: sap.m.PlacementType.Right,
		content:[
		         new sap.m.Text({
		        	 width:"100%",
		        	 textAlign: "Center",
		        	 text:"\n\nIDs are used purely for identifying entities in the backend of Smart Business framework apps.\n\n While creating, although you may edit the IDs with your unique id, but they wont be extendable.\n\n Within each App you would individually need to enable this feature to work with IDs."

		         })
		         ]
	});
	var infoButton = new sap.m.Button({
		icon:"sap-icon://message-information",
		type: sap.m.ButtonType.Transparent,
		layoutData : new sap.ui.layout.GridData({
			span : "L2 M2 S2",
			vAlign : "Middle"
		}),
		press:function(){
			infoPopOver.openBy(this);
		}
	});
	var setVisibilityList = function(value){
		sap.ui.getCore().getModel("SB_APP_SETTING").getData().ID_VISIBLE = value;
		sap.ui.getCore().getModel("SB_APP_SETTING").updateBindings();
	};
	var hideListItemsSave = function(){
		if (checkBox.getSelected() == true)
		{
			setVisibilityList(true);
			oPersonalizer.setPersData({"SHOW_ID":true});
		}
		else{
			setVisibilityList(false);
			oPersonalizer.setPersData({"SHOW_ID":false});
		}
	};
	var hideCancel = function(){
		oPersonalizer.getPersData().done(function(data){
			checkBox.setSelected(data && data.SHOW_ID);
		});
	};
	var hideInputSave = function(){
		if (checkBox.getSelected() == true)
		{
			setVisibilityList(true);
			oPersonalizer.setPersData({"SHOW_ID":true});
		}
		else{
			setVisibilityList(false);
			action(controllerReference);
			oPersonalizer.setPersData({"SHOW_ID":false});
		}
	};
	
	var saveButton = new sap.m.Button({
		press : function() {
			(hideElement == "list")? hideListItemsSave() : (hideElement == "input")? hideInputSave():"";
			dialog.close();
		}
	});
	var cancelButton =   new sap.m.Button({
		press : function() {
			hideCancel();
			dialog.close();
		}
	});
	var dialog = new sap.m.Dialog({
		width:"100%",
		content:new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 0,
			defaultSpan : "L12 M12 S12",
			content: [
			          checkBox,
			          infoButton
			          ]
		}),
		buttons:[
		         saveButton,
		         cancelButton
		         ]
	});
	var oButton = new sap.m.Button({
		press: function (){
			dialog.open();
		}
	});
	return  {
		init  :function(oConfig) {
			dialog.setTitle(oConfig.title);
			oControl = oConfig.oControl;
			if(oConfig.action && oConfig.controllerReference)
			{
				action = oConfig.action;
				controllerReference = oConfig.controllerReference
			}
			infoPopOver.getContent()[0].setText(oConfig.i18n.settingInfoText);
			infoPopOver.getTitle(oConfig.i18n.settingInfoTitle);
			hideElement = oConfig.hideElement;
			checkBox.setText(oConfig.i18n.checkBoxText);
			saveButton.setText(oConfig.i18n.saveText);
			cancelButton.setText(oConfig.i18n.cancelText);
			oButton.setText(oConfig.i18n.settingsText);
			oPersonalizer.getPersData().done(function(data){
				if(data){
					checkBox.setSelected(data.SHOW_ID);
					setVisibilityList(data.SHOW_ID);
				}
				else{
					checkBox.setSelected(true);
					setVisibilityList(true);
				}
			});
			sap.ushell.services.AppConfiguration.addApplicationSettingsButtons([oButton]);
		},
		setVisibility : function(){
			oPersonalizer.getPersData().done(function(data){
				if(data){
					setVisibilityList(data.SHOW_ID);
				}
				else{
					setVisibilityList(true);
				}
			});
		},

	}

})();