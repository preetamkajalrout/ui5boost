/**
 * Button extended to support hover event
 * @namespace
 * @name com.pkr.gh.ui5.resources.m
 * @public
 */
sap.ui.define([
	"sap/m/Button"
], function (Button) {
	"use strict";
	/**
	 * @external Button
	 * @see https://openui5.hana.ondemand.com/docs/api/symbols/sap.m.Button.html
	 */

	/**
	 * Constructor for new HoverButton
	 *
	 * @class
	 * Adds hover event to {@link external:Button}. Other settings are same as sap.m.Button
	 *
	 * @extends external:Button
	 *
	 * @constructor
	 * @public
	 * @alias com.pkr.gh.ui5.resources.m.HoverButton
	 */
	return Button.extend("com.pkr.gh.ui5.resources.m.HoverButton", /** @lends com.pkr.gh.ui5.resources.m.HoverButton.prototype */ {
		metadata: {
			events: {
				"hover": {}
			}
		},

		onmouseover: function (evt) {
			this.fireHover();
		},

		renderer: {} // Uses the same rendered as sap.m.Button
	});
}, /*bExport=*/ true);
