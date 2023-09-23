# Documentation

This is a simple documentation of the API endpoints, how to make requests to them and how they respond. The API endpoints are categorized by services. The following services have been implemented:

- Auth
- User

## Auth

**base url:** `api/v1/auth`

The Auth service has the following endpoints:

1. /sign-up
2. /sign-in
3. /verify-otp/:token
4. /logout

### 1. /sign-up

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

### 2. /sign-in

The `sign-in` endpoint requires an email address and a phone number passed to the request body. A user is identified by the email address and password sent with the request. This endpoint generates a token which is to be appended to the `verify-otp` url. The `login` endpoint also generates and sends an otp to the passed email address and phone number. This endpoint returns the generated token and the otp.

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

json:
{
    "status": "success",
    "message": "OTP sent successfully.",
    "data": { 
        "otp": 3037,
        "token": "3fe64228d903f8b3a71ac9aeebc229a5712f6dc02f27b837d298b92e9f52d280" 
    }
}

```

### 3. /verify-otp/:token

`token` is a 32-character hexadecimal string returned from the `login` endpoint. The `verify-otp` endpoint requires an otp passed to request body. This endpoint verifies the otp passed with the request

To verify an otp, make a `POST` request to the `verify-otp` endpoint with the following request type:

```yaml
params: 
{
    "token": "string"
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
params: 
{
    "token": "3fe64228d903f8b3a71ac9aeebc229a5712f6dc02f27b837d298b92e9f52d280"
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
.    "user": {
        "_id": "645b9453c723ba28c5cbd686",
        "email": "john@doe.com",
        "phoneNumber": "+2349012345678"
     },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8"
  }
}
```

### 4. /logout

The `logout` endpoint requires an access token passed to the request header. A middleware generates a new access token if the passed access token is invalid or expired. However for this to happen, a valid refresh token must be passed in the request cookies. This endpoint expires the refresh token in the cookies.

To log a user out, make a `POST` request to the `logout` endpoint with the following request type:

```yaml
headers: 
{ 
    "Authorization": "Bearer <accessToken>",
    "Cookie": "refreshToken=<refreshToken>"
}
```

A sample request looks like:

```yaml
headers: 
{ 
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8",
    "Cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8;"

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

## User

**base url:** `api/v1/users`

Every endpoint in the user service requires authentication. Authentication requires an access token passed to the request header. A middleware generates a new access token if the passed access token is invalid or expired. However for this to happen, a valid refresh token must be passed in the request cookies.

The user service has the following endpoint:

1. /
2. /:id

### 1. /

The base user service endpoint accepts the following methods:

1. GET  

#### 1. GET

The GET method on the base user service endpoint returns an array of all the user objects in the database. This endpoint can only be accessed by admin users. A middleware checks if the authenticated user role is "admin".

To get all users, make a `GET` request to the base user service endpoint with the following request type:

```yaml
headers: 
{ 
    "Authorization": "Bearer <accessToken>",
    "Cookie": "refreshToken=<refreshToken>"
}
```

A sample request looks like:

```yaml
headers: 
{ 
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8",
    "Cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8;"
}
```

A sample response looks like:

```yaml
200


{  
    "status": "success",  
    "message": "Users returned successfully",  
    "data": [  
        {  
            "_id": "645b9453c723ba28c5cbd686",  
            "name": "John Doe",  
            "email": "john@doe.com",
            "phoneNumber": "+2349012345678",  
            "role": "student",  
            "createdLessons": [],  
            "savedLessons": [],  
            "notifications": [],  
            "createdAt": "2023-05-10T12:55:47.168Z",  
            "updatedAt": "2023-05-10T12:55:47.168Z",  
            "__v": 0  
        },  
        {  
            "_id": "6488677b437bcdd91c6920aa",  
            "name": "John Doe jnr",  
            "email": "johndoejnr@localhost.com",  
            "phoneNumber": "+2348137298342",  
            "role": "student",  
            "createdLessons": [],  
            "savedLessons": [],  
            "notifications": [],  
            "createdAt": "2023-06-13T12:56:30.819Z",  
            "updatedAt": "2023-06-13T12:56:30.819Z",  
            "__v": 0  
        },  
        {  
            "_id": "64b1a92ff03a6f6ad6d179ea",  
            "name": "John Doe snr",  
            "email": "johndoesnr@localhost.com",  
            "phoneNumber": "+2347013703549",  
            "role": "student",  
            "createdLessons": [],  
            "savedLessons": [],  
            "notifications": [],  
            "createdAt": "2023-07-14T19:59:43.793Z",  
            "updatedAt": "2023-07-14T19:59:43.793Z",  
            "__v": 0  
        },  
    ]
}
```

### 2. /:id

The base user service endpoint accepts the following methods:

1. GET
2. PUT

#### 1. GET

The GET method on the `/:id` user service endpoint returns a user object that is identified with the `id` passed in the url.

To get a user by id, make a `GET` request to the `/:id` user service endpoint with the following request type:

```yaml
params:
{
    "id": "string",
}

headers: 
{ 
    "Authorization": "Bearer <accessToken>",
    "Cookie": "refreshToken=<refreshToken>"
}
```

A sample request looks like:

```yaml
params:
{
    "id": "645b9453c723ba28c5cbd686",
}

headers: 
{ 
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8",
    "Cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8;"

}
```

A sample response looks like:

```yaml
200

{  
  "status": "success",  
  "message": "User returned successfully",  
  "data": {  
    "_id": "645b9453c723ba28c5cbd686",  
    "name": "Johnson Doe",  
    "email": "john@doe.com",  
    "phoneNumber": "+2349012345678",
    "role": "admin",  
    "createdLessons": [],  
    "savedLessons": [],  
    "notifications": [],  
    "createdAt": "2023-05-10T12:55:47.168Z",  
    "updatedAt": "2023-09-23T09:50:24.376Z",  
    "__v": 0  
  }  
}
```

#### 2. PUT

The PUT method on the `/:id` user service endpoint updates a user object with the data passed in the request body. The user is identified by the `id` passed to the url. This route returns the user object with the updated changes.

The following fields can be updated on the user object:

- name

To update a user object, make a `PUT` request to the `/:id` user service endpoint with the following request type:

```yaml
params:
{
    "id": "string",
}

headers: 
{ 
    "Authorization": "Bearer <accessToken>",
    "Cookie": "refreshToken=<refreshToken>"
}

body: 
{
    "name": "string"
}


```

A sample request looks like:

```yaml
params:
{
    "id": "645b9453c723ba28c5cbd686",
}


headers: 
{ 
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZmQ0YWEwYjc0NDkzM2IyODAyYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUiLCJlbWFpbCI6Im5lbHNvbmVsYXllODcyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNDkwNzkwNzEzODciLCJyb2xlIjoic3R1ZGVudCIsImNyZWF0ZWRMZXNzb25zIjpbXSwic2F2ZWRMZXNzb25zIjpbXSwibm90aWZpY2F0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDktMTBUMDQ6NDg6MzIuOTQ2WiIsIl9fdiI6MH0sImlhdCI6MTY5NDM1NjM3OH0.ZK5ppxbtBNXsqKLF8qrjfw7i6LtPrWkA0Auk40HOqw8",
    "Cookie": "refreshToken=eyJhbGciOJIUzi1NilsInR5cC161kpXVCJ9.eyJ1c2Vylip7119pZCI6IjY0ZmQ0YWEwYjCONDkzM2YODAYYmUzYSIsIm5hbWUiOiJOZWxzb24gRWxheWUILCJlbWFpbC161m5lbHNvbmVsYXlODcyQGdtYWlsLmNvbSisinBob25lTnVtYmVyljoiKz1zNDkwNzkwNzEzODcilCJyb2xlljoic3R1ZGVudClaimNyZWFOZWRMZXNzb25zljpbXSwic2F2ZWRMZXNzb25zljpbXSwibm90aWZpY2F0aW9ucy16W10slmNyZWF0ZWRBdC161IIwMjMIMDMTBUMDQ6NDg6MzluOTQ2WilsinVwZGF0ZWRBdCI6IjIwMIMIMDKIMTBUMDQ6NDg6MzluOTQ2Wilsl19fdil6MH0sImihdC16MTY5NDM1NjM30H0.ZK5ppxbtBNXsqKLFBqrjfw716L1PrWkA0Auk40HOqw8;"
}

body:
{
    "name": "Johnson Doe"
}
```

A sample response looks like:

```yaml
200

{  
  "status": "success",  
  "message": "User data updated successfully",  
  "data": {  
    "_id": "645b9453c723ba28c5cbd686",  
    "name": "Johnson Doe",  
    "email": "john@doe.com",  
    "phoneNumber": "+2349012345678",
    "role": "admin",  
    "createdLessons": [],  
    "savedLessons": [],  
    "notifications": [],  
    "createdAt": "2023-05-10T12:55:47.168Z",  
    "updatedAt": "2023-09-23T09:50:24.376Z",  
    "__v": 0  
  }  
}
```
