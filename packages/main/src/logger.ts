import { inject, injectable } from "@proto/di";
import { rootContainer } from "@proto/e-serv";

export const prefix_token = Symbol("main.prefix");

@injectable()
export class Logger {

    constructor(
        @inject(prefix_token) private prefix: string,
    ) { }

    log(msg: any, ...optParams: any[]) {
        console.log(this.prefix, msg, ...optParams);
    }
}

