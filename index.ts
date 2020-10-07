'use strict'

import * as controller from './app/controller'
import middy from "@middy/core"
import {
    schemaValidationErrorParser
} from './utils/middyMiddlewares'

import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import httpCors from '@middy/http-cors'
import validator from '@middy/validator'
import { createUserSchema, userDetailSchema, updateUserSchema } from './app/schemas'
import * as AWSLambda from "aws-lambda"
import {LogData} from "./utils/log/classes/LogData";

const createUser = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
        const logData = new LogData({
            method: event.httpMethod,
            path: event.path,
            from: event.headers["X-Forwarded-For"][0]
        })
        return controller.createUser(event, logData)
    })
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(validator({inputSchema: createUserSchema, ajvOptions: {$data: true}})) // validates the input
    .use(schemaValidationErrorParser())
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())

const listUsers = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
    const logData = new LogData({
        method: event.httpMethod,
        path: event.path,
        from: event.headers["X-Forwarded-For"][0]
    })
    return controller.listUsers(event, logData)
})
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())

const userDetail = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
    const logData = new LogData({
        method: event.httpMethod,
        path: event.path,
        from: event.headers["X-Forwarded-For"][0]
    })
    return controller.userDetail(event, logData)
})
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(validator({inputSchema: userDetailSchema, ajvOptions: {$data: true}})) // validates the input
    .use(schemaValidationErrorParser())
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())

const deleteUser = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
    const logData = new LogData({
        method: event.httpMethod,
        path: event.path,
        from: event.headers["X-Forwarded-For"][0]
    })
    return controller.deleteUser(event, logData)
})
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(validator({inputSchema: userDetailSchema, ajvOptions: {$data: true}})) // validates the input
    .use(schemaValidationErrorParser())
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())

/*
 * It is intended to work as PATCH service, so any optional parameter should be null in order to remove it
 */
const updateUser = middy((event:AWSLambda.APIGatewayEvent, context:AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> =>{
    const logData = new LogData({
        method: event.httpMethod,
        path: event.path,
        from: event.headers["X-Forwarded-For"][0]
    })
    return controller.updateUser(event, logData)
})
    .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
    .use(validator({inputSchema: updateUserSchema, ajvOptions: {$data: true}})) // validates the input
    .use(validator({inputSchema: userDetailSchema, ajvOptions: {$data: true}})) // validates the input
    .use(schemaValidationErrorParser())
    .use(httpErrorHandler({
        logger: undefined
    }))
    .use(httpCors())

export { createUser, listUsers, userDetail, deleteUser, updateUser }