import { InjectionToken } from ".";

export interface ExistingProvider<T = unknown> {
    provide: InjectionToken<T>;
    useExisting: InjectionToken<T>;
}

export function isExistingProvider<T = unknown>(object: unknown): object is ExistingProvider<T> {
    return !!object
        && (!!(object as ExistingProvider<T>).provide)
        && (!!(object as ExistingProvider<T>).useExisting);

}