const userDetailSchema = require('./app/schemas/userDetail.json')
const updateUserSchema = require('./app/schemas/updateUser.json')

//const test = Object.assign({type: 'object'}, userDetailSchema.properties, updateUserSchema.properties)
const test = {
    ...userDetailSchema,
    properties: updateUserSchema.properties
}

console.log(JSON.stringify(test))