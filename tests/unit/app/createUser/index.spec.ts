'use strict';
import Controller from "../../../../app/Controller"
import AWS, {AWSError} from 'aws-sdk'
import AWSMock from 'aws-sdk-mock';
import Dynamodb from "aws-sdk/clients/dynamodb"
import { config } from '../../../../config'
import {LogData} from '../../../../utils/log/classes/LogData';

describe('Controller tests for Controller.createUser service', () => {

    let eventDummy: any
    let logData:LogData

    beforeEach(() => {
        eventDummy = {
            httpMethod: '',
            path: '',
            headers: {
                'X-Forwarded-For': 'asdfghjk'
            },
            body: {
                given_name: "asdfghjkl",
                family_name: "qwertyuiop",
                email: "test@test.com"
            }
        }
        logData = new LogData({
            method: '',
            path: '',
            from: ''
        })
    })

    it('KO, error from dynamodb.putItem', async (done) => {
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
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: jasmine.any(String)},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        email: {S: eventDummy.body.email}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(putItemError)
        })

        try {
            const result =  await Controller.createUser(eventDummy, logData)
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

    });

    it('OK', async (done) => {
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: jasmine.any(String)},
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
            const result =  await Controller.createUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            const responseBody = JSON.parse(result.body)
            expect(result.statusCode).toBe(200)
            expect(responseBody).toEqual({
                description:"OK.",
                internal_code:"GMB-0005",
                data: {
                    id: jasmine.any(String)
                }
            })
            done();
        }
        catch(error) {
            AWSMock.restore('DynamoDB')
            expect(error).toBeUndefined()
            done();
        }

    })

    it('OK with optional attributes', async (done) => {
        eventDummy.body.birthdate = '1980-01-01'
        eventDummy.body.phone_number = '+34612345789'
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'putItem', (params: Dynamodb.PutItemInput, callback: Function) => {
            expect(params).toEqual({
                Item:
                    {
                        id: {S: jasmine.any(String)},
                        given_name: {S: eventDummy.body.given_name},
                        family_name: {S: eventDummy.body.family_name},
                        birthdate: {S: eventDummy.body.birthdate},
                        email: {S: eventDummy.body.email},
                        phone_number: {S: eventDummy.body.phone_number}
                    },
                ReturnConsumedCapacity: 'TOTAL',
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null)
        })
        try {
            const result =  await Controller.createUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            const responseBody = JSON.parse(result.body)
            expect(result.statusCode).toBe(200)
            expect(responseBody).toEqual({
                description:"OK.",
                internal_code:"GMB-0005",
                data: {
                    id: jasmine.any(String)
                }
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