/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
jQuery.sap.declare("sap.ushell.ui.footerbar.LogoutButton");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.ushell.ui.launchpad.ActionItem");sap.ushell.ui.launchpad.ActionItem.extend("sap.ushell.ui.footerbar.LogoutButton",{metadata:{library:"sap.ushell"}});(function(){"use strict";jQuery.sap.declare("sap.ushell.ui.footerbar.LogoutButton");jQuery.sap.require("sap.ushell.resources");sap.ushell.ui.footerbar.LogoutButton.prototype.init=function(){if(sap.ushell.ui.launchpad.ActionItem.prototype.init){sap.ushell.ui.launchpad.ActionItem.prototype.init.apply(this,arguments);}this.setIcon('sap-icon://log');this.setText(sap.ushell.resources.i18n.getText("logoutBtn_title"));this.attachPress(this.logout);this.setEnabled();};sap.ushell.ui.footerbar.LogoutButton.prototype.logout=function(){jQuery.sap.require('sap.m.MessageBox');var s=true,i=false,l=new sap.ushell.ui.launchpad.LoadingDialog({text:""});sap.ushell.Container.getGlobalDirty().done(function(d){s=false;if(i===true){l.exit();l=new sap.ushell.ui.launchpad.LoadingDialog({text:""});}var _=function(d){var L={},r=sap.ushell.resources.i18n;if(d===sap.ushell.Container.DirtyState.DIRTY){L.message=r.getText('unsaved_data_warning_popup_message');L.icon=sap.m.MessageBox.Icon.WARNING;L.messageTitle=r.getText("unsaved_data_warning_popup_title");}else{L.message=r.getText('logoutConfirmationMsg');L.icon=sap.m.MessageBox.Icon.QUESTION;L.messageTitle=r.getText("logoutMsgTitle");}return L;};var L=_(d);sap.m.MessageBox.show(L.message,L.icon,L.messageTitle,[sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],function(a){if(a===sap.m.MessageBox.Action.OK){l.openLoadingScreen();l.showAppInfo(sap.ushell.resources.i18n.getText('beforeLogoutMsg'),null);sap.ushell.Container.logout();}},sap.ui.core.ElementMetadata.uid("confirm"));});if(s===true){l.openLoadingScreen();i=true;}};sap.ushell.ui.footerbar.LogoutButton.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){jQuery.sap.log.warning("Disabling 'Logout' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.LogoutButton");}e=false;}sap.ushell.ui.launchpad.ActionItem.prototype.setEnabled.call(this,e);};}());