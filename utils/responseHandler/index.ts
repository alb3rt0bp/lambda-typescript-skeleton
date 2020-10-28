'use strict'

import {APIGatewayProxyResult} from "aws-lambda"
import {EnumResponses} from './EnumResponses'

interface CommonResponseBody {
    description:string
    internal_code:string
    data?:Object
}

export default class CommonResponse {
    private _status_code: number
    private _body: CommonResponseBody

    constructor(enumResponse:EnumResponses.ResponseEnumI) {
        this._body = {
            description: enumResponse.description,
            internal_code: enumResponse.internal_code}
        this._status_code = enumResponse.status_code
    }

    setData(data:Object) {
        this._body.data = data
    }

    getDescription():string {
        return this._body.description
    }
    setDescription(description:string) {
        this._body.description = description
    }

    toApiGatewayProxyResult():APIGatewayProxyResult {
        return {
            statusCode: this._status_code,
            body: JSON.stringify(this._body)
        }
    }


    /**
     * GETTERS AND SETTERS
     **/
    get body():CommonResponseBody {
        return this._body
    }

    get status_code():number {
        return this._status_code
    }
}