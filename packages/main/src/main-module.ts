import express from "express";
import { module } from "@proto/e-serv";
import { LoggerMiddleware } from "./logger-middleware";
import { Logger, prefix_token } from "./logger";
import { MainRouter } from "./route";

const prefix = "main-proto:";

@module({
    middlewares: [
        { requestHandler: express.json() },
        { requestHandler: express.urlencoded({ extended: false }) },
        { requestHandler: LoggerMiddleware },
    ],
    providers: [
        LoggerMiddleware,
        {
            provide: prefix_token,
            useValue: prefix
        },
        Logger,
        MainRouter,
    ],
    routes: [
        MainRouter,
    ]
})
export class MainModule {

}