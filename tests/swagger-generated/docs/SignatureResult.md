# WoleetBackendKitApi.SignatureResult

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pubKey** | **String** | The bitcoin address used to sign (same as the &#x60;pubKey&#x60; parameter, if provided). | [optional] 
**signedHash** | **String** | The hash that is signed (same as the &#x60;hashToSign&#x60; parameter). | [optional] 
**signature** | **String** | The signature of &#x60;hashToSign&#x60; using the bitcoin address &#x60;pubKey&#x60;. | [optional] 
**identityURL** | **String** | The public URL of the &#x60;/identity&#x60; endpoint (ie. the URL that anyone can use to verify the bitcoin identity of your backend). | [optional] 


