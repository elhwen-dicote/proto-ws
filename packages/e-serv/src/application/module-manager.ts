import { Container } from "@proto/di";
import { Constructor, getOrCreate, setIfNotPresent } from "@proto/utils";
import { InjectionTokens, MiddlewareMount, rootContainer } from "..";
import { getModuleOptions } from "../decorators/decorators-utils";

const moduleMap = new WeakMap<Constructor, Container>();

export function parseModuleOptions(module: Constructor) {
    const options = getModuleOptions(module);
    if (options.middlewares) {
        installMiddlewares(options.middlewares);
    }
}

function getOrCreateContainer(module: Constructor): Container {
    return getOrCreate(
        moduleMap,
        module,
        () => new Container(rootContainer));
}

function installMiddlewares(middlewares: MiddlewareMount[]) {
    middlewares.forEach(
        (mount) => {
            rootContainer.register({
                provide: InjectionTokens.MIDDLEWARE_MOUNT,
                useValue: mount,
                multi: true,
            });
        }
    );
}