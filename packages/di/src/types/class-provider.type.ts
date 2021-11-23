import { Constructor, InjectionToken } from ".";
import { isProvider } from "./provider.type";

export interface ClassProvider<T = unknown> {
    provide: InjectionToken<T>;
    useClass: Constructor<T>;
}

export function isClassProvider<T = unknown>(object: unknown): object is ClassProvider<T> {
    return isProvider<T>(object)
        && (!!(object as ClassProvider<T>).useClass);
}

