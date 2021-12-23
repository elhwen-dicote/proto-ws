import { Constructor } from "@proto/utils";
import { InjectionToken } from "../types";
import { ReflectKeys } from "./metadata-keys";

export function getArgumentDependencies(
    cls: Constructor,
    propertyKey?: string | symbol): InjectionToken[] {

    if (propertyKey) {
        return Reflect.getOwnMetadata(
            ReflectKeys.ARGUMENT_DEPENDENCIES,
            cls.prototype,
            propertyKey);
    } else {
        return Reflect.getOwnMetadata(ReflectKeys.ARGUMENT_DEPENDENCIES, cls);
    }

}