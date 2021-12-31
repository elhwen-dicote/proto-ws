import { injectable } from "@proto/di";
import { ClassDecorator } from "@proto/utils";
import { ModuleOptions } from "../types";
import { ClassType } from "../types/class-type.type";
import { ReflectKeys } from "./metadata-keys";

export function module(options: ModuleOptions = {}): ClassDecorator {
    return (Cls) => {

        Cls = Reflect.decorate([
            injectable(),
        ] as globalThis.ClassDecorator[], Cls) as typeof Cls;

        Reflect.defineMetadata(ReflectKeys.CLASS_TYPE, ClassType.module, Cls);
        Reflect.defineMetadata(ReflectKeys.MODULE_OPTIONS, options, Cls);

        return Cls;
    };
}
