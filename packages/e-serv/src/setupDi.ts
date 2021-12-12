import express from "express";
import {
    Container,
    InjectionToken,
    RequestScopeContext,
    Scope,
    ScopeContext
} from "@proto/di";

declare global {
    namespace Express {
        interface Request {
            context?: ScopeContext;
        }
    }
}

export const InjectionTokens: Record<string, InjectionToken> = {
    REQUEST: Symbol("express.Request"),
    RESPONSE: Symbol("express.Response"),
    BODY: Symbol("request.body")
};

export const rootContainer = new Container();
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
        useFactory: (request: express.Request) => {
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