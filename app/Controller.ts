'use strict'
import AWS from 'aws-sdk'
import CommonResponse from '../utils/responseHandler'
import { LogData } from '../utils/log/classes/LogData'
import User from '../models/user'
import * as AWSLambda from 'aws-lambda'
import { config } from '../config'
import * as logger from '../utils/log'
import { EnumResponses } from '../utils/responseHandler/EnumResponses'

//********************************************************************************************************************//
//************************************** INTERNAL FUNCTIONS **********************************************************//
//********************************************************************************************************************//

export default class Controller {
    constructor() {

    }

    private static _insertOrUpdateDB(user: User, logData: LogData): Promise<User> {
        return new Promise((resolve, reject) => {
            const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: config.aws.region})
            const params:AWS.DynamoDB.Types.PutItemInput = {
                Item: {
                    id: {
                        S: user.id
                    },
                    given_name: {
                        S: user.given_name
                    },
                    family_name: {
                        S:  user.family_name
                    },
                    email: {
                        S:  user.email
                    }
                },
                ReturnConsumedCapacity: "TOTAL",
                TableName: config.aws.dynamodb.tableName
            }
            if(user.birthdate !== undefined) {
                params.Item.birthdate = {
                    S:  user.birthdate
                }
            }
            if(user.phone_number !== undefined) {
                params.Item.phone_number = {
                    S:  user.phone_number
                }
            }

            dynamodb.putItem(params, function(error:AWS.AWSError) {
                if(error) {
                    logger.error(logData, 'app.controller._insertOrUpdateDB: Error putting User in DynamoDB', {message: error.message, code: error.code, requestId: error.requestId})
                    const result = new CommonResponse(EnumResponses.GENERAL_ERROR)
                    result.setDescription(error.message)
                    return reject(result)
                }
                else {
                    return resolve(user)
                }
            })
        })
    }

    private static _listUsers(logData: LogData): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: config.aws.region})
            const params:AWS.DynamoDB.Types.ScanInput = {
                TableName: config.aws.dynamodb.tableName
            }
            dynamodb.scan(params, function (error: AWS.AWSError, data: AWS.DynamoDB.Types.ScanOutput) {
                if (error) {
                    logger.error(logData, 'app.controller.binding: Error scanning Users in DynamoDB', {
                        message: error.message,
                        code: error.code,
                        requestId: error.requestId
                    })
                    const result = new CommonResponse(EnumResponses.GENERAL_ERROR)
                    result.setDescription(error.message)
                    return reject(result)
                } else {
                    const users: User[] = []
                    // In practice, DynamoDB.ScanOutput.Items is not undefined. However, in its interface, it is optional
                    for (const dynamoItem of (data.Items || [])){
                        users.push(User.prototype.fromDynamo(dynamoItem))
                    }
                    return resolve(users)
                }
            })
        })
    }

    private static _userDetail(id:string, logData: LogData): Promise<User> {
        return new Promise((resolve, reject) => {
            const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: config.aws.region})
            const params:AWS.DynamoDB.Types.GetItemInput = {
                Key: {
                    id: {
                        S: id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            }
            dynamodb.getItem(params, function (error: AWS.AWSError, dynamoItem: AWS.DynamoDB.Types.GetItemOutput) {
                if (error) {
                    logger.error(logData, `app.controller._userDetail: Error getting User ${id}`, {
                        message: error.message,
                        code: error.code,
                        requestId: error.requestId
                    })
                    const result = new CommonResponse(EnumResponses.GENERAL_ERROR)
                    result.setDescription(error.message)
                    reject(result)
                } else {
                    if(Object.keys(dynamoItem).length === 0) {
                        reject(new CommonResponse(EnumResponses.NOT_FOUND))
                    }
                    else {
                        resolve(User.prototype.fromDynamo(dynamoItem.Item))
                    }
                }
            })
        })
    }

    private static _deleteUser(id:string, logData: LogData): Promise<void> {
        return new Promise((resolve, reject) => {
            const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: config.aws.region})
            const params:AWS.DynamoDB.Types.DeleteItemInput = {
                Key: {
                    id: {
                        S: id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            }
            dynamodb.deleteItem(params, function (error: AWS.AWSError, dynamoItem: AWS.DynamoDB.Types.DeleteItemOutput) {
                if (error) {
                    logger.error(logData, `app.controller._deleteUser: Error deleting User ${id}`, {
                        message: error.message,
                        code: error.code,
                        requestId: error.requestId
                    })
                    const result = new CommonResponse(EnumResponses.GENERAL_ERROR)
                    result.setDescription(error.message)
                    reject(result)
                } else {
                    //doesn't matter if ID exists or not, Dynamodb.deleteItem returns always an empty object
                    resolve()
                }
            })
        })
    }

