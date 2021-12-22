import { Constructor } from "@proto/utils";
import express from "express";

interface Middleware {
    callback(...arg:unknown[]):unknown;
}
type MiddlewareCallback = express.RequestHandler /*| Middleware */;

export interface MiddlewareMount {
    path?: string;
    callback: MiddlewareCallback;
}