import { Constructor } from "..";
import { ClassDecorator } from "../types/class-decorator.type";

export function injectable(): ClassDecorator {
    return (Cls) => {};
}