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

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['expect.js', '../../src/index'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        factory(require('expect.js'), require('../../src/index'));
    } else {
        // Browser globals (root is window)
        factory(root.expect, root.WoleetBackendKitApi);
    }
}(this, function (expect, WoleetBackendKitApi) {
    'use strict';

    var instance;

    const util = require("../../../util");

    beforeEach(function () {
        instance = new WoleetBackendKitApi.IdentityApi();
        instance.apiClient.basePath = "https://localhost:1234";
    });

    var getProperty = function (object, getter, property) {
        // Use getter method if present; otherwise, get the property directly.
        if (typeof object[getter] === 'function')
            return object[getter]();
        else
            return object[property];
    }

    var setProperty = function (object, setter, property, value) {
        // Use setter method if present; otherwise, set the property directly.
        if (typeof object[setter] === 'function')
            object[setter](value);
        else
            object[property] = value;
    }

    describe('IdentityApi', function () {
        describe('identity', function () {
            it('should call identity successfully', function (done) {
                const pubKey = "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN";
                const leftData = "this is random data";
                instance.identity(pubKey, leftData, function (error, data, resp) {
                    if (error) throw error;
                    expect(data.rightData).not.to.be(null);
                    expect(data.signature).not.to.be(null);
                    expect(util.validateSignature(leftData + data.rightData, pubKey, data.signature).valid).to.be(true);
                    done();
                });
            });
        });
    });

}));
