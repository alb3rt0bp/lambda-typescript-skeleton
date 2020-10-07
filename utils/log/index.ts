import * as winston from 'winston'
import * as fs from 'fs'
import * as util from 'util'
import { LogData } from './classes/LogData'
const { printf } = winston.format

let hostname        = ""
let applicationName = ""
const consoleLog = 'console'
const fileLog = 'fileLog'

const w:any = {}

const covaultCustomFormat = printf(({ level, message}:any) => {
    return `${level}: ${message}`
})

export { silly, debug, info, error, warn }

//********************************************************************************************************************//
//******************************************* TRANSPORTS MANAGEMENT **************************************************//
//********************************************************************************************************************//

const addConsoleTransport = (level: string) => {
    w[consoleLog] = winston.createLogger({
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            verbose: 4,
            debug: 5,
            silly: 6
        }
    })

    w[consoleLog].add(new winston.transports.Console({
        level: level,
        silent: false,
        format: covaultCustomFormat
    }))
}

const addFileTransport = (conf:any) => {
    w[fileLog] = winston.createLogger({
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            verbose: 4,
            debug: 5,
            silly: 6
        }
    })

    w[fileLog].add(new winston.transports.File({
        level: conf.level,
        silent: false,
        filename: conf.filename,
        maxsize: 1000,
        maxFiles: 1,
    }))
}

const createLogPath = (logPath:string) => {
    if(!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath)
    }
    return logPath
}

/**
 * Finds if given transport name is already created
 * @param {string} transportName
 * @returns {boolean}
 */
const findTransportByName = (transportName:string) => {
    const transports = Object.keys(w)
    return Boolean(transports.find(transport => {
        return (transport === transportName)
    }))
}

//********************************************************************************************************************//
//*********************************************** INITIALIZATION *****************************************************//
//********************************************************************************************************************//

/**
 * @param {string} host
 * @param {string} appName
 * @param {string} logLevel
 * @param {object} [additionalConfig] - Optional. Contains configuration to add additional transports than Consele
 * @param {object} [additionalConfig.file] - Optional. Object containing configuration for logging to a file
 * @param {object} additionalConfig.file.name - Name for the file that will contain the logs
 * @param {object} additionalConfig.file.path - Full path in current system where file logs will be located
 * @param {object} [additionalConfig.cloudWatch] - Optional. Object containing configuration for logging to a file
 * @param {object} additionalConfig.cloudWatch.region - AWS Region where Log Group is going to be located
 * @param {object} additionalConfig.cloudWatch.logGroupName - Name of AWS CloudWatch Log Group where logs are going to be located
 * @param {object} additionalConfig.cloudWatch.logStreamName - Specifies the name of AWS CloudWatch Log Stream withing Log Group
 * @returns {*}
 */
const init = (host:string, appName:string, logLevel:string, additionalConfig:any): void => {
    hostname = host
    applicationName = appName
    if(!findTransportByName(consoleLog)) {
        addConsoleTransport(logLevel)
    }

    if(additionalConfig && additionalConfig.file && !findTransportByName(fileLog)) {
        const logPath = createLogPath(additionalConfig.file.path)
        addFileTransport({level: logLevel, filename: `${logPath}/${additionalConfig.file.name}`})
    }
}

//********************************************************************************************************************//
//*********************************************** IMPLEMENTATION *****************************************************//
//********************************************************************************************************************//

const error = (generalData:LogData, desc:string, extra?:any) => {
    logFunc('error', generalData, desc, extra)
}

const warn = (generalData:LogData, desc:string, extra?:any) => {
    logFunc('warn', generalData, desc, extra)
}

const debug = (generalData:LogData, desc:string, extra?:any) => {
    logFunc('debug', generalData, desc, extra)
}

const info = (generalData:LogData, desc:string, extra?:any) => {
    logFunc('info', generalData, desc, extra)
}

const silly = (generalData:LogData, desc:string, extra?:any) => {
    logFunc('silly', generalData, desc, extra)
}

const logFunc = (level:string, generalData:LogData, desc:string, extra?:any) => {
    const date        = new Date().toISOString()
    let uuid        = generalData.uuid || ''
    const description = desc || ''
    const extraData   = extra || ''
    let from:string = ''
    let msFunction:string   = ''
    let msDescription = ''

    if (generalData.from) {
        from = generalData.from
    }

    uuid = ((from !== '') ? (from + " ; " + uuid) : uuid)

    if(description !== ''){
        const matcher = description.match(/[a-zA-Z].*[a-zA-Z]:\s/g)
        msFunction = (matcher) ? matcher[0] : ''
        msDescription = description.replace(msFunction,'').trim()
        msFunction = msFunction.replace(':', '')
    }

    const method = generalData.method.toUpperCase()
    const path = generalData.path
    let message:string
    if(typeof extraData === 'string') {
        message = util.format('%s ; %s ; %s ; %s ; %s ; %s ; %s ; %s ; %s', date, uuid, hostname, applicationName, method, path, msFunction, msDescription, extraData)
    }
    else {
        message = util.format('%s ; %s ; %s ; %s ; %s ; %s ; %s ; %s ; %j', date, uuid, hostname, applicationName, method, path, msFunction, msDescription, extraData)
    }

    Object.keys(w).forEach((transport) => {
        w[transport][level](message)
    })
}


//********************************************************************************************************************//
//***************************************************** EXPORTS ******************************************************//
//********************************************************************************************************************//

exports.init      = init

exports.error    = error
exports.warn     = warn
exports.info     = info
exports.debug    = debug
exports.silly    = silly