/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

//Provides control sap.ui.vk.ProgressIndicator.
sap.ui.define(["jquery.sap.global", "./library", "sap/ui/core/Control"],
	function(jQuery, library, Control) {
		"use strict";

		/**
		 *  Constructor for a new ProgressIndicator.
		 *
		 * @class Provides a progress indicator to show the download and rendering status of resources being loaded into a scene.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.38.15
		 * @extends sap.ui.core.Control
		 * @alias sap.ui.vk.ProgressIndicator
		 * @experimental Since 1.38.0 This class is experimental and might be modified or removed in future versions.
		 */
		var ProgressIndicator = Control.extend("sap.ui.vk.ProgressIndicator", /** @lends sap.ui.vk.ProgressIndicator.prototype */ {
			metadata: {
				library: "sap.ui.vk",

				properties: {
					/*
					 * The number of files that are currently downloaded/rendered.
					 */
					numberOfFiles: {
						type: "int",
						defaultValue: 0
					}
				},

				publicMethods: [
					"reset",
					"updateDownloadStatus",
					"updateRenderStatus"
				],

				aggregations: {
					progressBar: {
						type: "sap.m.ProgressIndicator",
						multiple: false,
						visibility: "hidden"
					},
					progressText: {
						type: "sap.m.Text",
						multiple: false,
						visibility: "hidden"
					}
				}
			}
		});

		ProgressIndicator.prototype.init = function() {
			this._progressBar = new sap.m.ProgressIndicator({
				width: "100%",
				height: "0.375em"
			});

			this.setAggregation("progressBar", this._progressBar);

			this._progressText = new sap.m.Text();
			this._progressText.addStyleClass("sapUiVizkitProgressIndicatorText");

			this.setAggregation("progressText", this._progressText);

			this.reset();
		};

		/**
		 * Resets the download and rendering properties of the progress indicator to their default values.
		 *
		 * @returns {sap.ui.vk.ProgressIndicator} <code>this</code> to allow method chaining.
		 * @public
		 */
		ProgressIndicator.prototype.reset = function() {
			this._downloadStatusByFile = {};
			this._downloadStatusTotal = 0;
			this._renderStatusFileCounter = 0;
			this._renderStatusByFile = {};
			this._renderStatusPreviousUpdate = -1;
			this._renderStatusTotal = 0;
			this.setNumberOfFiles(0);
			this._progressBar.setPercentValue(0);

			return this;
		};

		/**
		 * Updates the progress bar during the downloading phase.
		 * When multiple files are being downloaded, the progress bar updates to show the overall download progress for all the files.
		 * @param {string} fileName The name of the file which sent the download progress event.
		 * @param {number} loaded The amount of data that has been downloaded so far for this particular file.
		 * @param {number} totalFileSize The total size of the file currently being downloaded.
		 * @returns {sap.ui.vk.ProgressIndicator} <code>this</code> to allow method chaining.
		 * @public
		 */
		ProgressIndicator.prototype.updateDownloadStatus = function(fileName, loaded, totalFileSize) {
			if (!totalFileSize) {
				//If totalFileSize is 0, it means the server doesn't send the content-length response header
				//in which case we set the this_downloadStatusTotal to 50 so it can be used when calculating
				//the rendering progress.
				this._downloadStatusTotal = 50;
				//We set the progress indicator text to "Downloading..." without showing value/percentage sign
				this._progressText.setText(sap.ui.vk.getResourceBundle().getText("PROGRESS_INDICATOR_DOWNLOADING"));
			} else {
				//multiply by 100 to get percentage format;
				//divide by number of files so we can indicate the total progress of multiple files;
				//divide by 2 because there are 2 phases: download phase & rendering phase
				var singleFilePercentage = loaded / totalFileSize * 100 / this.getNumberOfFiles() / 2;

				this._downloadStatusByFile[fileName] = singleFilePercentage;

				this._downloadStatusTotal = 0;
				for (var property in this._downloadStatusByFile) {
					if (this._downloadStatusByFile.hasOwnProperty(property)) {
						this._downloadStatusTotal += this._downloadStatusByFile[property];
					}
				}

				var barPercentage = Math.floor(this._downloadStatusTotal + this._renderStatusTotal);
				this._progressBar.setPercentValue(barPercentage);
				this._progressText.setText(sap.ui.vk.getResourceBundle().getText("PROGRESS_INDICATOR_DOWNLOADING") + barPercentage + "%");

			}
			return this;
		};

		/**
		 * Updates the progress bar during the rendering phase.
		 * When multiple files have been downloaded, the progress bar updates to show the overall rendering progress for all the files.
		 * @param {number} currentPercentage A percentage showing the rendering progress of the current file or files.
		 * @returns {sap.ui.vk.ProgressIndicator} <code>this</code> to allow method chaining.
		 * @public
		 */
		ProgressIndicator.prototype.updateRenderStatus = function(currentPercentage) {
			if (currentPercentage < this._renderStatusPreviousUpdate) {
				this._renderStatusFileCounter++;
			}
			this._renderStatusPreviousUpdate = currentPercentage;
			this._renderStatusTotal = (currentPercentage + this._renderStatusFileCounter) * 100 / this.getNumberOfFiles() / 2;

			var barPercentage = Math.floor(this._downloadStatusTotal + this._renderStatusTotal);
			this._progressBar.setPercentValue(barPercentage);
			this._progressText.setText(sap.ui.vk.getResourceBundle().getText("PROGRESS_INDICATOR_RENDERING") + barPercentage + "%");
			return this;
		};

		return ProgressIndicator;

	});
