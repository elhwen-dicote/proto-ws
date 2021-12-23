import { Constructor, isConstructor } from "@proto/utils";

export type InjectionToken<T = unknown> = Constructor<T> | string | symbol;

export function isInjectionToken<T>(object: unknown): object is InjectionToken<T> {
    return typeof object === "string"
        || typeof object === "symbol"
        || isConstructor(object);
}

export function formatToken(token: InjectionToken): string {
    if (typeof token === "string") {
        return token;
    }
    if (typeof token === "symbol") {
        return token.toString();
    }
    return token.name;
}