import { inject } from "@proto/di";
import { InjectionTokens, router } from "@proto/e-serv";
import { get } from "e-serv/src/decorators/method.decorator";
import { Logger } from "./logger";

@router("/")
export class MainRouter {

    @get("/body")
    test(logger: Logger, @inject(InjectionTokens.BODY) body: unknown) {
        logger.log(`roue handler body : ${JSON.stringify(body)}`);
        return body;
    }

}
