import { InjectionToken } from "@proto/di";

export const InjectionTokens: Record<string, InjectionToken> = {
    REQUEST: Symbol("express.Request"),
    RESPONSE: Symbol("express.Response"),
    BODY: Symbol("request.body"),
    MIDDLEWARE_MOUNT : Symbol("E-serv.MiddlewareMount"),
};

