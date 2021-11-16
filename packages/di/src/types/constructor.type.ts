export type Constructor<T = {}> = new (...arg: any[]) => T;

export function isConstructor(object: unknown): object is Constructor {
    return typeof object === "function" && !!(object.prototype);
}
