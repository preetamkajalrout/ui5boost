sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"com/pkr/gh/ui5/ifmessage/CustomActions"
], function (MessageBox, MessageToast, CustomActions) {
	"use strict";

	return {
		_isErrorOpen: false, //Tracks if the error dialog is open or not

		init: function (oComponent) {
			this._oComponent = oComponent;
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			CustomActions.init(this._oResourceBundle);
		},

		error: function (sText) {
			MessageBox.show(sText, {
				icon: MessageBox.Icon.ERROR,
				title: this._oResourceBundle.getText("ERROR_TITLE"),
				actions: [MessageBox.Action.OK],
				onClose: function () {
					this.setErrorOpen(false);
				}.bind(this)
			});
		},

		warning: function (sText) {
			MessageBox.show(sText, {
				icon: MessageBox.Icon.WARNING,
				title: this._oResourceBundle.getText("WARNING_TITLE"),
				actions: [MessageBox.Action.OK]
			});
		},

		info: function (sText, fnCallback) {
			var oMsgSettings = {
				icon: MessageBox.Icon.INFORMATION,
				title: this._oResourceBundle.getText("INFO_TITLE"),
				actions: [MessageBox.Action.OK]
			};
			if (fnCallback && jQuery.isFunction(fnCallback)) {
				oMsgSettings.onClose = function (oAction) {
					if (oAction === "OK") {
						fnCallback();
					}
				};
			}
			MessageBox.show(sText, oMsgSettings);
		},

		confirm: function (sTitle, sText, sCustomAction, fnCallback, fnCancelCb) {
			var sConfirmAction;
			if (sCustomAction) {
				sConfirmAction = sCustomAction;
			} else {
				sConfirmAction = CustomActions.Action.PROCEED;
			}
			MessageBox.show(sText, {
				icon: MessageBox.Icon.QUESTION,
				title: sTitle,
				actions: [sConfirmAction, MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === sConfirmAction) {
						fnCallback();
					} else if (oAction === MessageBox.Action.CANCEL) {
						if (fnCancelCb) {
							fnCancelCb();
						}
					}
				}
			});
		},

		success: function (sText, fnCallback) {
			MessageBox.show(sText, {
				icon: MessageBox.Icon.SUCCESS,
				title: this._oResourceBundle.getText("SUCCESS_TITLE"),
				actions: [MessageBox.Action.OK],
				onClose: fnCallback
			});
		},

		toast: function (sText, bPersistOnNav) {
			MessageToast.show(sText, {
				closeOnBrowserNavigation: bPersistOnNav
			});
		},

		dirty: function (fnCallback) {
			MessageBox.show(this._oResourceBundle.getText("DIRTY_VIEW_WARNING"), {
				icon: MessageBox.Icon.WARNING,
				title: this._oResourceBundle.getText("WARNING_TITLE"),
				actions: [CustomActions.Action.LEAVE_PAGE, MessageBox.Action.CANCEL],
				onClose: function (oAction) {
					if (oAction === CustomActions.Action.LEAVE_PAGE) {
						fnCallback();
					}
				}
			});
		},

		isErrorOpen: function () {
			return this._isErrorOpen;
		},

		setErrorOpen: function (bOpen) {
			this._isErrorOpen = bOpen;
		}

	};

});
