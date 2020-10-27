'use strict'
export namespace EnumResponses {
    export interface ResponseEnumI {
        status_code: number
        internal_code: string
        description: string
    }

    export const INCORRECT_CONTENT_TYPE_HEADER:ResponseEnumI = {
        status_code:415,
        description: 'Missing Content-Type header or incorrect. Only application/json accepted',
        internal_code: 'GMB-0001'
    }

    export const BAD_REQUEST:ResponseEnumI = {
        status_code:400,
        description: 'Bad request.',
        internal_code: 'GMB-0002'
    }

    export const GENERAL_ERROR:ResponseEnumI = {
        status_code: 500,
        description: 'General Error.',
        internal_code: 'GMB-0003'
    }
    export const NOT_FOUND:ResponseEnumI = {
        status_code: 404,
        description: 'Object not found.',
        internal_code: 'GMB-0004'
    }
    export const OK_GENERIC_RESPONSE:ResponseEnumI = {
        status_code: 200,
        description: 'OK.',
        internal_code: 'GMB-0005'
    }
    export const RESOURCE_NOT_FOUND:ResponseEnumI = {
        status_code: 404,
        description: 'Resource not found.',
        internal_code: 'GMB-0006'
    }
    export const KO_SERVER_TOKEN_REVOKED:ResponseEnumI = {
        status_code: 401,
        description: 'Token revoked.',
        internal_code: 'GMB-0008'
    }
    export const OK_GENERIC_UPDATE:ResponseEnumI = {
        status_code: 200,
        description: 'Resource Updated',
        internal_code: 'GMB-0009'
    }
    export const OK_GENERIC_CREATE:ResponseEnumI = {
        status_code: 201,
        description: 'Resource Created',
        internal_code: 'GMB-0010'
    }
    export const OK_GENERIC_GET:ResponseEnumI = {
        status_code:  200,
        description: 'Resource Found',
        internal_code: 'GMB-0011'
    }
    export const FORBIDDEN:ResponseEnumI = {
        status_code: 403,
        description: 'Forbidden',
        internal_code: 'GMB-0012'
    }
    export const OK_GENERIC_DELETE:ResponseEnumI = {
        status_code: 200,
        description: 'Resource Deleted',
        internal_code: 'GMB-0013'
    }
    export const OK_NO_CONTENT:ResponseEnumI = {
        status_code: 204,
        description: 'No Content',
        internal_code: 'GMB-0014'
    }
    export const ACCEPTED:ResponseEnumI = {
        status_code: 202,
        description: 'Accepted',
        internal_code: 'GMB-0015'
    }   
}