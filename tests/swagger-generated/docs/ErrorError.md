# WoleetBackendKitApi.ErrorError

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**statusCode** | **Number** | the statusCode matches the returned http status code | [optional] 
**message** | **String** |  | [optional] 
**type** | **String** |  | [optional] 


<a name="MessageEnum"></a>
## Enum: MessageEnum


* `Bad Request` (value: `"Bad Request"`)

* `Unauthorized` (value: `"Unauthorized"`)

* `Not Found` (value: `"Not Found"`)

* `Internal Server Error` (value: `"Internal Server Error"`)

* `Missing &#39;pubKey&#39; query parameter` (value: `"Missing 'pubKey' query parameter"`)

* `Missing &#39;leftData&#39; query parameter` (value: `"Missing 'leftData' query parameter"`)

* `Missing &#39;hashToSign&#39; query parameter` (value: `"Missing 'hashToSign' query parameter"`)

* `Query parameter &#39;hashToSign&#39; has to be a SHA256 hash (in lowercase)` (value: `"Query parameter 'hashToSign' has to be a SHA256 hash (in lowercase)"`)

* `Unhandled public key` (value: `"Unhandled public key"`)

* `Bad token` (value: `"Bad token"`)




<a name="TypeEnum"></a>
## Enum: TypeEnum


* `BadRequestError` (value: `"BadRequestError"`)

* `UnauthorizedError` (value: `"UnauthorizedError"`)

* `NotFoundError` (value: `"NotFoundError"`)

* `InternalServerError` (value: `"InternalServerError"`)




