import { Design, InjectionToken } from "..";
import { ReflectKeys } from "../metadata-keys";

export function inject(token: InjectionToken): ParameterDecorator {

    return function parameterDecorator(target, propertyKey, parameterIndex): void {

        const dependencies: InjectionToken[] = Reflect.getOwnMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, target)
            ?? [...Reflect.getOwnMetadata(Design.ParamTypes, target)];
        dependencies.splice(parameterIndex, 1, token);
        Reflect.defineMetadata(ReflectKeys.CONSTRUCTOR_DEPENDENCIES, dependencies, target);
    };

}