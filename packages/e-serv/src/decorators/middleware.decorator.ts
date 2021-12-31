import { injectable } from "@proto/di";
import { ClassDecorator } from "@proto/utils";
import { ClassType } from "../types";
import { ReflectKeys } from "./metadata-keys";

export function middleware(): ClassDecorator {
    return (Cls) => {

        Cls = Reflect.decorate([
            injectable(),
        ] as globalThis.ClassDecorator[], Cls) as typeof Cls;

        Reflect.defineMetadata(ReflectKeys.CLASS_TYPE, ClassType.middleware, Cls);

        return Cls;
    };
}