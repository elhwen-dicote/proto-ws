import { Scope } from "./scope.type";
import { InjectionToken } from "./injection-token.type";

export interface FactoryProvider<T = unknown> {
    provide: InjectionToken;
    useFactory: (...arg: any[]) => T;
    inject?: InjectionToken[];
    multi?: boolean;
    scope?: Scope;
}

export function isFactoryProvider<T = unknown>(object: unknown): object is FactoryProvider<T> {
    return !!object
        && (!!(object as FactoryProvider<T>).provide)
        && (!!(object as FactoryProvider<T>).useFactory);
}