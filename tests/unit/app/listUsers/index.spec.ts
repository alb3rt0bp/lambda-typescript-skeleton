'use strict';
import Controller from "../../../../app/Controller"
import AWS, {AWSError} from 'aws-sdk'
import AWSMock from 'aws-sdk-mock';
import Dynamodb from "aws-sdk/clients/dynamodb"
import { config } from '../../../../config'
import {LogData} from '../../../../utils/log/classes/LogData';

describe('Controller tests for Controller.listUsers service', () => {

    let eventDummy: any
    let logData:LogData

    beforeEach(() => {
        eventDummy = {
            httpMethod: '',
            path: '',
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

    it('KO, error from dynamodb.scan', async (done) => {
        const scanError:AWSError = {
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
        AWSMock.mock('DynamoDB', 'scan', (params: Dynamodb.ScanInput, callback: Function) => {
            expect(params).toEqual({
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(scanError)
        })

        try {
            const result =  await Controller.listUsers(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 500,
                body: `{"description":"${scanError.message}","internal_code":"GMB-0003"}`
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
        AWSMock.mock('DynamoDB', 'scan', (params: Dynamodb.ScanInput, callback: Function) => {
            expect(params).toEqual({
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, JSON.parse(JSON.stringify(require('../../dummies/dynamodb/Users/scan.json'))))
        })
        try {
            const result =  await Controller.listUsers(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: [{
                        id: "246d480b-75c4-4220-8ec0-29f69704f61d",
                        given_name: "Silene",
                        family_name: "Oliveira",
                        birthdate: "1980-01-01",
                        email: "silene.oliveira@example.com",
                        phone_number: "+34612345789"
                    }, {
                        id: "246d480b-75c4-4220-8ec0-29f69704f61d",
                        given_name: "Andrés",
                        family_name: "De Fonollosa",
                        birthdate: "1971-01-01",
                        email: "andres.defonollosa@example.com",
                        phone_number: "+34612345789"
                    }, {
                        id: "246d480b-75c4-4220-8ec0-29f69704f61d",
                        given_name: "Ágata",
                        family_name: "Jiménez",
                        birthdate: "1981-01-01",
                        email: "agata.jimenez@example.com",
                        phone_number: "+34612345789"
                    }]
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

    it('OK with empty Users list', async (done) => {
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'scan', (params: Dynamodb.ScanInput, callback: Function) => {
            expect(params).toEqual({
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, {Items:[],Count:0,ScannedCount:0})
        })
        try {
            const result =  await Controller.listUsers(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: []
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

    /*
     * According to DynamoDB.ScanOutput Interface, items can be undefined
     * DynamoDB.ScanOutput.Items?: AWS.DynamoDB.ItemList | undefined
     * This test is only to suppress TS warning
     */
    it('OK with possible undefined Items in scan response', async (done) => {
        AWSMock.setSDKInstance(AWS)
        AWSMock.mock('DynamoDB', 'scan', (params: Dynamodb.ScanInput, callback: Function) => {
            expect(params).toEqual({
                TableName: config.aws.dynamodb.tableName
            })
            expect(callback).toEqual(jasmine.any(Function))
            callback(null, {Count:0,ScannedCount:0})
        })
        try {
            const result =  await Controller.listUsers(eventDummy, logData)
            AWSMock.restore('DynamoDB')
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify({
                    description: "OK.",
                    internal_code: "GMB-0005",
                    data: []
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