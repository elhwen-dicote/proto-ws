import http from "http";
import express from "express";
import { rootContainer } from "../container";
import { InjectionTokens } from "../injection-tokens";
import { setupRequestDiMiddleware } from "../middleware";
import { MiddlewareMount } from "../types/middlewareMount";

rootContainer.register({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        callback: setupRequestDiMiddleware
    },
    multi: true,
});
rootContainer.register({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        callback: express.json()
    },
    multi: true,
});
rootContainer.register({
    provide: InjectionTokens.MIDDLEWARE_MOUNT,
    useValue: {
        callback: express.urlencoded({
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
            console.log(`mount middleware ${mount.callback.name}`);
            if (mount.path) {
                app.use(mount.path, mount.callback);
            } else {
                app.use(mount.callback);
            }
        }
    );
}

