'use strict';
import * as component from "../../../index";
import Controller from "../../../app/Controller";
import * as AWSLambda from 'aws-lambda'
import {LogData} from "../../../utils/log/classes/LogData";

describe('Index tests and input validations for createUser service', () => {

    let eventDummy:any;

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
        };
    });

    //****************************************************************************************************************//
    //******************************************** INPUT VALIDATIONS *************************************************//
    //****************************************************************************************************************//

    //body.given_name
    it('KO, missing given_name', async (done) => {
        delete eventDummy.body.given_name
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "required",
                        "dataPath": "/body",
                        "schemaPath": "#/properties/body/required",
                        "params": {"missingProperty": "given_name"},
                        "message": "should have required property given_name"
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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

    //body.family_name
    it('KO, missing family_name', async (done) => {
        delete eventDummy.body.family_name
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "required",
                        "dataPath": "/body",
                        "schemaPath": "#/properties/body/required",
                        "params": {"missingProperty": "family_name"},
                        "message": "should have required property family_name"
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/maxLength",
                        "params": {"limit": 10},
                        "message": "should not be longer than 10 characters"
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

    it('KO, birthdate is not stringifiable', async (done) => {
        eventDummy.body.birthdate = {};
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/birthdate",
                        "schemaPath": "#/properties/body/properties/birthdate/type",
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

    it('KO, birthdate does not match with date format', async (done) => {
        eventDummy.body.birthdate = 'aaaaaa';
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
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

    //body.email
    it('KO, missing email', async (done) => {
        delete eventDummy.body.email
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "required",
                        "dataPath": "/body",
                        "schemaPath": "#/properties/body/required",
                        "params": {"missingProperty": "email"},
                        "message": "should have required property email"
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
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

    //body.phone_number
    it('KO, phone_number is empty', async (done) => {
        eventDummy.body.phone_number = '';
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "minLength",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/minLength",
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

    it('KO, phone_number is longer than expected', async (done) => {
        eventDummy.body.phone_number = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "maxLength",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/maxLength",
                        "params": {"limit": 12},
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
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 400,
                body: JSON.stringify({
                    "description": "Bad request.",
                    "internal_code": "GMB-0002",
                    "data": [{
                        "keyword": "type",
                        "dataPath": "/body/phone_number",
                        "schemaPath": "#/properties/body/properties/phone_number/type",
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
        spyOn(Controller, 'createUser').and.callFake((event:AWSLambda.APIGatewayEvent, logData:LogData) => {
            return Promise.resolve({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}'
            })
        });
        try {
            const result =  await component.createUser(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
            expect(result).toEqual({
                statusCode: 200,
                body: '{"description":"OK.","internal_code":"GMB-0005"}',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            expect(Controller.createUser).toHaveBeenCalled();
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });


});