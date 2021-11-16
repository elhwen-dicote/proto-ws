import { Constructor } from "./constructor.type";

export type ClassDecorator = <T extends Constructor>(Cls: T) => T | void;
