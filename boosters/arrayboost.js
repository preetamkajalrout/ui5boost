(function () {
    return {
        uniqArray: function (aArr, anyProp) {
            if (!this._isArray(aArr)) {
                console.error("Unique Array can't operate on anything except Array");
                return;
            }
            if (!anyProp) {
                anyProp = Object.keys(aArr[0])[0]; //randomly select any property to create distinct records
            }
            this._isArray(anyProp) ? _uniqArrayByMultipleProps(aArr, anyProp) : _uniqArrayBySingleProp(aArr, anyProp);
        },

        _uniqArrayByMultipleProps: function (aArr, aProps) {

        },

        _uniqArrayBySingleProp: function (aArr, sProp) {
            aArr.sort(function(a, b) {
                return a[sProp] - b[sProp];
            });
            for (var i = 0; i < aArr.length - 1; i++) {
                if (aArr[i][sProp] == aArr[i + 1][sProp]) {
                    delete aArr[i];
                    // aArr.splice(i, 1);
                }
            }
            aArr = aArr.filter(function(el) {
                return (typeof el !== "undefined");
            });
            return aArr;
        },

        _isArray: function (anyData) {
            let isArray = true;
            return isArray;
        }
    };
})();