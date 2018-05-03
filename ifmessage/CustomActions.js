sap.ui.define([], function () {
	"use strict";

	return {
		init: function (oBundle) {
			this._oResourceBundle = oBundle;
			this.Action = {
				LEAVE_PAGE: this._oResourceBundle.getText("ACTION_LEAVE_PAGE"),
				REJECT: this._oResourceBundle.getText("ACTION_REJECT"),
				PROCEED: this._oResourceBundle.getText("ACTION_PROCEED"),
				SAVE_AS_DRAFT: this._oResourceBundle.getText("ACTION_SAVE_AS_DRAFT"),
				SUBMIT: this._oResourceBundle.getText("ACTION_SUBMIT"),
				COMPLETE: this._oResourceBundle.getText("ACTION_COMPLETE"),
				CLAIM: this._oResourceBundle.getText("ACTION_CLAIM"),
				FORWARD: this._oResourceBundle.getText("ACTION_FORWARD")
			};
		},

		Action: { //If nothing works
			LEAVE_PAGE: "Leave Page",
			REJECT: "Deactivate",
			PROCEED: "Proceed",
			SAVE_AS_DRAFT: "Save",
			SUBMIT: "Submit",
			COMPLETE: "Complete",
			CLAIM: "Claim",
			FORWARD: "Forward"
		}
	};
});
