import { Constructor, isConstructor } from "@proto/utils";
import { Middleware } from "./middleware-mount.type";
import { getClassType } from "../decorators/decorators-utils";

export enum ClassType {
    module = "module",
    middleware = "middleware",
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