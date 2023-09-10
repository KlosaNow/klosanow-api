# About

This is a simple documentation of the API routes, how to make requests to them and how they respond. The API routes are categorized by services. The following services have been implemented:

- Auth
- User

## Auth

The Auth service has the following endpoints:
1. sign-up
2. sign-in
3. verify-otp
4. logout

### 1. sign-up

The `sign-up` endpoint requires an email address, a phone number and a name. This endpoint accepts an optional role property.
This endpoint creates a new user object with the credentials passed in the request body. 

To create a new user, make a `POST` request to the `sign-up` endpoint with the following request body type:
```yaml
{
    "email": { 
        "type": "email", 
        "required": "true"
    },
    "name": { 
        "type": "string", 
        "required": "true"
    },
    "phoneNumber": { 
        "type": "string of numbers", 
        "required": "true"
    },
    "role": { 
        "type": "string", 
        "required": "false"
    }
}
```


A sample request looks like:
```yaml
body:
{
    "email": "john@doe.com",
    "name": "John Doe",
    "phoneNumber": "09012345678"
}
```


A sample response looks like:
```yaml
201

{
    "status": "success",
    "message": "User created successfully. Log in."
}
```


### 2. sign-in

The `sign-in` endpoint requires an email address and a phone number passed to the request body. A user is identified by the email address and password sent with the request. This endpoint generates authentication tokens for the user. This endpoint also generates and sends OTP to the passed email address and phone number.This endpoint returns the access token and the otp.

To login a user, make a `POST` request to the `sign-in` endpoint with the following request body type:
```yaml
{
    "email": { 
        "type": "email", 
        "required": "true"
    },
    "phoneNumber": { 
        "type": "string of numbers", 
        "required": "true"
    }
}
```

A sample request looks like:
```yaml
{
    "email": "john@doe.com",
    "phoneNumber": "09012345678"
}
```


A sample response looks like:
```yaml
200

headers: 
{
   "set-cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8; Max-Age=604800; Path=/; Expires=Sun, 17 Sep 2023 14:32:58 GMT; HttpsOnly"
}

json:
{
    "status": "success",
    "message": "OTP sent successfully.",
    "data": { 
        "otp": 3037,
        "token": "eyJhbGciOiJlUzI1NilsInR5cC16kpXVCJ9.eyJIc2Vyljp7119pZCI6IjY0ZmQ0YWEwYjcONDkzM2lyODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJIbWFpbC161m5IbHNvbmVsYXIIODcyQGdtYWlsLmNvbSisInBob25ITnVtYmVyljoiKzlzNDkwNzkwNzEzODciLCJyb2xlljoic3R1ZGVudClsImNyZWF0ZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10simNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdC16IjIwMjMtMDktMTBUMDQ6NDg6MzluOTQ2Wils19fdi16MHOsimlhdC16MTY5NDMYMTMzMX0.moBYZRfUG_fgKLx51Ar6T7tixEGmbbGuwp9uKKaol-8" 
    }
}

```

### 3. verify-otp

The `verify-otp` endpoint requires an otp passed to request body. This endpoint also requires an access token passed to the request header. A middleware generates a new access token if the passed access token is invalid or expired. However, a valid refresh token must be passed in the request cookies. This endpoint verifies the otp passed with the request 

To verify an otp, make a POST request to the `verify-otp` endpoint with the following request type:
```yaml
headers: 
{
    "Authorization": "Bearer <token>"
}

body:
{
    "otp": { 
        "type": "string of numbers", 
        "required": "true"
    }
}
```


A sample request looks like:
```yaml
headers: 
{
    "Authorization": "Bearer eyJhbGciOiJlUzI1NilsInR5cC16kpXVCJ9.eyJIc2Vyljp7119pZCI6IjY0ZmQ0YWEwYjcONDkzM2lyODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJIbWFpbC161m5IbHNvbmVsYXIIODcyQGdtYWlsLmNvbSisInBob25ITnVtYmVyljoiKzlzNDkwNzkwNzEzODciLCJyb2xlljoic3R1ZGVudClsImNyZWF0ZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10simNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdC16IjIwMjMtMDktMTBUMDQ6NDg6MzluOTQ2Wils19fdi16MHOsimlhdC16MTY5NDMYMTMzMX0.moBYZRfUG_fgKLx51Ar6T7tixEGmbbGuwp9uKKaol-8"
}

body:
{
    "otp": "0123"
}
```


A sample response looks like:
```yaml
200

headers: 
{
    "set-cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8; Max-Age=604800; Path=/; Expires=Sun, 17 Sep 2023 14:32:58 GMT; HttpsOnly"
}


json:
{
  "status": "success",
  "message": "OTP Verified Successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8"
  }
}
```


### 4. logout

The `logout` endpoint requires an access token passed to the request header. A middleware generates a new access token if the passed access token is invalid or expired. However, a valid refresh token must be passed in the request cookies. This endpoint expires the refresh token in the cookies.

To log a user out, make a POST to the `logout` endpoint with the following request type:
```yaml
headers: 
{ 
    "Authorization": "Bearer <token>"
}
```

A sample request looks like:
```yaml
headers: 
{ 
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8"
}
```

A sample response looks like:
```yaml
200

{
    "status": "success",
    "message": "Logged out successfully."
}
```
