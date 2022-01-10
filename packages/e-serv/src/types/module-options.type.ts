import { InjectionToken, ProviderOrConstructor } from "@proto/di";
import { MiddlewareDef } from "./middleware-mount.type";

export interface ModuleOptions {

    middlewares?: MiddlewareDef[];
    providers?: ProviderOrConstructor[];
    routes?: InjectionToken[];

}