/**
 * Woleet signature backend kit
 * This server aims to provide an easy way to sign a hash and proving that you are the corresponding signee on demand by providing two endpoints:    `/identity` let **anyone** verify that you own the private key corresponding to your address.    `/signature` let **you** (and only you) sign a hash.
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ApiClient', 'model/InlineResponse200', 'model/InlineResponse2001', 'model/InlineResponse400'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(require('../ApiClient'), require('../model/InlineResponse200'), require('../model/InlineResponse2001'), require('../model/InlineResponse400'));
    } else {
        // Browser globals (root is window)
        if (!root.WoleetSignatureBackendKit) {
            root.WoleetSignatureBackendKit = {};
        }
        root.WoleetSignatureBackendKit.DefaultApi = factory(root.WoleetSignatureBackendKit.ApiClient, root.WoleetSignatureBackendKit.InlineResponse200, root.WoleetSignatureBackendKit.InlineResponse2001, root.WoleetSignatureBackendKit.InlineResponse400);
    }
}(this, function (ApiClient, InlineResponse200, InlineResponse2001, InlineResponse400) {
    'use strict';

    /**
     * Default service.
     * @module api/DefaultApi
     * @version 1.0.0
     */

    /**
     * Constructs a new DefaultApi.
     * @alias module:api/DefaultApi
     * @class
     * @param {module:ApiClient} apiClient Optional API client implementation to use,
     * default to {@link module:ApiClient#instance} if unspecified.
     */
    const exports = function (apiClient) {
        this.apiClient = apiClient || ApiClient.instance;


        /**
         * Callback function to receive the result of the identityGet operation.
         * @callback module:api/DefaultApi~identityGetCallback
         * @param {String} error Error message, if any.
         * @param {module:model/InlineResponse2001} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */

        /**
         * Get identity
         * Proves an identity ownership by signing random data:    the concatenation of a &#x60;leftData&#x60; paremeter provided by the client and a &#x60;rightData&#x60; paremeter provided by the server   is signed; if this signature matches the pubKey, then the server owns the corresponding private key.
         * @param {String} pubKey Bitcoin base58 public key (address)
         * @param {String} leftData Left part of the randomly signed message
         * @param {module:api/DefaultApi~identityGetCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/InlineResponse2001}
         */
        this.identityGet = function (pubKey, leftData, callback) {
            const postBody = null;

            // verify the required parameter 'pubKey' is set
            if (pubKey == undefined || pubKey == null) {
                throw new Error("Missing the required parameter 'pubKey' when calling identityGet");
            }

            // verify the required parameter 'leftData' is set
            if (leftData == undefined || leftData == null) {
                throw new Error("Missing the required parameter 'leftData' when calling identityGet");
            }


            const pathParams = {};
            const queryParams = {
                'pubKey': pubKey,
                'leftData': leftData
            };
            const headerParams = {};
            const formParams = {};

            const authNames = [];
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];
            const returnType = InlineResponse2001;

            return this.apiClient.callApi(
                '/identity', 'GET',
                pathParams, queryParams, headerParams, formParams, postBody,
                authNames, contentTypes, accepts, returnType, callback
            );
        };

        /**
         * Callback function to receive the result of the signatureGet operation.
         * @callback module:api/DefaultApi~signatureGetCallback
         * @param {String} error Error message, if any.
         * @param {module:model/InlineResponse200} data The data returned by the service call.
         * @param {String} response The complete HTTP response.
         */

        /**
         * Get hash signature
         * Allows the client to sign a hash:    A &#x60;hashToSign&#x60; paremeter provided by the client is signed (only if the server owns the private key corresponding to the &#x60;pubKey&#x60; parameter.    &lt;br&gt;    This endpoint is protected by an access token, provided on the server&#39;s initialzation.    &lt;br&gt;    Note that this endpoint may not be exposed on the same port as the &#x60;/identity&#x60; endpoint.
         * @param {String} hashToSign Hash that is to be signed (a string formatted like [a-f0-9]{64})
         * @param {Object} opts Optional parameters
         * @param {String} opts.pubKey Bitcoin base58 public key (address)
         * @param {String} token access token
         * @param {module:api/DefaultApi~signatureGetCallback} callback The callback function, accepting three arguments: error, data, response
         * data is of type: {@link module:model/InlineResponse200}
         */
        this.signatureGet = function (hashToSign, opts, token, callback) {
            opts = opts || {};
            const postBody = null;

            // verify the required parameter 'hashToSign' is set
            if (hashToSign == undefined || hashToSign == null) {
                throw new Error("Missing the required parameter 'hashToSign' when calling signatureGet");
            }


            const pathParams = {};
            const queryParams = {
                'pubKey': opts['pubKey'],
                'hashToSign': hashToSign
            };
            const headerParams = {
                'Authorization' : 'Bearer ' + token
            };
            const formParams = {};

            const authNames = ['Bearer'];
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];
            const returnType = InlineResponse200;

            return this.apiClient.callApi(
                '/signature', 'GET',
                pathParams, queryParams, headerParams, formParams, postBody,
                authNames, contentTypes, accepts, returnType, callback
            );
        }
    };

    return exports;
}));