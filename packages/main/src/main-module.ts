import express from "express";
import { module } from "@proto/e-serv";
import { LoggerMiddleware } from "./logger-middleware";
import { Logger, prefix_token } from "./logger";

const prefix = "main-proto-ws:";

@module({
    middlewares: [
        { requestHandler: express.json() },
        { requestHandler: express.urlencoded({ extended: false }) },
        { requestHandler: LoggerMiddleware },
    ],
    providers:[
        LoggerMiddleware,
        {
            provide: prefix_token,
            useValue: prefix
        },
        Logger,
    ]
})
export class MainModule {

}