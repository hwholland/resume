sap.ui.define([], function() {
		"use strict";

		var LayoutModel = function(uiModel, iColCount) {
			this.uiModel = uiModel;
			this.setColCount(iColCount);
			this.aCards = [];
			this.oLayoutVars = null;
			this.oUndoBuffer = {};
			this.bSequenceLayout = null;
			this.oCurrLayoutVar = null;
			this.sManifestLayoutsJSON = null;
			this.iDisplaceRow = 9999;
		};

		/**
		 * set number of columns
		 *
		 * @method setColCount
		 * @param {Int} iColCount - number of columns
		 */
		LayoutModel.prototype.setColCount = function(iColCount) {

			if (!iColCount) {
				this.iColCount = 5; //default
			} else if (iColCount !== this.iColCount) {
				//extract current changed layout variant for later use
				if (this.bLayoutChanged) {
					this._updateCurrentLayoutVariant();
					this.oUndoBuffer = {};
					this.bLayoutChanged = false;
				}
				this.iColCount = iColCount;

				//console.log("colCount: " + this.iColCount);
			}
		};

		/**
		 * set layout variants
		 * (add and overwriting existing ones)
		 *
		 * @method setLayoutVars
		 * @param {Object} oLayoutVars - object containing layout variants
		 */
		LayoutModel.prototype.setLayoutVars = function(oLayoutVars) {
			var layoutKey = null;
			var sCurrentId = null;
			if (this.oCurrLayoutVar && this.oCurrLayoutVar.__ovpDBLVarId) {
				sCurrentId = this.oCurrLayoutVar.__ovpDBLVarId;
			}
			for (layoutKey in oLayoutVars) {
				if (oLayoutVars.hasOwnProperty(layoutKey) && oLayoutVars[layoutKey]) {
					//overwrite existing ones
					this.oLayoutVars[layoutKey] = oLayoutVars[layoutKey];
				}
			}
			if (sCurrentId) {
				this.oCurrLayoutVar = this.oLayoutVars[sCurrentId];
			}

			//build layout based on new variant
			this._buildGrid();

			//condense empty rows (includes update of current layout variant)
			this.condenseEmptyRows();
		};

		LayoutModel.prototype.setManifestLayoutsJSON = function(sManifestJSON) {
			this.sManifestLayoutsJSON = sManifestJSON;
		};

		/**
		 * update visibility of given cards
		 * (usually called from manage cards dialog)
		 *
		 * @method updateCardVisibility
		 * @param {Array} aChgCards - array containing card ids and visibility state
		 */
		LayoutModel.prototype.updateCardVisibility = function(aChgCards) {
			var i = 0;
			var layoutKey;
			var layoutVar;

			//extract current layout
			this.oLayoutVars["C" + this.iColCount] = this.extractCurrentLayoutVariant();

			for (i = 0; i < aChgCards.length; i++) {
				for (layoutKey in this.oLayoutVars) {
					if (this.oLayoutVars[layoutKey].hasOwnProperty(aChgCards[i].id)) {
						layoutVar = this.oLayoutVars[layoutKey];
						if (layoutVar[aChgCards[i].id].hasOwnProperty("visible") && layoutVar[aChgCards[i].id].visible === false && aChgCards[i].visibility) {
							//init cell coordinates - will be handled later in setCardsLayoutFromVariant
							layoutVar[aChgCards[i].id].col = 0;
							layoutVar[aChgCards[i].id].row = 0;
						}
						layoutVar[aChgCards[i].id].visible = aChgCards[i].visibility;
					}
				}
				this.oCurrLayoutVar = this.oLayoutVars["C" + this.iColCount];
			}
			this._setCardsLayoutFromVariant(this.aCards, this.oCurrLayoutVar);

			//condense empty rows (includes update of current layout variant)
			this.condenseEmptyRows();
		};

		/**
		 * return number of columns
		 *
		 * @method getColCount
		 * @returns {Int} iColCount - number of columns
		 */
		LayoutModel.prototype.getColCount = function() {
			return this.iColCount;
		};

		/**
		 * get cards in current layout
		 *
		 * @method getCards
		 * @param {Int} (optional) iColCount - number of columns
		 * @returns {Array} array containing cards in layout
		 */
		LayoutModel.prototype.getCards = function(iColCount) {

			//build grid if cards array was not filled before or the number of columns has changed
			if (this.aCards.length === 0 || iColCount && iColCount !== this.iColCount) {
				if (iColCount) {
					this.setColCount(iColCount);
				}
				//build grid for this.iColCount columns
				this._buildGrid();
			}

			return this.aCards;
		};

		/**
		 * get card by its id
		 *
		 * @method getCardById
		 * @param {ID} cardId
		 * @returns {Object} card
		 */
		LayoutModel.prototype.getCardById = function(cardId) {

			var oCard = null;
			var i = 0;
			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];
				if (oCard.id === cardId) {
					break;
				}
			}
			return oCard;
		};

		/**
		 * get cards that are (partly) located in given grid
		 *
		 * @method getCardsByGrid
		 * @param {Object} grid
		 * @param {String} ignoreId - (optional) id of card that should be skipped
		 * @returns {Array} of cards
		 */
		LayoutModel.prototype.getCardsByGrid = function(gridSpan, ignoreId) {
			var oCardSpan = {};
			var i = 0;
			var oCard = {};
			var aMatches = [];

			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];

				if (oCard.id === ignoreId || !oCard.dashboardLayout.visible) {
					continue;
				}

				oCardSpan.y1 = oCard.dashboardLayout.row;
				oCardSpan.x1 = oCard.dashboardLayout.column;
				oCardSpan.y2 = oCard.dashboardLayout.row + oCard.dashboardLayout.rowSpan - 1;
				oCardSpan.x2 = oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan - 1;

				if (this._checkOverlap(oCardSpan, gridSpan)) {
					aMatches.push(oCard);
				}
			}
			return aMatches;
		};

		/** 
		 * get the DashboardLayout variants in JSON format
		 * (only variants that were changed manually or originate from lrep)
		 * 
		 * @method getLayoutVariants
		 * @returns {Object} JSON containing the layout variants
		 */
		LayoutModel.prototype.getLayoutVariants4Pers = function() {
			//return this.oLayoutVars;

			var variant = null;
			//clone this.oLayoutVars and remove variants that were not changed manually
			var oPersVars = JSON.parse(JSON.stringify(this.oLayoutVars));
			for (variant in oPersVars) {
				if (oPersVars[variant].__ovpDBLVarSource === "auto" || oPersVars[variant].__ovpDBLVarSource === "manifest") {
					//delete unchanged variants
					delete oPersVars[variant];
				}
			}
			return oPersVars;
		};

		/**
		 * get card that resides at given grid position
		 *
		 * @method getCardByGridPos
		 * @param {Object} gridPos - column and row
		 * @returns {Object} card residing at grid position
		 */
		LayoutModel.prototype.getCardByGridPos = function(gridPos) {

			this._sortCardsByCol(this.aCards); // can we trust that's already sorted correctly??? not sure...

			var i = 0;
			var oCard = {};

			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];

				if (oCard.dashboardLayout.column <= gridPos.column && (oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan - 1) >= gridPos.column &&
					oCard.dashboardLayout.row <= gridPos.row && (oCard.dashboardLayout.row + oCard.dashboardLayout.rowSpan - 1) >= gridPos.row) {
					return oCard;
				}
			}
		};

		/** 
		 * read layout variants from ui model
		 * @method _readVariants
		 * @param {Boolean} bUseManifest - use manifest versions
		 */
		LayoutModel.prototype._readVariants = function(bUseManifest) {
			var oVariant = {};
			this.oLayoutVars = {};
			var oLayoutRaw = null;

			if (!this.sManifestLayoutsJSON) {
				//this is the initial call, lrep merge not yet done --> "decouple" manifest variants by storing JSON, lrep merge might overwrite later
				oLayoutRaw = this.uiModel.getProperty("/dashboardLayout");
				if (oLayoutRaw) {
					this.sManifestLayoutsJSON = JSON.stringify(oLayoutRaw);
				}
			}

			if (bUseManifest) {
				//these variants are purely manifest based (see above)
				oLayoutRaw = JSON.parse(this.sManifestLayoutsJSON);
			} else {
				//these variants can contain local changes
				oLayoutRaw = this.uiModel.getProperty("/dashboardLayout");
			}

			//pre-set bSequenceLayout; if no variants exist, grid will be build from cards sequence
			this.bSequenceLayout = true;

			if (!oLayoutRaw) {
				return;
			}
			for (var layoutKey in oLayoutRaw) {
				if (oLayoutRaw.hasOwnProperty(layoutKey) && oLayoutRaw[layoutKey]) {
					oVariant = oLayoutRaw[layoutKey];
					oVariant.id = layoutKey;

					if (bUseManifest) {
						oVariant.__ovpDBLVarSource = "manifest";
						oVariant.__ovpDBLVarId = "C" + parseInt(oVariant.id.replace(/[^0-9\.]/g, ""), 10);
					}
					this.oLayoutVars["C" + parseInt(oVariant.id.replace(/[^0-9\.]/g, ""), 10)] = oVariant;
					//variant exists --> no fallback to cards sequence
					this.bSequenceLayout = false;

				}
			}
		};

		/** 
		 * drop layout variants and reload manifest variants
		 * @method resetToManifest
		 */
		LayoutModel.prototype.resetToManifest = function() {
			this.oCurrLayoutVar = null;
			this.oLayoutVars = null;

			this._buildGrid( /*bUseManifest*/ true);
		};

		/**
		 * find best matching layout variant (or create one) and update card dashboardLayout
		 *
		 * @method _buildGrid
		 * @param {Boolean} bUseManifest - use manifest layout variants for read variants (needed for reset)
		 */
		LayoutModel.prototype._buildGrid = function(bUseManifest) {

			var i = 0;
			var oLayoutVar = null;

			if (this.aCards.length === 0) {
				//read cards if not yet done
				this.aCards = this.uiModel.getProperty("/cards");
			}
			if (!this.oLayoutVars || bUseManifest) {
				//read layout variants is not yet done
				this._readVariants(bUseManifest);
			}

			//find best matching layout variant
			if (this.bSequenceLayout) {
				this._sliceSequenceSausage();
				oLayoutVar = this.oLayoutVars["C" + this.iColCount];
				oLayoutVar.__ovpDBLVarSource = "auto";
				this.bSequenceLayout = false;
				// }
			} else if (this.oLayoutVars["C" + this.iColCount]) {
				//get matching variant -- BEST MATCH
				oLayoutVar = this.oLayoutVars["C" + this.iColCount];
			} else if (this.oCurrLayoutVar) {
				//slice current layout variant
				this._sliceSequenceSausage(this.oCurrLayoutVar);
				oLayoutVar = this.oLayoutVars["C" + this.iColCount];
				oLayoutVar.__ovpDBLVarSource = "auto";
			} else {
				//use layout variants for smaller colCounts
				for (i = this.iColCount; i > 0; i--) {
					if (this.oLayoutVars["C" + i]) {
						this._sliceSequenceSausage(this.oLayoutVars["C" + i]);
						oLayoutVar = this.oLayoutVars["C" + this.iColCount];
						oLayoutVar.__ovpDBLVarSource = "auto";
						break;
					}
				}
			}
			if (!oLayoutVar) {
				//last chance: take first variant in object
				for (var oLVar in this.oLayoutVars) {
					//slice this layout variant (the number of columns != this.iColCount)
					this._sliceSequenceSausage(this.oLayoutVars[oLVar]);
					oLayoutVar = this.oLayoutVars["C" + this.iColCount];
					oLayoutVar.__ovpDBLVarSource = "auto";
					break;
				}
			}

			this.oCurrLayoutVar = oLayoutVar;

			// set card grid data from layout variant
			this._setCardsLayoutFromVariant(this.aCards, this.oCurrLayoutVar);
			this._sortCardsByCol(this.aCards);
		};

		LayoutModel.prototype._setCardsLayoutFromVariant = function(aCards, oLayoutVariant) {
			var oCard = {};
			var oLayoutCard = {};
			var i = 0;
			var bCondenseRequired = false;

			for (i = 0; i < aCards.length; i++) {
				oCard = aCards[i];
				oLayoutCard = oLayoutVariant[oCard.id];
				if (oLayoutCard) {
					oCard.dashboardLayout = {};
					if (oLayoutCard.colSpan) {
						oCard.dashboardLayout.colSpan = oLayoutCard.colSpan;
					} else {
						oCard.dashboardLayout.colSpan = 1;
					}
					if (oLayoutCard.rowSpan) {
						oCard.dashboardLayout.rowSpan = oLayoutCard.rowSpan;
					} else {
						oCard.dashboardLayout.rowSpan = 1;
					}

					if (oLayoutCard.hasOwnProperty("visible") && oLayoutCard.visible === false) {
						oCard.dashboardLayout.column = 0;
						oCard.dashboardLayout.row = 0;
						oCard.dashboardLayout.visible = false;
						bCondenseRequired = true;
					} else {
						oCard.dashboardLayout.visible = true;

						if (oLayoutCard.col === 0 || oLayoutCard.row === 0) {
							//card was invisible before --> put it at the very end (empty rows will be condensed later)
							this._displaceCardToEnd(oCard);
							bCondenseRequired = true;
						} else {
							oCard.dashboardLayout.column = oLayoutCard.col;
							oCard.dashboardLayout.row = oLayoutCard.row;
						}

						if (oLayoutCard.autoSpan) {
							oCard.dashboardLayout.autoSpan = oLayoutCard.autoSpan;
						}
						if (oCard.dashboardLayout.colSpan > this.iColCount) {
							oCard.dashboardLayout.colSpan = this.iColCount;
						}
					}
				} else {
					//card is not maintained in layout --> put it at the very end
					//get default span from card settings
					this._setCardSpanFromDefault(oCard);
					this._displaceCardToEnd(oCard);
					bCondenseRequired = true;

					//add card to layout variant
					oLayoutVariant[oCard.id] = {
						col: oCard.dashboardLayout.column,
						row: oCard.dashboardLayout.row,
						colSpan: oCard.dashboardLayout.colSpan,
						rowSpan: oCard.dashboardLayout.rowSpan
					};
					oLayoutVariant.__ovpDBLVarSource = "auto";
				}

				//layout verification; if data is inconsistent (non existing column, too wide) put card to the end
				if (oCard.dashboardLayout.column > this.iColCount) {
					//card is located in invalid column
					this._displaceCardToEnd(oCard);
					bCondenseRequired = true;
					jQuery.sap.log.error("DashboardLayout: card (" + oCard.id + ") in invalid column -> moved to end");
				}
				if (oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan - 1 > this.iColCount) {
					//card is too wide for its position
					oCard.dashboardLayout.colSpan = Math.min(oCard.dashboardLayout.colSpan, this.iColCount);
					this._displaceCardToEnd(oCard);
					bCondenseRequired = true;
					jQuery.sap.log.error("DashboardLayout: card (" + oCard.id + ") too wide -> moved to end");
				}
			}
			if (bCondenseRequired) {
				//condense empty rows (includes update of current layout variant)
				this.condenseEmptyRows();
			}

			//finally ensure a consistent grid
			this.validateGrid( /*bRepair*/ true);
		};

		LayoutModel.prototype._displaceCardToEnd = function(oCard) {
			oCard.dashboardLayout.column = 1;
			oCard.dashboardLayout.row = this.iDisplaceRow;
			this.iDisplaceRow += oCard.dashboardLayout.rowSpan;
		};

		LayoutModel.prototype._setCardSpanFromDefault = function(oCard) {
			if (!oCard.dashboardLayout) {
				oCard.dashboardLayout = {};
			}
			if (!oCard.settings.defaultSpan || oCard.settings.defaultSpan === "auto") {
				oCard.dashboardLayout.autoSpan = true;
				oCard.dashboardLayout.colSpan = 1;
				oCard.dashboardLayout.rowSpan = 1;
			} else {
				if (oCard.settings.defaultSpan && oCard.settings.defaultSpan.cols) {
					oCard.dashboardLayout.colSpan = Math.min(oCard.settings.defaultSpan.cols, this.iColCount);
				} else {
					oCard.dashboardLayout.colSpan = 1;
				}
				if (oCard.settings.defaultSpan && oCard.settings.defaultSpan.rows) {
					oCard.dashboardLayout.rowSpan = oCard.settings.defaultSpan.rows;
				} else {
					oCard.dashboardLayout.rowSpan = 1;
				}
			}
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._sliceSequenceSausage = function(oUseVariant) {
			// fallback grid
			var i = 0;
			var j = 0;
			var iCol = 0;
			var iColEnd = 0;
			var iMaxRows = 0;
			var oCard = {};
			var aSliceCols = [];

			if (!oUseVariant) {
				this._sortCardsSausage(this.aCards);
			}

			// array to remember occupied columns
			for (i = 0; i < this.iColCount; i++) {
				aSliceCols.push({
					col: i + 1,
					rows: 0
				});
			}

			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];

				// span data from card settings
				if (!oCard.dashboardLayout) {
					oCard.dashboardLayout = {};
				}

				if (!oUseVariant || !oUseVariant.hasOwnProperty(oCard.id)) {
					//set defaults if variant not given or card is not included in variant
					this._setCardSpanFromDefault(oCard);
				} else {
					if (oUseVariant[oCard.id].hasOwnProperty("visible")) {
						oCard.dashboardLayout.visible = oUseVariant[oCard.id].visible;
					}
					if (oUseVariant[oCard.id].colSpan && oUseVariant[oCard.id].colSpan > 0) {
						oCard.dashboardLayout.colSpan = oUseVariant[oCard.id].colSpan;
					} else {
						oCard.dashboardLayout.colSpan = 1;
					}
					if (oUseVariant[oCard.id].rowSpan && oUseVariant[oCard.id].rowSpan > 0) {
						oCard.dashboardLayout.rowSpan = oUseVariant[oCard.id].rowSpan;
					} else {
						oCard.dashboardLayout.rowSpan = 1;
					}
				}

				if (oCard.dashboardLayout.hasOwnProperty("visible") && oCard.dashboardLayout.visible === false) {
					oCard.dashboardLayout.column = 0;
					oCard.dashboardLayout.row = 0;
					continue;
				} else if (!oCard.dashboardLayout.hasOwnProperty("visible")) {
					oCard.dashboardLayout.visible = true;
				}

				if (oCard.dashboardLayout.colSpan > this.iColCount) {
					oCard.dashboardLayout.colSpan = this.iColCount;
				}

				if (iColEnd < this.iColCount) {
					iCol = iColEnd + 1;
				} else {
					iCol = 1;
				}
				//iCol = (i % this.iColCount) + 1;

				//check end col
				if (iCol + oCard.dashboardLayout.colSpan - 1 > this.iColCount) {
					iCol = 1;
				}
				iColEnd = iCol + oCard.dashboardLayout.colSpan - 1;
				oCard.dashboardLayout.column = iCol;

				// get max rows of all affected rows
				iMaxRows = 0;
				for (j = oCard.dashboardLayout.column; j < oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan; j++) {
					if (aSliceCols[j - 1].rows > iMaxRows) {
						iMaxRows = aSliceCols[j - 1].rows;
					}
				}
				oCard.dashboardLayout.row = iMaxRows + 1;

				// set rows count of all affected columns
				for (j = oCard.dashboardLayout.column; j < oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan; j++) {
					aSliceCols[j - 1].rows = iMaxRows + oCard.dashboardLayout.rowSpan;
				}
			}

			this.oLayoutVars["C" + this.iColCount] = this.extractCurrentLayoutVariant();
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._sortCardsSausage = function(aCards) {
			aCards.sort(function(card1, card2) {
				// both cards have sequence position
				if (card1.sequencePos && card2.sequencePos) {
					if (card1.sequencePos < card2.sequencePos) {
						return -1;
					} else if (card1.sequencePos > card2.sequencePos) {
						return 1;
					} else {
						return 0;
					}
					// the one with sequence pos moves up
				} else if (card1.sequencePos && !card2.sequencePos) {
					return -1;
				} else if (!card1.sequencePos && card2.sequencePos) {
					return 1;
					// sort by id
				} else {
					if (card1.id < card2.id) {
						return -1;
					} else if (card1.id > card2.id) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._sortCardsByCol = function(aCards) {

			//sort by columns and order in column
			aCards.sort(function(card1, card2) {
				//if one card has no layout data, the other one get's up
				if (!card1.dashboardLayout && card2.dashboardLayout) {
					return 1;
				} else if (card1.dashboardLayout && !card2.dashboardLayout) {
					return -1;
				}

				// defaults for cards without dashboardLayout data
				if (card1.dashboardLayout.column && card1.dashboardLayout.row && card1.dashboardLayout.column === card2.dashboardLayout.column) {
					if (card1.dashboardLayout.row < card2.dashboardLayout.row) {
						return -1;
					} else if (card1.dashboardLayout.row > card2.dashboardLayout.row) {
						return 1;
					}
				} else if (card1.dashboardLayout.column) {
					return card1.dashboardLayout.column - card2.dashboardLayout.column;
				} else {
					return 0;
				}
			});
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._sortCardsByRow = function(aCards) {

			//sort by columns and order in column
			aCards.sort(function(card1, card2) {
				//if one card has no layout data, the other one get's up
				if (!card1.dashboardLayout && card2.dashboardLayout) {
					return 1;
				} else if (card1.dashboardLayout && !card2.dashboardLayout) {
					return -1;
				}

				// defaults for cards without dashboardLayout data
				if (card1.dashboardLayout.column && card1.dashboardLayout.row && card1.dashboardLayout.row === card2.dashboardLayout.row) {
					if (card1.dashboardLayout.column < card2.dashboardLayout.column) {
						return -1;
					} else if (card1.dashboardLayout.column > card2.dashboardLayout.column) {
						return 1;
					}
				} else if (card1.dashboardLayout.row) {
					return card1.dashboardLayout.row - card2.dashboardLayout.row;
				} else {
					return 0;
				}
			});
		};

		LayoutModel.prototype._checkOverlap = function(a, b) {
			var bX, bY = false;

			if ((a.x1 >= b.x1 && a.x1 <= b.x2) || // overlaps a from the left
				(a.x2 >= b.x1 && a.x2 <= b.x2) || // overlaps a from the right
				(b.x1 >= a.x1 && b.x2 <= a.x2) // inside a
			) {
				bX = true;
			}

			if ((a.y1 >= b.y1 && a.y1 <= b.y2) || // overlaps from top
				(a.y2 >= b.y1 && a.y2 <= b.y2) || // overlaps from bottom
				(b.y1 >= a.y1 && b.y2 <= a.y2) // inside a
			) {
				bY = true;
			}
			return (bX && bY);
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype.undoLastChange = function() {
			if (this.oUndoBuffer.layoutVariant) {
				this.oLayoutVars["C" + this.iColCount] = this.oUndoBuffer.layoutVariant;
				this.oUndoBuffer = {};
			}
		};

		/**
		 *
		 *
		 * @method moveCardToGrid
		 * @param {Boolean} bInProgress - function is called internally (reuse), model not stable -> do not update variant
		 */
		LayoutModel.prototype.moveCardToGrid = function(floaterId, cell, bPushHorizontal, oFloaterCard, bInProgress) {

			if (!bInProgress) {
				//internal call, model not stable
				this._registerChange("move");
			}
			var aAffectedCards = [];
			var aCondenseCards = [];

			var oFloater = null;
			if (oFloaterCard) {
				oFloater = oFloaterCard;
			} else {
				oFloater = this.getCardById(floaterId);
			}
			if (!oFloater) {
				return [];
			}

			if (cell.column < 1 || cell.column + oFloater.dashboardLayout.colSpan - 1 > this.iColCount) {
				//invalid call! --> move card back to its model position
				return [oFloater];
			}

			oFloater.dashboardLayout.column = cell.column;
			oFloater.dashboardLayout.row = cell.row;

			//get overlapped cards
			var oGrid = {
				x1: oFloater.dashboardLayout.column,
				y1: oFloater.dashboardLayout.row,
				x2: oFloater.dashboardLayout.column + oFloater.dashboardLayout.colSpan - 1,
				y2: oFloater.dashboardLayout.row + oFloater.dashboardLayout.rowSpan - 1
			};
			var aOverlaps = this.getCardsByGrid(oGrid, oFloater.id);
			//calculate min col/row and aggregated row/col span
			var oPushGrid = this._getPushGrid(aOverlaps);
			var oInsertSpan = {};

			if (bPushHorizontal) {
				oInsertSpan.rowSpan = oPushGrid.rowSpan;
				oInsertSpan.colSpan = oFloater.dashboardLayout.column + oFloater.dashboardLayout.colSpan - oPushGrid.column;
			} else {
				oInsertSpan.rowSpan = oFloater.dashboardLayout.row + oFloater.dashboardLayout.rowSpan - oPushGrid.row;
				oInsertSpan.colSpan = oPushGrid.colSpan;
			}

			aAffectedCards = this._pushCards({
				column: oPushGrid.column,
				row: oPushGrid.row
			}, oInsertSpan, oFloater.id, bPushHorizontal, aOverlaps);

			if (!bInProgress) {
				//condense empty rows (includes update of current layout variant)
				aCondenseCards = this.condenseEmptyRows();
				if (aCondenseCards.length > 0) {
					aAffectedCards = aAffectedCards.concat(aCondenseCards);
					aAffectedCards = this.condenseCardArray(aAffectedCards);
				}
			}

			return aAffectedCards;
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._getPushGrid = function(aCards) {
			var oPushGrid = {};
			var i = 0;

			var minRow = 99999;
			var maxRow = 1;
			var minCol = this.iColCount;
			var maxCol = 1;

			if (!aCards && aCards.length === 0) {
				return oPushGrid;
			}

			for (i = 0; i < aCards.length; i++) {
				if (aCards[i].dashboardLayout.row < minRow) {
					minRow = aCards[i].dashboardLayout.row;
				}
				if (aCards[i].dashboardLayout.row + aCards[i].dashboardLayout.rowSpan - 1 > maxRow) {
					maxRow = aCards[i].dashboardLayout.row + aCards[i].dashboardLayout.rowSpan - 1;
				}
				if (aCards[i].dashboardLayout.column < minCol) {
					minCol = aCards[i].dashboardLayout.column;
				}
				if (aCards[i].dashboardLayout.column + aCards[i].dashboardLayout.colSpan - 1 > maxCol) {
					maxCol = aCards[i].dashboardLayout.column + aCards[i].dashboardLayout.colSpan - 1;
				}
			}

			oPushGrid.column = minCol;
			oPushGrid.row = minRow;
			oPushGrid.colSpan = maxCol - minCol + 1;
			oPushGrid.rowSpan = maxRow - minRow + 1;

			return oPushGrid;
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._updateGapDelta = function(oGapDelta) {

			if (oGapDelta.cardLayout[oGapDelta.axis] > oGapDelta.curr) {
				//new column/row - check for empty columns/rows before it
				oGapDelta.curr = oGapDelta.cardLayout[oGapDelta.axis];

				if (oGapDelta.max > 0 && oGapDelta.curr > oGapDelta.max + 1) {
					//there is at least one empty col/row between
					oGapDelta.delta += oGapDelta.curr - 1 - oGapDelta.max;
				}
				//set max col for new column/row
				oGapDelta.max = oGapDelta.cardLayout[oGapDelta.axis] + oGapDelta.cardLayout[oGapDelta.span] - 1;
			} else {
				if (oGapDelta.cardLayout[oGapDelta.axis] + oGapDelta.cardLayout[oGapDelta.span] - 1 > oGapDelta.max) {
					//this card has more columns/rows
					oGapDelta.max = oGapDelta.cardLayout[oGapDelta.axis] + oGapDelta.cardLayout[oGapDelta.span] - 1;
				}
			}
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._pushCards = function(oUpperLeftCell, oInsertSpan, floaterId, bPushHorizontal, aOverlapCards) {

			var i = 0;
			var j = 0;
			var iNew1 = 0;
			var iNew2 = 0;
			var iEndRow = 0;
			var oGapDelta = {
				curr: 0,
				max: 0,
				delta: 0
			};
			var oInsertGrid = {
				column: oUpperLeftCell.column,
				row: oUpperLeftCell.row
			};

			var aAffectedCards = [];
			var aPushedDownCards = [];

			//-------- HORIZONTAL --------------------------------------------------------
			if (bPushHorizontal) {
				var aFallDownCards = [];
				oGapDelta.axis = "column";
				oGapDelta.span = "colSpan";
				oGapDelta.curr = oUpperLeftCell.column - 1;
				oGapDelta.max = oUpperLeftCell.column - 1;

				oInsertGrid.rowSpan = oInsertSpan.rowSpan;
				oInsertGrid.colSpan = 0;

				if (aOverlapCards && aOverlapCards.length > 0) {
					//get followers based onn add cards
					for (j in aOverlapCards) {
						if (aOverlapCards[j].dashboardLayout) {
							aAffectedCards = aAffectedCards.concat(this._getHorizontalFollower(aOverlapCards[j].dashboardLayout, floaterId));
						}
					}
					aAffectedCards = this.condenseCardArray(aAffectedCards);
				} else {
					//get followers using insert grid
					aAffectedCards = this._getHorizontalFollower(oInsertGrid, floaterId);
				}

				for (i = 0; i < aAffectedCards.length; i++) {

					oGapDelta.cardLayout = aAffectedCards[i].dashboardLayout;
					this._updateGapDelta(oGapDelta);

					iNew1 = aAffectedCards[i].dashboardLayout.column + oInsertSpan.colSpan - oGapDelta.delta;
					iNew2 = iNew1 + aAffectedCards[i].dashboardLayout.colSpan - 1;

					if (iNew1 > aAffectedCards[i].dashboardLayout.column) {
						if (iNew2 <= this.iColCount) {
							aAffectedCards[i].dashboardLayout.column = iNew1;
							iEndRow = aAffectedCards[i].dashboardLayout.row + aAffectedCards[i].dashboardLayout.rowSpan - 1;
						} else {
							aFallDownCards.push(aAffectedCards[i]);
						}
					}
				}
				if (aFallDownCards.length > 0) {
					if (iEndRow === 0) {
						//insert cards after last card in row; if no card was pushed directly, take insertGrid data
						var oFloaterCard = this.getCardById(floaterId);
						if (oFloaterCard) {
							iEndRow = oFloaterCard.dashboardLayout.row + oFloaterCard.dashboardLayout.rowSpan - 1;
						} else {
							iEndRow = oInsertGrid.row + oInsertGrid.rowSpan - 1;
						}
					}
					aPushedDownCards = this._pushFallDownCards(iEndRow + 1, floaterId, aFallDownCards);

					if (aPushedDownCards.length > 0) {
						aAffectedCards = this.condenseCardArray(aAffectedCards.concat(aPushedDownCards));
					}
				}

			} else {
				//-------- VERTICAL --------------------------------------------------------
				oGapDelta.axis = "row";
				oGapDelta.span = "rowSpan";
				oGapDelta.curr = oUpperLeftCell.row - 1;
				oGapDelta.max = oUpperLeftCell.row - 1;

				oInsertGrid.rowSpan = 0;
				oInsertGrid.colSpan = oInsertSpan.colSpan;

				if (aOverlapCards && aOverlapCards.length > 0) {
					//get followers based onn add cards
					for (j in aOverlapCards) {
						if (aOverlapCards[j].dashboardLayout) {
							aAffectedCards = aAffectedCards.concat(this._getVerticalFollower(aOverlapCards[j].dashboardLayout, floaterId));
						}
					}
					aAffectedCards = this.condenseCardArray(aAffectedCards);
					this._sortCardsByRow(aAffectedCards);
				} else {
					//get followers using insert grid
					aAffectedCards = this._getVerticalFollower(oInsertGrid, floaterId);
				}

				for (i = 0; i < aAffectedCards.length; i++) {

					oGapDelta.cardLayout = aAffectedCards[i].dashboardLayout;
					this._updateGapDelta(oGapDelta);

					iNew1 = aAffectedCards[i].dashboardLayout.row + oInsertSpan.rowSpan - oGapDelta.delta;

					if (iNew1 > aAffectedCards[i].dashboardLayout.row) {
						aAffectedCards[i].dashboardLayout.row = iNew1;
					}
				}
			}
			return aAffectedCards;
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype.resizeCard = function(cardId, oSpan, bManualResize) {

			this._registerChange("resize");

			var oRCard = this.getCardById(cardId);
			if (!oRCard) {
				return [];
			}
			var deltaH = oSpan.colSpan - oRCard.dashboardLayout.colSpan;
			var deltaV = oSpan.rowSpan - oRCard.dashboardLayout.rowSpan;

			if (deltaH === 0 && deltaV === 0) {
				return {
					resizeCard: oRCard,
					affectedCards: []
				};
			} else if (bManualResize && oRCard.dashboardLayout.autoSpan) {
				oRCard.dashboardLayout.autoSpan = false;
			}

			var aAffectedCards = [];
			var aAffectedCardsV = [];

			// 1) push horizontally
			if (deltaH > 0) {

				if (deltaV < 0) {
					//special case: if size is reduced: push with NEW size!
					// copy resize card layout data, don't use original data reference!
					aAffectedCards = this._pushCards({
						column: oRCard.dashboardLayout.column + oRCard.dashboardLayout.colSpan,
						row: oRCard.dashboardLayout.row
					}, {
						colSpan: deltaH,
						rowSpan: oSpan.rowSpan
					}, cardId, true);
				} else {
					aAffectedCards = this._pushCards({
						column: oRCard.dashboardLayout.column + oRCard.dashboardLayout.colSpan,
						row: oRCard.dashboardLayout.row
					}, {
						colSpan: deltaH,
						rowSpan: oSpan.rowSpan
					}, cardId, true);
				}
			}
			oRCard.dashboardLayout.colSpan = oSpan.colSpan;
			//2) push vertically
			if (deltaV > 0) {

				if (deltaH < 0) {
					//special case: if size is reduced: push with NEW size!
					// copy resize card layout data, don't use original data reference!
					aAffectedCardsV = this._pushCards({
						column: oRCard.dashboardLayout.column,
						row: oRCard.dashboardLayout.row + oRCard.dashboardLayout.rowSpan
					}, {
						colSpan: oSpan.colSpan,
						rowSpan: deltaV
					}, cardId, false);
				} else {
					aAffectedCardsV = this._pushCards({
						column: oRCard.dashboardLayout.column,
						row: oRCard.dashboardLayout.row + oRCard.dashboardLayout.rowSpan
					}, {
						colSpan: oSpan.colSpan,
						rowSpan: deltaV
					}, cardId, false);
				}
			}

			oRCard.dashboardLayout.rowSpan = oSpan.rowSpan;

			// concat arrays
			aAffectedCards = aAffectedCards.concat(aAffectedCardsV);
			aAffectedCards = this.condenseCardArray(aAffectedCards);

			//condense empty rows (includes update of current layout variant)
			aAffectedCardsV = this.condenseEmptyRows();
			if (aAffectedCardsV.length > 0) {
				aAffectedCards = aAffectedCards.concat(aAffectedCardsV);
				aAffectedCards = this.condenseCardArray(aAffectedCards);
			}

			return {
				resizeCard: oRCard,
				affectedCards: aAffectedCards
			};
		};

		/**
		 *
		 *
		 * @method
		 */
		LayoutModel.prototype._pushFallDownCards = function(insRow, ignoreId, aPCards) {
			//move cards to grid pos
			var i = 0;
			var oNextRowData = {};
			var oTargetCell = {};
			var aAffectedCards = [];
			var aAggrAffectedCards = [];
			for (i = aPCards.length - 1; i >= 0; i--) {
				//preset target row
				aPCards[i].dashboardLayout.row = insRow;
				//get next possible insert row (and the cards that collide)
				oNextRowData = this._getNextPossibleRowAndColliders(insRow, aPCards[i]);
				oTargetCell.column = this.iColCount - aPCards[i].dashboardLayout.colSpan + 1;
				oTargetCell.row = oNextRowData.row;
				aAffectedCards = this.moveCardToGrid(aPCards[i].id, oTargetCell, /*bHoriz*/ false, aPCards[i], /*bInProgress*/ true);
				aAggrAffectedCards = aAggrAffectedCards.concat(aAffectedCards);
			}
			aAggrAffectedCards = this.condenseCardArray(aAggrAffectedCards);
			return aAggrAffectedCards;
		};

		/**
		 * find next possible insertion row and the cards, that collide with it
		 *
		 * @method _getNextPossibleRowAndColliders
		 * @param {Int} insRow - intended insertion row
		 * @param {Int} column - grid column
		 * @param {Int} colSpan -  column span
		 * @returns {Object} Object containing the target row and the colliding cards
		 */
		LayoutModel.prototype._getNextPossibleRowAndColliders = function(insRow, insCard) {
			var i = 0;
			var oCard;
			var iTargetRow = insRow;
			var aCollidingCards = [];
			for (i = insCard.dashboardLayout.column; i <= insCard.dashboardLayout.column + insCard.dashboardLayout.colSpan - 1; i++) {
				oCard = this.getCardByGridPos({
					column: i,
					row: insRow
				});
				if (oCard && oCard.dashboardLayout && oCard.id !== insCard.id) {
					if (oCard.dashboardLayout.row === insRow) {
						//card starts here -> can be inserted before
						//remember card, it has to be pushed down below iTargetRow later
						aCollidingCards.push(oCard);
					} else if (oCard.dashboardLayout.row + oCard.dashboardLayout.rowSpan + 1 > iTargetRow) {
						//insert after this card
						iTargetRow = oCard.dashboardLayout.row + oCard.dashboardLayout.rowSpan + 1;
					}
				}
			}
			return {
				row: iTargetRow,
				collidingCards: aCollidingCards
			};
		};

		/**
		 * collect all cards that needs to be rearranged in horizontal direction after floater insertion
		 *
		 * @method getHorizontalFollower
		 * @param {Object} insertMarker - insertion marker position and size
		 * @param {ID} floaterId - ID of the floater card
		 * @returns {Array} aHFollow - Array with all members from this.aCards that needs to be shifted to the right
		 */
		LayoutModel.prototype._getHorizontalFollower = function(insertMarker, floaterId) {
			this._sortCardsByCol(this.aCards);
			var aHFollow = [];
			var extStartRow = insertMarker.row; //start of pusher
			var extEndRow = insertMarker.row + insertMarker.rowSpan - 1; //end of pusher. Initial value is floater height
			var i = 0;
			var oCard = {};
			var cardEndRow = 0;

			if (insertMarker.column <= this.iColCount + insertMarker.colSpan) { //no insert marker at right grid border 
				for (i = 0; i < this.aCards.length; i++) {
					oCard = this.aCards[i];
					if (oCard.id === floaterId || !oCard.dashboardLayout.visible) {
						continue; //skip floater and invisible cards
					}
					cardEndRow = oCard.dashboardLayout.row + oCard.dashboardLayout.rowSpan - 1;
					if (oCard.dashboardLayout.column >= insertMarker.column && oCard.dashboardLayout.row <= extEndRow && cardEndRow >= extStartRow) {

						if (cardEndRow > extEndRow) {
							extEndRow = cardEndRow; //resize pusher height to cover all cards to the right which overlap with the biggest card in the row
						}
						if (oCard.dashboardLayout.row < extStartRow) {
							extStartRow = oCard.dashboardLayout.row;
						}
						aHFollow.push(oCard);
					}
				}
			}
			return aHFollow;
		};

		/**
		 * collect all cards that needs to be rearranged in vertical direction after floater insertion
		 *
		 * @method getVerticalFollower
		 * @param {Object} insertMarker - insertion marker position and size
		 * @param {ID} floaterId - ID of the floater card
		 * @returns {Array} aVFollow - Array with all members from this.aCards that needs to be shifted to the right
		 */
		LayoutModel.prototype._getVerticalFollower = function(insertMarker, floaterId) {
			var aVFollow = [];
			this._sortCardsByRow(this.aCards);
			var extStartCol = insertMarker.column; //start of pusher
			var extEndCol = insertMarker.column + insertMarker.colSpan - 1; //end of pusher. Initial value is floater width
			var i = 0;
			var oCard = {};
			var cardEndCol = 0;

			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];
				if (oCard.id === floaterId || !oCard.dashboardLayout.visible) {
					continue; //skip floater and invisible cards
				}
				cardEndCol = oCard.dashboardLayout.column + oCard.dashboardLayout.colSpan - 1;
				if (oCard.dashboardLayout.row >= insertMarker.row && oCard.dashboardLayout.column <= extEndCol && cardEndCol >= extStartCol) {

					if (cardEndCol > extEndCol) {
						extEndCol = cardEndCol; //resize pusher height to cover all cards to the right which overlap with the biggest card in the row
					}
					if (oCard.dashboardLayout.column < extStartCol) {
						extStartCol = oCard.dashboardLayout.column;
					}
					aVFollow.push(oCard);
				}
			}

			return aVFollow;
		};

		/**
		 * drop duplicate entries in given array
		 *
		 * @method condenseCardArray
		 * @param {Array} array of cards
		 * @return {Array} resulting condensed array
		 */
		LayoutModel.prototype.condenseCardArray = function(array) {
			//array.sort();
			this._sortCardsByCol(array);
			return array.reduce(function(collect, current) {
				if (collect.indexOf(current) < 0) {
					collect.push(current);
				}
				return collect;
			}, []);
			//return this._sortCardsByCol(array);
		};

		/**
		 * extract the current layout variant into a new object
		 *
		 * @method extractCurrentLayoutVariant
		 * @returns {Object} new object containing current layout variant data
		 */
		LayoutModel.prototype.extractCurrentLayoutVariant = function() {
			var i = 0;
			var oCard = {};
			var oVariant = {};

			for (i = 0; i < this.aCards.length; i++) {
				oCard = this.aCards[i];
				oVariant[oCard.id] = {
					col: oCard.dashboardLayout.column,
					row: oCard.dashboardLayout.row,
					colSpan: oCard.dashboardLayout.colSpan,
					rowSpan: oCard.dashboardLayout.rowSpan,
					visible: oCard.dashboardLayout.visible
				};
				if (oCard.dashboardLayout.autoSpan) {
					oVariant[oCard.id].autoSpan = oCard.dashboardLayout.autoSpan;
				}
			}
			if (this.oCurrLayoutVar && this.oCurrLayoutVar.__ovpDBLVarSource) {
				oVariant.__ovpDBLVarSource = this.oCurrLayoutVar.__ovpDBLVarSource;
			}
			oVariant.__ovpDBLVarId = "C" + this.iColCount;
			return oVariant;
		};

		/**
		 * update the current layout variant
		 *
		 * @method _updateCurrentLayoutVariant
		 */
		LayoutModel.prototype._updateCurrentLayoutVariant = function() {
			this.oCurrLayoutVar = this.extractCurrentLayoutVariant();
			this.oLayoutVars["C" + this.iColCount] = this.oCurrLayoutVar;
		};

		/**
		 * get the current layout variant
		 *
		 * @method _getCurrentLayoutVariant
		 * @returns current layout variant
		 */
		LayoutModel.prototype._getCurrentLayoutVariant = function() {
			//return this.oLayoutVars["C" + this.iColCount];
			return this.oCurrLayoutVar;
		};

		LayoutModel.prototype._registerChange = function(action) {
			this.bLayoutChanged = true;
			this.oCurrLayoutVar.__ovpDBLVarSource = "user";
			this.oUndoBuffer.action = action;
			this.oUndoBuffer.layoutVariant = this.extractCurrentLayoutVariant();
		};

		/**
		 * get an array containing all occupied grid cells and their "tenant"
		 *
		 * @method _extractGrid
		 * @param sortBy - "col" or "row"
		 * @returns array of cells
		 */
		LayoutModel.prototype._extractGrid = function(sortBy) {
			var first = sortBy;
			var second = "";

			if (first === "col") {
				second = "row";
			} else if (first === "row") {
				second = "col";
			} else {
				jQuery.sap.log.error("DashboardLayoutModel._getCurrentLayoutVariant: param sortBy has to be col or row!");
			}

			//get occupied cells first
			var aCells = [];
			var i = 0;
			var ri = 0;
			var ci = 0;

			for (i = 0; i < this.aCards.length; i++) {
				var cardLayout = this.aCards[i].dashboardLayout;
				if (cardLayout.visible === false) {
					continue;
				}
				for (ri = cardLayout.row; ri < cardLayout.row + cardLayout.rowSpan; ri++) {
					for (ci = cardLayout.column; ci < cardLayout.column + cardLayout.colSpan; ci++) {
						aCells.push({
							col: ci,
							row: ri,
							card: this.aCards[i]
						});
					}
				}
			}

			//sort by given attribute
			aCells.sort(function(cell1, cell2) {
				// defaults for cards without dashboardLayout data
				if (cell1[first] === cell2[first]) {
					if (cell1[second] < cell2[second]) {
						return -1;
					} else if (cell1[second] > cell2[second]) {
						return 1;
					}
				} else {
					return cell1[first] - cell2[first];
				}
			});
			return aCells;
		};

		/**
		 * get the current layout variant
		 *
		 * @method validateGrid
		 * @param bRepair - repair grid (put inconistent cards at the end)
		 * @returns bGridValid - indicates the validity
		 */
		LayoutModel.prototype.validateGrid = function(bRepair) {
			var bGridValid = true;
			var i = 0;
			var aCells = this._extractGrid("row");
			var prev = aCells[0];
			var curr = {};
			var aDisplaceCards = [];

			for (i = 1; i < aCells.length; i++) {
				curr = aCells[i];
				if (curr.col > this.iColCount || curr.col < 0) {
					bGridValid = false;
					aDisplaceCards.push(curr.card);
					jQuery.sap.log.error("DashboardLayout: Cell is outside (col/row): " + curr.col + "/" + curr.row);
				}
				if (curr.col === prev.col && curr.row === prev.row) {
					bGridValid = false;
					aDisplaceCards.push(curr.card);
					jQuery.sap.log.error("DashboardLayout: Cell has two tenants (col/row//id1/id2: " + curr.col + "/" + curr.row + "//" + prev.card.id +
						"/" + curr
						.card.id);
				}
				prev = curr;
			}

			//repair grid
			if (bRepair && aDisplaceCards.length > 0) {
				aDisplaceCards = this.condenseCardArray(aDisplaceCards);
				for (i = 0; i < aDisplaceCards.length; i++) {
					this._displaceCardToEnd(aDisplaceCards[i]);
				}
				this.condenseEmptyRows();
				bGridValid = true;
				jQuery.sap.log.info("DashboardLayout: invalid grid repaired");
			}

			return bGridValid;
		};

		LayoutModel.prototype.condenseEmptyRows = function() {
			var aCells = this._extractGrid("row");
			var i = 0;
			var prevRow = 0;
			var currRow = 0;
			var iAggDelta = 0;
			var prevCard = {};
			var cell = {};
			var aAffectedCards = [];

			for (i = 0; i < aCells.length; i++) {
				cell = aCells[i];

				if (currRow !== cell.row) {
					prevRow = currRow;
					currRow = cell.row;
					if (prevRow === 0 && currRow > 1) {
						//empty first rows will be condensed to 0
						iAggDelta += currRow - 1;
					} else if (currRow - prevRow > 2) {
						iAggDelta += currRow - prevRow - 2;
					}
				}

				// there are at least two empty rows --> move up
				if (prevCard !== cell.card) {
					if (cell.row === cell.card.dashboardLayout.row) {
						//move each card only once!
						cell.card.dashboardLayout.row -= iAggDelta;
						prevCard = cell.card;
						aAffectedCards.push(cell.card);
					}
				}
			}
			this._updateCurrentLayoutVariant();

			//reset displace start row
			this.iDisplaceRow = 9999;

			return aAffectedCards;
		};

		return LayoutModel;

	}, /* bExport= */
	true);