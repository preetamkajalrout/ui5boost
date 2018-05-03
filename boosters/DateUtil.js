sap.ui.define([], function() {
	"use strict";

	return {

		mMap: {
			0: "Jan",
			1: "Feb",
			2: "Mar",
			3: "Apr",
			4: "May",
			5: "Jun",
			6: "Jul",
			7: "Aug",
			8: "Sep",
			9: "Oct",
			10: "Nov",
			11: "Dec"
		},

		getMonthText: function (iMonth) {
			if (iMonth > 11) {
				iMonth = iMonth - 12;
			}
			return this.mMap[iMonth];
		},

		getYear: function (oDate, iNoOfMonthSteps) {
			var iYear = oDate.getFullYear(),
					iCurrentMonth,
					iDiff;
			if (parseInt(iNoOfMonthSteps, 10) || parseInt(iNoOfMonthSteps, 10) === 0) {
				iCurrentMonth = oDate.getMonth();
				iDiff = iCurrentMonth + iNoOfMonthSteps;
				if (iDiff > 11) { //If forward year
					iYear = iYear + 1;
				} else if (iDiff < 0) { //If backward year
					iYear = iYear - 1;
				}
			}
			return iYear;
		},

		getMonth: function (oDate, iNoOfMonthSteps) {
			var iCurrentMonth = oDate.getMonth(),
					iMonth,
					iDiff;
			if (parseInt(iNoOfMonthSteps, 10) || parseInt(iNoOfMonthSteps, 10) === 0) {
				iDiff = iCurrentMonth + iNoOfMonthSteps;
				if (iDiff > 11) { //If forward year
					iMonth = iDiff - 12;
				} else if (iDiff < 0) { //If backward year
					iMonth = 12 + iDiff;
				} else {
					iMonth = iDiff;
				}
			}
			return iMonth;
		}

	};
});
