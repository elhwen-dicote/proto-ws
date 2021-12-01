import { InjectionToken } from "./injection-token.type";

export interface ValueProvider<T = unknown> {
    provide: InjectionToken<T>;
    useValue: T;
    multi?: boolean;
}

export function isValueProvider<T = unknown>(object: unknown): object is ValueProvider<T> {
    return !!object
        && (!!(object as ValueProvider<T>).provide)
        && (!!(object as ValueProvider<T>).useValue);
}