import { Constructor } from "./types/constructor.type";
import { Design } from "./metadata-keys";

export function getConstructorArgs(cls: Constructor): Constructor[] {

    return Reflect.getOwnMetadata(Design.ParamTypes, cls);

}