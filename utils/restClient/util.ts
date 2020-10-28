import {LogData} from "../log/classes/LogData";
import * as logger from "../log";
import CommonResponse from "../responseHandler"
import {EnumResponses} from "../responseHandler/EnumResponses"
import {externalResponse} from "./index"
import {AxiosResponse} from "axios";

export default class RestClientUtil {
    constructor() {}

    public static commonErrorHandler(error:any, methodName:string, logData:LogData):Promise<externalResponse> {
        if (error.response) {
            return Promise.resolve({
                statusCode: error.response.status,
                body: error.response.data
            })
        }
        else if(error.request) {
            logger.error(logData, `utils.restConnector.${methodName}: No response received`)
            return Promise.reject(new CommonResponse(EnumResponses.GENERAL_ERROR))
        }
        else {
            logger.error(logData, `utils.restConnector.${methodName}: Error`, error)
            return Promise.reject(new CommonResponse(EnumResponses.GENERAL_ERROR))
        }
    }

    public static commonResponseLogger(startTime: [number, number], response:AxiosResponse, methodName:string, logData:LogData) {
        const diffTime = process.hrtime(startTime)
        const proccessedDiffTime = Math.round((diffTime[0] * 1e9 + diffTime[1]) / 1e6)
        logger.info(logData, `utils.restConnector.${methodName}: Response ${response.status} received in ${proccessedDiffTime} ms `)
        logger.debug(logData, `utils.restConnector.${methodName}: Body received`, response.data)
    }

    public static generateMirroredLogData(logData: LogData) {
        let mirroredLogData: LogData = new LogData(logData)
        let randomHex: string = (Math.random() * 0xfffffff * 10000000000).toString(16)
        mirroredLogData.uuid = `${logData.uuid}-${randomHex}`
        return mirroredLogData
    }
}