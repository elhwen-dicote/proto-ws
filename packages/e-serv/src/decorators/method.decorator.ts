import { RouteParams, RouteParamsEntry } from "./decorators-utils";
import { ReflectKeys } from "./metadata-keys";

enum HttpMethod {
    GET = "get",
    PUT = "put",
}

function buildMethodDecoratorFactory(method: HttpMethod) {
    return function methodDecoratorFactory(path: string): MethodDecorator {
        return function methodDecorator<T>(
            target: Object,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<T>) {
            let routeParams: RouteParams = Reflect.getOwnMetadata(ReflectKeys.ROUTE_PARAMS, target);
            if (!routeParams) {
                routeParams = { routes: [] };
                Reflect.defineMetadata(ReflectKeys.ROUTE_PARAMS, routeParams, target);
            }
            routeParams.routes.push({
                method,
                property: propertyKey,
                path
            });
        };
    };
}

export const get = buildMethodDecoratorFactory(HttpMethod.GET);
export const put = buildMethodDecoratorFactory(HttpMethod.PUT);
