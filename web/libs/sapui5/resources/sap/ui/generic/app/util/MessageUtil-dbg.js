sap.ui.define(["sap/ui/core/ValueState", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast", "sap/m/MessageBox"],
	function(ValueState, Filter, FilterOperator, MessageToast, MessageBox) {
		"use strict";
		
		 var httpStatusCodes = {
				badRequest: "400",
				forbidden: "403",
				methodNotAllowed: "405",
				preconditionFailed: "428",
				internalServerError: "500"
			};
		 
			var operations = {
					callAction: "callAction",
					addEntry: "addEntry",
					saveEntity: "saveEntity",
					deleteEntity: "deleteEntity",
					editEntity: "editEntity",
					modifyEntity: "modifyEntity",
					activateDraftEntity: "activateDraftEntity",
					saveAndPrepareDraftEntity: "saveAndPrepareDraftEntity"
				};
			
			function fnShowMessageBox(mParameters, sContentDensityClass) {
				MessageBox.show(mParameters.message, {
					icon: mParameters.messageBoxIcon || MessageBox.Icon.ERROR,
					title: mParameters.title || sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.template").getText("ERROR_TITLE"),
					actions: [
						MessageBox.Action.OK
					],
					styleClass: sContentDensityClass
				});
			}

			function fnShowMessagePage(mParameters, oNavigationController) {
				oNavigationController.navigateToMessagePage({
					entitySet: mParameters.entitySet,
					title: mParameters.title,
					text: mParameters.message
				});
			}

			/**
			 * With this function all transient messages are taken out of the MessageManager and 
			 * displayed. After displaying them, the transient messages are removed automatically.
			 * 
			 * To show the messages a custom ui fragment can be provided via a callback function <code>fnGetDialogFragment</code>.
			 * 
			 * @param fnGetDialogFragment Callback function to return a Message Dialog Fragment
			 * 
			 * @since 1.38
			 * 
			 * @experimental
			 * @public
			 */
			// TODO think about making fnGetDialogFragment optional -> what about View/Controller info?
			// TODO describe how the callback function must be structured and how the constrains look like.
			function handleTransientMessages(fnGetDialogFragment) {
				
				var oDialogFragmentController = {
						onMessageDialogClose: function() {
							oDialog.close();
							removeTransientMessages();
						}
				};

				var oDialog = fnGetDialogFragment("sap.ui.generic.app.fragments.MessageDialog", oDialogFragmentController);

				var oMessageTable = oDialog.getContent()[0];

				var oBinding = oMessageTable.getBinding("items");
				oBinding.filter(new Filter("target", FilterOperator.StartsWith, "/#"));
				var aContexts = oBinding.getContexts();

				if (aContexts.length === 1 && aContexts[0].getObject().type === ValueState.Success) {
					// show Message in dialog only
					MessageToast.show(aContexts[0].getObject().message, {
						onClose: removeTransientMessages
					});
				} else if (aContexts.length > 0) {
					oDialog.open();
				}
			}

			/**
			 * Remove all transient messages that are currently available in the MessageManager.
			 * 
			 * @since 1.38
			 * 
			 * @experimental
			 * @public
			 */
			function removeTransientMessages() {
				var oMessage;
				var aRemoveMessages = [];
				var oMessageManager = sap.ui.getCore().getMessageManager();
				var aMessages = oMessageManager.getMessageModel().getObject("/");

				for (var i = 0; i < aMessages.length; i++) {
					oMessage = aMessages[i];
					if (oMessage.target.startsWith("/#")) {
						aRemoveMessages.push(oMessage);
					}
				}

				if (aRemoveMessages.length > 0) {
					oMessageManager.removeMessages(aRemoveMessages);
				}
			}

			/**
			 * 
			 * 
			 * @since 1.38
			 * 
			 * @experimental
			 * @public
			 */
			function handleError(mParameters, oController, sContentDensityClass, oNavigationController) {
				mParameters = mParameters || {};
				var oErrorContext = mParameters.errorContext || {};
				var oError = mParameters.response;

				var sMessage = sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.template").getText("ERROR_UNKNOWN");
				var sHttpStatusCode;

				if (oError instanceof Error) {
					// promise rejection
					if (oError.message) {
						// TODO differentiate between technical errors and business errors in case of promise rejections
						sMessage = oError.message;
					}
				} else if (oError.response) { // odata error
					if (oError.response.message) {
						// TODO differentiate between technical errors and business errors in case of promise rejections
						sMessage = oError.response.message;
					}

					// check http status code
					if (oError.response.statusCode) {
						sHttpStatusCode = oError.response.statusCode;
					}

					// check for content type of response - in case of a runtime error on the backend it is xml
					if (oError.response.headers) {
						for (var sHeader in oError.response.headers) {
							if (sHeader.toLowerCase() === "content-type") {
								var sHeaderValue = oError.response.headers[sHeader];
								if (sHeaderValue.toLowerCase().indexOf("application/json") === 0) {
									if (oError.response.responseText) {
										var oODataError = JSON.parse(oError.response.responseText);
										if (oODataError && oODataError.error && oODataError.error.message && oODataError.error.message.value) {
											sMessage = oODataError.error.message.value;
										}
									}
								} else {
									if (oError.message) {
										sMessage = oError.message;
									}
								}
								break;
							} // if content-type is not application/json it is usually an internal server error (status code 500)
						}
					}
				}

				var bShowMessageBox = true;

				// var isList = mParameters.isList || true;
				// error situations:
				// Draft SourceOperation=action
				// action & list & single select & editable=false -> MessageBox
				// action & detail & editable=false -> MessageBox
				// action & detail & editable=true -> MessageBox

				// Non-draft SourceOperation=action
				// action & list & single select & editable=false -> MessageBox
				// action & detail & editable=false -> MessageBox
				// action & detail & editable=true -> MessageBox
				// save/merge & action & detail & editable=true -> ?

				// Non-draft SourceOperation=create/update/patch
				// post/put/patch/merge & detail & editable=true -> evaluate status code
				// -> 400 Bad Request -> Message Box + MessagePopover
				// -> 403 Forbidden -> Message Page
				// -> 405 Method Not Allowed -> Message Page
				// -> 428 Precondition Failed -> Message Page
				// -> 500 Internal Server Error -> Message Page

				// Draft SourceOperation=create/update/patch
				// post on new root -> MessagePage
				// post on new item -> ?MessagePage
				// post/put/patch/merge/prepare & detail & editable=true -> evaluate status code
				// -> 400 Bad Request -> MessagePage
				// -> 403 Forbidden -> Message Page
				// -> 405 Method Not Allowed -> Message Page
				// -> 428 Precondition Failed -> Message Page
				// -> 500 Internal Server Error -> Message Page
				switch (oErrorContext.lastOperation.name) {
					case "":
						break;
					case operations.callAction:
						break;
					case operations.addEntry:
						bShowMessageBox = false;
						break;
					case operations.modifyEntity:
						if (httpStatusCodes.preconditionFailed === sHttpStatusCode) {
							// navigate to message page if etag is invalid
							bShowMessageBox = false;
						}
						break;
					case operations.saveEntity:
						// save operation should always be successful in draft case - therefore navigate to message page
						bShowMessageBox = !oErrorContext.isDraft;
						// save operation (PUT/PATCH/MERGE) in non-draft scenarios fail due to business errors - therefore stay on details page
						break;
					case operations.deleteEntity:
						// does it make a difference if it is the root or items of a root? what happens to list in details etc.?
						break;
					case operations.editEntity:
						// edit function import or just edit mode in non-draft scenarios - stay on details screen
						break;
					case operations.activateDraftEntity:
						// business errors are transported via activation in case of minimal draft enabled
						break;
					default:
						break;
				}

				var mMessageParameters = {
					entitySet: oErrorContext.entitySet,
					title: mParameters.title,
					message: sMessage
				};

				if (bShowMessageBox) {
					if (oErrorContext.showMessages) {
						// only show message box if current view doesn't have a message popover
						fnShowMessageBox(mMessageParameters, sContentDensityClass);
					}
				} else {
					fnShowMessagePage(mMessageParameters, oNavigationController);
				}

			}

		
		return {
			operations: operations,
			handleTransientMessages: handleTransientMessages,
			removeTransientMessages: removeTransientMessages,
			handleError: handleError
		};
	}, true);