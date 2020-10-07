import * as uuidGenerator from "uuid"

export class User {
    id: string
    given_name: string
    family_name: string
    birthdate?: string
    email: string
    phone_number?: string

    constructor(request: any) {
        this.id = (request.id) ? request.id : uuidGenerator.v4()
        this.given_name = request.given_name
        this.family_name = request.family_name
        this.birthdate = request.birthdate
        this.email = request.email
        this.phone_number = request.phone_number
    }

    fromDynamo(data:any): User {
        data.id = data.id.S
        data.given_name = data.given_name.S
        data.family_name = data.family_name.S
        data.email = data.email.S
        data.birthdate = (data.birthdate) ? data.birthdate.S : undefined
        data.phone_number = (data.phone_number) ? data.phone_number.S : undefined
        return new User(data);
    }
}