//********************************************************************************************************************//
//************************************************* EXPORTS **********************************************************//
//********************************************************************************************************************//

    public static async createUser(event: AWSLambda.APIGatewayEvent, logData: LogData): Promise<AWSLambda.APIGatewayProxyResult> {
        const startTime = process.hrtime()
        logger.info(logData, 'app.controller.createUser: Request received')
        logger.debug(logData, 'app.controller.createUser: Body', event.body)
        const user = new User(event.body)

        try {
            await this._insertOrUpdateDB(user, logData)

            const response = new CommonResponse(EnumResponses.OK_GENERIC_RESPONSE)
            response.setData({
                id: user.id
            })

            const diffTime = process.hrtime(startTime)
            const processedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
            logger.info(logData, `app.controller.createUser: Finished in ${processedDiffTime} ms`, response.status_code)
            logger.debug(logData, 'app.controller.createUser', response)

            return Promise.resolve(response.toApiGatewayProxyResult())
        }
        catch(err:unknown) {
            const error:CommonResponse = <CommonResponse> err
            logger.error(logData,`app.controller.createUser: Error`, error)
            return Promise.resolve(error.toApiGatewayProxyResult())
        }
    }

    public static async listUsers(event: AWSLambda.APIGatewayEvent, logData: LogData): Promise<AWSLambda.APIGatewayProxyResult> {
        const startTime = process.hrtime()
        logger.info(logData, 'app.controller.listUsers: Request received')
        try {
            const users:User[] =  await this._listUsers(logData)
            const response = new CommonResponse(EnumResponses.OK_GENERIC_RESPONSE)
            response.setData(users)

            const diffTime = process.hrtime(startTime)
            const processedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
            logger.info(logData,`app.controller.listUsers: Finished in ${processedDiffTime} ms`, response.status_code)
            logger.debug(logData,'app.controller.listUsers', response)
            return Promise.resolve(response.toApiGatewayProxyResult())
        }
        catch (err:unknown) {
            const error:CommonResponse = <CommonResponse> err
            logger.error(logData,`app.controller.listUsers: Error`, error)
            return Promise.resolve(error.toApiGatewayProxyResult())
        }
    }

    public static async userDetail(event: AWSLambda.APIGatewayEvent, logData: LogData): Promise<AWSLambda.APIGatewayProxyResult> {
        const startTime = process.hrtime()
        // @ts-ignore. Ignored because event.pathParameters are already sanitized with schema in app/schemas/userDetail.json
        logger.info(logData, `app.controller.userDetail: Request received for User ${event.pathParameters.id}`)
        try {
            // @ts-ignore. Ignored because event.pathParameters are already sanitized with schema in app/schemas/userDetail.json
            const user:User = await this._userDetail(event.pathParameters.id, logData)
            const response = new CommonResponse(EnumResponses.OK_GENERIC_RESPONSE)
            response.setData(user)

            const diffTime = process.hrtime(startTime)
            const processedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
            logger.info(logData,`app.controller.userDetail: Finished in ${processedDiffTime} ms`, response.status_code)
            logger.debug(logData,'app.controller.userDetail', response)

            return Promise.resolve(response.toApiGatewayProxyResult())
        }
        catch (err:unknown) {
            const error:CommonResponse = <CommonResponse> err
            logger.error(logData,`app.controller.userDetail: Error`, error)
            return Promise.resolve(error.toApiGatewayProxyResult())
        }
    }

    public static async deleteUser(event: AWSLambda.APIGatewayEvent, logData: LogData): Promise<AWSLambda.APIGatewayProxyResult> {
        const startTime = process.hrtime()
        // @ts-ignore. Ignored because event.pathParameters are already sanitized with schema in app/schemas/userDetail.json
        logger.info(logData, `app.controller.deleteUser: Request received for User ${event.pathParameters.id}`)
        try {
            // @ts-ignore. Ignored because event.pathParameters are already sanitized with schema in app/schemas/userDetail.json
            await this._deleteUser(event.pathParameters.id, logData)
            const response: AWSLambda.APIGatewayProxyResult = {
                statusCode: 204,
                body: ''
            }

            const diffTime = process.hrtime(startTime)
            const processedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
            logger.info(logData,`app.controller.userDetail: Finished in ${processedDiffTime} ms`, response.statusCode)
            logger.debug(logData,'app.controller.userDetail', response)

            return Promise.resolve(response)
        }
        catch (err:unknown) {
            const error:CommonResponse = <CommonResponse> err
            logger.error(logData,`app.controller.deleteUser: Error`, error)
            return Promise.resolve(error.toApiGatewayProxyResult())
        }
    }

    public static async updateUser(event: AWSLambda.APIGatewayEvent, logData: LogData): Promise<AWSLambda.APIGatewayProxyResult> {
        const startTime = process.hrtime()
        // @ts-ignore. Ignored because event.pathParameters are already sanitized with schema in app/schemas/userDetail.json
        logger.info(logData, `app.controller.deleteUser: Request received for User ${event.pathParameters.id}`)
        logger.debug(logData, `app.controller.updateUser: Body ${event.body}`)

        try {
            // @ts-ignore
            const user:User = await this._userDetail(event.pathParameters.id, logData)
            // @ts-ignore has been sanitized with middy, so it is not null
            user.given_name = (event.body.given_name) ? event.body.given_name : user.given_name
            // @ts-ignore
            user.family_name = (event.body.family_name) ? event.body.family_name : user.family_name
            // @ts-ignore
            user.email = (event.body.email) ? event.body.email : user.email
            // @ts-ignore
            user.birthdate = (event.body.birthdate === null ) ? undefined : ((event.body.birthdate ) ? event.body.birthdate : user.birthdate)
            // @ts-ignore
            user.phone_number = (event.body.phone_number === null ) ? undefined : ((event.body.phone_number ) ? event.body.phone_number : user.phone_number)

            await this._insertOrUpdateDB(user, logData)

            const response = new CommonResponse(EnumResponses.OK_GENERIC_RESPONSE)
            response.setData(user)

            const diffTime = process.hrtime(startTime)
            const processedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
            logger.info(logData,`app.controller.updateUser: Finished in ${processedDiffTime} ms`, response.status_code)
            logger.debug(logData,'app.controller.updateUser', response)

            return Promise.resolve(response.toApiGatewayProxyResult())
        }
        catch (err:unknown) {
            const error:CommonResponse = <CommonResponse> err
            logger.error(logData,`app.controller.updateUser: Error`, error)
            return Promise.resolve(error.toApiGatewayProxyResult())
        }
    }
}