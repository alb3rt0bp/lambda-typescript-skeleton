import * as uuidGenerator from "uuid";

export class LogData {
    method: string;
    uuid: string;
    path: string;
    from: string;
    consumerId?: string;

    constructor(request: any) {
        this.method = request.method.toUpperCase();
        this.uuid = uuidGenerator.v4();
        this.path = request.path;
        this.from = request.from;
    };
}