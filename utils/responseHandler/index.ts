'use strict'

class CustomResponse {
    status_code: number
    description: string
    internal_code: string
    data?:any
    constructor(request: any, data?: any) {
        this.status_code = request.status_code
        this.description = request.description
        this.internal_code = request.internal_code
        if(data) {
            this.data = data
        }
    }
    setData(data:any) {
        this.data = data
    }
    setDescription(description: string) {
        this.description = description
    }
    clone() {
        return new CustomResponse(this)
    }
}

const INCORRECT_CONTENT_TYPE_HEADER = new CustomResponse({
    status_code: 415,
    description: 'Missing Content-Type header or incorrect. Only application/json accepted',
    internal_code: 'GMB-0001'
})
const BAD_REQUEST =  new CustomResponse({
    status_code: 400,
    description: 'Bad request.',
    internal_code: 'GMB-0002'
})
const GENERAL_ERROR = new CustomResponse({
    status_code: 500,
    description: 'General Error.',
    internal_code: 'GMB-0003'
})
const NOT_FOUND = new CustomResponse({
    status_code: 404,
    description: 'Object not found.',
    internal_code: 'GMB-0004'
})
const OK_GENERIC_RESPONSE = new CustomResponse({
    status_code: 200,
    description: 'OK.',
    internal_code: 'GMB-0005'
})
const RESOURCE_NOT_FOUND = new CustomResponse({
    status_code: 404,
    description: 'Resource not found.',
    internal_code: 'GMB-0006'
})
const KO_SERVER_TOKEN_REVOKED = new CustomResponse({
    status_code: 401,
    description: 'Token revoked.',
    internal_code: 'GMB-0008'
})
const OK_GENERIC_UPDATE = new CustomResponse({
    status_code: 200,
    description: 'Resource Updated',
    internal_code: 'GMB-0009'
})

const OK_GENERIC_CREATE = new CustomResponse({
    status_code: 201,
    description: 'Resource Created',
    internal_code: 'GMB-0010'
})
const OK_GENERIC_GET = new CustomResponse({
    status_code: 200,
    description: 'Resource Found',
    internal_code: 'GMB-0011'
})
const FORBIDDEN = new CustomResponse({
    status_code: 403,
    description: 'Forbidden',
    internal_code: 'GMB-0012'
})
const OK_GENERIC_DELETE = new CustomResponse({
    status_code: 200,
    description: 'Resource Deleted',
    internal_code: 'GMB-0013'
})
const OK_NO_CONTENT = new CustomResponse({
    status_code: 204,
    description: 'No Content',
    internal_code: 'GMB-0014'
})
const ACCEPTED = new CustomResponse({
    status_code: 202,
    description: 'Accepted',
    internal_code: 'GMB-0015'
})

export {
    INCORRECT_CONTENT_TYPE_HEADER,
    BAD_REQUEST,
    GENERAL_ERROR,
    NOT_FOUND,
    OK_GENERIC_RESPONSE,
    RESOURCE_NOT_FOUND,
    KO_SERVER_TOKEN_REVOKED,
    OK_GENERIC_UPDATE,
    OK_GENERIC_CREATE,
    OK_GENERIC_GET,
    FORBIDDEN,
    OK_GENERIC_DELETE,
    OK_NO_CONTENT,
    ACCEPTED
}

// SPECIFIC MS ERRORS
