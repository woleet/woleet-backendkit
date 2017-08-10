# WoleetBackendKitApi.IdentityApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**identity**](IdentityApi.md#identity) | **GET** /identity | Prove the bitcoin identity of your backend.


<a name="identity"></a>
# **identity**
> IdentityResult identity(pubKey, leftData)

Prove the bitcoin identity of your backend.

This endpoint can be used by anyone wanting to verify the bitcoin identity of your backend.   Calling this endpoint (that should be accessible publicly) makes your backend sign some random data (built by concatenating the &#x60;leftData&#x60; parameter provided by the client and the &#x60;rightData&#x60; parameter provided by your backend) using the bitcoin address provided in the &#x60;pubKey&#x60; parameter.   The caller can then verify that the produced signature is valid for the given bitcoin address (which validate the ownership of this address by your backend) and can optionally read the TLS certificate securing this endpoint to get the certified identity of your backend. 

### Example
```javascript
var WoleetBackendKitApi = require('woleet_backend_kit_api');

var apiInstance = new WoleetBackendKitApi.IdentityApi();

var pubKey = "pubKey_example"; // String | The bitcoin address to use to sign.

var leftData = "leftData_example"; // String | Left part of the random data to sign (should be generated randomly).


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.identity(pubKey, leftData, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pubKey** | **String**| The bitcoin address to use to sign. | 
 **leftData** | **String**| Left part of the random data to sign (should be generated randomly). | 

### Return type

[**IdentityResult**](IdentityResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

