import { Constructor } from "@proto/utils";
import { ModuleOptions } from "../types";
import { ReflectKeys } from "./metadata-keys";

export function getModuleOptions(cls: Constructor): ModuleOptions {
    return Reflect.getOwnMetadata(ReflectKeys.MODULE_OPTIONS, cls);
}

export function getClassType(cls: Constructor) {
    return Reflect.getOwnMetadata(ReflectKeys.CLASS_TYPE, cls);
}
