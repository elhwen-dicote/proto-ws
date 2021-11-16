import { Constructor } from ".";
import { ClassProvider, isClassProvider } from "./class-provider.type";
import { isConstructor } from "./constructor.type";

export type Provider<T = unknown> = ClassProvider<T>;

export function isProvider(object: unknown): object is Provider {
    return isClassProvider(object);
}