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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.WoleetBackendKitApi) {
      root.WoleetBackendKitApi = {};
    }
    root.WoleetBackendKitApi.SignatureResult = factory(root.WoleetBackendKitApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SignatureResult model module.
   * @module model/SignatureResult
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>SignatureResult</code>.
   * @alias module:model/SignatureResult
   * @class
   */
  var exports = function() {
    var _this = this;





  };

  /**
   * Constructs a <code>SignatureResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignatureResult} obj Optional instance to populate.
   * @return {module:model/SignatureResult} The populated <code>SignatureResult</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('pubKey')) {
        obj['pubKey'] = ApiClient.convertToType(data['pubKey'], 'String');
      }
      if (data.hasOwnProperty('signedHash')) {
        obj['signedHash'] = ApiClient.convertToType(data['signedHash'], 'String');
      }
      if (data.hasOwnProperty('signature')) {
        obj['signature'] = ApiClient.convertToType(data['signature'], 'String');
      }
      if (data.hasOwnProperty('identityURL')) {
        obj['identityURL'] = ApiClient.convertToType(data['identityURL'], 'String');
      }
    }
    return obj;
  }

  /**
   * The bitcoin address used to sign (same as the `pubKey` parameter, if provided).
   * @member {String} pubKey
   */
  exports.prototype['pubKey'] = undefined;
  /**
   * The hash that is signed (same as the `hashToSign` parameter).
   * @member {String} signedHash
   */
  exports.prototype['signedHash'] = undefined;
  /**
   * The signature of `hashToSign` using the bitcoin address `pubKey`.
   * @member {String} signature
   */
  exports.prototype['signature'] = undefined;
  /**
   * The public URL of the `/identity` endpoint (ie. the URL that anyone can use to verify the bitcoin identity of your backend).
   * @member {String} identityURL
   */
  exports.prototype['identityURL'] = undefined;



  return exports;
}));


