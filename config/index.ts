'use strict'
let cnf:any

// Load values depending on selected environment
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local') {
    cnf = require('./' + process.env.NODE_ENV +'.json')
}
else {
    cnf = {
        name: process.env.TS_SKELETON_IDCONNECT_NAME,
        logLevel: process.env.TS_SKELETON_LOGLEVEL,
        environment: process.env.TS_SKELETON_ENVIRONMENT,
        aws: {
            region: process.env.TS_SKELETON_AWS_REGION,
            dynamodb: {
                tableName: process.env.TS_SKELETONT_AWS_DYNAMODB_TABLENAME
            }
        }
    }
}

export const config = cnf