import { injectable, Container, inject } from "@proto/di";
import { RequestScopeContext, Scope } from "di/src/types";

let id: number = 0;

const message1_token = Symbol("message1 token");
const message2_token = Symbol("message2 token");

@injectable()
class Logger {

    private readonly id: number = ++id;

    constructor() {
        console.log(`build Logger ${this.id}`);
    }

    log(message: string) {
        console.log(`Logger -> ${message}`);
    }
}

@injectable()
class Client {

    private readonly id: number = ++id;

    constructor(
        private logger: Logger,
        @inject(message1_token) private readonly msg1: string,
        @inject(message2_token) private readonly msg2: string,
    ) {
        console.log(`build Client ${this.id}`);
    }

    print() {
        this.logger.log([this.msg1, this.msg2].join(" / "));
    }
}

const container = new Container();

container.register<string>({
    provide: message1_token,
    scope: Scope.Request,
});

container.register<string>({
    provide: message2_token,
    scope: Scope.Request,
});

container.register(Logger);

container.register({
    provide: Client,
    useClass: Client,
    scope:Scope.Request,
});

const request1 = RequestScopeContext.create();
container.configureScopeContext(request1, [
    [message1_token, "message 1 from request 1"],
    [message2_token, "message 2 from request 1"],
]);

const request2 = RequestScopeContext.create();
container.configureScopeContext(request2, [
    [message1_token, "message 1 from request 2"],
    [message2_token, "message 2 from request 2"],
]);

container.get<Client>(Client, request1).print();
container.get<Client>(Client, request2).print();
