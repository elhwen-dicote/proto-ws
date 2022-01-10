import { Constructor, isConstructor } from "@proto/utils";
import { getClassType } from "../decorators";
import { Middleware } from "./middleware-mount.type";
import { Router } from "./router-mount.type";

export enum ClassType {
    module = "module",
    middleware = "middleware",
    router = "router",
}

export function isModuleConstructor(Cls: unknown): boolean {
    return isConstructor(Cls) && getClassType(Cls) === ClassType.module;
}

export function isMiddlewareConstructor(Cls: unknown): Cls is Constructor<Middleware> {
    return isConstructor(Cls) && getClassType(Cls) === ClassType.middleware;
}

export function isMiddleware(object: unknown): object is Middleware {
    return object != null
        && typeof object === "object"
        && isMiddlewareConstructor(object.constructor);
}

export function isRouterConstructor(Cls: unknown): Cls is Constructor<Router> {
    return isConstructor(Cls) && getClassType(Cls) === ClassType.router;
}

export function isRouter(object: unknown): object is Router {
    return object != null
        && typeof object === "object"
        && isRouterConstructor(object.constructor);
}