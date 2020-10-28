## Table of Contents

- [Introduction](#introduction)
- [Project structure](#project-structure)
    - [Index.ts](#index.ts)
    - [app folder](#app-folder)
    - [config folder](#config-folder)
    - [models folder](#models-folder)
    - [tests folder](#tests-folder)
        - [tests/unit/index folder](#testsunitindex-folder)
        - [tests/unit/app folder](#testsunitapp-folder)
        - [tests/unit/dummies folder](#testsunitdummies-folder)
    - [utils folder](#utils-folder)
        - [utils/log folder](#utilslog-folder)
        - [utils/middyMiddlewares folder](#testsunitapp-folder)
        - [utils/responseHandler folder](#testsunitdummies-folder)
    - [Configuration files](#configuration-files)
- [Testing](#testing)
    - [Run unit tests](#run-unit-tests)
    - [Run sonar](#run-sonar)
- [NPM commands](#npm-commands)
- [Example of *Event* object](#example-of-Event-object)
   
  

# Introduction
This skeleton provides a ready-to-go skeleton that provides a basic CRUD set with DynamoDB.
Furthermore, contains good examples of unit testing, integration and input data sanitization 

# Project structure:

#### Index.ts
Entrypoint for AWS Configuration. It exposes functions that are going to be used by lambdas. Any function exposed here has the following shape:

```
const functionName = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
    const logData = new LogData({
        method: event.httpMethod,
        path: event.path,
        from: event.headers["X-Forwarded-For"][0]
    })
    return controller.functionName(event, logData)
})
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(validator({inputSchema: serviceInputSchema, ajvOptions: {$data: true}})) // validates the input
    .use(schemaValidationErrorParser())
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())
```
Let's take a look on what does the function contains:
* All functions here have been wrapped with middy, which is a middleware that allows to work in an environment very close to Express server.
* It is followed by Middy middleware jsonBodyParser, which will manage the event.body object, so we can work always with objects instead of Strings or null values
* Then a JSON schema validator, based in AJV, that sanitizes input data. Can be headers, path params, body, etc. However, if you want to check more than 2 elements of Event, you'll specify 2 validators.
* After that, a custom middy middleware to modify Event so we can return a custom response when facing input validation errors
* HttpErrorHandler allows as to normalize responses when unexpected errors happens or we do not return a readable response from controller. As you can see, logger has been disabled in order to avoid meaningless logs
* Last, but not the least, a middleware that automatically sets the header Access-Control-Allow-Origin, so we can avoid CORS errors when running from a Web Browser

### app folder
Contains the implementation of the service, along with:
* JSON schemas that validates any input data to the service
* Utility functions for controller support

### config folder
Loads environment variables, which are going to different depending on the application's Stage (dev, qa, pre, pro, etc)
Contains also specific json files to load data when working locally or running tests

### models folder
It contains classes that represents Database tables or models  
Run tests with *npm test*

### tests folder
Inside this folders are located unit and sanitization tests.

#### tests/unit/index folder
This folder tests the entrypoint of the service. It has a single test for all corner cases of each input data of each service. In other words, tests that all input data are located inside the limits of data validation.
Moreover test the happy path of the implementation.

#### tests/unit/app folder
Contains one folder per exposed service in controller. They contains the tests to cover all service code as well as validates the data we send to third parties and the service response

#### tests/unit/dummies folder
Contains example JSONs that are returned by mocked functions.

### utils folder
Common libraries for all components of the architecture

#### utils/log folder
Wrapper for Winston to print application logs in a more adequate shape

#### utils/middyMiddlewares folder
Folder to place any middleware for Middy

#### utils/responseHandler folder
Manager to handle HTTP status and body in responses

### Configuration files
* .nycrc.json: File that configures NYC, the code coverage checker
* docker-compose.yaml: Simple docker-compose file that allows to start a Sonarqube server locally without a native install
* jasmine.json: Configuration for the tests runner Jasmine
* sonarRunner.ts: Script that runs a sonar client based in typescript
* tsconfig.json: Configuration file with the most common parameters for Typescript to work 


# Testing

This architecture provides also tools that allows QA team to evaluate successful tests, code coverage and Sonar testing

## Run unit tests

```
$> npm install
$> npm test 
```

Besides execution results and cobertura via console, It will also produce the folder **reports** inside the tests folder:
* Coverage: All cobertura reports generated by NYC
* Unit: JUnit-based XML file that contains the execution tests result 

## Run sonar

Sonar is used here from a Docker Image, if you already have a sonar installation or a running server, just to configure sonarRunner.ts and run it.

* Install Docker from https://docs.docker.com/get-docker/
* Create working folders:
    * ```$> sudo mkdir /usr/local/docker-storage```
    * ```$> sudo chown -R ${YOUR_USER} /usr/local/docker-storage```
    * ```$> mkdir /usr/local/docker-storage/sonar-database-postgre```
    * ```$> mkdir /usr/local/docker-storage/sonarqube```
* Go to Docker preferences ==> Resources ==> File Sharing. Then add **/usr/local/docker-storage** to the list
* Configure file sonarRunner.ts with your sonar server data
* Start SonarQube server by running ```$> docker-compose up -d```. Sonarqube server Will take a few minutes to start services
* Run ```$> npm run sonar```
* Go to http://localhost:19000 to see results

## NPM Commands

* ``$> npm test``: Run unit tests with coverage
* ``$> npm run sonar``: Run sonar client against a local Sonarqube server
* ``$> npm run compile``: Compiles Typwscript files into **dist/** folder. Note: **node_modules** must be generated either manually or using a Lambda layer

## Example of *Event* object

* Headers: event.headers
* Path Params: event.pathParameters
* Query Params: event.queryStringParameters
* Body: event.body (as *STRING*)
`{
    "resource": "/helloworld",
    "path": "/helloworld",
    "httpMethod": "GET",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Auth": "allow",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "ES",
        "Host": "c78cf97f5h.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "PostmanRuntime/7.19.0",
        "Via": "1.1 3d894cf86d3eca85fdb4b21f62292766.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "i-nD-TOZWSJ_Tu064xiqb2TWiVmHddiNI4xkO8v6WugUqdjkkf7KLA==",
        "X-Amzn-Trace-Id": "Root=1-5dd3e0d5-6bcb8ee856f715f093627d6e",
        "X-Forwarded-For": "89.107.183.3, 64.252.132.80",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [
            "*/*"
        ],
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "Auth": [
            "allow"
        ],
        "Cache-Control": [
            "no-cache"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-Country": [
            "ES"
        ],
        "Host": [
            "c78cf97f5h.execute-api.us-east-1.amazonaws.com"
        ],
        "User-Agent": [
            "PostmanRuntime/7.19.0"
        ],
        "Via": [
            "1.1 3d894cf86d3eca85fdb4b21f62292766.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "i-nD-TOZWSJ_Tu064xiqb2TWiVmHddiNI4xkO8v6WugUqdjkkf7KLA=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-5dd3e0d5-6bcb8ee856f715f093627d6e"
        ],
        "X-Forwarded-For": [
            "89.107.183.3, 64.252.132.80"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": {
        "city": "Seattle",
        "name": "John"
    },
    "multiValueQueryStringParameters": {
        "city": [
            "Seattle"
        ],
        "name": [
            "John"
        ]
    },
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "gvc8r5",
        "resourcePath": "/helloworld",
        "httpMethod": "GET",
        "extendedRequestId": "DaARWGVqIAMFeHg=",
        "requestTime": "19/Nov/2019:12:32:21 +0000",
        "path": "/prod/helloworld",
        "accountId": "293312110976",
        "protocol": "HTTP/1.1",
        "stage": "prod",
        "domainPrefix": "c78cf97f5h",
        "requestTimeEpoch": 1574166741378,
        "requestId": "1e98d505-461f-4c9c-83c4-bd96a68c96fe",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "89.107.183.3",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "PostmanRuntime/7.19.0",
            "user": null
        },
        "domainName": "c78cf97f5h.execute-api.us-east-1.amazonaws.com",
        "apiId": "c78cf97f5h"
    },
    "body": "{hola:hola}",
    "isBase64Encoded": false
}`



The output from a Lambda proxy integration must be
in the following JSON object. The 'headers' property
is for custom response headers in addition to standard
ones. The 'body' property  must be a JSON string. For
base64-encoded payload, you must also set the 'isBase64Encoded'
property to 'true'