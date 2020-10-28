'use strict'
import { putFormDataApiCall, externalResponse } from '../../../../utils/restClient'
import axios, {AxiosRequestConfig} from 'axios'
import {LogData} from "../../../../utils/log/classes/LogData"
import CommonResponse from "../../../../utils/responseHandler"
import {EnumResponses} from "../../../../utils/responseHandler/EnumResponses"
import FormData from 'form-data'

describe('Put FormData API Call', function () {
    let logData: LogData,
        formData: FormData

    beforeEach(function () {
        formData = new FormData()
        formData.append('hellow', 'World!')
        logData = new LogData({
            method: '',
            path: '',
            from: ''
        })

    })

    //**********************************************************************************************************//
    //***************************************** EXTERNAL FUNCTIONS *********************************************//
    //**********************************************************************************************************//

    it('KO, Unexpected Error calling service', function (done) {

        spyOn(axios,'put').and.callFake(function(url:string, form: FormData, config: AxiosRequestConfig | undefined): Promise<any>{
            expect(url).toBe("")
            expect(config).toEqual({
                headers: {
                    'x-unique-transactionid': jasmine.any(String),
                    'x-this-is': "a test"
                }
            })
            expect(formData).toEqual(formData)

            return Promise.reject({hola: "hola"})
        })

        let result = putFormDataApiCall("", formData, {'x-this-is': "a test"}, logData)

        result.then((data:externalResponse) => {
            expect(data).not.toBeDefined()
            done()
        }).catch((error:CommonResponse) => {

            expect(error).toBeDefined()
            expect(error).toEqual(new CommonResponse(EnumResponses.GENERAL_ERROR))
            done()
        })
    })

    it('KO, No response from Server', function (done) {

        spyOn(axios,'put').and.callFake(function(url:string, form: FormData, config: AxiosRequestConfig | undefined): Promise<any> {
            expect(url).toBe("")
            expect(config).toEqual({
                headers: {
                    'x-unique-transactionid': jasmine.any(String),
                    'x-this-is': "a test"
                }
            })

            return Promise.reject({hola: "hola", request: {}})
        })

        let result = putFormDataApiCall("", formData, {'x-this-is': "a test"}, logData)

        result.then((data:externalResponse) => {
            expect(data).not.toBeDefined()
            done()
        }).catch((error:CommonResponse) => {
            expect(error).toBeDefined()
            expect(error).toEqual(new CommonResponse(EnumResponses.GENERAL_ERROR))
            done()
        })
    })

    it('OK, Server answered with with error', function (done) {

        spyOn(axios,'put').and.callFake(function(url:string, form: FormData, config: AxiosRequestConfig | undefined): Promise<any> {
            expect(url).toBe("")
            expect(config).toEqual({
                headers: {
                    'x-unique-transactionid': jasmine.any(String),
                    'x-this-is': "a test"
                }
            })

            return Promise.reject({
                request: {}, response: {
                    status: 500,
                    data: {error: "this is an error"}
                }
            })
        })

        let result = putFormDataApiCall("", formData, {'x-this-is': "a test"}, logData)

        result.then((data:externalResponse) => {
            expect(data).toBeDefined()
            expect(data).toEqual({
                statusCode: 500,
                body: {error: "this is an error"}
            })
            done()
        }).catch((error:CommonResponse) => {
            expect(error).not.toBeDefined()
            done()
        })
    })

    it('OK', function (done) {

        spyOn(axios,'put').and.callFake(function(url:string, form: FormData, config: AxiosRequestConfig | undefined): Promise<any> {
            expect(url).toBe("")
            expect(config).toEqual({
                headers: {
                    'x-unique-transactionid': jasmine.any(String),
                    'x-this-is': "a test"
                }
            })

            return Promise.resolve({
                status: 200,
                data: {hello: "World"}
            })
        })

        let result = putFormDataApiCall("", formData, {'x-this-is': "a test"}, logData)

        result.then((data:externalResponse) => {
            expect(data).toBeDefined()
            expect(data).toEqual({
                statusCode: 200,
                body: {hello: "World"}
            })
            done()
        }).catch((error:CommonResponse) => {
            expect(error).not.toBeDefined()
            done()
        })
    })

    it('OK with no headers', function (done) {

        spyOn(axios,'put').and.callFake(function(url:string, form: FormData, config: AxiosRequestConfig | undefined): Promise<any> {
            expect(url).toBe("")
            expect(config).toEqual({
                headers: {
                    'x-unique-transactionid': jasmine.any(String)
                }
            })

            return Promise.resolve({
                status: 200,
                data: {hello: "World"}
            })
        })

        let result = putFormDataApiCall("", formData, undefined, logData)

        result.then((data:externalResponse) => {
            expect(data).toBeDefined()
            expect(data).toEqual({
                statusCode: 200,
                body: {hello: "World"}
            })
            done()
        }).catch((error:CommonResponse) => {
            expect(error).not.toBeDefined()
            done()
        })
    })
})