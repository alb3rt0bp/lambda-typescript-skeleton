'use strict';
import * as component from "../../../index";
import * as controller from "../../../app/controller";
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
            body: {}
        };
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
        spyOn(controller, 'listUsers').and.callFake((event:AWSLambda.APIGatewayEvent, logData:LogData) => {
            return Promise.resolve({
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
        });
        try {
            const result =  await component.listUsers(eventDummy, {} as AWSLambda.Context, null as unknown as AWSLambda.Callback);
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
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            expect(controller.listUsers).toHaveBeenCalled();
            done();
        }
        catch(error) {
            expect(error).toBeUndefined();
            done();
        }

    });


});