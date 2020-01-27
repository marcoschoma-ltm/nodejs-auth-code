# LTM - Code Samples

## OAuth 2.0 and OpenId Connect Sample

## Table of contents
* [What is this](#what-is-this)
    * [Code structure](#code-structure)
* [How to use](#how-to-use)
    * [Instaling and running](#instaling-and-running)
    * [Environment configurations](#environment-configurations)
    * [Auth (raw)](#auth-raw)
    * [Auth with OIDC Client](#auth-with-oidc-client)

## What is this?

This sample project includes code necessary to generate a basic authentication flow with an Identity Server

### Code structure
```
.env
src
├── auth
│   ├── auth.js     <- raw authentication flow
│   └── index.js
│── home
│   └── index.js    <- application entry point
│── openid-client
│   ├── auth.js     <- oidc authentication flow
│   └── index.js
└── index.js
```
# How to use?

## Instaling and running
```
npm install
npm start
```
Then navigate to the project url: https://localhost:3001 - or directly to https://localhost:3001/documentation for auto generated swagger API docs

The usage consists basically of generating a proper url and redirect to an Identity Server

## Environment configurations
#### .env file

In order to run this node application is necessary to have a `.env` file containing the following properties:
```.env file sample content
NAME='Middleware API'
VERSION='1.0'
PORT=3001

COGNITO_DISCOVERY_ENDPOINT=https://[identity-server-address]/.well-known/openid-configuration
APP_AUTH_CODE_CLIENT_ID=[cliend id to be provided by LTM - contact support to request yours]
APP_AUTH_CODE_CLIENT_SECRET=[cliend secret to be provided by LTM - contact support to request yours]
APP_AUTH_CODE_SCOPES=[available scopes includes: openid profile email webpremios.campaigns/{#id}]
APP_AUTH_CODE_GRANT_TYPE=authorization_code
APP_AUTH_CODE_CALLBACK=http://localhost:3001/auth/callback
```
The `.env` file needs to be available in root folder of application, or it can be specified in application start (see [dotenv documentation](https://www.npmjs.com/package/dotenv) for further details)

### Auth (raw)
#### src/auth/auth.js
This feature demonstrates how to generate a redirect url to be used by a front end application. This url forwards the user to an identity server that will collect credentials and grant the user access to personal resources.
```auth/auth.js
const GetAuthUrl = async (response, axios)
```

This url also includes the callback destination - in this application represented by the callback endpoint. When invoked, `callback` will post data into the authorization token provided by identity server, in order to retrieve the user tokens that concerns [OAuth authorization flow](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/).
```auth/auth.js
const Callback = async (response, axios, code, state)
```

### Auth with OIDC Client
#### src/openid-client/auth.js

https://github.com/IdentityModel/oidc-client-js/wiki