import { ClassProvider, isClassProvider } from "./class-provider.type";
import { ValueProvider, isValueProvider } from "./value-provider.type";
import { FactoryProvider, isFactoryProvider } from "./factory-provider.type";
import { ExistingProvider, isExistingProvider } from ".";
import { isScopedValueProvider, ScopedValueProvider } from "./scoped-value-provider.type";

export type Provider<T = unknown> =
    ClassProvider<T>
    | ValueProvider<T>
    | FactoryProvider<T>
    | ExistingProvider<T>
    | ScopedValueProvider<T>;

export function isProvider<T = unknown>(object: unknown): object is Provider<T> {
    return isClassProvider(object)
        || isValueProvider(object)
        || isFactoryProvider(object)
        || isExistingProvider(object)
        || isScopedValueProvider(object);
}