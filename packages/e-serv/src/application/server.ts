import http from "http";
import express from "express";
import { rootContainer } from "../container";
import { InjectionTokens } from "../injection-tokens";
import { setupRequestDiMiddleware } from "../middleware";
import { Middleware, MiddlewareCallback, MiddlewareMount } from "../types/middleware-mount.type";
import { Constructor } from "@proto/utils";
import { getArgumentDependencies } from "di/src/decorators/decorators-utils";

rootContainer.register<MiddlewareMount>({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        middleware: setupRequestDiMiddleware
    },
    multi: true,
});
rootContainer.register<MiddlewareMount>({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        middleware: express.json()
    },
    multi: true,
});
rootContainer.register<MiddlewareMount>({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        middleware: express.urlencoded({
            extended: false,
        })
    },
    multi: true,
});

export class Server {

    private readonly _app: express.Application = express();

    constructor() {
        initMiddlewares(this._app);
    }

    public get expressApplication() { return this._app; }

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
            mountMiddlewareFunction(callback, mount.path);
        }
    );

    function mountMiddlewareFunction(callback: express.RequestHandler, path?: string) {
        console.log(`mount middleware ${callback.name}`);
        if (path) {
            app.use(path, callback);
        } else {
            app.use(callback);
        }
    }
}

function isMiddlewareConstructor(mount: MiddlewareCallback): mount is Constructor<Middleware> {
    return mount instanceof Function
        && mount?.prototype instanceof Middleware;
}

function buildRequestHandler(middlewareClass: Constructor<Middleware>): express.RequestHandler {
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