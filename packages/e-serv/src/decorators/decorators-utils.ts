import { Constructor } from "@proto/utils";
import { ClassType, ModuleOptions } from "../types";
import { ReflectKeys } from "./metadata-keys";

export function getModuleOptions(cls: Constructor): ModuleOptions {
    return Reflect.getOwnMetadata(ReflectKeys.MODULE_OPTIONS, cls);
}

export function getClassType(cls: Constructor): ClassType {
    return Reflect.getOwnMetadata(ReflectKeys.CLASS_TYPE, cls);
}

/**
 * retreive metadata stored by http method decorators (i.e @get, @post, ...).
 * 
 * @param cls Router class. 
 * @returns Array of route params
 */
export function getRouteParams(cls: Constructor): RouteParams {
    return Reflect.getOwnMetadata(ReflectKeys.ROUTE_PARAMS, cls.prototype);
}

export interface RouteParams {
    path?:string;
    routes:RouteParamsEntry[];
}

export interface RouteParamsEntry {
    method:string;
    property: string | symbol;
    path: string;
}
