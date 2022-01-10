import express from "express";
import { InjectionToken } from "@proto/di";

export interface Middleware {
    callback(...arg: unknown[]): unknown;
}

export interface MiddlewareDef {
    path?: string;
    requestHandler: express.RequestHandler | InjectionToken;
}

export interface MiddlewareMount {
    path?: string;
    requestHandler: express.RequestHandler;
}
