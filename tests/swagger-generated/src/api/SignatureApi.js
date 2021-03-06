/**
 * Woleet backend kit API
 * The Woleet backend kit API, as exposed by Woleet backend kit's NodeJS server, allows:  - **your backend** (and only yours) to sign some data using its bitcoin identity (as generated during backend kit installation)  - **anyone** to verify that your backend effectively owns its claimed bitcoin address 
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.2.3
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Error', 'model/SignatureResult'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Error'), require('../model/SignatureResult'));
  } else {
    // Browser globals (root is window)
    if (!root.WoleetBackendKitApi) {
      root.WoleetBackendKitApi = {};
    }
    root.WoleetBackendKitApi.SignatureApi = factory(root.WoleetBackendKitApi.ApiClient, root.WoleetBackendKitApi.Error, root.WoleetBackendKitApi.SignatureResult);
  }
}(this, function(ApiClient, Error, SignatureResult) {
  'use strict';

  /**
   * Signature service.
   * @module api/SignatureApi
   * @version 1.0.0
   */

  /**
   * Constructs a new SignatureApi. 
   * @alias module:api/SignatureApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the signature operation.
     * @callback module:api/SignatureApi~signatureCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SignatureResult} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sign some data using the bitcoin identity of your backend.
     * Use this endpoint to sign some data using the bitcoin identity of your backend.   You first need to compute the SHA256 hash of your data (client side) and then provide it in the &#x60;hashToSign&#x60; parameter.   The signature produced is the signature of this hash using the bitcoin address provided in the &#x60;pubKey&#x60; parameter (or by the default bitcoin address of your backend if not set).   This endpoint is protected by an API token, provided to you at backend kit installation time. However, for security reason, **this endpoint SHOULD NEVER be exposed** outside your backend. To facilitate the isolation of this endpoint, a dedicated port can be specified at installation time. 
     * @param {String} hashToSign The SHA256 hash that is to be signed (a string formatted like [a-f0-9]{64}).
     * @param {Object} opts Optional parameters
     * @param {String} opts.pubKey The bitcoin address to use to sign (or the default bitcoin address of your backend if not provided).
     * @param {module:api/SignatureApi~signatureCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SignatureResult}
     */
    this.signature = function(hashToSign, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'hashToSign' is set
      if (hashToSign === undefined || hashToSign === null) {
        throw new Error("Missing the required parameter 'hashToSign' when calling signature");
      }


      var pathParams = {
      };
      var queryParams = {
        'pubKey': opts['pubKey'],
        'hashToSign': hashToSign
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['Bearer'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = SignatureResult;

      return this.apiClient.callApi(
        '/signature', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
