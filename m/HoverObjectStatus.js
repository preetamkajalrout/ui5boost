/**
 * @external ObjectStatus
 * @see https://openui5.hana.ondemand.com/docs/api/symbols/sap.m.ObjectStatus.html
 */

/**
 * ObjectStatus extended to support hover event
 * @namespace
 * @name com.pkr.gh.ui5.resources.m
 * @public
 * @extends external:ObjectStatus
 */
sap.ui.define([
	"sap/m/ObjectStatus"
], function (ObjectStatus) {
	"use strict";
	return ObjectStatus.extend("com.pkr.gh.ui5.resources.m.HoverObjectStatus", {
		metadata: {
			events: {
				"hover": {}
			}
		},

		onmouseover: function (evt) {
			this.fireHover();
		},

		renderer: {}
	});
}, /*bExport=*/ true);
