import { Provider } from "@proto/di";
import { ProviderOrConstructor } from "di/src/types";
import { MiddlewareMount } from "./middleware-mount.type";

export interface ModuleOptions {

    middlewares?: MiddlewareMount[];
    providers?: ProviderOrConstructor[];

}