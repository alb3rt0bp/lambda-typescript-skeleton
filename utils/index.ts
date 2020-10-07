'use strict'

export function getInitHourOfDate (date: Date) {
    return new Date(date.setHours(0,0,0,0))
}

export function getEndHourOfDate(date: Date) {
    return new Date(date.setHours(23,59,59,999))
}

export function checkUUIDFormat(uuid: string) {
    const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

    return pattern.test(uuid)
}

export function stringIsJSON(str: string) {
    try {
        JSON.parse((str === null ? '' : str))
        return true
    }
    catch(e){
        return false
    }
}