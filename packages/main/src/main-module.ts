import express from "express";
import { module } from "@proto/e-serv";
import { LoggerMiddleware } from "./logger-middleware";

@module({
    middleware: [
        { middleware: express.json() },
        { middleware: express.urlencoded({ extended: false }) },
        { middleware: LoggerMiddleware },
    ]
})
export class MainModule {

}