import querystring from 'querystring'
import axios from 'axios'
import {AxiosResponse} from 'axios'
import * as logger from '../../utils/log'
import {LogData} from "../log/classes/LogData"
import FormData from 'form-data'
import RestClientUtil from "./util"

export interface externalResponse {
    statusCode: number,
    body: Object|Buffer,
    headers?: Object
}

export function getApiCall (urlRequest:string, queryParams: (any|undefined), headers: (any|undefined), logData: LogData):Promise<externalResponse> {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        params: querystring.stringify(queryParams),
        headers
    }

    return axios.get(urlRequest, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'getApiCall', mirroredLogData)

            if(response.headers && response.headers['content-type'] && response.headers['content-type'].indexOf('image/')>= 0) {
                return Promise.resolve({
                    body: Buffer.from(response.data, 'utf8'),
                    headers: response.headers,
                    statusCode: response.status
                })
            }
            else {
                return Promise.resolve({
                    statusCode: response.status,
                    body: response.data
                })
            }
        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'getApiCall', mirroredLogData)
        })
}

export function postApiCall (urlRequest: string, jsonRequest: object, headers: (any|undefined), queryParams: (any|undefined), logData: LogData):Promise<externalResponse> {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {"content-type": "application/json"}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        params: querystring.stringify(queryParams),
        headers,
        data: jsonRequest
    }

    logger.info(mirroredLogData, "utils.restConnector.postApiCall: Calling URL POST ", urlRequest)
    logger.debug(mirroredLogData, "utils.restConnector.postApiCall: JSON Request ", jsonRequest)
    logger.debug(mirroredLogData, "utils.restConnector.postApiCall: Headers ", headers)
    logger.debug(mirroredLogData, "utils.restConnector.postApiCall: Query Params ", queryParams)

    return axios.post(urlRequest, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'postApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'postApiCall', mirroredLogData)
        })
}

export function putApiCall (urlRequest: string, jsonRequest: object, headers: (any|undefined), logData: LogData):Promise<externalResponse> {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {"content-type": "application/json"}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        headers,
        data: jsonRequest
    }

    logger.info(mirroredLogData, "utils.restConnector.putApiCall: Calling URL POST ", urlRequest)
    logger.debug(mirroredLogData, "utils.restConnector.putApiCall: JSON Request ", jsonRequest)
    logger.debug(mirroredLogData, "utils.restConnector.putApiCall: Headers ", headers)

    return axios.put(urlRequest, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'putApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'putApiCall', mirroredLogData)
        })
}

export function patchApiCall (urlRequest: string, jsonRequest: object, headers: (any|undefined), logData: LogData):Promise<externalResponse> {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {"content-type": "application/json"}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        headers,
        data: jsonRequest
    }

    logger.info(mirroredLogData, "utils.restConnector.patchApiCall: Calling URL POST ", urlRequest)
    logger.debug(mirroredLogData, "utils.restConnector.patchApiCall: JSON Request ", jsonRequest)
    logger.debug(mirroredLogData, "utils.restConnector.patchApiCall: Headers ", headers)

    return axios.patch(urlRequest, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'patchApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'patchApiCall', mirroredLogData)
        })
}

export function delApiCall (urlRequest:string, queryParams: (any|undefined), headers: (any|undefined), logData: LogData):Promise<externalResponse> {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        params: querystring.stringify(queryParams),
        headers
    }

    return axios.delete(urlRequest, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'delApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'delApiCall', mirroredLogData)
        })
}

export function postFormDataApiCall(urlRequest: string, formData: FormData, headers: (any|undefined), logData: LogData) {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        headers
    }

    /**
     * Usage of FormData:
     * const form = new FormData()
     * form.append('my_field', 'my value')
     * form.append('my_buffer', new Buffer(10))
     * form.append('my_file', fs.createReadStream('/foo/bar.jpg'))
     */

    logger.info(mirroredLogData, "utils.restConnector.postFormDataApiCall: Calling URL POST ", urlRequest)
    logger.debug(mirroredLogData, "utils.restConnector.postFormDataApiCall: Headers ", headers)

    return axios.post(urlRequest, formData, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'postFormDataApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'postFormDataApiCall', mirroredLogData)
        })
}

export function putFormDataApiCall(urlRequest: string, formData: FormData, headers: (any|undefined), logData: LogData) {
    //Create a sibling logData object to properly trace API call
    let mirroredLogData: LogData = RestClientUtil.generateMirroredLogData(logData)

    if(!headers) {
        headers = {}
    }
    headers['x-unique-transactionid'] = logData.uuid

    const startTime = process.hrtime()

    const config = {
        headers
    }

    /**
     * Usage of FormData:
     * const form = new FormData()
     * form.append('my_field', 'my value')
     * form.append('my_buffer', new Buffer(10))
     * form.append('my_file', fs.createReadStream('/foo/bar.jpg'))
     */

    logger.info(mirroredLogData, "utils.restConnector.putFormDataApiCall: Calling URL POST ", urlRequest)
    logger.debug(mirroredLogData, "utils.restConnector.putFormDataApiCall: Headers ", headers)

    return axios.put(urlRequest, formData, config)
        .then((response:AxiosResponse) => {
            RestClientUtil.commonResponseLogger(startTime, response, 'putFormDataApiCall', mirroredLogData)

            return Promise.resolve({
                statusCode: response.status,
                body: response.data
            })

        })
        .catch((error:any) => {
            return RestClientUtil.commonErrorHandler(error, 'putFormDataApiCall', mirroredLogData)
        })
}

/*
export function genericPostApiCall(url: string, options: CoreOptions, logData: LogData) {
    let logDataBis = Object.assign({}, logData)
    let randomHex = (Math.random() * 0xfffffff * 10000000000).toString(16)
    logDataBis.uuid = logData.uuid + " " + randomHex
    return new Promise(function (resolve, reject) {
        const startTime = process.hrtime()
        if(!options.headers) {
            options.headers = {}
        }
        options.method = 'POST'
        options.headers['x-unique-transactionid'] = logData.uuid
        logger.info(logDataBis, "utils.restConnector.genericPostApiCall: Calling URL POST " + url)
        logger.debug(logDataBis, "utils.restConnector.genericPostApiCall: Headers ", options.headers)

        client.post(url, options, function (error: any, response: Response, body: any) {
            if(error) {
                logger.error(logDataBis, "utils.restConnector.genericPostApiCall: Error ", error)
                reject(responses.GENERAL_ERROR.clone())
            }
            else {
                _responseParseManager(body,response.statusCode, logDataBis, resolve, reject, startTime)
            }
        })
    })
}*/