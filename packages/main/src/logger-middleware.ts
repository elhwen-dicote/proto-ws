import { inject, injectable } from "@proto/di";
import { InjectionTokens, Middleware } from "@proto/e-serv";
import { Logger } from "./logger";

@injectable()
export class LoggerMiddleware extends Middleware {

    constructor(
        private logger: Logger,
    ) {
        super();
    }

    callback(@inject(InjectionTokens.BODY) body: unknown): void {
        this.logger.log(`New request...${body}`);
    }

}

