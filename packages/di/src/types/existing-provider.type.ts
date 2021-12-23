import { InjectionToken } from "./injection-token.type";

export interface ExistingProvider<T = unknown> {
    provide: InjectionToken;
    useExisting: InjectionToken;
    multi?: boolean;
}

export function isExistingProvider<T = unknown>(object: unknown): object is ExistingProvider<T> {
    return !!object
        && (!!(object as ExistingProvider<T>).provide)
        && (!!(object as ExistingProvider<T>).useExisting);

}