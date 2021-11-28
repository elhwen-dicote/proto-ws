import { Constructor } from "./types/constructor.type";
import { Design, ReflectKeys } from "./metadata-keys";
import { InjectionToken } from ".";

export function getConstructorArgs(cls: Constructor): InjectionToken[] {
    return Reflect.getOwnMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, cls);
}