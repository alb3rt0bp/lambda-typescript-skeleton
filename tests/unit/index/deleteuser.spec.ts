'use strict';
import * as component from '../../../index';
import Controller from '../../../app/Controller';
import * as AWSLambda from 'aws-lambda'
import {LogData} from '../../../utils/log/classes/LogData';

describe('Index tests and input validations for deleteUser service', () => {

    let eventDummy:any;

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
        };
    });

    //****************************************************************************************************************//
    //******************************************** INPUT VALIDATIONS *************************************************//
    //****************************************************************************************************************//

    //pathparameters.id
    it('KO, missing id', async (done) => {
        delete eventDummy.pathParameters.id
        try {
            const result =  await component.deleteUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    description: 'Bad request.',
                    internal_code: 'GMB-0002',
                    data: [{
                        keyword: 'required',
                        dataPath: '/pathParameters',
                        schemaPath: '#/properties/pathParameters/required',
                        params: {'missingProperty': 'id'},
                        message: 'should have required property id'
                    }]
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });

    it('KO, id is empty', async (done) => {
        eventDummy.pathParameters.id = '';
        try {
            const result =  await component.deleteUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    description: 'Bad request.',
                    internal_code: 'GMB-0002',
                    data: [{
                        keyword: 'minLength',
                        dataPath: '/pathParameters/id',
                        schemaPath: '#/properties/pathParameters/properties/id/minLength',
                        params: {'limit': 36},
                        message: 'should not be shorter than 36 characters'
                    }, {
                        keyword: 'pattern',
                        dataPath: '/pathParameters/id',
                        schemaPath: '#/properties/pathParameters/properties/id/pattern',
                        params: {'pattern': '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$'},
                        message: 'should match pattern "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$"'
                    }]
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });

    it('KO, id is longer than expected', async (done) => {
        eventDummy.pathParameters.id = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.deleteUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    description: 'Bad request.',
                    internal_code: 'GMB-0002',
                    data: [{
                        'keyword': 'maxLength',
                        'dataPath': '/pathParameters/id',
                        'schemaPath': '#/properties/pathParameters/properties/id/maxLength',
                        'params': {'limit': 36},
                        'message': 'should not be longer than 36 characters'
                    }, {
                        'keyword': 'pattern',
                        'dataPath': '/pathParameters/id',
                        'schemaPath': '#/properties/pathParameters/properties/id/pattern',
                        'params': {'pattern': '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$'},
                        'message': 'should match pattern "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$"'
                    }]
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });

    it('KO, id is not stringifiable', async (done) => {
        eventDummy.pathParameters.id = {};
        try {
            const result =  await component.deleteUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    description: 'Bad request.',
                    internal_code: 'GMB-0002',
                    data: [{
                        keyword: 'type',
                        dataPath: '/pathParameters/id',
                        schemaPath: '#/properties/pathParameters/properties/id/type',
                        params: {'type':'string'},
                        message: 'should be string'
                    }]
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });

    //****************************************************************************************************************//
    //*********************************************** HAPPY PATH *****************************************************//
    //****************************************************************************************************************//

    it('OK', async (done) => {
        /*When spying a class use class.Prototype. For instance:
             controller:
             const plaid = require('plaid');
             const plaid = new Plaid.Client()

             test:
             const plaid = require('plaid');
             spyOn(plaid.Client.prototype, 'createLinkToken').and.callFake.....
         */
        spyOn(Controller, 'deleteUser').and.callFake((event:AWSLambda.APIGatewayEvent, logData:LogData) => {
            return Promise.resolve({
                statusCode: 204,
                body: '{"description":"No Content","internal_code":"GMB-0014"}'
            })
        });

        try {
            const result =  await component.deleteUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 204,
                body: '{"description":"No Content","internal_code":"GMB-0014"}',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            expect(Controller.deleteUser).toHaveBeenCalled();
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });


});