'use strict';
import { updateUser } from "../../../../app/controller"
import AWS, {AWSError} from 'aws-sdk'
import AWSMock from 'aws-sdk-mock';
import Dynamodb from "aws-sdk/clients/dynamodb"
import { config } from '../../../../config'
import {LogData} from '../../../../utils/log/classes/LogData';

describe('Controller tests for updateUser service', () => {

    let eventDummy: any
    let logData:LogData

    beforeEach(() => {
        eventDummy = {
            httpMethod: '',
            path: '',
            pathParameters: {
                id: 'd5586fa7-98be-4faa-8d94-9e5c99708972'
            },
            headers: {
                'X-Forwarded-For': 'asdfghjk'
            },
            body: {
                given_name: "asdfghjkl2",
                family_name: "qwertyuiop2",
                email: "test2@test.com"
            }
        }

        logData = new LogData({
            method: '',
            path: '',
            from: ''
        })
    })

    it('KO, error from dynamodb.getItem', async (done) => {
        const getItemError:AWSError = {
            name: "ResourceNotFoundException",
            stack: "",
            cfId: "",
            extendedRequestId: "extended-DDIFT9472Q8VILCBK35U51T9IBVV4KQNSO5AEMVJF66Q9ASUAAJG",
            region: "eu-west-1",
            time: new Date(),
            message: 'Requested resource not found',
            code: 'ResourceNotFoundException',
            requestId: 'DDIFT9472Q8VILCBK35U51T9IBVV4KQNSO5AEMVJF66Q9ASUAAJG',
            statusCode: 400,
            retryable: false,
            retryDelay: 26.986982316285935,
            hostname: 'localhost'
        }

        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(getItemError)
        })

        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 500,
                body: `{"description":"${getItemError.message}","internal_code":"GMB-0003"}`
            })
            done()
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }

    })

    it('KO, User not found', async (done) => {
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, {})
        })
        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 404,
                body: JSON.stringify({
                    description: "Object not found.",
                    internal_code: "GMB-0004"
                })
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }
    })

    it('KO, error from dynamodb.putItem', async (done) => {
        const userDummy = JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/getItem.json')))
        const putItemError:AWSError = {
            name: "ResourceNotFoundException",
            stack: "",
            cfId: "",
            extendedRequestId: "extended-DDIFT9472Q8VILCBK35U51T9IBVV4KQNSO5AEMVJF66Q9ASUAAJG",
            region: "eu-west-1",
            time: new Date(),
            message: 'Requested resource not found',
            code: 'ResourceNotFoundException',
            requestId: 'DDIFT9472Q8VILCBK35U51T9IBVV4KQNSO5AEMVJF66Q9ASUAAJG',
            statusCode: 400,
            retryable: false,
            retryDelay: 26.986982316285935,
            hostname: 'localhost'
        }

        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(userDummy)))
        })

        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: userDummy.Item.id.S},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        email: {S: eventDummy.body.email},
                        birthdate: {S: userDummy.Item.birthdate.S},
                        phone_number: {S: userDummy.Item.phone_number.S}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(putItemError)
        })

        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 500,
                body: `{"description":"${putItemError.message}","internal_code":"GMB-0003"}`
            })
            done()
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }

    })

    it('OK', async (done) => {
        const userDummy = JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/getItem.json')))
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(userDummy)))
        })
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: userDummy.Item.id.S},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        email: {S: eventDummy.body.email},
                        birthdate: {S: userDummy.Item.birthdate.S},
                        phone_number: {S: userDummy.Item.phone_number.S}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null)
        })
        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: {
                        id: userDummy.Item.id.S,
                        given_name: eventDummy.body.given_name,
                        family_name: eventDummy.body.family_name,
                        birthdate: userDummy.Item.birthdate.S,
                        email: eventDummy.body.email,
                        phone_number: userDummy.Item.phone_number.S
                    }
                })
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }
    })

    it('OK, with optional attributes', async (done) => {
        const userDummy = JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/getItem.json')))
        eventDummy.body.phone_number = "123456789"
        eventDummy.body.birthdate = "1955-01-01"
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(userDummy)))
        })
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: userDummy.Item.id.S},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        email: {S: eventDummy.body.email},
                        birthdate: {S: eventDummy.body.birthdate},
                        phone_number: {S: eventDummy.body.phone_number}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null)
        })
        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: {
                        id: userDummy.Item.id.S,
                        given_name: eventDummy.body.given_name,
                        family_name: eventDummy.body.family_name,
                        birthdate: eventDummy.body.birthdate,
                        email: eventDummy.body.email,
                        phone_number: eventDummy.body.phone_number
                    }
                })
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }
    })

    it('OK, remove optional params from DB', async (done) => {
        const userDummy = JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/getItem.json')))
        eventDummy.body.phone_number = null
        eventDummy.body.birthdate = null
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(userDummy)))
        })
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: userDummy.Item.id.S},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        email: {S: eventDummy.body.email}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null)
        })
        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: {
                        id: userDummy.Item.id.S,
                        given_name: eventDummy.body.given_name,
                        family_name: eventDummy.body.family_name,
                        email: eventDummy.body.email
                    }
                })
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }
    })

    it('OK, update only optional attributes', async (done) => {
        const userDummy = JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/getItem.json')))
        delete eventDummy.body.given_name
        delete eventDummy.body.family_name
        delete eventDummy.body.email
        eventDummy.body.phone_number = "123456789"
        eventDummy.body.birthdate = "1955-01-01"
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'getItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(userDummy)))
        })
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: userDummy.Item.id.S},
                        given_name: { S: userDummy.Item.given_name.S },
                        family_name: { S: userDummy.Item.family_name.S },
                        birthdate: { S: eventDummy.body.birthdate },
                        email: { S: userDummy.Item.email.S },
                        phone_number: { S: eventDummy.body.phone_number }
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null)
        })
        try {
            const result =  await updateUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: {
                        id: userDummy.Item.id.S,
                        given_name: userDummy.Item.given_name.S,
                        family_name: userDummy.Item.family_name.S,
                        birthdate: eventDummy.body.birthdate,
                        email: userDummy.Item.email.S,
                        phone_number: eventDummy.body.phone_number
                    }
                })
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }
    })
})