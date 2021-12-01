import { Scope } from ".";
import { InjectionToken } from "./injection-token.type";

export interface FactoryProvider<T = unknown> {
    provide: InjectionToken<T>;
    useFactory: (...arg: unknown[]) => T;
    inject?: InjectionToken[];
    multi?: boolean;
    scope?: Scope;
}

export function isFactoryProvider<T = unknown>(object: unknown): object is FactoryProvider<T> {
    return !!object
        && (!!(object as FactoryProvider<T>).provide)
        && (!!(object as FactoryProvider<T>).useFactory);
}