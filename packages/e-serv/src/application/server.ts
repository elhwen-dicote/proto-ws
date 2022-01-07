import http from "http";
import express from "express";
import { Constructor } from "@proto/utils";
import { rootContainer } from "../container";
import { InjectionTokens } from "../injection-tokens";
import { setupRequestDiMiddleware } from "../middleware";
import { MiddlewareMount } from "../types/middleware-mount.type";
import { parseModuleOptions } from "./module-manager";

rootContainer.register<MiddlewareMount>({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        requestHandler: setupRequestDiMiddleware
    },
    multi: true,
});

export class Server {

    private readonly _app: express.Application = express();

    public get expressApplication() { return this._app; }

    private constructor() {
        initMiddlewares(this._app);
    }

    static create(module: Constructor): Server {
        parseModuleOptions(module);
        return new Server();
    }

    public listen(port: number = 3000) {
        const server = http.createServer(this._app);

        server
            .addListener("listening",
                function onListening() {
                    console.log(`server listening on port ${port}`);
                })
            .addListener("error",
                function onError(error) {
                    console.log(`server error: ${error.message ?? error.name ?? error}`);
                    process.exit(1);
                })
            .addListener("close",
                function onClose() {
                    console.log("server closing...");
                });

        server.listen(port);
    }

}

function initMiddlewares(app: express.Application) {
    const tokens = rootContainer.get<{ path: string; requestHandler: express.RequestHandler; }[]>(InjectionTokens.MIDDLEWARE_MOUNT);
    tokens.forEach(
        ({ path, requestHandler }) => {
            console.log(`mounting middleware ${requestHandler.name} on path ${path ?? "undefined"}`);
            if (path) {
                app.use(path, requestHandler);
            } else {
                app.use(requestHandler);
            }
        }
    );
}
