/*
 * REST Model to support Java ejb based REST services
 * @author: Preetam Kajal Rout
 * @since: 2017
 * 
 * @author	preetamkajalrout
 */

/**
 * JSON-Based REST Model Binding
 * 
 * @namespace
 * @name com.pkr.gh.ui5.resources.model.rs
 * @public
 */
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel'
], function (jQuery, JSONModel) {
	"use strict";

	/**
	 * JSONModel OpenUI5 link
	 * @external JSONModel
	 * @see https://openui5.hana.ondemand.com/docs/api/symbols/sap.ui.model.json.JSONModel.html
	 */
	
	/**
	 * Constructor for a new RESTModel
	 * 
	 * @class
	 * Model implementation for REST Services. 
	 * <br />
	 * Provides JQuery deferred based API for ajax calls for back-end services
	 * 
	 * 
	 * @todo 
	 * <ol>
	 * 	<li>update,remove still needs to be converted to http method PUT/MERGE, DELETE respectively</li>
	 * 	<li>ES6 promise support to be aded in future releases</li>
	 * 	<li>Promise should always be returned irrespective of requested or not</li>
	 * </ol>
	 * 
	 * @extends external:JSONModel
	 * 
	 * 
	 * @author Preetam Kajal Rout <preetamkajalrout@gmail.com>
	 * 
	 * @param {string} sRestUrl root URL for REST service, this will be appended to all the REST methods going forward
	 * @param {object} [oMetaData] schema object for all entityset that will be exposed with help of REST URL.
	 *                             Optional. Currently, no checks or implementation has been done to provide binding
	 *                             with views like ODataModel
	 * 
	 * @constructor
	 * @public
	 * @alias com.pkr.gh.ui5.resources.model.rs.RESTModel
	 */
	var RESTModel = JSONModel.extend("com.pkr.gh.ui5.resources.model.rs.RESTModel",  /** @lends com.pkr.gh.ui5.resources.model.rs.RESTModel.prototype */ {

		constructor: function (sRestUrl, oMetaData) {
			JSONModel.apply(this, oMetaData);

			if (oMetaData && typeof oMetaData == "object") {
				this.setData(oMetaData);
			}

			if (sRestUrl) {
				this.sRestUrl = sRestUrl;
			}
			this.refreshAfterNavigate = false;
		},

		metadata: {
			publicMethods: ["create", "read", "update", "remove", "query", "runAction", "setRefreshAfterNavigate", "getRefreshAfterNavigate"]
		}
	});

	/**
	 * Performs a HTTP POST Ajax request to provided REST method
	 * 
	 * @param {string} sPath A string containing path to REST method where entry/data to be added
	 * @param {object} oData data for the entry that should be created.
	 * @param {map} [mParameters] map containing any of the following properties:
	 * @param {boolean} [mParameters.absoluteUrl=false] tells if provided path should is absolute (true) or relative (false)
	 *                                                  NOTE: Should not avoided as it contradicts 1:1 service-ui relationship design guidelines
	 * @param {function} [mParameters.success] called when the data has been successfully created.<br />
	 *                                         The handler can have following parameters: oData, status, response
	 * @param {function} [mParameters.error] called when the request failed.<br />
	 *                                       The handler can have the following parameters: oError, status and errorThrown
	 * @param {function} [mParameters.async=false] Whether the request should be done asynchronously.
	 * @param {string} [mParameters.groupId] If provided, the call will be defferred and will be sent on {submitGroup}
	 * 
	 * @public
	 * 
	 * @returns {Promise} jqXHR Object
	 */
	RESTModel.prototype.create = function (sPath, oData, mParameters) {
		if (oData && typeof (oData) == "object") {
			mParameters.method = "POST";
			mParameters.data = oData;
			mParameters.async = mParameters.async !== true; //Defaults to false
			mParameters.url = sPath;
		} else {
			jQuery.sap.log.fatal("Create method of RESTModel expects object");
		}
		return this._request(mParameters); //Retuns the jQuery deferred promise for chaining support
	};

	/**
	 * Performs a HTTP GET Ajax request for specific method to the REST service<br />
	 * The data will not be stored in the model. The requested data is returned with the response.
	 * <br />
	 * TODO: Should decide HTTP method intelligently based on data provided
	 * <br />
	 * NOTE: If you are using {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#query|query} for POST request. Add a note in development for change in future releases
	 * 
	 * @param {string} sPath A string containing the path to the data which should
	 *                       be retrieved. The path is concatenated to sRestUrl
	 *                       which was specified in the model constructor.
	 * @param {map} [mParameters] Optional parameter map containing any of the following parameters:
	 * @param {array} [mParameters.urlParameters] An array that will be concatenated as path to provided data path
	 *                                                  in call same order as index
	 * @param {boolean} [mParameters.absoluteUrl=false] tells if provided path should is absolute (true) or relative (false)
	 * @param {function} [mParameters.success] a callback function which is called when the data has been successfully retrieved.
	 *                                         The handler can have the following parameters: oData, status, response.
	 * @param {function} [mParameters.error] a callback function which is called when the request has failed.
	 *                                      The handler can have the following parameters: oError, status, errorThrown
	 * 
	 * @return {Promise} jQuery XMLHttpRequest object
	 * 
	 * @public
	 */
	RESTModel.prototype.read = function (sPath, mParameters) {
		if (mParameters.urlParameters && jQuery.isArray(mParameters.urlParameters)) {
			mParameters.data = mParameters.urlParameters;
		} else if (mParameters.urlParameters) {
			jQuery.sap.log.fatal("Expected array for READ parameters.");
		}
		mParameters.url = sPath;
		delete mParameters.urlParameters;

		return this._request(mParameters);
	};

	/**
	 * Performs a HTTP POST Ajax request to provided REST method
	 * <br />
	 * NOTE: If REST service doesn't use PUT/MERGE for update methods then instead of using {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#update|update} use {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#runAction|runAction}
	 * <br />
	 * TODO:
	 * <ol>
	 * 	<li>change HTTP method to "PUT/MERGE"</li>
	 * </ol>
	 * 
	 * @param {string} sPath A string containing path to REST method where entry/data to be updated
	 * @param {object} oData data for the entry that should be created.
	 * @param {map} [mParameters] Optional	parameter map containing any of the following properties:
	 * @param {boolean} [mParameters.absoluteUrl=false] tells if provided path should is absolute (true) or relative (false)
	 * @param {function} [mParameters.success] is called when the data has been successfully created.
	 *                                         The handler can have following parameters: oData, status, response
	 * @param {function} [mParameters.error] is called when the request failed.
	 *                                       The handler can have the following parameters: oError, status and errorThrown
	 * @param {function} [mParameters.async=false] Whether the request should be done asynchronously.
	 * 
	 * @public
	 * 
	 * @returns {Promise} jqXHR Deferred object
	 */
	RESTModel.prototype.update = function (sPath, oData, mParameters) {
		if (oData && typeof (oData) == "object") {
			mParameters.method = "POST";
			mParameters.data = oData;
			mParameters.async = mParameters.async !== true; //Defaults to false
			mParameters.url = sPath;
		} else {
			jQuery.sap.log.fatal("Update method of RESTModel expects object");
		}
		return this._request(mParameters, false);
	};

	/**
	 * Performs a HTTP DELETE Ajax request to provided REST method
	 * <br />
	 * NOTE: If REST service doesn't use DELETE for delete request then instead of using {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#remove|remove} use {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#runAction|runAction}
	 * <br />
	 * 
	 * @param {string}   sPath                 A string containing path to REST method where entry/data to be deleted
	 * @param {map}      mParameters         Optional	parameter map containing any of the following properties:
	 * @param {boolean}   [mParameters.absoluteUrl=false] tells if provided path should is absolute (true) or relative (false)
	 * @param {array} mParameters.urlParameters an array contains the list of key values to be sent as url parameters
	 * @param {function} [mParameters.success]	is called when the data has been successfully created.
	 * The handler can have following parameters: oData, status, response
	 * @param {function} [mParameters.error]	fuis called when the request failed.
	 * The handler can have the following parameters: oError, status and errorThrown
	 * @param {function} [mParameters.async=false] Whether the request should be done asynchronously.
	 *                                             
	 * @public
	 * 
	 * @returns {Promise} jqXHR deferred object
	 */
	RESTModel.prototype.remove = function (sPath, mParameters) {
		if (mParameters && typeof (mParameters) == "object" && mParameters.urlParameters) {
			mParameters.method = "DELETE";
			mParameters.data = mParameters.urlParameters;
			mParameters.async = mParameters.async !== true; //Defaults to false
			mParameters.url = sPath;
		} else {
			jQuery.sap.log.fatal("Remove method of RESTModel expects mParameters and urlParameters");
		}
		return this._request(mParameters);
	};

	/**
	 * Performs a HTTP POST Ajax request to provided REST method
	 * <br />
	 * NOTE: Always add a note to your code whenever using this method. This will be deprecated in future releases based on implementation of {@link com.pkr.gh.ui5.resources.model.rs.RESTModel#read|read} method
	 * @public
	 * 
	 * @param {string} sPath A string containing path to REST method where entry/data to be fetched
	 * @param {object} oData data for the entry that should be created.
	 * @param {map} [mParameters] Optional	parameter map containing any of the following properties:
	 * @param {boolean} [mParameters.absoluteUrl] tells if provided path should is absolute (true) or relative (false) default: false
	 * @param {function} [mParameters.success] is called when the data has been successfully created.
	 *                                         The handler can have following parameters: oData, status, response
	 * @param {function} [mParameters.error] is called when the request failed.
	 *                                       The handler can have the following parameters: oError, status and errorThrown
	 * @param {function} [mParameters.async=false] Whether the request should be done asynchronously.
	 *                                             
	 * @returns {Promise} jqXHR deferred object
	 */
	RESTModel.prototype.query = function (sPath, oData, mParameters) {
		if (oData && typeof (oData) == "object") {
			mParameters.method = "POST";
			mParameters.data = oData;
			mParameters.url = sPath;
		} else {
			jQuery.sap.log.fatal("Query method of RESTModel expects object parameters");
		}

		return this._request(mParameters);
	};

	/**
	 * Performs a HTTP Ajax request to provided REST method with provided method in paramters map
	 * <br />
	 * NOTE: Should be used for use-case that can't be covered in CRUDQ operation
	 *
	 * @param {string} sPath A string containing path to REST method where entry/data to be fetched
	 * @param {map} mParameters map containing any of the following properties:
	 * @param {string} mParameters.method HTTP method to use while making the request<br />
	 *                        NOTE: 'GET' will use 'urlParameters' in parameter list mentioned, Others will use 'input' in the paramter list
	 * @param {boolean} [mParameters.absoluteUrl] tells if provided path should is absolute (true) or relative (false) default: false
	 * @param {array} [mParameters.urlParameters] An array that will be concatenated as path to provided data path in call same order as index
	 * @param {object} [mParameters.input] data object that will sent as request body in case of method (POST, PUT/MERGE, DELTE)
	 * @param {function} [mParameters.success] is called when the data has been successfully created.
	 *                                         The handler can have following parameters: oData, status, response
	 * @param {function} [mParameters.error] is called when the request failed.
	 *                                       The handler can have the following parameters: oError, status and errorThrown
	 * @param {function} [mParameters.async=false] Whether the request should be done asynchronously.
	 *
	 * @public
	 *
	 * @returns {Promise} jqXHR deferred object
	 */
	RESTModel.prototype.runAction = function (sPath, mParameters) {
		mParameters.url = sPath;
		if (mParameters.method && mParameters.method === "POST") {
			if (mParameters.input) {
				mParameters.data = jQuery.extend(true, {}, mParameters.input);
				delete mParameters.input;
			} else {
				jQuery.sap.log.fatal("runAction method of RESTModel expects object parameters");
			}

			if (mParameters.urlParameters) { //Remove if POST call
				delete mParameters.urlParameters;
			}
		} else if (mParameters.urlParameters && jQuery.isArray(mParameters.urlParameters)) { //GET
			mParameters.data = mParameters.urlParameters;
			delete mParameters.urlParameters;
		}

		return this._request(mParameters);
	};

	/**
	 * Returns the 'refresh after navigate' state of the model
	 * 
	 * @returns {boolean} Refresh after navigate or not
	 *                    
	 * @public
	 */
	RESTModel.prototype.getRefreshAfterNavigate = function () {
		return this.refreshAfterNavigate;
	};

	/**
	 * Sets the 'refresh after navigate' state based on input provided
	 * 
	 * @param {boolean} [bRefresh] set value for refresh after navigate
	 *                           
	 * @public
	 */
	RESTModel.prototype.setRefreshAfterNavigate = function (bRefresh) {
		if (bRefresh) {
			this.refreshAfterNavigate = true;
		} else {
			this.refreshAfterNavigate = false;
		}
	};

	/**
	 * Internal method that creates the final request to be performed
	 * 
	 * @private
	 * @param {object} mParameters parameters passed along the calls made
	 * @returns {jqPromise} promise is returned if promise is requested
	 */
	RESTModel.prototype._request = function (mParameters) {
		var sUrl, fnSuccess, fnError, bAsync, bAbsoluteUrl,
			bHttpMethod, oSettings, oRequest,
			oRequestData;

		oSettings = {};
		bHttpMethod = mParameters.method ? mParameters.method : "GET"; //mParameters.method !== "POST" ? "GET" : "POST";
		bAsync = mParameters.async !== false; //Defaults to true
		bAbsoluteUrl = mParameters.absoluteUrl === true ? true : false; //Defaults to false
		sUrl = this._normalizePath(mParameters.url, bAbsoluteUrl, bHttpMethod !== "POST" ? mParameters.data : null);
		oRequestData = bHttpMethod === "POST" ? mParameters.data : null;
		fnSuccess = mParameters.success;
		fnError = mParameters.error;

		if (!fnSuccess || !jQuery.isFunction(fnSuccess)) {
			fnSuccess = function (oData, sStatus, oResponse) {
				jQuery.sap.log.info("REST Call Successfully completed " + oData);
			};
		}
		if (!fnError || !jQuery.isFunction(fnError)) {
			fnError = function (oError, sStatus, sError) {
				jQuery.sap.log.fatal("REST Call Failed " + oError);
			};
		}

		oSettings = {
			url: sUrl,
			contentType: "application/json; charset=UTF-8",
			method: bHttpMethod,
			async: bAsync
		};
		if (oRequestData) { //Set data if POST call
			oSettings.data = this._getJSON(mParameters.data);
		}
		if (!bAsync) { //If not async call then success and error handler to be used instead of jQuery.deferred based thenable
			oSettings.success = fnSuccess;
			oSettings.error = fnError;
		}
		oRequest = jQuery.ajax(oSettings); //Create Request
		if (bAsync) { //If async, attach handler with jQuery.deffered object
			oRequest.done(fnSuccess);
			oRequest.fail(fnError);
		}

		return oRequest;
	};

	RESTModel.prototype._getJSON = function (oData) {
		return JSON.stringify(oData);
	};

	RESTModel.prototype._normalizePath = function (sPath, bAbsoluteUrl, aGetParams) {
		if (!jQuery.sap.startsWith(sPath, "/")) {
			sPath = "/" + sPath;
		}

		return this._resolve(sPath, bAbsoluteUrl, aGetParams);
	};

	/**
	 * Resolves the provided path with base url of the rest service(relative)
	 * 
	 * @private
	 * @param   {string}  sPath        path to rest method
	 * @param   {boolean} bAbsoluteUrl absolute path or relative path
	 * @param   {Array}   aGetParams   list of url parameters to be added to url for GET parameters
	 * @returns {string}  resolved path
	 */
	RESTModel.prototype._resolve = function (sPath, bAbsoluteUrl, aGetParams) {
		var iGetParamsLen = 0,
			i;
		if (aGetParams && jQuery.isArray(aGetParams)) {
			iGetParamsLen = aGetParams.length;
			for (i = 0; i < iGetParamsLen; i++) {
				sPath = sPath + "/" + aGetParams[i];
			}
		}
		if (!bAbsoluteUrl) { //If provided path is relative then we can use the base rest url for the provided function
			sPath = this.sRestUrl + sPath;
		}

		return sPath;
	};

	return RESTModel;
}, /*bExport = */ true);
