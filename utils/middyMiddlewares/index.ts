import * as responses from "../responseHandler";

export function schemaValidationErrorParser(): any {
    return {
        onError: (handler: any) => {
            if (handler.error && handler.error.message === 'Event object failed validation') {
                //clone, because otherwise status_code will be deleted forever
                const responseBody = responses.BAD_REQUEST.clone()
                handler.error.statusCode = responseBody.status_code
                delete responseBody.status_code
                responseBody.setData(handler.error.details)
                handler.error.message = JSON.stringify(responseBody)
            }
            return Promise.resolve()
        }
    }
}