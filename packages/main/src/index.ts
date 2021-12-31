import { rootContainer, Server } from "@proto/e-serv";
import { Logger, prefix_token } from "./logger";
import { LoggerMiddleware } from "./logger-middleware";
import { MainModule } from "./main-module";
import { route } from "./route";

const PORT = parseInt(process.env.PORT ?? "3000");
const prefix = "main-proto:";

rootContainer.register<LoggerMiddleware>({
    provide: LoggerMiddleware,
    useClass: LoggerMiddleware,
});

rootContainer.register<string>({
    provide: prefix_token,
    useValue: prefix,
});
rootContainer.register<Logger>(Logger);

const server = Server.create(MainModule);
server.expressApplication.use("/body", route);
server.listen(PORT);

