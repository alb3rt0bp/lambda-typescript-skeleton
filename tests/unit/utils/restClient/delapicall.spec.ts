'use strict';
import { delApiCall } from '../../../../utils/restClient'
import * as mockClient from 'request'
import {LogData} from "../../../../utils/log/classes/LogData";
import {CoreOptions, Request, RequestCallback} from "request";
import * as AWSLambda from "aws-lambda";

describe('Del Api Call', function () {
    let logData: LogData;

    beforeEach(function () {
        logData = new LogData({
            method: '',
            path: '',
            from: ''
        })
    });

    //**********************************************************************************************************//
    //***************************************** EXTERNAL FUNCTIONS *********************************************//
    //**********************************************************************************************************//

/*    it('Unexpected Error calling service', function (done) {
            spyOn(mockClient,'del').and.callFake(function(uri: string, options?: CoreOptions | undefined, callback?: RequestCallback | undefined): any {
                const response = <Response> {}
                return callback({hola: "hola"}, response, {})
            })

        let result = delApiCall("", {}, {'content-type': "application/x-www-form-urlencoded"}, logData);

        result.then(data => {
            expect(data).toBeNull();
            done();
        }).catch(error => {
            expect(error).toBeDefined();
            expect(typeof error).toBe('object');

            expect(error.status_code).toBe(500);
            expect(error.description).toBe('General Error.');
            expect(error.internal_code).toBe('RC-0003');
            done();
        });
    });

    it('KO parsing body', function (done) {
        requestlibMock = {
            del: jasmine.createSpy('del').and.callFake(function(params, callback) {
                callback(null, {statusCode: 200}, '{"message":aw}');
            })
        };

        service.__set__('requestlib', requestlibMock);

        let result = service.delApiCall("", "", {}, logData);

        result.then(data => {
            expect(data).toBeNull();
            done();
        }).catch(error => {
            expect(error).toBeDefined();

            expect(error.status_code).toBe(500);
            expect(error.description).toBe('General Error.');
            expect(error.internal_code).toBe('RC-0003');
            done();
        });
    });

    it('OK with body string', function (done) {
        requestlibMock = {
            del: jasmine.createSpy('del').and.callFake(function(params, callback) {
                callback(null, {statusCode: 200}, '{"message" : "OK"}');
            })
        };

        service.__set__('requestlib', requestlibMock);

        let result = service.delApiCall("", "", {}, logData);

        result.then(data => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data.statusCode).toBe(200);
            expect(data.body).toBeDefined();
            expect(typeof data.body).toBe('object');
            expect(data.body.message).toBe('OK');
            done();
        }).catch(error => {
            expect(error).toBeUndefined();
            done();
        });
    });

    it('OK with empty body string', function (done) {
        requestlibMock = {
            del: jasmine.createSpy('del').and.callFake(function(params, callback) {
                callback(null, {statusCode: 200}, '');
            })
        };

        service.__set__('requestlib', requestlibMock);

        let result = service.delApiCall("", "", {}, logData);

        result.then(data => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data.statusCode).toBe(200);
            expect(data.body).toBeDefined();
            expect(typeof data.body).toBe('object');
            expect(data.body).toEqual({});
            done();
        }).catch(error => {
            expect(error).toBeUndefined();
            done();
        });
    });

    it('OK', function (done) {
        requestlibMock = {
            del: jasmine.createSpy('del').and.callFake(function(params, callback) {
                callback(null, {statusCode: 200}, {message : "OK"});
            })
        };

        service.__set__('requestlib', requestlibMock);

        let result = service.delApiCall("", "", {}, logData);

        result.then(data => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data.statusCode).toBe(200);
            expect(data.body).toBeDefined();
            expect(typeof data.body).toBe('object');
            expect(data.body.message).toBe('OK');
            done();
        }).catch(error => {
            expect(error).toBeUndefined();
            done();
        });
    });

    it('OK, having undefined headers', function (done) {
        requestlibMock = {
            del: jasmine.createSpy('del').and.callFake(function(params, callback) {
                callback(null, {statusCode: 200}, {message : "OK"});
            })
        };

        service.__set__('requestlib', requestlibMock);

        let result = service.delApiCall("", "", undefined, logData);

        result.then(data => {
            expect(data).toBeDefined();
            expect(typeof data).toBe('object');
            expect(data.statusCode).toBe(200);
            expect(data.body).toBeDefined();
            expect(typeof data.body).toBe('object');
            expect(data.body.message).toBe('OK');
            done();
        }).catch(error => {
            expect(error).toBeUndefined();
            done();
        });
    });*/
});