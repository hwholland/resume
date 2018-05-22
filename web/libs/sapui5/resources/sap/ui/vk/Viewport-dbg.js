/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Viewport.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/core/Control", "sap/ui/core/ResizeHandler", "./Loco", "./ViewportHandler", "./GraphicsCore", "./Messages"
], function (jQuery, library, Control, ResizeHandler, Loco, ViewportHandler, GraphicsCore, Messages) {
	"use strict";

	/**
	 * Constructor for a new Viewport.
	 *
	 * @class
	 * Provides a rendering canvas for the 3D elements of a loaded scene.
	 *
	 * @param {string} [sId] ID for the new Viewport control. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new Viewport control.
	 * @public
	 * @author SAP SE
	 * @version 1.38.15
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vk.Viewport
	 * @experimental Since 1.32.0 This class is experimental and might be modified or removed in future versions.
	 */
	var Viewport = Control.extend("sap.ui.vk.Viewport", /** @lends sap.ui.vk.Viewport.prototype */ {
		metadata: {
			library: "sap.ui.vk",
			publicMethods: [
				"setGraphicsCore",
				"getGraphicsCore",
				"setScene",
				"setViewStateManager",
				"beginGesture",
				"endGesture",
				"pan",
				"rotate",
				"zoom",
				"tap",
				"queueCommand",
				"getViewInfo",
				"setViewInfo"
			],
			properties: {
				/**
				 * Shows or hides the debug info.
				 */
				showDebugInfo: "boolean"
			}
		}
	});

	Viewport.prototype.init = function () {
		this._messages = new Messages();
		if (Control.prototype.init) {
			Control.prototype.init(this);
		}

		this._graphicsCore = null;
		this._dvl = null;
		this._dvlRendererId = null;
		this._canvas = null;
		this._resizeListenerId = null;

		this._viewportHandler = new ViewportHandler(this);
		this._loco = new Loco();
		this._loco.addHandler(this._viewportHandler);

		//dictionaries for strings
		this._dictionary = {
			encodedProjectionType: {},
			decodedProjectionType: {
				perspective: sap.ve.dvl.DVLCAMERAPROJECTION.PERSPECTIVE,
				orthographic: sap.ve.dvl.DVLCAMERAPROJECTION.ORTHOGRAPHIC
			},
			encodedBindingType: {},
			decodedBindingType: {
				minimum: sap.ve.dvl.DVLCAMERAFOVBINDING.MIN,
				maximum: sap.ve.dvl.DVLCAMERAFOVBINDING.MAX,
				horizontal: sap.ve.dvl.DVLCAMERAFOVBINDING.HORZ,
				vertical: sap.ve.dvl.DVLCAMERAFOVBINDING.VERT
			}
		};
		//camera projection type
		this._dictionary.encodedProjectionType[sap.ve.dvl.DVLCAMERAPROJECTION.PERSPECTIVE] = "perspective";
		this._dictionary.encodedProjectionType[sap.ve.dvl.DVLCAMERAPROJECTION.ORTHOGRAPHIC] = "orthographic";
		//camera FOVBinding
		this._dictionary.encodedBindingType[sap.ve.dvl.DVLCAMERAFOVBINDING.MIN] = "minimum";
		this._dictionary.encodedBindingType[sap.ve.dvl.DVLCAMERAFOVBINDING.MAX] = "maximum";
		this._dictionary.encodedBindingType[sap.ve.dvl.DVLCAMERAFOVBINDING.HORZ] = "horizontal";
		this._dictionary.encodedBindingType[sap.ve.dvl.DVLCAMERAFOVBINDING.VERT] = "vertical";
	};

	Viewport.prototype.exit = function () {
		this._loco.removeHandler(this._viewportHandler);
		this._viewportHandler.destroy();

		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}

		this.setViewStateManager(null);
		this.setScene(null);
		this.setGraphicsCore(null);
		this._dictionary = null;
		if (Control.prototype.exit) {
			Control.prototype.exit.apply(this);
		}
	};

	/**
	 * Attaches or detaches the Viewport to the {@link sap.ui.vk.GraphicsCore GraphicsCore} object.
	 *
	 * @param {sap.ui.vk.GraphicsCore} graphicsCore The {@link sap.ui.vk.GraphicsCore GraphicsCore} object or <code>null</code>.
	 * If the <code>graphicsCore</code> parameter is not <code>null</code>, a rendering object corresponding to the Viewport is created.
	 * If the <code>graphicsCore</code> parameter is <code>null</code>, the rendering object corresponding to the Viewport is destroyed.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 */
	Viewport.prototype.setGraphicsCore = function (graphicsCore) {
		if (graphicsCore != this._graphicsCore) {
			if (graphicsCore && this._graphicsCore && this._graphicsCore._getViewportCount() > 0) {
				jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT18.summary), this._messages.messages.VIT18.code, "sap.ui.vk.Viewport");
			}

			if (this._graphicsCore) {
				if (this._graphicsCore._unregisterViewport(this)) {
					if (this._graphicsCore._getViewportCount() === 0) {
						this._dvl.Core.StopRenderLoop();
					}
				}
			}

			this._dvlRendererId = null;
			this._dvl = null;

			this._graphicsCore = graphicsCore;

			if (this._graphicsCore) {
				var shouldStartRenderLoop = this._graphicsCore._getViewportCount() === 0;
				this._dvl = this._graphicsCore._getDvl();
				this._dvlRendererId = this._dvl.Core.GetRendererPtr();
				if (sap.ui.Device.os.ios) { // set gradient opaque background for iOS platform
					this._dvl.Renderer.SetBackgroundColor(0, 0, 0, 1, 1, 1, 1, 1);
				} else { // set grey transparent background for all other platforms
					this._dvl.Renderer.SetBackgroundColor(0.5, 0.5, 0.5, 0, 0.5, 0.5, 0.5, 0);
				}
				this._setCanvas(this._graphicsCore._getCanvas());
				this._graphicsCore._registerViewport(this);
				if (shouldStartRenderLoop) {
					this._dvl.Core.StartRenderLoop();
				}
				this.setShowDebugInfo(this.getShowDebugInfo()); // Synchronise DVL internals with viewport properties.
			}
		}
		return this;
	};

	/**
	 * Gets the {@link sap.ui.vk.GraphicsCore GraphicsCore} object the Viewport is attached to.
	 * @returns {sap.ui.vk.GraphicsCore} The {@link sap.ui.vk.GraphicsCore GraphicsCore} object the Viewport is attached to, or <code>null</code>.
	 * @public
	 */
	Viewport.prototype.getGraphicsCore = function () {
		return this._graphicsCore;
	};

	/**
	 * Sets the {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} element for rendering 3D content.
	 * @param {HTMLCanvasElement} canvas The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} element.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @private
	 */
	Viewport.prototype._setCanvas = function (canvas) {
		// Invalidate the viewport only when it is already rendered.
		var shouldInvalidate = this.getDomRef() && this._canvas !== canvas;
		this._canvas = canvas;
		if (shouldInvalidate) {
			this.invalidate();
		}
		return this;
	};

	/**
	 * Attaches the scene to the Viewport for rendering.
	 * @param {sap.ui.vk.Scene} scene The scene to attach to the Viewport.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 */
	Viewport.prototype.setScene = function (scene) {
		if (this._dvlRendererId) {
			this._dvl.Renderer.AttachScene(scene && scene._getDvlSceneId() || null);
			this._dvlSceneId = scene ? scene._getDvlSceneId() : null;
		}
		return this;
	};

	/**
	 * Retrieves the step index and the procedure index that can be used to store different steps since you cannot the save the dynamically generated stepId.
	 * @param {array} procedures The first argument is the procedure array where the search takes place.
	 * @param {string} stepId The second argument is the stepId for which we need to retrieve the step index and procedure index.
	 * @returns {object} An object which has to properties: <code>stepIndex</code> and <code>procedureIndex</code>.
	 * @private
	 */
	Viewport.prototype._getStepAndProcedureIndexes = function(procedures, stepId) {
		var procedureIndex = -1,
			stepIndex = -1,
			isFound = false;

		for (var i = 0; i < procedures.length; i++) {
			if (!isFound) {
				for (var j = 0; j < procedures[i].steps.length; j++) {
					if (procedures[i].steps[j].id === stepId) {
						stepIndex = j;
						procedureIndex = i;
						isFound = true;
						break;
					}
				}
			} else {
				break;
			}
		}

		return {
			stepIndex: stepIndex,
			procedureIndex: procedureIndex
		};
	};

	/**
	 * Retrieves information about the current camera view in the scene, and saves the information in a JSON-like object.
	 * The information can then be used at a later time to restore the scene to the same camera view using the
	 * {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} method.<br/>
	 * @returns {object} JSON-like object which holds the current view information.
	 * @public
	 */
	Viewport.prototype.getViewInfo = function () {
		//return null if dvlSceneId is null or not set
		if (this._dvlSceneId === null || this._dvlSceneId === undefined) {
			return null;
		}

		//calculate camera rotation
		var cameraId = this._dvl.Scene.GetCurrentCamera(this._dvlSceneId),
			rotation = this._dvl.Camera.GetRotation(cameraId),
			cameraRotation = {
				yaw: rotation[0],
				pitch: rotation[1],
				roll: rotation[2]
			};

		//calculate camera position
		var cameraOrigin = this._dvl.Camera.GetOrigin(cameraId),
			cameraPosition = {
				x: cameraOrigin[0],
				y: cameraOrigin[1],
				z: cameraOrigin[2]
			};

		var viewInfo = {
			camera: {
				rotation: cameraRotation,
				position: cameraPosition,
				projectionType: this._dictionary.encodedProjectionType[this._dvl.Camera.GetProjection(cameraId)],
				bindingType: this._dictionary.encodedBindingType[this._dvl.Camera.GetFOVBinding(cameraId)]
			}
		};

		//calculating the zoom factor / field of view
		if (this._dictionary.encodedProjectionType[this._dvl.Camera.GetProjection(cameraId)] === "perspective") {
			//If the projection is "perspective", we get the Field of View.
			viewInfo.camera.fieldOfView = this._dvl.Camera.GetFOV(cameraId);
		} else if (this._dictionary.encodedProjectionType[this._dvl.Camera.GetProjection(cameraId)] === "orthographic") {
			//If the projection is "orthographic", we get the Zoom Factor.
			viewInfo.camera.zoomFactor = this._dvl.Camera.GetOrthoZoomFactor(cameraId);
		}

		//calculate step and procedure indexes and animation time
		var stepInfo = this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId, sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_STEP_INFO);
		if (stepInfo.stepId !== sap.ve.dvl.DVLID_INVALID) {
			var stepId = stepInfo.StepId,
				animationTime = stepInfo.StepTime,
				procedures = this._dvl.Scene.RetrieveProcedures(this._dvlSceneId),
				stepAndProcedureIndexes = this._getStepAndProcedureIndexes(procedures.procedures, stepId);

			viewInfo.animation = {
				animationTime: animationTime,
				stepIndex: stepAndProcedureIndexes.stepIndex,
				procedureIndex: stepAndProcedureIndexes.procedureIndex
			};
		}

		return viewInfo;
	};

	/**
	 * Sets the current scene to use the camera view information acquired from the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * Internally, the <code>setViewInfo</code> method activates certain steps at certain animation times,
	 * and then changes the camera position, rotation and field of view (FOV) / zoom factor.
	 * @param {object} viewInfo A JSON-like object containing view information acquired using the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * The structure of the <code>viewInfo</code> object is outlined as follows:<br/>
	 * <ul>
	<li>
		animation
		<ul>
		<li>animationTime</li>
		<li>stepIndex</li>
		<li>procedureIndex</li>
		</ul>
	</li>
	<li>
		camera
		<ul>
		<li>rotation
			<ul>
			<li>yaw</li>
			<li>pitch</li>
			<li>roll</li>
			</ul>
		</li>
		<li>position
			<ul>
			<li>x</li>
			<li>y</li>
			<li>z</li>
			</ul>
		</li>
		<li>
			projection
		</li>
		<li>
			bindingType
		</li>
		<li>
			fieldOfView/zoomFactor
		</li>
		</ul>
	</li>
	</ul>
	 * @public
	 */
	Viewport.prototype.setViewInfo = function (viewInfo) {
		if (viewInfo.animation) {
			var procedures = this._dvl.Scene.RetrieveProcedures(this._dvlSceneId);
			if (procedures.procedures.length > 0 && viewInfo.animation.stepIndex !== -1 && viewInfo.animation.procedureIndex !== -1) {
				//if the saved view info has steps and procedures, we use them for activating the indicated step
				if (viewInfo.animation.procedureIndex >= 0 && viewInfo.animation.procedureIndex < procedures.procedures.length) {
					if (viewInfo.animation.stepIndex >= 0 && viewInfo.animation.stepIndex < procedures.procedures[viewInfo.animation.procedureIndex].steps.length) {
						var animationTime = viewInfo.animation.animationTime || 0,
						stepId = procedures.procedures[viewInfo.animation.procedureIndex].steps[viewInfo.animation.stepIndex].id;
						this._dvl.Scene.ActivateStep(this._dvlSceneId, stepId, false, false, animationTime);
						this._dvl.Scene.PauseCurrentStep(this._dvlSceneId);
					} else {
						//Unsupported value for step index
						jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT26.summary), this._messages.messages.VIT26.code, "sap.ui.vk.Viewport");
					}
				} else {
					//Unsupported value for procedure index
					jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT27.summary), this._messages.messages.VIT27.code, "sap.ui.vk.Viewport");
				}
			} else {
				//if the saved info doesn't have steps, we reset the view
				this.resetView();
			}
		}
		var projectionType = this._dictionary.decodedProjectionType[viewInfo.camera.projectionType],
			//creating a new camera
			currentCamera = this._dvl.Scene.CreateCamera(this._dvlSceneId, projectionType, sap.ve.dvl.DVLID_INVALID);

		//positioning the camera in space
		this._dvl.Camera.SetOrigin(currentCamera, viewInfo.camera.position.x, viewInfo.camera.position.y, viewInfo.camera.position.z);

		var bindingType = this._dictionary.decodedBindingType[viewInfo.camera.bindingType];
		this._dvl.Camera.SetFOVBinding(currentCamera, bindingType);

		//setting the field of view / zoom factor
		switch (projectionType) {
			case this._dictionary.decodedProjectionType.perspective:
				this._dvl.Camera.SetFOV(currentCamera, viewInfo.camera.fieldOfView);
				break;
			case this._dictionary.decodedProjectionType.orthographic:
				this._dvl.Camera.SetOrthoZoomFactor(currentCamera, viewInfo.camera.zoomFactor);
				break;
			default:
			jQuery.sap.log.error(sap.ui.vk.getResourceBundle().getText(this._messages.messages.VIT19.summary), this._messages.messages.VIT19.code, "sap.ui.vk.Viewport");
		}

		//setting the camera rotation
		this._dvl.Camera.SetRotation(currentCamera, viewInfo.camera.rotation.yaw, viewInfo.camera.rotation.pitch, viewInfo.camera.rotation.roll);
		//activating the camera
		this._dvl.Scene.ActivateCamera(this._dvlSceneId, currentCamera);
		//removing the camera that we created from the memory
		this._dvl.Scene.DeleteNode(this._dvlSceneId, currentCamera);
	};

	Viewport.prototype.onBeforeRendering = function () {
		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}
	};

	Viewport.prototype.onAfterRendering = function () {
		if (this._canvas) {
			var domRef = this.getDomRef();
			domRef.appendChild(this._canvas);
			this._resizeListenerId = ResizeHandler.register(this, this._handleResize.bind(this));
			this._handleResize({
				size: {
					width: domRef.clientWidth,
					height: domRef.clientHeight
				}
			});
		}
	};

	/**
	 * Handles the resize events from the {@link sap.ui.core.ResizeHandler ResizeHandler} object.
	 * @param {jQuery.Event} event The event object.
	 * @returns {boolean} Returns <code>true</code>, unless the <code>if</code> statement inside the method is false which causes the method to return <code>undefined</code>.
	 * @private
	 */
	Viewport.prototype._handleResize = function (event) {
		if (this._dvlRendererId && this._canvas) {
			var devicePixelRatio = window.devicePixelRatio || 1;
			var drawingBufferWidth = event.size.width * devicePixelRatio;
			var drawingBufferHeight = event.size.height * devicePixelRatio;

			this._dvl.Renderer.SetDimensions(drawingBufferWidth, drawingBufferHeight);
			this._dvl.Renderer.SetOptionF(sap.ve.dvl.DVLRENDEROPTIONF.DVLRENDEROPTIONF_DPI, 96 * devicePixelRatio);
			this._canvas.width = drawingBufferWidth;
			this._canvas.height = drawingBufferHeight;
			this._canvas.style.width = event.size.width + "px";
			this._canvas.style.height = event.size.height + "px";

			return true;
		}
	};

	/**
	 * @param {object} viewStateManager Takes a viewStateManager object as parameter.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.setViewStateManager = function (viewStateManager) {
		this._viewStateManager = viewStateManager;
		return this;
	};

	////////////////////////////////////////////////////////////////////////
	// 3D Rendering handling begins.

	/**
	 * @returns {bool} It returns <code>true</code> or <code>false</code> whether the frame should be rendered or not.
	 * @experimental
	 */
	Viewport.prototype.shouldRenderFrame = function () {
		return this._dvlRendererId && this._dvl.Renderer.ShouldRenderFrame();
	};

	/**
	 * @returns {sap.ui.vk.Viewport} this
	 * @experimental
	 */
	Viewport.prototype.renderFrame = function () {
		if (this._dvlRendererId) {
			this._dvl.Renderer.RenderFrame(this._dvlRendererId);
		}
		return this;
	};

	/**
	 * @param {array} viewMatrix The <code>viewMatrix</code> array.
	 * @param {array} projectionMatrix The projectionMatrix array.
	 * @returns {sap.ui.vk.Viewport} this
	 * @experimental
	 */
	Viewport.prototype.renderFrameEx = function (viewMatrix, projectionMatrix) {
		if (this._dvlRendererId) {
			this._dvl.Renderer.RenderFrameEx.apply(this, [].concat(viewMatrix, projectionMatrix), this._dvlRendererId);
		}
		return this;
	};

	/**
	 * @returns {sap.ui.vk.Viewport} this
	 * @experimental
	 */
	Viewport.prototype.resetView = function () {
		if (this._dvlRendererId) {
			this._dvl.Renderer.ResetView(this._dvlRendererId);
		}
		return this;
	};

	/**
	 * @param {string} nodeId The ID of the node to check.
	 * @returns {sap.ui.vk.Viewport} this
	 * @experimental
	 */
	Viewport.prototype.canIsolateNode = function (nodeId) {
		if (this._dvlRendererId) {
			return this._dvl.Renderer.CanIsolateNode(nodeId, this._dvlRendererId);
		} else {
			return false;
		}
	};

	/**
	 * @param {string} nodeId The nodeId that we want to set as isolated.
	 * @returns {sap.ui.vk.Viewport} this
	 * @experimental
	 */
	Viewport.prototype.setIsolatedNode = function (nodeId) {
		if (this._dvlRendererId) {
			this._dvl.Renderer.SetIsolatedNode(nodeId, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * @returns {string} nodeId The ID of the node that is currently set as isolated.
	 * @experimental
	 */
	Viewport.prototype.getIsolatedNode = function () {
		if (this._dvlRendererId) {
			return this._dvl.Renderer.GetIsolatedNode(this._dvlRendererId);
		} else {
			return "i0000000000000000";
		}
	};

	Viewport.prototype.setShowDebugInfo = function(value) {
		this.setProperty("showDebugInfo", value, true);
		if (this._dvlRendererId) {
			this._dvl.Renderer.SetOption(sap.ve.dvl.DVLRENDEROPTION.DVLRENDEROPTION_SHOW_DEBUG_INFO, value, this._dvlRendererId);
		}
		return this;
	};

	// 3D Rendering handling ends.
	////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////
	// Gesture handling ends.

	/**
	 * Marks the start of the current gesture operation.
	 *
	 * @param {int} x The x-coordinate of the gesture.
	 * @param {int} y The y-coordinate of the gesture.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.beginGesture = function (x, y) {
		if (this._dvlRendererId) {
			var pixelRatio = window.devicePixelRatio || 1;
			this._dvl.Renderer.BeginGesture(x * pixelRatio, y * pixelRatio, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Marks the end of the current gesture operation.
	 *
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.endGesture = function () {
		if (this._dvlRendererId) {
			this._dvl.Renderer.EndGesture(this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Performs a <code>pan</code> gesture to pan across the Viewport.
	 *
	 * @param {int} dx The change in distance along the x-coordinate.
	 * @param {int} dy The change in distance along the y-coordinate.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.pan = function (dx, dy) {
		if (this._dvlRendererId) {
			var pixelRatio = window.devicePixelRatio || 1;
			this._dvl.Renderer.Pan(dx * pixelRatio, dy * pixelRatio, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Rotates the content resource displayed on the Viewport.
	 *
	 * @param {int} dx The change in x-coordinate used to define the desired rotation.
	 * @param {int} dy The change in y-coordinate used to define the desired rotation.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.rotate = function (dx, dy) {
		if (this._dvlRendererId) {
			var pixelRatio = window.devicePixelRatio || 1;
			this._dvl.Renderer.Rotate(dx * pixelRatio, dy * pixelRatio, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Performs a <code>zoom</code> gesture to zoom in or out on the beginGesture coordinate.
	 * @param {double} dy Zoom factor. A scale factor that specifies how much to zoom in or out by.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.zoom = function (dy) {
		if (this._dvlRendererId) {
			this._dvl.Renderer.Zoom(dy, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Executes a click or tap gesture.
	 *
	 * @param {int} x The tap gesture's x-coordinate.
	 * @param {int} y The tap gesture's y-coordinate.
	 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.tap = function (x, y, isDoubleClick) {
		if (this._dvlRendererId) {
			var pixelRatio = window.devicePixelRatio || 1;
			this._dvl.Renderer.Tap(x * pixelRatio, y * pixelRatio, isDoubleClick, this._dvlRendererId);
		}
		return this;
	};

	/**
	 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.queueCommand = function (command) {
		if (this._dvlRendererId) {
			this._dvl.Renderer._queueCommand(command, this._dvlRendererId);
		}
		return this;
	};

	// Gesture handling ends.
	////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////
	// Keyboard handling begins.

	var offscreenPosition = { x: -2, y: -2 };
	var rotateDelta = 2;
	var panDelta = 5;

	[
		{ key: "left",  dx: -rotateDelta, dy:            0 },
		{ key: "right", dx: +rotateDelta, dy:            0 },
		{ key: "up",    dx:            0, dy: -rotateDelta },
		{ key: "down",  dx:            0, dy: +rotateDelta }
	].forEach(function(item) {
		Viewport.prototype["onsap" + item.key] = function(event) {
			this.beginGesture(offscreenPosition.x, offscreenPosition.y);
			this.rotate(item.dx, item.dy);
			this.endGesture();
			this.renderFrame();
			event.preventDefault();
			event.stopPropagation();
		};
	});

	[
		{ key: "left",  dx: -panDelta, dy:         0 },
		{ key: "right", dx: +panDelta, dy:         0 },
		{ key: "up",    dx:         0, dy: -panDelta },
		{ key: "down",  dx:         0, dy: +panDelta }
	].forEach(function(item) {
		Viewport.prototype["onsap" + item.key + "modifiers"] = function(event) {
			if (event.shiftKey && !(event.ctrlKey || event.altKey || event.metaKey)) {
				this.beginGesture(offscreenPosition.x, offscreenPosition.y);
				this.pan(item.dx, item.dy);
				this.endGesture();
				this.renderFrame();
				event.preventDefault();
				event.stopPropagation();
			}
		};
	});

	[
		{ key: "minus", d: 0.98 },
		{ key: "plus",  d: 1.02 }
	].forEach(function(item) {
		Viewport.prototype["onsap" + item.key] = function(event) {
			this.beginGesture(this.$().width() / 2, this.$().height() / 2);
			this.zoom(item.d);
			this.endGesture();
			this.renderFrame();
			event.preventDefault();
			event.stopPropagation();
		};
	});

	// Keyboard handling ends.
	////////////////////////////////////////////////////////////////////////

	return Viewport;
});
