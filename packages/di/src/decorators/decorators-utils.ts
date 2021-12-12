import { InjectionToken, Constructor } from "../types";
import { ReflectKeys } from "./metadata-keys";

export function getConstructorArgs(cls: Constructor): InjectionToken[] {
    return Reflect.getOwnMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, cls);
}