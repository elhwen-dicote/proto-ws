export type Constructor<T = {}> = new (...arg: any[]) => T;

export function isConstructor<T = {}>(object: unknown): object is Constructor<T> {
    return !!object
        && (typeof object === "function")
        && !!(object.prototype);
}
