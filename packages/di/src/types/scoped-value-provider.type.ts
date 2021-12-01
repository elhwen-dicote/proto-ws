import { Scope, isStatic } from "./scope.type";
import { InjectionToken } from "./injection-token.type";
import { isClassProvider } from "./class-provider.type";
import { isFactoryProvider } from "./factory-provider.type";

export interface ScopedValueProvider<T = unknown> {
    provide: InjectionToken<T>;
    scope: Scope;
}

export function isScopedValueProvider<T = unknown>(object: unknown): object is ScopedValueProvider<T> {
    return !!object
        && (!!(object as ScopedValueProvider<T>).provide)
        && (!!(object as ScopedValueProvider<T>).scope)
        && (!isStatic((object as ScopedValueProvider<T>).scope))
        && (!isClassProvider(object))
        && (!isFactoryProvider(object));
}