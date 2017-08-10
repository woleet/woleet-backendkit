# WoleetBackendKitApi.SignatureApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**signature**](SignatureApi.md#signature) | **GET** /signature | Sign some data using the bitcoin identity of your backend.


<a name="signature"></a>
# **signature**
> SignatureResult signature(hashToSign, opts)

Sign some data using the bitcoin identity of your backend.

Use this endpoint to sign some data using the bitcoin identity of your backend.   You first need to compute the SHA256 hash of your data (client side) and then provide it in the &#x60;hashToSign&#x60; parameter.   The signature produced is the signature of this hash using the bitcoin address provided in the &#x60;pubKey&#x60; parameter (or by the default bitcoin address of your backend if not set).   This endpoint is protected by an API token, provided to you at backend kit installation time. However, for security reason, **this endpoint SHOULD NEVER be exposed** outside your backend. To facilitate the isolation of this endpoint, a dedicated port can be specified at installation time. 

### Example
```javascript
var WoleetBackendKitApi = require('woleet_backend_kit_api');
var defaultClient = WoleetBackendKitApi.ApiClient.instance;

// Configure API key authorization: Bearer
var Bearer = defaultClient.authentications['Bearer'];
Bearer.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Bearer.apiKeyPrefix = 'Token';

var apiInstance = new WoleetBackendKitApi.SignatureApi();

var hashToSign = "hashToSign_example"; // String | The SHA256 hash that is to be signed (a string formatted like [a-f0-9]{64}).

var opts = { 
  'pubKey': "pubKey_example" // String | The bitcoin address to use to sign (or the default bitcoin address of your backend if not provided).
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.signature(hashToSign, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **hashToSign** | **String**| The SHA256 hash that is to be signed (a string formatted like [a-f0-9]{64}). | 
 **pubKey** | **String**| The bitcoin address to use to sign (or the default bitcoin address of your backend if not provided). | [optional] 

### Return type

[**SignatureResult**](SignatureResult.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

