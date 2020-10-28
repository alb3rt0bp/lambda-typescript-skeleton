import CommonResponse from '../responseHandler'
import { EnumResponses } from '../responseHandler/EnumResponses'

export function schemaValidationErrorParser(): any {
    return {
        onError: (handler: any) => {
            if (handler.error && handler.error.message === 'Event object failed validation') {
                const response = new CommonResponse(EnumResponses.BAD_REQUEST)
                response.setData(handler.error.details)
                handler.error.statusCode = response.status_code
                handler.error.message = response.toApiGatewayProxyResult().body
            }
            return Promise.resolve()
        }
    }
}