import { Design } from "..";
import { ReflectKeys } from "../metadata-keys";
import { ClassDecorator } from "../types/class-decorator.type";

export function injectable(): ClassDecorator {
    return (Cls) => {
        const dependencies = Reflect.getOwnMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, Cls);
        if (!dependencies) {
            Reflect.defineMetadata(
                ReflectKeys.CONSTRUCTOR_DEPENDENCIES,
                Reflect.getOwnMetadata(Design.ParamTypes, Cls), Cls);
        }
    };
}