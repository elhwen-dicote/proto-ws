import { ClassDecorator } from "@proto/utils";
import { ReflectKeys, Design } from "./metadata-keys";

export function injectable(): ClassDecorator {
    return (Cls) => {
        const dependencies = Reflect.getOwnMetadata(ReflectKeys.ARGUMENT_DEPENDENCIES, Cls);
        if (!dependencies) {
            Reflect.defineMetadata(
                ReflectKeys.ARGUMENT_DEPENDENCIES,
                Reflect.getOwnMetadata(Design.ParamTypes, Cls) ?? [],
                Cls);
        }
    };
}
