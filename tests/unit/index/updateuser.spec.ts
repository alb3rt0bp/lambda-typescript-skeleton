'use strict';
import * as component from "../../../index";
import * as controller from "../../../app/controller";
import * as AWSLambda from 'aws-lambda'
import {LogData} from "../../../utils/log/classes/LogData";

describe('Index tests and input validations for updateUser service', () => {

    let eventDummy:any;

    beforeEach(() => {
        eventDummy = {
            httpMethod: '',
            path: '',
            headers: {
                'X-Forwarded-For': 'asdfghjk'
            },
            pathParameters: {
                id: 'd5586fa7-98be-4faa-8d94-9e5c99708972'
            },body: {
                given_name: "asdfghjkl",
                family_name: "qwertyuiop",
                email: "test@test.com"
            }
        };
    });

    //****************************************************************************************************************//
    //******************************************** INPUT VALIDATIONS *************************************************//
    //****************************************************************************************************************//

    //pathparameters.id
    it('KO, missing given_name', async (done) => {
        delete eventDummy.pathParameters.id
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
    
    it('KO, given_name is empty', async (done) => {
        eventDummy.body.given_name = '';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/given_name",
                        "schemaPath": "#/properties/body/properties/given_name/minLength",
                        "params": {"limit": 1},
                        "message": "should not be shorter than 1 character"
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

    it('KO, given_name is longer than expected', async (done) => {
        eventDummy.body.given_name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/given_name",
                        "schemaPath": "#/properties/body/properties/given_name/maxLength",
                        "params": {"limit": 30},
                        "message": "should not be longer than 30 characters"
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

    it('KO, given_name is not stringifiable', async (done) => {
        eventDummy.body.given_name = {};
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/given_name",
                        "schemaPath": "#/properties/body/properties/given_name/type",
                        "params": {"type":"string"},
                        "message": "should be string"
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

    it('KO, family_name is empty', async (done) => {
        eventDummy.body.family_name = '';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/family_name",
                        "schemaPath": "#/properties/body/properties/family_name/minLength",
                        "params": {"limit": 1},
                        "message": "should not be shorter than 1 character"
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

    it('KO, family_name is longer than expected', async (done) => {
        eventDummy.body.family_name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/family_name",
                        "schemaPath": "#/properties/body/properties/family_name/maxLength",
                        "params": {"limit": 50},
                        "message": "should not be longer than 50 characters"
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

    it('KO, family_name is not stringifiable', async (done) => {
        eventDummy.body.family_name = {};
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/family_name",
                        "schemaPath": "#/properties/body/properties/family_name/type",
                        "params": {"type":"string"},
                        "message": "should be string"
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

    //body.birthdate
    it('KO, birthdate is empty', async (done) => {
        eventDummy.body.birthdate = '';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/minLength",
                        "params": {"limit": 1},
                        "message": "should not be shorter than 1 character"
                    }, {
                        "keyword": "format",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/format",
                        "params": {"format": "date"},
                        "message": "should match format \"date\""
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

    it('KO, birthdate is longer than expected', async (done) => {
        eventDummy.body.birthdate = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/maxLength",
                        "params": {
                            "limit": 10
                        },
                        "message": "should not be longer than 10 characters"
                    }, {
                        "keyword": "format",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/format",
                        "params": {
                            "format": "date"
                        },
                        "message": "should match format \"date\""
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

    it('KO, birthdate is not stringifiable', async (done) => {
        eventDummy.body.birthdate = {};
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/type",
                        "params": {
                            "type": "string,null"
                        },
                        "message": "should be string,null"
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

    it('KO, birthdate does not match with date format', async (done) => {
        eventDummy.body.birthdate = 'aaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "format",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/format",
                        "params": {
                            "format": "date"
                        },
                        "message": "should match format \"date\""
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

    it('KO, email is empty', async (done) => {
        eventDummy.body.email = '';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/minLength",
                        "params": {"limit": 1},
                        "message": "should not be shorter than 1 character"
                    }, {
                        "keyword": "format",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/format",
                        "params": {"format": "email"},
                        "message": "should match format \"email\""
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

    it('KO, email is longer than expected', async (done) => {
        eventDummy.body.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/maxLength",
                        "params": {"limit": 75},
                        "message": "should not be longer than 75 characters"
                    }, {
                        "keyword": "format",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/format",
                        "params": {"format": "email"},
                        "message": "should match format \"email\""
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

    it('KO, email is not stringifiable', async (done) => {
        eventDummy.body.email = {};
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/type",
                        "params": {"type":"string"},
                        "message": "should be string"
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

    it('KO, email does not match with email format', async (done) => {
        eventDummy.body.email = 'aaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "format",
                        "dataPath": "/body/email",
                        "schemaPath": "#/properties/body/properties/email/format",
                        "params": {
                            "format": "email"
                        },
                        "message": "should match format \"email\""
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

    //body.phone_number
    it('KO, phone_number is empty', async (done) => {
        eventDummy.body.phone_number = '';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/minLength",
                        "params": {
                            "limit": 1
                        },
                        "message": "should not be shorter than 1 character"
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

    it('KO, phone_number is longer than expected', async (done) => {
        eventDummy.body.phone_number = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/maxLength",
                        "params": {
                            "limit": 12
                        },
                        "message": "should not be longer than 12 characters"
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

    it('KO, phone_number is not stringifiable', async (done) => {
        eventDummy.body.phone_number = {};
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/type",
                        "params": {
                            "type": "string,null"
                        },
                        "message": "should be string,null"
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
        spyOn(controller, 'updateUser').and.callFake((event:AWSLambda.APIGatewayEvent, logData:LogData) => {
            return Promise.resolve({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}'
            })
        });
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            expect(controller.updateUser).toHaveBeenCalled();
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });

    it('OK, having optional params with null values', async (done) => {
        eventDummy.body.birthdate = null
        eventDummy.body.phone_number = null
        /*When spying a class use class.Prototype. For instance:
             controller:
             const plaid = require('plaid');
             const plaid = new Plaid.Client()

             test:
             const plaid = require('plaid');
             spyOn(plaid.Client.prototype, 'createLinkToken').and.callFake.....
         */
        spyOn(controller, 'updateUser').and.callFake((event:AWSLambda.APIGatewayEvent, logData:LogData) => {
            return Promise.resolve({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}'
            })
        });
        try {
            const result =  await component.updateUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            expect(controller.updateUser).toHaveBeenCalled();
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });


});