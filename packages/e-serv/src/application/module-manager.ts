import express from "express";

import {
    Container,
    getArgumentDependencies,
    formatToken,
    InjectionToken,
    isInjectionToken,
    ProviderOrConstructor,
    getRealProvider,
} from "@proto/di";
import { Constructor, getOrCreate } from "@proto/utils";

import {
    Middleware,
    MiddlewareMount,
    MiddlewareDef,
    isMiddleware,
    RouterMount,
    Router,
    isRouter,
} from "../types";
import { InjectionTokens } from "../injection-tokens";
import { getModuleOptions,getRouteParams } from "../decorators";
import { rootContainer } from "../container";

const moduleMap = new WeakMap<Constructor, Container>();

export function parseModuleOptions(module: Constructor) {
    const options = getModuleOptions(module);
    const container = getOrCreateContainer(module);
    if (options.middlewares) {
        installMiddlewares(container, options.middlewares);
    }
    if (options.providers) {
        installProviders(container, options.providers);
    }
    if (options.routes) {
        installRouters(container, options.routes);
    }
}

function getOrCreateContainer(module: Constructor): Container {
    return getOrCreate(
        moduleMap,
        module,
        () => new Container(rootContainer));
}

function installMiddlewares(container: Container, middlewares: MiddlewareDef[]) {
    middlewares.forEach(
        (mount) => {
            rootContainer.register<MiddlewareMount>({
                provide: InjectionTokens.MIDDLEWARE_MOUNT,
                useFactory: () => {
                    let cbk: express.RequestHandler;
                    if (isInjectionToken(mount.requestHandler)) {
                        cbk = buildMiddlewareRequestHandler(container, mount.requestHandler);
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

function buildMiddlewareRequestHandler(container: Container, middleware: InjectionToken): express.RequestHandler {

    console.log(`building middleware request handler for ${formatToken(middleware)}`);

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

function installProviders(container: Container, providers: ProviderOrConstructor[]) {
    providers.forEach(
        (providerOrConstructor) => {
            container.register(getRealProvider(providerOrConstructor));
        }
    );
}

function installRouters(container: Container, routers: InjectionToken[]) {
    routers.forEach(
        /**
         * for each router (injection token) from module metadata, register a provider for
         * Server initialization to configure express routes.
         * 
         * @param routerToken 
         */
        function registerRouterMount(routerToken): void {
            rootContainer.register<RouterMount>({
                provide: InjectionTokens.ROUTER_MOUNT,
                /**
                 * router mount factory. Building of the router is delayed until it is needed
                 * in Server initialization.
                 *
                 * @returns a RouterMount.
                 */
                useFactory(): RouterMount {
                    console.log(`building route request handler for ${formatToken(routerToken)}`);

                    const router = express.Router();
                    const instance = container.get<Router | RouterMount>(routerToken);
                    if (isRouter(instance)) {
                        const RouterClass = instance.constructor as Constructor;
                        const routeParams = getRouteParams(RouterClass);
                        routeParams.routes.forEach(
                            /**
                             * add route method to the express router. Route is built from routeParams metadatas
                             * from decorator @router .
                             *
                             * @param param RouteParamEntry (path/http-method/property)
                             */
                            (param) => {
                                (router as any)[param.method](param.path, routeHandler);
                                /**
                                 * the route handler to assign to express router.
                                 *
                                 * @param request
                                 * @param response
                                 * @param next
                                 */
                                function routeHandler(request: express.Request, response: express.Response, next: express.NextFunction): void {
                                    try {
                                        const scopeContext = request.context;
                                        const args = getArgumentDependencies(RouterClass, param.property).map(
                                            (token) => container.get(token, scopeContext)
                                        );
                                        const content = (instance as any)[param.property](...args);
                                        response.json(content);
                                    } catch (error) {
                                        next(error);
                                    }
                                }
                            });
                        return {
                            path: routeParams.path,
                            router
                        };
                    } else {
                        return instance;
                    }
                },
                multi: true,
            });
        }
    );
}
