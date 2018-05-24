sap.ui.define([], function() {
	"use strict";

	jQuery.sap.require("sap.ovp.ui.UIActions");

	var Rearrange = function(settings) {
		this.init(settings);
	};

	Rearrange.prototype.init = function(settings) {
		settings.beforeDragCallback = this._beforeDragHandler.bind(this);
		settings.dragStartCallback = this._dragStartHandler.bind(this);
		settings.dragMoveCallback = this._dragMoveHandler.bind(this);
		settings.dragEndCallback = this._dragEndHandler.bind(this);
		settings.resizeStartCallback = this._resizeStartHandler.bind(this);
		settings.resizeMoveCallback = this._resizeMoveHandler.bind(this);
		settings.resizeEndCallback = this._resizeEndHandler.bind(this);
		settings.endCallback = this._endHandler.bind(this);

		this.placeHolderClass = settings.placeHolderClass;
		this.layout = settings.layout;
		//this.afterReplaceElements = settings.afterReplaceElements || function() {};
		this.settings = settings;
		//delete settings.afterReplaceElements;
		this.destroy(); //destroy the previous instance of UIActions
		this.uiActions = new sap.ovp.ui.UIActions(this.settings).enable();
		this.aCardsOrder = null; //DOM elements array
		this.aCards = settings.aCards; //cards properties persistence
		this.layoutUtil = settings.layoutUtil;
		this.verticalMargin = null; //space vertical between items
		this.horizontalMargin = null; //horizontal space vertical between items
		this.top = null; //space between layout top and first card
		this.left = null; //space between layout left and first card
		this.width = null; //item width
		this.layoutOffset = null; //layout coordinates on screen, needed to normalize mouse position to layout
		this.jqLayout = null; //layout jQuery reference
		this.jqLayoutInner = null; //layout inner wrapper jQuery reference
		this.isRTLEnabled = null; //RTL flag
		this.lastCollidedEl = null; //last collided element
		this.rowHeight = settings.rowHeight;
		this.dropZoneItem = null; //floater drop item and insert section 
		this.floaterData = null; //id, position and width of the currently dragged card
		this.resizeData = {}; //card resize data (ghost values)
		this.delta = {
			top: 0,
			left: 0
		};
		switch (true) {
			case sap.ui.Device.browser.webkit:
				this.cssVendorTransition = "-webkit-transition";
				this.cssVendorTransform = "-webkit-transform";
				break;
			case sap.ui.Device.browser.msie:
				this.cssVendorTransition = "-ms-transition";
				this.cssVendorTransform = "-ms-transform";
				break;
			case sap.ui.Device.browser.mozilla:
				this.cssVendorTransition = "-moz-transition";
				this.cssVendorTransform = "-moz-transform";
				break;
			default:
				this.cssVendorTransition = "transition";
				this.cssVendorTransform = "transform";
		}
	};

	Rearrange.prototype.destroy = function() {
		if (this.uiActions) {
			this.uiActions.disable();
			this.uiActions = null;
		}
	};

	//****** resizing card handlers

	Rearrange.prototype._resizeStartHandler = function(evt, cardElement) {
		//Prevent selection of text on tiles and groups
		//var $elem = jQuery(cardElement);
		//this.resizeStartOffset = $elem.offset();
		//console.log("resize start handler reached");
		if (jQuery(window).getSelection) {
			var selection = jQuery(window).getSelection();
			selection.removeAllRanges();
		}
		this.initCardsSettings();

	};

	Rearrange.prototype._resizeEndHandler = function(evt, ui) {

		if (sap.ui.Device.system.desktop) {
			jQuery("body").removeClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
		}
		jQuery(this.settings.wrapper).removeClass("dragAndDropMode");
		jQuery("#ovpResizeGhost").remove();
		jQuery("#ovpResizeRubberBand").remove();

		if (!ui) {
			return;
		}

		if (this.resizeData.colSpan && this.resizeData.rowSpan) {
			//get card controller and send resize data
			this.layoutUtil.resizeCard(ui.getAttribute("id"), this.resizeData);
		}
		this.resizeData = {};

		if (jQuery(window).getSelection) {
			var selection = jQuery(window).getSelection();
			selection.removeAllRanges();
		}
	};

	Rearrange.prototype._resizeMoveHandler = function(actionObject) {

		if (actionObject.element) {

			var $elem = jQuery(actionObject.element);
			var fElementPosLeft = $elem.position().left;
			var fElementPosTop = $elem.position().top;
			var ghostWidthCursor = actionObject.moveX - fElementPosLeft - this.layoutOffset.left;
			var ghostHeightCursor = actionObject.moveY - fElementPosTop - this.layoutOffset.top + this.jqLayout.scrollTop(); //this.resizeStartOffset.top;

			this.resizeData.colSpan = Math.round(ghostWidthCursor / this.layoutUtil.getColWidthPx());
			if (this.resizeData.colSpan < 1) {
				this.resizeData.colSpan = 1;
			}
			this.resizeData.rowSpan = Math.round(ghostHeightCursor / this.layoutUtil.getRowHeightPx());
			if (this.resizeData.rowSpan < 1) {
				this.resizeData.rowSpan = 1;
			}

			var ghostHeightGrid = this.resizeData.rowSpan * this.layoutUtil.getRowHeightPx();
			var ghostWidthGrid = this.resizeData.colSpan * this.layoutUtil.getColWidthPx();
			if (ghostWidthGrid + fElementPosLeft > this.layoutUtil.getLayoutWidthPx()) {
				//card can't be resized beyond layout width
				ghostWidthGrid = this.layoutUtil.getLayoutWidthPx() - fElementPosLeft;
				this.resizeData.colSpan = Math.round(ghostWidthGrid / this.layoutUtil.getColWidthPx());
			}

			jQuery("#ovpResizeRubberBand").remove();
			var oElementWrapper = jQuery(actionObject.element).parent();
			oElementWrapper.append("<div id='ovpResizeRubberBand' class='ovpResizeRubberBand' style='top: " + fElementPosTop + "px; left: " +
				fElementPosLeft + "px; width: " + ghostWidthCursor + "px; height: " + ghostHeightCursor + "px;'></div>");

			jQuery("#ovpResizeGhost").remove();
			oElementWrapper.append("<div id='ovpResizeGhost' class='ovpCardResizeGhost' style='top: " + fElementPosTop + "px; left: " +
				fElementPosLeft + "px; width: " + ghostWidthGrid + "px; height: " + ghostHeightGrid + "px;'></div>");
		}
	};
	
	
	//****** drag and drop card handlers

	//callback before clone created
	Rearrange.prototype._beforeDragHandler = function(evt, ui) {
		//Prevent the browser to mark any elements while dragging
		if (sap.ui.Device.system.desktop) {
			jQuery("body").addClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
		}
		//Prevent text selection menu and magnifier on mobile devices
		if (sap.ui.Device.browser.mobile) {
			this.selectableElemets = jQuery(ui).find(".sapUiSelectable");
			this.selectableElemets.removeClass("sapUiSelectable");
		}
		jQuery(this.settings.wrapper).addClass("dragAndDropMode");
	};

	//callback when drag starts
	Rearrange.prototype._dragStartHandler = function(evt, cardElement) {
		//Prevent selection of text on tiles and groups
		jQuery.sap.log.info(cardElement);
		if (jQuery(window).getSelection) {
			var selection = jQuery(window).getSelection();
			selection.removeAllRanges();
		}
		this.initCardsSettings();
		//store the width and height of the card for ghost size
		var oCardRect = cardElement.children[0].getBoundingClientRect();
		this.floaterData = {
			width: oCardRect.width,
			height: oCardRect.height,
			startLeft: oCardRect.left - this.layoutOffset.left,
			startTop: oCardRect.top - this.layoutOffset.top - parseInt(jQuery("." + this.placeHolderClass).css("border-top-width"), 10)
		};
	};

	//callback for UIActions, every time when mouse is moved in drag mode.
	Rearrange.prototype._dragMoveHandler = function(actionObject) {
		// get floater
		var oFloater = jQuery(actionObject.clone);
		this.floaterData.id = oFloater.attr("id");
		this.floaterData.left = actionObject.moveX - this.uiActions.startX + this.floaterData.startLeft;
		this.floaterData.top = actionObject.moveY - this.uiActions.startY + this.floaterData.startTop + this.jqLayout.scrollTop();

		var dropSimData = this.layoutUtil.getDropSimData(this.floaterData);
		this.floaterData.top = dropSimData.cellPos.top;
		this.floaterData.left = dropSimData.cellPos.left;
		this.showGhostWhileDragMove(actionObject.element, dropSimData.cellPos);
		this.floaterData.bPushHorizontal = dropSimData.pushHorizontal;

		//reset previous preview
		if (jQuery(".displaceItem")[0]) {
			jQuery(".displaceItem").css(this.getCSSTransition(0, 0));
			jQuery(".sapUshellEasyScanLayoutInner").children().removeClass("displaceItem");
		}

		if (dropSimData.coveredCardIds.length > 0) {
			var offset = this.layoutUtil.convertRemToPx("4rem"); //displacment offset
			dropSimData.coveredCardIds.forEach(function(sCardId) {
				jQuery("#" + sCardId).addClass("displaceItem");
			});
			jQuery(".displaceItem").css(dropSimData.pushHorizontal ? this.getCSSTransition(offset, 0) : this.getCSSTransition(0, offset));
		}
	};

	//model changes, and cleanup after drag and drop finished
	Rearrange.prototype._dragEndHandler = function(evt, floater) {
		this.lastCollidedEl = null;
		jQuery("#ovpDashboardLayoutMarker").remove(); //remove insert marker
		jQuery(".displaceItem").css(this.getCSSTransition(0, 0));
		jQuery(".displaceItem").removeClass("displaceItem");

		var bHorizontal = this.floaterData.bPushHorizontal;
		var ghostPos = this.layoutUtil.mapPositionToGrid({
			top: this.floaterData.top,
			left: this.floaterData.left
		});

		//move the card to the target position and make the card content visible again
		jQuery(floater).css({
			left: this.floaterData.left,
			top: this.floaterData.top
		});

		this.layoutUtil.moveCardToGrid(this.floaterData.id, {
			column: ghostPos.gridCoordX,
			row: ghostPos.gridCoordY
		}, bHorizontal);

		//Cleanup added classes and styles before drag
		if (sap.ui.Device.system.desktop) {
			jQuery("body").removeClass("sapOVPDisableUserSelect sapOVPDisableImageDrag");
		}
		jQuery(this.settings.wrapper).removeClass("dragAndDropMode");
		/*this.jqLayoutInner.removeAttr("style");
                               jQuery(this.aCardsOrder).removeAttr("style");*/

		if (jQuery(window).getSelection) {
			var selection = jQuery(window).getSelection();
			selection.removeAllRanges();
		}

	};

	Rearrange.prototype._endHandler = function(evt, ui) {
		jQuery.sap.log.info(ui);
		//Prevent text selection menu and magnifier on mobile devices
		if (sap.ui.Device.browser.mobile && this.selectableElemets) {
			this.selectableElemets.addClass("sapUiSelectable");
		}
	};
	
	
	//******** helpers *****//
	
	/**
	 * get the card and the viewport settings when the drag and resize starts
	 *
	 * @method initCardsSettings
	 */
	Rearrange.prototype.initCardsSettings = function() {
		this.jqLayout = this.layout.$();
		this.jqLayoutInner = this.jqLayout.children().first();
		var layoutScroll = this.jqLayout.scrollTop();
		var layoutHeight = this.jqLayoutInner.height();
		this.isRTLEnabled = sap.ui.getCore().getConfiguration().getRTL() ? 1 : -1;
		this.aCardsOrder = [];
		this.layoutOffset = this.jqLayout.offset();
		this.corrY = this.jqLayout.get(0).getBoundingClientRect().top + this.jqLayout.scrollTop();
		this.corrX = this.layoutOffset.left;
		this.columnCount = this.layoutUtil.oLayoutData.colCount;
		var visibleLayoutItems = this.layout.getVisibleLayoutItems();
		if (!visibleLayoutItems) {
			return;
		}
		this.aCardsOrder = visibleLayoutItems.map(function(item) {
			var element = item.$().parent()[0];
			element.posDnD = {
				width: element.offsetWidth,
				height: element.offsetHeight
			};
			element.style.width = element.offsetWidth + "px";
			return element;
		});
		var jqFirstColumn = this.jqLayoutInner.children().first();
		var marginProp = (this.isRTLEnabled === 1) ? "margin-left" : "margin-right";
		this.verticalMargin = parseInt(jqFirstColumn.css(marginProp), 10);
		var firstItemEl = this.aCardsOrder[0];
		this.horizontalMargin = parseInt(jQuery(firstItemEl).css("margin-bottom"), 10);
		this.verticalMargin = this.horizontalMargin;
		this.top = firstItemEl.getBoundingClientRect().top - this.jqLayoutInner[0].getBoundingClientRect().top;
		this.left = firstItemEl.getBoundingClientRect().left - this.jqLayoutInner[0].getBoundingClientRect().left;
		this.width = firstItemEl.offsetWidth;

		jQuery(this.aCardsOrder).css("position", "absolute");
		this.drawLayout(this.aCardsOrder);

		//all elements are switched to position absolute to prevent layout from collapsing we put height on it like it was before change.
		//and fix scroll, so user will not see position changes on the screen.
		this.jqLayoutInner.height(layoutHeight);
		this.jqLayout.scrollTop(layoutScroll);
	};

	/**
	 * put all items to new positions
	 *
	 * @method drawLayout
	 * @param {Array} aCardsLayout - card layout
	 */
	Rearrange.prototype.drawLayout = function(aCardsLayout) {
		var oCountColumnHeight = [];
		for (var i = 0; i < this.columnCount; i++) {
			oCountColumnHeight[i] = 0;
		}
		for (var naturalIndex = 0; naturalIndex < aCardsLayout.length; naturalIndex++) {
			var domElement = aCardsLayout[naturalIndex];

			var $card = jQuery(aCardsLayout[naturalIndex]);
			domElement.posDnD.top = $card.position().top;
			domElement.posDnD.bottom = $card.position().top + domElement.posDnD.height;
			domElement.posDnD.left = $card.position().left;
			domElement.posDnD.right = $card.position().left + domElement.posDnD.width;
			this.updateElementCSS(aCardsLayout[naturalIndex]);
		}
	};


	Rearrange.prototype.showGhostWhileDragMove = function(hiddenElem, ghostData) {
		// preview action: place ghost card and displace covered items by offset
		if (jQuery("#ovpDashboardLayoutMarker").length === 0) {
			// place ghost item
			jQuery(".sapUshellEasyScanLayoutInner").append(
				"<div id='ovpDashboardLayoutMarker' style= 'top: " + ghostData.top + "px;" +
				"; left: " + ghostData.left + "px;" +
				"; width: " + this.floaterData.width + "px;" +
				" height: " + this.floaterData.height + "px;" +
				"; position: absolute;'>" +

				"<div id='ovpDashboardLayoutMarkernner' class='sapOvpDasboardGhost' style= 'margin: 8px" +
				"; width: " + this.floaterData.width + "px;" +
				" height: " + this.floaterData.height + "px;'>" +
				"</div>" +

				"</div>");
		} else {
			jQuery("#ovpDashboardLayoutMarker").css({
				top: ghostData.top + "px",
				left: ghostData.left + "px"
			});
		}

		// move the wrapper of the card to the new position, the original card must not be shown
		jQuery(hiddenElem).css({
			left: ghostData.left + 2,
			top: ghostData.top + 2
		});
	};

	Rearrange.prototype.updateElementCSS = function(element) {
		jQuery(element).css({
			top: element.posDnD.top,
			left: element.posDnD.left
		});
	};

	Rearrange.prototype.getCSSTransition = function(offsetX, offsetY) {
		var oCSS = {};
		oCSS[this.cssVendorTransition] = "all 0.25s ease";
		oCSS[this.cssVendorTransform] = "translate3d(" + offsetX + "px, " + offsetY + "px, 0px)";
		return oCSS;
	};

	return Rearrange;

});