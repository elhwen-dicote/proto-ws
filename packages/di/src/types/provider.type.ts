import { ValueProvider, isValueProvider } from "./value-provider.type";
import { ClassProvider, isClassProvider } from "./class-provider.type";
import { FactoryProvider, isFactoryProvider } from "./factory-provider.type";

export type Provider<T = unknown> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

export function isProvider<T = unknown>(object: unknown): object is Provider<T> {
    return isClassProvider(object)
        || isValueProvider(object)
        || isFactoryProvider(object);
}