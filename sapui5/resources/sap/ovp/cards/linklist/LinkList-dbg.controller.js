(function() {
	"use strict";
	/*global sap, jQuery */
	var oDelegateOnBefore = {
		onBeforeRendering: function(oEvent) {
			this.itemOnBeforeRendering(oEvent);
		}
	};
	var oDelegateOnAfter = {
		onAfterRendering: function(oEvent) {
			this.itemOnAfterRendering(oEvent);
		}
	};

	sap.ui.controller("sap.ovp.cards.linklist.LinkList", {

		onInit: function() {
			jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
			this._bInitialLoad = true;
			this._iColumns = 0;
		},

		onBeforeRendering: function(oEvent) {
			var oCardPropertiesModel = this.getCardPropertiesModel();
			var oView = this.getView();
			if (oCardPropertiesModel.getProperty("/listFlavor") === "standard") {
				var oLiItem = oView.byId("ovpCLI"); //Only available in case of StaticContent
				if (oLiItem) {
					oLiItem.addEventDelegate(oDelegateOnBefore, this);
				}
			}
		},

		onAfterRendering: function(oEvent) {
			var oView = this.getView();
			var oCardPropertiesModel = this.getCardPropertiesModel();
			var iRows = oCardPropertiesModel.getProperty("/cardLayout/rowSpan");
			var iCols = oCardPropertiesModel.getProperty("/cardLayout/colSpan");

			switch (oCardPropertiesModel.getProperty("/listFlavor")) {
				case "standard":
					if (oCardPropertiesModel.getProperty("/staticContent")) {
						if (iCols && iRows) {
							//Dashboard Layout
							this._itemOnEventBuildStandard(oView, oCardPropertiesModel, iCols, iRows, true);
						} else {
							// EasyScan Layout
							this._aLinkListIds = ["ovpLinkList"];
							this._setListColumnWidthInStandardCard(oView, 1);
						}
					}
					break;

				case "carousel":
					if (iRows) {
						//Dashboard Layout
						this._setListHeightInCarouselCard(oView, iRows);
					}

					var oCarousel = oView.byId("pictureCarousel");
					oCarousel.addEventDelegate(oDelegateOnAfter, this);
					this._setCarouselImageProperties(oView);
					break;

				case "grid": //experimental - DON´t USE
					jQuery.sap.log.info("FYI: currently nothing special to handle here");
					break;
			}
		},

		itemOnBeforeRendering: function(oEvent) {
			var oCardPropertiesModel = this.getCardPropertiesModel();
			var oView = this.getView();
			switch (oCardPropertiesModel.getProperty("/listFlavor")) {
				case "standard":
					var iRows = oCardPropertiesModel.getProperty("/cardLayout/rowSpan");
					var iCols = oCardPropertiesModel.getProperty("/cardLayout/colSpan");
					var oList = oView.byId("ovpLinkList");
					var aListItems = oList.getItems();
					for (var j = 0; j < aListItems.length; j++) {
						aListItems[j].removeEventDelegate(oDelegateOnBefore);
					}
					if (this._bInitialLoad) {
						this._itemOnEventBuildStandard(oView, oCardPropertiesModel, iCols, iRows, true);
					} else {
						this._itemOnEventBuildStandard(oView, oCardPropertiesModel, iCols, iRows, false);
					}
					break;

				case "carousel":
					jQuery.sap.log.info("FYI: currently nothing special to handle here");
					break;

				case "grid": //grid: experimental  -- DON´T USE
					jQuery.sap.log.info("FYI: currently nothing special to handle here");
					break;
			}
		},

		itemOnAfterRendering: function(oEvent) {
			var oCardPropertiesModel = this.getCardPropertiesModel();
			var iRows = oCardPropertiesModel.getProperty("/cardLayout/rowSpan");
			var iCols = oCardPropertiesModel.getProperty("/cardLayout/colSpan");
			var oView = this.getView();
			switch (oCardPropertiesModel.getProperty("/listFlavor")) {
				case "standard":
					//remove the Delegated Event - if necessary if will added again
					//this step is necessary as the actual last item might be next time a different item
					try {
						var oList = oView.byId("ovpLinkList");
						var aListItems = oList.getItems(this._aLinkListIds[this._aLinkListIds.length - 1]);
						aListItems[aListItems.length - 1].removeEventDelegate(oDelegateOnAfter);
					} catch (e) {
						jQuery.sap.log.info("FYI: Unable to remove the delagted event at the last item of the last list");
					}

					if (iRows) {
						this._setListHeightInStandardCard(oView, iRows);
					}
					if (iCols) {
						// Dashboard Layout
						this._setListColumnWidthInStandardCard(oView, iCols);
					} else {
						// EasyScan Layout
						this._setListColumnWidthInStandardCard(oView, 1);
					}
					break;

				case "carousel":
					//remove the Delegated Event - if necessary if will added again
					try {
						var oCarousel = oView.byId("pictureCarousel");
						oCarousel.removeEventDelegate(oDelegateOnAfter);
					} catch (e) {
						jQuery.sap.log.info("FYI: Unable to remove the delagted event on the carousel");
					}

					if (iRows) {
						this._setListHeightInCarouselCard(oView, iRows);
					}
					this._setCarouselImageProperties(oView);
					break;

				case "grid": //grid: experimental  -- DON´T USE
					jQuery.sap.log.info("FYI: currently nothing special to handle here");
					break;
			}
		},

		_itemOnEventBuildStandard: function(oView, oCardPropertiesModel, iCols, iRows, bInitiaLoad) {
			var iPossibleItems;
			var oList = oView.byId("ovpLinkList");
			if (bInitiaLoad && this._oListRest === undefined) {
				this._oListRest = new sap.m.List(oView.getId() + "--RestOfData", {});
			}
			this._aLinkListIds = ["ovpLinkList"];
			this._iAvailableItems = oList.getItems().length;

			var iCardItems = oCardPropertiesModel.getProperty("/cardLayout/items");

			if (iCardItems !== undefined) {
				//EasyScan Layout
				this._iNoOfItemsPerColumn = iCardItems;
				iPossibleItems = iCardItems;
				this._iVisibleColums = 1; //

			} else {
				//Dashboard Layout
				var iItemHeight = 72;
				try {
					iItemHeight = this._getLinkListItemHigh();
				} catch (e) {
					jQuery.sap.log.info("Error: " + e);
				}

				var iLinkListHeight = this._getListHeightInStandardCard(oView, iRows);

				this._iNoOfItemsPerColumn = Math.floor(iLinkListHeight / iItemHeight); //calculate list length			

				var iNeededColums = Math.ceil(this._iAvailableItems / this._iNoOfItemsPerColumn);

				this._iVisibleColums = Math.min(iNeededColums, iCols);

				iPossibleItems = this._iVisibleColums * this._iNoOfItemsPerColumn;

			}
			if (iPossibleItems > this._iAvailableItems) {
				//less data available as space on the card, set iPossibleItems to max. Items 
				iPossibleItems = this._iAvailableItems;
			} else {
				//remove all items which are too much for this card
				for (var i = iPossibleItems; i < this._iAvailableItems; i++) {
					this._oListRest.addItem(oList.getItems()[iPossibleItems]);
				}
			}

			if (this._iVisibleColums > 1) {
				var oListRow = oView.byId("ovpListRow");
				var iItemOfList = this._iNoOfItemsPerColumn; //Set the Startindex for the new column
				var iLinkListIdCounter = 0;

				for (var j = this._iNoOfItemsPerColumn; j < iPossibleItems; j++) {
					if (iItemOfList >= this._iNoOfItemsPerColumn) {
						//create a new list            
						iItemOfList = 0;
						iLinkListIdCounter++;
						var sLinkListId = "ovpLinkList" + iLinkListIdCounter;
						var oNewList = new sap.m.List(oView.getId() + "--" + sLinkListId, {
							showSeparators: oList.getProperty("showSeparators")
						});
						//Add StyleClass
						this._aLinkListIds.push(sLinkListId);
						if (oList.hasStyleClass("_iNoOfItemsPerColumnPaddingCozy")) {
							oNewList.addStyleClass("sapOvpLinkListStandardPaddingCozy");
						} else {
							oNewList.addStyleClass("sapOvpLinkListStandardPaddingCompact");
						}
						oListRow.addItem(oNewList);
					}

					oNewList.addItem(oList.getItems()[this._iNoOfItemsPerColumn]);
					iItemOfList++;
				}
				var aItemsLastList = oNewList.getItems();
				aItemsLastList[aItemsLastList.length - 1].addEventDelegate(oDelegateOnAfter, this);
			} else {
				if (bInitiaLoad) {
					this.itemOnAfterRendering(null);
				} else {
					var aListItemsFirstList = oList.getItems();
					aListItemsFirstList[aListItemsFirstList.length - 1].addEventDelegate(oDelegateOnAfter, this);
				}
			}

		},

		/**
		 * Trigger resize of ItemLength
		 */
		resizeCard: function(newCardLayout) {
			//jQuery.sap.log.info("Resize Card");
			var oCardPropertiesModel = this.getCardPropertiesModel();
			switch (oCardPropertiesModel.getProperty("/listFlavor")) {
				case "standard":
					this._resizeStandard(newCardLayout);
					break;

				case "carousel":
					this._resizeCarousel(newCardLayout);
					break;

				case "grid": //grid: experimental  -- DON´T USE
					this._resizeGrid(newCardLayout);
					break;
			}
		},

		_resizeStandard: function(newCardLayout) {

			// 1 Step - select the Original List
			var oView = this.getView();
			var oList = this.byId(this._aLinkListIds[0]);

			// 2 Step - copy from all addition list the Items to the original List and after that destroy the List
			for (var i = 1; i < this._aLinkListIds.length; i++) {
				var oListAdd = oView.byId(this._aLinkListIds[i]);
				var iListLength = oListAdd.getItems().length;
				for (var j = 0; j < iListLength; j++) {
					oList.addItem(oListAdd.getItems()[0]);
				}
				oListAdd.destroy();
			}

			// 3 Step - copy the saved "rest" to the Original List back as well 
			var iRestListLength = this._oListRest.getItems().length;
			try {
				for (var k = 0; k < iRestListLength; k++) {
					oList.addItem(this._oListRest.getItems()[0]);
				}
			} catch (e) {
				jQuery.sap.log.info("Error: " + e);
			}
			var oCardPropertiesModel = this.getCardPropertiesModel();
			oCardPropertiesModel.setProperty("/cardLayout/rowSpan", newCardLayout.rowSpan);
			oCardPropertiesModel.setProperty("/cardLayout/colSpan", newCardLayout.colSpan);

			// 4 Step build additional Lists (and if needed load additional Items from Backend)	
			var oBindingInfo = oList.getBindingInfo("items");
			var iItemHeight = this._getLinkListItemHigh();
			var iNewCardHeight = this._getListHeightInStandardCard(oView, newCardLayout.rowSpan);
			var iNewLengthTotal = Math.floor(iNewCardHeight / iItemHeight) * newCardLayout.colSpan;
			this._bInitialLoad = false;
			if (oBindingInfo) {
				//Card with backend data	
				if (iNewLengthTotal > this._iAvailableItems && oBindingInfo.length <= this._iAvailableItems) {
					oBindingInfo.length = iNewLengthTotal;
					oList.bindItems(oBindingInfo);
				} else {
					this._itemOnEventBuildStandard(oView, oCardPropertiesModel, newCardLayout.colSpan, newCardLayout.rowSpan, false);
				}
			} else {
				//Card with static content					
				this._itemOnEventBuildStandard(oView, oCardPropertiesModel, newCardLayout.colSpan, newCardLayout.rowSpan, false);
			}
		},

		_resizeCarousel: function(newCardLayout) {
			var oView = this.getView();
			var oCarousel = oView.byId("pictureCarousel");
			var oCardPropertiesModel = this.getCardPropertiesModel();
			oCardPropertiesModel.setProperty("/cardLayout/rowSpan", newCardLayout.rowSpan);
			//trigger a refresh by the following 
			oCarousel.next();
			oCarousel.previous();
			this._setListHeightInCarouselCard(oView, newCardLayout.rowSpan);
			this._setCarouselImageProperties(oView);
		},

		_resizeGrid: function(newCardLayout) {
			var oGrid = this.getView().byId("ovpLinkListGrid");
			var sOldColSpan = parseInt(this.getView().byId("idColSpan").getValue(), 10);
			var sNewColSpan = newCardLayout.colSpan;
			if (newCardLayout.colSpan > 5) {
				sNewColSpan = 5; // max supported column span
			}
			this.getView().byId("idColSpan").setValue(sNewColSpan);
			//Replace StyleClass dependent on colSpan
			if (sNewColSpan !== sOldColSpan) {
				var sStyleClassOld = "sapOvpCardLinkListGridColSpan" + sOldColSpan;
				oGrid.removeStyleClass(sStyleClassOld);
				var sStyleClassNew = "sapOvpCardLinkListGridColSpan" + sNewColSpan;
				oGrid.addStyleClass(sStyleClassNew);
			}
			//Calculate Items dependent on colSpan and rowSpan
			var iNewLength = newCardLayout.rowSpan * newCardLayout.colSpan * 2;
			var oBindingInfo = oGrid.getBindingInfo("items");
			var oItems = oGrid.getItems();
			if (iNewLength > oItems.length) {
				oBindingInfo.length = iNewLength;
				oGrid.bindItems(oBindingInfo);
			} else if (iNewLength < oItems.length) {
				var sRemoveItems = oItems.length - iNewLength;
				var sLastIndex = oItems.length - 1;
				for (var i = 0; i < sRemoveItems; i++) {
					var iItemIndex = sLastIndex - i;
					oGrid.removeItem(iItemIndex);
				}
			}
		},

		_setListHeightInCarouselCard: function(oView, iRows) {
			var iCarouselHeight = 0;

			if (iRows) {
				var iHeaderHeight = 0;
				var oHeader = oView.byId("ovpCardHeader");
				if (oHeader) {
					iHeaderHeight = oHeader.$().height();
				}

				var oCardPropertiesModel = this.getCardPropertiesModel();
				var iRowHeight = oCardPropertiesModel.getProperty("/cardLayout/iRowHeigthPx");

				// iCarouselHeight = ( iRows * RowHeight ) - ( HeaderHeight + Page Padding + Page indicator [dots] )
				iCarouselHeight = (iRows * iRowHeight) - (iHeaderHeight + 27 + 8);
				var oCarousel = oView.byId("pictureCarousel");
				oCarousel.$().height(iCarouselHeight);
			}
		},

		_setCarouselImageProperties: function(oView) {
			// Check if we have a restriction in two dimensions ( like in the dashboard layout)

			var oCardPropertiesModel = this.getCardPropertiesModel();
			var iRows = oCardPropertiesModel.getProperty("/cardLayout/rowSpan");
			var iCols = oCardPropertiesModel.getProperty("/cardLayout/colSpan");

			if (iRows && iCols) {
				//sets the width and height of the background image in case the carousel shows only one page.
				//check if there is one or more pages in the carousel
				var oCarousel = oView.byId("pictureCarousel"),
					oCardHeader = oView.byId("ovpCardHeader"),
					oImg = null,
					oPage = null,
					sImgHeight,
					sImgWidth;

				if (oCarousel.getPages().length === 1 && oCardHeader) {
					// try to get a reference to the cards image - if there is one it should be the last item of the page
					oPage = sap.ui.getCore().byId(oCarousel.getActivePage());
					if (oPage && oPage.getItems()[oPage.getItems().length - 1] instanceof sap.m.Image) {
						oImg = oPage.getItems()[oPage.getItems().length - 1];
						//calc image heigth -> needs to be set explicitly for background images
						//the image shall use the complete card minus the cards' pseudo header
						if (oPage.getItems().length === 1) {
							//the page contains only the picture
							sImgHeight = oCarousel.$().height();
						} else {
							// there is a inner header -> reduce picture height accordingly
							// the inner header is the first item of the page
							sImgHeight = oCarousel.$().height() - oPage.getItems()[0].$().outerHeight();
						}
						if (sImgHeight) {
							sImgHeight = sImgHeight + "px";
							oImg.setHeight(sImgHeight);
						}
						//calc image width -> needs to be set explicitly for background images
						//the image witdth shall be the same as the cards pseudo header width
						sImgWidth = oCardHeader.$().outerWidth();
						if (sImgWidth) {
							sImgWidth = sImgWidth + "px";
							oImg.setWidth(sImgWidth);
						}
						oImg.setMode(sap.m.ImageMode.Background);
						oImg.setBackgroundPosition("center center");
					}
				}
			}
		},

		_setListHeightInStandardCard: function(oView, iRows) {
			var nLinkListHeight = 0;
			var oList;
			var oDomParent;
			jQuery.sap.log.info("TEST: " + this._aLinkListIds.toString());
			for (var i = 0; i < this._aLinkListIds.length; i++) {
				oList = oView.byId(this._aLinkListIds[i]);
				jQuery.sap.log.info("TEST: " + i.toString());
				jQuery.sap.log.info("TEST: " + this._aLinkListIds[i].toString());
				oDomParent = oList.$().parent();
				nLinkListHeight = this._getListHeightInStandardCard(oView, iRows);
				oDomParent.height(nLinkListHeight);
			}

		},

		_getListHeightInStandardCard: function(oView, iRows) {
			var iLinkListHeight = 0;
			var oCardPropertiesModel = this.getCardPropertiesModel();
			if (iRows) {
				var iHeaderHeight = 0;
				var oHeader = oView.byId("ovpCardHeader");
				if (oHeader) {
					iHeaderHeight = oHeader.$().height();
				}
				var iRowHeight = oCardPropertiesModel.getProperty("/cardLayout/iRowHeigthPx");
				// nLinkListHeight = ( iRows * iRowHeight ) - ( CardBorderTop + HeaderHeight + LinkListBorderTop + CardBorderBottom + LinkListBorderBottom)
				iLinkListHeight = (iRows * iRowHeight) - (8 + iHeaderHeight + 8 + 8 + 8);
			}
			return iLinkListHeight;
		},

		_setListColumnWidthInStandardCard: function(oView, iCols) {
			var oList;
			var oDomParent;
			var sColumnWidth = "100%";
			if (this._aLinkListIds.length > 1) {
				for (var j = 0; j < this._aLinkListIds.length; j++) {
					oList = oView.byId(this._aLinkListIds[j]);
					oDomParent = oList.$().parent();
					sColumnWidth = (100 / iCols) + "%";
					oDomParent.width(sColumnWidth);
				}
			} else {
				oList = oView.byId(this._aLinkListIds[0]);
				if (oList) {
					oDomParent = oList.$().parent();
					oDomParent.width(sColumnWidth);
				}
			}
		},

		_getLinkListItemHigh: function(sListId) {
			var sLiId = (sListId) ? sListId : "ovpLinkList";
			var oCardPropertiesModel = this.getCardPropertiesModel(),
				oView = this.getView(),
				oList = oView.byId(sLiId),
				iItemHeight = 72,
				sPicture = "",
				bTitle = false,
				bSubTitle = false,
				iNoOfLines = 1,
				density = oCardPropertiesModel.getProperty("/densityStyle"),
				iTitleIndex = 0,
				iSubTitleIndex = 0;

			//Picture
			var aListItems = oList.getItems();
			for (var j = 0; j < aListItems.length; j++) {
				try {
					var sPictureUrl = aListItems[j]
						.getAggregation("content")[0]
						.getAggregation("items")[0]
						.getAggregation("items")[0]
						.getAggregation("items")[0]
						.getProperty("src");
					if (sPictureUrl.length > 0) {
						if (sPictureUrl.toLowerCase().indexOf("icon") > 0) {
							sPicture = "icon";
						} else {
							sPicture = "image";
						}
						iTitleIndex = 1;
						break;
					}
				} catch (e) {
					jQuery.sap.log.info("Item:" + j + " doesn´t contain a image");
				}
			}

			if (sPicture.length > 0) {
				iNoOfLines = 2;
			} else {
				//Title
				try {
					var sTitle = oList.getItems()[0]
						.getAggregation("content")[0]
						.getAggregation("items")[iTitleIndex]
						.getAggregation("items")[0].getProperty("text");

					bTitle = sTitle.length > 0;
					iSubTitleIndex = 1;
				} catch (e) {
					jQuery.sap.log.info("Item doesn´t contain a title");
				}

				//SubTitle
				try {
					var sSubTitle = oList.getItems()[0]
						.getAggregation("content")[0]
						.getAggregation("items")[iTitleIndex]
						.getAggregation("items")[iSubTitleIndex]
						.getProperty("text");

					bSubTitle = sSubTitle.length > 0;
				} catch (e) {
					jQuery.sap.log.info("Item doesn´t contain a subTitle");
				}

				if (bTitle === true && bSubTitle === true) {
					iNoOfLines = 2;
				}
			}

			if (density === "cozy") {
				iItemHeight = 72;
				if (iNoOfLines === 1) {
					iItemHeight = sPicture !== "image" ? 40 : 56;
				}
			} else {
				iItemHeight = 60;
				if (iNoOfLines === 1) {
					iItemHeight = 48;
				}
			}
			return iItemHeight;
		},

		/**
		 * Navigates in case of usage of local data in the content of the card
		 */
		onLinkListItemPressLocalData: function(oEvent) {
			var sTargetUrl = oEvent.getSource().data("targetUri");
			var sInNewWindow = oEvent.getSource().data("openInNewWindow");
			var sBaseUrl = this.getView().getModel("ovpCardProperties").getProperty("/baseUrl");

			sTargetUrl = this.buildUrl(sBaseUrl, sTargetUrl);

			if (sInNewWindow === "true") {
				window.open(sTargetUrl);
			} else {
				window.location.href = sTargetUrl;
			}
		},

		/**
		 * Calls a function import in case of usage of local data in the content of the card
		 */
		onLinkListActionPressLocalData: function(oEvent) {
			var sAction = oEvent.getSource().data("dataAction");

			this.getView().getModel().callFunction(sAction, {
				method: "POST",
				urlParameters: {
					FunctionImport: sAction
				},
				success: (this.onFuImpSuccess.bind(this)),
				error: (this.onFuImpFailed.bind(this))
			});
		},

		onFuImpSuccess: function(oEvent) {
			sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Success"), {
				duration: 3000
			});
		},

		onFuImpFailed: function(oResponse) {
			sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Error"), {
				duration: 3000
			});
		},

		onLinkListItemPress: function(oEvent) {
			var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(), this.getCardPropertiesModel().getProperty(
				"/annotationPath"));
			this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
		},

		/**
		 * Open the Details Popover
		 */
		onLinkPopover: function(oEvent) {
			var oPopover;
			switch (this.getCardPropertiesModel().getProperty("/listFlavor")) {
				case "grid": //grid: experimental  -- DON´T USE
					oPopover = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getAggregation("items")[1].getAggregation(
						"items")[1];
					break;

				case "standard":
					oPopover = this.getView().byId("ovpListRow").getParent().getAggregation("items")[2];
					if (!oPopover) {
						oPopover = this.getView().byId("ovpListRow").getParent().getAggregation("items")[1];
					}
					break;

				case "carousel":
					if (oEvent.getParameter("id").indexOf("link") > 0) {
						oPopover = oEvent.getSource().getParent().getParent().getParent().getParent().getAggregation("items")[1];
					} else {
						oPopover = oEvent.getSource().getParent().getParent().getParent().getAggregation("items")[1];
					}
					break;
			}

			oPopover.bindElement(oEvent.getSource().getBindingContext().getPath());
			oPopover.openBy(oEvent.getSource());
		},

		/**
		 * Do CrossApplicationNavigation using the Identification annotation - all items have the same target app
		 */
		onLinkNavigationSingleTarget: function(oEvent) {
			var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(),
				"com.sap.vocabularies.UI.v1.Identification");
			this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
		},

		/**
		 * Do CrossApplicationNavigation
		 */
		onLinkNavigation: function(oEvent) {
			if (sap.ushell.Container.getService("CrossApplicationNavigation")) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				//var oNavArguments = {target : {	semanticObject : "Action",	action : "toappnavsample"} }; // for test with testOVP.html
				if (oBindingContext.getProperty("SemanticObject")) {
					var oNavArguments = {
						target: {
							semanticObject: oBindingContext.getProperty("SemanticObject"),
							action: oBindingContext.getProperty("SemanticAction")
						}
					};
					sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);
				}
			}
		},

		buildUrl: function(sBaseUrl, sManifestUrl) {
			if (sManifestUrl.startsWith(sBaseUrl) || sManifestUrl.indexOf("://") > 0) {
				return sManifestUrl;
			} else if (sManifestUrl.startsWith("/")) {
				return sBaseUrl + sManifestUrl;
			} else {
				return sBaseUrl + "/" + sManifestUrl;
			}
		},
		/**
		 * Calls a function import
		 */
		onLinkListActionPress: function(oEvent) {
			var sAction = oEvent.getSource().data("dataAction");

			this.getView().getModel().callFunction(sAction, {
				method: "POST",
				urlParameters: {
					FunctionImport: sAction
				},
				success: (this.onFuImpSuccess.bind(this)),
				error: (this.onFuImpFailed.bind(this))
			});
		},

		/**
		 * CrossApp Navigation with staticContent
		 */
		onLinkListSemanticObjectPressLocalData: function(oEvent) {
			var oStaticContent = this.getCardPropertiesModel().getProperty("/staticContent");
			var iRowIndex = parseInt(oEvent.getSource().data("contentRowIndex"), 10);
			var oNavArguments = {
				target: {
					semanticObject: oStaticContent[iRowIndex].semanticObject,
					action: oStaticContent[iRowIndex].action
				},
				params: oStaticContent[iRowIndex].params
			};

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);

		}

	});
})();