import { Constructor } from "@proto/utils";
import express from "express";

export abstract class Middleware {
    abstract callback(...arg: unknown[]): unknown;
}
export type MiddlewareCallback = express.RequestHandler | Constructor<Middleware>;

export interface MiddlewareMount {
    path?: string;
    middleware: MiddlewareCallback;
}