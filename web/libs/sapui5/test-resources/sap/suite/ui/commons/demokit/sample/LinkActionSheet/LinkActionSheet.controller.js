sap.ui.controller("sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheet", {
	handleOpenOnlyBtn: function (oEvent) {
		var oButton = oEvent.getSource();

		if (!this._lASOnlyBtn) {
			this._lASOnlyBtn = sap.ui.xmlfragment("sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheetOnlyBtn", this);
			this.getView().addDependent(this._lASOnlyBtn);
		}

		this._lASOnlyBtn.openBy(oButton);
	},
	handleOpenOnlyLnk: function (oEvent) {
		var oButton = oEvent.getSource();

		if (!this._lASOnlyLnk) {
			this._lASOnlyLnk = sap.ui.xmlfragment("sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheetOnlyLnk", this);
			this.getView().addDependent(this._lASOnlyLnk);
		}

		this._lASOnlyLnk.openBy(oButton);
	},
	handleOpenLnkBtn: function (oEvent) {
		var oButton = oEvent.getSource();

		if (!this._lASOnlyLnkBtn) {
			this._lASOnlyLnkBtn = sap.ui.xmlfragment("sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheetLnkBtn", this);
			this.getView().addDependent(this._lASOnlyLnkBtn);
		}

		this._lASOnlyLnkBtn.openBy(oButton);
	},
	handleOpenLnkMBtn: function (oEvent) {
		var oButton = oEvent.getSource();

		if (!this._lASOnlyLnkMBtn) {
			this._lASOnlyLnkMBtn = sap.ui.xmlfragment("sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheetLnkMBtn", this);
			this.getView().addDependent(this._lASOnlyLnkMBtn);
		}

		this._lASOnlyLnkMBtn.openBy(oButton);
	}	
});