import { injectable } from "@proto/di";
import { ClassDecorator } from "@proto/utils";
import { ClassType } from "../types";
import { RouteParams } from "./decorators-utils";
import { ReflectKeys } from "./metadata-keys";

export function router(path:string):ClassDecorator{
    return (Cls)=>{

        Cls = Reflect.decorate([
            injectable(),
        ] as globalThis.ClassDecorator[], Cls) as typeof Cls;

        Reflect.defineMetadata(ReflectKeys.CLASS_TYPE, ClassType.router, Cls);

        if(path) {
            let routeParams:RouteParams = Reflect.getOwnMetadata(ReflectKeys.ROUTE_PARAMS,Cls.prototype);
            if(!routeParams){
                routeParams = { routes: [] };
                Reflect.defineMetadata(ReflectKeys.ROUTE_PARAMS, routeParams, Cls.prototype);
            }
            routeParams.path = path;
        }

        return Cls;

    }
}