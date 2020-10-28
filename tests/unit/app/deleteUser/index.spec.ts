'use strict';
import Controller from "../../../../app/Controller"
import AWS, {AWSError} from 'aws-sdk'
import AWSMock from 'aws-sdk-mock';
import Dynamodb from "aws-sdk/clients/dynamodb"
import { config } from '../../../../config'
import {LogData} from '../../../../utils/log/classes/LogData';

describe('Controller tests for Controller.deleteUser service', () => {

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
            body: {}
        }

        logData = new LogData({
            method: '',
            path: '',
            from: ''
        })
    })

    it('KO, error from dynamodb.deleteItem', async (done) => {
        const deleteItemError:AWSError = {
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
        AWSMock.mock('DynamoDB', 'deleteItem', (params: Dynamodb.GetItemInput, callback: Function) => {
            expect(params).toEqual({
                Key: {
                    id: {
                        S: eventDummy.pathParameters.id
                    }
                },
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(deleteItemError)
        })

        try {
            const result =  await Controller.deleteUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 500,
                body: `{"description":"${deleteItemError.message}","internal_code":"GMB-0003"}`
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
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'deleteItem', (params: Dynamodb.GetItemInput, callback: Function) => {
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
            const result =  await Controller.deleteUser(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 204,
                body: '{"description":"No Content","internal_code":"GMB-0014"}'
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