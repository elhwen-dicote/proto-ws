import express from "express";
import {
    RequestScopeContext,
    Scope,
    ScopeContext
} from "@proto/di";
import { rootContainer } from "../container";
import { InjectionTokens } from "../injection-tokens";

declare global {
    namespace Express {
        interface Request {
            context?: ScopeContext;
        }
    }
}

rootContainer
    .register({
        provide: InjectionTokens.REQUEST,
        scope: Scope.Request,
    })
    .register({
        provide: InjectionTokens.RESPONSE,
        scope: Scope.Request,
    })
    .register({
        provide: InjectionTokens.BODY,
        useFactory: (request: express.Request): any => {
            return request.body;
        },
        scope: Scope.Request,
        inject: [InjectionTokens.REQUEST],
    });

export function setupRequestDiMiddleware(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction): void {

    const context = RequestScopeContext.create();
    rootContainer.configureScopeContext(context, [
        [InjectionTokens.REQUEST, request],
        [InjectionTokens.RESPONSE, response],
    ]);
    request.context = context;
    next();
}
