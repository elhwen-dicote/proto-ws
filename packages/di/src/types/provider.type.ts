import { ValueProvider } from "./value-provider.type";
import { ClassProvider } from "./class-provider.type";

export type Provider<T = unknown> = ClassProvider<T> | ValueProvider<T>;

export function isProvider<T = unknown>(object: unknown): object is Provider<T> {
    return !!object
        && (!!(object as Provider<T>).provide);
}