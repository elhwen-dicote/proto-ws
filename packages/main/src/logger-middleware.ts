import { inject } from "@proto/di";
import { InjectionTokens, Middleware } from "@proto/e-serv";
import { middleware } from "e-serv/src/decorators/middleware.decorator";
import { Logger } from "./logger";

@middleware()
export class LoggerMiddleware implements Middleware {

    constructor(
        private logger: Logger,
    ) { }

    callback(@inject(InjectionTokens.BODY) body: unknown): void {
        this.logger.log(`New request... body = ${JSON.stringify(body)}`);
    }

}

