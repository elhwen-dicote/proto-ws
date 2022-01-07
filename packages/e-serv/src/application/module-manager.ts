import express from "express";
import {
    Container,
    getArgumentDependencies,
    formatToken,
    InjectionToken,
    isInjectionToken
} from "@proto/di";
import { Constructor, getOrCreate } from "@proto/utils";
import { Middleware, MiddlewareMount, isMiddleware } from "../types";
import { InjectionTokens } from "../injection-tokens";
import { getModuleOptions } from "../decorators";
import { rootContainer } from "../container";

const moduleMap = new WeakMap<Constructor, Container>();

export function parseModuleOptions(module: Constructor) {
    const options = getModuleOptions(module);
    const container = getOrCreateContainer(module);
    if (options.middlewares) {
        installMiddlewares(container, options.middlewares);
    }
}

function getOrCreateContainer(module: Constructor): Container {
    return getOrCreate(
        moduleMap,
        module,
        () => new Container(rootContainer));
}

function installMiddlewares(container: Container, middlewares: MiddlewareMount[]) {
    middlewares.forEach(
        (mount) => {
            rootContainer.register<{ path?: string; requestHandler: express.RequestHandler; }>({
                provide: InjectionTokens.MIDDLEWARE_MOUNT,
                useFactory: () => {
                    let cbk: express.RequestHandler;
                    if (isInjectionToken(mount.requestHandler)) {
                        cbk = buildRequestHandler(container, mount.requestHandler);
                    } else {
                        cbk = mount.requestHandler;
                    }
                    return {
                        path: mount.path,
                        requestHandler: cbk,
                    };
                },
                multi: true,
            });
        }
    );
}

function buildRequestHandler(container: Container, middleware: InjectionToken): express.RequestHandler {

    console.log(`building request handler for ${formatToken(middleware)}`);

    const instance = container.get<Middleware | express.RequestHandler>(middleware);
    if (isMiddleware(instance)) {
        const middlewareClass = instance.constructor as Constructor<Middleware>;
        const tokens = getArgumentDependencies(middlewareClass, "callback");
        return function requestHandler(request, response, next): void {
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
    } else return instance;
}