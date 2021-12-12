import { InjectionToken } from "./injection-token.type";

export interface ExistingProvider<T = unknown> {
    provide: InjectionToken<T>;
    useExisting: InjectionToken<T>;
    multi?: boolean;
}

export function isExistingProvider<T = unknown>(object: unknown): object is ExistingProvider<T> {
    return !!object
        && (!!(object as ExistingProvider<T>).provide)
        && (!!(object as ExistingProvider<T>).useExisting);

}