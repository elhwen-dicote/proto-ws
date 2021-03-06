import { Constructor } from "@proto/utils";
import { Scope } from "./scope.type";
import { InjectionToken } from "./injection-token.type";

export interface ClassProvider<T = unknown> {
    provide: InjectionToken;
    useClass: Constructor<T>;
    multi?: boolean;
    scope?: Scope;
}

export function isClassProvider<T = unknown>(object: unknown): object is ClassProvider<T> {
    return !!object
        && (!!(object as ClassProvider<T>).provide)
        && (!!(object as ClassProvider<T>).useClass);
}

