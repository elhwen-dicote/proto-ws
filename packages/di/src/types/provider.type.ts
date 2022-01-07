import { ClassProvider, isClassProvider } from "./class-provider.type";
import { ValueProvider, isValueProvider } from "./value-provider.type";
import { FactoryProvider, isFactoryProvider } from "./factory-provider.type";
import { ExistingProvider, isExistingProvider } from "./existing-provider.type";
import { isScopedValueProvider, ScopedValueProvider } from "./scoped-value-provider.type";
import { Constructor, isConstructor } from "@proto/utils";

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

export type ProviderOrConstructor<T = unknown> = Provider<T> | Constructor<T>;

/**
 * Handle simple class constructor as a provider. In this case, replace the constructor
 * with a class provider who provide an instance of this class.
 * 
 * @param providerOrConstructor provider or class constructor
 * @returns a real provider
 */
export function getRealProvider<T = unknown>(providerOrConstructor: ProviderOrConstructor<T>): Provider<T> {
    return (isConstructor<T>(providerOrConstructor)
        ? {
            provide: providerOrConstructor,
            useClass: providerOrConstructor,
        }
        : providerOrConstructor);
}