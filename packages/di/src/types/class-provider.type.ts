import { Constructor } from "./constructor.type";
import { InjectionToken } from "./injection-token.type";

export interface ClassProvider<T = unknown> {
    provide: InjectionToken<T>;
    useClass: Constructor<T>;
    multi?: boolean;
}

export function isClassProvider<T = unknown>(object: unknown): object is ClassProvider<T> {
    return !!object
        && (!!(object as ClassProvider<T>).provide)
        && (!!(object as ClassProvider<T>).useClass);
}

