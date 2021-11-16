import { Constructor } from ".";
import { isConstructor } from "./constructor.type";

export type InjectionToken<T = unknown> = Constructor<T>;

export function isInjectionToken(object: unknown): object is InjectionToken {
    return isConstructor(object);
}