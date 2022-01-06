import http from "http";
import express from "express";
import { Constructor } from "@proto/utils";
import { getArgumentDependencies } from "@proto/di";
import { rootContainer } from "../container";
import { InjectionTokens } from "../injection-tokens";
import { setupRequestDiMiddleware } from "../middleware";
import { Middleware, MiddlewareMount } from "../types/middleware-mount.type";
import { isMiddlewareConstructor } from "../types";
import { parseModuleOptions } from "./module-manager";

rootContainer.register<MiddlewareMount>({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        middleware: setupRequestDiMiddleware
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
    const tokens = rootContainer.get(InjectionTokens.MIDDLEWARE_MOUNT) as MiddlewareMount[];
    tokens.forEach(
        (mount) => {
            let callback: express.RequestHandler;
            if (isMiddlewareConstructor(mount.middleware)) {
                callback = buildRequestHandler(mount.middleware);
            } else {
                callback = mount.middleware;
            }
            console.log(`mounting middleware ${mount.middleware.name} on path ${mount.path ?? "undefined"}`);
            mountMiddlewareFunction(callback, mount.path);
        }
    );

    function mountMiddlewareFunction(callback: express.RequestHandler, path?: string) {
        if (path) {
            app.use(path, callback);
        } else {
            app.use(callback);
        }
    }
}

function buildRequestHandler(middlewareClass: Constructor<Middleware>): express.RequestHandler {

    console.log(`building request handler for ${middlewareClass.name}`);

    const tokens = getArgumentDependencies(middlewareClass, "callback");
    const instance = rootContainer.get<Middleware>(middlewareClass);
    return (request, response, next): void => {
        try {
            const scopeContext = request.context;
            const dependencies = tokens.map(
                (token) => rootContainer.get(token, scopeContext)
            );
            instance.callback(...dependencies);
            next();
        } catch (error) {
            next(error);
        }

    };
}