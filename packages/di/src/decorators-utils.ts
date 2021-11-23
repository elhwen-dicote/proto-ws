import { Constructor } from "./types/constructor.type";
import { Design, ReflectKeys } from "./metadata-keys";

export function getConstructorArgs(cls: Constructor): Constructor[] {
    return Reflect.getOwnMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, cls);
}