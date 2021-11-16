import { Constructor, InjectionToken } from ".";

export interface ClassProvider<T = unknown> {
    provide: InjectionToken<T>;
    useClass: Constructor<T>;
}

export function isClassProvider(object: unknown): object is ClassProvider {
    return (
        (!!(object as ClassProvider).provide)
        && (!!(object as ClassProvider).useClass));
}

