import { InjectionToken } from "../types";
import { ReflectKeys, Design } from "./metadata-keys";

export function inject(token: InjectionToken): ParameterDecorator {

    return function parameterDecorator(target, propertyKey, parameterIndex): void {
        let dependencies: InjectionToken[] = Reflect.getOwnMetadata(
            ReflectKeys.ARGUMENT_DEPENDENCIES,
            target,
            propertyKey);
        if (!dependencies) {
            const paramTypes = Reflect.getOwnMetadata(Design.ParamTypes, target, propertyKey);
            if (paramTypes) {
                dependencies = paramTypes;
                Reflect.defineMetadata(
                    ReflectKeys.ARGUMENT_DEPENDENCIES,
                    dependencies,
                    target,
                    propertyKey);
            }
        }
        if (!dependencies) {
            throw new Error(`No params types for ${getPropName(target, propertyKey)}`);
        }
        dependencies.splice(parameterIndex, 1, token);
    };

}

function getPropName(target: Object, property: string | symbol): string {
    if (!(target instanceof Function)) {
        target = target?.constructor;
    }
    if (target instanceof Function) {
        return `${target.name}.${property ? property.toString() : "constructor"}`;
    }
    return "unknown.unknown";
}